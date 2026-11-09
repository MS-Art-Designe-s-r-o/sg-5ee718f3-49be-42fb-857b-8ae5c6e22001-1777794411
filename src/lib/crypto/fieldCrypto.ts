// Aplikačné šifrovanie citlivých polí (rodné číslo, číslo OP, snapshot zmluvy).
//
// AES-256-GCM (node:crypto), IV 12 B, autentifikačný tag 16 B.
// AAD = "<pole>:<userId>" (resp. "snapshot:<contractId>") — šifrový text je tak
// zviazaný s konkrétnym poľom a záznamom; presunutý do iného riadku sa nedešifruje.
// Formát tokenu: v1:<keyId>:<iv b64url>:<tag b64url>:<ct b64url>
//
// Env:
//   FIELD_ENC_KEYS   = "k1:<base64 32 B>,k2:<base64 32 B>"  (všetky kľúče, aj staré)
//   FIELD_ENC_ACTIVE = "k2"                                  (kľúč na nové šifrovanie)
//   FIELD_HMAC_KEY   = "<base64 ≥ 32 B>"                     (blind index)
//
// Kľúče sa načítajú LENIVO pri prvom použití (nie pri importe), aby portál bez
// nastavených kľúčov inak bežal. Chyby nikdy neobsahujú hodnoty ani kľúče.
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import { PublicError } from "../safeLog";

const VERSION = "v1";
const ALG = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;
const KEY_ID_RE = /^[A-Za-z0-9_-]{1,16}$/;

const MSG_NOT_CONFIGURED = "Šifrovanie osobných údajov nie je nakonfigurované.";
const MSG_BAD_KEY = "Kľúč na šifrovanie osobných údajov je neplatný (vyžaduje sa 32 bajtov v base64).";
const MSG_BAD_HMAC = "Kľúč pre index osobných údajov je neplatný (vyžaduje sa aspoň 32 bajtov v base64).";
const MSG_DECRYPT = "Údaj sa nepodarilo dešifrovať.";
const MSG_FORMAT = "Zašifrovaný údaj má neplatný formát.";
const MSG_UNKNOWN_KEY = "Zašifrovaný údaj používa neznámy kľúč.";
const MSG_AAD = "Chýba kontext šifrovania.";

type KeyRing = { keys: Map<string, Buffer>; active: string };

// Cache podľa aktuálnych hodnôt env (testy a rotácia menia env za behu procesu).
let ringCache: { src: string; ring: KeyRing } | null = null;
let hmacCache: { src: string; key: Buffer } | null = null;

function decodeBase64(v: string): Buffer | null {
  const t = v.trim();
  if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(t)) return null;
  return Buffer.from(t.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function loadKeyRing(): KeyRing {
  const rawKeys = process.env.FIELD_ENC_KEYS ?? "";
  const rawActive = (process.env.FIELD_ENC_ACTIVE ?? "").trim();
  const src = `${rawKeys}\u0000${rawActive}`;
  if (ringCache && ringCache.src === src) return ringCache.ring;

  if (!rawKeys.trim()) throw new PublicError(MSG_NOT_CONFIGURED, 503);

  const keys = new Map<string, Buffer>();
  for (const entry of rawKeys.split(",")) {
    const e = entry.trim();
    if (!e) continue;
    const sep = e.indexOf(":");
    if (sep <= 0) throw new PublicError(MSG_BAD_KEY, 503);
    const id = e.slice(0, sep).trim();
    const key = decodeBase64(e.slice(sep + 1));
    if (!KEY_ID_RE.test(id) || !key || key.length !== KEY_LEN || keys.has(id)) {
      throw new PublicError(MSG_BAD_KEY, 503);
    }
    keys.set(id, key);
  }
  if (keys.size === 0) throw new PublicError(MSG_NOT_CONFIGURED, 503);

  // Bez FIELD_ENC_ACTIVE je prípustný len jediný kľúč (inak nie je jasné, ktorý použiť).
  let active = rawActive;
  if (!active) {
    if (keys.size !== 1) throw new PublicError(MSG_NOT_CONFIGURED, 503);
    active = [...keys.keys()][0];
  }
  if (!keys.has(active)) throw new PublicError(MSG_NOT_CONFIGURED, 503);

  const ring = { keys, active };
  ringCache = { src, ring };
  return ring;
}

function loadHmacKey(): Buffer {
  const raw = process.env.FIELD_HMAC_KEY ?? "";
  if (hmacCache && hmacCache.src === raw) return hmacCache.key;
  if (!raw.trim()) throw new PublicError(MSG_NOT_CONFIGURED, 503);
  const key = decodeBase64(raw);
  if (!key || key.length < KEY_LEN) throw new PublicError(MSG_BAD_HMAC, 503);
  hmacCache = { src: raw, key };
  return key;
}

const b64u = (b: Buffer) => b.toString("base64url");

function parseToken(token: string): { keyId: string; iv: Buffer; tag: Buffer; ct: Buffer } {
  if (typeof token !== "string") throw new PublicError(MSG_FORMAT);
  const parts = token.split(":");
  if (parts.length !== 5 || parts[0] !== VERSION || !KEY_ID_RE.test(parts[1])) {
    throw new PublicError(MSG_FORMAT);
  }
  const [, keyId, ivS, tagS, ctS] = parts;
  const b64uRe = /^[A-Za-z0-9_-]*$/;
  if (!b64uRe.test(ivS) || !b64uRe.test(tagS) || !b64uRe.test(ctS)) {
    throw new PublicError(MSG_FORMAT);
  }
  const iv = Buffer.from(ivS, "base64url");
  const tag = Buffer.from(tagS, "base64url");
  const ct = Buffer.from(ctS, "base64url");
  if (iv.length !== IV_LEN || tag.length !== TAG_LEN) throw new PublicError(MSG_FORMAT);
  return { keyId, iv, tag, ct };
}

/** Overí, že sú kľúče nastavené a platné (napr. na začiatku skriptu). Vráti aktívny keyId. */
export function activeKeyId(): string {
  return loadKeyRing().active;
}

/** Zašifruje text aktívnym kľúčom. `aad` = "<pole>:<id záznamu>". */
export function encryptField(plain: string, aad: string): string {
  if (!aad) throw new PublicError(MSG_AAD);
  const { keys, active } = loadKeyRing();
  const iv = randomBytes(IV_LEN);
  const key = keys.get(active) as Buffer; // loadKeyRing zaručuje, že aktívny kľúč existuje
  const cipher = createCipheriv(ALG, key, iv, { authTagLength: TAG_LEN });
  cipher.setAAD(Buffer.from(aad, "utf8"));
  const ct = Buffer.concat([cipher.update(String(plain), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, active, b64u(iv), b64u(tag), b64u(ct)].join(":");
}

/** Dešifruje token; pri inom AAD, poškodení alebo neznámom kľúči hodí PublicError. */
export function decryptField(token: string, aad: string): string {
  if (!aad) throw new PublicError(MSG_AAD);
  const { keys } = loadKeyRing();
  const { keyId, iv, tag, ct } = parseToken(token);
  const key = keys.get(keyId);
  if (!key) throw new PublicError(MSG_UNKNOWN_KEY);
  try {
    const decipher = createDecipheriv(ALG, key, iv, { authTagLength: TAG_LEN });
    decipher.setAAD(Buffer.from(aad, "utf8"));
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
  } catch {
    // Pôvodnú chybu zámerne zahadzujeme (žiadne detaily navonok).
    throw new PublicError(MSG_DECRYPT);
  }
}

/** True, ak je token zašifrovaný iným než aktívnym kľúčom (treba prešifrovať). */
export function needsReencrypt(token: string): boolean {
  const { active } = loadKeyRing();
  return parseToken(token).keyId !== active;
}

/** Blind index (HMAC-SHA256, hex) normalizovanej hodnoty — len na detekciu duplicity. */
export function blindIndex(normalizedValue: string): string {
  return createHmac("sha256", loadHmacKey()).update(String(normalizedValue), "utf8").digest("hex");
}

/**
 * Odtlačok snapshotu zmluvy (Contract.snapshotSha256): HMAC-SHA256 kľúčom
 * FIELD_HMAC_KEY s doménovým oddelením „snapshot:“. Obyčajný SHA-256 nad JSON
 * s RČ/OP by sa dal pri znalosti ostatných údajov uhádnuť hrubou silou.
 */
export function snapshotDigest(json: string): string {
  return createHmac("sha256", loadHmacKey()).update("snapshot:", "utf8").update(String(json), "utf8").digest("hex");
}

// Maska rodného čísla v tvare „******/**NN" (len posledné 2 číslice).
export function maskRodneCislo(plain: string): string {
  const digits = String(plain ?? "").replace(/\D/g, "");
  return `******/**${digits.length >= 2 ? digits.slice(-2) : "**"}`;
}

/** Všeobecná maska (napr. číslo OP): pevná dĺžka, len posledné 2 znaky. */
export function maskGeneric(plain: string): string {
  const t = String(plain ?? "").replace(/\s+/g, "");
  return t.length >= 5 ? `******${t.slice(-2)}` : "******";
}
