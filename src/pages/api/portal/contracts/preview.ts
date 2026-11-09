// Náhľad údajov zmluvy pred generovaním — len MAJITEL.
// POST (rovnaké telo ako generovanie) → { chybajuce, varovania, nahlad: { sekcie } }.
// Náhľad používa tie isté dáta ako dokument (buildTemplateData); RČ a číslo OP
// sú LEN maskované, žiadne *Enc polia.
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { contractInputSchema, defaultDeps, previewContract } from "@/lib/contracts/service";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ message: "Method not allowed" });
    }
    const body = parseBody(req, res, contractInputSchema);
    if (!body) return;
    return res.status(200).json(await previewContract(defaultDeps(), body));
  })
);
