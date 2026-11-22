import type { Dictionary } from "./sk";
import { en } from "./en";

// Poľský slovník. Poľsky existujú len letiskové transfery (src/content/i18n/pl.ts);
// ostatné /pl/* stránky presmeruje next.config.mjs na /en. Preto tu prekladáme len
// spoločné prvky (hlavička, päta, cookies, 404), zvyšok preberáme z angličtiny.
export const pl: Dictionary = {
  ...en,
  langShort: "PL",
  langName: "Polski",
  htmlLang: "pl",
  ogLocale: "pl_PL",
  metaLanguage: "Polish",
  dateLocale: "pl-PL",

  common: {
    ...en.common,
    logoAlt: "E-TAXI Košice – logo serwisu taxi",
    call: "Zadzwoń",
    callNow: "Zadzwoń teraz",
    callPhone: "Zadzwoń +421 911 606 206",
    orderNow: "Zamów teraz",
    orderRideNow: "Zamów przejazd teraz",
    dispatch: "Dyspozytornia 24/7",
  },

  header: {
    ...en.header,
    menu: [
      {
        label: "Taxi",
        children: [
          { label: "O nas", href: "/#o-nas" },
          { label: "Nasze samochody", href: "/#vozovy-park" },
          { label: "Opinie", href: "/#recenzie" },
        ],
      },
      {
        label: "Oferta",
        children: [
          { label: "Usługi", href: "/#sluzby" },
          { label: "Cennik", href: "/cennik" },
          { label: "Dla firm", href: "/sluzby-pre-firmy" },
          { label: "Transfery lotniskowe", href: "/letiskove-transfery" },
        ],
      },
      { label: "FAQ", href: "/#faq" },
      { label: "Blog", href: "/#blog" },
    ],
    app: "Aplikacja mobilna",
    downloadApp: "Pobierz aplikację",
  },

  footer: {
    ...en.footer,
    blurb: "Profesjonalny serwis taxi w Koszycach i okolicy. Niezawodność, komfort i bezpieczeństwo to nasze priorytety.",
    servicesTitle: "Usługi",
    services: [
      { label: "Zamów przejazd", href: "/#objednavka" },
      { label: "Nasze samochody", href: "/#vozovy-park" },
      { label: "Transfery lotniskowe", href: "/letiskove-transfery" },
      { label: "Transfery dla firm", href: "/sluzby-pre-firmy" },
      { label: "Koszyce – Budapeszt", href: "/transfer-kosice-budapest" },
      { label: "Koszyce – Kraków", href: "/transfer-kosice-krakow" },
      { label: "Koszyce – Debreczyn", href: "/transfer-kosice-debrecin" },
      { label: "Koszyce – Katowice", href: "/transfer-kosice-katowice" },
      { label: "Koszyce – Wiedeń", href: "/transfer-kosice-viedna" },
      { label: "Koszyce – Bratysława", href: "/transfer-kosice-bratislava" },
      { label: "Koszyce – Rzeszów", href: "/transfer-kosice-rzeszow" },
      { label: "Koszyce – Poprad-Tatry", href: "/transfer-kosice-poprad" },
    ],
    infoTitle: "Informacje",
    info: [
      { label: "Cennik", href: "/cennik" },
      { label: "Regulamin przewozu", href: "/prepravny-poriadok" },
      { label: "Polityka prywatności", href: "/ochrana-osobnych-udajov" },
      { label: "FAQ", href: "/#faq" },
      { label: "Opinie klientów", href: "/#recenzie" },
      { label: "Blog", href: "/#blog" },
    ],
    contactTitle: "Kontakt",
    emailLabel: "E-mail",
    location: "Koszyce, Słowacja",
    hours: "Dyspozytornia 24/7",
    downloadApp: "Pobierz aplikację",
    rights: "Wszelkie prawa zastrzeżone.",
  },

  cookies: {
    ...en.cookies,
    title: "Pliki cookie i ochrona danych osobowych",
    intro: "Ta strona używa plików cookie, aby poprawić komfort korzystania i w celach marketingowych.",
    typesTitle: "Używamy następujących rodzajów plików cookie:",
    essentialLabel: "Niezbędne pliki cookie:",
    essentialText: "Wymagane do podstawowego działania strony (zapamiętanie Twoich preferencji)",
    marketingLabel: "Marketingowe pliki cookie (Google Ads):",
    marketingText:
      "Używamy Google Ads do kierowania reklam i mierzenia ich skuteczności. Te pliki cookie śledzą Twoją aktywność w sieci i mogą służyć do wyświetlania spersonalizowanych reklam.",
    consentBefore:
      "Klikając „Akceptuj wszystkie” zgadzasz się na zapisywanie plików cookie na Twoim urządzeniu w celu ułatwienia nawigacji, analizy korzystania ze strony i wsparcia naszych działań marketingowych, zgodnie z naszą ",
    consentLink: "Polityką prywatności",
    consentAfter: ".",
    gdprNote:
      "Przetwarzamy Twoje dane osobowe zgodnie z rozporządzeniem RODO (UE) 2016/679 i słowacką ustawą nr 18/2018 Z.z. o ochronie danych osobowych.",
    acceptAll: "Akceptuj wszystkie",
    essentialOnly: "Tylko niezbędne",
    rejectAll: "Odrzuć wszystkie",
    changeNote: "Swoją decyzję możesz w każdej chwili zmienić w ustawieniach przeglądarki lub usuwając pliki cookie.",
  },

  notFound: {
    title: "404 – Nie znaleziono strony",
    message: "Przepraszamy, nie znaleźliśmy żądanej strony. Mogła zostać przeniesiona, usunięta lub nigdy nie istniała.",
    back: "Powrót na stronę główną",
  },
};
