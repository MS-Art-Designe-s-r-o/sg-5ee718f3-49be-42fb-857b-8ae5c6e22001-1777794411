// Detail blogového článku — server-side render z data/blog-posts.json (nový článok je hneď online, bez rebuildu).
import type { GetServerSideProps } from "next";
import Link from "next/link";
import Head from "next/head";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PostCard, formatDateSk, excerptOf, type PostCardData } from "@/components/blog/PostCard";
import { MarkdownBlocks, parseBlocks, tocFrom, readingMinutes } from "@/components/blog/Markdown";
import { getPost, listPosts, type BlogPost } from "@/lib/blogStore";
import { SITE_URL } from "@/locales";
import { useTranslation } from "@/hooks/useTranslation";
import { CalendarDays, Clock, ChevronRight, Phone, ListOrdered, HelpCircle, Car } from "lucide-react";

type Props = { post: BlogPost; related: PostCardData[]; minutes: number };

const abs = (u?: string) => (!u ? `${SITE_URL}/og-image.png` : /^https?:\/\//.test(u) ? u : `${SITE_URL}${u}`);

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, locale, res }) => {
  const slug = String(params?.slug || "");
  if (locale && locale !== "sk") return { redirect: { destination: `/blog/${encodeURIComponent(slug)}`, permanent: false, locale: false } as never };
  const post = await getPost(slug);
  if (!post) return { notFound: true };
  if (post.slug !== slug) return { redirect: { destination: `/blog/${post.slug}`, permanent: true } };
  const all = await listPosts();
  const others = all.filter((p) => p.id !== post.id);
  const sameCat = others.filter((p) => p.category && p.category === post.category);
  const related = [...sameCat, ...others.filter((p) => !sameCat.includes(p))].slice(0, 3).map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content.slice(0, 600), image: p.image,
    imageAlt: p.imageAlt, category: p.category, date: p.date, minutes: readingMinutes(p.content),
  }));
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return { props: JSON.parse(JSON.stringify({ post, related, minutes: readingMinutes(post.content) })) };
};

export default function BlogPostPage({ post, related, minutes }: Props) {
  const { t } = useTranslation();
  const url = `${SITE_URL}/blog/${post.slug}`;
  const blocks = parseBlocks(post.content, post.format === "markdown" ? "markdown" : "text", post.title);
  const toc = tocFrom(blocks);
  const faq = post.faq ?? [];
  const description = excerptOf(post, 155);
  const image = abs(post.image);

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description,
      image: [image],
      datePublished: post.date,
      dateModified: post.updatedAt || post.date,
      inLanguage: "sk-SK",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Organization", name: post.author || "E-TAXI Košice", url: SITE_URL },
      publisher: { "@type": "Organization", name: "E-TAXI Košice", logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domov", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (faq.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }

  const cta = (
    <div className="rounded-2xl bg-gradient-to-br from-[#282462] to-[#3b3690] text-white p-6 sm:p-8 shadow-lg">
      <div className="flex items-center gap-2 text-accent font-semibold mb-2"><Car className="w-5 h-5" /> E-TAXI Košice</div>
      <p className="font-display font-bold text-2xl mb-2">Potrebujete odvoz?</p>
      <p className="text-white/80 mb-5">Taxi v Košiciach nonstop a letiskové transfery do Budapešti, Krakova či Viedne za pevnú cenu.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <a href={t.common.phoneHref}><Phone className="w-5 h-5 mr-2" />{t.common.phone}</a>
        </Button>
        <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
          <Link href="/#objednavka">{t.common.orderNow}</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <SEO title={post.metaTitle || `${post.title} | E-TAXI Košice`} description={description} image={image} url={url} type="article" singleLocale />
      <Head>
        <meta property="article:published_time" content={post.date} />
        {post.updatedAt && <meta property="article:modified_time" content={post.updatedAt} />}
        {post.imageAlt && <meta property="og:image:alt" content={post.imageAlt} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </Head>
      <Header />

      <main className="pt-24 pb-20">
        <section className={`bg-gradient-to-br from-[#282462] to-[#3b3690] text-white pt-12 ${post.image ? "pb-28" : "pb-12"}`}>
          <div className="container mx-auto px-4 max-w-5xl">
            <nav aria-label="Navigácia" className="flex items-center gap-1 text-sm text-white/70 mb-6 flex-wrap">
              <Link href="/" className="hover:text-white">Domov</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white line-clamp-1">{post.title}</span>
            </nav>
            {post.category && <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold mb-4">{post.category}</span>}
            <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight mb-5">{post.title}</h1>
            <div className="flex items-center gap-5 text-white/80 flex-wrap">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /><time dateTime={post.date}>{formatDateSk(post.date)}</time></span>
              <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" />{minutes} min čítania</span>
              {post.author && <span>{post.author}</span>}
            </div>
          </div>
        </section>

        <div className={`container mx-auto px-4 max-w-5xl relative ${post.image ? "-mt-20" : "mt-10"}`}>
          {post.image && (
            <figure className="mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.imageAlt || post.title} className="w-full aspect-[16/9] object-cover rounded-2xl shadow-xl bg-muted" fetchPriority="high" />
            </figure>
          )}

          <div className="grid lg:grid-cols-[1fr_280px] gap-10 items-start">
            <article className="min-w-0">
              {post.excerpt && (
                <p className="text-xl leading-relaxed text-foreground/90 font-medium border-l-4 border-accent pl-5 mb-8">{post.excerpt}</p>
              )}

              {toc.length >= 2 && (
                <nav aria-label="Obsah článku" className="lg:hidden mb-8 rounded-xl border border-border bg-muted/40 p-5">
                  <p className="flex items-center gap-2 font-semibold text-[#282462] dark:text-white mb-3"><ListOrdered className="w-5 h-5" />Obsah článku</p>
                  <ol className="space-y-1.5 text-base">
                    {toc.map((h) => <li key={h.id} className={h.level === 3 ? "pl-4" : ""}><a href={`#${h.id}`} className="text-primary hover:underline">{h.text}</a></li>)}
                  </ol>
                </nav>
              )}

              <MarkdownBlocks blocks={blocks} />

              {faq.length > 0 && (
                <section aria-labelledby="faq-clanku" className="mt-12">
                  <h2 id="faq-clanku" className="scroll-mt-28 flex items-center gap-2 font-display font-bold text-2xl sm:text-3xl text-[#282462] dark:text-white mb-5">
                    <HelpCircle className="w-7 h-7 text-accent" />Často kladené otázky
                  </h2>
                  <div className="space-y-3">
                    {faq.map((f, i) => (
                      <details key={i} className="group rounded-xl border border-border bg-card p-5 open:shadow-md" open={i === 0}>
                        <summary className="cursor-pointer list-none flex justify-between gap-4 font-semibold text-lg">
                          {f.q}<ChevronRight className="w-5 h-5 shrink-0 transition-transform group-open:rotate-90 text-primary" />
                        </summary>
                        <p className="mt-3 text-foreground/80 leading-relaxed">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-12">{cta}</div>
            </article>

            <aside className="hidden lg:block sticky top-28 space-y-6 self-start">
              {toc.length >= 2 && (
                <nav aria-label="Obsah článku" className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <p className="flex items-center gap-2 font-semibold text-[#282462] dark:text-white mb-3"><ListOrdered className="w-5 h-5" />Obsah článku</p>
                  <ol className="space-y-2 text-sm">
                    {toc.map((h) => <li key={h.id} className={h.level === 3 ? "pl-3" : ""}><a href={`#${h.id}`} className="text-foreground/75 hover:text-primary">{h.text}</a></li>)}
                    {faq.length > 0 && <li><a href="#faq-clanku" className="text-foreground/75 hover:text-primary">Často kladené otázky</a></li>}
                  </ol>
                </nav>
              )}
              <div className="rounded-xl bg-card border border-accent/60 border-l-4 border-l-accent shadow-sm p-5">
                <p className="font-semibold mb-1">Taxi nonstop</p>
                <a href={t.common.phoneHref} className="flex items-center gap-2 text-xl font-bold text-[#282462] dark:text-white hover:text-primary"><Phone className="w-5 h-5" />{t.common.phone}</a>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#282462] dark:text-white mb-8">Ďalšie články</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((p) => <PostCard key={p.slug} post={p} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
