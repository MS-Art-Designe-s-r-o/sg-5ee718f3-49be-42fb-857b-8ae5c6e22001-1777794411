import { useEffect, useState } from "react";
import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { useTranslation } from "@/hooks/useTranslation";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  author?: string;
  date: string;
};

const READ_MORE: Record<string, string> = { sk: "Čítať článok", en: "Read more", de: "Mehr lesen", hu: "Tovább" };
const ALL_POSTS: Record<string, string> = { sk: "Všetky články", en: "All articles (in Slovak)", de: "Alle Artikel (auf Slowakisch)", hu: "Összes cikk (szlovákul)" };

export function BlogSection() {
  const { t, locale } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Načítanie vlastných príspevkov (publikuje ich Šefko cez /api/blog)
  useEffect(() => {
    let active = true;
    fetch("/api/blog")
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((data) => {
        if (active && Array.isArray(data?.posts)) setPosts(data.posts);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Ponechanie pôvodného Soro blogu (doterajšie príspevky)
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="trysoro.com"]');
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.src = "https://app.trysoro.com/api/embed/72e345cc-26ab-4fa7-90c3-2a16001d07d4";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      const soroScript = document.querySelector('script[src*="trysoro.com"]');
      if (soroScript) soroScript.remove();
    };
  }, []);

  const readMore = READ_MORE[locale] || READ_MORE.sk;

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {t.blogSection.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.blogSection.subtitle}
          </p>
        </div>

        {/* Vlastné príspevky (najnovší prvý) — každý má vlastnú stránku /blog/<slug> */}
        {posts.length > 0 && (
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 6).map((post) => (
                <PostCard key={post.id} post={post} readMore={readMore} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/blog" locale="sk" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                {ALL_POSTS[locale] || ALL_POSTS.sk} →
              </Link>
            </div>
          </div>
        )}

        {/* Pôvodný Soro blog — doterajšie príspevky ostávajú zobrazené */}
        <div id="soro-blog"></div>
      </div>
    </section>
  );
}
