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
    python gen_sprites.py --force --anim warlock_walk warlock_idle   # keyframe SETS at the
        # Phase-2 policy frame counts (walk 8 / attack 6 / idle 2), no auditor queue needed
    python gen_sprites.py --parts               # 2B.1: the Warlock's one-time cutout-rig parts
    python gen_sprites.py --force --parts head staff   # regenerate specific parts only
    python gen_sprites.py --rekey --parts robe_lower tome   # re-run ONLY the green-key step from
        # art_in/raw/ (no API spend) — for when the keyer, not the art, was the problem

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
# ENTITY FOLDERS (Hiro 2026-07-15): assets/sprites/ is per-entity now — must match arena.html spritePath().
SPRITE_ENTITY_DIR = {'warlock':'warlock','succubus':'warlock/summons/succubus','archsuccubus':'warlock/summons/archsuccubus',
 'bonedragon':'warlock/summons/dragon','blackdragon':'warlock/summons/dragon','clawfiend':'warlock/summons/claw_demon',
 'shambler':'warlock/summons/shambler','bonearcher':'warlock/summons/bone_archer',
 'lich':'warlock/forms/lich','archdevil':'warlock/forms/archdevil','demonlord':'warlock/forms/demonlord',
 'archwarlock':'warlock/forms/archwarlock',
 'npc':'npcs','dancer':'npcs','hexbolt':'fx','firebolt':'fx','greenbolt':'fx','blinkwave':'fx','wardaura':'fx','fireball':'fx','lightbolt':'fx','coldbolt':'fx','bonearrow':'fx'}
for _e in ['door','hook','chain','pyre','gunner','grave','stitch','brute','master','hound','necro','champ','beast','skel']:
    SPRITE_ENTITY_DIR[_e]='enemies/'+_e
def sprite_asset(name):
    """Folder-resolved path of an ingested sprite (flat name in, entity folder out)."""
    return os.path.join(G3D, "assets", "sprites", SPRITE_ENTITY_DIR.get(name.split('_')[0], ''), name + ".png")
REF = next((p for p in [
    os.path.join(HERE, "ref_warlock_idle.png"),
    os.path.join(ARTIN, "warlock_idle.png"),
    os.path.join(G3D, "assets", "sprites", "_src", "warlock_idle_v2_keyed.png"),
    sprite_asset("warlock_idle"),
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
# 2B.1 lesson: "flat solid chroma" alone sometimes came back DIM or desaturated
# or with the subject covering a corner — be maximally explicit about saturation + full coverage.
# 2026-07-19 (Hiro): key color switched GREEN -> MAGENTA. The kit's sheol-green fire/acid FX were
# clashing with a green screen (keyer risks eating the FX); nothing in the palette approaches pure
# magenta. The slicers auto-detect bg from sheet corners, so old green sheets still re-key fine.
GREEN  = ("on a perfectly FLAT, UNIFORM, highly SATURATED pure MAGENTA background (hex FF00FF, "
          "like chroma-key studio footage), the magenta covering EVERY pixel of the background right "
          "to all four corners and edges, no gradient, no gray, no vignette, no scenery, no ground, "
          "no cast shadow, no text, no extra characters")
# full-bleed painterly BACKDROPS (no green key) — this is what sells the Dragon's Crown look
SCENE  = ("lush painterly Vanillaware DRAGON'S CROWN-style dark-fantasy background ART, richly "
          "hand-painted, deep atmospheric perspective, dramatic warm torch lighting with volumetric "
          "god-rays and haze, ZERO foreground characters, no text, no UI, no health bars")
FX     = ("vivid anime spell VFX, bright glowing, dynamic motion, crisp clean rendering, dramatic, high energy")
BLACKBG = ("on a PURE SOLID BLACK background (hex 000000), the effect glowing brightly against pure black, "
           "no scenery, no green, isolated, no text")

# ---- animation keypose vocabulary (--from-needs / --anim keyframe sets) ------------------------
# ANIM_COMBAT_OVERHAUL Phase 2: the old one-size-fits-all KEYPOSE (anticipation/contact/follow-
# through) generated WALK and IDLE frames with ATTACK-pose language on 3-frame yoyo sets — the
# confirmed root cause of "fidgeting, not striding". Vocabulary is now split by ACTION TYPE and
# frame counts are real cycle lengths:
#   * WALK-type -> a true LOOPABLE 8-frame stride (contact/down/passing/up, then mirrored on the
#     other leg; frame 8 flows back into frame 1 — a forward loop, no yoyo ping-pong).
#   * IDLE -> 2 subtle breathing/weight-shift poses (a slow yoyo between them IS the design).
#   * ATTACK-type -> 6 frames along anticipation/wind-up/contact/follow-through/settle.
NEEDED = os.path.join(HERE, "audit", "needed_sprites.json")   # written by visual_audit.py
ACTION_POSE = {
 "idle":"a relaxed combat-ready idle stance, subtle breathing", "walkf":"mid-stride walking FORWARD",
 "walk":"mid-stride walking, weight on one leg, the other leg swinging",
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
WALK_ACTS = {"walk", "walkf", "walkb", "move", "seek"}
IDLE_ACTS = {"idle"}
def frames_for(act):
    """Policy frame count per action type (walk needs a full mirrored stride; idle stays lean)."""
    return 8 if act in WALK_ACTS else (2 if act in IDLE_ACTS else 6)

WALK_CYCLE = [  # 8-phase loopable stride: two mirrored halves, frame 8 leads back into frame 1
 "CONTACT: leading foot just planted far forward, trailing leg extended behind, body leaning into the step",
 "DOWN: weight settling fully onto the planted front leg, body at its LOWEST point, back heel lifting",
 "PASSING: the trailing leg swinging forward PAST the planted leg, feet closest together, body rising",
 "UP: body at its TALLEST, the swinging leg reaching out in front, about to land",
 "CONTACT on the OPPOSITE leg: the other foot now planted far forward, first leg extended behind",
 "DOWN on the opposite leg: weight settling onto the newly planted leg, body at its lowest",
 "PASSING on the opposite leg: the first leg swinging forward past the planted leg, body rising",
 "UP on the opposite leg: body tallest, first foot reaching forward, about to land back on the first pose",
]
IDLE_CYCLE = [  # subtle standing beat, NOT a wind-up — breathing + a tiny weight shift only
 "breath OUT: shoulders and chest settled, weight resting calmly, relaxed but combat-ready",
 "breath IN: chest and shoulders VERY slightly risen, a tiny shift of weight — almost the same pose",
]
ATTACK_ARC = [  # classic strike phrasing, spread proportionally across however many frames the set has
 "anticipation: starting to coil into the wind-up",
 "full wind-up: energy gathered at the peak of anticipation, body coiled",
 "release: exploding forward out of the wind-up toward the target",
 "CONTACT: the peak/impact instant of the action, maximum extension",
 "follow-through: momentum carrying the body past the contact",
 "recovery: settling back toward the ready stance",
]
def keypose(act, n, N):
    """Frame-n-of-N pose phrasing, selected by ACTION TYPE (walks stride, idles breathe, attacks strike)."""
    if act in WALK_ACTS:
        return (WALK_CYCLE[min(len(WALK_CYCLE)-1, (n-1)*len(WALK_CYCLE)//N)]
                + " — one frame of a smooth LOOPING walk cycle, the last frame flowing back into the first")
    if act in IDLE_ACTS:
        return IDLE_CYCLE[(n-1) % len(IDLE_CYCLE)]
    return ATTACK_ARC[min(len(ATTACK_ARC)-1, (n-1)*len(ATTACK_ARC)//N)]

def entity_ref(ent):
    """The image to EDIT FROM so a keyframe stays on-model = the entity's own approved sprite.
    Checks the persistent refs/ library, then art_in/, then assets, then the warlock anchor as last resort."""
    cands = [os.path.join(REFS, f"{ent}.png"), os.path.join(ARTIN, f"{ent}.png")]
    if ent == "warlock":
        cands = [REF, os.path.join(REFS, "warlock_idle.png"), os.path.join(ARTIN, "warlock_idle.png")] + cands
    cands += [os.path.join(REFS, f"{ent}_idle.png"), os.path.join(ARTIN, f"{ent}_idle.png"),
              sprite_asset(ent), sprite_asset(f"{ent}_idle"),
              os.path.join(G3D, "assets", "sprites", f"{ent}.png")]
    return next((p for p in cands if os.path.exists(p)), REF)

ALIAS = {"warlock": "warlock_idle"}   # __AUDIT__.entities reports the hero as 'warlock'; his base row is warlock_idle

def kf_rows(ent, act, N, base):
    """Manifest-style keyframe rows for ONE <entity>_<action> set (shared by --from-needs and --anim).
    Heroes/transforms stay edit-mode (on-model); enemies/summons gen-mode; effects black-bg.
    Returns None when the entity has no base manifest row to build from."""
    brow = base.get(ent) or base.get(ALIAS.get(ent, ""))
    if brow is None: return None
    _, _, aspect, bprompt = brow
    pose = ACTION_POSE.get(act, act.replace("_"," "))
    is_fx = ent.startswith("fireball") or ent in ("breath","spark","burst")
    ref = entity_ref(ent)
    body = CHAR if ent.startswith("warlock") else CREAT
    rows = []
    for n in range(1, N+1):
        kp = keypose(act, n, N)   # Phase 2: pose phrasing by ACTION TYPE (walks stride, idles breathe)
        name = f"{ent}_{act}_{n}"
        if is_fx:   # effects are abstract — generate fresh on black, keep the look via wording
            rows.append((name, "gen", aspect, f"{bprompt}  ANIMATION FRAME {n} of {N}: {pose} ({kp})."))
        else:       # characters/creatures: EDIT FROM the entity's OWN sprite so it stays identical
            rows.append((name, "edit", aspect,
                f"Use the REFERENCE IMAGE as the EXACT character. Keep it IDENTICAL — same face, same colours, "
                f"same costume and anatomy, same scale, same SIDE-ON framing — change ONLY the pose to: {pose}. "
                f"Animation keyframe {n} of {N} ({kp}). {body}, {GREEN}.", ref))
    return rows

def needs_rows():
    """Turn audit/needed_sprites.json into keyframe rows (the auditor->art loop). Frame counts are
    floored at the Phase-2 policy (walk 8 / attack 6 / idle 2) even if the queue entry asked for less."""
    if not os.path.exists(NEEDED): sys.exit(f"No needs file at {NEEDED} (run visual_audit.py first).")
    base = {m[0]: m for m in MANIFEST}
    rows, skipped = [], []
    for nd in json.load(open(NEEDED)):
        ent, act = nd.get("entity"), (nd.get("action") or "").lower()
        N = max(frames_for(act), int(nd.get("frames_needed") or 0))
        r = kf_rows(ent, act, N, base)
        if r is None: skipped.append(f"{ent}:{act}")
        else: rows += r
    if skipped: print(f"  (no base sprite for: {', '.join(sorted(set(skipped)))} — add a base manifest row first)")
    return rows

def anim_rows(specs):
    """--anim <entity>_<action> ...: build keyframe sets DIRECTLY (no auditor queue) at the policy
    frame counts — the Phase-2 'visible-first' path, e.g.:
        python gen_sprites.py --force --anim warlock_walk warlock_idle clawfiend_attack"""
    base = {m[0]: m for m in MANIFEST}
    rows, skipped = [], []
    for spec in specs:
        if "_" not in spec: skipped.append(spec); continue
        ent, act = spec.rsplit("_", 1); act = act.lower()
        r = kf_rows(ent, act, frames_for(act), base)
        if r is None: skipped.append(spec)
        else: rows += r
    if skipped: print(f"  (skipped — bad spec or no base manifest row: {', '.join(skipped)})")
    return rows

# ---- PHASE 2B.1 (ANIM_COMBAT_OVERHAUL — programmatic cutout rig, Warlock pilot) -----------------
# The Warlock's FIXED part inventory: each part generated exactly ONCE (edit-mode from the approved
# SIDE-ON idle so it stays on-model), then animated forever in code — no more per-pose regeneration.
# GENERATION-TIME LIGHTING DISCIPLINE (plan 2B.1): every part is a separate Grok call, so the light
# direction is pinned IDENTICALLY in every prompt below. Confirmed against the actual approved
# assets/sprites/warlock_idle.png: soft key from the UPPER-LEFT, cool TEAL rim along the RIGHT edge
# (the glowing tome side), faint violet ambient (the staff crystal). Check all parts BY EYE for
# lighting consistency before building the rig (2B.2+) — regenerating one part now is cheap.
# Segmentation judgment calls (noted per plan): staff is its OWN part (swings around the grip);
# hands are MERGED into their forearms (avoids tiny-part seams); the tome is its own part (floats
# over the off hand, gets its own glow cycle later); robe_lower is ONE skirt piece (robes hide leg
# motion — per the plan, don't over-segment); boots stay part of robe_lower's hem.
PART_LIGHT = ("LIGHTING — must match the reference image EXACTLY, do not invent a new light direction: "
              "soft key light from the UPPER-LEFT, cool TEAL rim-light along the RIGHT edge (as if lit "
              "by his glowing teal tome), faint violet ambient from above")
PART_COMMON = ("Use the REFERENCE IMAGE strictly for this character's exact design, colours and materials. "
               "Generate ONLY the requested BODY PART of this same anime dark-elf sorcerer, fully isolated "
               "on the background — NOT the full figure, no other body parts, no duplicates. SIDE-ON view "
               "FACING RIGHT, neutral relaxed pose. Draw the part COMPLETE, extending slightly PAST its "
               "joint(s) so connected parts can overlap without visible seams. The ENTIRE part must fit "
               "fully INSIDE the frame with clear margin on all sides — a clean isolated game asset, "
               "NOT a dramatic cropped close-up. ")
WARLOCK_PARTS = [
 ("warlock_part_head",            "3:4", "his HEAD and NECK: full long silver-white hair, lavender-grey skin, pointed ears, glowing violet eyes, calm stern expression"),
 ("warlock_part_torso",           "3:4", "his UPPER TORSO from neck-base to belt: the layered dark armored shoulder mantle, high collar, black-and-charcoal robe chest with the teal glowing rune sash, and the leather belt with its metal buckle — NO head, NO arms"),
 ("warlock_part_robe_lower",      "3:4", "his LOWER ROBE SKIRT from the belt down to the tattered hem: black-and-charcoal layered cloth with the two vertical TEAL glowing rune bands, dark boot tips just visible at the hem, the boot TOES POINTING RIGHT (the whole skirt in rightward profile like the reference, NOT mirrored)"),
 ("warlock_part_arm_staff_upper", "1:1", "his staff-side UPPER ARM only, from shoulder to elbow: black robed sleeve with charcoal trim"),
 ("warlock_part_arm_staff_fore",  "1:1", "his staff-side FOREARM and HAND only, from elbow to a closed gripping fist (lavender-grey skin), black sleeve cuff at the elbow end — exactly ONE single arm, no second arm, no bare skin above the sleeve"),
 ("warlock_part_staff",           "3:4", "his tall ornate STAFF only: dark twisted wooden shaft, carved bronze headpiece cradling the large glowing VIOLET crystal at the top"),
 ("warlock_part_arm_off_upper",   "1:1", "his off-hand UPPER ARM only, from shoulder to elbow: black robed sleeve, wide draped cloth"),
 ("warlock_part_arm_off_fore",    "1:1", "his off-hand FOREARM and open upturned HAND only, from elbow to fingertips (lavender-grey skin), wide black draped sleeve"),
 ("warlock_part_tome",            "1:1", "his open SPELLBOOK TOME only: aged parchment pages, dark leather cover with metal clasps, blazing cool TEAL arcane fire rising from the open pages"),
]
# 2B.5 RECHECK FIX: Hiro produced a GREEN-LIT full-body edit (the Dragon's-Crown-pro target look).
# Save it as tools/ref_warlock_greenlit.png and the parts visible in it regenerate FROM IT — parts
# sliced from ONE coherent figure are what kill the "limbs glued on" cross-generation drift.
# (Arms/tome keep the side-on idle ref: they're occluded/absent in the green-lit pose.)
GREENLIT = os.path.join(HERE, "ref_warlock_greenlit.png")
PART_GREENLIT = {"warlock_part_robe_lower", "warlock_part_torso", "warlock_part_head", "warlock_part_staff"}

def part_ref(name=None):
    """The on-model anchor per part: Hiro's green-lit full-body edit when present (for the parts it
    shows), else the approved SIDE-ON idle, else the front-facing REF."""
    if name in PART_GREENLIT and os.path.exists(GREENLIT): return GREENLIT
    for p in [sprite_asset("warlock_idle"),
              os.path.join(REFS, "warlock_idle.png")]:
        if os.path.exists(p): return p
    return REF

def part_rows(names=None):
    """--parts [name ...]: manifest-style rows for the Warlock's one-time part generation (2B.1).
    Each part resolves its own reference (green-lit figure when available, see part_ref)."""
    return [(n, "edit", aspect,
             f"{PART_COMMON}PART TO GENERATE: {desc}, exactly as worn/held by the figure in the reference. "
             f"{PART_LIGHT}. {STYLE}, {GREEN}.", part_ref(n))
            for n, aspect, desc in WARLOCK_PARTS if not names or n in names or n.replace("warlock_part_","") in names]

# ---- FULL-SHEET GENERATION (art direction 2026-07-08): ONE Grok call = ONE complete labeled
# sprite SHEET per character (all its rows: idle/locomotion/attacks/abilities), in the proven
# green-screen grid format Hiro's warlock sheets used. Sheets save to tools/sheet_<name>.png
# UNPROCESSED (no key/crop — slice_sheet.py / the grid slicer cuts them into frames).
SHEET_STYLE = ("professional game SPRITE SHEET layout on a perfectly FLAT, UNIFORM, highly SATURATED "
               "pure chroma-green background (hex 00FF00) covering every pixel between frames: each "
               "animation is ONE ROW of frames side by side in a NEAT EVEN GRID with IDENTICAL column "
               "spacing, a small white text row label above each row, the SAME character in every "
               "single frame (identical colours, proportions, costume, scale), SIDE-ON profile FACING "
               "RIGHT in every frame, every frame fully inside its own grid cell with clear green "
               "separation (no frame touching another), no scenery, no ground shadows, dark-fantasy "
               "painterly anime, rich ornate detail, dramatic rim light")
SUMMON_SHEETS = [
 ("clawfiend",   "Sprite sheet, 3 labeled rows: row 1 'IDLE' = 5 frames breathing and shifting its weight, hunched and ready; row 2 'WALK' = 8 frames of a full loping run cycle moving rightward; row 3 'ATTACK' = 6 frames of a huge raking claw swipe (coil, slash contact, follow-through). The character: a hulking dark-fantasy CLAW FIEND demon, purple-black hide, huge claws, glowing eyes"),
 ("bonedragon",  "Sprite sheet, 4 labeled rows: row 1 'IDLE' = 5 frames hovering in place with slow wingbeats; row 2 'WALK' = 8 frames of a full flying wingbeat cycle gliding rightward; row 3 'BREATH' = 8 frames rearing its head back then breathing a WIDE DIRECTIONAL CONE of sickly green acid to the right; row 4 'FIREBALL' = 6 frames coughing up and hurling a green fire bolt from its maw. The character: a dark-fantasy BONE DRAGON, skeletal pale-bone body, tattered wings, sickly green acid glow"),
 ("blackdragon", "Sprite sheet, 4 labeled rows: row 1 'IDLE' = 5 frames hovering with slow wingbeats; row 2 'WALK' = 8 frames of a full flying wingbeat cycle gliding rightward; row 3 'BREATH' = 8 frames rearing back then breathing a WIDE DIRECTIONAL CONE of green fire to the right; row 4 'FIREBALL' = 6 frames hurling a green fireball from its maw. The character: a dark-fantasy BLACK DRAGON, sleek obsidian scales with a sickly-green underglow"),
 ("succubus",    "Sprite sheet, 4 labeled rows: row 1 'IDLE' = 5 frames hovering with a light wing flutter; row 2 'WALK' = 8 frames of a full flying cycle drifting rightward; row 3 'FIREBALL' = 6 frames conjuring then hurling a small fireball; row 4 'MEND' = 6 frames casting a gentle pink healing beam forward. The character: an anime SUCCUBUS demon, violet-pink skin, black bat wings"),
 ("archsuccubus","Sprite sheet, 4 labeled rows: row 1 'IDLE' = 5 frames hovering with a light wing flutter; row 2 'WALK' = 8 frames of a full flying cycle drifting rightward; row 3 'FIREBALL' = 6 frames hurling a GREEN sheol fireball; row 4 'MEND' = 6 frames casting a healing beam forward. The character: an anime ARCH-SUCCUBUS, black and toxic-green colour scheme, black bat wings edged in green, wreathed in green sheol-fire"),
]
def sheet_gen_rows(names=None):
    """--sheets [name ...]: one full-sheet generation row per summon (edit-mode from the summon's
    own approved sprite so it stays on-model)."""
    return [("sheet_"+n, "sheet", "3:2", f"{desc}. {SHEET_STYLE}.", entity_ref(n))
            for n, desc in SUMMON_SHEETS if not names or n in names or ("sheet_"+n) in names]

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
# no_crop=True (ANIMATION KEYFRAMES): key the green but KEEP THE FULL CANVAS. Per-frame bbox
# cropping destroys FRAME REGISTRATION — each frame re-centers on its own silhouette, so the
# played-back cycle jitters/slides. Keyframes stay full-canvas here; ingest_art.py then crops
# the whole SET with one shared union bbox (registered AND tight). Base stills still crop.
def key_and_crop(in_bytes, out_path, global_key=False, no_crop=False):
    import numpy as np
    from PIL import Image, ImageFilter
    from scipy import ndimage
    im = Image.open(__import__("io").BytesIO(in_bytes)).convert("RGBA")
    a = np.array(im); h, w = a.shape[:2]; R,Gc,B = (a[:,:,i].astype(int) for i in range(3))
    # is the background green? (our prompt asks for it). else fall back to corner color.
    # 2B.1 KEYING FIX (root-caused on the part batch): (1) sample ALL FOUR corners, not just
    # top-left — artwork/shadow covering that one corner blinded the keyer entirely (the two
    # forearm parts keyed 2-3% because their top-left corner was the sleeve, not background);
    # (2) RELAXED green thresholds — Grok sometimes returns DIM/desaturated green (robe/tome
    # came back 70/110/75 sage: G-R=40, G=110, exactly ON the old >40/>110 boundary -> 0% keyed).
    # Content stays safe: teal runes have high B (G-B small), skin/violet/fire have high R.
    corners = [a[0:6,0:6,:3].reshape(-1,3).mean(0),  a[0:6,-6:,:3].reshape(-1,3).mean(0),
               a[-6:,0:6,:3].reshape(-1,3).mean(0), a[-6:,-6:,:3].reshape(-1,3).mean(0)]
    greenish = sum(1 for c in corners if (c[1] > c[0]+25) and (c[1] > c[2]+25)) >= 2
    if greenish:
        bgmask = ((Gc-R)>25) & ((Gc-B)>25) & (Gc>95)
    else:
        c = np.median(np.array(corners), axis=0)   # median corner survives one covered corner
        bgmask = (np.abs(a[:,:,:3].astype(int)-c).sum(2) < 60)
    if global_key and greenish:
        # FX/projectiles (fire, sparks) have NO legitimate green, and thin wisps trap green pockets that
        # aren't border-connected. Key EVERY green pixel, not just the edge-flood region.
        bg = bgmask
    else:
        lbl,_ = ndimage.label(bgmask)
        edge = set(lbl[0,:])|set(lbl[-1,:])|set(lbl[:,0])|set(lbl[:,-1]); edge.discard(0)
        bg = np.isin(lbl, list(edge))
    # EDGE REFINEMENT (2B.1 fix, round 2 — kills the green fringe ring the flat despill missed):
    # erode the foreground by 1px (eat the contaminated rim), FULL-strength despill in a 3px band
    # along the new edge, keep the mild global despill for interior spill, then feather the alpha.
    if not global_key:
        bg = ndimage.binary_dilation(bg, iterations=1)
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    if greenish:  # despill green fringe (stronger for FX)
        band = ndimage.binary_dilation(bg, iterations=3) & ~bg
        spill = band & (Gc > np.maximum(R,B)+6)                     # edge band: clamp ANY green cast
        a[:,:,1] = np.where(spill, np.maximum(R,B), a[:,:,1])
        thr = 12 if global_key else 20
        spill2 = (~bg) & ((Gc-np.maximum(R,B))>thr)                 # interior: only strong casts
        a[:,:,1] = np.where(spill2, np.maximum(R,B), a[:,:,1])
    alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8)))
    a[:,:,3] = alpha
    # 2B.1 KEYING FIX (3): SANITY CHECK — a green-instructed cutout that ends up <10% transparent
    # means the background was NOT keyed (this is exactly how 4 broken parts slipped through
    # silently). Loud warning at generation time so the operator regenerates/rekeys immediately.
    tfrac = float((alpha < 40).mean())
    if tfrac < 0.10:
        print(f"  !! LOW-KEY WARNING: only {tfrac*100:.1f}% of {os.path.basename(out_path)} keyed transparent — "
              f"background likely not chroma-green (corners: {[list(map(int,c)) for c in corners]}). "
              f"Regenerate with --force, or --rekey after a keyer fix.")
    if no_crop: Image.fromarray(a,"RGBA").save(out_path); return   # keyframes: registration > tightness
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
    if "--sheets" in sys.argv:
        todo = sheet_gen_rows(args)
        if not todo: sys.exit("--sheets: pass summon names (clawfiend/bonedragon/blackdragon/succubus/archsuccubus) or none for all")
        print(f"--sheets (full-sheet-per-summon, art direction 2026-07-08): {len(todo)} sheet(s) to generate")
    elif "--parts" in sys.argv:
        todo = part_rows(args)
        if not todo: sys.exit("--parts: no matching part names (see WARLOCK_PARTS; bare names like 'head' work too)")
        print(f"--parts (2B.1 cutout-rig pilot): {len(todo)} Warlock part(s) to generate, ref={os.path.basename(part_ref())}")
    elif "--anim" in sys.argv:
        todo = anim_rows(args)
        if not todo: sys.exit("--anim: pass <entity>_<action> specs, e.g. --anim warlock_walk warlock_idle")
        print(f"--anim: {len(todo)} keyframe sprite(s) to generate")
    elif "--from-needs" in sys.argv:
        todo = needs_rows()
        if not todo: sys.exit("needed_sprites.json has nothing generatable yet.")
        print(f"--from-needs: {len(todo)} keyframe sprite(s) to generate")
    else:
        todo = [m for m in MANIFEST if (not args or m[0] in args)]
        if not todo: sys.exit("Nothing matches: " + " ".join(args))
    rekey = "--rekey" in sys.argv   # 2B.1: re-run ONLY the keying/post-process from raw/ — zero API spend
    for row in todo:
        name, mode, aspect, prompt = row[0], row[1], row[2], row[3]
        ref = row[4] if len(row) > 4 else REF   # per-row reference (keyframes edit-from-the-entity's-own sprite)
        # full SHEETS live in tools/ UNPROCESSED (sliced later); everything else flows to art_in/
        out = os.path.join(HERE, f"{name}.png") if mode == "sheet" else os.path.join(ARTIN, f"{name}.png")
        if rekey:
            rp = os.path.join(RAW, f"{name}.png")
            if not os.path.exists(rp):
                print(f"skip {name}: --rekey but no raw at {rp}"); continue
            print(f"re-keying {name} from raw (no API call) ...", flush=True)
            raw = open(rp, "rb").read()
        else:
            if os.path.exists(out) and not force:
                print(f"skip {name} (exists)"); continue
            if mode in ("edit","sheet") and not os.path.exists(ref):
                print(f"skip {name}: need reference {ref}"); continue
            print(f"generating {name} ({mode}, {aspect}{', ref='+os.path.basename(ref) if mode in ('edit','sheet') else ''}) ...", flush=True)
            try:
                # sheets are EDIT-mode too: anchored to the summon's own approved sprite = on-model
                raw = edit(prompt, ref, aspect) if mode in ("edit","sheet") else generate(prompt, aspect)
            except urllib.error.HTTPError as e:
                print(f"  ERROR {e.code}: {e.read()[:200]}"); time.sleep(2); continue
            except Exception as e:
                print(f"  ERROR {type(e).__name__}: {str(e)[:160]}"); continue
            open(os.path.join(RAW, f"{name}.png"), "wb").write(raw)   # keep the raw
        fx = name.startswith("fireball") or name in ("spark","breath","burst")  # glowing FX -> black-bg luminance key
        keyframe = name.rsplit("_",1)[-1].isdigit()  # <ent>_<act>_<n> = ANIMATION KEYFRAME -> keep full canvas (registration)
        if mode == "sheet":
            open(out, "wb").write(raw)               # full sheet: save RAW, the slicer keys per-frame
            print(f"  -> {out} (full sheet — slice, then ingest the frames)")
            if not rekey: time.sleep(1.5)
            continue
        if mode == "bg":  save_full(raw, out)        # full-bleed backdrop, keep as-is
        elif fx:          key_fx_black(raw, out)     # glowing FX: brightness->alpha, no green
        else:             key_and_crop(raw, out, no_crop=keyframe)  # cutout: green-key (+crop only for base stills)
        # snapshot BASE sprites (not keyframes like x_action_3) into the persistent ref library for future edits
        if mode != "bg" and not name.rsplit("_",1)[-1].isdigit():
            try: shutil.copyfile(out, os.path.join(REFS, f"{name}.png"))
            except OSError: pass
        print(f"  -> {out}")
        if not rekey: time.sleep(1.5)   # gentle on rate limits (no API call to be gentle on when re-keying)
    print("\nDone. The game3d-build schedule will ingest art_in/*.png (normal maps + lighting).")

if __name__ == "__main__":
    main()
