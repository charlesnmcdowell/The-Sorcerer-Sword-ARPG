# Adventurer — Weather, Spell Art, and the Conscription Cutscene

Paste this whole file as your prompt. It is self-contained.

---

## THE NORTH STAR — read this first

**The world has a clock but no sky. The mages have a spell list but no fire.**

`js/ui/home_art.js` and `js/ui/battle_art.js` already paint day, evening and night — the town backdrop and 38 battlegrounds change with the world clock. But every day is the same clear day. Nothing falls, nothing blows, nothing flashes. And `js/ui/spell_fx.js` gives every one of the 189 skills a recipe, but the recipes are built from a dozen thin atoms (`bolt`, `plume`, `burst`, `ring`, `shockwave`) so **Fire Bolt is a straight orange line**, Spark is a jagged yellow line, Frost Touch is a few spikes, and at 60 px on a phone half of them are indistinguishable. A fireball should be a *ball of fire*. Lightning should be *lightning*. The advanced tier of a spell should be an event the whole screen notices.

This brief does six things: gives the world weather as an overlay layer on the home backdrop and in battle; rebuilds the mage projectiles as real objects with real motion (a comet with a flame trail, a branching streak with a flash, crystalline ice); audits every skill recipe against a legibility grammar so each school and each tier reads at a glance; gives conscription the cutscene it deserves — the beaten NPC's face, their hatred in their own voice, the binding; **rebuilds the backdrops themselves** with depth planes, light that pools and flickers, ground-specific dressing and ambient life, and a post layer; and adds a small **cinematic toolkit** — impact frames, hit-stop, three camera moves, letterbox, one slow-motion beat per fight — spent only on the moments that earn them.

Presentation only. Nothing here changes a rule, a number, or a line of core logic.

---

## 1. What you are working on

A static Phaser 3 web game (`index.html` + `js/`, no build step). Design grid 1280×760, FIT-scaled; landscape phones render at ×0.45, so **legibility at 60 px is the bar** (see the mobile pass in README).

| Area | File | Today |
|---|---|---|
| Town backdrop | `js/ui/home_art.js` — `HousingArt.paint(scene, homeId)`; `camp/inn/cottage/brick/mansion/castle(g, W, H, phase)`; `phase = ADV.Housing.timeOfDay(questClock)`; `paintLife` adds ambient life; depth −10 | day / evening / night palettes, sun / dusk sun / moon + stars; **no weather** |
| Battleground | `js/ui/battle_art.js` — `BA.paint(scene, groundId, phase)`, 38 `GROUNDS` as data with `sky: {day, evening, night}` and element layers (`EL`), `phaseMul`; `BA.groundFor(game, mode)`, `BA.phaseFor(game)` | same three phases; **no weather** |
| Combat FX | `js/ui/spell_fx.js` — `RECIPES[skillId] = { basic, intermediate, advanced }`, `tierChain(draw)` with `tp(tier)` → `{n, scale, reach, wait}`; `play(scene, ctx)` returns the wait; idle status painters (`idleBurn`, `idleFrozen`, `idleShock`, …) via `syncStatus` | ~40 skills have bespoke recipes, the rest fall through to the generic projectile/lunge in `scene_combat.js` `case 'use'` |
| FX atoms | `js/ui/vfx.js` — `bolt, beam, shards, plume, motes, cloud, ring, shockwave, groundCrack, sweep, stab, spray, drip, frostSpikes, laneWave, screenSweep, projectile, slashArc, burst, aura, healSparkle, damageNumber, flashOverlay, camShake, zoomPunch, hitStop, lunge, recoil, shake, tintFlash` | all Graphics primitives; `projectile` is a circle that tweens A→B |
| Defeated-NPC flow | `js/ui/scene_combat.js` (bottom, `resolveDefeatedNamed`): after a won fight, each beaten named NPC speaks a `general` line, then a `Notices.pickOne` offers Kill / Knock out / Conscript / Raise; `ADV.Game.resolveDefeatedNamed → ADV.Divine.resolveDefeated` applies it (`defeated.isConscript`, `conscriptorId`, `conscriptQuestsLeft`, victor's `conscriptIds`, the population debt, a feed line) | the choice is a modal; **nothing is shown when it succeeds** |
| Faces | `js/ui/portraits.js` (expression pass): `Portraits.express/react/stand/moodFor/look/motion/skinState`, 16 moods incl. `furious`, `disgust`, `dazed`, `afraid`; `DialogueBox.show(scene, game, speaker, band, ctx, onDone)` plays a line from a band — `hatred` is a band every personality has | ready to use |

The world clock is `game.world.questClock`; the world seed is `game.world.seed`. `ADV.hashStr` and `ADV.RNG(seed)` give deterministic randomness.

---

## 2. Hard constraints — read twice

- **Presentation only.** No change under `js/core/` or `js/data/`. Weather is *derived* in the UI from `(world.seed, questClock)` — a pure function, the same weather every time you look at the same quest — never stored on the world. The conscription cutscene reads what `Divine.resolveDefeated` already wrote (`isConscript`, `conscriptorId`) and the return value the scene already has.
- **One overlay layer per screen.** Weather lives in one `Phaser.GameObjects.Container` (or one Graphics + one particle emitter) at a fixed depth *above* the backdrop and *below* the UI/units: town depth −5 (backdrop is −10, panels are ≥ 0), combat depth 5 (backdrop 0, units ≥ 10 — check the actual depths in `scene_combat.js` and slot in). It is destroyed and rebuilt with the backdrop (`HousingArt.paint`, `BA.paint`), never leaked across scenes.
- **Particles are one emitter, not N Graphics.** Rain, snow and embers use `scene.add.particles` with a tiny generated texture (a 4×4 or 8×8 canvas made once and cached by key). Graphics is for the sky tint, lightning, and sun rays only. Budget: **weather ≤ 0.5 ms/frame** on a desktop, and on phones (`ADV.UI.isTouch()` or canvas width < 900 CSS px) particle counts halve.
- **Never occlude the read.** Weather alpha over the play area never exceeds 0.35; rain and snow are drawn *behind* units and the dialogue box; lightning flashes are 60–90 ms and never more than one per 6 s; nothing in the weather layer is interactive.
- **Spell FX keep their contract.** `SpellFX.play(scene, ctx)` still returns the wait in ms the combat loop should use; `has(skillId, tier)` still gates the fallback. Waits stay inside `tp(tier).wait ± 40%` so battle pacing does not change — a bigger fireball is not a longer turn. Everything a recipe creates dies by itself (tween `onComplete` → destroy) and is also killed on scene shutdown.
- **Reuse the atoms; extend them; do not fork them.** New motion goes into `vfx.js` as new atoms (`comet`, `lightningStreak`, `iceLance`, `shatter`, `explosion`, `emberTrail`) that every recipe can call. No recipe hand-rolls a particle system.
- **Every skill still has a legible fallback.** If a recipe throws, `play` catches and the generic path runs (it already does — keep it).
- **Phones first.** Every new effect is judged at 60 px: if it does not read there, the desktop version is wrong too.

---

## 3. Part A — Weather

### A1. The weather model (UI-side, pure)

`ADV.Weather.at(world)` → `{ kind, intensity, wind }` derived deterministically from `hashStr(seed + ':' + questClock)`:

| kind | how often | intensity | wind |
|---|---|---|---|
| `clear` | ~45% | 0 | −1..1 |
| `sunny` | ~15% (day phase only; otherwise → clear) | 0.5–1 | 0 |
| `overcast` | ~15% | 0.3–0.7 | −1..1 |
| `rain` | ~12% | 0.3–1 | −1..1 |
| `storm` | ~8% | 0.7–1 | −1..1 (strong) |
| `snow` | ~5% | 0.3–1 | −0.5..0.5 |

Weather persists for 1–3 quests (derive the run length from the same hash so consecutive quests agree), and **it follows the party**: a quest's encounters and its battles share the weather the town had when you left. Ground families can bias it: the marsh grounds lean rain, the mountain/tundra grounds lean snow, the ossuary and the drowned-king grounds are always overcast-or-storm. Read the ground id's family in `BA.GROUNDS` (add a `weatherBias` field to the ground data if needed — data in a UI file, allowed).

### A2. The overlay — `ADV.WeatherFX.attach(scene, weather, phase, bounds, opts)`

Returns a handle `{ container, destroy(), setIntensity() }`. Layers, back to front:

1. **Sky tint.** A full-bounds rectangle: `sunny` a warm +6% white with a soft radial glow around the sun's position (reuse the sun coordinates `home_art` / `battle_art` already use per phase); `overcast` a cool grey 0.18; `rain` grey-blue 0.22; `storm` slate 0.30 that pulses ±0.04 with the lightning; `snow` pale 0.16. Night phases halve tint alpha.
2. **Sun rays** (`sunny`, day only): 4–6 long translucent wedges from the sun, slow 0.02 rad sway, alpha 0.06–0.10, additive blend. Dust motes drifting in the rays in town (reuse `VFX.motes` scaled up, slow).
3. **Cloud drift** (`overcast`, `rain`, `storm`): 3–5 soft ellipse clusters drawn once into a cached canvas texture, tiled as two images scrolling at `wind × 6 px/s`, alpha 0.35–0.6, darker for storm.
4. **Precipitation** — one emitter:
   - `rain`: 2 px × 14 px streaks, angle from wind (`−20°..20°`), speed 900–1200, 120–260 alive (halved on phones), lifespan to the bottom of bounds; a splash ring (`VFX.ring`, 3 px, 120 ms) at ground level for 1 in 12 drops on the town screen only.
   - `storm`: rain at 1.6× density, plus **gusts** — every 3–5 s the wind angle swings 10° over 600 ms and the cloud layer speeds up.
   - `snow`: 3–6 px soft discs, speed 40–90, x-wobble via `emitter.accelerationX` sine, 80–160 alive, alpha 0.7–0.9, a faint ground **accumulation strip** on town screens (a white 0.25 band along the ground line that grows with intensity).
5. **Lightning** (`storm` only): every 6–14 s a **branching streak** from the top of bounds to a random x (reuse the new `VFX.lightningStreak` from Part B so sky lightning and Spark lightning share one grammar), 70 ms, with a 60 ms white `flashOverlay` at 0.25 alpha, then `camShake(0.002)` 180 ms later as the thunder. In combat the flash never fires while a spell FX is mid-flight (check `scene.__fxBusy` — set it in `SpellFX.play`).
6. **Wind on the world.** `home_art` tree canopies (`tree()`) and any banner/flag element get a `wind` rotation tween ±0.02–0.05 rad; snow and rain angles follow the same `wind`. Cheap, and it is what makes weather feel like it is *there*.

### A3. Where it attaches

- **Town** — in `HousingArt.paint`, after the backdrop and `paintLife`, `WeatherFX.attach(scene, Weather.at(world), phase, fullScreen)`. Inn interior: rain and snow are seen *through the windows* only — clip the overlay to the window rectangles (a geometry mask), and let the tint apply to the whole room at half strength. Camp: full weather; a `storm` at the roadside camp is the loudest weather in the game and should look like a bad night.
- **Battle** — in `BA.paint`, same call, clipped to the field bounds (above the turn strip, below the action bar). The battle inherits the *departure* weather (A1 "follows the party").
- **Quest departure / encounter screens** (`scene_quest.js`) — the same overlay over the enemy-preview backdrop.
- **Cutscenes** (`cutscenes.js`) — the ride home plays under the current weather; the funeral is always overcast-or-rain regardless (a cutscene may override the derived kind).

### A4. Weather and mood (small, cheap, worth it)

Standing mood via `Portraits.moodFor` is untouched, but `HousingArt` may nudge the **hub card**: `rain`/`storm` → `skinState({ pale: 0.2 })` on the player's portrait; `sunny` → nothing. Combat: a `storm` adds one `surprised` reaction at 0.4 to every unit on the first lightning flash of the fight. That is all — weather does not change what people feel, only how the light sits on them.

---

## 4. Part B — Mage projectiles rebuilt

### B1. New atoms in `vfx.js`

- **`VFX.comet(scene, x1, y1, x2, y2, opts)`** — a fireball that *travels*: a core disc (`opts.r`, 6–22 px) with a 2-stop radial glow, a **flame trail** emitter attached to a tween along a slight arc (`opts.arc`, ±30 px sag) emitting 3–5 px embers that shrink and fade over 300 ms in the fire palette (`0xffe07a → 0xe86a30 → 0x7a2a10`), a heat-shimmer ring behind the core (alpha 0.15, scale 1.4). Speed ~1100 px/s (so the cross-field trip is ~350 ms). On arrival: `explosion` (below). Returns the flight ms. Use for Fire Bolt, Fire Blast, Fire Ball, Ember Lash's ranged tiers, Siege Flame, Fire Ship, Powder Keg's fuse, the flare.
- **`VFX.explosion(scene, x, y, opts)`** — a fast white core flash (60 ms), an orange shockwave ring (`VFX.shockwave` scaled by `opts.scale`), 8–24 radial ember streaks, a smoke puff (`VFX.cloud`, grey, drifts up 300 ms), and `groundCrack` at `opts.scale ≥ 2`. Scorch residue stays 2 s. `camShake` scaled by size.
- **`VFX.lightningStreak(scene, x1, y1, x2, y2, opts)`** — a **branching** bolt: main path of 7–11 jittered segments (jitter 6–18 px), 2–4 side branches at random nodes each 30–50% of the remaining length and half the width, drawn twice (a 5 px 0xf4e07a glow at 0.35 alpha under a 2 px 0xffffff core), flicker: three redraws at 0/40/80 ms with new jitter, then gone by 120 ms. Impact: a white `burst` and a brief 0.35-alpha white circle. Used by Spark/Chain Lightning/Thunderstorm, Chain Lightning (campaign), Lightning King's storm-speed marker, and storm weather.
- **`VFX.iceLance(scene, x1, y1, x2, y2, opts)`** — a pale-blue translucent crystal (a long hexagon with a bright facet line) that flies straight and fast (700 px/s), leaves a thin frost-mist trail (`motes`, 0x9ad8f0, alpha 0.4), and on impact **shatters**: `VFX.shatter` — 6–12 shard triangles that fly out and fall with gravity over 400 ms, plus `frostSpikes` growing at the feet. Used by Frost Touch / Frost Chain, Rime Grasp, Prismatic Bolt's ice channel.
- **`VFX.freezeOver(scene, view, opts)`** — the target's frame fills with a crystalline overlay: a light-blue 0.35 rectangle with 3–5 crack lines drawn inward from the edges, a rim frost on the portrait frame, held while the `frozen` status lives (wire into `idleFrozen` so the idle state and the cast look like one thing).
- **`VFX.blizzard(scene, bounds, opts)`** — a field-wide burst: the snow emitter from Part A at 4× density blowing sideways for 900 ms, a white `screenSweep`, then `freezeOver` on every target hit, then a slow clear. Frost Touch's advanced tier (Blizzard) and Ice Queen's Winter Court cameo.
- **`VFX.emberTrail(scene, follow, opts)`** — the trail emitter used by `comet`, exposed so Ember Lash and Fire Barrier can borrow it for a whip or a wall.

Every atom takes `opts.scale` and clamps its geometry so that at combat size (units ~92 px wide, scaled ×0.45 on phones) the core is never under 3 device px and the streak never under 2.

### B2. The tier grammar for the three mage lines

| Skill | Basic | Intermediate | Advanced |
|---|---|---|---|
| **Fire Bolt → Fire Blast → Fire Ball** | one `comet` (r 8) source → target, small `explosion` (scale 1) | **three comets** in a 60 ms fan, each to a different target in reach (`twoOf`/`foes` — if only one target, all three converge), medium explosions | **one giant comet** (r 22, trail ×2, slow start then accelerating, a low hum via `camShake 0.002` while in flight), arriving at the enemy field's centre and detonating as a **field-wide explosion** (scale 3.5) that rolls across **all three rows** with staggered secondary bursts 0/80/160 ms, `screenSweep`, scorch residue on every lane, `zoomPunch` |
| **Spark → Chain Lightning → Thunderstorm** | one `lightningStreak` source → target, white flash at impact, 1 `burst` | one streak to the first target that **forks** from the impact point to the second (the fork is a child streak, thinner), both flicker together | a **sky strike**: the field darkens (0.35 slate tint, 200 ms), 3–5 streaks come *down from the top of the field* onto every enemy in the lane with 60 ms stagger, each with its own white impact flash, a `flashOverlay` white 0.3 on the last, `camShake` per strike, residual `shocked` sparks (`idleShock`) on everyone hit. If a `storm` is the active weather, the sky lightning and the spell lightning are the same object |
| **Frost Touch → Frost Chain → Blizzard** | `iceLance` → `shatter` at the target, `frostSpikes` at their feet | two lances 80 ms apart, each shatter **chains** a frost mist to the next target (a slow `beam` of motes), both `freezeOver` if the status lands | `blizzard` field-wide, then every hit target `freezeOver`, then the `frozen` idle picks up seamlessly |

Ember Lash / Cinder Lash / Pyre Lash: a whip — a fast bezier `sweep` in the fire palette with an `emberTrail` following the tip, cracking at the target. Rime Grasp / Hoarfrost / Glacial: ice climbs *up* the target from the ground (three `frostSpikes` calls 60 ms apart, rising), then a grip ring. Chain Lightning (campaign): the intermediate Spark grammar with 3 forks. Prismatic Bolt: a `beam` that splits into fire/ice/lightning tails at the target (one comet, one lance, one streak, tiny). Arcane Cascade: stacked violet `ring`s that grow per stack.

### B3. Perk cameos (only if cheap)
Pyromaniac's leech: a thin ember stream from the burning target back to the caster on each burn tick. Ice Queen's stacks: one small frost crystal per stack on the holder's frame. Lightning King's extra turn: the storm-speed marker becomes a short `lightningStreak` from the sky to the holder.

---

## 5. Part C — Every skill, one legibility grammar

Go through all of `RECIPES` and every skill that *falls through* to the generic path (list them with `ids()` vs `Object.keys(ADV.DATA.SKILLS)` where `kind !== 'perk'`; today that is roughly 150 actives with no bespoke recipe). Each school gets one grammar, each tier one size, and every effect must be **identifiable with the sound off at 60 px**:

| School | Colour | Basic shape | Tier progression | Skills (not exhaustive) |
|---|---|---|---|---|
| Fire | `FIRE` | comet + explosion | 1 → 3 → field | fire_bolt, ember_lash, fire_barrier, siege_flame, ashfall, fire_ship, powder_keg, flare |
| Lightning | `LIT` | branching streak | 1 → fork → sky strike | spark, chain_lightning, storm_shape, kiai (a sound-shock: rings + shock, no bolt) |
| Ice | `ICE` | lance + shatter + freeze-over | 1 → 2 chained → blizzard | frost_touch, rime_grasp, prismatic_bolt (ice tail) |
| Blade | `STL` | `slashArc` **with a motion-blur trail** (3 arcs fading) and a spark at the edge | 1 arc → X-cross → triple + `screenSweep` | cleave, sunder, katana_slash, iai_draw, rising_cut, cutlass_work, saber_thrust, riposte_line, veterans_cut, finisher, counter_attack, throat_work, killing_angle |
| Piercing / arrows | `STL` | a **real arrow** (shaft + fletch + head, 18 px) on an arced `projectile` with a whistle trail; volleys are 5–9 arrows raining from above | 1 → 3 → lane rain | aimed_shot, longbow_volley, measured_shot, poisoned_quarrel, silent_loosing, suppressing_volley, paid_shot, focal_shot |
| Guns / cannon | `GOLD`/`ASH` | **muzzle flash** (white star 60 ms), smoke puff, a fast tracer, impact spark, `camShake` | pistol → double → broadside (three tracers + lane smoke) | flintlock_shot, grapeshot, chain_shot, volley_fire, ranging_cannon, grapeshot's cone of 9 small tracers |
| Thrown | `STL` | spinning shuriken (a rotating 4-point star) on a fast projectile | 1 → 3 fan → lane storm | shuriken_fan, kunai_line, chain_and_weight (a weight on a chain — `beam` that whips) |
| Shadow / stealth | `SHD` | `cloud` of dark motes swallowing the unit; the strike comes out of the cloud | fade → blink → the field dims | smoke_bomb, smoke_step, backstab, ghoststep, vanishing_strike, cloak_of_shadows, shadow_lance (a dark `beam` with purple edge) |
| Poison / bleed | `POI`/`BLD` | a `spray` arc of drops + a green/red `drip` that keeps dripping while the status lives | 1 → lane spray → corrosive cloud | venom_fang, poison_spray, blood_lotus (lotus petals opening — 5 `ring` segments), venom_draw |
| Holy / heal | `HOLY` | rising `healSparkle` motes + a soft `aura`; cleanse is a downward white `beam` | one → party → field | mend, cleanse, regenerate, triage, guardian_ward, restorative_circle, purge_ward, field_honour, clan_blood, sick_bay, rum_ration (amber, with a hiccup bounce) |
| Nature | `NAT` | vines: green `groundCrack` lines that sprout leaf triangles; thorns; a beast silhouette flash for forms | — | snare, thorn_skin, beast_shape, growth_field, fox_form (a fox-ear silhouette flicker), bear_stance |
| Guard / stance | `STL`/`GOLD` | a shield shape (hexagon) flaring on the unit, held as a rim while the status lives | self → lane → wall | shield_wall, stone_stance, iron_fan_guard, boarding_plate, close_order, crossing_guard, bulwark_formation, warding_stance, aegis_protocol |
| Command / signal | `GOLD` | a banner or flag unfurl (a rectangle that flips out) + `laneWave` | — | signal_flags, kiai, standing_order, volley_fire's "make ready", articles_of_war |
| Necromancy / forbidden | `PURP` | a violet sigil ring drawn stroke by stroke (arc tween), dark motes rising, the target's frame desaturates | — | necromancy, conscript, whisper_of_ending, last_breath, blood_pact, blood_price, true_rest (the inverse: white, upward, and the frame re-saturates) |
| Divine | `HOLY`/`GOLD` | god_aura's existing halo, bigger | — | god_aura, divine intervention beat |

Rules: **size by tier** (basic fits the target, intermediate reaches the lane, advanced touches the whole enemy field); **every hit lands with a hit-frame** (the target's `tintFlash` + `recoil` are already in `scene_combat.js` — do not duplicate them, but make sure the FX arrival and the hit-frame coincide within 40 ms, so return the flight time correctly); **statuses are visible while they live** (extend `syncStatus`/idle painters: burn embers, poison drip, bleed drops, frozen crystal, shocked sparks, guard rim, ward glyph, rooted vines, taunt mark, stealth dim — the six the doc names plus `exposed` (a red crosshair flicker) and `withering` (grey motes falling)).

Any skill you cannot give a real recipe gets at least a **school-correct** generic: pick by `SKILLS[id].archetype` and the `element`/`heal`/`guard` flags the data carries.

---

## 6. Part D — The conscription cutscene

Today: beat a named NPC → they speak → you pick "Conscript them" → a toast if it fails → the next one. Success is invisible. Make it a moment.

**Trigger.** In `scene_combat.js`'s defeated-NPC flow, when `resolveDefeatedNamed(..., 'conscript')` returns without `error` and `c.isConscript` is now true, run `Cut.conscription(scene, game, victor, c, next)` before `next()`. Do the same for **Raise** (`Cut.raising`, a variant — see below). Implement in `js/ui/cutscenes.js` with the same grammar as the ride home and funeral (`card()`, veil, click-to-skip after a grace period).

**The scene (≈ 5–7 s, skippable):**
1. The battlefield darkens (veil to 0.6), the victor's card slides in from their side, the beaten NPC's card from the other, both large (`lead: true` size), facing.
2. The NPC's face: `Portraits.express(..., 'furious', 1)` if their personality is in the Wrathful/Furious/Brash/Severe/Commanding group, `'disgust'` for Haughty/Imperious/Elegant/Exacting/Cynical, `'afraid'` for Timid/Meek/Skittish/Nervous, `'grief'` for Sorrowful/Bereaved/Melancholy, otherwise `'angry'` — read `PERSONALITY_BIAS` families in portraits.js, do not invent a fourth table. Their gaze locks on the victor (`Portraits.look` held).
3. **They speak from the `hatred` band** — `DialogueBox.show(scene, game, c, 'hatred', ctx, …)` — inside the cutscene (the box already supports `scene.__cutscene`). This is the line that matters: it is the first thing the player hears from someone they just enslaved, and every personality has one. The delivery tags drive a reaction on top of the standing hatred face (already wired).
4. **The binding.** A violet sigil ring draws itself around the NPC's card (arc tween, 600 ms), three chain links (a `beam` of short dark segments) snap from the victor's card to the NPC's frame with a metallic `camShake 0.002` each, the NPC's portrait **desaturates to the conscript tint** (`img.setTint(0x9a8ab0)` — pick the same tint `scene_combat` uses for conscripts if one exists, else establish it here and reuse it there), and their face goes `dazed` 0.8 over 400 ms — the will going out of them — while the sigil fades to a small mark at the frame's corner that **stays on the unit in every later fight** (add it to `syncStatus` as a conscript glyph).
5. A caption bar: `<Name> is yours for <n> quests.` from `c.conscriptQuestsLeft`, and, when the population debt applies (`Divine.resolveDefeated` writes the feed line), a second smaller line: *The town will remember.*
6. If the victor already held a full stable and one was released (`victor.conscriptIds.shift()` path — detect by comparing the id list before/after), the released one's card fades out at the edge with a `content` face: *<Old name> walks free.*

**Raise variant (`Cut.raising`).** Same staging; the dead NPC's card is grey (`tint 0x9aa0aa`), the sigil is drawn in `PURP` with green motes rising, the face goes from `neutral` to `dazed` 1.0 as the eyes "light" (a small `look` up), the caption: *<Name> stands again.* No hatred line — the dead do not speak — but the **mourners** do: if any living NPC on the field is kin or a partner of the raised, they get a `grief` reaction and one `hatred` line aimed at the victor.

**Voice.** `hatred` band clips exist for every personality (`audio/vo/<pid>/hatred_n.mp3`); `DialogueBox.show` already plays them. Nothing to generate.

---

## 7. Part E — The backgrounds themselves

Weather is an overlay; it does not fix what is under it. Today every town backdrop and every one of the 38 battlegrounds is **one flat Graphics object**: a two-stop sky gradient, a few filled ellipses for hills, rectangles for buildings, triangles for trees, and phase-multiplied colours. No depth, no light falling on anything, nothing moving except `paintLife`'s few sprites. That is a placeholder, and it stays a placeholder under rain. Rebuild the renderers so the same data (`GROUNDS`, the six home functions) produces a scene with depth, light and life.

### E1. Depth — three planes, real parallax
Split every backdrop into **far / mid / near** Graphics layers (the ground data already names `far`, `mid`, `near` colour roles — make them actual layers). Far: sky, celestial body, distant silhouettes at 55–70% contrast with **atmospheric perspective** (a haze tint of the sky colour at 0.25–0.4 over the far plane). Mid: hills, buildings, the road. Near: the foreground elements (trees, braziers, tents, foreground grass) at full contrast, slightly larger. In combat, the planes **parallax with the camera**: the camera punch and shakes move far by ×0.3, mid by ×0.6, near by ×1.0 (`scrollFactor` per layer). In town, a slow idle drift (far layer ±3 px over 12 s) reads as air. Cheap, and it is the single biggest step from "flat" to "a place".

### E2. Light — sources that light things
- **Key light from the sky.** Every element painted gets a lit side and a shade side from one light direction per phase (day: high left; evening: low right, warm; night: from the moon, cool, weak). Hills get a lit rim, buildings a lit wall and a shaded wall, trees a lit canopy edge — implement once in the `EL` element painters (`hill`, `tree`, `building`, `road`, `water`, …) and every ground inherits it.
- **Local lights that pool.** Braziers, the camp fire, torches, lit windows, the crypt candles, the Pale Mother's ossuary lamps already exist as dots. Give each a **light pool**: a soft radial gradient (a cached 128 px texture, additive blend, tinted to the source) laid on the ground plane, plus a warm tint on the nearest near-plane element, and a **flicker** (alpha ±0.08 at 8–12 Hz with a slow 2 s swell). At night the pools are the composition; at noon they are nearly off (`phaseMul` already carries this).
- **Spells light the field.** When a fire comet crosses the field, a light pool follows it and the units it passes get a 200 ms warm `tintFlash` (0xffe0c0 at 0.35); a lightning strike whites the whole far plane for one frame and throws a hard shadow line under every unit for 60 ms; a frost effect cools the mid plane 0.12 blue for the spell's duration. Wire this into the B1 atoms (`comet`, `lightningStreak`, `iceLance`) via one `VFX.lightField(scene, x, y, color, radius, ms)` call so any recipe can throw light.
- **Weather lights.** Storm: the sky darkens and every local light pool gains 30% alpha (it's what a storm does to a torch). Sunny: a soft bloom on the lit rims (E4).

### E3. Detail and life per ground
Each of the 38 grounds and 6 homes gets a **dressing pass** against a checklist, using the existing `EL` element vocabulary plus new elements where a ground has none of its own:
- **Silhouette detail**: buildings get roof lines, chimneys, window rows with mullions, a door; trees get 2–3 canopy lobes and branch lines, not one triangle; hills get a second contour and treeline bumps; walls get stone courses.
- **Ground texture**: the road gets ruts and stones; grass gets tufts along the near edge; the marsh gets reeds and standing water with a sky reflection; the crypt gets flagstone lines; the deck gets planks and rope.
- **Ambient animation** (`paintLife` extended to every ground, not just town): smoke from chimneys and braziers (a slow `cloud` emitter, 4–8 alive), birds crossing the far sky in day (two-line V shapes on a 20 s tween, 1–3), fireflies at night in the wood and marsh (8–14 motes drifting, 0.3 alpha pulsing), water shimmer (a light band that slides across any `water` element, 4 s loop), banner and flag flap where a faction hall or a ship is in the scene, torch flame flicker (E2), leaves or petals falling in the green grounds, ash falling in the ember grounds, dust in the arena. **Budget: one emitter and ≤ 3 tweens of ambient life per ground.**
- **Ground-specific hero prop** — one memorable thing per ground that says *where you are*: the bandit road's overturned cart, the crypt's open sarcophagus, the shallows' wreck hull, the salt court's bolted throne, the ossuary's bone wall, the birthing house's row of standing shapes in the dark, the low tide's stranded ship keel, the deep wood's gate of two leaning trunks, the tavern's long table, the alley's hanging washing, the Maw's laundry vats and steam, the boss grounds' raised dais. Draw it in the mid plane, lit by E2.

### E4. Post — the finishing layer
A single full-screen post layer above everything in the backdrop and below the UI: a **vignette** (a cached radial texture, black at the corners, alpha 0.18 in town, 0.28 in combat, 0.4 in cutscenes) and a **bloom pass on additive elements** — glow sprites (the same cached radial texture in the source colour at 0.3–0.5 alpha, `BlendModes.ADD`) placed on every light source, every spell core, every lit window, and the sun. No shaders, no render textures — this is the cheap bloom and it is enough. Colour-grade per phase: a full-screen tint at 0.06–0.10 (day: neutral; evening: 0xff9a50; night: 0x4060a0) so the whole frame agrees.

### E5. Verification for E
- Before/after screenshots of every home × 3 phases and every ground × 3 phases (`/tmp/shots/bg_<id>_<phase>.png`) — a contact sheet of 132 tiles. **Look at them.** Any ground that still reads as three shapes on a gradient fails.
- Parallax: after `camShake`, the far layer's displacement is ≤ 35% of the near layer's (read `scrollFactor`).
- Light pools exist at every `brazier`/`torch`/`window`/`fire` element at night; none at noon exceed 0.15 alpha.
- Ambient life: each ground spawns ≤ 1 emitter and ≤ 3 tweens; 30 repaints leak nothing.
- Frame budget: backdrop + weather + life under 1.0 ms/frame on desktop, measured like `Portraits.STATS`.

---

## 8. Part F — Cinematic language

"Cinematic" is not more particles. It is **camera, timing, light and frame**, used sparingly so that when they happen they mean something. Build these as a small toolkit in `vfx.js` (`VFX.cine`) and spend them only where listed.

- **Impact frame.** On a crit, execute, or any advanced-tier hit: for exactly one frame the target is drawn as a flat white silhouette (`tintFill 0xffffff`), then a second frame as its inverse (dark), then normal. 32–48 ms total. This is the oldest trick in animation and the one that makes a hit *land*.
- **Hit-stop that includes the camera.** The existing `hitStop` pauses tweens for 60 ms; extend it so heavy hits also freeze the particle emitters and hold the camera, and advanced casts hold for 90 ms at the moment of impact before the explosion plays.
- **Camera moves, three only.** (1) **Push-in** on the caster for 300 ms (zoom 1.0→1.08, eased) as an advanced spell charges, then a **snap back** on release. (2) **Whip** toward the impact for a field-wide hit (zoom 1.06, pan 20 px, 120 ms, back over 300 ms). (3) **Slow drift** in cutscenes (zoom 1.0→1.03 over the whole scene). Nothing else moves the camera; two moves never overlap (a queue with the current one winning).
- **Letterbox for the big moments.** Two black bars (each 6% of height) slide in over 200 ms for advanced-tier casts, boss phase changes, and every cutscene, and slide out after. The UI is not under them (they sit at depth just above the field, below the action bar and dialogue).
- **Slow motion, once per fight at most.** The killing blow on a boss, or the hit that drops the player below 25% the first time: `scene.time.timeScale` and tween timeScale to 0.35 for 400 ms real time, with the impact frame inside it, then back. A killing blow on a mook never earns it.
- **Charge-up.** Advanced casts get a 300 ms *anticipation*: motes converge on the caster's hands (a reverse `burst`), the caster's portrait gets a `resolve` or `furious` reaction (already available), the field's light dims 0.1 toward the spell's colour, then release. The wait contract holds because the recipe's existing wait absorbs it (charge + flight + impact = the same `tp(tier).wait ± 40%`).
- **Light, again.** E2's `lightField` is what makes an explosion cinematic: the room lights up and the shadows jump. Every advanced effect throws light.
- **Aftermath.** Field-wide effects leave the field changed for the rest of the fight: scorch marks, frost rime on the ground plane, a lingering haze of smoke or ice mist that the camera moves through (parallax on the near plane). Residue already exists as a concept (`residue()`); make it plane-aware and persistent within the fight.
- **Sound stays where it is.** Nothing here adds audio; the timing is written so that if you later drop an impact sample on the impact frame, it fits.

Verification: screenshot a Fire Ball cast at charge, mid-flight, impact frame, and detonation (four frames, `/tmp/shots/cine_fireball_*.png`); assert the letterbox bars exist during an advanced cast and are gone 400 ms after; assert no two camera moves overlap over a 20-cast soak; assert `timeScale` returns to 1 within 600 ms of every slow-motion beat.

## 9. DO NOT ERASE EXISTING FEATURES — non-negotiable

- The three **phases** (day/evening/night) and every ground's and home's palette stay; weather and light multiply on top. Every existing `GROUNDS` id and every `EL` element keeps working; E splits them into planes and lights them, it does not redraw them from nothing.
- `paintLife` ambient life in town stays; wind is added to it, not instead of it.
- All existing `RECIPES` keep their skill ids and tier keys; you replace bodies, never remove entries. `basic_attack`, `finisher`, `counter_attack`, `katana_slash` keep their per-tier identity.
- `SpellFX.play` returns a wait; the combat loop's timing contract is unchanged. `has()`, `ids()`, `tick()`, `syncStatus()`, `clearStatus()` keep their signatures.
- `VFX` atoms keep their signatures; new ones are added.
- The defeated-NPC modal (Kill / Knock out / Conscript / Raise) is unchanged — the cutscene plays **after** a successful choice and calls `next()` when done or skipped.
- The expression pass stays as is; the cutscene *uses* it.
- All suites pass unchanged: `npm test`, `npm run test:browser`, `npm run test:mobile`, `npm run lint`.

---

## 10. Verification

Add `test/browser_fx.js` (Playwright, server on :8734) and wire it into `npm run test:browser`; add pure checks to `test/run_tests.js` or a new `test/fx.js`.

**Headless**
- `ADV.Weather.at(world)` is deterministic (same seed + clock → same kind/intensity/wind) and covers every kind over 200 quests with the documented proportions ±5%; `sunny` never appears at night.
- Weather persists 1–3 quests: over 200 quests, no run of the same non-clear kind exceeds 3 and none is 0.
- Every non-perk skill id has either a `RECIPES` entry or a school-correct generic (`SpellFX.schoolOf(id)` returns one of the schools in §5 — export it).
- `has(id, tier)` is true for all three tiers of fire_bolt, spark, frost_touch, ember_lash, rime_grasp.

**Browser**
- Town under each of the six kinds (force via a debug hook `ADV.Weather.force(kind)` that the test sets before `HousingArt.paint`): screenshot each; assert the weather container exists at the right depth, particle count within the budget (and halved with `ADV.UI.isTouch` stubbed true), no more than one lightning flash in any 5 s window, overlay alpha over the play area ≤ 0.35 (sample the tint rect).
- Inn: precipitation is masked to the windows (sample a pixel of wall vs. window).
- Combat under `storm`: a flash never fires while `scene.__fxBusy` is true (run 10 s of a fight and log).
- Fire Bolt / Fire Blast / Fire Ball: play each via `SpellFX.play` on a live field and assert (a) the returned wait is within `tp(tier).wait ± 40%`, (b) the comet exists and travels (its x changes between frames), (c) Fire Blast spawns 3 comets, (d) Fire Ball's explosion touches all three enemy rows (a residue object exists near each `SLOT_Y`). Screenshot mid-flight and at detonation.
- Spark / Chain Lightning / Thunderstorm: (a) the streak has ≥ 2 branches (count child graphics or expose a `__branches` for tests), (b) Chain Lightning forks from the first impact, (c) Thunderstorm strikes descend from `y < 60`.
- Frost Touch / Frost Chain / Blizzard: the lance shatters (shard objects exist and then are gone within 600 ms); `freezeOver` is present while a `frozen` status is on the unit and absent after.
- Legibility: render one **contact sheet per school** at 220 px and at 60 px (`/tmp/shots/fx_<school>.png`) — every tier of every skill in the school, mid-effect — and **look at them**. Any two skills in the same school that are indistinguishable at 60 px fail.
- Conscription: win a staged fight against a named NPC with a `conscript`-holding player, choose Conscript through the real modal (`clickText`), assert the cutscene container appears, a `hatred`-band line is shown (depth 904 text exists), the NPC's face mood is one of furious/disgust/afraid/grief/angry then `dazed`, the caption names the quest count, the conscript glyph exists on their unit in the next fight, and `next()` ran (the flow continued). Skip via click after the grace period also runs `next()` exactly once.
- Leaks: 30 spell casts in a row on a live field → `scene.children.list.length` returns to within 10 of its starting value within 3 s; 10 town repaints under `storm` → no growth in emitter count or `update` listeners.
- Budget: with `storm` in combat and a Thunderstorm mid-cast, `SpellFX`+`WeatherFX` combined per-frame cost (instrument like `Portraits.STATS`) stays under 1.5 ms averaged over 3 s.

---

## 11. Order of work — report between parts

1. **B1 atoms** (comet, explosion, lightningStreak, iceLance/shatter, freezeOver, blizzard) with a contact sheet of each atom at three scales. Stop and show it.
2. **B2** — the three mage lines. Screenshot Fire Ball mid-flight and at detonation, Thunderstorm mid-strike, Blizzard at peak. Stop and show.
3. **Part E1–E2** — planes and light on the camp and the bandit road only, before/after. Stop and show; this is the look the rest inherits.
4. **Part A** weather — model, overlay, town then combat then quest/cutscenes. Six screenshots of the camp. Stop and show.
5. **Part F** cinematic toolkit, applied to the three mage lines from step 2 and to the cutscenes.
6. **Part D** the conscription cutscene, then the Raise variant.
7. **Part E3–E4** — the dressing pass over every home and ground, then the post layer; contact sheet of all 132 tiles.
8. **Part C** school by school, contact sheet per school, most-played schools first: blade, arrows, guns, holy, shadow, then the rest.
9. Tests (§10, §E5, §8), then `npm test`, `npm run test:browser`, `npm run lint`.

Report after each part with: files touched, what the player now sees that they did not before, the per-frame cost you measured, and anything in the data that lacked the flag you needed (`element`, `heal`, `guard`).

---

## 12. What NOT to do

- Do not generate sprite sheets or image assets. Everything is Graphics and particles from generated 4–8 px textures.
- Do not lengthen turns. A bigger effect is not a slower fight; the wait contract in `tp(tier)` holds.
- Do not stack weather layers on scene transitions — one container, destroyed with its backdrop.
- Do not let weather touch gameplay, dialogue, or mood beyond §A4.
- Do not write to `js/core/` or `js/data/`. Weather is derived; conscription state is read.
- Do not make the conscription cutscene unskippable, and do not let a skipped cutscene skip the *next* NPC's choice.
- Do not ship a fireball that is still a line, or a battleground that is still three shapes on a gradient.
- Do not move the camera for ordinary hits. Three camera moves, spent where §8 says; slow motion once per fight.
