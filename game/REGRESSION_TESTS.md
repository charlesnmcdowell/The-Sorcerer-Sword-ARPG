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

## TODO for the playtest agent (open leads)
- PERF/HANG: a headless driver that makes the player actively pursue+fight stalled a single champion past 40s for
  1500 frames (idle runs are instant). 5-Whys this: likely unbounded entity growth or an O(n^2)/while-loop under
  sustained combat. Confirm it's not a real in-game perf/softlock under long fights; if it is, fix + add a
  "frame time stays bounded under sustained combat" regression.
