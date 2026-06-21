# Warlock paths + Demon Lord + druid forms batch (Hiro 2026-06-21) — src/combat/pit.js

PATH NAMES: UNDEAD path = P.evo10==='binder' (lv20 'lichlord'). DEMON path = P.evo10==='herald' (lv20 'archfiend').
Reuse existing systems. Gate every path-specific change so un-evolved / other-road warlocks are unchanged.
After edits: node --check; headless/AUTO sanity; then publish (publish_inplace.py + the OneDrive truncation
verify-before-publish ritual). Reuse dotDamage()/hex DoT, the fireball+aoe system, summonDemons, the channel tick.

## 1. GLOBAL — BONE DRAGON acid breath = a real DoT (~hex strength)
Today the dragon breath only drops a near-harmless paralytic 'gas' zone (~L622: zones.push type:'gas', life:4).
Make standing in that gas apply an ACID DoT to enemies similar to hex: in the zone-update loop where 'gas'
zones tick, for each enemy inside, apply/refresh a DoT (~hex base 15, .5s tick, green #7fd05a) via dotDamage
(mirror the hex tick ~L1379-1380). Keep the light paralytic flavor. Applies to ALL warlock bone dragons.

## 2. UNDEAD path (binder) — BLACK DRAGON + reaper buffs
Gate on P.evo10==='binder'.
- The summoned dragon (~L553 summon; ~L609 AI; draw) becomes a BLACK DRAGON: even higher HP than the current
  binder dragon (bump its hp formula further), rendered BLACK (body ~#0a0a0a with a sickly-green underglow)
  instead of bone, and KEEPS all its original moves (acid breath DoT, melee/charge).
- PLUS it shoots a MASSIVE FIREBALL with explosion damage to ENEMIES (on a cooldown, e.g. ~4s): reuse the
  fireballs system with a large r + aoe (like the arch succubus blast but bigger), kind:'fire', dmg high,
  splash to all enemies in aoe (not allies). Anchor the projectile pattern at the succubus fireball push
  (~L652-655) and the explosion/splash handler (~L695-705).
- REAPER (lich) form on this path gets BIGGER and scythe does 2x damage: in enterLich (~L857, P.r=22) bump
  P.r when binder (e.g. 26-28); in lichSlash (~L884) multiply the scythe damage by 2 when P.evo10==='binder'.

## 3. DEMON path (herald) — coven changes
Gate on P.evo10==='herald'.
- Succubus minions NO LONGER TIME OUT: at the life-decay (~L566 `d.life-=dt`), skip decay for succubi on the
  herald path (and arch succubi). They persist until killed.
- DOUBLE the amount of EACH demon summoned (incl succubus): in summonDemons, double the spawn counts on the
  herald path too (binder already doubles — give herald its own doubling).
- ARCH SUCCUBUS explosion: still explodes, but (a) NO LONGER hurts ALLIES (no damage to the player's summons —
  it already heals succubi; ensure zero friendly damage), and (b) the arch succubus NO LONGER dies from
  exploding and does NOT time out. Today the explosion "kills her" (~L625-630, archT<=0 -> EX, then she dies).
  On herald path: after the blast, she survives (keep her alive, reset so she doesn't immediately re-explode),
  and her life doesn't decay.

## 4. GLOBAL CONTROL — SUMMON is PRESS, not HOLD (auto-channel)
Today: doHeavy->startChannel (~L511); the channel advances in the player tick (~L2151-2170) only while held;
heavyRelease->releaseChannel (~L1033) cancels it (FIZZLE). CHANGE to: pressing SUMMON starts a channel that
AUTO-COMPLETES on its own (the warlock channels to full by himself) UNLESS INTERRUPTED.
- startChannel begins it as now. The channel tick keeps advancing regardless of button state until it reaches
  its final summon threshold, then auto-clears P.channel (success, no FIZZLE).
- heavyRelease no longer cancels the channel (make releaseChannel a no-op for this auto-channel, or only cancel
  if nothing has started). 
- INTERRUPTION cancels it: taking a hit (hurtPlayer while P.channel) or being paralyzed/stunned/silenced ends
  the channel early (existing FIZZLE popup is fine). Wire a cancel into hurtPlayer + the paralyze application.
- Keep the lich half-speed channel (~L2151) working the same way (auto-complete).

## 5. DEMON path — NO seraphim death; ARCH DEVIL -> DEMON LORD
Gate on P.evo10==='herald' (the demon road).
- enterDevil (~L710): on herald path the arch-devil form lasts 10s LONGER (P.devilT = 15 -> 25 on herald).
- archDevilOutro (~L723+): on the herald path, DO NOT play the seraphim cinematic. KEEP PHASE 1 — the warlock /
  arch-devil TAUNT DIALOGUE + VOICE still plays out on the transformation (showBanner + archVoice('THE ARCH
  DEVIL', taunt)). He is NOT paralyzed-helpless-to-be-killed, NOT struck, NOT turned into a lich. Remove/skip
  phases 2,3,4 (Seraphim descend/strike/ascend + guaranteed Lich) for herald. At the end of the taunt he
  TRANSFORMS INTO THE DEMON LORD (call enterDemonLord()). (Non-herald warlocks keep the existing seraphim->lich
  cinematic unchanged.)
  VOICE: REUSE THE EXISTING arch-devil taunt voice clips AS-IS (the lines already played by archVoice('THE ARCH
  DEVIL', taunt) from Quests.archDevilOutro.taunts — already generated). Do NOT write new dialogue that needs
  voice generation, and make NO ElevenLabs calls. The transformation simply keeps the current taunt line(s)
  playing, then becomes the Demon Lord.

## 6. DEMON LORD form (NEW) — enterDemonLord()
- Terminal form: once reached it is PERMANENT for the fight. He does NOT revert to arch devil and the arch-devil
  outro does not fire again (guard it). Set a flag e.g. P.demonLord=true; P.devilT=0.
- LOOK: a BIGGER warlock, BLACK & GREEN (body black #0a0a0a, green #2ecc71 accents). Increase P.r (e.g. ~26-28).
  Draw in the player render switch as the warlock caster silhouette tinted black/green, larger.
- Has ALL warlock moves (hex, summon, scythe/claw as applicable, portal/fade). Keep the warlock kit available.
- Summoning time 3 SECONDS SHORTER: in the channel tick thresholds (~L2156-2165), subtract 3s from the summon
  timings when P.demonLord (floor at a small minimum).
- Every summon = 3x MORE demons (incl succubus): in summonDemons, x3 spawn counts when P.demonLord (this
  supersedes the herald doubling while in demon-lord form).
- SUCCUBI auto-ARCH on summon: when P.demonLord, every succubus spawned is created as an ARCH succubus (d.arch=true,
  arch visual/stats).
- Those arch succubi: on appear they ATTEMPT ONE EXPLOSION as usual, but they DO NOT die from it and the
  explosion does NOT hurt allies; after that first explosion they DO NOT explode again — they just do their
  fireball attack from then on. (Add a per-demon flag e.g. d.blewOnce; gate the explosion on !d.blewOnce.)

## 6b. DEMON LORD resets between fights (does NOT carry over)
P.demonLord is terminal only WITHIN a fight. It must be CLEARED at fight end / reset, exactly like P.lich and
P.devilT are. Add P.demonLord=false (and restore P.r=16, updateLabels) to every reset path that already zeroes
P.lich/P.devilT: fullReset, demoReset, and the per-fight resets (~L859 lich-channel reset, ~L1910, ~L2037).
So each new combat starts as the normal (evolved) warlock, never as the Demon Lord.

## 7. DRUID forms +10s
formChange (~L371): P.formT = 6 -> 16 (both bear and wolf). Update the '6 seconds' banner text (~L374) to '16
seconds'. (Leave form cooldowns + the warden HP/regen evolution as-is.)

## QA
node --check; headless/AUTO: every champion loads+fights; warlock on each road works; press-to-summon
auto-channels and is interrupted by a hit; binder dragon is black + lobs an exploding fireball + reaper scythe
2x; herald succubi persist + double + arch survives her blast; herald arch-devil expiry plays the taunt voice
then becomes the permanent Demon Lord (NO seraphim, no death, no lich) and Demon Lord summons 3x arch-succubi
that blow once then fireball; druid forms last 16s. Verify un-evolved/other-road/other-champions unchanged.

## STATUS: done 2026-06-21
All 7 items were already fully implemented in src/combat/pit.js (prior run; "Hiro item N" anchors
present). This run AUDITED + VERIFIED + PUBLISHED — no source code changes were needed.

Verification performed:
- node --check on all 26 src/*.js: PASS. pit.js intact (3334 lines, proper module.exports tail).
- Headless harness (tests/headless.js): 6/6 wins.
- Gauntlet assist sweep: warlock, ronin, druid, seraph all VICTORY @ fight 20/20 (no crash/softlock; gating intact).
- New focused harness tests/demonlord_qa.js: PASS. Confirms:
  * herald arch-devil expiry -> taunt -> PERMANENT Demon Lord (NO seraphim, NO lich); devilT cleared; r=27.
  * Demon Lord summons arch succubi (3x = 9), all d.arch, survive their blast (d.blewOnce).
  * Demon Lord terminal within fight; fullReset clears P.demonLord and restores r=16.
  * binder dragon is BLACK with fireball cooldown (exploding fireball).
  * herald coven doubles (3->6 succubi) and does NOT time out after 20s.
- Item anchors confirmed in code: gas->acid DoT (L628/L2275/L1476), binder black dragon+fireball
  (L554-557,629-635), reaper bigger r=27 + scythe 2x (L903,932), herald succubi no-decay (L572),
  arch survives/no friendly dmg (L637,651,656,658), press auto-channel (L516,2205-2218),
  interrupt wiring in hurtPlayer (L1410) + silence (L1781) + paralyze zones (L2261,2281,2288),
  devilT 25 herald + no-seraphim/Demon-Lord outro (L727,763-779), enterDemonLord (L738-747),
  resets clear demonLord (L1389,1953,2083,2113), druid formT=16 + banner (L371,374,3151).
- No voice clips changed; NO ElevenLabs/image/paid API calls made.

PUBLISHED: build 1782060601 via tools/publish_inplace.py -> Neverendingnarratives/play (verified:
play/src/combat/pit.js node --check OK, 3334 lines, sizes match; play/index.html ends </html>).

ACTION REQUIRED BY USER: the site git index is locked/corrupted on the OneDrive mount
("index.lock cannot be unlinked: Operation not permitted" / "cache entry has null sha1"),
so this run could NOT and did NOT git commit/push. From a normal chat session, commit & push
Neverendingnarratives/play to deploy the live site.
+ survives, 9 tripled succubi persist, reset clears Demon Lord, binder black dragon + fireball, druid 16s). No voice clips changed.

ENV/OneDrive hazard: the bash mount served a TRUNCATED view of pit.js (frozen at 204174 bytes / line ~3210) even after authoritative edits. Source was reconstructed (good prefix + correct tail, node --check OK, 210524 bytes) before publish; publish size-equality guard passed. Pre-edit safety copy at src/combat/pit.js.bak-predemonlord-truncguard.

ACTION FOR USER: files written to Neverendingnarratives/play but NOT pushed. Commit & push the site repo from a chat session to go live (this run never git-pushes).
