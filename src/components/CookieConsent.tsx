"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, Shield } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setTimeout(() => {
        setShowBanner(true);
      }, 5000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const handleRejectOptional = () => {
    localStorage.setItem("cookieConsent", "essential-only");
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-300">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-card border-2 border-primary/20 rounded-lg shadow-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="h-8 w-8 text-primary" />
            </div>

            <div className="flex-1">
              <h3 className="font-display font-bold text-xl mb-3 text-foreground flex items-center gap-2">
                {t.cookies.title}
              </h3>

              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <p>
                  {t.cookies.intro}
                </p>

                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t.cookies.typesTitle}
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>
                      <strong>{t.cookies.essentialLabel}</strong> {t.cookies.essentialText}
                    </li>
                    <li>
                      <strong>{t.cookies.marketingLabel}</strong> {t.cookies.marketingText}
                    </li>
                  </ul>
                </div>

                <p>
                  {t.cookies.consentBefore}
                  <Link href="/ochrana-osobnych-udajov" className="text-primary hover:underline font-semibold">
                    {t.cookies.consentLink}
                  </Link>
                  {t.cookies.consentAfter}
                </p>

                <p className="text-xs">
                  {t.cookies.gdprNote}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={handleAccept}
                  className="bg-primary hover:bg-primary/90 text-white flex-1"
                >
                  {t.cookies.acceptAll}
                </Button>
                <Button
                  onClick={handleRejectOptional}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 flex-1"
                >
                  {t.cookies.essentialOnly}
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10 flex-1"
                >
                  {t.cookies.rejectAll}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                {t.cookies.changeNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
