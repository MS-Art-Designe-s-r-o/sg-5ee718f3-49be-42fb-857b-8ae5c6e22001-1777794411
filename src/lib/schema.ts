// Centrálne JSON-LD schémy (schema.org). Údaje musia súhlasiť s textami na webe.
import { SITE_URL } from "@/locales";

export const BUSINESS = {
  name: "E-TAXI Košice",
  phone: "+421911606206",
  email: "dispecing@e-taxike.sk",
  foundingDate: "2020",
  fleetSize: 5,
  startingFeePerKm: "0.75",
  currency: "EUR",
} as const;

export const BUSINESS_ID = `${SITE_URL}/#organization`;

export const AREA_SERVED = [
  { "@type": "City", name: "Košice" },
  { "@type": "City", name: "Prešov" },
  { "@type": "AdministrativeArea", name: "Košický kraj" },
];

/** TaxiService / LocalBusiness pre homepage. */
export function taxiServiceSchema(description: string, offers: { name: string; description: string }[], offerCatalogName: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["TaxiService", "LocalBusiness"],
    "@id": BUSINESS_ID,
    name: BUSINESS.name,
    alternateName: "E-TAXI Košice - Taxislužba",
    description,
    image: `${SITE_URL}/og-image.png`,
    logo: `${SITE_URL}/etaxi_logo_svg.svg`,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    url: SITE_URL,
    foundingDate: BUSINESS.foundingDate,
    sameAs: ["https://www.facebook.com/Etaxike"],
    priceRange: "€€",
    paymentAccepted: "Cash, Credit Card",
    currenciesAccepted: BUSINESS.currency,
    address: { "@type": "PostalAddress", addressLocality: "Košice", addressRegion: "Košický kraj", addressCountry: "SK" },
    geo: { "@type": "GeoCoordinates", latitude: "48.7164", longitude: "21.2611" },
    areaServed: AREA_SERVED,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: offerCatalogName,
      itemListElement: offers.map((o) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: o.name, description: o.description },
      })),
    },
  };
}

/** Kompaktný uzol firmy pre podstránky (rovnaké @id ako na homepage). */
export function businessNodeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["TaxiService", "LocalBusiness"],
    "@id": BUSINESS_ID,
    name: BUSINESS.name,
    url: SITE_URL,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    image: `${SITE_URL}/og-image.png`,
    priceRange: "€€",
    paymentAccepted: "Cash, Credit Card, Invoice",
    address: { "@type": "PostalAddress", addressLocality: "Košice", addressRegion: "Košický kraj", addressCountry: "SK" },
    geo: { "@type": "GeoCoordinates", latitude: "48.7164", longitude: "21.2611" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  price?: string;
  areaServed?: string[];
  /** Cieľové letisko (IATA) trasovej stránky. */
  airport?: { iataCode: string; name: string };
  inLanguage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType,
    provider: { "@id": BUSINESS_ID },
    areaServed: [
      ...(opts.areaServed ?? ["Košice"]).map((n) => ({ "@type": "Place", name: n })),
      ...(opts.airport ? [{ "@type": "Airport", name: opts.airport.name, iataCode: opts.airport.iataCode }] : []),
    ],
    ...(opts.inLanguage ? { inLanguage: opts.inLanguage } : {}),
    ...(opts.price
      ? { offers: { "@type": "Offer", price: opts.price, priceCurrency: BUSINESS.currency, url: opts.url, availability: "https://schema.org/InStock" } }
      : {}),
  };
}

export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
