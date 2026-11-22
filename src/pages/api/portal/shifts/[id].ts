import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, execute, toBool, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";

const updateSchema = z.object({
  typ: z.enum(["DENNA", "NOCNA", "VOLNO", "H24"]).optional(),
  vehicleId: z.coerce.number().int().nullable().optional(),
  poplatokZaSmenu: z.coerce.number().min(0).nullable().optional(),
  poplatokUhradeny: z.boolean().optional(),
  poznamka: z.string().nullable().optional(),
});

type ShiftJoinRow = {
  id: number; datum: string; typ: string; poznamka: string | null;
  poplatokZaSmenu: number | null; poplatokUhradeny: number; poplatokUhradenyDna: string | null;
  driverId: number; vehicleId: number | null;
  d_meno: string; d_priezvisko: string; d_volaciZnak: string | null;
  v_nazov: string | null; v_spz: string | null;
};

const SELECT_JOIN =
  "SELECT s.`id`, s.`datum`, s.`typ`, s.`poznamka`, s.`poplatokZaSmenu`, s.`poplatokUhradeny`, s.`poplatokUhradenyDna`, " +
  "s.`driverId`, s.`vehicleId`, d.`meno` AS d_meno, d.`priezvisko` AS d_priezvisko, d.`volaciZnak` AS d_volaciZnak, " +
  "v.`nazov` AS v_nazov, v.`spz` AS v_spz " +
  "FROM `Shift` s JOIN `User` d ON d.`id` = s.`driverId` LEFT JOIN `Vehicle` v ON v.`id` = s.`vehicleId` ";

function mapShift(s: ShiftJoinRow) {
  return {
    id: s.id, datum: s.datum, typ: s.typ, poznamka: s.poznamka,
    poplatokZaSmenu: s.poplatokZaSmenu === null ? null : Number(s.poplatokZaSmenu),
    poplatokUhradeny: toBool(s.poplatokUhradeny),
    poplatokUhradenyDna: s.poplatokUhradenyDna,
    driverId: s.driverId, vehicleId: s.vehicleId,
    driver: { id: s.driverId, meno: s.d_meno, priezvisko: s.d_priezvisko, volaciZnak: s.d_volaciZnak },
    vehicle: s.vehicleId ? { id: s.vehicleId, nazov: s.v_nazov, spz: s.v_spz } : null,
  };
}

export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Neplatné ID" });

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;

      const sets: string[] = [];
      const params: SqlParam[] = [];
      const add = (col: string, val: SqlParam) => { sets.push(`\`${col}\` = ?`); params.push(val); };
      if (body.typ !== undefined) add("typ", body.typ);
      if (body.vehicleId !== undefined) add("vehicleId", body.vehicleId);
      if (body.poplatokZaSmenu !== undefined) add("poplatokZaSmenu", body.poplatokZaSmenu);
      if (body.poznamka !== undefined) add("poznamka", body.poznamka);
      if (body.poplatokUhradeny !== undefined) {
        add("poplatokUhradeny", body.poplatokUhradeny ? 1 : 0);
        add("poplatokUhradenyDna", body.poplatokUhradeny ? new Date() : null);
      }
      if (sets.length) {
        sets.push("`updatedAt` = NOW(3)");
        params.push(id);
        await execute(`UPDATE \`Shift\` SET ${sets.join(", ")} WHERE \`id\` = ?`, params);
      }

      const rows = await query<ShiftJoinRow>(SELECT_JOIN + "WHERE s.`id` = ?", [id]);
      return res.status(200).json({ shift: rows.length ? mapShift(rows[0]) : null });
    }

    if (req.method === "DELETE") {
      await execute("DELETE FROM `Shift` WHERE `id` = ?", [id]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
