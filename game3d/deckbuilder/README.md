# The Sorcerer Sword — Spire of Karridge (deck-builder)

Slay-the-Spire-style warlock deck-builder. Phaser 3, vanilla JS, fully local.
**Now the full road**: Act I THE PIT → Act II THE CITY (Karridge back alleys) →
Act III THE WEST ROAD (the night shipment) → the VARENHOLM epilogue — told with the
original Pit of Karridge's story and its recorded voice-overs (Marlow, the narrator,
the warlock's own lines, the Veiled Woman, the Quarry Boy, Ankunyx).

## HOW TO PLAY — double-click `SorcererSpire.html`
No server, no internet. Engine (`lib/phaser.min.js`) and every sprite/track/voice
clip are base64-embedded in `assets/assets_*.js`, so it runs straight from `file://`.

## The three acts
- **Act I — THE PIT**: hound / skeleton / brute, the Beast elite, the Hound Master
  boss (Horn Call), the Dancer's tavern. Music: arena.mp3.
- **Act II — THE CITY**: the Hook, the Road Gunner (ranged), the Stitcher (self-
  mending); Gravehand elite; boss THE COURT NECROMANCER (raises Risen thralls).
  Story stops: THE LAST DOOR INN (Marlow, voiced) and — if the alleys find you —
  THE BUYER, a voiced choice with real stakes. Music: city.mp3.
- **Act III — THE WEST ROAD**: the Chain, the Pyre (Burn ticks on your turns), the
  Frost Wight; THE WALL elite; boss THE CHAMP (devours thralls to grow). Story stop:
  THE CAGE (the Quarry Boy). Clearing him rides the coach to Varenholm — the Dancer's
  show, and the road south.
- Between acts: a night's rest — full heal and +10 max HP. Every fight in an act is
  a unique enemy; each act caps at 3 battles before its boss.

## What's in this build — the full PIT LEVEL (Act 1)
- Title → the Spire map → a complete run: 5 floors of branching nodes, shortened so
  she faces a **maximum of 3 battles** before the boss, guaranteed regardless of which
  path she takes. Fights (Pit Hound / Skeleton / Brute), THE BEAST elite, rest sites,
  treasure caches, ??? events, a **tavern stop** (see below), and THE HOUND MASTER
  boss (his Horn Call summons a hound mid-fight) — every node type kept, per Hiro's
  note that he likes the loot/treasure sections.
- **Every fight is a unique enemy within a climb** — the map generator tracks which
  enemies have already been assigned and never repeats one (hound/skel/brute/beast
  each show up at most once per climb; the boss is always the Hound Master).
- **The tavern stop**: one guaranteed node per climb where she meets the Dancer —
  fully refills her HP and offers a pick-1-of-3 **epic**-tier card (a rarity above
  rare, currently home to the Arch-Devil transformation, backed up with rare
  alternates).
- HP and deck persist across the climb. Every won fight offers a pick-1-of-3 card
  reward. Treasure lets you take a rare, grow max HP, or purge a card.
- Clear the boss for the act-clear screen (which teases Floor II — the City — for a
  later build); fall and the Pit resets your climb.
- 26 warlock cards across starter/common/uncommon/rare/epic (see PROGRESS.md for the
  full table) — spans magic bolts, block, life steal, summon-buff support, physical
  (non-magic) strikes, and the Arch-Devil transformation. Every card play, spell,
  summon, and enemy move has its own animation; enemies have a distinct hurt reaction
  per ability where the source art supports it, generic hurt otherwise.
- Summon architecture (per the 2026-07-24 direction): Succubus / Claw Demon / Black
  Dragon / Shamblers / Arch-Succubus / Bone Archer / the Arch-Devil are all standalone
  sprites sequenced by the engine — portal/transform in, perform, exit. No
  embedded-cameo sheets.
- The new female warlock (dark elf, `tools/refs/"new warlock ref.png"`) is the live
  in-game protagonist — `build/build_assets.py` auto-prefers her
  `assets/sprites/warlock/forms/newwarlock/` frames over the stand-in set.

## 2026-07-30 pass: shorter climb, unique fights, tavern, card audit, bug fixes
- Map: `ROWS` 7 → 5, with a dedicated always-safe row (rest/treasure/tavern, never a
  fight or an "???" that could itself roll into one) so the worst case is exactly 3
  battles + the boss.
- Bug fix: the Brute and the Hound Master were generated facing away from her (their
  whole sprite sets face right, opposite every other enemy) — `enemies.js` now flags
  them `flip: true` and `FightScene` reads it for idle + both charge legs.
- Bug fix: idle animations that looked like they were "glancing back and forth" were
  a frame-registration bug in `build/build_assets.py` — each keyframe used to be
  centered on its own raw crop width, not on the character's actual silhouette, so a
  frame with a weapon reaching further to one side visibly shifted the whole body.
  Frames now register on their alpha centroid instead.
- Card audit: added life steal (Vampiric Edge, Crimson Harvest), summon-buff support
  (Blood Pact, Dark Covenant — a permanent +N damage buff every summon/transformation
  card now reads), physical non-magic strikes (Dagger Flurry, Riving Slash), and the
  Arch-Devil transformation (Wear the Devil's Skin, epic).

## Dev notes
- `build/build_assets.py` — regenerates the asset bundles (documents the summon-free
  frame picks from the old cameo sheets).
- `build/smoke_test.js` — headless Playwright test: plays every card, runs enemy
  turns, asserts victory → map, fails on any JS error. (`node build/smoke_test.js`;
  headless GL is slow — the `?canvas=1` param exists for that.)
- `PROGRESS.md` — full build log / resume-here notes.
