// Kontakty na kolegov — zoznam aktívnych ľudí (meno, znak, tel, email, miesto
// striedania). Dostupné všetkým portálovým rolám (vodič/dispečer/majiteľ).
import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";

type Row = {
  id: number; meno: string; priezvisko: string; volaciZnak: string | null;
  telefon: string | null; email: string; miestoStriedania: string | null; roles: string | null;
};

export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER", "VODIC"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const rows = await query<Row>(
      "SELECT u.`id`, u.`meno`, u.`priezvisko`, u.`volaciZnak`, u.`telefon`, u.`email`, u.`miestoStriedania`, " +
        "GROUP_CONCAT(ur.`role`) AS roles " +
        "FROM `User` u LEFT JOIN `UserRole` ur ON ur.`userId` = u.`id` " +
        "WHERE u.`aktivny` = 1 " +
        "GROUP BY u.`id` " +
        "ORDER BY (u.`volaciZnak` IS NULL), u.`volaciZnak` ASC, u.`priezvisko` ASC"
    );

    const kontakty = rows.map((u) => ({
      id: u.id, meno: u.meno, priezvisko: u.priezvisko, volaciZnak: u.volaciZnak,
      telefon: u.telefon, email: u.email, miestoStriedania: u.miestoStriedania,
      roles: u.roles ? u.roles.split(",") : [],
    }));
    return res.status(200).json({ kontakty });
  })
);
