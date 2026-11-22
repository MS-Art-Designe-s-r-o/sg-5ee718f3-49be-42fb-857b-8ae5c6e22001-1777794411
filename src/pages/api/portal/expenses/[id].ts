import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, execute, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { mapExpense } from "./index";

const interval = z.enum(["TYZDENNE", "MESACNE", "STVRTROCNE", "POLROCNE", "ROCNE"]);

const updateSchema = z.object({
  datum: z.string().min(8).optional(),
  popis: z.string().min(1).optional(),
  categoryId: z.coerce.number().int().optional(),
  suma: z.coerce.number().min(0).optional(),
  uhradene: z.boolean().optional(),
  pravidelny: z.boolean().optional(),
  interval: interval.nullable().optional(),
});

const SELECT_JOIN =
  "SELECT e.*, c.`nazov` AS c_nazov, v.`nazov` AS v_nazov " +
  "FROM `Expense` e JOIN `ExpenseCategory` c ON c.`id` = e.`categoryId` " +
  "LEFT JOIN `Vehicle` v ON v.`id` = e.`vehicleId` ";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Neplatné ID" });

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;
      const sets: string[] = [];
      const params: SqlParam[] = [];
      const add = (c: string, v: SqlParam) => { sets.push(`\`${c}\` = ?`); params.push(v); };
      if (body.datum !== undefined) add("datum", body.datum.slice(0, 10));
      if (body.popis !== undefined) add("popis", body.popis.trim());
      if (body.categoryId !== undefined) add("categoryId", body.categoryId);
      if (body.suma !== undefined) add("suma", body.suma);
      if (body.pravidelny !== undefined) {
        add("pravidelny", body.pravidelny ? 1 : 0);
        add("interval", body.pravidelny ? body.interval ?? "MESACNE" : null);
      } else if (body.interval !== undefined) {
        add("interval", body.interval);
      }
      if (body.uhradene !== undefined) {
        add("uhradene", body.uhradene ? 1 : 0);
        add("uhradeneDna", body.uhradene ? new Date() : null);
      }
      if (sets.length) {
        sets.push("`updatedAt` = NOW(3)");
        params.push(id);
        await execute(`UPDATE \`Expense\` SET ${sets.join(", ")} WHERE \`id\` = ?`, params);
      }
      const rows = await query(SELECT_JOIN + "WHERE e.`id` = ?", [id]);
      return res.status(200).json({ expense: rows.length ? mapExpense(rows[0] as never) : null });
    }

    if (req.method === "DELETE") {
      await execute("DELETE FROM `Expense` WHERE `id` = ?", [id]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
