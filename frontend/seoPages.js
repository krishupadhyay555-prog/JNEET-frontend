// Static, crawlable copies of index.html for public SEO pages.
// After `vite build`, each page below gets dist/<path>/index.html with its
// own <title>, description, canonical, Open Graph and FAQ JSON-LD, so Google
// sees the right text before any JavaScript runs. React still renders the
// page as usual. vercel.json rewrites each path to its file.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://jneetai.com";

const FAQ_COMMON = [
  ["Is this the official NTA rank?",
   "No. It is a free estimate made from NTA's published result data. JNEET+ AI is not affiliated with NTA. Your real rank comes only from NTA."],
  ["Do I need to log in?",
   "No. The rank predictor is free and works without an account."],
];

export const SEO_PAGES = [
  {
    path: "rank-predictor",
    title: "JEE Main & NEET Rank Predictor 2027 (Free) — JNEET+ AI",
    description: "Free JEE Main and NEET UG rank predictor. Enter your expected marks to see your estimated percentile and All-India Rank range, based on NTA's official result data. No login needed.",
    faq: [
      ["How is JEE Main rank estimated from marks?",
       "Marks are converted to a percentile using real shift-wise data, then rank ≈ (100 − percentile) ÷ 100 × total candidates (15,38,468 in JEE Main 2026)."],
      ["How is NEET rank estimated?",
       "NEET rank is the number of candidates who scored at or above your marks. We use NTA's published counts for 2026 and 2025."],
      ...FAQ_COMMON,
    ],
  },
  {
    path: "jee-main-rank-predictor",
    title: "JEE Main Rank Predictor 2027 — Marks vs Percentile vs Rank (Free)",
    description: "Free JEE Main 2027 rank predictor: enter expected marks out of 300, pick your shift's difficulty, and get estimated percentile and All-India Rank range from NTA's official data.",
    faq: [
      ["How is JEE Main rank estimated from marks?",
       "Marks are converted to a percentile using real shift-wise data, then rank ≈ (100 − percentile) ÷ 100 × total candidates (15,38,468 in JEE Main 2026)."],
      ["Why does my shift matter?",
       "NTA normalises each shift separately, so the same marks give a different percentile in an easy shift and a tough one."],
      ...FAQ_COMMON,
    ],
  },
  {
    path: "neet-rank-predictor",
    title: "NEET UG Rank Predictor 2027 — Marks vs Rank (Free)",
    description: "Free NEET UG 2027 rank predictor: enter expected marks out of 720 and get your estimated All-India Rank range, based on NTA's official NEET 2026 and 2025 results.",
    faq: [
      ["How is NEET rank estimated?",
       "NEET rank is the number of candidates who scored at or above your marks. We use NTA's published counts for 2026 and 2025."],
      ...FAQ_COMMON,
    ],
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function renderSeoPage(html, p) {
  const url = `${SITE}/${p.path}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebApplication", name: p.title, url, applicationCategory: "EducationalApplication",
        operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } },
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
      `<div id="root"></div>\n    <noscript><h1>${esc(p.title)}</h1><p>${esc(p.description)}</p></noscript>`);
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
