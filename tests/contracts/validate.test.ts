import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSnapshotInput } from "../../src/lib/contracts/validate";
import { firma, flotila, input, source, vodic, vozidlo } from "./_data";

const TODAY = "2026-01-15";
const poles = (src: Parameters<typeof validateSnapshotInput>[0]) =>
  validateSnapshotInput(src, TODAY).chybajuce.map((c) => c.pole);

test("kompletné údaje FO bez flotily → bez chýb", () => {
  const r = validateSnapshotInput(source(), TODAY);
  assert.deepEqual(r.chybajuce, []);
});

test("povinné údaje firmy s odkazom na nastavenia firmy", () => {
  const r = validateSnapshotInput(source({ firma: firma({ ico: null, statutar: " " }) }), TODAY);
  assert.deepEqual(r.chybajuce, [
    { pole: "firma.ico", label: "IČO firmy", odkaz: "/portal/nastavenia-firmy" },
    { pole: "firma.statutar", label: "Štatutár firmy", odkaz: "/portal/nastavenia-firmy" },
  ]);
  assert.equal(poles(source({ firma: null })).length, 5);
});

test("povinné údaje vodiča s odkazom na profil", () => {
  const keys = ["meno", "priezvisko", "datumNarodenia", "rodneCislo", "cisloOp", "trvalyPobyt", "telefon", "cisloPvt"] as const;
  for (const k of keys) {
    const r = validateSnapshotInput(source({ vodic: vodic({ [k]: null }) }), TODAY);
    assert.deepEqual(r.chybajuce.map((c) => c.pole), [`vodic.${k}`], k);
    assert.equal(r.chybajuce[0].odkaz, "/portal/vodici?profil=42");
    assert.ok(r.chybajuce[0].label.length > 3);
  }
});

test("PRAVNICKA_OSOBA vyžaduje obchodné meno, IČO a sídlo", () => {
  assert.deepEqual(poles(source({ vodic: vodic({ stranaTyp: "PRAVNICKA_OSOBA" }) })), [
    "vodic.firmaObchodneMeno",
    "vodic.firmaIco",
    "vodic.firmaSidlo",
  ]);
});

test("VLASTNA_KONCESIA vyžaduje IČO, DIČ a číslo koncesie; IČ DPH nie", () => {
  assert.deepEqual(poles(source({ vodic: vodic({ rezim: "VLASTNA_KONCESIA" }) })), [
    "vodic.firmaIco",
    "vodic.firmaDic",
    "vodic.cisloKoncesie",
  ]);
  assert.deepEqual(
    poles(
      source({
        vodic: vodic({ rezim: "VLASTNA_KONCESIA", firmaIco: "1", firmaDic: "2", cisloKoncesie: "3", firmaIcDph: null }),
      })
    ),
    []
  );
  // PO + koncesia: IČO sa nehlási dvakrát.
  const p = poles(source({ vodic: vodic({ rezim: "VLASTNA_KONCESIA", stranaTyp: "PRAVNICKA_OSOBA" }) }));
  assert.equal(p.filter((x) => x === "vodic.firmaIco").length, 1);
});

test("VO_FLOTILE: flotila musí byť nastavená, existovať a mať povinné údaje", () => {
  const r1 = validateSnapshotInput(source({ vodic: vodic({ rezim: "VO_FLOTILE", fleetId: null }) }), TODAY);
  assert.deepEqual(r1.chybajuce.map((c) => c.pole), ["vodic.fleetId"]);
  const r2 = validateSnapshotInput(source({ vodic: vodic({ rezim: "VO_FLOTILE", fleetId: 7 }), flotila: null }), TODAY);
  assert.deepEqual(r2.chybajuce, [{ pole: "flotila", label: "Flotila vodiča neexistuje", odkaz: "/portal/flotily" }]);
  const r3 = validateSnapshotInput(
    source({ vodic: vodic({ rezim: "VO_FLOTILE", fleetId: 7 }), flotila: flotila({ ico: null, statutar: null }) }),
    TODAY
  );
  assert.deepEqual(r3.chybajuce.map((c) => c.pole), ["flotila.ico", "flotila.statutar"]);
  assert.ok(r3.chybajuce.every((c) => c.odkaz === "/portal/flotily"));
  assert.deepEqual(poles(source({ vodic: vodic({ rezim: "VO_FLOTILE", fleetId: 7 }), flotila: flotila() })), []);
});

test("bez flotily a mimo režimu VO_FLOTILE sa flotila nevyžaduje", () => {
  assert.deepEqual(poles(source({ vodic: vodic({ rezim: null, fleetId: null }) })), []);
});

test("NAJOM: vozidlo, nájomné > 0, kaucia (0 povolené), dátumy", () => {
  assert.deepEqual(poles(source({ vozidlo: null, vehicleId: null })), ["vehicleId"]);
  const z = validateSnapshotInput(source({ vozidlo: vozidlo({ vin: null, farba: "" }) }), TODAY).chybajuce;
  assert.deepEqual(z.map((c) => c.pole), ["vozidlo.vin", "vozidlo.farba"]);
  assert.equal(z[0].odkaz, "/portal/vozidla?edit=5");
  assert.deepEqual(poles(source({ input: input({ najomneSuma: 0 }) })), ["najomneSuma"]);
  assert.deepEqual(poles(source({ input: input({ kaucia: null }) })), ["kaucia"]);
  assert.deepEqual(poles(source({ input: input({ kaucia: 0 }) })), []);
  assert.deepEqual(poles(source({ input: input({ platnostOd: null, datumUzavretia: null }) })), [
    "datumUzavretia",
    "platnostOd",
  ]);
  assert.deepEqual(poles(source({ input: input({ platnostOd: "2026-02-01", platnostDo: "2026-01-01" }) })), ["platnostDo"]);
});

test("DISPECING: provízia a registračný poplatok, vozidlo netreba", () => {
  const base = { typ: "DISPECING" as const, vozidlo: null, vehicleId: null };
  assert.deepEqual(poles(source({ ...base })), []);
  assert.deepEqual(poles(source({ ...base, input: input({ provizia: null, poplatokRegistracny: null, najomneSuma: null, kaucia: null }) })), [
    "provizia",
    "poplatokRegistracny",
  ]);
  assert.deepEqual(poles(source({ ...base, input: input({ poplatokRegistracny: 0 }) })), []);
});

test("varovania: vypršané a nezadané platnosti, chýbajúci IBAN", () => {
  const r = validateSnapshotInput(
    source({
      vodic: vodic({ pvtPlatnostDo: "2026-01-10", iban: null, rezim: "VLASTNA_KONCESIA", firmaIco: "1", firmaDic: "2", cisloKoncesie: "3", koncesiaPlatnostDo: "2026-01-20" }),
      vozidlo: vozidlo({ pzpPlatnostDo: "2026-01-20", havPlatnostDo: null, stkPlatnostDo: "2025-12-31" }),
      input: input({ datumUzavretia: "2026-02-01" }),
    }),
    TODAY
  );
  assert.deepEqual(r.chybajuce, []);
  const w = Object.fromEntries(r.varovania.map((x) => [x.pole, x.text]));
  assert.match(w["vodic.pvtPlatnostDo"], /vypršala/);
  assert.match(w["vozidlo.pzpPlatnostDo"], /pred dátumom uzavretia/);
  assert.match(w["vozidlo.havPlatnostDo"], /nie je zadaná/);
  assert.match(w["vozidlo.stkPlatnostDo"], /vypršala/);
  assert.match(w["vodic.koncesiaPlatnostDo"], /pred dátumom uzavretia/);
  assert.match(w["vodic.iban"], /IBAN/);
  assert.equal(w["vozidlo.ekPlatnostDo"], undefined);
});

test("výstup validácie neobsahuje hodnoty osobných údajov", () => {
  const src = source({ vodic: vodic({ cisloPvt: null, iban: null }), firma: firma({ ico: null }) });
  const json = JSON.stringify(validateSnapshotInput(src, TODAY));
  for (const val of ["9001010000", "XX000000", "Testo", "Fiktívny", "Vymyslená"]) assert.ok(!json.includes(val), val);
});
