// Obrázky blogu: ukladajú sa mimo gitu vedľa blog-posts.json (data/blog-images),
// prípadne do BLOG_IMAGE_DIR. Verejne cez /blog/obrazky/<súbor> (rewrite na API).
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { dataFile } from "@/lib/blogStore";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_PUBLIC_PREFIX = "/blog/obrazky/";
const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;
export type ImageExt = keyof typeof TYPES;

export function imageDir(): string {
  return process.env.BLOG_IMAGE_DIR || path.join(path.dirname(dataFile()), "blog-images");
}

/** Typ podľa magických bajtov (nie podľa deklarovaného MIME). */
export function sniffImage(buf: Buffer): ImageExt | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.length > 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

export class ImageError extends Error {}

/** Uloží base64 (aj data: URL) obrázok; vráti verejnú cestu. */
export async function saveImageBase64(data: string, baseName = "obrazok"): Promise<string> {
  const b64 = data.replace(/^data:[^;,]+;base64,/, "").replace(/\s+/g, "");
  const buf = Buffer.from(b64, "base64");
  if (!buf.length) throw new ImageError("Obrázok je prázdny");
  if (buf.length > MAX_IMAGE_BYTES) throw new ImageError("Obrázok je väčší ako 5 MB");
  const ext = sniffImage(buf);
  if (!ext) throw new ImageError("Podporované sú iba obrázky JPG, PNG a WebP");
  const safe = baseName.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "obrazok";
  const file = `${safe}-${randomUUID().slice(0, 8)}.${ext}`;
  await fs.mkdir(imageDir(), { recursive: true });
  await fs.writeFile(path.join(imageDir(), file), buf);
  return IMAGE_PUBLIC_PREFIX + file;
}

/** Bezpečné načítanie súboru (iba názov bez ciest, povolené prípony). */
export async function readImage(file: string): Promise<{ buf: Buffer; type: string } | null> {
  const m = /^([a-z0-9-]+)\.(jpg|png|webp)$/.exec(file);
  if (!m) return null;
  try {
    const buf = await fs.readFile(path.join(imageDir(), file));
    return { buf, type: TYPES[m[2] as ImageExt] };
  } catch {
    return null;
  }
}
