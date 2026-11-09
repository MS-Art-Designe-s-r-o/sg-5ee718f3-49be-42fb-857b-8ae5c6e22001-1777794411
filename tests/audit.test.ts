import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeMeta, writeAudit, type AuditExecutor } from "../src/lib/audit";
import type { SqlParam } from "../src/lib/db";

test("sanitizeMeta pustí primitíva a plytké polia primitív", () => {
  assert.deepEqual(
    sanitizeMeta({ polia: ["iban", "rodneCislo"], pole: "cisloOp", verzia: 2, ok: true, nic: null }),
    { polia: ["iban", "rodneCislo"], pole: "cisloOp", verzia: 2, ok: true, nic: null }
  );
});

test("sanitizeMeta zahodí zakázané kľúče (case-insensitive, podreťazec)", () => {
  const out = sanitizeMeta({
    rodneCislo: "x",
    RODNE_CISLO: "x",
    cisloOP: "x",
    driverIban: "x",
    meno: "x",
    obchodneMeno: "x",
    Priezvisko: "x",
    adresa: "x",
    trvalyPobyt: "x",
    telefon: "x",
    kontaktEmail: "x",
    datumNarodenia: "x",
    snapshotJson: "x",
    contractId: 5,
  });
  assert.deepEqual(out, { contractId: 5 });
});

test("sanitizeMeta zahodí objekty, dlhé reťazce, polia s objektmi a NaN", () => {
  const out = sanitizeMeta({
    vnoreny: { a: 1 },
    dlhy: "x".repeat(101),
    presne100: "y".repeat(100),
    zmes: [1, { a: 1 }],
    vnorenePole: [[1]],
    nan: Number.NaN,
    fn: () => 1,
    undef: undefined,
  });
  assert.deepEqual(out, { presne100: "y".repeat(100) });
});

test("sanitizeMeta: nie-objekt alebo prázdny výsledok → null; počet kľúčov obmedzený", () => {
  assert.equal(sanitizeMeta(null), null);
  assert.equal(sanitizeMeta("text"), null);
  assert.equal(sanitizeMeta([1, 2]), null);
  assert.equal(sanitizeMeta({ email: "x" }), null);
  const many = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`k${i}`, i]));
  assert.equal(Object.keys(sanitizeMeta(many) ?? {}).length, 20);
});

function mockExecutor(fail = false) {
  const calls: { sql: string; params: SqlParam[] }[] = [];
  const ex: AuditExecutor = {
    execute: async (sql, params) => {
      if (fail) throw new Error("DB nedostupná");
      calls.push({ sql, params });
      return {};
    },
  };
  return { ex, calls };
}

test("writeAudit vloží riadok s vyčistenou meta cez tx", async () => {
  const { ex, calls } = mockExecutor();
  await writeAudit(
    {
      userId: 1,
      action: "PII_UPDATE",
      entity: "DriverProfile",
      entityId: 7,
      ip: "127.0.0.1",
      meta: { polia: ["iban"], iban: "SK00 TEST" },
    },
    ex
  );
  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /INSERT INTO `AuditLog`/);
  assert.deepEqual(calls[0].params, [1, "PII_UPDATE", "DriverProfile", 7, "127.0.0.1", '{"polia":["iban"]}']);
});

test("writeAudit hádže pri zlyhaní zápisu a pri neplatnej akcii", async () => {
  const { ex } = mockExecutor(true);
  await assert.rejects(
    writeAudit({ userId: 1, action: "PII_REVEAL", entity: "DriverProfile", entityId: 1 }, ex)
  );
  const ok = mockExecutor();
  await assert.rejects(
    // @ts-expect-error neplatná akcia
    writeAudit({ userId: 1, action: "NIECO", entity: "X" }, ok.ex)
  );
  assert.equal(ok.calls.length, 0);
});
