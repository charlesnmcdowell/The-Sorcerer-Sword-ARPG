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
import os, sys, json, re
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
G3D  = os.path.dirname(HERE)
ARTIN = os.path.join(G3D, "art_in")
DEST  = os.path.join(G3D, "assets", "sprites")
SRC   = os.path.join(DEST, "_src")
CAP   = 512
ANIMS = os.path.join(DEST, "anims.json")   # keyframe manifest arena.html loads: {"<ent>_<act>": N}

# per-type TARGET WORLD HEIGHT (Hiro's scale-normalize table; render applies displayScale
# = targetWorldH / sprite.pixelHeight). Source px size is irrelevant to this.
TARGET_WORLD_H = {
    "warlock_idle": 1.0, "warlock_walk": 1.0, "warlock_cast": 1.0, "warlock_hurt": 1.0,
    "warlock_summon": 1.0,  # SUMMON-channel pose (Hiro drop 2026-06-28) — same world height as warlock
    # FX sprites (not characters): height is render-time, listed for documentation only
    "fireball": 0.5, "fireball_hit": 0.7,
    "lich": 1.05, "archdevil": 1.3, "demonlord": 1.4, "archwarlock": 1.1,
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

# ENTITY FOLDERS (Hiro 2026-07-15): sprites live in per-entity folders under assets/sprites/.
# MUST match arena.html's spritePath() mapping exactly. Manifests stay at the sprites root.
ENTITY_DIR = {'warlock':'warlock','succubus':'warlock/summons/succubus','archsuccubus':'warlock/summons/archsuccubus',
 'bonedragon':'warlock/summons/dragon','blackdragon':'warlock/summons/dragon','clawfiend':'warlock/summons/claw_demon',
 'shambler':'warlock/summons/shambler','bonearcher':'warlock/summons/bone_archer',
 'lich':'warlock/forms/lich','archdevil':'warlock/forms/archdevil','demonlord':'warlock/forms/demonlord',
 'archwarlock':'warlock/forms/archwarlock',
 'npc':'npcs','dancer':'npcs','hexbolt':'fx','firebolt':'fx','greenbolt':'fx','blinkwave':'fx','wardaura':'fx','fireball':'fx','lightbolt':'fx','coldbolt':'fx','bonearrow':'fx'}
for _e in ['door','hook','chain','pyre','gunner','grave','stitch','brute','master','hound','necro','champ','beast','skel']:
    ENTITY_DIR[_e]='enemies/'+_e
def dest_for(name):
    """Folder-resolved output path base for a flat sprite name (mkdirs as needed)."""
    d = os.path.join(DEST, ENTITY_DIR.get(name.split('_')[0], ''))
    os.makedirs(d, exist_ok=True)
    return os.path.join(d, name)

def cap(im):
    w, hgt = im.size
    m = max(w, hgt)
    if m <= CAP:
        return im
    s = CAP / m
    return im.resize((max(1, round(w * s)), max(1, round(hgt * s))), Image.LANCZOS)

def set_crop(name_frames):
    """ANIMATION KEYFRAME REGISTRATION: gen_sprites leaves keyframes FULL-CANVAS (per-frame bbox
    cropping would re-center every frame on its own silhouette -> the cycle jitters/slides on
    playback). Crop the whole SET with ONE union bbox instead: registered AND reasonably tight."""
    imgs = {}
    base = None
    for name in name_frames:
        im = Image.open(os.path.join(ARTIN, name + ".png")).convert("RGBA")
        if base is None: base = im.size
        elif im.size != base: im = im.resize(base, Image.LANCZOS)   # same set = same canvas
        imgs[name] = im
    u = None
    for im in imgs.values():
        a = np.asarray(im)[..., 3]
        ys, xs = np.where(a > 40)
        if len(xs) == 0: continue
        bb = [xs.min(), ys.min(), xs.max(), ys.max()]
        u = bb if u is None else [min(u[0],bb[0]), min(u[1],bb[1]), max(u[2],bb[2]), max(u[3],bb[3])]
    if u is None: return imgs
    pad = 12; w, h = base
    box = (max(0,u[0]-pad), max(0,u[1]-pad), min(w,u[2]+pad), min(h,u[3]+pad))
    return {n: im.crop(box) for n, im in imgs.items()}

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
            if os.path.exists(dest_for(name) + ".png"):
                continue  # already ingested (entity-folder location)
            names.append(name)
    if not names:
        print("Nothing pending in art_in/ (all ingested).")
        return
    # split ANIMATION KEYFRAMES (<ent>_<act>_<n>) from base stills; keyframes crop as a registered SET
    kf_re = re.compile(r"^(.+_[a-z]+)_(\d+)$")
    groups, stills = {}, []
    for name in names:
        m = kf_re.match(name)
        if m and os.path.exists(os.path.join(ARTIN, name + ".png")):
            groups.setdefault(m.group(1), []).append(name)
        else:
            stills.append(name)
    ready = {}
    for setname, members in groups.items():
        ready.update(set_crop(sorted(members)))
        print(f"  set-cropped {setname}: {len(members)} frame(s), one shared bbox (registered)")
    for name in stills + sorted(ready.keys()):
        ip = os.path.join(ARTIN, name + ".png")
        if not os.path.exists(ip):
            print(f"skip {name}: no art_in/{name}.png"); continue
        im = ready.get(name) or Image.open(ip).convert("RGBA")
        im = cap(im)
        im.save(dest_for(name) + ".png")
        normal_from_alpha(im).save(dest_for(name) + "_n.png")
        # archive the original keyed source (uncapped) for re-processing
        Image.open(ip).convert("RGBA").save(os.path.join(SRC, name + ".png"))
        tH = TARGET_WORLD_H.get(name, "?")
        print(f"  ingested {name}: {im.size} +_n  targetWorldH={tH}")
    rebuild_anims_manifest()
    print("Done. Wire any NEW names into arena.html preload + the world-scale table.")

def rebuild_anims_manifest():
    """Scan assets/sprites/ for keyframe sets named <entity>_<action>_<n>.png (the gen_sprites
    --from-needs output) and write anims.json = {"<entity>_<action>": maxContiguousN}. arena.html's
    loadAnimFrames() reads this at boot and builds real Phaser anims.create cycles from the frames —
    this manifest is what upgrades an entity from a still/pose-swap to a true multi-frame animation."""
    sets = {}
    frame_re = re.compile(r"^(.+)_(\d+)\.png$")
    for root, dirs, files in os.walk(DEST):                    # ENTITY FOLDERS: scan recursively
        if "_src" in root: continue
        for fn in files:
            if fn.endswith("_n.png") or fn.startswith("_"):
                continue
            m = frame_re.match(fn)
            if not m:
                continue
            sets.setdefault(m.group(1), set()).add(int(m.group(2)))
    manifest = {}
    for name, nums in sorted(sets.items()):
        n = 0
        while (n + 1) in nums:   # count contiguous frames from 1 (a gap ends the playable cycle)
            n += 1
        if n >= 2:
            manifest[name] = n
    json.dump(manifest, open(ANIMS, "w"), indent=1)
    print(f"  anims.json: {len(manifest)} multi-frame set(s)" +
          (" — " + ", ".join(f"{k}x{v}" for k, v in list(manifest.items())[:8]) if manifest else ""))

if __name__ == "__main__":
    main()
