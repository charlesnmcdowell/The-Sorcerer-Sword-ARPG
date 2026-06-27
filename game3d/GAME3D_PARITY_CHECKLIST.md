# GAME3D PARITY CHECKLIST — Arena + Warlock (2.5D anime uplift)

## STATUS
2026-06-27 — **Milestone 0 (look spike) VALIDATED.** `game3d/spike.html` + `assets/spike/*` prove the core 2.5D trick: a flat anime warlock lit by Phaser **Light2D** with a baked **normal map** (cool key + green sheol + warm torch fills, contact shadow, additive staff glow) over an **angled 3/4 perspective pit floor**. This makes 2 foundation rows **PARTIAL** (lit caster sprite; angled floor). Everything else is still **MISSING** — `arena.html` (the playable combat scene shell with move + the 4 verbs + a `pit.js`-shaped combat-state object) has **not been built yet**. The RETIRED low-poly true-3D scaffold (`index.html`, `pit.html`, `city.html`, `champions.js`) is being abandoned — ignore it. Source of truth = `game/src/` (original shipped 2D game); all code refs are to `game/src/` unless noted. Block recipe: `game3d/blocks/lit_sprite_2_5d.md`.

2026-06-27 (later) — **REAL SUMMON/TRANSFORMATION ART INGESTED.** Hiro ran `tools/gen_sprites.py` (xAI Grok Imagine, on his PC) and dropped 5 on-model anime sprites: `clawfiend`, `bonedragon`, `blackdragon`, `succubus`, `archsuccubus`. All keyed/trimmed, given auto-Sobel normal maps, capped to ≤512px, moved to `assets/sprites/` (+`_n`), sources archived in `assets/sprites/_src/`. Wired into `arena.html`: preload (array form binds each normal map) + a `demonSprites` Map that lazily makes a Light2D-lit Sprite per summon, swaps bone↔black / succubus↔arch by form flag, and reaps on unsummon; graphics circles kept only as a load-fail fallback. The claw fiend / bone dragon / coven now render as Hiro's real lit creatures.

2026-06-27 (05:4x) — **FULL FIGHTER ROSTER INGESTED — 12/12.** Hiro re-dropped the COMPLETE set into `art_in/`; this run ingested the 5 remaining: `archdevil`, `demonlord`, `lich`, `warlock_hurt`, `warlock_walk` (same pipeline, now banked as reusable `tools/ingest_art.py`: cap ≤512 → auto-Sobel normal → `assets/sprites/<n>.png`+`_n` → archive `_src`). Every fighter (warlock idle/walk/cast/hurt · lich/archdevil/demonlord · clawfiend/bone+black dragon/succubus/archsuccubus) now has a diffuse+normal pair. Preload extended in `arena.html`; **seeded `SPRITE_TARGET_H` world-scale table** (per-type target heights) for the #1 scale-fix bug — table + formula in place, **NOT yet applied** in the draw path. NEXT: apply `displayScale=(HERO_PX*SPRITE_TARGET_H[key])/tex.height` in the hero/demon render + swap hero texture by form/state.

2026-06-27 (15:3x) — **SIDE-ON ROSTER RE-INGESTED (14 fighters) + 2 NEW FOES + warlock render fix.** Per Hiro's BUILD-PRIORITY-OVERRIDE, ingested the full SIDE-ON sprite set Hiro re-dropped into `art_in/` (these REPLACE the old front-facing art), incl. **2 brand-new pit challengers**: `shambler` (zombie brute, targetH 1.15) + `bonearcher` (skeletal archer, 1.05). Pipeline run inline (the mount silently dropped `ingest_art.py`'s stdout+writes when cwd was on the OneDrive FUSE mount, so processed to local tmp → copied each file in → **md5-verified all 28 diffuse/normal files match**). Wired into `arena.html`: `SPRITE_TARGET_H` gained `shambler`/`bonearcher`; preload gained both (array-form normal-mapped). **FIXED the warlock hero render:** the new side-on `warlock_idle.png` is 336×512, but the hero loaded as a hardcoded 256×384 *spritesheet* → `sheetOK` failed → it silently fell back to the OLD front-facing `warlock_diffuse`. Changed it to a plain normal-mapped `this.load.image('warlock',...)` and simplified the create() hero block to use it directly (single still). NEXT: still the #1 SCALE-FIX — apply `displayScale=(HERO_PX*SPRITE_TARGET_H[key])/tex.height` in the draw path (update() line ~793 + demonSprites make), then the side-on 1v1 GG stage flip.

2026-06-27 (15:5x) — **#1 SPRITE SCALE-FIX APPLIED — now PRESENT.** The `SPRITE_TARGET_H` world table is finally wired into the draw path of `arena.html`. Added `HERO_PX=210` + `BASE_R{brute24,dragon18,succubus10}`. HERO: `displayScale = sc·(HERO_PX·SPRITE_TARGET_H[formKey])/hero.height` (was a raw `formScale` that never divided by texture height → huge warlock). DEMONS: `dWorldH = HERO_PX·SPRITE_TARGET_H[type]·(d.r/BASE_R)` × perspective (was `d.r·5.4|4.4|3.8` → tiny dragon); the `d.r/BASE_R` factor keeps the binder/herald per-summon swell. Front-plane result: warlock ≈210px, clawfiend ≈252, dragons ≈420 (tower), succubus ≈168, archsuccubus ≈189. Verified via Read tool (bash served the usual stale truncated tail). NEXT: side-on 1v1 GG stage flip (warlock left/faces-right, one foe right/faces-left, lineup in back, two-fighter HUD).

Legend: PRESENT / PARTIAL / MISSING (vs. the new 2.5D `game3d/` target).

---

## Controls
| Feature | Status | Original ref |
|---|---|---|
| Keyboard move WASD/Arrows | MISSING | `scenes/ArenaScene.js` keydown handler; `combat/pit.js:1173,2303` reads `keys['w/a/s/d']` |
| Attack: J / left-click / `bSlash` btn | MISSING | `ArenaScene.js` (`j`, `pointerAttack`, `bindBtn('bSlash')`); `pit.js doSlash()` :307 |
| Heavy/SUMMON: Q (hold→press) / `bHeavy` (down+up) | MISSING | `ArenaScene.js` (`q`+`heavyRelease`); `pit.js doHeavy()` :1154, `heavyRelease()`:1166 |
| Parry/PORTAL: K / `bParry` btn | PARTIAL | `ArenaScene.js` (`k`); `pit.js doParry()`:351 — `k` bound to `doParry` in `arena.html` and now fires the real PORTAL swap. TODO: on-screen `bParry` button + touch binding |
| Roll/BLINK: Space / right-click / `bRoll` btn | PARTIAL | `ArenaScene.js` (Space, rightButton); `pit.js doRoll()`:1168 — Space + right-click bound to `doRoll`→`blink` in `arena.html` (gated on rollCD/rollT/channel/fade/paralyze). TODO: on-screen `bRoll` button + touch binding |
| Facing/aim toward nearest real foe + mouse aim | MISSING | `pit.js autoFace()`:306, `nearestRealFoe()`:301, `pointerAttack`/`pointerMove` api:3414 |
| Mobile analog TouchStick (left half) | MISSING | `core/touchstick.js`; `ArenaScene.js TouchStick.attach`; `pit.js stick` :2303 |
| On-screen touch buttons (slash/heavy/parry/roll) | MISSING | `ArenaScene.js bindBtn(...)` |
| Per-form button RE-LABELING | PARTIAL | `pit.js updateLabels()`:394 / `setBtnLabel`:393 — `updateLabels()` ported in `arena.html`: shows the active FORM (WARLOCK/ARCH DEVIL/DEMON LORD/LICH) in the `#verbs` HUD, called on every form transition. TODO: real SCYTHE/SUMMON↔CLAW/BITE labels once the devil verb bodies (devilClaw/devilStrike) reroute the verbs |
| Pause (Esc) | MISSING | `core/settings.js PauseUI`:keydown Escape |

## Base Abilities (Warlock)
| Feature | Status | Original ref |
|---|---|---|
| HEX bolt — slows + rots (DoT); 10s CD, herald 3s + STACKS | PARTIAL | `pit.js hexBolt()`:565; herald CD :567; stack :766 — DONE in `arena.html`: real `fireballs[]` bolt (vx/vy 420, r5, kind:'hex'), 10s CD (herald 3s), faces nearest foe, hit→HEXED (10s/15dmg/.5s tick) via `updEnemies`, HEX FIEND STACK +15. TODO: the SLOW on hexed foes (pit.js:1554 dt×0.6 — needs enemy movement/AI first), CONTAGION jump-on-death (:1290), particle trail parity |
| SUMMON channel (PRESS→auto-completes; ladder 3s/4s/6s) | PRESENT | `startChannel()`:573, `releaseChannel()`:577 (no cancel), tick :2285 — DONE in `arena.html`: the real LADDER is now ported into `frame()` — Q press auto-channels; rungs fire on their own at t1/t2/t3 (3s/4s/6s; DEMON LORD .5/1/3s) gated by level + "one alive" (rung1 CLAW FIEND, rung2 BONE DRAGON lv3+, rung3 COVEN lv5+→devil), then `P.channel=null`. `releaseChannel()` is now the faithful pit.js NO-OP. TODO: channel INTERRUPTION on hit/paralyze/silence (needs enemy attacks); coven rung body (succubus) still to port |
| PORTAL — swap places w/ FURTHEST foe, stun it, WARD 3s (herald 7s) | PARTIAL | `portal()`:581 — DONE in `arena.html`: faithful port on `doParry` — filters living foes (no-op if none), 3s CD, `P.ft.rolls++`, sorts FURTHEST-first & swaps positions, `clampArena` both (refactored to take an entity), `e.stunT=0.6`, `P.wardT`=3 (herald 7), WARDED/PORTAL/SWAPPED popups, shake+vibrate+flash. Visuals: ward ring on caster, stun marker on foe, `S.shake`→camera shake. TODO: the WARD actually mitigating incoming damage (needs enemy attacks/AI first); herald 7s verified once evo gating lands |
| BLINK (roll) — teleport 150 back, wide 4s stun, 2.2s CD | PRESENT | `blink()`:951 — DONE in `arena.html`: faithful port — 2.2s CD + 0.25s roll lockout + `P.ft.rolls++`, wide stun loop (any living foe <230px of the DEPARTURE point → `stunT=max(.,4)` + flash + STUNNED popup), teleport 150 back along `P.face`, `clampArena`, `fxBlink` leaf-burst at BOTH ends, `S.shake`→camera shake + vibrate + flash. 4 of 4 verbs now real (HEX/SUMMON/PORTAL/BLINK). TODO: stun fully exercised vs real foe AI once gauntlet roster lands |
| Caster look — robe/staff/book (dark elf, silver hair) | PRESENT | `pit.js drawFighter()` warlock branch ~:2438+; per uplift plan — DONE in `arena.html`: Hiro's **NEW high-res anime dark-elf warlock IDLE still** (`assets/sprites/warlock_idle.png` + `_n.png`, 256×384, silver hair / violet staff+gem / teal-runed black robe / glowing tome) loads as a 1-cell normal-mapped sheet (`WARLOCK_FRAMES=1`, frameConfig 256×384), **lit live by Light2D** (key tracks the warlock); single-frame `warlock_f0` fallback retained. Replaced the earlier lower-res 6-frame sheet. Book + staff clearly read in the still. Minor nit remains: left-facing `setFlipX` does NOT flip the normal-map X (lighting slightly off facing left) |
| CAST pose / cast anim on HEX | PARTIAL | per uplift plan — DONE in `arena.html`: Hiro's **CAST still** (`assets/sprites/warlock_cast.png` + `_n.png`, 256×384 — staff raised, purple arcane lightning, glowing eyes; chroma-keyed from the green-screen `_src`) is loaded via the array form (normal map bound) and flashed for **0.35s on every HEX** via a guarded `castPose()` method called from `fxHexCast`, then reverts to idle. TODO: a real multi-frame cast SHEET; tie pose timing to the actual cast/recover windows; walk + hurt poses still MISSING |
| Potions (health/etc.) | MISSING | `pit.js usePotion()`:53 |

## Summons (+ AI)
| Feature | Status | Original ref |
|---|---|---|
| CLAW FIEND (brute) — melee aggro-soak | PARTIAL | `summonDemons('brute')`:606; AI in `updDemons` :668 — DONE in `arena.html`: real `summonDemons('brute')` pushes a claw fiend into `demons[]` (hp `30+kills*5`, life 18, r24); `updDemons(dt)` brute AI chases nearest foe @95px/s, on contact 1.4s-CD swing → big shove (+70px) + token dmg (herald 2 else 1, ×dmgMul) + `killEnemy`. Smoke-tested (summon→chase→shove drops dummy HP). **ART (2026-06-27): now rendered with Hiro's real lit `clawfiend` sprite** (xAI-gen, on-model; Light2D + auto-Sobel normal map; graphics circle kept only as fallback). TODO: verify size/hp vs live numbers once gauntlet roster lands |
| BONE DRAGON — poison/acid breath = paralytic gas cone | PRESENT | `summonDemons('dragon')`:615; breath AI :682; black-dragon fireball :692 — DONE in `arena.html`: `summonDemons('dragon')` pushes a hovering dragon (`hp 44+kills*6`, ×1.35 herald / ×1.7 binder, life 15, r18); `updDemons` dragon branch = hover + approach/retreat band (>160 close, <100 back off) + 3.2s breath → green cone FX (`fxBreath`) + a lingering `zones[]` gas cloud (r110, 4s); `updZones` gas tick (.5s) refreshes light 2s stun + a hex-strength ACID DoT (`acidT`/`acidDmg 15`) ticked in `updEnemies` (pit.js:1546). **ART (2026-06-27): now rendered with Hiro's real lit `bonedragon` sprite** (Light2D + normal map; ground-glow/shadow/hp-bar kept). The BLACK DRAGON form has its own real `blackdragon` sprite ready — the render auto-swaps `bonedragon`↔`blackdragon` on `d.black`. TODO: black-dragon exploding fireball is coded (`d.black` branch) but only fires under the BINDER evo (not reachable until evolutions land) |
| Lingering GAS zone (paralytic + acid) + `zones[]` sim | PRESENT | `zones[]`:292; gas push :691; gas tick :2364; render :2834 — DONE: `zones[]` array, `updZones(dt)` gas branch (stun + acid refresh), floor render (green puff). Other zone types (fire/venom/frost/bolt/etc.) are enemy-side, deferred to the gauntlet roster (M4) |
| SUCCUBI (coven of 3) — fireball + fire DoT, can heal warlock | PRESENT | `summonDemons('succubus')`:621; succubus AI/fire :728 — DONE in `arena.html`: `summonDemons('succubus')` pushes `3*_cntMul` succubi on an orbit (`slot`, `hp 10+kills*2`, life 14, `cool rnd(.5,2)`); `updDemons` succubus branch orbits the warlock (`slot+=dt*.8`, lerp to a 58px ring), then every 2.2s **MENDs** him (+6, pink `tracers[]` beam) if `P.hp<maxHP()` else hurls a `kind:'fire'` fireball (r6, aoe45, `*1.6` dmg) at nearest foe. Added `maxHP()`/`formHP()`, `applyFire()`, `feedSuccubi()`, `tracers[]`+`updTracers`. **ART (2026-06-27): now rendered with Hiro's real lit `succubus` sprite** (Light2D + normal map; pink aura/hp-bar/mend-beam kept). The ARCH SUCCUBUS form has its own real `archsuccubus` sprite ready — render auto-swaps `succubus`↔`archsuccubus` on a future `d.arch` flag. TODO: arch-succubus fuse/burst + GREEN Sheol variant (herald/Demon-Lord, M8); the `fire`-flag BURN DoT only fires under the herald evo (coded, gated) |
| ZOMBIES (lich raise, 6s) — INFECTION DoT, infected rise | MISSING | `summonZombies()`:1014; zombie AI :645 |
| BONE ARCHERS (lich raise, 8s) — bone-shaft arrows | MISSING | `summonArchers()`:1022; arrow `updFireballs` :761 |
| Demon cap 12 (oldest dissolves) | PRESENT | `summonDemons` while-loop :599 — ported: `while(demons.length>=12){demons.shift()...}` in `arena.html summonDemons()` |
| Demon hurt/death + phylactery freeze | PARTIAL | `hurtDemon`:629, `updDemons` :632 — DONE: `hurtDemon(d,dmg)` + life/hp death (`UNSUMMONED` FX + splice) + REENTRANCY GUARD + phylactery/herald no-timeout conditions wired in `updDemons`. TODO: lich "last dragon falls→mortal again" banner; phylactery actually exercised once lich/dragon land |
| Fireballs/breath/sheol projectile sim | PARTIAL | `updFireballs()`:744 — `updFireballs(dt)` ported in `arena.html` for HEX + **ARROW** (direct, no splash) + **FIRE/blast** branches (direct dmg + `applyFire` if flagged + `feedSuccubi` + **AoE splash** at half dmg, pit.js:773-784). TODO: SLASH (piercing line) branch + the SHEOL-green `applySheol` spread-on-kill (herald/arch territory, M8) |

## Evolutions (lv10 + lv20 panel + gating)
| Feature | Status | Original ref |
|---|---|---|
| EVOLUTIONS data table (warlock branches) | PRESENT | `pit.js EVOLUTIONS`:84 (warlock :103) — DONE in `arena.html`: faithful `EVOLUTIONS.warlock` (lv10 DREADBINDER/HEX FIEND, lv20 LICH SOVEREIGN/ARCHFIEND ASCENDANT w/ `from` gates) + `UNLOCKS_WARLOCK` (lv3/5/8 banners) copied 1:1 (names/focus/desc/kit) |
| lv10 choice: DREADBINDER (binder, DEX) vs HEX FIEND (herald, ATK) | PRESENT | `EVOLUTIONS.warlock[10]`:104; `maybeOfferEvo()`:159 — DONE: `maybeOfferEvo()` offers the 2-card lv10 road at `lvl()>=10`; picking writes `P.evo10` which lights up the dormant `_heraldSummon`/`_binder`/hex-stack/succubus-fire kit |
| lv20 choice gated by lv10: LICH SOVEREIGN (lichlord) / ARCHFIEND ASCENDANT | PRESENT | `EVOLUTIONS.warlock[20]`:113; gate :171 — DONE: `maybeOfferEvo()` filters `E[20]` by `b.from===P.evo10` at `lvl()>=20` (binder→lichlord, herald→archfiend), writes `P.evo20` |
| Evolution PANEL — frozen-scene card UI, click/keys 1-2 | PRESENT | `drawEvoPanel()`:3359, `evoCardRects()`:201, `evoClick`:220, `evoTick`:225 — DONE: Phaser-native panel (`buildEvoUI`/`updateEvoUI`/`clearEvoUI`, depth 200000) drawn from `evoCardRects()` so on-screen rects == hit-test; scrim + name/FOCUS/desc/GRANTS cards; `frame()` returns early while `P.evoPick` (combat FROZEN); keys 1/2 + tap (`evoClick`) resolve; live countdown in the hint. TODO: pixel-match the original card typography |
| AUTO/headless auto-default to road 1 (deadlock-proof) | PRESENT | `evoIsAuto()`:191, `evoTick`:229 — DONE: `evoIsAuto()` (window.QuestNav.mode>=1 / Autopilot.on / headless) → `pickEvo(0)` immediately; MANUAL gets a 30-unit failsafe countdown then auto-picks road 0. Cannot softlock |
| Persist chosen evo (GameState mirror, no re-offer) | PRESENT | `pickEvo()`:178; snapshot persist api:setPlayerSnapshot — DONE: `pickEvo()` mirrors to `window.GameState.player.evo10/evo20` when present (try/guarded); `maybeOfferEvo()` early-returns once the slot is set, so it never re-offers |
| Evo focus stat bonus | PARTIAL | `evoStatBonus()`:269, `EVO_FOCUS_BONUS` — DONE: `evoStatBonus(k)` + `EVO_FOCUS_BONUS=6` ported 1:1. INERT today (faithful: `stat()`/CON-DEX-ATK scaling isn't ported yet — `dmgBonus`=6+kills, `diceN`=lvl), wired to apply the moment stat scaling lands |
| BINDER kit: ×2 horde, ~1.45× size, ×3 dmg | PARTIAL | `summonDemons` `_binder` :603 — code ported & dormant in `arena.html summonDemons` (`_binder`/`_bMul 3`/`_bR 1.45`/`_cntMul`); NOW REACHABLE: picking DREADBINDER at lv10 sets `P.evo10='binder'` → the swell + BLACK DRAGON exploding fireball go live. TODO: verify the ×2 succubus count + lich-extra-dragon vs live numbers |
| HERALD kit: hex 3s+stack, +35% dragon/claw, sheol fire, succubi healed by fire | PARTIAL | :567,601,734-766 — code ported & dormant (`P.evo10==='herald'` branches: hex CD 3s + STACK in `updFireballs`, `_heraldSummon 1.35`, succubus `fire`-flag burn `applyFire`, `feedSuccubi` heal, ward 7s, no-timeout succubi). NOW REACHABLE via HEX FIEND at lv10. TODO: arch-succubus GREEN Sheol spread-on-kill = M8 |
| Unlock banners (lv3 bone dragon / lv5 succubi / lv8 arch devil) | PRESENT | `UNLOCKS.warlock`:75, `gainLevel()`:140 — DONE: `gainLevel()` (called on `killEnemy`, +1.5/kill cap 20) fires the `UNLOCKS_WARLOCK` banner + popup + vibrate on each integer level-up; DEBUG **L** key climbs levels until the gauntlet's real kill-growth lands (M4) |

## Transformations
| Feature | Status | Original ref |
|---|---|---|
| LICH / reaper (on death w/ bone dragon flying) — scythe, FADE, unkillable-while-dragon, 3-stage channel→resurrect | MISSING | `enterLich()`:970, `lichSlash()`:998, `fade()`:991, `resurrectWarlock()`:980, `lichPerish()`:986; binder bigger reaper :971 |
| BLACK DRAGON (binder) — black body + green underglow, exploding fireball + acid | PARTIAL (art ready) | `summonDemons` `_binder` dragon :616; `d.black` fireball :692 — **ART (2026-06-27): real `blackdragon` sprite ingested + wired** (render swaps bone→black on `d.black`). Logic still gated behind the BINDER evo (not yet reachable). |
| ARCH DEVIL (herald) — devil form ~21s, CLAW/BITE, taunt cinematic + VO | MISSING | `enterDevil()`:792, `devilDur()`:789, `devilClaw()`:903, `devilStrike()`:917, outro cine `archDevilOutro()`:825, `drawArchCine()`:889 |
| DEMON LORD (herald terminal in-fight; resets next fight) — black+green, ×3 demons, −3s summon, auto-arch succubi | MISSING | `enterDemonLord()`:806; `_cntMul` demonLord×3 :605 |
| ARCH SUCCUBUS — black+green, GREEN Sheol burst (no ally harm, survives, no timeout) | PARTIAL (art ready) | arch logic `updDemons` :700-723; herald survive :721; spawn :626,932 — **ART (2026-06-27): real `archsuccubus` sprite ingested + wired** (render swaps succubus→arch on a future `d.arch` flag). Burst/Sheol logic = M8. |
| SUCCUBI fed by fire — immune + max-HP up (the BITE ascends one) | MISSING | `devilStrike` heal/ascend :930; fire-heal in succubus AI |
| Per-form HP modifier (devil 1.1 / lich 0.8) | MISSING | `formHP()`:66, `maxHP()`:73 |

## Systems (AUTO / music / volume / options / HUD / pause / result)
| Feature | Status | Original ref |
|---|---|---|
| AUTO toggle F10 / button — OFF→FIGHT→FULL | MISSING | `ArenaScene.js cycleAuto`; `core/questnav.js cycleMode()`:16 |
| Autopilot bot (drives warlock kit incl. lich plan) | MISSING | `core/autopilot.js frame()` — warlock branch |
| AUTO board-linger + auto buy-out + auto victory-leave | MISSING | `autopilot.js` board:; `ArenaScene.js update()` autoLeave/vicAuto |
| MUSIC — per-char pit track (warlock=dungeon), title/fight switching | MISSING | `core/music.js MusicMan.play()`; `ArenaScene.js update()` pitTrack |
| Music MUTE ♪ toggle + persisted (`ss-arpg-muted`) | MISSING | `music.js toggleMute()` + `_syncBtn` |
| VOLUME sliders (music + voice), persisted | MISSING | `core/settings.js show()` slide(setMusicVol/setVoiceVol) |
| OPTIONS / Settings panel (⚙) + credits + NEW GAME wipe | MISSING | `core/settings.js SettingsUI` |
| HUD: HP bar | MISSING | `pit.js` UI.hpbar :2418; `ArenaScene.js ui.hpbar` |
| HUD: cooldown overlays (roll/slash/heavy/parry, per form) | MISSING | `pit.js` UI.cds :2421; `ArenaScene.js ui.cds` |
| HUD: level / kills / dice readout | MISSING | `pit.js` UI.stats :150,2419; `ArenaScene.js ui.stats` |
| HUD: nickname/name | MISSING | `pit.js` UI.name; `computeNickname()`:2004 |
| Banners (showBanner) + flash + popups + screen shake + vibrate | MISSING | `showBanner()`:1383, `flashFx`:1382, `popup`, `vib`:32 |
| Boss bar (fights ≥18) | MISSING | `pit.js` UI.bossbar :2420; `ArenaScene.js ui.bossbar` |
| Onboarding hints overlay | MISSING | `core/settings.js OnboardUI` |
| RESULT / shareable card (victory/death/credits PNG, Web Share) | MISSING | `core/settings.js ShareUI.make()` |
| Build stamp / stale-cache self-heal | MISSING | `main.js` :8 version, :15-31 build.txt self-heal |

## Transformations (M8)
| Feature | Status | Original ref |
|---|---|---|
| ARCH DEVIL — enter/exit + duration (15 / herald 21 / archfiend 31) | PARTIAL | `enterDevil()`:792, `exitDevil()`:800, `devilDur()`:789 — DONE in `arena.html`: faithful `devilDur()`, `enterDevil()` (lv<8 gate, `P.devilT`, `P.r=24`, flash/shake/vib/leafBurst/banner/updateLabels), `exitDevil()`. The `devilT` timer ticks down in `frame()` → `archDevilOutro()` on expiry. Coven rung calls it (non-Demon-Lord). Visual: hero scales to `P.r` + red tint. TODO: CLAW/BITE verb bodies (`devilStrike`:917/`devilClaw`:903) + per-form HP ×1.1 in combat |
| ARCH DEVIL outro cinematic (taunt → cast-down) + VO | PARTIAL | `archDevilOutro()`:830 — DONE: HERALD road fully ported (taunt banner + VO via VoiceMan-if-present → `enterDemonLord()` after 3s; per-fight `archCineFight` guard; `archLastTaunt` no-repeat). NON-HERALD: faithful taunt/seraph/cast-down BANNERS + VO, then revert. TODO M8: the seraphim DESCENT visual (`drawArchCine`:881) + the guaranteed-Lich pipeline |
| DEMON LORD — terminal black+green form | PARTIAL | `enterDemonLord()`:807 — DONE: ported 1:1 (terminal flags reset, `P.r=27`, green banner/popup/FX, `updateLabels`); reached via the herald outro or the Demon-Lord summon ladder. Visual: bigger silhouette + green tint. TODO: the .5/1/3s summon-ladder timings already exist; verify the black+green coven (arch succubi) once that art/logic lands |
| LICH / reaper — death-while-dragon-flies form | MISSING | `enterLich()`:970 (scythe, FADE, 3-stage resurrect, unkillable-while-dragon) — binder road |
| ARCH SUCCUBUS burst + GREEN Sheol fire | MISSING | `updDemons`:700-723; devil `devilStrike` arch-fuse :925 |

## Scene / Flow
| Feature | Status | Original ref |
|---|---|---|
| Intro / character demo (automated showcase + bio + VO) | MISSING | `startIntro()`:2175, `DEMOS.warlock`:~2120, `BIOS.warlock`:2089, `demoReset()`:2158 |
| Title screen + torchlit backdrop (embers/fog/torch glow) | PARTIAL | `ArenaScene.js makeTitleBackdrop()` / `updateTitleBackdrop()` — spike.html has the **angled 3/4 pit floor + torch/sheol Light2D glow + vignette**; MISSING: title UI, embers/fog particles, animated torches |
| Gauntlet ladder — 21 fights (THE DOOR … BELLOW'S SECRET) | MISSING | `pit.js FIGHTS`:1389; `spawnFight()`:1455 (scaling :1456) |
| Fight board (foe taunt/record/odds/stat table/buy-out) | MISSING | `toBoard()`:1951; `ArenaScene.js ui.screen('board')` |
| startFight / win / lose flow + death hints + quotes | MISSING | `startFight()`:1965, `winFight()`:2043, `lose()`:2054 |
| Victory screen + purse payout + city handoff | MISSING | `winFight` victory :2048; `ArenaScene.js handoffToCity()` |
| Bellow buy-out (leave after fight 3, +150 copper) | MISSING | `toBoard` canLeave :1961; `ArenaScene.js leaveArena()` |
| Level/kill growth, stat scaling, dice | MISSING | `gainLevel()`:140, `stat()`:52, `diceN()`:289, `maxHP()`:73 |
| Save/continue + zone routing | MISSING | `core/save.js`; `ArenaScene.js continueBtn` |
| Enemy AI roster (door/hook/chain/pyre/gunner/grave/stitch/master/hound/necro/champ/beast) | MISSING | `pit.js mkEnemy` + enemy update :1597+; `FIGHTS` spawn fns |
| Mobile + desktop layouts (DPR 0.55 chunky buffer, IS_PHONE) | MISSING | `ArenaScene.js create()` DPR; `OnboardUI` IS_PHONE branch |

---

## NEXT GAP TO CLOSE
**Port the ARCH DEVIL VERB BODIES — `devilClaw()`:903 + `devilStrike()`:917 — so the form actually fights.**
The TRANSFORMATION LIFECYCLE is now IN (this run): `devilDur()`/`enterDevil()`/`exitDevil()`/`enterDemonLord()`/
`archDevilOutro()` ported 1:1 into `arena.html`, the `devilT` timer ticks down in `frame()` → outro on expiry,
`updateLabels()` shows the active FORM in the HUD, and the hero scales + tints by form (devil red / lord green).
The HERALD outro → DEMON LORD path is fully self-contained and complete. DEBUG **V** key vibe-checks the devil
(press again → outro). What's still stubbed/missing:
- **devilClaw/devilStrike** (`pit.js`:903/:917): while `P.devilT>0`||`P.demonLord`, route `doSlash`→`devilClaw`
  (roll-dash to target + 2.0× carve) and `doHeavy`→`devilStrike` heavy BITE, with the arch-succubus FUSE branch
  (`d.arch`/`archT`) and the SCYTHE/SUMMON↔CLAW/BITE button RE-LABELS. This makes the form *playable*, not just
  cosmetic — the natural next piece (the lifecycle that calls it is now live).
- **LICH/reaper** (`enterLich()`:970 — on death while a bone dragon flies: scythe, FADE, 3-stage resurrect,
  unkillable-while-dragon) on the binder road, plus the seraphim DESCENT visual (`drawArchCine`:881) that the
  NON-HERALD outro currently fakes with banners-only.
- **ARCH SUCCUBUS** burst / GREEN-Sheol logic (`updDemons`:700-723) — real sprite already staged + auto-swapped
  on `d.arch`; needs the fuse/burst/Sheol-fire behavior.
- Per-form **HP ×1.1** in actual combat (needs enemy damage / the gauntlet roster).
The other big remaining systems (independent of M8): the HUD (HP/cooldowns/level-kills), AUTO toggle +
autopilot, music/volume/options, and the 21-fight gauntlet roster (M4) that replaces the 2 practice dummies.

---
### (previous gap — DONE this run)
**Port `summonDemons('brute')` (SUMMON, pit.js:606).** Done this run — `demons[]` + `swings[]` arrays,
cap-12 dissolve, count/size/dmg evo mults, `releaseChannel`→claw fiend, `hurtDemon`, `updDemons` w/ reentrancy
guard + brute chase/shove AI, `killEnemy` stub, `banner()` FX, demon+swing render (aura/hp bar/life rim/y-sort).
Syntax-checked + smoke-tested (summon→chase→shove drops a dummy's HP; swings expire).
(Prior run: ported `portal()` PORTAL onto `doParry` — swap-furthest-foe + 0.6s stun + WARD + 3s CD + visuals.)
(Prior run: ported the real `hexBolt()`/`updFireballs` HEX pipeline onto `doSlash`.) Original promote-the-spike notes:
1. **A single combat-state object** mirroring `pit.js`'s player `P` and shared `S` (positions, hp, facing, cooldowns, form).
2. **Move** (WASD/Arrows → `keys`, plus a TouchStick stub) feeding `P.x/P.y`.
3. **The 4 verb entry points** named exactly as the original — `doSlash()`, `doHeavy()`+`heavyRelease()`, `doParry()`, `doRoll()` — bound to J / Q(hold→release) / K / Space, each producing visible FX over the lit warlock.
4. **A `frame(now)` tick** as the per-frame driver.

This is highest-value because EVERY downstream system (HUD bars, cooldown overlays, AUTO autopilot, abilities, summons, transformations, evolution panel) reads/writes that same state shape and calls those same four verbs. Matching the `pit.js` API surface (`combat.P`, `combat.S`, `doSlash/doParry/doHeavy/doRoll/heavyRelease`, `keys`, `stick`, `frame(now)`) now lets the autopilot, HUD, and ability ports drop in 1:1 against `game/src/` without re-plumbing. Target a vibe-check build: lit warlock on the angled pit floor + the 4 verbs producing FX, before adding summons/evolutions.
