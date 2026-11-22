// Uložené vlastné rotačné vzory smien. Majiteľ + dispečer.
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, execute } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { parsePatternDni } from "@/lib/shiftPatterns";

const createSchema = z.object({
  nazov: z.string().min(1),
  dni: z.string().min(1), // reťazec kódov D/N/V/H
});

type Row = { id: number; nazov: string; dni: string };

export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method === "GET") {
      const rows = await query<Row>("SELECT `id`, `nazov`, `dni` FROM `ShiftPattern` ORDER BY `nazov` ASC");
      return res.status(200).json({ patterns: rows });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;
      const codes = parsePatternDni(body.dni);
      if (codes.length === 0) return res.status(400).json({ message: "Vzor musí obsahovať aspoň jeden deň (D/N/V/24)." });
      if (codes.length > 56) return res.status(400).json({ message: "Vzor je príliš dlhý (max 56 dní)." });
      const r = await execute(
        "INSERT INTO `ShiftPattern` (`nazov`,`dni`,`createdById`,`createdAt`,`updatedAt`) VALUES (?,?,?,NOW(3),NOW(3))",
        [body.nazov.trim(), codes.join(""), ctx.userId]
      );
      const rows = await query<Row>("SELECT `id`, `nazov`, `dni` FROM `ShiftPattern` WHERE `id` = ?", [r.insertId]);
      return res.status(201).json({ pattern: rows[0] ?? null });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
