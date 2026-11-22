// Rozcestník letiskových a diaľkových transferov (iba SK) — odkaz z menu Ponuka.
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

const HUB_SLUG = "letiskove-transfery";
const URL = `${SITE_URL}/${HUB_SLUG}`;
const TITLE = "Letiskové transfery z Košíc – Budapešť, Krakov, Viedeň a ďalšie | E-TAXI";
const DESCRIPTION =
  "Individuálna preprava a airport transfer z Košíc na letiská Košice, Budapešť, Krakov, Katovice, Viedeň, Debrecín, Bratislava, Rzeszów a Poprad. Pevná cena za auto, 24/7, od dverí až pred terminál.";

export const getServerSideProps: GetServerSideProps = async ({ locale, res }) => {
  if (locale && locale !== "sk") return { redirect: { destination: `/${HUB_SLUG}`, permanent: false, locale: false } as never };
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
  return { props: {} };
};

const fact = (labels: string[], facts: { label: string; value: string }[]) => facts.find((f) => labels.includes(f.label))?.value;

export default function AirportTransfersHub() {
  const schemas = [
    businessNodeSchema(),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Letiskové transfery z Košíc",
      itemListElement: ROUTE_PAGES.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.h1, url: `${SITE_URL}/${p.slug}` })),
    },
    breadcrumbSchema([
      { name: "Domov", url: `${SITE_URL}/` },
      { name: "Letiskové transfery", url: URL },
    ]),
  ];

  return (
    <>
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        keywords="letiskové transfery Košice, airport transfer Košice, airporttransfer, preprava na letisko, transfer na letisko, individuálna preprava, taxi letisko"
        url={URL}
        singleLocale
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
            <nav aria-label="Navigácia" className="flex items-center gap-1 text-sm text-white/70 mb-6">
              <Link href="/" className="hover:text-white">Domov</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Letiskové transfery</span>
            </nav>
            <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">Letiskové transfery z Košíc</h1>
            <p className="text-lg text-white/85">
              Individuálna preprava na letiská v Košiciach, Budapešti, Krakove, Katoviciach, Viedni, Debrecíne, Bratislave, Rzeszówe a Poprade.
              Nejazdíme v pravidelných intervaloch: vyzdvihneme vás pred domom v čase, ktorý vám vyhovuje, a odvezieme až pred terminál za pevnú cenu za auto.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/#objednavka">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />Objednať transfer
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
            <h2 id="trasy" className="font-display font-bold text-2xl mb-4">Vyberte si letisko</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROUTE_PAGES.map((p) => {
                const time = fact(["Čas jazdy", "Čas jazdy z centra"], p.facts);
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/${p.slug}`}
                      className="flex h-full flex-col rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition"
                    >
                      <span className="flex items-center gap-2 font-display font-semibold text-lg text-[#282462] dark:text-white">
                        <Plane className="w-5 h-5 shrink-0" aria-hidden="true" />
                        {p.navLabel.replace(/^Transfer /, "").replace(/^Taxi na letisko/, "Letisko")}
                        {p.airportCode && <span className="text-sm font-normal text-muted-foreground">({p.airportCode})</span>}
                      </span>
                      <span className="mt-3 font-display font-bold text-2xl text-accent">{p.priceLabel}</span>
                      {time && (
                        <span className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          {time}
                        </span>
                      )}
                      <span className="mt-auto pt-3 text-sm font-semibold text-primary">Detail transferu →</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Ceny sú za celé auto, nie za osobu. Nie sme platcami DPH. Kompletný prehľad nájdete v <Link href="/cennik" className="underline">cenníku</Link>.
            </p>
          </section>

          <BenefitsSection />
          <OrderStepsSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
