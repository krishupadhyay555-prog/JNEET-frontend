// Generates static, JavaScript-free copies of the legal pages into public/
// from the same content the React pages render. Run automatically before
// `vite build` (see package.json "prebuild"); the output is also committed.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { LEGAL, BUSINESS, LEGAL_UPDATED } from "../src/legal/content.js";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "..", "public");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const paras = (arr = []) => arr.map((t) => `<p>${esc(t)}</p>`).join("\n");
const list = (arr = []) => (arr.length ? `<ul>${arr.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "");

function page(doc) {
  const body = doc.sections
    .map((s) => `<h2>${esc(s.h)}</h2>\n${paras(s.p)}\n${list(s.ul)}\n${paras(s.p2)}`)
    .join("\n");
  const nav = Object.values(LEGAL)
    .map((d) => `<a href="/${d.file}">${esc(d.title)}</a>`)
    .join(" · ");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(doc.title)} — ${esc(BUSINESS.product)}</title>
<meta name="description" content="${esc(doc.title)} for ${esc(BUSINESS.product)}.">
<link rel="canonical" href="${esc(BUSINESS.website)}/${doc.file}">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#fdfbfc;color:#2d2a32;line-height:1.7;padding:40px 20px 80px}
.wrap{max-width:720px;margin:0 auto}
h1{font-size:28px;margin-bottom:6px}
.updated{color:#6b6572;font-size:13px;margin-bottom:24px}
h2{font-size:18px;margin:28px 0 10px}
p{font-size:15px;margin-bottom:12px;color:#403c47}
ul{margin:0 0 12px 22px}li{font-size:15px;margin-bottom:6px;color:#403c47}
a{color:#3d7dc9}
footer{margin-top:40px;font-size:13px;color:#6b6572;border-top:1px solid #ede6f3;padding-top:16px}
</style>
</head>
<body>
<div class="wrap">
<p><a href="/">← ${esc(BUSINESS.product)}</a></p>
<h1>${esc(doc.title)}</h1>
<p class="updated">Last updated: ${esc(LEGAL_UPDATED)}</p>
<p>${esc(doc.intro)}</p>
${body}
<footer>${nav}</footer>
</div>
</body>
</html>
`;
}

for (const doc of Object.values(LEGAL)) {
  writeFileSync(join(publicDir, doc.file), page(doc));
  console.log("wrote public/" + doc.file);
}
