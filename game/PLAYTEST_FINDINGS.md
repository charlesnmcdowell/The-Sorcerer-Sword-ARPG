# PLAYTEST / QA — running findings (newest on top)

Mission (Hiro): out-find Hiro on bugs — catch them before he can. Balance is NOT a bug unless it makes a
fight unwinnable / blocks progression. Every finding becomes a PERMANENT named regression case.

---
## RUN 2026-06-28 (J) — LOGIC CLEAN

**TL;DR.** Floor `smoke_test.js` = **4 smoke + 20 regressions PASS** (exit 0). Deep pursue-driver `playtest_drive.js`
played all **8** champion/road builds (ronin, druid/warden+alpha, warlock ×4: herald, binder, herald→archfiend,
binder→lichlord, seraph) — **outcome=CLEARED each** (19/20 waves), **no crash / NaN / softlock / unbounded growth /
unwinnable fight**. Entities bounded (maxE≤18, maxD≤20, maxW≤22, maxFire≤5), maxFrameMs≤11.21. The 2026-06-21
unbounded-`enemies[]` and 2026-06-24 pursue-driver-stall open leads remain RESOLVED & PUBLISHED. No new logic case.

---
## RUN 2026-06-28 (I) — LOGIC CLEAN

**TL;DR.** Floor `smoke_test.js` = **4 smoke + 20 regressions PASS** (exit 0). Deep pursue-driver `playtest_drive.js`
(ran intact this run) played all **8** champion/road builds — ronin, druid/warden+alpha, warlock ×4
(herald, binder, herald→archfiend, binder→lichlord), seraph — **outcome=CLEARED each** (19/20 waves), **no crash /
NaN / softlock / unbounded growth / unwinnable fight**. Entities bounded (maxE≤16, maxD≤20, maxW≤22), maxFrameMs≤10.05.
Pursue-driver open lead still **RESOLVED** (no stall on any build). No new logic case needed. (Visual lane: see
PLAYTEST_FINDINGS_VISUAL run I — one P1 = new anim_coverage instrumentation gap, logged there.)

---
## RUN 2026-06-28 (H) — LOGIC CLEAN

**TL;DR — this run**
- **Logic: ALL GREEN.** Floor `smoke_test.js` = 4 smoke + 20 regressions PASS (exit 0). Deep pursue-driver
  (`tools/playtest_drive.js`, ran intact this run) played all **8** champion/road builds — ronin, druid/warden+alpha,
  warlock ×4 (herald, binder, herald→archfiend, binder→lichlord), seraph — **outcome=CLEARED each** (19/20 waves),
  no crash / NaN / softlock / unbounded growth / unwinnable. Entities bounded (maxE≤15, maxD≤20, maxW≤22).
- **Pursue-driver open lead: still RESOLVED** (REGRESSION_TESTS.md L28-29) — no stall on any build.
- **One soft-threshold flag, NOT a new bug:** warlock/binder-lichlord threw a single per-frame compute spike of
  **50.4 ms** (driver soft threshold 50 ms; that build's typical max ~6–9 ms). Same one-off variance class already
  characterized below (seraph 51.8 ms, "~once in 6 runs, fight still cleared"). Fight CLEARED, spike is transient
  (1 frame of 27,431), entities bounded. Logged as variance — no permanent hard per-frame cap added (a flaky
  one-off cap would manufacture false failures). Watch for recurrence / sustained drift.
- **Mount note (env, not a game bug):** OneDrive sandbox mount again served TRUNCATED tails of `parity_lint.js`
  (140/158) and `arena.html` (1088 lines, no Phaser.Game/</html> tail) to bash → node SyntaxError / the lint's own
  truncation guard would bail INDETERMINATE. Real files on disk verified WHOLE via Read (parity_lint ends clean at
  158; arena.html continues well past 1088). `smoke_test.js` + `playtest_drive.js` came through intact.
- **Visual lane: PASS.** Live auditor `latest.json` FRESH (ts ~minutes old), verdict PASS, **0 P1 fails** — canvas
  100%×100%, touch stick+4 btns, warlock 34% H, all 3 backdrop layers; P2 lighting pass (light2d+bloom+vignette;
  `embers=False` the only sub-item, already a logged planned P3). See PLAYTEST_FINDINGS_VISUAL.md.
- **Needs Hiro:** nothing blocking. Auditor is running — keep it up (`python game3d/tools/visual_audit.py --watch`).

---
## RUN 2026-06-28 (G) — LOGIC CLEAN

**TL;DR — this run**
- **Logic: ALL GREEN.** Floor = 4 smoke + 19 regressions PASS, + 3 perf cases PASS (dead-minion cull /
  enemies[] bounded / wolves lifespan-cull — the old 2026-06-21 open lead). Deep pursue-driver (reconstructed
  in /outputs to dodge active mount truncation, run vs live `src/combat/pit.js`, 3436 lines) cleared **all 8**
  champion/road builds — ronin, druid/warden+alpha, warlock ×4 roads, seraph — **outcome=CLEARED each**, no
  crash / NaN / softlock / unbounded growth / unwinnable. maxFrameMs ≤ 14.2ms; maxE 20, maxD 20, maxW 24, all
  well under caps.
- **Pursue-driver open lead: still RESOLVED** (REGRESSION_TESTS.md lines 28-29) — no stall on any build.
- **Mount note (env, not a game bug):** OneDrive sandbox mount again served TRUNCATED tails of `parity_lint.js`
  (140/157) and `playtest_drive.js` (108/134) — node SyntaxError on the cut copies. `smoke_test.js`,
  `perf_regressions.js`, `pit.js` came through intact this run. Files on disk are whole (verified via Read/Grep).
  Workaround used: drove from a sandbox copy against live pit.js. Visual lane: see PLAYTEST_FINDINGS_VISUAL.md (H).
- **Needs Hiro:** restart the visual auditor (`python game3d/tools/visual_audit.py --watch`) — latest.json ~91 min stale.

---
## RUN 2026-06-27 (F) — LOGIC CLEAN (3rd green today)

**TL;DR — this run**
- **Logic: ALL GREEN.** Floor = 4 smoke + 19 regressions PASS. Deep pursue-driver (reconstructed in /tmp to
  dodge the active mount truncation, run vs live `src/combat/pit.js`) cleared **all 8** champion/road builds —
  ronin, druid/warden+alpha, warlock ×4 roads, seraph — **19/20 fights each, outcome=CLEARED**, no crash / NaN /
  softlock / unbounded growth / unwinnable. maxFrameMs ≤ 8.1ms, entity arrays well under caps.
- **Pursue-driver open lead: still RESOLVED.** No stall on any build.
- **Mount note (env, not a game bug):** the OneDrive sandbox mount served *every* game/game3d tool file
  tail-truncated this run (`tools/playtest_drive.js` 108/134, `game3d/tools/parity_lint.js` 140/158,
  `visual_audit.py` 174/full, `arena.html` ~1088/~2190). The Read tool confirms the real files on disk are
  INTACT — this is the known OneDrive tail-truncation hazard, so the in-sandbox driver was run from a clean
  reconstructed copy. No file written back through the truncated mount.

| build | outcome | fights | maxE | maxFrameMs |
|---|---|---|---|---|
| ronin | CLEARED | 19/20 | 12 | 3.47 |
| druid/warden | CLEARED | 19/20 | 10 | 7.45 |
| druid/alpha | CLEARED | 19/20 | 10 | 4.40 |
| warlock/herald | CLEARED | 19/20 | 20 | 7.38 |
| warlock/binder | CLEARED | 19/20 | 12 | 8.11 |
| warlock/herald-archfiend | CLEARED | 19/20 | 14 | 7.36 |
| warlock/binder-lichlord | CLEARED | 19/20 | 14 | 6.22 |
| seraph | CLEARED | 19/20 | 6 | 4.83 |

**STATUS:** Logic CLEAN. No new regression case (nothing failed). Visual lane unchanged — see VISUAL run (G).

---
## RUN 2026-06-27 (E) — LOGIC CLEAN (2nd green today)

**TL;DR — this run**
- **Logic: ALL GREEN.** Floor = 4 smoke + 19 regressions PASS. Deep pursue-driver (reconstructed in-sandbox
  to dodge the mount truncation, run vs live `pit.js`) cleared all 8 champion/road builds — ronin,
  druid/warden+alpha, warlock ×4 roads, seraph: **19/20 each, CLEARED**, no crash / NaN / softlock /
  unbounded growth / unwinnable fight. Peak frame ≤6.7 ms; arrays bounded (maxE≤16, maxD≤20, maxW≤22,
  maxFire≤7). No `game/src` change → nothing to ship.
- **Mount-truncation hazard re-confirmed (tooling, not a game bug):** this run the OneDrive mount served
  `playtest_drive.js`, `parity_lint.js`, `visual_audit.py` AND `arena.html` all tail-truncated. Worked
  around via Read (full cloud copy) + sandbox reconstruction. Already in memory.
- **NEEDS HIRO:** nothing on logic. Visual lane has one escalation — see `game3d/PLAYTEST_FINDINGS_VISUAL.md`
  run (E): the DC visual gate is reporting 2 phantom P1s (auditor reads `window.__AUDIT__` null though the
  screenshot proves the scene renders correctly); fix = seed `__AUDIT__` in `create()` and/or poll in the auditor.

---
## RUN 2026-06-27 (D) — LOGIC CLEAN; MOUNT TRUNCATION RE-CONFIRMED ON TOOLS

**TL;DR — this run**
- **Logic: ALL GREEN.** Floor = 4 smoke + 19 regressions PASS. Deep pursue-driver cleared all 8
  champion/road builds (ronin, druid/warden+alpha, warlock ×4 roads, seraph): 19/20 each, no crash /
  NaN / softlock / unbounded growth / unwinnable fight. Peak frame ≤10.8 ms; arrays bounded
  (maxE≤21, maxD≤20, maxW≤30, maxFire≤6). No `game/src` change → nothing to ship.
- **No new logic bug.** Open lead (pursue-driver stall) remains RESOLVED + published.
- **Tooling hazard re-confirmed (not a game bug):** the OneDrive mount served `tools/playtest_drive.js`
  TRUNCATED (108 of 135 lines → `SyntaxError` mid-template-literal at the tail). The authoritative cloud
  copy is intact (verified via the editor). Worked around by reconstructing the driver in the sandbox
  scratchpad from the true source and running it against the live `pit.js`. Same hazard hit `arena.html`
  and `parity_lint.js` (see visual findings). **Persistent in-sandbox QA hazard, already in memory.**
- **NEEDS HIRO:** nothing on logic. Visual lane: confirm the visual auditor is reading the CURRENT
  `arena.html` (its 18:29 verdict predates the now-synced `window.__AUDIT__` hook) — see VISUAL findings.

---
## RUN 2026-06-27 (C) — VARIANCE-VS-BLOCKER HARNESS HARDENING; ENGINE CLEAN

**TL;DR — this run**
- **Logic: ALL GREEN.** Floor = 4 smoke + 19 regressions PASS. Deep pursue-driver cleared all 8
  champion/road builds (ronin, druid/warden+alpha, warlock/herald+binder+herald-archfiend+binder-lichlord,
  seraph): no crash / NaN / softlock / unbounded growth / unwinnable fight; max frame ≤10 ms; arrays bounded.
- **OPEN LEAD investigated → it was RNG variance, not a blocker.** First driver run showed
  `warlock/binder DIED@fight3 (picks=0)`; 4 confirmation re-runs cleared 19/20 (binder also cleared every time;
  a later run saw `druid/alpha DIED@fight20` once). Deaths land at random fights on random champions — pure
  variance from the engine's unseeded `Math.random`. **Binder dies BEFORE any road divergence** (road10/road20
  only differ at the lv10/20 evo pick; a fight-3 death with picks=0 is pre-divergence), proving it's not a
  binder-specific blocker.
- **1 QA-tool defect FIXED (tooling, not the game):** `playtest_drive.js` flagged every single-run `DIED` as
  `[REVIEW]`, so RNG losses masqueraded as findings and forced a manual 4× re-run every session to tell variance
  from a real bug. Hardened: a `DIED`/`STALL` now auto-CONFIRMS via up to 2 re-runs — clears-on-retry →
  non-failing `[VARIANCE]` note; fails-every-attempt → `[REVIEW]` (a real lead). No `game/src` changed (QA tool
  only), so nothing ships to players.
- **NEEDS HIRO:** nothing blocking on logic. (Visual lane escalations are in `PLAYTEST_FINDINGS_VISUAL.md` /
  this run's chat TL;DR: start the visual auditor; touch-controls P1 still open.) OneDrive tail-truncation struck
  the mount again right after the edit (caught: `node --check` on the mount failed on a truncated tail) — the
  authoritative cloud copy was verified complete via the editor and the new branch logic was unit-checked in the
  sandbox before trusting it.

### Finding — pursue-driver flagged RNG-variance deaths as findings (P3, tests/metrics)
- **What.** Driven combat is non-deterministic (unseeded `Math.random` in rolls/foe-AI). A "competent but not
  optimal" driver will, on bad luck, occasionally lose a winnable fight. The old driver flagged *any* single
  `DIED` as `[REVIEW] (balance or blocker — inspect)`, indistinguishable from a true unwinnable/blocker.
- **Impact.** False-positive churn: every prior run had to manually re-play the driver ~4× to decide
  variance-vs-blocker (see RUN A/B notes), wasting the cycle and risking a real blocker being dismissed as "just
  variance" by pattern-fatigue.
- **Repro.** `node tools/playtest_drive.js` on consecutive runs → a different champion `DIED@fight{n}` each time
  (binder@3, herald@18, herald-archfiend@14, druid/alpha@20 observed across runs); each clears on re-run.
- **5 WHYS.** 1) Why noisy? single-run death flagged as a finding. 2) Why is a single death uninformative? the
  sim is RNG-driven and the driver is sub-optimal, so loss probability per run is non-zero on hard fights. 3) Why
  flagged anyway? the harness had no notion of variance — one run, one verdict. 4) Why did that persist? prior
  runs worked around it by hand (re-running 4×) instead of encoding the confirmation. 5) **Root cause:** a
  metrics gap — the harness conflated a stochastic outcome with a deterministic defect; the fix is to *measure
  repeatably* (confirm before flagging).
- **ISHIKAWA.** *tests/metrics:* single-sample verdict on a stochastic process (root). *code-logic:* engine RNG
  unseeded (by design — real gameplay variance; not changing it). *agent-process:* manual re-run workaround never
  codified. *engine/perf:* n/a (no crash/growth). *assets/data:* n/a.
- **Fix (QA tool only).** `playtest_drive.js` now CONFIRMS a `DIED`/`STALL` with up to `CONFIRM_RETRIES=2`
  re-runs: any clear → `[VARIANCE]` (non-failing, printed); all attempts fail → `[REVIEW]` (genuine lead).
  **Permanent guard** = the confirmation logic itself (newest driver behaviour); branch verified with a stub over
  die-then-clear / die-die-clear / all-die / clean / stall-consistent (correct VARIANCE vs REVIEW each time).
  No `smoke_test.js` REGRESSIONS[] case added: this is not a game bug (the engine is correct; deaths are
  intended variance), so a hard regression assertion would be wrong.

---

## RUN 2026-06-27 (B) — POST-GAME TRANSITIONS + MOBILE SWEEP; QA-TOOL DEFECT FIXED

**TL;DR — this run**
- **Played all 8 champion/road builds + 3 mobile resolutions. Engine is CLEAN.** Floor green (4 smoke + 19
  regressions + 3 perf). Deep pursue-driver clears all builds (no crash/NaN/softlock/unbounded growth; max
  frame ≤11.4 ms). Immortal-boss stress CLEAN (every array bounded). NEW: death/victory→restart hygiene probe
  and a mobile/portrait/tablet + mid-fight-rotation probe — both CLEAN.
- **1 real defect found & FIXED — in the QA tooling, not the game:** `tools/stress_immortal.js` carried a
  stale hardcoded default engine path from a prior session's mount, so on any future run *without an explicit
  absolute path it silently `LOAD FAIL`s* (exits 2) — a perf detector that can't load the engine would mask a
  real regression. Fixed to self-locate (`__dirname`-relative default; relative argv resolves against cwd) like
  `playtest_drive.js`. Verified: runs CLEAN from `tools/` with no path arg.
- **NEEDS HIRO:** nothing blocking. No `game/src` changed (only a QA tool), so nothing ships to players.
  The two driver `DIED` REVIEW flags (herald @ fight18, herald-archfiend @ fight14) are **RNG variance, not a
  blocker**: with the engine's 36 unseeded `Math.random` calls the dumb driver is non-deterministic; across 4
  driver runs herald cleared 3/4 and herald-archfiend 3/4, and both clear fight 18 under the immortal stress —
  the fights are winnable, so per policy it stays balance/feel, not a bug. OneDrive tail-truncation struck once
  mid-edit (caught by `node --check`); reconstructed from the canonical git blob + atomic write.

### Finding — `stress_immortal.js` silently fails to load the engine (P3, agent-process/tooling)
- **Repro:** `cd game/tools && node stress_immortal.js` (no args) → `LOAD FAIL Cannot find module
  '/sessions/fervent-dreamy-gauss/mnt/Documents--The Sorcerer Sword ARPG/game/src/combat/pit.js'`, exit 2.
- **Severity P3** (tooling, not player-facing) but consequential: a perf/unbounded-growth detector that no-ops
  can let an array-growth regression slip past a run that *looks* like it exercised the stress.
- **Fix:** `const PIT = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.join(__dirname,
  '..','src','combat','pit.js')`. Durable guard is structural: **no session-specific absolute path is hardcoded
  anymore**, so it can't go stale; it resolves relative to the tool itself. Verified CLEAN no-args run.
- **5 WHYS.** 1) Why did the tool fail to load? → its default `PIT` was an absolute path into a *previous*
  session's mount. 2) Why was that path there? → it was written as a convenience default when the tool was first
  authored in that session. 3) Why does that break now? → sandbox mount roots are per-session
  (`blissful-fervent-shannon` ≠ `fervent-dreamy-gauss`), so last session's absolute path doesn't exist this run.
  4) Why wasn't it caught? → the tool was always invoked with an explicit absolute path in the run that created
  it, so the default branch was never exercised. 5) Why does it matter? → a silent `LOAD FAIL` (exit 2) can be
  mistaken for "ran and found nothing," hiding a future unbounded-growth regression — the exact class this tool
  exists to catch.
- **ISHIKAWA.** *Agent-process*: ✅ root cause — hardcoded mount path is non-portable across sessions (now
  removed). *Tests/metrics*: a load-failure could masquerade as a clean run; mitigated by self-location + the
  tool still exiting 2 loudly. *Code-logic/engine/assets/platform*: ruled out — game engine unaffected.

### New coverage this run (probes kept for re-run; no game code changed)
- **Transition-hygiene probe** (`outputs/transition_probe.js`): drives each champion to real death/victory, then
  `fullReset`→`startFight` ×4, asserting no leaked entities, no stuck mode, no NaN, no evo/form bleed, and that
  the restarted fight resumes. Result: CLEAN (ronin/druid/warlock/seraph).
- **Mobile/resolution probe**: 390×844, 360×640, 820×1180 + mid-fight rotation across ronin/warlock/seraph —
  no crash/NaN. (Covers the platform-mobile fishbone branch the 900×600 gauntlet skips.)

**Process note for next run.** The `DIED` REVIEW flags from `playtest_drive.js` are inherently noisy because the
engine RNG is unseeded and the driver is intentionally dumb. To make a true *unwinnable/blocker* distinguishable
from variance deterministically, a future hardening could seed `Math.random` in the harness and flag P1 only when
a build dies under *all* seeds. Not done this run (would touch a tool, not the game); logged as a lead.

---


## RUN 2026-06-27 — SLOPE-BASED UNBOUNDED-GROWTH SWEEP (all 9 builds)

**TL;DR — this run**
- **Floor + gauntlet GREEN.** 4 smoke + 19 regressions + 2 perf cases pass; the competent pursue-driver
  clears all 8 champion/road builds (no crash/NaN/softlock/unbounded growth/unwinnable; max frame ≤16.5 ms).
- **NO new real bugs.** Built a harder probe than the gauntlet — a 9-build *immortal-boss sustained-combat
  stress* (`stress_immortal.js`) that pins a fight open and uses a **least-squares slope** over the 2nd half
  of a long run to catch *unbounded* growth (not just peak). Two arrays flagged a positive slope; **both chased
  to ground as non-bugs** (details below). Added **1 new permanent perf regression** hardening the wolf pack
  against a future unbounded-growth regression.
- **NEEDS HIRO:** nothing blocking. No game code changed (only `tools/perf_regressions.js` gained a case), so
  nothing ships to players. One *standing balance call* re-surfaced with hard data (uncapped FORMER-CHAMPION
  thralls) — already deferred as a suggestion; left unchanged per policy. The OneDrive mount again served a
  **stale/tail-truncated** copy of the edited test file; the **canonical on-disk file is complete (92 lines)**
  and the suite was validated by in-sandbox reconstruction (all 3 perf cases GREEN vs the live engine).

### Two slope signals — BOTH non-bugs (do not chase as regressions next run)
1. **ronin `enemies[]` → 192 and climbing (+10/1k) — NOT a bug.** Locked to fight 18 (the thrall feeder) with
   the boss(es) **artificially immortal**, `enemies[]` grew linearly. Instrumented the breakdown: it is **100 %
   LIVING thralls** (`live=187, dead=0, deadMinion=0`) — the prior corpse-cull fix is intact (zero corpses
   accumulate). It grows *only* because the harness makes the boss unkillable so the fight never ends; the
   FORMER CHAMPION's thrall spawn is **uncapped** (the standing balance suggestion from RUN 2026-06-24). In real
   play the boss dies in tens of seconds, bounding the living count (~7–14). **Not progression-blocking** (the
   driver clears fight 18), so per policy it stays a *suggestion*, not a change. Hard data now refutes the old
   "stays moderate" assumption: living thralls are genuinely *uncapped*, bounded only by fight duration.
2. **druid/warden `wolves[]` → 47 (+2.2/1k) — NOT a bug (equilibrium approach).** `wolves[]` has a hard
   lifespan/hp cull (`updWolves`: remove on `w.life<=0 || w.hp<=0`), so a long fight reaches a **finite
   equilibrium** (spawn-rate × lifespan), consistent with RUN 2026-06-26 (B)'s 60k-frame oscillation (131→178,
   non-monotonic). The +2.2/1k at 18k frames is sub-equilibrium climb, not unbounded growth. Confirmed the cull
   is the sole bound — see the new regression.

### New permanent regression (never delete) — pins the wolf-pack bound
- `perf:wolves-bounded-by-lifespan-cull (playtest 2026-06-27)` in `tools/perf_regressions.js`. Pushes 31 wolves
  (20 about-to-expire + 10 zero-hp + 1 long-lived keeper), sustains ~0.16 s, and asserts the 30 expired/dead
  wolves **drain** while the living keeper is **kept**. **Validated discriminating:** PASS on the live engine
  (survivors=1); on a mutant engine with the `wolves.splice` cull disabled it correctly **FAILS** (survivors=31,
  "cull regressed"). This closes the last unbounded-growth array (`demons[]` cap + `enemies[]` corpse-cull were
  already pinned; `wolves[]` was not) — so if the wolf lifespan cull ever regresses, a long druid/warden fight
  can no longer silently grow the pack without bound.

**5 WHYS (why no bug despite two growth signals).** 1) Why did arrays grow? → the harness pinned the fight open
with an immortal boss. 2) Why does that grow them? → spawners (thralls, wolves) keep producing while the fight
can't end. 3) Why is that not a real defect? → real fights END (boss is killable), bounding duration → bounding
counts. 4) Why trust that bound? → wolves are lifespan-culled (finite equilibrium) and dead minions are
corpse-culled (RUN 2026-06-24); only *living* thralls are uncapped, and that's a winnable design pressure, not a
blocker. 5) Why pin a case anyway? → the wolf bound rested on one un-tested invariant (the cull); a future edit
could remove it and only a *sustained* fight would reveal it — now caught deterministically.

**ISHIKAWA.** *Tests/metrics*: ✅ closed a coverage gap (no prior assertion on the wolf cull). *Code-logic /
engine-perf*: no defect (culls/equilibria correct). *Agent-process*: the immortal-boss harness is a harder probe
than the gauntlet and surfaced the un-pinned invariant. *Assets/platform*: ruled out.

---

## RUN 2026-06-26 (B) — PUBLISH + DEEP-STRESS SWEEP

**TL;DR — this run**
- **SHIPPED the standing P1.** The herald/archfiend `updDemons` reentrancy fix (RUN 2026-06-26 A) was fixed
  on disk but had **never reached players** — confirmed the live play-site `pit.js` was missing the guard at
  the exact crash site. Reconstructed the truncated mount source in-sandbox, ran it through the gate
  (`safe_publish.py`) from the verified-complete tree, and **published build 1782514927**: guard now live,
  post-verify `node --check` clean on all 26 published files. This closes the cross-run "NEEDS HIRO: publish
  from chat" item.
- **Floor + driver GREEN.** 4 smoke + 19 regressions + 2 perf cases all pass against the live engine; the
  competent pursue-driver clears all 8 champion/road builds (no crash/NaN/softlock/unbounded growth/unwinnable;
  entities bounded, frame ≤~24 ms worst-case binder).
- **Deep-stress sweep (new, harder than the gauntlet): NO new real bugs.** Structurally proved `demons[]` was
  the *sole* reentrant-shift loop (see below) and the guard holds across **every** real summon kill-site. Three
  raw stress signals were all chased to ground as **harness artifacts / non-bugs** (details below) — important
  so they're not mistaken for regressions next run.
- **NEEDS HIRO:** nothing blocking. The fix is published to `play/` but **not committed/pushed** (policy: never
  git push) — commit & push the site repo when ready. Source mount still served tail-truncated `pit.js`/
  `smoke_test.js` (known OneDrive hazard); canonical disk files are complete and were validated by in-sandbox
  reconstruction.

### Confirmed shipped — P1 reentrancy guard now LIVE on the play site
The RUN-A fix (`if(!d)continue;` in `updDemons`) was verified ABSENT from `Neverendingnarratives/play/src/combat/pit.js`
(guard count 0; loop went straight to `d.life-=dt` — the crash site). Published via the gate from a
reconstructed-complete source tree; re-checked the published file: guard present, `node --check` clean,
`build.txt` = 1782514927. Players on herald / herald-archfiend no longer carry the intermittent late-fight crash.

### Negative result (valuable) — `demons[]` is the only reentrant-shift hazard; guard holds everywhere
Audited `killEnemy()` and every backward index-cached loop (`demons`, `fireballs`, `wolves`, `bullets`,
`zones`, `particles`, `popups`, `swings`, `rays`, `limbs`, `tracers`, enemies-cull). `killEnemy()` synchronously
mutates **only** `demons[]` (`shift`/`push` for the horde cap + IT-RISES) and *flags* enemies dead (no splice);
its win path is **deferred** via `setTimeout`, so it can't shrink an array mid-iteration. The reentrancy
torture (over-cap horde of zombie-bite / brute-shove / mixed kill-sites beside ~0-hp infected foes) caps cleanly
at 12 with no undefined slots. So the single guard fully closes this bug class.

### Three raw stress signals — ALL artifacts / non-bugs (do not chase as regressions)
1. **`P.hp` → NaN in the devil/lich cycle (NOT a bug — harness artifact).** Trapped to `hurtPlayer` at
   `pit.js:1501` via `rnd(10,15)*e.dmgScale`. The synthetic boss was built with `startEncounter([{...}])` (raw
   objects), which **bypasses** the `e.dmgScale=1+S.fight*0.16` assignment that real `startFight` applies
   (`pit.js:1457`). Every real spawn + every summon site (thrall/skel/hound/esuccubus/edragon) sets `dmgScale`,
   so `undefined*rnd = NaN` cannot occur in real play. The devil entry was a red herring (the boss merely took
   ~120 frames to land its first hit). The real-spawn pursue-driver correctly never hit this.
2. **Arch-succubus horde "cap breach" to 18 (NOT a bug — harness artifact).** I injected 18 herald succubi
   directly (which by design never time out) with no subsequent summon; the `while(demons.length>=12)shift()`
   cap only runs **at push time**, so a manually over-stuffed horde simply stays put. In real play the cap
   applies on every summon, bounding total `demons[]` at 12.
3. **Druid `wolves[]` ~150–200 under a 60k-frame immortal-boss fight (NOT a bug — bounded steady-state).**
   Trajectory oscillates (f10k=164 → f20k=131 → f50k=144 → fEND=178) — it does **not** grow monotonically, so
   it's an equilibrium of summon-rate × lifespan, not unbounded growth. Real fights end fast (gauntlet
   max wolves = 22). Logged as a perf *suggestion* only (a soft wolf cap, mirroring the `demons[]` cap, would
   harden against pathological sustained fights), **not changed** per policy.

### Suggestions (NOT bugs — logged, not changed)
- *Test-robustness:* synthetic-enemy harnesses should set `dmgScale` (and the deep-stress driver now does); a
  one-line defensive `if(!Number.isFinite(dmg))return;` at the top of `hurtPlayer` would make the engine
  self-protecting against any *future* spawn site that forgets `dmgScale`. Defense-in-depth only — unreachable today.
- *Perf parity:* an optional soft cap on `wolves[]` (e.g. cull oldest beyond N) would match the `demons[]`
  treatment; growth is already lifespan-bounded so this is purely defensive.

---

## RUN 2026-06-26

**TL;DR — this run**
- Drove all 8 champion/road builds through the full 20-fight gauntlet. **Found + fixed a real P1 crash** the
  fast gate was missing: the warlock **herald / herald-archfiend** road intermittently crashed in the late
  fights (16–20) with `Cannot read properties of undefined (reading 'type'/'life')` in `updDemons`.
- Root cause: `killEnemy()` caps the zombie horde with `demons.shift()` (front removal) and is called
  **reentrantly from inside** `updDemons()`'s index-based loop whenever a summon kills an *infected* foe (the
  "IT RISES" path). The front-shift slides every index down, so the cached `i` walks off the shrunken array →
  `demons[i]` is undefined. **Fixed** with a one-line reentrancy guard (`if(!d)continue;`) + a permanent
  regression case. Smoke (4) + regressions (now **19**) + the 2 perf cases all GREEN; crash did not recur in
  ~6 driven gauntlet replays (pre-fix it hit ~1-in-8).
- **NEEDS HIRO:** the fix is real game code and is **saved to the source on disk (verified complete)**, but the
  OneDrive/FUSE mount again served a **tail-truncated** copy of `pit.js` and `smoke_test.js`, so the
  in-sandbox gate (`safe_publish.py`) would abort and **could not ship from this session**. Please run
  `python3 tools/safe_publish.py <Neverendingnarratives path>` from a **fresh chat** (clean mount) to push the
  fix to the play site — until then players on the herald/archfiend road keep the intermittent late-fight crash.

### P1 — herald/archfiend warlock crashes in late fights: `updDemons` dereferences an undefined demon
**Status: FIXED in `src/combat/pit.js` (canonical source on disk; NOT yet published — see NEEDS HIRO). Validated against the live engine.**

**What it is.** The competent pursue-driver crashed intermittently on the warlock **herald** and
**herald-archfiend** roads at fights 16–20: `TypeError: Cannot read properties of undefined (reading 'life')`
(also `'type'`, depending on `P.lich` state) at `updDemons` (`pit.js:633-634`). The loop is
`for(let i=demons.length-1;i>=0;i--){const d=demons[i]; ... d.life-=dt;}`. `d` was sometimes `undefined`.

**Why undefined?** `killEnemy()` (the infection / "IT RISES" path) caps the summon horde with
`while(demons.length>=12){demons.shift();}` — a **front** removal that slides every index down by one — and
`killEnemy` is invoked **reentrantly from within** `updDemons`'s own loop (a zombie bite at L655, a claw-fiend
shove at L676, or an arch-succubus burst at L717 killing an *infected* enemy). When the horde is at/over its
12 cap, that reentrant shift shrinks `demons[]` *underneath* the active loop, so the cached `i` now points
past the end → `demons[i]` is `undefined` → the next field read throws. Intermittent because it needs: herald
road + an infected foe dying *inside* a summon's action + horde already ≥12 (it peaks at 18–20 on this road).

**Severity.** P1 — a hard crash that ends the run, on a shipped build/road, reachable in normal play. Not
balance.

**5 WHYS.**
1. Why the crash? → `updDemons` read `d.type`/`d.life` where `d` was `undefined`.
2. Why was `d` undefined? → `demons[i]` (cached index `i`) pointed past the end of the array.
3. Why past the end? → `demons[]` shrank *during* the loop.
4. Why did it shrink mid-loop? → `killEnemy()`'s infection-rise capped the horde via `demons.shift()`, and
   `killEnemy` is called reentrantly from inside `updDemons` (a summon killing an infected foe).
5. Why wasn't it caught? → the index-based backward loop assumed `demons[]` is immutable during iteration; the
   reentrant front-shift breaks that invariant. The fast smoke gate never built an over-cap horde beside dying
   infected foes, so it never exercised the race. (Now pinned by a dedicated regression case.)

**ISHIKAWA / fishbone.**
- *Code-logic*: ✅ ROOT CAUSE — reentrant mutation (front `shift`) of an array being iterated by cached index.
- *Tests/metrics*: contributing — the fast gate lacked an over-cap-horde + infected-death scenario; only the
  deep pursue-driver surfaced it (and only intermittently). Now covered deterministically.
- *Engine/perf*: not a defect (entity counts stayed bounded; this is a logic race, not growth).
- *Assets/data, agent-process, platform-mobile*: ruled out (pure engine logic; reproduces headless).

**Repro (headless, deterministic).** `fullReset('warlock')`, `startEncounter([...])`, `P.evo10='herald'`,
replace `enemies` with 6 foes at one point all `hp:1, infectT:10`, push 16 adjacent `zombie` demons with
`cool:-1` (ready to bite this frame), then tick ~4 frames: pre-fix it throws on the first frame (the top demon
bites, rises a zombie, the cap shifts the front, the cached index goes out of bounds); post-fix the loop
survives and the horde correctly settles at ≤12.

**Fix.** One line in `updDemons` after `const d=demons[i];`: `if(!d)continue;` — skip the empty slot instead of
dereferencing it. Robust to *any* reentrant shrink of `demons[]` (the four `demons.shift()` cap sites and the
backward self-splice all stay correct). No behavior change on a stable array. `wolves[]` uses the same loop
shape but is only spliced by its own loop, and `enemies[]`'s only splice is a safe backward dead-minion cull —
so `demons[]` was the sole instance of the anti-pattern.

**Regression case (PERMANENT — never delete).** Added to `smoke_test.js` REGRESSIONS[]:
- `demon-loop-survives-reentrant-horde-shift (playtest 2026-06-26)` — rebuilds the exact race (over-cap zombie
  horde beside ~0-hp infected foes; one frame of reentrant kills+shifts). Pre-fix it THROWS; post-fix it
  survives and asserts the horde caps at ≤12 with no undefined slots. Verified: PASS on the fixed engine,
  THROWS on the unfixed engine.

**Validation done this run.** Because the live mount served a truncated tail of `pit.js`/`smoke_test.js`
(known hazard), reconstructed both canonical files in-sandbox and ran the full suite against the real engine:
**4 smoke + 19 regressions + 2 perf cases ALL GREEN.** Deep pursue-driver replays on the fixed engine: no
crash/NaN/softlock/unbounded growth/unwinnable fight; the herald/archfiend crash did not recur.

### Observation (non-blocking, NOT fixed) — one-off seraph frame-time spike
Across the driven replays, the seraph build threw a single per-frame compute spike of **51.8 ms** (driver soft
threshold is 50 ms; seraph's typical max is ~6–9 ms). It appeared once in ~6 runs, the fight still cleared, and
it looks like a transient (GC pause or a heavy judgement/ascend particle frame), not sustained cost. Logging as
a suggestion only — not a bug (no softlock, no unwinnable fight). Worth a glance if it ever becomes recurrent.

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
