// Zmluvné údaje vozidla (migrácia 0010): zod schémy, normalizácia a mapovanie.
// Spoločné pre POST /api/portal/vehicles a PUT /api/portal/vehicles/[id].
import { z } from "zod";
import type { SqlParam } from "@/lib/db";

/** Prázdny reťazec → null (ostatné hodnoty bez zmeny). */
const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

const trimmed = (v: unknown) => (typeof v === "string" ? v.trim() : v);

/** Voliteľný text: trim, prázdny → null, obmedzená dĺžka. */
const text = (max: number) =>
  z.preprocess((v) => emptyToNull(trimmed(v)), z.string().max(max).nullable()).optional();

/** Dátum 'YYYY-MM-DD' (reálny kalendárny deň) alebo null. */
const datum = z
  .preprocess(
    emptyToNull,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Neplatný dátum")
      .refine((s) => {
        const d = new Date(`${s}T00:00:00Z`);
        return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
      }, "Neplatný dátum")
      .nullable()
  )
  .optional();

/** Nezáporné desatinné číslo alebo null (prázdny reťazec → null). */
const peniaze = z
  .preprocess(emptyToNull, z.coerce.number().min(0).nullable())
  .optional();

/** VIN: trim + veľké písmená, 17 znakov bez I, O, Q (alebo prázdne → null). */
const vin = z
  .preprocess(
    (v) => emptyToNull(typeof v === "string" ? v.trim().toUpperCase() : v),
    z
      .string()
      .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "VIN musí mať 17 znakov (bez I, O, Q)")
      .nullable()
  )
  .optional();

export const vehicleContractFields = {
  vin,
  rokVyroby: z
    .preprocess(emptyToNull, z.coerce.number().int().min(1950).max(2100).nullable())
    .optional(),
  cisloTp: text(30),
  datumPrvejEvidencie: datum,
  vlastnikTyp: z.enum(["ETAXI", "FLOTILA"]).optional(),
  vlastnikFleetId: z
    .preprocess(emptyToNull, z.coerce.number().int().positive().nullable())
    .optional(),
  poistovna: text(191),
  pzpCislo: text(50),
  pzpPlatnostDo: datum,
  havCislo: text(50),
  havPlatnostDo: datum,
  stkPlatnostDo: datum,
  ekPlatnostDo: datum,
  stavKm: z.preprocess(emptyToNull, z.coerce.number().int().min(0).nullable()).optional(),
  kaucia: peniaze,
  spoluucast: peniaze,
};

/** Stĺpce zmluvných údajov v poradí, v akom ich zapisujeme do SQL. */
export const VEHICLE_CONTRACT_COLUMNS = [
  "vin",
  "rokVyroby",
  "cisloTp",
  "datumPrvejEvidencie",
  "vlastnikTyp",
  "vlastnikFleetId",
  "poistovna",
  "pzpCislo",
  "pzpPlatnostDo",
  "havCislo",
  "havPlatnostDo",
  "stkPlatnostDo",
  "ekPlatnostDo",
  "stavKm",
  "kaucia",
  "spoluucast",
] as const;

type ContractColumn = (typeof VEHICLE_CONTRACT_COLUMNS)[number];

/** Len tie zmluvné polia, ktoré boli v tele skutočne poslané (undefined = nemeniť). */
export function pickContractValues(
  body: Partial<Record<ContractColumn, unknown>>
): { col: ContractColumn; val: SqlParam }[] {
  const out: { col: ContractColumn; val: SqlParam }[] = [];
  for (const col of VEHICLE_CONTRACT_COLUMNS) {
    const val = body[col];
    if (val !== undefined) out.push({ col, val: val as SqlParam });
  }
  return out;
}

/** Zmluvné stĺpce riadku Vehicle (pred migráciou 0010 chýbajú → null/ETAXI). */
export type VehicleContractRow = {
  vin?: string | null;
  rokVyroby?: number | null;
  cisloTp?: string | null;
  datumPrvejEvidencie?: string | null;
  vlastnikTyp?: "ETAXI" | "FLOTILA" | null;
  vlastnikFleetId?: number | null;
  poistovna?: string | null;
  pzpCislo?: string | null;
  pzpPlatnostDo?: string | null;
  havCislo?: string | null;
  havPlatnostDo?: string | null;
  stkPlatnostDo?: string | null;
  ekPlatnostDo?: string | null;
  stavKm?: number | null;
  kaucia?: number | string | null;
  spoluucast?: number | string | null;
};

const dateOrNull = (v: string | null | undefined) => (v ? String(v).slice(0, 10) : null);
const numOrNull = (v: number | string | null | undefined) =>
  v === null || v === undefined ? null : Number(v);

/** Zmluvné polia pre odpoveď API (dátumy 'YYYY-MM-DD' alebo null). */
export function mapVehicleContract(v: VehicleContractRow) {
  return {
    vin: v.vin ?? null,
    rokVyroby: v.rokVyroby ?? null,
    cisloTp: v.cisloTp ?? null,
    datumPrvejEvidencie: dateOrNull(v.datumPrvejEvidencie),
    vlastnikTyp: (v.vlastnikTyp ?? "ETAXI") as "ETAXI" | "FLOTILA",
    vlastnikFleetId: v.vlastnikFleetId ?? null,
    poistovna: v.poistovna ?? null,
    pzpCislo: v.pzpCislo ?? null,
    pzpPlatnostDo: dateOrNull(v.pzpPlatnostDo),
    havCislo: v.havCislo ?? null,
    havPlatnostDo: dateOrNull(v.havPlatnostDo),
    stkPlatnostDo: dateOrNull(v.stkPlatnostDo),
    ekPlatnostDo: dateOrNull(v.ekPlatnostDo),
    stavKm: v.stavKm ?? null,
    kaucia: numOrNull(v.kaucia),
    spoluucast: numOrNull(v.spoluucast),
  };
}
