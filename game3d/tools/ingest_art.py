#!/usr/bin/env python3
"""
ingest_art.py — the BUILD-side art intake (Phaser-AE block, harvested 2026-06-27).

What gen_sprites.py drops into art_in/ is already keyed+cropped (transparent bg).
THIS script does the build's half: for each named (or all) art_in/*.png that is NOT a
_preview/_summons helper, it:
  1. caps the longest side to <=512px (asset weight; world scale is done at render time),
  2. auto-generates a Sobel normal map from the alpha-masked luminance (RGBA, a=mask),
  3. writes assets/sprites/<name>.png + <name>_n.png,
  4. archives the source keyed PNG to assets/sprites/_src/<name>.png,
  5. prints a per-type TARGET WORLD HEIGHT (the render scale table) so wiring is mechanical.

Run from game3d/tools:  python ingest_art.py            # all pending
                        python ingest_art.py lich demonlord
Idempotent-ish: pass names to redo specific sprites (overwrites).
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
G3D  = os.path.dirname(HERE)
ARTIN = os.path.join(G3D, "art_in")
DEST  = os.path.join(G3D, "assets", "sprites")
SRC   = os.path.join(DEST, "_src")
CAP   = 512

# per-type TARGET WORLD HEIGHT (Hiro's scale-normalize table; render applies displayScale
# = targetWorldH / sprite.pixelHeight). Source px size is irrelevant to this.
TARGET_WORLD_H = {
    "warlock_idle": 1.0, "warlock_walk": 1.0, "warlock_cast": 1.0, "warlock_hurt": 1.0,
    "warlock_summon": 1.0,  # SUMMON-channel pose (Hiro drop 2026-06-28) — same world height as warlock
    # FX sprites (not characters): height is render-time, listed for documentation only
    "fireball": 0.5, "fireball_hit": 0.7,
    "lich": 1.05, "archdevil": 1.3, "demonlord": 1.4,
    "clawfiend": 1.2, "bonedragon": 2.0, "blackdragon": 2.0,
    "succubus": 0.8, "archsuccubus": 0.9,
    # new side-on pit challengers (Hiro drop 2026-06-27): humanoid undead foes
    "shambler": 1.15, "bonearcher": 1.05,
    # pit.js FIGHTS[] roster foes (Hiro drop 2026-06-27 21:5x) — heights derived from the
    # original hitbox radii (warlock r~16 = 1.0): hound11 stitch13 hook14 gunner14 pyre15
    # necro15 grave16 master17 chain18 champ20 brute21 door26 beast30.
    "door": 1.5, "hook": 0.95, "chain": 1.15, "pyre": 1.0, "gunner": 0.95,
    "grave": 1.05, "stitch": 0.95, "brute": 1.35, "master": 1.1, "hound": 0.8,
    "necro": 1.0, "champ": 1.3, "beast": 1.9, "skel": 0.9,
}

def normal_from_alpha(rgba):
    """Sobel normal map from alpha-masked luminance. Returns RGBA uint8 (a = mask)."""
    a = np.asarray(rgba, np.float32)
    R, Gc, B, A = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    mask = (A > 40).astype(np.float32)
    lum = (0.299 * R + 0.587 * Gc + 0.114 * B) / 255.0
    # height = luminance inside the silhouette, smoothed; bg height 0
    h = lum * mask
    hI = Image.fromarray((np.clip(h, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.0))
    h = np.asarray(hI, np.float32) / 255.0
    gy, gx = np.gradient(h * 26.0)
    nx, ny, nz = -gx, -gy, np.ones_like(h)
    ln = np.sqrt(nx * nx + ny * ny + nz * nz) + 1e-6
    nx, ny, nz = nx / ln, ny / ln, nz / ln
    nm = np.zeros(h.shape + (4,), np.uint8)
    nm[..., 0] = ((nx * 0.5) + 0.5) * 255
    nm[..., 1] = ((ny * 0.5) + 0.5) * 255
    nm[..., 2] = ((nz * 0.5) + 0.5) * 255
    nm[..., 3] = (mask * 255).astype(np.uint8)
    return Image.fromarray(nm, "RGBA")

def cap(im):
    w, hgt = im.size
    m = max(w, hgt)
    if m <= CAP:
        return im
    s = CAP / m
    return im.resize((max(1, round(w * s)), max(1, round(hgt * s))), Image.LANCZOS)

def main():
    os.makedirs(SRC, exist_ok=True)
    args = sys.argv[1:]
    if args:
        names = args
    else:
        names = []
        for fn in sorted(os.listdir(ARTIN)):
            if not fn.endswith(".png") or fn.startswith("_"):
                continue
            name = fn[:-4]
            if os.path.exists(os.path.join(DEST, fn)):
                continue  # already ingested
            names.append(name)
    if not names:
        print("Nothing pending in art_in/ (all ingested).")
        return
    for name in names:
        ip = os.path.join(ARTIN, name + ".png")
        if not os.path.exists(ip):
            print(f"skip {name}: no art_in/{name}.png"); continue
        im = Image.open(ip).convert("RGBA")
        im = cap(im)
        im.save(os.path.join(DEST, name + ".png"))
        normal_from_alpha(im).save(os.path.join(DEST, name + "_n.png"))
        # archive the original keyed source (uncapped) for re-processing
        Image.open(ip).convert("RGBA").save(os.path.join(SRC, name + ".png"))
        tH = TARGET_WORLD_H.get(name, "?")
        print(f"  ingested {name}: {im.size} +_n  targetWorldH={tH}")
    print("Done. Wire any NEW names into arena.html preload + the world-scale table.")

if __name__ == "__main__":
    main()
