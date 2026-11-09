"use client";

// Šablóny zmlúv (len MAJITEL): verzie, nahratie, aktivácia, stiahnutie.
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ApiError, apiFetch, formatDate } from "@/lib/portalClient";
import { describeApiError } from "@/lib/fieldLabels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Typ = "NAJOM" | "DISPECING";

type Template = {
  id: number; typ: Typ; nazov: string; verzia: number; platnaOd: string;
  aktivna: boolean; pocetZmluv: number;
};

type UploadResult = { id: number; typ: Typ; verzia: number; tagy: string[]; varovania: string[] };

const TYP_LABELS: Record<Typ, string> = { NAJOM: "Nájom vozidla", DISPECING: "Dispečerské služby" };
const MAX_BYTES = 5 * 1024 * 1024;

const todayIso = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/** Súbor → base64 (bez `data:` prefixu). */
function readBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error("Súbor sa nepodarilo prečítať"));
    r.onload = () => {
      const s = String(r.result ?? "");
      resolve(s.slice(s.indexOf(",") + 1));
    };
    r.readAsDataURL(file);
  });
}

export default function SablonyPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Template[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [open, setOpen] = useState(false);
  const [typ, setTyp] = useState<Typ>("NAJOM");
  const [nazov, setNazov] = useState("");
  const [platnaOd, setPlatnaOd] = useState(todayIso());
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<{ message: string; chyby: string[] } | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fail = (e: unknown) => toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" });

  function load() {
    apiFetch<{ sablony: Template[] }>("/api/portal/contract-templates")
      .then((d) => setList(d.sablony))
      .catch((e) => { setList([]); fail(e); });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  function openUpload() {
    setTyp("NAJOM"); setNazov(""); setPlatnaOd(todayIso()); setFile(null);
    setUploadErr(null); setResult(null);
    if (fileRef.current) fileRef.current.value = "";
    setOpen(true);
  }

  function pickFile(f: File | null) {
    setUploadErr(null);
    if (!f) { setFile(null); return; }
    if (!f.name.toLowerCase().endsWith(".docx")) {
      setFile(null);
      setUploadErr({ message: "Vyberte súbor vo formáte .docx", chyby: [] });
      return;
    }
    if (f.size > MAX_BYTES) {
      setFile(null);
      setUploadErr({ message: "Súbor je väčší ako 5 MB", chyby: [] });
      return;
    }
    setFile(f);
  }

  async function upload() {
    if (!file) { setUploadErr({ message: "Vyberte súbor .docx", chyby: [] }); return; }
    if (!nazov.trim()) { setUploadErr({ message: "Zadajte názov šablóny", chyby: [] }); return; }
    if (!platnaOd) { setUploadErr({ message: "Zadajte dátum platnosti", chyby: [] }); return; }
    setUploading(true);
    setUploadErr(null);
    try {
      const fileBase64 = await readBase64(file);
      const r = await apiFetch<UploadResult>("/api/portal/contract-templates", {
        method: "POST",
        body: JSON.stringify({ typ, nazov: nazov.trim(), platnaOd, fileBase64 }),
      });
      setResult(r);
      load();
    } catch (e) {
      if (e instanceof ApiError && e.status === 400 && Array.isArray(e.data.chyby)) {
        setUploadErr({ message: e.message, chyby: e.data.chyby.filter((x): x is string => typeof x === "string") });
      } else {
        setUploadErr({ message: describeApiError(e), chyby: [] });
      }
    } finally {
      setUploading(false);
    }
  }

  async function activate(t: Template) {
    if (!confirm(`Aktivovať šablónu „${t.nazov}“ (verzia ${t.verzia})? Použije sa pri nových zmluvách typu ${TYP_LABELS[t.typ]}.`)) return;
    setBusyId(t.id);
    try {
      await apiFetch(`/api/portal/contract-templates/${t.id}/activate`, { method: "POST" });
      toast({ title: "Šablóna aktivovaná" });
      load();
    } catch (e) {
      fail(e);
    } finally {
      setBusyId(null);
    }
  }

  // Autorizovaný GET s cookie — necháme prehliadač stiahnuť súbor (Content-Disposition: attachment).
  function download(t: Template) {
    window.location.href = `/api/portal/contract-templates/${t.id}/download`;
  }

  return (
    <PortalLayout title="Šablóny zmlúv">
      <Head><title>Šablóny zmlúv — E-TAXI Portál</title></Head>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button onClick={openUpload}>+ Nahrať šablónu</Button>
        <Button asChild variant="outline"><Link href="/portal/sablony/znacky">Zoznam značiek</Link></Button>
      </div>

      <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Aktívna šablóna sa použije pri <strong>nových</strong> zmluvách. Už vygenerované zmluvy sa nemenia
        (ostávajú podľa šablóny, z ktorej vznikli). Novo nahraná verzia je najprv neaktívna — aktivujete ju samostatne.
      </div>

      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Typ</TableHead><TableHead>Názov</TableHead><TableHead>Verzia</TableHead>
              <TableHead>Platná od</TableHead><TableHead>Aktívna</TableHead><TableHead>Použitá v zmluvách</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(list ?? []).map((t) => (
              <TableRow key={t.id}>
                <TableCell>{TYP_LABELS[t.typ]}</TableCell>
                <TableCell className="font-medium">{t.nazov}</TableCell>
                <TableCell>v{t.verzia}</TableCell>
                <TableCell>{formatDate(t.platnaOd)}</TableCell>
                <TableCell>
                  {t.aktivna ? <Badge className="bg-green-600">Aktívna</Badge> : <Badge variant="secondary">Neaktívna</Badge>}
                </TableCell>
                <TableCell>{t.pocetZmluv}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => download(t)}>Stiahnuť</Button>
                  {!t.aktivna && (
                    <Button size="sm" variant="ghost" disabled={busyId === t.id} onClick={() => activate(t)}>Aktivovať</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {list === null && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Načítavam…</TableCell></TableRow>
            )}
            {list !== null && list.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Zatiaľ žiadne šablóny.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(o) => { if (!uploading) setOpen(o); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{result ? "Šablóna nahraná" : "Nahrať šablónu"}</DialogTitle></DialogHeader>

          {result ? (
            <div className="space-y-3 text-sm">
              <p>
                Šablóna ({TYP_LABELS[result.typ]}) bola nahraná ako <strong>verzia {result.verzia}</strong>. Je neaktívna —
                aktivujte ju v zozname, keď ju chcete používať pri nových zmluvách.
              </p>
              {result.varovania.length > 0 ? (
                <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900">
                  <div className="font-medium mb-1">Neznáme značky (v dokumente ostanú prázdne):</div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {result.varovania.map((v) => <li key={v}><code>{v}</code></li>)}
                  </ul>
                  <p className="mt-2 text-xs">
                    Skontrolujte preklepy alebo formátovanie značky vo Worde. Pozrite si{" "}
                    <Link href="/portal/sablony/znacky" className="underline">zoznam značiek</Link>.
                  </p>
                </div>
              ) : (
                <p className="text-green-700">Všetky značky v šablóne sú známe.</p>
              )}
              <DialogFooter><Button onClick={() => setOpen(false)}>Zavrieť</Button></DialogFooter>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Typ zmluvy</Label>
                  <Select value={typ} onValueChange={(v) => setTyp(v as Typ)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NAJOM">{TYP_LABELS.NAJOM}</SelectItem>
                      <SelectItem value="DISPECING">{TYP_LABELS.DISPECING}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Platná od</Label>
                  <Input type="date" value={platnaOd} onChange={(e) => setPlatnaOd(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Názov</Label>
                  <Input value={nazov} maxLength={191} placeholder="napr. Nájomná zmluva 2026" onChange={(e) => setNazov(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Súbor (.docx, max 5 MB)</Label>
                  <Input
                    ref={fileRef}
                    type="file"
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>

              {uploadErr && (
                <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                  <div className="font-medium">{uploadErr.message}</div>
                  {uploadErr.chyby.length > 0 && (
                    <ul className="list-disc pl-5 mt-1 space-y-0.5">
                      {uploadErr.chyby.map((c, i) => <li key={i}><code>{c}</code></li>)}
                    </ul>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" disabled={uploading} onClick={() => setOpen(false)}>Zrušiť</Button>
                <Button onClick={upload} disabled={uploading || !file}>{uploading ? "Nahrávam…" : "Nahrať"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
