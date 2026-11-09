import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, statSync, readdirSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  contractDir,
  contractFileName,
  readStored,
  removeStored,
  resolveSafe,
  safeSegment,
  statStored,
  storageRoot,
  templateRelPath,
  writeFileAtomic,
  writeNewFile,
} from "../../src/lib/contracts/storage";
import { PublicError } from "../../src/lib/safeLog";

let dir = "";
const prev = process.env.STORAGE_DIR;

before(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), "etaxi-storage-test-"));
  process.env.STORAGE_DIR = path.join(dir, "root");
});
after(() => {
  if (prev === undefined) delete process.env.STORAGE_DIR;
  else process.env.STORAGE_DIR = prev;
  rmSync(dir, { recursive: true, force: true });
});

test("storageRoot vytvorí koreň s právami 0700", () => {
  const root = storageRoot();
  assert.equal(root, path.join(dir, "root"));
  assert.equal(statSync(root).mode & 0o777, 0o700);
});

test("safeSegment zachová diakritiku a odstráni nebezpečné znaky", () => {
  assert.equal(safeSegment("Šťastný Ľubomír"), "Šťastný Ľubomír");
  assert.equal(safeSegment('a/b\\c:d*e?f"g<h>i|j'), "abcdefghij");
  assert.equal(safeSegment("../../etc/passwd"), "etcpasswd");
  assert.equal(safeSegment(".."), "bez-mena");
  assert.equal(safeSegment("   "), "bez-mena");
  assert.equal(safeSegment(null), "bez-mena");
  assert.equal(safeSegment("x".repeat(200)).length, 80);
  assert.equal(safeSegment("a\u0000b\nc"), "abc");
});

test("contractFileName presne podľa návrhu", () => {
  assert.equal(
    contractFileName({ typ: "NAJOM", datum: "2026-02-01", ecv: "KE 000ZZ", priezvisko: "Fiktívny", meno: "Testo", verzia: 1 }),
    "2026-02-01_Najomna-zmluva_KE000ZZ_Fiktívny-Testo.docx"
  );
  assert.equal(
    contractFileName({ typ: "NAJOM", datum: "2026-02-01", ecv: "KE000ZZ", priezvisko: "Nová Staršia", meno: "Anna Mária", verzia: 3 }),
    "2026-02-01_Najomna-zmluva_KE000ZZ_Nová-Staršia-Anna-Mária_v3.docx"
  );
  assert.equal(
    contractFileName({ typ: "DISPECING", datum: "2026-02-01", ecv: "KE000ZZ", priezvisko: "Fiktívny", meno: "Testo", verzia: 2 }),
    "2026-02-01_Dispecerska-zmluva_Fiktívny-Testo_v2.docx"
  );
  assert.equal(
    contractFileName({ typ: "DISPECING", datum: "2026-02-01", priezvisko: "../x", meno: "y/z", verzia: 1, pripona: "pdf" }),
    "2026-02-01_Dispecerska-zmluva_x-yz.pdf"
  );
  assert.equal(contractDir("Fiktívny", "Testo"), "zmluvy/Fiktívny Testo");
  assert.equal(templateRelPath("NAJOM", 3, "abcdef0123456789"), "sablony/NAJOM/v3_abcdef01.docx");
});

test("resolveSafe odmietne traversal, absolútne cesty a spätné lomky", () => {
  for (const bad of ["../../etc/passwd", "/etc/passwd", "..\\..\\x", "zmluvy/../../x", "", "a\0b", "C:\\x", "..", "."]) {
    assert.throws(() => resolveSafe(bad), PublicError, JSON.stringify(bad));
  }
  assert.equal(resolveSafe("zmluvy/A B/x.docx"), path.join(storageRoot(), "zmluvy", "A B", "x.docx"));
});

test("writeFileAtomic: súbor 0600, priečinok 0700, čítanie a mazanie", async () => {
  const rel = "zmluvy/Fiktívny Testo/2026-02-01_Dispecerska-zmluva_Fiktívny-Testo.docx";
  await writeFileAtomic(rel, Buffer.from("obsah"));
  const abs = resolveSafe(rel);
  assert.equal(statSync(abs).mode & 0o777, 0o600);
  assert.equal(statSync(path.dirname(abs)).mode & 0o777, 0o700);
  assert.equal((await readStored(rel)).toString(), "obsah");
  await writeFileAtomic(rel, Buffer.from("nový"));
  assert.equal((await readStored(rel)).toString(), "nový");
  assert.deepEqual(await statStored(rel), { size: Buffer.byteLength("nový") });
  // Žiadne dočasné súbory.
  assert.deepEqual(readdirSync(path.dirname(abs)).filter((f) => f.endsWith(".tmp")), []);
  await removeStored(rel);
  assert.equal(existsSync(abs), false);
  await removeStored(rel); // neexistujúci → bez chyby
  await assert.rejects(readStored(rel), (e: unknown) => e instanceof PublicError && e.status === 404);
  assert.equal(await statStored(rel), null);
});

test("writeNewFile neprepíše existujúci súbor (pridá _2)", async () => {
  const rel = "zmluvy/X Y/2026-02-01_Najomna-zmluva_KE1_X-Y.docx";
  assert.equal(await writeNewFile(rel, Buffer.from("1")), rel);
  const second = await writeNewFile(rel, Buffer.from("2"));
  assert.equal(second, "zmluvy/X Y/2026-02-01_Najomna-zmluva_KE1_X-Y_2.docx");
  assert.equal((await readStored(rel)).toString(), "1");
  assert.equal((await readStored(second)).toString(), "2");
  assert.equal(statSync(resolveSafe(second)).mode & 0o777, 0o600);
  assert.deepEqual(readdirSync(path.dirname(resolveSafe(rel))).filter((f) => f.endsWith(".tmp")), []);
});

test("storageRoot odmietne STORAGE_DIR v public/ alebo .next/", () => {
  const ok = process.env.STORAGE_DIR;
  try {
    for (const bad of ["public/etaxi", ".next/cache/x", "public"]) {
      process.env.STORAGE_DIR = path.join(process.cwd(), bad);
      assert.throws(() => storageRoot(), (e: unknown) => e instanceof PublicError && /public/.test(e.message), bad);
    }
    assert.equal(existsSync(path.join(process.cwd(), "public", "etaxi")), false);
  } finally {
    process.env.STORAGE_DIR = ok;
  }
});
