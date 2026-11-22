// Neuhradené poplatky konkrétneho vodiča (pre majiteľa) — týždenné poplatky,
// poplatky za prenájom a stav registračného poplatku.
import type { NextApiRequest, NextApiResponse } from "next";
import { query, queryOne, toBool } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { getRegistrationFee } from "@/lib/settings";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
    const driverId = Number(req.query.driverId);
    if (!Number.isInteger(driverId)) return res.status(400).json({ message: "Chýba ?driverId=" });

    const user = await queryOne<{ meno: string; priezvisko: string; volaciZnak: string | null; registracnyPoplatokUhradeny: number }>(
      "SELECT `meno`, `priezvisko`, `volaciZnak`, `registracnyPoplatokUhradeny` FROM `User` WHERE `id` = ?",
      [driverId]
    );
    if (!user) return res.status(404).json({ message: "Vodič neexistuje" });

    const revenues = await query<{ id: number; isoRok: number; isoTyzden: number; celkovyPoplatok: number }>(
      "SELECT `id`, `isoRok`, `isoTyzden`, `celkovyPoplatok` FROM `Revenue` " +
        "WHERE `driverId` = ? AND `uhradene` = 0 ORDER BY `isoRok` DESC, `isoTyzden` DESC",
      [driverId]
    );
    const shiftFees = await query<{ id: number; datum: string; poplatokZaSmenu: number; v_nazov: string | null }>(
      "SELECT s.`id`, s.`datum`, s.`poplatokZaSmenu`, v.`nazov` AS v_nazov FROM `Shift` s " +
        "LEFT JOIN `Vehicle` v ON v.`id` = s.`vehicleId` " +
        "WHERE s.`driverId` = ? AND s.`poplatokZaSmenu` IS NOT NULL AND s.`poplatokUhradeny` = 0 " +
        "ORDER BY s.`datum` DESC",
      [driverId]
    );
    const registrationFee = await getRegistrationFee();

    const trzbySpolu = revenues.reduce((s, r) => s + Number(r.celkovyPoplatok), 0);
    const prenajomSpolu = shiftFees.reduce((s, r) => s + Number(r.poplatokZaSmenu), 0);
    const regNedoplatok = toBool(user.registracnyPoplatokUhradeny) ? 0 : registrationFee;

    return res.status(200).json({
      vodic: { meno: user.meno, priezvisko: user.priezvisko, volaciZnak: user.volaciZnak },
      tyzdennePoplatky: revenues.map((r) => ({ id: r.id, isoRok: r.isoRok, isoTyzden: r.isoTyzden, suma: Number(r.celkovyPoplatok) })),
      poplatkyZaPrenajom: shiftFees.map((r) => ({ id: r.id, datum: r.datum, vozidlo: r.v_nazov, suma: Number(r.poplatokZaSmenu) })),
      registracia: { uhradeny: toBool(user.registracnyPoplatokUhradeny), poplatok: registrationFee },
      suhrn: {
        tyzdennePoplatky: trzbySpolu,
        poplatkyZaPrenajom: prenajomSpolu,
        registracia: regNedoplatok,
        spolu: Math.round((trzbySpolu + prenajomSpolu + regNedoplatok) * 10) / 10,
      },
    });
  })
);
