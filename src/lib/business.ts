// Overené firemné údaje (Peter, 22. 11. 2026) a záložné Google hodnotenie.
// Hodnotenie overené na Google Maps profile 22. 11. 2026: 4,7 z 5, 153 recenzií.

export const LEGAL_NAME = "E-TAXI Košice s.r.o.";
export const FOUNDING_DATE = "2020-01";
export const FLEET_SIZE = 5;

/** Kancelária – adresa pre zákazníkov (schéma LocalBusiness, päta). */
export const OFFICE_ADDRESS = {
  streetAddress: "Stará prešovská cesta 6",
  postalCode: "040 01",
  addressLocality: "Košice",
  addressRegion: "Košický kraj",
  addressCountry: "SK",
} as const;

/** Fakturačná a korešpondenčná adresa (sídlo). */
export const BILLING_ADDRESS = {
  streetAddress: "Jenisejská 45A",
  postalCode: "040 12",
  addressLocality: "Košice",
  addressRegion: "Košický kraj",
  addressCountry: "SK",
} as const;

export const officeLine = `${OFFICE_ADDRESS.streetAddress}, ${OFFICE_ADDRESS.postalCode} ${OFFICE_ADDRESS.addressLocality}`;
export const billingLine = `${LEGAL_NAME}, ${BILLING_ADDRESS.streetAddress}, ${BILLING_ADDRESS.postalCode} ${BILLING_ADDRESS.addressLocality}`;

/** Google Maps profil firmy (CID). */
export const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=14310856793213865542";

/** Záloha, ak živé hodnotenie z Google Places API nie je k dispozícii. */
export const GOOGLE_RATING_FALLBACK = { rating: 4.7, total: 153, checkedAt: "2026-11-22" } as const;
