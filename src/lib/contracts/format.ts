// Formátovanie hodnôt do zmlúv (čisté funkcie, bez DB).
//
// Dátum dd.mm.rrrr, suma „1 234,50 €“, percentá „15 %“, číslo „1 234,5“.
// Intl ('sk-SK') oddeľuje tisícky nezlomiteľnou medzerou (U+00A0 / U+202F) —
// do dokumentu dávame obyčajnú medzeru, aby sa text dal hľadať a kopírovať.
// Chyby nikdy neobsahujú formátovanú hodnotu.

const NBSP_RE = /[  ]/g;

const MONEY = new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR" });

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Prázdna hodnota (null, undefined, prázdny reťazec). */
function isBlank(v: unknown): boolean {
  return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
}

/** Prevod na konečné číslo; inak null (reťazec s desatinnou čiarkou je povolený). */
function toNumber(v: unknown): number | null {
  if (isBlank(v)) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/\s+/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/**
 * Dátum vo formáte dd.mm.rrrr. Vstup 'YYYY-MM-DD' (aj s časom za ním, ako ho
 * vracia mysql2 s dateStrings) alebo Date (lokálny dátum). Prázdne → "".
 */
export function formatDate(v: string | Date | null | undefined): string {
  if (v === null || v === undefined || v === "") return "";
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) throw new RangeError("Neplatný dátum.");
    return `${pad2(v.getDate())}.${pad2(v.getMonth() + 1)}.${v.getFullYear()}`;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v).trim());
  if (!m) throw new RangeError("Neplatný dátum.");
  const [, y, mo, d] = m;
  const dt = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
  if (dt.getUTCFullYear() !== Number(y) || dt.getUTCMonth() !== Number(mo) - 1 || dt.getUTCDate() !== Number(d)) {
    throw new RangeError("Neplatný dátum.");
  }
  return `${d}.${mo}.${y}`;
}

/** Suma v eurách „1 234,50 €“ (vždy 2 desatinné miesta). Prázdne → "". */
export function formatMoney(v: number | string | null | undefined): string {
  if (isBlank(v)) return "";
  const n = toNumber(v);
  if (n === null) throw new RangeError("Neplatná suma.");
  return MONEY.format(n).replace(NBSP_RE, " ");
}

/** Číslo bez meny („1 234“, „1 234,5“). `maxDecimals` default 2. Prázdne → "". */
export function formatNumber(v: number | string | null | undefined, maxDecimals = 2): string {
  if (isBlank(v)) return "";
  const n = toNumber(v);
  if (n === null) throw new RangeError("Neplatné číslo.");
  return new Intl.NumberFormat("sk-SK", { maximumFractionDigits: maxDecimals })
    .format(n)
    .replace(NBSP_RE, " ");
}

/** Percentá „15 %“, „12,5 %“ (vstup v percentách, nie podiel). Prázdne → "". */
export function formatPercent(v: number | string | null | undefined): string {
  if (isBlank(v)) return "";
  return `${formatNumber(v, 2)} %`;
}
