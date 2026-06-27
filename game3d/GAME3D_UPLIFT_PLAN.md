# Sorcerer-Sword 2.5D Uplift — Arena + Warlock (parity-first)  [Hiro 2026-06-26]
# APPROACH: ANIME-STYLE 2.5D ("2D that looks 3D") on Phaser AE — NOT true 3D.
# ART DIRECTION (Hiro 2026-06-26): clean anime / cel-shaded dark-fantasy. The low-poly GLB 3D looked bad/blocky; retire it. Hiro prefers an anime 2.5D game over the old 3D.

## SCOPE (locked)
- ONLY the ARENA (the Pit gauntlet). ONLY the WARLOCK champion. Nothing else yet.
- 1:1 PARITY with the original 2D game on: controls, all warlock abilities, evolutions, transformations,
  autoplay, music, volume, options, HUD, and every system the original has. Do NOT invent new mechanics.
- Graphics must LOOK GOOD via 2.5D, NOT real 3D models. Warlock = DARK ELF, SILVER HAIR, robe, STAFF + BOOK as a
  crafted 2D sprite. Transformations look good AND true to the original's color schemes + functionality.

## ENGINE + VISUAL (Hiro decision 2026-06-26 — REVISED to 2.5D)
- The on-hand low-poly GLB 3D models look bad (Runescape/Roblox-blocky); the warlock didn't look good. ABANDON
  true 3D + the GLB assets. Build **2.5D** instead: 2D sprites that READ as 3D through technique.
- Render in **Phaser AE** (its 2D nature is now the RIGHT fit, and Hiro wants to use the new AI-first engine),
  applying its METHOD: small verb API; reusable capability-named "blocks" in game3d/blocks/ each carrying its
  gotcha; agent builds/tests, Hiro plays, good blocks banked.
- ART STYLE = ANIME / cel-shaded dark-fantasy: clean lineart, expressive anime characters, dramatic rim light +
  bloom, saturated magic FX. The warlock is an anime dark-elf villain-mage (silver hair, staff, tome).
- The "looks 3D" comes from VISUAL TECHNIQUE, not polygons:
  * angled / isometric (or 3/4) camera + a grounded perspective floor for the arena.
  * LAYERED DEPTH + parallax (bg / mid / fg), y-sorted sprite draw order, contact shadows under units.
  * NORMAL-MAPPED 2D sprites so the warlock + enemies + spells get real dynamic lighting/shadow from in-scene
    light sources (Phaser Light2D / a normal-map shader). This is the main "3D" trick — light the flat art (anime-friendly: rim light + cel bands + bloom over photoreal).
  * GLOW / bloom / particle / post-FX for hex, sheol-fire, summons, transformations.
- ASSETS: crafted ANIME 2D SPRITE ART (AI-generated anime dark-fantasy that Hiro approves, or free/CC0), each with a normal
  map for lighting. Warlock = a striking ANIME dark-elf sprite (silver hair, robe, staff, book) with anim frames. Each
  TRANSFORMATION = its own distinct sprite set with the correct COLORS + glow (black dragon, arch devil, demon
  lord black+green, lich/reaper, arch succubi green). Do NOT reuse the disliked low-poly GLBs.
- MILESTONE 0 (look spike): in Phaser AE, stand up the angled arena floor + ONE lit, normal-mapped warlock
  sprite under a moving light, with a contact shadow + a glow FX. Goal: confirm the 2.5D look reads as 3D and
  LOOKS GOOD before building systems. Show Hiro early for a vibe check.

## SOURCE OF TRUTH = the original 2D game (match it EXACTLY). Key files in game/:
- src/combat/pit.js — ALL warlock combat: abilities, summons, evolutions, transformations, hex/sheol/fire DoTs,
  the channel/summon system, evolution panel, hit/parry/roll, AUTO behavior, color schemes.
- src/scenes/ArenaScene.js — the Pit fight flow, gauntlet ladder, win/lose, result/share card, handoff.
- src/core/autopilot.js + questnav.js — AUTO / autoplay driving.
- src/core/music.js (MusicMan, mute/♪ toggle, localStorage 'ss-arpg-muted') — music + volume.
- src/core/settings.js — options/settings.
- src/core/dialog.js + the UI/HUD — menus, options, belt, banners, evolution cards.

## WARLOCK PARITY CHECKLIST (from pit.js — verify each is reproduced 1:1)
Controls: keyboard + touch + on-screen + analog stick; SLASH(HEX), HEAVY(SUMMON = press->auto-channel),
PARRY(PORTAL), ROLL; face/aim; pause (Esc). Match feel + cooldowns + button labels per form.
Base kit: HEX (DoT, 3s on hex-fiend, stacks), SUMMON channel ladder (claw fiend -> bone dragon -> coven),
PORTAL (swap + ward; +4s on herald road), the staff/book caster look.
Summons: claw fiend; BONE DRAGON (acid breath = hex-strength DoT); SUCCUBI (fireball + fire DoT). AI + caps.
Evolutions: lv10 BINDER (DREADBINDER: double horde, bigger, 3x dmg) / HERALD (HEX FIEND: hex CD->3s+stack,
+35% dragon/claw, succubi burn, arch succubus green Sheol-fire spreads-on-kill, succubi healed by fire);
lv20 LICHLORD (lich uptime + extra undead) / ARCHFIEND (devil/demon-lord timer + wider hellfire). Evolution
PANEL at lvl10/20 (must auto-resolve under AUTO; never lock input; persists once chosen).
TRANSFORMATIONS (the showcase — look good + true to color + function):
- LICH / grim reaper (binder road): scythe (2x dmg, bigger reaper), FADE (+5s on binder), unkillable-while-dragon.
- BONE DRAGON -> BLACK DRAGON (binder): black body + sickly-green underglow, exploding fireball + acid breath.
- ARCH DEVIL (herald): devil form (~21s on herald), claw/bite, the taunt cinematic (reuse existing VO).
- DEMON LORD (herald, TERMINAL in-fight, resets next fight): bigger BLACK+GREEN warlock, all moves, 3s shorter
  summon, 3x demons, succubi auto-arch, arch succubi explode ONCE then fireball.
- ARCH SUCCUBUS: BLACK+GREEN, bigger GREEN Sheol fireball + explosion (no ally harm, survives, no timeout).
- SUCCUBI: fire/Sheol immune -> healed + max-HP up.
Ronin/druid/seraph: OUT OF SCOPE for now.

## SYSTEMS PARITY (must all exist, like the original)
Autoplay/AUTO toggle (F10/button) + headless-safe auto-resolve; MUSIC + mute toggle (persisted); VOLUME;
OPTIONS menu; HUD (HP, cooldowns, level, kills, banners); evolution cards; PAUSE (Esc); result + shareable
card at end; intro; the gauntlet of fights; force-update/build stamp; mobile + desktop layouts.

## BUILD MILESTONES (work the next OPEN one each run; small, resumable, never break the build)
0. 2.5D look spike (above). 1. Arena scene: angled pit floor, camera, dynamic lighting, parallax, ambiance.
2. Warlock SPRITE (dark elf/silver hair/staff/book) + normal map + anims (idle/move/cast/attack). 3. Controls 1:1.
4. Combat loop: spawns, HP/damage, gauntlet ladder, win/lose. 5. Abilities (hex/summon-channel/portal/fade).
6. Summons + AI (claw fiend/bone dragon/succubi). 7. Evolutions + lv10/20 panel + gating. 8. Transformations
(lich/black dragon/arch devil/demon lord/arch succubus) — SPRITE SETS + color + glow/VFX + function. 9. Systems parity
(AUTO/music/volume/options/HUD/pause/result card). 10. Polish: lighting, particles, post-FX, performance.

## PARITY AUDIT — every build run spawns a COMPARE subagent
Spin up a subagent that diffs the 3D build vs the ORIGINAL's full feature set (controls, abilities, evos,
transformations, AUTO, music, volume, options, HUD, pause, result card, AND anything else in game/src). It
maintains game3d/GAME3D_PARITY_CHECKLIST.md: each original feature -> PRESENT / PARTIAL / MISSING in 3D + the
original code ref. The build prioritizes closing MISSING/PARTIAL gaps so nothing the original has is dropped.

## RULES
- Work ONLY in game3d/. NEVER touch the live 2D game/ (it is shipped). 
- Each run = one small increment; update the plan + parity checklist + a "## STATUS" with what changed + what's next.
- Keep the build LOADABLE every run (no broken index). Headless/console-error check where possible; Hiro does the visual playtest.
- Harvest: when a piece works, scrub it generic + bank it in game3d/blocks/ with its gotcha (Phaser-AE method).
- Never git push. No paid API calls.

## STATUS: 2026-06-27 15:53 UTC  — ★★ #1 SPRITE SCALE-FIX LANDED (warlock no longer huge / dragon no longer tiny) ★★
ART INTAKE (priority-0): checked `art_in/` — all 14 side-on PNGs + 2 new foes were already ingested last run
(diffuse+normal pairs in `assets/sprites/`, mtimes 15:35). No NEW drops this run; `art_in/raw/` is the keyed
archive. Nothing to ingest. (The leftover source PNGs in `art_in/` can't be `rm`'d off the OneDrive mount —
harmless, `ingest_art.py` skips names already in `assets/sprites/`.)
CHANGED — applied the long-OPEN **#1 SCALE-NORMALIZATION FIX** in `arena.html`'s render path (the single
NEXT STEP from the 15:34 status). Every fighter now sizes by its TARGET WORLD HEIGHT, not its source-PNG dims:
(1) Added two consts by `SPRITE_TARGET_H`: `HERO_PX = 210` (on-screen px height of a 1.0-world-unit fighter at
    the FRONT plane) and `BASE_R = {brute:24, dragon:18, succubus:10}` (pit.js base hitbox radii).
(2) HERO scale (was `setScale(sc * formScale)`, which NEVER divided by texture height → the ~512px warlock PNG
    rendered HUGE): now `heroKey = demonLord→demonlord / devil→archdevil / lich→lich / else warlock_idle`;
    `displayScale = sc * (HERO_PX*SPRITE_TARGET_H[heroKey]) / this.hero.height`. Borrowed forms still read
    bigger (archdevil 1.3 / demonlord 1.4) but absolute size is normalized. Shadow now tracks `hero.displayWidth`.
(3) DEMON/summon scale (was `targetH = d.r*5.4|4.4|3.8` → dragon r18 rendered ~97px = TINY): now sizes by the
    same world table — `dKey` per type (clawfiend/bonedragon|blackdragon/succubus|archsuccubus),
    `dWorldH = HERO_PX*SPRITE_TARGET_H[dKey]*(d.r/BASE_R[type])` (the `d.r/BASE_R` factor PRESERVES the
    binder/herald per-summon swell), `× dsc` perspective by the demon's floor depth. Net at front plane:
    warlock ≈210px · clawfiend ≈252 · bonedragon/blackdragon ≈420 (TOWERS) · succubus ≈168 · archsuccubus ≈189.
VERIFIED: all 3 edited regions re-read via the **Read tool** (fresh disk) — consts at 50-55, hero scale at
798-805, demon scale at 888-891; braces balanced, complete statements, tail intact (class closes + `new
Phaser.Game` present at ~964). `node --check` over bash AGAIN unusable: the OneDrive FUSE mount served the
documented **STALE TRUNCATED copy** (190 lines / 13278 chars, ended mid-file, no `</html>`) so the extracted-JS
syntax check found 0 script blocks — verification was Read-tool based per the mount-hazard protocol. Live `game/`
untouched. PARITY-COMPARE subagent SKIPPED (mount actively serving truncated reads → a bash-diffing subagent
gets garbage); checklist updated in-process.
NEXT STEP (single, priority-2): begin the SIDE-ON 1v1 GG STAGE FLIP — warlock anchored LEFT facing RIGHT, ONE
opponent anchored RIGHT facing LEFT (flip per side), the rest of the gauntlet as a frozen lineup in the back,
eye-level camera, two-fighter HUD (two health bars top + "FIGHT n/N"). Static shell first; duel loop + whirl after.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: the roster should now be correctly proportioned
(medium warlock, towering dragons, human-ish succubi). Summon ladder reaches the COVEN at the test level 5.

## STATUS: 2026-06-27 15:34 UTC  — ★ SIDE-ON ROSTER RE-INGESTED (14) + 2 NEW FOES + warlock render fix ★
ART INTAKE (priority-0): Hiro had re-dropped the COMPLETE set as SIDE-ON sprites into `art_in/` (newer than
the front-facing `assets/sprites/` copies) PLUS 2 brand-new challengers — `shambler` (zombie brute) and
`bonearcher` (skeletal archer). Per the BUILD-PRIORITY-OVERRIDE these side-on PNGs REPLACE the old front art,
so this run re-ingested ALL 14 (all confirmed already keyed: 50–67% transparent, transparent corners).
PIPELINE GOTCHA (new, important): running `tools/ingest_art.py` with cwd ON the OneDrive FUSE mount silently
SWALLOWED both its stdout AND its file writes (EXIT 0, zero output, mtimes unchanged) — the documented mount
write-hazard, now seen for *script execution* too, not just edits. WORKAROUND that worked: ran the identical
ingest logic INLINE writing to local `/tmp/sprites_out/`, then `cp` each file into `assets/sprites/` and
**md5-verified all 28 diffuse+normal files match** (hash-bad=0) + alpha/normal sanity (alphaMax 255, normals
blue-dominant). Added `shambler:1.15, bonearcher:1.05` to `tools/ingest_art.py`'s TARGET_WORLD_H too.
WIRED into `arena.html` (all verified via Read tool — bash served the usual STALE 193-line truncated tail cut
mid-statement, node --check unusable): (1) `SPRITE_TARGET_H` += `shambler:1.15, bonearcher:1.05`; (2) preload
+= `shambler`/`bonearcher` (array-form normal-mapped). (3) **WARLOCK RENDER BUG FIXED:** the new side-on
`warlock_idle.png` is 336×512 but the hero loaded as a HARDCODED 256×384 *spritesheet* → `sheetOK` (frameTotal
check) FAILED → hero silently rendered the OLD front-facing `warlock_diffuse.png`. Replaced the spritesheet
load with a plain normal-mapped `this.load.image('warlock',[idle,_n])` and simplified the create() hero block
to use it directly as a single still (`heroTex = exists('warlock')?'warlock':'warlock_f0'`); the lone
`play('warlock_idle')` left is guarded by `anims.exists`. Build stays loadable; live `game/` untouched.
PARITY-COMPARE subagent SKIPPED (mount is actively serving truncated reads → a bash-diffing subagent would get
garbage); checklist updated sequentially in-process instead (per prior-run practice).
NEXT STEP (single, priority-1): the still-OPEN #1 SCALE-FIX — apply `displayScale=(HERO_PX*SPRITE_TARGET_H[key])
/tex.height` in update() (~line 793 hero scale + the demonSprites make) so warlock stops rendering huge and
dragons tiny; THEN begin the side-on 1v1 GG stage flip (eye-level cam, warlock faces RIGHT, one foe LEFT,
lineup in back, two-fighter HUD). READY FOR HIRO VIBE CHECK once scale-fix lands (open game3d/arena.html over http).

## STATUS: 2026-06-27 05:4x UTC  — ★ FULL SPRITE ROSTER INGESTED (12/12 fighters) + scale table seeded ★
ART INTAKE (the priority-0 every run): Hiro dropped the COMPLETE sprite set into `art_in/` after the
05:25 run (12 keyed RGBA PNGs). 7 were already ingested; this run ingested the **5 NEW**:
`archdevil`, `demonlord`, `lich`, `warlock_hurt`, `warlock_walk`.
PIPELINE (banked as `tools/ingest_art.py` — the build-side half, harvested from the prior inline runs):
each → cap longest side ≤512px → **auto-Sobel normal map** from alpha-masked luminance (RGBA, a=mask) →
write `assets/sprites/<name>.png` + `<name>_n.png` → archive keyed source to `assets/sprites/_src/`.
Result: ALL 12 fighters (warlock idle/walk/cast/hurt · lich/archdevil/demonlord · clawfiend/bone+black
dragon/succubus/archsuccubus) now have diffuse+normal pairs. Verified every pair present + normals carry
alpha (max 255).
WIRED into `arena.html`: (1) preload — added 5 `this.load.image(...)` array-form entries (diffuse+normal
bound for Light2D) right after the summon block. (2) Seeded `const SPRITE_TARGET_H {}` next to `SPR` — the
per-type WORLD TARGET-HEIGHT table (warlock 1.0 · lich 1.05 · archdevil 1.3 · demonlord 1.4 · clawfiend 1.2 ·
dragons 2.0 · succubus 0.8 · archsuccubus 0.9) for Hiro's #1 SCALE-FIX bug, with the formula in a comment:
`displayScale = (HERO_PX*SPRITE_TARGET_H[key]) / tex.height` × perspective scale.
VERIFIED: both edits re-read via the **Grep/Read tools** (fresh disk) — preload at 597-601, table at 44-46,
brace structure intact (entries inserted between complete statements). bash AGAIN served the documented
**STALE 198-line truncated tail** (cut mid-`evoTick`) so `node --check` over bash was unusable as always;
verification was Read/Grep-tool based per the mount-hazard protocol. `rm` on the OneDrive mount is "Operation
not permitted", so the 5 now-ingested keyed PNGs remain in `art_in/` — harmless: `ingest_art.py` skips names
already in `assets/sprites/`. Did NOT touch live `game/`.
NEXT STEP (single, priority-0→1): APPLY the scale table in the render path — find the hero/demon draw in
`arena.html` (~the `update()` form-scale/tint at ~785 + the demonSprites sprite-make at ~856) and replace the
raw `setScale`/`P.r`-based sizing with `displayScale = (HERO_PX*SPRITE_TARGET_H[key])/tex.height` so warlock
stops rendering huge and dragons stop rendering tiny. Also SWAP the hero texture by form (idle→lich/archdevil/
demonlord) and by state (walk/hurt) now that those textures load — the M8 form code already tracks the flag.
OPEN Q for Hiro (note, don't act): the 7 already-ingested sprites were RE-DROPPED in `art_in/` at 05:28–29
(newer than the 04:52 `assets/sprites/` copies) — possibly improved art. Left untouched this run to avoid
silently overwriting; say the word and I'll re-ingest the full 12.

## STATUS: 2026-06-27 05:25 UTC  — ★ ARCH DEVIL TRANSFORMATION LIFECYCLE PORTED (M8 begun) ★
ART INTAKE: checked `art_in/` — only `DROP_ART_HERE.md` + the prior `_preview_*`/`_summons_contact` vibe-check
PNGs; `art_in/raw/` empty. No new sprites to ingest this run.
CHANGED: Ported the **ARCH DEVIL transformation lifecycle** (pit.js:789-830) into `arena.html` — the M8 NEXT-GAP.
(1) `devilDur()` (15 / herald 21 / archfiend 31), `enterDevil()` (lv<8 gate, `P.devilT`, `P.r=24`, flash/shake/
vib/leafBurst/banner), `exitDevil()`, `enterDemonLord()` (terminal black+green form, `P.r=27`) — all 1:1.
(2) `archDevilOutro()`: HERALD road fully ported (taunt banner + VO-if-VoiceMan → `enterDemonLord()` after 3s;
per-fight `archCineFight` guard + `archLastTaunt` no-repeat). NON-HERALD road plays the faithful taunt/seraph/
cast-down BANNERS then reverts — the guaranteed-LICH pipeline + seraphim DESCENT visual are stubbed (TODO M8).
(3) `frame()` now ticks `P.devilT` down → fires the outro on expiry (DEMON LORD is terminal, no timer).
(4) `updateLabels()` ported: shows the active FORM (WARLOCK/ARCH DEVIL/DEMON LORD/LICH) in the `#verbs` HUD.
(5) Render: the hero now scales to `P.r` and tints by form (devil RED, demon-lord GREEN). (6) Added FX/announce/
camera shims (`flashFx`/`leafBurst`/`showBanner`/`camFocus`/`vib`/`archVoice`/`archBank`) so the ported code
reads 1:1. (7) DEBUG **V** key vibe-checks the devil (press again → outro → DEMON LORD on the herald road).
SCOPED OUT (next run): the CLAW/BITE verb bodies (`devilStrike`:917/`devilClaw`:903) that make the form actually
*fight* — this run is the lifecycle/visual only; the verbs still route to the base HEX/SUMMON.
VERIFIED: all 4 edited regions (the devil block at ~282-358, the `frame()` devil tick ~534-535, the update()
form-scale/tint ~773-779, the DEBUG-V keybind) re-read via the **Read tool** (fresh disk view), intact and
brace-balanced (complete functions inserted between complete functions). `node --check` over bash was AGAIN
unusable — the OneDrive FUSE mount served the documented STALE **198-line truncated tail** (cut mid-`evoTick`),
so verification was via the Read tool exactly as every prior run fell back to. Build stays loadable; no live
`game/` touched. DID NOT spawn a concurrent parity-writer subagent (mount-corruption hazard) — checklist updated
sequentially in-process: added a **Transformations (M8)** section (ARCH DEVIL/outro/DEMON LORD = PARTIAL,
LICH/ARCH-SUCCUBUS = MISSING), flipped Per-form RE-LABELING → PARTIAL, rewrote the NEXT GAP.

## NEEDS HIRO — CAMERA DIRECTION CONFLICT (two contradictory 2026-06-27 decisions in this plan)
The plan currently holds TWO camera/staging decisions both dated 2026-06-27 that contradict ea
## ⚡⚡ BUILD PRIORITY OVERRIDE (Hiro 2026-06-27, do these BEFORE any more combat-logic ports)
The combat-logic ports (abilities/transformation lifecycles) carry over to the new presentation, so PAUSE them and
make the VISIBLE pivot first — this is what Hiro is checking each cycle:
1. INGEST the 14 NEW SIDE-ON sprites now waiting in art_in/ (warlock_idle/walk/cast/hurt, lich, archdevil,
   demonlord, clawfiend, bonedragon, blackdragon, succubus, archsuccubus, shambler, bonearcher). Key+normal-map+
   move to assets/sprites/. They REPLACE the old front-facing art.
2. APPLY THE SCALE-NORMALIZATION FIX (per-type target heights — dragon towers, succubi human-ish, warlock medium).
3. FLIP arena.html to the SIDE-ON 1v1 GG GAUNTLET shell: eye-level side camera, warlock facing RIGHT, ONE opponent
   facing LEFT, the rest as a background lineup, two-fighter HUD. Even a static side-on shell with the new art,
   correctly scaled, is the vibe check Hiro wants — wire the duel loop + camera-whirl AFTER.
Then resume the ability/transformation ports into the new side-on stage.
 0.8 …, see the TOP-PRIORITY
FIX section below) so `displayScale = targetWorldHeight / sprite.pixelHeight`, then apply perspective scale on top.
This is a reported bug and outranks further M8 verb work; it should be the next run's increment.
## ★★ FINAL CAMERA/COMBAT DIRECTION (Hiro DECIDED 2026-06-27) — SEQUENTIAL 1v1 GAUNTLET DUELS
SUPERSEDES every earlier perspective note (angled tilt / top-down / brawler). This is the locked vision.
- Presentation = a Guilty Gear / BlazBlue 1v1 SIDE-ON fighter (eye-level, two fighters facing each other),
  structured as the PIT GAUNTLET.
- You fight ONE opponent at a time. The UPCOMING opponents wait in the BACKGROUND of the pit as a visible
  lineup/audience, idle-animating or frozen — you always SEE who's next.
- ON DEFEAT: a FINISHER / "fatality" beat on the current foe, then the CAMERA WHIRLS around the pit to the
  next opponent; that foe stops idling, steps into the arena, and a NEW 1v1 begins in the correct facing.
  Repeat through the whole gauntlet. Net: 1v1 fighting-game atmosphere + the feeling of carving through many.
- THIS MAPS DIRECTLY onto the original pit.js gauntlet (FIGHTS[] = sequential fights, "fight N of M") — so it
  is FAITHFUL, not a departure. Each gauntlet fight = one duel.
- The WARLOCK keeps his FULL kit each duel: his summons (claw fiend, bone/black dragon, succubi, arch succubi)
  fight at his SIDE as ASSISTS vs. the current single opponent (fighting-game pet/assist pattern). All abilities,
  stats, hex/sheol/fire DoTs, evolutions and transformations carry 1:1 — only the SPATIAL layout becomes a 1v1
  lane instead of a 360° swarm.
- ART: every character SIDE-ON (warlock/allies face RIGHT, enemies face LEFT; engine flips per side) — per the
  updated gen_sprites manifest. Scale-normalization still applies (dragon towers, succubi human-ish).
- ARENA: the Pit — pink/magenta ring, dark interior, the crowd/lineup of waiting challengers in the back,
  blood + green-hex FX, fighting-game HUD (TWO health bars at top, a "FIGHT n / N" counter, super/level meter).
- BUILD ORDER: (1) sprite SCALE FIX; (2) side-on 1v1 stage + eye-level camera + two-fighter HUD; (3) duel loop
  bound to the pit.js fight flow (current opponent only); (4) the camera-WHIRL + finisher transition between
  fights, with the next foe staged in the background lineup; (5) summons-as-assists; (6) port abilities +
  transformations. Keep the build loadable each run; Hiro vibe-checks via arena.html over http.
ad** — 5 `load.image(name,[diffuse,normal])` array-form
loads so Light2D shades each; (b) `create()` — a new **`demonSprites` Map** (demon→Sprite); (c) the demon
render loop now **overlays Hiro's real lit Sprite** on top o
## ★ TOP-PRIORITY FIX (Hiro 2026-06-27): SPRITE SCALE NORMALIZATION
BUG: sprites are sized by their SOURCE PNG pixel dimensions, so the tall warlock (764x1168) renders HUGE and the
wide-short dragon (1121x738) renders TINY — inverted/inconsistent scale. Hiro: "warlock is huge, dragon is tiny,
claw demon tiny." Fix = normalize every sprite to a per-TYPE world TARGET HEIGHT, independent of source px.
- Define a WORLD UNIT (warlock human height = 1.0 at the front plane), then scale each sprite to its target:
  warlock/human 1.0 · lich 1.05 · arch-devil 1.3 · demon-lord 1.4 · claw fiend (brute, r24) 1.2 ·
  bone/black DRAGON 1.9-2.2 (it's a DRAGON — imposing, wide wingspan) · succubus (r10) 0.8 · arch-succubus 0.9.
  (Loosely tracks the original pit.js hitbox radii: brute 24 > dragon 18 > warlock 16 > succubus 10, but the
  DRAGON must READ big regardless of its small hitbox.)
- Implement a SCALE TABLE keyed by sprite name; compute displayScale = targetWorldHeight / sprite.pixelHeight so
  any future art drops in correctly sized. THEN apply the angled-floor perspective/depth scale on top.
- Ground-anchor every unit at its feet (bottom-center) with its contact shadow at the feet, y-sorted.

## ARENA IDENTITY (Hiro DECIDED 2026-06-27): MODERATE ISOMETRIC TILT
Camera = a high-angle ISOMETRIC-ish view (not low/cinematic, not flat top-down) of the original's CIRCULAR PIT.
Re-skin the floor to the Sorcerer-Sword pit identity: a glowing PINK/MAGENTA RING border, dark interior, red
BLOOD-SPLATTER decals, GREEN HEX/POISON pools, damage numbers + health bars over units (like the original).
Keep the lit, normal-mapped anime sprites + depth (y-sort, contact shadows) so it still "looks 3D" but reads
clearly as the first game's pit from a high angle. Do the SCALE-NORMALIZATION fix FIRST, then this re-skin.
