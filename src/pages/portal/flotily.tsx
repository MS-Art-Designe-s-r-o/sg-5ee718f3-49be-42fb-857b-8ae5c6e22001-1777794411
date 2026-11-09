"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatDate } from "@/lib/portalClient";
import { describeApiError } from "@/lib/fieldLabels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type Fleet = {
  id: number; obchodneMeno: string; ico: string | null; dic: string | null; icDph: string | null;
  sidlo: string | null; zapisanyV: string | null; statutar: string | null; cisloKoncesie: string | null;
  iban: string | null; kontaktMeno: string | null; kontaktTelefon: string | null; kontaktEmail: string | null;
  poznamka: string | null; aktivna: boolean;
  aktualnaZmluva: { cislo: string; platnostOd: string; platnostDo: string | null } | null;
  pocetVodicov: number;
};

type Agreement = {
  id: number; cislo: string; datumUzavretia: string; platnostOd: string; platnostDo: string | null; poznamka: string | null;
};

const TEXT_KEYS = [
  "obchodneMeno", "ico", "dic", "icDph", "sidlo", "zapisanyV", "statutar", "cisloKoncesie",
  "iban", "kontaktMeno", "kontaktTelefon", "kontaktEmail", "poznamka",
] as const;
type FleetForm = Record<(typeof TEXT_KEYS)[number], string> & { aktivna: boolean };

const emptyForm: FleetForm = {
  ...(Object.fromEntries(TEXT_KEYS.map((k) => [k, ""])) as Record<(typeof TEXT_KEYS)[number], string>),
  aktivna: true,
};

const emptyAgreement = { cislo: "", datumUzavretia: "", platnostOd: "", platnostDo: "", poznamka: "" };

export default function FlotilyPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Fleet[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Fleet | null>(null);
  const [form, setForm] = useState<FleetForm>(emptyForm);

  const [agFleet, setAgFleet] = useState<Fleet | null>(null);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [agForm, setAgForm] = useState(emptyAgreement);

  const fail = (e: unknown) => toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" });

  function load() {
    apiFetch<{ fleets: Fleet[] }>("/api/portal/fleets").then((d) => setList(d.fleets)).catch(fail);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  function openNew() { setEditing(null); setForm(emptyForm); setOpen(true); }
  function openEdit(f: Fleet) {
    setEditing(f);
    setForm({
      ...(Object.fromEntries(TEXT_KEYS.map((k) => [k, f[k] ?? ""])) as Record<(typeof TEXT_KEYS)[number], string>),
      aktivna: f.aktivna,
    });
    setOpen(true);
  }

  async function save() {
    try {
      await apiFetch(editing ? `/api/portal/fleets/${editing.id}` : "/api/portal/fleets", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setOpen(false); load();
      toast({ title: "Uložené" });
    } catch (e) { fail(e); }
  }

  async function remove(f: Fleet) {
    if (!confirm(`Zmazať flotilu ${f.obchodneMeno}?`)) return;
    try { await apiFetch(`/api/portal/fleets/${f.id}`, { method: "DELETE" }); load(); }
    catch (e) { fail(e); }
  }

  async function toggleAktivna(f: Fleet) {
    try {
      await apiFetch(`/api/portal/fleets/${f.id}`, { method: "PUT", body: JSON.stringify({ aktivna: !f.aktivna }) });
      load();
    } catch (e) { fail(e); }
  }

  // ── Evidencia zmlúv flotily ──
  function loadAgreements(fleetId: number) {
    apiFetch<{ agreements: Agreement[] }>(`/api/portal/fleets/${fleetId}/agreements`)
      .then((d) => setAgreements(d.agreements))
      .catch(fail);
  }
  function openAgreements(f: Fleet) {
    setAgFleet(f); setAgreements([]); setAgForm(emptyAgreement);
    loadAgreements(f.id);
  }
  async function addAgreement() {
    if (!agFleet) return;
    try {
      await apiFetch(`/api/portal/fleets/${agFleet.id}/agreements`, {
        method: "POST",
        body: JSON.stringify({ ...agForm, platnostDo: agForm.platnostDo || null }),
      });
      setAgForm(emptyAgreement);
      loadAgreements(agFleet.id); load();
      toast({ title: "Zmluva pridaná" });
    } catch (e) { fail(e); }
  }
  async function removeAgreement(a: Agreement) {
    if (!agFleet || !confirm(`Zmazať zmluvu ${a.cislo}?`)) return;
    try {
      await apiFetch(`/api/portal/fleets/${agFleet.id}/agreements/${a.id}`, { method: "DELETE" });
      loadAgreements(agFleet.id); load();
    } catch (e) { fail(e); }
  }

  const f = (k: (typeof TEXT_KEYS)[number]) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value }),
  });

  return (
    <PortalLayout title="Flotily">
      <Head><title>Flotily — E-TAXI Portál</title></Head>

      <div className="mb-4">
        <Button onClick={openNew}>+ Pridať flotilu</Button>
      </div>

      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flotila</TableHead><TableHead>IČO</TableHead><TableHead>Aktuálna zmluva</TableHead>
              <TableHead>Vodiči</TableHead><TableHead>Stav</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((fl) => (
              <TableRow key={fl.id} className={fl.aktivna ? "" : "opacity-60"}>
                <TableCell className="font-medium">
                  <div>{fl.obchodneMeno}</div>
                  <div className="text-xs text-muted-foreground">{fl.kontaktMeno}{fl.kontaktTelefon ? ` · ${fl.kontaktTelefon}` : ""}</div>
                </TableCell>
                <TableCell>{fl.ico || "—"}</TableCell>
                <TableCell className="text-sm">
                  {fl.aktualnaZmluva
                    ? <>{fl.aktualnaZmluva.cislo}<div className="text-xs text-muted-foreground">{formatDate(fl.aktualnaZmluva.platnostOd)} – {fl.aktualnaZmluva.platnostDo ? formatDate(fl.aktualnaZmluva.platnostDo) : "neurčito"}</div></>
                    : <span className="text-muted-foreground">žiadna platná</span>}
                </TableCell>
                <TableCell>{fl.pocetVodicov}</TableCell>
                <TableCell>
                  <button onClick={() => toggleAktivna(fl)} title="Prepnúť aktívnu/neaktívnu">
                    {fl.aktivna ? <Badge className="bg-green-600">Aktívna</Badge> : <Badge variant="secondary">Neaktívna</Badge>}
                  </button>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => openAgreements(fl)}>Zmluvy</Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(fl)}>Upraviť</Button>
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(fl)}>Zmazať</Button>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Zatiaľ žiadne flotily.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Upraviť flotilu" : "Nová flotila"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><Label>Obchodné meno</Label><Input {...f("obchodneMeno")} /></div>
            <div><Label>IČO</Label><Input inputMode="numeric" placeholder="8 číslic" {...f("ico")} /></div>
            <div><Label>DIČ</Label><Input inputMode="numeric" placeholder="10 číslic" {...f("dic")} /></div>
            <div><Label>IČ DPH</Label><Input placeholder="SK0000000000 (voliteľné)" {...f("icDph")} /></div>
            <div><Label>Číslo koncesie</Label><Input {...f("cisloKoncesie")} /></div>
            <div className="sm:col-span-2"><Label>Sídlo</Label><Input {...f("sidlo")} /></div>
            <div className="sm:col-span-2"><Label>Zapísaný v registri</Label><Input {...f("zapisanyV")} /></div>
            <div><Label>Štatutár</Label><Input {...f("statutar")} /></div>
            <div><Label>IBAN</Label><Input {...f("iban")} /></div>
            <div><Label>Kontaktná osoba</Label><Input {...f("kontaktMeno")} /></div>
            <div><Label>Kontaktný telefón</Label><Input {...f("kontaktTelefon")} /></div>
            <div className="sm:col-span-2"><Label>Kontaktný e-mail</Label><Input type="email" {...f("kontaktEmail")} /></div>
            <div className="sm:col-span-2"><Label>Poznámka</Label><Input {...f("poznamka")} /></div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.aktivna} onCheckedChange={(v) => setForm({ ...form, aktivna: !!v })} />
                Aktívna flotila
              </label>
            </div>
          </div>
          <DialogFooter><Button onClick={save}>Uložiť</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!agFleet} onOpenChange={(o) => !o && setAgFleet(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Zmluvy — {agFleet?.obchodneMeno}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Zmluva o dispečerských službách medzi E-TAXI a flotilou sa tu len eviduje, negeneruje sa.
          </p>

          <div className="space-y-2 text-sm">
            {agreements.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-2 border rounded p-2">
                <div>
                  <div className="font-medium">{a.cislo}</div>
                  <div className="text-xs text-muted-foreground">
                    Uzavretá {formatDate(a.datumUzavretia)} · platná {formatDate(a.platnostOd)} – {a.platnostDo ? formatDate(a.platnostDo) : "neurčito"}
                  </div>
                  {a.poznamka && <div className="text-xs mt-1">{a.poznamka}</div>}
                </div>
                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => removeAgreement(a)}>Zmazať</Button>
              </div>
            ))}
            {agreements.length === 0 && <p className="text-muted-foreground">Zatiaľ žiadne evidované zmluvy.</p>}
          </div>

          <div className="border-t pt-3">
            <div className="font-medium text-sm mb-2">Pridať zmluvu</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Label>Číslo zmluvy</Label><Input value={agForm.cislo} onChange={(e) => setAgForm({ ...agForm, cislo: e.target.value })} /></div>
              <div><Label>Dátum uzavretia</Label><Input type="date" value={agForm.datumUzavretia} onChange={(e) => setAgForm({ ...agForm, datumUzavretia: e.target.value })} /></div>
              <div />
              <div><Label>Platnosť od</Label><Input type="date" value={agForm.platnostOd} onChange={(e) => setAgForm({ ...agForm, platnostOd: e.target.value })} /></div>
              <div><Label>Platnosť do (voliteľné)</Label><Input type="date" value={agForm.platnostDo} onChange={(e) => setAgForm({ ...agForm, platnostDo: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Poznámka</Label><Input value={agForm.poznamka} onChange={(e) => setAgForm({ ...agForm, poznamka: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addAgreement} disabled={!agForm.cislo.trim() || !agForm.datumUzavretia || !agForm.platnostOd}>Pridať zmluvu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
