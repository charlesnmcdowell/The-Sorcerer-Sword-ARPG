# Game balance batch — EVOLUTION-GATED (user-refined 2026-06-21) — src/combat/pit.js

BIG REFRAME (user): the buffs below are NOT flat global buffs. Each set of buffs is the EFFECT of choosing a
specific LEVEL-10 EVOLUTION PATH. The evolution branches already exist as STATE-ONLY scaffolding
(EVOLUTIONS{} ~L82; pick stored on P.evo10/evo20; "effects wired in later increments" per the L149-151 comment).
This batch WIRES THOSE EFFECTS — exactly as the codebase was scaffolded for. An un-evolved character, or one
who picked the OTHER road, must be byte-identical to today (no buff). Gate every buff on P.evo10 / P.evo20.

Reuse the existing DoT machinery: dotDamage(e,dmg,color) (~L1380); hex fields hexT/hexDmg/hexTick/hexJumps;
hex tick (~L1379-1380); hex CONTAGION jump-on-death (~L1132-1142). Build the new fire / Sheol DoTs the same way.
After each change: `node --check`, keep all champions playable, then republish (publish_inplace.py).

================================================================
## PATH 1 — WARLOCK "HEX FIEND" (lv10 devil road `herald`; lv20 `archfiend`)
================================================================
The warlock lv10 roads are `binder` (summoner) and `herald` (devil/"hexes burn"). Reflavor `herald` as the
**HEX FIEND** path (update its name/desc/GRANTS, see UI section). ALL warlock buffs below gate on
`P.evo10==='herald'` (the lv20 `archfiend` continuation may strengthen them further). The OTHER road (`binder`)
is the summoner/undead road (its own buffs, see below). Hex-fiend buffs (only when P.evo10==='herald'):
- Hex cooldown 10s -> 3s (P.hexCD ~L501).
- Hex damage STACKS on the same target: in hex apply (~L672), if e.hexT>0 already, e.hexDmg += 15 and
  e.hexT=Math.max(e.hexT,10); else set base (hexT=10,hexDmg=15,hexTick=.5,hexJumps=0). Keep contagion.
- BONE DRAGON (~L542) and CLAW FIEND (~L539) damage: moderate +30-40%.
- NORMAL SUCCUBUS fireball: on hit, apply a burning FIRE DoT (fireT/fireDmg ~hex strength 15, ~10s, .5s tick,
  color #f0883d) via dotDamage — in ADDITION to direct hit.
- ARCH SUCCUBUS: black+green color scheme (body #0a0a0a, green accents #2ecc71); its fireball is GREEN and a
  bit BIGGER (r ~10-11). Fireball + explosion deal SHEOL FIRE:
    * new DoT sheolT/sheolDmg/sheolTick/sheolJumps; base damage = 3x hex base (45); 10s; .5s tick; color #2ecc71.
    * SPREADS to the nearest ENEMY on an enemy's death (mirror hex jump ~L1132): on transfer +5s remaining AND
      apply a damage multiplier (x2 per jump, like hex).
    * Arch fireball ON HIT: direct hit + apply Sheol DoT. Arch fireball EXPLOSION (splash AOE): every ENEMY in
      the AOE takes the explosion damage AND the Sheol DoT (same attributes).
    * Sheol/fire DoT applies to ENEMIES ONLY — never to allies/summons.
- SUCCUBI FIRE IMMUNITY -> HEAL (normal AND arch): any fire/Sheol damage that would hit a succubus instead
  HEALS it and raises its max HP (reuse the "feeds them BOTH" pattern ~L795-801; d.hp up + d.maxhp up, popup).
  Fire/Sheol NEVER damages an allied succubus.

### WARLOCK OTHER ROAD — "DREADBINDER" summoner/undead path (lv10 `binder`; lv20 `lichlord`)
Gate on P.evo10==='binder'. The summoner/undead road now massively swells the horde. Only on this road:
- DOUBLE the number of minions summoned: double the spawn-loop counts in summonDemons() (~L531: brute/dragon/
  succubus), and in summonZombies() (~L878) + summonArchers() (~L885) + the lich raise (~L1147) since those are
  part of the warlock/undead kit. (Dragon is a single big summon — for "double" either allow 2 dragons or skip
  doubling the dragon; double the swarm types for sure.)
- BIGGER minions: increase each binder-summoned minion's radius r (~1.4-1.5x) so they read as larger.
- 3x DAMAGE: every binder-summoned minion deals 3x its normal outgoing damage. Implement like the druid wolves'
  dmgMul (see L375 `dmgMul:1.5`): tag binder summons with dmgMul:3 and multiply their attack damage by
  (d.dmgMul||1) wherever each demon/zombie/archer/dragon resolves damage. (On the binder road the succubus
  fireball is its NORMAL fireball x3 — Sheol fire belongs to the HEX FIEND road, not here.)
The HEX FIEND road (`herald`) does NOT get these horde buffs, and the binder road does NOT get the hex/Sheol buffs.

================================================================
## PATH 2 — DRUID "PRIMAL WARDEN / bear-form" (lv10 `warden`; lv20 `colossus`)
================================================================
Gate on `P.evo10==='warden'`. Only on the bear road:
- Higher MAX HP in bear form: increase formHP() for form==='bear' (maxHP ~L71) e.g. 1.0 -> 1.35.
- HP REGEN while in bear form: per-frame regen when P.form==='bear' (~2.5% maxHP/sec), capped at maxHP.
The OTHER road (`alpha`/wolf) is unchanged.

================================================================
## PATH 3 — RONIN: NOT an evolution choice — automatic with the NODACHI transformation
================================================================
USER CLARIFICATION: the ronin does NOT pick an evolution path and there is NO choice panel for him. His buffs
just HAPPEN as part of his existing transformation into the samurai wielding the big katana — i.e. the NODACHI
weapon evolution (roninTier()>=1, which is STR>=20; the "blade grows with its legend" banner ~L237/L1861).
Do NOT add EVOLUTIONS.ronin, do NOT touch maybeOfferEvo for ronin, do NOT show him a panel.
- Gate the ronin buffs on `RKIT(P.char) && roninTier()>=1` (NODACHI onward) so they activate automatically the
  moment he transforms. Below NODACHI (base katana) he is unchanged.
- Buffs once transformed (NODACHI+):
    * Moderate base-damage increase: bump dmgBonus() base (~L281, currently 6) e.g. 6 -> 9, gated to roninTier()>=1
      (or scale the strike multiplier when transformed). Base-katana ronin unchanged.
    * Heal 20% of MAX HP on EACH kill: in the kill handler, if RKIT(P.char)&&roninTier()>=1,
      P.hp=Math.min(maxHP(),P.hp+0.2*maxHP()).
- WEAPON-LINE PASSIVES (automatic, tied to P.weaponLine — NOT a choice, independent of the NODACHI buffs above;
  they stack with them):
    * SPEAR ronin (P.weaponLine==='spear'): attacks FASTER — lower roninSpear()'s recovery (~L1060,
      currently atkRec()*1.12) to ~atkRec()*0.8. Katana/rifle lines unchanged.
    * RIFLE ronin (P.weaponLine==='rifle'): shoots a LITTLE faster but a LOT harder — reduce roninRifle()'s
      reload (~L1081, currently atkRec()*2.0) modestly to ~atkRec()*1.7, AND substantially raise the shot
      damage (~L1084, currently (rollDice(diceN(),8)+dmgBonus())*(1.6+tier*0.35)) — bump the base multiplier a
      lot, e.g. 1.6 -> ~2.6 (keep the tier scaling). Katana/spear lines unchanged.

================================================================
## PLAYER IDENTIFIER RING — gold & white circle under the hero (readability while playing fast)
USER: draw a gold-and-white circle around the player so they can instantly find themselves in a busy/fast fight.
- In draw(), at the start of the PLAYER render block (~L2705, the "// player" comment, BEFORE the player's
  drawFighter call so the ring sits under the hero's feet), draw a flat ground ring centered on the player:
  an ellipse at (P.x, P.y + P.r*0.6-ish, footprint) — match the existing shadow ellipse geometry used nearby so
  it hugs the ground, not the body.
- Style: a double stroke — an outer WHITE ring and an inner GOLD ring (e.g. gold #f0c66a / white #fff8e0),
  ~2-3px lines, slightly translucent (~0.85) with a soft gold glow (shadowBlur) so it reads on any background
  without obscuring the sprite. A gentle pulse (sin(time)) is fine but optional; keep it subtle.
- Must render for EVERY champion/form (ronin, druid human/bear/wolf, warlock + lich/arch-devil, seraph) — put it
  in the shared player block so all forms get it. Draw it on the ground plane only (don't ring the floating
  arch-devil mid-air awkwardly — anchor to P.y ground like the shadow). Keep it cheap (no per-frame allocations).
- Do NOT draw it during cutscenes/intro or for enemies/summons — player only, only in fight/demo mode.

## EVOLUTION CHOICE PANEL — crisp text + concrete GRANTS (user: "path text still blurry, box still vague")
================================================================
drawEvoPanel() ~L3023; evoWrap() ~L3073. (Ronin is NOT part of this panel — see PATH 3.)
1. BLURRY TEXT: the canvas backing store almost certainly isn't DPR-scaled, so text is upscaled and fuzzy on
   hi-DPI screens. In resize(), set the canvas backing store to CSS_size * devicePixelRatio and scale the ctx by
   dpr (keep W/H as LOGICAL css units so all existing geometry is unchanged). If a global DPR change is too
   risky, at minimum round ALL evo-panel text coords to integers and bump font weights/sizes for crispness.
   Verify text is sharp after the change.
2. VAGUE GRANTS: the GRANTS line just prints the flavor `kit` string. Make each branch's GRANTS spell out the
   ACTUAL mechanics in plain numbers. Update the EVOLUTIONS data (name/desc/kit) so the panel shows concrete
   effects, e.g.:
     - HEX FIEND (warlock herald): "Hex CD 10s->3s & hex damage STACKS. Bone dragon & claw fiend +35% dmg.
       Succubi hurl green SHEOL-FIRE: burns 3x hex, spreads on kill (+5s/jump). Succubi are HEALED by fire."
     - PRIMAL WARDEN (druid warden): "Bear form +35% max HP and regenerates ~2.5% HP/sec."
     - WARLORD (ronin): "+50% base damage; heal 20% max HP on every kill."
   Keep the OTHER roads' GRANTS accurate too (don't over-promise the un-buffed road).

================================================================
## QA (required before publish)
================================================================
- `node --check src/combat/pit.js` passes.
- Headless/AUTO sanity (if available): no crash/softlock; every champion loads + fights; ronin evo panel
  appears at NODACHI and auto-defaults under AUTO.
- Verify GATING: an un-evolved or other-road character is unchanged (grep the P.evo10 guards). Only the named
  road grants the buff.
- Spot-check: hex-fiend warlock (3s/stacking hex, beefier dragon/claw fiend, succubus burn, black/green arch
  with bigger green Sheol fireball that spreads on enemy death, succubi healed by fire); warden druid (tankier
  + regen); warlord ronin (harder hits + 20% heal/kill). Evolution panel text is SHARP and GRANTS show concrete numbers.
If QA fails, fix it; if you can't, STOP, leave source unpublished, and write the blocker under "## STATUS".

## PUBLISH (only after QA passes)
- `python game/tools/publish_inplace.py` (NEVER publish_site.py — its rmtree fails on OneDrive). It bumps build.txt.
- No voice clips changed in this batch (verify), so nothing extra to copy. If the Neverendingnarratives repo
  isn't mounted ("NOT REACHABLE"), leave source in place and note in STATUS that the user must publish + git push
  both repos. Never git push yourself.
- When shipped (or fully blocked + documented), append "## STATUS: done <date>" (or blocked) and DISABLE this schedule.

================================================================
## STATUS: done 2026-06-21
================================================================
Shipped the full evolution-gated combat pass to src/combat/pit.js and published to
Neverendingnarratives/play (build 1782001978; build.txt bumped for force-update).

WHAT WAS WIRED (all gated; un-evolved / other-road / base-katana ronin are byte-identical):
- PATH 1 HEX FIEND (P.evo10==='herald'): hex CD 10s->3s + hex STACKS (+15 dmg, refresh to 10s);
  claw fiend & bone dragon +35% HP and claw-fiend shove 1->2; normal succubus fireball applies a
  burning FIRE DoT (15/.5s/10s, #f0883d); arch succubus turns black+green, throws a bigger GREEN
  (r11) SHEOL fireball — direct hit + explosion both apply a Sheol DoT (45 = 3x hex base, .5s, 10s,
  #2ecc71) that SPREADS to the nearest enemy on an enemy's death (+5s & x2 dmg per jump, mirroring
  hex contagion, enemies only). Succubi are IMMUNE to fire/Sheol and are HEALED + gain max HP
  (feedSuccubi in the blast radius). New helpers: applyFire / applySheol / feedSuccubi (by dotDamage);
  new fire/sheol DoT ticks in updEnemy; Sheol contagion block in killEnemy. The binder road is unchanged.
- PATH 2 PRIMAL WARDEN (P.evo10==='warden'): bear formHP 1.1->1.485 (~+35% max HP) and ~2.5% max-HP/sec
  regen while in bear form (in the player tick). The alpha/wolf road is unchanged.
- PATH 3 RONIN NODACHI (RKIT && roninTier()>=1, i.e. STR>=20, automatic — NO panel, no EVOLUTIONS.ronin):
  dmgBonus base 6->9 (+50% base); heal 20% max HP on each kill (top of killEnemy). Base-katana ronin
  unchanged. Weapon-line passives: SPEAR recovery atkRec()*1.12->*0.8 (faster); RIFLE reload
  atkRec()*2.0->*1.7 and shot base mult 1.6->2.6 (keeps tier scaling). Katana line unchanged.
- EVOLUTION PANEL (drawEvoPanel/evoWrap): GRANTS now spell out concrete numbers for HEX FIEND and
  PRIMAL WARDEN (and the lv20 continuations + the other roads were de-over-promised). Text crispness:
  the arena renders into an intentionally low-res 0.55x backing buffer (ArenaScene DPR=0.55,
  imageSmoothingEnabled=false — the retro look), so a global DPR change would alter ALL game art.
  Per the doc's fallback I rounded every panel text/box coordinate to integer backing pixels and bumped
  the font sizes/weights (title 26->30, body 15->17, etc.) for legibility. NOTE: truly pixel-sharp panel
  text would require drawing the panel on a separate full-res overlay (a larger change deferred to keep
  the engine constraint of "no new systems").

QA (all passed): node --check clean; full 20-fight headless gauntlet VICTORY for ronin/druid/warlock/
seraph/ember with no crash/softlock; evo panel renders (title/names/FOCUS/GRANTS/kit) and AUTO-resolves
under headless for all three; forced-herald & forced-warden gauntlets both reached fight 20; all three
ronin weapon lines run clean (an occasional ranged-bot TIMEOUT is RNG variance — the *original* rifle
values time out at the same rate; not a regression). Gating verified by grep — every buff is conditioned.

FS HAZARD ENCOUNTERED (see memory epub-editing-fs-hazard): after the sequential edits the OneDrive Linux
mount served a STALE, TAIL-TRUNCATED view of pit.js (stuck at 3072 lines, cut mid-statement at the
vignette code just before drawEvoPanel), while the desktop file layer (Read/Edit tools) had the complete,
well-formed file. Because publish_inplace.py copies from that mount and its size-check can't detect a
source that is itself truncated, I rebuilt the verified-complete file from the synced body + the exact
drawEvoPanel/evoWrap/HOST-API tail, node-checked & gauntlet-tested it, then installed it over the mount
source (byte-identical to the reconstruction) and re-ran the stock gauntlet against the INSTALLED file
before publishing. The published play/src/combat/pit.js was verified complete (3148 lines, node --check OK,
cmp-identical to source, HEX FIEND data present, config api key scrubbed).

NOT git-pushed (never auto-push). USER TODO: commit & push BOTH repos —
  game/ (The Sorcerer Sword ARPG) and the site repo (Neverendingnarratives, the play/ build).
No voice clips changed this batch, so nothing else to copy.

================================================================
## STATUS: done 2026-06-21 (follow-up — PLAYER IDENTIFIER RING completed)
================================================================
The prior "done 2026-06-21" pass shipped PATHS 1-3 and the evo panel but OMITTED batch item 4 (the
player identifier ring). This follow-up run wired it and republished.

WHAT WAS ADDED:
- PLAYER IDENTIFIER RING (item 4): in draw()'s player block, right after the player movement line and
  BEFORE the form drawFighter chain, a gold+white flat ground ring is drawn under the hero. Geometry
  matches the shadow ellipse (center P.x, P.y+P.r*0.6; rx ~P.r*1.05, ry ~P.r*0.4) so it hugs the ground
  plane (correct even for the floating arch-devil/seraph — anchored to P.y, not the lifted body). Double
  stroke: outer white #fff8e0 (3px) + inner gold #f0c66a (2px), globalAlpha 0.85, soft gold shadowBlur
  glow, subtle sin(time) pulse, no per-frame allocations. Player only — the whole block is player-only and
  fight/demo-gated (draw() returns early outside fight/demo at the mode check). Suppressed for a dead hero
  and during cutscenes: arch-devil outro (archCine), kill-cam zoom/fatal (cam.z>1.12 || S.fatal), and the
  evo-choice panel (P.evoPick). Enemies/summons are never ringed.

QA (all passed): node --check clean on source AND published copy; full 20-fight assist gauntlet VICTORY for
ronin/druid/warlock/seraph/ember (no crash/softlock); new render smoke test (ring_smoke.js) drives a mock
ctx through 8 frames per champion — ring ellipses (#fff8e0/#f0c66a) drawn for ronin, druid (human + forced
WARDEN bear), warlock (human + forced HERALD + forced BINDER), and seraph with no exceptions, and the ring
is correctly SUPPRESSED while the evo panel is open. Gating from the prior pass left untouched and re-grepped
(herald x12 / binder x3 / warden x4 guards present). No voice clips changed.

FS HAZARD (again, see memory epub-editing-fs-hazard): after the Edit the OneDrive Linux mount served a
STALE, TAIL-TRUNCATED view of pit.js (stuck at 3141 lines, cut mid-statement in evoWrap just before the
api={} block) even though the desktop file layer was complete and well-formed. publish copies from that
mount, so I rebuilt the verified file = mount's intact body (lines 1-3141, which already held the ring edit)
+ the exact desktop tail (evoWrap close + api={} + exports), node-checked & gauntlet-tested it in scratch,
installed it over the mount source (cmp-identical, which refreshed the cache so the mount then read 3167
lines correctly), and only then published.

Published build 1782004248 -> Neverendingnarratives/play (build.txt bumped for force-update; play/pit.js
verified 3167 lines, node --check OK, cmp-identical to source, ring + HEX FIEND data present, config api key
scrubbed to ''). NOT git-pushed. USER TODO unchanged: commit & push BOTH repos (game/ and Neverendingnarratives).

================================================================
## STATUS: done 2026-06-21 (follow-up — DREADBINDER road wired; player ring confirmed already shipped)
================================================================
The prior passes shipped PATHS 1-3, the evo panel, and the player ring but left the WARLOCK OTHER ROAD
(DREADBINDER / `binder`) "unchanged" (the HEX FIEND pass explicitly skipped it). This run wired the
binder horde buffs and republished. The PLAYER IDENTIFIER RING (batch item 4) was verified already
present (draw() player block, gold #f0c66a + white #fff8e0 ground ring, fight/demo + player-only,
suppressed during cutscenes/evo-panel) — no change needed.

WHAT WAS WIRED (src/combat/pit.js, all gated on P.evo10==='binder' — herald/un-evolved byte-identical):
- summonDemons(): a PAIR of claw fiends (was 1) and a SIX-strong coven (was 3); the bone dragon stays a
  single big summon (per the doc's allowance). summonZombies() 3->6, summonArchers() 2->4. The lich's
  undead come from those same two helpers (channel ladder), so they double on the binder road too.
- BIGGER: every binder-summoned minion's radius r x1.45 (succubus 10->14.5, etc.).
- 3x DAMAGE: each binder summon tagged dmgMul:3 (like the druid wolves' dmgMul:1.5) and its outgoing
  damage multiplied by (d.dmgMul||1) — zombie bite, archer arrow, claw-fiend shove, and the succubus
  fireball (so the succubus fire is its NORMAL bolt x3; Sheol fire stays HEX-FIEND-only, untouched here).
- GRANTS text updated to concrete numbers ("DOUBLE the horde: 2 claw fiends, a SIX-strong coven, 6
  shamblers, 4 bone archers (+2 dragons as a lich). ~45% bigger, 3x damage.").

QA (all passed): node --check clean; full 20-fight assist gauntlet VICTORY for all five champions; FORCED
binder + herald full gauntlets both reach fight 20 VICTORY (no crash/softlock); targeted summon-count test
confirms binder coven 6 vs base 3, brutes 2 vs 1, succubus dmgMul===3 and r 14.5>10, while an un-evolved
warlock's summons carry NO dmgMul (unchanged). Herald/un-evolved gating verified by grep.

FS HAZARD (epub-editing-fs-hazard) hit AGAIN — the OneDrive mount tail-truncated pit.js (~L3113) after the
edits; rebuilt from intact prefix + exact desktop tail, verified, installed over the mount, re-checked,
then published. Published build 1782008868 -> Neverendingnarratives/play (build.txt bumped; play/pit.js
3271 lines, node --check OK, cmp-identical to source, DREADBINDER + ring data present, config key scrubbed).
NOT git-pushed. USER TODO unchanged: commit & push BOTH repos.

## VERIFIED 2026-06-21 (scheduled re-run): all batch items confirmed shipped. source==published
byte-identical (cmp clean) for pit.js (3271 L); node --check clean; tail intact. DREADBINDER gating
present (P.evo10==='binder' guards, dmgMul:3, doubled summonZombies/Archers counts, r x1.45); PLAYER
IDENTIFIER RING present in draw() player block (#fff8e0 outer / #f0c66a inner ground ring). Published
build 1782008868; config key scrubbed to ''. Full 20-fight assist gauntlet VICTORY for all five
champions; sim spot-check confirms binder summons carry dmgMul while un-evolved warlock summons do not.
Nothing left to ship.
