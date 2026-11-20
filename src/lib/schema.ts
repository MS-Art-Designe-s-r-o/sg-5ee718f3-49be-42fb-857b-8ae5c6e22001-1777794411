import { SITE_URL, SITE_NAME, PHONE, EMAIL } from "@/lib/site";
import { faqItems } from "@/data/faq";
import { pricingData } from "@/data/pricing";

export const ORG_ID = `${SITE_URL}/#organization`;
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const SAME_AS = ["https://facebook.com/etaxikosice", "https://instagram.com/etaxikosice"];
const LOGO = `${SITE_URL}/etaxi_logo_svg.svg`;
const IMAGE = `${SITE_URL}/og-image.png`;

// "250 EUR" -> 250 ; "od 15 EUR" -> 15
function parseEur(price: string): number | null {
  const m = price.match(/(\d+(?:[.,]\d+)?)/);
  return m ? Number(m[1].replace(",", ".")) : null;
}

const strip = (s: string) => s.replace(/^Košice\s*-\s*/, "").replace(/^Letisko\s+/, "");

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO,
    email: EMAIL,
    telephone: PHONE,
    sameAs: SAME_AS,
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "sk-SK",
    publisher: { "@id": ORG_ID },
  };
}

export function localBusinessSchema() {
  const transferOffers = pricingData.transfers.map((t) => {
    const price = parseEur(t.price);
    const isFrom = /^od\s/i.test(t.price);
    return {
      "@type": "Offer",
      priceCurrency: "EUR",
      ...(price !== null && !isFrom ? { price } : {}),
      ...(price !== null && isFrom
        ? { priceSpecification: { "@type": "PriceSpecification", priceCurrency: "EUR", minPrice: price } }
        : {}),
      itemOffered: {
        "@type": "Service",
        name: `Transfer ${t.destination}`,
        serviceType: "Taxi transfer",
        provider: { "@id": BUSINESS_ID },
      },
    };
  });

  return {
    "@type": ["TaxiService", "LocalBusiness"],
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    alternateName: "E-TAXI Košice - Taxislužba",
    description:
      "Profesionálna taxislužba v Košiciach dostupná 24/7. Letiskové transfery Budapešť, Krakov, Viedeň. Online objednávka a platba kartou.",
    url: SITE_URL,
    image: IMAGE,
    logo: LOGO,
    telephone: PHONE,
    email: EMAIL,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card",
    parentOrganization: { "@id": ORG_ID },
    sameAs: SAME_AS,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Košice",
      addressRegion: "Košický kraj",
      addressCountry: "SK",
    },
    geo: { "@type": "GeoCoordinates", latitude: 48.7164, longitude: 21.2611 },
    areaServed: [
      { "@type": "City", name: "Košice" },
      { "@type": "City", name: "Prešov" },
      { "@type": "AdministrativeArea", name: "Košický kraj" },
      { "@type": "Country", name: "Slovensko" },
      { "@type": "Airport", name: "Letisko Budapešť (BUD)" },
      { "@type": "Airport", name: "Letisko Krakov (KRK)" },
      { "@type": "Airport", name: "Letisko Viedeň (VIE)" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      email: EMAIL,
      contactType: "customer service",
      availableLanguage: ["sk", "en"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Taxislužby a transfery",
      itemListElement: [
        {
          "@type": "Offer",
          priceCurrency: "EUR",
          itemOffered: {
            "@type": "Service",
            name: "Mestská taxislužba Košice",
            description: `Štartovné ${pricingData.basicPricing[0].price}, jazdné ${pricingData.basicPricing[2].price}, minimálne jazdné ${pricingData.basicPricing[4].price}. Dostupné 24/7.`,
            provider: { "@id": BUSINESS_ID },
          },
        },
        ...transferOffers,
      ],
    },
    // aggregateRating intentionally omitted: no verifiable review data is displayed on the page.
  };
}

export function faqSchema() {
  return {
    "@type": "FAQPage",
    mainEntity: faqItems.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), websiteSchema(), localBusinessSchema(), faqSchema()],
  };
}

export function pricingGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/cennik#webpage`,
        url: `${SITE_URL}/cennik`,
        name: "Cenník taxislužby E-TAXI Košice",
        inLanguage: "sk-SK",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": BUSINESS_ID },
      },
      {
        "@type": "ItemList",
        name: "Letiskové a diaľkové transfery z Košíc",
        itemListElement: pricingData.transfers.map((t, i) => {
          const price = parseEur(t.price);
          return {
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: `Transfer ${t.destination}`,
              provider: { "@id": BUSINESS_ID },
              areaServed: strip(t.destination),
              offers: {
                "@type": "Offer",
                priceCurrency: "EUR",
                ...(price !== null ? { price } : {}),
              },
            },
          };
        }),
      },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
