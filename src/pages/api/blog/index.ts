// Blog API:
//   GET  /api/blog        → verejný zoznam príspevkov (najnovší prvý)
//   POST /api/blog        → vytvorí príspevok (len s platným Bearer tokenom — Šefko)
//
// Príklad publikovania (Šefko):
//   curl -X POST https://e-taxike.sk/api/blog \
//     -H "Authorization: Bearer <BLOG_API_TOKEN>" \
//     -H "Content-Type: application/json" \
//     -d '{"title":"Nadpis","content":"Text príspevku...","excerpt":"Krátky úvod","category":"Novinky","author":"E-TAXI Košice","image":"https://.../obrazok.jpg"}'

import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withErrorHandler } from "@/lib/apiHelpers";
import { checkBlogToken } from "@/lib/blogAuth";
import { listPosts, addPost, type NewBlogPost } from "@/lib/blogStore";

const createSchema = z.object({
  title: z.string().min(3, "Nadpis musí mať aspoň 3 znaky").max(200),
  content: z.string().min(1, "Obsah nesmie byť prázdny").max(50000),
  excerpt: z.string().max(500).optional(),
  image: z.string().url("Obrázok musí byť platná URL").max(1000).optional(),
  category: z.string().max(100).optional(),
  author: z.string().max(120).optional(),
  date: z.string().datetime({ offset: true }).optional(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const posts = await listPosts();
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.status(200).json({ posts });
  }

  if (req.method === "POST") {
    const auth = checkBlogToken(req);
    if (!auth.ok) return res.status(auth.status ?? 403).json({ message: auth.message ?? "Neautorizované" });

    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Neplatné údaje", errors: parsed.error.flatten() });
    }

    // zod runtime zaručil title/content — asercia na presný vstupný typ.
    const post = await addPost(parsed.data as NewBlogPost);
    return res.status(201).json({ post });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ message: "Method not allowed" });
}

export default withErrorHandler(handler);
