import dynamic from "next/dynamic";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Phone, Calendar, Clock, Zap, Wine, Plane, CreditCard, Smartphone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Head from "next/head";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { taxiServiceSchema, jsonLdScript } from "@/lib/schema";

// Lazy load below-the-fold sections
const BookingForm = dynamic(() => import("@/components/BookingForm").then((mod) => ({ default: mod.BookingForm })), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted/30" />
});

const FleetSection = dynamic(() => import("@/components/FleetSection").then((mod) => ({ default: mod.FleetSection })), {
  loading: () => <div className="min-h-[600px] animate-pulse bg-muted/30" />
});

const PricingSection = dynamic(() => import("@/components/PricingSection").then((mod) => ({ default: mod.PricingSection })), {
  loading: () => <div className="min-h-[500px] animate-pulse bg-muted/30" />
});

const AboutSection = dynamic(() => import("@/components/AboutSection").then((mod) => ({ default: mod.AboutSection })), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted/30" />
});

const PartnersSection = dynamic(() => import("@/components/PartnersSection").then((mod) => ({ default: mod.PartnersSection })), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted/30" />
});

const BlogSection = dynamic(() => import("@/components/BlogSection").then((mod) => ({ default: mod.BlogSection })), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted/30" />
});

const ReviewsSection = dynamic(() => import("@/components/ReviewsSection").then((mod) => ({ default: mod.ReviewsSection })), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted/30" />
});

const FAQSection = dynamic(() => import("@/components/FAQSection").then((mod) => ({ default: mod.FAQSection })), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted/30" />
});

const Footer = dynamic(() => import("@/components/Footer").then((mod) => ({ default: mod.Footer })), {
  loading: () => <div className="min-h-[300px] animate-pulse bg-primary/10" />
});

const serviceIcons = [Zap, Clock, Wine, Plane, CreditCard, Building2];
const serviceIconColors = ["text-accent", "text-primary", "text-accent", "text-primary", "text-accent", "text-primary"];

export default function Home() {
  const { t } = useTranslation();

  const jsonLd = {
    ...taxiServiceSchema(t.jsonLd.description, t.jsonLd.offers, t.jsonLd.offerCatalogName),
    // Pôvodné hodnotenie ponechané bez zmeny.
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "127" },
  };

  return (
    <>
      <SEO
        title={t.seo.home.title}
        description={t.seo.home.description}
        keywords={t.seo.home.keywords} />

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
      </Head>
      <Header />
      <main className="pt-16">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-bg3.png"
              alt={t.hero.imageAlt}
              fill
              priority
              quality={75}
              className="object-cover"
              sizes="100vw" />

            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-primary/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
                  {t.hero.titlePrefix}<br />
                  <span className="text-yellow-400">{t.hero.word1}</span>, {t.hero.word2},<br />
                  <span className="text-yellow-400">{t.hero.word3}</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-8">
                  {t.hero.subtitleBeforePhone}<strong className="font-bold">{t.common.phone}</strong>{t.hero.subtitleAfterPhone}<br />
                  {t.hero.subtitleLine2}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#objednavka">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold shadow-lg">

                      <Calendar className="w-5 h-5 mr-2" />
                      {t.common.orderNow}
                    </Button>
                  </a>
                  <a href={t.common.phoneHref}>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-white/90 text-primary font-display font-semibold shadow-lg">

                      <Phone className="w-5 h-5 mr-2" />
                      <span className="tabular-nums">{t.common.phone}</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="aplikacia" className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">
                    {t.appSection.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{t.appSection.text}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <a
                      href="https://tinyurl.com/e-taxiapple"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3 font-medium transition-colors">

                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      <div className="text-left">
                        <div className="text-xs opacity-90">{t.appSection.downloadOn}</div>
                        <div className="font-semibold">App Store</div>
                      </div>
                    </a>
                    <a
                      href="https://tinyurl.com/etaxiandroid"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3 font-medium transition-colors">

                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                      </svg>
                      <div className="text-left">
                        <div className="text-xs opacity-90">{t.appSection.availableOn}</div>
                        <div className="font-semibold">Google Play</div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="relative w-48 h-48 bg-primary/10 rounded-3xl flex items-center justify-center">
                    <Smartphone className="w-24 h-24 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sluzby" className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-center mb-12">
              {t.services.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {t.services.items.map((service, idx) => {
                const Icon = serviceIcons[idx] ?? Zap;
                return (
                  <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <Icon className={`w-12 h-12 ${serviceIconColors[idx] ?? "text-primary"} mb-4`} />
                      <h3 className="font-display font-semibold text-xl mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                      {idx === t.services.items.length - 1 && (
                        <Link href="/sluzby-pre-firmy" className="inline-block mt-3 font-semibold text-primary hover:underline">
                          {t.services.businessLink}
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <a href="#objednavka">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">

                  <Calendar className="w-5 h-5 mr-2" />
                  {t.common.orderRideNow}
                </Button>
              </a>
              <a href={t.common.phoneHref}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-white/90 text-primary border-2 border-primary font-display font-semibold">

                  <Phone className="w-5 h-5 mr-2" />
                  {t.common.callPhone}
                </Button>
              </a>
            </div>
          </div>
        </section>

        <FleetSection />

        <PricingSection />

        <AboutSection />

        <PartnersSection />

        <BlogSection />

        <ReviewsSection />

        <FAQSection />

        <section id="objednavka" className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-center mb-4">
                {t.bookingSection.title}
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                {t.bookingSection.textBeforePhone}
                <a href={t.common.phoneHref} className="text-accent font-semibold hover:underline">
                  {t.common.phone}
                </a>
              </p>
              <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                ⚠️ {t.bookingSection.noticeAdvance}
              </div>
              <BookingForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>);

}
