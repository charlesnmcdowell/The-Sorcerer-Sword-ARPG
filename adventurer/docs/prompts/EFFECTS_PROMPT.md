# Adventurer — Combat Effects Overhaul

Paste this whole file as your prompt. It is self-contained.

---

## THE NORTH STAR — read this first

**Every skill in this game already does something distinct. Almost none of them
look distinct.**

Right now the entire combat vocabulary resolves to three visuals. If the skill
is in a hardcoded list of five ids, a coloured dot flies across the screen and
pops. If it targets an enemy and isn't in that list, the portrait lunges and a
single 40px arc is drawn. Everything else — every buff, heal, ward, guard,
stealth, summon — draws one expanding ring. Then a number floats up.

So Fire Bolt and Frost Touch are the same animation in different colours. Fire
Bolt at basic and Fire Ball at advanced — a single-target bolt versus a
lane-wide detonation — are pixel-identical. Cleave, Sunder, Backstab, Katana
Slash and a bare punch are the same white arc. Smoke Bomb, which turns you
invisible, looks exactly like Shield Wall, which does not.

**The job: give every skill, at every tier, its own animation.**

Two things have to be true when you are finished:

1. **You can name the skill from the animation with the labels turned off.**
   Fire reads as fire, ice reads as ice, a stab reads as a stab. Different
   skills look different.
2. **You can name the tier from the animation.** Basic, Intermediate and
   Advanced must read as *the same spell getting stronger* — not as three
   unrelated effects. Escalation is legible: more of it, bigger, longer,
   reaching further, and only at Advanced does it touch the whole screen.

This is a presentation pass. **It changes no damage number, no status duration,
no targeting rule, no cost, no AI decision.** If a change would alter what the
simulation computes, it is out of scope. You are drawing what already happens.

---

## 1. What you are working on

**Adventurer** is a finished, playable Phaser 3 web RPG at
`C:\Users\charl\The Sorcerer Sword ARPG\adventurer`. It is a menus-and-portraits
RPG — no traversable map. The player takes contracts from a board, fights
three-lane tactical battles, and manages a guild roster of simulated NPCs.

**Stack:** Phaser 3.87, plain `<script>` tags, no bundler, no build step.
Everything hangs off a global `ADV.*`.

**Layers, in load order:**

```
js/data/   pure data tables (skills, enemies, dialogue, constants)
js/core/   Phaser-free logic — runs headless in Node
js/ui/     Phaser scenes and panels
```

`index.html` lists every script. `test/harness.js` has a `FILES` array that
**must mirror `index.html` exactly** for `js/data` and `js/core` —
`test/run_tests.js` asserts it. The harness does **not** load `js/ui`, so
nothing in this brief is covered by the headless suite. Browser verification is
mandatory; §7 tells you how.

**Canvas is fixed at 1280×760.** Do not change it.

### Files you will touch

| file | what lives there | your business with it |
|---|---|---|
| `js/ui/vfx.js` | 115 lines. The whole effect vocabulary: `lunge`, `recoil`, `shake`, `tintFlash`, `scalePunch`, `camShake`, `zoomPunch`, `flashOverlay`, `projectile`, `slashArc`, `burst`, `aura`, `healSparkle`, `damageNumber`, `hitStop` | **grow it** — new atoms, additively |
| `js/ui/spell_fx.js` | **does not exist — you create it** | the per-skill, per-tier registry |
| `js/ui/scene_combat.js` | 638 lines. `animateEvent(e)` at line 215 is the event→animation switch | **two anchored edits, no more** |
| `js/data/skills.js` | 53 skills, 31 of them `kind: 'active'` | **read only** — never edit |
| `js/core/combat.js` | 1626 lines, emits the events | **read only** — never edit |
| `js/ui/theme.js` | the palette (`T.c` numeric, `T.css` strings) | read; add colours only if truly needed |

---

## 2. Hard constraints — read twice

**ALL ART IS CODE. This is absolute.** There is no budget for assets and none
will be commissioned. Every visual is drawn at runtime with Phaser `Graphics`
calls, primitive game objects (`add.circle`, `add.rectangle`, `add.star`,
`add.triangle`), tweens, or canvas textures (`scene.textures.createCanvas`).

**Do not add:** image files, sprite sheets, particle texture atlases, icon
fonts, shaders loaded from disk, external art of any kind. Do not suggest it.
Do not write code that "will look better once we have a texture." Getting
everything out of code drawing is the creative challenge here, not a limitation
to work around.

Phaser's particle emitter needs a texture. You may create one procedurally with
`textures.generate` or a 1×1 white `Graphics` render, but tween-driven
primitives are already proven in this codebase and are usually simpler. Prefer
them.

**Target aesthetic: old-school RuneScape.** Flat colour, low detail, high
clarity, unpretentious charm. Concretely, for effects:

- **Flat fills and hard edges.** No blur, no soft glow, no gradient meshes. A
  fireball is a stack of flat orange shapes, not a soft light.
- **Silhouette over interior detail.** An effect should read at a glance from
  its outline. Lightning is a jagged 4-segment polyline, not a rendered arc.
- **Chunky over wispy.** Few, large, confident shapes beat many small faint
  ones. Six 8px embers beat forty 2px sparks.
- **Small saturated accent against a desaturated ground.** The backdrop is
  already scrimmed dark on purpose. Effects are the saturated thing on screen.
- **Imperfection is fine.** Slight asymmetry and hand-placed jitter read as
  handmade, not broken.

**No dependencies.** No npm packages, no CDN scripts.

---

## 3. The architecture — build it this way

The last two features added to this project (`js/ui/cutscenes.js`,
`js/ui/battle_art.js`) both used the same shape and both went in cleanly:
**a new file holding a small vocabulary of drawing atoms plus a data table of
recipes, wired into the existing scene with a few lines.** Do the same.

### 3.1 `js/ui/vfx.js` — atoms (grow, don't rewrite)

Keep every existing function exactly as it is; other scenes call them. Add new
atoms alongside. Each atom is one primitive gesture, takes `(scene, ...)`,
creates its own objects, tweens them, and **destroys them in `onComplete`**.

Atoms worth adding — this is a starting list, not a limit:

```
bolt(scene, x1,y1, x2,y2, color, opts)     jagged polyline, N segments, jitter
beam(scene, x1,y1, x2,y2, color, opts)     straight lance, widens then snaps out
shards(scene, x,y, color, n, opts)         angular triangles thrown outward
plume(scene, x,y, color, opts)             flames/smoke rising, shapes fading up
motes(scene, x,y, color, n, opts)          slow drifting specks (poison, ash)
cloud(scene, x,y, color, opts)             expanding opaque blob, lingers
ring(scene, x,y, color, opts)              exists as `aura` — parameterise it
shockwave(scene, x,y, color, opts)         flat ellipse expanding on the ground
groundCrack(scene, x,y, color, opts)       radiating lines on the floor plane
sweep(scene, x,y, color, opts)             wide arc, generalises `slashArc`
stab(scene, x,y, dir, color, opts)         short hard thrust line, no arc
spray(scene, x,y, dir, color, opts)        cone of droplets/needles
drip(scene, x,y, color, opts)              falls and stains — bleed, poison
frostSpikes(scene, x,y, color, opts)       spikes growing inward around a target
laneWave(scene, side, lane, color, opts)   sweeps the three slots of one lane
screenSweep(scene, color, opts)            crosses the whole field — advanced only
```

Give every atom sane defaults so a recipe can call it with three arguments.

**Rules for atoms:**

- Never leak. Every created object is destroyed in an `onComplete` or a
  `delayedCall`. A long fight plays hundreds of casts.
- Never assume the scene is still alive. Wrap `destroy()` in `try/catch`, as
  the existing code does.
- No per-frame object creation in `onUpdate` unless it is bounded and each one
  self-destroys — `VFX.projectile` does this correctly; copy its shape.
- Atoms take a colour. They do not know what skill called them.

### 3.2 `js/ui/spell_fx.js` — the registry (new file)

```js
ADV.SpellFX.play(scene, ctx)   // ctx: { skillId, tier, src, tgt, targets, dir, color, element }
                               // returns: duration in ms the caller should wait
ADV.SpellFX.has(skillId, tier) // is there a recipe?
ADV.SpellFX.ids()              // every registered skillId — for the contact sheet
```

Recipes are a table, `{ [skillId]: { basic, intermediate, advanced } }`, each
entry a function that composes atoms and returns a duration. Write a
`tierChain(base, opts)` helper so a skill whose three tiers differ only in
count/scale/reach is three lines, not three hand-written functions.

`src` and `tgt` are the unit views from `scene_combat` — `{ x, y, img, u }`.
`targets` is the resolved list for lane and all-enemy tiers. `dir` is `+1` for
side `a` (attacker moving right), `-1` for side `b`.

**`play` must never throw.** Wrap the recipe call in `try/catch`; on error, log
once and fall back to the generic path. A broken spell effect must not softlock
a battle.

### 3.3 Wiring — exactly two edits to `scene_combat.js`

In `animateEvent`, `case 'use':` currently ends with:

```js
if (tgt && tgt.u.side !== src.u.side) {
  if (V.isProjectile(e.skillId)) V.projectile(this, src.x, src.y, tgt.x, tgt.y, V.skillColor(e.skillId));
  else { V.lunge(this, src.img, dir); V.slashArc(this, tgt.x, tgt.y, V.skillColor(e.skillId)); }
} else {
  V.aura(this, src.x, src.y, ...);
}
return 240;
```

Insert a delegation **before** that block, keeping the block intact as the
fallback for anything unregistered:

```js
if (ADV.SpellFX && ADV.SpellFX.has(e.skillId, e.tier)) {
  return ADV.SpellFX.play(this, { skillId: e.skillId, tier: e.tier, src, tgt, dir, ... });
}
```

The `use` event already carries `skillId` **and** `tier` — `js/core/combat.js`
line 1067. You do not need to touch core to know the tier.

The second edit is the status idle-loop hook in §6. That is all. Everything else
lives in your two files.

Add `<script src="js/ui/spell_fx.js"></script>` to `index.html` **after**
`js/ui/vfx.js` and **before** `js/ui/scene_combat.js`.

---

## 4. The tier grammar — the most important section

93 animations is only tractable if tiers are a *transformation*, not an
invention. Fix these axes and apply them everywhere:

| axis | basic | intermediate | advanced |
|---|---|---|---|
| **count** | 1 | 2–3 | 5–8, or lane-wide |
| **scale** | ×1 | ×1.25 | ×1.6 |
| **reach** | one target | two targets, or a short chain | the lane / the field |
| **follow-through** | impact pops and ends | impact leaves a residue that fades | residue plus a ground mark that persists ~1s |
| **screen-space** | none | camera shake only, ≤0.004 | shake, flash overlay, hit-stop — allowed here only |
| **colour** | **identical across all three tiers** | — | — |

**Colour never changes between tiers.** It is what tells the player this is the
same spell. Tiers escalate on shape, count, and violence. Fire Bolt, Fire Blast
and Fire Ball are all `0xe86a30`.

Element palette — extend `VFX.skillColor` into a proper element-aware lookup:

```
fire      0xe86a30  accent 0xf4c542   ash/smoke 0x4a4038
ice       0x6fc0e8  accent 0xd6f0ff   frost      0x9fd8f0
lightning 0xf4e07a  accent 0xffffff   arc        0xbfa8f0
poison    0x7fa848  accent 0xb8d86a
bleed     0xa8352c  accent 0xd8574a
shadow    0x4a3a5a  accent 0x9a70c0
holy      0xf4eee0  accent 0xd4a94e
nature    0x5d8a4a  accent 0x83b56b
steel     0xcfd8e8  accent 0xf4eee0
```

Everything else stays inside `theme.js`'s existing palette.

---

## 5. The work — 31 actives × 3 tiers

Real ids and real tier names, read out of `js/data/skills.js`. Do not invent
skills; do not rename tiers.

### Phase 1 — mage elementals (the priority)

The user named these first. Nine animations. Get the grammar right here and the
rest follows.

| skill | element | basic → intermediate → advanced | mechanical truth to draw |
|---|---|---|---|
| `fire_bolt` | fire | Fire Bolt → Fire Blast → Fire Ball | single hit → bigger single hit → **whole enemy lane**; always applies Burn, growing |
| `frost_touch` | ice | Frost Touch → Frost Chain → Blizzard | single → **2 targets** → whole lane; freezes, target loses turns |
| `spark` | lightning | Spark → Chain Lightning → Thunderstorm | single → **chains to 2** → **all enemies**; leaves Shocked |
| `ember_lash` | fire | Ember Lash → Cinder Lash → Pyre Lash | a whip of fire, not a bolt — different silhouette from `fire_bolt` |
| `rime_grasp` | ice | Rime Grasp → Hoarfrost Grasp → Glacial Grasp | a grip closing on the target — spikes growing **inward**, not thrown outward |

Draw the mechanic. Fire Ball hits a whole lane — the effect must visibly cover
three slots, not play at one target three times. Chain Lightning chains — draw
the bolt hopping target to target. Blizzard is lane-wide, so it falls from above
across the lane's x-range.

Frost and rime must not look alike: `frost_touch` travels and lands,
`rime_grasp` closes around a target that is already there.

### Phase 2 — melee and physical

| skill | tiers | draw |
|---|---|---|
| `cleave` | Cleave → Sweep → Whirlwind | one wide arc → two crossed arcs → full 360° around the attacker |
| `sunder` | Sunder → Rend → Shatter | overhead chop; armour flakes off; advanced cracks the ground under the target |
| `backstab` | Backstab → Throat Cut → Assassinate | short hard **stab**, no arc; attacker flickers behind the target; advanced adds hit-stop and a blood spray |
| `venom_fang` | Venom Fang → Black Fang → Plague Fang | a bite, then green motes settling — poison is the point |
| `katana_slash` | unique, one tier | a single clean horizontal line, faster than everything else. Restraint reads as skill |
| `basic_attack` | universal | keep it cheap and short. Seen more than any other move — ≤180 ms, no screen-space, ever |
| `finisher` | unique | the kill move: hit-stop, one heavy arc, hold |
| `counter_attack` | unique | a fast reversed arc pointing back at the attacker |

Melee is where a wrong choice hurts most, because the player sees `basic_attack`
hundreds of times a session. Short, punchy, no camera work.

### Phase 3 — rogue, ranger, druid, healer

| skill | tiers | draw |
|---|---|---|
| `smoke_bomb` | Smoke Bomb → Vanish → Shadowstep | **user-named.** An opaque cloud blooms at the caster, the portrait's alpha drops behind it, the cloud thins and the portrait is dimmed/desaturated while stealthed. Intermediate: bigger cloud, fuller fade. Advanced: cloud plus the portrait visibly **relocating** — a ghost trail sliding to its position |
| `aimed_shot` | Aimed Shot → Piercing Shot → Volley | a drawn line of aim before the loose; advanced rains many arrows across the lane |
| `snare` | Snare → Bind → Root Field | vines closing on the feet; advanced covers the ground of a lane and stays visible |
| `thorn_skin` | Thorn Skin → Bramble Hide → Barkflesh | thorns growing **on the caster's own outline** — a self-buff must not look like a cast at someone else |
| `beast_shape` | Beast Shape → Greater Beast → Primal Form | a shape-change flash on the portrait; scale punch plus a tint that holds while active |
| `wither_touch` | Wither Touch → Blight Touch → Grave Touch | colour draining out of the target — desaturate the portrait briefly |
| `mend` / `regenerate` | Mend → Restore → Renewal, etc. | `healSparkle` exists; differentiate — `mend` is a burst, `regenerate` is a slow repeating pulse that recurs on its ticks |
| `cleanse` | Cleanse → Purify → Absolution | a white wash that visibly strips the target's status pips |
| `guardian_ward` | Guardian Ward → Sanctuary → Divine Aegis | a held shield outline on the target that persists while the ward is up |
| `triage` | Triage → Field Surgery → **Resurrection** | advanced raises the dead. It should be the most dramatic friendly effect in the game |
| `blood_pact` | Blood Pact → Blood Tithe → Crimson Covenant | a line drawn between caster and victim, drawing red back along it |
| `shield_wall` | Shield Wall → Iron Wall → Aegis | scope grows self → lane → party; draw the shield over **everyone it covers** |
| `taunt` | Taunt → Provoke → Challenge | a mark that lands on the target and **stays visible** while marked |
| `necromancy` / `conscript` | post-victory | these fire outside the fight; give them the raise/bind visual and leave the timing alone |

### Phase 4 — statuses (§6) and the remaining uniques

`true_rest`, `god_aura`. Read what they do before drawing them.

---

## 6. Statuses — the second half of the job

Right now `burn`, `poison`, `bleed`, `frozen`, `shocked`, `rooted`, `guard`,
`ward`, `thorns`, `exposed`, `sealed`, `taunted`, `withering` and the rest are
**text in a 9px line under the portrait**. A burning enemy does not look like it
is burning.

Two pieces:

1. **Idle marks.** A small looping graphic anchored to the portrait for the
   duration: burn = a low flicker at the base, poison = slow green motes,
   bleed = an occasional drip, frozen = a pale blue tint plus a frost outline,
   shocked = an intermittent spark, guard/ward = a held outline, rooted = vines
   at the feet, taunted = a mark above the head. Register them in `spell_fx.js`
   keyed by status kind, attach in `redrawUnit`, and **remove them when the
   status is gone or the view is destroyed.** These loop, so a leak here is
   worse than a leak in a one-shot.

2. **Tick hits.** `t: 'damage'` with `e.tag === 'dot'` is a burn or poison
   ticking. Give it its own small hit distinct from a weapon hit — currently
   both are a red tint flash.

Cap concurrent idle loops per unit (three is plenty) so a heavily-statused boss
does not turn into soup.

---

## 7. Timing, budget and legibility — non-negotiable

`animateEvent` returns the delay before the next event animates. **That return
value is your pacing budget, and combat is watched hundreds of times.**

| tier | maximum returned duration |
|---|---|
| basic | 260 ms |
| intermediate | 340 ms |
| advanced | 520 ms |
| `basic_attack` | 180 ms |
| status tick | 140 ms |

A spell may keep drawing after it returns — a residue fading over 800 ms is
fine as long as the fight has already moved on. What may not happen is the
player waiting.

**Screen-space effects are rationed.** `camShake` above 0.004, `flashOverlay`,
`zoomPunch` and `hitStop` are for **advanced tiers, executes, and boss moves
only**. If every spell shakes the camera, none of them feel big. There is
already an execute/heavy-hit shake — do not stack a second one on top.

**Legibility beats spectacle.** The player reads this fight through portraits,
HP bars, intents, and damage numbers. Existing depth bands:

```
< 500     backdrop, lane boards
500-560   effects            ← yours
600       damage numbers
700+      modals, dialogue
```

Stay in your band. Nothing you draw may sit over a damage number or an HP bar
long enough to obscure it. This exact lesson was learned on the battleground
art: the first six grounds had to be scrimmed back because they made the lanes
unreadable. Effects are louder than backdrops. Be disciplined.

**Performance:** a lane-wide advanced spell resolves for up to three targets. If
each spawns 40 objects you have 120 tweens on a mid-range laptop. Keep total
live objects per cast under ~40 and reuse `Graphics` where a single one can
draw many shapes.

---

## 8. DO NOT ERASE EXISTING FEATURES — non-negotiable

This project has already lost a day's work. An assistant held a **stale copy**
of the project and wrote it over the working tree. Roughly 20 files silently
reverted, ~857 lines of finished features vanished — the home system,
auto-attack targeting, obituaries, conscription, the rival companies — and **the
test suite still looked green, because the tests had been reverted too.** The
loss was not noticed for hours.

Nothing in this brief requires deleting anything. If you are removing code, stop
and reconsider — you are almost certainly doing it wrong.

### The rules

1. **Never write a file you have not just read in this session.** Not from
   memory, not from an earlier copy, not from a zip, not from a template.
2. **Never bulk-copy, unzip, rsync or sync a directory over the project.** No
   "let me just refresh the files." That is precisely what caused the loss.
3. **Every edit is a targeted, anchored replacement.** Find exact surrounding
   text, assert it matched **exactly once**, then replace. A patch that silently
   matches nothing is worse than a crash — it looks like success. This has
   happened here too.
4. **Additive by default.** Two new files and two anchored edits is the whole
   footprint of this work. If you find yourself restructuring
   `scene_combat.js`, you have left the brief.
5. **`js/ui/vfx.js` is grown, never rewritten.** Every existing function is
   called from elsewhere. Adding is safe; changing a signature is not. If an
   existing atom needs new behaviour, add an optional `opts` argument with
   defaults that reproduce today's behaviour exactly.
6. **`js/core/` and `js/data/` are read-only for this work.** You need nothing
   from them but facts. If you believe a core change is required, stop and say
   so instead of making it.
7. **Take a symbol inventory before and after.** `tools/symbol_inventory.js`
   exists for this:
   ```
   node tools/symbol_inventory.js snapshot     # before you start
   node tools/symbol_inventory.js check        # after every phase
   ```
   It reports removed symbols and shrunken files. It has already caught a real
   regression. If it reports anything, you deleted something.
8. **Verify against a running game, not against your expectations.** The
   headless suite does not load `js/ui`. Passing tests prove nothing about this
   work.

---

## 9. Verification

**Headless suite — must not get worse:**

```
cd "C:\Users\charl\The Sorcerer Sword ARPG\adventurer"
node test/run_tests.js && node test/campaign_flow.js && node test/campaign2.js
node test/integration.js && node test/requests3.js && node test/hiro.js
node test/skills2.js && node test/campaign_rules.js && node test/balance.js
node tools/symbol_inventory.js check
```

Known pre-existing failure, **not yours**: `test/features.js` crashes with
`ADV.Game.attachRival is not a function` — `js/core/game.js` is missing its
rival-companies block. Restore it from git commit `1f46150` before you start, or
leave it alone and don't be confused by it. Do not "fix" it by writing the
functions yourself.

**Browser — this is the real verification.** The suite cannot see any of your
work. Build a **contact sheet harness**: a debug page or script that walks every
registered `skillId × tier`, plays it against a dummy target, and screenshots
each one. Ninety-three animations cannot be reviewed by playing the game; they
can be reviewed as a grid. This is the single highest-leverage thing you will
build, so build it first, before the second recipe.

Then check the things a contact sheet cannot show you:

- **Play three real fights end to end.** Effects must not desync the event
  queue, leave objects on screen after a unit dies, or survive scene restart.
- **Watch a long fight for leaks.** Log `scene.children.list.length` per round;
  it must return to baseline between rounds, not climb.
- **Check `basic_attack` fifty times in a row.** If it is annoying by the tenth,
  it is wrong.
- **Check a lane-wide advanced spell** (Fire Ball, Blizzard, Thunderstorm) with
  a full three-slot enemy lane, at both day and night backdrop phases.
- **Check the death path.** A unit that dies mid-effect must not throw.
- **Console must be clean.** Zero page errors across all of it.

---

## 10. Order of work — report between phases

Do not attempt 93 animations in one pass.

1. **Atoms + registry + wiring + contact-sheet harness.** No recipes yet beyond
   one proof. Verify the fallback path still works for every unregistered skill
   — the game must be exactly as it is today with an empty registry.
2. **Phase 1: the nine mage elementals.** Then **stop and report with
   screenshots.** The tier grammar is either working or it isn't, and finding
   out at nine costs nine.
3. **Phase 2: melee.**
4. **Phase 3: rogue / ranger / druid / healer.**
5. **Phase 4: statuses and uniques.**

At each report, say what you changed, what you verified, and what you are unsure
of.

---

## 11. What NOT to do

- Do not change damage, durations, costs, targeting, tier thresholds, or AI.
- Do not add a skill, rename a skill, or rename a tier.
- Do not touch `js/core/` or `js/data/`.
- Do not restructure `scene_combat.js`, `combat.js`, or the event system.
- Do not change the canvas size, the lane geometry (`LANE_X`, `SLOT_Y`), or the
  depth bands.
- Do not add assets, libraries, CDN scripts, or npm packages.
- Do not rewrite `vfx.js`. Grow it.
- Do not make combat slower. If the fight takes longer to watch after your
  change, the change is wrong however good it looks.
- Do not delete anything. If something looks like dead code, leave it and say so
  in your report.
