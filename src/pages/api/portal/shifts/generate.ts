// Hromadné vygenerovanie rozpisu smien pre vodiča podľa rotačného vzoru
// (kľúč z Google tabuľky). Denné/nočné smeny dostanú vozidlo a poplatok za smenu.
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { queryOne, execute } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { getPattern, patternCodeForDay, parsePatternDni, CODE_TO_TYP, type ShiftPattern } from "@/lib/shiftPatterns";

const schema = z.object({
  driverId: z.coerce.number().int(),
  patternKey: z.string().min(1),
  startDate: z.string().min(8), // YYYY-MM-DD (odporúčaný pondelok)
  weeks: z.coerce.number().int().min(1).max(26),
  vehicleId: z.coerce.number().int().nullable().optional(),
  overwrite: z.boolean().default(true),
});

function dateUTC(s: string): Date {
  return new Date(`${s.slice(0, 10)}T00:00:00.000Z`);
}
const ymd = (d: Date) => d.toISOString().slice(0, 10);

export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const body = parseBody(req, res, schema);
    if (!body) return;

    // Vzor: vstavaný (kľúč) alebo vlastný uložený (kľúč "c<id>").
    let pattern: ShiftPattern | undefined = getPattern(body.patternKey);
    if (!pattern && /^c\d+$/.test(body.patternKey)) {
      const row = await queryOne<{ nazov: string; dni: string }>(
        "SELECT `nazov`, `dni` FROM `ShiftPattern` WHERE `id` = ?",
        [Number(body.patternKey.slice(1))]
      );
      if (row) pattern = { key: body.patternKey, label: row.nazov, dni: parsePatternDni(row.dni) };
    }
    if (!pattern || pattern.dni.length === 0) return res.status(400).json({ message: "Neznámy vzor rozpisu." });

    let vehicleFee: number | null = null; // 12h / denná / nočná
    let vehicleFee24: number | null = null; // 24h
    if (body.vehicleId) {
      const v = await queryOne<{ poplatokZaSmenu: number; poplatokZa24h: number }>(
        "SELECT `poplatokZaSmenu`, `poplatokZa24h` FROM `Vehicle` WHERE `id` = ?",
        [body.vehicleId]
      );
      if (!v) return res.status(400).json({ message: "Vozidlo neexistuje." });
      vehicleFee = Number(v.poplatokZaSmenu);
      vehicleFee24 = Number(v.poplatokZa24h);
    }

    const start = dateUTC(body.startDate);
    const totalDays = body.weeks * 7;
    let vytvorene = 0;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      const datum = ymd(d);
      const typ = CODE_TO_TYP[patternCodeForDay(pattern, i)];
      const jeVolno = typ === "VOLNO";
      const vehicleId = jeVolno ? null : body.vehicleId ?? null;
      const poplatok = jeVolno ? null : typ === "H24" ? vehicleFee24 : vehicleFee;

      if (body.overwrite) {
        await execute(
          "INSERT INTO `Shift` (`driverId`,`datum`,`typ`,`vehicleId`,`poplatokZaSmenu`,`createdById`,`createdAt`,`updatedAt`) " +
            "VALUES (?,?,?,?,?,?,NOW(3),NOW(3)) " +
            "ON DUPLICATE KEY UPDATE `typ` = VALUES(`typ`), `vehicleId` = VALUES(`vehicleId`), " +
            "`poplatokZaSmenu` = VALUES(`poplatokZaSmenu`), `updatedAt` = NOW(3)",
          [body.driverId, datum, typ, vehicleId, poplatok, ctx.userId]
        );
      } else {
        const exists = await queryOne<{ id: number }>(
          "SELECT `id` FROM `Shift` WHERE `driverId` = ? AND `datum` = ?",
          [body.driverId, datum]
        );
        if (exists) continue;
        await execute(
          "INSERT INTO `Shift` (`driverId`,`datum`,`typ`,`vehicleId`,`poplatokZaSmenu`,`createdById`,`createdAt`,`updatedAt`) " +
            "VALUES (?,?,?,?,?,?,NOW(3),NOW(3))",
          [body.driverId, datum, typ, vehicleId, poplatok, ctx.userId]
        );
      }
      vytvorene++;
    }

    return res.status(200).json({ ok: true, pocet: vytvorene });
  })
);
