// Šablóny zmlúv: kontrola nahratého DOCX (čistá funkcia) a DB operácie
// (zoznam, nahratie novej verzie, aktivácia). DB prístup cez injektovaný executor.
//
// Unikátnosť aktívnej šablóny na typ zaručuje generovaný stĺpec `aktivnaTyp`
// s UNIQUE indexom — pri aktivácii sa preto NAJPRV deaktivujú ostatné.
import { createHash } from "node:crypto";
import { inflateRawSync } from "node:zlib";
import PizZip from "pizzip";
import type { ContractTemplateRow, TypZmluvy } from "@/lib/db";
import { PublicError } from "@/lib/safeLog";
import { queryFirst, type Executor } from "./executor";
import { inspectTemplate, TemplateError } from "./render";
import { removeStored, templateRelPath, writeFileAtomic } from "./storage";

export const MAX_TEMPLATE_BYTES = 5 * 1024 * 1024;

const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

/** Limity po rozbalení (ochrana pred „zip bombou“). */
export const MAX_ENTRY_UNCOMPRESSED = 20 * 1024 * 1024;
export const MAX_TOTAL_UNCOMPRESSED = 60 * 1024 * 1024;
const MAX_ENTRIES = 1000;

type ZipEntryData = { compressionMethod?: string; getCompressedContent?: () => Uint8Array | string };

/**
 * Overí skutočnú veľkosť po rozbalení každej položky ZIP (nie údaj z hlavičky,
 * ten môže klamať): DEFLATE sa rozbaľuje s pevným stropom výstupu.
 * Prekročenie / neznáma kompresia → PublicError 400.
 */
export function assertZipSize(zip: PizZip): void {
  const tooBig = () => new PublicError("Súbor je po rozbalení príliš veľký.", 400);
  const files = Object.values(zip.files).filter((f) => !f.dir);
  if (files.length > MAX_ENTRIES) throw tooBig();
  let total = 0;
  for (const f of files) {
    const data = (f as unknown as { _data?: ZipEntryData })._data;
    if (!data || typeof data.getCompressedContent !== "function") {
      throw new PublicError("Súbor nie je platný DOCX (ZIP) dokument.", 400);
    }
    const raw = data.getCompressedContent();
    const comp = typeof raw === "string" ? Buffer.from(raw, "binary") : Buffer.from(raw);
    let size: number;
    if (data.compressionMethod === "\x00\x00") size = comp.length;
    else if (data.compressionMethod === "\x08\x00") {
      try {
        size = inflateRawSync(comp, { maxOutputLength: MAX_ENTRY_UNCOMPRESSED }).length;
      } catch (e) {
        if ((e as { code?: unknown } | null)?.code === "ERR_BUFFER_TOO_LARGE" || e instanceof RangeError) throw tooBig();
        throw new PublicError("Súbor nie je platný DOCX (ZIP) dokument.", 400);
      }
    } else throw new PublicError("Súbor nie je platný DOCX (ZIP) dokument.", 400);
    if (size > MAX_ENTRY_UNCOMPRESSED) throw tooBig();
    total += size;
    if (total > MAX_TOTAL_UNCOMPRESSED) throw tooBig();
  }
}

/** Dekóduje base64 (aj „data:…;base64,“). Neplatný reťazec → PublicError 400. */
export function decodeBase64Upload(data: string): Buffer {
  const b64 = String(data ?? "")
    .replace(/^data:[^;,]*;base64,/, "")
    .replace(/\s+/g, "");
  if (!b64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(b64)) throw new PublicError("Súbor nie je platne zakódovaný (base64).", 400);
  return Buffer.from(b64, "base64");
}

export type TemplateUploadCheck = {
  sha256: string;
  /** Značky šablóny (ukladajú sa do ContractTemplate.tagy). */
  tagy: string[];
  /** Neznáme značky — šablónu možno nahrať, ale v dokumente ostanú prázdne. */
  varovania: string[];
};

/**
 * Overí nahratú šablónu: veľkosť (≤ 5 MB), ZIP hlavička PK\x03\x04, PizZip ju
 * otvorí, obsahuje word/document.xml a docxtemplater ju skompiluje.
 * Chyby šablóny → TemplateError 400 so zoznamom značiek; neznáme značky → varovania.
 */
export function validateTemplateUpload(buf: Buffer): TemplateUploadCheck {
  if (!buf || !buf.length) throw new PublicError("Súbor je prázdny.", 400);
  if (buf.length > MAX_TEMPLATE_BYTES) throw new PublicError("Súbor je väčší ako 5 MB.", 400);
  if (!buf.subarray(0, 4).equals(ZIP_MAGIC)) throw new PublicError("Súbor nie je DOCX dokument.", 400);
  let zip: PizZip;
  try {
    zip = new PizZip(buf);
  } catch {
    throw new PublicError("Súbor nie je platný DOCX (ZIP) dokument.", 400);
  }
  if (!zip.file("word/document.xml")) throw new PublicError("Súbor nie je dokument Word (chýba word/document.xml).", 400);
  assertZipSize(zip);

  const ins = inspectTemplate(buf);
  if (ins.chyby?.length) {
    throw new TemplateError(`Šablóna obsahuje chyby: ${ins.chyby.join("; ")}`, ins.chyby, 400);
  }
  // {@značka} vkladá hodnotu ako surové XML (údaje vodiča by mohli meniť štruktúru dokumentu).
  const raw = ins.tagy.filter((t) => t.startsWith("@"));
  if (raw.length) {
    const chyby = raw.map((t) => `raw_xml_nepovolene: ${t}`);
    throw new TemplateError(`Šablóna obsahuje chyby: ${chyby.join("; ")}`, chyby, 400);
  }
  return {
    sha256: createHash("sha256").update(buf).digest("hex"),
    tagy: ins.tagy,
    varovania: ins.neznameTagy,
  };
}

// ── DB ────────────────────────────────────────────────────────────────────────

export type TemplateListItem = {
  id: number;
  typ: TypZmluvy;
  nazov: string;
  verzia: number;
  platnaOd: string;
  aktivna: boolean;
  pocetZmluv: number;
  createdAt: string;
};

/** Zoznam verzií šablón (bez cesty k súboru) s počtom použitých zmlúv. */
export async function listTemplates(ex: Executor): Promise<TemplateListItem[]> {
  const rows = await ex.query<{
    id: number;
    typ: TypZmluvy;
    nazov: string;
    verzia: number;
    platnaOd: string;
    aktivna: number;
    createdAt: string;
    pocetZmluv: number | string;
  }>(
    "SELECT t.`id`, t.`typ`, t.`nazov`, t.`verzia`, t.`platnaOd`, t.`aktivna`, t.`createdAt`, " +
      "(SELECT COUNT(*) FROM `Contract` c WHERE c.`templateId` = t.`id`) AS `pocetZmluv` " +
      "FROM `ContractTemplate` t ORDER BY t.`typ` ASC, t.`verzia` DESC"
  );
  return rows.map((r) => ({
    id: r.id,
    typ: r.typ,
    nazov: r.nazov,
    verzia: Number(r.verzia),
    platnaOd: String(r.platnaOd).slice(0, 10),
    aktivna: Number(r.aktivna) === 1,
    pocetZmluv: Number(r.pocetZmluv) || 0,
    createdAt: r.createdAt,
  }));
}

export async function getTemplate(ex: Executor, id: number): Promise<ContractTemplateRow | null> {
  return queryFirst<ContractTemplateRow>(ex, "SELECT * FROM `ContractTemplate` WHERE `id` = ?", [id]);
}

/** Aktívna šablóna typu (alebo null). */
export async function getActiveTemplate(ex: Executor, typ: TypZmluvy): Promise<ContractTemplateRow | null> {
  return queryFirst<ContractTemplateRow>(
    ex,
    "SELECT * FROM `ContractTemplate` WHERE `typ` = ? AND `aktivna` = 1 ORDER BY `verzia` DESC LIMIT 1",
    [typ]
  );
}

export type CreateTemplateInput = {
  typ: TypZmluvy;
  nazov: string;
  platnaOd: string;
  buffer: Buffer;
  check: TemplateUploadCheck;
  userId: number | null;
};

/** Závislosti pre testy (zápis/mazanie súboru). */
export type TemplateFileDeps = {
  write: (rel: string, buf: Buffer) => Promise<string>;
  remove: (rel: string) => Promise<void>;
};

const defaultFileDeps: TemplateFileDeps = { write: writeFileAtomic, remove: removeStored };

/**
 * Uloží novú verziu šablóny (neaktívnu). Volať v transakcii (`tx` nad spojením):
 * verzia = MAX(verzia)+1 pre typ (zámok FOR UPDATE), súbor sablony/{typ}/v{n}_{sha8}.docx.
 * Ak zlyhá INSERT, súbor sa zmaže (pri neskoršom zlyhaní transakcie ho zmaže
 * volajúci podľa vráteného `suborPath`). Vráti id, verziu a relatívnu cestu.
 */
export async function createTemplate(
  tx: Executor,
  inp: CreateTemplateInput,
  deps: TemplateFileDeps = defaultFileDeps
): Promise<{ id: number; verzia: number; suborPath: string }> {
  const max = await queryFirst<{ v: number | null }>(
    tx,
    "SELECT MAX(`verzia`) AS `v` FROM `ContractTemplate` WHERE `typ` = ? FOR UPDATE",
    [inp.typ]
  );
  const verzia = (Number(max?.v) || 0) + 1;
  const rel = templateRelPath(inp.typ, verzia, inp.check.sha256);
  await deps.write(rel, inp.buffer);
  try {
    const r = await tx.execute(
      "INSERT INTO `ContractTemplate` (`typ`, `nazov`, `verzia`, `suborPath`, `sha256`, `platnaOd`, `aktivna`, `tagy`, `createdById`) " +
        "VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)",
      [inp.typ, inp.nazov, verzia, rel, inp.check.sha256, inp.platnaOd, JSON.stringify(inp.check.tagy), inp.userId]
    );
    return { id: r.insertId, verzia, suborPath: rel };
  } catch (e) {
    await deps.remove(rel).catch(() => undefined);
    throw e;
  }
}

/**
 * Aktivuje šablónu a deaktivuje ostatné rovnakého typu (v transakcii).
 * Vráti typ a verziu, alebo null ak šablóna neexistuje.
 */
export async function activateTemplate(
  tx: Executor,
  id: number
): Promise<{ typ: TypZmluvy; verzia: number; zmena: boolean } | null> {
  const t = await queryFirst<{ typ: TypZmluvy; verzia: number; aktivna: number }>(
    tx,
    "SELECT `typ`, `verzia`, `aktivna` FROM `ContractTemplate` WHERE `id` = ? FOR UPDATE",
    [id]
  );
  if (!t) return null;
  if (Number(t.aktivna) === 1) return { typ: t.typ, verzia: Number(t.verzia), zmena: false };
  // Poradie je dôležité: UNIQUE(aktivnaTyp) nedovolí dve aktívne naraz.
  await tx.execute("UPDATE `ContractTemplate` SET `aktivna` = 0 WHERE `typ` = ? AND `aktivna` = 1 AND `id` <> ?", [
    t.typ,
    id,
  ]);
  await tx.execute("UPDATE `ContractTemplate` SET `aktivna` = 1 WHERE `id` = ?", [id]);
  return { typ: t.typ, verzia: Number(t.verzia), zmena: true };
}
