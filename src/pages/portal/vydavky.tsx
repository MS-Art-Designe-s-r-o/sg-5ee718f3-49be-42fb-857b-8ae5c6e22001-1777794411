"use client";

import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatEur, formatDate, sanitizeDecimalInput } from "@/lib/portalClient";
import { INTERVAL_LABELS, type ExpenseInterval } from "@/lib/expenses";
import { isoWeekParts, type Obdobie } from "@/lib/fees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Category = { id: number; nazov: string; aktivna: boolean };
type Expense = {
  id: number; datum: string; zaciatok?: string; popis: string; suma: number; uhradene: boolean;
  pravidelny: boolean; interval: ExpenseInterval | null;
  categoryId: number; kategoria: string; vozidlo: string | null; zdroj: string;
};
type Summary = {
  obdobie: { typ: Obdobie; label: string };
  spolu: number;
  podlaKategorii: { kategoria: string; suma: number }[];
};

const INTERVALS: ExpenseInterval[] = ["TYZDENNE", "MESACNE", "STVRTROCNE", "POLROCNE", "ROCNE"];
const MESIACE = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December",
];
const CHART_COLORS = [
  "#282462", "#ff9500", "#28a745", "#e83e8c", "#17a2b8",
  "#6f42c1", "#fd7e14", "#20c997", "#dc3545", "#6610f2",
];
const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = {
  datum: today(), popis: "", categoryId: "", suma: "",
  uhradene: false, pravidelny: false, interval: "MESACNE" as ExpenseInterval,
};

export default function VydavkyPage() {
  const { toast } = useToast();
  const now = isoWeekParts(new Date());
  const [obdobie, setObdobie] = useState<Obdobie>("mesiac");
  const [rok, setRok] = useState(now.isoRok);
  const [tyzden, setTyzden] = useState(now.isoTyzden);
  const [mesiac, setMesiac] = useState(new Date().getMonth() + 1);
  const [list, setList] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [pocetStran, setPocetStran] = useState(1);
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [delTarget, setDelTarget] = useState<Expense | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  const loadCats = useCallback(() => {
    apiFetch<{ categories: Category[] }>("/api/portal/expense-categories").then((d) => setCategories(d.categories));
  }, []);
  const load = useCallback(() => {
    apiFetch<{ expenses: Expense[]; total: number; page: number; pocetStran: number }>(
      `/api/portal/expenses?obdobie=${obdobie}&rok=${rok}&tyzden=${tyzden}&mesiac=${mesiac}&page=${page}&pageSize=${pageSize}`
    ).then((d) => { setList(d.expenses); setTotal(d.total); setPocetStran(d.pocetStran); setPage(d.page); });
    apiFetch<Summary>(`/api/portal/expenses/summary?obdobie=${obdobie}&rok=${rok}&tyzden=${tyzden}&mesiac=${mesiac}`)
      .then(setSummary).catch(() => setSummary(null));
  }, [rok, obdobie, tyzden, mesiac, page, pageSize]);
  useEffect(() => { loadCats(); }, [loadCats]);
  useEffect(() => { load(); }, [load]);
  // Pri zmene obdobia / filtra / veľkosti stránky sa vrátime na 1. stranu.
  useEffect(() => { setPage(1); }, [obdobie, rok, tyzden, mesiac, pageSize]);

  const activeCats = categories.filter((c) => c.aktivna);

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm, datum: today(), categoryId: activeCats[0] ? String(activeCats[0].id) : "" });
    setOpen(true);
  }
  function openEdit(e: Expense) {
    setEditing(e);
    setForm({
      // Pri pravidelnom výdavku upravujeme predpis — použijeme pôvodný začiatok, nie dátum výskytu.
      datum: (e.pravidelny ? e.zaciatok ?? e.datum : e.datum).slice(0, 10),
      popis: e.popis, categoryId: String(e.categoryId), suma: String(e.suma),
      uhradene: e.uhradene, pravidelny: e.pravidelny, interval: e.interval ?? "MESACNE",
    });
    setOpen(true);
  }

  async function save() {
    if (!form.categoryId) { toast({ title: "Vyberte kategóriu", variant: "destructive" }); return; }
    // Suma je textové pole (kvôli mobilnému Safari): akceptuj čiarku aj bodku.
    const sumaNum = parseFloat(String(form.suma).replace(",", "."));
    if (Number.isNaN(sumaNum) || sumaNum < 0) { toast({ title: "Zadajte platnú sumu", variant: "destructive" }); return; }
    const payload = {
      datum: form.datum, popis: form.popis, categoryId: Number(form.categoryId), suma: sumaNum,
      uhradene: form.uhradene, pravidelny: form.pravidelny,
      interval: form.pravidelny ? form.interval : null,
    };
    try {
      if (editing) await apiFetch(`/api/portal/expenses/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      else await apiFetch("/api/portal/expenses", { method: "POST", body: JSON.stringify(payload) });
      setOpen(false); load();
      toast({ title: "Uložené" });
    } catch (e) { toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  }

  async function togglePaid(e: Expense) {
    try {
      if (e.pravidelny) {
        // Úhrada per výskyt — neovplyvní ostatné mesiace.
        await apiFetch("/api/portal/expenses/occurrence", {
          method: "PUT",
          body: JSON.stringify({ expenseId: e.id, datum: e.datum, uhradene: !e.uhradene }),
        });
      } else {
        await apiFetch(`/api/portal/expenses/${e.id}`, { method: "PUT", body: JSON.stringify({ uhradene: !e.uhradene }) });
      }
      load();
    } catch (err) { toast({ title: "Chyba", description: err instanceof Error ? err.message : "", variant: "destructive" }); }
  }
  async function remove(e: Expense) {
    if (e.zdroj !== "MANUAL") { toast({ title: "Tento výdavok sa spravuje pri vozidle (lízing/poistenie).", variant: "destructive" }); return; }
    if (e.pravidelny) { setDelTarget(e); return; } // pravidelný → spýtaj sa na rozsah zmazania
    if (!confirm(`Zmazať výdavok „${e.popis}"?`)) return;
    try { await apiFetch(`/api/portal/expenses/${e.id}`, { method: "DELETE" }); load(); }
    catch (err) { toast({ title: "Chyba", description: err instanceof Error ? err.message : "", variant: "destructive" }); }
  }
  async function removeRecurring(scope: "one" | "series") {
    if (!delTarget) return;
    try {
      await apiFetch("/api/portal/expenses/occurrence", {
        method: "DELETE",
        body: JSON.stringify({ expenseId: delTarget.id, datum: delTarget.datum, scope }),
      });
      setDelTarget(null); load();
      toast({ title: scope === "series" ? "Výskyt aj nasledujúce zmazané" : "Výskyt zmazaný" });
    } catch (err) { toast({ title: "Chyba", description: err instanceof Error ? err.message : "", variant: "destructive" }); }
  }

  return (
    <PortalLayout title="Výdavky">
      <Head><title>Výdavky — E-TAXI Portál</title></Head>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <Label>Obdobie</Label>
          <Select value={obdobie} onValueChange={(v) => setObdobie(v as Obdobie)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tyzden">Týždeň</SelectItem>
              <SelectItem value="mesiac">Mesiac</SelectItem>
              <SelectItem value="rok">Rok</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Rok</Label><Input type="number" className="w-24" value={rok} onChange={(e) => setRok(Number(e.target.value))} /></div>
        {obdobie === "tyzden" && <div><Label>ISO týždeň</Label><Input type="number" min={1} max={53} className="w-24" value={tyzden} onChange={(e) => setTyzden(Number(e.target.value))} /></div>}
        {obdobie === "mesiac" && (
          <div><Label>Mesiac</Label>
            <Select value={String(mesiac)} onValueChange={(v) => setMesiac(Number(v))}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>{MESIACE.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="mb-0" onClick={openNew}>+ Pridať výdavok</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Upraviť výdavok" : "Nový výdavok"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Dátum</Label><Input type="date" value={form.datum} onChange={(e) => setForm({ ...form, datum: e.target.value })} /></div>
              <div><Label>Suma (€)</Label><Input type="text" inputMode="decimal" placeholder="0,00" value={form.suma} onChange={(e) => setForm({ ...form, suma: sanitizeDecimalInput(e.target.value) })} /></div>
              <div className="col-span-2"><Label>Popis</Label><Input value={form.popis} onChange={(e) => setForm({ ...form, popis: e.target.value })} /></div>
              <div className="col-span-2">
                <Label>Kategória</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Vyberte kategóriu" /></SelectTrigger>
                  <SelectContent>{activeCats.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.nazov}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.pravidelny} onCheckedChange={(v) => setForm({ ...form, pravidelny: !!v })} />
                  Pravidelný výdavok (predpis v intervale)
                </label>
              </div>
              {form.pravidelny && (
                <div className="col-span-2">
                  <Label>Interval</Label>
                  <Select value={form.interval} onValueChange={(v) => setForm({ ...form, interval: v as ExpenseInterval })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{INTERVALS.map((i) => <SelectItem key={i} value={i}>{INTERVAL_LABELS[i]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div className="col-span-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.uhradene} onCheckedChange={(v) => setForm({ ...form, uhradene: !!v })} />
                  Uhradené
                </label>
              </div>
            </div>
            <DialogFooter><Button onClick={save}>Uložiť</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={catOpen} onOpenChange={setCatOpen}>
          <DialogTrigger asChild><Button variant="outline" className="mb-0">Kategórie</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Kategórie výdavkov</DialogTitle></DialogHeader>
            <CategoryManager categories={categories} onChange={loadCats} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Súhrn za zvolené obdobie + rozloženie podľa kategórií */}
      {summary && (
        <div className="grid md:grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Výdavky spolu — {summary.obdobie.label}</div>
              <div className="text-2xl font-bold">{formatEur(summary.spolu)}</div>
              <div className="text-xs text-muted-foreground mt-1">vrátane rozpočítaných pravidelných výdavkov</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-lg">Rozloženie výdavkov podľa kategórií</CardTitle></CardHeader>
            <CardContent>
              {summary.podlaKategorii.length === 0
                ? <p className="text-muted-foreground text-sm">Žiadne výdavky za obdobie.</p>
                : <DonutChart data={summary.podlaKategorii.map((c, i) => ({ label: c.kategoria, value: c.suma, color: CHART_COLORS[i % CHART_COLORS.length] }))} />}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dátum</TableHead><TableHead>Popis</TableHead><TableHead>Kategória</TableHead>
              <TableHead>Suma</TableHead><TableHead>Pravidelný</TableHead><TableHead>Uhradené</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((e) => (
              <TableRow key={`${e.id}-${e.datum}`}>
                <TableCell>{formatDate(e.datum)}</TableCell>
                <TableCell className="font-medium">{e.popis}{e.zdroj !== "MANUAL" && <Badge variant="outline" className="ml-2">z vozidla</Badge>}</TableCell>
                <TableCell>{e.kategoria}</TableCell>
                <TableCell>{formatEur(e.suma)}</TableCell>
                <TableCell>{e.pravidelny ? <Badge variant="secondary">{e.interval ? INTERVAL_LABELS[e.interval] : "áno"}</Badge> : "—"}</TableCell>
                <TableCell>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={e.uhradene} onCheckedChange={() => togglePaid(e)} />
                    {e.uhradene ? <Badge className="bg-green-600">Áno</Badge> : <Badge variant="destructive">Nie</Badge>}
                  </label>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(e)}>Upraviť</Button>
                  {e.zdroj === "MANUAL" && <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(e)}>Zmazať</Button>}
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Žiadne výdavky za obdobie {summary?.obdobie.label ?? ""}.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* Stránkovanie + počet záznamov na stranu */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Na stranu:</span>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>{[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
          </Select>
          <span className="text-muted-foreground">Spolu {total} záznamov</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>← Predošlá</Button>
          <span className="text-muted-foreground">Strana {page} z {pocetStran}</span>
          <Button size="sm" variant="outline" disabled={page >= pocetStran} onClick={() => setPage((p) => Math.min(pocetStran, p + 1))}>Ďalšia →</Button>
        </div>
      </div>

      {/* Zmazanie pravidelného výdavku — voľba rozsahu */}
      <Dialog open={!!delTarget} onOpenChange={(o) => !o && setDelTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Zmazať pravidelný výdavok</DialogTitle></DialogHeader>
          {delTarget && (
            <div className="space-y-3">
              <p className="text-sm">
                „{delTarget.popis}" — výskyt {formatDate(delTarget.datum)}.<br />
                Chcete zmazať iba tento výskyt, alebo aj všetky nasledujúce?
              </p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={() => removeRecurring("one")}>Iba tento výskyt</Button>
                <Button variant="destructive" onClick={() => removeRecurring("series")}>Tento aj nasledujúce výskyty</Button>
                <Button variant="ghost" onClick={() => setDelTarget(null)}>Zrušiť</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}

function CategoryManager({ categories, onChange }: { categories: Category[]; onChange: () => void }) {
  const { toast } = useToast();
  const [nazov, setNazov] = useState("");

  async function add() {
    if (!nazov.trim()) return;
    try {
      await apiFetch("/api/portal/expense-categories", { method: "POST", body: JSON.stringify({ nazov: nazov.trim() }) });
      setNazov(""); onChange();
    } catch (e) { toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  }
  async function toggle(c: Category) {
    await apiFetch(`/api/portal/expense-categories/${c.id}`, { method: "PUT", body: JSON.stringify({ aktivna: !c.aktivna }) });
    onChange();
  }
  async function remove(c: Category) {
    try { await apiFetch(`/api/portal/expense-categories/${c.id}`, { method: "DELETE" }); onChange(); }
    catch (e) { toast({ title: "Nedá sa zmazať", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input placeholder="Nová kategória" value={nazov} onChange={(e) => setNazov(e.target.value)} />
        <Button onClick={add}>Pridať</Button>
      </div>
      <div className="space-y-1 max-h-72 overflow-y-auto">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between text-sm border-b py-1">
            <span className={c.aktivna ? "" : "text-muted-foreground line-through"}>{c.nazov}</span>
            <span className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => toggle(c)}>{c.aktivna ? "Deaktivovať" : "Aktivovať"}</Button>
              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(c)}>Zmazať</Button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Jednoduchý donut graf (bez externých knižníc) — zhoda s dashboardom.
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 60, r = 38, cx = 70, cy = 70;
  let angle = -Math.PI / 2;
  const arcs = data.map((d) => {
    const frac = total > 0 ? d.value / total : 0;
    const start = angle, end = angle + frac * 2 * Math.PI;
    angle = end;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + R * Math.cos(start), y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end), y2 = cy + R * Math.sin(end);
    const xi2 = cx + r * Math.cos(end), yi2 = cy + r * Math.sin(end);
    const xi1 = cx + r * Math.cos(start), yi1 = cy + r * Math.sin(start);
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z`;
  });
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
        {total === 0 ? <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e5e7eb" strokeWidth={R - r} /> :
          arcs.map((d, i) => <path key={i} d={d} fill={data[i].color} />)}
      </svg>
      <div className="space-y-1 text-sm w-full">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: d.color }} />{d.label}</span>
            <span className="text-muted-foreground">{formatEur(d.value)} · {total > 0 ? Math.round((d.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
