"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
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
import { useToast } from "@/hooks/use-toast";

type Vehicle = {
  id: number; nazov: string; znacka: string; model: string; farba: string;
  spz: string; druhPohonu: string; poplatokZaSmenu: number; poplatokZa24h: number; lizing: number; poistenie: number;
  sukromne: boolean; casVymeny: string | null; aktivne: boolean;
};

const POHONY = ["ELEKTRO", "HYBRID", "BENZIN", "DIESEL", "LPG", "CNG"];
const empty = { nazov: "", znacka: "", model: "", farba: "", spz: "", druhPohonu: "ELEKTRO", poplatokZaSmenu: "0", poplatokZa24h: "0", lizing: "0", poistenie: "0", sukromne: false, casVymeny: "", aktivne: true };

export default function VozidlaPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);

  function load() {
    apiFetch<{ vehicles: Vehicle[] }>("/api/portal/vehicles").then((d) => setList(d.vehicles));
  }
  useEffect(load, []);

  function openNew() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(v: Vehicle) {
    setEditing(v);
    setForm({
      nazov: v.nazov, znacka: v.znacka, model: v.model, farba: v.farba, spz: v.spz,
      druhPohonu: v.druhPohonu,
      poplatokZaSmenu: String(v.poplatokZaSmenu), poplatokZa24h: String(v.poplatokZa24h), lizing: String(v.lizing), poistenie: String(v.poistenie),
      sukromne: v.sukromne, casVymeny: v.casVymeny ?? "", aktivne: v.aktivne,
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
          <DialogContent>
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
