// Katalóg značiek šablón zmlúv — JEDINÝ zdroj pravdy pre stránku „Zoznam značiek“
// aj pre kontrolu nahratých šablón (neznáme značky).
//
// Zápis v šablóne (docxtemplater, oddeľovače { }):
//   {firma.nazov}                         — hodnota (bodková cesta)
//   {#flotila} … {/flotila}               — blok sa vypíše, len ak podmienka platí
//   {^flotila} … {/flotila}               — inverzný blok (vypíše sa, ak NEplatí)
// Vnútri bloku objektu (flotila, vozidlo) fungujú oba zápisy: {flotila.nazov}
// aj skrátený {nazov}. Odporúčaný je PLNÝ zápis {flotila.nazov} — je jednoznačný.
// Blok, ktorý má otváraciu aj uzatváraciu značku v samostatnom odstavci, sa
// vynechá aj s odstavcami (žiadne prázdne riadky).
//
// Príklady sú FIKTÍVNE.

export type TagGroupId = "firma" | "flotila" | "vodic" | "strana" | "vozidlo" | "zmluva" | "bloky";

export type TagDef = {
  /** Bodková cesta, napr. "firma.nazov"; pri bloku len názov bloku. */
  key: string;
  label: string;
  popis: string;
  skupina: TagGroupId;
  /** Fiktívny príklad hodnoty. */
  priklad: string;
  /** Podmienený blok (boolean/objekt) — používa sa ako {#key}…{/key}. */
  blok?: boolean;
};

export const TAG_GROUPS: { id: TagGroupId; nazov: string; popis: string }[] = [
  { id: "firma", nazov: "Firma (E-TAXI)", popis: "Údaje prevádzkovateľa z Nastavení firmy." },
  {
    id: "flotila",
    nazov: "Flotila",
    popis: "Flotila (dopravca), pod ktorou vodič pôsobí, a aktuálna dohoda s ňou. Prázdne, ak vodič nemá flotilu.",
  },
  { id: "vodic", nazov: "Vodič", popis: "Osobné údaje vodiča z profilu vodiča." },
  {
    id: "strana",
    nazov: "Zmluvná strana",
    popis:
      "Zmluvná strana na strane vodiča: samotný vodič (fyzická osoba) alebo jeho s.r.o./SZČO. Vyplnené vždy podľa typu strany.",
  },
  { id: "vozidlo", nazov: "Vozidlo", popis: "Údaje vybraného vozidla (len nájomná zmluva)." },
  { id: "zmluva", nazov: "Zmluva", popis: "Údaje zadané pri generovaní zmluvy a jej číslo." },
  {
    id: "bloky",
    nazov: "Podmienené bloky",
    popis: "Použite ako {#nazov}…{/nazov} (vypíše sa, ak platí) alebo {^nazov}…{/nazov} (ak neplatí).",
  },
];

type Row = [key: string, label: string, popis: string, priklad: string];

function group(skupina: TagGroupId, rows: Row[]): TagDef[] {
  return rows.map(([key, label, popis, priklad]) => ({
    key: `${skupina}.${key}`,
    label,
    popis,
    skupina,
    priklad,
  }));
}

const FIRMA = group("firma", [
  ["nazov", "Obchodné meno", "Obchodné meno prevádzkovateľa.", "Vzorová Taxi s.r.o."],
  ["ico", "IČO", "IČO prevádzkovateľa.", "12345678"],
  ["dic", "DIČ", "DIČ prevádzkovateľa.", "2020123456"],
  ["ic_dph", "IČ DPH", "IČ DPH prevádzkovateľa (môže byť prázdne).", "SK2020123456"],
  ["sidlo", "Sídlo", "Adresa sídla.", "Hlavná 1, 040 01 Košice"],
  ["zapisany_v", "Zápis v registri", "Obchodný register, oddiel a vložka.", "OR Mestského súdu Košice, oddiel Sro, vložka č. 00000/V"],
  ["statutar", "Štatutár", "Meno štatutárneho zástupcu.", "Ján Vzorový"],
  ["statutar_funkcia", "Funkcia štatutára", "Funkcia štatutára.", "konateľ"],
  ["iban", "IBAN", "Bankový účet prevádzkovateľa.", "SK00 0000 0000 0000 0000 0000"],
  ["email", "E-mail", "Kontaktný e-mail firmy.", "info@vzor.sk"],
  ["telefon", "Telefón", "Kontaktný telefón firmy.", "+421 900 000 000"],
  ["web", "Web", "Webová adresa.", "www.vzor.sk"],
]);

const FLOTILA = group("flotila", [
  ["nazov", "Obchodné meno", "Obchodné meno flotily.", "Flotila Vzor s.r.o."],
  ["ico", "IČO", "IČO flotily.", "87654321"],
  ["dic", "DIČ", "DIČ flotily.", "2020654321"],
  ["ic_dph", "IČ DPH", "IČ DPH flotily (môže byť prázdne).", "SK2020654321"],
  ["sidlo", "Sídlo", "Sídlo flotily.", "Bočná 2, 040 01 Košice"],
  ["zapisana_v", "Zápis v registri", "Obchodný alebo živnostenský register.", "OR Mestského súdu Košice, oddiel Sro, vložka č. 11111/V"],
  ["statutar", "Štatutár", "Štatutárny zástupca flotily.", "Peter Príkladný"],
  ["cislo_koncesie", "Číslo koncesie", "Číslo koncesie flotily na taxislužbu.", "KE-TAXI-0000"],
  ["iban", "IBAN", "Bankový účet flotily.", "SK11 1111 1111 1111 1111 1111"],
  ["kontakt_meno", "Kontaktná osoba", "Meno kontaktnej osoby.", "Eva Kontaktná"],
  ["kontakt_telefon", "Kontaktný telefón", "Telefón kontaktnej osoby.", "+421 911 111 111"],
  ["kontakt_email", "Kontaktný e-mail", "E-mail kontaktnej osoby.", "flotila@vzor.sk"],
  ["zmluva_cislo", "Číslo dohody s flotilou", "Číslo aktuálne platnej dohody E-TAXI s flotilou.", "DF-2026-01"],
  ["zmluva_datum", "Dátum dohody", "Dátum uzavretia dohody s flotilou.", "01.01.2026"],
  ["zmluva_platnost_od", "Dohoda platí od", "Začiatok platnosti dohody.", "01.01.2026"],
  ["zmluva_platnost_do", "Dohoda platí do", "Koniec platnosti dohody (prázdne = neurčito).", "31.12.2026"],
]);

const VODIC = group("vodic", [
  ["meno", "Meno", "Krstné meno vodiča.", "Ján"],
  ["priezvisko", "Priezvisko", "Priezvisko vodiča.", "Vzorový"],
  ["titul_pred", "Titul pred menom", "Titul pred menom (môže byť prázdny).", "Ing."],
  ["titul_za", "Titul za menom", "Titul za menom (môže byť prázdny).", "PhD."],
  ["cele_meno", "Celé meno", "Tituly, meno a priezvisko spolu.", "Ing. Ján Vzorový, PhD."],
  ["datum_narodenia", "Dátum narodenia", "Dátum narodenia (dd.mm.rrrr).", "01.01.1990"],
  ["rodne_cislo", "Rodné číslo", "Rodné číslo v tvare RRMMDD/XXXX.", "900101/0000"],
  ["cislo_op", "Číslo OP", "Číslo občianskeho preukazu / dokladu totožnosti.", "XX000000"],
  ["adresa", "Trvalý pobyt", "Adresa trvalého pobytu.", "Ulica 3, 040 01 Košice"],
  ["cislo_vp", "Číslo vodičského preukazu", "Číslo vodičského preukazu.", "VP000000"],
  ["cislo_pvt", "Číslo preukazu vodiča taxislužby", "Číslo preukazu vodiča vozidla taxislužby.", "PVT-0000"],
  ["pvt_platnost", "Platnosť preukazu taxislužby", "Platnosť preukazu vodiča taxislužby do.", "31.12.2027"],
  ["telefon", "Telefón", "Telefón vodiča.", "+421 900 123 456"],
  ["email", "E-mail", "E-mail vodiča.", "jan.vzorovy@example.com"],
  ["iban", "IBAN", "Bankový účet vodiča.", "SK22 2222 2222 2222 2222 2222"],
  ["volaci_znak", "Volací znak", "Volací znak vodiča v dispečingu.", "K-00"],
]);

const STRANA = group("strana", [
  ["nazov", "Názov / meno", "Obchodné meno s.r.o./SZČO, inak celé meno vodiča.", "Ján Vzorový"],
  ["sidlo", "Sídlo / bydlisko", "Sídlo s.r.o./SZČO, inak trvalý pobyt vodiča.", "Ulica 3, 040 01 Košice"],
  ["ico", "IČO", "IČO s.r.o./SZČO (prázdne pri nepodnikateľovi).", "11223344"],
  ["dic", "DIČ", "DIČ s.r.o./SZČO.", "1122334455"],
  ["ic_dph", "IČ DPH", "IČ DPH s.r.o./SZČO (môže byť prázdne).", "SK1122334455"],
  ["cislo_koncesie", "Číslo koncesie", "Číslo vlastnej koncesie na taxislužbu.", "KE-TAXI-1111"],
  ["koncesia_platnost", "Platnosť koncesie", "Platnosť vlastnej koncesie do.", "31.12.2028"],
  ["statutar", "Štatutár", "Štatutár s.r.o. (len právnická osoba).", "Ján Vzorový"],
  ["zapisana_v", "Zápis v registri", "Obchodný alebo živnostenský register.", "Živnostenský register OÚ Košice, č. 000-00000"],
  ["iban", "IBAN", "Bankový účet zmluvnej strany.", "SK22 2222 2222 2222 2222 2222"],
  ["typ_text", "Typ strany", "„fyzická osoba“, „fyzická osoba – podnikateľ“ alebo „právnická osoba“.", "fyzická osoba – podnikateľ"],
]);

const VOZIDLO = group("vozidlo", [
  ["znacka", "Značka", "Značka vozidla.", "Škoda"],
  ["model", "Model", "Model vozidla.", "Octavia"],
  ["nazov", "Značka a model", "Značka a model spolu.", "Škoda Octavia"],
  ["ecv", "EČV", "Evidenčné číslo vozidla.", "KE000XX"],
  ["vin", "VIN", "Identifikačné číslo vozidla.", "TMBAAAAA0A0000000"],
  ["rok_vyroby", "Rok výroby", "Rok výroby.", "2022"],
  ["farba", "Farba", "Farba vozidla.", "biela"],
  ["cislo_tp", "Číslo TP", "Číslo osvedčenia o evidencii (technického preukazu).", "TP000000"],
  ["prva_evidencia", "Dátum prvej evidencie", "Dátum prvej evidencie.", "15.03.2022"],
  ["pohon", "Typ pohonu", "elektrický / hybridný / benzínový / dieselový / LPG / CNG.", "elektrický"],
  ["vlastnik_nazov", "Vlastník", "Vlastník vozidla (E-TAXI alebo flotila).", "Vzorová Taxi s.r.o."],
  ["poistovna", "Poisťovňa", "Poisťovňa vozidla.", "Vzorová poisťovňa, a.s."],
  ["pzp_cislo", "Číslo PZP", "Číslo zmluvy povinného zmluvného poistenia.", "PZP-000000"],
  ["pzp_platnost", "Platnosť PZP", "PZP platné do.", "31.12.2026"],
  ["hav_cislo", "Číslo havarijného poistenia", "Číslo zmluvy havarijného poistenia.", "HAV-000000"],
  ["hav_platnost", "Platnosť havarijného", "Havarijné poistenie platné do.", "31.12.2026"],
  ["stk_platnost", "Platnosť STK", "Technická kontrola platná do.", "30.06.2027"],
  ["ek_platnost", "Platnosť EK", "Emisná kontrola platná do.", "30.06.2027"],
  ["stav_km", "Stav km (evidencia)", "Posledný evidovaný stav tachometra.", "45 230 km"],
]);

const ZMLUVA = group("zmluva", [
  ["cislo", "Číslo zmluvy", "Číslo pridelené pri generovaní (NZ-RRRR-NNN / DS-RRRR-NNN).", "NZ-2026-001"],
  ["verzia", "Verzia", "Verzia zmluvy (1 = pôvodná, vyššia = regenerovaná).", "1"],
  ["typ_nazov", "Názov typu zmluvy", "Názov typu zmluvy.", "Zmluva o nájme dopravného prostriedku"],
  ["datum_uzavretia", "Dátum uzavretia", "Dátum uzavretia zmluvy.", "01.02.2026"],
  ["platnost_od", "Platnosť od", "Začiatok platnosti.", "01.02.2026"],
  ["platnost_do", "Platnosť do", "Koniec platnosti (prázdne = na dobu neurčitú).", ""],
  ["trvanie_text", "Doba trvania (text)", "„na dobu neurčitú“ alebo „na dobu určitú od … do …“.", "na dobu neurčitú"],
  ["najomne", "Nájomné", "Výška nájomného.", "60,00 €"],
  ["najomne_jednotka_text", "Jednotka nájomného", "„za jednu zmenu (12 h)“, „za deň“, „za týždeň“, „za mesiac“.", "za jednu zmenu (12 h)"],
  ["najomne_slovom", "Nájomné slovom", "Výška nájomného slovom.", "šesťdesiat eur"],
  ["najomne_24h", "Nájomné za 24 h", "Nájomné za 24-hodinovú zmenu (môže byť prázdne).", "110,00 €"],
  ["kaucia", "Depozit (kaucia)", "Výška depozitu.", "300,00 €"],
  ["kaucia_slovom", "Depozit slovom", "Výška depozitu slovom.", "tristo eur"],
  ["spoluucast", "Spoluúčasť", "Spoluúčasť pri poistnej udalosti.", "500,00 €"],
  ["stav_km_odovzdanie", "Stav km pri odovzdaní", "Stav tachometra pri odovzdaní vozidla.", "45 230 km"],
  ["provizia", "Provízia", "Provízia za dispečerské služby v percentách.", "15 %"],
  ["poplatok_registracny", "Registračný poplatok", "Jednorazový registračný poplatok.", "30,00 €"],
  ["miesto_podpisu", "Miesto podpisu", "Miesto podpisu v tvare „V …“ (predvolene „Košiciach“).", "Košiciach"],
  ["datum_vygenerovania", "Dátum vygenerovania", "Dátum vygenerovania dokumentu.", "01.02.2026"],
]);

const BLOKY: TagDef[] = (
  [
    ["flotila", "Vodič má flotilu", "Vodič pôsobí pod flotilou (dopravcom). Vnútri bloku platia značky flotila.*.", "áno"],
    ["koncesia", "Vlastná koncesia", "Vodič jazdí na vlastnú koncesiu (režim VLASTNA_KONCESIA).", "nie"],
    ["pravnicka_osoba", "Právnická osoba", "Zmluvnou stranou je s.r.o. (právnická osoba).", "nie"],
    ["fyzicka_osoba", "Fyzická osoba", "Zmluvnou stranou je fyzická osoba (aj SZČO).", "áno"],
    ["podnikatel", "Podnikateľ", "Zmluvná strana má IČO (SZČO alebo s.r.o.).", "nie"],
    ["vozidlo", "Vozidlo vybrané", "Zmluva má vybrané vozidlo. Vnútri bloku platia značky vozidlo.*.", "áno"],
    ["je_elektricke", "Elektrické vozidlo", "Vozidlo má elektrický pohon.", "áno"],
    ["je_spalovacie", "Spaľovacie vozidlo", "Vozidlo nemá čisto elektrický pohon (vrátane hybridu).", "nie"],
  ] as Row[]
).map(([key, label, popis, priklad]) => ({ key, label, popis, skupina: "bloky" as const, priklad, blok: true }));

export const TAG_CATALOG: readonly TagDef[] = [...FIRMA, ...FLOTILA, ...VODIC, ...STRANA, ...VOZIDLO, ...ZMLUVA, ...BLOKY];

/** Názvy podmienených blokov. */
export const BLOCK_KEYS: readonly string[] = BLOKY.map((b) => b.key);

/** Všetky známe kľúče (hodnoty aj bloky). */
export const KNOWN_TAG_KEYS: ReadonlySet<string> = new Set(TAG_CATALOG.map((t) => t.key));

/** Bloky, ktoré sú objektom — vnútri nich sa smie písať skrátene ({nazov} = {flotila.nazov}). */
export const OBJECT_BLOCKS: readonly string[] = ["flotila", "vozidlo"];

/**
 * Normalizuje značku z šablóny na kľúč katalógu so zohľadnením obklopujúcich
 * blokov (od najvnútornejšieho). Vráti kľúč katalógu alebo null (neznáma značka).
 */
export function resolveTagKey(tag: string, enclosing: readonly string[] = []): string | null {
  const t = String(tag ?? "").trim();
  if (!t) return null;
  if (KNOWN_TAG_KEYS.has(t)) return t;
  for (let i = enclosing.length - 1; i >= 0; i--) {
    const candidate = `${enclosing[i]}.${t}`;
    if (KNOWN_TAG_KEYS.has(candidate)) return candidate;
  }
  return null;
}

/** Katalóg zoskupený podľa skupín (pre stránku „Zoznam značiek“ / API). */
export function catalogByGroup() {
  return TAG_GROUPS.map((g) => ({
    ...g,
    znacky: TAG_CATALOG.filter((t) => t.skupina === g.id).map((t) => ({
      key: t.key,
      zapis: t.blok ? `{#${t.key}}…{/${t.key}}` : `{${t.key}}`,
      label: t.label,
      popis: t.popis,
      priklad: t.priklad,
      blok: !!t.blok,
    })),
  }));
}
