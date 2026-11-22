"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { apiFetch } from "@/lib/portalClient";
import { Turnstile } from "@/components/portal/Turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NastavitHesloPage() {
  const router = useRouter();
  const token = typeof router.query.token === "string" ? router.query.token : "";
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== password2) {
      setError("Heslá sa nezhodujú.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/auth/set-password", {
        method: "POST",
        body: JSON.stringify({ token, password, turnstileToken }),
      });
      setDone(true);
      setTimeout(() => router.replace("/prihlasenie"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepodarilo sa nastaviť heslo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Nastavenie hesla — E-TAXI Košice</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Nastavenie hesla</CardTitle>
          </CardHeader>
          <CardContent>
            {done ? (
              <p className="text-green-600 text-center">
                Heslo nastavené. Presmerúvam na prihlásenie…
              </p>
            ) : !token ? (
              <p className="text-red-600 text-center">Chýba token v odkaze.</p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label htmlFor="p1">Nové heslo</Label>
                  <Input id="p1" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="p2">Zopakujte heslo</Label>
                  <Input id="p2" type="password" minLength={8} value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                </div>
                <Turnstile onToken={setTurnstileToken} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Ukladám…" : "Nastaviť heslo"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
