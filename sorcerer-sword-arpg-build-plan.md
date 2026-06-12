# THE SORCERER-SWORD: ARPG — Claude Desktop Build Prompt & 5-Day Plan

You are building a single-player dark-fantasy action RPG in the world of *The Sorcerer-Sword* novels (events set 20 years after Book 2). The combat system is ALREADY SOLVED — it lives in the attached file `the-pit-of-karridge.html` and is the source of truth for all character kits, damage math, enemy AI, and game feel. Your job is to port it into a real engine and build a world around it. Do not redesign combat. Port it.

---

## 1. TECH STACK (non-negotiable)

- **Phaser 3** (latest), plain JavaScript. No TypeScript, no React, no build step beyond a simple bundler if needed. Phaser was chosen because the existing combat code is vanilla JS canvas — entities, cooldowns, damage rolls, and AI port nearly line-for-line.
- **Tiled** map editor for zone layouts (export JSON, load in Phaser).
- Target: runs at 60fps in a desktop browser; mobile is a bonus, not a requirement.
- Architecture rule: keep **input → character controller** and **all game state in one serializable object** cleanly separated. We are not building multiplayer, but the code must not preclude a future co-op retrofit (publisher pitch line: "architected for co-op").

## 2. ART DIRECTION & ASSET PIPELINE

**Target fidelity: Diablo 2.** Moody isometric-ish painted 2D. Dark palettes, fog, torchlight. The atmosphere does the heavy lifting, not the sprite detail.

**Free assets only.** The human will download these packs (links below); you integrate them. Do not attempt to generate or fetch art yourself beyond these.

Shortlist (all free / CC0 / free-tier):
- **Kenney.nl** — UI packs, particle sprites, RPG audio.
- **0x72 Dungeon Tileset II** (itch.io) — characters/dungeon fallback.
- **Cainos Pixel Art Top Down — Basic** (itch.io) — town + forest tiles.
- **LPC (Liberated Pixel Cup) collection** (OpenGameArt) — huge consistent character/terrain spritesheet base, walk cycles included.
- **Aekashics Librarium** (free tier) — monster art.
- **Tiny Swords / Pixel Crawler free tiers** (itch.io) — props, chests, effects.

**If a needed sprite doesn't exist in the packs: keep the procedural canvas-drawn fighters from the source file.** They already read well. A hybrid (procedural characters over painted/tiled environments) is acceptable and was pre-approved.

**The Diablo 2 feel is 70% post-processing — implement all of these in Phaser:**
- Darkness overlay with a torch-radius light around the player (and light sources: torches, braziers, spell glows).
- Heavy vignette. Drifting fog layers (2 parallax alpha textures).
- Particle embers/dust motes. Blood decals that persist (port from source file).
- Screen shake, hit-pause, slow-mo kill cams, FATALITY system — all exist in the source file. Port them.

## 3. THE THREE CHARACTERS (port, don't redesign)

All kits, numbers, cooldowns, and feel come from `the-pit-of-karridge.html`. Summary:

- **THE RONIN** — parry specialist. 3-cut combo, heavy, roll, 2.3s parry → heal 20% + piercing air slash. Kills (including summons) give +2 all stats, +1 katana die, no cap. Weapon evolves at stat doublings: Katana → Nodachi (20) → Odachi (40), with visual form changes.
- **THE DRUID** — twin-blade glaive (PIERCE/CRESCENT/CYCLONE thrown patterns), vines (root + DoT + retreat hop), 6s beast forms on separate cooldowns: Bear (claw 1.45×, roar, 35% damage reduction, slower) and Wolf (bite lunge, howling heal, summons 3 spirit wolves). 5s human lockout between shifts.
- **THE WARLOCK** — dark elf. Hex (30 dmg/sec DoT for 10s + 60% slow, 10s CD), Blink (backward teleport, 230px stun 4s), Portal (swap with furthest enemy + 3s invulnerable ward), hold-channel summons (3s Claw Fiend taunt-tank / 4s Bone Dragon paralytic gas / 6s Succubi coven), one of each demon alive at a time. Full coven → ARCH DEVIL 10s form (roll-claw lunge, bite heals, devours own demons first; biting a succubus ascends her into a stationary 7s bomb).
- **Leveling:** Ronin = raw kill snowball. Druid/Warlock = levels 1–10, +1.5 levels per kill, +3 stats and +1 damage die per level, with unlock gates (Druid: bear 3, wolf 6; Warlock: dragon 3, succubi 5, arch devil 8). Level cap for this build: 10.

## 4. CLASS EVOLUTIONS & DOJO WEAPONS — CUT FROM THIS BUILD (future / post-funding)

**Do NOT build any of this in the 5-day slice.** Record it in FUTURE.md only. If the core game earns funding, the roadmap is: Druid/Warlock evolution choices at levels 10 and 20 (new model + variant moveset), and a dojo system where the Samurai learns spear or rifle weapon lines with their own stat-doubling evolutions. Level cap for this build stays at 10; the Ronin's existing katana → nodachi → odachi line stays as-is (it's already built).

## 5. WORLD — TWO POLISHED ZONES + LOCKED TEASERS

**Zone 1: KARRIDGE CITY (+ the Pit).** The game OPENS in the arena — the existing 20-fight gauntlet IS the tutorial/prologue. On victory, the player walks out of the Pit into the city **carrying their earned nickname and gold** (gold = kills × a payout rate; the crowd's name follows them in NPC dialogue). Dark-ages fantasy city: torchlit streets, the Inn, the Adventurers Guild, companion NPCs in the streets.

**Zone 2: THORN GROVE** (the great forest's friendly edge). Druid-grove vibes (Baldur's Gate 3 grove reference): giant roots, glowing flora, wood-elf settlement, forest monsters (use arena enemy AI re-skinned: hounds → wolves, gravedigger → rot shaman, etc.), chests, a forest dungeon entrance.

**Locked teasers at zone edges (signpost + "the way is barred" message):** Shadowveil Forest, the Mountain (snowy peaks, dragons), the Northern Kingdom, the Dwarven Mines. Visible on the world map as greyed regions — proves the world's scale to publishers without building it.

## 6. QUEST & LOOT SYSTEMS (deliberately minimal)

- **No shops. No economy.** Gold is a score/flavor stat for now.
- **The Inn (Karridge):** innkeeper gives the MAIN STORY quest line via rumors (3–5 story beats across both zones), and directs the player to the Adventurers Guild.
- **Adventurers Guild:** repeatable kill-quests ("cull 8 wolves in Thorn Grove") with small gold + a potion reward. One board, 3 rotating quest templates.
- **Loot:** chests scattered in the world + enemy drops. Small table only:
  - Health potions (instant heal)
  - Buff potions: STR / DEX / CON / ATK, +25% for 60s
  - 4–6 **arcane artifacts** (permanent passive buffs, found in dungeon chests): e.g., Ley-Shard (abilities +10% dmg), Duelist's Knot (parry/dodge windows +20%), Grove Charm (+15% healing received), Coalheart (+10% max HP).
- Inventory: a simple 8-slot belt UI. No equipment system.

## 7. AI COMPANIONS — THE KILLER FEATURE

Six companions, all romanceable, sexuality never gates anything:

| Name (draft) | Race / Gender | Archetype & Alignment | Found in |
|---|---|---|---|
| Brakka | Orc man | Gruff honorable mercenary, Lawful Neutral | Karridge guild hall |
| Faelar | Wood elf man | Serene grove-keeper with a dry wit, Neutral Good | Thorn Grove |
| Dorian | Human man | Disgraced knight seeking redemption, Lawful Good | Karridge inn |
| Vexa | Tiefling woman | Chaotic problem-child arsonist-adjacent alchemist, Chaotic Neutral | Karridge back alleys |
| Sylvara | Dark elf woman | Exiled noble, sharp-tongued strategist, Neutral Evil-leaning | Thorn Grove edge |
| Pippa | Halfling woman | Relentlessly cheerful treasure hunter, Chaotic Good | Roams both zones |

**Architecture (this works in published Claude artifacts today):**
- Each companion = a **system prompt** (personality, speech style, alignment, backstory, current relationship stage, hard rules: stay in character, keep replies under 60 words, never break the fourth wall) + a **rolling memory log** of player actions and conversation summary, sent with every `fetch("https://api.anthropic.com/v1/messages", ...)` call (no API key needed inside artifacts; use `claude-sonnet-4-20250514`, max_tokens ~300).
- Game events append to memory: quests done, monsters slain, companions recruited, dialogue choices. Compress memory beyond ~20 entries into a summary line.
- **Relationship quest per companion:** a scripted mini-quest (kill X / fetch Y / make a choice) that unlocks recruitment; an approval meter driven by simple tags on player choices vs. companion alignment. Romance unlocks at approval threshold via an AI-driven conversation.
- Recruited companion follows the player and fights with a simple kit (reuse the spirit-wolf / demon ally AI from the source file).
- Romance content: tasteful, fade-to-black. Keep it all-ages-store safe.

## 8. STORY & LORE

Based on *The Sorcerer-Sword* Books 1–2 (the human is the author and has outlines ready — ASK FOR THEM before writing main-quest dialogue). Setting: 20 years after Book 2. Use the established world systems: **ley-line magic, the portal network, guild contracting, Academy politics.** Legacy characters from the novels may appear as NPCs (the human will specify which). The Pit of Karridge and its announcer Bellow, the existing enemy roster, and the crowd-nickname system are now canon to this game.

## 9. FIVE-DAY MILESTONE PLAN

- **Day 1 — Foundation & Port.** Phaser project scaffold. Port the Ronin's full kit + 3 enemy types into a Phaser scene with the lighting/post-processing stack. MILESTONE: arena fight 1 playable in Phaser, feels identical to the HTML version.
- **Day 2 — Characters & Arena.** Port Druid + Warlock + remaining enemies + the 20-fight gauntlet + nickname system. MILESTONE: full prologue arena complete in-engine.
- **Day 3 — Karridge City.** Tiled city map, arena→city transition with nickname+gold, Inn (main quest giver), Guild (repeatable quests), chests/loot/belt UI. MILESTONE: city loop playable.
- **Day 4 — Thorn Grove.** Forest map, re-skinned monsters, forest dungeon with artifact chest, locked-zone teasers + world map. MILESTONE: both zones + travel.
- **Day 5 — Companions & Polish.** All six companions placed; AI conversation system + memory; 2 relationship quests fully built (Brakka, Vexa), the other 4 conversational-only; title screen, intros, save/load (localStorage in standalone build / in-memory in artifact). MILESTONE: shippable vertical slice.

**Cut order if behind schedule:** 4 of 6 companions to "talk-only" → forest dungeon → guild repeatable quests. NEVER cut: arena→city flow, the Inn quest, at least 2 AI companions.

## 10. WORKING RULES FOR THE AI

- The combat file is law. When in doubt, open it and copy the logic.
- Syntax-check after every change (the established workflow: extract JS, `node --check`).
- Small loot table, two zones, six companions. Resist scope creep — flag ideas to a FUTURE.md instead of building them.
- Ask the human for: the story outlines, which novel characters appear, and the music files (already produced) with where each track plays.
