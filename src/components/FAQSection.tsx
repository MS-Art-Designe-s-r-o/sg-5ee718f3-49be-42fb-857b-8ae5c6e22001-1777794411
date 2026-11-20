import { motion } from "framer-motion";
import Head from "next/head";
import { ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { faqPageSchema } from "@/lib/schema";

export function FAQSection() {
  const { t } = useTranslation();

  return (
    <>
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(t.faq.items)) }}
      />
    </Head>
    <motion.section
      id="faq"
      className="py-16 sm:py-20 bg-muted/30"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {t.faq.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Natívne <details>: odpovede sú vždy v zdrojovom HTML (SSR), nie len po kliknutí cez JS. */}
          <div className="space-y-4">
            {t.faq.items.map((item) => (
              <details
                key={item.id}
                className="group border border-border rounded-lg px-6 bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display font-semibold [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display font-semibold">{item.question}</h3>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="text-muted-foreground pb-5 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {t.faq.noAnswer}
            </p>
            <a href={t.common.phoneHref}>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t.faq.callUs}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.section>
    </>
  );
}
