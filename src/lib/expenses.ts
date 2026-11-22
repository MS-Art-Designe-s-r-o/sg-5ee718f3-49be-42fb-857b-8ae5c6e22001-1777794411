// Pomocníky pre výdavky: predvolené kategórie, intervaly pravidelných výdavkov
// a rozvinutie pravidelného predpisu do počtu výskytov v danom období.

export type ExpenseInterval = "TYZDENNE" | "MESACNE" | "STVRTROCNE" | "POLROCNE" | "ROCNE";

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Lízing",
  "Poistenie",
  "Administratíva",
  "Servis",
  "Telefón",
  "Marketing",
  "Plat spoločníka",
  "Odvody",
];

export const INTERVAL_LABELS: Record<ExpenseInterval, string> = {
  TYZDENNE: "Týždenne",
  MESACNE: "Mesačne",
  STVRTROCNE: "Štvrťročne",
  POLROCNE: "Polročne",
  ROCNE: "Ročne",
};

function parseYmd(s: string): Date {
  return new Date(`${s.slice(0, 10)}T00:00:00.000Z`);
}

/** Počet dní v mesiaci (0-indexovaný mesiac). */
function daysInMonth(year: number, month0: number): number {
  return new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
}

/** Počet mesiacov medzi výskytmi pri mesačných intervaloch (0 = týždenne). */
function stepMonths(interval: ExpenseInterval): number {
  switch (interval) {
    case "MESACNE": return 1;
    case "STVRTROCNE": return 3;
    case "POLROCNE": return 6;
    case "ROCNE": return 12;
    default: return 0; // TYZDENNE
  }
}

/**
 * k-ty výskyt (k = 0, 1, 2, …) počítaný VŽDY z pôvodného dátumu — bez
 * kumulatívneho posunu. Deň v mesiaci sa zachová (ukotví) a pri kratších
 * mesiacoch sa oreže na posledný deň mesiaca. Tým sa mesačný výdavok
 * so splatnosťou napr. 31. nestratí v 30-dňových mesiacoch.
 */
function nthOccurrence(start: Date, interval: ExpenseInterval, k: number): Date {
  const months = stepMonths(interval);
  if (months === 0) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + 7 * k); // TYZDENNE
    return d;
  }
  const totalMonths = start.getUTCMonth() + months * k;
  const year = start.getUTCFullYear() + Math.floor(totalMonths / 12);
  const month0 = ((totalMonths % 12) + 12) % 12;
  const day = Math.min(start.getUTCDate(), daysInMonth(year, month0));
  return new Date(Date.UTC(year, month0, day));
}

/**
 * Počet výskytov výdavku v období [from, to].
 * - jednorazový: 1 ak datum spadá do obdobia, inak 0
 * - pravidelný: počet výskytov (datum, datum+interval, ...) v období
 */
export function occurrencesInRange(
  datumStr: string,
  pravidelny: boolean,
  interval: ExpenseInterval | null,
  from: Date,
  to: Date
): number {
  const start = parseYmd(datumStr);
  if (!pravidelny || !interval) {
    return start.getTime() >= from.getTime() && start.getTime() <= to.getTime() ? 1 : 0;
  }
  let count = 0;
  // Výskyty sú rastúce; počítame ich priamo z pôvodného dátumu (žiadny drift).
  for (let k = 0; k < 100000; k++) {
    const d = nthOccurrence(start, interval, k);
    if (d.getTime() > to.getTime()) break;
    if (d.getTime() >= from.getTime()) count++;
  }
  return count;
}

/**
 * Zoznam dátumov (YYYY-MM-DD) výskytov výdavku v období [from, to].
 * Pre jednorazový vráti [datum] ak spadá do obdobia, inak [].
 */
export function occurrenceDatesInRange(
  datumStr: string,
  pravidelny: boolean,
  interval: ExpenseInterval | null,
  from: Date,
  to: Date
): string[] {
  const start = parseYmd(datumStr);
  if (!pravidelny || !interval) {
    return start.getTime() >= from.getTime() && start.getTime() <= to.getTime()
      ? [start.toISOString().slice(0, 10)]
      : [];
  }
  const out: string[] = [];
  for (let k = 0; k < 100000; k++) {
    const d = nthOccurrence(start, interval, k);
    if (d.getTime() > to.getTime()) break;
    if (d.getTime() >= from.getTime()) out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/** Posledný deň mesiaca daného dátumu (UTC). */
function endOfMonthUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
}

/**
 * Dátumy výskytov výdavku, ktoré sa majú v období [from, to] ZOBRAZIŤ:
 * - jednorazový: dátum, ak spadá do obdobia (bez obmedzenia budúcnosťou),
 * - pravidelný: výskyty v období, ale najviac po koniec aktuálneho mesiaca
 *   (budúce mesiace sa nezobrazujú) a po koniec predpisu `datumDo` (ak je).
 */
export function visibleOccurrenceDates(
  e: { datum: string; pravidelny: boolean; interval: ExpenseInterval | null; datumDo?: string | null },
  from: Date,
  to: Date,
  now: Date = new Date()
): string[] {
  if (!e.pravidelny || !e.interval) {
    return occurrenceDatesInRange(e.datum, false, null, from, to);
  }
  let toEff = to;
  const cap = endOfMonthUTC(now); // pravidelné len po koniec aktuálneho mesiaca
  if (cap.getTime() < toEff.getTime()) toEff = cap;
  if (e.datumDo) {
    const dd = parseYmd(e.datumDo);
    if (dd.getTime() < toEff.getTime()) toEff = dd;
  }
  if (toEff.getTime() < from.getTime()) return [];
  return occurrenceDatesInRange(e.datum, true, e.interval, from, toEff);
}

export type ExpenseRowLike = {
  datum: string;
  suma: number;
  pravidelny: boolean;
  interval: ExpenseInterval | null;
};

/** Suma výdavku pripadajúca na obdobie (suma × počet výskytov). */
export function expenseAmountInRange(e: ExpenseRowLike, from: Date, to: Date): number {
  return Number(e.suma) * occurrencesInRange(e.datum, e.pravidelny, e.interval, from, to);
}
