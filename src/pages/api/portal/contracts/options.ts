// Podklady pre modál generovania zmluvy — len MAJITEL.
// GET → { pdfDostupne, sablony: { NAJOM, DISPECING }, vozidla: [...], predvolene: { provizia, poplatokRegistracny } }
// Predvolené hodnoty (nájomné, kaucia, spoluúčasť, provízia, poplatok) vyplní modál —
// modul zmlúv ich len prijme ako vstup.
import type { NextApiRequest, NextApiResponse } from "next";
import { query, type TypZmluvy } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { getProvisionRate, getRegistrationFee } from "@/lib/settings";
import { getVehicleStatuses } from "@/lib/vehicleStatus";
import { poolExecutor } from "@/lib/contracts/executor";
import { getPdfConverter } from "@/lib/contracts/pdf";
import { getActiveTemplate } from "@/lib/contracts/templates";

type VehicleOptRow = {
  id: number;
  nazov: string;
  spz: string;
  aktivne: number;
  sukromne: number;
  poplatokZaSmenu: number | string | null;
  poplatokZa24h: number | string | null;
  kaucia: number | string | null;
  spoluucast: number | string | null;
  stavKm: number | null;
};

const num = (v: number | string | null | undefined) => (v === null || v === undefined ? null : Number(v));
const round2 = (n: number) => Math.round(n * 100) / 100;

async function sablona(typ: TypZmluvy) {
  const t = await getActiveTemplate(poolExecutor, typ);
  return t ? { id: t.id, verzia: t.verzia, nazov: t.nazov, platnaOd: String(t.platnaOd).slice(0, 10) } : null;
}

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ message: "Method not allowed" });
    }

    const [najom, dispecing, rows, statuses, rate, fee] = await Promise.all([
      sablona("NAJOM"),
      sablona("DISPECING"),
      query<VehicleOptRow>(
        "SELECT `id`, `nazov`, `spz`, `aktivne`, `sukromne`, `poplatokZaSmenu`, `poplatokZa24h`, `kaucia`, `spoluucast`, `stavKm` " +
          "FROM `Vehicle` ORDER BY `aktivne` DESC, `nazov` ASC"
      ),
      getVehicleStatuses(),
      getProvisionRate(),
      getRegistrationFee(),
    ]);

    const vozidla = rows.map((v) => {
      const st = statuses.get(v.id);
      return {
        id: v.id,
        nazov: v.nazov,
        spz: v.spz,
        stav: st?.stav ?? (v.aktivne === 1 ? "VOLNE" : "VYRADENE"),
        pocetNajmov: st?.pocetNajmov ?? 0,
        aktivne: v.aktivne === 1,
        sukromne: v.sukromne === 1,
        poplatokZaSmenu: num(v.poplatokZaSmenu),
        poplatokZa24h: num(v.poplatokZa24h),
        kaucia: num(v.kaucia),
        spoluucast: num(v.spoluucast),
        stavKm: v.stavKm ?? null,
      };
    });

    return res.status(200).json({
      pdfDostupne: getPdfConverter().available,
      sablony: { NAJOM: najom, DISPECING: dispecing },
      vozidla,
      predvolene: { provizia: round2(rate * 100), poplatokRegistracny: fee },
    });
  })
);
