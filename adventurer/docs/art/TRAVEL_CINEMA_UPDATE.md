# Travel and title cinema update

The full game now uses a separate set of panoramic illustrations for travel. Battle backgrounds retain their existing artwork and fixed framing.

## Changes for review

- 27 destination panoramas cover every travel location, with a 28th painting for open-sea crossings. The paintings use a horizontal road, dock, trail, or corridor instead of a central perspective road.
- Scenery scrolls continuously behind the company. Portraits remain together, retain their equipped appearance, and bob gently as they travel. Nearby leaves, dust, mist, and embers move at different speeds.
- Water regions ripple; authored fabric regions sway. Outdoor birds cross the scene; city pedestrians, dungeon lights, and pyre embers suit their surroundings. Clouds drift independently of the landscape.
- Travel retains the quest's weather and time snapshot: sunbeams, evening warmth, a full moon and stars, overcast skies, rain, lightning, and snow. A sky silhouette keeps the sun and moon behind passing architecture and tree crowns.
- Home weather is restored, including weather through the illustrated inn's glass panes. Weather objects now belong to their own container so journeys can hide the home weather and restore it afterward. Rain and snow are more visible.
- The approved title painting has a slow camera drift, passing birds and travelers, chimney smoke, river glints, falling leaves, and flickering lanterns. The menu stays still. The title has a scenery-motion toggle, and camera movement respects the browser's reduced-motion setting.
- First viewing remains unskippable; the second is skippable; a third viewing is bypassed. This update does not reset viewing history or change the save version.
- No dialogue, voices, quest costs, payouts, combat rules, or battle illustrations were replaced by this update.

## Assets and implementation

- Runtime images: `assets/anime/travel/v1/runtime/*.webp` — 28 images, 7,926,152 bytes total; only the current panorama and a small recent cache are retained.
- Generated masters: `assets/anime/travel/v1/source/*.png` — 14 two-band atlases, preserved unchanged.
- Exact generation prompts and original output paths: `assets/anime/travel/v1/generation.json`.
- Destination descriptions and band mapping: `assets/anime/travel/v1/locations.json`.
- Export dimensions, filenames, and byte counts: `assets/anime/travel/v1/manifest.json`.
- Reproducible crop, seam feather, and WebP export: `tools/travel_cinema/export_panorama.py`.
- Runtime changes: `js/ui/travel_panorama.js`, `travel.js`, `weather.js`, `anime_environments.js`, `title_backdrop.js`, `scene_boot.js`, `js/core/prefs.js`, and `index.html`.

## Verification

`node tools/travel_cinema/browser_check.js` exercises all 28 panoramas in WebGL and Canvas, actual journey movement and skip behavior, title motion and reduced motion, weather restoration, inn masking, weather cleanup, and stationary battle framing. Screenshots and the result report are saved alongside that script.

`node test/travel.js` covers travel history across lives, costs, low-resource access, payouts, the world clock, and destination coverage.

`node tools/anime_overhaul/gameplay_check.js` passed in WebGL and Canvas: character creation, appearance persistence, party gear purchases, saving/reloading, settings, and the actual journey flow. Recorded median frame time in the town was 16.7 ms in both modes.

`node test/fx.js` passed all 25 weather and effect-system assertions. JavaScript syntax checks and the whitespace check passed.
