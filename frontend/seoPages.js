// Static, crawlable copies of index.html for public SEO pages.
// After `vite build`, each page below gets dist/<path>/index.html with its
// own <title>, description, canonical, Open Graph and FAQ JSON-LD, so Google
// sees the right text before any JavaScript runs. React still renders the
// page as usual. vercel.json rewrites each path to its file.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { SEO_PAGES } from "./src/seo/seoContent.js";

const SITE = "https://jneetai.com";
export { SEO_PAGES };

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function renderSeoPage(html, p) {
  const url = `${SITE}/${p.path}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      (p.landing
        ? { "@type": "WebPage", name: p.title, url, description: p.description }
        : { "@type": "WebApplication", name: p.title, url, applicationCategory: "EducationalApplication",
            operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } }),
      { "@type": "FAQPage", mainEntity: p.faq.map(([q, a]) => ({
        "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    ],
  };
  const out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(p.description)}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(p.title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(p.description)}"`)
    .replace("</head>",
      `  <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n` +
      `    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>\n  </head>`)
    .replace('<div id="root"></div>',
      `<div id="root"></div>\n    <noscript><h1>${esc(p.h1 || p.title)}</h1><p>${esc(p.description)}</p></noscript>`);
  for (const k of ["<title>", 'name="description"', "og:title", "og:description", "canonical"]) {
    if (!out.includes(k)) throw new Error(`seoPages: ${p.path} missing ${k}`);
  }
  return out;
}

export function seoPagesPlugin() {
  let outDir = "dist";
  return {
    name: "jneet-seo-pages",
    apply: "build",
    configResolved(c) { outDir = c.build.outDir; },
    closeBundle() {
      const html = readFileSync(join(outDir, "index.html"), "utf8");
      for (const p of SEO_PAGES) {
        mkdirSync(join(outDir, p.path), { recursive: true });
        writeFileSync(join(outDir, p.path, "index.html"), renderSeoPage(html, p));
      }
    },
  };
}
