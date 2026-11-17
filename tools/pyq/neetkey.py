"""NEET (UG) final answer keys (NTA), per test-booklet code.
parse(pdf) -> {(exam_date 'DD.MM.YYYY', code): {qno: answer}}
answer: "1".."4", "a,b" (several accepted), "Dropped".
Formats: 2020/2021 "BOOK : E1   EXAM DATE : 13.09.2020" + "Q.No Key" columns; 2023 table "|QNO |RES|" under "BOOK CODE : E1" (5 = dropped, B = 1 & 3, E = 2 & 4 correct);
2024/2025 "Q.No. Answer" columns under "Test Booklet Code : T1" ("1,3" = both accepted)."""
import re, subprocess

LEGEND_2023 = {"5": "Dropped", "B": "1,3", "E": "2,4"}


def parse(pdf):
    t = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True).stdout
    out, date, code = {}, None, None
    for line in t.splitlines():
        m = re.search(r"(?:DATE OF EXAM -|EXAM HELD ON|EXAM DATE\s*:)\s*(\d\d\.\d\d\.\d{4})", line)
        if m:
            date, code = m.group(1), None
        m = re.search(r"(?:BOOK CODE|Test Booklet Code|BOOK)\s*:\s*([A-Z]?\d+|[A-Z]\d?)\b", line)
        if m:
            code = m.group(1); out.setdefault((date, code), {}); continue
        if re.search(r"EXAM DATE|DATE OF EXAM|EXAM HELD ON", line):
            continue
        if code is None:
            continue
        cur = out[(date, code)]
        if "|" in line:
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) % 2 or not all(re.fullmatch(r"\d{1,3}", c) for c in cells[0::2]):
                continue
            for q, a in zip(cells[0::2], cells[1::2]):
                a = LEGEND_2023.get(a, a)
                if not re.fullmatch(r"[1-4](,[1-4])*|Dropped", a):
                    raise ValueError(f"{date} {code} Q{q}: unexpected {a!r}")
                cur[int(q)] = a
        else:
            tok = line.split()
            if len(tok) < 2 or len(tok) % 2 or not all(re.fullmatch(r"\d{1,3}", x) for x in tok[0::2]):
                continue
            if not all(re.fullmatch(r"[1-4](,[1-4])*|Drop(ped)?", x) for x in tok[1::2]):
                continue
            for q, a in zip(tok[0::2], tok[1::2]):
                cur[int(q)] = "Dropped" if a.startswith("Drop") else a
    return out


if __name__ == "__main__":
    import sys
    for k, d in parse(sys.argv[1]).items():
        print(k, len(d), {q: a for q, a in d.items() if a not in "1234"})
