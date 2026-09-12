# Art, weather and animation audit — September 11, 2026

**September 12 follow-up:** The loading and routing checks below did not prove visible motion in painted fire and water. A subsequent pixel audit found and fixed missing campaign effects, weather layering, and panorama alignment. See [the background motion audit](VARENHOLMS_GATE_MOTION_AUDIT.md) for the current results and changes.

The local game has been audited and corrected. The tested paths have no remaining missing art requests, browser rendering errors, or unbalanced scenery resources.

[Open the updated art viewer](http://127.0.0.1:8734/index.html?gateArtPreview=1&art=20260911-gate3).

## Fixes made

1. **Dialogue continuity.** A campaign conversation owns its backdrop until the entire sequence finishes. Changing speaker or answering a choice no longer exposes the home or encounter screen. Toasts stay queued during the sequence, and the underlying controls are blocked.
2. **Story location routing.** Departure, encounter, closing and arrival beats carry their location explicitly. This works after the completed quest has been removed from game state. Palace arrivals, the Duke’s sick-room, Thornbury, the reading room and the transition into the catacombs now resolve to their intended settings.
3. **Story lighting.** Explicit night, dawn/day and dusk beats retain appropriate lighting. The prologue and palace battles use night; campaign battles otherwise retain their journey’s time snapshot.
4. **Weather continuity.** Outdoor dialogue scenes have their own weather layer. Battles use the journey’s weather snapshot. Indoor scenes suppress outside precipitation. Returning from travel restores the previous weather visibility instead of forcing a hidden layer back on.
5. **Indoor readability.** Mines, sewers, halls and temples retain their painted interior lighting at night, instead of receiving an additional outdoor night tint.
6. **Sunlight.** Reduced the heavy triangular sun rays so they no longer overwhelm the illustrated scenery.
7. **Weather lifecycle.** Storm scheduling retains only pending timers. Hidden or reduced-motion precipitation pauses; clouds stop advancing when hidden or reduced motion is enabled. Repeated destruction leaves no extra update or shutdown listeners.
8. **Image-load lifecycle.** Environment loads can retry after a failed request. Closing a scene during an image load releases pending art and prevents late dialogue callbacks from running in the next scene.
9. **Menu restoration.** Travel loading transfers its existing menu-hiding hold to the journey. It no longer hides the menu twice and releases it only once. Nested story sequences release only their own hold.
10. **Review gallery.** Battle-location previews now use the production environment renderer. Both battle and travel previews offer day/evening/night and clear/sunny/overcast/rain/storm/snow controls; indoor restrictions still apply.
11. **Asset cleanup.** Removed superseded head atlases from the base manifest and excluded them from future base-art exports. Updated script cache versions to `20260911-gate3`.

## Archive

Moved **25 files, 31,639,911 bytes (30.2 MiB)** into `archive/art/2026-09-11/`, outside the shipped `assets` tree:

- 12 superseded campaign head WebP atlases.
- Their 12 original PNG sheets.
- One rejected opaque cast style study.

Every move was verified against its SHA-256 checksum. The archive preserves original paths in [inventory.json](../../archive/art/2026-09-11/inventory.json), and the removed manifest entries in [superseded-parts.json](../../archive/art/2026-09-11/superseded-parts.json). The inventory includes restoration instructions. Active source sheets remain available for future edits. Original fitting-room assets remain because the game still uses that viewer.

## Verification

| Check | Result |
|---|---|
| Active runtime inventory | 212 atlas, environment, panorama and cinematic files exist and are nonempty |
| Campaign cast | 47 named portraits; 60 companion/equipment combinations; stable faces and helmet/mask occlusion |
| Campaign enemies | All 24 enemy types; all encounter mini-boss spawns and assigned art |
| Story routing | 225 authored beats, including conditional speakers, checked with quest state cleared |
| Campaign environments | All 32 location images load; all 54 encounter routes use the assigned setting |
| Campaign journeys | All 21 panoramas scroll; configured painted water/cloth strips advance |
| Campaign weather matrix | 378 location × phase × weather cases per renderer, including suppression indoors |
| Home weather matrix | 108 home × phase × weather cases per renderer; inn weather remains masked to the windows |
| General travel and title | All 49 registered panoramas including sea; moving title camera with stationary menu; home weather and fixed battle framing |
| Actual scene transitions | Quest → Combat in the prologue, valve room, palace reveal and final temple; scene reuse and visible party/enemy portraits |
| Dialogue and choices | Multi-speaker continuity; dream conversation and choice; chapter continuation; company and epilogue scrolling |
| Endings | All five ending illustrations load and their epilogues scroll |
| Travel history | First showing locked; second skippable; third bypassed; balanced menu holds |
| Cleanup and recovery | Repeated storm teardown, bounded leases, failed-load retry, shutdown during loading, successful scene restart |
| Browser errors | None in the passing checks |

The art, travel, cinema and gameplay checks ran in **WebGL and Canvas**. The general Canvas travel check also used a 915 × 544 viewport. Load-failure recovery was separately tested with an intentionally interrupted request. Screenshots of travel, homes, title, dialogue and actual combat were inspected.

Core regressions also passed: campaign3 **155**, campaign3 dialogue **4,540**, campaign2 **189**, combat presentation **338**, plus travel costs/history and save/appearance persistence checks. Changed scripts parse successfully and `git diff --check` passes.

These checks validate asset coverage, routing, rendering and representative interactive flows. They do not claim a manual playthrough of every possible dialogue-choice combination. Cinematics remain illustrated scenes with camera and atmospheric animation; they are not newly generated videos.

## Reproducible checks

The scripts and JSON results are in `tools/gate_art/` and `tools/gate_art/audit/`:

- `audit_check.js`: routing, weather, environments, homes, sequence continuity and cleanup.
- `browser_check.js`: portraits, gear, enemies and complete campaign image coverage.
- `cinema_check.js`: gallery isolation, chapter, dialogue choice, endings and scrolling.
- `travel_check.js`: actual journey playback, interior transition, viewing history and menu-hold regression.
- `flow_check.js`: actual Quest and Combat scenes.
- `lifecycle_check.js`: failed-load retry and scene shutdown during a delayed load.
- `audit_regressions.js`: the relevant core suites, with retained logs.
- `tools/travel_cinema/browser_check.js`: general travel/title/home regression.

All browser checks use separate automation contexts. This audit did not publish a build or alter the user's save.
