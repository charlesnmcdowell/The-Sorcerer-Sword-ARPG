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
- 2026-06-13 — **Warlock Hunt (wq4) text bank added.** New `warlockHunt` data block in
  `game/src/world/quests.js` (DATA ONLY, no scene/engine changes): `huntFlag: 'q-wq4-the-hunt'`,
  Nyx `launch` (brief + charge + two warlock go-lines), 4 zone targets, and the Varenholm climax.
  Targets (each: name, voice, gift, banner, approach, two measured/malevolent options, a boss
  `pack` with `boss:true`+`deathCol` reusing existing AI types, a `capture` beat, a `cap-*` flag):
    1. BRIAR, THE GREEN ORPHAN — thorn-grove — rotwarden boss — flag `cap-briar`
    2. OSSUARY, THE QUIET BOY — grove-dungeon — necro boss — flag `cap-ossuary`
    3. CINDER, THE ASH-WICK — dragonspine — pyre boss — flag `cap-cinder`
    4. WHISPER, THE NINTH WARD — ashenveil — collector boss — flag `cap-whisper`
    5. (climax) `warlockHunt.varenholm` — COOKIE + THE THORNWARDEN (2 bosses: champ + rotwarden) —
       flag `cap-cookie`. Warlock POV of the crossing (Druid campaign = same scene, her side).
  `warlockHunt.deliver` returns all 5 to Nyx -> `credits: 'THE WARLOCK'S ROAD — five cages...'`.
  Mapped 5 NEW speakers to EXISTING voice ids in `game/tools/voice_config.json` (api key untouched,
  not printed): Briar->Pippa, Ossuary->Quarry Boy, Cinder->Sylvara, Whisper->Veiled Woman,
  Thornwarden->Faelar. (Cookie/Nyx/Warlock already mapped.)
  VERIFY: `node --check quests.js` OK; voice_config JSON.parse OK; `node tests/headless.js` = 5/5
  HEADLESS HARNESS PASS; `node tests/gauntlet.js` = GAUNTLET SWEEP: PASS (druid/warlock/seraph all
  VICTORY 20/20). Data round-trips via require(). NOT YET "VOICES READY TO GENERATE" — hunt dialogue
  exists but is not yet wired into a playable flow, so don't run the generator until wiring is done.
  NEXT STEP (next run — the WIRING, in this order, smallest-safe each): (a) build shared helper
  `WorldScene.tryHuntCapture(key)` that, given a `warlockHunt` target/climax, gates on
  `char==='warlock' && flags['q-wq4-the-hunt']==='active'`, plays approach -> two warlock options ->
  `startEncounter(name,sub,pack,onEnd,{zoneScale:true})` with `boss:true` -> on win shows the
  `banner`+`capture` beat and sets the `cap-*` flag (and floatText "N of 5 caged"). (b) Modify
  `AshenveilScene.nyxDialog()` so the `offer` accept sets `flags['q-wq4-the-hunt']='active'` and shows
  `warlockHunt.launch.brief/charge` INSTEAD of `done()` rolling credits; only when all 5 `cap-*` flags
  set does returning to Nyx play `warlockHunt.deliver.line` -> `CityUI.credits(deliver.credits)`.
  (c) Add a per-zone hunt interactable in Grove/Dungeon/Mountain/Ashenveil/Varenholm scenes (gated to
  warlock+hunt+!cap flag) calling `tryHuntCapture(id)`. (d) Add the "cult coach" in CityScene offering
  Mountain+Varenholm (normally gated) while hunt active, + matching `nextHop`/`objective()` routing in
  questnav.js for the 5 beats. (e) Wire the hunt beats into `Quests.mainFor()` for the warlock journal.
  Re-run node --check + both tests after EACH scene touched.
- 2026-06-13 (run 2) — **Warlock Hunt (wq4) shared helper wired (roadmap step a).** Added
  `WorldScene.tryHuntCapture(key)` + 3 small helpers (`huntIds`, `huntActive`, `huntCaged`)
  to `game/src/scenes/WorldScene.js` (inserted just above the "clearing encounters" section).
  Behavior: gates on `char==='warlock' && flags['q-wq4-the-hunt']==='active'`; resolves a target
  by id from `Quests.warlockHunt.targets` (briar/ossuary/cinder/whisper) or the `varenholm` climax;
  if its `cap-*` flag is already set, shows a "already caged" signDialog and returns true;
  otherwise plays approach -> two warlock options (climax stages Thornwarden then Cookie first) ->
  `startEncounter(banner[0], banner[1], pack, onWin, {zoneScale:true})` reusing the existing
  boss packs (boss:true/deathCol) -> on win sets the `cap-*` flag, shows the `capture` beat, and
  floats "N OF 5 CAGED" (purple) + autosaves. Returns true if the beat ran, false if not a warlock
  on the hunt (so callers can fall through to normal interactables). DATA-SAFE: helper only reads
  fields confirmed present on every target + the climax (verified via a require() field-check:
  banner[2], opt[2], pack, capture, cap-* flag; varenholm protect.line/cookie.line/2-boss pack).
  No engine/scene-flow changes yet — nothing calls it, so the game plays identically.
  VERIFY: `node --check src/scenes/WorldScene.js` PASS (file 32766 B, tail intact, not truncated);
  `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` = GAUNTLET SWEEP:
  PASS (ronin/druid/warlock/seraph all VICTORY 20/20). NOT YET "VOICES READY TO GENERATE" — hunt
  is not yet reachable in play (no scene calls the helper, Nyx still rolls credits).
  NEXT STEP (next run — roadmap step b, smallest-safe): modify `AshenveilScene.nyxDialog()` so the
  `offer` accept, WHEN `flags['q-wq4-the-hunt']` is unset, sets it to `'active'` and shows
  `Quests.warlockHunt.launch.brief` then `.charge` (with the Nyx portrait) INSTEAD of `done()`
  rolling credits; keep the OLD `done()` credits path only as the delivery branch — i.e. when
  returning to Nyx with all 5 `cap-*` flags set, play `warlockHunt.deliver.line` ->
  `CityUI.credits(warlockHunt.deliver.credits)`. Leave a mid-hunt branch ("come back when the cages
  are full") for when the hunt is active but <5 caged. Re-run node --check + both tests after.
  Then step c: add the per-zone hunt interactable (Grove=briar, Dungeon=ossuary, Mountain=cinder,
  Ashenveil=whisper, Varenholm=varenholm), each gated `huntActive() && !flags[cap-*]`, calling
  `this.tryHuntCapture(id)`.
- 2026-06-13 (run 3) — **Warlock Hunt (wq4) nyxDialog wired: launch + mid-hunt + deliver (roadmap step b).**
  Rewrote `AshenveilScene.nyxDialog()` into a 4-state machine (non-warlock refusal unchanged):
  (1) `flags['q-wq4-the-hunt']==='done'` -> the "great hall empty / web drafting your next
  contract" sign. (2) hunt `'active'` AND all 5 `cap-*` caged (briar/ossuary/cinder/whisper +
  cap-cookie via `H.varenholm.flag`) -> DELIVERY: sets hunt `'done'` + `credits-rolled`, plays
  `warlockHunt.deliver.line` -> `CityUI.credits(deliver.credits)`. (3) hunt `'active'` with <5
  caged -> MID-HUNT branch: a generated Nyx line that names the live count ("N of five") and how
  many remain, single "come back when the cages are full" button (no flag change). (4) first
  meeting -> the original reveal1->reveal2->offer chain, but BOTH offer buttons now call new
  `launch()` instead of the old `done()`: launch sets `q-wq3-the-matron='done'` (recruited, keeps
  the City black-carriage via its truthy check) + `q-wq4-the-hunt='active'`, then shows
  `warlockHunt.launch.brief` -> `.charge` -> closes (NO credits). Old `N.done`/`N.credits` single-shot
  path removed from the flow (data left in quests.js, now unused/harmless).
  Flag semantics verified safe against all readers: CityScene:170 + worldmap:25 use a truthy
  `q-wq3-the-matron` check (carriage/label persist through the hunt); questnav:71 routes only on
  `==='active'` so leaving it `'done'` yields no stale arrow (per-beat hunt routing is step d).
  KNOWN GAP (intended, for step c/d): nothing sets any `cap-*` flag yet (the per-zone hunt
  interactables that call `tryHuntCapture` are not placed), so the hunt currently launches and the
  warlock can roam but cannot yet capture -> delivery is unreachable in play until step c lands.
  This is non-breaking: the game plays identically for non-warlocks, and a warlock who recruits Nyx
  simply enters the (empty) hunt instead of rolling credits early.
  VERIFY: `node --check src/scenes/AshenveilScene.js` PASS (248 -> 274 lines, tail braces intact,
  not truncated); data round-trip via eval confirms every field the new code reads exists
  (huntFlag, targets[].flag x4, varenholm.flag, deliver.name/line/go[0]/credits,
  launch.name/brief/charge/go[0]); `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS;
  `node tests/gauntlet.js` = GAUNTLET SWEEP: PASS (ronin/druid/warlock/seraph all VICTORY 20/20).
  NOT YET "VOICES READY TO GENERATE" — hunt dialogue still not reachable in play until the
  per-zone interactables land.
  NEXT STEP (next run — roadmap step c, smallest-safe, one scene at a time): add a per-zone hunt
  interactable that calls `this.tryHuntCapture(id)`, each gated `this.huntActive() && !flags[cap-*]`:
  Grove=briar, Dungeon=ossuary, Mountain(dragonspine)=cinder, Ashenveil=whisper, Varenholm=varenholm.
  Place each near that zone's existing entry/landmark, mirroring how existing interactables are
  pushed (e.g. AshenveilScene `this.interactables.push({x,y,label,fn})`). Run `node --check` +
  BOTH tests after EACH scene touched. After step c the hunt is fully playable end-to-end -> then
  do step d (cult-coach travel to Mountain+Varenholm for the warlock + questnav objective()/nextHop
  routing for the 5 beats) and step e (journal beats into Quests.mainFor), and only THEN write
  "VOICES READY TO GENERATE (warlock)".

- 2026-06-13 (run 4) — **Warlock Hunt (wq4) Grove interactable placed (roadmap step c, 1/5).**
  Added a Briar capture interactable to `game/src/scenes/GroveScene.js`, inserted right after the
  root-hollow (dungeon-mouth) interactable in `create()`. Gated `this.huntActive() && !flags['cap-briar']`
  so ONLY a warlock on the active hunt who hasn't caged Briar sees it (zero change for everyone else).
  Draws a small thorn-thicket (dark circle + radial brambles + a green seed-light) at tile (18,42)
  in the open SW grove and pushes `{x,y,label:'a green child waits in the thorns', fn:()=>this.tryHuntCapture('briar')}`.
  The shared helper (run 2) handles approach -> two warlock options -> boss capture-fight (rotwarden,
  boss:true/deathCol, zoneScale) -> sets `cap-briar` + tallies "N OF 5 CAGED" + autosaves.
  VERIFY: `node --check src/scenes/GroveScene.js` PASS (file 28171 B, tail intact `}` x2, not truncated);
  `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` = GAUNTLET SWEEP: PASS
  (ronin/druid/warlock/seraph all VICTORY 20/20). One zone of five reachable in play now (Grove=Briar);
  hunt still can't be fully delivered until the other 4 interactables land + the cult-coach travel
  (Mountain/Varenholm are gated for the warlock). NOT YET "VOICES READY TO GENERATE".
  NEXT STEP (next run — step c, 2/5): add the OSSUARY interactable to `game/src/scenes/DungeonScene.js`,
  gated `this.huntActive() && !flags['cap-ossuary']`, calling `this.tryHuntCapture('ossuary')`. Place it
  near the dungeon's existing entry/landmark, mirroring how DungeonScene pushes interactables (grep
  `this.interactables.push` there for the local pattern + a free, non-solid tile). Run `node --check` +
  BOTH tests after. Remaining after that: Mountain=cinder, Ashenveil=whisper, Varenholm=varenholm (each
  one scene per run), THEN step d (cult-coach travel for warlock to Mountain+Varenholm + questnav
  objective()/nextHop routing) and step e (journal beats into Quests.mainFor), and only THEN write
  "VOICES READY TO GENERATE (warlock)".

- 2026-06-13 (run 5) — **Warlock Hunt (wq4) Dungeon interactable placed (roadmap step c, 2/5).**
  Added an Ossuary capture interactable to `game/src/scenes/DungeonScene.js`, inserted in `create()`
  just before the "// exit" interactable. Gated `this.huntActive() && !GS.world.flags['cap-ossuary']`
  so ONLY a warlock on the active hunt who hasn't caged Ossuary sees it (zero change for everyone
  else). Draws a small bone-cairn (dark ellipse base + 9 radial bone-shards + a pale skull-light)
  at tile (7,14) in the open lower-left chamber — clear of the dungeon's cave-wall pillars
  (x10-16/x24-31/x16-26 blocks) and away from the three ambush triggers (20,12)/(32,22)/(38,27).
  Pushes `{x,y,label:'a quiet boy sits among the bones', fn:()=>this.tryHuntCapture('ossuary')}`.
  The shared helper (run 2) handles approach -> two warlock options -> boss capture-fight (necro,
  boss:true/deathCol, zoneScale) -> sets `cap-ossuary` + tallies "N OF 5 CAGED" + autosaves.
  Confirmed `Quests.warlockHunt.targets` has the `ossuary` target (id/zone grove-dungeon, flag
  `cap-ossuary`) and the helper's `huntIds()` includes `cap-ossuary`, so resolution + tally are correct.
  VERIFY: `node --check src/scenes/DungeonScene.js` PASS (file 7358 B, tail intact `}` x2, not
  truncated); `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` =
  GAUNTLET SWEEP: PASS (ronin/druid/warlock/seraph all VICTORY 20/20). Two zones of five reachable
  in play now (Grove=Briar, Dungeon=Ossuary). NOT YET "VOICES READY TO GENERATE".
  NEXT STEP (next run — step c, 3/5): add the CINDER interactable to the Mountain/Dragonspine scene
  (find it: grep scenes for 'dragonspine'/'Mountain'/'Cinder' — likely `MountainScene.js` or
  `DragonspineScene.js`), gated `this.huntActive() && !flags['cap-cinder']`, calling
  `this.tryHuntCapture('cinder')`. Place near that zone's existing entry/landmark, mirroring how
  that scene pushes interactables (grep `this.interactables.push` for the local pattern + a free,
  non-solid tile). NOTE: the Mountain is normally gated for the warlock, so reaching Cinder in play
  also needs the cult-coach travel (step d) — but place the interactable now regardless; it's inert
  until travel lands. Run `node --check` + BOTH tests after. Remaining: Ashenveil=whisper,
  Varenholm=varenholm (one scene per run), THEN step d (cult-coach travel for warlock to
  Mountain+Varenholm + questnav objective()/nextHop routing) and step e (journal beats into
  Quests.mainFor), and only THEN write "VOICES READY TO GENERATE (warlock)".

- 2026-06-13 (run 6) — **Warlock Hunt (wq4) Mountain interactable placed (roadmap step c, 3/5).**
  Added a Cinder capture interactable to `game/src/scenes/MountainScene.js` (zone `dragonspine`),
  inserted in `create()` right after the SKYREACH SHRINE interactable push. Gated
  `this.huntActive() && !flags['cap-cinder']` so ONLY a warlock on the active hunt who hasn't yet
  caged Cinder sees it (zero change for everyone else). Draws a small ash-wick scene at tile
  (34,18) — an open center-spine tile clear of the edge cliffs, the scattered crags
  ([8,8],[22,20],[40,26],[50,8],[10,36],[38,12]), the shrine (32,4), and the W_DEFS pack spots:
  a dark ring of melt-water, an ash body, two ember eyes, and rising sparks + a warm light.
  Pushes `{x,y,label:'a fire that will not go out sits in the melt', fn:()=>this.tryHuntCapture('cinder')}`.
  The shared helper (run 2) handles approach -> two warlock options -> boss capture-fight (pyre,
  boss:true/deathCol, zoneScale) -> sets `cap-cinder` + tallies "N OF 5 CAGED" + autosaves.
  Confirmed via require(): `Quests.warlockHunt.targets` has the `cinder` target (id/zone
  dragonspine, flag `cap-cinder`, pyre boss pack) and the helper resolves it by id; tally counts it.
  VERIFY: `node --check src/scenes/MountainScene.js` PASS (file 19062 B, tail intact `}`/`}`, not
  truncated); `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` =
  GAUNTLET SWEEP: PASS (ronin/druid/warlock/seraph all VICTORY 20/20). Three zones of five now have
  a placed interactable (Grove=Briar, Dungeon=Ossuary, Mountain=Cinder). NOTE: Mountain is normally
  gated for the warlock, so Cinder is inert in play until the cult-coach travel lands (step d) — the
  interactable is correct and harmless until then. NOT YET "VOICES READY TO GENERATE".
  NEXT STEP (next run — step c, 4/5): add the WHISPER interactable to
  `game/src/scenes/AshenveilScene.js`, gated `this.huntActive() && !flags['cap-whisper']`, calling
  `this.tryHuntCapture('whisper')` (target id `whisper`, zone ashenveil, collector boss, flag
  `cap-whisper`). Place it near an existing Ashenveil landmark on a free non-solid tile — grep
  `this.interactables.push` in AshenveilScene for the local pattern + a clear tile, and avoid the
  Nyx/great-hall trigger so the hunt interactable and `nyxDialog()` don't overlap. Run `node --check`
  + BOTH tests after. Remaining: Varenholm=varenholm (the 2-boss climax, one more run), THEN step d
  (cult-coach travel for the warlock to Mountain+Varenholm + questnav objective()/nextHop routing for
  the 5 beats) and step e (journal beats into Quests.mainFor), and only THEN write
  "VOICES READY TO GENERATE (warlock)".

- 2026-06-13 (run 7) — **Warlock Hunt (wq4) Ashenveil interactable placed (roadmap step c, 4/5).**
  Added a Whisper capture interactable to `game/src/scenes/AshenveilScene.js`, inserted in
  `create()` just before the "player + the carriage home" section. Gated
  `this.huntActive() && !flags['cap-whisper']` (the `flags` local set at create() top) so ONLY a
  warlock on the active hunt who hasn't caged Whisper sees it (zero change for everyone else).
  Draws a blindfolded grey-shift listener in a fallow row at tile (16,28) — open lower-middle
  field, clear of the Academy block (x28-43/y5-13), the three hedge blocks ([8,10,7,4],
  [34,18,7,5],[14,22,6,4]), and the existing interactables (working dead 10,14 / boundary 38,24 /
  carriage 24,30 / Nyx door ~35,13): a furrow line, grey body, pale cocked head, academy-green
  bound-eyes band, and 4 concentric "what she hears" rings. Pushes
  `{x,y,label:'a blindfolded woman listens to an empty field', fn:()=>this.tryHuntCapture('whisper')}`.
  The shared helper (run 2) handles approach -> two warlock options -> boss capture-fight
  (collector, boss:true/deathCol #b070f0, hp760, zoneScale) -> sets `cap-whisper` + tallies
  "N OF 5 CAGED" + autosaves. Confirmed via require(): `Quests.warlockHunt.targets` has the
  `whisper` target (id/zone ashenveil, collector boss, flag `cap-whisper`) and the helper resolves
  it by id; tally counts it. The hunt interactable does NOT overlap the Academy door trigger
  (nyxDialog), so capturing Whisper and recruiting/delivering to Nyx stay independent.
  VERIFY: `node --check src/scenes/AshenveilScene.js` PASS (file 20001 B, tail braces intact, not
  truncated); `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` =
  GAUNTLET SWEEP: PASS (ronin/druid/warlock/seraph all VICTORY 20/20). Four zones of five now have
  a placed interactable (Grove=Briar, Dungeon=Ossuary, Mountain=Cinder, Ashenveil=Whisper).
  NOTE: Mountain+Varenholm are normally gated for the warlock, so Cinder is inert in play until the
  cult-coach travel lands (step d). NOT YET "VOICES READY TO GENERATE".
  NEXT STEP (next run — step c, 5/5, the CLIMAX): add the VARENHOLM interactable to
  `game/src/scenes/VarenholmScene.js`, gated `this.huntActive() && !flags['cap-cookie']` (NOTE the
  climax flag is `cap-cookie`, set via `Quests.warlockHunt.varenholm.flag` — confirm the exact key
  with require() before gating), calling `this.tryHuntCapture('varenholm')`. The helper already
  special-cases the `varenholm` climax (stages Thornwarden THEN Cookie, 2 bosses champ+rotwarden).
  Place it near Varenholm's guild hall / Cookie ally landmark on a free non-solid tile — grep
  `this.interactables.push` in VarenholmScene for the local pattern + a clear tile, and avoid the
  existing Cookie guildHall trigger so the warlock-POV capture and the druid-POV ally scene don't
  collide (they are mutually exclusive by `char`, but keep tiles distinct). Run `node --check` +
  BOTH tests after. AFTER step c is complete (all 5 placed): step d (cult-coach travel in
  CityScene letting the warlock reach Mountain+Varenholm while hunt active + questnav
  objective()/nextHop routing for the 5 beats) and step e (journal beats into Quests.mainFor),
  and ONLY THEN write "VOICES READY TO GENERATE (warlock)".

- 2026-06-13 (run 8) — **Warlock Hunt (wq4) Varenholm climax interactable placed (roadmap step c, 5/5 — step c COMPLETE).**
  Added the Cookie+Thornwarden capture interactable to `game/src/scenes/VarenholmScene.js`,
  inserted in `create()` just before the "// coach home" interactable push. Gated
  `this.huntActive() && !flags['cap-cookie']` (flag confirmed via require(): the climax key is
  `cap-cookie`, == `Quests.warlockHunt.varenholm.flag`; `flags` is the `GS.world.flags` local set
  at create() top) so ONLY a warlock on the active hunt who hasn't yet caged Cookie sees it (zero
  change for everyone else — the druid POV never enters this branch since `huntActive()` requires
  `char==='warlock'`). Draws the climax tableau at tile (16,24) — open ground WEST of the guild,
  clear of the guild block (x20-34/y20-28), the statue (27,16), the south coach gap, and the
  player spawn/coach (~28,32-34): a living wall of thorns, COOKIE behind it (red dancer + red
  ribbon), and THE THORNWARDEN standing guard in front (green-brown bulk + a crown of brambles).
  Pushes `{x,y,label:'a red dancer waits behind a wall of thorns', fn:()=>this.tryHuntCapture('varenholm')}`.
  The shared helper (run 2) already special-cases the `varenholm` climax: stages the Thornwarden
  THEN Cookie (2 bosses: champ + rotwarden, boss:true/deathCol, zoneScale) -> on win sets
  `cap-cookie` + tallies "5 OF 5 CAGED" + autosaves. Tile is distinct from the existing guildHall
  door trigger (door ~27*T,28*T) and the druid-POV Cookie spawn (~28.5,28.6), so the warlock-POV
  capture and the druid-POV ally scene never collide (also mutually exclusive by `char`).
  VERIFY: `node --check src/scenes/VarenholmScene.js` PASS (file 15197 B, tail intact `}` x2, not
  truncated); `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` =
  GAUNTLET SWEEP: PASS. NOTE on a one-off gauntlet FAIL: the FIRST gauntlet run reported druid
  TIMEOUT at fight 7/50min — this is pre-existing sim flakiness (the druid sweep runs near the
  50-simMin cap: re-ran 3x, all VICTORY 20/20, simMin 29-40), NOT caused by this change: the
  gauntlet only `require`s `src/combat/pit.js` and never loads any scene file, and this change is
  purely additive + char-gated. No combat/engine files were touched.
  STATUS: **step c COMPLETE — all 5 hunt interactables now placed** (Grove=Briar, Dungeon=Ossuary,
  Mountain=Cinder, Ashenveil=Whisper, Varenholm=Cookie/Thornwarden). Grove/Dungeon/Ashenveil are
  reachable in play now; Mountain+Varenholm remain inert until the cult-coach travel lands (step d),
  since those zones are normally gated for the warlock. NOT YET "VOICES READY TO GENERATE" — the
  hunt is not yet deliverable end-to-end until travel (step d) lets the warlock reach all 5 zones.
  NEXT STEP (next run — roadmap step d, smallest-safe): add a "cult coach" travel interactable in
  `game/src/scenes/CityScene.js` that, while the warlock's hunt is active (`huntActive()`), offers
  destinations the warlock is normally gated out of — MOUNTAIN (dragonspine) and VARENHOLM — via a
  small CityUI.dialog of buttons that `this.scene.start('MountainScene'|'VarenholmScene')` (grep
  CityScene for the existing carriage/`scene.start` + black-carriage `q-wq3-the-matron` pattern to
  mirror placement/gating; set the same `world.cityFromGrove`/zone bookkeeping those transitions
  use). Place the coach near the existing City carriage/gate landmark on a free non-solid tile.
  THEN extend `QuestNav.objective()`/`nextHop` in `game/src/core/questnav.js` to route the 5 hunt
  beats (briar->grove, ossuary->dungeon, cinder->mountain, whisper->ashenveil, cookie->varenholm,
  then deliver->ashenveil/Nyx) so the journal AUTO-arrow points the warlock to the next uncaged
  target. Run `node --check` + BOTH tests after EACH file touched. After step d the hunt is
  playable end-to-end; then step e (journal beats into `Quests.mainFor`), and ONLY THEN write
  "VOICES READY TO GENERATE (warlock)".

- 2026-06-13 (run 9) — **Warlock Hunt (wq4) cult coach placed (roadmap step d, travel part).**
  Added `addCultCoach()` + `cultCoachDialog()` to `game/src/scenes/CityScene.js` and wired the call
  into the guild block (right after `addHuntCoach()`), gated `P.char === 'warlock' && this.huntActive()`
  so ONLY a warlock on the active hunt sees it (zero change for everyone else). The coach is a 3rd
  vehicle by the guild door at a DISTINCT slot — grim/Ashenveil coach at dx-122, BLACK carriage at
  dx+88, new CULT COACH at dx-30 (graphic dx-58..dx-2, light dx-30): no overlap. Tapping it opens a
  `CityUI.dialog('THE CULT COACH', ...)` with three buttons: To DRAGONSPINE -> `scene.start('MountainScene')`,
  To VARENHOLM -> `scene.start('VarenholmScene')`, and a Not-yet close. Both target scenes self-manage
  their own entry (`MountainScene` sets `zone='dragonspine'`; `VarenholmScene` sets `q-mq6-the-dancer`
  active on create), so the coach does NOT touch those flags. This UNBLOCKS the two gated zones:
  Cinder (Mountain) and Cookie/Thornwarden (Varenholm) interactables (placed runs 6 & 8) are now
  reachable by the warlock -> **the 5-cage hunt is completable end-to-end in MANUAL play**
  (capture all five -> return to Nyx -> `warlockHunt.deliver` -> credits, per run 3's nyxDialog).
  VERIFY: `node --check src/scenes/CityScene.js` PASS (file 29103 B, tail intact `}`x2, not truncated);
  `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` = GAUNTLET SWEEP: PASS
  (ronin/druid/warlock/seraph all VICTORY 20/20). No combat/engine files touched; change is additive
  + char-gated.
  DECISION / KNOWN GAP (intentional, deferred to next run): I did NOT add the QuestNav AUTO routing
  for the hunt beats this run, because it is genuinely fiddly and risky to do safely. Two problems to
  solve next run: (1) `QuestNav.nextHop()` city->dragonspine = the north gate (1120,24) and
  city->varenholm = the heartland-coach tile (1656,744) — neither is the warlock's path; the warlock
  reaches both ONLY via the new cult coach at (dx-30, dy+40). (2) AUTO (`drive`/`updateDialogs`)
  always clicks the FIRST dialog option, but the cult coach has THREE destinations, so it can't pick
  the right one from a multi-button menu. So AUTO would mis-route the warlock for Cinder/Cookie. The
  hunt is fully playable manually right now; AUTO just won't auto-walk the two coach legs yet.
  NEXT STEP (next run — step d, routing part, smallest-safe): make the hunt AUTO-navigable. Recommended
  approach: in `QuestNav.objective()` add a warlock-hunt branch (when `f['q-wq4-the-hunt']==='active'`)
  that returns the next UNCAGED target in order — briar(thorn-grove 18*T,42*T) / ossuary(grove-dungeon
  7*T,14*T) / cinder(dragonspine 34*T,18*T) / whisper(ashenveil 16*T,28*T) / cookie(varenholm 16*T,24*T)
  -> then deliver to Nyx(ashenveil 1136,416); all caged. For the two CULT-COACH legs (dragonspine,
  varenholm) DON'T rely on `nextHop` from the city — instead, when `zone==='karridge-city'` and the
  target zone is dragonspine/varenholm, return the cult-coach tile as an interact objective, AND split
  the coach into per-destination behavior so AUTO's first-option click lands the right ride (e.g. a
  hunt-aware single-destination coach, or special-case the cult-coach interact in `drive` to pick the
  destination matching the active objective). Verify the AUTO walk for a warlock with the hunt active
  reaches each target. Run `node --check` + BOTH tests after each file touched. THEN step e (journal
  beats into `Quests.mainFor`), and ONLY THEN write "VOICES READY TO GENERATE (warlock)".

- 2026-06-14 (run 10) — **Warlock Hunt (wq4) AUTO routing wired (roadmap step d, routing part — step d COMPLETE).**
  Made the 5-cage hunt fully AUTO-navigable end-to-end. Two files, both additive + warlock-gated:
  (1) `game/src/core/questnav.js` — added a warlock-hunt branch to `QuestNav.objective()`
  (fires only when `char==='warlock' && f['q-wq4-the-hunt']==='active'`, placed AFTER the existing
  wq1-wq3 epilogue block so it never shadows it). It walks the fixed order
  briar(thorn-grove 18,42) -> ossuary(grove-dungeon 7,14) -> cinder(dragonspine 34,18) ->
  whisper(ashenveil 16,28) -> cookie(varenholm 16,24), returning the next UNCAGED target's tile
  as an interact objective; when all 5 `cap-*` flags are set it returns the deliver objective
  (Nyx, ashenveil 1136,416). KEY ROUTING RULE: Dragonspine + Varenholm are gated for the warlock,
  reachable ONLY via the cult coach in the city (1538,744 = guildDoor dx-30 / dy+40). So for a gated
  target, when the warlock is NOT already in that zone, the objective returns the CULT-COACH tile
  (zone karridge-city, interact) instead of the gated portal — this funnels the warlock to the city
  from ANY zone, then the coach scene.starts the gated zone; once physically in the gated zone the
  branch returns the direct in-zone target tile. (2) Added 3 funnel hops to `QuestNav.nextHop` HOPS:
  `thorn-grove->ashenveil` (1088,1572 = grove's city exit), `dragonspine->ashenveil` (864,1380 =
  spine exit, which lands in the GROVE), and `varenholm->ashenveil` (896,1088 = coach home -> city).
  These are needed because the cinder->whisper leg is dragonspine -> grove -> city -> ashenveil and
  the deliver leg is varenholm -> city -> ashenveil; without them AUTO got STUCK leaving those zones.
  All 3 keys are warlock-hunt-only requests (no other char's objective ever targets ashenveil from
  those zones), so existing routing is untouched. (3) `game/src/scenes/CityScene.js` —
  `cultCoachDialog()` now ORDERS its two destination buttons by the next uncaged gated target
  (`!flags['cap-cinder']` -> Dragonspine first, else Varenholm first) so AUTO/FULL (which always
  clicks the first option) boards the correct ride. The "Not yet" close stays last.
  VERIFY: `node --check` PASS on both files (questnav 13484 B, CityScene 29439 B, tails intact, not
  truncated). objective() exercised via a vm-shim across the full hunt with the main quest done +
  Nyx recruited: every leg resolves correctly and a hop-trace simulation shows the AUTO walk is
  briar: ashenveil->city->grove; ossuary: grove->dungeon; cinder: dungeon->grove->city->CULT COACH;
  whisper: dragonspine->grove->city->ashenveil; cookie: ashenveil->city->CULT COACH; deliver:
  varenholm->city->ashenveil->Nyx — NO stuck states and it NEVER uses the gated grove->dragonspine
  portal (2216,320). Druid regression check: druid post-mq5 still routes to the heartland coach
  (unchanged). `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS. `node tests/gauntlet.js`: first
  sweep showed a druid TIMEOUT at fight 15 (simMin 50.0 = the cap) — this is the SAME pre-existing
  druid-sweep flakiness noted in run 8 (druid runs near the 50-simMin cap), NOT this change: the
  gauntlet only `require`s `src/combat/pit.js` and loads neither questnav.js nor CityScene.js. Re-ran
  3x: ALL VICTORY 20/20 (ronin/druid/warlock/seraph), GAUNTLET SWEEP: PASS each time.
  STATUS: **the warlock hunt is now playable AND AUTO-navigable end-to-end** — recruit Nyx (launches
  the hunt) -> AUTO/journal walks the warlock through all 5 captures (cult coach handles the 2 gated
  zones) -> return to Nyx delivers the cages -> `warlockHunt.deliver` credits. Speakers already mapped
  to existing voice ids in run 1, and a fresh check confirms all 7 hunt speakers
  (Briar/Ossuary/Cinder/Whisper/Thornwarden/Cookie/Nyx) are mapped and the warlockHunt text bank has
  ZERO placeholders. The only remaining roadmap item (step e, journal beats) is UNVOICED quest-log
  text and will not add or change any spoken line.
  VOICES READY TO GENERATE (warlock) — all warlock-hunt spoken dialogue is written, every speaker is
  mapped to an existing voice id in voice_config.json, and the hunt is playable end-to-end; Hiro can
  run the voice generator for the warlock now. (Step e only changes the on-screen journal list.)
  NEXT STEP (next run — roadmap step e, the LAST warlock step, smallest-safe): wire the 5 hunt beats
  into the warlock journal so the player sees them. Find how the journal builds the main-quest list
  (grep `mainFor` in `game/src/world/quests.js` and its callers in the journal UI — likely a scene/UI
  that renders `Quests.mainFor(char)`), then add a warlock-hunt case that, when
  `f['q-wq4-the-hunt']==='active'`, lists the 5 targets with their caged/uncaged state (use the
  `cap-*` flags) + the deliver beat, mirroring the existing main-quest entry shape EXACTLY (same
  fields/format the journal already consumes — inspect one existing entry first). Keep it DATA-ONLY
  if possible (no new UI). Run `node --check` + BOTH tests after. ONLY AFTER step e lands and the
  journal shows the hunt, write "VOICES READY TO GENERATE (warlock)" so Hiro can run the generator.
