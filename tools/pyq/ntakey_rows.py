"""Parser for NTA final keys printed as rows of up to three "QUESTION ID  ANSWER" pairs under an
"Exam Date : DD-MM-YYYY ... Shift : First" header (JEE Main 2023 Session 2 style).
parse(pdf) -> {(date 'DD.MM.YYYY', shift): {qid: answer}}; answer = option id / number /
'a,b' (several accepted) / 'Dropped'. A note such as "(DROP for Hindi Medium)" is ignored:
the app serves the English paper, whose answer is the value printed."""
import re, subprocess

PAIR = re.compile(r"(\d{9,})\s+(DROP|Drop|-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?)*)(?:\s*\([^)]*\))?")

def parse(pdf):
    t = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True).stdout
    out = {}; cur = None
    for line in t.splitlines():
        m = re.search(r"Exam Date\s*:\s*(\d\d)[-.](\d\d)[-.](\d{4}).*?Shift\s*:\s*(\w+)", line)
        if m:
            cur = (f"{m.group(1)}.{m.group(2)}.{m.group(3)}", m.group(4)); out.setdefault(cur, {}); continue
        if cur is None:
            continue
        for q, a in PAIR.findall(line):
            a = "Dropped" if a.lower() == "drop" else re.sub(r"\s+", "", a)
            out[cur].setdefault(q, a)
    return out

if __name__ == "__main__":
    import sys
    for k, d in parse(sys.argv[1]).items():
        print(k, len(d), {q: a for q, a in d.items() if "," in a or a == "Dropped"})
