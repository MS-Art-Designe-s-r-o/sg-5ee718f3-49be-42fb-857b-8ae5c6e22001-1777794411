import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, queryOne, withTransaction, toBool, type Role } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { generateToken, sendPasswordSetupEmail } from "@/lib/email";

const role = z.enum(["MAJITEL", "DISPECER", "VODIC"]);

const createSchema = z.object({
  email: z.string().email(),
  meno: z.string().min(1),
  priezvisko: z.string().min(1),
  telefon: z.string().optional(),
  volaciZnak: z.string().optional(),
  miestoStriedania: z.string().nullable().optional(),
  roles: z.array(role).min(1),
  registracnyPoplatokUhradeny: z.boolean().default(false),
  sendInvite: z.boolean().default(true),
});

type UserListRow = {
  id: number; email: string; meno: string; priezvisko: string;
  telefon: string | null; volaciZnak: string | null; miestoStriedania: string | null; aktivny: number;
  mustSetPassword: number; registracnyPoplatokUhradeny: number;
  registracnyPoplatokDna: string | null; roles: string | null;
};

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      const rows = await query<UserListRow>(
        "SELECT u.*, GROUP_CONCAT(ur.`role`) AS roles " +
          "FROM `User` u LEFT JOIN `UserRole` ur ON ur.`userId` = u.`id` " +
          "GROUP BY u.`id` ORDER BY (u.`volaciZnak` IS NULL), u.`volaciZnak` ASC, u.`priezvisko` ASC"
      );
      return res.status(200).json({
        users: rows.map((u) => ({
          id: u.id,
          email: u.email,
          meno: u.meno,
          priezvisko: u.priezvisko,
          telefon: u.telefon,
          volaciZnak: u.volaciZnak,
          miestoStriedania: u.miestoStriedania,
          aktivny: toBool(u.aktivny),
          mustSetPassword: toBool(u.mustSetPassword),
          registracnyPoplatokUhradeny: toBool(u.registracnyPoplatokUhradeny),
          registracnyPoplatokDna: u.registracnyPoplatokDna,
          roles: u.roles ? (u.roles.split(",") as Role[]) : [],
        })),
      });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;

      const email = body.email.toLowerCase().trim();
      const existing = await queryOne<{ id: number }>(
        "SELECT `id` FROM `User` WHERE `email` = ?",
        [email]
      );
      if (existing) return res.status(409).json({ message: "Používateľ s týmto e-mailom už existuje." });

      const token = generateToken();
      const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const regPaid = body.registracnyPoplatokUhradeny;

      const userId = await withTransaction(async (tx) => {
        const [r] = await tx.execute(
          "INSERT INTO `User` " +
            "(`email`,`meno`,`priezvisko`,`telefon`,`volaciZnak`,`miestoStriedania`,`mustSetPassword`,`registracnyPoplatokUhradeny`,`registracnyPoplatokDna`,`passwordResetToken`,`passwordResetExpires`,`aktivny`,`createdAt`,`updatedAt`) " +
            "VALUES (?,?,?,?,?,?,1,?,?,?,?,1,NOW(3),NOW(3))",
          [
            email, body.meno.trim(), body.priezvisko.trim(),
            body.telefon?.trim() || null,
            body.volaciZnak?.trim().toUpperCase() || null,
            body.miestoStriedania?.trim() || null,
            regPaid ? 1 : 0, regPaid ? new Date() : null,
            token, expires,
          ]
        );
        const newId = (r as { insertId: number }).insertId;
        for (const rr of body.roles) {
          await tx.execute("INSERT INTO `UserRole` (`userId`,`role`) VALUES (?,?)", [newId, rr]);
        }
        return newId;
      });

      let inviteLink: string | undefined;
      if (body.sendInvite) {
        const r = await sendPasswordSetupEmail({ to: email, meno: body.meno, token });
        if (!r.sent) inviteLink = r.link;
      }

      return res.status(201).json({
        user: { id: userId, email, meno: body.meno, priezvisko: body.priezvisko, roles: body.roles },
        inviteLink,
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
