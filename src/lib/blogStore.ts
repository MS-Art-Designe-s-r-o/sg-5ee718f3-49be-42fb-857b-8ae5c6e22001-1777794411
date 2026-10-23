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

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  category?: string;
  author?: string;
  /** Dátum publikovania (ISO). Podľa neho sa radí — najnovší prvý. */
  date: string;
  /** Čas vytvorenia na serveri (ISO). */
  createdAt: string;
};

export type NewBlogPost = {
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category?: string;
  author?: string;
  date?: string;
};

function dataFile(): string {
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

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // odstráni diakritiku
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "prispevok";
}

/** Všetky príspevky, najnovší prvý. */
export async function listPosts(): Promise<BlogPost[]> {
  const posts = await readAll();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Pridá nový príspevok a vráti ho. Serializované voči súbežným zápisom. */
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
      excerpt: input.excerpt?.trim() || undefined,
      image: input.image?.trim() || undefined,
      category: input.category?.trim() || undefined,
      author: input.author?.trim() || undefined,
      date: input.date ? new Date(input.date).toISOString() : now,
      createdAt: now,
    };
    await writeAll([post, ...posts]);
    return post;
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
