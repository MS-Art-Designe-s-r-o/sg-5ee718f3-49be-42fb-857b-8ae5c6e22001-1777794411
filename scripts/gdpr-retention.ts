// Retencia osobných údajov (GDPR) — audit log a profily vodičov.
//
//  (a) AuditLog: zmaže záznamy staršie ako 5 rokov.
//  (b) DriverProfile: anonymizuje profily vodičov, ktorých POSLEDNÁ zmluva skončila
//      (ukoncenaDna / platnostDo) pred viac ako 5 rokmi a ktorí nemajú žiadnu aktívnu
//      zmluvu. Vynuluje RČ (aj blind index), číslo OP, dátum narodenia, trvalý pobyt,
//      čísla VP a PVT, IBAN, titulné a firemné polia a nastaví anonymizedAt = NOW(3).
//
// Zmluvy samotné (Contract) sa týmto skriptom nemenia.
// „Skončená“ zmluva = stav UKONCENA (dátum ukoncenaDna, inak platnostDo, inak updatedAt),
// alebo iná než NAHRADENA s vyplneným platnostDo v minulosti. Zmluva na dobu neurčitú
// (platnostDo NULL) mimo stavu UKONCENA sa považuje za aktívnu. NAHRADENA zmluvy sa
// nepočítajú (nahrádza ich novšia verzia). Vodič bez zmluvy sa nemení.
//
// Vypisuje len počty — nikdy ID ani hodnoty.
//
// Spustenie:
//   npx tsx scripts/gdpr-retention.ts            # DRY-RUN (default)
//   npx tsx scripts/gdpr-retention.ts --apply    # vykoná zmazanie / anonymizáciu
// Potrebuje DATABASE_URL.
import mysql from "mysql2/promise";
import { describeError } from "../src/lib/safeLog";

const RETENTION_YEARS = 5;
const BATCH = 200;

/** Dátum skončenia zmluvy (NULL = nekončí / na dobu neurčitú). */
const END_EXPR =
  "CASE WHEN c.`stav` = 'UKONCENA' THEN COALESCE(c.`ukoncenaDna`, c.`platnostDo`, DATE(c.`updatedAt`)) ELSE c.`platnostDo` END";

/** Profily na anonymizáciu: majú zmluvu a žiadna (nenahradená) nekončí alebo neskončila v lehote. */
const CANDIDATES_FROM =
  "FROM `DriverProfile` dp " +
  "WHERE dp.`anonymizedAt` IS NULL " +
  "AND EXISTS (SELECT 1 FROM `Contract` c WHERE c.`driverId` = dp.`userId` AND c.`stav` <> 'NAHRADENA') " +
  "AND NOT EXISTS (SELECT 1 FROM `Contract` c WHERE c.`driverId` = dp.`userId` AND c.`stav` <> 'NAHRADENA' " +
  `AND (${END_EXPR} IS NULL OR ${END_EXPR} >= DATE_SUB(CURDATE(), INTERVAL ${RETENTION_YEARS} YEAR)))`;

const ANONYMIZE_SET = [
  "rodneCisloEnc", "rodneCisloBidx", "cisloOpEnc", "datumNarodenia", "trvalyPobyt", "cisloVp", "cisloPvt",
  "pvtPlatnostDo", "iban", "titulPred", "titulZa",
  "firmaObchodneMeno", "firmaIco", "firmaDic", "firmaIcDph", "firmaSidlo", "firmaZapisanyV",
  "cisloKoncesie", "koncesiaPlatnostDo", "firmaStatutar",
]
  .map((c) => `\`${c}\` = NULL`)
  .join(", ");

async function auditLog(conn: mysql.Connection, apply: boolean): Promise<number> {
  const where = `\`at\` < DATE_SUB(NOW(3), INTERVAL ${RETENTION_YEARS} YEAR)`;
  if (!apply) {
    const [rows] = await conn.query<mysql.RowDataPacket[]>(`SELECT COUNT(*) AS n FROM \`AuditLog\` WHERE ${where}`);
    return Number(rows[0]?.n ?? 0);
  }
  let total = 0;
  for (;;) {
    // Po dávkach, aby sa nedržal dlhý zámok.
    const [res] = await conn.execute<mysql.ResultSetHeader>(`DELETE FROM \`AuditLog\` WHERE ${where} LIMIT 5000`);
    total += res.affectedRows;
    if (res.affectedRows < 5000) break;
  }
  return total;
}

async function driverProfiles(conn: mysql.Connection, apply: boolean): Promise<number> {
  if (!apply) {
    const [rows] = await conn.query<mysql.RowDataPacket[]>(`SELECT COUNT(*) AS n ${CANDIDATES_FROM}`);
    return Number(rows[0]?.n ?? 0);
  }
  let total = 0;
  for (;;) {
    // Anonymizované riadky (anonymizedAt IS NOT NULL) vypadnú z výberu — cyklus vždy postupuje.
    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT dp.\`userId\` AS id ${CANDIDATES_FROM} ORDER BY dp.\`userId\` LIMIT ${BATCH}`
    );
    if (!rows.length) break;
    const ids = rows.map((r) => Number(r.id));
    await conn.beginTransaction();
    try {
      const [res] = await conn.query<mysql.ResultSetHeader>(
        `UPDATE \`DriverProfile\` SET ${ANONYMIZE_SET}, \`anonymizedAt\` = NOW(3), \`updatedAt\` = NOW(3) ` +
          "WHERE `userId` IN (?) AND `anonymizedAt` IS NULL",
        [ids]
      );
      await conn.commit();
      total += res.affectedRows;
      if (res.affectedRows === 0) break; // poistka proti nekonečnej slučke
    } catch (e) {
      await conn.rollback();
      throw e;
    }
  }
  return total;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL nie je nastavený.");

  console.log(`Retencia GDPR (${RETENTION_YEARS} rokov). Režim: ${apply ? "APPLY (zmeny sa vykonajú)" : "DRY-RUN (bez zmien)"}`);

  const conn = await mysql.createConnection(url);
  try {
    const audit = await auditLog(conn, apply);
    const profily = await driverProfiles(conn, apply);
    console.log(`AuditLog: ${apply ? "zmazané" : "na zmazanie"} ${audit}`);
    console.log(`DriverProfile: ${apply ? "anonymizované" : "na anonymizáciu"} ${profily}`);
    if (!apply && (audit > 0 || profily > 0)) {
      console.log("Na vykonanie spustite znova s parametrom --apply.");
    }
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(`Retencia zlyhala: ${describeError(e)}`);
  process.exit(1);
});
