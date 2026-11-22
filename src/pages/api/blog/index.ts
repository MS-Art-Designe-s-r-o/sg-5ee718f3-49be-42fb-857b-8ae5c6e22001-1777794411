// Blog API:
//   GET  /api/blog        → verejný zoznam príspevkov (najnovší prvý)
//   POST /api/blog        → vytvorí príspevok (len s platným Bearer tokenom — Šefko)
//     polia: title, content, format ("markdown"|"text"), excerpt, image (URL) alebo imageData (base64 JPG/PNG/WebP ≤ 5 MB),
//     imageAlt, category, author, metaTitle, faq [{q,a}], date
//
// Príklad publikovania (Šefko):
//   curl -X POST https://e-taxike.sk/api/blog \
//     -H "Authorization: Bearer <BLOG_API_TOKEN>" \
//     -H "Content-Type: application/json" \
//     -d '{"title":"Nadpis","content":"Text príspevku...","excerpt":"Krátky úvod","category":"Novinky","author":"E-TAXI Košice","image":"https://.../obrazok.jpg"}'

import type { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandler } from "@/lib/apiHelpers";
import { checkBlogToken } from "@/lib/blogAuth";
import { listPosts, addPost, slugify, type NewBlogPost } from "@/lib/blogStore";
import { createSchema } from "@/lib/blogSchema";
import { saveImageBase64, ImageError } from "@/lib/blogImages";

// Limit tela (base64 obrázok 5 MB ≈ 6,7 MB textu) — musí byť literál kvôli Next.js.
export const config = { api: { bodyParser: { sizeLimit: "8mb" } } };

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
    const { imageData, ...data } = parsed.data;
    if (imageData) {
      try {
        data.image = await saveImageBase64(imageData, slugify(data.title));
      } catch (e) {
        if (e instanceof ImageError) return res.status(400).json({ message: e.message });
        throw e;
      }
    }

    const post = await addPost(data as NewBlogPost);
    return res.status(201).json({ post, url: `/blog/${post.slug}` });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ message: "Method not allowed" });
}

export default withErrorHandler(handler);
