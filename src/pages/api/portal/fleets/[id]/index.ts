// Detail flotily — len MAJITEL. GET / PUT (vynechané pole = nemeniť) / DELETE.
import type { NextApiRequest, NextApiResponse } from "next";
import { execute, queryOne, querySafe } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { loadFleets } from "@/lib/fleets";
import { fleetSchema, fleetValues, MSG_DUP_ICO } from "@/lib/fleetInput";
import { isDupEntry } from "@/lib/subjectFields";

async function count(sql: string, id: number): Promise<number> {
  const rows = await querySafe<{ n: number }>(sql, [id]);
  return Number(rows[0]?.n ?? 0);
}

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Neplatné ID" });

    const exists = await queryOne<{ id: number }>("SELECT `id` FROM `Fleet` WHERE `id` = ?", [id]);
    if (!exists) return res.status(404).json({ message: "Flotila neexistuje" });

    if (req.method === "GET") {
      const [fleet] = await loadFleets(id);
      return res.status(200).json({ fleet });
    }

    if (req.method === "PUT") {
      const body = parseBody(req, res, fleetSchema);
      if (!body) return;
      const { values, invalid } = fleetValues(body);
      if (invalid.length) return res.status(400).json({ message: "Neplatné údaje", polia: invalid });

      if (typeof values.ico === "string") {
        const dup = await queryOne<{ id: number }>(
          "SELECT `id` FROM `Fleet` WHERE `ico` = ? AND `id` <> ? LIMIT 1",
          [values.ico, id]
        );
        if (dup) return res.status(409).json({ message: MSG_DUP_ICO });
      }

      const cols = Object.keys(values);
      if (cols.length) {
        try {
          await execute(
            `UPDATE \`Fleet\` SET ${cols.map((c) => `\`${c}\` = ?`).join(", ")} WHERE \`id\` = ?`,
            [...cols.map((c) => values[c]), id]
          );
        } catch (e) {
          if (isDupEntry(e)) return res.status(409).json({ message: MSG_DUP_ICO });
          throw e;
        }
      }
      const [fleet] = await loadFleets(id);
      return res.status(200).json({ fleet });
    }

    if (req.method === "DELETE") {
      // Tabuľky/stĺpce z neskorších migrácií (0010, 0011) nemusia existovať → querySafe.
      const vodici = await count("SELECT COUNT(*) AS n FROM `DriverProfile` WHERE `fleetId` = ?", id);
      const vozidla = await count("SELECT COUNT(*) AS n FROM `Vehicle` WHERE `vlastnikFleetId` = ?", id);
      const zmluvy = await count("SELECT COUNT(*) AS n FROM `Contract` WHERE `fleetId` = ?", id);
      if (vodici + vozidla + zmluvy > 0) {
        return res.status(409).json({
          message: `Flotila je použitá (${vodici} vodičov, ${vozidla} vozidiel, ${zmluvy} zmlúv). Radšej ju deaktivujte.`,
        });
      }
      await execute("DELETE FROM `Fleet` WHERE `id` = ?", [id]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
