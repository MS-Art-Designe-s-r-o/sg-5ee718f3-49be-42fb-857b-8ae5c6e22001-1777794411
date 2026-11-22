"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch } from "@/lib/portalClient";
import { describeApiError } from "@/lib/fieldLabels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

type Company = {
  obchodneMeno: string; sidlo: string | null; ico: string | null; dic: string | null; icDph: string | null;
  zapisanyV: string | null; statutar: string | null; statutarFunkcia: string | null; iban: string | null;
  email: string | null; telefon: string | null; web: string | null;
};

const KEYS = [
  "obchodneMeno", "sidlo", "ico", "dic", "icDph", "zapisanyV", "statutar",
  "statutarFunkcia", "iban", "email", "telefon", "web",
] as const;
type FormState = Record<(typeof KEYS)[number], string>;

const emptyForm = Object.fromEntries(KEYS.map((k) => [k, ""])) as FormState;

function toForm(c: Company | null): FormState {
  if (!c) return emptyForm;
  return Object.fromEntries(KEYS.map((k) => [k, c[k] ?? ""])) as FormState;
}

export default function NastaveniaFirmyPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch<{ company: Company | null }>("/api/portal/company")
      .then((d) => setForm(toForm(d.company)))
      .catch((e) => toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" }))
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      const d = await apiFetch<{ company: Company }>("/api/portal/company", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setForm(toForm(d.company));
      toast({ title: "Uložené" });
    } catch (e) {
      toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const statutarChyba = loaded && !form.statutar.trim();

  return (
    <PortalLayout title="Údaje firmy">
      <Head><title>Údaje firmy — E-TAXI Portál</title></Head>

      <div className="bg-white rounded-md border p-4 max-w-3xl space-y-4">
        <div>
          <h2 className="font-semibold">Údaje E-TAXI (prenajímateľ / prevádzkovateľ dispečingu)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tieto údaje sa použijú v zmluvách (nájomná zmluva, zmluva o dispečerských službách).
            Skontrolujte ich pred generovaním zmlúv.
          </p>
        </div>

        {statutarChyba && (
          <div className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <span>
              Štatutár nie je vyplnený. Doplňte meno štatutára (a jeho funkciu) pred generovaním zmlúv,
              inak v nich bude chýbať.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Label>Obchodné meno</Label><Input value={form.obchodneMeno} onChange={(e) => set("obchodneMeno", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Sídlo</Label><Input value={form.sidlo} onChange={(e) => set("sidlo", e.target.value)} /></div>
          <div><Label>IČO</Label><Input inputMode="numeric" placeholder="8 číslic" value={form.ico} onChange={(e) => set("ico", e.target.value)} /></div>
          <div><Label>DIČ</Label><Input inputMode="numeric" placeholder="10 číslic" value={form.dic} onChange={(e) => set("dic", e.target.value)} /></div>
          <div><Label>IČ DPH</Label><Input placeholder="SK0000000000 (voliteľné)" value={form.icDph} onChange={(e) => set("icDph", e.target.value)} /></div>
          <div><Label>IBAN</Label><Input value={form.iban} onChange={(e) => set("iban", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Zapísaný v registri</Label><Input placeholder="napr. Obchodný register Mestského súdu Košice, oddiel Sro, vložka č. …" value={form.zapisanyV} onChange={(e) => set("zapisanyV", e.target.value)} /></div>
          <div>
            <Label className={statutarChyba ? "text-amber-700" : undefined}>Štatutár (meno a priezvisko)</Label>
            <Input className={statutarChyba ? "border-amber-400" : undefined} value={form.statutar} onChange={(e) => set("statutar", e.target.value)} />
          </div>
          <div><Label>Funkcia štatutára</Label><Input placeholder="napr. konateľ" value={form.statutarFunkcia} onChange={(e) => set("statutarFunkcia", e.target.value)} /></div>
          <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div><Label>Telefón</Label><Input value={form.telefon} onChange={(e) => set("telefon", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Web</Label><Input value={form.web} onChange={(e) => set("web", e.target.value)} /></div>
        </div>

        <div><Button onClick={save} disabled={saving || !loaded}>{saving ? "Ukladám…" : "Uložiť"}</Button></div>
      </div>
    </PortalLayout>
  );
}
