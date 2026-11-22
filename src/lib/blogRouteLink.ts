// Interný odkaz z blogového článku na zodpovedajúcu trasovú stránku (podľa slugu/titulku).
import { ROUTE_PAGES } from "@/content/routePages";

const RULES: [RegExp, string][] = [
  [/budape(s|š)t/i, "transfer-kosice-budapest"],
  [/krak(o|ó)w|krakov/i, "transfer-kosice-krakow"],
  [/katowic|katovic/i, "transfer-kosice-katowice"],
  [/vied(e|ň|n)|viedn|vienna|wien|schwechat/i, "transfer-kosice-viedna"],
  [/debrec/i, "transfer-kosice-debrecin"],
  [/rzesz/i, "transfer-kosice-rzeszow"],
  [/poprad|tatry/i, "transfer-kosice-poprad"],
  [/bratislav/i, "transfer-kosice-bratislava"],
  [/letisk\w* ko(s|š)ic|ko(s|š)ic\w* letisk|kosice-airport|letisko-kosice/i, "taxi-letisko-kosice"],
];

export type BlogRouteLink = { slug: string; label: string; price: string | null };

export function blogRouteLink(post: { slug: string; title: string }): BlogRouteLink | null {
  const hay = `${post.slug} ${post.title}`;
  const hit = RULES.find(([re]) => re.test(hay));
  if (hit) {
    const p = ROUTE_PAGES.find((r) => r.slug === hit[1]);
    if (p) return { slug: p.slug, label: p.navLabel, price: p.priceLabel ?? null };
  }
  if (/letisk|transfer|airport/i.test(hay)) return { slug: "letiskove-transfery", label: "Letiskové transfery z Košíc", price: null };
  return null;
}
