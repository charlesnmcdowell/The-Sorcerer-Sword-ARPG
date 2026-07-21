# MAINTENANCE — building parallax brawlers on this baseline

How to extend `arena.html` (The Pit of Karridge) without breaking its contracts. Line numbers refer to the current file; see [CODE_MAP.md](CODE_MAP.md) for the full section map and [WIKI.md](WIKI.md) for what the game actually contains.

## Architecture — the five contracts

**1. Sim vs render.** The sim is plain globals — `P` (warlock), `S` (mode/time), `enemies[]`, `demons[]`, `fireballs[]`, `foeShots[]`, `zones[]`, `swings[]`, `tracers[]` — ticked by `frame(dt)` (line 1680). The Phaser scene (`class Arena`, line 1763) is a *renderer*: `syncFoeCrowd` / `update` read sim positions and never write sim state. Every foe renders **full-size at its sim position** — "the hitbox IS the body." Never move a sprite independently of its sim actor (that was the retired duel path's sin).

**2. The one-AI rule.** `updFoeAI` (line 622) is the **single AI + damage authority** for enemies. All chase/telegraph/strike logic and all `hurtWarlock` calls for foes live there (plus `updFoeShots` for projectiles it spawns). Never add damage in render code and never add a second AI path — the old duel `foeAI`/`foeMotion` (lines 2610/2694) is retired precisely because it moved a theatrical body separately from the sim.

**3. Screen-space cinematics only.** `hyperCutIn` (line 1055) does the MvC hyper flash — scrim, speed-lines, portrait slam, title card, hit-stop — entirely in screen space. **NO camera motion, ever**: camera moves fight the pinned parallax layers. Used on transforms, boss kills, summons (`hyperMini`).

**4. Separation floors.** `separateActors` (line 1549) enforces visual no-overlap after all movement: creature↔creature floor ~0.28×HERO_PX, creature↔warlock ~0.36×HERO_PX (with full X-eject), relaxed over 2 passes. **Corollary: every melee reach must be ≥ the floor** — strikes land from outside the no-overlap ring (weapon range, not body contact). If you add a melee actor, write its reach as `Math.max(bodyReach, HERO_PX*0.30)` like the existing branches do.

**5. HERO_PX scaling.** `HERO_PX = round(clamp(VIEW_H*0.27, 200, 420))` (line 138) is the on-screen height of a 1.0-world-unit fighter; **everything** scales off it. Per-character world heights live in `SPRITE_TARGET_H` (line 118): render scale = `(HERO_PX * SPRITE_TARGET_H[key]) / tex.height` — the ratios are the contract, source PNG size is irrelevant. Never hardcode pixel sizes.

**The reassignment-wrapper pattern** (tail of the file, lines 3740–3821): render-only features are added by wrapping a sim global —

```js
{ const _updZones=updZones;
  updZones=function(dt){ _updZones(dt); /* render-only additions */ }; }
```

Gas clouds, foe-shot bolt sprites, the blink stun-wave, and the portal ward-aura all ride this. Use it for any new render-on-top-of-sim feature: the sim stays untouched and diff-safe.

## HOW-TO: add an enemy type end-to-end

1. **Sheet**: add a MANIFEST entry in `tools/gen_sprites.py` (green-screen labeled sheet, one character, several animation rows; edit-mode anchored to the on-model reference) and generate — see pipeline commands below.
2. **Slice**: `python slice_sheet.py sheet_<name>.png --rows idle,walk,attack --entity <name>` — valley-cut columns, label stripping, bottom-center registration. It prints the exact ingest command.
3. **Ingest**: `python ingest_art.py <name>_idle_1 <name>_idle_2 ...` — **EXPLICIT NAMES ONLY** (hazard 2 below). This writes `assets/sprites/<name>*.png` + auto-generated `_n` normal maps (Light2D) and updates `anims.json` (`{"<entity>_<action>": frameCount}`).
4. **Load**: nothing to wire — `loadAnimFrames` (line 1854) reads `anims.json` and auto-builds `anim_<set>` (≥4 frames = 14fps forward loop, `_idle` sets 5fps) with the `BOOT_V` cache-buster.
5. **Scale**: add the type to `SPRITE_TARGET_H` (line 118) and to `TARGET_WORLD_H` in `ingest_art.py` (it prints the wiring value).
6. **Roster**: add a `{type,hp,spd,r,col,ranged?}` spec to `ADV_FIGHTS` (line 3482) and/or `FIGHTS` (line 245); add the display name in `typeLabel` (line 287); make sure `foeTexFor`/`FOE_TYPES` (~line 343) maps the type to its sprite.
7. **Brain**: add a `FOE_AI` entry (line 606: wind/dmg/heavy/shake, or ranged+standoff) — generic melee and ranged behavior come free. Only add a branch inside `updFoeAI` if the foe needs a special move (pounce, guard, heal, summon...). Keep all its damage in that one function.

## HOW-TO: add an area

1. Add to `ADV_AREAS` (line 3492): `{ len, music, far, mid, near }` (mid/near may be null).
2. Load the backdrop textures in `preload()` (line 1764) — far = full-bleed painted plate, mid = keyed strip whose base sits on the horizon band, near = foreground prop strip.
3. `advSetArea` (line 3581) already cover-scales far/ground and places mid/near; parallax factors live in `advFrame` (far 0.22×, mid 0.55×, ground 1.0×, near 1.35× **in front of** the actors at depth 6000).
4. Wire transitions: world-edge walk transitions in `advFrame` (line ~3716) and/or E-key interactables in `advNearest`/`advInteract` via `advGoto(mode, px)` (fade-out/in; `px<0` means "enter from the east edge").

## HOW-TO: add an NPC / quest beat

1. NPCs are made in `advInit` (line 3521): `npc('npc_<key>', worldX, 'NAME · PLACE')` — texture loaded in `preload()`, auto-scaled to `HERO_PX*0.95`.
2. Add it to the interactable list in `advNearest` (line 3652) so the E-hint appears within 120px.
3. Add a branch in `advInteract` (line 3661). Gate story on `ADV.quest` stages; set `ADV.objective` so the chip updates.
4. Dialogue: `advSay(voiceId, 'TITLE', 'subtitle', thenCallback)` chains clips; `showBanner` alone for unvoiced flavor.

## HOW-TO: add an FX sheet

Generate on a **black** background (FX are keyed by luminance, not green) with the `--anim`/FX path in `gen_sprites.py`, slice, ingest with explicit names, and it appears as `anim_<set>`. Attach it render-side with the wrapper pattern (see the blink-wave wrapper at line 3783 for the template: play the anim, tween scale/alpha, destroy on complete, always with a procedural fallback if `scene.anims.exists()` is false).

## HOW-TO: add a voice line

Drop the mp3 into `assets/voice/` — filenames are fnv1a hashes of the line id, copied verbatim from the original game's manifest. Play with `advSay(id, title, sub, then)`; it shows the banner subtitle, pauses any current clip, ducks music to 0.10 and restores 0.35 on end/error. Audio unlocks on first pointer/key (`advUnlockAudio` queues one pending voice line before that).

## Art pipeline (verbatim commands)

Run on the PC from `game3d/tools` (the scheduled sandbox can't reach api.x.ai):

```
pip install pillow numpy scipy
python gen_sprites.py                              # generates everything missing
python gen_sprites.py warlock_walk lich            # only specific names
python gen_sprites.py --force demonlord            # regenerate even if it exists
python gen_sprites.py --force --anim warlock_walk warlock_idle   # keyframe SETS (walk 8 / attack 6 / idle 2)
python gen_sprites.py --rekey --parts robe_lower tome            # re-key only, from art_in/raw/ (no API spend)

python slice_sheet.py sheet_warlock_locomotion.png
python slice_sheet.py mysheet.png --rows idle,walk,walkb --entity warlock

python ingest_art.py lich demonlord                # EXPLICIT NAMES ONLY — never bare
```

Flow: xAI Grok (`grok-imagine-image-quality`, edit-mode anchored on `tools/ref_warlock_idle.png` / `refs/` for on-model consistency; ~$0.07/call) → green-key + crop → `art_in/` → slice → ingest (cap 512px, Sobel normal maps, archive source to `assets/sprites/_src/`, update `anims.json`) → `loadAnimFrames` picks it up. Keep `art_in/` **empty** after ingest.

`tools/` layout: `sheets/` raw sheet archive · `checks/` review contact sheets · `refs/` on-model anchors · `audit/` stale visual-audit output · `README.md` · `xai_key.txt` **(SECRET — never print, copy, or commit)**. Pipeline runs may recreate `sheet_*`/`_check_*` at tools root; sweep them back into `sheets/`/`checks/`.

## KNOWN HAZARDS — read before touching anything

1. **Tail truncation (the big one).** The shell/OneDrive mount pins files at stale byte lengths — bash/sandbox shells see `arena.html` **TAIL-TRUNCATED** (~200KB / ~2700 lines vs the real ~3876). Use host file tools (Read/Grep) for anything near the tail (the whole ADV block, wrappers, touch controls). Verify edits by confirming the file still ends with `</html>` via the Read tool. **NEVER "repair" phantom corruption** — the file is fine; your shell view isn't. (`tools/gen_sprites.py` is served truncated too; the runnable copy pattern lives in the session /tmp.)
2. **Never bare-run `ingest_art.py`.** A bare run ingests *everything* in `art_in/` and resurrects stale frames from leftovers. Always pass explicit names; keep `art_in/` empty after ingest.
3. **BUGLOG.md** (game3d root) feeds the `game3d-bugfix` scheduled task — see workflow below. Don't reformat it casually; the fixer parses it.
4. **PROJECT_LOG.md** at the repo root is the newest-on-top session log. Append your session there.
5. **xAI budget** is tracked in PROJECT_LOG's PENDING section (~$6.85 left at ~$0.07/call — that's ~95 calls). Log every spend; batch generations; use `--rekey` when the keyer (not the art) was the problem, it costs nothing.

## Schedules & BUGLOG workflow

The `game3d-bugfix` scheduled task runs **every 10 minutes** and fixes **one OPEN bug per run**, topmost first, then moves the entry to FIXED with a dated verification note and appends to PROJECT_LOG tagged `[bugfix-schedule]`.

- Entry format: `- [BUG-NNN] description (reported YYYY-MM-DD by who)` under **OPEN**. Concrete: "X happens when Y, should Z".
- `[NEEDS-FABLE]` = skipped by the schedule; needs the interactive session (e.g. art generation).
- `[NEEDS HIRO]` = too big/ambiguous for an autonomous fix.
- Fixer ground rules: edit `game3d/` only; `game/src/combat/pit.js` may be READ (never written) as the porting reference; minimal fixes, no redesigns; respect standing decisions (sheet-flipbook art direction, claw-fiend-only summons in solo, rig retired behind `?rig=1`); no art generation unless the entry asks; verify with `node --check` on the extracted inline script — and mind hazard 1 when the mount truncates the file.

**Open work right now:** BUG-016 arch-warlock/arch-reaper evolution forms (art + wiring, NEEDS-FABLE) · BUG-009 door/master/champ/skel old-gen 3-frame sheets (legacy-gauntlet-only, low priority) · BUG-002 fixed (cosmetic stale foeSprite). Feet-flagged sheets to eventually redo: stitch, chain, gunner (mild). Evolutions partially wired: lv10/lv20 card picks exist; the herald/binder kit is ported but dormant.

## REFERENCE-SHEET BACKGROUND COLOR (2026-07-19)
Use **pure MAGENTA (FF00FF)** as the key background on new reference sheets — NOT green. The kit's
signature FX are sheol-GREEN (succubus fire, dragon acid, hex energy), so a green screen clashes with
the art and the keyer risks eating or fringing the FX. Nothing in the game's palette approaches pure
magenta. Dark-stage refs (near-black bgs) also work — the slicer border-floods from the sheet corners
and auto-detects whatever uniform bg color is there — but magenta gives the cleanest single-pass key.
Caption text on sheets: any color is fine (it gets stripped), but avoid placing it over the art.

## FORM-VARIANT CONGRUENCE CHECK (2026-07-19, born from BUG-020)
Whenever the hero gains a NEW FORM (lich, arch devil, demon lord, arch warlock, …) or a form gains a new ability, run this checklist BEFORE calling the work done — this is the recurring bug category ("arch warlock plays warlock animations"):
1. **Every animation selection branches on the new form's flag.** Grep every `P.lich` / `P.devilT` / `P.demonLord` / `P.archWarlock` branch that picks a set name (`heroOneShot`, dash `_castSet`, idle/walk driver via `heroFormTex()`, hyper cut-ins) — the new flag must appear in each, with an explicit fallback if its sheet is absent.
2. **Every ability has a form-matched CAST sheet** (`<form>_<act>` in anims.json) **or a deliberate, commented fallback** to the base sheet. Silence is a bug.
3. **Every cameo/finisher has a form-matched HURT variant** on each test enemy (e.g. `hound_ahexhit` vs `hound_hexhit`), selected by a flag the projectile carries (`arch:`), never by global state at impact time.
4. **Body sets have ≥4 frames** — under 4, loadAnimFrames yoyos the set and the character visibly strobes back-and-forward (the BUG-020 idle strobe).
5. **The form's token is in ALL THREE resolver maps** (spritePath / ENTITY_DIR / SPRITE_ENTITY_DIR) before ingesting, or frames land at the sprites root.
6. Per the art pipeline: form variants may be SCALED off the base form's greenlit reference (named anchor, flagged UNREVIEWED) — but a Hiro golden ref, when it exists, always replaces the scaled sheet.

## Sprite folder layout (2026-07-15)
Sprites live in per-entity folders: `warlock/` (with `summons/<name>/` and `forms/<name>/` beneath it), `enemies/<type>/`, `npcs/`, `fx/`. Everything in code still uses FLAT sprite names — three synced resolvers map name→folder: `spritePath()` in arena.html, `ENTITY_DIR` in tools/ingest_art.py, `SPRITE_ENTITY_DIR` in tools/gen_sprites.py. **When adding a new entity, add its token to ALL THREE maps** (default = sprites root). anims.json + rig JSONs stay at the sprites root; `_src/` stays flat. ingest_art.py writes into the entity folder automatically and rebuilds anims.json recursively.

## Encounter registry + persistence (Enhancement #2, 2026-07-15)
Every encounter is a row in `ENCOUNTERS` (arena.html, above ADV_AREAS): unique id, name, area, starting foes (**min 1 / max 2** — mid-fight summons/reinforcements exempt), summons, trigger, completion, post-completion access, story reqs, follow-up. Runtime state lives in `ADV.encState` and PERSISTS via localStorage (`karridge_enc`), alongside the quest save (`karridge_save`: quest, mq, gold, potions, relics, boy, level; autosaved every ~4s + on every completion). Helpers: `encDone(id)` gates triggers, `encStart(id)` on spawn, `encComplete(id)` on clear. A completed id NEVER re-triggers; a RELOADED game resumes in Karridge with no tutorial. **Adding an encounter:** add the ENCOUNTERS row, gate its trigger with `!encDone(id)`, pass the id to `advWave(...)`, complete it in `advEncounterCleared()` (or the pit chain marks `pit-N` automatically). New story in an old area = a NEW id. Dev: `?reset=1` wipes both keys for a fresh run.
