# Game fixes batch (Hiro 2026-06-21) — src/combat/pit.js + scenes/UI

After each change: node --check; headless/AUTO sanity; then publish (publish_inplace.py + the OneDrive
truncation verify-before-publish ritual: wc -l + tail + node --check; reconstruct head+tail if the mount is stale).

## 0. VERIFY the de-leveling / evolution-panel bug is actually gone (a partial fix already SHIPPED)
Root cause found + fixed: setPlayerSnapshot did NOT restore P.evo10/P.evo20 into combat, so maybeOfferEvo
RE-OFFERED the evolution panel every encounter at lvl>=10 and locked input. Now setPlayerSnapshot restores
evo10/evo20 (pit.js ~L3328) and WorldScene syncs them back (~L610). VERIFY: a lvl>=10 evolved druid/warlock/
seraph NEVER re-sees the panel in later fights; the panel still appears exactly ONCE and is selectable.
- ALSO confirm there is no remaining genuine DE-LEVEL: trace every P.level write; level must be monotonic
  non-decreasing in the world (the cap-20 + Math.max guard is in WorldScene ~L607). If a real de-level path
  remains, root-cause and fix it. If the panel ever DOES open, it must be dismissable in EVERY host (keys 1/2,
  tap an evo card -> pickEvo, and the AUTO/timeout auto-default) — make sure tap hit-testing works on mobile.

## 1. MOBILE ZOOM control (top menu bar)
Problem: on phones the screen zooms too far in (WorldScene forces cameras.main.setZoom(1.18); see ~L190/L210/
L618) and the player can't zoom out.
- Make DEFAULT = 100% (setZoom 1.0), not 1.18. 
- Add a ZOOM control to the existing TOP MENU/HUD BAR (find it in src/ui or CityUI; do NOT overlap the other
  top-bar buttons — place it cleanly). It sets camera zoom over the range 25%..100% (pct/100 -> cameras.main
  .setZoom(pct/100); 100% = default full view, 25% = most zoomed-out). Provide zoom-out + a reset-to-100%.
  Persist the choice (localStorage or GameState.meta) and re-apply it on zone load / after the intro pan and
  after combat (the scene resets zoom at ~L228/L589/L618 — re-apply the player's chosen zoom there instead of
  the hardcoded value). Works in the overworld scenes; keep combat readable.

## 2. RONIN attack overhaul (RKIT) — pit.js doSlash ~L307-318 (combo at `P.combo=(P.combo+1)%3`)
Only the base ronin melee (NOT druid/warlock/seraph, NOT bear/wolf/lich/devil branches).
- 4-ATTACK SEQUENCE (was 3): change the combo cycle to %4. 
  - Attacks 1,2,3: each includes a DASH/lunge FORWARD toward the nearest enemy that covers a LOT of distance
    (close the gap) before the strike — reuse the existing dash-to-target pattern (see the rolling dash ~L839
    `if(tgt&&bd>P.r+tgt.r+12)` and devilClaw). 
  - Attack 4: a BACK-STEP + counter/parry motion (move away from the enemy) that ALSO grants a parry window
    (set P.parryT like the retreat stance ~L332 does). 
- ATTACK SPEED: make ronin feel responsive — reduce the base recovery slightly (atkRec() for ronin, ~L316) so
  taps register quickly. Keep it fair (no infinite stunlock).

## 3. RONIN parry system — pit.js doParry ~L334-339 (P.parryT=2.3, P.parryCD=1.4)
- Parry button still raises the parry animation + shield (parryT window). DURATION unchanged (~2.3).
- ATTACK + PARRY SIMULTANEOUSLY: the parry press must NOT be blocked by an in-progress attack and vice-versa —
  let doParry fire during atkRecover/combo (relax its guards) so the player can attack and parry together.
- TWO parries available: (a) the one GRANTED by finishing the 4-attack sequence (attack 4's back-step stance),
  plus (b) the one from pressing the parry button. They are independent (don't share the same cooldown gate so
  both can be up).
- PARRY RANGE: a successful parry works on BOTH melee (close) AND ranged attacks (bullets/arrows) AND SPELLS/
  projectiles (fireballs, hex bolts, zones). Wherever an incoming hit resolves against the player (hurtPlayer
  call sites + bullet/fireball/zone hit checks), if P.parryT>0 and facing it, it counts as a parry.
- SPELL PARRY EFFECT: successfully parrying a SPELL/projectile CANCELS the spell entirely (negate it — remove
  the projectile/zone, no damage, no debuff applied), STILL plays the blade counter-attack animation/riposte,
  and STILL grants the on-parry health. Net: parry negates incoming spell attacks.

## QA
node --check; headless/AUTO: every champion loads+fights; ronin does a 4-hit dash combo ending in a back-step
parry + is responsive; parry can fire mid-attack; both parry sources work; parrying a melee, an arrow, and a
fireball all succeed and a parried spell is fully negated (no dmg/debuff) while still healing + playing the
counter; mobile zoom control sits in the top bar, zooms 25-100%, resets, and persists; evolution panel never
re-appears for an evolved character and never locks input. Verify other champions unchanged. Then publish.

## STATUS: done 2026-06-21
SHIPPED via `python3 tools/safe_publish.py <Neverendingnarratives>` — gate GREEN (26 src node-checks +
4 smoke + 7 regressions), published build 1782084430 -> Neverendingnarratives/play, post-verify clean
(26/26 published files node-check OK; pit.js 3382 lines intact).

Items 0-3 were ALREADY implemented in source by a prior partial run, but that run never (a) added regression
coverage for the spell-negation / ranged parry / zoom invariants, (b) shipped through the gate, or (c) disabled
this schedule. This run verified each item against source + closed those gaps + shipped.
- Item 0 (de-level/evo panel): setPlayerSnapshot restores evo10/evo20 (pit.js ~L3373); WorldScene caps level
  20 + Math.max non-decreasing sync. `evo-panel-does-not-re-offer` + `level-never-de-levels` stay GREEN.
- Item 1 (mobile zoom): default now setZoom(1.0); 25-100% cycle + reset in the cityhud top bar (index.html
  #zoomOutBtn/#zoomResetBtn, wired in dialog.js CityUI), persisted to GameState.meta.worldZoom + localStorage,
  re-applied on zone load / after intro pan / after combat (WorldScene applyWorldZoom).
- Item 2 (ronin 4-attack): doSlash combo cycles %4; attacks 1-3 dash a big gap into the strike with snappier
  recovery (atkRec*0.85); attack 4 is a back-step finisher granting an INDEPENDENT comboParryT window.
- Item 3 (ronin parry): doParry guards relaxed (fires during atkRecover); button parryT and combo comboParryT
  are independent windows (consumeParry spends one each); parry resolves in the single hurtPlayer choke-point
  for melee+ranged+bullets, and zoneParry for zones/spells — a parried spell is fully negated (zone removed,
  no dmg/debuff) while still healing 20% maxHP and firing the air-slash riposte.

NEW regression cases (tools/smoke_test.js REGRESSIONS[], never delete): `ronin-parry-negates-spell-and-heals`,
`ronin-parry-works-on-ranged-and-melee`, `mobile-zoom-default-100-persists-reapplies` (static source scan, so
item-1 can't silently revert to the old 1.18). Exposed `hurtPlayer` + `zones`/`bullets`/`fireballs` getters on
the combat api as test hooks so spell/ranged negation is asserted deterministically (no flaky frame-driving).

### 5-WHYS — OneDrive tail-TRUNCATION hit twice during this run (pit.js + smoke_test.js)
1. WHY did `node --check` fail after a clean file-tool Edit? The bash mount showed the file truncated mid-last-line
   (pit.js at 3379/3382 lines; smoke_test.js at 80/131) while the desktop copy (Read tool) was intact.
2. WHY was the mount truncated? OneDrive's FUSE mount served a stale/partial copy of a file just rewritten by the
   file tools — the write hadn't fully propagated to the mount's view.
3. WHY does that matter? The gate (safe_publish + node) runs against the bash mount, so a truncated view would
   FALSE-FAIL the gate (or, worse on a write-back, ship a truncated file).
4. WHY didn't it self-heal on retry? The mount stayed stale across sleeps; only a write THROUGH the mount
   refreshed it.
5. ROOT CAUSE + FIX: reconstructed each file from its good prefix (bash `head -N`, which was intact up to the
   cut) + the correct tail (from the Read tool), wrote it back through the mount, and re-verified wc -l + tail +
   node --check before gating. This is the documented OneDrive ritual; the gate's per-file node --check is the
   permanent guard against ever shipping a truncated file. No code logic was changed by the reconstruction.
H bash (the bash write refreshes the mount) → re-verify `wc -l` + `tail` + `node --check`. The gate (size-match + `</html>` checks in publish_inplace, node --check in safe_publish) is the backstop that proves the shipped files are intact.
