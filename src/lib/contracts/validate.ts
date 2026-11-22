// Validácia vstupných údajov zmluvy PRED generovaním (čistá funkcia, bez DB).
//
// `chybajuce` blokujú generovanie (API vráti 422), `varovania` nie.
// Výstup obsahuje len NÁZVY polí, popisy a odkazy na opravu — nikdy hodnoty.
import { deriveFlags, todayIso } from "./snapshot";
import type { SnapshotSource, ValidationMissing, ValidationResult, ValidationWarning } from "./types";

const empty = (v: unknown) => v === null || v === undefined || String(v).trim() === "";

export const ODKAZ_FIRMA = "/portal/nastavenia-firmy";
export const ODKAZ_FLOTILY = "/portal/flotily";
export const odkazVodic = (userId: number | null | undefined) =>
  userId ? `/portal/vodici?profil=${userId}` : "/portal/vodici";
export const odkazVozidlo = (vehicleId: number | null | undefined) =>
  vehicleId ? `/portal/vozidla?edit=${vehicleId}` : "/portal/vozidla";

type FieldSpec = [pole: string, label: string];

const FIRMA_POVINNE: [keyof NonNullable<SnapshotSource["firma"]>, string][] = [
  ["obchodneMeno", "Obchodné meno firmy"],
  ["ico", "IČO firmy"],
  ["dic", "DIČ firmy"],
  ["sidlo", "Sídlo firmy"],
  ["statutar", "Štatutár firmy"],
];

const VODIC_POVINNE: [keyof NonNullable<SnapshotSource["vodic"]>, string][] = [
  ["meno", "Meno vodiča"],
  ["priezvisko", "Priezvisko vodiča"],
  ["datumNarodenia", "Dátum narodenia vodiča"],
  ["rodneCislo", "Rodné číslo vodiča"],
  ["cisloOp", "Číslo OP vodiča"],
  ["trvalyPobyt", "Trvalý pobyt vodiča"],
  ["telefon", "Telefón vodiča"],
  ["cisloPvt", "Číslo preukazu vodiča taxislužby"],
];

const FLOTILA_POVINNE: [keyof NonNullable<SnapshotSource["flotila"]>, string][] = [
  ["obchodneMeno", "Obchodné meno flotily"],
  ["ico", "IČO flotily"],
  ["sidlo", "Sídlo flotily"],
  ["statutar", "Štatutár flotily"],
];

const VOZIDLO_POVINNE: [keyof NonNullable<SnapshotSource["vozidlo"]>, string][] = [
  ["spz", "EČV vozidla"],
  ["vin", "VIN vozidla"],
  ["rokVyroby", "Rok výroby vozidla"],
  ["farba", "Farba vozidla"],
  ["znacka", "Značka vozidla"],
  ["model", "Model vozidla"],
];

/** Kontrola platnosti dokladu: vypršaná k dnešku alebo k dátumu uzavretia, prípadne nezadaná. */
function checkValidity(
  out: ValidationWarning[],
  pole: string,
  nazov: string,
  date: string | null | undefined,
  datumUzavretia: string | null,
  today: string,
  warnIfMissing = true
) {
  if (empty(date)) {
    if (warnIfMissing) out.push({ pole, text: `${nazov}: platnosť nie je zadaná.` });
    return;
  }
  const dt = String(date).slice(0, 10);
  if (dt < today) {
    out.push({ pole, text: `${nazov}: platnosť už vypršala.` });
  } else if (datumUzavretia && dt < datumUzavretia) {
    out.push({ pole, text: `${nazov}: platnosť vyprší pred dátumom uzavretia zmluvy.` });
  }
}

/**
 * Overí, či sú vyplnené všetky údaje potrebné na vygenerovanie zmluvy.
 * `today` = 'YYYY-MM-DD' (pre testy).
 */
export function validateSnapshotInput(src: SnapshotSource, today: string = todayIso()): ValidationResult {
  const chybajuce: ValidationMissing[] = [];
  const varovania: ValidationWarning[] = [];
  const seen = new Set<string>();
  const miss = (pole: string, label: string, odkaz: string | null) => {
    if (seen.has(pole)) return;
    seen.add(pole);
    chybajuce.push({ pole, label, odkaz });
  };

  // Firma (prevádzkovateľ)
  for (const [k, label] of FIRMA_POVINNE) {
    if (empty(src.firma?.[k])) miss(`firma.${k}`, label, ODKAZ_FIRMA);
  }

  // Vodič
  const v = src.vodic;
  const vOdkaz = odkazVodic(v?.userId);
  if (!v) {
    miss("vodic", "Vodič", "/portal/vodici");
  } else {
    for (const [k, label] of VODIC_POVINNE) {
      if (empty(v[k])) miss(`vodic.${k}`, label, vOdkaz);
    }
  }

  const flags = deriveFlags(src);

  // Zmluvná strana
  if (v && flags.pravnicka_osoba) {
    const po: FieldSpec[] = [
      ["firmaObchodneMeno", "Obchodné meno spoločnosti vodiča"],
      ["firmaIco", "IČO spoločnosti vodiča"],
      ["firmaSidlo", "Sídlo spoločnosti vodiča"],
    ];
    for (const [k, label] of po) {
      if (empty(v[k as keyof typeof v])) miss(`vodic.${k}`, label, vOdkaz);
    }
  }
  if (v && flags.koncesia) {
    const kon: FieldSpec[] = [
      ["firmaIco", "IČO (vlastná koncesia)"],
      ["firmaDic", "DIČ (vlastná koncesia)"],
      ["cisloKoncesie", "Číslo koncesie na taxislužbu"],
    ];
    for (const [k, label] of kon) {
      if (empty(v[k as keyof typeof v])) miss(`vodic.${k}`, label, vOdkaz);
    }
  }

  // Flotila
  if (v?.rezim === "VO_FLOTILE") {
    if (!v.fleetId) miss("vodic.fleetId", "Flotila vodiča (režim vo flotile)", vOdkaz);
    else if (!src.flotila) miss("flotila", "Flotila vodiča neexistuje", ODKAZ_FLOTILY);
  } else if (v?.fleetId && !src.flotila) {
    varovania.push({ pole: "flotila", text: "Flotila vodiča sa nenašla, blok flotily sa v zmluve vynechá." });
  }
  if (flags.maFlotilu && src.flotila) {
    for (const [k, label] of FLOTILA_POVINNE) {
      if (empty(src.flotila[k])) miss(`flotila.${k}`, label, ODKAZ_FLOTILY);
    }
    if (!src.flotila.dohoda) {
      varovania.push({ pole: "flotila.dohoda", text: "Flotila nemá dnes platnú dohodu s firmou." });
    }
  }

  // Zmluva — spoločné
  const i = src.input;
  if (empty(i.datumUzavretia)) miss("datumUzavretia", "Dátum uzavretia zmluvy", null);
  if (empty(i.platnostOd)) miss("platnostOd", "Platnosť zmluvy od", null);
  if (!empty(i.platnostOd) && !empty(i.platnostDo) && String(i.platnostDo) < String(i.platnostOd)) {
    miss("platnostDo", "Platnosť do je skôr ako platnosť od", null);
  }

  const datumUzavretia = empty(i.datumUzavretia) ? null : String(i.datumUzavretia).slice(0, 10);

  if (src.typ === "NAJOM") {
    const z = src.vozidlo;
    if (!z) {
      miss("vehicleId", src.vehicleId ? "Vybrané vozidlo neexistuje" : "Vozidlo", "/portal/vozidla");
    } else {
      const zOdkaz = odkazVozidlo(z.id);
      for (const [k, label] of VOZIDLO_POVINNE) {
        if (empty(z[k])) miss(`vozidlo.${k}`, label, zOdkaz);
      }
    }
    if (i.najomneSuma === null || i.najomneSuma === undefined || !(Number(i.najomneSuma) > 0)) {
      miss("najomneSuma", "Výška nájomného (viac ako 0)", null);
    }
    if (i.kaucia === null || i.kaucia === undefined || !(Number(i.kaucia) >= 0)) {
      miss("kaucia", "Výška depozitu (kaucie)", null);
    }
    if (z) {
      checkValidity(varovania, "vozidlo.pzpPlatnostDo", "PZP vozidla", z.pzpPlatnostDo, datumUzavretia, today);
      checkValidity(varovania, "vozidlo.havPlatnostDo", "Havarijné poistenie vozidla", z.havPlatnostDo, datumUzavretia, today);
      checkValidity(varovania, "vozidlo.stkPlatnostDo", "STK vozidla", z.stkPlatnostDo, datumUzavretia, today);
      checkValidity(varovania, "vozidlo.ekPlatnostDo", "EK vozidla", z.ekPlatnostDo, datumUzavretia, today);
    }
  } else {
    if (i.provizia === null || i.provizia === undefined || !(Number(i.provizia) >= 0)) {
      miss("provizia", "Provízia za dispečerské služby", null);
    }
    if (i.poplatokRegistracny === null || i.poplatokRegistracny === undefined || !(Number(i.poplatokRegistracny) >= 0)) {
      miss("poplatokRegistracny", "Registračný poplatok", null);
    }
  }

  // Varovania — doklady vodiča a účty
  if (v) {
    checkValidity(varovania, "vodic.pvtPlatnostDo", "Preukaz vodiča taxislužby", v.pvtPlatnostDo, datumUzavretia, today);
    if (flags.koncesia) {
      checkValidity(varovania, "vodic.koncesiaPlatnostDo", "Koncesia vodiča", v.koncesiaPlatnostDo, datumUzavretia, today, false);
    }
    if (empty(v.iban)) varovania.push({ pole: "vodic.iban", text: "IBAN vodiča nie je vyplnený." });
  }
  if (src.firma && empty(src.firma.iban)) varovania.push({ pole: "firma.iban", text: "IBAN firmy nie je vyplnený." });

  return { chybajuce, varovania };
}
