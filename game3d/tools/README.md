# tools/ — art pipeline layout

- **gen_sprites.py** — sprite generator (xAI Grok). NOTE: the repo mount serves
  this file TRUNCATED in sandbox shells; the runnable copy pattern lives in the
  session /tmp.
- **Slice/ingest flow** — slice generated sheets into frames → drop frames in
  `art_in/` → run `ingest_art.py` with EXPLICIT frame names only, never bare.
  Bare runs resurrect stale frames from leftovers.
- **refs/** — reference image library (on-model anchors).
- **raw/** — unkeyed API originals live under `art_in/raw/` (archival, untouched).
- **sheets/** — generated sprite-sheet archives (`sheet_*.png`).
- **checks/** — review contact sheets (`_check_*.png`).
- **audit/** — stale visual-audit output.
- **xai_key.txt** — API secret. Never print, copy, or commit it.

Pipeline runs may recreate `sheet_*` / `_check_*` files at tools root; sweep
them back into `sheets/` and `checks/` as needed.

## Sprite folder layout (2026-07-15)
`assets/sprites/` is per-entity now: `warlock/` (+`summons/<succubus|archsuccubus|dragon|claw_demon|shambler|bone_archer>/`, `forms/<lich|archdevil|demonlord>/`), `enemies/<type>/`, `npcs/`, `fx/`. Code + pipeline use FLAT names resolved through `spritePath()` (arena.html) / `ENTITY_DIR` (ingest_art.py) / `SPRITE_ENTITY_DIR` (gen_sprites.py) — keep all three maps in sync when adding an entity. Manifests (anims.json, rig JSONs) stay at the sprites root; `_src/` stays flat (archive).
