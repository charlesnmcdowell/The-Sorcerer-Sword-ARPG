# Varenholm’s Gate background motion audit — September 12, 2026

The campaign now animates its painted scenery throughout encounters, battles, travel, chapter cards, and dialogue. This update is in the local game; this audit did not deploy the public website.

[Open the motion viewer](http://127.0.0.1:8734/index.html?gateArtPreview=1&gateMotion=1&art=20260912-gate-motion). It starts at the Iron Mine. Use **Battle locations / Journeys / Story scenes**, **Previous / Next**, and the weather/time controls to compare settings. The viewer does not load or change a player save.

## What was wrong

- The 32 campaign encounter paintings had almost no authored environmental animation. The prior motion coordinates applied to the separate journey paintings. Painted braziers and candles remained still.
- The battlefield’s 72% dark wash obscured the scenery and weather. Weather needed to sit above the battlefield wash and below names, health bars, portraits, and controls.
- Lanternhold’s indoor classification suppressed all precipitation, including the large open arch. The sickroom’s exterior windows also had no weather.
- Chapter cards bypassed the location animation renderer. Story illustrations relied on a very slow camera drift and a few generic particles, with no motion tied to the painted fire or water.
- The previous panorama detail coordinates did not consistently align with the final seamless files. The Griffon panorama also included 68 pixels of the preceding room above its sky.
- Weather and travel did not consistently honor the game’s **Ambient motion** setting.

The September 11 audit verified asset loading, routing, and active rendering objects. It did not establish that the painted fires or other important regions visibly changed. This audit adds frame comparisons of those regions.

## Changes

1. Added separate, authored motion profiles for **32 encounter/dialogue environments, 21 travel panoramas, and 16 story illustrations** in `js/ui/gate_ambience.js`.
2. Fire animation reuses luminous pixels from the approved painting, adding flicker, stretching, local light, and occasional embers. Braziers and surrounding architecture stay fixed. No external image generation or voice credits were used.
3. Added moving water, ripples, waterfall streaks and spray, cloth movement, drifting chimney smoke, lamp flicker, mist, airborne leaves/dust, birds, and magical light where appropriate to each painting. Calm rooms and documents receive restrained movement.
4. Reused the location renderer for chapter cards and ordinary campaign dialogue. Story illustrations receive effects aligned to their own composition. Letterbox bars and dialogue controls stay above story weather.
5. Reduced the campaign battlefield wash to 38%. Campaign weather renders above that wash and below combat information. Battle framing remains fixed; travel continues scrolling sideways.
6. Added masked weather through Lanternhold’s arch and the sickroom windows. Precipitation for small windows originates near those windows so snow remains visible. Sealed mines, temples, sewers, and interior story scenes keep their indoor atmosphere.
7. Added outdoor clouds to the relevant campaign settings. Storm lightning stays within the weather renderer and its masks, including indoor openings.
8. Replaced the obsolete panorama coordinates with profiles measured against the final images. Animated layers follow the same scroll distance and repeat interval as the painting. Lanternhold’s moving weather mask follows its open arches.
9. Cropped the Griffon panorama’s stray top strip during loading. Source art remains intact.
10. Kept repaint layers under their painting’s lighting grade, while firelight and atmospheric effects remain above it. This avoids brighter rectangular patches of animated water at night.
11. Made ambient effects, weather, and travel respect **Ambient motion** and the operating system’s reduced-motion preference. Effects pause when the page is hidden and release their textures, masks, listeners, and timers when scenes close.
12. Updated the art viewer and script cache versions. Removed the superseded Gate travel detail tables from `gate_art.js`.

## Verification

- `tools/gate_art/motion_check.js`: all **69 profiles in WebGL and Canvas**, comparing screenshots with the scene paused and only ambient animation advanced. The comparison regions cover visible fire, water, cloth, waterfalls, or atmosphere according to the artwork.
- The same check isolates weather by freezing background motion. Rain, storms, and snow must change pixels inside outdoor/window regions; window weather must leave an indoor control region unchanged. It also checks sealed-interior suppression, accessibility settings, and repeated scene cleanup.
- `motion_check.js --quick`: targeted follow-up for the final lighting-layer adjustment and window precipitation, in both renderers.
- `tools/gate_art/lighting_check.js`: evening/night layer order and screenshots for encounter art and scrolling panoramas in both renderers.
- `tools/gate_art/audit_check.js`: 54 campaign encounter routes, 225 annotated story beats, 378 travel weather/time cases, 108 home-weather cases, texture availability, weather restoration, and resource cleanup in both renderers.
- `tools/gate_art/flow_check.js`: actual Quest → Combat transitions, including Lanternhold, Griffon Road, the valve chamber, palace, and temple, in both renderers.
- `tools/gate_art/travel_check.js`: the bridge-to-sewer journey, rain stopping underground, the first-view lock, second-view skip, third-view bypass, and menu restoration.
- `tools/gate_art/cinema_check.js`: chapter cards, dialogue routing, choices, five endings, viewer categories, and save isolation in both renderers.
- `tools/gate_art/lifecycle_check.js`: failed image loading, retry, shutdown during a pending scene, and restart.
- `tools/gate_art/audit_regressions.js`: campaign 3, campaign dialogue, campaign 2, travel history/cost rules, save compatibility, and combat presentation regressions passed.

Evidence and before/after frames are in `tools/gate_art/motion-audit/`. `authored-regions.json` lists every animation region. `motion-results.json` records the full pixel checks; `motion-quick-results.json` records the final focused checks.

For an already open local game, refresh with **Ctrl+F5**. Ambient motion should be enabled in Settings. Weather still follows the journey’s weather snapshot, so clear journeys do not acquire rain merely because their effects were repaired. No save wipe is required.
