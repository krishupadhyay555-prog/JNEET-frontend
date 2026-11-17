"""Parser for NTA's JEE Main 2026 Session 1 FINAL answer key (B.E./B.Tech, "AS ON 16.02.2026"):
one page per shift, "Exam Date : 21.01.2026  Exam Shift : First", three subject columns
(QUESTION ID | CORRECT OPTION ID), first the "(For Centers in India)" pages, then the
"(For Centers Outside India)" pages (different Question IDs). Only the INDIA pages are returned.

Word-coordinate based and column aware (adapted from ntakey_cols.py):
  * column x-ranges come from the three "QUESTION" header words; inside a column the
    Question ID is the word left of the "CORRECT" header, every word right of it is answer text;
  * an answer that does not fit on one line ("a, b," / "c, d") continues on the next line(s)
    with no Question ID; those words belong to the Question ID above them;
  * "Drop" -> "Dropped"; "3 or 6" and "a, b" -> "3,6" / "a,b" (several accepted);
    an answer naming every option ID of the question -> still "a,b,c,d" (build_img marks multi);
  * numerical answers are kept exactly as printed ("00", "09").

Some Question IDs are printed with 9 digits (e.g. 21.01.2026 Second: "860654826"). They are
kept exactly as printed; parse() also returns them, and build_img / verification decide.

parse(pdf) -> {("DD.MM.YYYY", "First"|"Second"): {question_id: answer}}  (India only, 75 per shift)
"""
import re
import sys

import pymupdf

NUM = r"-?\d+(\.\d+)?"


def _page(page):
    words = page.get_text("words")  # x0, y0, x1, y1, word, block, line, wordno
    hy = min(w[1] for w in words if w[4] == "QUESTION")
    qx = sorted(w[0] for w in words if w[4] == "QUESTION" and abs(w[1] - hy) < 3)
    cx = sorted(w[0] for w in words if w[4] == "CORRECT" and abs(w[1] - hy) < 3)
    if len(qx) != 3 or len(cx) != 3:
        raise ValueError(f"page {page.number + 1}: expected 3 columns, got {qx} / {cx}")
    body = [w for w in words if w[1] > hy + 8 and w[1] < page.rect.height - 20
            and not re.fullmatch(r"\(|\)|MATHEMATICS|PHYSICS|CHEMISTRY", w[4])]
    out = {}
    for c in range(3):
        lo = qx[c] - 5
        hi = qx[c + 1] - 5 if c < 2 else 1e9
        col = [w for w in body if lo <= w[0] < hi]
        # rows by y
        col.sort(key=lambda w: (w[1], w[0]))
        rows = []
        for w in col:
            if rows and abs(w[1] - rows[-1][0][1]) < 3:
                rows[-1].append(w)
            else:
                rows.append([w])
        cur = None
        for r in rows:
            r.sort(key=lambda w: w[0])
            qw = [w for w in r if w[0] < cx[c] - 3]
            aw = [w[4] for w in r if w[0] >= cx[c] - 3]
            if qw:
                if len(qw) != 1 or not re.fullmatch(r"\d{9,10}", qw[0][4]):
                    raise ValueError(f"page {page.number + 1} col {c}: bad Question ID cell {[w[4] for w in r]}")
                cur = qw[0][4]
                if cur in out:
                    raise ValueError(f"page {page.number + 1}: Question ID {cur} twice")
                out[cur] = []
            elif cur is None or not out[cur] or not out[cur][-1].endswith(","):
                raise ValueError(f"page {page.number + 1} col {c}: answer text without Question ID {aw}")
            out[cur] += aw
    res = {}
    for q, toks in out.items():
        s = " ".join(toks)
        if re.fullmatch(r"(?i)drop(ped)?", s):
            res[q] = "Dropped"
            continue
        if re.fullmatch(r"(?i)(bonus|any|all)", s):
            res[q] = "ANY"
            continue
        parts = [p for p in re.split(r"\s*,\s*|\s+or\s+|\s+OR\s+", s.strip().rstrip(",")) if p]
        if not parts or not all(re.fullmatch(NUM, p) for p in parts):
            raise ValueError(f"page {page.number + 1}: Question ID {q} has unreadable answer {s!r}")
        res[q] = ",".join(parts)
    return res


def parse(pdf, place="India"):
    """place="India" (default) or "Outside" (the "For Centers Outside India" pages)."""
    doc = pymupdf.open(pdf)
    out = {}
    for page in doc:
        t = page.get_text()
        md = re.search(r"Exam Date\s*:\s*(\d\d\.\d\d\.\d{4})", t)
        ms = re.search(r"Exam Shift\s*:\s*(First|Second)", t)
        if not md or not ms:
            continue
        outside = "Outside India" in t
        if not outside and "Centers in India" not in t:
            raise ValueError(f"page {page.number + 1}: neither India nor Outside India")
        if outside != (place == "Outside"):
            continue
        key = (md.group(1), ms.group(1))
        if key in out:
            raise ValueError(f"{key} printed twice")
        out[key] = _page(page)
    for k, d in out.items():
        if len(d) != 75:
            raise ValueError(f"{k}: {len(d)} entries, expected 75")
    return out


if __name__ == "__main__":
    for f in sys.argv[1:]:
        for k, d in parse(f).items():
            odd = {q: a for q, a in d.items() if "," in a or a in ("Dropped", "ANY")}
            short = sum(1 for q in d if len(q) != 10)
            print(k, len(d), f"{short} short IDs" if short else "", odd)
