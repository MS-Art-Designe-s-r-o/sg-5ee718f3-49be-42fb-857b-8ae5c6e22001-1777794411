export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const faqData = {
  title: "Často kladené otázky",
  subtitle: "Odpovede na najčastejšie otázky o našich službách",
};

export const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "Ako rýchlo príde taxík po objednávke?",
    answer: "Štandardne pristavíme vozidlo do 10 minút od telefonickej objednávky. Pri online objednávkach závisí od zvoleného času vyzdvihnutia. V prípade veľkého dopytu v špičke môže čas mierne narásť, vždy vás však budeme informovať.",
    category: "objednávka"
  },
  {
    id: "2",
    question: "Aké sú spôsoby platby?",
    answer: "Akceptujeme hotovosť, platobné karty (Visa, Mastercard), Google Pay, Apple Pay a bankový prevod pre firemných klientov. Pri dlhších trasách odporúčame dohodnúť sa na spôsobe platby vopred.",
    category: "platba"
  },
  {
    id: "3",
    question: "Môžem objednať taxík vopred?",
    answer: "Áno! Objednávky vopred prijímame telefonicky na +421 911 606 206 alebo cez náš online formulár. Odporúčame objednávať minimálne 2 hodiny vopred, pri letiskových transferoch ideálne deň vopred.",
    category: "objednávka"
  },
  {
    id: "4",
    question: "Poskytujete detské sedačky?",
    answer: "Áno, detské sedačky poskytujeme bezplatne. Je potrebné to uviesť pri objednávke, aby sme zabezpečili vozidlo s potrebným vybavením. Máme k dispozícii sedačky pre rôzne vekové kategórie.",
    category: "služby"
  },
  {
    id: "5",
    question: "Jazdíte aj mimo Košíc?",
    answer: "Samozrejme! Poskytujeme transfery po celom Slovensku aj do zahraničia. Pravidelne jazdíme na letiská (Košice, Budapešť, Krakov), do Prahy, Viedne a ďalších miest. Pre dlhé trasy ponúkame výhodné cenové balíky.",
    category: "služby"
  },
  {
    id: "6",
    question: "Ako sa počíta cena jazdy?",
    answer: "Cena sa skladá z: nástupného poplatku (3€), kilometrovej sadzby (1,20€/km v meste, 0,90€/km mimo mesta) a prípadných prirážok (nočná, víkendová, batožina). Pre presný odhad použite náš online formulár alebo zavolajte.",
    category: "platba"
  },
  {
    id: "7",
    question: "Sú všetky vozidlá klimatizované?",
    answer: "Áno, celý náš vozový park je vybavený klimatizáciou a WiFi pripojením. Vozidlá sú pravidelne čistené a udržiavané v perfektnom stave pre váš komfort.",
    category: "vozidlá"
  },
  {
    id: "8",
    question: "Môžem zrušiť alebo zmeniť objednávku?",
    answer: "Áno, objednávku môžete zrušiť alebo zmeniť kedykoľvek telefonicky na +421 911 606 206. Pri zrušení menej ako 30 minút pred plánovaným vyzdvihnutím môže byť účtovaný manipulačný poplatok 5€.",
    category: "objednávka"
  },
  {
    id: "9",
    question: "Poskytujete faktúry pre firmy?",
    answer: "Áno, pre firemných klientov vystavujeme faktúry s DPH, ponúkame mesačné vyúčtovanie a platbu bankovým prevodom. Firmy môžu využívať aj vlastnú webovú aplikáciu na zadávanie objednávok a prehľad zrealizovaných jázd. Viac na stránke Služby pre firmy.",
    category: "platba"
  },
  {
    id: "10",
    question: "Koľko batožiny sa zmestí do vozidla?",
    answer: "Štandardné vozidlá (sedan) pojmú 2-3 kusy veľkej batožiny + príručnú batožinu. Pre väčšie skupiny alebo viac batožiny odporúčame kombi alebo van, ktoré pojmú až 6-8 kufrov.",
    category: "vozidlá"
  },
  {
    id: "11",
    question: "Majú firmy vlastnú webovú aplikáciu na objednávanie taxi?",
    answer: "Áno. Firemní klienti E-TAXI Košice dostanú samostatnú webovú aplikáciu, v ktorej zadávajú svoje objednávky a majú v nej prehľad zrealizovaných objednávok. Pre prístup nás kontaktujte na dispecing@e-taxike.sk alebo na +421 911 606 206.",
    category: "služby"
  }
];
