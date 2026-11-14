# JNEET+ AI — Master Roadmap & Checklist

> **Permanent memory file.** Every session (human or AI) reads this first.
> Update the boxes the moment something is done (`[ ]` → `[x]`), add the date, and never delete an item — strike it (`~~like this~~`) with a reason if it is dropped.
> Last updated: **14 Nov 2026** (B4 payments PR opened). Work status: **ACTIVE** — 13 Nov founder order: **JEE OneShots first, as fast as possible** (JEE Main Session 1 is in late January 2027), every chapter complete and verified → then new questions. Everything else waits for the founder's OK (see §5 D-m).
> Founder gave Claude project-lead permission (12 Nov): Claude runs commands, tests, local seeds and opens PRs; the founder merges PRs, runs live-database commands from the laptop and handles every password/key — Claude never sees or asks for them.

**Motto:** *Roz thoda, sahi tareeke se, bina pressure — samjho, yaad rakho, khud karo.*
**Target:** a 10/10 product for NEET UG + JEE Main students — "iske bina prep nahi karunga".
**Current honest rating:** ~6.5/10 today → ~8–8.5/10 with 3D + games → 9–10/10 with the habit loop, Mistake Notebook and a clean question bank.

---

## 0. Standing rules (never break)

- Never share `.env` / keys in chat or commit them; keys go only into Render / Vercel dashboards.
- No Sparkles icon anywhere.
- NEET UG and JEE Main have **equal priority** (NEET UG only, not PG). **JEE Advanced only inside a "JEE Main + Advanced" combo** (decided 12 Nov 2026 — never an Advanced-only plan); Advanced questions stay unserved (`level: "advanced"`) until the combo, its content and its question types are ready. 90–95% on-exam content; rare beyond-exam extras are labelled.
- Chat rules (18+ content **and** abusive language, any language) strictly banned: warning → final warning → 1-hour pause → 24-hour pause + Analytics remark → lock. Unlock: 18+ student after 24 h by accepting the rules; under-18 only via ONE email to the approving parent (resend max once/24 h). A strike needs the context judge to agree; unclear cases get a polite refusal with no strike. Distress messages are never blocked, counted or locked. Message text is never stored. (Safety v2, PR #10.)
- The founder runs the seed script himself.
- Don't bring up the notes-vault app idea or Instagram/Reddit ads unless he does.
- **No payment UI inside the TWA/Play Store app** — payments on the web only. Paid plans are **non-refundable**.
- Keep `GEMINI_API_KEY` on Render until Luna fully replaces it (founder's call — ignore the old "remove Gemini" line in `LAUNCH_CHECKLIST.md`).
- Verify every file actually parses/validates; never ask the founder to hand-merge JSON.
- Quality bar: **polished, not MVP**. Detailed step-by-step guidance; never skip steps; one step at a time.
- Commits: `update: <what>` with the Co-Authored-By / Claude-Session trailers.

---

## 0.5 Live status — what is actually on the website (check every session)

Code only goes live after its PR is **merged into `main`**. Until then the founder will not see it, even if it is "done" here.

| PR | What | Status (13 Nov 2026) |
|---|---|---|
| #1 | Launch prep: offline notes, JEE, timed mocks, 18+ policy, WMS | ✅ Merged / live |
| #2 | Turnstile captcha, **email logo**, seed script skips empty files | ✅ Merged 11 Nov — live (logo inside email confirmed on Gmail) |
| #3 | `ROADMAP.md` + `CLAUDE.md` (this memory file) | ✅ Merged 11 Nov |
| #4 | Roadmap live-status update | ✅ Merged 11 Nov |
| #5 | **Debug sweep**: critical login bypass fix, search crash, test paper fixes, chat layout/lag, accuracy labels, JEE Main dates, security updates | ✅ Merged 11 Nov — live |
| #6 | **Question bank cleanup + new tough questions**: 1,184 wrong answer keys fixed, 2,883 broken/duplicate questions removed, chapter names unified, 216 new verified questions (incl. 47 JEE Advanced, stored but not served), `seedQuestions.js --prune` | ✅ Merged 12 Nov — live (Render deploy `4cd38ac`). Seed run 12 Nov from the laptop: 3,471 old copies deleted, live database = **12,968** |
| #7 | Phone-ops seed button (GitHub Actions) | ❌ Closed, not merged — founder prefers running commands from the laptop |
| #8 | Roadmap: seed done, UptimeRobot, laptop setup | ✅ Merged 12 Nov |
| #9 | Safety hotfix (18+ filter flagged maths / biology words) | ❌ Closed — folded into #10 so the same files are not in two open PRs |
| #10 | **Safety v2 + fill-in-the-blanks + OneShot + recap + Aaj ka plan + quick chips + new light/dark theme** (needs L-seed-2 after merge). Safety: 3-layer check in any language (patterns + OpenAI moderation + context judge), 5-step ladder with lock, unlock (adult 24 h / parent email for under-18), abuse covered, distress in any language, legal text updated. Includes the #9 fix | ✅ Merged 12 Nov — live. L-seed-2 done 14 Nov (database = **13,095**, 0 stale) |
| #13 | **B4 payments (web only)**: Razorpay checkout for Pro/Elite (1 or 4 months, prepaid, no auto-renew), webhook, plan end dates (expired pass → Free automatically), Pro→Elite day conversion, parent payment link for under-18s, receipt email, `/plans` page, Settings "Plan & billing", nothing shown inside the TWA app (+ server refuses orders from it), CSP for Razorpay, Terms/Privacy/Refund text updated (v2026-11-14). Off until L10 keys are set | 🟡 Open — needs merge + L10 |
| #14 | **OneShot batch 2**: Kinematics, Laws of Motion, Work Energy Power, Moving Charges, EMI, AC, Ray Optics, Wave Optics (143 numeric checks, 62 NTA syllabus points) + "Yaad rakho" label for plain facts (fixes the 14 Nov "Galti" polish item, batch 1 too) | 🟡 Open — needs merge |
| #11 | **JEE OneShot batch 1**: 8 new chapters (Electrostatics, Dual Nature, Atoms, Nuclei, Chemical Thermodynamics, Equilibrium, Matrices & Determinants, Definite Integrals) + proper superscript/subscript display | ✅ Merged 14 Nov — live (checked in the browser 14 Nov) |

### Live check 14 Nov 2026 (Claude, built-in browser in the founder's Claude desktop app, logged in by the founder as a student)
- Backend `api.jneetai.com/health` → ok; `/api/oneshot` → 401 without login (new code is deployed on Render). Vercel production = `9303da6`.
- Dashboard: "Aaj ka plan" shows the OneShot suggestion + Revision; OneShot tile shows "11 chapters" in NEET mode (Maths pages correctly hidden in NEET mode).
- OneShot list (11 in NEET mode) and Electrostatics page open; superscripts/subscripts render.
- Revision chapter list shows fill-in-the-blank counts (e.g. Rotational Motion 71 MCQs · 8 blanks) — blanks are live.
- Ask AI page opens (5 of 5 doubts). AI answers NOT tested — needs L3 (OpenAI key on Render).
- Small polish found: some OneShot cards put a plain fact under the "Galti" label (e.g. "1 C ke liye 6.25 × 10¹⁸ electrons") — fixed in PR #14: plain facts now show as "Yaad rakho" (lib.py moves them automatically).
- **How Claude checks the live site:** founder keeps the Claude desktop app open on the laptop; Claude uses its built-in browser (separate from Chrome, no personal logins). The founder logs in himself — Claude never types passwords.

### Next session starts here (updated 14 Nov 2026, after PR #13)
0. **PR #14 (OneShot batch 2)** open → merge (no seed needed; Render redeploy is enough) → Claude checks the 20 OneShots in JEE mode live (19 in NEET mode).
0. **PR #13 (B4 payments)** open → founder merges → L9 (Vercel Pro / Cloudflare) → L10 Razorpay keys (test mode first) → Claude checks /plans live in the built-in browser and a test-mode payment end to end.
1. List open PRs (CLAUDE.md step 4).
2. Waiting on founder: L3 OpenAI key on Render, L2/L5/L6/L9, decision on D83 (hide vs delete out-of-syllabus questions; Claude recommends hide), confirm JEE Main 2027 S1 date (app says 22 Jan; some sites say 20 Jan per the 24 Oct bulletin).
3. Claude's next build order: (a) ~~**B4 payments**~~ (PR #13) — Razorpay web checkout for Free/Pro/Elite + webhook + plan quotas (no payment UI in the TWA app); (b) ~~OneShot batch 2~~ (PR #14) → next **OneShot batch 3** (Thermodynamics, KTG, Gravitation, Oscillations, Waves, Semiconductors, Units, Solids & Fluids, Thermal Properties, Magnetism & Matter, EM Waves); (c) D83 once decided; (d) A2 report-question button, A4 diagnostic test.
4. Month-end launch plan + honest earnings estimate were given to the founder on 13 Nov (launch ~1 Dec, beta 50–100 students first, free Sunday live mock as the hook, "JEE Jan Crash Pass" ₹299–499).

### Issue log (so it never repeats)
| Date | Issue | Root cause | Fix / rule |
|---|---|---|---|
| 13 Nov 2026 | **Question bank still serves topics NTA removed** (found while writing OneShots): 92 of 117 Nuclei questions are radioactivity / half-life; whole chapters Hydrogen, s-Block, States of Matter, Surface Chemistry, Polymers, Chemistry in Everyday Life, Metallurgy, Mathematical Reasoning, Linear Programming are still in the JEE bank | Bank was built from older (pre-2024) syllabus lists | **Not changed yet — founder to decide (D83).** OneShots follow the current NTA syllabus only and say so on the page. **Rule:** every new chapter/question is checked against the current NTA syllabus first |
| 12 Nov 2026 | **18+ filter could warn/pause a student for a maths or biology question** | `18+` tag matched "18 + 4√2" when the message also said "show"; standalone words with study meanings (cock, nude, tits, incest, Lund) were in the explicit list | PR #9: `18+` only as a tag (not before a number/variable), study words removed or narrowed, 16 new test cases. **Rule:** every new pattern needs a "must stay clean" test from the syllabus (Biology, Maths, Physics) before it ships |
| 12 Nov 2026 | Seed `--prune` listed 3,471 old questions, not the expected 2,883 | Seed matches on exam + subject + chapter + text, so every question whose chapter was renamed (e.g. "Mechanical Properties of Solids" → "…of Solids and Fluids") got a new copy and the old copy became "stale" | Expected. **Rule:** before `--prune --yes`, check `Questions now in the database` − stale = number of questions in the JSON files; run `--yes` right after the dry run so students never see both copies |
| 12 Nov 2026 | Founder's laptop had only old copies (`C:\backend`, `C:\frontend`, `C:\Projects\JNEET_AI*`, June–Aug) | Code was never cloned with git | Fresh clone at `C:\Projects\JNEET-frontend` (git, `main`); `backend\.env` holds only `MONGO_URI` copied from Render. **Rule:** always run commands from `C:\Projects\JNEET-frontend`, after `git pull origin main` |
| 11 Nov 2026 | Many answer keys wrong; explanations said "option index 2… discarded"; 2,000+ repeated questions; same chapter under 2–3 names | Generated questions were saved without checking that the key matched the worked answer; near-identical rewrites were all kept | PR #6: every flagged question solved again (sympy/brute force for numericals); keys fixed or question deleted; near-duplicates removed; new test `seedQuestions.test.js` blocks bad shape, duplicate options, duplicate text and self-contradicting explanations. **Rule:** a question enters the bank only after its answer is computed/verified, and the bank test must pass |
| 11 Nov 2026 | PR #5 showed "Checks failed", then "merge conflicts" | CI: GitHub's runner could not reach Ubuntu's servers while installing the test browser (not our code; re-run passed). Conflict: PR #4 changed the same ROADMAP lines and was merged separately | Re-ran CI; merged `main` into the branch. **Rule:** never put the same file change in two open PRs |
| 11 Nov 2026 | **CRITICAL: anyone could log in to any verified account** | `/verify-email` logged the caller in when the email was already verified, without checking the code | Fixed in PR #5 (now 409 "already verified, please log in", no session) + regression test |
| 11 Nov 2026 | Notes / chat search crashed (500) on `?q=a&q=b` | Query param arrived as an array | Only plain strings used, capped at 100 chars (PR #5) |
| 11 Nov 2026 | Same question could appear twice in one test; full mock mixed all subjects | `$sample` can repeat; bank has 208 same-text copies; whole paper shuffled together | Unique by id + text; full mock in NTA sections Physics → Chemistry → Biology/Maths (PR #5) |
| 11 Nov 2026 | Chat logo cut off at the top; header/input hidden on phones; lag while answering | Fixed-height centred empty state; `100vh` + `scrollIntoView` scrolled the page; re-render per token | `min-h-full`, `100dvh`, scroll only the list, one render per frame (PR #5) |
| 11 Nov 2026 | WMS/Analytics showed "4% accuracy" for 6 right of 20 answered | Skipped questions counted as wrong in "accuracy" | Ring renamed "Score"; true accuracy (correct ÷ answered) shown (PR #5) |
| 11 Nov 2026 | Known, not fixed yet | `zod` 3 memory-exhaustion advisory (needs zod 4 migration; risk limited by the 256 KB body cap + array limits); `react-router` 6 advisories (open-redirect via user-supplied paths / SSR — the app passes no user paths, no SSR); fixing both needs major upgrades | Plan a zod 4 + React Router 7 upgrade after launch |
| 11 Nov 2026 | Round "J" avatar still shown next to sender in Gmail | That avatar is Gmail's sender picture, not the email body; the in-email logo works | Free fix: Google Account on `no-reply@jneetai.com` (via free forwarding) with the logo as profile photo. Paid fix later: BIMI + CMC (~$650–990/yr) |
| 11 Nov 2026 | Email logo still not showing | PR #2 still open (not merged) | Same fix: merge PR #2 |
| 8 Nov 2026 | Email logo not showing | Code was in PR #2, which was never merged | Merge PR #2. **Rule:** every reply that ships code ends with "Live after you merge PR #N", and every session starts by listing open PRs |
| Oct 2026 | OTP emails not arriving | Brevo IP blocking + unauthenticated domain + Gmail sender | Domain authenticated, sender verified, IP blocking off |
| Oct 2026 | Seed script would crash | Six empty `*-batch2.json` files | Script skips empty files (PR #2) |

---

## 1. Launch checklist (still pending)

- [x] **L1** Merge PR #2 (captcha + email logo + seed script skips empty files) — merged 11 Nov 2026.
- [x] **L-seed** Seed after PR #6 — done 12 Nov 2026 from the laptop (`C:\Projects\JNEET-frontend\backend`): `node seed/seedQuestions.js --prune` (3,471 stale listed, 16,439 total) then `--prune --yes` (3,471 deleted, **12,968** left).
- [x] **L-seed-2** (done 14 Nov 2026 from the laptop: 13,095 / 13,095 seeded, 0 stale — every file count matched the repo) Seed after PR #10 (127 fill-in-the-blanks): same laptop folder → `git pull origin main` → `node seed/seedQuestions.js --prune` (expect total **13,095**, stale 0) → `--prune --yes`.
- [ ] **L2** Cloudflare Turnstile: site key → Vercel `VITE_TURNSTILE_SITE_KEY` (redeploy); secret → Render `TURNSTILE_SECRET_KEY`. Test login / register / forgot-password.
- [ ] **L3** OpenAI key + $10 credit on Render (`OPENAI_API_KEY`), confirm model IDs (`gpt-6-luna`, `gpt-6.1-sol`), run `node scripts/ai-eval.mjs` and read the 6 answers. *AI chat does not work without this.*
- [ ] **L4** `api.jneetai.com` custom domain on Render + DNS at Hostinger (need nameserver screenshot) → Vercel `VITE_API_BASE_URL=https://api.jneetai.com/api` → Render `COOKIE_SAMESITE=lax`.
  - 12 Nov 2026: Render part done — `https://api.jneetai.com/health` answers over HTTPS (UptimeRobot "Up"). Still to do: Vercel `VITE_API_BASE_URL` + redeploy, then Render `COOKIE_SAMESITE=lax`.
- [ ] **L5** Render: `EMAIL_FROM=no-reply@jneetai.com`; `FRONTEND_URL` order `https://jneetai.com,https://www.jneetai.com,https://jneet-frontend.vercel.app` (first entry drives email links + logo).
- [ ] **L6** Legal details in `frontend/src/legal/content.js` → `BUSINESS`.
- [ ] **L7** Atlas Flex (backups), Render Starter ($7, no spin-down), UptimeRobot, Sentry.
  - [x] UptimeRobot — done 12 Nov 2026: "JNEET backend" (`https://api.jneetai.com/health`) + "JNEET website" (`https://jneetai.com`), 5-min checks, email + phone push. The 5-min pings also keep the free Render backend awake (one service ≈ 720–744 of the 750 free hours/month — keep no other free Render service).
- [ ] **L8** Production 10-minute smoke test.
- [ ] **L10** Payments go-live (after PR #13 merge; do **L9** first — Vercel Hobby is non-commercial): Razorpay account + KYC → Dashboard **Test mode** first → Settings → API Keys → Render `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` → Webhooks → URL `https://api.jneetai.com/api/payments/webhook`, events `payment.captured`, `order.paid`, `payment.failed`, a secret → Render `RAZORPAY_WEBHOOK_SECRET` → test-mode purchase on jneetai.com/plans → then swap to **Live** keys + a live webhook. Optional prices (whole rupees): `PRICE_PRO_1M` (199), `PRICE_PRO_4M` (699), `PRICE_ELITE_1M` (349), `PRICE_ELITE_4M` (1199). Without the keys the site says "Paid plans jald khulenge".
- [ ] **L9** Before paid plans: Vercel Hobby is **non-commercial only** → move to Vercel Pro ($20/mo) or Cloudflare Pages (free, commercial allowed).
- [x] Brevo domain authenticated, sender verified, OTP arriving (Oct 2026).
- [x] Turnstile code (invisible, fresh token per request, fails open, rate limits unchanged) and email logo — in PR #2.

---

## 2. Section A — What was missed (do first; no 10/10 without these)

| ID | Item | Why | Cost / time |
|---|---|---|---|
| A1 | [ ] **Product analytics** (PostHog-type) | Can't measure D7/D30, feature use or drop-off today | Free tier, 1 day |
| A2 | [ ] **"Report this question" button + admin review panel** | Wrong questions caught fast; foundation of trust | ₹0, 2–3 days |
| A3 | [x] **Question bank cleanup** — done 11 Nov 2026 (PR #6): 1,184 keys fixed, 2,883 removed, chapters unified. Difficulty tags still need re-calibration (follow-up) | 13,986 of 15,635 tagged "tough" but tags unreliable (sampled "tough" was a one-formula question); **208 duplicates**; **0 diagram questions** | ₹0, 3–4 days |
| A4 | [ ] **Onboarding diagnostic test** (15–20 min) | Fills WMS on day 1 + personal plan; today a new student sees an empty dashboard | ₹0, 2–3 days |
| A5 | [ ] **SEO public pages** (formula sheets, PYQ solutions) | Site is fully behind login → invisible on Google; free traffic | ₹0, 4–5 days |
| A6 | [ ] **Hindi medium support** | NTA offers Hindi papers; large Hindi-medium share, esp. NEET; few good AI tools for them | AI translation + check, ~1 week |
| A7 | [ ] **Low-end Android + low data** (PWA install, data-saver mode) | ₹8–10k phones and slow internet are common | ₹0, 2–3 days |
| A8 | [ ] **Feedback + support channel** | Students know where to report; trust + free bug-testing | ₹0, 1 day |
| A9 | [ ] **Small pending items** | ~~JEE dates are placeholders~~ (JEE Main 2027 S1 confirmed 22 Jan, done 11 Nov); NEET 2027 date not announced yet; `AdminDemo.jsx` keep/delete; Schedule route is an empty stub; `RevisionQueue.js` model is an empty file; PR #2 not merged | ₹0, 1–2 days |
| A10 | [ ] **DPDP (India data law) check** | Parent consent exists; verify students can download/delete their own data | ₹0, 1 day |

---

## 3. Section B — What should change

- [ ] **B1 "Toughest" → "right tough".** Difficulty set from real student accuracy (<40% correct = tough); weaker students climb a ladder (moderate → tough) so they don't quit. Default mix for ready students 70–80% tough; student can ask for easy/moderate.
- [ ] **B2 AI memory.** Chat always knows the student's WMS weak topics and past mistakes ("Pichli baar torque mein sign galat kiya tha"). ~₹0.
- [ ] **B3 Free tier = value first.** 7-day Pro reverse trial, then back to Free.
- [ ] **B4 Pricing.** *(14 Nov 2026: payments built in PR #13 — Free/Pro/Elite, 1 m = 30 days / 4 m = 120 days, placeholder prices ₹199/₹699 Pro, ₹349/₹1,199 Elite changeable from Render; parent payment link done. Still open: final prices, "4-month pass never ends before the exam date" idea, exam-season pass naming, expiry reminder email.)* Monthly + **exam-season pass** (JEE Jan/Apr, NEET May) + **parent payment link** (paid on the web, never in-app). Suggested Pro ₹149–199/mo or season pass ₹499–799 (to validate).
  - 12 Nov 2026 (founder): plan names stay **Free / Pro / Elite** ("Advanced plan" would clash with JEE Advanced). Durations **1 month + 4 months** (founder prefers 4 over 3: Jan–Apr). Open point: a fixed Jan–Apr pass ends *before* NEET (May) and JEE Advanced (May/June) — proposal: the 4-month pass never ends before the student's exam date. Main + Advanced combo = Elite level only; optional **"Advanced Crash" (~45 days, sold after JEE Main results)**.
- [ ] **B5 Board-exam balance for Class 12.** Light "board mode" option while staying JEE/NEET-focused.

---

## 4. Section C — New ideas (these make it 10/10)

### C-a. Understanding and writing
- [ ] **C1 Handwritten solution checker** — photo of copy → AI checks each step ("Step 3 sign galat"). Matches the "write it yourself" goal; rare in market. ~₹0.5–1/check, with limits.
- [ ] **C2 "Solve with me" step mode** — student enters one step at a time, AI says yes/no; never just the answer. ~₹0.1.
- [ ] **C3 Root-cause finder** — weak in Rotation → check Vectors/Torque basics first (prerequisite graph). ₹0.
- [ ] **C4 2-minute micro-lessons** with a 3D simulation per concept. ₹0.

### C-b. Remembering
- [ ] **C5 Personal formula sheet** — only the formulas you got wrong. ₹0.
- [ ] **C6 Revision podcast** — 5-min audio chapter summary. Browser voice ₹0; natural voice ~₹1.5.
- [ ] **C7 Last-30-days crash mode** — high-weightage chapters + personal formula sheet + Mistake Notebook. ₹0.

### C-c. Exam temperament
- [ ] **C8 "Attempt or skip?" trainer** — negative-marking strategy from the student's own mock data. ₹0.
- [ ] **C9 All India Live Mock**, one Sunday a month, real exam timing, live rank; free → big event + acquisition. ₹0, 1 week.
- [ ] **C10 Exam calendar + alerts** (form, admit card, result dates). ₹0.

### C-d. Habit and company (no pressure)
- [ ] **C11 Silent Study Room** — co-study on a shared timer, no chat (safe for minors). ₹0, 3–4 days.
- [ ] **C12 Achievements for real learning** ("Rotation ke 50 tough sahi"), not just logins. ₹0.
- [ ] **C13 Weekly letter from the AI mentor** every Sunday. ~₹0.1.
- [ ] **C14 Wellbeing check-in** (sleep/stress, 10 sec); high stress → lighter plan. ₹0.

### C-e. Trust and future
- [ ] **C15 "Verified" badge** on questions checked by code/double-solve. ₹0.
- [ ] **C16 College predictor** (NEET/JEE) — needs clean past cutoff data. ₹0, ~1 week.
- [ ] **C17 Coaching mode (B2B, later)** — small institutes assign tests to their students.

---

## 5. Section D — Features discussed earlier (20 Oct – 1 Nov 2026)

### D-a. Daily habit loop
- [ ] **D1 Daily Dose** — 10 questions / 5 min from WMS weak chapters + due revisions.
- [ ] **D2 Streak** + earned streak-freeze + Perfect Week + 7/30/100-day badges.
- [ ] **D3 Daily goal commitment** at onboarding ("roz 20 sawal").
- [ ] **D4 Exam countdown** on the dashboard with today's target.
- [ ] **D5 Web push** (Android Chrome) + weekly email digest.
- [ ] **D6 Daily 9 PM Live Challenge** — 15 questions, instant rank.

### D-b. Learning that raises marks
- [ ] **D7 Mistake Notebook (auto)** with reason tags (silly / concept / time / didn't know) + spaced repetition.
- [ ] **D8 Flashcards with spaced repetition** (formulas, NCERT Biology facts, reactions).
- [ ] **D9 NTA-style exam interface** (palette, mark-for-review, negative marking, timer).
- [ ] **D10 Deep mock analysis** (time per question, marks lost to silly mistakes, attempt strategy).
- [ ] **D11 Percentile/rank estimate** from past NTA trends, clearly labelled "estimate".
- [ ] **D12 "Why was my answer wrong"** — AI compares chosen vs correct option.
- [ ] **D13 Hint ladder** — Hint 1 → Hint 2 → full solution.
- [ ] **D14 Photo doubt** — Cloudinary upload exists; wire to AI (check Luna vision, else Sol). ~₹0.1–1.2/photo.
- [ ] **D15 Chapter-wise PYQ + "how often asked" heatmap** (needs PYQ data + verified keys).

### D-c. Planning
- [ ] **D16 AI Study Planner** — weekly plan from exam date + syllabus + WMS; re-adjusts on missed days.
- [ ] **D17 Syllabus tracker** — lecture / notes / PYQ / revision 1 / revision 2 ticks.
- [ ] **D18 Focus timer (Pomodoro) + study-hours log.**

### D-d. Motivation and social (safe for minors)
- [ ] **D19 Weekly leagues** — groups of 30, nicknames only, no chat.
- [ ] **D20 Shareable weekly report card** (Instagram-story size).
- [ ] **D21 Referral** — bring 2 friends → 1 week Pro.
- [ ] **D22 Friend challenge** — same 10 questions via invite code.

### D-e. What makes them pay
- [ ] **D23 Parent weekly report (opt-in)** — likely the biggest paid trigger.
- [ ] **D24 Reverse trial** (see B3).
- [ ] **D25 Pro wall** — Free: 5 doubts/day, Daily Dose, 1 mock/week, Mistake Notebook up to 50. Pro: unlimited doubts, photo doubts, all mocks + deep analysis, rank estimate, planner, unlimited flashcards, parent report.
- [ ] **D26 Last-60-days Crash Mode** (see C7).
- [ ] **D27 Sunday 2-minute check-in** (see C14).
- [ ] **D28 PWA install + offline** (notes already offline), later TWA/Play Store ($25).

### D-f. Voice
- [ ] **D29 Voice input** — browser SpeechRecognition (free; Chrome/Android) with OpenAI `gpt-4o-mini-transcribe` fallback (~₹0.29/min).
- [ ] **D30 "Suno" button** — AI writes a 300–500-char spoken version (formulas in words, Hinglish). Free users: browser voice (₹0). Pro: Sarvam Bulbul v3 (₹30 per 10k chars ≈ ₹1.5/answer), daily cap, audio cached. ~5–7 days for voice + photo + Suno.

### D-g. Smart question engine
- [ ] **D31 Bank-first serving** (₹0) filtered by chapter + difficulty.
- [ ] **D32 No repeats** — per-student seen set; only wrong ones return via spaced revision.
- [ ] **D33 Tough mix 70–80%** by default, adaptive (see B1); honours "easy/moderate" requests.
- [ ] **D34 AI generates only when the bank runs out** — one model writes, a second solves independently, mismatch → discard. ~₹3–5 per kept question.
- [ ] **D35 New questions saved as "pending"** → promoted to Tests/MCQs after enough attempts and sane accuracy (pay once, free for everyone after).
- [ ] **D36 Difficulty recalibrated from real accuracy.**

### D-h. Question bank growth (target ~35,000–40,000 total)
- [ ] **D37 Original tough multi-concept questions written by Claude** — ~5,000–8,000 over 3–4 weeks; numericals verified by running code. ₹0 API. *Progress: first 216 added 11 Nov 2026 (PR #6) — NEET 87, JEE Main 82, JEE Advanced 47.*
- [ ] **D38 JEE Main PYQs 2019–2026** — ~12,000–14,000 from NTA papers + final answer keys; own solutions.
- [ ] **D39 NEET PYQs 2013–2026** — ~3,000. Never copy coaching sites' solutions.
- [ ] **D40 Diagram questions** (SVG figures) — physics needs them.

### D-i. 3D animation (₹0 path chosen)
- [ ] **D41 Interactive 3D simulations (Three.js)** — real equations, rotate + sliders, runs on the student's phone (₹0/month). First 15 in ~3 weeks (1–2 days each, ~½ day after the engine).
  - Physics: projectile, circular motion, SHM, waves, electric field lines, magnetic field of a wire, Lorentz-force helix, lens/mirror ray diagrams, interference.
  - Chemistry: s/p/d orbitals, VSEPR shapes, crystal lattices (BCC/FCC), chirality/isomers.
  - Maths: 3D geometry (lines, planes, vectors), conics, solids of revolution.
- [ ] **D42 "AI director"** — chat opens the right simulation with values from the question. ~₹0.01/use.
- [ ] **D43 PhET embeds** for quick wins (older HTML sims are CC BY 4.0, commercial OK with attribution; 2D, English).
- ~~AI text-to-video (Kling/Veo)~~ — not chosen: ₹216–288 per 30-s clip, physics often wrong, on-demand would be ~₹5.4 lakh/month.
- ~~AI Manim render server~~ — not now (~₹2,000+/month server, render failures).

### D-j. Games (all from the question bank → playing = practice)
No-API (₹0): 
- [ ] **D44 Memory Card Match** (formula ↔ quantity / unit) — **founder's priority**.
- [ ] **D45 60-second Blitz** (combo bonus).
- [ ] **D46 Boss Battle** (10 toughest of a chapter, 3 lives).
- [ ] **D47 Dimension Detective** (units/dimensions).
- [ ] **D48 Reaction Chain** (organic reagent → product drag).
- [ ] **D49 NCERT Swipe** (Biology true/false swipe).
- [ ] **D50 Diagram Label** (heart, nephron, eye, flower — own SVGs).
- [ ] **D51 Graph Match** (graph ↔ equation).
- [ ] **D52 Spot the Mistake** (one wrong step in a solution).
- [ ] **D53 Daily Puzzle** (Wordle-style; shareable).
- [ ] **D54 1v1 Live Duel** (4–5 days).
- [ ] **D55 Estimation** (order of magnitude).

With API (Luna, ~₹0.2 per 10-turn session):
- [ ] **D56 AI Viva** (examiner follow-ups).
- [ ] **D57 Feynman game** (student explains, AI finds gaps).
- [ ] **D58 Guess my concept** (20 questions).
- [ ] **D59 AI mnemonics/stories** (made once, cached for all).

Game engine (score, lives, timer, XP, leaderboard) 3–4 days; each simple game 1–2 days; 8 games ≈ 3–4 weeks.

### D-l. Founder feedback, 4 Nov 2026 (UI polish batch)
- [ ] **D63 Notes search bar** — better search (fuzzy match, chapter/subject filters, highlight matches).
- [x] **D64 Remove JEE Advanced countdown** *(done 11 Nov, PR #5 — saved Advanced targets now ask the student to pick again)* from `config/targetExams.js` (out of scope: JEE Main only; it also wrongly says "NTA" — Advanced is run by IITs). Advanced could be a later paid add-on, not now.
- [ ] **D65 Motivation page** redesign.
- [ ] **D66 Floating "Ask mentor" bar** — stays fixed at the bottom while scrolling in chat.
- [ ] **D67 Chat layout** — fix top being cut off, lag, premium feel. *(cut-off, hidden header/input and streaming lag fixed 11 Nov in PR #5; "premium feel" polish still open)*
- [ ] **D68 Fun / Mentor switch in chat** (toggle in the chat header) — test deeply.
- [x] **D69 Wording** *(done 11 Nov, PR #5: "Writing it yourself is how you remember it.")* — "That is what makes it stick" → clearer "That is how you remember it" (Hinglish-friendly).
- [ ] **D70 Voice in 3D simulations** — narration via browser voice (₹0) / Sarvam for Pro.
- [ ] **D71 Animations, themes, design polish on every page** (incl. Privacy, Terms, Legal, Settings).
- [ ] **D72 Playable demo of Memory Card Match + game samples** before full build.

### D-m. Founder decisions and new work, 12 Nov 2026
- [ ] **D73 Safety v2** — PR #10 (see §0). Tick when merged + checked live.
- [x] **D74 Mockups first** — premium, calm, study-focused, not cartoon, no Sparkles: Chat, Dashboard, Revision, OneShot. Founder picks, then build.
  - 12 Nov 2026: 6 phone mockups shared — Chat in 2 looks (A "Calm Paper" light / B "Night Focus" dark), Pichli baar ka recap, Dashboard, Revision (fill-in-the-blank + MCQ), OneShot: https://claude.ai/artifact/CWcKodXKcUdDWea4eR7JcV.
  - 12 Nov 2026: founder approved ("Design achha hai", both light and dark; "OneShot perfect"). Built in PR #10: light = warm paper #F6F5F2, dark = slate #0F1217, NEET teal / JEE indigo accents kept.
- [ ] **D75 Revision = MCQ + fill-in-the-blanks** (instant feedback; separate from Mock Tests and from OneShot). Needs a new `fill_blank` question type + verified content.
  - 12 Nov 2026: built in PR #10 — `fill_blank` type, strict server-side matcher, 127 verified blanks (74 NEET / 53 JEE, 11 chapters). Tick after merge + seed (L-seed-2). More blanks come with D80.
- [ ] **D76 OneShot (separate feature)** — per chapter, pre-written and verified (₹0 per student, never generated live): brief summary + all important formulas + important examples + short-but-detailed explanation of the important topics. Own words only (no NCERT text).
  - 12 Nov 2026: built in PR #10 — `/oneshot` pages + 6 chapters (Rotational Motion, Current Electricity, Chemical Bonding, Breathing, Cell Cycle, Complex Numbers). Tick after merge; more chapters to be added.
  - 13 Nov 2026: **JEE push started.** New standard per chapter: every NTA syllabus point covered (checked by script), 11–28 formula cards, 7–10 solved examples whose numbers are recomputed by Python/sympy, key topics, ratta list. Generator + checks in the repo: `tools/oneshot/` (run `python3 tools/oneshot/build_all.py`; `lib.py build()` refuses to write a chapter if any number or syllabus point fails).
    - [x] Batch 1 (PR #11, merged + live 14 Nov 2026): Electrostatics, Dual Nature, Atoms, Nuclei, Chemical Thermodynamics, Equilibrium, Matrices & Determinants, Definite Integrals.
    - [x] Batch 2 (PR #14, built 14 Nov 2026 — live after merge): Kinematics, Laws of Motion, Work Energy Power, Moving Charges & Magnetism, EMI, AC, Ray Optics, Wave Optics. 143 numeric checks, 62 syllabus points. (Magnetism-and-matter part of the JEE unit stays in Batch 3.)
    - [ ] Batch 3: Thermodynamics (Phy), KTG, Gravitation, Oscillations, Waves, Semiconductors, Units & Measurement, Solids & Fluids, Thermal Properties, Magnetism & Matter, EM Waves.
    - [ ] Batch 4 (Chemistry): Some Basic Concepts, Atomic Structure, Redox & Electrochemistry, Chemical Kinetics, Solutions, Classification & Periodicity, p-Block, d- & f-Block, Coordination Compounds.
    - [ ] Batch 5 (Organic): GOC (Basic Principles), Hydrocarbons, Haloalkanes & Haloarenes, Alcohols/Phenols/Ethers, Aldehydes/Ketones/Acids, Amines, Biomolecules, Practical Chemistry.
    - [ ] Batch 6 (Maths): Sets/Relations/Functions, Quadratic + Complex (upgrade), P&C, Binomial, Sequences & Series, Limits/Continuity/Differentiability, Differentiation, Application of Derivatives, Indefinite Integrals, Application of Integrals, Differential Equations.
    - [ ] Batch 7 (Maths): Straight Lines, Circles, Conic Sections, 3D Geometry, Vector Algebra, Statistics, Probability, Trigonometric Functions, Inverse Trig.
    - [ ] Upgrade the first 4 shorter pages (Rotational Motion, Current Electricity, Chemical Bonding, Complex Numbers) to the new standard.
- [ ] **D77 "Pichli baar ka recap"** — every time the student opens the chat, a short line: "Pichli baar: <topics> — 5–10 sawaal se revise karo?". On click, the AI maps the last chat's topics to our chapter list (choice from the list only) and serves 5–10 **verified questions from the bank** for those chapters; if no chapter matches, no recap (never AI-invented questions). Strictly tested.
  - 12 Nov 2026: built in PR #10 (strip in chat, dismiss per visit, 5 bank questions, + "Aaj ka plan" card on Dashboard). Tick after merge + live check (needs L3 OpenAI key for the AI chapter mapping; without it a careful keyword match is used).
- [ ] **D78 Smart Chat v2** — topic memory ("adhoora topic, wapas chalein?"), rolling summary, 1,000+ messages per chat (load older on scroll, render only visible), quick chips under answers, "Concept vs 📌 Ratta" labels, "✓ Verified" badge when the answer matches the bank.
  - 12 Nov 2026: quick chips under the latest answer done in PR #10. Rest still to do.
- [ ] **D79 Numerical (integer) answers** — JEE Main has numerical questions in every subject; the test engine only knows single-correct MCQ today. Later: multi-correct / matrix / paragraph for Advanced.
- [ ] **D80 Question intake (hybrid)** — founder pastes plain-text questions (any source except coaching books); Claude converts, solves, checks numbers with code, de-duplicates against the bank, fixes or drops, and reports counts.
- [ ] **D81 PYQs** — official NTA papers + official final answer keys only; our own verified solutions; label "NEET UG 2024 · NTA"; dropped/bonus marked; never coaching solutions.
- [ ] **D82 DPDP lawyer check before 13 May 2027** — parent emails (safety lock), any parent progress report (D23), email-link consent.
- [ ] **D83 Out-of-syllabus questions in the bank** (see issue log 13 Nov) — options: (a) hide them from JEE/NEET tests with a `syllabus: "old"` flag (reversible), (b) delete with `--prune`. Founder to choose.

### D-k. Later / platform
- [ ] **D60 Razorpay + Pro/Elite (Batch 6)** — built in PR #13 (14 Nov 2026); tick after merge + L10 test payment. — 2% + GST per payment; ₹199 KYC.
- [ ] **D61 Google login.**
- [ ] **D62 Play Store TWA** (no payment UI inside).

---

## 6. Priority order (founder to confirm)

**12 Nov 2026 founder order (current):** 1 Safety v2 (D73) · 2 Mockups (D74) · 3 Revision MCQ + fill-in-the-blanks (D75) · 4 OneShot (D76) · 5 Pichli baar ka recap (D77) · then new questions (D80). The list below is the older proposal.

**Top 10:** 1 Analytics (A1) · 2 Question bank cleanup + report button (A3, A2) · 3 Diagnostic test (A4) · 4 Daily Dose + streak (D1, D2) · 5 Mistake Notebook + spaced repetition (D7) · 6 Handwritten solution checker (C1) · 7 AI memory (B2) · 8 3D simulations + Memory Card Match and other games (D41, D44+) · 9 All India Live Mock (C9) · 10 SEO pages + Hindi medium (A5, A6).

| Week | Work |
|---|---|
| 0 | Launch checklist L1–L9 |
| 1–2 | Analytics, question bank cleanup, report button, smart question engine, Daily Dose + streak |
| 3–4 | Mistake Notebook + spaced repetition, diagnostic test, Memory Card Match + 2–3 games |
| 5–7 | 3D simulations (first 15) + AI director |
| 6–9 | Remaining games, NTA mock + deep analysis |
| Ongoing | New tough questions + PYQs |
| Later | Voice, photo doubt, handwriting checker, parent report, Hindi, SEO, Razorpay |

Estimated total: **~10–12 weeks**. Most items cost ₹0/month; only the handwriting checker and natural voice are paid (both with limits).

---

## 7. Cost reference (Oct 2026 prices, $1 = ₹96)

| Item | Cost |
|---|---|
| Launch hosting (≤300 users) | ~₹1,950–3,850/month (Render Starter + Atlas Flex + optional Vercel Pro + AI) |
| 2,000 users | ~₹11,500/month · 10,000 users ~₹35,000/month |
| AI doubt (Luna) | ~₹0.06 typical, ₹0.25 worst · deep answer (Sol) ~₹4.4 |
| AI-generated verified question | ~₹3–5 (kept in bank after) |
| 3D simulations / no-API games / bank serving | ₹0 |
| AI director | ~₹0.01/use · API game session ~₹0.2 |
| Sarvam TTS | ₹30 per 10k chars · OpenAI transcribe ~₹0.29/min |
| Razorpay | 2% + 18% GST on fee (2.36%) |
| ₹10k Instagram ad (est., payments live) | ~25k–60k reach, ~100–250 signups, ~10–30 still active at D30, ~3–8 paid; run a ₹2–3k test first |

## 8. Known facts

- Question bank (after PR #6): **12,968** = NEET 6,877 (Bio 2,923 · Chem 2,046 · Phy 1,908) + JEE Main 6,044 (Phy 1,997 · Chem 2,070 · Maths 1,977) + JEE Advanced 47 (stored, not served; `level: "advanced"`). Was 15,635 before cleanup. Live database seeded and pruned 12 Nov 2026 (12,968). 0 images; difficulty tags still unreliable (≈88% "tough"). New questions go in `*-batch2.json` / `jee-advanced.json`.
- AI quotas: Free 5/day · Pro 30/day · Elite 50/day + 10 deep/month.

## 9. Open decisions (founder)

- [x] **JEE Advanced — decided 12 Nov 2026:** only inside a Main + Advanced combo (Elite level), 1 or 4 months; content + question types first (see §0, B4, D79). Original proposal kept for reference: **JEE Advanced (proposed 11 Nov 2026).** Proposal: plans = NEET UG · JEE Main · JEE Main + Advanced combo (no Advanced-only plan, since Advanced needs Main first). Same teaching method for all (mentor, write-by-hand, WMS, games, 3D); only content level, question types (multi-correct, paragraph, matrix-match, integer, partial marking) and AI depth change. Every question tagged `main`/`advanced`; plan checked on the server. Durations: 1 month + 3 months (+ "till exam" pass later). Suggested prices (to validate): NEET UG / JEE Main ₹199/mo or ₹499/3 mo; Main + Advanced ₹299/mo or ₹749/3 mo. Launch timing: Advanced content Feb–Mar 2027. If approved, change §0 "JEE Main only" rule accordingly.

- [ ] Confirm priority order in §6.
- [ ] Final prices (B4).
- [ ] `AdminDemo.jsx` keep or delete.
- [ ] Vercel Pro vs Cloudflare Pages (L9).
- [ ] Rename the OpenAI org currently named like a password.
- [ ] Share the YouTube short's title/screenshots (link couldn't be opened) to match its exact 3D style.
