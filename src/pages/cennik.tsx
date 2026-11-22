import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Car, Info, Phone } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { PRICING_TRANSFER_SLUGS, SITE_URL } from "@/locales";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { useTranslation } from "@/hooks/useTranslation";

export default function CennikPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t.seo.pricing.title}
        description={t.seo.pricing.description}
        keywords={t.seo.pricing.keywords}
      />

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(
            breadcrumbSchema([
              { name: "E-TAXI Košice", url: `${SITE_URL}/` },
              { name: t.pricing.title, url: `${SITE_URL}/cennik` },
            ]),
          )}
        />
      </Head>
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4 mt-8">
              <Car className="w-10 h-10 text-[#282462]" />
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#282462]">
                {t.pricing.title}
              </h1>
            </div>

            <p className="text-lg text-muted-foreground mb-12">{t.pricingPage.intro}</p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Základný cenník */}
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-[#282462] text-white rounded-t-lg">
                  <CardTitle className="font-display flex items-center gap-2">
                    <Car className="w-5 h-5 text-accent" />
                    {t.pricing.basicTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {t.pricing.basicPricing.map((item, index) =>
                    <li key={index} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        <span className="text-foreground">{item.label}</span>
                        <span className="font-semibold text-[#282462] tabular-nums">
                          {item.price}
                        </span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Transfery */}
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-[#282462] text-white rounded-t-lg">
                  <CardTitle className="font-display flex items-center gap-2">
                    <Plane className="w-5 h-5 text-accent" />
                    {t.pricing.transfersTitleShort}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {t.pricing.transfers.map((item, index) =>
                    <li key={index} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        {PRICING_TRANSFER_SLUGS[index] ? (
                          <Link href={`/${PRICING_TRANSFER_SLUGS[index]}`} className="text-foreground hover:text-primary hover:underline underline-offset-4">
                            {item.destination}
                          </Link>
                        ) : (
                          <span className="text-foreground">{item.destination}</span>
                        )}
                        <span className="font-semibold text-[#282462] tabular-nums">
                          {item.price}
                        </span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-yellow-400/10 border-yellow-400">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-600" />
                  {t.pricingPage.importantTitle}
                </h3>
                <ul className="space-y-2 text-sm">
                  {t.pricingPage.importantItems.map((item, index) =>
                    <li key={index}>• {item}</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="mt-12 bg-[#282462] text-white">
              <CardContent className="p-8 text-center">
                <h3 className="font-display font-bold text-2xl mb-4">
                  {t.pricingPage.ctaTitle}
                </h3>
                <p className="mb-6 text-white/90">
                  {t.pricingPage.ctaText}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={t.common.phoneHref}>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-[#ff9500] hover:bg-[#ff9500]/90 text-white font-display font-semibold h-14"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      {t.common.callPhone}
                    </Button>
                  </Link>
                  <Link href="/#objednavka">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#282462] font-display font-semibold h-14"
                    >
                      {t.common.orderRideNow}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>);

}
