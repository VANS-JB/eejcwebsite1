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
const isProduction = process.env.NODE_ENV === "production";

app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Opener-Policy": "same-origin",
  });
  if (isProduction) {
    res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.set(
      "Content-Security-Policy",
      "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.pexels.com https://*.tile.openstreetmap.org; connect-src 'self'; frame-src https://www.google.com https://maps.google.com; upgrade-insecure-requests"
    );
  }
  next();
});

const DATA_DIR = path.resolve(__dirname, process.env.DATA_DIR || "data");
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, "announcements.json");

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

function writeJsonAtomic(file, value) {
  const directory = path.dirname(file);
  fs.mkdirSync(directory, { recursive: true });
  const temporary = path.join(
    directory,
    `.${path.basename(file)}.${process.pid}.${crypto.randomBytes(6).toString("hex")}.tmp`
  );
  try {
    fs.writeFileSync(temporary, JSON.stringify(value, null, 2), {
      encoding: "utf8",
      mode: 0o600,
    });
    fs.renameSync(temporary, file);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function saveAnnouncements(list) {
  writeJsonAtomic(ANNOUNCEMENTS_FILE, list);
}

/* ============================================================
   Authentification admin (mot de passe unique + sessions mémoire)
   ============================================================ */
const sessions = new Map(); // token -> expiration (ms)
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

const sessionCleanup = setInterval(() => {
  const now = Date.now();
  for (const [token, expiresAt] of sessions) {
    if (expiresAt < now) sessions.delete(token);
  }
}, 30 * 60 * 1000);
sessionCleanup.unref();

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
  sessions.set(token, Date.now() + SESSION_DURATION_MS);
  next();
}

function createRateLimiter({ windowMs, max, message }) {
  const clients = new Map();
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of clients) {
      if (value.resetAt <= now) clients.delete(key);
    }
  }, windowMs);
  cleanup.unref();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.socket.remoteAddress || "unknown";
    const current = clients.get(key);
    if (!current || current.resetAt <= now) {
      clients.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    current.count += 1;
    if (current.count > max) {
      res.set("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
      return res.status(429).json({ success: false, message });
    }
    next();
  };
}

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Trop de tentatives. Réessayez dans quelques minutes.",
});
const contactLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Trop de messages envoyés. Réessayez plus tard.",
});
const newsletterLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Trop de tentatives. Réessayez plus tard.",
});

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const cleanText = (value, maxLength) =>
  String(value || "").replace(/\0/g, "").trim().slice(0, maxLength);
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
const isPlaceholderConfig = (value) =>
  !value || /votre|changez|exemple|localhost/i.test(value);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend contact ready" });
});

/* ---------- Annonces (lecture publique) ---------- */
app.get("/api/announcements", (_req, res) => {
  res.json({ success: true, announcements: loadAnnouncements() });
});

/* ---------- Espace admin ---------- */
app.post("/api/admin/login", loginLimiter, (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(503).json({
      success: false,
      message: "ADMIN_PASSWORD n'est pas configuré dans le fichier .env.",
    });
  }

  const password = cleanText(req.body?.password, 256);
  if (!password || !safeEqual(password, adminPassword)) {
    return res.status(401).json({ success: false, message: "Mot de passe incorrect." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_DURATION_MS);
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
  if (announcements.length > 50) {
    return res.status(400).json({
      success: false,
      message: "Le nombre maximal d'annonces est de 50.",
    });
  }

  const clean = announcements
    .map((a) => ({
      date: cleanText(a?.date, 80),
      tag: cleanText(a?.tag || "Annonce", 40),
      title: cleanText(a?.title, 160),
      text: cleanText(a?.text, 1000),
    }))
    .filter((a) => a.title);

  saveAnnouncements(clean);
  res.json({ success: true, announcements: clean });
});

/* ---------- Newsletter (liste de diffusion) ---------- */
const NEWSLETTER_FILE = path.join(DATA_DIR, "newsletter.json");

function loadNewsletter() {
  try {
    const raw = fs.readFileSync(NEWSLETTER_FILE, "utf8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const unique = new Map();
    data.forEach((entry) => {
      const email = cleanText(typeof entry === "string" ? entry : entry?.email, 254).toLowerCase();
      if (!isEmail(email) || unique.has(email)) return;
      unique.set(email, {
        email,
        subscribedAt:
          typeof entry === "object" && entry?.subscribedAt
            ? cleanText(entry.subscribedAt, 40)
            : new Date().toISOString(),
        unsubscribeToken:
          typeof entry === "object" && entry?.unsubscribeToken
            ? cleanText(entry.unsubscribeToken, 128)
            : crypto.randomBytes(32).toString("hex"),
      });
    });
    return [...unique.values()];
  } catch {
    return [];
  }
}

function saveNewsletter(list) {
  writeJsonAtomic(NEWSLETTER_FILE, list);
}

app.post("/api/newsletter", newsletterLimiter, async (req, res) => {
  const clean = cleanText(req.body?.email, 254).toLowerCase();
  if (!isEmail(clean)) {
    return res.status(400).json({ success: false, message: "Adresse email invalide." });
  }
  if (req.body?.consent !== true) {
    return res.status(400).json({ success: false, message: "Votre consentement est requis." });
  }

  const list = loadNewsletter();
  const isNew = !list.some((subscriber) => subscriber.email === clean);
  if (isNew) {
    list.push({
      email: clean,
      subscribedAt: new Date().toISOString(),
      unsubscribeToken: crypto.randomBytes(32).toString("hex"),
    });
  }
  // Réécrit aussi les anciennes listes de simples adresses au nouveau format.
  saveNewsletter(list);

  /* Notification par email à l'église (best-effort : l'inscription reste
     enregistrée même si l'envoi échoue) */
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (
    isNew &&
    !isPlaceholderConfig(smtpHost) &&
    !isPlaceholderConfig(smtpUser) &&
    !isPlaceholderConfig(smtpPass)
  ) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        disableFileAccess: true,
        disableUrlAccess: true,
        from: process.env.SMTP_FROM || smtpUser,
        to: process.env.CONTACT_TO || smtpUser,
        subject: "Nouvelle inscription à la newsletter",
        text: `${clean} s'est inscrit à la newsletter du site.`,
        html: `<p><strong>${escapeHtml(clean)}</strong> s'est inscrit à la newsletter du site.</p>`,
      });
    } catch (error) {
      console.error("Newsletter mail error:", error);
    }
  }

  res.json({ success: true, message: "Inscription enregistrée. Merci !" });
});

app.get("/api/newsletter/unsubscribe", newsletterLimiter, (req, res) => {
  const token = cleanText(req.query?.token, 128);
  const list = loadNewsletter();
  const index = list.findIndex((subscriber) => safeEqual(subscriber.unsubscribeToken, token));
  const removed = index >= 0;
  if (removed) {
    list.splice(index, 1);
    saveNewsletter(list);
  }

  res.status(removed ? 200 : 404).type("html").send(`<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${removed ? "Désinscription confirmée" : "Lien invalide"} | EEJ-C</title></head>
<body style="margin:0;background:#f6f3ea;font-family:Arial,sans-serif;color:#17231c">
<main style="min-height:100vh;display:grid;place-items:center;padding:24px">
<section style="max-width:560px;background:#fff;border-radius:20px;padding:40px;text-align:center;box-shadow:0 12px 40px rgba(8,35,21,.12)">
<h1 style="color:#176537">${removed ? "Vous êtes désinscrit(e)" : "Lien invalide ou déjà utilisé"}</h1>
<p>${removed ? "Votre adresse a été retirée de la newsletter de l’EEJ-C." : "Cette adresse n’est plus inscrite ou le lien a expiré."}</p>
<a href="/" style="display:inline-block;margin-top:18px;color:#176537;font-weight:700">Retour au site</a>
</section></main></body></html>`);
});

app.get("/api/admin/newsletter", requireAdmin, (_req, res) => {
  const subscribers = loadNewsletter();
  // Assure la migration persistante des anciennes adresses sans exposer les jetons.
  saveNewsletter(subscribers);
  res.json({
    success: true,
    subscribers: subscribers.map(({ email, subscribedAt }) => ({ email, subscribedAt })),
  });
});

app.post("/api/admin/newsletter/send", requireAdmin, async (req, res) => {
  const subject = cleanText(req.body?.subject, 160).replace(/[\r\n]+/g, " ");
  const message = cleanText(req.body?.message, 5000);
  if (!subject || !message) {
    return res.status(400).json({ success: false, message: "Le sujet et le message sont obligatoires." });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  if (
    isPlaceholderConfig(smtpHost) ||
    isPlaceholderConfig(smtpUser) ||
    isPlaceholderConfig(smtpPass) ||
    isPlaceholderConfig(smtpFrom)
  ) {
    return res.status(503).json({ success: false, message: "Le service email n'est pas configuré." });
  }

  const subscribers = loadNewsletter();
  if (!subscribers.length) {
    return res.status(400).json({ success: false, message: "Aucun abonné à la newsletter." });
  }
  if (subscribers.length > 500) {
    return res.status(400).json({
      success: false,
      message: "La liste dépasse 500 abonnés. Utilisez un service d'envoi spécialisé.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
  });
  const configuredUrl = cleanText(process.env.PUBLIC_URL, 300).replace(/\/$/, "");
  const publicUrl = /^https?:\/\//i.test(configuredUrl)
    ? configuredUrl
    : `${req.protocol}://${req.get("host")}`;
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const results = await Promise.allSettled(
    subscribers.map((subscriber) => {
      const unsubscribeUrl = `${publicUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(
        subscriber.unsubscribeToken
      )}`;
      return transporter.sendMail({
        disableFileAccess: true,
        disableUrlAccess: true,
        from: smtpFrom,
        to: subscriber.email,
        subject,
        text: `${message}\n\nSe désinscrire : ${unsubscribeUrl}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#17231c">
          <div>${safeMessage}</div>
          <hr style="margin:32px 0;border:0;border-top:1px solid #dce5df">
          <p style="font-size:12px;color:#647069">Vous recevez cet email car vous êtes inscrit(e) à la newsletter de l’EEJ-C.<br>
          <a href="${unsubscribeUrl}">Se désinscrire</a></p>
        </div>`,
        headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
      });
    })
  );
  transporter.close();
  const sent = results.filter((result) => result.status === "fulfilled").length;
  const failed = results.length - sent;
  console.log(`Newsletter campaign completed: ${sent} sent, ${failed} failed`);
  res.status(sent ? 200 : 502).json({
    success: sent > 0,
    sent,
    failed,
    message: `${sent} email(s) envoyé(s), ${failed} échec(s).`,
  });
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  const name = cleanText(req.body?.name, 100);
  const email = cleanText(req.body?.email, 254).toLowerCase();
  const phone = cleanText(req.body?.phone, 40);
  const subject = cleanText(req.body?.subject, 120).replace(/[\r\n]+/g, " ");
  const message = cleanText(req.body?.message, 5000);

  if (!name || !isEmail(email) || !message) {
    return res.status(400).json({
      success: false,
      message: "Nom, adresse email valide et message sont obligatoires.",
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const contactTo = process.env.CONTACT_TO || "contact@eej-c.org";

  if (
    isPlaceholderConfig(smtpHost) ||
    isPlaceholderConfig(smtpUser) ||
    isPlaceholderConfig(smtpPass) ||
    isPlaceholderConfig(contactTo)
  ) {
    return res.status(503).json({
      success: false,
      message: "Le service email n'est pas encore configuré. Contactez l'administrateur du site.",
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
      disableFileAccess: true,
      disableUrlAccess: true,
      from: smtpFrom,
      to: contactTo,
      replyTo: email,
      subject: `Nouveau message depuis le site - ${subject || "Demande"}`,
      text: `Nouveau message reçu\n\nNom : ${name}\nEmail : ${email}\nTéléphone : ${phone || "Non renseigné"}\nSujet : ${subject || "Demande via le site"}\n\nMessage :\n${message}`,
      html: `
        <h3>Nouveau message reçu</h3>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(phone || "Non renseigné")}</p>
        <p><strong>Sujet :</strong> ${escapeHtml(subject || "Demande via le site")}</p>
        <p><strong>Message :</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
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

app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Route API introuvable." });
});

app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError || error?.type === "entity.too.large") {
    return res.status(400).json({ success: false, message: "Requête invalide ou trop volumineuse." });
  }
  next(error);
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
