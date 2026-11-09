// Flotily (externí prevádzkovatelia vozidiel) — len MAJITEL.
// GET → { fleets: [...] } s aktuálnou zmluvou a počtom vodičov, POST → vytvorenie.
import type { NextApiRequest, NextApiResponse } from "next";
import { execute, queryOne } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { loadFleets } from "@/lib/fleets";
import { fleetSchema, fleetValues, MSG_DUP_ICO } from "@/lib/fleetInput";
import { isDupEntry } from "@/lib/subjectFields";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");

    if (req.method === "GET") {
      return res.status(200).json({ fleets: await loadFleets() });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, fleetSchema);
      if (!body) return;
      const { values, invalid } = fleetValues(body);
      if (values.obchodneMeno === undefined && !invalid.includes("obchodneMeno")) invalid.push("obchodneMeno");
      if (invalid.length) return res.status(400).json({ message: "Neplatné údaje", polia: invalid });

      if (typeof values.ico === "string") {
        const dup = await queryOne<{ id: number }>("SELECT `id` FROM `Fleet` WHERE `ico` = ? LIMIT 1", [values.ico]);
        if (dup) return res.status(409).json({ message: MSG_DUP_ICO });
      }

      const cols = Object.keys(values);
      let insertId: number;
      try {
        const r = await execute(
          `INSERT INTO \`Fleet\` (${cols.map((c) => `\`${c}\``).join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`,
          cols.map((c) => values[c])
        );
        insertId = r.insertId;
      } catch (e) {
        if (isDupEntry(e)) return res.status(409).json({ message: MSG_DUP_ICO });
        throw e;
      }
      const [fleet] = await loadFleets(insertId);
      return res.status(201).json({ fleet });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
