// Stav jednotlivého výskytu pravidelného výdavku:
//  - PUT: úhrada per výskyt (uhradene) — nezasahuje ostatné mesiace,
//  - DELETE: zmazanie výskytu — buď iba tento (scope=one → vynechaný výskyt),
//    alebo aj všetky nasledujúce (scope=series → nastaví koniec predpisu).
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { queryOne, execute } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";

const putSchema = z.object({
  expenseId: z.coerce.number().int(),
  datum: z.string().min(8),
  uhradene: z.boolean(),
});
const delSchema = z.object({
  expenseId: z.coerce.number().int(),
  datum: z.string().min(8),
  scope: z.enum(["one", "series"]).default("one"),
});

/** Predchádzajúci deň (YYYY-MM-DD). */
function prevDay(ymd: string): string {
  const d = new Date(`${ymd.slice(0, 10)}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "PUT") {
      const body = parseBody(req, res, putSchema);
      if (!body) return;
      const datum = body.datum.slice(0, 10);
      await execute(
        "INSERT INTO `ExpenseOccurrence` (`expenseId`,`datum`,`uhradene`,`uhradeneDna`) VALUES (?,?,?,?) " +
          "ON DUPLICATE KEY UPDATE `uhradene` = VALUES(`uhradene`), `uhradeneDna` = VALUES(`uhradeneDna`)",
        [body.expenseId, datum, body.uhradene ? 1 : 0, body.uhradene ? new Date() : null]
      );
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const body = parseBody(req, res, delSchema);
      if (!body) return;
      const datum = body.datum.slice(0, 10);
      const exp = await queryOne<{ id: number; datum: string }>(
        "SELECT `id`, `datum` FROM `Expense` WHERE `id` = ?",
        [body.expenseId]
      );
      if (!exp) return res.status(404).json({ message: "Výdavok neexistuje." });

      if (body.scope === "series") {
        // Zmaž tento aj všetky nasledujúce výskyty — nastav koniec predpisu.
        const koniec = prevDay(datum);
        if (koniec < exp.datum.slice(0, 10)) {
          // Koniec je pred začiatkom → zmaž celý predpis.
          await execute("DELETE FROM `Expense` WHERE `id` = ?", [body.expenseId]);
        } else {
          await execute("UPDATE `Expense` SET `datumDo` = ?, `updatedAt` = NOW(3) WHERE `id` = ?", [koniec, body.expenseId]);
        }
        return res.status(200).json({ ok: true });
      }

      // Iba tento výskyt — označ ako vynechaný.
      await execute(
        "INSERT INTO `ExpenseOccurrence` (`expenseId`,`datum`,`vynechany`) VALUES (?,?,1) " +
          "ON DUPLICATE KEY UPDATE `vynechany` = 1",
        [body.expenseId, datum]
      );
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
