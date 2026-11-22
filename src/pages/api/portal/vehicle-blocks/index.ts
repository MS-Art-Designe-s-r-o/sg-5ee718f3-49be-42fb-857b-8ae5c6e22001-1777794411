// Časové blokovanie vozidiel (nedostupné / servis). Majiteľ + dispečer.
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, execute, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { isoWeekDateRange } from "@/lib/fees";

const ymd = (d: Date) => d.toISOString().slice(0, 10);

const createSchema = z.object({
  vehicleId: z.coerce.number().int(),
  typ: z.enum(["NEDOSTUPNE", "SERVIS"]),
  rozsah: z.enum(["CELY_DEN", "DENNA", "NOCNA"]).default("CELY_DEN"),
  datumOd: z.string().min(8),
  datumDo: z.string().min(8),
  poznamka: z.string().nullable().optional(),
});

type BlockRow = {
  id: number; vehicleId: number; typ: string; rozsah: string; datumOd: string; datumDo: string; poznamka: string | null;
  v_nazov: string | null; v_spz: string | null;
};

const SELECT_JOIN =
  "SELECT b.`id`, b.`vehicleId`, b.`typ`, b.`rozsah`, b.`datumOd`, b.`datumDo`, b.`poznamka`, " +
  "v.`nazov` AS v_nazov, v.`spz` AS v_spz " +
  "FROM `VehicleBlock` b JOIN `Vehicle` v ON v.`id` = b.`vehicleId` ";

function mapBlock(b: BlockRow) {
  return {
    id: b.id, vehicleId: b.vehicleId, typ: b.typ, rozsah: b.rozsah,
    datumOd: b.datumOd.slice(0, 10), datumDo: b.datumDo.slice(0, 10),
    poznamka: b.poznamka,
    vehicle: { id: b.vehicleId, nazov: b.v_nazov, spz: b.v_spz },
  };
}

export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method === "GET") {
      // Voliteľné obmedzenie na ISO týždeň — blok pretínajúci týždeň sa vráti.
      const where: string[] = [];
      const params: SqlParam[] = [];
      if (req.query.rok && req.query.tyzden) {
        const { from, to } = isoWeekDateRange(Number(req.query.rok), Number(req.query.tyzden));
        where.push("b.`datumOd` <= ? AND b.`datumDo` >= ?");
        params.push(ymd(to), ymd(from));
      }
      const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
      const rows = await query<BlockRow>(
        SELECT_JOIN + whereSql + " ORDER BY b.`datumOd` DESC",
        params
      );
      return res.status(200).json({ blocks: rows.map(mapBlock) });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;
      const od = body.datumOd.slice(0, 10);
      const doo = body.datumDo.slice(0, 10);
      if (doo < od) return res.status(400).json({ message: "Dátum do nesmie byť pred dátumom od." });

      const r = await execute(
        "INSERT INTO `VehicleBlock` (`vehicleId`,`typ`,`rozsah`,`datumOd`,`datumDo`,`poznamka`,`createdById`,`createdAt`,`updatedAt`) " +
          "VALUES (?,?,?,?,?,?,?,NOW(3),NOW(3))",
        [body.vehicleId, body.typ, body.rozsah, od, doo, body.poznamka?.trim() || null, ctx.userId]
      );
      const rows = await query<BlockRow>(SELECT_JOIN + "WHERE b.`id` = ?", [r.insertId]);
      return res.status(201).json({ block: rows.length ? mapBlock(rows[0]) : null });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
