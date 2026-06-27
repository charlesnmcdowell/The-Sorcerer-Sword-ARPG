# BLOCK: combat_state_pitjs  (capability: a pit.js-shaped combat state the original ports drop into)

WHAT: One plain module-scope `S` (scene/run state) + `P` (player) object plus the named
verb entry points and a `frame(dt)` tick, with the SAME field names and gating as
game/src/combat/pit.js. Downstream systems (HUD bars, cooldown overlays, autopilot,
ability/summon/transform bodies) read/write this same shape, so the original code ports
in 1:1 with no re-plumbing.

VERB API (mirror pit.js exactly):
  doSlash()  -> warlock: HEX (pit.js:307,565)        gate: atkRecover/heavyWind/rollT/channel/paralyzeT
  doHeavy()  -> startChannel() (pit.js:1154,573)      heavyRelease()->releaseChannel() (pit.js:1163,577)
  doParry()  -> warlock: PORTAL (pit.js:351); parryCD=1.4
  doRoll()   -> warlock: blink() (pit.js:1168,951); rollCD=2.2, teleport 150 back
  frame(dt)  -> S.time+=dt; decay all *T/*CD timers; channel auto-progress; apply move from keys/stick

STATE FIELDS (subset that gates verbs — keep names identical to pit.js:35,39):
  S{mode,fight,shake,hitPause,time,slow,fatal}
  P{x,y,r,face,hp,kills,level,char,form,dead, rollT,rollCD,heavyCD,heavyWind,atkRecover,
    parryT,parryCD,channel,paralyzeT,silenceT,fadeT, hexCD,hexCDmax, lich,devilT,evo10,evo20}
  keys{}  (keys['w'/'a'/'s'/'d'/'arrowup'...])   stick{dx,dy,on}

GOTCHAS:
- Channel is PRESS->auto-completes with NO cancel (pit.js releaseChannel has no abort path).
  Model it as P.channel={t,dur}; frame() advances t and auto-fires releaseChannel at dur.
- Hex CD is 10s base but 3s on the HERALD evo (pit.js:565-567) — read P.evo10, don't hardcode.
- The four verbs early-return unless S.mode==='fight' (or 'demo'); keep that guard or autopilot/demo breaks.
- Decay timers with Math.max(0, t-dt) every frame BEFORE reading them, or cooldowns never clear.
- Keep verbs free of Phaser refs — route visuals through a `scene.fx*()` indirection so the
  state module stays engine-agnostic and unit-testable headless.

STATUS: scaffolded in arena.html (Milestone 1). Verbs emit placeholder FX; real ability/summon
bodies from pit.js port onto this shape next (start with hexBolt + summonDemons).
