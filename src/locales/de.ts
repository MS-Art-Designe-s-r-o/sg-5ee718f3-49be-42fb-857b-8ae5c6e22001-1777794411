import type { Dictionary } from "./sk";

// Nemecký slovník. Štruktúra musí zodpovedať typu Dictionary (odvodenému zo sk.ts).

export const de: Dictionary = {
  langShort: "DE",
  langName: "Deutsch",
  htmlLang: "de",
  ogLocale: "de_DE",
  metaLanguage: "German",
  dateLocale: "de-DE",

  common: {
    logoAlt: "E-TAXI Košice – Logo des Taxidienstes",
    phone: "+421 911 606 206",
    phoneHref: "tel:+421911606206",
    email: "dispecing@e-taxike.sk",
    call: "Anrufen",
    callNow: "Jetzt anrufen",
    callPhone: "+421 911 606 206 anrufen",
    orderNow: "Jetzt buchen",
    orderRideNow: "Jetzt Fahrt buchen",
    dispatch: "Zentrale 24/7",
  },

  seo: {
    home: {
      title: "E-TAXI Košice | Taxi 24/7 | Flughafentransfers Budapest, Debrecen, Krakau, Wien",
      description:
        "Professioneller Taxidienst in Košice, rund um die Uhr verfügbar ✓ Flughafentransfers nach Budapest, Debrecen, Krakau, Wien ✓ Online-Buchung ✓ Moderne Fahrzeuge ✓ Zentrale +421 911 606 206",
      keywords:
        "Taxi Košice, Taxidienst Košice, Flughafentaxi Košice, Flughafentransfer Budapest, Transfer Budapest Košice, Flughafentransfer Krakau, Transfer Wien, Taxi zum Flughafen, Flughafentransfers, Taxi 24/7 Košice, Taxi Košice buchen, Express-Flughafentransfer, internationale Transfers Košice, Transfer Debrecen, Taxi Košice Debrecen",
    },
    pricing: {
      title: "Taxi-Preisliste | E-TAXI Košice | Preise pro km und Flughafentransfers",
      description:
        "Aktuelle Preisliste von E-TAXI Košice ✓ Stadttaxi ab 1,50 €/km ✓ Transfer Budapest 250 € ✓ Transfer Krakau 290 € ✓ Transfer Wien 450 € ✓ Transparente Preise ohne versteckte Gebühren",
      keywords:
        "Taxi-Preisliste Košice, Taxipreise Košice, Preis Flughafentransfer, Taxipreis pro km Košice, Kosten Flughafentransfer",
    },
    terms: {
      title: "Beförderungsbedingungen | Transportbedingungen | E-TAXI Košice",
      description:
        "Beförderungsbedingungen von E-TAXI Košice. Rechte und Pflichten der Fahrgäste, Beförderungsbedingungen, Stornierungsregeln und das Reklamationsverfahren des Taxidienstes in Košice.",
      keywords:
        "Beförderungsbedingungen Taxi, Transportbedingungen Taxi Košice, Taxiregeln Košice, Fahrgastrechte, Taxi-Reklamation, Stornierung Taxibuchung",
    },
    privacy: {
      title: "Datenschutzerklärung | DSGVO | E-TAXI Košice",
      description:
        "Datenschutzerklärung von E-TAXI Košice gemäß DSGVO. Informationen zur Verarbeitung von Cookies, Marketingdaten und Ihren Rechten nach der DSGVO.",
      keywords:
        "Datenschutzerklärung, DSGVO, Cookies, Datenverarbeitung, Rechte der betroffenen Personen, Google Analytics, Einwilligung zur Datenverarbeitung",
    },
  },

  jsonLd: {
    description:
      "Professioneller Taxidienst in Košice, rund um die Uhr verfügbar. Flughafentransfers nach Budapest, Debrecen, Krakau, Wien. Online-Buchung mit sofortiger Bestätigung.",
    offerCatalogName: "Taxidienste und Transfers",
    offers: [
      {
        name: "Stadttaxi Košice",
        description: "Schneller und zuverlässiger Taxidienst in Košice und Umgebung, rund um die Uhr verfügbar",
      },
      {
        name: "Flughafentransfer Budapest",
        description: "Express-Transfer von Košice zum Flughafen Budapest für 250 €",
      },
      {
        name: "Flughafentransfer Krakau",
        description: "Bequemer Transfer von Košice zum Flughafen Krakau für 290 €",
      },
      {
        name: "Flughafentransfer Wien",
        description: "Professioneller Transfer von Košice zum Flughafen Wien für 450 €",
      },
    ],
  },

  header: {
    menu: [
      {
        label: "Taxidienst",
        children: [
          { label: "Über uns", href: "/#o-nas" },
          { label: "Fuhrpark", href: "/#vozovy-park" },
          { label: "Bewertungen", href: "/#recenzie" },
        ],
      },
      {
        label: "Angebot",
        children: [
          { label: "Leistungen", href: "/#sluzby" },
          { label: "Preisliste", href: "/cennik" },
          { label: "Für Firmen", href: "/sluzby-pre-firmy" },
        ],
      },
      { label: "FAQ", href: "/#faq" },
      { label: "Blog", href: "/#blog" },
    ],
    app: "Mobile App",
    downloadApp: "App herunterladen",
  },

  hero: {
    imageAlt: "Taxi Košice – E-TAXI Košice, Taxidienst rund um die Uhr",
    titlePrefix: "E-TAXI Košice –",
    word1: "schnell",
    word2: "zuverlässig",
    word3: "bequem",
    subtitleBeforePhone: "Rufen Sie ",
    subtitleAfterPhone: " an und ein Wagen ist innerhalb von 10 Minuten bei Ihnen.",
    subtitleLine2: "Flughäfen, Langstrecken, Firmentransfers – immer pünktlich.",
  },

  appSection: {
    title: "Noch schneller mit unserer App",
    text: "Laden Sie unsere mobile App herunter und bestellen Sie ein Taxi noch einfacher. Verfolgen Sie den Standort Ihres Fahrers in Echtzeit und sehen Sie den Preis schon vor der Buchung.",
    downloadOn: "Laden im",
    availableOn: "Erhältlich bei",
  },

  services: {
    title: "Unsere Leistungen",
    businessLink: "Mehr zu Firmenservices →",
    items: [
      {
        title: "Sofortfahrten",
        description: "Rufen Sie uns an und ein Taxi ist innerhalb weniger Minuten bei Ihnen. Rund um die Uhr verfügbar.",
      },
      {
        title: "Terminbuchungen",
        description: "Planen Sie Ihre Fahrt im Voraus. Kein Aufpreis für Vorausbuchungen.",
      },
      {
        title: "Drink-Taxi",
        description: "Sichere Heimfahrt nach der Feier. Sie und Ihr eigenes Auto kommen sicher nach Hause.",
      },
      {
        title: "Flughafentransfers",
        description: "Budapest, Krakau, Debrecen, Bratislava, Wien, Katowice – bequem und zu fairen Preisen.",
      },
      {
        title: "Kartenzahlung",
        description: "In jedem unserer Fahrzeuge können Sie mit Karte zahlen. Keine Sorgen mit Bargeld.",
      },
      {
        title: "Hotels & Firmen",
        description: "Online-Bestellung im Web, Übersicht der durchgeführten Fahrten und Zahlung auf Rechnung. Für Hotels, Firmen und Werkstätten.",
      },
    ],
  },

  fleet: {
    title: "Unser Fuhrpark",
    subtitle: "Moderne, gepflegte Fahrzeuge für Ihren Komfort und Ihre Sicherheit",
    filterAll: "Alle Fahrzeuge",
    filterEco: "Umweltfreundlich",
    ecoBadge: "Umweltfreundlich",
    capacityLabel: "Kapazität:",
    capacityUnit: "Personen",
    note: "Insgesamt 5 Fahrzeuge verfügbar, alle klimatisiert, sauber und in ausgezeichnetem technischem Zustand",
    vehicles: [
      {
        id: "1",
        name: "Tesla Model S",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Klimaanlage" },
          { icon: "zap", label: "Elektrisch" },
        ],
        image: "/tesla_model_s_letisko_kosice.webp",
        imageAlt: "Tesla Model S – Elektrotaxi von E-TAXI Košice vor dem Flughafen Košice, Flughafentransfer",
        description: "Premium-Elektrolimousine – leise und komfortabel, ideal für Flughafentransfers und Geschäftsreisen",
      },
      {
        id: "2",
        name: "Toyota Corolla",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Klimaanlage" },
          { icon: "baby", label: "Kindersitz" },
        ],
        image: "/corolla_krakov.PNG",
        imageAlt: "Toyota Corolla – Taxi von E-TAXI Košice, sparsame Limousine für Stadtfahrten und Transfers",
        description: "Zuverlässige Limousine mit niedrigem Verbrauch",
      },
      {
        id: "3",
        name: "Tesla Model 3",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Klimaanlage" },
          { icon: "zap", label: "Elektrisch" },
        ],
        image: "/tesla_Budapest.PNG",
        imageAlt: "Tesla Model 3 – Elektrotaxi in Košice, Transfers Košice – Budapest",
        description: "Premium-Elektrofahrzeug",
      },
      {
        id: "4",
        name: "VW Golf VII Variant",
        type: "kombi",
        capacity: 4,
        isEco: false,
        features: [{ icon: "wind", label: "Klimaanlage" }],
        image: "/VW_Golf_VII.png",
        imageAlt: "VW Golf VII Variant – Kombi-Taxi in Košice für Stadt- und Überlandfahrten",
        description: "Komfortabler Kombi für Stadt- und Überlandfahrten",
      },
      {
        id: "5",
        name: "Škoda Superb III Combi",
        type: "kombi",
        capacity: 4,
        isEco: false,
        features: [
          { icon: "wind", label: "Klimaanlage" },
          { icon: "baby", label: "Kindersitz" },
        ],
        image: "/skoda_superb_combi_hotel.webp",
        imageAlt: "Škoda Superb III Combi – Taxi vor dem Hotel DoubleTree by Hilton Košice, Hotel- und Firmentransfers",
        description: "Geräumiger Kombi mit großem Kofferraum für Hotelgäste, Firmen und längere Strecken",
      },
    ],
  },

  pricing: {
    title: "Preisliste",
    subtitle: "Transparente Preise ohne versteckte Gebühren",
    note: "Den genauen Preis legt die App im Voraus fest",
    basicTitle: "Grundtarife",
    transfersTitle: "Flughafen- und Langstreckentransfers",
    transfersTitleShort: "Flughafentransfers",
    basicPricing: [
      { label: "Grundgebühr", price: "2 €" },
      { label: "Grundgebühr außerhalb der Innenstadt", price: "0,75 € / km" },
      { label: "Fahrpreis pro km", price: "1,50 € / km" },
      { label: "Wartezeit", price: "20 € / Std." },
      { label: "Mindestfahrpreis", price: "6 €" },
      { label: "Verschmutzung des Fahrzeugs", price: "ab 50 €" },
      { label: "Verschmutzung durch Erbrochenes", price: "150 €" },
      { label: "Zuschlag für Haustiere", price: "2 €" },
      { label: "Kartenzahlung", price: "kostenlos" },
      { label: "Vorausbuchung", price: "kostenlos" },
      { label: "DRINK-Taxi", price: "2× Fahrpreis, min. 20 €" },
    ],
    transfers: [
      { destination: "Košice – Flughafen Košice", price: "ab 18 €" },
      { destination: "Košice – Flughafen Budapest", price: "250 €" },
      { destination: "Košice – Flughafen Krakau", price: "290 €" },
      { destination: "Košice – Debrecen", price: "220 €" },
      { destination: "Košice – Bratislava", price: "390 €" },
      { destination: "Košice – Wien", price: "450 €" },
      { destination: "Košice – Katowice", price: "350 €" },
    ],
    cta: {
      title: "Möchten Sie eine Fahrt buchen?",
      text: "Rufen Sie uns an oder füllen Sie das Online-Formular aus",
    },
  },

  about: {
    title: "Über uns",
    subtitle: "Professioneller Taxidienst in Košice seit 2020",
    description:
      "E-TAXI Košice ist ein moderner Taxidienst, der auf Kundenzufriedenheit, Zuverlässigkeit und umweltfreundliche Beförderung setzt. Unser Ziel ist es, sichere, bequeme und erschwingliche Beförderungsdienste für die Einwohner und Besucher von Košice anzubieten.",
    stats: [
      { value: "5", label: "Fahrzeuge" },
      { value: "6+", label: "Jahre am Markt" },
      { value: "15000+", label: "Zufriedene Kunden" },
      { value: "24/7", label: "Zentrale" },
    ],
    values: [
      {
        title: "Zuverlässigkeit",
        description: "Immer pünktlich, ohne Wartezeit. Unsere Fahrer sind Profis mit langjähriger Erfahrung.",
        icon: "Shield",
      },
      {
        title: "Nachhaltigkeit",
        description: "Wir investieren in umweltfreundliche Fahrzeuge – Tesla, Plug-in-Hybride und emissionsarme Autos.",
        icon: "Leaf",
      },
      {
        title: "Sicherheit",
        description: "GPS-Ortung, Kamerasysteme und regelmäßige Fahrzeugkontrollen für Ihre Sicherheit.",
        icon: "ShieldCheck",
      },
      {
        title: "Transparenz",
        description: "Klare Preisliste ohne versteckte Gebühren. Den Preis sehen Sie bei der Online-Buchung im Voraus.",
        icon: "Eye",
      },
      {
        title: "Innovation",
        description: "Digitale Disposition, SMS- und Sprachbenachrichtigungen zum Auftrag, Live-Fahrzeugverfolgung auf der Karte, mobile App und Web-Bestellung für Firmen und Hotels.",
        icon: "Lightbulb",
      },
      {
        title: "Professionalität",
        description: "Erfahrene Fahrer, regelmäßig gereinigte und gewartete Fahrzeuge, Kartenzahlung in jedem Fahrzeug, Rechnungen und Monatsabrechnung für Firmen, Zentrale rund um die Uhr.",
        icon: "Award",
      },
    ],
    cta: {
      title: "Brauchen Sie jetzt ein Taxi?",
      text: "Rufen Sie uns an oder buchen Sie online",
    },
  },

  partners: {
    partnerAlt: "Partner von E-TAXI Košice",
    title: "Unsere Partner und Referenzen",
    subtitle:
      "Nach vielen Jahren zuverlässiger Fahrten schätzen wir vor allem das Vertrauen der Unternehmen in Košice. Ein Klick auf einen Partner öffnet dessen Website in einem neuen Fenster.",
    partners: [
      {
        name: "Boutique Hotel Golden",
        type: "Hotel **** & Apartments",
        address: "Bajzova 4, 040 01 Košice, Slowakei",
        website: "https://www.hotelgolden.sk/",
        phone: "+421 55 221 11 00",
        email: "reception@goldenapartments.sk",
        logo: "/partners/boutique-hotel-golden.png",
      },
      {
        name: "Metro",
        type: "Großhandel",
        address: "Americká trieda 2828/1A, 040 13 Košice, Slowakei",
        website: "https://www.metro.sk/",
        phone: "0850 123 223",
        email: "info@metro.sk",
        logo: "/partners/metro.png",
      },
      {
        name: "Hotel Dália",
        type: "Zertifiziertes Eco-Hotel",
        address: "Löfflerova 1, 040 01 Košice, Slowakei",
        website: "https://hoteldalia.sk",
        phone: "+421 55 799 43 21",
        email: "welcome@hoteldalia.sk",
        logo: "/partners/hotel-dalia.png",
      },
      {
        name: "MS Art Autokomplex",
        type: "Kfz-Service & Vertragsreparaturen",
        address: "Bajzova 4, 040 01 Košice, Slowakei",
        website: "https://msart.sk",
        phone: "+421 915 770 100",
        email: "info@msart.sk",
        logo: "/partners/ms-art.png",
      },
    ],
    openInNewTab: "Wird in einem neuen Fenster geöffnet",
    visitSite: "Website besuchen",
    ctaText: "Möchte Ihr Unternehmen mit uns fahren?",
    ctaButton: "Kontaktieren Sie uns",
  },

  blogSection: {
    title: "Blog & Neuigkeiten",
    subtitle: "Neuigkeiten, Tipps und Wissenswertes aus der Welt der Taxis und Mobilität",
  },

  reviews: {
    reviewAlt: "Kundenbewertung von E-TAXI Košice",
    title: "Kundenbewertungen",
    subtitle: "Lesen Sie, was unsere zufriedenen Kunden über uns sagen",
    countSuffix: "Bewertungen",
    seeAllOnGoogle: "Alle Bewertungen auf Google ansehen",
    readAllPrefix: "Lesen Sie",
    readAllSuffix: "Bewertungen unserer zufriedenen Kunden",
    items: [
      {
        id: "1",
        name: "Pavol Horváth",
        rating: 5,
        date: "vor 8 Monaten",
        text: "Danke – ich kenne den Namen des Fahrers nicht, er fuhr mich in einem schönen Passat. Danke für das nette Gespräch und die Hilfsbereitschaft, das sieht man heutzutage nicht mehr oft.",
        service: "Stadtfahrt",
      },
      {
        id: "2",
        name: "Diana Švarcová",
        rating: 5,
        date: "vor 3 Jahren",
        text: "Eine wirklich angenehme Fahrt – der Fahrer war aufmerksam, höflich und unglaublich freundlich. Für meine nächste Fahrt in Košice werde ich diesen Taxidienst auf jeden Fall nutzen. 💯",
        service: "Firmentransfer",
      },
      {
        id: "3",
        name: "Q Q",
        rating: 5,
        date: "vor 2 Monaten",
        text: "Danke für die schnelle Reaktion des Unternehmens. Sehr zu empfehlen. Sehr zufrieden 🙂",
        service: "Stadtfahrt",
      },
      {
        id: "4",
        name: "Katarína M.",
        rating: 5,
        date: "2026-03-28",
        text: "Ich brauchte früh morgens eine Fahrt zum Flughafen. Der Fahrer war pünktlich und die Fahrt verlief reibungslos. Danke!",
        service: "Flughafentransfer",
      },
      {
        id: "5",
        name: "Martin S.",
        rating: 4,
        date: "2026-03-20",
        text: "Guter Service, saubere Fahrzeuge. Kleine Verspätung, aber der Fahrer hat mich im Voraus informiert. Insgesamt zufrieden.",
        service: "Stadtfahrt",
      },
      {
        id: "6",
        name: "Lucia H.",
        rating: 5,
        date: "2026-03-15",
        text: "Ausgezeichneter Service! Ich habe online gebucht und alles verlief reibungslos. Ich empfehle es jedem, der zuverlässige Beförderung braucht.",
        service: "Firmentransfer",
      },
    ],
  },

  faq: {
    title: "Häufig gestellte Fragen",
    subtitle: "Antworten auf die häufigsten Fragen zu unseren Leistungen",
    noAnswer: "Haben Sie die Antwort auf Ihre Frage nicht gefunden?",
    callUs: "Rufen Sie uns an: +421 911 606 206",
    items: [
      {
        id: "1",
        question: "Wie schnell kommt das Taxi nach der Buchung?",
        answer:
          "In der Regel ist ein Wagen innerhalb von 10 Minuten nach einer telefonischen Buchung bei Ihnen. Bei Online-Buchungen hängt es von der gewählten Abholzeit ab. Bei hoher Nachfrage in Stoßzeiten kann sich die Zeit etwas verlängern, wir informieren Sie jedoch stets.",
      },
      {
        id: "2",
        question: "Welche Zahlungsmethoden akzeptieren Sie?",
        answer:
          "Wir akzeptieren Bargeld, Zahlungskarten (Visa, Mastercard), Google Pay, Apple Pay und Banküberweisung für Firmenkunden. Bei längeren Fahrten empfehlen wir, die Zahlungsweise im Voraus zu vereinbaren.",
      },
      {
        id: "3",
        question: "Kann ich ein Taxi im Voraus buchen?",
        answer:
          "Ja! Vorausbuchungen nehmen wir telefonisch unter +421 911 606 206 oder über unser Online-Formular entgegen. Wir empfehlen, mindestens 2 Stunden im Voraus zu buchen, bei Flughafentransfers idealerweise einen Tag im Voraus.",
      },
      {
        id: "4",
        question: "Stellen Sie Kindersitze zur Verfügung?",
        answer:
          "Ja, Kindersitze stellen wir kostenlos zur Verfügung. Bitte geben Sie dies bei der Buchung an, damit wir ein Fahrzeug mit der passenden Ausstattung senden können. Wir haben Sitze für verschiedene Altersgruppen.",
      },
      {
        id: "5",
        question: "Fahren Sie auch außerhalb von Košice?",
        answer:
          "Selbstverständlich! Wir bieten Transfers in der ganzen Slowakei und ins Ausland an. Wir fahren regelmäßig zu Flughäfen (Košice, Budapest, Krakau), nach Prag, Wien und in andere Städte. Für lange Strecken bieten wir attraktive Pauschalpreise.",
      },
      {
        id: "6",
        question: "Wie wird der Fahrpreis berechnet?",
        answer:
          "Der Preis setzt sich zusammen aus: einer Grundgebühr (2 €; bei Fahrten außerhalb der Stadt kommen 0,75 €/km hinzu, gerechnet ab Start oder Ziel, je nachdem, was näher an der Stadt liegt), einem Kilometertarif (1,50 €/km) und eventuellen Zuschlägen (nachts, am Wochenende, Gepäck). Für einen genauen Kostenvoranschlag nutzen Sie unser Online-Formular oder rufen Sie uns an.",
      },
      {
        id: "7",
        question: "Sind alle Fahrzeuge klimatisiert?",
        answer:
          "Ja, unser gesamter Fuhrpark ist mit Klimaanlage und WLAN ausgestattet. Die Fahrzeuge werden regelmäßig gereinigt und für Ihren Komfort in perfektem Zustand gehalten.",
      },
      {
        id: "8",
        question: "Kann ich meine Buchung stornieren oder ändern?",
        answer:
          "Ja, Sie können Ihre Buchung jederzeit telefonisch unter +421 911 606 206 stornieren oder ändern. Bei Stornierungen weniger als 30 Minuten vor der geplanten Abholung kann eine Bearbeitungsgebühr von 5 € berechnet werden.",
      },
      {
        id: "9",
        question: "Stellen Sie Rechnungen für Unternehmen aus?",
        answer:
          "Ja, für Firmenkunden stellen wir Rechnungen aus (wir sind kein Mehrwertsteuerzahler, daher ohne MwSt.). Geben Sie bei der Buchung einfach Ihre Rechnungsdaten an. Wir bieten auch eine monatliche Abrechnung für regelmäßige Zusammenarbeit an.",
      },
      {
        id: "10",
        question: "Wie viel Gepäck passt in das Fahrzeug?",
        answer:
          "Standardfahrzeuge (Limousine) fassen 2–3 große Gepäckstücke plus Handgepäck. Für größere Gruppen oder mehr Gepäck empfehlen wir einen Kombi oder Van, der bis zu 6–8 Koffer fasst.",
      },
    ],
  },

  bookingSection: {
    title: "Fahrt buchen",
    textBeforePhone: "Füllen Sie das Formular aus und wir melden uns bei Ihnen. Oder rufen Sie uns einfach an unter ",
    noticeAdvance:
      "Bitte nutzen Sie dieses Formular nur für Fahrten, die Sie mindestens 6 Stunden im Voraus planen, damit wir sie sicher rechtzeitig bearbeiten können. Wenn Sie sofort oder kurzfristig eine Fahrt brauchen, rufen Sie die Dispatch-Zentrale an oder bestellen Sie über die App E-TAXI Košice.",
  },

  bookingForm: {
    heading: "Taxi online bestellen",
    from: "Von",
    fromPlaceholder: "z. B. Hlavná 1, Košice",
    to: "Nach",
    toPlaceholder: "z. B. Flughafen Košice",
    when: "Wann",
    phone: "Telefon",
    phonePlaceholder: "+421 XXX XXX XXX",
    email: "E-Mail",
    emailPlaceholder: "ihre@email.com",
    passengers: "Personen",
    select: "Auswählen",
    personOne: "Person",
    personFew: "Personen",
    personMany: "Personen",
    luggage: "Gepäck",
    luggagePlaceholder: "z. B. 2 Koffer",
    flightNumber: "Flugnummer",
    flightPlaceholder: "z. B. FR1234",
    note: "Anmerkung",
    notePlaceholder: "z. B. Kindersitz, andere Kontaktperson...",
    estimateOnly: "Nur Preisangebot (unverbindlich)",
    submitQuote: "Preisangebot erhalten",
    submitOrder: "Taxi bestellen",
    validation: {
      pickup: "Geben Sie einen Abholort ein (min. 3 Zeichen)",
      destination: "Geben Sie ein Ziel ein (min. 3 Zeichen)",
      datetime: "Wählen Sie Datum und Uhrzeit",
      datetimeTooSoon:
        "Bestellungen können frühestens 6 Stunden im Voraus abgeschickt werden. Wenn Sie früher eine Fahrt brauchen, rufen Sie die Dispatch-Zentrale an oder nutzen Sie die App E-TAXI Košice.",
      phone: "Geben Sie eine gültige Telefonnummer ein",
      email: "Geben Sie eine gültige E-Mail-Adresse ein",
    },
    alerts: {
      success: "Ihre Bestellung ist eingegangen. Wir informieren Sie über deren Bearbeitung.",
      errorFallback: "Beim Senden Ihrer Bestellung ist ein Fehler aufgetreten. Bitte rufen Sie +421 911 606 206 an",
      networkError: "❌ Beim Senden Ihrer Bestellung ist ein Fehler aufgetreten. Bitte rufen Sie uns direkt unter +421 911 606 206 an",
    },
  },

  footer: {
    blurb: "Ein professioneller Taxidienst in Košice und Umgebung. Zuverlässigkeit, Komfort und Sicherheit sind unsere Prioritäten.",
    servicesTitle: "Leistungen",
    services: [
      { label: "Fahrt buchen", href: "/#objednavka" },
      { label: "Fuhrpark", href: "/#vozovy-park" },
      { label: "Flughafentransfers", href: "/taxi-letisko-kosice" },
      { label: "Firmentransfers", href: "/sluzby-pre-firmy" },
      { label: "Košice – Budapest", href: "/transfer-kosice-budapest" },
      { label: "Košice – Krakau", href: "/transfer-kosice-krakow" },
      { label: "Košice – Debrecen", href: "/transfer-kosice-debrecin" },
      { label: "Košice – Katowice", href: "/transfer-kosice-katowice" },
      { label: "Košice – Wien", href: "/transfer-kosice-viedna" },
      { label: "Košice – Bratislava", href: "/transfer-kosice-bratislava" },
      { label: "Košice – Rzeszów", href: "/transfer-kosice-rzeszow" },
      { label: "Košice – Poprad-Tatra", href: "/transfer-kosice-poprad" },
    ],
    infoTitle: "Informationen",
    info: [
      { label: "Preisliste", href: "/cennik" },
      { label: "Beförderungsbedingungen", href: "/prepravny-poriadok" },
      { label: "Datenschutzerklärung", href: "/ochrana-osobnych-udajov" },
      { label: "FAQ", href: "/#faq" },
      { label: "Kundenbewertungen", href: "/#recenzie" },
      { label: "Blog", href: "/#blog" },
    ],
    contactTitle: "Kontakt",
    emailLabel: "E-Mail",
    location: "Košice, Slowakei",
    hours: "Zentrale 24/7",
    downloadApp: "App herunterladen",
    rights: "Alle Rechte vorbehalten.",
  },

  cookies: {
    title: "Cookies und Schutz personenbezogener Daten",
    intro: "Diese Website verwendet Cookies, um Ihr Erlebnis zu verbessern, und zu Marketingzwecken.",
    typesTitle: "Wir verwenden folgende Arten von Cookies:",
    essentialLabel: "Notwendige Cookies:",
    essentialText: "Erforderlich für die grundlegende Funktion der Website (Speichern Ihrer Einstellungen)",
    marketingLabel: "Marketing-Cookies (Google Ads):",
    marketingText:
      "Wir verwenden Google Ads, um Werbung auszurichten und deren Wirksamkeit zu messen. Diese Cookies verfolgen Ihre Aktivität im Web und können zur Anzeige personalisierter Werbung verwendet werden.",
    consentBefore:
      "Durch Klicken auf „Alle akzeptieren“ stimmen Sie der Speicherung von Cookies auf Ihrem Gerät zu, um die Navigation auf der Website zu verbessern, die Nutzung der Website zu analysieren und unsere Marketingaktivitäten zu unterstützen, gemäß unserer ",
    consentLink: "Datenschutzerklärung",
    consentAfter: ".",
    gdprNote:
      "Wir verarbeiten Ihre personenbezogenen Daten gemäß der DSGVO (EU) 2016/679 und dem slowakischen Gesetz Nr. 18/2018 Slg. über den Schutz personenbezogener Daten.",
    acceptAll: "Alle akzeptieren",
    essentialOnly: "Nur notwendige",
    rejectAll: "Alle ablehnen",
    changeNote: "Sie können Ihre Entscheidung jederzeit in Ihren Browsereinstellungen oder durch Löschen der Cookies ändern.",
  },

  pricingPage: {
    intro: "Transparente Preise ohne versteckte Gebühren. Wir sind keine Mehrwertsteuerzahler. Den genauen Preis legt die App im Voraus fest.",
    importantTitle: "Wichtige Informationen",
    importantItems: [
      "Die Preise sind Richtwerte und können je nach aktueller Verkehrslage variieren",
      "Bei längeren Strecken kann ein Pauschalpreis im Voraus vereinbart werden",
      "Für Unternehmen stellen wir Rechnungen mit Zahlung per Überweisung aus",
    ],
    ctaTitle: "Brauchen Sie ein Taxi?",
    ctaText: "Rufen Sie uns an oder buchen Sie online",
  },

  termsPage: {
    title: "Beförderungsbedingungen",
    intro:
      "Regeln und Bedingungen für die Beförderung von Personen durch den Taxidienst E-TAXI Košice. Diese Bedingungen sind für alle Fahrgäste und Fahrer verbindlich.",
    sections: [
      {
        title: "1. Fahrtbuchung",
        items: [
          "Die Buchung ist telefonisch, über das Online-Formular oder per SMS möglich",
          "Geben Sie bei der Buchung Abholort, Ziel, Zeit und Anzahl der Fahrgäste an",
          "Sie erhalten innerhalb von 5 Minuten eine Buchungsbestätigung",
          "Sie können eine Reservierung spätestens 30 Minuten vor der geplanten Zeit stornieren",
        ],
      },
      {
        title: "2. Einsteigen ins Fahrzeug",
        items: [
          "Der Fahrer weist sich mit Namen und dem Kennzeichen des Fahrzeugs aus",
          "Prüfen Sie beim Einsteigen, ob das Taxameter eingeschaltet ist",
          "Fahrgäste haben das Recht, den Ausweis des Fahrers und die Personenbeförderungslizenz zu verlangen",
          "Im Taxi ist Rauchen und Alkoholkonsum verboten",
        ],
      },
      {
        title: "3. Gepäckbeförderung",
        items: [
          "Standardgepäck (bis 23 kg) ist im Fahrpreis enthalten",
          "Übergroßes Gepäck kann laut Preisliste einem Zuschlag unterliegen",
          "Der Fahrer ist verpflichtet, beim Ein- und Ausladen von schwerem Gepäck zu helfen",
          "Für vom Fahrer verursachte Gepäckschäden haftet der Taxidienst",
        ],
      },
      {
        title: "4. Bezahlung der Fahrt",
        items: [
          "Die Zahlung ist bar oder mit Karte direkt im Fahrzeug möglich",
          "Nach Beendigung der Fahrt erhalten Sie eine Zahlungsbestätigung",
          "Der Preis richtet sich nach der gültigen Preisliste",
          "Bei Kartenzahlung kann für Unternehmen eine Rechnung ausgestellt werden",
        ],
      },
      {
        title: "5. Reklamationen und Beschwerden",
        items: [
          "Beschwerden können innerhalb von 7 Tagen telefonisch oder per E-Mail eingereicht werden",
          "Geben Sie Datum, Uhrzeit, Fahrzeugnummer und den Grund der Reklamation an",
          "Sie erhalten innerhalb von 3 Werktagen eine Antwort auf Ihre Beschwerde",
          "Berechtigte Beschwerden werden mit finanzieller Entschädigung oder einem Rabatt gelöst",
        ],
      },
      {
        title: "6. Sicherheit und Haftung",
        items: [
          "Alle Fahrzeuge werden regelmäßig kontrolliert und gewartet",
          "Die Fahrer verfügen über gültige ärztliche Untersuchungen und Zertifikate",
          "Die Fahrzeuge sind zu Ihrer Sicherheit mit GPS und Kamerasystem ausgestattet",
          "Der Taxidienst verfügt über eine Unfall- und Personenversicherung",
        ],
      },
    ],
    validFromLabel: "Gültig ab:",
    validFromValue: "1. Januar 2026",
    validNote: "Diese Regeln können jederzeit aktualisiert werden. Die aktuelle Version ist stets auf dieser Seite verfügbar.",
  },

  privacyPage: {
    title: "Datenschutzerklärung",
    subtitle: "Ihre Privatsphäre ist unsere Priorität",
    validFrom: "Gültig ab: 30. April 2026",
    s1: {
      title: "1. Verantwortlicher für personenbezogene Daten",
      boxTitle: "Verantwortlicher:",
      nameLabel: "Name:",
      nameValue: "E-TAXI Košice",
      addressLabel: "Adresse:",
      addressValue: "Košice, Slowakei",
      emailLabel: "E-Mail:",
      phoneLabel: "Telefon:",
    },
    s2: {
      title: "2. Rechtsgrundlage der Verarbeitung",
      intro: "Wir verarbeiten Ihre personenbezogenen Daten gemäß:",
      items: [
        "Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates (DSGVO)",
        "Slowakisches Gesetz Nr. 18/2018 Slg. über den Schutz personenbezogener Daten in der geltenden Fassung",
        "Slowakisches Gesetz Nr. 22/2004 Slg. über den elektronischen Geschäftsverkehr",
      ],
    },
    s3: {
      title: "3. Welche personenbezogenen Daten wir verarbeiten",
      sub1Title: "3.1 Bei der Taxibuchung:",
      sub1Items: ["Vor- und Nachname", "Telefonnummer", "Abhol- und Zieladresse", "Datum und Uhrzeit der Buchung"],
      sub2Title: "3.2 Cookies und Tracking-Technologien:",
      sub2Items: [
        "IP-Adresse",
        "Browser- und Gerätetyp",
        "Besuchszeit und aufgerufene Seiten",
        "Google-Ads-Daten (zu Marketingzwecken)",
      ],
    },
    s4: {
      title: "4. Zweck der Verarbeitung personenbezogener Daten",
      sub1Title: "4.1 Erbringung von Leistungen:",
      sub1Text: "Wir verarbeiten die zur Erbringung des Taxidienstes erforderlichen Daten (Vertragserfüllung)",
      sub2Title: "4.2 Marketingzwecke:",
      sub2Text: "Mit Ihrer Einwilligung nutzen wir Google Ads für:",
      sub2Items: [
        "Ausrichtung relevanter Werbung",
        "Messung der Wirksamkeit von Werbekampagnen",
        "Remarketing-Kampagnen (Anzeige von Werbung auf Basis Ihres früheren Besuchs)",
        "Analyse des Nutzerverhaltens",
      ],
      sub3Title: "4.3 Verbesserung unserer Leistungen:",
      sub3Text: "Analyse der Website-Nutzung zur Verbesserung des Nutzererlebnisses",
    },
    s5: {
      title: "5. Informationen zu Google Ads",
      p1Before: "Wir nutzen den Dienst ",
      p1Strong: "Google Ads",
      p1After: " der Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).",
      p2: "Google Ads verwendet Cookies, um Ihre Aktivität im Web zu verfolgen und personalisierte Werbung anzuzeigen. Google kann diese Daten mit weiteren Daten kombinieren, die es aus anderen Google-Diensten über Sie hat.",
      rightsLabel: "Ihre Rechte:",
      rightsText: " Sie können sich jederzeit von personalisierter Google-Werbung abmelden unter: ",
      moreInfoText: "Weitere Informationen zur Datenverarbeitung durch Google finden Sie unter: ",
    },
    s6: {
      title: "6. Speicherdauer der Daten",
      items: [
        { label: "Buchungen:", text: " 5 Jahre (Buchhaltungs- und Steuerzwecke)" },
        { label: "Marketing-Cookies:", text: " maximal 2 Jahre oder bis zum Widerruf der Einwilligung" },
        { label: "Technische Cookies:", text: " bis zum Schließen des Browsers oder gemäß Ihren Einstellungen" },
      ],
    },
    s7: {
      title: "7. Ihre Rechte",
      intro: "Gemäß der DSGVO haben Sie das Recht:",
      items: [
        { label: "Auskunftsrecht:", text: " Zu erfahren, welche Daten wir über Sie verarbeiten" },
        { label: "Recht auf Berichtigung:", text: " Unrichtige Daten zu berichtigen" },
        { label: "Recht auf Löschung:", text: " Die Löschung Ihrer Daten zu verlangen" },
        { label: "Recht auf Einschränkung:", text: " Die Verarbeitung Ihrer Daten einzuschränken" },
        { label: "Recht auf Datenübertragbarkeit:", text: " Ihre Daten in einem maschinenlesbaren Format zu erhalten" },
        { label: "Widerspruchsrecht:", text: " Der Verarbeitung zu Marketingzwecken zu widersprechen" },
        { label: "Recht auf Widerruf der Einwilligung:", text: " Ihre Einwilligung zur Verarbeitung jederzeit zu widerrufen" },
      ],
    },
    s8: {
      title: "8. Kontakt zur Ausübung Ihrer Rechte",
      intro: "Ihre Rechte können Sie durch Kontaktaufnahme mit dem Verantwortlichen ausüben unter:",
      complaintBefore: "Sie haben außerdem das Recht, eine Beschwerde beim ",
      complaintStrong: "Amt für den Schutz personenbezogener Daten der Slowakischen Republik",
      complaintAfter: " einzureichen (www.dataprotection.gov.sk)",
    },
    s9: {
      title: "9. Änderungen dieser Erklärung",
      text: "Wir können diese Erklärung von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite zusammen mit dem Datum der letzten Aktualisierung veröffentlicht.",
    },
    back: "← Zurück zur Startseite",
  },

  notFound: {
    title: "404 - Seite nicht gefunden",
    message: "Entschuldigung, die angeforderte Seite konnte nicht gefunden werden. Diese Seite wurde möglicherweise verschoben, gelöscht oder hat nie existiert.",
    back: "Zurück zur Startseite",
  },

  bookingEmail: {
    subject: "Bestellbestätigung - E-TAXI Košice",
    greeting: "Guten Tag,",
    intro: "Ihre Taxibestellung ist eingegangen. Wir informieren Sie über deren Bearbeitung.",
    detailsTitle: "BESTELLDETAILS",
    detailsTitleHtml: "Bestelldetails:",
    from: "Von:",
    to: "Nach:",
    when: "Wann:",
    persons: "Personen:",
    typeEstimate: "Typ: Preisangebot",
    typeOrder: "Typ: Bestätigte Bestellung",
    changesText: "Wenn Sie Änderungen vornehmen möchten oder Fragen haben, kontaktieren Sie uns:",
    changesTextHtml: "Wenn Sie Änderungen vornehmen möchten oder Fragen haben:",
    sign: "Mit freundlichen Grüßen,\nIhr E-TAXI Košice Team",
    headerSubtitle: "Bestellbestätigung",
    receivedTitle: "Ihre Bestellung ist eingegangen",
    receivedText: "Wir informieren Sie über deren Bearbeitung.",
    thanks: "Danke, dass Sie sich für E-TAXI Košice entschieden haben",
  },
};
