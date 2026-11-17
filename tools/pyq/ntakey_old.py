"""Final keys of JEE Main 2020 (September) and 2021 (Feb, March, July, Aug/Sep), which are printed
per exam MEDIUM (each language has its own Question IDs):

rows(pdf)    — 2021: "Exam Date : 24.02.2021  Exam Shift : First  Medium : English" + rows of
               "QUESTION ID  ANSWER" pairs (columns split on 2+ spaces).
cols2020(pdf) — September 2020: three subject columns per page; an answer may wrap to the next line
               after a comma; "--5--"/"5" on an MCQ = dropped (key footer).

Both return {(date 'DD.MM.YYYY', shift, medium): {qid: answer}} with answer = option ID / number /
"a,b" (several accepted) / "Dropped". Adapted from the helper scripts that verified these keys."""
import re, subprocess
import pymupdf


def _norm(a):
    a = a.strip()
    if re.fullmatch(r"(?i)d|drop(ped)?|-+5-+", a):
        return "Dropped"
    return re.sub(r"\s*(?:,|\bor\b)\s*", ",", a).strip(",")


def rows(pdf):
    t = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True).stdout
    out, cur = {}, None
    for line in t.splitlines():
        m = re.search(r"Exam Date\s*:\s*(\d\d)[-./](\d\d)[-./](\d{4}).*?Shift\s*:\s*(\w+)(?:.*?Medium\s*:\s*(.+?)\s*$)?", line)
        if m:
            cur = (f"{m.group(1)}.{m.group(2)}.{m.group(3)}", m.group(4), (m.group(5) or "").strip())
            out.setdefault(cur, {}); continue
        if cur is None or not re.match(r"^\s*\d{5,}\s", line):
            continue
        toks = [x for x in re.split(r"\s{2,}", line.strip()) if x]
        for i in range(0, len(toks) - 1, 2):
            if not re.fullmatch(r"\d{5,}", toks[i]):
                break
            out[cur][toks[i]] = _norm(toks[i + 1])
    return out


def cols2020(pdf):
    doc = pymupdf.open(pdf); out = {}
    for page in doc:
        t = page.get_text()
        md = re.search(r"Exam Date\s*:\s*([0-9.]+)", t); ms = re.search(r"Shift\s*:\s*(\w+)", t)
        mm = re.search(r"Medium\s*:\s*([^\n]+)", t)
        if not md:
            continue
        d = out.setdefault((md.group(1), ms.group(1), mm.group(1).strip() if mm else ""), {})
        words = page.get_text("words")
        hy = min(w[1] for w in words if w[4] == "Question")
        starts = sorted(w[0] for w in words if w[4] == "Question" and abs(w[1] - hy) < 3)
        cols = [[] for _ in starts]
        for w in words:
            if w[1] <= hy + 3 or w[1] > page.rect.height - 40 or not re.fullmatch(r"[-\d.,]+", w[4]):
                continue
            i = max(j for j, s in enumerate(starts) if w[0] >= s - 15) if w[0] >= starts[0] - 15 else 0
            cols[i].append(w)
        for i, col in enumerate(cols):
            col.sort(key=lambda w: (round(w[1]), w[0])); cur = None
            for w in col:
                tok = w[4]
                if w[0] < starts[i] + 40 and re.fullmatch(r"\d{9,11}", tok):
                    cur = tok; d[cur] = ""; continue
                if cur is None:
                    continue
                d[cur] = d[cur] + tok if d[cur] else tok
        for q in list(d):
            d[q] = _norm(d[q])
    return out
