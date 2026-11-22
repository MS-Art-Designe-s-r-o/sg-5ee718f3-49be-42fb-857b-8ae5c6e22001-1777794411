import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, UserCheck, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const p = t.privacyPage;

  return (
    <>
      <SEO
        title={t.seo.privacy.title}
        description={t.seo.privacy.description}
        keywords={t.seo.privacy.keywords}
      />
      <Header />

      <main className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-16 sm:py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4 text-foreground">
              {p.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {p.subtitle}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {p.validFrom}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <div className="bg-card border border-border rounded-lg p-6 sm:p-8 space-y-8">

              {/* Prevádzkovateľ */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <UserCheck className="h-6 w-6 text-primary" />
                  {p.s1.title}
                </h2>
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">{p.s1.boxTitle}</h3>
                  <p><strong>{p.s1.nameLabel}</strong> {p.s1.nameValue}</p>
                  <p><strong>{p.s1.addressLabel}</strong> {p.s1.addressValue}</p>
                  <p><strong>{p.s1.emailLabel}</strong> {t.common.email}</p>
                  <p><strong>{p.s1.phoneLabel}</strong> {t.common.phone}</p>
                </div>
              </section>

              {/* Právny základ */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  {p.s2.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {p.s2.intro}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  {p.s2.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>

              {/* Aké údaje spracovávame */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary" />
                  {p.s3.title}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{p.s3.sub1Title}</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      {p.s3.sub1Items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{p.s3.sub2Title}</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      {p.s3.sub2Items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Účel spracovania */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  {p.s4.title}
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.s4.sub1Title}</h3>
                    <p>{p.s4.sub1Text}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">{p.s4.sub2Title}</h3>
                    <p>{p.s4.sub2Text}</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      {p.s4.sub2Items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">{p.s4.sub3Title}</h3>
                    <p>{p.s4.sub3Text}</p>
                  </div>
                </div>
              </section>

              {/* Google Ads */}
              <section className="bg-muted/50 rounded-lg p-6 border border-border">
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground">
                  {p.s5.title}
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    {p.s5.p1Before}<strong>{p.s5.p1Strong}</strong>{p.s5.p1After}
                  </p>
                  <p>
                    {p.s5.p2}
                  </p>
                  <p>
                    <strong>{p.s5.rightsLabel}</strong>{p.s5.rightsText}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      adssettings.google.com
                    </a>
                  </p>
                  <p>
                    {p.s5.moreInfoText}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      policies.google.com/privacy
                    </a>
                  </p>
                </div>
              </section>

              {/* Doba uchovávania */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground">
                  {p.s6.title}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  {p.s6.items.map((item, idx) => (
                    <li key={idx}><strong>{item.label}</strong>{item.text}</li>
                  ))}
                </ul>
              </section>

              {/* Vaše práva */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground">
                  {p.s7.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {p.s7.intro}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  {p.s7.items.map((item, idx) => (
                    <li key={idx}><strong>{item.label}</strong>{item.text}</li>
                  ))}
                </ul>
              </section>

              {/* Kontakt */}
              <section className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  {p.s8.title}
                </h2>
                <p className="mb-4">
                  {p.s8.intro}
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">E-TAXI Košice</p>
                  <p>Email: <a href={`mailto:${t.common.email}`} className="text-primary hover:underline">{t.common.email}</a></p>
                  <p>Tel: <a href={t.common.phoneHref} className="text-primary hover:underline">{t.common.phone}</a></p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {p.s8.complaintBefore}<strong>{p.s8.complaintStrong}</strong>{p.s8.complaintAfter}
                </p>
              </section>

              {/* Zmeny */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground">
                  {p.s9.title}
                </h2>
                <p className="text-muted-foreground">
                  {p.s9.text}
                </p>
              </section>

            </div>
          </div>

          {/* Back button */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:underline font-semibold"
            >
              {p.back}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
