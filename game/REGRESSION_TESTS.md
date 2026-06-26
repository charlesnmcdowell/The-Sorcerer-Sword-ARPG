# Regression policy + ledger (Hiro directive 2026-06-21)

POLICY: Any bug Hiro finds/reports is a FAILURE OF THE AUTO-AGENT — the agent should have caught it first.
We aim for continuous improvement so the agent OUT-FINDS Hiro on bugs.
- Every reported (and every agent-found) bug becomes a PERMANENT named case in `tools/smoke_test.js` (REGRESSIONS[])
  so it can never silently recur. Never delete a case.
- When root-causing, use the 5 WHYS and record the chain in the changelog/STATUS, not just the surface fix.
- "Balance" is NOT a bug — UNLESS it's so out of whack the player theoretically cannot beat a fight, or it
  blocks progression. Those ARE bugs (progression-blockers) the playtest agent must catch.

## The gate (use this to ship — never raw publish_inplace)
- `python3 tools/safe_publish.py --check-only`        -> node --check every src JS (catches OneDrive tail-TRUNCATION) + headless smoke/regression. 
- `python3 tools/safe_publish.py <Neverendingnarratives path>` -> gate, then publish, then re-verify every published file. Aborts (no ship) on any failure.
- `tools/smoke_test.js` is the harness: per-champion no-crash + evo-panel-auto-resolves + the REGRESSIONS[] cases.

## Ledger — reported bugs -> covered?
| Bug (reported) | Root cause | Fix | Regression case |
|---|---|---|---|
| Evolution panel reappears mid-fight + locks input | setPlayerSnapshot didn't restore P.evo10/evo20 -> maybeOfferEvo re-offered every encounter | restore evo10/evo20 in snapshot + WorldScene sync-back | `evo-panel-does-not-re-offer` ✅ |
| Characters de-level (level goes backwards) | scene-layer clamps capped persistent level at 10 while combat capped at 20; world sync floored a fresh snapshot | cap 20 everywhere + Math.max non-decreasing world sync | `level-never-de-levels` ✅ |
| Mountain enemies too tanky | territoryHpMult too high | 6 -> 3 (HP halved) + slight dmg up | (balance — covered by playtest winnability, not a unit case) |
| Cult warlock fought as a generic 'collector' (no summons) | enemy reused the collector boss type | new `cultwarlock` AI + esuccubus/edragon + player-hex | (behavior — add a case if it regresses) |
| Sustained-combat unbounded `enemies[]` (the 2026-06-21 open lead) | dead MINIONS never culled from `enemies[]` | splice dead minion once `deathT>2` (pit.js tick) — now PUBLISHED to play site | `perf:dead-minion-culled-named-foe-kept`, `perf:enemies-array-bounded-under-sustained-combat` ✅ |
| Fast smoke gate ran FROZEN (agent-found 2026-06-25) | section-1 loop clock started below wall-clock → huge −dt first frame → `hitPause`~1e9 → every tick early-returns; loop ran no-op frames | prime clock to `Date.now()` + per-frame `hitPause` freeze guard | `harness:smoke-loop-clock-primed-not-frozen` ✅ |
| Herald/archfiend warlock CRASH in late fights (agent-found 2026-06-26) | `updDemons` iterates `demons[]` by cached index, but `killEnemy()`'s infection-rise caps the horde via `demons.shift()` (front removal) reentrantly from inside that loop → cached `i` walks off the shrunken array → `demons[i]` undefined → `d.type`/`d.life` throws | one-line reentrancy guard `if(!d)continue;` in `updDemons` (skip empty slot) — **fix on disk; NOT yet published (mount truncation; ship from a fresh chat)** | `demon-loop-survives-reentrant-horde-shift` ✅ |

## TODO for the playtest agent (open leads)
- (RESOLVED 2026-06-24, PUBLISHED by 2026-06-25) PERF/HANG: the pursue-driver stall past 40s/1500 frames was REAL —
  dead minions accumulated in `enemies[]` (raisers/feeders spawn them forever) so per-frame cost grew unbounded.
  Fixed by culling dead minions after their death-fade; covered by the two `perf:*` cases in `tools/perf_regressions.js`.
  The corpse-cull fix is now present in the live `Neverendingnarratives/play` build. NOTE: the deep pursue-driver now
  lives at `tools/playtest_drive.js` (plays all 8 champion/road builds through the full gauntlet) — re-run it each pass.
- (OPEN as of 2026-06-26 — SHIP ITEM) The herald/archfiend `updDemons` reentrancy crash is FIXED in the source on
  disk and fully validated (4 smoke + 19 regressions + 2 perf GREEN against a reconstructed engine), but the fix is
  **NOT yet published**: the sandbox mount served a tail-truncated `pit.js`/`smoke_test.js` this run, so the in-sandbox
  gate could not ship. ACTION: from a fresh chat (clean mount) run `python3 tools/safe_publish.py <Neverendingnarratives>`
  to push to the play build. Until then the herald/archfiend road keeps the intermittent late-fight crash.
- Watch: the OneDrive sandbox mount can serve a STALE/tail-truncated copy of a file just edited from chat — verify with
  `node --check` + a reconstructed-in-sandbox run, and publish/gate from a fresh chat session if the mount looks stale
  (`safe_publish` correctly aborts on a truncated file).
