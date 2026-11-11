# JNEET+ AI — Master Roadmap & Checklist

> **Permanent memory file.** Every session (human or AI) reads this first.
> Update the boxes the moment something is done (`[ ]` → `[x]`), add the date, and never delete an item — strike it (`~~like this~~`) with a reason if it is dropped.
> Last updated: **8 Nov 2026**. Work status: **ON HOLD** — nothing below gets built until the founder says "go" and confirms the order.

**Motto:** *Roz thoda, sahi tareeke se, bina pressure — samjho, yaad rakho, khud karo.*
**Target:** a 10/10 product for NEET UG + JEE Main students — "iske bina prep nahi karunga".
**Current honest rating:** ~6.5/10 today → ~8–8.5/10 with 3D + games → 9–10/10 with the habit loop, Mistake Notebook and a clean question bank.

---

## 0. Standing rules (never break)

- Never share `.env` / keys in chat or commit them; keys go only into Render / Vercel dashboards.
- No Sparkles icon anywhere.
- NEET UG and JEE Main have **equal priority** (NEET UG only, not PG; JEE Main only, not Advanced). 90–95% on-exam content; rare beyond-exam extras are labelled.
- 18+ content strictly banned: warning → final warning → 1-hour chat pause → remark in Analytics. Distress messages are never blocked.
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

| PR | What | Status (11 Nov 2026) |
|---|---|---|
| #1 | Launch prep: offline notes, JEE, timed mocks, 18+ policy, WMS | ✅ Merged / live |
| #2 | Turnstile captcha, **email logo**, seed script skips empty files | ⏳ **Open — NOT live** |
| #3 | `ROADMAP.md` + `CLAUDE.md` (this memory file) | ⏳ **Open — NOT live** |

### Issue log (so it never repeats)
| Date | Issue | Root cause | Fix / rule |
|---|---|---|---|
| 11 Nov 2026 | Email logo still not showing | PR #2 still open (not merged) | Same fix: merge PR #2 |
| 8 Nov 2026 | Email logo not showing | Code was in PR #2, which was never merged | Merge PR #2. **Rule:** every reply that ships code ends with "Live after you merge PR #N", and every session starts by listing open PRs |
| Oct 2026 | OTP emails not arriving | Brevo IP blocking + unauthenticated domain + Gmail sender | Domain authenticated, sender verified, IP blocking off |
| Oct 2026 | Seed script would crash | Six empty `*-batch2.json` files | Script skips empty files (PR #2) |

---

## 1. Launch checklist (still pending)

- [ ] **L1** Merge PR #2 (captcha + email logo + seed script skips empty files) — *open, not merged as of 1 Nov*.
- [ ] **L2** Cloudflare Turnstile: site key → Vercel `VITE_TURNSTILE_SITE_KEY` (redeploy); secret → Render `TURNSTILE_SECRET_KEY`. Test login / register / forgot-password.
- [ ] **L3** OpenAI key + $10 credit on Render (`OPENAI_API_KEY`), confirm model IDs (`gpt-6-luna`, `gpt-6.1-sol`), run `node scripts/ai-eval.mjs` and read the 6 answers. *AI chat does not work without this.*
- [ ] **L4** `api.jneetai.com` custom domain on Render + DNS at Hostinger (need nameserver screenshot) → Vercel `VITE_API_BASE_URL=https://api.jneetai.com/api` → Render `COOKIE_SAMESITE=lax`.
- [ ] **L5** Render: `EMAIL_FROM=no-reply@jneetai.com`; `FRONTEND_URL` order `https://jneetai.com,https://www.jneetai.com,https://jneet-frontend.vercel.app` (first entry drives email links + logo).
- [ ] **L6** Legal details in `frontend/src/legal/content.js` → `BUSINESS`.
- [ ] **L7** Atlas Flex (backups), Render Starter ($7, no spin-down), UptimeRobot, Sentry.
- [ ] **L8** Production 10-minute smoke test.
- [ ] **L9** Before paid plans: Vercel Hobby is **non-commercial only** → move to Vercel Pro ($20/mo) or Cloudflare Pages (free, commercial allowed).
- [x] Brevo domain authenticated, sender verified, OTP arriving (Oct 2026).
- [x] Turnstile code (invisible, fresh token per request, fails open, rate limits unchanged) and email logo — in PR #2.

---

## 2. Section A — What was missed (do first; no 10/10 without these)

| ID | Item | Why | Cost / time |
|---|---|---|---|
| A1 | [ ] **Product analytics** (PostHog-type) | Can't measure D7/D30, feature use or drop-off today | Free tier, 1 day |
| A2 | [ ] **"Report this question" button + admin review panel** | Wrong questions caught fast; foundation of trust | ₹0, 2–3 days |
| A3 | [ ] **Question bank cleanup** | 13,986 of 15,635 tagged "tough" but tags unreliable (sampled "tough" was a one-formula question); **208 duplicates**; **0 diagram questions** | ₹0, 3–4 days |
| A4 | [ ] **Onboarding diagnostic test** (15–20 min) | Fills WMS on day 1 + personal plan; today a new student sees an empty dashboard | ₹0, 2–3 days |
| A5 | [ ] **SEO public pages** (formula sheets, PYQ solutions) | Site is fully behind login → invisible on Google; free traffic | ₹0, 4–5 days |
| A6 | [ ] **Hindi medium support** | NTA offers Hindi papers; large Hindi-medium share, esp. NEET; few good AI tools for them | AI translation + check, ~1 week |
| A7 | [ ] **Low-end Android + low data** (PWA install, data-saver mode) | ₹8–10k phones and slow internet are common | ₹0, 2–3 days |
| A8 | [ ] **Feedback + support channel** | Students know where to report; trust + free bug-testing | ₹0, 1 day |
| A9 | [ ] **Small pending items** | JEE dates are placeholders; `AdminDemo.jsx` keep/delete; Schedule route is an empty stub; `RevisionQueue.js` model is an empty file; PR #2 not merged | ₹0, 1–2 days |
| A10 | [ ] **DPDP (India data law) check** | Parent consent exists; verify students can download/delete their own data | ₹0, 1 day |

---

## 3. Section B — What should change

- [ ] **B1 "Toughest" → "right tough".** Difficulty set from real student accuracy (<40% correct = tough); weaker students climb a ladder (moderate → tough) so they don't quit. Default mix for ready students 70–80% tough; student can ask for easy/moderate.
- [ ] **B2 AI memory.** Chat always knows the student's WMS weak topics and past mistakes ("Pichli baar torque mein sign galat kiya tha"). ~₹0.
- [ ] **B3 Free tier = value first.** 7-day Pro reverse trial, then back to Free.
- [ ] **B4 Pricing.** Monthly + **exam-season pass** (JEE Jan/Apr, NEET May) + **parent payment link** (paid on the web, never in-app). Suggested Pro ₹149–199/mo or season pass ₹499–799 (to validate).
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
- [ ] **D37 Original tough multi-concept questions written by Claude** — ~5,000–8,000 over 3–4 weeks; numericals verified by running code. ₹0 API.
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
- [ ] **D64 Remove JEE Advanced countdown** from `config/targetExams.js` (out of scope: JEE Main only; it also wrongly says "NTA" — Advanced is run by IITs). Advanced could be a later paid add-on, not now.
- [ ] **D65 Motivation page** redesign.
- [ ] **D66 Floating "Ask mentor" bar** — stays fixed at the bottom while scrolling in chat.
- [ ] **D67 Chat layout** — fix top being cut off, lag, premium feel.
- [ ] **D68 Fun / Mentor switch in chat** (toggle in the chat header) — test deeply.
- [ ] **D69 Wording** — "That is what makes it stick" → clearer "That is how you remember it" (Hinglish-friendly).
- [ ] **D70 Voice in 3D simulations** — narration via browser voice (₹0) / Sarvam for Pro.
- [ ] **D71 Animations, themes, design polish on every page** (incl. Privacy, Terms, Legal, Settings).
- [ ] **D72 Playable demo of Memory Card Match + game samples** before full build.

### D-k. Later / platform
- [ ] **D60 Razorpay + Pro/Elite (Batch 6)** — 2% + GST per payment; ₹199 KYC.
- [ ] **D61 Google login.**
- [ ] **D62 Play Store TWA** (no payment UI inside).

---

## 6. Priority order (founder to confirm)

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

- Question bank: **15,635** (NEET Bio 2,941 · NEET Chem 2,412 · NEET Phy 2,501 · JEE Phy 2,624 · JEE Chem 2,378 · JEE Maths 2,779), 196 chapters, 0 images, 208 duplicates, difficulty tags unreliable. Six `*-batch2.json` seed files are empty (seed fix in PR #2).
- AI quotas: Free 5/day · Pro 30/day · Elite 50/day + 10 deep/month.

## 9. Open decisions (founder)

- [ ] **JEE Advanced (proposed 11 Nov 2026, awaiting founder OK).** Proposal: plans = NEET UG · JEE Main · JEE Main + Advanced combo (no Advanced-only plan, since Advanced needs Main first). Same teaching method for all (mentor, write-by-hand, WMS, games, 3D); only content level, question types (multi-correct, paragraph, matrix-match, integer, partial marking) and AI depth change. Every question tagged `main`/`advanced`; plan checked on the server. Durations: 1 month + 3 months (+ "till exam" pass later). Suggested prices (to validate): NEET UG / JEE Main ₹199/mo or ₹499/3 mo; Main + Advanced ₹299/mo or ₹749/3 mo. Launch timing: Advanced content Feb–Mar 2027. If approved, change §0 "JEE Main only" rule accordingly.

- [ ] Confirm priority order in §6.
- [ ] Final prices (B4).
- [ ] `AdminDemo.jsx` keep or delete.
- [ ] Vercel Pro vs Cloudflare Pages (L9).
- [ ] Rename the OpenAI org currently named like a password.
- [ ] Share the YouTube short's title/screenshots (link couldn't be opened) to match its exact 3D style.
