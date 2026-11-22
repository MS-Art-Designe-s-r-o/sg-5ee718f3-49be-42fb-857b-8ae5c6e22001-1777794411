import type { LocaleContent } from "./types";

const PHONE = "+421 911 606 206";

export const de: LocaleContent = {
  ui: {
    home: "Startseite",
    orderRide: "Fahrt buchen",
    orderTransfer: "Transfer buchen",
    faqTitle: "Häufige Fragen",
    relatedTitle: "Weitere Transfers",
    fullPriceList: "Vollständige Preisliste",
    factPrice: "Preis",
    factRoute: "Strecke",
    factDistance: "Entfernung",
    factDuration: "Fahrzeit",
    perCar: (p) => `${p} pro Fahrzeug`,
    price: (a, from) => `${from ? "ab " : ""}${a} €`,
    ctaTitle: (r) => `Transfer buchen: ${r}`,
    ctaText: (p) => `Festpreis ${p} pro Fahrzeug. Wir fahren rund um die Uhr und holen Sie an Ihrer Haustür oder einem Ort Ihrer Wahl ab.`,
    detail: "Zum Transfer →",
    pickupBullets: [
      "Abfahrt jederzeit, auch zu frühen Morgen- und Nachtflügen",
      "direkte Fahrt ohne Umsteigen und ohne weitere Fahrgäste unterwegs",
      "Flugüberwachung – der Fahrer wartet auch bei Verspätung auf Sie",
      "Kindersitz kostenlos, geräumiger Kombi für mehr Gepäck",
      "Elektro-Tesla auf Wunsch, auch auf Langstrecken",
    ],
  },
  benefitsTitle: "Warum ein privater Transfer mit E-TAXI",
  benefitsLead:
    "Wir fahren nicht nach Fahrplan und nicht in festen Intervallen. Jeder Transfer ist privat und auf Sie zugeschnitten: Sie bestimmen Zeit, Abholort und Ziel – der Transport richtet sich nach Ihnen, nicht umgekehrt.",
  benefits: [
    { title: "Privattransfer statt Sammelshuttle", text: "Im Auto sitzen nur Sie und Ihre Mitreisenden. Wir sammeln keine weiteren Fahrgäste ein und Sie warten auf keine Abfahrtszeit – Ihr Flug gibt den Takt vor." },
    { title: "Von der Haustür bis vor das Terminal", text: "Wir holen Sie direkt vor Ihrem Haus, an einem Ort Ihrer Wahl oder vor dem Terminal ab und bringen Sie genau dorthin, wohin Sie möchten." },
    { title: "Jederzeit, 24/7", text: "Wir fahren zu jeder Uhrzeit, auch zu frühen Abflügen und späten Ankünften. Unsere Zentrale ist rund um die Uhr erreichbar." },
    { title: "Vorbestellung für Ruhe", text: "Buchen Sie Ihren Transfer im Voraus zu einer festen Uhrzeit – das Auto ist pünktlich da. Die Vorbestellung ist kostenlos." },
    { title: "Sofortbestellung für Eilige", text: "Sie müssen gleich los? Rufen Sie an oder buchen Sie in der App – das nächste freie Fahrzeug macht sich auf den Weg." },
    { title: "Auch auf Rechnung", text: "Firmen erhalten eine Rechnung, bei regelmäßiger Zusammenarbeit auch mit monatlicher Abrechnung. Wir sind nicht umsatzsteuerpflichtig." },
    { title: "Kartenzahlung", text: "In jedem Fahrzeug zahlen Sie ohne Aufpreis mit Karte, auch mit Google Pay und Apple Pay – oder bar." },
    { title: "Moderne, bequeme Sitze", text: "Moderne, saubere und klimatisierte Fahrzeuge mit bequemen Sitzen, in denen auch lange Fahrten schnell vergehen." },
    { title: "Emissionsfrei auf Wunsch", text: "Auf Wunsch schicken wir einen elektrischen Tesla – leise, ruhige Fahrt ohne lokale Emissionen." },
    { title: "Professionelle Fahrer, sichere Fahrt", text: "Erfahrene Fahrer, die die Flughafenstrecken kennen, umsichtig fahren und die Regeln einhalten. Unsere Fahrzeuge werden regelmäßig geprüft." },
    { title: "Zuverlässigkeit", text: "Auf Ihren Transfer ist Verlass. Wir informieren Sie per SMS und Sie können das Fahrzeug auf der Karte verfolgen." },
    { title: "Festpreis pro Fahrzeug", text: "Sie kennen den Preis vorab und zahlen für das ganze Auto, nicht pro Person. Ohne versteckte Kosten." },
    { title: "Kindersitz kostenlos", text: "Unterwegs mit Kindern? Wir stellen kostenlos einen Kindersitz bereit – geben Sie ihn einfach bei der Buchung an." },
    { title: "Flugüberwachung", text: "Bei Abholungen am Flughafen verfolgen wir Ihren Flug und passen die Abholzeit an die tatsächliche Ankunft an, auch bei Verspätung." },
    { title: "Empfang mit Namensschild", text: "Auf Wunsch erwartet Sie der Fahrer in der Ankunftshalle mit einem Schild mit Ihrem Namen." },
    { title: "Hilfe mit dem Gepäck", text: "Der Fahrer hilft Ihnen mit den Koffern. Mehr Gepäck oder Ski? Einfach bei der Buchung angeben." },
    { title: "Zwischenstopp unterwegs", text: "Möchten Sie unterwegs jemanden abholen oder eine Pause machen? Vereinbaren Sie den Halt bei der Buchung." },
  ],
  orderStepsTitle: "So buchen Sie Ihren Transfer",
  orderSteps: [
    { title: "Buchen", text: `Rufen Sie uns rund um die Uhr unter ${PHONE} an, nutzen Sie das Online-Formular oder die E-TAXI-App. Firmen können über das Taxximo-Webformular buchen.` },
    { title: "Details angeben", text: "Abholadresse, Ziel, Datum und Uhrzeit, Flugnummer, Anzahl der Personen und Gepäckstücke sowie bei Bedarf Kindersitz oder Rechnungsdaten." },
    { title: "Bestätigung erhalten", text: "Wir bestätigen Ihre Buchung und informieren Sie vor der Fahrt per SMS. Der Fahrer stellt sich mit Namen und Kennzeichen vor." },
    { title: "Entspannt reisen", text: "Der Fahrer holt Sie am vereinbarten Ort ab und bringt Sie bis vor das Terminal oder zur Adresse. Zahlung mit Karte, bar oder auf Rechnung." },
  ],
  priceSection: (r, p) => ({
    title: `Preis für den Transfer ${r}`,
    paragraphs: [
      `Der Transfer ${r} kostet ${p} für das ganze Fahrzeug, nicht pro Person. Der Preis ist fest, vorab bekannt und ohne versteckte Kosten. Wir sind nicht umsatzsteuerpflichtig, der Preis ist also endgültig.`,
      "Sie zahlen ohne Aufpreis mit Karte, bar oder auf Rechnung. Firmen mit regelmäßigen Fahrten bieten wir eine monatliche Abrechnung.",
    ],
  }),
  commonFaq: (r, p) => [
    { question: `Was kostet ein Taxi ${r}?`, answer: `Der Transfer ${r} kostet ${p} pro Fahrzeug, nicht pro Person. Der Preis ist fest und vorab bekannt.` },
    { question: "Ist das ein Sammeltransfer?", answer: "Nein. Es ist ein privater Transfer auf Bestellung – im Auto sitzen nur Sie und die Abfahrtszeit richtet sich nach Ihrem Flug." },
    { question: "Was passiert, wenn mein Flug Verspätung hat?", answer: "Wir überwachen Ihren Flug. Geben Sie die Flugnummer bei der Buchung an – der Fahrer wartet auch bei Verspätung auf Sie." },
    { question: "Kann ich mit Karte oder auf Rechnung zahlen?", answer: "Ja, mit Karte ohne Aufpreis (auch Google Pay und Apple Pay), bar oder auf Rechnung. Wir sind nicht umsatzsteuerpflichtig." },
    { question: "Gibt es Kindersitze?", answer: "Ja, Kindersitze sind kostenlos. Bitte bei der Buchung angeben." },
  ],
  hub: {
    navLabel: "Flughafentransfers",
    seoTitle: "Flughafentransfer ab Košice (Kaschau) – Budapest, Krakau, Wien | E-TAXI",
    seoDescription:
      "Private Flughafentransfers ab Košice zu den Flughäfen Košice, Budapest, Krakau, Kattowitz, Wien, Debrecen, Bratislava, Rzeszów und Poprad-Tatry. Festpreis pro Fahrzeug, 24/7, von Tür bis Terminal.",
    keywords: "Flughafentransfer Košice, Flughafentransfer Kaschau, Taxi Košice Flughafen, Privattransfer Košice, Transfer Košice Budapest, Transfer Košice Wien",
    h1: "Flughafentransfers ab Košice",
    lead:
      "Private Transfers zu den Flughäfen Košice, Budapest, Krakau, Kattowitz, Wien, Debrecen, Bratislava, Rzeszów und Poprad-Tatry. Wir fahren nicht in festen Intervallen: Wir holen Sie zur gewünschten Zeit an Ihrer Haustür ab und bringen Sie zum Festpreis pro Fahrzeug bis vor das Terminal.",
    chooseTitle: "Wählen Sie Ihren Flughafen",
    note: "Preise gelten pro Fahrzeug, nicht pro Person. Wir sind nicht umsatzsteuerpflichtig.",
  },
  routes: {
    "taxi-letisko-kosice": {
      navLabel: "Taxi zum Flughafen Košice",
      seoTitle: "Taxi Flughafen Košice (KSC) ab 18 € | Flughafentransfer 24/7 | E-TAXI",
      seoDescription: "Taxi und Flughafentransfer zum und vom Flughafen Košice ab 18 €. Privatfahrt von der Haustür bis vor das Terminal, 24/7, Vorbestellung oder Sofortbestellung, Karte oder Rechnung.",
      keywords: "Taxi Flughafen Košice, Flughafentransfer Košice, Flughafen Kaschau Taxi, KSC Transfer, Privattransfer Košice",
      h1: "Taxi und Transfer zum Flughafen Košice und zurück",
      lead: "Wir bringen Sie von zu Hause, vom Hotel oder vom Büro zum Flughafen Košice und holen Sie nach der Landung vor dem Terminal ab. Rund um die Uhr, zu Ihrer Wunschzeit, ab 18 €.",
      distance: "wenige km vom Zentrum",
      duration: "meist 15–20 Min.",
      routeLabel: "Košice – Flughafen Košice (KSC)",
      intro: { title: "Flughafentransfer in Košice ohne Stress", paragraphs: [
        "Der Flughafen Košice liegt nur wenige Kilometer südwestlich des Stadtzentrums. Bei einem frühen Flug, mit Koffern oder Kindern lohnt sich trotzdem eine verlässliche Fahrt. E-TAXI holt Sie genau zur gewünschten Zeit vor Ihrem Haus, Hotel oder an einem anderen Ort in Košice und Umgebung ab und bringt Sie bis vor die Abflughalle.",
        "Kein Parken am Flughafen, keine Suche nach Busverbindungen. Beim Privattransfer sitzen nur Sie im Auto und die Fahrt richtet sich nach Ihnen.",
      ] },
      route: { title: "Wann buchen und wann losfahren", paragraphs: [
        "Für Abflüge empfehlen wir, am Vortag zu buchen und etwa zwei Stunden vor dem Abflug am Flughafen zu sein. Bei Ankünften genügt die Flugnummer – wir passen die Abholzeit an die tatsächliche Landung an.",
        `Sie brauchen sofort eine Fahrt? Rufen Sie ${PHONE} an. Von Košice fahren wir Sie auch zu den Flughäfen Budapest, Krakau, Kattowitz, Rzeszów oder Wien.`,
      ] },
      pickup: { title: "Abholung vor dem Terminal nach der Landung", paragraphs: [
        "Nach der Landung wartet der Fahrer vor der Ankunftshalle des Flughafens Košice. Wir bringen Sie zu jeder Adresse in Košice, Prešov, Spišská Nová Ves, Michalovce oder nach Vereinbarung woanders hin.",
      ] },
      tips: { title: "Für Hotels, Firmen und Besucher", paragraphs: [
        "Hotels in Košice buchen bei uns Flughafenfahrten für ihre Gäste, Firmen Transfers für Mitarbeiter und Geschäftspartner. Buchung per Telefon, App oder Taxximo-Webformular mit Übersicht aller Fahrten; Abrechnung monatlich.",
      ] },
      faq: [
        { question: "Was kostet ein Taxi zum Flughafen Košice?", answer: "Der Transfer zwischen Košice und dem Flughafen Košice kostet ab 18 € pro Fahrzeug. Den genauen Preis für Ihre Abholadresse kennen Sie vorab." },
        { question: "Kann ich auch frühmorgens oder nachts fahren?", answer: "Ja, wir fahren rund um die Uhr. Bei frühen Flügen am besten am Vortag buchen; die Vorbestellung ist kostenlos." },
        { question: "Wo treffe ich den Fahrer nach der Landung?", answer: "Vor der Ankunftshalle des Flughafens Košice. Auf Wunsch wartet er in der Halle mit Namensschild." },
      ],
    },
    "transfer-kosice-budapest": {
      navLabel: "Transfer Košice – Flughafen Budapest",
      seoTitle: "Flughafentransfer Košice – Budapest (BUD) 250 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Privater Flughafentransfer von Košice (Kaschau) zum Flughafen Budapest Liszt Ferenc zum Festpreis von 250 € pro Fahrzeug. Von Tür bis Terminal, 24/7, Flugüberwachung, Karte oder Rechnung.",
      keywords: "Flughafentransfer Košice Budapest, Taxi Košice Budapest, Transfer Kaschau Budapest Flughafen, Privattransfer Košice Budapest",
      h1: "Taxi und Flughafentransfer Košice – Budapest",
      lead: "Privater Transfer von Košice zum Flughafen Budapest Liszt Ferenc – ohne Umsteigen, ohne Warten auf den Bus, ohne fremde Fahrgäste. Abholung an der Haustür, Ankunft vor dem Terminal, Festpreis 250 € pro Fahrzeug.",
      distance: "ca. 270 km",
      duration: "2,5–3 Std.",
      routeLabel: "Košice – Flughafen Budapest (BUD)",
      intro: { title: "Ein Privattransfer, der sich nach Ihrem Flug richtet", paragraphs: [
        "Budapest ist der größte Flughafen in Reichweite der Ostslowakei, mit Direktflügen in ganz Europa und darüber hinaus. Busse und Sammelshuttles fahren jedoch zu festen Zeiten, nehmen unterwegs weitere Fahrgäste auf und Sie müssen sich nach ihrem Fahrplan richten.",
        "Bei E-TAXI ist es umgekehrt. Wir fahren nicht in Intervallen – jeder Transfer ist privat. Sie bestimmen Zeit und Abholort, wir planen die Fahrt so, dass Sie pünktlich und ohne lange Wartezeit am Terminal sind.",
      ] },
      route: { title: "Strecke Košice – Budapest und Fahrzeit", paragraphs: [
        "Von Košice geht es über den Grenzübergang Milhosť – Tornyosnémeti und auf der Autobahn an Miskolc vorbei über den Autobahnring M0 direkt zum Flughafen. Die Entfernung beträgt etwa 270 km, die Fahrt dauert je nach Verkehr meist 2,5 bis 3 Stunden.",
        "Wir empfehlen, mindestens zwei Stunden vor dem Abflug am Flughafen zu sein, bei Flügen außerhalb des Schengen-Raums etwas früher.",
      ] },
      pickup: { title: "Abholung an der Haustür, Ankunft am Terminal", paragraphs: [
        "Wir holen Sie in Košice, in der Umgebung, in Prešov oder nach Vereinbarung überall in der Ostslowakei ab, laden das Gepäck ein und setzen Sie vor der Abflughalle von Terminal 2 ab. Auf dem Rückweg wartet der Fahrer in der Ankunftshalle des Flughafens Budapest.",
      ] },
      tips: { title: "Für wen eignet sich der Transfer nach Budapest", paragraphs: [
        "Für Familien, die ihr Auto nicht wochenlang am Flughafen parken wollen, für Firmen mit Geschäftsreisen und für Hotels, die Gästetransfers organisieren. Wir fahren auch vom Flughafen Budapest nach Košice, Prešov oder in die Budapester Innenstadt.",
      ] },
      faq: [
        { question: "Wie lange dauert die Fahrt von Košice zum Flughafen Budapest?", answer: "Die Entfernung beträgt etwa 270 km, die Fahrt dauert meist 2,5 bis 3 Stunden." },
        { question: "Wo treffe ich den Fahrer am Flughafen Budapest?", answer: "In der Ankunftshalle von Terminal 2, auf Wunsch mit Namensschild. Geben Sie einfach Ihre Flugnummer an." },
        { question: "Wie viele Personen und Gepäckstücke passen ins Auto?", answer: "Bis zu 4 Personen. Für mehr Koffer schicken wir einen geräumigen Kombi – bitte bei der Buchung angeben." },
      ],
    },
    "transfer-kosice-krakow": {
      navLabel: "Transfer Košice – Flughafen Krakau",
      seoTitle: "Flughafentransfer Košice – Krakau (KRK) 290 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Privater Transfer von Košice zum Flughafen Krakau-Balice oder in die Krakauer Innenstadt zum Festpreis von 290 € pro Fahrzeug. Von Tür bis Terminal, 24/7, Karte oder Rechnung.",
      keywords: "Flughafentransfer Košice Krakau, Taxi Košice Krakau, Transfer Kaschau Krakau, Krakau Balice Transfer",
      h1: "Taxi und Flughafentransfer Košice – Krakau",
      lead: "Direkter Privattransfer von Košice zum Flughafen Krakau-Balice oder ins Zentrum von Krakau. Ohne Umsteigen, ohne feste Abfahrtszeiten, ohne fremde Fahrgäste – zum Festpreis von 290 € pro Fahrzeug.",
      distance: "ca. 270 km",
      duration: "3,5–4 Std.",
      routeLabel: "Košice – Flughafen Krakau (KRK)",
      intro: { title: "Nach Krakau ohne Umsteigen und ohne Fahrplan", paragraphs: [
        "Der Flughafen Krakau bietet viele Direktflüge, die es ab Košice nicht gibt. Mit öffentlichen Verkehrsmitteln ist die Reise lang und mit mehreren Umstiegen verbunden; Sammelshuttles fahren nur an bestimmten Tagen.",
        "E-TAXI bietet einen privaten Transfer nach Maß: Sie wählen die Abfahrtszeit passend zu Ihrem Flug, wir holen Sie an der Haustür ab und bringen Sie bis vor das Terminal des Flughafens Johannes Paul II. Krakau-Balice.",
      ] },
      route: { title: "Strecke Košice – Krakau und Fahrzeit", paragraphs: [
        "Die Strecke führt über Prešov und die Nordslowakei nach Polen. Die Entfernung beträgt etwa 270 km, die Fahrt dauert meist 3,5 bis 4 Stunden, je nach Route, Wetter und Verkehr rund um Krakau.",
        "Für einen Abflug in Krakau empfehlen wir, etwa sechs Stunden vorher in Košice loszufahren.",
      ] },
      pickup: { title: "Von der Haustür bis zum Terminal – und zurück", paragraphs: [
        "Wir holen Sie zu Hause in Košice oder an einem Ort Ihrer Wahl ab und bringen Sie vor die Abflughalle oder zu Ihrem Hotel in Krakau. Bei der Ankunft wartet der Fahrer in der Ankunftshalle.",
      ] },
      tips: { title: "Praktische Tipps für die Fahrt nach Krakau", paragraphs: [
        "Im Winter kann das Wetter in der Nordslowakei und in Südpolen die Fahrzeit beeinflussen – planen Sie bei Morgenflügen mehr Reserve ein. Kindersitz kostenlos; für Ski oder viele Koffer schicken wir einen Kombi.",
      ] },
      faq: [
        { question: "Wie lange dauert die Fahrt von Košice nach Krakau?", answer: "Etwa 3,5 bis 4 Stunden bei rund 270 km." },
        { question: "Fahren Sie auch in die Krakauer Innenstadt?", answer: "Ja, zum Flughafen oder zu jeder Adresse in Krakau." },
        { question: "Wann sollte ich in Košice losfahren?", answer: "Wir empfehlen etwa sechs Stunden vor dem Abflug." },
      ],
    },
    "transfer-kosice-katowice": {
      navLabel: "Transfer Košice – Flughafen Kattowitz",
      seoTitle: "Flughafentransfer Košice – Kattowitz (KTW) 350 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Privater Transfer von Košice zum Flughafen Katowice-Pyrzowice oder nach Kattowitz zum Festpreis von 350 € pro Fahrzeug. Von Tür bis Terminal, 24/7, Karte oder Rechnung.",
      keywords: "Flughafentransfer Košice Kattowitz, Taxi Košice Katowice, Transfer Katowice Pyrzowice, Privattransfer Košice Kattowitz",
      h1: "Taxi und Flughafentransfer Košice – Kattowitz",
      lead: "Privater Transfer von Košice zum Flughafen Katowice-Pyrzowice oder zu einer Adresse in Kattowitz. Direkt, ohne Umsteigen, zu Ihrer Wunschzeit – zum Festpreis von 350 € pro Fahrzeug.",
      distance: "ca. 340 km",
      duration: "4–4,5 Std.",
      routeLabel: "Košice – Flughafen Kattowitz (KTW)",
      intro: { title: "Direkt nach Kattowitz, ohne Sammelshuttle", paragraphs: [
        "Katowice-Pyrzowice ist ein wichtiges Drehkreuz für Billig- und Urlaubsflüge in Südpolen. Von Košice gelangen Sie mit öffentlichen Verkehrsmitteln nur mit mehreren Umstiegen dorthin.",
        "E-TAXI fährt Sie privat: kein Fahrplan, keine weiteren Fahrgäste. Wir planen die Abfahrt nach Ihrem Flug und setzen Sie vor dem Terminal ab.",
      ] },
      route: { title: "Strecke Košice – Kattowitz und Fahrzeit", paragraphs: [
        "Die Strecke führt von der Slowakei nach Polen und über Schnellstraßen Richtung Kattowitz; der Flughafen Pyrzowice liegt nördlich der Stadt. Etwa 340 km, Fahrzeit meist 4 bis 4,5 Stunden. Wir empfehlen, sechs bis sieben Stunden vor dem Abflug loszufahren.",
      ] },
      pickup: { title: "Zum Terminal oder in die Stadt", paragraphs: [
        "Wir holen Sie in Košice oder nach Vereinbarung in der Ostslowakei ab und bringen Sie zum Terminal oder zu Hotel, Termin oder Firma in Kattowitz und Schlesien. Bei der Rückkehr wartet der Fahrer in der Ankunftshalle.",
      ] },
      tips: { title: "Praktische Tipps", paragraphs: [
        "Kattowitz gehört zu den entferntesten Flughäfen, die wir anfahren; zu Morgenflügen starten wir oft nachts. Mit Vorbestellung steht das Auto pünktlich vor der Tür und Sie können unterwegs im bequemen Sitz schlafen. Pausen nach Bedarf.",
      ] },
      faq: [
        { question: "Wie lange dauert die Fahrt zum Flughafen Kattowitz?", answer: "Etwa 4 bis 4,5 Stunden bei rund 340 km." },
        { question: "Fahren Sie auch in die Stadt Kattowitz?", answer: "Ja, zum Flughafen Pyrzowice und zu jeder Adresse in Kattowitz und Umgebung." },
      ],
    },
    "transfer-kosice-viedna": {
      navLabel: "Transfer Košice – Flughafen Wien",
      seoTitle: "Flughafentransfer Košice – Wien (VIE) 450 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Privater Langstreckentransfer von Košice (Kaschau) zum Flughafen Wien-Schwechat oder in die Wiener Innenstadt zum Festpreis von 450 € pro Fahrzeug. 24/7, Karte oder Rechnung.",
      keywords: "Flughafentransfer Košice Wien, Taxi Kaschau Wien, Transfer Košice Flughafen Wien Schwechat, Privattransfer Košice Wien",
      h1: "Taxi und Flughafentransfer Košice – Wien",
      lead: "Privater Langstreckentransfer von Košice zum Flughafen Wien-Schwechat oder in die Wiener Innenstadt. Bequem, ohne Umsteigen und zu Ihrer Wunschzeit – zum Festpreis von 450 € pro Fahrzeug.",
      distance: "ca. 450–480 km",
      duration: "4,5–5 Std.",
      routeLabel: "Košice – Flughafen Wien (VIE)",
      intro: { title: "Zum Flughafen Wien ohne Zug und Umsteigen", paragraphs: [
        "Wien-Schwechat bietet die größte Auswahl an Langstrecken- und Transatlantikflügen in der Region. Mit dem Zug ist die Reise von Košice lang und mit Umstiegen verbunden – mit Koffern und einem frühen Flug sehr anstrengend.",
        "Mit E-TAXI reisen Sie von der Haustür bis zum Terminal. Sie bestimmen die Abfahrt und nutzen die Fahrt zum Ausruhen oder Arbeiten.",
      ] },
      route: { title: "Strecke Košice – Wien und Fahrzeit", paragraphs: [
        "Meist fahren wir auf der Autobahn durch die Slowakei über Bratislava, je nach Verkehr auch über Ungarn. Etwa 450 bis 480 km, Fahrzeit meist 4,5 bis 5 Stunden inklusive kurzer Pause. Wir empfehlen, mindestens sieben Stunden vor dem Abflug loszufahren, bei Langstreckenflügen mehr.",
      ] },
      pickup: { title: "Zum Terminal oder in die Wiener Innenstadt", paragraphs: [
        "Wir holen Sie in Košice ab und bringen Sie vor die Abflughalle des Flughafens Wien oder zu Hotel und Adresse in Wien. Bei der Ankunft wartet der Fahrer in der Ankunftshalle, auf Wunsch mit Namensschild – auch bei Verspätung.",
      ] },
      tips: { title: "Praktische Tipps", paragraphs: [
        "Fluggesellschaften empfehlen bei Langstreckenflügen mindestens drei Stunden vor Abflug am Flughafen zu sein; wir planen die Abfahrt mit ausreichender Reserve. Auf Wunsch fahren Sie auch auf dieser Langstrecke mit einem elektrischen Tesla.",
      ] },
      faq: [
        { question: "Wie lange dauert die Fahrt von Košice zum Flughafen Wien?", answer: "Meist 4,5 bis 5 Stunden bei etwa 450 bis 480 km." },
        { question: "Fahren Sie auch in die Wiener Innenstadt?", answer: "Ja, zum Flughafen Schwechat und zu jeder Adresse in Wien." },
      ],
    },
    "transfer-kosice-debrecin": {
      navLabel: "Transfer Košice – Flughafen Debrecen",
      seoTitle: "Flughafentransfer Košice – Debrecen (DEB) 220 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Privater Transfer von Košice zum Flughafen Debrecen oder in die Stadt zum Festpreis von 220 € pro Fahrzeug. Etwa 2–2,5 Std., von Tür bis Terminal, 24/7.",
      keywords: "Flughafentransfer Košice Debrecen, Taxi Košice Debrecen, Transfer Kaschau Debrecen",
      h1: "Taxi und Flughafentransfer Košice – Debrecen",
      lead: "Unser kürzester internationaler Flughafentransfer: von Košice zum Flughafen Debrecen oder zu einer Adresse in der Stadt, direkt und ohne Umsteigen, zum Festpreis von 220 € pro Fahrzeug.",
      distance: "ca. 190 km",
      duration: "2–2,5 Std.",
      routeLabel: "Košice – Flughafen Debrecen (DEB)",
      intro: { title: "Debrecen – die nahe Alternative zu Budapest", paragraphs: [
        "Der Flughafen Debrecen bietet Billigflüge in mehrere europäische Städte und liegt näher an Košice als Budapest. Direkte öffentliche Verbindungen gibt es praktisch nicht.",
        "E-TAXI bringt Sie privat und direkt hin: Abfahrt nach Ihrem Flug, Abholung an der Haustür, Ankunft vor dem Terminal.",
      ] },
      route: { title: "Strecke Košice – Debrecen und Fahrzeit", paragraphs: [
        "Über den Grenzübergang Milhosť – Tornyosnémeti, vorbei an Miskolc und auf der Autobahn nach Debrecen. Etwa 190 km, Fahrzeit meist 2 bis 2,5 Stunden. Wir empfehlen, etwa vier Stunden vor dem Abflug loszufahren.",
      ] },
      pickup: { title: "Zum Terminal oder in die Stadt", paragraphs: [
        "Wir bringen Sie zum Terminal des Flughafens Debrecen oder zu einer Adresse in Debrecen – Firma, Universität, Klinik oder Thermalbad. Bei der Ankunft wartet der Fahrer am Flughafen.",
      ] },
      tips: { title: "Praktische Tipps", paragraphs: [
        "Der Flughafen ist klein und die Abfertigung meist schneller als in Budapest; planen Sie trotzdem Reserve für Grenze und Autobahn ein. Sie zahlen in Euro – Forint brauchen Sie nicht.",
      ] },
      faq: [
        { question: "Wie lange dauert die Fahrt nach Debrecen?", answer: "Etwa 2 bis 2,5 Stunden bei rund 190 km." },
        { question: "Brauche ich Forint?", answer: "Nein, Sie zahlen in Euro mit Karte, bar oder auf Rechnung." },
      ],
    },
    "transfer-kosice-bratislava": {
      navLabel: "Transfer Košice – Bratislava",
      seoTitle: "Transfer Košice – Bratislava & Flughafen BTS 390 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Privater Transfer von Košice nach Bratislava oder zum Flughafen M. R. Štefánik zum Festpreis von 390 € pro Fahrzeug. Von Tür zu Tür, 24/7, Karte oder Rechnung.",
      keywords: "Transfer Košice Bratislava, Taxi Košice Bratislava, Flughafen Bratislava Transfer, Privattransfer Košice Bratislava",
      h1: "Taxi und Transfer Košice – Bratislava",
      lead: "Vom Osten in den Westen der Slowakei ohne Umsteigen und ohne Zug- oder Busfahrplan. Wir bringen Sie von Košice zu jeder Adresse in Bratislava oder zum Flughafen M. R. Štefánik – Festpreis 390 € pro Fahrzeug.",
      distance: "ca. 400 km",
      duration: "4–4,5 Std.",
      routeLabel: "Košice – Bratislava / Flughafen BTS",
      intro: { title: "Von Košice nach Bratislava zu Ihrer Wunschzeit", paragraphs: [
        "Zug und Bus fahren nach Fahrplan, und zum Bahnhof und vom Bahnhof brauchen Sie weitere Verkehrsmittel. Mit E-TAXI steigen Sie vor Ihrer Haustür ein und genau dort aus, wo Sie hinmüssen – ob Geschäftstermin, Behörde, Klinik oder Flughafen.",
      ] },
      route: { title: "Strecke und Fahrzeit", paragraphs: [
        "Wir fahren auf Autobahnen und Schnellstraßen durch die Mittelslowakei. Etwa 400 km, Fahrzeit meist 4 bis 4,5 Stunden inklusive kurzer Pause.",
      ] },
      pickup: { title: "Zur Adresse in Bratislava oder zum Flughafen", paragraphs: [
        "Wir bringen Sie zu Hotel, Firma, Ministerium, Klinik oder Flughafen M. R. Štefánik. Wenn Sie ab Wien fliegen, nutzen Sie unseren Transfer Košice – Wien. Auf dem Rückweg holen wir Sie in Bratislava ab.",
      ] },
      tips: { title: "Vorteile gegenüber Zug und Bus", paragraphs: [
        "Kein Umsteigen, Platz für großes Gepäck, Zeit zum Arbeiten oder Ausruhen im bequemen Sitz. Bei mehreren Fahrgästen teilt sich der Preis pro Fahrzeug – oft günstig für Kollegen auf dem Weg zum selben Termin.",
      ] },
      faq: [
        { question: "Wie lange dauert die Fahrt?", answer: "Meist 4 bis 4,5 Stunden bei etwa 400 km." },
        { question: "Fahren Sie auch zum Flughafen Bratislava?", answer: "Ja, zum Flughafen M. R. Štefánik und zu jeder Adresse in Bratislava." },
      ],
    },
    "transfer-kosice-rzeszow": {
      navLabel: "Transfer Košice – Flughafen Rzeszów",
      seoTitle: "Flughafentransfer Košice – Rzeszów (RZE) 270 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Privater Transfer von Košice zum Flughafen Rzeszów-Jasionka oder nach Rzeszów zum Festpreis von 270 € pro Fahrzeug. Von Tür bis Terminal, 24/7, Flugüberwachung.",
      keywords: "Flughafentransfer Košice Rzeszów, Taxi Košice Rzeszów, Rzeszów Jasionka Transfer",
      h1: "Taxi und Flughafentransfer Košice – Rzeszów",
      lead: "Privater Transfer von Košice zum Flughafen Rzeszów-Jasionka, dem nächstgelegenen polnischen Flughafen zur Ostslowakei. Direkt, ohne Umsteigen, passend zu Ihrem Flug – Festpreis 270 € pro Fahrzeug.",
      distance: "ca. 200 km",
      duration: "3–3,5 Std.",
      routeLabel: "Košice – Flughafen Rzeszów (RZE)",
      intro: { title: "Rzeszów – nahe polnische Alternative", paragraphs: [
        "Für Košice, Prešov und den Norden der Ostslowakei ist Rzeszów-Jasionka oft die nächste Alternative zu Budapest oder Krakau. Öffentliche Verbindungen fehlen fast völlig.",
        "E-TAXI fährt Sie privat, ohne Intervalle und ohne weitere Fahrgäste – Abholung an der Haustür, Ankunft am Terminal.",
      ] },
      route: { title: "Strecke und Fahrzeit", paragraphs: [
        "Über Prešov und Svidník zum Grenzübergang Vyšný Komárnik – Barwinek und weiter über Dukla und Krosno nach Rzeszów; der Flughafen Jasionka liegt nördlich der Stadt. Etwa 200 km, Fahrzeit meist 3 bis 3,5 Stunden. Wir empfehlen, etwa fünf Stunden vor dem Abflug loszufahren.",
      ] },
      pickup: { title: "Von der Haustür bis zum Terminal", paragraphs: [
        "Abholung in Košice, Prešov oder an einem Ort auf der Strecke, Fahrt zum Terminal oder zu einer Adresse in Rzeszów. Bei der Rückkehr wartet der Fahrer am Flughafen.",
      ] },
      tips: { title: "Praktische Tipps", paragraphs: [
        "Die Strecke über den Dukla-Pass ist hügelig – im Winter mehr Reserve einplanen. Bezahlung in Euro, Złoty sind nicht nötig.",
      ] },
      faq: [
        { question: "Wie lange dauert die Fahrt nach Rzeszów?", answer: "Etwa 3 bis 3,5 Stunden bei rund 200 km." },
        { question: "Können Sie mich in Prešov abholen?", answer: "Ja, in Prešov oder an einem anderen Ort auf der Strecke." },
      ],
    },
    "transfer-kosice-poprad": {
      navLabel: "Transfer Košice – Flughafen Poprad-Tatry",
      seoTitle: "Transfer Košice – Flughafen Poprad-Tatry (TAT) 170 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Privater Transfer von Košice zum Flughafen Poprad-Tatry, nach Poprad und in die Hohe Tatra. Festpreis 170 € pro Fahrzeug zum Flughafen, 24/7, Karte oder Rechnung.",
      keywords: "Transfer Košice Poprad, Flughafen Poprad Tatry Transfer, Transfer Hohe Tatra, Taxi Košice Poprad",
      h1: "Taxi und Transfer Košice – Flughafen Poprad-Tatry",
      lead: "Privater Transfer von Košice zum Flughafen Poprad-Tatry, nach Poprad oder direkt zu Ihrem Hotel in der Hohen Tatra. Ohne Umsteigen, zu Ihrer Wunschzeit – Festpreis 170 € pro Fahrzeug zum Flughafen.",
      distance: "ca. 120 km",
      duration: "1–1,5 Std.",
      routeLabel: "Košice – Flughafen Poprad-Tatry (TAT)",
      intro: { title: "Nach Poprad und in die Tatra ohne Umsteigen", paragraphs: [
        "Poprad-Tatry ist der höchstgelegene internationale Flughafen der Slowakei und das Tor zur Hohen Tatra. Vom Bahnhof oder Flughafen ins Hotel brauchen Sie sonst eine weitere Verbindung – oft mit Ski und Koffern.",
      ] },
      route: { title: "Strecke und Fahrzeit", paragraphs: [
        "Auf der Autobahn D1 über Prešov und Levoča. Etwa 120 km, Fahrzeit zum Flughafen meist 1 bis 1,5 Stunden; Orte wie Starý Smokovec, Štrbské Pleso oder Tatranská Lomnica liegen etwas weiter.",
      ] },
      pickup: { title: "Flughafen, Poprad oder Hotel in der Tatra", paragraphs: [
        "Wir bringen Sie zum Terminal, zum Bahnhof, zu einer Firma in Poprad oder direkt vor Ihr Hotel in der Hohen Tatra; den Preis für Hotelfahrten bestätigen wir bei der Buchung. Bei der Ankunft wartet der Fahrer am Flughafen.",
      ] },
      tips: { title: "Tatra, Skifahren und Geschäftsreisen", paragraphs: [
        "Skifahrer, Wanderer, Hotels und Firmen nutzen diese Strecke. Für Ski oder Kinderwagen schicken wir einen geräumigen Kombi und helfen mit dem Gepäck.",
      ] },
      faq: [
        { question: "Wie lange dauert die Fahrt zum Flughafen Poprad-Tatry?", answer: "Meist 1 bis 1,5 Stunden bei etwa 120 km." },
        { question: "Fahren Sie auch zu Hotels in der Hohen Tatra?", answer: "Ja, direkt zu Ihrem Hotel; den Preis bestätigen wir bei der Buchung." },
      ],
    },
  },
};
