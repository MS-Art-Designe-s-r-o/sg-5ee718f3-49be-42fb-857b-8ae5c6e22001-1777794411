// Profil vodiča (osobné a zmluvné údaje) — len MAJITEL.
//
// GET  → profil (aj neexistujúci = predvolené hodnoty); RČ a OP len ako
//        { hasValue, maska }, nikdy *Enc ani *Bidx.
// PUT  → upsert; vynechané pole = nemeniť, null/"" = vymazať. RČ a OP sa šifrujú
//        (AAD "<pole>:<userId>"), RČ má blind index na detekciu duplicity.
//        Zmena sa zapíše do auditu (PII_UPDATE, len názvy polí) v tej istej transakcii.
// Chybové odpovede obsahujú len názvy polí, nikdy hodnoty.
import type { NextApiRequest, NextApiResponse } from "next";
import type { RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import { queryOne, withTransaction, type DriverProfileRow, type SqlParam } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { getClientIp, parseBody, withErrorHandler } from "@/lib/apiHelpers";
import {
  blindIndex,
  decryptField,
  encryptField,
  maskGeneric,
  maskRodneCislo,
} from "@/lib/crypto/fieldCrypto";
import {
  birthDateFromRodneCislo,
  normalizeRodneCislo,
  validateRodneCislo,
} from "@/lib/rodneCislo";
import {
  missingForRezim,
  normalizeCisloOp,
  normalizeDic,
  normalizeIban,
  normalizeIcDph,
  normalizeIco,
  validateIban,
} from "@/lib/driverProfile";
import { writeAudit } from "@/lib/audit";

// ── Validácia vstupu ──────────────────────────────────────────────────────────

/** Text: vynechané = undefined (nemeniť), null alebo "" = null (vymazať). */
const optText = (max: number) =>
  z
    .string()
    .max(max)
    .nullable()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === null ? null : v.trim() || null));

function isRealDate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

const optDate = z
  .string()
  .nullable()
  .optional()
  .transform((v) => (v === undefined ? undefined : v === null || v.trim() === "" ? null : v.trim()))
  .refine((v) => v === undefined || v === null || isRealDate(v), { message: "Neplatný dátum" });

const updateSchema = z.object({
  titulPred: optText(50),
  titulZa: optText(50),
  datumNarodenia: optDate,
  rodneCislo: optText(20),
  cisloOp: optText(30),
  trvalyPobyt: optText(255),
  cisloVp: optText(50),
  cisloPvt: optText(50),
  pvtPlatnostDo: optDate,
  iban: optText(50),
  stav: z.enum(["AKTIVNY", "POZASTAVENY", "UKONCENY"]).optional(),
  fleetId: z.number().int().positive().nullable().optional(),
  rezim: z.enum(["VO_FLOTILE", "VLASTNA_KONCESIA"]).nullable().optional(),
  stranaTyp: z.enum(["FYZICKA_OSOBA", "PRAVNICKA_OSOBA"]).nullable().optional(),
  firmaObchodneMeno: optText(191),
  firmaIco: optText(30),
  firmaDic: optText(30),
  firmaIcDph: optText(30),
  firmaSidlo: optText(255),
  firmaZapisanyV: optText(255),
  cisloKoncesie: optText(50),
  koncesiaPlatnostDo: optDate,
  firmaStatutar: optText(191),
});

/** Nešifrované stĺpce, ktoré sa ukladajú priamo (po normalizácii). */
const PLAIN_TEXT_FIELDS = [
  "titulPred",
  "titulZa",
  "trvalyPobyt",
  "cisloVp",
  "cisloPvt",
  "firmaObchodneMeno",
  "firmaSidlo",
  "firmaZapisanyV",
  "cisloKoncesie",
  "firmaStatutar",
] as const;
const DATE_FIELDS = ["datumNarodenia", "pvtPlatnostDo", "koncesiaPlatnostDo"] as const;

type Col = Exclude<keyof DriverProfileRow, "userId" | "createdAt" | "updatedAt" | "anonymizedAt">;

// ── Výstup ────────────────────────────────────────────────────────────────────

function maskInfo(enc: string | null | undefined, aad: string, mask: (plain: string) => string) {
  if (!enc) return { hasValue: false, maska: null as string | null };
  try {
    return { hasValue: true, maska: mask(decryptField(enc, aad)) };
  } catch {
    // Bez kľúčov / poškodený údaj: hodnota existuje, maska nie je k dispozícii.
    return { hasValue: true, maska: null as string | null };
  }
}

/** Verejný tvar profilu — explicitný zoznam polí (nikdy *Enc ani *Bidx). */
function toPublic(userId: number, p: DriverProfileRow | null) {
  return {
    userId,
    existuje: !!p,
    titulPred: p?.titulPred ?? null,
    titulZa: p?.titulZa ?? null,
    datumNarodenia: p?.datumNarodenia ?? null,
    rodneCislo: maskInfo(p?.rodneCisloEnc, `rodneCislo:${userId}`, maskRodneCislo),
    cisloOp: maskInfo(p?.cisloOpEnc, `cisloOp:${userId}`, maskGeneric),
    trvalyPobyt: p?.trvalyPobyt ?? null,
    cisloVp: p?.cisloVp ?? null,
    cisloPvt: p?.cisloPvt ?? null,
    pvtPlatnostDo: p?.pvtPlatnostDo ?? null,
    iban: p?.iban ?? null,
    stav: p?.stav ?? "AKTIVNY",
    fleetId: p?.fleetId ?? null,
    rezim: p?.rezim ?? null,
    stranaTyp: p?.stranaTyp ?? null,
    firmaObchodneMeno: p?.firmaObchodneMeno ?? null,
    firmaIco: p?.firmaIco ?? null,
    firmaDic: p?.firmaDic ?? null,
    firmaIcDph: p?.firmaIcDph ?? null,
    firmaSidlo: p?.firmaSidlo ?? null,
    firmaZapisanyV: p?.firmaZapisanyV ?? null,
    cisloKoncesie: p?.cisloKoncesie ?? null,
    koncesiaPlatnostDo: p?.koncesiaPlatnostDo ?? null,
    firmaStatutar: p?.firmaStatutar ?? null,
    anonymizedAt: p?.anonymizedAt ?? null,
    createdAt: p?.createdAt ?? null,
    updatedAt: p?.updatedAt ?? null,
  };
}

async function loadResponse(userId: number) {
  const p = await queryOne<DriverProfileRow>("SELECT * FROM `DriverProfile` WHERE `userId` = ?", [userId]);
  const fleet = p?.fleetId
    ? await queryOne<{ id: number; obchodneMeno: string }>(
        "SELECT `id`, `obchodneMeno` FROM `Fleet` WHERE `id` = ?",
        [p.fleetId]
      )
    : null;
  return { profile: toPublic(userId, p), fleet: fleet ?? null };
}

/** Používateľ existuje a má rolu VODIC. */
async function isDriver(userId: number): Promise<boolean> {
  const row = await queryOne<{ id: number }>(
    "SELECT u.`id` FROM `User` u JOIN `UserRole` r ON r.`userId` = u.`id` AND r.`role` = 'VODIC' WHERE u.`id` = ? LIMIT 1",
    [userId]
  );
  return !!row;
}

function isDupBidx(e: unknown): boolean {
  const err = e as { code?: unknown; sqlMessage?: unknown };
  return err?.code === "ER_DUP_ENTRY" && String(err.sqlMessage ?? "").includes("rodneCisloBidx");
}

const MSG_DUP_RC = "Vodič s týmto rodným číslom už existuje";

// ── Handler ───────────────────────────────────────────────────────────────────

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Neplatné ID" });
    res.setHeader("Cache-Control", "no-store");

    if (req.method === "GET") {
      if (!(await isDriver(id))) return res.status(404).json({ message: "Vodič neexistuje" });
      return res.status(200).json(await loadResponse(id));
    }

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;
      if (!(await isDriver(id))) return res.status(404).json({ message: "Vodič neexistuje" });

      // 1) Normalizácia a validácia (bez DB zápisu).
      const invalid: string[] = [];
      const ch: Partial<Record<Col, SqlParam>> = {};

      for (const k of PLAIN_TEXT_FIELDS) if (body[k] !== undefined) ch[k] = body[k];
      for (const k of DATE_FIELDS) if (body[k] !== undefined) ch[k] = body[k];
      if (body.stav !== undefined) ch.stav = body.stav;
      if (body.rezim !== undefined) ch.rezim = body.rezim;
      if (body.stranaTyp !== undefined) ch.stranaTyp = body.stranaTyp;

      const normalizeOpt = (
        field: "iban" | "firmaIco" | "firmaDic" | "firmaIcDph",
        fn: (v: string) => string | null
      ) => {
        const v = body[field];
        if (v === undefined) return;
        if (v === null) {
          ch[field] = null;
          return;
        }
        const n = fn(v);
        if (n === null) invalid.push(field);
        else ch[field] = n;
      };
      normalizeOpt("iban", (v) => {
        const n = normalizeIban(v);
        return validateIban(n) ? n : null;
      });
      normalizeOpt("firmaIco", normalizeIco);
      normalizeOpt("firmaDic", normalizeDic);
      normalizeOpt("firmaIcDph", normalizeIcDph);

      let rcNorm: string | null | undefined;
      if (body.rodneCislo !== undefined) {
        if (body.rodneCislo === null) rcNorm = null;
        else if (validateRodneCislo(body.rodneCislo)) rcNorm = normalizeRodneCislo(body.rodneCislo);
        else invalid.push("rodneCislo");
      }
      let opNorm: string | null | undefined;
      if (body.cisloOp !== undefined) {
        if (body.cisloOp === null) opNorm = null;
        else {
          const n = normalizeCisloOp(body.cisloOp);
          if (n === null) invalid.push("cisloOp");
          else opNorm = n;
        }
      }

      if (invalid.length) {
        return res.status(400).json({ message: "Neplatné údaje", polia: invalid });
      }

      if (body.fleetId !== undefined) {
        if (body.fleetId !== null) {
          const f = await queryOne<{ id: number }>("SELECT `id` FROM `Fleet` WHERE `id` = ?", [body.fleetId]);
          if (!f) return res.status(400).json({ message: "Zvolená flotila neexistuje", polia: ["fleetId"] });
        }
        ch.fleetId = body.fleetId;
      }

      // 2) Zápis v transakcii (zámok riadku profilu, audit v tej istej transakcii).
      type Outcome = { ok: true } | { conflict: true } | { missing: string[] };
      let outcome: Outcome;
      try {
        outcome = await withTransaction<Outcome>(async (tx) => {
          const [rows] = await tx.query<RowDataPacket[]>(
            "SELECT * FROM `DriverProfile` WHERE `userId` = ? FOR UPDATE",
            [id]
          );
          const cur = (rows[0] as DriverProfileRow | undefined) ?? null;
          const set: Partial<Record<Col, SqlParam>> = {};
          const changed: string[] = [];
          const current = (k: Col): unknown => (cur ? cur[k] : k === "stav" ? "AKTIVNY" : null);

          for (const [k, v] of Object.entries(ch) as [Col, SqlParam][]) {
            if (current(k) !== v) {
              set[k] = v;
              changed.push(k);
            }
          }

          if (rcNorm !== undefined) {
            if (rcNorm === null) {
              if (cur?.rodneCisloEnc || cur?.rodneCisloBidx) {
                set.rodneCisloEnc = null;
                set.rodneCisloBidx = null;
                changed.push("rodneCislo");
              }
            } else {
              const bidx = blindIndex(rcNorm);
              if (cur?.rodneCisloBidx !== bidx || !cur?.rodneCisloEnc) {
                // FOR UPDATE zamkne aj medzeru v unikátnom indexe → žiadny súbežný duplikát.
                const [dup] = await tx.query<RowDataPacket[]>(
                  "SELECT `userId` FROM `DriverProfile` WHERE `rodneCisloBidx` = ? AND `userId` <> ? LIMIT 1 FOR UPDATE",
                  [bidx, id]
                );
                if (dup.length) return { conflict: true };
                set.rodneCisloEnc = encryptField(rcNorm, `rodneCislo:${id}`);
                set.rodneCisloBidx = bidx;
                changed.push("rodneCislo");
              }
              // Chýbajúci dátum narodenia doplníme z RČ.
              const datum = "datumNarodenia" in set ? set.datumNarodenia : cur?.datumNarodenia ?? null;
              if (!datum) {
                const d = birthDateFromRodneCislo(rcNorm);
                if (d) {
                  set.datumNarodenia = d;
                  if (!changed.includes("datumNarodenia")) changed.push("datumNarodenia");
                }
              }
            }
          }

          if (opNorm !== undefined) {
            if (opNorm === null) {
              if (cur?.cisloOpEnc) {
                set.cisloOpEnc = null;
                changed.push("cisloOp");
              }
            } else {
              let same = false;
              if (cur?.cisloOpEnc) {
                try {
                  same = decryptField(cur.cisloOpEnc, `cisloOp:${id}`) === opNorm;
                } catch {
                  same = false;
                }
              }
              if (!same) {
                set.cisloOpEnc = encryptField(opNorm, `cisloOp:${id}`);
                changed.push("cisloOp");
              }
            }
          }

          // Povinné polia podľa režimu — nad výsledným stavom (aktuálny + zmeny).
          const eff = <K extends Col>(k: K) =>
            (k in set ? set[k] : cur ? cur[k] : null) as DriverProfileRow[K];
          const missing = missingForRezim({
            rezim: eff("rezim"),
            stranaTyp: eff("stranaTyp"),
            firmaObchodneMeno: eff("firmaObchodneMeno"),
            firmaIco: eff("firmaIco"),
            firmaDic: eff("firmaDic"),
            cisloKoncesie: eff("cisloKoncesie"),
          });
          if (missing.length) return { missing };

          if (!changed.length) return { ok: true };

          // Zámerne nie INSERT … ON DUPLICATE KEY UPDATE: pri kolízii na unikátnom
          // rodneCisloBidx by MySQL aktualizoval CUDZÍ riadok. Riadok je zamknutý vyššie.
          const cols = Object.keys(set) as Col[];
          const vals = cols.map((c) => set[c] as SqlParam);
          if (cur) {
            await tx.execute(
              `UPDATE \`DriverProfile\` SET ${cols.map((c) => `\`${c}\` = ?`).join(", ")} WHERE \`userId\` = ?`,
              [...vals, id]
            );
          } else {
            await tx.execute(
              `INSERT INTO \`DriverProfile\` (\`userId\`, ${cols.map((c) => `\`${c}\``).join(", ")})
               VALUES (?, ${cols.map(() => "?").join(", ")})`,
              [id, ...vals]
            );
          }

          await writeAudit(
            {
              userId: ctx.userId,
              action: "PII_UPDATE",
              entity: "DriverProfile",
              entityId: id,
              ip: getClientIp(req) ?? null,
              meta: { polia: changed },
            },
            tx
          );
          return { ok: true };
        });
      } catch (e) {
        if (isDupBidx(e)) return res.status(409).json({ message: MSG_DUP_RC });
        throw e;
      }

      if ("conflict" in outcome) return res.status(409).json({ message: MSG_DUP_RC });
      if ("missing" in outcome) {
        return res.status(400).json({
          message: "Chýbajú povinné údaje pre zvolený režim",
          chybajucePolia: outcome.missing,
        });
      }
      return res.status(200).json(await loadResponse(id));
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
