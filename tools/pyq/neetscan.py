"""NEET (UG) question booklets — NTA's scanned PDFs (one 600-dpi image per page, two columns,
question numbers in the left margin of each column, options printed inside the question).

layout(pdf, expected) -> list of {n, page_parts: [(page, x0, y0, x1, y1) in PDF points], ocr}
  * finds the column divider on every page, the question-number blobs in each column's margin,
    and cuts each question from its number to the next number (continuing into the next column /
    page when a question runs over);
  * every number is read back with Tesseract and must match the running count, so a missed or
    extra blob stops the build instead of shifting every answer by one.
to_image(doc, parts, dpi) -> PIL image of the question (parts stacked, whitespace trimmed).
"""
import re
import subprocess
import tempfile

import numpy as np
import pymupdf
from PIL import Image

DET_DPI = 150


def _gray(page, dpi, clip=None):
    pix = page.get_pixmap(dpi=dpi, colorspace=pymupdf.csGRAY, clip=clip)
    return np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w)


def _ocr_number(page, rect):
    a = _gray(page, 400, clip=rect)
    with tempfile.NamedTemporaryFile(suffix=".png") as f:
        Image.fromarray(a).save(f.name)
        r = subprocess.run(["tesseract", f.name, "-", "--psm", "7", "-c", "tessedit_char_whitelist=0123456789"],
                           capture_output=True, text=True).stdout
    return re.sub(r"\D", "", r)


def _clusters(rows, gap=4, minh=8):
    out, y, H = [], 0, len(rows)
    while y < H:
        if rows[y]:
            y0 = y
            while y < H and rows[y:y + gap].any():
                y += 1
            if y - y0 >= minh:
                out.append((y0, y))
        y += 1
    return out


def layout(pdf, expected):
    doc = pymupdf.open(pdf)
    s = 72 / DET_DPI                                   # detection px -> PDF points
    cand, columns = [], []                             # cand: (col, side, left_px, y_pt, rect, page)
    for pno, page in enumerate(doc):
        a = _gray(page, DET_DPI)
        H, W = a.shape
        ink = a < 128
        colsum = ink.sum(0)
        mid = range(int(W * .45), int(W * .58))
        div = max(mid, key=lambda x: colsum[x])
        if colsum[div] < H * 0.5:                      # cover / rough-work page: no divider
            continue
        foot = int(H * 0.885)                          # footer band: booklet code + page number
        # number strips: question numbers sit in the margin, left of the question text and options
        for side, (nx0, nx1, tx0, tx1) in enumerate([
                (int(W * .05), int(W * .11), int(W * .03), div - 3),
                (div + int(W * .005), div + int(W * .045), div + 4, int(W * .97))]):
            body = ink[:foot, tx0:tx1]
            rows_any = np.where(body.sum(1) > 0)[0]
            if not len(rows_any):
                continue
            ci = len(columns)
            columns.append(dict(page=pno, x0=tx0 * s, x1=tx1 * s, top=rows_any[0] * s, bottom=(rows_any[-1] + 2) * s))
            strip = ink[:foot, nx0:nx1]
            for y0, y1 in _clusters(strip.sum(1) > 0):
                if y1 - y0 > 24:          # taller than one line of digits: a heading box or a figure
                    continue
                left = int(np.where(strip[y0:y1].any(0))[0][0])
                # the number's own box: from its left edge to the first blank gap (>= 10 px)
                band = ink[y0:y1, nx0 + left:nx0 + left + int(W * .06)].any(0)
                right, blank = 0, 0
                for k, v in enumerate(band):
                    blank = 0 if v else blank + 1
                    if v:
                        right = k
                    if blank >= 10 and right:
                        break
                rect = pymupdf.Rect((nx0 + left) * s - 2, y0 * s - 2, (nx0 + left + right + 1) * s + 2, y1 * s + 2)
                cand.append((ci, side, left, y0 * s - 3, rect, page))
    # Numbers are printed flush at one x per column side; a blob elsewhere (figure edge, label,
    # section-heading box) is not a question number. Then every number must read as the next one.
    from collections import Counter
    # the number column is the LEFTMOST recurring edge (option labels like "(1)" sit further right)
    mode = {}
    for sd in (0, 1):
        lefts = sorted(c[2] for c in cand if c[1] == sd)
        mode[sd] = lefts[len(lefts) // 10] + 2
    starts, problems = [], []
    for ci, sd, left, y, rect, page in cand:
        if abs(left - mode[sd]) > 6:
            continue
        o = _ocr_number(page, rect)
        if not o:
            continue
        n = len(starts) + 1
        if o != str(n):
            problems.append((n, o))
        starts.append((ci, y, o))
    if len(starts) != expected:
        problems.insert(0, ("count", len(starts), expected))
    out = []
    for i, (ci, y, o) in enumerate(starts):
        col = columns[ci]
        nxt = starts[i + 1] if i + 1 < len(starts) else None
        parts = []
        if nxt and nxt[0] == ci:
            parts.append((col["page"], col["x0"], y, col["x1"], nxt[1]))
        else:
            parts.append((col["page"], col["x0"], y, col["x1"], col["bottom"]))
            # runs over: every following column up to the one holding the next number
            cj, last = ci + 1, (nxt[0] if nxt else ci)
            while cj <= last and cj < len(columns):
                c = columns[cj]
                end = nxt[1] if (nxt and cj == nxt[0]) else c["bottom"]
                if end - c["top"] > 6:
                    parts.append((c["page"], c["x0"], c["top"], c["x1"], end))
                cj += 1
        out.append(dict(n=i + 1, parts=[q for q in (_cut_heading(doc, p_, j == 0) for j, p_ in enumerate(parts)) if q], ocr=o))
    return doc, out, problems


HEADING = re.compile(r"section|physics|chemistry|botany|zoology|biology", re.I)


def _cut_heading(doc, part, first=True):
    """End a question's part above a subject / section heading box ("Chemistry : Section-A (...)"),
    which otherwise ends up glued to the previous question. Tables inside questions also have
    full-width rules, so a rule only counts when the box it starts holds a heading word."""
    pno, x0, y0, x1, y1 = part
    a = _gray(doc[pno], DET_DPI, clip=pymupdf.Rect(x0, y0, x1, y1))
    ink = a < 128
    full = np.where(ink.mean(1) > 0.6)[0]
    k = 72 / DET_DPI
    for r in full:
        if first and r * k < 8:     # the question's own first line
            continue
        box = pymupdf.Rect(x0, y0 + r * k - 1, x1, min(y1, y0 + r * k + 30))
        b = _gray(doc[pno], 300, clip=box)
        with tempfile.NamedTemporaryFile(suffix=".png") as f:
            Image.fromarray(b).save(f.name)
            t = subprocess.run(["tesseract", f.name, "-", "--psm", "6"], capture_output=True, text=True).stdout
        if HEADING.search(t):
            end = y0 + r * k - 3
            return (pno, x0, y0, x1, end) if end - y0 > 6 else None
    return part


def to_image(doc, parts, dpi=200):
    ims = []
    for pno, x0, y0, x1, y1 in parts:
        a = _gray(doc[pno], dpi, clip=pymupdf.Rect(x0, y0, x1, y1))
        ink = a < 160
        rows, cols = np.where(ink.any(1))[0], np.where(ink.any(0))[0]
        if not len(rows):
            continue
        a = a[max(0, rows[0] - 4):rows[-1] + 5, :cols[-1] + 6]
        ims.append(Image.fromarray(a))
    if not ims:
        return None
    W = max(i.width for i in ims)
    H = sum(i.height for i in ims) + 10 * (len(ims) - 1)
    out = Image.new("L", (W, H), 255)
    y = 0
    for i in ims:
        out.paste(i, (0, y)); y += i.height + 10
    return out
