import type { NextApiRequest, NextApiResponse } from "next";
import { clearSessionCookie } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
});
