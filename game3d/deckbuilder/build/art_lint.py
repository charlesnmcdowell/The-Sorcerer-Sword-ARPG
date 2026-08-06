#!/usr/bin/env python3
"""
art_lint.py — automated art QA over every frame the bundler ships.

Flags, per frame:
  EDGECUT  opaque pixels pressed hard against the left/right/top canvas edge
           (a limb or weapon sliced off mid-frame by the source crop)
  CRUMBS   small disconnected alpha blobs away from the figure (chroma-key residue)
  FRINGE   green spill on the figure's edge band (G well above R and B)
  BOXY     a large count of faint (5..60) alpha pixels far from the figure —
           the "ghost box" a soft key leaves around a sprite on dark backgrounds
  TEXT     opaque pixels in the bottom 8% that are much narrower than the figure
           (caption/digit remnants riding under the feet)

Run: python3 build/art_lint.py [--top N]
"""
import sys, importlib.util
import numpy as np
from PIL import Image
from scipy import ndimage
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("ba", HERE / "build_assets.py")
ba = importlib.util.module_from_spec(spec)
import os
os.makedirs("/tmp/_noout", exist_ok=True)
sys.argv = ["build_assets.py", "/mnt/user-data/uploads/game3d/assets", "/tmp/_noout"]
spec.loader.exec_module.__self__ if False else None
# load the module WITHOUT running main()
import types
src = (HERE / "build_assets.py").read_text()
mod = types.ModuleType("ba")
mod.__dict__["__name__"] = "ba"
exec(compile(src.replace('if __name__ == "__main__":\n    main()', ""), "build_assets.py", "exec"), mod.__dict__)
SRC = Path("/mnt/user-data/uploads/game3d/assets")

def analyze(key, folder, base, n, mirror):
    p = SRC / folder / (base + ("" if n is None else f"_{n}") )
    p = Path(str(p) + ".png")
    im = Image.open(p).convert("RGBA")
    if mirror: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    a = np.array(im)
    H, W = a.shape[:2]
    alpha = a[:, :, 3]
    op = alpha > 120
    if not op.any(): return []
    issues = []
    # EDGECUT: dense opaque runs on left/right/top edges
    for name, line in (("L", op[:, 0]), ("R", op[:, -1]), ("T", op[0, :])):
        frac = line.mean()
        if frac > 0.22: issues.append(("EDGECUT", f"{name} edge {frac*100:.0f}% opaque"))
    # components
    lbl, ncomp = ndimage.label(op)
    if ncomp > 1:
        sizes = ndimage.sum(op, lbl, range(1, ncomp + 1))
        main = 1 + int(np.argmax(sizes))
        total = sizes.sum()
        crumbs = [(int(s)) for i, s in enumerate(sizes, 1) if i != main and s > 12]
        # distance of crumbs from main blob bbox
        if crumbs and sum(crumbs) > total * 0.004:
            issues.append(("CRUMBS", f"{len(crumbs)} stray blobs, {sum(crumbs)} px"))
    # FRINGE: green cast on edge band
    band = ndimage.binary_dilation(op, iterations=2) & ~ndimage.binary_erosion(op, iterations=2)
    if band.any():
        R = a[:, :, 0].astype(int); G = a[:, :, 1].astype(int); B = a[:, :, 2].astype(int)
        spill = band & (G > np.maximum(R, B) + 24)
        sfrac = spill.sum() / max(1, band.sum())
        if sfrac > 0.10: issues.append(("FRINGE", f"{sfrac*100:.0f}% of edge band green"))
    # BOXY: faint alpha far from figure
    faint = (alpha > 4) & (alpha < 60)
    far = faint & ~ndimage.binary_dilation(op, iterations=6)
    if far.sum() > 0.015 * H * W:
        issues.append(("BOXY", f"{far.sum()} faint px off-figure ({far.sum()*100//(H*W)}% of canvas)"))
    # TEXT: narrow opaque content in the bottom strip, much narrower than figure width
    bot = op[int(H * 0.94):, :]
    if bot.any():
        cols = np.where(bot.any(axis=0))[0]
        bw = cols.max() - cols.min() + 1
        figcols = np.where(op.any(axis=0))[0]
        fw = figcols.max() - figcols.min() + 1
        dens = bot.sum()
        if bw < fw * 0.28 and dens > 40 and dens < 2000:
            issues.append(("TEXT", f"narrow bottom blob w={bw} vs figure {fw}"))
    return issues

def main():
    rows = []
    for key, spec_ in mod.ANIMS.items():
        folder, base, nums, fps = spec_[0], spec_[1], spec_[2], spec_[3]
        mirror = len(spec_) > 4 and spec_[4]
        for n in nums:
            try:
                probs = analyze(key, folder, base, n, mirror)
            except FileNotFoundError:
                rows.append((key, n, [("MISSING", "file not found")])); continue
            if probs: rows.append((key, n, probs))
    # report grouped by issue kind
    print(f"frames flagged: {len(rows)}")
    for key, n, probs in rows:
        print(f"  {key}_{n}: " + "; ".join(f"{k}({d})" for k, d in probs))

if __name__ == "__main__":
    main()
