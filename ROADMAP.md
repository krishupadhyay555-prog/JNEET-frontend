# JNEET+ AI — Master Roadmap & Checklist

> **Permanent memory file.** Every session (human or AI) reads this first.
> Update the boxes the moment something is done (`[ ]` → `[x]`), add the date, and never delete an item — strike it (`~~like this~~`) with a reason if it is dropped.
> Last updated: **19 Nov 2026** (launch sprint section + founder to-dos F1–F7). Before that: **16 Nov 2026** (OneShot complete, every page English + Hinglish; PYQs started — PR #30). Founder order (16 Nov): PYQs (all JEE Main + NEET, nothing missed), then diagrams, then the rest. ⚠️ claude.ai "Allowed websites" is set to **All websites** only while PYQs are collected — switch it back to standard + NTA domains when done. Work status: **ACTIVE** — 13 Nov founder order: **JEE OneShots first, as fast as possible** (JEE Main Session 1 is in late January 2027), every chapter complete and verified → then new questions. Everything else waits for the founder's OK (see §5 D-m).
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
- **App language = English, always** (founder, 14 Nov 2026): every button, menu, label, toast and error is English — students join from every state. Study content follows Settings → **Study language**: *Match my language* (default — the AI replies in whatever language the student writes: Hindi, Bengali, Gujarati, Marathi, Tamil…; English when unclear) · *English* · *Hinglish* (AI + OneShot in Hinglish). OneShot: `<slug>.json` = English (default), `<slug>.hinglish.json` = Hinglish; a page shows an English/Hinglish switch and says when it falls back. The word "Ratta" stays but always as **"Ratta (Must memorise)"**.
- **Payments must be bullet-proof** (founder, 14 Nov 2026): no double charge, no "money cut but no plan", no fake payment, no client-decided price. Current design (PR #13): server price only · HMAC-verified checkout + server re-fetch of the payment · one open order per student + per-user lock · plan applied exactly once (atomic claim) · webhook (signed, event-id dedupe) · 5-minute reconciliation sweep · refunds via the Razorpay dashboard only (full refund removes the days) · founder alert email on anything odd · full audit trail per order. Money settles only to the founder's Razorpay-linked bank account.
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
| #13 | **B4 payments (web only)**: Razorpay checkout for Pro/Elite (1 or 4 months, prepaid, no auto-renew), webhook, plan end dates (expired pass → Free automatically), Pro→Elite day conversion, parent payment link for under-18s, receipt email, `/plans` page, Settings "Plan & billing", nothing shown inside the TWA app (+ server refuses orders from it), CSP for Razorpay, Terms/Privacy/Refund text updated (v2026-11-14). Off until L10 keys are set | ✅ Merged 14 Nov — **payments still OFF live** (checked 18 Nov: `/api/payments/plans` says `enabled:false, mode:off`) until L10 |
| #15 | **English everywhere + Study language + Admin dashboard** (+ payment hardening, already merged via #13). Founder-only `/admin` page: live students, NEET vs JEE, signups per day, paid plans, revenue, learning activity, AI cost, safety — only for emails in Render `ADMIN_EMAILS`, 404 for everyone else, emails masked (stacked on #13 + #14 — merging #15 also merges them): all app text English; Settings → Study language (Match my language / English / Hinglish) drives AI replies + OneShot; OneShot bilingual files (Nuclei in English first, rest falls back to Hinglish with a note); "Ratta (Must memorise)"; payment hardening (see §0) | ✅ Merged |
| #14 | **OneShot batch 2**: Kinematics, Laws of Motion, Work Energy Power, Moving Charges, EMI, AC, Ray Optics, Wave Optics (143 numeric checks, 62 NTA syllabus points) + "Yaad rakho" label for plain facts (fixes the 14 Nov "Galti" polish item, batch 1 too) | ✅ Merged 14 Nov |
| #11 | **JEE OneShot batch 1**: 8 new chapters (Electrostatics, Dual Nature, Atoms, Nuclei, Chemical Thermodynamics, Equilibrium, Matrices & Determinants, Definite Integrals) + proper superscript/subscript display | ✅ Merged 14 Nov — live (checked in the browser 14 Nov) |
| #16 | **4.5× faster under load** (chapter-list cache) + Node 22 pin + capacity plan + question prompt v2 | ✅ Merged 15 Nov |
| #17 | **Question bank audit + batch 3**: 68 wrong keys re-solved and fixed, 332 duplicates removed, 1001 new verified questions (533 tough; numericals computed in code, maths checked with sympy, current NTA chapters only). Bank 13,095 → 13,764 | ✅ Merged 15 Nov — **founder must run the seed with `--prune` (see L-seed-3)** |
| #18 | **A2 "Report this question"** on result review + Revision; founder panel on /admin (grouped, reasons, notes, Fixed/Dismiss); email alert at 3 reports | ✅ Merged 15 Nov |
| #19 | **Launch trust pack**: new public design (home, About, Pricing, Contact, legal pages with TOC), Delivery Policy, Contact form + founder inbox, Download my data, public stats, OpenAI disclosure ("generated with OpenAI's GPT models", no logo/partnership claim) | ✅ Merged — founder still fills `BUSINESS.address` + `phone` (Razorpay asks for them) |
| #20 | **OneShot Physics complete**: 11 new chapters (Units, Gravitation, Solids & Fluids, Thermal, Thermodynamics, KTG, Oscillations, Waves, Magnetism & Matter, EM Waves, Semiconductors) — all 25 Physics chapters | ✅ Merged 15 Nov |
| #21 | **OneShot Chemistry part 1**: 9 Physical + Inorganic chapters | ✅ Merged 15 Nov |
| #22 | **OneShot Chemistry part 2**: 8 Organic chapters incl. Biomolecules + Practical Chemistry | ✅ Merged 15 Nov |
| #23 | **OneShot Biology part 1**: 17 Class 11 chapters + "Key facts" tab label for Biology | ✅ Merged 15 Nov |
| #24 | **OneShot Biology part 2**: 13 Class 12 chapters | ✅ Merged 15 Nov |
| #25 | **OneShot JEE Maths part 1**: 11 chapters (algebra, trig, coordinate geometry, vectors) | ✅ Merged 15 Nov |
| #26 | **OneShot JEE Maths part 2**: 8 chapters (calculus, probability, statistics) | ✅ Merged 15 Nov |
| #27 | **OneShot audit + English for every page**: English versions of all 21 Hinglish-only chapters; 6 short early pages (Rotational Motion, Current Electricity, Chemical Bonding, Complex Numbers, Breathing, Cell Cycle) rewritten in full in both languages; powers like 2^(n) now render as superscripts; duplicate-card and tag-as-unit checks; fact fixes (primary follicles at puberty, ~30,000 human genes); ppm; JEE physical-chemistry experiments added to the Practical Chemistry page; this ROADMAP update | ✅ Merged 16 Nov |
| #28 | **Hinglish for every OneShot page**: Hinglish versions of the 77 English-only pages (Physics 11, Chemistry 17, Biology 30, Maths 19). All 99 chapter pages are now English + Hinglish; a Hinglish-mode student no longer sees the "Hinglish version on its way" note. Same formulas, worked examples, numeric checks and syllabus coverage as the English page | ⚠️ Closed 16 Nov — its squash commit `fac0e5d` reached `main`, but GitHub's merge got stuck on "Merge already in progress" and never sent the push event, so Render did not deploy. Replaced by PR #29 |
| #29 | **Make PR #28 live**: the Hinglish OneShot content is already in `main` (`fac0e5d`); this PR only records the incident here. Merging it creates a normal push to `main`, which makes Render deploy the latest `main` (with all 99 bilingual pages) | ✅ Merged 16 Nov (pushed to `main` because GitHub's merge button kept failing; GitHub marked it Merged) |
| #30 | **PYQs, part 1**: new PYQ section (`/pyq`: by paper — year → date & shift; by chapter), official NTA paper + NTA final answer key for every question, our own short explanations, KaTeX maths, figures. Builder `tools/pyq/build.py` refuses to publish unless EVERY answer matches NTA's final key. First paper: JEE Main 2026 · 2 Apr · Shift 1 (75 Q). Sources + status: `docs/PYQ_COVERAGE.md` | ✅ Merged 16 Nov (pushed to `main`; merge button failing) — live, Render + Vercel deployed `f89eb78` |
| #31 | **PYQ year label + JEE Advanced → "coming soon"** — (1) each PYQ card shows its exam, year, date and shift (e.g. "JEE Main 2026 · 2 April · Shift 1") in both the paper and the chapter view (founder, 16 Nov); (2) landing page + JEE PYQ page say "JEE Advanced: coming soon (after JEE Main results)", and the AI mentor no longer offers Advanced-depth extras; (3) **8 more JEE Main 2026 papers (all of Session 2: 2, 4, 5, 6, 8 Apr)** shown as NTA's original question/option images cut from the official paper (nothing re-typed), answers straight from NTA's final key, every question chapter-tagged; tap-to-zoom; "explanation coming soon" until we write them; (4) **8 JEE Main 2025 Session 2 papers** (2, 3, 4-S2, 7, 8 Apr — official PDFs from nta.ac.in, English copy of the bilingual paper) | ✅ Merged 16 Nov — live (Vercel deployed `53328b8`; images on jneetai.com return 200) |
| #32 | **PYQs, part 3: 20 more JEE Main papers** — JEE Main 2023 Session 2 (all 12 B.Tech shifts, 6–15 Apr; 1,079 Q) + JEE Main 2024 Session 1 (8 of 10 shifts, 27 Jan–1 Feb; 720 Q). Official PDFs from nta.ac.in, answers from NTA's final keys (new parser `tools/pyq/ntakey_rows.py` for the 2023 key), every question chapter-tagged. Questions on topics NTA has since removed (s-Block, Polymers, Mathematical Reasoning, …: 117) stay in their paper with a "Not in the current JEE Main syllabus" label and are left out of chapter lists. One question NTA's own file has no English copy of (6 Apr 2023 S2 Q1) is left out and listed. **Total: 37 papers, 3,074 questions** | ✅ Merged 17 Nov — live (images on jneetai.com return 200) |
| #33 | **PYQs, part 4: all of JEE Main 2022 + first NEET papers** — JEE Main 2022 (all 24 B.Tech shifts, June + July; 2,160 Q; new cutter `tools/pyq/nta2022.py` for NTA's 2022 "ItemCode"/option-letter printing + key parser `ntakey_2022.py`) and **NEET (UG) 2023 (code E1), 2024 (code T1, Supreme-Court-revised key of 26.07.2024) and 2025 (code 45)** = 580 Q, cut from NTA's booklet scans by `tools/pyq/neetscan.py` (every question number read back by OCR; count + order must match or the build stops) with `build_neet.py` + `neetkey.py`. NEET options are printed inside the question image → answer buttons (1)–(4). Removed-syllabus questions labelled, not in chapter lists. **Total: 64 papers — JEE 5,234 Q + NEET 580 Q** | ✅ Merged 17 Nov — live (NEET images on jneetai.com return 200) |
| #34 | **PYQs, part 5: filling the gaps — 54 more papers** — JEE Main **2024 S2** (6, 8, 9 Apr from prepp.in copies: host watermark filtered by `ntaimages.stamps` = image on ≥80% of pages at one spot; 4 + 5 Apr from copies without a text layer: `ntaocr.py` Tesseract text, every ID still = NTA key), **2025 S1** (all 10 Jan shifts from blank candidate response sheets, `ntaresp.py`, IDs = NTA key), **2026 S1** (all 10 Jan shifts, blank response sheets, key parser `ntakey_2026s1.py`), **2021** (24 of 26 shifts, Feb/Mar/Jul/Aug, keys per medium `ntakey_old.py`), **2020 Sep** (8 of 10), **NEET 2020 (E1) + 2021 (M1)** (typeset booklets → `neetscan.layout_text`). Spot-checked by solving: 2024-04-04 S1 Q1, 2025-01-22 S1 Q1, 2021-02-24 S1 Q2, 2020-09-02 S1 Q3, NEET 2020 Q2, NEET 2021 Q3 — all = key. **Total: 128 papers — JEE 10,394 Q + NEET 960 Q = 11,354 Q** | ✅ Merged 17 Nov — live |

### Live check 14 Nov 2026 (Claude, built-in browser in the founder's Claude desktop app, logged in by the founder as a student)
- Backend `api.jneetai.com/health` → ok; `/api/oneshot` → 401 without login (new code is deployed on Render). Vercel production = `9303da6`.
- Dashboard: "Aaj ka plan" shows the OneShot suggestion + Revision; OneShot tile shows "11 chapters" in NEET mode (Maths pages correctly hidden in NEET mode).
- OneShot list (11 in NEET mode) and Electrostatics page open; superscripts/subscripts render.
- Revision chapter list shows fill-in-the-blank counts (e.g. Rotational Motion 71 MCQs · 8 blanks) — blanks are live.
- Ask AI page opens (5 of 5 doubts). AI answers NOT tested — needs L3 (OpenAI key on Render).
- Small polish found: some OneShot cards put a plain fact under the "Galti" label (e.g. "1 C ke liye 6.25 × 10¹⁸ electrons") — fixed in PR #14: plain facts now show as "Yaad rakho" (lib.py moves them automatically).
- **How Claude checks the live site:** founder keeps the Claude desktop app open on the laptop; Claude uses its built-in browser (separate from Chrome, no personal logins). The founder logs in himself — Claude never types passwords.

### 🚀 LAUNCH SPRINT 19–25 Nov 2026 (founder, 18–19 Nov: "next week earnings shuru", budget ₹10–30k, price hike OK)
Live check 18 Nov: site up, bank 13,764 Q, 99 OneShots, 128 PYQ papers — **but payments OFF** (no Razorpay keys), so nothing can be sold yet.
Honest target (told to founder 18 Nov): 1,000 buyers in one week is not realistic with ₹30k (CAC must be < ₹30); week 1 = 50–150 buyers; **1,000 by JEE Main Jan 2027 exam** is possible with 20–30 pay-per-sale affiliates.

**Founder — said 19 Nov he will do these (tick each when done):**
- [ ] F1 **Razorpay account + KYC — start first** (activation can take days). Needs PAN, bank, business address + phone (also fill `BUSINESS.address` + `phone` on the Contact page). Then L10 steps (test keys → test purchase → live keys + live webhook), `ADMIN_ALERT_EMAIL`.
- [ ] F2 **L9** Vercel Pro ($20/mo) or Cloudflare Pages — Vercel Hobby is non-commercial.
- [ ] F3 **L7** Render Starter → Standard + Atlas Flex (backups) — free tiers sleep / cap at ~100 ops/s.
- [ ] F4 **Brevo Starter** — free plan = 300 emails/day ≈ 150–250 signups/day, OTP stops after that.
- [ ] F5 **L3** OpenAI key + credit on Render; confirm AI doubts answer on the live site.
- [ ] F6 L2 Turnstile keys, L5 `EMAIL_FROM` / `FRONTEND_URL`.
- [ ] F7 Reply to the 3 decisions below (prices, free vs paid, affiliate commission).

**Proposed sales plan (waiting for founder's 3 decisions — Claude builds after "go"):**
1. Prices → exam passes instead of monthly: **JEE Main Jan 2027 Crash Pass ₹499** (till 31 Jan 2027) · **JEE Main 2027 Full Pass ₹999** (till 30 Apr 2027) · **NEET 2027 Pass ₹999** (till the NEET exam); early-bird price for the first 500 seats (real counter), then +₹200. Market check 18 Nov: Competishun 50-mock series ₹1,499 (till 30 Apr 2027), PW Mission 100 crash ₹1,999; MARKS gives chapter-wise PYQs free.
2. Free vs paid: PYQs + OneShot stay free (the hook); paid = more AI doubts + timed full mocks with All-India rank + analysis. Fix Elite's 50 doubts/day at ₹349 (worst-case AI cost can pass the price).
3. Affiliates: creator code → student ₹50 off, creator ₹120 per sale (paid only after the sale); ₹5–10k for a few test shoutouts on JEE/NEET Telegram channels, scale only the ones that sell.

**Claude build list (after "go", target Sun 22 Nov):** (a) exam passes + new prices + early-bird counter (payment rules in §0 unchanged) · (b) affiliate / referral codes + payout report on /admin (referral: 3 friends join → 1 week free) · (c) "All India Free JEE Main Mock — Sun 29 Nov": timed paper, rank list, WhatsApp score share · (d) free-vs-paid split + offer landing page · (e) parent payment link up front (most JEE students are under 18).
Profit per ₹499 pass ≈ ₹499 − ₹12 Razorpay − ₹120 affiliate − ₹30–60 AI ≈ **₹300**; 1,000 sales ≈ ₹3 lakh before fixed costs.

**Founder decisions 19 Nov:** (1) test series = new questions + real PYQs mixed; PYQs shown as NTA's image with exam + year + shift on it; (2) **All-India Rank** from a weekly All-India Mock (PYQs + toughest verified questions, NTA marking +4/−1, same paper for everyone, one attempt, server timer) — **no prizes for now**; (3) **margin rule: variable cost per sale (Razorpay + affiliate + AI + infra share) must stay well under 50% of the price** → affiliate as % (≈20% on ₹499, ≈15% on ₹999) instead of flat ₹120, per-student AI ₹ cap, PYQ explanations cached, diagrams drawn by code (no paid image AI); (4) **diagrams** wanted (OneShot + bank questions + "explain with a diagram" in AI chat) — plan: Chemistry structures from SMILES (RDKit / SmilesDrawer), Physics/Maths graphs + circuits + ray/FBD from code templates (SVG), flowcharts/cycles via Mermaid, Biology from Wikimedia Commons (licence + attribution checked) — est. 6–8 working days with helpers, after the 4 test features + payments. Pricing "go" still pending (monthly ₹249 + passes ₹499/₹999/₹999 proposed).

**Next after launch (proposed 19 Nov):** (i) PYQs into the question bank as image questions with NTA keys (+11,354 → bank ≈ 25k, code only, no re-typing); (ii) "Explain with AI" on every PYQ — the AI must reach NTA's key answer or the explanation is not saved; cached so each question is paid for once; (iii) new bank questions only from text files (cheaper than PDFs) of the founder's own / free-to-use material — never coaching books.

### LAUNCH TARGET: 25 Nov 2026 (founder decision, 15 Nov)
Founder: L3 OpenAI key, L7 Render Starter + Atlas, L9 hosting, L10 Razorpay (≈1 day), L2/L5, address + phone for Contact page. Claude: PR #19 trust pack → D83 → D79 numerical answers + D9 NTA exam screen → A4 diagnostic → A1 analytics → per-user rate limit → L8 smoke test on 24 Nov.

### Next session starts here (updated 15 Nov 2026, after PR #17)
000. **L-seed-3 (founder, laptop, after #17):** in `C:\Projects\JNEET-frontend\backend` run `git pull`, then `node seed/seedQuestions.js --prune` (dry run, ≈332 old copies listed), then `node seed/seedQuestions.js --prune --yes`. (15 Nov: the founder typed `ode` instead of `node` — PowerShell's red text was only "command not found", nothing changed.) After #18 merges no seed is needed.

00. **#13 and #14 merged 14 Nov (squash).** #15 was rebased onto main (the founder uses squash-merge — **rule: never stack a PR on another open PR; put follow-up work in the same PR or wait for the merge**). After #15: Render → add `ADMIN_EMAILS` = founder's login email → open jneetai.com/admin (Profile menu → Admin). No seed needed. Then on Render add `ADMIN_ALERT_EMAIL` (founder's inbox for payment alerts) along with the L10 Razorpay keys (test keys first). In Razorpay → Webhooks add `https://api.jneetai.com/api/payments/webhook` with events `payment.captured`, `payment.failed`, `order.paid`, `refund.processed` and the same secret as `RAZORPAY_WEBHOOK_SECRET`.
01. ~~**OneShot English versions** (D76-EN)~~ — done 15 Nov 2026 (PR #27): every OneShot page has an English version; 22 chapters also have Hinglish. ~~Hinglish versions of the 77 English-only pages~~ — done 16 Nov 2026 (PR #28): all 99 pages bilingual. Founder order 16 Nov: next PYQs, then diagrams. JEE Advanced OneShots come later (founder, 15 Nov).
0. **PR #14 (OneShot batch 2)** open → merge (no seed needed; Render redeploy is enough) → Claude checks the 20 OneShots in JEE mode live (19 in NEET mode).
0. **PR #13 (B4 payments)** open → founder merges → L9 (Vercel Pro / Cloudflare) → L10 Razorpay keys (test mode first) → Claude checks /plans live in the built-in browser and a test-mode payment end to end.
1. List open PRs (CLAUDE.md step 4).
2. Waiting on founder: L3 OpenAI key on Render, L2/L5/L6/L9, decision on D83 (hide vs delete out-of-syllabus questions; Claude recommends hide), confirm JEE Main 2027 S1 date (app says 22 Jan; some sites say 20 Jan per the 24 Oct bulletin).
3. Claude's next build order: (a) ~~**B4 payments**~~ (PR #13) — Razorpay web checkout for Free/Pro/Elite + webhook + plan quotas (no payment UI in the TWA app); (b) ~~OneShot batch 2~~ (PR #14) → next **OneShot batch 3** (Thermodynamics, KTG, Gravitation, Oscillations, Waves, Semiconductors, Units, Solids & Fluids, Thermal Properties, Magnetism & Matter, EM Waves); (c) D83 once decided; (d) ~~A2 report-question button~~ (PR #18), A4 diagnostic test.
3b. Small founder items from the 11–14 Nov chat (re-read 14 Nov): (i) accent — mockup used indigo, app keeps NEET teal / JEE indigo; founder to say if NEET should also be indigo; (ii) delete the old `phone-ops` branch on GitHub (website → Branches); (iii) keep a backup copy of the Play Store signing key folder (`C:\CProjectsJNEET_AIplaystore-signing-key`) on a pen drive / Drive — never delete it; old folders `C:\backend`, `C:\frontend`, `C:\Projects\JNEET_AI*` can be removed later; (iv) after these features the founder sends question batches in the D80 plain-text format (no coaching-book content); (v) screenshots cost the chat image limit — prefer text output files.
4. Month-end launch plan + honest earnings estimate were given to the founder on 13 Nov (launch ~1 Dec, beta 50–100 students first, free Sunday live mock as the hook, "JEE Jan Crash Pass" ₹299–499).

### Capacity & scaling plan (load test 14 Nov 2026)
- **Measured** (local, backend pinned to 1 CPU core, 500 test accounts, realistic mix of 8 student GET routes, zero errors): before the fix ~200 req/s; `/api/test/chapters` scanned the whole bank on every call (~300 ms) → now cached 10 min (PR #15) → **~900 req/s, p99 ≈ 50 ms at 20 parallel connections, ≈ 310 ms at 150**. An active student makes roughly 1 request per 15–30 s, so one CPU core ≈ several thousand students online at the same time; AI answers are limited by OpenAI and the daily AI budget, not by our server.
- **Real bottlenecks today (free tiers):** Atlas M0 (~100 ops/sec, 512 MB, no backups) · Render free (0.1 CPU, sleeps) · Brevo free (300 emails/day — signup OTP + login code + password reset; ~150–250 signups/day max) · Vercel Hobby (non-commercial).
- **Before launch (must):** Render Starter → Standard (1 CPU, 2 GB) · Atlas Flex ($8–30, 500 ops/sec cap, 5 GB) · Brevo Starter (no daily cap) · Vercel Pro or Cloudflare Pages (L9).
- **~10k active students:** Atlas M10 (dedicated, backups) · Render Pro (2 CPU) or 2× Standard behind Render's load balancer — then move rate limits to a shared store (Redis/Key Value or Mongo), because the limiter is in memory per instance · OpenAI usage tier rises with spend.
- **~1 lakh:** M20/M30 + read-heavy caching, 3–4 instances, CDN for static/OneShot JSON, queue for emails. Code changes needed then: shared rate-limit store, per-user (not per-IP) API limit for carrier NAT, background jobs run on one instance only.

### Issue log (so it never repeats)
| Date | Issue | Root cause | Fix / rule |
|---|---|---|---|
| 18 Nov 2026 | **97 founder-sent JEE "master" PDFs were reconstructions, not NTA files**; placing NTA's key by question order gave mostly wrong answers on 23 new shifts | PDF metadata: "reconstructed question paper; NTA preview layout", made by a "Question paper compositor" (PyMuPDF). Question + option order differ from NTA's. On 38 shifts we already had, the order matched (2,982/2,982), which hid the problem; helpers solving ~250 MCQs on the new shifts caught it | Nothing went live; work kept outside the repo. **Rule:** before using any PDF, read its metadata (producer/creator/subject) and require printed Question IDs (or a response sheet with IDs) that match NTA's key; never place answers by order alone |
| 16 Nov 2026 | **PR #28 merge stuck on "Merge already in progress"; app showed no change** | GitHub wrote the squash commit `fac0e5d` to `main` but never finished the merge: the PR stayed "Open", no PushEvent was recorded, no Actions run or Vercel/Render deploy started on that commit. Our files were fine (156 files, all checks green, no conflicts) | PR #28 closed; PR #29 (small ROADMAP change) merged to send a fresh push so Render deploys `main`. **Rule:** after every merge, check the PR says **Merged** and Render shows a deploy for the new commit; if GitHub hangs, don't press Merge again — close the PR and merge a fresh one, or use Render "Manual Deploy → Deploy latest commit" |
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
- [ ] **L10** Payments go-live (after PR #13 merge; do **L9** first — Vercel Hobby is non-commercial): Razorpay account + KYC → Dashboard **Test mode** first → Settings → API Keys → Render `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` → Webhooks → URL `https://api.jneetai.com/api/payments/webhook`, events `payment.captured`, `order.paid`, `payment.failed`, `refund.processed`, a secret → Render `RAZORPAY_WEBHOOK_SECRET` → Render `ADMIN_ALERT_EMAIL` (founder's inbox) → turn on 2-factor login in Razorpay and confirm the settlement bank account → test-mode purchase on jneetai.com/plans → then swap to **Live** keys + a live webhook. Optional prices (whole rupees): `PRICE_PRO_1M` (199), `PRICE_PRO_4M` (699), `PRICE_ELITE_1M` (349), `PRICE_ELITE_4M` (1199). Without the keys the site says "Paid plans open soon". With `rzp_test_` keys the Plans page shows a "Test mode" banner.
- [ ] **L9** Before paid plans: Vercel Hobby is **non-commercial only** → move to Vercel Pro ($20/mo) or Cloudflare Pages (free, commercial allowed).
- [x] Brevo domain authenticated, sender verified, OTP arriving (Oct 2026).
- [x] Turnstile code (invisible, fresh token per request, fails open, rate limits unchanged) and email logo — in PR #2.

---

## 2. Section A — What was missed (do first; no 10/10 without these)

| ID | Item | Why | Cost / time |
|---|---|---|---|
| A1 | [ ] **Product analytics** (PostHog-type) | Can't measure D7/D30, feature use or drop-off today | Free tier, 1 day |
| A2 | [x] **"Report this question" button + admin review panel** — built 15 Nov 2026 (PR #18) | Wrong questions caught fast; foundation of trust | ₹0, 2–3 days |
| A3 | [x] **Question bank cleanup** — done 11 Nov 2026 (PR #6): 1,184 keys fixed, 2,883 removed, chapters unified. Difficulty tags still need re-calibration (follow-up) | 13,986 of 15,635 tagged "tough" but tags unreliable (sampled "tough" was a one-formula question); **208 duplicates**; **0 diagram questions** | ₹0, 3–4 days |
| A4 | [ ] **Onboarding diagnostic test** (15–20 min) | Fills WMS on day 1 + personal plan; today a new student sees an empty dashboard | ₹0, 2–3 days |
| A5 | [ ] **SEO public pages** (formula sheets, PYQ solutions) | Site is fully behind login → invisible on Google; free traffic | ₹0, 4–5 days |
| A6 | [ ] **Hindi medium support** | NTA offers Hindi papers; large Hindi-medium share, esp. NEET; few good AI tools for them | AI translation + check, ~1 week |
| A7 | [ ] **Low-end Android + low data** (PWA install, data-saver mode) | ₹8–10k phones and slow internet are common | ₹0, 2–3 days |
| A8 | [x] **Feedback + support channel** — done 15 Nov 2026 (PR #19): public Contact page + form (reference number, ack email, founder inbox on /admin), report-question button (PR #18) | Students know where to report; trust + free bug-testing | ₹0, 1 day |
| A9 | [ ] **Small pending items** | ~~JEE dates are placeholders~~ (JEE Main 2027 S1 confirmed 22 Jan, done 11 Nov); NEET 2027 date not announced yet; `AdminDemo.jsx` keep/delete; Schedule route is an empty stub; `RevisionQueue.js` model is an empty file; PR #2 not merged | ₹0, 1–2 days |
| A10 | [x] **DPDP (India data law) check** — 15 Nov 2026 (PR #19): Settings → Download my data (one JSON file), delete account already existed; purge now also erases reports and support messages. Lawyer review still D82 | Parent consent exists; verify students can download/delete their own data | ₹0, 1 day |

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
- [x] **JEE Advanced hidden from the web app — 16 Nov 2026 (founder):** no Advanced content anywhere students see it; only a "JEE Advanced: coming soon (after JEE Main results)" line on the landing page and the JEE PYQ page; the AI mentor teaches Main level and says the Advanced pack is coming. Advanced questions stay stored, unserved. Target: after JEE Main Session 1 results (Feb 2027).
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
    - [x] Batch 3 (PR #20, merged 15 Nov 2026): Thermodynamics (Phy), KTG, Gravitation, Oscillations, Waves, Semiconductors, Units & Measurement, Solids & Fluids, Thermal Properties, Magnetism & Matter, EM Waves.
    - [x] Batch 4 (PR #21, merged 15 Nov 2026) (Chemistry): Some Basic Concepts, Atomic Structure, Redox & Electrochemistry, Chemical Kinetics, Solutions, Classification & Periodicity, p-Block, d- & f-Block, Coordination Compounds.
    - [x] Batch 5 (PR #22, merged 15 Nov 2026) (Organic): GOC (Basic Principles), Hydrocarbons, Haloalkanes & Haloarenes, Alcohols/Phenols/Ethers, Aldehydes/Ketones/Acids, Amines, Biomolecules, Practical Chemistry.
    - [x] Batch 6 (PRs #25/#26, merged 15 Nov 2026; Quadratic + Complex upgraded in PR #27) (Maths): Sets/Relations/Functions, Quadratic + Complex (upgrade), P&C, Binomial, Sequences & Series, Limits/Continuity/Differentiability, Differentiation, Application of Derivatives, Indefinite Integrals, Application of Integrals, Differential Equations.
    - [x] Batch 7 (PRs #25/#26, merged 15 Nov 2026) (Maths): Straight Lines, Circles, Conic Sections, 3D Geometry, Vector Algebra, Statistics, Probability, Trigonometric Functions, Inverse Trig.
    - [x] Upgrade the first shorter pages (Rotational Motion, Current Electricity, Chemical Bonding, Complex Numbers, Breathing, Cell Cycle) to the new standard — 15 Nov 2026 (PR #27), English + Hinglish.
    - [x] Biology (PRs #23/#24, merged 15 Nov 2026): all 32 current NEET Biology chapters (5 chapters NTA removed in 2024 are skipped: Transport in Plants, Mineral Nutrition, Digestion, Food Production, Environmental Issues).
    - [x] English for every page — 15 Nov 2026 (PR #27). **Totals: 77 NEET pages (Physics 25, Chemistry 20, Biology 32) + 66 JEE pages (Physics 25, Chemistry 19, Maths 22); 99 unique chapter pages because Physics and Chemistry pages serve both exams.**
    - [x] Hinglish versions of the English-only pages — 16 Nov 2026 (PR #28). All 99 pages are English + Hinglish.
    - [ ] JEE Advanced OneShots (later — founder, 15 Nov).
    - [ ] Practical Chemistry is in the JEE Main 2024+ syllabus too, but the JEE question bank has no Practical Chemistry questions yet, so the page is shown in NEET mode only (the oneshot test requires every page's chapter to exist in that exam's bank). Add JEE practical questions with D80, then add `"JEE"` to `tools/oneshot/c_practical.py`.
- [ ] **D77 "Pichli baar ka recap"** — every time the student opens the chat, a short line: "Pichli baar: <topics> — 5–10 sawaal se revise karo?". On click, the AI maps the last chat's topics to our chapter list (choice from the list only) and serves 5–10 **verified questions from the bank** for those chapters; if no chapter matches, no recap (never AI-invented questions). Strictly tested.
  - 12 Nov 2026: built in PR #10 (strip in chat, dismiss per visit, 5 bank questions, + "Aaj ka plan" card on Dashboard). Tick after merge + live check (needs L3 OpenAI key for the AI chapter mapping; without it a careful keyword match is used).
- [ ] **D78 Smart Chat v2** — topic memory ("adhoora topic, wapas chalein?"), rolling summary, 1,000+ messages per chat (load older on scroll, render only visible), quick chips under answers, "Concept vs 📌 Ratta" labels, "✓ Verified" badge when the answer matches the bank.
  - 12 Nov 2026: quick chips under the latest answer done in PR #10. Rest still to do.
- [ ] **D79 Numerical (integer) answers** — JEE Main has numerical questions in every subject; the test engine only knows single-correct MCQ today. Later: multi-correct / matrix / paragraph for Advanced.
- [ ] **D80 Question intake (hybrid)** — founder pastes plain-text questions (any source except coaching books); Claude converts, solves, checks numbers with code, de-duplicates against the bank, fixes or drops, and reports counts.
- [ ] **D81 PYQs** — 🟡 started 16 Nov 2026 (PR #30: section + first JEE paper; PR #31: all 9 JEE Main 2026 Session 2 shifts + 8 of 9 JEE Main 2025 Session 2 shifts = 1,275 Q, image-based via `tools/pyq/build_img.py`; PR #32: + 2023 S2 (12) + 2024 S1 (8) = 37 papers, 3,074 Q; PR #33: + JEE 2022 (24) + NEET 2023/24/25 = 64 papers, 5,814 Q; PR #34: + gaps (2026 S1, 2024 S2, 2025 S1, 2021, 2020 Sep, NEET 2020/21) = 128 papers, 11,354 Q; coverage plan in `docs/PYQ_COVERAGE.md`; founder OK'd student-shared official PDFs when their Question/Option IDs match NTA's final key). Official NTA papers + official final answer keys only; our own verified solutions; label "NEET UG 2024 · NTA"; dropped/bonus marked; never coaching solutions.
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
