// Zmluvy — len MAJITEL.
//
// GET  ?driverId= → { zmluvy: [...] } (bez snapshotu a ciest k súborom)
// POST → vygenerovanie zmluvy (DOCX, voliteľne PDF). Chýbajúce údaje → 422
//        { message, chybajuce, varovania }; bez aktívnej šablóny → 409.
//        Odpoveď 201 { id, cislo, verzia, stav, hasDocx, hasPdf, pdfVarovanie?, varovania }.
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth";
import { getClientIp, parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { poolExecutor } from "@/lib/contracts/executor";
import {
  contractInputSchema,
  defaultDeps,
  generateContract,
  listContracts,
  sendServiceError,
} from "@/lib/contracts/service";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    res.setHeader("Cache-Control", "no-store");

    if (req.method === "GET") {
      const driverId = Number(req.query.driverId);
      if (!Number.isInteger(driverId) || driverId <= 0) return res.status(400).json({ message: "Neplatné ID vodiča" });
      return res.status(200).json({ zmluvy: await listContracts(poolExecutor, driverId) });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, contractInputSchema);
      if (!body) return;
      try {
        const r = await generateContract(defaultDeps(), body, { userId: ctx.userId, ip: getClientIp(req) ?? null });
        return res.status(201).json(r);
      } catch (e) {
        if (sendServiceError(res, e)) return;
        throw e;
      }
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ message: "Method not allowed" });
  })
);
