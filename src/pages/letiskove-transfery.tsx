// Rozcestník letiskových a diaľkových transferov (SK + EN/DE/HU/PL) — odkaz z menu Ponuka.
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChevronRight, Phone, Calendar, Clock, Plane } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BenefitsSection, OrderStepsSection } from "@/components/BenefitsSection";
import { ROUTE_PAGES } from "@/content/routePages";
import { SITE_URL } from "@/locales";
import { breadcrumbSchema, businessNodeSchema, jsonLdScript } from "@/lib/schema";
import { ROUTE_CONTENT } from "@/content/i18n";
import { HUB_SLUG, isRouteLocale, localizedPriceLabel, routeAlternates, routeUrl, shortRoute } from "@/content/i18n/build";

const TITLE = "Letiskové transfery z Košíc – Budapešť, Krakov, Viedeň a ďalšie | E-TAXI";
const DESCRIPTION =
  "Individuálna preprava a airport transfer z Košíc na letiská Košice, Budapešť, Krakov, Katovice, Viedeň, Debrecín, Bratislava, Rzeszów a Poprad. Pevná cena za auto, 24/7, od dverí až pred terminál.";

export const getServerSideProps: GetServerSideProps = async ({ locale, res }) => {
  const l = locale && isRouteLocale(locale) ? locale : "sk";
  if (locale && locale !== l) return { redirect: { destination: `/${HUB_SLUG}`, permanent: false, locale: false } as never };
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
  return { props: { locale: l } };
};

const capitalize = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const fact = (labels: string[], facts: { label: string; value: string }[]) => facts.find((f) => labels.includes(f.label))?.value;

export default function AirportTransfersHub({ locale = "sk" }: { locale?: string }) {
  const c = isRouteLocale(locale) ? ROUTE_CONTENT[locale] : undefined;
  const URL = routeUrl(HUB_SLUG, locale);
  const homeLocale = locale === "pl" ? "en" : locale;
  const homeUrl = homeLocale === "sk" ? `${SITE_URL}/` : `${SITE_URL}/${homeLocale}`;
  const t = {
    title: c?.hub.seoTitle ?? TITLE,
    description: c?.hub.seoDescription ?? DESCRIPTION,
    keywords:
      c?.hub.keywords ??
      "letiskové transfery Košice, airport transfer Košice, airporttransfer, preprava na letisko, transfer na letisko, individuálna preprava, taxi letisko",
    navLabel: c?.hub.navLabel ?? "Letiskové transfery",
    h1: c?.hub.h1 ?? "Letiskové transfery z Košíc",
    home: c?.ui.home ?? "Domov",
    orderTransfer: c?.ui.orderTransfer ?? "Objednať transfer",
    chooseTitle: c?.hub.chooseTitle ?? "Vyberte si letisko",
    detail: c?.ui.detail ?? "Detail transferu →",
  };
  const cards = ROUTE_PAGES.map((p) => {
    const r = c?.routes[p.slug];
    if (!c || !r) {
      return {
        slug: p.slug,
        h1: p.h1,
        label: p.navLabel.replace(/^Transfer /, "").replace(/^Taxi na letisko/, "Letisko"),
        airportCode: p.airportCode,
        price: p.priceLabel,
        time: fact(["Čas jazdy", "Čas jazdy z centra"], p.facts),
      };
    }
    const dest = shortRoute(r.routeLabel).split(" – ").slice(1).join(" – ").split(" / ")[0];
    return { slug: p.slug, h1: r.h1, label: capitalize(dest), airportCode: p.airportCode, price: localizedPriceLabel(c, p), time: r.duration };
  });
  const schemas = [
    businessNodeSchema(),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t.h1,
      itemListElement: cards.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.h1, url: routeUrl(p.slug, locale) })),
    },
    breadcrumbSchema([
      { name: t.home, url: homeUrl },
      { name: t.navLabel, url: URL },
    ]),
  ];

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={t.keywords}
        url={URL}
        alternates={routeAlternates(HUB_SLUG)}
      />
      <Head>
        {schemas.map((s, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(s)} />
        ))}
      </Head>
      <Header />
      <main className="pt-24 pb-20">
        <section className="bg-gradient-to-br from-[#282462] to-[#3b3690] text-white py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <nav aria-label={c ? "Breadcrumb" : "Navigácia"} className="flex items-center gap-1 text-sm text-white/70 mb-6">
              <Link href="/" locale={homeLocale} className="hover:text-white">{t.home}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{t.navLabel}</span>
            </nav>
            <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">{t.h1}</h1>
            <p className="text-lg text-white/85">
              {c ? c.hub.lead : (<>
              Individuálna preprava na letiská v Košiciach, Budapešti, Krakove, Katoviciach, Viedni, Debrecíne, Bratislave, Rzeszówe a Poprade.
              Nejazdíme v pravidelných intervaloch: vyzdvihneme vás pred domom v čase, ktorý vám vyhovuje, a odvezieme až pred terminál za pevnú cenu za auto.
              </>)}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/#objednavka" locale={homeLocale}>
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />{t.orderTransfer}
                </Button>
              </Link>
              <a href="tel:+421911606206">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-white/90 text-primary font-display font-semibold">
                  <Phone className="w-5 h-5 mr-2" /><span className="tabular-nums">+421 911 606 206</span>
                </Button>
              </a>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-12">
          <section aria-labelledby="trasy">
            <h2 id="trasy" className="font-display font-bold text-2xl mb-4">{t.chooseTitle}</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((p) => {
                const time = p.time;
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/${p.slug}`}
                      className="flex h-full flex-col rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition"
                    >
                      <span className="flex items-center gap-2 font-display font-semibold text-lg text-[#282462] dark:text-white">
                        <Plane className="w-5 h-5 shrink-0" aria-hidden="true" />
                        {p.label}
                        {p.airportCode && <span className="text-sm font-normal text-muted-foreground">({p.airportCode})</span>}
                      </span>
                      <span className="mt-3 font-display font-bold text-2xl text-accent">{p.price}</span>
                      {time && (
                        <span className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          {time}
                        </span>
                      )}
                      <span className="mt-auto pt-3 text-sm font-semibold text-primary">{t.detail}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              {c ? (<>{c.hub.note} <Link href="/cennik" locale={homeLocale} className="underline">{c.ui.fullPriceList}</Link></>) : (<>Ceny sú za celé auto, nie za osobu. Nie sme platcami DPH. Kompletný prehľad nájdete v <Link href="/cennik" className="underline">cenníku</Link>.</>)}
            </p>
          </section>

          {c ? <BenefitsSection title={c.benefitsTitle} lead={c.benefitsLead} items={c.benefits} /> : <BenefitsSection />}
          {c ? <OrderStepsSection title={c.orderStepsTitle} steps={c.orderSteps} /> : <OrderStepsSection />}
        </div>
      </main>
      <Footer />
    </>
  );
}
