// Priama dátová vrstva cez mysql2 (bez Prisma query engine).
// Dôvod: Prisma Rust engine na zdieľanom hostingu (nízky NPROC) padal na
// "PANIC: timer has gone away". mysql2 je čistý JS driver — žiadne natívne
// vlákna, stabilné aj pod prísnym procesným limitom.
//
// Prisma sa naďalej používa IBA na migrácie schémy (prisma migrate deploy),
// nie za behu aplikácie.
import mysql from "mysql2/promise";

/** Prípustné typy SQL parametrov (náhrada za any[] v dopytoch). */
export type SqlParam = string | number | boolean | Date | null | undefined;

export type Role = "MAJITEL" | "DISPECER" | "VODIC";
export type TypSmeny = "DENNA" | "NOCNA" | "VOLNO" | "H24";
export type DruhPohonu = "ELEKTRO" | "HYBRID" | "BENZIN" | "DIESEL" | "LPG" | "CNG";

const globalForDb = globalThis as unknown as { etaxiPool?: mysql.Pool };

export function getPool(): mysql.Pool {
  if (globalForDb.etaxiPool) return globalForDb.etaxiPool;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL nie je nastavený.");

  const u = new URL(url);
  const pool = mysql.createPool({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
    connectionLimit: 5,
    waitForConnections: true,
    // queueLimit obmedzený, aby požiadavka radšej zlyhala než visela donekonečna,
    // ak by spojenia nedokázali vzniknúť (napr. zaseknuté spojenia po páde appky).
    queueLimit: 30,
    connectTimeout: 10000, // 10 s na nadviazanie spojenia, potom chyba (nie hang)
    idleTimeout: 30000, // zavri nečinné spojenia po 30 s
    maxIdle: 2,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    decimalNumbers: true, // DECIMAL -> number (nie string)
    dateStrings: true, // DATE/DATETIME -> string (bez posunov časových pásiem)
    charset: "utf8mb4",
  });
  globalForDb.etaxiPool = pool;
  return pool;
}

/** SELECT vracajúci pole riadkov. */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: SqlParam[] = []
): Promise<T[]> {
  const [rows] = await getPool().query(sql, params);
  return rows as T[];
}

/**
 * Ako query(), ale pri chybe vráti prázdne pole namiesto vyhodenia výnimky.
 * Použitie: doplnkové čítania (napr. stavy výskytov výdavkov), ktoré nesmú
 * zhodiť stránku, ak príslušná tabuľka/stĺpec ešte neexistuje (pred migráciou).
 */
export async function querySafe<T = Record<string, unknown>>(
  sql: string,
  params: SqlParam[] = []
): Promise<T[]> {
  try {
    return await query<T>(sql, params);
  } catch (e) {
    console.error("querySafe: dopyt zlyhal, vraciam []:", e instanceof Error ? e.message : e);
    return [];
  }
}

/** SELECT vracajúci prvý riadok alebo null. */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: SqlParam[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length ? rows[0] : null;
}

/** INSERT/UPDATE/DELETE — vracia hlavičku výsledku (insertId, affectedRows). */
export async function execute(
  sql: string,
  params: SqlParam[] = []
): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute(sql, params);
  return result as mysql.ResultSetHeader;
}

/** Transakcia — callback dostane spojenie s query/execute helpermi. */
export async function withTransaction<T>(
  fn: (tx: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

/** Prevedie 0/1 z MySQL na boolean. */
export function toBool(v: unknown): boolean {
  return v === 1 || v === true || v === "1";
}

// ── Zdieľané dopyty ────────────────────────────────────────────────────────────

export type UserRow = {
  id: number;
  email: string;
  passwordHash: string | null;
  meno: string;
  priezvisko: string;
  telefon: string | null;
  volaciZnak: string | null;
  aktivny: number;
  mustSetPassword: number;
  registracnyPoplatokUhradeny: number;
  registracnyPoplatokDna: string | null;
};

/** Načíta používateľa aj s rolami (pole). */
export async function getUserWithRoles(
  id: number
): Promise<(UserRow & { roles: Role[] }) | null> {
  const user = await queryOne<UserRow>("SELECT * FROM `User` WHERE `id` = ?", [id]);
  if (!user) return null;
  const roleRows = await query<{ role: Role }>(
    "SELECT `role` FROM `UserRole` WHERE `userId` = ?",
    [id]
  );
  return { ...user, roles: roleRows.map((r) => r.role) };
}

export async function getUserRoles(userId: number): Promise<Role[]> {
  const rows = await query<{ role: Role }>(
    "SELECT `role` FROM `UserRole` WHERE `userId` = ?",
    [userId]
  );
  return rows.map((r) => r.role);
}

// ── Typy riadkov modulu zmlúv (tabuľky z migrácie 0009) ────────────────────────
// DATE/DATETIME prichádzajú ako reťazce (dateStrings), DECIMAL ako number.

export type DriverStav = "AKTIVNY" | "POZASTAVENY" | "UKONCENY";
export type DriverRezim = "VO_FLOTILE" | "VLASTNA_KONCESIA";
export type StranaTyp = "FYZICKA_OSOBA" | "PRAVNICKA_OSOBA";

export type CompanyProfileRow = {
  id: number;
  obchodneMeno: string;
  ico: string | null;
  dic: string | null;
  icDph: string | null;
  sidlo: string | null;
  zapisanyV: string | null;
  statutar: string | null;
  statutarFunkcia: string | null;
  iban: string | null;
  email: string | null;
  telefon: string | null;
  web: string | null;
  updatedAt: string;
};

export type FleetRow = {
  id: number;
  obchodneMeno: string;
  ico: string | null;
  dic: string | null;
  icDph: string | null;
  sidlo: string | null;
  zapisanyV: string | null;
  statutar: string | null;
  cisloKoncesie: string | null;
  iban: string | null;
  kontaktMeno: string | null;
  kontaktTelefon: string | null;
  kontaktEmail: string | null;
  poznamka: string | null;
  aktivna: number;
  createdAt: string;
  updatedAt: string;
};

export type DriverProfileRow = {
  userId: number;
  titulPred: string | null;
  titulZa: string | null;
  datumNarodenia: string | null;
  rodneCisloEnc: string | null;
  rodneCisloBidx: string | null;
  cisloOpEnc: string | null;
  trvalyPobyt: string | null;
  cisloVp: string | null;
  cisloPvt: string | null;
  pvtPlatnostDo: string | null;
  iban: string | null;
  stav: DriverStav;
  fleetId: number | null;
  rezim: DriverRezim | null;
  stranaTyp: StranaTyp | null;
  firmaObchodneMeno: string | null;
  firmaIco: string | null;
  firmaDic: string | null;
  firmaIcDph: string | null;
  firmaSidlo: string | null;
  firmaZapisanyV: string | null;
  cisloKoncesie: string | null;
  koncesiaPlatnostDo: string | null;
  firmaStatutar: string | null;
  anonymizedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuditLogRow = {
  /** BIGINT — mysql2 ho vracia ako number (resp. string pri veľmi veľkých hodnotách). */
  id: number | string;
  at: string;
  userId: number | null;
  action: string;
  entity: string;
  entityId: number | null;
  ip: string | null;
  /** JSON stĺpec — mysql2 ho vracia rozparsovaný (MariaDB: LONGTEXT => string). */
  meta: unknown;
};

// ── Typy riadkov zmlúv (tabuľky z migrácie 0011) ───────────────────────────────

export type TypZmluvy = "NAJOM" | "DISPECING";
export type NajomneJednotka = "ZMENA" | "DEN" | "TYZDEN" | "MESIAC";
export type StavZmluvy = "NAVRH" | "VYGENEROVANA" | "PODPISANA" | "UKONCENA" | "NAHRADENA";

export type ContractTemplateRow = {
  id: number;
  typ: TypZmluvy;
  nazov: string;
  verzia: number;
  suborPath: string;
  sha256: string;
  platnaOd: string;
  aktivna: number;
  /** Generovaný stĺpec IF(aktivna, typ, NULL) — len na čítanie. */
  aktivnaTyp: TypZmluvy | null;
  /** JSON stĺpec — mysql2 ho vracia rozparsovaný (MariaDB: LONGTEXT => string). */
  tagy: unknown;
  createdById: number | null;
  createdAt: string;
};

export type ContractRow = {
  id: number;
  cislo: string;
  verzia: number;
  nahradzaId: number | null;
  typ: TypZmluvy;
  driverId: number;
  fleetId: number | null;
  vehicleId: number | null;
  templateId: number;
  datumUzavretia: string;
  platnostOd: string;
  platnostDo: string | null;
  najomneSuma: number | null;
  najomneJednotka: NajomneJednotka;
  najomne24h: number | null;
  kaucia: number | null;
  spoluucast: number | null;
  stavKmOdovzdanie: number | null;
  provizia: number | null;
  poplatokRegistracny: number | null;
  stav: StavZmluvy;
  podpisanaDna: string | null;
  ukoncenaDna: string | null;
  docxPath: string;
  pdfPath: string | null;
  snapshotEnc: string;
  snapshotSha256: string;
  onedriveItemId: string | null;
  onedriveSyncedAt: string | null;
  onedriveError: string | null;
  createdById: number | null;
  createdAt: string;
  updatedAt: string;
};
