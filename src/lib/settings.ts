// Načítanie konfigurácie z DB (tarifné pásma, provízia, registračný poplatok)
// cez mysql2, s bezpečným fallbackom na predvolené hodnoty z fees.ts.
import { query, queryOne } from "@/lib/db";
import {
  DEFAULT_FEE_TIERS,
  DEFAULT_PROVISION_RATE,
  DEFAULT_REGISTRATION_FEE,
  type FeeTier,
} from "@/lib/fees";

export async function getFeeTiers(): Promise<FeeTier[]> {
  const rows = await query<{ trzbaOd: number; trzbaDo: number | null; poplatok: number }>(
    "SELECT `trzbaOd`, `trzbaDo`, `poplatok` FROM `FeeTier` ORDER BY `poradie` ASC"
  );
  if (!rows.length) return DEFAULT_FEE_TIERS;
  return rows.map((r) => ({
    trzbaOd: Number(r.trzbaOd),
    trzbaDo: r.trzbaDo === null ? null : Number(r.trzbaDo),
    poplatok: Number(r.poplatok),
  }));
}

export async function getSetting(key: string): Promise<string | null> {
  const row = await queryOne<{ value: string }>(
    "SELECT `value` FROM `AppSetting` WHERE `key` = ?",
    [key]
  );
  return row?.value ?? null;
}

export async function getProvisionRate(): Promise<number> {
  const v = await getSetting("provisionRate");
  const n = v === null ? NaN : Number(v);
  return Number.isFinite(n) ? n : DEFAULT_PROVISION_RATE;
}

export async function getRegistrationFee(): Promise<number> {
  const v = await getSetting("registrationFee");
  const n = v === null ? NaN : Number(v);
  return Number.isFinite(n) ? n : DEFAULT_REGISTRATION_FEE;
}
