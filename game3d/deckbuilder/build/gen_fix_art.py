#!/usr/bin/env python3
"""
gen_fix_art.py — two corrections (2026-08-08, budget-aware: ~$4.4 of xAI credit left):

1. TSUBAKI IDLE REDO (4 edits): the first idle's four frames were four different
   poses — looped at 8fps she appeared to "turn over and over". New approach:
   ONE stable stance (body 3/4 to the viewer, head toward the enemy), then the
   remaining frames are EDITS OF THAT FRAME with only a breathing shift.
2. SERA CANON CORRECTION (18 frames): the books say Rapier of Arrest + force-blade
   off-hand, short dark hair, olive skin, dark scout leathers, NO heavy armor
   (Book 1 ch01/02, Book 2 ch15). Regenerated via edit-chain from one keyframe.
"""
import os, sys, json, base64, io, time, urllib.request

SRC   = "/mnt/user-data/uploads/game3d/assets"
TOOLS = "/mnt/user-data/uploads/game3d/tools"
RAW   = "/home/claude/spire/build/gen_art_raw"
REFCROP = "/home/claude/spire/build/samurai_ref_crop.png"
API   = "https://api.x.ai/v1"
MODEL = "grok-imagine-image-quality"
KEY   = open(os.path.join(TOOLS, "xai_key.txt")).read().strip()

MAGENTA = ("on a perfectly FLAT, UNIFORM, highly SATURATED pure MAGENTA background (hex FF00FF), "
           "the magenta covering EVERY pixel of the background right to all four corners and edges, "
           "no gradient, no scenery, no ground, no cast shadow, no text, no extra characters")
STYLE_R = ("clean anime cel-shaded dark-fantasy style, crisp lineart, dramatic rim light, "
           "full body head to feet, single character, centered, side view FACING RIGHT")
STYLE_L = ("clean anime cel-shaded dark-fantasy style, crisp lineart, dramatic rim light, "
           "full body head to feet, single character, centered, side view FACING LEFT")

KD_BIBLE = ("EXACTLY the same character as the reference image: a pale-skinned female samurai with "
            "voluminous black curly afro-textured hair pinned with gold ornaments, red eyes, ornate "
            "black-and-gold lacquered samurai armor, tattered dark-red sash and skirt, black "
            "thigh-high armored boots, and a single sheathed katana")
KD_POSE = ("standing at rest in a calm relaxed guard: body angled three-quarters toward the viewer, "
           "head turned to HER RIGHT watching an opponent off-frame to the right, left hand resting "
           "on the sheathed katana at her hip, right arm loose, feet planted shoulder-width, "
           "perfectly balanced, serene, no motion blur")
KD_BREATH = [
  None,   # frame 1 = the anchor
  "with ONLY the tiniest natural breathing change: her chest very slightly risen, one strand of hair drifted a few pixels — everything else IDENTICAL",
  "with ONLY the tiniest natural breathing change: her shoulders very slightly settled, the sash swayed a few pixels — everything else IDENTICAL",
  "with ONLY the tiniest natural breathing change: her head tilted one degree, hair drifted back — everything else IDENTICAL",
]

SR_BIBLE = ("EXACTLY the same character as the reference image: a veteran human swordswoman in her "
            "mid-forties — SHORT DARK hair pulled back severe, olive skin, sharp assessing scarred "
            "face, dark practical scout's leathers over a worn leather vest with a faded academy-blue "
            "sash, NO heavy armor and NO shield, wielding a slender elegant RAPIER in her right hand "
            "and, when drawn, a short blade of glowing violet-white FORCE energy in her left")
SR_SETS = [
 ("idle", ["ready duelist's stance, rapier low, force-hand empty and loose, weight balanced, watching",
           "the same stance with only a subtle shift: rapier tip drifting an inch, breath settling",
           "the same stance, off-hand beginning to glow faintly violet-white"]),
 ("walk", ["measured duelist's advance, rapier back, lateral footwork",
           "next gliding stride, blade angled, eyes level",
           "stride at full reach, cloakless leathers moving with her",
           "settling step, perfectly balanced"]),
 ("attack",["the ARREST: a lightning-fast rapier lunge to the LEFT, blade a silver line, body fully extended",
            "TWIN FANG: rapier cutting lateral to the LEFT while a short violet-white force blade in her off-hand scissors in from the opposite angle",
            "BREACH RAY: her off-hand thrust to the LEFT, a devastating ray of white lightning erupting from a shard of crystallized gate-energy",
            "recovery to her tight defensive frame, rapier vertical before her — the Cage"]),
 ("hurt", ["parrying late, driven back a half step, teeth gritted",
           "grimacing, off-hand pressed to her side, rapier still up",
           "re-setting the Cage, spitting to the side"]),
 ("death",["knee buckling, rapier point dropping to the stones",
           "down on one knee, propped on the rapier, head bowed, breathing hard",
           "kneeling, one hand raised in a grudging yield, eyes still sharp",
           "still kneeling, alive, unbeaten in spirit, watching her opponent go"]),
]

def post(path, body):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode(),
        headers={"Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=240) as r:
                return json.load(r)
        except Exception as e:
            if attempt == 2: raise
            time.sleep(8)

def img_of(r): return base64.b64decode(r["data"][0]["b64_json"])

def edit(prompt, ref_path):
    b64 = base64.b64encode(open(ref_path, "rb").read()).decode()
    return img_of(post("/images/edits", {"model": MODEL, "prompt": prompt, "aspect_ratio": "9:16",
        "response_format": "b64_json", "image": {"url": "data:image/png;base64," + b64, "type": "image_url"}}))

def key_crop(raw, out_path):
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
    y0, y1 = max(0, ys.min()-10), min(im.height, ys.max()+10)
    x0, x1 = max(0, xs.min()-10), min(im.width, xs.max()+10)
    Image.fromarray(a, "RGBA").crop((x0, y0, x1, y1)).save(out_path)

def main():
    os.makedirs(RAW, exist_ok=True)
    kd_dir = os.path.join(SRC, "sprites/samurai")
    # ---- 1) Tsubaki idle redo: anchor frame, then breathing edits of it ----
    anchor = os.path.join(kd_dir, "kd_idle_1.png")
    print("kd_idle_1 (new anchor) ...", flush=True)
    raw = edit(f"{KD_BIBLE}. She is {KD_POSE}. {STYLE_R}, {MAGENTA}", REFCROP)
    open(os.path.join(RAW, "kd_idle_new_1.png"), "wb").write(raw)
    key_crop(raw, anchor)
    for i in (2, 3, 4):
        print(f"kd_idle_{i} (breath edit) ...", flush=True)
        raw = edit(f"EXACTLY this same image, character, pose, camera and framing, {KD_BREATH[i-1]}. {MAGENTA}", anchor)
        open(os.path.join(RAW, f"kd_idle_new_{i}.png"), "wb").write(raw)
        key_crop(raw, os.path.join(kd_dir, f"kd_idle_{i}.png"))
    # ---- 2) Sera canon redo: keyframe from her old idle? No — fresh from prompt via edit on Tsubaki?
    # Use generation-free approach: first frame via /images/generations, then edit-chain.
    sdir = os.path.join(SRC, "sprites/enemies/sera")
    first = os.path.join(sdir, "sera_idle_1.png")
    print("sera_idle_1 (new anchor) ...", flush=True)
    r = post("/images/generations", {"model": MODEL,
        "prompt": ("a veteran human swordswoman in her mid-forties: SHORT DARK hair pulled back severe, "
                   "olive skin, sharp assessing scarred face, dark practical scout's leathers over a worn "
                   "leather vest with a faded academy-blue sash, NO heavy armor, a slender elegant RAPIER "
                   "held low in her right hand. Ready duelist's stance, watching. " + STYLE_L + ", " + MAGENTA),
        "aspect_ratio": "9:16", "response_format": "b64_json"})
    raw = img_of(r)
    open(os.path.join(RAW, "sera_new_idle_1.png"), "wb").write(raw)
    key_crop(raw, first)
    for setname, poses in SR_SETS:
        for i, pose in enumerate(poses, 1):
            if setname == "idle" and i == 1: continue
            out = os.path.join(sdir, f"sera_{setname}_{i}.png")
            print(f"sera_{setname}_{i} ...", flush=True)
            raw = edit(f"{SR_BIBLE}. Now shown mid-animation: {pose}. {STYLE_L}, {MAGENTA}", first)
            open(os.path.join(RAW, f"sera_new_{setname}_{i}.png"), "wb").write(raw)
            key_crop(raw, out)
    print("DONE")

if __name__ == "__main__":
    main()
