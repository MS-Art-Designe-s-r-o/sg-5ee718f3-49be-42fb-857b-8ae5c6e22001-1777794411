"use client";

// Karta vodiča: osobné a zmluvné údaje (len MAJITEL).
// RČ a číslo OP sa v UI nikdy nezobrazujú plne bez explicitného „Zobraziť“ (30 s,
// potom sa hodnota automaticky zmaže zo stavu; pri zatvorení dialógu hneď).
import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/portalClient";
import { describeApiError } from "@/lib/fieldLabels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Masked = { hasValue: boolean; maska: string | null };
type Stav = "AKTIVNY" | "POZASTAVENY" | "UKONCENY";
type Rezim = "VO_FLOTILE" | "VLASTNA_KONCESIA";
type StranaTyp = "FYZICKA_OSOBA" | "PRAVNICKA_OSOBA";

type Profile = {
  titulPred: string | null; titulZa: string | null; datumNarodenia: string | null;
  rodneCislo: Masked; cisloOp: Masked;
  trvalyPobyt: string | null; cisloVp: string | null; cisloPvt: string | null; pvtPlatnostDo: string | null;
  iban: string | null; stav: Stav; fleetId: number | null; rezim: Rezim | null; stranaTyp: StranaTyp | null;
  firmaObchodneMeno: string | null; firmaIco: string | null; firmaDic: string | null; firmaIcDph: string | null;
  firmaSidlo: string | null; firmaZapisanyV: string | null; cisloKoncesie: string | null;
  koncesiaPlatnostDo: string | null; firmaStatutar: string | null;
};

type FleetOption = { id: number; obchodneMeno: string; aktivna?: boolean };

/** Textové polia formulára (prázdny reťazec = nevyplnené). */
const TEXT_KEYS = [
  "titulPred", "titulZa", "datumNarodenia", "trvalyPobyt", "cisloVp", "cisloPvt", "pvtPlatnostDo", "iban",
  "firmaObchodneMeno", "firmaIco", "firmaDic", "firmaIcDph", "firmaSidlo", "firmaZapisanyV",
  "cisloKoncesie", "koncesiaPlatnostDo", "firmaStatutar",
] as const;

type Form = Record<(typeof TEXT_KEYS)[number], string> & {
  stav: Stav;
  fleetId: string; // "" = žiadna
  rezim: "" | Rezim;
  stranaTyp: "" | StranaTyp;
};

const NONE = "none";
const REVEAL_MS = 30_000;

function toForm(p: Profile): Form {
  const base = Object.fromEntries(TEXT_KEYS.map((k) => [k, p[k] ?? ""])) as Record<(typeof TEXT_KEYS)[number], string>;
  return {
    ...base,
    stav: p.stav,
    fleetId: p.fleetId ? String(p.fleetId) : "",
    rezim: p.rezim ?? "",
    stranaTyp: p.stranaTyp ?? "",
  };
}

type SecretField = "rodneCislo" | "cisloOp";

export function DriverProfileDialog({
  driver,
  onClose,
}: {
  driver: { id: number; meno: string; priezvisko: string };
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [orig, setOrig] = useState<Form | null>(null);
  const [masks, setMasks] = useState<{ rodneCislo: Masked; cisloOp: Masked }>({
    rodneCislo: { hasValue: false, maska: null },
    cisloOp: { hasValue: false, maska: null },
  });
  const [fleets, setFleets] = useState<FleetOption[]>([]);

  // Citlivé hodnoty: odkrytá hodnota (30 s), nová hodnota na zmenu, príznak vymazania.
  const [revealed, setRevealed] = useState<Record<SecretField, string | null>>({ rodneCislo: null, cisloOp: null });
  const [newVal, setNewVal] = useState<Record<SecretField, string>>({ rodneCislo: "", cisloOp: "" });
  const [clearFlag, setClearFlag] = useState<Record<SecretField, boolean>>({ rodneCislo: false, cisloOp: false });
  const timers = useRef<Partial<Record<SecretField, ReturnType<typeof setTimeout>>>>({});

  const hide = useCallback((f: SecretField) => {
    const t = timers.current[f];
    if (t) clearTimeout(t);
    delete timers.current[f];
    setRevealed((r) => ({ ...r, [f]: null }));
  }, []);

  // Pri zatvorení (unmount) hneď zmazať časovače aj odkryté hodnoty.
  useEffect(() => {
    const t = timers.current;
    return () => {
      for (const k of Object.keys(t) as SecretField[]) clearTimeout(t[k]);
    };
  }, []);

  const applyProfile = useCallback((p: Profile) => {
    const f = toForm(p);
    setForm(f);
    setOrig(f);
    setMasks({ rodneCislo: p.rodneCislo, cisloOp: p.cisloOp });
    setNewVal({ rodneCislo: "", cisloOp: "" });
    setClearFlag({ rodneCislo: false, cisloOp: false });
    hide("rodneCislo");
    hide("cisloOp");
  }, [hide]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      apiFetch<{ profile: Profile }>(`/api/portal/drivers/${driver.id}/profile`),
      apiFetch<{ fleets: FleetOption[] }>("/api/portal/fleets").catch(() => ({ fleets: [] as FleetOption[] })),
    ])
      .then(([p, fl]) => {
        if (!alive) return;
        applyProfile(p.profile);
        setFleets(Array.isArray(fl.fleets) ? fl.fleets : []);
      })
      .catch((e) => {
        if (!alive) return;
        toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" });
        onClose();
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver.id]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));
  const text = (k: (typeof TEXT_KEYS)[number], type = "text") => ({
    type,
    value: form?.[k] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value),
  });

  async function reveal(field: SecretField) {
    try {
      const r = await apiFetch<{ value: string }>(`/api/portal/drivers/${driver.id}/reveal`, {
        method: "POST",
        body: JSON.stringify({ field }),
      });
      setRevealed((s) => ({ ...s, [field]: r.value }));
      const old = timers.current[field];
      if (old) clearTimeout(old);
      timers.current[field] = setTimeout(() => hide(field), REVEAL_MS);
    } catch (e) {
      toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" });
    }
  }

  function requestClear(field: SecretField, label: string) {
    if (!confirm(`Vymazať ${label}? Hodnota sa odstráni po uložení.`)) return;
    hide(field);
    setNewVal((v) => ({ ...v, [field]: "" }));
    setClearFlag((c) => ({ ...c, [field]: true }));
  }

  async function save() {
    if (!form || !orig) return;
    const payload: Record<string, unknown> = {};
    for (const k of TEXT_KEYS) if (form[k].trim() !== orig[k].trim()) payload[k] = form[k].trim() || null;
    if (form.stav !== orig.stav) payload.stav = form.stav;
    if (form.fleetId !== orig.fleetId) payload.fleetId = form.fleetId ? Number(form.fleetId) : null;
    if (form.rezim !== orig.rezim) payload.rezim = form.rezim || null;
    if (form.stranaTyp !== orig.stranaTyp) payload.stranaTyp = form.stranaTyp || null;
    for (const f of ["rodneCislo", "cisloOp"] as const) {
      if (clearFlag[f]) payload[f] = null;
      else if (newVal[f].trim()) payload[f] = newVal[f].trim();
    }
    if (Object.keys(payload).length === 0) {
      toast({ title: "Žiadne zmeny" });
      return;
    }
    setSaving(true);
    try {
      const r = await apiFetch<{ profile: Profile }>(`/api/portal/drivers/${driver.id}/profile`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      applyProfile(r.profile);
      toast({ title: "Uložené" });
      onClose();
    } catch (e) {
      toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const vlastna = form?.rezim === "VLASTNA_KONCESIA";
  const pravnicka = form?.stranaTyp === "PRAVNICKA_OSOBA";
  const req = (on: boolean) => (on ? " *" : "");

  function secretBlock(field: SecretField, label: string, newLabel: string, placeholder: string) {
    const m = masks[field];
    const shown = revealed[field];
    return (
      <div className="sm:col-span-2 space-y-2 rounded-md border p-3">
        <Label>{label}</Label>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {clearFlag[field] ? (
            <>
              <span className="text-red-600">Hodnota sa vymaže po uložení.</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => setClearFlag((c) => ({ ...c, [field]: false }))}>Zrušiť vymazanie</Button>
            </>
          ) : m.hasValue ? (
            <>
              <span className="font-mono">{shown ?? m.maska ?? "••••••"}</span>
              {shown === null ? (
                <Button type="button" size="sm" variant="outline" onClick={() => reveal(field)}>Zobraziť</Button>
              ) : (
                <Button type="button" size="sm" variant="outline" onClick={() => hide(field)}>Skryť</Button>
              )}
              <Button type="button" size="sm" variant="ghost" className="text-red-600" onClick={() => requestClear(field, label.toLowerCase())}>Vymazať hodnotu</Button>
              {shown !== null && <span className="text-xs text-muted-foreground">Automaticky sa skryje o 30 s.</span>}
            </>
          ) : (
            <span className="text-muted-foreground">nevyplnené</span>
          )}
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">{newLabel} (prázdne = nemeniť)</Label>
          <Input
            autoComplete="off" spellCheck={false} placeholder={placeholder}
            disabled={clearFlag[field]}
            value={newVal[field]}
            onChange={(e) => setNewVal((v) => ({ ...v, [field]: e.target.value }))}
          />
        </div>
      </div>
    );
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profil — {driver.priezvisko} {driver.meno}</DialogTitle>
        </DialogHeader>

        {loading || !form ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Načítavam…</p>
        ) : (
          <div className="space-y-5">
            <section>
              <h3 className="font-semibold text-sm mb-2">Osobné údaje</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Titul pred menom</Label><Input {...text("titulPred")} /></div>
                <div><Label>Titul za menom</Label><Input {...text("titulZa")} /></div>
                <div className="sm:col-span-2"><Label>Dátum narodenia</Label><Input {...text("datumNarodenia", "date")} /></div>
                {secretBlock("rodneCislo", "Rodné číslo", "Nové rodné číslo", "napr. 900101/1234")}
                {secretBlock("cisloOp", "Číslo OP", "Nové číslo OP", "5 – 20 písmen a číslic")}
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-sm mb-2">Doklady</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><Label>Číslo vodičského preukazu</Label><Input {...text("cisloVp")} /></div>
                <div><Label>Číslo preukazu vodiča taxislužby</Label><Input {...text("cisloPvt")} /></div>
                <div><Label>Platnosť preukazu taxislužby do</Label><Input {...text("pvtPlatnostDo", "date")} /></div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-sm mb-2">Bydlisko a platby</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><Label>Trvalý pobyt</Label><Input {...text("trvalyPobyt")} /></div>
                <div className="sm:col-span-2"><Label>IBAN</Label><Input autoComplete="off" {...text("iban")} /></div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-sm mb-2">Zmluvný vzťah</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Stav</Label>
                  <Select value={form.stav} onValueChange={(v) => set("stav", v as Stav)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AKTIVNY">Aktívny</SelectItem>
                      <SelectItem value="POZASTAVENY">Pozastavený</SelectItem>
                      <SelectItem value="UKONCENY">Ukončený</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Flotila</Label>
                  <Select value={form.fleetId || NONE} onValueChange={(v) => set("fleetId", v === NONE ? "" : v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>— žiadna —</SelectItem>
                      {fleets.map((fl) => (
                        <SelectItem key={fl.id} value={String(fl.id)}>
                          {fl.obchodneMeno}{fl.aktivna === false ? " (neaktívna)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Režim</Label>
                  <Select value={form.rezim || NONE} onValueChange={(v) => set("rezim", v === NONE ? "" : (v as Rezim))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>— nezadaný —</SelectItem>
                      <SelectItem value="VO_FLOTILE">Vo flotile</SelectItem>
                      <SelectItem value="VLASTNA_KONCESIA">Vlastná koncesia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Typ zmluvnej strany</Label>
                  <Select value={form.stranaTyp || NONE} onValueChange={(v) => set("stranaTyp", v === NONE ? "" : (v as StranaTyp))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>— nezadaný —</SelectItem>
                      <SelectItem value="FYZICKA_OSOBA">Fyzická osoba (aj SZČO)</SelectItem>
                      <SelectItem value="PRAVNICKA_OSOBA">Právnická osoba (s.r.o.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {vlastna && (
              <section>
                <h3 className="font-semibold text-sm mb-1">Údaje s.r.o. / SZČO</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Pri vlastnej koncesii sú povinné IČO, DIČ a číslo koncesie{pravnicka ? " a obchodné meno" : ""}. IČ DPH je voliteľné.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2"><Label>Obchodné meno{req(pravnicka)}</Label><Input {...text("firmaObchodneMeno")} /></div>
                  <div><Label>IČO{req(true)}</Label><Input inputMode="numeric" placeholder="8 číslic" {...text("firmaIco")} /></div>
                  <div><Label>DIČ{req(true)}</Label><Input inputMode="numeric" placeholder="10 číslic" {...text("firmaDic")} /></div>
                  <div><Label>IČ DPH</Label><Input placeholder="SK0000000000 (voliteľné)" {...text("firmaIcDph")} /></div>
                  <div><Label>Štatutár</Label><Input {...text("firmaStatutar")} /></div>
                  <div className="sm:col-span-2"><Label>Sídlo</Label><Input {...text("firmaSidlo")} /></div>
                  <div className="sm:col-span-2"><Label>Zapísaný v registri</Label><Input {...text("firmaZapisanyV")} /></div>
                  <div><Label>Číslo koncesie{req(true)}</Label><Input {...text("cisloKoncesie")} /></div>
                  <div><Label>Platnosť koncesie do</Label><Input {...text("koncesiaPlatnostDo", "date")} /></div>
                </div>
              </section>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Zavrieť</Button>
          <Button onClick={save} disabled={loading || saving || !form}>{saving ? "Ukladám…" : "Uložiť"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
