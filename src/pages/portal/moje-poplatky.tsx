"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatEur } from "@/lib/portalClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Revenue = {
  id: number; isoRok: number; isoTyzden: number; trzba: number;
  poplatokApp: number; provizia: number; celkovyPoplatok: number; uhradene: boolean;
};
type Fees = {
  registracia: { poplatok: number; uhradeny: boolean; uhradenyDna: string | null };
  suhrn: { spoluTyzdennePoplatky: number; neuhradeneTyzdennePoplatky: number; neuhradenePoplatkyZaSmeny: number };
  revenues: Revenue[];
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card><CardContent className="p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent></Card>
  );
}

export default function MojePoplatkyPage() {
  const [data, setData] = useState<Fees | null>(null);
  useEffect(() => { apiFetch<Fees>("/api/portal/me/fees").then(setData); }, []);

  return (
    <PortalLayout title="Moje poplatky">
      <Head><title>Moje poplatky — E-TAXI Portál</title></Head>
      {!data ? <p className="text-muted-foreground">Načítavam…</p> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Poplatky spolu" value={formatEur(data.suhrn.spoluTyzdennePoplatky)} />
            <Stat label="Neuhradené (týždenné)" value={formatEur(data.suhrn.neuhradeneTyzdennePoplatky)} />
            <Stat label="Neuhradené za smeny" value={formatEur(data.suhrn.neuhradenePoplatkyZaSmeny)} />
            <Card><CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Registračný poplatok ({formatEur(data.registracia.poplatok)})</div>
              <div className="mt-1">
                {data.registracia.uhradeny ? <Badge className="bg-green-600">Uhradený</Badge> : <Badge variant="destructive">Neuhradený</Badge>}
              </div>
            </CardContent></Card>
          </div>

          <div className="bg-white rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Týždeň</TableHead><TableHead>Tržba</TableHead>
                  <TableHead>Poplatok app</TableHead><TableHead>Provízia</TableHead>
                  <TableHead>Celkový poplatok</TableHead><TableHead>Uhradené</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.revenues.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.isoTyzden}/{r.isoRok}</TableCell>
                    <TableCell>{formatEur(r.trzba)}</TableCell>
                    <TableCell>{formatEur(r.poplatokApp)}</TableCell>
                    <TableCell>{formatEur(r.provizia)}</TableCell>
                    <TableCell className="font-semibold">{formatEur(r.celkovyPoplatok)}</TableCell>
                    <TableCell>{r.uhradene ? <Badge className="bg-green-600">Áno</Badge> : <Badge variant="destructive">Nie</Badge>}</TableCell>
                  </TableRow>
                ))}
                {data.revenues.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Zatiaľ žiadne záznamy.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
