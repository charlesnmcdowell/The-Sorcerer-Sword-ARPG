#!/usr/bin/env python3
"""
slice_dancer.py — cut the IDLE row out of the existing green-screen dancer_mvc.png sheet
(tools/dancer_mvc.png on Hiro's PC) into registered, keyed, despilled per-frame PNGs for the
new Tavern NPC. Reuses the same row-clustering + bottom-center registration as slice_sheet.py
and the same two-tier despill/feather logic as gen_sprites.key_and_crop -- no new art
generation needed, the sheet already has a clean IDLE row.

2026-07-30 fix: the first pass despilled per-frame, AFTER compositing onto the padded canvas,
in only a 3px band derived from the (already blurred) canvas alpha. Thin twin-tail hair
strands are 2-4px wide, so most of the strand never fell inside that band -- true green-spill
fringe pixels survived with G well above R/B, invisible against Read's white preview but a
loud teal/green cast once composited over the game's dark backgrounds. Fix: despill on the
RAW full-resolution sheet, before any cropping/blur/compositing, using a wider band + an
interior clamp (same two-tier approach as the ARPG's proven key_and_crop), so thin strands
get the same treatment as everything else.
"""
import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = "/mnt/user-data/uploads/game3d/tools/dancer_mvc.png"
OUT = "/home/claude/spire/gen/dancer_frames"
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGBA")
a = np.array(im).copy()
H, W = a.shape[:2]
R, Gc, B = (a[:, :, i].astype(int) for i in range(3))

# hard green-screen key on the RAW sheet (relaxed thresholds, matches gen_sprites.py's rationale)
bg = ((Gc - R) > 25) & ((Gc - B) > 25) & (Gc > 95)

# two-tier despill on the FULL sheet, before any cropping/blur -- edge band first (wide enough
# to cover a whole thin hair strand, not just its outermost pixel), then a milder interior pass.
band = ndimage.binary_dilation(bg, iterations=4) & ~bg
spill_edge = band & (Gc > np.maximum(R, B) + 4)
a[:, :, 1] = np.where(spill_edge, np.maximum(R, B), a[:, :, 1])
Gc2 = a[:, :, 1].astype(int)
spill_interior = (~bg) & ((Gc2 - np.maximum(R, B)) > 16)
a[:, :, 1] = np.where(spill_interior, np.maximum(R, B), a[:, :, 1])

alpha_hard = np.where(bg, 0, 255).astype(np.uint8)
alpha_soft = np.array(Image.fromarray(alpha_hard).filter(ImageFilter.GaussianBlur(0.6)))
a[:, :, 3] = alpha_soft

# COLOR EXTRUSION (the actual fix for the teal-hair bug): fully-transparent pixels still carry
# whatever RGB the green screen left behind. That's invisible at 1:1 scale, but the moment the
# game upscales her (Spire.spawn sizes every sprite to a target height), the browser's own
# bilinear resample blends each edge pixel with its transparent neighbor's leftover color --
# and her twin-tail hair is only 2-4px wide, so nearly the whole strand is "edge". Fix: push
# every transparent pixel's RGB to match the NEAREST opaque pixel's color, so any blend the
# resampler does lands on a real color instead of a spill artifact.
opaque = alpha_hard > 40
_, (iy, ix) = ndimage.distance_transform_edt(~opaque, return_indices=True)
for c in range(3):
    a[:, :, c] = np.where(opaque, a[:, :, c], a[iy, ix, c])

# blob-finding (row clustering / frame boxes) uses an opened copy so captions/speckle don't
# register as figures -- but the pixel data sliced out below is the despilled `a` above, at
# full (non-eroded) resolution, so thin strands keep their real alpha instead of being eaten.
fg_open = ndimage.binary_opening(~bg, iterations=2)
lbl, n = ndimage.label(fg_open)
print("blobs found:", n)
blobs = []
for sl in ndimage.find_objects(lbl):
    h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
    if h < H * 0.05:
        continue
    blobs.append((sl[0].start, sl[0].stop, sl[1].start, sl[1].stop))
blobs.sort(key=lambda b: b[0])
rows = []
for b in blobs:
    for r in rows:
        if b[0] < r["y1"] and b[1] > r["y0"]:
            r["y0"] = min(r["y0"], b[0]); r["y1"] = max(r["y1"], b[1]); r["blobs"].append(b); break
    else:
        rows.append({"y0": b[0], "y1": b[1], "blobs": [b]})
rows.sort(key=lambda r: r["y0"])
print("rows:", [(r["y0"], r["y1"], len(r["blobs"])) for r in rows])

# IDLE is the first (topmost) row of figures
idle = rows[0]
frames = sorted(idle["blobs"], key=lambda b: b[2])
print("idle frames:", len(frames))

cw = max(b[3] - b[2] for b in frames) + 24
ch = max(b[1] - b[0] for b in frames) + 24
raw_fg = ~bg   # hard (unopened) foreground -- used only to find the caption cutoff row below

made = []
for i, (y0, y1, x0, x1) in enumerate(frames, 1):
    # trim the "1..6" caption printed directly under each figure (see body-row-count heuristic
    # from the previous pass -- unchanged, it isn't related to the color bug).
    raw_tile_a = raw_fg[y0:y1, x0:x1]
    row_counts = raw_tile_a.sum(axis=1)
    peak = row_counts.max()
    body_rows = np.where(row_counts >= 0.3 * peak)[0]
    body_bottom = int(body_rows.max()) if len(body_rows) else (y1 - y0 - 1)
    y1c = y0 + min(y1 - y0, body_bottom)

    tile = a[y0:y1c, x0:x1].copy()   # already despilled + alpha-feathered, full resolution
    canvas = np.zeros((ch, cw, 4), np.uint8)
    ys, xs = np.where(tile[:, :, 3] > 40)
    cx = int(xs.mean()) if len(xs) else tile.shape[1] // 2
    ox = cw // 2 - cx
    oy = ch - 12 - tile.shape[0]
    ox = max(0, min(cw - tile.shape[1], ox))
    canvas[oy:oy + tile.shape[0], ox:ox + tile.shape[1]] = tile

    # DIGIT SCRUB (2026-08-05 art QA): the sheet's "1..6" captions overlap her body, so a
    # white chip of the digit survives the row cut inside the bottom band. The digit is
    # near-pure white ringed in near-black stroke -- kill bright(>=215) pixels within 4px
    # of a near-dark(<=62) ring in the bottom 30%, plus the ring itself.
    b0 = int(ch * 0.70)
    sub = canvas[b0:, :, :]
    dR, dG, dB, dA = (sub[:, :, k].astype(int) for k in range(4))
    dop = dA > 40
    dbright = dop & (np.minimum(np.minimum(dR, dG), dB) >= 215)
    ddark = dop & (np.maximum(np.maximum(dR, dG), dB) <= 62)
    chipw = dbright & ndimage.binary_dilation(ddark, iterations=4)
    chipd = ddark & ndimage.binary_dilation(chipw, iterations=5)
    chip = ndimage.binary_dilation(chipw | chipd, iterations=1) & dop
    sub[:, :, 3] = np.where(chip, 0, sub[:, :, 3])
    canvas[b0:, :, :] = sub

    name = f"dc_idle_{i}"
    Image.fromarray(canvas, "RGBA").save(os.path.join(OUT, name + ".png"))
    made.append(name)
    print("wrote", name, canvas.shape)

print("done:", made)
