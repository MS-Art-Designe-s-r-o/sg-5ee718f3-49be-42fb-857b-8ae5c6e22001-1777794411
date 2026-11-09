// Parser značiek pre docxtemplater: bodkové cesty ({firma.nazov}) bez eval.
//
// Hodnota sa hľadá v aktuálnom rozsahu; ak tam nie je, docxtemplater sa sám
// vráti do nadradených rozsahov. Vďaka tomu vnútri {#flotila}…{/flotila}
// funguje {nazov} (rozsah = objekt flotily) aj {flotila.nazov} (koreňový rozsah).
// Len vlastné vlastnosti objektov (žiadne __proto__, constructor, …).

export type ScopeParser = { get(scope: unknown): unknown };

/** Kľúče, ktoré sa nikdy nečítajú (ani ako vlastné vlastnosti, napr. po JSON.parse). */
const FORBIDDEN = new Set(["__proto__", "constructor", "prototype"]);

export function scopeParser(tag: string): ScopeParser {
  const t = String(tag ?? "").trim();
  if (t === "." || t === "this") return { get: (scope) => scope };
  const path = t.split(".").map((p) => p.trim());
  return {
    get(scope: unknown): unknown {
      let cur: unknown = scope;
      for (const key of path) {
        if (cur === null || typeof cur !== "object" || Array.isArray(cur)) return undefined;
        if (FORBIDDEN.has(key) || !Object.prototype.hasOwnProperty.call(cur, key)) return undefined;
        cur = (cur as Record<string, unknown>)[key];
      }
      return cur;
    },
  };
}
