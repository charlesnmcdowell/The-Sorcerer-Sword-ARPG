# game3d/ — The Sorcerer-Sword 3D uplift (Bucket 0 scaffold)

This is the **3D remake** project, separate from the finished 2D game in `../game/`. It is **local-only** (not deployed) until it's trailer-ready. The 2D game stays live and is the rollback (git tag `v2d-1.0`, branch `3d-uplift`).

## HOW TO RUN IT — just double-click `index.html`
The 3D models are **base64-embedded** in `assets/embedded3d.js`, so the look-test runs straight from `file://` with no server (same trick the 2D game uses for its art). You only need an internet connection — the Three.js + GLTFLoader libraries load from a CDN.

> Why the embed: Chrome/Edge block *fetching* `.glb` files from `file://` for security. Embedding the models as base64 sidesteps that — the browser never fetches a file, it decodes the bytes already in the page. This is a **dev-convenience stopgap for the look-test**; it loads everything up-front, so the real streaming build (B3) will switch back to fetched/streamed models served over http.

### Optional: run it served (needed once we add streaming)
```
cd "C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG"
py -m http.server 8000          (or: python -m http.server 8000)
```
Then open **http://localhost:8000/game3d/**. The loader auto-detects: if `embedded3d.js` is present it parses the embedded models; otherwise it fetches the `.glb` files over http. (`localhost` is still 100% your own machine — nothing goes online except the CDN libraries.)

`assets/embedded3d.js` is regenerated from the raw `.glb`s with:
`base64 -w0 Knight.glb` (etc.) wrapped into `window.EMB3D={...}`.

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
