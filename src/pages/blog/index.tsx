import type { GetServerSideProps } from "next";
import Link from "next/link";
import Head from "next/head";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PostCard, type PostCardData } from "@/components/blog/PostCard";
import { listPosts } from "@/lib/blogStore";
import { readingMinutes } from "@/components/blog/Markdown";
import { SITE_URL } from "@/locales";
import { ChevronRight } from "lucide-react";

type Props = { posts: PostCardData[] };

export const getServerSideProps: GetServerSideProps<Props> = async ({ locale, res }) => {
  if (locale && locale !== "sk") return { redirect: { destination: "/blog", permanent: false, locale: false } as never };
  const posts = (await listPosts()).map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt ?? null, content: p.content.slice(0, 600), image: p.image ?? null,
    imageAlt: p.imageAlt ?? null, category: p.category ?? null, date: p.date, minutes: readingMinutes(p.content),
  }));
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return { props: { posts: JSON.parse(JSON.stringify(posts)) } };
};

export default function BlogIndex({ posts }: Props) {
  const url = `${SITE_URL}/blog`;
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Domov", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: url },
    ],
  };
  return (
    <>
      <SEO title="Blog – tipy na cestovanie a taxi v Košiciach | E-TAXI Košice" description="Praktické články o taxi v Košiciach, letiskových transferoch do Budapešti, Krakova a Viedne, cenách a cestovaní. Blog E-TAXI Košice." url={url} singleLocale />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      </Head>
      <Header />
      <main className="pt-24 pb-20">
        <section className="bg-gradient-to-br from-[#282462] to-[#3b3690] text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <nav aria-label="Navigácia" className="flex items-center gap-1 text-sm text-white/70 mb-6">
              <Link href="/" className="hover:text-white">Domov</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Blog</span>
            </nav>
            <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">Blog a novinky</h1>
            <p className="text-lg text-white/80 max-w-2xl">Praktické rady o taxi v Košiciach, letiskových transferoch a cestovaní — od dispečingu E-TAXI.</p>
          </div>
        </section>
        <section className="container mx-auto px-4 max-w-6xl py-14">
          {posts.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Zatiaľ tu nie sú žiadne články.</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
