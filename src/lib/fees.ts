// Výpočet poplatkov pre vodičov podľa Google tabuľky E-TAXI Košice.
//
// Tarifné pásma (poplatok za aplikáciu) podľa týždennej tržby:
//   0–50 € → 0 €;  50,01–100 € → 5 €;  100,01–150 € → 10 €;
//   150,01–250 € → 15 €;  nad 250 € → 20 €.
// Provízia = 15 % z tržby. Celkový poplatok = poplatok za app + provízia.
// Všetko zaokrúhlené na 2 desatinné (centy).

export type FeeTier = {
  trzbaOd: number;
  trzbaDo: number | null; // null = "a viac"
  poplatok: number;
};

/** Predvolené tarifné pásma (zhoda s tabuľkou). Zdroj pravdy v DB (model FeeTier). */
export const DEFAULT_FEE_TIERS: FeeTier[] = [
  { trzbaOd: 0, trzbaDo: 50, poplatok: 0 },
  { trzbaOd: 50, trzbaDo: 100, poplatok: 5 },
  { trzbaOd: 100, trzbaDo: 150, poplatok: 10 },
  { trzbaOd: 150, trzbaDo: 250, poplatok: 15 },
  { trzbaOd: 250, trzbaDo: null, poplatok: 20 },
];

export const DEFAULT_PROVISION_RATE = 0.15;
export const DEFAULT_REGISTRATION_FEE = 30;

/** Matematické zaokrúhlenie na 2 desatinné (round half up), bezpečné voči plávajúcej čiarke. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Provízia počítaná cez celočíselné centy — presne ako v tabuľke (napr.
 * 390,90 € × 15 % = 58,64 €, nie 58,63 € z chyby plávajúcej čiarky).
 */
export function proviziaZTrzby(trzba: number, rate: number = DEFAULT_PROVISION_RATE): number {
  const trzbaCents = Math.round(trzba * 100);
  const ratePercent = rate * 100; // napr. 15
  const proviziaCents = Math.round((trzbaCents * ratePercent) / 100);
  return proviziaCents / 100;
}

/**
 * Poplatok za aplikáciu z tarifných pásem. Pásma sa vyhodnocujú podľa hornej
 * hranice (trzbaDo je vrátane); posledné pásmo s trzbaDo=null je "a viac".
 */
export function poplatokZaApp(
  trzba: number,
  tiers: FeeTier[] = DEFAULT_FEE_TIERS
): number {
  const sorted = [...tiers].sort((a, b) => a.trzbaOd - b.trzbaOd);
  for (const t of sorted) {
    if (t.trzbaDo === null) return t.poplatok;
    if (trzba <= t.trzbaDo) return t.poplatok;
  }
  // Fallback: ak žiadne pásmo nesedí, vezmi posledné.
  return sorted.length ? sorted[sorted.length - 1].poplatok : 0;
}

export type FeeBreakdown = {
  trzba: number;
  poplatokApp: number;
  provizia: number;
  celkovyPoplatok: number;
};

/** Zaokrúhlenie na 1 desatinné miesto (round half up). */
export function round1(n: number): number {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

/**
 * Kompletný výpočet poplatkov pre danú týždennú tržbu.
 * Poplatky (app, provízia, celkový) sa zaokrúhľujú na 1 desatinné miesto.
 * Tržba ostáva na 2 desatinné.
 */
export function vypocitajPoplatky(
  trzba: number,
  opts: { tiers?: FeeTier[]; provisionRate?: number } = {}
): FeeBreakdown {
  const tiers = opts.tiers ?? DEFAULT_FEE_TIERS;
  const rate = opts.provisionRate ?? DEFAULT_PROVISION_RATE;
  const trzbaR = round2(trzba);
  const poplatokApp = round1(poplatokZaApp(trzbaR, tiers));
  const provizia = round1(proviziaZTrzby(trzbaR, rate));
  const celkovyPoplatok = round1(poplatokApp + provizia);
  return { trzba: trzbaR, poplatokApp, provizia, celkovyPoplatok };
}

// ── ISO týždeň (identifikátor tržieb, napr. 29/2026) ───────────────────────────

/** ISO 8601 číslo týždňa (1–53) pre daný dátum. */
export function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Po=1 … Ne=7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // posun na štvrtok toho týždňa
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** ISO rok (týždeň patriaci januáru môže patriť predch. roku a naopak). */
export function isoWeekYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

/** Dvojica { isoRok, isoTyzden } pre dátum. */
export function isoWeekParts(date: Date): { isoRok: number; isoTyzden: number } {
  return { isoRok: isoWeekYear(date), isoTyzden: isoWeekNumber(date) };
}

/** Formát "WW/YYYY" ako v tabuľke. */
export function formatWeek(isoRok: number, isoTyzden: number): string {
  return `${isoTyzden}/${isoRok}`;
}

/** Pondelok (UTC) daného ISO týždňa/roku. */
export function isoWeekMonday(isoRok: number, isoTyzden: number): Date {
  // 4. január je vždy v 1. ISO týždni.
  const jan4 = new Date(Date.UTC(isoRok, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - (jan4Day - 1));
  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (isoTyzden - 1) * 7);
  return monday;
}

/** Rozsah dátumov (Po–Ne, UTC polnoc) pre ISO týždeň. */
export function isoWeekDateRange(isoRok: number, isoTyzden: number): { from: Date; to: Date; dni: Date[] } {
  const from = isoWeekMonday(isoRok, isoTyzden);
  const dni: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setUTCDate(from.getUTCDate() + i);
    dni.push(d);
  }
  const to = new Date(from);
  to.setUTCDate(from.getUTCDate() + 6);
  return { from, to, dni };
}

export type Obdobie = "tyzden" | "mesiac" | "rok";

const MESIACE = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December",
];

/** Rozsah dátumov + počet dní + textový popis pre zvolené obdobie. */
export function periodRange(
  obdobie: Obdobie,
  p: { rok: number; tyzden?: number; mesiac?: number }
): { from: Date; to: Date; dni: number; label: string } {
  if (obdobie === "rok") {
    const from = new Date(Date.UTC(p.rok, 0, 1));
    const to = new Date(Date.UTC(p.rok, 11, 31));
    return { from, to, dni: daysBetween(from, to), label: `Rok ${p.rok}` };
  }
  if (obdobie === "mesiac") {
    const m = p.mesiac ?? 1;
    const from = new Date(Date.UTC(p.rok, m - 1, 1));
    const to = new Date(Date.UTC(p.rok, m, 0)); // posledný deň mesiaca
    return { from, to, dni: daysBetween(from, to), label: `${MESIACE[m - 1]} ${p.rok}` };
  }
  const { from, to } = isoWeekDateRange(p.rok, p.tyzden ?? 1);
  return { from, to, dni: 7, label: `Týždeň ${p.tyzden}/${p.rok}` };
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86400000) + 1;
}

/** ISO týždne (rok/týždeň), ktorých pondelok padne do rozsahu [from, to]. */
export function weeksInRange(from: Date, to: Date): { isoRok: number; isoTyzden: number }[] {
  const out: { isoRok: number; isoTyzden: number }[] = [];
  const seen = new Set<string>();
  const d = new Date(from);
  while (d.getTime() <= to.getTime()) {
    if ((d.getUTCDay() || 7) === 1) {
      const p = isoWeekParts(d);
      const key = `${p.isoRok}-${p.isoTyzden}`;
      if (!seen.has(key)) { seen.add(key); out.push(p); }
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}
