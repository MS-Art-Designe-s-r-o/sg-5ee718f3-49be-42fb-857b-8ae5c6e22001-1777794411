// Šablóny zmlúv — len MAJITEL.
//
// GET  → { sablony: [...] } — verzie šablón (typ, názov, verzia, platnaOd,
//        aktivna, počet použitých zmlúv), bez cesty k súboru.
// POST → nahratie novej verzie: JSON { typ, nazov, platnaOd, fileBase64 }.
//        Max 5 MB po dekódovaní, kontrola DOCX a kompilácia docxtemplater.
//        Chyby šablóny → 400 { message, chyby }, neznáme značky len ako `varovania`.
//        Nová verzia je NEaktívna (aktivuje sa samostatne). Audit TEMPLATE_UPLOAD.
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withTransaction } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { getClientIp, parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { writeAudit } from "@/lib/audit";
import { isDupEntry, isRealDate } from "@/lib/subjectFields";
import { connExecutor, poolExecutor } from "@/lib/contracts/executor";
import { removeStored } from "@/lib/contracts/storage";
import { TemplateError } from "@/lib/contracts/render";
import {
  createTemplate,
  decodeBase64Upload,
  listTemplates,
  MAX_TEMPLATE_BYTES,
  validateTemplateUpload,
} from "@/lib/contracts/templates";

// Limit tela (base64 5 MB ≈ 6,7 MB textu) — musí byť literál kvôli Next.js.
export const config = { api: { bodyParser: { sizeLimit: "8mb" } } };

const uploadSchema = z.object({
  typ: z.enum(["NAJOM", "DISPECING"]),
  nazov: z.string().trim().min(1).max(191),
  platnaOd: z.string().refine(isRealDate, { message: "Neplatný dátum" }),
  // base64 dĺžka ≈ 4/3 veľkosti súboru (+ prípadný data: prefix)
  fileBase64: z.string().min(1).max(Math.ceil((MAX_TEMPLATE_BYTES * 4) / 3) + 200),
});

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    res.setHeader("Cache-Control", "no-store");

    if (req.method === "GET") {
      return res.status(200).json({ sablony: await listTemplates(poolExecutor) });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, uploadSchema);
      if (!body) return;

      let check;
      let buffer: Buffer;
      try {
        buffer = decodeBase64Upload(body.fileBase64);
        check = validateTemplateUpload(buffer);
      } catch (e) {
        if (e instanceof TemplateError) return res.status(400).json({ message: e.message, chyby: e.chyby });
        throw e;
      }

      let created: { id: number; verzia: number };
      let written: string | null = null;
      try {
        created = await withTransaction(async (conn) => {
          const tx = connExecutor(conn);
          const r = await createTemplate(tx, {
            typ: body.typ,
            nazov: body.nazov,
            platnaOd: body.platnaOd,
            buffer,
            check,
            userId: ctx.userId,
          });
          written = r.suborPath;
          await writeAudit(
            {
              userId: ctx.userId,
              action: "TEMPLATE_UPLOAD",
              entity: "ContractTemplate",
              entityId: r.id,
              ip: getClientIp(req) ?? null,
              meta: { typ: body.typ, verzia: r.verzia, sha8: check.sha256.slice(0, 8), neznameZnacky: check.varovania.length },
            },
            conn
          );
          return r;
        });
      } catch (e) {
        // Transakcia sa vrátila — zapísaný súbor nesmie ostať bez záznamu.
        if (written) await removeStored(written).catch(() => undefined);
        // Súbeh dvoch nahratí rovnakého typu (UNIQUE typ+verzia).
        if (isDupEntry(e)) return res.status(409).json({ message: "Súbežné nahrávanie šablóny, skúste znova" });
        throw e;
      }

      return res.status(201).json({
        id: created.id,
        typ: body.typ,
        verzia: created.verzia,
        aktivna: false,
        tagy: check.tagy,
        varovania: check.varovania,
      });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ message: "Method not allowed" });
  })
);
