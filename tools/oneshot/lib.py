"""
OneShot content toolkit (batch 2+).

Every chapter file builds DOC with F/X/T and declares:
  SYLLABUS : list of (NTA syllabus point, [keywords that MUST appear in the page])
Every worked example passes `checks`: (computed_by_python, text_that_must_appear_in_solution).
`build()` refuses to write a chapter if any check fails.
"""
import json, math, os, re

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "backend", "content", "oneshot")
VERIFIED_ON = "2026-11-13"


def F(name, formula, when, mistake=None, unit=None, tag=None):
    d = {"name": name, "formula": formula, "when": when}
    if unit: d["unit"] = unit
    if mistake: d["mistake"] = mistake
    if tag: d["tag"] = tag
    return d


class Ex(dict):
    pass


def X(title, problem, solution, checks=()):
    """checks: iterable of (computed_value_str, must_appear_in_solution_str).
    computed_value_str is produced by Python (e.g. sig(…)); it must equal the
    shown string, and the shown string must be in the solution text."""
    e = Ex(title=title, problem=problem, solution=solution)
    e.checks = list(checks)
    return e


def T(title, explain):
    return {"title": title, "explain": explain}


def sig(x, n=2):
    """Format to n significant figures, scientific style used in our text: 1.1 × 10⁻³"""
    if x == 0: return "0"
    e = int(math.floor(math.log10(abs(x))))
    m = round(x / 10 ** e, n - 1)
    if abs(m) >= 10: m /= 10; e += 1
    ms = f"{m:.{n-1}f}"
    if e == 0: return ms
    sup = str(e).translate(str.maketrans("-0123456789", "⁻⁰¹²³⁴⁵⁶⁷⁸⁹"))
    return f"{ms} × 10{sup}"


def fx(x, d=2):
    """Plain fixed decimals, trailing zeros trimmed."""
    s = f"{x:.{d}f}"
    if "." in s: s = s.rstrip("0").rstrip(".")
    if s == "-0": return "0"
    return s.replace("-", "−")


def _text(doc):
    parts = [doc["title"], *doc["summary"], *doc["ratta"]]
    for f in doc["formulas"]: parts += [f["name"], f["formula"], f["when"], f.get("mistake", ""), f.get("unit", "")]
    for x in doc["examples"]: parts += [x["title"], x["problem"], x["solution"]]
    for t in doc["topics"]: parts += [t["title"], t["explain"]]
    return "\n".join(parts)


def build(doc, syllabus):
    errors = []
    # 1. every example check
    for x in doc["examples"]:
        for computed, shown in getattr(x, "checks", []):
            if computed != shown:
                errors.append(f"[{x['title']}] computed {computed!r} ≠ shown {shown!r}")
            if shown not in x["solution"]:
                errors.append(f"[{x['title']}] {shown!r} not in solution text")
    # 2. syllabus coverage
    text = _text(doc).lower()
    for point, kws in syllabus:
        miss = [k for k in kws if k.lower() not in text]
        if miss: errors.append(f"syllabus '{point}' missing words {miss}")
    # 3. hygiene
    raw = json.dumps(doc, ensure_ascii=False)
    for bad in ["\\u", "TODO", "??", "  .", "NCERT"]:
        if bad in raw: errors.append(f"hygiene: {bad!r} present")
    if len(doc["formulas"]) < 8: errors.append("too few formulas for a full OneShot")
    if len(doc["examples"]) < 5: errors.append("too few examples")
    if len(doc["topics"]) < 6: errors.append("too few topics")
    if errors:
        raise SystemExit(f"\n✗ {doc['slug']}:\n  " + "\n  ".join(errors))
    out = dict(doc)
    out["examples"] = [dict(x) for x in doc["examples"]]
    out["verifiedOn"] = VERIFIED_ON
    with open(os.path.join(OUT, doc["slug"] + ".json"), "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)
        fh.write("\n")
    n_checks = sum(len(getattr(x, "checks", [])) for x in doc["examples"])
    print(f"✓ {doc['slug']}: {len(doc['formulas'])} formulas, {len(doc['examples'])} examples "
          f"({n_checks} numeric checks), {len(doc['topics'])} topics, {len(syllabus)} syllabus points covered")
