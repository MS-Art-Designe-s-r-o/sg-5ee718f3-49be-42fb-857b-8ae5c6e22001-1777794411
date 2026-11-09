"use client";

// Generovanie zmluvy z karty vodiča (len MAJITEL).
// Náhľad údajov (POST /api/portal/contracts/preview) vracia RČ a číslo OP len ako masku;
// UI ich nikde nezobrazuje v plnom tvare a nič z osobných údajov nelogujeme.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ApiError, apiFetch, parseDecimal, sanitizeDecimalInput } from "@/lib/portalClient";
import { describeApiError } from "@/lib/fieldLabels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Typ = "NAJOM" | "DISPECING";
type Jednotka = "ZMENA" | "DEN" | "TYZDEN" | "MESIAC";
type VehicleStav = "VOLNE" | "PRENAJATE" | "SERVIS" | "VYRADENE";

type VehicleOption = {
  id: number; nazov: string; spz: string; stav: VehicleStav; pocetNajmov: number;
  aktivne: boolean; sukromne: boolean;
  poplatokZaSmenu: number | null; poplatokZa24h: number | null;
  kaucia: number | null; spoluucast: number | null; stavKm: number | null;
};

type Options = {
  pdfDostupne: boolean;
  sablony: Record<Typ, { id: number; verzia: number; nazov: string; platnaOd: string } | null>;
  vozidla: VehicleOption[];
  predvolene: { provizia: number; poplatokRegistracny: number };
};

type Missing = { pole: string; label: string; odkaz: string | null };
type Warning = { pole: string; text: string };
type Section = { nazov: string; polozky: { label: string; hodnota: string }[] };
type Preview = { chybajuce: Missing[]; varovania: Warning[]; nahlad: { sekcie: Section[] } };

export type GeneratedContract = {
  id: number; cislo: string; verzia: number; hasDocx: boolean; hasPdf: boolean;
  pdfVarovanie?: string; varovania: Warning[];
};

const TYP_LABELS: Record<Typ, string> = { NAJOM: "Nájom vozidla", DISPECING: "Dispečerské služby" };
const JEDNOTKY: { v: Jednotka; label: string }[] = [
  { v: "ZMENA", label: "Zmena 12 h" },
  { v: "DEN", label: "Deň" },
  { v: "TYZDEN", label: "Týždeň" },
  { v: "MESIAC", label: "Mesiac" },
];

const todayIso = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/** Číslo → text do poľa (čiarka ako desatinný oddeľovač nie je nutná, parseDecimal zvládne aj bodku). */
const numText = (n: number | null | undefined) => (n === null || n === undefined ? "" : String(n));
const moneyOrNull = (v: string) => (v.trim() === "" ? null : parseDecimal(v));
const strOrNull = (v: string) => (v.trim() === "" ? null : v.trim());

/** Zoznam chýbajúcich údajov (červený) a varovaní (žltý). */
function Problems({ chybajuce, varovania }: { chybajuce: Missing[]; varovania: Warning[] }) {
  return (
    <>
      {chybajuce.length > 0 && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <div className="font-medium mb-1">Chýbajúce povinné údaje ({chybajuce.length})</div>
          <ul className="list-disc pl-5 space-y-0.5">
            {chybajuce.map((m, i) => (
              <li key={`${m.pole}-${i}`}>
                {m.label}
                {m.odkaz && (
                  <>
                    {" — "}
                    <a href={m.odkaz} target="_blank" rel="noopener noreferrer" className="underline">doplniť</a>
                  </>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs mt-2">Odkazy sa otvoria v novom okne, formulár zostane zachovaný. Po oprave sa náhľad obnoví.</p>
        </div>
      )}
      {varovania.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <div className="font-medium mb-1">Upozornenia</div>
          <ul className="list-disc pl-5 space-y-0.5">
            {varovania.map((w, i) => <li key={`${w.pole}-${i}`}>{w.text}</li>)}
          </ul>
        </div>
      )}
    </>
  );
}

export function GenerateContractDialog({
  driver,
  onClose,
  onGenerated,
}: {
  driver: { id: number; meno: string; priezvisko: string };
  onClose: () => void;
  onGenerated?: (r: GeneratedContract) => void;
}) {
  const { toast } = useToast();
  const [options, setOptions] = useState<Options | null>(null);
  const [typ, setTyp] = useState<Typ>("NAJOM");
  const [vehicleId, setVehicleId] = useState("");
  const [datumUzavretia, setDatumUzavretia] = useState(todayIso());
  const [platnostOd, setPlatnostOd] = useState(todayIso());
  const [platnostDo, setPlatnostDo] = useState("");
  const [najomneSuma, setNajomneSuma] = useState("");
  const [najomneJednotka, setNajomneJednotka] = useState<Jednotka>("ZMENA");
  const [najomne24h, setNajomne24h] = useState("");
  const [kaucia, setKaucia] = useState("");
  const [spoluucast, setSpoluucast] = useState("");
  const [stavKm, setStavKm] = useState("");
  const [provizia, setProvizia] = useState("");
  const [poplatokReg, setPoplatokReg] = useState("");
  const [miestoPodpisu, setMiestoPodpisu] = useState("Košiciach");
  const [pdf, setPdf] = useState(false);

  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedContract | null>(null);
  const reqSeq = useRef(0);

  // Podklady (aktívne šablóny, vozidlá, predvolené hodnoty).
  useEffect(() => {
    let alive = true;
    apiFetch<Options>("/api/portal/contracts/options")
      .then((o) => {
        if (!alive) return;
        setOptions(o);
        setProvizia(numText(o.predvolene.provizia));
        setPoplatokReg(numText(o.predvolene.poplatokRegistracny));
      })
      .catch((e) => {
        if (!alive) return;
        toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" });
        onClose();
      });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vozidla = useMemo(() => (options?.vozidla ?? []).filter((v) => v.aktivne), [options]);
  const selectedVehicle = vozidla.find((v) => String(v.id) === vehicleId) ?? null;
  const sablona = options?.sablony[typ] ?? null;

  function pickVehicle(id: string) {
    setVehicleId(id);
    const v = vozidla.find((x) => String(x.id) === id);
    if (!v) return;
    // Predvolené hodnoty z vozidla (používateľ ich môže prepísať).
    setNajomneSuma(numText(v.poplatokZaSmenu));
    setNajomne24h(numText(v.poplatokZa24h));
    setKaucia(numText(v.kaucia));
    setSpoluucast(numText(v.spoluucast));
    setStavKm(numText(v.stavKm));
  }

  /** Telo pre náhľad a generovanie (rovnaké). */
  const body = useMemo(() => {
    const base = {
      typ,
      driverId: driver.id,
      datumUzavretia: strOrNull(datumUzavretia),
      platnostOd: strOrNull(platnostOd),
      platnostDo: strOrNull(platnostDo),
      miestoPodpisu: strOrNull(miestoPodpisu),
    };
    if (typ === "NAJOM") {
      return {
        ...base,
        vehicleId: vehicleId ? Number(vehicleId) : null,
        najomneSuma: moneyOrNull(najomneSuma),
        najomneJednotka,
        najomne24h: moneyOrNull(najomne24h),
        kaucia: moneyOrNull(kaucia),
        spoluucast: moneyOrNull(spoluucast),
        stavKmOdovzdanie: stavKm.trim() === "" ? null : Math.round(parseDecimal(stavKm)),
      };
    }
    return {
      ...base,
      provizia: moneyOrNull(provizia),
      poplatokRegistracny: moneyOrNull(poplatokReg),
    };
  }, [
    typ, driver.id, datumUzavretia, platnostOd, platnostDo, miestoPodpisu, vehicleId, najomneSuma,
    najomneJednotka, najomne24h, kaucia, spoluucast, stavKm, provizia, poplatokReg,
  ]);
  const bodyKey = JSON.stringify(body);

  const runPreview = useCallback(() => {
    const seq = ++reqSeq.current;
    setPreviewLoading(true);
    apiFetch<Preview>("/api/portal/contracts/preview", { method: "POST", body: JSON.stringify(body) })
      .then((p) => {
        if (seq !== reqSeq.current) return;
        setPreview(p);
        setPreviewError(null);
      })
      .catch((e) => {
        if (seq !== reqSeq.current) return;
        setPreview(null);
        setPreviewError(describeApiError(e));
      })
      .finally(() => { if (seq === reqSeq.current) setPreviewLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyKey]);

  // Náhľad pri otvorení (hneď) a po zmene polí (debounce ~500 ms).
  const firstPreview = useRef(true);
  useEffect(() => {
    if (!options || result) return;
    const delay = firstPreview.current ? 0 : 500;
    firstPreview.current = false;
    const t = setTimeout(runPreview, delay);
    return () => clearTimeout(t);
  }, [options, result, runPreview]);

  // Po návrate z karty vodiča/vozidla/firmy (iné okno) náhľad obnovíme.
  useEffect(() => {
    if (!options || result) return;
    const onFocus = () => runPreview();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [options, result, runPreview]);

  const chybajuce = preview?.chybajuce ?? [];
  const varovania = preview?.varovania ?? [];
  const canGenerate =
    !!options && !!sablona && !!preview && chybajuce.length === 0 && !previewLoading && !generating &&
    (typ !== "NAJOM" || !!vehicleId);

  async function generate() {
    if (!canGenerate) return;
    setGenerating(true);
    setGenError(null);
    try {
      const r = await apiFetch<GeneratedContract>("/api/portal/contracts", {
        method: "POST",
        body: JSON.stringify({ ...body, formaty: pdf ? ["docx", "pdf"] : ["docx"] }),
      });
      setResult(r);
      onGenerated?.(r);
    } catch (e) {
      if (e instanceof ApiError && e.status === 422 && Array.isArray(e.data.chybajuce)) {
        setPreview((p) => ({
          chybajuce: e.data.chybajuce as Missing[],
          varovania: Array.isArray(e.data.varovania) ? (e.data.varovania as Warning[]) : [],
          nahlad: p?.nahlad ?? { sekcie: [] },
        }));
        setGenError("Zmluvu nie je možné vygenerovať — chýbajú povinné údaje.");
      } else {
        setGenError(describeApiError(e));
      }
    } finally {
      setGenerating(false);
    }
  }

  function download(id: number, format: "docx" | "pdf") {
    window.location.href = `/api/portal/contracts/${id}/download?format=${format}`;
  }

  return (
    <Dialog open onOpenChange={(o) => { if (!o && !generating) onClose(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Generovať zmluvu — {driver.priezvisko} {driver.meno}</DialogTitle>
        </DialogHeader>

        {!options ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Načítavam…</p>
        ) : result ? (
          <div className="space-y-3 text-sm">
            <div className="rounded-md border border-green-300 bg-green-50 p-3 text-green-900">
              Zmluva <strong>{result.cislo}</strong> (verzia {result.verzia}) bola vygenerovaná.
            </div>
            {result.pdfVarovanie && (
              <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900">{result.pdfVarovanie}</div>
            )}
            <Problems chybajuce={[]} varovania={result.varovania} />
            <div className="flex flex-wrap gap-2">
              {result.hasDocx && <Button onClick={() => download(result.id, "docx")}>Stiahnuť DOCX</Button>}
              {result.hasPdf && <Button variant="outline" onClick={() => download(result.id, "pdf")}>Stiahnuť PDF</Button>}
            </div>
            <DialogFooter><Button variant="outline" onClick={onClose}>Zavrieť</Button></DialogFooter>
          </div>
        ) : (
          <>
            {!sablona && (
              <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                Pre typ „{TYP_LABELS[typ]}“ nie je aktívna šablóna. Generovanie je zablokované.{" "}
                <Link href="/portal/sablony" target="_blank" rel="noopener noreferrer" className="underline">Nahrať / aktivovať šablónu</Link>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Formulár */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Label>Typ zmluvy</Label>
                    <Select value={typ} onValueChange={(v) => setTyp(v as Typ)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NAJOM">{TYP_LABELS.NAJOM}</SelectItem>
                        <SelectItem value="DISPECING">{TYP_LABELS.DISPECING}</SelectItem>
                      </SelectContent>
                    </Select>
                    {sablona && (
                      <p className="text-xs text-muted-foreground mt-1">Šablóna: {sablona.nazov} (v{sablona.verzia})</p>
                    )}
                  </div>

                  {typ === "NAJOM" && (
                    <div className="sm:col-span-2">
                      <Label>Vozidlo</Label>
                      <Select value={vehicleId} onValueChange={pickVehicle}>
                        <SelectTrigger><SelectValue placeholder="Vyberte vozidlo" /></SelectTrigger>
                        <SelectContent>
                          {vozidla.map((v) => {
                            const blocked = v.stav === "SERVIS" || v.stav === "VYRADENE";
                            return (
                              <SelectItem
                                key={v.id}
                                value={String(v.id)}
                                disabled={blocked}
                                className={
                                  blocked ? "text-muted-foreground" : v.stav === "PRENAJATE" ? "text-orange-600" : undefined
                                }
                              >
                                {v.nazov} ({v.spz})
                                {v.sukromne ? " · súkromné" : ""}
                                {v.stav === "PRENAJATE" ? ` · prenajaté (${v.pocetNajmov})` : ""}
                                {v.stav === "SERVIS" ? " · v servise" : ""}
                                {v.stav === "VYRADENE" ? " · vyradené" : ""}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {selectedVehicle?.stav === "PRENAJATE" && (
                        <p className="text-xs text-orange-600 mt-1">
                          Vozidlo je už prenajaté ({selectedVehicle.pocetNajmov}). Môže mať viac nájomcov podľa rozpisu smien.
                        </p>
                      )}
                      {vozidla.some((v) => v.stav === "SERVIS" || v.stav === "VYRADENE") && (
                        <p className="text-xs text-muted-foreground mt-1">Vozidlá v servise sa nedajú vybrať.</p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label>Dátum uzavretia</Label>
                    <Input type="date" value={datumUzavretia} onChange={(e) => setDatumUzavretia(e.target.value)} />
                  </div>
                  <div>
                    <Label>Platnosť od</Label>
                    <Input type="date" value={platnostOd} onChange={(e) => setPlatnostOd(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Platnosť do</Label>
                    <Input type="date" value={platnostDo} onChange={(e) => setPlatnostDo(e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1">Prázdne = na dobu neurčitú.</p>
                  </div>

                  {typ === "NAJOM" ? (
                    <>
                      <div>
                        <Label>Nájomné za zmenu (€)</Label>
                        <Input type="text" inputMode="decimal" placeholder="0,00" value={najomneSuma}
                          onChange={(e) => setNajomneSuma(sanitizeDecimalInput(e.target.value))} />
                      </div>
                      <div>
                        <Label>Jednotka nájomného</Label>
                        <Select value={najomneJednotka} onValueChange={(v) => setNajomneJednotka(v as Jednotka)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {JEDNOTKY.map((j) => <SelectItem key={j.v} value={j.v}>{j.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nájomné 24 h (€)</Label>
                        <Input type="text" inputMode="decimal" placeholder="0,00" value={najomne24h}
                          onChange={(e) => setNajomne24h(sanitizeDecimalInput(e.target.value))} />
                      </div>
                      <div>
                        <Label>Kaucia (€)</Label>
                        <Input type="text" inputMode="decimal" placeholder="0,00" value={kaucia}
                          onChange={(e) => setKaucia(sanitizeDecimalInput(e.target.value))} />
                      </div>
                      <div>
                        <Label>Spoluúčasť (€)</Label>
                        <Input type="text" inputMode="decimal" placeholder="0,00" value={spoluucast}
                          onChange={(e) => setSpoluucast(sanitizeDecimalInput(e.target.value))} />
                      </div>
                      <div>
                        <Label>Stav km pri odovzdaní</Label>
                        <Input type="text" inputMode="numeric" placeholder="0" value={stavKm}
                          onChange={(e) => setStavKm(e.target.value.replace(/\D/g, ""))} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label>Provízia (%)</Label>
                        <Input type="text" inputMode="decimal" placeholder="0" value={provizia}
                          onChange={(e) => setProvizia(sanitizeDecimalInput(e.target.value))} />
                      </div>
                      <div>
                        <Label>Registračný poplatok (€)</Label>
                        <Input type="text" inputMode="decimal" placeholder="0,00" value={poplatokReg}
                          onChange={(e) => setPoplatokReg(sanitizeDecimalInput(e.target.value))} />
                      </div>
                    </>
                  )}

                  <div>
                    <Label>Miesto podpisu (v …)</Label>
                    <Input value={miestoPodpisu} maxLength={100} onChange={(e) => setMiestoPodpisu(e.target.value)} />
                  </div>
                  <div>
                    <Label>Formát</Label>
                    <Select value={pdf ? "pdf" : "docx"} onValueChange={(v) => setPdf(v === "pdf")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docx">Len DOCX</SelectItem>
                        <SelectItem value="pdf" disabled={!options.pdfDostupne}>
                          DOCX + PDF{!options.pdfDostupne ? " (PDF nie je na serveri nastavené)" : ""}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {!options.pdfDostupne && (
                      <p className="text-xs text-muted-foreground mt-1">PDF nie je na serveri nastavené.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Náhľad údajov */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Náhľad údajov</h3>
                  <Button size="sm" variant="ghost" disabled={previewLoading} onClick={runPreview}>
                    {previewLoading ? "Načítavam…" : "Obnoviť"}
                  </Button>
                </div>

                {previewError && (
                  <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-800">{previewError}</div>
                )}
                {genError && (
                  <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-800">{genError}</div>
                )}
                {preview && <Problems chybajuce={chybajuce} varovania={varovania} />}

                {preview && (
                  <div className="max-h-[45vh] overflow-y-auto space-y-3 rounded-md border bg-white p-3">
                    {preview.nahlad.sekcie.map((s) => (
                      <div key={s.nazov}>
                        <div className="font-medium text-[#282462] mb-1">{s.nazov}</div>
                        <dl className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-3 gap-y-0.5 text-xs">
                          {s.polozky.map((p, i) => (
                            <div key={`${p.label}-${i}`} className="contents">
                              <dt className="text-muted-foreground">{p.label}</dt>
                              <dd className="break-words">{p.hodnota || "—"}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                )}
                {!preview && !previewError && <p className="text-muted-foreground">Načítavam náhľad…</p>}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" disabled={generating} onClick={onClose}>Zrušiť</Button>
              <Button onClick={generate} disabled={!canGenerate}>{generating ? "Generujem…" : "Generovať"}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
