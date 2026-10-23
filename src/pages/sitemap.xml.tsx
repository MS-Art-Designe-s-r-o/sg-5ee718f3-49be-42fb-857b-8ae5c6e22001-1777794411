// Dynamická sitemapa: statické stránky + všetky blogové články (bez rebuildu).
import type { GetServerSideProps } from "next";
import { SITEMAP_BASE_ENTRIES } from "@/content/sitemapBase";
import { listPosts, type BlogPost } from "@/lib/blogStore";
import { SITE_URL } from "@/locales";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts: BlogPost[] = await listPosts().catch(() => [] as BlogPost[]);
  const latest = posts.reduce((m, p) => ((p.updatedAt || p.date) > m ? p.updatedAt || p.date : m), "");
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
