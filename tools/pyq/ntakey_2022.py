"""JEE Main 2022 (Session 1 = June, Session 2 = July) — NTA final key + question paper readers.

The 2022 files use their own layouts, which ntaparse / ntakey_cols / ntaimages do not read:

  KEY  "JEE - 2022 (Session N) - PROVISIONAL FINAL KEY  B.E/B.Tech.(Paper I)"  (NTA's title for the
       final key), one page per shift, "Exam Date : 24.06.2022 ... Shift : 1" (Session 2 prints
       25-07-2022), two columns of  Question ID | Correct Option ID.
       Session 1 prints MCQ answers as letters A-D, Session 2 as 1-4. Both are returned as the
       option's position "1".."4" (A = 1 … D = 4), which is the option id used by parse_paper/layout
       below. Numerical answers are returned as printed.
  PAPER Session 1: "Q: 1  Topic Name: Mathematics-Section A / ItemCode: 101661 / Question: / A B C D"
        Session 2: "Topic: Mathematics-Section A / Item No: 1 / Question ID: 100101 /
                    Question Type: MCQ | Numeric Answer / Question: / A: B: C: D:"
        Question and options are NTA's embedded images; each option image sits on the line of its
        A/B/C/D label.

parse(pdf)        -> {(date 'DD.MM.YYYY', shift '1'/'2'): {qid: answer}}
                     answer: '1'..'4' (MCQ), number, 'a,b' (several accepted), 'Dropped'.
parse_paper(pdf)  -> [dict(n, qid, type 'MCQ'/'SA', opts ['1','2','3','4'] or [], subject, sec)]
layout(pdf)       -> (doc, {n: {"qid", "type", "q": [xref…], "opts": {"1": [xref…], …}, "warn": [...]}})
                     same shape as ntaimages.layout, so ntaimages.to_image / widths work on it.
"""
import hashlib, re, subprocess, sys
import pymupdf

LETTER = {"A": "1", "B": "2", "C": "3", "D": "4"}
NUM = r"-?\d+(?:\.\d+)?"
PAIR = re.compile(r"(\d{3,})\s+(Drop(?:ped)?|[A-D](?:\s*(?:,|or|OR|&)\s*[A-D])*|" + NUM + r"(?:\s*(?:,|or|OR|&)\s*" + NUM + r")*)(?=\s|$)")


def parse(pdf):
    t = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True).stdout
    out = {}; cur = None
    for line in t.splitlines():
        m = re.search(r"Exam Date\s*:\s*(\d{2})[.\-/](\d{2})[.\-/](\d{4})\s+Shift\s*:\s*(\d)", line)
        if m:
            cur = (f"{m.group(1)}.{m.group(2)}.{m.group(3)}", m.group(4)); out.setdefault(cur, {}); continue
        if cur is None or not re.match(r"^\s*\d{3,}\s", line):
            continue
        s = line.strip()
        while s:
            m = PAIR.match(s)
            if not m:
                raise ValueError(f"{cur}: cannot read key line {line.strip()!r}")
            q, a = m.group(1), m.group(2)
            if a.lower().startswith("drop"):
                a = "Dropped"
            else:
                vals = [v for v in re.split(r"\s*(?:,|or|OR|&)\s*", a) if v]
                a = ",".join(LETTER.get(v, v) for v in vals)
            if q in out[cur] and out[cur][q] != a:
                raise ValueError(f"{cur}: question {q} printed twice with different answers")
            out[cur][q] = a
            s = s[m.end():].lstrip()
    return out


HDR1 = re.compile(r"^Q\s*:\s*(\d+)\b")                           # Session 1: "Q: 12"
TOPIC = re.compile(r"Topic(?: Name)?\s*:\s*(Mathematics|Physics|Chemistry)\s*-\s*Section\s*([AB])")
ITEMNO = re.compile(r"^Item No\s*:\s*(\d+)\b")                      # Session 2
QID = re.compile(r"(?:ItemCode|Question\s*ID)\s*:\s*(\d+)\b")
QTYPE = re.compile(r"Question\s*Type\s*:\s*(MCQ|Numeric Answer|\w+)")
OPT = re.compile(r"^([A-D]):?$")


def _events(doc):
    ev = []
    for pno, page in enumerate(doc):
        for b in page.get_text("dict")["blocks"]:
            if b["type"] != 0:
                continue
            # one event per line, plus one per block (headers wrap: "Question\nID:\n100101")
            lines = [(l["bbox"], " ".join(s["text"] for s in l["spans"]).strip()) for l in b["lines"]]
            whole = " ".join(t for _, t in lines).strip()
            ev.append((pno, b["bbox"][1], 0, "B", (b["bbox"], re.sub(r"\s+", " ", whole))))
            for bb, t in lines:
                ev.append((pno, bb[1], 0, "L", (bb, t)))
        for info in page.get_image_info(xrefs=True):
            ev.append((pno, info["bbox"][1], 1, "I", (info["bbox"], info["xref"])))
    ev.sort(key=lambda e: (e[0], e[1], e[2]))
    return ev


def _regions(doc):
    """Split the paper into questions: header fields, labels and images of each, in reading order."""
    qs = {}; order = []; cur = None; topic = None
    for pno, y, _, kind, val in _events(doc):
        if kind == "B":
            bb, t = val
            m = TOPIC.search(t)
            if m:
                topic = (m.group(1), m.group(2))
            m1 = HDR1.match(t); m2 = ITEMNO.match(t)
            if m1 or m2:
                n = int((m1 or m2).group(1))
                if n in qs:                      # a second copy (other language): keep the first
                    cur = None; continue
                cur = qs[n] = dict(n=n, qid=None, type=None, subject=topic[0] if topic else None,
                                   sec=topic[1] if topic else None, labels=[], imgs=[])
                order.append(n)
            if cur is None:
                continue
            if TOPIC.search(t) and cur["qid"] is None:   # header split over a page break
                cur["subject"], cur["sec"] = topic
            m = QID.search(t)                    # may share a block with other fields
            if m and cur["qid"] is None:
                cur["qid"] = m.group(1)
            m = QTYPE.search(t)
            if m and cur["type"] is None:
                cur["type"] = m.group(1).strip()
        elif kind == "L":
            bb, t = val
            if cur is not None and OPT.match(t) and bb[0] < 40:
                cur["labels"].append((OPT.match(t).group(1), pno, bb))
        else:
            if cur is not None:
                cur["imgs"].append((pno, val[0], val[1]))
    return [qs[n] for n in order]


def layout(pdf):
    doc = pymupdf.open(pdf)
    out = {}; digest = {}
    for r in _regions(doc):
        warn = []
        labels = r["labels"]
        letters = [l[0] for l in labels]
        mcq = bool(labels)
        if mcq and letters != ["A", "B", "C", "D"]:
            warn.append(f"option labels {letters}")
        opts = {LETTER[l]: [] for l in letters if l in LETTER}
        q = []; last = None; seen = set()
        for pno, bb, x in r["imgs"]:
            # NTA sometimes draws one image twice (same spot, or clipped at a page foot and again on
            # the next page): keep one copy
            if x not in digest:
                digest[x] = hashlib.md5(doc.extract_image(x)["image"]).hexdigest()
            if digest[x] in seen:
                continue
            seen.add(digest[x])
            hit = None
            for l, lp, lb in labels:
                if lp == pno and bb[1] - 2 <= lb[3] and lb[1] <= bb[3] + 2:   # image on the label's line
                    hit = LETTER[l]; break
            if hit:
                opts[hit].append(x); last = hit
            elif last is None:
                q.append(x)
            else:
                opts[last].append(x); warn.append(f"extra image after option {last}")
        typ = "MCQ" if mcq else "SA"
        if r["type"] and (("MCQ" in r["type"]) != mcq):
            warn.append(f"printed type {r['type']!r} but options found={mcq}")
        out[r["n"]] = {"qid": r["qid"], "type": typ, "q": q, "opts": opts, "warn": warn}
    return doc, out


def parse_paper(pdf):
    doc = pymupdf.open(pdf)
    qs = []
    for r in _regions(doc):
        letters = [l[0] for l in r["labels"]]
        typ = "MCQ" if letters else "SA"
        qs.append(dict(n=r["n"], qid=r["qid"], type=typ, opts=[LETTER[l] for l in letters if l in LETTER],
                       subject=r["subject"], sec=r["sec"]))
    return qs


def header(pdf):
    """(date 'DD.MM.YYYY', shift, language, paper) as printed on page 1."""
    t = pymupdf.open(pdf)[0].get_text()
    t = re.sub(r"\s+", " ", t)
    mon = {"June": "06", "July": "07"}
    d = re.search(r"Test Date (\d{2})-(\d{2})-(\d{4})", t) or re.search(r"Exam Date: (\d{1,2}) (June|July) (\d{4})", t)
    date = None
    if d:
        a, b, c = d.groups(); date = f"{int(a):02d}.{mon.get(b, b)}.{c}"
    s = re.search(r"(?:Slot SLOT - |Exam Shift: )(\d)", t)
    lang = re.search(r"(?:Lang|Langauge:) (\w+)", t)
    paper = re.search(r"(?:Paper Name|Paper:) (\S+)", t)
    return date, s and s.group(1), lang and lang.group(1), paper and paper.group(1)


if __name__ == "__main__":
    for f in sys.argv[1:]:
        k = parse(f)
        for s, d in k.items():
            odd = {q: a for q, a in d.items() if "," in a or a == "Dropped"}
            print(s, len(d), odd)
