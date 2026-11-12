// ============================================================
//  JNEET+ AI — seed/seedQuestions.js
//  Run manually from the backend folder:
//
//    node seed/seedQuestions.js                 → add/update every question
//    node seed/seedQuestions.js --prune         → ALSO list questions that are in
//                                                 the database but no longer in the
//                                                 JSON files (dry run, deletes nothing)
//    node seed/seedQuestions.js --prune --yes   → add/update AND delete those
//                                                 old questions for real
//
//  Reads every .json file in seed/questions/ and upserts them into
//  the Question collection. Matches on (examMode, subject, chapter,
//  questionText), so re-running updates existing questions (fixed
//  answer keys, explanations, level) instead of duplicating them.
//
//  Why --prune exists: when a wrong or duplicate question is removed
//  from the JSON files, a plain re-seed cannot remove it from the live
//  database. --prune finds those leftovers. Old test attempts are not
//  affected — they keep their own copy of every question.
//
//  NOTE: this assumes your .env has a Mongo connection string under
//  either MONGO_URI or MONGODB_URI (checked in that order).
// ============================================================

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Question from "../models/Question.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, "questions");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const PRUNE = process.argv.includes("--prune");
const CONFIRM = process.argv.includes("--yes");
const BATCH = 500;

const keyOf = (q) => [q.examMode, q.subject, q.chapter, q.questionText].join("␟");

export function loadSeedQuestions(dir = QUESTIONS_DIR) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  const all = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    if (!raw.trim()) continue;
    const questions = JSON.parse(raw);
    for (const q of questions) all.push({ ...q, level: q.level || "main", type: q.type || "mcq", __file: file });
  }
  return all;
}

async function seed() {
  if (!MONGO_URI) {
    console.error(
      "No MONGO_URI or MONGODB_URI found in .env — check your actual variable name and update seed/seedQuestions.js if it's different."
    );
    process.exit(1);
  }

  const questions = loadSeedQuestions();
  if (questions.length === 0) {
    console.log("No questions found in seed/questions/ — nothing to seed.");
    return;
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for seeding.");

  const perFile = {};
  for (let i = 0; i < questions.length; i += BATCH) {
    const ops = questions.slice(i, i + BATCH).map(({ __file, ...q }) => {
      perFile[__file] = (perFile[__file] || 0) + 1;
      return {
        updateOne: {
          filter: {
            examMode: q.examMode,
            subject: q.subject,
            chapter: q.chapter,
            questionText: q.questionText,
          },
          update: { $set: q },
          upsert: true,
        },
      };
    });
    await Question.bulkWrite(ops, { ordered: false });
    process.stdout.write(`\rSeeded ${Math.min(i + BATCH, questions.length)} / ${questions.length}`);
  }
  console.log("");
  for (const [file, n] of Object.entries(perFile)) console.log(`  ${file}: ${n}`);

  if (PRUNE) {
    const wanted = new Set(questions.map(keyOf));
    const existing = await Question.find({}, { examMode: 1, subject: 1, chapter: 1, questionText: 1 }).lean();
    const stale = existing.filter((q) => !wanted.has(keyOf(q)));
    console.log(`\nQuestions in the database but not in the JSON files: ${stale.length}`);
    for (const q of stale.slice(0, 10)) {
      console.log(`  - [${q.examMode} ${q.subject} / ${q.chapter}] ${q.questionText.slice(0, 80)}`);
    }
    if (stale.length > 10) console.log(`  … and ${stale.length - 10} more`);

    if (stale.length && CONFIRM) {
      const ids = stale.map((q) => q._id);
      let deleted = 0;
      for (let i = 0; i < ids.length; i += BATCH) {
        const r = await Question.deleteMany({ _id: { $in: ids.slice(i, i + BATCH) } });
        deleted += r.deletedCount;
      }
      console.log(`Deleted ${deleted} old questions.`);
    } else if (stale.length) {
      console.log("Dry run only — nothing deleted. Re-run with --prune --yes to delete them.");
    }
  }

  const total = await Question.countDocuments();
  console.log(`Done. Questions now in the database: ${total}`);
  await mongoose.disconnect();
}

// Only run when executed directly (tests import loadSeedQuestions).
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
}
