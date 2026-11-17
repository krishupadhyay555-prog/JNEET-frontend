"""Cut an NTA JEE Main master question paper (PDF) into one image per question and per option,
using NTA's own embedded images (no re-typing). Returns {n: {"q": [xref...], "opts": {optid: [xref...]}}}."""
import re, io
import pymupdf
from PIL import Image

HDR = re.compile(r"Question Number : (\d+) Question Id : (\d+) Question Type : (\w+)")
OPTID = re.compile(r"^(\d{7,})\.$")
OPTID_OCR = re.compile(r"^(\d{7,})\s*[.,]?(?:\s|$)")

def layout(pdf, ocr=False):
    """ocr=True: the copy's text was turned into vector curves (no text layer); the text lines then
    come from Tesseract (ntaocr.lines). Every ID is still checked against NTA's key afterwards."""
    doc = pymupdf.open(pdf)
    ev = []
    # A host's watermark / logo is one image drawn on (nearly) every page; NTA's question and option
    # images are each used once. Ignore any image that repeats on many pages.
    stamp = stamps(doc)
    if ocr:
        import ntaocr
        ev += [(pno, y, 0, "T", t) for pno, y, t in ntaocr.lines(pdf)]
    for pno, page in enumerate(doc):
        if not ocr:
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
                phase = "o"; pending = []; awaiting = None
                rest = val[len("Options :"):].strip()      # "Options : 40503640035." in one text block
                m = (OPTID_OCR if ocr else OPTID).match(rest)
                if not m:
                    continue
                val = rest
            if val.startswith(("Response Type", "Mathematics Section", "Physics Section", "Chemistry Section", "Section Id")):
                phase = None; continue
            m = (OPTID_OCR if ocr else OPTID).match(val)
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
    if ocr:
        _repair_ocr_options(out)
    return doc, out


def _repair_ocr_options(out):
    """OCR can miss or misread one option-ID label. NTA numbers a question's four option IDs
    consecutively and draws one image per option, so when the labels we did read fit one run of
    four IDs and there are exactly four option images, rebuild the options in printed order.
    (The answer ID must still be one of them — checked against NTA's key in build_img.)"""
    for q in out.values():
        if q["type"] != "MCQ":
            continue
        ids = sorted(int(i) for i in q["opts"] if i.isdigit())
        imgs = [x for i in q["opts"] for x in q["opts"][i]]
        if not ids or ids[-1] - ids[0] > 3 or len(imgs) != 4:
            continue
        first = ids[0] if len(ids) == 4 or all(i - ids[0] <= 3 for i in ids) else ids[-1] - 3
        run = [str(first + k) for k in range(4)]
        if set(map(str, ids)) <= set(run) and list(q["opts"]) != run:
            q["opts"] = {r: [imgs[k]] for k, r in enumerate(run)}
            q["repaired"] = True

def stamps(doc):
    """xrefs of a host's watermark / logo: drawn on (nearly) EVERY page, at the same place.
    A small image NTA reuses inside many questions (e.g. a digit used as an option) appears on many
    pages too, but at different places — it must not be dropped."""
    from collections import Counter
    pages, spots = Counter(), {}
    for pno, page in enumerate(doc):
        seen = set()
        for i in page.get_image_info(xrefs=True):
            x = i["xref"]
            spots.setdefault(x, Counter())[tuple(round(v / 5) for v in i["bbox"])] += 1
            if x not in seen:
                pages[x] += 1; seen.add(x)
    n = len(doc)
    return {x for x, k in pages.items()
            if n >= 8 and k >= 0.8 * n and spots[x].most_common(1)[0][1] >= 0.5 * sum(spots[x].values())}


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
