// Render DOCX zo šablóny (docxtemplater + pizzip) a kontrola značiek šablóny.
//
// Chyby šablóny sa prekladajú na PublicError so zoznamom NÁZVOV značiek a typov
// chýb (zo šablóny) — nikdy nie hodnôt z dát.
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { PublicError } from "@/lib/safeLog";
import { scopeParser } from "./parser";
import { resolveTagKey } from "./tagCatalog";

/** Chyba šablóny s krátkym zoznamom problémov („unclosed_tag: firma.nazov“). */
export class TemplateError extends PublicError {
  readonly chyby: string[];
  constructor(message: string, chyby: string[], status = 400) {
    super(message, status);
    this.name = "TemplateError";
    this.chyby = chyby;
  }
}

const MAX_ERRORS = 20;

/** Bezpečný krátky text zo šablóny (názov značky / id chyby). */
function clean(v: unknown, max = 60): string {
  return String(v ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

type DxtErrorLike = {
  name?: string;
  properties?: { id?: string; xtag?: string; errors?: DxtErrorLike[]; explanation?: string };
};

/** Zoznam „id: značka“ z chyby docxtemplater (aj multi_error). */
export function describeTemplateErrors(err: unknown): string[] {
  const e = err as DxtErrorLike | null;
  const list = e?.properties?.errors?.length ? e.properties.errors : e ? [e] : [];
  const out: string[] = [];
  for (const x of list) {
    const id = clean(x?.properties?.id, 50) || "neznama_chyba";
    const tag = clean(x?.properties?.xtag);
    const item = tag ? `${id}: ${tag}` : id;
    if (!out.includes(item)) out.push(item);
    if (out.length >= MAX_ERRORS) break;
  }
  return out.length ? out : ["neznama_chyba"];
}

function loadZip(buf: Buffer): PizZip {
  try {
    return new PizZip(buf);
  } catch {
    throw new PublicError("Súbor nie je platný DOCX (ZIP) dokument.", 400);
  }
}

function compile(buf: Buffer, status: number): Docxtemplater {
  const zip = loadZip(buf);
  try {
    return new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      parser: scopeParser,
      nullGetter: () => "",
      // Vlastné logovanie docxtemplater vypisuje celé chyby (pri renderi aj rozsah
      // s dátami = osobné údaje) — vypnuté; chyby prekladáme sami bez hodnôt.
      errorLogging: false,
    });
  } catch (e) {
    const chyby = describeTemplateErrors(e);
    throw new TemplateError(`Šablóna obsahuje chyby: ${chyby.join("; ")}`, chyby, status);
  }
}

/** Vyrenderuje DOCX zo šablóny a dát (výsledok ako Buffer). */
export function renderDocx(templateBuffer: Buffer, data: Record<string, unknown>): Buffer {
  const doc = compile(templateBuffer, 422);
  try {
    doc.render(data);
  } catch (e) {
    const chyby = describeTemplateErrors(e);
    throw new TemplateError(`Dokument sa nepodarilo vytvoriť zo šablóny: ${chyby.join("; ")}`, chyby, 422);
  }
  return doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" }) as Buffer;
}

type Part = {
  type?: string;
  value?: string;
  module?: string;
  inverted?: boolean;
  subparsed?: Part[];
};

export type TemplateInspection = {
  /** Značky šablóny: známe ako kľúč katalógu, neznáme v pôvodnom zápise. */
  tagy: string[];
  /** Značky, ktoré katalóg nepozná (aj zápis {@raw}). */
  neznameTagy: string[];
  /** Chyby kompilácie (šablónu nemožno použiť). */
  chyby?: string[];
};

/**
 * Skompiluje šablónu a vráti zoznam jej značiek porovnaný s katalógom.
 * Podporuje bloky {#x}, inverzné {^x} aj skrátený zápis vnútri bloku objektu.
 * Neplatný ZIP → PublicError 400; chyby šablóny sa vracajú v `chyby`.
 */
export function inspectTemplate(buffer: Buffer): TemplateInspection {
  let doc: Docxtemplater;
  try {
    doc = compile(buffer, 400);
  } catch (e) {
    if (e instanceof TemplateError) return { tagy: [], neznameTagy: [], chyby: e.chyby };
    throw e;
  }

  const tagy = new Set<string>();
  const nezname = new Set<string>();

  const walk = (parts: Part[] | undefined, enclosing: string[]) => {
    for (const p of parts ?? []) {
      if (p.type !== "placeholder") continue;
      const raw = clean(p.value, 100);
      if (p.module === "rawxml") {
        nezname.add(`@${raw}`);
        tagy.add(`@${raw}`);
        continue;
      }
      const key = resolveTagKey(raw, enclosing);
      if (key) tagy.add(key);
      else {
        nezname.add(raw);
        tagy.add(raw);
      }
      if (p.subparsed) walk(p.subparsed, [...enclosing, key ?? raw]);
    }
  };

  const compiled = (doc as unknown as { compiled: Record<string, { postparsed?: Part[] }> }).compiled ?? {};
  for (const file of Object.keys(compiled)) walk(compiled[file]?.postparsed, []);

  return { tagy: [...tagy].sort(), neznameTagy: [...nezname].sort() };
}
