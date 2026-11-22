// Logika blokovania slotov vozidla (nedostupné / servis) podľa rozsahu.
// Rozsah (CELY_DEN / DENNA / NOCNA) sa pri viacdňovom intervale vzťahuje len na
// POSLEDNÝ deň intervalu; ostatné dni sú blokované celý deň.

export type Rozsah = "CELY_DEN" | "DENNA" | "NOCNA";
export type TypSlotu = "DENNA" | "NOCNA";

/**
 * Blokuje daný blok konkrétny slot (datum + typ smeny)?
 * Predpoklad: `datum` (YYYY-MM-DD) sa už nachádza v intervale [datumOd, datumDo].
 */
export function blockCoversSlot(
  b: { datumDo: string; rozsah: string },
  datum: string,
  typ: TypSlotu
): boolean {
  const last = b.datumDo.slice(0, 10);
  if (datum.slice(0, 10) < last) return true; // skorší deň intervalu → celý deň
  return b.rozsah === "CELY_DEN" || b.rozsah === typ; // posledný deň → podľa rozsahu
}

export const ROZSAH_LABEL: Record<Rozsah, string> = {
  CELY_DEN: "celý deň",
  DENNA: "denná",
  NOCNA: "nočná",
};
