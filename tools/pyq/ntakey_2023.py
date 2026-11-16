"""Parser for NTA JEE Main 2023 FINAL answer keys (Session 1 = Jan/Feb 2023, Session 2 = April 2023).

Both keys print one shift per page in 3 subject columns (Question ID | Correct Option ID), with a
header line "Exam Date : 24.01.2023  Shift : First" (Session 2: "Exam Date : 06-04-2023 ... Shift :Second").
Neither ntaparse.parse_key (needs "Exam Shift") nor ntakey_cols.parse (no "Place", different header)
reads them, so this parser is word-coordinate based and column aware, like ntakey_cols.

Handles what these two PDFs contain:
  DROP                                  -> 'Dropped'
  "7155053609," + next line "7155053611" -> '7155053609,7155053611'  (several accepted; may span 3 lines)
  "30,60"  /  "6860 or 3"               -> '30,60' / '6860,3'        (several accepted numeric values)
  "7155054574," + "7155054574"          -> '7155054574'              (same id printed twice: de-duplicated)
  "120 (For Hindi 112)", "798 (For Hindi & Gujarati 1)", "11 (DROP for Hindi Medium)"
                                        -> '120' / '798' / '11'      (English-medium answer; the note is kept
                                                                      in parse_with_notes())
  9-digit question/option ids (e.g. 366694271) are real NTA ids, kept as printed.

parse(pdf) -> {(date, shift): {qid: answer}}   date 'DD.MM.YYYY', shift 'First' / 'Second'.
answer: option id, number, 'a,b' (several accepted), 'Dropped'. (No bonus-to-all in 2023; 'ANY' unused.)
"""
import re, sys
import pymupdf

SKIP = {"question", "id", "correct", "option", "physics", "chemistry", "mathematics", "page"}
NUM = re.compile(r"-?\d+(?:\.\d+)?")


def _tokens(page, hy):
    """Words of the answer table split into the 3 columns, each in reading order (top→bottom)."""
    words = page.get_text("words")
    starts = sorted(w[0] for w in words if w[4].lower() == "question" and abs(w[1] - hy) < 3)
    if len(starts) != 3:
        raise ValueError(f"page {page.number + 1}: expected 3 'Question' column headers, got {starts}")
    bounds = starts[1:] + [1e9]
    cols = [[] for _ in starts]
    foot = [w[1] for w in words if w[4] == "Page"]
    for w in words:
        if w[1] <= hy + 1 or any(abs(w[1] - y) < 3 for y in foot):   # header block / 'Page N' footer
            continue
        if w[4].lower() in SKIP:
            continue
        for i, b in enumerate(bounds):
            if w[0] < b - 25:
                cols[i].append(w); break
    out = []
    for col in cols:
        col.sort(key=lambda w: w[1])
        rows = []
        for w in col:
            if rows and w[1] - rows[-1][0][1] < 3: rows[-1].append(w)
            else: rows.append([w])
        out.append([w[4] for r in rows for w in sorted(r, key=lambda w: w[0])])
    return out


def _column(toks, where, d, notes):
    i = 0
    while i < len(toks):
        q = toks[i]
        if not re.fullmatch(r"\d{9,10}", q):
            raise ValueError(f"{where}: expected question id, got {toks[i:i + 6]}")
        i += 1
        ans, note = [], []
        while True:
            if i >= len(toks):
                raise ValueError(f"{where}: q{q} has no answer")
            a = toks[i]; i += 1
            if a.upper().startswith("DROP"):
                ans.append("Dropped"); cont = False
            else:
                parts = [p for p in a.split(",") if p]
                if not parts or not all(NUM.fullmatch(p) for p in parts):
                    raise ValueError(f"{where}: q{q} bad answer {toks[i - 1:i + 5]}")
                ans += parts
                cont = a.endswith(",")
            # notes in brackets: '(For Hindi 112)', '(For Hindi & Gujarati 1)', '(DROP for Hindi Medium)'
            while i < len(toks) and (toks[i].startswith("(") or toks[i].lower() == "or"):
                if toks[i].lower() == "or":
                    cont = True; i += 1; continue
                j = i
                while not toks[j].endswith(")"):
                    j += 1
                note.append(" ".join(toks[i:j + 1])); i = j + 1
            if not cont:
                break
        if "Dropped" in ans and len(ans) > 1:
            raise ValueError(f"{where}: q{q} mixes DROP with answers {ans}")
        if q in d:
            raise ValueError(f"{where}: q{q} printed twice")
        d[q] = ",".join(dict.fromkeys(ans))
        if note:
            notes[q] = "; ".join(note)


def parse_with_notes(pdf):
    """-> ({(date, shift): {qid: answer}}, {qid: note text})"""
    doc = pymupdf.open(pdf); out = {}; notes = {}
    for page in doc:
        t = page.get_text()
        md = re.search(r"Exam Date\s*:\s*([0-9.\-]+)", t)
        ms = re.search(r"Shift\s*:\s*(\w+)", t)
        if not md:
            continue
        key = (md.group(1).replace("-", "."), ms.group(1))
        d = out.setdefault(key, {})
        words = page.get_text("words")
        hy = min(w[1] for w in words if w[4].lower() == "question")
        for c, toks in enumerate(_tokens(page, hy)):
            _column(toks, f"{key} page {page.number + 1} col {c + 1}", d, notes)
    return out, notes


def parse(pdf):
    return parse_with_notes(pdf)[0]


if __name__ == "__main__":
    for f in sys.argv[1:]:
        k, notes = parse_with_notes(f)
        for s, d in k.items():
            odd = {q: a for q, a in d.items() if "," in a or "Drop" in a}
            print(s, len(d), odd)
        print("notes:", notes)
