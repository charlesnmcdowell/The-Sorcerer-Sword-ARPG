# Block: Multi-foe crowd-charger SLOT array (brawler-migration step 1)

Lets MORE THAN ONE back-row crowd foe break formation and commit a lunge+strike AT ONCE, in a DC-style
beat-em-up, WITHOUT giving them sim/HP authority. The trick: keep it render-only (the duel sim stays the
single authority + the build stays safe), but generalise the single-charger singletons into a small ARRAY
of per-foe slot objects so the commit-lock / sidestep-whiff / lane-decal arc runs N times from one copy of
the code.

## The refactor (the reusable bit)
A single cosmetic "charger" hung off five scattered singletons:
`_crowdCharger` (foe), `_chargeT0`, `_chargeStruck`, `_chargeAimX/_chargeAimY` (committed lunge spot),
gated by `_nextCharge`, rotated via `_recentChargers`.

Fold those five into ONE per-foe SLOT `{foe, t0, struck, aimX, aimY}` and make the live set an ARRAY
`this._chargers` with a `_maxChargers` cap. The per-foe override then does
`const slot = this._chargers.find(s=>s.foe===e); if(slot){ ... }` and reads `slot.t0/aimX/aimY/struck`
everywhere the old code read the singleton. Spawn pushes a fresh slot; arc-done (`t>=1`) SPLICES it out
(`filter(s=>s!==slot)`). Zero duplicated arc — one copy of the math, N live instances.

```js
// --- selection / cull (once per frame, after gathering `waiting` = alive non-duel foes) ---
this._chargers = this._chargers || [];
this._maxChargers = 2;                                  // raise + scale to waiting.length for a bigger mob
this._chargers = this._chargers.filter(s => s.foe && !s.foe.dead && s.foe!==cur && enemies.indexOf(s.foe)>=0);
if(this._chargers.length < this._maxChargers && waiting.length>=2 && now>(this._nextCharge||0)){
  const recent=this._recentChargers||(this._recentChargers=new Set());
  const busy=new Set(this._chargers.map(s=>s.foe));     // don't double-pick an already-charging foe
  let fresh=[]; for(const e of waiting){ if(!recent.has(e) && !busy.has(e)) fresh.push(e); }
  if(!fresh.length){ recent.clear(); fresh=waiting.filter(e=>!busy.has(e)); }   // round done -> reshuffle
  if(fresh.length){
    const pick=fresh[(Math.random()*fresh.length)|0];
    this._chargers.push({foe:pick, t0:now, struck:false, aimX:null, aimY:null});
    recent.add(pick);
    this._nextCharge = now + 700 + Math.random()*1000;  // SEE GOTCHA: must be < the arc length to overlap
  }
}

// --- per-foe override (inside waiting.forEach) ---
const slot = this._chargers ? this._chargers.find(s=>s.foe===e) : null;
if(slot){
  const t = Math.min(1,(now-(slot.t0||now))/1400);                 // 1.4s arc
  if(t>=0.22 && slot.aimX==null && P){ slot.aimX=P.x; slot.aimY=P.y; }   // per-slot commit lock
  // ...windup/lunge/strike(hot)/recover drive dx from slot.aimX...
  if(t>=1){ this._chargers = this._chargers.filter(s=>s!==slot); }       // free THIS slot
}
if(hot && slot && !slot.struck){ slot.struck=true; /* sidestep-whiff test on slot.aimX/aimY */ }
```

## GOTCHA — the cadence must be SHORTER than the arc, or you never actually get two
First pass set `_nextCharge = now + 1500 + rand*2200` (carried over from the sparse single-charger pacing).
But the arc is only 1400ms, so the 1st charger ALWAYS finished + got culled before the gate reopened →
`maxConcurrent` stuck at 1 (the whole point silently didn't happen). Fix: stagger to `700 + rand*1000`
(0.7–1.7s), deliberately UNDER the 1.4s arc, so a 2nd presser joins mid-lunge. Cap + arc still bound the
rate (~2 active + a short breather), so it's pressure, not a wall of charges. Verify with a headless harness
that asserts `maxConcurrent === _maxChargers`, not just "a strike happened".

## SAFETY (why this can't softlock)
Every landed chip routes through `hurtWarlock` (obeys all i-frame gates; HP floored at 1), so two
simultaneous pressers can never KO. Each is telegraphed (yellow tint + windup arc + its own ground lane oval)
and negated by a sidestep off ITS lane. No sim/HP/targeting state is written — the duel sim stays the sole
authority.

Shipped in arena.html 2026-06-28 (priority-2 FEEL gain; LOOK unchanged ~88%).
Next: raise `_maxChargers` toward 3 and scale to wave size; later, promote a render-charger to a REAL sim
foe (shared HP/targeting) so a 2nd attacker is hittable mid-charge — the true multi-sim-foe brawler.
