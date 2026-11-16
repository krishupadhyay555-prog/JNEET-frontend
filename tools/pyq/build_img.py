"""
JNEET+ AI — PYQ builder for "official image" papers (fast path, founder 16 Nov 2026).

The question and its options are shown exactly as NTA printed them (NTA's own
embedded images, cut per question / per option) — nothing is re-typed, so
nothing can be mistyped. The answer is NTA's FINAL answer key, matched by
Question ID → Option ID. We add the chapter (and, over time, our explanation).

Spec file: tools/pyq/papers_img/<id>.json
  { "id", "exam", "year", "session", "date", "shift", "title",
    "paperPdf", "keyPdf", "keyDate", "keyShift",          # keyShift as printed in the key
    "chapters": {"1": "Sets, Relations and Functions", …},  # every question
    "explanations": {"1": "…"} }                             # optional, our own

Usage: python3 tools/pyq/build_img.py <id> [<id> …] | --all
       python3 tools/pyq/build_img.py --sheets <id>   # contact sheets for chapter tagging
"""
import json
import pymupdf, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import ntaparse, ntakey_cols, ntaimages  # noqa: E402
from build import fetch, CHAPTERS, SUBJ, katex_check, OUT, PUB  # noqa: E402

SPEC = HERE / "papers_img"


def quantize(im):
    """Lossless WebP-friendly image: pure black/white for text and line drawings (~2 KB),
    4 grey levels when the figure has real grey fill (shaded regions, graphs)."""
    h = im.histogram()
    mid = sum(h[100:230]) / max(1, sum(h))
    if mid > 0.03:
        return im.point(lambda v: 0 if v < 64 else 96 if v < 128 else 176 if v < 200 else 255)
    return im.point(lambda v: 255 if v > 160 else 0)


def export(spec):
    pdf = fetch(spec["paperPdf"])
    doc, lay = ntaimages.layout(pdf)
    out = PUB / spec["id"]
    out.mkdir(parents=True, exist_ok=True)
    for n, v in lay.items():
        im = ntaimages.to_image(doc, v["q"])
        if im is None:
            raise SystemExit(f"{spec['id']}: Q{n} has no question image")
        quantize(im).save(out / f"q{n}.webp", "WEBP", lossless=True, method=6)
        for k, xs in enumerate(v["opts"].values(), 1):
            im = ntaimages.to_image(doc, xs)
            if im is None:
                raise SystemExit(f"{spec['id']}: Q{n} option {k} has no image")
            quantize(im).save(out / f"q{n}o{k}.webp", "WEBP", lossless=True, method=6)
    return pdf, lay


def sheets(pid, per=6):
    """Contact sheets (question + options) to tag chapters by eye: .cache/sheets/<id>/sheet-XX.png"""
    from PIL import Image, ImageDraw
    spec = json.loads((SPEC / f"{pid}.json").read_text())
    pdf, lay = export(spec)
    d = HERE / ".cache" / "sheets" / pid
    d.mkdir(parents=True, exist_ok=True)
    ns = sorted(lay)
    for s in range(0, len(ns), per):
        tiles = []
        for n in ns[s:s + per]:
            parts = [Image.open(PUB / pid / f"q{n}.webp").convert("L")]
            k = 1
            while (PUB / pid / f"q{n}o{k}.webp").exists():
                parts.append(Image.open(PUB / pid / f"q{n}o{k}.webp").convert("L")); k += 1
            W = max(p.width for p in parts); H = sum(p.height for p in parts) + 30
            t = Image.new("L", (W, H), 255); dr = ImageDraw.Draw(t); dr.text((4, 4), f"Q{n}", fill=0)
            y = 24
            for p in parts:
                t.paste(p, (0, y)); y += p.height
            tiles.append(t)
        W = max(t.width for t in tiles); H = sum(t.height + 16 for t in tiles)
        sheet = Image.new("L", (W, H), 255); y = 0
        for t in tiles:
            sheet.paste(t, (0, y)); y += t.height + 16
        sheet.save(d / f"sheet-{s // per + 1:02d}.png")
    print(f"sheets in {d}")


def build(pid):
    spec = json.loads((SPEC / f"{pid}.json").read_text())
    errs = []
    pdf, lay = export(spec)
    paper = {q["n"]: q for q in ntaparse.parse_paper(pdf)}
    pts = ntaimages.widths(pymupdf.open(pdf))
    wpt = lambda xs: round(max(pts[x] for x in xs))
    if spec.get("keyFormat") == "cols":
        place = spec.get("keyPlace", "DOMESTIC")
        keys = {(d, sh): v for (d, sh, pl), v in ntakey_cols.parse(fetch(spec["keyPdf"])).items() if pl == place}
    else:
        keys = ntaparse.parse_key(fetch(spec["keyPdf"]))
    key = keys.get((spec["keyDate"], spec["keyShift"]))
    if not key:
        raise SystemExit(f"{pid}: {spec['keyDate']} {spec['keyShift']} not in key; have {list(keys)}")
    chapters = {int(k): v for k, v in spec.get("chapters", {}).items()}
    expl = {int(k): v for k, v in spec.get("explanations", {}).items()}
    qs = []
    for n in sorted(paper):
        pq, lq = paper[n], lay.get(n)
        e = lambda m: errs.append(f"Q{n}: {m}")
        if lq is None or lq["qid"] != pq["qid"]:
            e("image layout and text layout disagree"); continue
        subject = SUBJ[pq["subject"]]
        ans = key.get(pq["qid"])
        if ans is None:
            e("question id not in NTA key"); continue
        ch = chapters.get(n)
        if ch not in CHAPTERS.get((spec["exam"], subject), set()):
            e(f"chapter missing/unknown: {ch!r} ({subject})")
        item = dict(n=n, qid=pq["qid"], subject=subject, chapter=ch, text="", qimg=f"q{n}.webp",
                    qimgW=wpt(lq["q"]), explanation=expl.get(n, ""))
        status = "ok"
        if pq["type"] == "MCQ":
            opt_ids = list(lq["opts"].keys())
            if opt_ids != pq["opts"] or len(opt_ids) != 4:
                e(f"option ids differ: images {opt_ids} vs text {pq['opts']}"); continue
            item.update(type="mcq", options=["", "", "", ""], optImg=[f"q{n}o{k}.webp" for k in range(1, 5)],
                        optImgW=[wpt(xs) for xs in lq["opts"].values()])
            if ans == "Dropped":
                status, item["correct"] = "dropped", []
            elif ans == "ANY":
                status, item["correct"] = "bonus", [0, 1, 2, 3]
            else:
                ids = ans.split(",")
                if not all(i in opt_ids for i in ids):
                    e(f"key option {ans} not among the paper's options"); continue
                item["correct"] = [opt_ids.index(i) for i in ids]
                if len(ids) > 1:
                    status = "multi"
        else:
            item["type"] = "numeric"
            item["answer"] = None if ans in ("Dropped", "ANY") else ans.replace(",", " or ")
            if ans == "Dropped": status = "dropped"
            if ans == "ANY": status = "bonus"
            if "," in ans:
                item["answers"] = ans.split(",")   # NTA accepted any of these values
                status = "multi"
        item["status"] = status
        item["verified"] = True
        qs.append(item)
    if expl:
        for msg, ctx in katex_check(list(expl.values())):
            errs.append(f"KaTeX: {msg} — in: {ctx}")
    if errs:
        print(f"✗ {pid}: {len(errs)} problem(s)"); [print("   ", x) for x in errs[:40]]
        return False
    doc = {k: spec[k] for k in ("id", "exam", "year", "session", "date", "shift", "title")}
    doc.update(source="NTA question paper (original images) + NTA final answer key",
               paperPdf=spec["paperPdf"], keyPdf=spec["keyPdf"],
               **({"paperHost": spec["paperHost"]} if spec.get("paperHost") else {}),
               counts={s: sum(1 for i in qs if i["subject"] == s) for s in dict.fromkeys(i["subject"] for i in qs)},
               questions=qs)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{pid}.json").write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n")
    st = {s: sum(1 for i in qs if i["status"] == s) for s in ("dropped", "bonus", "multi")}
    print(f"✓ {pid}: {len(qs)} questions (official images), answers = NTA final key"
          + (f"; NTA changes {st}" if any(st.values()) else "") + f"; explanations {len(expl)}/{len(qs)}")
    return True


if __name__ == "__main__":
    a = sys.argv[1:]
    if a and a[0] == "--sheets":
        [sheets(p) for p in a[1:]]
        sys.exit(0)
    if a == ["--all"]:
        a = sorted(p.stem for p in SPEC.glob("*.json"))
    sys.exit(0 if all([build(p) for p in a]) else 1)
