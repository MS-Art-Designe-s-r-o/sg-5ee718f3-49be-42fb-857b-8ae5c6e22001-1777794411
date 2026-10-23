// GET /api/blog/image/<súbor> (verejne aj ako /blog/obrazky/<súbor>) — obrázky blogu z disku.
import type { NextApiRequest, NextApiResponse } from "next";
import { readImage } from "@/lib/blogImages";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  const f = Array.isArray(req.query.file) ? req.query.file[0] : req.query.file;
  const img = f ? await readImage(f) : null;
  if (!img) return res.status(404).json({ message: "Obrázok sa nenašiel" });
  res.setHeader("Content-Type", img.type);
  res.setHeader("Content-Length", String(img.buf.length));
  // Názov súboru obsahuje náhodný sufix → obsah sa nemení, môže sa cachovať natrvalo.
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).send(img.buf);
}
