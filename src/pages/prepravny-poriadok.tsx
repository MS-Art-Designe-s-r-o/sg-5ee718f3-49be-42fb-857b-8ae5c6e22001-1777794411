import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

export default function PrepravnyPoriadok() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t.seo.terms.title}
        description={t.seo.terms.description}
        keywords={t.seo.terms.keywords}
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-10 h-10 text-primary" />
              <h1 className="font-display font-bold text-4xl sm:text-5xl">
                {t.termsPage.title}
              </h1>
            </div>

            <p className="text-lg text-muted-foreground mb-12">
              {t.termsPage.intro}
            </p>

            <div className="space-y-6">
              {t.termsPage.sections.map((section, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="font-display text-xl">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 bg-muted/50">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>{t.termsPage.validFromLabel}</strong> {t.termsPage.validFromValue}<br />
                  {t.termsPage.validNote}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
