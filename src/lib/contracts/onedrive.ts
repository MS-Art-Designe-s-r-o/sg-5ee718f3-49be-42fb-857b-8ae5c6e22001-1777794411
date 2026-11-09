// Synchronizácia zmlúv do OneDrive — FÁZA 2, zatiaľ VYPNUTÉ (no-op).
//
// Teraz existuje len rozhranie, čítanie konfigurácie z prostredia a no-op
// implementácia. Žiadne volania Microsoft Graph sa NEROBIA.
//
// TODO (fáza 2):
//  - Microsoft Graph, client-credentials flow:
//      POST https://login.microsoftonline.com/{MS_TENANT_ID}/oauth2/v2.0/token
//      (grant_type=client_credentials, scope=https://graph.microsoft.com/.default,
//       client_id=MS_CLIENT_ID, client_secret=MS_CLIENT_SECRET); token cacheovať do expirácie.
//  - Upload súboru: PUT /drives/{ONEDRIVE_DRIVE_ID}/root:/{cesta}:/content
//      * do ~4 MB jednoduchý upload (jeden PUT),
//      * väčšie súbory cez upload session (POST …/createUploadSession + PUT po častiach).
//  - Výsledné `itemId` uložiť do Contract.onedriveItemId (+ onedriveSyncedAt / onedriveError).
//  - Chyby nesmú obsahovať osobné údaje ani obsah súborov.
//
// Cesta v OneDrive: {ONEDRIVE_ROOT}/{Priezvisko Meno}/{názov súboru}
import { PublicError } from "@/lib/safeLog";
import { safeSegment } from "./storage";

export const DEFAULT_ONEDRIVE_ROOT = "/Documents/E-Taxi/Vodici";

export interface OneDriveUploader {
  enabled: boolean;
  upload(args: {
    /** Relatívna cesta súboru v lokálnom úložisku. */
    relPath: string;
    /** Názov súboru v OneDrive. */
    fileName: string;
    data: Buffer;
    /** Názov priečinka vodiča („Priezvisko Meno“). */
    vodicFolder: string;
  }): Promise<{ itemId: string }>;
}

/** Implementácia pre vypnutú synchronizáciu — upload vždy zlyhá s verejnou chybou. */
export class NoopOneDriveUploader implements OneDriveUploader {
  readonly enabled = false;
  async upload(): Promise<{ itemId: string }> {
    throw new PublicError("OneDrive nie je zapnutý", 503);
  }
}

export type OneDriveConfig = {
  enabled: boolean;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  driveId: string;
  /** Koreň v OneDrive, vždy s úvodným lomítkom a bez koncového (napr. /Documents/E-Taxi/Vodici). */
  root: string;
};

const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

/** Normalizuje koreň: lomítka, každý segment cez safeSegment, bez prázdnych častí. */
export function normalizeOneDriveRoot(raw: string | undefined | null): string {
  const parts = String(raw ?? "")
    .split(/[\\/]+/)
    .map((p) => p.trim())
    .filter((p) => p && p !== "." && p !== "..")
    .map(safeSegment);
  return parts.length ? `/${parts.join("/")}` : DEFAULT_ONEDRIVE_ROOT;
}

/** Konfigurácia z env (default: vypnuté). Tajomstvo sa nikdy nevypisuje do logov. */
export function getOneDriveConfig(env: Record<string, string | undefined> = process.env): OneDriveConfig {
  const t = (k: string) => (env[k] ?? "").trim();
  return {
    enabled: TRUE_VALUES.has(t("ONEDRIVE_ENABLED").toLowerCase()),
    tenantId: t("MS_TENANT_ID"),
    clientId: t("MS_CLIENT_ID"),
    clientSecret: t("MS_CLIENT_SECRET"),
    driveId: t("ONEDRIVE_DRIVE_ID"),
    root: normalizeOneDriveRoot(t("ONEDRIVE_ROOT") || DEFAULT_ONEDRIVE_ROOT),
  };
}

/** Názov priečinka vodiča: „Priezvisko Meno“. */
export function oneDriveFolderName(priezvisko: string | null | undefined, meno: string | null | undefined): string {
  return safeSegment(`${priezvisko ?? ""} ${meno ?? ""}`);
}

/** Úplná cesta v OneDrive: {root}/{Priezvisko Meno}/{názov súboru}. */
export function buildOneDrivePath(root: string, vodicFolder: string, fileName: string): string {
  return `${normalizeOneDriveRoot(root)}/${safeSegment(vodicFolder)}/${safeSegment(fileName)}`;
}

/** Fáza 2: zatiaľ vždy no-op, aj keď je ONEDRIVE_ENABLED zapnuté. */
export function getOneDriveUploader(): OneDriveUploader {
  // TODO fáza 2: pri getOneDriveConfig().enabled && konfigurácia kompletná vrátiť Graph implementáciu.
  return new NoopOneDriveUploader();
}
