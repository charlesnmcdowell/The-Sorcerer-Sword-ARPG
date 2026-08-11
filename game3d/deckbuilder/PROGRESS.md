# Sorcerer Spire (deck-builder) — build progress log

**What this is:** ground-up Slay-the-Spire-style deck-builder rebuild of The Sorcerer Sword.
Phaser 3 (bundled locally, `lib/phaser.min.js`), vanilla JS, runs from `file://` by
double-clicking **SorcererSpire.html** (all art/audio base64-embedded in `assets/assets_*.js`).
Lives in `game3d/deckbuilder/`. Spec: the one-shot build request doc (2026-07-24).

## Key decisions (locked)
- **Art architecture (NEW, reverses old rule):** summons/effects are standalone sprites,
  sequenced/composited by the engine. NO embedded-cameo sheets. The old hound `*hit`
  sheets contain baked summon cameos — only their **summon-free frames** are bundled
  (see `build/build_assets.py` ANIMS comments for the exact cherry-picked frame lists).
- **Warlock art:** new female protagonist ref = `game3d/tools/refs/new warlock ref.png`
  (dark elf, brown/tan, black hair w/ red trim, hazel-ice eyes). Her sprite set is NOT
  generated yet (Grok runs local-only on Hiro's PC). Game is built with the existing
  greenlit warlock set as stand-in; UI/cards are themed to her palette (brown/tan/gold/red).
  `build/build_assets.py` auto-swaps in `assets/sprites/warlock/forms/newwarlock/` frames
  when they exist (run `gen_sprites.py` for the queued `newwarlock_*` manifest rows, then
  re-run the bundler).
- Portal visual for summon entry/exit = `fx wardaura` frames tinted violet (reads as a rune portal).
- Music: `arena.mp3` embedded, HTMLAudio data-URI, toggle top-right, starts on first input.

## Status
- [x] Survey project; read gen-sprites + art-pipeline skills; stage all needed frames (293 ok)
- [x] Asset bundler `build/build_assets.py` → `assets/assets_*.js` (~28 MB total)
- [x] Phaser 3.85.2 downloaded to `lib/`
- [x] src/anim.js — texture/anim registration from bundles
- [x] src/combat.js — turn engine (energy/draw/statuses/intents)
- [x] src/cards.js — 12-card warlock set, defs + per-card choreography
- [x] src/scenes/(Boot,Title,Fight,Map).js + src/main.js + SorcererSpire.html
- [x] Playwright smoke test — full pass, every card + 4 enemy turns + victory→map, NO JS ERRORS
- [x] Visual tuning pass (fg pillar scale, positions, HUD plates, status text)
- [x] newwarlock_* rows appended to tools/gen_sprites.py MANIFEST (ref-wired, ready to run locally)
- [x] Delivered to game3d/deckbuilder/ on Hiro's PC
- [x] Final PROGRESS/README update
- [x] QUALITY REPASS (2026-07-27): `build/qa_test.js` — natural no-cheat playthrough to victory,
  victory→map→refight loop, defeat→restart reset, empty-deck draw edge, Pact-of-Pain self-kill.
  Fixed in repass: self-kill soft-lock (defeat check after every card), isDefeat not resetting on
  restart, intent-icon tween stacking, Weak only ticking on attack turns, "-0" damage text now
  reads "blocked". Both test suites pass with NO JS ERRORS.

## PIT LEVEL COMPLETE (2026-07-28) — full Act 1 playable end to end
- **Run state** (`src/run.js`): deck + HP persist across encounters; map position/cleared
  tracking; her marker climbs the map. Defeat = run over, fresh climb.
- **Card rewards**: every won fight offers pick-1-of-3 (rarity-weighted; elites/boss lean
  rare) or skip. 10 new reward-only cards incl. two new engine-sequenced summons:
  Sheol Kiss (Arch-Succubus, green) and Marrow Choir (Bone Archer + bonearrow volleys).
- **Enemy roster** (`src/enemies.js`): Pit Hound, Pit Skeleton, Pit Brute (fights),
  THE BEAST (elite — its bespoke reaction sheets cherry-picked summon-free, same rule as
  the hound), THE HOUND MASTER (boss — Horn Call summons a pit hound charging through,
  pure engine sequencing, no new art). Reactions resolve per-enemy with hurt fallback.
- **Every advertised node type live**: fight / elite / REST (campfire heal +25) /
  LOOT (rare card | +8 max HP | purge a card) / ??? (fight, cache, mercy heal, or Beast
  ambush) / BOSS → THE PIT IS CLEARED act screen with run stats.
- **Testing**: `build/run_test.js` — boots every enemy, validates reward flow, Horn Call,
  and a full bot climb (map → fights → elite → rest/loot → boss). All three suites
  (smoke, qa, run) pass with NO JS ERRORS. Sample cleared run: deck 16→20, boss down at 4 HP.

## POLISH PASS (2026-07-28)
- **Procedural SFX** (`src/sfx.js`, WebAudio — zero audio assets): hits (light/heavy),
  block clink + shield, bolt whooshes, portals/summons, burn crackle, buffs/debuffs,
  heal chimes, energy, card play / hand deal, UI clicks + hovers, roars, victory/boss
  fanfare, defeat dirge. Unlocked on first input; wired through every combat + UI event.
- **Combat juice**: white hit-flash on whoever takes damage, camera punch-zoom on 12+
  hits, damage numbers scale with the hit, blue shield-shatter burst on fully blocked
  hits (both directions), HP bars tween instead of snapping.
- **UX**: playable cards get a gold glow edge; DRAW/DISCARD are clickable pile viewers
  (draw shown sorted, order hidden); enemy intent has a hover tooltip; map nodes have
  hover tooltips (incl. which enemy waits) + floor numerals I-VII; music + fullscreen
  toggles on Fight AND Map; Title shows CONTINUE THE CLIMB mid-run.
- All three suites re-run clean (sample polished run: cleared, boss down at 49 HP).

## Known gaps / next pass ideas
- ~~New female warlock sprites: QUEUED~~ DONE 2026-07-27: generated FROM THE CLOUD (the old
  "sandbox 403s xAI" note is stale — api.x.ai is reachable from the cloud container with the
  project key). 7 per-animation green-screen sheets (edit-mode, anchored on tools/refs/"new
  warlock ref.png"), sliced with tools/slice_sheet.py, despilled + de-crumbed, 39 frames at
  assets/sprites/warlock/forms/newwarlock/. Bundler override active — she IS the in-game
  warlock now (idle5/walk8/hurt4/cast6/bigcast6/portal6/slide4). Raw sheets in tools/sheets/
  (newwarlock_row_*.png). Cloud gen scripts: deckbuilder/build/gen_newwarlock.py + gen_rows.py.
  Per pipeline rules this art is UNREVIEWED until Hiro greenlights it in-game.
- No SFX yet (music only). Floor II (the Alleys), potions/relics, card upgrades = future passes.
- Headless-canvas particle tint shows as white squares in the smoke test only; WebGL (real
  browsers) renders tinted correctly.

## Card set (all functional; every one has its own animation)
| Card | Cost | Effect | Presentation |
|---|---|---|---|
| Shadow Bolt | 1 | 7 dmg | wl_cast + hexbolt projectile + hd_hexhit |
| Umbral Ward | 1 | 6 block | wl_portal + teal wardaura on warlock |
| Hex of Frailty | 1 | Weak 2 | wl_cast + greenbolt lob + hd_ahexhit |
| Shadow Step | 1 | 4 block, draw 1 | wl_slide dash + afterimages |
| Soul Siphon | 2 | 6 dmg, heal 4 | wl_cast + drain particle stream + hd_hurt |
| Pact of Pain | 0 | 4 dmg, lose 2 HP | wl_hurt self-prick + red bolt + hd_hurt |
| Ruthless Focus | 1 | +2 energy, draw 1 | wl_cast + sigil flare + orb pulse |
| Veil of Night | 2 | 12 block | wl_bigcast + double violet wardaura |
| Kiss of Cinders | 2 | 8 dmg, Burn 4 | SUCCUBUS: portal in→fireball→hd_firehit→mend dance→portal out |
| Rake of the Pit | 2 | 4 dmg ×3 | CLAW DEMON: crash down→maul×3 (hd_clawhit)→hop into portal |
| Black Sky | 3 | 16 dmg, Burn 3 | DRAGON: fly in→breath cone→hd_fadehit (scorched, downed)→fly off |
| Grave Chorus | 2 | 3 dmg ×4, Weak 1 | SHAMBLERS ×3: rise→converge→rip (hd_scythehit)→crumble to dust |

Starting deck (16): 3× Shadow Bolt, 3× Umbral Ward, 1× each of the other ten.
Hound: 48 HP; pattern Snarl(+2 Str) → Bite 9 → Rend 5×2 → Guard 8 → Bite 9, looping. Intents shown.
Player: 70 HP, 3 energy, draw 5.

## SPIRE REBALANCE / CARD AUDIT PASS (2026-07-30)
Hiro's ask: shorten the climb to max 3 battles before the boss (keep loot/treasure),
add a tavern stop with a full heal + epic card, force every fight in a climb to use
a unique enemy, fix enemies not facing her, fix idle anims that "look back and
forth", and audit the cards for life steal / summon-buff / physical / Arch-Devil.

- **Map** (`src/run.js`): `ROWS` 7→5. Row 0 = mandatory fight. Row 2 is a dedicated
  always-safe row (rest / treasure / the climb's one tavern stop — never a fight,
  never an "???" that could itself roll into one). Rows 1 & 3 may each contribute at
  most one fight to any single path (`capOne()` downgrades extra fight/elite rolls in
  the same row to treasure). Worst case for *any* climbed path: row0 + row1 + row3 =
  **3 fights**, then the boss.
- **Enemy uniqueness**: `Spire.claimEnemy(pool)` hands out enemy ids from
  `FIGHT_POOL`/`ELITE_POOL` without repeats (tracked in `run.usedEnemies`), consulted
  both at map-gen time and by the "???" node's runtime fight/ambush rolls in
  `MapScene.enter()`. An elite (Beast) is also capped to one appearance per map.
- **Tavern stop** (`src/scenes/NodeScenes.js` `TavernScene`, registered in
  `src/main.js`): full HP refill + `Spire.epicChoices(3)` (epic-tier pick backed by
  rare alternates). The Dancer NPC is a new standalone sprite (`dc_idle`, prefix
  `dc`), sliced straight from the existing green-screen sheet at
  `tools/dancer_mvc.png`'s IDLE row (`gen/slice_dancer.py`) — no new art generation
  needed. Debug hooks: `window.tavernPick(i)` / `window.tavernSkip()`.
- **Bug fix — enemies not facing her** (CORRECTED same day; the first attempt had it
  inverted): a zoomed-in audit of every enemy's idle_1 frame settled the native
  facings — HOUND and BEAST are drawn facing right (backs to her, since enemies
  stand stage-right), while skel/brute/master are drawn facing left (already
  correct). `flip: true` now sits on hound + beast only; the first pass had wrongly
  flagged brute + master off a misread of the low-res previews, which Hiro caught
  in-game. `FightScene.create()` spawns from the flag and `flipXFor(dir)` keeps both
  charge legs of `enemyAttack()` correct; the title-screen hound and the Horn Call
  dog (both hound art, both facing/moving left) get explicit `flipX: true` too.
  Verification rule going forward: judge sprite facing ONLY from enlarged crops,
  never from thumbnail-size previews.
- **Bug fix — idle "looking back and forth"**: `build/build_assets.py`'s `load_anim()`
  used to center every keyframe on its own raw crop WIDTH, not on where the character
  actually sits in that crop — a frame with a weapon/limb reaching further to one
  side has a different width, so naive width-centering visibly slid the whole body
  left-right every loop. Frames now register on their alpha centroid (a fixed point
  across the whole animation) instead.
- **Card audit** (`src/cards.js`) — added, none of it touching the already-praised
  block cards:
  - Life steal: **Vampiric Edge** (common, 9 dmg / heal = dmg dealt), **Crimson
    Harvest** (rare, 15 dmg / heal half dealt / Weak 1) — heal off the *actual* damage
    landed (post-block), distinct from Soul Siphon's flat heal.
  - Physical (non-magic, no bolt): **Dagger Flurry** (common, 4×3), **Riving Slash**
    (uncommon, 13 dmg + 5 block) — reuse the `wl_slide` dash-strike choreography
    already established by Dusk Fang/Shadow Step.
  - Summon-buff: **Blood Pact** (uncommon) / **Dark Covenant** (rare) grant a
    permanent `summonpower` status this combat; every summon/transformation card
    (Succubus, Claw Demon, Dragon, Shamblers, Sheol Kiss, Marrow Choir, the Arch-Devil)
    now hits through `Spire.Combat.summonHits()` / `ctx.applySummonHit()` instead of
    the plain player hit path, so the buff actually lands.
  - Arch-Devil transformation: **Wear the Devil's Skin** (epic — new rarity tier,
    tavern-exclusive in the reward pools) reuses the ARPG's existing
    `assets/sprites/warlock/forms/archdevil/` idle/walk/attack frames (already
    transparent PNGs, no re-keying needed) as a standalone entity she channels and
    who strikes for her — same architecture as every other summon, not an embedded
    cameo.
- Reward pools: `Spire.rewardChoices()` now excludes `rarity:"epic"` (tavern-only);
  `Spire.epicChoices(n)` backfills with rares if the epic pool is thin.
- Tests: `build/run_test.js`'s bot loop now also handles a `"Tavern"` scene stop
  (`window.tavernPick(0)`). All three suites (smoke/qa/run) re-run clean, sample
  cleared run routed through the tavern and picked up "Wear the Devil's Skin".
- Deliberately out of scope this pass (per Hiro: "we will focus on that later"): the
  second Spire level ("the City", new bg/music). `ActClearScene` now just teases it
  in text instead of building it.

## THE FULL ROAD — ACTS 2 & 3 + STORY/VOICE (2026-08-05)
Hiro's ask: "develop the rest of the game, levels, enemies and use the same story and
voice overs for the warlock in the original pit game" — with an explicit instruction to
learn the original game's story/VO/locations/NPCs and where that data lives first.

**Where the original data lives (surveyed on Hiro's PC):**
- Story/design bible: `docs/LORE_BIBLE.md` (the Ankuspawn Conspiracy, Karridge, the
  cult pipeline, Varenholm, the warlock's epilogue), `game3d/docs/WIKI.md` (areas,
  quest beats, bestiary, chapter-1 mq0-6 walkthrough).
- Voice: recorded ElevenLabs clips at `game3d/assets/voice/<fnv1a-id>.mp3`; the
  id -> speaker/text mapping is `game/tools/voice_manifest.json` (274 lines; the 32
  clips present in game3d are the ARPG slice); full script `docs/VOICE_LINES.md`,
  casting `docs/VOICE_CAST.md`.
- Enemy art: `game3d/assets/sprites/enemies/<name>/` — the deck-builder previously
  used 5 of 14 rosters; hook/gunner/stitch/grave/necro/chain/pyre/door/champ were
  unused and complete (idle/walk/attack/hurt/death).
- Backgrounds: `game3d/assets/bg/` village/alleys/westroad/road parallax layers.
  Music: `arena.mp3` (pit) + `city.mp3` (village/road).

**What was built (all tested, three suites clean):**
- **Three acts, one run** (`Spire.ACTS` in run.js): Act I THE PIT (unchanged) →
  Act II THE CITY (back alleys) → Act III THE WEST ROAD (night shipment) →
  VARENHOLM epilogue. Act transitions rest her (full heal, +10 max HP), reset the
  per-act unique-enemy budget, and re-theme map/fights/music/backgrounds.
- **9 new enemies** from the original roster, per-act:
  Act II fights hook ("THE HOOK") / gunner ("THE ROAD GUNNER", ranged standoff
  shots) / stitch ("THE STITCHER", Mend Flesh self-heal special); elite grave
  ("GRAVEHAND"); boss necro ("THE COURT NECROMANCER", Raise Dead special — a Risen
  thrall rises, claws her twice, crumbles; ranged caster).
  Act III fights chain ("THE CHAIN") / pyre ("THE PYRE", ranged, Cinder Toss special
  = damage + Burn ticking on HER turns) / wight ("FROST WIGHT" — skeleton art under
  an icy tint; Cookie's "rats don't leave FROST on the railings" made flesh); elite
  door ("THE WALL"); boss champ ("THE CHAMP", Devour special — eats a walk-in thrall
  for heal + Str, exactly his gauntlet gimmick).
- **Facing discipline** (the hard-won rule): every new sprite audited via zoomed
  crops BEFORE wiring. hook/gunner/stitch/grave/necro/chain/pyre/door natively face
  left; champ faces right (runtime `flip:true`). Three attack sets (stitch/necro/pyre)
  were generated projecting RIGHT against their own left-facing idles — those frames
  are mirrored AT BUNDLE TIME (`mirror` flag in build_assets ANIMS) so runtime code
  stays uniform. All 10 verified in-engine post-build via zoomed screenshots.
- **Voice & subtitles** (`src/voice.js` + `assets/assets_voice.js`, 27 embedded
  clips): `Spire.say(scene, id)` plays the original recorded clip with a subtitle
  banner, ducks music, click-to-skip, and NEVER hangs (timer fallback when audio is
  locked/headless). Full id->speaker/text table transcribed from voice_manifest.
- **Story flow**: fresh run opens on a voiced STORY interlude (narrator's warlock
  bio f2dc4e18 + Marlow's Dren line 7f80e8d4) → Pit map (gate line fcd953f2). Boss
  fights open on their act's line (Act I "Dead men leave echoes…", II "Open the
  crates. Then the crews.", III "Stand. Power should see power coming."). Act clears
  run voiced outros: I→II Marlow's "Watch the alleys…"; II→III the Ankunyx plaza
  scene (ccbbc15c + "Not yet. Patience is also a weapon.") then the west-road hunt
  lines; III→ the four-beat Varenholm epilogue (coach / the show / "you know why" /
  the coach south) over the city skyline with the Dancer on stage.
- **Story nodes** (safe-row per act + a chance event): Act I keeps the Tavern.
  Act II THE LAST DOOR INN (Marlow's voiced board: full heal + rare-leaning pick;
  warlock's "Five silver…" on purchase) and a once-per-run ??? event THE BUYER —
  the Veiled Woman (voiced f5781a68) with a real choice: TAKE THE VIAL (epic card,
  "It's safer in my hands than in your veins.") or LEAVE IT (+12 max HP, "Keep your
  bottled miracle. Your debt amuses me more."). Act III THE CAGE (waystation beat:
  narrator + the Quarry Boy + "Run. You're worth more to me as a rumor." → +12 max HP).
- **Music**: assets_audio.js now carries both tracks (SPIRE_MUSIC.arena/.city);
  `Spire.playMusic(key)` swaps per act (Pit = arena.mp3; City/West Road = city.mp3).
- **Arenas/maps**: per-act Fight backdrops (alley shopfront row + lantern motes;
  ley-stone forest road + fireflies) and map backgrounds; act-aware node art incl.
  flipped/tinted thumbnails.
- **Instance-reuse bugs fixed** (same family as the old isDefeat bug): ActClear's
  `_adv` guard and Buyer's `_btns` persisted across scene restarts (act-2 clear was
  a dead button); MapScene gained a `_leaving` guard against double-enter during an
  ??? node's delayed transition (crashed on a dead camera).
- **Tests**: run_test.js now boots ALL 14 enemies, exercises all 5 specials, and
  bot-walks the entire three-act road to the epilogue (PART=12 / PART=3 env split —
  the full suite outgrew one 10-minute window). smoke/qa unchanged and green.
- Faithfulness note: the recorded warlock-bio clip says "his" (the original male
  warlock); subtitles stay faithful to the audio, per "same story and voice overs."

## STORY REWRITE + VESSIA'S VOICE + VILLAIN DIALOGUE + QoL (2026-08-05, same day)
Hiro's batch: forest music for act 3, energy rollover, rewrite the writing into a
better story, re-voice the warlock with a NIGERIAN WOMAN's voice (ElevenLabs credits
offered), and give the bad guys fight dialogue.

- **Facing hotfix first** (Hiro caught the Road Gunner facing away mid-fight): the
  exhaustive per-anim audit at FULL scale found gunner idle/walk/hurt/death natively
  face RIGHT (attack aims left — the inverse of the caster pattern) → those four sets
  now bundle-mirror; and the earlier stitch attack mirror was itself a low-zoom
  misread (his whole set is native-left) → removed. All 14 enemies' five anims are
  now audited and verified in-engine at high zoom. RULE (hard-won, twice): sprite
  facing judgments happen ONLY at full scale, per animation set, never thumbnails.
- **Energy rollover**: unspent energy banks into the next turn's refill
  (combat.startPlayerTurn carries it; "+N carried" float on the orb).
- **ElevenLabs from the cloud**: the ARPG account (key in game/tools/voice_config.json)
  is reachable from the sandbox — Pro tier, ~924k credits. Same lesson as xAI:
  test, don't trust stale "local-only" notes.
- **New voices designed** (saved to the account as "SPIRE <name>", ids persisted in
  build/spire_voices.json): **Vessia** — the warlock, Nigerian woman, rich velvet
  alto, "every sentence a quiet contract" (7YndhGGnzAhn2FtQsPPv); Houndmaster;
  Necromancer (also voices the Pyre); Champ; Roadscum (hook/gunner/gravehand/chain).
  THE WALL speaks through the existing Kargoth voice.
- **The rewrite** (build/gen_story_voices.py — 30 new clips, subtitle table in
  src/voice.js): the story now runs on Vessia's own engine — she is a COLLECTOR who
  hates rivals. Her bio is re-narrated female ("VESSIA. The Pit is about to learn her
  name the hard way."); she answers Marlow ("Then Dren didn't run... I do so hate
  rival collectors."), tracks the ledger out of Act 1 ("ledgers have addresses"),
  and closes the epilogue with a promise ("When I find the hand that writes... I will
  teach it a better trade."). Her signature lines from the original are kept and
  re-performed in her voice (Dead men leave echoes / Open the crates / Patience is
  also a weapon / What spills, spills / worth more as a rumor / the vial replies).
  NPC recordings (Marlow, Quarry Boy, Veiled Woman, Ankunyx, narrator beats) are
  kept as-is.
- **Villains talk in fights**: intro taunts for every human foe (Hook, Gunner,
  Gravehand, Chain, Pyre, THE WALL's "STAY. OUT." in Kargoth's bass), and full
  intro/special/death lines for all three bosses — the Hound Master ("SOUND THE
  HORN!"), the Court Necromancer (names the Matron; dies on "it only... re-letters",
  echoing Cookie's canon line), the Champ ("MORE! Bring me MORE!"). FightScene plays
  boss exchanges in order (her line, then his), special lines as the move fires,
  last words over the death animation. Monsters (hound/skel/brute/beast/stitch/wight)
  stay wordless.
- **Forest music**: Act 3 now scores with an ElevenLabs-Music-generated 120s dark-
  forest track (assets/music/forest.mp3, ~1.9MB) instead of reusing city.mp3 —
  SPIRE_MUSIC gained a third track and ACTS[3].music = "forest".
- All suites re-run clean (smoke, qa, full three-act road). Voice bundle: 43 clips
  (13 original recordings kept + 30 new); audio bundle: 3 tracks.
- **QA repass (same day, on Hiro's "qa")**: static integrity — all 43 VO ids
  referenced in code exist in both the subtitle table and the built bundle; all 3
  music keys present. Dynamic — smoke ✔, qa ✔, every-enemy + every-special sweep ✔,
  full road ✔ (one bot run cleared to the epilogue; a second bot run DIED to the
  Champ at turn 18 — defeat path exercised; noted as final-boss difficulty, not a
  bug: the greedy test bot plays no defense, and Devour's heal+Str outlasts weak
  decks). Energy rollover asserted numerically: 3 unspent -> 6 next turn; partial
  spend 5 -> 8. No JS errors anywhere.

## ART QA PASS (2026-08-05, Hiro's "qa the art")
Automated lint (build/art_lint.py) over every bundled frame — edge-cuts, stray
blobs, green fringe, faint "ghost box" alpha, caption remnants — then zoomed visual
review of every flag. 243 flags; nearly all are BY DESIGN (bolt/aura FX legitimately
scatter and fade; Vessia's "green fringe" is her sash; su/as/dr "text" blobs are
toes/tails/claws; coldbolt/lightbolt beams run to the frame top on purpose;
wl_bigcast's spell arc reaching the canvas edge is the generated art's crop).
FOUR real defects found and fixed:
- **hd_fadehit_8** carried a whole BAKED DRAGON cameo flying over the downed hound
  (an embedded-cameo remnant the frame-cherry-pick missed — it double-rendered with
  the engine-sequenced dragon). Removed via a targeted CLEANUP table in
  build_assets.py (region-scoped stray-component removal at bundle time).
- **bs_arrowhit_3** had a baked skeletal-archer figure at its left edge. Same fix.
- **bs_arrowhit 1/3/7/8** carried MAGENTA chroma residue (hot-pink ground pools +
  rim spill from the magenta-screen generation). Bundler now keys the hot pink and
  despills the rim — what remains reads as dark blood.
- **The Dancer** still showed a white chip of the sheet's "1..6" caption digits
  under her waist (the digit overlapped her body, surviving the row cut). Digit
  scrub added to tools/slice_dancer.py (bright-near-black removal in the bottom
  band) and applied to the shipped frames.
All repairs live in the BUNDLER (reproducible from untouched sources) except the
dancer frames, which are scrubbed at slice time. Bundles rebuilt; smoke clean.

## STITCHER VOICE + TACTICAL MAP (2026-08-06, Hiro's direction)
**The Stitcher speaks.** He was the one act-2 regular with no lines while ambushing
Vessia in a night alley — now he's a Jack-the-Ripper type: a new ElevenLabs-designed
voice ("SPIRE Stitcher": back-alley surgeon's whisper, soft wet courteous menace),
two clips (e_st_intro on engage, e_st_mend on his Mend Flesh special), wired through
the same vo pipeline as every other villain. Voice id persisted in build/spire_voices.json.

**Tactical map lanes.** Loot is never free anymore. generateMap() now hand-wires a
fixed 5-row, two-lane graph per act (see the diagram comment in src/run.js):
- FIGHT lane (left): easy foes only (fightPool[0..1]), pays in a REST site and the
  act's story stop (tavern/inn/cage).
- LOOT lane (right): skip the easy fights, grab cache #1 — and walk straight into
  the act's ELITE guarding it. Cache #2 sits in the boss's shadow, reachable ONLY
  past the elite. Elites/bosses are the "tough fight right after loot".
- The ??? gamble threads the middle: it can bail to the story stop or throw you at
  the elite. Its fight rolls use the skipped row-1 easy enemy (never a duplicate).
- fightPools reordered easy→hard per act so slice(0,2) = the easy pair.
INVARIANTS (validated over 900 generated maps × all enumerated paths): every path
fights 2–3 times before the boss; every treasure's successor is an elite or the boss;
all nodes reachable; exactly one story stop; no enemy repeats. Treasure tooltips
now warn lane-aware ("watched by the elite" / "in the boss's shadow").
Full-road bot run: took the loot lane all three acts, ate elite+boss each act, cleared.

## PURGE-AT-SECOND-CACHE FIX (2026-08-06, Hiro's bug report)
"PURGE A CARD" at a second treasure cache did nothing. Same Phaser instance-reuse
class as the ActClear `_adv` bug: TreasureScene.purgeGrid() guards on `this._grid`,
which survived from the FIRST cache (the object was destroyed with the old scene,
but the reference wasn't), so every later purge click silently returned. Fix:
`this._grid = null` in create(). Swept every scene for the same pattern and fixed
one more latent case: FightScene's discard-pile viewer (`_pile`) + intent tooltip
(`_intentTip`) now reset in create() too — a fight ending with the pile open would
have swallowed the next fight's first pile click. Regression: purged at three
consecutive caches (deck 16->15->14->13), +8-maxHP choice re-checked, smoke clean.

## ATTACK-FACING FRAME AUDIT (2026-08-06, Hiro's bug report)
"Some enemies face the wrong direction when attacking." Exhaustive in-engine audit:
booted all 15 enemies, froze EVERY frame of every attack set (66 frames), screenshotted
each, judged at full zoom (never thumbnails — the standing rule). Four bad frames, all
tail/recover frames the sheet generator flipped against their own set:
- br_attack_4 + br_attack_5 (brute follow-through/recover faced RIGHT)
- bs_attack_4 (beast recover: natively LEFT in a natively-RIGHT set, so the runtime
  flip rendered it facing away)
- gn_attack_5 (gunner lower-the-musket recover faced RIGHT)
Fix: new MIRROR_FRAMES table in build_assets.py — per-FRAME mirrors applied after
CLEANUP and before any whole-set mirror flag, so frames in mirrored sets net-unflip
correctly. All other sets (hound/skel/master/hook/stitch/grave/necro/chain/pyre/
wight/door/champ) verified clean frame-by-frame. Bundles rebuilt; the four frames
re-captured in-engine facing the player; smoke clean.

## LIFE-STEAL PACKAGE + FACING SWEEP II + HIRO'S OWN MUSIC (2026-08-06)
**The Drain archetype.** New mechanic: THIRST (player status; every landed hit heals
that much — per hit, so multi-hit cards drink deepest; lasts the fight). combat.js
heal() now returns the amount actually restored and tracks healedThisTurn. Six new
cards: Red Thirst (uncommon, +2 Thirst), Leech Lash (common, 8 dmg heal half),
Hemorrhage (uncommon, 10 dmg, 15 if you healed this turn), Scarlet Ward (uncommon,
heal 6, excess becomes Block), Exsanguinate (rare, 4x4 dmg heal all dealt),
Crimson Feast (EPIC, tavern pool: 12 dmg, heal dealt, excess raises MAX HP).
Two NEW warlock animation sets generated via xAI edit from the approved newwarlock
idle reference (art-pipeline rule: scaled off the greenlit anchor, magenta-keyed,
silhouette-height-normalized): wl_drain (crimson siphon) + wl_bloodrite (rune
ritual) — sources in game3d/assets/sprites/warlock/forms/newwarlock/, generator
build/gen_lifesteal_anim.py. All six cards verified headless: thirst stacks, fed
bonus, overheal->block, overheal->maxHp all asserted. UNREVIEWED until Hiro
greenlights the look in-game.

**Facing sweep II (Hiro: "some enemies face the wrong direction when attacking"
+ risen-summon report + Chain screenshot).** Frame-by-frame in-engine audit of ALL
attack, walk, hurt, death sets (15 enemies, ~200 frames, full-zoom judged):
- Per-FRAME flips (new MIRROR_FRAMES table): br_attack 4+5, bs_attack 4, gn_attack 5
  — recover frames the sheet generator flipped.
- Whole-SET flips (ANIMS mirror flags): sk_walk, ms_walk, ch_walk, br_hurt, nc_hurt,
  ch_hurt, dr2_hurt, ch_death, dr2_death — all natively RIGHT vs their left-facing kin.
  sk_walk was the "necromancer summon faces wrong way" bug (the Risen thrall walks in
  on sk_walk; also fixes the Champ's devour thrall + enemy walk legs). ch_hurt was
  Hiro's forest screenshot. Verified fixed in-engine after rebundle.

**Music is HIS now.** The old arena/city/forest.mp3 were ElevenLabs-generated
(/v1/music) — Hiro wants only his own tracks from OneDrive/TTRPG/Kenji/music.
Per his own music_map.json semantics: arena = "Smile in the Fire Kenji battle
theme 1" (contexts.combat), city = "City That Knows Your Name Varenholm 2"
(Varenholm night), forest = "Hunter's Breath forest night" (forest night).
Converted wav->mp3 128k ON HIS MACHINE (device VM ffmpeg) straight into
game3d/assets/music/ (source of truth updated in place), restaged, rebundled.
If future acts need more slots, pick from music_map.json contexts first.

## FULL STORY REWRITE — CANON TO THE BOOKS (2026-08-06, Hiro's direction)
Hiro: "re-read books 1-4 and rewrite the game... 20 years after book 4." All four
books read end-to-end (4 parallel readers -> story bibles), plus the ARPG's
docs/LORE_BIBLE.md (the Ankuspawn Conspiracy — Hiro pointed to it as the current
world info). New story in STORY.md: the game is the Karridge arm of the Cult of
Anku's harvest, 20 years post-Book-4. Hiro's calls: the Dancer IS Cookie (epilogue
cameo, "the Firebird of Varenholm"); Vessia stays an original character
(Ashenveil-schooled exile); the villain is the Matron's pipeline per LORE_BIBLE
guardrails (conspiracy survives, Emperor never learns, no canon deaths). New boss
twist: the Champ IS the vanished champion — he signed. All VO ids renamed to
readable keys (m_*/n_*/b_*/q_*/c_*), 31 lines rewritten + newly voiced (4 new
ElevenLabs designs: Marlow, VeiledWoman, QuarryBoy [brief reworded past a safety
block], Firebird), 15 clips kept. ACTS table, NodeScenes (inn/cage/buyer/epilogue,
Firebird tavern copy), TitleScene comment updated. 46 clips bundled; smoke +
full-road bot CLEAN to the epilogue.

## IDLE-FRAME FACING FIX (2026-08-07, Hiro's bug report)
"Pit brute faces the wrong way when he attacks" — not the attack frames (fixed
earlier and re-verified): it was his IDLE LOOP. The 07-30 facing audit judged only
idle frame 1 of each set; mid-loop frames were never checked. During the brute's
turn (and any pause at his spot) br_idle_2 flashed him facing RIGHT every third
frame of the 6fps loop. Full per-frame idle audit of all 14 enemies found three
flipped frames: br_idle_2, ch_idle_1, ch_idle_2 (the Chain's head-turn frames).
Added to MIRROR_FRAMES; every other idle frame verified clean at zoom. With this,
EVERY frame of EVERY set (idle/walk/attack/hurt/death) of every enemy has now been
individually audited in-engine. Bundles rebuilt (enemies2 = brute, enemies4 =
chain), fixes re-verified paused in-engine, smoke clean.

## LEDGER CLARITY PASS (2026-08-07, Hiro: "it sounds like inane drivel")
The story leaned on "the ledger" without ever defining it. Fixed in 6 lines
(re-voiced): Vessia's FIRST scene now defines it plainly (the cult's catalog of
gifted people - name, gifts, asking price - written by scouts, collected against
by the new-moon wagons); w_boss1 calls it "a shopping list of PEOPLE"; w_act1_out
gives the act-2 logic (the book must reach its buyer, so it can be followed);
w_patience explains why she can't just tell the Emperor (one page isn't the book,
and the writing hand would start a new one); e_cp_intro makes the Champ's betrayal
concrete ("my gifts, my price - and I LIKED the number"); w_epilogue lands on her
own page. STORY.md now carries a LEDGER paragraph. Bundle rebuilt, smoke clean.

## TSUBAKI — THE SECOND PLAYABLE CHARACTER (2026-08-08, Hiro's samurai ref)
Full second playthrough from tools/refs/samurai.png (the greenlit reference):
- ART: 62 Tsubaki frames (idle/walk/hurt + ONE SET PER CARD x12) edit-generated
  from the ref; 71 Tempest School frames (ninja/archer/monk/sorcerer x full sets)
  via the established enemy pipeline. Generator: build/gen_samurai_art.py.
  Per-frame facing audit passed (one fix: kd_openred_4 mirrored). UNREVIEWED
  until Hiro greenlights in-game.
- ENGINE: bleed (enemy DoT, pierces block), focus (+energy next turn), riposte
  (answers guarded attacks once), card play-conditions (cond(C) gates: 1st turn /
  odd turns / bleeding foe). Character system: Spire.CHARS, newRun(charId),
  per-char decks + card pools + ACTS tables (ACTS_K), dynamic player sprite
  prefix everywhere, Title character select. Buyer node is warlock-only; tavern/
  inn/cage have per-char VO; Epilogue branches (Varenholm vs the Ashenveil).
  BUG FIXED: card id injection ran before the samurai defs (null in draw pile ->
  renderHand crash); generateMap read Spire.ACTS directly (her run got Vessia's
  pools) -> now Spire.act().
- CARDS: 12 (firstcut/crossveil/patientdef/observe/ieyasucounter starters;
  sneakopening/arterycut commons; oddhour/openred/perfectparry uncommons;
  ichigeki rare; tsubakibloom epic). STARTING_DECK_K.
- STORY+VOICE: her cult-side road (see STORY.md); 26 new lines, 5 new ElevenLabs
  designs (Tsubaki/Longbow/IronPalm/StormSage/Shinobi). 72 clips bundled.
- ENEMIES: ninja (act1 regular), archer/monk/sorcerer (her act bosses), Tempest
  School lore. New bundles assets_samurai.js + assets_enemies5.js (in HTML).
- TESTS: mechanics probe (bleed ticks, focus pays, riposte, all four conditions
  gate correctly), full samurai road CLEAN to her epilogue, warlock road re-run
  CLEAN (regression), smoke clean. Harness: PART=3 CHAR=samurai.

## TSUBAKI POLISH PASS (2026-08-08, Hiro's playtest report)
Three root causes behind "still images / same attack / tiny shinobi":
1. Spire.LOOPING (anim.js) never learned the new sets -> kd/nj/ar/mk/ss idles and
   walks played ONCE and froze everywhere (title select, fights). Added all ten.
2. The new source frames were bundled FULL-CANVAS (the generator keys but never
   crops); load_anim's centroid registration expects individually-cropped frames
   like every older set -> figures rendered small inside big invisible canvases
   (the shinobi worst). All 133 sources tight-cropped to silhouette; rebundled.
3. KD_DASH played each card's unique anim at DASH-START; it finished (froze) by
   arrival, so every attack visually read as the same dash. Now: dash on kd_walk,
   play the signature anim AT the enemy with a wind-up beat and a follow-through
   hold; card-set frame rates slowed (10ish fps, ichigeki 7) so 4 frames read.
Story-scene figures (Story/Inn/Cage/ActClear/Buyer) were still hardcoded wl_idle
-> now Spire.char().prefix (the samurai intro no longer shows the warlock).
Verified in-engine: pixel-diff proves title + fight idles animate; four card
strikes visibly distinct; ninja death plays; smoke + mechanics probes clean.

## MUSIC + TSUBAKI ROAD REDESIGN + SERA CANON (2026-08-10)
Music now 100% Hiro's own tracks (Kenji/music), six per-char keys converted
wav->mp3 128k ON-DEVICE (device VM has ffmpeg): warlock w_pit "Hunter's Breath",
w_city "The Shop That Watches Back", w_forest "Counting Shadows"; samurai k_pit
"Ronin battle theme", k_city "Pocket Riot", k_fortress "Dragon's Daughter".
Tsubaki's road restructured (run.js ACTS_K): act2 = BRASSVEIL, THE LIT CITY
(cyber/magic-fantasy-punk; new bg_bv_far/mid art; intro VO n_bv), act3 =
DRAKESPIRE KEEP (storming Kenji's fortress; he is NOT there — clearText lands
that beat; new bg_fort_far/mid art; intro VO k_fortress; pool ninja/gunner/chain,
elite sorcerer, boss SERA).
SERA CANON PASS (agent sweep of Books 1-3): she is a RAPIER duelist, not a
longsword knight. Rebuilt her def (enemies.js): Twin Fang 7x2 / Sera's Cage
block 13 / Arresting Thrust 13 / The Cage Predicts +3 str / Breach Ray 6x3;
death = YIELD (alive, canon guardrail). All 18 frames regenerated to canon look
(short dark hair, olive skin, scout leathers, blue sash, rapier + violet force
blade), facing LEFT, tight-cropped. e_sr_intro re-recorded with the
held-a-city-fifteen-days callback; e_sr_yield sends Nyx her warning.
TSUBAKI IDLE FIX (Hiro: "turning over and over, glitchy"): old idle was four
unrelated poses at 8fps. New: ONE anchor pose (3/4 to viewer, head toward the
enemy) + three breathing-only EDITS of that frame; Spire.YOYO set (anim.js)
gives kd_idle/sr_idle yoyo:true at 4fps. Verified in-engine via 500ms samples.
xAI budget: ~$4.4 -> spent ~22 images this pass; generators capped at 3 retries.
Full samurai road test CLEAN with the new act structure (boss hop -> sera).

## TAVERN HANG FIX (2026-08-11, Hiro's report)
Black screen entering the tavern as Tsubaki: epicChoices' top-up loop
(`while (out.length < n && rarePool.length)`) never terminated once every
unique rare was already picked — the samurai has exactly 1 epic + 1 rare, so
the third slot looped forever. rewardChoices had the same latent pattern.
Fix (run.js): rewardChoices removes all copies of a pick from the pool;
epicChoices takes from a shuffled rare list then tops up from uncommons —
both loops now provably terminate. Verified headless for BOTH characters:
scene creates, 3 choices offered, pick returns to map. (/tmp/tavern_check.js)

## ART BACKEND SWITCH: GROK -> OPENAI (2026-08-11, per Hiro)
xAI Grok is RETIRED for art (key nearly spent). New backend: OpenAI gpt-image-1,
key at game3d/tools/openai_key.txt (xai_key.txt is dead — do not use).
New shared module build/artgen.py: generate(prompt) / edit(prompt, ref_path)
(multipart /v1/images/edits, ref-anchored for on-model consistency) /
key_crop(raw, out) — the identical magenta-key + tight-crop pipeline. Portrait
size 1024x1536 replaces the old 9:16 aspect flag. Both endpoints verified live;
an edit anchored on the samurai ref keyed + cropped cleanly (843x1536 RGBA).
NOTE: gpt-image-1 shades flatter/more graphic than Grok's painterly finish —
when patching frames inside an EXISTING set, edit-chain from that set's own
anchor frames so the style seam stays hidden. Old gen_*.py scripts are
historical records of what was generated; write new generators against artgen.

## UNUSED-ART INTEGRATION + LEVEL BACKDROPS (2026-08-11, "organize the game")
BACKDROPS (OpenAI, $1.50 of the $2 cap, style-approved via sample-first):
bamboo road (act-1 samurai, replaces her Pit act: run.js ACTS_K, new n_bamboo
mapVO, k_boss1 re-written+re-voiced for the road), Brassveil v2 (stronger
magitech-cyberpunk), and the THRONE ROOM — Sera's boss arena only (fortress
grounds for regular act-3 fights; buildArena gates on E.id==="sera").
UNUSED ART NOW IN PLAY:
- Rival samurai (the retired cel-shade set -> sprites/enemies/rival, prefix kd2,
  faces RIGHT so flip:true): KAGEHIME, THE SECOND BLADE — endgame duel after
  Sera (ActClear -> "AT THE BROKEN GATES" story -> Fight kagehime -> Epilogue;
  run._dueled guards; per-move anim support added so Crossveil uses kd2_attack2;
  act bossVO now only fires for the act's own boss). For the warlock she is THE
  MATRON'S BLADE — once-per-run act-3 dark-node ambush (run._bladeMet), the cult
  finally catching the arsonist. 6 new VO lines, new Kagehime ElevenLabs voice.
  Her death set is composed from hurt+counter frames (a yield, no new art).
- Dancer sheets SLICED (tools/refs/dancer_move.png + dancer_in_tavern_poses ->
  sprites/npcs/dancer2): green-outfit belly dance (dc2_dance 10f) some tavern
  nights, white idle others; dcw_bob girl on the back stage; dcx_face emote
  portraits chip in beside a rotating Firebird quip. Broken sheet cells (text
  bleed) dropped: dance 3-4, face 4.
- Warlock FORM shelf: ad_claw now the Devil's Skin strike; DEMONLORD looms
  during Crimson Feast; LICH countersigns Dark Covenant; ARCHWARLOCK mirrors
  Exsanguinate; hound_arrowhit finally bundled -> Marrow Choir's volley reacts.
- MvC-STYLE EX CUT-INS (FightScene.exCutIn + ctx): dim, speedlines, the move's
  own animated art slams across screen with its name; 45% chance a bystander
  remarks. Wired: Ichigeki, Tsubaki Bloom, Devil's Skin, Crimson Feast.
MUSIC: tavern now plays "Trouble By The Hearth morning inn" (tavern.mp3, on-device
ffmpeg), restored to act music on exit.
Tested: both full roads CLEAN (samurai road includes the duel); tavern, kagehime
routing, matronblade boot, cut-in all probed in-engine with screenshots.

## NARRATIVE-DIRECTOR + POLISH PASS (2026-08-11 evening, pre-release rules doc)
DIALOGUE CLEANUP (every line re-read against archetype/clarity/purpose):
- Dead lines removed from the script: the pre-redesign act-3 "k_house" (Tempest
  House) and the stale StormSage duplicate of k_boss3 (Sera's is canonical).
- k_orders re-written + re-recorded (she is ON THE ROAD, not yet in the city).
- Six vtexts that opened cold got opening performance tags and were re-recorded
  (w_boss1, m_backroom, n_coach, n_firebird, n_kclose, n_close).
- PLOT FIX: the samurai act-3 pool no longer has the cult's own road-crew
  (chain/pyre) defending the Emperor's Keep against the cult's blade — garrison
  is now ninja/wight/gunner, and a new narrator beat (n_keepgarrison) explains
  the Tempest School's last contract. Duel balance: full heal before Kagehime
  (bot died 10hp->duel without it; verified healed + routed).
EVERY ENEMY NOW SPEAKS (13 new recordings, 3 NEW ElevenLabs voice designs:
PitBones / PitBrute / FrostWight): hound (the Hound Master bellows from the
stands, warlock-gated), skeleton, brute, wight — and THE BEAST gets a narrator
line ("never anyone's to sell") since beasts don't talk. All wired via vo.intro.
SKIP RULES (Hiro's spec): a click hurries ONE line and silences its audio (the
skip listener now detaches on completion so it can't mute later lines); holding
the button 5 FULL SECONDS skips the whole cutscene — progress bar fades in near
the top, releasing early cancels (Spire.holdToSkip; wired into Story + Epilogue).
Verified headless: click-hurry stays in scene, 2s hold does nothing, 5.4s hold
lands on Map; all 6 new VO clips bundled; wight boots in samurai act 3.
FILE CLEANUP: cloud temp zips/screenshots/logs purged; device-side transfer
temps live in game3d\_to_delete (mount forbids deletion — Hiro empties it).
## ENEMY-INTRO VO BUG (2026-08-11, Hiro: "the ninja said nothing")
Root cause: FightScene's opening-VO block runs inside create(), when Phaser still
reports the scene NOT active — so the `this.scene.isActive()` guard silently ate
every NON-boss intro line, for every regular enemy, since the guard was added.
Bosses only ever talked because their awaited bossVO line outlived scene startup.
Fix: non-boss path waits 450ms before the guard (which then only rejects genuinely
dead scenes). Verified headless: fresh boot AND consecutive reused-scene fights
both fire e_nj/e_sk/e_br intros. Lesson for the harness: run_test never asserted
that Spire.say fired for regular fights — instrument VO calls in future passes.

## Resume-here notes for another model
- Everything self-contained under this folder (`/home/claude/spire` in the cloud session;
  delivered copy in `game3d/deckbuilder/` on Hiro's PC).
- To re-generate asset bundles: `python3 build/build_assets.py <game3d>/assets ./assets`.
- Do NOT re-introduce embedded-cameo reaction frames; frame picks are documented in the bundler.
- The regression/publish skills (game-regression, safe-publish) target the OLD 2D game, not this build.
