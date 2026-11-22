import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { getDictionary } from "@/locales";
import { describeError } from "@/lib/safeLog";

type BookingData = {
  pickup: string;
  destination: string;
  datetime: string;
  passengers?: number | string;
  luggage?: string;
  flightNumber?: string;
  note?: string;
  phone?: string;
  email?: string;
  priceEstimateOnly?: boolean;
  locale?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { pickup, destination, datetime, passengers, luggage, flightNumber, note, phone, email, priceEstimateOnly, locale }: BookingData = req.body;
    // Slovník pre komunikáciu so zákazníkom (podľa jazyka webu, z ktorého objednal)
    const t = getDictionary(locale);

    // Povinné polia (zhodné s hviezdičkami vo formulári). passengers/luggage/
    // flightNumber/note sú nepovinné, preto ich tu nevynucujeme.
    if (!pickup || !destination || !datetime || !phone || !email) {
      return res.status(400).json({ message: "Chýbajú povinné polia" });
    }

    // Zobraziteľné hodnoty voliteľných polí (v e-mailoch len ak sú vyplnené)
    const passengersText = passengers ? String(passengers) : "—";

    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("⚠️ SMTP configuration missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local");
      
      // Bez zápisu osobných údajov objednávky (telefón, e-mail, adresy) do logu.


      return res.status(200).json({ 
        message: "Objednávka prijatá. Pre aktiváciu emailov nastavte SMTP_HOST, SMTP_USER a SMTP_PASS v .env.local",
        success: true,
        note: "SMTP nie je nakonfigurované"
      });
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // SSL/TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format email content
    const emailSubject = priceEstimateOnly 
      ? `Cenová kalkulácia: ${pickup} → ${destination}`
      : `Nová objednávka: ${pickup} → ${destination}`;

    const emailText = `
Nová objednávka taxíka z webu E-TAXI Košice

────────────────────────────────────────
DETAILY OBJEDNÁVKY
────────────────────────────────────────

📍 Miesto vyzdvihnutia: ${pickup}
📍 Cieľ: ${destination}
🕐 Dátum a čas: ${new Date(datetime).toLocaleString("sk-SK")}
👥 Počet pasažierov: ${passengersText}
🧳 Batožina: ${luggage || "—"}
✈️ Číslo letu: ${flightNumber || "—"}
📝 Poznámka: ${note || "—"}
📞 Telefón: ${phone}
📧 Email: ${email}

${priceEstimateOnly ? "💰 TYP: Iba cenová kalkulácia (zákazník nežiada objednávku)" : "✅ TYP: Objednávka taxíka"}

────────────────────────────────────────
Odoslané: ${new Date().toLocaleString("sk-SK")}
Z webu: https://e-taxike.sk
    `.trim();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #282462; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
    .detail { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #282462; }
    .label { font-weight: bold; color: #282462; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
    ${priceEstimateOnly ? '.estimate-badge { background: #ff9500; color: white; padding: 10px; text-align: center; font-weight: bold; }' : ''}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🚕 E-TAXI Košice</h2>
      <p>${priceEstimateOnly ? 'Žiadosť o cenovú kalkuláciu' : 'Nová objednávka'}</p>
    </div>
    
    ${priceEstimateOnly ? '<div class="estimate-badge">💰 Iba cenová kalkulácia - NIE objednávka</div>' : ''}
    
    <div class="content">
      <div class="detail">
        <span class="label">📍 Miesto vyzdvihnutia:</span><br>
        ${pickup}
      </div>
      
      <div class="detail">
        <span class="label">📍 Cieľová adresa:</span><br>
        ${destination}
      </div>
      
      <div class="detail">
        <span class="label">🕐 Dátum a čas:</span><br>
        ${new Date(datetime).toLocaleString("sk-SK")}
      </div>
      
      <div class="detail">
        <span class="label">👥 Počet pasažierov:</span><br>
        ${passengersText}
      </div>
      ${luggage ? `
      <div class="detail">
        <span class="label">🧳 Batožina:</span><br>
        ${luggage}
      </div>` : ""}
      ${flightNumber ? `
      <div class="detail">
        <span class="label">✈️ Číslo letu:</span><br>
        ${flightNumber}
      </div>` : ""}
      ${note ? `
      <div class="detail">
        <span class="label">📝 Poznámka:</span><br>
        ${note}
      </div>` : ""}

      <div class="detail">
        <span class="label">📞 Telefón:</span><br>
        <a href="tel:${phone}">${phone}</a>
      </div>

      <div class="detail">
        <span class="label">📧 Email:</span><br>
        <a href="mailto:${email}">${email}</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Odoslané: ${new Date().toLocaleString("sk-SK")}</p>
      <p>Z webu: <a href="https://e-taxike.sk">e-taxike.sk</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send email to company
    await transporter.sendMail({
      from: `"E-TAXI Košice - Web Objednávky" <${process.env.SMTP_USER}>`,
      to: "dispecing@e-taxike.sk, letiskokosicetaxi@gmail.com",
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    console.log("✅ Email sent successfully to dispecing@e-taxike.sk and letiskokosicetaxi@gmail.com");

    // Send confirmation email to customer (v jazyku zákazníka)
    const customerDate = new Date(datetime).toLocaleString(t.dateLocale);

    const customerEmailText = `
${t.bookingEmail.greeting}

${t.bookingEmail.intro}

────────────────────────────────────────
${t.bookingEmail.detailsTitle}
────────────────────────────────────────

📍 ${t.bookingEmail.from} ${pickup}
📍 ${t.bookingEmail.to} ${destination}
🕐 ${t.bookingEmail.when} ${customerDate}
👥 ${t.bookingEmail.persons} ${passengersText}${luggage ? `\n🧳 ${t.bookingForm.luggage}: ${luggage}` : ""}${flightNumber ? `\n✈️ ${t.bookingForm.flightNumber}: ${flightNumber}` : ""}${note ? `\n📝 ${t.bookingForm.note}: ${note}` : ""}

${priceEstimateOnly ? `💰 ${t.bookingEmail.typeEstimate}` : `✅ ${t.bookingEmail.typeOrder}`}

────────────────────────────────────────

${t.bookingEmail.changesText}
📞 +421 911 606 206
📧 dispecing@e-taxike.sk

${t.bookingEmail.sign}
    `.trim();

    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #282462; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
    .detail { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #ff9500; }
    .label { font-weight: bold; color: #282462; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
    .contact { background: #282462; color: white; padding: 15px; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🚕 E-TAXI Košice</h2>
      <p>${t.bookingEmail.headerSubtitle}</p>
    </div>

    <div style="padding: 20px; text-align: center;">
      <h3 style="color: #282462;">${t.bookingEmail.receivedTitle}</h3>
      <p>${t.bookingEmail.receivedText}</p>
    </div>

    <div class="content">
      <h4 style="color: #282462; margin-bottom: 15px;">${t.bookingEmail.detailsTitleHtml}</h4>

      <div class="detail">
        <span class="label">📍 ${t.bookingEmail.from}</span><br>
        ${pickup}
      </div>

      <div class="detail">
        <span class="label">📍 ${t.bookingEmail.to}</span><br>
        ${destination}
      </div>

      <div class="detail">
        <span class="label">🕐 ${t.bookingEmail.when}</span><br>
        ${customerDate}
      </div>

      <div class="detail">
        <span class="label">👥 ${t.bookingEmail.persons}</span><br>
        ${passengersText}
      </div>
      ${luggage ? `
      <div class="detail">
        <span class="label">🧳 ${t.bookingForm.luggage}</span><br>
        ${luggage}
      </div>` : ""}
      ${flightNumber ? `
      <div class="detail">
        <span class="label">✈️ ${t.bookingForm.flightNumber}</span><br>
        ${flightNumber}
      </div>` : ""}
      ${note ? `
      <div class="detail">
        <span class="label">📝 ${t.bookingForm.note}</span><br>
        ${note}
      </div>` : ""}

      ${priceEstimateOnly ? `<div style="background: #fff3cd; padding: 10px; margin: 10px 0; border-left: 4px solid #ff9500;">💰 ${t.bookingEmail.typeEstimate}</div>` : `<div style="background: #d4edda; padding: 10px; margin: 10px 0; border-left: 4px solid #28a745;">✅ ${t.bookingEmail.typeOrder}</div>`}
    </div>

    <div class="contact">
      <p style="margin: 5px 0;"><strong>${t.bookingEmail.changesTextHtml}</strong></p>
      <p style="margin: 5px 0;">📞 <a href="tel:+421911606206" style="color: white;">+421 911 606 206</a></p>
      <p style="margin: 5px 0;">📧 <a href="mailto:dispecing@e-taxike.sk" style="color: white;">dispecing@e-taxike.sk</a></p>
    </div>

    <div class="footer">
      <p>${t.bookingEmail.thanks}</p>
      <p><a href="https://e-taxike.sk">e-taxike.sk</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();

    await transporter.sendMail({
      from: `"E-TAXI Košice" <${process.env.SMTP_USER}>`,
      to: email,
      subject: t.bookingEmail.subject,
      text: customerEmailText,
      html: customerEmailHtml,
    });

    console.log("✅ Confirmation email sent to customer");

    return res.status(200).json({ 
      message: "Vaša objednávka bola prijatá. O jej spracovaní Vás budeme informovať",
      success: true 
    });

  } catch (error) {
    console.error(`❌ Error sending booking email: ${describeError(error, { withMessage: false })}`);
    const t = getDictionary(req.body?.locale);
    return res.status(500).json({
      message: t.bookingForm.alerts.errorFallback,
      success: false,
      error: process.env.NODE_ENV === "development" ? String(error) : undefined
    });
  }
}