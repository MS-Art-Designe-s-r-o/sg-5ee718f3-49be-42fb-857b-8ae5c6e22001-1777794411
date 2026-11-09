import { test } from "node:test";
import assert from "node:assert/strict";
import { isRealDate, isValidEmail, normalizeKinds } from "../src/lib/subjectFields";

test("normalizeKinds: IČO, DIČ, IČ DPH, e-mail – normalizácia a neplatné polia", () => {
  const r = normalizeKinds(
    { ico: "55 423 698", dic: "212198516", icDph: "sk2121985162", email: "a@b", iban: undefined },
    { ico: "ico", dic: "dic", icDph: "icDph", email: "email", iban: "iban" }
  );
  assert.equal(r.set.ico, "55423698");
  assert.equal(r.set.icDph, "SK2121985162");
  assert.deepEqual(r.invalid.sort(), ["dic", "email"]);
  assert.ok(!("iban" in r.set));
});

test("normalizeKinds: null vymaže, platný IBAN sa normalizuje", () => {
  const r = normalizeKinds(
    { ico: null, iban: "sk93 0200 0000 0047 9242 9355" },
    { ico: "ico", iban: "iban" }
  );
  assert.equal(r.set.ico, null);
  assert.equal(r.set.iban, "SK9302000000004792429355");
  assert.deepEqual(r.invalid, []);
  assert.deepEqual(normalizeKinds({ iban: "SK9302000000004792429356" }, { iban: "iban" }).invalid, ["iban"]);
});

test("isRealDate a isValidEmail", () => {
  assert.ok(isRealDate("2024-02-29"));
  assert.ok(!isRealDate("2023-02-29"));
  assert.ok(!isRealDate("29.02.2024"));
  assert.ok(isValidEmail("info@e-taxi.sk"));
  assert.ok(!isValidEmail("info@"));
  assert.ok(!isValidEmail("a b@c.sk"));
});
