# PLAYTEST / QA — running findings (newest on top)

Mission (Hiro): out-find Hiro on bugs — catch them before he can. Balance is NOT a bug unless it makes a
fight unwinnable / blocks progression. Every finding becomes a PERMANENT named regression case.

---

## RUN 2026-06-25

**TL;DR — this run**
- Built a *competent pursue-driver* (`tools/playtest_drive.js`) and PLAYED all 8 champion/road builds — ronin, druid (warden + alpha), warlock (herald, binder, herald→archfiend, binder→lichlord), seraph — through the FULL 20-fight gauntlet (pursue + attack + heavy/parry/roll + abilities + evolutions). **Every build CLEARS; no crash, no NaN, no softlock, no unwinnable fight; entities bounded (max enemies=20, demons=20, wolves=22, fireballs=6), per-frame compute ≤8.6 ms.** The corpse-cull fix holds and is now **PUBLISHED to the play site** (prior run's open publish item = RESOLVED).
- **Found + fixed 1 real defect (P2, test-integrity): the fast smoke gate was running FROZEN.** `tools/smoke_test.js` section-1 ("2000 frames of combat per champion") started its synthetic clock at `t=1000` — far *below* the engine's wall-clock origin (`last=NOW()=Date.now()`). The first `dt` was hugely **negative**, inflating `S.hitPause` to ~1.78e9, so every subsequent tick early-returned in the hit-pause guard: the loop ran **no-op frames**. A frozen harness still looked green (hp finite, mode a string), so a real sustained-combat crash/softlock could have passed silently. Fixed (primed the clock + per-frame freeze guard) and added a permanent regression case. Validated all 22 cases (4 smoke + 18 regressions) green against the live engine.
- **NEEDS HIRO:** nothing blocking. (1) No game code changed this run — only the test harness — so there is nothing to publish to players. (2) This sandbox's OneDrive mount again served a **stale/tail-truncated** copy of `smoke_test.js` after the edit (the known mount hazard); the **canonical desktop file is complete (263 lines) and correct** and was verified clean by reconstructing it in-sandbox and running it. If you want the gate re-run end-to-end, run `python3 tools/safe_publish.py --check-only` from a fresh chat session (clean mount).

### P2 — The fast smoke gate ran FROZEN: section-1 clock was never primed
**Status: FIXED in `tools/smoke_test.js` (test-only; no game code touched). Validated green against the live engine.**

**What it is.** `smoke_test.js` advertises "every champion runs ~2000 frames of combat with periodic inputs without crashing." It did not. The engine derives `dt` in `tick(now)` as `Math.min(.05,(now-last)/1000)` with `last` seeded to `NOW()=Date.now()` (wall-clock epoch ms ≈ 1.78e12). The smoke loop fed a synthetic clock starting at `t=1000`, so the **first** frame's `dt = (1000 − 1.78e12)/1000 ≈ −1.78e9`. That negative `dt` poisons time-derived state — most visibly `S.hitPause`, which inflates to ~1.78e9 and then drains by ~0.0167/frame, i.e. it would take ~1.78e9 seconds to clear. Every tick after frame 1 therefore hits `if(S.hitPause>0){ S.hitPause-=dt; draw(); return; }` and returns **before any combat logic**. Measured directly: an unprimed run deals **9** damage to a dummy over 300 frames (frame-1 only) and locks at `hitPause=1.78e9`; a primed run deals **126** and keeps `hitPause` ≤ 0.043.

**Severity.** P2 (test-integrity, not a game-runtime bug). The game itself is fine on a sane clock — the competent pursue-driver clears all 8 builds cleanly. But the *fast gate* gave **false confidence**: its main combat-coverage section exercised no combat, so a sustained-combat regression could ship green. Directly undermines the "out-find Hiro" mission. (The deeper `perf_regressions.js` was unaffected — it explicitly primes the clock.)

**5 WHYS.**
1. Why did the smoke loop not exercise combat? → After frame 1 the sim was frozen (no state progressed).
2. Why frozen? → `S.hitPause` was ~1.78e9, so every tick early-returned in the hit-pause guard.
3. Why was `hitPause` ~1.78e9? → The **first** frame's `dt` was a huge **negative** number that inflated time-derived state.
4. Why was the first `dt` hugely negative? → The harness clock started at `t=1000`, far below the engine's origin `last=NOW()=Date.now()`; the two clocks share no origin, so `(now−last)` was ≈ −1.78e12 ms.
5. Why wasn't it caught? → The loop's only invariants were "hp finite" and "mode is a string" — both stay true while frozen. No assertion verified the sim actually ADVANCED. (Now fixed: a per-frame `hitPause` bound + a dedicated regression case.)

**ISHIKAWA / fishbone.**
- *Tests/metrics*: ✅ ROOT CAUSE — unprimed harness clock + no "sim-advanced" assertion.
- *Agent-process*: contributing — prior runs treated section-1 as real combat coverage when it was inert.
- *Engine/perf*: NOT a defect — the one-sided `Math.min(.05, …)` dt cap is by design; the engine runs clean on a sane clock (proven: 8/8 driven gauntlet clears).
- *Code-logic / assets / platform-mobile*: ruled out (test harness only; no game code involved).

**Repro (headless).** `createPitCombat({})`, `fullReset('ronin')`, `startEncounter([dummy hp=1e9])`, then drive 240 frames advancing the clock from `t=1000`: `S.hitPause` peaks ~1.78e9 and the dummy takes ≈ no damage. Drive again from `t=Date.now()`: `hitPause` stays < 0.05 and the dummy takes real damage. (Both arms live inside the regression case.)

**Fix (test-only).** In `smoke_test.js` section 1: start the loop clock at `let t=Date.now();` (the engine's origin) so the first `dt` is sane, and add a per-frame invariant `if(api.S.hitPause>1) throw 'sim FROZEN …'` so an un-primed regression fails loudly instead of looking green. No game/`src` code changed.

**Regression case (PERMANENT — never delete).** Added to `smoke_test.js` REGRESSIONS[]:
- `harness:smoke-loop-clock-primed-not-frozen` — pins the freeze signature: a PRIMED clock lands damage with `hitPause` bounded; an UNPRIMED clock (t below wall-clock) demonstrably freezes the sim (`hitPause` ~1e9). Fails if either the priming or the engine's dt behaviour regresses.

**Validation done this run.** Reconstructed the full canonical `smoke_test.js` in-sandbox (the live mount served a stale truncated copy) and ran it against the real `src/combat/pit.js`: **4 smoke + 18 regressions ALL GREEN**, including the two static-source scans (mobile-zoom, archfiend AoE-gate) and the new harness case. Competent pursue-driver: 8/8 builds clear the gauntlet, all arrays bounded, `maxFrameMs ≤ 8.6`. No crash, NaN, softlock, broken transition, or unwinnable fight found.

**New permanent harness.** `tools/playtest_drive.js` — the deep "can a real player clear it / does anything break under sustained driven combat" driver (per-champion/road gauntlet with bounded-growth + frame-time + softlock/unwinnable detection). Complements the fast gate; keep for future runs.

---

## RUN 2026-06-24

**TL;DR — this run**
- Played all four champions through the FULL 20-fight gauntlet headlessly with a *competent pursue driver* (chase + attack + abilities + evolutions), incl. both druid roads (warden) and both warlock roads (herald/archfiend, binder/lichlord): every champion CLEARS, **no crashes, no NaN, no softlock, no unwinnable fight**, frame time ≤8 ms, all entity arrays bounded.
- **Found + fixed 1 real bug (P2): the OPEN LEAD is real** — dead MINIONS were never removed from `enemies[]`, so a prolonged fight vs a raiser/feeder grew the array to 200+ and climbed per-frame cost (unbounded growth). Fixed in `pit.js`; added permanent perf-regression cases.
- **NEEDS HIRO:** (1) **Publish from chat** — this sandbox's OneDrive mount served a *stale, tail-truncated* copy of `pit.js`/`smoke_test.js`, so `safe_publish` correctly **aborted** (won't ship a broken file). The canonical (desktop) source already has the fix; run `python3 tools/safe_publish.py <Neverendingnarratives path>` from a chat session to gate + publish. (2) Logged one **balance suggestion** (uncapped champion thralls) — not changed.

### P2 — Unbounded `enemies[]` growth under sustained combat (resolves the OPEN LEAD 2026-06-21)
**Status: FIXED in source (pit.js). Validated. Publish blocked by sandbox mount → Hiro to publish from chat.**

**What it is.** The standing OPEN LEAD ("a competent pursue driver stalled a champion past 40s/1500 frames;
likely unbounded entity growth or O(n²) under sustained combat") is a **real defect**. Dead MINIONS
(thralls, skeletons, hounds, esuccubi, etc.) were never removed from the `enemies[]` array. The draw loop
stops *drawing* a corpse at `deathT>2`, but nothing ever *culled* it. So any prolonged fight against a
**raiser/feeder** — THE FORMER CHAMPION (throws 2 thralls every 3.25 s, **uncapped**), a necro/warden that
raises the dead — kept piling corpses into `enemies[]`. Reproduced headlessly: a sustained fight grew
`enemies[]` to **200+** entries with per-frame time climbing (every `tick()` iterates `enemies[]` plus
dozens of `enemies.filter(e=>!e.dead)` scans → cost grows O(n), and memory grows without bound). Normal
short fights end before it bites, which is why it never showed in the quick smoke runs — it only emerges
under *sustained* combat, exactly as the lead predicted.

**Severity.** P2. Not a crash or hard softlock, but a genuine perf/memory degradation under long fights
(felt worst on mobile, where every lingering corpse is also drawn/iterated) and the explicit standing lead.

**5 WHYS.**
1. Why does sustained combat slow down / grow unbounded? → `enemies[]` keeps growing during the fight.
2. Why does it grow? → Dead enemies are never removed from the array (only `e.dead=true` + `deathT++`).
3. Why are they kept? → The corpse is needed briefly for the death-fade draw (drawn until `deathT>2`) and
   the **stitcher** can resurrect a fallen *named* foe — so corpses were deliberately retained… for ALL types.
4. Why is that a problem? → Retention was applied to **minions** too, but minions are NEVER resurrected
   (the stitcher only raises `!o.minion` foes) and raisers/feeders spawn them endlessly → infinite corpses.
5. Why wasn't it caught? → The fast smoke gate runs short, *idle-ish* fights that end quickly; no test
   sustained combat vs a feeder, and no test asserted `enemies[]` stays bounded. (Now fixed by the cases below.)

**ISHIKAWA / fishbone (categories checked so the root cause isn't mis-filed).**
- *Code-logic*: ✅ ROOT CAUSE — dead minions retained forever; cull condition missing.
- *Engine/perf*: contributing — per-frame `for(const e of enemies)` + many `enemies.filter(!dead)` scale with corpses.
- *Assets/data*: ruled out (not asset-driven).
- *Agent-process*: contributing — prior smoke never drove sustained feeder combat; no array-size assertion.
- *Tests/metrics*: contributing — no bounded-growth metric; fixed with the new perf cases.
- *Platform/mobile*: amplifier — drawing/iterating hundreds of corpses is worst on mobile, not the cause.

**Repro (headless).** Drive a sustained fight vs THE FORMER CHAMPION (FIGHTS[18], the thrall feeder) or any
raiser, keeping the boss alive; `enemies[]` climbs into the hundreds (mostly dead minions), per-frame time rises.
Deterministic unit repro: spawn a `skel`(minion) + a `door`(named), kill the skel, advance past its 2 s fade —
**before the fix** the dead skel stayed in `enemies[]` forever.

**Fix (pit.js `tick()`, right after the enemy-update loop).** Cull a dead minion once its death-fade is spent:
```
for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(e.dead&&e.minion&&(e.deathT||0)>2)enemies.splice(i,1);}
```
Named foes are intentionally kept (the stitcher resurrects fallen `!minion` foes; named foes are few and
spawn-bounded — they cannot grow without bound). Mirrors the existing `demons[]` cap. Behavior-preserving:
the corpse is already invisible after `deathT>2`, so nothing visual or mechanical changes.

**Regression cases (PERMANENT — never delete).** Added `tools/perf_regressions.js`:
- `perf:dead-minion-culled-named-foe-kept` — a dead minion is removed after its fade; a dead NAMED foe is NOT.
- `perf:enemies-array-bounded-under-sustained-combat` — a wave of killed minions drains; `enemies[]` collapses
  to the living named foe instead of accumulating corpses.
Both **PASS** on the fixed engine and were proven to **FAIL** on the pre-fix engine. (Placed in a dedicated
perf file rather than `smoke_test.js` because that file was mid-sync this run; merge into `smoke_test.js`
REGRESSIONS[] later if preferred — both run headless and gate the same bug.)

**Validation done this run.** `node --check` clean; 4-champion no-crash smoke green; existing
`evo-panel-does-not-re-offer` + `level-never-de-levels` regressions still green (the change is isolated to the
enemy-update loop and cannot touch parry/evo/level/ray logic); both new perf cases green; full-gauntlet pursue
runs for all champions/roads clean and bounded after the fix.

### Suggestion (NOT a bug — logged, not changed): THE FORMER CHAMPION's thralls are uncapped
`champ` AI throws 2 thralls every 3.25 s with **no cap on living thralls**, unlike every other raiser
(necro caps risen skeletons at <8, the enemy `warden` at <6, `cultwarlock` esuccubi at <3). The champion
*feeds* on its thralls and the player kills them, so the LIVING count stayed moderate (~7–14) and the fight
remains winnable — so this is design pressure, not a progression blocker, and per policy it's left unchanged.
With the corpse-cull fix the dead thralls no longer accumulate. If a cap is ever wanted for parity, gate the
throw on `enemies.filter(x=>x.type==='thrall'&&!x.dead).length < N`. (No change made.)

**Clean elsewhere.** Wolves self-cull on `life` expiry (bounded). `demons[]` capped (shift at 12).
particles/bullets/zones/swings/popups all splice on expiry. The Demon Lord / lich cycle, arch-devil → demon
lord, herald coven doubling, and binder black dragon all behaved per spec in driven play (consistent with
`tests/demonlord_qa.js`). No crash, NaN, softlock, broken transition, or unwinnable fight found this run.
