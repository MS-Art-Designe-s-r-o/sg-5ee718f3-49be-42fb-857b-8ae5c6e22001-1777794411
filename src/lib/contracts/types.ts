// Typy modulu zmlúv: vstupy, snapshot a jeho časti.
//
// Snapshot = VŠETKY údaje, z ktorých sa dokument vyrenderoval (v surovom tvare,
// vrátane dešifrovaného RČ a čísla OP) + odvodené textové značky. V DB je
// uložený len zašifrovaný (Contract.snapshotEnc, AAD "snapshot:<contractId>").
// Dátumy sú reťazce 'YYYY-MM-DD', sumy čísla (eurá), provízia v percentách.
import type { DriverRezim, DruhPohonu, NajomneJednotka, StranaTyp, TypZmluvy } from "@/lib/db";

export type { NajomneJednotka, TypZmluvy };

/** Verzia schémy snapshotu — pri nekompatibilnej zmene zvýšiť. */
export const SNAPSHOT_SCHEMA_VERSION = 1;

export type SnapshotFirma = {
  obchodneMeno: string | null;
  ico: string | null;
  dic: string | null;
  icDph: string | null;
  sidlo: string | null;
  zapisanyV: string | null;
  statutar: string | null;
  statutarFunkcia: string | null;
  iban: string | null;
  email: string | null;
  telefon: string | null;
  web: string | null;
};

export type SnapshotFleetAgreement = {
  cislo: string;
  datumUzavretia: string | null;
  platnostOd: string | null;
  platnostDo: string | null;
};

export type SnapshotFlotila = {
  id: number;
  obchodneMeno: string | null;
  ico: string | null;
  dic: string | null;
  icDph: string | null;
  sidlo: string | null;
  zapisanyV: string | null;
  statutar: string | null;
  cisloKoncesie: string | null;
  iban: string | null;
  kontaktMeno: string | null;
  kontaktTelefon: string | null;
  kontaktEmail: string | null;
  /** Dnes platná dohoda E-TAXI s flotilou (alebo null). */
  dohoda: SnapshotFleetAgreement | null;
};

export type SnapshotVodic = {
  userId: number;
  meno: string | null;
  priezvisko: string | null;
  email: string | null;
  telefon: string | null;
  volaciZnak: string | null;
  titulPred: string | null;
  titulZa: string | null;
  datumNarodenia: string | null;
  /** Dešifrované (normalizované, bez lomky). */
  rodneCislo: string | null;
  /** Dešifrované. */
  cisloOp: string | null;
  trvalyPobyt: string | null;
  cisloVp: string | null;
  cisloPvt: string | null;
  pvtPlatnostDo: string | null;
  iban: string | null;
  fleetId: number | null;
  rezim: DriverRezim | null;
  stranaTyp: StranaTyp | null;
  firmaObchodneMeno: string | null;
  firmaIco: string | null;
  firmaDic: string | null;
  firmaIcDph: string | null;
  firmaSidlo: string | null;
  firmaZapisanyV: string | null;
  cisloKoncesie: string | null;
  koncesiaPlatnostDo: string | null;
  firmaStatutar: string | null;
};

export type SnapshotVozidlo = {
  id: number;
  nazov: string | null;
  znacka: string | null;
  model: string | null;
  spz: string | null;
  farba: string | null;
  druhPohonu: DruhPohonu | null;
  vin: string | null;
  rokVyroby: number | null;
  cisloTp: string | null;
  datumPrvejEvidencie: string | null;
  vlastnikTyp: "ETAXI" | "FLOTILA" | null;
  /** Obchodné meno vlastníka (firma alebo flotila). */
  vlastnikNazov: string | null;
  poistovna: string | null;
  pzpCislo: string | null;
  pzpPlatnostDo: string | null;
  havCislo: string | null;
  havPlatnostDo: string | null;
  stkPlatnostDo: string | null;
  ekPlatnostDo: string | null;
  stavKm: number | null;
};

/** Vstup z modálu generovania (predvolené hodnoty dodáva modál, nie modul). */
export type ContractInput = {
  datumUzavretia: string | null;
  platnostOd: string | null;
  platnostDo: string | null;
  najomneSuma: number | null;
  najomneJednotka: NajomneJednotka;
  najomne24h: number | null;
  kaucia: number | null;
  spoluucast: number | null;
  stavKmOdovzdanie: number | null;
  /** Percentá (napr. 15 = 15 %). */
  provizia: number | null;
  poplatokRegistracny: number | null;
  /** Miesto podpisu v tvare po predložke „V“ (default „Košiciach“). */
  miestoPodpisu?: string | null;
};

/** Načítané vstupné údaje (bez čísla zmluvy) — zdroj pre validáciu aj náhľad. */
export type SnapshotSource = {
  typ: TypZmluvy;
  firma: SnapshotFirma | null;
  vodic: SnapshotVodic | null;
  /** Flotila vodiča (podľa DriverProfile.fleetId), ak existuje. */
  flotila: SnapshotFlotila | null;
  /** Vozidlo (len NAJOM). */
  vozidlo: SnapshotVozidlo | null;
  /** Požadované ID vozidla (aj keď sa vozidlo nenašlo). */
  vehicleId: number | null;
  input: ContractInput;
  meta: SnapshotMeta;
};

export type SnapshotMeta = {
  /** Číslo zmluvy (pri náhľade null). */
  cislo: string | null;
  verzia: number;
  /** Dátum vygenerovania 'YYYY-MM-DD'. */
  datumVygenerovania: string;
};

/** Snapshot uložený (šifrovane) pri zmluve. */
export type ContractSnapshot = SnapshotSource & {
  schema: typeof SNAPSHOT_SCHEMA_VERSION;
  /** Odvodené dáta pre šablónu (presne to, čo dostal docxtemplater). */
  znacky: Record<string, unknown>;
};

export type ValidationMissing = { pole: string; label: string; odkaz: string | null };
export type ValidationWarning = { pole: string; text: string };
export type ValidationResult = { chybajuce: ValidationMissing[]; varovania: ValidationWarning[] };
