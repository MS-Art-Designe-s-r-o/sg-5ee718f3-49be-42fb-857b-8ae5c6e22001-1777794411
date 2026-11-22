// Trasové stránky letiskových a diaľkových transferov (iba SK).
// Ceny musia súhlasiť s cenníkom (src/locales/sk.ts → pricing.transfers). Vzdialenosti sú orientačné (cca).
import type { LandingPageData } from "@/content/landing";

const PHONE = "+421 911 606 206";

export const ROUTE_PAGES: LandingPageData[] = [
  // ───────────────────────────── Letisko Košice ─────────────────────────────
  {
    slug: "taxi-letisko-kosice",
    navLabel: "Taxi na letisko Košice",
    seoTitle:
      "Taxi letisko Košice (KSC) od 18 € | Airport transfer 24/7 | E-TAXI",
    seoDescription:
      "Taxi a transfer na letisko Košice a späť od 18 €. Individuálna preprava od dverí až pred terminál, 24/7, časová aj okamžitá objednávka, platba kartou aj na faktúru.",
    keywords:
      "taxi letisko Košice, transfer letisko Košice, airport transfer Košice, preprava na letisko Košice, letiskové taxi Košice, individuálna preprava Košice",
    h1: "Taxi a transfer na letisko Košice a späť",
    lead: "Na letisko Košice vás odvezieme priamo spred domu, z hotela alebo z kancelárie a po prílete vás vyzdvihneme pred terminálom. Jazdíme 24/7, na čas, ktorý si určíte vy, a cena začína od 18 €.",
    serviceType: "Letiskový transfer",
    price: "18",
    priceLabel: "od 18 €",
    airportCode: "KSC",
    destinationName: "Letisko Košice",
    facts: [
      { label: "Cena", value: "od 18 € za auto" },
      { label: "Trasa", value: "Košice – letisko Košice (KSC)" },
      { label: "Čas jazdy z centra", value: "zvyčajne 15 – 20 min." },
      { label: "Objednávka", value: "24/7, časová aj okamžitá" },
    ],
    sections: [
      {
        title: "Airport transfer v Košiciach bez stresu",
        paragraphs: [
          "Letisko Košice leží len niekoľko kilometrov juhozápadne od centra mesta, no pri skorom rannom odlete, s kuframi alebo s deťmi sa oplatí mať odvoz istý. E-TAXI vás vyzdvihne presne v čase, ktorý si zvolíte, priamo pred vaším domom, hotelom alebo na inom mieste v Košiciach a okolí a odvezie vás až pred odletovú halu.",
          "Nemusíte riešiť parkovanie na letisku, hľadanie spoja mestskej dopravy ani to, či vás niekto zo známych stihne odviezť. Individuálna preprava znamená, že v aute ste len vy a jazda sa prispôsobuje vám, nie opačne.",
        ],
      },
      {
        title: "Vyzdvihnutie po prílete priamo pred terminálom",
        paragraphs: [
          "Po prílete vás vodič čaká pred príletovou halou letiska Košice. Stačí uviesť číslo letu a čas príletu v objednávke. Po ceste domov vás odvezieme na akúkoľvek adresu v Košiciach, do Prešova, Spišskej Novej Vsi, Michaloviec či inam podľa dohody.",
          "Ak priletíte neskoro v noci, nemusíte sa obávať, že taxík nebude k dispozícii. Dispečing pracuje nepretržite a časovú objednávku na prílet prijímame kedykoľvek vopred.",
        ],
        bullets: [
          "vyzdvihnutie pred domom, v hoteli, v kancelárii alebo na inom zvolenom mieste",
          "pristavenie pred odletovou halou aj vyzdvihnutie pred príletovou halou",
          "časová objednávka na presný čas zdarma, okamžitá objednávka pri náhlej potrebe",
          "detská sedačka zdarma, priestranné kombi na viac batožiny",
        ],
      },
      {
        title: "Cena taxi na letisko Košice",
        paragraphs: [
          "Transfer medzi Košicami a letiskom Košice stojí od 18 € za celé auto, nie za osobu. Konečná cena závisí od adresy vyzdvihnutia a presnú sumu poznáte ešte pred jazdou v aplikácii alebo od dispečera. Časová objednávka a platba kartou sú zdarma.",
          "Firmám a hotelom vystavíme faktúru, pri pravidelných letiskových transferoch hostí či zamestnancov aj s mesačným vyúčtovaním. Nie sme platcami DPH, cena je konečná.",
        ],
      },
      {
        title: "Kedy objednať a kedy vyraziť",
        paragraphs: [
          "Pri odlete odporúčame objednať transfer deň vopred a byť na letisku približne dve hodiny pred odletom, pri lete v rámci schengenského priestoru stačí spravidla o niečo menej. Pri prílete nám stačí poslať číslo letu, čas pristavenia prispôsobíme skutočnému príletu.",
          "Ak potrebujete odvoz hneď, zavolajte na " +
            PHONE +
            " a najbližšie voľné vozidlo vyrazí k vám. Z letiska Košice vás tiež radi odvezieme na vzdialenejšie letiská v Budapešti, Krakove, Katoviciach, Rzeszówe či vo Viedni, ak váš let odlieta odtiaľ.",
        ],
      },
      {
        title: "Pre hotely, firmy a návštevy Košíc",
        paragraphs: [
          "Hotely v Košiciach u nás objednávajú odvoz hostí na letisko aj z letiska, firmy zas transfery pre zamestnancov a obchodných partnerov. Objednávať môžete telefonicky, cez aplikáciu alebo cez webový formulár Taxximo, kde vidíte stav jázd aj prehľad ukončených objednávok. Fakturujeme mesačne.",
          "Ak do Košíc prichádzate prvýkrát, vodič vás odvezie na hotel, na stretnutie alebo na stanicu. Detskú sedačku pripravíme zdarma a na požiadanie pristavíme elektrické vozidlo Tesla.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi na letisko Košice?",
        answer:
          "Transfer medzi Košicami a letiskom Košice stojí od 18 € za auto. Presnú cenu podľa adresy vyzdvihnutia poznáte vopred.",
      },
      {
        question: "Dá sa objednať taxi na letisko aj skoro ráno alebo v noci?",
        answer:
          "Áno, jazdíme 24/7. Pri skorých odletoch odporúčame objednať deň vopred, časová objednávka je zdarma.",
      },
      {
        question: "Kde ma vodič vyzdvihne po prílete?",
        answer:
          "Pred príletovou halou letiska Košice. Na požiadanie vás môže čakať v hale s tabuľkou s vaším menom.",
      },
      {
        question: "Čo ak bude môj let meškať?",
        answer:
          "Uveďte číslo letu v objednávke. Čas pristavenia prispôsobíme skutočnému príletu a v prípade väčšej zmeny vás kontaktuje dispečing.",
      },
      {
        question: "Dá sa zaplatiť kartou alebo na faktúru?",
        answer:
          "Áno, v každom vozidle platíte kartou bez poplatku, aj cez Google Pay a Apple Pay. Firmám vystavujeme faktúru, nie sme platcami DPH.",
      },
      {
        question: "Máte detskú sedačku?",
        answer:
          "Áno, detskú sedačku poskytujeme zdarma. Stačí ju uviesť pri objednávke.",
      },
    ],
    related: [
      "transfer-kosice-budapest",
      "transfer-kosice-krakow",
      "transfer-kosice-poprad",
      "sluzby-pre-firmy",
    ],
  },

  // ───────────────────────────── Budapešť ─────────────────────────────
  {
    slug: "transfer-kosice-budapest",
    navLabel: "Transfer Košice – letisko Budapešť",
    seoTitle:
      "Taxi Košice – letisko Budapešť (BUD) 250 € | Transfer 24/7 | E-TAXI",
    seoDescription:
      "Individuálna preprava a airport transfer z Košíc na letisko Budapešť za pevnú cenu 250 € za auto. Od dverí až pred terminál, 24/7, platba kartou aj na faktúru.",
    keywords:
      "taxi Košice Budapešť, transfer Košice letisko Budapešť, preprava Košice Budapešť, airport transfer Košice Budapest, airporttransfer Budapešť, individuálna preprava Budapešť, letisko Budapešť taxi cena",
    h1: "Taxi a transfer Košice – letisko Budapešť",
    lead: "Súkromný transfer z Košíc na letisko Ferenca Liszta v Budapešti bez prestupov, bez čakania na linku a bez zbierania ďalších pasažierov. Vyzdvihneme vás pred domom a odvezieme až pred terminál za pevnú cenu 250 € za auto.",
    serviceType: "Letiskový transfer",
    price: "250",
    priceLabel: "250 €",
    airportCode: "BUD",
    destinationName: "Letisko Budapešť Ferenca Liszta",
    facts: [
      { label: "Cena", value: "250 € za auto" },
      { label: "Trasa", value: "Košice – letisko Budapešť (BUD)" },
      { label: "Vzdialenosť", value: "cca 270 km" },
      { label: "Čas jazdy", value: "2,5 – 3 hod." },
    ],
    sections: [
      {
        title: "Individuálny transfer, ktorý sa prispôsobí vášmu letu",
        paragraphs: [
          "Letisko Budapešť je pre východné Slovensko najväčším letiskom v dosahu, s priamymi letmi do celej Európy aj na iné kontinenty. Cesta naň však býva komplikovaná: autobusové a zdieľané transfery odchádzajú v pevných časoch, po ceste zbierajú ďalších cestujúcich a vy sa musíte prispôsobiť ich cestovnému poriadku.",
          "S E-TAXI je to naopak. Nejazdíme v pravidelných intervaloch, každá preprava je individuálna. Vy určíte, kedy a odkiaľ vyrážame, a my naplánujeme jazdu tak, aby ste boli na letisku včas, bez zbytočného čakania v terminále. V aute cestujete len vy, vaša rodina alebo kolegovia.",
        ],
      },
      {
        title: "Trasa Košice – Budapešť a čas jazdy",
        paragraphs: [
          "Z Košíc vedie trasa cez hraničný priechod Milhosť – Tornyosnémeti a ďalej po diaľnici okolo Miškovca a cez okruh M0 priamo k letisku Ferenca Liszta. Vzdialenosť je približne 270 km a jazda zvyčajne trvá 2,5 až 3 hodiny podľa premávky a miesta vyzdvihnutia.",
          "Pri odlete odporúčame vyraziť tak, aby ste boli na letisku aspoň dve hodiny pred odletom, pri letoch mimo schengenského priestoru radšej o niečo skôr. Čas odchodu vám pri objednávke radi poradíme podľa vášho letu.",
        ],
      },
      {
        title: "Vyzdvihnutie pred domom, odchod až pred terminál",
        paragraphs: [
          "Vyzdvihneme vás priamo pred vaším domom v Košiciach, na zvolenom mieste v okolí, v Prešove alebo kdekoľvek na východnom Slovensku podľa dohody. Batožinu naložíme za vás a vystúpite priamo pred odletovou halou Terminálu 2.",
          "Pri ceste späť vás vodič čaká na letisku Budapešť v príletovej hale. Stačí uviesť číslo letu, čas vyzdvihnutia prispôsobíme skutočnému príletu. Domov vás odvezieme až pred dvere, aj v noci.",
        ],
        bullets: [
          "odchod kedykoľvek, aj na skoré ranné a nočné lety",
          "jazda priamo, bez prestupov a bez zbierania iných cestujúcich",
          "detská sedačka zdarma a priestranné kombi na viac kufrov",
          "možnosť elektrického vozidla Tesla na požiadanie",
        ],
      },
      {
        title: "Cena transferu Košice – letisko Budapešť",
        paragraphs: [
          "Transfer Košice – letisko Budapešť stojí 250 € za celé auto, nie za osobu. Pri ceste vo dvojici či v rodine je tak individuálna preprava často výhodnejšia, ako sa na prvý pohľad zdá. Cena je pevná, známa vopred a bez skrytých poplatkov. Nie sme platcami DPH, preto je suma konečná.",
          "Zaplatiť môžete kartou v aute bez poplatku, v hotovosti alebo na faktúru. Firmám pri pravidelných cestách na letisko ponúkame mesačné vyúčtovanie.",
        ],
      },
      {
        title: "Pre koho je transfer do Budapešti vhodný",
        paragraphs: [
          "Transfer využívajú rodiny na dovolenku, ktoré nechcú nechať auto týždne na letiskovom parkovisku, firmy, ktoré posielajú zamestnancov na služobné cesty, aj hotely, ktoré zabezpečujú odvoz hostí. Opačným smerom vás radi odvezieme aj z letiska Budapešť do Košíc, Prešova či na inú adresu.",
          "Okrem letiska jazdíme aj do centra Budapešti, na hotel, do nemocnice alebo na stretnutie. Adresu stačí uviesť v objednávke.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi Košice – letisko Budapešť?",
        answer:
          "Transfer Košice – letisko Budapešť stojí 250 € za auto, nie za osobu. Cena je pevná a bez skrytých poplatkov.",
      },
      {
        question: "Ako dlho trvá cesta z Košíc na letisko Budapešť?",
        answer:
          "Vzdialenosť je približne 270 km a jazda trvá zvyčajne 2,5 až 3 hodiny podľa premávky.",
      },
      {
        question: "Jazdíte v pevných časoch ako autobus?",
        answer:
          "Nie. Nejazdíme v pravidelných intervaloch. Každý transfer je individuálny, odchod sa riadi vaším letom a v aute cestujete len vy.",
      },
      {
        question: "Kde ma vodič vyzdvihne na letisku Budapešť?",
        answer:
          "V príletovej hale Terminálu 2. Na požiadanie vás bude čakať s tabuľkou s vaším menom. Stačí v objednávke uviesť číslo letu.",
      },
      {
        question: "Dá sa zaplatiť kartou alebo na faktúru?",
        answer:
          "Áno. V aute platíte kartou bez poplatku, aj cez Google Pay a Apple Pay, alebo v hotovosti. Firmám vystavíme faktúru.",
      },
      {
        question: "Koľko osôb a batožiny sa zmestí do auta?",
        answer:
          "Do osobného auta sa zmestia až 4 cestujúci. Pri viacerých kufroch pristavíme priestranné kombi, stačí to uviesť v objednávke.",
      },
      {
        question: "Ako vopred treba transfer objednať?",
        answer:
          "Odporúčame aspoň deň vopred. Ak potrebujete ísť skôr, zavolajte na " +
          PHONE +
          ", dispečing pracuje 24/7.",
      },
      {
        question: "Čo ak bude môj let meškať?",
        answer:
          "Sledujeme váš let. Pri vyzdvihnutí na letisku Budapešť čas pristavenia prispôsobíme skutočnému príletu, stačí v objednávke uviesť číslo letu.",
      },
    ],
    related: [
      "transfer-kosice-debrecin",
      "transfer-kosice-viedna",
      "transfer-kosice-krakow",
      "taxi-letisko-kosice",
    ],
  },

  // ───────────────────────────── Krakov ─────────────────────────────
  {
    slug: "transfer-kosice-krakow",
    navLabel: "Transfer Košice – letisko Krakov",
    seoTitle:
      "Taxi Košice – letisko Krakov (KRK) 290 € | Transfer 24/7 | E-TAXI",
    seoDescription:
      "Individuálna preprava z Košíc na letisko Krakov-Balice aj do centra Krakova za pevnú cenu 290 € za auto. Od dverí až pred terminál, 24/7, platba kartou aj na faktúru.",
    keywords:
      "taxi Košice Krakov, transfer Košice Krakov, preprava Košice Krakov, airport transfer Košice Krakow, airporttransfer Krakov, letisko Krakov Balice transfer, individuálna preprava Krakov",
    h1: "Taxi a transfer Košice – letisko Krakov",
    lead: "Priamy súkromný transfer z Košíc na letisko Krakov-Balice alebo do centra Krakova. Bez prestupov, bez pevných odchodov a bez cudzích pasažierov, za pevnú cenu 290 € za auto.",
    serviceType: "Letiskový transfer",
    price: "290",
    priceLabel: "290 €",
    airportCode: "KRK",
    destinationName: "Letisko Krakov-Balice",
    facts: [
      { label: "Cena", value: "290 € za auto" },
      { label: "Trasa", value: "Košice – letisko Krakov (KRK)" },
      { label: "Vzdialenosť", value: "cca 270 km" },
      { label: "Čas jazdy", value: "3,5 – 4 hod." },
    ],
    sections: [
      {
        title:
          "Krakov bez prestupov a bez prispôsobovania sa cestovnému poriadku",
        paragraphs: [
          "Letisko Krakov ponúka množstvo priamych letov, ktoré z Košíc nelietajú, no verejnou dopravou je cesta naň dlhá a s prestupmi. Zdieľané transfery jazdia len v určitých dňoch a časoch a cestou zastavujú aj pre ďalších pasažierov.",
          "E-TAXI ponúka individuálnu prepravu na mieru. Nejazdíme v intervaloch, čas odchodu určíte vy podľa svojho letu. Vyzdvihneme vás pred domom, v aute ste len vy a odvezieme vás priamo pred terminál letiska Jána Pavla II. Krakov-Balice.",
        ],
      },
      {
        title: "Trasa Košice – Krakov a čas jazdy",
        paragraphs: [
          "Cesta z Košíc do Krakova vedie cez Prešov a sever Slovenska do Poľska. Vzdialenosť je približne 270 km a jazda trvá zvyčajne 3,5 až 4 hodiny podľa zvolenej trasy, počasia a premávky v okolí Krakova. Trasu vyberá vodič podľa aktuálnej situácie na cestách.",
          "Pri odlete z Krakova odporúčame z Košíc vyraziť približne šesť hodín pred odletom, aby ste mali rezervu na premávku aj na odbavenie. Pri objednávke vám radi pomôžeme čas odchodu naplánovať.",
        ],
      },
      {
        title: "Od dverí až pred terminál, aj cestou späť",
        paragraphs: [
          "Vyzdvihneme vás pred domom v Košiciach, na zvolenom mieste v okolí alebo kdekoľvek na trase podľa dohody. Batožinu naložíme za vás a vystúpite priamo pred odletovou halou. Ak cestujete do mesta, odvezieme vás na hotel alebo na stretnutie v centre Krakova.",
          "Na prílete vás vodič čaká v príletovej hale letiska Krakov. Čas vyzdvihnutia prispôsobíme vášmu letu a domov vás odvezieme až pred dvere.",
        ],
        bullets: [
          "odchod kedykoľvek, aj v noci na ranné lety",
          "jazda priamo na letisko alebo do centra Krakova",
          "zastávka po ceste podľa dohody",
          "detská sedačka zdarma, kombi na viac batožiny",
        ],
      },
      {
        title: "Cena transferu Košice – Krakov",
        paragraphs: [
          "Transfer Košice – letisko Krakov stojí 290 € za celé auto, nie za osobu. Cena je pevná, známa vopred a nezahŕňa žiadne skryté poplatky. Nie sme platcami DPH, suma je konečná.",
          "Platiť môžete kartou bez poplatku, v hotovosti alebo na faktúru. Pre firmy, ktoré posielajú zamestnancov cez Krakov pravidelne, ponúkame mesačné vyúčtovanie.",
        ],
      },
      {
        title: "Pre koho je transfer do Krakova vhodný",
        paragraphs: [
          "Transfer do Krakova využívajú dovolenkári, študenti, rodiny s deťmi aj firmy. Hodí sa najmä pri skorých ranných letoch, keď by ste verejnou dopravou museli vyraziť už večer predtým. Rovnako vás radi odvezieme z Krakova späť do Košíc či Prešova.",
        ],
      },
      {
        title: "Praktické tipy pre cestu do Krakova",
        paragraphs: [
          "Pri ceste cez sever Slovenska a južné Poľsko môže v zime ovplyvniť čas jazdy počasie, preto pri ranných letoch odporúčame počítať s väčšou rezervou. Vodič sleduje aktuálnu situáciu na cestách a trasu prispôsobí. Pasy či občianske preukazy majte pri sebe, Poľsko je súčasťou schengenského priestoru, no doklad totožnosti je potrebný na letisku.",
          "Ak cestujete s deťmi, detskú sedačku pripravíme zdarma. Pri lyžiach, kočíku alebo viacerých kufroch to uveďte v objednávke a pristavíme priestranné kombi.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi Košice – letisko Krakov?",
        answer:
          "Transfer Košice – letisko Krakov stojí 290 € za auto, nie za osobu. Cena je pevná a známa vopred.",
      },
      {
        question: "Ako dlho trvá cesta z Košíc do Krakova?",
        answer: "Približne 3,5 až 4 hodiny. Vzdialenosť je okolo 270 km.",
      },
      {
        question: "Jazdíte aj do centra Krakova?",
        answer:
          "Áno, odvezieme vás na letisko aj na akúkoľvek adresu v Krakove. Adresu uveďte pri objednávke.",
      },
      {
        question: "Kedy mám z Košíc vyraziť na let z Krakova?",
        answer:
          "Odporúčame približne šesť hodín pred odletom, aby ste mali rezervu na premávku a odbavenie.",
      },
      {
        question: "Je to zdieľaný transfer?",
        answer:
          "Nie. Ide o individuálnu prepravu, v aute cestujete len vy a odchod sa riadi vaším letom.",
      },
      {
        question: "Dá sa zaplatiť kartou alebo na faktúru?",
        answer:
          "Áno, kartou bez poplatku, v hotovosti alebo na faktúru. Nie sme platcami DPH.",
      },
      {
        question: "Čo ak bude môj let meškať?",
        answer:
          "Sledujeme váš let. Pri vyzdvihnutí na letisku Krakov čas pristavenia prispôsobíme skutočnému príletu, stačí v objednávke uviesť číslo letu.",
      },
    ],
    related: [
      "transfer-kosice-katowice",
      "transfer-kosice-rzeszow",
      "transfer-kosice-budapest",
      "taxi-letisko-kosice",
    ],
  },

  // ───────────────────────────── Katovice ─────────────────────────────
  {
    slug: "transfer-kosice-katowice",
    navLabel: "Transfer Košice – letisko Katovice",
    seoTitle:
      "Taxi Košice – letisko Katovice (KTW) 350 € | Transfer 24/7 | E-TAXI",
    seoDescription:
      "Individuálna preprava z Košíc na letisko Katovice-Pyrzowice aj do Katovíc za pevnú cenu 350 € za auto. Od dverí až pred terminál, 24/7, platba kartou aj na faktúru.",
    keywords:
      "taxi Košice Katovice, transfer Košice Katowice, preprava Košice Katowice, airport transfer Košice Katowice, airporttransfer Katovice, letisko Katowice Pyrzowice transfer, individuálna preprava Katovice",
    h1: "Taxi a transfer Košice – letisko Katovice",
    lead: "Súkromný transfer z Košíc na letisko Katovice-Pyrzowice alebo na adresu v Katoviciach. Priamo, bez prestupov a v čase, ktorý vám vyhovuje, za pevnú cenu 350 € za auto.",
    serviceType: "Letiskový transfer",
    price: "350",
    priceLabel: "350 €",
    airportCode: "KTW",
    destinationName: "Letisko Katovice-Pyrzowice",
    facts: [
      { label: "Cena", value: "350 € za auto" },
      { label: "Trasa", value: "Košice – letisko Katovice (KTW)" },
      { label: "Vzdialenosť", value: "cca 340 km" },
      { label: "Čas jazdy", value: "4 – 4,5 hod." },
    ],
    sections: [
      {
        title: "Do Katovíc priamo, bez zdieľaných liniek",
        paragraphs: [
          "Letisko Katovice-Pyrzowice je dôležitým uzlom nízkonákladových aj dovolenkových letov na juhu Poľska. Z Košíc sa naň verejnou dopravou dostanete len s viacerými prestupmi a pravidelné zdieľané transfery jazdia v pevne daných časoch.",
          "E-TAXI vás odvezie individuálne. Nemusíte sa prispôsobovať odchodom linky ani čakať na ďalších cestujúcich. Odchod naplánujeme podľa vášho letu, vyzdvihneme vás pred domom a vystúpite priamo pred terminálom.",
        ],
      },
      {
        title: "Trasa Košice – Katovice a čas jazdy",
        paragraphs: [
          "Trasa vedie zo Slovenska do Poľska a ďalej po rýchlostných cestách k Katoviciam. Letisko Pyrzowice leží severne od mesta. Vzdialenosť je približne 340 km a jazda trvá zvyčajne 4 až 4,5 hodiny podľa premávky a zvolenej trasy.",
          "Pri odlete odporúčame z Košíc vyraziť s dostatočnou rezervou, približne šesť až sedem hodín pred odletom. Čas odchodu vám radi poradíme pri objednávke.",
        ],
      },
      {
        title: "Od dverí až pred terminál, aj na adresu v meste",
        paragraphs: [
          "Vyzdvihneme vás pred domom v Košiciach, na zvolenom mieste alebo kdekoľvek na východnom Slovensku podľa dohody. Odvezieme vás pred terminál letiska Katovice alebo na hotel, na stretnutie či do firmy v Katoviciach a okolí Sliezska.",
          "Pri návrate vás vodič čaká na letisku v príletovej hale, čas vyzdvihnutia prispôsobíme vášmu letu.",
        ],
        bullets: [
          "odchod kedykoľvek, aj na nočné a skoré ranné lety",
          "zastávka po ceste na oddych podľa dohody",
          "pohodlné klimatizované vozidlá, na požiadanie elektrická Tesla",
          "detská sedačka zdarma",
        ],
      },
      {
        title: "Cena transferu Košice – Katovice",
        paragraphs: [
          "Transfer Košice – Katovice stojí 350 € za celé auto, nie za osobu. Cena je pevná, známa vopred a bez skrytých poplatkov. Nie sme platcami DPH, suma je konečná.",
          "Zaplatiť môžete kartou bez poplatku, v hotovosti alebo na faktúru. Trasu často využívajú firmy, ktorým pri pravidelných jazdách ponúkame mesačné vyúčtovanie.",
        ],
      },
      {
        title: "Služobné cesty aj dovolenky",
        paragraphs: [
          "Katovice sú priemyselným centrom, preto túto trasu využívajú najmä firmy pri služobných cestách a návštevách partnerov. Rovnako ju volia rodiny a dovolenkári, ktorí z Katovíc odlietajú na charterové lety k moru. Odvezieme vás aj opačným smerom z Katovíc do Košíc.",
        ],
      },
      {
        title: "Praktické tipy pre cestu do Katovíc",
        paragraphs: [
          "Katovice patria medzi najvzdialenejšie letiská, na ktoré z Košíc jazdíme, preto pri rannom odlete často vyrážame v noci. Vďaka časovej objednávke máte istotu, že auto bude pred domom presne v dohodnutom čase, a cestu môžete prespať v pohodlnom sedadle. Na trase si podľa potreby dáme krátku prestávku.",
          "Pri návrate sledujeme váš let a vodič vás počká v príletovej hale. Ak by sa prílet výrazne posunul, dispečing vás bude kontaktovať a čas vyzdvihnutia dohodne s vami.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi Košice – Katovice?",
        answer: "Transfer Košice – Katovice stojí 350 € za auto, nie za osobu.",
      },
      {
        question: "Ako dlho trvá cesta z Košíc na letisko Katovice?",
        answer: "Približne 4 až 4,5 hodiny, vzdialenosť je okolo 340 km.",
      },
      {
        question: "Odveziete ma aj do Katovíc, nielen na letisko?",
        answer:
          "Áno, odvezieme vás na letisko Pyrzowice aj na akúkoľvek adresu v Katoviciach a okolí.",
      },
      {
        question: "Je v cene DPH?",
        answer: "Nie sme platcami DPH, uvedená cena je konečná.",
      },
      {
        question: "Je to zdieľaný transfer?",
        answer:
          "Nie. Ide o individuálnu prepravu na objednávku, v aute cestujete len vy.",
      },
      {
        question: "Dá sa zastaviť po ceste?",
        answer:
          "Áno, krátku zastávku na oddych si môžete dohodnúť pri objednávke.",
      },
      {
        question: "Čo ak bude môj let meškať?",
        answer:
          "Sledujeme váš let. Pri vyzdvihnutí na letisku Katovice čas pristavenia prispôsobíme skutočnému príletu, stačí v objednávke uviesť číslo letu.",
      },
    ],
    related: [
      "transfer-kosice-krakow",
      "transfer-kosice-rzeszow",
      "sluzby-pre-firmy",
      "transfer-kosice-budapest",
    ],
  },

  // ───────────────────────────── Viedeň ─────────────────────────────
  {
    slug: "transfer-kosice-viedna",
    navLabel: "Transfer Košice – letisko Viedeň",
    seoTitle:
      "Taxi Košice – letisko Viedeň (VIE) 450 € | Transfer 24/7 | E-TAXI",
    seoDescription:
      "Individuálna preprava z Košíc na letisko Viedeň-Schwechat aj do centra Viedne za pevnú cenu 450 € za auto. Od dverí až pred terminál, 24/7, platba kartou aj na faktúru.",
    keywords:
      "taxi Košice Viedeň, transfer Košice Viedeň, preprava Košice Viedeň, airport transfer Košice Vienna, airporttransfer Viedeň, letisko Viedeň Schwechat transfer, individuálna preprava Viedeň",
    h1: "Taxi a transfer Košice – letisko Viedeň",
    lead: "Diaľkový súkromný transfer z Košíc na letisko Viedeň-Schwechat alebo do centra Viedne. Pohodlne, bez prestupov a v čase, ktorý si vyberiete, za pevnú cenu 450 € za auto.",
    serviceType: "Letiskový transfer",
    price: "450",
    priceLabel: "450 €",
    airportCode: "VIE",
    destinationName: "Letisko Viedeň-Schwechat",
    facts: [
      { label: "Cena", value: "450 € za auto" },
      { label: "Trasa", value: "Košice – letisko Viedeň (VIE)" },
      { label: "Vzdialenosť", value: "cca 450 – 480 km" },
      { label: "Čas jazdy", value: "4,5 – 5 hod." },
    ],
    sections: [
      {
        title: "Na viedenské letisko bez vlakov a prestupov",
        paragraphs: [
          "Letisko Viedeň-Schwechat ponúka najširšiu ponuku diaľkových a transatlantických letov v regióne. Z Košíc sa naň dá dostať vlakom s prestupmi a ďalšou dopravou z Bratislavy či Viedne, čo s kuframi a pri rannom odlete znamená dlhú a únavnú cestu.",
          "S E-TAXI cestujete od dverí až pred terminál. Nejazdíme v pravidelných intervaloch, odchod určíte vy. V aute ste len vy a vaši spolucestujúci, takže cestu môžete využiť na oddych alebo prácu.",
        ],
      },
      {
        title: "Trasa Košice – Viedeň a čas jazdy",
        paragraphs: [
          "Najčastejšie jazdíme po diaľnici cez Slovensko a Bratislavu, podľa situácie na cestách môže vodič zvoliť aj trasu cez Maďarsko. Vzdialenosť je približne 450 až 480 km a jazda trvá zvyčajne 4,5 až 5 hodín vrátane krátkej prestávky.",
          "Pri odlete z Viedne odporúčame vyraziť s rezervou aspoň sedem hodín pred odletom, pri diaľkových letoch radšej viac. Čas odchodu naplánujeme spolu pri objednávke, aj na nočný odchod.",
        ],
      },
      {
        title: "Od dverí až pred terminál, aj do centra Viedne",
        paragraphs: [
          "Vyzdvihneme vás pred domom v Košiciach alebo na zvolenom mieste a odvezieme pred odletovú halu letiska Viedeň. Ak cestujete za prácou alebo na kultúru, odvezieme vás na hotel či adresu v centre Viedne.",
          "Po prílete vás vodič čaká v príletovej hale, na požiadanie s tabuľkou s vaším menom. Čas vyzdvihnutia prispôsobíme skutočnému príletu.",
        ],
        bullets: [
          "odchod kedykoľvek, aj v noci",
          "prestávka na oddych počas cesty",
          "moderné vozidlá s pohodlnými sedadlami, na požiadanie elektrická Tesla",
          "detská sedačka zdarma, kombi na viac batožiny",
        ],
      },
      {
        title: "Cena transferu Košice – Viedeň",
        paragraphs: [
          "Transfer Košice – Viedeň stojí 450 € za celé auto, nie za osobu. Pri ceste vo viacerých je cena na osobu porovnateľná s inými spôsobmi dopravy, no cestujete priamo a pohodlne. Cena je pevná a bez skrytých poplatkov, nie sme platcami DPH.",
          "Platiť môžete kartou bez poplatku, v hotovosti alebo na faktúru. Firmám ponúkame mesačné vyúčtovanie.",
        ],
      },
      {
        title: "Pre koho je transfer do Viedne vhodný",
        paragraphs: [
          "Transfer využívajú cestujúci na diaľkové lety, rodiny na dovolenku, firmy pri služobných cestách a návštevníci koncertov či veľtrhov vo Viedni. Odvezieme vás aj späť z Viedne do Košíc alebo na inú adresu na Slovensku.",
        ],
      },
      {
        title: "Praktické tipy pre cestu do Viedne",
        paragraphs: [
          "Pri diaľkových a transatlantických letoch z Viedne odporúčajú letecké spoločnosti prísť na letisko aspoň tri hodiny pred odletom. Odchod z Košíc preto plánujeme s dostatočnou rezervou a v aute si môžete oddýchnuť. Na trase je bežná krátka prestávka na občerstvenie.",
          "Pri prílete do Viedne sledujeme váš let, takže ak lietadlo mešká, vodič na vás počká. Po dlhom lete tak nemusíte riešiť vlak ani prestup v Bratislave a domov sa dostanete priamo.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi Košice – Viedeň?",
        answer: "Transfer Košice – Viedeň stojí 450 € za auto, nie za osobu.",
      },
      {
        question: "Ako dlho trvá cesta z Košíc na letisko Viedeň?",
        answer:
          "Zvyčajne 4,5 až 5 hodín. Vzdialenosť je približne 450 až 480 km podľa trasy.",
      },
      {
        question: "Odveziete ma aj do centra Viedne?",
        answer:
          "Áno, odvezieme vás na letisko Schwechat aj na akúkoľvek adresu vo Viedni.",
      },
      {
        question: "Kedy objednať transfer do Viedne?",
        answer:
          "Pri dlhých trasách odporúčame objednať aspoň deň vopred. Časová objednávka je zdarma.",
      },
      {
        question: "Je to zdieľaný transfer?",
        answer:
          "Nie. Ide o individuálnu prepravu na objednávku, odchod sa riadi vaším letom.",
      },
      {
        question: "Dá sa zaplatiť kartou alebo na faktúru?",
        answer:
          "Áno, kartou bez poplatku, v hotovosti alebo na faktúru. Nie sme platcami DPH.",
      },
      {
        question: "Čo ak bude môj let meškať?",
        answer:
          "Sledujeme váš let. Pri vyzdvihnutí na letisku Viedeň čas pristavenia prispôsobíme skutočnému príletu, stačí v objednávke uviesť číslo letu.",
      },
    ],
    related: [
      "transfer-kosice-bratislava",
      "transfer-kosice-budapest",
      "transfer-kosice-katowice",
      "taxi-letisko-kosice",
    ],
  },

  // ───────────────────────────── Debrecín ─────────────────────────────
  {
    slug: "transfer-kosice-debrecin",
    navLabel: "Transfer Košice – letisko Debrecín",
    seoTitle:
      "Taxi Košice – letisko Debrecín (DEB) 220 € | Transfer 24/7 | E-TAXI",
    seoDescription:
      "Individuálna preprava z Košíc na letisko Debrecín aj do mesta za pevnú cenu 220 € za auto. Približne 2 – 2,5 hod., od dverí až pred terminál, 24/7, platba kartou aj na faktúru.",
    keywords:
      "taxi Košice Debrecín, transfer Košice Debrecín, preprava Košice Debrecín, airport transfer Košice Debrecen, airporttransfer Debrecín, letisko Debrecín transfer, individuálna preprava Debrecín",
    h1: "Taxi a transfer Košice – letisko Debrecín",
    lead: "Najkratší z našich zahraničných letiskových transferov: z Košíc na letisko Debrecín alebo na adresu v meste, priamo a bez prestupov, za pevnú cenu 220 € za auto.",
    serviceType: "Letiskový transfer",
    price: "220",
    priceLabel: "220 €",
    airportCode: "DEB",
    destinationName: "Letisko Debrecín",
    facts: [
      { label: "Cena", value: "220 € za auto" },
      { label: "Trasa", value: "Košice – letisko Debrecín (DEB)" },
      { label: "Vzdialenosť", value: "cca 190 km" },
      { label: "Čas jazdy", value: "2 – 2,5 hod." },
    ],
    sections: [
      {
        title: "Debrecín ako blízka alternatíva k Budapešti",
        paragraphs: [
          "Letisko Debrecín ponúka lety nízkonákladových spoločností do viacerých európskych miest a z Košíc je bližšie ako Budapešť. Verejnou dopravou sa naň však priamo nedostanete a pravidelné spoje medzi Košicami a Debrecínom takmer neexistujú.",
          "E-TAXI vás odvezie individuálne a priamo. Nejazdíme v intervaloch, čas odchodu si určíte podľa svojho letu, vyzdvihneme vás pred domom a vystúpite pred terminálom.",
        ],
      },
      {
        title: "Trasa Košice – Debrecín a čas jazdy",
        paragraphs: [
          "Trasa vedie cez hraničný priechod Milhosť – Tornyosnémeti, okolo Miškovca a ďalej po diaľnici do Debrecína. Vzdialenosť je približne 190 km a jazda trvá zvyčajne 2 až 2,5 hodiny.",
          "Pri odlete odporúčame z Košíc vyraziť približne štyri hodiny pred odletom, aby ste mali rezervu na premávku aj na odbavenie.",
        ],
      },
      {
        title: "Od dverí až pred terminál, aj do mesta",
        paragraphs: [
          "Vyzdvihneme vás pred domom v Košiciach alebo na zvolenom mieste a odvezieme pred terminál letiska Debrecín. Okrem letiska jazdíme aj na adresy v Debrecíne, napríklad do firiem, na univerzitu, do nemocnice či na kúpalisko.",
          "Pri prílete vás vodič čaká na letisku, čas vyzdvihnutia prispôsobíme vášmu letu.",
        ],
        bullets: [
          "odchod kedykoľvek, aj na skoré ranné lety",
          "jazda priamo, bez zbierania iných cestujúcich",
          "detská sedačka zdarma, na požiadanie elektrická Tesla",
        ],
      },
      {
        title: "Cena transferu Košice – Debrecín",
        paragraphs: [
          "Transfer Košice – Debrecín stojí 220 € za celé auto, nie za osobu. Cena je pevná, známa vopred a bez skrytých poplatkov. Nie sme platcami DPH, suma je konečná.",
          "Platiť môžete kartou bez poplatku, v hotovosti alebo na faktúru. Pre firmy s pravidelnými cestami do Maďarska ponúkame mesačné vyúčtovanie.",
        ],
      },
      {
        title: "Pre koho je transfer do Debrecína vhodný",
        paragraphs: [
          "Trasu využívajú cestujúci na lety z Debrecína, firmy s partnermi v regióne, študenti debrecínskej univerzity aj návštevníci kúpeľov. Odvezieme vás aj späť z Debrecína do Košíc.",
        ],
      },
      {
        title: "Praktické tipy pre cestu do Debrecína",
        paragraphs: [
          "Letisko Debrecín je menšie a odbavenie býva rýchlejšie ako v Budapešti, preto je obľúbené najmä pri dovolenkových a nízkonákladových letoch. Pri odlete však aj tak počítajte s rezervou na prípadné zdržanie na hraničnom priechode či na diaľnici pri Miškovci.",
          "Ak cestujete s rodinou, detskú sedačku pripravíme zdarma a na požiadanie pristavíme priestranné kombi. Pri prílete sledujeme váš let a vodič vás vyzdvihne pred terminálom, aj keď lietadlo mešká.",
          "Platiť môžete v eurách kartou alebo v hotovosti, maďarské forinty nepotrebujete. Firmám vystavíme faktúru.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi Košice – Debrecín?",
        answer: "Transfer Košice – Debrecín stojí 220 € za auto, nie za osobu.",
      },
      {
        question: "Ako dlho trvá jazda z Košíc do Debrecína?",
        answer: "Približne 2 až 2,5 hodiny, vzdialenosť je okolo 190 km.",
      },
      {
        question: "Jazdíte len na letisko alebo aj do mesta?",
        answer: "Na letisko aj na akúkoľvek adresu v Debrecíne a okolí.",
      },
      {
        question: "Je v cene DPH?",
        answer: "Nie sme platcami DPH, cena je konečná.",
      },
      {
        question: "Je to zdieľaný transfer?",
        answer: "Nie. Ide o individuálnu prepravu, v aute cestujete len vy.",
      },
      {
        question: "Čo ak bude môj let meškať?",
        answer:
          "Sledujeme váš let. Pri vyzdvihnutí na letisku Debrecín čas pristavenia prispôsobíme skutočnému príletu, stačí v objednávke uviesť číslo letu.",
      },
      {
        question: "Musím mať pri platbe forinty?",
        answer:
          "Nie, transfer platíte v eurách kartou, v hotovosti alebo na faktúru.",
      },
    ],
    related: [
      "transfer-kosice-budapest",
      "transfer-kosice-viedna",
      "taxi-letisko-kosice",
      "sluzby-pre-firmy",
    ],
  },

  // ───────────────────────────── Bratislava ─────────────────────────────
  {
    slug: "transfer-kosice-bratislava",
    navLabel: "Transfer Košice – Bratislava",
    seoTitle:
      "Taxi Košice – Bratislava a letisko BTS 390 € | Transfer 24/7 | E-TAXI",
    seoDescription:
      "Individuálna preprava z Košíc do Bratislavy a na letisko M. R. Štefánika za pevnú cenu 390 € za auto. Od dverí až na adresu, 24/7, platba kartou aj na faktúru.",
    keywords:
      "taxi Košice Bratislava, transfer Košice Bratislava, preprava Košice Bratislava, airport transfer Bratislava, airporttransfer letisko Bratislava, individuálna preprava Bratislava, Košice Bratislava taxi cena",
    h1: "Taxi a transfer Košice – Bratislava",
    lead: "Cesta z východu na západ Slovenska bez prestupov a bez prispôsobovania sa vlakom či autobusom. Odvezieme vás z Košíc na adresu v Bratislave alebo na letisko M. R. Štefánika za pevnú cenu 390 € za auto.",
    serviceType: "Diaľkový transfer",
    price: "390",
    priceLabel: "390 €",
    airportCode: "BTS",
    destinationName: "Bratislava a letisko M. R. Štefánika",
    facts: [
      { label: "Cena", value: "390 € za auto" },
      { label: "Trasa", value: "Košice – Bratislava / letisko BTS" },
      { label: "Vzdialenosť", value: "cca 400 km" },
      { label: "Čas jazdy", value: "4 – 4,5 hod." },
    ],
    sections: [
      {
        title: "Z Košíc do Bratislavy na čas, ktorý si určíte",
        paragraphs: [
          "Vlak a autobus medzi Košicami a Bratislavou jazdia podľa cestovného poriadku, z adresy na stanicu a zo stanice na cieľ musíte riešiť ďalšiu dopravu. S E-TAXI vás vyzdvihneme pred domom a vystúpite priamo na mieste, kam potrebujete.",
          "Nejazdíme v pravidelných intervaloch, každá preprava je individuálna. Odchod sa riadi vami, či už idete na rokovanie, na úrad, do nemocnice, na letisko alebo sťahujete člena rodiny.",
        ],
      },
      {
        title: "Trasa Košice – Bratislava a čas jazdy",
        paragraphs: [
          "Jazdíme po diaľnici a rýchlostných cestách cez stred Slovenska. Vzdialenosť je približne 400 km a jazda trvá zvyčajne 4 až 4,5 hodiny vrátane krátkej prestávky. Presnú trasu volí vodič podľa aktuálnej situácie na cestách.",
        ],
      },
      {
        title: "Na adresu v Bratislave aj na letisko",
        paragraphs: [
          "Odvezieme vás na hotel, do firmy, na ministerstvo, do nemocnice alebo na letisko M. R. Štefánika. Ak odlietate z Viedne, pozrite si náš transfer Košice – Viedeň.",
          "Cestou späť vás vyzdvihneme v Bratislave alebo na letisku a odvezieme až pred dvere v Košiciach.",
        ],
        bullets: [
          "odchod kedykoľvek, aj skoro ráno na rokovanie",
          "pohodlné sedadlá a priestor na prácu počas jazdy",
          "na požiadanie elektrická Tesla",
          "faktúra pre firmy a mesačné vyúčtovanie",
        ],
      },
      {
        title: "Cena transferu Košice – Bratislava",
        paragraphs: [
          "Transfer Košice – Bratislava stojí 390 € za celé auto, nie za osobu. Cena je pevná, známa vopred a bez skrytých poplatkov. Nie sme platcami DPH.",
          "Zaplatiť môžete kartou bez poplatku, v hotovosti alebo na faktúru.",
        ],
      },
      {
        title: "Pre firmy aj jednotlivcov",
        paragraphs: [
          "Trasu využívajú najmä firmy pri služobných cestách, keď je dôležité prísť oddýchnutý a včas, ale aj jednotlivci a rodiny so sťahovaním menšieho objemu vecí alebo s väčšou batožinou.",
        ],
      },
      {
        title: "Výhody oproti vlaku a autobusu",
        paragraphs: [
          "Pri ceste vlakom alebo autobusom sa musíte dostať na stanicu, prispôsobiť sa odchodu spoja a v Bratislave riešiť ďalšiu dopravu na konečnú adresu. Pri individuálnej preprave odpadajú všetky prestupy: nastúpite pred domom a vystúpite presne tam, kam potrebujete, aj s väčšou batožinou.",
          "Počas jazdy môžete pracovať, telefonovať alebo oddychovať v pohodlnom sedadle. Pri viacerých cestujúcich sa cena za auto rozdelí, takže transfer býva výhodný aj pre kolegov, ktorí cestujú spolu na rokovanie.",
          "Na požiadanie pristavíme elektrické vozidlo Tesla, ak chcete cestovať bez lokálnych emisií.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi Košice – Bratislava?",
        answer:
          "Transfer Košice – Bratislava stojí 390 € za auto, nie za osobu.",
      },
      {
        question: "Ako dlho trvá cesta?",
        answer: "Zvyčajne 4 až 4,5 hodiny, vzdialenosť je približne 400 km.",
      },
      {
        question: "Odveziete ma aj na letisko Bratislava?",
        answer:
          "Áno, na letisko M. R. Štefánika aj na akúkoľvek adresu v Bratislave.",
      },
      {
        question: "Dá sa zaplatiť na faktúru?",
        answer: "Áno, firmám vystavujeme faktúru, nie sme platcami DPH.",
      },
      {
        question: "Je to zdieľaná preprava?",
        answer: "Nie, ide o individuálnu prepravu. V aute cestujete len vy.",
      },
      {
        question: "Môžeme cestou zastaviť?",
        answer:
          "Áno, krátku prestávku alebo zastávku po ceste si dohodnete pri objednávke.",
      },
    ],
    related: [
      "transfer-kosice-viedna",
      "sluzby-pre-firmy",
      "taxi-letisko-kosice",
      "transfer-kosice-budapest",
    ],
  },

  // ───────────────────────────── Rzeszów (NOVÁ) ─────────────────────────────
  {
    slug: "transfer-kosice-rzeszow",
    navLabel: "Transfer Košice – letisko Rzeszów",
    seoTitle: "Taxi Košice – letisko Rzeszów (RZE) | Transfer 24/7 | E-TAXI",
    seoDescription:
      "Individuálna preprava z Košíc na letisko Rzeszów-Jasionka aj do Rzeszowa. Od dverí až pred terminál, 24/7, cena za auto vopred, platba kartou aj na faktúru.",
    keywords:
      "taxi Košice Rzeszów, transfer Košice Rzeszów, preprava Košice Rzeszów, airport transfer Košice Rzeszow, airporttransfer Rzeszów, letisko Rzeszów Jasionka transfer, individuálna preprava Rzeszów",
    h1: "Taxi a transfer Košice – letisko Rzeszów",
    lead: "Súkromný transfer z Košíc na letisko Rzeszów-Jasionka, najbližšie poľské letisko k východnému Slovensku. Priamo, bez prestupov a v čase podľa vášho letu.",
    serviceType: "Letiskový transfer",
    priceLabel: "cena na vyžiadanie",
    priceOnRequest: true,
    airportCode: "RZE",
    destinationName: "Letisko Rzeszów-Jasionka",
    facts: [
      { label: "Cena", value: "na vyžiadanie, za auto" },
      { label: "Trasa", value: "Košice – letisko Rzeszów (RZE)" },
      { label: "Vzdialenosť", value: "cca 200 km" },
      { label: "Čas jazdy", value: "cca 3 – 3,5 hod." },
    ],
    sections: [
      {
        title: "Rzeszów: blízke poľské letisko pre východné Slovensko",
        paragraphs: [
          "Letisko Rzeszów-Jasionka je pre Košice, Prešov a sever východného Slovenska často najbližšou alternatívou k Budapešti či Krakovu. Verejnou dopravou je však cesta naň zložitá a pravidelné spoje takmer chýbajú.",
          "E-TAXI vás odvezie individuálne. Nejazdíme v pravidelných intervaloch ani nezbierame ďalších cestujúcich. Odchod určíte vy podľa letu, vyzdvihneme vás pred domom a vystúpite pred terminálom.",
        ],
      },
      {
        title: "Trasa Košice – Rzeszów a čas jazdy",
        paragraphs: [
          "Trasa vedie cez Prešov a Svidník na hraničný priechod Vyšný Komárnik – Barwinek a ďalej cez Duklu a Krosno do Rzeszowa. Letisko Jasionka leží severne od mesta. Vzdialenosť je približne 200 km a jazda trvá zvyčajne 3 až 3,5 hodiny podľa počasia a premávky.",
          "Pri odlete odporúčame vyraziť približne päť hodín pred odletom. Čas odchodu vám radi naplánujeme pri objednávke.",
        ],
      },
      {
        title: "Od dverí až pred terminál",
        paragraphs: [
          "Vyzdvihneme vás pred domom v Košiciach, v Prešove alebo na inom zvolenom mieste po ceste a odvezieme vás pred terminál letiska Rzeszów alebo na adresu v meste. Pri návrate vás vodič čaká na letisku a čas vyzdvihnutia prispôsobí vášmu letu.",
        ],
        bullets: [
          "odchod kedykoľvek, aj na skoré ranné lety",
          "vyzdvihnutie aj v Prešove či po trase",
          "detská sedačka zdarma, na požiadanie elektrická Tesla",
        ],
      },
      {
        title: "Cena transferu Košice – Rzeszów",
        paragraphs: [
          "Cenu transferu Košice – Rzeszów vám oznámime vopred podľa miesta vyzdvihnutia, vždy za celé auto, nie za osobu, a bez skrytých poplatkov. Zavolajte na " +
            PHONE +
            " alebo pošlite objednávku cez formulár a cenu vám potvrdíme ešte pred jazdou.",
          "Platiť môžete kartou bez poplatku, v hotovosti alebo na faktúru. Nie sme platcami DPH.",
        ],
      },
      {
        title: "Praktické tipy pre cestu do Rzeszowa",
        paragraphs: [
          "Trasa cez Duklianský priesmyk vedie kopcovitým terénom, v zime preto pri ranných letoch odporúčame väčšiu rezervu. Vodič sleduje počasie a situáciu na cestách a čas odchodu s vami vopred dohodne.",
          "Pri prílete sledujeme váš let a vodič vás počká pred terminálom aj pri meškaní. Detskú sedačku pripravíme zdarma a pri väčšej batožine pristavíme kombi. Platiť môžete v eurách kartou, v hotovosti alebo na faktúru, poľské zloté nepotrebujete.",
          "Transfer do Rzeszowa sa hodí aj pre firmy s partnermi v Podkarpatskom vojvodstve. Odvezieme vás na stretnutie do mesta a po jeho skončení späť do Košíc.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi Košice – letisko Rzeszów?",
        answer:
          "Cenu za auto vám potvrdíme vopred podľa miesta vyzdvihnutia. Zavolajte na " +
          PHONE +
          " alebo pošlite objednávku cez formulár.",
      },
      {
        question: "Ako dlho trvá cesta z Košíc do Rzeszowa?",
        answer: "Približne 3 až 3,5 hodiny, vzdialenosť je okolo 200 km.",
      },
      {
        question: "Môžete ma vyzdvihnúť v Prešove?",
        answer:
          "Áno, vyzdvihneme vás v Prešove alebo na inom mieste po trase podľa dohody.",
      },
      {
        question: "Je to zdieľaný transfer?",
        answer: "Nie. Ide o individuálnu prepravu, v aute cestujete len vy.",
      },
      {
        question: "Dá sa zaplatiť kartou alebo na faktúru?",
        answer: "Áno, kartou bez poplatku, v hotovosti alebo na faktúru.",
      },
      {
        question: "Čo ak bude môj let meškať?",
        answer:
          "Sledujeme váš let. Pri vyzdvihnutí na letisku Rzeszów čas pristavenia prispôsobíme skutočnému príletu, stačí v objednávke uviesť číslo letu.",
      },
      {
        question: "Musím mať pri platbe poľské zloté?",
        answer:
          "Nie, transfer platíte v eurách kartou, v hotovosti alebo na faktúru.",
      },
    ],
    related: [
      "transfer-kosice-krakow",
      "transfer-kosice-katowice",
      "taxi-letisko-kosice",
      "transfer-kosice-poprad",
    ],
  },

  // ───────────────────────────── Poprad (NOVÁ) ─────────────────────────────
  {
    slug: "transfer-kosice-poprad",
    navLabel: "Transfer Košice – letisko Poprad-Tatry",
    seoTitle:
      "Taxi Košice – letisko Poprad-Tatry (TAT) | Transfer 24/7 | E-TAXI",
    seoDescription:
      "Individuálna preprava z Košíc na letisko Poprad-Tatry, do Popradu a Vysokých Tatier. Od dverí až pred terminál alebo hotel, 24/7, cena za auto vopred, platba kartou aj na faktúru.",
    keywords:
      "taxi Košice Poprad, transfer Košice Poprad, preprava Košice Poprad, airport transfer Poprad Tatry, airporttransfer Poprad, letisko Poprad transfer, transfer Košice Vysoké Tatry, individuálna preprava Poprad",
    h1: "Taxi a transfer Košice – letisko Poprad-Tatry",
    lead: "Súkromný transfer z Košíc na letisko Poprad-Tatry, do Popradu alebo priamo na hotel vo Vysokých Tatrách. Bez prestupov a v čase, ktorý si určíte.",
    serviceType: "Letiskový transfer",
    priceLabel: "cena na vyžiadanie",
    priceOnRequest: true,
    airportCode: "TAT",
    destinationName: "Letisko Poprad-Tatry",
    facts: [
      { label: "Cena", value: "na vyžiadanie, za auto" },
      { label: "Trasa", value: "Košice – letisko Poprad-Tatry (TAT)" },
      { label: "Vzdialenosť", value: "cca 120 km" },
      { label: "Čas jazdy", value: "cca 1 – 1,5 hod." },
    ],
    sections: [
      {
        title: "Do Popradu a pod Tatry bez prestupov",
        paragraphs: [
          "Letisko Poprad-Tatry je najvyššie položeným medzinárodným letiskom na Slovensku a bránou do Vysokých Tatier. Vlakom sa z Košíc do Popradu dostanete, no z letiska či stanice na hotel v Tatrách musíte riešiť ďalší spoj, často s lyžami a kuframi.",
          "S E-TAXI cestujete individuálne od dverí až na miesto. Nejazdíme v intervaloch, nečakáte na ďalších cestujúcich a odchod si určíte sami.",
        ],
      },
      {
        title: "Trasa Košice – Poprad a čas jazdy",
        paragraphs: [
          "Jazdíme po diaľnici D1 cez Prešov a Levoču. Vzdialenosť je približne 120 km a jazda na letisko Poprad-Tatry trvá zvyčajne 1 až 1,5 hodiny. Do tatranských stredísk, ako Starý Smokovec, Štrbské Pleso či Tatranská Lomnica, je cesta o niečo dlhšia.",
        ],
      },
      {
        title: "Na letisko, do Popradu aj na hotel v Tatrách",
        paragraphs: [
          "Vyzdvihneme vás pred domom v Košiciach alebo na zvolenom mieste a odvezieme pred terminál letiska Poprad-Tatry, na stanicu, do firmy v Poprade alebo priamo pred hotel vo Vysokých Tatrách. Pri prílete vás vodič čaká na letisku a čas prispôsobí vášmu letu.",
        ],
        bullets: [
          "odchod kedykoľvek, aj na skoré lety",
          "pomoc s batožinou a lyžami, priestranné kombi",
          "detská sedačka zdarma, na požiadanie elektrická Tesla",
        ],
      },
      {
        title: "Cena transferu Košice – Poprad",
        paragraphs: [
          "Cenu transferu vám oznámime vopred podľa miesta vyzdvihnutia a cieľa, vždy za celé auto a bez skrytých poplatkov. Pre orientáciu môžete použiť aj náš základný cenník. Zavolajte na " +
            PHONE +
            " alebo pošlite objednávku cez formulár a cenu potvrdíme ešte pred jazdou.",
          "Platiť môžete kartou bez poplatku, v hotovosti alebo na faktúru. Nie sme platcami DPH.",
        ],
      },
      {
        title: "Tatry, lyžovačka aj služobné cesty",
        paragraphs: [
          "Transfer do Popradu využívajú lyžiari a turisti, ktorí chcú prísť pod Tatry bez prestupov, hotely, ktoré zabezpečujú odvoz hostí z letiska, aj firmy pri služobných cestách do Popradu a Kežmarku. Pri ceste s lyžami alebo kočíkom pristavíme priestranné kombi a s batožinou vám radi pomôžeme.",
          "Pri prílete na letisko Poprad-Tatry sledujeme váš let, takže vodič na vás počká aj pri meškaní. Detskú sedačku pripravíme zdarma.",
          "Ak priletíte do Popradu a pokračujete do Košíc, Prešova či na východ Slovenska, odvezieme vás priamo pred dvere. Na požiadanie aj elektrickou Teslou.",
        ],
      },
    ],
    faq: [
      {
        question: "Koľko stojí taxi Košice – letisko Poprad?",
        answer:
          "Cenu za auto vám potvrdíme vopred podľa miesta vyzdvihnutia a cieľa. Zavolajte na " +
          PHONE +
          " alebo pošlite objednávku cez formulár.",
      },
      {
        question: "Ako dlho trvá cesta z Košíc na letisko Poprad-Tatry?",
        answer: "Zvyčajne 1 až 1,5 hodiny, vzdialenosť je približne 120 km.",
      },
      {
        question: "Odveziete ma aj na hotel vo Vysokých Tatrách?",
        answer:
          "Áno, odvezieme vás priamo pred hotel v tatranských strediskách.",
      },
      {
        question: "Zmestia sa do auta lyže?",
        answer:
          "Áno, pri lyžiach a väčšej batožine pristavíme priestranné kombi. Uveďte to v objednávke.",
      },
      {
        question: "Je to zdieľaný transfer?",
        answer: "Nie. Ide o individuálnu prepravu, v aute cestujete len vy.",
      },
      {
        question: "Čo ak bude môj let meškať?",
        answer:
          "Sledujeme váš let. Pri vyzdvihnutí na letisku Poprad-Tatry čas pristavenia prispôsobíme skutočnému príletu, stačí v objednávke uviesť číslo letu.",
      },
    ],
    related: [
      "taxi-letisko-kosice",
      "transfer-kosice-krakow",
      "transfer-kosice-rzeszow",
      "sluzby-pre-firmy",
    ],
  },
];
