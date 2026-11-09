"use client";

// Zmluvy vodiča (len MAJITEL): zoznam, sťahovanie, zmena stavu, regenerácia (nová verzia).
import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch, formatDate } from "@/lib/portalClient";
import { describeApiError } from "@/lib/fieldLabels";
import { ContractProblems, type ContractMissing, type ContractWarning } from "@/components/portal/GenerateContractDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Typ = "NAJOM" | "DISPECING";
type Stav = "NAVRH" | "VYGENEROVANA" | "PODPISANA" | "UKONCENA" | "NAHRADENA";

type Contract = {
  id: number; cislo: string; verzia: number; typ: Typ; stav: Stav;
  datumUzavretia: string; platnostOd: string; platnostDo: string | null;
  vozidloEcv: string | null; hasDocx: boolean; hasPdf: boolean; nahradzaId: number | null;
};

const TYP_LABELS: Record<Typ, string> = { NAJOM: "Nájom vozidla", DISPECING: "Dispečerské služby" };

const STAV_LABELS: Record<Stav, string> = {
  NAVRH: "Návrh",
  VYGENEROVANA: "Vygenerovaná",
  PODPISANA: "Podpísaná",
  UKONCENA: "Ukončená",
  NAHRADENA: "Nahradená",
};

const STAV_CLASS: Record<Stav, string> = {
  NAVRH: "bg-gray-500",
  VYGENEROVANA: "bg-blue-600",
  PODPISANA: "bg-green-600",
  UKONCENA: "bg-slate-800",
  NAHRADENA: "bg-gray-400",
};

// Povolené prechody (zrkadlo servera; autoritatívna je kontrola na serveri).
const TRANSITIONS: Record<Stav, Stav[]> = {
  NAVRH: ["VYGENEROVANA"],
  VYGENEROVANA: ["PODPISANA", "UKONCENA"],
  PODPISANA: ["UKONCENA"],
  UKONCENA: [],
  NAHRADENA: [],
};

export function DriverContractsList({
  driver,
  onClose,
}: {
  driver: { id: number; meno: string; priezvisko: string };
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [list, setList] = useState<Contract[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [problems, setProblems] = useState<{ chybajuce: ContractMissing[]; varovania: ContractWarning[] } | null>(null);

  const fail = useCallback(
    (e: unknown) => toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" }),
    [toast]
  );

  const load = useCallback(() => {
    apiFetch<{ zmluvy: Contract[] }>(`/api/portal/contracts?driverId=${driver.id}`)
      .then((d) => setList(d.zmluvy))
      .catch((e) => { setList([]); fail(e); });
  }, [driver.id, fail]);
  useEffect(load, [load]);

  // Autorizovaný GET s cookie — prehliadač stiahne súbor (attachment).
  function download(c: Contract, format: "docx" | "pdf") {
    window.location.href = `/api/portal/contracts/${c.id}/download?format=${format}`;
  }

  async function changeStav(c: Contract, na: Stav) {
    if (na === "PODPISANA" && !confirm(`Označiť zmluvu ${c.cislo} ako podpísanú? Dnešný dátum sa uloží ako dátum podpisu.`)) return;
    if (na === "UKONCENA" && !confirm(`Ukončiť zmluvu ${c.cislo}? Zmenu nie je možné vrátiť späť.`)) return;
    setBusyId(c.id);
    try {
      await apiFetch(`/api/portal/contracts/${c.id}`, { method: "PATCH", body: JSON.stringify({ stav: na }) });
      toast({ title: "Stav zmluvy zmenený" });
      load();
    } catch (e) {
      fail(e);
    } finally {
      setBusyId(null);
    }
  }

  async function regenerate(c: Contract) {
    const extra = c.stav === "PODPISANA" ? " Nová verzia bude vo stave Vygenerovaná a bude ju treba znova podpísať." : "";
    if (!confirm(
      `Vygenerovať zmluvu ${c.cislo} znova? Vznikne nová verzia z aktuálnych údajov a aktívnej šablóny, ` +
      `pôvodná verzia ${c.verzia} sa označí ako nahradená.${extra}`
    )) return;
    setBusyId(c.id);
    setProblems(null);
    try {
      const r = await apiFetch<{ cislo: string; verzia: number; pdfVarovanie?: string }>(
        `/api/portal/contracts/${c.id}/regenerate`, { method: "POST", body: JSON.stringify({}) }
      );
      toast({ title: `Vznikla verzia ${r.verzia}`, description: r.pdfVarovanie ?? `Zmluva ${r.cislo}` });
      load();
    } catch (e) {
      if (e instanceof ApiError && e.status === 422 && Array.isArray(e.data.chybajuce)) {
        setProblems({
          chybajuce: e.data.chybajuce as ContractMissing[],
          varovania: Array.isArray(e.data.varovania) ? (e.data.varovania as ContractWarning[]) : [],
        });
      } else {
        fail(e);
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Zmluvy — {driver.priezvisko} {driver.meno}</DialogTitle>
        </DialogHeader>

        {problems && <ContractProblems chybajuce={problems.chybajuce} varovania={problems.varovania} />}

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Číslo</TableHead><TableHead>Verzia</TableHead><TableHead>Typ</TableHead>
                <TableHead>Vozidlo</TableHead><TableHead>Uzavretá</TableHead><TableHead>Stav</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(list ?? []).map((c) => {
                const next = TRANSITIONS[c.stav];
                return (
                  <TableRow key={c.id} className={c.stav === "NAHRADENA" ? "opacity-50" : undefined}>
                    <TableCell className="font-medium whitespace-nowrap">{c.cislo}</TableCell>
                    <TableCell>v{c.verzia}</TableCell>
                    <TableCell>{TYP_LABELS[c.typ]}</TableCell>
                    <TableCell>{c.vozidloEcv || "—"}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(c.datumUzavretia)}</TableCell>
                    <TableCell><Badge className={STAV_CLASS[c.stav]}>{STAV_LABELS[c.stav]}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1">
                        {c.hasDocx && <Button size="sm" variant="ghost" onClick={() => download(c, "docx")}>Stiahnuť DOCX</Button>}
                        {c.hasPdf && <Button size="sm" variant="ghost" onClick={() => download(c, "pdf")}>Stiahnuť PDF</Button>}
                        {next.length > 0 && (
                          <Select value="" onValueChange={(v) => changeStav(c, v as Stav)} disabled={busyId === c.id}>
                            <SelectTrigger className="h-8 w-[150px]"><SelectValue placeholder="Zmeniť stav…" /></SelectTrigger>
                            <SelectContent>
                              {next.map((s) => <SelectItem key={s} value={s}>{STAV_LABELS[s]}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                        {(c.stav === "NAVRH" || c.stav === "VYGENEROVANA" || c.stav === "PODPISANA") && (
                          <Button size="sm" variant="ghost" disabled={busyId === c.id} onClick={() => regenerate(c)}>
                            Vygenerovať znova (nová verzia)
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {list === null && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Načítavam…</TableCell></TableRow>
              )}
              {list !== null && list.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Zatiaľ žiadne zmluvy</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter><Button variant="outline" onClick={onClose}>Zavrieť</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
