import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildTemplateData,
  createSnapshot,
  formatIban,
  formatRodneCislo,
  fullName,
  loadSnapshotInput,
  trvanieText,
} from "../../src/lib/contracts/snapshot";
import type { Executor } from "../../src/lib/contracts/executor";
import { encryptField } from "../../src/lib/crypto/fieldCrypto";
import { flotila, input, source, vodic, vozidlo } from "./_data";

type D = Record<string, Record<string, string>> & Record<string, unknown>;

test("FO bez flotily: strana = vodič, bloky", () => {
  const d = buildTemplateData(source()) as D;
  assert.equal(d.flotila, null);
  assert.equal(d.koncesia, false);
  assert.equal(d.pravnicka_osoba, false);
  assert.equal(d.fyzicka_osoba, true);
  assert.equal(d.podnikatel, false);
  assert.equal(d.strana.nazov, "Testo Fiktívny");
  assert.equal(d.strana.sidlo, "Vymyslená 3, 040 01 Košice");
  assert.equal(d.strana.typ_text, "fyzická osoba");
  assert.equal(d.strana.statutar, "");
  assert.equal(d.vodic.rodne_cislo, "900101/0000");
  assert.equal(d.vodic.datum_narodenia, "01.01.1990");
  assert.equal(d.vodic.iban, "SK11 1111 1111 1111 1111 1111");
  assert.equal(d.firma.iban, "SK00 0000 0000 0000 0000 0000");
});

test("NAJOM: formáty zmluvy a vozidla", () => {
  const d = buildTemplateData(source({ input: input({ najomneSuma: 1234.5 }) })) as D;
  assert.equal(d.zmluva.cislo, "NZ-2026-001");
  assert.equal(d.zmluva.najomne, "1 234,50 €");
  assert.equal(d.zmluva.najomne_slovom, "tisíc dvesto tridsaťštyri eur a päťdesiat centov");
  assert.equal(d.zmluva.najomne_jednotka_text, "za jednu zmenu (12 h)");
  assert.equal(d.zmluva.najomne_24h, "110,00 €");
  assert.equal(d.zmluva.kaucia, "300,00 €");
  assert.equal(d.zmluva.kaucia_slovom, "tristo eur");
  assert.equal(d.zmluva.trvanie_text, "na dobu neurčitú");
  assert.equal(d.zmluva.stav_km_odovzdanie, "45 230 km");
  assert.equal(d.zmluva.miesto_podpisu, "Košiciach");
  assert.equal(d.zmluva.datum_uzavretia, "01.02.2026");
  assert.equal(d.zmluva.typ_nazov, "Zmluva o nájme dopravného prostriedku");
  assert.equal(d.vozidlo.nazov, "Značka Model X1");
  assert.equal(d.vozidlo.ecv, "KE000ZZ");
  assert.equal(d.vozidlo.pohon, "elektrický");
  assert.equal(d.vozidlo.stav_km, "45 230 km");
  assert.equal(d.je_elektricke, true);
  assert.equal(d.je_spalovacie, false);
});

test("FO vo flotile: blok flotila je objekt s údajmi flotily a dohody", () => {
  const d = buildTemplateData(
    source({ vodic: vodic({ fleetId: 7, rezim: "VO_FLOTILE" }), flotila: flotila() })
  ) as D;
  assert.ok(d.flotila && typeof d.flotila === "object");
  assert.equal(d.flotila.nazov, "Flotila Príklad s.r.o.");
  assert.equal(d.flotila.zmluva_cislo, "DF-2026-01");
  assert.equal(d.flotila.zmluva_platnost_od, "01.01.2026");
  assert.equal(d.flotila.zmluva_platnost_do, "");
  assert.equal(d.koncesia, false);
});

test("flotila sa uvádza len keď ju vodič má (fleetId)", () => {
  const d = buildTemplateData(source({ vodic: vodic({ fleetId: null }), flotila: flotila() })) as D;
  assert.equal(d.flotila, null);
});

test("PO s vlastnou koncesiou: strana = s.r.o. z profilu", () => {
  const d = buildTemplateData(
    source({
      vodic: vodic({
        stranaTyp: "PRAVNICKA_OSOBA",
        rezim: "VLASTNA_KONCESIA",
        firmaObchodneMeno: "Vodičova Firma s.r.o.",
        firmaIco: "11223344",
        firmaDic: "1122334455",
        firmaIcDph: null,
        firmaSidlo: "Firemná 9, 040 01 Košice",
        firmaZapisanyV: "OR MS Košice, Sro 99999/V",
        cisloKoncesie: "KONC-01",
        koncesiaPlatnostDo: "2028-12-31",
        firmaStatutar: "Testo Fiktívny",
      }),
    })
  ) as D;
  assert.equal(d.pravnicka_osoba, true);
  assert.equal(d.fyzicka_osoba, false);
  assert.equal(d.koncesia, true);
  assert.equal(d.podnikatel, true);
  assert.equal(d.strana.nazov, "Vodičova Firma s.r.o.");
  assert.equal(d.strana.sidlo, "Firemná 9, 040 01 Košice");
  assert.equal(d.strana.statutar, "Testo Fiktívny");
  assert.equal(d.strana.cislo_koncesie, "KONC-01");
  assert.equal(d.strana.koncesia_platnost, "31.12.2028");
  assert.equal(d.strana.ic_dph, "");
  assert.equal(d.strana.typ_text, "právnická osoba");
});

test("podnikateľ SZČO: obchodné meno/sídlo zo živnosti, IČO vyplnené", () => {
  const d = buildTemplateData(
    source({
      vodic: vodic({
        rezim: "VLASTNA_KONCESIA",
        firmaObchodneMeno: "Testo Fiktívny – TAXI",
        firmaIco: "55667788",
        firmaDic: "5566778899",
        cisloKoncesie: "KONC-02",
      }),
    })
  ) as D;
  assert.equal(d.podnikatel, true);
  assert.equal(d.fyzicka_osoba, true);
  assert.equal(d.strana.nazov, "Testo Fiktívny – TAXI");
  assert.equal(d.strana.sidlo, "Vymyslená 3, 040 01 Košice"); // firmaSidlo prázdne → trvalý pobyt
  assert.equal(d.strana.ico, "55667788");
  assert.equal(d.strana.typ_text, "fyzická osoba – podnikateľ");
  assert.equal(d.strana.statutar, "");
});

test("DISPECING: bez vozidla, provízia a registračný poplatok", () => {
  const d = buildTemplateData(
    source({ typ: "DISPECING", vozidlo: vozidlo(), meta: { cislo: "DS-2026-004", verzia: 2, datumVygenerovania: "2026-03-01" } })
  ) as D;
  assert.equal(d.vozidlo, null);
  assert.equal(d.je_elektricke, false);
  assert.equal(d.je_spalovacie, false);
  assert.equal(d.zmluva.provizia, "15 %");
  assert.equal(d.zmluva.poplatok_registracny, "30,00 €");
  assert.equal(d.zmluva.najomne, "");
  assert.equal(d.zmluva.kaucia, "");
  assert.equal(d.zmluva.cislo, "DS-2026-004");
  assert.equal(d.zmluva.verzia, "2");
  assert.equal(d.zmluva.typ_nazov, "Zmluva o poskytovaní dispečerských služieb");
});

test("pomocné formáty", () => {
  assert.equal(trvanieText("2026-01-01", null), "na dobu neurčitú");
  assert.equal(trvanieText("2026-01-01", "2026-12-31"), "na dobu určitú od 01.01.2026 do 31.12.2026");
  assert.equal(formatIban("sk00 0000 0000 0000 0000 0000"), "SK00 0000 0000 0000 0000 0000");
  assert.equal(formatRodneCislo("530101123"), "530101/123");
  assert.equal(fullName({ titulPred: "Ing.", meno: "A", priezvisko: "B", titulZa: "PhD." }), "Ing. A B, PhD.");
  const sn = createSnapshot(source());
  assert.equal(sn.schema, 1);
  assert.deepEqual(sn.znacky, buildTemplateData(source()));
});

test("loadSnapshotInput: dešifruje RČ/OP s AAD na userId a zostaví zdroj", async () => {
  const prev = { k: process.env.FIELD_ENC_KEYS, a: process.env.FIELD_ENC_ACTIVE };
  process.env.FIELD_ENC_KEYS = `t1:${Buffer.alloc(32, 7).toString("base64")}`;
  process.env.FIELD_ENC_ACTIVE = "t1";
  try {
    const rc = encryptField("9001010000", "rodneCislo:42");
    const op = encryptField("XX000000", "cisloOp:42");
    const sqls: string[] = [];
    const ex: Executor = {
      async query<T>(sql: string): Promise<T[]> {
        sqls.push(sql);
        let rows: unknown[] = [];
        if (sql.includes("FROM `User`")) rows = [{ id: 42, meno: "Testo", priezvisko: "Fiktívny", email: null, telefon: "1", volaciZnak: null }];
        else if (sql.includes("FROM `DriverProfile`"))
          rows = [{ userId: 42, rodneCisloEnc: rc, cisloOpEnc: op, datumNarodenia: "1990-01-01", fleetId: 7, rezim: "VO_FLOTILE", stranaTyp: "FYZICKA_OSOBA" }];
        else if (sql.includes("FROM `CompanyProfile`")) rows = [{ id: 1, obchodneMeno: "Vzorová Taxi s.r.o." }];
        else if (sql.includes("FROM `FleetAgreement`")) rows = [{ cislo: "DF-1", datumUzavretia: "2026-01-01", platnostOd: "2026-01-01", platnostDo: null }];
        else if (sql.includes("FROM `Fleet`")) rows = [{ id: 7, obchodneMeno: "Flotila Príklad s.r.o." }];
        else if (sql.includes("FROM `Vehicle`")) rows = [{ id: 5, znacka: "Z", model: "M", druhPohonu: "BENZIN", vlastnikTyp: "ETAXI", rokVyroby: 2020, stavKm: 100 }];
        return rows as T[];
      },
      async execute() {
        throw new Error("nepoužíva sa");
      },
    };
    const src = await loadSnapshotInput(ex, { typ: "NAJOM", driverId: 42, vehicleId: 5, input: input() });
    assert.ok(src);
    assert.equal(src.vodic?.rodneCislo, "9001010000");
    assert.equal(src.vodic?.cisloOp, "XX000000");
    assert.equal(src.flotila?.obchodneMeno, "Flotila Príklad s.r.o.");
    assert.equal(src.flotila?.dohoda?.cislo, "DF-1");
    assert.equal(src.vozidlo?.vlastnikNazov, "Vzorová Taxi s.r.o.");
    assert.equal(src.meta.cislo, null);
    // Dispečing: vozidlo sa nenačítava.
    sqls.length = 0;
    const disp = await loadSnapshotInput(ex, { typ: "DISPECING", driverId: 42, vehicleId: 5, input: input() });
    assert.equal(disp?.vozidlo, null);
    assert.ok(!sqls.some((q) => q.includes("FROM `Vehicle`")));
  } finally {
    process.env.FIELD_ENC_KEYS = prev.k;
    process.env.FIELD_ENC_ACTIVE = prev.a;
    if (prev.k === undefined) delete process.env.FIELD_ENC_KEYS;
    if (prev.a === undefined) delete process.env.FIELD_ENC_ACTIVE;
  }
});

test("loadSnapshotInput: neexistujúci vodič → null", async () => {
  const ex: Executor = { query: async () => [], execute: async () => ({ insertId: 0, affectedRows: 0 }) };
  assert.equal(await loadSnapshotInput(ex, { typ: "NAJOM", driverId: 1, input: input() }), null);
});
