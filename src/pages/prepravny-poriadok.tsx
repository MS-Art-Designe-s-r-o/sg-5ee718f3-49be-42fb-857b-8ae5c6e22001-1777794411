import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrepravnyPoriadok() {
  const sections = [
    {
      title: "1. Objednávka prepravy",
      items: [
        "Objednávku je možné vykonať telefonicky, cez online formulár alebo SMS",
        "Pri objednávke uveďte miesto nástupu, cieľ, čas a počet cestujúcich",
        "Potvrdenie objednávky obdržíte do 5 minút",
        "Rezerváciu môžete zrušiť najneskôr 30 minút pred plánovaným časom"
      ]
    },
    {
      title: "2. Nástup do vozidla",
      items: [
        "Vodič sa Vám identifikuje menom a poznávacou značkou vozidla",
        "Pri nástupe skontrolujte, či je zapnutý taxameter",
        "Cestujúci má právo požadovať preukaz vodiča a licenciu na prepravu osôb",
        "V taxíku je zakázané fajčiť a konzumovať alkohol"
      ]
    },
    {
      title: "3. Preprava batožiny",
      items: [
        "Štandardná batožina (do 23 kg) je v cene jazdy zahrnutá",
        "Nadrozmerná batožina môže podliehať príplatku podľa cenníka",
        "Vodič je povinný pomôcť pri nakladaní a vykladaní ťažkej batožiny",
        "Za škody na batožine spôsobené vodičom zodpovedá taxislužba"
      ]
    },
    {
      title: "4. Úhrada za prepravu",
      items: [
        "Platba je možná v hotovosti alebo kartou priamo vo vozidle",
        "Po ukončení jazdy obdržíte potvrdenie o úhrade",
        "Cena je stanovená podľa platného cenníka",
        "Pri platbe kartou je možné vystaviť faktúru pre firmy"
      ]
    },
    {
      title: "5. Reklamácie a sťažnosti",
      items: [
        "Sťažnosť je možné podať telefonicky alebo emailom do 7 dní",
        "Uveďte dátum, čas, číslo vozidla a dôvod reklamácie",
        "Odpoveď na sťažnosť obdržíte do 3 pracovných dní",
        "Oprávnené sťažnosti budú riešené finančnou kompenzáciou alebo zľavou"
      ]
    },
    {
      title: "6. Bezpečnosť a zodpovednosť",
      items: [
        "Všetky vozidlá sú pravidelne kontrolované a servisované",
        "Vodiči majú platné zdravotné prehliadky a certifikáty",
        "Vozidlá sú vybavené GPS a kamerovým systémom pre Vašu bezpečnosť",
        "Taxislužba má uzatvorené havarijné a úrazové poistenie"
      ]
    }
  ];

  return (
    <>
      <SEO
        title="Prepravný poriadok | Podmienky prepravy | E-TAXI Košice"
        description="Prepravný poriadok E-TAXI Košice. Práva a povinnosti cestujúcich, podmienky prepravy, pravidlá zrušenia objednávky a reklamačný poriadok taxislužby v Košiciach."
        path="/prepravny-poriadok"
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-10 h-10 text-primary" />
              <h1 className="font-display font-bold text-4xl sm:text-5xl">
                Prepravný poriadok
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground mb-12">
              Pravidlá a podmienky prepravy osôb taxislužbou E-TAXI Košice. Tieto podmienky sú záväzné pre všetkých cestujúcich a vodičov.
            </p>

            <div className="space-y-6">
              {sections.map((section, idx) => (
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
                  <strong>Platnosť od:</strong> 1. január 2026<br />
                  Tieto pravidlá môžu byť kedykoľvek aktualizované. Aktuálna verzia je vždy dostupná na tejto stránke.
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