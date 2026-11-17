"""Cut an NTA JEE Main master question paper (PDF) into one image per question and per option,
using NTA's own embedded images (no re-typing). Returns {n: {"q": [xref...], "opts": {optid: [xref...]}}}."""
import re, io
import pymupdf
from PIL import Image

HDR = re.compile(r"Question Number : (\d+) Question Id : (\d+) Question Type : (\w+)")
OPTID = re.compile(r"^(\d{7,})\.$")

def layout(pdf):
    doc = pymupdf.open(pdf)
    ev = []
    # A host's watermark / logo is one image drawn on (nearly) every page; NTA's question and option
    # images are each used once. Ignore any image that repeats on many pages.
    from collections import Counter
    use = Counter(i["xref"] for page in doc for i in page.get_image_info(xrefs=True))
    stamp = {x for x, k in use.items() if k >= max(8, len(doc) // 3)}
    for pno, page in enumerate(doc):
        for b in page.get_text("dict")["blocks"]:
            if b["type"] == 0:
                t = " ".join(s["text"] for l in b["lines"] for s in l["spans"]).strip()
                ev.append((pno, b["bbox"][1], 0, "T", t))
        for info in page.get_image_info(xrefs=True):
            if info["xref"] not in stamp:
                ev.append((pno, info["bbox"][1], 1, "I", info["xref"]))
    ev.sort(key=lambda e: (e[0], e[1], e[2]))
    out = {}; cur = None; phase = None; pending = []; awaiting = None
    for _, _, _, kind, val in ev:
        if kind == "T":
            m = HDR.search(val)
            if m and int(m.group(1)) in out:
                # bilingual papers (2025+) print every question again in Hindi: keep the first (English) copy
                cur = None; phase = None; continue
            if m:
                cur = int(m.group(1)); out[cur] = {"qid": m.group(2), "type": m.group(3), "q": [], "opts": {}}
                phase = "q"; pending = []; awaiting = None; continue
            if cur is None: continue
            if val.startswith("Options :"):
                phase = "o"; pending = []; awaiting = None; continue
            if val.startswith(("Response Type", "Mathematics Section", "Physics Section", "Chemistry Section", "Section Id")):
                phase = None; continue
            m = OPTID.match(val)
            if m and phase == "o":
                # an option image usually sits just above its ID label, sometimes just below it
                out[cur]["opts"][m.group(1)] = pending
                awaiting = None if pending else m.group(1)
                pending = []
        else:
            if cur is None or phase is None: continue
            if phase == "q": out[cur]["q"].append(val)
            elif awaiting: out[cur]["opts"][awaiting].append(val); awaiting = None
            else: pending.append(val)
    return doc, out

def widths(doc):
    """Printed width (PDF points) of every embedded image: lets the app show question and
    option images at one common scale, so the text size matches between them."""
    w = {}
    for page in doc:
        for info in page.get_image_info(xrefs=True):
            b = info["bbox"]; w[info["xref"]] = max(w.get(info["xref"], 0), b[2] - b[0])
    return w

def to_image(doc, xrefs, max_w=900):
    ims = []
    for x in xrefs:
        d = doc.extract_image(x)
        im = Image.open(io.BytesIO(d["image"])).convert("L")
        ims.append(im)
    if not ims: return None
    W = max(i.width for i in ims); H = sum(i.height for i in ims) + 6 * (len(ims) - 1)
    canvas = Image.new("L", (W, H), 255); y = 0
    for i in ims: canvas.paste(i, (0, y)); y += i.height + 6
    if canvas.width > max_w:
        canvas = canvas.resize((max_w, round(canvas.height * max_w / canvas.width)), Image.LANCZOS)
    return canvas

def save(im, path):
    im.save(path, "WEBP", quality=70, method=6)
