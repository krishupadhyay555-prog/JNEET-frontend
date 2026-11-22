// Public SEO pages: one source for the static HTML (seoPages.js, at build)
// and the React page (SeoLanding.jsx), so Google's FAQ text always matches
// what users see. Facts here must stay true — update dates when NTA does.

const JEE_DATES = "JEE Main 2027 Session 1 is on 20, 21, 22, 23, 24 and 28 January 2027 (NTA information bulletin, 24 Oct 2026). Session 2 is in April 2027; NTA will announce exact dates.";
const NEET_DATES = "NTA has not announced the NEET UG 2027 date yet. NEET is usually held on the first Sunday of May; we will update this page when NTA publishes the bulletin.";

const NOT_NTA = ["Is JNEET+ AI linked to NTA?",
  "No. JNEET+ AI is an independent product, not affiliated with or endorsed by NTA. PYQs are shown from NTA's public question papers with NTA's official answer keys."];
const NO_LOGIN = ["Do I need to log in?", "No. The rank predictor is free and works without an account."];
const RANK_JEE = ["How is JEE Main rank estimated from marks?",
  "Marks are converted to a percentile using real shift-wise data, then rank ≈ (100 − percentile) ÷ 100 × total candidates (15,38,468 in JEE Main 2026)."];
const RANK_NEET = ["How is NEET rank estimated?",
  "NEET rank is the number of candidates who scored at or above your marks. We use NTA's published counts for 2026 and 2025."];

export const SEO_PAGES = [
  {
    path: "rank-predictor",
    title: "JEE Main & NEET Rank Predictor 2027 (Free) — JNEET+ AI",
    description: "Free JEE Main and NEET UG rank predictor. Enter your expected marks or percentile to see your estimated All-India Rank range, based on NTA's official result data. No login needed.",
    faq: [RANK_JEE, RANK_NEET, NO_LOGIN, NOT_NTA],
  },
  {
    path: "jee-main-rank-predictor",
    title: "JEE Main Rank Predictor 2027 — Marks & Percentile to Rank (Free)",
    description: "Free JEE Main 2027 rank predictor: enter marks out of 300 (with shift difficulty) or your NTA percentile, and get your estimated All-India Rank from official data.",
    faq: [RANK_JEE, ["Why does my shift matter?",
      "NTA normalises each shift separately, so the same marks give a different percentile in an easy shift and a tough one."],
      ["When is JEE Main 2027?", JEE_DATES], NO_LOGIN, NOT_NTA],
  },
  {
    path: "neet-rank-predictor",
    title: "NEET UG Rank Predictor 2027 — Marks vs Rank (Free)",
    description: "Free NEET UG 2027 rank predictor: enter expected marks out of 720 and get your estimated All-India Rank range, based on NTA's official NEET 2026 and 2025 results.",
    faq: [RANK_NEET, ["When is NEET 2027?", NEET_DATES], NO_LOGIN, NOT_NTA],
  },
  {
    path: "jee-main-mock-test",
    landing: true,
    eyebrow: "JEE Main 2027",
    h1: "JEE Main mock tests on a real NTA-style screen",
    title: "JEE Main Mock Test 2027 — NTA-Style CBT with Real PYQs | JNEET+ AI",
    description: "Full-length JEE Main 2027 mock tests: 75 questions, Maths–Physics–Chemistry order, +4/−1 marking, NTA question palette, real PYQs mixed in, free All-India Mock every Sunday with rank.",
    intro: "Practise exactly like the exam: 75 questions in NTA's order (Maths, Physics, Chemistry), 20 MCQs + 5 numericals per subject, +4/−1 marking, and the same 5-colour question palette with Mark for Review.",
    points: [
      "Real JEE Main PYQs mixed with new questions — each PYQ shows its year, date and shift",
      "Free All-India Mock every Sunday: same paper for everyone, rank and percentile",
      "Predicted JEE Main rank after every full mock",
      "Numerical answers checked against NTA's official values",
    ],
    faq: [["When is JEE Main 2027?", JEE_DATES],
      ["Are the mock tests free?", "You can start for free. The All-India Mock every Sunday and its rank are free."],
      NOT_NTA],
    cta: { to: "/register", label: "Start a free mock" },
  },
  {
    path: "neet-mock-test",
    landing: true,
    eyebrow: "NEET UG 2027",
    h1: "NEET mock tests with real PYQs and an All-India rank",
    title: "NEET Mock Test 2027 — Full-Length 180 Questions with PYQs | JNEET+ AI",
    description: "Full-length NEET UG 2027 mock tests: 180 questions (Physics 45, Chemistry 45, Biology 90), +4/−1 marking, real NEET PYQs mixed in, free All-India Mock every Sunday with rank.",
    intro: "Full NEET papers with 180 questions — Physics 45, Chemistry 45, Biology 90 — timed, with +4/−1 marking and a question palette so you can practise time management.",
    points: [
      "Real NEET PYQs mixed with new questions — each PYQ shows its year",
      "Free All-India Mock every Sunday: same paper for everyone, rank and percentile",
      "Predicted NEET rank after every full mock",
      "Chapter-wise OneShot notes in English and Hinglish",
    ],
    faq: [["When is NEET 2027?", NEET_DATES],
      ["Are the mock tests free?", "You can start for free. The All-India Mock every Sunday and its rank are free."],
      NOT_NTA],
    cta: { to: "/register", label: "Start a free mock" },
  },
  {
    path: "jee-main-pyq",
    landing: true,
    eyebrow: "JEE Main PYQs",
    h1: "9,500+ JEE Main PYQs with NTA's official answers",
    title: "JEE Main PYQ (Previous Year Questions) Chapter-wise with NTA Answer Key | JNEET+ AI",
    description: "Practise 9,500+ official JEE Main previous year questions (2020–2026) chapter-wise, each checked against NTA's final answer key, with year, date and shift shown.",
    intro: "Every question comes from NTA's own question papers, and every answer is matched to NTA's final answer key. Dropped and old-syllabus questions are removed, so you only practise what can come in 2027.",
    points: [
      "Chapter-wise PYQ practice for Maths, Physics and Chemistry",
      "Year, date and shift shown on every question",
      "MCQs and numericals, scored the NTA way",
      "PYQs also appear inside full mocks",
    ],
    faq: [["Which years are included?", "JEE Main papers from 2020 to 2026 that NTA published with question IDs. More papers are added as we verify them."],
      ["When is JEE Main 2027?", JEE_DATES], NOT_NTA],
    cta: { to: "/register", label: "Practise PYQs free" },
  },
  {
    path: "neet-pyq",
    landing: true,
    eyebrow: "NEET PYQs",
    h1: "NEET PYQs chapter-wise with NTA's official answers",
    title: "NEET PYQ (Previous Year Questions) Chapter-wise with NTA Answer Key | JNEET+ AI",
    description: "Practise official NEET UG previous year questions chapter-wise — Physics, Chemistry, Biology — each checked against NTA's final answer key, with the year shown.",
    intro: "Official NEET UG questions from NTA's papers, with NTA's final answers. Dropped and old-syllabus questions are removed.",
    points: [
      "Chapter-wise PYQ practice for Physics, Chemistry and Biology",
      "Year shown on every question",
      "PYQs also appear inside full NEET mocks",
      "OneShot chapter notes to revise before you practise",
    ],
    faq: [["When is NEET 2027?", NEET_DATES], NOT_NTA],
    cta: { to: "/register", label: "Practise PYQs free" },
  },
];

export const seoPage = (path) => SEO_PAGES.find((p) => p.path === path) ?? null;
