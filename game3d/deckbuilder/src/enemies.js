/* enemies.js — the Pit-level roster. Each def: sprite prefix, stats, move script,
   bespoke reaction map (kind -> anim key). Missing kinds fall back to <prefix>_hurt. */
window.Spire = window.Spire || {};

/* FACING (2026-07-30, corrected after a zoomed-in audit of every idle_1 frame):
   enemies stand on the RIGHT side of the arena, so on screen they must face LEFT.
   Native art facing:  hound RIGHT, beast RIGHT  -> flip: true
                       skel LEFT, brute LEFT, master LEFT -> no flip
   (The first pass had this exactly inverted for brute/master — misread the
   low-res previews. FightScene.flipXFor() consumes this flag.) */
Spire.ENEMIES = {
  hound: {
    id: "hound", name: "PIT HOUND", prefix: "hd", hp: 48, height: 225, flip: true,
    script: [
      { kind: "buff",   label: "Snarl", str: 2 },
      { kind: "attack", label: "Bite",  dmg: 9, hits: 1 },
      { kind: "attack", label: "Rend",  dmg: 5, hits: 2 },
      { kind: "block",  label: "Guard", block: 8 },
      { kind: "attack", label: "Bite",  dmg: 9, hits: 1 }
    ],
    reactions: { hexhit: "hd_hexhit", firehit: "hd_firehit", clawhit: "hd_clawhit",
                 portalhit: "hd_portalhit", afirehit: "hd_afirehit", ahexhit: "hd_ahexhit",
                 fadehit: "hd_fadehit", scythehit: "hd_scythehit" }
  },
  skel: {
    id: "skel", name: "PIT SKELETON", prefix: "sk", hp: 34, height: 235,
    script: [
      { kind: "attack", label: "Rusted Slash", dmg: 7, hits: 1 },
      { kind: "block",  label: "Shield Up",    block: 6 },
      { kind: "attack", label: "Rusted Slash", dmg: 7, hits: 1 },
      { kind: "buff",   label: "Bone Rattle",  str: 1 }
    ],
    reactions: {}
  },
  brute: {
    id: "brute", name: "PIT BRUTE", prefix: "br", hp: 58, height: 265,
    script: [
      { kind: "attack", label: "Club Smash", dmg: 11, hits: 1 },
      { kind: "block",  label: "Brace",      block: 8 },
      { kind: "attack", label: "Club Smash", dmg: 11, hits: 1 },
      { kind: "buff",   label: "Roar",       str: 2 }
    ],
    reactions: {}
  },
  beast: {
    id: "beast", name: "THE BEAST", prefix: "bs", hp: 78, height: 265, elite: true, flip: true,
    script: [
      { kind: "attack", label: "Gore",   dmg: 12, hits: 1 },
      { kind: "attack", label: "Frenzy", dmg: 4,  hits: 3 },
      { kind: "buff",   label: "Bellow", str: 3 },
      { kind: "block",  label: "Thick Hide", block: 9 },
      { kind: "attack", label: "Gore",   dmg: 12, hits: 1 }
    ],
    reactions: { hexhit: "bs_hexhit", firehit: "bs_firehit", clawhit: "bs_clawhit",
                 portalhit: "bs_portalhit", afirehit: "bs_afirehit", ahexhit: "bs_ahexhit",
                 fadehit: "bs_fadehit", scythehit: "bs_scythehit", arrowhit: "bs_arrowhit" }
  },
  master: {
    id: "master", name: "THE HOUND MASTER", prefix: "ms", hp: 95, height: 270, boss: true,
    vo: { intro: "e_ms_intro", special: "e_ms_horn", death: "e_ms_death" },
    script: [
      { kind: "attack",  label: "Whip Crack", dmg: 10, hits: 1 },
      { kind: "special", label: "Horn Call",  id: "horncall", dmg: 6, hits: 2 },
      { kind: "attack",  label: "Lash",       dmg: 5,  hits: 2 },
      { kind: "block",   label: "Beast Ward", block: 10 },
      { kind: "special", label: "Horn Call",  id: "horncall", dmg: 6, hits: 2 }
    ],
    reactions: {}
  },

  /* ============ ACT 2 — THE CITY (the cult's local pipeline; roster from the
     original pit ladder: hook / gunner / stitch / gravehand / court necromancer).
     Facing: this whole roster natively faces LEFT (audited via zoomed crops);
     the three right-facing ATTACK sets were mirrored at bundle time. ============ */
  hook: {
    id: "hook", name: "THE HOOK", prefix: "hk", hp: 55, height: 235,
    vo: { intro: "e_hk_intro" },
    script: [
      { kind: "attack", label: "Hook & Drag", dmg: 6, hits: 2 },
      { kind: "attack", label: "Gaff Swing",  dmg: 9, hits: 1 },
      { kind: "buff",   label: "Frenzy",      str: 2 },
      { kind: "attack", label: "Hook & Drag", dmg: 6, hits: 2 }
    ],
    reactions: {}
  },
  gunner: {
    id: "gunner", name: "THE ROAD GUNNER", prefix: "gn", hp: 62, height: 245,
    vo: { intro: "e_gn_intro" },
    script: [
      { kind: "block",  label: "Take Cover",  block: 9 },
      { kind: "attack", label: "Locked Shot", dmg: 15, hits: 1 },
      { kind: "attack", label: "Snap Shot",   dmg: 8,  hits: 1 },
      { kind: "buff",   label: "Powder Pack", str: 2 },
      { kind: "attack", label: "Locked Shot", dmg: 15, hits: 1 }
    ],
    ranged: true,   // fires from its spot -- no charge-in on attack turns
    reactions: {}
  },
  stitch: {
    id: "stitch", name: "THE STITCHER", prefix: "st", hp: 78, height: 255,
    vo: { intro: "e_st_intro", special: "e_st_mend" },
    script: [
      { kind: "attack",  label: "Needle Rake", dmg: 7, hits: 1 },
      { kind: "special", label: "Mend Flesh",  id: "mend", heal: 12 },
      { kind: "attack",  label: "Thread Lash", dmg: 5, hits: 2 },
      { kind: "special", label: "Mend Flesh",  id: "mend", heal: 12 },
      { kind: "attack",  label: "Needle Rake", dmg: 7, hits: 1 }
    ],
    reactions: {}
  },
  grave: {
    id: "grave", name: "GRAVEHAND", prefix: "gv", hp: 92, height: 250, elite: true,
    vo: { intro: "e_gv_intro" },
    script: [
      { kind: "attack", label: "Shovel Break", dmg: 13, hits: 1 },
      { kind: "block",  label: "Guard Stance", block: 13 },
      { kind: "attack", label: "Riposte",      dmg: 8,  hits: 2 },
      { kind: "buff",   label: "Grave Cold",   str: 2 },
      { kind: "attack", label: "Shovel Break", dmg: 13, hits: 1 }
    ],
    reactions: {}
  },
  necro: {
    id: "necro", name: "THE COURT NECROMANCER", prefix: "nc", hp: 130, height: 255, boss: true,
    vo: { intro: "e_nc_intro", special: "e_nc_raise", death: "e_nc_death" },
    script: [
      { kind: "attack",  label: "Grave Bolt",  dmg: 9, hits: 1 },
      { kind: "special", label: "Raise Dead",  id: "raisedead", dmg: 7, hits: 2 },
      { kind: "block",   label: "Bone Ward",   block: 11 },
      { kind: "attack",  label: "Grave Bolt",  dmg: 9, hits: 1 },
      { kind: "special", label: "Raise Dead",  id: "raisedead", dmg: 7, hits: 2 }
    ],
    ranged: true,
    reactions: {}
  },

  /* ============ ACT 3 — THE WEST ROAD (the night shipment's crew:
     chain / pyre / frost wight / THE WALL / THE CHAMP). ============ */
  chain: {
    id: "chain", name: "THE CHAIN", prefix: "ch", hp: 85, height: 275,
    vo: { intro: "e_ch_intro" },
    script: [
      { kind: "attack", label: "Ring Sweep",  dmg: 14, hits: 1 },
      { kind: "block",  label: "Wrap Chains", block: 11 },
      { kind: "attack", label: "Flail",       dmg: 7,  hits: 2 },
      { kind: "buff",   label: "Tighten",     str: 2 },
      { kind: "attack", label: "Ring Sweep",  dmg: 14, hits: 1 }
    ],
    reactions: {}
  },
  pyre: {
    id: "pyre", name: "THE PYRE", prefix: "py", hp: 72, height: 250,
    vo: { intro: "e_py_intro" },
    script: [
      { kind: "special", label: "Cinder Toss", id: "cinder", dmg: 7, burn: 3 },
      { kind: "block",   label: "Mage Shield", block: 10 },
      { kind: "special", label: "Cinder Toss", id: "cinder", dmg: 7, burn: 3 },
      { kind: "attack",  label: "Scald",       dmg: 10, hits: 1 }
    ],
    ranged: true,
    reactions: {}
  },
  wight: {
    id: "wight", name: "FROST WIGHT", prefix: "sk", hp: 64, height: 235, tint: 0x9fd4ff,
    /* Cookie's saltcellar tip made flesh: "Rats don't leave FROST on the railings."
       Reuses the skeleton art under an icy tint -- a risen thing off the night road. */
    script: [
      { kind: "attack", label: "Frost Slash",  dmg: 9, hits: 1 },
      { kind: "block",  label: "Rime Shell",   block: 10 },
      { kind: "attack", label: "Cold Snap",    dmg: 6, hits: 2 },
      { kind: "buff",   label: "Deep Winter",  str: 2 }
    ],
    reactions: {}
  },
  door: {
    id: "door", name: "THE WALL", prefix: "dr2", hp: 118, height: 265, elite: true,
    vo: { intro: "e_dr_intro" },
    script: [
      { kind: "block",  label: "Shut Fast",   block: 16 },
      { kind: "attack", label: "Slam",        dmg: 15, hits: 1 },
      { kind: "attack", label: "Hinge Crush", dmg: 9,  hits: 2 },
      { kind: "block",  label: "Shut Fast",   block: 16 },
      { kind: "buff",   label: "Groan",       str: 3 }
    ],
    reactions: {}
  },
  champ: {
    id: "champ", name: "THE CHAMP", prefix: "cp", hp: 160, height: 260, boss: true, flip: true,
    vo: { intro: "e_cp_intro", special: "e_cp_devour", death: "e_cp_death" },
    /* the gauntlet's thrall-eater: audited facing = RIGHT (the one runtime flip in the new cast) */
    script: [
      { kind: "attack",  label: "Sword & Board", dmg: 12, hits: 1 },
      { kind: "special", label: "Devour Thrall", id: "devour", heal: 15, str: 2 },
      { kind: "attack",  label: "Shield Bash",   dmg: 7,  hits: 2 },
      { kind: "block",   label: "Raise Shield",  block: 13 },
      { kind: "attack",  label: "Sword & Board", dmg: 12, hits: 1 }
    ],
    reactions: {}
  }
};
