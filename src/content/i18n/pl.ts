import type { LocaleContent } from "./types";

const PHONE = "+421 911 606 206";

export const pl: LocaleContent = {
  ui: {
    home: "Strona główna",
    orderRide: "Zamów przejazd",
    orderTransfer: "Zamów transfer",
    faqTitle: "Najczęstsze pytania",
    relatedTitle: "Inne transfery",
    fullPriceList: "Pełny cennik",
    factPrice: "Cena",
    factRoute: "Trasa",
    factDistance: "Odległość",
    factDuration: "Czas przejazdu",
    perCar: (p) => `${p} za samochód`,
    price: (a, from) => `${from ? "od " : ""}${a} €`,
    ctaTitle: (r) => `Zamów transfer: ${r}`,
    ctaText: (p) => `Stała cena ${p} za samochód. Jeździmy całą dobę i odbieramy spod drzwi lub z dowolnego wskazanego miejsca.`,
    detail: "Szczegóły transferu →",
    pickupBullets: [
      "wyjazd o dowolnej porze, także do porannych i nocnych lotów",
      "bezpośredni przejazd bez przesiadek i bez zabierania innych pasażerów",
      "monitorowanie lotu – kierowca poczeka także przy opóźnieniu",
      "fotelik dziecięcy gratis, przestronne kombi na więcej bagażu",
      "elektryczna Tesla na życzenie, także na długich trasach",
    ],
  },
  benefitsTitle: "Dlaczego indywidualny transfer z E-TAXI",
  benefitsLead:
    "Nie jeździmy według rozkładu ani w stałych odstępach. Każdy transfer jest indywidualny i dopasowany do Ciebie: to Ty wybierasz godzinę, miejsce odbioru i cel – transport dostosowuje się do Ciebie, a nie odwrotnie.",
  benefits: [
    { title: "Transfer prywatny, nie wspólny bus", text: "W samochodzie jedziesz tylko Ty i Twoi towarzysze. Nie zbieramy innych pasażerów i nie czekasz na odjazd według rozkładu – godzinę wyznacza Twój lot." },
    { title: "Spod drzwi aż pod terminal", text: "Odbieramy Cię spod domu, z wybranego miejsca lub sprzed terminalu i zawozimy dokładnie tam, gdzie potrzebujesz." },
    { title: "O każdej porze, 24/7", text: "Jeździmy o każdej godzinie, także do wczesnych odlotów i późnych przylotów. Dyspozytornia działa bez przerwy." },
    { title: "Rezerwacja z wyprzedzeniem dla spokoju", text: "Zamów transfer wcześniej na konkretną godzinę – samochód podjedzie punktualnie. Rezerwacja jest bezpłatna." },
    { title: "Zamówienie natychmiastowe, gdy się spieszysz", text: "Musisz jechać teraz? Zadzwoń lub zamów w aplikacji, a najbliższy wolny samochód ruszy po Ciebie." },
    { title: "Także na fakturę", text: "Firmom wystawiamy faktury, przy stałej współpracy z rozliczeniem miesięcznym. Nie jesteśmy płatnikiem VAT." },
    { title: "Płatność kartą", text: "W każdym samochodzie zapłacisz kartą bez dopłat, także Google Pay i Apple Pay, albo gotówką." },
    { title: "Nowoczesne, wygodne fotele", text: "Nowoczesne, czyste, klimatyzowane samochody z wygodnymi fotelami, w których nawet długa podróż mija szybko." },
    { title: "Opcja bezemisyjna", text: "Na życzenie wysyłamy elektryczną Teslę – cicha, płynna jazda bez lokalnych emisji." },
    { title: "Profesjonalni kierowcy, bezpieczna jazda", text: "Doświadczeni kierowcy, którzy znają trasy na lotniska, jeżdżą ostrożnie i przestrzegają przepisów. Samochody są regularnie sprawdzane." },
    { title: "Niezawodność", text: "Na transfer możesz liczyć. Informujemy Cię SMS-em, a samochód możesz śledzić na mapie." },
    { title: "Stała cena za samochód", text: "Cenę znasz z góry i płacisz za cały samochód, nie za osobę. Bez ukrytych opłat." },
    { title: "Fotelik dziecięcy gratis", text: "Podróżujesz z dziećmi? Bezpłatnie przygotujemy fotelik – wystarczy podać to przy zamówieniu." },
    { title: "Monitorowanie lotu", text: "Przy odbiorze z lotniska śledzimy Twój lot i dopasowujemy godzinę odbioru do faktycznego przylotu, także przy opóźnieniu." },
    { title: "Powitanie z tabliczką", text: "Na życzenie kierowca czeka w hali przylotów z tabliczką z Twoim nazwiskiem." },
    { title: "Pomoc z bagażem", text: "Kierowca pomoże z walizkami. Więcej bagażu lub narty? Wystarczy zaznaczyć w zamówieniu." },
    { title: "Postój po drodze", text: "Chcesz po drodze kogoś zabrać lub zrobić przerwę? Ustal postój przy zamówieniu." },
  ],
  orderStepsTitle: "Jak zamówić transfer",
  orderSteps: [
    { title: "Zamów", text: `Zadzwoń całą dobę pod numer ${PHONE}, wypełnij formularz online lub skorzystaj z aplikacji E-TAXI. Firmy mogą zamawiać przez formularz Taxximo.` },
    { title: "Podaj szczegóły", text: "Adres odbioru, cel, datę i godzinę, numer lotu, liczbę osób i bagaży, a w razie potrzeby fotelik dziecięcy lub dane do faktury." },
    { title: "Otrzymaj potwierdzenie", text: "Potwierdzamy zamówienie i przed przejazdem wysyłamy SMS. Kierowca przedstawia się imieniem i numerem rejestracyjnym." },
    { title: "Podróżuj spokojnie", text: "Kierowca odbiera Cię w umówionym miejscu i zawozi pod terminal lub pod adres. Płatność kartą, gotówką lub na fakturę." },
  ],
  priceSection: (r, p) => ({
    title: `Cena transferu ${r}`,
    paragraphs: [
      `Transfer ${r} kosztuje ${p} za cały samochód, nie za osobę. Cena jest stała, znana z góry i bez ukrytych opłat. Nie jesteśmy płatnikiem VAT, więc cena jest ostateczna.`,
      "Zapłacisz bez dopłat kartą, gotówką lub na fakturę. Firmom z regularnymi przejazdami oferujemy rozliczenie miesięczne.",
    ],
  }),
  commonFaq: (r, p) => [
    { question: `Ile kosztuje taxi ${r}?`, answer: `Transfer ${r} kosztuje ${p} za samochód, nie za osobę. Cena jest stała i znana z góry.` },
    { question: "Czy to wspólny przejazd?", answer: "Nie. To indywidualny transfer na zamówienie – w samochodzie jedziesz tylko Ty, a godzina wyjazdu zależy od Twojego lotu." },
    { question: "Co jeśli mój lot się opóźni?", answer: "Monitorujemy Twój lot. Podaj numer lotu w zamówieniu – kierowca poczeka na Ciebie także przy opóźnieniu." },
    { question: "Czy mogę zapłacić kartą lub na fakturę?", answer: "Tak, kartą bez dopłat (także Google Pay i Apple Pay), gotówką lub na fakturę. Nie jesteśmy płatnikiem VAT." },
    { question: "Czy zapewniacie foteliki dziecięce?", answer: "Tak, foteliki są bezpłatne. Wystarczy podać to przy zamówieniu." },
  ],
  hub: {
    navLabel: "Transfery lotniskowe",
    seoTitle: "Transfer lotniskowy z Koszyc – Kraków, Katowice, Rzeszów, Budapeszt | E-TAXI",
    seoDescription:
      "Indywidualne transfery lotniskowe z Koszyc (Košice) na lotniska w Koszycach, Budapeszcie, Krakowie, Katowicach, Wiedniu, Debreczynie, Bratysławie, Rzeszowie i Popradzie. Stała cena za samochód, 24/7, spod drzwi pod terminal.",
    keywords: "transfer lotniskowy Koszyce, taxi lotnisko Koszyce, transfer Koszyce Kraków, transfer Koszyce Rzeszów, transfer Koszyce Katowice, przewóz osób Koszyce",
    h1: "Transfery lotniskowe z Koszyc",
    lead:
      "Indywidualne transfery na lotniska w Koszycach, Budapeszcie, Krakowie, Katowicach, Wiedniu, Debreczynie, Bratysławie, Rzeszowie i Popradzie. Nie jeździmy w stałych odstępach: odbieramy Cię spod drzwi o wybranej godzinie i zawozimy pod terminal po stałej cenie za samochód.",
    chooseTitle: "Wybierz lotnisko",
    note: "Ceny dotyczą całego samochodu, nie osoby. Nie jesteśmy płatnikiem VAT.",
  },
  routes: {
    "taxi-letisko-kosice": {
      navLabel: "Taxi na lotnisko Koszyce",
      seoTitle: "Taxi lotnisko Koszyce (KSC) od 18 € | Transfer lotniskowy 24/7 | E-TAXI",
      seoDescription: "Taxi i transfer na lotnisko Koszyce i z lotniska od 18 €. Indywidualny przejazd spod drzwi pod terminal, 24/7, z wyprzedzeniem lub od razu, kartą lub na fakturę.",
      keywords: "taxi lotnisko Koszyce, transfer lotniskowy Koszyce, lotnisko Košice taxi, KSC transfer",
      h1: "Taxi i transfer na lotnisko Koszyce i z powrotem",
      lead: "Zawieziemy Cię z domu, hotelu lub biura na lotnisko w Koszycach, a po wylądowaniu odbierzemy sprzed terminalu. Całą dobę, o wybranej godzinie, od 18 €.",
      distance: "kilka km od centrum",
      duration: "zwykle 15–20 min",
      routeLabel: "Koszyce – lotnisko Koszyce (KSC)",
      intro: { title: "Transfer lotniskowy w Koszycach bez stresu", paragraphs: [
        "Lotnisko w Koszycach leży zaledwie kilka kilometrów na południowy zachód od centrum. Przy wczesnym locie, z walizkami czy dziećmi warto jednak mieć pewny przejazd. E-TAXI odbierze Cię dokładnie o wybranej godzinie spod domu, hotelu lub z innego miejsca w Koszycach i okolicy i zawiezie pod halę odlotów.",
        "Bez parkowania na lotnisku i szukania autobusu. W transferze indywidualnym w samochodzie jedziesz tylko Ty, a przejazd dostosowuje się do Ciebie.",
      ] },
      route: { title: "Kiedy zamówić i kiedy wyjechać", paragraphs: [
        "Przy odlocie zalecamy zamówienie dzień wcześniej i przyjazd na lotnisko ok. dwie godziny przed odlotem. Przy przylocie wystarczy numer lotu – odbiór dopasujemy do faktycznego lądowania.",
        `Potrzebujesz przejazdu od razu? Zadzwoń pod ${PHONE}. Z Koszyc zawieziemy Cię także na lotniska w Budapeszcie, Krakowie, Katowicach, Rzeszowie czy Wiedniu.`,
      ] },
      pickup: { title: "Odbiór sprzed terminalu po wylądowaniu", paragraphs: [
        "Po wylądowaniu kierowca czeka przed halą przylotów lotniska w Koszycach. Zawieziemy Cię pod dowolny adres w Koszycach, Preszowie, Spiskiej Nowej Wsi, Michalowcach lub po uzgodnieniu gdzie indziej.",
      ] },
      tips: { title: "Dla hoteli, firm i gości", paragraphs: [
        "Hotele w Koszycach zamawiają u nas przejazdy lotniskowe dla gości, a firmy transfery dla pracowników i partnerów. Zamówienia telefonicznie, w aplikacji lub przez formularz Taxximo z przeglądem wszystkich przejazdów; rozliczenie miesięczne.",
      ] },
      faq: [
        { question: "Ile kosztuje taxi na lotnisko w Koszycach?", answer: "Transfer między Koszycami a lotniskiem kosztuje od 18 € za samochód. Dokładną cenę dla Twojego adresu poznasz z góry." },
        { question: "Czy mogę jechać wcześnie rano lub w nocy?", answer: "Tak, jeździmy całą dobę. Do wczesnych lotów najlepiej zamówić dzień wcześniej; rezerwacja jest bezpłatna." },
        { question: "Gdzie spotkam kierowcę po wylądowaniu?", answer: "Przed halą przylotów lotniska w Koszycach. Na życzenie czeka w hali z tabliczką z nazwiskiem." },
      ],
    },
    "transfer-kosice-budapest": {
      navLabel: "Transfer Koszyce – lotnisko Budapeszt",
      seoTitle: "Transfer lotniskowy Koszyce – Budapeszt (BUD) 250 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Indywidualny transfer z Koszyc na lotnisko Budapeszt Liszt Ferenc w stałej cenie 250 € za samochód. Spod drzwi pod terminal, 24/7, monitorowanie lotu, karta lub faktura.",
      keywords: "transfer lotniskowy Koszyce Budapeszt, taxi Koszyce Budapeszt, transfer Koszyce lotnisko Budapeszt",
      h1: "Taxi i transfer lotniskowy Koszyce – Budapeszt",
      lead: "Indywidualny transfer z Koszyc na lotnisko Budapeszt Liszt Ferenc – bez przesiadek, czekania na autobus i obcych pasażerów. Odbiór spod drzwi, przyjazd pod terminal, stała cena 250 € za samochód.",
      distance: "ok. 270 km",
      duration: "2,5–3 godz.",
      routeLabel: "Koszyce – lotnisko Budapeszt (BUD)",
      intro: { title: "Transfer indywidualny dopasowany do Twojego lotu", paragraphs: [
        "Budapeszt to największe lotnisko w zasięgu wschodniej Słowacji, z bezpośrednimi lotami po całej Europie i dalej. Autobusy i wspólne busy kursują jednak o stałych godzinach, zabierają po drodze innych pasażerów i to Ty musisz dostosować się do rozkładu.",
        "W E-TAXI jest odwrotnie. Nie jeździmy w odstępach – każdy transfer jest indywidualny. Ty wybierasz godzinę i miejsce odbioru, a my planujemy przejazd tak, abyś był przy terminalu na czas i bez długiego czekania.",
      ] },
      route: { title: "Trasa Koszyce – Budapeszt i czas przejazdu", paragraphs: [
        "Z Koszyc jedziemy przez przejście Milhosť – Tornyosnémeti, autostradą obok Miszkolca i obwodnicą M0 prosto na lotnisko. Odległość to ok. 270 km, przejazd trwa zwykle 2,5–3 godziny, zależnie od ruchu.",
        "Zalecamy być na lotnisku co najmniej dwie godziny przed odlotem, przy lotach poza strefę Schengen nieco wcześniej.",
      ] },
      pickup: { title: "Odbiór spod drzwi, przyjazd pod terminal", paragraphs: [
        "Odbierzemy Cię w Koszycach, okolicy, Preszowie lub po uzgodnieniu w dowolnym miejscu wschodniej Słowacji, zapakujemy bagaż i wysadzimy przed halą odlotów Terminalu 2. W drodze powrotnej kierowca czeka w hali przylotów lotniska w Budapeszcie.",
      ] },
      tips: { title: "Dla kogo jest transfer do Budapesztu", paragraphs: [
        "Dla rodzin, które nie chcą zostawiać auta tygodniami na lotnisku, dla firm w podróży służbowej i hoteli organizujących transfery gości. Wozimy też z lotniska w Budapeszcie do Koszyc, Preszowa lub centrum Budapesztu.",
      ] },
      faq: [
        { question: "Ile trwa przejazd z Koszyc na lotnisko w Budapeszcie?", answer: "Odległość to ok. 270 km, przejazd trwa zwykle 2,5–3 godziny." },
        { question: "Gdzie spotkam kierowcę na lotnisku w Budapeszcie?", answer: "W hali przylotów Terminalu 2, na życzenie z tabliczką. Wystarczy podać numer lotu." },
        { question: "Ile osób i bagaży się zmieści?", answer: "Do 4 osób. Na więcej walizek wyślemy przestronne kombi – zaznacz to przy zamówieniu." },
      ],
    },
    "transfer-kosice-krakow": {
      navLabel: "Transfer Koszyce – lotnisko Kraków",
      seoTitle: "Transfer lotniskowy Koszyce – Kraków (KRK) 290 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Indywidualny transfer z Koszyc na lotnisko Kraków-Balice lub do centrum Krakowa w stałej cenie 290 € za samochód. Spod drzwi pod terminal, 24/7, karta lub faktura.",
      keywords: "transfer lotniskowy Koszyce Kraków, taxi Koszyce Kraków, transfer Koszyce Kraków Balice, przewóz Koszyce Kraków",
      h1: "Taxi i transfer lotniskowy Koszyce – Kraków",
      lead: "Bezpośredni transfer indywidualny z Koszyc na lotnisko Kraków-Balice lub do centrum Krakowa. Bez przesiadek, bez rozkładu i obcych pasażerów – w stałej cenie 290 € za samochód.",
      distance: "ok. 270 km",
      duration: "3,5–4 godz.",
      routeLabel: "Koszyce – lotnisko Kraków (KRK)",
      intro: { title: "Do Krakowa bez przesiadek i rozkładu", paragraphs: [
        "Z lotniska w Krakowie startuje wiele bezpośrednich lotów niedostępnych z Koszyc. Transportem publicznym podróż jest długa i z kilkoma przesiadkami, a wspólne busy kursują tylko w wybrane dni.",
        "E-TAXI oferuje transfer szyty na miarę: wybierasz godzinę wyjazdu pod swój lot, odbieramy Cię spod drzwi i zawozimy pod terminal Międzynarodowego Portu Lotniczego im. Jana Pawła II Kraków-Balice.",
      ] },
      route: { title: "Trasa Koszyce – Kraków i czas przejazdu", paragraphs: [
        "Trasa prowadzi przez Preszów i północną Słowację do Polski. Odległość to ok. 270 km, przejazd trwa zwykle 3,5–4 godziny, zależnie od trasy, pogody i ruchu w okolicy Krakowa.",
        "Przy odlocie z Krakowa zalecamy wyjazd z Koszyc ok. sześć godzin wcześniej.",
      ] },
      pickup: { title: "Spod drzwi pod terminal – i z powrotem", paragraphs: [
        "Odbierzemy Cię z domu w Koszycach lub z wybranego miejsca i zawieziemy pod halę odlotów lub do hotelu w Krakowie. Przy przylocie kierowca czeka w hali przylotów.",
      ] },
      tips: { title: "Praktyczne wskazówki na drogę do Krakowa", paragraphs: [
        "Zimą pogoda na północy Słowacji i w Małopolsce może wydłużyć przejazd – przy porannych lotach zaplanuj większy zapas. Fotelik dziecięcy gratis; na narty lub dużo walizek wyślemy kombi.",
      ] },
      faq: [
        { question: "Ile trwa przejazd z Koszyc do Krakowa?", answer: "Ok. 3,5–4 godziny, około 270 km." },
        { question: "Czy wozicie też do centrum Krakowa?", answer: "Tak, na lotnisko lub pod dowolny adres w Krakowie." },
        { question: "Kiedy wyjechać z Koszyc?", answer: "Zalecamy ok. sześć godzin przed odlotem." },
      ],
    },
    "transfer-kosice-katowice": {
      navLabel: "Transfer Koszyce – lotnisko Katowice",
      seoTitle: "Transfer lotniskowy Koszyce – Katowice (KTW) 350 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Indywidualny transfer z Koszyc na lotnisko Katowice-Pyrzowice lub do Katowic w stałej cenie 350 € za samochód. Spod drzwi pod terminal, 24/7, karta lub faktura.",
      keywords: "transfer lotniskowy Koszyce Katowice, taxi Koszyce Katowice, transfer Katowice Pyrzowice Koszyce",
      h1: "Taxi i transfer lotniskowy Koszyce – Katowice",
      lead: "Indywidualny transfer z Koszyc na lotnisko Katowice-Pyrzowice lub pod adres w Katowicach. Bezpośrednio, bez przesiadek, o wybranej godzinie – w stałej cenie 350 € za samochód.",
      distance: "ok. 340 km",
      duration: "4–4,5 godz.",
      routeLabel: "Koszyce – lotnisko Katowice (KTW)",
      intro: { title: "Prosto do Katowic, bez wspólnego busa", paragraphs: [
        "Katowice-Pyrzowice to ważny port tanich linii i lotów wakacyjnych na południu Polski. Z Koszyc transportem publicznym dotrzesz tam tylko z kilkoma przesiadkami.",
        "E-TAXI zawiezie Cię indywidualnie: bez rozkładu i innych pasażerów. Wyjazd planujemy pod Twój lot i wysadzamy Cię pod terminalem.",
      ] },
      route: { title: "Trasa Koszyce – Katowice i czas przejazdu", paragraphs: [
        "Ze Słowacji jedziemy do Polski i drogami ekspresowymi w kierunku Katowic; lotnisko w Pyrzowicach leży na północ od miasta. Ok. 340 km, przejazd trwa zwykle 4–4,5 godziny. Zalecamy wyjazd sześć–siedem godzin przed odlotem.",
      ] },
      pickup: { title: "Pod terminal lub do miasta", paragraphs: [
        "Odbierzemy Cię w Koszycach lub po uzgodnieniu we wschodniej Słowacji i zawieziemy pod terminal albo do hotelu, na spotkanie czy do firmy w Katowicach i na Śląsku. W drodze powrotnej kierowca czeka w hali przylotów.",
      ] },
      tips: { title: "Praktyczne wskazówki", paragraphs: [
        "Katowice to jedno z najdalszych lotnisk, na które jeździmy; do porannych lotów często wyjeżdżamy w nocy. Przy rezerwacji samochód podjedzie punktualnie, a po drodze możesz spać w wygodnym fotelu. Przerwy według potrzeb.",
      ] },
      faq: [
        { question: "Ile trwa przejazd na lotnisko w Katowicach?", answer: "Ok. 4–4,5 godziny, około 340 km." },
        { question: "Czy wozicie też do Katowic?", answer: "Tak, na lotnisko Pyrzowice i pod dowolny adres w Katowicach i okolicy." },
      ],
    },
    "transfer-kosice-viedna": {
      navLabel: "Transfer Koszyce – lotnisko Wiedeń",
      seoTitle: "Transfer lotniskowy Koszyce – Wiedeń (VIE) 450 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Indywidualny transfer dalekobieżny z Koszyc na lotnisko Wiedeń-Schwechat lub do centrum Wiednia w stałej cenie 450 € za samochód. 24/7, karta lub faktura.",
      keywords: "transfer lotniskowy Koszyce Wiedeń, taxi Koszyce Wiedeń, transfer lotnisko Wiedeń Schwechat",
      h1: "Taxi i transfer lotniskowy Koszyce – Wiedeń",
      lead: "Indywidualny transfer dalekobieżny z Koszyc na lotnisko Wiedeń-Schwechat lub do centrum Wiednia. Wygodnie, bez przesiadek, o wybranej godzinie – w stałej cenie 450 € za samochód.",
      distance: "ok. 450–480 km",
      duration: "4,5–5 godz.",
      routeLabel: "Koszyce – lotnisko Wiedeń (VIE)",
      intro: { title: "Na lotnisko w Wiedniu bez pociągu i przesiadek", paragraphs: [
        "Wiedeń-Schwechat oferuje największy wybór lotów dalekodystansowych i transatlantyckich w regionie. Pociągiem podróż z Koszyc jest długa i z przesiadkami – z walizkami i wczesnym lotem bardzo męcząca.",
        "Z E-TAXI jedziesz spod drzwi pod terminal. Ty decydujesz o godzinie wyjazdu, a podróż wykorzystasz na odpoczynek lub pracę.",
      ] },
      route: { title: "Trasa Koszyce – Wiedeń i czas przejazdu", paragraphs: [
        "Zwykle jedziemy autostradą przez Słowację i Bratysławę, zależnie od ruchu także przez Węgry. Ok. 450–480 km, przejazd z krótką przerwą trwa zwykle 4,5–5 godzin. Zalecamy wyjazd co najmniej siedem godzin przed odlotem, przy lotach dalekodystansowych wcześniej.",
      ] },
      pickup: { title: "Pod terminal lub do centrum Wiednia", paragraphs: [
        "Odbierzemy Cię w Koszycach i zawieziemy pod halę odlotów lotniska w Wiedniu lub do hotelu i pod adres w Wiedniu. Przy przylocie kierowca czeka w hali przylotów, na życzenie z tabliczką – także przy opóźnieniu.",
      ] },
      tips: { title: "Praktyczne wskazówki", paragraphs: [
        "Linie lotnicze zalecają przy lotach dalekodystansowych przyjazd co najmniej trzy godziny przed odlotem; wyjazd planujemy z odpowiednim zapasem. Na życzenie także na tej długiej trasie pojedziesz elektryczną Teslą.",
      ] },
      faq: [
        { question: "Ile trwa przejazd z Koszyc na lotnisko w Wiedniu?", answer: "Zwykle 4,5–5 godzin, ok. 450–480 km." },
        { question: "Czy wozicie też do centrum Wiednia?", answer: "Tak, na lotnisko Schwechat i pod dowolny adres w Wiedniu." },
      ],
    },
    "transfer-kosice-debrecin": {
      navLabel: "Transfer Koszyce – lotnisko Debreczyn",
      seoTitle: "Transfer lotniskowy Koszyce – Debreczyn (DEB) 220 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Indywidualny transfer z Koszyc na lotnisko Debreczyn lub do miasta w stałej cenie 220 € za samochód. Ok. 2–2,5 godz., spod drzwi pod terminal, 24/7.",
      keywords: "transfer lotniskowy Koszyce Debreczyn, taxi Koszyce Debreczyn, transfer lotnisko Debrecen",
      h1: "Taxi i transfer lotniskowy Koszyce – Debreczyn",
      lead: "Nasz najkrótszy międzynarodowy transfer lotniskowy: z Koszyc na lotnisko w Debreczynie lub pod adres w mieście, bezpośrednio i bez przesiadek, w stałej cenie 220 € za samochód.",
      distance: "ok. 190 km",
      duration: "2–2,5 godz.",
      routeLabel: "Koszyce – lotnisko Debreczyn (DEB)",
      intro: { title: "Debreczyn – bliska alternatywa dla Budapesztu", paragraphs: [
        "Z lotniska w Debreczynie latają tanie linie do kilku miast Europy, a jest bliżej Koszyc niż Budapeszt. Bezpośredniego połączenia publicznego praktycznie nie ma.",
        "E-TAXI zawiezie Cię tam indywidualnie i bezpośrednio: wyjazd pod Twój lot, odbiór spod drzwi, przyjazd pod terminal.",
      ] },
      route: { title: "Trasa Koszyce – Debreczyn i czas przejazdu", paragraphs: [
        "Przez przejście Milhosť – Tornyosnémeti, obok Miszkolca i autostradą do Debreczyna. Ok. 190 km, przejazd trwa zwykle 2–2,5 godziny. Zalecamy wyjazd ok. cztery godziny przed odlotem.",
      ] },
      pickup: { title: "Pod terminal lub do miasta", paragraphs: [
        "Zawieziemy Cię pod terminal lotniska w Debreczynie lub pod adres w mieście – do firmy, na uniwersytet, do kliniki lub term. Przy przylocie kierowca czeka na lotnisku.",
      ] },
      tips: { title: "Praktyczne wskazówki", paragraphs: [
        "Lotnisko jest małe, odprawa zwykle szybsza niż w Budapeszcie; mimo to zaplanuj zapas na granicę i autostradę. Płacisz w euro – forinty nie są potrzebne.",
      ] },
      faq: [
        { question: "Ile trwa przejazd do Debreczyna?", answer: "Ok. 2–2,5 godziny, około 190 km." },
        { question: "Czy potrzebuję forintów?", answer: "Nie, płacisz w euro kartą, gotówką lub na fakturę." },
      ],
    },
    "transfer-kosice-bratislava": {
      navLabel: "Transfer Koszyce – Bratysława",
      seoTitle: "Transfer Koszyce – Bratysława i lotnisko BTS 390 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Indywidualny transfer z Koszyc do Bratysławy lub na lotnisko M. R. Štefánika w stałej cenie 390 € za samochód. Od drzwi do drzwi, 24/7, karta lub faktura.",
      keywords: "transfer Koszyce Bratysława, taxi Koszyce Bratysława, lotnisko Bratysława transfer",
      h1: "Taxi i transfer Koszyce – Bratysława",
      lead: "Ze wschodu na zachód Słowacji bez przesiadek i rozkładu pociągów czy autobusów. Z Koszyc zawieziemy Cię pod dowolny adres w Bratysławie lub na lotnisko M. R. Štefánika – stała cena 390 € za samochód.",
      distance: "ok. 400 km",
      duration: "4–4,5 godz.",
      routeLabel: "Koszyce – Bratysława / lotnisko BTS",
      intro: { title: "Z Koszyc do Bratysławy o wybranej godzinie", paragraphs: [
        "Pociąg i autobus jeżdżą według rozkładu, a na dworzec i z dworca potrzebujesz kolejnego transportu. Z E-TAXI wsiadasz przed domem i wysiadasz dokładnie tam, gdzie musisz – na spotkaniu, w urzędzie, klinice czy na lotnisku.",
      ] },
      route: { title: "Trasa i czas przejazdu", paragraphs: [
        "Jedziemy autostradami i drogami ekspresowymi przez środkową Słowację. Ok. 400 km, przejazd z krótką przerwą trwa zwykle 4–4,5 godziny.",
      ] },
      pickup: { title: "Pod adres w Bratysławie lub na lotnisko", paragraphs: [
        "Zawieziemy Cię do hotelu, firmy, ministerstwa, kliniki lub na lotnisko M. R. Štefánika. Jeśli lecisz z Wiednia, wybierz transfer Koszyce – Wiedeń. W drodze powrotnej odbierzemy Cię w Bratysławie.",
      ] },
      tips: { title: "Przewaga nad pociągiem i autobusem", paragraphs: [
        "Bez przesiadek, z miejscem na duży bagaż i czasem na pracę lub odpoczynek w wygodnym fotelu. Przy kilku pasażerach cena za samochód się dzieli – często korzystnie dla kolegów jadących na to samo spotkanie.",
      ] },
      faq: [
        { question: "Ile trwa przejazd?", answer: "Zwykle 4–4,5 godziny, ok. 400 km." },
        { question: "Czy wozicie też na lotnisko w Bratysławie?", answer: "Tak, na lotnisko M. R. Štefánika i pod dowolny adres w Bratysławie." },
      ],
    },
    "transfer-kosice-rzeszow": {
      navLabel: "Transfer Koszyce – lotnisko Rzeszów",
      seoTitle: "Transfer lotniskowy Koszyce – Rzeszów (RZE) 270 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Indywidualny transfer z Koszyc na lotnisko Rzeszów-Jasionka lub do Rzeszowa w stałej cenie 270 € za samochód. Spod drzwi pod terminal, 24/7, monitorowanie lotu.",
      keywords: "transfer lotniskowy Koszyce Rzeszów, taxi Koszyce Rzeszów, transfer Rzeszów Jasionka Koszyce, przewóz Koszyce Rzeszów",
      h1: "Taxi i transfer lotniskowy Koszyce – Rzeszów",
      lead: "Indywidualny transfer z Koszyc na lotnisko Rzeszów-Jasionka, najbliższe polskie lotnisko dla wschodniej Słowacji. Bezpośrednio, bez przesiadek, pod Twój lot – stała cena 270 € za samochód.",
      distance: "ok. 200 km",
      duration: "3–3,5 godz.",
      routeLabel: "Koszyce – lotnisko Rzeszów (RZE)",
      intro: { title: "Rzeszów – bliska polska alternatywa", paragraphs: [
        "Dla Koszyc, Preszowa i północy wschodniej Słowacji Rzeszów-Jasionka to często najbliższa alternatywa dla Budapesztu czy Krakowa. Połączeń publicznych prawie nie ma.",
        "E-TAXI zawiezie Cię indywidualnie, bez odstępów i innych pasażerów – odbiór spod drzwi, przyjazd pod terminal.",
      ] },
      route: { title: "Trasa i czas przejazdu", paragraphs: [
        "Przez Preszów i Svidník do przejścia Vyšný Komárnik – Barwinek, dalej przez Duklę i Krosno do Rzeszowa; lotnisko Jasionka leży na północ od miasta. Ok. 200 km, przejazd trwa zwykle 3–3,5 godziny. Zalecamy wyjazd ok. pięć godzin przed odlotem.",
      ] },
      pickup: { title: "Spod drzwi pod terminal", paragraphs: [
        "Odbiór w Koszycach, Preszowie lub w miejscu na trasie, przejazd pod terminal lub pod adres w Rzeszowie. W drodze powrotnej kierowca czeka na lotnisku.",
      ] },
      tips: { title: "Praktyczne wskazówki", paragraphs: [
        "Trasa przez Przełęcz Dukielską jest pagórkowata – zimą zaplanuj większy zapas. Płacisz w euro, złotówki nie są potrzebne.",
      ] },
      faq: [
        { question: "Ile trwa przejazd do Rzeszowa?", answer: "Ok. 3–3,5 godziny, około 200 km." },
        { question: "Czy możecie odebrać mnie w Preszowie?", answer: "Tak, w Preszowie lub w innym miejscu na trasie." },
      ],
    },
    "transfer-kosice-poprad": {
      navLabel: "Transfer Koszyce – lotnisko Poprad-Tatry",
      seoTitle: "Transfer Koszyce – lotnisko Poprad-Tatry (TAT) 170 € | Taxi 24/7 | E-TAXI",
      seoDescription: "Indywidualny transfer z Koszyc na lotnisko Poprad-Tatry, do Popradu i w Tatry Wysokie. Stała cena 170 € za samochód na lotnisko, 24/7, karta lub faktura.",
      keywords: "transfer Koszyce Poprad, lotnisko Poprad Tatry transfer, transfer Tatry Wysokie, taxi Koszyce Poprad",
      h1: "Taxi i transfer Koszyce – lotnisko Poprad-Tatry",
      lead: "Indywidualny transfer z Koszyc na lotnisko Poprad-Tatry, do Popradu lub prosto do hotelu w Tatrach Wysokich. Bez przesiadek, o wybranej godzinie – stała cena 170 € za samochód na lotnisko.",
      distance: "ok. 120 km",
      duration: "1–1,5 godz.",
      routeLabel: "Koszyce – lotnisko Poprad-Tatry (TAT)",
      intro: { title: "Do Popradu i w Tatry bez przesiadek", paragraphs: [
        "Poprad-Tatry to najwyżej położone międzynarodowe lotnisko Słowacji i brama do Tatr Wysokich. Z dworca czy lotniska do hotelu potrzeba zwykle kolejnego połączenia – często z nartami i walizkami.",
      ] },
      route: { title: "Trasa i czas przejazdu", paragraphs: [
        "Autostradą D1 przez Preszów i Lewoczę. Ok. 120 km, na lotnisko zwykle 1–1,5 godziny; Stary Smokowiec, Szczyrbskie Jezioro czy Tatrzańska Łomnica są nieco dalej.",
      ] },
      pickup: { title: "Lotnisko, Poprad lub hotel w Tatrach", paragraphs: [
        "Zawieziemy Cię pod terminal, na dworzec, do firmy w Popradzie lub prosto pod hotel w Tatrach Wysokich; cenę przejazdu do hotelu potwierdzamy przy zamówieniu. Przy przylocie kierowca czeka na lotnisku.",
      ] },
      tips: { title: "Tatry, narty i podróże służbowe", paragraphs: [
        "Z tej trasy korzystają narciarze, turyści, hotele i firmy. Na narty lub wózek dziecięcy wyślemy przestronne kombi i pomożemy z bagażem.",
      ] },
      faq: [
        { question: "Ile trwa przejazd na lotnisko Poprad-Tatry?", answer: "Zwykle 1–1,5 godziny, ok. 120 km." },
        { question: "Czy wozicie do hoteli w Tatrach Wysokich?", answer: "Tak, prosto pod hotel; cenę potwierdzamy przy zamówieniu." },
      ],
    },
  },
};
