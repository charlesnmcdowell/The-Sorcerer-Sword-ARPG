#!/usr/bin/env python3
"""
gen_sprites.py — one-command sprite generator for the 2.5D uplift (xAI Grok Imagine).

WHY LOCAL: the scheduled sandbox can't reach api.x.ai (egress proxy 403s key-bearing
calls), so you run this on your PC. It calls xAI for every sprite in the MANIFEST,
keeps the warlock ON-MODEL by editing your approved idle as a reference, then
auto-keys the green screen + crops, and drops game-ready transparent PNGs into
game3d/art_in/ where the build ingests them (it makes the normal maps).

RUN (Windows, from the game3d/tools folder):
    pip install pillow numpy scipy
    python gen_sprites.py                # generates everything missing
    python gen_sprites.py warlock_walk lich    # only specific names
    python gen_sprites.py --force demonlord     # regenerate even if it exists

Key is read from xai_key.txt (gitignored) or the XAI_API_KEY env var.
Re-running is safe: it SKIPS sprites already in art_in/ (unless --force).
"""
import os, sys, json, base64, time, urllib.request, urllib.error

HERE   = os.path.dirname(os.path.abspath(__file__))
G3D    = os.path.dirname(HERE)
ARTIN  = os.path.join(G3D, "art_in")
RAW    = os.path.join(ARTIN, "raw")
# approved hero = the consistency anchor for every edit. tools/ref_warlock_idle.png is a STABLE
# copy the build's intake never moves (art_in/ gets emptied as the build ingests sprites).
REF = next((p for p in [
    os.path.join(HERE, "ref_warlock_idle.png"),
    os.path.join(ARTIN, "warlock_idle.png"),
    os.path.join(G3D, "assets", "sprites", "_src", "warlock_idle_v2_keyed.png"),
    os.path.join(G3D, "assets", "sprites", "warlock_idle.png"),
] if os.path.exists(p)), os.path.join(HERE, "ref_warlock_idle.png"))
API    = "https://api.x.ai/v1"
MODEL  = "grok-imagine-image-quality"

# ---- consistent prompt building blocks --------------------------------------
BIBLE  = ("the SAME anime dark-elf sorcerer: long silver-white hair, lavender-grey skin, "
          "pointed ears, glowing violet eyes, ornate black-and-charcoal layered robes with "
          "teal glowing arcane runes, a tall ornate staff topped with a violet crystal, and a "
          "glowing teal spellbook")
STYLE  = "clean anime cel-shaded dark-fantasy style, crisp lineart, dramatic rim light"
CHAR   = STYLE + ", full body head to boots, single character, centered"
CREAT  = STYLE + ", full creature, single subject, centered"
GREEN  = ("on a FLAT SOLID chroma-green background (hex 00FF00), no scenery, no ground, "
          "no cast shadow, no text, no extra characters")

# ---- THE MANIFEST: every sprite I need.  mode 'edit' = stays on-model via REF. --
# (name, mode, aspect, prompt)  — enemies are a later tier; warlock + his kit first.
MANIFEST = [
 # WARLOCK — SIDE-ON fighting stances facing RIGHT, EDITED from the approved (front-facing) design so he stays on-model
 ("warlock_idle",   "edit", "3:4", f"Keep {BIBLE} EXACTLY the same character. Re-pose him SIDE-ON, body in profile FACING RIGHT, a relaxed combat-ready fighting stance, staff planted in one hand, glowing tome in the other. {CHAR}, {GREEN}."),
 ("warlock_walk",   "edit", "3:4", f"Keep {BIBLE} EXACTLY the same character. SIDE-ON, profile FACING RIGHT, mid-stride walking to the right, robe and hair trailing. {CHAR}, {GREEN}."),
 ("warlock_cast",   "edit", "3:4", f"Keep {BIBLE} EXACTLY the same character. SIDE-ON, profile FACING RIGHT, casting a spell forward to the right: free hand thrust out, staff raised, crackling violet magic. {CHAR}, {GREEN}."),
 ("warlock_hurt",   "edit", "3:4", f"Keep {BIBLE} EXACTLY the same character. SIDE-ON, profile FACING RIGHT, recoiling backward in pain, staggered. {CHAR}, {GREEN}."),
 # TRANSFORMATIONS — same character, SIDE-ON facing right, combat stance, true to color schemes
 ("lich",      "edit", "3:4", f"Transform this same sorcerer into his LICH / grim-reaper form, SIDE-ON FACING RIGHT in a combat stance: gaunt undead, skeletal hands, tattered black-and-bone robes, a great curved scythe, cold GREEN soul-fire. bone-white and ghost-green color scheme. {CHAR}, {GREEN}."),
 ("archdevil", "edit", "3:4", f"Transform this same sorcerer into his ARCH-DEVIL form, SIDE-ON FACING RIGHT: a towering crimson devil with great horns, burning red-orange hellfire, tattered dark robes, menacing. crimson, black and fire color scheme. {CHAR}, {GREEN}."),
 ("demonlord", "edit", "3:4", f"Transform this same sorcerer into his DEMON LORD form, SIDE-ON FACING RIGHT: a bigger BLACK and toxic-GREEN version of the same sorcerer, black robes with green sheol-fire runes, green flames on his staff and tome, commanding. black-and-green color scheme. {CHAR}, {GREEN}."),
 # SUMMONS / ENEMIES — SIDE-ON FACING LEFT (toward the right-facing warlock); the engine flips them per side
 ("clawfiend",   "gen", "1:1",  f"A hulking dark-fantasy CLAW FIEND demon, SIDE-ON FACING LEFT, lunging combat pose, huge claws, glowing eyes, purple-black. {CREAT}, {GREEN}."),
 ("bonedragon",  "gen", "16:9", f"A dark-fantasy BONE DRAGON, SIDE-ON FACING LEFT, wings spread, skeletal pale-bone body, sickly green acid dripping from its maw. bone-and-green color scheme. {CREAT}, {GREEN}."),
 ("blackdragon", "gen", "16:9", f"A dark-fantasy BLACK DRAGON, SIDE-ON FACING LEFT, wings spread, sleek obsidian-black scales with a sickly-green underglow, breathing green fire. black-and-green color scheme. {CREAT}, {GREEN}."),
 ("succubus",    "gen", "3:4",  f"An anime SUCCUBUS demon, SIDE-ON FACING LEFT, flying combat pose, violet-pink skin, black bat wings, conjuring a small fireball. {CREAT}, {GREEN}."),
 ("archsuccubus","gen", "3:4",  f"An anime ARCH-SUCCUBUS demon, SIDE-ON FACING LEFT, in a BLACK and toxic-GREEN scheme: black bat wings edged with green, wreathed in green sheol-fire, hurling a green fireball. black-and-green color scheme. {CREAT}, {GREEN}."),
 # LICH's summon roster (raised in lich form, distinct from the living warlock's): shamblers @6s, bone archers @8s
 ("shambler",  "gen", "3:4",  f"An anime dark-fantasy ZOMBIE SHAMBLER raised by a lich, SIDE-ON FACING LEFT, lurching undead minion, rotting greyed flesh, tattered rags, sickly green necrotic glow. {CREAT}, {GREEN}."),
 ("bonearcher","gen", "3:4",  f"An anime dark-fantasy BONE ARCHER raised by a lich, SIDE-ON FACING LEFT, a skeletal undead drawing a bone bow with a bone-shaft arrow, tattered, cold green soul-glow. {CREAT}, {GREEN}."),
]

# ---- xAI calls (OpenAI SDK's edit() is multipart-only & unsupported; use JSON HTTP) ----
def _key():
    k = os.environ.get("XAI_API_KEY")
    if not k:
        p = os.path.join(HERE, "xai_key.txt")
        if os.path.exists(p): k = open(p).read().strip()
    if not k: sys.exit("No API key. Put it in xai_key.txt or set XAI_API_KEY.")
    return k

def _post(path, body):
    req = urllib.request.Request(API+path, data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {_key()}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read().decode())

def _img_bytes(resp):
    d = resp["data"][0]
    if d.get("b64_json"): return base64.b64decode(d["b64_json"])
    with urllib.request.urlopen(d["url"], timeout=180) as r: return r.read()

def generate(prompt, aspect):
    return _img_bytes(_post("/images/generations",
        {"model": MODEL, "prompt": prompt, "aspect_ratio": aspect, "response_format": "b64_json"}))

def edit(prompt, ref_path, aspect):
    b64 = base64.b64encode(open(ref_path, "rb").read()).decode()
    return _img_bytes(_post("/images/edits",
        {"model": MODEL, "prompt": prompt, "aspect_ratio": aspect, "response_format": "b64_json",
         "image": {"url": f"data:image/png;base64,{b64}", "type": "image_url"}}))

# ---- green-screen key + crop (generalized: keys the dominant flat border color) ----
def key_and_crop(in_bytes, out_path):
    import numpy as np
    from PIL import Image, ImageFilter
    from scipy import ndimage
    im = Image.open(__import__("io").BytesIO(in_bytes)).convert("RGBA")
    a = np.array(im); h, w = a.shape[:2]; R,Gc,B = (a[:,:,i].astype(int) for i in range(3))
    # is the background green? (our prompt asks for it). else fall back to corner color.
    corner = a[0:6,0:6,:3].reshape(-1,3).mean(0)
    greenish = (corner[1] > corner[0]+30) and (corner[1] > corner[2]+30)
    if greenish:
        bgmask = ((Gc-R)>40) & ((Gc-B)>40) & (Gc>110)
    else:
        c = corner; bgmask = (np.abs(a[:,:,:3].astype(int)-c).sum(2) < 40)
    lbl,_ = ndimage.label(bgmask)
    edge = set(lbl[0,:])|set(lbl[-1,:])|set(lbl[:,0])|set(lbl[:,-1]); edge.discard(0)
    bg = np.isin(lbl, list(edge))
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    if greenish:  # despill green fringe
        keep = alpha>0; spill = keep & ((Gc-np.maximum(R,B))>25)
        a[:,:,1] = np.where(spill, np.maximum(R,B), a[:,:,1])
    alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.7)))
    a[:,:,3] = alpha
    ys,xs = np.where(alpha>40)
    if len(xs)==0: Image.fromarray(a,"RGBA").save(out_path); return
    pad=12; y0,y1=max(0,ys.min()-pad),min(h,ys.max()+pad); x0,x1=max(0,xs.min()-pad),min(w,xs.max()+pad)
    Image.fromarray(a[y0:y1,x0:x1],"RGBA").save(out_path)

def main():
    os.makedirs(RAW, exist_ok=True)
    args = [x for x in sys.argv[1:] if not x.startswith("--")]
    force = "--force" in sys.argv
    todo = [m for m in MANIFEST if (not args or m[0] in args)]
    if not todo: sys.exit("Nothing matches: " + " ".join(args))
    for name, mode, aspect, prompt in todo:
        out = os.path.join(ARTIN, f"{name}.png")
        if os.path.exists(out) and not force:
            print(f"skip {name} (exists)"); continue
        if mode == "edit" and not os.path.exists(REF):
            print(f"skip {name}: need {REF} (the approved warlock_idle) first"); continue
        print(f"generating {name} ({mode}, {aspect}) ...", flush=True)
        try:
            raw = edit(prompt, REF, aspect) if mode=="edit" else generate(prompt, aspect)
        except urllib.error.HTTPError as e:
            print(f"  ERROR {e.code}: {e.read()[:200]}"); time.sleep(2); continue
        except Exception as e:
            print(f"  ERROR {type(e).__name__}: {str(e)[:160]}"); continue
        open(os.path.join(RAW, f"{name}.png"), "wb").write(raw)   # keep the raw (green bg)
        key_and_crop(raw, out)
        print(f"  -> {out}")
        time.sleep(1.5)   # gentle on rate limits
    print("\nDone. The game3d-build schedule will ingest art_in/*.png (normal maps + lighting).")

if __name__ == "__main__":
    main()
