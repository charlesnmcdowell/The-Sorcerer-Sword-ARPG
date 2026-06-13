# 10 — Future Features (planned / alluded-to)

Features the author has explicitly mentioned wanting, or that the game/story already sets up but hasn't delivered. These are **intended direction**, not yet built. (Sourced from `docs/FUTURE.md` and conversation history.)

## Voice & AI (see `06-voice.md` for build specs)
- **On-the-fly AI character voices** — when a companion produces a live AI reply (already supported as text with an Anthropic key), speak it via streaming TTS in that companion's voice instead of staying silent.
- **Player → game voice interface** — let the player talk to the game: voice commands ("attack", "follow", "go to the inn") and/or spoken conversation with companions via the Web Speech API. Opt-in setting.

## Characters & progression
- **Druid / Warlock evolutions at levels 10 and 20** — an evolution choice per character with a new model + variant moveset per branch. (Level cap stays 10 until built.)
- **Dojo weapon system (Ronin)** — learnable spear and rifle weapon lines, each with its own stat-doubling evolution chain like katana → nodachi → odachi.
- **Playable Ankuspawn character class** — an "Ember theme" character tied to the core lore (large scope; the current four champions are deliberately NOT Ankuspawn to keep the ported kits canon-clean).

## World & content
- **Perspective branches / divergent campaigns** — the three conspiracy endings deliberately split (Ronin's empty road, Warlock's plaza→Ashenveil, Druid's Varenholm). A future build could open each road into its own full campaign perspective. The credits' "four roads" line plants this.
- **The Ashenveil / Academy lower levels as a playable raid zone** — currently a locked teaser + epilogue references.
- **Lords of Pain isometric dungeon zone** — if the full iso pre-rendered asset pack is licensed, skin a future dungeon as its own zone (keep perspectives un-mixed within a zone).
- **Inn interior as a walkable room** (currently a door → dialog overlay with Marlow).
- **Cookie performance minigame** at the Varenholm/inn cameo.

## Systems
- **Co-op multiplayer** — not in this build, but the architecture deliberately keeps all state in one serializable object so a netcode retrofit isn't precluded.
- **Shops / deeper economy** — gold is currently score/flavor + the inn/leave payouts; no shops yet.
- **Equipment / gear slots** — currently belt consumables + passive artifacts only; no worn gear.
- **Portal-network fast travel** — the player lore-appropriately lacks access in this build.
- **Error-capture & send panel** (debug mode) — spec'd in `08-error-log.md`, not yet built.

> **Process rule from `docs/FUTURE.md`:** ideas land in that file (and here) instead of in the codebase. Nothing in this list should be built before the game's publish/funding goals are met unless deliberately prioritized.
