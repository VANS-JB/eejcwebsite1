import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3002);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend contact ready" });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Nom, email et message sont obligatoires.",
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const contactTo = process.env.CONTACT_TO || "contact@eglise-lagrace.org";

  if (!smtpHost || !smtpUser || !smtpPass) {
    return res.status(500).json({
      success: false,
      message: "Le backend n'est pas encore configuré pour envoyer des emails. Configurez SMTP_HOST, SMTP_USER et SMTP_PASS.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: contactTo,
      replyTo: email,
      subject: `Nouveau message depuis le site - ${subject || "Demande"}`,
      html: `
        <h3>Nouveau message reçu</h3>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
        <p><strong>Sujet :</strong> ${subject || "Demande via le site"}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return res.status(200).json({ success: true, message: "Message envoyé avec succès." });
  } catch (error) {
    console.error("Contact mail error:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de l'envoi du message. Vérifiez votre configuration SMTP.",
    });
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
