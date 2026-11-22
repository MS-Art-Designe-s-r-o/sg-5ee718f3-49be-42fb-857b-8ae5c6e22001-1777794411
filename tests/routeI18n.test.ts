import { test } from "node:test";
import assert from "node:assert/strict";
import { ROUTE_PAGES } from "../src/content/routePages";
import { BENEFITS, ORDER_STEPS } from "../src/content/benefits";
import { ROUTE_CONTENT, ROUTE_LOCALES } from "../src/content/i18n";
import { getLocalizedLanding, routeAlternates } from "../src/content/i18n/build";
import { ROUTE_LOCALE_SLUGS } from "../src/locales";

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

test("každý jazyk má všetky trasy, 17 výhod a 4 kroky", () => {
  for (const l of ROUTE_LOCALES) {
    const c = ROUTE_CONTENT[l];
    assert.equal(c.benefits.length, BENEFITS.length, l);
    assert.equal(c.orderSteps.length, ORDER_STEPS.length, l);
    assert.deepEqual(Object.keys(c.routes).sort(), ROUTE_PAGES.map((p) => p.slug).sort(), l);
  }
});

test("preložené stránky majú cenu zo SK stránky a dosť obsahu", () => {
  for (const l of ROUTE_LOCALES) {
    for (const sk of ROUTE_PAGES) {
      const p = getLocalizedLanding(sk.slug, l);
      assert.equal(p.price, sk.price, `${l}/${sk.slug}`);
      assert.ok(p.priceLabel?.includes(sk.price!), `${l}/${sk.slug}: ${p.priceLabel}`);
      // Cena uvedená v SEO title musí sedieť.
      assert.ok(p.seoTitle.includes(`${sk.price} €`) || p.seoTitle.includes(`€${sk.price}`), `${l}/${sk.slug} title: ${p.seoTitle}`);
      assert.ok(p.seoTitle.length <= 80, `${l}/${sk.slug} title ${p.seoTitle.length}`);
      assert.ok(p.seoDescription.length <= 230, `${l}/${sk.slug} desc ${p.seoDescription.length}`);
      const body = [p.lead, ...p.sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.bullets ?? [])]), ...p.faq.flatMap((f) => [f.question, f.answer])].join(" ");
      assert.ok(words(body) >= 300, `${l}/${sk.slug}: ${words(body)} slov`);
      assert.ok(p.faq.length >= 6, `${l}/${sk.slug}`);
      assert.equal(new Set(p.faq.map((f) => f.question)).size, p.faq.length, `${l}/${sk.slug} duplicitné FAQ`);
      for (const r of p.related) assert.ok(ROUTE_PAGES.some((x) => x.slug === r), r);
    }
  }
});

test("schválené formulácie: vodič počká, žiadne bezplatné čakanie", () => {
  const all = JSON.stringify(ROUTE_CONTENT, (_k, v) => (typeof v === "function" ? String(v) : v));
  assert.ok(!/free waiting|kostenlose Wartezeit|ingyenes várakozás|bezpłatne oczekiwanie/i.test(all));
  assert.ok(/Rzesz[oó]w/.test(all));
});

test("hreflang alternatívy pokrývajú sk/en/de/hu/pl + x-default", () => {
  for (const slug of ROUTE_LOCALE_SLUGS) {
    const a = routeAlternates(slug).map((x) => x.hrefLang);
    assert.deepEqual(a, ["sk", "en", "de", "hu", "pl", "x-default"]);
  }
});

test("riadky cenníka transferov odkazujú na trasu s rovnakou cenou (všetky jazyky)", async () => {
  const { dictionaries, PRICING_TRANSFER_SLUGS } = await import("../src/locales");
  for (const [l, d] of Object.entries(dictionaries)) {
    assert.equal(d.pricing.transfers.length, PRICING_TRANSFER_SLUGS.length, l);
    d.pricing.transfers.forEach((t, i) => {
      const page = ROUTE_PAGES.find((p) => p.slug === PRICING_TRANSFER_SLUGS[i]);
      assert.ok(page && t.price.replace(/\D/g, "") === page.price, `${l}: ${t.destination} ${t.price} vs ${page?.slug}`);
    });
  }
});

test("blogový článok odkazuje na správnu trasu", async () => {
  const { blogRouteLink } = await import("../src/lib/blogRouteLink");
  const t = (slug: string, title = "") => blogRouteLink({ slug, title })?.slug;
  assert.equal(t("taxi-z-kosic-na-letisko-budapest"), "transfer-kosice-budapest");
  assert.equal(t("x", "Preprava Košice – Viedeň letisko"), "transfer-kosice-viedna");
  assert.equal(t("transfer-kosice-krakow-letisko"), "transfer-kosice-krakow");
  assert.equal(t("cesta-na-letisko-kosice"), "taxi-letisko-kosice");
  assert.equal(t("ako-sa-pripravit-na-let", "Letiskový transfer: tipy"), "letiskove-transfery");
  assert.equal(t("taxi-kosice-noc", "Nočné taxi v Košiciach"), undefined);
});
