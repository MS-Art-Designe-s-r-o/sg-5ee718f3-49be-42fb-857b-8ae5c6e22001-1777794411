// Čisté validačné a normalizačné funkcie profilu vodiča (bez DB, testovateľné).
// Chybové výstupy obsahujú len NÁZVY polí, nikdy hodnoty.
import type { DriverRezim, StranaTyp } from "./db";

/** Odstráni biele znaky a prevedie na veľké písmená. */
function compactUpper(v: string): string {
  return String(v ?? "").replace(/\s+/g, "").toUpperCase();
}

// ── IBAN ──────────────────────────────────────────────────────────────────────

/** Dĺžky IBAN pre bežné krajiny (ostatné: všeobecne 15–34 znakov). */
const IBAN_LENGTHS: Record<string, number> = {
  SK: 24, CZ: 24, AT: 20, DE: 22, HU: 28, PL: 28, UA: 29, GB: 22, FR: 27, IT: 27,
  ES: 24, NL: 18, BE: 16, CH: 21, LT: 20, LV: 21, EE: 20, SI: 19, HR: 21, RO: 24,
  BG: 22, IE: 22, PT: 25, LU: 20, FI: 18, DK: 18, SE: 24, NO: 15,
};

export function normalizeIban(v: string): string {
  return compactUpper(v);
}

/** Kontrola formátu, dĺžky podľa krajiny a kontrolných číslic (mod 97 = 1). */
export function validateIban(normalized: string): boolean {
  const s = normalized;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const expected = IBAN_LENGTHS[s.slice(0, 2)];
  if (expected !== undefined && s.length !== expected) return false;
  const rearranged = s.slice(4) + s.slice(0, 4);
  let rem = 0;
  for (const ch of rearranged) {
    const code = ch.charCodeAt(0);
    const digits = code >= 65 ? String(code - 55) : ch; // A=10 … Z=35
    for (const d of digits) rem = (rem * 10 + (d.charCodeAt(0) - 48)) % 97;
  }
  return rem === 1;
}

// ── IČO / DIČ / IČ DPH / číslo OP ─────────────────────────────────────────────

/** IČO: 8 číslic po odstránení medzier; inak null. */
export function normalizeIco(v: string): string | null {
  const s = compactUpper(v);
  return /^\d{8}$/.test(s) ? s : null;
}

/** DIČ: 10 číslic po odstránení medzier; inak null. */
export function normalizeDic(v: string): string | null {
  const s = compactUpper(v);
  return /^\d{10}$/.test(s) ? s : null;
}

/** IČ DPH: „SK" + 10 číslic; inak null. */
export function normalizeIcDph(v: string): string | null {
  const s = compactUpper(v);
  return /^SK\d{10}$/.test(s) ? s : null;
}

/** Číslo dokladu totožnosti: 5–20 písmen/číslic po odstránení medzier; inak null. */
export function normalizeCisloOp(v: string): string | null {
  const s = compactUpper(v);
  return /^[A-Z0-9]{5,20}$/.test(s) ? s : null;
}

// ── Povinné polia podľa režimu ────────────────────────────────────────────────

export type RezimFields = {
  rezim: DriverRezim | null;
  stranaTyp: StranaTyp | null;
  firmaObchodneMeno: string | null;
  firmaIco: string | null;
  firmaDic: string | null;
  cisloKoncesie: string | null;
};

const empty = (v: string | null | undefined) => v === null || v === undefined || String(v).trim() === "";

/**
 * Názvy povinných polí, ktoré chýbajú pre daný režim:
 *  - VLASTNA_KONCESIA (SZČO aj právnická osoba): firmaIco, firmaDic, cisloKoncesie,
 *  - navyše pri PRAVNICKA_OSOBA: firmaObchodneMeno.
 * IČ DPH je vždy voliteľné.
 */
export function missingForRezim(p: RezimFields): string[] {
  const missing: string[] = [];
  if (p.rezim !== "VLASTNA_KONCESIA") return missing;
  if (p.stranaTyp === "PRAVNICKA_OSOBA" && empty(p.firmaObchodneMeno)) missing.push("firmaObchodneMeno");
  if (empty(p.firmaIco)) missing.push("firmaIco");
  if (empty(p.firmaDic)) missing.push("firmaDic");
  if (empty(p.cisloKoncesie)) missing.push("cisloKoncesie");
  return missing;
}
