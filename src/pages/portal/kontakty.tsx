"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, ROLE_LABELS, type Role } from "@/lib/portalClient";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Kontakt = {
  id: number; meno: string; priezvisko: string; volaciZnak: string | null;
  telefon: string | null; email: string; miestoStriedania: string | null; roles: Role[];
};

export default function KontaktyPage() {
  const [list, setList] = useState<Kontakt[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    apiFetch<{ kontakty: Kontakt[] }>("/api/portal/contacts").then((d) => setList(d.kontakty));
  }, []);

  const filtered = list.filter((k) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      `${k.meno} ${k.priezvisko}`.toLowerCase().includes(s) ||
      (k.volaciZnak || "").toLowerCase().includes(s) ||
      (k.miestoStriedania || "").toLowerCase().includes(s) ||
      (k.telefon || "").toLowerCase().includes(s) ||
      k.email.toLowerCase().includes(s)
    );
  });

  return (
    <PortalLayout title="Kontakty na kolegov">
      <Head><title>Kontakty — E-TAXI Portál</title></Head>

      <div className="mb-4 max-w-sm">
        <Input placeholder="Hľadať (meno, znak, miesto, telefón…)" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Volací znak</TableHead>
              <TableHead>Meno a priezvisko</TableHead>
              <TableHead>Telefón</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Miesto striedania</TableHead>
              <TableHead>Roly</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((k) => (
              <TableRow key={k.id}>
                <TableCell className="font-semibold">{k.volaciZnak || "—"}</TableCell>
                <TableCell className="font-medium">{k.priezvisko} {k.meno}</TableCell>
                <TableCell>{k.telefon ? <a href={`tel:${k.telefon}`} className="text-[#282462] hover:underline">{k.telefon}</a> : "—"}</TableCell>
                <TableCell><a href={`mailto:${k.email}`} className="text-[#282462] hover:underline">{k.email}</a></TableCell>
                <TableCell>{k.miestoStriedania || "—"}</TableCell>
                <TableCell>{k.roles.map((r) => <Badge key={r} variant="outline" className="mr-1">{ROLE_LABELS[r]}</Badge>)}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Žiadne kontakty.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </PortalLayout>
  );
}
