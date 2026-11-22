import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDate, formatMoney, formatNumber, formatPercent } from "../../src/lib/contracts/format";

test("formatDate: reťazec YYYY-MM-DD aj s časom", () => {
  const cases: [string, string][] = [
    ["2026-01-05", "05.01.2026"],
    ["2026-12-31", "31.12.2026"],
    ["2024-02-29", "29.02.2024"],
    ["2026-03-07 00:00:00", "07.03.2026"],
    ["2026-03-07T10:00:00.000Z", "07.03.2026"],
  ];
  for (const [vstup, ocak] of cases) assert.equal(formatDate(vstup), ocak, vstup);
});

test("formatDate: Date (lokálny dátum)", () => {
  assert.equal(formatDate(new Date(2026, 0, 9)), "09.01.2026");
  assert.equal(formatDate(new Date(1999, 10, 30, 23, 59)), "30.11.1999");
});

test("formatDate: prázdne → '', neplatné → chyba", () => {
  assert.equal(formatDate(null), "");
  assert.equal(formatDate(undefined), "");
  assert.equal(formatDate(""), "");
  assert.throws(() => formatDate("2026-02-30"), RangeError);
  assert.throws(() => formatDate("31.12.2026"), RangeError);
  assert.throws(() => formatDate(new Date("x")), RangeError);
});

test("formatMoney: obyčajné medzery, čiarka, € na konci", () => {
  const cases: [number | string, string][] = [
    [0, "0,00 €"],
    [5, "5,00 €"],
    [30, "30,00 €"],
    [1234.5, "1 234,50 €"],
    [1234567.891, "1 234 567,89 €"],
    [999.999, "1 000,00 €"],
    ["45.5", "45,50 €"],
    ["45,5", "45,50 €"],
  ];
  for (const [vstup, ocak] of cases) {
    const out = formatMoney(vstup);
    assert.equal(out, ocak, String(vstup));
    assert.ok(!/[  ]/.test(out), "bez nezlomiteľných medzier");
  }
});

test("formatMoney: prázdne → '', neplatné → chyba", () => {
  assert.equal(formatMoney(null), "");
  assert.equal(formatMoney(""), "");
  assert.throws(() => formatMoney("abc"), RangeError);
  assert.throws(() => formatMoney(Number.NaN), RangeError);
});

test("formatNumber a formatPercent", () => {
  assert.equal(formatNumber(123456), "123 456");
  assert.equal(formatNumber(1234.5), "1 234,5");
  assert.equal(formatNumber(0), "0");
  assert.equal(formatNumber(null), "");
  assert.equal(formatPercent(15), "15 %");
  assert.equal(formatPercent(12.5), "12,5 %");
  assert.equal(formatPercent("20"), "20 %");
  assert.equal(formatPercent(undefined), "");
  assert.ok(!/[  ]/.test(formatNumber(1234567)));
});
