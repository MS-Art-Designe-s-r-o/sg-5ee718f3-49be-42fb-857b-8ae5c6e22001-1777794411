"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatEur, parseDecimal, sanitizeDecimalInput } from "@/lib/portalClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

type VlastnikTyp = "ETAXI" | "FLOTILA";

type Vehicle = {
  id: number; nazov: string; znacka: string; model: string; farba: string;
  spz: string; druhPohonu: string; poplatokZaSmenu: number; poplatokZa24h: number; lizing: number; poistenie: number;
  sukromne: boolean; casVymeny: string | null; aktivne: boolean;
  // Zmluvné údaje (dátumy 'YYYY-MM-DD' alebo null)
  vin: string | null; rokVyroby: number | null; cisloTp: string | null;
  datumPrvejEvidencie: string | null; vlastnikTyp: VlastnikTyp; vlastnikFleetId: number | null;
  poistovna: string | null; pzpCislo: string | null; pzpPlatnostDo: string | null;
  havCislo: string | null; havPlatnostDo: string | null; stkPlatnostDo: string | null;
  ekPlatnostDo: string | null; stavKm: number | null; kaucia: number | null; spoluucast: number | null;
};

type FleetOption = { id: number; obchodneMeno: string };

const POHONY = ["ELEKTRO", "HYBRID", "BENZIN", "DIESEL", "LPG", "CNG"];
const empty = {
  nazov: "", znacka: "", model: "", farba: "", spz: "", druhPohonu: "ELEKTRO", poplatokZaSmenu: "0", poplatokZa24h: "0", lizing: "0", poistenie: "0", sukromne: false, casVymeny: "", aktivne: true,
  // Zmluvné údaje — všetko ako text (prázdny = nevyplnené)
  vin: "", rokVyroby: "", cisloTp: "", datumPrvejEvidencie: "",
  vlastnikTyp: "ETAXI" as VlastnikTyp, vlastnikFleetId: "",
  poistovna: "", pzpCislo: "", pzpPlatnostDo: "", havCislo: "", havPlatnostDo: "",
  stkPlatnostDo: "", ekPlatnostDo: "", stavKm: "", kaucia: "", spoluucast: "",
};

/** Prázdny text → null, inak číslo (čiarka aj bodka). */
const numOrNull = (v: string) => (v.trim() === "" ? null : parseDecimal(v));

export default function VozidlaPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [list, setList] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [fleets, setFleets] = useState<FleetOption[]>([]);

  function load() {
    apiFetch<{ vehicles: Vehicle[] }>("/api/portal/vehicles").then((d) => setList(d.vehicles));
  }
  useEffect(load, []);

  // Zoznam flotíl — API vznikne neskôr; pri chybe (404) ostane zoznam prázdny.
  useEffect(() => {
    apiFetch<{ fleets: FleetOption[] }>("/api/portal/fleets")
      .then((d) => setFleets(Array.isArray(d.fleets) ? d.fleets : []))
      .catch(() => setFleets([]));
  }, []);

  // Odkaz z validácie zmluvy: ?edit=<id> otvorí dialóg úpravy vozidla; parameter potom z URL odstránime.
  useEffect(() => {
    if (!router.isReady || list.length === 0) return;
    const raw = router.query.edit;
    if (raw === undefined) return;
    const id = Number(Array.isArray(raw) ? raw[0] : raw);
    const v = list.find((x) => x.id === id);
    if (v) openEdit(v);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { edit: _edit, ...rest } = router.query;
    router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.edit, list]);

  function openNew() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(v: Vehicle) {
    setEditing(v);
    setForm({
      nazov: v.nazov, znacka: v.znacka, model: v.model, farba: v.farba, spz: v.spz,
      druhPohonu: v.druhPohonu,
      poplatokZaSmenu: String(v.poplatokZaSmenu), poplatokZa24h: String(v.poplatokZa24h), lizing: String(v.lizing), poistenie: String(v.poistenie),
      sukromne: v.sukromne, casVymeny: v.casVymeny ?? "", aktivne: v.aktivne,
      vin: v.vin ?? "", rokVyroby: v.rokVyroby === null ? "" : String(v.rokVyroby),
      cisloTp: v.cisloTp ?? "", datumPrvejEvidencie: v.datumPrvejEvidencie ?? "",
      vlastnikTyp: v.vlastnikTyp ?? "ETAXI",
      vlastnikFleetId: v.vlastnikFleetId === null ? "" : String(v.vlastnikFleetId),
      poistovna: v.poistovna ?? "", pzpCislo: v.pzpCislo ?? "", pzpPlatnostDo: v.pzpPlatnostDo ?? "",
      havCislo: v.havCislo ?? "", havPlatnostDo: v.havPlatnostDo ?? "",
      stkPlatnostDo: v.stkPlatnostDo ?? "", ekPlatnostDo: v.ekPlatnostDo ?? "",
      stavKm: v.stavKm === null ? "" : String(v.stavKm),
      kaucia: v.kaucia === null ? "" : String(v.kaucia),
      spoluucast: v.spoluucast === null ? "" : String(v.spoluucast),
    });
    setOpen(true);
  }

  async function save() {
    const payload = {
      ...form,
      poplatokZaSmenu: parseDecimal(form.poplatokZaSmenu),
      poplatokZa24h: parseDecimal(form.poplatokZa24h),
      lizing: parseDecimal(form.lizing),
      poistenie: parseDecimal(form.poistenie),
      // Zmluvné údaje: prázdne polia idú ako null (server ich vymaže).
      vin: form.vin.trim() === "" ? null : form.vin.trim().toUpperCase(),
      rokVyroby: numOrNull(form.rokVyroby),
      vlastnikFleetId: form.vlastnikTyp === "FLOTILA" && form.vlastnikFleetId ? Number(form.vlastnikFleetId) : null,
      stavKm: form.stavKm.trim() === "" ? null : Math.round(parseDecimal(form.stavKm)),
      kaucia: numOrNull(form.kaucia),
      spoluucast: numOrNull(form.spoluucast),
    };
    try {
      if (editing) {
        await apiFetch(`/api/portal/vehicles/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/api/portal/vehicles", { method: "POST", body: JSON.stringify(payload) });
      }
      setOpen(false); load();
      toast({ title: "Uložené" });
    } catch (e) {
      toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  }

  async function remove(v: Vehicle) {
    if (!confirm(`Zmazať vozidlo ${v.nazov} (${v.spz})?`)) return;
    try {
      await apiFetch(`/api/portal/vehicles/${v.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  }

  return (
    <PortalLayout title="Vozidlá">
      <Head><title>Vozidlá — E-TAXI Portál</title></Head>

      <div className="mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}>+ Pridať vozidlo</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Upraviť vozidlo" : "Nové vozidlo"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label>Názov (napr. Tesla 3)</Label><Input value={form.nazov} onChange={(e) => setForm({ ...form, nazov: e.target.value })} /></div>
              <div><Label>Značka</Label><Input value={form.znacka} onChange={(e) => setForm({ ...form, znacka: e.target.value })} /></div>
              <div><Label>Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
              <div><Label>Farba</Label><Input value={form.farba} onChange={(e) => setForm({ ...form, farba: e.target.value })} /></div>
              <div><Label>ŠPZ</Label><Input value={form.spz} onChange={(e) => setForm({ ...form, spz: e.target.value })} /></div>
              <div>
                <Label>Druh pohonu</Label>
                <Select value={form.druhPohonu} onValueChange={(v) => setForm({ ...form, druhPohonu: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{POHONY.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Poplatok za smenu (12h) (€)</Label><Input type="text" inputMode="decimal" placeholder="0,00" value={form.poplatokZaSmenu} onChange={(e) => setForm({ ...form, poplatokZaSmenu: sanitizeDecimalInput(e.target.value) })} /></div>
              <div><Label>Poplatok za 24h prenájom (€)</Label><Input type="text" inputMode="decimal" placeholder="0,00" value={form.poplatokZa24h} onChange={(e) => setForm({ ...form, poplatokZa24h: sanitizeDecimalInput(e.target.value) })} /></div>
              <div><Label>Čas výmeny (D↔N)</Label><Input type="time" value={form.casVymeny} onChange={(e) => setForm({ ...form, casVymeny: e.target.value })} /></div>
              <div><Label>Lízing / mesiac (€)</Label><Input type="text" inputMode="decimal" placeholder="0,00" value={form.lizing} onChange={(e) => setForm({ ...form, lizing: sanitizeDecimalInput(e.target.value) })} /></div>
              <div><Label>Poistenie / mesiac (€)</Label><Input type="text" inputMode="decimal" placeholder="0,00" value={form.poistenie} onChange={(e) => setForm({ ...form, poistenie: sanitizeDecimalInput(e.target.value) })} /></div>
              <div className="col-span-2 flex items-center gap-2 pt-1">
                <Checkbox id="sukromne" checked={form.sukromne} onCheckedChange={(v) => setForm({ ...form, sukromne: !!v })} />
                <Label htmlFor="sukromne" className="font-normal cursor-pointer">Súkromné vozidlo (neponúka sa medzi voľnými smenami)</Label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Lízing a poistenie sa automaticky prenesú do mesačných výdavkov.</p>
            <Collapsible className="border rounded-md">
              <CollapsibleTrigger className="w-full text-left px-3 py-2 text-sm font-medium hover:bg-muted/50">
                Zmluvné údaje ▾
              </CollapsibleTrigger>
              <CollapsibleContent className="grid grid-cols-2 gap-3 px-3 pb-3 pt-1">
                <div className="col-span-2"><Label>VIN (17 znakov)</Label><Input maxLength={17} value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })} /></div>
                <div><Label>Rok výroby</Label><Input type="text" inputMode="numeric" maxLength={4} placeholder="napr. 2021" value={form.rokVyroby} onChange={(e) => setForm({ ...form, rokVyroby: e.target.value.replace(/\D/g, "") })} /></div>
                <div><Label>Číslo TP</Label><Input value={form.cisloTp} onChange={(e) => setForm({ ...form, cisloTp: e.target.value })} /></div>
                <div><Label>Dátum prvej evidencie</Label><Input type="date" value={form.datumPrvejEvidencie} onChange={(e) => setForm({ ...form, datumPrvejEvidencie: e.target.value })} /></div>
                <div>
                  <Label>Vlastník vozidla</Label>
                  <Select value={form.vlastnikTyp} onValueChange={(v) => setForm({ ...form, vlastnikTyp: v as VlastnikTyp, vlastnikFleetId: v === "FLOTILA" ? form.vlastnikFleetId : "" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETAXI">E-TAXI</SelectItem>
                      <SelectItem value="FLOTILA">Flotila</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.vlastnikTyp === "FLOTILA" && (
                  <div className="col-span-2">
                    <Label>Flotila</Label>
                    {fleets.length > 0 ? (
                      <Select value={form.vlastnikFleetId} onValueChange={(v) => setForm({ ...form, vlastnikFleetId: v })}>
                        <SelectTrigger><SelectValue placeholder="Vyberte flotilu" /></SelectTrigger>
                        <SelectContent>{fleets.map((f) => <SelectItem key={f.id} value={String(f.id)}>{f.obchodneMeno}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : (
                      <p className="text-xs text-muted-foreground pt-1">Zoznam flotíl zatiaľ nie je k dispozícii.</p>
                    )}
                  </div>
                )}
                <div className="col-span-2"><Label>Poisťovňa</Label><Input value={form.poistovna} onChange={(e) => setForm({ ...form, poistovna: e.target.value })} /></div>
                <div><Label>PZP – číslo poistky</Label><Input value={form.pzpCislo} onChange={(e) => setForm({ ...form, pzpCislo: e.target.value })} /></div>
                <div><Label>PZP – platnosť do</Label><Input type="date" value={form.pzpPlatnostDo} onChange={(e) => setForm({ ...form, pzpPlatnostDo: e.target.value })} /></div>
                <div><Label>Havarijné – číslo poistky</Label><Input value={form.havCislo} onChange={(e) => setForm({ ...form, havCislo: e.target.value })} /></div>
                <div><Label>Havarijné – platnosť do</Label><Input type="date" value={form.havPlatnostDo} onChange={(e) => setForm({ ...form, havPlatnostDo: e.target.value })} /></div>
                <div><Label>STK – platnosť do</Label><Input type="date" value={form.stkPlatnostDo} onChange={(e) => setForm({ ...form, stkPlatnostDo: e.target.value })} /></div>
                <div><Label>EK – platnosť do</Label><Input type="date" value={form.ekPlatnostDo} onChange={(e) => setForm({ ...form, ekPlatnostDo: e.target.value })} /></div>
                <div><Label>Stav km</Label><Input type="text" inputMode="numeric" placeholder="0" value={form.stavKm} onChange={(e) => setForm({ ...form, stavKm: e.target.value.replace(/\D/g, "") })} /></div>
                <div />
                <div><Label>Kaucia (€)</Label><Input type="text" inputMode="decimal" placeholder="0,00" value={form.kaucia} onChange={(e) => setForm({ ...form, kaucia: sanitizeDecimalInput(e.target.value) })} /></div>
                <div><Label>Spoluúčasť (€)</Label><Input type="text" inputMode="decimal" placeholder="0,00" value={form.spoluucast} onChange={(e) => setForm({ ...form, spoluucast: sanitizeDecimalInput(e.target.value) })} /></div>
                <p className="col-span-2 text-xs text-muted-foreground">Kaucia a spoluúčasť sú predvolené hodnoty pre zmluvu; nájomné sa preberá z poplatkov za smenu a 24h.</p>
              </CollapsibleContent>
            </Collapsible>
            <DialogFooter><Button onClick={save}>Uložiť</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Názov</TableHead><TableHead>Značka / Model</TableHead>
              <TableHead>Farba</TableHead><TableHead>ŠPZ</TableHead>
              <TableHead>Pohon</TableHead><TableHead>Poplatok/smena</TableHead><TableHead>Poplatok/24h</TableHead>
              <TableHead>Čas výmeny</TableHead><TableHead>Stav</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.nazov}</TableCell>
                <TableCell>{v.znacka} {v.model}</TableCell>
                <TableCell>{v.farba}</TableCell>
                <TableCell>{v.spz}</TableCell>
                <TableCell>{v.druhPohonu}</TableCell>
                <TableCell>{formatEur(v.poplatokZaSmenu)}</TableCell>
                <TableCell>{formatEur(v.poplatokZa24h)}</TableCell>
                <TableCell>{v.casVymeny || "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {v.aktivne ? <Badge className="bg-green-600">Aktívne</Badge> : <Badge variant="secondary">Neaktívne</Badge>}
                    {v.sukromne && <Badge variant="outline">Súkromné</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(v)}>Upraviť</Button>
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(v)}>Zmazať</Button>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-6">Zatiaľ žiadne vozidlá.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </PortalLayout>
  );
}
