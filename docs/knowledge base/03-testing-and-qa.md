# 03 — Testing & QA Runbook

The game ships with **node test harnesses** that run the real game logic with a stubbed browser — no Phaser, no display needed. They are your safety net. **Run them before and after any change.** They live in `game/tests/`.

## How to run

```sh
cd "C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG\game"
node tests/<name>.js
```

A test prints a final line ending in `PASS` (good) or `FAIL`/`CRASH` (something broke) and exits 0 on pass, non-zero on fail.

## Run-them-all (do this before every deploy)

```sh
cd "C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG\game"
node tests/gauntlet.js && \
node tests/abilities.js && \
node tests/headless.js && \
node tests/encounter.js && \
node tests/cityboot.js && \
node tests/save.js && \
node tests/voicechain.js && \
node tests/voicetrace.js && \
node tests/navsim.js ronin && node tests/navsim.js druid && \
node tests/navsim.js warlock && node tests/navsim.js seraph && \
echo "ALL GREEN"
```

If you see `ALL GREEN`, the core game is healthy. If any step stops the chain, that test failed — read its output.

## What each test proves

| Test | Command | What it proves / when it matters |
|---|---|---|
| **gauntlet** | `node tests/gauntlet.js [assist\|honest] [char\|all]` | Plays all 20 arena fights for all 4 champions. `assist` (default) keeps the bot alive to exercise every enemy/summon and asserts no crash + victory. `honest` = no keep-alive, reports how far an unassisted bot gets. Run after touching `pit.js`, `FIGHTS`, or any enemy. |
| **abilities** | `node tests/abilities.js` | Fires every ability of every champion against every enemy type for 25s each, asserting no exception, no NaN positions, no stuck state. Plus targeted checks: druid reaches all forms, warlock summons/devil, seraph ray-converts. Run after touching any kit. |
| **navsim** | `node tests/navsim.js <ronin\|druid\|warlock\|seraph> [maxMin]` | Boots the REAL scenes with a stub Phaser/DOM, sets AUTO FULL, and plays the **entire main quest** across zone transitions. PASS = that champion's final quest flag completes. Run after touching quests, scenes, questnav, or autopilot. |
| **headless** | `node tests/headless.js` | A scripted bot wins arena fight 1 and confirms the kill-snowball raises stats. Fast smoke test of the combat port. |
| **encounter** | `node tests/encounter.js` | A field encounter (the world-hosted combat instance) runs and resolves. |
| **cityboot** | `node tests/cityboot.js` | The city scene boots cleanly with the stub (catches scene-create crashes). |
| **save** | `node tests/save.js` | Save → load round-trip preserves player, world flags, journal, companions exactly. Run after changing the state shape. |
| **voicechain** | `node tests/voicechain.js` | Runs all 4 champions through real dialog chains (incl. missing clips + unvoiced option labels) and asserts the voice system never wedges and music always returns to full volume. Run after touching `voice.js`/`music.js`/`dialog.js`. |
| **voicetrace** | `node tests/voicetrace.js` | Confirms every voiced line on the seraph duel chains + warlock epilogue actually fires playback on an existing clip (catches "voice silently dropped"). |
| **playthrough** | `node tests/playthrough.js` | Plays the conspiracy beats 3–5 to the checkpoint. |

## Reading a failure

- `CRASH in fight N (NAME): <stack>` — an exception in combat. The stack's first lines point at `pit.js`.
- navsim `❌ ... TIMEOUT` — the AUTO player got stuck and never finished the quest. The debug line every 30s prints position/track/target — look for the champion stuck at one spot (often a gate/objective coordinate problem in `questnav.js`).
- voicechain `FAIL after <step>: music=...` — the music duck didn't restore or state wedged. Look at `voice.js` `_unduck`/`_afterClip`.

## After changing game content, also regenerate the wiki

```sh
node game/tools/gen_wiki.js
```
This keeps `docs/knowledge base/wiki/` accurate (quests, monsters, characters, locations). It reads live source, so it can't drift if you re-run it.

## Manual QA checklist (things the harnesses can't see)

The tests stub the browser, so they do NOT verify rendering, audio, camera, or touch. After big changes, also do a quick **manual** pass in a real browser:

1. Title → pick each champion → the intro demo plays + voice narrates.
2. Win/leave the pit → city loads (no black screen), music plays, a dialog speaks.
3. Walk into a new zone → the first-visit cinematic pans to the objective and returns.
4. Open the gear (⚙) → volume sliders move audio, NEW GAME wipes and restarts.
5. On a phone (or narrow window): the virtual stick moves, buttons fit, action is readable.
6. AUTO: FULL (gear or F10) → the champion plays itself to the end (this doubles as a live demo).
