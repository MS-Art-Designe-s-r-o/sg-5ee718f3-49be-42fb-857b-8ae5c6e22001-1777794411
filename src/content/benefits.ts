// Zdieľané výhody E-TAXI pre trasové stránky a homepage (iba SK).
// source: "peter" = požiadavka majiteľa, "web" = už uvedené inde na webe, "new" = návrh na schválenie.
// Pole `source` sa na webe nezobrazuje — slúži len na kontrolu obsahu.

export type BenefitIcon =
  | "home"
  | "clock"
  | "user"
  | "receipt"
  | "card"
  | "armchair"
  | "leaf"
  | "shield"
  | "calendar"
  | "zap"
  | "check"
  | "plane"
  | "sign"
  | "luggage"
  | "baby"
  | "tag"
  | "map";

export type Benefit = { icon: BenefitIcon; title: string; text: string; source: "peter" | "web" | "new" };

export const BENEFITS_TITLE = "Prečo individuálna preprava s E-TAXI";
export const BENEFITS_LEAD =
  "Nejazdíme podľa cestovného poriadku ani v pravidelných intervaloch. Každý transfer je individuálny a prispôsobený vám: vy určíte čas, miesto vyzdvihnutia aj cieľ, nie preprava vás.";

export const BENEFITS: Benefit[] = [
  {
    icon: "user",
    title: "Individuálna preprava, nie zvoz",
    text: "V aute cestujete len vy a vaši spolucestujúci. Nezbierame ďalších pasažierov po ceste a nečakáte na odchod linky, odchod sa riadi vaším letom.",
    source: "peter",
  },
  {
    icon: "home",
    title: "Od dverí až pred terminál",
    text: "Vyzdvihneme vás priamo pred domom, na zvolenom mieste alebo pred terminálom a odvezieme presne tam, kam potrebujete.",
    source: "peter",
  },
  {
    icon: "clock",
    title: "Kedykoľvek, 24/7",
    text: "Jazdíme v ľubovoľnom čase, aj na skoré ranné odlety a neskoré nočné prílety. Dispečing pracuje nepretržite.",
    source: "peter",
  },
  {
    icon: "calendar",
    title: "Časová objednávka pre pokoj",
    text: "Transfer si objednáte vopred na presný čas a máte istotu, že auto bude pristavené. Časová objednávka je zdarma.",
    source: "peter",
  },
  {
    icon: "zap",
    title: "Okamžitá objednávka pre rýchlosť",
    text: "Potrebujete ísť hneď? Zavolajte alebo objednajte v aplikácii a najbližšie voľné auto vyrazí k vám.",
    source: "peter",
  },
  {
    icon: "receipt",
    title: "Aj na faktúru",
    text: "Firmám vystavíme faktúru, pri pravidelnej spolupráci aj s mesačným vyúčtovaním. Nie sme platcami DPH.",
    source: "peter",
  },
  {
    icon: "card",
    title: "Platba kartou",
    text: "V každom vozidle platíte kartou bez poplatku, aj cez Google Pay a Apple Pay. Samozrejme aj v hotovosti.",
    source: "peter",
  },
  {
    icon: "armchair",
    title: "Moderné a pohodlné sedadlá",
    text: "Moderné, čisté a klimatizované vozidlá s pohodlnými sedadlami, v ktorých dlhá cesta rýchlo ubehne.",
    source: "peter",
  },
  {
    icon: "leaf",
    title: "Možnosť bezemisného vozidla",
    text: "Na požiadanie pristavíme elektrické vozidlo Tesla: tichá, plynulá jazda bez lokálnych emisií.",
    source: "peter",
  },
  {
    icon: "shield",
    title: "Profesionálni vodiči, bezpečná jazda",
    text: "Skúsení vodiči, ktorí trasy na letiská poznajú, jazdia s rozvahou a dodržiavajú predpisy. Vozidlá pravidelne kontrolujeme.",
    source: "peter",
  },
  {
    icon: "check",
    title: "Spoľahlivosť",
    text: "Na transfer sa môžete spoľahnúť. O stave objednávky vás informujeme SMS a polohu auta môžete sledovať na mape.",
    source: "peter",
  },
  {
    icon: "tag",
    title: "Pevná cena za auto",
    text: "Cenu poznáte vopred a platíte za celé auto, nie za každú osobu. Bez skrytých poplatkov.",
    source: "web",
  },
  {
    icon: "baby",
    title: "Detská sedačka zdarma",
    text: "Cestujete s deťmi? Detskú sedačku pripravíme bezplatne, stačí ju uviesť pri objednávke.",
    source: "peter",
  },
  {
    icon: "plane",
    title: "Sledovanie letu",
    text: "Pri vyzdvihnutí na letisku sledujeme váš let a čas pristavenia prispôsobíme skutočnému príletu, aj keď lietadlo mešká.",
    source: "peter",
  },
  {
    icon: "sign",
    title: "Privítanie s menovkou",
    text: "Na požiadanie vás vodič počká v príletovej hale s tabuľkou s vaším menom.",
    source: "peter",
  },
  {
    icon: "luggage",
    title: "Pomoc s batožinou",
    text: "Vodič vám pomôže s kuframi pri nástupe aj výstupe. Viac batožiny alebo lyže stačí uviesť v objednávke.",
    source: "peter",
  },
  {
    icon: "map",
    title: "Zastávka po ceste",
    text: "Potrebujete cestou vyzdvihnúť ďalšieho cestujúceho alebo si oddýchnuť? Zastávku si dohodnete pri objednávke.",
    source: "peter",
  },
];

export const ORDER_STEPS_TITLE = "Ako objednať transfer";
export const ORDER_STEPS: { title: string; text: string }[] = [
  {
    title: "Objednajte",
    text: "Zavolajte 24/7 na +421 911 606 206, vyplňte online formulár alebo použite mobilnú aplikáciu E-TAXI. Firmy môžu objednávať cez webový formulár Taxximo.",
  },
  {
    title: "Uveďte detaily",
    text: "Adresu vyzdvihnutia, cieľ, dátum a čas, číslo letu, počet osôb a batožiny a prípadne detskú sedačku alebo fakturačné údaje.",
  },
  {
    title: "Dostanete potvrdenie",
    text: "Objednávku potvrdíme a pred jazdou vás informujeme SMS. Vodič sa vám predstaví menom a poznávacou značkou vozidla.",
  },
  {
    title: "Cestujete v pohode",
    text: "Vodič vás vyzdvihne na dohodnutom mieste a odvezie až k terminálu alebo na adresu. Zaplatíte kartou, v hotovosti alebo na faktúru.",
  },
];
