import Link from "next/link";
import Image from "next/image";
import { getSortedPosts, formatPostDate } from "@/data/blog";

export function BlogSection() {
  const posts = getSortedPosts().slice(0, 3);

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Blog a novinky
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tipy k objednaniu taxi, letiskovým transferom a cenám v Košiciach
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-lg border bg-card overflow-hidden flex flex-col">
              <Link href={`/blog/${post.slug}`} className="block">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  width={800}
                  height={500}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs text-muted-foreground mb-2">
                  {post.category} · <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
                </p>
                <h3 className="font-display font-semibold text-xl mb-3">
                  <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-primary hover:underline">
                  Čítať viac
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/blog" className="font-semibold text-primary hover:underline">
            Všetky články
          </Link>
        </div>
      </div>
    </section>
  );
}
