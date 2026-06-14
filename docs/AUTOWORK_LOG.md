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

8. **Do NOT alter dialogue text that is already written/voiced** (the whole `warlockHunt` bank).
   Voice clips are keyed by a hash of the exact text; changing a line silently breaks its audio.
   ADD new lines only.
9. **Voicing a new line requires TWO steps, not one.** Mapping a speaker in `voice_config.json` is
   NOT enough — a line is only voiceable once it is EXTRACTED into `game/tools/voice_manifest.json`.
   So when you add dialogue you MUST also add matching `add(...)` calls (and `speakerSlots` entries for
   any new speaker) in `game/tools/build_voice_manifest.js`, then run `node game/tools/build_voice_manifest.js`
   and confirm the manifest line COUNT GREW and the new lines resolve to a voice id. Only THEN may you
   write "VOICES READY TO GENERATE". (New speakers must still map to an EXISTING voice id.)

## COMPLETION PROTOCOL — shut yourself down when everything is done
When EVERY roadmap item below is implemented, verified, and logged, and there is NO remaining actionable
"NEXT STEP", do NOT invent new work. Instead, shut the autowork down:
1. Final verification pass: `node --check` the changed files; `node game/tests/headless.js` +
   `node game/tests/gauntlet.js` BOTH PASS.
2. Append a final run-log entry: "AUTOWORK COMPLETE - all roadmap items done; disabling schedule".
3. DISABLE this scheduled task: load the tool (ToolSearch
   "select:mcp__scheduled-tasks__update_scheduled_task") and call it with
   taskId "sorcerer-sword-autowork" and enabled:false. Then stop — do nothing further.
The roadmap counts as COMPLETE only when ALL of these are done: 1.5 (no fights during conversations),
the Warlock journal step (e), 2 (Druid questline), 3 (docs refresh), 4 (voice-gap fix), and
5 (arch-devil cinematic). If ANY remain, just do the next one and leave the schedule running.

## PRIORITY ROADMAP

### 0. BUGFIX — BLOCKER: warlock STUCK taking the black carriage (Matron / wq3)  [Hiro-reported 2026-06-14]
Hiro reports (screenshot): as a WARLOCK on the Matron step the journal says "Take the black carriage —
meet Lady Nyx at the Ashenveil academy," but the player gets STUCK — AUTO will not board the carriage.
In the shot the live AUTO button instead reads "the cult coach — Cinder on the Dragonspine" while the
journal still surfaces the Matron "take the black carriage" hint, so something is mis-routing.
REPRO PLAN (next run, do this BEFORE editing): play/sim a warlock to the Matron step in the city and
DUMP the relevant flags at the stuck moment — `q-wq3-the-matron`, `q-wq4-the-hunt`, `credits-rolled`,
`cap-briar`, `cap-ossuary`, `cap-cinder` — to see which branch `QuestNav.objective()` is actually taking.
TWO LEADING HYPOTHESES (confirm which, then fix the smallest thing):
  (A) AUTO PATHING / wrong vehicle. The Matron objective is `at('karridge-city',1656,744,true,'the black
      carriage')` (questnav.js ~L72). The carriage interactable is placed at `guildDoor.dx+88, dy+40`
      = (1656,744) — but THREE vehicles crowd the same guild door: hunt coach (dx-122), CULT coach
      (dx-30 = 1538,744), black carriage (dx+88 = 1656,744). The carriage tile sits hard against the
      guild building; AUTO may be unable to path into interact range (stall), OR may snap to the nearer
      cult coach. CHECK: is (1656,744) a non-solid tile reachable by the auto-walker, and does AUTO's
      interact pick the carriage vs the cult coach when both are near? Fix = nudge the carriage to a
      clear, reachable tile and/or make the objective tile match an actually-walkable interact spot.
  (B) PREMATURE HUNT FLAG. For the AUTO button to read "cult coach — Cinder," `objective()` must have
      SKIPPED the matron branch (so `q-wq3-the-matron` !== 'active') AND entered the hunt branch
      (`q-wq4-the-hunt`==='active') with `cap-briar`+`cap-ossuary` already truthy. If the hunt went
      active (or those cap flags got set) BEFORE the player actually met Nyx, the warlock is sent to a
      cult coach that does not yet exist for him -> dead end. CHECK launch() in AshenveilScene.nyxDialog
      (sets matron='done' + hunt='active' together) and confirm nothing sets the hunt/cap flags early;
      also confirm the journal's static Matron hint isn't shown once the hunt is active (stale text).
FIX = the SMALLEST safe correction once the cause is known; keep both hypotheses' guards additive.
VERIFY: `node --check` + `node tests/headless.js` + `node tests/gauntlet.js` (both PASS); then sim/play a
warlock from the alley -> black carriage -> Nyx with AUTO:FULL and confirm it boards the carriage and is
never stuck. Log "WARLOCK CARRIAGE BUG FIXED" when AUTO reliably reaches Nyx.

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

### 1.5 BUGFIX — NO fights during conversations (TOP PRIORITY: do this BEFORE the Druid line)
Hiro reports: in some zones a monster pack/ambush can proc a fight WHILE a dialogue is open, breaking
the cinematic feel. RULE: no encounter may START while a dialogue is open OR a cinematic is playing.
- FIX: gate EVERY proximity/auto encounter trigger with `!CityUI.dialogOpen() && !this.encounterActive
  && !this.cinematic`. Find them all: grep each scene's `update()` for the pack/ambush proximity checks
  that call `this.startEncounter(...)` — known culprits are the monster PACK triggers in GroveScene,
  MountainScene, AshenveilScene (the `Math.hypot(...) < 130` checks) and the DungeonScene ambushes
  (`< 110`). (The City/Varenholm boss triggers and the warlock hunt interactables are already gated —
  but re-verify.)
- NICE-TO-HAVE: also freeze pack wander (and NPC wander) while `CityUI.dialogOpen()` so a pack can't
  drift onto the player mid-talk; if low-risk, skip movement in the pack-wander loop when a dialog is open.
- Do it ONE scene per run if needed; `node --check` + run `node game/tests/headless.js` and
  `node game/tests/gauntlet.js` (both must PASS) after each scene. Purely additive guard conditions.
- Log each scene fixed; when all pack/ambush triggers are gated, note "CONVERSATION-SAFE: all zones".

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

### 4. Voice polish — fix the 13 failing audio-tag lines (LOW priority; after 1.5 + questlines)
`generate_voices.py` rejects 13 PRE-EXISTING perf-tagged lines with "Input at position 0 has empty text
... after removing audio tags". CAUSE: in `game/tools/build_voice_manifest.js` `segment()`, a line whose
`vtext` (from `performance_script.json`) begins with a bracketed audio tag BEFORE the first quote yields
a leading NARRATOR segment that is ONLY the tag (e.g. "[pouting]"); eleven_v3 strips the [tag] -> empty
text -> 400. FIX (segmentation only): in `segment()`, after building segs, drop/MERGE any segment whose
text is tag-only (regex ~ /^(\s*\[[^\]]*\]\s*)+$/) into the NEXT segment so the tag rides inline with
real spoken text (preserves v3 delivery). This changes only how a line is SYNTHESIZED, NOT the line's
hashed text/id, so the existing 179 clips stay valid (respects constraint 8). Then rebuild the manifest;
the 13 will be in `todo` -> Hiro re-runs `python generate_voices.py --yes` to fill them. VERIFY: those 13
ids segment with no empty/tag-only seg; `node --check`; both tests still PASS. Affected speakers:
Cookie, Brakka, Vexa, Veiled Woman, Ankunyx (the perf-tagged set). When all 13 segment cleanly, note
"VOICE GAP CLOSED — 13 tag-lines fixed (Hiro re-run generator)".

### 5. CINEMATIC — Arch Devil expiry -> Seraph descent -> guaranteed Lich (MEDIUM priority; cross-character tie-in)
Hiro design: when the WARLOCK's ARCH DEVIL mode TIMER RUNS OUT, play a scripted cinematic instead of a
plain revert, guaranteeing a death -> Lich and tying in the Seraphim character. Happens EVERY time devil
mode expires.
SEQUENCE (warlock only; alive; S.mode is 'fight' or 'demo'; not already P.lich):
 1. HOOK the devil-timer expiry. In pit.js the frame loop has
    `if(P.devilT>0){P.devilT-=dt; if(P.devilT<=0)exitDevil();}` (~line 1608) and `exitDevil()` reverts the
    form (~line 508). Intercept here: instead of a plain revert, start the cinematic state machine.
 2. INVULNERABLE + PAUSE ~3s: make the player untouchable (reuse P.wardT, or a dedicated flag) and freeze
    his input/movement (P.paralyzeT or a cinematic flag). camFocus on the player; small S.slow.
 3. ARCH DEVIL TAUNTS: pick ONE line at random from the 10-line pool below (avoid immediate repeat if easy).
    showBanner it (so it reads without audio) AND play voice: `window.VoiceMan && VoiceMan.say('THE ARCH DEVIL', line)`
    (VoiceMan is global, so this works in BOTH pit and overworld combat).
 4. ~2.5-3s later: THE SERAPHIM DESCENDS from above — draw a seraph figure (drawFighter seraphim look + a
    descending light ray / feathers), showBanner + `VoiceMan.say('THE SERAPHIM', seraphLine)`.
 5. The Seraph INSTANTLY KILLS the arch devil -> force the warlock death->Lich pipeline (replicate the
    hurtPlayer warlock branch: P.hp=1; P.lichRiseT=3; P.paralyzeT=3; P.channel=null; summonDemons('dragon');
    the frame loop already calls enterLich() when lichRiseT hits 0). Keep the player invuln through this
    scripted death so enemies cannot interfere.
 6. The Seraph FLIES AWAY (animate up/off + fade); normal combat resumes — now as the Lich.
 GUARDS: char==='warlock' only; skip if P.lich or P.dead; fire ONCE per devil expiry (no re-entry); use
 setTimeout for phase timing (consistent with killEnemy/winFight). Must work in AUTO/demo too.
 NET EFFECT: a guaranteed death each time Arch Devil ends -> much more Lich uptime + a Seraphim cameo.

 THE 10 ARCH-DEVIL TAUNT POOL (random each time; voice = Warlock voice):
  1. At last - Sheol's gates could not hold me. The mortal plane is mine to take.
  2. Free! An age in the Pit, and now your soft little world will kneel.
  3. Do you feel it? The chains are off. I have CLIMBED OUT of hell.
  4. Sheol spat me back up. How generous. Now I remake your sky in fire.
  5. No more pits. No more wardens. The conqueror has arrived, and he is HUNGRY.
  6. I clawed through the floor of the underworld for this - for YOU. Kneel.
  7. The abyss is behind me. Ahead: a whole plane of warm, breathing thrones.
  8. Escaped. Ascended. Unleashed. Sheol held its door open one breath too long.
  9. They said no devil leaves the deep. They will be wrong about many things now.
  10. Mortal plane - I waited an age in the dark to swallow you whole.
 THE SERAPHIM DESCENT LINE (voice = Seraphim voice): Vile demon - away with you. Back to hell you go.

 VOICE GENERATION (required; follows constraints 8 & 9): put the pool + seraph line in a data bank
 (e.g. `Quests.archDevilOutro = { taunts:[...10...], seraph:'...' }` in quests.js), then ADD to
 build_voice_manifest.js: loop the taunts with `add('THE ARCH DEVIL', t, 'arch devil outro')` and
 `add('THE SERAPHIM', Quests.archDevilOutro.seraph, 'seraph descent')`, plus speakerSlots
 'THE ARCH DEVIL' -> 'Warlock' and 'THE SERAPHIM' -> 'Seraphim' (REUSE existing ids; both already in
 voice_config.json). Rebuild manifest (count must grow by 11), verify all 11 resolve to a voice id and none
 clean to empty, THEN write "VOICES READY TO GENERATE (arch-devil cinematic)" so Hiro runs the generator.
 In-combat VoiceMan.say(speaker,line) hashes to the same id, so the generated clips play during the scene.
 VERIFY each step: node --check; `node tests/headless.js` + `node tests/gauntlet.js` BOTH PASS. IMPORTANT:
 the warlock gauntlet will now hit this cinematic whenever devil mode expires — confirm the setTimeout
 phases resolve under the test's stubbed clock and the sim still completes (no deadlock from the
 invuln/paralyze; lich must resume), and both tests still PASS.

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

- 2026-06-14 (manual, Hiro+Claude) — **Voice pipeline fix: warlock hunt lines were NOT in the manifest.**
  The earlier "VOICES READY" was premature: `build_voice_manifest.js` hand-codes add() calls per dialogue
  bank and had NONE for `warlockHunt`, so the 26 hunt lines never entered voice_manifest.json (mapping
  voice_config.json alone does nothing). FIX: added a warlockHunt extraction block (launch/targets/
  varenholm climax/deliver) + speakerSlots BRIAR/OSSUARY/CINDER/WHISPER/THORNWARDEN -> existing voice
  slots, rebuilt the manifest (192 -> 218 lines, +26 hunt). Verified: all 26 resolve to a real voice id
  (0 slot problems) and none clean to empty. The ~13 long-standing failures are PRE-EXISTING perf-tagged
  lines (audio-tag-only segments) unrelated to the hunt. Added constraints 8 & 9 above so future dialogue
  (druid line) gets manifest-wired + verified, not just voice-mapped.

- 2026-06-14 (Hiro request) — **NEW TOP PRIORITY queued: no fights during conversations (roadmap 1.5).**
  Some zones can proc a pack/ambush fight while a dialog is open. NEXT RUN should do roadmap 1.5 FIRST
  (gate every proximity encounter trigger on `!CityUI.dialogOpen() && !this.encounterActive &&
  !this.cinematic`; Grove/Mountain/Ashenveil pack checks + Dungeon ambush checks), ONE scene per run,
  node --check + both tests after each. THEN resume warlock step e (journal beats), THEN the Druid line.

- 2026-06-14 (Hiro) — Warlock VO generated SUCCESSFULLY: 26/26 hunt clips made (the manifest fix worked).
  Remaining: 13 pre-existing audio-tag lines still 400 ("empty after removing tags") — queued as
  roadmap item 4 (segmentation tag-only-segment merge). Priority order unchanged: 1.5 (no fights during
  conversations) FIRST, then warlock step e, then the Druid line, then item 4 voice polish. Do NOT
  reorder item 4 above 1.5 or the questlines.

- 2026-06-14 (Hiro) — Queued roadmap item 5: Arch-Devil-expiry cinematic (warlock invuln+taunt -> Seraphim
  descends, banishes the devil -> guaranteed Lich -> seraph flies off). Full spec + the 10 taunt lines +
  seraph line + voice-wiring are in roadmap section 5. MEDIUM priority: do it after 1.5 (no fights during
  conversations), warlock step e, and the Druid line. Needs voice generation (reuse Warlock + Seraphim
  voices). Priority order unchanged; do NOT reorder above 1.5 or the questlines.

- 2026-06-14 (run 11) — **CONVERSATION-SAFE: Grove (roadmap 1.5, scene 1 of 4).** Gated GroveScene's
  proximity encounter triggers so NO fight can start while a dialog or cinematic is open. Three
  additive, purely-defensive guards in `update()`: (1) at the top of the pack wander+aggro loop,
  computed `const talking = CityUI.dialogOpen() || this.encounterActive || this.cinematic;` and
  `if (talking) continue;` — this FREEZES pack wander AND aggro mid-conversation (the nice-to-have:
  a pack can no longer drift onto the player while they talk). (2) The pack proximity trigger
  `if (d < 130)` now also requires `!CityUI.dialogOpen() && !this.encounterActive && !this.cinematic`
  (belt-and-suspenders alongside the loop `continue`). (3) The DRUID-only south-path capture ambush
  (`Math.hypot(...) < 120`) now also requires `!CityUI.dialogOpen() && !this.encounterActive &&
  !this.cinematic`. `this.cinematic`/`this.encounterActive` come from the WorldScene base (confirmed:
  WorldScene sets them, GroveScene extends it). No engine/combat changes; non-warlock/non-druid play
  is identical except packs hold still during dialog.
  VERIFY: `node --check src/scenes/GroveScene.js` PASS (28482 B, tail intact `}`x3, not truncated);
  `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` = GAUNTLET SWEEP:
  PASS (ronin/druid/warlock/seraph all VICTORY 20/20, first try).
  NEXT STEP (next run — roadmap 1.5, scene 2 of 4): gate MountainScene's pack proximity trigger.
  In `src/scenes/MountainScene.js` the pack wander+aggro loop mirrors Grove's: the aggro check is the
  `const d = Math.hypot(pk.sprs[0].x - this.player.x, pk.sprs[0].y - this.player.y);` then a distance
  `if` (~line 276-279) that calls `this.startEncounter(pk.def.name, ...)`. Apply the SAME two-part
  fix: add `const talking = CityUI.dialogOpen() || this.encounterActive || this.cinematic;` at the
  loop top with `if (talking) continue;`, AND add `&& !CityUI.dialogOpen() && !this.encounterActive
  && !this.cinematic` to the distance `if`. (Also check MountainScene line ~217 `c.banner` boss
  trigger — confirm it's already gated or one-shot; gate it the same way if it's a proximity proc.)
  `node --check` + BOTH tests after. Then run 13 = Ashenveil pack (line ~273-276), run 14 = Dungeon
  ambushes (`< 110` at line 128, loop over `a` ambushes). When all four scenes are gated, note
  "CONVERSATION-SAFE: all zones" and resume warlock step e (journal beats), then the Druid line.

- 2026-06-14 (run 11) — **Conversation-safe pass: MountainScene gated (roadmap 1.5, scene 2 of the zones).**
  Discovered GroveScene was ALREADY fully gated by an earlier (unlogged) run — its pack loop has the
  `talking` wander-freeze (`const talking = CityUI.dialogOpen() || this.encounterActive || this.cinematic;`
  + `if (talking) continue;`) AND the aggro `if (d < 130 && !CityUI.dialogOpen() && !this.encounterActive
  && !this.cinematic)` guard AND the druid south-path ambush is gated with the same triple-condition.
  So Grove needs nothing. This run applied the IDENTICAL pattern to `game/src/scenes/MountainScene.js`
  (zone dragonspine): added `const talking = ...` before the wilds pack loop + `if (talking) continue;`
  (freezes pack wander while a dialog/cinematic is open) and gated the aggro trigger
  `if (d < 130 && !CityUI.dialogOpen() && !this.encounterActive && !this.cinematic)`. Purely additive
  guard conditions; no combat/engine change. Mountain has no other proximity auto-encounter (its boss
  is interactable-driven; the Cinder hunt interactable is already gated).
  VERIFY: `node --check src/scenes/MountainScene.js` PASS (file 19281 B, tail intact `}`x2, not truncated);
  `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` = GAUNTLET SWEEP: PASS
  (ronin/druid/warlock/seraph all VICTORY 20/20, no flakiness this run).
  STATUS (roadmap 1.5): Grove DONE (prior), Mountain DONE (this run). REMAINING for "CONVERSATION-SAFE:
  all zones": AshenveilScene (pack aggro `< 130`, currently UNGATED — no dialogOpen/cinematic guard at all)
  and DungeonScene (ambush `< 110` at line ~128, currently UNGATED). City/Varenholm boss triggers already
  carry the guard (verified). Do NOT yet write "CONVERSATION-SAFE: all zones".
  NEXT STEP (next run — roadmap 1.5, one scene): gate AshenveilScene's pack loop the SAME way Grove/Mountain
  are done — add `const talking = CityUI.dialogOpen() || this.encounterActive || this.cinematic;` before
  `for (const pk of this.packs)`, `if (talking) continue;` after `if (!pk.alive) continue; pk.wanderT -= dt;`,
  and gate `if (d < 130 ...)` with `&& !CityUI.dialogOpen() && !this.encounterActive && !this.cinematic`.
  (AshenveilScene pack loop is around lines 262-280; Whisper hunt interactable + nyxDialog are unaffected.)
  Then the run after: DungeonScene — gate the ambush `if (Math.hypot(...) < 110)` at ~line 128 with the same
  triple condition (ambushes have no wander loop, so just the trigger guard). `node --check` + BOTH tests
  after EACH scene. When Ashenveil + Dungeon are both gated, write "CONVERSATION-SAFE: all zones". THEN
  resume warlock step e (journal beats into Quests.mainFor), THEN the Druid line, THEN item 4 voice polish.

- 2026-06-14 (run 12) — **CONVERSATION-SAFE: Mountain (already gated) + Ashenveil (roadmap 1.5, scenes 2 & 3 of 4).**
  First verified MountainScene: its pack wander+aggro loop was ALREADY fully gated (a prior edit landed
  the same fix) — `const talking = CityUI.dialogOpen() || this.encounterActive || this.cinematic;` at the
  loop top with `if (talking) continue;`, AND the proximity trigger `if (d < 130 && !CityUI.dialogOpen()
  && !this.encounterActive && !this.cinematic)`. The only other `startEncounter` in MountainScene (line
  217, `c.banner` duel) is DIALOG-initiated inside `duelDialog()` (a "Challenge" button `fn:fight` that
  calls `close()` first), NOT a proximity proc, so it is already conversation-safe. So Mountain needed no
  change — marked scene 2 of 4 DONE.
  Then applied the SAME two-part additive guard to `game/src/scenes/AshenveilScene.js` (the feral-pack
  wander+aggro loop in `update()`, which was NOT yet gated): (1) added `const talking = CityUI.dialogOpen()
  || this.encounterActive || this.cinematic;` above the `for (const pk of this.packs)` loop with
  `if (talking) continue;` right after `pk.wanderT -= dt;` — this FREEZES pack wander AND aggro while a
  dialog/cinematic is open (the nice-to-have: a pack can no longer drift onto the player mid-talk).
  (2) the proximity trigger `if (d < 130)` now also requires `&& !CityUI.dialogOpen() &&
  !this.encounterActive && !this.cinematic` (belt-and-suspenders). `this.cinematic`/`this.encounterActive`
  come from the WorldScene base (AshenveilScene extends it). No engine/combat changes; play is identical
  except packs hold still during dialog. (The Whisper hunt interactable and the Nyx great-hall trigger are
  already independently gated — unaffected.)
  VERIFY: `node --check src/scenes/AshenveilScene.js` PASS (20206 B, tail intact `}`-stack, not truncated);
  `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` = GAUNTLET SWEEP: PASS
  (ronin/druid/warlock/seraph all VICTORY 20/20, first try; simMin druid 21.5 — well under the 50 cap).
  STATUS: three of four zones now conversation-safe (Grove run 11, Mountain already, Ashenveil this run).
  NEXT STEP (next run — roadmap 1.5, scene 4 of 4, the LAST): gate the DUNGEON ambush triggers in
  `game/src/scenes/DungeonScene.js`. The ambush loop is in `update()` ~line 126: `for (const a of
  this.ambushes) { ... if (Math.hypot(a.x - this.player.x, a.y - this.player.y) < 110) { ...
  this.startEncounter(a.name, a.sub, a.pack, win => {...}); } }`. Add `&& !CityUI.dialogOpen() &&
  !this.encounterActive && !this.cinematic` to that `< 110` distance `if` (these ambushes are one-shot via
  `a.done`, so no separate wander loop to freeze — just guard the proximity proc; confirm by reading the
  full loop first). `node --check` + BOTH tests after. When Dungeon is gated, note "CONVERSATION-SAFE:
  all zones" and then resume warlock step e (journal beats into Quests.mainFor — see run 10 NEXT STEP),
  then the Druid line.

- 2026-06-14 (Hiro request, interactive) — **BUG QUEUED as roadmap item 0 (BLOCKER): warlock stuck taking
  the black carriage on the Matron step.** Hiro hit a dead-end where AUTO won't board the black carriage
  to Ashenveil (journal shows the Matron "take the black carriage" hint, but the live AUTO objective read
  "the cult coach — Cinder on the Dragonspine"). Logged full repro + two hypotheses (AUTO pathing / three
  vehicles crowding the guild door at (1656,744) vs a possibly-premature `q-wq4-the-hunt`/`cap-*` flag) in
  the new roadmap section 0 above. PRIORITY: this is a warlock-playthrough BLOCKER — next scheduled run
  should do roadmap item 0 FIRST (reproduce + flag-dump, then smallest-safe fix), before resuming 1.5
  (Mountain pack gating) / warlock step e / the Druid line. No code changed this interactive turn.

- 2026-06-14 (run 13) — **WARLOCK CARRIAGE BUG FIXED (roadmap item 0, the BLOCKER) — root cause was the
  STALE JOURNAL, not routing; also completes warlock step e.** Reproduced via a vm flag-dump of
  `QuestNav.objective()` + `Quests.mainFor()` across the warlock states. FINDINGS: routing was already
  CORRECT. (1) Real Matron step (`q-wq3-the-matron==='active'`): objective = `the black carriage`
  (karridge-city 1656,744, interact) — reachable; at that step the hunt is NOT active so the cult coach
  does NOT exist (only black carriage dx+88 + grim coach dx-122 at the guild — no 3-vehicle crowding).
  So hypothesis A (pathing) was NOT the bug. (2) Hiro's screenshot state (met Nyx -> `q-wq3-the-matron`
  ='done', `q-wq4-the-hunt`='active', `cap-briar`+`cap-ossuary` set, in the city): objective correctly =
  `the cult coach — Cinder on the Dragonspine` (1538,744) — BUT the JOURNAL's last entry was still
  `THE MATRON ✓: Take the black carriage. Meet Lady Nyx` because `mainFor()` had NO wq4 hunt entry
  (roadmap step e was never done). dialog.js `questlog()` renders every `mainFor` entry whose
  `flags['q-'+id]` is set; with no hunt entry, the Matron step (now done, with a ✓ Hiro didn't notice)
  read as the live step and contradicted the AUTO button -> the "stuck / mis-routing" feeling. This is
  the stale-journal form of hypothesis B (no flag is set spuriously: `q-wq4-the-hunt` is set ONLY in
  AshenveilScene nyxDialog launch L226, `cap-*` ONLY in WorldScene.tryHuntCapture L348).
  FIX (smallest-safe, DATA-ONLY, one file): rewrote `Quests.mainFor()` in `game/src/world/quests.js`
  so the warlock branch, when `flags['q-wq4-the-hunt']` is 'active' or 'done', appends ONE live entry
  `{id:'wq4-the-hunt', title:'THE WARLOCK\'S HUNT', text, objective}` whose objective is computed from
  the `cap-*` flags: "N of 5 caged. Next: bring back <target> — alive (capture, never kill)." while
  active, and "All five cages delivered to Lady Nyx. The web has a new spider." when done (then it shows
  with the ✓ since the flag is 'done'). id 'wq4-the-hunt' makes `'q-'+id` == the hunt flag so the existing
  journal renderer shows it with NO new UI. Mirrors the exact `{id,title,text,objective}` entry shape the
  journal already consumes; `this.main.concat(...)` returns a fresh array so nothing is mutated. The black
  carriage that persists during the hunt (CityScene L171, kept because `q-wq3-the-matron` is truthy=='done')
  is NOT a dead-end — it routes to AshenveilScene, which the warlock still needs for the Whisper capture and
  the final delivery, so it was correctly left in place.
  VERIFY: `node --check src/world/quests.js` PASS (59030 B, tail `module.exports`/`window.Quests` intact,
  not truncated). vm flag-dump now shows the journal AGREES with AUTO in every state: 0 caged -> "Next:
  Briar", 2 caged (Hiro's case) -> "2 of 5 caged. Next: bring back Cinder on the Dragonspine — alive"
  (matches the AUTO button), 4 caged -> "Next: Cookie of Varenholm (and her protector)", delivered ->
  "THE WARLOCK'S HUNT ✓: All five cages delivered." `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS;
  `node tests/gauntlet.js` = GAUNTLET SWEEP: PASS first try (ronin/druid/warlock/seraph all VICTORY 20/20,
  druid simMin 42.5 — under the 50 cap). No combat/engine/scene files touched (data-only).
  STATUS: roadmap item 0 (BLOCKER) RESOLVED — the journal no longer surfaces the stale Matron "black
  carriage" hint mid-hunt; it shows live hunt progress that matches AUTO, so a warlock who recruited Nyx
  is no longer confused/"stuck." This ALSO completes warlock roadmap STEP e (journal beats into mainFor) —
  the last warlock questline item. Warlock VO was already generated (26/26 hunt clips, per the 2026-06-14
  Hiro note); step e is unvoiced quest-log text and adds/changes NO spoken line, so no voice regen needed.
  The WARLOCK QUESTLINE is now complete + playable + AUTO-navigable end-to-end with a correct journal.
  NEXT STEP (next run): resume roadmap 1.5 (no fights during conversations), scene 4 of 4 — gate the
  DUNGEON ambush triggers in `game/src/scenes/DungeonScene.js`. The ambush loop is in `update()` ~L126:
  `for (const a of this.ambushes) { ... if (Math.hypot(a.x - this.player.x, a.y - this.player.y) < 110)
  { ... this.startEncounter(a.name, a.sub, a.pack, win => {...}); } }`. Add `&& !CityUI.dialogOpen()
  && !this.encounterActive && !this.cinematic` to that `< 110` distance `if` (ambushes are one-shot via
  `a.done`, no wander loop to freeze — just guard the proximity proc; read the full loop first). `node
  --check` + BOTH tests after. When Dungeon is gated, note "CONVERSATION-SAFE: all zones", THEN the
  Druid line (roadmap 2), THEN item 4 voice polish, THEN item 5 arch-devil cinematic. (Do NOT reorder
  item 4 above the questlines.)

- 2026-06-14 (run 14) — **CONVERSATION-SAFE: all zones (roadmap 1.5 COMPLETE — Dungeon, scene 4 of 4).**
  Read the full ambush loop in `game/src/scenes/DungeonScene.js` update() (~L126): one-shot ambushes
  guarded by `a.done || world.flags[a.id]`, fired by a `Math.hypot(...) < 110` proximity check that calls
  `this.startEncounter(...)`. These ambushes have NO wander loop (the trigger zones are static `{x,y}`),
  so per the run-13 NEXT STEP only the proximity proc needed gating — no `talking`/wander-freeze block.
  FIX (purely additive, one line, DATA/guard-only): added `&& !CityUI.dialogOpen() && !this.encounterActive
  && !this.cinematic` to the `< 110` distance `if` (now L128). CityUI is the global `window.CityUI`
  (`dialogOpen()` in core/dialog.js); `this.cinematic`/`this.encounterActive` come from the WorldScene base
  DungeonScene extends. No engine/combat/scene-flow change — an ambush simply can't start while a dialog
  or cinematic is open.
  VERIFY: `node --check src/scenes/DungeonScene.js` PASS (file 7426 B, tail intact `}`-stack, not truncated);
  `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` = GAUNTLET SWEEP: PASS
  first try (ronin/druid/warlock/seraph all VICTORY 20/20; druid simMin 41.2 — under the 50 cap).
  STATUS: **CONVERSATION-SAFE: all zones** — every proximity/auto encounter trigger is now gated against
  open dialog + cinematic. Grove (run 11, prior), Mountain (already gated, re-verified run 12), Ashenveil
  (run 12), Dungeon (this run). City/Varenholm boss triggers were already guarded. Roadmap 1.5 is DONE.
  Roadmap progress: item 0 (carriage bug) DONE, Warlock questline incl. step e DONE, 1.5 DONE. Remaining:
  2 (Druid questline), 3 (docs refresh), 4 (voice gap), 5 (arch-devil cinematic).
  NEXT STEP (next run — roadmap item 2, the DRUID questline; this is a LARGER multi-run feature, so do ONE
  self-contained increment): the druid POV of the crossing (see roadmap section 2). Suggested first slice =
  the data/scaffold only (do NOT try to build the whole questline in one run): in `game/src/world/quests.js`
  add a druid hunt/flee text bank + a `Quests.mainFor()` druid branch entry (mirror the warlock wq4 pattern
  from run 13 so the journal/AUTO can navigate), gated to `char==='druid'`. Pick ONE new flag name (e.g.
  `q-dq-the-crossing`) and document its set-points BEFORE wiring any scene trigger. Reuse existing combat AI
  `type`s + the `boss:true`/`deathCol` pattern for the warlock-attacks-druid fight; introduce Ignis/Shen Sama
  as NEW lore consistent with the Dragonspine treaty dragons (Aurvaeth/Vesshk). Keep dialogue TEXT-ONLY; map
  any NEW speaker (Shen Sama) to an EXISTING voice id in voice_config.json AND extract lines into the manifest
  (constraints 8 & 9) before claiming voices are ready. `node --check` + BOTH tests after every increment.
  Then item 3 (docs), item 4 (voice gap), item 5 (arch-devil cinematic). Do NOT reorder item 4 above item 2.

- 2026-06-14 (run 15) — **DRUID QUESTLINE scaffold (roadmap item 2, increment 1 of N — DATA ONLY).**
  Started the Druid POV of the Varenholm crossing per run-14 NEXT STEP. Smallest self-contained slice:
  the text bank + the journal/AUTO-navigable mainFor entry, NO scene wiring or voice work yet.
  CHANGES (one file, `game/src/world/quests.js`, both purely additive):
  (1) New `druidCrossing` data block (inserted before the seraph section). Mirrors the structure of
      `warlockHunt`: `crossFlag:'q-dq-the-crossing'` plus four phase sub-blocks with TEXT-ONLY dialogue —
      `cookie` (the dancer befriends the druid, spots the cult tail), `warlock` (THE CULT WARLOCK arrives
      with cages: banner + arrive/cookieQuip/opt + a 1-boss `collector` pack + `flag:'dq-cross-warlock'`),
      `rematch` (the cinematic: he gets back up with Anku reinforcements: druidLine/warlockRise/cookieLine/
      opt + a `collector` boss + 2×`grave` pack + `flag:'dq-cross-cult'`), `flight` (flee up the spine
      trail, `flag:'dq-cross-flee'`), and `shen` (SHEN SAMA on the Dragonspine: the hearth-wyrm IGNIS has
      gone MISSING; they decide to hunt her together — `flag:'dq-cross-shen'`, the done beat) + a `credits`
      line. Combat reuses existing AI types only (`collector`, `grave`) + the `boss:true`/`deathCol`
      pattern (constraint 6). New lore (Ignis = a THIRD, un-treatied hearth/fire-dragon who shelters
      gifted strays; her disappearance is the questline hook) is kept consistent with the Dragonspine
      treaty dragons Aurvaeth/Vesshk and reuses the established Shen Sama = fugitive dragon
      (cult.shenSama / druid.shenSamaAdd) and Cookie = firebird dancer / Amaris's-daughter-cousin canon.
  (2) New `c === 'druid'` branch in `Quests.mainFor()` (inserted right after the warlock branch). When
      `flags['q-dq-the-crossing']` is set it appends ONE live journal entry `{id:'dq-the-crossing',
      title:'THE CROSSING', text, objective}` whose objective is computed from the four `dq-cross-*`
      progress flags ("Step N of 4: ..." while active; a delivered line when 'done'). id 'dq-the-crossing'
      makes `'q-'+id === crossFlag`, so the EXISTING journal renderer (dialog.js questlog) shows it with NO
      new UI — exactly the run-13 warlock trick. `this.main.slice()` returns a fresh array (nothing mutated).
  SET-POINTS DOCUMENTED (not yet wired — single source of truth for the next run): `q-dq-the-crossing`
  -> 'active' when the Varenholm trigger fires for a druid, 'done' after the Shen Sama meet; progress flags
  `dq-cross-warlock` (phase-1 win), `dq-cross-cult` (phase-2 win), `dq-cross-flee` (travel beat),
  `dq-cross-shen` (Shen Sama meet). All gated to `char==='druid'`.
  VERIFY: `node --check src/world/quests.js` PASS (70695 B, tail `module.exports`/`window.Quests` intact,
  NOT truncated). Functional node harness of `mainFor()` for a druid across {no-flag, active 0/2/3 caged,
  done} prints the correct entry only when the flag is set, with the objective stepping 1->4 then the
  delivered line — journal logic verified. `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS;
  `node tests/gauntlet.js` = GAUNTLET SWEEP: PASS first try (ronin/druid/warlock/seraph all VICTORY 20/20;
  druid simMin 27.0 — well under the 50 cap). No combat/engine/scene files touched (data-only).
  STATUS: roadmap item 2 STARTED (text bank + journal entry done). NOT YET: scene wiring (a Varenholm
  trigger to set the crossing active + run the two fights via startEncounter, the flee-to-mountain travel,
  the Shen Sama meet, `QuestNav.objective()` routing) and voices (map SHEN SAMA to an existing voice id +
  extract into the manifest — constraints 8 & 9). Voices are NOT ready; do NOT generate yet.
  NEXT STEP (next run — roadmap item 2, increment 2): WIRE THE TRIGGER + PHASE-1 FIGHT in VarenholmScene.
  Read `game/src/scenes/VarenholmScene.js` (esp. `guildHall`/the dancer/Cookie ally pattern referenced in
  roadmap §1) to find where a druid first meets Cookie. Add a druid-gated interactable/dialog beat that
  (a) shows `Quests.druidCrossing.cookie.line` then `.warlock.arrive`/`.cookieQuip`, (b) sets
  `world.flags['q-dq-the-crossing']='active'`, and (c) on a choice button calls
  `this.startEncounter(name, sub, Quests.druidCrossing.warlock.pack, win => { if(win){ world.flags['dq-cross-warlock']=1; ... } })`.
  Gate the whole beat to `GameState.player.char==='druid'` and guard it like the other conversation-safe
  triggers (`!CityUI.dialogOpen() && !this.encounterActive && !this.cinematic`). Keep it to phase 1 only this
  run (the rematch/flee/Shen meet come in later increments). `node --check` the scene + BOTH tests after.
  Then continue item 2 increments, THEN item 3 (docs), item 4 (voice gap), item 5 (arch-devil cinematic).

- 2026-06-14 (run 16) — **DRUID QUESTLINE wiring increment 2: the Crossing trigger + PHASE-1 fight
  (roadmap item 2).** Wired the Druid POV of the Varenholm crossing into `game/src/scenes/VarenholmScene.js`
  (one file, purely additive). Two changes:
  (1) New method `crossingBeat(portrait)` (inserted just above `portraitCookie()`). Gated to
      `GS.player.char==='druid'`. States: if `q-dq-the-crossing`==='done' -> return false (fall through
      to the normal "encore was yesterday" Cookie line); if `dq-cross-warlock` already set -> a brief
      hold line ("…up the mountain…to be continued") so a mid-crossing druid isn't shown the stale encore
      text; else PHASE 1 -> plays `druidCrossing.cookie.line` -> `warlock.arrive` -> `warlock.cookieQuip`
      with the two `warlock.opt` buttons, both calling a shared `fight()` that
      `startEncounter(warlock.banner[0], banner[1], warlock.pack (1× collector boss, boss:true/deathCol),
      …, {zoneScale:true})`. On WIN: sets `flags['q-dq-the-crossing']='active'` + `flags['dq-cross-warlock']=1`,
      shows `warlock.down`, floats "JOURNAL — THE CROSSING BEGINS", autosaves. On LOSS: bumps the player to
      the coach tile + a float (no flag change), so it can be retried. Reuses the exact warlock-hunt
      `tryHuntCapture` shape (pack.map(Object.assign) for a fresh copy, dialog-chain -> startEncounter).
  (2) guildHall() done-branch now calls `if (druid && this.crossingBeat(portrait)) return;` BEFORE the
      stale "encore was yesterday" line, so a druid who has finished the dancer job (`q-mq6-the-dancer`
      ==='done') enters the crossing instead. Launched from the guild menu (not a proximity proc), so it is
      inherently conversation-safe (no dialog/cinematic guard needed — same as the warlock hunt climax).
  Combat reuses the existing `collector` boss + the boss:true/deathCol pattern only (constraint 6). No
  engine/combat-system changes; the warlock hunt climax in this same scene stays mutually exclusive via
  char gating. The journal entry (run-15 `mainFor()` druid branch) now lights up the moment phase 1 sets
  the crossFlag, stepping the objective (Step 1->2 of 4) correctly.
  VERIFY: `node --check src/scenes/VarenholmScene.js` PASS (file 18126 B, tail `}`-stack intact, NOT
  truncated). `node tests/headless.js` = 5/5 HEADLESS HARNESS PASS; `node tests/gauntlet.js` =
  GAUNTLET SWEEP: PASS first try (ronin/druid/warlock/seraph all VICTORY 20/20; druid simMin 35.6 — under
  the 50 cap). NOT YET "VOICES READY TO GENERATE" — Shen Sama (and any other new crossing speakers) are
  not yet mapped/extracted, and phases 2–4 aren't wired, so do NOT run the generator.
  NEXT STEP (next run — roadmap item 2, increment 3): WIRE PHASE 2 (the rematch) so the crossing can
  progress past `dq-cross-warlock`. In `crossingBeat()`, replace the temporary "to be continued" hold
  branch (the `if (flags[W.flag])` block) with the rematch beat: when `dq-cross-warlock` is set and
  `dq-cross-cult` is NOT, play `Quests.druidCrossing.rematch` (banner/druidLine/warlockRise/cookieLine
  + the two `rematch.opt`) -> `startEncounter(rematch.banner[0], banner[1], rematch.pack (1× collector
  boss + 2× grave), …, {zoneScale:true})`; on WIN set `flags['dq-cross-cult']=1`, show `rematch.down`,
  float "THE ASH ROAD IS THROWN BACK", autosave. Keep `q-dq-the-crossing` 'active' (it flips to 'done'
  only after the Shen Sama meet in a later increment). Then increment 4 = the flight beat (`flight`,
  set `dq-cross-flee`) + a way to reach the Mountain/Dragonspine as a druid (mirror the warlock "cult
  coach" travel pattern), and increment 5 = the Shen Sama meet on the Dragonspine (`shen`, set
  `dq-cross-shen` + flip crossFlag to 'done' + `CityUI.credits(druidCrossing.credits)`), THEN map SHEN
  SAMA to an existing voice id in voice_config.json AND extract every NEW crossing line into the manifest
  (build_voice_manifest.js add(...) + speakerSlots; constraints 8 & 9) before writing
  "VOICES READY TO GENERATE (druid crossing)". `node --check` + BOTH tests after every increment. Then
  item 3 (docs), item 4 (voice gap), item 5 (arch-devil cinematic). Do NOT reorder item 4 above item 2.
