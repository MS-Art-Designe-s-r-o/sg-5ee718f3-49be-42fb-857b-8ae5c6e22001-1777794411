import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { pricingData } from "@/data/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Car, Info, Phone } from "lucide-react";
import Link from "next/link";
import { pricingGraph } from "@/lib/schema";

export default function CennikPage() {
  return (
    <>
      <SEO 
        title="Cenník taxislužby | E-TAXI Košice | Ceny za km a transfery na letisko"
        description="Aktuálny cenník E-TAXI Košice ✓ Mestská taxislužba od 1,50€/km ✓ Transfer Budapešť 250€ ✓ Transfer Krakov 290€ ✓ Transfer Viedeň 450€ ✓ Transparentné ceny bez skrytých poplatkov"
        path="/cennik"
        jsonLd={pricingGraph()}
      />
      
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4 mt-8">
              <Car className="w-10 h-10 text-[#282462]" />
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#282462]">
                {pricingData.title}
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground mb-12">Transparentné ceny bez skrytých poplatkov. Nie sme platci DPH. Konkrétnu cenu určuje aplikácia vopred.

            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Základný cenník */}
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-[#282462] text-white rounded-t-lg">
                  <CardTitle className="font-display flex items-center gap-2">
                    <Car className="w-5 h-5 text-accent" />
                    Základný cenník
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {pricingData.basicPricing.map((item, index) =>
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
                    Letiskové transfery
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {pricingData.transfers.map((item, index) =>
                    <li key={index} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        <span className="text-foreground">{item.destination}</span>
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
                  Dôležité informácie
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Ceny sú orientačné a môžu sa líšiť podľa aktuálnej dopravnej situácie</li>
                  <li>• Pri dlhších trasách možnosť dohodnutia paušálnej ceny vopred</li>
                  <li>• Pre firmy vystavujeme faktúry s platbou prevodom a ponúkame vlastnú webovú aplikáciu na zadávanie objednávok a prehľad zrealizovaných jázd (<Link href="/sluzby-pre-firmy" className="underline">Služby pre firmy</Link>)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mt-12 bg-[#282462] text-white">
              <CardContent className="p-8 text-center">
                <h3 className="font-display font-bold text-2xl mb-4">
                  Potrebujete taxík?
                </h3>
                <p className="mb-6 text-white/90">
                  Zavolajte nám alebo objednajte online
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="tel:+421911606206">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-[#ff9500] hover:bg-[#ff9500]/90 text-white font-display font-semibold h-14"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Zavolať +421 911 606 206
                    </Button>
                  </Link>
                  <Link href="/#objednavka">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#282462] font-display font-semibold h-14"
                    >
                      Objednať jazdu teraz
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
