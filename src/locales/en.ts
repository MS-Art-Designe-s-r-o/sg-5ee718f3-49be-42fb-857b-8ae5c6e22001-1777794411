import type { Dictionary } from "./sk";

// Anglický slovník. Štruktúra musí zodpovedať typu Dictionary (odvodenému zo sk.ts).

export const en: Dictionary = {
  langShort: "EN",
  langName: "English",
  htmlLang: "en",
  ogLocale: "en_GB",
  metaLanguage: "English",
  dateLocale: "en-GB",

  common: {
    phone: "+421 911 606 206",
    phoneHref: "tel:+421911606206",
    email: "dispecing@e-taxike.sk",
    call: "Call us",
    callNow: "Call now",
    callPhone: "Call +421 911 606 206",
    orderNow: "Book now",
    orderRideNow: "Book a ride now",
    dispatch: "24/7 dispatch",
  },

  seo: {
    home: {
      title: "E-TAXI Košice | 24/7 Taxi Service | Airport Transfers Budapest, Krakow, Vienna",
      description:
        "Professional taxi service in Košice available 24/7 ✓ Airport transfers to Budapest, Krakow, Vienna ✓ Online booking ✓ Modern vehicles ✓ Dispatch +421 911 606 206",
      keywords:
        "taxi Košice, taxi service Košice, Košice airport taxi, airport transfer Budapest, transfer Budapest Košice, airport transfer Krakow, transfer Vienna, taxi to airport, airport transfers, 24/7 taxi Košice, book taxi Košice, express airport transfer, international transfers Košice",
    },
    pricing: {
      title: "Taxi Price List | E-TAXI Košice | Rates per km and Airport Transfers",
      description:
        "Current E-TAXI Košice price list ✓ City taxi from €1.50/km ✓ Budapest transfer €250 ✓ Krakow transfer €290 ✓ Vienna transfer €450 ✓ Transparent prices with no hidden fees",
      keywords:
        "taxi price list Košice, taxi prices Košice, airport transfer price, taxi price per km Košice, airport transfer cost",
    },
    terms: {
      title: "Terms of Carriage | Conditions of Transport | E-TAXI Košice",
      description:
        "E-TAXI Košice terms of carriage. Passenger rights and obligations, conditions of transport, booking cancellation rules and the complaints procedure of the taxi service in Košice.",
      keywords:
        "taxi terms of carriage, taxi transport conditions Košice, taxi rules Košice, passenger rights, taxi complaint, taxi booking cancellation",
    },
    privacy: {
      title: "Privacy Policy | GDPR | E-TAXI Košice",
      description:
        "E-TAXI Košice privacy policy in accordance with the GDPR. Information about the processing of cookies, marketing data and your rights under the GDPR regulation.",
      keywords:
        "privacy policy, GDPR, cookies, data processing, data subject rights, Google Analytics, consent to data processing",
    },
  },

  jsonLd: {
    description:
      "Professional taxi service in Košice available 24/7. Airport transfers to Budapest, Krakow, Vienna. Online booking with instant confirmation.",
    offerCatalogName: "Taxi services and transfers",
    offers: [
      {
        name: "City taxi service Košice",
        description: "Fast and reliable taxi service in Košice and the surrounding area, available 24/7",
      },
      {
        name: "Budapest Airport transfer",
        description: "Express transfer from Košice to Budapest Airport for €250",
      },
      {
        name: "Krakow Airport transfer",
        description: "Comfortable transfer from Košice to Krakow Airport for €290",
      },
      {
        name: "Vienna Airport transfer",
        description: "Professional transfer from Košice to Vienna Airport for €450",
      },
    ],
  },

  header: {
    menu: [
      { label: "Services", href: "/#sluzby" },
      { label: "Our fleet", href: "/#vozovy-park" },
      { label: "About us", href: "/#o-nas" },
      { label: "Reviews", href: "/#recenzie" },
      { label: "FAQ", href: "/#faq" },
      { label: "Price list", href: "/cennik" },
      { label: "For business", href: "/sluzby-pre-firmy" },
    ],
    app: "Mobile app",
    downloadApp: "Download the app",
  },

  hero: {
    titlePrefix: "E-TAXI Košice –",
    word1: "fast",
    word2: "reliable",
    word3: "comfortable",
    subtitleBeforePhone: "Call ",
    subtitleAfterPhone: " and a car will be with you within 10 minutes.",
    subtitleLine2: "Airports, long-distance trips, corporate transfers – always on time.",
  },

  appSection: {
    title: "Even faster with our app",
    text: "Download our mobile app and order a taxi even more easily. Track your driver's location in real time and see the price before you book.",
    downloadOn: "Download on the",
    availableOn: "Available on",
  },

  services: {
    title: "Our services",
    items: [
      {
        title: "Instant rides",
        description: "Call us and a taxi will be at your door within minutes. Available 24/7.",
      },
      {
        title: "Scheduled bookings",
        description: "Plan your trip in advance. No extra charge for advance bookings.",
      },
      {
        title: "Drink Taxi",
        description: "A safe journey home after a party. Both you and your own car get home safely.",
      },
      {
        title: "Airport transfers",
        description: "Budapest, Krakow, Debrecen, Bratislava, Vienna, Katowice – comfortable and fairly priced.",
      },
      {
        title: "Card payments",
        description: "Pay by card in every one of our vehicles. No need to worry about cash.",
      },
    ],
  },

  fleet: {
    title: "Our fleet",
    subtitle: "Modern, well-maintained vehicles for your comfort and safety",
    filterAll: "All vehicles",
    filterEco: "Eco-friendly",
    ecoBadge: "Eco-friendly",
    capacityLabel: "Capacity:",
    capacityUnit: "passengers",
    note: "A total of 5 vehicles available, all air-conditioned, clean and in excellent technical condition",
    vehicles: [
      {
        id: "1",
        name: "VW Passat GTE",
        type: "kombi",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Air conditioning" },
          { icon: "zap", label: "Eco-friendly" },
        ],
        image: "/VW_Kosice.PNG",
        description: "Eco-friendly plug-in hybrid estate with a large luggage compartment",
      },
      {
        id: "2",
        name: "Toyota Corolla",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Air conditioning" },
          { icon: "baby", label: "Child seat" },
        ],
        image: "/corolla_krakov.PNG",
        description: "A reliable sedan with low fuel consumption",
      },
      {
        id: "3",
        name: "Tesla Model 3",
        type: "sedan",
        capacity: 4,
        isEco: true,
        features: [
          { icon: "wind", label: "Air conditioning" },
          { icon: "zap", label: "Electric" },
        ],
        image: "/tesla_Budapest.PNG",
        description: "A premium electric vehicle",
      },
      {
        id: "4",
        name: "VW Golf VII Variant",
        type: "kombi",
        capacity: 4,
        isEco: false,
        features: [{ icon: "wind", label: "Air conditioning" }],
        image: "/VW_Golf_VII.png",
        description: "A comfortable estate for city and intercity transport",
      },
      {
        id: "5",
        name: "VW Jetta",
        type: "sedan",
        capacity: 4,
        isEco: false,
        features: [
          { icon: "wind", label: "Air conditioning" },
          { icon: "baby", label: "Child seat" },
        ],
        image: "/VW_Jetta.png",
        description: "A practical vehicle for families and larger groups",
      },
    ],
  },

  pricing: {
    title: "Price list",
    subtitle: "Transparent prices with no hidden fees",
    note: "The exact price is set in advance by the app",
    basicTitle: "Basic rates",
    transfersTitle: "Airport & long-distance transfers",
    transfersTitleShort: "Airport transfers",
    basicPricing: [
      { label: "Starting fee", price: "€0.75 / km" },
      { label: "Rate per km", price: "€1.50 / km" },
      { label: "Waiting", price: "€20 / hour" },
      { label: "Minimum fare", price: "€6" },
      { label: "Vehicle soiling", price: "from €50" },
      { label: "Soiling by vomiting", price: "€150" },
      { label: "Pet surcharge", price: "€2" },
      { label: "Card payment", price: "free" },
      { label: "Advance booking", price: "free" },
      { label: "DRINK Taxi", price: "2× the fare, min. €20" },
    ],
    transfers: [
      { destination: "Košice – Košice Airport", price: "from €18" },
      { destination: "Košice – Budapest Airport", price: "€250" },
      { destination: "Košice – Krakow Airport", price: "€290" },
      { destination: "Košice – Bratislava", price: "€390" },
      { destination: "Košice – Vienna", price: "€450" },
      { destination: "Košice – Katowice", price: "€350" },
    ],
    cta: {
      title: "Want to book a ride?",
      text: "Call us or fill in the online form",
    },
  },

  about: {
    title: "About us",
    subtitle: "A professional taxi service in Košice since 2020",
    description:
      "E-TAXI Košice is a modern taxi service focused on customer satisfaction, reliability and eco-friendly transport. Our goal is to provide safe, comfortable and affordable transport services for the residents and visitors of Košice.",
    stats: [
      { value: "5", label: "Vehicles" },
      { value: "6+", label: "Years in business" },
      { value: "15000+", label: "Happy customers" },
      { value: "24/7", label: "Dispatch" },
    ],
    values: [
      {
        title: "Reliability",
        description: "Always on time, no waiting. Our drivers are professionals with years of experience.",
        icon: "Shield",
      },
      {
        title: "Sustainability",
        description: "We invest in eco-friendly vehicles – Tesla, plug-in hybrids and low-emission cars.",
        icon: "Leaf",
      },
      {
        title: "Safety",
        description: "GPS tracking, camera systems and regular vehicle inspections for your safety.",
        icon: "ShieldCheck",
      },
      {
        title: "Transparency",
        description: "A clear price list with no hidden fees. You can see the price in advance when booking online.",
        icon: "Eye",
      },
    ],
    cta: {
      title: "Need a taxi right now?",
      text: "Call us or book online",
    },
  },

  partners: {
    title: "Our Partners & References",
    subtitle:
      "After years of reliable rides, the trust of local businesses in Kosice is our greatest reward. Clicking a partner opens their website in a new window.",
    partners: [
      {
        name: "Boutique Hotel Golden",
        type: "Hotel **** & apartments",
        address: "Bajzova 4, 040 01 Kosice, Slovakia",
        website: "https://www.hotelgolden.sk/",
        phone: "+421 55 221 11 00",
        email: "reception@goldenapartments.sk",
        logo: "/partners/boutique-hotel-golden.png",
      },
      {
        name: "Metro",
        type: "Wholesale",
        address: "Americka trieda 2828/1A, 040 13 Kosice, Slovakia",
        website: "https://www.metro.sk/",
        phone: "0850 123 223",
        email: "info@metro.sk",
        logo: "/partners/metro.png",
      },
      {
        name: "Hotel Dália",
        type: "Certified eco-hotel",
        address: "Löfflerova 1, 040 01 Kosice, Slovakia",
        website: "https://hoteldalia.sk",
        phone: "+421 55 799 43 21",
        email: "welcome@hoteldalia.sk",
        logo: "/partners/hotel-dalia.png",
      },
      {
        name: "MS Art Autokomplex",
        type: "Auto services & contract repair",
        address: "Bajzova 4, 040 01 Kosice, Slovakia",
        website: "https://msart.sk",
        phone: "+421 915 770 100",
        email: "info@msart.sk",
        logo: "/partners/ms-art.png",
      },
    ],
    openInNewTab: "Opens in a new window",
    visitSite: "Visit website",
    ctaText: "Is your company looking to ride with us?",
    ctaButton: "Contact us",
  },

  blogSection: {
    title: "Blog & news",
    subtitle: "News, tips and interesting stories from the world of taxis and mobility",
  },

  reviews: {
    title: "Customer reviews",
    subtitle: "Read what our happy customers say about us",
    countSuffix: "reviews",
    seeAllOnGoogle: "See all reviews on Google",
    readAllPrefix: "Read",
    readAllSuffix: "reviews from our satisfied customers",
    items: [
      {
        id: "1",
        name: "Pavol Horváth",
        rating: 5,
        date: "8 months ago",
        text: "Thank you – I don't know the driver's name, he drove me in a beautiful Passat. Thanks for the pleasant chat and helpfulness, you don't see that very often these days.",
        service: "City ride",
      },
      {
        id: "2",
        name: "Diana Švarcová",
        rating: 5,
        date: "3 years ago",
        text: "A really pleasant ride – the driver was attentive, polite and incredibly kind. For my next trip in Košice I will definitely use this taxi service. 💯",
        service: "Corporate transfer",
      },
      {
        id: "3",
        name: "Q Q",
        rating: 5,
        date: "2 months ago",
        text: "Thank you for the company's quick response. Warmly recommended. Very satisfied 🙂",
        service: "City ride",
      },
      {
        id: "4",
        name: "Katarína M.",
        rating: 5,
        date: "2026-03-28",
        text: "I needed a ride to the airport early in the morning. The driver was punctual and the trip went smoothly. Thank you!",
        service: "Airport transfer",
      },
      {
        id: "5",
        name: "Martin S.",
        rating: 4,
        date: "2026-03-20",
        text: "Good service, clean vehicles. A slight delay, but the driver let me know in advance. Satisfied overall.",
        service: "City ride",
      },
      {
        id: "6",
        name: "Lucia H.",
        rating: 5,
        date: "2026-03-15",
        text: "Excellent service! I booked online and everything went smoothly. I recommend it to anyone who needs reliable transport.",
        service: "Corporate transfer",
      },
    ],
  },

  faq: {
    title: "Frequently asked questions",
    subtitle: "Answers to the most common questions about our services",
    noAnswer: "Didn't find the answer to your question?",
    callUs: "Call us on +421 911 606 206",
    items: [
      {
        id: "1",
        question: "How quickly does the taxi arrive after booking?",
        answer:
          "We normally have a car with you within 10 minutes of a phone booking. For online bookings it depends on the pickup time you choose. During peak demand the time may increase slightly, but we will always keep you informed.",
      },
      {
        id: "2",
        question: "What payment methods do you accept?",
        answer:
          "We accept cash, payment cards (Visa, Mastercard), Google Pay, Apple Pay and bank transfer for corporate clients. For longer trips we recommend agreeing on the payment method in advance.",
      },
      {
        id: "3",
        question: "Can I book a taxi in advance?",
        answer:
          "Yes! We take advance bookings by phone on +421 911 606 206 or through our online form. We recommend booking at least 2 hours ahead, and ideally a day ahead for airport transfers.",
      },
      {
        id: "4",
        question: "Do you provide child seats?",
        answer:
          "Yes, child seats are provided free of charge. Please mention it when booking so we can send a vehicle with the right equipment. We have seats for various age groups.",
      },
      {
        id: "5",
        question: "Do you also drive outside Košice?",
        answer:
          "Of course! We provide transfers all over Slovakia and abroad. We regularly drive to airports (Košice, Budapest, Krakow), to Prague, Vienna and other cities. For long routes we offer attractive package prices.",
      },
      {
        id: "6",
        question: "How is the fare calculated?",
        answer:
          "The price consists of: a starting fee (€0.75/km), a per-kilometre rate (€1.50/km) and any surcharges (night, weekend, luggage). For an exact estimate, use our online form or give us a call.",
      },
      {
        id: "7",
        question: "Are all vehicles air-conditioned?",
        answer:
          "Yes, our entire fleet is equipped with air conditioning and WiFi. The vehicles are cleaned regularly and kept in perfect condition for your comfort.",
      },
      {
        id: "8",
        question: "Can I cancel or change my booking?",
        answer:
          "Yes, you can cancel or change your booking at any time by phone on +421 911 606 206. For cancellations less than 30 minutes before the planned pickup, a €5 handling fee may be charged.",
      },
      {
        id: "9",
        question: "Do you issue invoices for companies?",
        answer:
          "Yes, we issue invoices for corporate clients (we are not a VAT payer, so invoices are issued without VAT). Just provide your billing details when booking. We also offer monthly billing for regular cooperation.",
      },
      {
        id: "10",
        question: "How much luggage fits in the vehicle?",
        answer:
          "Standard vehicles (sedan) hold 2–3 pieces of large luggage plus hand luggage. For larger groups or more luggage we recommend an estate or a van, which can hold up to 6–8 suitcases.",
      },
    ],
  },

  bookingSection: {
    title: "Book a ride",
    textBeforePhone: "Fill in the form and we will get back to you. Or simply call us on ",
    noticeAdvance:
      "Please use this form only for rides planned at least 6 hours in advance, so we can be sure to process them in time. If you need a ride right away or sooner, call the dispatch or order through the E-TAXI Košice app.",
  },

  bookingForm: {
    heading: "Order a taxi online",
    from: "From",
    fromPlaceholder: "e.g. Hlavná 1, Košice",
    to: "To",
    toPlaceholder: "e.g. Košice Airport",
    when: "When",
    phone: "Phone",
    phonePlaceholder: "+421 XXX XXX XXX",
    email: "Email",
    emailPlaceholder: "your@email.com",
    passengers: "Passengers",
    select: "Select",
    personOne: "person",
    personFew: "people",
    personMany: "people",
    luggage: "Luggage",
    luggagePlaceholder: "e.g. 2 suitcases",
    flightNumber: "Flight number",
    flightPlaceholder: "e.g. FR1234",
    note: "Note",
    notePlaceholder: "e.g. child seat, different contact person...",
    estimateOnly: "Price quote only (non-binding)",
    submitQuote: "Get a price quote",
    submitOrder: "Order a taxi",
    validation: {
      pickup: "Enter a pickup location (min. 3 characters)",
      destination: "Enter a destination (min. 3 characters)",
      datetime: "Select a date and time",
      datetimeTooSoon:
        "Orders can be submitted at least 6 hours in advance. If you need a ride sooner, call the dispatch or use the E-TAXI Košice app.",
      phone: "Enter a valid phone number",
      email: "Enter a valid email address",
    },
    alerts: {
      success: "Your order has been received. We will keep you informed about its processing.",
      errorFallback: "There was an error sending your order. Please call +421 911 606 206",
      networkError: "❌ There was an error sending your order. Please call us directly on +421 911 606 206",
    },
  },

  footer: {
    blurb: "A professional taxi service in Košice and the surrounding area. Reliability, comfort and safety are our priorities.",
    servicesTitle: "Services",
    services: [
      { label: "Book a ride", href: "/#objednavka" },
      { label: "Our fleet", href: "/#vozovy-park" },
      { label: "Airport transfers", href: "/taxi-letisko-kosice" },
      { label: "Corporate transfers", href: "/sluzby-pre-firmy" },
      { label: "Košice – Budapest", href: "/transfer-kosice-budapest" },
      { label: "Košice – Krakow", href: "/transfer-kosice-krakow" },
      { label: "Košice – Katowice", href: "/transfer-kosice-katowice" },
      { label: "Košice – Vienna", href: "/transfer-kosice-viedna" },
    ],
    infoTitle: "Information",
    info: [
      { label: "Price list", href: "/cennik" },
      { label: "Terms of carriage", href: "/prepravny-poriadok" },
      { label: "Privacy policy", href: "/ochrana-osobnych-udajov" },
      { label: "FAQ", href: "/#faq" },
      { label: "Customer reviews", href: "/#recenzie" },
      { label: "Blog", href: "/#blog" },
    ],
    contactTitle: "Contact",
    emailLabel: "Email",
    location: "Košice, Slovakia",
    hours: "24/7 dispatch",
    downloadApp: "Download the app",
    rights: "All rights reserved.",
  },

  cookies: {
    title: "Cookies and personal data protection",
    intro: "This website uses cookies to improve your experience and for marketing purposes.",
    typesTitle: "We use the following types of cookies:",
    essentialLabel: "Essential cookies:",
    essentialText: "Required for the basic functioning of the site (remembering your preferences)",
    marketingLabel: "Marketing cookies (Google Ads):",
    marketingText:
      "We use Google Ads to target advertising and measure its effectiveness. These cookies track your activity on the web and may be used to display personalised ads.",
    consentBefore:
      "By clicking “Accept all” you agree to the storing of cookies on your device to enhance site navigation, analyse site usage and support our marketing activities, in accordance with our ",
    consentLink: "Privacy Policy",
    consentAfter: ".",
    gdprNote:
      "We process your personal data in accordance with the GDPR regulation (EU) 2016/679 and Slovak Act No. 18/2018 Coll. on personal data protection.",
    acceptAll: "Accept all",
    essentialOnly: "Essential only",
    rejectAll: "Reject all",
    changeNote: "You can change your decision at any time in your browser settings or by deleting cookies.",
  },

  pricingPage: {
    intro: "Transparent prices with no hidden fees. We are not VAT payers. The exact price is set in advance by the app.",
    importantTitle: "Important information",
    importantItems: [
      "Prices are indicative and may vary depending on the current traffic situation",
      "For longer routes a flat rate can be agreed in advance",
      "We issue invoices with bank-transfer payment for companies",
    ],
    ctaTitle: "Need a taxi?",
    ctaText: "Call us or book online",
  },

  termsPage: {
    title: "Terms of Carriage",
    intro:
      "Rules and conditions for the carriage of passengers by the E-TAXI Košice taxi service. These conditions are binding for all passengers and drivers.",
    sections: [
      {
        title: "1. Booking a ride",
        items: [
          "Bookings can be made by phone, via the online form or by SMS",
          "When booking, state the pickup point, destination, time and number of passengers",
          "You will receive a booking confirmation within 5 minutes",
          "You can cancel a reservation no later than 30 minutes before the scheduled time",
        ],
      },
      {
        title: "2. Boarding the vehicle",
        items: [
          "The driver will identify themselves by name and by the vehicle's registration plate",
          "When boarding, check that the taximeter is switched on",
          "Passengers have the right to ask for the driver's ID and the passenger transport licence",
          "Smoking and drinking alcohol are prohibited in the taxi",
        ],
      },
      {
        title: "3. Luggage",
        items: [
          "Standard luggage (up to 23 kg) is included in the fare",
          "Oversized luggage may be subject to a surcharge according to the price list",
          "The driver is obliged to help with loading and unloading heavy luggage",
          "The taxi service is liable for luggage damage caused by the driver",
        ],
      },
      {
        title: "4. Payment for the ride",
        items: [
          "Payment is possible in cash or by card directly in the vehicle",
          "You will receive a payment confirmation at the end of the ride",
          "The price is determined according to the valid price list",
          "When paying by card, an invoice can be issued for companies",
        ],
      },
      {
        title: "5. Complaints",
        items: [
          "Complaints can be submitted by phone or email within 7 days",
          "State the date, time, vehicle number and the reason for the complaint",
          "You will receive a response to your complaint within 3 working days",
          "Justified complaints will be resolved with financial compensation or a discount",
        ],
      },
      {
        title: "6. Safety and liability",
        items: [
          "All vehicles are regularly inspected and serviced",
          "Drivers hold valid medical examinations and certificates",
          "Vehicles are equipped with GPS and camera systems for your safety",
          "The taxi service holds accident and injury insurance",
        ],
      },
    ],
    validFromLabel: "Valid from:",
    validFromValue: "1 January 2026",
    validNote: "These rules may be updated at any time. The current version is always available on this page.",
  },

  privacyPage: {
    title: "Privacy Policy",
    subtitle: "Your privacy is our priority",
    validFrom: "Valid from: 30 April 2026",
    s1: {
      title: "1. Data controller",
      boxTitle: "Controller:",
      nameLabel: "Name:",
      nameValue: "E-TAXI Košice",
      addressLabel: "Address:",
      addressValue: "Košice, Slovakia",
      emailLabel: "E-mail:",
      phoneLabel: "Phone:",
    },
    s2: {
      title: "2. Legal basis for processing",
      intro: "We process your personal data in accordance with:",
      items: [
        "Regulation (EU) 2016/679 of the European Parliament and of the Council (GDPR)",
        "Slovak Act No. 18/2018 Coll. on personal data protection, as amended",
        "Slovak Act No. 22/2004 Coll. on electronic commerce",
      ],
    },
    s3: {
      title: "3. What personal data we process",
      sub1Title: "3.1 When booking a taxi:",
      sub1Items: ["First name and surname", "Phone number", "Pickup and destination address", "Date and time of the booking"],
      sub2Title: "3.2 Cookies and tracking technologies:",
      sub2Items: [
        "IP address",
        "Browser and device type",
        "Time of visit and pages viewed",
        "Google Ads data (for marketing purposes)",
      ],
    },
    s4: {
      title: "4. Purpose of processing personal data",
      sub1Title: "4.1 Providing services:",
      sub1Text: "We process the data necessary to provide the taxi service (performance of a contract)",
      sub2Title: "4.2 Marketing purposes:",
      sub2Text: "With your consent, we use Google Ads for:",
      sub2Items: [
        "Targeting relevant advertising",
        "Measuring the effectiveness of advertising campaigns",
        "Remarketing campaigns (showing ads based on your previous visit)",
        "Analysing user behaviour",
      ],
      sub3Title: "4.3 Improving our services:",
      sub3Text: "Analysing website usage to improve the user experience",
    },
    s5: {
      title: "5. Information about Google Ads",
      p1Before: "We use the ",
      p1Strong: "Google Ads",
      p1After: " service provided by Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).",
      p2: "Google Ads uses cookies to track your activity on the web and display personalised ads. Google may combine this data with other data it holds about you from other Google services.",
      rightsLabel: "Your rights:",
      rightsText: " You can opt out of Google personalised ads at any time at: ",
      moreInfoText: "More information about data processing by Google can be found at: ",
    },
    s6: {
      title: "6. Data retention period",
      items: [
        { label: "Bookings:", text: " 5 years (accounting and tax purposes)" },
        { label: "Marketing cookies:", text: " a maximum of 2 years or until consent is withdrawn" },
        { label: "Technical cookies:", text: " until the browser is closed or according to your settings" },
      ],
    },
    s7: {
      title: "7. Your rights",
      intro: "Under the GDPR, you have the right:",
      items: [
        { label: "Right of access:", text: " To find out what data we process about you" },
        { label: "Right to rectification:", text: " To correct inaccurate data" },
        { label: "Right to erasure:", text: " To request the deletion of your data" },
        { label: "Right to restriction:", text: " To restrict the processing of your data" },
        { label: "Right to data portability:", text: " To receive your data in a machine-readable format" },
        { label: "Right to object:", text: " To object to processing for marketing purposes" },
        { label: "Right to withdraw consent:", text: " To withdraw your consent to processing at any time" },
      ],
    },
    s8: {
      title: "8. Contact for exercising your rights",
      intro: "You can exercise your rights by contacting the controller at:",
      complaintBefore: "You also have the right to lodge a complaint with the ",
      complaintStrong: "Office for Personal Data Protection of the Slovak Republic",
      complaintAfter: " (www.dataprotection.gov.sk)",
    },
    s9: {
      title: "9. Changes to this policy",
      text: "We may update this policy from time to time. Changes will be published on this page together with the date of the last update.",
    },
    back: "← Back to the home page",
  },

  notFound: {
    title: "404 - Page Not Found",
    message: "Sorry, we couldn't find the page you requested. This page may have been moved, deleted, or never existed.",
    back: "Return to home page",
  },

  bookingEmail: {
    subject: "Order confirmation - E-TAXI Košice",
    greeting: "Hello,",
    intro: "Your taxi order has been received. We will keep you informed about its processing.",
    detailsTitle: "ORDER DETAILS",
    detailsTitleHtml: "Order details:",
    from: "From:",
    to: "To:",
    when: "When:",
    persons: "Passengers:",
    typeEstimate: "Type: Price quote",
    typeOrder: "Type: Confirmed order",
    changesText: "If you need to make changes or have any questions, contact us:",
    changesTextHtml: "If you need to make changes or have any questions:",
    sign: "Best regards,\nThe E-TAXI Košice team",
    headerSubtitle: "Order confirmation",
    receivedTitle: "Your order has been received",
    receivedText: "We will keep you informed about its processing.",
    thanks: "Thank you for choosing E-TAXI Košice",
  },
};
