import sys
from PIL import Image, ImageOps
def crop(src, dst, top=0, bottom=None, left=0, right=None, pad=8):
    im = Image.open(src).convert("RGB")
    W, H = im.size
    im = im.crop((left, top, right or W, bottom or H))
    g = ImageOps.invert(im.convert("L")).point(lambda v: 255 if v > 40 else 0)
    bb = g.getbbox()
    if bb: im = im.crop((max(0, bb[0]-pad), max(0, bb[1]-pad), min(im.size[0], bb[2]+pad), min(im.size[1], bb[3]+pad)))
    im.save(dst, optimize=True)
    return im.size
if __name__ == "__main__":
    a = sys.argv; print(crop(a[1], a[2], *[int(v) if v != "-" else None for v in a[3:]]))
