import type { NextApiRequest, NextApiResponse } from "next";
import { query, queryOne, toBool } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { getRegistrationFee } from "@/lib/settings";

type RevRow = {
  id: number; isoRok: number; isoTyzden: number; trzba: number;
  poplatokApp: number; provizia: number; celkovyPoplatok: number; uhradene: number;
};
type ShiftFeeRow = {
  id: number; datum: string; typ: string; poplatokZaSmenu: number | null;
  poplatokUhradeny: number; v_nazov: string | null; v_spz: string | null;
};

// Vodič vidí len svoje poplatky (týždenné + registračný + poplatky za smeny/prenájom).
export default withErrorHandler(
  withAuth(["VODIC", "DISPECER", "MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const user = await queryOne<{ registracnyPoplatokUhradeny: number; registracnyPoplatokDna: string | null }>(
      "SELECT `registracnyPoplatokUhradeny`, `registracnyPoplatokDna` FROM `User` WHERE `id` = ?",
      [ctx.userId]
    );
    const revRows = await query<RevRow>(
      "SELECT `id`,`isoRok`,`isoTyzden`,`trzba`,`poplatokApp`,`provizia`,`celkovyPoplatok`,`uhradene` " +
        "FROM `Revenue` WHERE `driverId` = ? ORDER BY `isoRok` DESC, `isoTyzden` DESC",
      [ctx.userId]
    );
    const shiftRows = await query<ShiftFeeRow>(
      "SELECT s.`id`, s.`datum`, s.`typ`, s.`poplatokZaSmenu`, s.`poplatokUhradeny`, v.`nazov` AS v_nazov, v.`spz` AS v_spz " +
        "FROM `Shift` s LEFT JOIN `Vehicle` v ON v.`id` = s.`vehicleId` " +
        "WHERE s.`driverId` = ? AND s.`poplatokZaSmenu` IS NOT NULL ORDER BY s.`datum` DESC",
      [ctx.userId]
    );
    const registrationFee = await getRegistrationFee();

    const revenues = revRows.map((r) => ({
      id: r.id, isoRok: r.isoRok, isoTyzden: r.isoTyzden,
      trzba: Number(r.trzba), poplatokApp: Number(r.poplatokApp),
      provizia: Number(r.provizia), celkovyPoplatok: Number(r.celkovyPoplatok),
      uhradene: toBool(r.uhradene),
    }));
    const shiftFees = shiftRows.map((s) => ({
      id: s.id, datum: s.datum, typ: s.typ,
      poplatokZaSmenu: s.poplatokZaSmenu === null ? null : Number(s.poplatokZaSmenu),
      poplatokUhradeny: toBool(s.poplatokUhradeny),
      vehicle: s.v_nazov ? { nazov: s.v_nazov, spz: s.v_spz } : null,
    }));

    const spoluTyzdennePoplatky = revenues.reduce((s, r) => s + r.celkovyPoplatok, 0);
    const neuhradeneTyzdennePoplatky = revenues.filter((r) => !r.uhradene).reduce((s, r) => s + r.celkovyPoplatok, 0);
    const neuhradenePoplatkyZaSmeny = shiftFees
      .filter((s) => !s.poplatokUhradeny)
      .reduce((s, x) => s + (x.poplatokZaSmenu ?? 0), 0);

    return res.status(200).json({
      registracia: {
        poplatok: registrationFee,
        uhradeny: toBool(user?.registracnyPoplatokUhradeny),
        uhradenyDna: user?.registracnyPoplatokDna ?? null,
      },
      suhrn: { spoluTyzdennePoplatky, neuhradeneTyzdennePoplatky, neuhradenePoplatkyZaSmeny },
      revenues,
      shiftFees,
    });
  })
);
