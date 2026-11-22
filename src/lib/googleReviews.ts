// Živé Google recenzie cez oficiálne Google Places API (New) – Place Details (New).
// Pozn.: staré „Places API (Legacy)“ sa pre nové Google Cloud projekty od marca 2025
// nedá zapnúť, preto používame places.googleapis.com/v1.
//
// Premenné prostredia (na hostingu cez SetEnv v ~/public_html/.htaccess):
//   GOOGLE_PLACES_API_KEY  — API kľúč z Google Cloud (povolené „Places API (New)“, ideálne obmedzené na toto API)
//   GOOGLE_PLACE_ID        — (voliteľné) Place ID firmy; ak chýba, dohľadá sa podľa názvu
//   GOOGLE_PLACE_QUERY     — (voliteľné) názov na dohľadanie, default "E-TAXI Košice"
//
// Google cez API vracia najviac 5 recenzií, ale celkový rating aj počet sú presné a živé.

export type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
  time: number;
  photo?: string;
  authorUrl?: string;
};

export type GoogleReviewsResult = {
  rating: number | null;
  total: number | null;
  reviews: GoogleReview[];
  profileUrl?: string;
};

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hodín
type CacheEntry = { data: GoogleReviewsResult; expires: number };
const cache = new Map<string, CacheEntry>();

let resolvedPlaceId: string | null = null;
let warnedMissingKey = false;

async function resolvePlaceId(key: string): Promise<string | null> {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  if (resolvedPlaceId) return resolvedPlaceId;

  const query = process.env.GOOGLE_PLACE_QUERY || "E-TAXI Košice";
  const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.id" },
    body: JSON.stringify({ textQuery: query, languageCode: "sk", regionCode: "SK" }),
  });
  const data = (await resp.json().catch(() => ({}))) as { places?: { id: string }[]; error?: { status?: string; message?: string } };
  if (resp.ok && data.places?.[0]?.id) {
    resolvedPlaceId = data.places[0].id;
    return resolvedPlaceId;
  }
  console.warn(`[google-reviews] searchText HTTP ${resp.status} ${data.error?.status ?? ""} ${data.error?.message ?? ""}`.trim());
  return null;
}

/**
 * Vráti živé recenzie z Googlu, alebo null ak nie je nakonfigurované API
 * (vtedy frontend použije záložné statické recenzie).
 */
export async function getGoogleReviews(locale = "sk"): Promise<GoogleReviewsResult | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    if (!warnedMissingKey) console.warn("[google-reviews] GOOGLE_PLACES_API_KEY nie je nastavený – použije sa záložné hodnotenie");
    warnedMissingKey = true;
    return null;
  }

  const cacheKey = locale;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.data;

  const placeId = await resolvePlaceId(key);
  if (!placeId) return null;

  const lang = ["sk", "en", "de", "hu", "pl"].includes(locale) ? locale : "sk";
  const resp = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${lang}`, {
    headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri" },
  });
  const data = (await resp.json().catch(() => ({}))) as {
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    reviews?: Array<{
      rating?: number;
      text?: { text?: string };
      originalText?: { text?: string };
      relativePublishTimeDescription?: string;
      publishTime?: string;
      authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
    }>;
    error?: { status?: string; message?: string };
  };

  if (!resp.ok || data.error) {
    console.warn(`[google-reviews] place details HTTP ${resp.status} ${data.error?.status ?? ""} ${data.error?.message ?? ""}`.trim());
    // Pri chybe API radšej vráť staršiu cache, ak existuje; inak null.
    if (cached) return cached.data;
    return null;
  }

  const result: GoogleReviewsResult = {
    rating: typeof data.rating === "number" ? data.rating : null,
    total: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
    profileUrl: data.googleMapsUri,
    reviews: (data.reviews || [])
      .map((rev) => ({
        author: rev.authorAttribution?.displayName || "Google",
        rating: rev.rating ?? 5,
        text: rev.text?.text || rev.originalText?.text || "",
        relativeTime: rev.relativePublishTimeDescription || "",
        time: rev.publishTime ? Math.floor(Date.parse(rev.publishTime) / 1000) : 0,
        photo: rev.authorAttribution?.photoUri,
        authorUrl: rev.authorAttribution?.uri,
      }))
      .filter((rev) => rev.text.trim().length > 0),
  };

  cache.set(cacheKey, { data: result, expires: Date.now() + CACHE_TTL_MS });
  return result;
}
