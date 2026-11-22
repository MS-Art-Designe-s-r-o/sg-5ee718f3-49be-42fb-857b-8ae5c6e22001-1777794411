import { sk } from "./sk";
import { en } from "./en";
import { de } from "./de";
import { hu } from "./hu";
import type { Dictionary } from "./sk";

// Pridanie nového jazyka:
// 1. skopírujte en.ts na napr. de.ts a preložte texty (typ Dictionary ustráži úplnosť),
// 2. zaregistrujte ho tu v `dictionaries`,
// 3. pridajte kód jazyka do `i18n.locales` v next.config.mjs,
// 4. doplňte URL do public/sitemap.xml.

export const dictionaries = { sk, en, de, hu } satisfies Record<string, Dictionary>;

export type Locale = keyof typeof dictionaries;

export const locales = Object.keys(dictionaries) as Locale[];
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
