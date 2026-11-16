"""
JNEET+ AI — PYQ builder.

Turns one hand-checked paper file (tools/pyq/papers/<id>.py) into
backend/content/pyq/<id>.json, after proving it against NTA's own files:

  1. Downloads the official question paper PDF and the official FINAL answer
     key PDF (URLs are in PAPER; cached in tools/pyq/.cache, not committed).
  2. Reads every Question ID and Option ID from the paper, and the correct
     Option ID (or numerical value) for each Question ID from the key.
  3. Checks that our worked answer (`mine`) equals NTA's answer for EVERY
     question. A mismatch stops the build — nothing unverified is written.
     Dropped / bonus / several-correct questions are taken from the key.
  4. Checks chapters, text, figures, and that every $…$ math renders in KaTeX.

Usage:  python3 tools/pyq/build.py jee_main_2026_04_02_s1 [more …]
        python3 tools/pyq/build.py --all
"""
import importlib.util, json, os, re, subprocess, sys, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = ROOT / "backend" / "content" / "pyq"
PUB = ROOT / "frontend" / "public" / "pyq"
CACHE = HERE / ".cache"
sys.path.insert(0, str(HERE))
import ntaparse  # noqa: E402

CHAPTERS = {}
for f in (ROOT / "backend" / "content" / "oneshot").glob("*.json"):
    if f.name.endswith(".hinglish.json"):
        continue
    d = json.loads(f.read_text())
    for exam, ch in d["chapters"].items():
        CHAPTERS.setdefault((exam, d["subject"]), set()).add(ch)

SUBJ = {"Mathematics": "Mathematics", "Physics": "Physics", "Chemistry": "Chemistry", "Biology": "Biology",
        "Botany": "Biology", "Zoology": "Biology"}


def fetch(url):
    CACHE.mkdir(exist_ok=True)
    p = CACHE / re.sub(r"[^A-Za-z0-9._-]", "_", url.split("/uploads/")[-1])
    if not p.exists():
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        p.write_bytes(urllib.request.urlopen(req, timeout=120).read())
    return str(p)


def load(name):
    spec = importlib.util.spec_from_file_location(name, HERE / "papers" / f"{name}.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def katex_check(strings):
    """Render every $…$ chunk with KaTeX (throwOnError) — returns a list of errors."""
    chunks = []
    for s in strings:
        if s.count("$") % 2:
            chunks.append(("UNBALANCED $", s[:80]))
            continue
        chunks += [(m, s[:60]) for m in re.findall(r"\$([^$]+)\$", s)]
    js = r"""
const katex = require(process.argv[1]);
const items = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const bad = [];
for (const [tex, ctx] of items) {
  if (tex === 'UNBALANCED $') { bad.push(['unbalanced $', ctx]); continue; }
  try { katex.renderToString(tex, { throwOnError: true, strict: 'ignore' }); }
  catch (e) { bad.push([e.message.slice(0, 120), ctx]); }
}
console.log(JSON.stringify(bad));
"""
    r = subprocess.run(["node", "-e", js, str(ROOT / "frontend" / "node_modules" / "katex")],
                       input=json.dumps(chunks), capture_output=True, text=True)
    if r.returncode:
        raise SystemExit("KaTeX check could not run: " + r.stderr[:300])
    return json.loads(r.stdout)


def build(name):
    m = load(name)
    P, Q = m.PAPER, m.Q
    errs = []
    paper = ntaparse.parse_paper(fetch(P["paperPdf"]))
    keys = ntaparse.parse_key(fetch(P["keyPdf"]))
    key = keys.get((P["keyDate"], P["keyShift"]))
    if not key:
        raise SystemExit(f"{name}: shift {P['keyDate']} {P['keyShift']} not in key; have {list(keys)}")
    by_n = {q["n"]: q for q in paper}
    mine = {q["n"]: q for q in Q}
    if sorted(mine) != sorted(by_n):
        errs.append(f"question numbers differ: ours {len(mine)}, paper {len(by_n)}")

    out_q = []
    for n in sorted(by_n):
        pq, q = by_n[n], mine.get(n)
        if q is None:
            continue
        subject = SUBJ[pq["subject"]]
        ans = key.get(pq["qid"])
        e = lambda msg: errs.append(f"Q{n}: {msg}")
        if ans is None:
            e("question id not in NTA key")
            continue
        if q["ch"] not in CHAPTERS.get((P["exam"], subject), set()):
            e(f"unknown chapter {q['ch']!r} for {P['exam']} {subject}")
        if not q.get("q", "").strip() or not q.get("x", "").strip():
            e("question or explanation missing")
        status = "ok"
        item = dict(n=n, qid=pq["qid"], subject=subject, chapter=q["ch"], text=q["q"], explanation=q["x"])
        if pq["type"] == "MCQ":
            if len(q.get("o", [])) != 4:
                e("needs 4 options")
            item["type"] = "mcq"
            item["options"] = q.get("o", [])
            if ans == "Dropped":
                status = "dropped"; item["correct"] = []
            elif ans == "ANY":
                status = "bonus"; item["correct"] = [0, 1, 2, 3]
            else:
                ids = ans.split(",")
                if not all(i in pq["opts"] for i in ids):
                    e(f"key option {ans} not among paper options")
                    continue
                item["correct"] = [pq["opts"].index(i) for i in ids]
                if len(ids) > 1:
                    status = "multi"
                if q.get("mine") not in [c + 1 for c in item["correct"]]:
                    e(f"our answer {q.get('mine')} ≠ NTA key option {[c + 1 for c in item['correct']]}")
        else:
            item["type"] = "numeric"
            if ans == "Dropped":
                status = "dropped"; item["answer"] = None
            elif ans == "ANY":
                status = "bonus"; item["answer"] = None
            else:
                item["answer"] = ans
                try:
                    ok = abs(float(str(q.get("mine"))) - float(ans)) < 1e-9
                except ValueError:
                    ok = False
                if not ok:
                    e(f"our answer {q.get('mine')} ≠ NTA key {ans}")
        item["status"] = status
        item["verified"] = q.get("verified", True)
        for k in ("fig",):
            if q.get(k):
                if not (PUB / P["id"] / q[k]).exists():
                    e(f"missing figure {q[k]}")
                item[k] = q[k]
        if q.get("optImg"):
            for f in q["optImg"]:
                if not (PUB / P["id"] / f).exists():
                    e(f"missing option figure {f}")
            item["optImg"] = q["optImg"]
        out_q.append(item)

    texts = [i["text"] for i in out_q] + [i["explanation"] for i in out_q] + [o for i in out_q for o in i.get("options", [])]
    for msg, ctx in katex_check(texts):
        errs.append(f"KaTeX: {msg} — in: {ctx}")
    if errs:
        print(f"✗ {name}: {len(errs)} problem(s)")
        for x in errs:
            print("   ", x)
        return False

    doc = {k: P[k] for k in ("id", "exam", "year", "session", "date", "shift", "title")}
    doc.update(
        source="NTA question paper + NTA final answer key",
        paperPdf=P["paperPdf"], keyPdf=P["keyPdf"],
        counts={s: sum(1 for i in out_q if i["subject"] == s) for s in dict.fromkeys(i["subject"] for i in out_q)},
        questions=out_q,
    )
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{P['id']}.json").write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n")
    st = {s: sum(1 for i in out_q if i["status"] == s) for s in ("dropped", "bonus", "multi")}
    unv = sum(1 for i in out_q if not i["verified"])
    print(f"✓ {P['id']}: {len(out_q)} questions, all answers match NTA's final key"
          + (f"; NTA changes: {st}" if any(st.values()) else "") + (f"; {unv} explained from key only" if unv else ""))
    return True


if __name__ == "__main__":
    names = sys.argv[1:]
    if names == ["--all"]:
        names = sorted(p.stem for p in (HERE / "papers").glob("*.py"))
    ok = all([build(n) for n in names])
    sys.exit(0 if ok else 1)
