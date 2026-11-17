"""Parse NTA JEE Main papers (master question paper PDFs) and final answer keys."""
import re, subprocess, json, sys

def text(pdf, layout=True):
    return subprocess.run(["pdftotext"] + (["-layout"] if layout else []) + [pdf, "-"], capture_output=True, text=True).stdout

ANS = re.compile(r"Dropped|Any non ?-?negative Integer|\d+(?:\.\d+)?(?:\s*\(\S+ in Hindi\))?(?:\s*,\s*\d+(?:\.\d+)?)*")

def parse_key(pdf):
    """Return {(date, shift): {qid: answer}} from a 2026-S2-style final key (QUESTION ID / CORRECT OPTION ID).
    answer: option id, number, 'a,b' (several accepted), 'Dropped' or 'ANY' (bonus)."""
    t = text(pdf)
    out = {}; cur = None
    for line in t.splitlines():
        m = re.search(r"Exam Date\s*:\s*([0-9.\-]+)\s+Exam Shift\s*:\s*([\w\-]+)", line)
        if m:
            cur = (m.group(1).replace("-", "."), m.group(2)); out.setdefault(cur, {}); continue
        if cur is None or not re.match(r"^\s*\d{6,}\s", line): continue
        pos = 0; s = line.strip()
        while s:
            m = re.match(r"(\d{6,})\s+", s)
            if not m: break
            q = m.group(1); s = s[m.end():]
            a = ANS.match(s)
            if not a: break
            val = a.group(0)
            if val.startswith("Any"): val = "ANY"
            val = re.sub(r"\s*\(\S+ in Hindi\)", "", val).replace(" ", "")
            out[cur].setdefault(q, val)
            s = s[a.end():].lstrip()
    return out

def parse_paper(pdf, ocr=False):
    """Return paper header + list of questions: n, qid, type, option ids in order, section.
    ocr=True reads the Tesseract text of a copy without a text layer (ntaocr)."""
    if ocr:
        import ntaocr
        t = "\n".join(l for _, _, l in ntaocr.lines(pdf))
    else:
        t = text(pdf, layout=False)
    return parse_text(t)


def parse_text(t):
    qs = []; section = None
    parts = re.split(r"(Question Number : \d+ Question Id : \d+ Question Type : \w+)", t)
    for i in range(1, len(parts), 2):
        h = parts[i]; body = parts[i + 1]
        n, qid, typ = re.match(r"Question Number : (\d+) Question Id : (\d+) Question Type : (\w+)", h).groups()
        prev = parts[i - 1]
        sm = re.findall(r"(Mathematics|Physics|Chemistry|Biology|Botany|Zoology) Section ([AB])", prev)
        if sm: section = sm[-1]
        else:
            # September 2020 papers head each part with the bare subject name
            sm = re.findall(r"^\s*(Mathematics|Physics|Chemistry)\s*$", prev, re.M)
            if sm: section = (sm[-1], "")
        opts = re.findall(r"^\f?(\d{7,})\.(?=\s|$)", body, re.M) if typ == "MCQ" else []
        if any(q["n"] == int(n) for q in qs):
            continue  # Hindi copy of a question already read (bilingual papers)
        qs.append(dict(n=int(n), qid=qid, type=typ, opts=opts, subject=section[0] if section else None, sec=section[1] if section else None))
    return qs

if __name__ == "__main__":
    k = parse_key(sys.argv[1])
    for s, d in k.items(): print(s, len(d))
