import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, queryOne, execute, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";

const updateSchema = z.object({
  nazov: z.string().min(1).optional(),
  aktivna: z.boolean().optional(),
  poradie: z.coerce.number().int().optional(),
});

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
      if (body.nazov !== undefined) add("nazov", body.nazov.trim());
      if (body.aktivna !== undefined) add("aktivna", body.aktivna ? 1 : 0);
      if (body.poradie !== undefined) add("poradie", body.poradie);
      if (sets.length) {
        params.push(id);
        await execute(`UPDATE \`ExpenseCategory\` SET ${sets.join(", ")} WHERE \`id\` = ?`, params);
      }
      const c = await queryOne("SELECT * FROM `ExpenseCategory` WHERE `id` = ?", [id]);
      return res.status(200).json({ category: c });
    }

    if (req.method === "DELETE") {
      // Zabráň zmazaniu kategórie, ktorá sa používa.
      const used = await query<{ cnt: number }>(
        "SELECT COUNT(*) AS cnt FROM `Expense` WHERE `categoryId` = ?",
        [id]
      );
      if (Number(used[0]?.cnt) > 0) {
        return res.status(400).json({
          message: "Kategóriu nemožno zmazať — je použitá vo výdavkoch. Radšej ju deaktivujte.",
        });
      }
      await execute("DELETE FROM `ExpenseCategory` WHERE `id` = ?", [id]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
