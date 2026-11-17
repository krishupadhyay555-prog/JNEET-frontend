"""JEE Main candidate RESPONSE-SHEET PDFs (NTA/digialm "Q.1 … Options 1. 2. 3. 4." pages with an
ID box: "Question Type : MCQ / Question ID : … / Option 1 ID : …"). Used when NTA's own master paper
for a shift is not available or is corrupted (JEE Main 2025 Session 1). Only sheets with no
candidate details / no marked responses are used.

The question and option images are NTA's own; question order and option order are the order this
sheet shows (NTA shuffles both per candidate) — every option keeps its NTA option ID, so the
answer from NTA's final key still lands on the right option.

layout(pdf) -> (doc, {n: {"qid", "type", "q": [xref…], "opts": {option_id: [xref…]}, "subject"}})
parse_paper(pdf) -> [{n, qid, type, opts, subject}]  (same shape as ntaparse)
"""
import re
import pymupdf


def layout(pdf):
    doc = pymupdf.open(pdf)
    out, cur, subject = {}, None, None
    for pno, page in enumerate(doc):
        ev = []
        for b in page.get_text("dict")["blocks"]:
            if b["type"] != 0:
                continue
            for l in b["lines"]:
                t = " ".join(s["text"] for s in l["spans"]).strip()
                if t:
                    ev.append(((l["bbox"][1] + l["bbox"][3]) / 2, 0, l["bbox"][0], t))
        for i in page.get_image_info(xrefs=True):
            r = i["bbox"]
            ev.append(((r[1] + r[3]) / 2, 1, r[0], i["xref"]))
        for yc, kind, x, v in sorted(ev, key=lambda e: (e[0], e[1])):
            if kind == 1:
                if cur is None:
                    continue
                q = out[cur]
                if q["_phase"] == "o":
                    q["_oimg"].append((pno, yc, v))
                elif q["_phase"] == "q":
                    q["q"].append(v)
                continue
            m = re.match(r"Section\s*:\s*(Mathematics|Physics|Chemistry)", v)
            if m:
                subject = m.group(1); continue
            m = re.fullmatch(r"Q\.\s*(\d+)", v)
            if m:
                cur = int(m.group(1))
                out[cur] = {"qid": None, "type": None, "q": [], "opts": {}, "subject": subject,
                            "_phase": "q", "_labels": {}, "_oimg": [], "_oid": {}}
                continue
            if cur is None:
                continue
            q = out[cur]
            if v.startswith("Options"):
                q["_phase"] = "o"
                m = re.search(r"([1-4])\.$", v)          # "Options 1." printed on one line
                if m:
                    q["_labels"][int(m.group(1))] = (pno, yc)
                continue
            m = re.fullmatch(r"([1-4])\.", v)
            if m and q["_phase"] == "o":
                q["_labels"][int(m.group(1))] = (pno, yc); continue
            m = re.match(r"Question Type\s*:\s*(\w+)", v)
            if m:
                q["type"] = m.group(1); q["_phase"] = "box"; continue
            m = re.match(r"Question ID\s*:\s*(\d+)", v)
            if m:
                q["qid"] = m.group(1); continue
            m = re.match(r"Option ([1-4]) ID\s*:\s*(\d+)", v)
            if m:
                q["_oid"][int(m.group(1))] = m.group(2); continue
    for n, q in out.items():
        if q["type"] == "MCQ":
            got = {k: [] for k in range(1, 5)}
            if len(q["_oimg"]) == 4:                   # one image per option, printed 1 → 4 top to bottom
                for k, (_, _, x) in enumerate(sorted(q["_oimg"], key=lambda t: (t[0], t[1])), 1):
                    got[k].append(x)
                q["_oimg"] = []
            for pno, yc, x in q["_oimg"]:
                near = [(abs(yc - ly), k) for k, (lp, ly) in q["_labels"].items() if lp == pno]
                if near:
                    got[min(near)[1]].append(x)
            q["opts"] = {q["_oid"].get(k, f"?{k}"): got[k] for k in range(1, 5)}
        for k in ("_phase", "_labels", "_oimg", "_oid"):
            q.pop(k)
    return doc, out


def parse_paper(pdf):
    _, lay = layout(pdf)
    return [dict(n=n, qid=v["qid"], type=v["type"], opts=list(v["opts"]) if v["type"] == "MCQ" else [],
                 subject=v["subject"]) for n, v in sorted(lay.items())]
