import { createHash, createHmac } from "node:crypto";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  canTransition,
  changeStatus,
  generateContract,
  MissingDataError,
  previewContract,
  regenerateContract,
  type ContractRequest,
  type ServiceDeps,
} from "../../src/lib/contracts/service";
import { renderDocx } from "../../src/lib/contracts/render";
import { NoneConverter, type PdfConverter } from "../../src/lib/contracts/pdf";
import { SQL_ALLOCATE, SQL_LAST_ID } from "../../src/lib/contracts/numbering";
import type { Executor } from "../../src/lib/contracts/executor";
import type { AuditEntry } from "../../src/lib/audit";
import type { SqlParam, StavZmluvy } from "../../src/lib/db";
import { PublicError } from "../../src/lib/safeLog";
import { docxText } from "./_docx";
import { source, vodic } from "./_data";

const FIX = path.join(__dirname, "..", "fixtures");
const TPL: Record<string, Buffer> = {
  "sablony/NAJOM/v1_aaaaaaaa.docx": readFileSync(path.join(FIX, "sablona-najom.docx")),
  "sablony/DISPECING/v1_bbbbbbbb.docx": readFileSync(path.join(FIX, "sablona-dispecing.docx")),
};

test("canTransition: povolené a zakázané prechody", () => {
  const ok: [StavZmluvy, StavZmluvy][] = [
    ["NAVRH", "VYGENEROVANA"],
    ["VYGENEROVANA", "PODPISANA"],
    ["PODPISANA", "UKONCENA"],
    ["VYGENEROVANA", "UKONCENA"],
  ];
  const all: StavZmluvy[] = ["NAVRH", "VYGENEROVANA", "PODPISANA", "UKONCENA", "NAHRADENA"];
  for (const from of all) {
    for (const to of all) {
      const expected = ok.some(([a, b]) => a === from && b === to);
      assert.equal(canTransition(from, to), expected, `${from}→${to}`);
    }
  }
});

type World = {
  deps: ServiceDeps;
  files: Map<string, Buffer>;
  audits: AuditEntry[];
  sql: { sql: string; params: SqlParam[] }[];
  encrypted: { aad: string; plain: string }[];
  tx: { commits: number; rollbacks: number };
};

const REQ: ContractRequest = {
  typ: "NAJOM",
  driverId: 42,
  vehicleId: 5,
  datumUzavretia: "2026-02-01",
  platnostOd: "2026-02-01",
  platnostDo: null,
  najomneSuma: 60,
  najomneJednotka: "ZMENA",
  najomne24h: 110,
  kaucia: 300,
  spoluucast: 500,
  stavKmOdovzdanie: 45230,
  formaty: ["docx"],
};

function world(
  opts: {
    src?: ReturnType<typeof source> | null;
    failOn?: (sql: string) => boolean;
    failWrite?: boolean;
    noTemplate?: boolean;
    pdf?: PdfConverter;
    oldContract?: Record<string, unknown>;
    stav?: StavZmluvy;
  } = {}
): World {
  const files = new Map<string, Buffer>();
  const audits: AuditEntry[] = [];
  const sql: World["sql"] = [];
  const encrypted: World["encrypted"] = [];
  const txState = { commits: 0, rollbacks: 0 };
  let seq = 0;
  let lastId = 0;
  let insertId = 100;

  const handle: Executor = {
    async query<T>(q: string, params: SqlParam[] = []) {
      sql.push({ sql: q, params });
      if (q === SQL_LAST_ID) return [{ n: lastId }] as T[];
      if (q.startsWith("SELECT * FROM `Contract`")) return (opts.oldContract ? [opts.oldContract] : []) as T[];
      if (q.includes("SELECT `stav`, `podpisanaDna`")) return [{ stav: opts.stav ?? "VYGENEROVANA", podpisanaDna: null, ukoncenaDna: null }] as T[];
      if (q.startsWith("SELECT `stav` FROM `Contract`")) return [{ stav: opts.oldContract?.stav ?? "VYGENEROVANA" }] as T[];
      if (q.includes("MAX(`verzia`)")) return [{ v: 1 }] as T[];
      return [] as T[];
    },
    async execute(q: string, params: SqlParam[] = []) {
      sql.push({ sql: q, params });
      if (opts.failOn?.(q)) throw Object.assign(new Error("db chyba"), { code: "ER_LOCK_DEADLOCK" });
      if (q === SQL_ALLOCATE) {
        lastId = ++seq;
        return { insertId: 0, affectedRows: 1 };
      }
      if (q.startsWith("INSERT INTO `Contract`")) return { insertId: ++insertId, affectedRows: 1 };
      return { insertId: 0, affectedRows: 1 };
    },
  };

  const deps: ServiceDeps = {
    ex: handle,
    withTransaction: async (fn) => {
      try {
        const r = await fn(handle);
        txState.commits++;
        return r;
      } catch (e) {
        txState.rollbacks++;
        throw e;
      }
    },
    loadInput: async (_ex, p) => {
      if (opts.src === null) return null;
      const base = opts.src ?? source();
      return { ...base, typ: p.typ, input: p.input, vozidlo: p.typ === "NAJOM" ? base.vozidlo : null, meta: { cislo: null, verzia: 1, datumVygenerovania: "2026-02-01" } };
    },
    getActiveTemplate: async (_ex, typ) =>
      opts.noTemplate
        ? null
        : ({
            id: typ === "NAJOM" ? 11 : 12,
            typ,
            nazov: "T",
            verzia: 1,
            suborPath: typ === "NAJOM" ? "sablony/NAJOM/v1_aaaaaaaa.docx" : "sablony/DISPECING/v1_bbbbbbbb.docx",
            sha256: "x",
            platnaOd: "2026-01-01",
            aktivna: 1,
            aktivnaTyp: typ,
            tagy: null,
            createdById: null,
            createdAt: "",
          }),
    readFile: async (rel) => {
      const b = TPL[rel] ?? files.get(rel);
      if (!b) throw new PublicError("Súbor sa nenašiel.", 404);
      return b;
    },
    render: renderDocx,
    writeFile: async (rel, buf) => {
      if (opts.failWrite) throw new PublicError("Operácia so súborom zlyhala (ENOSPC).", 500);
      let r = rel;
      for (let i = 2; files.has(r); i++) r = rel.replace(/(\.[a-z]+)$/, `_${i}$1`);
      files.set(r, buf);
      return r;
    },
    removeFile: async (rel) => void files.delete(rel),
    encrypt: (plain, aad) => {
      encrypted.push({ aad, plain });
      return `enc:${aad}`;
    },
    digest: (json) => createHmac("sha256", "test-kluc").update("snapshot:").update(json).digest("hex"),
    audit: async (entry) => void audits.push(entry),
    pdf: opts.pdf ?? new NoneConverter(),
    today: () => "2026-02-01",
  };
  return { deps, files, audits, sql, encrypted, tx: txState };
}

const EXPECTED_DOCX = "zmluvy/Fiktívny Testo/2026-02-01_Najomna-zmluva_KE000ZZ_Fiktívny-Testo.docx";

test("generateContract: úspech — číslo, súbor, šifrovaný snapshot, UPDATE, audit v transakcii", async () => {
  const w = world();
  const r = await generateContract(w.deps, { ...REQ, formaty: ["docx", "pdf"] }, { userId: 1, ip: "127.0.0.1" });
  assert.equal(r.cislo, "NZ-2026-001");
  assert.match(r.cislo, /^NZ-\d{4}-\d{3,}$/);
  assert.equal(r.verzia, 1);
  assert.equal(r.stav, "VYGENEROVANA");
  assert.equal(r.hasPdf, false);
  assert.equal(r.pdfVarovanie, "PDF nie je na serveri dostupné");
  assert.deepEqual([...w.files.keys()], [EXPECTED_DOCX]);
  assert.deepEqual(w.tx, { commits: 1, rollbacks: 0 });

  // INSERT s dočasným prázdnym snapshotom, potom UPDATE so zašifrovaným.
  const ins = w.sql.find((s) => s.sql.startsWith("INSERT INTO `Contract`"));
  assert.ok(ins && /'NAVRH', '', '', ''/.test(ins.sql));
  assert.equal(ins.params[0], "NZ-2026-001");
  assert.equal(w.encrypted.length, 1);
  assert.equal(w.encrypted[0].aad, `snapshot:${r.id}`);
  const snap = JSON.parse(w.encrypted[0].plain);
  assert.equal(snap.schema, 1);
  assert.equal(snap.vodic.rodneCislo, "9001010000"); // snapshot obsahuje dešifrované RČ (len šifrovane v DB)
  assert.equal(snap.znacky.zmluva.cislo, "NZ-2026-001");
  const upd = w.sql.find((s) => s.sql.startsWith("UPDATE `Contract` SET `docxPath`"));
  assert.deepEqual(upd?.params.slice(0, 2), [EXPECTED_DOCX, `enc:snapshot:${r.id}`]);
  assert.match(String(upd?.params[2]), /^[0-9a-f]{64}$/);
  // odtlačok nie je holý SHA-256 snapshotu (RČ by sa dalo hádať)
  assert.notEqual(upd?.params[2], createHash("sha256").update(w.encrypted[0].plain, "utf8").digest("hex"));

  // Dokument obsahuje číslo a údaje.
  const t = docxText(w.files.get(EXPECTED_DOCX)!);
  assert.ok(t.includes("Číslo zmluvy: NZ-2026-001"));
  assert.ok(t.includes("Testo Fiktívny"));

  assert.equal(w.audits.length, 1);
  assert.equal(w.audits[0].action, "CONTRACT_GENERATE");
  assert.equal(w.audits[0].entityId, r.id);
  assert.equal(w.audits[0].ip, "127.0.0.1");
  assert.ok(!JSON.stringify(w.audits).includes("Testo"));
});

test("generateContract: zlyhanie DB po zápise súboru → súbor sa zmaže, rollback", async () => {
  const w = world({ failOn: (q) => q.startsWith("UPDATE `Contract` SET `docxPath`") });
  await assert.rejects(generateContract(w.deps, REQ, { userId: 1, ip: null }), (e: unknown) => (e as { code?: string }).code === "ER_LOCK_DEADLOCK");
  assert.equal(w.files.size, 0);
  assert.deepEqual(w.tx, { commits: 0, rollbacks: 1 });
  assert.equal(w.audits.length, 0);
});

test("generateContract: zlyhanie auditu → súbor sa zmaže, rollback", async () => {
  const w = world();
  w.deps.audit = async () => {
    throw new Error("audit");
  };
  await assert.rejects(generateContract(w.deps, REQ, { userId: 1, ip: null }));
  assert.equal(w.files.size, 0);
  assert.equal(w.tx.rollbacks, 1);
});

test("generateContract: zlyhanie zápisu súboru → rollback, žiadny súbor", async () => {
  const w = world({ failWrite: true });
  await assert.rejects(generateContract(w.deps, REQ, { userId: 1, ip: null }), PublicError);
  assert.equal(w.files.size, 0);
  assert.equal(w.tx.rollbacks, 1);
});

test("generateContract: chýbajúce údaje → 422 bez transakcie", async () => {
  const w = world({ src: source({ vodic: vodic({ cisloPvt: null }) }) });
  await assert.rejects(generateContract(w.deps, REQ, { userId: 1, ip: null }), (e: unknown) => {
    assert.ok(e instanceof MissingDataError);
    assert.equal(e.status, 422);
    assert.deepEqual(e.chybajuce.map((c) => c.pole), ["vodic.cisloPvt"]);
    return true;
  });
  assert.deepEqual(w.tx, { commits: 0, rollbacks: 0 });
});

test("generateContract: bez aktívnej šablóny → 409; neexistujúci vodič → 404", async () => {
  await assert.rejects(
    generateContract(world({ noTemplate: true }).deps, REQ, { userId: 1, ip: null }),
    (e: unknown) => e instanceof PublicError && e.status === 409 && e.message === "Nie je aktívna šablóna pre tento typ"
  );
  await assert.rejects(
    generateContract(world({ src: null }).deps, REQ, { userId: 1, ip: null }),
    (e: unknown) => e instanceof PublicError && e.status === 404
  );
});

test("generateContract: dispečing DS-… bez EČV v názve; dostupné PDF sa uloží po commite", async () => {
  const pdf: PdfConverter = { available: true, convert: async () => Buffer.from("%PDF-1.7") };
  const w = world({ pdf });
  const r = await generateContract(
    w.deps,
    { ...REQ, typ: "DISPECING", vehicleId: null, provizia: 15, poplatokRegistracny: 30, formaty: ["docx", "pdf"] },
    { userId: 1, ip: null }
  );
  assert.equal(r.cislo, "DS-2026-001");
  assert.equal(r.hasPdf, true);
  assert.equal(r.pdfVarovanie, undefined);
  assert.deepEqual([...w.files.keys()].sort(), [
    "zmluvy/Fiktívny Testo/2026-02-01_Dispecerska-zmluva_Fiktívny-Testo.docx",
    "zmluvy/Fiktívny Testo/2026-02-01_Dispecerska-zmluva_Fiktívny-Testo.pdf",
  ]);
  const pdfUpd = w.sql.find((s) => s.sql.startsWith("UPDATE `Contract` SET `pdfPath`"));
  assert.ok(pdfUpd);
});

test("generateContract: zlyhaný prevod PDF je len varovanie", async () => {
  const pdf: PdfConverter = {
    available: true,
    convert: async () => {
      throw new PublicError("Prevod do PDF zlyhal (HTTP 500).", 502);
    },
  };
  const w = world({ pdf });
  const r = await generateContract(w.deps, { ...REQ, formaty: ["pdf"] }, { userId: 1, ip: null });
  assert.equal(r.hasDocx, true);
  assert.equal(r.hasPdf, false);
  assert.equal(r.pdfVarovanie, "Prevod do PDF zlyhal (HTTP 500).");
  assert.equal(w.files.size, 1);
});

const OLD = {
  id: 55,
  cislo: "NZ-2026-007",
  verzia: 1,
  typ: "NAJOM",
  driverId: 42,
  vehicleId: 5,
  stav: "PODPISANA",
  datumUzavretia: "2026-02-01",
  platnostOd: "2026-02-01",
  platnostDo: null,
  najomneSuma: 60,
  najomneJednotka: "ZMENA",
  najomne24h: null,
  kaucia: 300,
  spoluucast: null,
  stavKmOdovzdanie: null,
  provizia: null,
  poplatokRegistracny: null,
  pdfPath: null,
};

test("regenerateContract: rovnaké číslo, verzia+1, nahradzaId, _v2 súbor, pôvodná → NAHRADENA", async () => {
  const w = world({ oldContract: OLD });
  const r = await regenerateContract(w.deps, 55, { userId: 1, ip: null });
  assert.equal(r.cislo, "NZ-2026-007");
  assert.equal(r.verzia, 2);
  assert.ok(!w.sql.some((s) => s.sql === SQL_ALLOCATE), "číslo sa nealokuje znova");
  const ins = w.sql.find((s) => s.sql.startsWith("INSERT INTO `Contract`"));
  assert.deepEqual(ins?.params.slice(0, 3), ["NZ-2026-007", 2, 55]);
  assert.deepEqual([...w.files.keys()], ["zmluvy/Fiktívny Testo/2026-02-01_Najomna-zmluva_KE000ZZ_Fiktívny-Testo_v2.docx"]);
  const nahr = w.sql.find((s) => s.sql.includes("SET `stav` = 'NAHRADENA'"));
  assert.deepEqual(nahr?.params, [55]);
  assert.equal(w.audits[0].action, "CONTRACT_REGENERATE");
});

test("regenerateContract: nahradenú zmluvu nemožno regenerovať; neexistujúca → 404", async () => {
  await assert.rejects(
    regenerateContract(world({ oldContract: { ...OLD, stav: "NAHRADENA" } }).deps, 55, { userId: 1, ip: null }),
    (e: unknown) => e instanceof PublicError && e.status === 409
  );
  await assert.rejects(regenerateContract(world().deps, 1, { userId: 1, ip: null }), (e: unknown) => e instanceof PublicError && e.status === 404);
});

test("changeStatus: dátum podpisu, audit {z, na}; zakázaný prechod → 409", async () => {
  const w = world({ stav: "VYGENEROVANA" });
  const r = await changeStatus(w.deps, 9, "PODPISANA", { userId: 1, ip: null });
  assert.deepEqual(r, { id: 9, stav: "PODPISANA", podpisanaDna: "2026-02-01", ukoncenaDna: null });
  assert.deepEqual(w.audits[0].meta, { z: "VYGENEROVANA", na: "PODPISANA" });
  const w2 = world({ stav: "UKONCENA" });
  await assert.rejects(changeStatus(w2.deps, 9, "PODPISANA", { userId: 1, ip: null }), (e: unknown) => e instanceof PublicError && e.status === 409);
  assert.equal(w2.audits.length, 0);
});

test("previewContract: RČ a OP len maskované, sekcie z dát šablóny", async () => {
  const w = world();
  const r = await previewContract(w.deps, REQ);
  assert.deepEqual(r.chybajuce, []);
  const json = JSON.stringify(r);
  assert.ok(!json.includes("9001010000"));
  assert.ok(!json.includes("900101/0000"));
  assert.ok(!json.includes("XX000000"));
  assert.ok(!json.includes("Enc"));
  const vodicSek = r.nahlad.sekcie.find((s) => s.nazov === "Vodič");
  assert.equal(vodicSek?.polozky.find((p) => p.label === "Rodné číslo")?.hodnota, "******/**00");
  assert.equal(vodicSek?.polozky.find((p) => p.label === "Číslo OP")?.hodnota, "******00");
  const zmluva = r.nahlad.sekcie.find((s) => s.nazov === "Zmluva");
  assert.equal(zmluva?.polozky.find((p) => p.label === "Číslo zmluvy")?.hodnota, "(pridelí sa pri generovaní)");
  assert.equal(zmluva?.polozky.find((p) => p.label === "Nájomné")?.hodnota, "60,00 €");
  assert.ok(!r.nahlad.sekcie.some((s) => s.nazov === "Flotila"));
  assert.equal(w.tx.commits, 0);
});

test("regenerateContract: miesto podpisu sa prevezme z pôvodného snapshotu", async () => {
  const w = world({ oldContract: { ...OLD, snapshotEnc: "tok" } });
  w.deps.decrypt = (token, aad) => {
    assert.equal(token, "tok");
    assert.equal(aad, "snapshot:55");
    return JSON.stringify({ input: { miestoPodpisu: "Prešove" } });
  };
  await regenerateContract(w.deps, 55, { userId: 1, ip: null });
  const snap = JSON.parse(w.encrypted[0].plain);
  assert.equal(snap.input.miestoPodpisu, "Prešove");
  assert.equal(snap.znacky.zmluva.miesto_podpisu, "Prešove");
  // nečitateľný snapshot → predvolené
  const w2 = world({ oldContract: { ...OLD, snapshotEnc: "zly" } });
  w2.deps.decrypt = () => {
    throw new Error("x");
  };
  await regenerateContract(w2.deps, 55, { userId: 1, ip: null });
  assert.equal(JSON.parse(w2.encrypted[0].plain).znacky.zmluva.miesto_podpisu, "Košiciach");
});
