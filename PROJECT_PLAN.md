# PROJECT PLAN — The Sorcerer-Sword ARPG: The Ankuspawn Conspiracy

## Charter (locked 2026-06-11)
- **Goal:** lore-faithful playable ARPG for Hiro's group. Not a pitch demo. Content depth wins ties.
- **Era:** Kingdom of Ankunyx, 25 years post–Book 4 — concurrent with Cookie's campaign. See `docs/LORE_BIBLE.md`.
- **Tech:** standalone Phaser 3 (v3.90, local lib, no build step, runs from double-clicking `game/index.html`). All game state in one serializable object. Input/controller separated.
- **Art:** Diablo 2 fidelity + ambient life (wandering NPCs, chatter, parallax vistas). Free packs per `docs/ASSET_DOWNLOADS.md`; procedural player characters (pre-approved hybrid).
- **Combat law:** `the-pit-of-karridge.html` — port, never redesign. Map: `docs/COMBAT_SOURCE_MAP.md`.
- **AI companions:** Claude API with Hiro's key + scripted fallback. Verify key handling at Bucket 6.
- **Canon guardrail:** conspiracy survives the game; AnkuNyx never learns of it; no named canon character dies.

## Buckets — 7 build days + 3 QA. Checkpoint after every bucket; Hiro approves before the next starts.
| # | Day | Scope | Checkpoint |
|---|---|---|---|
| 0 | Jun 11 | Scaffold, lore bible, asset list, FUTURE.md, combat source map | ✅ scene runs; lore bible red-penned |
| 1 | 1 | Ronin kit + 3 enemies + full post-FX stack in Phaser | Arena fight 1 feels identical to HTML |
| 2 | 2 | Druid + Warlock + full roster + 20-fight gauntlet + nicknames/gold | Complete prologue |
| 3 | 3 | Karridge City: map, transition, Inn, Guild, loot/belt, ambient NPCs | City loop playable |
| 4 | 4 | Thorn Grove: map, re-skins, dungeon + artifacts, world map + teasers | Two zones + travel |
| 5 | 5 | Main quest 5 beats + guild side quests (story outlines from Hiro first) | Story start→finish |
| 6 | 6 | 6 companions, AI dialogue + memory, 2 relationship quests | Recruit + fight together |
| 7 | 7 | Title, save/load, music, balance, polish | Shippable slice |
| QA | 8–10 | Playtest harness, Hiro playthroughs, triage, perf | Publish |

**Cut order if behind:** 4 companions→talk-only → forest dungeon → guild repeatables. **Never cut:** arena→city flow, Inn quest, 2 AI companions.

**Hiro owes:** music files into `game/assets/music/` (title/arena/city/grove/dungeon.mp3 — system ready, silent until then), API key into `game/config.js` if AI companions wanted.

**STATUS (end of build, 2026-06-12):** Buckets 0–7 ALL COMPLETE, 5 days ahead of schedule. Full loop ships: char select → 20-fight gauntlet → Karridge City → Thorn Grove → Root-Hollow dungeon → conspiracy beats 1–5 → finale (+ Ronin-only easter-egg finale). Companions, artifacts, potions, guild contracts, save/load, world map, autopilot spectate (F10), field scaling. Next: QA days — playtests, bug triage, perf, publish prep.
