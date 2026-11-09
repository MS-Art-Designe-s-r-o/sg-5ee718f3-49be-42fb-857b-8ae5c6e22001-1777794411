// Úložisko súborov zmlúv a šablón na disku (mimo webu, mimo priečinka aplikácie).
//
// STORAGE_DIR (default ~/etaxi-storage). Priečinky 0700, súbory 0600, súbory sa
// nešifrujú (docs/zmluvy-navrh.md). V DB sa ukladá len RELATÍVNA cesta; pri
// čítaní sa vždy overí, že výsledná cesta leží vnútri koreňa (path traversal).
import { constants as fsConstants, createReadStream, mkdirSync, type ReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { PublicError } from "@/lib/safeLog";
import type { TypZmluvy } from "@/lib/db";

const DIR_MODE = 0o700;
const FILE_MODE = 0o600;
const MAX_SEGMENT = 80;

const MSG_BAD_PATH = "Neplatná cesta k súboru.";

/**
 * Chyby node:fs majú v texte celú cestu (s menom vodiča) — navonok aj do logu
 * pustíme len kód chyby. PublicError prepustí bez zmeny.
 */
function fsError(e: unknown): PublicError {
  if (e instanceof PublicError) return e;
  const code = (e as { code?: unknown } | null)?.code;
  const safe = typeof code === "string" && /^[A-Z0-9_]{1,20}$/.test(code) ? code : "UNKNOWN";
  return new PublicError(`Operácia so súborom zlyhala (${safe}).`, 500);
}

/** Koreň úložiska (absolútna cesta); vytvorí ho s právami 0700, ak neexistuje. */
export function storageRoot(): string {
  const env = (process.env.STORAGE_DIR ?? "").trim();
  const root = path.resolve(env || path.join(os.homedir(), "etaxi-storage"));
  mkdirSync(root, { recursive: true, mode: DIR_MODE });
  return root;
}

/**
 * Bezpečný segment cesty / názvu súboru: zachová diakritiku, odstráni
 * / \ : * ? " < > | a riadiace znaky, „..“, bodky a medzery na okrajoch.
 * Prázdny výsledok → „bez-mena“.
 */
export function safeSegment(name: string | null | undefined): string {
  let t = String(name ?? "")
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[/\\:*?"<>|]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[.\s]+|[.\s]+$/g, "");
  if (t.length > MAX_SEGMENT) t = t.slice(0, MAX_SEGMENT).replace(/[.\s]+$/g, "");
  return t || "bez-mena";
}

/** „Priezvisko-Meno“ (medzery → pomlčky). */
function nameDash(priezvisko: string | null | undefined, meno: string | null | undefined): string {
  const p = safeSegment(priezvisko).replace(/\s+/g, "-");
  const m = safeSegment(meno).replace(/\s+/g, "-");
  return `${p}-${m}`;
}

export type ContractFileNameInput = {
  typ: TypZmluvy;
  /** Dátum uzavretia 'YYYY-MM-DD'. */
  datum: string;
  ecv?: string | null;
  priezvisko: string | null | undefined;
  meno: string | null | undefined;
  verzia: number;
  /** Prípona bez bodky (default "docx"). */
  pripona?: "docx" | "pdf";
};

/**
 * Názov súboru zmluvy:
 *  YYYY-MM-DD_Najomna-zmluva_{EČV}_{Priezvisko-Meno}[_vN].docx
 *  YYYY-MM-DD_Dispecerska-zmluva_{Priezvisko-Meno}[_vN].docx
 * Prípona _vN len pre verziu > 1.
 */
export function contractFileName(p: ContractFileNameInput): string {
  const datum = /^\d{4}-\d{2}-\d{2}$/.test(String(p.datum).slice(0, 10)) ? String(p.datum).slice(0, 10) : "bez-datumu";
  const meno = nameDash(p.priezvisko, p.meno);
  const v = Number.isInteger(p.verzia) && p.verzia > 1 ? `_v${p.verzia}` : "";
  const ext = p.pripona ?? "docx";
  if (p.typ === "NAJOM") {
    const ecv = p.ecv ? safeSegment(p.ecv).replace(/\s+/g, "") : "bez-ECV";
    return `${datum}_Najomna-zmluva_${ecv}_${meno}${v}.${ext}`;
  }
  return `${datum}_Dispecerska-zmluva_${meno}${v}.${ext}`;
}

/** Relatívny priečinok zmlúv vodiča: zmluvy/{Priezvisko Meno}. */
export function contractDir(priezvisko: string | null | undefined, meno: string | null | undefined): string {
  return `zmluvy/${safeSegment(`${priezvisko ?? ""} ${meno ?? ""}`)}`;
}

/** Relatívna cesta šablóny: sablony/{typ}/v{n}_{sha8}.docx */
export function templateRelPath(typ: TypZmluvy, verzia: number, sha256: string): string {
  return `sablony/${typ}/v${verzia}_${String(sha256).slice(0, 8)}.docx`;
}

/**
 * Absolútna cesta pre relatívnu cestu v úložisku. Odmietne absolútne cesty,
 * spätné lomky, nulové bajty a čokoľvek, čo by vyšlo mimo koreňa.
 */
export function resolveSafe(relPath: string): string {
  const rel = String(relPath ?? "");
  if (!rel || rel.includes("\0") || rel.includes("\\") || path.isAbsolute(rel) || /^[A-Za-z]:/.test(rel)) {
    throw new PublicError(MSG_BAD_PATH, 400);
  }
  const root = storageRoot();
  const abs = path.resolve(root, rel);
  if (!abs.startsWith(root + path.sep)) throw new PublicError(MSG_BAD_PATH, 400);
  return abs;
}

function tmpName(abs: string): string {
  return path.join(path.dirname(abs), `.${path.basename(abs)}.${randomBytes(6).toString("hex")}.tmp`);
}

/**
 * Atomický zápis: dočasný súbor (0600) v cieľovom priečinku (0700) + rename.
 * Existujúci súbor sa prepíše. Vráti relatívnu cestu.
 */
export async function writeFileAtomic(relPath: string, buf: Buffer): Promise<string> {
  const abs = resolveSafe(relPath);
  const tmp = tmpName(abs);
  try {
    await fs.mkdir(path.dirname(abs), { recursive: true, mode: DIR_MODE });
    await fs.writeFile(tmp, buf, { mode: FILE_MODE, flag: "wx" });
    await fs.rename(tmp, abs);
  } catch (e) {
    await fs.rm(tmp, { force: true }).catch(() => undefined);
    throw fsError(e);
  }
  return relPath;
}

const isExists = (e: unknown) => (e as { code?: unknown } | null)?.code === "EEXIST";

/**
 * Zápis NOVÉHO súboru bez prepísania existujúceho: ak cieľ existuje, skúsi
 * „_2“, „_3“… pred príponou (napr. dve zmluvy v ten istý deň). Atomicky cez
 * dočasný súbor + hard link (link zlyhá, ak cieľ existuje). Vráti skutočnú
 * relatívnu cestu.
 */
export async function writeNewFile(relPath: string, buf: Buffer, maxAttempts = 50): Promise<string> {
  const first = resolveSafe(relPath);
  const tmp = tmpName(first);
  try {
    await fs.mkdir(path.dirname(first), { recursive: true, mode: DIR_MODE });
    await fs.writeFile(tmp, buf, { mode: FILE_MODE, flag: "wx" });
  } catch (e) {
    await fs.rm(tmp, { force: true }).catch(() => undefined);
    throw fsError(e);
  }
  try {
    const ext = path.posix.extname(relPath);
    const base = relPath.slice(0, relPath.length - ext.length);
    for (let i = 1; i <= maxAttempts; i++) {
      const candidate = i === 1 ? relPath : `${base}_${i}${ext}`;
      const abs = resolveSafe(candidate);
      try {
        await fs.link(tmp, abs);
        return candidate;
      } catch (e) {
        if (isExists(e)) continue;
        const code = (e as { code?: unknown } | null)?.code;
        if (code === "EPERM" || code === "ENOTSUP" || code === "EXDEV" || code === "ENOSYS") {
          // Súborový systém bez hard linkov: exkluzívna kópia (zlyhá, ak cieľ existuje).
          try {
            await fs.copyFile(tmp, abs, fsConstants.COPYFILE_EXCL);
            await fs.chmod(abs, FILE_MODE);
            return candidate;
          } catch (e2) {
            if (isExists(e2)) continue;
            throw fsError(e2);
          }
        }
        throw fsError(e);
      }
    }
    throw new PublicError("Súbor sa nepodarilo uložiť (príliš veľa súborov s rovnakým názvom).");
  } finally {
    await fs.rm(tmp, { force: true }).catch(() => undefined);
  }
}

/** Načíta súbor z úložiska. */
export async function readStored(relPath: string): Promise<Buffer> {
  const abs = resolveSafe(relPath);
  try {
    return await fs.readFile(abs);
  } catch (e) {
    if ((e as { code?: unknown } | null)?.code === "ENOENT") throw new PublicError("Súbor sa nenašiel.", 404);
    throw fsError(e);
  }
}

/** Veľkosť súboru alebo null, ak neexistuje. */
export async function statStored(relPath: string): Promise<{ size: number } | null> {
  try {
    const st = await fs.stat(resolveSafe(relPath));
    return st.isFile() ? { size: st.size } : null;
  } catch (e) {
    if (e instanceof PublicError) throw e;
    return null;
  }
}

/** Stream na čítanie (download). Existenciu over vopred cez statStored. */
export function openStoredStream(relPath: string): ReadStream {
  return createReadStream(resolveSafe(relPath));
}

/** Zmaže súbor (neexistujúci ignoruje). */
export async function removeStored(relPath: string): Promise<void> {
  const abs = resolveSafe(relPath);
  try {
    await fs.rm(abs, { force: true });
  } catch (e) {
    throw fsError(e);
  }
}
