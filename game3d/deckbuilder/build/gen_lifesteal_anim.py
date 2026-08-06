#!/usr/bin/env python3
"""
gen_lifesteal_anim.py — the deckbuilder's two new warlock animation sets for the
life-steal card package (Hiro, 2026-08-06):

  wl_drain     (6f) — she siphons crimson life-threads into her open palm
  wl_bloodrite (6f) — a blood-rune ritual channel (Thirst / ward / feast casts)

REFERENCE (art-pipeline rule: never invent the first instance): every frame is an
xAI EDIT of the approved new-warlock idle — newwarlock_idle_1.png — the same
greenlit anchor her existing sets were built from. Output frames land beside them:
  <SRC>/sprites/warlock/forms/newwarlock/newwarlock_drain_N.png / _bloodrite_N.png
Keyed on MAGENTA (post 2026-07-19 policy), median-corner keyer + magenta despill,
FULL-CANVAS (no per-frame crop) so build_assets.py's centroid registration rules.
Run: python3 gen_lifesteal_anim.py [--force]   (skips frames that already exist)
"""
import os, sys, json, base64, io, time, urllib.request

SRC   = "/mnt/user-data/uploads/game3d/assets"
TOOLS = "/mnt/user-data/uploads/game3d/tools"
OUT   = os.path.join(SRC, "sprites/warlock/forms/newwarlock")
RAW   = "/home/claude/spire/build/gen_art_raw"
REF   = os.path.join(OUT, "newwarlock_idle_1.png")
API   = "https://api.x.ai/v1"
MODEL = "grok-imagine-image-quality"
KEY   = open(os.path.join(TOOLS, "xai_key.txt")).read().strip()

BIBLE = ("EXACTLY the same character as the reference image: an anime dark-elf sorceress with "
         "rich dark brown skin, long black locs woven with crimson-red strands, pointed ears, "
         "gold jewelry and fine gold chains, revealing layered tan-and-brown silk robes with "
         "gold trim and a long slit skirt, brown gladiator sandal heels, violet-purple flame magic")
STYLE = ("clean anime cel-shaded dark-fantasy style, crisp lineart, dramatic rim light, "
         "full body head to feet, single character, centered, side view FACING RIGHT")
MAGENTA = ("on a perfectly FLAT, UNIFORM, highly SATURATED pure MAGENTA background (hex FF00FF, "
           "like chroma-key studio footage), the magenta covering EVERY pixel of the background "
           "right to all four corners and edges, no gradient, no scenery, no ground, no cast "
           "shadow, no text, no extra characters")

DRAIN = [
  "she thrusts her open clawed right hand forward to the right, violet-crimson magic just beginning to swirl around her spread fingers, stance braced",
  "her right arm fully extended to the right, a thin stream of glowing crimson energy ribbons flowing from the right edge of frame INTO her open palm, her locs beginning to lift",
  "her right arm fully extended to the right, the crimson stream at FULL intensity — many ribbons of glowing blood-red energy spiraling into her palm and winding up her forearm, hair and silk robes blowing back",
  "she clenches that hand into a fist, the crimson ribbons condensing into one bright red-violet orb of stolen life burning at her fist",
  "she draws the fist back against her chest, the glowing crimson orb sinking into her sternum, a wash of warm red light over her skin, eyes half closed in satisfaction",
  "recovery pose: the hand lowering back down, only faint last wisps of crimson fading around her, a subtle red afterglow on her skin",
]
BLOODRITE = [
  "she raises both arms out from her sides, palms turned up, faint blood-red arcane glyph-runes just beginning to kindle in the air around her",
  "both arms raised high, a ring of glowing blood-red arcane runes orbiting her waist, her silk robes beginning to billow upward",
  "the rune ring blazing bright around her, twin helix streams of crimson energy rising around her body, her head tilted back, locs floating",
  "crescendo: the crimson runes flaring white-hot at their cores, a column of red light around her, hair and robes fully lifted by the magical updraft",
  "she snaps both arms down in a sharp final gesture, the rune ring contracting tight against her body, crimson light sinking into her skin",
  "recovery pose: arms settling back to her sides, the last two or three runes guttering out, a faint red shimmer remaining on her skin",
]

def post(path, body):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode(),
        headers={"Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)
        except Exception as e:
            if attempt == 3: raise
            print("  retry", attempt + 1, e); time.sleep(8 * (attempt + 1))

def edit(prompt):
    b64 = base64.b64encode(open(REF, "rb").read()).decode()
    resp = post("/images/edits", {"model": MODEL, "prompt": prompt, "aspect_ratio": "9:16",
        "response_format": "b64_json", "image": {"url": "data:image/png;base64," + b64, "type": "image_url"}})
    d = resp["data"][0]
    return base64.b64decode(d["b64_json"])

def key_magenta(raw, out_path):
    """median-corner chroma key (magenta), edge despill, feathered alpha, FULL canvas."""
    import numpy as np
    from PIL import Image, ImageFilter
    from scipy import ndimage
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    a = np.array(im); h, w = a.shape[:2]
    R, G, B = (a[:, :, i].astype(int) for i in range(3))
    corners = [a[0:6,0:6,:3].reshape(-1,3).mean(0), a[0:6,-6:,:3].reshape(-1,3).mean(0),
               a[-6:,0:6,:3].reshape(-1,3).mean(0), a[-6:,-6:,:3].reshape(-1,3).mean(0)]
    c = np.median(np.array(corners), axis=0)
    bgmask = (np.abs(a[:,:,:3].astype(int) - c).sum(2) < 70)
    # magenta anywhere (hot pink pockets between limbs aren't always border-connected)
    hot = (R > 120) & (B > 110) & (G < 0.55 * np.minimum(R, B))
    lbl, _ = ndimage.label(bgmask | hot)
    edge = set(lbl[0,:]) | set(lbl[-1,:]) | set(lbl[:,0]) | set(lbl[:,-1]); edge.discard(0)
    bg = np.isin(lbl, list(edge)) | hot
    bg = ndimage.binary_dilation(bg, iterations=1)
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    # despill the pink rim: pull excess R/B toward G in a band along the edge
    band = ndimage.binary_dilation(bg, iterations=3) & ~bg
    pink = band & (R > G + 60) & (B > G + 60)
    a[:,:,0] = np.where(pink, np.minimum(R, G + 60), a[:,:,0])
    a[:,:,2] = np.where(pink, np.minimum(B, G + 60), a[:,:,2])
    alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8)))
    a[:,:,3] = alpha
    tfrac = float((alpha < 40).mean())
    if tfrac < 0.10:
        print(f"  !! LOW-KEY WARNING {os.path.basename(out_path)}: {tfrac*100:.1f}% keyed "
              f"(corners {[list(map(int,x)) for x in corners]})")
    Image.fromarray(a, "RGBA").save(out_path)

def main():
    force = "--force" in sys.argv
    os.makedirs(RAW, exist_ok=True)
    jobs = [("drain", DRAIN), ("bloodrite", BLOODRITE)]
    for name, frames in jobs:
        for i, pose in enumerate(frames, 1):
            out = os.path.join(OUT, f"newwarlock_{name}_{i}.png")
            if os.path.exists(out) and not force:
                print("skip", os.path.basename(out)); continue
            prompt = f"{BIBLE}. Now shown mid-animation: {pose}. {STYLE}, {MAGENTA}"
            print(f"gen {name} {i}/6 ...")
            raw = edit(prompt)
            open(os.path.join(RAW, f"newwarlock_{name}_{i}.png"), "wb").write(raw)
            key_magenta(raw, out)
    print("DONE")

if __name__ == "__main__":
    main()
