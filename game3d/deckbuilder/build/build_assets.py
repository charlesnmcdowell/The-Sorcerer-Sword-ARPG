#!/usr/bin/env python3
"""
build_assets.py — packs the staged game3d sprite frames into base64 JS bundles the
deck-builder loads from file:// (no server needed; Chrome blocks XHR on file://).

Source frames (transparent PNGs, per-entity folders) come from game3d/assets/…
Run:  python3 build_assets.py <game3d_assets_root> <out_dir>
Default paths match the cloud build environment.

Frame registration: frames inside one animation are individually cropped by the
ARPG ingest, so each is padded onto that animation's union canvas anchored at
BOTTOM-CENTER before encoding. Result: window.SPIRE_ASSETS[key] =
{w,h,frames:[dataURI,…]} in several assets_*.js files (kept < ~10 MB each).

NEW-WARLOCK OVERRIDE: if <assets_root>/sprites/warlock/forms/newwarlock/ exists
and holds newwarlock_<anim>_<n>.png frames (generated later on Hiro's PC from
tools/refs/"new warlock ref.png"), those replace the matching warlock_* sets
automatically on the next run of this script. No game-code change needed.
"""
import os, sys, base64, io, json, math
import numpy as np
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else "/mnt/user-data/uploads/game3d/assets"
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), "..", "assets")

W = "sprites/warlock"
H = "sprites/enemies/hound"
SU = "sprites/warlock/summons"
FX = "sprites/fx"

# key -> (folder, file_base, frame_numbers, fps)
ANIMS = {
  # ---- Warlock (stand-in art; see NEW-WARLOCK OVERRIDE above) ----
  "wl_idle":     (W, "warlock_idle",     [1,2,3,4,5],                10),
  "wl_walk":     (W, "warlock_walk",     [1,2,3,4,5,6,7,8],          12),
  "wl_cast":     (W, "warlock_hex",      [1,2,3,4,5,6,7,8],          14),
  "wl_bigcast":  (W, "warlock_dashcast", [1,2,3,4,5,6,7,8,9,10,11,12],14),
  "wl_portal":   (W, "warlock_portal",   [1,2,3,4,5,6,7,8],          12),
  "wl_hurt":     (W, "warlock_hurt",     [1,2,3,4,5,6],              14),
  "wl_slide":    (W, "warlock_slide",    [1,2,3,4],                  12),
  # ---- life-steal package (2026-08-06): generated directly as new-warlock sets ----
  "wl_drain":    (W + "/forms/newwarlock", "newwarlock_drain",     [1,2,3,4,5,6], 10),
  "wl_bloodrite":(W + "/forms/newwarlock", "newwarlock_bloodrite", [1,2,3,4,5,6], 10),
  # ---- TSUBAKI (2026-08-08): the second playable — base sets + one set per card,
  # generated from Hiro's samurai.png reference (faces RIGHT like the warlock) ----
  "kd_idle":     ("sprites/samurai", "kd_idle",     [1,2,3,4],     8),
  "kd_walk":     ("sprites/samurai", "kd_walk",     [1,2,3,4,5,6], 12),
  "kd_hurt":     ("sprites/samurai", "kd_hurt",     [1,2,3],       12),
  "kd_slash":    ("sprites/samurai", "kd_slash",    [1,2,3,4],     10),
  "kd_cross":    ("sprites/samurai", "kd_cross",    [1,2,3,4],     10),
  "kd_guard":    ("sprites/samurai", "kd_guard",    [1,2,3,4],     10),
  "kd_observe":  ("sprites/samurai", "kd_observe",  [1,2,3,4],     8),
  "kd_counter":  ("sprites/samurai", "kd_counter",  [1,2,3,4],     14),
  "kd_sneak":    ("sprites/samurai", "kd_sneak",    [1,2,3,4],     10),
  "kd_oddhour":  ("sprites/samurai", "kd_oddhour",  [1,2,3,4],     9),
  "kd_artery":   ("sprites/samurai", "kd_artery",   [1,2,3,4],     14),
  "kd_openred":  ("sprites/samurai", "kd_openred",  [1,2,3,4],     9),
  "kd_ichigeki": ("sprites/samurai", "kd_ichigeki", [1,2,3,4],     7),
  "kd_parry":    ("sprites/samurai", "kd_parry",    [1,2,3,4],     10),
  "kd_bloom":    ("sprites/samurai", "kd_bloom",    [1,2,3,4],     9),
  # ---- the TEMPEST SCHOOL (Tsubaki's run; generated facing LEFT) ----
  "nj_idle":   ("sprites/enemies/ninja", "ninja_idle",     [1,2,3],   6),
  "nj_walk":   ("sprites/enemies/ninja", "ninja_walk",     [1,2,3,4], 12),
  "nj_attack": ("sprites/enemies/ninja", "ninja_attack",   [1,2,3,4], 14),
  "nj_hurt":   ("sprites/enemies/ninja", "ninja_hurt",     [1,2,3],   12),
  "nj_death":  ("sprites/enemies/ninja", "ninja_death",    [1,2,3,4], 8),
  "ar_idle":   ("sprites/enemies/archer", "archer_idle",   [1,2,3],   6),
  "ar_walk":   ("sprites/enemies/archer", "archer_walk",   [1,2,3,4], 10),
  "ar_attack": ("sprites/enemies/archer", "archer_attack", [1,2,3,4], 10),
  "ar_hurt":   ("sprites/enemies/archer", "archer_hurt",   [1,2,3],   12),
  "ar_death":  ("sprites/enemies/archer", "archer_death",  [1,2,3,4], 8),
  "mk_idle":   ("sprites/enemies/monk", "monk_idle",       [1,2,3],   6),
  "mk_walk":   ("sprites/enemies/monk", "monk_walk",       [1,2,3,4], 10),
  "mk_attack": ("sprites/enemies/monk", "monk_attack",     [1,2,3,4], 12),
  "mk_hurt":   ("sprites/enemies/monk", "monk_hurt",       [1,2,3],   12),
  "mk_death":  ("sprites/enemies/monk", "monk_death",      [1,2,3,4], 8),
  "ss_idle":   ("sprites/enemies/sorcerer", "sorcerer_idle",   [1,2,3],   6),
  "ss_walk":   ("sprites/enemies/sorcerer", "sorcerer_walk",   [1,2,3,4], 10),
  "ss_attack": ("sprites/enemies/sorcerer", "sorcerer_attack", [1,2,3,4], 10),
  "ss_hurt":   ("sprites/enemies/sorcerer", "sorcerer_hurt",   [1,2,3],   12),
  "ss_death":  ("sprites/enemies/sorcerer", "sorcerer_death",  [1,2,3,4], 8),
  # ---- Hound ----
  "hd_idle":     (H, "hound_idle",      [1,2,3],        6),
  "hd_walk":     (H, "hound_walk",      [1,2,3,4],      10),
  "hd_attack":   (H, "hound_attack",    [1,2,3,4],      12),
  "hd_hurt":     (H, "hound_hurt",      [1,2,3],        12),
  "hd_death":    (H, "hound_death",     [1,2,3,4],      8),
  # Per-ability hurt reactions. IMPORTANT (new art architecture, 2026-07-24): the source
  # sheets still contain the OLD embedded summon-cameo frames; only the summon-free
  # frames are bundled here — standalone summon sprites now do the choreography in-engine.
  "hd_hexhit":   (H, "hound_hexhit",    [1,2,11,12],          10),
  "hd_firehit":  (H, "hound_firehit",   [1,2,9,10,11,12],     10),
  "hd_clawhit":  (H, "hound_clawhit",   list(range(1,13)),    14),  # frames are slash-fx + hound only
  "hd_portalhit":(H, "hound_portalhit", [5,6,7,8,9,10,11,12], 10),
  "hd_afirehit": (H, "hound_afirehit",  [1,2,10,11,12],       10),
  "hd_ahexhit":  (H, "hound_ahexhit",   [1,2,3,4,12],         10),
  "hd_fadehit":  (H, "hound_fadehit",   [7,8,9,10,11,12,13],  8),   # scorched, left on the ground
  "hd_scythehit":(H, "hound_scythehit", [14,15,16],           8),   # ripped-up aftermath
  # ---- Summons (standalone sheets, engine-sequenced) ----
  "su_idle":    (SU+"/succubus",  "succubus_idle",    [1,2,3,4],     8),
  "su_walk":    (SU+"/succubus",  "succubus_walk",    [1,2,3,4],     10),
  "su_attack":  (SU+"/succubus",  "succubus_attack",  [1,2,3,4,5,6], 10),
  "su_fireball":(SU+"/succubus",  "succubus_fireball",[1,2,3,4],     10),
  "su_mend":    (SU+"/succubus",  "succubus_mend",    [1,2,3,4],     8),
  "cf_idle":    (SU+"/claw_demon","clawfiend_idle",   [1,2,3,4,5],   8),
  "cf_walk":    (SU+"/claw_demon","clawfiend_walk",   [1,2,3,4,5,6], 12),
  "cf_attack":  (SU+"/claw_demon","clawfiend_attack", [1,2,3,4],     12),
  "dr_idle":    (SU+"/dragon",    "blackdragon_idle", [1,2,3,4,5],   8),
  "dr_fly":     (SU+"/dragon",    "blackdragon_walk", [1,2,3,4,5],   10),
  "dr_attack":  (SU+"/dragon",    "blackdragon_attack",[1,2,3,4,5,6],10),
  "dr_breath":  (SU+"/dragon",    "blackdragon_breath",[1,2,3,4,5],  10),
  "dr_fireball":(SU+"/dragon",    "blackdragon_fireball",[1,2,3,4,5],10),
  # shambler frames 2/5 (walk) and 3 (attack) are corrupt fragments in the source set — skipped
  "sh_idle":    (SU+"/shambler",  "shambler_idle",    [1,2,3,4],     6),
  "sh_walk":    (SU+"/shambler",  "shambler_walk",    [1,3,4,6],     8),
  "sh_attack":  (SU+"/shambler",  "shambler_attack",  [1,2,4,5],     10),
  # ---- Act 1 enemy roster (Pit level) ----
  "sk_idle":   ("sprites/enemies/skel", "skel_idle",   [1,2,3,4], 6),
  "sk_walk":   ("sprites/enemies/skel", "skel_walk",   [1,2,3,4], 10, True),   # walk set generated facing RIGHT (2026-08-06 audit)
  "sk_attack": ("sprites/enemies/skel", "skel_attack", [1,2,3,4], 12),
  "sk_hurt":   ("sprites/enemies/skel", "skel_hurt",   [1,2,3,4], 12),
  "sk_death":  ("sprites/enemies/skel", "skel_death",  [1,2,3,4], 8),
  "br_idle":   ("sprites/enemies/brute", "brute_idle",   [1,2,3],     6),
  "br_walk":   ("sprites/enemies/brute", "brute_walk",   [1,2,3,4,5], 10),
  "br_attack": ("sprites/enemies/brute", "brute_attack", [1,2,3,4,5], 12),
  "br_hurt":   ("sprites/enemies/brute", "brute_hurt",   [1,2,3],     12, True), # hurt set faces RIGHT (2026-08-06 audit)
  "br_death":  ("sprites/enemies/brute", "brute_death",  [1,2,3,4],   8),
  "ms_idle":   ("sprites/enemies/master", "master_idle",   [1,2,3,4],   6),
  "ms_walk":   ("sprites/enemies/master", "master_walk",   [1,2,3,4,5], 10, True), # walk set faces RIGHT (2026-08-06 audit)
  "ms_attack": ("sprites/enemies/master", "master_attack", [1,2,3,4,5], 12),
  "ms_hurt":   ("sprites/enemies/master", "master_hurt",   [1,2,3],     12),
  "ms_death":  ("sprites/enemies/master", "master_death",  [1,2,3,4],   8),
  # Beast (elite) — bespoke reaction sheets exist; ONLY summon-free frames bundled
  # (same architecture rule as the hound: standalone summons choreograph in-engine).
  "bs_idle":   ("sprites/enemies/beast", "beast_idle",   [1,2,3,4], 6),
  "bs_walk":   ("sprites/enemies/beast", "beast_walk",   [1,2,3,4], 10),
  "bs_attack": ("sprites/enemies/beast", "beast_attack", [1,2,3,4], 12),
  "bs_hurt":   ("sprites/enemies/beast", "beast_hurt",   [1,2,3],   12),
  "bs_death":  ("sprites/enemies/beast", "beast_death",  [1,2,3,4], 8),
  "bs_hexhit":   ("sprites/enemies/beast", "beast_hexhit",   [1,2,8],           10),
  "bs_firehit":  ("sprites/enemies/beast", "beast_firehit",  [1,2,8],           10),
  "bs_clawhit":  ("sprites/enemies/beast", "beast_clawhit",  [1,2,3,4,5,6,7,8], 12),
  "bs_portalhit":("sprites/enemies/beast", "beast_portalhit",[6,7,8],           10),
  "bs_afirehit": ("sprites/enemies/beast", "beast_afirehit", [1,2,8],           10),
  "bs_ahexhit":  ("sprites/enemies/beast", "beast_ahexhit",  [1,4,5,7,8],       10),
  "bs_fadehit":  ("sprites/enemies/beast", "beast_fadehit",  [5,6,8],           8),
  "bs_scythehit":("sprites/enemies/beast", "beast_scythehit",[1,2,3,7,8],       10),
  "bs_arrowhit": ("sprites/enemies/beast", "beast_arrowhit", [1,3,7,8],         10),
  # ---- New reward-card summons ----
  "ba_idle":   (SU+"/bone_archer", "bonearcher_idle",   [1,2,3,4],     8),
  "ba_walk":   (SU+"/bone_archer", "bonearcher_walk",   [1,2,3,4,5,6], 10),
  "ba_attack": (SU+"/bone_archer", "bonearcher_attack", [1,2,3,4,5],   10),
  "as_idle":    (SU+"/archsuccubus", "archsuccubus_idle",    [1,2,3,4,5], 8),
  "as_walk":    (SU+"/archsuccubus", "archsuccubus_walk",    [1,2,3,4,5], 10),
  "as_fireball":(SU+"/archsuccubus", "archsuccubus_fireball",[1,2,3,4,5], 10),
  "as_mend":    (SU+"/archsuccubus", "archsuccubus_mend",    [1,2,3,4,5], 8),
  # ---- Arch-Devil transformation (reused from the ARPG's warlock/forms/archdevil set;
  # standalone-summon architecture: she channels it, it manifests/strikes/departs in-engine) ----
  "ad_idle":   ("sprites/warlock/forms/archdevil", "archdevil_idle",   [1,2,3,4],   6),
  "ad_walk":   ("sprites/warlock/forms/archdevil", "archdevil_walk",   [1,2,3,4,5], 10),
  "ad_attack": ("sprites/warlock/forms/archdevil", "archdevil_attack", [1,2,3],     10),
  # ---- Tavern NPC (the Dancer) -- sliced from tools/dancer_mvc.png's IDLE row ----
  "dc_idle":   ("sprites/npcs/dancer", "dancer_idle", [1,2,3,4,5,6], 6),

  # ================= ACT 2 — THE CITY (Karridge back alleys) =================
  # Facing audit 2026-08-05 (zoomed-crop rule): hook/gunner/stitch/grave/necro all
  # natively face LEFT. stitch/necro (+pyre below) ATTACK anims were generated
  # projecting RIGHT — those frame sets carry mirror=True so the bundled art is
  # uniformly left-facing and runtime code never needs per-anim flips.
  "hk_idle":   ("sprites/enemies/hook", "hook_idle",   [1,2,3,4],   6),
  "hk_walk":   ("sprites/enemies/hook", "hook_walk",   [1,2,3,4,5], 10),
  "hk_attack": ("sprites/enemies/hook", "hook_attack", [1,2,3,4,5], 14),
  "hk_hurt":   ("sprites/enemies/hook", "hook_hurt",   [1,2,3],     12),
  "hk_death":  ("sprites/enemies/hook", "hook_death",  [1,2,3,4],   8),
  # GUNNER (corrected 2026-08-05 after Hiro caught him facing away mid-fight): his
  # idle/walk/hurt/death were generated facing RIGHT while his ATTACK aims LEFT --
  # the inverse of the caster pattern. Mirror the four right-facing sets; attack stays.
  "gn_idle":   ("sprites/enemies/gunner", "gunner_idle",   [1,2,3,4],   6, True),
  "gn_walk":   ("sprites/enemies/gunner", "gunner_walk",   [1,2,4,5,6], 10, True),  # walk_3 is a corrupt fragment in the source set
  "gn_attack": ("sprites/enemies/gunner", "gunner_attack", [1,2,3,4,5], 12),
  "gn_hurt":   ("sprites/enemies/gunner", "gunner_hurt",   [1,2,3],     12, True),
  "gn_death":  ("sprites/enemies/gunner", "gunner_death",  [1,2,3,4],   8, True),
  # STITCH (corrected same pass): the full-scale audit shows his ENTIRE set natively
  # faces left -- the earlier attack mirror was a low-zoom misread and is removed.
  "st_idle":   ("sprites/enemies/stitch", "stitch_idle",   [1,2,3,4], 6),
  "st_walk":   ("sprites/enemies/stitch", "stitch_walk",   [1,2,3,4], 10),
  "st_attack": ("sprites/enemies/stitch", "stitch_attack", [1,2,3,4], 12),
  "st_hurt":   ("sprites/enemies/stitch", "stitch_hurt",   [1,2,3],   12),
  "st_death":  ("sprites/enemies/stitch", "stitch_death",  [1,2,3,4], 8),
  "gv_idle":   ("sprites/enemies/grave", "grave_idle",   [1,2,3],   6),
  "gv_walk":   ("sprites/enemies/grave", "grave_walk",   [1,2,3,4], 10),
  "gv_attack": ("sprites/enemies/grave", "grave_attack", [1,2,3,4], 12),
  "gv_hurt":   ("sprites/enemies/grave", "grave_hurt",   [1,2,3],   12),
  "gv_death":  ("sprites/enemies/grave", "grave_death",  [1,2,3,4], 8),
  "nc_idle":   ("sprites/enemies/necro", "necro_idle",   [1,2,3,4],     6),
  "nc_walk":   ("sprites/enemies/necro", "necro_walk",   [1,2,3,4,5,6], 10),
  "nc_attack": ("sprites/enemies/necro", "necro_attack", [1,2,3,4,5],   10, True), # mirror: source casts project right
  "nc_hurt":   ("sprites/enemies/necro", "necro_hurt",   [1,2,3],       12, True), # hurt set faces RIGHT (2026-08-06 audit)
  "nc_death":  ("sprites/enemies/necro", "necro_death",  [1,2,3,4,5],   8),

  # ================= ACT 3 — THE WEST ROAD (night shipment to Varenholm) =================
  # chain/pyre/door natively face LEFT (chain's attack is a 360 sweep — both directions
  # appear mid-spin, that's the move, not a facing bug). champ faces RIGHT (runtime flip).
  "ch_idle":   ("sprites/enemies/chain", "chain_idle",   [1,2,3,4],   6),
  "ch_walk":   ("sprites/enemies/chain", "chain_walk",   [1,2,3,4,5], 10, True), # walk set faces RIGHT (2026-08-06 audit)
  "ch_attack": ("sprites/enemies/chain", "chain_attack", [1,2,3,4,5], 12),
  "ch_hurt":   ("sprites/enemies/chain", "chain_hurt",   [1,2,3],     12, True), # hurt set faces RIGHT (2026-08-06 audit, Hiro screenshot)
  "ch_death":  ("sprites/enemies/chain", "chain_death",  [1,2,3,4],   8, True), # death set faces RIGHT (2026-08-06 audit)
  "py_idle":   ("sprites/enemies/pyre", "pyre_idle",   [1,2,3,4],   6),
  "py_walk":   ("sprites/enemies/pyre", "pyre_walk",   [1,2,3,4,5], 10),
  "py_attack": ("sprites/enemies/pyre", "pyre_attack", [1,2,3,4],   10, True),     # mirror: source casts project right
  "py_hurt":   ("sprites/enemies/pyre", "pyre_hurt",   [1,2,3],     12),
  "py_death":  ("sprites/enemies/pyre", "pyre_death",  [1,2,3,4],   8),
  "dr2_idle":  ("sprites/enemies/door", "door_idle",   [1,2,3,4], 6),
  "dr2_walk":  ("sprites/enemies/door", "door_walk",   [1,2,3,4], 8),
  "dr2_attack":("sprites/enemies/door", "door_attack", [1,2,3,4], 10),
  "dr2_hurt":  ("sprites/enemies/door", "door_hurt",   [1,2,3,4], 12, True),  # hurt set faces RIGHT (2026-08-06 audit)
  "dr2_death": ("sprites/enemies/door", "door_death",  [1,2,3,4], 8, True),   # death set faces RIGHT (2026-08-06 audit)
  "cp_idle":   ("sprites/enemies/champ", "champ_idle",   [1,2,3,4,5], 6),
  "cp_walk":   ("sprites/enemies/champ", "champ_walk",   [1,2,3,4,5], 10),
  "cp_attack": ("sprites/enemies/champ", "champ_attack", [1,2,3,4,5], 12),
  "cp_hurt":   ("sprites/enemies/champ", "champ_hurt",   [1,2,3,4,5], 12),
  "cp_death":  ("sprites/enemies/champ", "champ_death",  [1,2,3,4,5], 8),
  # ---- Spell FX ----
  "fx_bonearrow":(FX, "bonearrow", [1,2,3,4,5,6], 14),
  "fx_hexbolt":  (FX, "hexbolt",  [1,2,3,4,5,6], 14),
  "fx_firebolt": (FX, "firebolt", [1,2,3,4,5,6], 14),
  "fx_coldbolt": (FX, "coldbolt", [1,2,3,4,5,6], 14),
  "fx_greenbolt":(FX, "greenbolt",[1,2,3,4,5,6], 14),
  "fx_lightbolt":(FX, "lightbolt",[1,2,3,4,5,6], 14),
  "fx_wardaura": (FX, "wardaura", [1,2,3,4,5,6], 10),
  "fx_fireball": (FX, "fireball", [None], 1),      # single frame
  "fx_fireballhit":(FX, "fireball_hit", [None], 1),
}

# which bundle file each key group lands in
BUNDLES = {
  "assets_warlock.js": ["wl_"],
  "assets_hound_a.js": ["hd_idle","hd_walk","hd_attack","hd_hurt","hd_death","hd_hexhit","hd_firehit","hd_clawhit"],
  "assets_hound_b.js": ["hd_portalhit","hd_afirehit","hd_ahexhit","hd_fadehit","hd_scythehit"],
  "assets_summons.js": ["su_","cf_","dr_","sh_"],
  "assets_fx_bg.js":   ["fx_","bg_"],
  "assets_enemies2.js":["sk_","br_","ms_","bs_"],
  "assets_enemies3.js":["hk_","gn_","st_","gv_","nc_"],   # Act 2 — the City roster
  "assets_enemies4.js":["ch_","py_","dr2_","cp_"],        # Act 3 — the West Road roster
  "assets_allies2.js": ["ba_","as_","ad_","dc_"],
  "assets_samurai.js": ["kd_"],
  "assets_enemies5.js":["nj_","ar_","mk_","ss_"],
}

MAXH = 460  # cap sprite frame height (they're displayed <=420px)

def newwarlock_override():
    d = os.path.join(SRC, "sprites/warlock/forms/newwarlock")
    if not os.path.isdir(d): return
    remap = {"wl_idle":"idle","wl_walk":"walk","wl_cast":"cast","wl_bigcast":"bigcast",
             "wl_portal":"portal","wl_hurt":"hurt","wl_slide":"slide"}
    for key, anim in remap.items():
        frames = sorted(f for f in os.listdir(d) if f.startswith(f"newwarlock_{anim}_") and f.endswith(".png"))
        if frames:
            nums = sorted(int(f.rsplit("_",1)[1][:-4]) for f in frames)
            ANIMS[key] = ("sprites/warlock/forms/newwarlock", f"newwarlock_{anim}", nums, ANIMS[key][3])
            print(f"  [override] {key} -> newwarlock_{anim} x{len(nums)}")

# ---- ART-QA CLEANUP (2026-08-05 audit): targeted per-frame repairs ----
# "region": delete connected alpha components (other than the largest) whose bbox lies
#           entirely inside the normalized (x0,y0,x1,y1) box — removes baked summon
#           cameos the old sheets left behind (a flying dragon over fadehit_8, a
#           skeletal archer at arrowhit_3's left edge).
# "magenta": key out hot-pink chroma residue + despill the pink rim (the arrowhit
#            sheet was generated on magenta chroma and the keyer left ground pools).
CLEANUP = {
    ("hd_fadehit", 8):  [("region", 0.0, 0.0, 1.0, 0.62)],
    ("bs_arrowhit", 1): [("magenta",)],
    ("bs_arrowhit", 3): [("region", 0.0, 0.0, 0.40, 1.0), ("magenta",)],
    ("bs_arrowhit", 7): [("magenta",)],
    ("bs_arrowhit", 8): [("magenta",)],
}

# ---- PER-FRAME MIRRORS (2026-08-06 attack-facing audit): individual frames whose
# source art faces the OPPOSITE way from the rest of their own animation set. All
# four are tail/recover frames the sheet generator flipped. Judged in-engine at
# full zoom (build rule: never judge facing off thumbnails), one screenshot per
# frame of every enemy's attack set:
#   br_attack 4,5 — brute's follow-through + recover face RIGHT (set faces left)
#   bs_attack 4   — beast's recover faces LEFT while the set natively faces RIGHT
#                   (beast is runtime-flipped, so on screen it was the odd one out)
#   gn_attack 5   — gunner's lower-the-musket recover faces RIGHT (set faces left)
# Applied AFTER cleanup and BEFORE any whole-set mirror, so a frame in a mirrored
# set gets net-unflipped exactly when it should.
MIRROR_FRAMES = {
    ("br_attack", 4), ("br_attack", 5),
    ("bs_attack", 4),
    ("gn_attack", 5),
    # 2026-08-07 IDLE-frame audit (Hiro: "brute faces the wrong way when he
    # attacks" — it was his idle LOOP flickering mid-turn; the 07-30 audit only
    # ever judged idle frame 1s). Full per-frame idle sweep of all 14 enemies:
    ("br_idle", 2),                     # brute mid-loop frame faces RIGHT
    ("ch_idle", 1), ("ch_idle", 2),     # chain's first two idle frames face RIGHT
    # 2026-08-08 Tsubaki audit: one recovery frame generated facing LEFT
    ("kd_openred", 4),
}

def _cleanup(im, ops):
    import numpy as np
    from scipy import ndimage
    a = np.array(im)
    H, W = a.shape[:2]
    for op in ops:
        if op[0] == "region":
            x0, y0, x1, y1 = op[1] * W, op[2] * H, op[3] * W, op[4] * H
            opx = a[:, :, 3] > 40
            lbl, n = ndimage.label(opx)
            if n < 2: continue
            sizes = ndimage.sum(opx, lbl, range(1, n + 1))
            main = 1 + int(np.argmax(sizes))
            for i, sl in enumerate(ndimage.find_objects(lbl), 1):
                if i == main: continue
                if sl[1].start >= x0 and sl[1].stop <= x1 and sl[0].start >= y0 and sl[0].stop <= y1:
                    a[:, :, 3] = np.where(lbl == i, 0, a[:, :, 3])
        elif op[0] == "magenta":
            R = a[:, :, 0].astype(int); G = a[:, :, 1].astype(int); B = a[:, :, 2].astype(int)
            hot = (R > 100) & (B > 95) & (G < 0.55 * np.minimum(R, B))
            a[:, :, 3] = np.where(hot, 0, a[:, :, 3])
            # despill the pink rim: pull excess R/B toward G on strongly pink survivors
            pink = (a[:, :, 3] > 0) & (R > G + 70) & (B > G + 70)
            a[:, :, 0] = np.where(pink, np.minimum(R, G + 70), a[:, :, 0])
            a[:, :, 2] = np.where(pink, np.minimum(B, G + 70), a[:, :, 2])
    return Image.fromarray(a, "RGBA")

def load_anim(folder, base, nums, mirror=False, key=None):
    ims = []
    for n in nums:
        p = os.path.join(SRC, folder, base + (".png" if n is None else f"_{n}.png"))
        im = Image.open(p).convert("RGBA")
        ops = CLEANUP.get((key, n)) if key else None
        if ops: im = _cleanup(im, ops)
        if key and (key, n) in MIRROR_FRAMES:  # this one frame bucks its own set's facing
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
        if mirror:  # source anim was generated facing the wrong way vs its own idle set
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
        ims.append(im)
    # BUG FIX (2026-07-30): frames used to be centered on their own raw image WIDTH, not on
    # where the character actually sits inside that crop. Idle/attack keyframes are each
    # cropped independently, so a frame with a weapon or limb reaching further to one side
    # has a different width and a different content offset -- centering by width alone made
    # the character visibly slide/sway left-right every loop ("looks back and forth"). Fix:
    # register every frame on its own alpha centroid instead, so the body stays put on a
    # fixed canvas point while limbs/weapons move around it.
    cx = []
    for im in ims:
        arr = np.array(im)
        ys, xs = np.where(arr[:, :, 3] > 40)
        cx.append(float(xs.mean()) if len(xs) else im.width / 2.0)
    left  = max(cx[i] for i in range(len(ims)))                     # max centroid-to-left-edge reach
    right = max(ims[i].width - cx[i] for i in range(len(ims)))      # max centroid-to-right-edge reach
    mw, mh = int(math.ceil(left + right)), max(i.height for i in ims)
    scale = min(1.0, MAXH / mh)
    out = []
    for im, c in zip(ims, cx):
        canvas = Image.new("RGBA", (mw, mh), (0,0,0,0))
        ox = max(0, min(mw - im.width, int(round(left - c))))
        canvas.paste(im, (ox, mh - im.height))  # bottom anchor, centroid-registered horizontally
        if scale < 1.0:
            canvas = canvas.resize((max(1,int(mw*scale)), max(1,int(mh*scale))), Image.LANCZOS)
        buf = io.BytesIO(); canvas.save(buf, "PNG", optimize=True)
        out.append(base64.b64encode(buf.getvalue()).decode())
    return canvas.width, canvas.height, out

def bg_entries():
    out = {}
    # opaque layers -> JPEG (small); alpha layers -> PNG
    LAYERS = [
        # Act 1 — the Pit (original keys, unchanged)
        ("bg_far",   "bg_pit_far.png",   "jpg"),
        ("bg_floor", "bg_pit_floor.png", "jpg"),
        ("bg_fg",    "bg_pit_fg.png",    "png"),
        # Act 2 — the City (Karridge back alleys) + the Last Door Inn backdrop
        ("bg_alleys_far", "bg_alleys_far.png", "jpg"),
        ("bg_alleys_mid", "bg_alleys_mid.png", "png"),
        ("bg_inn_row",    "bg_village_mid.png", "png"),
        ("bg_city_near",  "bg_village_near.png", "png"),
        ("bg_city_far",   "bg_village_far.png", "jpg"),
        # Act 3 — the West Road (night shipment)
        ("bg_wroad_far", "bg_westroad_far.png", "jpg"),
        ("bg_wroad_mid", "bg_westroad_mid.png", "png"),
        ("bg_road_props","bg_road_mid.png",     "png"),
    ]
    for key, fname, mode in LAYERS:
        p = os.path.join(SRC, "bg", fname)
        im = Image.open(p)
        if im.width > 1600:
            im = im.resize((1600, int(im.height*1600/im.width)), Image.LANCZOS)
        buf = io.BytesIO()
        if mode == "jpg":
            im.convert("RGB").save(buf, "JPEG", quality=82)
            uri = "data:image/jpeg;base64,"
        else:
            im.convert("RGBA").save(buf, "PNG", optimize=True)
            uri = "data:image/png;base64,"
        out[key] = {"w": im.width, "h": im.height, "fps": 1,
                    "frames": [base64.b64encode(buf.getvalue()).decode()], "uri": uri}
    return out

# the story beats' VO clips (game3d/assets/voice/). Two vintages coexist:
#  - fnv1a-hash ids: the original pit game's recorded NPC/narrator clips (kept)
#  - named ids (2026-08-05 story-rewrite batch, build/gen_story_voices.py): Vessia's
#    new Nigerian-woman warlock voice, the rewritten narrator bio, and the villains'
#    fight dialogue (Houndmaster/Necromancer/Champ/Roadscum/Kargoth-as-THE-WALL)
VOICE_IDS = [
    # 2026-08-06 canon story rewrite (post-Book-4 Ankuspawn arc; see src/voice.js)
    # narrator beats
    "n_bio","n_gate","n_well","n_emperor","n_camp",
    "n_coach","n_firebird","n_hum","n_close",
    # NPCs
    "m_champion","m_warning","m_backroom",     # Marlow
    "b_vial","q_priced","c_flower",            # the Buyer, the Quarry Boy, the Firebird
    # Vessia
    "w_act1_intro","w_boss1","w_act1_out","w_boss2","w_patience",
    "w_fold","w_wagon","w_stand","w_run","w_vial_take","w_vial_leave",
    "w_fivesilver","w_price","w_epilogue",
    # the villains
    "e_ms_intro","e_ms_horn","e_ms_death",
    "e_nc_intro","e_nc_raise","e_nc_death",
    "e_cp_intro","e_cp_devour","e_cp_death",
    "e_hk_intro","e_gn_intro","e_gv_intro","e_ch_intro","e_py_intro","e_dr_intro",
    "e_st_intro","e_st_mend",
    # Tsubaki's road (2026-08-08)
    "k_bio","k_orders","k_boss1","k_out1","k_silver","k_file","k_price",
    "k_boss2","k_patience","k_house","k_boss3","k_courier","k_go",
    "n_kcage","n_ashen","k_deliver","n_vial","k_next","n_kclose",
    "e_nj_intro","e_ar_intro","e_ar_death","e_mk_intro","e_mk_death",
    "e_ss_intro","e_ss_death",
]

def main():
    os.makedirs(OUT, exist_ok=True)
    newwarlock_override()
    data = {}
    for key, spec in ANIMS.items():
        folder, base, nums, fps = spec[0], spec[1], spec[2], spec[3]
        mirror = len(spec) > 4 and spec[4]
        w, h, frames = load_anim(folder, base, nums, mirror, key)
        data[key] = {"w": w, "h": h, "fps": fps, "frames": frames, "uri": "data:image/png;base64,"}
        print(f"  {key}: {len(frames)}f {w}x{h}{' (mirrored)' if mirror else ''}")
    data.update(bg_entries())

    def bundle_of(key):
        for fname, prefixes in BUNDLES.items():
            for pre in prefixes:
                if key == pre or key.startswith(pre): return fname
        return "assets_fx_bg.js"

    files = {}
    for key, entry in data.items():
        files.setdefault(bundle_of(key), {})[key] = entry
    for fname, entries in files.items():
        parts = ["window.SPIRE_ASSETS = window.SPIRE_ASSETS || {};"]
        for key, e in entries.items():
            frames_js = ",".join(f'"{e["uri"]}{f}"' for f in e["frames"])
            parts.append(f'SPIRE_ASSETS["{key}"]={{w:{e["w"]},h:{e["h"]},fps:{e["fps"]},frames:[{frames_js}]}};')
        path = os.path.join(OUT, fname)
        with open(path, "w") as f: f.write("\n".join(parts))
        print(f"WROTE {fname}: {os.path.getsize(path)/1e6:.1f} MB, {len(entries)} anims")

    # music: one track per act theme (HTMLAudio data URIs, looped in code)
    tracks = {}
    for key, fname in [("arena", "arena.mp3"), ("city", "city.mp3"), ("forest", "forest.mp3")]:
        p = os.path.join(SRC, "music", fname)
        if os.path.exists(p):
            tracks[key] = base64.b64encode(open(p, "rb").read()).decode()
    if tracks:
        parts = ["window.SPIRE_MUSIC = window.SPIRE_MUSIC || {};"]
        for key, b64 in tracks.items():
            parts.append(f'SPIRE_MUSIC["{key}"]="data:audio/mpeg;base64,{b64}";')
        # back-compat alias (old code looked for SPIRE_AUDIO = the arena track)
        if "arena" in tracks:
            parts.append('window.SPIRE_AUDIO=SPIRE_MUSIC["arena"];')
        path = os.path.join(OUT, "assets_audio.js")
        with open(path, "w") as f: f.write("\n".join(parts))
        print(f"WROTE assets_audio.js: {os.path.getsize(path)/1e6:.1f} MB ({', '.join(tracks)})")

    # voice: the original pit game's recorded story clips
    vparts = ["window.SPIRE_VOICE = window.SPIRE_VOICE || {};"]
    missing = []
    for vid in VOICE_IDS:
        p = os.path.join(SRC, "voice", vid + ".mp3")
        if not os.path.exists(p): missing.append(vid); continue
        b64 = base64.b64encode(open(p, "rb").read()).decode()
        vparts.append(f'SPIRE_VOICE["{vid}"]="data:audio/mpeg;base64,{b64}";')
    if len(vparts) > 1:
        path = os.path.join(OUT, "assets_voice.js")
        with open(path, "w") as f: f.write("\n".join(vparts))
        print(f"WROTE assets_voice.js: {os.path.getsize(path)/1e6:.1f} MB, {len(vparts)-1} clips" +
              (f" (MISSING: {missing})" if missing else ""))

if __name__ == "__main__":
    main()
