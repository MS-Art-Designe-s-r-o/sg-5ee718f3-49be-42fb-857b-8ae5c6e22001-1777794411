// Audit log modulu zmlúv (tabuľka AuditLog, len INSERT, retencia 5 rokov).
//
// GDPR: do `meta` nesmú ísť osobné údaje — sanitizeMeta pustí len krátke
// primitíva a plytké polia primitív a zahodí kľúče, ktoré vyzerajú ako osobné
// údaje. Zapisujú sa NÁZVY polí, nikdy hodnoty.
import type { PoolConnection } from "mysql2/promise";
import { execute, type SqlParam } from "./db";

export const AUDIT_ACTIONS = [
  "CONTRACT_GENERATE",
  "CONTRACT_DOWNLOAD",
  "CONTRACT_STATUS",
  "CONTRACT_REGENERATE",
  "PII_REVEAL",
  "PII_UPDATE",
  "TEMPLATE_UPLOAD",
  "TEMPLATE_ACTIVATE",
  "TEMPLATE_DOWNLOAD",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

type MetaPrimitive = string | number | boolean | null;
export type AuditMeta = Record<string, MetaPrimitive | MetaPrimitive[]>;

export type AuditEntry = {
  /** Kto akciu vykonal (prihlásený používateľ). */
  userId: number | null;
  action: AuditAction;
  /** Typ entity, napr. "DriverProfile", "Contract", "ContractTemplate". */
  entity: string;
  entityId?: number | null;
  ip?: string | null;
  meta?: Record<string, unknown> | null;
};

/** Čokoľvek s metódou execute — spojenie z withTransaction, pool alebo testovací mock. */
export type AuditExecutor = {
  execute: (sql: string, params: SqlParam[]) => Promise<unknown>;
};

/** Podreťazce kľúčov (case-insensitive), ktoré sa do meta nikdy nezapíšu. */
const FORBIDDEN_KEY_PARTS = [
  "rodnecislo",
  "cisloop",
  "iban",
  "meno",
  "priezvisko",
  "adresa",
  "pobyt",
  "sidlo",
  "telefon",
  "email",
  "datumnarodenia",
  "narod",
  "snapshot",
  "heslo",
  "password",
  "token",
  "secret",
  "hodnota",
  "value",
];

const MAX_KEYS = 20;
const MAX_KEY_LEN = 40;
const MAX_STRING = 100;
const MAX_ARRAY = 50;
const MAX_JSON = 4000;

function isForbiddenKey(key: string): boolean {
  const k = key.toLowerCase().replace(/[^a-z0-9]/g, "");
  return FORBIDDEN_KEY_PARTS.some((p) => k.includes(p));
}

function cleanPrimitive(v: unknown): MetaPrimitive | undefined {
  if (v === null) return null;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v === "string") return v.length <= MAX_STRING ? v : undefined;
  return undefined; // objekty, funkcie, undefined, bigint, symbol → zahodiť
}

/**
 * Vyčistí meta pre audit log: len primitíva (string ≤ 100 znakov, number,
 * boolean, null) a plytké polia primitív; zakázané kľúče sa zahodia.
 * Vráti null, ak nič nezostane.
 */
export function sanitizeMeta(meta: unknown): AuditMeta | null {
  if (meta === null || typeof meta !== "object" || Array.isArray(meta)) return null;
  const out: AuditMeta = {};
  let count = 0;
  for (const [key, val] of Object.entries(meta as Record<string, unknown>)) {
    if (count >= MAX_KEYS) break;
    if (!key || key.length > MAX_KEY_LEN || isForbiddenKey(key)) continue;
    if (Array.isArray(val)) {
      if (val.length > MAX_ARRAY) continue;
      const items = val.map(cleanPrimitive);
      if (items.some((x) => x === undefined)) continue; // pole s objektom → celé zahodiť
      out[key] = items as MetaPrimitive[];
    } else {
      const p = cleanPrimitive(val);
      if (p === undefined) continue;
      out[key] = p;
    }
    count++;
  }
  if (count === 0) return null;
  return JSON.stringify(out).length <= MAX_JSON ? out : { orezane: true };
}

/**
 * Zapíše záznam do AuditLog. Pri chybe HÁDŽE — volajúci rozhoduje (napr. pri
 * PII_REVEAL sa bez úspešného auditu hodnota nesmie vrátiť).
 * `tx` = spojenie z withTransaction (zápis v tej istej transakcii).
 */
export async function writeAudit(entry: AuditEntry, tx?: AuditExecutor | PoolConnection): Promise<void> {
  if (!(AUDIT_ACTIONS as readonly string[]).includes(entry.action)) {
    throw new Error("Neplatná audit akcia.");
  }
  const entity = String(entry.entity ?? "").slice(0, 30);
  if (!entity) throw new Error("Chýba entita audit záznamu.");

  const meta = sanitizeMeta(entry.meta ?? null);
  const params: SqlParam[] = [
    entry.userId ?? null,
    entry.action,
    entity,
    entry.entityId ?? null,
    entry.ip ? String(entry.ip).slice(0, 45) : null,
    meta ? JSON.stringify(meta) : null,
  ];
  const sql =
    "INSERT INTO `AuditLog` (`userId`,`action`,`entity`,`entityId`,`ip`,`meta`) VALUES (?,?,?,?,?,?)";

  if (tx) {
    await (tx as AuditExecutor).execute(sql, params);
  } else {
    await execute(sql, params);
  }
}
