# 07 — Combat

All combat lives in **`src/combat/pit.js`** (one large file). It is a verbatim port of the prototype `the-pit-of-karridge.html`.

## THE RULE: source is law — do not rebalance

The base combat (movement, attack timings, damage dice, parry windows, enemy AI, the kill snowball) was tuned in the original prototype and copied **exactly**. Numbers and feel are intentional. **Do not "balance" them.** New content (a new champion, a new monster) should follow the same patterns, not retune the existing ones. The test harnesses assume this stability.

## General combat systems

- **One sim, two hosts.** `createPitCombat(deps)` returns an `api`. ArenaScene hosts it full-screen (the 20-fight gauntlet); WorldScene hosts a second instance for field encounters. See `01-architecture.md`.
- **The player fighter** is `api.P`; enemies `api.enemies`; warlock/seraph summons `api.demons`; spirit wolves / converted minions / companions `api.wolves`.
- **Inputs** (call these to act): `doSlash()`, `doHeavy()` (+ `heavyRelease()` for hold-attacks), `doParry()`, `doRoll()`. Movement via the `keys`/`stick` objects.
- **Progression differs by champion** (see below). Stats derive from `kills` (ronin) or `level` (others) in the `stat()`/`maxHP()` helpers.
- **Skill cooldowns reset at the start of every fight** (an explicit design choice — see `spawnFight`/`startEncounter`: `P.hexCD=0; P.cdVines=0; ...`). Keep this when adding skills.
- **Field scaling:** in the overworld only, enemy HP scales up as your kill count snowballs (`WorldScene.fieldScale`, toggle `GAME_CONFIG.fieldScaling`). The kits themselves are never touched.
- **Kill cinematics:** fatalities trigger slow-mo + zoom + letterbox + a "FATALITY"/kill-word banner. Dismemberment/blood are decals on a separate canvas.
- **Arena escalation:** after fight 3, every fight adds a `stitch` healer + a random wildcard (tank/gun/raiser/mage) dead-center. Bellow also offers 15 silver to leave (default choice; AUTO takes it). See `ArenaScene.leaveArena` + `pit.js spawnFight`.

## Champion kits (custom features)

### Ronin — pure skill, no magic
- Progression: **per-kill** stat growth (every kill: +2 all stats, +1 katana die). No levels.
- Blade evolves with STR: katana → **NODACHI** (STR 20) → **ODACHI** (STR 40), bigger reach/visual.
- SLASH = 3-hit kendo combo. HEAVY = overhead finisher. **PARRY** = deflect → heal 20% → loose a piercing **air slash** (his signature; only the ronin parries). ROLL = i-frames.

### Druid — shapeshifter
- Progression: LEVEL 1–10. Forms unlock at lv3 (BEAR) and lv6 (WOLF).
- Human: GLAIVE (thrown twin-blade, pierces) + VINES (roots foes, hops her clear). FORM button cycles human→bear→wolf.
- Bear: heavy CLAW + ROAR (stagger/shove), tanky. Wolf: BITE + HOWL (heals her and summons 3 spirit wolves). Forms have per-form cooldowns and a 6s duration.

### Warlock — summoner → arch-devil → lich
- Progression: LEVEL 1–10. Unlocks: BONE DRAGON (lv3), SUCCUBI/COVEN (lv5), ARCH DEVIL (lv8).
- HEX (rot + slow), PORTAL (swap with furthest foe, 3s immunity), BLINK (stun around departure). **SUMMON is a hold-channel**: hold to summon fiend (3s) / dragon (4s) / coven (6s) in one cast.
- Full coven → **ARCH DEVIL** (10s): CLAW lunges to his own demons and devours them; BITE a succubus to ascend her (she then explodes — relocate via portal).
- **LICH** (added later): if the warlock dies while a bone dragon is flying, he doesn't die — he rises as a floating reaper. SCYTHE (light dmg, long stun), FADE (untargetable, summon-only). He is **invulnerable while any bone dragon flies** (the dragon is his phylactery); mortal once the last dragon falls; lich death is final. Drives off `P.lich`, `P.lichRiseT`. -15% base HP as the cost.

### Seraphim — angel, immortal once per fight
- Progression: LEVEL 1–10. Unlocks: CHAINS OF DECREE (lv3, ray binds), TRIUNE MAW (lv6, spear 3rd hit bites + heals), HALO JUDGEMENT (lv8, wide ray).
- SPEAR = a slow, heavy, narrow **poke** (bear-paw damage; deliberately NOT a katana flurry). **HALO RAY** = 1-second cooldown, moderate damage, pierces a line; **anything it kills rises as a light-bound minion** (full HP, 3× attack speed, 7s, then disintegrates and heals him 50%). ASCEND = wings lift him above harm; the landing staggers.
- **Immortal grace (once per fight):** the first lethal hit drops him to one knee — immune + paralyzed 10s, regenerating 10%/s to full — and the foe that felled him gets the **WORTHY** buff (full heal, 3× speed + damage). Then he rises at full strength. A *second* death in the same fight is final (game over). State: `P.kneelT`, `P.graceUsed`.

## Monster behaviors

Every monster is one of the base enemy types; field packs are reskins (different HP/color, same AI). The auto-generated **`wiki/monsters.md`** lists the behavior of each type, the full 20-fight arena roster, and which packs spawn in each zone. AI logic is in `pit.js → updEnemy` (switch on `e.type`). Notable ones: `door` (shielded tank — flank or HEAVY), `grave` (riposte — baits your swing), `stitch` (HEALER — kill first), `gunner`/`pyre` (ranged/fire), `champ` (eats thralls to grow, fight 19), `beast` (final boss, fight 20).

## The AUTO combat bot

`src/core/autopilot.js` (`Autopilot.frame`) is the bot that plays during AUTO mode AND in the test harnesses — **the same code**, so if the tests pass, AUTO works. It has a per-champion branch mirroring each kit. **If you change a kit, update both `autopilot.js` and the matching branch in `tests/gauntlet.js`.**

## Before you touch combat

Run `node tests/gauntlet.js` and `node tests/abilities.js` first to capture a green baseline, make your change, then run them again. If a champion stops clearing the gauntlet or `abilities` reports a NaN/crash, you broke something.
