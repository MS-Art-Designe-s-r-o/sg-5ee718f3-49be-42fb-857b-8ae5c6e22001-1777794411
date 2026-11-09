// Služba zmlúv: náhľad, generovanie, regenerácia, zmena stavu, zoznam a súbory.
//
// Postup generovania (docs/zmluvy-navrh.md):
//   loadSnapshotInput → validateSnapshotInput (chýbajúce → 422) → transakcia:
//   aktívna šablóna (inak 409) → pridelenie čísla → INSERT Contract (snapshotEnc = '')
//   → zašifrovanie snapshotu (AAD "snapshot:<contractId>") → render DOCX → zápis
//   súboru → UPDATE Contract → audit CONTRACT_GENERATE → commit.
//   Pri akejkoľvek chybe po zápise sa súbor zmaže a transakcia sa vráti.
//   PDF (voliteľné) sa robí až po commite, aby prevod nedržal transakciu;
//   nedostupné/zlyhané PDF = úspech s DOCX a `pdfVarovanie`.
//
// Všetky závislosti (DB, šablóny, úložisko, šifrovanie, audit, PDF) sú
// injektované cez ServiceDeps — testy podstrčia falošné implementácie.
import { createHash } from "node:crypto";
import { z } from "zod";
import { withTransaction, type ContractRow, type ContractTemplateRow, type StavZmluvy, type TypZmluvy } from "@/lib/db";
import { PublicError } from "@/lib/safeLog";
import { writeAudit, type AuditEntry } from "@/lib/audit";
import { encryptField, maskGeneric, maskRodneCislo } from "@/lib/crypto/fieldCrypto";
import { isRealDate } from "@/lib/subjectFields";
import { connExecutor, poolExecutor, queryFirst, type Executor } from "./executor";
import { allocateContractNumber, CONTRACT_PREFIX } from "./numbering";
import { getPdfConverter, MSG_PDF_UNAVAILABLE, type PdfConverter } from "./pdf";
import { renderDocx, TemplateError } from "./render";
import { buildTemplateData, createSnapshot, loadSnapshotInput, todayIso, type LoadSnapshotParams } from "./snapshot";
import { contractDir, contractFileName, readStored, removeStored, writeNewFile } from "./storage";
import { TAG_CATALOG, TAG_GROUPS } from "./tagCatalog";
import { getActiveTemplate } from "./templates";
import type { ContractInput, SnapshotSource, ValidationMissing, ValidationWarning } from "./types";
import { validateSnapshotInput } from "./validate";

// ── Vstup (zod) ───────────────────────────────────────────────────────────────

const optDate = z
  .string()
  .nullable()
  .optional()
  .transform((v) => (v === undefined || v === null || v.trim() === "" ? null : v.trim()))
  .refine((v) => v === null || isRealDate(v), { message: "Neplatný dátum" });

const optMoney = z.number().min(0).max(1_000_000).nullable().optional();

/** Telo náhľadu aj generovania. Chýbajúce povinné údaje rieši validácia (422), nie zod. */
export const contractInputSchema = z.object({
  typ: z.enum(["NAJOM", "DISPECING"]),
  driverId: z.number().int().positive(),
  vehicleId: z.number().int().positive().nullable().optional(),
  datumUzavretia: optDate,
  platnostOd: optDate,
  platnostDo: optDate,
  najomneSuma: optMoney,
  najomneJednotka: z.enum(["ZMENA", "DEN", "TYZDEN", "MESIAC"]).optional(),
  najomne24h: optMoney,
  kaucia: optMoney,
  spoluucast: optMoney,
  stavKmOdovzdanie: z.number().int().min(0).max(10_000_000).nullable().optional(),
  provizia: z.number().min(0).max(100).nullable().optional(),
  poplatokRegistracny: optMoney,
  miestoPodpisu: z.string().trim().max(100).nullable().optional(),
  formaty: z
    .array(z.enum(["docx", "pdf"]))
    .max(2)
    .optional(),
});

export type ContractRequest = z.infer<typeof contractInputSchema>;

/** Vstup z požiadavky → ContractInput modulu. */
export function toContractInput(b: ContractRequest): ContractInput {
  return {
    datumUzavretia: b.datumUzavretia ?? null,
    platnostOd: b.platnostOd ?? null,
    platnostDo: b.platnostDo ?? null,
    najomneSuma: b.najomneSuma ?? null,
    najomneJednotka: b.najomneJednotka ?? "ZMENA",
    najomne24h: b.najomne24h ?? null,
    kaucia: b.kaucia ?? null,
    spoluucast: b.spoluucast ?? null,
    stavKmOdovzdanie: b.stavKmOdovzdanie ?? null,
    provizia: b.provizia ?? null,
    poplatokRegistracny: b.poplatokRegistracny ?? null,
    miestoPodpisu: b.miestoPodpisu ?? null,
  };
}

// ── Stavy ─────────────────────────────────────────────────────────────────────

const TRANSITIONS: Record<StavZmluvy, StavZmluvy[]> = {
  NAVRH: ["VYGENEROVANA"],
  VYGENEROVANA: ["PODPISANA", "UKONCENA"],
  PODPISANA: ["UKONCENA"],
  UKONCENA: [],
  NAHRADENA: [],
};

/** Povolený prechod stavu zmluvy (NAHRADENA nastavuje len regenerácia). */
export function canTransition(from: StavZmluvy, to: StavZmluvy): boolean {
  return (TRANSITIONS[from] ?? []).includes(to);
}

// ── Chyby ─────────────────────────────────────────────────────────────────────

/** Chýbajú povinné údaje — API vráti 422 { message, chybajuce, varovania }. */
export class MissingDataError extends PublicError {
  readonly chybajuce: ValidationMissing[];
  readonly varovania: ValidationWarning[];
  constructor(chybajuce: ValidationMissing[], varovania: ValidationWarning[]) {
    super("Chýbajú povinné údaje pre zmluvu", 422);
    this.name = "MissingDataError";
    this.chybajuce = chybajuce;
    this.varovania = varovania;
  }
}

// ── Závislosti ────────────────────────────────────────────────────────────────

export type ServiceDeps = {
  /** Executor mimo transakcie (pool). */
  ex: Executor;
  withTransaction: <T>(fn: (tx: Executor) => Promise<T>) => Promise<T>;
  loadInput: (ex: Executor, p: LoadSnapshotParams) => Promise<SnapshotSource | null>;
  getActiveTemplate: (ex: Executor, typ: TypZmluvy) => Promise<ContractTemplateRow | null>;
  /** Čítanie súboru z úložiska (šablóna, vygenerovaný DOCX). */
  readFile: (relPath: string) => Promise<Buffer>;
  render: (template: Buffer, data: Record<string, unknown>) => Buffer;
  /** Zápis nového súboru (bez prepísania); vráti skutočnú relatívnu cestu. */
  writeFile: (relPath: string, buf: Buffer) => Promise<string>;
  removeFile: (relPath: string) => Promise<void>;
  encrypt: (plain: string, aad: string) => string;
  audit: (entry: AuditEntry, tx: Executor) => Promise<void>;
  pdf: PdfConverter;
  /** Dnešný dátum 'YYYY-MM-DD'. */
  today: () => string;
};

export function defaultDeps(): ServiceDeps {
  return {
    ex: poolExecutor,
    withTransaction: (fn) => withTransaction((conn) => fn(connExecutor(conn))),
    loadInput: loadSnapshotInput,
    getActiveTemplate,
    readFile: readStored,
    render: renderDocx,
    writeFile: writeNewFile,
    removeFile: removeStored,
    encrypt: encryptField,
    audit: (entry, tx) => writeAudit(entry, tx),
    pdf: getPdfConverter(),
    today: () => todayIso(),
  };
}

export type Actor = { userId: number | null; ip: string | null };

// ── Náhľad ────────────────────────────────────────────────────────────────────

export type PreviewSection = { nazov: string; polozky: { label: string; hodnota: string }[] };

const SECTION_ORDER: { skupina: string; nazov?: string }[] = [
  { skupina: "zmluva" },
  { skupina: "firma" },
  { skupina: "strana" },
  { skupina: "vodic" },
  { skupina: "flotila" },
  { skupina: "vozidlo" },
];

/**
 * Sekcie náhľadu z tých istých dát ako dokument. RČ a číslo OP LEN ako maska;
 * prázdne skupiny (flotila, vozidlo bez bloku) sa vynechajú.
 */
export function buildPreviewSections(src: SnapshotSource, data: Record<string, unknown>): PreviewSection[] {
  const masked: Record<string, string> = {
    "vodic.rodne_cislo": src.vodic?.rodneCislo ? maskRodneCislo(src.vodic.rodneCislo) : "",
    "vodic.cislo_op": src.vodic?.cisloOp ? maskGeneric(src.vodic.cisloOp) : "",
  };
  const sekcie: PreviewSection[] = [];
  for (const { skupina } of SECTION_ORDER) {
    const obj = data[skupina] as Record<string, unknown> | null | undefined;
    if (!obj || typeof obj !== "object") continue;
    const g = TAG_GROUPS.find((x) => x.id === skupina);
    const polozky = TAG_CATALOG.filter((t) => t.skupina === skupina && !t.blok).map((t) => {
      const field = t.key.slice(skupina.length + 1);
      let hodnota = t.key in masked ? masked[t.key] : String(obj[field] ?? "");
      if (t.key === "zmluva.cislo" && !hodnota) hodnota = "(pridelí sa pri generovaní)";
      return { label: t.label, hodnota };
    });
    sekcie.push({ nazov: g?.nazov ?? skupina, polozky });
  }
  const bloky = TAG_CATALOG.filter((t) => t.blok).map((t) => ({
    label: t.label,
    hodnota: data[t.key] ? "áno" : "nie",
  }));
  sekcie.push({ nazov: TAG_GROUPS.find((g) => g.id === "bloky")?.nazov ?? "Podmienené bloky", polozky: bloky });
  return sekcie;
}

async function loadOrThrow(deps: ServiceDeps, req: ContractRequest): Promise<SnapshotSource> {
  const src = await deps.loadInput(deps.ex, {
    typ: req.typ,
    driverId: req.driverId,
    vehicleId: req.vehicleId ?? null,
    input: toContractInput(req),
    meta: { datumVygenerovania: deps.today() },
  });
  if (!src) throw new PublicError("Vodič neexistuje", 404);
  return src;
}

export async function previewContract(deps: ServiceDeps, req: ContractRequest) {
  const src = await loadOrThrow(deps, req);
  const { chybajuce, varovania } = validateSnapshotInput(src, deps.today());
  const data = buildTemplateData(src);
  return { chybajuce, varovania, nahlad: { sekcie: buildPreviewSections(src, data) } };
}

// ── Generovanie ───────────────────────────────────────────────────────────────

export type GenerateResult = {
  id: number;
  cislo: string;
  verzia: number;
  stav: StavZmluvy;
  hasDocx: boolean;
  hasPdf: boolean;
  pdfVarovanie?: string;
  varovania: ValidationWarning[];
};

const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

type ProduceArgs = {
  src: SnapshotSource;
  cislo: string | null;
  verzia: number;
  nahradzaId: number | null;
  actor: Actor;
};

/**
 * Jadro generovania v transakcii `tx`. Zapísané súbory pridáva do `written`
 * (volajúci ich pri chybe zmaže). Vráti id, číslo a cestu k DOCX.
 */
async function produce(
  deps: ServiceDeps,
  tx: Executor,
  a: ProduceArgs,
  written: string[]
): Promise<{ id: number; cislo: string; docxPath: string; templateId: number }> {
  const { src } = a;
  const i = src.input;
  const tpl = await deps.getActiveTemplate(tx, src.typ);
  if (!tpl) throw new PublicError("Nie je aktívna šablóna pre tento typ", 409);

  let cislo = a.cislo;
  if (!cislo) {
    const rok = Number(String(i.datumUzavretia).slice(0, 4));
    cislo = (await allocateContractNumber(tx, CONTRACT_PREFIX[src.typ], rok)).cislo;
  }

  const fleetId = src.flotila && src.vodic?.fleetId ? src.flotila.id : null;
  const vehicleId = src.typ === "NAJOM" ? src.vozidlo?.id ?? null : null;
  const ins = await tx.execute(
    "INSERT INTO `Contract` (`cislo`, `verzia`, `nahradzaId`, `typ`, `driverId`, `fleetId`, `vehicleId`, `templateId`, " +
      "`datumUzavretia`, `platnostOd`, `platnostDo`, `najomneSuma`, `najomneJednotka`, `najomne24h`, `kaucia`, `spoluucast`, " +
      "`stavKmOdovzdanie`, `provizia`, `poplatokRegistracny`, `stav`, `docxPath`, `snapshotEnc`, `snapshotSha256`, `createdById`) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NAVRH', '', '', '', ?)",
    [
      cislo,
      a.verzia,
      a.nahradzaId,
      src.typ,
      src.vodic?.userId ?? null,
      fleetId,
      vehicleId,
      tpl.id,
      i.datumUzavretia,
      i.platnostOd,
      i.platnostDo,
      i.najomneSuma,
      i.najomneJednotka ?? "ZMENA",
      i.najomne24h,
      i.kaucia,
      i.spoluucast,
      i.stavKmOdovzdanie,
      i.provizia,
      i.poplatokRegistracny,
      a.actor.userId,
    ]
  );
  const id = ins.insertId;

  const snapshot = createSnapshot({ ...src, meta: { ...src.meta, cislo, verzia: a.verzia } });
  const json = JSON.stringify(snapshot);
  const snapshotEnc = deps.encrypt(json, `snapshot:${id}`);

  const docx = deps.render(await deps.readFile(tpl.suborPath), snapshot.znacky);
  const rel = `${contractDir(src.vodic?.priezvisko, src.vodic?.meno)}/${contractFileName({
    typ: src.typ,
    datum: String(i.datumUzavretia),
    ecv: src.vozidlo?.spz ?? null,
    priezvisko: src.vodic?.priezvisko,
    meno: src.vodic?.meno,
    verzia: a.verzia,
  })}`;
  const docxPath = await deps.writeFile(rel, docx);
  written.push(docxPath);

  await tx.execute(
    "UPDATE `Contract` SET `docxPath` = ?, `snapshotEnc` = ?, `snapshotSha256` = ?, `stav` = 'VYGENEROVANA', `templateId` = ? WHERE `id` = ?",
    [docxPath, snapshotEnc, sha256(json), tpl.id, id]
  );
  return { id, cislo, docxPath, templateId: tpl.id };
}

/** Voliteľné PDF po commite — chyba/nedostupnosť je len varovanie. */
async function maybePdf(
  deps: ServiceDeps,
  want: boolean,
  id: number,
  docxPath: string
): Promise<{ hasPdf: boolean; pdfVarovanie?: string }> {
  if (!want) return { hasPdf: false };
  if (!deps.pdf.available) return { hasPdf: false, pdfVarovanie: MSG_PDF_UNAVAILABLE };
  let pdfPath: string | null = null;
  try {
    const docx = await deps.readFile(docxPath);
    const pdf = await deps.pdf.convert(docx);
    pdfPath = await deps.writeFile(docxPath.replace(/\.docx$/i, ".pdf"), pdf);
    await deps.ex.execute("UPDATE `Contract` SET `pdfPath` = ? WHERE `id` = ?", [pdfPath, id]);
    return { hasPdf: true };
  } catch (e) {
    if (pdfPath) await deps.removeFile(pdfPath).catch(() => undefined);
    return {
      hasPdf: false,
      pdfVarovanie: e instanceof PublicError ? e.message : "PDF sa nepodarilo vytvoriť; zmluva je dostupná ako DOCX.",
    };
  }
}

async function cleanup(deps: ServiceDeps, written: string[]) {
  for (const f of written) await deps.removeFile(f).catch(() => undefined);
}

/** Vygeneruje novú zmluvu (verzia 1). */
export async function generateContract(deps: ServiceDeps, req: ContractRequest, actor: Actor): Promise<GenerateResult> {
  const src = await loadOrThrow(deps, req);
  const { chybajuce, varovania } = validateSnapshotInput(src, deps.today());
  if (chybajuce.length) throw new MissingDataError(chybajuce, varovania);

  const formaty = req.formaty?.length ? req.formaty : ["docx"];
  const written: string[] = [];
  let r: Awaited<ReturnType<typeof produce>>;
  try {
    r = await deps.withTransaction(async (tx) => {
      const out = await produce(deps, tx, { src, cislo: null, verzia: 1, nahradzaId: null, actor }, written);
      await deps.audit(
        {
          userId: actor.userId,
          action: "CONTRACT_GENERATE",
          entity: "Contract",
          entityId: out.id,
          ip: actor.ip,
          meta: { typ: src.typ, cislo: out.cislo, verzia: 1, templateId: out.templateId, formaty },
        },
        tx
      );
      return out;
    });
  } catch (e) {
    await cleanup(deps, written);
    throw e;
  }

  const pdf = await maybePdf(deps, formaty.includes("pdf"), r.id, r.docxPath);
  return { id: r.id, cislo: r.cislo, verzia: 1, stav: "VYGENEROVANA", hasDocx: true, ...pdf, varovania };
}

/**
 * Regenerácia: nový riadok s rovnakým číslom, verzia+1, `nahradzaId`, AKTUÁLNE
 * údaje a AKTUÁLNA aktívna šablóna; pôvodný riadok → NAHRADENA (súbory ostávajú).
 */
export async function regenerateContract(
  deps: ServiceDeps,
  id: number,
  actor: Actor,
  opts: { formaty?: ("docx" | "pdf")[] } = {}
): Promise<GenerateResult> {
  const old = await queryFirst<ContractRow>(deps.ex, "SELECT * FROM `Contract` WHERE `id` = ?", [id]);
  if (!old) throw new PublicError("Zmluva neexistuje", 404);
  if (old.stav === "NAHRADENA" || old.stav === "UKONCENA") {
    throw new PublicError("Nahradenú ani ukončenú zmluvu nemožno regenerovať", 409);
  }

  const d = (v: string | null) => (v ? String(v).slice(0, 10) : null);
  const n = (v: unknown) => (v === null || v === undefined ? null : Number(v));
  const req: ContractRequest = {
    typ: old.typ,
    driverId: old.driverId,
    vehicleId: old.vehicleId,
    datumUzavretia: d(old.datumUzavretia),
    platnostOd: d(old.platnostOd),
    platnostDo: d(old.platnostDo),
    najomneSuma: n(old.najomneSuma),
    najomneJednotka: old.najomneJednotka,
    najomne24h: n(old.najomne24h),
    kaucia: n(old.kaucia),
    spoluucast: n(old.spoluucast),
    stavKmOdovzdanie: n(old.stavKmOdovzdanie),
    provizia: n(old.provizia),
    poplatokRegistracny: n(old.poplatokRegistracny),
    formaty: opts.formaty,
  };
  const src = await loadOrThrow(deps, req);
  const { chybajuce, varovania } = validateSnapshotInput(src, deps.today());
  if (chybajuce.length) throw new MissingDataError(chybajuce, varovania);

  const formaty = opts.formaty?.length ? opts.formaty : old.pdfPath ? ["docx", "pdf"] : ["docx"];
  const written: string[] = [];
  let r: Awaited<ReturnType<typeof produce>> & { verzia: number };
  try {
    r = await deps.withTransaction(async (tx) => {
      const cur = await queryFirst<{ stav: StavZmluvy }>(tx, "SELECT `stav` FROM `Contract` WHERE `id` = ? FOR UPDATE", [id]);
      if (!cur || cur.stav === "NAHRADENA" || cur.stav === "UKONCENA") {
        throw new PublicError("Zmluvu medzičasom zmenil niekto iný", 409);
      }
      const max = await queryFirst<{ v: number | null }>(
        tx,
        "SELECT MAX(`verzia`) AS `v` FROM `Contract` WHERE `cislo` = ? FOR UPDATE",
        [old.cislo]
      );
      const verzia = (Number(max?.v) || old.verzia) + 1;
      const out = await produce(deps, tx, { src, cislo: old.cislo, verzia, nahradzaId: old.id, actor }, written);
      await tx.execute("UPDATE `Contract` SET `stav` = 'NAHRADENA' WHERE `id` = ?", [old.id]);
      await deps.audit(
        {
          userId: actor.userId,
          action: "CONTRACT_REGENERATE",
          entity: "Contract",
          entityId: out.id,
          ip: actor.ip,
          meta: { cislo: out.cislo, verzia, nahradzaId: old.id, templateId: out.templateId, formaty },
        },
        tx
      );
      return { ...out, verzia };
    });
  } catch (e) {
    await cleanup(deps, written);
    throw e;
  }

  const pdf = await maybePdf(deps, formaty.includes("pdf"), r.id, r.docxPath);
  return { id: r.id, cislo: r.cislo, verzia: r.verzia, stav: "VYGENEROVANA", hasDocx: true, ...pdf, varovania };
}

// ── Stav ──────────────────────────────────────────────────────────────────────

export async function changeStatus(
  deps: ServiceDeps,
  id: number,
  na: StavZmluvy,
  actor: Actor
): Promise<{ id: number; stav: StavZmluvy; podpisanaDna: string | null; ukoncenaDna: string | null }> {
  return deps.withTransaction(async (tx) => {
    const cur = await queryFirst<{ stav: StavZmluvy; podpisanaDna: string | null; ukoncenaDna: string | null }>(
      tx,
      "SELECT `stav`, `podpisanaDna`, `ukoncenaDna` FROM `Contract` WHERE `id` = ? FOR UPDATE",
      [id]
    );
    if (!cur) throw new PublicError("Zmluva neexistuje", 404);
    if (!canTransition(cur.stav, na)) throw new PublicError("Tento prechod stavu nie je povolený", 409);
    const dnes = deps.today();
    const podpisanaDna = na === "PODPISANA" ? dnes : cur.podpisanaDna ? String(cur.podpisanaDna).slice(0, 10) : null;
    const ukoncenaDna = na === "UKONCENA" ? dnes : cur.ukoncenaDna ? String(cur.ukoncenaDna).slice(0, 10) : null;
    await tx.execute("UPDATE `Contract` SET `stav` = ?, `podpisanaDna` = ?, `ukoncenaDna` = ? WHERE `id` = ?", [
      na,
      podpisanaDna,
      ukoncenaDna,
      id,
    ]);
    await deps.audit(
      {
        userId: actor.userId,
        action: "CONTRACT_STATUS",
        entity: "Contract",
        entityId: id,
        ip: actor.ip,
        meta: { z: cur.stav, na },
      },
      tx
    );
    return { id, stav: na, podpisanaDna, ukoncenaDna };
  });
}

// ── Zoznam a súbory ───────────────────────────────────────────────────────────

export type ContractListItem = {
  id: number;
  cislo: string;
  verzia: number;
  typ: TypZmluvy;
  stav: StavZmluvy;
  datumUzavretia: string;
  platnostOd: string;
  platnostDo: string | null;
  vozidloEcv: string | null;
  hasDocx: boolean;
  hasPdf: boolean;
  nahradzaId: number | null;
  createdAt: string;
};

/** Zmluvy vodiča (bez snapshotu a ciest k súborom). */
export async function listContracts(ex: Executor, driverId: number): Promise<ContractListItem[]> {
  const rows = await ex.query<{
    id: number;
    cislo: string;
    verzia: number;
    typ: TypZmluvy;
    stav: StavZmluvy;
    datumUzavretia: string;
    platnostOd: string;
    platnostDo: string | null;
    ecv: string | null;
    docxPath: string | null;
    pdfPath: string | null;
    nahradzaId: number | null;
    createdAt: string;
  }>(
    "SELECT c.`id`, c.`cislo`, c.`verzia`, c.`typ`, c.`stav`, c.`datumUzavretia`, c.`platnostOd`, c.`platnostDo`, " +
      "v.`spz` AS `ecv`, c.`docxPath`, c.`pdfPath`, c.`nahradzaId`, c.`createdAt` " +
      "FROM `Contract` c LEFT JOIN `Vehicle` v ON v.`id` = c.`vehicleId` " +
      "WHERE c.`driverId` = ? ORDER BY c.`createdAt` DESC, c.`id` DESC",
    [driverId]
  );
  const d = (v: string | null) => (v ? String(v).slice(0, 10) : null);
  return rows.map((r) => ({
    id: r.id,
    cislo: r.cislo,
    verzia: Number(r.verzia),
    typ: r.typ,
    stav: r.stav,
    datumUzavretia: d(r.datumUzavretia) ?? "",
    platnostOd: d(r.platnostOd) ?? "",
    platnostDo: d(r.platnostDo),
    vozidloEcv: r.ecv ?? null,
    hasDocx: !!r.docxPath,
    hasPdf: !!r.pdfPath,
    nahradzaId: r.nahradzaId ?? null,
    createdAt: r.createdAt,
  }));
}

/** Relatívna cesta a názov súboru zmluvy pre download (alebo null, ak formát chýba). */
export async function getContractFile(
  ex: Executor,
  id: number,
  format: "docx" | "pdf"
): Promise<{ relPath: string; fileName: string; typ: TypZmluvy } | null> {
  const r = await queryFirst<{ docxPath: string | null; pdfPath: string | null; typ: TypZmluvy }>(
    ex,
    "SELECT `docxPath`, `pdfPath`, `typ` FROM `Contract` WHERE `id` = ?",
    [id]
  );
  if (!r) return null;
  const rel = format === "pdf" ? r.pdfPath : r.docxPath;
  if (!rel) return null;
  return { relPath: rel, fileName: rel.split("/").pop() || `zmluva.${format}`, typ: r.typ };
}

// ── Odpovede API ──────────────────────────────────────────────────────────────

/**
 * Pošle známe chyby služby s detailmi (422 chýbajúce údaje, chyby šablóny).
 * Vráti true, ak odpoveď odoslala; inak volajúci chybu ďalej vyhodí.
 */
export function sendServiceError(
  res: { status: (c: number) => { json: (b: unknown) => unknown } },
  e: unknown
): boolean {
  if (e instanceof MissingDataError) {
    res.status(422).json({ message: e.message, chybajuce: e.chybajuce, varovania: e.varovania });
    return true;
  }
  if (e instanceof TemplateError) {
    res.status(e.status).json({ message: e.message, chyby: e.chyby });
    return true;
  }
  return false;
}
