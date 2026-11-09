// Odkrytie plnej hodnoty RČ / čísla OP — len MAJITEL.
//
// Poradie je dôležité: najprv sa zapíše audit PII_REVEAL; ak zlyhá, hodnota sa
// NEvráti. Odpoveď sa nesmie cachovať. Limit 20 odkrytí za minútu na používateľa
// (in-memory, v rámci jedného procesu aplikácie).
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { queryOne, type DriverProfileRow } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { getClientIp, parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { decryptField } from "@/lib/crypto/fieldCrypto";
import { writeAudit } from "@/lib/audit";
import { logError } from "@/lib/safeLog";

const bodySchema = z.object({ field: z.enum(["rodneCislo", "cisloOp"]) });

const LIMIT = 20;
const WINDOW_MS = 60_000;
const globalForReveal = globalThis as unknown as { etaxiRevealHits?: Map<number, number[]> };
const hits = (globalForReveal.etaxiRevealHits ??= new Map<number, number[]>());

/** true = požiadavka je v limite (a započíta sa). */
function allowReveal(userId: number, now = Date.now()): boolean {
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(userId, recent);
    return false;
  }
  recent.push(now);
  hits.set(userId, recent);
  // Upratanie starých záznamov iných používateľov.
  if (hits.size > 100) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return true;
}

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Neplatné ID" });
    const body = parseBody(req, res, bodySchema);
    if (!body) return;

    if (!allowReveal(ctx.userId)) {
      return res.status(429).json({ message: "Príliš veľa odkrytí. Skúste to o chvíľu." });
    }

    const p = await queryOne<Pick<DriverProfileRow, "rodneCisloEnc" | "cisloOpEnc">>(
      `SELECT dp.\`rodneCisloEnc\`, dp.\`cisloOpEnc\` FROM \`DriverProfile\` dp
         JOIN \`UserRole\` r ON r.\`userId\` = dp.\`userId\` AND r.\`role\` = 'VODIC'
        WHERE dp.\`userId\` = ? LIMIT 1`,
      [id]
    );
    const enc = body.field === "rodneCislo" ? p?.rodneCisloEnc : p?.cisloOpEnc;
    if (!enc) return res.status(404).json({ message: "Údaj nie je vyplnený" });

    try {
      await writeAudit({
        userId: ctx.userId,
        action: "PII_REVEAL",
        entity: "DriverProfile",
        entityId: id,
        ip: getClientIp(req) ?? null,
        meta: { pole: body.field },
      });
    } catch (e) {
      logError("reveal: audit zlyhal", e);
      return res.status(500).json({ message: "Odkrytie sa nepodarilo zaznamenať" });
    }

    let value: string;
    try {
      value = decryptField(enc, `${body.field}:${id}`);
    } catch {
      return res.status(500).json({ message: "Údaj sa nepodarilo načítať" });
    }
    return res.status(200).json({ value });
  })
);
