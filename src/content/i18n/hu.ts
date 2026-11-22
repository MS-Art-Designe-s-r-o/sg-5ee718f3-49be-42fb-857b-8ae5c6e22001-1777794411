import type { LocaleContent } from "./types";

const PHONE = "+421 911 606 206";

export const hu: LocaleContent = {
  ui: {
    home: "Főoldal",
    orderRide: "Fuvar rendelése",
    orderTransfer: "Transzfer rendelése",
    faqTitle: "Gyakori kérdések",
    relatedTitle: "További transzferek",
    fullPriceList: "Teljes árlista",
    factPrice: "Ár",
    factRoute: "Útvonal",
    factDistance: "Távolság",
    factDuration: "Menetidő",
    perCar: (p) => `${p} autónként`,
    price: (a, from) => `${a} €${from ? "-tól" : ""}`,
    ctaTitle: (r) => `Rendelje meg a transzfert: ${r}`,
    ctaText: (p) => `Fix ár: ${p} autónként. Éjjel-nappal közlekedünk, és a háza elől vagy bármely választott helyről elhozzuk.`,
    detail: "A transzfer részletei →",
    pickupBullets: [
      "indulás bármikor, a kora reggeli és éjszakai járatokhoz is",
      "közvetlen út átszállás nélkül, útközben nem veszünk fel más utasokat",
      "járatfigyelés – a sofőr késés esetén is megvárja Önt",
      "ingyenes gyerekülés, tágas kombi több csomaghoz",
      "kérésre elektromos Tesla, hosszú utakon is",
    ],
  },
  benefitsTitle: "Miért válassza az E-TAXI egyéni transzferét",
  benefitsLead:
    "Nem menetrend szerint és nem fix időközönként közlekedünk. Minden transzfer egyéni, az Ön igényeihez igazodik: Ön választja meg az időpontot, a felvétel helyét és az úti célt – a szállítás alkalmazkodik Önhöz, nem fordítva.",
  benefits: [
    { title: "Egyéni transzfer, nem közös shuttle", text: "Az autóban csak Ön és útitársai utaznak. Nem gyűjtünk össze más utasokat, és nem kell menetrendhez igazodnia – az indulást a járata határozza meg." },
    { title: "A háza elől egészen a terminálig", text: "Közvetlenül a háza elől, egy választott helyről vagy a terminál elől vesszük fel, és pontosan oda visszük, ahová kell." },
    { title: "Bármikor, 0–24", text: "A nap bármely órájában közlekedünk, a kora reggeli indulásokhoz és késő esti érkezésekhez is. Diszpécserünk folyamatosan elérhető." },
    { title: "Előre rendelés a nyugalomért", text: "Rendelje meg a transzfert előre, pontos időpontra – az autó időben ott lesz. Az előrendelés ingyenes." },
    { title: "Azonnali rendelés, ha siet", text: "Most kell indulnia? Hívjon minket vagy rendeljen az alkalmazásban, és a legközelebbi szabad autó elindul Önért." },
    { title: "Számlára is", text: "Cégeknek számlát állítunk ki, rendszeres együttműködés esetén havi elszámolással. Nem vagyunk ÁFA-fizetők." },
    { title: "Kártyás fizetés", text: "Minden autóban felár nélkül fizethet kártyával, Google Pay-jel és Apple Pay-jel is, vagy készpénzzel." },
    { title: "Modern, kényelmes ülések", text: "Modern, tiszta, klimatizált autók kényelmes ülésekkel, amelyekben a hosszú út is gyorsan eltelik." },
    { title: "Kibocsátásmentes lehetőség", text: "Kérésre elektromos Teslát küldünk – csendes, nyugodt utazás helyi kibocsátás nélkül." },
    { title: "Profi sofőrök, biztonságos vezetés", text: "Tapasztalt sofőrök, akik ismerik a reptéri útvonalakat, körültekintően vezetnek és betartják a szabályokat. Autóinkat rendszeresen ellenőrizzük." },
    { title: "Megbízhatóság", text: "Számíthat a transzferére. SMS-ben tájékoztatjuk, és az autót a térképen is követheti." },
    { title: "Fix ár autónként", text: "Az árat előre tudja, és az egész autóért fizet, nem fejenként. Rejtett költségek nélkül." },
    { title: "Ingyenes gyerekülés", text: "Gyerekekkel utazik? Ingyenesen biztosítunk gyerekülést – csak jelezze rendeléskor." },
    { title: "Járatfigyelés", text: "Reptéri felvételnél figyeljük a járatát, és a felvétel idejét a tényleges érkezéshez igazítjuk, késés esetén is." },
    { title: "Fogadás névtáblával", text: "Kérésre a sofőr az érkezési csarnokban várja egy táblával, amelyen az Ön neve áll." },
    { title: "Segítség a csomagokkal", text: "A sofőr segít a bőröndökkel. Több csomag vagy síléc? Elég jelezni a rendelésben." },
    { title: "Megálló útközben", text: "Útközben fel kell venni valakit, vagy pihenőt tartana? Beszélje meg rendeléskor." },
  ],
  orderStepsTitle: "Hogyan rendelheti meg a transzfert",
  orderSteps: [
    { title: "Rendelés", text: `Hívjon minket éjjel-nappal a ${PHONE} számon, töltse ki az online űrlapot, vagy használja az E-TAXI alkalmazást. Cégek a Taxximo webes űrlapon is rendelhetnek.` },
    { title: "Adatok megadása", text: "Felvételi cím, úti cél, dátum és időpont, járatszám, az utasok és csomagok száma, szükség esetén gyerekülés vagy számlázási adatok." },
    { title: "Visszaigazolás", text: "Visszaigazoljuk a rendelést, és az út előtt SMS-t küldünk. A sofőr névvel és rendszámmal mutatkozik be." },
    { title: "Nyugodt utazás", text: "A sofőr a megbeszélt helyen veszi fel, és a terminál elé vagy a címre viszi. Fizetés kártyával, készpénzzel vagy számlára." },
  ],
  priceSection: (r, p) => ({
    title: `A(z) ${r} transzfer ára`,
    paragraphs: [
      `A(z) ${r} transzfer ára ${p} az egész autóra, nem fejenként. Az ár fix, előre ismert és rejtett költségek nélküli. Nem vagyunk ÁFA-fizetők, így az ár végleges.`,
      "Fizethet felár nélkül kártyával, készpénzzel vagy számlára. Rendszeresen utazó cégeknek havi elszámolást kínálunk.",
    ],
  }),
  commonFaq: (r, p) => [
    { question: `Mennyibe kerül a taxi: ${r}?`, answer: `A(z) ${r} transzfer ára ${p} autónként, nem fejenként. Az ár fix és előre ismert.` },
    { question: "Ez közös shuttle?", answer: "Nem. Egyéni transzfer rendelésre – az autóban csak Ön utazik, az indulás a járatához igazodik." },
    { question: "Mi történik, ha késik a járatom?", answer: "Figyeljük a járatát. Adja meg a járatszámot a rendelésben – a sofőr késés esetén is megvárja." },
    { question: "Fizethetek kártyával vagy számlára?", answer: "Igen, kártyával felár nélkül (Google Pay és Apple Pay is), készpénzzel vagy számlára. Nem vagyunk ÁFA-fizetők." },
    { question: "Van gyerekülés?", answer: "Igen, a gyerekülés ingyenes. Elég jelezni rendeléskor." },
  ],
  hub: {
    navLabel: "Reptéri transzferek",
    seoTitle: "Reptéri transzfer Kassáról – Budapest, Krakkó, Bécs és más | E-TAXI",
    seoDescription:
      "Egyéni reptéri transzfer Kassáról (Košice) a kassai, budapesti, krakkói, katowicei, bécsi, debreceni, pozsonyi, rzeszówi és poprádi repülőtérre. Fix ár autónként, 0–24, háztól a terminálig.",
    keywords: "reptéri transzfer Kassa, Kassa repülőtér taxi, transzfer Kassa Budapest, Kassa Budapest reptér, egyéni transzfer Kassa, airport transfer Košice",
    h1: "Reptéri transzferek Kassáról",
    lead:
      "Egyéni transzferek a kassai, budapesti, krakkói, katowicei, bécsi, debreceni, pozsonyi, rzeszówi és poprádi repülőtérre. Nem fix időközönként közlekedünk: a kívánt időpontban a háza elől vesszük fel, és autónkénti fix áron a terminál elé visszük.",
    chooseTitle: "Válassza ki a repülőteret",
    note: "Az árak autónként értendők, nem fejenként. Nem vagyunk ÁFA-fizetők.",
  },
  routes: {
    "taxi-letisko-kosice": {
      navLabel: "Taxi a kassai repülőtérre",
      seoTitle: "Taxi Kassa repülőtér (KSC) 18 €-tól | Reptéri transzfer 0–24 | E-TAXI",
      seoDescription: "Taxi és reptéri transzfer a kassai repülőtérre és vissza 18 €-tól. Egyéni út a háza elől a terminálig, 0–24, előre vagy azonnal, kártyával vagy számlára.",
      keywords: "taxi Kassa repülőtér, reptéri transzfer Kassa, kassai reptér taxi, KSC transzfer, Košice airport taxi",
      h1: "Taxi és transzfer a kassai repülőtérre és vissza",
      lead: "Otthonról, szállodából vagy irodából a kassai repülőtérre visszük, leszállás után pedig a terminál előtt várjuk. Éjjel-nappal, a kívánt időpontban, 18 €-tól.",
      distance: "néhány km a központtól",
      duration: "általában 15–20 perc",
      routeLabel: "Kassa – Kassai repülőtér (KSC)",
      intro: { title: "Reptéri transzfer Kassán stressz nélkül", paragraphs: [
        "A kassai repülőtér csak néhány kilométerre fekszik a belvárostól délnyugatra. Korai járatnál, bőröndökkel vagy gyerekekkel mégis megéri a megbízható fuvar. Az E-TAXI pontosan a kívánt időben veszi fel a háza, szállodája elől vagy Kassa és környéke bármely pontján, és az indulási csarnok elé viszi.",
        "Nem kell parkolni a reptéren, sem buszt keresni. Egyéni transzfernél csak Ön ül az autóban, és az út Önhöz igazodik.",
      ] },
      route: { title: "Mikor rendeljen és mikor induljon", paragraphs: [
        "Induló járathoz azt javasoljuk, hogy előző nap rendeljen, és kb. két órával a felszállás előtt legyen a reptéren. Érkezéskor elég a járatszám – a felvételt a tényleges leszálláshoz igazítjuk.",
        `Azonnal kell fuvar? Hívja a ${PHONE} számot. Kassáról a budapesti, krakkói, katowicei, rzeszówi vagy bécsi repülőtérre is elvisszük.`,
      ] },
      pickup: { title: "Felvétel a terminál előtt leszállás után", paragraphs: [
        "Leszállás után a sofőr a kassai repülőtér érkezési csarnoka előtt várja. Bármely címre elvisszük Kassán, Eperjesen, Igló vagy Nagymihály környékén, illetve megbeszélés szerint máshová.",
      ] },
      tips: { title: "Szállodáknak, cégeknek és látogatóknak", paragraphs: [
        "Kassai szállodák nálunk rendelnek reptéri fuvart vendégeiknek, cégek pedig munkatársaiknak és partnereiknek. Rendelés telefonon, alkalmazásban vagy a Taxximo webes űrlapon az összes út áttekintésével; elszámolás havonta.",
      ] },
      faq: [
        { question: "Mennyibe kerül a taxi a kassai repülőtérre?", answer: "A Kassa és a kassai repülőtér közötti transzfer 18 €-tól kerül autónként. A pontos árat a felvételi címre előre megtudja." },
        { question: "Utazhatok kora reggel vagy éjjel is?", answer: "Igen, éjjel-nappal közlekedünk. Korai járathoz érdemes előző nap rendelni; az előrendelés ingyenes." },
        { question: "Hol találkozom a sofőrrel leszállás után?", answer: "A kassai repülőtér érkezési csarnoka előtt. Kérésre a csarnokban várja névtáblával." },
      ],
    },
    "transfer-kosice-budapest": {
      navLabel: "Transzfer Kassa – budapesti repülőtér",
      seoTitle: "Reptéri transzfer Kassa – Budapest (BUD) 250 € | Taxi 0–24 | E-TAXI",
      seoDescription: "Egyéni reptéri transzfer Kassáról a budapesti Liszt Ferenc repülőtérre fix 250 € áron autónként. Háztól a terminálig, 0–24, járatfigyelés, kártya vagy számla.",
      keywords: "reptéri transzfer Kassa Budapest, taxi Kassa Budapest, Kassa Budapest reptér transzfer, egyéni transzfer Kassa Budapest, airport transfer Košice Budapest",
      h1: "Taxi és reptéri transzfer Kassa – Budapest",
      lead: "Egyéni transzfer Kassáról a budapesti Liszt Ferenc repülőtérre – átszállás, buszra várás és idegen utasok nélkül. Felvétel a háza elől, érkezés a terminál elé, fix ár 250 € autónként.",
      distance: "kb. 270 km",
      duration: "2,5–3 óra",
      routeLabel: "Kassa – Budapest repülőtér (BUD)",
      intro: { title: "Egyéni transzfer, amely a járatához igazodik", paragraphs: [
        "Budapest a legnagyobb repülőtér Kelet-Szlovákia közelében, közvetlen járatokkal Európa-szerte és azon túl. A buszok és közös shuttle-ök azonban fix időpontban indulnak, útközben más utasokat is felvesznek, és Önnek kell a menetrendhez igazodnia.",
        "Az E-TAXI-nál ez fordítva van. Nem járunk időközönként – minden transzfer egyéni. Ön választja meg az időt és a felvétel helyét, mi pedig úgy tervezzük az utat, hogy időben és hosszú várakozás nélkül érjen a terminálhoz.",
      ] },
      route: { title: "A Kassa – Budapest útvonal és menetidő", paragraphs: [
        "Kassáról a Milhosť – Tornyosnémeti határátkelőn át, autópályán Miskolc mellett, majd az M0 körgyűrűn közvetlenül a repülőtérre megyünk. A távolság kb. 270 km, a menetidő a forgalomtól függően általában 2,5–3 óra.",
        "Javasoljuk, hogy legalább két órával a felszállás előtt legyen a reptéren, schengeni övezeten kívüli járatnál kicsit korábban.",
      ] },
      pickup: { title: "Felvétel a háza elől, érkezés a terminálhoz", paragraphs: [
        "Felvesszük Kassán, környékén, Eperjesen vagy megbeszélés szerint bárhol Kelet-Szlovákiában, bepakoljuk a csomagokat, és a 2-es terminál indulási csarnoka elé visszük. Visszaúton a sofőr a budapesti repülőtér érkezési csarnokában várja.",
      ] },
      tips: { title: "Kinek ajánljuk a budapesti transzfert", paragraphs: [
        "Családoknak, akik nem akarják hetekig a reptéren parkoltatni az autót, üzleti úton lévő cégeknek és vendégtranszfert szervező szállodáknak. A budapesti repülőtérről Kassára, Eperjesre vagy a budapesti belvárosba is visszük.",
      ] },
      faq: [
        { question: "Mennyi ideig tart az út Kassáról a budapesti repülőtérre?", answer: "A távolság kb. 270 km, az út általában 2,5–3 óra." },
        { question: "Hol találkozom a sofőrrel a budapesti reptéren?", answer: "A 2-es terminál érkezési csarnokában, kérésre névtáblával. Csak adja meg a járatszámot." },
        { question: "Hány utas és csomag fér el?", answer: "Legfeljebb 4 utas. Több bőröndhöz tágas kombit küldünk – jelezze rendeléskor." },
      ],
    },
    "transfer-kosice-krakow": {
      navLabel: "Transzfer Kassa – krakkói repülőtér",
      seoTitle: "Reptéri transzfer Kassa – Krakkó (KRK) 290 € | Taxi 0–24 | E-TAXI",
      seoDescription: "Egyéni transzfer Kassáról a krakkó-balicei repülőtérre vagy Krakkó belvárosába fix 290 € áron autónként. Háztól a terminálig, 0–24, kártya vagy számla.",
      keywords: "reptéri transzfer Kassa Krakkó, taxi Kassa Krakkó, transzfer Kassa Krakkó repülőtér, Krakkó Balice transzfer",
      h1: "Taxi és reptéri transzfer Kassa – Krakkó",
      lead: "Közvetlen egyéni transzfer Kassáról a krakkó-balicei repülőtérre vagy Krakkó központjába. Átszállás, menetrend és idegen utasok nélkül – fix 290 € áron autónként.",
      distance: "kb. 270 km",
      duration: "3,5–4 óra",
      routeLabel: "Kassa – Krakkó repülőtér (KRK)",
      intro: { title: "Krakkóba átszállás és menetrend nélkül", paragraphs: [
        "A krakkói repülőtérről sok olyan közvetlen járat indul, amely Kassáról nem elérhető. Tömegközlekedéssel az út hosszú és több átszállással jár; a közös shuttle-ök csak bizonyos napokon közlekednek.",
        "Az E-TAXI testre szabott egyéni transzfert kínál: Ön választja meg az indulást a járatához, mi a háza elől vesszük fel, és a II. János Pál krakkó-balicei repülőtér termináljáig visszük.",
      ] },
      route: { title: "A Kassa – Krakkó útvonal és menetidő", paragraphs: [
        "Az útvonal Eperjesen és Észak-Szlovákián át vezet Lengyelországba. A távolság kb. 270 km, az út általában 3,5–4 óra, az útvonaltól, az időjárástól és a Krakkó környéki forgalomtól függően.",
        "Krakkói induláshoz azt javasoljuk, hogy kb. hat órával előtte induljon Kassáról.",
      ] },
      pickup: { title: "A háza elől a terminálig – és vissza", paragraphs: [
        "Kassán otthonról vagy választott helyről vesszük fel, és az indulási csarnok elé vagy krakkói szállodájához visszük. Érkezéskor a sofőr az érkezési csarnokban várja.",
      ] },
      tips: { title: "Gyakorlati tippek a krakkói úthoz", paragraphs: [
        "Télen az időjárás Észak-Szlovákiában és Dél-Lengyelországban befolyásolhatja a menetidőt – reggeli járatnál számoljon nagyobb tartalékkal. Gyerekülés ingyen; sílécekhez vagy sok bőröndhöz kombit küldünk.",
      ] },
      faq: [
        { question: "Mennyi ideig tart az út Kassáról Krakkóba?", answer: "Kb. 3,5–4 óra, mintegy 270 km." },
        { question: "Krakkó belvárosába is visznek?", answer: "Igen, a repülőtérre vagy bármely krakkói címre." },
        { question: "Mikor induljak Kassáról?", answer: "Kb. hat órával a felszállás előtt javasoljuk." },
      ],
    },
    "transfer-kosice-katowice": {
      navLabel: "Transzfer Kassa – katowicei repülőtér",
      seoTitle: "Reptéri transzfer Kassa – Katowice (KTW) 350 € | Taxi 0–24 | E-TAXI",
      seoDescription: "Egyéni transzfer Kassáról a katowice-pyrzowicei repülőtérre vagy Katowicébe fix 350 € áron autónként. Háztól a terminálig, 0–24, kártya vagy számla.",
      keywords: "reptéri transzfer Kassa Katowice, taxi Kassa Katowice, Katowice Pyrzowice transzfer",
      h1: "Taxi és reptéri transzfer Kassa – Katowice",
      lead: "Egyéni transzfer Kassáról a katowice-pyrzowicei repülőtérre vagy egy katowicei címre. Közvetlenül, átszállás nélkül, a kívánt időben – fix 350 € áron autónként.",
      distance: "kb. 340 km",
      duration: "4–4,5 óra",
      routeLabel: "Kassa – Katowice repülőtér (KTW)",
      intro: { title: "Közvetlenül Katowicébe, közös shuttle nélkül", paragraphs: [
        "A katowice-pyrzowicei repülőtér a fapados és üdülőjáratok fontos csomópontja Dél-Lengyelországban. Kassáról tömegközlekedéssel csak több átszállással juthat el oda.",
        "Az E-TAXI egyénileg viszi: menetrend és más utasok nélkül. Az indulást a járatához tervezzük, és a terminál elé visszük.",
      ] },
      route: { title: "A Kassa – Katowice útvonal és menetidő", paragraphs: [
        "Szlovákiából Lengyelországba, majd gyorsforgalmi utakon Katowice felé haladunk; a pyrzowicei repülőtér a várostól északra fekszik. Kb. 340 km, a menetidő általában 4–4,5 óra. Javasoljuk, hogy hat-hét órával a felszállás előtt induljon.",
      ] },
      pickup: { title: "A terminálhoz vagy a városba", paragraphs: [
        "Kassán vagy megbeszélés szerint Kelet-Szlovákiában vesszük fel, és a terminálhoz vagy szállodába, megbeszélésre, céghez visszük Katowicében és Sziléziában. Visszaúton a sofőr az érkezési csarnokban várja.",
      ] },
      tips: { title: "Gyakorlati tippek", paragraphs: [
        "Katowice a legtávolabbi repülőterek egyike; reggeli járatokhoz gyakran éjjel indulunk. Előrendeléssel az autó pontosan ott lesz, és útközben a kényelmes ülésben pihenhet. Igény szerint tartunk pihenőt.",
      ] },
      faq: [
        { question: "Mennyi ideig tart az út a katowicei repülőtérre?", answer: "Kb. 4–4,5 óra, mintegy 340 km." },
        { question: "Katowice városába is visznek?", answer: "Igen, a pyrzowicei repülőtérre és bármely címre Katowicében és környékén." },
      ],
    },
    "transfer-kosice-viedna": {
      navLabel: "Transzfer Kassa – bécsi repülőtér",
      seoTitle: "Reptéri transzfer Kassa – Bécs (VIE) 450 € | Taxi 0–24 | E-TAXI",
      seoDescription: "Egyéni hosszú távú transzfer Kassáról a bécs-schwechati repülőtérre vagy Bécs belvárosába fix 450 € áron autónként. 0–24, kártya vagy számla.",
      keywords: "reptéri transzfer Kassa Bécs, taxi Kassa Bécs, transzfer Kassa bécsi repülőtér, Schwechat transzfer",
      h1: "Taxi és reptéri transzfer Kassa – Bécs",
      lead: "Egyéni hosszú távú transzfer Kassáról a bécs-schwechati repülőtérre vagy Bécs belvárosába. Kényelmesen, átszállás nélkül, a kívánt időben – fix 450 € áron autónként.",
      distance: "kb. 450–480 km",
      duration: "4,5–5 óra",
      routeLabel: "Kassa – Bécs repülőtér (VIE)",
      intro: { title: "A bécsi reptérre vonat és átszállás nélkül", paragraphs: [
        "Bécs-Schwechat kínálja a régióban a legtöbb hosszú távú és tengerentúli járatot. Vonattal az út Kassáról hosszú és átszállásokkal jár – bőröndökkel és korai járattal nagyon fárasztó.",
        "Az E-TAXI-val a háza elől a terminálig utazik. Ön dönti el az indulást, az utat pedig pihenésre vagy munkára használhatja.",
      ] },
      route: { title: "A Kassa – Bécs útvonal és menetidő", paragraphs: [
        "Általában autópályán Szlovákián át, Pozsonyon keresztül megyünk, forgalomtól függően Magyarországon át is. Kb. 450–480 km, a menetidő rövid pihenővel általában 4,5–5 óra. Javasoljuk, hogy legalább hét órával a felszállás előtt induljon, hosszú távú járatnál korábban.",
      ] },
      pickup: { title: "A terminálhoz vagy Bécs belvárosába", paragraphs: [
        "Kassán vesszük fel, és a bécsi repülőtér indulási csarnoka elé vagy bécsi szállodához, címre visszük. Érkezéskor a sofőr az érkezési csarnokban várja, kérésre névtáblával – késés esetén is.",
      ] },
      tips: { title: "Gyakorlati tippek", paragraphs: [
        "A légitársaságok hosszú távú járatnál legalább három órával korábbi érkezést javasolnak; az indulást elegendő tartalékkal tervezzük. Kérésre ezen a hosszú úton is elektromos Teslával utazhat.",
      ] },
      faq: [
        { question: "Mennyi ideig tart az út Kassáról a bécsi repülőtérre?", answer: "Általában 4,5–5 óra, kb. 450–480 km." },
        { question: "Bécs belvárosába is visznek?", answer: "Igen, a schwechati repülőtérre és bármely bécsi címre." },
      ],
    },
    "transfer-kosice-debrecin": {
      navLabel: "Transzfer Kassa – debreceni repülőtér",
      seoTitle: "Reptéri transzfer Kassa – Debrecen (DEB) 220 € | Taxi 0–24 | E-TAXI",
      seoDescription: "Egyéni transzfer Kassáról a debreceni repülőtérre vagy a városba fix 220 € áron autónként. Kb. 2–2,5 óra, háztól a terminálig, 0–24.",
      keywords: "reptéri transzfer Kassa Debrecen, taxi Kassa Debrecen, transzfer Kassa Debrecen repülőtér",
      h1: "Taxi és reptéri transzfer Kassa – Debrecen",
      lead: "Legrövidebb nemzetközi reptéri transzferünk: Kassáról a debreceni repülőtérre vagy egy városi címre, közvetlenül és átszállás nélkül, fix 220 € áron autónként.",
      distance: "kb. 190 km",
      duration: "2–2,5 óra",
      routeLabel: "Kassa – Debrecen repülőtér (DEB)",
      intro: { title: "Debrecen – a közeli alternatíva Budapest helyett", paragraphs: [
        "A debreceni repülőtérről fapados járatok indulnak több európai városba, és közelebb van Kassához, mint Budapest. Közvetlen tömegközlekedési kapcsolat gyakorlatilag nincs.",
        "Az E-TAXI egyénileg és közvetlenül viszi oda: indulás a járatához, felvétel a háza elől, érkezés a terminál elé.",
      ] },
      route: { title: "A Kassa – Debrecen útvonal és menetidő", paragraphs: [
        "A Milhosť – Tornyosnémeti határátkelőn át, Miskolc mellett, autópályán Debrecenig. Kb. 190 km, a menetidő általában 2–2,5 óra. Javasoljuk, hogy kb. négy órával a felszállás előtt induljon.",
      ] },
      pickup: { title: "A terminálhoz vagy a városba", paragraphs: [
        "A debreceni repülőtér termináljához vagy egy debreceni címre visszük – céghez, egyetemre, klinikára vagy fürdőbe. Érkezéskor a sofőr a reptéren várja.",
      ] },
      tips: { title: "Gyakorlati tippek", paragraphs: [
        "A repülőtér kicsi, a check-in általában gyorsabb, mint Budapesten; a határra és az autópályára mégis tervezzen tartalékot. Euróban fizet – forintra nincs szükség.",
      ] },
      faq: [
        { question: "Mennyi ideig tart az út Debrecenbe?", answer: "Kb. 2–2,5 óra, mintegy 190 km." },
        { question: "Kell forint?", answer: "Nem, euróban fizet kártyával, készpénzzel vagy számlára." },
      ],
    },
    "transfer-kosice-bratislava": {
      navLabel: "Transzfer Kassa – Pozsony",
      seoTitle: "Transzfer Kassa – Pozsony és BTS repülőtér 390 € | Taxi 0–24 | E-TAXI",
      seoDescription: "Egyéni transzfer Kassáról Pozsonyba vagy az M. R. Štefánik repülőtérre fix 390 € áron autónként. Háztól házig, 0–24, kártya vagy számla.",
      keywords: "transzfer Kassa Pozsony, taxi Kassa Pozsony, pozsonyi repülőtér transzfer",
      h1: "Taxi és transzfer Kassa – Pozsony",
      lead: "Szlovákia keletéről nyugatra átszállás és vonat- vagy buszmenetrend nélkül. Kassáról bármely pozsonyi címre vagy az M. R. Štefánik repülőtérre visszük – fix 390 € autónként.",
      distance: "kb. 400 km",
      duration: "4–4,5 óra",
      routeLabel: "Kassa – Pozsony / BTS repülőtér",
      intro: { title: "Kassáról Pozsonyba a kívánt időben", paragraphs: [
        "A vonat és a busz menetrend szerint jár, az állomásra és onnan tovább további közlekedés kell. Az E-TAXI-val a háza előtt száll be, és pontosan ott száll ki, ahová mennie kell – legyen az üzleti találkozó, hivatal, klinika vagy repülőtér.",
      ] },
      route: { title: "Útvonal és menetidő", paragraphs: [
        "Autópályákon és gyorsforgalmi utakon haladunk Közép-Szlovákián át. Kb. 400 km, a menetidő rövid pihenővel általában 4–4,5 óra.",
      ] },
      pickup: { title: "Pozsonyi címre vagy a repülőtérre", paragraphs: [
        "Szállodához, céghez, minisztériumhoz, klinikához vagy az M. R. Štefánik repülőtérre visszük. Ha Bécsből repül, válassza Kassa – Bécs transzferünket. Visszaúton Pozsonyban vesszük fel.",
      ] },
      tips: { title: "Előnyök a vonattal és busszal szemben", paragraphs: [
        "Nincs átszállás, van hely a nagy csomagnak, és a kényelmes ülésben dolgozhat vagy pihenhet. Több utasnál az autónkénti ár megoszlik – gyakran előnyös az ugyanarra a találkozóra utazó kollégáknak.",
      ] },
      faq: [
        { question: "Mennyi ideig tart az út?", answer: "Általában 4–4,5 óra, kb. 400 km." },
        { question: "A pozsonyi repülőtérre is visznek?", answer: "Igen, az M. R. Štefánik repülőtérre és bármely pozsonyi címre." },
      ],
    },
    "transfer-kosice-rzeszow": {
      navLabel: "Transzfer Kassa – rzeszówi repülőtér",
      seoTitle: "Reptéri transzfer Kassa – Rzeszów (RZE) 270 € | Taxi 0–24 | E-TAXI",
      seoDescription: "Egyéni transzfer Kassáról a rzeszów-jasionkai repülőtérre vagy Rzeszówba fix 270 € áron autónként. Háztól a terminálig, 0–24, járatfigyelés.",
      keywords: "reptéri transzfer Kassa Rzeszów, taxi Kassa Rzeszów, Rzeszów Jasionka transzfer",
      h1: "Taxi és reptéri transzfer Kassa – Rzeszów",
      lead: "Egyéni transzfer Kassáról a rzeszów-jasionkai repülőtérre, Kelet-Szlovákiához legközelebbi lengyel reptérre. Közvetlenül, átszállás nélkül, a járatához igazítva – fix 270 € autónként.",
      distance: "kb. 200 km",
      duration: "3–3,5 óra",
      routeLabel: "Kassa – Rzeszów repülőtér (RZE)",
      intro: { title: "Rzeszów – közeli lengyel alternatíva", paragraphs: [
        "Kassa, Eperjes és Kelet-Szlovákia északi része számára Rzeszów-Jasionka gyakran a legközelebbi alternatíva Budapest vagy Krakkó helyett. Tömegközlekedési kapcsolat szinte nincs.",
        "Az E-TAXI egyénileg viszi, időközök és más utasok nélkül – felvétel a háza elől, érkezés a terminálhoz.",
      ] },
      route: { title: "Útvonal és menetidő", paragraphs: [
        "Eperjesen és Felsővízközön (Svidník) át a Vyšný Komárnik – Barwinek határátkelőig, majd Duklán és Krosnón át Rzeszówba; a jasionkai repülőtér a várostól északra van. Kb. 200 km, a menetidő általában 3–3,5 óra. Javasoljuk, hogy kb. öt órával a felszállás előtt induljon.",
      ] },
      pickup: { title: "A háza elől a terminálig", paragraphs: [
        "Felvétel Kassán, Eperjesen vagy az útvonal mentén, út a terminálhoz vagy egy rzeszówi címre. Visszaúton a sofőr a reptéren várja.",
      ] },
      tips: { title: "Gyakorlati tippek", paragraphs: [
        "A Duklai-hágón át vezető út dombos – télen tervezzen több tartalékot. Euróban fizet, złotyra nincs szükség.",
      ] },
      faq: [
        { question: "Mennyi ideig tart az út Rzeszówba?", answer: "Kb. 3–3,5 óra, mintegy 200 km." },
        { question: "Eperjesen is fel tudnak venni?", answer: "Igen, Eperjesen vagy az útvonal más pontján." },
      ],
    },
    "transfer-kosice-poprad": {
      navLabel: "Transzfer Kassa – poprádi repülőtér",
      seoTitle: "Transzfer Kassa – Poprád-Tátra repülőtér (TAT) 170 € | Taxi 0–24 | E-TAXI",
      seoDescription: "Egyéni transzfer Kassáról a Poprád-Tátra repülőtérre, Poprádra és a Magas-Tátrába. Fix 170 € autónként a repülőtérre, 0–24, kártya vagy számla.",
      keywords: "transzfer Kassa Poprád, Poprád-Tátra repülőtér transzfer, transzfer Magas-Tátra, taxi Kassa Poprád",
      h1: "Taxi és transzfer Kassa – Poprád-Tátra repülőtér",
      lead: "Egyéni transzfer Kassáról a Poprád-Tátra repülőtérre, Poprádra vagy közvetlenül magas-tátrai szállodájához. Átszállás nélkül, a kívánt időben – fix 170 € autónként a repülőtérre.",
      distance: "kb. 120 km",
      duration: "1–1,5 óra",
      routeLabel: "Kassa – Poprád-Tátra repülőtér (TAT)",
      intro: { title: "Poprádra és a Tátrába átszállás nélkül", paragraphs: [
        "A Poprád-Tátra Szlovákia legmagasabban fekvő nemzetközi repülőtere és a Magas-Tátra kapuja. Az állomásról vagy a reptérről a szállodába egyébként további járat kell – gyakran sílécekkel és bőröndökkel.",
      ] },
      route: { title: "Útvonal és menetidő", paragraphs: [
        "A D1-es autópályán Eperjesen és Lőcsén át. Kb. 120 km, a repülőtérig általában 1–1,5 óra; Ótátrafüred, Csorbató vagy Tátralomnic kicsit messzebb van.",
      ] },
      pickup: { title: "Repülőtér, Poprád vagy tátrai szálloda", paragraphs: [
        "A terminálhoz, az állomásra, egy poprádi céghez vagy közvetlenül magas-tátrai szállodája elé visszük; a szállodai út árát rendeléskor igazoljuk vissza. Érkezéskor a sofőr a reptéren várja.",
      ] },
      tips: { title: "Tátra, síelés és üzleti utak", paragraphs: [
        "Síelők, túrázók, szállodák és cégek használják ezt az útvonalat. Sílécekhez vagy babakocsihoz tágas kombit küldünk, és segítünk a csomagokkal.",
      ] },
      faq: [
        { question: "Mennyi ideig tart az út a Poprád-Tátra repülőtérre?", answer: "Általában 1–1,5 óra, kb. 120 km." },
        { question: "Magas-tátrai szállodákhoz is visznek?", answer: "Igen, közvetlenül a szállodájához; az árat rendeléskor igazoljuk vissza." },
      ],
    },
  },
};
