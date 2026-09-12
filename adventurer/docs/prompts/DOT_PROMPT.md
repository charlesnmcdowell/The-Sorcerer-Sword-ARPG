# POISON, BLEED, HEALERS & BOSSES PASS — percentage DoTs, cleansing heals, enemy healers, boss floors

You are working in `adventurer/` (Phaser 3.87, no build step). Read `README.md` (especially the "Healer & druid pass" section — this pass mirrors its approach: one function computes the number, tiers are percentages of the target's max HP) and the DoT code in `js/core/combat.js`: `addStatus` (the `stacks: true` branch for bleed/poison), `endRoundTicks` (the `DOT_STATUSES` loop that deals the tick), `applyOpportunist`, `spreadSeptic`, `applyStatusRiders` / the `status: { poison, bleed }` field on skills in `js/data/skills.js`, `campaign_skills.js`, `campaign2_skills.js`, `monster_skills.js`, plus the hard-coded sources (`charmWard` poison, Unseen Guard bleed, Serpent Form's on-hit poison, Surgeon's Saw's bleed, Regenerate's offensive Poison mode, `venom_draw` transfer, Afflict's `statusTransfer`).

Also read `js/data/enemies.js` (the 20 base enemies with their `camp: 'law' | 'criminal' | 'wild'` and `actives`), `js/data/campaign_data.js` / `campaign2_data.js` (`CAMPAIGN_ENEMIES` with a skill `pool`, `CAMPAIGN_MINIBOSSES`, `CAMPAIGN_QUESTS[...].enc` with `mini` / `boss` / `with`), `Campaign.spawnEnemy` and `Campaign.buildEncounter` in `js/core/campaign.js` (bosses roll `hp × 1.4`; `spec.boss` unshifts the antagonist actor with `isBossFight = true`), and `Character.maxHp`.

**North star.** Poison and bleed are a kill tool, not a garnish. Today a tick is `srcAtk × power × 0.5 × (1 + srcLevel × 0.015)` — about 3 damage from a starting rogue, invisible next to a 20-point strike and useless against anything with real HP. After this pass, one application at basic takes **half** the target's health in three turns, intermediate takes **all** of it, advanced takes **twice** it. Everything else about how these skills work — stacking, spreading, adjacency, transfers, cures, the perks that multiply or feed on them — stays exactly as it is. Only the size of the tick changes.

---

## 1. The rule

Every poison and bleed tick deals a **percentage of the TARGET's max HP**, decided by the tier of the skill that applied it, spread evenly over **exactly three ticks**:

| tier of the applying skill | total over 3 ticks | per tick |
|---|---|---|
| basic | **50%** | 16.7% |
| intermediate | **100%** | 33.3% |
| advanced | **200%** | 66.7% |

- These are the **pre-perk** numbers. Septic Sanguine's `dotMult` (1.25 / 1.5 / 2.0) multiplies the tick *after* this; Opportunist's +10%-of-max-HP under half health adds *after* this; `dotLeech`, Pyromaniac's burn leech and everything else that reads the dealt amount keep working on the new, larger number.
- Rounding: `Math.max(1, Math.round(tgt.maxHp * pct / 3))` per tick; make the three ticks sum to the total (carry the remainder onto the last tick) so a 100% intermediate application on 91 HP actually deals 91.
- The skill's `power` value on the status (0.5–1.1 today) **no longer feeds the tick**. Leave it in the data (other code may read it) but it does nothing to damage. `srcAtk` and `srcLevel` likewise stop mattering to the tick. Keep both fields on the status object — `srcUid` is still how Septic finds its owner and how the kill is credited.
- Burn is **not** part of this pass. `shadowDot` is not either. Only `poison` and `bleed`. Leave `DOT_STATUSES` and the burn path alone.

Implement one function — `Combat.dotTick(st, status, tgt)` → damage for this tick — and route every poison/bleed tick through it. Nothing else computes a DoT number.

With ticks this size, healing has to be able to answer them, enemies have to be able to heal too, and the fights that are meant to be hard cannot be shorter than the player's health bar. Sections 9–11 cover those three.

## 2. Exactly three ticks

Today a status with `rounds: 3` ticks four times because `fresh` protects it through the round it was cast. That was fine for 3-damage ticks; at 33% a tick the fourth one is a whole extra third. Poison and bleed get a `ticks` counter like the healer pass's `hot`:

- On application: `{ kind, tier, pct, ticks: 3, tickNo: 0, srcUid, stacks? }`. Honour a skill's own `rounds` if it is **not** 3 (Plague Fang's `rounds: 4` stays four ticks — spread the same total over four, the skill is deliberately slower and longer; a skill with `rounds: 2` gets two bigger ticks). Total is always the tier total; duration follows the skill.
- Each end-of-round: tick, `ticks--`, remove at 0. No `fresh` grace for these two kinds.
- **Bug to fix on the way:** several campaign poisons (`campaign_skills.js` — the Bell/Maw poison sprays and Serpent Form's on-hit poison, plus anything else applied with `stacks: true` and no `rounds`) currently **never expire**, because the tick loop only decrements statuses that have `rounds`. Give every poison/bleed a duration; default 3 when the skill names none. Add a test that walks every skill with a `status.poison` / `status.bleed` field and every hard-coded source and asserts the applied status carries `ticks`.

## 3. Which tier

- Applied by an active skill: the manifest tier of that skill for that unit (`manifestFor(u, skillId).tier`) — the same tier that decides the skill's name and other tier fields.
- Applied by a perk or a passive rider (Serpent Form's on-hit poison, Unseen Guard's bleed on the attacker, Paper Charm's `charmWard` poison, Surgeon's Saw's bleed on the healed ally, Warding/Cloak riders, Thorn Lash's poison rider): the tier of the **source skill** that granted the rider; if there is no skill behind it (e.g. the Unseen Guard bleed comes from the guard's *perk*), use the perk's tier; if there is truly nothing, basic.
- Monster skills (`monster_skills.js`): the monster's tier as their skills already resolve it. Enemy DoTs use the **same rule** — a bandit's advanced bleed will take 200% of a player's health in three turns. That is symmetric and probably too lethal for the player side; expose one constant, `ADV.DATA.CONST.DOT_ENEMY_MULT` (default **1.0**), that multiplies ticks applied *by* side B to side A, so it can be tuned to 0.5 without touching any skill. Note it in the README; do not silently pick a value below 1.
- Transfers (`venom_draw` moving all poison from an ally to an enemy, Afflict's `statusTransfer` handing your own DoT to a target): the moved status keeps its `tier`, `pct` and remaining `ticks`; the damage recomputes against the *new* target's max HP (it is a percentage, so a poison pulled off a 60-HP healer and put on a 300-HP boss does boss-sized ticks).

## 4. Everything that must keep working exactly as it does

Do not change the mechanics of any of these; change only the number the tick deals:

- **Stacking.** `stacks: true` still pushes a separate instance per application. Three Venom Fang hits are still three poisons and three bleeds ticking side by side. This means stacks multiply the percentages: two intermediate poisons take 200% over three turns. That is the current stacking rule applied to the new numbers, as asked. Flag it once in the README as the reason a stacked rogue now ends fights very fast; do not add a stack cap unless told to.
- **Adjacency / multi-target** (`adjacent: 1` on Plague Fang and Grave Touch, `multiTarget` on the sprays, `hits: N` on the katana line, lane hazards).
- **Septic Sanguine's spread** (`spreadSeptic` to everyone within two rows), its `dotMult` and `dotLeech`.
- **Opportunist's** +10% of max HP on every damage instance under half health (this stacks with the new ticks; leave it).
- **Cures and immunities:** Cleanse / Purify / Stanch / Restore's `cures: ['bleed']`, `purified`, `statusImmunities`, Demigod's status immunity, `withering`'s heal-cut interaction, `Regenerate`'s offensive mode, `venom_draw`, `Afflict`.
- **Reactions and events:** `applyRawDamage(st, srcU, u, dot, 'dot')` keeps the `'dot'` tag so the combat scene's DoT number colour, the `SpellFX.tick` visuals, the pain reaction and the kill credit all still fire. Down / execute / Arena Champion / Opportunist refund / hatred lines all keep working off the same events.
- **Idle marks and pips:** `idlePoison` / `idleBleed` in `spell_fx.js` and the status pips in `redrawUnit` stay. Add one thing: the DoT number shown on the tick is bigger now, so `SpellFX.tick` should scale its plume/motes by `dmg / maxHp` (a 33% tick gets a visibly larger splash than a 3% one). Nothing else in the UI changes.

## 5. Tooltips and text

`js/ui/tooltip.js` (and any skill description that quotes a DoT amount) should describe the new rule in the skill's own words: "Poison: 50% of the target's health over 3 turns" at basic, and so on, with the current tier's number. Do not rewrite flavour `desc` strings; only the numeric line the tooltip builds.

## 6. Tests

- `test/dot.js` (headless): for `venom_fang` at each tier, one application of poison + bleed on a 300-HP target deals exactly 50/100/200% **each** (so 100/200/400% combined) over three end-of-round ticks and both statuses are gone afterward; a `rounds: 4` skill (Plague Fang) spreads the same total over four ticks; two stacks tick independently and sum; Septic Sanguine multiplies the tick by `dotMult` and heals the owner by `dotLeech`; Opportunist adds `maxHp × 0.10` to each tick under 50%; `venom_draw` moves the poison and the moved ticks recompute on the enemy's max HP; every skill in every data file with a poison/bleed status applies one that carries `ticks` (no more permanent poisons); `DOT_ENEMY_MULT` scales enemy→player ticks and nothing else; `power`, `srcAtk` and `srcLevel` changes do not change the tick.
- Update whatever existing tests assert the old formula (`test/run_tests.js`, `skills2.js`, `campaign_rules.js`, `melee_perks_monsters.js`, `requests4.js` are the likely places — run them, fix the expectations to the percentage rule, do not weaken them).
- `npm test` green (the pre-existing `hiro` / `vo_coverage` audio-asset failures and the `integration.js` seed-3 "player alive" invariant are known and not yours).

---

## 9. Heals cleanse

Every **restoring** heal — healer, druid, and every self-heal — now also strips negative statuses from the target, so a heal is the answer to a DoT and not just a race against it:

- **Healer heals** (`archetype: 'healer'`, `heal: true`, restores HP): remove **all** `poison` and `bleed` instances (every stack) from each target healed, plus `burn`. Basic clears poison + bleed; intermediate also clears `burn` and `healcut`; advanced clears everything in `NEG_STATUSES` (the full Cleanse list). `cleanse` itself is unchanged — it already does the advanced version and also handles undead/conscripts.
- **Druid heals** (the heal-over-time + thorn shield from the healer pass): clear poison + bleed **on application** and again on **each tick** (a druid heal keeps the target clean for three turns; that is the class's answer to stacking). `grove_raise` clears everything on the risen.
- **Self-heals** — anything that heals the *caster*: Septic Sanguine's `dotLeech`, Pyromaniac's `fireLeech`, `lifeSteal` on hits and buffs, Blood Pact's self share, Arena Champion's kill heal, Wild Form / `quartermasters_root` between-encounter heals, Mend's offensive drain, `true_rest`, `clan_blood`, `rum_ration`, food between fights. Rule: a self-heal of **≥ 10% of the caster's max HP in one instance** clears one `poison` and one `bleed` stack (the oldest); ≥ 25% clears all of both. Below 10% it clears nothing — a 3-HP leech does not wash out a plague. Implement this as one check inside `healUnit` keyed on `amount / tgt.maxHp` and on whether `src === tgt` or `src == null`, so every self-heal path gets it without touching each caller.
- Regeneration ticks (`hot` from a healer) clear one poison and one bleed stack per tick, same as a druid tick.
- Emit `{ t: 'cleansed', uid, cured, byHeal: true }` when a heal removes anything, so the existing `cleansed` handler in the combat scene (grey motes flying off) fires and the pips update. Healing NPC AI: `planFor`'s heal weighting should count a poisoned/bleeding ally as "hurt" even above the 70% HP threshold, since the heal now cures them.
- Enemies get the same rule (their healers cure their poisoned allies). That is symmetric and intended.

## 10. Enemy healers in every camp

The base roster (`js/data/enemies.js`) has two criminals who heal (`grave_acolyte`, `gravewarden` with `regenerate`) and nobody else. Add **healing-capable enemies to all three camps**, and make sure the ones that exist actually use their heals:

- **law:** add `field_chaplain` (human, portrait `hedge_mage`, actives `['mend', 'guardian_ward', 'spark']`, `usesOffensiveModes: false`) and give `storm_bailiff` `triage` in place of one damage skill. A watch patrol that heals is what makes "the law" a wall.
- **criminal:** keep `grave_acolyte` / `gravewarden`; add `cutpurse_leech` (human, portrait `bandit`, actives `['blood_pact', 'stitch_and_run', 'backstab']`) — a criminal healer who heals by hurting.
- **wild / neutral monsters:** add `moss_matron` (beast, portrait `frost_hag`, actives `['growth_field', 'regenerate', 'thorn_lash']`, `hpMult 1.2`) and give `thorn_lurker` `thorn_skin` → keep, plus `regenerate` at intermediate. Beasts heal with the druid grammar (green crosses, tree), so `archetype` on their skills decides the visuals automatically.
- Add the three new ids to the encounter tables that draw from `camp` (`quests.js` / wherever `camp` picks enemy types) with a weight so that **roughly one fight in three** at tier 2+ has a healer in it; tier 1 stays healer-free so the first hour is not a slog. Add portraits/tints in `portraits.js` `TYPE_TINTS` or the campaign `skins` pattern so they read differently from their base portrait.
- Campaign factions already each have a healer type (`candle_bearer`, `sanctioned_adept`, `hedge_practitioner`/`academy_proctor`, `poison_sister`, `clan_physician`, `ships_surgeon`, `signal_officer`/`pressed_hand` with `sick_bay`). Leave the pools; §11 guarantees they show up where it matters.
- AI: confirm `combat_ai.js` casts a heal when an ally is under 70% or carrying a DoT (per §9), prefers the lowest ally, and never wastes a revive. Add `test/enemy_healers.js`: every camp has ≥ 2 enemy types with a restoring heal; in a 20-round simulated fight against each of the new types the AI casts its heal at least once when an ally is hurt.

## 11. Faction bosses: never softer than the player

Applies to **every mini-boss encounter** (`spec.mini`, spawned with `boss: true`) and **every antagonist fight** (`spec.boss`, `isBossFight`) in both campaigns, plus the god-line board bosses (`spec.boardBoss`):

- **HP floor.** After the boss is built, if its max HP is below the **player character's max HP** (`Character.maxHp(player)` at the moment the encounter is built — including Arena Champion's permanent gains, gear and food), raise it to that value: `boss.stats.hp = Math.max(boss.stats.hp, playerMaxHp)`, and set `combatHp` to the new max. For paired mini-bosses (`mb.pair` / `mb.count`), each one gets the floor. Do not lower a boss that is already above the player. Antagonists and the branch boss (`crane`/`holloway`) are campaign actors with persistent stats — apply the floor to the combat unit (`u.maxHp` / `u.chp` when `Combat.create` builds it, via a `hpFloor` field on the character), not by mutating their saved stats.
- **Always a tank and a healer.** Each boss / mini-boss encounter's `with` list must contain **at least one tank-role and one healer-role enemy** of that faction. Define a per-faction table `ADV.DATA.CAMPAIGN_BOSS_GUARD = { maw: { tank: 'house_guard', healer: 'candle_bearer' }, antler: { tank: 'rival_company_spear', healer: 'sanctioned_adept' }, varenholm: { tank: 'unlicensed_warder', healer: 'academy_proctor' }, bell: { tank: 'chain_hand', healer: 'poison_sister' }, green: { tank: 'stone_bannerman', healer: 'clan_physician' }, tally: { tank: 'gun_captain', healer: 'ships_surgeon' }, navy: { tank: 'marine_of_the_line', healer: 'signal_officer' } }` (check each id exists and that the healer's `pool` actually contains a restoring heal — fix the pool where it does not, e.g. give `poison_sister` `field_suture`, `signal_officer` `sick_bay`). In `buildEncounter`, after `with` is spawned, if the spawned escorts lack a tank or a healer, **append** the missing one(s) — never replace what the quest author wrote. The added escorts get the mini-boss's `hi` level, and the healer's AI must actually heal the boss (§10). The god-line fights (`drowned_hand`, `house_guard_terrified`) keep their own casts.
- Boss `hitStatus` riders (`bleed` 0.6 / `poison` 0.5 / `burn`) go through §1 like everything else — a boss's on-hit bleed is now a basic-tier 50% bleed. That is a lot; keep it, it is the point of a boss.
- `test/boss_floor.js`: build every quest's boss/mini encounter for every faction with a player at 90 HP and again at 900 HP; every boss unit's `maxHp ≥ player max HP`; every boss encounter's enemy list contains a unit whose skills include a `heal: true` restoring skill and one whose skills include a guard/ward/`bulwark`-family skill; quest-authored `with` lists are still present in full; no encounter grows by more than two units.

## 12. README

Add a section "Poison, bleed, healers & bosses pass" covering §1–§11, the `DOT_ENEMY_MULT` knob, the stacking note, the heal-cleanse thresholds (10% / 25%), the three new enemies, and the boss floor + guard rule.

## 7. Order of work

1. `dotTick` + the `ticks` lifecycle + duration default. Run `test/dot.js` for the three-tier numbers. Stop and show the numbers.
2. Tier resolution for riders, perks, monsters, transfers; `DOT_ENEMY_MULT`.
3. The permanent-poison bug + the data sweep test.
4. §9 heals cleanse (+ `healUnit` self-heal thresholds, AI awareness).
5. §10 enemy healers (three new types, camp weights, AI check, `test/enemy_healers.js`).
6. §11 boss floor + tank/healer guard (`CAMPAIGN_BOSS_GUARD`, `test/boss_floor.js`).
7. Tooltip line, `SpellFX.tick` scale, README section, commit. The user pushes.

## 8. What not to do

- Do not touch burn or shadowDot.
- Do not add a stack cap, a boss resistance, or change any skill's targets, rounds, stacks flag, adjacency or spread. Numbers only.
- Do not compute a DoT anywhere except `Combat.dotTick`.
- Do not let a status be applied without a duration.
- Do not lower `DOT_ENEMY_MULT` below 1.0 on your own; ship it at 1.0 and say in the README that it exists.
- Do not replace a quest's authored `with` escorts to make room for the tank/healer; append.
- Do not lower any boss that already out-healths the player.
- Do not let a sub-10% self-heal strip a DoT.
