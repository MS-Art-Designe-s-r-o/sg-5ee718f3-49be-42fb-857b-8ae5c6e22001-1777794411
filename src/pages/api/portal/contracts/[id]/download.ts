// Stiahnutie zmluvy — len MAJITEL. GET ?format=docx|pdf (default docx).
// Audit CONTRACT_DOWNLOAD { format } sa zapíše PRED odoslaním súboru; ak zlyhá,
// súbor sa nepošle. Odpoveď: attachment, no-store, nosniff.
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth";
import { getClientIp, withErrorHandler } from "@/lib/apiHelpers";
import { writeAudit } from "@/lib/audit";
import { poolExecutor } from "@/lib/contracts/executor";
import { getContractFile } from "@/lib/contracts/service";
import { MIME_DOCX, MIME_PDF, sendStoredFile } from "@/lib/contracts/download";
import { statStored } from "@/lib/contracts/storage";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ message: "Method not allowed" });
    }
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Neplatné ID" });
    const fmt = req.query.format === undefined ? "docx" : req.query.format;
    if (fmt !== "docx" && fmt !== "pdf") return res.status(400).json({ message: "Neplatný formát" });

    const f = await getContractFile(poolExecutor, id, fmt);
    if (!f) return res.status(404).json({ message: "Súbor zmluvy neexistuje" });
    if (!(await statStored(f.relPath))) return res.status(404).json({ message: "Súbor zmluvy sa nenašiel" });

    await writeAudit({
      userId: ctx.userId,
      action: "CONTRACT_DOWNLOAD",
      entity: "Contract",
      entityId: id,
      ip: getClientIp(req) ?? null,
      meta: { format: fmt },
    });

    await sendStoredFile(res, f.relPath, f.fileName, fmt === "pdf" ? MIME_PDF : MIME_DOCX);
  })
);
