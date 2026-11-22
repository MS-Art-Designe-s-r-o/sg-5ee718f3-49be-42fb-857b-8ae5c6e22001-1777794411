import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, execute, toBool } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";

const createSchema = z.object({
  nazov: z.string().min(1),
  aktivna: z.boolean().default(true),
});

type CatRow = { id: number; nazov: string; poradie: number; aktivna: number };

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      const rows = await query<CatRow>(
        "SELECT * FROM `ExpenseCategory` ORDER BY `poradie` ASC, `nazov` ASC"
      );
      return res.status(200).json({
        categories: rows.map((c) => ({ id: c.id, nazov: c.nazov, poradie: c.poradie, aktivna: toBool(c.aktivna) })),
      });
    }
    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;
      const existing = await query<{ id: number }>(
        "SELECT `id` FROM `ExpenseCategory` WHERE `nazov` = ?",
        [body.nazov.trim()]
      );
      if (existing.length) return res.status(409).json({ message: "Kategória s týmto názvom už existuje." });
      const max = await query<{ m: number | null }>("SELECT MAX(`poradie`) AS m FROM `ExpenseCategory`");
      const poradie = (max[0]?.m ?? -1) + 1;
      const r = await execute(
        "INSERT INTO `ExpenseCategory` (`nazov`,`poradie`,`aktivna`) VALUES (?,?,?)",
        [body.nazov.trim(), poradie, body.aktivna ? 1 : 0]
      );
      return res.status(201).json({ category: { id: r.insertId, nazov: body.nazov.trim(), poradie, aktivna: body.aktivna } });
    }
    return res.status(405).json({ message: "Method not allowed" });
  })
);
