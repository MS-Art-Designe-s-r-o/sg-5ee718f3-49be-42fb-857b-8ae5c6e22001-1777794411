"use client";

import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatEur, formatDate, DAY_NAMES } from "@/lib/portalClient";
import { isoWeekParts, isoWeekDateRange } from "@/lib/fees";
import { blockCoversSlot, ROZSAH_LABEL } from "@/lib/vehicleBlocks";
import { SHIFT_PATTERNS, parsePatternDni, type PatternCode } from "@/lib/shiftPatterns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Driver = { id: number; meno: string; priezvisko: string; volaciZnak: string | null };
type Vehicle = { id: number; nazov: string; spz: string; poplatokZaSmenu: number; poplatokZa24h: number };
type Shift = {
  id: number; driverId: number; datum: string; typ: "DENNA" | "NOCNA" | "VOLNO" | "H24";
  vehicleId: number | null; poplatokZaSmenu: number | null; poplatokUhradeny: boolean;
};
type Rozsah = "CELY_DEN" | "DENNA" | "NOCNA";
type Block = {
  id: number; vehicleId: number; typ: "NEDOSTUPNE" | "SERVIS"; rozsah: Rozsah;
  datumOd: string; datumDo: string; poznamka: string | null;
};
const BLOK_LABEL: Record<string, string> = { NEDOSTUPNE: "Nedostupné", SERVIS: "Servis" };

const TYP_SKRATKA: Record<string, string> = { DENNA: "D", NOCNA: "N", VOLNO: "V", H24: "24" };
const TYP_COLOR: Record<string, string> = {
  DENNA: "bg-amber-100 text-amber-800", NOCNA: "bg-indigo-100 text-indigo-800", VOLNO: "bg-gray-100 text-gray-500",
  H24: "bg-emerald-100 text-emerald-800",
};

function ymd(d: Date) { return d.toISOString().slice(0, 10); }

export default function SmenyPage() {
  const { toast } = useToast();
  const now = isoWeekParts(new Date());
  const [rok, setRok] = useState(now.isoRok);
  const [tyzden, setTyzden] = useState(now.isoTyzden);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [edit, setEdit] = useState<{ driver: Driver; datum: string; shift?: Shift } | null>(null);
  const [genOpen, setGenOpen] = useState(false);
  const [patternsOpen, setPatternsOpen] = useState(false);
  const [blockFor, setBlockFor] = useState<Vehicle | null>(null);

  const { dni } = isoWeekDateRange(rok, tyzden);

  const load = useCallback(() => {
    apiFetch<{ drivers: Driver[]; vehicles: Vehicle[] }>("/api/portal/refs").then((d) => {
      setDrivers(d.drivers); setVehicles(d.vehicles);
    });
    apiFetch<{ shifts: Shift[] }>(`/api/portal/shifts?rok=${rok}&tyzden=${tyzden}`).then((d) => setShifts(d.shifts));
    apiFetch<{ blocks: Block[] }>(`/api/portal/vehicle-blocks?rok=${rok}&tyzden=${tyzden}`).then((d) => setBlocks(d.blocks));
  }, [rok, tyzden]);
  useEffect(load, [load]);

  function cellShift(driverId: number, datum: string): Shift | undefined {
    return shifts.find((s) => s.driverId === driverId && s.datum.slice(0, 10) === datum);
  }

  async function deleteBlock(id: number) {
    try { await apiFetch(`/api/portal/vehicle-blocks/${id}`, { method: "DELETE" }); load(); toast({ title: "Blok zrušený" }); }
    catch (e) { toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  }

  const znakOf = (driverId: number) => {
    const d = drivers.find((x) => x.id === driverId);
    return d?.volaciZnak || d?.priezvisko || "?";
  };
  const vehShift = (vehicleId: number, datum: string, typ: "DENNA" | "NOCNA") =>
    shifts.find((s) => s.vehicleId === vehicleId && s.datum.slice(0, 10) === datum && (s.typ === typ || s.typ === "H24"));
  const vehBlock = (vehicleId: number, datum: string, typ: "DENNA" | "NOCNA") =>
    blocks.find(
      (b) =>
        b.vehicleId === vehicleId &&
        datum >= b.datumOd.slice(0, 10) &&
        datum <= b.datumDo.slice(0, 10) &&
        blockCoversSlot(b, datum, typ)
    );

  return (
    <PortalLayout title="Rozpis smien">
      <Head><title>Rozpis smien — E-TAXI Portál</title></Head>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div><Label>Rok</Label><Input type="number" className="w-24" value={rok} onChange={(e) => setRok(Number(e.target.value))} /></div>
        <div><Label>ISO týždeň</Label><Input type="number" min={1} max={53} className="w-24" value={tyzden} onChange={(e) => setTyzden(Number(e.target.value))} /></div>
        <Badge variant="secondary" className="mb-2">Týždeň {tyzden}/{rok}</Badge>
        <Button className="mb-2" onClick={() => setGenOpen(true)}>Generovať rozpis podľa vzoru</Button>
        <Button className="mb-2" variant="outline" onClick={() => setPatternsOpen(true)}>Vlastné vzory</Button>
        <span className="text-xs text-muted-foreground mb-2">D = denná · N = nočná · V = voľno. Kliknite na bunku pre úpravu.</span>
      </div>

      <div className="bg-white rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left p-2 sticky left-0 bg-muted/40">Vodič</th>
              {dni.map((d, i) => (
                <th key={i} className="p-2 text-center whitespace-nowrap">
                  {DAY_NAMES[i]}<br /><span className="text-xs text-muted-foreground">{d.getUTCDate()}.{d.getUTCMonth() + 1}.</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.map((dr) => (
              <tr key={dr.id} className="border-b">
                <td className="p-2 font-medium whitespace-nowrap sticky left-0 bg-white">
                  {dr.priezvisko} {dr.meno}{dr.volaciZnak ? <span className="text-muted-foreground"> · {dr.volaciZnak}</span> : null}
                </td>
                {dni.map((d) => {
                  const datum = ymd(d);
                  const s = cellShift(dr.id, datum);
                  const veh = s?.vehicleId ? vehicles.find((v) => v.id === s.vehicleId) : undefined;
                  return (
                    <td key={datum} className="p-1 text-center">
                      <button
                        className={`w-full rounded px-1 py-2 hover:ring-2 ring-[#282462]/40 ${s ? TYP_COLOR[s.typ] : "bg-gray-50 text-gray-300"}`}
                        onClick={() => setEdit({ driver: dr, datum, shift: s })}
                        title={veh ? `${veh.nazov}` : ""}
                      >
                        <div className="font-bold">{s ? TYP_SKRATKA[s.typ] : "—"}</div>
                        {veh && <div className="text-[10px] leading-tight">{veh.nazov}</div>}
                        {s && s.typ !== "VOLNO" && s.poplatokZaSmenu != null && (
                          <div className={`text-[10px] ${s.poplatokUhradeny ? "text-green-600" : "text-red-500"}`}>
                            {s.poplatokUhradeny ? "✓" : "€"}
                          </div>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
            {drivers.length === 0 && <tr><td colSpan={8} className="text-center text-muted-foreground py-6">Žiadni aktívni vodiči.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* ── Obsadenosť vozidiel (denná/nočná) + stavy nedostupné/servis ─────────── */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold">Obsadenosť vozidiel</h2>
          <span className="text-xs text-muted-foreground">horný riadok = denná (D) · spodný = nočná (N) · volací znak = obsadené</span>
        </div>
        <div className="space-y-4">
          {vehicles.map((v) => (
            <div key={v.id} className="border rounded-md overflow-hidden">
              <div className="flex flex-wrap justify-between items-center gap-2 p-2 bg-muted/40">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{v.nazov} <span className="text-muted-foreground text-sm">({v.spz})</span></span>
                  {blocks.filter((b) => b.vehicleId === v.id).map((b) => (
                    <Badge key={b.id} variant="outline" className={b.typ === "SERVIS" ? "border-orange-400 text-orange-700" : "border-gray-400 text-gray-600"}>
                      {BLOK_LABEL[b.typ]} {formatDate(b.datumOd)}–{formatDate(b.datumDo)}
                      {b.rozsah !== "CELY_DEN" ? ` · ${ROZSAH_LABEL[b.rozsah]}` : ""}
                      <button className="ml-1 text-red-500 hover:text-red-700" title="Zrušiť blok" onClick={() => deleteBlock(b.id)}>×</button>
                    </Badge>
                  ))}
                </div>
                <Button size="sm" variant="outline" onClick={() => setBlockFor(v)}>+ Nedostupné / servis</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20">
                      <th className="text-left p-2 w-16"></th>
                      {dni.map((d, i) => (
                        <th key={i} className="p-2 text-center whitespace-nowrap font-normal">
                          {DAY_NAMES[i]}<br /><span className="text-xs text-muted-foreground">{d.getUTCDate()}.{d.getUTCMonth() + 1}.</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(["DENNA", "NOCNA"] as const).map((cellTyp) => (
                      <tr key={cellTyp} className="border-b last:border-b-0">
                        <td className="p-2 font-semibold text-muted-foreground">{cellTyp === "DENNA" ? "D" : "N"}</td>
                        {dni.map((d) => {
                          const datum = ymd(d);
                          const s = vehShift(v.id, datum, cellTyp);
                          const b = vehBlock(v.id, datum, cellTyp);
                          const kolizia = !!b && !!s;
                          let cls = "bg-gray-50 text-gray-300";
                          let obsah = "—";
                          if (s && b) { cls = "bg-red-100 text-red-700 font-semibold"; obsah = `⚠ ${znakOf(s.driverId)}`; }
                          else if (b) { cls = b.typ === "SERVIS" ? "bg-orange-50 text-orange-600" : "bg-gray-200 text-gray-500"; obsah = BLOK_LABEL[b.typ]; }
                          else if (s) { cls = cellTyp === "DENNA" ? "bg-amber-100 text-amber-800 font-medium" : "bg-indigo-100 text-indigo-800 font-medium"; obsah = znakOf(s.driverId); }
                          return (
                            <td key={datum} className="p-1 text-center">
                              <div className={`rounded px-1 py-2 ${cls}`} title={kolizia ? "Kolízia: vozidlo je blokované, no smena je naplánovaná" : ""}>{obsah}</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {vehicles.length === 0 && <p className="text-muted-foreground text-sm">Žiadne aktívne vozidlá.</p>}
        </div>
      </div>

      {blockFor && (
        <BlockDialog
          vehicle={blockFor}
          defaultStart={dni[0] ? ymd(dni[0]) : ""}
          onClose={() => setBlockFor(null)}
          onSaved={() => { setBlockFor(null); load(); toast({ title: "Blok pridaný" }); }}
          onError={(m) => toast({ title: "Chyba", description: m, variant: "destructive" })}
        />
      )}

      {edit && (
        <ShiftEditor
          driver={edit.driver}
          datum={edit.datum}
          shift={edit.shift}
          vehicles={vehicles}
          onClose={() => setEdit(null)}
          onSaved={() => { setEdit(null); load(); toast({ title: "Uložené" }); }}
          onError={(m) => toast({ title: "Chyba", description: m, variant: "destructive" })}
        />
      )}

      {genOpen && (
        <GeneratorDialog
          drivers={drivers}
          vehicles={vehicles}
          defaultStart={dni[0] ? ymd(dni[0]) : ""}
          onClose={() => setGenOpen(false)}
          onDone={(pocet) => {
            setGenOpen(false);
            load();
            toast({ title: "Rozpis vygenerovaný", description: `Doplnených ${pocet} dní.` });
          }}
          onError={(m) => toast({ title: "Chyba", description: m, variant: "destructive" })}
        />
      )}

      {patternsOpen && (
        <PatternEditorDialog
          onClose={() => setPatternsOpen(false)}
          onError={(m) => toast({ title: "Chyba", description: m, variant: "destructive" })}
          onSaved={() => toast({ title: "Vzor uložený" })}
        />
      )}
    </PortalLayout>
  );
}

function BlockDialog({
  vehicle, defaultStart, onClose, onSaved, onError,
}: {
  vehicle: Vehicle; defaultStart: string;
  onClose: () => void; onSaved: () => void; onError: (m: string) => void;
}) {
  const [typ, setTyp] = useState<"NEDOSTUPNE" | "SERVIS">("SERVIS");
  const [rozsah, setRozsah] = useState<Rozsah>("CELY_DEN");
  const [datumOd, setDatumOd] = useState(defaultStart);
  const [datumDo, setDatumDo] = useState(defaultStart);
  const [poznamka, setPoznamka] = useState("");
  const [busy, setBusy] = useState(false);

  const viacDni = !!datumOd && !!datumDo && datumDo > datumOd;

  async function save() {
    if (!datumOd || !datumDo) { onError("Zadajte dátum od aj do."); return; }
    setBusy(true);
    try {
      await apiFetch("/api/portal/vehicle-blocks", {
        method: "POST",
        body: JSON.stringify({ vehicleId: vehicle.id, typ, rozsah, datumOd, datumDo, poznamka: poznamka || null }),
      });
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Uloženie zlyhalo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nedostupné / servis — {vehicle.nazov} ({vehicle.spz})</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Stav</Label>
            <Select value={typ} onValueChange={(v) => setTyp(v as "NEDOSTUPNE" | "SERVIS")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SERVIS">Servis</SelectItem>
                <SelectItem value="NEDOSTUPNE">Nedostupné</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Od dátumu</Label><Input type="date" value={datumOd} onChange={(e) => setDatumOd(e.target.value)} /></div>
            <div><Label>Do dátumu</Label><Input type="date" value={datumDo} onChange={(e) => setDatumDo(e.target.value)} /></div>
          </div>
          <div>
            <Label>Rozsah {viacDni ? "(posledný deň)" : ""}</Label>
            <Select value={rozsah} onValueChange={(v) => setRozsah(v as Rozsah)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CELY_DEN">Celý deň</SelectItem>
                <SelectItem value="DENNA">Denná</SelectItem>
                <SelectItem value="NOCNA">Nočná</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Poznámka (voliteľné)</Label><Input value={poznamka} onChange={(e) => setPoznamka(e.target.value)} /></div>
          <p className="text-xs text-muted-foreground">
            Počas tohto obdobia sa na vozidlo nedá priradiť smena; existujúce smeny sa zobrazia ako kolízia.
            {viacDni ? " Pri viacdňovom intervale platí rozsah len pre posledný deň — ostatné dni sú blokované celý deň." : ""}
          </p>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={busy}>{busy ? "Ukladám…" : "Uložiť blok"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GeneratorDialog({
  drivers, vehicles, defaultStart, onClose, onDone, onError,
}: {
  drivers: Driver[];
  vehicles: Vehicle[];
  defaultStart: string;
  onClose: () => void;
  onDone: (pocet: number) => void;
  onError: (m: string) => void;
}) {
  const [driverId, setDriverId] = useState<string>(drivers[0] ? String(drivers[0].id) : "");
  const [patternKey, setPatternKey] = useState<string>(SHIFT_PATTERNS[0].key);
  const [customPatterns, setCustomPatterns] = useState<{ id: number; nazov: string; dni: string }[]>([]);
  const [vehicleId, setVehicleId] = useState<string>("none");
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [weeks, setWeeks] = useState<number>(4);
  const [overwrite, setOverwrite] = useState<boolean>(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch<{ patterns: { id: number; nazov: string; dni: string }[] }>("/api/portal/shift-patterns")
      .then((d) => setCustomPatterns(d.patterns)).catch(() => {});
  }, []);

  async function generate() {
    if (!driverId) { onError("Vyberte vodiča."); return; }
    setBusy(true);
    try {
      const r = await apiFetch<{ pocet: number }>("/api/portal/shifts/generate", {
        method: "POST",
        body: JSON.stringify({
          driverId: Number(driverId),
          patternKey,
          startDate,
          weeks,
          vehicleId: vehicleId === "none" ? null : Number(vehicleId),
          overwrite,
        }),
      });
      onDone(r.pocet);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Generovanie zlyhalo");
    } finally {
      setBusy(false);
    }
  }

  const builtin = SHIFT_PATTERNS.find((p) => p.key === patternKey);
  const custom = customPatterns.find((p) => `c${p.id}` === patternKey);
  const dniPreview: PatternCode[] = builtin ? builtin.dni : custom ? parsePatternDni(custom.dni) : [];

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generovať rozpis podľa vzoru</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Vodič</Label>
            <Select value={driverId} onValueChange={setDriverId}>
              <SelectTrigger><SelectValue placeholder="Vyberte vodiča" /></SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.priezvisko} {d.meno}{d.volaciZnak ? ` · ${d.volaciZnak}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Vzor rotácie (kľúč)</Label>
            <Select value={patternKey} onValueChange={setPatternKey}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SHIFT_PATTERNS.map((p) => (
                  <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                ))}
                {customPatterns.map((p) => (
                  <SelectItem key={p.id} value={`c${p.id}`}>{p.nazov} (vlastný)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {dniPreview.length > 0 && (
              <div className="text-[11px] text-muted-foreground mt-1 font-mono">
                1. týždeň: {dniPreview.slice(0, 7).join(" ")}
              </div>
            )}
          </div>
          <div>
            <Label>Vozidlo (poplatok za smenu sa načíta z neho)</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— žiadne —</SelectItem>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>{v.nazov} ({v.spz})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Od dátumu (pondelok)</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>Počet týždňov</Label>
              <Input type="number" min={1} max={26} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={overwrite} onCheckedChange={(v) => setOverwrite(!!v)} />
            Prepísať existujúce smeny v tomto období
          </label>
        </div>
        <DialogFooter>
          <Button onClick={generate} disabled={busy}>{busy ? "Generujem…" : "Generovať"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ShiftEditor({
  driver, datum, shift, vehicles, onClose, onSaved, onError,
}: {
  driver: Driver; datum: string; shift?: Shift; vehicles: Vehicle[];
  onClose: () => void; onSaved: () => void; onError: (m: string) => void;
}) {
  const [typ, setTyp] = useState<Shift["typ"]>(shift?.typ ?? "VOLNO");
  const [vehicleId, setVehicleId] = useState<string>(shift?.vehicleId ? String(shift.vehicleId) : "none");
  const [poplatok, setPoplatok] = useState<string>(shift?.poplatokZaSmenu != null ? String(shift.poplatokZaSmenu) : "");
  const [uhradeny, setUhradeny] = useState<boolean>(shift?.poplatokUhradeny ?? false);

  function vehDefaultFee(id: string, t: Shift["typ"]) {
    const v = vehicles.find((x) => String(x.id) === id);
    if (!v) return "";
    return String(t === "H24" ? v.poplatokZa24h : v.poplatokZaSmenu);
  }

  async function save() {
    try {
      // upsert typ + vozidlo + poplatok
      await apiFetch("/api/portal/shifts", {
        method: "POST",
        body: JSON.stringify({
          driverId: driver.id, datum, typ,
          vehicleId: vehicleId === "none" ? null : Number(vehicleId),
          poplatokZaSmenu: poplatok === "" ? null : Number(poplatok),
        }),
      });
      // úhrada poplatku sa nastavuje cez PUT (potrebuje id) — načítaj po upserte
      if (shift?.id !== undefined) {
        await apiFetch(`/api/portal/shifts/${shift.id}`, { method: "PUT", body: JSON.stringify({ poplatokUhradeny: uhradeny }) });
      } else if (uhradeny) {
        // nový shift — dohľadaj a označ
        const wk = isoWeekParts(new Date(`${datum}T00:00:00Z`));
        const d = await apiFetch<{ shifts: Shift[] }>(`/api/portal/shifts?rok=${wk.isoRok}&tyzden=${wk.isoTyzden}`);
        const found = d.shifts.find((s) => s.driverId === driver.id && s.datum.slice(0, 10) === datum);
        if (found) await apiFetch(`/api/portal/shifts/${found.id}`, { method: "PUT", body: JSON.stringify({ poplatokUhradeny: true }) });
      }
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Uloženie zlyhalo");
    }
  }

  async function remove() {
    if (!shift?.id) { onClose(); return; }
    try { await apiFetch(`/api/portal/shifts/${shift.id}`, { method: "DELETE" }); onSaved(); }
    catch (e) { onError(e instanceof Error ? e.message : ""); }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{driver.priezvisko} {driver.meno} — {datum}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Typ smeny</Label>
            <Select value={typ} onValueChange={(v) => { const nt = v as Shift["typ"]; setTyp(nt); if (nt !== "VOLNO" && vehicleId !== "none") setPoplatok(vehDefaultFee(vehicleId, nt)); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DENNA">Denná (D)</SelectItem>
                <SelectItem value="NOCNA">Nočná (N)</SelectItem>
                <SelectItem value="H24">24 hodín (D+N)</SelectItem>
                <SelectItem value="VOLNO">Voľno (V)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {typ !== "VOLNO" && (
            <>
              <div>
                <Label>Vozidlo</Label>
                <Select value={vehicleId} onValueChange={(v) => { setVehicleId(v); if (v !== "none") setPoplatok(vehDefaultFee(v, typ)); }}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— žiadne —</SelectItem>
                    {vehicles.map((v) => <SelectItem key={v.id} value={String(v.id)}>{v.nazov} ({v.spz})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Poplatok za smenu / prenájom (€)</Label>
                <Input type="number" step="0.01" value={poplatok} onChange={(e) => setPoplatok(e.target.value)} placeholder="predvolené z vozidla" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={uhradeny} onCheckedChange={(v) => setUhradeny(!!v)} />
                Poplatok uhradený {poplatok && `(${formatEur(Number(poplatok))})`}
              </label>
            </>
          )}
        </div>
        <DialogFooter className="justify-between">
          {shift?.id ? <Button variant="ghost" className="text-red-600" onClick={remove}>Zmazať</Button> : <span />}
          <Button onClick={save}>Uložiť</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Editor vlastných rotačných vzorov (uložia sa a objavia v generátore) ──────
const PE_NEXT: Record<PatternCode, PatternCode> = { D: "N", N: "H", H: "V", V: "D" };
const PE_LABEL: Record<PatternCode, string> = { D: "D", N: "N", H: "24", V: "V" };
const PE_CLS: Record<PatternCode, string> = {
  D: "bg-amber-100 text-amber-800",
  N: "bg-indigo-100 text-indigo-800",
  H: "bg-emerald-100 text-emerald-800",
  V: "bg-gray-100 text-gray-500",
};

function PatternEditorDialog({
  onClose, onSaved, onError,
}: {
  onClose: () => void; onSaved: () => void; onError: (m: string) => void;
}) {
  const [list, setList] = useState<{ id: number; nazov: string; dni: string }[]>([]);
  const [nazov, setNazov] = useState("");
  const [dlzka, setDlzka] = useState(7);
  const [dni, setDni] = useState<PatternCode[]>(Array(7).fill("D") as PatternCode[]);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => {
    apiFetch<{ patterns: { id: number; nazov: string; dni: string }[] }>("/api/portal/shift-patterns")
      .then((d) => setList(d.patterns)).catch(() => {});
  }, []);
  useEffect(() => { reload(); }, [reload]);

  function setLength(n: number) {
    setDlzka(n);
    setDni((prev) => {
      const next = prev.slice(0, n);
      while (next.length < n) next.push("D");
      return next;
    });
  }
  function cycle(i: number) {
    setDni((prev) => prev.map((c, j) => (j === i ? PE_NEXT[c] : c)));
  }

  async function save() {
    if (!nazov.trim()) { onError("Zadajte názov vzoru."); return; }
    setBusy(true);
    try {
      await apiFetch("/api/portal/shift-patterns", {
        method: "POST",
        body: JSON.stringify({ nazov: nazov.trim(), dni: dni.join("") }),
      });
      setNazov("");
      reload();
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Uloženie zlyhalo");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    try { await apiFetch(`/api/portal/shift-patterns/${id}`, { method: "DELETE" }); reload(); }
    catch (e) { onError(e instanceof Error ? e.message : "Mazanie zlyhalo"); }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vlastné vzory smien</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nový vzor</Label>
            <Input placeholder="Názov vzoru (napr. Môj 2-týždňový)" value={nazov} onChange={(e) => setNazov(e.target.value)} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Dĺžka cyklu:</span>
              <Select value={String(dlzka)} onValueChange={(v) => setLength(Number(v))}>
                <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>{[7, 14, 21, 28].map((n) => <SelectItem key={n} value={String(n)}>{n} dní</SelectItem>)}</SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">Klik na deň mení D → N → 24 → V</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {dni.map((c, i) => (
                <button key={i} type="button" onClick={() => cycle(i)}
                  className={`w-10 rounded text-center text-sm py-1 ${PE_CLS[c]} hover:ring-2 ring-[#282462]/40`}
                  title={`Deň ${i + 1} (${DAY_NAMES[i % 7]})`}>
                  <div className="text-[9px] leading-none text-muted-foreground">{DAY_NAMES[i % 7]}</div>
                  <div className="font-bold leading-tight">{PE_LABEL[c]}</div>
                </button>
              ))}
            </div>
            <Button onClick={save} disabled={busy} className="mt-1">{busy ? "Ukladám…" : "Uložiť vzor"}</Button>
          </div>

          <div>
            <Label>Uložené vzory</Label>
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-1">Zatiaľ žiadne vlastné vzory.</p>
            ) : (
              <div className="space-y-1 mt-1 max-h-52 overflow-y-auto">
                {list.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 border-b py-1 text-sm">
                    <span><span className="font-medium">{p.nazov}</span> <span className="font-mono text-muted-foreground text-xs">{parsePatternDni(p.dni).map((c) => PE_LABEL[c]).join(" ")}</span></span>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(p.id)}>Zmazať</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Zavrieť</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
