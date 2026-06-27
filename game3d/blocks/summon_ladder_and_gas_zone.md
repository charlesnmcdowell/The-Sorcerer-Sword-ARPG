# BLOCK: timed summon-ladder + lingering ground-zone (DoT/stun field)

**Capability.** A press-to-channel ability that auto-fires escalating "rungs" at fixed time gates,
plus a generic lingering ground effect (`zones[]`) that re-applies a stun + DoT to whatever stands in it.
Generalized from the warlock SUMMON (claw fiend → bone dragon → coven) + the bone dragon's acid-gas cloud.

**Recipe.**
1. Channel object lives on the actor: `start → P.channel={t:0}`. Drive it from the master `frame(dt)`
   tick, NOT from the button-up handler. The button only STARTS it; the rungs fire on their own:
   ```
   if(P.channel){ const c=P.channel; c.t+=dt;
     if(c.t>=t1 && !c.b){ c.b=true; /* rung 1, guarded by "is one alive?" */ }
     if(c.t>=t2 && !c.d){ c.d=true; /* rung 2, guarded by a level/cost check */ }
     if(c.t>=t3){ /* final rung */ P.channel=null; } }   // completing the last rung clears the channel
   ```
   Per-rung one-shot flags (`c.b`,`c.d`) prevent re-firing; gate each rung on level + "one already alive"
   so the ladder is idempotent if re-channeled.
2. The release handler is a NO-OP (`releaseChannel(){return;}`) — holding vs tapping must feel identical;
   only an interruption (hit/paralyze/silence) should end a channel early.
3. Ground zone: `zones.push({x,y,r,life,type,tick:0})`. A single `updZones(dt)` decays `life`, and on a
   `tick` cadence (e.g. .5s) loops live targets within `r` and refreshes a capped stun + a DoT timer
   (`e.acidT=max(e.acidT,3); e.acidDmg=15`). The DoT itself ticks in the per-target update, decoupled
   from the zone — so it keeps rotting even after the target walks out.
4. Render zones on a LOW-depth graphics layer (`setDepth(1)`) so the cloud sits on the floor under units;
   pulse alpha with `Math.sin(now/180)` and fade by `life/maxLife`.

**Gotcha (Phaser-AE method note).** Two:
- The summon driver MUST be the per-frame tick, not the keyup. If you summon on release you get hold-vs-tap
  divergence and double-summons; the original is press-only + time-gated for a reason.
- Stun/DoT application and the DoT *tick* must be separate loops. Applying damage inside the zone loop ties
  the rot to standing in the cloud; the real feel is "the gas marks you, then you rot regardless." Refresh a
  timer in the zone, tick the timer elsewhere.

**Mount gotcha (unchanged).** These files live on a OneDrive FUSE mount that serves STALE truncated tails to
bash — `node --check`/`wc -l` over bash lie. Verify edits with the Read tool; keep Edits
complete-construct-for-complete-construct so brace balance holds by construction.

Source of truth: `game/src/combat/pit.js` channel tick :2285, `summonDemons('dragon')` :614, dragon AI
:678, gas zone push :691, gas tick :2364, acid DoT :1546.
