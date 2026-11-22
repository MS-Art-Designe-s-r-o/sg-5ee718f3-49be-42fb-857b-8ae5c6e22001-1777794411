// Slovenský slovník — referenčný jazyk webu.
// Typ Dictionary sa odvodzuje z tohto súboru; každý ďalší jazyk (en.ts, de.ts, ...)
// musí obsahovať rovnakú štruktúru, inak TypeScript ohlási chybu.

export const sk = {
  langShort: "SK",
  langName: "Slovenčina",
  htmlLang: "sk",
  ogLocale: "sk_SK",
  metaLanguage: "Slovak",
  dateLocale: "sk-SK",

  common: {
    logoAlt: "E-TAXI Košice – logo taxislužby",
    phone: "+421 911 606 206",
    phoneHref: "tel:+421911606206",
    email: "dispecing@e-taxike.sk",
    call: "Zavolať",
    callNow: "Zavolať teraz",
    callPhone: "Zavolať +421 911 606 206",
    orderNow: "Objednať teraz",
    orderRideNow: "Objednať jazdu teraz",
    dispatch: "Dispečing 24/7",
  },

  seo: {
    home: {
      title: "E-TAXI Košice | Taxislužba 24/7 | Transfery Budapešť, Debrecín, Krakov, Viedeň",
      description:
        "Profesionálna taxislužba v Košiciach dostupná 24/7 ✓ Letiskové transfery Budapešť, Debrecín, Krakov, Viedeň ✓ Online objednávka ✓ Moderné vozidlá ✓ Dispečing +421 911 606 206",
      keywords:
        "taxi Košice, taxislužba Košice, taxi služba Košice, transfer letisko Budapešť, transfer Budapešť Košice, letiskový transfer Budapešť, transfer Krakov, transfer Viedeň, taxi na letisko, letiskové transfery, taxi 24/7 Košice, dispečing taxi Košice, objednať taxi Košice, expresný transfer letisko, medzinárodné transfery Košice, transfer Debrecín, taxi Košice Debrecín",
    },
    pricing: {
      title: "Cenník taxislužby | E-TAXI Košice | Ceny za km a transfery na letisko",
      description:
        "Aktuálny cenník E-TAXI Košice ✓ Mestská taxislužba od 1,50€/km ✓ Transfer Budapešť 250€ ✓ Transfer Krakov 290€ ✓ Transfer Viedeň 450€ ✓ Transparentné ceny bez skrytých poplatkov",
      keywords:
        "cenník taxi Košice, ceny taxi Košice, cena transfer letisko, taxi cena za km Košice, letiskový transfer cena",
    },
    terms: {
      title: "Prepravný poriadok | Podmienky prepravy | E-TAXI Košice",
      description:
        "Prepravný poriadok E-TAXI Košice. Práva a povinnosti cestujúcich, podmienky prepravy, pravidlá zrušenia objednávky a reklamačný poriadok taxislužby v Košiciach.",
      keywords:
        "prepravný poriadok taxi, podmienky prepravy taxi Košice, pravidlá taxi Košice, práva cestujúcich, reklamácia taxi, zrušenie objednávky taxi",
    },
    privacy: {
      title: "Ochrana osobných údajov | GDPR | E-TAXI Košice",
      description:
        "Zásady ochrany osobných údajov E-TAXI Košice v súlade s GDPR. Informácie o spracúvaní cookies, marketingových údajov a vašich právach podľa nariadenia GDPR.",
      keywords:
        "ochrana osobných údajov, GDPR, cookies, spracúvanie údajov, práva subjektov údajov, Google Analytics, súhlas so spracovaním údajov",
    },
  },

  jsonLd: {
    description:
      "Profesionálna taxislužba v Košiciach dostupná 24/7. Letiskové transfery Budapešť, Debrecín, Krakov, Viedeň. Online objednávka a okamžité potvrdenie.",
    offerCatalogName: "Taxislužby a transfery",
    offers: [
      {
        name: "Mestská taxislužba Košice",
        description: "Rýchla a spoľahlivá taxislužba v Košiciach a okolí dostupná 24/7",
      },
      {
        name: "Transfer na letisko Budapešť",
        description: "Expresný transfer z Košíc na letisko Budapešť za 250 EUR",
      },
      {
        name: "Transfer na letisko Krakov",
        description: "Pohodlný transfer z Košíc na letisko Krakov za 290 EUR",
      },
      {
        name: "Transfer na letisko Viedeň",
        description: "Profesionálny transfer z Košíc na letisko Viedeň za 450 EUR",
      },
    ],
  },

  header: {
    menu: [
      {
        label: "Taxislužba",
        children: [
          { label: "O nás", href: "/#o-nas" },
          { label: "Vozový park", href: "/#vozovy-park" },
          { label: "Recenzie", href: "/#recenzie" },
        ],
      },
      {
        label: "Ponuka",
        children: [
          { label: "Služby", href: "/#sluzby" },
          { label: "Cenník", href: "/cennik" },
          { label: "Pre firmy", href: "/sluzby-pre-firmy" },
          { label: "Letiskové transfery", href: "/letiskove-transfery" },
        ],
      },
      { label: "FAQ", href: "/#faq" },
      { label: "Blog", href: "/#blog" },
    ],
    app: "Aplikácia",
    downloadApp: "Stiahnuť aplikáciu",
  },

  hero: {
    imageAlt: "Taxi Košice – E-TAXI Košice, taxislužba 24/7",
    titlePrefix: "E-TAXI Košice –",
    word1: "rýchlo",
    word2: "spoľahlivo",
    word3: "pohodlne",
    subtitleBeforePhone: "Zavolajte na ",
    subtitleAfterPhone: " a auto bude pri vás do 10 minút.",
    subtitleLine2: "Letiská, dlhé trasy, firemné transfery – vždy načas.",
  },

  appSection: {
    title: "Rýchlejšie cez aplikáciu",
    text: "Stiahnite si našu mobilnú aplikáciu a objednávajte taxík ešte jednoduchšie. Sledujte polohu vodiča v reálnom čase a cenu vidíte ešte pred objednávkou.",
    downloadOn: "Stiahnuť na",
    availableOn: "Dostupné na",
  },

  services: {
    title: "Naše služby",
    businessLink: "Viac o službách pre firmy →",
    items: [
      {
        title: "Okamžitá preprava",
        description: "Zavolajte nám a taxík je u vás do niekoľkých minút. Dostupní 24/7.",
      },
      {
        title: "Časové objednávky",
        description: "Naplánujte si cestu vopred. 0€ príplatok za včasnú objednávku.",
      },
      {
        title: "Drink Taxi",
        description: "Bezpečná cesta domov po oslave. Váš vodič aj váš alkohol v bezpečí.",
      },
      {
        title: "Letisková preprava",
        description: "Budapest, Krakov, Debrecín, Bratislava, Viedeň, Katowice - pohodlne a za férové ceny.",
      },
      {
        title: "Platba kartou",
        description: "V každom našom vozidle môžete platiť kartou. Žiadne starosti s hotovosťou.",
      },
      {
        title: "Hotely a firmy",
        description: "Online webobjednávka, prehľad uskutočnených jázd a platba na faktúru. Pre hotely, firmy aj servisy.",
      },
    ],
  },

  fleet: {
    title: "Náš vozový park",
    subtitle: "Moderné a udržiavané vozidlá pre váš komfort a bezpečnosť",
    filterAll: "Všetky vozidlá",
    filterEco: "Ekologické",
    ecoBadge: "Ekologické",
    capacityLabel: "Kapacita:",
    capacityUnit: "osoby",
    note: "Celkovo 5 vozidiel k dispozícii, všetky klimatizované, čisté a v dobrom technickom stave",
    vehicles: [
      {
        id: "1",
        name: "Tesla Model S",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Klimatizácia" },
          { icon: "zap", label: "Elektrické" },
        ],
        image: "/tesla_model_s_letisko_kosice.webp",
        imageAlt: "Tesla Model S – elektrické taxi E-TAXI Košice pred letiskom Košice, letiskový transfer",
        description: "Prémiový elektrický sedan – tichá a plynulá jazda, ideálna na letiskové transfery a firemné jazdy",
      },
      {
        id: "2",
        name: "Toyota Corolla",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Klimatizácia" },
          { icon: "baby", label: "Detská sedačka" },
        ],
        image: "/corolla_krakov.PNG",
        imageAlt: "Toyota Corolla – taxi E-TAXI Košice, úsporný sedan pre mestskú dopravu aj transfery",
        description: "Spoľahlivý sedan s nízkou spotrebou",
      },
      {
        id: "3",
        name: "Tesla Model 3",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Klimatizácia" },
          { icon: "zap", label: "Elektrické" },
        ],
        image: "/tesla_Budapest.PNG",
        imageAlt: "Tesla Model 3 – elektrické taxi v Košiciach, transfery Košice – Budapešť",
        description: "Prémiové elektrické vozidlo",
      },
      {
        id: "4",
        name: "VW Golf VII Variant",
        type: "kombi",
        capacity: 4,
        isEco: false,
        features: [{ icon: "wind", label: "Klimatizácia" }],
        image: "/VW_Golf_VII.png",
        imageAlt: "VW Golf VII Variant – kombi taxi v Košiciach pre mestskú a medzimestskú dopravu",
        description: "Komfortné kombi pre mestskú aj medzimestkú dopravu",
      },
      {
        id: "5",
        name: "Škoda Superb III Combi",
        type: "kombi",
        capacity: 4,
        isEco: false,
        features: [
          { icon: "wind", label: "Klimatizácia" },
          { icon: "baby", label: "Detská sedačka" },
        ],
        image: "/skoda_superb_combi_hotel.webp",
        imageAlt: "Škoda Superb III Combi – taxi pred hotelom DoubleTree by Hilton Košice, hotelové a firemné transfery",
        description: "Priestranné kombi s veľkým batožinovým priestorom pre hotelových hostí, firmy a dlhšie trasy",
      },
    ],
  },

  pricing: {
    title: "Cenník",
    subtitle: "Transparentné ceny bez skrytých poplatkov",
    note: "Konkrétnu cenu určuje aplikácia vopred",
    basicTitle: "Základný cenník",
    transfersTitle: "Letiskové a diaľkové transfery",
    transfersTitleShort: "Letiskové transfery",
    basicPricing: [
      { label: "Štartovné", price: "2 €" },
      { label: "Štartovné mimo centrum mesta", price: "0,75 € / km" },
      { label: "Jazdné", price: "1,50 € / km" },
      { label: "Čakanie", price: "20 € / hod" },
      { label: "Minimálne jazdné", price: "6 €" },
      { label: "Znečistenie vozidla", price: "od 50 €" },
      { label: "Znečistenie zvratkami", price: "150 €" },
      { label: "Príplatok za domáce zviera", price: "2 €" },
      { label: "Platba kartou", price: "zdarma" },
      { label: "Časová objednávka", price: "zdarma" },
      { label: "DRINK Taxi", price: "2x jazdné, min. 20€" },
    ],
    transfers: [
      { destination: "Košice - Letisko Košice", price: "od 18 EUR" },
      { destination: "Košice - Letisko Budapešť", price: "250 EUR" },
      { destination: "Košice - Letisko Krakov", price: "290 EUR" },
      { destination: "Košice - Debrecín", price: "220 EUR" },
      { destination: "Košice - Bratislava", price: "390 EUR" },
      { destination: "Košice - Viedeň", price: "450 EUR" },
      { destination: "Košice - Katowice", price: "350 EUR" },
      { destination: "Košice - Letisko Rzeszów", price: "270 EUR" },
      { destination: "Košice - Letisko Poprad-Tatry", price: "170 EUR" },
    ],
    cta: {
      title: "Chcete si objednať jazdu?",
      text: "Kontaktujte nás telefonicky alebo vyplňte online formulár",
    },
  },

  about: {
    title: "O nás",
    subtitle: "Profesionálna taxislužba v Košiciach od roku 2020",
    description:
      "E-TAXI Košice je moderná taxislužba, ktorá sa zameriava na spokojnosť zákazníkov, spoľahlivosť a ekologickú prepravu. Naším cieľom je poskytovať bezpečné, pohodlné a cenovo dostupné prepravné služby pre obyvateľov a návštevníkov Košíc.",
    stats: [
      { value: "5", label: "Vozidiel" },
      { value: "6+", label: "Rokov na trhu" },
      { value: "15000+", label: "Spokojných zákazníkov" },
      { value: "24/7", label: "Dispečing" },
    ],
    values: [
      {
        title: "Spoľahlivosť",
        description: "Vždy načas, bez čakania. Naši vodiči sú profesionáli s dlhoročnými skúsenosťami.",
        icon: "Shield",
      },
      {
        title: "Ekológia",
        description: "Investujeme do ekologických vozidiel - Tesla, plug-in hybridy a vozidlá s nízkymi emisiami.",
        icon: "Leaf",
      },
      {
        title: "Bezpečnosť",
        description: "GPS sledovanie, kamerové systémy a pravidelné kontroly vozidiel pre vašu bezpečnosť.",
        icon: "ShieldCheck",
      },
      {
        title: "Transparentnosť",
        description: "Jasný cenník, bez skrytých poplatkov. Cenu môžete vidieť vopred v online objednávke.",
        icon: "Eye",
      },
      {
        title: "Inovácie",
        description: "Digitálny dispečing, SMS a hlasové notifikácie o stave objednávky, sledovanie vozidla na mape, mobilná aplikácia a webobjednávka pre firmy a hotely.",
        icon: "Lightbulb",
      },
      {
        title: "Profesionalita",
        description: "Skúsení vodiči, pravidelne čistené a udržiavané vozidlá, platba kartou v každom vozidle, faktúry a mesačné vyúčtovanie pre firmy, dispečing 24/7.",
        icon: "Award",
      },
    ],
    cta: {
      title: "Potrebujete taxík práve teraz?",
      text: "Zavolajte nám alebo objednajte online",
    },
  },

  partners: {
    partnerAlt: "partner E-TAXI Košice",
    title: "Spolupracujeme a referencie",
    subtitle:
      "Za roky spoľahlivých jazd je pre nás najcennejšia dôvera košických firiem. Kliknutím na partnera sa otvorí jeho stránka v novom okne.",
    partners: [
      {
        name: "Boutique Hotel Golden",
        type: "Hotel **** & apartmány",
        address: "Bajzova 4, 040 01 Košice",
        website: "https://www.hotelgolden.sk/",
        phone: "+421 55 221 11 00",
        email: "reception@goldenapartments.sk",
        logo: "/partners/boutique-hotel-golden.png",
      },
      {
        name: "Metro",
        type: "Velkoobchod",
        address: "Americká trieda 2828/1A, 040 13 Košice",
        website: "https://www.metro.sk/",
        phone: "0850 123 223",
        email: "info@metro.sk",
        logo: "/partners/metro.png",
      },
      {
        name: "Hotel Dália",
        type: "Certifikovaný eco-hotel",
        address: "Löfflerova 1, 040 01 Košice",
        website: "https://hoteldalia.sk",
        phone: "+421 55 799 43 21",
        email: "welcome@hoteldalia.sk",
        logo: "/partners/hotel-dalia.png",
      },
      {
        name: "MS Art Autokomplex",
        type: "Autoslúžby & zmluvný servis",
        address: "Bajzova 4, 040 01 Košice",
        website: "https://msart.sk",
        phone: "+421 915 770 100",
        email: "info@msart.sk",
        logo: "/partners/ms-art.png",
      },
    ],
    openInNewTab: "Otvorí sa v novom okne",
    visitSite: "Navštíviť stránku",
    ctaText: "Vaša firma chce jazdiť s nami?",
    ctaButton: "Kontaktujte nás",
  },

  blogSection: {
    title: "Blog a novinky",
    subtitle: "Aktuality, tipy a zaujímavosti zo sveta taxislužieb a mobility",
  },

  reviews: {
    reviewAlt: "recenzia zákazníka E-TAXI Košice",
    title: "Recenzie zákazníkov",
    subtitle: "Prečítajte si, čo hovoria naši spokojní zákazníci",
    countSuffix: "recenzií",
    seeAllOnGoogle: "Zobraziť všetky recenzie na Google",
    readAllPrefix: "Prečítajte si",
    readAllSuffix: "recenzií od našich spokojných zákazníkov",
    items: [
      {
        id: "1",
        name: "Pavol Horváth",
        rating: 5,
        date: "pred 8 mesiacmi",
        text: "dakujem sofer neviem ako sa vola viezol ma na krasnom pasate za prijemny pokec a ochotu,to sa uz dnes tak casto nevidi.",
        service: "Mestská jazda",
      },
      {
        id: "2",
        name: "Diana Švarcová",
        rating: 5,
        date: "pred 3 rokmi",
        text: "Naozaj veľmi príjemná cesta šofér pozorný, slušný a neskutočne milý pre ďalšiu cestu v KE budem jednoznačne využívať túto taxislužbu. 💯 Mladý pán ak toto čítate kľudne sa ozvite a pozývam na kávu ☕",
        service: "Firemný transfer",
      },
      {
        id: "3",
        name: "Q Q",
        rating: 5,
        date: "pred 2 mesiacmi",
        text: "Ďakujeme za rýchly prístup spoločnosti.Vrelo odporúčam.Spokojnosť 🙂",
        service: "Mestská jazda",
      },
      {
        id: "4",
        name: "Katarína M.",
        rating: 5,
        date: "2026-03-28",
        text: "Potrebovala som odvoz na letisko včasráno. Vodič bol presný a cesta prebehla v pohode. Ďakujem!",
        service: "Transfer na letisko",
      },
      {
        id: "5",
        name: "Martin S.",
        rating: 4,
        date: "2026-03-20",
        text: "Dobrá služba, čisté vozidlá. Malé meškanie, ale vodič ma upozornil vopred. Celkovo spokojnosť.",
        service: "Mestská jazda",
      },
      {
        id: "6",
        name: "Lucia H.",
        rating: 5,
        date: "2026-03-15",
        text: "Výborný servis! Objednala som online, všetko prebehlo hladko. Odporúčam pre každého, kto potrebuje spoľahlivú prepravu.",
        service: "Firemný transfer",
      },
    ],
  },

  faq: {
    title: "Často kladené otázky",
    subtitle: "Odpovede na najčastejšie otázky o našich službách",
    noAnswer: "Nenašli ste odpoveď na vašu otázku?",
    callUs: "Zavolajte nám +421 911 606 206",
    items: [
      {
        id: "1",
        question: "Ako rýchlo príde taxík po objednávke?",
        answer:
          "Štandardne pristavíme vozidlo do 10 minút od telefonickej objednávky. Pri online objednávkach závisí od zvoleného času vyzdvihnutia. V prípade veľkého dopytu v špičke môže čas mierne narásť, vždy vás však budeme informovať.",
      },
      {
        id: "2",
        question: "Aké sú spôsoby platby?",
        answer:
          "Akceptujeme hotovosť, platobné karty (Visa, Mastercard), Google Pay, Apple Pay a bankový prevod pre firemných klientov. Pri dlhších trasách odporúčame dohodnúť sa na spôsobe platby vopred.",
      },
      {
        id: "3",
        question: "Môžem objednať taxík vopred?",
        answer:
          "Áno! Objednávky vopred prijímame telefonicky na +421 911 606 206 alebo cez náš online formulár. Odporúčame objednávať minimálne 2 hodiny vopred, pri letiskových transferoch ideálne deň vopred.",
      },
      {
        id: "4",
        question: "Poskytujete detské sedačky?",
        answer:
          "Áno, detské sedačky poskytujeme bezplatne. Je potrebné to uviesť pri objednávke, aby sme zabezpečili vozidlo s potrebným vybavením. Máme k dispozícii sedačky pre rôzne vekové kategórie.",
      },
      {
        id: "5",
        question: "Jazdíte aj mimo Košíc?",
        answer:
          "Samozrejme! Poskytujeme transfery po celom Slovensku aj do zahraničia. Pravidelne jazdíme na letiská (Košice, Budapešť, Krakov), do Prahy, Viedne a ďalších miest. Pre dlhé trasy ponúkame výhodné cenové balíky.",
      },
      {
        id: "6",
        question: "Ako sa počíta cena jazdy?",
        answer:
          "Cena sa skladá z: štartovného (2 €; pri jazde mimo mesta sa pripočítava 0,75 €/km k štartu alebo cieľu podľa toho, čo je bližšie), kilometrovej sadzby (1,50 €/km) a prípadných prirážok (nočná, víkendová, batožina). Pre presný odhad použite náš online formulár alebo zavolajte.",
      },
      {
        id: "7",
        question: "Sú všetky vozidlá klimatizované?",
        answer:
          "Áno, celý náš vozový park je vybavený klimatizáciou a WiFi pripojením. Vozidlá sú pravidelne čistené a udržiavané v perfektnom stave pre váš komfort.",
      },
      {
        id: "8",
        question: "Môžem zrušiť alebo zmeniť objednávku?",
        answer:
          "Áno, objednávku môžete zrušiť alebo zmeniť kedykoľvek telefonicky na +421 911 606 206. Pri zrušení menej ako 30 minút pred plánovaným vyzdvihnutím môže byť účtovaný manipulačný poplatok 5€.",
      },
      {
        id: "9",
        question: "Poskytujete faktúry pre firmy?",
        answer:
          "Áno, pre firemných klientov vystavujeme faktúry (nie sme platcami DPH, preto sú vystavené bez DPH). Pri objednávke stačí uviesť fakturačné údaje. Ponúkame aj mesačné vyúčtovanie pre pravidelnú spoluprácu.",
      },
      {
        id: "10",
        question: "Koľko batožiny sa zmestí do vozidla?",
        answer:
          "Štandardné vozidlá (sedan) pojmú 2-3 kusy veľkej batožiny + príručnú batožinu. Pre väčšie skupiny alebo viac batožiny odporúčame kombi alebo van, ktoré pojmú až 6-8 kufrov.",
      },
    ],
  },

  bookingSection: {
    title: "Objednať prepravu",
    textBeforePhone: "Vyplňte formulár a my sa vám ozveme. Alebo nám rovno zavolajte na ",
    noticeAdvance:
      "Formulár používajte len na objednávky, ktoré plánujete s časovým odstupom aspoň 6 hodín, aby sme ich určite stihli spracovať. Ak potrebujete odvoz hneď alebo v kratšom čase, zavolajte na dispečing alebo objednajte cez aplikáciu E-TAXI Košice.",
  },

  bookingForm: {
    heading: "Objednať taxík online",
    from: "Odkiaľ",
    fromPlaceholder: "Napr. Hlavná 1, Košice",
    to: "Kam",
    toPlaceholder: "Napr. Letisko Košice",
    when: "Kedy",
    phone: "Telefón",
    phonePlaceholder: "+421 XXX XXX XXX",
    email: "Email",
    emailPlaceholder: "vas@email.sk",
    passengers: "Počet osôb",
    select: "Vyberte",
    personOne: "osoba",
    personFew: "osoby",
    personMany: "osôb",
    luggage: "Batožina",
    luggagePlaceholder: "Napr. 2 kufre",
    flightNumber: "Číslo letu",
    flightPlaceholder: "Napr. FR1234",
    note: "Poznámka",
    notePlaceholder: "Napr. detská sedačka, výmena kontaktu...",
    estimateOnly: "Len cenová kalkulácia (nezáväzné)",
    submitQuote: "Získať cenovú ponuku",
    submitOrder: "Objednať taxík",
    validation: {
      pickup: "Zadajte odberné miesto (min. 3 znaky)",
      destination: "Zadajte cieľ (min. 3 znaky)",
      datetime: "Vyberte dátum a čas",
      datetimeTooSoon:
        "Objednávku je možné odoslať najskôr 6 hodín vopred. Ak potrebujete odvoz skôr, zavolajte na dispečing alebo použite aplikáciu E-TAXI Košice.",
      phone: "Zadajte platné telefónne číslo",
      email: "Zadajte platnú emailovú adresu",
    },
    alerts: {
      success: "Vaša objednávka bola prijatá. O jej spracovaní Vás budeme informovať",
      errorFallback: "Chyba pri odosielaní objednávky. Zavolajte na +421 911 606 206",
      networkError: "❌ Chyba pri odosielaní objednávky. Zavolajte prosím priamo na +421 911 606 206",
    },
  },

  footer: {
    blurb: "Profesionálna taxislužba v Košiciach a okolí. Spoľahlivosť, komfort a bezpečnosť sú naše priority.",
    servicesTitle: "Služby",
    services: [
      { label: "Objednať jazdu", href: "/#objednavka" },
      { label: "Vozový park", href: "/#vozovy-park" },
      { label: "Letiskové transfery", href: "/letiskove-transfery" },
      { label: "Firemné transfery", href: "/sluzby-pre-firmy" },
      { label: "Košice – Budapešť", href: "/transfer-kosice-budapest" },
      { label: "Košice – Krakov", href: "/transfer-kosice-krakow" },
      { label: "Košice – Debrecín", href: "/transfer-kosice-debrecin" },
      { label: "Košice – Katowice", href: "/transfer-kosice-katowice" },
      { label: "Košice – Viedeň", href: "/transfer-kosice-viedna" },
      { label: "Košice – Bratislava", href: "/transfer-kosice-bratislava" },
      { label: "Košice – Rzeszów", href: "/transfer-kosice-rzeszow" },
      { label: "Košice – Poprad-Tatry", href: "/transfer-kosice-poprad" },
    ],
    infoTitle: "Informácie",
    info: [
      { label: "Cenník", href: "/cennik" },
      { label: "Prepravný poriadok", href: "/prepravny-poriadok" },
      { label: "Ochrana osobných údajov", href: "/ochrana-osobnych-udajov" },
      { label: "FAQ", href: "/#faq" },
      { label: "Recenzie zákazníkov", href: "/#recenzie" },
      { label: "Blog", href: "/#blog" },
    ],
    contactTitle: "Kontakt",
    emailLabel: "Email",
    location: "Kancelária: Stará prešovská cesta 6, 040 01 Košice",
    billing: "Fakturačná adresa: E-TAXI Košice s.r.o., Jenisejská 45A, 040 12 Košice",
    hours: "24/7 Dispečing",
    downloadApp: "Stiahnuť aplikáciu",
    rights: "Všetky práva vyhradené.",
  },

  cookies: {
    title: "Súbory cookies a ochrana osobných údajov",
    intro: "Táto webová stránka používa súbory cookies na zlepšenie vášho zážitku a pre marketingové účely.",
    typesTitle: "Používame nasledujúce typy cookies:",
    essentialLabel: "Nevyhnutné cookies:",
    essentialText: "Potrebné pre základné fungovanie stránky (zapamätanie vašich preferencií)",
    marketingLabel: "Marketingové cookies (Google Ads):",
    marketingText:
      "Používame Google Ads na cielenie reklám a meranie ich efektivity. Tieto cookies sledujú vašu aktivitu na webe a môžu byť použité na zobrazenie personalizovaných reklám.",
    consentBefore:
      "Kliknutím na „Prijať všetky cookies“ súhlasíte s ukladaním cookies na vašom zariadení na účely vylepšenia navigácie na stránke, analýzy využívania stránky a marketingových aktivít v súlade s ",
    consentLink: "Zásadami ochrany osobných údajov",
    consentAfter: ".",
    gdprNote:
      "Vaše osobné údaje spracovávame v súlade s nariadením GDPR (EU) 2016/679 a zákonom č. 18/2018 Z. z. o ochrane osobných údajov.",
    acceptAll: "Prijať všetky",
    essentialOnly: "Len nevyhnutné",
    rejectAll: "Odmietnuť všetky",
    changeNote: "Svoje rozhodnutie môžete kedykoľvek zmeniť v nastaveniach prehliadača alebo vymazaním cookies.",
  },

  pricingPage: {
    intro: "Transparentné ceny bez skrytých poplatkov. Nie sme platci DPH. Konkrétnu cenu určuje aplikácia vopred.",
    importantTitle: "Dôležité informácie",
    importantItems: [
      "Ceny sú orientačné a môžu sa líšiť podľa aktuálnej dopravnej situácie",
      "Pri dlhších trasách možnosť dohodnutia paušálnej ceny vopred",
      "Pre firmy vystavujeme faktúry s platbou prevodom",
    ],
    ctaTitle: "Potrebujete taxík?",
    ctaText: "Zavolajte nám alebo objednajte online",
  },

  termsPage: {
    title: "Prepravný poriadok",
    intro:
      "Pravidlá a podmienky prepravy osôb taxislužbou E-TAXI Košice. Tieto podmienky sú záväzné pre všetkých cestujúcich a vodičov.",
    sections: [
      {
        title: "1. Objednávka prepravy",
        items: [
          "Objednávku je možné vykonať telefonicky, cez online formulár alebo SMS",
          "Pri objednávke uveďte miesto nástupu, cieľ, čas a počet cestujúcich",
          "Potvrdenie objednávky obdržíte do 5 minút",
          "Rezerváciu môžete zrušiť najneskôr 30 minút pred plánovaným časom",
        ],
      },
      {
        title: "2. Nástup do vozidla",
        items: [
          "Vodič sa Vám identifikuje menom a poznávacou značkou vozidla",
          "Pri nástupe skontrolujte, či je zapnutý taxameter",
          "Cestujúci má právo požadovať preukaz vodiča a licenciu na prepravu osôb",
          "V taxíku je zakázané fajčiť a konzumovať alkohol",
        ],
      },
      {
        title: "3. Preprava batožiny",
        items: [
          "Štandardná batožina (do 23 kg) je v cene jazdy zahrnutá",
          "Nadrozmerná batožina môže podliehať príplatku podľa cenníka",
          "Vodič je povinný pomôcť pri nakladaní a vykladaní ťažkej batožiny",
          "Za škody na batožine spôsobené vodičom zodpovedá taxislužba",
        ],
      },
      {
        title: "4. Úhrada za prepravu",
        items: [
          "Platba je možná v hotovosti alebo kartou priamo vo vozidle",
          "Po ukončení jazdy obdržíte potvrdenie o úhrade",
          "Cena je stanovená podľa platného cenníka",
          "Pri platbe kartou je možné vystaviť faktúru pre firmy",
        ],
      },
      {
        title: "5. Reklamácie a sťažnosti",
        items: [
          "Sťažnosť je možné podať telefonicky alebo emailom do 7 dní",
          "Uveďte dátum, čas, číslo vozidla a dôvod reklamácie",
          "Odpoveď na sťažnosť obdržíte do 3 pracovných dní",
          "Oprávnené sťažnosti budú riešené finančnou kompenzáciou alebo zľavou",
        ],
      },
      {
        title: "6. Bezpečnosť a zodpovednosť",
        items: [
          "Všetky vozidlá sú pravidelne kontrolované a servisované",
          "Vodiči majú platné zdravotné prehliadky a certifikáty",
          "Vozidlá sú vybavené GPS a kamerovým systémom pre Vašu bezpečnosť",
          "Taxislužba má uzatvorené havarijné a úrazové poistenie",
        ],
      },
    ],
    validFromLabel: "Platnosť od:",
    validFromValue: "1. január 2026",
    validNote: "Tieto pravidlá môžu byť kedykoľvek aktualizované. Aktuálna verzia je vždy dostupná na tejto stránke.",
  },

  privacyPage: {
    title: "Ochrana osobných údajov",
    subtitle: "Vaše súkromie je pre nás prioritou",
    validFrom: "Platné od: 30. apríla 2026",
    s1: {
      title: "1. Prevádzkovateľ osobných údajov",
      boxTitle: "Prevádzkovateľ:",
      nameLabel: "Názov:",
      nameValue: "E-TAXI Košice s.r.o.",
      addressLabel: "Adresa:",
      addressValue: "Jenisejská 45A, 040 12 Košice, Slovensko",
      emailLabel: "E-mail:",
      phoneLabel: "Telefón:",
    },
    s2: {
      title: "2. Právny základ spracovania",
      intro: "Vaše osobné údaje spracovávame v súlade s:",
      items: [
        "Nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR)",
        "Zákonom č. 18/2018 Z. z. o ochrane osobných údajov a o zmene a doplnení niektorých zákonov",
        "Zákonom č. 22/2004 Z. z. o elektronickom obchode",
      ],
    },
    s3: {
      title: "3. Aké osobné údaje spracovávame",
      sub1Title: "3.1 Pri objednávke taxislužby:",
      sub1Items: ["Meno a priezvisko", "Telefónne číslo", "Adresa vyzdvihnutia a cieľová adresa", "Dátum a čas objednávky"],
      sub2Title: "3.2 Cookies a sledovacie technológie:",
      sub2Items: [
        "IP adresa",
        "Typ prehliadača a zariadenia",
        "Čas návštevy a prezerané stránky",
        "Údaje z Google Ads (pre marketingové účely)",
      ],
    },
    s4: {
      title: "4. Účel spracovania osobných údajov",
      sub1Title: "4.1 Poskytovanie služieb:",
      sub1Text: "Spracovávame údaje potrebné na zabezpečenie taxislužby (plnenie zmluvy)",
      sub2Title: "4.2 Marketingové účely:",
      sub2Text: "S vaším súhlasom používame Google Ads na:",
      sub2Items: [
        "Cielenie relevantných reklám",
        "Meranie efektivity reklamných kampaní",
        "Remarketingové kampane (zobrazenie reklám na základe vašej predchádzajúcej návštevy)",
        "Analýzu správania používateľov",
      ],
      sub3Title: "4.3 Zlepšovanie služieb:",
      sub3Text: "Analýza využívania webovej stránky na zlepšenie používateľského zážitku",
    },
    s5: {
      title: "5. Informácie o Google Ads",
      p1Before: "Používame službu ",
      p1Strong: "Google Ads",
      p1After: " od spoločnosti Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).",
      p2: "Google Ads používa cookies na sledovanie vašej aktivity na webe a zobrazovanie personalizovaných reklám. Google môže tieto údaje spojiť s ďalšími údajmi, ktoré o vás má z iných služieb Google.",
      rightsLabel: "Vaše práva:",
      rightsText: " Môžete sa kedykoľvek odhlásiť z personalizovaných reklám Google na stránke: ",
      moreInfoText: "Viac informácií o spracovaní údajov spoločnosťou Google nájdete na: ",
    },
    s6: {
      title: "6. Doba uchovávania údajov",
      items: [
        { label: "Objednávky:", text: " 5 rokov (účtovné a daňové účely)" },
        { label: "Marketingové cookies:", text: " maximálne 2 roky alebo do odvolania súhlasu" },
        { label: "Technické cookies:", text: " do zatvorenia prehliadača alebo podľa nastavení" },
      ],
    },
    s7: {
      title: "7. Vaše práva",
      intro: "V súlade s GDPR máte právo:",
      items: [
        { label: "Právo na prístup:", text: " Zistiť, aké údaje o vás spracovávame" },
        { label: "Právo na opravu:", text: " Opraviť nesprávne údaje" },
        { label: "Právo na vymazanie:", text: " Požiadať o vymazanie údajov" },
        { label: "Právo na obmedzenie:", text: " Obmedziť spracovanie vašich údajov" },
        { label: "Právo na prenosnosť:", text: " Získať údaje v strojovo čitateľnom formáte" },
        { label: "Právo namietať:", text: " Namietať proti spracovaniu pre marketingové účely" },
        { label: "Právo odvolať súhlas:", text: " Kedykoľvek odvolať súhlas so spracovaním" },
      ],
    },
    s8: {
      title: "8. Kontakt pre uplatnenie práv",
      intro: "Svoje práva môžete uplatniť kontaktovaním prevádzkovateľa na adrese:",
      complaintBefore: "Máte tiež právo podať sťažnosť na ",
      complaintStrong: "Úrad na ochranu osobných údajov SR",
      complaintAfter: " (www.dataprotection.gov.sk)",
    },
    s9: {
      title: "9. Zmeny týchto zásad",
      text: "Tieto zásady môžeme čas od času aktualizovať. Zmeny budú zverejnené na tejto stránke s uvedením dátumu poslednej aktualizácie.",
    },
    back: "← Späť na hlavnú stránku",
  },

  notFound: {
    title: "404 - Stránka nenájdená",
    message:
      "Ľutujeme, požadovanú stránku sa nepodarilo nájsť. Stránka mohla byť presunutá, odstránená alebo nikdy neexistovala.",
    back: "Späť na hlavnú stránku",
  },

  bookingEmail: {
    subject: "Potvrdenie objednávky - E-TAXI Košice",
    greeting: "Dobrý deň,",
    intro: "Vaša objednávka taxíka bola prijatá. O jej spracovaní Vás budeme informovať.",
    detailsTitle: "DETAILY OBJEDNÁVKY",
    detailsTitleHtml: "Detaily objednávky:",
    from: "Z:",
    to: "Do:",
    when: "Kedy:",
    persons: "Počet osôb:",
    typeEstimate: "Typ: Cenová kalkulácia",
    typeOrder: "Typ: Potvrdená objednávka",
    changesText: "Ak potrebujete urobiť zmeny alebo máte otázky, kontaktujte nás:",
    changesTextHtml: "Ak potrebujete urobiť zmeny alebo máte otázky:",
    sign: "S pozdravom,\nE-TAXI Košice tím",
    headerSubtitle: "Potvrdenie objednávky",
    receivedTitle: "Vaša objednávka bola prijatá",
    receivedText: "O jej spracovaní Vás budeme informovať.",
    thanks: "Ďakujeme, že ste si vybrali E-TAXI Košice",
  },
};

export type Dictionary = typeof sk;
