import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, UserCheck, FileText, Mail } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO 
        title="Ochrana osobných údajov | GDPR | E-TAXI Košice"
        description="Zásady ochrany osobných údajov E-TAXI Košice v súlade s GDPR. Informácie o spracúvaní cookies, marketingových údajov a vašich právach podľa nariadenia GDPR."
        path="/ochrana-osobnych-udajov"
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
              Ochrana osobných údajov
            </h1>
            <p className="text-lg text-muted-foreground">
              Vaše súkromie je pre nás prioritou
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Platné od: 30. apríla 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <div className="bg-card border border-border rounded-lg p-6 sm:p-8 space-y-8">
              
              {/* Prevádzkovateľ */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <UserCheck className="h-6 w-6 text-primary" />
                  1. Prevádzkovateľ osobných údajov
                </h2>
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Prevádzkovateľ:</h3>
                  <p><strong>Názov:</strong> E-TAXI Košice</p>
                  <p><strong>Adresa:</strong> Košice, Slovensko</p>
                  <p><strong>E-mail:</strong> dispecing@e-taxike.sk</p>
                  <p><strong>Telefón:</strong> +421 911 606 206</p>
                </div>
              </section>

              {/* Právny základ */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  2. Právny základ spracovania
                </h2>
                <p className="text-muted-foreground mb-4">
                  Vaše osobné údaje spracovávame v súlade s:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR)</li>
                  <li>Zákonom č. 18/2018 Z. z. o ochrane osobných údajov a o zmene a doplnení niektorých zákonov</li>
                  <li>Zákonom č. 22/2004 Z. z. o elektronickom obchode</li>
                </ul>
              </section>

              {/* Aké údaje spracovávame */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary" />
                  3. Aké osobné údaje spracovávame
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">3.1 Pri objednávke taxislužby:</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Meno a priezvisko</li>
                      <li>Telefónne číslo</li>
                      <li>Adresa vyzdvihnutia a cieľová adresa</li>
                      <li>Dátum a čas objednávky</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">3.2 Cookies a sledovacie technológie:</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>IP adresa</li>
                      <li>Typ prehliadača a zariadenia</li>
                      <li>Čas návštevy a prezerané stránky</li>
                      <li>Údaje z Google Ads (pre marketingové účely)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Účel spracovania */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  4. Účel spracovania osobných údajov
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground">4.1 Poskytovanie služieb:</h3>
                    <p>Spracovávame údaje potrebné na zabezpečenie taxislužby (plnenie zmluvy)</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground">4.2 Marketingové účely:</h3>
                    <p>S vaším súhlasom používame Google Ads na:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Cielenie relevantných reklám</li>
                      <li>Meranie efektivity reklamných kampaní</li>
                      <li>Remarketingové kampane (zobrazenie reklám na základe vašej predchádzajúcej návštevy)</li>
                      <li>Analýzu správania používateľov</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground">4.3 Zlepšovanie služieb:</h3>
                    <p>Analýza využívania webovej stránky na zlepšenie používateľského zážitku</p>
                  </div>
                </div>
              </section>

              {/* Google Ads */}
              <section className="bg-muted/50 rounded-lg p-6 border border-border">
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground">
                  5. Informácie o Google Ads
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Používame službu <strong>Google Ads</strong> od spoločnosti Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).
                  </p>
                  <p>
                    Google Ads používa cookies na sledovanie vašej aktivity na webe a zobrazovanie personalizovaných reklám. Google môže tieto údaje spojiť s ďalšími údajmi, ktoré o vás má z iných služieb Google.
                  </p>
                  <p>
                    <strong>Vaše práva:</strong> Môžete sa kedykoľvek odhlásiť z personalizovaných reklám Google na stránke:{" "}
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
                    Viac informácií o spracovaní údajov spoločnosťou Google nájdete na:{" "}
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
                  6. Doba uchovávania údajov
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Objednávky:</strong> 5 rokov (účtovné a daňové účely)</li>
                  <li><strong>Marketingové cookies:</strong> maximálne 2 roky alebo do odvolania súhlasu</li>
                  <li><strong>Technické cookies:</strong> do zatvorenia prehliadača alebo podľa nastavení</li>
                </ul>
              </section>

              {/* Vaše práva */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground">
                  7. Vaše práva
                </h2>
                <p className="text-muted-foreground mb-4">
                  V súlade s GDPR máte právo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Právo na prístup:</strong> Zistiť, aké údaje o vás spracovávame</li>
                  <li><strong>Právo na opravu:</strong> Opraviť nesprávne údaje</li>
                  <li><strong>Právo na vymazanie:</strong> Požiadať o vymazanie údajov</li>
                  <li><strong>Právo na obmedzenie:</strong> Obmedziť spracovanie vašich údajov</li>
                  <li><strong>Právo na prenosnosť:</strong> Získať údaje v strojovo čitateľnom formáte</li>
                  <li><strong>Právo namietať:</strong> Namietať proti spracovaniu pre marketingové účely</li>
                  <li><strong>Právo odvolať súhlas:</strong> Kedykoľvek odvolať súhlas so spracovaním</li>
                </ul>
              </section>

              {/* Kontakt */}
              <section className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  8. Kontakt pre uplatnenie práv
                </h2>
                <p className="mb-4">
                  Svoje práva môžete uplatniť kontaktovaním prevádzkovateľa na adrese:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">E-TAXI Košice</p>
                  <p>Email: <a href="mailto:dispecing@e-taxike.sk" className="text-primary hover:underline">dispecing@e-taxike.sk</a></p>
                  <p>Tel: <a href="tel:+421911606206" className="text-primary hover:underline">+421 911 606 206</a></p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Máte tiež právo podať sťažnosť na <strong>Úrad na ochranu osobných údajov SR</strong> (www.dataprotection.gov.sk)
                </p>
              </section>

              {/* Zmeny */}
              <section>
                <h2 className="font-display font-bold text-2xl mb-4 text-foreground">
                  9. Zmeny týchto zásad
                </h2>
                <p className="text-muted-foreground">
                  Tieto zásady môžeme čas od času aktualizovať. Zmeny budú zverejnené na tejto stránke s uvedením dátumu poslednej aktualizácie.
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
              ← Späť na hlavnú stránku
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}