---
name: game-regression
description: Run the headless regression gate for the Sorcerer-Sword game and turn any reported bug into a permanent test. Use after a game change, whenever a bug is reported or found, before shipping, or to verify every champion loads and fights without crashing or softlocking. Enforces the policy that a reported bug is a gap the auto-agent should have caught.
metadata:
  type: game-qa
---

# game-regression — the bug-can-never-come-back gate

POLICY (Hiro): any bug Hiro finds/reports = a FAILURE of the auto-agent; it should have caught it first. Every reported or agent-found bug becomes a PERMANENT named case here so it can never silently recur. Root-cause with the **5 Whys** + an **Ishikawa/fishbone** across categories (code-logic, engine/perf, assets/data, agent-process, tests/metrics, platform-mobile) before fixing.

## What it does
`game/tools/smoke_test.js` loads `pit.js` headless and runs:
1. SMOKE — each champion (ronin/druid/warlock/seraph) starts a fight, runs frames with periodic inputs, no crash / NaN / softlock, and the evolution panel auto-resolves.
2. REGRESSIONS[] — one named case per past bug (e.g. `evo-panel-does-not-re-offer`, `level-never-de-levels`, the herald/archfiend `updDemons` reentrancy case).

## How to run
- `node game/tools/smoke_test.js` (or via the gate: `python3 game/tools/safe_publish.py --check-only`)

## When a bug is reported
1. Reproduce it headless. 2. 5-Whys + fishbone the root cause; record the chain. 3. Add a permanent case to `REGRESSIONS[]` that FAILS on the bug. 4. Fix. 5. Re-run until green. 6. Log it in `REGRESSION_TESTS.md`. Deep "can a real player win / perf under sustained combat" lives in the `playtest-bughunt` schedule + `playtest_drive.js`.

## Gotcha
The smoke loop must prime its clock to `Date.now()` (an unprimed clock freezes the sim via `hitPause` and the gate runs no-op frames while looking green). Keep that guard.
