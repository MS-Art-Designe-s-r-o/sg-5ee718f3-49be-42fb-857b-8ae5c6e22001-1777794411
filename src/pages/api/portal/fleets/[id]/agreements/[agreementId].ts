// Zmazanie evidovanej zmluvy flotily — len MAJITEL.
import type { NextApiRequest, NextApiResponse } from "next";
import { execute } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "DELETE") return res.status(405).json({ message: "Method not allowed" });
    const fleetId = Number(req.query.id);
    const agreementId = Number(req.query.agreementId);
    if (!Number.isInteger(fleetId) || fleetId <= 0 || !Number.isInteger(agreementId) || agreementId <= 0) {
      return res.status(400).json({ message: "Neplatné ID" });
    }
    const r = await execute("DELETE FROM `FleetAgreement` WHERE `id` = ? AND `fleetId` = ?", [agreementId, fleetId]);
    if (!r.affectedRows) return res.status(404).json({ message: "Zmluva neexistuje" });
    return res.status(200).json({ ok: true });
  })
);
