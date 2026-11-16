// ============================================================
//  JNEET+ AI — controllers/pyqController.js
//    GET /api/pyq                              papers for my exam, by year
//    GET /api/pyq/chapters                     chapters with PYQ counts
//    GET /api/pyq/chapter?subject=&chapter=    all PYQs of one chapter
//    GET /api/pyq/:id                          one full paper
// ============================================================

import { listPapers, getPaper, listChapters, chapterQuestions } from "../services/pyq.js";

const clean = (v) => (typeof v === "string" ? v.slice(0, 120) : "");

export const list = (req, res) => res.json({ success: true, years: listPapers(req.user.examMode) });

export const chapters = (req, res) => res.json({ success: true, chapters: listChapters(req.user.examMode) });

export const byChapter = (req, res) => {
  const subject = clean(req.query.subject);
  const chapter = clean(req.query.chapter);
  if (!subject || !chapter) return res.status(400).json({ success: false, error: "Pick a subject and a chapter." });
  return res.json({ success: true, subject, chapter, questions: chapterQuestions(req.user.examMode, subject, chapter) });
};

export const getOne = (req, res) => {
  const paper = getPaper(req.user.examMode, clean(req.params.id));
  if (!paper) return res.status(404).json({ success: false, error: "This paper isn't available for your exam." });
  return res.json({ success: true, paper });
};
