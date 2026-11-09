// Rotačné vzory smien podľa Google tabuľky E-TAXI Košice (rozpis pre 4 vodičov
// na firemné vozidlo). Vstavané vzory sú 28-dňové (4-týždňové) cykly; vlastné
// uložené vzory môžu mať ľubovoľnú dĺžku. D = denná, N = nočná, V = voľno,
// H = 24-hodinová (obsadí dennú aj nočnú).

export type PatternCode = "D" | "N" | "V" | "H";
export type TypSmeny = "DENNA" | "NOCNA" | "VOLNO" | "H24";

export const CODE_TO_TYP: Record<PatternCode, TypSmeny> = {
  D: "DENNA",
  N: "NOCNA",
  V: "VOLNO",
  H: "H24",
};

const VALID_CODES = new Set(["D", "N", "V", "H"]);

/** Reťazec kódov → pole PatternCode (ignoruje medzery a neznáme znaky). */
export function parsePatternDni(s: string): PatternCode[] {
  return s
    .toUpperCase()
    .replace(/\s+/g, "")
    .split("")
    .filter((c) => VALID_CODES.has(c)) as PatternCode[];
}

function toArr(s: string): PatternCode[] {
  return parsePatternDni(s);
}

export type ShiftPattern = {
  key: string;
  label: string;
  dni: PatternCode[];
};

// Zdroj: hárok "Rozpis smien" (od pondelka).
export const SHIFT_PATTERNS: ShiftPattern[] = [
  {
    key: "P1",
    label: "Vzor 1 (Po: Voľno → Str/Štv nočná)",
    dni: toArr("VVNNVVV DDVVNNN VVDDVVV NNVVDDD"),
  },
  {
    key: "P2",
    label: "Vzor 2 (Po/Ut denná)",
    dni: toArr("DDVVNNN VVDDVVV NNVVDDD VVNNVVV"),
  },
  {
    key: "P3",
    label: "Vzor 3 (Po/Ut nočná)",
    dni: toArr("NNVVDDD VVNNVVV DDVVNNN VVDDVVV"),
  },
  {
    key: "P4",
    label: "Vzor 4 (Po: Voľno → Str/Štv denná)",
    dni: toArr("VVDDVVV NNVVDDD VVNNVVV DDVVNNN"),
  },
  {
    key: "H24",
    label: "24 hodín — každý deň",
    dni: toArr("HHHHHHH"),
  },
];

export function getPattern(key: string): ShiftPattern | undefined {
  return SHIFT_PATTERNS.find((p) => p.key === key);
}

/** Kód smeny pre daný deň (index od začiatku obdobia) podľa vzoru (cyklus = dĺžka vzoru). */
export function patternCodeForDay(pattern: ShiftPattern, dayIndex: number): PatternCode {
  const n = pattern.dni.length;
  if (n === 0) return "V";
  return pattern.dni[((dayIndex % n) + n) % n];
}
