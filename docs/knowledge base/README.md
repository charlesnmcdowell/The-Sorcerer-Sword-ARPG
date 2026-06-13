# The Sorcerer-Sword ARPG — Knowledge Base

This is the maintenance manual for the game. It is written so that a **less-capable AI assistant** or a **tech-support person with basic coding ability** can keep the game running, diagnose problems, and make safe changes **without** the original author or a top-tier AI present.

If you are that reader: start here, then open the section you need. Every section uses exact file paths and copy-paste commands. When in doubt, **run the tests** (section 03) — they catch most mistakes automatically.

## What this game is

A single-player, browser-based, top-down dark-fantasy action-RPG built in **Phaser 3.90** with plain JavaScript (no build step, no framework, no npm install to play). It runs by opening one HTML file. The combat is a verbatim port of an earlier prototype, `the-pit-of-karridge.html`. Four playable champions each have their own kit, story, and ending. Live at **https://neverendingnarratives.com/play/**.

## The one rule that matters most

**The combat kits are a "source-is-law" port. Do not rebalance them.** Numbers, timings, and feel were tuned in the original prototype and copied exactly. Changing them silently breaks the design. See `07-combat.md`.

## Sections

| File | What it covers |
|---|---|
| `01-architecture.md` | How the code fits together: file map, the one global state object, scene flow, how combat is hosted, the save format. **Read this first.** |
| `02-build-and-deploy.md` | How to run, publish, commit, and push. The OneDrive file-corruption hazard and its guards. The cache self-heal. How to recover a broken file. |
| `03-testing-and-qa.md` | Every automated test, how to run it, and what a pass/fail means. Run these before and after any change. |
| `04-common-tasks.md` | Step-by-step recipes: add a champion, a zone, a guild contract, a voice line, swap music, change a price. |
| `05-art-direction.md` | How the game looks: art assets, the fighter renderer, camera (incl. the cinematic pan), lighting/atmosphere. |
| `06-voice.md` | Voice acting pipeline (ElevenLabs), the manifest/coverage system, and future voice modules (AI character voices, player voice commands). |
| `07-combat.md` | General combat features + each champion's kit + each monster's behavior. The "do not rebalance" rules. |
| `08-error-log.md` | How to capture and report game errors. Debug mode (= AUTO FULL). **Doc only — feature not yet built; includes a build spec.** |
| `09-feature-list.md` | Everything the game currently does. |
| `10-future-features.md` | Features the author has alluded to / planned but not built. |
| `11-recommended-features.md` | Features NOT planned that are recommended based on top browser ARPGs. |
| `wiki/` | **Auto-generated** quest / character / monster / location reference. Regenerate with `node game/tools/gen_wiki.js`. Never hand-edit. |

## Folder layout (where everything lives)

```
The Sorcerer Sword ARPG/
├─ game/                     ← the game itself
│  ├─ index.html             ← entry point: open this to play locally
│  ├─ config.js              ← optional AI key for companion chat (never commit a key)
│  ├─ lib/phaser.min.js      ← the engine (do not edit)
│  ├─ assets/
│  │  ├─ embedded.js         ← base64 art (tilesets/props) so it works from file://
│  │  ├─ music/*.mp3         ← zone + pit tracks
│  │  └─ voice/*.mp3         ← voice clips (+ _raw/ = pristine pre-normalize backups)
│  ├─ src/
│  │  ├─ main.js             ← boot: GameState, Phaser config, cache self-heal
│  │  ├─ core/               ← cross-cutting systems (see 01-architecture.md)
│  │  ├─ scenes/             ← one file per screen/zone
│  │  ├─ world/              ← data: quests.js, companions.js, citymap.js
│  │  └─ combat/pit.js       ← the ported combat sim (THE big file)
│  ├─ tests/                 ← node test harnesses (no browser needed)
│  └─ tools/                 ← python/node scripts: publish, voices, wiki
├─ docs/
│  ├─ knowledge base/        ← YOU ARE HERE
│  ├─ LORE_BIBLE.md          ← canon + approved retcons (story rules)
│  └─ VOICE_*.md / *.md      ← older working docs
└─ (site repo is a SEPARATE clone — see 02-build-and-deploy.md)
```

## If something is on fire (quick triage)

1. **Game won't load / frozen title** → almost always a truncated `index.html` (OneDrive) or stale browser cache. See `02-build-and-deploy.md → "Recovering a broken file"` and `→ "Cache problems"`.
2. **Voice not playing on the website but fine locally** → stale cached code on the visitor's browser; hard-refresh. The build self-heal (02) prevents recurrence after one load.
3. **A change broke combat / quests** → run `node game/tests/gauntlet.js` and `node game/tests/navsim.js <char>` (section 03). They tell you what broke.
4. **Don't know how the code is organized** → `01-architecture.md`.
