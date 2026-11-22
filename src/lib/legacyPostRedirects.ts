// 301 presmerovania starých blogových adries v tvare /?post=<slug> (aj /en?post=, /de?post=, /hu?post=).
// Starý blog bežal na domovskej stránke s parametrom ?post=. Google má tieto URL stále v indexe
// a dnes vracajú titulnú stránku (duplicita). Každý slug mapujeme na najbližšiu aktuálnu stránku.
// Zdroj slugov: Google Search Console (sc-domain:e-taxike.sk), stránky s ?post= za posledných 16 mesiacov.

/** Cieľ presmerovania. `localized: true` = ponechať jazykový prefix (/en, /de, /hu), lebo cieľ má jazykové verzie. */
export type LegacyTarget = { path: string; localized?: boolean };

const HOME: LegacyTarget = { path: "/", localized: true };
const CENNIK: LegacyTarget = { path: "/cennik", localized: true };
const FIRMY: LegacyTarget = { path: "/sluzby-pre-firmy" };
const LETISKO_KE: LegacyTarget = { path: "/taxi-letisko-kosice" };

export const LEGACY_POST_MAP: Record<string, LegacyTarget> = {
  // Letiskové a diaľkové trasy -> trasové stránky
  "letiskovy-transfer-budapest-bez-stresu": { path: "/transfer-kosice-budapest" },
  "sprievodca-letiskovym-transferom-budapest": { path: "/transfer-kosice-budapest" },
  "odvoz-na-letisko-krakov-bez-stresu": { path: "/transfer-kosice-krakow" },
  "odvoz-na-letisko-vieden-bez-stresu": { path: "/transfer-kosice-viedna" },
  "odvoz-na-letisko-debrecin-bez-stresu": { path: "/transfer-kosice-debrecin" },
  "odvoz-na-letisko-bratislava-bez-stresu": { path: "/transfer-kosice-bratislava" },
  "kolko-stoji-taxi-na-letisko": LETISKO_KE,
  "ako-vybrat-taxi-na-letisko": LETISKO_KE,
  "taxi-pre-skore-ranne-lety-kosice": LETISKO_KE,
  "sprievodca-transferom-na-skory-let-z-kosic": LETISKO_KE,
  "dialkova-taxi-preprava-kosice-bez-stresu": CENNIK,
  "medzinarodna-taxi-preprava-bez-stresu": CENNIK,

  // Témy, ku ktorým existuje nový článok
  "ako-si-rezervovat-transfer": { path: "/blog/co-pripravit-pred-objednanim-letiskoveho-transferu-z-kosic" },
  "transfer-na-letisko-s-batozinou": { path: "/blog/co-pripravit-pred-objednanim-letiskoveho-transferu-z-kosic" },
  "taxi-pre-rodiny-s-detmi-bez-stresu": { path: "/blog/taxi-s-detskou-sedackou-v-kosiciach-ako-ju-objednat-a-na-co-mysliet" },
  "casova-objednavka-taxi-kosice-bez-stresu": { path: "/blog/ako-si-objednat-taxi-v-kosiciach-na-zajtra-rano-bez-priplatku" },

  // Firmy
  "taxi-pre-firmy-kosice": FIRMY,
  "firemna-taxisluzba-kosice-bez-komplikacii": FIRMY,
  "sprievodca-firemnou-mobilitou-zamestnancov": FIRMY,
  "taxi-na-fakturu-kosice": FIRMY,

  // Ceny
  "taxi-s-platbou-kartou": CENNIK,
  "drink-taxi-kosice-cena": CENNIK,
  "co-ovplyvnuje-cenu-taxi-v-praxi": CENNIK,
  "ako-spoznat-ferove-taxi": CENNIK,

  // Všeobecné témy taxislužby -> titulná stránka (v danom jazyku)
  "nonstop-taxi-kosice": HOME,
  "ekologicke-taxi-kosice": HOME,
  "najlepsie-taxi-kosice-co-rozhoduje": HOME,
  "bezpecny-odvoz-domov-kosice": HOME,
  "taxi-kosice-rychla-bezpecna-preprava": HOME,
  "ako-objednat-taxi-online-bez-zdrzania": HOME,
  "skusenosti-s-nonstop-taxi-sluzbou-v-kosiciach": HOME,
  "ako-funguje-drink-taxi-v-praxi": HOME,
  "ako-zabezpecit-odvoz-po-oslave": HOME,
  "buducnost-ekologickych-taxi-vozidiel-v-praxi": HOME,
};

const LOCALES = ["en", "de", "hu"] as const;
export const CANONICAL_ORIGIN = "https://e-taxike.sk";

/**
 * Vráti absolútnu cieľovú URL pre starú adresu s ?post=, alebo null, ak nejde o starú adresu.
 * @param pathname cesta požiadavky (napr. "/", "/en")
 * @param post hodnota parametra post
 * @param locale jazyk z Next i18n (ak ho middleware pozná), inak sa odvodí z cesty
 */
export function legacyPostRedirect(pathname: string, post: string | null, locale?: string): string | null {
  if (!post) return null;
  const raw = pathname.replace(/\/+$/, "") || "/";
  const fromPath = LOCALES.find((l) => raw === `/${l}`);
  // Staré ?post= adresy existovali len na titulnej stránke (/, /en, /de, /hu).
  if (raw !== "/" && !fromPath) return null;
  const lang = fromPath ?? (locale && (LOCALES as readonly string[]).includes(locale) ? locale : undefined);
  const target = LEGACY_POST_MAP[post.trim().toLowerCase()] ?? HOME;
  const prefix = target.localized && lang ? `/${lang}` : "";
  const path = target.path === "/" && prefix ? prefix : `${prefix}${target.path}`;
  return `${CANONICAL_ORIGIN}${path}`;
}
