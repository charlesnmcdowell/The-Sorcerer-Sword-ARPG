# Difficulty modes

Three roads, chosen on a new life and changeable any time in town under **Difficulty**. The
choice lives in `meta`, so it follows the player through deaths and new lives. Existing saves
are on Easy, which is the game exactly as it played before this setting existed.

Easy is not a lesser way to play. It is there for people who are short on time and still want
to make progress: quick fights, generous pay, and the auto-combat safety stop. Normal and Hard
are for a challenge, and the challenge is *more enemies and better ones*, not a wall of stats.

## The levers

| Lever | Easy | Normal | Hard |
| --- | --- | --- | --- |
| Extra enemies per fight (the encounter's own kinds; never more adds than you have companions) | 0 | +1 | +2 |
| Enemy skill levels (kits climb tiers; tier-1 mooks bring their perks) | as authored | +2 | +4 |
| Enemy kit floor (no skill below this level) | none | 10 — intermediate kits | 10 — the +4 carries seasoned kits to advanced |
| Lowest enemy level the kit floor reaches | — | level 8 | level 4 |
| Enemy health / attack / defence | ×1 / ×1 / ×1 | ×1.05 / ×1.05 / ×1 | ×1 / ×1 / ×1 |
| Most a basic-tier skill can take in one use | no limit | a third of the foe | a third of the foe |
| Your health buffer | ×2 | ×1.5 | natural |
| Health back after a won encounter | 50% | 35% | 20% |
| Contract pay | +100g | +50g | no bonus, ×0.85 |
| Auto combat stops itself | below 50% | below 30% | never |
| Solo flee warning (naval narrator) | yes | yes | no |

The kit floor reaches only enemies that are already seasoned. A wolf on a first contract is a
wolf, not a veteran wolf: below the threshold a creature fights with the kit it was written
with. Applied to everything, the floor put an intermediate kit on every mook on the road —
40% more damage, and a second strike on the skills that gain one at that tier — which made
early Normal bite far harder than intended. Measured on early contracts, an ordinary group now
needs about 38 rounds to put a healthy character down on Normal and 25 on Hard, against 72 on
Easy; before the threshold it was 15 and 10.

A basic-tier skill is an opener from Normal up, not an execution: one use takes at most a
third of a foe's maximum health and never kills outright, however far the wielder outclasses
them. The allowance covers the whole action, so extra hits and anything the blow sets off draw
on the same third. Easy keeps no limit — it is the game as it has always played.

What never changes: stories, companions, choices, rewards in kind, loot, and the stats of
anyone on your side — conscripts, the risen, hired hands and story companions fight with the
stats you can read on them. Rival guild parties (ambushes, raids) are not scaled either.

A lone boss stays a lone boss: reinforcements copy only the non-boss kinds already in the
encounter, and solo work gets no adds at all — a lone fighter meets veterans, not a crowd.
On the Varenholm's Gate road the adds are as silent as the rest of the cast.

## Where it lives

- `js/core/difficulty.js` — the table, `Difficulty.set/id/def`, `toughen` (veterans),
  `reinforce` (adds), `pay`, `recoverPct`, `autoStopPct`. Binds on every new game and load.
- `js/core/character.js` — `effStat` applies the player buffer and the enemy edge;
  `makeEnemy` toughens.  `js/core/campaign.js` — `spawnEnemy` toughens.
- `js/core/game.js` — `currentEncounter` reinforces after the spawn.
- `js/core/combat.js` — post-victory recovery.  `js/core/balance_support.js` — pay.
- `js/ui/scene_combat.js` — the safety stop and flee warning.
- `js/ui/difficulty_ui.js` — the town panel and the new-life modal;
  `scene_creation.js` asks after the personality pick; `scene_town.js` lists the panel.

## Calibration

`test/difficulty_sim.js` plays the game headlessly on each setting with the game's own enemy
AI driving the player — a competent but unspectacular policy that never tanks a boss — and
reports win rates and health left. `npm test` runs a quick pass and fails if the ladder breaks:
each step down must cost wins and health, Easy must stay a near-sure thing in ordinary work,
Normal must keep at least four fifths of Easy's party wins, and Hard must keep at least
forty-five percent of them while costing real wins.

Full run, six seeds, six builds (fighter, mage, ranger, healer, tank, rogue):

| Scenario | Easy | Normal | Hard |
| --- | --- | --- | --- |
| Solo career, tier 1 | 100% win, 100% hp | 100%, 100% | 100%, 97% |
| Solo career, tier 2 | 98%, 100% | 98%, 97% | 98%, 89% |
| Solo career, tier 3 | 100%, 99% | 100%, 97% | 90%, 96% |
| Party of four, tier 2 | 95%, 100% | 87%, 97% | 61%, 95% |
| Party of four, tier 3 | 93%, 100% | 75%, 94% | 41%, 88% |
| Varenholm's Gate, chapters 1–4 | 23% | 23% | 25% |
| Varenholm's Gate, chapters 10–13 | 25%, 87% | 25%, 73% | 15%, 55% |
| Varenholm's Gate, all | 14% | 14% | 11% |

Four seeds, six builds (fighter, mage, ranger, healer, tank, rogue), measured after the
balance pass, the basic-tier cap and the kit-floor threshold.

Read the Gate rows as relative, not absolute: the Gate
now gives every enemy five times the health and twice the attack and defence
(`CAMPAIGN3_COMBAT`), and the AI player never guards, taunts, retreats or brings the
scripted company's full kit — a person does. The three columns still fall in order, which is
the contract. `node test/difficulty_sim.js` runs the full pass; `--only=hard --scenario=party
--override='{"hard":{"foeLevel":6}}'` tries a lever without editing the table.
