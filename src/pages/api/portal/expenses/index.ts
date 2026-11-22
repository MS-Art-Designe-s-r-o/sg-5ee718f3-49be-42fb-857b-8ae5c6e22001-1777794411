import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, querySafe, execute, toBool, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { periodRange, isoWeekParts, type Obdobie } from "@/lib/fees";
import { visibleOccurrenceDates, type ExpenseInterval } from "@/lib/expenses";

const interval = z.enum(["TYZDENNE", "MESACNE", "STVRTROCNE", "POLROCNE", "ROCNE"]);

const createSchema = z.object({
  datum: z.string().min(8), // YYYY-MM-DD
  popis: z.string().min(1),
  categoryId: z.coerce.number().int(),
  suma: z.coerce.number().min(0),
  uhradene: z.boolean().default(false),
  pravidelny: z.boolean().default(false),
  interval: interval.nullable().optional(),
});

type ExpenseRow = {
  id: number; datum: string; popis: string; suma: number; uhradene: number;
  uhradeneDna: string | null; pravidelny: number; interval: string | null; datumDo: string | null;
  categoryId: number; c_nazov: string; vehicleId: number | null; v_nazov: string | null; zdroj: string;
};

const SELECT_JOIN =
  "SELECT e.*, c.`nazov` AS c_nazov, v.`nazov` AS v_nazov " +
  "FROM `Expense` e JOIN `ExpenseCategory` c ON c.`id` = e.`categoryId` " +
  "LEFT JOIN `Vehicle` v ON v.`id` = e.`vehicleId` ";

export function mapExpense(e: ExpenseRow) {
  return {
    id: e.id, datum: e.datum, popis: e.popis, suma: Number(e.suma),
    uhradene: toBool(e.uhradene), uhradeneDna: e.uhradeneDna,
    pravidelny: toBool(e.pravidelny), interval: e.interval,
    categoryId: e.categoryId, kategoria: e.c_nazov,
    vehicleId: e.vehicleId, vozidlo: e.v_nazov, zdroj: e.zdroj,
  };
}

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method === "GET") {
      // Obdobie: týždeň / mesiac / rok. Zoznam obsahuje výskyty výdavkov
      // (aj rozvinuté pravidelné) padnúce do zvoleného obdobia, so stránkovaním.
      const cur = isoWeekParts(new Date());
      const obdobie = (["tyzden", "mesiac", "rok"].includes(String(req.query.obdobie))
        ? req.query.obdobie
        : "rok") as Obdobie;
      const rok = req.query.rok ? Number(req.query.rok) : cur.isoRok;
      const tyzden = req.query.tyzden ? Number(req.query.tyzden) : cur.isoTyzden;
      const mesiac = req.query.mesiac ? Number(req.query.mesiac) : new Date().getUTCMonth() + 1;
      const range = periodRange(obdobie, { rok, tyzden, mesiac });

      const where: string[] = [];
      const params: SqlParam[] = [];
      if (req.query.categoryId) { where.push("e.`categoryId` = ?"); params.push(Number(req.query.categoryId)); }
      const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
      const rows = await query<ExpenseRow>(SELECT_JOIN + whereSql, params);

      // Stav jednotlivých výskytov (úhrada per výskyt / vynechané výskyty).
      // querySafe: ak tabuľka ešte neexistuje (pred migráciou), neberie to stránku.
      const occ = await querySafe<{ expenseId: number; datum: string; uhradene: number; vynechany: number }>(
        "SELECT `expenseId`, `datum`, `uhradene`, `vynechany` FROM `ExpenseOccurrence`"
      );
      const paidMap = new Map<string, boolean>();
      const skipSet = new Set<string>();
      for (const o of occ) {
        const key = `${o.expenseId}|${o.datum.slice(0, 10)}`;
        if (o.vynechany === 1) skipSet.add(key);
        paidMap.set(key, o.uhradene === 1);
      }

      // Rozviň každý výdavok na jeho výskyty v období (dátum výskytu = zobrazený dátum),
      // vrátane obmedzenia na aktuálny mesiac a koniec predpisu.
      const items = rows.flatMap((e) => {
        const dates = visibleOccurrenceDates(
          { datum: e.datum, pravidelny: e.pravidelny === 1, interval: e.interval as ExpenseInterval | null, datumDo: e.datumDo },
          range.from, range.to
        );
        const base = mapExpense(e);
        return dates
          .filter((d) => !skipSet.has(`${e.id}|${d}`))
          .map((d) => ({
            ...base,
            zaciatok: base.datum, // pôvodný začiatok predpisu (pre editáciu)
            datum: d,             // dátum konkrétneho výskytu (zobrazený)
            uhradene: base.pravidelny ? (paidMap.get(`${e.id}|${d}`) ?? false) : base.uhradene,
          }));
      });
      items.sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : b.id - a.id));

      const total = items.length;
      const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 25, 1), 200);
      const pocetStran = Math.max(1, Math.ceil(total / pageSize));
      const page = Math.min(Math.max(Number(req.query.page) || 1, 1), pocetStran);
      const expenses = items.slice((page - 1) * pageSize, page * pageSize);

      return res.status(200).json({
        expenses,
        total,
        page,
        pageSize,
        pocetStran,
        obdobie: { typ: obdobie, rok, tyzden, mesiac, label: range.label },
      });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;
      const datum = body.datum.slice(0, 10);
      // Pri pravidelnom výdavku sa úhrada eviduje per výskyt (nie na predpise),
      // aby sa ďalšie mesiace neoznačovali automaticky ako uhradené.
      const r = await execute(
        "INSERT INTO `Expense` (`datum`,`popis`,`suma`,`uhradene`,`uhradeneDna`,`pravidelny`,`interval`,`categoryId`,`zdroj`,`createdById`,`createdAt`,`updatedAt`) " +
          "VALUES (?,?,?,?,?,?,?,?,'MANUAL',?,NOW(3),NOW(3))",
        [
          datum, body.popis.trim(), body.suma,
          !body.pravidelny && body.uhradene ? 1 : 0,
          !body.pravidelny && body.uhradene ? new Date() : null,
          body.pravidelny ? 1 : 0, body.pravidelny ? body.interval ?? "MESACNE" : null,
          body.categoryId, ctx.userId,
        ]
      );
      // Ak je pravidelný a prvý mesiac je uhradený, ulož to ako výskyt.
      if (body.pravidelny && body.uhradene) {
        await execute(
          "INSERT INTO `ExpenseOccurrence` (`expenseId`,`datum`,`uhradene`,`uhradeneDna`) VALUES (?,?,1,NOW(3))",
          [r.insertId, datum]
        );
      }
      const rows = await query<ExpenseRow>(SELECT_JOIN + "WHERE e.`id` = ?", [r.insertId]);
      return res.status(201).json({ expense: rows.length ? mapExpense(rows[0]) : null });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
