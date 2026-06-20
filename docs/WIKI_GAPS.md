# WIKI GAP REPORT

> Generated 2026-06-19 (automated maintenance run). Cross-checks the auto-wiki
> (`docs/knowledge base/wiki/`) against the live game data (`game/src/world/quests.js`,
> `companions.js`, `combat/pit.js`) and `docs/LORE_BIBLE.md`. No lore is invented here —
> every gap below points at content that already exists in source.

## What this run already CLOSED (generator enhanced + regenerated)

`game/tools/gen_wiki.js` previously only surfaced `Quests.main`, `Quests.seraph`,
`Quests.warlockEpilogue`, the guild board, and the companions. Large data-driven
questlines that exist in `quests.js` were never emitted. The generator now walks the
nested quest data and self-fills them. After `node game/tools/gen_wiki.js`:

- **quests.md** now has three new auto sections:
  - **The Warlock's Hunt (wq4)** — the five capture targets (Briar, Ossuary, Cinder,
    Whisper, and Cookie + the Thornwarden), regions, gifts, capture flags, delivery.
  - **The Crossing (dq)** — the Druid's four-phase Varenholm crossing + flags.
  - **The Ronin's Reckoning (rq)** — Vorathiel, the defiled Skyreach shrine, the Seraphim
    warning, gates and flags. (This entire questline was previously absent from the wiki.)
- **characters.md** now has **Named story & cameo characters** — auto-collected from every
  `name:` speaker across the story branches (22 names incl. Vorathiel, Lady Nyx, Shen Sama,
  the Pale Courier, the five capture targets, the five Spine duel champions, the Cult Warlock).
- **monsters.md** now has **Questline & duel encounter packs** — auto-collected from every
  `pack:` in the quest data, so Vorathiel (`beast` boss), the defiled-temple gate
  (`grave` destructible + demon wave), the capture-target bosses, and the seraph duels are
  all listed and self-update with the data.

## Remaining gaps — CANNOT be auto-filled (content lives in prose, not in `name:`/`pack:` fields)

These named characters exist in the game text but are embedded in dialogue strings, so the
generator's `name:`-walker can't see them. They should be added by hand to characters.md
(curated "Key NPCs" / a new "Cameos" block). Source locations given; do not fabricate beyond them.

- **DREN** — the Pit's previous champion who vanished (the mq1 hook). Source:
  `Quests.innkeeper.rumorFree`, `Quests.optTable.marlowAsk.ronin`. Central to the main quest, absent from the wiki.
- **BELLOW** — the Pit announcer (offers silver to leave after fight 3). Already in the curated
  "Key NPCs" list; keep, but it is not in the auto list because it has no `name:` field.
- **SER HALDRIC** — White Order paladin who serves the kill-writ (warlock epilogue). Source:
  `Quests.warlockEpilogue.ambush.haldric`.
- **THE INQUISITOR & THE DEMON HUNTER** — the other two White-Order writ-servers. Source:
  `Quests.warlockEpilogue.ambush.sallow` (inquisitor) and `.haldric` (names the demon hunter).
- **IGNIS, the hearth-wyrm / "the Firebird"** — the missing fire-dragon shelter that drives the
  Crossing and is named in the Ronin's Reckoning canon notes. Source: `Quests.druidCrossing.flight/shen`,
  `Quests.roninEnding` header canon block, LORE_BIBLE §5. Cameo, prose-only.
- **SENSEI OKADA** — the dojo master (Ronin weapon-line questline). Source: `Quests.dojo.teacher`.
  Excluded from the auto list because `Quests.dojo` is design-data, not a story branch.
- **AnkuNyx / Kenji (THE DRAGON EMPEROR)** — finale cameo (and secretly the Ronin). Already in the
  curated "Key NPCs"; not in the auto list (title is `cult.finale.title`, not a `name:`).

## Remaining gaps — QUESTS not represented

- **Companion recruit mini-quests** are not documented anywhere in the wiki. Each has a real in-world
  hook in `companions.js` that the wiki should at least index:
  - Brakka → clearing the grove-dungeon Keeper (his lost merc Dorga); recruit flag `dg-amb2`.
  - Vexa → the "hum-vial" / strength-potion trade (`recruitVial`/`recruitBrew`).
  - Dorian, Faelar, Sylvara, Pippa → `scriptedOnly` (no dedicated recruit flow) — worth stating explicitly.
  - (See also the NEW organic side-quests added this run — `Quests.companionQuests`, hub = the End Keeper.)
- **Varenholm epilogue (mq6) detail** — the Saltcellar job and the Cookie befriend/cult-ambush beats
  (`Quests.varenholm.*`) are only implied by the "Endings" line in quests.md. A short section would help.

## Remaining gaps — MONSTERS (curated tables now partially superseded)

- The **curated** "Named bosses" table in monsters.md still omits the Ronin's Reckoning bosses
  (**Vorathiel**, human-form `beast`; **the Skyreach defiled-temple gate**, `grave` destructible +
  brute/pyre wave). The NEW auto "Questline & duel encounter packs" table covers them, but the curated
  table should be updated by hand for consistency (it carries the lore flavor text the auto table lacks).
- A few auto-encounter rows show an internal key as the label (`varenholm`, `rematch`, `temple`) because
  those pack-bearing objects have no `name:` field. Cosmetic; if desired, give those objects a `name:`
  in `quests.js` (e.g. `temple` → "THE SKYREACH GATE") and the wiki label fixes itself.

## How to refresh

```
node game/tools/gen_wiki.js
```
Everything under "What this run CLOSED" self-updates from source. The "Remaining gaps" above are the
items a human (or a later wiring run that adds `name:` fields) still needs to address.
