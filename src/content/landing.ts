// Obsah landing stránok (iba slovenčina, ako blog). Údaje musia súhlasiť s cenníkom a tabuľkou opráv:
// od 2020, 5 vozidiel, nie sme platcami DPH, štartovné 0,75 €/km, Košice – Katowice 350 €.

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
  sections: { title: string; paragraphs: string[] }[];
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
      "Firemná preprava v Košiciach: pravidelné jazdy, transfery pre hostí a zamestnancov, mesačné vyúčtovanie a objednávanie cez web a mobilnú aplikáciu. Nie sme platcami DPH. 5 vozidiel, dispečing 24/7.",
    keywords: "taxi pre firmy Košice, firemné transfery Košice, firemná preprava, mesačné vyúčtovanie taxi, objednávka taxi cez web",
    h1: "Taxislužba pre firmy v Košiciach",
    lead:
      "E-TAXI Košice jazdí od roku 2020 a dnes zabezpečuje pravidelnú aj jednorazovú prepravu pre firmy, hotely a obchodných partnerov. Jazdy si môžete objednať cez web a mobilnú aplikáciu, fakturujeme prehľadne a mesačne.",
    serviceType: "Firemná taxislužba",
    facts: [
      { label: "Vozový park", value: "5 vozidiel" },
      { label: "Dispečing", value: "24/7" },
      { label: "Štartovné", value: "0,75 € / km" },
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
        title: "Objednávanie cez web a aplikáciu",
        paragraphs: [
          "Jazdu si firma objedná cez online formulár na webe alebo v mobilnej aplikácii E-TAXI (App Store, Google Play). Konkrétnu cenu určuje aplikácia vopred, takže viete, koľko jazda stojí ešte pred odchodom.",
          "Objednávka na konkrétny čas je zdarma, platiť môžete v každom vozidle aj kartou. " + PHONE_NOTE,
        ],
      },
      {
        title: "Prečo firmy volia E-TAXI",
        paragraphs: [
          "Dispečing beží nepretržite, vodiči poznajú Košice a okolie a vozidlá sú klimatizované a udržiavané. Medzi našich partnerov patria hotely a obchodné firmy v Košiciach.",
        ],
      },
    ],
    faq: [
      { question: "Fakturujete firmám mesačne?", answer: "Áno, pre pravidelnú spoluprácu ponúkame mesačné vyúčtovanie. Fakturačné údaje stačí uviesť pri objednávke." },
      { question: "Sú faktúry s DPH?", answer: "Nie. Nie sme platcami DPH, preto faktúry vystavujeme bez DPH." },
      { question: "Dá sa objednať cez web?", answer: "Áno, jazdu môžete objednať cez online formulár na webe alebo cez mobilnú aplikáciu. Cenu určuje aplikácia vopred." },
      { question: "Koľko vozidiel máte?", answer: "Máme 5 vozidiel. Pre väčšie skupiny a skupinové transfery sa odporúča objednať s predstihom." },
    ],
    related: ["taxi-letisko-kosice", "transfer-kosice-katowice", "transfer-kosice-budapest"],
  },
  {
    slug: "taxi-letisko-kosice",
    navLabel: "Taxi na letisko Košice",
    seoTitle: "Taxi na letisko Košice – transfer od 18 € | E-TAXI Košice",
    seoDescription:
      "Taxi z centra Košíc na letisko a späť od 18 €. Objednávka 24/7, cena vopred v aplikácii, platba kartou. E-TAXI Košice – taxislužba od roku 2020.",
    keywords: "taxi letisko Košice, taxi na letisko Košice, transfer letisko Košice, letiskové taxi Košice",
    h1: "Taxi na letisko Košice a späť",
    lead:
      "Letisko Košice je od centra mesta vzdialené len niekoľko kilometrov. S E-TAXI sa na letisko aj z letiska dostanete pohodlne a za dopredu známu cenu od 18 €.",
    serviceType: "Letiskový transfer",
    price: "18",
    priceLabel: "od 18 €",
    facts: [
      { label: "Cena", value: "od 18 €" },
      { label: "Objednávka", value: "24/7, aj na konkrétny čas zdarma" },
      { label: "Platba", value: "kartou aj v hotovosti" },
    ],
    sections: [
      {
        title: "Ranné aj nočné lety",
        paragraphs: [
          "Dispečing pracuje nepretržite, takže taxi môžete objednať aj na skorý ranný odlet alebo nočný prílet. Pri odlete odporúčame objednať deň vopred.",
        ],
      },
      {
        title: "Cena vopred a bez prekvapení",
        paragraphs: [
          "Konečnú cenu určuje aplikácia ešte pred jazdou. Platiť môžete kartou v každom vozidle. " + PHONE_NOTE,
        ],
      },
    ],
    faq: [
      { question: "Koľko stojí taxi na letisko Košice?", answer: "Transfer medzi Košicami a letiskom Košice stojí od 18 €. Presnú cenu určuje aplikácia vopred." },
      { question: "Dá sa objednať aj na skorý ráno?", answer: "Áno, dispečing funguje 24/7. Pri letiskových transferoch odporúčame objednať deň vopred." },
      { question: "Dá sa zaplatiť kartou?", answer: "Áno, v každom našom vozidle môžete platiť kartou zadarmo." },
    ],
    related: ["transfer-kosice-budapest", "transfer-kosice-krakow", "sluzby-pre-firmy"],
  },
  {
    slug: "transfer-kosice-budapest",
    navLabel: "Transfer Košice – Budapešť",
    seoTitle: "Taxi Košice – letisko Budapešť 250 € | Transfer E-TAXI Košice",
    seoDescription:
      "Pohodlný transfer z Košíc na letisko Budapešť za 250 €. Pevná cena, vodič z Košíc, dispečing 24/7, platba kartou. E-TAXI Košice od roku 2020.",
    keywords: "taxi Košice Budapešť, transfer Košice letisko Budapešť, Košice Budapešť taxi cena, letisko Budapešť transfer",
    h1: "Transfer Košice – letisko Budapešť",
    lead:
      "Priama jazda z Košíc na budapeštiansko letisko Ferenc Liszt bez prestupov a čakania. Pevná cena 250 €, ktorú určuje aplikácia vopred.",
    serviceType: "Letiskový transfer",
    price: "250",
    priceLabel: "250 €",
    facts: [
      { label: "Cena", value: "250 €" },
      { label: "Trasa", value: "Košice – letisko Budapešť" },
      { label: "Čas jazdy", value: "približne 3 – 3,5 hod." },
    ],
    sections: [
      {
        title: "Z dverí do dverí",
        paragraphs: [
          "Vyzdvihneme vás na adrese v Košiciach alebo okolí a odvezieme priamo k terminálu. Jazda sa dá plánovať podľa času letu a pri odlete odporúčame objednať deň vopred.",
          "Opačným smerom vás prevezieme z letiska do Košíc. " + PHONE_NOTE,
        ],
      },
      {
        title: "Pre jednotlivcov aj skupiny",
        paragraphs: [
          "Disponujeme kombi a vozidlami s veľkým batožinovým priestorom. Pri väčších skupinách alebo viacerých kufroch to uveďte v objednávke.",
        ],
      },
    ],
    faq: [
      { question: "Koľko stojí transfer Košice – letisko Budapešť?", answer: "Transfer stojí 250 €. Cenu určuje aplikácia vopred a nezahŕňa skryté poplatky." },
      { question: "Dá sa zaplatiť kartou?", answer: "Áno, platiť môžete kartou zadarmo." },
      { question: "Je cena za auto alebo za osobu?", answer: "Cena transferu je za jazdu, nie za osobu." },
    ],
    related: ["transfer-kosice-krakow", "transfer-kosice-katowice", "taxi-letisko-kosice"],
  },
  {
    slug: "transfer-kosice-krakow",
    navLabel: "Transfer Košice – Krakov",
    seoTitle: "Taxi Košice – letisko Krakov 290 € | Transfer E-TAXI Košice",
    seoDescription:
      "Transfer z Košíc na letisko Krakov za 290 €. Pevná cena, nepretržitý dispečing, pohodlné vozidlá a platba kartou. E-TAXI Košice.",
    keywords: "taxi Košice Krakov, transfer Košice Krakov, letisko Krakov transfer, Košice Krakov taxi cena",
    h1: "Transfer Košice – letisko Krakov",
    lead:
      "Cesta z Košíc do Krakova vedie cez Poľsko a trvá niekoľko hodín. S našim transferom si ju skrátite pohodlím a pevnou cenou 290 €.",
    serviceType: "Letiskový transfer",
    price: "290",
    priceLabel: "290 €",
    facts: [
      { label: "Cena", value: "290 €" },
      { label: "Trasa", value: "Košice – letisko Krakov" },
      { label: "Čas jazdy", value: "približne 4 hod." },
    ],
    sections: [
      {
        title: "Priamy transfer do Krakova",
        paragraphs: [
          "Odvezieme vás z Košíc na letisko Krakov alebo do centra mesta. Pre dlhé trasy ponúkame výhodné cenové balíky a pevnú cenu určuje aplikácia vopred.",
          PHONE_NOTE,
        ],
      },
      {
        title: "Plánovanie cesty",
        paragraphs: [
          "Do plánu odletu započítajte čas na hraničný prechod a dopravu. Pri letiskových transferoch odporúčame objednať deň vopred.",
        ],
      },
    ],
    faq: [
      { question: "Koľko stojí taxi Košice – Krakov?", answer: "Transfer Košice – letisko Krakov stojí 290 €." },
      { question: "Jazdíte aj do centra Krakova?", answer: "Áno, odvezieme vás podľa dohody aj mimo letiska. Adresu uveďte pri objednávke." },
    ],
    related: ["transfer-kosice-katowice", "transfer-kosice-budapest", "taxi-letisko-kosice"],
  },
  {
    slug: "transfer-kosice-katowice",
    navLabel: "Transfer Košice – Katowice",
    seoTitle: "Taxi Košice – Katowice 350 € | Transfer E-TAXI Košice",
    seoDescription:
      "Transfer z Košíc do Katowíc (letisko Katowice-Pyrzowice) za 350 €. Pevná cena, 24/7 dispečing, pohodlné vozidlá. E-TAXI Košice od roku 2020.",
    keywords: "taxi Košice Katowice, transfer Košice Katowice, letisko Katowice transfer, Košice Katowice cena",
    h1: "Transfer Košice – Katowice",
    lead:
      "Spoľahlivá preprava z Košíc do Katowíc a na tamojšie letisko. Pevná cena 350 € bez skrytých poplatkov, určená vopred.",
    serviceType: "Diaľkový transfer",
    price: "350",
    priceLabel: "350 €",
    facts: [
      { label: "Cena", value: "350 €" },
      { label: "Trasa", value: "Košice – Katowice" },
      { label: "Objednávka", value: "24/7" },
    ],
    sections: [
      {
        title: "Do Poľska bez prestupov",
        paragraphs: [
          "Katowice sú dôležitým letiskom a priemyselným centrom na juhu Poľska. Z Košíc vás odvezieme priamo na požadovanú adresu alebo k terminálu.",
          PHONE_NOTE,
        ],
      },
      {
        title: "Cesty pre firmy aj jednotlivcov",
        paragraphs: [
          "Trasu využívajú cestujúci aj firmy. Pre firemné jazdy ponúkame mesačné vyúčtovanie, viac na stránke služieb pre firmy.",
        ],
      },
    ],
    faq: [
      { question: "Koľko stojí taxi Košice – Katowice?", answer: "Transfer Košice – Katowice stojí 350 €." },
      { question: "Je v cene DPH?", answer: "Nie sme platcami DPH, cena je konečná." },
    ],
    related: ["transfer-kosice-krakow", "sluzby-pre-firmy", "transfer-kosice-budapest"],
  },
  {
    slug: "transfer-kosice-viedna",
    navLabel: "Transfer Košice – Viedeň",
    seoTitle: "Taxi Košice – Viedeň 450 € | Transfer E-TAXI Košice",
    seoDescription:
      "Transfer z Košíc do Viedne a na letisko Schwechat za 450 €. Pevná cena, dispečing 24/7, platba kartou. E-TAXI Košice.",
    keywords: "taxi Košice Viedeň, transfer Košice Viedeň, letisko Viedeň transfer, Košice Viedeň taxi cena",
    h1: "Transfer Košice – Viedeň",
    lead: "Pohodlný diaľkový transfer z Košíc do Viedne s pevnou cenou 450 €, určenou vopred v aplikácii.",
    serviceType: "Diaľkový transfer",
    price: "450",
    priceLabel: "450 €",
    facts: [
      { label: "Cena", value: "450 €" },
      { label: "Trasa", value: "Košice – Viedeň" },
      { label: "Objednávka", value: "24/7" },
    ],
    sections: [
      {
        title: "Priamo do Viedne",
        paragraphs: [
          "Odvezieme vás z Košíc do centra Viedne alebo na letisko Schwechat. Po trase cez Slovensko nemusíte nič riešiť.",
          PHONE_NOTE,
        ],
      },
    ],
    faq: [
      { question: "Koľko stojí taxi Košice – Viedeň?", answer: "Transfer Košice – Viedeň stojí 450 €." },
      { question: "Kedy objednať?", answer: "Pri dlhých trasách odporúčame objednať aspoň deň vopred." },
    ],
    related: ["transfer-kosice-budapest", "transfer-kosice-katowice", "taxi-letisko-kosice"],
  },
  {
    slug: "transfer-kosice-bratislava",
    navLabel: "Transfer Košice – Bratislava",
    seoTitle: "Taxi Košice – Bratislava 390 € | Transfer E-TAXI Košice",
    seoDescription:
      "Transfer z Košíc do Bratislavy za 390 €. Pevná cena, dispečing 24/7, platba kartou. E-TAXI Košice – taxislužba od roku 2020.",
    keywords: "taxi Košice Bratislava, transfer Košice Bratislava, Košice Bratislava taxi cena",
    h1: "Transfer Košice – Bratislava",
    lead: "Cesta z východu na západ Slovenska bez prestupov. Pevná cena 390 €, určená vopred v aplikácii.",
    serviceType: "Diaľkový transfer",
    price: "390",
    priceLabel: "390 €",
    facts: [
      { label: "Cena", value: "390 €" },
      { label: "Trasa", value: "Košice – Bratislava" },
      { label: "Objednávka", value: "24/7" },
    ],
    sections: [
      {
        title: "Z Košíc do Bratislavy pohodlne",
        paragraphs: [
          "Odvezieme vás na vami zvolenú adresu v Bratislave alebo na letisko. Hodí sa pre firmy aj jednotlivcov. " + PHONE_NOTE,
        ],
      },
    ],
    faq: [
      { question: "Koľko stojí taxi Košice – Bratislava?", answer: "Transfer Košice – Bratislava stojí 390 €." },
      { question: "Môžem platiť kartou?", answer: "Áno, v každom vozidle je možná platba kartou." },
    ],
    related: ["transfer-kosice-viedna", "sluzby-pre-firmy", "taxi-letisko-kosice"],
  },
];

export function getLanding(slug: string): LandingPageData {
  const page = LANDING_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`Neznáma landing stránka: ${slug}`);
  return page;
}
