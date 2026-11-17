"""Parser for the JEE Main 2022 final keys: two "QUESTION ID  ANSWER" pairs per row under
"Exam Date : 24.06.2022 ... Shift : 1". The answer of an MCQ is the option LETTER (A-D, Session 1)
or the option NUMBER (1-4, Session 2); a numerical answer is the value; "Drop"; "a or b".
parse(pdf) -> {(date 'DD.MM.YYYY', shift '1'|'2'): {qid: answer}}  (answer as printed, "or" -> ",").
Columns are split on runs of 2+ spaces, so an answer is never read as a question id (ids can be 3 digits)."""
import re, subprocess


def parse(pdf):
    t = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True).stdout
    out, cur = {}, None
    for line in t.splitlines():
        m = re.search(r"Exam Date\s*:\s*(\d\d)[-.](\d\d)[-.](\d{4}).*?Shift\s*:\s*(\d)", line)
        if m:
            cur = (f"{m.group(1)}.{m.group(2)}.{m.group(3)}", m.group(4)); out.setdefault(cur, {}); continue
        if cur is None:
            continue
        tok = [x for x in re.split(r"\s{2,}", line.strip()) if x]
        if len(tok) < 2 or len(tok) % 2 or not all(re.fullmatch(r"\d{3,}", tok[i]) for i in range(0, len(tok), 2)):
            continue
        for q, a in zip(tok[0::2], tok[1::2]):
            a = a.strip()
            if a.lower() == "drop":
                a = "Dropped"
            elif re.fullmatch(r"[A-D]|-?\d+(\.\d+)?(\s+or\s+-?\d+(\.\d+)?)*", a):
                a = re.sub(r"\s+or\s+", ",", a)
            else:
                raise ValueError(f"{cur}: unexpected answer {a!r} for {q}")
            out[cur].setdefault(q, a)
    return out


if __name__ == "__main__":
    import sys
    for k, d in parse(sys.argv[1]).items():
        print(k, len(d), {q: a for q, a in d.items() if "," in a or a == "Dropped"})
