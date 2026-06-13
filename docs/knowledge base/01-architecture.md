# 01 — Architecture & Data Model

Read this before changing anything. It explains how the pieces connect.

## Big picture

- **Engine:** Phaser 3.90 (`game/lib/phaser.min.js`). Plain JavaScript, loaded as plain `<script>` tags in `game/index.html`. **No build step.** You edit a `.js` file and reload the browser — that's the whole loop.
- **To play locally:** open `game/index.html` in a browser (double-click, or drag into Chrome). It works from `file://` because all art is base64-embedded in `assets/embedded.js`.
- **One global state object:** everything about a playthrough lives in `window.GameState` (defined in `src/main.js`). Saving is literally `JSON.stringify(GameState)`. This is a hard architectural rule — keep all persistent state there.

## Script load order (index.html, bottom of file)

Order matters — later files depend on earlier ones. Current order:
`phaser → config.js → assets/embedded.js → core/* (money, dialog, worldmap, autopilot, questnav, touchstick, save, music, voice, settings) → world/* (citymap, quests, companions) → core/companionAI → combat/pit.js → scenes/* → main.js`

If you add a new `.js` file, **add a `<script>` tag for it in index.html** (and the publisher will cache-bust it automatically). Forgetting this = "X is not defined" at boot.

## The global state object (`window.GameState`)

```js
window.GameState = {
  version: 1,
  player: null,        // null until a champion is chosen / pit is left. Then:
                       // { char, kills, level, bladeTier, base:{STR,DEX,CON,ATK},
                       //   nickname, copper, belt:[], artifacts:[], guildHunts }
  world: {
    zone: 'boot',      // current zone id (see wiki/locations.md)
    flags: {},         // quest + event flags, e.g. 'q-mq1-empty-cell':'active'
    chestsOpened: [],  // chest ids already looted
    questCounts: {},   // guild-hunt kill tallies, keyed by contract id
    seenZones: {},     // zones whose first-visit cinematic has played
    // ...other transient flags written by scenes
  },
  companions: {},      // key -> { met, recruited, approval, following, memory:[] }
  meta: { playtimeMs, kills, autoMode }   // autoMode 0/1/2 = OFF/FIGHT/FULL
};
```

- **`char`** is one of `'ronin' | 'druid' | 'warlock' | 'seraph'`. Almost all character-specific behavior branches on this string.
- **`copper`** is the only currency. 1 gold = 10 silver = 100 copper. Formatting via `Money.fmt()` in `core/money.js`.
- **Quest flags** follow `q-<id>` with values `'active'` or `'done'` (unset = not started). The conspiracy track is `q-mq1`..`q-mq6`; seraph is `q-sq1`..`q-sq4`; warlock epilogue is `q-wq1`..`q-wq3`.

## Scene flow (Phaser scenes = screens/zones)

```
ArenaScene (title + character select + the 20-fight Pit)
   │  win all 20  OR  take Bellow's 15s buy-out after fight 3
   ▼
CityScene (Karridge) ──north gate──▶ GroveScene (Thorn Grove)
   │                                     │  east (seraph only)──▶ MountainScene (Dragonspine)
   │  guild coach (druid)                │  SE──▶ DungeonScene (Root-Hollow)
   ▼                                     
VarenholmScene (druid epilogue)    AshenveilScene (warlock epilogue; all for hunts)
```

- Scene list is registered in `src/main.js` `config.scene`. Add a new scene class there.
- All explorable zones extend **`WorldScene`** (`src/scenes/WorldScene.js`), which provides: collision, interactables, NPC wander, the atmosphere/lighting stack, fighter-frame baking, the encounter host, companions, and the first-visit cinematic (`introPan`).
- `ArenaScene` is the exception — it does NOT extend WorldScene; it hosts the raw combat sim full-screen.
- Switching scenes: `this.scene.start('SceneName')`. State carries over because it's all in `window.GameState`.

## How combat is hosted (important + unusual)

The combat is a self-contained simulation in **`src/combat/pit.js`**, created by calling `createPitCombat(deps)`. It is engine-agnostic: it draws into a 2D canvas you give it and reads input from objects you write to. It is used in **two** places:

1. **ArenaScene** — full-screen, the 20-fight gauntlet (the "tutorial").
2. **WorldScene encounters** — when you bump a monster pack in the field, the scene spins up its OWN `createPitCombat` instance (`this.encCombat`) on an overlay canvas, runs the fight, then hands results back and hides it. See `WorldScene.initEncounterHost` and `startEncounter`.

`createPitCombat` returns an `api` object. Key members: `S` (state: mode/fight/etc.), `P` (the player fighter), `enemies`, `demons`, `wolves`, `FIGHTS` (the 20-fight roster), `frame(now)` (advance one tick), `doSlash/doParry/doHeavy/doRoll/heavyRelease` (inputs), `startEncounter(pack, cb)`, `setPlayerSnapshot(player)`, `drawFighter(...)`, `fullReset(char)`. The tests use this api directly with no browser.

## The `core/` systems (what each file does)

| File | Responsibility |
|---|---|
| `money.js` | Currency math + `fmt()`. Pit pays 10 copper (1 silver) per kill. |
| `dialog.js` | `CityUI` — all DOM overlays: dialog box, journal, guild board, belt, companions panel, credits. Speaks lines via `VoiceMan.say`. |
| `voice.js` | `VoiceMan` — plays voice clips (`assets/voice/<hash>.mp3`), ducks music, never wedges. Hash = fnv1a-32 of `SPEAKER|text`. |
| `music.js` | `MusicMan` — one cached Audio per track, crossfades, honors voice ducking. |
| `questnav.js` | `QuestNav` — the journal "walk me there" pathfinder AND the AUTO modes (OFF/FIGHT/FULL). Zone-to-zone routing (`nextHop`) + current `objective()`. |
| `autopilot.js` | `Autopilot` — the combat bot used by AUTO mode AND the test harnesses (same code). |
| `companionAI.js` | Companion conversation engine: scripted + optional Anthropic API layer + memory. |
| `save.js` | `SaveSystem` — localStorage save/load, `sceneForZone()` map. |
| `settings.js` | `SettingsUI` — the gear panel (volume sliders, AUTO toggle, credits, NEW GAME). |
| `touchstick.js` | `TouchStick` — mobile virtual joystick (handles both PointerEvent and TouchEvent). |
| `worldmap.js` | `WorldMapUI` — the M-key kingdom map; gates regions by character. |

## The `world/` data files (edit these to change content, not code)

- **`quests.js`** — `Quests` object: the conspiracy main quests, the seraph road + 5 duel candidates, the warlock epilogue, the guild board contracts + ranks, plus all the cult/druid/varenholm dialogue text and the per-character dialogue option tables (`optTable`, read via `Quests.opt(key)`).
- **`companions.js`** — `Companions` object: the 6 recruitable allies (look, persona, dialogue, recruit gates).
- **`citymap.js`** — `CityMap`: Karridge's tile layout, buildings, gates, NPC zones, signs, chatter.

## Save format

`localStorage` key `sorcerer-sword-arpg-save`. Value is `{ v:1, t:<timestamp>, state:<GameState> }`. `SaveSystem.load()` returns the state; `SaveSystem.apply()` merges it back into the live `window.GameState`. Because the whole game is one serializable object, save/load is trivial and a future co-op retrofit isn't precluded. **If you add persistent state, put it inside `GameState.world` (or `.player`/`.companions`) so it's saved automatically.**

## Things that will bite you

- **OneDrive truncates files mid-write.** `index.html` has been cut off 4+ times. See `02-build-and-deploy.md`. Guards and git hooks are in place; respect them.
- **Two repos.** The game source lives in `The Sorcerer Sword ARPG/game/`. The *published* site lives in a SEPARATE git clone (Neverendingnarratives). You publish from one into the other. See `02`.
- **Cache.** After deploying, browsers can serve old code. The build self-heal (`02`) fixes this automatically, but you may need one hard-refresh.
