// Preklady trasových stránok a rozcestníka (EN/DE/HU/PL). SK verzia je v src/content/routePages.ts a benefits.ts.
import type { LandingFaq } from "@/content/landing";

export const ROUTE_LOCALES = ["en", "de", "hu", "pl"] as const;
export type RouteLocale = (typeof ROUTE_LOCALES)[number];

export type RouteText = {
  navLabel: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  h1: string;
  lead: string;
  distance: string;
  duration: string;
  routeLabel: string;
  /** úvod: prečo individuálny transfer na tejto trase */
  intro: { title: string; paragraphs: string[] };
  /** trasa a čas jazdy */
  route: { title: string; paragraphs: string[] };
  /** vyzdvihnutie, terminál, cieľ */
  pickup: { title: string; paragraphs: string[] };
  /** praktické tipy */
  tips: { title: string; paragraphs: string[] };
  faq: LandingFaq[];
};

export type UiText = {
  home: string;
  orderRide: string;
  orderTransfer: string;
  faqTitle: string;
  relatedTitle: string;
  fullPriceList: string;
  factPrice: string;
  factRoute: string;
  factDistance: string;
  factDuration: string;
  perCar: (price: string) => string;
  /** Formát ceny, napr. €250 / 250 €; from = „od“. */
  price: (amount: string, from?: boolean) => string;
  ctaTitle: (route: string) => string;
  ctaText: (price: string) => string;
  detail: string;
  /** Spoločné odrážky pri vyzdvihnutí. */
  pickupBullets: string[];
};

export type LocaleContent = {
  ui: UiText;
  benefitsTitle: string;
  benefitsLead: string;
  /** Rovnaké poradie ako BENEFITS v benefits.ts (kvôli ikonám). */
  benefits: { title: string; text: string }[];
  orderStepsTitle: string;
  orderSteps: { title: string; text: string }[];
  priceSection: (routeName: string, price: string) => { title: string; paragraphs: string[] };
  commonFaq: (routeName: string, price: string) => LandingFaq[];
  hub: {
    navLabel: string;
    seoTitle: string;
    seoDescription: string;
    keywords: string;
    h1: string;
    lead: string;
    chooseTitle: string;
    note: string;
  };
  routes: Record<string, RouteText>;
};
