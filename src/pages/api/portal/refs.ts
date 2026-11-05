import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";

// Číselníky pre rozpis smien — vodiči a vozidlá. Dostupné majiteľovi aj dispečerovi.
export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const drivers = await query<{ id: number; meno: string; priezvisko: string; volaciZnak: string | null }>(
      "SELECT u.`id`, u.`meno`, u.`priezvisko`, u.`volaciZnak` " +
        "FROM `User` u JOIN `UserRole` ur ON ur.`userId` = u.`id` AND ur.`role` = 'VODIC' " +
        "WHERE u.`aktivny` = 1 ORDER BY (u.`volaciZnak` IS NULL), u.`volaciZnak` ASC, u.`priezvisko` ASC"
    );
    const vehRows = await query<{ id: number; nazov: string; spz: string; poplatokZaSmenu: number; poplatokZa24h: number; casVymeny: string | null; sukromne: number }>(
      "SELECT `id`, `nazov`, `spz`, `poplatokZaSmenu`, `poplatokZa24h`, `casVymeny`, `sukromne` FROM `Vehicle` WHERE `aktivne` = 1 ORDER BY `nazov` ASC"
    );
    const vehicles = vehRows.map((v) => ({
      id: v.id, nazov: v.nazov, spz: v.spz,
      poplatokZaSmenu: Number(v.poplatokZaSmenu),
      poplatokZa24h: Number(v.poplatokZa24h),
      casVymeny: v.casVymeny, sukromne: v.sukromne === 1,
    }));

    return res.status(200).json({ drivers, vehicles });
  })
);
