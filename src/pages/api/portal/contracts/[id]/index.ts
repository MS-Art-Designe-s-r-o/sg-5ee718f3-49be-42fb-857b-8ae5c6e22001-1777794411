// Zmena stavu zmluvy — len MAJITEL.
// PATCH { stav } → povolené: NAVRH→VYGENEROVANA, VYGENEROVANA→PODPISANA,
// PODPISANA→UKONCENA, VYGENEROVANA→UKONCENA; ostatné 409. Audit CONTRACT_STATUS {z, na}.
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withAuth } from "@/lib/auth";
import { getClientIp, parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { changeStatus, defaultDeps } from "@/lib/contracts/service";

const bodySchema = z.object({ stav: z.enum(["VYGENEROVANA", "PODPISANA", "UKONCENA"]) });

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "PATCH") {
      res.setHeader("Allow", "PATCH");
      return res.status(405).json({ message: "Method not allowed" });
    }
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Neplatné ID" });
    const body = parseBody(req, res, bodySchema);
    if (!body) return;
    const r = await changeStatus(defaultDeps(), id, body.stav, { userId: ctx.userId, ip: getClientIp(req) ?? null });
    return res.status(200).json(r);
  })
);
