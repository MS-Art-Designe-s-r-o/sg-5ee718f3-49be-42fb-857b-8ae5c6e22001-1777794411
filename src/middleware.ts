// 1) 301 zo starých blogových adries /?post=<slug> na aktuálne stránky (SEO).
// 2) Ochrana stránok portálu — presmeruje neprihlásených na /prihlasenie.
// Skutočná kontrola rolí je server-side (API withAuth + getServerSideProps).
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { legacyPostRedirect } from "@/lib/legacyPostRedirects";

const SESSION_COOKIE = "etaxi_session";

// Verejné cesty v rámci /portal (bez prihlásenia).
const PUBLIC_PORTAL_PATHS = ["/portal/nastavit-heslo"];

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Staré blogové URL (?post=) -> trvalé presmerovanie na najbližšiu aktuálnu stránku.
  const legacy = legacyPostRedirect(pathname, req.nextUrl.searchParams.get("post"), req.nextUrl.locale);
  if (legacy) {
    return NextResponse.redirect(legacy, 301);
  }

  // Ďalej len portál.
  if (!/^\/((en|de|hu|pl)\/)?portal(\/|$)/.test(pathname)) {
    return NextResponse.next();
  }

  // Normalizuj prípadný /en prefix (i18n).
  const path = pathname.replace(/^\/en/, "") || "/";

  if (PUBLIC_PORTAL_PATHS.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await isValidSession(token)) {
    return NextResponse.next();
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/prihlasenie";
  loginUrl.search = `?redirect=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // "/" pokrýva aj /en, /de, /hu (Next i18n pridáva jazykové prefixy k matcherom automaticky).
  matcher: ["/", "/portal/:path*", "/en/portal/:path*"],
};
