// Autorizácia zápisu do blogu cez Bearer token (publikuje AI agent Šefko).
// Token sa nastaví v premennej BLOG_API_TOKEN (cPanel → Environment variables).
// Ak token nie je nastavený, zápis je vypnutý (žiadny otvorený endpoint).

import type { NextApiRequest } from "next";
import { timingSafeEqual } from "crypto";

export type BlogAuthResult = { ok: boolean; status?: number; message?: string };

export function checkBlogToken(req: NextApiRequest): BlogAuthResult {
  const expected = process.env.BLOG_API_TOKEN;
  if (!expected) {
    return { ok: false, status: 503, message: "Publikovanie blogu nie je nakonfigurované (chýba BLOG_API_TOKEN)" };
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return { ok: false, status: 401, message: "Chýba autorizačný token (Authorization: Bearer ...)" };
  }

  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, status: 403, message: "Neplatný token" };
  }
  return { ok: true };
}
