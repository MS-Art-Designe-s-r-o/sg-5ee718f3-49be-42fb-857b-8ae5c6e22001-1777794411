// Spoločné pomôcky pre API handlery.
import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, type ZodTypeAny, type z } from "zod";
import { describeError, PublicError } from "@/lib/safeLog";

export function getClientIp(req: NextApiRequest): string | undefined {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string") return fwd.split(",")[0].trim();
  if (Array.isArray(fwd)) return fwd[0];
  return req.socket?.remoteAddress;
}

/** Overí telo requestu voči zod schéme; pri chybe pošle 400 a vráti null. */
export function parseBody<S extends ZodTypeAny>(
  req: NextApiRequest,
  res: NextApiResponse,
  schema: S
): z.infer<S> | null {
  try {
    return schema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({ message: "Neplatné údaje", errors: e.flatten() });
    } else {
      res.status(400).json({ message: "Neplatné údaje" });
    }
    return null;
  }
}

/** Rekurzívne prevedie Prisma.Decimal na number. Date ostáva Date (JSON ho dá na ISO). */
export function serialize<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (typeof value === "object") {
    const v = value as unknown as {
      toNumber?: () => number;
      toFixed?: () => string;
    };
    // Prisma.Decimal (decimal.js) — spoľahlivo cez metódy, nie cez constructor.name.
    if (typeof v.toNumber === "function" && typeof v.toFixed === "function") {
      return v.toNumber() as unknown as T;
    }
    if (value instanceof Date) return value;
    if (Array.isArray(value)) {
      return value.map((x) => serialize(x)) as unknown as T;
    }
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(value as Record<string, unknown>)) {
      out[k] = serialize(val);
    }
    return out as unknown as T;
  }
  return value;
}

/**
 * Zaobalí handler try/catch — 500 pri neočakávanej chybe.
 * Loguje len bezpečný popis chyby (describeError: bez SQL, hodnôt a osobných údajov).
 * PublicError má pevný text, ktorý sa smie poslať klientovi aj so svojím statusom.
 */
export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => unknown | Promise<unknown>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (err) {
      console.error(`API error [${req.method} ${req.url?.split("?")[0] ?? ""}]: ${describeError(err)}`);
      if (!res.headersSent) {
        if (err instanceof PublicError) {
          res.status(err.status).json({ message: err.message });
        } else {
          res.status(500).json({ message: "Interná chyba servera" });
        }
      }
    }
  };
}
