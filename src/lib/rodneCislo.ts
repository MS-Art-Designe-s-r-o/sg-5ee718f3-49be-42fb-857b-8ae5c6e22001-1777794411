// Rodné číslo (SR/ČR): normalizácia, validácia a dátum narodenia.
//
// Formát RRMMDD/XXX(X):
//  - 9-ciferné = narodení pred 1. 1. 1954 (bez kontrolnej číslice),
//  - 10-ciferné = od 1954; celé číslo deliteľné 11. Výnimka (slovenská prax pre
//    roky 1954–1985): ak zvyšok prvých 9 číslic po delení 11 je 10, posledná číslica je 0.
//  - mesiac +50 = žena; od roku 2004 aj +20 (muž) / +70 (žena) pri vyčerpaní koncoviek.
// Funkcie nikdy nelogujú ani nevracajú hodnotu v chybe.

/** Odstráni lomku a medzery (aj iné biele znaky). */
export function normalizeRodneCislo(input: string): string {
  return String(input ?? "").replace(/[\s/]/g, "");
}

type Parsed = { year: number; month: number; day: number };

function parse(normalized: string, today: Date = new Date()): Parsed | null {
  if (!/^\d{9,10}$/.test(normalized)) return null;
  const yy = Number(normalized.slice(0, 2));
  let mm = Number(normalized.slice(2, 4));
  const dd = Number(normalized.slice(4, 6));

  let year: number;
  if (normalized.length === 9) {
    if (yy >= 54) return null; // 9-ciferné len do roku 1953
    year = 1900 + yy;
  } else {
    year = yy >= 54 ? 1900 + yy : 2000 + yy;
  }

  if (mm > 70) {
    if (year < 2004) return null;
    mm -= 70;
  } else if (mm > 50) {
    mm -= 50;
  } else if (mm > 20) {
    if (year < 2004) return null;
    mm -= 20;
  }
  if (mm < 1 || mm > 12 || dd < 1) return null;

  const d = new Date(Date.UTC(year, mm - 1, dd));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== mm - 1 || d.getUTCDate() !== dd) {
    return null; // neexistujúci dátum (napr. 31. 4. alebo 29. 2. v nepriestupnom roku)
  }
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  if (d.getTime() > todayUtc) return null; // dátum v budúcnosti

  return { year, month: mm, day: dd };
}

function checksumOk(normalized: string, year: number): boolean {
  if (normalized.length === 9) return true;
  // 10 číslic sa zmestí do Number bez straty presnosti.
  if (Number(normalized) % 11 === 0) return true;
  const first9 = Number(normalized.slice(0, 9));
  return year >= 1954 && year <= 1985 && first9 % 11 === 10 && normalized[9] === "0";
}

/** Overí rodné číslo (s lomkou aj bez). */
export function validateRodneCislo(input: string, today: Date = new Date()): boolean {
  const n = normalizeRodneCislo(input);
  const p = parse(n, today);
  return p !== null && checksumOk(n, p.year);
}

/** Dátum narodenia 'YYYY-MM-DD' z platného rodného čísla, inak null. */
export function birthDateFromRodneCislo(input: string, today: Date = new Date()): string | null {
  const n = normalizeRodneCislo(input);
  const p = parse(n, today);
  if (!p || !checksumOk(n, p.year)) return null;
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}
