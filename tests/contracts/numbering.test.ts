import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allocateContractNumber,
  CONTRACT_PREFIX,
  formatContractNumber,
  SQL_ALLOCATE,
  SQL_LAST_ID,
} from "../../src/lib/contracts/numbering";
import type { Executor } from "../../src/lib/contracts/executor";
import type { SqlParam } from "../../src/lib/db";

test("formatContractNumber", () => {
  assert.equal(formatContractNumber("NZ", 2026, 1), "NZ-2026-001");
  assert.equal(formatContractNumber("DS", 2026, 42), "DS-2026-042");
  assert.equal(formatContractNumber("NZ", 2026, 999), "NZ-2026-999");
  assert.equal(formatContractNumber("NZ", 2026, 1000), "NZ-2026-1000");
  assert.equal(formatContractNumber("NZ", 2027, 12345), "NZ-2027-12345");
  assert.throws(() => formatContractNumber("NZ", 2026, 0));
  assert.throws(() => formatContractNumber("nz", 2026, 1));
  assert.throws(() => formatContractNumber("NZ", 1999, 1));
  assert.deepEqual(CONTRACT_PREFIX, { NAJOM: "NZ", DISPECING: "DS" });
});

/** Falošné spojenie: simuluje ContractSequence + LAST_INSERT_ID na jednom spojení. */
function fakeConn() {
  const seq = new Map<string, number>();
  let lastId = 0;
  const calls: { sql: string; params: SqlParam[] }[] = [];
  const ex: Executor = {
    async execute(sql, params = []) {
      calls.push({ sql, params });
      assert.equal(sql, SQL_ALLOCATE);
      const key = `${params[0]}|${params[1]}`;
      const next = (seq.get(key) ?? 0) + 1;
      seq.set(key, next);
      lastId = next;
      return { insertId: 0, affectedRows: next === 1 ? 1 : 2 };
    },
    async query<T>(sql: string) {
      calls.push({ sql, params: [] });
      assert.equal(sql, SQL_LAST_ID);
      return [{ n: lastId }] as T[];
    },
  };
  return { ex, calls };
}

test("allocateContractNumber: INSERT … LAST_INSERT_ID a SELECT na tom istom executore", async () => {
  const { ex, calls } = fakeConn();
  assert.deepEqual(await allocateContractNumber(ex, "NZ", 2026), { cislo: "NZ-2026-001", poradie: 1 });
  assert.deepEqual(await allocateContractNumber(ex, "NZ", 2026), { cislo: "NZ-2026-002", poradie: 2 });
  assert.deepEqual(await allocateContractNumber(ex, "DS", 2026), { cislo: "DS-2026-001", poradie: 1 });
  assert.deepEqual(await allocateContractNumber(ex, "NZ", 2027), { cislo: "NZ-2027-001", poradie: 1 });
  assert.equal(calls.length, 8);
  assert.deepEqual(calls[0].params, ["NZ", 2026]);
  assert.match(SQL_ALLOCATE, /ON DUPLICATE KEY UPDATE `posledne` = LAST_INSERT_ID\(`posledne` \+ 1\)/);
});

test("allocateContractNumber: neplatný výsledok → chyba", async () => {
  const ex: Executor = {
    execute: async () => ({ insertId: 0, affectedRows: 1 }),
    query: async <T>() => [{ n: 0 }] as T[],
  };
  await assert.rejects(allocateContractNumber(ex, "NZ", 2026));
  await assert.rejects(allocateContractNumber(ex, "X1", 2026));
});
