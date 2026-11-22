import { Shield, Leaf, ShieldCheck, Eye, Phone, Lightbulb, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const iconMap = {
  Shield,
  Leaf,
  ShieldCheck,
  Eye,
  Lightbulb,
  Award
};

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="o-nas" className="py-24 bg-background">

      <div className="container">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}>

          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {t.about.title}
          </h2>
          <p className="text-xl text-primary font-semibold mb-4">
            {t.about.subtitle}
          </p>
          <p className="text-muted-foreground text-lg">
            {t.about.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {t.about.stats.map((stat, idx) =>
          <Card key={idx} className="text-center">
              <CardContent className="p-6">
                <div className="font-display font-bold text-3xl sm:text-4xl text-primary mb-2 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
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

          {t.about.values.map((value, idx) => {
            const Icon = iconMap[value.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={idx}
                className="text-center"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-xl mb-2">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>);

          })}
        </motion.div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="font-display font-bold text-2xl mb-4">
              {t.about.cta.title}
            </h3>
            <p className="mb-6 text-primary-foreground/90">
              {t.about.cta.text}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={t.common.phoneHref}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold h-14"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {t.common.callPhone}
                </Button>
              </a>
              <a href="#objednavka">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-display font-semibold h-14"
                >
                  {t.common.orderRideNow}
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>);

}
