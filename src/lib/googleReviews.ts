// Živé Google recenzie cez oficiálne Google Places API (Place Details).
//
// Potrebné premenné prostredia (cPanel → Environment variables):
//   GOOGLE_PLACES_API_KEY  — API kľúč z Google Cloud (Places API povolené)
//   GOOGLE_PLACE_ID        — (voliteľné) Place ID firmy; ak chýba, dohľadá sa podľa názvu
//   GOOGLE_PLACE_QUERY     — (voliteľné) názov na dohľadanie, default "E-TAXI Košice"
//
// Pozn.: Google cez API vracia len cca 5 recenzií (najrelevantnejšie/najnovšie),
// ale celkový rating aj počet sú presné a živé.

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

async function resolvePlaceId(key: string): Promise<string | null> {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  if (resolvedPlaceId) return resolvedPlaceId;

  const query = process.env.GOOGLE_PLACE_QUERY || "E-TAXI Košice";
  const url =
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
    `?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${key}`;
  const resp = await fetch(url);
  const data = (await resp.json()) as { candidates?: { place_id: string }[]; status: string };
  if (data.status === "OK" && data.candidates?.[0]?.place_id) {
    resolvedPlaceId = data.candidates[0].place_id;
    return resolvedPlaceId;
  }
  return null;
}

/**
 * Vráti živé recenzie z Googlu, alebo null ak nie je nakonfigurované API
 * (vtedy frontend použije záložné statické recenzie).
 */
export async function getGoogleReviews(locale = "sk"): Promise<GoogleReviewsResult | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;

  const cacheKey = locale;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.data;

  const placeId = await resolvePlaceId(key);
  if (!placeId) return null;

  const lang = ["sk", "en", "de", "hu"].includes(locale) ? locale : "sk";
  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=rating,user_ratings_total,reviews,url` +
    `&reviews_sort=newest&language=${lang}&key=${key}`;

  const resp = await fetch(url);
  const data = (await resp.json()) as {
    status: string;
    result?: {
      rating?: number;
      user_ratings_total?: number;
      url?: string;
      reviews?: Array<{
        author_name: string;
        rating: number;
        text: string;
        relative_time_description: string;
        time: number;
        profile_photo_url?: string;
        author_url?: string;
      }>;
    };
  };

  if (data.status !== "OK" || !data.result) {
    // Pri chybe API radšej vráť staršiu cache, ak existuje; inak null.
    if (cached) return cached.data;
    return null;
  }

  const r = data.result;
  const result: GoogleReviewsResult = {
    rating: typeof r.rating === "number" ? r.rating : null,
    total: typeof r.user_ratings_total === "number" ? r.user_ratings_total : null,
    profileUrl: r.url,
    reviews: (r.reviews || [])
      .filter((rev) => rev.text && rev.text.trim().length > 0)
      .map((rev) => ({
        author: rev.author_name,
        rating: rev.rating,
        text: rev.text,
        relativeTime: rev.relative_time_description,
        time: rev.time,
        photo: rev.profile_photo_url,
        authorUrl: rev.author_url,
      })),
  };

  cache.set(cacheKey, { data: result, expires: Date.now() + CACHE_TTL_MS });
  return result;
}
