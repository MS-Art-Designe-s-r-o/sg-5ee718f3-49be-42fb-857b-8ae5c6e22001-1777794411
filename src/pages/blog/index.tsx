import Link from "next/link";
import Image from "next/image";
import type { GetStaticProps } from "next";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/BlogJsonLd";
import { BlogPost, getSortedPosts, formatPostDate } from "@/data/blog";
import { SITE_URL, SITE_NAME } from "@/lib/site";

interface Props {
  posts: BlogPost[];
}

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: { posts: getSortedPosts() },
});

export default function BlogIndexPage({ posts }: Props) {
  const url = `${SITE_URL}/blog`;
  const title = `Blog | ${SITE_NAME} | Taxi, transfery a ceny`;
  const description =
    "Články o taxislužbe v Košiciach: objednanie taxi 24/7, letiskové transfery, cenník a Drink Taxi od E-TAXI Košice.";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${url}#blog`,
      url,
      name: `Blog ${SITE_NAME}`,
      description,
      inLanguage: "sk",
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: p.datePublished,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${p.slug}`,
        name: p.title,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domov", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: url },
      ],
    },
  ];

  return (
    <>
      <SEO title={title} description={description} url={url} image={`${SITE_URL}/og-image.png`} />
      <JsonLd id="blog-jsonld" data={jsonLd} />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <nav aria-label="Omrvinková navigácia" className="text-sm text-muted-foreground mt-8 mb-4">
            <Link href="/" className="hover:underline">Domov</Link> / <span>Blog</span>
          </nav>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#282462] mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Praktické články o taxi v Košiciach, letiskových transferoch a cenách.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="rounded-lg border bg-card overflow-hidden flex flex-col">
                <Link href={`/blog/${post.slug}`}>
                  <Image src={post.image} alt={post.imageAlt} width={800} height={500} className="w-full h-52 object-cover" />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground mb-2">
                    {post.category} · <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
                  </p>
                  <h2 className="font-display font-semibold text-xl mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">{post.title}</Link>
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-primary hover:underline">Čítať viac</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
