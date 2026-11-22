// Úložisko blogových príspevkov v JSON súbore na disku.
//
// Prečo súbor a nie databáza: príspevky pridáva AI agent (Šefko) cez API,
// objem je malý a nechceme kvôli blogu ďalšiu Prisma migráciu. Súbor žije mimo
// gitu aj mimo buildu (štandardne ~/etaxi-web/data/blog-posts.json), takže
// prežije `git pull` aj `npm run build` a nasadenie je len build + restart.
//
// Cesta sa dá prebiť premennou BLOG_DATA_FILE (napr. na trvalé úložisko).

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type BlogFaq = { q: string; a: string };

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  /** Obsah: markdown (format "markdown") alebo čistý text s odstavcami (staré príspevky). */
  content: string;
  format?: "markdown" | "text";
  /** URL obrázka — externá https:// alebo lokálna /blog/obrazky/<súbor>. */
  image?: string;
  imageAlt?: string;
  category?: string;
  author?: string;
  metaTitle?: string;
  faq?: BlogFaq[];
  /** Dátum publikovania (ISO). Podľa neho sa radí — najnovší prvý. */
  date: string;
  /** Čas vytvorenia na serveri (ISO). */
  createdAt: string;
  updatedAt?: string;
};

export type NewBlogPost = {
  title: string;
  content: string;
  excerpt?: string;
  format?: "markdown" | "text";
  image?: string;
  imageAlt?: string;
  category?: string;
  author?: string;
  metaTitle?: string;
  faq?: BlogFaq[];
  date?: string;
};

export type BlogPostPatch = Partial<Omit<NewBlogPost, "date">> & { date?: string };

export function dataFile(): string {
  return process.env.BLOG_DATA_FILE || path.join(process.cwd(), "data", "blog-posts.json");
}

// Serializácia zápisov v rámci procesu — zabráni prepísaniu pri súbežných POST.
let writeChain: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<BlogPost[]> {
  try {
    const raw = await fs.readFile(dataFile(), "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.posts)) return parsed.posts as BlogPost[];
    return [];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(posts: BlogPost[]): Promise<void> {
  const file = dataFile();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify({ posts }, null, 2), "utf8");
  await fs.rename(tmp, file); // atomický zápis
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // odstráni diakritiku
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "prispevok";
}

const clean = (v?: string) => (typeof v === "string" ? v.trim() || undefined : undefined);
const cleanFaq = (f?: BlogFaq[]) => {
  const out = (f || []).map((x) => ({ q: x.q.trim(), a: x.a.trim() })).filter((x) => x.q && x.a);
  return out.length ? out : undefined;
};

/** Všetky príspevky, najnovší prvý. */
export async function listPosts(): Promise<BlogPost[]> {
  const posts = await readAll();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(idOrSlug: string): Promise<BlogPost | null> {
  const posts = await readAll();
  return posts.find((p) => p.slug === idOrSlug || p.id === idOrSlug) || null;
}

export async function addPost(input: NewBlogPost): Promise<BlogPost> {
  const run = writeChain.then(async () => {
    const posts = await readAll();
    const id = randomUUID();
    let slug = slugify(input.title);
    if (posts.some((p) => p.slug === slug)) slug = `${slug}-${id.slice(0, 6)}`;

    const now = new Date().toISOString();
    const post: BlogPost = {
      id,
      slug,
      title: input.title.trim(),
      content: input.content.trim(),
      format: input.format || "text",
      excerpt: clean(input.excerpt),
      image: clean(input.image),
      imageAlt: clean(input.imageAlt),
      category: clean(input.category),
      author: clean(input.author),
      metaTitle: clean(input.metaTitle),
      faq: cleanFaq(input.faq),
      date: input.date ? new Date(input.date).toISOString() : now,
      createdAt: now,
    };
    await writeAll([post, ...posts]);
    return post;
  });
  writeChain = run.catch(() => {});
  return run;
}

/** Čiastočná úprava príspevku (slug ostáva — stabilná URL). Vráti null, ak neexistuje. */
export async function updatePost(idOrSlug: string, patch: BlogPostPatch): Promise<BlogPost | null> {
  const run = writeChain.then(async () => {
    const posts = await readAll();
    const i = posts.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (i < 0) return null;
    const cur = posts[i];
    const next: BlogPost = { ...cur, updatedAt: new Date().toISOString() };
    if (patch.title !== undefined) next.title = patch.title.trim();
    if (patch.content !== undefined) next.content = patch.content.trim();
    if (patch.format !== undefined) next.format = patch.format;
    for (const k of ["excerpt", "image", "imageAlt", "category", "author", "metaTitle"] as const) {
      if (patch[k] !== undefined) next[k] = clean(patch[k]);
    }
    if (patch.faq !== undefined) next.faq = cleanFaq(patch.faq);
    if (patch.date !== undefined) next.date = new Date(patch.date).toISOString();
    posts[i] = next;
    await writeAll(posts);
    return next;
  });
  writeChain = run.catch(() => {});
  return run;
}

/** Zmaže príspevok podľa id alebo slug. Vráti true, ak bol zmazaný. */
export async function deletePost(idOrSlug: string): Promise<boolean> {
  const run = writeChain.then(async () => {
    const posts = await readAll();
    const next = posts.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
    if (next.length === posts.length) return false;
    await writeAll(next);
    return true;
  });
  writeChain = run.catch(() => {});
  return run;
}
