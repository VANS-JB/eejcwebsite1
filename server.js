import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3002);

const ANNOUNCEMENTS_FILE = path.join(__dirname, "data", "announcements.json");

/* ============================================================
   Stockage des annonces (fichier JSON édité via l'espace admin)
   ============================================================ */
const defaultAnnouncements = [
  {
    date: "Dimanche prochain",
    tag: "Baptême",
    title: "Célébration du baptême par immersion",
    text: "Vous souhaitez obéir au Seigneur par le baptême ? Inscrivez-vous à l'accueil après le culte.",
  },
];

function loadAnnouncements() {
  try {
    const raw = fs.readFileSync(ANNOUNCEMENTS_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data.announcements;
  } catch {
    return defaultAnnouncements;
  }
}

function saveAnnouncements(list) {
  fs.mkdirSync(path.dirname(ANNOUNCEMENTS_FILE), { recursive: true });
  fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(list, null, 2), "utf8");
}

/* ============================================================
   Authentification admin (mot de passe unique + sessions mémoire)
   ============================================================ */
const sessions = new Map(); // token -> expiration (ms)

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const expiresAt = sessions.get(token);
  if (!expiresAt || expiresAt < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({
      success: false,
      message: "Session expirée. Reconnectez-vous.",
    });
  }
  next();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend contact ready" });
});

/* ---------- Annonces (lecture publique) ---------- */
app.get("/api/announcements", (_req, res) => {
  res.json({ success: true, announcements: loadAnnouncements() });
});

/* ---------- Espace admin ---------- */
app.post("/api/admin/login", (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(503).json({
      success: false,
      message: "ADMIN_PASSWORD n'est pas configuré dans le fichier .env.",
    });
  }

  const { password } = req.body || {};
  if (!password || !safeEqual(password, adminPassword)) {
    return res.status(401).json({ success: false, message: "Mot de passe incorrect." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + 24 * 60 * 60 * 1000);
  res.json({ success: true, token });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  sessions.delete(token);
  res.json({ success: true });
});

app.get("/api/admin/announcements", requireAdmin, (_req, res) => {
  res.json({ success: true, announcements: loadAnnouncements() });
});

app.put("/api/admin/announcements", requireAdmin, (req, res) => {
  const { announcements } = req.body || {};
  if (!Array.isArray(announcements)) {
    return res.status(400).json({
      success: false,
      message: "Le champ 'announcements' doit être un tableau.",
    });
  }

  const clean = announcements
    .map((a) => ({
      date: String(a.date || ""),
      tag: String(a.tag || "Annonce"),
      title: String(a.title || "").trim(),
      text: String(a.text || "").trim(),
    }))
    .filter((a) => a.title);

  saveAnnouncements(clean);
  res.json({ success: true, announcements: clean });
});

/* ---------- Newsletter (liste de diffusion) ---------- */
const NEWSLETTER_FILE = path.join(__dirname, "data", "newsletter.json");

function loadNewsletter() {
  try {
    const raw = fs.readFileSync(NEWSLETTER_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveNewsletter(list) {
  fs.mkdirSync(path.dirname(NEWSLETTER_FILE), { recursive: true });
  fs.writeFileSync(NEWSLETTER_FILE, JSON.stringify(list, null, 2), "utf8");
}

app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body || {};
  const clean = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return res.status(400).json({ success: false, message: "Adresse email invalide." });
  }

  const list = loadNewsletter();
  const isNew = !list.includes(clean);
  if (isNew) {
    list.push(clean);
    saveNewsletter(list);
  }

  /* Notification par email à l'église (best-effort : l'inscription reste
     enregistrée même si l'envoi échoue) */
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (isNew && smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || smtpUser,
        to: process.env.CONTACT_TO || smtpUser,
        subject: "Nouvelle inscription à la newsletter",
        html: `<p><strong>${clean}</strong> s'est inscrit à la newsletter du site.</p>`,
      });
    } catch (error) {
      console.error("Newsletter mail error:", error);
    }
  }

  res.json({ success: true, message: "Inscription enregistrée. Merci !" });
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
