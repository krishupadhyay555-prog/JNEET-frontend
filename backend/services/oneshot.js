// ============================================================
//  JNEET+ AI — services/oneshot.js
//  OneShot: one pre-written, verified page per chapter — short summary,
//  every important formula (with "kab use karein" and the common
//  mistake), solved examples, key topics and a ratta list.
//  Written once and checked (never generated live), so it costs ₹0
//  per student and never hallucinates. Files: content/oneshot/*.json
//  (one chapter each; a chapter shared by NEET and JEE is one file).
// ============================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "oneshot");
const SUBJECTS = { NEET: ["Physics", "Chemistry", "Biology"], JEE: ["Physics", "Chemistry", "Mathematics"] };

const str = (v) => typeof v === "string" && v.trim().length > 0;

// Returns a list of problems (empty = valid). Used at load time and by tests.
export function validateOneShot(d, file = "") {
  const p = [];
  if (!str(d.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)) p.push("slug");
  if (file && `${d.slug}.json` !== file) p.push("slug must match the file name");
  if (!str(d.title)) p.push("title");
  if (!str(d.subject)) p.push("subject");
  const exams = Object.keys(d.chapters ?? {});
  if (!exams.length || exams.some((e) => !SUBJECTS[e] || !SUBJECTS[e].includes(d.subject) || !str(d.chapters[e]))) p.push("chapters");
  if (!Number.isInteger(d.readMinutes) || d.readMinutes < 3 || d.readMinutes > 60) p.push("readMinutes");
  if (!Array.isArray(d.summary) || d.summary.length < 2 || !d.summary.every(str)) p.push("summary");
  if (!Array.isArray(d.formulas) || d.formulas.length < 4 || !d.formulas.every((f) => str(f.name) && str(f.formula) && str(f.when))) p.push("formulas");
  if (!Array.isArray(d.examples) || d.examples.length < 2 || !d.examples.every((x) => str(x.title) && str(x.problem) && str(x.solution))) p.push("examples");
  if (!Array.isArray(d.topics) || d.topics.length < 3 || !d.topics.every((t) => str(t.title) && str(t.explain))) p.push("topics");
  if (!Array.isArray(d.ratta) || !d.ratta.every(str)) p.push("ratta");
  if (!str(d.verifiedOn)) p.push("verifiedOn");
  return p;
}

let cache = null;
export function loadOneShots(dir = DIR) {
  if (cache && dir === DIR) return cache;
  const out = [];
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
      const doc = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
      const problems = validateOneShot(doc, file);
      if (problems.length) {
        console.error(`[OneShot] ${file} skipped — invalid: ${problems.join(", ")}`);
        continue;
      }
      out.push(doc);
    }
  }
  if (dir === DIR) cache = out;
  return out;
}

export function listOneShots(examMode) {
  return loadOneShots()
    .filter((d) => d.chapters[examMode])
    .map((d) => ({
      slug: d.slug,
      subject: d.subject,
      chapter: d.chapters[examMode],
      title: d.title,
      readMinutes: d.readMinutes,
      formulaCount: d.formulas.length,
    }));
}

export function getOneShot(examMode, slug) {
  const d = loadOneShots().find((x) => x.slug === slug);
  if (!d || !d.chapters[examMode]) return null;
  const { chapters, ...rest } = d;
  return { ...rest, chapter: chapters[examMode] };
}
