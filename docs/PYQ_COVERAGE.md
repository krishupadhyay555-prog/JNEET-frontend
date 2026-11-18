# PYQ coverage — sources and status

Rule (founder, 16 Nov 2026): **every paper and answer must be correct.**
A question goes into the app only when:

1. its text comes from an **official NTA (or CBSE, for old years) paper** — from NTA's own site, the
   Internet Archive copy of NTA's site, or a student-shared copy of the official PDF; and
2. its **Question ID / Option IDs match NTA's official final answer key** (for student-shared copies
   this proves the paper is genuine), and
3. our own worked answer equals NTA's answer (`tools/pyq/build.py` stops on any mismatch).

Coaching-institute PDFs may be used **only as a cross-check**, never as the source. Explanations are
always our own.

## How to add a paper

1. Download the official paper PDF and the official final key PDF; note both URLs.
2. Copy `tools/pyq/papers/jee_main_2026_04_02_s1.py`, set `PAPER`, transcribe every question
   (`q`, `o`, chapter `ch`), work it out (`mine`) and write the short explanation (`x`).
   Figures: crop with `tools/pyq/crop.py` into `frontend/public/pyq/<id>/`.
3. `python3 tools/pyq/build.py <file>` — must print ✓ (all answers = NTA key, KaTeX renders).
4. `npx vitest run tests/pyq.test.js` in `backend/`.

## Official sources found (16 Nov 2026)

| Exam | Years | Question papers | Final answer keys |
|---|---|---|---|
| JEE Main | 2026 S2 | ✅ NTA site — 9 B.Tech shifts (2, 4, 5, 6, 8 Apr) | ✅ NTA |
| JEE Main | 2026 S1 | ❌ not public on NTA (student copies needed) | ✅ NTA (Domestic + International IDs) |
| JEE Main | 2025 S2 | ✅ nta.ac.in/Download/ExamPaper (bilingual; 8 of 9 B.Tech shifts usable — 4 Apr S1 has missing images) — linked from study4india.com lists | ✅ NTA (3-column key, `tools/pyq/ntakey_cols.py`) |
| JEE Main | 2025 S1 | ❌ NTA's own files are corrupted on the server | ✅ NTA |
| JEE Main | 2024 S1 | ✅ nta.ac.in ExamPaper (8 of 10; 27 Jan S2 + 29 Jan S2 not found) | ✅ NTA (cols) |
| JEE Main | 2024 S2 | ✅ 6, 8, 9 Apr (S1+S2) from prepp.in copies — watermark image filtered out, IDs = NTA key; 🟡 4 + 5 Apr: copies have no text layer (IDs drawn as curves) | ✅ NTA Notice_20240424132602 (as on 22.04.2024) |
| JEE Main | 2023 S2 | ✅ nta.ac.in ExamPaper — all 12 B.Tech shifts | ✅ NTA CDN 2023/04/2023042419.pdf (`ntakey_rows.py`) |
| JEE Main | 2023 S1 | ❌ not found yet (only B.Arch on the list) | ✅ NTA |
| JEE Main | 2022 S1 + S2 | ✅ nta.ac.in ExamPaper — all 24 B.Tech shifts (format "2022": `nta2022.py`) | ✅ NTA CDN 2022/07/2022070665.pdf, 2022/08/2022080753.pdf (`ntakey_2022.py`) |
| NEET (UG) | 2023 | ✅ nta.ac.in ExamPaper (code E1, booklet scan → `neetscan.py`) | ✅ NTA Notice_20230615172159 |
| NEET (UG) | 2024 | ✅ nta.ac.in ExamPaper (code T1) | ✅ NTA Notice_20240726171027 (revised per Supreme Court order, 23.07.2024) |
| NEET (UG) | 2025 | ✅ nta.ac.in ExamPaper (code 45) | ✅ NTA CDN 2025/06/2025061450.pdf | ✅ NTA (2023 S1/S2, 2024 S1/S2, 2025 S1/S2) |
| JEE Main | 2021–2022 | ❌ candidate login → student-shared official PDFs | 🟡 to collect |
| JEE Main | 2019–2020 | 🟡 NTA published; now only on the Internet Archive (jeemain.nta.nic.in FileHandler files) | 🟡 Archive |
| JEE Main | 2014, 2016, 2017 | 🟡 CBSE published sets; Internet Archive (jeemain.nic.in) | 🟡 Archive |
| NEET UG | 2020 | ✅ NTA site — all codes and languages | 🟡 to collect |
| NEET UG | 2021, 2022, 2024, 2026 | 🟡 student copies / Archive | ✅ NTA |
| NEET UG | 2013–2019, 2023, 2025 | 🟡 to collect | 🟡 to collect |

## Done

| Paper | Questions | Notes |
|---|---|---|
| JEE Main 2026 · 2 Apr · Shift 1 | 75 | all 75 answers = NTA final key |


## Status after PR #34 (17 Nov 2026)

| Exam | Year | Have | Missing (why) |
|---|---|---|---|
| JEE Main | 2026 | S1: 10/10 (blank response sheets, collegepravesh Drive) · S2: 9/9 | — |
| JEE Main | 2025 | S1: 10/10 (response sheets) · S2: 8/9 | 4 Apr S1 (NTA file missing images) |
| JEE Main | 2024 | S1: 8/10 · S2: 10/10 | 27 Jan S2, 29 Jan S2 (only prepp re-typed copies — not usable) |
| JEE Main | 2023 | S2: 12/12 | S1 (Jan/Feb 2023): no official copy found |
| JEE Main | 2022 | 24/24 | — |
| JEE Main | 2021 | 24/26 | 16 Mar S1, 31 Aug S2 (+ 20/27 Jul: not verified) |
| JEE Main | 2020 | Sep: 8/10 | 5 Sep S2, 6 Sep S1; January 2020: not verified |
| JEE Main | 2019 | 0 | official papers not found (archive.org unreachable from the build machine) |
| NEET (UG) | 2020–2025 | 2020, 2021, 2023, 2024, 2025 | 2022 + 2019 (no official booklet found), 2023 Manipur (6 Jun) + 2024 re-test (23 Jun): no official booklet |

### 18 Nov 2026 — founder-sent copies checked and rejected
97 JEE PDFs sent by the founder (2019, 2020 Jan + Sep, 2021, 2023 Jan, 2024 Jan, 2025 Apr, 2026 Jan) are
**reconstructions** (PDF metadata "reconstructed question paper", no Question / Option IDs). Their question
and option order does not match NTA's key, so they cannot carry NTA's answers. The gaps above stay open.
What works: NTA's own PDF with printed Question IDs, or a candidate response sheet with IDs, whose IDs match
NTA's final key (Internet Archive copies of jeemain.nta.nic.in / nta.ac.in, collegepravesh-style Drive sheets).
