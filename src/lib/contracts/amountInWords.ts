// Suma slovom po slovensky (do zmlúv: „slovom: tristo eur“).
//
// Pravidlá:
//  - eurá a centy sa zaokrúhľujú na celé centy, centy sa uvádzajú len ak nie sú 0
//    („tisíc dvesto tridsaťštyri eur a päťdesiat centov“),
//  - tvary: jedno euro / dve, tri, štyri eurá / päť a viac (aj 0, 21, 22 …) eur;
//    jeden cent / dva, tri, štyri centy / päť a viac centov,
//  - stovky a desiatky v rámci trojice sú oddelené medzerou („dvesto tridsaťštyri“),
//    násobok tisícov sa píše zložene („dvadsaťjedentisíc“, „stodvadsaťtritisíc“),
//  - milióny: „milión“, „dva milióny“, „päť miliónov“ (do 999 999 999,99).
// Záporné, NaN a nekonečné hodnoty → RangeError (bez hodnoty v texte chyby).

const JEDNOTKY = ["", "jeden", "dva", "tri", "štyri", "päť", "šesť", "sedem", "osem", "deväť"];
const NASTY = [
  "desať",
  "jedenásť",
  "dvanásť",
  "trinásť",
  "štrnásť",
  "pätnásť",
  "šestnásť",
  "sedemnásť",
  "osemnásť",
  "devätnásť",
];
const DESIATKY = [
  "",
  "",
  "dvadsať",
  "tridsať",
  "štyridsať",
  "päťdesiat",
  "šesťdesiat",
  "sedemdesiat",
  "osemdesiat",
  "deväťdesiat",
];
const STOVKY = ["", "sto", "dvesto", "tristo", "štyristo", "päťsto", "šesťsto", "sedemsto", "osemsto", "deväťsto"];

const MAX_EUR = 999_999_999;

/** Desiatky + jednotky (1–99) jedným slovom, napr. „tridsaťštyri“. */
function tensWord(n: number): string {
  if (n < 10) return JEDNOTKY[n];
  if (n < 20) return NASTY[n - 10];
  return DESIATKY[Math.floor(n / 10)] + JEDNOTKY[n % 10];
}

/** Trojica 1–999 ako časti [stovky, desiatky+jednotky] (prázdne vynechané). */
function tripletParts(n: number): string[] {
  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h) parts.push(STOVKY[h]);
  if (r) parts.push(tensWord(r));
  return parts;
}

/** Násobok tisícov (1–999) zložene: „tisíc“, „dvetisíc“, „dvadsaťjedentisíc“. */
function thousandsWord(k: number): string {
  if (k === 1) return "tisíc";
  if (k === 2) return "dvetisíc";
  return tripletParts(k).join("") + "tisíc";
}

/** Milióny (1–999): „milión“, „dva milióny“, „päť miliónov“. */
function millionsWord(m: number): string {
  if (m === 1) return "milión";
  const num = tripletParts(m).join(" ");
  return `${num} ${m >= 2 && m <= 4 ? "milióny" : "miliónov"}`;
}

/** Celé číslo 0–999 999 999 slovom (mužský rod pre 1 a 2: „jeden“, „dva“). */
export function integerInWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_EUR) throw new RangeError("Číslo mimo rozsahu.");
  if (n === 0) return "nula";
  const parts: string[] = [];
  const mil = Math.floor(n / 1_000_000);
  const tis = Math.floor((n % 1_000_000) / 1000);
  const zvysok = n % 1000;
  if (mil) parts.push(millionsWord(mil));
  if (tis) parts.push(thousandsWord(tis));
  if (zvysok) parts.push(...tripletParts(zvysok));
  return parts.join(" ");
}

function euroPhrase(e: number): string {
  if (e === 1) return "jedno euro";
  if (e === 2) return "dve eurá";
  if (e === 3 || e === 4) return `${JEDNOTKY[e]} eurá`;
  return `${integerInWords(e)} eur`;
}

function centPhrase(c: number): string {
  if (c === 1) return "jeden cent";
  if (c >= 2 && c <= 4) return `${JEDNOTKY[c]} centy`;
  return `${integerInWords(c)} centov`;
}

/** Suma v eurách slovom, napr. 1234.5 → „tisíc dvesto tridsaťštyri eur a päťdesiat centov“. */
export function amountInWords(amount: number | string): string {
  const n = typeof amount === "number" ? amount : Number(String(amount).replace(/\s+/g, "").replace(",", "."));
  if (typeof amount === "string" && amount.trim() === "") throw new RangeError("Neplatná suma.");
  if (!Number.isFinite(n)) throw new RangeError("Neplatná suma.");
  if (n < 0) throw new RangeError("Suma nesmie byť záporná.");
  const totalCents = Math.round(n * 100);
  const eur = Math.floor(totalCents / 100);
  const cents = totalCents % 100;
  if (eur > MAX_EUR) throw new RangeError("Suma je príliš veľká.");
  const e = euroPhrase(eur);
  return cents ? `${e} a ${centPhrase(cents)}` : e;
}
