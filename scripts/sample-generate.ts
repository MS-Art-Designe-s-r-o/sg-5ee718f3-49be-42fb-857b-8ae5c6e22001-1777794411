// Ukážkové zmluvy z FIKTÍVNYCH údajov — na ručnú kontrolu šablón (bez DB).
//
// Spustenie (z koreňa projektu):
//   npx tsx scripts/sample-generate.ts <outDir>
// Použije tests/fixtures/sablona-najom.docx, sablona-dispecing.docx a sablona-dispecing-vodic.docx, rovnaké
// buildTemplateData + renderDocx ako portál. Vytvorí viac variantov (FO bez
// flotily, FO vo flotile, s.r.o. s vlastnou koncesiou).
import { promises as fs } from "node:fs";
import path from "node:path";
import { buildTemplateData } from "../src/lib/contracts/snapshot";
import { renderDocx } from "../src/lib/contracts/render";
import { contractFileName } from "../src/lib/contracts/storage";
import type { SnapshotSource, SnapshotVodic } from "../src/lib/contracts/types";

const FIX = path.join(__dirname, "..", "tests", "fixtures");

const firma: SnapshotSource["firma"] = {
  obchodneMeno: "Vzorová Taxi s.r.o.",
  ico: "12345678",
  dic: "2020123456",
  icDph: "SK2020123456",
  sidlo: "Hlavná 1, 040 01 Košice",
  zapisanyV: "Obchodný register Mestského súdu Košice, oddiel: Sro, vložka č. 00000/V",
  statutar: "Konateľ Fiktívny",
  statutarFunkcia: "konateľ",
  iban: "SK0000000000000000000000",
  email: "info@vzor.example",
  telefon: "+421 900 000 000",
  web: "www.vzor.example",
};

const vodicFO: SnapshotVodic = {
  userId: 1,
  meno: "Testo",
  priezvisko: "Fiktívny",
  email: "testo@example.com",
  telefon: "+421 911 222 333",
  volaciZnak: "K-77",
  titulPred: null,
  titulZa: null,
  datumNarodenia: "1990-01-01",
  rodneCislo: "9001010000",
  cisloOp: "XX000000",
  trvalyPobyt: "Vymyslená 3, 040 01 Košice",
  cisloVp: "VP000000",
  cisloPvt: "PVT-0000",
  pvtPlatnostDo: "2030-12-31",
  iban: "SK1111111111111111111111",
  fleetId: null,
  rezim: null,
  stranaTyp: "FYZICKA_OSOBA",
  firmaObchodneMeno: null,
  firmaIco: null,
  firmaDic: null,
  firmaIcDph: null,
  firmaSidlo: null,
  firmaZapisanyV: null,
  cisloKoncesie: null,
  koncesiaPlatnostDo: null,
  firmaStatutar: null,
};

const flotila: SnapshotSource["flotila"] = {
  id: 7,
  obchodneMeno: "Flotila Príklad s.r.o.",
  ico: "87654321",
  dic: "2020654321",
  icDph: null,
  sidlo: "Bočná 2, 040 01 Košice",
  zapisanyV: "OR Mestského súdu Košice, oddiel Sro, vložka č. 11111/V",
  statutar: "Štatutár Flotilový",
  cisloKoncesie: "KONC-FLOT-01",
  iban: "SK2222222222222222222222",
  kontaktMeno: null,
  kontaktTelefon: null,
  kontaktEmail: null,
  dohoda: { cislo: "DF-2026-01", datumUzavretia: "2026-01-01", platnostOd: "2026-01-01", platnostDo: null },
};

const vodicPO: SnapshotVodic = {
  ...vodicFO,
  userId: 2,
  meno: "Druhý",
  priezvisko: "Vymyslený",
  rezim: "VLASTNA_KONCESIA",
  stranaTyp: "PRAVNICKA_OSOBA",
  firmaObchodneMeno: "Vodičova Firma s.r.o.",
  firmaIco: "11223344",
  firmaDic: "1122334455",
  firmaIcDph: null,
  firmaSidlo: "Firemná 9, 040 01 Košice",
  firmaZapisanyV: "OR Mestského súdu Košice, oddiel Sro, vložka č. 99999/V",
  cisloKoncesie: "KONC-PO-01",
  koncesiaPlatnostDo: "2028-12-31",
  firmaStatutar: "Druhý Vymyslený",
};

// SZČO (fyzická osoba – podnikateľ) s vlastnou koncesiou.
const vodicSZCO: SnapshotVodic = {
  ...vodicFO,
  userId: 3,
  meno: "Tretí",
  priezvisko: "Podnikavý",
  rezim: "VLASTNA_KONCESIA",
  stranaTyp: "FYZICKA_OSOBA",
  firmaObchodneMeno: "Tretí Podnikavý – TAXI",
  firmaIco: "55667788",
  firmaDic: "1055667788",
  firmaIcDph: null,
  firmaSidlo: "Podnikateľská 4, 040 01 Košice",
  firmaZapisanyV: "Živnostenský register OÚ Košice, č. 000-00000",
  cisloKoncesie: "KONC-SZCO-01",
  koncesiaPlatnostDo: "2029-06-30",
  firmaStatutar: null,
};

const vozidlo: SnapshotSource["vozidlo"] = {
  id: 5,
  nazov: "Auto 5",
  znacka: "Značka",
  model: "Model X1",
  spz: "KE000ZZ",
  farba: "biela",
  druhPohonu: "ELEKTRO",
  vin: "AAAAAAAAAAAAAAAAA",
  rokVyroby: 2022,
  cisloTp: "TP000000",
  datumPrvejEvidencie: "2022-03-15",
  vlastnikTyp: "ETAXI",
  vlastnikNazov: "Vzorová Taxi s.r.o.",
  poistovna: "Poisťovňa Príklad, a.s.",
  pzpCislo: "PZP-1",
  pzpPlatnostDo: "2030-12-31",
  havCislo: "HAV-1",
  havPlatnostDo: "2030-12-31",
  stkPlatnostDo: "2030-06-30",
  ekPlatnostDo: "2030-06-30",
  stavKm: 45230,
};

const input: SnapshotSource["input"] = {
  datumUzavretia: "2026-02-01",
  platnostOd: "2026-02-01",
  platnostDo: null,
  najomneSuma: 1234.5,
  najomneJednotka: "ZMENA",
  najomne24h: 110,
  kaucia: 300,
  spoluucast: 500,
  stavKmOdovzdanie: 45230,
  provizia: 15,
  poplatokRegistracny: 30,
};

function src(typ: SnapshotSource["typ"], v: SnapshotVodic, withFleet: boolean, cislo: string): SnapshotSource {
  return {
    typ,
    firma,
    vodic: withFleet ? { ...v, fleetId: 7, rezim: "VO_FLOTILE" } : v,
    flotila: withFleet ? flotila : null,
    vozidlo: typ === "NAJOM" ? vozidlo : null,
    vehicleId: typ === "NAJOM" ? 5 : null,
    input,
    meta: { cislo, verzia: 1, datumVygenerovania: "2026-02-01" },
  };
}

async function main() {
  const out = process.argv[2];
  if (!out) {
    console.error("Použitie: npx tsx scripts/sample-generate.ts <outDir>");
    process.exit(2);
  }
  const najom = await fs.readFile(path.join(FIX, "sablona-najom.docx"));
  const disp = await fs.readFile(path.join(FIX, "sablona-dispecing.docx"));
  const dispV = await fs.readFile(path.join(FIX, "sablona-dispecing-vodic.docx"));
  const varianty: [string, Buffer, SnapshotSource][] = [
    ["FO", najom, src("NAJOM", vodicFO, false, "NZ-2026-001")],
    ["FO-flotila", najom, src("NAJOM", vodicFO, true, "NZ-2026-002")],
    ["PO-koncesia", najom, src("NAJOM", vodicPO, false, "NZ-2026-003")],
    ["FO-flotila", disp, src("DISPECING", vodicFO, true, "DS-2026-001")],
    ["PO-koncesia", disp, src("DISPECING", vodicPO, false, "DS-2026-002")],
    ["SZCO-koncesia", najom, src("NAJOM", vodicSZCO, false, "NZ-2026-004")],
    ["SZCO-koncesia", disp, src("DISPECING", vodicSZCO, false, "DS-2026-003")],
    // Dispečerská zmluva so zmluvnou stranou Partnerský vodič (nový vzor).
    ["V-FO", dispV, src("DISPECING", vodicFO, false, "DS-2026-004")],
    ["V-FO-flotila", dispV, src("DISPECING", vodicFO, true, "DS-2026-005")],
    ["V-PO-koncesia", dispV, src("DISPECING", vodicPO, false, "DS-2026-006")],
    ["V-SZCO-koncesia", dispV, src("DISPECING", vodicSZCO, false, "DS-2026-007")],
  ];
  await fs.mkdir(out, { recursive: true });
  for (const [nazov, tpl, s] of varianty) {
    const name = contractFileName({
      typ: s.typ,
      datum: String(s.input.datumUzavretia),
      ecv: s.vozidlo?.spz,
      priezvisko: s.vodic?.priezvisko,
      meno: s.vodic?.meno,
      verzia: 1,
    }).replace(/\.docx$/, `_${nazov}.docx`);
    await fs.writeFile(path.join(out, name), renderDocx(tpl, buildTemplateData(s)));
    console.log(`→ ${path.join(out, name)}`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : "Neznáma chyba");
  process.exit(1);
});
