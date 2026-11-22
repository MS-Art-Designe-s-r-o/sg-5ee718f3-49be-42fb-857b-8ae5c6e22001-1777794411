import { sk } from "./sk";
import { en } from "./en";
import { de } from "./de";
import { hu } from "./hu";
import { pl } from "./pl";
import type { Dictionary } from "./sk";

// Pridanie nového jazyka:
// 1. skopírujte en.ts na napr. de.ts a preložte texty (typ Dictionary ustráži úplnosť),
// 2. zaregistrujte ho tu v `dictionaries`,
// 3. pridajte kód jazyka do `i18n.locales` v next.config.mjs,
// 4. doplňte URL do public/sitemap.xml.

export const dictionaries = { sk, en, de, hu, pl } satisfies Record<string, Dictionary>;

export type Locale = keyof typeof dictionaries;

/** Jazyky celého webu (prepínač, hreflang). Poľština (pl) existuje len pre letiskové transfery – pozri ROUTE_LOCALE_SLUGS. */
export const locales: Locale[] = ["sk", "en", "de", "hu"];
/** Všetky jazyky vrátane čiastočných (pl). */
export const allLocales = Object.keys(dictionaries) as Locale[];

/** Stránky, ktoré existujú vo všetkých jazykoch vrátane pl (rozcestník a trasy letiskových transferov). */
export const ROUTE_LOCALE_SLUGS = [
  "letiskove-transfery",
  "taxi-letisko-kosice",
  "transfer-kosice-budapest",
  "transfer-kosice-krakow",
  "transfer-kosice-katowice",
  "transfer-kosice-viedna",
  "transfer-kosice-debrecin",
  "transfer-kosice-bratislava",
  "transfer-kosice-rzeszow",
  "transfer-kosice-poprad",
] as const;

/** Trasová stránka pre každý riadok pricing.transfers (rovnaké poradie vo všetkých slovníkoch). */
export const PRICING_TRANSFER_SLUGS = [
  "taxi-letisko-kosice",
  "transfer-kosice-budapest",
  "transfer-kosice-krakow",
  "transfer-kosice-debrecin",
  "transfer-kosice-bratislava",
  "transfer-kosice-viedna",
  "transfer-kosice-katowice",
  "transfer-kosice-rzeszow",
  "transfer-kosice-poprad",
] as const;
export const defaultLocale: Locale = "sk";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://e-taxike.sk";

export function getDictionary(locale?: string): Dictionary {
  if (locale && locale in dictionaries) {
    return dictionaries[locale as Locale];
  }
  return dictionaries[defaultLocale];
}

/** Absolútna URL stránky v danom jazyku (default jazyk je bez prefixu). */
export function localizedUrl(path: string, locale: string): string {
  const cleanPath = path === "/" ? "" : path;
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${cleanPath}` || SITE_URL;
}

export type { Dictionary };
