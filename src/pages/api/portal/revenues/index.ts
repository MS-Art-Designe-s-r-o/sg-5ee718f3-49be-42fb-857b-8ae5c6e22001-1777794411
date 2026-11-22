import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, execute, toBool, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { vypocitajPoplatky } from "@/lib/fees";
import { getFeeTiers, getProvisionRate } from "@/lib/settings";

const upsertSchema = z.object({
  driverId: z.coerce.number().int(),
  isoRok: z.coerce.number().int(),
  isoTyzden: z.coerce.number().int().min(1).max(53),
  trzba: z.coerce.number().min(0),
});

type RevenueRow = {
  id: number; driverId: number; isoRok: number; isoTyzden: number;
  trzba: number; poplatokApp: number; provizia: number; celkovyPoplatok: number;
  uhradene: number; uhradeneDna: string | null;
  d_meno: string; d_priezvisko: string; d_volaciZnak: string | null;
};

const SELECT_JOIN =
  "SELECT r.*, d.`meno` AS d_meno, d.`priezvisko` AS d_priezvisko, d.`volaciZnak` AS d_volaciZnak " +
  "FROM `Revenue` r JOIN `User` d ON d.`id` = r.`driverId` ";

function mapRevenue(r: RevenueRow) {
  return {
    id: r.id, driverId: r.driverId, isoRok: r.isoRok, isoTyzden: r.isoTyzden,
    trzba: Number(r.trzba), poplatokApp: Number(r.poplatokApp),
    provizia: Number(r.provizia), celkovyPoplatok: Number(r.celkovyPoplatok),
    uhradene: toBool(r.uhradene), uhradeneDna: r.uhradeneDna,
    driver: { id: r.driverId, meno: r.d_meno, priezvisko: r.d_priezvisko, volaciZnak: r.d_volaciZnak },
  };
}

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method === "GET") {
      const where: string[] = [];
      const params: SqlParam[] = [];
      if (req.query.rok) { where.push("r.`isoRok` = ?"); params.push(Number(req.query.rok)); }
      if (req.query.tyzden) { where.push("r.`isoTyzden` = ?"); params.push(Number(req.query.tyzden)); }
      if (req.query.driverId) { where.push("r.`driverId` = ?"); params.push(Number(req.query.driverId)); }
      const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
      const rows = await query<RevenueRow>(
        SELECT_JOIN + whereSql + " ORDER BY r.`isoRok` DESC, r.`isoTyzden` DESC, r.`driverId` ASC",
        params
      );
      return res.status(200).json({ revenues: rows.map(mapRevenue) });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, upsertSchema);
      if (!body) return;

      const tiers = await getFeeTiers();
      const rate = await getProvisionRate();
      const f = vypocitajPoplatky(body.trzba, { tiers, provisionRate: rate });

      await execute(
        "INSERT INTO `Revenue` " +
          "(`driverId`,`isoRok`,`isoTyzden`,`trzba`,`poplatokApp`,`provizia`,`celkovyPoplatok`,`createdById`,`createdAt`,`updatedAt`) " +
          "VALUES (?,?,?,?,?,?,?,?,NOW(3),NOW(3)) " +
          "ON DUPLICATE KEY UPDATE `trzba` = VALUES(`trzba`), `poplatokApp` = VALUES(`poplatokApp`), " +
          "`provizia` = VALUES(`provizia`), `celkovyPoplatok` = VALUES(`celkovyPoplatok`), `updatedAt` = NOW(3)",
        [body.driverId, body.isoRok, body.isoTyzden, f.trzba, f.poplatokApp, f.provizia, f.celkovyPoplatok, ctx.userId]
      );

      const rows = await query<RevenueRow>(
        SELECT_JOIN + "WHERE r.`driverId` = ? AND r.`isoRok` = ? AND r.`isoTyzden` = ?",
        [body.driverId, body.isoRok, body.isoTyzden]
      );
      return res.status(200).json({ revenue: rows.length ? mapRevenue(rows[0]) : null });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
