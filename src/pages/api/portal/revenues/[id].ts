import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, execute, toBool, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { vypocitajPoplatky } from "@/lib/fees";
import { getFeeTiers, getProvisionRate } from "@/lib/settings";

const updateSchema = z.object({
  trzba: z.coerce.number().min(0).optional(),
  uhradene: z.boolean().optional(),
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
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Neplatné ID" });

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;

      const sets: string[] = [];
      const params: SqlParam[] = [];
      const add = (col: string, val: SqlParam) => { sets.push(`\`${col}\` = ?`); params.push(val); };

      if (body.trzba !== undefined) {
        const tiers = await getFeeTiers();
        const rate = await getProvisionRate();
        const f = vypocitajPoplatky(body.trzba, { tiers, provisionRate: rate });
        add("trzba", f.trzba);
        add("poplatokApp", f.poplatokApp);
        add("provizia", f.provizia);
        add("celkovyPoplatok", f.celkovyPoplatok);
      }
      if (body.uhradene !== undefined) {
        add("uhradene", body.uhradene ? 1 : 0);
        add("uhradeneDna", body.uhradene ? new Date() : null);
      }
      if (sets.length) {
        sets.push("`updatedAt` = NOW(3)");
        params.push(id);
        await execute(`UPDATE \`Revenue\` SET ${sets.join(", ")} WHERE \`id\` = ?`, params);
      }

      const rows = await query<RevenueRow>(SELECT_JOIN + "WHERE r.`id` = ?", [id]);
      return res.status(200).json({ revenue: rows.length ? mapRevenue(rows[0]) : null });
    }

    if (req.method === "DELETE") {
      await execute("DELETE FROM `Revenue` WHERE `id` = ?", [id]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
