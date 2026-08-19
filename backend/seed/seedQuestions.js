// ============================================================
//  JNEET+ AI — seed/seedQuestions.js
//  Run manually from the backend folder:  node seed/seedQuestions.js
//  Reads every .json file in seed/questions/ and upserts them into
//  the Question collection. Safe to re-run after editing a JSON
//  file — matches on (examMode, subject, chapter, questionText),
//  so re-running updates existing questions instead of duplicating.
//
//  NOTE: this assumes your .env has a Mongo connection string under
//  either MONGO_URI or MONGODB_URI (checked in that order). If
//  neither matches your actual .env variable name, this will fail
//  with a clear error — update the variable name below to match.
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

async function seed() {
  if (!MONGO_URI) {
    console.error(
      "No MONGO_URI or MONGODB_URI found in .env — check your actual variable name and update seed/seedQuestions.js if it's different."
    );
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for seeding.");

  const files = fs
    .readdirSync(QUESTIONS_DIR)
    .filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    console.log("No .json files found in seed/questions/ — nothing to seed.");
    await mongoose.disconnect();
    return;
  }

  let totalProcessed = 0;

  for (const file of files) {
    const filePath = path.join(QUESTIONS_DIR, file);
    const questions = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const q of questions) {
      await Question.updateOne(
        {
          examMode:     q.examMode,
          subject:      q.subject,
          chapter:      q.chapter,
          questionText: q.questionText,
        },
        { $set: q },
        { upsert: true }
      );
      totalProcessed += 1;
    }

    console.log(`Seeded ${questions.length} questions from ${file}`);
  }

  console.log(`Done. Total processed: ${totalProcessed}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});