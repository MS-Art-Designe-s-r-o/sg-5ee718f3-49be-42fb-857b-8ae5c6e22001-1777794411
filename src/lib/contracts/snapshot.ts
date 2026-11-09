// Snapshot zmluvy: načítanie vstupných údajov z DB a ich prevod na dáta šablóny.
//
// buildTemplateData() je ČISTÁ funkcia — rovnaké dáta používa náhľad aj
// generovanie, takže náhľad ukazuje presne to, čo bude v dokumente.
// loadSnapshotInput() je jediné miesto s DB prístupom (injektovaný executor).
import type { CompanyProfileRow, DriverProfileRow, FleetRow, NajomneJednotka, TypZmluvy } from "@/lib/db";
import { decryptField } from "@/lib/crypto/fieldCrypto";
import { amountInWords } from "./amountInWords";
import { formatDate, formatMoney, formatNumber, formatPercent } from "./format";
import { queryFirst, type Executor } from "./executor";
import {
  SNAPSHOT_SCHEMA_VERSION,
  type ContractInput,
  type ContractSnapshot,
  type SnapshotFirma,
  type SnapshotFlotila,
  type SnapshotMeta,
  type SnapshotSource,
  type SnapshotVodic,
  type SnapshotVozidlo,
} from "./types";

// ── Pomocné formátovanie ──────────────────────────────────────────────────────

const s = (v: unknown): string => (v === null || v === undefined ? "" : String(v).trim());

const has = (v: unknown): boolean => s(v) !== "";

/** Dátum alebo "" (neplatný dátum nezhodí generovanie — validácia ho rieši zvlášť). */
function d(v: string | null | undefined): string {
  try {
    return formatDate(v ?? null);
  } catch {
    return "";
  }
}

function money(v: number | null | undefined): string {
  return v === null || v === undefined ? "" : formatMoney(v);
}

function words(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(Number(v)) || Number(v) < 0) return "";
  return amountInWords(Number(v));
}

function km(v: number | null | undefined): string {
  return v === null || v === undefined ? "" : `${formatNumber(v, 0)} km`;
}

/** IBAN po štvoriciach („SK00 0000 …“). */
export function formatIban(v: string | null | undefined): string {
  const t = s(v).replace(/\s+/g, "").toUpperCase();
  return t.replace(/(.{4})(?=.)/g, "$1 ");
}

/** Rodné číslo „RRMMDD/XXXX“ (zo 9–10 číslic). */
export function formatRodneCislo(v: string | null | undefined): string {
  const t = s(v).replace(/[\s/]/g, "");
  return /^\d{9,10}$/.test(t) ? `${t.slice(0, 6)}/${t.slice(6)}` : t;
}

/** Tituly + meno + priezvisko („Ing. Ján Vzorový, PhD.“). */
export function fullName(v: Pick<SnapshotVodic, "titulPred" | "meno" | "priezvisko" | "titulZa"> | null): string {
  if (!v) return "";
  const base = [v.titulPred, v.meno, v.priezvisko].map(s).filter(Boolean).join(" ");
  return has(v.titulZa) ? `${base}, ${s(v.titulZa)}` : base;
}

export const POHON_TEXT: Record<string, string> = {
  ELEKTRO: "elektrický",
  HYBRID: "hybridný",
  BENZIN: "benzínový",
  DIESEL: "dieselový",
  LPG: "LPG",
  CNG: "CNG",
};

export const JEDNOTKA_TEXT: Record<NajomneJednotka, string> = {
  ZMENA: "za jednu zmenu (12 h)",
  DEN: "za deň",
  TYZDEN: "za týždeň",
  MESIAC: "za mesiac",
};

export const TYP_NAZOV: Record<TypZmluvy, string> = {
  NAJOM: "Zmluva o nájme dopravného prostriedku",
  DISPECING: "Zmluva o poskytovaní dispečerských služieb",
};

export const DEFAULT_MIESTO_PODPISU = "Košiciach";

/** „na dobu neurčitú“ alebo „na dobu určitú od … do …“. */
export function trvanieText(platnostOd: string | null, platnostDo: string | null): string {
  if (!has(platnostDo)) return "na dobu neurčitú";
  const od = d(platnostOd);
  return od ? `na dobu určitú od ${od} do ${d(platnostDo)}` : `na dobu určitú do ${d(platnostDo)}`;
}

// ── Odvodené príznaky ─────────────────────────────────────────────────────────

/** Odvodené príznaky strany a blokov (zdieľané s validáciou a náhľadom). */
export function deriveFlags(src: Pick<SnapshotSource, "typ" | "vodic" | "flotila" | "vozidlo">) {
  const v = src.vodic;
  const pravnicka = v?.stranaTyp === "PRAVNICKA_OSOBA";
  const vozidlo = src.typ === "NAJOM" ? src.vozidlo : null;
  const elektro = vozidlo?.druhPohonu === "ELEKTRO";
  return {
    pravnicka_osoba: pravnicka,
    fyzicka_osoba: !pravnicka,
    podnikatel: has(v?.firmaIco),
    koncesia: v?.rezim === "VLASTNA_KONCESIA",
    /** Flotila sa uvádza vždy, keď ju vodič má (fleetId) a existuje. */
    maFlotilu: !!(v?.fleetId && src.flotila),
    maVozidlo: !!vozidlo,
    je_elektricke: !!vozidlo && elektro,
    je_spalovacie: !!vozidlo && !elektro,
  };
}

// ── Dáta šablóny ──────────────────────────────────────────────────────────────

function firmaData(f: SnapshotFirma | null) {
  return {
    nazov: s(f?.obchodneMeno),
    ico: s(f?.ico),
    dic: s(f?.dic),
    ic_dph: s(f?.icDph),
    sidlo: s(f?.sidlo),
    zapisany_v: s(f?.zapisanyV),
    statutar: s(f?.statutar),
    statutar_funkcia: s(f?.statutarFunkcia),
    iban: formatIban(f?.iban),
    email: s(f?.email),
    telefon: s(f?.telefon),
    web: s(f?.web),
  };
}

function flotilaData(f: SnapshotFlotila) {
  return {
    nazov: s(f.obchodneMeno),
    ico: s(f.ico),
    dic: s(f.dic),
    ic_dph: s(f.icDph),
    sidlo: s(f.sidlo),
    zapisana_v: s(f.zapisanyV),
    statutar: s(f.statutar),
    cislo_koncesie: s(f.cisloKoncesie),
    iban: formatIban(f.iban),
    kontakt_meno: s(f.kontaktMeno),
    kontakt_telefon: s(f.kontaktTelefon),
    kontakt_email: s(f.kontaktEmail),
    zmluva_cislo: s(f.dohoda?.cislo),
    zmluva_datum: d(f.dohoda?.datumUzavretia),
    zmluva_platnost_od: d(f.dohoda?.platnostOd),
    zmluva_platnost_do: d(f.dohoda?.platnostDo),
  };
}

function vodicData(v: SnapshotVodic | null) {
  return {
    meno: s(v?.meno),
    priezvisko: s(v?.priezvisko),
    titul_pred: s(v?.titulPred),
    titul_za: s(v?.titulZa),
    cele_meno: fullName(v),
    datum_narodenia: d(v?.datumNarodenia),
    rodne_cislo: formatRodneCislo(v?.rodneCislo),
    cislo_op: s(v?.cisloOp),
    adresa: s(v?.trvalyPobyt),
    cislo_vp: s(v?.cisloVp),
    cislo_pvt: s(v?.cisloPvt),
    pvt_platnost: d(v?.pvtPlatnostDo),
    telefon: s(v?.telefon),
    email: s(v?.email),
    iban: formatIban(v?.iban),
    volaci_znak: s(v?.volaciZnak),
  };
}

/**
 * Zmluvná strana na strane vodiča:
 *  - PRAVNICKA_OSOBA → údaje s.r.o. z profilu (obchodné meno, sídlo, štatutár),
 *  - FYZICKA_OSOBA podnikateľ (IČO) → obchodné meno/sídlo SZČO, ak sú vyplnené, inak vodič,
 *  - FYZICKA_OSOBA → meno a trvalý pobyt vodiča.
 * IČO/DIČ/IČ DPH/koncesia sa berú z profilu vždy (v šablóne sú v blokoch).
 */
function stranaData(v: SnapshotVodic | null, flags: ReturnType<typeof deriveFlags>) {
  const meno = fullName(v);
  let nazov: string;
  let sidlo: string;
  let typText: string;
  if (flags.pravnicka_osoba) {
    nazov = s(v?.firmaObchodneMeno);
    sidlo = s(v?.firmaSidlo);
    typText = "právnická osoba";
  } else if (flags.podnikatel) {
    nazov = s(v?.firmaObchodneMeno) || meno;
    sidlo = s(v?.firmaSidlo) || s(v?.trvalyPobyt);
    typText = "fyzická osoba – podnikateľ";
  } else {
    nazov = meno;
    sidlo = s(v?.trvalyPobyt);
    typText = "fyzická osoba";
  }
  return {
    nazov,
    sidlo,
    ico: s(v?.firmaIco),
    dic: s(v?.firmaDic),
    ic_dph: s(v?.firmaIcDph),
    cislo_koncesie: s(v?.cisloKoncesie),
    koncesia_platnost: d(v?.koncesiaPlatnostDo),
    statutar: flags.pravnicka_osoba ? s(v?.firmaStatutar) : "",
    zapisana_v: flags.pravnicka_osoba || flags.podnikatel ? s(v?.firmaZapisanyV) : "",
    iban: formatIban(v?.iban),
    typ_text: typText,
  };
}

function vozidloData(v: SnapshotVozidlo) {
  return {
    znacka: s(v.znacka),
    model: s(v.model),
    nazov: [v.znacka, v.model].map(s).filter(Boolean).join(" "),
    ecv: s(v.spz),
    vin: s(v.vin),
    rok_vyroby: s(v.rokVyroby),
    farba: s(v.farba),
    cislo_tp: s(v.cisloTp),
    prva_evidencia: d(v.datumPrvejEvidencie),
    pohon: v.druhPohonu ? POHON_TEXT[v.druhPohonu] ?? "" : "",
    vlastnik_nazov: s(v.vlastnikNazov),
    poistovna: s(v.poistovna),
    pzp_cislo: s(v.pzpCislo),
    pzp_platnost: d(v.pzpPlatnostDo),
    hav_cislo: s(v.havCislo),
    hav_platnost: d(v.havPlatnostDo),
    stk_platnost: d(v.stkPlatnostDo),
    ek_platnost: d(v.ekPlatnostDo),
    stav_km: km(v.stavKm),
  };
}

function zmluvaData(src: SnapshotSource) {
  const i = src.input;
  const najom = src.typ === "NAJOM";
  return {
    cislo: s(src.meta.cislo),
    verzia: String(src.meta.verzia ?? 1),
    typ_nazov: TYP_NAZOV[src.typ],
    datum_uzavretia: d(i.datumUzavretia),
    platnost_od: d(i.platnostOd),
    platnost_do: d(i.platnostDo),
    trvanie_text: trvanieText(i.platnostOd, i.platnostDo),
    najomne: najom ? money(i.najomneSuma) : "",
    najomne_jednotka_text: najom ? JEDNOTKA_TEXT[i.najomneJednotka ?? "ZMENA"] ?? "" : "",
    najomne_slovom: najom ? words(i.najomneSuma) : "",
    najomne_24h: najom ? money(i.najomne24h) : "",
    kaucia: najom ? money(i.kaucia) : "",
    kaucia_slovom: najom ? words(i.kaucia) : "",
    spoluucast: money(i.spoluucast),
    stav_km_odovzdanie: najom ? km(i.stavKmOdovzdanie) : "",
    provizia: i.provizia === null || i.provizia === undefined ? "" : formatPercent(i.provizia),
    poplatok_registracny: money(i.poplatokRegistracny),
    miesto_podpisu: s(i.miestoPodpisu) || DEFAULT_MIESTO_PODPISU,
    datum_vygenerovania: d(src.meta.datumVygenerovania),
  };
}

/**
 * Dáta pre docxtemplater (všetky hodnoty sú už sformátované reťazce).
 * Bloky: `flotila` a `vozidlo` sú objekt alebo null; ostatné boolean.
 */
export function buildTemplateData(src: SnapshotSource): Record<string, unknown> {
  const flags = deriveFlags(src);
  return {
    firma: firmaData(src.firma),
    flotila: flags.maFlotilu && src.flotila ? flotilaData(src.flotila) : null,
    vodic: vodicData(src.vodic),
    strana: stranaData(src.vodic, flags),
    vozidlo: flags.maVozidlo && src.vozidlo ? vozidloData(src.vozidlo) : null,
    zmluva: zmluvaData(src),
    koncesia: flags.koncesia,
    pravnicka_osoba: flags.pravnicka_osoba,
    fyzicka_osoba: flags.fyzicka_osoba,
    podnikatel: flags.podnikatel,
    je_elektricke: flags.je_elektricke,
    je_spalovacie: flags.je_spalovacie,
  };
}

/** Úplný snapshot (vstupy + odvodené značky) pripravený na šifrovanie. */
export function createSnapshot(src: SnapshotSource): ContractSnapshot {
  return { ...src, schema: SNAPSHOT_SCHEMA_VERSION, znacky: buildTemplateData(src) };
}

// ── Načítanie z DB ────────────────────────────────────────────────────────────

/** Dnešný dátum 'YYYY-MM-DD' (lokálny čas servera). */
export function todayIso(now: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

const dateOnly = (v: string | null | undefined): string | null => (v ? String(v).slice(0, 10) : null);
const numOrNull = (v: unknown): number | null =>
  v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v);

function decryptOrThrow(enc: string | null, aad: string): string | null {
  return enc ? decryptField(enc, aad) : null;
}

type UserBasic = {
  id: number;
  meno: string;
  priezvisko: string;
  email: string | null;
  telefon: string | null;
  volaciZnak: string | null;
};

type VehicleRowLite = {
  id: number;
  nazov: string | null;
  znacka: string | null;
  model: string | null;
  spz: string | null;
  farba: string | null;
  druhPohonu: SnapshotVozidlo["druhPohonu"];
  vin: string | null;
  rokVyroby: number | null;
  cisloTp: string | null;
  datumPrvejEvidencie: string | null;
  vlastnikTyp: "ETAXI" | "FLOTILA" | null;
  vlastnikFleetId: number | null;
  poistovna: string | null;
  pzpCislo: string | null;
  pzpPlatnostDo: string | null;
  havCislo: string | null;
  havPlatnostDo: string | null;
  stkPlatnostDo: string | null;
  ekPlatnostDo: string | null;
  stavKm: number | null;
};

export type LoadSnapshotParams = {
  typ: TypZmluvy;
  driverId: number;
  vehicleId?: number | null;
  input: ContractInput;
  meta?: Partial<SnapshotMeta>;
};

/**
 * Načíta všetky vstupné údaje zmluvy. Vodič musí existovať (inak null).
 * RČ a číslo OP sa dešifrujú (AAD "rodneCislo:<userId>" / "cisloOp:<userId>").
 */
export async function loadSnapshotInput(ex: Executor, p: LoadSnapshotParams): Promise<SnapshotSource | null> {
  const user = await queryFirst<UserBasic>(
    ex,
    "SELECT u.`id`, u.`meno`, u.`priezvisko`, u.`email`, u.`telefon`, u.`volaciZnak` FROM `User` u " +
      "JOIN `UserRole` r ON r.`userId` = u.`id` AND r.`role` = 'VODIC' WHERE u.`id` = ? LIMIT 1",
    [p.driverId]
  );
  if (!user) return null;

  const profil = await queryFirst<DriverProfileRow>(ex, "SELECT * FROM `DriverProfile` WHERE `userId` = ?", [
    user.id,
  ]);
  const firmaRow = await queryFirst<CompanyProfileRow>(ex, "SELECT * FROM `CompanyProfile` WHERE `id` = 1");

  const vodic: SnapshotVodic = {
    userId: user.id,
    meno: user.meno ?? null,
    priezvisko: user.priezvisko ?? null,
    email: user.email ?? null,
    telefon: user.telefon ?? null,
    volaciZnak: user.volaciZnak ?? null,
    titulPred: profil?.titulPred ?? null,
    titulZa: profil?.titulZa ?? null,
    datumNarodenia: dateOnly(profil?.datumNarodenia),
    rodneCislo: decryptOrThrow(profil?.rodneCisloEnc ?? null, `rodneCislo:${user.id}`),
    cisloOp: decryptOrThrow(profil?.cisloOpEnc ?? null, `cisloOp:${user.id}`),
    trvalyPobyt: profil?.trvalyPobyt ?? null,
    cisloVp: profil?.cisloVp ?? null,
    cisloPvt: profil?.cisloPvt ?? null,
    pvtPlatnostDo: dateOnly(profil?.pvtPlatnostDo),
    iban: profil?.iban ?? null,
    fleetId: profil?.fleetId ?? null,
    rezim: profil?.rezim ?? null,
    stranaTyp: profil?.stranaTyp ?? null,
    firmaObchodneMeno: profil?.firmaObchodneMeno ?? null,
    firmaIco: profil?.firmaIco ?? null,
    firmaDic: profil?.firmaDic ?? null,
    firmaIcDph: profil?.firmaIcDph ?? null,
    firmaSidlo: profil?.firmaSidlo ?? null,
    firmaZapisanyV: profil?.firmaZapisanyV ?? null,
    cisloKoncesie: profil?.cisloKoncesie ?? null,
    koncesiaPlatnostDo: dateOnly(profil?.koncesiaPlatnostDo),
    firmaStatutar: profil?.firmaStatutar ?? null,
  };

  const firma: SnapshotFirma | null = firmaRow
    ? {
        obchodneMeno: firmaRow.obchodneMeno ?? null,
        ico: firmaRow.ico,
        dic: firmaRow.dic,
        icDph: firmaRow.icDph,
        sidlo: firmaRow.sidlo,
        zapisanyV: firmaRow.zapisanyV,
        statutar: firmaRow.statutar,
        statutarFunkcia: firmaRow.statutarFunkcia,
        iban: firmaRow.iban,
        email: firmaRow.email,
        telefon: firmaRow.telefon,
        web: firmaRow.web,
      }
    : null;

  let flotila: SnapshotFlotila | null = null;
  if (vodic.fleetId) {
    const f = await queryFirst<FleetRow>(ex, "SELECT * FROM `Fleet` WHERE `id` = ?", [vodic.fleetId]);
    if (f) {
      const dohoda = await queryFirst<{
        cislo: string;
        datumUzavretia: string | null;
        platnostOd: string | null;
        platnostDo: string | null;
      }>(
        ex,
        "SELECT `cislo`, `datumUzavretia`, `platnostOd`, `platnostDo` FROM `FleetAgreement` " +
          "WHERE `fleetId` = ? AND `platnostOd` <= CURDATE() AND (`platnostDo` IS NULL OR `platnostDo` >= CURDATE()) " +
          "ORDER BY `platnostOd` DESC, `id` DESC LIMIT 1",
        [f.id]
      );
      flotila = {
        id: f.id,
        obchodneMeno: f.obchodneMeno,
        ico: f.ico,
        dic: f.dic,
        icDph: f.icDph,
        sidlo: f.sidlo,
        zapisanyV: f.zapisanyV,
        statutar: f.statutar,
        cisloKoncesie: f.cisloKoncesie,
        iban: f.iban,
        kontaktMeno: f.kontaktMeno,
        kontaktTelefon: f.kontaktTelefon,
        kontaktEmail: f.kontaktEmail,
        dohoda: dohoda
          ? {
              cislo: dohoda.cislo,
              datumUzavretia: dateOnly(dohoda.datumUzavretia),
              platnostOd: dateOnly(dohoda.platnostOd),
              platnostDo: dateOnly(dohoda.platnostDo),
            }
          : null,
      };
    }
  }

  // Dispečerská zmluva vozidlo nemá.
  const vehicleId = p.typ === "NAJOM" && p.vehicleId ? p.vehicleId : null;
  let vozidlo: SnapshotVozidlo | null = null;
  if (vehicleId) {
    const v = await queryFirst<VehicleRowLite>(
      ex,
      "SELECT `id`, `nazov`, `znacka`, `model`, `spz`, `farba`, `druhPohonu`, `vin`, `rokVyroby`, `cisloTp`, " +
        "`datumPrvejEvidencie`, `vlastnikTyp`, `vlastnikFleetId`, `poistovna`, `pzpCislo`, `pzpPlatnostDo`, " +
        "`havCislo`, `havPlatnostDo`, `stkPlatnostDo`, `ekPlatnostDo`, `stavKm` FROM `Vehicle` WHERE `id` = ?",
      [vehicleId]
    );
    if (v) {
      let vlastnikNazov: string | null = firma?.obchodneMeno ?? null;
      if (v.vlastnikTyp === "FLOTILA") {
        const vf = v.vlastnikFleetId
          ? await queryFirst<{ obchodneMeno: string }>(ex, "SELECT `obchodneMeno` FROM `Fleet` WHERE `id` = ?", [
              v.vlastnikFleetId,
            ])
          : null;
        vlastnikNazov = vf?.obchodneMeno ?? null;
      }
      vozidlo = {
        id: v.id,
        nazov: v.nazov,
        znacka: v.znacka,
        model: v.model,
        spz: v.spz,
        farba: v.farba,
        druhPohonu: v.druhPohonu,
        vin: v.vin,
        rokVyroby: numOrNull(v.rokVyroby),
        cisloTp: v.cisloTp,
        datumPrvejEvidencie: dateOnly(v.datumPrvejEvidencie),
        vlastnikTyp: v.vlastnikTyp ?? "ETAXI",
        vlastnikNazov,
        poistovna: v.poistovna,
        pzpCislo: v.pzpCislo,
        pzpPlatnostDo: dateOnly(v.pzpPlatnostDo),
        havCislo: v.havCislo,
        havPlatnostDo: dateOnly(v.havPlatnostDo),
        stkPlatnostDo: dateOnly(v.stkPlatnostDo),
        ekPlatnostDo: dateOnly(v.ekPlatnostDo),
        stavKm: numOrNull(v.stavKm),
      };
    }
  }

  return {
    typ: p.typ,
    firma,
    vodic,
    flotila,
    vozidlo,
    vehicleId,
    input: { ...p.input, miestoPodpisu: p.input.miestoPodpisu ?? null },
    meta: {
      cislo: p.meta?.cislo ?? null,
      verzia: p.meta?.verzia ?? 1,
      datumVygenerovania: p.meta?.datumVygenerovania ?? todayIso(),
    },
  };
}
