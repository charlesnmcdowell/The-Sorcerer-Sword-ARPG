#!/usr/bin/env python3
"""
gen_samurai_art.py — TSUBAKI (the second playable character) + the Tempest School
enemies for her run (Hiro, 2026-08-08).

REFERENCE (art-pipeline rule): every Tsubaki frame is an xAI EDIT of Hiro's own
greenlit reference sheet crop — game3d/tools/refs/samurai.png (the Ieyasu-style
female samurai). The four new enemies (ninja / archer / monk / lightning sorcerer)
use the same text-to-image pipeline the existing deckbuilder roster was built with.
All output is UNREVIEWED until Hiro greenlights it in-game.

Output:
  <SRC>/sprites/samurai/kd_<set>_<n>.png        (Tsubaki, faces RIGHT)
  <SRC>/sprites/enemies/<name>/<name>_<set>_<n>.png  (enemies, face LEFT)
Magenta-keyed full canvas; heights normalized per set afterward by normalize().
Run: python3 gen_samurai_art.py [--force] [only-set-names...]
"""
import os, sys, json, base64, io, time, urllib.request

SRC   = "/mnt/user-data/uploads/game3d/assets"
TOOLS = "/mnt/user-data/uploads/game3d/tools"
RAW   = "/home/claude/spire/build/gen_art_raw"
REF   = os.path.join(TOOLS, "refs/samurai.png")
REFCROP = "/home/claude/spire/build/samurai_ref_crop.png"   # main pose crop, made below
API   = "https://api.x.ai/v1"
MODEL = "grok-imagine-image-quality"
KEY   = open(os.path.join(TOOLS, "xai_key.txt")).read().strip()

BIBLE = ("EXACTLY the same character as the reference image: a pale-skinned female samurai with "
         "voluminous black curly afro-textured hair pinned with gold ornaments, red eyes, small red "
         "facial markings, ornate black-and-gold lacquered samurai armor over a revealing curvy "
         "athletic build, tattered dark-red sash and skirt, black thigh-high armored boots, and a "
         "single katana")
STYLE_R = ("clean anime cel-shaded dark-fantasy style, crisp lineart, dramatic rim light, "
           "full body head to feet, single character, centered, side view FACING RIGHT")
MAGENTA = ("on a perfectly FLAT, UNIFORM, highly SATURATED pure MAGENTA background (hex FF00FF, "
           "like chroma-key studio footage), the magenta covering EVERY pixel of the background "
           "right to all four corners and edges, no gradient, no scenery, no ground, no cast "
           "shadow, no text, no extra characters")

# ---------------- Tsubaki: base sets + one unique set per card ----------------
# (set, frames, [keypose per frame])
KD = [
 ("idle", ["standing at rest, left hand resting on the sheathed katana at her hip, right arm relaxed, calm unreadable expression",
           "same stance, weight shifting slightly, hair drifting",
           "same stance, eyes narrowed a fraction, fingers curling on the sheath",
           "same stance, a slow exhale, shoulders settling"]),
 ("walk", ["mid-stride walking, hand on the sheathed katana, unhurried and silent",
           "walking, other foot forward, sash swaying",
           "walking, back foot lifting, posture perfectly level",
           "walking, stride at full extension, hair trailing",
           "walking, feet passing, gaze fixed ahead",
           "walking, settling into the next step, armor plates shifting"]),
 ("hurt", ["struck: flinching back, guard rising, teeth gritted",
           "recoiling a half step, blade raised defensively across her body",
           "recovering, settling back into stance, a thin cut across her armor"]),
 ("slash", ["iai draw beginning: crouched, hand on hilt, sheath angled, eyes locked forward",
            "the draw: katana half out of the sheath, a bright arc starting",
            "full horizontal draw-slash extended to the right, a clean silver arc of the blade",
            "follow-through: blade fully extended behind the cut, sash whipping"]),
 ("cross", ["first diagonal slash from high right to low left, blade trailing light",
            "pivoting, blade whipping back",
            "second diagonal slash from high left to low right, crossing the first arc",
            "recovery: blade out to the side, two faint crossing arc traces"]),
 ("guard", ["defensive stance: katana held two-handed, horizontal, braced like a wall",
            "the guard tightening, sparks off the blade edge",
            "holding the guard, feet planted wide, sash blowing back",
            "lowering the guard a fraction, controlled, ready"]),
 ("observe", ["patient sheathed stance: leaning slightly forward, hand hovering over the hilt, eyes glinting red",
              "same stance, head tilting a fraction, studying the foe",
              "same stance, a faint red gleam tracing her eyes, fingers settling on the hilt",
              "same stance, the barest smile, stance coiling lower"]),
 ("counter", ["deflecting: katana angled to turn a blow aside, a burst of sparks at the blade",
              "the deflect completing, enemy blade sliding off, her body already turning",
              "the instant riposte: a short brutal counter-cut to the right at waist height",
              "recovery: blade dripping, stance re-set, utterly calm"]),
 ("sneak", ["low assassin's crouch, almost flat, blade drawn backward and hidden behind her body",
            "exploding forward in a blur, body low, blade trailing shadow",
            "the strike from below: rising cut to the right, a dark-red arc",
            "past the target: kneeling slide, blade out wide, hair settling"]),
 ("oddhour", ["blade raised high overhead in both hands, moonlight glinting down the edge",
              "the overhead stroke falling, a vertical arc of white light",
              "the cut completing at the ground, floor cracked, arc still glowing",
              "rising back to stance, blade low, exhaling"]),
 ("artery", ["a precise fencer's lunge, blade tip leading, aimed at a point to the right",
             "the tip striking home, a thin dark-red jet from the point of contact",
             "the wrist-flick twist of the blade, red arcing off the tip",
             "stepping back coolly, flicking the blood from the blade"]),
 ("openred", ["blade buried in a twisting two-hand grip, body coiled to wrench it",
              "the ripping twist: a wide spray of dark red, her face impassive",
              "tearing the blade free in a rising arc, red ribboning off it",
              "settling back, blade lowered, red pooling at her feet"]),
 ("ichigeki", ["the sheathe: blade fully sheathed, both hands on it, eyes closed, absolute stillness",
               "eyes snapping open, red glare, knees bending — the entire world drawing in",
               "THE STROKE: a single screen-wide horizontal arc of blinding light, her body fully extended right",
               "after: back turned to the cut, sliding the katana home, the arc fading behind her"]),
 ("parry", ["perfect parry stance: blade vertical before her face, two-handed, feet light",
            "catching a blow dead-center: a ring of golden sparks around the point of contact",
            "the blow turned: her blade unmoved, sparks raining, eyes calm over the guard",
            "stance renewed, one foot sliding back, gold light fading off the edge"]),
 ("bloom", ["a spinning slash beginning: body coiling, blade wide, dark-red petals starting to lift around her",
            "mid-spin: a circular arc of blade light, camellia petals whirling",
            "the bloom: a burst of dark-red petals and blade arcs all around her, striking right",
            "the petals falling, her stance settled, one petal on the blade"]),
]

# ---------------- the Tempest School (enemies, face LEFT) ----------------
E_STYLE = ("clean anime cel-shaded dark-fantasy style, crisp lineart, dramatic rim light, "
           "full body head to feet, single character, centered, side view FACING LEFT")
ENEMIES = {
 "ninja": ("a lean male shinobi of an eastern mercenary school: matte charcoal-grey shozoku wraps, "
           "storm-blue scarf and cord knots, half-mask, twin straight short blades, wiry and quick",
   [("idle",  ["at rest in a low ready crouch, one blade reversed", "weight shifting, scarf drifting", "settling, eyes scanning"]),
    ("walk",  ["gliding low silent step", "next stride, blades tucked", "stride at full reach", "settling step, low"]),
    ("attack",["exploding forward, blades crossing", "double slash arcing to the LEFT", "follow-through low spin", "recovery to crouch"]),
    ("hurt",  ["struck, doubling over", "knocked back a step, scarf whipping", "recovering low"]),
    ("death", ["clutching a wound, staggering", "dropping to one knee, blade slipping", "collapsing forward", "still, scarf settling over him"])]),
 "archer": ("a tall male marksman of an eastern mercenary school: lacquered storm-blue half-armor over "
            "grey robes, wide straw kasa hat shadowing his eyes, a great asymmetric yumi longbow, quiver at hip",
   [("idle",  ["standing, bow held loose at his side", "adjusting his hat brim, calm", "settling, string hand flexing"]),
    ("walk",  ["measured stride, bow in hand", "next stride, quiver swaying", "stride, hat low", "settling step"]),
    ("attack",["nocking an arrow, rising", "full draw to his ear, aimed LEFT, bow bent deep", "the release: arrow gone, string blurred, robe rippling", "lowering the bow, reaching for the quiver"]),
    ("hurt",  ["struck, bow arm flung wide", "staggering back, hat knocked askew", "recovering, re-gripping the bow"]),
    ("death", ["dropping the bow, clutching his chest", "falling to both knees", "collapsing sideways", "still, the kasa hat rolling away"])]),
 "monk": ("a mountain warrior-monk: shaved head, prayer beads, weathered saffron-and-grey robes over a "
          "granite physique, iron knuckle wraps and iron-shod staff across his back, serene scarred face",
   [("idle",  ["rooted horse stance, fists at his hips, breathing slow", "fists tightening, beads swaying", "settling deeper, exhale"]),
    ("walk",  ["heavy deliberate stride", "next stride, robes swinging", "stride, fists loose", "settling step, dust at his feet"]),
    ("attack",["coiling back, fist chambered", "the iron palm strike driving LEFT, air rippling", "a second crushing straight punch LEFT", "recovery to rooted stance"]),
    ("hurt",  ["absorbing a blow, sliding back an inch, guard up", "grimacing, beads scattering", "re-rooting, cracking his neck"]),
    ("death", ["swaying, eyes closing", "kneeling slowly, fists to the ground", "folding forward in meditation posture", "still, beads pooled before him"])]),
 "sorcerer": ("an elder storm sorcerer of an eastern school: long white topknot and beard, indigo robes "
              "crawling with white lightning sigils, a gnarled staff crowned with a crackling storm orb, "
              "sparks arcing between his fingers",
   [("idle",  ["standing, staff planted, small lightning arcs crossing his fingers", "the storm orb pulsing, beard drifting in static wind", "settling, sparks dying down"]),
    ("walk",  ["robed stride, staff striking the ground", "next stride, sparks at his heels", "stride, orb flickering", "settling step, thunder-light in the robes"]),
    ("attack",["raising the staff, the orb blazing", "a forked bolt of white lightning LASHING to the LEFT from the orb", "the bolt forking wider, robes whipped by storm wind", "lowering the staff, smoke off the orb"]),
    ("hurt",  ["struck, staff clutched two-handed, arcs sputtering", "driven back a step, lightning guttering", "recovering, slamming the staff down"]),
    ("death", ["the orb cracking, light bleeding out", "collapsing against the staff", "sliding down it to his knees", "still, one last spark crawling off the orb"])]),
}

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

def img_of(resp):
    return base64.b64decode(resp["data"][0]["b64_json"])

def edit(prompt):
    b64 = base64.b64encode(open(REFCROP, "rb").read()).decode()
    return img_of(post("/images/edits", {"model": MODEL, "prompt": prompt, "aspect_ratio": "9:16",
        "response_format": "b64_json", "image": {"url": "data:image/png;base64," + b64, "type": "image_url"}}))

def gen(prompt):
    return img_of(post("/images/generations", {"model": MODEL, "prompt": prompt,
        "aspect_ratio": "9:16", "response_format": "b64_json"}))

def key_magenta(raw, out_path):
    import numpy as np
    from PIL import Image, ImageFilter
    from scipy import ndimage
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    a = np.array(im); R, G, B = (a[:, :, i].astype(int) for i in range(3))
    corners = [a[0:6,0:6,:3].reshape(-1,3).mean(0), a[0:6,-6:,:3].reshape(-1,3).mean(0),
               a[-6:,0:6,:3].reshape(-1,3).mean(0), a[-6:,-6:,:3].reshape(-1,3).mean(0)]
    import numpy as _np
    c = _np.median(_np.array(corners), axis=0)
    bgmask = (abs(a[:,:,:3].astype(int) - c).sum(2) < 70)
    hot = (R > 120) & (B > 110) & (G < 0.55 * _np.minimum(R, B))
    lbl, _ = ndimage.label(bgmask | hot)
    edge = set(lbl[0,:]) | set(lbl[-1,:]) | set(lbl[:,0]) | set(lbl[:,-1]); edge.discard(0)
    bg = _np.isin(lbl, list(edge)) | hot
    bg = ndimage.binary_dilation(bg, iterations=1)
    alpha = _np.where(bg, 0, 255).astype("uint8")
    band = ndimage.binary_dilation(bg, iterations=3) & ~bg
    pink = band & (R > G + 60) & (B > G + 60)
    a[:,:,0] = _np.where(pink, _np.minimum(R, G + 60), a[:,:,0])
    a[:,:,2] = _np.where(pink, _np.minimum(B, G + 60), a[:,:,2])
    alpha = _np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8)))
    a[:,:,3] = alpha
    if float((alpha < 40).mean()) < 0.10:
        print(f"  !! LOW-KEY {os.path.basename(out_path)}")
    Image.fromarray(a, "RGBA").save(out_path)

def normalize(folder, base, n):
    """scale frames of one set so silhouette heights match the set median."""
    import numpy as np
    from PIL import Image
    paths = [os.path.join(folder, f"{base}_{i}.png") for i in range(1, n + 1)]
    ims = [Image.open(p).convert("RGBA") for p in paths]
    hs = []
    for im in ims:
        a = np.array(im); ys, xs = np.where(a[:,:,3] > 40)
        hs.append(ys.max()-ys.min()+1 if len(ys) else im.height)
    target = int(np.median(hs))
    for p, im, h in zip(paths, ims, hs):
        s = target / h
        if abs(s - 1) < 0.03: continue
        nw, nh = int(im.width*s), int(im.height*s)
        im2 = im.resize((nw, nh), Image.LANCZOS)
        canvas = Image.new("RGBA", im.size, (0,0,0,0))
        canvas.paste(im2, ((im.width-nw)//2, im.height-nh))
        canvas.save(p)

def make_refcrop():
    """crop the main full-body pose out of Hiro's reference sheet (left-center figure)."""
    from PIL import Image
    if os.path.exists(REFCROP): return
    im = Image.open(REF).convert("RGB")
    w, h = im.size            # 1086x1448: the main figure spans roughly x 60..640, y 90..640 of a 725x965 layout
    crop = im.crop((int(w*0.06), int(h*0.09), int(w*0.62), int(h*0.66)))
    crop.save(REFCROP)
    print("ref crop ->", REFCROP, crop.size)

def main():
    force = "--force" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("-")]
    os.makedirs(RAW, exist_ok=True)
    make_refcrop()
    kd_dir = os.path.join(SRC, "sprites/samurai")
    os.makedirs(kd_dir, exist_ok=True)
    total = fails = 0
    for setname, poses in KD:
        if only and setname not in only: continue
        for i, pose in enumerate(poses, 1):
            out = os.path.join(kd_dir, f"kd_{setname}_{i}.png")
            if os.path.exists(out) and not force: continue
            prompt = f"{BIBLE}. Now shown mid-animation: {pose}. {STYLE_R}, {MAGENTA}"
            print(f"kd_{setname}_{i} ...", flush=True)
            try:
                raw = edit(prompt)
                open(os.path.join(RAW, f"kd_{setname}_{i}.png"), "wb").write(raw)
                key_magenta(raw, out); total += 1
            except Exception as e:
                print("  FAIL", e); fails += 1
        normalize(kd_dir, f"kd_{setname}", len(poses))
    for name, (bible, sets) in ENEMIES.items():
        if only and name not in only: continue
        edir = os.path.join(SRC, f"sprites/enemies/{name}")
        os.makedirs(edir, exist_ok=True)
        for setname, poses in sets:
            for i, pose in enumerate(poses, 1):
                out = os.path.join(edir, f"{name}_{setname}_{i}.png")
                if os.path.exists(out) and not force: continue
                prompt = f"{bible}. The SAME character in every frame. Now shown mid-animation: {pose}. {E_STYLE}, {MAGENTA}"
                print(f"{name}_{setname}_{i} ...", flush=True)
                try:
                    raw = gen(prompt)
                    open(os.path.join(RAW, f"{name}_{setname}_{i}.png"), "wb").write(raw)
                    key_magenta(raw, out); total += 1
                except Exception as e:
                    print("  FAIL", e); fails += 1
            normalize(edir, f"{name}_{setname}", len(poses))
    print(f"DONE generated={total} failed={fails}")

if __name__ == "__main__":
    main()
