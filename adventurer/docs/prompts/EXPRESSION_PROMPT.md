# Adventurer — Emotional Expression Upgrade

Paste this whole file as your prompt. It is self-contained.

---

## THE NORTH STAR — read this first

**Every face in this game can already move. Almost none of them say anything.**

`js/ui/portraits.js` ships a working expression layer — `Portraits.express(scene, img, ch, key, mood)` paints a brow pair and a mouth line over any bust, and `Portraits.animate` gives every portrait breath and a blink. Three call sites use it. But the vocabulary is five moods drawn with two straight brow segments and a three-point mouth, the moods are chosen from two or three coarse signals (HP fraction, relationship tier, hunger), **enemies are excluded by a hard `isMonster` return**, and nothing on a face ever *changes in response to a moment* — a heal, a kill, a jilt, a line of dialogue with `[sighs]` in it. A face that is 'angry' for an entire fight is a mask, not an expression.

This brief makes faces **react**: a richer palette of expressions drawn with real geometry, chosen from what the simulation already knows about this second, held for the right length of time, and applied to the player, every NPC, and every enemy — including the wolf and the sentinel.

Nothing here adds a rule, a stat, a system, or a line of dialogue. It is presentation only.

---

## 1. What you are working on

A static Phaser 3 web game (`index.html` + `js/`, no build step). Portraits are **code-drawn on a Canvas texture** (`drawBust`, `drawMonster` in `js/ui/portraits.js`): 220×280, a fixed eye line at `EYE_Y = 118`, eyes at `cx ± 14`, brow at `EYE_Y − 12`, mouth at `EYE_Y + 30`. Every generated bust stores its geometry and palette in `META[key]` (`eyeY, eyeDX, lid, hair, browY, mouthY, monster`) so overlays can be painted in the portrait's own colours without regenerating the texture.

**Where faces appear** (every one of these must pick up the new work):

| Surface | File | Today |
|---|---|---|
| Dialogue box speaker | `js/ui/dialoguebox.js` `show()` | mood from relationship tier / survival state, fixed for the line |
| Combat units, both sides | `js/ui/scene_combat.js` `placeUnit` → `combatMood`, `redrawUnit` | HP fraction + "is it my turn" → afraid / hurt / angry / neutral; **monsters always neutral** |
| Town hub player card | `js/ui/scene_town.js` ~line 62 | hunger / sickness only |
| Town panels (roster, party, hall, store, board) | `town_panels.js`, `town_panels2.js`, `campaign_ui.js`, `campaign2_ui.js` | portraits drawn, **no expression call at all** |
| Cutscenes (ride home, funeral, embark) | `js/ui/cutscenes.js`, `scene_town.js` `playEmbark` | no expression |
| Death screen | `js/ui/scene_death.js` | no expression |
| Creation grid | `js/ui/scene_creation.js` | none (correct — they are looks, not people; leave it) |

**The existing API:**

```js
Portraits.express(scene, img, ch, key, mood)  // mood: neutral|happy|sad|angry|afraid|hurt; returns stop()
Portraits.animate(scene, img, ch, key)        // breath + blink; returns stop()
img.__expressMood                             // current mood, used by redrawUnit to avoid re-painting
```

Keep both signatures working. Every existing caller must keep compiling unchanged; you extend behind them.

---

## 2. What already exists — READ BEFORE YOU BUILD

- **`Portraits.express`** (portraits.js ~line 790): five moods, brows as two straight segments tilted by ±1–4px, mouth as two straight lines meeting at a point offset by ±1–4px. Repaints every frame via `scene.events.on('update')` so it tracks a moving image. Depth `img.depth + 3` (above blink lids at +1).
- **`Portraits.animate`**: breath tween (y ±2, 2.2–3.1s, per-character phase offset) and a blink (skin-tone ellipses over the eyes, 95ms, every 2.6–6.8s). **Monsters get breath only, no blink.**
- **`drawBust`** already has per-portrait personality baked into the *neutral* face: `brow` (0–3 arch), `mouth` (−1..3 curve), `jaw`, `fringe`. These are the character's resting face and must stay — expressions are deltas *on top of* the resting face, never a replacement.
- **`drawMonster`**: `dire_wolf` (animal head: ears, snout, gold eyes, fangs), `plated_sentinel` (helm block, visor slit, two cyan lights), and human-frame monsters (`bandit` masked + hooded, `hedge_mage` hatted, `grave_acolyte` cowled) drawn through `drawBust`. Campaign-2 enemies (20 types × 3 skins) also route through here by `portraitId`.
- **The simulation knows a great deal that faces ignore.** Per character: `ADV.Rel.tierBetween` / `Rel.score` (friendly, romantic, hatred, plus magnitude), spouse and children, the last event that touched them in the world feed (`ADV.World.feeder`), `ADV.Survival.state` (hunger stacks, sickness), gold vs. debt, job/fired/quit state, campaign role (rival / boss / antagonist), heroism/villainy grants, `personalityId` (60 personalities with a register — Sorrowful, Brazen, Grave, Elegant, Unquiet, Bereaved…). In combat: `ADV.Combat` exposes the turn order, each unit's statuses (Bleed, Poison, Burning, Shock, Frozen, Withering, Exposed, Taunt marks, Shield Wall, stealth), intents, kills this battle, whether the unit was just healed / just hit / just missed / just fled, temp HP, conscription.
- **Dialogue lines carry delivery tags** in the data (`[flatly]`, `[sighs]`, `[laughs]`, `[coldly]`, `[warmly]`…) that are stripped for display by `util.renderLine` and sent to the voice. **They are the single richest emotional signal in the game and no face reads them.**
- **`ADV.VFX`** (vfx.js) has `shake`, `scalePunch`, `flashOverlay`, `camShake`, `damageNumber`. Reuse; do not duplicate.

---

## 3. Hard constraints — read twice

- **Presentation only.** No change to any file under `js/core/` or `js/data/`. If you need a signal the core does not expose, read existing state; do not add hooks to core. (One exception permitted: a tiny *read-only* helper in `js/core/util.js` that extracts delivery tags from a raw line, if `util.renderLine` does not already return them. It must be pure and covered in `test/run_tests.js`.)
- **No new textures per expression.** Expressions are overlays painted with `Graphics` over the cached bust, exactly as `express` does now. The texture cache (`cacheKeys`, `META`) stays one entry per character look. A hundred NPCs must not become five hundred canvases.
- **Geometry from META, never hardcoded.** Every overlay is placed from `META[key]` scaled by `img.displayWidth / W`, so the same code works on a 140×168 hub card and a 60×76 combat unit and a 260×330 Hiro reveal.
- **Colours from the portrait.** Brows in the portrait's hair colour, lids and mouth in its skin tone (`META.lid`, `META.hair`). Monsters use their own palette (wolf: fur/gold; sentinel: metal/cyan). Nothing pink-on-brown, nothing white-on-pale.
- **Everything cleans up.** Every overlay, tween and timer dies with its image (`img.once('destroy', …)`) and with its scene (`shutdown`). Panel switches in town destroy and rebuild portraits constantly; a leaked `update` listener is a frame-rate leak.
- **Never fight the blink.** Blink lids stay at depth +1, expression at +3, *transient* expression (see §5) at +4. A blink must still close the eye under a surprised brow.
- **Budget.** Expression painting per frame must stay under 0.2 ms for 18 units on the field (9 per side). Paint only when something changed (`__expressMood` guard exists — keep and extend it to a mood+intensity+transient key). Never `clear()` and repaint on every `update` when nothing changed.
- **Readability at combat size.** At the 60-px-wide combat bust every expression must still read at arm's length on a phone. Brow angle and mouth curve carry the read; if a detail (tear, sweat, vein) is under 2 device pixels at that size, skip it there (`if (w < 90) …`).
- **Landscape phone is the target.** See the mobile pass in README: 1280 design px render at ×0.45 on an iPhone 15.

---

## 4. Part A — The expression palette

Replace the five-mood table with a **palette of 16 moods**, each defined as **geometry, not a sketch**: brow inner/outer height offsets and arch, eyelid openness (0–1, drawn as a skin-tone lid covering the top of the eye), gaze (pupil offset, see Part E), mouth curve, mouth openness (0–1, a dark ellipse behind the line), and an optional accent. The 16 cover the six basic emotions (joy, sadness, anger, fear, surprise, disgust) at two intensities where the game needs both, plus the social states the simulation actually produces (contempt, tenderness, resolve, exhaustion).

| Mood | Brows | Lids | Mouth | Accent | Used when |
|---|---|---|---|---|---|
| `neutral` | resting | 1.0 | resting | — | default |
| `content` | slightly raised, soft arch | 0.9 | small upward curve | — | friendly, paid, fed, healed |
| `happy` | raised, arched | 0.8 (smile squint) | wide curve, slight open | cheek line | romantic, big win, married, child born |
| `laughing` | high | 0.5 | open, wide | — | `[laughs]`, kill on a taunt, Brazen/Rakish wins |
| `tender` | soft, inner ends slightly up | 0.75 | small closed curve, one-sided | — | spouse/child speaking or nearby, a proposal accepted, `[warmly]`/`[softly]` |
| `sad` | inner ends up, outer down | 0.85 | down curve | — | hungry, jilted, declined, `[sighs]` |
| `grief` | as sad, tighter | 0.6 | down, slight open | tear line (skip <90px) | spouse/child/leader died, funeral, bereaved NPC |
| `angry` | inner ends down hard, flat | 0.85 | flat, tight | brow crease | hatred, my turn to strike, `[coldly]`, fired, robbed |
| `furious` | as angry, brows nearly touching | 0.7 | open snarl, teeth line | — | villain, taunt retaliation, boss below 25%, `[shouts]` |
| `disgust` | one brow down, nose-side up | 0.8 | upper lip raised one side, corners down | nose crease | facing undead/forbidden arts, a bribe refused, a hated enemy speaking, `[sneers]` |
| `smug` | one raised | 0.9 | one-sided curve | — | rival lines, Boastful/Silver-Tongued, crit landed, jilter, villain baseline |
| `afraid` | high, inner ends up | 1.1 (wide — thin white sliver above the iris) | small, down, slight open | sweat dot (skip <90px) | < 25% HP, ambushed, fleeing, outnumbered |
| `surprised` | very high, round | 1.15 | small round open | — | **transient**: ambush opens, a reveal, `[gasps]`, a Risen stands up, a crit received (first 200 ms, then `pain`) |
| `pain` | one down one up (asymmetric), squeezed | 0.4 | open grimace | — | **transient**: just took a hit; standing at 0.5 below 55% HP |
| `resolve` | level, slightly down, no crease | 0.8 | closed, flat, corners very slightly down | — | player/hero at low HP who is NOT afraid (Bulwark, Arena Champion, Devoted holders; heroes), Shield Wall / Stone Stance active, `[firmly]`/`[steadily]` |
| `dazed` | flat, low | 0.55 | slack, slight open | — | Frozen, Shock, conscripted, undead, exhausted (4 hunger stacks), `[wearily]` |

Rules:
- Every mood also has an **intensity 0–1** that scales its offsets, so 'sad 0.3' is a flicker and 'sad 1.0' is a face you can read across a room. Hunger stack 1 vs 4, HP 50% vs 26%, relationship score magnitude — all map to intensity.
- **Asymmetry is allowed and encouraged** (`smug`, `pain`, `disgust`); mirrored faces read as masks.
- Draw brows as **quadratic curves** through three points (inner, mid, outer), not two straight segments. Draw the mouth as a quadratic through three points with an optional filled dark ellipse for openness. Lids are skin-tone half-ellipses from the top of the eye down by `(1 − openness) × eyeHeight`; openness above 1.0 paints a thin white sliver above the iris (wide eyes).
- Neutral at intensity 0 draws **nothing** (keep the current fast path).
- **Fear vs. resolve is a character choice, not an HP threshold.** Below 25% HP the default is `afraid`; holders of survival perks, heroes, bosses (→ `furious`) and personalities in the Severe/Disciplined/Composed/Grave group get `resolve` instead. This is the single most character-revealing rule in the brief — get it right.
- Expose `Portraits.MOODS` (the table) and `Portraits.express(scene, img, ch, key, mood, intensity)` — the sixth argument optional, default 1, so existing callers work unchanged.

## 5. Part B — Transient expressions (the part that makes faces alive)

Add `Portraits.react(scene, img, ch, key, mood, { ms = 700, intensity = 1 })`: paints `mood` at depth +4 **on top of** the standing expression, eases in over ~80 ms, holds, eases out over ~200 ms, then removes itself, restoring whatever the standing mood was. Reactions queue (a heal landing during a pain flinch plays after it, not over it), and a new reaction of the same mood while one is running just extends the hold.

Wire it to moments the game already has:

**Combat** (`scene_combat.js`, in the effect handlers that already call `V.shake` / `V.scalePunch` / `damageNumber`):
- took damage → `pain` (intensity by fraction of max HP lost; ≥ 30% also `V.shake`, already there)
- took a crit / execute → `surprised` 1.0 for 200 ms, then `pain` 1.0 for 900 ms, then `afraid` 0.6 (or `resolve` per §4)
- healed → `content` 600 ms (and `relief` is `content` with lids 0.7 — implement as intensity of `content`, do not add a 13th mood)
- landed a kill → attacker `smug` 900 ms; Arena Champion / Brazen / Boastful → `laughing`
- missed / was dodged → attacker `angry` 500 ms at 0.5
- ally fell → every living ally on that side `afraid` 800 ms at 0.5; a spouse/parent/child of the fallen → `grief` 1400 ms at 1.0
- taunted / marked → `furious` 700 ms on the taunted unit
- Frozen / Shocked applied → standing mood forced to `dazed` for the duration (statuses are on the unit; read them in `combatMood`)
- fled → `afraid` 1.0 as the exit plays
- ambush opens / a Risen stands up / the Pale Mother raises the party's dead → every unit on the ambushed side `surprised` 500 ms, then their standing mood
- a spouse, parent or child is on the field → standing mood gains a `tender` 0.3 tint on the *ally's* turn (the pair glance at each other — see Part E gaze)
- facing an undead or a forbidden-arts user → non-undead units `disgust` 0.4 standing while it lives (Cleanse users and the Radiant-aligned at 0.7)
- **enemies get every one of these.** Remove the `isMonster` early-return in `express` and the `u.ch.isMonster` guard in `combatMood`. Human-frame monsters use the human path. Wolf and sentinel use **Part C**.

**Dialogue** (`dialoguebox.js`): parse the delivery tags out of the *raw* line before `renderLine` strips them and map them to a reaction that plays as the line opens: `[laughs]`→laughing, `[sighs]`→sad 0.6, `[coldly]`/`[flatly]`→angry 0.4 with lids 0.8, `[warmly]`→content, `[sadly]`→sad, `[nervously]`→afraid 0.5, `[smirks]`/`[dryly]`→smug, `[shouts]`/`[angrily]`→furious, `[wearily]`→dazed 0.5, `[gasps]`→surprised 0.9 for 400 ms; `[softly]`/`[gently]`→tender; `[sneers]`/`[disgusted]`→disgust; `[firmly]`/`[steadily]`/`[grimly]`→resolve. Unknown tags → no reaction. Build the map as a data table at the top of the file; list every tag that actually occurs in `js/data/dialogue*.js` and `campaign*_dialogue.js` (grep them — do not guess) and make sure each has an entry or is deliberately in an `IGNORE` set. **The standing mood under the reaction** is chosen per §6.

**Town**: arrival notices already tell you what just happened (a child born, a proposal, a jilt, a firing, a marriage, a death, a theft, a rescue accepted). When a notice opens with a portrait, `react` the right mood on it: birth→happy, proposal→content/afraid by the asker's warmth, jilt→grief on the jilted / smug on the jilter, fired→angry, hired→content, death→grief, theft→angry, hero invitation→content.

---

## 6. Part C — Standing mood from the whole simulation

Replace the three ad-hoc mood pickers (dialoguebox, combat, town) with **one function**, `Portraits.moodFor(game, ch, context)` in `portraits.js`, returning `{ mood, intensity }`. `context` is `'dialogue' | 'combat' | 'town' | 'roster' | 'cutscene' | 'death'`, plus optional `{ unit, st }` in combat. Priority order, first match wins, each carrying its own intensity:

1. **Combat state** (combat only): dead → nothing; Frozen/Shock/conscripted → `dazed`; HP < 25% → `afraid` (bosses and villains → `furious` instead — a boss that gets *angrier* as it dies is the read you want); HP < 55% → `pain` 0.5 standing (a held wince, not a flinch); it is my turn → `angry` 0.6; enemy with Taunt mark → `furious` 0.5; stealthed → `smug` 0.4.
2. **Undead / Risen** → `dazed` 0.8 always, over anything below.
3. **Survival** (player and NPCs both — `Survival.state` works for NPCs too): sick → `pain` 0.6; hunger stacks 1–4 → `sad` 0.3–1.0.
4. **Recent event** (last ~2 world ticks in the feed involving this character): bereaved → `grief`; jilted → `sad` 0.8; married/child born → `happy`; fired/robbed → `angry` 0.7; became a hero → `content`; became a villain → `smug`.
5. **Relationship to the player** (dialogue/town/roster): romantic → `tender` 0.8 in dialogue and town, `happy` 0.9 on a good event (or `content` if the personality is Composed/Formal/Grave — read the register); friendly → `content` 0.6; hatred → `angry` scaled by magnitude (`Rel.score`); rival (campaign) → `smug` 0.7; antagonist → `furious` 0.6 when facing you, `smug` otherwise.
6. **Personality baseline**: each of the 60 personalities gets a resting *bias* — Sorrowful/Bereaved/Grave → `sad` 0.25; Brazen/Rakish/Boastful → `content` 0.35; Severe/Commanding/Disciplined → `angry` 0.2 (stern, not hostile); Unquiet → `dazed` 0.4; Silver-Tongued/Elegant → `smug` 0.3; Watchful/Composed → `neutral`; Exacting/Formal → `disgust` 0.15 (a permanent faint disapproval); Patient/Dutiful → `resolve` 0.2; Sultry/romantic-coded → `tender` 0.2. Put the table in `portraits.js` keyed by personality id, all 60 filled in; Hiro gets `smug` 0.3.
7. `neutral`.

Every surface in the table in §1 calls `moodFor` and passes the result to `express`. The **town panels that draw portraits today with no expression** (roster, party, hall, store, board, campaign halls) get it too — a roster of forty faces that all look the same is exactly the problem this brief exists to fix.

**Player character**: same function. In the hub card the player's face should show hunger, sickness, grief, a fresh marriage, and being a villain. In combat the player's face is the most-watched face on the screen — every transient in Part B applies.

---

## 7. Part D — Non-human enemies

`dire_wolf` and `plated_sentinel` have no brows or mouth in the human sense. Give each a **three-state expression rig** driven by the same `mood` vocabulary, mapped down:

- **Wolf**: ears (flat back = afraid/pain, forward = angry/furious, neutral otherwise), eye squint (lid openness), lip line over the fangs (raised = furious snarl showing more fang; slack = dazed). Map: angry/furious→ears forward + snarl; afraid/pain→ears back + squint; dazed→ears half, slack jaw; content/happy/smug→neutral (a wolf does not smile — do not draw one).
- **Sentinel**: the two visor lights change **size and brightness** (afraid: dim and small; angry: bright; furious: bright with a red tint; dazed: flicker between 0.3 and 0.8 alpha; pain: one light out for the hold). No brows, no mouth — the helm is the face.

Both rigs are painted as overlays from a `META` entry that records ear anchor points / light positions, exactly as the human rig uses `browY`/`mouthY`. Store the anchors when `drawMonster` runs.

**Campaign-2 monsters with three skins each** all route through `drawBust` — they are human-frame and get the human rig for free. Confirm by loading every `portraitId` in `ADV.DATA.ENEMIES` and campaign-2 data once in the test (§12) and asserting `META[key].monster` and a rig type are set.

---

## 8. Part E — Life beyond the brow line (do after A–D land)

Expressions are meaning; these are *presence*. Each is an overlay or a tween on the existing cached bust — still no new textures per state.

1. **Gaze.** Pupils are drawn as an overlay already (blink proves the eye geometry is known). Add `Portraits.look(img, dx, dy)`: repaint the iris+pupil offset up to ±3 px (scaled) toward a target. In combat the active unit looks at its target lane; everyone else looks at the active unit; the player's units glance at the player's own portrait when it is hit. In dialogue the speaker looks at the player's card; on `[looks away]`/`sad`/`shame`-coded lines the gaze drops down-and-aside. Saccade every 1.5–4 s at rest (±1 px) so eyes never sit dead. Skip below 90 px.
2. **Lip flap on voice.** `ADV.Music.speakFile` plays the VO clip through an `<audio>` element. Route it through a `WebAudio AnalyserNode` (one shared context, created on first user gesture — mobile autoplay policy) and drive mouth openness 0–0.6 from RMS amplitude at ~15 Hz while the clip plays. Falls back to a 3-frame flap timed to word count when the analyser is unavailable or the line is silent text. Lip flap composes *under* the expression's mouth curve — a sad speaker still looks sad while talking.
3. **Head micro-motion.** Nod (y −3 then back, 220 ms) on accept/agree/hired/proposal-accepted; head shake (x ±3, two beats) on decline/refuse/jilt; tilt (rotation ±0.04 rad, 300 ms) on a question or `[curious]`. Recoil (rotation away from the hit side ×0.06 rad + the existing shake) on damage; slump (y +6, rotation 0.05, 600 ms) when a unit falls, before the fade.
4. **Skin states.** Palette-shift overlays over the face mask (a semi-transparent ellipse in `META` geometry): pale (white 12%) under 25% HP and when afraid; flush (red 10% on cheeks) on angry/furious/romantic/laughing; grey-green (8%) when Poisoned or sick; blue rim (edge glow) when Frozen; ember flicker at the jaw when Burning; a red streak from brow to cheek on a crit that stays for the fight (the wound). All skipped below 90 px except pale and the wound.
5. **Hair and cloth on impact.** Hair-front is drawn separately in `drawBust`; record its bounding box in `META` and on a hit tween a 2-frame horizontal shear of the hair region (a Graphics mask over a cropped copy of the texture — one cached crop per look, not per state). Same for a hood or cowl.
6. **Camera.** On a crit, execute, or boss phase change, the combat camera zooms 1.0→1.06 on the victim's bust for 180 ms and back. Never more than once per 1.5 s.

## 9. Part F — Drawing quality (the bust itself)

The busts are honest placeholders (§1a) and a PNG loader may replace them later. Until it does, the following raise the read of every face without changing keys, geometry anchors, or the layered draw order that hair-back / head / features / hair-front / wardrobe already establish:

- **Eyes.** Almond eye-white (a lens shape, not an ellipse), iris as a radial gradient with a darker limbal ring, a 1.5 px specular highlight at upper-left (the lighting key is left-high already), a lower-lid line at 40% alpha. This alone is most of the difference between a doll and a person.
- **Nose.** Replace the single "nose hint" stroke with a bridge shadow (soft, right side per the key), a nostril pair, and a tip highlight — three marks, still under 20 px.
- **Mouth.** A two-tone lip: upper lip darker than lower, a philtrum shadow above, a corner dot each side. The expression mouth curve then deforms *this* rather than a bare line.
- **Form shading.** The face currently has one shade ellipse and one highlight ellipse. Add: temple/cheekbone plane (a soft diagonal on the shaded side), jaw underside shadow onto the neck, brow-ridge shadow under each brow, and a rim light on the lit side of the hair silhouette. Use `ctx.filter = 'blur(…)'` where available with a hard-edge fallback.
- **Hair.** Strand groups: 4–7 darker strokes following each hairstyle's silhouette and 2–3 highlight strokes on the lit side, seeded per character so two 'long' hairstyles do not match. Fringe shadow onto the forehead.
- **Skin variety.** Per-seed freckle scatter (women and men, 0–12 dots, 30% of seeds), an undertone shift (warm/cool ±4% hue) so two 'brown' seeds differ, age lines for rank ≥ 6 (crow's-feet, nasolabial) extending `applyVeteran`.
- **Wardrobe.** Fold lines (3–5 strokes) and a collar shadow on the neck; a seam highlight along the lit shoulder.
- **Monsters.** Wolf: fur direction strokes on the ruff, wet nose highlight, a torn ear on the boss tint. Sentinel: rivet row, scratch marks, a dent on the boss tint, heat-haze glow behind the visor at high alpha.
- **Consistency guard.** A contact-sheet test (§12) renders the 17 creation slots × 2 sexes plus 12 NPC seeds and both monsters, before and after; every face must keep its eye line at `EYE_Y ± 1` and its silhouette within 4 px of the previous render, so the expression anchors in `META` stay valid and the creation grid still matches its old screenshots.

## 10. Part G — Body and costume (the shoulders down)

Today `drawWardrobe` paints **one torso shape for everyone** — the same shoulder curve for a woman and a man, a wolf-slayer and a scribe — and then a handful of strokes per garment kind: `armor`/`samurai` share pauldrons and a collar (samurai adds a katana hilt), `ninja` is a dark fill with a mesh collar, `pirate` an open-collar shirt, `navy` a couple of straps. Gear sets differ **only by colour** (`SET_LOOK`). Nothing below the chin says who this person is. Fix that.

**G1 — Two silhouettes, three builds.**
- **Women** get a distinct torso: shoulders ~12% narrower than men's, a visible collarbone line under an open neckline, and a **bust contour** — two soft shaded curves below the neckline with a light centre shadow — drawn *under* the garment so cloth follows the body and armour is shaped (a breastplate has form; a dress has a neckline that sits on the chest, not a flat wall). Proportion is ordinary and natural: this is a JRPG bust crop, the goal is that a woman reads as a woman at 60 px, not fan-service. Wardrobe that bares the shoulders (`dress`, `hide`, the pirate shirt) shows the upper curve; closed garments (`armor`, `navy`, `robe`) show it only as shaping in the cloth or plate.
- **Men** get three builds seeded per character, biased by role: **lean** (narrow shoulders, long neck — mages, healers, rogues), **broad** (wide shoulders, trapezius rise, visible deltoid line — fighters, rangers), **heavy** (thick neck, sloped mass, wider jaw — tanks). Rank ≥ 4 fighters/tanks add a defined pectoral shadow and a thicker neck (extend `applyVeteran`). Sleeveless kinds (`hide`, the pirate shirt) show the arm/shoulder muscle line; armour implies it in the pauldron scale.
- **Women also get builds** (lean / athletic / sturdy) driving shoulder width, neck and arm line — a female tank is sturdy, a female rogue is lean.

**G2 — Gear sets that look different, not just recoloured.** Each `SET_LOOK` entry gains a three-colour palette (`base`, `trim`, `metal`) and a **pattern**, so the 24 sets are 24 costumes:

| Set | Pattern | Palette |
|---|---|---|
| `warrior` | segmented steel plate: gorget, 3 chest lames with edge highlights, riveted pauldrons | grey steel / dark leather / bright steel |
| `mercenarys_gear` | brown leather cuirass with steel plates buckled on, mismatched pauldrons | oiled brown / iron / brass buckles |
| `plate` | full plate with a raised centre ridge, engraved line on the breast, cloak | pale steel / crimson cloak / gold edge |
| `oath` | white-enamelled plate with a gold sun on the gorget, cloak | ivory / gold / steel |
| `green_eyed_armour` | **samurai** lamellar: 4 rows of laced plates across the chest, `sode` shoulder guards, `kabuto` helm with a crest | lacquered green / gold cord / black iron |
| `assassins_gear`, `shinobi_gear`, `shadowweave`, `leathers` | **ninja**: wrap hood + face cowl (shinobi shōzoku), crossed chest ties, forearm wraps; shinobi adds a clan-knot at the collar; shadowweave a cloak | indigo-black / dark grey tie / no metal |
| `privateers_kit` | **pirate**: open shirt, brocade coat with wide turned lapels, sash at the waist, bandana or tricorne, one earring, a pistol grip at the sash | oxblood coat / gold brocade / brass |
| `kings_uniform` | **navy**: double-breasted coat, gold epaulettes, white cross-belt, a column of brass buttons, neck stock; officers (rank ≥ 4) a bicorne | navy blue / white / gold |
| `mage`, `battle_mages_gear`, `adept` | robe: high collar, layered front panel, embroidered hem line at the crop; battle mage adds a steel gorget | violet / silver thread / — |
| `healer`, `chantry` | robe: simple front, a stole in the trim colour, a small pendant | sage / cream / silver |
| `ranger`, `hunter`, `greenward` | quilted jacket, leather shoulder strap with a quiver line, cap; greenward adds a leaf-green cloak | moss / brown leather / dull bronze |
| `wildhide` | asymmetric fur-and-hide wrap over one shoulder, bone or tooth necklace, bare other shoulder | tan hide / dark fur / bone |
| `duelist` | fitted coat with a stand collar, sash, rapier guard at the hip line | wine / black / silver |
| `street` | hooded jacket, cloth mask, patched shoulder | grey-brown / rust / — |

Each set draws the **same costume on both sexes** with the G1 silhouette underneath — a kunoichi's wrap and cowl fit her frame, a female samurai's lamellar is shaped at the chest and follows the same lacing. Faction gear on **campaign NPCs, enemies and bosses** uses these recipes too (Green-Eyed recruits in green lamellar, Admiralty marines in the navy coat, Red Tally hands in the open shirt and sash, Hollow Bell initiates in the wrap) — the doc's three skins per enemy type become palette swaps of the right costume, which is what "skin" was meant to be.

**G3 — Costume fidelity checklist.** Before signing off, each of these must be identifiable *from the silhouette alone* at 60 px, no colour: ninja (cowl + crossed ties), samurai (lamellar rows + sode + crest), pirate (lapels + bandana/tricorne), navy (epaulettes + cross-belt + buttons), plate (gorget + ridge), robe (high collar + panel), hide (one bare shoulder). Render the checklist as greyscale thumbnails in the §11 contact sheet and look at it.

**G4 — Detail budget.** Costume detail is drawn once into the cached texture, so it costs nothing per frame; spend it. Rivets are 1.5 px dots in a row, lamellar lacing is 1 px cross-hatching, brocade is a 2-px sinusoid along the lapel. Everything under 1 device pixel at 60 px is skipped there (`if (W_out < 90)` at draw time — pass the target size into `drawWardrobe`, or draw full detail and accept that it softens on downscale; test both and pick by the contact sheet).

**G5 — Keep the anchors.** Nothing in G1–G4 moves the eye line, the head, or the hair layers. `chinYOf`, `EYE_Y`, `META` geometry are untouched; only the region from the neck down changes. The creation grid's 17 slots must still read as the same 17 people afterwards — the consistency guard in §9 covers the head; extend it to assert the torso bounding box stays inside the frame and the neck joins the jaw.

## 11. DO NOT ERASE EXISTING FEATURES — non-negotiable

- The **blink** and **breath** in `Portraits.animate` stay exactly as they are, including the monster no-blink rule (the sentinel does not blink; the wolf may — add a wolf blink only if you also record its eye geometry in META).
- **Resting-face variety** (`brow`, `mouth`, `jaw`, `fringe` in the recipes) stays. Expressions add to it.
- **Set looks and veteran marks** (`applySetLook`, `applyVeteran`) stay and still key the texture cache. Part G extends `SET_LOOK` entries; it does not rename or remove any set id.
- The **`__expressMood` guard** in `redrawUnit` stays (extend the key; do not remove the check).
- **Portrait cache keys are stable** (`pp5_`, `pn6_`, `pm6_`, `pc5_`, `pr5_`) — the README promises a PNG loader can map onto them later. Do not rename.
- **Dialogue text and voice** are untouched: tags still stripped for display, still sent to the voice. You are *reading* the tags, not moving them.
- `scene_creation.js` portrait grid stays expressionless.
- Existing suites: `npm test` (all headless) and `npm run test:browser` must pass after your change, unchanged unless a test asserts the old five-mood behaviour, in which case update the assertion and say so.

---

## 12. Verification

Add `test/expressions.js` (headless, no Phaser) and `test/browser_expressions.js` (Playwright), wired into `npm test` / `npm run test:browser`:

**Headless**
- `Portraits.MOODS` has exactly 16 entries; every entry has brows, lids, mouth, and each numeric field is finite.
- `moodFor` returns a valid mood for: player at hunger 0/2/4, sick; NPC at each relationship tier; a bereaved NPC; a Risen; a Frozen unit; a boss at 20% HP (→ furious, not afraid); an antagonist facing the player; each of the 60 personality ids with no other signal (→ its baseline). Intensity always in [0, 1].
- Delivery-tag parser: every tag that appears in the dialogue data maps to a reaction or is in `IGNORE`; assert the union covers the set found by regex over the data files, so a future line with a new tag fails the test rather than silently doing nothing.

**Browser** (server on :8734, 1340×820 and iPhone 15 landscape)
- Start a fight via the debug hall skip; assert enemy units carry a non-neutral mood at some point in the first three rounds (`img.__expressMood !== 'neutral'` for at least one monster).
- Deal a hit; assert a `pain` reaction overlay exists for ≥ 300 ms then is gone by 1500 ms and the standing mood is restored.
- Open a dialogue line known to carry `[laughs]`; assert a `laughing` reaction plays.
- Frame-time: with 18 units on the field and all expressions active, `game.loop.actualFps` stays ≥ 50 over 5 seconds at 1340×820 (Chromium headless). Print the number.
- Contact sheet of every `SET_LOOK` set × both sexes × three builds at 220×280 and 60×76, plus the G3 greyscale silhouette row. **Look at it.** Any two sets that are indistinguishable in greyscale fail.
- Screenshot each of the 16 moods on one bust at 220×280 and at 60×76 into `/tmp/shots/expr_*.png`, plus the wolf and sentinel at angry / afraid / dazed. **Look at them.** If a mood is not distinguishable from its neighbours at 60 px, fix the geometry, not the test.
- Roster panel: at least 4 distinct moods visible across the first 12 NPCs in a fresh world (personality baselines guarantee this).
- No leaked `update` listeners: open and close the roster panel 20 times, assert `scene.events.listenerCount('update')` returns to its starting value.

---

## 13. Order of work — report between parts

1. **Part A** — palette + geometry, `express` gains intensity, the 12-mood contact sheet screenshot. Stop and show the sheet.
2. **Part D** — wolf and sentinel rigs, added to the sheet.
3. **Part C** — `moodFor`, wired into every surface in §1 including the expressionless town panels.
4. **Part B** — `react`, wired into combat, dialogue tags, town notices.
5. **§12 tests**, then `npm test`, `npm run test:browser`, `npm run lint`.
6. **Part F** (drawing quality) with the consistency guard — one feature at a time, contact sheet after each, stop if any anchor drifts.
7. **Part G** (body and costume) — G1 silhouettes first with a before/after sheet of the 17 creation slots × 2 sexes, then G2 one set at a time against the G3 checklist, then faction NPCs/enemies.
8. **Part E** (gaze, lip flap, head motion, skin states, hair, camera) — in that order; each is independent and can ship alone.

Report after each part with: files touched, what the player now sees that they did not before, and any place you had to read state the core did not make convenient.

---

## 14. What NOT to do

- Do not generate image assets, sprite sheets, or AI portraits. This is code-drawn overlays on code-drawn busts.
- Do not add moods beyond the 16. If you want a 17th, it is an intensity or an accent of an existing one.
- Do not touch `js/core/` except the one permitted pure helper.
- Do not make expressions permanent state on the character (`ch.mood = …`). Mood is derived, every time, from what is true.
- Do not animate brows every frame for idle life — breath and blink are the idle; expressions are meaning.
- Do not let a reaction outlive its image, its panel, or its scene.
