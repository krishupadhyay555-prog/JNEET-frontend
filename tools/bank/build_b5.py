"""Build batch 5 (28 Nov 2026):  python3 tools/bank/build_b5.py
Original questions from b5_physics_a/b (NEET + JEE) and b5_maths_a/b (JEE). Writes
backend/seed/questions/physics-batch5.json and mathematics-jee-batch5.json. Anything that
already exists in the bank for that exam (exact, reworded or same-template clone, same detector
as audit_bank.py) is dropped from batch 5 — the old copy is kept."""
import os, sys, json, re, collections
sys.path.insert(0, os.path.dirname(__file__))
import qlib, audit_bank as A
import b5_physics_a, b5_physics_b, b5_maths_a, b5_maths_b  # noqa: F401  (each registers its questions)

FILES = {"Physics": "physics-batch5.json", "Mathematics": "mathematics-jee-batch5.json"}
minus = re.compile(r"(?<![\w^{(\[-])-(?=\d)")          # "= -2" → "= −2" (never inside p-n, e^{-x})
fix = lambda s: minus.sub("−", s)

bank = collections.defaultdict(set)
for fn in os.listdir(A.ROOT):
    if fn.endswith(".json") and fn not in FILES.values():
        for q in json.load(open(os.path.join(A.ROOT, fn))):
            bank[q["examMode"]].add(A.mn(q["questionText"]))
out = collections.defaultdict(list); seen = set(); cat = collections.Counter(); skipped = []
for q in qlib.OUT:
    q = dict(q); c = q.pop("_cat")
    q["questionText"] = fix(q["questionText"]); q["explanation"] = fix(q["explanation"]); q["options"] = [fix(o) for o in q["options"]]
    k = (q["examMode"], A.mn(q["questionText"]))
    assert k not in seen, f"duplicate in batch: {q['questionText'][:80]}"
    seen.add(k)
    if k[1] in bank[q["examMode"]]:
        skipped.append(q["questionText"]); continue
    out[FILES[q["subject"]]].append(q); cat[(q["examMode"], q["subject"], c)] += 1
for fn, qs in out.items():
    with open(os.path.join(A.ROOT, fn), "w") as fh:
        fh.write(json.dumps(qs, indent=2, ensure_ascii=False) + "\n")

# near-duplicates (reworded / clones) against the whole bank → drop the batch-5 copy
allf = A.load()
remove, _ = A.find_duplicates(allf)
assert not any(fn not in FILES.values() for fn, _ in remove if False)
drop = collections.defaultdict(set)
for fn, i in remove:
    if fn in FILES.values():
        drop[fn].add(i)
for fn in out:
    keep = [q for i, q in enumerate(allf[fn]) if i not in drop[fn]]
    skipped += [q["questionText"] for i, q in enumerate(allf[fn]) if i in drop[fn]]
    with open(os.path.join(A.ROOT, fn), "w") as fh:
        fh.write(json.dumps(keep, indent=2, ensure_ascii=False) + "\n")
    print(f"✓ {fn}: {len(keep)} questions")
diff = collections.Counter(q["difficulty"] for fn in out for q in json.load(open(os.path.join(A.ROOT, fn))))
print("difficulty:", dict(diff))
print(f"dropped as already in bank: {len(skipped)}")
for s_ in skipped: print("   -", s_[:110])
