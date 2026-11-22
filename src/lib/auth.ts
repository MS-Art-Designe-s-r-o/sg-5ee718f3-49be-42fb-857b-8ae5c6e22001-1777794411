// Odľahčená autentifikácia: bcrypt heslá + JWT session v httpOnly cookie (jose).
// Kontrola rolí server-side pre API aj stránky portálu.
import type { NextApiRequest, NextApiResponse } from "next";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { serialize, parse } from "cookie";
import { getUserWithRoles, toBool, type Role } from "@/lib/db";

export type { Role };

export const SESSION_COOKIE = "etaxi_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hodín

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_JWT_SECRET nie je nastavený (min. 16 znakov).");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  uid: number;
  email: string;
  roles: Role[];
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      uid: payload.uid as number,
      email: payload.email as string,
      roles: (payload.roles as Role[]) ?? [],
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(res: NextApiResponse, token: string): void {
  res.setHeader(
    "Set-Cookie",
    serialize(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    })
  );
}

export function clearSessionCookie(res: NextApiResponse): void {
  res.setHeader(
    "Set-Cookie",
    serialize(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
  );
}

/** Prečíta a overí session z requestu (API alebo getServerSideProps). */
export async function getSession(req: NextApiRequest | { headers: { cookie?: string } }): Promise<SessionPayload | null> {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const token = parse(cookieHeader)[SESSION_COOKIE];
  if (!token) return null;
  return verifySessionToken(token);
}

export function hasRole(session: SessionPayload | null, ...roles: Role[]): boolean {
  if (!session) return false;
  return session.roles.some((r) => roles.includes(r));
}

/**
 * Wrapper pre API handlery — vyžaduje prihlásenie a (voliteľne) niektorú z rolí.
 * Načíta aktuálny stav používateľa z DB (kontrola aktivny), aby odvolanie roly
 * platilo okamžite.
 */
export function withAuth(
  roles: Role[] | null,
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: { session: SessionPayload; userId: number }
  ) => unknown | Promise<unknown>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ message: "Neprihlásený" });
    }
    const user = await getUserWithRoles(session.uid);
    if (!user || !toBool(user.aktivny)) {
      return res.status(401).json({ message: "Účet neexistuje alebo je neaktívny" });
    }
    const currentRoles = user.roles;
    const freshSession: SessionPayload = { uid: user.id, email: user.email, roles: currentRoles };
    if (roles && !currentRoles.some((r) => roles.includes(r))) {
      return res.status(403).json({ message: "Nedostatočné oprávnenie" });
    }
    return handler(req, res, { session: freshSession, userId: user.id });
  };
}
