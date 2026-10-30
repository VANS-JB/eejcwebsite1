import React from "react";
import { renderToString } from "react-dom/server";
import App, { type Sermon } from "./App";

const pages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "EEJ-C | Église des Envoyés de Jésus-Christ",
    description: "Site officiel de l’Église des Envoyés de Jésus-Christ. Découvrez nos cultes, nos programmes, la diffusion en direct et nos annexes à Lomé, au Togo.",
  },
  "/annexes": {
    title: "Nos annexes à Lomé et au Togo | EEJ-C",
    description: "Adresses, horaires et itinéraires des annexes de l’Église des Envoyés de Jésus-Christ à Lomé et au Togo.",
  },
  "/programmes": {
    title: "Programmes et actualités | EEJ-C",
    description: "Consultez les cultes, études bibliques, veillées de prière et annonces de l’Église des Envoyés de Jésus-Christ à Lomé.",
  },
  "/messages": {
    title: "Prédications et enseignements | EEJ-C",
    description: "Écoutez et regardez les prédications de l’Église des Envoyés de Jésus-Christ : messages du lundi, mercredi, vendredi et dimanche.",
  },
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[character]!);

function metadataFor(pathname: string, sermons: Sermon[]) {
  const cleanPath = pathname.replace(/\/$/, "") || "/";
  if (cleanPath.startsWith("/messages/")) {
    const slug = cleanPath.slice("/messages/".length);
    const sermon = sermons.find((entry) => entry.slug === slug);
    if (sermon) {
      return {
        title: `${sermon.title} | EEJ-C`,
        description: sermon.excerpt,
        canonical: `https://www.eej-c.org/messages/${encodeURIComponent(sermon.slug)}`,
      };
    }
    return {
      title: "Prédication introuvable | EEJ-C",
      description: "Cette prédication n’est pas disponible dans l’archive de l’EEJ-C.",
      canonical: "https://www.eej-c.org/messages",
      noindex: true,
    };
  }
  const page = pages[cleanPath] ?? pages["/"];
  return { ...page, canonical: `https://www.eej-c.org${cleanPath === "/" ? "/" : cleanPath}` };
}

export function renderPage(template: string, pathname: string, sermons: Sermon[]) {
  const markup = pathname.startsWith("/admin")
    ? ""
    : renderToString(React.createElement(App, { pathname, sermons }));
  const metadata = metadataFor(pathname, sermons);
  const encodedTitle = escapeHtml(metadata.title);
  const encodedDescription = escapeHtml(metadata.description);
  const canonical = escapeHtml(metadata.canonical);
  const robots = "noindex" in metadata && metadata.noindex
    ? '<meta name="robots" content="noindex, follow" />'
    : '<meta name="robots" content="index, follow" />';
  const state = JSON.stringify({ pathname, sermons }).replace(/</g, "\\u003c");
  return template
    .replace("<div id=\"root\"></div>", `<div id="root">${markup}</div>`)
    .replace("<script type=\"module\"", `<script>window.__EEJC_SSR__=${state}</script>\n    <script type="module"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${encodedTitle}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${encodedDescription}" />`)
    .replace(/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${encodedTitle}" />`)
    .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${encodedDescription}" />`)
    .replace(/<meta\s+name="robots"[^>]*\/>/, robots);
}

export function pageMetadata(pathname: string, sermons: Sermon[]) {
  return metadataFor(pathname, sermons);
}