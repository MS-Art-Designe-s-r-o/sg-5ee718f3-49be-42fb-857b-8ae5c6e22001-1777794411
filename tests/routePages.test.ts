import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { LANDING_PAGES } from "../src/content/landing";
import { ROUTE_PAGES } from "../src/content/routePages";
import { BENEFITS } from "../src/content/benefits";
import { BLOG_DUPLICATE_REDIRECTS, withoutDuplicates } from "../src/lib/blogDuplicates";
import { sk } from "../src/locales/sk";

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

test("každá landing stránka má súbor v src/pages", () => {
  for (const p of LANDING_PAGES) assert.ok(existsSync(`src/pages/${p.slug}.tsx`), p.slug);
});

test("related slugy existujú a slugy sú unikátne", () => {
  const slugs = new Set(LANDING_PAGES.map((p) => p.slug));
  assert.equal(slugs.size, LANDING_PAGES.length);
  for (const p of LANDING_PAGES) for (const r of p.related) assert.ok(slugs.has(r), `${p.slug} -> ${r}`);
});

test("ceny trás súhlasia s cenníkom", () => {
  const prices = sk.pricing.transfers.map((t) => t.price.replace(/\D/g, ""));
  for (const p of ROUTE_PAGES) {
    if (p.priceOnRequest) {
      assert.equal(p.price, undefined, p.slug);
      continue;
    }
    assert.ok(p.price && prices.includes(p.price), `${p.slug}: ${p.price}`);
  }
});

test("trasové stránky majú dosť vlastného obsahu, FAQ a kľúčové slová", () => {
  for (const p of ROUTE_PAGES) {
    const body = [p.lead, ...p.sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.bullets ?? [])]), ...p.faq.flatMap((f) => [f.question, f.answer])].join(" ");
    assert.ok(words(body) >= 450, `${p.slug}: ${words(body)} slov`);
    assert.ok(p.faq.length >= 5, p.slug);
    assert.ok(p.seoTitle.length <= 75, `${p.slug} title ${p.seoTitle.length}`);
    assert.ok(p.seoDescription.length <= 200, `${p.slug} desc ${p.seoDescription.length}`);
    for (const kw of ["preprava", "transfer", "airport", "individuáln"]) assert.ok(p.keywords.toLowerCase().includes(kw), `${p.slug}: ${kw}`);
    assert.ok(/individuáln/i.test(body), `${p.slug}: individuálna preprava v texte`);
  }
});

test("výhody obsahujú body od majiteľa", () => {
  assert.ok(BENEFITS.filter((b) => b.source === "peter").length >= 11);
});

test("duplicitné články smerujú na ponechané články", () => {
  for (const [from, to] of Object.entries(BLOG_DUPLICATE_REDIRECTS)) {
    assert.notEqual(from, to);
    assert.equal(BLOG_DUPLICATE_REDIRECTS[to], undefined, `reťaz ${from} -> ${to}`);
  }
  assert.deepEqual(withoutDuplicates([{ slug: Object.keys(BLOG_DUPLICATE_REDIRECTS)[0] }, { slug: "x" }]), [{ slug: "x" }]);
});
