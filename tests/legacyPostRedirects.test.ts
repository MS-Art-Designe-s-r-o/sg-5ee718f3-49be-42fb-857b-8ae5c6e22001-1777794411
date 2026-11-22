import { test } from "node:test";
import assert from "node:assert/strict";
import { legacyPostRedirect, LEGACY_POST_MAP } from "../src/lib/legacyPostRedirects";

test("bez ?post= nič nepresmeruje", () => {
  assert.equal(legacyPostRedirect("/", null), null);
  assert.equal(legacyPostRedirect("/", ""), null);
});

test("?post= mimo titulnej stránky sa ignoruje", () => {
  assert.equal(legacyPostRedirect("/cennik", "nonstop-taxi-kosice"), null);
  assert.equal(legacyPostRedirect("/blog", "x"), null);
});

test("trasové články idú na trasové stránky (bez jazyka)", () => {
  assert.equal(legacyPostRedirect("/", "letiskovy-transfer-budapest-bez-stresu"), "https://e-taxike.sk/transfer-kosice-budapest");
  assert.equal(legacyPostRedirect("/en", "odvoz-na-letisko-bratislava-bez-stresu"), "https://e-taxike.sk/transfer-kosice-bratislava");
  assert.equal(legacyPostRedirect("/", "odvoz-na-letisko-vieden-bez-stresu", "de"), "https://e-taxike.sk/transfer-kosice-viedna");
});

test("titulka a cenník ponechajú jazyk", () => {
  assert.equal(legacyPostRedirect("/", "nonstop-taxi-kosice"), "https://e-taxike.sk/");
  assert.equal(legacyPostRedirect("/", "nonstop-taxi-kosice", "sk"), "https://e-taxike.sk/");
  assert.equal(legacyPostRedirect("/en", "nonstop-taxi-kosice"), "https://e-taxike.sk/en");
  assert.equal(legacyPostRedirect("/", "ekologicke-taxi-kosice", "hu"), "https://e-taxike.sk/hu");
  assert.equal(legacyPostRedirect("/de/", "drink-taxi-kosice-cena"), "https://e-taxike.sk/de/cennik");
});

test("neznámy slug ide na titulku v danom jazyku", () => {
  assert.equal(legacyPostRedirect("/", "neexistuje"), "https://e-taxike.sk/");
  assert.equal(legacyPostRedirect("/hu", "neexistuje"), "https://e-taxike.sk/hu");
});

test("mapa pokrýva všetkých 34 slugov z GSC", () => {
  assert.equal(Object.keys(LEGACY_POST_MAP).length, 34);
});
