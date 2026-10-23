// Mazanie / zmena blogového príspevku:
//   DELETE /api/blog/<id-alebo-slug>   → zmaže príspevok (len s Bearer tokenom)
//
// Príklad:
//   curl -X DELETE https://e-taxike.sk/api/blog/<id> -H "Authorization: Bearer <BLOG_API_TOKEN>"

import type { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandler } from "@/lib/apiHelpers";
import { checkBlogToken } from "@/lib/blogAuth";
import { deletePost } from "@/lib/blogStore";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const key = Array.isArray(id) ? id[0] : id;
  if (!key) return res.status(400).json({ message: "Chýba id príspevku" });

  if (req.method === "DELETE") {
    const auth = checkBlogToken(req);
    if (!auth.ok) return res.status(auth.status ?? 403).json({ message: auth.message ?? "Neautorizované" });

    const removed = await deletePost(key);
    if (!removed) return res.status(404).json({ message: "Príspevok sa nenašiel" });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "DELETE");
  return res.status(405).json({ message: "Method not allowed" });
}

export default withErrorHandler(handler);
