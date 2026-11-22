// Dynamická sitemapa: statické stránky + všetky blogové články (bez rebuildu).
import type { GetServerSideProps } from "next";
import { SITEMAP_BASE_ENTRIES } from "@/content/sitemapBase";
import { listPosts, type BlogPost } from "@/lib/blogStore";
import { SITE_URL } from "@/locales";
import { withoutDuplicates } from "@/lib/blogDuplicates";
import { LANDING_PAGES } from "@/content/landing";
import { HUB_SLUG, routeAlternates, routeUrl } from "@/content/i18n/build";
import { ROUTE_LOCALES } from "@/content/i18n/types";

const LANDING_LASTMOD = "2026-11-22";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts: BlogPost[] = withoutDuplicates(await listPosts().catch(() => [] as BlogPost[]));
  const latest = posts.reduce((m, p) => ((p.updatedAt || p.date) > m ? p.updatedAt || p.date : m), "");
  // Rozcestník a trasové stránky: každý jazyk (sk, en, de, hu, pl) má vlastný <url> s hreflang alternatívami.
  const localized = (slug: string, priority: string) => {
    const alt = routeAlternates(slug)
      .map((a) => `\n    <xhtml:link rel="alternate" hreflang="${a.hrefLang}" href="${a.href}"/>`)
      .join("");
    return ["sk", ...ROUTE_LOCALES]
      .map(
        (l) =>
          `  <url>\n    <loc>${routeUrl(slug, l)}</loc>\n    <lastmod>${LANDING_LASTMOD}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${l === "sk" ? priority : "0.7"}</priority>${alt}\n  </url>`,
      )
      .join("\n");
  };
  const landing = LANDING_PAGES.map((p) =>
    p.airportCode
      ? localized(p.slug, "0.8")
      : `  <url>\n    <loc>${SITE_URL}/${p.slug}</loc>\n    <lastmod>${LANDING_LASTMOD}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p.slug === "sluzby-pre-firmy" ? "0.8" : "0.7"}</priority>\n  </url>`,
  ).join("\n");
  const hub = localized(HUB_SLUG, "0.9");
  const blog = [
    `  <url>\n    <loc>${SITE_URL}/blog</loc>${latest ? `\n    <lastmod>${latest.slice(0, 10)}</lastmod>` : ""}\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    ...posts.map((p) => {
      const img = p.image ? `\n    <image:image><image:loc>${esc(/^https?:/.test(p.image) ? p.image : SITE_URL + p.image)}</image:loc></image:image>` : "";
      return `  <url>\n    <loc>${SITE_URL}/blog/${encodeURIComponent(p.slug)}</loc>\n    <lastmod>${(p.updatedAt || p.date).slice(0, 10)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>${img}\n  </url>`;
    }),
  ].join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${SITEMAP_BASE_ENTRIES}
${hub}
${landing}
${blog}
</urlset>
`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
