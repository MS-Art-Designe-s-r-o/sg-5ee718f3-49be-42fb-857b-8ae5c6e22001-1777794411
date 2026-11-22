// Seed: tarifné pásma, konfigurácia (provízia, registračný poplatok) a prvý majiteľ.
//
// Používa priamy MySQL driver `mysql2` (čistý JavaScript) namiesto Prisma
// query engine — na obmedzenom zdieľanom hostingu (CloudLinux, nízky NPROC)
// Rust engine padal na "PANIC: timer has gone away". Tento seed žiadne
// natívne vlákna nespúšťa, takže funguje aj pod prísnymi limitmi.
//
// Spustenie: npm run seed  (potrebuje DATABASE_URL a voliteľne INITIAL_OWNER_*).
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import {
  DEFAULT_FEE_TIERS,
  DEFAULT_PROVISION_RATE,
  DEFAULT_REGISTRATION_FEE,
} from "../src/lib/fees";
import { DEFAULT_EXPENSE_CATEGORIES } from "../src/lib/expenses";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL nie je nastavený.");
  }

  const conn = await mysql.createConnection(url);
  try {
    // 1) Tarifné pásma (len ak je tabuľka prázdna).
    const [tierRows] = await conn.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS cnt FROM `FeeTier`"
    );
    if (Number(tierRows[0].cnt) === 0) {
      const values = DEFAULT_FEE_TIERS.map((t, i) => [t.trzbaOd, t.trzbaDo, t.poplatok, i]);
      await conn.query(
        "INSERT INTO `FeeTier` (`trzbaOd`,`trzbaDo`,`poplatok`,`poradie`) VALUES ?",
        [values]
      );
      console.log(`✅ Vytvorených ${DEFAULT_FEE_TIERS.length} tarifných pásiem.`);
    } else {
      console.log("ℹ️  Tarifné pásma už existujú — preskočené.");
    }

    // 2) Konfigurácia (nechá existujúce hodnoty nezmenené).
    await conn.query(
      "INSERT INTO `AppSetting` (`key`,`value`) VALUES (?,?),(?,?) " +
        "ON DUPLICATE KEY UPDATE `value` = `value`",
      [
        "provisionRate", String(DEFAULT_PROVISION_RATE),
        "registrationFee", String(DEFAULT_REGISTRATION_FEE),
      ]
    );
    console.log("✅ Konfigurácia (provízia, registračný poplatok) pripravená.");

    // 2b) Kategórie výdavkov (len ak je tabuľka prázdna).
    const [catRows] = await conn.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS cnt FROM `ExpenseCategory`"
    );
    if (Number(catRows[0].cnt) === 0) {
      const values = DEFAULT_EXPENSE_CATEGORIES.map((n, i) => [n, i]);
      await conn.query(
        "INSERT INTO `ExpenseCategory` (`nazov`,`poradie`) VALUES ?",
        [values]
      );
      console.log(`✅ Vytvorených ${DEFAULT_EXPENSE_CATEGORIES.length} kategórií výdavkov.`);
    } else {
      console.log("ℹ️  Kategórie výdavkov už existujú — preskočené.");
    }

    // 3) Prvý majiteľ.
    const ownerEmail = (process.env.INITIAL_OWNER_EMAIL || "").toLowerCase().trim();
    const ownerPassword = process.env.INITIAL_OWNER_PASSWORD || "";
    if (ownerEmail && ownerPassword) {
      const [userRows] = await conn.query<mysql.RowDataPacket[]>(
        "SELECT id FROM `User` WHERE `email` = ?",
        [ownerEmail]
      );
      if (userRows.length === 0) {
        const hash = await bcrypt.hash(ownerPassword, 10);
        const [result] = await conn.query<mysql.ResultSetHeader>(
          "INSERT INTO `User` " +
            "(`email`,`passwordHash`,`meno`,`priezvisko`,`aktivny`,`mustSetPassword`,`registracnyPoplatokUhradeny`,`createdAt`,`updatedAt`) " +
            "VALUES (?,?,?,?,1,0,0,NOW(3),NOW(3))",
          [
            ownerEmail,
            hash,
            process.env.INITIAL_OWNER_MENO || "Majiteľ",
            process.env.INITIAL_OWNER_PRIEZVISKO || "E-TAXI",
          ]
        );
        await conn.query(
          "INSERT INTO `UserRole` (`userId`,`role`) VALUES (?, 'MAJITEL')",
          [result.insertId]
        );
        console.log(`✅ Vytvorený majiteľ: ${ownerEmail}`);
      } else {
        console.log(`ℹ️  Majiteľ ${ownerEmail} už existuje — preskočené.`);
      }
    } else {
      console.log(
        "ℹ️  INITIAL_OWNER_EMAIL / INITIAL_OWNER_PASSWORD nie sú nastavené — majiteľ nevytvorený."
      );
    }
  } finally {
    await conn.end();
  }
}

main()
  .then(() => {
    console.log("✅ Seed dokončený.");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seed zlyhal:", e);
    process.exit(1);
  });
