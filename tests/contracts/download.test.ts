import { test } from "node:test";
import assert from "node:assert/strict";
import { attachmentHeader } from "../../src/lib/contracts/download";

test("attachmentHeader: ASCII fallback a filename* v UTF-8", () => {
  const name = "2026-02-01_Najomna-zmluva_KE000ZZ_Fiktívny-Testo.docx";
  assert.equal(
    attachmentHeader(name),
    `attachment; filename="2026-02-01_Najomna-zmluva_KE000ZZ_Fiktivny-Testo.docx"; filename*=UTF-8''${encodeURIComponent(name)}`
  );
});

test("attachmentHeader: bez zalomení a úvodzoviek, RFC 5987 kódovanie", () => {
  const h = attachmentHeader('zlý"názov\r\n(1)*.docx');
  assert.ok(!/[\r\n]/.test(h));
  assert.equal(h, "attachment; filename=\"zly_nazov__(1)*.docx\"; filename*=UTF-8''zl%C3%BD_n%C3%A1zov__%281%29%2A.docx");
});
