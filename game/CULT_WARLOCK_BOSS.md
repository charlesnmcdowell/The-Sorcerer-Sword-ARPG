# Make the druid-story CULT WARLOCK actually fight as the playable Warlock (enemy-only change)

USER INTENT: In the DRUID CROSSING (Varenholm, druid POV) the "cult warlock" who comes for Cookie with cages
is supposed to be the SAME PERSON as the playable WARLOCK champion — fighting with the Warlock's own kit
(summons his succubi AND bone dragon, casts a real HEX, etc.). Right now he is just `type:'collector'`
(a generic silence/slow caster that only pops a "HEXING" label and never summons). 
SCOPE (user confirmed): change ONLY THE ENEMY. The cutscene, voice, dialog, banners, and flow are ALREADY
CORRECT — do NOT touch any of that. Full Warlock kit. Give him the Warlock caster LOOK too.

## WHERE
- Enemy packs to swap: game/src/world/quests.js
  - druidCrossing.warlock.pack  (~L397)  — phase-1 fight  (currently one type:'collector' boss)
  - druidCrossing.rematch.pack  (~L410)  — the rematch    (collector + a 'grave' add; rematch ESCALATES)
  Replace the collector boss with the new `type:'cultwarlock'` boss (keep boss:true, hp/spd/dmgScale, x/y,
  deathCol '#b070f0'). Rematch = same boss but escalated (e.g. flag rematch:true / higher summon rate / 2nd
  dragon). Leave ALL surrounding dialog/voice/banner code untouched.
- New enemy AI + look: game/src/combat/pit.js

## NEW ENEMY AI  — add `case 'cultwarlock':` to the enemy AI switch (updEnemyVs, near the other boss cases ~L1712)
Mirror the PLAYABLE warlock kit, but as an enemy targeting the PLAYER. Reuse existing patterns:
1. CASTER KITING: face the player; back off if dToP<200, advance if dToP>300 (like 'collector' ~L1713-1716).
2. SUMMON SUCCUBI (his coven): on a cooldown (~e.summonCD, start ~3.5s, repeat ~5s), if alive enemy-succubi
   < 3, spawn 1-2 enemy succubus minions:
     enemies.push(mkEnemy({type:'esuccubus',minion:true,x,y near him,hp:~70*e.dmgScale,maxhp,spd:90,r:10,
       col:'#502438',dmgScale:e.dmgScale}));  // pink/violet succubus look
   (pattern = the 'necro' raise loop ~L1565-1578.)
3. SUMMON BONE DRAGON: once (and again on the rematch), if no alive enemy-dragon, spawn one:
     enemies.push(mkEnemy({type:'edragon',minion:true,x:e.x,y:e.y-60,hp:~260*e.dmgScale,maxhp,spd:55,r:18,
       col:'#cfc6b4',deathCol:'#7fd05a',dmgScale:e.dmgScale}));  // bone-dragon look, poison-green breath
4. HEX (real, on the PLAYER): on a cooldown (~6s, telegraph ~0.8s with a 'HEX' popup like collector), if
   dToP<320 and not warded/rolling, apply a PLAYER HEX DoT (see below) — NOT just silence.
5. Occasional melee if cornered (dToP<e.r+P.r+30): light hit, like collector.

### enemy minion AIs (add `case 'esuccubus':` and `case 'edragon':`)
- esuccubus: kite the player; on cooldown lob a FIRE projectile AT THE PLAYER. Reuse the projectile-at-player
  pattern from 'gunner' (~L1550-1559, bullets.push aimed at P) OR push to `fireballs` aimed at P with a
  hostile flag and hurtPlayer on impact (the fireballs system already hurts the player — see ~L631). Modest
  damage (~rnd(6,10)*dmgScale). Looks like a succubus (small, pink/violet).
- edragon: slow; on cooldown fire a poison-green BREATH projectile at the player (same projectile pattern,
  bigger/slower, ~rnd(10,15)*dmgScale, green). Looks like the bone dragon.
Both are `minion:true` so nearestRealFoe/AUTO treat them as summons, and they die if the warlock falls (mirror
how the player's lich/summon cleanup works — optional: despawn his summons when the cultwarlock dies, with an
'UNSUMMONED' popup like ~L563).

### PLAYER HEX DoT (new — there is none today; grep confirms no P.hexedT)
Add fields P.hexedT / P.hexedDmg / P.hexedTick and tick them in the player update (updPlayer/tick, near other
P timers). Each tick (~.5s) call hurtPlayer(P.hexedDmg, null) and flash the player purple (#b070f0). Apply on
the cultwarlock's hex cast: P.hexedT=8; P.hexedDmg=~rnd(6,9)*e.dmgScale; popup(P.x,P.y-46,'HEXED','#b070f0').
Respect P.wardT (seraph ward blocks it) and don't tick while dead. Keep it self-contained (no new engine
system — just timers + hurtPlayer, exactly like the enemy-side hex already works in reverse).

## LOOK — make him READ as the Warlock (enemy draw, ~L2645 drawFighter for enemies)
Give the cultwarlock boss the warlock CASTER look instead of the collector look: drawFighter(... ,{robe:true,
hood:true, ...}) with warlock coloring (body ~#241a30 / #3a1a26, accent #b070f0) — match the playable warlock's
caster silhouette. Render esuccubus as a small succubus (pink #f06aa0 body, little wings) and edragon as a pale
bone dragon (#cfc6b4, green glow), reusing the player-side succubus/dragon draw code paths if practical.

## QA (required before publish)
- `node --check src/combat/pit.js` and `node --check src/world/quests.js` pass.
- Headless/AUTO: run a DRUID through the Varenholm crossing (or a direct cultwarlock encounter) — the boss
  SUMMONS succubi + a bone dragon and HEXES the player; fight is winnable and does not softlock; AUTO resolves.
- Confirm the cutscene/voice/dialog are byte-unchanged (only pack types + new AI/look added).
- Other zones/bosses unchanged (the collector boss elsewhere still exists and is untouched).

## PUBLISH
- BEWARE the OneDrive mount tail-truncation hazard (see memory epub-editing-fs-hazard): after editing pit.js,
  re-verify the mount copy is COMPLETE (wc -l + node --check + tail) before publishing; if truncated,
  reconstruct from the good prefix + correct tail, rewrite, and re-verify (this was needed twice this week).
- `python tools/publish_inplace.py <path-to-Neverendingnarratives>` (NEVER publish_site.py). In scheduled
  sessions the site repo may not be mounted ("NOT REACHABLE") — then leave source in place and note in STATUS
  that the user must publish + git push from a chat session. Never git push yourself.
- Append "## STATUS: done <date>" (or blocked) here when finished.

================================================================
## STATUS: done 2026-06-21
================================================================
Shipped the full cult-warlock boss (enemy-only) and published to Neverendingnarratives/play
(build 1782008868). The cutscene/voice/dialog/banners/flow were left byte-untouched — only the
pack TYPES changed in quests.js and new AI + look + a player-side HEX DoT were added in pit.js.

WHAT WAS WIRED (src/combat/pit.js):
- New player field P.hexedT/hexedDmg/hexedTick (none existed before) + a tick in the player update
  (updPlayer timers): every .5s, if not dead / not warded / not mid-roll, hurtPlayer(P.hexedDmg) and
  flash the hero purple (#b070f0). Cleared on every fight reset (startEncounter/spawnFight/fullReset).
- New enemy AI `case 'cultwarlock'` (the playable Warlock as a boss): caster-kites (back off <200,
  advance >300); SUMMONS his coven — up to 3 enemy succubi (esuccubus minions, ~70hp) on a 3.5s->5s
  cooldown via a necro-style raise loop; SUMMONS a BONE DRAGON (edragon minion, ~260hp) once (a 2nd on
  the rematch, flag rematch:true on the pack); casts a REAL telegraphed HEX (0.8s tele, 6s CD) that sets
  P.hexedT=8 / dmg rnd(6,9)*dmgScale when dToP<320 and the player isn't warded/rolling; light melee if
  cornered. On death his summons unravel (UNSUMMONED popups) and the hex lifts.
- New minion AIs: `esuccubus` (kites, lobs a pink fire BULLET at the player, rnd(6-10)*dmgScale) and
  `edragon` (slow, breathes a poison-green BULLET, rnd(10-15)*dmgScale). Both use the gunner BULLET
  system (already hurts the player + can be soaked by the warlock's own taunt-minions), minion:true so
  AUTO/nearestRealFoe treat them as summons and the win-check cleans them up.
- LOOK: cultwarlock drawn with the Warlock CASTER silhouette (robe+hood, body #241a30, head accent
  #b070f0, no weapon) + a slow violet sigil ring; esuccubus = small pink/violet robed succubus with
  little wings; edragon = the bone-dragon draw (pale #cfc6b4, green eyes) reusing the player dragon
  path. Bullets now honor a `col` field (pink fire / green breath).
- quests.js: druidCrossing.warlock.pack and rematch.pack swapped collector->cultwarlock (rematch:true,
  col #241a30); kept boss:true, hp/spd/dmgScale/x/y/deathCol; surrounding dialog/voice/banners untouched.

QA (all passed): node --check clean on pit.js + quests.js; full 20-fight assist gauntlet VICTORY for
ronin/druid/warlock/seraph/ember (no crash/softlock); targeted crossing test — a lv14 druid sees the
boss SUMMON esuccubus + edragon and take a real HEX (P.hexedT>0, ~9.6 dmg/tick), and the live fight is
WINNABLE and resolves the encounter cb (no softlock). The original 'collector' boss type still exists
and is untouched (other zones unchanged).

FS HAZARD (epub-editing-fs-hazard): after the edits the OneDrive Linux mount served STALE TAIL-TRUNCATED
views of BOTH pit.js (cut ~L3113) and quests.js (final line cut to `else windo`). Rebuilt each from the
intact mount prefix + the exact desktop tail (anchored on a unique line), node-checked & gauntlet-tested
in scratch, installed over the mount (cmp-identical, which refreshed the cache), and only then published.
Published play copies verified: pit.js 3271 lines / quests.js 905 lines, node --check OK, cmp-identical to
source, cultwarlock present, config key scrubbed to ''.

NOT git-pushed (never auto-push). USER TODO: commit & push BOTH repos — game/ (The Sorcerer Sword ARPG)
and the site repo (Neverendingnarratives, the play/ build). No voice clips changed.

## VERIFIED 2026-06-21 (scheduled re-run): source==published byte-identical (cmp clean) for
pit.js (3271 L) and quests.js (905 L); node --check clean on both; tails intact (no truncation);
cultwarlock packs present at quests.js L397 (warlock) + L410 (rematch:true), collector boss elsewhere
(L325) untouched; published build still 1782008868; config key scrubbed to ''. Targeted crossing sim
(lv14 druid): boss SUMMONS esuccubus + edragon and applies a real HEX (P.hexedT=8, ~12 dmg/tick).
Full 20-fight assist gauntlet VICTORY for ronin/druid/warlock/seraph/ember. Nothing left to ship.

## RE-VERIFIED 2026-06-21 (scheduled re-run, schedule self-disabled): source==published byte-identical
(cmp clean) for pit.js (3271 L) + quests.js (905 L); node --check clean on both source and published;
tails intact (no truncation). cultwarlock AI present (6 case refs) with esuccubus/edragon minion AIs and
the P.hexedT player-HEX DoT; quests packs intact at L397 (warlock) + L410 (rematch). The 'collector' boss
type still exists elsewhere (untouched). Published build still 1782008868; config key scrubbed to ''.
No regressions — schedule disabled.
