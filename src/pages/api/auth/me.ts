import type { NextApiRequest, NextApiResponse } from "next";
import { getUserWithRoles, toBool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req);
  if (!session) return res.status(200).json({ user: null });

  const user = await getUserWithRoles(session.uid);
  if (!user || !toBool(user.aktivny)) return res.status(200).json({ user: null });

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      meno: user.meno,
      priezvisko: user.priezvisko,
      volaciZnak: user.volaciZnak,
      telefon: user.telefon,
      roles: user.roles,
      registracnyPoplatokUhradeny: toBool(user.registracnyPoplatokUhradeny),
    },
  });
});
