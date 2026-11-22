import type { NextApiRequest, NextApiResponse } from "next";
import { query, toBool, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { periodRange, type Obdobie } from "@/lib/fees";

const ymd = (d: Date) => d.toISOString().slice(0, 10);

type Row = {
  id: number; datum: string; typ: string;
  poplatokZaSmenu: number | null; poplatokUhradeny: number; vehicleId: number | null;
  v_nazov: string | null; v_spz: string | null; v_casVymeny: string | null;
};

// Vodič vidí len svoje smeny.
export default withErrorHandler(
  withAuth(["VODIC", "DISPECER", "MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const where: string[] = ["s.`driverId` = ?"];
    const params: SqlParam[] = [ctx.userId];
    if (req.query.rok && (req.query.tyzden || req.query.mesiac)) {
      const obdobie = (["tyzden", "mesiac", "rok"].includes(String(req.query.obdobie))
        ? req.query.obdobie
        : "tyzden") as Obdobie;
      const range = periodRange(obdobie, {
        rok: Number(req.query.rok),
        tyzden: req.query.tyzden ? Number(req.query.tyzden) : undefined,
        mesiac: req.query.mesiac ? Number(req.query.mesiac) : undefined,
      });
      where.push("s.`datum` BETWEEN ? AND ?");
      params.push(ymd(range.from), ymd(range.to));
    }

    const rows = await query<Row>(
      "SELECT s.`id`, s.`datum`, s.`typ`, s.`poplatokZaSmenu`, s.`poplatokUhradeny`, s.`vehicleId`, " +
        "v.`nazov` AS v_nazov, v.`spz` AS v_spz, v.`casVymeny` AS v_casVymeny " +
        "FROM `Shift` s LEFT JOIN `Vehicle` v ON v.`id` = s.`vehicleId` " +
        "WHERE " + where.join(" AND ") + " ORDER BY s.`datum` ASC",
      params
    );

    const shifts = rows.map((s) => ({
      id: s.id,
      datum: s.datum,
      typ: s.typ,
      poplatokZaSmenu: s.poplatokZaSmenu === null ? null : Number(s.poplatokZaSmenu),
      poplatokUhradeny: toBool(s.poplatokUhradeny),
      vehicle: s.vehicleId ? { nazov: s.v_nazov, spz: s.v_spz, casVymeny: s.v_casVymeny } : null,
    }));
    return res.status(200).json({ shifts });
  })
);
