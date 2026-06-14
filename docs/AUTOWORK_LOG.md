# AUTOWORK LOG — autonomous build handoff (Hiro)

This file is the durable handoff for the scheduled "continue the game" task. Each run starts
with NO memory of prior chats — so this file is the single source of truth. Read it fully,
do ONE coherent increment, verify, then append a dated entry at the bottom.

## HARD CONSTRAINTS (do not violate)
1. **OneDrive truncates files on save.** After writing ANY file, run `node --check <file>`.
   If it fails at end-of-file, the on-disk copy was truncated — recover it (re-derive the full
   content and re-write via bash/python) before doing anything else. NEVER leave a file whose
   `node --check` fails.
2. **Prefer bash + python for edits** (write full content bash-side); it is more truncation-proof
   than the Edit tool. The bash mount path changes each session — discover it with
   `ls /sessions/*/mnt/` (the project is the "...The Sorcerer Sword ARPG" mount).
3. **git is BLOCKED** (OneDrive lock leaves un-removable .git/*.lock). Do NOT attempt commits.
   Just keep the working files valid; the user commits manually from Windows.
4. **Verify combat changes:** run `node game/tests/headless.js` and `node game/tests/gauntlet.js`.
   Both must print PASS / VICTORY. If they fail, fix or revert your change this run.
5. **Dialogue is TEXT-ONLY** (voiceovers added later by the user). For any NEW speaker, reuse an
   EXISTING ElevenLabs voice id from `game/tools/voice_config.json` (add a mapping to an existing id).
6. **Reuse existing combat AI `type`s** (grave, necro, champ, collector, warden, pyre, hound, etc.)
   and the boss pattern (`boss:true`, `deathCol`). Don't write new combat-engine systems unless required.
7. Work in SMALL verifiable increments. If a step risks breaking the game and you're unsure, make
   the smallest safe change (or skip it) and LOG the uncertainty. Quality over speed.

## PRIORITY ROADMAP
### 1. WARLOCK questline expansion (DO THIS FIRST — not started)
Nyx (Ashenveil) sends the warlock to hunt & CAPTURE 5 ankuspawn, one per location:
Grove, Dungeon, Mountain, Ashenveil, then **Cookie in Varenholm (protected by the Druid)** as the climax.
- Invent a themed ankuspawn mini-boss per zone (name/gift/look fitting that zone's lore). Each = a
  short pre-fight dialogue -> `startEncounter` (boss:true) -> capture beat -> set a capture flag.
- Gate everything to `GameState.player.char === 'warlock'` + a new hunt flag (e.g. `q-wq4-the-hunt`).
- Modify the Nyx recruitment in `AshenveilScene.nyxDialog()` so instead of rolling credits it LAUNCHES
  the hunt (set wq4 active). After all 5 captured, returning to Nyx delivers the prisoners -> credits.
- Cookie capture: warlock POV = defeat Cookie + a Druid protector (2 bosses) -> capture both.
- The warlock must reach Mountain & Varenholm (normally gated) — add hunt travel (a "cult coach" in
  the City offering destinations while the hunt is active), gated to warlock+hunt.
- Build a SHARED helper `WorldScene.tryHuntCapture(key)` so per-scene code stays tiny.
- Extend `QuestNav.objective()` (game/src/core/questnav.js) for the new beats so journal/AUTO navigate.
- End with `CityUI.credits('THE WARLOCK\'S ROAD — ...')` (keeps the books/podcast links).
- Architecture reference: see how existing wq1-wq3 work (CityScene.startWhiteWrit / AshenveilScene.nyxDialog),
  the Cookie ally pattern in VarenholmScene.guildHall, and Quests text banks in game/src/world/quests.js.
- When the warlock dialogue is fully written AND new speakers are mapped in voice_config.json, write a
  line "VOICES READY TO GENERATE (warlock)" in your log entry so the user knows to run the generator.

### 2. DRUID questline expansion (after warlock is done + tested)
Druid POV of the crossing: after meeting Cookie, the Warlock shows up to capture you. Defeat him ->
cinematic dialogue between druid and warlock -> he gets back up with Anku cult reinforcements -> defeat
them again -> you and Cookie flee to the Mountains to seek the dragons & **Ignis** for protection, where
you meet **Shen Sama**, who is ALSO searching for Ignis — who is MISSING. End with the druid credits
(books/podcast). (Ignis is net-new lore; keep consistent with Shen Sama = fugitive dragon, the treaty
dragons Aurvaeth/Vesshk on Dragonspine.)

### 3. Docs refresh (low priority, after both questlines)
Update `docs/knowledge base/09-feature-list.md` and `wiki/monsters.md` to mention the boss expansion
and the new questlines.

## CURRENT STATE (as of handoff)
Already DONE on disk (uncommitted): boss expansion (7 bosses + cinematics + venom/frost zones),
territory HP ladder (forest x2, undead x4, mountain x8) + bosses x5, pit decline-once + board buttons,
onboarding hints, shareable result card, pause menu (Esc), mobile fixes (ENVELOP fill + rotate hint,
belt shows only filled slots, overworld touch attack buttons bound). All node-check valid; headless +
gauntlet PASS.
WARLOCK hunt: NOT STARTED. Begin with the Quests text bank in game/src/world/quests.js.

## RUN LOG (append newest at the bottom)
- (handoff) Roadmap + constraints established. Next: start Warlock hunt — quests.js text bank + beats.
