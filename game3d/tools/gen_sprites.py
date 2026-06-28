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
REFS   = os.path.join(HERE, "refs")   # persistent per-entity reference library (so keyframes edit-from-the-real-sprite)
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
# full-bleed painterly BACKDROPS (no green key) — this is what sells the Dragon's Crown look
SCENE  = ("lush painterly Vanillaware DRAGON'S CROWN-style dark-fantasy background ART, richly "
          "hand-painted, deep atmospheric perspective, dramatic warm torch lighting with volumetric "
          "god-rays and haze, ZERO foreground characters, no text, no UI, no health bars")
FX     = ("vivid anime spell VFX, bright glowing, dynamic motion, crisp clean rendering, dramatic, high energy")
BLACKBG = ("on a PURE SOLID BLACK background (hex 000000), the effect glowing brightly against pure black, "
           "no scenery, no green, isolated, no text")

# ---- animation keypose vocabulary (for --from-needs: auto-build >=3-keypose sets from the auditor's queue) ----
NEEDED = os.path.join(HERE, "audit", "needed_sprites.json")   # written by visual_audit.py
ACTION_POSE = {
 "idle":"a relaxed combat-ready idle stance, subtle breathing", "walkf":"mid-stride walking FORWARD",
 "walkb":"stepping BACKWARD, leaning back", "attack":"a melee attack swing", "slash":"a fast slashing strike",
 "heavy":"a heavy overhead power strike", "hex":"casting a magic bolt forward, free hand thrust out",
 "cast":"casting a spell, staff raised", "summon":"a dramatic summoning pose, arms spread, conjuring a magic circle",
 "fireball":"hurling a fireball, casting arm thrown forward", "breath":"rearing back then breathing a cone of fire",
 "claw":"a raking claw swipe", "draw":"drawing a bow taut", "loose":"loosing an arrow, bow snapping forward",
 "swipe":"a lurching swipe", "roll":"rolling / dodging, body tucked", "dodge":"a quick evasive dodge",
 "hurt":"recoiling in pain, staggered backward", "aim":"taking careful aim", "shoot":"firing, recoil",
 "lunge":"lunging forward to strike", "transform":"mid-transformation, energy erupting", "death":"collapsing, defeated",
 "move":"moving forward toward a target", "seek":"advancing toward a target",
}
KEYPOSE = {1:"anticipation / wind-up", 2:"contact / peak of the action", 3:"recovery / follow-through",
           4:"settle", 5:"extra in-between"}

def entity_ref(ent):
    """The image to EDIT FROM so a keyframe stays on-model = the entity's own approved sprite.
    Checks the persistent refs/ library, then art_in/, then assets, then the warlock anchor as last resort."""
    cands = [os.path.join(REFS, f"{ent}.png"), os.path.join(ARTIN, f"{ent}.png")]
    if ent == "warlock":
        cands = [REF, os.path.join(REFS, "warlock_idle.png"), os.path.join(ARTIN, "warlock_idle.png")] + cands
    cands += [os.path.join(REFS, f"{ent}_idle.png"), os.path.join(ARTIN, f"{ent}_idle.png"),
              os.path.join(G3D, "assets", "sprites", f"{ent}.png")]
    return next((p for p in cands if os.path.exists(p)), REF)

def needs_rows():
    """Turn audit/needed_sprites.json into manifest-style rows: <entity>_<action>_<n>, reusing each entity's
    base prompt + the action pose + keyframe phrasing. Heroes/transforms stay edit-mode (on-model); enemies/
    summons gen-mode; effects black-bg. This is the auditor->art loop ('generated next time we run the command')."""
    if not os.path.exists(NEEDED): sys.exit(f"No needs file at {NEEDED} (run visual_audit.py first).")
    base = {m[0]: m for m in MANIFEST}
    rows, skipped = [], []
    for nd in json.load(open(NEEDED)):
        ent, act = nd.get("entity"), (nd.get("action") or "").lower()
        N = max(3, int(nd.get("frames_needed") or 3))
        if ent not in base: skipped.append(f"{ent}:{act}"); continue
        _, _, aspect, bprompt = base[ent]
        pose = ACTION_POSE.get(act, act.replace("_"," "))
        is_fx = ent.startswith("fireball") or ent in ("breath","spark","burst")
        ref = entity_ref(ent)
        body = CHAR if ent.startswith("warlock") else CREAT
        for n in range(1, N+1):
            kp = KEYPOSE.get(n, f"frame {n}")
            name = f"{ent}_{act}_{n}"
            if is_fx:   # effects are abstract — generate fresh on black, keep the look via wording
                rows.append((name, "gen", aspect, f"{bprompt}  ANIMATION FRAME {n} of {N}: {pose} ({kp})."))
            else:       # characters/creatures: EDIT FROM the entity's OWN sprite so it stays identical
                rows.append((name, "edit", aspect,
                    f"Use the REFERENCE IMAGE as the EXACT character. Keep it IDENTICAL — same face, same colours, "
                    f"same costume and anatomy, same scale, same SIDE-ON framing — change ONLY the pose to: {pose}. "
                    f"Animation keyframe {n} of {N} ({kp}). {body}, {GREEN}.", ref))
    if skipped: print(f"  (no base sprite for: {', '.join(sorted(set(skipped)))} — add a base manifest row first)")
    return rows

# ---- THE MANIFEST: every sprite I need.  mode 'edit' = stays on-model via REF. --
# (name, mode, aspect, prompt)  — enemies are a later tier; warlock + his kit first.
MANIFEST = [
 # WARLOCK — SIDE-ON fighting stances facing RIGHT, EDITED from the approved (front-facing) design so he stays on-model
 ("warlock_idle",   "edit", "3:4", f"Keep {BIBLE} EXACTLY the same character. Re-pose him SIDE-ON, body in profile FACING RIGHT, a relaxed combat-ready fighting stance, staff planted in one hand, glowing tome in the other. {CHAR}, {GREEN}."),
 ("warlock_walk",   "edit", "3:4", f"Keep {BIBLE} EXACTLY the same character. SIDE-ON, profile FACING RIGHT, mid-stride walking to the right, robe and hair trailing. {CHAR}, {GREEN}."),
 ("warlock_cast",   "edit", "3:4", f"Keep {BIBLE} EXACTLY the same character. SIDE-ON, profile FACING RIGHT, casting a spell forward to the right: free hand thrust out, staff raised, crackling violet magic. {CHAR}, {GREEN}."),
 ("warlock_hurt",   "edit", "3:4", f"Keep {BIBLE} EXACTLY the same character. SIDE-ON, profile FACING RIGHT, recoiling backward in pain, staggered. {CHAR}, {GREEN}."),
 ("warlock_summon", "edit", "3:4", f"Keep {BIBLE} EXACTLY the same character. SIDE-ON, profile FACING RIGHT, a dramatic SUMMONING pose: staff raised HIGH overhead in one hand, the glowing open tome blazing in the other, both arms spread wide, a swirling teal-and-violet summoning magic circle conjured in the air in front of him. {CHAR}, {GREEN}."),
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
 # PROJECTILE / SPELL FX — the engine tints (e.g. green for archsuccubus/demonlord), spins, trails + plays the burst on impact
 ("fireball",    "gen", "1:1", f"A fierce ANIME FIREBALL projectile flying horizontally to the LEFT: a swirling sphere of orange-red flame with a white-hot core and a long trailing comet tail of fire and embers. {FX}. {BLACKBG}."),
 ("fireball_hit","gen", "1:1", f"An ANIME FIRE EXPLOSION impact burst: a blooming orange-red flame blast with bright sparks, flying embers and smoke, radial symmetry. {FX}. {BLACKBG}."),
 # LICH's summon roster (raised in lich form, distinct from the living warlock's): shamblers @6s, bone archers @8s
 ("shambler",  "gen", "3:4",  f"An anime dark-fantasy ZOMBIE SHAMBLER raised by a lich, SIDE-ON FACING LEFT, lurching undead minion, rotting greyed flesh, tattered rags, sickly green necrotic glow. {CREAT}, {GREEN}."),
 ("bonearcher","gen", "3:4",  f"An anime dark-fantasy BONE ARCHER raised by a lich, SIDE-ON FACING LEFT, a skeletal undead drawing a bone bow with a bone-shaft arrow, tattered, cold green soul-glow. {CREAT}, {GREEN}."),
 # PIT GAUNTLET ENEMIES — 1:1 with the original pit.js FIGHTS roster (the foes the warlock actually fights)
 ("door",   "gen", "3:4", f"THE DOOR — a massive animated iron-bound fortress DOOR / wall golem enemy, SIDE-ON FACING LEFT, rivets, chains, a grim face set in the iron. {CREAT}, {GREEN}."),
 ("hook",   "gen", "3:4", f"TWIN HOOKS — a gaunt executioner horror wielding huge flesh-hooks on chains, SIDE-ON FACING LEFT, blood-rusted, menacing. {CREAT}, {GREEN}."),
 ("chain",  "gen", "3:4", f"THE CHAIN — a hulking chained prisoner-brute swinging heavy iron chains, SIDE-ON FACING LEFT, shackles, scarred. {CREAT}, {GREEN}."),
 ("pyre",   "gen", "3:4", f"A PYRE fiend — a burning ash-and-ember cultist wreathed in orange fire, SIDE-ON FACING LEFT, charred robes. {CREAT}, {GREEN}."),
 ("grave",  "gen", "3:4", f"THE GRAVE COUNT — a gaunt undead grave-count / pale vampire noble with a shovel-blade, SIDE-ON FACING LEFT, rotted finery. {CREAT}, {GREEN}."),
 ("hound",  "gen", "1:1", f"A demonic HOUND — a snarling hellhound war-dog, SIDE-ON FACING LEFT, glowing eyes, spiked collar, lunging. {CREAT}, {GREEN}."),
 ("master", "gen", "3:4", f"THE HOUND MASTER — a cruel beastmaster handler with a whip and a horn, SIDE-ON FACING LEFT, leather and fur. {CREAT}, {GREEN}."),
 ("gunner", "gen", "3:4", f"THE POWDER SAINT — a grim musketeer GUNNER aiming a long matchlock rifle, SIDE-ON FACING LEFT, powder-horn, tricorne. {CREAT}, {GREEN}."),
 ("necro",  "gen", "3:4", f"A NECROMANCER — a hooded skull-masked death-mage raising the dead, SIDE-ON FACING LEFT, bone staff, green necrotic glow. {CREAT}, {GREEN}."),
 ("skel",   "gen", "3:4", f"A SKELETON WARRIOR raised by a necromancer, SIDE-ON FACING LEFT, rusted sword and shield, tattered. {CREAT}, {GREEN}."),
 ("stitch", "gen", "3:4", f"THE STITCHER — a hulking stitched-flesh patchwork golem with surgical thread and hooks, SIDE-ON FACING LEFT, mismatched limbs. {CREAT}, {GREEN}."),
 ("brute",  "gen", "1:1", f"A hulking BRUTE enforcer — a massive muscled thug with a club, SIDE-ON FACING LEFT, scarred. {CREAT}, {GREEN}."),
 ("champ",  "gen", "3:4", f"THE FORMER CHAMPION — a battle-scarred armored gladiator duelist with sword and shield, SIDE-ON FACING LEFT, a champion's worn finery. {CREAT}, {GREEN}."),
 ("beast",  "gen", "1:1", f"A monstrous BEAST — a feral horned ogre-beast with tusks and claws, SIDE-ON FACING LEFT. {CREAT}, {GREEN}."),
 # PIT BACKDROP — layered parallax for the Dragon's Crown atmosphere. bg = full-bleed (no key); fg = keyed overlay.
 ("bg_pit_far",  "bg",  "16:9", f"The far stone WALL of a grand underground gladiatorial pit, viewed STRAIGHT-ON like a side-scroller BACKDROP wall behind the arena (NOT a top-down floor, NOT a bowl): tall tiered amphitheater STANDS PACKED with a roaring crowd of silhouetted SPECTATORS, hanging tattered war banners, rows of blazing wall-torches and braziers, a dark vaulted ceiling above with dusty god-ray shafts, heavy haze. A LOW horizon where the wall meets the ground at the very bottom. Wide panoramic backdrop that can scroll sideways. {SCENE}."),
 ("bg_pit_floor","bg",  "16:9", f"The blood-stained sand and cracked-flagstone FLOOR of a gladiatorial pit at a low oblique angle, scattered bones, old dark bloodstains, scorch marks, warm torch-lit, edges fading to shadow, horizontally tileable. {SCENE}."),
 ("bg_pit_fg",   "gen", "16:9", f"Two massive carved-stone gothic PILLARS wrapped in hanging iron chains, one at the FAR-LEFT edge and one at the FAR-RIGHT edge of the frame, a blazing iron brazier at the base of each, lush painterly Dragon's Crown dark-fantasy style with dramatic torch light. The ENTIRE CENTER and all space between the two pillars is FLAT SOLID chroma-green (hex 00FF00). {GREEN}."),
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
def key_and_crop(in_bytes, out_path, global_key=False):
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
    if global_key and greenish:
        # FX/projectiles (fire, sparks) have NO legitimate green, and thin wisps trap green pockets that
        # aren't border-connected. Key EVERY green pixel, not just the edge-flood region.
        bg = bgmask
    else:
        lbl,_ = ndimage.label(bgmask)
        edge = set(lbl[0,:])|set(lbl[-1,:])|set(lbl[:,0])|set(lbl[:,-1]); edge.discard(0)
        bg = np.isin(lbl, list(edge))
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    if greenish:  # despill green fringe (stronger for FX)
        keep = alpha>0; thr = 12 if global_key else 25
        spill = keep & ((Gc-np.maximum(R,B))>thr)
        a[:,:,1] = np.where(spill, np.maximum(R,B), a[:,:,1])
    alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.7)))
    a[:,:,3] = alpha
    ys,xs = np.where(alpha>40)
    if len(xs)==0: Image.fromarray(a,"RGBA").save(out_path); return
    pad=12; y0,y1=max(0,ys.min()-pad),min(h,ys.max()+pad); x0,x1=max(0,xs.min()-pad),min(w,xs.max()+pad)
    Image.fromarray(a[y0:y1,x0:x1],"RGBA").save(out_path)

def save_full(in_bytes, out_path):  # full-bleed backdrop: no key, no crop
    import io as _io
    from PIL import Image
    Image.open(_io.BytesIO(in_bytes)).convert("RGB").save(out_path)

def key_fx_black(in_bytes, out_path):  # glowing FX on BLACK -> alpha from brightness (no green fringe)
    import numpy as np, io as _io
    from PIL import Image, ImageFilter
    im = Image.open(_io.BytesIO(in_bytes)).convert("RGBA")
    a = np.array(im); h, w = a.shape[:2]
    lum = a[:,:,:3].max(axis=2).astype(np.uint8)   # brightest channel = how lit (fire = bright, bg = black)
    alpha = lum.copy(); alpha[lum < 14] = 0          # kill the near-black background to fully transparent
    alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.6)))
    a[:,:,3] = alpha
    ys,xs = np.where(alpha > 24)
    if len(xs)==0: Image.fromarray(a,"RGBA").save(out_path); return
    pad=10; y0,y1=max(0,ys.min()-pad),min(h,ys.max()+pad); x0,x1=max(0,xs.min()-pad),min(w,xs.max()+pad)
    Image.fromarray(a[y0:y1,x0:x1],"RGBA").save(out_path)   # draw ADDITIVE in-engine for the glow

def main():
    os.makedirs(RAW, exist_ok=True); os.makedirs(REFS, exist_ok=True)
    import shutil
    args = [x for x in sys.argv[1:] if not x.startswith("--")]
    force = "--force" in sys.argv
    if "--snapshot" in sys.argv:   # one-time: seed refs/ from existing base sprites so keyframes can edit-from-them
        cnt = 0
        for d in (ARTIN, os.path.join(G3D, "assets", "sprites")):
            if not os.path.isdir(d): continue
            for f in os.listdir(d):
                base = f[:-4]
                if f.endswith(".png") and not f.startswith("bg_") and not base.rsplit("_",1)[-1].isdigit():
                    try: shutil.copyfile(os.path.join(d, f), os.path.join(REFS, f)); cnt += 1
                    except OSError: pass
        print(f"snapshot: seeded {cnt} reference sprite(s) into {REFS}"); return
    if "--from-needs" in sys.argv:
        todo = needs_rows()
        if not todo: sys.exit("needed_sprites.json has nothing generatable yet.")
        print(f"--from-needs: {len(todo)} keyframe sprite(s) to generate")
    else:
        todo = [m for m in MANIFEST if (not args or m[0] in args)]
        if not todo: sys.exit("Nothing matches: " + " ".join(args))
    for row in todo:
        name, mode, aspect, prompt = row[0], row[1], row[2], row[3]
        ref = row[4] if len(row) > 4 else REF   # per-row reference (keyframes edit-from-the-entity's-own sprite)
        out = os.path.join(ARTIN, f"{name}.png")
        if os.path.exists(out) and not force:
            print(f"skip {name} (exists)"); continue
        if mode == "edit" and not os.path.exists(ref):
            print(f"skip {name}: need reference {ref}"); continue
        print(f"generating {name} ({mode}, {aspect}{', ref='+os.path.basename(ref) if mode=='edit' else ''}) ...", flush=True)
        try:
            raw = edit(prompt, ref, aspect) if mode=="edit" else generate(prompt, aspect)
        except urllib.error.HTTPError as e:
            print(f"  ERROR {e.code}: {e.read()[:200]}"); time.sleep(2); continue
        except Exception as e:
            print(f"  ERROR {type(e).__name__}: {str(e)[:160]}"); continue
        open(os.path.join(RAW, f"{name}.png"), "wb").write(raw)   # keep the raw
        fx = name.startswith("fireball") or name in ("spark","breath","burst")  # glowing FX -> black-bg luminance key
        if mode == "bg":  save_full(raw, out)        # full-bleed backdrop, keep as-is
        elif fx:          key_fx_black(raw, out)     # glowing FX: brightness->alpha, no green
        else:             key_and_crop(raw, out)     # character/enemy cutout: green-key + crop
        # snapshot BASE sprites (not keyframes like x_action_3) into the persistent ref library for future edits
        if mode != "bg" and not name.rsplit("_",1)[-1].isdigit():
            try: shutil.copyfile(out, os.path.join(REFS, f"{name}.png"))
            except OSError: pass
        print(f"  -> {out}")
        time.sleep(1.5)   # gentle on rate limits
    print("\nDone. The game3d-build schedule will ingest art_in/*.png (normal maps + lighting).")

if __name__ == "__main__":
    main()
