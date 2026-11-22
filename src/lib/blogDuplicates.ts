// Duplicitné blogové články (rovnaká téma a takmer rovnaký obsah) -> 301 na ponechaný článok.
// Obsah v data/blog-posts.json sa NEMAZÁ; duplicitný článok sa len presmeruje a skryje
// z výpisu blogu, sitemapy a sekcie Blog na homepage. API /api/blog (GET) ostáva nezmenené,
// aby Šefko videl, že téma už existuje.
// Ponechávame starší článok (dlhšie online, prípadne už odkazovaný); pri detskej sedačke ten,
// na ktorý už smerujú staré ?post= presmerovania.

export const BLOG_DUPLICATE_REDIRECTS: Record<string, string> = {
  // Krakov: ponechať 3. 11. 2026
  "taxi-z-kosic-na-letisko-krakov-pevna-cena-290-cas-cesty-a-ako-objednat": "taxi-z-kosic-na-letisko-krakov-cena-290-cas-a-ako-objednat",
  // Viedeň: ponechať 4. 11. 2026
  "taxi-z-kosic-na-letisko-vieden-pevna-cena-450-cas-cesty-a-ako-objednat": "taxi-z-kosic-na-letisko-vieden-pevna-cena-450-cas-a-ako-objednat",
  // Debrecín: ponechať 6. 11. 2026
  "taxi-z-kosic-na-letisko-debrecin-cas-cesty-cena-a-ako-objednat": "taxi-z-kosic-do-debrecina-kedy-sa-transfer-oplati-a-ako-ho-objednat",
  // Detská sedačka: ponechať cieľ starých ?post= presmerovaní (20. 11. 2026)
  "detska-sedacka-v-taxi-v-kosiciach-co-treba-vediet-pred-jazdou": "taxi-s-detskou-sedackou-v-kosiciach-ako-ju-objednat-a-na-co-mysliet",
};

export function blogDuplicateTarget(slug: string): string | null {
  return BLOG_DUPLICATE_REDIRECTS[slug] ?? null;
}

export function withoutDuplicates<T extends { slug: string }>(posts: T[]): T[] {
  return posts.filter((p) => !BLOG_DUPLICATE_REDIRECTS[p.slug]);
}
