// Regenerácia zmluvy — len MAJITEL.
// POST [{ formaty }] → nový riadok s rovnakým číslom, verzia+1, aktuálne údaje
// a aktuálna aktívna šablóna; pôvodná zmluva → NAHRADENA (jej súbory ostávajú).
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withAuth } from "@/lib/auth";
import { getClientIp, parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { defaultDeps, regenerateContract, sendServiceError } from "@/lib/contracts/service";

const bodySchema = z
  .object({ formaty: z.array(z.enum(["docx", "pdf"])).max(2).optional() })
  .optional()
  .transform((v) => v ?? {});

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ message: "Method not allowed" });
    }
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Neplatné ID" });
    const body = parseBody(req, res, bodySchema);
    if (!body) return;
    try {
      const r = await regenerateContract(defaultDeps(), id, { userId: ctx.userId, ip: getClientIp(req) ?? null }, body);
      return res.status(201).json(r);
    } catch (e) {
      if (sendServiceError(res, e)) return;
      throw e;
    }
  })
);
