import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { queryOne, getUserRoles, toBool, type UserRow } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { parseBody, getClientIp, withErrorHandler } from "@/lib/apiHelpers";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Jednoduchý in-memory rate-limit (na proces). Na prod ideálne DB/Redis.
const attempts = new Map<string, { count: number; ts: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX = 10;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now - rec.ts > WINDOW) {
    attempts.set(key, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX;
}

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const body = parseBody(req, res, schema);
  if (!body) return;

  const ip = getClientIp(req) ?? "unknown";
  if (rateLimited(`${ip}:${body.email}`)) {
    return res.status(429).json({ message: "Priveľa pokusov. Skúste neskôr." });
  }

  const user = await queryOne<UserRow>("SELECT * FROM `User` WHERE `email` = ?", [
    body.email.toLowerCase(),
  ]);
  if (!user || !toBool(user.aktivny) || !user.passwordHash) {
    return res.status(401).json({ message: "Nesprávny e-mail alebo heslo." });
  }

  const ok = await verifyPassword(body.password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Nesprávny e-mail alebo heslo." });
  }

  const roles = await getUserRoles(user.id);
  const token = await createSessionToken({ uid: user.id, email: user.email, roles });
  setSessionCookie(res, token);

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      meno: user.meno,
      priezvisko: user.priezvisko,
      roles,
    },
  });
});
