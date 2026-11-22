// Zostavenie preloženej trasovej stránky (EN/DE/HU/PL) z prekladov + faktov SK stránky (cena, IATA, súvisiace).
import type { LandingPageData } from "@/content/landing";
import { ROUTE_PAGES } from "@/content/routePages";
import { SITE_URL } from "@/locales";
import { ROUTE_CONTENT } from "./index";
import { ROUTE_LOCALES, type LocaleContent, type RouteLocale } from "./types";

export const HUB_SLUG = "letiskove-transfery";

export function isRouteLocale(locale: string | undefined): locale is RouteLocale {
  return Boolean(locale && (ROUTE_LOCALES as readonly string[]).includes(locale));
}

/** Absolútna URL trasovej stránky / rozcestníka v jazyku (sk bez prefixu). */
export function routeUrl(slug: string, locale: string): string {
  return `${SITE_URL}${locale === "sk" ? "" : `/${locale}`}/${slug}`;
}

/** hreflang alternatívy: sk, en, de, hu, pl + x-default (sk). */
export function routeAlternates(slug: string): { hrefLang: string; href: string }[] {
  return [
    { hrefLang: "sk", href: routeUrl(slug, "sk") },
    ...ROUTE_LOCALES.map((l) => ({ hrefLang: l, href: routeUrl(slug, l) })),
    { hrefLang: "x-default", href: routeUrl(slug, "sk") },
  ];
}

const SERVICE_TYPE: Record<RouteLocale, { airport: string; long: string }> = {
  en: { airport: "Airport transfer", long: "Long-distance transfer" },
  de: { airport: "Flughafentransfer", long: "Fernstreckentransfer" },
  hu: { airport: "Reptéri transzfer", long: "Távolsági transzfer" },
  pl: { airport: "Transfer lotniskowy", long: "Transfer dalekobieżny" },
};

/** Názov trasy bez IATA kódu, napr. „Košice – Budapest Airport“. */
export const shortRoute = (label: string) => label.replace(/\s*\([A-Z]{3}\)\s*$/, "");

export function localizedPriceLabel(c: LocaleContent, sk: LandingPageData): string {
  if (!sk.price) return "";
  return c.ui.price(sk.price, /^od\s/.test(sk.priceLabel ?? ""));
}

export function getLocalizedLanding(slug: string, locale: RouteLocale): LandingPageData {
  const sk = ROUTE_PAGES.find((p) => p.slug === slug);
  const c = ROUTE_CONTENT[locale];
  const r = c.routes[slug];
  if (!sk || !r) throw new Error(`Missing localized route ${locale}/${slug}`);
  const priceLabel = localizedPriceLabel(c, sk);
  const route = shortRoute(r.routeLabel);
  const commonFaq = c.commonFaq(route, priceLabel);
  return {
    slug,
    navLabel: r.navLabel,
    seoTitle: r.seoTitle,
    seoDescription: r.seoDescription,
    keywords: r.keywords,
    h1: r.h1,
    lead: r.lead,
    serviceType: sk.serviceType === "Diaľkový transfer" ? SERVICE_TYPE[locale].long : SERVICE_TYPE[locale].airport,
    price: sk.price,
    priceLabel,
    airportCode: sk.airportCode,
    destinationName: route.split(" – ").slice(1).join(" – ") || sk.destinationName,
    facts: [
      { label: c.ui.factPrice, value: c.ui.perCar(priceLabel) },
      { label: c.ui.factRoute, value: r.routeLabel },
      { label: c.ui.factDistance, value: r.distance },
      { label: c.ui.factDuration, value: r.duration },
    ],
    sections: [
      r.intro,
      r.route,
      { ...r.pickup, bullets: c.ui.pickupBullets },
      c.priceSection(route, priceLabel),
      r.tips,
    ],
    // Pri letisku Košice by spoločná cenová otázka duplikovala otázku trasy.
    faq: [...r.faq, ...(slug === "taxi-letisko-kosice" ? commonFaq.slice(1) : commonFaq)],
    related: sk.related.filter((s) => s in c.routes),
  };
}
