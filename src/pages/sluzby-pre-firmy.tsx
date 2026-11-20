import Head from "next/head";
import Link from "next/link";
import { Building2, MonitorSmartphone, ClipboardList, FileText, CalendarCheck, Phone, Mail, Landmark } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_URL, SITE_NAME, PHONE, PHONE_DISPLAY, EMAIL } from "@/lib/site";

const PAGE_URL = `${SITE_URL}/sluzby-pre-firmy`;

const benefits = [
  {
    icon: MonitorSmartphone,
    title: "Vlastná webová aplikácia",
    text: "Samostatná webová aplikácia pre firemných klientov, v ktorej zadávate svoje objednávky.",
  },
  {
    icon: ClipboardList,
    title: "Prehľad zrealizovaných objednávok",
    text: "V aplikácii vidíte prehľad všetkých zrealizovaných objednávok vašej firmy.",
  },
  {
    icon: FileText,
    title: "Faktúry s DPH",
    text: "Pre firemných klientov vystavujeme faktúry s DPH. Pri objednávke stačí uviesť fakturačné údaje.",
  },
  {
    icon: CalendarCheck,
    title: "Mesačné vyúčtovanie",
    text: "Pre pravidelnú spoluprácu ponúkame mesačné vyúčtovanie jázd.",
  },
  {
    icon: Landmark,
    title: "Platba bankovým prevodom",
    text: "Firmy môžu platiť bankovým prevodom na základe faktúry.",
  },
  {
    icon: Phone,
    title: "Dispečing 24/7",
    text: "Dispečing taxislužby v Košiciach je dostupný nepretržite, telefonicky aj e-mailom.",
  },
];

const steps = [
  { title: "Kontaktujte nás", text: `Zavolajte na ${PHONE_DISPLAY} alebo napíšte na ${EMAIL} a dohodneme spoluprácu pre vašu firmu.` },
  { title: "Získate prístup do aplikácie", text: "Pre vašu firmu pripravíme samostatnú webovú aplikáciu na zadávanie objednávok." },
  { title: "Zadávate objednávky", text: "Jazdy pre zamestnancov alebo klientov zadávate priamo vo webovej aplikácii." },
  { title: "Sledujete prehľad a platíte faktúru", text: "V aplikácii máte prehľad zrealizovaných objednávok. Jazdy vyúčtujeme faktúrou, na požiadanie mesačne, a uhradíte ich bankovým prevodom." },
];

const faqs = [
  {
    q: "Čo je webová aplikácia pre firmy?",
    a: "Je to samostatná webová aplikácia E-TAXI Košice pre firemných klientov. Firma v nej zadáva svoje objednávky a vidí prehľad zrealizovaných objednávok.",
  },
  {
    q: "Vystavujete firmám faktúry?",
    a: "Áno, pre firemných klientov vystavujeme faktúry s DPH. Ponúkame aj mesačné vyúčtovanie a platbu bankovým prevodom.",
  },
  {
    q: "Ako získam prístup do aplikácie pre firmy?",
    a: `Kontaktujte nás e-mailom na ${EMAIL} alebo telefonicky na ${PHONE_DISPLAY}. Dohodneme spoluprácu pre vašu firmu.`,
  },
  {
    q: "Môže firma objednať taxi aj telefonicky?",
    a: `Áno, objednávky vopred prijímame telefonicky na ${PHONE_DISPLAY} alebo cez online formulár na webe.`,
  },
  {
    q: "Pôsobíte pre firmy v Košiciach?",
    a: "Áno, E-TAXI Košice je taxislužba so sídlom v Košiciach. Jazdíme aj po celom Slovensku a do zahraničia.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Taxi pre firmy Košice",
      serviceType: "Firemná taxislužba",
      description:
        "Taxislužba pre firmy v Košiciach s vlastnou webovou aplikáciou na zadávanie objednávok a prehľadom zrealizovaných objednávok. Faktúry s DPH, mesačné vyúčtovanie, platba bankovým prevodom.",
      url: PAGE_URL,
      provider: {
        "@type": "TaxiService",
        name: SITE_NAME,
        url: SITE_URL,
        telephone: PHONE,
        email: EMAIL,
      },
      areaServed: { "@type": "City", name: "Košice" },
      audience: { "@type": "BusinessAudience", name: "Firmy" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domov", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Služby pre firmy", item: PAGE_URL },
      ],
    },
  ],
};

export default function SluzbyPreFirmyPage() {
  return (
    <>
      <SEO
        title="Taxi pre firmy Košice | Služby pre firmy | E-TAXI Košice"
        description="Taxi pre firmy v Košiciach: vlastná webová aplikácia na zadávanie objednávok a prehľad zrealizovaných objednávok. Faktúry, mesačné vyúčtovanie, platba prevodom."
        url={PAGE_URL}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mt-8 mb-6">
              <Link href="/" className="hover:underline">Domov</Link> / <span>Služby pre firmy</span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-10 h-10 text-[#282462]" />
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#282462]">
                Taxi pre firmy Košice
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              E-TAXI Košice ponúka firmám taxislužbu s vlastnou webovou aplikáciou. Objednávky zadávate
              na jednom mieste a máte prehľad zrealizovaných objednávok. Jazdy vyúčtujeme faktúrou.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <a href={`tel:${PHONE}`}>
                <Button size="lg" className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">
                  <Phone className="w-5 h-5 mr-2" />
                  {PHONE_DISPLAY}
                </Button>
              </a>
              <a href={`mailto:${EMAIL}`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-display font-semibold">
                  <Mail className="w-5 h-5 mr-2" />
                  {EMAIL}
                </Button>
              </a>
            </div>

            <section className="mb-14">
              <h2 className="font-display font-bold text-3xl mb-6">Výhody pre firemných klientov</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((b) => (
                  <Card key={b.title} className="border-2">
                    <CardContent className="p-6">
                      <b.icon className="w-10 h-10 text-primary mb-3" />
                      <h3 className="font-display font-semibold text-xl mb-2">{b.title}</h3>
                      <p className="text-muted-foreground">{b.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mb-14">
              <h2 className="font-display font-bold text-3xl mb-6">Webová aplikácia pre firmy</h2>
              <p className="text-muted-foreground mb-3">
                Firemní klienti dostanú samostatnú webovú aplikáciu. Slúži na dve veci:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>zadávanie objednávok firmy,</li>
                <li>prehľad zrealizovaných objednávok.</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Prístup k aplikácii vám sprístupníme po dohode o spolupráci.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="font-display font-bold text-3xl mb-6">Ako to funguje</h2>
              <ol className="space-y-4">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex-none w-10 h-10 rounded-full bg-[#282462] text-white flex items-center justify-center font-display font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                      <p className="text-muted-foreground">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mb-14">
              <h2 className="font-display font-bold text-3xl mb-6">Časté otázky o službách pre firmy</h2>
              <div className="space-y-4">
                {faqs.map((f) => (
                  <Card key={f.q}>
                    <CardContent className="p-6">
                      <h3 className="font-display font-semibold text-lg mb-2">{f.q}</h3>
                      <p className="text-muted-foreground">{f.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Card className="bg-[#282462] text-white">
              <CardContent className="p-8 text-center">
                <h2 className="font-display font-bold text-2xl mb-4">Chcete taxi pre vašu firmu?</h2>
                <p className="mb-6 text-white/90">
                  Zavolajte, napíšte nám, alebo objednajte jazdu cez online formulár.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={`tel:${PHONE}`}>
                    <Button size="lg" className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">
                      <Phone className="w-5 h-5 mr-2" />
                      {PHONE_DISPLAY}
                    </Button>
                  </a>
                  <a href={`mailto:${EMAIL}`}>
                    <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-white/90 text-primary font-display font-semibold">
                      <Mail className="w-5 h-5 mr-2" />
                      {EMAIL}
                    </Button>
                  </a>
                  <Link href="/#objednavka">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white bg-transparent hover:bg-white/10 font-display font-semibold">
                      Online objednávka
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
