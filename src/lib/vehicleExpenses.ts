// Synchronizácia lízingu a poistenia vozidla do pravidelných (mesačných) výdavkov.
// Pri uložení vozidla sa udržiava naviazaný výdavok (zdroj VOZIDLO_LIZING /
// VOZIDLO_POISTENIE). Ak je suma 0, naviazaný výdavok sa odstráni.
import { queryOne, execute } from "@/lib/db";

const firstOfMonth = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
};

async function categoryId(nazov: string): Promise<number | null> {
  const row = await queryOne<{ id: number }>(
    "SELECT `id` FROM `ExpenseCategory` WHERE `nazov` = ? LIMIT 1",
    [nazov]
  );
  return row?.id ?? null;
}

async function syncOne(
  vehicleId: number,
  vehicleNazov: string,
  zdroj: string,
  categoryNazov: string,
  popisPrefix: string,
  suma: number
) {
  const existing = await queryOne<{ id: number }>(
    "SELECT `id` FROM `Expense` WHERE `vehicleId` = ? AND `zdroj` = ? LIMIT 1",
    [vehicleId, zdroj]
  );

  if (!suma || suma <= 0) {
    if (existing) await execute("DELETE FROM `Expense` WHERE `id` = ?", [existing.id]);
    return;
  }

  const catId = await categoryId(categoryNazov);
  if (catId === null) return; // kategória neexistuje (napr. premenovaná) — preskoč

  const popis = `${popisPrefix} – ${vehicleNazov}`;
  if (existing) {
    await execute(
      "UPDATE `Expense` SET `suma` = ?, `popis` = ?, `categoryId` = ?, `pravidelny` = 1, `interval` = 'MESACNE', `updatedAt` = NOW(3) WHERE `id` = ?",
      [suma, popis, catId, existing.id]
    );
  } else {
    await execute(
      "INSERT INTO `Expense` (`datum`,`popis`,`suma`,`uhradene`,`pravidelny`,`interval`,`categoryId`,`vehicleId`,`zdroj`,`createdAt`,`updatedAt`) " +
        "VALUES (?,?,?,0,1,'MESACNE',?,?,?,NOW(3),NOW(3))",
      [firstOfMonth(), popis, suma, catId, vehicleId, zdroj]
    );
  }
}

/** Zosynchronizuje výdavky lízing/poistenie pre dané vozidlo. */
export async function syncVehicleExpenses(
  vehicleId: number,
  vehicleNazov: string,
  lizing: number,
  poistenie: number
): Promise<void> {
  await syncOne(vehicleId, vehicleNazov, "VOZIDLO_LIZING", "Lízing", "Lízing", lizing);
  await syncOne(vehicleId, vehicleNazov, "VOZIDLO_POISTENIE", "Poistenie", "Poistenie", poistenie);
}
