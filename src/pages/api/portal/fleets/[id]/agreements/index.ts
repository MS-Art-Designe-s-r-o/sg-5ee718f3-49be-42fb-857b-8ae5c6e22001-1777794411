// Evidencia zmlúv medzi E-TAXI a flotilou (len evidencia, nič sa negeneruje) — len MAJITEL.
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { execute, query, queryOne } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { isRealDate, optText } from "@/lib/subjectFields";

const reqDate = z.string().trim().refine(isRealDate, { message: "Neplatný dátum" });
const optDate = z
  .string()
  .nullable()
  .optional()
  .transform((v) => (v === undefined || v === null || v.trim() === "" ? null : v.trim()))
  .refine((v) => v === null || isRealDate(v), { message: "Neplatný dátum" });

const createSchema = z.object({
  cislo: z.string().trim().min(1).max(60),
  datumUzavretia: reqDate,
  platnostOd: reqDate,
  platnostDo: optDate,
  poznamka: optText(500),
});

type AgreementRow = {
  id: number;
  fleetId: number;
  cislo: string;
  datumUzavretia: string;
  platnostOd: string;
  platnostDo: string | null;
  poznamka: string | null;
};

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    const fleetId = Number(req.query.id);
    if (!Number.isInteger(fleetId) || fleetId <= 0) return res.status(400).json({ message: "Neplatné ID" });

    const fleet = await queryOne<{ id: number }>("SELECT `id` FROM `Fleet` WHERE `id` = ?", [fleetId]);
    if (!fleet) return res.status(404).json({ message: "Flotila neexistuje" });

    if (req.method === "GET") {
      const agreements = await query<AgreementRow>(
        "SELECT * FROM `FleetAgreement` WHERE `fleetId` = ? ORDER BY `platnostOd` DESC, `id` DESC",
        [fleetId]
      );
      return res.status(200).json({ agreements });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;
      if (body.platnostDo !== null && body.platnostDo < body.platnostOd) {
        return res
          .status(400)
          .json({ message: "Platnosť do nemôže byť skôr ako platnosť od", polia: ["platnostDo"] });
      }
      const r = await execute(
        "INSERT INTO `FleetAgreement` (`fleetId`,`cislo`,`datumUzavretia`,`platnostOd`,`platnostDo`,`poznamka`) VALUES (?,?,?,?,?,?)",
        [fleetId, body.cislo, body.datumUzavretia, body.platnostOd, body.platnostDo, body.poznamka ?? null]
      );
      const agreement = await queryOne<AgreementRow>("SELECT * FROM `FleetAgreement` WHERE `id` = ?", [r.insertId]);
      return res.status(201).json({ agreement });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
