import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info & Logo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                <img src="/etaxi_logo_svg.svg" alt={t.common.logoAlt} className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-bold text-xl">E-TAXI Košice</span>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-4">
              {t.footer.blurb}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com/etaxikosice"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/etaxikosice"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/421911606206"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t.footer.servicesTitle}</h4>
            <ul className="space-y-2">
              {t.footer.services.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-4 text-white">
                {t.footer.infoTitle}
              </h3>
              <ul className="space-y-2">
                {t.footer.info.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-white hover:text-accent transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t.footer.contactTitle}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">{t.common.dispatch}</p>
                  <a href={t.common.phoneHref} className="text-white hover:text-accent transition-colors">
                    {t.common.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">{t.footer.emailLabel}</p>
                  <a href={`mailto:${t.common.email}`} className="text-white hover:text-accent transition-colors">
                    {t.common.email}
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2 text-primary-foreground/80 text-sm">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{t.footer.location}</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2 text-primary-foreground/80 text-sm">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{t.footer.hours}</span>
                </div>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-primary-foreground/20">
              <p className="text-xs font-medium text-primary-foreground/70 mb-2">{t.footer.downloadApp}</p>
              <div className="flex gap-2">
                <a
                  href="https://tinyurl.com/e-taxiapple"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg px-3 py-2 flex items-center justify-center gap-2 transition-colors text-xs font-medium"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  iOS
                </a>
                <a
                  href="https://tinyurl.com/etaxiandroid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg px-3 py-2 flex items-center justify-center gap-2 transition-colors text-xs font-medium"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  Android
                </a>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-primary-foreground/20">
              <a href={t.common.phoneHref}>
                <Button
                  size="sm"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t.common.callNow}
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="text-primary-foreground/70 text-sm text-center">
              © {currentYear} E-TAXI Košice. {t.footer.rights}
            </p>
            <Link href="/prihlasenie" className="text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors text-xs">
              Portál pre vodičov a dispečerov
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
