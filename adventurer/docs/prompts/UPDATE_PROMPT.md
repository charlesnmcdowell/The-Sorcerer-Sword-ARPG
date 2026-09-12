# Adventurer — Presentation & Visual Upgrade

Paste this whole file as your prompt. It is self-contained.

---

## THE NORTH STAR — read this first

**This game already simulates far more than the player can see. Every task in
this brief takes something the code already knows and makes it visible.**

Nothing here adds a system, a quest, a faction, or a rule. Under the hood, NPCs
are already courting each other, marrying, having children, holding grudges,
dying, and inheriting. The player already learns skills by having them used on
them in battle. Characters already have obituaries written for them when they
die. **The player sees almost none of it.** The Guild Roster shows fifteen
identical rows reading `rank 1 · steady · active`. The most novel mechanic in
the game happens in total silence. Obituaries sit in a list nobody opens.

So: **this is a presentation pass and a visual pass, not a design pass.**

Two things have to be true when you are finished:

1. **A player can see what the game is doing.** Information the simulation
   already produces reaches the screen at the moment it matters, in language a
   person would use.
2. **It looks deliberate.** Every pixel is drawn in code, and it should read as
   a chosen style rather than as placeholder programmer art.

The reason both matter: a game like this is judged on its store page and its
first ten minutes, and both are entirely presentation. The systems are already
good. They are just invisible.

**If a change would alter game balance, rules, or content, it is out of scope.**

---

## 1. What you are working on

**Adventurer** is a finished, playable Phaser 3 web RPG at
`C:\Users\charl\The Sorcerer Sword ARPG\adventurer`. It is a menus-and-portraits
RPG — no traversable map. The player takes contracts from a board, fights
three-lane tactical battles, and manages a guild roster of simulated NPCs.

**Stack:** Phaser 3.87, plain `<script>` tags, no bundler, no build step. Everything
hangs off a global `ADV.*`.

**Layers, in load order:**

```
js/data/   pure data tables (skills, enemies, dialogue, constants)
js/core/   Phaser-free logic — runs headless in Node
js/ui/     Phaser scenes and panels
```

`index.html` lists every script. `test/harness.js` has a `FILES` array that
**must mirror `index.html` exactly** for `js/data` and `js/core` — `test/run_tests.js`
asserts it. The harness does **not** load `js/ui`.

**Canvas is fixed at 1280×760.** Do not change it.

**Files you will touch:**

| file | what lives there |
|---|---|
| `js/ui/portraits.js` | procedural busts — `drawBust`, `hairBack`, `hairFront`, `drawWardrobe`, `recipeNPC`, `Portraits.key` |
| `js/ui/home_art.js` | town backdrops — `HousingArt.paint`, plus `sky`/`hill`/`tree`/`litWindow`/`celestial` |
| `js/ui/vfx.js` | effect atoms — `lunge`, `burst`, `aura`, `damageNumber`, `slashArc`, `camShake` |
| `js/ui/theme.js` | the whole palette (`T.c` numeric, `T.css` strings), `panel`/`text`/`button`, `chromeAlpha` |
| `js/ui/uikit.js` | `UI.header`, `UI.scrollArea`, `UI.modalBtn` |
| `js/ui/scene_combat.js` | the battle screen |
| `js/ui/town_panels.js` | quest board + departure, store, trainer |
| `js/ui/town_panels2.js` | Guild Roster (`Panels.roster` ~240), event feed (~279), Graveyard (`Panels.graveyard` ~291) |
| `js/ui/cutscenes.js` | `Cut.rideHome`, `Cut.funeral` — the cutscene grammar to reuse |
| `js/core/combat.js` | `recordSighting` (~1513), `Combat.registerWitnesses` (~1526) |
| `js/core/death.js` | `Death.composeObituary` |
| `js/core/skillsys.js` | `SkillSys.witness`, `SkillSys.isWitnessed` |

---

## 2. Hard constraints — read twice

**ALL ART IS CODE. This is absolute.** There is no budget for assets and none
will be commissioned. Every visual is drawn at runtime with Phaser `Graphics`
calls or canvas-texture drawing (`scene.textures.createCanvas`). Do not add
image files, sprite sheets, icon fonts, or external art of any kind. Do not
suggest it. Getting everything out of code drawing is the creative challenge,
not a limitation to work around.

**Target aesthetic: old-school RuneScape.** Flat colour, low detail, high
clarity, unpretentious charm. Concretely:

- **Flat fills.** One gradient per scene at most. No soft shadows, no blur.
- **Silhouette over interior detail.** A character should be identifiable as a
  black cutout. Spend the detail budget on outline shape, not on faces.
- **One light direction, everywhere.** Existing code lights from upper-left; keep it.
- **Small saturated accent against a desaturated ground.** The palette in
  `theme.js` already does this — gold and blood against parchment and ink. Stay in it.
- **Chunky, high-contrast UI.** Clear borders, generous hit targets.
- **Imperfection is fine.** Slight asymmetry reads as handmade, not broken.

**No dependencies.** No npm packages, no CDN scripts.

---

## 3. Ground rules for editing

1. **Read a file before you edit it. Edit in place.** Never overwrite a file
   wholesale from a copy you hold elsewhere — this project has already lost a
   day's work to exactly that.
2. **Anchor every string replacement and assert the anchor matched.** A silent
   no-op patch is worse than a crash.
3. **The headless suite does not load `js/ui`.** UI changes must be verified in a
   browser. Core changes must be verified by the suite.
4. **Portrait cache keys are versioned.** `Portraits.key` builds keys prefixed
   `pn5_`, `pp4_`, `pc4_`, `pm5_`. If you change portrait *drawing*, bump the
   number in the affected prefix, or players keep seeing cached old textures.
5. **Run the suite after every change.** It must not get worse.

**Verification:**

```
cd "C:\Users\charl\The Sorcerer Sword ARPG\adventurer"
node test/run_tests.js && node test/campaign_flow.js && node test/campaign2.js
node test/integration.js && node test/requests3.js && node test/hiro.js
node test/features.js
```

Known pre-existing failure, not yours: `test/features.js` crashes with
`ADV.Game.attachRival is not a function` — `js/core/game.js` is missing its
rival-companies block (nine functions including `attachRival`, `shouldMeetRival`
and `resolveLeaderFall`). Restore `game.js` from git commit `1f46150` before
starting, or leave it and don't be confused by it. Everything else passes.

---

## 4. DO NOT ERASE EXISTING FEATURES — non-negotiable

This project has already lost a day's work. An assistant held a **stale copy** of
the project and wrote it over the working tree. Roughly 20 files silently
reverted, ~857 lines of finished features vanished — the home system, auto-attack
targeting, obituaries, conscription, the rival companies — and **the test suite
still looked green, because the tests had been reverted too.** The loss wasn't
noticed for hours.

Nothing in this brief requires deleting anything. If you are removing code, stop
and reconsider — you are almost certainly doing it wrong.

### The rules

1. **Never write a file you have not just read in this session.** Not from
   memory, not from an earlier copy, not from a zip, not from a template.
2. **Never bulk-copy, unzip, rsync or sync a directory over the project.**
   No "let me just refresh the files." That is precisely what caused the loss.
3. **Every edit is a targeted, anchored replacement.** Find exact surrounding
   text, assert it matched exactly once, then replace. A patch that silently
   matches nothing is worse than a crash — it looks like success.
4. **Additive by default.** Prefer a new file over editing an existing one. New
   behaviour goes in a new module and is wired in with a few lines, the way
   `js/ui/cutscenes.js` was added without touching the town scene's internals.
5. **Never delete a function you did not write in this session** — not to tidy,
   not to deduplicate, not because it looks unused. Something calls it.
6. **Do not reformat, re-indent, or run a formatter.** A whole-file reformat
   produces a diff so large that a deletion inside it is invisible.
7. **If a file gets shorter, stop and explain why** before continuing.
8. **Do not "restore" or "fix" a file from git** unless explicitly asked. The
   repo has a commit that captured the damaged state; guessing at history is how
   this got worse the second time.

### The guard — run it

`tools/symbol_inventory.js` records every top-level function in `js/data`,
`js/core` and `js/ui` (currently 56 files, 726 symbols) and fails loudly if any
disappears or a file shrinks by more than 15 lines.

```
node tools/symbol_inventory.js snapshot     # ONCE, before you touch anything
node tools/symbol_inventory.js check        # after EVERY task
```

`check` exits non-zero and names what vanished:

```
SYMBOLS REMOVED  js/core/party.js: Party.followers
FILE SHRANK      js/core/party.js: -20 lines (269 -> 249)
2 REGRESSION(S) — something was overwritten, not edited.
```

**If `check` reports a regression, restore what you removed before doing anything
else.** Do not proceed, do not rationalise it, do not report the task complete.

Re-snapshot only when you have deliberately and correctly removed something, and
say so in your summary when you do.

---

## 5. Known visual defects — fix these as you go

Found by playing the current build. All are presentation bugs.

- **`chromeAlpha` is too low.** `theme.js` sets `0.78`; the cottage door and
  windows read through the quest-board text, and the Trainer's celestial sun
  sits as a bright blob behind the skill grid. Try **0.86–0.88** — enough to see
  time-of-day and the roofline at the panel edges without fighting body copy.
- **Faction-war quest notes overflow their column.** On the quest board,
  "Against The Green-Eyed. 3 more like this and they stop asking after yo" runs
  past the panel edge and collides with the row beneath. The wrap width in
  `questRow` / `Campaign2UI.questNote` is using the panel width, not the column width.
- **The Trainer header is clipped.** The "Core" tab button overlaps line 2 of the
  blurb — "…Intermediate, 600g to Advanced" is cut off.
- **The Guild Roster list is bottom-clipped**, and the event feed beside it is
  mostly empty, so half a full-width panel goes unused while the roster scrolls
  in a narrow column.
- **`wealth #1` wraps mid-phrase** in the character panel.

---

## 6. The work

Five tasks in priority order. One at a time, verify between each.

---

### TASK 1 — Make witnessing visible

**Why:** "an RPG where you learn skills by having them used on you" is this
game's one genuinely novel mechanic and its whole marketing hook. Right now it
is completely silent — the player never notices it happening.

**How it works today:** `recordSighting(st, user, skillId, tier)` in `combat.js`
fires the instant a skill is used and quietly appends to each observer's
`u.witnessedHere`. Nothing is banked until `Combat.registerWitnesses(st)` runs at
encounter end. **That gap is why it is invisible** — the moment and the reward are
separated by an entire battle.

**Do this:**

1. In `recordSighting`, when the observer is the player and
   `SkillSys.isWitnessed` is false, push a combat event:
   `st.events.push({ t: 'witness', skillId, tier })`.
   `st.events` is the existing channel — `scene_combat.js` already reads
   `e.t === 'reinforce'` and `e.t === 'campaignExit'` the same way.
2. In `scene_combat.js`, drain `witness` events and play a beat: brief hit-stop
   (~80ms), a gold rim flash on the enemy who used it, and a centre-screen
   caption with the skill name over **"You have seen this."** Use existing `VFX`
   atoms; add one if needed.
3. At the Trainer, witnessed skills must be visibly marked and free — gold
   border and a "seen in battle" subtitle, not merely a price of 0.
4. In the Skill Journal, record **who** taught it:
   `"Chain-Hand · Iron Fan Guard · seen at The Widow"`.

**Acceptance:** fight an enemy using a skill you don't have. You get an
unmissable in-combat moment, and afterwards the Trainer shows it marked free.

**Preserve this design note:** bypass verbs (Sneak, Persuade, Bribe) witness
*nothing*. Once witnessing is visible that becomes a real dilemma every
encounter — take the hit and learn, or talk past it and stay safe. Consider
surfacing the cost on the verb buttons.

---

### TASK 2 — Give the roster a human line

**Why:** the Guild Roster is the heart of the game and every row currently reads
`rank 1 · steady · active · unknown skills`. Fifteen identical rows. The
simulation underneath knows far more.

**Do this:** in `Panels.roster` (`town_panels2.js` ~240), replace the stat
subtitle with **one human fact**, by priority, drawn from `ADV.Rel`, `ADV.Party`
and character fields:

1. Owes or is owed money by the player
2. Hatred toward the player — *"has not forgiven you"*
3. Romantic with the player — *"yours"*
4. Courting or married to another NPC — *"courting Mira"*, *"married to Bram"*
5. Recently bereaved — *"lost a brother on the north road"*
6. In a party — *"rides with Harlan"*
7. Ambition — *"wants a company of their own"*
8. Fall back to the current stat line only if nothing else applies

Keep rank/status, but make it secondary — smaller and dimmer.

**Acceptance:** open the roster with 15+ NPCs. Most rows say something a person
would say, and no two adjacent rows read identically.

**Same treatment for the Trainer:** every skill costs 150g, so the grid reads as
wallpaper. Group by archetype and let cost vary by tier.

---

### TASK 3 — Give the event feed hierarchy

**Correction to an earlier report: the feed is NOT broken.** It is empty
immediately after a new game and fills correctly once the world ticks — verified
at 68 entries after 8 ticks. Do not go hunting a bug here.

**The real problem is presentation.** Two things:

1. **Everything renders as dim hearsay.** Entries about NPCs the player hasn't
   met are drawn faint and italic (correctly — they are gossip). But a new
   player has met nobody, so the entire panel is undifferentiated low-contrast
   grey text at exactly the moment first impressions form.
2. **It is monotonous.** Eight ticks produced 68 entries, overwhelmingly
   "X and Y had a child" and "Z has come of age." A returning player scrolls a
   wall of near-identical lines.

**Do this:**

- Give the feed visual hierarchy: deaths and betrayals should read heavier than
  births. Vary weight and colour by event kind, not only by whether the player
  has met the actors.
- Collapse runs of the same event kind: *"Four children were born in the
  quarter."* Keep individual lines for anything involving someone the player knows.
- Consider a small icon glyph per kind — drawn in code, a few `Graphics` calls.
- Make sure at least some entries early on are full-contrast, or the panel
  reads as disabled.

**Acceptance:** return to town after several quests. The feed is scannable, has
a clear visual hierarchy, and the important lines are the ones that stand out.

---

### TASK 4 — Make the player's death a scene

**Why:** permadeath plus inheritance is the strongest structural idea in the
game. Right now death is a panel. `Death.composeObituary` already writes real
obituaries and they are buried in a list.

**Do this:** build a full-screen death beat in `scene_death.js`, reusing the
grammar already in `js/ui/cutscenes.js` (`Cut.funeral` — grave, gloom overlay,
mourner portraits, captions, disperse):

1. The obituary, full width, in the display font
2. The skills that died with them
3. Who mourns, one line each in their own personality voice
4. Then the reincarnate-vs-nepotism choice, with the consequence stated plainly:
   reincarnation **closes** any campaign the bloodline started; a nepotism heir
   **resumes** it at the quest the parent died on

**Acceptance:** dying produces a scene worth screenshotting, and the inheritance
choice is legible without prior knowledge.

---

### TASK 5 — Push the procedural art

**Why:** this game is judged on its store page, and the visuals must carry it
with zero art budget. There is a lot of headroom left in code drawing.

Ordered by impact per line of code:

**5a. Give portraits idle life.** Two small tweens turn static busts into living
characters — in the dialogue box, combat, and the campaign halls:

- a slow ~2px vertical bob, ~2.5s, offset per character so they don't sync
- an occasional blink: draw the eye as a 1px line for ~90ms every 3–7s, random per character

Biggest perceived-quality win available, for almost no code.

**5b. Show gear on the portrait.** `ch.equippedSet` is tracked and does nothing
visually. `drawWardrobe` already branches on `armor`/`ninja`/`robe`/`suit`/
`hide`/`samurai`. Wire the equipped set to wardrobe kind and colour so buying
Shinobi Gear or the King's Uniform visibly changes the character. **Bump the
cache prefix and include the set in the cache key**, or players keep their old bust.

**5c. More silhouette variety.** Silhouette is where the detail budget goes. Add
headwear and collar shapes to `hairBack`/`hairFront`/`drawWardrobe` — hoods,
helms, caps, high collars, cloak lines. Faction characters should be
identifiable as cutouts.

**5d. Mark experience on the face.** Derive small deterministic marks from
character data — a scar past a quest threshold, greying with rank, a harder jaw
at high rank. A veteran should look like one.

**5e. Combat readability.** In `scene_combat.js`: scale back-lane units to ~0.9
and darken slightly, front lane 1.0 — instant depth from two numbers. Add ~60ms
hit-stop on heavy hits. Render statuses as small coloured pips under each
portrait instead of text.

**5f. Backdrop life.** `home_art.js` is already charming. Add, in code: chimney
smoke (rising, fading circles), lantern flicker (alpha sine), weather (angled
rain lines, drifting snow), and distant crowd silhouettes. Tie weather to the
world clock so it changes between quests.

**Acceptance:** screenshot the town, the roster and a battle. Each should look
deliberately styled rather than placeholder — every pixel still drawn in code.

---

### TASK 6 — Battlegrounds

**Why:** combat currently draws its backdrop as a single flat rectangle —
`scene_combat.js` line ~34, `this.add.rectangle(W/2, H/2, W, H, 0x121110)`. Every
fight in the game, from a roadside mugging to a god, happens in the same dark
void. This is the largest single visual upgrade available and it is greenfield:
there is nothing to break.

**Important — do not rebuild what exists.** The combat screen already has enemy
intent above each portrait (`Cleave → Kaelen`), a turn-order line, lane boxes, HP
bars and a rules footer. Those are good. This task is the *backdrop behind them*,
plus the staging improvements in Task 7 if you get there.

#### Build it as a parts kit, not 38 hand-written scenes

`js/ui/home_art.js` writes each of its six town backdrops as a bespoke function.
That is fine at six and miserable at 38. Instead, in a new `js/ui/battle_art.js`:

- **Elements** — small drawing functions, most already half-written in
  `home_art.js`: `sky`, `hill`, `tree`, `wall`, `pillar`, `crate`, `mast`,
  `rigging`, `gravestone`, `brazier`, `banner`, `tent`, `cliff`, `water`, `fog`,
  `rubble`, `torch`, `lantern`. Roughly 18.
- **A ground is data**: `{ sky: [top, bottom], palette: {...}, layers: [{el:'cliff', x, y, w, h}, ...] }`.
- **`BattleArt.paint(scene, groundId, phase)`** renders a recipe at depth −10,
  below the lane boxes.

**Inherit day/night for free.** `Housing.timeOfDay(world.questClock)` already
returns `day`/`evening`/`night` and drives the town art. Feed it in: 38 recipes ×
3 phases = **114 distinct looks** from 38 data entries. A night ambush in the
marsh and a noon patrol in the same marsh read as different places.

#### The manifest — 38 grounds

**Generic, by event (20):** bandit road · deep wood (dire wolf) · marsh ·
frost pass · ember pyre · gravewarden crypt · cemetery · hedge-mage cottage ·
sentinel ruin · dockside warehouse · merchant quarter · rooftops ·
ship deck · shallows · tavern interior · alley (rescue) · house interior
(assassination) · practice yard · mountain pass · sealed ossuary

**Faction (14)** — 7 factions × (quest ground + boss ground). All seven:
`maw`, `antler`, `varenholm`, `bell`, `green`, `tally`, `navy`. The first
campaign's three need this as much as the new four, or they will look abandoned
beside them. A faction ground is *a base recipe + that faction's palette + one
signature prop* — the Bell's paper lanterns, the Red Tally's rigging and ledger,
the Admiralty's signal flags.

**God line (4)** — `ossuary`, `birthing_house`, `low_tide`, `salt_court`.
`quest.routeId` already carries which one. These are the set pieces; give them
the most detail.

**Faction war (0 extra)** — reuse the ground of `quest.warAgainst`.

#### Choosing a ground — first match wins

1. Campaign quest → that faction's ground; its **boss** ground when the
   encounter is flagged `boss`
2. God line → the ground for `quest.routeId`
3. Faction war → the ground of `quest.warAgainst`
4. Ordinary contract → keyed off the lead enemy type (`bandit`, `dire_wolf`,
   `grave_acolyte`, `hedge_mage`, `plated_sentinel`, and the tier-2/3 types)
5. `scene_combat.mode` is `ambush` / `rescue` / `assassination` → roadside,
   alley, indoors
6. Fallback → bandit road

#### Build six first, then decide

Do **not** author all 38 in one pass. Build the parts kit and **six grounds** —
one faction, one faction boss, one god route, three generic — then look at them
*underneath the combat UI*. Grounds sit behind portraits and lane boxes, so most
of the scene is occluded. Six will tell you how much detail actually survives,
and whether the remaining 32 want that much work or half of it. Report back
before continuing.

**Acceptance:** six grounds, driven by data recipes rather than bespoke
functions, correctly selected by the resolution order above, each rendering
differently at day / evening / night, every pixel drawn in code.

---

## 7. What NOT to do

- **No new systems, content, or rules.** No third campaign, no new quests, no
  balance changes. If a change alters what the game *does* rather than what the
  player *sees*, it is out of scope.
- Do not refactor `js/core/combat.js` — 1,585 lines, load-bearing, covered by
  214 campaign-flow assertions.
- Do not change the save format without a migration path.
- Do not touch `js/core/game.js`, `party.js`, `death.js`, `divine.js` or
  `world.js` beyond what a task explicitly needs — those files have been damaged
  and restored once already.
