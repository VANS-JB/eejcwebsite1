import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const template = await readFile(path.join(dist, "index.html"), "utf8");
const sermons = JSON.parse(await readFile(path.join(root, "data", "messages.json"), "utf8"));
const ssrBundle = path.join(root, "dist-ssr", "ssr.js");
const { renderPage } = await import(pathToFileURL(ssrBundle).href);
const routes = ["/", "/annexes", "/programmes", "/messages", ...sermons.map((sermon) => `/messages/${sermon.slug}`)];

await writeFile(path.join(root, "dist-ssr", "template.html"), template);

for (const route of routes) {
  const output = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, renderPage(template, route, sermons));
}

const urls = routes.map((route) => `  <url><loc>https://www.eej-c.org${route === "/" ? "/" : route}</loc></url>`).join("\n");
await writeFile(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log(`Pre-rendered ${routes.length} pages and updated dist/sitemap.xml`);