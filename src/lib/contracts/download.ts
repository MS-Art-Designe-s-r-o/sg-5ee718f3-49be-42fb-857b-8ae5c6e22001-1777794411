// Odoslanie uloženého súboru (zmluva, šablóna) ako prílohy — bez cachovania.
import type { NextApiResponse } from "next";
import { describeError, PublicError } from "@/lib/safeLog";
import { openStoredStream, statStored } from "./storage";

export const MIME_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const MIME_PDF = "application/pdf";

/** RFC 5987: percent-encoding UTF-8 vrátane ' ( ) * (encodeURIComponent ich nechá). */
function rfc5987(v: string): string {
  return encodeURIComponent(v).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Content-Disposition s ASCII fallbackom a filename* v UTF-8. */
export function attachmentHeader(fileName: string): string {
  const name = String(fileName ?? "").replace(/[\r\n"\\/]/g, "_") || "subor";
  const ascii = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7e]/g, "_")
    .replace(/[%;]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${rfc5987(name)}`;
}

/**
 * Overí existenciu a pošle súbor streamom. Chýbajúci súbor → PublicError 404
 * (ešte pred odoslaním hlavičiek).
 */
export async function sendStoredFile(
  res: NextApiResponse,
  relPath: string,
  fileName: string,
  contentType: string
): Promise<void> {
  const st = await statStored(relPath);
  if (!st) throw new PublicError("Súbor sa nenašiel.", 404);
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", String(st.size));
  res.setHeader("Content-Disposition", attachmentHeader(fileName));
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  await new Promise<void>((resolve) => {
    const stream = openStoredStream(relPath);
    stream.on("error", (e) => {
      // Bez textu chyby — obsahuje cestu so menom vodiča.
      console.error(`download: čítanie súboru zlyhalo: ${describeError(e, { withMessage: false })}`);
      if (!res.headersSent) {
        res.removeHeader("Content-Length");
        res.removeHeader("Content-Disposition");
        res.status(500).json({ message: "Súbor sa nepodarilo načítať" });
      } else res.destroy();
      resolve();
    });
    res.on("close", () => {
      stream.destroy();
      resolve();
    });
    stream.on("end", () => resolve());
    stream.pipe(res);
  });
}
