// Úprava / mazanie blogového príspevku (len s Bearer tokenom):
//   PATCH  /api/blog/<id-alebo-slug>  → čiastočná úprava (napr. doplnenie obrázka: imageData alebo image + imageAlt)
//   DELETE /api/blog/<id-alebo-slug>  → zmaže príspevok
//
// Príklad:
//   curl -X PATCH https://e-taxike.sk/api/blog/<slug> -H "Authorization: Bearer <BLOG_API_TOKEN>" \
//     -H "Content-Type: application/json" -d '{"image":"https://.../foto.jpg","imageAlt":"Popis"}'

import type { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandler } from "@/lib/apiHelpers";
import { checkBlogToken } from "@/lib/blogAuth";
import { deletePost, getPost, updatePost, slugify, type BlogPostPatch } from "@/lib/blogStore";
import { patchSchema } from "@/lib/blogSchema";
import { saveImageBase64, ImageError } from "@/lib/blogImages";

// Limit tela (base64 obrázok 5 MB ≈ 6,7 MB textu) — musí byť literál kvôli Next.js.
export const config = { api: { bodyParser: { sizeLimit: "8mb" } } };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const key = Array.isArray(id) ? id[0] : id;
  if (!key) return res.status(400).json({ message: "Chýba id príspevku" });

  if (req.method === "GET") {
    const post = await getPost(key);
    if (!post) return res.status(404).json({ message: "Príspevok sa nenašiel" });
    return res.status(200).json({ post });
  }

  if (req.method === "PATCH" || req.method === "DELETE") {
    const auth = checkBlogToken(req);
    if (!auth.ok) return res.status(auth.status ?? 403).json({ message: auth.message ?? "Neautorizované" });
  }

  if (req.method === "PATCH") {
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Neplatné údaje", errors: parsed.error.flatten() });
    const { imageData, ...patch } = parsed.data;
    const cur = await getPost(key);
    if (!cur) return res.status(404).json({ message: "Príspevok sa nenašiel" });
    if (imageData) {
      try {
        patch.image = await saveImageBase64(imageData, slugify(patch.title || cur.title));
      } catch (e) {
        if (e instanceof ImageError) return res.status(400).json({ message: e.message });
        throw e;
      }
    }
    const post = await updatePost(key, patch as BlogPostPatch);
    if (!post) return res.status(404).json({ message: "Príspevok sa nenašiel" });
    return res.status(200).json({ post, url: `/blog/${post.slug}` });
  }

  if (req.method === "DELETE") {
    const removed = await deletePost(key);
    if (!removed) return res.status(404).json({ message: "Príspevok sa nenašiel" });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, PATCH, DELETE");
  return res.status(405).json({ message: "Method not allowed" });
}

export default withErrorHandler(handler);
