// Voľné (neobsadené) smeny na jednotlivých vozidlách za obdobie.
// Na vozidle sú denne 2 sloty: denná (D) a nočná (N). Slot je voľný, ak naň
// nie je priradená žiadna smena. Dostupné pre všetky portálové role.
import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { periodRange, isoWeekParts, type Obdobie } from "@/lib/fees";
import { blockCoversSlot } from "@/lib/vehicleBlocks";

const ymd = (d: Date) => d.toISOString().slice(0, 10);

export default withErrorHandler(
  withAuth(["VODIC", "DISPECER", "MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const cur = isoWeekParts(new Date());
    // Voľné smeny podporujú len týždeň a mesiac (pri roku by bol zoznam neprehľadný).
    const obdobie = (["tyzden", "mesiac"].includes(String(req.query.obdobie))
      ? req.query.obdobie
      : "tyzden") as Obdobie;
    const rok = req.query.rok ? Number(req.query.rok) : cur.isoRok;
    const tyzden = req.query.tyzden ? Number(req.query.tyzden) : cur.isoTyzden;
    const mesiac = req.query.mesiac ? Number(req.query.mesiac) : new Date().getUTCMonth() + 1;
    const range = periodRange(obdobie, { rok, tyzden, mesiac });

    // Dni obdobia — len od dnešného dňa (minulé voľné smeny sa nezobrazujú).
    const dnesStr = ymd(new Date());
    const dni: string[] = [];
    const d = new Date(range.from);
    while (d.getTime() <= range.to.getTime()) {
      const den = ymd(d);
      if (den >= dnesStr) dni.push(den);
      d.setUTCDate(d.getUTCDate() + 1);
    }

    // Súkromné vozidlá sa medzi voľnými smenami neponúkajú.
    const vehicles = await query<{ id: number; nazov: string; spz: string }>(
      "SELECT `id`, `nazov`, `spz` FROM `Vehicle` WHERE `aktivne` = 1 AND `sukromne` = 0 ORDER BY `nazov` ASC"
    );
    const shifts = await query<{ vehicleId: number; datum: string; typ: string }>(
      "SELECT `vehicleId`, `datum`, `typ` FROM `Shift` " +
        "WHERE `vehicleId` IS NOT NULL AND `typ` <> 'VOLNO' AND `datum` BETWEEN ? AND ?",
      [ymd(range.from), ymd(range.to)]
    );
    // Blokované termíny vozidiel (nedostupné / servis) — podľa rozsahu slotu.
    const blocks = await query<{ vehicleId: number; datumOd: string; datumDo: string; rozsah: string }>(
      "SELECT `vehicleId`, `datumOd`, `datumDo`, `rozsah` FROM `VehicleBlock` " +
        "WHERE `datumOd` <= ? AND `datumDo` >= ?",
      [ymd(range.to), ymd(range.from)]
    );
    const jeBlokovane = (vehicleId: number, den: string, typ: "DENNA" | "NOCNA") =>
      blocks.some(
        (b) =>
          b.vehicleId === vehicleId &&
          den >= b.datumOd.slice(0, 10) &&
          den <= b.datumDo.slice(0, 10) &&
          blockCoversSlot(b, den, typ)
      );

    // Množina obsadených slotov: `${vehicleId}|${datum}|${typ}`.
    // 24-hodinová smena (H24) obsadí dennú aj nočnú.
    const obsadene = new Set<string>();
    for (const s of shifts) {
      const base = `${s.vehicleId}|${s.datum.slice(0, 10)}`;
      if (s.typ === "H24") { obsadene.add(`${base}|DENNA`); obsadene.add(`${base}|NOCNA`); }
      else obsadene.add(`${base}|${s.typ}`);
    }

    const vozidla = vehicles.map((v) => {
      const volneSmeny: { datum: string; typ: "DENNA" | "NOCNA" }[] = [];
      for (const den of dni) {
        for (const typ of ["DENNA", "NOCNA"] as const) {
          if (jeBlokovane(v.id, den, typ)) continue; // nedostupné / servis
          if (!obsadene.has(`${v.id}|${den}|${typ}`)) volneSmeny.push({ datum: den, typ });
        }
      }
      return {
        vehicleId: v.id,
        nazov: v.nazov,
        spz: v.spz,
        volneSmeny,
        pocetVolnych: volneSmeny.length,
        pocetCelkom: dni.length * 2,
      };
    });

    return res.status(200).json({
      obdobie: { typ: obdobie, rok, tyzden, mesiac, label: range.label, from: ymd(range.from), to: ymd(range.to) },
      vozidla,
    });
  })
);
