import Head from "next/head";
import Link from "next/link";
import { ChevronRight, Phone, Calendar } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/locales";
import { LANDING_PAGES, type LandingPageData } from "@/content/landing";
import { breadcrumbSchema, faqPageSchema, jsonLdScript, serviceSchema } from "@/lib/schema";

export function LandingPage({ page }: { page: LandingPageData }) {
  const url = `${SITE_URL}/${page.slug}`;
  const schemas = [
    serviceSchema({
      name: page.h1,
      description: page.seoDescription,
      url,
      serviceType: page.serviceType,
      price: page.price,
    }),
    faqPageSchema(page.faq),
    breadcrumbSchema([
      { name: "Domov", url: `${SITE_URL}/` },
      { name: page.navLabel, url },
    ]),
  ];
  const related = page.related.map((s) => LANDING_PAGES.find((p) => p.slug === s)).filter(Boolean) as LandingPageData[];

  return (
    <>
      <SEO title={page.seoTitle} description={page.seoDescription} keywords={page.keywords} url={url} singleLocale />
      <Head>
        {schemas.map((s, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(s)} />
        ))}
      </Head>
      <Header />
      <main className="pt-24 pb-20">
        <section className="bg-gradient-to-br from-[#282462] to-[#3b3690] text-white py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav aria-label="Navigácia" className="flex items-center gap-1 text-sm text-white/70 mb-6">
              <Link href="/" className="hover:text-white">Domov</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{page.navLabel}</span>
            </nav>
            <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">{page.h1}</h1>
            <p className="text-lg text-white/85">{page.lead}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/#objednavka">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />Objednať jazdu
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

          {page.sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display font-bold text-2xl mb-4">{s.title}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-3">{p}</p>
              ))}
            </section>
          ))}

          <section>
            <h2 className="font-display font-bold text-2xl mb-4">Časté otázky</h2>
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

          <section>
            <h2 className="font-display font-bold text-2xl mb-4">Súvisiace služby</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/${r.slug}`} className="block rounded-lg border border-border bg-card p-4 font-semibold text-primary hover:border-primary/50">
                    {r.navLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cennik" className="block rounded-lg border border-border bg-card p-4 font-semibold text-primary hover:border-primary/50">
                  Kompletný cenník
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
