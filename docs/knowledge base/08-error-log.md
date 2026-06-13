# 08 — Error Log & Debug Mode

> **Status: documentation + build spec. The dedicated error-capture panel is NOT built yet.** What EXISTS today is the crash overlay (below). This file documents how errors surface now, what "debug mode" means, and a spec for the future capture-and-send panel so any maintainer can build it.

## What exists today: the crash overlay

`game/index.html` (top `<script>`) installs `window.onerror` + `unhandledrejection` handlers that print uncaught errors into an on-screen box (`#crashOverlay`) instead of leaving a blank canvas. So if the game hard-crashes, the player sees the error text and can screenshot it.

That's the whole error-reporting story right now: **a player screenshots the overlay and sends it.** Everything below is the intended upgrade.

## Debug mode = AUTO FULL

There is no separate "debug mode" flag. **AUTO: FULL is debug mode** (the author's definition). It is the AFK auto-player: the champion walks the main quest, fights, advances dialog, and completes the game on its own. Toggle it with the gear (⚙) panel, the on-screen AUTO button, or **F10** (cycles OFF → FIGHT → FULL). State: `QuestNav.mode` (0/1/2) and `GameState.meta.autoMode`.

The error-capture panel (spec below) should be **active only when `QuestNav.mode === 2` (AUTO FULL)**, so normal players never see developer noise.

## Build spec — the error-capture & send panel (future)

Goal: while in AUTO FULL, collect anything that went wrong into a single report the user can copy and paste to a maintainer (or an AI). Build it as a new `src/core/errorlog.js` + a DOM panel, loaded like the other core scripts.

### What to capture
1. **Uncaught errors** — reuse the existing `window.onerror`/`unhandledrejection` handlers; push `{time, msg, stack, source:line}` into a ring buffer (cap ~100).
2. **Failed voice clips** — `VoiceMan` already tracks `_missing`; log each first-time miss as `{type:'voice-missing', id, speaker, text}`.
3. **AUTO stuck detection** — if `QuestNav.tracking` and the player position hasn't changed for > ~12s while not in a dialog/encounter, log `{type:'auto-stuck', zone, pos, objective}`. (This is the single most useful signal — it's how the AFK-stall bugs were found.)
4. **Combat anomalies** — optional: NaN position, HP going non-finite, a fight exceeding a time cap.
5. **Context** — always attach `{char, zone, flags-summary, build:window.__BUILD}` so a report is self-describing.

### The panel (UI)
- A small toggle button visible **only in AUTO FULL** (e.g. bottom-left, `🐞 N` where N = entries).
- Tap → a scrollable list of entries + two buttons: **Copy report** (writes a formatted text blob to the clipboard via `navigator.clipboard.writeText`) and **Clear**.
- The copied report = a plain-text block: build stamp, char/zone, then each entry. Designed to paste straight into a chat with a maintainer or AI.
- Persist nothing to the server; it's local-only and ephemeral (privacy + simplicity).

### Where it hooks in
- `index.html`: add `<script src="src/core/errorlog.js"></script>` before `main.js`, and a DOM container for the panel.
- `main.js`: initialize `ErrorLog` after boot; route the existing crash handlers into it.
- `voice.js`: in the missing-clip branch, call `ErrorLog.push({type:'voice-missing', ...})` if `ErrorLog` exists.
- `WorldScene.update` (or `QuestNav`): the stuck-detection timer.
- Gate the visible panel on `QuestNav.mode === 2`.

### Acceptance test
Add `tests/errorlog.js`: feed a fake error + a fake stuck event, assert the ring buffer captures them, the report string contains the build stamp + char + both entries, and that nothing logs when `mode !== 2`.

## Until it's built: how to report a problem now

1. If the screen shows a crash overlay → screenshot it (it already includes the error + stack).
2. Reproduce with AUTO FULL on and the **browser dev console open** (F12 → Console tab) → screenshot any red errors there.
3. Note: which champion, which zone, what you did, and whether it happens **locally vs the website** (that distinction usually means a cache/deploy issue — see `02-build-and-deploy.md`).
4. Check the live build is current: open `https://neverendingnarratives.com/play/build.txt` and compare to your last publish timestamp.
