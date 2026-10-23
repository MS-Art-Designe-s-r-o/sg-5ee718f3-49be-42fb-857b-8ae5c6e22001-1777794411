// GET /api/google-reviews?locale=sk
// Vráti živý rating, počet recenzií a cca 5 reálnych Google recenzií.
// Ak GOOGLE_PLACES_API_KEY nie je nastavený (alebo API zlyhá), vráti
// { source: "fallback" } a frontend použije statické recenzie.

import type { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandler } from "@/lib/apiHelpers";
import { getGoogleReviews } from "@/lib/googleReviews";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const localeParam = Array.isArray(req.query.locale) ? req.query.locale[0] : req.query.locale;
  const data = await getGoogleReviews(localeParam || "sk");

  if (!data) {
    return res.status(200).json({ source: "fallback" });
  }

  // Cache na CDN/prehliadač — API samo cachuje 6 h, tu krátko.
  res.setHeader("Cache-Control", "public, max-age=1800, stale-while-revalidate=86400");
  return res.status(200).json({ source: "google", ...data });
}

export default withErrorHandler(handler);
