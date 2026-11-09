// Spoločné čítanie flotíl (zoznam aj detail) s aktuálnou zmluvou a počtom vodičov.
import { query, type FleetRow } from "./db";

export type FleetPublic = Omit<FleetRow, "aktivna"> & {
  aktivna: boolean;
  aktualnaZmluva: { cislo: string; platnostOd: string; platnostDo: string | null } | null;
  pocetVodicov: number;
};

/** Načíta flotily (všetky alebo jednu podľa id) zoradené podľa názvu. */
export async function loadFleets(id?: number): Promise<FleetPublic[]> {
  const where = id === undefined ? "" : " WHERE `id` = ?";
  const params = id === undefined ? [] : [id];
  const fleets = await query<FleetRow>(
    `SELECT * FROM \`Fleet\`${where} ORDER BY \`obchodneMeno\` ASC, \`id\` ASC`,
    params
  );
  if (!fleets.length) return [];

  const agWhere = id === undefined ? "" : " AND `fleetId` = ?";
  const agreements = await query<{
    fleetId: number;
    cislo: string;
    platnostOd: string;
    platnostDo: string | null;
  }>(
    "SELECT `fleetId`, `cislo`, `platnostOd`, `platnostDo` FROM `FleetAgreement` " +
      "WHERE `platnostOd` <= CURDATE() AND (`platnostDo` IS NULL OR `platnostDo` >= CURDATE())" +
      agWhere +
      " ORDER BY `platnostOd` DESC, `id` DESC",
    params
  );
  const current = new Map<number, FleetPublic["aktualnaZmluva"]>();
  for (const a of agreements) {
    if (!current.has(a.fleetId)) {
      current.set(a.fleetId, { cislo: a.cislo, platnostOd: a.platnostOd, platnostDo: a.platnostDo });
    }
  }

  const drvWhere = id === undefined ? "" : " AND `fleetId` = ?";
  const counts = await query<{ fleetId: number; n: number }>(
    "SELECT `fleetId`, COUNT(*) AS n FROM `DriverProfile` WHERE `fleetId` IS NOT NULL" +
      drvWhere +
      " GROUP BY `fleetId`",
    params
  );
  const countMap = new Map(counts.map((c) => [c.fleetId, Number(c.n)]));

  return fleets.map((f) => ({
    ...f,
    aktivna: f.aktivna === 1,
    aktualnaZmluva: current.get(f.id) ?? null,
    pocetVodicov: countMap.get(f.id) ?? 0,
  }));
}
