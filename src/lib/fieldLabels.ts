// Slovenské popisky polí formulárov portálu (na zobrazenie chýb API, ktoré vracia len názvy polí).
import { ApiError } from "./portalClient";

export const FIELD_LABELS: Record<string, string> = {
  // firma / flotila
  obchodneMeno: "Obchodné meno",
  sidlo: "Sídlo",
  ico: "IČO",
  dic: "DIČ",
  icDph: "IČ DPH",
  zapisanyV: "Zapísaný v registri",
  statutar: "Štatutár",
  statutarFunkcia: "Funkcia štatutára",
  iban: "IBAN",
  email: "E-mail",
  telefon: "Telefón",
  web: "Web",
  cisloKoncesie: "Číslo koncesie",
  kontaktMeno: "Kontaktná osoba",
  kontaktTelefon: "Kontaktný telefón",
  kontaktEmail: "Kontaktný e-mail",
  poznamka: "Poznámka",
  cislo: "Číslo zmluvy",
  datumUzavretia: "Dátum uzavretia",
  platnostOd: "Platnosť od",
  platnostDo: "Platnosť do",
  // profil vodiča
  titulPred: "Titul pred menom",
  titulZa: "Titul za menom",
  datumNarodenia: "Dátum narodenia",
  rodneCislo: "Rodné číslo",
  cisloOp: "Číslo OP",
  trvalyPobyt: "Trvalý pobyt",
  cisloVp: "Číslo vodičského preukazu",
  cisloPvt: "Číslo preukazu vodiča taxislužby",
  pvtPlatnostDo: "Platnosť preukazu taxislužby do",
  stav: "Stav",
  fleetId: "Flotila",
  rezim: "Režim",
  stranaTyp: "Typ zmluvnej strany",
  firmaObchodneMeno: "Obchodné meno",
  firmaIco: "IČO",
  firmaDic: "DIČ",
  firmaIcDph: "IČ DPH",
  firmaSidlo: "Sídlo",
  firmaZapisanyV: "Zapísaný v registri",
  koncesiaPlatnostDo: "Platnosť koncesie do",
  firmaStatutar: "Štatutár",
};

/** Chybová hláška pre používateľa: text z API + preložený zoznam názvov polí (bez hodnôt). */
export function describeApiError(e: unknown): string {
  if (e instanceof ApiError) {
    const labels = Array.from(new Set(e.polia.map((p) => FIELD_LABELS[p] ?? p)));
    return labels.length ? `${e.message}: ${labels.join(", ")}` : e.message;
  }
  return e instanceof Error ? e.message : "Neznáma chyba";
}
