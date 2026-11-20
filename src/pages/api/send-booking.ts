import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type BookingData = {
  pickup: string;
  destination: string;
  datetime: string;
  passengers: number;
  phone?: string;
  email?: string;
  priceEstimateOnly?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { pickup, destination, datetime, passengers, phone, email, priceEstimateOnly }: BookingData = req.body;

    // Validate required fields
    if (!pickup || !destination || !datetime || !passengers || !phone || !email) {
      return res.status(400).json({ message: "Chýbajú povinné polia" });
    }

    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("⚠️ SMTP configuration missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local");
      
      // Development fallback - log to console
      const consoleLog = `
📧 EMAIL NOTIFICATION (SMTP not configured)
────────────────────────────────────────
From: ${process.env.SMTP_USER || "dispecing@e-taxike.sk"}
To: ${process.env.SMTP_USER || "dispecing@e-taxike.sk"}
────────────────────────────────────────
📍 Miesto vyzdvihnutia: ${pickup}
📍 Cieľ: ${destination}
🕐 Dátum a čas: ${new Date(datetime).toLocaleString("sk-SK")}
👥 Počet pasažierov: ${passengers}
📞 Telefón: ${phone}
📧 Email: ${email}
${priceEstimateOnly ? "💰 Iba cenová kalkulácia (bez objednávky)" : ""}
────────────────────────────────────────
      `.trim();
      
      console.log(consoleLog);

      return res.status(200).json({ 
        message: "Objednávka prijatá. Pre aktiváciu emailov nastavte SMTP_HOST, SMTP_USER a SMTP_PASS v .env.local",
        success: true,
        note: "SMTP nie je nakonfigurované - skontrolujte konzolu servera"
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
👥 Počet pasažierov: ${passengers}
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
        ${passengers}
      </div>
      
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

    // Send confirmation email to customer
    const customerEmailText = `
Dobrý deň,

Vaša objednávka taxíka bola prijatá. O jej spracovaní Vás budeme informovať.

────────────────────────────────────────
DETAILY OBJEDNÁVKY
────────────────────────────────────────

📍 Z: ${pickup}
📍 Do: ${destination}
🕐 Kedy: ${new Date(datetime).toLocaleString("sk-SK")}
👥 Počet osôb: ${passengers}

${priceEstimateOnly ? "💰 Typ: Cenová kalkulácia" : "✅ Typ: Potvrdená objednávka"}

────────────────────────────────────────

Ak potrebujete urobiť zmeny alebo máte otázky, kontaktujte nás:
📞 +421 911 606 206
📧 dispecing@e-taxike.sk

S pozdravom,
E-TAXI Košice tím
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
      <p>Potvrdenie objednávky</p>
    </div>
    
    <div style="padding: 20px; text-align: center;">
      <h3 style="color: #282462;">Vaša objednávka bola prijatá</h3>
      <p>O jej spracovaní Vás budeme informovať.</p>
    </div>
    
    <div class="content">
      <h4 style="color: #282462; margin-bottom: 15px;">Detaily objednávky:</h4>
      
      <div class="detail">
        <span class="label">📍 Z:</span><br>
        ${pickup}
      </div>
      
      <div class="detail">
        <span class="label">📍 Do:</span><br>
        ${destination}
      </div>
      
      <div class="detail">
        <span class="label">🕐 Kedy:</span><br>
        ${new Date(datetime).toLocaleString("sk-SK")}
      </div>
      
      <div class="detail">
        <span class="label">👥 Počet osôb:</span><br>
        ${passengers}
      </div>
      
      ${priceEstimateOnly ? '<div style="background: #fff3cd; padding: 10px; margin: 10px 0; border-left: 4px solid #ff9500;">💰 Typ: Cenová kalkulácia</div>' : '<div style="background: #d4edda; padding: 10px; margin: 10px 0; border-left: 4px solid #28a745;">✅ Typ: Potvrdená objednávka</div>'}
    </div>
    
    <div class="contact">
      <p style="margin: 5px 0;"><strong>Ak potrebujete urobiť zmeny alebo máte otázky:</strong></p>
      <p style="margin: 5px 0;">📞 <a href="tel:+421911606206" style="color: white;">+421 911 606 206</a></p>
      <p style="margin: 5px 0;">📧 <a href="mailto:dispecing@e-taxike.sk" style="color: white;">dispecing@e-taxike.sk</a></p>
    </div>
    
    <div class="footer">
      <p>Ďakujeme, že ste si vybrali E-TAXI Košice</p>
      <p><a href="https://e-taxike.sk">e-taxike.sk</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();

    await transporter.sendMail({
      from: `"E-TAXI Košice" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Potvrdenie objednávky - E-TAXI Košice",
      text: customerEmailText,
      html: customerEmailHtml,
    });

    console.log(`✅ Confirmation email sent to customer: ${email}`);

    return res.status(200).json({ 
      message: "Vaša objednávka bola prijatá. O jej spracovaní Vás budeme informovať",
      success: true 
    });

  } catch (error) {
    console.error("❌ Error sending booking email:", error);
    return res.status(500).json({ 
      message: "Chyba pri odosielaní objednávky. Skúste zavolať na +421 911 606 206",
      success: false,
      error: process.env.NODE_ENV === "development" ? String(error) : undefined
    });
  }
}