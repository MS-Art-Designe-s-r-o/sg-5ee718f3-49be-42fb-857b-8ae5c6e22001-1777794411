import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, queryOne, execute, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { syncVehicleExpenses } from "@/lib/vehicleExpenses";
import {
  vehicleContractFields,
  pickContractValues,
  mapVehicleContract,
  type VehicleContractRow,
} from "@/lib/vehicleContract";

const druhPohonu = z.enum(["ELEKTRO", "HYBRID", "BENZIN", "DIESEL", "LPG", "CNG"]);

const createSchema = z.object({
  nazov: z.string().min(1),
  znacka: z.string().min(1),
  model: z.string().min(1),
  farba: z.string().min(1),
  spz: z.string().min(1),
  druhPohonu,
  poplatokZaSmenu: z.coerce.number().min(0).default(0),
  poplatokZa24h: z.coerce.number().min(0).default(0),
  lizing: z.coerce.number().min(0).default(0),
  poistenie: z.coerce.number().min(0).default(0),
  sukromne: z.boolean().default(false),
  casVymeny: z.string().nullable().optional(),
  aktivne: z.boolean().default(true),
  ...vehicleContractFields,
});

type VehicleRow = {
  id: number; nazov: string; znacka: string; model: string; farba: string;
  spz: string; druhPohonu: string; poplatokZaSmenu: number; poplatokZa24h: number; lizing: number; poistenie: number;
  sukromne: number; casVymeny: string | null; aktivne: number;
} & VehicleContractRow;

function mapVehicle(v: VehicleRow) {
  return {
    ...v,
    poplatokZaSmenu: Number(v.poplatokZaSmenu),
    poplatokZa24h: Number(v.poplatokZa24h),
    lizing: Number(v.lizing),
    poistenie: Number(v.poistenie),
    sukromne: v.sukromne === 1,
    aktivne: v.aktivne === 1,
    ...mapVehicleContract(v),
  };
}

// Normalizuj čas "HH:MM" (prázdny → null).
function normCas(v: string | null | undefined): string | null {
  if (!v) return null;
  const t = v.trim();
  return /^\d{1,2}:\d{2}$/.test(t) ? t.padStart(5, "0") : null;
}

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      const rows = await query<VehicleRow>("SELECT * FROM `Vehicle` ORDER BY `nazov` ASC");
      return res.status(200).json({ vehicles: rows.map(mapVehicle) });
    }
    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;
      // Zmluvné polia zapisujeme len ak prišli (INSERT bez nich ostáva ako pred migráciou 0010).
      const contract = pickContractValues(body);
      const vinVal = contract.find((c) => c.col === "vin")?.val;
      if (typeof vinVal === "string") {
        const dup = await queryOne<{ id: number }>("SELECT `id` FROM `Vehicle` WHERE `vin` = ? LIMIT 1", [vinVal]);
        if (dup) return res.status(409).json({ message: "Vozidlo s týmto VIN už existuje" });
      }
      const r = await execute(
        "INSERT INTO `Vehicle` (`nazov`,`znacka`,`model`,`farba`,`spz`,`druhPohonu`,`poplatokZaSmenu`,`poplatokZa24h`,`lizing`,`poistenie`,`sukromne`,`casVymeny`,`aktivne`," +
          contract.map((c) => `\`${c.col}\`,`).join("") +
          "`createdAt`,`updatedAt`) " +
          "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?," + contract.map(() => "?,").join("") + "NOW(3),NOW(3))",
        [
          body.nazov, body.znacka, body.model, body.farba,
          body.spz.toUpperCase().trim(), body.druhPohonu, body.poplatokZaSmenu, body.poplatokZa24h,
          body.lizing, body.poistenie, body.sukromne ? 1 : 0, normCas(body.casVymeny), body.aktivne ? 1 : 0,
          ...contract.map((c): SqlParam => c.val),
        ]
      );
      await syncVehicleExpenses(r.insertId, body.nazov, body.lizing, body.poistenie);
      const rows = await query<VehicleRow>("SELECT * FROM `Vehicle` WHERE `id` = ?", [r.insertId]);
      return res.status(201).json({ vehicle: mapVehicle(rows[0]) });
    }
    return res.status(405).json({ message: "Method not allowed" });
  })
);
