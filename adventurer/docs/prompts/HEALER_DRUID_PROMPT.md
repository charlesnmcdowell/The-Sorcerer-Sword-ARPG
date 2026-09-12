# HEALER & DRUID PASS — effects, numbers, transformations, and the living home screen

You are working in `adventurer/` (Phaser 3.87, no build step, design grid 1280×760 via `ADV.T`). Read `README.md`, `EXPRESSION_PROMPT.md` and `FX_WEATHER_PROMPT.md` first: the portrait system (`ADV.Portraits.express / react / motion / key`), the FX atoms in `js/ui/vfx.js` (`comet, explosion, lightningStreak, iceLance, shatter, freezeOver, blizzard, lightField, emberTrail`, the `cine` toolkit), the spell recipes in `js/ui/spell_fx.js` (`RECIPES[skillId] = {basic, intermediate, advanced}`, `tp(tier)`, `schoolOf`, `syncStatus` idle marks), the home backdrops in `js/ui/home_art.js` (`camp / inn / cottage / brick / mansion / castle`, `paintLife`, weather via `ADV.WeatherFX.attach`), and the combat core in `js/core/combat.js` (`healUnit`, `addStatus`, `revive` events, the `hot` status, `applyRawDamage` with its reflect `bounce`). Do not rebuild any of that. Build on it.

**North star.** Right now a heal is a green number and a sparkle, a shapeshift is a stat change nobody sees, and a revive is a face un-greying. After this pass: a healer's work is unmistakable at a glance (green crosses rising, wings on the one brought back), a druid's is wild and alive (a beast where the portrait was, a grove that grows around the risen, a tree of life with water behind the one they shield), the numbers behind healing are percentages people can reason about, and the home screen is a place with people and animals moving through it, not a painting.

---

## 1. What you are building

1. **Healing becomes percentage-based** (of the target's max HP), with tiers and target counts that are the same for every healer and druid heal.
2. **Regeneration** is redefined (double value over 5 turns, 3-turn cooldown).
3. **Druid heals** are heal-over-time + a **thorn shield** (absorb + reflect), drawn as a tree of life with running water behind the portrait, ringed in thorns.
4. **Druid shapeshifts swap the portrait** for a random beast (werewolf / werebear / panther), then attack.
5. **Revives** are events: druid → emerald grove around the risen for the buff's duration + a neutral line; healer → angelic wings on the risen + a friendly line. At least one line per fight per reviver.
6. **Every healer and druid effect is louder**: green plus signs on every heal, tier-sized, visible from across the room.
7. **Home screen cinematics**: each of the six homes gets scene-specific animated life, and the inn is redrawn as an interior with weather seen only through its windows.
8. Tests for all of it.

---

## 2. Constraints (unchanged from the earlier passes)

- No asset loads. Everything is Graphics, generated canvas textures, particles, tweens.
- Every effect returns its wait; damage/heal numbers land on the beat, not before. Waits stay within `tp(tier).wait ± 40%`.
- Nothing you add may leak: every emitter, tween and timer created for a status must be killed by `syncStatus` / `clearStatus` when the status ends or the unit goes down.
- `npm test` and the browser suites keep passing. Headless Chromium runs the field at ~3 fps; tests scale `scene.time.timeScale` / `scene.tweens.timeScale` rather than wait for real seconds (see `test/browser_fx.js`).
- Keep the headless core pure: numbers and rules live in `js/core/combat.js` / `js/data/skills.js`, never in `js/ui`.

---

## 3. Part A — the numbers

### A1. Percentage healing
Every skill with `heal: true` that restores HP (healer and druid alike) heals a **fraction of the target's max HP**:

| tier | direct heal | targets (healer & druid) |
|---|---|---|
| basic | **50%** | 1 |
| intermediate | **100%** | up to **2** (the chosen ally + the next-lowest-HP ally) |
| advanced | **150%** | up to **4** (chosen + the three lowest) |

Overheal is wasted unless the skill says `overhealUncapped`. `power` on these skills becomes a **multiplier on the percentage** (default 1.0), so `triage` (power 1.5) at basic heals 75% and its "doubled under 25%" rule still applies on top. `devoted` (healing performed +) still multiplies. Keep `mend`'s offensive drain mode: damage stays as it is, the self-heal it grants is the same percentage of *the caster's* max HP.

Implement one function, `Combat.healPct(st, src, tgt, skillId, tier)` → HP amount, and route every heal through it. Nothing else computes a heal.

### A2. Regeneration
`regenerate` (and any skill with `hotRounds`) heals **double the tier value over 5 turns**, evenly: basic 100% over 5 (20%/turn), intermediate 200% over 5, advanced 300% over 5. It carries a **cooldown of 3 turns** for the caster (`cooldown: 3` on the skill; `Combat.validTargets`/the action bar grey it out while `u.cooldowns[skillId] > 0`; cooldowns tick at the start of the caster's turn). Recasting on a target already regenerating refreshes the duration, never stacks.

### A3. Druid heals
Druid healing skills (`grove_raise`'s heal component, `growth_field`, and any `archetype: 'druid'` skill with `heal: true`) heal **the same totals as a healer's tier, but over 3 turns** (basic 50%/3, intermediate 100%/3, advanced 150%/3), and additionally put a **thorn shield** on each target:

| tier | shield absorb (of target max HP) | reflect |
|---|---|---|
| basic | 50% | 50% of absorbed damage returned to the attacker |
| intermediate | 100% | 50% |
| advanced | 150% | 50% |

The shield is a status `{ kind: 'thornShield', pool, reflectPct: 0.5, rounds: 3 }`: incoming damage drains `pool` first; whatever it absorbs is reflected at `reflectPct` through the existing `bounce()` path in `applyRawDamage` (tag `'reflect'`, so `noReflect` rules still apply). It ends when `pool` hits 0 or `rounds` runs out. Note: the brief says "150% damage reduction" for advanced — a shield cannot reduce more than 100% of a hit, so this is modelled as a 150%-of-max-HP absorb pool. Flag this once in the README; do not silently change it to something else.

### A4. Targets
Both classes: intermediate → 2 targets, advanced → up to 4, chosen as above. `company_medic`, `restorative_circle`, `sick_bay`, `breath_of_the_bell`, `rum_ration`, `clan_blood` already target a party or lane; leave their targeting, apply the percentages.

### A5. Revives
Revive HP stays as the skill defines it (`reviveHp`). `grove_raise` keeps its "15% less than Raise" rule. Add `buffRounds: 3` to `grove_raise` (the grove lasts as long as its `reviveAtkMult`/status does; if it grants none, 3 rounds).

---

## 4. Part B — healer effects

### B1. Green crosses
`VFX.healCrosses(scene, x, y, tier, opts)`: bright green plus signs (`0x7fe07a` core, `0xc8ffc0` rim, additive) rising from the target's frame, tier-sized: basic 5 small crosses over 500 ms; intermediate 9 crosses, two sizes, 650 ms; advanced 14 crosses, three sizes, a soft green `lightField` under the unit, 800 ms. Crosses spawn inside the portrait bounds, drift up 40–70 px, rotate ±12°, fade at the top. A green number (`+NNN`) lands at the end of the rise, not at its start. Every healing skill, healer or druid, plays this; the druid's is tinted toward leaf-green (`0x5d8a4a`) with a couple of leaves among the crosses.

### B2. Healer signature per skill (keep their existing recipes, make them louder)
- `mend`: a beam of white-gold from caster to target (`VFX.beam`), crosses on arrival, `lightField` warm.
- `triage`: fast, small, two beats; under 25% HP the crosses double and a short white flash frames the target.
- `cleanse`: a ring of light expands from the target, statuses fly off as grey motes; on undead/conscripts the ring is white-hot and the target takes an impact frame.
- `guardian_ward`: a translucent gold shell drawn with `freezeOver`'s geometry but gold and hexagonal; stays as an idle mark while the ward holds.
- `regenerate`: a slow pulse of crosses every turn it ticks (the `hot` idle mark: one small cross every 700 ms, drifting).
- `stitch_and_run`, `field_suture`, `stanch`, `surgeons_saw`, `company_medic`, `restorative_circle`, `sick_bay`, `breath_of_the_bell`, `rum_ration`, `clan_blood`, `field_honour`: the generic holy grammar from `spell_fx.js` **plus** crosses at the right tier size. Party/lane heals stagger 60 ms between targets, left to right.

### B3. Healer revive — wings
`VFX.wings(scene, view, opts)`: two angelic wings unfold behind the portrait frame — drawn as layered feather strokes in `0xf4eee0` with a gold rim, additive glow behind them — over 400 ms (fold in from the frame's edge, then a single slow beat). They hold for the revive's buff rounds (or 2 rounds if none) as an idle mark `wings` in `syncStatus`, beating once every ~2.4 s, then dissolve into white motes. While the wings are up the unit's frame has a faint halo (`lightField`, `0xfff0c0`, radius 70, alpha 0.25).

Sequence on `revive` when the reviver is a healer (`archetype: 'healer'` on the skill): white flash on the risen (`flashOverlay` 0.25), wings unfold, crosses (advanced size), the risen's face goes `surprised` → `content`; the healer's face `tender` for 900 ms. `hitStop` 40 ms on the unfold.

### B4. Healer line — friendly, at least once per fight
On the first revive a healer performs in a fight (`st.revLines = st.revLines || {}`, keyed by reviver uid), the healer speaks a **friendly** line through the combat speech path (`DialogueBox.showText` style, non-blocking, 1.6 s). Twelve original lines in a new table `ADV.DATA.REVIVE_LINES.healer` ("Back with us. Breathe.", "I have you. I have you." — write your own, no quoting). Pick by seed `(reviver.id.length * 31 + st.round) % lines.length`. Subsequent revives by the same healer in the same fight speak with probability 0.35. The line's delivery tag drives the expression (`[soft]`, `[warm]` → `tender`/`content`).

---

## 5. Part C — druid effects

### C1. Shapeshift — the portrait becomes the beast
When `beast_shape`, `wild_form`'s free shift, `warhound_form`, `bear_stance`, `serpent_form`, `fox_form`, `sea_dog_form`, `marine_form`, `storm_shape`, or any skill flagged `shapeshift: true` fires:

1. Pick a beast **at random** from `['werewolf', 'werebear', 'panther']` (seeded by `st.rng` so tests can pin it; `bear_stance` → werebear, `serpent_form`/`fox_form` → panther, `warhound_form` → werewolf; everything else random).
2. `Portraits.beastKey(scene, ch, beast)` draws a beast portrait **on the same frame and in the same palette family as the character** (skin/hair colours carry into the fur: dark hair → dark fur; the character's eye colour stays; the costume's trim colour appears as a collar/mark), so the beast is recognisably *this* person changed. Three rigs: werewolf (long muzzle, ears up, bared teeth, hunched shoulders filling the frame), werebear (broad head, small ears, heavy jaw, shoulders past the frame edges), panther (sleek head, low ears, green-gold eyes, one paw raised into frame). Reuse `drawMonster`'s rig helpers; do not draw them from scratch if a rig fits.
3. **Transformation beat** (`VFX.transform(scene, view, beastKey)`, ~520 ms): the frame shakes, the portrait stretches vertically 1.15× and snaps back twice, a burst of leaf-green motes and dark fur-flecks, a **swap** to the beast texture at the second snap with a 40 ms impact frame, a low ring (`0x5d8a4a`) expanding on the ground. The `express` overlay is rebuilt for the beast (moods still work: `furious`, `pain`, `afraid` read on a muzzle).
4. Then the attack the skill makes, if any, plays as a **lunge with claws** (`slashArc` ×3, staggered 40 ms, a spray of leaves, impact frame on the target).
5. The beast portrait **stays** while the buff status lasts (`syncStatus` keeps `view.img` on the beast key while `u.statuses` has the form status); when it drops, a 300 ms reverse beat returns the human face.

`makeUnitView` / `redrawUnit` must read `u.form` (the active beast, or null) when choosing the texture. The roster and dialogue never show the beast — only the field.

### C2. Druid heal — the tree of life
`VFX.lifeTree(scene, view, tier)` draws **behind** the portrait (depth just below the unit image, above the lane panel): a tree trunk rising from the frame's base with a canopy that spreads past the frame's top edge, branches keyed to tier (basic: 2 boughs; intermediate: 4; advanced: 6, with the canopy nearly hiding the frame's top corners); behind the trunk a **sheet of running water** — a masked column of `0x6fc0e8` streaks scrolling downward on a looping tween, additive — and around the frame a **ring of thorns** (dark green briar strokes with short spikes) that thickens by tier. Leaves drift off the canopy while the shield holds. The whole thing is the idle mark for `thornShield` in `syncStatus` and fades over 400 ms when the shield breaks or expires. On a reflected hit the thorns flash red and a `spray` of thorn shards flies at the attacker with the reflect damage number.

Cast beat: leaf-green crosses (B1, druid tint), then the tree **grows** in 400 ms (trunk scaleY 0→1, canopy scale 0→1 with a Back.easeOut), water starts, thorns draw last.

### C3. Druid revive — the emerald grove
`VFX.grove(scene, view, rounds)`: on `revive` by a druid skill, the ground under the risen cracks green, saplings shoot up around the frame (5–7, staggered 50 ms, each a trunk + two leaf circles, Back.easeOut), a canopy of emerald (`0x2fbf71`, additive glow + leaf particles) closes over the frame's top, fireflies (`dot` texture, `0xbfff8a`, slow random walk) drift inside it, and a soft green `lightField` sits under the unit. The grove is the idle mark `grove` and lasts `buffRounds` (A5); each round it loses a sapling; the last one dissolves into leaves. The risen's face: `dazed` → `content`. The druid: `resolve`.

### C4. Druid line — neutral, at least once per fight
Same mechanism as B4 with `ADV.DATA.REVIVE_LINES.druid`: twelve original **neutral** lines — matter-of-fact, the green doesn't care ("The ground gives back what it took.", "Up. The roots have you." — write your own). Delivery tag `[flat]` → `neutral`/`resolve`. Guaranteed once per fight per druid, 0.35 after.

### C5. Other druid actives, louder
`thorn_skin` (thorns ring only, no tree); `thorn_lash` (a briar whip: a comet-like green head dragging a thorn ribbon, roots erupt at the target); `wither_touch` (the target's frame greys and a rot bloom spreads, crosses fall *downward* in grey to say "no healing"); `growth_field` (the lane's ground sprouts grass tufts that stay as terrain marks); `storm_shape` (the shift beat, then a `lightningStreak` crown). Perks (`wild_form`, `carrion_sense`, `beast_handler`) get a one-time aura when they proc.

---

## 6. Part D — the home screen, alive

Each home in `home_art.js` gets a `life(scene, id, phase, clock)` layer of animated actors on top of the painted backdrop (depth −9, under the hub panels; the ambient dust/light/post layers from the FX pass stay). Actors are tiny code-drawn figures (the `paintCrowd` silhouettes are the floor; go two steps further: a head, torso, two legs that alternate, a carried object). Everything loops forever with randomised timings; nothing pops in — actors enter from off-screen or a doorway.

**Inn (redrawn).** The player is *inside*: the common room where people eat and drink. Repaint: a long plank table in the foreground with tankards, bowls and a candle; a bar along the back wall with kegs, a shelf of bottles, a hearth to one side with a real flickering fire (`emberTrail` + light pool); beams across the ceiling; **two windows** on the back wall. The world's weather is drawn **only inside the window panes** (mask the `WeatherFX` layer to the two window rects — `scene.add.rectangle` geometry masks — rain streaks, snow, a grey lid or sun shafts through the glass; at night the panes are dark blue with the moon in one). Life: an innkeeper behind the bar wiping a tankard, a serving girl walking a tray between tables every ~12 s, 3–5 patrons at the table who lift tankards and lean back, a dog asleep by the hearth whose flank rises and falls. No rain ever falls inside.

**Camp / wooden lodge (cottage).** A garden in front: rows of vegetables, a fence, flowers. Forest around and behind. Forest animals: a deer that walks in from the trees, grazes, lifts its head, leaves (every ~25 s); two rabbits that hop between fence posts; a fox at dusk; an owl on a branch at night whose head turns; birds by day. Chimney smoke stays.

**Brick house.** As it is, but the garden is **bigger and lusher**: a corn patch of 8–12 stalks that **sway** (each stalk a tween on rotation ±3°, phase-offset, wind-scaled by the weather model); flower beds whose heads **turn** slowly toward the sun by day and glow faintly under moonlight at night (a small additive circle per flower, alpha by phase). A cat on the wall.

**Mansion.** A carriage lane in front. Every 18–30 s a horse-drawn carriage rolls in from one side (horse legs alternating, wheels rotating), stops at the steps, a passenger steps down and walks up into the door, the carriage rolls off the other side. Between arrivals, maids and butlers cross the porch carrying trays (a covered dish, a decanter and glasses, a stacked cake) — draw them well: uniform, apron, tray held level, a purposeful walk. Lit windows at night with silhouettes passing.

**Castle.** Two armed guards flank the gate: plate, spear, a shield; they shift weight every few seconds, one turns his head as a carriage passes. Wide farmland to both sides: field rows to the horizon, a windmill turning, a few labourers bent over rows. Carriages arrive **continuously** (a new one as the last departs) bringing nobles — men and women, randomised: gown or doublet, cloak colour, a hat or a circlet — who step down and are received by a steward before walking through the gate. Banners on the towers move in the wind.

All animals and people are silhouettes-with-detail at the scale of the existing crowd, never portraits. Weather (rain/snow) still falls over the outdoor homes and nowhere inside the inn.

---

## 7. Do not erase

- Existing recipes for mage / melee / rogue / ranger lines and the FX-pass atoms.
- The expression system, `moodFor`, delivery tags, `stand()`.
- `paintCrowd`, `smokeStacks`, `flickerLamps`, weather attach points.
- Campaign / faction skill rules (`campaign_skills.js`, `campaign2_skills.js`): they adopt the new heal percentages but keep every other rule they carry.

---

## 8. Verification

- `test/heal.js` (headless): `healPct` returns 50/100/150% of max HP at the three tiers for `mend`; `triage` 75% / 150% under 25%; `regenerate` totals 100/200/300% over exactly 5 ticks, refreshes instead of stacking, and is unavailable for 3 turns after a cast; druid heals total the same over 3 ticks and add a `thornShield` with pool 50/100/150% that absorbs, reflects 50% of absorbed via the `reflect` tag, and ends at 0 or after 3 rounds; intermediate heals reach 2 targets and advanced 4, lowest-HP first; `beast_shape` sets `u.form` to one of the three beasts (seeded) and clears it when the status drops; `grove_raise` revive sets a `grove` status for `buffRounds`; the healer/druid line tables have ≥12 entries each and the first revive per fight always emits a `line` event.
- `test/browser_heal.js`: in a real fight with time scaled, each healer and druid recipe at each tier returns a wait in range and draws crosses (count objects with `__cross`); a revive by a healer puts `wings` in `_fxMarks` and they clear after the rounds; a druid revive puts `grove` in `_fxMarks`; a druid heal puts `thornShield` art in `_fxMarks` and it clears when the pool is drained; `beast_shape` swaps `view.img.texture.key` to a `beast_` key and back; a transformation sheet (`test/heal_sheet.js`) writes the three beasts at two sizes, the tree at three tiers, the wings and the grove to `/tmp/shots`.
- `test/browser_home.js`: each of the six homes paints with a `homeLife` container of ≥ 6 actors; the inn's weather layer is masked (`weatherFX.objs.every(o => o.mask)`) and no precipitation object exists outside the window rects; the mansion and castle spawn a carriage within a scaled 30 s; the brick corn stalks carry a rotation tween.
- Existing suites unchanged and green.

## 9. Order of work

1. Part A numbers + `test/heal.js` — stop and show the test output.
2. B1 crosses + B2 healer recipes; C2 tree; C5 druid actives. Contact sheet. Stop and show.
3. C1 shapeshift portraits + transform beat. Sheet of the three beasts. Stop and show.
4. B3/B4 wings + lines; C3/C4 grove + lines.
5. Part D homes (inn first, then castle, mansion, brick, cottage, camp).
6. Tests, README section "Healer & druid pass", commit. The user pushes.

## 10. What not to do

- Do not compute heals anywhere but `Combat.healPct`.
- Do not stack regenerations or let a druid shield absorb more than one pool's worth.
- Do not show the beast portrait anywhere except the battlefield unit view.
- Do not draw weather inside the inn.
- Do not reuse a healer's wings for a druid revive or a grove for a healer's; the two classes must read differently from across the room.
- Do not quote lines from any published work for the revive tables; write them.
