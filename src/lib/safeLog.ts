// Bezpečné logovanie chýb (GDPR): do logu nikdy nejdú osobné údaje.
//
// mysql2 dáva hodnoty priamo do textu chyby (napr. „Duplicate entry '…' for key …")
// a k chybe pribaľuje aj celý SQL dopyt (`sql`) — preto pri DB chybách logujeme
// len kódy (code, errno, sqlState), nikdy message ani sql. Nelogujeme ani `cause`
// a z call stacku berieme len riadky s rámcami („at …"), nie text správy.

/**
 * Chyba s pevným, verejne zobraziteľným textom (bez hodnôt z požiadavky).
 * withErrorHandler jej text a status pošle klientovi; ostatné chyby → generická 500.
 */
export class PublicError extends Error {
  readonly status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "PublicError";
    this.status = status;
  }
}

const MAX_MESSAGE = 200;
const MAX_STACK_FRAMES = 3;

function isDbError(e: Record<string, unknown>): boolean {
  if ("sql" in e || "sqlMessage" in e || "sqlState" in e) return true;
  // Chybové kódy MySQL/MariaDB (ER_DUP_ENTRY, ER_NO_SUCH_TABLE, …).
  return typeof e.code === "string" && e.code.startsWith("ER_");
}

function safeToken(v: unknown): string | null {
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  // Kódy sú krátke identifikátory — nič iné (pre istotu) nepustíme.
  if (typeof v === "string" && /^[A-Za-z0-9_.-]{1,40}$/.test(v)) return v;
  return null;
}

/**
 * Vráti krátky, bezpečný popis chyby vhodný do logu (bez osobných údajov).
 * `withMessage: false` vynechá text správy aj pri iných než DB chybách
 * (napr. SMTP chyby, ktoré v texte uvádzajú e-mailové adresy príjemcov).
 */
export function describeError(err: unknown, opts: { withMessage?: boolean } = {}): string {
  if (err === null || err === undefined) return "neznáma chyba";
  if (typeof err !== "object") return `nechybová hodnota (${typeof err})`;

  const e = err as Record<string, unknown>;
  const parts: string[] = [];

  const name = safeToken(e.name) ?? (err instanceof Error ? "Error" : "Object");
  parts.push(name);
  for (const key of ["code", "errno", "sqlState"] as const) {
    const v = safeToken(e[key]);
    if (v !== null) parts.push(`${key}=${v}`);
  }

  if (opts.withMessage !== false && !isDbError(e) && typeof e.message === "string" && e.message) {
    const msg = e.message.replace(/\s+/g, " ").trim();
    parts.push(`message="${msg.length > MAX_MESSAGE ? msg.slice(0, MAX_MESSAGE) + "…" : msg}"`);
  }

  // Len rámce zásobníka („at …"), nie prvý riadok so správou (môže byť viacriadkový).
  if (typeof e.stack === "string") {
    const frames = e.stack
      .split("\n")
      .filter((l) => /^\s+at\s/.test(l))
      .slice(0, MAX_STACK_FRAMES)
      .map((l) => l.trim());
    if (frames.length) parts.push(`| ${frames.join(" | ")}`);
  }

  return parts.join(" ");
}

/** console.error s bezpečným popisom chyby. */
export function logError(context: string, err: unknown): void {
  console.error(`${context}: ${describeError(err)}`);
}
