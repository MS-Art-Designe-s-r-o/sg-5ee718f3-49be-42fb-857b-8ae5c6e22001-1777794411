import { test } from "node:test";
import assert from "node:assert/strict";
import { getPdfConverter, GotenbergConverter, NoneConverter, MSG_PDF_UNAVAILABLE } from "../../src/lib/contracts/pdf";
import { PublicError } from "../../src/lib/safeLog";

test("getPdfConverter: default none, gotenberg len s URL", () => {
  assert.equal(getPdfConverter({}).available, false);
  assert.equal(getPdfConverter({ PDF_CONVERTER: "none" }).available, false);
  assert.equal(getPdfConverter({ PDF_CONVERTER: "gotenberg" }).available, false);
  const g = getPdfConverter({ PDF_CONVERTER: "gotenberg", GOTENBERG_URL: "http://localhost:3000" });
  assert.ok(g instanceof GotenbergConverter);
  assert.equal(g.available, true);
});

test("NoneConverter hádže PublicError", async () => {
  await assert.rejects(new NoneConverter().convert(), (e: unknown) => e instanceof PublicError && e.message === MSG_PDF_UNAVAILABLE);
});

test("Gotenberg: POST multipart na /forms/libreoffice/convert s basic auth", async () => {
  let seenUrl = "";
  let seenInit: RequestInit | undefined;
  const conv = getPdfConverter(
    { PDF_CONVERTER: "gotenberg", GOTENBERG_URL: "https://pdf.example/", GOTENBERG_USER: "u", GOTENBERG_PASS: "p" },
    async (url, init) => {
      seenUrl = url;
      seenInit = init;
      return new Response(Buffer.from("%PDF-1.7 test"), { status: 200 });
    }
  );
  const out = await conv.convert(Buffer.from("PK docx"));
  assert.equal(out.toString(), "%PDF-1.7 test");
  assert.equal(seenUrl, "https://pdf.example/forms/libreoffice/convert");
  assert.equal(seenInit?.method, "POST");
  assert.equal((seenInit?.headers as Record<string, string>).Authorization, `Basic ${Buffer.from("u:p").toString("base64")}`);
  const form = seenInit?.body as FormData;
  const file = form.get("files") as File;
  assert.equal(file.name, "zmluva.docx");
  assert.equal(Buffer.from(await file.arrayBuffer()).toString(), "PK docx");
  assert.ok(seenInit?.signal instanceof AbortSignal);
});

test("Gotenberg: chyby bez obsahu odpovede", async () => {
  const bad = new GotenbergConverter({ url: "http://x", fetchImpl: async () => new Response("tajné údaje", { status: 500 }) });
  await assert.rejects(bad.convert(Buffer.from("x")), (e: unknown) => {
    assert.ok(e instanceof PublicError);
    assert.equal(e.message, "Prevod do PDF zlyhal (HTTP 500).");
    return true;
  });
  const notPdf = new GotenbergConverter({ url: "http://x", fetchImpl: async () => new Response("<html>", { status: 200 }) });
  await assert.rejects(notPdf.convert(Buffer.from("x")), PublicError);
  const down = new GotenbergConverter({
    url: "http://x",
    fetchImpl: async () => {
      throw new Error("ECONNREFUSED 10.0.0.1");
    },
  });
  await assert.rejects(down.convert(Buffer.from("x")), (e: unknown) => e instanceof PublicError && !e.message.includes("10.0.0.1"));
});

test("Gotenberg: timeout cez AbortController", async () => {
  const slow = new GotenbergConverter({
    url: "http://x",
    timeoutMs: 20,
    fetchImpl: (_u, init) =>
      new Promise((_res, rej) => {
        init.signal?.addEventListener("abort", () => rej(new Error("aborted")));
      }),
  });
  await assert.rejects(slow.convert(Buffer.from("x")), (e: unknown) => e instanceof PublicError && e.status === 504);
});

test("Gotenberg: neplatná URL", () => {
  assert.throws(() => new GotenbergConverter({ url: "ftp://x" }), PublicError);
});
