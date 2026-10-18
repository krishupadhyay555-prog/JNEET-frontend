// ============================================================
//  JNEET+ AI — config/targetExams.js  (v2 — NEET *and* JEE)
//  Selectable "which exam are you preparing for" targets, per exam mode.
//  Only the next sitting is ever officially announced by the NTA; every
//  later year is a projection from past trends and is flagged
//  `tentative` so the UI never shows fake precision.
//  The frontend keeps a mirror of this list (frontend/src/config/
//  targetExams.js) so the countdown works offline — tests/targetExams.test.js
//  fails if the two ever drift apart.
// ============================================================

import { env } from "./env.js";

// key, label, date (09:00 IST = 03:30 UTC), tentative
const NEET = [
  ["NEET_2026", "NEET 2026", "2026-05-03T03:30:00.000Z", false],
  ["NEET_2027", "NEET 2027", "2027-05-02T03:30:00.000Z", true],
  ["NEET_2028", "NEET 2028", "2028-05-07T03:30:00.000Z", true],
  ["NEET_2029", "NEET 2029", "2029-05-06T03:30:00.000Z", true],
  ["NEET_2030", "NEET 2030", "2030-05-05T03:30:00.000Z", true],
];

const JEE = [
  ["JEE_MAIN_2027", "JEE Main 2027", "2027-01-22T03:30:00.000Z", true],
  ["JEE_ADV_2027",  "JEE Advanced 2027", "2027-05-16T03:30:00.000Z", true],
  ["JEE_MAIN_2028", "JEE Main 2028", "2028-01-22T03:30:00.000Z", true],
  ["JEE_ADV_2028",  "JEE Advanced 2028", "2028-05-21T03:30:00.000Z", true],
  ["JEE_MAIN_2029", "JEE Main 2029", "2029-01-22T03:30:00.000Z", true],
  ["JEE_ADV_2029",  "JEE Advanced 2029", "2029-05-20T03:30:00.000Z", true],
];

const toOption = (examMode) => ([key, label, date, tentative]) => ({ key, label, date, tentative, examMode });

export function getTargetExamOptions() {
  const options = NEET.map(toOption("NEET"));

  if (env.RE_NEET_ACTIVE && env.RE_NEET_DATE) {
    options.unshift({ key: "RE_NEET", label: "Re-NEET", date: env.RE_NEET_DATE, tentative: false, examMode: "NEET" });
  }

  return [...options, ...JEE.map(toOption("JEE"))];
}

// Pass examMode to only accept a target that belongs to that exam.
export function getTargetExamOption(key, examMode = null) {
  return getTargetExamOptions().find(
    (option) => option.key === key && (!examMode || option.examMode === examMode)
  ) ?? null;
}
