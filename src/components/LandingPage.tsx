import Head from "next/head";
import Link from "next/link";
import { ChevronRight, Phone, Calendar } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/locales";
import { LANDING_PAGES, type LandingPageData } from "@/content/landing";
import { breadcrumbSchema, businessNodeSchema, faqPageSchema, jsonLdScript, serviceSchema } from "@/lib/schema";
import { BenefitsSection, OrderStepsSection } from "@/components/BenefitsSection";
import { ROUTE_CONTENT } from "@/content/i18n";
import { isRouteLocale, routeAlternates, routeUrl, shortRoute } from "@/content/i18n/build";

export function LandingPage({ page, locale = "sk" }: { page: LandingPageData; locale?: string }) {
  // Preklady (EN/DE/HU/PL) majú vlastné texty UI; SK ostáva bez zmeny.
  const c = isRouteLocale(locale) ? ROUTE_CONTENT[locale] : undefined;
  const isRoute = Boolean(page.airportCode);
  const url = isRoute ? routeUrl(page.slug, locale) : `${SITE_URL}/${page.slug}`;
  const alternates = isRoute ? routeAlternates(page.slug) : undefined;
  // Poľsky existujú len transfery – domovská stránka a objednávka vedú na EN verziu.
  const homeLocale = locale === "pl" ? "en" : locale;
  const homeUrl = homeLocale === "sk" ? `${SITE_URL}/` : `${SITE_URL}/${homeLocale}`;
  const ui = {
    home: c?.ui.home ?? "Domov",
    orderRide: c?.ui.orderRide ?? "Objednať jazdu",
    orderTransfer: c?.ui.orderTransfer ?? "Objednať transfer",
    faqTitle: c?.ui.faqTitle ?? "Časté otázky",
    relatedTitle: c?.ui.relatedTitle ?? "Súvisiace služby",
    fullPriceList: c?.ui.fullPriceList ?? "Kompletný cenník",
  };
  const schemas = [
    businessNodeSchema(),
    serviceSchema({
      name: page.h1,
      description: page.seoDescription,
      url,
      serviceType: page.serviceType,
      price: page.price,
      areaServed: page.destinationName ? ["Košice", page.destinationName] : undefined,
      airport: page.airportCode ? { iataCode: page.airportCode, name: page.destinationName ?? page.airportCode } : undefined,
      inLanguage: locale,
    }),
    faqPageSchema(page.faq),
    breadcrumbSchema([
      { name: ui.home, url: homeUrl },
      { name: page.navLabel, url },
    ]),
  ];
  const [firstSection, ...restSections] = page.sections;
  const renderSection = (s: LandingPageData["sections"][number]) => (
    <section key={s.title}>
      <h2 className="font-display font-bold text-2xl mb-4">{s.title}</h2>
      {s.paragraphs.map((p, i) => (
        <p key={i} className="text-muted-foreground leading-relaxed mb-3">{p}</p>
      ))}
      {s.bullets && (
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          {s.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </section>
  );
  const related = (page.related.map((s) => LANDING_PAGES.find((p) => p.slug === s)).filter(Boolean) as LandingPageData[]).map((r) => ({
    slug: r.slug,
    navLabel: c?.routes[r.slug]?.navLabel ?? r.navLabel,
  }));

  return (
    <>
      <SEO title={page.seoTitle} description={page.seoDescription} keywords={page.keywords} url={url} singleLocale={!alternates} alternates={alternates} />
      <Head>
        {schemas.map((s, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(s)} />
        ))}
      </Head>
      <Header />
      <main className="pt-24 pb-20">
        <section className="bg-gradient-to-br from-[#282462] to-[#3b3690] text-white py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav aria-label={c ? "Breadcrumb" : "Navigácia"} className="flex items-center gap-1 text-sm text-white/70 mb-6">
              <Link href="/" locale={homeLocale} className="hover:text-white">{ui.home}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{page.navLabel}</span>
            </nav>
            <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">{page.h1}</h1>
            <p className="text-lg text-white/85">{page.lead}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/#objednavka" locale={homeLocale}>
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />{ui.orderRide}
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

        <div className="container mx-auto px-4 max-w-4xl py-12 space-y-12">
          <dl className="grid sm:grid-cols-2 gap-4">
            {page.facts.map((f) => (
              <div key={f.label} className="rounded-lg border border-border bg-card p-4">
                <dt className="text-sm text-muted-foreground">{f.label}</dt>
                <dd className="font-display font-semibold text-lg text-[#282462]">{f.value}</dd>
              </div>
            ))}
          </dl>

          {firstSection && renderSection(firstSection)}

          {isRoute && (c ? <BenefitsSection title={c.benefitsTitle} lead={c.benefitsLead} items={c.benefits} /> : <BenefitsSection />)}

          {restSections.map(renderSection)}

          {isRoute && (c ? <OrderStepsSection title={c.orderStepsTitle} steps={c.orderSteps} /> : <OrderStepsSection />)}

          <section>
            <h2 className="font-display font-bold text-2xl mb-4">{ui.faqTitle}</h2>
            <div className="space-y-3">
              {page.faq.map((f) => (
                <details key={f.question} className="group border border-border rounded-lg px-5 bg-card">
                  <summary className="cursor-pointer list-none py-4 font-display font-semibold [&::-webkit-details-marker]:hidden">
                    {f.question}
                  </summary>
                  <p className="pb-4 text-muted-foreground">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {isRoute && (
            <section className="rounded-xl bg-gradient-to-br from-[#282462] to-[#3b3690] text-white p-6 sm:p-8">
              {c ? (
                <>
                  <h2 className="font-display font-bold text-2xl mb-2">{c.ui.ctaTitle(shortRoute(c.routes[page.slug]?.routeLabel ?? page.navLabel))}</h2>
                  <p className="text-white/85 mb-5">{c.ui.ctaText(page.priceLabel ?? "")}</p>
                </>
              ) : (
                <>
                  <h2 className="font-display font-bold text-2xl mb-2">Objednajte si transfer – {page.navLabel.replace(/^Transfer /, "")}</h2>
                  <p className="text-white/85 mb-5">
                    {page.priceOnRequest ? "Cenu za auto vám potvrdíme vopred." : `Pevná cena ${page.priceLabel} za auto.`} Jazdíme 24/7, vyzdvihneme vás pred domom alebo na zvolenom mieste.
                  </p>
                </>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/#objednavka" locale={homeLocale}>
                  <Button size="lg" className="w-full sm:w-auto h-12 px-6 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">
                    <Calendar className="w-5 h-5 mr-2" />{ui.orderTransfer}
                  </Button>
                </Link>
                <a href="tel:+421911606206">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-6 bg-white hover:bg-white/90 text-primary font-display font-semibold">
                    <Phone className="w-5 h-5 mr-2" /><span className="tabular-nums">+421 911 606 206</span>
                  </Button>
                </a>
              </div>
            </section>
          )}

          <section>
            <h2 className="font-display font-bold text-2xl mb-4">{ui.relatedTitle}</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/${r.slug}`} className="block rounded-lg border border-border bg-card p-4 font-semibold text-primary hover:border-primary/50">
                    {r.navLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cennik" locale={homeLocale} className="block rounded-lg border border-border bg-card p-4 font-semibold text-primary hover:border-primary/50">
                  {ui.fullPriceList}
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
