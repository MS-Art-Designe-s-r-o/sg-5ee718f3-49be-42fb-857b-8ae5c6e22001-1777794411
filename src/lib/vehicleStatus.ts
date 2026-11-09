// Stav vozidla sa NEUKLADÁ — dopočíta sa z aktivity, servisného bloku a platných
// nájomných zmlúv (docs/zmluvy-navrh.md).
//
// Priorita: aktivne=0 → VYRADENE; platí SERVIS blok dnes → SERVIS;
// existuje platná zmluva NAJOM → PRENAJATE (+ počet); inak VOLNE.
// Jedno vozidlo môže byť prenajaté viacerým vodičom (užívanie podľa rozpisu
// smien), preto nehľadáme kolíziu — len počítame platné nájmy.
import { query, querySafe } from "@/lib/db";

export type VehicleStav = "VYRADENE" | "SERVIS" | "PRENAJATE" | "VOLNE";

export type VehicleStatus = { stav: VehicleStav; pocetNajmov: number };

export type VehicleStatusInput = {
  aktivne: boolean;
  /** Dnes platí blokovanie typu SERVIS. */
  blokServisDnes: boolean;
  /** Počet dnes platných nájomných zmlúv (VYGENEROVANA/PODPISANA) na vozidle. */
  pocetPlatnychNajmov: number;
};

/** Čistá funkcia — určí stav vozidla zo vstupných faktov. */
export function computeVehicleStatus(input: VehicleStatusInput): VehicleStatus {
  const pocetNajmov = Math.max(0, Math.floor(input.pocetPlatnychNajmov || 0));
  let stav: VehicleStav;
  if (!input.aktivne) stav = "VYRADENE";
  else if (input.blokServisDnes) stav = "SERVIS";
  else if (pocetNajmov > 0) stav = "PRENAJATE";
  else stav = "VOLNE";
  return { stav, pocetNajmov };
}

/**
 * Stavy vozidiel (kľúč = id vozidla). Bez parametra všetky vozidlá.
 * Tabuľka Contract vzniká až migráciou 0011 — querySafe pri jej absencii vráti
 * [] (vozidlá potom nie sú prenajaté), takže funkcia funguje aj pred migráciou.
 */
export async function getVehicleStatuses(
  vehicleIds?: number[]
): Promise<Map<number, VehicleStatus>> {
  const out = new Map<number, VehicleStatus>();
  const ids = vehicleIds?.filter((n) => Number.isInteger(n));
  if (ids && ids.length === 0) return out;

  const placeholders = ids ? ids.map(() => "?").join(",") : "";
  const filtrVozidiel = ids ? ` AND \`vehicleId\` IN (${placeholders})` : "";
  const params = ids ?? [];

  const vehicles = await query<{ id: number; aktivne: number }>(
    "SELECT `id`, `aktivne` FROM `Vehicle`" +
      (ids ? ` WHERE \`id\` IN (${placeholders})` : ""),
    params
  );

  const bloky = await querySafe<{ vehicleId: number }>(
    "SELECT DISTINCT `vehicleId` FROM `VehicleBlock` " +
      "WHERE `typ` = 'SERVIS' AND CURDATE() BETWEEN `datumOd` AND `datumDo`" +
      filtrVozidiel,
    params
  );
  const servis = new Set(bloky.map((b) => b.vehicleId));

  const najmy = await querySafe<{ vehicleId: number; pocet: number }>(
    "SELECT `vehicleId`, COUNT(*) AS `pocet` FROM `Contract` " +
      "WHERE `typ` = 'NAJOM' AND `stav` IN ('VYGENEROVANA','PODPISANA') " +
      "AND `vehicleId` IS NOT NULL AND `platnostOd` <= CURDATE() " +
      "AND (`platnostDo` IS NULL OR `platnostDo` >= CURDATE())" +
      filtrVozidiel +
      " GROUP BY `vehicleId`",
    params
  );
  const pocty = new Map(najmy.map((n) => [n.vehicleId, Number(n.pocet)]));

  for (const v of vehicles) {
    out.set(
      v.id,
      computeVehicleStatus({
        aktivne: v.aktivne === 1,
        blokServisDnes: servis.has(v.id),
        pocetPlatnychNajmov: pocty.get(v.id) ?? 0,
      })
    );
  }
  return out;
}
