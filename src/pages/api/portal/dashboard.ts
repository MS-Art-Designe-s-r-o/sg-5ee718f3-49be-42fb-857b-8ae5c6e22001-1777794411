import type { NextApiRequest, NextApiResponse } from "next";
import { query, queryOne, querySafe, toBool } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { periodRange, weeksInRange, isoWeekParts, type Obdobie } from "@/lib/fees";
import { visibleOccurrenceDates, type ExpenseInterval } from "@/lib/expenses";
import { getRegistrationFee } from "@/lib/settings";

const ymd = (d: Date) => d.toISOString().slice(0, 10);

// Dashboard s viditeľnosťou podľa role:
//  - osobné údaje (tržby/poplatky/prenájom/registrácia/vyťaženosť) vidí každý len svoje,
//  - vyťaženosť áut a vodičov vidí majiteľ + dispečer,
//  - finančné súhrny, výdavky, zisk/strata, poplatky po vodičoch a registrácie všetkých
//    vidí len majiteľ.
export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER", "VODIC"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const now = new Date();
    const cur = isoWeekParts(now);
    const curKey = cur.isoRok * 100 + cur.isoTyzden;

    const obdobie = (["tyzden", "mesiac", "rok"].includes(String(req.query.obdobie))
      ? req.query.obdobie
      : "tyzden") as Obdobie;
    const rok = req.query.rok ? Number(req.query.rok) : cur.isoRok;
    const tyzden = req.query.tyzden ? Number(req.query.tyzden) : cur.isoTyzden;
    const mesiac = req.query.mesiac ? Number(req.query.mesiac) : now.getUTCMonth() + 1;
    const range = periodRange(obdobie, { rok, tyzden, mesiac });
    const from = range.from, to = range.to, pocetDni = range.dni;

    const roles = ctx.session.roles;
    const isOwner = roles.includes("MAJITEL");
    const isDispatcher = roles.includes("DISPECER");
    const isDriver = roles.includes("VODIC");
    const uid = ctx.userId;

    const weeks = weeksInRange(from, to);
    const weekKeys = weeks.map((w) => w.isoRok * 100 + w.isoTyzden);
    const inWeeks = weekKeys.length ? weekKeys.map(() => "?").join(",") : "NULL";

    const registrationFee = await getRegistrationFee();

    const response: Record<string, unknown> = {
      obdobie: { typ: obdobie, rok, tyzden, mesiac, label: range.label, from: ymd(from), to: ymd(to) },
      role: { owner: isOwner, dispatcher: isDispatcher, driver: isDriver },
    };

    // ── Osobné údaje (vlastné) — pre každého ────────────────────────────────────
    const me = await queryOne<{ meno: string; priezvisko: string; volaciZnak: string | null; registracnyPoplatokUhradeny: number }>(
      "SELECT `meno`, `priezvisko`, `volaciZnak`, `registracnyPoplatokUhradeny` FROM `User` WHERE `id` = ?",
      [uid]
    );
    const myRevenues = weekKeys.length
      ? await query<{ trzba: number; celkovyPoplatok: number; uhradene: number }>(
          `SELECT \`trzba\`, \`celkovyPoplatok\`, \`uhradene\` FROM \`Revenue\` WHERE \`driverId\` = ? AND (\`isoRok\`*100+\`isoTyzden\`) IN (${inWeeks})`,
          [uid, ...weekKeys]
        )
      : [];
    const myShifts = await query<{ typ: string; poplatokZaSmenu: number | null; poplatokUhradeny: number }>(
      "SELECT `typ`, `poplatokZaSmenu`, `poplatokUhradeny` FROM `Shift` WHERE `driverId` = ? AND `datum` BETWEEN ? AND ?",
      [uid, ymd(from), ymd(to)]
    );
    const myWorked = myShifts.filter((s) => s.typ !== "VOLNO");
    const myShiftFees = myShifts.filter((s) => s.poplatokZaSmenu != null);
    const myUnpaidRow = await queryOne<{ suma: number | null }>(
      "SELECT SUM(`celkovyPoplatok`) AS suma FROM `Revenue` WHERE `driverId` = ? AND `uhradene` = 0 AND (`isoRok`*100+`isoTyzden`) <= ?",
      [uid, curKey]
    );
    const mojNedoplatok = Number(myUnpaidRow?.suma ?? 0);

    response.moje = {
      jeVodic: isDriver,
      trzby: myRevenues.reduce((s, r) => s + Number(r.trzba), 0),
      poplatky: myRevenues.reduce((s, r) => s + Number(r.celkovyPoplatok), 0),
      uhradene: myRevenues.filter((r) => r.uhradene === 1).reduce((s, r) => s + Number(r.celkovyPoplatok), 0),
      neuhradene: myRevenues.filter((r) => r.uhradene !== 1).reduce((s, r) => s + Number(r.celkovyPoplatok), 0),
      prenajomZaplatene: myShiftFees.filter((s) => s.poplatokUhradeny === 1).reduce((s, x) => s + Number(x.poplatokZaSmenu ?? 0), 0),
      prenajomNezaplatene: myShiftFees.filter((s) => s.poplatokUhradeny !== 1).reduce((s, x) => s + Number(x.poplatokZaSmenu ?? 0), 0),
      registracia: { poplatok: registrationFee, uhradeny: toBool(me?.registracnyPoplatokUhradeny) },
      vytazenost: {
        odpracovane: myWorked.reduce((n, s) => n + (s.typ === "H24" ? 2 : 1), 0),
        denne: myWorked.filter((s) => s.typ === "DENNA" || s.typ === "H24").length,
        nocne: myWorked.filter((s) => s.typ === "NOCNA" || s.typ === "H24").length,
      },
    };

    // ── Blok "Neuhradené poplatky" (do aktuálneho týždňa) — všetci, scoped ──────
    if (isOwner) {
      const rows = await query<{ meno: string; priezvisko: string; volaciZnak: string | null; suma: number }>(
        "SELECT d.`meno`, d.`priezvisko`, d.`volaciZnak`, SUM(r.`celkovyPoplatok`) AS suma " +
          "FROM `Revenue` r JOIN `User` d ON d.`id` = r.`driverId` " +
          "WHERE r.`uhradene` = 0 AND (r.`isoRok`*100+r.`isoTyzden`) <= ? " +
          "GROUP BY r.`driverId`, d.`meno`, d.`priezvisko`, d.`volaciZnak` HAVING suma > 0 " +
          "ORDER BY (d.`volaciZnak` IS NULL), d.`volaciZnak` ASC",
        [curKey]
      );
      response.neuhradeneDoTyzdna = {
        spolu: rows.reduce((s, r) => s + Number(r.suma), 0),
        polozky: rows.map((r) => ({ meno: r.meno, priezvisko: r.priezvisko, volaciZnak: r.volaciZnak, suma: Number(r.suma) })),
      };
    } else {
      response.neuhradeneDoTyzdna = {
        spolu: mojNedoplatok,
        polozky: mojNedoplatok > 0 && me
          ? [{ meno: me.meno, priezvisko: me.priezvisko, volaciZnak: me.volaciZnak, suma: mojNedoplatok }]
          : [],
      };
    }

    // ── Vyťaženosť áut a vodičov — majiteľ + dispečer ───────────────────────────
    if (isOwner || isDispatcher) {
      const vehicles = await query<{ id: number; nazov: string; spz: string }>(
        "SELECT `id`, `nazov`, `spz` FROM `Vehicle` WHERE `aktivne` = 1 ORDER BY `nazov` ASC"
      );
      const drivers = await query<{ id: number; meno: string; priezvisko: string; volaciZnak: string | null }>(
        "SELECT u.`id`, u.`meno`, u.`priezvisko`, u.`volaciZnak` FROM `User` u " +
          "JOIN `UserRole` ur ON ur.`userId` = u.`id` AND ur.`role` = 'VODIC' " +
          "WHERE u.`aktivny` = 1 ORDER BY (u.`volaciZnak` IS NULL), u.`volaciZnak` ASC, u.`priezvisko` ASC"
      );
      const shifts = await query<{ datum: string; driverId: number; vehicleId: number | null; typ: string; poplatokZaSmenu: number | null; poplatokUhradeny: number; d_meno: string; d_priezvisko: string; d_volaciZnak: string | null }>(
        "SELECT s.`datum`, s.`driverId`, s.`vehicleId`, s.`typ`, s.`poplatokZaSmenu`, s.`poplatokUhradeny`, " +
          "d.`meno` AS d_meno, d.`priezvisko` AS d_priezvisko, d.`volaciZnak` AS d_volaciZnak " +
          "FROM `Shift` s JOIN `User` d ON d.`id` = s.`driverId` WHERE s.`datum` BETWEEN ? AND ?",
        [ymd(from), ymd(to)]
      );
      const worked = shifts.filter((s) => s.typ !== "VOLNO");
      const maxSlots = pocetDni * 2;
      // 24-hodinová smena (H24) sa počíta ako denná + nočná (2 sloty).
      const slotyD = (t: string) => (t === "DENNA" || t === "H24" ? 1 : 0);
      const slotyN = (t: string) => (t === "NOCNA" || t === "H24" ? 1 : 0);
      const pocetSlotov = (t: string) => slotyD(t) + slotyN(t);

      response.vytazenost = {
        vozidla: vehicles.map((v) => {
          const vs = worked.filter((s) => s.vehicleId === v.id);
          const obsadenych = vs.reduce((n, s) => n + pocetSlotov(s.typ), 0);
          return { vehicleId: v.id, nazov: v.nazov, spz: v.spz, obsadenychSmien: obsadenych, maxSmien: maxSlots, vytazenostPct: maxSlots ? Math.round((obsadenych / maxSlots) * 100) : 0 };
        }),
        vodici: drivers.map((d) => {
          const ds = worked.filter((s) => s.driverId === d.id);
          const denne = ds.reduce((n, s) => n + slotyD(s.typ), 0);
          const nocne = ds.reduce((n, s) => n + slotyN(s.typ), 0);
          return { driverId: d.id, meno: d.meno, priezvisko: d.priezvisko, volaciZnak: d.volaciZnak, odpracovanychSmien: denne + nocne, denne, nocne };
        }),
      };

      // Poplatky za prenájom po vodičoch — len majiteľ.
      // Zobrazujeme len smeny po aktuálny dátum (do včera vrátane); dnešné a
      // budúce naplánované smeny sa ešte nezapočítavajú (nie sú odpracované).
      if (isOwner) {
        const dnesStr = ymd(now);
        const feeShifts = shifts.filter((s) => s.poplatokZaSmenu != null && s.datum.slice(0, 10) < dnesStr);
        const byDriver = new Map<number, { driver: { meno: string; priezvisko: string; volaciZnak: string | null }; zaplatene: number; nezaplatene: number }>();
        for (const s of feeShifts) {
          const rec = byDriver.get(s.driverId) ?? { driver: { meno: s.d_meno, priezvisko: s.d_priezvisko, volaciZnak: s.d_volaciZnak }, zaplatene: 0, nezaplatene: 0 };
          if (s.poplatokUhradeny === 1) rec.zaplatene += Number(s.poplatokZaSmenu ?? 0);
          else rec.nezaplatene += Number(s.poplatokZaSmenu ?? 0);
          byDriver.set(s.driverId, rec);
        }
        response.poplatkyZaSmeny = {
          vyzbierane: feeShifts.filter((s) => s.poplatokUhradeny === 1).reduce((sum, s) => sum + Number(s.poplatokZaSmenu ?? 0), 0),
          neuhradene: feeShifts.filter((s) => s.poplatokUhradeny !== 1).reduce((sum, s) => sum + Number(s.poplatokZaSmenu ?? 0), 0),
          podlaVodicov: Array.from(byDriver.values()),
        };
      }
    }

    // ── Finančné súhrny, výdavky, zisk/strata — len majiteľ ─────────────────────
    if (isOwner) {
      const weekRevenues = weekKeys.length
        ? await query<{ driverId: number; celkovaTrzba: number; poplatokApp: number; provizia: number; uhradene: number; celkovyPoplatokRow: number }>(
            "SELECT `driverId`, `trzba` AS celkovaTrzba, `poplatokApp`, `provizia`, `celkovyPoplatok` AS celkovyPoplatokRow, `uhradene` " +
              `FROM \`Revenue\` WHERE (\`isoRok\`*100+\`isoTyzden\`) IN (${inWeeks})`,
            weekKeys
          )
        : [];
      const sumBy = (arr: typeof weekRevenues, key: keyof (typeof weekRevenues)[number]) => arr.reduce((s, r) => s + Number(r[key]), 0);

      response.suhrn = {
        pocetVodicov: new Set(weekRevenues.map((r) => r.driverId)).size,
        celkovaTrzba: sumBy(weekRevenues, "celkovaTrzba"),
        poplatokApp: sumBy(weekRevenues, "poplatokApp"),
        provizia: sumBy(weekRevenues, "provizia"),
        celkovyPoplatok: sumBy(weekRevenues, "celkovyPoplatokRow"),
        uhradene: weekRevenues.filter((r) => r.uhradene === 1).reduce((s, r) => s + Number(r.celkovyPoplatokRow), 0),
        neuhradene: weekRevenues.filter((r) => r.uhradene !== 1).reduce((s, r) => s + Number(r.celkovyPoplatokRow), 0),
      };

      response.neuhradenaRegistracia = await query(
        "SELECT DISTINCT u.`id`, u.`meno`, u.`priezvisko`, u.`volaciZnak` FROM `User` u " +
          "JOIN `UserRole` ur ON ur.`userId` = u.`id` AND ur.`role` = 'VODIC' " +
          "WHERE u.`registracnyPoplatokUhradeny` = 0 AND u.`aktivny` = 1"
      );

      // Výdavky za obdobie + zisk/strata + rozloženie. Pravidelné výdavky sa
      // rátajú len po koniec aktuálneho mesiaca a po koniec predpisu (datumDo);
      // vynechané jednotlivé výskyty sa nerátajú.
      const expenseRows = await query<{ id: number; datum: string; suma: number; pravidelny: number; interval: string | null; datumDo: string | null; c_nazov: string }>(
        "SELECT e.*, c.`nazov` AS c_nazov " +
          "FROM `Expense` e JOIN `ExpenseCategory` c ON c.`id` = e.`categoryId`"
      );
      const skipRows = await querySafe<{ expenseId: number; datum: string }>(
        "SELECT `expenseId`, `datum` FROM `ExpenseOccurrence` WHERE `vynechany` = 1"
      );
      const skipSet = new Set(skipRows.map((s) => `${s.expenseId}|${s.datum.slice(0, 10)}`));
      const byCat = new Map<string, number>();
      let vydavkySpolu = 0;
      for (const e of expenseRows) {
        const dates = visibleOccurrenceDates(
          { datum: e.datum, pravidelny: e.pravidelny === 1, interval: e.interval as ExpenseInterval | null, datumDo: e.datumDo },
          from, to
        ).filter((d) => !skipSet.has(`${e.id}|${d}`));
        if (dates.length === 0) continue;
        const amount = Number(e.suma) * dates.length;
        vydavkySpolu += amount;
        byCat.set(e.c_nazov, (byCat.get(e.c_nazov) ?? 0) + amount);
      }
      // Do príjmov a do zisku/straty rátame LEN už uhradené poplatky.
      // Neuhradené sa vykazujú samostatne (pre zvolené obdobie).
      const rental = response.poplatkyZaSmeny as { vyzbierane: number; neuhradene: number } | undefined;
      const prijmyUhradene =
        weekRevenues.filter((r) => r.uhradene === 1).reduce((s, r) => s + Number(r.celkovyPoplatokRow), 0)
        + (rental ? rental.vyzbierane : 0);
      const neuhradeneSpolu =
        weekRevenues.filter((r) => r.uhradene !== 1).reduce((s, r) => s + Number(r.celkovyPoplatokRow), 0)
        + (rental ? rental.neuhradene : 0);
      const vydavky = Math.round(vydavkySpolu * 10) / 10;
      const zisk = Math.round((prijmyUhradene - vydavky) * 10) / 10;
      response.financie = {
        prijmy: Math.round(prijmyUhradene * 10) / 10,
        prijmyNeuhradene: Math.round(neuhradeneSpolu * 10) / 10,
        vydavky,
        zisk,
        vydavkyPodlaKategorii: Array.from(byCat.entries()).map(([kategoria, suma]) => ({ kategoria, suma: Math.round(suma * 10) / 10 })).sort((a, b) => b.suma - a.suma),
      };
    }

    return res.status(200).json(response);
  })
);
