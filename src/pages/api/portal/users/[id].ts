import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { queryOne, execute, withTransaction, toBool, getUserRoles, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { generateToken, sendPasswordSetupEmail } from "@/lib/email";

const role = z.enum(["MAJITEL", "DISPECER", "VODIC"]);

const updateSchema = z.object({
  meno: z.string().min(1).optional(),
  priezvisko: z.string().min(1).optional(),
  telefon: z.string().nullable().optional(),
  volaciZnak: z.string().nullable().optional(),
  miestoStriedania: z.string().nullable().optional(),
  aktivny: z.boolean().optional(),
  roles: z.array(role).min(1).optional(),
  registracnyPoplatokUhradeny: z.boolean().optional(),
  resendInvite: z.boolean().optional(),
});

type UserRow = {
  id: number; email: string; meno: string; priezvisko: string;
  telefon: string | null; volaciZnak: string | null; aktivny: number;
  mustSetPassword: number; registracnyPoplatokUhradeny: number;
  registracnyPoplatokDna: string | null;
};

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Neplatné ID" });

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;

      const current = await queryOne<UserRow>("SELECT * FROM `User` WHERE `id` = ?", [id]);
      if (!current) return res.status(404).json({ message: "Používateľ neexistuje" });

      await withTransaction(async (tx) => {
        const sets: string[] = [];
        const params: SqlParam[] = [];
        const add = (col: string, val: SqlParam) => { sets.push(`\`${col}\` = ?`); params.push(val); };

        if (body.meno !== undefined) add("meno", body.meno);
        if (body.priezvisko !== undefined) add("priezvisko", body.priezvisko);
        if (body.telefon !== undefined) add("telefon", body.telefon);
        if (body.volaciZnak !== undefined)
          add("volaciZnak", body.volaciZnak ? body.volaciZnak.toUpperCase().trim() : null);
        if (body.miestoStriedania !== undefined)
          add("miestoStriedania", body.miestoStriedania ? body.miestoStriedania.trim() : null);
        if (body.aktivny !== undefined) add("aktivny", body.aktivny ? 1 : 0);
        if (body.registracnyPoplatokUhradeny !== undefined) {
          add("registracnyPoplatokUhradeny", body.registracnyPoplatokUhradeny ? 1 : 0);
          add(
            "registracnyPoplatokDna",
            body.registracnyPoplatokUhradeny
              ? current.registracnyPoplatokDna ?? new Date()
              : null
          );
        }
        if (sets.length) {
          sets.push("`updatedAt` = NOW(3)");
          params.push(id);
          await tx.execute(`UPDATE \`User\` SET ${sets.join(", ")} WHERE \`id\` = ?`, params);
        }
        if (body.roles) {
          await tx.execute("DELETE FROM `UserRole` WHERE `userId` = ?", [id]);
          for (const rr of body.roles) {
            await tx.execute("INSERT INTO `UserRole` (`userId`,`role`) VALUES (?,?)", [id, rr]);
          }
        }
      });

      let inviteLink: string | undefined;
      if (body.resendInvite) {
        const token = generateToken();
        await execute(
          "UPDATE `User` SET `passwordResetToken` = ?, `passwordResetExpires` = ? WHERE `id` = ?",
          [token, new Date(Date.now() + 48 * 60 * 60 * 1000), id]
        );
        const r = await sendPasswordSetupEmail({
          to: current.email,
          meno: current.meno,
          token,
          isReset: !toBool(current.mustSetPassword),
        });
        if (!r.sent) inviteLink = r.link;
      }

      const updated = await queryOne<UserRow>("SELECT * FROM `User` WHERE `id` = ?", [id]);
      const roles = await getUserRoles(id);
      return res.status(200).json({
        user: updated && {
          id: updated.id,
          email: updated.email,
          meno: updated.meno,
          priezvisko: updated.priezvisko,
          telefon: updated.telefon,
          volaciZnak: updated.volaciZnak,
          aktivny: toBool(updated.aktivny),
          registracnyPoplatokUhradeny: toBool(updated.registracnyPoplatokUhradeny),
          roles,
        },
        inviteLink,
      });
    }

    if (req.method === "DELETE") {
      if (id === ctx.userId) {
        return res.status(400).json({ message: "Nemôžete zmazať vlastný účet." });
      }
      await execute("DELETE FROM `User` WHERE `id` = ?", [id]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
