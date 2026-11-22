// Spoločná validácia vstupu blog API (POST aj PATCH).
import { z } from "zod";

const imageUrl = z
  .string()
  .max(1000)
  .refine((v) => /^https?:\/\//i.test(v) || v.startsWith("/blog/obrazky/"), "Obrázok musí byť https:// URL alebo /blog/obrazky/…");

export const postFields = {
  title: z.string().min(3, "Nadpis musí mať aspoň 3 znaky").max(200),
  content: z.string().min(1, "Obsah nesmie byť prázdny").max(100000),
  format: z.enum(["markdown", "text"]).optional(),
  excerpt: z.string().max(500).optional(),
  image: imageUrl.optional(),
  /** Nahratý obrázok: base64 alebo data: URL (JPG/PNG/WebP, max 5 MB). Má prednosť pred `image`. */
  imageData: z.string().max(7_200_000).optional(),
  imageAlt: z.string().max(300).optional(),
  category: z.string().max(100).optional(),
  author: z.string().max(120).optional(),
  metaTitle: z.string().max(200).optional(),
  faq: z.array(z.object({ q: z.string().min(1).max(500), a: z.string().min(1).max(3000) })).max(20).optional(),
  date: z.string().datetime({ offset: true }).optional(),
};

export const createSchema = z.object(postFields);
export const patchSchema = z.object(postFields).partial();

