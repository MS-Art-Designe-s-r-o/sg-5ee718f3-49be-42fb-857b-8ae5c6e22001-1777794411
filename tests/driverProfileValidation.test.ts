import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeIban,
  validateIban,
  normalizeIco,
  normalizeDic,
  normalizeIcDph,
  normalizeCisloOp,
  missingForRezim,
  type RezimFields,
} from "../src/lib/driverProfile";

/** Fiktívny IBAN s dopočítanými kontrolnými číslicami (mod 97). */
function makeIban(country: string, bban: string): string {
  const conv = (bban + country + "00").replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0;
  for (const d of conv) rem = (rem * 10 + Number(d)) % 97;
  return country + String(98 - rem).padStart(2, "0") + bban;
}

test("IBAN: normalizácia medzier a veľkých písmen, kontrola mod 97", () => {
  const sk = makeIban("SK", "0900" + "0000001234567890");
  assert.equal(sk.length, 24);
  const spaced = sk.toLowerCase().replace(/(.{4})/g, "$1 ");
  assert.equal(normalizeIban(spaced), sk);
  assert.ok(validateIban(normalizeIban(spaced)));

  const cz = makeIban("CZ", "0800" + "0000009876543210");
  assert.ok(validateIban(cz));

  // zmena jednej číslice → neplatný
  const bad = sk.slice(0, -1) + String((Number(sk.slice(-1)) + 1) % 10);
  assert.equal(validateIban(bad), false);
  // zlá dĺžka pre SK
  assert.equal(validateIban(makeIban("SK", "0900000000123456789")), false);
  assert.equal(validateIban("SK"), false);
  assert.equal(validateIban(""), false);
});

test("IČO, DIČ, IČ DPH, číslo OP", () => {
  assert.equal(normalizeIco("12 345 678"), "12345678");
  assert.equal(normalizeIco("1234567"), null);
  assert.equal(normalizeIco("1234567A"), null);
  assert.equal(normalizeDic("1234 5678 90"), "1234567890");
  assert.equal(normalizeDic("123456789"), null);
  assert.equal(normalizeIcDph("sk 1234567890"), "SK1234567890");
  assert.equal(normalizeIcDph("CZ1234567890"), null);
  assert.equal(normalizeIcDph("SK123456789"), null);
  assert.equal(normalizeCisloOp("xx 000000"), "XX000000");
  assert.equal(normalizeCisloOp("X-1"), null);
});

const base: RezimFields = {
  rezim: null,
  stranaTyp: null,
  firmaObchodneMeno: null,
  firmaIco: null,
  firmaDic: null,
  cisloKoncesie: null,
};

test("missingForRezim: VO_FLOTILE / bez režimu nič nevyžaduje", () => {
  assert.deepEqual(missingForRezim(base), []);
  assert.deepEqual(missingForRezim({ ...base, rezim: "VO_FLOTILE", stranaTyp: "PRAVNICKA_OSOBA" }), []);
});

test("missingForRezim: VLASTNA_KONCESIA (SZČO) vyžaduje IČO, DIČ, koncesiu", () => {
  assert.deepEqual(missingForRezim({ ...base, rezim: "VLASTNA_KONCESIA", stranaTyp: "FYZICKA_OSOBA" }), [
    "firmaIco",
    "firmaDic",
    "cisloKoncesie",
  ]);
  assert.deepEqual(
    missingForRezim({
      ...base,
      rezim: "VLASTNA_KONCESIA",
      stranaTyp: "FYZICKA_OSOBA",
      firmaIco: "12345678",
      firmaDic: "1234567890",
      cisloKoncesie: "TEST-1",
    }),
    []
  );
});

test("missingForRezim: VLASTNA_KONCESIA + PRAVNICKA_OSOBA vyžaduje aj obchodné meno", () => {
  assert.deepEqual(
    missingForRezim({
      ...base,
      rezim: "VLASTNA_KONCESIA",
      stranaTyp: "PRAVNICKA_OSOBA",
      firmaIco: "12345678",
      firmaDic: "1234567890",
      cisloKoncesie: "  ",
    }),
    ["firmaObchodneMeno", "cisloKoncesie"]
  );
});
