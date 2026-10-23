import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  category?: string;
  author?: string;
  date: string;
};

/** Text s odstavcami — bezpečne (React escapuje) prevedie na <p>/<br>. */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((para, i) => {
        const lines = para.split("\n");
        return (
          <p key={i} className="mb-3 last:mb-0">
            {lines.map((line, j) => (
              <span key={j}>
                {line}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

const READ_MORE: Record<string, string> = { sk: "Čítať viac", en: "Read more", de: "Mehr lesen", hu: "Tovább" };
const SHOW_LESS: Record<string, string> = { sk: "Zbaliť", en: "Show less", de: "Weniger anzeigen", hu: "Kevesebb" };

export function BlogSection() {
  const { t, locale } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(t.dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const readMore = READ_MORE[locale] || READ_MORE.sk;
  const showLess = SHOW_LESS[locale] || SHOW_LESS.sk;

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

        {/* Vlastné príspevky (najnovší prvý) */}
        {posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {posts.map((post) => {
              const isOpen = expanded === post.id;
              const hasMore = post.content.length > 160 || !!post.excerpt;
              return (
                <article
                  key={post.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
                >
                  {post.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground flex-wrap">
                      {post.category && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                          {post.category}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(post.date)}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-xl mb-3">
                      {post.title}
                    </h3>

                    <div className="text-foreground/80 leading-relaxed flex-grow">
                      {isOpen ? (
                        <Paragraphs text={post.content} />
                      ) : (
                        <p>
                          {post.excerpt ||
                            post.content.slice(0, 160) + (post.content.length > 160 ? "…" : "")}
                        </p>
                      )}
                    </div>

                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : post.id)}
                        className="mt-4 inline-flex items-center gap-1 text-primary font-medium hover:underline self-start"
                        aria-expanded={isOpen}
                      >
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isOpen ? showLess : readMore}
                      </button>
                    )}

                    {post.author && (
                      <p className="mt-4 pt-4 border-t border-border/60 text-sm text-muted-foreground">
                        {post.author}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pôvodný Soro blog — doterajšie príspevky ostávajú zobrazené */}
        <div id="soro-blog"></div>
      </div>
    </section>
  );
}
