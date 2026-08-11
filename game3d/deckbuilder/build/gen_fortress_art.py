#!/usr/bin/env python3
"""
gen_fortress_art.py — Tsubaki's road redesign (Hiro, 2026-08-08):
  - BRASSVEIL: her own Act II city — cyber/magic-fantasy-punk, more advanced
    than Karridge (far panorama + mid street band, painterly full-bleed).
  - DRAKESPIRE KEEP: her Act III — storming the Dragon Emperor's fortress
    (far + mid layers).
  - SERA: the fortress boss — Kenji's first companion, champion swordswoman,
    twenty years on. Text-to-image enemy pipeline, faces LEFT, full sets.
Backgrounds: no chroma (full-bleed). Sera: magenta-keyed + tight-cropped.
"""
import os, sys, json, base64, io, time, urllib.request

SRC   = "/mnt/user-data/uploads/game3d/assets"
TOOLS = "/mnt/user-data/uploads/game3d/tools"
RAW   = "/home/claude/spire/build/gen_art_raw"
API   = "https://api.x.ai/v1"
MODEL = "grok-imagine-image-quality"
KEY   = open(os.path.join(TOOLS, "xai_key.txt")).read().strip()

SCENE = ("lush painterly Vanillaware DRAGON'S CROWN-style dark-fantasy background ART, richly "
         "hand-painted, deep atmospheric perspective, dramatic lighting, ZERO foreground "
         "characters, no text, no UI, no health bars")
E_STYLE = ("clean anime cel-shaded dark-fantasy style, crisp lineart, dramatic rim light, "
           "full body head to feet, single character, centered, side view FACING LEFT")
MAGENTA = ("on a perfectly FLAT, UNIFORM, highly SATURATED pure MAGENTA background (hex FF00FF), "
           "the magenta covering EVERY pixel of the background right to all four corners and "
           "edges, no gradient, no scenery, no ground, no cast shadow, no text, no extra characters")

BGS = [
  ("bg_bv_far.png",
   "sweeping night panorama of BRASSVEIL, an advanced arcane-punk fantasy city: tiered spires of "
   "brass and black stone laced with glowing teal and magenta ley-conduits like neon, floating "
   "glyph-signs in an invented script, airship masts, rain-slick rooftops catching colored light, "
   "distant dragon-shape silhouette high above the smog glow, " + SCENE),
  ("bg_bv_mid.png",
   "street-level band of BRASSVEIL, arcane-punk fantasy city at night: a rain-slick promenade of "
   "brass storefronts with glowing rune-signage in teal and magenta, steam vents, hanging cables "
   "with paper charms, holographic koi drifting between lamp posts, empty street, " + SCENE),
  ("bg_fort_far.png",
   "vast night view of DRAKESPIRE KEEP, the Dragon Emperor's mountain fortress: black basalt "
   "walls rising out of storm cloud, green lantern-light in arrow slits, colossal dragon-wing "
   "buttresses, a single high tower crowned in emerald flame, lightning behind the peaks, " + SCENE),
  ("bg_fort_mid.png",
   "inner courtyard band of DRAKESPIRE KEEP at night: rain on black flagstones, braziers of "
   "green imperial fire, banner poles bearing a black dragon sigil, the great keep doors ajar, "
   "empty of people, " + SCENE),
]

SERA_BIBLE = ("a veteran human swordswoman in her mid-forties: short storm-grey-streaked auburn hair, "
              "sharp scarred face, worn champion's half-armor over practical dark leathers, a green "
              "campaign cloak, and a masterwork longsword; hard-eyed, quick, economical")
SERA = [
 ("idle",  ["ready stance, longsword low in one hand, weight balanced", "shifting grip, cloak stirring", "settling, eyes narrowed"]),
 ("walk",  ["measured duelist's advance", "next stride, blade angled back", "stride, cloak swinging", "settling step"]),
 ("attack",["a fast lunging thrust to the LEFT, blade extended", "a follow-up diagonal cut to the LEFT, arc of light", "a shoulder-driven slash to the LEFT, cloak flaring", "recovery to guard"]),
 ("hurt",  ["parrying late, driven back a step", "grimacing, off-hand pressed to her side", "re-setting her guard, spitting"]),
 ("death", ["knee buckling, sword point dropping to the stones", "down on one knee, propped on the sword, head bowed", "kneeling, one hand raised in grudging yield", "still kneeling, alive, watching her opponent go"]),
]

def post(path, body):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode(),
        headers={"Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=240) as r:
                return json.load(r)
        except Exception as e:
            if attempt == 4: raise
            time.sleep(6 * (attempt + 1))

def gen(prompt, aspect):
    r = post("/images/generations", {"model": MODEL, "prompt": prompt,
        "aspect_ratio": aspect, "response_format": "b64_json"})
    return base64.b64decode(r["data"][0]["b64_json"])

def key_and_crop(raw, out_path):
    import numpy as np
    from PIL import Image, ImageFilter
    from scipy import ndimage
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    a = np.array(im); R, G, B = (a[:, :, i].astype(int) for i in range(3))
    corners = [a[0:6,0:6,:3].reshape(-1,3).mean(0), a[0:6,-6:,:3].reshape(-1,3).mean(0),
               a[-6:,0:6,:3].reshape(-1,3).mean(0), a[-6:,-6:,:3].reshape(-1,3).mean(0)]
    c = np.median(np.array(corners), axis=0)
    bgmask = (abs(a[:,:,:3].astype(int) - c).sum(2) < 70)
    hot = (R > 120) & (B > 110) & (G < 0.55 * np.minimum(R, B))
    lbl, _ = ndimage.label(bgmask | hot)
    edge = set(lbl[0,:]) | set(lbl[-1,:]) | set(lbl[:,0]) | set(lbl[:,-1]); edge.discard(0)
    bg = np.isin(lbl, list(edge)) | hot
    bg = ndimage.binary_dilation(bg, iterations=1)
    alpha = np.where(bg, 0, 255).astype("uint8")
    band = ndimage.binary_dilation(bg, iterations=3) & ~bg
    pink = band & (R > G + 60) & (B > G + 60)
    a[:,:,0] = np.where(pink, np.minimum(R, G + 60), a[:,:,0])
    a[:,:,2] = np.where(pink, np.minimum(B, G + 60), a[:,:,2])
    alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8)))
    a[:,:,3] = alpha
    ys, xs = np.where(alpha > 40)
    PAD = 10
    y0, y1 = max(0, ys.min()-PAD), min(im.height, ys.max()+PAD)
    x0, x1 = max(0, xs.min()-PAD), min(im.width, xs.max()+PAD)
    Image.fromarray(a, "RGBA").crop((x0, y0, x1, y1)).save(out_path)

def main():
    force = "--force" in sys.argv
    os.makedirs(RAW, exist_ok=True)
    bgdir = os.path.join(SRC, "backgrounds")
    os.makedirs(bgdir, exist_ok=True)
    from PIL import Image
    for fname, prompt in BGS:
        out = os.path.join(bgdir, fname)
        if os.path.exists(out) and not force: continue
        print(fname, "...", flush=True)
        raw = gen(prompt, "16:9")
        open(os.path.join(RAW, fname), "wb").write(raw)
        Image.open(io.BytesIO(raw)).convert("RGB").save(out)
    sdir = os.path.join(SRC, "sprites/enemies/sera")
    os.makedirs(sdir, exist_ok=True)
    for setname, poses in SERA:
        for i, pose in enumerate(poses, 1):
            out = os.path.join(sdir, f"sera_{setname}_{i}.png")
            if os.path.exists(out) and not force: continue
            prompt = f"{SERA_BIBLE}. The SAME character in every frame. Now shown mid-animation: {pose}. {E_STYLE}, {MAGENTA}"
            print(f"sera_{setname}_{i} ...", flush=True)
            try:
                raw = gen(prompt, "9:16")
                open(os.path.join(RAW, f"sera_{setname}_{i}.png"), "wb").write(raw)
                key_and_crop(raw, out)
            except Exception as e:
                print("  FAIL", e)
    print("DONE")

if __name__ == "__main__":
    main()
