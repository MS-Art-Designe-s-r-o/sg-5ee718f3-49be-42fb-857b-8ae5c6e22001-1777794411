"use client";

import { useEffect, useState } from "react";
import { apiFetch, formatDate } from "@/lib/portalClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export type FreeSlotVehicle = {
  vehicleId: number;
  nazov: string;
  spz: string;
  volneSmeny: { datum: string; typ: "DENNA" | "NOCNA" }[];
  pocetVolnych: number;
  pocetCelkom: number;
};

type Driver = { id: number; meno: string; priezvisko: string; volaciZnak: string | null };

export function FreeSlotsView({
  vozidla,
  canAssignOthers = false,
  onAssigned,
}: {
  vozidla: FreeSlotVehicle[];
  canAssignOthers?: boolean;
  onAssigned?: () => void;
}) {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [pick, setPick] = useState<{ vehicleId: number; nazov: string; datum: string; typ: "DENNA" | "NOCNA" } | null>(null);
  const [driverId, setDriverId] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (canAssignOthers) {
      apiFetch<{ drivers: Driver[] }>("/api/portal/refs").then((d) => setDrivers(d.drivers)).catch(() => {});
    }
  }, [canAssignOthers]);

  async function assign(vehicleId: number, datum: string, typ: "DENNA" | "NOCNA", dId?: number) {
    setBusy(true);
    try {
      await apiFetch("/api/portal/free-slots/assign", {
        method: "POST",
        body: JSON.stringify({ vehicleId, datum, typ, driverId: dId }),
      });
      toast({ title: "Smena priradená" });
      setPick(null);
      onAssigned?.();
    } catch (e) {
      toast({ title: "Nepodarilo sa priradiť", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  function onSlotClick(v: FreeSlotVehicle, s: { datum: string; typ: "DENNA" | "NOCNA" }) {
    if (canAssignOthers) {
      setDriverId(drivers[0] ? String(drivers[0].id) : "");
      setPick({ vehicleId: v.vehicleId, nazov: v.nazov, datum: s.datum, typ: s.typ });
    } else {
      if (confirm(`Priradiť si smenu ${s.typ === "DENNA" ? "denná" : "nočná"} ${formatDate(s.datum)} na ${v.nazov}?`)) {
        assign(v.vehicleId, s.datum, s.typ);
      }
    }
  }

  if (!vozidla.length) {
    return <p className="text-muted-foreground text-sm">Žiadne aktívne vozidlá.</p>;
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-3">
        {vozidla.map((v) => (
          <Card key={v.vehicleId}>
            <CardContent className="p-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-medium">{v.nazov} <span className="text-muted-foreground text-sm">({v.spz})</span></span>
                <span className="text-sm text-muted-foreground">{v.pocetVolnych} voľných</span>
              </div>
              {v.volneSmeny.length === 0 ? (
                <p className="text-sm text-green-600">Žiadne voľné smeny 👍</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {v.volneSmeny.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => onSlotClick(v, s)}
                      title="Kliknutím priradiť smenu"
                    >
                      <Badge
                        variant="outline"
                        className={`cursor-pointer hover:ring-2 ring-[#282462]/40 ${s.typ === "DENNA" ? "border-amber-400 text-amber-700" : "border-indigo-400 text-indigo-700"}`}
                      >
                        {formatDate(s.datum)} {s.typ === "DENNA" ? "D" : "N"}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {pick && (
        <Dialog open onOpenChange={(o) => !o && setPick(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Priradiť smenu</DialogTitle>
            </DialogHeader>
            <p className="text-sm">
              {pick.nazov} · {pick.typ === "DENNA" ? "denná" : "nočná"} · {formatDate(pick.datum)}
            </p>
            <div>
              <Label>Vodič</Label>
              <Select value={driverId} onValueChange={setDriverId}>
                <SelectTrigger><SelectValue placeholder="Vyberte vodiča" /></SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.volaciZnak ? `${d.volaciZnak} · ` : ""}{d.priezvisko} {d.meno}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button disabled={busy || !driverId} onClick={() => assign(pick.vehicleId, pick.datum, pick.typ, Number(driverId))}>
                Priradiť
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
