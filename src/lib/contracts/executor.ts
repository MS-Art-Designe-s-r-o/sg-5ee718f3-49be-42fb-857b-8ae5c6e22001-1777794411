// Injektovateľný prístup k DB pre modul zmlúv (testy podstrčia falošný executor).
//
// `poolExecutor` ide cez spoločný pool (src/lib/db.ts), `connExecutor(conn)` cez
// konkrétne spojenie z withTransaction — nutné tam, kde záleží na tom istom
// spojení (transakcia, LAST_INSERT_ID()).
import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { execute, query, type SqlParam } from "@/lib/db";

export type ExecResult = { insertId: number; affectedRows: number };

export type Executor = {
  query<T = Record<string, unknown>>(sql: string, params?: SqlParam[]): Promise<T[]>;
  execute(sql: string, params?: SqlParam[]): Promise<ExecResult>;
};

export const poolExecutor: Executor = {
  query: <T>(sql: string, params: SqlParam[] = []) => query<T>(sql, params),
  execute: async (sql: string, params: SqlParam[] = []) => {
    const r = await execute(sql, params);
    return { insertId: r.insertId, affectedRows: r.affectedRows };
  },
};

/** Executor nad konkrétnym spojením (napr. `tx` z withTransaction). */
export function connExecutor(conn: PoolConnection): Executor {
  return {
    query: async <T>(sql: string, params: SqlParam[] = []) => {
      const [rows] = await conn.query(sql, params);
      return rows as T[];
    },
    execute: async (sql: string, params: SqlParam[] = []) => {
      const [r] = await conn.execute(sql, params);
      const h = r as ResultSetHeader;
      return { insertId: h.insertId, affectedRows: h.affectedRows };
    },
  };
}

/** Prvý riadok alebo null. */
export async function queryFirst<T>(ex: Executor, sql: string, params: SqlParam[] = []): Promise<T | null> {
  const rows = await ex.query<T>(sql, params);
  return rows.length ? rows[0] : null;
}
