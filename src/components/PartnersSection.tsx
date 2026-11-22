import Image from "next/image";
import { MapPin, ExternalLink, Handshake, Phone, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export function PartnersSection() {
  const { t } = useTranslation();

  return (
    <section id="partneri" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}>

          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Handshake className="w-7 h-7 text-primary" />
            </div>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {t.partners.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.partners.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}>

          {t.partners.partners.map((partner, idx) => (
            <motion.div
              key={idx}
              className="h-full"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}>

              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${partner.name} – ${t.partners.openInNewTab}`}
                className="group block h-full">

                <Card className="h-full overflow-hidden flex flex-col hover:shadow-lg hover:border-primary/50 transition-all">
                  {/* Logo */}
                  <div className="relative h-28 sm:h-32 bg-white border-b">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} – E-TAXI Košice`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-4" />
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display font-semibold text-lg leading-snug mb-1">
                      {partner.name}
                    </h3>
                    <p className="text-sm font-medium text-primary mb-3">
                      {partner.type}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{partner.address}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="break-all">{partner.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="break-all">{partner.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-accent mt-auto group-hover:underline">
                      <ExternalLink className="w-4 h-4 shrink-0" />
                      <span>{t.partners.visitSite}</span>
                    </div>
                  </div>
                </Card>
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}>

          <p className="text-muted-foreground mb-4">
            {t.partners.ctaText}{" "}
            <a href={t.common.phoneHref} className="text-accent font-semibold hover:underline">
              {t.common.phone}
            </a>
          </p>
          <a href={t.common.phoneHref}>
            <Button
              size="lg"
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold">

              <Phone className="w-4 h-4 mr-2" />
              {t.partners.ctaButton}
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
