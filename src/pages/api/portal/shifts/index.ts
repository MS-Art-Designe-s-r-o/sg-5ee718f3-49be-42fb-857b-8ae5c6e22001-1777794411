import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, queryOne, execute, toBool } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { isoWeekDateRange } from "@/lib/fees";
import { blockCoversSlot } from "@/lib/vehicleBlocks";

const upsertSchema = z.object({
  driverId: z.coerce.number().int(),
  datum: z.string().min(8), // YYYY-MM-DD
  typ: z.enum(["DENNA", "NOCNA", "VOLNO", "H24"]),
  vehicleId: z.coerce.number().int().nullable().optional(),
  poplatokZaSmenu: z.coerce.number().min(0).nullable().optional(),
  poznamka: z.string().nullable().optional(),
});

const ymd = (d: Date) => d.toISOString().slice(0, 10);

type ShiftJoinRow = {
  id: number; datum: string; typ: string; poznamka: string | null;
  poplatokZaSmenu: number | null; poplatokUhradeny: number; poplatokUhradenyDna: string | null;
  driverId: number; vehicleId: number | null;
  d_meno: string; d_priezvisko: string; d_volaciZnak: string | null;
  v_nazov: string | null; v_spz: string | null; v_poplatok: number | null;
};

const SELECT_JOIN =
  "SELECT s.`id`, s.`datum`, s.`typ`, s.`poznamka`, s.`poplatokZaSmenu`, s.`poplatokUhradeny`, s.`poplatokUhradenyDna`, " +
  "s.`driverId`, s.`vehicleId`, d.`meno` AS d_meno, d.`priezvisko` AS d_priezvisko, d.`volaciZnak` AS d_volaciZnak, " +
  "v.`nazov` AS v_nazov, v.`spz` AS v_spz, v.`poplatokZaSmenu` AS v_poplatok " +
  "FROM `Shift` s JOIN `User` d ON d.`id` = s.`driverId` LEFT JOIN `Vehicle` v ON v.`id` = s.`vehicleId` ";

function mapShift(s: ShiftJoinRow) {
  return {
    id: s.id,
    datum: s.datum,
    typ: s.typ,
    poznamka: s.poznamka,
    poplatokZaSmenu: s.poplatokZaSmenu === null ? null : Number(s.poplatokZaSmenu),
    poplatokUhradeny: toBool(s.poplatokUhradeny),
    poplatokUhradenyDna: s.poplatokUhradenyDna,
    driverId: s.driverId,
    vehicleId: s.vehicleId,
    driver: { id: s.driverId, meno: s.d_meno, priezvisko: s.d_priezvisko, volaciZnak: s.d_volaciZnak },
    vehicle: s.vehicleId
      ? { id: s.vehicleId, nazov: s.v_nazov, spz: s.v_spz, poplatokZaSmenu: s.v_poplatok === null ? null : Number(s.v_poplatok) }
      : null,
  };
}

export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method === "GET") {
      const rok = Number(req.query.rok);
      const tyzden = Number(req.query.tyzden);
      if (!Number.isInteger(rok) || !Number.isInteger(tyzden)) {
        return res.status(400).json({ message: "Chýba ?rok=&tyzden=" });
      }
      const { from, to } = isoWeekDateRange(rok, tyzden);
      const rows = await query<ShiftJoinRow>(
        SELECT_JOIN + "WHERE s.`datum` BETWEEN ? AND ? ORDER BY s.`datum` ASC",
        [ymd(from), ymd(to)]
      );
      return res.status(200).json({ shifts: rows.map(mapShift) });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, upsertSchema);
      if (!body) return;
      const datum = body.datum.slice(0, 10);

      // Vozidlo nesmie byť pre daný slot blokované (nedostupné / servis),
      // ak ide o skutočnú smenu (nie voľno).
      if (body.vehicleId && body.typ !== "VOLNO") {
        const blocks = await query<{ typ: string; datumDo: string; rozsah: string }>(
          "SELECT `typ`, `datumDo`, `rozsah` FROM `VehicleBlock` WHERE `vehicleId` = ? AND ? BETWEEN `datumOd` AND `datumDo`",
          [body.vehicleId, datum]
        );
        // 24-hodinová smena zaberá dennú aj nočnú — skontroluj oba sloty.
        const slots: ("DENNA" | "NOCNA")[] = body.typ === "H24" ? ["DENNA", "NOCNA"] : [body.typ as "DENNA" | "NOCNA"];
        const block = blocks.find((b) => slots.some((t) => blockCoversSlot(b, datum, t)));
        if (block) {
          return res.status(409).json({
            message: `Vozidlo je v tomto termíne ${block.typ === "SERVIS" ? "v servise" : "nedostupné"} — smenu nemožno priradiť.`,
          });
        }
      }

      // Predvolený poplatok z vozidla, ak nie je zadaný.
      let poplatok = body.poplatokZaSmenu ?? null;
      if (poplatok === null && body.vehicleId) {
        const v = await queryOne<{ poplatokZaSmenu: number }>(
          "SELECT `poplatokZaSmenu` FROM `Vehicle` WHERE `id` = ?",
          [body.vehicleId]
        );
        if (v) poplatok = Number(v.poplatokZaSmenu);
      }

      // Poplatok prepíš len ak bol explicitne poslaný (inak nechaj existujúci).
      const overwriteFee = body.poplatokZaSmenu !== undefined || poplatok !== null;
      const updateFeeClause = overwriteFee ? "`poplatokZaSmenu` = VALUES(`poplatokZaSmenu`), " : "";

      await execute(
        "INSERT INTO `Shift` (`driverId`,`datum`,`typ`,`vehicleId`,`poplatokZaSmenu`,`poznamka`,`createdById`,`createdAt`,`updatedAt`) " +
          "VALUES (?,?,?,?,?,?,?,NOW(3),NOW(3)) " +
          "ON DUPLICATE KEY UPDATE `typ` = VALUES(`typ`), `vehicleId` = VALUES(`vehicleId`), " +
          updateFeeClause +
          "`poznamka` = VALUES(`poznamka`), `updatedAt` = NOW(3)",
        [body.driverId, datum, body.typ, body.vehicleId ?? null, poplatok, body.poznamka ?? null, ctx.userId]
      );

      const rows = await query<ShiftJoinRow>(
        SELECT_JOIN + "WHERE s.`driverId` = ? AND s.`datum` = ?",
        [body.driverId, datum]
      );
      return res.status(200).json({ shift: rows.length ? mapShift(rows[0]) : null });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
