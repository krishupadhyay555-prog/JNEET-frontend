// ─────────────────────────────────────────────────────────────
//  JNEET+ AI — services/diagrams.js
//  When a student asks the AI Mentor for a diagram ("diagram se
//  samjhao"), find the best matching image from our checked diagram
//  library (content/diagrams.json, same files as frontend/public/diagrams)
//  so the answer can show it. No image generation: zero extra AI cost.
// ─────────────────────────────────────────────────────────────
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

let LIB = null;
function library() {
  if (!LIB) {
    try {
      LIB = JSON.parse(readFileSync(join(here, "..", "content", "diagrams.json"), "utf8"))
        .map((d) => ({ ...d, words: tokens(`${d.t} ${d.c.replace(/-/g, " ")}`), titleWords: [...new Set(tokens(d.t))] }));
    } catch {
      LIB = [];
    }
  }
  return LIB;
}

const STOP = new Set(("a an the of and or in on to for with by is are was what how why which explain " +
  "samjhao samjha batao bata dikhao dikha kya hai hota hain ka ki ke ko se me mein par aur ek please pls " +
  "diagram diagrams figure chitra draw sketch labelled labeled picture image chart graph flowchart show " +
  "structure types type vs process simple basic").split(" "));

function stem(w) {
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

export function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9₂₃]+/g, " ")
    .split(" ")
    .map(stem)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

const WANTS = /\b(diagrams?|figures?|chitra|draw|sketch|label+ed|flow ?charts?|picture|image|visual(?:ly)?|graph)\b/i;

/** True when the student is asking to see a diagram. */
export function wantsDiagram(prompt) {
  return WANTS.test(String(prompt || ""));
}

const SUBJECTS = {
  neet: new Set(["Biology", "Physics", "Chemistry"]),
  jee: new Set(["Physics", "Chemistry", "Mathematics"]),
};

/** Best matching diagram for the prompt, or null. Needs a real topic match. */
export function findDiagram(prompt, examMode) {
  const q = new Set(tokens(prompt));
  if (!q.size) return null;
  const allowed = SUBJECTS[String(examMode || "").toLowerCase()] || null;
  let best = null;
  for (const d of library()) {
    if (allowed && !allowed.has(d.s)) continue;
    let score = 0;
    let hits = 0;
    for (const w of d.titleWords) if (q.has(w)) { hits++; score += w.length >= 5 ? 2 : 1; }
    if (!hits) continue;
    for (const w of d.words) if (q.has(w)) score += 0.25;
    // Prefer titles that the prompt covers most completely.
    const cover = d.titleWords.length ? d.titleWords.filter((w) => q.has(w)).length / d.titleWords.length : 0;
    score += cover;
    if (!best || score > best.score) best = { d, score };
  }
  return best && best.score >= 1.5 ? best.d : null;
}

/** Markdown appended after the AI answer (rendered by the chat as a zoomable image). */
export function diagramMarkdown(d) {
  const alt = d.t.replace(/[[\]]/g, "");
  return `\n\n![${alt}](${d.f})`;
}
