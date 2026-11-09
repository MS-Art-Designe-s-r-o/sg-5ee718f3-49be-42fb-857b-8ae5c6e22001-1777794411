// Údaje prevádzkovateľa E-TAXI (CompanyProfile, jediný riadok id = 1) — len MAJITEL.
// PUT: vynechané pole = nemeniť, prázdny reťazec / null = vymazať (NULL).
// Chybové odpovede obsahujú len názvy polí, nikdy hodnoty.
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { execute, queryOne, type CompanyProfileRow, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { normalizeKinds, optText, type FieldKind } from "@/lib/subjectFields";

const updateSchema = z.object({
  obchodneMeno: z.string().max(191).optional(),
  sidlo: optText(255),
  ico: optText(30),
  dic: optText(30),
  icDph: optText(30),
  zapisanyV: optText(255),
  statutar: optText(191),
  statutarFunkcia: optText(191),
  iban: optText(50),
  email: optText(191),
  telefon: optText(50),
  web: optText(191),
});

const KINDS: Record<string, FieldKind> = {
  ico: "ico",
  dic: "dic",
  icDph: "icDph",
  iban: "iban",
  email: "email",
};
const PLAIN = ["sidlo", "zapisanyV", "statutar", "statutarFunkcia", "telefon", "web"] as const;

const loadCompany = () =>
  queryOne<CompanyProfileRow>("SELECT * FROM `CompanyProfile` WHERE `id` = 1");

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");

    if (req.method === "GET") {
      return res.status(200).json({ company: await loadCompany() });
    }

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;

      const { set, invalid } = normalizeKinds(body, KINDS);
      for (const k of PLAIN) if (body[k] !== undefined) set[k] = body[k] as string | null;
      if (body.obchodneMeno !== undefined) {
        const meno = body.obchodneMeno.trim();
        if (!meno) invalid.push("obchodneMeno");
        else set.obchodneMeno = meno;
      }

      const cur = await loadCompany();
      if (!cur && set.obchodneMeno === undefined) invalid.push("obchodneMeno");
      if (invalid.length) return res.status(400).json({ message: "Neplatné údaje", polia: invalid });

      if (!cur) {
        await execute("INSERT INTO `CompanyProfile` (`id`, `obchodneMeno`) VALUES (1, ?)", [
          set.obchodneMeno as string,
        ]);
      }
      const cols = Object.keys(set);
      if (cols.length) {
        await execute(
          `UPDATE \`CompanyProfile\` SET ${cols.map((c) => `\`${c}\` = ?`).join(", ")} WHERE \`id\` = 1`,
          cols.map((c): SqlParam => set[c])
        );
      }
      return res.status(200).json({ company: await loadCompany() });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
