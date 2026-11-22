"use client";

import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatEur, parseDecimal, sanitizeDecimalInput } from "@/lib/portalClient";
import { isoWeekParts, vypocitajPoplatky } from "@/lib/fees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type Driver = { id: number; meno: string; priezvisko: string; volaciZnak: string | null };
type Revenue = {
  id: number; driverId: number; isoRok: number; isoTyzden: number;
  trzba: number; poplatokApp: number; provizia: number; celkovyPoplatok: number;
  uhradene: boolean;
};

export default function TrzbyPage() {
  const { toast } = useToast();
  const now = isoWeekParts(new Date());
  const [rok, setRok] = useState(now.isoRok);
  const [tyzden, setTyzden] = useState(now.isoTyzden);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [inputs, setInputs] = useState<Record<number, string>>({});

  const load = useCallback(() => {
    apiFetch<{ drivers: Driver[] }>("/api/portal/refs").then((d) => setDrivers(d.drivers));
    apiFetch<{ revenues: Revenue[] }>(`/api/portal/revenues?rok=${rok}&tyzden=${tyzden}`).then((d) => {
      setRevenues(d.revenues);
      const map: Record<number, string> = {};
      d.revenues.forEach((r) => { map[r.driverId] = String(r.trzba); });
      setInputs(map);
    });
  }, [rok, tyzden]);
  useEffect(load, [load]);

  function revFor(driverId: number) { return revenues.find((r) => r.driverId === driverId); }

  async function saveTrzba(driverId: number) {
    const val = inputs[driverId];
    if (val === undefined || val === "") return;
    try {
      await apiFetch("/api/portal/revenues", {
        method: "POST",
        body: JSON.stringify({ driverId, isoRok: rok, isoTyzden: tyzden, trzba: parseDecimal(val) }),
      });
      load(); toast({ title: "Tržba uložená" });
    } catch (e) { toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  }

  async function togglePaid(r: Revenue) {
    await apiFetch(`/api/portal/revenues/${r.id}`, { method: "PUT", body: JSON.stringify({ uhradene: !r.uhradene }) });
    load();
  }

  // Živý náhľad poplatkov podľa zadanej tržby (predvolené sadzby).
  function preview(driverId: number) {
    const val = inputs[driverId];
    if (!val) return null;
    return vypocitajPoplatky(parseDecimal(val));
  }

  const sum = (k: "trzba" | "poplatokApp" | "provizia" | "celkovyPoplatok") =>
    revenues.reduce((s, r) => s + Number(r[k]), 0);

  return (
    <PortalLayout title="Tržby a poplatky">
      <Head><title>Tržby a poplatky — E-TAXI Portál</title></Head>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div><Label>Rok</Label><Input type="number" className="w-24" value={rok} onChange={(e) => setRok(Number(e.target.value))} /></div>
        <div><Label>ISO týždeň</Label><Input type="number" min={1} max={53} className="w-24" value={tyzden} onChange={(e) => setTyzden(Number(e.target.value))} /></div>
        <Badge variant="secondary" className="mb-2">Týždeň {tyzden}/{rok}</Badge>
        <span className="text-xs text-muted-foreground mb-2">Poplatok app podľa pásiem + provízia 15 %. Zadajte tržbu a uložte.</span>
      </div>

      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vodič</TableHead><TableHead>Tržba (€)</TableHead>
              <TableHead>Poplatok app</TableHead><TableHead>Provízia 15 %</TableHead>
              <TableHead>Celkový poplatok</TableHead><TableHead>Uhradené</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((dr) => {
              const r = revFor(dr.id);
              const pv = preview(dr.id);
              return (
                <TableRow key={dr.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {dr.priezvisko} {dr.meno}{dr.volaciZnak ? <span className="text-muted-foreground"> · {dr.volaciZnak}</span> : null}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text" inputMode="decimal" placeholder="0,00" className="w-28"
                      value={inputs[dr.id] ?? ""}
                      onChange={(e) => setInputs({ ...inputs, [dr.id]: sanitizeDecimalInput(e.target.value) })}
                      onBlur={() => saveTrzba(dr.id)}
                    />
                  </TableCell>
                  <TableCell>{formatEur(r?.poplatokApp ?? pv?.poplatokApp ?? 0)}</TableCell>
                  <TableCell>{formatEur(r?.provizia ?? pv?.provizia ?? 0)}</TableCell>
                  <TableCell className="font-semibold">{formatEur(r?.celkovyPoplatok ?? pv?.celkovyPoplatok ?? 0)}</TableCell>
                  <TableCell>
                    {r ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={r.uhradene} onCheckedChange={() => togglePaid(r)} />
                        {r.uhradene ? <Badge className="bg-green-600">Áno</Badge> : <Badge variant="destructive">Nie</Badge>}
                      </label>
                    ) : <span className="text-muted-foreground text-sm">—</span>}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => saveTrzba(dr.id)}>Uložiť</Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {drivers.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Žiadni vodiči.</TableCell></TableRow>}
          </TableBody>
          {revenues.length > 0 && (
            <tfoot>
              <tr className="border-t bg-muted/40 font-semibold">
                <td className="p-2">SÚČET {tyzden}/{rok} ({revenues.length} vod.)</td>
                <td className="p-2">{formatEur(sum("trzba"))}</td>
                <td className="p-2">{formatEur(sum("poplatokApp"))}</td>
                <td className="p-2">{formatEur(sum("provizia"))}</td>
                <td className="p-2">{formatEur(sum("celkovyPoplatok"))}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
    </PortalLayout>
  );
}
