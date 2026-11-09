// Odosielanie e-mailov portálu (pozvánka / reset hesla) cez existujúci SMTP.
// Rovnaká konfigurácia ako objednávkový formulár (WebSupport).
import nodemailer from "nodemailer";
import crypto from "crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://e-taxike.sk";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/**
 * Pošle pozvánku / odkaz na nastavenie hesla. Ak SMTP nie je nastavené,
 * odkaz sa zaloguje do konzoly (dev) a vráti sa volajúcemu.
 */
export async function sendPasswordSetupEmail(params: {
  to: string;
  meno: string;
  token: string;
  isReset?: boolean;
}): Promise<{ sent: boolean; link: string }> {
  const link = `${SITE_URL}/portal/nastavit-heslo?token=${params.token}`;
  const transporter = getTransporter();
  const subject = params.isReset
    ? "Obnovenie hesla — E-TAXI Košice portál"
    : "Pozvánka do portálu E-TAXI Košice";
  const intro = params.isReset
    ? "Požiadali ste o obnovenie hesla do portálu E-TAXI Košice."
    : "Boli ste pozvaní do portálu E-TAXI Košice. Nastavte si heslo pre prístup.";

  if (!transporter) {
    // Bez e-mailu a odkazu v logu (osobné údaje / token); odkaz sa vracia volajúcemu v odpovedi API.
    console.warn("[SMTP nenastavené] E-mail s odkazom na heslo sa neodoslal.");
    return { sent: false, link };
  }

  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#333">
  <div style="max-width:600px;margin:0 auto;padding:20px">
    <div style="background:#282462;color:#fff;padding:20px;text-align:center">
      <h2>🚕 E-TAXI Košice — Portál</h2>
    </div>
    <div style="padding:20px;background:#f9f9f9;margin:20px 0">
      <p>Dobrý deň ${params.meno},</p>
      <p>${intro}</p>
      <p style="text-align:center;margin:30px 0">
        <a href="${link}" style="background:#282462;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px">
          Nastaviť heslo
        </a>
      </p>
      <p style="font-size:12px;color:#666">Ak tlačidlo nefunguje, skopírujte odkaz do prehliadača:<br>${link}</p>
      <p style="font-size:12px;color:#666">Odkaz je platný 48 hodín.</p>
    </div>
  </div>
</body></html>`.trim();

  await transporter.sendMail({
    from: `"E-TAXI Košice Portál" <${process.env.SMTP_USER}>`,
    to: params.to,
    subject,
    text: `${intro}\n\nNastavte si heslo: ${link}\n\nOdkaz je platný 48 hodín.`,
    html,
  });

  return { sent: true, link };
}
