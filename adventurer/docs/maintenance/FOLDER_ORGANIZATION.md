# Folder organization — September 11, 2026

The project root now contains the game entry point, configuration, a short launch guide, and clearly named folders.

## Changes

- Grouped 29 Markdown documents and the art inventory into `docs/design/`, `docs/dialogue/`, `docs/art/`, `docs/prompts/`, and `docs/updates/`.
- Preserved the original README in `docs/history/PROJECT_HISTORY.md` and added current launch instructions to the root README.
- Moved `_snapshot/` into `archive/backups/snapshot/` and retained `_to_delete_vo.zip` in `archive/backups/voice/`.
- Moved `Claude outputs/` intact into `archive/legacy/claude-outputs/`. Alternate versions and voice auditions remain available.
- Moved the complete `ads/` project into `marketing/ads/`, preserving its internal paths.
- Separated 56 original base-game art sheets into `assets/anime/v2/source/`, matching the source/runtime layout already used by Gate and travel art.
- Grouped five older test text logs in `test/reports/`.
- Updated document exporters, the base art exporter, the head contact-sheet tool, source provenance, art-manifest source references, document links, and Git ignore rules for the new paths.

The [file index](organization-2026-09-11.json) lists all 161 moved files, their old and new paths, byte sizes, and original SHA-256 checksums. This includes a review capture added to the old exports folder during cleanup. Files were verified immediately after moving. Final checksums also record the small document-link corrections made after relocation.

Runtime art and audio stay at their existing load paths. Voice-generation state and casting files stay beside their tools. The earlier `archive/art/2026-09-11/` cleanup record remains intact. No voice generation, image regeneration, save reset, or website deployment is part of this folder cleanup.

## Verification

- All 161 moved files exist at their documented destinations; original art, archives, and the historical README retain their exact bytes.
- All 45 local Markdown links resolve. Seven updated JavaScript document exporters and four Python tools pass syntax checks; game script loading order also passes.
- Checked 316 runtime files against the pre-move inventory. Runtime art files are unchanged. The three changed runtime files contain source-path metadata and the separately requested portrait-fit fix.
- Browser checks pass in WebGL and Canvas: 47 campaign cast members, 60 equipment variants, 24 enemy types, 54 encounter routes, 32 environments, 21 panoramas, and 16 cinematic stills, with no missing requests or browser errors.

## Finding and restoring files

Search the JSON index for an old filename and open its `to` path. To reverse a move, first check that its original destination is free and restore dependent tool references; do not overwrite newer files. Original source PNGs and archive contents retain their exact bytes.
