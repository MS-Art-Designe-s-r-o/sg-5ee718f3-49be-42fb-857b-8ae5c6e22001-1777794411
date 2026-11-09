// Výroba ukážkových šablón so značkami z dvoch vzorových zmlúv (DOCX).
//
// Spustenie (z koreňa projektu):
//   npx tsx scripts/make-sample-templates.ts --najom <vzor-najom.docx> --dispecing <vzor-dispecing.docx> [--out tests/fixtures]
// Výstup: <out>/sablona-najom.docx a <out>/sablona-dispecing.docx
//
// Postup: z word/document.xml sa identifikujú odstavce podľa textu a ich text sa
// nahradí značkami (zachová sa pPr odstavca a rPr prvého runu, ostatné runy sa
// zrušia). Ostatné odstavce (články, ustanovenia) sa nemenia. Vzory obsahujú
// vzorové osobné údaje — do repozitára sa NEUKLADAJÚ; výsledné šablóny sa na
// konci kontrolujú, že žiadne z nich neobsahujú.
//
// Skript nevypisuje obsah vzorov — len čísla odstavcov a zoznam úprav.
import { promises as fs } from "node:fs";
import path from "node:path";
import PizZip from "pizzip";
import { inspectTemplate } from "../src/lib/contracts/render";

// ── XML pomôcky ───────────────────────────────────────────────────────────────

const PARA_RE = /<w:p(?: [^>]*)?>[\s\S]*?<\/w:p>/g;

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const unesc = (t: string) =>
  t
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

/** Text odstavca (w:t zlúčené, tabulátor = \t, zalomenie = \n). */
function paraText(p: string): string {
  return (p.match(/<w:t(?: [^>]*)?>[^<]*<\/w:t>|<w:tab\/>|<w:br\/>/g) ?? [])
    .map((x) => (x === "<w:tab/>" ? "\t" : x === "<w:br/>" ? "\n" : unesc(x.replace(/<[^>]+>/g, ""))))
    .join("");
}

const norm = (t: string) => t.replace(/\s+/g, " ").trim();

/**
 * Nový odstavec s textom `text` vo formáte odstavca `tpl` (pPr + rPr prvého runu).
 * `keepIds` = ponechať w14:paraId (len pri náhrade pôvodného odstavca).
 */
function buildPara(tpl: string, text: string, keepIds: boolean): string {
  let open = /^<w:p(?: [^>]*)?>/.exec(tpl)?.[0] ?? "<w:p>";
  if (!keepIds) open = open.replace(/\s+w14:(paraId|textId)="[^"]*"/g, "");
  const pPr = (/<w:pPr>[\s\S]*?<\/w:pPr>/.exec(tpl)?.[0] ?? "").replace(/<w:sectPr[\s\S]*?<\/w:sectPr>/g, "");
  const afterPPr = pPr ? tpl.slice(tpl.indexOf(pPr) + pPr.length) : tpl;
  const firstRun = /<w:r(?: [^>]*)?>([\s\S]*?)<\/w:r>/.exec(afterPPr)?.[1] ?? "";
  const rPr = (/^<w:rPr>[\s\S]*?<\/w:rPr>/.exec(firstRun)?.[0] ?? "").replace(/<w:strike\/>|<w:dstrike\/>/g, "");
  const runs: string[] = [];
  text.split("\t").forEach((seg, i) => {
    if (i > 0) runs.push(`<w:r>${rPr}<w:tab/></w:r>`);
    if (seg) runs.push(`<w:r>${rPr}<w:t xml:space="preserve">${esc(seg)}</w:t></w:r>`);
  });
  return `${open}${pPr}${runs.join("")}</w:p>`;
}

type Doc = { parts: string[]; paraIdx: number[] };

/** Rozdelí document.xml na úseky; paraIdx[i] = index úseku s i-tym odstavcom. */
function splitDoc(xml: string): Doc {
  if (/<w:txbxContent/.test(xml)) throw new Error("Vzor obsahuje textové polia — nepodporované.");
  const parts: string[] = [];
  const paraIdx: number[] = [];
  let last = 0;
  for (const m of xml.matchAll(PARA_RE)) {
    parts.push(xml.slice(last, m.index));
    paraIdx.push(parts.length);
    parts.push(m[0]);
    last = (m.index ?? 0) + m[0].length;
  }
  parts.push(xml.slice(last));
  return { parts, paraIdx };
}

class Editor {
  private doc: Doc;
  private texts: string[];
  /** Úpravy podľa indexu úseku: vložené pred, náhrada, vložené za. */
  private before = new Map<number, string>();
  private main = new Map<number, string>();
  private after = new Map<number, string>();
  readonly log: string[] = [];
  readonly nenajdene: string[] = [];

  constructor(xml: string) {
    this.doc = splitDoc(xml);
    this.texts = this.doc.paraIdx.map((i) => paraText(this.doc.parts[i]));
  }

  /** Index odstavca podľa predikátu nad normalizovaným textom (od `from`). */
  find(pred: (t: string) => boolean, from = 0): number {
    if (from < 0) return -1;
    for (let i = from; i < this.texts.length; i++) if (pred(norm(this.texts[i]))) return i;
    return -1;
  }

  private para(i: number): string {
    return this.doc.parts[this.doc.paraIdx[i]];
  }

  private build(i: number, lines: string[], fmtFrom: number | undefined, keepFirstIds: boolean): string {
    const tpl = this.para(fmtFrom ?? i);
    return lines.map((l, k) => buildPara(tpl, l, keepFirstIds && k === 0 && fmtFrom === undefined)).join("");
  }

  /**
   * Nahradí odstavec `i` jedným alebo viacerými odstavcami (formát odstavca `i`,
   * resp. `fmtFrom`). Prázdne pole = odstránenie odstavca.
   */
  replace(i: number, lines: string[], popis: string, fmtFrom?: number) {
    if (i < 0) {
      this.nenajdene.push(popis);
      return;
    }
    const idx = this.doc.paraIdx[i];
    if (this.main.has(idx)) throw new Error(`Odstavec ${i} je už upravený (${popis})`);
    this.main.set(idx, this.build(i, lines, fmtFrom, true));
    this.log.push(`odstavec ${i}: ${popis}`);
  }

  /** Vloží odstavce ZA odstavec `i` vo formáte odstavca `fmtFrom` (default `i`). */
  insertAfter(i: number, lines: string[], popis: string, fmtFrom?: number) {
    if (i < 0) {
      this.nenajdene.push(popis);
      return;
    }
    const idx = this.doc.paraIdx[i];
    this.after.set(idx, (this.after.get(idx) ?? "") + this.build(i, lines, fmtFrom, false));
    this.log.push(`za odstavec ${i}: ${popis}`);
  }

  /** Vloží odstavce PRED odstavec `i` vo formáte odstavca `fmtFrom` (default `i`). */
  insertBefore(i: number, lines: string[], popis: string, fmtFrom?: number) {
    if (i < 0) {
      this.nenajdene.push(popis);
      return;
    }
    const idx = this.doc.paraIdx[i];
    this.before.set(idx, this.build(i, lines, fmtFrom, false) + (this.before.get(idx) ?? ""));
    this.log.push(`pred odstavec ${i}: ${popis}`);
  }

  /** Nahradí podreťazec v texte odstavca (odstavec sa zostaví nanovo). */
  replaceText(i: number, from: string, to: string, popis: string) {
    if (i < 0 || !this.texts[i].includes(from)) {
      this.nenajdene.push(popis);
      return;
    }
    this.replace(i, [this.texts[i].replace(from, to)], popis);
  }

  toXml(): string {
    return this.doc.parts
      .map((p, i) => (this.before.get(i) ?? "") + (this.main.get(i) ?? p) + (this.after.get(i) ?? ""))
      .join("");
  }
}

const starts = (prefix: string) => (t: string) => t.startsWith(prefix);

/** Podmienený blok v samostatných odstavcoch (paragraphLoop ich odstráni). */
const blok = (name: string, lines: string[]) => [`{#${name}}`, ...lines, `{/${name}}`];

// ── Nájomná zmluva ────────────────────────────────────────────────────────────

function editNajom(ed: Editor) {
  const title = ed.find(starts("uzatvorená podľa"));
  ed.insertAfter(title, ["Číslo zmluvy: {zmluva.cislo}"], "číslo zmluvy pod nadpis");

  // 1. Prenajímateľ
  const p1 = ed.find(starts("1. Prenajímateľ"));
  ed.replace(ed.find(starts("Obchodné meno:"), p1), ["Obchodné meno: {firma.nazov}"], "prenajímateľ – obchodné meno");
  ed.replace(ed.find(starts("Sídlo:"), p1), ["Sídlo: {firma.sidlo}"], "prenajímateľ – sídlo");
  ed.replace(ed.find(starts("IČO:"), p1), ["IČO: {firma.ico}    DIČ: {firma.dic}"], "prenajímateľ – IČO/DIČ");
  ed.replace(ed.find(starts("Zapísaná:"), p1), ["Zapísaná: {firma.zapisany_v}"], "prenajímateľ – zápis");
  ed.replace(
    ed.find(starts("Zastúpená:"), p1),
    ["Zastúpená: {firma.statutar}, {firma.statutar_funkcia}"],
    "prenajímateľ – štatutár"
  );
  ed.replace(ed.find(starts("Bankové spojenie"), p1), ["Bankové spojenie / IBAN: {firma.iban}"], "prenajímateľ – IBAN");

  // 2. Nájomca
  const p2 = ed.find(starts("2. Nájomca"));
  ed.replace(ed.find((t) => t.includes("nehodiace sa preškrtnite"), p2), [], "nájomca – odstránený pokyn na preškrtnutie");
  ed.replace(
    ed.find(starts("Meno a priezvisko"), p2),
    ["Meno a priezvisko / Obchodné meno: {strana.nazov}"],
    "nájomca – meno / obchodné meno"
  );
  ed.replace(ed.find(starts("Bytom / Sídlo"), p2), ["Bytom / Sídlo: {strana.sidlo}"], "nájomca – bydlisko / sídlo");
  ed.replace(
    ed.find(starts("Dátum narodenia"), p2),
    [
      "Dátum narodenia: {vodic.datum_narodenia}",
      ...blok("podnikatel", ["IČO: {strana.ico}   DIČ: {strana.dic}{#strana.ic_dph}   IČ DPH: {strana.ic_dph}{/strana.ic_dph}"]),
    ],
    "nájomca – dátum narodenia + podmienené IČO/DIČ/IČ DPH (vzorový dátum odstránený)"
  );
  ed.replace(
    ed.find(starts("Číslo koncesie"), p2),
    blok("koncesia", ["Číslo koncesie na taxislužbu: {strana.cislo_koncesie}"]),
    "nájomca – číslo koncesie len pri vlastnej koncesii"
  );
  ed.replace(
    ed.find(starts("Číslo OP"), p2),
    [
      "Číslo OP / dokladu totožnosti: {vodic.cislo_op}",
      ...blok("strana.zapisana_v", ["Zapísaný: {strana.zapisana_v}"]),
    ],
    "nájomca – číslo OP + podmienený zápis v registri"
  );
  ed.replace(
    ed.find(starts("Zastúpený"), p2),
    blok("pravnicka_osoba", ["Zastúpený: {strana.statutar}"]),
    "nájomca – štatutár len pri právnickej osobe"
  );
  ed.replace(ed.find(starts("Bankové spojenie"), p2), ["Bankové spojenie / IBAN: {vodic.iban}"], "nájomca – IBAN");
  const kontakt = ed.find(starts("Kontakt"), p2);
  ed.replace(kontakt, ["Kontakt (tel., e-mail): {vodic.telefon}, {vodic.email}"], "nájomca – kontakt");
  ed.insertAfter(
    kontakt,
    blok("flotila", [
      "Dopravca (flotila), pod ktorým Nájomca pôsobí: {flotila.nazov}, IČO {flotila.ico}, sídlo {flotila.sidlo}",
    ]),
    "nájomca – riadok flotily (len ak má vodič flotilu)"
  );

  // Vozidlo
  ed.replace(ed.find(starts("Značka a model")), ["Značka a model: {vozidlo.nazov}"], "vozidlo – značka a model");
  ed.replace(
    ed.find(starts("Evidenčné číslo")),
    ["Evidenčné číslo (ŠPZ): {vozidlo.ecv} VIN: {vozidlo.vin}"],
    "vozidlo – EČV a VIN"
  );
  ed.replace(ed.find(starts("Rok výroby")), ["Rok výroby: {vozidlo.rok_vyroby} Farba: {vozidlo.farba}"], "vozidlo – rok a farba");
  ed.replace(ed.find(starts("Typ pohonu")), ["Typ pohonu: {vozidlo.pohon}"], "vozidlo – typ pohonu (bez preškrtávania)");
  ed.replace(
    ed.find(starts("Stav tachometra")),
    ["Stav tachometra pri prvom prevzatí: {zmluva.stav_km_odovzdanie}"],
    "vozidlo – stav tachometra"
  );

  // Doba nájmu
  ed.replace(
    ed.find(starts("2.1 Táto zmluva sa uzatvára")),
    ["2.1 Táto zmluva sa uzatvára {zmluva.trvanie_text}."],
    "čl. 2.1 – doba trvania podľa zadania"
  );

  // Nájomné
  ed.replace(
    ed.find(starts("Nájomné za jednu zmenu")),
    [
      "Nájomné {zmluva.najomne_jednotka_text}: {zmluva.najomne} (slovom: {zmluva.najomne_slovom})",
      ...blok("zmluva.najomne_24h", ["Nájomné za 24-hodinovú zmenu: {zmluva.najomne_24h}"]),
    ],
    "nájomné + podmienené nájomné za 24 h"
  );
  ed.replace(
    ed.find(starts("Typ vozidla:")),
    ["Typ vozidla: {#je_elektricke}elektrické{/je_elektricke}{#je_spalovacie}spaľovacie{/je_spalovacie}"],
    "typ vozidla podľa pohonu (bez preškrtávania)"
  );

  // Depozit
  ed.replace(
    ed.find(starts("Výška depozitu")),
    ["Výška depozitu: {zmluva.kaucia} (slovom: {zmluva.kaucia_slovom})"],
    "depozit"
  );

  // Podpisy
  ed.replace(
    ed.find(starts("V Košiciach, dňa")),
    ["V {zmluva.miesto_podpisu}, dňa {zmluva.datum_uzavretia}"],
    "miesto a dátum podpisu"
  );
  const zaPren = ed.find(starts("Za Prenajímateľa"));
  ed.replace(ed.find(starts("meno, funkcia"), zaPren), ["{firma.statutar}, {firma.statutar_funkcia}"], "podpis prenajímateľa");
  const zaNaj = ed.find(starts("Nájomca:"), zaPren);
  ed.replace(
    ed.find(starts("meno, funkcia"), zaNaj),
    ["{strana.nazov}{#pravnicka_osoba}, {strana.statutar}{/pravnicka_osoba}"],
    "podpis nájomcu"
  );
}

// ── Zmluva o dispečerských službách ───────────────────────────────────────────

function editDispecing(ed: Editor) {
  const title = ed.find(starts("uzatvorená podľa"));
  ed.insertAfter(title, ["Číslo zmluvy: {zmluva.cislo}"], "číslo zmluvy pod nadpis");

  // 1. Prevádzkovateľ dispečingu
  const p1 = ed.find(starts("1. Prevádzkovateľ dispečingu"));
  ed.replace(ed.find(starts("Obchodné meno:"), p1), ["Obchodné meno: {firma.nazov}"], "prevádzkovateľ – obchodné meno");
  ed.replace(ed.find(starts("Sídlo:"), p1), ["Sídlo: {firma.sidlo}"], "prevádzkovateľ – sídlo");
  ed.replace(
    ed.find(starts("IČO:"), p1),
    ["IČO: {firma.ico}  DIČ: {firma.dic}{#firma.ic_dph}  IČ DPH: {firma.ic_dph}{/firma.ic_dph}"],
    "prevádzkovateľ – IČO/DIČ/IČ DPH"
  );
  ed.replace(ed.find(starts("Zapísaná:"), p1), ["Zapísaná: {firma.zapisany_v}"], "prevádzkovateľ – zápis");
  ed.replace(
    ed.find(starts("Zastúpená:"), p1),
    ["Zastúpená: {firma.statutar}, {firma.statutar_funkcia}"],
    "prevádzkovateľ – štatutár"
  );
  ed.replace(ed.find(starts("Bankové spojenie"), p1), ["Bankové spojenie / IBAN: {firma.iban}"], "prevádzkovateľ – IBAN");

  // 2. Dopravca — celý blok len pri flotile
  const p2 = ed.find(starts("2. Dopravca"));
  const p2end = ed.find(starts("(ďalej len „Dopravca"), p2);
  ed.insertBefore(p2, ["{#flotila}"], "začiatok bloku flotily (dopravca)");
  ed.replace(ed.find(starts("Obchodné meno:"), p2), ["Obchodné meno: {flotila.nazov}"], "dopravca – obchodné meno");
  ed.replace(ed.find(starts("Sídlo:"), p2), ["Sídlo: {flotila.sidlo}"], "dopravca – sídlo");
  ed.replace(
    ed.find(starts("IČO:"), p2),
    ["IČO: {flotila.ico}  DIČ: {flotila.dic}{#flotila.ic_dph}  IČ DPH: {flotila.ic_dph}{/flotila.ic_dph}"],
    "dopravca – IČO/DIČ/IČ DPH"
  );
  ed.replace(ed.find(starts("Zapísaná:"), p2), ["Zapísaná: {flotila.zapisana_v}"], "dopravca – zápis");
  ed.replace(ed.find(starts("Zastúpená:"), p2), ["Zastúpená: {flotila.statutar}"], "dopravca – štatutár");
  ed.replace(ed.find(starts("Bankové spojenie"), p2), ["Bankové spojenie / IBAN: {flotila.iban}"], "dopravca – IBAN");
  ed.replace(
    ed.find(starts("Číslo koncesie"), p2),
    ["Číslo koncesie na taxislužbu: {flotila.cislo_koncesie}"],
    "dopravca – číslo koncesie"
  );
  ed.insertAfter(p2end, ["{/flotila}"], "koniec bloku flotily (dopravca)");

  // 3. Partnerský vodič
  const p3 = ed.find(starts("3. Partnerský vodič"));
  ed.replace(ed.find(starts("Meno a Priezvisko"), p3), ["Meno a priezvisko: {vodic.cele_meno}"], "vodič – meno");
  ed.replace(ed.find(starts("Bytom:"), p3), ["Bytom: {vodic.adresa}"], "vodič – bydlisko");
  ed.replace(
    ed.find(starts("Dátum narodenia"), p3),
    ["Dátum narodenia: {vodic.datum_narodenia}  Číslo OP: {vodic.cislo_op}"],
    "vodič – dátum narodenia a OP"
  );
  ed.replace(ed.find(starts("Volací znak"), p3), ["Volací znak: {vodic.volaci_znak}"], "vodič – volací znak");
  const p3end = ed.find(starts("(ďalej len Partnerský vodič"), p3);
  const dataFmt = ed.find(starts("Volací znak"), p3);
  ed.insertAfter(
    p3end,
    [
      "{#koncesia}",
      "Údaje o vlastnej koncesii vodiča:",
      "Obchodné meno: {strana.nazov}",
      "Sídlo: {strana.sidlo}",
      "IČO: {strana.ico}  DIČ: {strana.dic}{#strana.ic_dph}  IČ DPH: {strana.ic_dph}{/strana.ic_dph}",
      "Číslo koncesie na taxislužbu: {strana.cislo_koncesie}",
      "{#pravnicka_osoba}",
      "Zastúpená: {strana.statutar}",
      "{/pravnicka_osoba}",
      "{/koncesia}",
    ],
    "blok údajov o vlastnej koncesii vodiča",
    dataFmt
  );

  // 4.1 a) registračný poplatok, b) provízia
  ed.replaceText(
    ed.find(starts("a) registračný poplatok")),
    "30,- EUR",
    "{zmluva.poplatok_registracny}",
    "4.1 a) registračný poplatok"
  );
  ed.replaceText(ed.find(starts("b) poplatok za dispečerské služby")), "15 %", "{zmluva.provizia}", "4.1 b) provízia");

  // Podpisy
  ed.replace(
    ed.find(starts("V Košiciach, dňa")),
    ["V {zmluva.miesto_podpisu}, dňa {zmluva.datum_uzavretia}"],
    "miesto a dátum podpisu"
  );
  const podpisy = ed.find(starts("Za Prevádzkovateľa dispečingu"));
  ed.replace(
    ed.find(starts("meno, funkcia"), podpisy),
    [
      "{firma.statutar}, {firma.statutar_funkcia}\t\t{#flotila}{flotila.statutar}{/flotila}{^flotila}{strana.nazov}{/flotila}\t\t{vodic.cele_meno}",
    ],
    "mená pod podpismi (prevádzkovateľ, dopravca, vodič)"
  );
}

// ── Spracovanie súboru ────────────────────────────────────────────────────────

/** Reťazce zo vzorov, ktoré sa vo výsledku nesmú objaviť (vzorové osobné údaje). */
const FORBIDDEN = ["1998", "EL527BS", "LRW3E7FA8MC379421", "Matta", "Jurková", "Bejcek"];

function scrubProps(zip: PizZip) {
  const core = zip.file("docProps/core.xml");
  if (core) {
    zip.file(
      "docProps/core.xml",
      core
        .asText()
        .replace(/<dc:creator>[^<]*<\/dc:creator>/, "<dc:creator>E-TAXI</dc:creator>")
        .replace(/<cp:lastModifiedBy>[^<]*<\/cp:lastModifiedBy>/, "<cp:lastModifiedBy>E-TAXI</cp:lastModifiedBy>")
        .replace(/<cp:lastPrinted>[^<]*<\/cp:lastPrinted>/, "")
    );
  }
  const app = zip.file("docProps/app.xml");
  if (app) {
    zip.file(
      "docProps/app.xml",
      app
        .asText()
        .replace(/<Company>[^<]*<\/Company>/, "<Company></Company>")
        .replace(/<Manager>[^<]*<\/Manager>/, "<Manager></Manager>")
    );
  }
}

async function makeTemplate(src: string, out: string, edit: (ed: Editor) => void, nazov: string) {
  const zip = new PizZip(await fs.readFile(src));
  const docFile = zip.file("word/document.xml");
  if (!docFile) throw new Error(`${nazov}: chýba word/document.xml`);
  const ed = new Editor(docFile.asText());
  edit(ed);
  // rsid/paraId atribúty sú len technické — odstránime ich (aj kvôli kontrole reťazcov).
  const xml = ed
    .toXml()
    .replace(/\s+w:rsid[A-Za-z]*="[^"]*"/g, "")
    .replace(/\s+w14:(paraId|textId)="[^"]*"/g, "");
  zip.file("word/document.xml", xml);
  scrubProps(zip);
  const buf = zip.generate({ type: "nodebuffer", compression: "DEFLATE" }) as Buffer;

  // Kontroly: šablóna sa dá otvoriť, skompilovať, nemá neznáme značky ani vzorové údaje.
  const check = new PizZip(buf);
  const ins = inspectTemplate(buf);
  const problems: string[] = [];
  if (ins.chyby?.length) problems.push(`chyby šablóny: ${ins.chyby.join("; ")}`);
  if (ins.neznameTagy.length) problems.push(`neznáme značky: ${ins.neznameTagy.join(", ")}`);
  for (const f of Object.keys(check.files)) {
    if (!/\.(xml|rels)$/.test(f)) continue;
    const text = check.file(f)?.asText() ?? "";
    for (const bad of FORBIDDEN) if (text.includes(bad)) problems.push(`${f} obsahuje vzorový údaj (${bad.length} znakov)`);
  }

  console.log(`\n== ${nazov} ==`);
  for (const l of ed.log) console.log(`  ✓ ${l}`);
  for (const n of ed.nenajdene) console.log(`  ! NENÁJDENÉ: ${n}`);
  console.log(`  značky (${ins.tagy.length}): ${ins.tagy.join(", ")}`);
  if (problems.length) {
    for (const p of problems) console.error(`  ✗ ${p}`);
    throw new Error(`${nazov}: šablóna neprešla kontrolou`);
  }
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, buf);
  console.log(`  → ${out}`);
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const najom = arg("--najom");
  const disp = arg("--dispecing");
  const outDir = arg("--out") ?? "tests/fixtures";
  if (!najom || !disp) {
    console.error("Použitie: npx tsx scripts/make-sample-templates.ts --najom <vzor.docx> --dispecing <vzor.docx> [--out tests/fixtures]");
    process.exit(2);
  }
  await makeTemplate(najom, path.join(outDir, "sablona-najom.docx"), editNajom, "Nájomná zmluva");
  await makeTemplate(disp, path.join(outDir, "sablona-dispecing.docx"), editDispecing, "Dispečerská zmluva");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : "Neznáma chyba");
  process.exit(1);
});
