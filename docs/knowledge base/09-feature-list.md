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
- **Boss expansion:** 9 named bosses across the zones, each with `boss:true`/`deathCol` health bars, a pre-fight banner, and a kill cinematic. Reuse the existing AI types (grave/necro/champ/collector/warden/pyre/hound) rather than bespoke systems.
- **Venom + frost hazard zones:** territory packs scale on an HP ladder (forest x2, undead x4, mountain x6) with bosses x5, so deeper zones stay dangerous. Dragonspine regulars were rebalanced (item 15): ~25% less HP but ~15% more damage, so it stays the hardest zone without being spongy.
- **Conversation-safe combat:** no encounter (proximity pack, ambush, or boss proc) can start while a dialog or cinematic is open — packs even freeze their wander mid-talk, preserving the cinematic feel.
- Companions fight alongside you when recruited.
- Field HP scaling (toggleable) so a snowballed champion still meets resistance.

## World & zones
- **Karridge City**, **Thorn Grove**, **Root-Hollow dungeon**, **Dragonspine** (mountains), **Varenholm** (druid epilogue), **The Ashenveil** (warlock epilogue + open hunt grounds for all), and the **Ashenveil Lower Levels** — an optional raid undercroft beneath the academy. Plus the **Pit** arena.
- **The Ashenveil undercroft (raid):** descend the Academy stairs into a cold flagstone undercroft (sets `q-ash-raid`). Feral undead packs (cell ghouls, vault wraiths, unfiled wights) restock every descent; a mid-zone mini-boss, **the Warden of the Unfiled** (`door` AI, undead tier x4), drops the **Duelist's Knot** relic (+20% parry/dodge) and unlocks the sealed **Deep Door**, whose finale boss **the Thing the Web Saves** (`necro`, boss x5) is the hardest fight below. The whole undercroft is QuestNav-routed (AUTO can clear it headlessly) and fully fail-safe — every gate is a dialog that auto-advances under AUTO:FULL, so nothing can hard-block.
- Atmospheric lighting/fog/ember stack per zone; per-zone + per-character music.
- First-visit cinematic camera pan to each zone's objective.
- World map (M key) with character-gated regions.
- Zone-to-zone travel (gates, coaches, the treaty stone).

## Quests & story
- **Three main-quest tracks** by character: the Ankuspawn Conspiracy (ronin/druid/warlock, beats mq1–mq6), the Seraphim's Dragonspine road (sq1–sq4, duel + recruit 1 of 5), and the Warlock's White-Writ → Lady Nyx epilogue (wq1–wq3).
- **The Warlock's Hunt (wq4):** Lady Nyx commissions the warlock to capture five ankuspawn alive, one per zone — Briar the Green Orphan (Thorn Grove), Ossuary the Quiet Boy (Root-Hollow dungeon), Cinder the Ash-Wick (Dragonspine), Whisper the Ninth Ward (Ashenveil), and the climax Cookie + the Thornwarden (Varenholm). Each is a boss capture-fight; a "cult coach" unlocks the normally-gated Mountain/Varenholm for the warlock, and the journal/AUTO route the warlock target-to-target. Delivering all five rolls the warlock's-road credits.
- **The Druid's Crossing (dq):** the druid POV of the Varenholm cult crossing — befriend Cookie, fight off the cult warlock who comes to cage you, survive his Anku-reinforced rematch, flee up the Dragonspine, and meet **Shen Sama**, who is also hunting the missing hearth-wyrm **Ignis**. Ends on the druid credits.
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
