# 09 — Feature List (what the game currently does)

A complete inventory of shipped features, so a maintainer knows what exists before adding or "fixing" anything.

## Core / engine
- Browser game, **no build step**; runs from `file://` or a static host. Phaser 3.90.
- All art (tilesets/props) base64-embedded → zero external asset files needed.
- Single serializable `window.GameState`; **save/load** via localStorage + a Continue button on the title.
- Cache self-heal (build-stamp check) so deploys don't strand players on stale code.
- Crash overlay (uncaught errors print on screen, not a blank canvas).
- Mobile support: virtual joystick, tap-to-interact, tap belt slots, fullscreen scaling, UI scaled for small screens.
- Settings panel (gear ⚙): music + voice volume sliders, AUTO toggle, view credits, NEW GAME (wipe + restart).

## Characters (4 playable champions)
- **Ronin** (per-kill growth, katana→nodachi→odachi, parry/air-slash), **Druid** (level 1–10, human/bear/wolf forms), **Warlock** (summons → arch-devil → lich), **Seraphim** (spear/halo-ray/convert-minions/immortal-grace). Full kits — see `07-combat.md`.
- Procedurally drawn (no sprite files); each has a unique look, intro demo, voiced bio, and crowd nickname system.

## Combat
- Verbatim port of the Pit of Karridge prototype (source-is-law).
- 20-fight arena gauntlet with escalating foes; after fight 3, healer + wildcard reinforcements and Bellow's 15-silver buy-out (leave early).
- Field encounters in the overworld (bump a monster pack → fight on an overlay).
- Kill cinematics (slow-mo, zoom, letterbox, fatalities, dismemberment/blood decals).
- ~15 enemy archetypes (tank/healer/riposte/ranged/fire/summoner/boss/etc.) + per-zone reskins.
- Companions fight alongside you when recruited.
- Field HP scaling (toggleable) so a snowballed champion still meets resistance.

## World & zones
- **Karridge City**, **Thorn Grove**, **Root-Hollow dungeon**, **Dragonspine** (mountains), **Varenholm** (druid epilogue), **The Ashenveil** (warlock epilogue + open hunt grounds for all). Plus the **Pit** arena.
- Atmospheric lighting/fog/ember stack per zone; per-zone + per-character music.
- First-visit cinematic camera pan to each zone's objective.
- World map (M key) with character-gated regions.
- Zone-to-zone travel (gates, coaches, the treaty stone).

## Quests & story
- **Three main-quest tracks** by character: the Ankuspawn Conspiracy (ronin/druid/warlock, beats mq1–mq6), the Seraphim's Dragonspine road (sq1–sq4, duel + recruit 1 of 5), and the Warlock's White-Writ → Lady Nyx epilogue (wq1–wq3).
- Per-character endings + a credits screen linking the podcast and the Amazon books.
- **16 repeatable guild hunt contracts** across three regions, with a 6-tier guild rank ladder (Iron→Diamond) scaling payouts.
- **6 recruitable companions** with relationship/recruit flows, scripted dialogue, and optional **live AI conversation** (with an Anthropic key) + memory.
- Per-character dialogue: each champion speaks main-quest choices in-character (the warlock even gets neutral vs malevolent option pairs).

## Voice & audio
- Voiced dialogue (ElevenLabs), ~179/192 lines covered; narration, NPCs, and player lines voiced.
- Hash-keyed clips; music ducks under voice and never wedges; loudness-normalized.
- Original soundtrack (zone + pit themes), music on/off + volume.

## Automation / accessibility
- **AUTO mode** tri-state (OFF / FIGHT / FULL). FULL = an AFK auto-player that completes the whole game (also the built-in demo reel and "debug mode").
- "Walk me there" quest tracking (BFS pathfinding + cross-zone routing).

## Tooling (developer-facing)
- Publish script (with truncation + cache-bust guards), git pre-commit hooks, build-stamp cache self-heal.
- 11 node test harnesses (combat, abilities, navigation, voice, save, boot).
- Voice pipeline (manifest builder + coverage report, generator, normalizer).
- Auto-generated wiki (`gen_wiki.js`).
