import Link from "next/link";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  date: string;
  minutes?: number;
};

export function formatDateSk(iso: string, locale = "sk-SK"): string {
  try {
    return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Bratislava" });
  } catch {
    return "";
  }
}

export function excerptOf(p: { excerpt?: string; content: string }, n = 160): string {
  if (p.excerpt) return p.excerpt;
  const t = p.content.replace(/^#+\s+.*$/gm, "").replace(/[*_>#|]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t;
}

export function PostCard({ post, readMore = "Čítať článok" }: { post: PostCardData; readMore?: string }) {
  return (
    <article className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
      <Link href={`/blog/${post.slug}`} locale="sk" className="block aspect-[16/9] overflow-hidden bg-[#282462]">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.imageAlt || post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#282462] to-[#3b3690]">
            <span className="font-display font-bold text-2xl text-accent">E-TAXI Blog</span>
          </div>
        )}
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground flex-wrap">
          {post.category && <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">{post.category}</span>}
          <span className="inline-flex items-center gap-1"><CalendarDays className="w-4 h-4" />{formatDateSk(post.date)}</span>
          {post.minutes ? <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" />{post.minutes} min</span> : null}
        </div>
        <h3 className="font-display font-semibold text-xl mb-3 leading-snug">
          <Link href={`/blog/${post.slug}`} locale="sk" className="hover:text-primary transition-colors">{post.title}</Link>
        </h3>
        <p className="text-foreground/75 leading-relaxed flex-grow">{excerptOf(post)}</p>
        <Link href={`/blog/${post.slug}`} locale="sk" className="mt-5 inline-flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all self-start">
          {readMore} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
