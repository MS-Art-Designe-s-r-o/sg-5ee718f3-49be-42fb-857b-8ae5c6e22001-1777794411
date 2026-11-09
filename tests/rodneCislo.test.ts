import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeRodneCislo,
  validateRodneCislo,
  birthDateFromRodneCislo,
} from "../src/lib/rodneCislo";

// Všetky čísla sú vypočítané fiktívne (nie sú to údaje žiadnej osoby).
const TODAY = new Date(2026, 10, 9);

/** Vytvorí 10-ciferné RČ deliteľné 11 (prípadne null, ak pre koncovku neexistuje kontrolná číslica). */
function make10(yymmdd: string, suffix3: string): string | null {
  const base = Number(yymmdd + suffix3);
  const c = (11 - ((base * 10) % 11)) % 11;
  return c === 10 ? null : yymmdd + suffix3 + String(c);
}

/** Prvá koncovka, pre ktorú existuje platná kontrolná číslica. */
function firstValid(yymmdd: string): string {
  for (let s = 0; s < 1000; s++) {
    const r = make10(yymmdd, String(s).padStart(3, "0"));
    if (r) return r;
  }
  throw new Error("nenájdené");
}

/** Koncovka, pri ktorej zvyšok prvých 9 číslic po delení 11 je 10 (výnimka „0"). */
function exceptionCase(yymmdd: string): string {
  for (let s = 0; s < 1000; s++) {
    const first9 = yymmdd + String(s).padStart(3, "0");
    if (Number(first9) % 11 === 10) return first9 + "0";
  }
  throw new Error("nenájdené");
}

const fmt = (rc: string) => `${rc.slice(0, 6)}/${rc.slice(6)}`;

test("normalizácia odstráni lomku a medzery", () => {
  assert.equal(normalizeRodneCislo(" 900101 / 0001 "), "9001010001");
});

test("platné 10-ciferné (muž, žena, s lomkou aj bez)", () => {
  const muz = firstValid("900315");
  assert.equal(Number(muz) % 11, 0);
  assert.ok(validateRodneCislo(muz, TODAY));
  assert.ok(validateRodneCislo(fmt(muz), TODAY));
  assert.equal(birthDateFromRodneCislo(fmt(muz), TODAY), "1990-03-15");

  const zena = firstValid("905315"); // mesiac +50
  assert.ok(validateRodneCislo(zena, TODAY));
  assert.equal(birthDateFromRodneCislo(zena, TODAY), "1990-03-15");

  const r2000 = firstValid("050229"); // 2005 nie je priestupný → neplatné
  assert.equal(validateRodneCislo(r2000, TODAY), false);
  const leap = firstValid("040229"); // 2004 je priestupný
  assert.equal(birthDateFromRodneCislo(leap, TODAY), "2004-02-29");
});

test("rozšírené mesiace +20 / +70 len od roku 2004", () => {
  assert.equal(birthDateFromRodneCislo(firstValid("082310"), TODAY), "2008-03-10");
  assert.equal(birthDateFromRodneCislo(firstValid("087310"), TODAY), "2008-03-10");
  assert.equal(validateRodneCislo(firstValid("902310"), TODAY), false);
  assert.equal(validateRodneCislo(firstValid("907310"), TODAY), false);
});

test("nesprávna kontrolná číslica → neplatné", () => {
  const ok = firstValid("880720");
  const bad = ok.slice(0, 9) + String((Number(ok[9]) + 1) % 10);
  assert.equal(validateRodneCislo(bad, TODAY), false);
  assert.equal(birthDateFromRodneCislo(bad, TODAY), null);
});

test("výnimka zvyšok 10 → posledná 0 platí len pre roky 1954–1985", () => {
  const v1970 = exceptionCase("700101");
  assert.notEqual(Number(v1970) % 11, 0);
  assert.ok(validateRodneCislo(v1970, TODAY));
  assert.equal(birthDateFromRodneCislo(v1970, TODAY), "1970-01-01");

  const v1990 = exceptionCase("900101");
  assert.equal(validateRodneCislo(v1990, TODAY), false);
});

test("9-ciferné = pred rokom 1954", () => {
  assert.ok(validateRodneCislo("520101/123", TODAY));
  assert.equal(birthDateFromRodneCislo("520101123", TODAY), "1952-01-01");
  assert.equal(birthDateFromRodneCislo("525101123", TODAY), "1952-01-01");
  assert.equal(validateRodneCislo("600101123", TODAY), false);
});

test("neexistujúci dátum, budúcnosť a zlý formát → neplatné", () => {
  assert.equal(validateRodneCislo(firstValid("900431"), TODAY), false); // 31. 4.
  assert.equal(validateRodneCislo(firstValid("901301"), TODAY), false); // mesiac 13
  assert.equal(validateRodneCislo(firstValid("900100"), TODAY), false); // deň 0
  assert.equal(validateRodneCislo(firstValid("301231"), TODAY), false); // 2030 = budúcnosť
  assert.equal(validateRodneCislo("12345", TODAY), false);
  assert.equal(validateRodneCislo("90010A0001", TODAY), false);
  assert.equal(validateRodneCislo("", TODAY), false);
});
