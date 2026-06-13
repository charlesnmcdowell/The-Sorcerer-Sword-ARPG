# 04 — Common-Tasks Cookbook

Step-by-step recipes for the changes you'll actually make. Each ends with **"verify"** — always run that. Paths are relative to `game/`.

> Golden rule: after ANY change, run the tests (`03-testing-and-qa.md`) and regenerate the wiki (`node tools/gen_wiki.js`). Before deploying, run the full chain.

---

## Change a price / reward / quantity (easiest)

- Pit payout per kill: `src/core/money.js` → `PIT_PAYOUT_PER_KILL` (copper; 10 = 1 silver).
- Bellow's leave bonus: `src/scenes/ArenaScene.js` → `leaveArena()` → `handoffToCity(150)` (150 copper = 15 silver).
- Guild contract rewards / kills-needed: `src/world/quests.js` → `guildBoard` array (`copper`, `need`, `potion`).
- Guild rank thresholds/multipliers: `quests.js` → `guildRanks`.

**Verify:** `node tests/save.js && node tests/navsim.js ronin`.

---

## Add a guild hunt contract

1. In `src/world/quests.js`, add an entry to `guildBoard`:
   ```js
   { id: 'g-yourkind', title: 'CULL: SOMETHINGS', text: '...', reward: '5s + potion',
     region: 'Thorn Grove', need: 5, copper: 50, potion: 'potion-health', potionLabel: 'Health Potion' },
   ```
2. In the matching scene (`GroveScene.js` / `MountainScene.js` / `AshenveilScene.js`), add a monster pack whose `def.quest` equals your `id` (`'g-yourkind'`). Copy an existing pack def in that scene's pack list and change the type/name/quest. Add spawn tiles to that scene's `packSpots`/spot list.
3. **Critical for the grove only:** the pack's restock flag is `'pack-' + kind`, and the guild turn-in deletes `'pack-' + id.slice(2)`. So the grove pack's *kind key* must equal the contract id minus the `g-` prefix (e.g. contract `g-yourkind` ⇒ grove pack key `yourkind`). Mountain/Ashenveil restock every visit and don't need this.

**Verify:** `node tools/gen_wiki.js` (your contract appears in `wiki/quests.md`), then `node tests/navsim.js druid`.

---

## Swap a music track

1. Put the new `.mp3` in `assets/music/`. Zone tracks are named by zone: `city`, `grove`, `dungeon`, `mountain`, `varenholm`, `ashenveil`, `title`, `arena`, plus per-character pit themes `pit-druid`, `pit-seraph`.
2. To convert a `.wav` to the right format:
   ```sh
   ffmpeg -y -i "input.wav" -b:a 128k "game/assets/music/grove.mp3"
   ```
3. Zone→track mapping is in `src/scenes/WorldScene.js` (`spawnPlayer`, the `zoneTrack` map). Per-character pit themes are in `src/scenes/ArenaScene.js` (`pitTrack`).

**Verify:** open the game, enter that zone, listen. (Tests don't cover audio.)

---

## Add / replace a voice line

Voice clips are keyed by a hash of `SPEAKER|text`. See `06-voice.md` for the full pipeline. Short version:
1. Write/keep the dialogue text in the relevant data file (`quests.js`, `companions.js`) or scene.
2. Rebuild the manifest: `node tools/build_voice_manifest.js` (this also writes a coverage report to `docs/VOICE_STATUS.md`).
3. Generate audio on a machine with the ElevenLabs key: `python tools/generate_voices.py --yes` (resumable; only makes missing clips).
4. Normalize loudness once after generating: `python tools/normalize_voices.py`.
5. To **re-record** one line: delete its `.mp3` from `assets/voice/` and rerun step 3.

**Verify:** `node tests/voicechain.js && node tests/voicetrace.js`.

---

## Add a new zone (scene)

1. Create `src/scenes/YourScene.js`. Easiest: copy `MountainScene.js` (a self-contained hunt zone) and rename the class. It must `extends WorldScene`.
2. Give it a unique `zone` id string; set `GS.world.zone = 'your-zone'` in `create()`.
3. Register it: add `<script src="src/scenes/YourScene.js"></script>` in `index.html` (before `main.js`), and add the class to `config.scene` in `src/main.js`.
4. Wire travel: add a gate/coach in an existing scene that calls `this.scene.start('YourScene')`, and add the zone to:
   - `src/core/save.js` → `sceneForZone()` map,
   - `src/core/questnav.js` → `_zoneOf` and the `nextHop` HOPS table (for AUTO routing),
   - `src/scenes/WorldScene.js` → the `zoneTrack` music map.
5. The first-visit cinematic works automatically (it's in `WorldScene.introPan`, called from each scene after camera setup — copy that one line).

**Verify:** `node tests/cityboot.js` (adapt for your scene), then manually walk in.

---

## Add a champion (biggest task — read `07-combat.md` first)

This touches many files. High level:
1. **Kit** in `src/combat/pit.js`: add `P.char === 'your'` branches in `doSlash/doParry/doHeavy/doRoll`, an intro `DEMOS` entry + `BIOS` entry, a `NICKBANKS` entry, button labels in `updateLabels`, the draw branch in the render section, and reset its custom fields in `spawnFight`/`startEncounter`/`demoReset`/`fullReset`. Keep new state on `P` and reset it everywhere the others reset.
2. **Title button**: add `<div class="tap" id="yourBtn">…</div>` in `index.html`, bind it in `ArenaScene.js` (`on('yourBtn', ()=>this.combat.startIntro('your'))`).
3. **Overworld look**: add a `'fr-player'` look branch in `WorldScene.bakeFrames`.
4. **AUTO bot**: add a `P.char === 'your'` branch in `src/core/autopilot.js` AND the same logic in `tests/gauntlet.js` (they mirror each other).
5. **Story** (if the champion has its own track): add quests to `quests.js`, gate scenes, add objectives to `questnav.js`.

**Verify:** `node tests/gauntlet.js assist your && node tests/abilities.js && node tests/navsim.js your`.

> The Seraphim (commit history "THE SERAPHIM") is the worked example of adding a champion + a zone + a quest line. Diff that work to see every touch point.

---

## Change dialogue text

- Main-quest / cult / epilogue text: `src/world/quests.js`.
- Per-character player option labels: `quests.js` → `optTable` (read via `Quests.opt(key)`).
- Companion lines/personas: `src/world/companions.js`.
- City flavor / signs / NPC chatter: `src/world/citymap.js`.

> Changing text changes its voice-clip hash → the old clip no longer matches and the line goes silent until regenerated. After editing voiced text, rebuild the manifest and regenerate that clip (see "Add/replace a voice line").

**Verify:** `node tools/gen_wiki.js && node tests/navsim.js <affected char>`.
