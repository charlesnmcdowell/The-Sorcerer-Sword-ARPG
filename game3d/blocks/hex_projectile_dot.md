# BLOCK: hex projectile + rot DoT (pit.js-faithful)

CAPABILITY: a fire-and-forget projectile that, on contact, applies a damage-over-time
"rot" to an enemy — and stacks when an upgrade flag is set. This is the reusable spine
every warlock spell/breath reuses (hex, dragon acid, succubus fire, sheol, arrows).

## Shape (matches game/src/combat/pit.js)
- `fireballs[]` holds live projectiles: `{x,y, vx,vy, r, kind}` (kind: 'hex'|'fire'|'arrow'|...).
- Spawn (pit.js:569): muzzle = unit pos + `cos/sin(face)*14` (and `-18` y for staff height);
  velocity = `cos/sin(face)*420`; `r:5`.
- `updFireballs(dt)`: integrate `x+=vx*dt`; emit a trail mote; test each living enemy with
  `hypot(b.x-e.x, b.y-(e.y-14)) < e.r+b.r` (the `-14` lifts the hit-center to torso); on the
  'hex' branch apply/refresh the DoT; cull on hit OR when out of arena.
- DoT carried ON THE ENEMY: `hexT` (seconds left), `hexDmg` (per tick), `hexTick` (countdown to
  next tick). Base = 10s / 15dmg / .5s tick. HEX FIEND (herald) STACK = `hexDmg+=15`, refresh
  `hexT=max(hexT,10)` (pit.js:766). Tick handled in the per-enemy update (pit.js:1538): every
  .5s subtract `hexDmg`; at hp<=0 mark dead.

## Gotchas
- The hit test uses `e.y-14`, NOT `e.y` — projectiles aim at torso, not the foot/anchor. Forgetting
  this makes bolts visually pass through the sprite's body.
- SUMMON is PRESS, not hold: `releaseChannel()` is a no-op except interruption (pit.js:577).
- HERALD changes TWO hex things at once: cooldown 10s→3s (pit.js:567) AND stacking (:766). Gate both
  on `P.evo10==='herald'`.
- The SLOW half of "slows + rots" lives in the ENEMY update (pit.js:1554, `dt*0.6` when hexT>0),
  not in the projectile — port it when enemy movement/AI exists, not before.
- **OneDrive mount staleness (this repo):** after editing a file in game3d/ via the Edit/Write
  tools, the bash mount may keep serving the OLD/short cached bytes (e.g. `wc -l`/`stat` show the
  pre-edit size and a truncated tail). The file is NOT corrupt — VERIFY with the Read tool (it
  fetches the true on-disk file), and syntax-check added code in an isolated /tmp file via
  `node --check` rather than trusting a bash read of the live file. See memory: playtest mount
  truncation + EPUB editing FS hazard.
