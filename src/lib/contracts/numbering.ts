// Číslovanie zmlúv: NZ-RRRR-NNN (nájom) / DS-RRRR-NNN (dispečing).
//
// Poradové číslo sa prideľuje cez ContractSequence a LAST_INSERT_ID(expr):
// INSERT … ON DUPLICATE KEY UPDATE posledne = LAST_INSERT_ID(posledne + 1)
// je atomický (zámok riadku), a SELECT LAST_INSERT_ID() vráti hodnotu nastavenú
// na TOM ISTOM spojení — preto sa volá s executorom nad spojením transakcie.
// Funguje rovnako v MySQL 5.7+/8 aj MariaDB 10.x.
import { PublicError } from "@/lib/safeLog";
import type { TypZmluvy } from "@/lib/db";
import type { Executor } from "./executor";

export const CONTRACT_PREFIX: Record<TypZmluvy, string> = { NAJOM: "NZ", DISPECING: "DS" };

const PREFIX_RE = /^[A-Z]{1,4}$/;

function checkArgs(prefix: string, year: number) {
  if (!PREFIX_RE.test(prefix)) throw new PublicError("Neplatný prefix čísla zmluvy.");
  if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new PublicError("Neplatný rok čísla zmluvy.");
}

/** „NZ-2026-001“; poradie pod 1000 má 3 číslice, vyššie sa predĺži („NZ-2026-1000“). */
export function formatContractNumber(prefix: string, year: number, n: number): string {
  checkArgs(prefix, year);
  if (!Number.isInteger(n) || n < 1) throw new PublicError("Neplatné poradové číslo zmluvy.");
  return `${prefix}-${year}-${String(n).padStart(3, "0")}`;
}

export const SQL_ALLOCATE =
  "INSERT INTO `ContractSequence` (`prefix`, `rok`, `posledne`) VALUES (?, ?, LAST_INSERT_ID(1)) " +
  "ON DUPLICATE KEY UPDATE `posledne` = LAST_INSERT_ID(`posledne` + 1)";
export const SQL_LAST_ID = "SELECT LAST_INSERT_ID() AS `n`";

/**
 * Pridelí ďalšie číslo zmluvy. `tx` MUSÍ byť executor nad spojením transakcie
 * (connExecutor(conn) z withTransaction), nie pool.
 */
export async function allocateContractNumber(
  tx: Executor,
  prefix: string,
  year: number
): Promise<{ cislo: string; poradie: number }> {
  checkArgs(prefix, year);
  await tx.execute(SQL_ALLOCATE, [prefix, year]);
  const rows = await tx.query<{ n: number | string }>(SQL_LAST_ID);
  const n = Number(rows[0]?.n);
  if (!Number.isInteger(n) || n < 1) throw new PublicError("Nepodarilo sa prideliť číslo zmluvy.");
  return { cislo: formatContractNumber(prefix, year, n), poradie: n };
}
