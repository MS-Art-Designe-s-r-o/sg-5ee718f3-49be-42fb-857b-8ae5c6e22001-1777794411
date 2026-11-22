"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  fetchCurrentUser,
  apiFetch,
  ROLE_LABELS,
  type CurrentUser,
  type Role,
} from "@/lib/portalClient";
import { isoWeekParts } from "@/lib/fees";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Car,
  Users,
  CalendarDays,
  Euro,
  Wallet,
  Contact,
  Building2,
  Truck,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: ReactNode; roles: Role[] };

const NAV: NavItem[] = [
  { href: "/portal", label: "Dashboard", icon: <LayoutDashboard size={18} />, roles: ["MAJITEL", "DISPECER", "VODIC"] },
  { href: "/portal/vozidla", label: "Vozidlá", icon: <Car size={18} />, roles: ["MAJITEL"] },
  { href: "/portal/vodici", label: "Vodiči", icon: <Users size={18} />, roles: ["MAJITEL"] },
  { href: "/portal/flotily", label: "Flotily", icon: <Truck size={18} />, roles: ["MAJITEL"] },
  { href: "/portal/sablony", label: "Šablóny zmlúv", icon: <FileText size={18} />, roles: ["MAJITEL"] },
  { href: "/portal/nastavenia-firmy", label: "Údaje firmy", icon: <Building2 size={18} />, roles: ["MAJITEL"] },
  { href: "/portal/smeny", label: "Rozpis smien", icon: <CalendarDays size={18} />, roles: ["MAJITEL", "DISPECER"] },
  { href: "/portal/trzby", label: "Tržby a poplatky", icon: <Euro size={18} />, roles: ["MAJITEL"] },
  { href: "/portal/vydavky", label: "Výdavky", icon: <Wallet size={18} />, roles: ["MAJITEL"] },
  { href: "/portal/moje-smeny", label: "Moje smeny", icon: <CalendarDays size={18} />, roles: ["VODIC"] },
  { href: "/portal/moje-poplatky", label: "Moje poplatky", icon: <Euro size={18} />, roles: ["VODIC"] },
  { href: "/portal/kontakty", label: "Kontakty", icon: <Contact size={18} />, roles: ["MAJITEL", "DISPECER", "VODIC"] },
];

export function PortalLayout({ children, title }: { children: ReactNode; title?: string }) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then((u) => {
        if (!u) {
          router.replace(`/prihlasenie?redirect=${encodeURIComponent(router.asPath)}`);
          return;
        }
        setUser(u);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Chyba načítania"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/prihlasenie");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Načítavam…
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-red-600">Nepodarilo sa načítať portál: {error}</p>
        <Button onClick={() => window.location.reload()}>Skúsiť znova</Button>
        <button className="text-sm text-muted-foreground underline" onClick={() => router.replace("/prihlasenie")}>
          Späť na prihlásenie
        </button>
      </div>
    );
  }
  if (!user) return null;

  const items = NAV.filter((n) => n.roles.some((r) => user.roles.includes(r)));

  const dnes = new Date();
  const datumText = dnes.toLocaleDateString("sk-SK", {
    weekday: "short", day: "numeric", month: "numeric", year: "numeric",
  });
  const wk = isoWeekParts(dnes);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-[#282462] text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link href="/portal" className="font-bold">
              🚕 E-TAXI Košice — Portál
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden lg:inline whitespace-nowrap bg-white/10 rounded px-2 py-1">
              📅 {datumText} · Týždeň {wk.isoTyzden}/{wk.isoRok}
            </span>
            <span className="hidden sm:inline opacity-90">
              {user.meno} {user.priezvisko}
              {user.volaciZnak ? ` · ${user.volaciZnak}` : ""} ·{" "}
              {user.roles.map((r) => ROLE_LABELS[r]).join(", ")}
            </span>
            <Button size="sm" variant="secondary" onClick={logout}>
              <LogOut size={16} className="mr-1" /> Odhlásiť
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        <aside
          className={`${open ? "block" : "hidden"} md:block w-full md:w-56 shrink-0 bg-white md:bg-transparent border-r md:border-r-0`}
        >
          <nav className="p-3 space-y-1">
            {items.map((n) => {
              const active = router.pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-[#282462] text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {n.icon}
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 min-w-0">
          {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
}

/** Hook pre aktuálneho používateľa (pre stránky, ktoré ho potrebujú). */
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);
  return { user, loading };
}
