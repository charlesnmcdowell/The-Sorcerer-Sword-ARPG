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
