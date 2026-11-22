"use client";

import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatEur, formatDate, SHIFT_LABELS } from "@/lib/portalClient";
import { isoWeekParts } from "@/lib/fees";
import { FreeSlotsView, type FreeSlotVehicle } from "@/components/portal/FreeSlots";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Obdobie = "tyzden" | "mesiac";
type Shift = {
  id: number; datum: string; typ: "DENNA" | "NOCNA" | "VOLNO" | "H24";
  poplatokZaSmenu: number | null; poplatokUhradeny: boolean;
  vehicle: { nazov: string; spz: string; casVymeny: string | null } | null;
};

const MESIACE = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December",
];

export default function MojeSmenyPage() {
  const now = isoWeekParts(new Date());
  const [obdobie, setObdobie] = useState<Obdobie>("tyzden");
  const [rok, setRok] = useState(now.isoRok);
  const [tyzden, setTyzden] = useState(now.isoTyzden);
  const [mesiac, setMesiac] = useState(new Date().getMonth() + 1);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [freeSlots, setFreeSlots] = useState<FreeSlotVehicle[]>([]);

  const load = useCallback(() => {
    const qs = `obdobie=${obdobie}&rok=${rok}&tyzden=${tyzden}&mesiac=${mesiac}`;
    apiFetch<{ shifts: Shift[] }>(`/api/portal/me/shifts?${qs}`).then((d) => setShifts(d.shifts));
    apiFetch<{ vozidla: FreeSlotVehicle[] }>(`/api/portal/free-slots?${qs}`).then((d) => setFreeSlots(d.vozidla));
  }, [obdobie, rok, tyzden, mesiac]);
  useEffect(load, [load]);

  return (
    <PortalLayout title="Moje smeny">
      <Head><title>Moje smeny — E-TAXI Portál</title></Head>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <Label>Obdobie</Label>
          <Select value={obdobie} onValueChange={(v) => setObdobie(v as Obdobie)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tyzden">Týždeň</SelectItem>
              <SelectItem value="mesiac">Mesiac</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Rok</Label><Input type="number" className="w-24" value={rok} onChange={(e) => setRok(Number(e.target.value))} /></div>
        {obdobie === "tyzden" && (
          <div><Label>ISO týždeň</Label><Input type="number" min={1} max={53} className="w-24" value={tyzden} onChange={(e) => setTyzden(Number(e.target.value))} /></div>
        )}
        {obdobie === "mesiac" && (
          <div>
            <Label>Mesiac</Label>
            <Select value={String(mesiac)} onValueChange={(v) => setMesiac(Number(v))}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>{MESIACE.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Voľné smeny na vozidlách</CardTitle></CardHeader>
          <CardContent><FreeSlotsView vozidla={freeSlots} onAssigned={load} /></CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-2">Moje smeny</h2>
          <div className="bg-white rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dátum</TableHead><TableHead>Smena</TableHead>
                  <TableHead>Vozidlo</TableHead><TableHead>Čas výmeny</TableHead><TableHead>Poplatok za prenájom</TableHead><TableHead>Stav úhrady</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{formatDate(s.datum)}</TableCell>
                    <TableCell>{SHIFT_LABELS[s.typ]}</TableCell>
                    <TableCell>{s.vehicle ? `${s.vehicle.nazov} (${s.vehicle.spz})` : "—"}</TableCell>
                    <TableCell>{s.typ !== "VOLNO" && s.vehicle?.casVymeny ? s.vehicle.casVymeny : "—"}</TableCell>
                    <TableCell>{s.poplatokZaSmenu != null ? formatEur(s.poplatokZaSmenu) : "—"}</TableCell>
                    <TableCell>
                      {s.typ === "VOLNO" || s.poplatokZaSmenu == null ? "—"
                        : s.poplatokUhradeny ? <Badge className="bg-green-600">Uhradený</Badge> : <Badge variant="destructive">Neuhradený</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
                {shifts.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Žiadne smeny za obdobie.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
