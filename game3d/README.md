# game3d/ — The Sorcerer-Sword 3D uplift (Bucket 0 scaffold)

This is the **3D remake** project, separate from the finished 2D game in `../game/`. It is **local-only** (not deployed) until it's trailer-ready. The 2D game stays live and is the rollback (git tag `v2d-1.0`, branch `3d-uplift`).

## ⚠ HOW TO RUN IT (must use a local server)
Chrome/Edge **block loading 3D models (`.glb`) from `file://`** for security, so double-clicking `index.html` shows a frozen loading screen. Run a one-line local server instead:

```
cd "C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG"
py -m http.server 8000          (or: python -m http.server 8000)
```
Then open **http://localhost:8000/game3d/** in Chrome. (Stop the server with Ctrl+C when done.)

Alternatives: VS Code's "Live Server" extension, or `npx serve`. The 2D game in `../game/` doesn't need this (its art is embedded) — only the 3D build, because it streams real model files.

## What B0 gives you
`index.html` is a standalone Three.js scene (no build step; needs internet for the CDN libraries):
- The torchlit arena with the cinematic lighting/atmosphere we proved in `../3d-spike/`.
- A **GLTFLoader + AnimationMixer** pipeline that's plug-and-play for a KayKit character.
- A loading splash with a progress bar, an orbit camera (drag / scroll), and an on-screen **clip list** — every animation in the loaded model becomes a button you can click to preview.
- A placeholder figure so the scene runs even before any character is added.

## Status: WIRED (B1 in progress)
KayKit Adventurers (CC0) is in. `assets/` holds:
- `Knight.glb` — the character mesh (textures embedded; no animations of its own).
- `anim_general.glb` — Idle_A/B, Hit_A/B, Death_A/B, Interact, PickUp, Throw, Use_Item, Spawn_*.
- `anim_movement.glb` — Walking_A/B/C, Running_A/B, Jump_*.

The loader binds those clips onto the Knight by shared bone names (the "Rig_Medium" skeleton) and lists them as clickable buttons. Idle auto-plays.

**To preview a different champion stand-in:** copy another model from the pack's `Characters/gltf/` (Barbarian / Mage / Ranger / Rogue / Rogue_Hooded `.glb`) into `assets/` and change `CHAR_URL` in `index.html`. They all share the same rig, so the animations work on every one.

### Known gap (free pack)
This free pack has movement + reactions but **no melee sword-swing clip**. Real attack/draw animations come from the paid KayKit "Character Animations" pack or Mixamo — logged for later in `../docs/knowledge base/13-assets-to-purchase.md`. For now we prove movement with Idle/Walk/Run and improvise attacks (Throw/Use_Item) until then.

Weapon-attach bones exist on the rig (`handslot.r` / `handslot.l`) — the katana (the pack's `sword_1handed`) clips into `handslot.r`; that's the next wiring step.

## Notes
- Libraries load from CDN: `three.js r128` (cdnjs) + `GLTFLoader` (unpkg). Internet required to run.
- Develop on the `3d-uplift` branch (or a clone outside the OneDrive-synced folder) so the big refactor work can't be hit by the OneDrive file-truncation issue that bites `../game/`.
- This scaffold proves the *pipeline*. B1 maps the four champions to KayKit rigs/looks + the katana sheath/draw; B2 wires the real combat sim to drive it.
