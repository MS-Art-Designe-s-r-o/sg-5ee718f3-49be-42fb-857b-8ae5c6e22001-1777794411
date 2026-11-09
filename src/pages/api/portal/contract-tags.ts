// Katalóg značiek šablón zmlúv (stránka „Zoznam značiek“) — len MAJITEL.
// Zdroj pravdy: src/lib/contracts/tagCatalog.ts.
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { catalogByGroup } from "@/lib/contracts/tagCatalog";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ message: "Method not allowed" });
    }
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ skupiny: catalogByGroup() });
  })
);
