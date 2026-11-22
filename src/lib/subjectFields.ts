// Spoločná validácia údajov subjektov (firma E-TAXI, flotily): čisté funkcie bez DB.
// Chybové výstupy obsahujú len NÁZVY polí, nikdy hodnoty.
import { z } from "zod";
import { normalizeDic, normalizeIban, normalizeIcDph, normalizeIco, validateIban } from "./driverProfile";

/** Text: vynechané = undefined (nemeniť), null alebo "" = null (vymazať). */
export const optText = (max: number) =>
  z
    .string()
    .max(max)
    .nullable()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === null ? null : v.trim() || null));

/** Dátum v tvare RRRR-MM-DD, ktorý naozaj existuje. */
export function isRealDate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** Jednoduchá kontrola formátu e-mailu (max 191 znakov, ako v DB). */
export function isValidEmail(v: string): boolean {
  const s = v.trim();
  return s.length <= 191 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

export type FieldKind = "ico" | "dic" | "icDph" | "iban" | "email";

const NORMALIZERS: Record<FieldKind, (v: string) => string | null> = {
  ico: normalizeIco,
  dic: normalizeDic,
  icDph: normalizeIcDph,
  iban: (v) => {
    const n = normalizeIban(v);
    return validateIban(n) ? n : null;
  },
  email: (v) => (isValidEmail(v) ? v.trim() : null),
};

/**
 * Normalizuje a validuje vybrané polia podľa druhu. `undefined` = nemeniť,
 * `null` = vymazať, inak normalizovaná hodnota; neplatné pole ide do `invalid`.
 */
export function normalizeKinds(
  body: Record<string, string | null | undefined>,
  kinds: Record<string, FieldKind>
): { set: Record<string, string | null>; invalid: string[] } {
  const set: Record<string, string | null> = {};
  const invalid: string[] = [];
  for (const [field, kind] of Object.entries(kinds)) {
    const v = body[field];
    if (v === undefined) continue;
    if (v === null) {
      set[field] = null;
      continue;
    }
    const n = NORMALIZERS[kind](v);
    if (n === null) invalid.push(field);
    else set[field] = n;
  }
  return { set, invalid };
}

/** MySQL chyba duplicitného kľúča. */
export function isDupEntry(e: unknown): boolean {
  return (e as { code?: unknown } | null)?.code === "ER_DUP_ENTRY";
}
