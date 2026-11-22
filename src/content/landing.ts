// Obsah landing stránok (iba slovenčina, ako blog). Údaje musia súhlasiť s cenníkom a tabuľkou opráv:
// od 2020, 5 vozidiel, nie sme platcami DPH, štartovné 0,75 €/km, Košice – Katowice 350 €.

import { ROUTE_PAGES } from "@/content/routePages";

export type LandingFaq = { question: string; answer: string };
export type LandingPageData = {
  slug: string;
  navLabel: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  h1: string;
  lead: string;
  serviceType: string;
  price?: string; // číselná hodnota v EUR pre schému
  priceLabel?: string; // text ceny na stránke
  facts: { label: string; value: string }[];
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
  /** Cena sa uvádza na vyžiadanie (nová trasa bez ceny v cenníku). */
  priceOnRequest?: boolean;
  /** IATA kód cieľového letiska (trasové stránky). */
  airportCode?: string;
  /** Názov cieľa pre schému (areaServed). */
  destinationName?: string;
  faq: LandingFaq[];
  related: string[]; // slugy
};

const PHONE_NOTE = "Objednávku prijímame 24/7 na +421 911 606 206 alebo cez online formulár.";

export const LANDING_PAGES: LandingPageData[] = [
  {
    slug: "sluzby-pre-firmy",
    navLabel: "Pre firmy",
    seoTitle: "Taxi pre firmy Košice – firemné transfery a objednávanie cez web | E-TAXI",
    seoDescription:
      "Firemná preprava v Košiciach: pravidelné jazdy, transfery pre hostí a zamestnancov, mesačné vyúčtovanie a objednávanie cez webový formulár Taxximo so sledovaním jázd na mape. Nie sme platcami DPH. 5 vozidiel, dispečing 24/7.",
    keywords: "taxi pre firmy Košice, firemné transfery Košice, firemná preprava, mesačné vyúčtovanie taxi, objednávka taxi cez web",
    h1: "Taxislužba pre firmy v Košiciach",
    lead:
      "E-TAXI Košice jazdí od roku 2020 a dnes zabezpečuje pravidelnú aj jednorazovú prepravu pre firmy, hotely, servisy a ďalších partnerov. Jazdy si objednáte cez webový formulár, kde sledujete aj ich stav, fakturujeme prehľadne a mesačne.",
    serviceType: "Firemná taxislužba",
    facts: [
      { label: "Vozový park", value: "5 vozidiel" },
      { label: "Dispečing", value: "24/7" },
      { label: "Objednávanie", value: "webový formulár Taxximo" },
      { label: "Fakturácia", value: "mesačné vyúčtovanie, bez DPH" },
    ],
    sections: [
      {
        title: "Čo firmám ponúkame",
        paragraphs: [
          "Prepravu zamestnancov na služobné cesty, odvoz hostí z hotela či letiska, pravidelné trasy v rámci Košíc a transfery na letiská v Košiciach, Budapešti, Krakove či vo Viedni. Pre dlhé trasy platia pevné ceny, napríklad Košice – Katowice 350 €.",
          "Pre pravidelnú spoluprácu ponúkame mesačné vyúčtovanie. Faktúry vystavujeme na fakturačné údaje uvedené pri objednávke. Nie sme platcami DPH, preto sú faktúry bez DPH.",
        ],
      },
      {
        title: "Objednávanie cez webový formulár Taxximo",
        paragraphs: [
          "Firmy, hotely, servisy a ďalší partneri môžu používať webový formulár das.taxximo.com (https://das.taxximo.com). Umožňuje zadať objednávku, sledovať jej stav, zobraziť vozidlá na mape a prezerať prehľad už ukončených objednávok.",
          "Objednať môžete aj cez mobilnú aplikáciu E-TAXI (App Store, Google Play). Konkrétnu cenu určuje aplikácia vopred.",
          "Objednávka na konkrétny čas je zdarma, platiť môžete v každom vozidle aj kartou. " + PHONE_NOTE,
        ],
      },
      {
        title: "Prečo firmy volia E-TAXI",
        paragraphs: [
          "Dispečing beží nepretržite, vodiči poznajú Košice a okolie a vozidlá sú klimatizované a udržiavané. Formulár využijú firmy, hotely, servisy aj ďalší partneri.",
        ],
      },
    ],
    faq: [
      { question: "Fakturujete firmám mesačne?", answer: "Áno, pre pravidelnú spoluprácu ponúkame mesačné vyúčtovanie. Fakturačné údaje stačí uviesť pri objednávke." },
      { question: "Sú faktúry s DPH?", answer: "Nie. Nie sme platcami DPH, preto faktúry vystavujeme bez DPH." },
      { question: "Dá sa objednať cez web?", answer: "Áno, cez webový formulár das.taxximo.com môžete zadať objednávku, sledovať jej stav, vidieť vozidlá na mape a prezerať ukončené objednávky. Je vhodný pre firmy, hotely, servisy a ďalších partnerov." },
      { question: "Koľko vozidiel máte?", answer: "Máme 5 vozidiel. Pre väčšie skupiny a skupinové transfery sa odporúča objednať s predstihom." },
    ],
    related: ["taxi-letisko-kosice", "transfer-kosice-katowice", "transfer-kosice-budapest"],
  },
  ...ROUTE_PAGES,
];

export function getLanding(slug: string): LandingPageData {
  const page = LANDING_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`Neznáma landing stránka: ${slug}`);
  return page;
}
