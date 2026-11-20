import type { GetServerSideProps } from "next";
import { SITE_URL } from "@/lib/site";
import { blogPosts } from "@/data/blog";

const staticPaths: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/cennik", priority: "0.9", changefreq: "monthly" },
  { path: "/sluzby-pre-firmy", priority: "0.8", changefreq: "monthly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/prepravny-poriadok", priority: "0.4", changefreq: "yearly" },
  { path: "/ochrana-osobnych-udajov", priority: "0.3", changefreq: "yearly" },
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function isoDate(d?: string): string | null {
  if (!d) return null;
  const t = new Date(d);
  return isNaN(t.getTime()) ? null : t.toISOString().slice(0, 10);
}

function buildSitemap(): string {
  const today = new Date().toISOString().slice(0, 10);
  const entries = staticPaths.map(
    (p) => ({ loc: `${SITE_URL}${p.path === "/" ? "" : p.path}`, lastmod: today, ...p })
  );
  const posts = (blogPosts as unknown as Array<Record<string, any>>) || [];
  for (const post of posts) {
    const slug = post.slug || post.id;
    if (!slug) continue;
    entries.push({
      loc: `${SITE_URL}/blog/${slug}`,
      lastmod: isoDate(post.date) || today,
      path: `/blog/${slug}`,
      priority: "0.6",
      changefreq: "monthly",
    });
  }
  const body = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${esc(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(buildSitemap());
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
