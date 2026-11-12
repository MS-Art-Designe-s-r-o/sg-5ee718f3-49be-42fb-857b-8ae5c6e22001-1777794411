import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import PizZip from "pizzip";
import { inspectTemplate, renderDocx, TemplateError } from "../../src/lib/contracts/render";
import { buildTemplateData } from "../../src/lib/contracts/snapshot";
import type { SnapshotSource } from "../../src/lib/contracts/types";
import { PublicError } from "../../src/lib/safeLog";
import { docxText, makeDocx } from "./_docx";
import { flotila, source, vodic } from "./_data";

const FIX = path.join(__dirname, "..", "fixtures");
const NAJOM = readFileSync(path.join(FIX, "sablona-najom.docx"));
const DISP = readFileSync(path.join(FIX, "sablona-dispecing.docx"));
const DISP_V = readFileSync(path.join(FIX, "sablona-dispecing-vodic.docx"));

function text(tpl: Buffer, src: SnapshotSource): string {
  const out = renderDocx(tpl, buildTemplateData(src));
  new PizZip(out); // výsledok je platný ZIP
  return docxText(out);
}

const noBraces = (t: string) => assert.ok(!/[{}]/.test(t), "v texte ostali zvyšky značiek");

const PO_KONCESIA = vodic({
  stranaTyp: "PRAVNICKA_OSOBA",
  rezim: "VLASTNA_KONCESIA",
  firmaObchodneMeno: "Vodičova Firma s.r.o.",
  firmaIco: "11223344",
  firmaDic: "1122334455",
  firmaIcDph: "SK1122334455",
  firmaSidlo: "Firemná 9, 040 01 Košice",
  firmaZapisanyV: "OR MS Košice, Sro 99999/V",
  cisloKoncesie: "KONC-PO-01",
  firmaStatutar: "Štatutár Vodičovej Firmy",
});

test("fixtures: inspectTemplate nenájde chyby ani neznáme značky", () => {
  for (const tpl of [NAJOM, DISP, DISP_V]) {
    const r = inspectTemplate(tpl);
    assert.equal(r.chyby, undefined);
    assert.deepEqual(r.neznameTagy, []);
    assert.ok(r.tagy.includes("zmluva.cislo"));
    assert.ok(r.tagy.includes("flotila"));
  }
});

test("nájom: FO bez flotily — hodnoty, bez flotily, koncesie a štatutára", () => {
  const t = text(NAJOM, source());
  noBraces(t);
  for (const v of [
    "Číslo zmluvy: NZ-2026-001",
    "Obchodné meno: Vzorová Taxi s.r.o.",
    "Zastúpená: Konateľ Fiktívny, konateľ",
    "Meno a priezvisko / Obchodné meno: Testo Fiktívny",
    "Dátum narodenia: 01.01.1990",
    "Číslo OP / dokladu totožnosti: XX000000",
    "Evidenčné číslo (ŠPZ): KE000ZZ VIN: AAAAAAAAAAAAAAAAA",
    "Typ pohonu: elektrický",
    "Typ vozidla: elektrické",
    "Nájomné za jednu zmenu (12 h): 60,00 € (slovom: šesťdesiat eur)",
    "Nájomné za 24-hodinovú zmenu: 110,00 €",
    "Výška depozitu: 300,00 € (slovom: tristo eur)",
    "2.1 Táto zmluva sa uzatvára na dobu neurčitú.",
    "V Košiciach, dňa 01.02.2026",
    "Stav tachometra pri prvom prevzatí: 45 230 km",
  ]) {
    assert.ok(t.includes(v), v);
  }
  assert.ok(!t.includes("Dopravca (flotila)"));
  assert.ok(!t.includes("Číslo koncesie"));
  assert.ok(!t.includes("Zastúpený:"));
  // IČO len v hlavičke prenajímateľa (riadok podnikateľa sa vynechal).
  assert.equal(t.split("\n").filter((l) => l.startsWith("IČO:")).length, 1);
  assert.ok(!t.includes("nehodiace sa preškrtnite"));
  // Prázdne bloky nenechajú prázdne riadky medzi kontaktom a „(ďalej len Nájomca)“.
  assert.match(t, /Kontakt \(tel\., e-mail\): [^\n]+\n\(ďalej len „Nájomca/);
});

test("nájom: FO vo flotile — riadok flotily sa objaví", () => {
  const t = text(NAJOM, source({ vodic: vodic({ fleetId: 7, rezim: "VO_FLOTILE" }), flotila: flotila() }));
  noBraces(t);
  assert.ok(t.includes("Dopravca (flotila), pod ktorým Nájomca pôsobí: Flotila Príklad s.r.o., IČO 87654321"));
  assert.ok(!t.includes("Číslo koncesie"));
});

test("nájom: PO s vlastnou koncesiou — IČO, koncesia, štatutár; bez 24 h pri prázdnej sume", () => {
  const src = source({ vodic: PO_KONCESIA });
  src.input = { ...src.input, najomne24h: null };
  src.vozidlo = { ...src.vozidlo!, druhPohonu: "DIESEL" };
  const t = text(NAJOM, src);
  noBraces(t);
  assert.ok(t.includes("Meno a priezvisko / Obchodné meno: Vodičova Firma s.r.o."));
  assert.ok(t.includes("IČO: 11223344   DIČ: 1122334455   IČ DPH: SK1122334455"));
  assert.ok(t.includes("Číslo koncesie na taxislužbu: KONC-PO-01"));
  assert.ok(t.includes("Zastúpený: Štatutár Vodičovej Firmy"));
  assert.ok(t.includes("Zapísaný: OR MS Košice, Sro 99999/V"));
  assert.ok(t.includes("Typ vozidla: spaľovacie"));
  assert.ok(t.includes("Typ pohonu: dieselový"));
  assert.ok(!t.includes("24-hodinovú"));
  assert.ok(t.includes("Vodičova Firma s.r.o., Štatutár Vodičovej Firmy"));
});

test("nájom: SZČO podnikateľ bez koncesie — IČO áno, koncesia a štatutár nie", () => {
  const t = text(NAJOM, source({ vodic: vodic({ firmaIco: "55667788", firmaDic: "5566778899" }) }));
  noBraces(t);
  assert.ok(t.includes("IČO: 55667788   DIČ: 5566778899"));
  assert.ok(!t.includes("IČ DPH"));
  assert.ok(!t.includes("Číslo koncesie"));
  assert.ok(!t.includes("Zastúpený:"));
});

test("dispečing: vo flotile — blok dopravcu, bez vlastnej koncesie", () => {
  const t = text(
    DISP,
    source({
      typ: "DISPECING",
      vozidlo: null,
      vodic: vodic({ fleetId: 7, rezim: "VO_FLOTILE" }),
      flotila: flotila(),
      meta: { cislo: "DS-2026-002", verzia: 1, datumVygenerovania: "2026-02-01" },
    })
  );
  noBraces(t);
  for (const v of [
    "Číslo zmluvy: DS-2026-002",
    "2. Dopravca (partnerská taxislužba):",
    "Obchodné meno: Flotila Príklad s.r.o.",
    "IČO: 87654321  DIČ: 2020654321  IČ DPH: SK2020654321",
    "Číslo koncesie na taxislužbu: KONC-FLOT-01",
    "Meno a priezvisko: Testo Fiktívny",
    "Volací znak: K-77",
    "a) registračný poplatok vo výške 30,00 € za každého vodiča",
    "b) poplatok za dispečerské služby vo výške 15 % z tržby",
    "Štatutár Flotilový",
  ]) {
    assert.ok(t.includes(v), v);
  }
  assert.ok(!t.includes("Údaje o vlastnej koncesii vodiča"));
});

test("dispečing: vlastná koncesia bez flotily — blok koncesie, bez dopravcu", () => {
  const t = text(DISP, source({ typ: "DISPECING", vozidlo: null, vodic: PO_KONCESIA, input: { ...source().input, provizia: 12.5, poplatokRegistracny: 25 } }));
  noBraces(t);
  assert.ok(t.includes("Údaje o vlastnej koncesii vodiča:"));
  assert.ok(t.includes("Obchodné meno: Vodičova Firma s.r.o."));
  assert.ok(t.includes("Číslo koncesie na taxislužbu: KONC-PO-01"));
  assert.ok(t.includes("Zastúpená: Štatutár Vodičovej Firmy"));
  assert.ok(!t.includes("2. Dopravca (partnerská taxislužba)"));
  assert.ok(t.includes("vo výške 25,00 €"));
  assert.ok(t.includes("vo výške 12,5 % z tržby"));
});

test("dispečing (vodič): fyzická osoba bez flotily — bez IČO, koncesie a dopravcu", () => {
  const t = text(DISP_V, source({ typ: "DISPECING", vozidlo: null, vodic: vodic({ rezim: null, fleetId: null }), meta: { cislo: "DS-2026-010", verzia: 1, datumVygenerovania: "2026-02-01" } }));
  noBraces(t);
  for (const v of ["Číslo zmluvy: DS-2026-010", "2. Partnerský vodič", "Meno a priezvisko / Obchodné meno: Testo Fiktívny", "Volací znak: K-77", "Bankové spojenie / IBAN: "]) {
    assert.ok(t.includes(v), v);
  }
  assert.ok(!t.includes("Dopravca (Partnerský vodič je zamestnaný"));
  assert.ok(!t.includes("Číslo koncesie na taxislužbu"));
  assert.ok(!t.includes("IČO: 1122"), "IČO vodiča-podnikateľa sa nemá vypísať");
  assert.ok(!t.includes("Zastúpený:"));
});

test("dispečing (vodič): vo flotile — riadok dopravcu so značkami flotily", () => {
  const t = text(DISP_V, source({ typ: "DISPECING", vozidlo: null, vodic: vodic({ fleetId: 7, rezim: "VO_FLOTILE" }), flotila: flotila() }));
  noBraces(t);
  assert.ok(t.includes("Dopravca (Partnerský vodič je zamestnaný u zmluvného Dopravcu): Flotila Príklad s.r.o., IČO: 87654321"));
  assert.ok(t.includes("číslo koncesie: KONC-FLOT-01"));
});

test("dispečing (vodič): vlastná koncesia — právnická osoba s IČO, DIČ, koncesiou a zastúpením", () => {
  const t = text(DISP_V, source({ typ: "DISPECING", vozidlo: null, vodic: PO_KONCESIA }));
  noBraces(t);
  for (const v of [
    "Meno a priezvisko / Obchodné meno: Vodičova Firma s.r.o.",
    "Bytom / Sídlo: Firemná 9, 040 01 Košice",
    "IČO: 11223344",
    "DIČ: 1122334455  IČ DPH: SK1122334455",
    "Číslo koncesie na taxislužbu: KONC-PO-01",
    "Zastúpený: Štatutár Vodičovej Firmy",
  ]) {
    assert.ok(t.includes(v), v);
  }
});

test("dispečing (vodič): SZČO s vlastnou koncesiou — IČO a DIČ, bez „Zastúpený“", () => {
  const t = text(
    DISP_V,
    source({
      typ: "DISPECING",
      vozidlo: null,
      vodic: vodic({ stranaTyp: "FYZICKA_OSOBA", rezim: "VLASTNA_KONCESIA", firmaIco: "55667788", firmaDic: "1055667788", firmaIcDph: null, cisloKoncesie: "KONC-SZCO-01" }),
    })
  );
  noBraces(t);
  assert.ok(t.includes("IČO: 55667788"));
  assert.ok(t.includes("DIČ: 1055667788"));
  assert.ok(!t.includes("IČ DPH:"), "IČ DPH je voliteľné");
  assert.ok(t.includes("Číslo koncesie na taxislužbu: KONC-SZCO-01"));
  assert.ok(!t.includes("Zastúpený:"));
});

test("dispečing (vodič): doba trvania — neurčitá aj určitá", () => {
  const neurcita = text(DISP_V, source({ typ: "DISPECING", vozidlo: null, input: { ...source().input, platnostDo: null } }));
  assert.ok(neurcita.includes("Táto zmluva sa uzatvára na dobu neurčitú"));
  const urcita = text(DISP_V, source({ typ: "DISPECING", vozidlo: null, input: { ...source().input, platnostOd: "2026-02-01", platnostDo: "2027-01-31" } }));
  noBraces(urcita);
  assert.ok(/Táto zmluva sa uzatvára na dobu určitú od 01\.02\.2026 do 31\.01\.2027/.test(urcita), "doba určitá");
});

test("renderDocx: chyba šablóny → TemplateError so značkami, bez hodnôt", () => {
  assert.throws(
    () => renderDocx(makeDocx(["{firma.nazov", "{vodic.meno}"]), { vodic: { meno: "Tajné Meno" } }),
    (e: unknown) => {
      assert.ok(e instanceof TemplateError);
      assert.ok(e instanceof PublicError);
      assert.deepEqual(e.chyby, ["unclosed_tag: firma.nazov"]);
      assert.ok(!e.message.includes("Tajné"));
      return true;
    }
  );
});

test("inspectTemplate: neznáme značky, skrátený zápis v bloku, inverzné bloky, chyby", () => {
  const r = inspectTemplate(
    makeDocx(["{#flotila}{nazov} {foo}{/flotila}", "{^koncesia}x{/koncesia}", "{neznama}", "{@raw}"])
  );
  assert.deepEqual(r.neznameTagy, ["@raw", "foo", "neznama"]);
  assert.ok(r.tagy.includes("flotila.nazov"));
  assert.ok(r.tagy.includes("koncesia"));
  const bad = inspectTemplate(makeDocx(["{#flotila}bez konca"]));
  assert.deepEqual(bad.chyby, ["unclosed_loop: flotila"]);
  assert.throws(() => inspectTemplate(Buffer.from("toto nie je zip")), PublicError);
});
