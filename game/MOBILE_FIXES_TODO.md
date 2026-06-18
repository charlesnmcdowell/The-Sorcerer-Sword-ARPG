# Mobile UI fixes — Sorcerer-Sword (user-reported 2026-06-16)

Fix these on mobile/touch. After fixing, QA and RE-PUBLISH (publish_inplace.py) so players get them.
Relevant files: index.html (overlays/orientation/HUD), src/core/touchstick.js (touch movement),
src/scenes/ArenaScene.js + src/combat/pit.js (combat HUD/controls), src/core/settings.js (auto-play toggle).

## Issue 1 — Orientation icon repeats & overlaps auto-play toggle
- The "rotate to landscape" prompt reappears every time orientation changes back. It must show
  ONCE per session only (e.g. a sessionStorage / in-memory flag once dismissed or once landscape
  is achieved), not on every portrait<->landscape change.
- It currently overlaps the auto-play toggle. Give it its own dedicated, reserved space so it never
  covers the auto-play toggle or any other control.

## Issue 2 — Mobile movement unreliable & controls obstructed
- Drag-based finger movement isn't registering reliably. Make touch movement clearer and more
  responsive (review touchstick.js: pointer capture, touch-action CSS, passive listeners, dead zone,
  multi-touch so movement + attack work together).
- Movement buttons AND attack/skill buttons are getting covered by overlays. Every interactive
  control needs a PROTECTED ZONE — no overlay, banner, icon, or HUD element may render on top of
  the d-pad/stick, attack, or skill buttons (raise their z-index / reserve layout space / make
  overlays avoid those regions and be pointer-events:none where they must overlap non-interactive area).

## Issue 3 — Duplicate HUD overlay when combat starts
- When combat begins, the health bar and top controls duplicate (looks like a screenshot artifact /
  cloned DOM or double-rendered canvas).
- Find where combat start creates/clones these elements and ensure they are created once (guard
  against re-append, remove the old before adding, or reuse the existing node). 
- Hard rule from the user: NO duplicates anywhere in the game, ever — audit combat start and scene
  transitions for any element/canvas that can be appended or drawn twice.

## Done criteria
node --check passes on all edited .js; the four champions still load and play; on a phone the
orientation prompt shows once and clears the toggle; movement + attack/skill respond and are never
covered; no duplicated HUD on combat start. Then republish + note completion here.

---
## PROGRESS — fixes applied 2026-06-17 (auto maintenance run)

**Issue 1 — orientation prompt: FIXED.**
- Removed the CSS `@media (orientation:portrait)` rule that re-displayed `#rotateHint` on every
  portrait<->landscape flip. Visibility is now JS-owned (src/main.js): shows at most ONCE per
  session (sessionStorage `ss-rotate-seen`), auto-dismisses after 6s, tap-to-dismiss, and seals
  permanently the moment landscape is achieved.
- `#rotateHint` now has dedicated reserved space: narrow centred pill (`max-width:min(54vw,240px)`,
  `text-align:center`) at top:8px — it no longer reaches the top-right ♪/⚙ or the AUTO toggle.

**Issue 2 — touch movement + protected zones: FIXED.**
- touchstick.js: added a 7px dead zone (kills stationary-thumb drift) and a crisp unit-direction
  output scaled by a dead-zone-adjusted magnitude, so the champion moves the instant the finger
  leaves the dead zone. Nub still tracks the finger to the ring.
- Reliability CSS: `#game-container` gets `touch-action:none;overscroll-behavior:none`; the `.btn`
  controls and `#stickBase`/`#stickNub` get `touch-action:none` so a drag/tap is never swallowed by
  browser gestures. (multi-touch: stick claims the left-side pointer id, right-side taps still feed
  attack — movement + attack work together, unchanged.)
- PROTECTED ZONE: `#controls` and the stick nodes raised to z-index 30 (above the banner z8); the
  onboarding tutorial hint (`#onboardHints`) moved OUT of the bottom button band (was bottom:118px,
  over the attack buttons) up to top:60px under the HUD. True modals (settings z46/pause z48) still
  sit above. Nothing non-modal renders over the stick/d-pad/attack/skill now.

**Issue 3 — duplicate HUD on combat start: FIXED.**
- Root cause: world encounters show the combat `#hud` (health bar + name + KILLS + AUTO) while the
  city top bar `#cityhud` (name + purse + journal + AUTO) was left visible -> two stacked top bars.
- WorldScene.startEncounter now calls `CityUI.hud(false)` on combat begin and `CityUI.hud(true)` on
  end. Also added an `if (this.encounterActive) return;` re-entry guard so a second encounter can
  never stack over a live one. (The standalone Pit/ArenaScene never has the city HUD up, so it was
  not a duplicate source.)

QA: `node --check` passes on main.js, touchstick.js, WorldScene.js (and all other src .js). The four
champion buttons (startBtn/druidBtn/warlockBtn/seraphBtn) and their startIntro handlers are intact.
Backups written as *.bak-mobilefix-* next to each edited file. Ready to re-publish.

---
## RE-VERIFIED 2026-06-17 (later maintenance run) — ALL THREE FIXES CONFIRMED IN LIVE CODE
- Issue 1: main.js seals `ss-rotate-seen` once/session; #rotateHint has reserved centred pill at
  top:8px (z-index:47), no @media portrait re-show rule. CONFIRMED.
- Issue 2: touchstick.js dead zone `dz = 7`; touch-action:none on body/#game-container/.btn/stick;
  #controls + stick nodes z-index:30 (above banner z8); #onboardHints moved to top:60px. CONFIRMED.
- Issue 3: WorldScene.startEncounter has re-entry guard (`if (this.encounterActive) return;`) and
  toggles CityUI.hud(false) on combat start / hud(true) on end — no stacked top bars. CONFIRMED.
- node --check PASS on all live src/*.js. Four champion buttons (startBtn/druidBtn/warlockBtn/
  seraphBtn) + their startIntro handlers intact.
- Published build 1781736462 in Neverendingnarratives/play/ is byte-identical to the fixed source
  (all src/*.js match; index.html cache-busted ?v=1781736462; no emberBtn). Players already on latest.

---
## RE-VERIFIED 2026-06-17 (maintenance run) — all three fixes confirmed in live code, published build current
- node --check PASS on all src/*.js. Four champion buttons (startBtn/druidBtn/warlockBtn/seraphBtn) intact; no emberBtn.
- play/src/*.js byte-identical to source (diff: only *.bak unique to source); index.html cache-busted v=1781736462. No republish needed.
- No code changes this run; nothing to stage. Stop conditions met -> disabling quick-fix task.

---
## RE-VERIFIED 2026-06-18T01:10 (maintenance run) — all complete, no changes needed
- node --check PASS on every live src/*.js. 4 champion buttons (startBtn/druidBtn/warlockBtn/seraphBtn) intact; no emberBtn.
- Issue 1 (main.js ss-rotate-seen seal + reserved #rotateHint pill), Issue 2 (touchstick dz=7, touch-action:none, protected z-index), Issue 3 (WorldScene encounterActive guard + CityUI.hud toggle) all CONFIRMED in live code.
- play/ src/*.js byte-identical to source; build.txt 1781736462 current. No republish needed.
- Stop conditions met -> disabling quick-fix scheduled task.

---
## RE-VERIFIED 2026-06-17T(this run) — all duties complete, no changes needed, disabling task
- node --check PASS on all live src/*.js. 4 champion buttons (startBtn/druidBtn/warlockBtn/seraphBtn) intact; no emberBtn in source or play/.
- Issue 1: main.js seals ss-rotate-seen once/session; #rotateHint reserved pill top:8px z47; no orientation:portrait re-show rule. CONFIRMED.
- Issue 2: touchstick dz=7; touch-action:none on body/#game-container/.btn/#stickBase; protected z-index. CONFIRMED.
- Issue 3: WorldScene encounterActive re-entry guard + CityUI.hud toggle (no stacked top bars). CONFIRMED.
- Ember: gameplay refs exist only in *.bak backups; live code clean. EMBER_REMOVAL_DONE.md present.
- Publish: Neverendingnarratives mounted; play/src/*.js byte-identical to source; index.html cache-busted ?v=1781736462; build.txt 1781736462; no emberBtn; config.js key empty; no tools/ or voice_config in play/. No republish needed.
- Security: SECURITY_REPORT.md shows NO urgent issues.
- Prior fixes remain staged (uncommitted) for user review per instructions. Stop conditions met -> disabling quick-fix task.
