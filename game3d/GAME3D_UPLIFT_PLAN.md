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

## STATUS: 2026-06-28 02:25 UTC  — ★★★ BRAWLER MIGRATION step 1 — TWO CROWD FOES NOW PRESS AT ONCE: the single rotating charger became a SLOT ARRAY (cap 2), so a 2nd back-row foe commits + lunges + strikes on its OWN lane while the 1st is still mid-swing. The charter true-north (multi-foe DC pressure) gets its first real foothold — render-only, i-frame-safe, build loadable. ★★★
(NB clock skew vs the 03:0x lunge-lane entry below is same-cycle, not a rewind. THIS is the newest run; it builds directly on the 03:0x lunge-lane decal.)
ART INTAKE (first): `art_in/` re-checked. The only Jun-28 source PNGs (warlock_summon/fireball/fireball_hit/bg_pit_far, 00:56–00:57)
are OLDER than their keyed `assets/sprites/`+`assets/bg/` counterparts (01:00–01:05) and `art_in/raw/` already holds the keyed
archive → ALREADY ingested + wired (verified prior runs). Top-level copies are stale leftovers; LEFT in place (no deletes in a
scheduled run). Nothing new → nothing to ingest. gen-sprites SKIPPED (PAID xAI → forbidden in a scheduled run).
PRIORITY PICK: the 03:0x NEXT STEP's NO-PAID branch — "begin the brawler migration scoped small: make ONE extra crowd foe also
commit+strike on its own timer, reusing the exact commit-lock + sidestep-whiff + lane-decal path; study the per-foe state keys
first (today everything hangs off the single `this._crowdCharger`/`this._chargeAim*`)." Did exactly that — the charter's
true-north (priority-2 multi-enemy pressure) over the lighter polish alt.
STATE-KEY STUDY (the asked-for first step): the whole charge arc hung off FIVE singletons — `_crowdCharger` (the foe),
`_chargeT0`, `_chargeStruck`, `_chargeAimX/_chargeAimY` (the committed lunge spot), gated by `_nextCharge` + rotated via
`_recentChargers`. A 2nd simultaneous attacker needs its OWN copy of {foe,t0,struck,aimX,aimY}. So I folded those five
singletons into ONE per-foe SLOT object and made the live set an ARRAY.
CHANGED — `game3d/arena.html`, 7 surgical edits INSIDE `syncFoeCrowd` (no new method, NO duplicated arc — single-copy logic
now sourced from a slot; sim/combat/targeting untouched, still render-only):
 (1) selection/cull (~L1685): `this._chargers=[]` (array) + `_maxChargers=2`; cull filters dead/left/promoted slots; the spawn
     gate is now `_chargers.length<_maxChargers && waiting>=2 && now>_nextCharge`, picking a foe that's neither in the
     rotation `recent` set NOR already `busy` (charging), and PUSHING a fresh `{foe,t0:now,struck:false,aimX:null,aimY:null}`.
 (2) override head (~L1731): `const slot=this._chargers.find(s=>s.foe===e); if(slot){` replaces `if(e===this._crowdCharger){`;
     arc time `t` now reads `slot.t0`.
 (3) aim-commit (~L1739): the lunge-commit lock writes `slot.aimX/aimY` (per-slot committed spot), so each charger aims
     independently at where YOU were when ITS lunge committed.
 (4) arc-done (~L1748): `t>=1` now SPLICES this slot out of the array (`filter(s=>s!==slot)`) instead of nulling the singleton.
 (5) lane decal (~L1754) reads `slot.aimX/aimY` — so BOTH chargers paint their own ground oval at once.
 (6) strike gate (~L1764): `if(hot && slot && !slot.struck){ slot.struck=true;` — each slot strikes its committed lane ONCE.
 (7) strike aim (~L1770): `_aimX/_aimY` sidestep-whiff test reads `slot.aimX/aimY`.
 CADENCE: `_nextCharge` re-set to `now + 700 + Math.random()*1000` (0.7–1.7s) — deliberately UNDER the 1.4s arc so a 2nd
 presser usually joins while the 1st is mid-lunge (genuine two-at-once), offset so they don't perfectly sync. Cap 2 + the
 1.4s arc bound the rate to ~2 active + a brief breather — pressure, not a wall of charges.
SAFETY: still ZERO sim/HP authority — both chips route through `hurtWarlock` (every i-frame gate negates; HP FLOORED at 1),
so two simultaneous pressers can NEVER KO or softlock. Each is fully telegraphed (yellow tint + windup arc + ground lane oval)
and dodged by a sidestep off its lane (commit-lock + whiff), exactly like the single charger.
VERIFIED: mirrored the new slot logic into `outputs/slotcheck.js` → `node --check` SYNTAX OK; behavioral harness over ~6s @50ms
PASSED 5/5 randomized runs — cap never exceeded 2, reached TWO concurrent chargers, ≥2 DIFFERENT foes struck, every strike
carried its OWN committed aim, each slot struck once then freed. Grep over the whole file = ZERO remaining
`_crowdCharger`/`_chargeT0`/`_chargeStruck`/`_chargeAimX/Y` references (all 7 sites converted). Edited region re-read BALANCED
via the Read tool; file TAIL WHOLE on FRESH disk (`})();` L2515 → `</script>` L2516 → `</body>` L2517 → `</html>` L2518; ~2518
lines, +10 over the prior 2506 as expected). NB the OneDrive/FUSE bash mount AGAIN served the truncated ~1089-line stale tail —
trusted the Read tool + the isolated node harness, never bash, for `wc`/`node --check`/grep over the file. Build stays loadable;
live `game/` untouched; game3d NOT published.
PARITY/BENCHMARK: priority-2 (MULTI-ENEMY WAVE PRESSURE) advances from "1 cosmetic charger + restless leaning" to "2 concurrent
committed attackers" — the first real step of the BRAWLER MIGRATION true-north. DC FEEL gap narrows on the "only one thing ever
threatens you at a time" tell. Still PARTIAL vs full DC (the duel sim remains 1 authoritative foe + N render-pressure chargers,
not N fully-sim foes); ZOMBIES/BONE-ARCHERS summon types + DEMON-LORD coven ×3 + arch-succubus FUSE still MISSING (in pit.js,
not yet ported). LOOK unchanged ≈88%; this is a FEEL gain. Harvested → `game3d/blocks/`.
NEXT STEP (single): RAISE `_maxChargers` toward 3 AND scale it to wave size (e.g. `Math.min(3, 1+floor(waiting/3))`) so a packed
wave feels like a Dragon's-Crown mob while a near-empty one stays a duel — then give each slot a tiny per-foe cadence jitter so
the lane ovals stagger across the floor. After that, the bigger refactor: promote a render-charger into a REAL sim foe (shared HP/
targeting) so a 2nd attacker can be hit/killed mid-charge, not just cosmetically pressure — the true multi-sim-foe brawler.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach any 3+-foe wave (TWIN HOOKS at fight 2, or anything past
fight 3). Now TWO back-row foes can break rank at once — each paints its OWN glowing lane oval on the ground and lunges on its
own beat, so you're reading + sidestepping two committed swings instead of one. Step off each oval (left/right OR into depth) and
both whiff with a grey MISS.

## STATUS: 2026-06-28 02:14 UTC  — ★★★ DC LIVING PIT — ATMOSPHERIC PARTICLE LAYER LANDED: rising warm EMBERS + raking GOD-RAY shafts + cool drifting DUST behind the actors. The graded pit now BREATHES (was a static screenshot). LOOK ~85%→~88%. ★★★
(NB clock skew: bash UTC now reads 02:14, BELOW the 03:0x entry that follows — same-cycle skew, not a rewind. This is the newest run.)
ART INTAKE (first): `art_in/` re-checked vs `assets/sprites/` + `assets/bg/`. The only Jun-28 source PNGs (warlock_summon/
fireball/fireball_hit/bg_pit_far, 00:56–00:57) are OLDER than their keyed `assets/*` counterparts (01:00–01:05) → already
ingested AND fully WIRED. VERIFIED end-to-end this run (the 00:56 intake is COMPLETE, not just preloaded): fireball in-flight
bolt draws as the painted sprite oriented to velocity (arena.html L2324-2340, fireSprites pool + reaper, HEX tinted purple);
fireball_hit is the impact bloom (`fireBurst` L2053); warlock_summon is the SUMMON-channel pose (selected each frame at L2117
for `P.channel`); bg_pit_far/floor/fg are the 3-layer parallax backdrop (L1517-1525). `art_in/raw/` is the keyed archive.
Nothing new → nothing to ingest. gen-sprites SKIPPED (PAID xAI → forbidden in a scheduled run).
PRIORITY PICK: the benchmark's standing "biggest gap to ~90% = a LIVING crowd + AMBIENT MOTION" — its AMBIENT-MOTION half.
The `__AUDIT__.embers` flag (arena.html L2165) was referenced but NOTHING ever created it (always scored FAIL). Closed both.
CHANGED — `arena.html`, 3 additive edits, NO sim/combat/targeting/render-sim touch (purely a render layer):
  • NEW methods `buildAtmosphere()` / `_initMote()` / `stepAtmosphere()` inserted before `update()` (after `flash()`, ~L2084).
    A self-managed pool of `glow` images: 4 GOD-RAY shafts (tall soft `0xffe6b0` columns raked 18° from upper-right, each
    breathing on `sin(t*0.6+ph)`), + 34 EMBER/DUST motes (every 4th a slower cool `0x9ab0d0` dust speck; warm embers rise
    18-48 px/s with a per-mote sine SWAY, fade in off the floor + out toward the rim, RECYCLED at the bottom). All on
    `scrollFactor 0`, depth -50/-49 (OVER the painted backdrop at -100/-99, UNDER every depth>=0 actor/FX). `glow`-guarded
    (early-return if the texture is absent) so the build stays loadable. Sets `this._embers=true` → flips the audit flag.
  • `create()`: `this.buildAtmosphere();` right after `applyCameraGrade()` (so the embers ride under the same DC grade/bloom).
  • `update()`: `this.stepAtmosphere(now, rdt);` after `syncFoeCrowd` — driven on REAL delta (rdt), so the air keeps drifting
    even through the finisher HIT-STOP (when sim dt=0).
VERIFIED: mirrored all three methods into `outputs/_atmo_check.js`; `node --check` = SYNTAX OK. Edits re-read on FRESH disk via
the Read tool (bash/FUSE again served the truncated ~1089-line tail of this now-2506-line file — node-check/grep over the mount
stay unusable, trusted the Read tool). Insertion at L2084 present; `create()` call + `update()` call present; file TAIL WHOLE
(`</script>` L2503 → `</body>` L2504 → `</html>` L2505; file grew 2446→2506 = +60 as expected). Build loadable; live `game/`
untouched; game3d NOT published.
PARITY/BENCHMARK (subagent): updated `GAME3D_PARITY_CHECKLIST.md` — title/backdrop ambient row MISSING→PRESENT (embers/rays/
dust); CAST + walk/hurt/summon pose rows corrected to PRESENT (doc-lag — they were already wired). pit.js line refs spot-checked
(hexBolt:565, portal:581, summonDemons:597, enterDevil:792, enterDemonLord:806, enterLich:970, summonZombies:1014, summonArchers:
1022, EVOLUTIONS:84) — all still accurate. Genuinely STILL MISSING/PARTIAL (not invented): ZOMBIES (summonZombies:1014) +
BONE ARCHERS (summonArchers:1022) as full pit.js summon types, DEMON-LORD coven ×3 variant (enterDemonLord:806), arch-succubus
FUSE + Green-Sheol spread (M8). DC LOOK now ≈ **88%** (ambient half of the "living pit" gap closed; the crowd-LIFE half remains).
NEXT STEP (single): REACTIVE CROWD LIFE — the painted amphitheater spectators are a STATIC texture; add a subtle sway loop +
a roar/brightness pulse on kills and transform beats (the named biggest gap's remaining half; render-only, no paid art). After
that: per-actor multi-frame animation cycles, then HUD/HP-bar polish + a COMBO counter. (Brawler migration — a 2nd sim-driven
crowd attacker via the commit-lock/sidestep-whiff/lane-decal path — remains the charter true-north for a dedicated run.)
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: warm embers now rise through the pit, soft god-ray shafts rake
across the amphitheater, and dust drifts in the air — all under the DC grade/bloom — so the brawl reads as a LIVING painting
instead of a graded still. (Embers keep drifting even during the finisher freeze.)

## STATUS: 2026-06-28 03:0x UTC  — ★★★ DC READABILITY — THE CHARGE'S COMMITTED STRIKE WINDOW NOW DRAWS AS A GROUND "LUNGE LANE" OVAL: you can SEE where to step off (it fills in as the lunge closes; under feet, on the floor) ★★★
ART INTAKE (priority-0): `art_in/` re-checked vs `assets/sprites/`. The only Jun-28 source PNGs (warlock_summon/fireball/
fireball_hit/bg_pit_far, 00:56–00:57) are OLDER than their keyed `assets/sprites/` counterparts (01:00–01:05) → already
ingested + wired; `art_in/raw/` is the keyed archive. Nothing new → nothing to ingest. gen-sprites SKIPPED (PAID xAI → forbidden in a scheduled run).
CONTEXT: executed the prior NEXT STEP's no-paid branch — "draw a faint ground LUNGE-LANE decal under the charger during
its 0.22–0.50 wind so the player can SEE where to step off, reusing `_aimX/_aimY`; study the depth/y-sort so the decal sits
under feet, not over sprites." Did exactly that.
DEPTH/Y-SORT STUDY: `zoneGfx` (L1440) already establishes the on-floor band — `setDepth(1)`, "on the floor, beneath units"
(units render at `depth ≈ fy`, the painted backdrop at `-100/-99`). And `P.x/P.y` ARE the plane coords every zone/strike
test draws in (`zg.fillCircle(z.x,z.y,…)`), and the charge's committed spot is `this._chargeAimX/_chargeAimY` (= P.x/P.y
frozen at the lunge-commit). The strike test that the player must dodge is `|P.x-aimX|<56 && |P.y-aimY|<34`. So the
decal = an oval of those exact half-extents (112×68 full), centred on the committed point, on a depth-1 layer.
CHANGED — `arena.html`, 2 edits in `syncFoeCrowd` (verified via the Read tool on FRESH disk — bash/FUSE still serves a
truncated ~1.1k-line tail of this 2.45k-line file, so node-check/grep over the mount stay unusable; edited regions re-read whole):
  • NEW lane layer (after the `cg` setup, ~L1666): `this._laneGfx = this.add.graphics()`, cleared each frame, `setDepth(1)`
    — same on-floor band as zoneGfx, so it draws BENEATH the units. Render-only (writes no sim state).
  • LUNGE-LANE TELEGRAPH (inside the charge override, ~L1736–1748): while `this._chargeAimX!=null && t<0.62` (i.e. from
    the lunge-commit through the strike), paint a faint ground oval at `(_chargeAimX, _chargeAimY)`: a warm `0xffd24a`
    danger FILL + a `0xffae3a` boundary RING (both pulsing on `sin(now/55)`) sized to the literal 112×68 dodge window, plus
    a white CLOSING CORE that shrinks as `u=(t-0.22)/0.28` runs 0→1 — so the oval visibly "fills in" as the swing nears,
    reinforcing the existing SIDESTEP-WHIFF dodge with a clear visual read of WHERE to step off (x OR depth).
VERIFIED: mirrored the decal block into `outputs/lanecheck.js`; `node --check` SYNTAX OK and ALL asserts PASS — (1) no draw
before commit (aim null), (2) draws mid-lunge with 0<u<1, (3) no draw after strike (t≥0.62), (4) outer oval = the 112×68
window size, (5) closing core stays positive at u→1 (never inverts). Edited regions re-read BALANCED via the Read tool (lane
`if(_chargeAimX!=null && t<0.62){` opens L1741 closes L1748; charger `if(e===_crowdCharger){` closes L1749) and the file
TAIL is WHOLE (`new Phaser.Game` L2397–2402 → touch-controls IIFE → `</script></body></html>` L2443–2445). Build stays
loadable; live `game/` untouched; game3d NOT published.
PARITY/BENCHMARK note: HIT-FEEDBACK / READABILITY (master-checklist #3) → the back-row charge is now telegraphed (yellow
sprite tint + windup arc), DODGEABLE BY MOVEMENT (commit-lock + sidestep whiff, prior run), and now LEGIBLE — a DC-style
ground danger-zone shows the kill window. Remaining biggest gaps to DC: (a) the dedicated gladiator side-on sprites
(door/hook/chain/pyre/gunner/grave/stitch/brute/master/hound/necro/champ/beast) — still placeholder, needs a PAID gen-sprites
run with Hiro present; (b) BRAWLER MIGRATION (multiple crowd foes pressuring/damaging at once, sim-driven) — the charter's
true-north, a deliberate multi-run refactor.
NEXT STEP (single): PAID-when-Hiro-present → run gen-sprites for the gladiator cast (biggest LOOK gap). NO-PAID branch →
mirror the lane-oval read onto the OTHER ground telegraphs for consistency, OR begin the brawler migration scoped small:
make ONE extra crowd foe (besides the rotating charger) also commit+strike on its own timer, reusing the exact
commit-lock + sidestep-whiff + lane-decal path just built (so 2 foes can pressure at once) — study the per-foe state keys
first (today everything hangs off the single `this._crowdCharger`/`this._chargeAim*`; a 2nd attacker needs its own slot).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach any multi-foe wave (TWIN HOOKS at fight 2, or any fight
past #3). When a back-row foe breaks rank to charge, a glowing oval now paints on the GROUND where its swing will land and
fills in as it lunges — just step out of the oval (left/right or up/down into depth) and the swing whiffs with a grey "MISS".

## STATUS: 2026-06-28 02:4x UTC  — ★★★ DC CHARGE NOW DODGEABLE BY MOVEMENT — LUNGE-COMMIT LOCK + SIDESTEP WHIFF (the charge stops tracking you; step off the lane and it misses) ★★★
ART INTAKE (priority-0): `art_in/` re-checked vs `assets/sprites/` — the only Jun-28 PNGs (warlock_summon/fireball/
fireball_hit/bg_pit_far, 00:56–00:57) are OLDER than their keyed `assets/sprites/` counterparts (01:00–01:05) i.e. ALREADY
ingested + WIRED (`art_in/raw/` is the archive). Nothing new → nothing to ingest. gen-sprites skipped (PAID xAI → forbidden in a scheduled run).
CONTEXT: prior NEXT STEP (no-paid branch) — "give the charge a FIXED strike X at lunge-commit so a SIDESTEP (not only an
i-frame) can also avoid it; FIRST study the lane/clamp math so the charger can't stick/jitter." Did exactly that.
LANE-MATH STUDY: the old `hitX=P.x+48` was RE-READ from live P every frame, so during the lunge (t 0.22→0.50) the charger
eased toward a MOVING target = rubber-band/stick. Fix = freeze the aim ONCE at the windup→lunge boundary.
CHANGED — `arena.html`, `syncFoeCrowd` charger arc (verified via the Read tool on fresh disk — bash/FUSE still serves a
TRUNCATED 1088-line tail of this 2.27k-line file, so node-check over the mount is impossible; edited region re-read whole):
  • LUNGE-COMMIT LOCK (charge override, ~L1714–1731): at `t>=0.22` capture `this._chargeAimX=P.x; this._chargeAimY=P.y` ONCE;
    the whole arc now aims at `hitX=aimX+48` (the COMMITTED spot), not live P. Stops the track/stick; cleared on new pick (L1685)
    and at `t>=1`.
  • SIDESTEP WHIFF (strike gate, ~L1733–1779): on the strike frame, `_inLane = |P.x-aimX|<56 && |P.y-aimY|<34`. IN lane → the
    existing spark + i-frame-gated chip + recoil (unchanged). OFF lane (stepped away in x OR depth) → WHIFF: grey dust puff +
    "MISS" popup, NO spark and hurtWarlock NEVER called. So a clean SIDESTEP now negates the charge just like WARD/roll, and the
    chip is gated behind BOTH i-frames AND position — strictly safer than before (it can only ever do LESS damage).
VERIFIED: rebuilt the exact commit-lock + strike predicates into `outputs/chargecheck.js`; `node --check` SYNTAX OK and ALL 8
asserts PASS — (1) stand-still → CONNECT+hp drop+knock, (2) 120px x-sidestep → MISS/no hp loss, (3) 60px DEPTH sidestep → MISS,
(4) WARD in-lane → IFRAME/no hp/no knock, (5) roll in-lane → IFRAME, (6) 30px step still CONNECTS (window not too tight),
(7) commit-lock: aim FROZEN at commit X even when P bolts 200px after (no rubber-band) → MISS, (8) 200 consecutive connects from
hp=5 floor at hp=1, never KO. Edited region re-read BALANCED via the Read tool (if(_inLane) opens L1742, chip-if L1753–1769,
`}else{` L1770, whiff L1770–1778, strike-if closes L1779). Build stays loadable; live `game/` untouched; game3d NOT published.
PARITY-COMPARE subagent SKIPPED again (FUSE serves truncated bash reads → a diffing subagent gets a half-file); checklist note
in-process: HIT FEEDBACK / CROWD FOES (master-checklist #3) → the back-row charge is now TELEGRAPHED **and DODGEABLE BY MOVEMENT**
(commit-lock + sidestep whiff), closing the "charge sticks to you / unavoidable except by i-frame" gap vs DC's readable lunges.
NEXT STEP (single): when a paid run with Hiro present is allowed, run gen-sprites for the dedicated gladiator side-on sprites
(door/hook/chain/pyre/gunner/grave/stitch/brute/master/hound/necro/champ/beast) — still the biggest LOOK gap. If a no-paid run:
draw a faint ground "lunge LANE" decal under the charger during its 0.22–0.50 wind so the player can SEE where to step off
(reinforce the new dodge with a visual read), reusing the `_aimX/_aimY` already computed at strike — study the depth y-sort so
the decal sits under feet, not over sprites.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach any multi-foe wave (TWIN HOOKS at fight 2, or any fight
past #3). When a back-row foe breaks rank and lunges (yellow telegraph), it now COMMITS to where you were ~0.5s ago instead of
homing onto you — just STEP aside (left/right or up/down into depth) and the swing whiffs with a grey "MISS" puff, no chip. Stand
still and it still bites (red number + knock), and WARD/roll still negate it as before.

## STATUS: 2026-06-28 02:2x UTC  — ★★★ DC HIT-FEEDBACK — THE CHARGER'S LANDED CHIP NOW READS AS CONTACT: WARLOCK KNOCK + WHITE POP + FIRMER KICK (i-frame-safe) ★★★
ART INTAKE (priority-0): `art_in/` re-checked. The Jun-28 source PNGs (warlock_summon/fireball/fireball_hit/bg_pit_far,
00:56–00:57) are ALL already keyed into `assets/sprites/` + `assets/bg/` (01:00–01:05) AND archived in `art_in/raw/` — and
all three are already WIRED & rendering (warlock_summon = SUMMON-channel pose L2059; fireball = projectile sprite L2270;
fireball_hit = impact bloom L1995; bg_pit_far = far parallax plate). Nothing new → nothing to ingest. The stragglers were
LEFT in `art_in/` on purpose: the 02:0x mtime-vs-`assets` check already skips them cleanly, and deleting on the OneDrive/FUSE
mount is a documented hazard — not worth the risk in a 15-min run. gen-sprites skipped (PAID xAI → forbidden in a scheduled run).
CONTEXT: this is the 02:0x NEXT STEP's no-paid branch — "add a brief HURT/recoil tell on the charger's landed-swing connect
(white-flash + knock on the warlock) so the new chip READS as contact." The chip itself already landed last run; it just
looked weak because nothing on the WARLOCK moved when it connected. Done.
CHANGED — `arena.html`, ONE block grown inside the charger STRIKE gate in `syncFoeCrowd` (`if(hot && !this._chargeStruck)`,
L1737–1753, verified BALANCED via the Read tool on fresh disk — bash/FUSE still serves a truncated/variable tail so a
node-check over the mount is unusable). The old single-line `hurtWarlock(chip)` became a CONNECT-GATED tell:
  `const _hp0=P.hp; hurtWarlock(chip);` then `if(P.hp < _hp0){ … }`.
  • `P.hp < _hp0` is exactly "the chip LANDED" — hurtWarlock leaves HP unchanged when WARD/roll/blink-fade negate the hit, so
    an i-frame'd swing produces NO knock/flash (the tell can never fire on a dodged hit).
  • KNOCK: `P.x += kdir*18; this.clampArena(P)` — a small recoil shove AWAY from the charger's lunge side (it lunges from the
    right → warlock knocked left), re-pinned inside the pit ring by clampArena (same shove+clamp pattern as the L920 hurl, so
    it can't desync or walk him off-arena).
  • POP: `P.flash=max(P.flash,0.20)` (a touch longer than the base chip's 0.14 → the existing warlock_hurt pose-swap at L2059
    holds a beat longer) + a one-shot white ADD `glow` flare at the warlock + `S.shake=max(.,8)` (firmer than the 4 windup kick).
RENDER-FEEDBACK over the already-applied sim chip — it writes NO new damage; the only sim touch is the bounded+clamped recoil
on P.x (identical safety to the existing hurl). Same i-frame discipline as the chip itself.
VERIFIED: extracted hurtWarlock + the connect-gate into `outputs/knockcheck.js`; `node --check` SYNTAX OK and ALL 6 asserts
PASS — (1) clean connect → knocked left 18px + hp drops + flash bumped, (2) WARD → no knock/no hp loss/x unchanged, (3) roll
i-frame → no knock, (4) fade i-frame → no knock, (5) knock near the wall re-clamps inside the ring, (6) 50 consecutive
connects floor hp at 1, never KO. Edited region re-read BALANCED via the Read tool (the new `if(P.hp<_hp0){…}` opens L1745
closes L1752; the chip `if` closes L1753; the strike block closes L1754; loop continues L1755 intact). Build stays loadable;
live `game/` untouched; game3d NOT published.
PARITY-COMPARE subagent SKIPPED again (FUSE serves truncated bash reads → a diffing subagent gets a half-file); checklist
note in-process: HIT FEEDBACK (master-checklist priority #3) → the crowd charger's landed chip now carries knock + white pop +
firmer kick, so it reads as a real connect instead of a silent HP tick.
NEXT STEP (single): when a paid run with Hiro present is allowed, run gen-sprites for the dedicated gladiator side-on sprites
(door/hook/chain/pyre/gunner/grave/stitch/brute/master/hound/necro/champ/beast) — still the biggest LOOK gap. If a no-paid
run: give the charge a fixed strike X at lunge-commit so a SIDESTEP (not only an i-frame) can also avoid it — but FIRST study
the lane/clamp math (dx easing + clampArena) so the charger can't stick to the player or jitter; keep it telegraphed.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach any multi-foe wave (TWIN HOOKS at fight 2, or any fight
past #3); when a back-row foe breaks rank and lands its yellow charge swing, the warlock now visibly RECOILS — a quick knock
away from the foe, a white flash + hurt pose, and a firmer screen kick alongside the red damage number. WARD or roll/blink
during the ~0.5s wind-up and the swing whiffs: no chip, and no recoil (the tell only fires on a real connect).

## STATUS: 2026-06-28 02:0x UTC  — ★★★ DC CROWD GETS TEETH — THE ROTATING CHARGER'S LANDED SWING NOW DEALS A SMALL REAL CHIP (i-frame-safe, can't softlock) ★★★
ART INTAKE (priority-0): `art_in/` re-checked vs `assets/sprites/` by mtime over every non-`_` PNG — the only Jun-28
files (warlock_summon/fireball/fireball_hit/bg_pit_far, 00:56–00:57) are OLDER than their keyed `assets/sprites/`
counterparts (01:00–01:05), i.e. ALREADY ingested + wired. `art_in/raw/` is the keyed archive. Nothing new → nothing
to ingest. gen-sprites skipped (PAID xAI → forbidden in a scheduled run).
CONTEXT: prior NEXT STEP (no-paid branch) was to give the rotating back-row charger's landed swing a small REAL chip to
player HP — but FIRST study the player hurt path so it honors invulnerability and can't softlock. Did exactly that.
HURT-PATH STUDY (arena.html L199–210): `hurtWarlock(dmg)` is the one safe sink — it early-returns on `P.wardT>0`
(WARD popup), on `P.rollT>0 || P.fadeT>0` (roll/blink-fade DODGE popup), and FLOORS `P.hp` at 1 (no KO/respawn flow
yet, so it can't dead-end). So routing the charge damage through it inherits every i-frame gate + the softlock floor
for free — no new invulnerability logic needed.
CHANGED — `arena.html`, ONE insertion inside the charger STRIKE block in `syncFoeCrowd` (`if(hot && !this._chargeStruck)`,
~L1725–1739, verified via the Read tool — bash/FUSE still serves a truncated/variable tail so node-check over the mount
is unusable; the file is WHOLE on fresh disk). After the existing spark + tiny shake, added:
  `if(typeof hurtWarlock==='function' && P && !P.dead) hurtWarlock(Math.max(2, Math.round(foeDmg(e)*0.5)));`
— a chip of HALF a normal foe bite (~3–6), telegraphed by the existing ~0.5s windup→lunge arc above it, and fully
negated by WARD / roll / blink during that wind. This is the FIRST crowd layer to write to the sim, and it does so only
through the already-i-frame-guarded, HP-floored sink, so the render-only discipline's safety guarantees still hold.
VERIFIED: extracted `hurtWarlock` + the chip gate into `outputs/chipcheck.js`; `node --check` SYNTAX OK; asserts PASS —
(1) wardT>0 → no HP loss, (2) rollT>0 → no HP loss, (3) fadeT>0 → no HP loss, (4) no i-frame → chip observed 3–5 over
5000 rolls (in band), (5) NO SOFTLOCK: 10000 consecutive chips from hp=5 floor at hp=1, never dead. Edited region
re-read BALANCED via the Read tool (block opens L1725, closes L1739). Build stays loadable; live `game/` untouched;
game3d NOT published.
PARITY-COMPARE subagent SKIPPED again (mount serves truncated bash reads → a diffing subagent gets a half-file);
checklist note in-process: CROWD FOES ACTING → the rotating charge now lands a small REAL i-frame-safe chip (the
"teeth" item from the prior NEXT STEP is DONE).
NEXT STEP (single): when a paid run with Hiro present is allowed, run gen-sprites for the dedicated gladiator side-on
sprites (door/hook/chain/pyre/gunner/grave/stitch/brute/master/hound/necro/champ/beast) — still the biggest LOOK gap.
If a no-paid run: add a brief HURT/recoil tell on the charger's landed-swing connect (small white-flash + knock on the
warlock sprite) so the new chip READS as contact, then consider giving the charge a fixed strike X at lunge-commit so a
sidestep (not just an i-frame) can also avoid it — but study the lane/clamp math first to avoid the charger sticking.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach any multi-foe wave (TWIN HOOKS at fight 2, or any
fight past #3); when a back-row foe breaks rank and lands its yellow charge swing, you now take a small chip of damage
(red number + flash) — UNLESS you WARD or roll/blink during its ~0.5s wind-up, which cleanly negates it. HP can't drop
below 1, so it pressures without ever KO'ing.

## STATUS: 2026-06-28 01:3x UTC  — ★★★ ART WIRING — THE WARLOCK'S HEX (purple) PRIMARY BOLT NOW DRAWS AS THE PAINTERLY FIREBALL SPRITE (purple-tinted) + PURPLE IMPACT BLOOM — the last flat-circle holdout on the PLAYER'S OWN main projectile is gone ★★★
ART INTAKE (priority-0): `art_in/` re-checked vs `assets/sprites/` (mtime compare over every non-`_` PNG) — ALL ingested,
nothing newer. The 00:56–00:57 drops (warlock_summon/fireball/fireball_hit/bg_pit_far) remain the latest, already wired
(prior runs). gen-sprites NOT run (paid xAI, forbidden in a scheduled run).
CONTEXT: the 01:2x run finally made the FIRE-bolt painted sprite actually load + render; its NEXT STEP named the HEX
(purple) primary bolt as the last fillCircle holdout for the warlock's OWN main projectile. Took it — the now-loaded
`fireball` texture is reused, tinted purple, so no new art / no paid gen needed.
CHANGED — `arena.html`, 3 small edits (ALL re-read on FRESH disk via the Read tool; bash mount still serves the documented
truncated tail so `wc`/`node --check`/diff-subagent over the FUSE mount stay unusable — verified line-by-line instead):
(1) Projectile renderer (now L2261): the sprite branch guard widened from `b.kind==='fire'` to
    `(b.kind==='fire'||b.kind==='hex')` so HEX bolts render as the velocity-oriented `fireball` IMAGE too. Tint pick is a
    ternary: `b.col` wins (dragon/coven fire keep their colour), else HEX → `0xb070f0` (the canonical warlock purple used by
    spawnBurst/showBanner), else null→clearTint (plain fire stays native orange). The flat `fillCircle` path is UNTOUCHED as
    the fallback when `textures.exists('fireball')` is false, so a missing/failed texture still degrades gracefully.
(2) `fireBurst(x,y,tint,flashCol)` (L1989): two OPTIONAL trailing params added — `tint` (applied to the `fireball_hit`
    bloom sprite) and `flashCol` (the screen-flash colour). Both default to the prior orange behaviour, so the existing
    FIRE call `fireBurst(b.x,b.y)` is byte-for-byte unchanged.
(3) Impact (L495): added `if(hit && b.kind==='hex' && scene) scene.fireBurst(b.x,b.y,0xb070f0,0xb070f0);` right after the
    FIRE-impact line — a purple painterly bloom + purple flash where a HEX lands (parity with the FIRE bolt's bloom feel).
VERIFIED: isolated `node hextint.js` harness on the EXACT new tint/eligibility logic PASSED all 5 asserts — hex+haveFire→
purple sprite (0xb070f0); hex+no-texture→purple fillCircle fallback (0xd0a0ff); plain fire→sprite, no tint; coloured dragon
fire→keeps its col; arrow→never sprite-renders. All 3 edited regions re-read on fresh disk; file TAIL WHOLE (`</script>`
L2379, `</body>` L2380, `</html>` L2381 — 2382 lines real, +3 vs the prior 2379 as expected). Build stays loadable; live
`game/` untouched; game3d NOT published.
PARITY/BENCHMARK: inline (mount truncation → a diffing subagent reads a half-file, as every prior run). KIT PARITY UNCHANGED
— the hex mechanics (10s rot @15 dmg, herald STACK, 420 speed, r:5, faces nearest foe) are byte-identical; this is a pure
RENDER swap. LOOK vs DRAGON'S CROWN: the warlock's most-fired projectile flips from a flat 2-circle dot to a glowing painted
purple bolt that spins to face its flight and POPS a purple bloom on contact — the player's own attacks now read as painterly
as the enemy dragon/coven fire. Biggest remaining LOOK gaps unchanged: the gladiator stand-ins
(door/hook/chain/pyre/gunner/grave/stitch/brute/master/hound/necro/champ/beast) still need dedicated DC art (PAID gen-sprites,
Hiro-present only); FOE shots (`foeShots`, e.g. the gunner bolt + pyre ember) are still flat circles — the next obvious
fillCircle holdout now that the player's are painted.
NEXT STEP (single): wire the ENEMY projectiles (`foeShots` — gunner bolt, pyre ember) to the same painterly `fireball`
sprite (tinted per-shot via the existing `col`, e.g. gunner gold `#ffd24a`, ember orange) in the foeShots renderer — the last
flat-circle projectile class left on screen, and a cheap reuse of the already-loaded texture (no paid art).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http and cast HEX (the warlock's primary bolt): it now flies as a
glowing purple painted fireball that rotates to face its travel and bursts into a purple bloom on the foe it hexes — the
player's signature attack finally looks as painterly on screen as the enemy fire does.

## STATUS: 2026-06-28 01:2x UTC  — ★★★★ ART WIRING FIX — THE FIRE-BOLT SPRITE PRELOAD WAS MISSING: it's now loaded, so the painterly fireball + impact bloom ACTUALLY RENDER (prior run shipped the draw code but no load.image → feature was inert) ★★★★
ART INTAKE (priority-0): `art_in/` re-checked — `find art_in -maxdepth 1 -name '*.png' -newermt "2026-06-28 01:15"` = EMPTY.
The 4 drops dated 00:56–00:57 (`warlock_summon`/`fireball`/`fireball_hit`/`bg_pit_far`) were ingested by the 01:0x run
(dest 512-capped + `_n` maps present in `assets/sprites/`; `bg_pit_far` keyed into `assets/bg/`). NOTHING new to ingest.
ROOT CAUSE (this run's find): the 01:1x run wrote the full FIRE-bolt RENDER path — `fireBurst()` (L1988), the impact call
in `updFireballs` (`if(hit && b.kind==='fire') scene.fireBurst()` L500), and the velocity-oriented `fireball` IMAGE in the
projectile renderer (L2256) — ALL guarded by `textures.exists('fireball'/'fireball_hit')`. But it NEVER added the matching
`this.load.image(...)` calls to `preload()`. So both guards evaluated FALSE every frame → the code silently fell back to the
flat `pg.fillCircle`, and `fireBurst` no-op'd. Its STATUS claimed the bolts "now draw as the painterly sprite"; in fact the
painted art was loaded into `assets/` but NEVER into the Phaser texture cache. (`firecheck.js node --check` only validated an
ISOLATED snippet's SYNTAX — it could not catch a never-loaded texture.) The 5-Whys: feature looked done because the syntax
passed, but no run ever asserted `textures.exists('fireball')===true` against the real loaded build.
CHANGED — `arena.html`, ONE edit in `preload()` (verified intact via the Read tool on fresh disk; bash mount still serves a
truncated tail so never trusted for grep/node-check):
(1) After the `shadow`/`glow` loads (now L1376–1377): added
    `this.load.image('fireball',     [SPR+'fireball.png',     SPR+'fireball_n.png']);`
    `this.load.image('fireball_hit', [SPR+'fireball_hit.png', SPR+'fireball_hit_n.png']);`
    Array form binds each diffuse to its auto-Sobel `_n` normal so Light2D shades them; both `_n` assets confirmed present.
    Keys match EXACTLY what the render/impact code already references → the existing guards now pass and the painted bolt +
    bloom go live. No other code change needed; the draw path was already complete and correct.
VERIFIED via the Read tool on fresh disk: the 2 new load lines sit cleanly inside `preload()` (which still closes at the
`create()` boundary L1384); all 4 referenced PNGs + `_n` maps exist in `assets/sprites/`; file TAIL WHOLE (`new Phaser.Game`
present, `</script>` L2376, `</body>` L2377, `</html>` L2378 — 2379 lines real). Build stays loadable (a failed image decode
still trips the same `textures.exists` fallback to fillCircle); live `game/` untouched; game3d NOT published.
PARITY/BENCHMARK: inline (mount truncation → a diffing subagent would get a half-file, as every prior run). LOOK vs DRAGON'S
CROWN: this flips fire bolts from "code says painted, screen shows flat dot" to ACTUALLY painted — dragon/coven/sheol fire now
streaks nose-first as a glowing painterly bolt and BLOOMS on contact. Estimated to genuinely realise the LOOK gain the prior
run only claimed. Biggest remaining LOOK gaps unchanged: the HEX (purple) primary bolt is still a fillCircle; the gladiator
stand-ins (door/hook/chain/pyre/gunner/grave/stitch/brute/master/hound/necro/champ/beast) need dedicated art (PAID gen-sprites,
Hiro-present only).
NEXT STEP (single): wire the warlock's HEX (purple) primary bolt to a painterly sprite — quickest is to tint the now-loaded
`fireball` sprite purple for `b.kind==='hex'` in the projectile renderer (it's the last flat-circle holdout for the player's
own main projectile); a dedicated `hexbolt` gen is the better Hiro-present option later.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach any wave with a DRAGON or a COVEN/SUCCUBUS caster — their
fire bolts now genuinely fly as glowing painted fireballs that spin to face their flight and POP a bright bloom where they land
(this is the first run where that art actually appears on screen, not just in the code).

## STATUS: 2026-06-28 01:1x UTC  — ★★★ ART WIRING — FIRE BOLTS NOW DRAW AS THE PAINTERLY FIREBALL SPRITE + BLOOM-BURST ON IMPACT (flat fillCircle retired for fire-kind) ★★★
ART INTAKE (priority-0): `art_in/` re-checked — the 4 PNGs dated 00:56–00:57 (`warlock_summon`, `fireball`,
`fireball_hit`, `bg_pit_far`) were ALREADY ingested by the prior 01:0x run; assets up to date, `_src` archives present.
Re-ran `ingest_art.py fireball fireball_hit warlock_summon` (idempotent) → confirmed dest 512-capped + `_n` maps fresh
(verified via PIL: fireball 512×323, fireball_hit 512×490, warlock_summon 377×512). NOTHING new to ingest. NOTE: the
mount BLOCKED `rm` this run ("Operation not permitted" — OneDrive lock), so the 4 processed sources still sit in
`art_in/` + a stray `assets/sprites/bg_pit_far.png` copy I couldn't delete (HARMLESS — nothing loads bg from the SPR
path; the loader reads `bg_far` from `assets/bg/`). Next run: these hash-match what's ingested → skip; retry the deletes.
CONTEXT: prior run's single NEXT STEP was the open art-wiring gap — fire projectiles still drew as a flat `pg.fillCircle`
while the painterly `fireball`/`fireball_hit` sprites sat ingested-but-unwired. Did exactly that (code-only, assets ready).
CHANGED — `arena.html` (3 edits, all verified intact via the Read tool + isolated `node --check` SYNTAX_OK; tail WHOLE on
disk — `</script>` L2370, `</body>` L2371, `</html>` L2372):
(1) NEW scene method `fireBurst(x,y)` (L1982, right after `fxSummon`): one-shot `fireball_hit` sprite, ADD blend, tween
    scale 0.10→0.42 + alpha→0 over 300ms then destroy; + a warm `flash(0xff8a3d,.10)` + `S.shake≥5`. Texture-guarded.
(2) `updFireballs` (L495, at the splice): `if(hit && b.kind==='fire' && scene) scene.fireBurst(b.x,b.y);` — a painterly
    bloom blooms at the impact point of every FIRE bolt (dragon/coven/sheol blasts), just before despawn. Hex/arrow untouched.
(3) Projectile renderer (L2249): FIRE-kind bolts now draw as the `fireball` IMAGE oriented to velocity (`rotation=
    atan2(vy,vx)`, uniform scale `b.r*2.8/spr.height`, per-bolt `col` tint e.g. green coven), pooled in a new
    `this.fireSprites` Map with a reaper mirroring `demonSprites`. HEX (purple) + ARROW bolts KEEP the fillCircle.
    Both new paths are guarded by `textures.exists('fireball')` so a missing asset falls back to the circle — can't break load.
VERIFIED: 3 edit regions re-read BALANCED via the Read tool; the render `for`/`else`/reaper braces close at L2265/2267;
file tail whole (`</html>` L2372); isolated harness (`outputs/firecheck.js`) `node --check` = SYNTAX_OK. `node --check`
over the mount stays unusable (FUSE truncated tail). Build loadable; live `game/` untouched; game3d NOT published.
PARITY/BENCHMARK: inline (mount truncation → a diffing subagent gets a half-file, as every prior run). LOOK vs DRAGON'S
CROWN: dragon/coven fire now reads as a glowing PAINTED bolt that streaks nose-first and BLOOMS on contact instead of a
flat dot popping — a real readability + Vanillaware-fidelity gain. Biggest remaining LOOK gaps: dedicated gladiator art
for the stand-ins (door/hook/chain/pyre/gunner/grave/stitch/brute/master/hound/necro/champ/beast — needs a PAID
gen-sprites run, Hiro-present only); a hex-bolt sprite to match (the warlock's primary purple bolt is still a fillCircle).
NEXT STEP (single): wire the HEX (purple) primary bolt to a painterly sprite too — either tint the `fireball` sprite
purple for `kind==='hex'`, or (better) gen a dedicated `hexbolt` sprite next Hiro-present run; until then the warlock's
own main projectile is the last flat-circle holdout now that fire bolts are painted.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach a wave with a DRAGON or COVEN/SUCCUBUS caster (any
fight with summoned dragons, or the herald/coven fights) — their fire bolts now fly as glowing painted fireballs that
spin to face their flight and POP a bright bloom-burst where they land, instead of the old flat orange dots.

## STATUS: 2026-06-28 01:0x UTC  — ★★★ ART INTAKE — NEW HIRO DROP INGESTED: warlock SUMMON pose (wired live) + fireball/fireball-hit FX sprites + upgraded far-bg plate ★★★
ART INTAKE (priority-0): FOUND 4 NEW non-`_` PNGs in `art_in/` dated 00:56–00:57 (postdate the 00:1x necro run),
NONE present in `assets/sprites`/`assets/bg`: `warlock_summon.png`, `fireball.png`, `fireball_hit.png`, `bg_pit_far.png`.
Processed all four this run. (gen-sprites NOT run — paid xAI, forbidden in a scheduled run.)
HAZARD HIT + HANDLED: the mounted `tools/ingest_art.py` itself served TRUNCATED via bash (python ran a half-file → exit 0,
no output, no writes), and `art_in/fireball_hit.png` read with a ZEROED TAIL (full 1485667-byte count but PNG IEND missing →
PIL "image file is truncated"). FIX: ran an inline self-contained ingest (not the mounted script); for fireball_hit,
forced OneDrive hydration via the Read tool, waited, then re-read clean (nonzero tail == full length) — ingested at full res.
CHANGED:
(1) INGESTED 3 sprites → `assets/sprites/` (+`_n` normal maps, +`_src/` archives), all reopened & `.load()`-verified clean:
    `warlock_summon` (377×512), `fireball` (512×323), `fireball_hit` (512×490). Added their target-height rows to
    `tools/ingest_art.py` (warlock_summon 1.0; fireball/fireball_hit FX, doc-only).
(2) SWAPPED `assets/bg/bg_pit_far.png` with the upgraded 1280×720 plate (already wired at arena.html L1373 `bg_far`) —
    zero-code visual upgrade; written copy reopened at full 1280×720.
(3) WIRED the warlock SUMMON pose into `arena.html`, 2 edits (both verified intact via Grep/Read; file TAIL WHOLE on disk —
    `new Phaser.Game(` L2298, `</script>` L2344, `</body>` L2345, `</html>` L2346, 2346 lines real):
    • preload `this.load.image('warlock_summon', [..summon.png, ..summon_n.png])` at L1346 (beside the other warlock poses).
    • render-loop pose selection L2035: base-warlock `ft` now = flash→hurt ▸ `P.channel`→`warlock_summon` ▸ moving→walk ▸ idle.
      Guarded by the existing `textures.exists(ft)` check, so a missing tex can't break the build. Priority verified in an
      isolated node harness (channel→warlock_summon, moving→walk, idle→warlock): SYNTAX_OK + all 3 branches correct.
    fireball/fireball_hit are INGESTED + ready but NOT yet wired (projectiles still draw as `pg.fillCircle` at L2239) — that
    sprite swap is the next art-wiring step, deliberately deferred to keep this increment small + loadable.
VERIFIED: 6 sprite files `.load()` clean; bg reopens full-res; both arena.html edits present via Grep (L1346, L2035);
tail whole via Read; pose ternary node-checked. Build stays loadable; live `game/` untouched; game3d NOT published.
PARITY-COMPARE: inline (bash mount serves truncated reads → a diffing subagent gets a half-file, as every prior run).
LOOK note vs DRAGON'S CROWN: the summoner now visibly CHANGES POSE mid-channel (Vanillaware-style distinct cast stance)
instead of standing in idle while the horde rises — a real readability gain. Bigger remaining LOOK gaps: fireball SPRITES
(painterly bolt + bloom-explosion) replacing the flat fillCircle projectiles; dedicated gladiator art for the stand-ins.
NEXT STEP (single): wire `fireball`/`fireball_hit` SPRITES into the projectile renderer (replace the `pg.fillCircle` at
L2239 for fire-kind shots with the `fireball` image oriented to velocity, and spawn a one-shot `fireball_hit` burst on
impact in `updFireballs`) — the highest-value remaining art-wiring now that the assets are ingested.

## STATUS: 2026-06-28 02:32 UTC  — ★★ PER-TYPE FOE AI — THE HOUND LUNGE-POUNCE LANDED — PER-TYPE AI PARITY CLOSED (every mob+boss now has its signature verb) ★★
ART INTAKE (priority-0): the four `art_in/` PNGs newer than the 22:10 ingest (`bg_pit_far` 00:57, `fireball`/`fireball_hit`/`warlock_summon` 00:56) are ALL already ingested — their `assets/sprites/`+`assets/bg/` outputs carry NEWER mtimes (01:00–01:05). Nothing new to process. Skipped. (gen-sprites NOT run — paid xAI, forbidden in a scheduled run.)
CONTEXT: the 00:1x NEXT STEP named the CHAMP/BEAST boss phases — but on reading the REAL file (via the Read tool; bash serves the documented truncated ~1088-line stale tail) BOTH bosses are ALREADY fully built: `champ` (L716) throws THRALLS + FEEDS on them for +stats, `beast` (L753) has the two-PHASE enrage (<50% HP → ×1.5 spd "SHEDS ITS CHAINS") + ring-SLAM + phase-2 CHARGE. So that step was already done in an earlier (logged-as-necro) pass. The one genuinely-remaining mob signature verb was THE HOUND lunge (pit.js:1668) — the last foe still on the generic brain. Took it.
CHANGED — `game3d/arena.html`, 1 edit (verified via the Read tool — file WHOLE: `</script>` L2538 `</body>` L2539 `</html>` L2540, 2540 real lines = prior ~2519 + the 21-line branch; bash still serves the truncated stale tail so `wc`/`node --check`/diff over the mount stay unusable — used an extracted isolated harness instead):
(1) NEW `hound` per-type branch in `updFoeAI` (right after the `necro` block, before the `champ` block, `continue`s past the generic brain like every other per-type verb). Faithful to pit.js:1668: CHASES tight (advance while `dToP>reach+18`); on a 0.42s crouch wind-up (`!` popup + `_tele` sprite light) it POUNCES — `lungeT=.28`, `lungeA=ang(e,P)`, dashes **340 spd** down the locked lane and BITES **once** on contact (`!e.bit` gate, `rnd(4,7)×dmgScale`, small shake), then `cool=rnd(1.2,2)`. The "read the crouch, sidestep the leap" verb; stacked with the master's RELEASE it makes the pack rake you with overlapping lunges (DC swarm pressure, not stand-and-trade). No new damage/render code — routes through the existing `hurtWarlock` (roll/ward i-frames already negate it).
VERIFIED: extracted the EXACT branch into an isolated `node` harness (`outputs/hound_harness.js`) with stubs → `node` exec = SYNTAX OK + a ~6s behavioral smoke PASSED 6/6 asserts: chases into range & begins an attack, executes ≥1 lunge, bites once, bite dmg = 13 (4-7×2 scale) ∈ [8,14], `!` telegraph popup fired, shake≥3 on the bite. Build stays loadable; live `game/` untouched; game3d NOT published.
PARITY-COMPARE: inline (a bash-driven diff subagent reads the truncated mount → garbage, as every prior run).
★ PER-TYPE FOE AI PARITY NOW CLOSED — every mob & boss has its signature verb: grave riposte · door guard-break · pyre 3-spell zone-cast+shield · master pack-release+whip · gunner aim-line lock · necro raise · HOUND lunge · champ thrall-feed+grow · beast two-phase enrage+ring-slam+charge.
NEXT STEP (single, priority-2, no longer per-type AI): promote the render-only crowd CHARGERS (the cosmetic 2-slot pressers in `syncFoeCrowd`) toward REAL sim foes that are HITTABLE mid-charge — the true brawler step so a wave is N authoritative foes the warlock can actually kill, not 1 sim foe + N cosmetic pressers. (This is the biggest remaining DC-feel gap now that every per-type verb exists.)
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach any HOUND fight (e.g. fight ~18/19 "THE HOUND PACK" / "THE KENNEL & THE NEEDLE", or any wave the master feeds). Each hound now CROUCHES (`!`) then LEAPS across the plane at you and snaps a bite — sidestep up/down the depth band in that last beat to make it whiff, then punish. With the master refilling the pack you get a constant weave of telegraphed pounces.

## STATUS: 2026-06-28 00:1x UTC  — ★★ PER-TYPE FOE AI — THE NECRO RAISE LANDED (kiting raiser spawns skeleton pairs — a 2nd self-replenishing swarm) ★★
ART INTAKE (priority-0): `find art_in -name '*.png' -newermt "2026-06-27 22:10" -not -path '*/raw/*'` = EMPTY → nothing
new since the 22:08 ingest; full 31-file `assets/sprites/` roster (incl. `skel.png`+`skel_n.png` the raise renders with)
already keyed. Skipped. (gen-sprites NOT run — paid xAI, forbidden in a scheduled run.)
CONTEXT: executed the single NEXT STEP from 00:0x — THE NECRO's signature verb (pit.js:1702), the next per-type AI
after the gunner lock. The necro had been running generic melee chase; ported its distinctive kite + raise loop so its
waves (fights ~5 "LEAD & BONE", + any necro-stacked wave) become a SECOND self-replenishing swarm alongside the
master's hounds.
CHANGED — `game3d/arena.html`, 1 edit (verified via the Read tool — tail WHOLE: `</script>` L2276 `</body>` L2277
`</html>` L2278, 2279 lines real = prior 2255 + the 24-line branch; bash still serves the truncated ~1075-line stale
tail so `wc`/`node --check` over the mount stay unusable — used an extracted isolated harness instead):
(1) NEW `necro` per-type branch in `updFoeAI` (right after the gunner block, before the generic `if(e.attacking)`,
    `continue`s past it like grave/door/pyre/master/gunner). Faithful to pit.js:1702: KITES away while `dToP<240`
    (`e.x-=cos(a)*spd*dt`), and on a `raiseT` cool (1.2s first, then 1.9s) RAISES a fresh PAIR of `skel` minions at a
    random 60px offset (capped at 8 `skel` alive) — `hp=48×dmgScale`, `spd:125`, `RISE` popup, ground-clamped via
    `SIDEON_GROUND_FR`, `spriteKey=foeTexFor('skel')` so each renders through the crowd pool + fights via the existing
    generic `skel` melee AI. Pure spawn-loop branch mirroring the master's RELEASE; no new damage/render code.
VERIFIED: extracted the exact branch into an isolated `node` harness with stubs → `node --check` SYNTAX OK, and a
behavioral smoke over ~6s PASSED all asserts: skels spawn in PAIRS, each `hp=96` (48×2 scale), count CAPPED ≤8, every
risen skel clamped on/above ground, RISE popup per spawn. Build stays loadable; live `game/` untouched; game3d NOT
published.
PARITY-COMPARE: inline (a bash-driven diff subagent reads the truncated mount → garbage, as every prior run).
Per-type foe AI now PRESENT for: grave riposte · door guard-break · pyre zone-cast · master pack-release · gunner
aim-line lock · NECRO raise. Remaining signature verbs: HOUND-pack flank, CHAMP/BEAST boss phases (pit.js:1735-1805).
NEXT STEP (single, priority-2/3): the CHAMP/BEAST boss phases (pit.js:1735) — the gauntlet's two bosses still run
generic heavy-melee; give one a telegraphed multi-hit boss combo or an enrage threshold so the ladder's capstone
fights read as bosses, not just bigger mobs. (HOUND-pack flank is lighter; the boss verb is the bigger DC-feel gap now
that both raisers exist.)
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach a fight with THE NECRO (e.g. fight ~5 "LEAD & BONE"
which pairs it with the gunner, or any necro-stacked wave). It HANGS BACK and kites you, and every couple beats a pair
of skeletons claws up out of the dirt (`RISE`) and rushes in — cull them faster than it raises them or the pit fills.
Stacks with the gunner's lane-lock in that fight: dodge the red line while wading through risen bone.

## STATUS: 2026-06-28 00:0x UTC  — ★★ PER-TYPE FOE AI — THE GUNNER AIM-LINE LOCK LANDED (tracking beam that snaps RED + fires a fast bolt — "sidestep the lock") ★★
ART INTAKE (priority-0): `find art_in -name '*.png' -newermt "2026-06-27 15:35"` = the new `raw/` gladiator drops
(door/hook/chain/pyre/gunner/grave/stitch/brute/master/hound/necro/champ/beast/skel) + bg plates — but ALL are
ALREADY INGESTED: `assets/sprites/<type>.png`+`_n.png` (mtime 22:08) are NEWER than the raw sources (21:5x), and
`assets/bg/bg_pit_{far,floor,fg}.png` are in place + wired (arena.html L1236-1257). Nothing new to process. (Also
confirmed the foe spriteKey wiring is DONE: spawnFight→`foeTexFor(type)` gives each gladiator its real on-model
sprite, and the crowd pool L1561 renders every waiting foe with it — the old shambler/bonearcher stand-in note in
prior STATUS is stale.) gen-sprites NOT run (paid xAI, forbidden in a scheduled run).
CONTEXT: executed the single NEXT STEP from 23:48 — THE GUNNER's signature verb (pit.js:1687). The gunner had been
running the GENERIC ranged AIM→shoot (re-aims at release, 380-spd shot); ported its distinctive track-then-LOCK.
CHANGED — `game3d/arena.html`, 2 edits (both applied against current file state; tail VERIFIED WHOLE via the Read
tool — `</script>` L2252 `</body>` L2253 `</html>` L2254, 2255 lines real; bash still serves the truncated ~1075-line
stale tail so `wc`/`node --check` over the mount remain unusable — used an extracted isolated harness instead):
(1) NEW `gunner` per-type branch in `updFoeAI` (right after the master block, before the generic `if(e.attacking)`,
    `continue`s past it like grave/door/pyre/master). Faithful to pit.js:1687: holds a lane standoff (back off if
    `dToP<190`, close if `>300`); on cooldown raises an aim (`aiming=true; aimT=.8; aimA=a`, `AIM` popup); while
    aiming, TRACKS the warlock (`aimT>.28 → aimA=ang(e,P)`) then LOCKS for the last `.28s`; at `aimT<=0` fires a FAST
    `foeShots` bolt straight down `aimA` (`vx/vy = 470`, `dmg = rnd(13,17)×dmgScale`, `FIRE` popup, `cool=2.0`,
    `S.shake=4`). Sets `e._tele` so the existing telegraph tint lights the sprite (duel L1518 + crowd L1612) and
    `e.face` off the aim. Routes damage through the same `foeShots`→`hurtWarlock` path (roll/ward i-frames already
    negate it), so no new damage code.
(2) NEW gunner aim-line draw in the `zoneGfx` pass (after the whipcrack ring): for every aiming gunner, a thin
    pulsing YELLOW guide along `aimA` that turns a SOLID RED danger line + muzzle dot for the locked `.28s` — the
    "dodge the laser" read. Drawn on the floor (depth 1) so it works for the duel foe AND any crowd gunner in a
    multi-foe wave.
VERIFIED: extracted the exact branch + fire geometry into an isolated `node` harness with stubs → `node --check`
SYNTAX OK, and a behavioral smoke PASSED all asserts: shot speed = 470, dmg = 30 (15×2 scale), shake set, the aim
TRACKED the warlock pre-lock then the LOCK phase froze it, AIM+FIRE popups both fired. Build stays loadable; live
`game/` untouched; game3d NOT published.
PARITY-COMPARE: inline (a bash-driven diff subagent reads the truncated mount → garbage, as every prior run).
Per-type foe AI now PRESENT for: grave riposte · door guard-break · pyre zone-cast · master pack-release · GUNNER
aim-line lock. Remaining signature verbs: HOUND-pack flank, NECRO raise, CHAMP/BEAST boss phases (pit.js:1702-1805).
NEXT STEP (single, priority-2/3): THE NECRO raise (pit.js:1702) — on a ~1.9s cool it RAISES a pair of `skel` minions
(capped ~8 alive, `RISE` popup) while kiting at `dToP<240`, turning the necro waves into a second self-replenishing
swarm alongside the master's hounds. The `skel` sprite + generic skel melee AI already exist, so it's a spawn-loop
branch like the master's RELEASE.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach a fight with THE GUNNER (e.g. fight ~6 "THE
GUNNER", or any later wave that stacks one). A faint yellow line sweeps to track you, then SNAPS solid red and a fast
bolt rips down that lane — sidestep the red line in the last beat to make him whiff. Works mid-crowd too (the line
draws for any gunner in the wave, not just a 1v1).

## STATUS: 2026-06-27 23:48 UTC  — ★★ PER-TYPE FOE AI — THE HOUND MASTER PACK-RELEASE LANDED (spawns 2 hounds + a telegraphed WHIP — a self-replenishing swarm) ★★
ART INTAKE (priority-0): checked `art_in/` — only the already-ingested 05:2x originals + `_*` previews + `raw/`
archive; `assets/sprites/` holds the full 28-pair roster (incl. the `hound`/`master` stand-ins my spawns render
with). Nothing newer. Skipped. (gen-sprites NOT run — paid xAI, forbidden in a scheduled run.)
CONTEXT: the 23:42 STATUS shipped THE PYRE; its NEXT STEP named THE MASTER pack-RELEASE (pit.js:1678) as the next
signature verb — the one that turns a wave into a self-replenishing swarm (pure DC crowd pressure). Took it.
CHANGED — `game3d/arena.html`, 3 edits (all re-read on FRESH disk via the Read tool; bash again served the
documented TRUNCATED ~1076-line stale tail ending mid-`updZones` — `wc`/`node --check`/diff-subagent over the FUSE
mount stay unusable):
(1) NEW `master` per-type branch in `updFoeAI` (right after the pyre block, before the generic `if(e.attacking)`,
    `continue`s past it like grave/door/pyre). Faithful port of pit.js:1678 — holds a handler's standoff
    (`dToP>reach+170` → advance .8 spd), and on a 1.5s cool either RELEASES a fresh PAIR of hounds
    (`mkFoe({type:'hound',hp:66*dmgScale})` ×2, `spriteKey`/`name`/`dmgScale` set so they render via the crowd pool
    + fight via the generic hound AI; capped at 6 alive, 60% weighted; `RELEASE ×2` popup) or, within 200, cracks a
    TELEGRAPHED WHIP zone at the warlock's feet (`{type:'whipcrack',r:44,tele:.6,dmg:8*dmgScale}`, `WHIP` popup).
(2) `updZones`: NEW `whipcrack` branch (port of pit.js:2339) — tele-only, detonates ONCE for `dmg` if the warlock
    is still inside `r` when the crack lands, pushes a `ring:true` lash swing + shake/vib, then splices. Routed
    through `hurtWarlock` so roll/ward/fade i-frames already negate it.
(3) `zoneGfx`: NEW tan WHIP TELEGRAPH-ring draw — the fill closes in as the tele runs out (leave the circle!).
VERIFIED: isolated `node` behavior harness on the exact edited logic PASSED all asserts (hounds spawn → cap at 6;
hp = 66×1.5 = 99 scaled; whip fires once the pack is capped; whip lands 12 dmg + consumes + pushes the lash ring
when the warlock stands on it; MISSES for 0 when he's stepped off the circle). All 3 edited regions re-read
brace-balanced via the Read tool; file WHOLE on disk (`</script>` L2211, `</body>` L2212, `</html>` L2213 — 2213
lines real). Build stays loadable; live `game/` untouched; game3d NOT published.
PARITY-COMPARE: inline (a bash-driven diff subagent reads the truncated mount → garbage, as every prior run).
PER-TYPE FOE AI — MASTER pack-RELEASE + whip now PRESENT (joins grave riposte + door guard-break + pyre zone-cast).
Remaining signature verbs: GUNNER aim-line lock (sidestep-the-laser), HOUND-pack flank, NECRO raise, CHAMP/BEAST
boss phases (pit.js:1686-1805).
NEXT STEP (single, priority-2/3): THE GUNNER aim-line lock (pit.js:1686) — a tracking aim-line that LOCKS for the
last ~0.28s before firing a fast bolt down the lane (the "sidestep the laser" read). The current gunner just runs
the generic ranged AIM→shoot; the lock is its distinctive verb and the one that rewards the shallow-plane dodge.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach a fight with THE HOUND MASTER (fight 18/19, "THE
HOUND PACK" / "THE KENNEL & THE NEEDLE"). He hangs back and, on a beat, WHISTLES — two fresh hounds flank in
(`RELEASE ×2`, the pack refills as you cull it, capped at 6) — or cracks a tan WHIP ring under your feet (`WHIP`):
step off the closing circle before it lands or eat the lash. Kill hounds faster than he releases them or you'll
drown in the swarm.

## STATUS: 2026-06-27 23:42 UTC  — ★★ PER-TYPE FOE AI — THE PYRE 3-SPELL ZONE CHANNEL + MAGE-SHIELD LANDED (telegraphed ground AoE you must vacate) ★★
ART INTAKE (priority-0): checked `art_in/` — only the already-ingested 05:2x originals + `_*` previews + `raw/`
archive; `assets/sprites/` already holds the full 28-pair roster (last keyed 22:08). Nothing newer. Skipped.
(gen-sprites NOT run — paid xAI, forbidden in a scheduled run.)
CONTEXT: the 22:24 STATUS shipped ranged foes as plain straight-shooters; the prior NEXT STEP named THE PYRE
3-spell zone channel + mage-shield (pit.js:1635-1653) as the next signature verb. Took it — the most distinctive
caster verb and the first foe that makes you VACATE GROUND rather than just dodge a bolt.
CHANGED — `game3d/arena.html`, 3 edits (all re-read on FRESH disk via the Read tool; bash again served the
documented TRUNCATED ~1075-line stale tail — `wc`/`node --check` over the FUSE mount stay unusable):
(1) NEW `pyre` per-type branch in `updFoeAI` (L607-633, right after the grave block, before the generic
    `if(e.attacking)`, `continue`s past it like grave/door). Faithful port of pit.js:1635: kites away while
    `dToP<170`, then on `cool<=0` opens a 2s CHANNEL (`castT=2`, snapshots `_castHp`, `CASTING` popup); taking
    damage mid-channel (`hp<_castHp`) fires `INTERRUPTED` + cool 1.6 and aborts; a completed channel cycles
    `spell 0->1->2` and pushes a TELEGRAPHED zone at the WARLOCK'S FEET (P.x/P.y) — FIRE AoE (life 3.5) / ICE
    burst / BOLT — then raises a one-time MAGE-SHIELD (`hp+=maxhp; maxhp*=2`, `SHIELDED`). Dropping on P.x/P.y
    means the zone reads correctly regardless of the sim/render-x split (the pyre sprite is drawn by the scene
    duel/crowd path, not e.x).
(2) `updZones` (L1041): NEW fire/ice/bolt branch — `tele` ticks down with NO damage; ICE/BOLT DETONATE once at
    tele-end (`hurtWarlock` if `dist(z,P)<z.r`, SHATTER/BOLT popup + shake, then splice); FIRE then lingers and
    ticks its dmg every .5s for its life while you stand inside. Routes through `hurtWarlock` so roll/ward/fade
    i-frames already negate it.
(3) `zoneGfx` render (L1956): NEW pyre-zone draw — a pulsing TELEGRAPH ring whose fill closes in as the tele
    runs out (move off it!), then the lingering FIRE pool (orange, breathing alpha). ICE/BOLT are instant so
    they show only the telegraph + the detonation popup. Drawn on the floor graphics (depth 1) under the actors.
VERIFIED: isolated `node` behavior harness on the EXACT edited blocks PASSED all 13 asserts (channel starts →
completes → FIRE zone + shield doubles hp; mid-channel damage INTERRUPTS, no zone; FIRE 0-dmg during tele then
ticks then expires; BOLT full dmg + shake on detonation then consumed; ICE misses when the player flees the
ring). All 3 edited regions re-read brace-balanced via the Read tool; file WHOLE on disk (`new Phaser.Game`
L2125, `</script>` L2171, `</html>` L2173 — 2174 lines real). Build stays loadable; live `game/` untouched;
game3d NOT published.
PARITY-COMPARE: inline (a bash-driven diff subagent reads the truncated mount → garbage, as every prior run).
PER-TYPE FOE AI — PYRE zone-caster + mage-shield now PRESENT (joins grave riposte + door guard-break). Remaining
signature verbs: MASTER pack-RELEASE (hound spawns), GUNNER aim-line lock (sidestep-the-laser), HOUND-pack flank,
NECRO raise, CHAMP/BEAST boss phases (pit.js:1670-1805).
NOTE (debt, for a later run): the VISIBLE current-foe pyre still ALSO runs the scene `foeRangedAI`→`foeShoot`
straight-ember on its own clock, so a duel pyre now both zone-channels (sim) AND pokes an ember (scene). Harmless
extra pressure, but the faithful move is to route the scene pyre path into this same channel and retire the ember.
NEXT STEP (single, priority-2/3): THE MASTER pack-RELEASE (pit.js:1684) — a per-type branch that periodically
spawns 2 hound minions (`RELEASE ×2`) + a whipcrack zone, the next most distinctive per-type verb and the one
that turns a wave into a self-replenishing swarm (pure DC crowd pressure).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach a fight with THE PYRE (a mage). It backs off
and a glowing RING closes in UNDER YOUR FEET (CASTING) — step off it before it fills or eat FIRE/ICE/BOLT. Hit
the pyre mid-cast to pop `INTERRUPTED`; let it land and it goes `SHIELDED` (doubles its HP). Fire leaves a burning
pool you must leave; ice/bolt snap once where you stood.

## STATUS: 2026-06-27 23:32 UTC  — ★★★★ DC PAINTERLY POST-FX GRADE LANDED (Bloom + Vignette + warm ColorMatrix) — ~80%→~85% DC LOOK ★★★★
ART INTAKE (first): re-checked `art_in/` — same 05:2x–05:39 source drop (already ingested to `assets/sprites/`, archive in `art_in/raw/`); NOTHING new at top level → nothing to ingest.
PRIORITY PICK: prior run's single NEXT STEP = the camera POST-FX grade (FEEDBACK #6 B-2, the last absent painterly layer). It was the single highest-leverage push toward ~90% DC LOOK. Done.
CHANGED — `arena.html`, ONE additive edit, NO sim/combat/targeting/render touch:
 - New method `applyCameraGrade()` (class `Arena`, ~L1281), called once at the END of `create()` (L1271, right after `buildSideOn()`). Adds a MAIN-CAMERA post-pipeline (composited AFTER the whole scene + Light2D sprites render), three FX in order:
   (1) WARM GRADE — a single custom 4×5 `ColorMatrix` (`cam.postFX.addColorMatrix().set([...])`) hand-composed = ~1.16 saturation × ~1.08 contrast-around-0.5 (so it also deepens shadows) × warm tint (R ×1.04 / B ×0.94), with ~ -0.04 offsets for the painterly Vanillaware contrast. One deterministic call rather than chained presets.
   (2) SOFT BLOOM — `addBloom(0xffe6c0,1,1,1.05,0.58,6)`: warm-white halo over the magic FX / rim light, strength 0.58 so it glows without washing the art out. This is the biggest single perceptual jump.
   (3) VIGNETTE — `addVignette(0.5,0.5,0.72,0.42)` LAST, so it frames the brawl + darkens the pit rim over the graded+bloomed image.
 - PURELY VISUAL. WebGL-only (postFX is a WebGL feature) — guarded (`!cam.postFX || renderer.type!==WEBGL` early-return) + wrapped in try/catch so a Canvas fallback stays loadable; logs a warn and no-ops if FX unavailable.
VERIFIED: Phaser is the STANDARD 3.80.1 CDN build (not "AE") — `Phaser.FX.ColorMatrix` extends `Phaser.Display.ColorMatrix` so `.set([20 nums])` is valid; `addBloom`/`addVignette` signatures confirmed. Inserted method `node --check` = SYNTAX OK (extracted standalone). File re-read on FRESH disk via the Read tool — edit present at L1271/1281, TAIL WHOLE (`})();` L2101 → `</script>` L2102 → `</body>` L2103 → `</html>` L2104; file ~2105 lines). NB: the OneDrive/FUSE bash mount AGAIN served the STALE/TRUNCATED 1080-line tail — trusted the Read tool, not bash.
PARITY/BENCHMARK (subagent): updated `GAME3D_PARITY_CHECKLIST.md` — camera POST-FX grade / Bloom / Vignette / ColorMatrix rows flipped MISSING→PRESENT (FEEDBACK #6 B-2). All kit/summons/evo/transform pit.js line refs spot-checked, still accurate; ZOMBIES + BONE ARCHERS correctly still MISSING (in pit.js, not yet ported to arena.html). DC LOOK ≈ **85%** (up from ~80%). BIGGEST remaining gap to ~90%: **a LIVING crowd + AMBIENT MOTION** — the painted amphitheater crowd is baked-static and the air is still; DC pits constantly breathe (rising embers, drifting god-rays, dust, crowd sway/roar). A static-but-graded frame still reads as a screenshot, not a brawl. Next gaps after that: (2) richer per-actor animation (warlock is a 1-frame idle still — needs a real walk/cast/hurt cycle), (3) HUD/HP-bar polish, (4) transform-beat VFX depth (seraphim descent + Green-Sheol still banner stand-ins).
NEXT STEP (single): add an ATMOSPHERIC PARTICLE LAYER — rising embers + drifting god-ray shafts (+ light dust) over the pit, behind the actors — the highest-leverage push from ~85%→~88% DC LOOK and the clearest "not-DC" tell now that the grade has landed. (Reactive crowd sway/roar can follow.)
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: the whole scene now carries a painterly DC grade — warm tone, bloomed magic glow on the hex/sheol FX + rim light, and a vignette framing the pit. Should read noticeably more "Vanillaware painting" than the flat pre-grade look.

## STATUS: 2026-06-27 23:25 UTC  — ★★★★ TOUCH CONTROLS LANDED (Hiro asked 3×) — VIRTUAL STICK + DC VERB CLUSTER, ZERO NEW COMBAT PATH ★★★★
ART INTAKE (first): re-checked `art_in/` — same 05:2x–05:39 source drop (already ingested to `assets/sprites/`); NOTHING new → nothing to ingest.
PRIORITY PICK: the previous run's single NEXT STEP = the on-screen TOUCH CONTROLS layer (the DC PARITY GATE "TOUCH CONTROLS present" line; Hiro requested mobile controls 3×). Done.
CHANGED — `arena.html`, three additive edits, NO sim/combat/targeting/render touch (combat path untouched):
(1) DOM: a fixed `#touch` overlay (outside the Phaser `parent`) — left `#stickBase`/`#stickNub` virtual stick + right `#btns` DIAMOND cluster (HEX·SUM·DASH·WARD). Container `pointer-events:none` so empty-space taps still fall through to the canvas (tap-to-attack/aim); only the stick + buttons are `pointer-events:auto`.
(2) CSS: DC-styled translucent glass (magenta/gold/teal rim glow, `Georgia` serif). Hidden by default; `.on` reveals it. `touch-action:none` + tap-highlight off everywhere.
(3) JS (a SEPARATE IIFE at the very end, after `new Phaser.Game`): shows the layer only on a coarse/touch pointer (`ontouchstart` / `maxTouchPoints` / `(pointer:coarse)`) or `?touch=1`, and hides the keyboard legend `#verbs` (it overlaps the cluster). The STICK writes the SAME global `stick.{dx,dy,on}` the movement code already reads each frame; the BUTTONS call the SAME global verbs the keyboard calls — `doSlash` (HEX), `doHeavy`+`heavyRelease` (SUM = hold-to-channel / release-to-summon, Q parity), `doRoll` (DASH), `doParry` (WARD). While the evo panel is open, HEX/SUM route to `pickEvo(0/1)`. So there is ZERO new combat path — the touch layer is just a second front-end onto the existing input globals.
VERIFIED: injected IIFE `node --check` = SYNTAX OK; all 6 verbs confirmed top-level `function` decls (global on `window`) at pit.js-mapped lines (doSlash 668, doHeavy 1019, heavyRelease 1024, doParry 1025, doRoll 1064, pickEvo 412). File re-read on FRESH disk via the Read tool — edits present, TAIL WHOLE (`})();` → `</script>` L2070 → `</body>` L2071 → `</html>` L2072; file now 2073 lines). NB: the OneDrive/FUSE bash mount AGAIN served the STALE/TRUNCATED 1080-line tail — trusted the Read tool, not bash. Live `game/` untouched. Harvested → `game3d/blocks/touch_controls_stick_verbs.md`.
PARITY/BENCHMARK (subagent): kit/summons/evo/transform rows re-diffed vs pit.js — accurate as written. TOUCH rows flipped MISSING→PRESENT (virtual stick + on-screen buttons); Parry/PORTAL + Roll/BLINK PARTIAL→PRESENT (their last TODO, an on-screen button, is now closed). DC LOOK benchmark ≈80%. BIGGEST remaining gap to ~90%: **camera POST-FX GRADE — no Bloom + Vignette + warm ColorMatrix on the main camera** (FEEDBACK #6 part B-2, still absent). Next gaps: atmospheric particles (rising embers / god-ray drift / dust), reactive crowd (sway + roar brightness pulse), and a COMBO counter in the HUD.
NEXT STEP (single): add the camera POST-FX grade — a main-camera `Bloom + Vignette + war
## ⏭️ CURRENT TOP 4 (2026-06-28, do these next — supersedes scattered older items)
Auditor PASSES all visual targets; the gaps now are these, in order:
1. EXPOSE `window.__AUDIT__.entities` = [{type, action, anim:{rigged, frames}}] for every on-screen actor — this
   UNBLOCKS the whole animation-coverage loop (auditor -> needed_sprites.json -> gen_sprites --from-needs). TOP.
2. CROWD WALL not visible despite far=True: it's being crushed dark by the vignette/grade OR positioned off-frame.
   Brighten the far layer / lift vignette at the top / reposition so the LIT PACKED STANDS are clearly visible
   behind the action. Acceptance = you can SEE the crowd.
3. REMOVE the dev/status TEXT overlay from the gameplay view (still top-left).
4. PILLARS to MIDGROUND (behind actors, never occlude them) + start the parallax SCROLLING camera (#9/#10).
Then: independent summon AI, and the skeletal rig keyposes (feedback #8/#11) once #1 is exposing entities.
 most blocking, tightly-coupled items in one increment (doing #1 alone would have made #2 worse):
CHANGED — `arena.html`, two surgical edits, no sim/combat/targeting touch:
(1) #7-#1 CANVAS FILLS THE VIEWPORT. The Phaser.Game was hard-capped at `width:min(innerWidth,520),
    height:min(innerHeight,760)` — a 520×760 PORTRAIT canvas that FIT-letterboxed to ~half a landscape window (the
    "left half is black / play field only on the right" bug). Now `width:VIEW_W, height:VIEW_H` == the actual window
    size, so FIT scales 1:1 with NO black margins. Kept FIT (not RESIZE) on purpose: every placement is already
    `scale.width/height`-relative and the backdrop is `cover()`-scaled to W×H, so the fill needs ZERO reflow code —
    build stays loadable. `#wrap` is `inset:0` flex-center; HUD panels are fixed over the (now full-screen) field.
(2) #7-#2 WARLOCK IS DC-SIZED. `HERO_PX` was a FIXED 210px → on a ~1000px-tall window the warlock rendered ~15-21%
    of screen height (DC heroes are ~⅓). Made it VIEWPORT-RELATIVE: `HERO_PX = clamp(VIEW_H*0.355, 240, 520)`.
    Calibrated to the perspective: warlock feet sit at `gy=0.84H` → depth `ty=0.81` → `sc≈0.96`, and on-screen height
    `= sc*HERO_PX`, so `0.355*H*0.96 ≈ 0.34H` → warlock ≈ 34% of the viewport. Every foe/summon scales off the same
    `HERO_PX*SPRITE_TARGET_H[key]`, so all the size RATIOS (dragon 1.9-2.2, succubi 0.8-0.9, etc.) are preserved — the
    whole cast just grows together to fill the bigger canvas. New `VIEW_W/VIEW_H` consts (clamped, innerWidth/Height
    with fallbacks) declared just above `HERO_PX` and reused by the game config.
VERIFIED via the Read tool (bash mount served the usual STALE/TRUNCATED tail — `wc` reported 1078 lines, real file is
1853): both edits re-read on FRESH disk — `VIEW_W/VIEW_H/HERO_PX` at L104-106, the `new Phaser.Game({…})` at L1844-1849
reads `width:VIEW_W,height:VIEW_H` + `Scale.FIT/CENTER_BOTH`, file TAIL WHOLE (`});` L1849 → `</script>` L1850 →
`</body>` L1851 → `</html>` L1852). Backdrop `cover()` (L1101) reads `scale.width/height` live, so it re-covers the
enlarged canvas with no change. Build loadable; live `game/` untouched.
PARITY/BENCHMARK note: DC PARITY GATE — CANVAS-fills-viewport ✅ (was P1), WARLOCK-height-~⅓ ✅ (was P1). Biggest
REMAINING gap to DC, in gate order: #7-#3 / FEEDBACK #6 3-layer backdrop depends on Hiro's `bg_pit_far/floor/fg.png`
art landing in `art_in/` (engine layering is already wired at L1099-1107 with a procedural fallback); and the still-
absent TOUCH CONTROLS (#stick + on-screen verb .btns — Hiro asked 3×). Those are the next two P1s.
NEXT STEP (single): add the on-screen TOUCH CONTROLS layer — `#stickBase/#stickNub` virtual stick + `.btn`
Attack/Dodge/Special/Summon/Hex/Transform — wired to the same input the keyboard verbs use, so the DC PARITY GATE's
"TOUCH CONTROLS present" line clears.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: the pit now FILLS the whole window (no black half) and the
warlock stands ~⅓ of the screen tall like a Dragon's Crown hero, with the whole cast scaled up to match.

## STATUS: 2026-06-27 22:49 UTC  — ◆ NO CODE CHANGE — ARCHITECTURE MAP + RETRACTED A TRUNCATION-INDUCED MISSTEP (build untouched / known-good) ◆
ART INTAKE (priority-0): re-checked `art_in/` — only the old 05:2x–05:39 source drop at the top level (already ingested
15:35 → `assets/sprites/`, archives in `art_in/raw/`). NOTHING new dropped → nothing to ingest.
RESUME NOTE: the prior NEXT STEP (lich **K**/PARRY → `fade()`, deferred from 19:24) is **ALREADY DONE** — a run between
22:0x and 22:39 implemented it: `fade()` exists (arena.html L663), `doParry` routes `if(P.lich){ fade(); return; }`
(L842), `updateLabels` shows `K FADE`. Verified intact via the Read tool. No action needed.
WHAT I DID (and undid): I briefly added a SIM-side foe-AI loop to `updEnemies()` (approach→telegraph→melee-lunge +
ranged `foeShots`) on the premise that "foes are inert dummies." **That premise was WRONG** — an artifact of the
documented FUSE/OneDrive truncation: bash served arena.html truncated at ~1079 lines, hiding the whole scene-render
layer (≈L1180-1520) where the foe AI actually lives. I caught it via the Read tool, **REVERTED the edit byte-for-byte**,
and re-verified `updEnemies()` is the original 11-line DoT-only function (L454-465). Build is loadable + unchanged.
★ ARCHITECTURE MAP (the real model — recorded so the next run doesn't repeat my mistake; READ THE SCENE LAYER WITH THE
READ TOOL, NOT bash, which truncates):
- Foes ALREADY FIGHT BACK. The CURRENT duel foe = `currentFoe()` is bound to ONE `this.foeSprite` by `syncSideOn()`
  (L1210) and driven by the legacy SCREEN-SPACE state machine `foeAI`→`foeMeleeAI`(L~1448 approach/windup/lunge/recover,
  calls `hurtWarlock`) / `foeRangedAI`(L1472 standoff/windup→`foeShoot` L1496, spawns `foeShots[]` from `spr.x`).
- `syncFoeCrowd()` (L1279) renders EVERY OTHER alive foe as a side-on sprite in a back formation + ONE rotating
  cosmetic "charger" that lunges for show. It is RENDER-ONLY — positions by formation index, reads e.flash/e.hexT/e.hp,
  NEVER writes sim state and deals NO damage.
- ⇒ KEY DEBT: foe SPRITE positions are SCREEN-SPACE and DECOUPLED from sim `enemies[].x/y`. Only the duel foe deals
  damage; the crowd is cosmetic. Player projectiles still collide vs sim `e.x/e.y`. So any sim-side foe movement
  desyncs collisions vs the drawn sprite — that is WHY my edit was harmful. `updEnemies()` must stay DoT/stun-only
  until the render model is migrated to be sim-driven.
NEXT STEP (single, choose ONE — both are real, both edit the SCENE layer via the Read tool only):
  (A) PER-TYPE DUEL-FOE VERBS — branch inside `foeMeleeAI` by `f.type`: door = slow lunge + long parryable telegraph
      (THE WALL holds); hound = fast, frequent, low-commit darts; grave = riposte/counter flavor; brute = heavy slow
      shove. (This is the 22:0x "per-type foe AI" intent, now correctly located in the scene layer.)  — OR —
  (B) BRAWLER MIGRATION (bigger, the charter's true north): make `syncFoeCrowd` foes sim-driven attackers (sync sprite
      x↔sim e.x, let 2-3 foes pressure + damage at once) so it's a real DC crowd, not 1 duelist + cosmetic mob.
  Recommend (A) first (contained, low-risk); schedule (B) as a deliberate multi-run refactor.

## STATUS: 2026-06-27 22:39 UTC  — ★★★★ HIRO FEEDBACK #6 (B-1) — THE BRAZIERS ARE LIT: FLICKERING TORCHLIGHT NOW PLAYS ACROSS THE FIGHTERS ★★★★
ART INTAKE (priority-0): `art_in/` re-checked — `find art_in -maxdepth 1 -name '*.png' -newermt "2026-06-27 22:34"` = EMPTY.
The 3 backdrop PNGs are already in `assets/bg/` (copied 22:30) and the source sprites were ingested 15:35; `art_in/raw/`
holds the keyed archive. NOTHING new dropped → nothing to ingest. gen-sprites skipped (PAID xAI call → forbidden in a
scheduled run).
CHANGED — executed the single 22:34 NEXT STEP (FEEDBACK #6 part B-1): added FLICKERING BRAZIER Light2D point-lights so
the painted amphitheater's torches throw REAL moving light across the warlock + foes (the #1 remaining LOOK gap after
the static backdrop landed). To place them on-model I analysed the painted art with PIL — the warm brazier hotspots are
keyed into `bg_fg` flanking the pit: a LEFT cluster (~x0.085-0.185W, y0.66-0.73H) and a RIGHT cluster (~x0.805-0.885W,
y0.58-0.70H). `arena.html`, TWO edits (verified via the Read tool on FRESH disk — bash still serves the documented
TRUNCATED tail; never trusted for node-check/grep):
(1) buildSideOn() (L1120-1135): NEW `this._brazLights=[]`; when `bg_fg` exists, adds 4 warm lights
    (`0xff7a30`, r300, base intensity 1.7) at the 4 measured brazier fracs, each stashing `_bx/_by/_bi/_br` + a per-torch
    `_ph` flicker phase. Guarded on `bg_fg` so the procedural FALLBACK stage just has no torches (still loadable).
(2) syncSideOn() (L1176-1189): folded into the existing parallax block — per frame each brazier light JITTERS via two
    stacked sines (slow 6.5Hz waver + fast 21.7Hz crackle → intensity 0.78x-1.10x base, radius breathes ±) AND tracks the
    fg layer's parallax (`L.x=_bx+fgShift`, `fgShift=-dx*0.16`) so the lights stay pinned to the painted braziers as the
    foreground drifts. Render-only — NO sim/HP writes (same discipline as every crowd/parallax layer).
LIGHT BUDGET: total Light2D lights now 8 (keyLight + green fill + warm fill + 4 braziers + foe rim) ≤ Phaser's default
max 10 — no `maxLights` override needed; headroom of 2.
VERIFIED via the Read tool on fresh disk: both edits brace/paren-balanced (the brazier `if(bg_fg){…forEach…}` closes
clean; the syncSideOn `if(bgFar){ … if(brazLights){ for(){…} } }` = 3 opens / 3 closes), `now` is already passed at the
`this.syncSideOn(now)` call, and the file TAIL is WHOLE (`new Phaser.Game({…})` L1834, `</script>` L1840, `</html>` L1842
— 1843 lines real). Build stays loadable; live `game/` untouched; game3d NOT published.
PARITY+BENCHMARK subagent SKIPPED again (mount actively serves truncated bash reads → a subagent gets a half-file).
In-process DC BENCHMARK: the stage now READS as torch-lit — the warm key on the warlock/foes shifts and flickers with the
braziers instead of being baked flat, the single biggest "is it alive?" cue after the painted pit. Estimate LOOK gap to
Dragon's Crown closed ~75% → ~80%. Remaining FEEDBACK #6 live-FX gaps: bloom+vignette+warm ColorMatrix grade (camera FX),
god-ray drift, rising embers from the braziers, and crowd life (sway/roar/kill-puff).
NEXT STEP (single, FEEDBACK #6 part B-2): add Phaser 3.60 built-in camera post-FX — a subtle BLOOM + VIGNETTE + warm
ColorMatrix grade on the main camera so the lit pit gains the painterly Vanillaware glow/contrast. (Embers + crowd life
after.) THEN return to gameplay teeth: the charger's landed swing applying a small telegraphed REAL chip (read the
ward/roll i-frame path first).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: the flanking braziers now cast LIVE flickering torchlight —
walk the warlock left/right (A/D) and watch the warm highlight crawl across him and the foe as he nears each torch, the
flames guttering. (Camera bloom/vignette grade + embers land next.)

## STATUS: 2026-06-27 22:34 UTC  — ★★★★★ HIRO FEEDBACK #6 (A) — THE PAINTED DRAGON'S-CROWN PIT IS IN: 3 PARALLAX BACKDROP LAYERS ★★★★★
ART INTAKE (priority-0): `art_in/` HAD 3 NEW PNGs dropped 22:26 — `bg_pit_far.png`, `bg_pit_floor.png`, `bg_pit_fg.png`
(all 1280×720). These are BACKDROPS, not sprites, so they SKIP `ingest_art.py` (no 512-cap, no normal map, no scale-
normalize — that pipeline is for actors). Verified: far + floor are full-bleed opaque; fg is ALREADY alpha-keyed
(green-screen → 55% transparent, pillars/chains/braziers). Copied all 3 → `assets/bg/`; archived sources → `art_in/raw/`
so the next intake check is clean. The remaining `art_in/*.png` are the OLD 05:2x sprite drop (already ingested 15:35).
CHANGED — wired the painted backdrop as 3 PARALLAX LAYERS (the #1 acceptance gap in HIRO FEEDBACK #6: "the arena is
currently an EMPTY stage"). This is FEEDBACK #6 part (A); the live-FX part (B: brazier Light2D, bloom/vignette, god-rays,
embers, crowd life) is the next step.
(1) PRELOAD (L996–998): `bg_far` / `bg_floor` / `bg_fg` from new `const BG='./assets/bg/'` (L82).
(2) create() (L1010): the procedural angled floor graphics now carry a `this.floorGfx` ref so buildSideOn can hide it.
(3) buildSideOn() (L1094–1119): REPLACED the old flat-fill backdrop + magenta-ellipse pit ring with the painted layers —
    far `setDepth(-100)`, floor `setDepth(-99)` (both behind every depth≥0 actor + FX graphic), fg `setDepth(9000)` drawn
    OVER everyone; each cover-scaled (`max(W/1280,H/720)`) + `setScrollFactor(0)`. The old procedural fills are kept as a
    guarded ELSE FALLBACK so the build stays loadable if the art is ever missing. floorGfx hidden in the painted path.
(4) syncSideOn() (top): per-frame PARALLAX — far drifts -6% and fg -16% of the warlock's offset from centre, so the pit
    gains depth as he walks (render-only; screen-fixed layers).
VERIFIED via the Read tool (bash served the documented TRUNCATED tail AGAIN — `wc -l` reported 1078 ending mid-`create()`
with no `</html>`, and grep MISSED `bg_floor`/`buildSideOn`/`syncSideOn` edits, so any node-check/diffing subagent would
get garbage as every prior run): all 4 edits re-read on fresh disk, brace/paren-balanced, inserted into known-good code —
preload block closes L999; painted `if/else` opens L1099 closes L1119; foeAI/demon-render tails downstream intact.
PARITY+BENCHMARK subagent SKIPPED again (mount actively serves truncated bash reads → a subagent gets a half-file).
In-process DC BENCHMARK: this is the single biggest LOOK jump yet toward Dragon's Crown — the stage goes from flat dark
fills to a painted torch-lit amphitheater with a watching crowd baked into `bg_far`. Estimate the LOOK gap to DC closed
from ~55% → ~75%; the remaining gap is now LIVE LIGHTING (FEEDBACK #6 part B): braziers don't yet cast Light2D across the
fighters, no bloom/vignette grade, no god-ray drift, no rising embers, the crowd is static (no sway/roar/kill-puff).
NEXT STEP (single, FEEDBACK #6 part B-1): add FLICKERING brazier Light2D point-lights at the painted brazier positions in
`bg_far` (warm, using the normal maps the build already bakes) so the torchlight plays across the warlock + foes as they
move — the highest-impact live-FX layer. THEN bloom+vignette+warm ColorMatrix on the main camera (Phaser 3.60 built-in FX).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: the Pit is no longer an empty stage — it's the painted
Dragon's-Crown amphitheater (crowd + braziers + god-rays baked into the far layer, bloodstained sand floor, keyed pillars
framing the edges over the fighters). Walk left/right (A/D) to feel the far/fg parallax. (Live torch lighting lands next.)

## STATUS: 2026-06-27 22:1x UTC  — ★★★ DC CROWD — THE CHARGER NOW ROTATES: EVERY WING FOE TAKES A TURN BREAKING RANK ★★★
ART INTAKE (priority-0): `art_in/` re-checked — all PNGs are the OLD 05:2x–05:39 source drop, already ingested 15:35
into `assets/sprites/` (28 diffuse+normal pairs); `art_in/raw/` is the keyed archive. NOTHING new dropped → nothing to
ingest. gen-sprites skipped (PAID xAI call → forbidden in a scheduled run).
CONTEXT: the 22:0x NEXT STEP offered the no-paid option to ROTATE the charge across the wing so a single foe doesn't
hog every run. Took it — small, render-only, no sim writes (left the "real chip on the swing" half as next step: it
needs the player hurt/ward/roll-iframe path studied and it would break the strict render-only discipline every crowd
layer has held to so far).
CHANGED — `arena.html`, ONE edit inside `syncFoeCrowd` (the charger PICKER, ~L1161, verified via the Read tool — bash
still serves the documented TRUNCATED 1089-line tail; the file is WHOLE on fresh disk):
(1) Replaced the single-line random pick (`waiting[rnd|0]`) with a ROTATION: a scene-level `this._recentChargers` Set
    tracks who has already charged this round. The picker gathers `fresh` = waiting foes NOT in the set, and elects the
    new charger from `fresh`; when `fresh` is empty (everyone has had a turn) it CLEARS the set and starts a new round
    over all waiting foes. The elected foe is added to the set. The `_chargeT0/_chargeStruck/_nextCharge` pacing is
    UNCHANGED, so the cadence (one charge every ~2.6–5.4s) is identical — only WHO charges rotates. Dead/left foes drop
    out naturally (they're never in `waiting`, so they can't be re-picked and never block the round reset).
RENDER-ONLY by design — NO sim/HP/damage written (same discipline as the charge-arc, assist-lane, and crowd-lean
layers). `_recentChargers` holds foe object refs that are scoped to the wave; a new wave's foes simply aren't in the
old set, and the set is small (≤ wave size).
VERIFIED: extracted the rotation logic into `outputs/rotcheck.js`, `node --check` SYNTAX OK, and a 2000-step sim over a
4-foe wave returned per-foe charge counts {a:200,b:200,c:200,d:200} — PERFECTLY EVEN, every foe takes a turn, no foe
starved (PASS). The edited region re-read BALANCED via the Read tool (the `if(!this._crowdCharger…){…}` block closes
cleanly before `waiting.forEach`). `node --check` OVER THE MOUNT remains unusable (FUSE serves a truncated tail) →
trusted the Read tool on fresh disk + the isolated node check. Build sta
## ★★★ KEYFRAME CONSISTENCY STRATEGY (2026-06-27) — how new poses stay the SAME model
Hiro's concern: a new pose must look like the SAME character. Solution = SHOW Grok the source, don't re-describe it.
- Every keyframe is generated with the EDIT endpoint, referencing the ENTITY'S OWN approved sprite (not text-only).
  A persistent `tools/refs/<entity>.png` library holds each base sprite; `gen_sprites.py --snapshot` seeds it from
  the current art (run once), and every future base gen auto-adds its ref. `--from-needs` then edits FROM refs/<ent>.
- Prompt is exacting: "Use the REFERENCE IMAGE as the EXACT character — keep face/colours/costume/anatomy/scale/
  side-on framing IDENTICAL — change ONLY the pose to <pose>, keyframe n of N." So only the pose changes.
- All N keyframes of an action edit from the SAME base ref (not chained) so they don't drift frame-to-frame.
- Effects (fireball/breath) are abstract -> generated fresh on black (no identity to preserve).
This is why enemies won't morph: they're edit-locked to their own sprite, same as the warlock is to his idle.
same one repeatedly, so the whole wing reads as taking turns pressing you. (Still stand-in art + no
real damage from the charge yet
## ★★★★★ HIRO FEEDBACK #11 (2026-06-27) — FULL ANIMATION COVERAGE: no frozen stills, >=3 keyposes per action
GOAL (Hiro): the game must look ANIMATED. EVERY entity on screen — player, transforms, summons, every enemy,
objects, and effects — must have a real animation for EVERY action it performs, and each action must be at least
"3 images worth of action" (>=3 KEYPOSES) so it's smooth and has motion, never a single static frame.
RECONCILED WITH THE LOCKED SKELETAL RIG: an action PASSES if it is (a) a real RIG CLIP (the rig tweens between
keyposes -> smooth) OR (b) >=3 frame stills. A single static still = FAIL. Best practice = 3 keyposes + rig tween.

ACTION TAXONOMY (the engine must animate these; the auditor flags any the entity DOES without a clip):
  • PLAYER (warlock + lich/archdevil/demonlord): idle, walkF, walkB, attack(slash), attack(heavy), hex(cast),
    summon, roll/dodge, hurt, transform, death.
  • SUMMONS: idle, move(seek), attack — succubus=fireball-cast, bone/black dragon=breath, clawfiend=claw-swipe,
    bonearcher=draw+loose, shambler=swipe — hurt, death.
  • ENEMIES (all 14): idle, walkF, attack, hurt, death; ranged (gunner/pyre)=aim+shoot; door=lunge.
  • OBJECTS: idle/sway, trigger/attack, break.
  • EFFECTS: fireball/breath/arrow = travel loop (>=3 frames) + impact burst (>=3 frames).

ENGINE TELEMETRY (REQUIRED so the auditor can verify): on ?audit=1 set
  window.__AUDIT__.entities = [ { type:"warlock|succubus|door|...", action:"walkF|attack|...",
                                  anim:{ rigged:<bool>, frames:<int keyposes/frames> } }, ... ]
listing EVERY entity currently on screen and the action it's performing. The auditor (visual_audit.py) fails any
entity whose current action is a static still (<3 frames AND not rigged) and APPENDS it to
`tools/audit/needed_sprites.json` as {entity, action, frames_needed:3}. That file is the work queue.

NEEDS -> ART LOOP: gen_sprites.py reads needed_sprites.json (`--from-needs`) and generates a >=3-keypose set per
(entity,action) using the naming convention `<entity>_<action>_<n>` (e.g. warlock_attack_1/2/3, succubus_fireball_1/2/3).
Keyposes use anticipation -> contact -> recovery. Player/transform/summon use edit-mode (on-model); enemies use
gen-mode template keyposes; effects are abstract (no consistency risk). Then the build rigs/plays them.
TIERED REALISM (so we don't generate 450 morph-prone frames): heroes+summons+effects get full 3-keypose sets;
the 14 gen-mode enemies get 2 keyposes (neutral + action-extreme) that the RIG tweens — still smooth, avoids morph.
`
block close cleanly inside the `waiting.forEach`; the `});` at the loop end intact). As every prior run `node --check`
OVER THE MOUNT is unusable (FUSE serves a truncated tail) → trusted the Read tool on fresh disk. Build stays loadable;
live `game/` untouched; game3d NOT published.
PARITY-COMPARE subagent SKIPPED again (mount serves truncated bash reads → a diffing subagent gets a half-file);
checklist updated in-process: CROWD FOES ACTING (not just waiting) → PARTIAL→improved (charge-and-strike layered on the
lean; deeper per-foe seek/turn-taking + real damage is the next tier).
NEXT STEP (single): when Hiro is present + a paid call is allowed, run gen-sprites for the dedicated gladiator side-on
sprites (door/hook/chain/pyre/gunner/grave/stitch/brute/master/hound/necro/champ/beast) — the biggest remaining LOOK
gap. If a no-paid run: ROTATE the charger so different wing foes take turns (track a recent-charger set) and let the
landed swing apply a small REAL chip to the player (honoring ward/roll i-frames) so the pressure has teeth.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach any multi-foe wave (TWIN HOOKS at fight 2, or any
fight past #3) — every few seconds one back-row foe now lights up yellow, breaks formation, DASHES in at you, pops a
colored spark as it swings, and falls back to its slot — on top of the whole wing's restless lean. (Still stand-in art
+ no real damage from the charge yet — both are the next steps.)

## STATUS: 2026-06-27 21:5x UTC  — ★★★ DC CROWD PRESSURE — WAITING FOES NOW RESTLESSLY PRESS IN (no longer frozen) ★★★
ART INTAKE (priority-0): `find game3d/art_in -name '*.png' -newermt "2026-06-27 15:35"` = EMPTY → nothing new; all
sources already ingested into `assets/sprites/`. Skipped.
CONTEXT: prior NEXT STEP had two parts — (a) gen DEDICATED gladiator side-on sprites and (b) give the waiting crowd
APPROACH/attack motion so the back rows press in. Part (a) requires gen-sprites = a PAID xAI call → FORBIDDEN in a
scheduled run, so DEFERRED to a Hiro-present run. Did part (b), which is code-only: the multi-foe crowd rendered (per
21:4x) but every waiting foe stood DEAD STILL in a fixed formation — not the seething Dragon's Crown mob. Added motion.
CHANGED — `arena.html`, ONE edit inside `syncFoeCrowd` (the waiting-foe layout, ~L1167, verified via the Read tool —
bash still serves the documented TRUNCATED tail):
- The static `x` formation became a restless FORWARD-LEAN: `baseX` (the old slot) minus a per-foe sine press
  `press=sin(now*0.0019 + i*0.85)*0.5+0.5` × `W*0.07`, so each waiting foe leans IN toward the player on its own beat
  then rocks back — staggered by index `i` so the mob seethes rather than pulsing in unison. BOUNDED + render-only:
  `x=max(W*0.66, …)` hard-clamps at a standoff line so a leaning foe can NEVER cross into the duel/player zone, and
  the lean always eases back so the formation can't walk off. Added a small synced vertical bob
  (`fy += sin(ph*1.7)*H*0.009`) to sell the shuffling step. HP pip + shadow already read `x`/`fy`, so they track the
  motion for free. No sim state written (still pure render layer); tint/cull/pool logic untouched.
VERIFIED: extracted the new layout math into an isolated harness (`outputs/crowdcheck.js`), `node --check` SYNTAX OK,
and a sweep (8 foes × 20 s) confirmed 0 bad samples — `x` always within [W*0.66, W*0.96] (never crosses the standoff),
`press` always in [0,1], no NaN/Inf. Edit region re-read BALANCED via the Read tool (the `});` closing the
`waiting.forEach` is intact at L1191); only in-block expressions changed, no brace/structure change. `node --check`
over the mount remains unusable (FUSE serves a truncated tail) → trusted the Read tool. Build stays loadable; live
`game/` untouched; game3d NOT published.
PARITY-COMPARE subagent SKIPPED again (mount serves truncated bash reads → a diffing subagent gets a half-file);
checklist note: CROWD FOES ACTING (not just waiting) → PARTIAL (restless approach-lean + bob; real per-foe seek/
attack AID for the back rows is the deeper step). DEDICATED gladiator ART remains MISSING (needs a paid gen-sprites
run with Hiro present).
NEXT STEP (single): when Hiro is present, run gen-sprites for the dedicated gladiator side-on sprites (door/hook/
chain/pyre/gunner/grave/stitch/brute/maste
## ★★★★ HIRO FEEDBACK #10 (2026-06-27) — PILLARS GO TO THE BACKGROUND; NOTHING OCCLUDES THE ACTORS
HARD RULE (beat-em-up): NO scenery element may EVER draw over the warlock, enemies, or summons. The actors are
always the frontmost gameplay layer. Right now bg_pit_fg (the edge pillars) is drawn OVER the actors and blocks the
view — that was my z-order mistake. RETRACT the "fg drawn over actors / fast parallax foreground" instruction from
feedback #6/#7. Correct layer order, BACK -> FRONT:
  1. bg_pit_far  (crowd WALL)            — backmost, slow parallax
  2. bg_pit_fg   (the PILLARS)           — MIDGROUND: behind the actors, IN FRONT OF the crowd wall. Pillars may
                                            occlude the CROWD (nice depth) but NEVER the actors.
  3. bg_pit_floor (ground band)          — the play surface
  4. ACTORS (warlock / enemies / summons / projectiles) — ALWAYS in front of every backdrop layer
  5. FX flashes + HUD/touch UI           — frontmost
COOL EFFECT HIRO WANTS (free once #2 is midground + parallax scroll): a DYNAMIC AUDIENCE on the bg_pit_far wall that
gets swept behind the pillars as the camera pans — crowd (far, slow) and pillars (mid, faster) at different scroll
factors so pillars pass across the spectators. Give the crowd subtle life (sway + a roar-brightness pulse on a kill).
Keep the pillars — Hiro likes them — just MOVE THEM BEHIND the actors.
ALSO STILL OPEN: (a) the dev/status TEXT overlay is STILL on the play view (top-left) — remove it from gameplay.
(b) confirm the new bg_pit_far CROWD WALL art is actually ingested (the packed lit stands should be visible up top).
umented
truncated tail again so a full `node --check` over the mount stays unusable):
(1) NEW shared sim array `const foeShots=[]` (L141, after `tracers`) — ENEMY projectiles, the mirror of `fireballs[]`.
(2) NEW `updFoeShots(dt)` (L468, after `updEnemies`): flies each shot, streaks it via `scene.fxTrail(_,_,'fire')`,
    and on contact with the warlock (`hypot < P.r+s.r`) calls `hurtWarlock(s.dmg)` (roll/ward/fade i-frames already
    honoured INSIDE hurtWarlock) + a BURN/HIT popup, despawning on hit or `outOfArena`. GLUED into the frame() upd
    block (L912) between `updEnemies` and `updDemons`.
(3) `foeAI` (L1383): early branch `if(f.ranged){ this.foeRangedAI(now,f); return; }` — the melee switch is UNTOUCHED
    for non-ranged foes (lowest-risk wiring).
(4) NEW scene methods `foeRangedAI(now,f)` + `foeShoot(f,spr)` (L1416, right after `foeAI`): the foe drifts to a
    standoff x (`min(homeX, P.x+300)`) from either side, telegraphs a 0.45s wind-up (yellow `_tele`), then FIRES a
    `foeShots[]` projectile aimed at the warlock (pyre = orange BURN ember w/ `fire` flag + bigger shake; gunner =
    pale-gold shot) and reloads `rnd(0.9,1.5)s`. Pure standoff — 
## ★★★ SCREENSHOT REVIEW (2026-06-27 20:05, auditor PASS but composition still wrong)
The audit hook reports far/floor/fg = true and warlock 34% — GOOD. But the live screenshot STILL reads floor-dominant:
the painted CROWD WALL is not visibly behind the action; the cobblestone FLOOR is still acting as the background.
Likely causes (check both):
  (a) STALE ART: the build is using the OLD bg_pit_far (the bowl) — RE-INGEST the new art_in/bg_pit_far.png (a
      straight-on tiered-stands CROWD wall with a LOW horizon). Confirm the texture actually swapped.
  (b) FLOOR TOO TALL: bg_pit_floor is drawn covering most of the frame. Constrain it to the bottom ~1/3; the crowd
      WALL must fill the top ~2/3 and be clearly visible (lit stands, banners, torches) behind the fighters.
The 'layers drawn = true' boolean is NOT sufficient — acceptance is the CROWD being VISIBLE behind the action with a
low horizon, matching the new bg_pit_far. Also: turn ON ember particles (audit shows embers=false, P2).
NOTE for the auditor: consider a top-third composition heuristic later (is the upper band a distinct wall vs more
floor?) so this gap fails automatically instead of needing Hiro's eye.
r http: reach fight 4 (PYRE) or fight 5 (THE POWDER SAINT) —
the foe no longer charges in; it BACKS to a standoff, flares yellow as it aims, then SPITS an ember/shot across the pit
at you (orange BURN for pyre, gold for the gunner). Close the gap or sidestep — standing still now costs HP at range.

## STATUS: 2026-06-27 21:4x UTC  — ★★★ DC CROWD — EVERY ALIVE FOE NOW RENDERS AS A SIDE-ON SPRITE (multi-foe waves) ★★★
ART INTAKE (priority-0): `find game3d/art_in -name '*.png' -newermt "2026-06-27 15:35"` = EMPTY → nothing new; all
sources already ingested into `assets/sprites/` (31 files). Skipped.
CONTEXT: the prior NEXT STEP and the #1 DC-feel gap now that the 20-fight roster exists — a multi-foe wave (TWIN
HOOKS, the SIEGE WORKS 4-up, the post-fight-3 healer+wildcard stack) showed only ONE big side-on sprite (`currentFoe`)
while every OTHER alive foe was INVISIBLE (the `enemyGfx` circle loop `continue`s on `SIDEON`). So a "wave" didn't look
like a wave. Fixed: render the whole wave as a Dragon's-Crown crowd.
CHANGED — `arena.html` (3 edits, all verified via the Read tool — bash served the documented TRUNCATED tail again,
~1089 lines vs 1660 real):
(1) NEW scene method `syncFoeCrowd(now)` (L1144, immediately after `syncSideOn`): keeps a per-foe `this._foeCrowd`
    Map of `{spr,shadow}` keyed off the enemy OBJECT. Each frame: (a) CULL any pooled sprite whose foe `e.dead ||
    e===cur || enemies.indexOf(e)<0` — covers death, wave-swap, AND promotion to the current duel foe (so `foeSprite`
    never gets a ghost twin); (b) gather the WAITING foes (alive, ≠ currentFoe) and lay them in a shallow 2-ROW back
    depth band: `x=min(W·0.96, W·(0.80+0.05·col+row·0.025))`, `y=gy−H·(0.07+row·0.075+0.012·col)`, scale `0.82−row·
    0.10−0.02·col` (deeper = higher + smaller), `setDepth(fy)` for y-sort, a hazy `0x8f8fa8` "waiting in the wings"
    tint (overridden by white hurt-flash > yellow `_tele` telegraph > magenta `hexT`). A thin red HP pip floats over
    each via
## FX RENDER NOTE (2026-06-27) — fireball/burst art is now black-bg + brightness-alpha. DRAW IT ADDITIVE.
The fireball.png / fireball_hit.png are glowing FX keyed from a black background (alpha = brightness), so render them
with ADDITIVE blend (Phaser BlendModes.ADD) for a real glow over the scene; tint GREEN for archsuccubus/demon-lord.
uring verification) the cull condition gained `e===cur` — without it, when a waiting foe got PROMOTED to
    the duel foe its crowd sprite lingered as a ghost duplicate of `foeSprite` (the behavioral mock caught it: pool=2
    where 1 was expected). Now culls on promotion.
VERIFIED: isolated `node --check` SYNTAX OK on the extracted method; a behavioral mock (4-foe wave, stubbed Phaser
`add`) confirmed pool=3 waiting on spawn, cull-on-kill (→2), cull-on-promotion (→1, the bug fix), cull-on-wave-swap
(→1), and NO sprite leak (2 game-objects per pooled foe, all destroyed on cull). All edits re-read balanced via the
Read tool; file TAIL WHOLE on disk — `new Phaser.Game({...})` L1655–1657, `</script></body></html>` L1658–1660
(1660 lines real; bash `wc`/`tail` saw ~1089, the documented OneDrive FUSE truncation → `node --check` over the mount
unusable, trusted the Read tool). Build stays loadable; live `game/` untouched; game3d NOT published.
PARITY-COMPARE subagent SKIPPED again (mount serves truncated bash reads → a diffing subagent gets a half-file);
checklist updated in-process: MULTI-FOE SIDE-ON RENDERING MISSING → PRESENT (every alive foe drawn, y-sorted depth
band, per-foe HP pip); dedicated gladiator ART + crowd foes ACTING (not just waiting) remain the gaps.
NEXT STEP (single): gen the dedicated gladiator side-on sprites (door/hook/chain/pyre/gunner/grave/stitch/brute/
master/hound/necro/champ/beast) via gen-sprites to replace the shambler/bonearcher STAND-INS that all waves share —
the biggest remaining LOOK gap now that the crowd renders. THEN give the waiting crowd foes light approach/attack
motion so the back rows press in (DC pressure), instead of standing still.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach a MULTI-foe wave (e.g. TWIN HOOKS at fight 2, or
any fight past #3 once Bellow stacks a healer + wildcard) — the whole wave now stands in the pit as a Dragon's-Crown
CROWD: the front duelist big + sharp, the rest waiting in a hazy, smaller back row (y-sorted, each with a red HP pip),
flaring white/yellow/magenta when hexed or hit. (They still wait rather than press in, and share stand-in art — both
are the next steps.)

## STATUS: 2026-06-27 21:2x UTC  — ★★★ M4 — THE REAL pit.js FIGHTS[] GAUNTLET LADDER REPLACES THE 2 PLACEHOLDER FOES ★★★
ART INTAKE (priority-0): `find game3d/art_in -name '*.png' -newermt "2026-06-27 15:35"` = EMPTY → nothing new; all
sources already ingested into `assets/sprites/` (31 files). Skipped.
CONTEXT: this was THE single biggest DC-feel gap per the prior NEXT STEP — the brawler had only 2 hardcoded dummies
(`Shambler`/`Bone Archer`) where the real 20-fight gauntlet should be. Ported the roster + wave loop:
CHANGED — `arena.html` (4 edits, all verified via the Read tool — bash served the documented TRUNCATED tail again,
1089 lines vs 1611 real):
(1) NEW `FIGHTS[]` data table (L165–255, just above `GAUNTLET_N`) — pit.js:1389 ported 1:1: all 20 fights with their
    NAMES + TAUNTS + foe composition (THE DOOR → TWIN HOOKS → … → SIEGE WORKS 4-up → THE FORMER CHAMPION → BELLOW'S
    SECRET beast+boss). HP/spd/r/col preserved. Plus `typeLabel()`, `mkFoe()` (seeds the foe-AI + DoT fields
    syncSideOn/updEnemies read), and `spawnFight(idx)` — faithful pit.js spawnFight:1456: `i=1+idx*0.30` stat scale,
    `dmgScale=1+idx*0.16`, and the post-fight-3 deck-stack (a stitch HEALER + a random wildcard, then DOUBLE all HP).
    `GAUNTLET_N` is now `FIGHTS.length` (=20), not the old stub 21.
(2) create() (~L1000): the 2-dummy placeholder block → `S.fight|=0; spawnFight(S.fight)`. scene is set at create()'s
    first line (L953) so spawnFight reads the real canvas W/H; runs BEFORE buildSideOn (L1036) so the foe sprite keys
    off the spawned roster.
(3) `buildSideOn` (L977) + `syncSideOn` (L1010): foe sprite now keys off `f.spriteKey || foeKeyFor(f.name)`.
    spawnFight sets `spriteKey` = STAND-IN art (ranged→`bonearcher`, melee→`shambler`) since dedicated gladiator
    side-on sprites don't exist yet — a gen-sprites pass for door/hook/chain/pyre/gunner/grave/stitch/brute/master/
    hound/necro/champ/beast is the art follow-up.
(4) `killEnemy` no longer advances S.fight per-kill (a FIGHT is a whole GROUP now). NEW wave-cleared check in `frame()`
    right after the upd* sim block (~L800): when `enemies.every(e=>e.dead)`, advance S.fight + spawnFight the next wave
    (banner with the fight name), or set `S.gauntletDone` + a "GAUNTLET CLEARED" banner on the last. Placed there (not
    in killEnemy) so the array swap can't mutate enemies[] mid-iteration of the kill's calling loop.
VERIFIED: extracted FIGHTS+mkFoe+spawnFight+waveCheck+killEnemy into an isolated harness with stubs → `node --check`
SYNTAX OK, and a behavioral smoke (clear every wave in a loop) rolls the ladder 0→19 and sets `gauntletDone`; the
post-fight-3 stack is correct (fight 3 = 4 foes, HP doubled: door 180×1.9×2 = 684). All 4 edit regions re-read
balanced via the Read tool; file TAIL WHOLE on disk — `new Phaser.Game({...})` L1605–1608, `</script></body></html>`
L1609–1611 (1611 lines real). Build stays loadable; live `game/` untouched; game3d NOT published.
PARITY-COMPARE subagent SKIPPED again (mount serves truncated bash reads → a diffing subagent gets a half-file);
checklist updated in-process: FIGHTS[] gauntlet roster + wave ladder MISSING → PRESENT (data + advance loop);
multi-foe SIDE-ON RENDERING (only currentFoe gets the big sprite; the rest render as enemyGfx circles) + dedicated
gladiator ART remain the gaps.
NEXT STEP (single, priority-1/2 — the next DC gap now that the roster exists): render ALL alive foes as side-on
sprites (not just currentFoe) so a multi-foe wave actually LOOKS like a Dragon's Crown crowd — a per-foe sprite pool
keyed off `f.spriteKey`, y-sorted in the depth band, instead of the single `foeSprite`. THEN gen dedicated gladiator
sprites (gen-sprites) to replace the shambler/bonearcher stand-ins.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: you now fight the REAL gauntlet — kill the foe(s) and a
named next wave announces + steps in (THE DOOR → TWIN HOOKS → … → BELLOW'S SECRET), 20 fights deep, HP/groups scaling
per pit.js (after fight 3 a healer + wildcard join and all HP doubles). (Multi-foe groups currently show one big
side-on sprite + circle stand-ins for the rest — full multi-sprite crowd is the next step.)

## STATUS: 2026-06-27 21:0x UTC  — ★★ #6 TRANSFORMATIONS — LICH DEFENSIVE VERB REROUTED: K NOW FADES (not PORTAL) ★★
ART INTAKE (priority-0): checked `art_in/` — same OLD 05:2x–05:39 drop already ingested into `assets/sprites/`
(28 diffuse+normal pairs) + the `_preview_*`/`_*summons` vibe PNGs + `raw/` keyed archive; md5 of a re-dropped raw
PNG differs from `_src` only because `_src` holds the KEYED/processed copy (expected). NOTHING new → nothing to ingest.
CHANGED — executed the single NEXT STEP from 19:24: rerouted the LICH **K** (PARRY) to `fade()`, the last of the
reaper's verbs that was still firing the warlock's base ability (it threw PORTAL). Now matches pit.js:357
(`if(P.lich){fade();return;}` ahead of `portal()`):
(1) NEW free fn `fade()` (L550, after `exitLich`, hoisted) — faithful to pit.js:991: `P.fadeT=(binder?10:5)`,
    `P.parryCD=9`, `P.ft.rolls++`; green leafBurst + `FADED` popup + `FADE` banner + `vib(30)` + `flashFx(.1)`.
(2) GLUE: `doParry` (L718) → `if(P.lich){ fade(); return; }` placed AFTER the `parryCD` gate but BEFORE the portal
    `enemies.filter`/`!fs.length` early-return, so FADE fires even with no foe on screen (matches the original; PORTAL
    needs a foe, FADE does not). Reverting the one line restores PORTAL automatically (gate reads `P.lich`).
(3) Untargetability came FREE — `hurtWarlock()` already bails to a `DODGE` popup while `P.fadeT>0` (L159), and
    `lichSlash()`/`doRoll()` already refuse to fire mid-fade, so "five seconds beyond reach — only the summons
    answer" is fully realized without touching the foe AI. `updateLabels` lich branch now reads `J SCYTHE / Q SUMMON
    / K FADE`.
VERIFIED via the Read tool (bash again served the documented STALE/TRUNCATED tail — `wc` reported 1109 lines vs the
real 1521, so `node --check` over the FUSE copy stays unusable): all edits re-read on FRESH disk and brace-balanced —
`fade()` opens L550 / closes L556 between `exitLich` and `enterDemonLord`; the `doParry` guard sits at L718 just under
the `parryCD` gate; the `updateLabels` lich label updated. File TAIL WHOLE on disk — `new Phaser.Game({...})` boots
L1512, `</script>` L1518, `</html>` L1520 (1521 lines real). Build stays loadable; live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount serves truncated bash reads → a diffing subagent gets garbage);
checklist updated in-process: LICH transformation — SCYTHE + minimal form + transform beat + now FADE all land; the
death→rise→phylactery 3-stage resurrect pipeline + unkillable-while-dragon remain the gap.
NEXT STEP (single, priority-4 — biggest DC-feel gap now that the lich verbs are faithful): the real `pit.js FIGHTS[]`
roster port to replace the 2 placeholder foes — spawn the gauntlet ladder (shambler/archer waves → boss foes) so the
brawler has its real enemy sequence, the #1 thing between the current shell and a Dragon's-Crown wave loop.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: press **B** to force the LICH reaper, then press **K** —
he FLASHES green and goes FADED for 5s (a `FADE` banner + `FADED` popup); during it incoming hits pop `DODGE` and his
SCYTHE/ROLL won't fire (only summons act), then he becomes targetable again after ~5s. Press **B** to revert and
K goes back to PORTAL. (Minor polish later: a `SEEN AGAIN` popup when `fadeT` lapses — the generic decay loop just
zeroes it silently right now; pit.js:2247 fires the popup.)

## STATUS: 2026-06-27 (this run) UTC  — ★★ PER-TYPE FOE AI — THE WALL (DOOR) GUARD-BREAK LANDED (frontal block: HEAVY or FLANK) ★★
ART INTAKE (priority-0): `art_in/` holds only already-ingested originals + `_*` previews (14 roster PNGs live in
`art_in/raw/`); nothing newer than the 05:2x drop. Nothing to key/normalize. Skipped. (gen-sprites NOT run — paid xAI.)
CONTEXT: the last STATUS's NEXT STEP named THE DOOR guard-break (pit.js:1187-1195) as the next per-type verb on top of
the generic brain + the grave riposte. Took it — the 2nd signature foe defense, and the one that makes the shallow
2.5D depth plane MATTER (you flank up/down to get past the shield).
CHANGED — `game3d/arena.html`, 5 edits (all verified via the Read tool on fresh disk; bash served the documented
TRUNCATED ~1080-line stale tail again — `wc`/`node --check` over the mount unusable):
(1) `foeGuard()` contract flipped from BOOLEAN to a DAMAGE MULTIPLIER — 0 = fully negated (grave parry), 0.25 =
    chipped off a guard (door CLANG), 1 = clean hit — so one funnel does both negation AND scaling.
(2) NEW THE WALL frontal guard inside `foeGuard` (port of pit.js hitEnemy:1187): a hit inside the door's ±0.9-rad
    facing arc (`e.face` tracks the warlock each frame) — LIGHT → `CLANG — flank or HEAVY`, 25% chip; HEAVY → `GUARD
    BROKEN` 2s + big shake/vib AND still lands full. Past it = HEAVY or FLANK (step up/down the depth band off its arc).
(3) `updEnemies` decays `e.brokenT` and pops `GUARD UP` when the 2s break expires and the shield reforms.
(4-6) Routed the new multiplier through all 3 warlock-damage sites: the HEX/fire/arrow bolt impact in `updFireballs`
    (parry negates; door chips the DIRECT hit, AoE/DoT untouched), `devilStrike` (CLAW/BITE), `lichSlash` (SCYTHE is
    always heavy → door guard always BREAKS; grave still parries the whole hurl+stun+dmg).
VERIFIED: an isolated `node --check` + behavior harness on the EXACT edited blocks PASSED every assert (door light
→0.25, heavy→1 with brokenT set, while-broken→1, grave→0, normal→1, flank-from-above→1 bypasses the front guard);
all 5 edited regions re-read brace-balanced via the Read tool; file WHOLE (`new Phaser.Game` L1989, `</html>` L1997,
1998 real lines). Build stays loadable; live `game/` untouched; game3d NOT published.
PARITY-COMPARE: inline (a bash-driven diff subagent reads the truncated mount → garbage, as every prior run). Note:
PER-TYPE FOE AI — DOOR guard-break now PRESENT (joins the grave riposte). Remaining signature verbs: PYRE 3-spell
z
## ★★★★ HIRO FEEDBACK #9 (2026-06-27) — BACKDROP, SCROLLING CAMERA, SUMMON AI, FIREBALL, SUMMON ANIM
From a live play screenshot. Priorities:

1. **BACKDROP IS WRONG — "the floor is the background."** Right now the oblique cobblestone FLOOR (bg_pit_floor)
   is stretched up as the whole background, so giant cobbles read as the backdrop. FIX the layering:
   - bg_pit_far (REWORKED to a straight-on WALL: tiered stands PACKED with a watching CROWD, banners, torches,
     low horizon) = the UPRIGHT BACKDROP WALL filling the top ~⅔ behind the actors. Hiro regenerates it (--force).
   - bg_pit_floor = ONLY a ground band in the bottom ~⅓, perspective receding from the wall's base — NOT the whole bg.
   The horizon (wall meets floor) should sit ~⅓ up the screen. The crowd must be visible. This is the top gap.

2. **SIDE-SCROLLING PARALLAX CAMERA (the thing Hiro means by "screen moves sideways to reveal more background").**
   This is a SCROLLING beat-em-up camera with PARALLAX: the arena is WIDER than the screen; the camera follows the
   player and scrolls horizontally, and the backdrop layers move at DIFFERENT speeds for depth — bg_pit_far slowest,
   bg_pit_floor mid, bg_pit_fg (edge pillars) fastest/foreground. Make the pit ~2-3 screens wide so there's room to
   scroll and reveal more crowd/wall. Standard Phaser: a world wider than the camera + camera.startFollow(player) +
   tileSprite/tilePositionX or per-layer scrollFactorX (far≈0.2, floor≈0.6, fg≈1.2).

3. **ZOOM OUT a bit.** Current view is too tight. Lower the camera zoom / raise the world-to-screen scale so MORE of
   the pit and more of the action fits on screen (more enemies visible, more breathing room). Re-balance with the
   warlock-height target (~28-36%) — zooming out may mean nudging actor scale so he stays in range.

4. **SUMMONS NEED THEIR OWN AI (port pit.js updDemons) — they still orbit the warlock.** Each summon must run an
   INDEPENDENT agent: pick the nearest live ENEMY, move toward it across the plane (NOT tethered to the warlock),
   FACE it (flipX toward target), and ATTACK on its own cooldown — succubus fireball, dragon breath, claw swipe,
   archer arrow, shambler melee. They should spread out and engage like the original's swarm, not hug the warlock.

5. **REAL SUCCUBUS FIREBALL (not a dot of light).** New art `art_in/fireball.png` (flying projectile) + `fireball_hit
   .png` (impact burst) are in gen_sprites. Wire the succubus attack as: cast pose → spawn fireball sprite that
   TRAVELS toward the target with a spin + flame-particle trail → on hit, play fireball_hit burst + damage. Tint the
   sprite GREEN for archsuccubus/demon-lord green fire. Make it read as a real anime fireball.

6. **WARLOCK SUMMON ANIMATION (his HEX already animates — match that quality).** New art `art_in/warlock_summon.png`
   (dramatic conjure pose) is in gen_sprites. Wire the SUM verb like HEX: swap to warlock_summon pose + a conjuring
   FX (magic circle / burst) + the creature materializes from the burst. No more frozen idle on summon.
ays; THE DOOR enemy
renders with its OWN door sprite (enemy-art parity working). Good leap.
STILL TO FIX:
1. CROWD BACKDROP MISSING. The 'people in the stands watching' (bg_pit_far amphitheater + spectators) is NOT visibly
   drawn behind the action — we mostly see floor/rubble. Draw bg_pit_far as the UPRIGHT back wall filling the top
   ~2/3 behind the actors (slow parallax). This is the #1 remaining DC-atmosphere gap Hiro called out.
2. WARLOCK A TOUCH SMALL — reads ~22-25% of screen height; bump toward the 28-36% target.
3. REMOVE THE DEV/STATUS TEXT OVERLAY from the play view (the milestone paragraph top-left) — debug noise on screen.
4. ADD `window.__AUDIT__` (warlockPctH/layers/fx) so the auditor auto-confirms #1 and #2 instead of 'unknown'.
HE WALL frontally blocks (heavy strikes break the guard for
2s; light strikes CLANG for 25% chip) — port pit.js:1187-1195 into the same `foeGuard` funnel. THEN the PYRE 3-spell
channel + mage-shield (pit.js:1620-1653).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: reach fight 1 / fight 6+ (THE GRAVE COUNT or THE COUNT'S
COMPANY). The Count now cycles a GUARD up (a `GUARD` popup, he slows): swing INTO that window and your hit is `PARRIED`
— he flashes gold, winds a `RIPOSTE`, and counters hard. Wait for his `!` open stance (or his jab) to land your hits.
A whiffed swing is now punishable — the first foe that reads YOUR timing.

## STATUS: 2026-06-27 23:01 UTC  — ★★ PRIORITY-2 FOE AI — THE GENERIC FOE BRAIN LANDED (foes now MOVE + FIGHT) ★★
ART INTAKE: `art_in/` has only already-ingested originals + `_*` previews (the 14 roster PNGs were moved to
`art_in/raw/` last run); nothing new to key/normalize. Skipped.
THE GAP I FOUND (bigger than the per-type-AI step the last STATUS named): there was **no foe AI at all** — the
roster sprites stood INERT. `updEnemies()` only ticked status/DoTs; nothing chased, telegraphed, or struck the
warlock. The only way a foe could hurt him was `foeShots` (which nothing spawned) or a summon's shove. So melee foes
were harmless statues. The real #1 brawler gap was the GENERIC brain, not per-type nuance.
CHANGED — added `updFoeAI(dt)` (a faithful port of pit.js `updEnemyVs:1580` helpers chase/beginAttack/
telegraphThenHit) + wired it into the sim chain at L1000 (status DoTs FIRST, then the brain). Every foe now:
(1) 2D-CHASES the warlock on the shallow plane (x AND y — up/down depth + left/right), sprite face flips horizontally;
(2) MELEE: approach -> `!` telegraph (`A.wind`) -> melee arc swing -> `hurtWarlock` with a 1.3-rad front-arc gate;
(3) RANGED (gunner/pyre): hold a standoff, `AIM` telegraph, fire a `foeShots` bolt down the lane (pyre = burning);
(4) STITCHER: mends the most-hurt ally (pink tracer) and keeps its distance instead of fighting;
(5) per-type FEEL via a `FOE_AI` table — door/chain/brute/champ/beast hit HEAVY + shake the screen, hounds lunge
    FAST, chain does a 2π ring sweep — and stunned foes (lich scythe / dragon gas) freeze. Damage scales by dmgScale.
VERIFIED via the Read tool on FRESH disk (bash served a TRUNCATED 1067-line copy ending mid-`load.image('gunner'` —
the documented FUSE stale-tail; bash `wc`/`node --check`/a diffing subagent all get garbage, as every prior run):
`updFoeAI` opens its `function` and closes `}` at L552 cleanly, all branches brace-balanced; the chain call sits at
L1000; the input handlers + Phaser boot tail are WHOLE past L1140. Build stays loadable; live `game/` untouched.
PARITY-COMPARE subagent SKIPPED (mount serves truncated bash → subagent reads garbage); inline note: FOE BEHAVIOR
parity jumps from MISSING -> PARTIAL — generic chase/telegraph/melee + ranged-shot + healer now PRESENT; the
per-type SIGNATURE verbs remain the gap (door guard-break-on-heavy, grave RIPOSTE stance, pyre 3-spell zone channel
+ mage-shield, master pack-RELEASE, gunner aim-line, champ/beast boss phases — pit.js:1602-1805).
NEXT STEP (single, priority-2/3): port the GRAVE COUNT **riposte stance** (pit.js:1655) — it parries a warlock swing
and counters — the most distinctive per-type verb and a readable next layer on the generic brain; then the DOOR
guard-break (heavy strikes break its block) and the PYRE 3-spell channel.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: the gauntlet foes are no longer statues — they WALK in
(closing depth + lane), wind up a red `!` then SWING (screen-shakes on the heavies like THE DOOR), and the gunner/
Pyre hang back and lob bolts at you. You can actually get HIT now and have to roll/portal. This is the first run the
brawler trades blows both ways.

## STATUS: 2026-06-27 22:0x UTC  — ★★ PRIORITY-0 ART INTAKE — 14 PIT-ROSTER FOE SPRITES INGESTED + WIRED ★★
ART INTAKE (priority-0): Hiro dropped a NEW batch in `art_in/` at 21:53–21:54 — 14 on-model side-on sprites, one per
pit.js `type` in the `FIGHTS[]` roster: **door, hook, chain, pyre, gunner, grave, stitch, brute, master, hound, necro,
champ, beast** + a generic **skel**. All were already green-keyed (corner alpha 0; <1% residual fringe), so they ran
straight through the build-side intake.
CHANGED — ingested + wired all 14 (each now a real challenger sprite instead of the shambler/bonearcher stand-in):
(1) `tools/ingest_art.py` TARGET_WORLD_H: added the 14 names, heights DERIVED from the original pit.js hitbox radii
    (warlock r~16 = 1.0): hound11→0.8, stitch13/hook14/gunner14→0.95, pyre15/necro15→1.0, grave16→1.05, master17→1.1,
    chain18→1.15, champ20→1.3, brute21→1.35, door26→1.5 (THE WALL), beast30→1.9 (BELLOW'S SECRET boss), skel→0.9.
(2) Ran intake (via a clean copy from the non-OneDrive outputs dir — the FUSE mount served a TRUNCATED ingest_art.py
    to bash, `SyntaxError` at L98, the documented stale-tail hazard): wrote `assets/sprites/<name>.png` + `<name>_n.png`
    (capped 512px + auto-Sobel normal) for all 14, archived the keyed sources to `assets/sprites/_src/`, and moved the
    `art_in/*.png` originals to `art_in/raw/` so the next run sees them as already-ingested.
(3) `arena.html`: added 14 `load.image(key,[diffuse,_n])` preload lines + the 14 height entries to `SPRITE_TARGET_H`,
    plus a `FOE_TYPES` set & `foeTexFor(type,ranged)` helper, and rerouted the 3 `spriteKey` assignments in
    `spawnFight` (main foes, the post-fight-3 stitch HEALER, the wildcard) from the `shambler`/`bonearcher` stand-ins
    to the foe's REAL type sprite. `buildSideOn`/`syncSideOn`/`syncFoeCrowd` already resolve `spriteKey`, guard with
    `textures.exists`, and scale by `SPRITE_TARGET_H[key]`, so every new key renders at its correct relative size
    (THE DOOR towers, the hounds are knee-high) with a safe fallback for any unmapped type.
VERIFIED via the Read tool on FRESH disk (bash again served a truncated arena.html tail — 78 423 B ending mid-line at
`if(this.textures.exists(foeKey` — so bash `node --check`/`wc` stay unusable, as every prior run): all edits re-read
intact — SPRITE_TARGET_H L86-94 has the 14 names; the 14 preload lines L954-966; `FOE_TYPES`+`foeTexFor` before
`foeKeyFor`; the 3 spriteKey reroutes in `spawnFight`; file TAIL WHOLE on disk — `new Phaser.Game({...})` L1719,
`</script>` L1725, `</html>` L1727 (1727 lines real). All 14 diffuse+normal+_src pairs co
## ★★★★★ ANIMATION METHOD LOCKED (2026-06-27, Hiro chose) — 2D SKELETAL / MESH-DEFORM RIG (the Dragon's Crown way)
Hiro picked the skeletal route over frame-by-frame. Build a parts-based rig that animates the EXISTING single
still per sprite — no external editor, no paid tools (no Spine/DragonBones project), procedural & in-engine, so it
reuses all art already in art_in/ and scales to every actor. This is exactly DC's jointed/Flash-like technique.

PIPELINE:
1. RIG DATA: `game3d/rigs/<name>.json` per sprite = bones (name, parent, pivot xy normalized to the sprite,
   rest-angle) + optional cut-regions for limbs that must move independently. Provide an AUTO-FIT that places a
   template skeleton from the sprite's bbox proportions so MOST sprites need zero hand-rigging; allow per-sprite
   overrides where auto-fit is wrong. Store rigs in git (small JSON).
2. BODY-PLAN TEMPLATES (shared skeletons):
   - BIPED (warlock + all transforms, succubi, and humanoid enemies: gunner/necro/skel/stitch/brute/champ/master/
     grave/hook/chain/pyre/shambler/bonearcher): hips->spine->head, shoulder.L/R->elbow->hand, hip.L/R->knee->foot.
   - QUADRUPED (hound, beast): spine->head + 4 legs (thigh->shin->foot).
   - WINGED/FLYER (bonedragon, blackdragon; succubus = biped+wings): spine->head, wing.L/R, tail.
   - STATIC-ish (door): minimal — slow sway + a lunge; no legs.
3. SKINNING: overlay a deform MESH on the sprite (Phaser Mesh/rope or a small custom bone-mesh); bones weight the
   verts so joints BEND smoothly (not rigid cardboard). Where limbs overlap badly, cut the region into its own mesh.
4. CLIPS — author ONCE as shared PARAMETRIC clips driven by the skeleton, so a single walk cycle animates every
   biped (same clip-sharing trick the old champions.js used). Every actor gets at minimum:
   idle (breath bob + weapon sway), walk-FORWARD, walk-BACKWARD (reverse + lean back), ATTACK (wind-up->swing->
   recover on the weapon arm + step-in), hurt (recoil). Warlock additionally: CAST/SUMMON (both arms raise +
   tome/staff flare) and per-verb swings (slash/heavy). Quadruped/flyer get template walk/flap/lunge.
5. DIRECTION via flipX; clips mirror. Y-sort with the shallow-plane depth.
6. AUDIT: set `window.__AUDIT__.anim = { hasClips:true, clips:[...], warlockSummonAnim:true }` so visual_audit.py
   verifies real animation exists (not a frozen still). The 'enemies just bump / no attack anim' complaint must
   show as resolved here.
ROLLOUT ORDER: WARLOCK FIRST end-to-end (idle/walkF/walkB/attack/cast+summon) to prove the rig + get Hiro's eyes on
it; THEN transformations, THEN summons (with their attack anims: succubus fireball cast, dragon breath, claw swipe),
THEN the 14 enemies via templates. Until a sprite is rigged, at least POSE-SWAP its available stills (feedback #8).
OPTIONAL ART LATER: if auto-rig looks stiff, gen a clean NEUTRAL SIDE-ON RIG POSE per actor (limbs separated, weapon
held away from body) to slice from — add a 'rigpose' batch to gen_sprites.py then. Not required to start.
al mesh-deform rig vs frame-by-frame AI sheets vs hybrid). Once
chosen, fill the pipeline here. DC's own method is skeletal/jointed (parts-based), reusing one painted still.
mented STALE/TRUNCATED tail AGAIN — `wc` over the FUSE copy reported
1134 lines ending mid-line on a bare `/` with no `</script>`/`</html>`, so `node --check` over bash is unusable, as
every prior run): all edits re-read on FRESH disk and brace-balanced — `lichSlash` opens L437/closes L457 between
`devilStrike` and the FX shims; `enterLich` L529-539 + `exitLich` L540-545 complete between `exitDevil` and
`enterDemonLord`; the `doSlash` guard L378 + the **B** key L883 + the `updateLabels` lich branch all intact; file TAIL
WHOLE on disk — `new Phaser.Game({...})` boots L1433, `</script>` L1439, `</html>` L1441 (1441 lines real). Build
stays loadable; live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount actively serves truncated bash reads → a diffing subagent gets garbage);
checklist updated in-process: LICH transformation MISSING → PARTIAL (SCYTHE verb + minimal form-body + transform beat
land; K→FADE reroute + the death→rise→phylactery pipeline + unkillable-while-dragon remain the gap).
NEXT STEP (single, priority-6 cont.): reroute the lich's **K** (PARRY) to `fade()` (pit.js:991 — 5s untargetable,
10s on the binder road) when `P.lich`, so the reaper's defensive verb also 
## ★★★★ HIRO FEEDBACK #7 (2026-06-27) — PRIORITY-0 COMPOSITION/SCALE BUGS (from a live screenshot)
The pit renders but the framing is broken. Fix these BEFORE any new feature — they make the game look wrong:

1. **CANVAS MUST FILL THE VIEWPORT.** Right now the play field only covers the right ~half of the window; the
   left half is black and the dev HUD floats over dead space. Phaser Scale config is wrong. Use
   `scale:{ mode: Phaser.Scale.RESIZE (or FIT), parent, width: window.innerWidth, height: window.innerHeight,
   autoCenter: CENTER_BOTH }`, canvas CSS `width:100vw;height:100vh;display:block`, and re-anchor the HUD over the
   play field (player panel top-LEFT, foe panel top-RIGHT) — not over black.

2. **CAMERA ZOOM IS TOO HIGH + CHARACTERS TOO SMALL.** Dragon's Crown heroes fill ~⅓ of the screen height; ours
   is ~15%. Scale the ACTORS UP so the warlock stands ~32-38% of screen height, foes proportional, and zoom the
   camera OUT so the whole pit band is visible. Calibrate so a single floor flagstone reads ~⅓ a character's
   height — NOT equal. The actors are the big focal elements; the backdrop recedes.

3. **LAYER THE BACKDROP CORRECTLY (3 planes), don't use the floor as the whole scene.**
   - `bg_pit_far`  = UPRIGHT backdrop wall behind the action (amphitheater + crowd in the stands + god-rays). Fills
     the top ~⅔, slow parallax. THIS is the "people in the stands watching" layer — make sure it's actually shown.
   - `bg_pit_floor`= the GROUND band in the lower ~⅓ only, scaled DOWN so its tiles/detail are smaller than actors.
     Its baked-in torch is too dominant — keep the floor subordinate; the real torches come from `bg_pit_far` +
     the Light2D brazier lights, not the floor texture.
   - `bg_pit_fg`   = keyed pillars/braziers at the L/R edges, fast parallax, drawn OVER the actors.
   Result wanted: crowd-lined amphitheater wall up top, actors large on a ground band, pillars framing the edges.

NOTE: if `bg_pit_floor`'s baked torch keeps fighting the composition, Hiro can regenerate it as a plainer ground
texture (no dominant torch) — flag it. Acceptance: full-screen, warlock ~⅓ tall, crowd visible behind, tiles small.

## 🚨 BLOCKING (2026-06-27) — DRAGON'S CROWN PARITY GATE (build must satisfy; playtest-bughunt now lints these every 4 min)
These are no longer "nice to have." The `playtest-bughunt` agent now runs a static DC-PARITY LINT on arena.html
every 4 minutes and FAILS on each violation below. game3d-build: clear ALL of these before any further feature/feel polish.
DRAGON'S CROWN GOLD-STANDARD NUMBERS (use these as the target when unsure how it should look):
  • CANVAS fills 100% of the viewport (no black margins). Phaser Scale.RESIZE/FIT bound to window size. [from the
    screenshot it filled ~50% width — P1.]
  • WARLOCK height ≈ 28-36% of SCREEN height (DC heroes are large). [screenshot ≈15% — too small — P1.]
  • FLOOR flagstone ≈ 1/3 of a character's height, NOT equal. [screenshot ≈1:1 — backdrop too big rel. to actors — P1.]
  • BACKDROP = 3 layers all visible: bg_pit_far (crowd-lined amphitheater) BEHIND + bg_pit_floor (ground band, lower
    1/3) + bg_pit_fg (edge pillars, over). [screenshot showed only the floor; the CROWD must be visible — P1.]
  • TOUCH CONTROLS present: #stickBase/#stickNub virtual stick (touchstick.js) + on-screen .btn verbs
    (Attack/Dodge/Special/Summon/Hex/Transform). Hiro has asked 3×. [still absent — P1.]
  • LIGHTING: Light2D flickering brazier lights + Bloom + Vignette + ember particles. [P2.]
is devil reroute (pit.js:308 →
lichSlash). THEN the real `pit.js FIGHTS[]` roster port (M4) to replace the 2 placeholder foes.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: press **V** to force ARCH DEVIL, then press **J** — the
warlock now ROLLS in and CARVES the foe (red arc + "n CLAW") instead of throwing a hex; press **Q** to BITE (and if a
succubus assist is in lane, the bite ASCENDS her instead). Revert and J/Q go back to HEX/SUMMON.

## STATUS: 2026-06-27 18:54 UTC  — ★★ #6 POLISH — TRANSFORM BEAT: A MORPH FLASH + SPARK BURST WHEN THE WARLOCK SWAPS FORM ★★
ART INTAKE (priority-0): checked `art_in/` — `find -newermt 16:00` returns NOTHING; every PNG is an OLD 05:2x–05:39
source drop already ingested 15:35 into `assets/sprites/` (28 diffuse+normal pairs) + the `_preview_*`/`_*summons`
vibe PNGs; `art_in/raw/` is the keyed archive. Nothing new dropped → nothing to ingest.
RECONCILED DOC vs CODE (the recurring pattern): the 18:23 form-body driver (warlock → arch-devil/lich/demon-lord
texture swap) is PRESENT and complete in `arena.html` — the render loop swaps `setTexture(heroFormTex())` each frame
(L1138–1151) and applies the form tints (L1154–1157). So priority-6's core transform-to-side-on was done; the swap
was just an INSTANT texture pop with no transformation beat. This run added the beat.
CHANGED — one small, safe priority-6 polish (render-only; no sim/combat/targeting touch):
(1) NEW scene method `formMorphBurst(ft)` (right after `finisherBurst`, L969): on a form change it pops an expanding
    ADD-blend shock RING + a 16-spark rising column on the warlock, tinted by form (arch devil red #ff5a5a / lich
    cyan #8ad8ff / demon lord green #9affc0 / revert white), a brief `setTintFill` body flash, a 1.10× scale yoyo,
    and a small `S.shake`. Self-destructing tweens on Phaser's clock; reuses the `glow` texture + `rnd`.
(2) GLUE in the form-swap b
## ★★★ HIRO FEEDBACK #6 (2026-06-27) — THE PIT MUST LOOK LIKE DRAGON'S CROWN (atmospheric backdrop + lighting)
The arena is currently an EMPTY stage — biggest remaining parity gap vs DC. Hiro's vision: torch-lit pit, a
CROWD in the stands watching the fight, banners, braziers, haze, god-rays. DC's atmosphere is ~80% PAINTED INTO
THE ART and ~20% live FX — build it that way, do NOT try to compute it all in real time.

**(A) BACKDROP ART — 3 parallax layers (now in gen_sprites.py, Hiro generates locally):**
  - `art_in/bg_pit_far.png`   — full-bleed painted backdrop: amphitheater walls, SPECTATORS on the rim watching,
    banners, braziers, god-ray shafts, depth fog. (This image carries most of the lighting — bake it in.)
  - `art_in/bg_pit_floor.png` — painted bloodstained sand/flagstone floor, the playable ground band.
  - `art_in/bg_pit_fg.png`    — keyed foreground: stone pillars + chains + braziers at the L/R edges, for depth.
  INGEST as layers: far (slow parallax) -> floor (ground) -> ACTORS (y-sorted) -> fg (fast parallax, drawn over).

**(B) LIVE LIGHTING / FX recipe — what the engine adds on top (all Phaser-native, ~90% of the DC feel):**
  1. Light2D point-lights on the braziers/torches (warm, FLICKERING) using the normal maps the build already
     makes — they must play across the warlock + enemies as they move.
  2. Post-FX: BLOOM + VIGNETTE + a warm ColorMatrix grade (Phaser 3.60+ built-in FX) on the main camera.
  3. Animated GOD-RAY shafts = additive-blend light-shaft sprites over bg_pit_far, slow opacity pulse + drift.
  4. PARTICLES: drifting embers rising from braziers, dust motes in the light shafts, smoke haze, hit-sparks.
  5. CROWD life: the painted spectators get subtle motion — a cheap horizontal sway/parallax + a roar brightness
     pulse + a dust-puff burst on each kill, so the stands feel like they're reacting to the fight.
  Acceptance: side-by-side vs a Dragon's Crown pit screenshot, aim ~90%. If the pit still reads "empty/flat",
  the backdrop art or the brazier Light2D/bloom isn't doing its job — fix that before any other polish.
8 diffuse+normal pairs) + the `_preview_*`/`_*summons` vibe PNGs; `art_in/raw/` is the keyed
archive. NOTHING new dropped → nothing to ingest.
RECONCILED DOC vs CODE: bash served the STALE tail AGAIN (`wc` reported 1142–1145 lines ending mid enemy-draw block,
no `</html>`) AND served a stale PLAN tail — the truncated `tail` showed 17:55 as newest, but `grep` revealed the real
newest was 18:23 (#6 transformations) + 18:08 (#5 dart-across). So the assist dart on disk was the 18:08 FREE-SINE
version. Its own open item (flagged in 17:55 + the parity sheet) was: SYNC the dart to the actual damage tick. Picked
that gap this run — small, well-scoped, render+sim-flag only — leaving the larger 18:23 devil-verbs/roster work intact.
CHANGED — the summon ASSIST dart is no longer a free clock; it now fires off each summon's REAL sim attack so the
lunge + strike-spark peak WITH the damage (sim combat math untouched — only a render-only timer added):
(1) NEW per-demon timer `d._atkPulse`, set to 0.30s at each OFFENSIVE attack site in `updDemons`: brute SHOVE (L550),
    bone/black dragon BREATH (L565), black-dragon FIREBALL (L570), succubus FIRE-BOLT (L586, the `else if(tgt)` branch
    ONLY — the MEND branch never sets it, so a healing succubus just rests in lane). Decayed once/frame at L541
    (`if(d._atkPulse>0) d._atkPulse-=dt;`). Nothing reads it except the render → targeting/DoT/damage are 1:1 unchanged.
(2) RENDER (L1175): replaced the `Math.pow(sin(now/430+slot*1.9),6)` free dart with a pulse-driven strike arc
    `lunge = d._atkPulse>0 ? sin((1 - d._atkPulse/0.30)*PI) : 0` (0→1→0, peaks ~0.15s after the hit; rests at 0 between
    attacks). NEW `reach` factor (L1176): melee claw fiend crosses fully (1.0), ranged dragon/succubus surge partway
    (0.55) so casters don't teleport onto the foe. The existing strike-spark gate (`lunge>0.85`, `_lungeHot`) now fires
    once per REAL attack, and the spark lands on the foe in time with the damage.
VERIFIED via the Read tool (fresh disk; bash unusable — OneDrive FUSE truncation): all 6 edits re-read and brace-
balanced — `_atkPulse` decay L541, the 4 attack-site sets L550/L565/L570/L586 (each appended after the existing `{`
opener, no braces added/removed), render lunge/reach L1175–1180 inside the `if(SIDEON)` body, spark gate L1183–1188
intact, restore `d.x=_oxs` at the end of the demon body still present. Build stays loadable; live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount actively serves truncated bash reads → a diffing subagent gets garbage);
checklist updated in-process: Summons-as-assists PARTIAL → dart now attack-synced (placement/facing/strike-dart/
damage-sync present); the per-lane HP-bar tidy (small bar UNDER each lane sprite, replacing the floating top bars)
is the one remaining assist-polish item.
NEXT STEP (single): tidy the assist HP-bar — gate the 3 per-type top HP-bar `fillRect` pairs with `if(!SIDEON)` and
draw one small unified bar UNDER each lane sprite. THEN resume the 18:23 priority-6 line: reroute the DEVIL VERBS
(devilClaw/devilStrike CLAW/BITE), then the real `pit.js FIGHTS[]` roster port (M4).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: summon the coven / claw fiend / dragon, then watch the
assists REST in their left lane and LUNGE forward to strike (with a spark on the foe) exactly when each summon actually
hits — melee crossing all the way, casters surging partway. A mending succubus stays put and beams the warlock.

## STATUS: 2026-06-27 18:23 UTC  — ★★ #6 TRANSFORMATIONS — WARLOCK NOW SWAPS TO THE ARCH-DEVIL SPRITE (form-body driver) ★★
ART INTAKE (priority-0): checked `art_in/` — every PNG is an OLD 05:2x–05:39 source drop, already ingested 15:35
into `assets/sprites/` (28 diffuse+normal pairs) + the `_preview_*`/`_*summons` vibe PNGs; `art_in/raw/` is the keyed
archive. NOTHING new dropped → nothing to ingest.
RECONCILED DOC vs CODE: the 18:08 NEXT STEP (priority-6) wanted the HEX-FIEND warlock to visibly SWAP to the side-on
devil SPRITE. Found the gap precisely: the render loop's `heroKey` (L1108) ALREADY picks `archdevil/lich/demonlord`
by form — but it only fed the SCALE (`heroWorldH`) and a red/green TINT (L1124–1125); it NEVER called `setTexture`,
so the displayed body stayed `warlock` (idle still). `enterDevil/devilDur/exitDevil/archDevilOutro` were already
ported (L434–492) and the `archdevil/lich/demonlord` textures already preloaded (L723–725). So the only missing piece
was the actual texture swap.
CHANGED — one small, safe priority-6 increment (the form-body driver, covers arch devil + lich + demon lord at once):
(1) NEW free fn `heroFormTex()` (after `formHP`, L190): returns the LOADED TEXTURE KEY for the warlock's current body
    — `demonLord ? 'demonlord' : devilT>0 ? 'archdevil' : lich ? 'lich' : 'warlock'` (note: texture key 'warlock',
    distinct from the SPRITE_TARGET_H scale key 'warlock_idle').
(2) RENDER LOOP (after the hero `setScale`, L1110–1120): re-assert the form texture each frame — `if(!this._castTimer){
    const ft=heroFormTex(); if(textures.exists(ft) && this.hero.texture.key!==ft){ anims.stop(); setTexture(ft);
    if(ft==='warlock' && anims.exists('warlock_idle')) play('warlock_idle'); } }`. Re-asserting every frame (vs
    once-on-change) means it self-heals after a cast-pose revert or any form flip; guarded on `!_castTimer` so the
    0.35s HEX cast pose still owns the sprite during the cast, and only swaps when the key actually differs (no churn).
(3) `castPose()` revert (L1024): the post-cast revert was hard-coded to `'warlock'` → it would snap a devil/lich back
    to the plain warlock after every hex. Now reverts to `heroFormTex()` (falling back to `warlock`/`warlock_f0` if the
    form texture is missing). So casting mid-transformation keeps the borrowed body.
DEBUG: `V` already forces ARCH DEVIL (L804) → press it and the warlock should now BECOME the devil sprite (bigger,
hellfire-red rim) for ~15–31s, cast a HEX and stay a devil, then revert to the warlock when the timer expires.
VERIFIED via the Read tool (bash served the documented STALE/TRUNCATED tail again — `wc` reported 1145 lines ending
mid enemy-draw block, no `</html>` → `node --check` over bash unusable): all 3 edits re-read on fresh disk and are
balanced — `heroFormTex` complete at L190, the form-swap block L1110–1120 brace-balanced inside `update()`, the
`castPose` revert intact L1024–1027; the file TAIL is WHOLE (`class Arena` closes L1304, `new Phaser.Game({...})`
L1306–1311, `</html>` L1314). Build stays loadable; live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount actively serves truncated bash reads → a diffing subagent gets garbage);
checklist updated in-process: ARCH DEVIL transformation MISSING → PARTIAL (form-body sprite swap landed; covers
LICH/DEMON LORD bodies too).
NEXT STEP (single, priority-6 cont.): reroute the DEVIL VERBS — devilClaw/devilStrike (CLAW/BITE) so the arch devil's
attacks differ from the warlock's HEX/SUMMON (`updateLabels` already shows the form name; the verb BODIES still cast
the warlock kit). THEN the real `pit.js FIGHTS[]` roster port (M4) to replace the 2 placeholder foes.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: press **V** to force ARCH DEVIL (or reach lvl 8 + the
HERALD road) and the warlock should visibly TRANSFORM into the side-on arch-devil sprite — bigger, red rim — fight as
the devil, then revert to the warlock when the pact ends. (Devil-specific CLAW/BITE verbs are the next increment
## ★★★ HIRO FEEDBACK #5 (2026-06-27) — ENEMY ART PARITY + TOUCH CONTROLS
**(A) ENEMY ART — 1:1 with the original pit.** Right now enemies reuse WARLOCK assets — wrong. The original
`game/src/combat/pit.js` FIGHTS roster has these 14 enemy TYPES; every wave foe must use its OWN sprite:
  door, hook, chain, pyre, grave, hound, master, gunner, necro, skel, stitch, brute, champ, beast.
These are now in `game3d/tools/gen_sprites.py` MANIFEST (side-on, facing LEFT, DC-style). Hiro runs the generator
LOCALLY; on the next build, INGEST `art_in/{type}.png` for each and map the pit.js enemy `type` -> its sprite
(stop falling back to warlock art). Scale-normalize per type (hound/beast low+wide, door tall, gunner human).

**(B) TOUCH CONTROLS — restore the original's mobile parity.** arena.html is keyboard-only; the original had full
on-screen touch controls and Hiro misses them. Port them 1:1 from the original:
  - VIRTUAL STICK = `game/src/core/touchstick.js` (DOM #stickBase/#stickNub; touch left ~55% of screen + drag;
    desktop mouse unaffected; normalizes Phaser TouchEvents/changedTouches for all phones). Reuse it as-is.
  - ON-SCREEN ACTION BUTTONS (`.btn`, right side) for every verb: Attack, Dodge/Roll, Special, Summon, Hex,
    and the Transform/super trigger — each fires the same handler as its key. Keep keyboard AND touch both live.
  - The stick drives the new SHALLOW-PLANE movement (left/right + up/down depth), not a 1-axis lane.
72`). Fixed in the `if(SIDEON)` block (≈L1149):
(1) The dart now interpolates ACROSS to the foe: `restX=P.x-52-slot*30`, `foeX=(this._foeHomeX||W*0.72)-36`,
    `d.x=restX+lunge*max(0,foeX-restX)` — so at full lunge each assist crosses to just shy of the current foe, then
    snaps back to its left-lane slot (a true GG assist-strike read; per-slot phase keeps them staggered).
(2) STRIKE SPARK: when an assist's `lunge>0.85` (gated once-per-dart by a new `d._lungeHot`, reset when `lunge<0.4`)
    a 6-spark `glow` ADD-blend burst pops at the foe, tinted per summon type (dragon green #7fd05a / succubus pink
    #f06aa0 / claw-fiend red #ff6a7a). Self-destructing tweens; rides Phaser's clock. No foe-tint touch (syncSideOn
    already owns the foe tint each frame — avoided a fight over it).
VERIFIED via the Read tool: edit intact + balanced at L1149–1164 (8 lines added); the demon loop continues normally
(`lifeFrac` L1165, texKey L1167) and the file TAIL is whole (evo-UI build continues, class/`new Phaser.Game`/`</html>`
present). `rnd`/`glow`/`P`/`currentFoe` are pre-existing globals. As every prior run, BASH SERVED THE STALE/TRUNCATED
TAIL (`wc` reported 1146 lines ending mid-comment, no `</html>`) → `node --check` over bash unusable; trusted the Read
tool, which is authoritative on the fresh disk. Live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount actively serving truncated bash reads → a diffing subagent gets garbage);
checklist note: Summons-as-side-on-assists → PRESENT (assist lane + dart-to-foe + strike spark).
NEXT STEP (single, priority-6): begin porting TRANSFORMATIONS to the side-on framing — start with ARCH DEVIL
(`enterDevil`/`devilDur`/`exitDevil` already ported into `arena.html`; the `archdevil` sprite is ingested) so a HEX
FIEND warlock visibly SWAPS to the side-on devil sprite (left anchor, facing right) for its duration, then reverts.
After transforms: the real pit.js FIGHTS[] roster port (M4) to replace the 2 placeholder foes.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: summon (Q) the claw fiend / dragon / coven and watch
each assist now DASH from the warlock's left ACROSS to the current foe on its strike beat, popping a colored spark on
the foe, then snap back to formation — instead of only bobbing on the left.

## STATUS: 2026-06-27 17:36 UTC  — ★★ #4 POLISH — HIT-STOP / SLOW-MO + FINISHER PARTICLE BURST ON THE KILL ★★
ART INTAKE (priority-0): checked `art_in/` — every PNG there is an OLD 05:2x–05:39 source drop (already ingested
15:35 into `assets/sprites/` as 28 diffuse+normal pairs) + the `_preview_*`/`_*summons` vibe PNGs; `art_in/raw/` is
the keyed archive. NOTHING new dropped → nothing to ingest.
CHANGED — executed the single NEXT STEP from 17:24: polished the between-fights whirl into a true GG "next
opponent" beat (priority-4 cont.). Two things were missing: the kill had no WEIGHT (no hit-stop/slow-mo) and the
slain body just alpha-collapsed (no finisher pop). The vestigial `S.hitPause`/`S.slow` fields existed in `S` since
the pit.js shape but were NEVER consumed anywhere. Wired them up + added the burst:
(1) `update()` (~L1078) now derives a SCALED `dt` from the real frame delta `rdt`: `if(S.hitPause>0)` ⇒ `dt=0`
    (full sim FREEZE) and decay hitPause by `rdt`; `else if(S.slow>0)` ⇒ `dt=rdt*0.35` (slow-mo) and decay slow by
    `rdt`. Both tick in REAL time so a freeze can never get stuck; `frame(dt)` + `this.dt` (foeAI) consume the
    scaled value. Camera shake/tweens ride Phaser's own clock → the whirl still plays OVER the frozen
## ★★★ HIRO FEEDBACK — first side-on look (2026-06-27). Make it play like a fighting game, not top-down.
GOOD (keep): art loads + scaled right; hex has a cast anim; background audience lineup reads well.
FIX, in priority order — these are the "fighting-game feel" layer:
1. **LOCK TO A 2D PLANE.** Movement is currently free 2D (can drift UP/DOWN the screen). In a GG/Street-Fighter
   fighter you only move LEFT/RIGHT on a ground line. Remove vertical/depth ground movement: WASD/arrows = left/
   right only (map UP to a JUMP if desired, DOWN to crouch/block later). Warlock + opponent share one horizontal line.
2. **PROJECTILES FIRE STRAIGHT, not at the cursor.** The hex bolt currently flies wherever you click. It must
   travel HORIZONTALLY in the facing direction toward the opponent — a Ryu hadouken. Kill mouse-aim for all
   ranged attacks (hex, summon fireballs, breath); aim = facing. Facing = the side the opponent is on; flip the
   sprite when they cross.
3. **ANIMATE via the pose sprites + procedural motion.** Right now 
## ⚡⚡⚡ STOP — DIRECTION OVERRIDE (Hiro, read BEFORE resuming) — 2026-06-27 late
The build has been polishing the OLD 1v1 Guilty-Gear version (hit-stop, camera-whirl, two-fighter HUD, assist-
dart). THAT DIRECTION IS DEAD. Hiro chose a DRAGON'S CROWN BEAT-EM-UP (see "★★★★★ COMBAT MODEL"). STOP all 1v1
polish. Your IMMEDIATE next steps, in this order — do the FIRST one this run:
1. MOVEMENT -> SHALLOW 2.5D PLANE: WASD/arrows move LEFT/RIGHT *and* UP/DOWN within a depth band; y = depth
   (up = back = drawn smaller, y-sorted). REMOVE the strict-1D plane lock and the 1v1 lane.
2. CAMERA -> Dragon's Crown FOLLOW-CAM: follow the player, frame player + nearby foes, zoom with the brawl spread.
   REMOVE the two-fighter framing + the camera-whirl-to-next-opponent.
3. ENEMIES -> WAVES: spawn MULTIPLE foes at once filling the pit (per pit.js FIGHTS as waves), crowd on the rim.
   REMOVE the one-opponent-at-a-time duel + the "FIGHT n/21" two-fighter HUD (replace with DC HUD: player HP/MP/
   LEVEL + enemy HP bars over mobs + combo counter).
4. SUMMONS -> INDEPENDENT ALLIES with ATTACKS (port pit.js updDemons): succubus fireball, dragon breath, claw-
   fiend swipe, archer arrow, shambler melee — each seeks/faces foes on its own cooldown, not glued to the warlock.
Keep the GOOD parts (hit-stop, sparks, finisher burst, pose-swap anim) — they apply to the brawler too. But the
SHAPE must become the brawler NOW. Update STATUS to reflect the pivot, not more 1v1 polish.
new → skip.
CONTEXT: fix #5 had TWO halves. Half A (assist strike-dart LUNGE synced to the real attack) was ALREADY in place —
`updDemons()` sets `d._atkPulse=0.30` on every real attack (claw shove L645, dragon breath L660, black-dragon
fireball L665/666, succubus fire bolt L682) and the render loop (L1358–1370) reads it into a 0→1→0 strike arc +
family-tinted spark. So this run executed Half B only: make the RANGED bolts/breath fire STRAIGHT down the lane.
CHANGED — `arena.html` `updDemons()` (render-only direction fix, no stat/dmg change):
(1) BONE/BLACK DRAGON breath (L660–664): the cone FX + paralytic gas-zone placement used `d.face` (= `ang(d,tgt)`,
    diagonal up at the HOVERING dragon's target). New `const _bf=SIDEON?(tgt.x>=d.x?0:Math.PI):d.face` → breath now
    blows HORIZONTALLY toward the foe (cos=±1, sin=0); gas drops on the lane, not floating off-axis.
(2) BLACK DRAGON exploding fireball (L666): `fa` now `SIDEON?(tgt.x>=d.x?0:Math.PI):ang(d,tgt)` → `vy=sin(fa)*430=0`,
    so the green bomb travels flat down the lane (hadouken read) instead of arcing toward the elevated tgt.
(3) COVEN succubus fire bolt (L684): new `const _ff=SIDEON?(tgt.x>=d.x?0:Math.PI):d.face`; `vx=cos(_ff)*360, vy=sin
    (_ff)*360=0` → fire bolt flies STRAIGHT, matching the warlock's hex and the dragon's. Non-SIDEON path preserved
    in every `else`. Mirrors fix #1's warlock-facing lock + fix #2's straight hex.
VERIFIED: the full `updDemons()` (with the 3 edits) extracted + `node --check`'d in isolation with stubbed deps →
parses clean. All 3 edit regions read back balanced via the Read tool. File tail intact via Read — `new Phaser.Game`
(L1500) + `</script></body></html>` (L1506–1508), disk = 1509 lines whole. NOTE: bash again served a TRUNCATED
78203-byte tail (cut mid-line at `setAlpha(0)`, no `</script>`) — the known OneDrive FUSE hazard; trusted Read +
isolated node-check, NOT bash cat. Live `game/` untouched; game3d NOT published. PARITY-COMPARE subagent SKIPPED
(bash reads truncated → a diffing subagent reads a half-file; Read/Edit verified fine, only bash *reads* are stale).
NEXT STEP (single): fix #5 epilogue / fix-list cleanup — the dragon's APPROACH/RETREAT movement (L658–659) still
uses 2D `d.face`, letting it drift vertically off the ground line; lock dragon + succubus orbit to the SIDEON plane
(pin assist y to a hover band above the ground line) so the whole cast shares one lane. THEN the CLEANUP task:
retire the abandoned low-poly 3D scaffold (pit.html / index.html / city.html / champions.js / assets/*.glb).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: summon the coven/dragons and their fire bolts, green
bombs, and acid breath now fire FLAT down the lane like the warlock's hex (no more diagonal lobs), each synced to a
strike-dart lunge.

## STATUS: 2026-06-27 20:11 UTC  — ★★ HIRO FEEDBACK PASS #4 — SUMMON CHANNEL BUILD-UP + SPAWN BURST (fix #4) ★★
ART INTAKE (priority-0): checked `art_in/` — all PNGs are the OLD 05:2x–05:39 source drop, already ingested 15:35
into `assets/sprites/` (28 diffuse+normal pairs; `art_in/raw/` = keyed archive; `_src/` = source dump). NOTHING new → skip.
CHANGED — `arena.html`, fix #4 (give the summon a deliberate cast→materialise read; all FX render-only, no new art):
(1) NEW scene method `channelBeat()` (~L1098): fired by `startChannel()` the instant the press auto-channel begins —
a violet caster glow swell + 14 power motes PULLED INWARD onto the warlock (the "gather" build-up). This also FIXES
a latent crash: `startChannel()` called `scene.fxChannelStart()` which was NEVER defined (TypeError on every summon);
re-pointed that call at `channelBeat()`.
(2) NEW scene method `spawnBurst(x,y,col)` (~L1116): a flat expanding GROUND RUNE (squished ellipse) at the creature's
feet + a vertical white materialise-flash + radial spark motes, tinted to the family. Modelled on `formMorphBurst`/
`finisherBurst` (rides Phaser's clock, self-destructing tweens, +2.0 shake).
(3) WIRED `spawnBurst` into all three rungs of `summonDemons()` (~L597–624): CLAW FIEND violet `0xb070f0` (per spawn in
the count-mult loop), BONE/BLACK DRAGON `0x7fd05a`/binder `0x9aff70`, COVEN succubi pink `0xf06aa0` (per succubus).
Refactored spawn coords into `_bx/_by`, `_sx/_sy` locals so the burst fires at the EXACT push position.
VERIFIED: new methods syntax-checked in isolation via `node --check` (wrapped dummy class) → OK; the channelBeat outer
tween-config object had a missing `}` on first write (caught by node --check on the partial bash copy), FIXED + re-checked.
Edited regions read back balanced via the Read tool (authoritative). File tail intact via Read — `new Phaser.Game`
(L1498) + `</html>` (L1506). NOTE: bash served a TRUNCATED 1113-line copy (cut at the new spawnBurst block; disk is
1507 via Read) — the known OneDrive FUSE hazard; trusted Read + isolated node-check, not bash cat. Live `game/`
untouched; game3d NOT published. PARITY-COMPARE subagent SKIPPED (bash reads truncated → a diffing subagent reads a
half-file; same rationale as prior runs — Read/Edit verified fine, only bash *reads* are stale).
NEXT STEP (single, fix #5): SUMMON ATTACK LUNGES + STRAIGHT PROJECTILES — give each assist a synced strike-dart on its
real attack (the `d._atkPulse` driver already exists at L631/640/655/660/676) and make the dragon/succubus bolts fire
STRAIGHT down the lane (cos=±1 facing) for side-on readability, matching the warlock's hex.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: hold SUMMON and the warlock now GATHERS power (inward
motes + glow), then each creature ERUPTS from a ground rune with a light-flash + sparks instead of just popping in.

## STATUS: 2026-06-27 19:52 UTC  — ★★ HIRO FEEDBACK PASS #3 — STATE-DRIVEN WARLOCK ANIMATION (fix #3) ★★
ART INTAKE (priority-0): checked `art_in/` — all PNGs are the OLD 05:2x–05:39 source drop, already ingested
15:35 into `assets/sprites/` (28 diffuse+normal pairs). `art_in/raw/` is the keyed archive. NOTHING new → skip.
CHANGED — `arena.html`, fix #3 (animate the warlock BY STATE; all four pose sprites already ingested, no new art):
(1) `frame()` (~L789): new `P.moving` flag — set false each tick, true when the warlock actually walks (SIDEON
lane walk `if(mx&&rollT<=0)`, and the non-SIDEON free-move branch). Drives the pose swap + walk bounce.
(2) Render loop (~L1238): split FORM IDENTITY from POSE. `baseForm=heroFormTex()`; when base warlock, the texture
is chosen by STATE — `P.flash>0 → warlock_hurt`, else `P.moving → warlock_walk`, else `warlock` (idle). Lich/
archdevil/demonlord keep their single body. CAST pose still owned by `castPose` (the `_castTimer` guard wraps it).
(3) TRANSFORM BEAT fix: `formMorphBurst` now fires on **baseForm** change only (warlock→lich/devil/lord) — moved
OUT of the texture-swap `if`, so idle↔walk↔hurt pose swaps NO LONGER trigger a spurious morph flash every step.
(4) Procedural JUICE (~L1258): visual-only y-offset — brisk WALK BOUNCE (`-|sin(t·11)|·6`) while `P.moving`,
gentle BREATHING bob (`sin(t·2.2)·2`) at idle; transformed forms get a slow `sin(t·1.8)·1.5` breath. `P.y` stays
pinned to the ground line and the shadow stays flat (shadow.y untouched).
VERIFIED via the Read tool (authoritative — BASH SERVED A TRUNCATED TAIL AGAIN: reported len 78207 / no </html>;
the disk file via Read continues whole through `new Phaser.Game` (L1453) + `</html>` (L1461)). All 3 edit regions
read back balanced. Live `game/` untouched; game3d not published. PARITY-COMPARE subagent SKIPPED (bash reads
truncated → a diffing subagent gets garbage; Read/Edit verified fine, only bash *reads* are stale).
NEXT STEP (single, fix #4): SUMMON CHANNEL + SPAWN BURST — on a summon, play a brief channel build-up (the cast
beat + `channelRing` already exist) then a SPAWN BURST (ground rune + flash) where the creature appears. Then
fix #5 (summon attack lunges + straight projectiles).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: the warlock now visibly WALKS (walk sprite + bounce)
when you move, BREATHES while idle, snaps to the HURT pose when a foe connects,
## ★★★ HIRO FEEDBACK #4 (2026-06-27) — toward Dragon's Crown ANIMATION quality
GOOD: warlock state animation reads better. STILL MISSING vs DC:
1) SUMMONS ACT INDEPENDENTLY + ATTACK (mostly CODE/FX — DO FIRST, quick win, restores the swarm). They are glued
   to the warlock. Give each its OWN AI (seek/face nearest enemy, attack on its own cooldown, reposition) + its
   ATTACK + EFFECT, porting the pit.js demon behaviors (summonDemons / updDemons):
   - SUCCUBUS / ARCH SUCCUBUS -> hurl a FIREBALL (arch = bigger GREEN sheol) with a cast motion + impact burst.
   - CLAW FIEND -> lunge + CLAW-SWIPE arc + impact flash.
   - BONE DRAGON -> green ACID BREATH cone (gas DoT); BLACK DRAGON -> green FIRE breath + exploding fireball; + bite.
   - SHAMBLER -> melee swipe (infection); BONE ARCHER -> straight ARROW shot.
   Projectiles/FX can land NOW with the current sprites; motion polish comes with the rig (below).
2) DC-QUALITY ANIMATION needs a 2D SKELETAL RIG — single-frame pose-swap can't do smooth steps / back-walk / jump.
   THE DC WAY: animate the illustrated sprite with BONES. Two viable techniques for AI-gen single illustrations:
   (a) MESH-DEFORM rig (Live2D/Spine-mesh style): overlay a deformable mesh + bones on the existing PNG and warp
       it — best fit since our sprites aren't drawn in separable layers; or (b) CUT-OUT: slice the sprite into
       part-rects (head/torso/upper+lower arm/hand/staff/upper+lower leg/robe/wings) and rotate at joints.
   Pick one (mesh-deform preferred) and build a small rig system. It unlocks ALL the asks:
   - WALK FWD = real multi-step leg cycle (not one bounce). WALK BACK = distinct backpedal. JUMP = crouch→launch→
     air→land. ATTACK SWINGS = staff/claw/scythe arcs. CAST = arm thrust. HURT = recoil. Per-form (lich scythe,
     arch-devil claw, demon-lord). Summons rigged too (wing flap, claw swing, breath lunge).
   Bigger lift — several cycles — but it's THE path to ~90% Dragon's Crown. (Rejected: AI-gen multi-frame sheets —
   too inconsistent frame-to-frame.) If a cleaner rig needs it, we can re-gen a sprite in a neutral A/T-pose.
PRIORITY: (1) summon independent AI + attacks/FX. (2) stand up the rig on the WARLOCK (walk cycle + jump first),
then extend to back-walk, attack swings, the forms, and the summons.
ified fine, only bash reads are stale).
NEXT STEP (single, fix #3): ANIMATE the warlock by STATE — swap `warlock_idle`↔`warlock_walk` while `mx` is held
(+ procedural walk bounce), `warlock_cast` on cast (castPose already does part of this), `warlock_hurt` on hit;
layer idle breathing bob. All four pose sprites are already ingested — no ne
## ★ ART NORTH STAR (Hiro 2026-06-27): DRAGON'S CROWN (Vanillaware)
The visual target is Dragon's Crown: LUSH HAND-PAINTED 2D, ornate dark-fantasy, dramatic exaggerated silhouettes,
rich painterly rendering (not flat cel-shade), deep shadow + warm rim light, imposing detailed monsters/bosses,
gold-trimmed UI. Push the sprite look toward that painterly richness while keeping the warlock on-model.
KEY DISTINCTION to stay coherent: Dragon's Crown = the LOOK + the RPG depth. COMBAT/CAMERA stays GUILTY GEAR
(strict 1v1 side-on, the locked 2D plane left/right-only, gauntlet duels, camera whirl). So: DC art + RPG
progression, GG mechanics/camera. (If Hiro later wants DC's brawler movement — shallow up/down plane + a few
foes at once — that would REVERSE the 2D-plane lock; pending his call, keep the GG strict plane.)
GEN-SPRITES style nudge to try: replace "clean anime cel-shaded" with "lush painterly anime dark-fantasy
illustration, Dragon's Crown / Vanillaware style, ornate detail, dramatic shadow + rim light" and A/B one sprite.

## ★★★★★ COMBAT MODEL — REVISED TO DRAGON'S CROWN BEAT-EM-UP (Hiro DECIDED 2026-06-27)
SUPERSEDES the Guilty-Gear 1v1 gauntlet AND the strict-2D-plane lock. New target = a Dragon's Crown / Vanillaware
SIDE-SCROLLING BEAT-EM-UP, in the Pit, with the original's ARPG progression.
- PLANE: side-on, characters on a SHALLOW 2.5D GROUND PLANE — move LEFT/RIGHT *and* UP/DOWN within a depth band
  (NOT strict 1D; this REVERSES the "no up/down" lock). y = depth (farther up = farther back, drawn smaller +
  y-sorted). Facing flips L/R toward movement/nearest foe.
- MANY ENEMIES AT ONCE: waves of foes fill the pit arena (like the original pit.js swarm) — not 1v1. The
  warlock's SUMMONS (claw fiend, bone/black dragon, succubi, shamblers, archers) fight ALONGSIDE him in the
  melee as allies. This restores the original's swarm combat (more faithful than 1v1).
- GAUNTLET = WAVES: the pit gauntlet (pit.js FIGHTS) becomes successive WAVES of enemies (+ boss waves) in the
  circular arena, crowd watching from the rim. Clear a wave -> next wave. (DROP the 1v1 two-fighter framing,
  the camera-whirl-to-next-opponent, and the audience-as-next-opponent lineup; keep the crowd as ambiance.)
- CAMERA: a DRAGON'S CROWN beat-em-up cam — follows the player, frames the player + nearby action, zooms with
  the spread of the brawl, slight tilt/parallax. NOT a strict side-lock, NOT the two-fighter 1v1 frame.
- ATTACKS/PROJECTILES: oriented to FACING (hex fires straight in the facing direction; allow minor vertical aim
  per DC). Melee hits an arc in front. Keep readable.
- HUD: Dragon's Crown style — player HP + MP/meter + LEVEL, enemy HP bars over mobs, COMBO counter, loot/gold/score.
KEEP (unchanged): the DC ART north star (lush painterly), the RPG PROGRESSION (level/kills, lv10/20 evolution
roads, lich/arch-devil/demon-lord transformations), the warlock kit 1:1 with pit.js, and the FIGHTING-GAME FEEL
& READABILITY MASTER CHECKLIST (hit feedback, juice, animations, FX, audio — DC is a juicy brawler, all of it
applies). The side-on sprites already generated are correct for a brawler too.
STANDING BENCHMARK (Hiro): compare EVERY milestone to Dragon's Crown — "does this look/feel like DC?" — not just
to the old 2D game. The parity-compare subagent should benchmark look + feel vs Dragon's Crown each run. Target ~90% DC.
 F. AUDIO — huge for readability  [N; reuse existing voice clips, no paid gen]
- Distinct hit / heavy / block / whiff sounds; projectile sounds; voice grunts (reuse VoiceMan clips); crowd roar; announcer "FIGHT!"/"K.O.".

### PRIORITY ORDER (so the player can tell what's going on, fastest):
1. 2D-plane lock + straight projectiles (already queued). 2. HIT FEEDBACK block A (sparks+hitstop+drain+knockback).
3. DYNAMIC CAMERA (zoom-with-distance) + auto-face. 4. Pose-swap state anim + telegraphs + motion smears.
5. HUD juice (combo counter, banners, meter). 6. Transform/super flash + finisher. 7. Audio. 8. [A] extra sprite frames where smoothness is wanted (gen via gen_sprites).
on `currentFoe()`: APPROACH (walk LEFT ~72px/s to melee spacing `P.x+88`) → WINDUP
    (0.34s telegraph — yellow tint via `f._tele`, small lean-back) → LUNGE (0.20s dash to ~`P.x+40`; first frame
    past `P.x+62` calls `hurtWarlock()` ONCE via `f._hit`) → RECOVER (back-pedal to home x, then `aiCd` rnd 0.6–1.4).
    Foe `stunT` (PORTAL) pauses it. Shadow tracks the body. Enemy art faces LEFT already → no flip.
(2) NEW free fns (after `nearestFoe`, ~L150): `foeDmg(f)` (~6–12, loosely scales with hitbox r) + `hurtWarlock(dmg)`
    — honors **WARD** (`P.wardT`>0 ⇒ negated + "WARD") and **roll/blink i-frames** (`rollT`/`fadeT` ⇒ "DODGE"),
    else `P.hp` chip FLOORED at 1 (no KO/respawn yet — deliberately deferred so the demo never dead-ends),
    `P.flash=0.14`, `S.shake`, red popup. This makes the **PORTAL WARD mitigation real** (was a TODO).
(3) Glue: `'flash'` added to the per-frame `P[k]` decay loop (~L640); hero TINT block now `if(P.flash>0)` red FIRST,
    then form tints (~L990+); `this.dt=dt` exposed in `update()` (~L988) for foeAI; `buildSideOn` seeds
    `_foeStepping=false`, `_foeHomeX`, and the first foe's `aiState`; `syncSideOn` sets `_foeStepping=true` during the
    collapse/step-in and clears it on the walk-in tween's onComplete (AI frozen mid-swap). Foe tint priority is now
    white(hurt) > yellow(windup telegraph) > magenta(hex) > clear.
VERIFIED via the Read tool (bash served the documented STALE/TRUNCATED tail AGAIN — reported 1143 lines + a
garbled cut at the dragon-tint line vs the REAL 1220; `node --check` therefore unusable). All edited regions
re-read on fresh disk: `foeDmg`/`hurtWarlock` complete (L150–164), `foeAI` complete + brace-balanced between
complete methods (`syncSideOn` closes L911, `foeAI` L917–947, `aimAngle` resumes L948), the frame/tint/dt glue
present, and the TAIL is whole — `Arena` closes L1209, `new Phaser.Game({...})` boots L1211–1216, `</html>` L1219.
Build stays loadable; non-SIDEON path untouched (foeAI only runs inside `syncSideOn`). Live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount actively serves truncated bash reads → a diffing subagent gets
garbage); checklist updated in-process (Duel loop → still PARTIAL, foe-AI now PRESENT, PORTAL WARD mitigation real).
NEXT STEP (single, priority-4): on the foe's death, a FINISHER beat (hit-stop + flash/finisher popup on the slain
foe) then the camera-WHIRL transition before the next foe steps in from the lineup — currently the swap is a plain
alpha collapse; make it feel like a fighting-game round end.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: the front foe now WALKS IN, flashes YELLOW as it
winds up, LUNGES at the warlock and chips his (left) health bar — block it with PORTAL (K) for a "WARD", or
roll (Space) for a "DODGE". HP now trades BOTH ways. (No KO screen yet — warlock HP floors at 1; finisher/whirl
between fights is the next increment.)

## STATUS: 2026-06-27 17:55 UTC  — ★★ #5 SUMMONS RENDER AS SIDE-ON ASSISTS AT THE WARLOCK'S LEFT ★★
ART INTAKE (priority-0): checked `art_in/` — all PNGs there are the OLD 05:28–05:39 source drops (already
ingested 15:35 into `assets/sprites/` as 28 diffuse+normal pairs) plus the `_preview_*`/`_cast_*` vibe PNGs;
`art_in/raw/` is the keyed archive. Nothing NEW dropped → nothing to ingest. (Leftover sources can't be `rm`'d
off the OneDrive mount; `ingest_art.py` skips names already in `assets/sprites/`.)
RECONCILED DOC vs CODE: the 17:24 status listed the hit-stop/slow-mo + finisher BURST as its *next* step, but
arena.html (mtime 16:40) ALREADY carries them — `finisherWhirl()` sets `S.hitPause=0.12` + `S.slow=0.45` and
calls `finisherBurst()` (radial spark pop on the slain foe), and `update()` (~1085) freezes the sim on hitPause
then runs it at 35% on slow. So priority-4 polish was DONE-but-unlogged. This run advanced to priority-5.
CHANGED — rendered the warlock's SUMMONS as side-on ASSISTS (the single NEXT STEP), purely in the render path of
`updDemons`/the demon draw loop in arena.html (sim/targeting/HEX/DoT untouched → combat unchanged):
(1) Wrapped the per-demon draw body in a SIDEON render-only position override (1144–1155): each living summon
    gets an `_aSlot` (packed each frame in `demons[]` order); its RENDER `d.x/d.y` is moved to an ASSIST LANE at
    `P.x - 52 - slot*30` (left of + behind the warlock), `gy` ground line, dragons hovering 64px up, a slight
    2-row `slot%2` stagger. A `Math.pow(sin(now/430+slot*1.9),6)` term makes each assist mostly REST in lane then
    briefly DART +78px RIGHT — reads as harrying/striking the foe. Originals saved in `_oxs/_oys`.
(2) RESTORE at the end of the body (1214): `d.x=_oxs; d.y=_oys;` so the override is render-only — next frame the
    sim (approach/swing/breath/fireball vs `enemies[]`) uses the true positions. Because the override wraps the
    WHOLE body, the existing top-down draw code lays the body/aura/HP-bar AND the lit sprite out side-on together
    (no disjoint floating bars), at the front-plane scale (lane y≈gy → `dty≈1` → `dsc≈1.0`).
(3) Sprite block (1208): in SIDEON force `setFlipX(false)` (assists face RIGHT toward the foe) + `×0.85` scale so
    they read as secondary to the hero (dragons still tower: ~420×0.85≈357px).
VERIFIED via the Read tool (fresh disk — bash/`node --check` AGAIN unusable, OneDrive FUSE mount serves the
documented STALE/TRUNCATED tail): all 3 edits balanced + symmetric — override opens 1149 / restore 1214 inside
one `for(const d of demons)` body; sprite flip/scale at 1208. File TAIL whole: `class Arena` 699, `new
Phaser.Game({` 1278, `</html>` 1286 (the +11 lines shifted the prior 1238/1240/1248 anchors cleanly). Build stays
loadable; live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount actively serving truncated bash reads → a diffing subagent gets
garbage); checklist updated in-process (Summons-as-assists → PARTIAL: placement/facing/strike-dart present;
true per-summon attack-sync to the foe + side-on HP-bar polish still open).
NEXT STEP (single, priority-5 cont.): SYNC each assist's DART to its actual sim attack (drive the lunge off the
demon's swing/breath/fireball event instead of a free sine) so the strike lands when damage lands, and tidy the
assist HP-bar (small bar UNDER each lane sprite). THEN priority-6: begin porting ABILITIES/TRANSFORMATIONS to
the side-on frame (warlock cast/hurt swaps, devil/demon-lord/lich form art on transform).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: summon the coven (level up / channel) and the claw
fiend, dragon and succubi now line up at the warlock's LEFT facing the foe, darting forward to strike instead of
scattering in a top-down ring. (Their dart isn't yet frame-synced to the exact damage tick — that's next.)

## STATUS: 2026-06-27 16:39 UTC  — ★★ DUEL LOOP increment 1 — FOE SPRITE NOW BOUND TO THE GAUNTLET ★★
ART INTAKE (priority-0): checked `art_in/` — the only PNGs there are the OLD 05:2x source drops (already
ingested 15:35 into `assets/sprites/` as 28 diffuse+normal pairs) plus the `_preview_*` vibe PNGs; `art_in/raw/`
is the keyed archive. Nothing NEW dropped. Nothing to ingest.
CHANGED — executed the single NEXT STEP from the 16:2x shell run: began the side-on DUEL LOOP (priority-3) by
binding the static RIGHT-side `foeSprite` to `currentFoe()` so the tableau starts to PLAY as the warlock wins
the duel (HEX/summons already damage `enemies[]` via the existing `updEnemies`/`dotDamage`/`killEnemy` path).
(1) NEW free fn `foeKeyFor(name)` (after `currentFoe`, ~line 156): maps a gauntlet foe NAME → its side-on
    sprite key, most-specific token first (archer→bonearcher, black/bone-dragon, claw→clawfiend, arch-succ/succ,
    arch-devil/demon-lord/lich), default `shambler`. So any challenger renders.
(2) NEW scene method `syncSideOn(now)` (after `buildSideOn`, ~line 851), called from `update()` behind `if(SIDEON)`
    (~line 945, right after the channel-ring reflect): tracks `this._foeName`; when the active foe CHANGES (prior
    one SLAIN), the old sprite COLLAPSES (alpha→0, 200ms), then the next foe's sprite STEPS IN from x=W*0.86 →
    W*0.72 (alpha+walk, 360ms Quad.out), and the FRONT background-lineup sprite is shifted off + faded (the back
    row visibly shrinks / "next steps forward"). Per-frame it also tints the live foe: white on `flash>0`, violet
    on `hexT>0` (hexed/rotting), else clear. If the whole gauntlet is cleared (`currentFoe()`=null) the last foe
    fades out (a real finisher beat is a later increment). `buildSideOn` now seeds `this._foeName` so frame 1
    doesn't re-trigger a step-in. NO foe AI/approach/attack yet — deliberately scoped out to keep this run short.
VERIFIED via the Read tool (bash/`node --check` AGAIN unusable — the OneDrive FUSE mount served the documented
STALE/TRUNCATED tail): all 3 edited regions re-read on fresh disk — `foeKeyFor` complete + brace-balanced,
`syncSideOn` inserted as a COMPLETE method between complete methods (`buildSideOn` closes 844, method 851–887,
`aimAngle` resumes 889), the `update()` hook present (~945). File TAIL whole: `Arena` class closes and
`new Phaser.Game({...})` boots at 1150–1155 with `</html>` at 1158. Build stays loadable; live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount actively serving truncated bash reads → a diffing subagent gets
garbage); checklist updated in-process (Duel loop → PARTIAL).
NEXT STEP (single, priority-3 cont.): give the current foe a SIMPLE side-on AI — walk toward the warlock to a
melee spacing, a wind-up + lunge attack that calls the existing player-damage path (so HP actually trades both
ways), and bind the foe's facing/flip. THEN the camera-WHIRL + finisher transition between fights (priority-4).
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: kill the front Shambler (HEX/summons) and you
should now see it COLLAPSE, the Bone Archer STEP IN from the right, and one challenger drop out of the back
lineup — the gauntlet now advances on-screen. (Foes still don't fight back; that's the next increment.)

## STATUS: 2026-06-27 17:24 UTC  — ★★ #4 FINISHER BEAT + CAMERA WHIRL BETWEEN FIGHTS LANDED ★★
ART INTAKE (priority-0): checked `art_in/` — all PNGs there are OLD (05:28–05:39, pre the 15:35 ingest);
`assets/sprites/` already holds the 28 diffuse+normal pairs (warlock idle/cast/hurt/walk + 10 foes + shambler
+ bonearcher). Nothing new dropped → nothing to ingest. (Leftover sources can't be `rm`'d off the OneDrive mount.)
RECONCILED THE DOC vs THE CODE: the prior run's 16:2x status said the duel loop was the *next* step, but
arena.html had ALREADY been edited (mtime 16:38) to land BOTH the duel loop (priority-3) AND the side-on foe AI —
`syncSideOn()` (876) binds the RIGHT foe to `currentFoe()`, collapses a slain foe + steps the next in from the
lineup; `foeAI()` (942) drives approach→wind-up(yellow telegraph)→lunge(`hurtWarlock(foeDmg(f))` so HP trades)→
recover, with `stunT` pausing it. Verified intact via the Read tool (helpers foeDmg:152, hurtWarlock:156,
currentFoe:170, foeKeyFor:174 all present). So priority-3 was DONE-but-unlogged; this run advanced to priority-4.
CHANGED — added the between-fights FINISHER + CAMERA WHIRL to `arena.html` (the single NEXT STEP):
(1) NEW `finisherWhirl()` method (~927, right after `syncSideOn`): white `flash(0xffffff,0.16)` + `S.shake=13`
    (routed through update()'s `cameras.main.shake`) + a `banner('DOWN!','next challenger steps up')`, then a
    camera PUNCH — `cam.zoomTo(1.14,170)` + `cam.pan(W*0.66,H*0.5,200)` whipping toward the right entry side —
    that SELF-RESETS after 520ms (`zoomTo(1.0,360)` + `pan(W*0.5,H*0.5,360)`) so an interrupted beat can never
    leave the camera stuck zoomed/off-centre. All guarded on `this.cameras.main`.
(2) WIRED it into `syncSideOn`'s new-foe branch (886) — fires the instant `currentFoe().name` changes, i.e. the
    prior foe was SLAIN (the first foe is seeded in `buildSideOn` so frame-1 never false-triggers). The existing
    lineup-shift + collapse + step-in now run UNDER the whirl, so a kill reads as: flash→DOWN!→cam punch→old foe
    drops→next challenger walks in from the right→camera settles.
VERIFIED via the Read tool (bash `cp` AGAIN served the documented TRUNCATED tail — 1144 lines/78423 bytes ending
mid-file at the demon-scale line, no `</html>`; `node --check` unusable): both edits balanced — `finisherWhirl`
opens 927 / closes 940, the call sits at 886, and the file TAIL is whole (class closes 1238, `new Phaser.Game`
1240–1245, `</html>` 1248). Live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount actively serving truncated bash reads → a diffing subagent gets
garbage); checklist updated in-process (Duel loop → PRESENT; Between-fight finisher/whirl → PARTIAL).
NEXT STEP (single, priority-4 cont. → priority-5): polish the whirl into a true GG "next opponent" beat — a brief
HIT-STOP/slow-mo on the kill (reuse `S.slow`/`hitPause`) and a finisher pose/particle burst on the dying foe —
THEN start priority-5: render the warlock's SUMMONS as side-on ASSISTS at his LEFT side striking the current foe.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: kill the front foe (HEX/summons) and you should now
see a white DOWN! flash + screen-shake, the camera PUNCH IN and whip right as the next challenger steps up, then
settle back to the centred eye-level duel frame. (Foe now also fights back — walks in, telegraphs, lunges.)

## STATUS: 2026-06-27 16:2x UTC  — ★★ SIDE-ON 1v1 GG STAGE FLIP — STATIC SHELL LANDED ★★
ART INTAKE (priority-0): checked `art_in/` — leftover source PNGs there are all OLDER (05:2x) than the
15:35 ingest; nothing new dropped. `assets/sprites/` already holds the 28 diffuse+normal pairs. Nothing to ingest.
CHANGED — executed the single NEXT STEP from 15:53: flipped `arena.html` to the eye-level SIDE-ON 1v1 GG
shell (priority-2 in the locked direction). Static tableau this run; duel loop + camera-whirl land next.
(1) Config: added `const SIDEON=true` + `SIDEON_GROUND_FR=0.84` next to HERO_PX (line ~101).
(2) NEW `buildSideOn()` method (after create(), ~line 788), called at the end of create() behind `if(SIDEON)`:
    - eye-level PIT BACKDROP graphics at depth 2 (covers the old angled-floor `g` at depth 0) — dark back wall +
      darker pit floor below the ground line + the PIT RING drawn side-on as a flattened MAGENTA ellipse
      (0xff3aa0 6px rim + 0xff8ad0 inner) the fighters stand inside.
    - FROZEN BACKGROUND LINEUP: lich/demonlord/archdevil/clawfiend/bonedragon/succubus/archsuccubus/bonearcher
      as small (×0.42 world-h) hazy (alpha 0.5, blue-grey tint) Light2D sprites strung across the back at depth 3.
    - CURRENT OPPONENT: real side-on sprite (shambler, or bonearcher if enemies[0] is the archer) anchored at
      x=W*0.72, scaled by the SAME SPRITE_TARGET_H world-height contract as the scale-fix, + contact shadow +
      a red rim light. Source enemy art already faces LEFT (per manifest) so NO flip needed — it faces the warlock.
    - WARLOCK pinned to the LEFT third (x=W*0.30, P.face=0 → faces RIGHT, no flip); key light moved to screen-left.
(3) `update()` enemy-circle loop now `if(e.dead||SIDEON) continue;` — the top-down placeholder dummies are
    suppressed in side-on (the foe is a real sprite). Summons/projectiles/HEX plumbing untouched (assists still draw).
VERIFIED via the Read tool (bash served the documented STALE TRUNCATED tail again — reported 1034 lines vs the
real 1093; node --check unusable): buildSideOn intact + braces balanced (788–827), config at 101–102, enemy
guard at 943, and the file TAIL is whole — class closes at 1086 and `new Phaser.Game({...})` boots at 1088–1093.
Canvas is 520×760 (portrait): warlock@156 vs foe@374 separate cleanly, lineup spans ~100–420. Live `game/` untouched.
PARITY-COMPARE subagent SKIPPED again (mount actively serving truncated bash reads → a diffing subagent gets
garbage); checklist updated in-process.
NEXT STEP (single, priority-3): WIRE THE DUEL LOOP to the pit.js FIGHTS[] flow — make `enemies[0]`/`foeSprite`
the CURRENT gauntlet foe (HP-bound to the GG HUD right bar), give it a simple side-on approach/attack so the
duel actually plays, and rebuild the lineup so the defeated foe leaves + the next steps forward. Camera-WHIRL +
finisher transition comes AFTER that.
READY FOR HIRO VIBE CHECK — open game3d/arena.html over http: you should now see the SIDE-ON DUEL framing —
warlock on the left facing right, a foe on the right, the rest of the roster lined up frozen in the back inside a
glowing magenta pit ring. (It's a static tableau; they don't fight yet — that's the next increment.)

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
