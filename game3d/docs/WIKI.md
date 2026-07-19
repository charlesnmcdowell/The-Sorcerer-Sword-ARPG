# THE PIT OF KARRIDGE — Game Wiki

Player/designer reference for the Dragon's-Crown-style side-on parallax brawler vertical slice in `game3d/arena.html` (Phaser 3.80, one inline script, ~3876 lines). Boots straight into ADVENTURE mode. Companion docs: [MAINTENANCE.md](MAINTENANCE.md) (how to build on this baseline), [CODE_MAP.md](CODE_MAP.md) (where everything lives in the file).

## Controls

| Input | Action |
|---|---|
| A/D or arrow keys | Walk (stick on touch) |
| J or mouse click | **HEX** — slowing curse bolt |
| SPACE | **BLINK** — teleport back + stun discharge |
| K | **PORTAL** — cross the screen, swap the furthest foe |
| Q | **SUMMON** — channel the next rung (fiend → dragon → coven) |
| E | Talk / enter / drink well (village & road); drink potion (pit) |
| 1 / 2 or click card | Evolution pick (lv10 / lv20 cards) |
| `?touch=1` (or any coarse pointer) | Virtual stick + verb button cluster |

## Areas & quest walkthrough

**Boot — THE OLD ROAD.** The game opens mid-journey with a hands-off tutorial: narrator voice clip, then captioned demos of HEX (5.5s), BLINK (8s), PORTAL (10.5s) and SUMMON (13s — fiend + dragon shown; the coven is left to discover). Any key after the first 3 seconds takes control (`advTutEnd`; the 3s floor stops the audio-unlock keypress from eating the tutorial).

**West — KARRIDGE (village hub).** 4-layer parallax: painted far skyline (0.22× scroll), keyed building row (0.55×), 1:1 ground tile (feet never skate), and a near prop plane scrolling 1.35× *in front of* the actors — the signature DC near-plane. World length 2200px (road: 2400px).

| Stop (world x) | What it does |
|---|---|
| Father Ossu — chapel (520) | Free full heal, every visit |
| Harrow — smithy (950) | Free potion on first visit; flavor after |
| Marlow — The Last Door Inn (1450) | Quest giver; sells potions at **25 gold** |
| The Well (1800) | Narrator line ("plaza of the nameless") |
| East edge | The Old Road → the Pit gate |

**East — THE PIT.** Press E at the gate ("mind the blood on your way out"), then the 8-fight ladder, the boss, the reward, and the walk home.

**Quest: THE MISSING CHAMPION** (`ADV.quest` stages)

| Stage | Beat |
|---|---|
| 0 → 1 | Marlow tells of **Dren**, the last champion, who "ran off" leaving his boots. Objective: FIND DREN — EAST, THE PIT |
| 2 | Entered the Pit |
| 3 | Killed the **BEAST OF KARRIDGE** → relic **DREN'S BOOTS** (+15% move speed) + 120 gold + potion |
| 4 | Back in Karridge |
| 5 | Marlow closes the quest with the sequel hook ("Whatever shops for the gifted hasn't finished its list") — the Pit reopens as REPEAT RUNS |

**Repeat runs** (quest ≥ 5): every re-entry is a run; enemies get **+35% hp and damage per completed run** (`spawnFight`, line 309), payout is **120 + 90×runs gold** plus a potion (`advPitCleared`).

## The Pit ladder (`ADV_FIGHTS`, line 3482)

Per-fight scaling on top of base hp: hp ×(1 + 0.30·idx), damage ×(1 + 0.16·idx), both ×(1 + 0.35·runs) on repeat runs. Every fight opens with a Bellow taunt.

| # | Fight | Foes (base hp) |
|---|---|---|
| 1 | FIRST BLOOD | 2× hound (66) |
| 2 | THE HOOKS | 2× hook (48) |
| 3 | THE CHAIN | chain (95) + hound (66) |
| 4 | PYRE & POWDER | pyre (85, ranged) + gunner (110, ranged) |
| 5 | GRAVEHANDS | 2× grave (115) + stitch (120, healer) |
| 6 | THE COURT NECROMANCER | necro (130) + gunner (110) |
| 7 | THE BRUTE | brute (170) + stitch (120) |
| 8 | THE BEAST OF KARRIDGE | beast (300) — boss |

`?arena=1` restores the legacy **20-fight gauntlet** (`FIGHTS`, line 245), which also uses door / master / champ / skel and, after fight 3, has Bellow stack a stitch healer + a random wildcard and then **double all enemy HP**.

## Bestiary

All AI and damage live in one place: `updFoeAI` (line 622) — every foe renders full-size at its sim position ("the hitbox IS the body"). Telegraph numbers from the `FOE_AI` table (line 606): *wind* = telegraph seconds, dmg = [min,max] × dmgScale. Hexed foes move at 0.6× (committed hound pounces / beast charges are NOT slowed).

| Type | Appears | Wind / dmg | Behavior | How to fight |
|---|---|---|---|---|
| hound | Pit 1, 3; gauntlet | .42 / 4–7 | Crouch-telegraph **pounce** (lunge 340) with a bite that connects from the separation ring | Blink the pounce; the crouch is your cue — the launched lunge won't slow for hex |
| hook | Pit 2; gauntlet | .38 / 6–10 | Generic melee: chase → yellow-tint '!' telegraph → arc swing | Fast but fragile; hex one and kite the other |
| chain | Pit 3; gauntlet | .60 / 9–14 | Heavy **ring sweep** — full-circle arc, range 150 | Stay out of the circle; punish the long wind-up |
| pyre | Pit 4; gauntlet | .80 / 9–14 (fire) | Kiting caster, standoff 170; **2s channel** cycling fire-AoE (r54, lingers + ticks) / ice (r62) / bolt (r70) zones at your feet; gains a mage-shield per completed cast | **Interrupt by hitting it mid-channel** — every completed cast makes it tankier. Move off the telegraph rings |
| gunner | Pit 4, 6; gauntlet | .80 / — | Standoff 200 with a tracking aim-line that **LOCKS**, then fires a fast bolt (13–17) | Sidestep after the lock, not before; blink breaks the line |
| grave | Pit 5; gauntlet | .42 / 7–11 | Open / **GUARD** / riposte stance (`foeGuard`, line 577) — parries light hits, punishes | Don't feed hexes into the guard; hit the open stance, punish after the riposte |
| stitch | Pit 5, 7; gauntlet | .40 / 3–6 | Healer — mends the most-hurt ally (14 hp per 2.4s), weak poke | **Kill first** or your damage evaporates; hex contagion loves the huddle |
| necro | Pit 6; gauntlet | .45 / 7–11 | Raises "Risen" skeletons (48 hp) | Cull the risen with contagion; pressure the caster |
| brute | Pit 7; gauntlet | .55 / 10–14 | Heavy telegraphed hits | Standard heavy: bait, blink, burn |
| beast | Pit 8 (boss); gauntlet | .55 / 12–17 | Heavy telegraphed hits + committed **charge** (430, ram 12–18) | The charge won't slow — portal across it. Longest fight: keep hex stacks rolling |
| door | gauntlet only | .50 / 10–15 | THE WALL — **blocks frontal light hits**; slow, ground-shaking | Break the block with a heavy or flank it |
| master | gauntlet only | .45 / 7–10 | Whistles **fresh hound pairs**; whip-crack zones (r44) at your feet | Kill the whistler, the kennel empties |
| champ | gauntlet only | .45 / 9–13 | Throws thrall skeletons and **EATS them to grow** (+22 hp, +speed, +damage per meal) | Kill or contagion the thralls before he snacks |
| skel | summoned by necro/champ | — | Fodder | Contagion chain fuel |

Enemy projectiles ride animated bolt sprites (`anim_firebolt` / gold `anim_hexbolt`); melee arcs render as swings.

## The Warlock

**HP 76** (base 45 × 0.85 warlock mult, doubled — "he's too squishy"). Walk **210 px/s** (+15% with DREN'S BOOTS).

| Ability | Key | CD | Numbers |
|---|---|---|---|
| **HEX** | J / click | 2s | Flat bolt at 420 px/s. On hit: 10s DoT, **15 dmg per 0.5s tick**, slows to 0.6× move. **STACKS:** each reapplication adds +15 per tick. |
| **CONTAGION** | (passive) | — | A foe dying hexed passes the rot to the nearest foe at **double tick damage per jump** (tick tightens to 0.4s), with a violet tracer and ×2/×4 popup. |
| **BLINK** | SPACE | 2.2s | Teleports **260px** backward; hex-lightning discharge **stuns everything within 230px of the departure point for 4s** (`anim_blinkwave` ring shows the true radius). |
| **PORTAL** | K | 3s | Crosses to the **opposite side of the screen** (15%/85% width); the furthest foe is yanked into your old spot (stunned 0.6s); **3s ward bubble** (`anim_wardaura`; 7s on the herald road). Works with no foe — pure escape + ward. |
| **SUMMON** | Q | 3s recast | **3s cast** (a hit/paralyze/silence interrupts it — press, don't hold). Cycles the ladder below; each summon lives **4s**. |

### Summon ladder (`summonDemons`, line 1352)

Summons spawn a clean 160px out, hold their spawn point when no enemies exist, and seek the nearest foe on their own.

| Rung | Summon | What it does |
|---|---|---|
| 1 | **CLAW FIEND** | Melee tank; shoves and carves at the separation ring |
| 2 | **BONE DRAGON** | Paralytic gas breath — r110 zones, 4s life: 2s stun + acid DoT (15/0.5s for 3s) — plus green fireballs |
| 3 | **THE COVEN** (succubi) | Fire from a 150–260px band; ranged mend beams on hurt allies |

Casting the coven triggers the **ARCH DEVIL** transform (~6s, own sheet): light verb = CLAW (dash + 2.0× carve), heavy verb = BITE (1.0×, heals — ascends a succubus if one is in lane). MvC-style hyper cut-in fires on the transform.

### Death → THE LICH (`hurtWarlock` line 201 / `enterLich` line 1163)

Death is a kneel (3s), then the rise: the **phylactery bone dragon** answers, and the lich is **immune while it lives**. Kit: scythe (light), FADE (defensive verb, replaces portal). The lich clock: **6s** → shamblers, **8s** → bone archers (both live 8s), **12s** → resurrect back to the living warlock. Dying as the lich is final.

### Evolutions (partially wired)

Lv10/lv20 card picks exist (`pickEvo`/`evoTick`); the herald/binder kits are ported but dormant (binder: doubled horde, ~45% bigger summons at 3× damage; herald: 7s ward). BUG-016 (arch-warlock / arch-reaper forms) is the open art+wiring task.

## Loot & economy

| Source | Amount |
|---|---|
| Kill | 6 + 5% of foe max hp in gold; **20%** potion drop |
| Potion (E in pit) | Heals **40%** of max HP |
| Marlow's shop | Potion, 25 gold |
| Harrow, first visit | Free potion |
| Father Ossu | Free full heal |
| Quest clear | DREN'S BOOTS (+15% move) + 120 gold + potion |
| Repeat run clear | 120 + 90×runs gold + potion |

## Dev flags

| Flag | Effect |
|---|---|
| `?arena=1` | Legacy 20-fight gauntlet instead of the adventure slice |
| `?solo=1` | Empty-arena warlock playground (claw-fiend-only summons; dragon/coven gated) |
| `?rig=1` | Retired cutout rig instead of the sheet flipbook |
| `?hud=1` | Shows the hidden GG duel HUD |
| `?hpbars=1` | Shows the hidden floating HP pips |
| `?touch=1` | Forces touch controls on |

Dev modes win over adventure: `ADV.on` is false under `?arena=1`, `?solo=1`, or `?rig=1`.

## Voice & music

Voice = the original pit game's recorded mp3 clips in `assets/voice/` (fnv1a-hash filenames, played by id via `advSay` with a banner subtitle; music ducks 0.35 → 0.10 under voice).

| Clip id | Used for |
|---|---|
| `f2dc4e18` | Tutorial narrator — "THE WARLOCK, a dark elf from even darker realms" |
| `7f80e8d4` | Marlow — the Dren quest intro |
| `0af883b8` | Warlock — "Dead men leave echoes" |
| `5750da4c` | The Well — "plaza of the nameless" |
| `fcd953f2` | Pit gate — "mind the blood on your way out" |
| `0d05c46c` | Warlock — potion purchase |
| `a0196e98` | Marlow — "Five silver..." (too poor to buy) |
| `d29687a3` | Marlow — quest close / sequel hook |

Music (`assets/music/`): `city.mp3` in the village and on the road, `arena.mp3` in the Pit.

---

## CHAPTER 1 — the original main quest (added 2026-07-15)

Unlocks after THE MISSING CHAMPION closes (ask Marlow again; his ears cost **50 gold**). Progress tracked by `ADV.mq` (0-6). New areas WEST of the village: **BACK ALLEYS** (village west edge, unlocks at mq1) → **WEST TRADE ROAD** (ley-line node, the camp, the night caravan).

| mq | Beat | Where | What happens |
|---|---|---|---|
| 1 | THE LISTENING ROOM | Marlow, 50g | Three gifted gone quiet along the trade road — find the camp WEST past the ley-line node |
| 1→2 | THE WAYSTATION | west road (wx≤620) | FIELD FIGHT: capture team (2 hounds, gunner, necro). Voice: narrator waystation + "Fold their camp the way they fold people." |
| 2→3 | THE CAGE | west road | Free the QUARRY BOY (E). He names a buyer in the back alleys. "Run. You're worth more to me as a rumor." |
| 3→4 | THE BUYER | alleys | THE VEILED WOMAN and her humming vial — "they come down the west forest path, new moon." Night falls (screen tint). |
| 4→5 | THE NIGHT SHIPMENT | west road (wx≤980) | FIELD FIGHT: caravan crew (chain, 2 gunners, stitch). "Stop the wagon. What spills, spills." → +90g, potion |
| 5→6 | ASH AND SILENCE | village well (E) | The DRAGON EMPEROR passes through Karridge (Ankunyx voice). "Not yet. Patience is also a weapon." **+200g, CHAPTER CLOSED** — hook: the coach to Varenholm |

**Field-combat mechanics:** `ADV.combat` — encounter waves spawn via `advWave()` in any area; frame() runs the full sim until the wave dies, then `advEncounterCleared()` advances the beat. The pit ladder never advances off a field wave. NPCs: npc_veiled (alleys 900), npc_quarryboy (westroad 560, visible mq2 until freed).
**Next chapters (unbuilt):** mq6 THE DANCER OF VARENHOLM (coach travel, new town) → warlock epilogue wq1-3 (White Writ/Ser Haldric plaza fight, the Black Carriage, Lady Nyx at the Ashenveil Academy).

## Encounter registry (2026-07-15)
All encounters (pit-1…pit-8, camp, caravan) are formally defined in the `ENCOUNTERS` table with 1-2 starting foes each, and completion is PERMANENT — saved to the browser (reload resumes in Karridge with your gold/level/progress; `?reset=1` starts over). GRAVEHANDS lost its stitcher, the waystation fields gunner+necro, the caravan chain+gunner (2-foe cap).

## Movement & evasion (Enhancement #3, 2026-07-15)
**W / ↑ — JUMP** (~170px arc; W again mid-air = **RUNE STEP** double jump: a summoning circle flashes beneath his feet and he kicks off it, ~265px total). **S / ↓ — SLIDE** (0.38s committed low dash, ~1s cooldown, honors held direction). Evasion is skill-timed, not cooldown i-frames: airborne >60px = attacks/projectiles pass under ("LEAPT"); sliding = they pass over ("SLID UNDER"); both let you pass THROUGH the enemy line (the no-overlap ejection pauses while evading). Dedicated warlock_jump (5f) + warlock_slide (4f) sets; shadow shrinks with height; the tutorial teaches it at the 3.6s beat.
