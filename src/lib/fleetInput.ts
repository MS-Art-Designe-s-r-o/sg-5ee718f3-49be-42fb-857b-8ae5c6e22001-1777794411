// Vstupná schéma a normalizácia údajov flotily (spoločné pre POST aj PUT).
import { z } from "zod";
import type { SqlParam } from "./db";
import { normalizeKinds, optText, type FieldKind } from "./subjectFields";

export const fleetSchema = z.object({
  obchodneMeno: z.string().max(191).optional(),
  ico: optText(30),
  dic: optText(30),
  icDph: optText(30),
  sidlo: optText(255),
  zapisanyV: optText(255),
  statutar: optText(191),
  cisloKoncesie: optText(50),
  iban: optText(50),
  kontaktMeno: optText(191),
  kontaktTelefon: optText(50),
  kontaktEmail: optText(191),
  poznamka: optText(500),
  aktivna: z.boolean().optional(),
});

export const FLEET_KINDS: Record<string, FieldKind> = {
  ico: "ico",
  dic: "dic",
  icDph: "icDph",
  iban: "iban",
  kontaktEmail: "email",
};
export const FLEET_PLAIN = [
  "sidlo",
  "zapisanyV",
  "statutar",
  "cisloKoncesie",
  "kontaktMeno",
  "kontaktTelefon",
  "poznamka",
] as const;
export const MSG_DUP_ICO = "Flotila s týmto IČO už existuje";

/** Normalizované hodnoty stĺpcov z tela požiadavky + zoznam neplatných polí. */
export function fleetValues(body: z.infer<typeof fleetSchema>) {
  const { set, invalid } = normalizeKinds(body as Record<string, string | null | undefined>, FLEET_KINDS);
  for (const k of FLEET_PLAIN) if (body[k] !== undefined) set[k] = body[k] as string | null;
  if (body.obchodneMeno !== undefined) {
    const meno = body.obchodneMeno.trim();
    if (!meno) invalid.push("obchodneMeno");
    else set.obchodneMeno = meno;
  }
  const values: Record<string, SqlParam> = { ...set };
  if (body.aktivna !== undefined) values.aktivna = body.aktivna ? 1 : 0;
  return { values, invalid };
}

