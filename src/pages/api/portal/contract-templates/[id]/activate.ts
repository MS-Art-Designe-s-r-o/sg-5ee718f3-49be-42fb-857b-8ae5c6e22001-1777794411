// Aktivácia verzie šablóny — len MAJITEL.
// POST → v transakcii deaktivuje ostatné šablóny rovnakého typu a aktivuje túto
// (najprv deaktivácia — UNIQUE nad generovaným stĺpcom aktivnaTyp). Audit TEMPLATE_ACTIVATE.
import type { NextApiRequest, NextApiResponse } from "next";
import { withTransaction } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { getClientIp, withErrorHandler } from "@/lib/apiHelpers";
import { writeAudit } from "@/lib/audit";
import { isDupEntry } from "@/lib/subjectFields";
import { connExecutor } from "@/lib/contracts/executor";
import { activateTemplate } from "@/lib/contracts/templates";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ message: "Method not allowed" });
    }
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Neplatné ID" });

    let result: Awaited<ReturnType<typeof activateTemplate>>;
    try {
      result = await withTransaction(async (conn) => {
        const r = await activateTemplate(connExecutor(conn), id);
        if (r?.zmena) {
          await writeAudit(
            {
              userId: ctx.userId,
              action: "TEMPLATE_ACTIVATE",
              entity: "ContractTemplate",
              entityId: id,
              ip: getClientIp(req) ?? null,
              meta: { typ: r.typ, verzia: r.verzia },
            },
            conn
          );
        }
        return r;
      });
    } catch (e) {
      if (isDupEntry(e)) return res.status(409).json({ message: "Súbežná aktivácia šablóny, skúste znova" });
      throw e;
    }
    if (!result) return res.status(404).json({ message: "Šablóna neexistuje" });
    return res.status(200).json({ id, typ: result.typ, verzia: result.verzia, aktivna: true });
  })
);
