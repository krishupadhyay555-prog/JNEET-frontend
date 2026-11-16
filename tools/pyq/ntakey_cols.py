"""Parser for NTA final keys printed in 3 subject columns with a "Place : DOMESTIC/INTERNATIONAL"
line (JEE Main 2025 Session 1 + 2). Word-coordinate based, column aware; handles DROPPED,
"a, b" / "a OR b" (several accepted, also numeric) and answers continued on the next line.
Use in a papers_img spec with  "keyFormat": "cols"  (+ optional "keyPlace", default DOMESTIC).
parse(pdf) -> {(date, shift, place): {qid: answer}}; place = DOMESTIC / INTERNATIONAL.
answer: option id, number, 'a,b' (several accepted), 'Dropped'."""
import re, sys
import pymupdf

def parse(pdf):
    doc = pymupdf.open(pdf); out = {}
    for page in doc:
        t = page.get_text()
        md = re.search(r"Exam Date\s*:\s*([0-9.\-]+)", t); ms = re.search(r"Shift\s*:\s*(\w+)", t)
        if not md: continue
        mp = re.search(r"Place\s*:\s*(\w+)", t)
        place = mp.group(1) if mp else ("INTERNATIONAL" if "Outside India" in t else "DOMESTIC")
        key = (md.group(1).replace("-", "."), ms.group(1), place)
        d = out.setdefault(key, {})
        words = page.get_text("words")  # x0,y0,x1,y1,word,...
        # column starts = x of the word 'QUESTION'/'Question' in header row
        hdr = sorted(w[0] for w in words if w[4].lower() == "question" and words and True)
        hy = min(w[1] for w in words if w[4].lower() == "question")
        starts = sorted(w[0] for w in words if w[4].lower() == "question" and abs(w[1] - hy) < 3)
        assert len(starts) == 3, (key, starts)
        bounds = starts[1:] + [1e9]
        cols = [[] for _ in starts]
        for w in words:
            if w[1] <= hy + 3: continue
            if w[4] in ("NATIONAL",) or w[1] > page.rect.height - 15: continue
            for i, b in enumerate(bounds):
                if w[0] < b - 25: cols[i].append(w); break
        for col in cols:
            col.sort(key=lambda w: w[1])
            rows = []
            for w in col:
                if rows and w[1] - rows[-1][0][1] < 3: rows[-1].append(w)
                else: rows.append([w])
            col = [w for r in rows for w in sorted(r, key=lambda w: w[0])]
            toks = [w[4] for w in col if not re.fullmatch(r"\(?\s*(Mathematics|Physics|Chemistry)\s*\)?|\(|\)", w[4])]
            i = 0
            while i < len(toks):
                q = toks[i]
                if not re.fullmatch(r"\d{6,}", q): raise ValueError(f"{key} expected qid, got {toks[i:i+5]}")
                i += 1; ans = []
                while True:
                    a = toks[i]; i += 1
                    if a.lower().startswith("drop"): ans.append("Dropped")
                    else:
                        if not re.fullmatch(r"-?\d+(\.\d+)?,?", a): raise ValueError(f"{key} q{q} bad answer {toks[i-1:i+5]}")
                        ans.append(a.rstrip(","))
                    cont = a.endswith(",")
                    # skip annotations: '(for all medium) &' , '(also for Hindi & Gujarati)', 'OR'
                    while i < len(toks) and not re.fullmatch(r"-?\d+(\.\d+)?,?|(?i:drop(ped)?)", toks[i]):
                        if toks[i] == "OR" or (toks[i] == "&" and toks[i-1] == "medium)"): cont = True
                        i += 1
                    if not cont: break
                d.setdefault(q, ",".join(ans))
    return out

if __name__ == "__main__":
    for f in sys.argv[1:]:
        for k, d in parse(f).items():
            odd = {q: a for q, a in d.items() if "," in a or "Drop" in a}
            print(k, len(d), odd)
