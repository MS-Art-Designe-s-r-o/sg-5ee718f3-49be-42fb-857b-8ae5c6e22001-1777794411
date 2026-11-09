import { test } from "node:test";
import assert from "node:assert/strict";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import {
  BLOCK_KEYS,
  KNOWN_TAG_KEYS,
  TAG_CATALOG,
  TAG_GROUPS,
  catalogByGroup,
  resolveTagKey,
} from "../../src/lib/contracts/tagCatalog";
import { scopeParser } from "../../src/lib/contracts/parser";
import { buildTemplateData } from "../../src/lib/contracts/snapshot";
import { makeDocx, docxText } from "./_docx";
import { flotila, source, vodic } from "./_data";

test("kľúče katalógu sú unikátne a majú label, popis aj príklad", () => {
  const keys = TAG_CATALOG.map((t) => t.key);
  assert.equal(new Set(keys).size, keys.length);
  for (const t of TAG_CATALOG) {
    assert.ok(t.label.trim(), `label ${t.key}`);
    assert.ok(t.popis.trim(), `popis ${t.key}`);
    assert.equal(typeof t.priklad, "string", `priklad ${t.key}`);
    assert.ok(TAG_GROUPS.some((g) => g.id === t.skupina), `skupina ${t.key}`);
    assert.match(t.key, /^[a-z_]+(\.[a-z0-9_]+)?$/, `snake_case ${t.key}`);
  }
});

test("katalóg obsahuje povinné značky a bloky zo zadania", () => {
  for (const k of [
    "firma.nazov",
    "firma.statutar_funkcia",
    "flotila.zmluva_platnost_do",
    "vodic.rodne_cislo",
    "vodic.volaci_znak",
    "strana.typ_text",
    "vozidlo.ek_platnost",
    "zmluva.najomne_jednotka_text",
    "zmluva.datum_vygenerovania",
  ]) {
    assert.ok(KNOWN_TAG_KEYS.has(k), k);
  }
  assert.deepEqual([...BLOCK_KEYS].sort(), [
    "flotila",
    "fyzicka_osoba",
    "je_elektricke",
    "je_spalovacie",
    "koncesia",
    "podnikatel",
    "pravnicka_osoba",
    "vozidlo",
  ]);
});

test("každý dátový kľúč katalógu má hodnotu v buildTemplateData (a naopak)", () => {
  const data = buildTemplateData(source({ flotila: flotila(), vodic: vodic({ fleetId: 7 }) }));
  const fromData = new Set<string>();
  for (const [k, v] of Object.entries(data)) {
    if (v && typeof v === "object") for (const kk of Object.keys(v)) fromData.add(`${k}.${kk}`);
  }
  const catalogData = TAG_CATALOG.filter((t) => !t.blok).map((t) => t.key);
  assert.deepEqual([...fromData].sort(), [...catalogData].sort());
  for (const b of BLOCK_KEYS) assert.ok(b in data, b);
});

test("resolveTagKey: plný aj skrátený zápis vnútri bloku", () => {
  assert.equal(resolveTagKey("flotila.nazov"), "flotila.nazov");
  assert.equal(resolveTagKey("nazov", ["flotila"]), "flotila.nazov");
  assert.equal(resolveTagKey("ecv", ["koncesia", "vozidlo"]), "vozidlo.ecv");
  assert.equal(resolveTagKey("nazov"), null);
  assert.equal(resolveTagKey("neznama.znacka"), null);
});

test("catalogByGroup vracia zápis značky aj bloku", () => {
  const g = catalogByGroup();
  const firmaNazov = g.find((x) => x.id === "firma")?.znacky.find((z) => z.key === "firma.nazov");
  assert.equal(firmaNazov?.zapis, "{firma.nazov}");
  const blok = g.find((x) => x.id === "bloky")?.znacky.find((z) => z.key === "flotila");
  assert.equal(blok?.zapis, "{#flotila}…{/flotila}");
});

function render(paragraphs: string[], data: Record<string, unknown>): string {
  const doc = new Docxtemplater(new PizZip(makeDocx(paragraphs)), {
    paragraphLoop: true,
    linebreaks: true,
    parser: scopeParser,
    nullGetter: () => "",
  });
  doc.render(data);
  return docxText(doc.getZip().generate({ type: "nodebuffer" }) as Buffer);
}

test("docxtemplater: {flotila.nazov} aj {nazov} vnútri {#flotila} fungujú", () => {
  const data = { flotila: { nazov: "Flotila A", ico: "1" }, firma: { nazov: "Firma B" } };
  assert.equal(render(["{#flotila}{flotila.nazov}{/flotila}"], data), "Flotila A");
  assert.equal(render(["{#flotila}{nazov}{/flotila}"], data), "Flotila A");
  // Z bloku flotily je stále dostupný koreňový rozsah.
  assert.equal(render(["{#flotila}{nazov} / {firma.nazov}{/flotila}"], data), "Flotila A / Firma B");
});

test("docxtemplater: blok s null sa vynechá, inverzný sa vypíše; samostatné odstavce zmiznú", () => {
  const data = { flotila: null, koncesia: true };
  assert.equal(render(["A", "{#flotila}", "riadok flotily", "{/flotila}", "B"], data), "A\nB");
  assert.equal(render(["{^flotila}bez flotily{/flotila}"], data), "bez flotily");
  assert.equal(render(["{#koncesia}K{/koncesia}{flotila.nazov}"], data), "K");
});
