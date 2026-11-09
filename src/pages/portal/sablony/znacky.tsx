"use client";

// Zoznam značiek šablón zmlúv (len MAJITEL). Zdroj: GET /api/portal/contract-tags.
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch } from "@/lib/portalClient";
import { describeApiError } from "@/lib/fieldLabels";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type Znacka = { key: string; zapis: string; label: string; popis: string; priklad: string; blok: boolean };
type Skupina = { id: string; nazov: string; popis: string; znacky: Znacka[] };

export default function ZnackyPage() {
  const { toast } = useToast();
  const [skupiny, setSkupiny] = useState<Skupina[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ skupiny: Skupina[] }>("/api/portal/contract-tags")
      .then((d) => setSkupiny(d.skupiny))
      .catch((e) => {
        setSkupiny([]);
        toast({ title: "Chyba", description: describeApiError(e), variant: "destructive" });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied((c) => (c === text ? null : c)), 1500);
    } catch {
      toast({ title: "Kopírovanie nie je dostupné", description: "Označte text a skopírujte ho ručne.", variant: "destructive" });
    }
  }

  const bloky = skupiny?.find((s) => s.id === "bloky")?.znacky ?? [];
  const hodnoty = (skupiny ?? []).filter((s) => s.id !== "bloky");

  return (
    <PortalLayout title="Zoznam značiek">
      <Head><title>Zoznam značiek — E-TAXI Portál</title></Head>

      <div className="mb-4">
        <Button asChild variant="outline"><Link href="/portal/sablony">← Šablóny zmlúv</Link></Button>
      </div>

      <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Značku píšte do dokumentu Word presne v tvare so zloženými zátvorkami, napr. <code>{"{vodic.meno}"}</code>.
        Značka nesmie byť v dokumente rozdelená rôznym formátovaním (časť tučne, časť kurzívou, iná farba alebo veľkosť
        písma, oprava pravopisu) — Word ju vtedy uloží na viac častí a nenahradí sa. Najspoľahlivejšie je značku napísať
        naraz, jednotným formátom, prípadne ju vložiť ako obyčajný text (Ctrl+Shift+V) a až potom naformátovať celú.
      </div>

      {skupiny === null && <p className="text-sm text-muted-foreground">Načítavam…</p>}

      <div className="space-y-6">
        {hodnoty.map((s) => (
          <section key={s.id}>
            <h2 className="font-semibold">{s.nazov}</h2>
            <p className="text-sm text-muted-foreground mb-2">{s.popis}</p>
            <div className="bg-white rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Značka</TableHead><TableHead>Popis</TableHead><TableHead>Príklad</TableHead><TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {s.znacky.map((z) => (
                    <TableRow key={z.key}>
                      <TableCell className="whitespace-nowrap"><code className="text-[#282462]">{z.zapis}</code></TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">{z.label}</div>
                        <div className="text-muted-foreground">{z.popis}</div>
                      </TableCell>
                      <TableCell className="text-sm">{z.priklad || "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => copy(z.zapis)}>
                          {copied === z.zapis ? "Skopírované" : "Kopírovať"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        ))}

        {skupiny !== null && (
          <section>
            <h2 className="font-semibold">Podmienené bloky</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Časť dokumentu sa vypíše len vtedy, keď podmienka platí. Otváraciu a uzatváraciu značku dajte do
              samostatných odstavcov — odstavce s podmienkou sa pri nesplnení vynechajú celé, bez prázdnych riadkov.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="rounded-md border bg-white p-3 text-sm">
                <div className="font-medium mb-1">Blok (vypíše sa, ak platí)</div>
                <pre className="bg-muted/40 rounded p-2 overflow-x-auto text-xs">{"{#flotila}\nVodič pôsobí vo flotile {flotila.nazov}.\n{/flotila}"}</pre>
              </div>
              <div className="rounded-md border bg-white p-3 text-sm">
                <div className="font-medium mb-1">Inverzný blok (vypíše sa, ak NEplatí)</div>
                <pre className="bg-muted/40 rounded p-2 overflow-x-auto text-xs">{"{^flotila}\nVodič pôsobí samostatne.\n{/flotila}"}</pre>
              </div>
            </div>
            <div className="bg-white rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blok</TableHead><TableHead>Popis</TableHead><TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloky.map((b) => (
                    <TableRow key={b.key}>
                      <TableCell className="whitespace-nowrap"><code className="text-[#282462]">{`{#${b.key}}…{/${b.key}}`}</code></TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">{b.label}</div>
                        <div className="text-muted-foreground">{b.popis}</div>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button size="sm" variant="ghost" onClick={() => copy(`{#${b.key}}`)}>
                          {copied === `{#${b.key}}` ? "Skopírované" : "Kopírovať {#…}"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => copy(`{^${b.key}}`)}>
                          {copied === `{^${b.key}}` ? "Skopírované" : "Kopírovať {^…}"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Blok uzavrite značkou <code>{"{/názov}"}</code> s rovnakým názvom, aký má otváracia značka.
            </p>
          </section>
        )}
      </div>
    </PortalLayout>
  );
}
