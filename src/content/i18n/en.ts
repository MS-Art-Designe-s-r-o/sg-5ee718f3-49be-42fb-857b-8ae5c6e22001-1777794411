import type { LocaleContent } from "./types";

const PHONE = "+421 911 606 206";

export const en: LocaleContent = {
  ui: {
    home: "Home",
    orderRide: "Book a ride",
    orderTransfer: "Book a transfer",
    faqTitle: "Frequently asked questions",
    relatedTitle: "Related transfers",
    fullPriceList: "Full price list",
    factPrice: "Price",
    factRoute: "Route",
    factDistance: "Distance",
    factDuration: "Travel time",
    perCar: (p) => `${p} per vehicle`,
    price: (a, from) => `${from ? "from " : ""}€${a}`,
    ctaTitle: (r) => `Book your transfer ${r}`,
    ctaText: (p) => `Fixed price ${p} per vehicle. We drive 24/7 and pick you up at your door or any place you choose.`,
    detail: "Transfer details →",
    pickupBullets: [
      "departure at any time, including early-morning and night flights",
      "direct ride with no changes and no other passengers picked up on the way",
      "flight monitoring – the driver waits for you even if your flight is delayed",
      "free child seat, spacious estate car for extra luggage",
      "electric Tesla on request, also for long-distance routes",
    ],
  },
  benefitsTitle: "Why a private transfer with E-TAXI",
  benefitsLead:
    "We do not run on a timetable or at fixed intervals. Every transfer is private and tailored to you: you choose the time, the pickup point and the destination – the transport adapts to you, not the other way round.",
  benefits: [
    { title: "Private transfer, not a shuttle", text: "Only you and your companions travel in the car. We do not pick up other passengers and you never wait for a scheduled departure – your flight sets the time." },
    { title: "From your door to the terminal", text: "We pick you up right outside your home, at a place of your choice or in front of the terminal and take you exactly where you need to go." },
    { title: "Any time, 24/7", text: "We drive at any hour, including early-morning departures and late-night arrivals. Our dispatch works non-stop." },
    { title: "Pre-booking for peace of mind", text: "Book your transfer in advance for an exact time and be sure the car will be there. Pre-booking is free of charge." },
    { title: "Instant booking when you are in a hurry", text: "Need to go now? Call us or book in the app and the nearest available car will head your way." },
    { title: "Invoice available", text: "We issue invoices to companies, with monthly billing for regular clients. We are not VAT registered." },
    { title: "Card payment", text: "Pay by card in every car at no extra cost, including Google Pay and Apple Pay. Cash is accepted too." },
    { title: "Modern, comfortable seats", text: "Modern, clean, air-conditioned cars with comfortable seats that make a long journey pass quickly." },
    { title: "Zero-emission option", text: "On request we send an electric Tesla – quiet, smooth driving with no local emissions." },
    { title: "Professional drivers, safe driving", text: "Experienced drivers who know the airport routes, drive with care and follow the rules. Our cars are checked regularly." },
    { title: "Reliability", text: "You can rely on your transfer. We keep you updated by SMS and you can follow the car on a map." },
    { title: "Fixed price per vehicle", text: "You know the price in advance and pay for the whole car, not per person. No hidden fees." },
    { title: "Free child seat", text: "Travelling with children? We prepare a child seat free of charge – just mention it when booking." },
    { title: "Flight monitoring", text: "For airport pickups we monitor your flight and adjust the pickup time to the actual arrival, even if the plane is delayed." },
    { title: "Name-sign welcome", text: "On request, the driver waits for you in the arrivals hall with a sign showing your name." },
    { title: "Help with luggage", text: "The driver helps you with your suitcases. Extra luggage or skis? Just mention it in your booking." },
    { title: "Stop on the way", text: "Need to pick up another passenger or take a break on the way? Arrange the stop when booking." },
  ],
  orderStepsTitle: "How to book a transfer",
  orderSteps: [
    { title: "Book", text: `Call us 24/7 on ${PHONE}, fill in the online form or use the E-TAXI mobile app. Companies can book via the Taxximo web form.` },
    { title: "Add the details", text: "Pickup address, destination, date and time, flight number, number of passengers and luggage, and a child seat or invoice details if needed." },
    { title: "Get a confirmation", text: "We confirm your booking and send you an SMS before the ride. The driver introduces himself by name and licence plate." },
    { title: "Travel relaxed", text: "The driver picks you up at the agreed place and takes you to the terminal or your address. Pay by card, in cash or by invoice." },
  ],
  priceSection: (r, p) => ({
    title: `Price of the ${r} transfer`,
    paragraphs: [
      `The ${r} transfer costs ${p} for the whole vehicle, not per person. The price is fixed, known in advance and has no hidden fees. We are not VAT registered, so the price is final.`,
      "You can pay by card at no extra cost, in cash or by invoice. Companies with regular trips can use monthly billing.",
    ],
  }),
  commonFaq: (r, p) => [
    { question: `How much does a taxi ${r} cost?`, answer: `The ${r} transfer costs ${p} per vehicle, not per person. The price is fixed and known in advance.` },
    { question: "Is this a shared shuttle?", answer: "No. It is a private, on-demand transfer – only you travel in the car and the departure time follows your flight." },
    { question: "What if my flight is delayed?", answer: "We monitor your flight. Add your flight number to the booking and the driver will wait for you even if your flight is delayed." },
    { question: "Can I pay by card or by invoice?", answer: "Yes. Pay by card at no extra cost (also Google Pay and Apple Pay), in cash or by invoice. We are not VAT registered." },
    { question: "Do you provide child seats?", answer: "Yes, child seats are free of charge. Just mention it when booking." },
  ],
  hub: {
    navLabel: "Airport transfers",
    seoTitle: "Airport transfers from Košice – Budapest, Kraków, Vienna and more | E-TAXI",
    seoDescription:
      "Private airport transfers from Košice to Košice, Budapest, Kraków, Katowice, Vienna, Debrecen, Bratislava, Rzeszów and Poprad-Tatry airports. Fixed price per vehicle, 24/7, door to terminal.",
    keywords: "airport transfer Košice, Košice airport taxi, private transfer Košice, Košice Budapest airport transfer, Košice Krakow transfer, airport shuttle Košice",
    h1: "Airport transfers from Košice",
    lead:
      "Private transfers to the airports of Košice, Budapest, Kraków, Katowice, Vienna, Debrecen, Bratislava, Rzeszów and Poprad-Tatry. We do not run at fixed intervals: we pick you up at your door at the time that suits you and take you right to the terminal for a fixed price per vehicle.",
    chooseTitle: "Choose your airport",
    note: "Prices are per vehicle, not per person. We are not VAT registered.",
  },
  routes: {
    "taxi-letisko-kosice": {
      navLabel: "Košice Airport taxi",
      seoTitle: "Košice Airport taxi (KSC) from €18 | Airport transfer 24/7 | E-TAXI",
      seoDescription: "Taxi and airport transfer to and from Košice Airport from €18. Private ride from your door to the terminal, 24/7, pre-booking or instant booking, card payment or invoice.",
      keywords: "Košice airport taxi, taxi Košice airport, Košice airport transfer, KSC airport transfer, private transfer Košice",
      h1: "Taxi and transfer to and from Košice Airport",
      lead: "We take you to Košice Airport from your home, hotel or office and pick you up in front of the terminal when you land. We drive 24/7, at the time you choose, from €18.",
      distance: "a few km from the city centre",
      duration: "usually 15–20 min",
      routeLabel: "Košice – Košice Airport (KSC)",
      intro: { title: "A stress-free airport transfer in Košice", paragraphs: [
        "Košice Airport is only a few kilometres south-west of the city centre, but with an early flight, suitcases or children it pays to have a reliable ride. E-TAXI picks you up exactly when you want – outside your home, hotel or any other place in Košice and the surrounding area – and takes you right to the departures hall.",
        "No airport parking, no searching for a bus connection, no asking friends for a lift. A private transfer means only you travel in the car and the ride adapts to you.",
      ] },
      route: { title: "When to book and when to leave", paragraphs: [
        "For departures we recommend booking the day before and arriving at the airport about two hours before your flight. For arrivals, just send us your flight number – we adjust the pickup time to the actual landing time.",
        `Need a ride right now? Call ${PHONE} and the nearest available car will come for you. From Košice we can also take you to the airports in Budapest, Kraków, Katowice, Rzeszów or Vienna if your flight leaves from there.`,
      ] },
      pickup: { title: "Pickup in front of the terminal after landing", paragraphs: [
        "After you land, the driver waits for you in front of the arrivals hall of Košice Airport. We take you to any address in Košice, Prešov, Spišská Nová Ves, Michalovce or elsewhere by arrangement.",
      ] },
      tips: { title: "For hotels, companies and visitors to Košice", paragraphs: [
        "Hotels in Košice book airport pickups and drop-offs for their guests with us, and companies book transfers for employees and business partners. You can book by phone, in the app or via the Taxximo web form with an overview of all rides. We invoice monthly.",
      ] },
      faq: [
        { question: "How much does a taxi to Košice Airport cost?", answer: "A transfer between Košice and Košice Airport costs from €18 per vehicle. You will know the exact price for your pickup address in advance." },
        { question: "Can I book a taxi to the airport early in the morning or at night?", answer: "Yes, we drive 24/7. For early flights we recommend booking the day before; pre-booking is free." },
        { question: "Where will the driver meet me after landing?", answer: "In front of the arrivals hall of Košice Airport. On request the driver can wait inside the hall with a name sign." },
      ],
    },
    "transfer-kosice-budapest": {
      navLabel: "Košice – Budapest Airport transfer",
      seoTitle: "Košice – Budapest Airport (BUD) transfer €250 | Taxi 24/7 | E-TAXI",
      seoDescription: "Private airport transfer from Košice to Budapest Liszt Ferenc Airport for a fixed €250 per vehicle. Door to terminal, 24/7, flight monitoring, card payment or invoice.",
      keywords: "Košice Budapest airport transfer, taxi Košice Budapest, Košice to Budapest airport, private transfer Košice Budapest, Budapest airport shuttle from Košice",
      h1: "Taxi and transfer Košice – Budapest Airport",
      lead: "A private transfer from Košice to Budapest Liszt Ferenc Airport with no changes, no waiting for a bus and no other passengers. We pick you up at your door and take you right to the terminal for a fixed €250 per vehicle.",
      distance: "approx. 270 km",
      duration: "2.5–3 h",
      routeLabel: "Košice – Budapest Airport (BUD)",
      intro: { title: "A private transfer that adapts to your flight", paragraphs: [
        "Budapest is the largest airport within reach of eastern Slovakia, with direct flights across Europe and beyond. Getting there can be complicated: buses and shared shuttles leave at fixed times, pick up other passengers on the way and you have to fit their timetable.",
        "With E-TAXI it is the other way round. We do not run at fixed intervals – every transfer is private. You decide when and where we start and we plan the ride so that you arrive on time, without long waits in the terminal.",
      ] },
      route: { title: "Route Košice – Budapest and travel time", paragraphs: [
        "From Košice we cross the border at Milhosť – Tornyosnémeti, continue on the motorway past Miskolc and take the M0 ring road straight to Liszt Ferenc Airport. The distance is about 270 km and the ride usually takes 2.5 to 3 hours depending on traffic.",
        "For departures we recommend arriving at the airport at least two hours before your flight, a little earlier for non-Schengen flights. We will help you plan the departure time when you book.",
      ] },
      pickup: { title: "Pickup at your door, drop-off at the terminal", paragraphs: [
        "We pick you up outside your home in Košice, anywhere nearby, in Prešov or elsewhere in eastern Slovakia by arrangement, load your luggage and drop you off in front of the Terminal 2 departures hall. On the way back the driver waits for you in the arrivals hall at Budapest Airport.",
      ] },
      tips: { title: "Who the Budapest transfer suits", paragraphs: [
        "Families going on holiday who do not want to leave their car at the airport car park for weeks, companies sending employees on business trips and hotels arranging transfers for guests. We also drive from Budapest Airport to Košice, Prešov or any other address, and to the centre of Budapest.",
      ] },
      faq: [
        { question: "How long does it take from Košice to Budapest Airport?", answer: "The distance is about 270 km and the ride usually takes 2.5 to 3 hours depending on traffic." },
        { question: "Where will the driver meet me at Budapest Airport?", answer: "In the arrivals hall of Terminal 2. On request with a name sign – just add your flight number to the booking." },
        { question: "How many passengers and how much luggage fit in the car?", answer: "Up to 4 passengers fit in a car. For more suitcases we send a spacious estate car – just mention it when booking." },
      ],
    },
    "transfer-kosice-krakow": {
      navLabel: "Košice – Kraków Airport transfer",
      seoTitle: "Košice – Kraków Airport (KRK) transfer €290 | Taxi 24/7 | E-TAXI",
      seoDescription: "Private transfer from Košice to Kraków-Balice Airport or Kraków city for a fixed €290 per vehicle. Door to terminal, 24/7, flight monitoring, card payment or invoice.",
      keywords: "Košice Krakow airport transfer, taxi Košice Krakow, Košice to Krakow airport, private transfer Košice Kraków, Krakow Balice transfer",
      h1: "Taxi and transfer Košice – Kraków Airport",
      lead: "A direct private transfer from Košice to Kraków-Balice Airport or the centre of Kraków. No changes, no fixed departures, no strangers in the car – for a fixed €290 per vehicle.",
      distance: "approx. 270 km",
      duration: "3.5–4 h",
      routeLabel: "Košice – Kraków Airport (KRK)",
      intro: { title: "Kraków without changes and without timetables", paragraphs: [
        "Kraków Airport offers many direct flights that do not leave from Košice, but by public transport the journey is long and involves several changes. Shared shuttles run only on certain days and times and stop for other passengers.",
        "E-TAXI offers a tailor-made private transfer. You choose the departure time according to your flight, we pick you up at your door and take you right to the terminal of John Paul II Kraków-Balice Airport.",
      ] },
      route: { title: "Route Košice – Kraków and travel time", paragraphs: [
        "The route leads via Prešov and northern Slovakia into Poland. The distance is about 270 km and the ride usually takes 3.5 to 4 hours depending on the route, weather and traffic around Kraków. The driver chooses the route according to current road conditions.",
        "For a departure from Kraków we recommend leaving Košice about six hours before your flight so you have time for traffic and check-in.",
      ] },
      pickup: { title: "From your door to the terminal – and back", paragraphs: [
        "We pick you up at home in Košice, at a place of your choice or anywhere along the route, and drop you off in front of the departures hall or at your hotel or meeting in Kraków. On arrival the driver waits for you in the arrivals hall at Kraków Airport.",
      ] },
      tips: { title: "Practical tips for the Kraków trip", paragraphs: [
        "In winter the weather in northern Slovakia and southern Poland can affect travel time, so allow extra time for morning flights. Poland is in the Schengen area, but you need an ID document at the airport.",
        "Travelling with children? We prepare a child seat for free. For skis, a pram or several suitcases, mention it in the booking and we will send an estate car.",
      ] },
      faq: [
        { question: "How long does it take from Košice to Kraków?", answer: "About 3.5 to 4 hours. The distance is around 270 km." },
        { question: "Do you also drive to Kraków city centre?", answer: "Yes, we take you to the airport or to any address in Kraków. Just add it to your booking." },
        { question: "When should I leave Košice for a flight from Kraków?", answer: "We recommend about six hours before departure so you have time for traffic and check-in." },
      ],
    },
    "transfer-kosice-katowice": {
      navLabel: "Košice – Katowice Airport transfer",
      seoTitle: "Košice – Katowice Airport (KTW) transfer €350 | Taxi 24/7 | E-TAXI",
      seoDescription: "Private transfer from Košice to Katowice-Pyrzowice Airport or Katowice city for a fixed €350 per vehicle. Door to terminal, 24/7, flight monitoring, card payment or invoice.",
      keywords: "Košice Katowice airport transfer, taxi Košice Katowice, Katowice Pyrzowice transfer from Košice, private transfer Košice Katowice",
      h1: "Taxi and transfer Košice – Katowice Airport",
      lead: "A private transfer from Košice to Katowice-Pyrzowice Airport or an address in Katowice. Direct, with no changes, at a time that suits you, for a fixed €350 per vehicle.",
      distance: "approx. 340 km",
      duration: "4–4.5 h",
      routeLabel: "Košice – Katowice Airport (KTW)",
      intro: { title: "To Katowice directly, without shared shuttles", paragraphs: [
        "Katowice-Pyrzowice is an important hub for low-cost and holiday flights in southern Poland. From Košice you can only get there by public transport with several changes, and shared shuttles run at fixed times.",
        "E-TAXI takes you privately. You do not have to fit a timetable or wait for other passengers. We plan the departure around your flight, pick you up at your door and drop you off in front of the terminal.",
      ] },
      route: { title: "Route Košice – Katowice and travel time", paragraphs: [
        "The route leads from Slovakia into Poland and on expressways towards Katowice; Pyrzowice Airport lies north of the city. The distance is about 340 km and the ride usually takes 4 to 4.5 hours depending on traffic.",
        "For departures we recommend leaving Košice six to seven hours before your flight.",
      ] },
      pickup: { title: "From your door to the terminal or the city", paragraphs: [
        "We pick you up at home in Košice or anywhere in eastern Slovakia by arrangement and take you to the terminal of Katowice Airport or to a hotel, meeting or company in Katowice and Silesia. On your return the driver waits in the arrivals hall.",
      ] },
      tips: { title: "Practical tips for the Katowice trip", paragraphs: [
        "Katowice is one of the most distant airports we drive to, so for morning flights we often set off at night. With a pre-booking you can be sure the car is outside your door on time, and you can sleep on the way in a comfortable seat. We take a short break on the way if needed.",
      ] },
      faq: [
        { question: "How long does it take from Košice to Katowice Airport?", answer: "About 4 to 4.5 hours; the distance is around 340 km." },
        { question: "Will you take me to Katowice city, not just the airport?", answer: "Yes, we drive to Pyrzowice Airport and to any address in Katowice and the surrounding area." },
        { question: "Can we stop on the way?", answer: "Yes, you can arrange a short break when booking." },
      ],
    },
    "transfer-kosice-viedna": {
      navLabel: "Košice – Vienna Airport transfer",
      seoTitle: "Košice – Vienna Airport (VIE) transfer €450 | Taxi 24/7 | E-TAXI",
      seoDescription: "Private long-distance transfer from Košice to Vienna-Schwechat Airport or central Vienna for a fixed €450 per vehicle. Door to terminal, 24/7, card payment or invoice.",
      keywords: "Košice Vienna airport transfer, taxi Košice Vienna, Košice to Vienna airport, Vienna Schwechat transfer from Košice, private transfer Košice Vienna",
      h1: "Taxi and transfer Košice – Vienna Airport",
      lead: "A private long-distance transfer from Košice to Vienna-Schwechat Airport or central Vienna. Comfortable, with no changes and at the time you choose, for a fixed €450 per vehicle.",
      distance: "approx. 450–480 km",
      duration: "4.5–5 h",
      routeLabel: "Košice – Vienna Airport (VIE)",
      intro: { title: "To Vienna Airport without trains and changes", paragraphs: [
        "Vienna-Schwechat offers the widest choice of long-haul and transatlantic flights in the region. From Košice you can get there by train with changes and more transport from Bratislava or Vienna – a long and tiring trip with suitcases and an early flight.",
        "With E-TAXI you travel from your door to the terminal. We do not run at fixed intervals; you choose the departure time and use the journey to rest or work.",
      ] },
      route: { title: "Route Košice – Vienna and travel time", paragraphs: [
        "We usually take the motorway through Slovakia and Bratislava; depending on traffic the driver may choose the route via Hungary. The distance is about 450 to 480 km and the ride usually takes 4.5 to 5 hours including a short break.",
        "For a departure from Vienna we recommend leaving at least seven hours before your flight, more for long-haul flights.",
      ] },
      pickup: { title: "From your door to the terminal or central Vienna", paragraphs: [
        "We pick you up at home in Košice or at a place of your choice and take you to the departures hall of Vienna Airport, or to a hotel or address in central Vienna. On arrival the driver waits in the arrivals hall, on request with a name sign.",
      ] },
      tips: { title: "Practical tips for the Vienna trip", paragraphs: [
        "Airlines recommend arriving at least three hours before long-haul flights, so we plan the departure from Košice with enough reserve. A short refreshment break on the way is usual. When you land in Vienna we monitor your flight, so the driver waits even if the plane is late.",
      ] },
      faq: [
        { question: "How long does it take from Košice to Vienna Airport?", answer: "Usually 4.5 to 5 hours; the distance is about 450 to 480 km depending on the route." },
        { question: "Will you take me to central Vienna?", answer: "Yes, we drive to Schwechat Airport and to any address in Vienna." },
        { question: "Can I travel in an electric car on this route?", answer: "Yes, on request we send an electric Tesla, also for this long-distance route." },
      ],
    },
    "transfer-kosice-debrecin": {
      navLabel: "Košice – Debrecen Airport transfer",
      seoTitle: "Košice – Debrecen Airport (DEB) transfer €220 | Taxi 24/7 | E-TAXI",
      seoDescription: "Private transfer from Košice to Debrecen Airport or Debrecen city for a fixed €220 per vehicle. About 2–2.5 h, door to terminal, 24/7, card payment or invoice.",
      keywords: "Košice Debrecen airport transfer, taxi Košice Debrecen, Košice to Debrecen airport, private transfer Košice Debrecen",
      h1: "Taxi and transfer Košice – Debrecen Airport",
      lead: "The shortest of our international airport transfers: from Košice to Debrecen Airport or an address in the city, direct and with no changes, for a fixed €220 per vehicle.",
      distance: "approx. 190 km",
      duration: "2–2.5 h",
      routeLabel: "Košice – Debrecen Airport (DEB)",
      intro: { title: "Debrecen – a close alternative to Budapest", paragraphs: [
        "Debrecen Airport offers low-cost flights to several European cities and is closer to Košice than Budapest. There is no direct public transport, and regular connections between Košice and Debrecen hardly exist.",
        "E-TAXI takes you there privately and directly. You set the departure according to your flight, we pick you up at your door and you get out in front of the terminal.",
      ] },
      route: { title: "Route Košice – Debrecen and travel time", paragraphs: [
        "The route crosses the border at Milhosť – Tornyosnémeti, passes Miskolc and continues on the motorway to Debrecen. The distance is about 190 km and the ride usually takes 2 to 2.5 hours. For departures we recommend leaving Košice about four hours before your flight.",
      ] },
      pickup: { title: "From your door to the terminal or the city", paragraphs: [
        "We pick you up at home in Košice or at a place of your choice and take you to the terminal of Debrecen Airport or to an address in Debrecen – a company, the university, a hospital or the spa. On arrival the driver waits for you at the airport.",
      ] },
      tips: { title: "Practical tips for the Debrecen trip", paragraphs: [
        "Debrecen Airport is small and check-in is usually quicker than in Budapest, but still allow a reserve for possible delays at the border or on the motorway near Miskolc. You pay in euros – by card, in cash or by invoice – so you do not need forints.",
      ] },
      faq: [
        { question: "How long does it take from Košice to Debrecen?", answer: "About 2 to 2.5 hours; the distance is around 190 km." },
        { question: "Do you only go to the airport or also into the city?", answer: "To the airport and to any address in Debrecen and the surrounding area." },
        { question: "Do I need forints to pay?", answer: "No, you pay in euros by card, in cash or by invoice." },
      ],
    },
    "transfer-kosice-bratislava": {
      navLabel: "Košice – Bratislava transfer",
      seoTitle: "Košice – Bratislava & BTS Airport transfer €390 | Taxi 24/7 | E-TAXI",
      seoDescription: "Private transfer from Košice to Bratislava or M. R. Štefánik Airport for a fixed €390 per vehicle. Door to door, 24/7, card payment or invoice.",
      keywords: "Košice Bratislava transfer, taxi Košice Bratislava, Košice to Bratislava airport, private transfer Košice Bratislava",
      h1: "Taxi and transfer Košice – Bratislava",
      lead: "From the east to the west of Slovakia without changes and without fitting into train or bus timetables. We take you from Košice to any address in Bratislava or to M. R. Štefánik Airport for a fixed €390 per vehicle.",
      distance: "approx. 400 km",
      duration: "4–4.5 h",
      routeLabel: "Košice – Bratislava / BTS Airport",
      intro: { title: "From Košice to Bratislava at the time you choose", paragraphs: [
        "Trains and buses between Košice and Bratislava follow a timetable, and you still need transport to and from the station. With E-TAXI we pick you up at your door and drop you off exactly where you need to be.",
        "Every transfer is private – the departure follows you, whether you are going to a business meeting, an office, a hospital, the airport or helping a family member move.",
      ] },
      route: { title: "Route Košice – Bratislava and travel time", paragraphs: [
        "We drive on motorways and expressways through central Slovakia. The distance is about 400 km and the ride usually takes 4 to 4.5 hours including a short break. The driver chooses the route according to current traffic.",
      ] },
      pickup: { title: "To an address in Bratislava or to the airport", paragraphs: [
        "We take you to a hotel, company, ministry, hospital or M. R. Štefánik Airport. If you fly from Vienna, see our Košice – Vienna transfer. On the way back we pick you up in Bratislava or at the airport and drive you to your door in Košice.",
      ] },
      tips: { title: "Advantages over the train and bus", paragraphs: [
        "No changes, no station transfers and room for larger luggage. You can work, make calls or rest in a comfortable seat, and with several passengers the price per vehicle is shared – often a good deal for colleagues travelling to the same meeting.",
      ] },
      faq: [
        { question: "How long does the trip take?", answer: "Usually 4 to 4.5 hours; the distance is about 400 km." },
        { question: "Will you take me to Bratislava Airport?", answer: "Yes, to M. R. Štefánik Airport and to any address in Bratislava." },
      ],
    },
    "transfer-kosice-rzeszow": {
      navLabel: "Košice – Rzeszów Airport transfer",
      seoTitle: "Košice – Rzeszów Airport (RZE) transfer €270 | Taxi 24/7 | E-TAXI",
      seoDescription: "Private transfer from Košice to Rzeszów-Jasionka Airport or Rzeszów city for a fixed €270 per vehicle. Door to terminal, 24/7, flight monitoring, card payment or invoice.",
      keywords: "Košice Rzeszów airport transfer, taxi Košice Rzeszów, Košice to Rzeszow airport, Rzeszów Jasionka transfer, private transfer Košice Rzeszów",
      h1: "Taxi and transfer Košice – Rzeszów Airport",
      lead: "A private transfer from Košice to Rzeszów-Jasionka Airport, the closest Polish airport to eastern Slovakia. Direct, with no changes, timed to your flight, for a fixed €270 per vehicle.",
      distance: "approx. 200 km",
      duration: "3–3.5 h",
      routeLabel: "Košice – Rzeszów Airport (RZE)",
      intro: { title: "Rzeszów – a nearby Polish airport for eastern Slovakia", paragraphs: [
        "For Košice, Prešov and the north of eastern Slovakia, Rzeszów-Jasionka is often the closest alternative to Budapest or Kraków. By public transport the trip is complicated and regular connections are almost non-existent.",
        "E-TAXI takes you privately. We do not run at fixed intervals or collect other passengers; you choose the departure, we pick you up at your door and you get out at the terminal.",
      ] },
      route: { title: "Route Košice – Rzeszów and travel time", paragraphs: [
        "The route goes via Prešov and Svidník to the Vyšný Komárnik – Barwinek border crossing and on through Dukla and Krosno to Rzeszów; Jasionka Airport lies north of the city. The distance is about 200 km and the ride usually takes 3 to 3.5 hours. We recommend leaving about five hours before your flight.",
      ] },
      pickup: { title: "From your door to the terminal", paragraphs: [
        "We pick you up at home in Košice, in Prešov or at another place along the route and take you to the terminal of Rzeszów Airport or to an address in the city. On your return the driver waits at the airport and adjusts the pickup to your flight.",
      ] },
      tips: { title: "Practical tips for the Rzeszów trip", paragraphs: [
        "The route over the Dukla Pass is hilly, so in winter allow extra time for morning flights. You pay in euros – by card, in cash or by invoice – so you do not need złoty. The transfer also suits companies with partners in the Podkarpackie region.",
      ] },
      faq: [
        { question: "How long does it take from Košice to Rzeszów?", answer: "About 3 to 3.5 hours; the distance is around 200 km." },
        { question: "Can you pick me up in Prešov?", answer: "Yes, we pick you up in Prešov or at another place along the route by arrangement." },
        { question: "Do I need Polish złoty to pay?", answer: "No, you pay in euros by card, in cash or by invoice." },
      ],
    },
    "transfer-kosice-poprad": {
      navLabel: "Košice – Poprad-Tatry Airport transfer",
      seoTitle: "Košice – Poprad-Tatry Airport (TAT) transfer €170 | Taxi 24/7 | E-TAXI",
      seoDescription: "Private transfer from Košice to Poprad-Tatry Airport, Poprad and the High Tatras for a fixed €170 per vehicle to the airport. Door to terminal or hotel, 24/7, card payment or invoice.",
      keywords: "Košice Poprad transfer, taxi Košice Poprad, Poprad Tatry airport transfer, Košice High Tatras transfer, private transfer Košice Poprad",
      h1: "Taxi and transfer Košice – Poprad-Tatry Airport",
      lead: "A private transfer from Košice to Poprad-Tatry Airport, Poprad or straight to your hotel in the High Tatras. No changes, at the time you choose, for a fixed €170 per vehicle to the airport.",
      distance: "approx. 120 km",
      duration: "1–1.5 h",
      routeLabel: "Košice – Poprad-Tatry Airport (TAT)",
      intro: { title: "To Poprad and the Tatras without changes", paragraphs: [
        "Poprad-Tatry is the highest international airport in Slovakia and the gateway to the High Tatras. You can reach Poprad from Košice by train, but from the station or airport to a hotel in the Tatras you need another connection – often with skis and suitcases.",
        "With E-TAXI you travel privately from door to door. No fixed intervals, no waiting for other passengers.",
      ] },
      route: { title: "Route Košice – Poprad and travel time", paragraphs: [
        "We take the D1 motorway via Prešov and Levoča. The distance is about 120 km and the ride to Poprad-Tatry Airport usually takes 1 to 1.5 hours. Resorts such as Starý Smokovec, Štrbské Pleso or Tatranská Lomnica are a little further.",
      ] },
      pickup: { title: "To the airport, Poprad or your hotel in the Tatras", paragraphs: [
        "We pick you up at home in Košice or at a place of your choice and take you to the terminal of Poprad-Tatry Airport, the station, a company in Poprad or right to your hotel in the High Tatras. On arrival the driver waits at the airport and adjusts to your flight. For a ride directly to a Tatra hotel we confirm the price when you book.",
      ] },
      tips: { title: "The Tatras, skiing and business trips", paragraphs: [
        "Skiers and hikers, hotels arranging guest transfers and companies travelling to Poprad and Kežmarok all use this route. With skis or a pram we send a spacious estate car and help with your luggage. If you land in Poprad and continue to Košice, Prešov or eastern Slovakia, we drive you to your door.",
      ] },
      faq: [
        { question: "How long does it take from Košice to Poprad-Tatry Airport?", answer: "Usually 1 to 1.5 hours; the distance is about 120 km." },
        { question: "Will you take me to a hotel in the High Tatras?", answer: "Yes, right to your hotel in the Tatra resorts. We confirm the price when you book." },
        { question: "Do skis fit in the car?", answer: "Yes, for skis and extra luggage we send a spacious estate car. Mention it in your booking." },
      ],
    },
  },
};
