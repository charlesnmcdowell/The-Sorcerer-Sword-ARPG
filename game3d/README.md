# game3d/ — The Sorcerer-Sword 3D uplift (Bucket 0 scaffold)

This is the **3D remake** project, separate from the finished 2D game in `../game/`. It is **local-only** (not deployed) until it's trailer-ready. The 2D game stays live and is the rollback (git tag `v2d-1.0`, branch `3d-uplift`).

## What B0 gives you
`index.html` is a standalone Three.js scene (no build step; needs internet for the CDN libraries):
- The torchlit arena with the cinematic lighting/atmosphere we proved in `../3d-spike/`.
- A **GLTFLoader + AnimationMixer** pipeline that's plug-and-play for a KayKit character.
- A loading splash with a progress bar, an orbit camera (drag / scroll), and an on-screen **clip list** — every animation in the loaded model becomes a button you can click to preview.
- A placeholder figure so the scene runs even before any character is added.

## To bring it to life (the B1 step)
1. Download **KayKit – Character Pack: Adventurers** (CC0, free) from itch.io: https://kaylousberg.itch.io/kaykit-adventurers
   (CC0 = public domain: commercial use, no attribution. Cleanest possible license — see `../docs/knowledge base/12-asset-license-register.md`.)
2. Find a character model in **`.glb`** (or `.gltf`) form in the pack (KayKit ships both `.gltf` and `.fbx`; use the glTF/glb).
3. Put it here: **`game3d/assets/character.glb`**
4. Reload `index.html`. It loads the model, lists every animation clip as a clickable button, and auto-plays an idle.

If KayKit ships the **animations in a separate file** from the character mesh, tell me — I'll wire the loader to merge the animation library onto the character rig (they share a skeleton, so the clips retarget cleanly).

## Notes
- Libraries load from CDN: `three.js r128` (cdnjs) + `GLTFLoader` (unpkg). Internet required to run.
- Develop on the `3d-uplift` branch (or a clone outside the OneDrive-synced folder) so the big refactor work can't be hit by the OneDrive file-truncation issue that bites `../game/`.
- This scaffold proves the *pipeline*. B1 maps the four champions to KayKit rigs/looks + the katana sheath/draw; B2 wires the real combat sim to drive it.
