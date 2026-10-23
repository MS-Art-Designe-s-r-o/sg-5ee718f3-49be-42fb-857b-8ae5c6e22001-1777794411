// Bezpečné vykreslenie markdownu blogu do React elementov (žiadne dangerouslySetInnerHTML).
// Podpora: ## / ### nadpisy, odstavce, zoznamy (-, *, 1.), citácie (>), tabuľky (|), **tučné**, *kurzíva*, [odkaz](url).
// Staré príspevky vo formáte "text" sa vykreslia ako odstavce.
import { Fragment, type ReactNode } from "react";
import Link from "next/link";

export type TocItem = { id: string; text: string; level: 2 | 3 };

export function headingId(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "sekcia"
  );
}

const SAFE_HREF = /^(https?:\/\/|\/|#|tel:|mailto:)/i;

function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[2]) out.push(<strong key={k}>{inline(m[2], k)}</strong>);
    else if (m[3]) out.push(<em key={k}>{inline(m[3], k)}</em>);
    else if (m[4] && m[5]) {
      const href = m[5];
      if (!SAFE_HREF.test(href)) out.push(m[4]);
      else if (href.startsWith("/") || href.startsWith("#")) out.push(<Link key={k} href={href} className="text-primary font-medium underline underline-offset-2 hover:no-underline">{m[4]}</Link>);
      else
        out.push(
          <a key={k} href={href} className="text-primary font-medium underline underline-offset-2 hover:no-underline" {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {m[4]}
          </a>
        );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block =
  | { t: "h"; level: 2 | 3; text: string; id: string }
  | { t: "p"; lines: string[] }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "quote"; lines: string[] }
  | { t: "table"; head: string[]; rows: string[][] };

const cells = (l: string) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

export function parseBlocks(md: string, format: "markdown" | "text" = "markdown", title?: string): Block[] {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  if (format === "text") {
    return md
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => ({ t: "p", lines: p.split("\n") }) as Block);
  }
  const blocks: Block[] = [];
  const used = new Set<string>();
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ t: "p", lines: para });
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    let m: RegExpMatchArray | null;
    if (!l) { flush(); continue; }
    if ((m = l.match(/^(#{1,4})\s+(.*)$/))) {
      flush();
      const text = m[2].replace(/\s+#+$/, "");
      if (m[1].length === 1 && title && text.trim().toLowerCase() === title.trim().toLowerCase()) continue; // duplicitný H1
      const level = m[1].length <= 2 ? 2 : 3;
      let id = headingId(text);
      while (used.has(id)) id += "-2";
      used.add(id);
      blocks.push({ t: "h", level, text, id });
      continue;
    }
    if (/^[-*•]\s+/.test(l) || /^\d+[.)]\s+/.test(l)) {
      flush();
      const ordered = /^\d+[.)]\s+/.test(l);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*•]\s+/).test(lines[i])) {
        items.push(lines[i].trim().replace(ordered ? /^\d+[.)]\s+/ : /^[-*•]\s+/, ""));
        i++;
      }
      i--;
      blocks.push({ t: ordered ? "ol" : "ul", items });
      continue;
    }
    if (l.startsWith(">")) {
      flush();
      const q: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) { q.push(lines[i].trim().replace(/^>\s?/, "")); i++; }
      i--;
      blocks.push({ t: "quote", lines: q });
      continue;
    }
    if (l.startsWith("|") && i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1].trim())) {
      flush();
      const head = cells(l);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(cells(lines[i].trim())); i++; }
      i--;
      blocks.push({ t: "table", head, rows });
      continue;
    }
    para.push(l);
  }
  flush();
  return blocks;
}

export function tocFrom(blocks: Block[]): TocItem[] {
  return blocks.filter((b): b is Extract<Block, { t: "h" }> => b.t === "h").map((b) => ({ id: b.id, text: b.text, level: b.level }));
}

export function plainText(md: string): string {
  return md.replace(/[#>*_`|[\]()-]/g, " ");
}

export function readingMinutes(md: string): number {
  const words = plainText(md).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function MarkdownBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        const k = `b${i}`;
        switch (b.t) {
          case "h":
            return b.level === 2 ? (
              <h2 key={k} id={b.id} className="scroll-mt-28 font-display font-bold text-2xl sm:text-3xl text-[#282462] dark:text-white mt-12 mb-4">{inline(b.text, k)}</h2>
            ) : (
              <h3 key={k} id={b.id} className="scroll-mt-28 font-display font-semibold text-xl sm:text-2xl text-[#282462] dark:text-white mt-8 mb-3">{inline(b.text, k)}</h3>
            );
          case "p":
            return (
              <p key={k} className="mb-5 leading-relaxed text-lg text-foreground/85">
                {b.lines.map((line, j) => (
                  <Fragment key={j}>
                    {inline(line, `${k}-${j}`)}
                    {j < b.lines.length - 1 && <br />}
                  </Fragment>
                ))}
              </p>
            );
          case "ul":
          case "ol": {
            const Tag = b.t;
            return (
              <Tag key={k} className={`mb-6 pl-6 space-y-2 text-lg text-foreground/85 ${b.t === "ul" ? "list-disc marker:text-accent" : "list-decimal marker:text-primary marker:font-semibold"}`}>
                {b.items.map((it, j) => <li key={j} className="pl-1 leading-relaxed">{inline(it, `${k}-${j}`)}</li>)}
              </Tag>
            );
          }
          case "quote":
            return (
              <blockquote key={k} className="my-6 border-l-4 border-accent bg-accent/10 rounded-r-lg px-5 py-4 text-lg text-foreground/90">
                {b.lines.map((line, j) => <p key={j} className="mb-1 last:mb-0">{inline(line, `${k}-${j}`)}</p>)}
              </blockquote>
            );
          case "table":
            return (
              <div key={k} className="my-6 overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-base">
                  <thead className="bg-[#282462] text-white">
                    <tr>{b.head.map((h, j) => <th key={j} className="px-4 py-3 font-semibold">{inline(h, `${k}-h${j}`)}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-t border-border even:bg-muted/40">
                        {r.map((c, x) => <td key={x} className="px-4 py-3">{inline(c, `${k}-${j}-${x}`)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}
