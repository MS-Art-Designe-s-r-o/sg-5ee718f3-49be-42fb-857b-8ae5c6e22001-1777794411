import type { Dictionary } from "./sk";

// Maďarský slovník. Štruktúra musí zodpovedať typu Dictionary (odvodenému zo sk.ts).

export const hu: Dictionary = {
  langShort: "HU",
  langName: "Magyar",
  htmlLang: "hu",
  ogLocale: "hu_HU",
  metaLanguage: "Hungarian",
  dateLocale: "hu-HU",

  common: {
    phone: "+421 911 606 206",
    phoneHref: "tel:+421911606206",
    email: "dispecing@e-taxike.sk",
    call: "Hívjon minket",
    callNow: "Hívjon most",
    callPhone: "Hívás: +421 911 606 206",
    orderNow: "Foglalás most",
    orderRideNow: "Fuvar foglalása most",
    dispatch: "Diszpécser 0–24",
  },

  seo: {
    home: {
      title: "E-TAXI Kassa | Taxi 0–24 | Reptéri transzferek Budapest, Krakkó, Bécs",
      description:
        "Professzionális taxiszolgálat Kassán, 0–24 órában elérhető ✓ Reptéri transzferek Budapestre, Krakkóba, Bécsbe ✓ Online foglalás ✓ Modern járművek ✓ Diszpécser +421 911 606 206",
      keywords:
        "taxi Kassa, taxiszolgálat Kassa, kassai reptéri taxi, reptéri transzfer Budapest, transzfer Budapest Kassa, reptéri transzfer Krakkó, transzfer Bécs, taxi a reptérre, reptéri transzferek, taxi 0-24 Kassa, taxi foglalás Kassa, expressz reptéri transzfer, nemzetközi transzferek Kassa",
    },
    pricing: {
      title: "Taxi árlista | E-TAXI Kassa | Kilométerdíjak és reptéri transzferek",
      description:
        "Az E-TAXI Kassa aktuális árlistája ✓ Városi taxi 1,50 €/km-től ✓ Budapest transzfer 250 € ✓ Krakkó transzfer 290 € ✓ Bécs transzfer 450 € ✓ Átlátható árak rejtett díjak nélkül",
      keywords:
        "taxi árlista Kassa, taxi árak Kassa, reptéri transzfer ára, taxi kilométerdíj Kassa, reptéri transzfer költsége",
    },
    terms: {
      title: "Szállítási feltételek | Fuvarozási feltételek | E-TAXI Kassa",
      description:
        "Az E-TAXI Kassa szállítási feltételei. Az utasok jogai és kötelezettségei, fuvarozási feltételek, a foglalás lemondásának szabályai és a kassai taxiszolgálat panaszkezelési eljárása.",
      keywords:
        "taxi szállítási feltételek, taxi fuvarozási feltételek Kassa, taxi szabályok Kassa, utasok jogai, taxi panasz, taxi foglalás lemondása",
    },
    privacy: {
      title: "Adatvédelmi tájékoztató | GDPR | E-TAXI Kassa",
      description:
        "Az E-TAXI Kassa adatvédelmi tájékoztatója a GDPR-nak megfelelően. Tájékoztatás a sütik és marketingadatok kezeléséről, valamint a GDPR szerinti jogairól.",
      keywords:
        "adatvédelmi tájékoztató, GDPR, sütik, adatkezelés, érintettek jogai, Google Analytics, hozzájárulás az adatkezeléshez",
    },
  },

  jsonLd: {
    description:
      "Professzionális taxiszolgálat Kassán, 0–24 órában elérhető. Reptéri transzferek Budapestre, Krakkóba, Bécsbe. Online foglalás azonnali visszaigazolással.",
    offerCatalogName: "Taxiszolgáltatások és transzferek",
    offers: [
      {
        name: "Városi taxiszolgálat Kassa",
        description: "Gyors és megbízható taxiszolgálat Kassán és környékén, 0–24 órában elérhető",
      },
      {
        name: "Budapesti reptéri transzfer",
        description: "Expressz transzfer Kassáról a budapesti reptérre 250 €-ért",
      },
      {
        name: "Krakkói reptéri transzfer",
        description: "Kényelmes transzfer Kassáról a krakkói reptérre 290 €-ért",
      },
      {
        name: "Bécsi reptéri transzfer",
        description: "Professzionális transzfer Kassáról a bécsi reptérre 450 €-ért",
      },
    ],
  },

  header: {
    menu: [
      { label: "Szolgáltatások", href: "/#sluzby" },
      { label: "Járműparkunk", href: "/#vozovy-park" },
      { label: "Rólunk", href: "/#o-nas" },
      { label: "Vélemények", href: "/#recenzie" },
      { label: "GYIK", href: "/#faq" },
      { label: "Árlista", href: "/cennik" },
      { label: "Cégeknek", href: "/sluzby-pre-firmy" },
    ],
    app: "Mobilalkalmazás",
    downloadApp: "Alkalmazás letöltése",
  },

  hero: {
    titlePrefix: "E-TAXI Kassa –",
    word1: "gyorsan",
    word2: "megbízhatóan",
    word3: "kényelmesen",
    subtitleBeforePhone: "Hívja a ",
    subtitleAfterPhone: " számot, és 10 percen belül Önnél az autó.",
    subtitleLine2: "Repterek, hosszú távok, céges transzferek – mindig időben.",
  },

  appSection: {
    title: "Még gyorsabban az alkalmazásunkkal",
    text: "Töltse le mobilalkalmazásunkat, és rendeljen taxit még egyszerűbben. Kövesse a sofőr helyzetét valós időben, és az árat már a foglalás előtt látja.",
    downloadOn: "Letöltés:",
    availableOn: "Elérhető:",
  },

  services: {
    title: "Szolgáltatásaink",
    items: [
      {
        title: "Azonnali fuvarok",
        description: "Hívjon minket, és a taxi néhány percen belül Önnél van. 0–24 órában elérhető.",
      },
      {
        title: "Időpontos foglalások",
        description: "Tervezze meg útját előre. Nincs felár az előzetes foglalásért.",
      },
      {
        title: "Drink Taxi",
        description: "Biztonságos hazaút a buli után. Ön és a saját autója is biztonságban hazaér.",
      },
      {
        title: "Reptéri transzferek",
        description: "Budapest, Krakkó, Debrecen, Pozsony, Bécs, Katowice – kényelmesen és méltányos áron.",
      },
      {
        title: "Bankkártyás fizetés",
        description: "Minden járművünkben fizethet kártyával. Semmi gond a készpénzzel.",
      },
    ],
  },

  fleet: {
    title: "Járműparkunk",
    subtitle: "Modern, karbantartott járművek az Ön kényelméért és biztonságáért",
    filterAll: "Összes jármű",
    filterEco: "Környezetbarát",
    ecoBadge: "Környezetbarát",
    capacityLabel: "Férőhely:",
    capacityUnit: "fő",
    note: "Összesen 5 jármű áll rendelkezésre, mind légkondicionált, tiszta és kiváló műszaki állapotú",
    vehicles: [
      {
        id: "1",
        name: "VW Passat GTE",
        type: "kombi",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Légkondicionálás" },
          { icon: "zap", label: "Környezetbarát" },
        ],
        image: "/VW_Kosice.PNG",
        description: "Környezetbarát plug-in hibrid kombi nagy csomagtérrel",
      },
      {
        id: "2",
        name: "Toyota Corolla",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Légkondicionálás" },
          { icon: "baby", label: "Gyerekülés" },
        ],
        image: "/corolla_krakov.PNG",
        description: "Megbízható szedán alacsony fogyasztással",
      },
      {
        id: "3",
        name: "Tesla Model 3",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Légkondicionálás" },
          { icon: "zap", label: "Elektromos" },
        ],
        image: "/tesla_Budapest.PNG",
        description: "Prémium elektromos jármű",
      },
      {
        id: "4",
        name: "VW Golf VII Variant",
        type: "kombi",
        capacity: 4,
        isEco: false,
        features: [{ icon: "wind", label: "Légkondicionálás" }],
        image: "/VW_Golf_VII.png",
        description: "Kényelmes kombi városi és városközi közlekedéshez",
      },
      {
        id: "5",
        name: "VW Jetta",
        type: "sedan",
        capacity: 4,
        isEco: false,
        features: [
          { icon: "wind", label: "Légkondicionálás" },
          { icon: "baby", label: "Gyerekülés" },
        ],
        image: "/VW_Jetta.png",
        description: "Praktikus jármű családok és nagyobb csoportok számára",
      },
    ],
  },

  pricing: {
    title: "Árlista",
    subtitle: "Átlátható árak rejtett díjak nélkül",
    note: "A pontos árat az alkalmazás előre meghatározza",
    basicTitle: "Alapdíjak",
    transfersTitle: "Reptéri és távolsági transzferek",
    transfersTitleShort: "Reptéri transzferek",
    basicPricing: [
      { label: "Induló díj", price: "0,75 € / km" },
      { label: "Kilométerdíj", price: "1,50 € / km" },
      { label: "Várakozás", price: "20 € / óra" },
      { label: "Minimális fuvardíj", price: "6 €" },
      { label: "Jármű beszennyezése", price: "50 €-tól" },
      { label: "Beszennyezés hányással", price: "150 €" },
      { label: "Háziállat felár", price: "2 €" },
      { label: "Kártyás fizetés", price: "ingyenes" },
      { label: "Előzetes foglalás", price: "ingyenes" },
      { label: "DRINK Taxi", price: "2× fuvardíj, min. 20 €" },
    ],
    transfers: [
      { destination: "Kassa – Kassai reptér", price: "18 €-tól" },
      { destination: "Kassa – Budapesti reptér", price: "250 €" },
      { destination: "Kassa – Krakkói reptér", price: "290 €" },
      { destination: "Kassa – Pozsony", price: "390 €" },
      { destination: "Kassa – Bécs", price: "450 €" },
      { destination: "Kassa – Katowice", price: "350 €" },
    ],
    cta: {
      title: "Szeretne fuvart foglalni?",
      text: "Hívjon minket, vagy töltse ki az online űrlapot",
    },
  },

  about: {
    title: "Rólunk",
    subtitle: "Professzionális taxiszolgálat Kassán 2020 óta",
    description:
      "Az E-TAXI Kassa egy modern taxiszolgálat, amely az ügyfél-elégedettségre, a megbízhatóságra és a környezetbarát szállításra összpontosít. Célunk, hogy biztonságos, kényelmes és megfizethető szállítási szolgáltatásokat nyújtsunk Kassa lakói és látogatói számára.",
    stats: [
      { value: "5", label: "Jármű" },
      { value: "6+", label: "Év a piacon" },
      { value: "15000+", label: "Elégedett ügyfél" },
      { value: "24/7", label: "Diszpécser" },
    ],
    values: [
      {
        title: "Megbízhatóság",
        description: "Mindig időben, várakozás nélkül. Sofőrjeink hosszú évek tapasztalatával rendelkező profik.",
        icon: "Shield",
      },
      {
        title: "Fenntarthatóság",
        description: "Környezetbarát járművekbe fektetünk – Tesla, plug-in hibridek és alacsony kibocsátású autók.",
        icon: "Leaf",
      },
      {
        title: "Biztonság",
        description: "GPS-nyomkövetés, kamerarendszerek és rendszeres jármű-ellenőrzések az Ön biztonságáért.",
        icon: "ShieldCheck",
      },
      {
        title: "Átláthatóság",
        description: "Világos árlista rejtett díjak nélkül. Az árat online foglaláskor előre látja.",
        icon: "Eye",
      },
    ],
    cta: {
      title: "Most van szüksége taxira?",
      text: "Hívjon minket, vagy foglaljon online",
    },
  },

  partners: {
    title: "Közreműködőink és referenciáink",
    subtitle:
      "Az évek során szerzett bizalmát a kosice-i vállalkozásoknak — ez a legértékesebb díszünk. A partnerre kattintva a weboldala új ablakban nyílik meg.",
    partners: [
      {
        name: "Boutique Hotel Golden",
        type: "Hotel **** & apartmanok",
        address: "Bajzova 4, 040 01 Kosice, Szlovákia",
        website: "https://www.hotelgolden.sk/",
        phone: "+421 55 221 11 00",
        email: "reception@goldenapartments.sk",
        logo: "/partners/boutique-hotel-golden.png",
      },
      {
        name: "Metro",
        type: "Nagykereskedelem",
        address: "Americká trieda 2828/1A, 040 13 Kosice, Szlovákia",
        website: "https://www.metro.sk/",
        phone: "0850 123 223",
        email: "info@metro.sk",
        logo: "/partners/metro.png",
      },
      {
        name: "Hotel Dália",
        type: "Tanúsított öko-hotel",
        address: "Löfflerova 1, 040 01 Kosice, Szlovákia",
        website: "https://hoteldalia.sk",
        phone: "+421 55 799 43 21",
        email: "welcome@hoteldalia.sk",
        logo: "/partners/hotel-dalia.png",
      },
      {
        name: "MS Art Autokomplex",
        type: "Autószerviz & szerződéses javítás",
        address: "Bajzova 4, 040 01 Kosice, Szlovákia",
        website: "https://msart.sk",
        phone: "+421 915 770 100",
        email: "info@msart.sk",
        logo: "/partners/ms-art.png",
      },
    ],
    openInNewTab: "Új ablakban nyílik",
    visitSite: "Weboldal megnyitása",
    ctaText: "Vállalata szeretne velünk utazni?",
    ctaButton: "Lépjen kapcsolatba velünk",
  },

  blogSection: {
    title: "Blog és hírek",
    subtitle: "Hírek, tippek és érdekességek a taxik és a mobilitás világából",
  },

  reviews: {
    title: "Ügyfélvélemények",
    subtitle: "Olvassa el, mit mondanak rólunk elégedett ügyfeleink",
    countSuffix: "vélemény",
    seeAllOnGoogle: "Összes vélemény megtekintése a Google-on",
    readAllPrefix: "Olvasson",
    readAllSuffix: "véleményt elégedett ügyfeleinktől",
    items: [
      {
        id: "1",
        name: "Pavol Horváth",
        rating: 5,
        date: "8 hónapja",
        text: "Köszönöm – nem tudom a sofőr nevét, egy szép Passatban vitt. Köszönöm a kellemes beszélgetést és a segítőkészséget, ezt manapság már ritkán látni.",
        service: "Városi fuvar",
      },
      {
        id: "2",
        name: "Diana Švarcová",
        rating: 5,
        date: "3 éve",
        text: "Igazán kellemes fuvar – a sofőr figyelmes, udvarias és hihetetlenül kedves volt. A következő kassai utamon mindenképp ezt a taxiszolgálatot fogom használni. 💯",
        service: "Céges transzfer",
      },
      {
        id: "3",
        name: "Q Q",
        rating: 5,
        date: "2 hónapja",
        text: "Köszönöm a cég gyors hozzáállását. Melegen ajánlom. Elégedettség 🙂",
        service: "Városi fuvar",
      },
      {
        id: "4",
        name: "Katarína M.",
        rating: 5,
        date: "2026-03-28",
        text: "Kora reggel kellett a reptérre jutnom. A sofőr pontos volt, és az út gördülékenyen zajlott. Köszönöm!",
        service: "Reptéri transzfer",
      },
      {
        id: "5",
        name: "Martin S.",
        rating: 4,
        date: "2026-03-20",
        text: "Jó szolgáltatás, tiszta járművek. Kis késés, de a sofőr előre jelezte. Összességében elégedett vagyok.",
        service: "Városi fuvar",
      },
      {
        id: "6",
        name: "Lucia H.",
        rating: 5,
        date: "2026-03-15",
        text: "Kiváló szolgáltatás! Online foglaltam, és minden gördülékenyen ment. Ajánlom mindenkinek, akinek megbízható fuvarra van szüksége.",
        service: "Céges transzfer",
      },
    ],
  },

  faq: {
    title: "Gyakran ismételt kérdések",
    subtitle: "Válaszok a szolgáltatásainkkal kapcsolatos leggyakoribb kérdésekre",
    noAnswer: "Nem találta meg a választ a kérdésére?",
    callUs: "Hívjon minket: +421 911 606 206",
    items: [
      {
        id: "1",
        question: "Milyen gyorsan érkezik a taxi a foglalás után?",
        answer:
          "Telefonos foglalás esetén általában 10 percen belül Önnél van az autó. Online foglalásnál a választott felvételi időponttól függ. Csúcsidőben, nagy kereslet esetén az idő kissé megnőhet, de mindig tájékoztatjuk Önt.",
      },
      {
        id: "2",
        question: "Milyen fizetési módokat fogadnak el?",
        answer:
          "Elfogadunk készpénzt, bankkártyát (Visa, Mastercard), Google Payt, Apple Payt és banki átutalást céges ügyfelek számára. Hosszabb utaknál javasoljuk a fizetési mód előzetes egyeztetését.",
      },
      {
        id: "3",
        question: "Foglalhatok taxit előre?",
        answer:
          "Igen! Előzetes foglalásokat telefonon a +421 911 606 206 számon vagy online űrlapunkon keresztül fogadunk. Javasoljuk, hogy legalább 2 órával előre foglaljon, reptéri transzfereknél ideális esetben egy nappal korábban.",
      },
      {
        id: "4",
        question: "Biztosítanak gyerekülést?",
        answer:
          "Igen, a gyereküléseket ingyenesen biztosítjuk. Kérjük, foglaláskor jelezze, hogy a megfelelő felszereltségű járművet küldhessük. Különböző korcsoportok számára rendelkezünk ülésekkel.",
      },
      {
        id: "5",
        question: "Kassán kívülre is fuvaroznak?",
        answer:
          "Természetesen! Transzfereket biztosítunk egész Szlovákiában és külföldre is. Rendszeresen járunk repterekre (Kassa, Budapest, Krakkó), Prágába, Bécsbe és más városokba. Hosszú távokra kedvező csomagárakat kínálunk.",
      },
      {
        id: "6",
        question: "Hogyan számítják ki a fuvardíjat?",
        answer:
          "Az ár a következőkből áll: induló díj (0,75 €/km), kilométerdíj (1,50 €/km) és esetleges felárak (éjszakai, hétvégi, csomag). Pontos becsléshez használja online űrlapunkat, vagy hívjon minket.",
      },
      {
        id: "7",
        question: "Minden jármű légkondicionált?",
        answer:
          "Igen, teljes járműparkunk légkondicionálóval és WiFi-vel van felszerelve. A járműveket rendszeresen tisztítjuk, és az Ön kényelme érdekében tökéletes állapotban tartjuk.",
      },
      {
        id: "8",
        question: "Lemondhatom vagy módosíthatom a foglalásomat?",
        answer:
          "Igen, foglalását bármikor lemondhatja vagy módosíthatja telefonon a +421 911 606 206 számon. A tervezett felvétel előtt kevesebb mint 30 perccel történő lemondás esetén 5 € kezelési díj számítható fel.",
      },
      {
        id: "9",
        question: "Állítanak ki számlát cégek részére?",
        answer:
          "Igen, céges ügyfeleink részére számlát állítunk ki (nem vagyunk áfaalanyok, ezért a számla áfa nélkül készül). Foglaláskor csak adja meg számlázási adatait. Rendszeres együttműködéshez havi elszámolást is kínálunk.",
      },
      {
        id: "10",
        question: "Mennyi csomag fér a járműbe?",
        answer:
          "A standard járművek (szedán) 2–3 nagy csomagot és kézipoggyászt visznek. Nagyobb csoportok vagy több csomag esetén kombit vagy vant ajánlunk, amelybe akár 6–8 bőrönd is befér.",
      },
    ],
  },

  bookingSection: {
    title: "Fuvar foglalása",
    textBeforePhone: "Töltse ki az űrlapot, és jelentkezünk. Vagy egyszerűen hívjon minket a ",
    noticeAdvance:
      "Kérjük, az űrlapot csak legalább 6 órával előre tervezett fuvarokhoz használja, hogy biztosan fel tudjuk dolgozni. Ha azonnal vagy rövid időn belül van szüksége fuvarra, hívja a diszpécserszolgálatot, vagy rendeljen az E-TAXI Košice alkalmazáson keresztül.",
  },

  bookingForm: {
    heading: "Taxi rendelése online",
    from: "Honnan",
    fromPlaceholder: "pl. Hlavná 1, Kassa",
    to: "Hová",
    toPlaceholder: "pl. Kassai reptér",
    when: "Mikor",
    phone: "Telefon",
    phonePlaceholder: "+421 XXX XXX XXX",
    email: "E-mail",
    emailPlaceholder: "az.on@email.com",
    passengers: "Utasok száma",
    select: "Válasszon",
    personOne: "fő",
    personFew: "fő",
    personMany: "fő",
    luggage: "Csomag",
    luggagePlaceholder: "pl. 2 bőrönd",
    flightNumber: "Járatszám",
    flightPlaceholder: "pl. FR1234",
    note: "Megjegyzés",
    notePlaceholder: "pl. gyerekülés, másik kapcsolattartó...",
    estimateOnly: "Csak árajánlat (nem kötelező érvényű)",
    submitQuote: "Árajánlat kérése",
    submitOrder: "Taxi rendelése",
    validation: {
      pickup: "Adja meg a felvételi helyet (min. 3 karakter)",
      destination: "Adja meg az úti célt (min. 3 karakter)",
      datetime: "Válasszon dátumot és időpontot",
      datetimeTooSoon:
        "A megrendelés legalább 6 órával előre küldhető el. Ha korábban van szüksége fuvarra, hívja a diszpécserszolgálatot, vagy használja az E-TAXI Košice alkalmazást.",
      phone: "Adjon meg egy érvényes telefonszámot",
      email: "Adjon meg egy érvényes e-mail-címet",
    },
    alerts: {
      success: "Megrendelését megkaptuk. A feldolgozásáról tájékoztatni fogjuk.",
      errorFallback: "Hiba történt a megrendelés elküldésekor. Kérjük, hívja a +421 911 606 206 számot",
      networkError: "❌ Hiba történt a megrendelés elküldésekor. Kérjük, hívjon minket közvetlenül a +421 911 606 206 számon",
    },
  },

  footer: {
    blurb: "Professzionális taxiszolgálat Kassán és környékén. A megbízhatóság, a kényelem és a biztonság a prioritásaink.",
    servicesTitle: "Szolgáltatások",
    services: [
      { label: "Fuvar foglalása", href: "/#objednavka" },
      { label: "Járműparkunk", href: "/#vozovy-park" },
      { label: "Reptéri transzferek", href: "/taxi-letisko-kosice" },
      { label: "Céges transzferek", href: "/sluzby-pre-firmy" },
      { label: "Kassa – Budapest", href: "/transfer-kosice-budapest" },
      { label: "Kassa – Krakkó", href: "/transfer-kosice-krakow" },
      { label: "Kassa – Katowice", href: "/transfer-kosice-katowice" },
      { label: "Kassa – Bécs", href: "/transfer-kosice-viedna" },
    ],
    infoTitle: "Információk",
    info: [
      { label: "Árlista", href: "/cennik" },
      { label: "Szállítási feltételek", href: "/prepravny-poriadok" },
      { label: "Adatvédelmi tájékoztató", href: "/ochrana-osobnych-udajov" },
      { label: "GYIK", href: "/#faq" },
      { label: "Ügyfélvélemények", href: "/#recenzie" },
      { label: "Blog", href: "/#blog" },
    ],
    contactTitle: "Kapcsolat",
    emailLabel: "E-mail",
    location: "Kassa, Szlovákia",
    hours: "Diszpécser 0–24",
    downloadApp: "Alkalmazás letöltése",
    rights: "Minden jog fenntartva.",
  },

  cookies: {
    title: "Sütik és a személyes adatok védelme",
    intro: "Ez a weboldal sütiket használ az élmény javítása és marketingcélok érdekében.",
    typesTitle: "A következő típusú sütiket használjuk:",
    essentialLabel: "Szükséges sütik:",
    essentialText: "Az oldal alapvető működéséhez szükségesek (a beállításai megjegyzése)",
    marketingLabel: "Marketing sütik (Google Ads):",
    marketingText:
      "A Google Ads szolgáltatást a hirdetések célzására és hatékonyságuk mérésére használjuk. Ezek a sütik nyomon követik az Ön tevékenységét a weben, és személyre szabott hirdetések megjelenítésére használhatók.",
    consentBefore:
      "Az „Összes elfogadása“ gombra kattintva hozzájárul a sütik eszközén való tárolásához az oldalon való navigáció javítása, az oldal használatának elemzése és marketingtevékenységeink támogatása érdekében, ",
    consentLink: "Adatvédelmi tájékoztatónkkal",
    consentAfter: " összhangban.",
    gdprNote:
      "Személyes adatait a GDPR (EU) 2016/679 rendeletnek és a személyes adatok védelméről szóló 18/2018. sz. szlovák törvénynek megfelelően kezeljük.",
    acceptAll: "Összes elfogadása",
    essentialOnly: "Csak a szükségesek",
    rejectAll: "Összes elutasítása",
    changeNote: "Döntését bármikor módosíthatja a böngésző beállításaiban vagy a sütik törlésével.",
  },

  pricingPage: {
    intro: "Átlátható árak rejtett díjak nélkül. Nem vagyunk áfaalanyok. A pontos árat az alkalmazás előre meghatározza.",
    importantTitle: "Fontos információk",
    importantItems: [
      "Az árak tájékoztató jellegűek, és az aktuális forgalmi helyzettől függően változhatnak",
      "Hosszabb utaknál előre egyeztethető átalányár",
      "Cégek részére átutalásos fizetéssel állítunk ki számlát",
    ],
    ctaTitle: "Taxira van szüksége?",
    ctaText: "Hívjon minket, vagy foglaljon online",
  },

  termsPage: {
    title: "Szállítási feltételek",
    intro:
      "Az E-TAXI Kassa taxiszolgálat személyszállítási szabályai és feltételei. Ezek a feltételek minden utasra és sofőrre kötelező érvényűek.",
    sections: [
      {
        title: "1. Fuvar foglalása",
        items: [
          "A foglalás telefonon, az online űrlapon vagy SMS-ben lehetséges",
          "Foglaláskor adja meg a felvételi helyet, az úti célt, az időpontot és az utasok számát",
          "A foglalás visszaigazolását 5 percen belül megkapja",
          "A foglalást legkésőbb a tervezett időpont előtt 30 perccel mondhatja le",
        ],
      },
      {
        title: "2. Beszállás a járműbe",
        items: [
          "A sofőr a nevével és a jármű rendszámával azonosítja magát",
          "Beszálláskor ellenőrizze, hogy a taxaméter be van-e kapcsolva",
          "Az utasnak joga van elkérni a sofőr igazolványát és a személyszállítási engedélyt",
          "A taxiban tilos a dohányzás és az alkoholfogyasztás",
        ],
      },
      {
        title: "3. Csomagszállítás",
        items: [
          "A standard csomag (max. 23 kg) benne van a fuvardíjban",
          "A túlméretes csomag az árlista szerint felár alá eshet",
          "A sofőr köteles segíteni a nehéz csomagok be- és kirakodásában",
          "A sofőr által okozott csomagkárokért a taxiszolgálat felel",
        ],
      },
      {
        title: "4. A fuvar kifizetése",
        items: [
          "A fizetés készpénzzel vagy kártyával közvetlenül a járműben lehetséges",
          "A fuvar végén fizetési igazolást kap",
          "Az árat az érvényes árlista határozza meg",
          "Kártyás fizetés esetén cégek részére számla állítható ki",
        ],
      },
      {
        title: "5. Reklamációk és panaszok",
        items: [
          "A panaszt 7 napon belül telefonon vagy e-mailben lehet benyújtani",
          "Adja meg a dátumot, az időpontot, a jármű számát és a reklamáció okát",
          "A panaszra 3 munkanapon belül választ kap",
          "A jogos panaszokat pénzbeli kártérítéssel vagy kedvezménnyel rendezzük",
        ],
      },
      {
        title: "6. Biztonság és felelősség",
        items: [
          "Minden járművet rendszeresen ellenőriznek és szervizelnek",
          "A sofőrök érvényes orvosi vizsgálatokkal és tanúsítványokkal rendelkeznek",
          "A járművek az Ön biztonsága érdekében GPS-szel és kamerarendszerrel vannak felszerelve",
          "A taxiszolgálat baleset- és személybiztosítással rendelkezik",
        ],
      },
    ],
    validFromLabel: "Érvényes:",
    validFromValue: "2026. január 1-től",
    validNote: "Ezek a szabályok bármikor frissülhetnek. Az aktuális verzió mindig elérhető ezen az oldalon.",
  },

  privacyPage: {
    title: "Adatvédelmi tájékoztató",
    subtitle: "Az Ön magánélete a mi prioritásunk",
    validFrom: "Érvényes: 2026. április 30-tól",
    s1: {
      title: "1. Az adatok kezelője",
      boxTitle: "Adatkezelő:",
      nameLabel: "Név:",
      nameValue: "E-TAXI Kassa",
      addressLabel: "Cím:",
      addressValue: "Kassa, Szlovákia",
      emailLabel: "E-mail:",
      phoneLabel: "Telefon:",
    },
    s2: {
      title: "2. Az adatkezelés jogalapja",
      intro: "Személyes adatait a következőknek megfelelően kezeljük:",
      items: [
        "Az Európai Parlament és a Tanács (EU) 2016/679 rendelete (GDPR)",
        "A személyes adatok védelméről szóló 18/2018. sz. szlovák törvény a hatályos módosításokkal",
        "Az elektronikus kereskedelemről szóló 22/2004. sz. szlovák törvény",
      ],
    },
    s3: {
      title: "3. Milyen személyes adatokat kezelünk",
      sub1Title: "3.1 Taxifoglaláskor:",
      sub1Items: ["Vezeték- és keresztnév", "Telefonszám", "Felvételi és célcím", "A foglalás dátuma és időpontja"],
      sub2Title: "3.2 Sütik és nyomkövető technológiák:",
      sub2Items: [
        "IP-cím",
        "Böngésző és eszköz típusa",
        "Látogatás ideje és megtekintett oldalak",
        "Google Ads adatok (marketingcélokra)",
      ],
    },
    s4: {
      title: "4. A személyes adatok kezelésének célja",
      sub1Title: "4.1 Szolgáltatások nyújtása:",
      sub1Text: "A taxiszolgálat biztosításához szükséges adatokat kezeljük (szerződés teljesítése)",
      sub2Title: "4.2 Marketingcélok:",
      sub2Text: "Az Ön hozzájárulásával a Google Adst a következőkre használjuk:",
      sub2Items: [
        "Releváns hirdetések célzása",
        "A reklámkampányok hatékonyságának mérése",
        "Remarketing-kampányok (hirdetések megjelenítése korábbi látogatása alapján)",
        "A felhasználói viselkedés elemzése",
      ],
      sub3Title: "4.3 Szolgáltatásaink fejlesztése:",
      sub3Text: "A weboldal használatának elemzése a felhasználói élmény javítása érdekében",
    },
    s5: {
      title: "5. Tájékoztatás a Google Ads szolgáltatásról",
      p1Before: "A ",
      p1Strong: "Google Ads",
      p1After: " szolgáltatást használjuk, amelyet a Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) nyújt.",
      p2: "A Google Ads sütiket használ az Ön webes tevékenységének nyomon követésére és személyre szabott hirdetések megjelenítésére. A Google ezeket az adatokat összekapcsolhatja más Google-szolgáltatásokból Önről gyűjtött adatokkal.",
      rightsLabel: "Az Ön jogai:",
      rightsText: " A személyre szabott Google-hirdetésekről bármikor leiratkozhat itt: ",
      moreInfoText: "A Google általi adatkezelésről további információt itt talál: ",
    },
    s6: {
      title: "6. Az adatok tárolási ideje",
      items: [
        { label: "Foglalások:", text: " 5 év (számviteli és adózási célok)" },
        { label: "Marketing sütik:", text: " legfeljebb 2 év vagy a hozzájárulás visszavonásáig" },
        { label: "Technikai sütik:", text: " a böngésző bezárásáig vagy a beállításai szerint" },
      ],
    },
    s7: {
      title: "7. Az Ön jogai",
      intro: "A GDPR-nak megfelelően Önnek joga van:",
      items: [
        { label: "Hozzáférési jog:", text: " Megtudni, milyen adatokat kezelünk Önről" },
        { label: "Helyesbítéshez való jog:", text: " Helytelen adatok javítása" },
        { label: "Törléshez való jog:", text: " Adatai törlésének kérése" },
        { label: "Korlátozáshoz való jog:", text: " Adatai kezelésének korlátozása" },
        { label: "Adathordozhatósághoz való jog:", text: " Adatai megszerzése géppel olvasható formátumban" },
        { label: "Tiltakozáshoz való jog:", text: " Tiltakozás a marketingcélú adatkezelés ellen" },
        { label: "Hozzájárulás visszavonásához való jog:", text: " Az adatkezeléshez adott hozzájárulás bármikori visszavonása" },
      ],
    },
    s8: {
      title: "8. Kapcsolat a jogok gyakorlásához",
      intro: "Jogait az adatkezelővel való kapcsolatfelvétellel gyakorolhatja:",
      complaintBefore: "Önnek joga van panaszt benyújtani a ",
      complaintStrong: "Szlovák Köztársaság Személyesadat-védelmi Hivatalához",
      complaintAfter: " is (www.dataprotection.gov.sk)",
    },
    s9: {
      title: "9. A jelen tájékoztató módosításai",
      text: "Ezt a tájékoztatót időről időre frissíthetjük. A módosításokat ezen az oldalon tesszük közzé az utolsó frissítés dátumával együtt.",
    },
    back: "← Vissza a főoldalra",
  },

  notFound: {
    title: "404 - Az oldal nem található",
    message: "Sajnáljuk, a kért oldal nem található. Lehet, hogy az oldalt áthelyezték, törölték, vagy soha nem is létezett.",
    back: "Vissza a főoldalra",
  },

  bookingEmail: {
    subject: "Megrendelés visszaigazolása - E-TAXI Kassa",
    greeting: "Jó napot kívánok,",
    intro: "Taxirendelését megkaptuk. A feldolgozásáról tájékoztatni fogjuk.",
    detailsTitle: "MEGRENDELÉS RÉSZLETEI",
    detailsTitleHtml: "A megrendelés részletei:",
    from: "Honnan:",
    to: "Hová:",
    when: "Mikor:",
    persons: "Utasok száma:",
    typeEstimate: "Típus: Árajánlat",
    typeOrder: "Típus: Megerősített megrendelés",
    changesText: "Ha módosítani szeretne, vagy kérdése van, lépjen kapcsolatba velünk:",
    changesTextHtml: "Ha módosítani szeretne, vagy kérdése van:",
    sign: "Üdvözlettel,\nAz E-TAXI Kassa csapata",
    headerSubtitle: "Megrendelés visszaigazolása",
    receivedTitle: "Megrendelését megkaptuk",
    receivedText: "A feldolgozásáról tájékoztatni fogjuk.",
    thanks: "Köszönjük, hogy az E-TAXI Kassát választotta",
  },
};
