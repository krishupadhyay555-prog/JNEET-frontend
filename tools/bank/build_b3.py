"""Build batch 3:  python3 tools/bank/build_b3.py
Writes backend/seed/questions/<subject>-<exam>-batch3.json and prints a report.
Questions that already exist in the bank (exact or near-duplicate, same detector as
audit_bank.py) are dropped from batch 3 — the old copy is kept."""
import os, sys, json, collections
sys.path.insert(0, os.path.dirname(__file__))
import qlib, audit_bank as A
import b3_physics, b3_chemistry, b3_biology, b3_maths  # noqa: F401  (each registers its questions)

files, skipped = qlib.write_all()
allf = A.load()
remove, _ = A.find_duplicates(allf)
assert not any("batch3" not in fn for fn, _ in remove), "old bank files would change — run audit_bank.py first"
for fn in files:
    keep = [q for i, q in enumerate(allf[fn]) if (fn, i) not in remove]
    skipped += [q["questionText"] for i, q in enumerate(allf[fn]) if (fn, i) in remove]
    files[fn] = keep
    with open(os.path.join(A.ROOT, fn), "w") as fh:
        fh.write(json.dumps(keep, indent=2, ensure_ascii=False) + "\n")

tot, cat, diff = collections.Counter(), collections.Counter(), collections.Counter()
for qs in files.values():
    for q in qs:
        c = qlib.CAT[(q["examMode"], q["questionText"])]
        tot[(q["examMode"], q["subject"])] += 1; cat[(q["examMode"], q["subject"], c)] += 1; diff[q["difficulty"]] += 1
for k in sorted(tot):
    print(f"{k[0]:4} {k[1]:11} {tot[k]:4}  " + ", ".join(f"{c} {cat[(k[0], k[1], c)]}" for c in qlib.CATS if cat[(k[0], k[1], c)]))
n = sum(tot.values())
print(f"TOTAL {n} | tough {diff['tough']} ({100*diff['tough']/n:.0f}%), moderate {diff['moderate']}, easy {diff['easy']}")
print(f"dropped as already in bank: {len(skipped)}")
for s_ in skipped: print("   -", s_[:100])
