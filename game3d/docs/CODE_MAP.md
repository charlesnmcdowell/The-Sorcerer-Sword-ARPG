# CODE_MAP — arena.html section map

`arena.html` is one file, one inline script, **3876 lines** (2026-07-15). Line numbers below were grepped against the current file; they drift as the file grows — grep the function name if a number looks stale.

> **Hazard reminder:** bash/sandbox shells see this file TAIL-TRUNCATED (~line 2700). Everything from the ADV block down is only visible through host file tools (Read/Grep).

## Section map

| Lines | What | Notes |
|---|---|---|
| 1–110 | HTML/CSS shell | `#wrap` canvas host, hidden GG HUD DOM, touch button cluster markup (`#touch`, `#bHex`…) |
| 116–127 | `SPRITE_TARGET_H` (118) | Per-character TARGET WORLD HEIGHT table — the scale contract (render = `HERO_PX×H[key]/tex.height`) |
| 128–151 | Scale constants | `HERO_PX` (138) = `clamp(VIEW_H×0.27, 200, 420)` — everything scales off it |
| 153–200 | Sim state | `S` (153) mode/fight/time/shake; `P` (154) the warlock: hp, cooldowns, channel, forms (lich/devil), evo picks |
| 201–244 | `hurtWarlock` (201) | Sole warlock-damage sink; death → 3s kneel → lich rise (phylactery dragon summoned at 217, bypasses solo gate) |
| 245–292 | `FIGHTS` (245) | Legacy 20-fight gauntlet roster; `typeLabel` (287), `mkFoe` (291) |
| 297–338 | `spawnFight` (297) | Populates `enemies[]`; solo short-circuit (302), adventure gate (305), repeat-run ×(1+0.35·runs) scaling (309), legacy Bellow deck-stacking (324) |
| 341–470 | Gauntlet helpers | `GAUNTLET_N`, `currentFoe` (342), `FOE_TYPES`/`foeTexFor` (~343), `maxHP` (372) |
| 385–~415 | `killEnemy` (385) | Death popups, loot hook, **hex CONTAGION jump** (393–396: nearest foe, dmg×2, tick 0.4) |
| 470–516 | Evolutions | `pickEvo` (470), `evoTick` (506) — lv10/lv20 card resolution (deadlock-proof auto-default) |
| 517–605 | Projectile/status sim | `updFireballs` (517: hex bolt hit + **stacking** 531–535), `updEnemies` (558: DoT ticks, stun/acid decay) |
| 606–621 | `FOE_AI` table (606) | wind/dmg/heavy/shake per type; ranged standoffs; `foeAIFor` (621) |
| 577 | `foeGuard` (577) | Grave Count guard/riposte stance machine |
| 622–921 | **`updFoeAI` (622)** | THE single AI + damage authority. Branches: stitch heal (635+), generic melee telegraph/swing, pyre zone channel (684), master whistle/whip (711), gunner aim-lock bolt (744), necro raise (766), hound pounce (785), champ thrall/eat (809), beast/brute charge (848), ranged generic (876). `updFoeShots` (909) |
| 923–1029 | Warlock verbs (sim) | `autoFace` (926), `doSlash`→HEX (928), `startChannel` (945), `releaseChannel` no-op (953), `devilClaw` (957), `devilStrike` (972), `lichSlash` (1002) |
| 1030–1143 | UI + cut-ins | `showBanner` (1030), **`hyperCutIn` (1055)** MvC screen-space hyper (NO camera motion), `hyperMini` (1088), `updateGGHud` (~1120) |
| 1144–1234 | Transforms | `enterDevil` (1144), `enterLich` (1163), `fade` (1185), `enterDemonLord` (1192, terminal), outros |
| 1235–1256 | Dev-flag constants | `RIG_PLAY` (1243), `HUD_ON` (1247), `HPBARS_ON` (1250), `SOLO` (1256) |
| 1352–1427 | Summon spawners | **`summonDemons` (1352)** fiend/dragon/coven (spawn 160px out, 4s life, cap 12), `summonZombies` (1398), `summonArchers` (1413) — lich kit, 8s life |
| 1428–1548 | **`updDemons` (1428)** | Summon brains: fiend melee, dragon gas (r110)+fireballs, succubus 150–260 band fire + mend, shambler/archer |
| 1549–1617 | Spacing + timers | **`separateActors` (1549)** no-overlap floors 0.28/0.36×HERO_PX, 2-pass relax; `updZones` (1585: gas/fire/ice/bolt/whipcrack), `updSwings`/`updTracers` (1616) |
| 1618–1677 | Verb entry points | `doHeavy`→summon channel (1618), `doParry`→PORTAL (1628, opposite-side cross + furthest-foe yank + ward), `blink` (1658: 260px back, 230px stun 4s, 2.2s CD), `doRoll` (1672) |
| 1680–1762 | **`frame(dt)` (1680)** | Master sim tick: evo freeze, devil/lich timers, lich clock (6s/8s/12s, 1694–1699), summon ladder tick (1703–1720), sim call chain (1724), auto-face |
| 1763–1996 | `class Arena` + `preload` | Scene (1763), `preload` (1764: sprites+normals, backdrops, `anims.json` manifest 1841), **`loadAnimFrames` (1854)**: manifest → `anim_<set>` auto-build (≥4 frames 14fps, `_idle` 5fps, `BOOT_V` cache-buster; phased `warlock_summon` split 1879) |
| 1997–2235 | `create` (1997) | World build, lights, input (E→`advInteract` 2064), `loadAnimFrames` call (2087), floor/backdrop wiring |
| 2236–2315 | `syncSideOn` (2236) | 1v1 duel foe-sprite sync — **RETIRED path** (2257): foeSprite born hidden (BUG-002); calls retired `foeAI`/`foeMotion` |
| 2316–2609 | **`syncFoeCrowd` (2316)** | The live crowd renderer: every alive foe full-size at its SIM position (2469 — "these ARE the fighters"), hex/flash tints, `?hpbars=1` pips (2497) |
| 2569–2945 | Scene FX/helpers | `channelBeat` (2569), `aimAngle` (2741), `clampArena` (2742), `heroOneShot` (2789), `popup` (2834), `banner` (2839) |
| 2946–3330 | `update(now)` (2946) | Render tick: hero form texture + `SPRITE_TARGET_H` scaling (2967+), keyframe-cycle selection (3054), crowd call (3124), summons render (3304: world-height table sizing) |
| 3330–3463 | Evolution UI | Card panel build (`evoUI`), `updateEvoUI` (3456), `clearEvoUI` (3462) |
| 3465–3739 | **THE ADV BLOCK** | The Dragon's Crown one-shot. `ADV` state (3472), `fightsList` (3478), `advSpeed` (3480: boots +15%), **`ADV_FIGHTS` (3482)**, `ADV_AREAS` (3492), `advSay`/`advMusic`/`advUnlockAudio` (3497/3509/3516), `advInit` (3521, boots on the road + tutorial), `advTutEnd`/`advTutFrame` (3553/3563), `advPitVisible` (3576), `advSetArea` (3581, cover-scaled parallax), `advGoto` (3606), `advEnterPit` (3613), `advPitCleared` (3625, quest reward + repeat runs), `advLoot` (3641), `advDrinkPotion` (3646), `advNearest`/`advInteract` (3652/3661, NPC/quest branches), `advFrame` (3699, push-scroll camera + parallax factors + transitions) |
| 3740–3821 | **Reassignment wrappers** | Render-only features wrapping sim globals: gas-cloud draw on `updZones` (3743), foe-shot bolt sprites on `updFoeShots` (3758), blink stun-wave on `blink` (3783), portal ward-aura on `updZones` again (3803) |
| 3828–3833 | `new Phaser.Game` (3828) | FIT scale, viewport-sized internal resolution |
| 3841–3873 | Touch controls IIFE | Virtual stick → `stick.{dx,dy,on}`; buttons call the SAME global verbs (zero new combat path) |
| 3874–3876 | `</script></body></html>` | If bash says the file ends before here, that's the truncation hazard, not corruption |

## The reassignment-wrapper pattern (tail)

New render behavior is layered onto the sim by capturing and reassigning a top-level function:

```js
{ const _updFoeShots=updFoeShots;
  updFoeShots=function(dt){ _updFoeShots(dt); /* map sim shots -> animated sprites */ }; }
```

Sim untouched, render-only, reaped on despawn, always with a procedural fallback if the anim set isn't loaded. All four current wrappers (3740–3821) follow it; add new ones below them, before `new Phaser.Game`.

## Retired but dormant (do not delete, do not extend)

| What | Where | Status |
|---|---|---|
| Duel `foeAI` / `foeMotion` path | 2610 / 2694 (+ `syncSideOn` 2236 caller) | RETIRED by brawler unification — it moved a theatrical body while `updFoeAI` owned the real one. `foeSprite` born hidden (BUG-002). Kept as reference |
| Cutout rig | preload/create rig sections (~1844) | Retired behind `?rig=1`; sheet flipbook is the standing art direction |
| Old procedural VFX | fallback branches throughout (glow orbs, rings) | Live only as fallbacks when `anims.json` sets are missing — keep them working |
| Herald/binder evolution kits | 416–470, summon mults (1373) | Ported but dormant; lights up via lv10/lv20 picks; BUG-016 will extend |
| Legacy `FIGHTS` gauntlet | 245 | Fully live behind `?arena=1`; door/master/champ/skel exist only here (BUG-009 old sheets) |
