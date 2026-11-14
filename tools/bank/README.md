# Question bank tools

* `audit_bank.py` — finds duplicates (exact / reworded / same-template clones) and holds the
  list of wrong answer keys that were re-solved by hand (`FIXES`). `--apply` writes the changes.
  Safe to re-run: it reports 0 once the bank is clean.
* `build_b3.py` — builds batch 3 (`*-batch3.json`) from `b3_physics.py`, `b3_chemistry.py`,
  `b3_biology.py`, `b3_maths.py`. Numericals are computed in code (maths answers are
  checked with sympy), options must be distinct, chapters must be current NTA chapters,
  and anything already in the bank is dropped.

After merging, the founder runs `node seed/seedQuestions.js --prune` (dry run) and then
`node seed/seedQuestions.js --prune --yes` from `backend/` so removed duplicates and fixed
keys reach the live database.
