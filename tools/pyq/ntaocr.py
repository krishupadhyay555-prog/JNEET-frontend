"""Text lines of an NTA master paper whose text layer was turned into vector curves by the host
(e.g. some prepp.in copies): render each page with its images painted white (so option images
are not read as text), OCR with Tesseract, return [(page, y_pt, line_text)] in reading order.
Cached per file in .cache/ocr/. The IDs read here are only trusted after they match NTA's key."""
import hashlib, json, re, subprocess, tempfile
from pathlib import Path
import numpy as np
import pymupdf
from PIL import Image

CACHE = Path(__file__).resolve().parent / ".cache" / "ocr"
DPI = 300


def _page_lines(page, stamp=()):
    pix = page.get_pixmap(dpi=DPI, colorspace=pymupdf.csGRAY)
    a = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w).copy()
    k = DPI / 72
    for i in page.get_image_info(xrefs=True):
        if i["xref"] in stamp:        # leave the host's watermark: whiting it out would cut text lines
            continue
        x0, y0, x1, y1 = [int(v * k) for v in i["bbox"]]
        a[max(0, y0):y1 + 1, max(0, x0):x1 + 1] = 255
    with tempfile.NamedTemporaryFile(suffix=".png") as f:
        Image.fromarray(a).save(f.name)
        tsv = subprocess.run(["tesseract", f.name, "-", "--psm", "4", "tsv"], capture_output=True, text=True).stdout
    rows = {}
    for line in tsv.splitlines()[1:]:
        c = line.split("\t")
        if len(c) != 12 or not c[11].strip():
            continue
        key = (int(c[2]), int(c[3]), int(c[4]))
        r = rows.setdefault(key, {"y": int(c[7]), "w": []})
        r["y"] = min(r["y"], int(c[7])); r["w"].append(c[11].strip())
    out = []
    for r in sorted(rows.values(), key=lambda r: r["y"]):
        t = " ".join(r["w"])
        t = re.sub(r"\s*:\s*", " : ", t)               # "Options:" -> "Options :" (as in NTA's text layer)
        t = re.sub(r"(\d)\s*\.$", r"\1.", t)
        out.append((r["y"] / k, t))
    return out


def lines(pdf):
    h = hashlib.sha1(Path(pdf).read_bytes()).hexdigest()[:16]
    f = CACHE / f"{h}.json"
    if f.exists():
        return [tuple(x) for x in json.loads(f.read_text())]
    doc = pymupdf.open(pdf)
    import ntaimages
    stamp = ntaimages.stamps(doc)
    out = [(pno, y, t) for pno, page in enumerate(doc) for y, t in _page_lines(page, stamp)]
    CACHE.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps(out))
    return out
