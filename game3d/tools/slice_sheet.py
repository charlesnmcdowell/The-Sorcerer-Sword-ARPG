#!/usr/bin/env python3
"""
slice_sheet.py — cut a GREEN-SCREEN sprite SHEET (one character, several animation rows) into
registered per-frame PNGs the existing pipeline ingests as flipbook sets.

WHY: a single-generation sheet keeps the character PERFECTLY consistent across every frame —
the cross-generation drift that made per-frame Grok keyframes read as "glued together" simply
cannot happen inside one image. Hiro's 2026-07-06 green-lit locomotion sheet (idle x5, walk x8,
walk-back x8) is the source of truth; this script turns sheets like it into game frames.

RUN (from game3d/tools):
    python slice_sheet.py sheet_warlock_locomotion.png
    python slice_sheet.py mysheet.png --rows idle,walk,walkb --entity warlock
    (defaults: --rows idle,walk,walkb  --entity warlock)

What it does:
  1. keys the green background (same relaxed thresholds as gen_sprites.py),
  2. finds figure blobs, clusters them into ROWS by vertical overlap, sorts each row left→right
     (row-label text blobs are filtered out by size),
  3. pastes every frame of a row onto an IDENTICAL canvas anchored at the alpha's BOTTOM-CENTER
     (feet on a common baseline = registration; ingest_art.py then union-bbox crops the set),
  4. writes art_in/<entity>_<row>_<n>.png ready for:
       python ingest_art.py <entity>_<row>_1 <entity>_<row>_2 ...
     (it prints the exact ingest command for what it produced).
"""
import os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

HERE  = os.path.dirname(os.path.abspath(__file__))
G3D   = os.path.dirname(HERE)
ARTIN = os.path.join(G3D, "art_in")

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args: sys.exit("usage: python slice_sheet.py <sheet.png> [--rows idle,walk,walkb] [--entity warlock]")
    rows_names = ["idle", "walk", "walkb"]
    entity = "warlock"
    for i, a in enumerate(sys.argv):
        if a == "--rows"   and i+1 < len(sys.argv): rows_names = sys.argv[i+1].split(",")
        if a == "--entity" and i+1 < len(sys.argv): entity = sys.argv[i+1]
    path = args[0] if os.path.exists(args[0]) else os.path.join(HERE, args[0])
    im = Image.open(path).convert("RGBA")
    a = np.array(im); R, Gc, B = (a[:, :, i].astype(int) for i in range(3))
    # green key (relaxed thresholds, same rationale as gen_sprites.key_and_crop 2B.1 fix)
    fg = ~(((Gc - R) > 25) & ((Gc - B) > 25) & (Gc > 95))
    fg = ndimage.binary_opening(fg, iterations=2)          # drop speckle
    lbl, n = ndimage.label(fg)
    if not n: sys.exit("no figures found (is the sheet green-screen?)")
    H = a.shape[0]
    blobs = []
    for sl in ndimage.find_objects(lbl):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if h < H * 0.08:  # row-label text / crumbs: far shorter than any figure
            continue
        blobs.append((sl[0].start, sl[0].stop, sl[1].start, sl[1].stop))
    if not blobs: sys.exit("figures filtered out — lower the size threshold")
    # cluster into rows by vertical overlap
    blobs.sort(key=lambda b: b[0])
    rows = []
    for b in blobs:
        for r in rows:
            if b[0] < r["y1"] and b[1] > r["y0"]:
                r["y0"] = min(r["y0"], b[0]); r["y1"] = max(r["y1"], b[1]); r["blobs"].append(b); break
        else:
            rows.append({"y0": b[0], "y1": b[1], "blobs": [b]})
    rows.sort(key=lambda r: r["y0"])
    if len(rows) != len(rows_names):
        print(f"  !! sheet has {len(rows)} figure row(s) but --rows names {len(rows_names)}: {rows_names}")
        rows_names = (rows_names + [f"row{i}" for i in range(len(rows))])[:len(rows)]
    os.makedirs(ARTIN, exist_ok=True)
    made = []
    alpha_full = np.where(fg, 255, 0).astype(np.uint8)
    for r, rname in zip(rows, rows_names):
        frames = sorted(r["blobs"], key=lambda b: b[2])     # left -> right
        cw = max(b[3] - b[2] for b in frames) + 24
        ch = max(b[1] - b[0] for b in frames) + 24
        for i, (y0, y1, x0, x1) in enumerate(frames, 1):
            tile = a[y0:y1, x0:x1].copy()
            tile[:, :, 3] = alpha_full[y0:y1, x0:x1]        # keyed alpha
            canvas = np.zeros((ch, cw, 4), np.uint8)
            # anchor at BOTTOM-CENTER (feet baseline) for cross-frame registration
            ys, xs = np.where(tile[:, :, 3] > 40)
            cx = int(xs.mean()) if len(xs) else tile.shape[1] // 2
            ox = cw // 2 - cx
            oy = ch - 12 - tile.shape[0]
            ox = max(0, min(cw - tile.shape[1], ox))
            canvas[oy:oy + tile.shape[0], ox:ox + tile.shape[1]] = tile
            name = f"{entity}_{rname}_{i}"
            Image.fromarray(canvas, "RGBA").save(os.path.join(ARTIN, name + ".png"))
            made.append(name)
        print(f"  row '{rname}': {len(frames)} frame(s) on a {cw}x{ch} shared canvas")
    print(f"\nWrote {len(made)} frame(s) to art_in/. Now run:\n  python ingest_art.py " + " ".join(made))

if __name__ == "__main__":
    main()
