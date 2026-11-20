import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import type { GetStaticPaths, GetStaticProps } from "next";
import { Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/BlogJsonLd";
import { BlogPost, blogPosts, getPostBySlug, getSortedPosts, formatPostDate } from "@/data/blog";
import { SITE_URL, SITE_NAME, PHONE, PHONE_DISPLAY } from "@/lib/site";

interface Props {
  post: BlogPost;
  related: BlogPost[];
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: blogPosts.map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const post = getPostBySlug(String(params?.slug));
  if (!post) return { notFound: true };
  const related = getSortedPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
  return { props: { post, related } };
};

export default function BlogPostPage({ post, related }: Props) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = `${SITE_URL}${post.image}`;

  const jsonLd: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: post.title,
      description: post.metaDescription,
      image: [imageUrl],
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      inLanguage: "sk",
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domov", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faq?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return (
    <>
      <SEO title={`${post.title} | ${SITE_NAME}`} description={post.metaDescription} url={url} image={imageUrl} />
      <Head>
        <meta property="article:published_time" content={post.datePublished} />
        <meta property="article:modified_time" content={post.dateModified} />
      </Head>
      <JsonLd id="article-jsonld" data={jsonLd} />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <nav aria-label="Omrvinková navigácia" className="text-sm text-muted-foreground mt-8 mb-4">
            <Link href="/" className="hover:underline">Domov</Link> /{" "}
            <Link href="/blog" className="hover:underline">Blog</Link> / <span>{post.category}</span>
          </nav>

          <article>
            <header className="mb-8">
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#282462] mb-4">{post.title}</h1>
              <p className="text-sm text-muted-foreground mb-4">
                {SITE_NAME} · <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
              </p>
              <Image src={post.image} alt={post.imageAlt} width={1200} height={750} priority className="w-full h-auto rounded-lg" />
              <p className="text-lg mt-6">{post.intro}</p>
            </header>

            {post.sections.map((s) => (
              <section key={s.heading} className="mb-8">
                <h2 className="font-display font-semibold text-2xl mb-3">{s.heading}</h2>
                {s.paragraphs?.map((p, i) => (
                  <p key={i} className="mb-3 leading-relaxed">{p}</p>
                ))}
                {s.list && (
                  <ul className="list-disc pl-6 mb-3 space-y-1">
                    {s.list.map((li, i) => (
                      <li key={i}>{li}</li>
                    ))}
                  </ul>
                )}
                {s.after?.map((p, i) => (
                  <p key={i} className="mb-3 leading-relaxed">{p}</p>
                ))}
              </section>
            ))}

            {post.faq && (
              <section className="mb-8">
                <h2 className="font-display font-semibold text-2xl mb-3">Často kladené otázky</h2>
                <dl className="space-y-4">
                  {post.faq.map((f) => (
                    <div key={f.question}>
                      <dt className="font-semibold">{f.question}</dt>
                      <dd className="text-muted-foreground">{f.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section className="rounded-lg bg-[#282462] text-white p-6 mb-8">
              <h2 className="font-display font-bold text-2xl mb-3">Potrebujete taxi?</h2>
              <p className="mb-4 text-white/90">
                Dispečing 24/7. Pozrite si <Link href="/cennik" className="underline">cenník</Link> alebo{" "}
                <Link href="/#objednavka" className="underline">objednajte jazdu online</Link>.
              </p>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-md bg-[#ff9500] px-5 py-3 font-semibold text-white hover:bg-[#ff9500]/90"
              >
                <Phone className="w-5 h-5" />
                Zavolať {PHONE_DISPLAY}
              </a>
            </section>
          </article>

          <aside aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display font-semibold text-2xl mb-3">Ďalšie články</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="text-primary hover:underline">{r.title}</Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
