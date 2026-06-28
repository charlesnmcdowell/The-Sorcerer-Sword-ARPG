---
name: gen-sprites
description: Generate on-model anime side-on sprites AND keyframe animations for the 2.5D game via xAI Grok, plus run the Dragon's Crown visual auditor. Use for any game3d art ("make a sprite/animation for X", "generate the warlock/enemy art", "add a unit"), when the auditor flags a missing animation, or when checking the build against Dragon's Crown. Keeps every sprite on-model by editing each entity's own approved sprite as the reference.
metadata:
  type: game-art
---

# gen-sprites — the side-on sprite + animation pipeline (xAI Grok Imagine)

## The simple way (for Hiro): one launcher
`game3d/tools/studio.bat` — double-click it, pick a number. No commands to remember:
1 Play the game · 2 Watch quality (auditor) · 3 Make missing art · 4 Make missing anims · 5 Seed references · 6 First-time setup.
Everything below is what those menu items run.

## What it does
`game3d/tools/gen_sprites.py` holds a MANIFEST of every sprite. For each it calls xAI (`grok-imagine-image-quality`), auto-keys the background, crops, and drops a transparent PNG into `game3d/art_in/` where the build ingests it (normal maps + scale-normalize).
- Warlock + transformations EDIT from `tools/ref_warlock_idle.png` (on-model anchor).
- Summons/enemies are generated, then snapshotted into `tools/refs/` so future poses edit from them.
- Glowing FX (fireball/breath) generate on BLACK and key by brightness (draw additive in-engine).
- Backdrops use `bg` mode (full-bleed, no key): `bg_pit_far` (crowd wall), `bg_pit_floor`, `bg_pit_fg` (pillars).

## Commands (LOCAL only — the sandbox proxy 403s xAI), from `game3d/tools/`
- `python gen_sprites.py` — generate everything missing
- `python gen_sprites.py succubus door` — only named sprites · add `--force` to redo existing
- `python gen_sprites.py --snapshot` — seed `tools/refs/` from current art (run once; lets keyframes match)
- `python gen_sprites.py --from-needs` — generate the keyframe sets the auditor queued in `tools/audit/needed_sprites.json`

## Animation coverage (the "no frozen stills" loop)
`tools/visual_audit.py --watch` opens the game headless, scores it vs Dragon's Crown, and writes `tools/audit/latest.json` + a screenshot. It checks every on-screen entity×action for a real animation (rig clip OR >=3 keyposes); any static one is appended to `needed_sprites.json`. Then `--from-needs` makes those keyframes (`<entity>_<action>_<n>`), editing FROM each entity's own ref so it stays identical, only the pose changes. Needs `window.__AUDIT__.entities` from the build.

## To add a new unit
Append a row to MANIFEST: `("name","edit"|"gen","ASPECT","PROMPT")`. `edit` = match an existing character; `gen` = fresh creature. Then run it for that name.

## Gotchas
- Runs on Hiro's PC, not the sandbox. Key in `tools/xai_key.txt` (gitignored). Setup: `pip install playwright pillow numpy && playwright install chromium`.
- Re-running is safe (skips existing). `raw/` keeps the un-keyed source. The OneDrive mount can show a truncated copy to the sandbox — the Windows file is truth.
- Never commit `xai_key.txt`, `art_in/raw/`, `tools/refs/`, `tools/audit/`, or `assets/sprites/_src/`.
