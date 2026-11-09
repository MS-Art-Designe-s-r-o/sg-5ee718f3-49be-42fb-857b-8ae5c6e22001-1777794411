import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import PizZip from "pizzip";
import {
  activateTemplate,
  createTemplate,
  decodeBase64Upload,
  MAX_TEMPLATE_BYTES,
  validateTemplateUpload,
} from "../../src/lib/contracts/templates";
import { TemplateError } from "../../src/lib/contracts/render";
import type { Executor } from "../../src/lib/contracts/executor";
import { PublicError } from "../../src/lib/safeLog";
import type { SqlParam } from "../../src/lib/db";
import { makeDocx } from "./_docx";

const FIX = path.join(__dirname, "..", "fixtures");

test("validateTemplateUpload: obe fixtures prejdú bez varovaní", () => {
  for (const f of ["sablona-najom.docx", "sablona-dispecing.docx"]) {
    const r = validateTemplateUpload(readFileSync(path.join(FIX, f)));
    assert.match(r.sha256, /^[0-9a-f]{64}$/);
    assert.deepEqual(r.varovania, []);
    assert.ok(r.tagy.includes("firma.nazov"));
  }
});

test("validateTemplateUpload: neznáme značky sú len varovania", () => {
  const r = validateTemplateUpload(makeDocx(["{firma.nazov}", "{neznama.vec}"]));
  assert.deepEqual(r.varovania, ["neznama.vec"]);
});

test("validateTemplateUpload: odmietne prázdny, veľký, ne-ZIP, ZIP bez document.xml a chybnú šablónu", () => {
  const is400 = (e: unknown) => e instanceof PublicError && e.status === 400;
  assert.throws(() => validateTemplateUpload(Buffer.alloc(0)), is400);
  const big = Buffer.alloc(MAX_TEMPLATE_BYTES + 1);
  big.write("PK\x03\x04", "latin1");
  assert.throws(() => validateTemplateUpload(big), is400);
  assert.throws(() => validateTemplateUpload(Buffer.from("%PDF-1.4 nie docx")), is400);
  // Magické bajty sedia, ale obsah je poškodený.
  const broken = Buffer.concat([Buffer.from("PK\x03\x04", "latin1"), Buffer.alloc(100, 1)]);
  assert.throws(() => validateTemplateUpload(broken), is400);
  // Platný ZIP bez word/document.xml.
  const zip = new PizZip();
  zip.file("hello.txt", "x");
  assert.throws(() => validateTemplateUpload(zip.generate({ type: "nodebuffer" }) as Buffer), is400);
  // Chyba šablóny → TemplateError so zoznamom značiek.
  assert.throws(
    () => validateTemplateUpload(makeDocx(["{#flotila}bez konca"])),
    (e: unknown) => e instanceof TemplateError && e.status === 400 && e.chyby[0] === "unclosed_loop: flotila"
  );
});

test("decodeBase64Upload: data URL aj čistý base64; neplatný → 400", () => {
  assert.equal(decodeBase64Upload("data:application/octet-stream;base64,UEsDBA==").toString("latin1"), "PK\x03\x04");
  assert.equal(decodeBase64Upload("UEsD\nBA==").toString("latin1"), "PK\x03\x04");
  assert.throws(() => decodeBase64Upload("nie je base64!"), PublicError);
  assert.throws(() => decodeBase64Upload(""), PublicError);
});

function fakeTx(maxVerzia: number | null, failInsert = false) {
  const calls: { sql: string; params: SqlParam[] }[] = [];
  const ex: Executor = {
    async query<T>(sql: string, params: SqlParam[] = []) {
      calls.push({ sql, params });
      if (sql.includes("MAX(`verzia`)")) return [{ v: maxVerzia }] as T[];
      if (sql.includes("SELECT `typ`, `verzia`, `aktivna`")) return (params[0] === 9 ? [{ typ: "NAJOM", verzia: 3, aktivna: 0 }] : []) as T[];
      return [] as T[];
    },
    async execute(sql: string, params: SqlParam[] = []) {
      calls.push({ sql, params });
      if (failInsert && sql.startsWith("INSERT")) throw Object.assign(new Error("db"), { code: "ER_X" });
      return { insertId: 77, affectedRows: 1 };
    },
  };
  return { ex, calls };
}

test("createTemplate: verzia = MAX+1, cesta sablony/{typ}/v{n}_{sha8}.docx, tagy JSON", async () => {
  const { ex, calls } = fakeTx(2);
  const written: string[] = [];
  const r = await createTemplate(
    ex,
    { typ: "NAJOM", nazov: "Nájom 2026", platnaOd: "2026-01-01", buffer: Buffer.from("x"), check: { sha256: "abcdef0123", tagy: ["firma.nazov"], varovania: [] }, userId: 1 },
    { write: async (rel) => (written.push(rel), rel), remove: async () => undefined }
  );
  assert.deepEqual(r, { id: 77, verzia: 3, suborPath: "sablony/NAJOM/v3_abcdef01.docx" });
  assert.deepEqual(written, ["sablony/NAJOM/v3_abcdef01.docx"]);
  const ins = calls.find((c) => c.sql.startsWith("INSERT"));
  assert.deepEqual(ins?.params, ["NAJOM", "Nájom 2026", 3, "sablony/NAJOM/v3_abcdef01.docx", "abcdef0123", "2026-01-01", '["firma.nazov"]', 1]);
});

test("createTemplate: pri zlyhaní INSERT sa súbor zmaže", async () => {
  const { ex } = fakeTx(null, true);
  const removed: string[] = [];
  await assert.rejects(
    createTemplate(
      ex,
      { typ: "DISPECING", nazov: "D", platnaOd: "2026-01-01", buffer: Buffer.from("x"), check: { sha256: "1234567890", tagy: [], varovania: [] }, userId: null },
      { write: async (rel) => rel, remove: async (rel) => void removed.push(rel) }
    )
  );
  assert.deepEqual(removed, ["sablony/DISPECING/v1_12345678.docx"]);
});

test("activateTemplate: najprv deaktivuje ostatné, potom aktivuje", async () => {
  const { ex, calls } = fakeTx(null);
  assert.deepEqual(await activateTemplate(ex, 9), { typ: "NAJOM", verzia: 3, zmena: true });
  const upd = calls.filter((c) => c.sql.startsWith("UPDATE"));
  assert.equal(upd.length, 2);
  assert.match(upd[0].sql, /SET `aktivna` = 0/);
  assert.deepEqual(upd[0].params, ["NAJOM", 9]);
  assert.match(upd[1].sql, /SET `aktivna` = 1/);
  assert.equal(await activateTemplate(ex, 10), null);
});

test("validateTemplateUpload: zip bomba (veľký document.xml po rozbalení) → 400", () => {
  const zip = new PizZip(makeDocx(["{firma.nazov}"]));
  // ~30 MB textu sa zbalí na pár desiatok kB
  zip.file("word/document.xml", "<w:document>" + " ".repeat(30 * 1024 * 1024) + "</w:document>");
  const buf = zip.generate({ type: "nodebuffer", compression: "DEFLATE" }) as Buffer;
  assert.ok(buf.length < MAX_TEMPLATE_BYTES);
  assert.throws(
    () => validateTemplateUpload(buf),
    (e: unknown) => e instanceof PublicError && e.status === 400 && /príliš veľký/.test(e.message)
  );
});

test("validateTemplateUpload: veľa stredne veľkých položiek nad celkový limit → 400", () => {
  const zip = new PizZip(makeDocx(["{firma.nazov}"]));
  for (let i = 0; i < 4; i++) zip.file(`word/media/x${i}.xml`, "a".repeat(19 * 1024 * 1024));
  const buf = zip.generate({ type: "nodebuffer", compression: "DEFLATE" }) as Buffer;
  assert.throws(() => validateTemplateUpload(buf), (e: unknown) => e instanceof PublicError && e.status === 400);
});

test("validateTemplateUpload: {@raw} značka (surové XML) sa odmietne", () => {
  assert.throws(
    () => validateTemplateUpload(makeDocx(["{@vodic.meno}"])),
    (e: unknown) => e instanceof TemplateError && e.chyby.some((c) => c.startsWith("raw_xml_nepovolene"))
  );
});
