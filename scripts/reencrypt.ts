// Rotácia kľúčov šifrovania osobných údajov.
//
// Prejde DriverProfile.rodneCisloEnc / cisloOpEnc (AAD "<pole>:<userId>") a
// Contract.snapshotEnc (AAD "snapshot:<id>") a spočíta záznamy zašifrované iným
// než aktívnym kľúčom (FIELD_ENC_ACTIVE). S --apply ich prešifruje — každý riadok
// v samostatnej transakcii so zámkom (SELECT … FOR UPDATE).
//
// Nikdy nevypisuje hodnoty ani ID záznamov — len počty.
//
// Spustenie:
//   npx tsx scripts/reencrypt.ts            # DRY-RUN (default)
//   npx tsx scripts/reencrypt.ts --apply    # prešifrovanie
// Potrebuje DATABASE_URL, FIELD_ENC_KEYS (staré aj nový kľúč) a FIELD_ENC_ACTIVE.
import mysql from "mysql2/promise";
import {
  activeKeyId,
  decryptField,
  encryptField,
  needsReencrypt,
} from "../src/lib/crypto/fieldCrypto";
import { describeError } from "../src/lib/safeLog";

const BATCH = 200;

type Stat = { pole: string; spolu: number; staryKluc: number; prepisane: number; chyby: number };

type Target = {
  pole: string;
  table: "DriverProfile" | "Contract";
  pk: "userId" | "id";
  col: "rodneCisloEnc" | "cisloOpEnc" | "snapshotEnc";
  aad: (id: number) => string;
};

const TARGETS: Target[] = [
  { pole: "DriverProfile.rodneCisloEnc", table: "DriverProfile", pk: "userId", col: "rodneCisloEnc", aad: (id) => `rodneCislo:${id}` },
  { pole: "DriverProfile.cisloOpEnc", table: "DriverProfile", pk: "userId", col: "cisloOpEnc", aad: (id) => `cisloOp:${id}` },
  { pole: "Contract.snapshotEnc", table: "Contract", pk: "id", col: "snapshotEnc", aad: (id) => `snapshot:${id}` },
];

/** true = prešifrované, false = medzičasom už netreba. */
async function reencryptRow(conn: mysql.Connection, t: Target, id: number): Promise<boolean> {
  await conn.beginTransaction();
  try {
    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT \`${t.col}\` AS v FROM \`${t.table}\` WHERE \`${t.pk}\` = ? FOR UPDATE`,
      [id]
    );
    const token = rows[0]?.v as string | null | undefined;
    if (!token || !needsReencrypt(token)) {
      await conn.rollback();
      return false;
    }
    const fresh = encryptField(decryptField(token, t.aad(id)), t.aad(id));
    // updatedAt ponechávame (prešifrovanie nie je vecná zmena záznamu).
    await conn.execute(
      `UPDATE \`${t.table}\` SET \`${t.col}\` = ?, \`updatedAt\` = \`updatedAt\` WHERE \`${t.pk}\` = ?`,
      [fresh, id]
    );
    await conn.commit();
    return true;
  } catch (e) {
    await conn.rollback();
    throw e;
  }
}

async function processTarget(conn: mysql.Connection, t: Target, apply: boolean): Promise<Stat> {
  const stat: Stat = { pole: t.pole, spolu: 0, staryKluc: 0, prepisane: 0, chyby: 0 };
  let lastId = 0;
  for (;;) {
    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT \`${t.pk}\` AS id, \`${t.col}\` AS v FROM \`${t.table}\`
        WHERE \`${t.pk}\` > ? AND \`${t.col}\` IS NOT NULL
        ORDER BY \`${t.pk}\` LIMIT ${BATCH}`,
      [lastId]
    );
    if (!rows.length) break;
    for (const r of rows) {
      const id = Number(r.id);
      lastId = id;
      stat.spolu++;
      let old: boolean;
      try {
        old = needsReencrypt(String(r.v));
      } catch {
        stat.chyby++; // neplatný formát tokenu
        continue;
      }
      if (!old) continue;
      stat.staryKluc++;
      if (!apply) continue;
      try {
        if (await reencryptRow(conn, t, id)) stat.prepisane++;
      } catch {
        stat.chyby++; // detaily zámerne nelogujeme (mohli by obsahovať údaje)
      }
    }
  }
  return stat;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL nie je nastavený.");

  const active = activeKeyId(); // overí kľúče hneď na začiatku
  console.log(`Aktívny kľúč: ${active}. Režim: ${apply ? "APPLY (prešifrovanie)" : "DRY-RUN (bez zmien)"}`);

  const conn = await mysql.createConnection(url);
  try {
    const stats: Stat[] = [];
    for (const t of TARGETS) stats.push(await processTarget(conn, t, apply));
    for (const s of stats) {
      console.log(
        `${s.pole}: spolu ${s.spolu}, so starým kľúčom ${s.staryKluc}` +
          (apply ? `, prešifrované ${s.prepisane}` : "") +
          `, chyby ${s.chyby}`
      );
    }
    if (!apply && stats.some((s) => s.staryKluc > 0)) {
      console.log("Na prešifrovanie spustite znova s parametrom --apply.");
    }
    if (stats.some((s) => s.chyby > 0)) process.exitCode = 2;
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(`Rotácia zlyhala: ${describeError(e)}`);
  process.exit(1);
});
