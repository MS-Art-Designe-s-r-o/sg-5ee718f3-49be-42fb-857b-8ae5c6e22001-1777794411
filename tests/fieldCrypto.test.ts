import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import {
  encryptField,
  decryptField,
  needsReencrypt,
  blindIndex,
  maskRodneCislo,
  maskGeneric,
  activeKeyId,
} from "../src/lib/crypto/fieldCrypto";
import { PublicError, describeError } from "../src/lib/safeLog";
import { normalizeRodneCislo } from "../src/lib/rodneCislo";

// Zjavne fiktívne hodnoty — nie sú to údaje žiadnej osoby.
const K1 = randomBytes(32).toString("base64");
const K2 = randomBytes(32).toString("base64");
const HMAC = randomBytes(32).toString("base64");
const AAD = "rodneCislo:999001";
const FAKE = "TEST-HODNOTA-123";

beforeEach(() => {
  process.env.FIELD_ENC_KEYS = `k1:${K1}`;
  process.env.FIELD_ENC_ACTIVE = "k1";
  process.env.FIELD_HMAC_KEY = HMAC;
});

test("roundtrip a formát v1:<keyId>:<iv>:<tag>:<ct>", () => {
  const t = encryptField(FAKE, AAD);
  const parts = t.split(":");
  assert.equal(parts.length, 5);
  assert.equal(parts[0], "v1");
  assert.equal(parts[1], "k1");
  assert.equal(Buffer.from(parts[2], "base64url").length, 12);
  assert.equal(Buffer.from(parts[3], "base64url").length, 16);
  assert.ok(!t.includes(FAKE));
  assert.equal(decryptField(t, AAD), FAKE);
  // náhodné IV → rovnaký vstup dáva iný token
  assert.notEqual(encryptField(FAKE, AAD), t);
});

test("iné AAD → dešifrovanie zlyhá (PublicError bez hodnoty)", () => {
  const t = encryptField(FAKE, AAD);
  assert.throws(() => decryptField(t, "rodneCislo:999002"), (e: unknown) => {
    assert.ok(e instanceof PublicError);
    assert.ok(!(e as Error).message.includes(FAKE));
    return true;
  });
  assert.throws(() => decryptField(t, "cisloOp:999001"), PublicError);
});

test("poškodený tag alebo šifrový text → zlyhá", () => {
  const t = encryptField(FAKE, AAD);
  const [v, k, iv, tag, ct] = t.split(":");
  const flip = (s: string) => {
    const b = Buffer.from(s, "base64url");
    b[0] ^= 0x01;
    return b.toString("base64url");
  };
  assert.throws(() => decryptField([v, k, iv, flip(tag), ct].join(":"), AAD), PublicError);
  assert.throws(() => decryptField([v, k, iv, tag, flip(ct)].join(":"), AAD), PublicError);
  assert.throws(() => decryptField("v1:k1:xx", AAD), PublicError);
  assert.throws(() => decryptField(`v2:${t.slice(3)}`, AAD), PublicError);
});

test("rotácia: token kľúča k1 sa dešifruje po aktivácii k2 a needsReencrypt = true", () => {
  const old = encryptField(FAKE, AAD);
  assert.equal(needsReencrypt(old), false);

  process.env.FIELD_ENC_KEYS = `k1:${K1},k2:${K2}`;
  process.env.FIELD_ENC_ACTIVE = "k2";
  assert.equal(activeKeyId(), "k2");
  assert.equal(needsReencrypt(old), true);
  assert.equal(decryptField(old, AAD), FAKE);

  const fresh = encryptField(FAKE, AAD);
  assert.equal(fresh.split(":")[1], "k2");
  assert.equal(needsReencrypt(fresh), false);

  // po odobratí k1 sa starý token už nedá prečítať
  process.env.FIELD_ENC_KEYS = `k2:${K2}`;
  assert.throws(() => decryptField(old, AAD), PublicError);
});

test("chýbajúci kľúč → PublicError až pri použití (lenivo)", async () => {
  delete process.env.FIELD_ENC_KEYS;
  delete process.env.FIELD_ENC_ACTIVE;
  delete process.env.FIELD_HMAC_KEY;
  // samotný import modulu bez kľúčov nezlyhá
  await import("../src/lib/crypto/fieldCrypto");
  assert.throws(() => encryptField(FAKE, AAD), PublicError);
  assert.throws(() => blindIndex("1234567890"), PublicError);
});

test("nesprávna dĺžka kľúča alebo neznámy aktívny kľúč → PublicError", () => {
  process.env.FIELD_ENC_KEYS = `k1:${randomBytes(16).toString("base64")}`;
  assert.throws(() => encryptField(FAKE, AAD), PublicError);
  process.env.FIELD_ENC_KEYS = `k1:${K1}`;
  process.env.FIELD_ENC_ACTIVE = "k9";
  assert.throws(() => encryptField(FAKE, AAD), PublicError);
  process.env.FIELD_ENC_ACTIVE = "k1";
  process.env.FIELD_HMAC_KEY = randomBytes(16).toString("base64");
  assert.throws(() => blindIndex("x"), PublicError);
});

test("chybová hláška PublicError neobsahuje kľúč", () => {
  process.env.FIELD_ENC_KEYS = `k1:${K1.slice(0, 20)}`;
  try {
    encryptField(FAKE, AAD);
    assert.fail("mal hodiť");
  } catch (e) {
    assert.ok(e instanceof PublicError);
    assert.ok(!(e as Error).message.includes(K1.slice(0, 20)));
  }
});

test("blindIndex je stabilný a nezávislý od zápisu (s lomkou / bez)", () => {
  const a = blindIndex(normalizeRodneCislo("123456/7890"));
  const b = blindIndex(normalizeRodneCislo("1234567890"));
  const c = blindIndex(normalizeRodneCislo(" 123456 / 7890 "));
  assert.equal(a, b);
  assert.equal(a, c);
  assert.match(a, /^[0-9a-f]{64}$/);
  assert.notEqual(a, blindIndex(normalizeRodneCislo("1234567891")));
  // iný HMAC kľúč → iný index
  process.env.FIELD_HMAC_KEY = randomBytes(32).toString("base64");
  assert.notEqual(blindIndex("1234567890"), a);
});

test("masky odhalia len posledné 2 znaky", () => {
  assert.equal(maskRodneCislo("123456/7890"), "******/**90");
  assert.equal(maskRodneCislo("1234567890"), "******/**90");
  assert.equal(maskRodneCislo(""), "******/****");
  assert.equal(maskGeneric("XX123456"), "******56");
  assert.equal(maskGeneric("AB1"), "******");
});

test("describeError nevypíše hodnoty z DB chyby", () => {
  const dbErr = Object.assign(new Error("Duplicate entry 'TAJNE-123' for key 'x'"), {
    code: "ER_DUP_ENTRY",
    errno: 1062,
    sqlState: "23000",
    sql: "INSERT INTO t VALUES ('TAJNE-123')",
    sqlMessage: "Duplicate entry 'TAJNE-123' for key 'x'",
  });
  const d = describeError(dbErr);
  assert.ok(!d.includes("TAJNE"));
  assert.match(d, /code=ER_DUP_ENTRY/);
  assert.match(d, /errno=1062/);
  assert.match(d, /sqlState=23000/);

  const other = describeError(new TypeError("niečo sa pokazilo"));
  assert.match(other, /TypeError/);
  assert.match(other, /niečo sa pokazilo/);
  assert.ok(!describeError(new Error("SMTP <x@example.invalid>"), { withMessage: false }).includes("example"));
  assert.equal(describeError("text"), "nechybová hodnota (string)");
});

test("snapshotDigest: HMAC závislý od kľúča, nie holý SHA-256", async () => {
  const { snapshotDigest } = await import("../src/lib/crypto/fieldCrypto");
  const { createHash, randomBytes } = await import("node:crypto");
  const prev = process.env.FIELD_HMAC_KEY;
  try {
    process.env.FIELD_HMAC_KEY = randomBytes(32).toString("base64");
    const a = snapshotDigest('{"rc":"9001010009"}');
    assert.match(a, /^[0-9a-f]{64}$/);
    assert.notEqual(a, createHash("sha256").update('{"rc":"9001010009"}').digest("hex"));
    process.env.FIELD_HMAC_KEY = randomBytes(32).toString("base64");
    assert.notEqual(snapshotDigest('{"rc":"9001010009"}'), a);
    delete process.env.FIELD_HMAC_KEY;
    assert.throws(() => snapshotDigest("{}"));
  } finally {
    if (prev === undefined) delete process.env.FIELD_HMAC_KEY;
    else process.env.FIELD_HMAC_KEY = prev;
  }
});
