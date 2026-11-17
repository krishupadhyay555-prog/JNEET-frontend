"""JEE Main 2022 question papers (NTA's "ItemCode" / "Item No" format, answers by option letter).

Two printings, both handled:
  Session 1:  "Q: 1"  /  "Topic Name: Mathematics-Section A"  /  "ItemCode: 101661"
  Session 2:  "Item No: 1"  /  "Topic: Mathematics-Section A"  /  "Question ID: 100101"  /  "Question Type: MCQ"
then the question image(s) and options labelled A, B, C, D (one image per option, to the right
of its label). Section B (numerical) questions have no options.

layout(pdf) -> (doc, {n: {"qid", "type": "MCQ"|"SA", "subject", "q": [xref…], "opts": {"A": [xref…], …}}})
parse_paper(pdf) -> [{n, qid, type, opts: ["A","B","C","D"], subject}]  (same shape as ntaparse)
"""
import re
import pymupdf


def _rows(page):
    rows = []
    for b in page.get_text("dict")["blocks"]:
        if b["type"] != 0:
            continue
        for l in b["lines"]:
            t = " ".join(s["text"] for s in l["spans"]).replace("\xa0", " ").strip()
            if t:
                rows.append((l["bbox"][1], l["bbox"][0], t))
    return rows


def layout(pdf):
    doc = pymupdf.open(pdf)
    out, cur, target, expect_qid = {}, None, None, False
    pending = None   # Session 2 prints "Topic:" BEFORE "Item No:" — it belongs to the next question
    for pno, page in enumerate(doc):
        ev = [(y, 0, x, t) for y, x, t in _rows(page)]
        for i in page.get_image_info(xrefs=True):
            b = i["bbox"]
            ev.append(((b[1] + b[3]) / 2, 1, b[0], i["xref"]))
        for y, kind, x, v in sorted(ev, key=lambda e: (e[0], e[1])):
            if kind == 1:
                if cur is None or target is None:
                    continue
                if target == "q":
                    out[cur]["q"].append(v)
                else:
                    out[cur]["opts"][target].append(v)
                continue
            m = re.fullmatch(r"(?:Q:|Item No:)\s*(\d+)", v)
            if m or v == "Item No:":
                if m:
                    cur = int(m.group(1))
                else:
                    cur = "pending"
                out_n = cur
                if cur != "pending":
                    if cur in out:  # a second copy of the same question (should not happen)
                        cur, target = None, None
                        continue
                    out[cur] = {"qid": None, "type": "SA", "subject": pending, "q": [], "opts": {}}
                    pending = None
                target, expect_qid = "q", True
                continue
            if cur == "pending" and re.fullmatch(r"\d{1,3}", v):
                cur = int(v)
                out[cur] = {"qid": None, "type": "SA", "subject": pending, "q": [], "opts": {}}
                pending = None
                continue
            m = re.fullmatch(r"(?:Topic(?: Name)?:\s*)?((?:Mathematics|Physics|Chemistry)-Section [AB])", v)
            if m:
                # before this question's id (Session 1 order) -> this question; after it -> the next one
                if cur not in (None, "pending") and out[cur]["qid"] is None:
                    out[cur]["subject"] = m.group(1)
                else:
                    pending = m.group(1)
                continue
            if cur is None or cur == "pending" or v.startswith("Topic"):
                continue
            q = out[cur]
            m = re.fullmatch(r"(?:ItemCode|Question ID):\s*(\d+)", v)
            if m:
                q["qid"] = m.group(1); continue
            if expect_qid and q["qid"] is None and re.fullmatch(r"\d{4,}", v):
                q["qid"] = v; continue
            m = re.fullmatch(r"(?:Question Type:)?\s*(MCQ|SA)", v)
            if m:
                q["type"] = m.group(1); continue
            m = re.fullmatch(r"([ABCD]):?", v)
            if m and x < 60:
                target = m.group(1); q["opts"].setdefault(target, []); q["type"] = "MCQ"
                continue
    return doc, out


def parse_paper(pdf):
    _, lay = layout(pdf)
    return [dict(n=n, qid=v["qid"], type=v["type"], opts=list(v["opts"]) if v["type"] == "MCQ" else [],
                 subject=(v["subject"] or "").split("-")[0] or None) for n, v in sorted(lay.items())]


def meta(pdf):
    t = pymupdf.open(pdf)[0].get_text().replace("\xa0", " ")
    m = re.search(r"Test Date\s*(\d\d)-(\d\d)-(\d{4}).*?SLOT\s*-\s*(\d)", t, re.S)
    if m:
        return f"{m.group(1)}.{m.group(2)}.{m.group(3)}", m.group(4)
    m = re.search(r"Exam Date:\s*(\d+) (\w+) (\d{4}).*?Exam Shift:\s*(\d)", t, re.S)
    if not m:
        return None  # header not printed: the date/shift comes from the key match
    mon = {"June": "06", "July": "07"}
    return f"{int(m.group(1)):02d}.{mon[m.group(2)]}.{m.group(3)}", m.group(4)
