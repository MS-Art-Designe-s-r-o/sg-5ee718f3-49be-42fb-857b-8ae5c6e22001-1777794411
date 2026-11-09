// Prevod DOCX → PDF cez vymeniteľné rozhranie (fáza 1 = len DOCX).
//
// PDF_CONVERTER=none (default) → PDF nie je dostupné.
// PDF_CONVERTER=gotenberg      → HTTP POST na Gotenberg (GOTENBERG_URL, voliteľne
//                                 basic auth GOTENBERG_USER / GOTENBERG_PASS).
// LibreOffice priamo na serveri sa nepoužíva. Chyby neobsahujú obsah dokumentu
// ani odpoveď služby (mohli by obsahovať osobné údaje).
import { PublicError } from "@/lib/safeLog";

export interface PdfConverter {
  readonly available: boolean;
  convert(docx: Buffer): Promise<Buffer>;
}

export const MSG_PDF_UNAVAILABLE = "PDF nie je na serveri dostupné";

export class NoneConverter implements PdfConverter {
  readonly available = false;
  async convert(): Promise<Buffer> {
    throw new PublicError(MSG_PDF_UNAVAILABLE, 501);
  }
}

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

export type GotenbergOptions = {
  url: string;
  user?: string | null;
  pass?: string | null;
  timeoutMs?: number;
  /** Injektovateľný fetch (testy). */
  fetchImpl?: FetchLike;
};

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export class GotenbergConverter implements PdfConverter {
  readonly available = true;
  private readonly endpoint: string;
  private readonly auth: string | null;
  private readonly timeoutMs: number;
  private readonly fetchImpl: FetchLike;

  constructor(opts: GotenbergOptions) {
    const base = String(opts.url ?? "").trim().replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(base)) throw new PublicError("Neplatná adresa služby na prevod do PDF.");
    this.endpoint = `${base}/forms/libreoffice/convert`;
    this.auth = opts.user ? `Basic ${Buffer.from(`${opts.user}:${opts.pass ?? ""}`, "utf8").toString("base64")}` : null;
    this.timeoutMs = opts.timeoutMs ?? 30_000;
    this.fetchImpl = opts.fetchImpl ?? ((input, init) => fetch(input, init));
  }

  async convert(docx: Buffer): Promise<Buffer> {
    const form = new FormData();
    form.append("files", new Blob([new Uint8Array(docx)], { type: DOCX_MIME }), "zmluva.docx");
    const headers: Record<string, string> = {};
    if (this.auth) headers.Authorization = this.auth;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    let res: Response;
    try {
      res = await this.fetchImpl(this.endpoint, { method: "POST", body: form, headers, signal: ctrl.signal });
    } catch {
      if (ctrl.signal.aborted) throw new PublicError("Prevod do PDF trval príliš dlho.", 504);
      throw new PublicError("Služba na prevod do PDF nie je dostupná.", 502);
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) throw new PublicError(`Prevod do PDF zlyhal (HTTP ${res.status}).`, 502);
    const out = Buffer.from(await res.arrayBuffer());
    if (out.subarray(0, 5).toString("latin1") !== "%PDF-") {
      throw new PublicError("Služba na prevod do PDF vrátila neplatný súbor.", 502);
    }
    return out;
  }
}

/** Converter podľa env (PDF_CONVERTER=none|gotenberg, default none). */
export function getPdfConverter(
  env: Record<string, string | undefined> = process.env,
  fetchImpl?: FetchLike
): PdfConverter {
  const kind = (env.PDF_CONVERTER ?? "none").trim().toLowerCase();
  if (kind === "gotenberg") {
    const url = (env.GOTENBERG_URL ?? "").trim();
    if (!url) return new NoneConverter();
    return new GotenbergConverter({
      url,
      user: env.GOTENBERG_USER || null,
      pass: env.GOTENBERG_PASS || null,
      fetchImpl,
    });
  }
  return new NoneConverter();
}
