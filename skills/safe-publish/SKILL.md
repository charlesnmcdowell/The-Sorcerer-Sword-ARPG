---
name: safe-publish
description: Ship a Sorcerer-Sword game change to the live play/ build through the regression gate. Use when publishing or deploying the game ("ship this", "publish the game", "push the build live"), after editing anything under game/src, or when a fix needs to reach the public site. Guards against the OneDrive tail-truncation hazard and never ships broken code.
metadata:
  type: game-ops
---

# safe-publish — the gated ship command for The Sorcerer-Sword

NEVER call `publish_inplace.py` directly and NEVER `git push`. Always ship through the gate below.

## What it does
`game/tools/safe_publish.py` runs, in order:
1. `node --check` on every JS file under `game/src` — this catches the OneDrive/FUSE **tail-truncation** that silently ships broken files.
2. The headless `smoke_test.js` (per-champion no-crash + evolution-panel auto-resolve + the named REGRESSIONS).
3. Only if both pass: publishes `game/` -> the site repo's `play/` (in-place, OneDrive-safe) and **re-verifies** every published file. Aborts on any failure.

## How to run
- Gate only (no publish): `python3 game/tools/safe_publish.py --check-only`
- Gate + publish + re-verify: `python3 game/tools/safe_publish.py PATH_TO_NEVERENDINGNARRATIVES_REPO`
  (Pass the site-repo path explicitly — a scheduled sandbox can't reach it at the default location.)

## Gotchas
- If the gate reports a file BROKEN/TRUNCATED, the bash mount is serving a stale tail. Reconstruct it: `head -N` the good prefix + the correct tail from the Read/desktop view, rewrite, re-verify — then publish.
- Publishing writes to `play/`; the public site only updates after the user commits + pushes the Neverendingnarratives repo. Never push for them.
- No paid API calls.
