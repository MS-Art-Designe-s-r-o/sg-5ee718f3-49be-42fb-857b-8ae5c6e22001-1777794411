// Stiahnutie súboru šablóny — len MAJITEL. Audit TEMPLATE_DOWNLOAD (pred odoslaním).
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth";
import { getClientIp, withErrorHandler } from "@/lib/apiHelpers";
import { writeAudit } from "@/lib/audit";
import { poolExecutor } from "@/lib/contracts/executor";
import { getTemplate } from "@/lib/contracts/templates";
import { MIME_DOCX, sendStoredFile } from "@/lib/contracts/download";
import { safeSegment, statStored } from "@/lib/contracts/storage";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ message: "Method not allowed" });
    }
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Neplatné ID" });

    const t = await getTemplate(poolExecutor, id);
    if (!t) return res.status(404).json({ message: "Šablóna neexistuje" });
    if (!(await statStored(t.suborPath))) return res.status(404).json({ message: "Súbor šablóny sa nenašiel" });

    await writeAudit({
      userId: ctx.userId,
      action: "TEMPLATE_DOWNLOAD",
      entity: "ContractTemplate",
      entityId: id,
      ip: getClientIp(req) ?? null,
      meta: { typ: t.typ, verzia: t.verzia },
    });

    const fileName = `${safeSegment(t.nazov).replace(/\s+/g, "-")}_${t.typ}_v${t.verzia}.docx`;
    await sendStoredFile(res, t.suborPath, fileName, MIME_DOCX);
  })
);
