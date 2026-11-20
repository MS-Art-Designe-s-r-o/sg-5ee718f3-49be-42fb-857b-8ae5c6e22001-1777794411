export interface BlogSectionContent {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Optional paragraphs rendered after the list */
  after?: string[];
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  intro: string;
  datePublished: string;
  dateModified: string;
  category: string;
  image: string;
  imageAlt: string;
  sections: BlogSectionContent[];
  faq?: BlogFaq[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "objednanie-taxi-kosice-24-7",
    title: "Objednanie taxi v Košiciach 24/7: telefón, online a vopred",
    metaDescription:
      "Ako objednať taxi v Košiciach kedykoľvek: telefonicky na +421 911 606 206 alebo online. Časová objednávka zdarma, platba kartou, cena vopred v aplikácii.",
    excerpt:
      "Taxi v Košiciach si môžete objednať kedykoľvek počas dňa aj noci, telefonicky alebo online. Prehľad možností a tipy, ako ušetriť čas.",
    intro:
      "E-TAXI Košice je dostupné nonstop. Taxi si môžete objednať v pracovný deň ráno, v noci po večeri s priateľmi aj cez víkend. Tu je prehľad, ako to funguje.",
    datePublished: "2026-11-12",
    dateModified: "2026-11-12",
    category: "Objednávka",
    image: "/VW_Kosice.PNG",
    imageAlt: "Vozidlo E-TAXI Košice",
    sections: [
      {
        heading: "Dva spôsoby, ako objednať taxi",
        paragraphs: [
          "Najrýchlejšie je zavolať na dispečing. Dispečing E-TAXI Košice je k dispozícii 24 hodín denne, 7 dní v týždni.",
        ],
        list: [
          "Telefonicky na čísle +421 911 606 206.",
          "Online cez objednávkový formulár na domovskej stránke, kde si zadáte trasu a čas jazdy.",
        ],
      },
      {
        heading: "Objednávka na konkrétny čas",
        paragraphs: [
          "Ak poznáte čas vopred, napríklad ranný odvoz na vlak, letisko alebo na dôležité stretnutie, využite časovú objednávku. Časová objednávka je zdarma, takže za plánovanie vopred nič nepriplácate.",
        ],
      },
      {
        heading: "Cena a platba",
        paragraphs: [
          "Konkrétnu cenu jazdy určuje aplikácia vopred, takže viete, koľko zaplatíte, ešte pred nástupom. Platiť môžete kartou, platba kartou je zdarma. Nie sme platcom DPH.",
          "Orientačné sadzby nájdete v cenníku: štartovné 2 €, jazdné 1,50 € za km a minimálne jazdné 6 €.",
        ],
      },
      {
        heading: "Tipy pre rýchle vybavenie",
        list: [
          "Uveďte presnú adresu nástupu a cieľ cesty.",
          "Pri letiskovej jazde pridajte čas odletu alebo príletu.",
          "Ak cestujete so zvieraťom, spomeňte to pri objednávke, za domáce zviera platí príplatok 2 €.",
          "Pre dlhšie trasy si vyžiadajte cenu vopred.",
        ],
      },
    ],
    faq: [
      {
        question: "Funguje dispečing aj v noci?",
        answer: "Áno, dispečing E-TAXI Košice je dostupný 24/7.",
      },
      {
        question: "Môžem platiť kartou?",
        answer: "Áno, platba kartou je zdarma.",
      },
      {
        question: "Platím niečo navyše za objednávku vopred?",
        answer: "Nie, časová objednávka je zdarma.",
      },
    ],
  },
  {
    slug: "taxi-na-letisko-kosice",
    title: "Taxi na letisko Košice: cena od 15 € a ako objednať",
    metaDescription:
      "Taxi na letisko Košice od 15 € s E-TAXI Košice. Objednávka 24/7 telefonicky alebo online, časová objednávka zdarma, platba kartou. Tipy pre odlet aj prílet.",
    excerpt:
      "Transfer z Košíc na letisko Košice vyjde od 15 €. Čo vedieť pri objednávke a ako si zabezpečiť odvoz na ranný let.",
    intro:
      "Letisko Košice je od centra mesta blízko, no skorý let alebo neskorý prílet sú dôvod nespoliehať sa na náhodu. Taxi si viete zabezpečiť vopred a na čas.",
    datePublished: "2026-11-05",
    dateModified: "2026-11-05",
    category: "Letiská",
    image: "/auta.png",
    imageAlt: "Vozidlá E-TAXI Košice pre transfer na letisko",
    sections: [
      {
        heading: "Cena transferu na letisko Košice",
        paragraphs: [
          "Transfer na letisko Košice z mesta je v našom cenníku od 15 €. Konečnú cenu vám ukáže aplikácia vopred, takže pred jazdou viete, čo zaplatíte.",
        ],
      },
      {
        heading: "Ako objednať odvoz na letisko",
        list: [
          "Zavolajte na dispečing +421 911 606 206, ktorý beží 24/7.",
          "Alebo vyplňte online formulár a zvoľte čas vyzdvihnutia.",
          "Pri skorom lete využite časovú objednávku, je zdarma.",
        ],
        after: [
          "Čas vyzdvihnutia si odhadnite s rezervou. Na odlet myslite na odbavenie a bezpečnostnú kontrolu, ktorých dĺžka závisí od letiska a aerolínie.",
        ],
      },
      {
        heading: "Platba a batožina",
        paragraphs: [
          "Za jazdu môžete zaplatiť kartou bez príplatku. Ak cestujete s veľkou batožinou alebo vo väčšej skupine, napíšte to do objednávky, aby sme vedeli, čo vám pristaviť.",
        ],
      },
      {
        heading: "Ďalšie letiská z Košíc",
        paragraphs: [
          "Okrem Košíc jazdíme aj na letiská v Budapešti, Krakove, Debrecíne, Bratislave, Viedni a Katowiciach. Ceny vybraných transferov nájdete v článku o transferoch do Budapešti, Krakova a Viedne.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi na letisko Košice?",
        answer: "Transfer na letisko Košice je v cenníku od 15 €. Presnú cenu určí aplikácia vopred.",
      },
      {
        question: "Dá sa objednať taxi na skorý ranný let?",
        answer: "Áno. Dispečing funguje 24/7 a časová objednávka je zdarma.",
      },
    ],
  },
  {
    slug: "transfer-kosice-budapest-krakov-viedne",
    title: "Transfer z Košíc do Budapešti, Krakova a Viedne: ceny",
    metaDescription:
      "Letiskové transfery z Košíc: Budapešť 250 €, Krakov 290 €, Bratislava 390 €, Viedeň 450 €. Platba kartou, objednávka 24/7 s E-TAXI Košice.",
    excerpt:
      "Prehľad cien transferov z Košíc na letiská v Budapešti, Krakove, Bratislave a Viedni a tipy na objednanie.",
    intro:
      "Ak letíte z Budapešti, Krakova alebo Viedne, odvoz taxíkom z Košíc je pohodlná alternatíva. Cena je známa vopred a vyzdvihnutie prebehne na adrese, ktorú si zvolíte.",
    datePublished: "2026-10-22",
    dateModified: "2026-10-22",
    category: "Transfery",
    image: "/tesla_Budapest.PNG",
    imageAlt: "Vozidlo E-TAXI Košice na transfer do Budapešti",
    sections: [
      {
        heading: "Ceny transferov z Košíc",
        paragraphs: ["Podľa aktuálneho cenníka platia pre transfery z Košíc tieto ceny:"],
        list: [
          "Letisko Košice: od 15 €",
          "Letisko Budapešť: 250 €",
          "Letisko Krakov: 290 €",
          "Bratislava: 390 €",
          "Viedeň: 450 €",
        ],
        after: [
          "Nie sme platcom DPH. Aktuálne ceny nájdete vždy na stránke s cenníkom.",
        ],
      },
      {
        heading: "Ďalšie smery",
        paragraphs: [
          "Okrem uvedených letísk jazdíme aj do Debrecína a Katowíc. Pri dlhších trasách je možné dohodnúť cenu vopred, napíšte alebo zavolajte nám.",
        ],
      },
      {
        heading: "Ako transfer objednať",
        list: [
          "Zavolajte na +421 911 606 206 (dispečing 24/7).",
          "Alebo použite online formulár a vyberte čas vyzdvihnutia.",
          "Uveďte adresu nástupu, cieľové letisko a čas odletu.",
        ],
        after: [
          "Za jazdu môžete platiť kartou. Časová objednávka je zdarma.",
        ],
      },
      {
        heading: "Prečo transfer taxíkom",
        list: [
          "Odchod z adresy, ktorú si určíte, bez prestupov.",
          "Cena dohodnutá vopred.",
          "Možnosť cestovať so skupinou alebo s batožinou v jednom vozidle.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí transfer z Košíc na letisko Budapešť?",
        answer: "Podľa cenníka 250 €.",
      },
      {
        question: "Koľko stojí transfer z Košíc do Krakova a do Viedne?",
        answer: "Krakov stojí 290 € a Viedeň 450 €.",
      },
    ],
  },
  {
    slug: "drink-taxi-kosice",
    title: "Drink Taxi Košice: bezpečná cesta domov po oslave",
    metaDescription:
      "Drink Taxi od E-TAXI Košice: bezpečná cesta domov po oslave. Cena 2x jazdné, minimálne 20 €. Objednávka 24/7 na +421 911 606 206, platba kartou.",
    excerpt:
      "Drink Taxi je služba pre bezpečný návrat domov po večierku. Cena: dvojnásobné jazdné, minimálne 20 €.",
    intro:
      "Po oslave, firemnej akcii alebo posedení s priateľmi je najlepšie za volant nesadať. Pre takéto situácie ponúkame službu Drink Taxi.",
    datePublished: "2026-09-18",
    dateModified: "2026-09-18",
    category: "Služby",
    image: "/VW_Golf_VII.png",
    imageAlt: "Vozidlo E-TAXI Košice pre službu Drink Taxi",
    sections: [
      {
        heading: "Čo je Drink Taxi",
        paragraphs: [
          "Drink Taxi je naša služba pre bezpečnú cestu domov po oslave. Cieľom je, aby ste sa po alkohole nevracali sami za volantom.",
        ],
      },
      {
        heading: "Cena služby",
        paragraphs: [
          "Podľa cenníka je cena Drink Taxi dvojnásobok jazdného, minimálne 20 €. Ostatné sadzby nájdete v cenníku, napríklad štartovné 2 € a jazdné 1,50 € za km.",
        ],
      },
      {
        heading: "Ako službu objednať",
        list: [
          "Zavolajte na dispečing +421 911 606 206, dostupný 24/7.",
          "Pri objednávke uveďte, že ide o Drink Taxi, a dohodnite podrobnosti.",
          "Zaplatiť môžete kartou, platba kartou je zdarma.",
        ],
      },
      {
        heading: "Tipy pre bezpečný večer",
        list: [
          "Taxi si objednajte skôr, než začne byť neskoro.",
          "Dohodnite sa vopred, kto s kým pôjde domov.",
          "Aj pri bežnej jazde je cena v aplikácii známa vopred.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí Drink Taxi?",
        answer: "Dvojnásobok jazdného, minimálne 20 €.",
      },
      {
        question: "Dá sa objednať aj v noci?",
        answer: "Áno, dispečing je dostupný 24/7.",
      },
    ],
  },
  {
    slug: "kolko-stoji-taxi-kosice",
    title: "Koľko stojí taxi v Košiciach: prehľad cenníka",
    metaDescription:
      "Cenník taxi Košice: štartovné 2 €, jazdné 1,50 €/km, minimálne jazdné 6 €, čakanie 20 €/hod. Platba kartou zdarma. Prehľad poplatkov E-TAXI Košice.",
    excerpt:
      "Štartovné, jazdné, čakanie a ďalšie poplatky v jednom prehľade. Čo platí za jazdu po Košiciach.",
    intro:
      "Pred jazdou chcete vedieť, koľko zaplatíte. Tu je prehľad základných sadzieb E-TAXI Košice. Konkrétnu cenu určuje aplikácia vopred.",
    datePublished: "2026-08-14",
    dateModified: "2026-08-14",
    category: "Ceny",
    image: "/corolla_krakov.PNG",
    imageAlt: "Vozidlo E-TAXI Košice",
    sections: [
      {
        heading: "Základné sadzby",
        list: [
          "Štartovné: 2 €",
          "Jazdné: 1,50 € za km",
          "Štartovné mimo mesto: 0,75 € za km",
          "Minimálne jazdné: 6 €",
          "Čakanie: 20 € za hodinu",
          "Platba kartou: zdarma",
          "Časová objednávka: zdarma",
        ],
      },
      {
        heading: "Ďalšie poplatky",
        list: [
          "Príplatok za domáce zviera: 2 €",
          "Znečistenie vozidla: od 50 €",
          "Znečistenie zvratkami: 150 €",
          "Drink Taxi: dvojnásobok jazdného, minimálne 20 €",
        ],
      },
      {
        heading: "Ako zistiť cenu vopred",
        paragraphs: [
          "Konkrétnu cenu jazdy určuje aplikácia vopred. Pri dlhších trasách je možné dohodnúť pevnú cenu. Nie sme platcom DPH.",
        ],
      },
      {
        heading: "Dlhšie trasy",
        paragraphs: [
          "Pre transfery na letiská platia samostatné ceny, napríklad od 15 € na letisko Košice alebo 250 € do Budapešti. Kompletný zoznam nájdete v cenníku.",
        ],
      },
    ],
    faq: [
      {
        question: "Aké je minimálne jazdné?",
        answer: "Minimálne jazdné je 6 €.",
      },
      {
        question: "Platí sa kartou?",
        answer: "Áno, platba kartou je zdarma.",
      },
    ],
  },
  {
    slug: "firemne-faktury-taxi-kosice",
    title: "Taxi pre firmy v Košiciach: faktúra a platba prevodom",
    metaDescription:
      "Taxi pre firmy v Košiciach: faktúra s platbou prevodom, objednávka 24/7 telefonicky alebo online. E-TAXI Košice pre služobné cesty a transfery hostí.",
    excerpt:
      "Pre firmy vystavujeme faktúry s platbou prevodom. Praktické tipy pre služobné cesty a transfery hostí.",
    intro:
      "Služobné cesty, odvoz hostí alebo transfer na letisko pre kolegov. Taxi pre firmy musí byť spoľahlivé a doklady v poriadku.",
    datePublished: "2026-07-09",
    dateModified: "2026-07-09",
    category: "Firmy",
    image: "/VW_Jetta.png",
    imageAlt: "Vozidlo E-TAXI Košice pre firemné jazdy",
    sections: [
      {
        heading: "Faktúra a platba prevodom",
        paragraphs: [
          "Pre firmy vystavujeme faktúry s platbou prevodom. Podrobnosti o spolupráci si dohodnite s dispečingom na čísle +421 911 606 206 alebo e-mailom na dispecing@e-taxike.sk.",
        ],
      },
      {
        heading: "Na čo firmy taxi využívajú",
        list: [
          "Služobné cesty po Košiciach a okolí.",
          "Transfery hostí a obchodných partnerov na letisko.",
          "Dlhšie trasy do Budapešti, Krakova alebo Viedne s cenou dohodnutou vopred.",
        ],
      },
      {
        heading: "Objednávka a čas",
        paragraphs: [
          "Dispečing funguje 24/7 a časová objednávka je zdarma, takže cestu viete naplánovať s predstihom. Aktuálne sadzby nájdete v cenníku.",
        ],
      },
    ],
    faq: [
      {
        question: "Vystavujete faktúry pre firmy?",
        answer: "Áno, pre firmy vystavujeme faktúry s platbou prevodom.",
      },
      {
        question: "Ako sa s vami skontaktujem?",
        answer: "Telefonicky na +421 911 606 206 alebo e-mailom na dispecing@e-taxike.sk.",
      },
    ],
  },
];

export function getSortedPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}
