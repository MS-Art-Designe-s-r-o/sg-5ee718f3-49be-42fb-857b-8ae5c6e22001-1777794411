// Súhrn výdavkov za zvolené obdobie (týždeň / mesiac / rok) — celkový súčet
// a rozloženie podľa kategórií. Pravidelné výdavky sa rozpočítajú cez
// occurrencesInRange (rovnako ako v dashboarde). Len majiteľ.
import type { NextApiRequest, NextApiResponse } from "next";
import { query, querySafe } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { periodRange, isoWeekParts, type Obdobie } from "@/lib/fees";
import { visibleOccurrenceDates, type ExpenseInterval } from "@/lib/expenses";

const ymd = (d: Date) => d.toISOString().slice(0, 10);

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const cur = isoWeekParts(new Date());
    const obdobie = (["tyzden", "mesiac", "rok"].includes(String(req.query.obdobie))
      ? req.query.obdobie
      : "mesiac") as Obdobie;
    const rok = req.query.rok ? Number(req.query.rok) : cur.isoRok;
    const tyzden = req.query.tyzden ? Number(req.query.tyzden) : cur.isoTyzden;
    const mesiac = req.query.mesiac ? Number(req.query.mesiac) : new Date().getUTCMonth() + 1;
    const range = periodRange(obdobie, { rok, tyzden, mesiac });

    const rows = await query<{ id: number; datum: string; suma: number; pravidelny: number; interval: string | null; datumDo: string | null; c_nazov: string }>(
      "SELECT e.*, c.`nazov` AS c_nazov " +
        "FROM `Expense` e JOIN `ExpenseCategory` c ON c.`id` = e.`categoryId`"
    );
    // Vynechané (zmazané) jednotlivé výskyty sa do súm nerátajú.
    // querySafe: ak tabuľka ešte neexistuje (pred migráciou), neberie to stránku.
    const skipRows = await querySafe<{ expenseId: number; datum: string }>(
      "SELECT `expenseId`, `datum` FROM `ExpenseOccurrence` WHERE `vynechany` = 1"
    );
    const skipSet = new Set(skipRows.map((s) => `${s.expenseId}|${s.datum.slice(0, 10)}`));

    const byCat = new Map<string, number>();
    let spolu = 0;
    for (const e of rows) {
      const dates = visibleOccurrenceDates(
        { datum: e.datum, pravidelny: e.pravidelny === 1, interval: e.interval as ExpenseInterval | null, datumDo: e.datumDo },
        range.from, range.to
      ).filter((d) => !skipSet.has(`${e.id}|${d}`));
      if (dates.length === 0) continue;
      const amount = Number(e.suma) * dates.length;
      spolu += amount;
      byCat.set(e.c_nazov, (byCat.get(e.c_nazov) ?? 0) + amount);
    }

    return res.status(200).json({
      obdobie: { typ: obdobie, rok, tyzden, mesiac, label: range.label, from: ymd(range.from), to: ymd(range.to) },
      spolu: Math.round(spolu * 10) / 10,
      podlaKategorii: Array.from(byCat.entries())
        .map(([kategoria, suma]) => ({ kategoria, suma: Math.round(suma * 10) / 10 }))
        .sort((a, b) => b.suma - a.suma),
    });
  })
);
