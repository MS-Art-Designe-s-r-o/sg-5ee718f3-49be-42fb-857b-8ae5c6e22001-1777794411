"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile widget. Renderuje sa iba ak je nastavený site key.
// Overenie sa spúšťa AUTOMATICKY pri načítaní stránky (režim „Managed") —
// používateľ nemusí nič klikať. Token má obmedzenú platnosť (~5 min), preto
// pri vypršaní / chybe widget automaticky obnovíme, aby prihlásenie nikdy
// nezostalo zaseknuté na neplatnom overení.
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

export function Turnstile({ onToken }: { onToken: (token: string | undefined) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    const SCRIPT_ID = "cf-turnstile-script";
    const container = ref.current;
    let cancelled = false;

    function render() {
      if (cancelled || !window.turnstile || widgetId.current !== null) return;
      if (container.hasChildNodes()) return;
      widgetId.current = window.turnstile.render(container, {
        sitekey: siteKey,
        // Overenie beží samo po načítaní; nič netreba klikať.
        appearance: "interaction-only",
        "refresh-expired": "auto",
        retry: "auto",
        callback: (token: string) => onToken(token),
        // Pri vypršaní / chybe zneplatni token a nechaj widget obnoviť sa.
        "expired-callback": () => onToken(undefined),
        "timeout-callback": () => onToken(undefined),
        "error-callback": () => {
          onToken(undefined);
          return true; // ponechá widget, ktorý sa pokúsi obnoviť
        },
      });
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      render();
    }

    return () => {
      cancelled = true;
      if (widgetId.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* noop */
        }
        widgetId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={ref} className="my-3" />;
}
