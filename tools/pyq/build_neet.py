"""
JNEET+ AI — NEET (UG) PYQ builder (NTA's scanned question booklets).

Each question is cut from NTA's own booklet scan (question + its 4 printed options, nothing
re-typed) and its answer comes from NTA's FINAL answer key for the same test-booklet code.
neetscan.py reads every question number back with OCR; if the count or the numbering is off,
the build stops (so an answer can never shift to the wrong question).

Spec: tools/pyq/papers_neet/<id>.json
  { "id", "exam": "NEET", "year", "date", "title", "paperPdf", "keyPdf", "keyDate", "code",
    "count": 180|200,
    "subjects": [["Physics", 1, 45], ["Chemistry", 46, 90], ["Biology", 91, 180]],
    "chapters": {"1": "…"}, "oldSyllabus": {"n": "topic"}, "explanations": {},
    "ocrChecked": {"79": "read as 719 by OCR; checked by eye"} }

Usage: python3 tools/pyq/build_neet.py <id> … | --all | --sheets <id>
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import neetscan, neetkey  # noqa: E402
from build import fetch, CHAPTERS, OUT, PUB  # noqa: E402
from build_img import quantize, OLD_CHAPTER  # noqa: E402

SPEC = HERE / "papers_neet"
DPI = 200


def export(spec):
    pdf = fetch(spec["paperPdf"])
    doc, qs, problems = (neetscan.layout_text if spec.get("textLayer") else neetscan.layout)(pdf, spec["count"])
    ok = spec.get("ocrChecked", {})
    problems = [p for p in problems if not (isinstance(p[0], int) and str(p[0]) in ok)]
    if problems:
        raise SystemExit(f"{spec['id']}: numbering problems {problems[:10]}")
    out = PUB / spec["id"]
    out.mkdir(parents=True, exist_ok=True)
    widths = {}
    for q in qs:
        im = neetscan.to_image(doc, q["parts"], DPI)
        if im is None:
            raise SystemExit(f"{spec['id']}: Q{q['n']} is empty")
        quantize(im).save(out / f"q{q['n']}.webp", "WEBP", lossless=True, method=6)
        widths[q["n"]] = round(im.width * 72 / DPI)
    return qs, widths


def subject_of(spec, n):
    for name, a, b in spec["subjects"]:
        if a <= n <= b:
            return name
    raise SystemExit(f"{spec['id']}: Q{n} has no subject range")


def sheets(pid, per=6):
    from PIL import Image, ImageDraw
    spec = json.loads((SPEC / f"{pid}.json").read_text())
    qs, _ = export(spec)
    d = HERE / ".cache" / "sheets" / pid
    d.mkdir(parents=True, exist_ok=True)
    ns = [q["n"] for q in qs]
    for s in range(0, len(ns), per):
        tiles = []
        for n in ns[s:s + per]:
            p = Image.open(PUB / pid / f"q{n}.webp").convert("L")
            t = Image.new("L", (p.width, p.height + 24), 255)
            ImageDraw.Draw(t).text((4, 4), f"Q{n}  [{subject_of(spec, n)}]", fill=0)
            t.paste(p, (0, 24)); tiles.append(t)
        W = max(t.width for t in tiles); H = sum(t.height + 16 for t in tiles)
        sheet = Image.new("L", (W, H), 255); y = 0
        for t in tiles:
            sheet.paste(t, (0, y)); y += t.height + 16
        sheet.save(d / f"sheet-{s // per + 1:02d}.png")
    print(f"sheets in {d}")


def build(pid):
    spec = json.loads((SPEC / f"{pid}.json").read_text())
    errs = []
    qs, widths = export(spec)
    keys = neetkey.parse(fetch(spec["keyPdf"]))
    key = keys.get((spec["keyDate"], spec["code"]))
    if not key or len(key) != spec["count"]:
        raise SystemExit(f"{pid}: key for {spec['keyDate']} {spec['code']} missing or incomplete")
    chapters = spec.get("chapters", {})
    old = spec.get("oldSyllabus", {})
    expl = spec.get("explanations", {})
    items = []
    for q in qs:
        n = q["n"]
        subject = subject_of(spec, n)
        ch = chapters.get(str(n))
        if str(n) in old:
            ch = OLD_CHAPTER
        elif ch not in CHAPTERS.get(("NEET", subject), set()):
            errs.append(f"Q{n}: chapter missing/unknown: {ch!r} ({subject})")
        ans = key[n]
        item = dict(n=n, subject=subject, chapter=ch, **({"oldSyllabus": old[str(n)]} if str(n) in old else {}),
                    text="", qimg=f"q{n}.webp", qimgW=widths[n], explanation=expl.get(str(n), ""),
                    type="mcq", options=["", "", "", ""], optionsInImage=True)
        if ans == "Dropped":
            status, correct = "dropped", []
        else:
            correct = [int(a) - 1 for a in ans.split(",")]
            status = "multi" if len(correct) > 1 else "ok"
        item.update(correct=correct, status=status, verified=True)
        items.append(item)
    if errs:
        print(f"✗ {pid}: {len(errs)} problem(s)"); [print("   ", x) for x in errs[:40]]
        return False
    doc = {k: spec[k] for k in ("id", "exam", "year", "date", "title")}
    doc.update(session=None, shift=None, code=spec["code"],
               source=("NTA question booklet (original PDF)" if spec.get("textLayer") else "NTA question booklet (original scan)")
               + " + NTA final answer key",
               paperPdf=spec["paperPdf"], keyPdf=spec["keyPdf"],
               counts={s: sum(1 for i in items if i["subject"] == s) for s in dict.fromkeys(i["subject"] for i in items)},
               questions=items)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{pid}.json").write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n")
    st = {s: sum(1 for i in items if i["status"] == s) for s in ("dropped", "multi")}
    print(f"✓ {pid}: {len(items)} questions (NTA booklet, code {spec['code']}), answers = NTA final key"
          + (f"; NTA changes {st}" if any(st.values()) else ""))
    return True


if __name__ == "__main__":
    a = sys.argv[1:]
    if a and a[0] == "--sheets":
        [sheets(p) for p in a[1:]]
        sys.exit(0)
    if a == ["--all"]:
        a = sorted(p.stem for p in SPEC.glob("*.json"))
    sys.exit(0 if all([build(p) for p in a]) else 1)
