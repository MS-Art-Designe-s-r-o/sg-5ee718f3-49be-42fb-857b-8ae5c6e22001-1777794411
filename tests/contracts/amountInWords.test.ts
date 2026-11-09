import { test } from "node:test";
import assert from "node:assert/strict";
import { amountInWords, integerInWords } from "../../src/lib/contracts/amountInWords";

test("amountInWords: tvary eura", () => {
  const cases: [number, string][] = [
    [0, "nula eur"],
    [1, "jedno euro"],
    [2, "dve eurá"],
    [3, "tri eurá"],
    [4, "štyri eurá"],
    [5, "päť eur"],
    [6, "šesť eur"],
    [9, "deväť eur"],
    [10, "desať eur"],
    [21, "dvadsaťjeden eur"],
    [22, "dvadsaťdva eur"],
  ];
  for (const [n, ocak] of cases) assert.equal(amountInWords(n), ocak, String(n));
});

test("amountInWords: 11–19", () => {
  const ocak = [
    "jedenásť",
    "dvanásť",
    "trinásť",
    "štrnásť",
    "pätnásť",
    "šestnásť",
    "sedemnásť",
    "osemnásť",
    "devätnásť",
  ];
  ocak.forEach((slovo, i) => assert.equal(amountInWords(11 + i), `${slovo} eur`));
});

test("amountInWords: desiatky, stovky, tisíce", () => {
  const cases: [number, string][] = [
    [20, "dvadsať eur"],
    [34, "tridsaťštyri eur"],
    [45, "štyridsaťpäť eur"],
    [50, "päťdesiat eur"],
    [99, "deväťdesiatdeväť eur"],
    [100, "sto eur"],
    [101, "sto jeden eur"],
    [115, "sto pätnásť eur"],
    [200, "dvesto eur"],
    [300, "tristo eur"],
    [450, "štyristo päťdesiat eur"],
    [999, "deväťsto deväťdesiatdeväť eur"],
    [1000, "tisíc eur"],
    [1001, "tisíc jeden eur"],
    [1200, "tisíc dvesto eur"],
    [2000, "dvetisíc eur"],
    [3000, "tritisíc eur"],
    [4000, "štyritisíc eur"],
    [5000, "päťtisíc eur"],
    [9000, "deväťtisíc eur"],
    [10000, "desaťtisíc eur"],
    [11000, "jedenásťtisíc eur"],
    [21000, "dvadsaťjedentisíc eur"],
    [22500, "dvadsaťdvatisíc päťsto eur"],
    [100000, "stotisíc eur"],
    [123456, "stodvadsaťtritisíc štyristo päťdesiatšesť eur"],
    [999999, "deväťstodeväťdesiatdeväťtisíc deväťsto deväťdesiatdeväť eur"],
    [1000000, "milión eur"],
    [2500000, "dva milióny päťstotisíc eur"],
    [5000000, "päť miliónov eur"],
  ];
  for (const [n, ocak] of cases) assert.equal(amountInWords(n), ocak, String(n));
});

test("amountInWords: centy", () => {
  const cases: [number | string, string][] = [
    [1234.5, "tisíc dvesto tridsaťštyri eur a päťdesiat centov"],
    [0.01, "nula eur a jeden cent"],
    [1.02, "jedno euro a dva centy"],
    [2.03, "dve eurá a tri centy"],
    [3.04, "tri eurá a štyri centy"],
    [5.05, "päť eur a päť centov"],
    [10.21, "desať eur a dvadsaťjeden centov"],
    [0.1 + 0.2, "nula eur a tridsať centov"],
    [999999.99, "deväťstodeväťdesiatdeväťtisíc deväťsto deväťdesiatdeväť eur a deväťdesiatdeväť centov"],
    [4.999, "päť eur"],
    ["300", "tristo eur"],
    ["45,50", "štyridsaťpäť eur a päťdesiat centov"],
  ];
  for (const [n, ocak] of cases) assert.equal(amountInWords(n), ocak, String(n));
});

test("amountInWords: neplatné vstupy hádžu chybu", () => {
  for (const bad of [-1, -0.01, Number.NaN, Number.POSITIVE_INFINITY, 1e12, "abc", ""]) {
    assert.throws(() => amountInWords(bad as number), RangeError, String(bad));
  }
});

test("integerInWords: nula a hranice", () => {
  assert.equal(integerInWords(0), "nula");
  assert.equal(integerInWords(1), "jeden");
  assert.equal(integerInWords(2), "dva");
  assert.throws(() => integerInWords(1.5), RangeError);
});
