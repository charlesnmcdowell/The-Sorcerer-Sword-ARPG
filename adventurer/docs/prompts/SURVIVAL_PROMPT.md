# Adventurer — Survival, Shelter, and the Town Split

Paste this whole file as your prompt. It is self-contained.

---

## THE NORTH STAR — read this first

**Right now the town is a shop and a bed. Nothing about staying alive between
contracts costs the player anything.**

Food exists, but it is a small optional stat bonus — skip it and nothing
happens. Housing exists, but it is a cosmetic backdrop change and a spouse cap —
sleep in a ditch forever and the game never objects. The Store sells food, gear,
insurance and murder from one counter, so none of the four reads as a place.

This brief makes the space between quests a real part of the game. After this:

1. **You have to eat.** Come back from a contract without a meal and you are
   Hungry, and Hungry hurts. Ignore it four times and it kills you.
2. **You have to keep moving up.** Sleeping rough for too long makes you Sick,
   and any spouse leaves a man who cannot house them. Get a room, and the clock
   starts again toward the next roof. It ends at the brick house, which is where
   you are finally settled.
3. **The town becomes places.** The Store splits into a Grocer, a Blacksmith,
   and an insurance desk that the tutorial actually explains.
4. **You can see what you are wearing, and read the face.** Gear sets on the
   portrait, and expression on top of the blink.

This one is different from the last two briefs: **it changes rules.** Hunger and
shelter alter stats, HP, spouses, and the gold economy. That means the headless
test suite *does* cover most of this, and it is not optional. It also means
balance can break, and §10 tells you how to prove it did not.

---

## 1. What you are working on

**Adventurer** is a finished, playable Phaser 3 web RPG at
`C:\Users\charl\The Sorcerer Sword ARPG\adventurer`. A menus-and-portraits RPG —
no traversable map. The player takes contracts from a board, fights three-lane
tactical battles, and manages a guild roster of simulated NPCs. Death is
permanent.

**Stack:** Phaser 3.87, plain `<script>` tags, no bundler, no build step.
Everything hangs off a global `ADV.*`.

```
js/data/   pure data tables       (constants, skills, tutorial, names)
js/core/   Phaser-free logic      — runs headless in Node, IS covered by tests
js/ui/     Phaser scenes/panels   — NOT covered by tests, verify in a browser
```

`index.html` lists every script. `test/harness.js` has a `FILES` array that
**must mirror `index.html` exactly** for `js/data` and `js/core` —
`test/run_tests.js` asserts it. **If you add a file under `js/core` or
`js/data`, you must add it to both.**

**Canvas is fixed at 1280×760.** Do not change it.

---

## 2. What already exists — READ THIS BEFORE YOU BUILD ANYTHING

Several things in this brief are **already built**. Extend them. Do not
reimplement them, and do not "replace" them with a better version.

| already exists | where | what it means for you |
|---|---|---|
| **Six-rung housing ladder** | `js/core/housing.js` — `camp`(0g) → `inn`(100g) → `cottage`(200g) → `brick`(350g) → `mansion`(500g) → `castle`(1000g), with `Housing.rank()`, `Housing.buy()`, `Housing.spouseCap()` | the shelter ladder is **already the right shape**. You are adding a *timer* against it, not building it |
| **Spouse caps by home** | `HOMES[].spouses` = 1,1,1,**2**,3,5 | brick house is already where a second spouse becomes possible. The design lines up — brick is the settle point |
| **Meals, one per quest** | `Character.eat`, `Character.digest`, `ch.meal`, `ADV.DATA.FOODS` (7 foods, 5–15g) | the eating verb exists. Hunger is the *consequence* of not using it |
| **One stat chokepoint** | `Character.effStat(ch, key)` at `character.js:91`, and `Character.maxHp = effStat('hp')` | **every stat and HP flows through one function.** A single multiplier here does everything §4 asks. Do not scatter modifiers |
| **The per-quest tick** | `ADV.Character.digest(p)` is called at `game.js:215` (stay home) and `game.js:599` (quest resolved) | those two call sites are exactly "a quest has passed." Hook there |
| **Jilting** | `Rel.jilt(world, leaver, abandoned)` in `relationships.js:237` — handles the player-as-abandoned case, sets `world.pendingPlayerJilt`, fires the UI choice | the auto-jilt in §5 **calls this**. Do not write a second jilt path |
| **Insurance** | `Vault.payPremium`, `v.insuranceActive`, `Vault` death claim at `vault.js:184` | fully working. §6 only moves its *door*, not its logic |
| **Gear sets floor skills at Intermediate** | `GEAR_SET_FLOOR_LEVEL: 10` and `TIER_THRESHOLDS.intermediate: 10` are **the same number**. `SkillSys.gearFloor` / `effectiveLevel` | "a set that gets skills to intermediate" **is what a set already does.** §7 is about *more sets and better coverage*, not a new mechanic |
| **Gear sets are already drawn on the portrait** | `SET_LOOK` in `portraits.js:548` maps 11 set ids → `{wardrobe, color, headwear, cloak}`; `applySetLook` applies it; the cache key already carries `setBit = '_s'+ch.equippedSet` | **the user thinks this might not be possible. It already works.** §8 is about giving the *new* sets their looks and widening the wardrobe vocabulary |
| **Veteran marks** | `applyVeteran` — scars past 6 quests, greying at rank 4+, heavier jaw at rank 5 | already shipped |
| **Portrait blink + breathe** | `Portraits.animate(scene, img, ch, key)` at `portraits.js:735` — lids drawn as Phaser `Graphics` **over** the baked texture, positioned from `META[key].eyeY/eyeDX`, self-cleaning on `img.destroy` | **this is the exact pattern §9 uses for expressions.** Copy its shape |

Wardrobe kinds that already draw: `armor`, `ninja`, `dress`, `suit`, `hiking`,
`hide`, `robe`, `samurai`, `pirate`, `navy`. Headwear: `helm`, `cap`, `hood`.
Plus a `cloak` flag and an `extras` hook (`mask`, `bandana`, `tricorne`,
`bicorne`).

---

## 3. Hard constraints

**ALL ART IS CODE. This is absolute.** No budget for assets, none will be
commissioned. Every visual is drawn at runtime with Phaser `Graphics`, primitive
game objects, or canvas-texture drawing (`scene.textures.createCanvas`, which is
how portraits are made). No image files, sprite sheets, icon fonts, or external
art. Do not add them. Do not suggest them.

**Target aesthetic: old-school RuneScape.** Flat fills, silhouette over interior
detail, one light direction (upper-left), small saturated accent against a
desaturated ground, chunky high-contrast UI. Slight asymmetry reads as
handmade.

**No dependencies.** No npm packages, no CDN scripts.

**Save compatibility is mandatory.** Every new field must default sanely when
absent. A save written before this change must load and play. See §11.

---

## 4. Part A — Hunger

### The rule

- A quest resolving (win, lose, or stay-home) **digests the meal**, as it
  already does.
- If the player had **no meal** on that quest, they gain **one Hunger stack**.
- If they had a meal, Hunger **clears entirely** — eating cures it, not just
  pauses it. One meal wipes the stack.
- Each stack costs **25% of stats and max HP, additively**:
  `mult = 1 - 0.25 × stacks` → 0.75, 0.50, 0.25, **0.00**.
- **At 4 stacks the player is dead.** Route it through the existing death path
  (`Game.onPlayerDeath`), not a special case — reincarnation, nepotism, the
  death scene and the obituary all have to work.

> **Use additive stacking, exactly as written.** Multiplicative (0.75⁴ ≈ 0.32)
> would leave the player alive at a third strength, which is not the design.
> Additive reaches zero on the fourth stack, which is what "after 4 quests they
> die" means. Write it as a constant, not a magic number.

### Where it goes

`Character.effStat` is the only place that needs to know:

```js
const m = ADV.Survival ? ADV.Survival.statMult(ch) : 1;
if (m !== 1) v = Math.max(0, Math.round(v * m));
```

Because `maxHp` is `effStat('hp')`, HP follows for free. **Do not add a second
multiplier anywhere.** If you find yourself editing combat damage math, stop —
you have already got it wrong.

Current HP must be clamped to the new max when a stack lands, or the player
walks around with more HP than their maximum.

### New file

Put the whole system in `js/core/survival.js`. It is Phaser-free, so it is
testable, and it must be added to **both** `index.html` and `test/harness.js`
`FILES`. Export `ADV.Survival` with at least:

```
Survival.state(ch)              // { hunger, questsSinceShelter, sick }, created on demand
Survival.statMult(ch)           // 1 - 0.25*(hunger + sick ? shelterStacks : 0), floored at 0
Survival.onQuestResolved(game)  // the whole per-quest tick; returns what changed
Survival.eatCures(ch)           // called from Character.eat
Survival.shelterDeadline(ch)    // quests remaining before sickness
Survival.warnings(game)         // [{severity, text}] for the UI to display
```

Hunger and sickness stacks are **the same currency** — they add together into
one multiplier, and four total kills you. Do not build two separate death
checks.

---

## 5. Part B — Shelter and sickness

### The rule

- The player has a **shelter clock**: quests completed since they last moved up
  a rung.
- **Five quests on a rung without moving up** and they get **Sick**.
- Sickness has **the same effect as hunger** — it feeds the same stacking
  multiplier, and it keeps stacking each further quest.
- Sickness **also auto-jilts every spouse.** Call `Rel.jilt(world, spouse,
  player)` for each partner — leaver is the spouse, abandoned is the player.
  That already routes to `world.pendingPlayerJilt` and gives the player the
  hate-or-forgive choice, and it already handles the Lookism perk. Do not write
  a second path.
- Moving up a rung (`Housing.buy` succeeding) **clears sickness and resets the
  clock to five.**
- The ladder for this purpose is `camp → inn → cottage → brick`. **At `brick`
  and above, the clock stops permanently.** No more sickness, ever, for that
  life. Mansion and castle are pure upside — more spouses, no obligation.

So the schedule is: 5 quests to afford the inn (100g), 5 more to the cottage
(200g), 5 more to the brick house (350g). Settled by quest 15 for 650g total.

### Sickness must be visible before it bites

A debuff that arrives without warning reads as a bug. Required:

- The character panel shows the shelter clock as plain text from the moment
  there are **two quests left**, in `T().css.blood`.
- The departure modal (`Panels.departure`) warns before a quest that would
  trigger sickness — this is the last screen before the player commits.
- Hunger stacks show on the character panel whenever above zero, with what they
  cost: *"Hungry ×2 — half your strength."*
- The Home panel shows the deadline against each rung the player could buy.

The player must never be surprised by this. Being *squeezed* is the design.
Being *ambushed* is a bug.

---

## 6. Part C — Split the Store into places

Today `Panels.store` (`town_panels.js:168`) is one panel with a Food/Gear tab
pair, and the Gear tab also holds insurance and the assassin's desk. Split it:

| new menu entry | panel | holds |
|---|---|---|
| **Grocer** | `Panels.grocer` | the seven foods. This is where hunger is cured, so it says so |
| **Blacksmith** | `Panels.blacksmith` | gear sets — buy, wear, sell, and the spouse-buys-it button |
| **Insurance** | `Panels.insurance` | the premium and what it pays. Its own door, explained properly |
| **The Maw** | `Panels.assassinsDesk` | already its own function — give it its own door too, or leave it under the Blacksmith, but decide deliberately |

- Rename the Store to **Grocer** in the town menu, not "Store (Food)".
- **Keep `Panels.store` as a working alias** that forwards to `Panels.grocer`,
  and keep `openPanel('store')` working. `tutor.js` references `'store'` in its
  `TOUR` array and `Tutor.allowed` gates on panel ids — a rename that breaks the
  tutorial is a regression.
- Menu order should read as a town, not a list: Quest Board, Grocer, Blacksmith,
  Innkeeper/Home, Trainer, Insurance, then the social panels as they are.
- Each panel gets its own header line in the existing voice. The current
  combined blurb tries to explain four things in one sentence; split it.

### Tutorials

The user asked specifically that **insurance be explained in the tutorial.**
Two places, both already structured for it:

1. `TOUR` in `js/ui/tutor.js:13` — the guided walk. Its current `store` entry
   crams gear, food, insurance and the Maw into one line. Split into a Grocer
   line, a Blacksmith line, and an Insurance line that actually explains it:
   *who pays, what it costs, when it pays out, and that it burns on claim.*
2. `ADV.DATA.PROMPTS` in `js/data/tutorial.js` — fire-once contextual lines,
   which land in the Codex automatically. Add prompts for the new systems:
   first hunger stack, two quests from sickness, first sickness, first jilt
   caused by sickness, first insurance offer, first meal that cures hunger.

Every prompt is **one sentence**, in the existing voice — plain, concrete,
slightly grim, never a tooltip. Look at the existing 45 for register.

---

## 7. Part D — More gear sets

Only four sets are buyable today: `warrior` (tank+fighter), `ranger`
(ranger+rogue), `mage` (mage+druid), `healer` (healer). All 800g, all floor at
level 10 — which **is** Intermediate. The mechanic is right; the catalogue is
thin, and there are no cross-class options at all.

Add sets covering:

- **Every single archetype on its own** — a set for exactly `tank`, exactly
  `fighter`, exactly `rogue`, exactly `mage`, exactly `druid`, exactly `ranger`.
  Cheaper than the broad sets, since they cover less.
- **Deliberate cross-class pairs** that match how people actually build:
  fighter+rogue, tank+healer, mage+healer, ranger+druid, rogue+mage. Price
  these *above* single sets — breadth is what you are paying for.
- Optionally one **generalist** set: every archetype, floors at a lower level
  than 10 so it is broad but shallow. Only if it does not muddy the choice.

Rules:

- Follow the existing shape exactly:
  `{ name, archetypes: [...], cost, floor? }` in `ADV.DATA.GEAR_SETS`.
- **Never set `campaign:`** on a new set — that flag means "issued by a faction
  hall, never sold," and `Panels.storeGear` filters on it.
- One set at a time stays the rule. Do not add slots.
- Price against what the trainer charges (`tutorIntermediate: 300`,
  `tutorAdvanced: 600`) and against the shelter ladder's 650g, which is now
  competing for the same purse. §10.
- `world.js:303` picks a set for NPCs by archetype match — check your additions
  do not make NPCs all buy the same new set.

---

## 8. Part E — Gear you can see

**This already works.** `SET_LOOK` → `applySetLook` → the cache key already
carries the set. Your job is to extend, not to build.

1. **Every new set from §7 gets a `SET_LOOK` entry.** A set with no entry
   silently falls back to the character's default clothes — which is exactly
   the "gear you can't see" the user is asking to fix.
2. **Widen the wardrobe vocabulary** so twenty sets do not resolve to four
   looks. Sets are distinguished by *silhouette first* — pauldron shape, collar
   height, hood vs helm vs cap vs bare — then by colour. Two sets that differ
   only in hex are the same set to the player.
3. **Bump the cache prefix when you change drawing.** Keys today are `pp5_`,
   `pn6_`, `pc5_`, `pr5_`, `pm6_`. If you change how any wardrobe is drawn,
   increment the number, or players see cached old textures forever. If you only
   add new `SET_LOOK` rows and touch no drawing code, no bump is needed — the
   `setBit` already varies the key.
4. **Cross-class sets should look like a mix**, not a fifth generic kit — mage
   robe over ranger's boots, healer's collar on fighter's plate. This is where
   the code-art constraint pays off: composing two existing recipes is cheap.

---

## 9. Part F — Portrait expression

The user liked the blink and asked whether faces could show emotion. They can,
and the blink shows exactly how.

**Do it as an overlay, not as baked textures.** Portraits are canvas textures
cached by key; baking happiness/sadness/anger would multiply every character's
textures by the number of moods. Instead, draw the brow and mouth over the
portrait with Phaser `Graphics`, positioned from `META[key]` — the same
technique `Portraits.animate` uses for lids. Zero new textures, works on every
portrait immediately, and composes with the blink already running.

```
Portraits.express(scene, img, ch, key, mood)   // returns a stop() like animate does
```

Moods: `neutral`, `happy`, `sad`, `angry`, `afraid`, `hurt`. Two strokes each —
**brow angle and mouth curve are the whole language.** The baked face already
draws a brow from `o.brow` and a mouth from `o.mouth`; you are overpainting
those two marks in the character's own skin/hair tones (`META[key].lid` shows
how the tone is carried through).

Keep it RuneScape: an angry brow is *one straight angled line*, not a furrow.

**Non-negotiables:**

- Self-clean on `img.once('destroy', ...)`, exactly as `animate` does. Scenes
  destroy portraits constantly on panel switches.
- Never fight the blink. Lids draw at `depth+1`; pick your own band and hold it.
- `neutral` must render **nothing** — no overlay, no cost, no drift from the
  baked face.

**Where mood comes from — data the game already has:**

- Combat: hurt on `damage`, angry on their turn, afraid below ~25% HP.
- Town roster: regard toward the player via `ADV.Rel.tierBetween` — romantic and
  friendly read happy, hatred reads angry.
- Household: a spouse about to be jilted, a mourner at a funeral (the funeral
  cutscene already picks mourners and speaks their lines).
- The player's own portrait: hungry or sick reads as sad or hurt.

Wire **two or three** of these, not all of them. A face that changes constantly
reads as broken. If you are unsure, wire combat and roster only, and report.

---

## 10. Balance — the part that can quietly ruin the game

This brief adds a **hard gold tax to a permadeath game where gold also buys the
only progression**. Before this change, gold went to skills (150–600g), gear
(800g), and party payroll. After it, the same purse must also cover 650g of
shelter inside fifteen quests, plus a meal before every single contract, or the
player dies.

**Prove the game is still winnable.** Not "the tests pass" — winnable:

1. **A no-gold opening must survive.** `startingGold: 0`. Cheapest food is 5g.
   Walk a fresh character through the first five quests on quest payouts alone
   and confirm they can eat *and* reach the inn. If they cannot, the numbers are
   wrong — report it, propose a fix, do not silently retune the design.
2. **There must be a way out of a death spiral.** A player at 3 Hunger stacks
   has 25% of their stats and is about to die. Can they still complete a Tier 1
   contract and buy bread? If the answer is no, hunger is a trap rather than a
   cost. Consider — and *report before implementing* — a floor such as the
   fourth stack killing only on the following quest resolution, so there is
   always one turn to eat.
3. **Extend `test/balance.js`.** It exists and runs 20 checks. Add: expected
   gold at quests 5 / 10 / 15 against the shelter ladder plus meals; the
   worst-case survivable path; and that hunger death is reachable but not
   inevitable.
4. **Run a long simulation.** Tick the world 40+ quests with a scripted player
   who eats and buys shelter on schedule, and one who does not. The first should
   be alive and settled; the second should be dead. If both die, the design is
   too tight.
5. **NPCs must not starve.** Hunger and shelter are **player-only** unless you
   are explicitly told otherwise. `Character.effStat` runs for every character
   in the world — if `Survival.statMult` returns anything but `1` for NPCs, you
   have just halved the entire simulated population. Guard on `ch.isPlayer` and
   **write a test that asserts it**.

State the concern once in your report if you find one, then proceed with the
design as specified. Do not soften the numbers on your own initiative.

---

## 11. Save compatibility

Old saves have no hunger, no shelter clock, and no sickness.

- Every new field defaults to a safe value when missing — `hunger: 0`,
  `questsSinceShelter: 0`, `sick: false`. Never `undefined` arithmetic.
- `Survival.state(ch)` creates the record on demand, so nothing else needs a
  null check.
- Add the new fields to `js/core/save.js` serialisation, both directions.
- **An existing save must not load into instant death.** A player who has been
  sleeping rough for 30 quests in an old save starts the clock at zero, not at
  six stacks. Write a test that loads a pre-change save shape and asserts the
  player is alive and unpenalised.

---

## 12. DO NOT ERASE EXISTING FEATURES — non-negotiable

This project has already lost a day's work. An assistant held a **stale copy** of
the project and wrote it over the working tree. Roughly 20 files silently
reverted, ~857 lines of finished features vanished — the home system, auto-attack
targeting, obituaries, conscription, the rival companies — and **the test suite
still looked green, because the tests had been reverted too.** The loss was not
noticed for hours.

This brief is more dangerous than the last two, because it edits files that are
already full of working systems rather than adding new ones.

1. **Never write a file you have not just read in this session.** Not from
   memory, not from an earlier copy, not from a zip, not from a template.
2. **Never bulk-copy, unzip, rsync or sync a directory over the project.** No
   "let me just refresh the files."
3. **Every edit is a targeted, anchored replacement.** Find exact surrounding
   text, assert it matched **exactly once**, then replace. A patch that silently
   matches nothing is worse than a crash — it looks like success. That has
   happened here.
4. **Additive by default.** The survival system is a **new file**. The panel
   split **moves function bodies without rewriting them** — cut `Panels.storeGear`
   into `Panels.blacksmith` intact, do not retype it. Retyping is how logic gets
   lost.
5. **Splitting is not deleting.** When `Panels.store` splits, the old entry
   points keep working as aliases. `tutor.js` gates on panel ids; the campaign
   panels and notices reference them too.
6. **Take a symbol inventory before and after:**
   ```
   node tools/symbol_inventory.js snapshot     # before you start
   node tools/symbol_inventory.js check        # after every part
   ```
   It reports removed symbols and shrunken files, and has already caught a real
   regression. If it reports anything, you deleted something.
7. If you believe something must be removed, **stop and say so** instead of
   removing it.

---

## 13. Verification

**Headless — this brief IS covered, unlike the last one. Must all pass:**

```
cd "C:\Users\charl\The Sorcerer Sword ARPG\adventurer"
node test/run_tests.js && node test/campaign_flow.js && node test/campaign2.js
node test/integration.js && node test/requests3.js && node test/hiro.js
node test/skills2.js && node test/campaign_rules.js && node test/balance.js
node test/family.js && node test/legacy.js && node test/campaign_coverage.js
node tools/symbol_inventory.js check
```

Known pre-existing failure, **not yours**: `test/features.js` crashes with
`ADV.Game.attachRival is not a function` — `js/core/game.js` is missing its
rival-companies block. Restore it from git commit `1f46150` before you start, or
leave it and don't be confused by it. Do not write the missing functions
yourself.

**Write new tests. This is systems work, so tests are the deliverable, not the
receipt.** At minimum:

- 4 hunger stacks kills; 3 does not.
- A meal at any stack count clears hunger completely.
- `statMult` is exactly 0.75 / 0.50 / 0.25 / 0 — not multiplicative.
- Max HP falls with stacks and current HP is clamped.
- **NPCs are never affected.**
- Sickness fires at exactly 5 quests on a rung, not 4 or 6.
- Buying up a rung clears sickness and resets the clock.
- At `brick` and above the clock never fires again.
- Sickness jilts every spouse, and `pendingPlayerJilt` is set.
- Hunger death routes through the normal death path — reincarnation/nepotism
  still work.
- An old-shape save loads alive and unpenalised.
- Every new gear set floors the skills it claims and no others.

**Browser — for anything in `js/ui`:**

- The four split panels open, and the old `openPanel('store')` still works.
- The tutorial tour completes end to end with the new entries.
- Hunger and shelter warnings appear on the character panel and the departure
  modal, and are legible against the town backdrop at all three sky phases.
- A portrait wearing each new set renders, and the cache key changes when the
  set changes.
- Expressions render, do not fight the blink, and vanish when the portrait is
  destroyed. Switch panels twenty times and confirm no leaked `Graphics`.
- Console clean — zero page errors.

---

## 14. Order of work — report between parts

Do not do this in one pass. Each part below is a checkpoint.

1. **Part A — hunger.** `js/core/survival.js`, the `effStat` hook, the two
   `digest` call sites, tests. **Stop and report**, with the balance numbers
   from §10.1 — a no-gold opening walked through five quests.
2. **Part B — shelter and sickness**, including the jilt and the warnings.
   Tests. **Stop and report.**
3. **Part C — the town split** and the tutorial lines.
4. **Part D — new gear sets**, with pricing rationale against §10.
5. **Part E — set looks**, one `SET_LOOK` per new set.
6. **Part F — expressions**, wired to two or three sources only.

At each report: what changed, what you verified, what you are unsure of, and any
balance number that came out worse than expected.

---

## 15. What NOT to do

- Do not apply hunger or sickness to NPCs.
- Do not scatter stat modifiers. One multiplier in `Character.effStat`.
- Do not write a second jilt path, a second death path, or a second insurance
  implementation.
- Do not rebuild the housing ladder, the meal system, gear-set floors, or
  gear-on-portrait — §2 lists what already exists.
- Do not delete `Panels.store` or break `openPanel('store')`.
- Do not rename or repurpose existing panel ids that `tutor.js` gates on.
- Do not change the canvas size or the tier thresholds.
- Do not add assets, libraries, CDN scripts, or npm packages.
- Do not bake expression variants into the portrait texture cache.
- Do not retune the design's numbers silently. Report, then wait.
- Do not delete anything. If something looks like dead code, leave it and say so
  in your report.
