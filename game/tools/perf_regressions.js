#!/usr/bin/env node
/* PERF regression harness (playtest agent, 2026-06-24).
   Home for permanent perf/unbounded-growth cases that the fast smoke gate doesn't cover.
   Policy (Hiro): every bug becomes a PERMANENT named case so it can never silently recur. NEVER delete a case.
   Run:  node tools/perf_regressions.js            (uses ../src/combat/pit.js)
         node tools/perf_regressions.js <pit.js>   (point at an alternate engine)

   --- OPEN LEAD 2026-06-21 (root-caused + fixed 2026-06-24): "a competent pursue driver stalled a champion
   past 40s/1500 frames; likely unbounded entity growth or O(n^2) under sustained combat." ---
   ROOT CAUSE: dead MINIONS (thralls/skels/hounds/esuccubi) were never removed from enemies[]. The draw loop
   stops drawing a corpse at deathT>2, but nothing culled it, so a prolonged fight vs a raiser/feeder
   (THE FORMER CHAMPION throws thralls forever; a necro/warden raise the dead) piled corpses into enemies[]
   (observed 200+), and every tick iterates enemies[] plus dozens of enemies.filter(e=>!e.dead) scans -> the
   per-frame cost (and memory) grew without bound. FIX (pit.js tick): after the enemy update loop, splice out
   any dead minion whose death-fade is spent (deathT>2). NAMED foes are kept (the stitcher resurrects fallen
   !minion foes, and those are spawn-bounded). */
const path = require('path');
const PIT = process.argv[2] || path.join(__dirname, '..', 'src', 'combat', 'pit.js');
let createPitCombat;
try { ({ createPitCombat } = require(PIT)); }
catch (e) { console.error('LOAD FAIL', PIT, e.message); process.exit(2); }
const mk = () => { const a = createPitCombat({}); a.resize(900, 600); return a; };
let failures = 0;
const log = (ok, name, extra='') => { if(!ok) failures++; console.log(`${ok?'PASS':'FAIL'}  ${name}${extra?'  '+extra:''}`); };

const CASES = [
  // 1) UNIT: a dead minion is culled once its fade is spent; a dead NAMED foe is NOT (resurrection-safe).
  ['dead-minion-culled-named-foe-kept (perf — OPEN LEAD 2026-06-21)', () => {
    const api = mk(); api.fullReset('ronin');
    api.startEncounter([{type:'door',x:300,y:300,hp:1e9,maxhp:1e9},
                        {type:'skel',minion:true,x:520,y:300,hp:1,maxhp:1}]);
    const door = api.enemies.find(e=>e.type==='door');
    let t=100000; api.frame(t); t+=16; api.frame(t);   // prime the frame clock so dt is sane (first tick uses wall-clock 'last')
    const m = api.enemies.find(e=>e.type==='skel');
    m.hp=0; m.dead=true; m.deathT=3;                    // dead minion whose death-fade (>2s) is already spent
    for(let f=0;f<3;f++){ door.hp=1e9; door.dead=false; api.P.hp=api.maxHP(); t+=16; api.frame(t); }
    if(api.enemies.includes(m)) return 'dead MINION not culled after its fade — enemies[] grows unbounded under sustained combat';
    if(!api.enemies.includes(door)) return 'a NAMED foe was culled — would break the stitcher resurrection / live combat';
    return null;
  }],
  // 2) END-TO-END: a long fight that keeps spawning + killing minions must NOT let enemies[] grow without
  //    bound (corpses must drain). Spawn a wave of minions, kill them, sustain for >2s, assert the array
  //    collapses back to just the living named foe (was: corpses accumulate every kill, forever).
  ['enemies-array-bounded-under-sustained-combat (perf — OPEN LEAD 2026-06-21)', () => {
    const api = mk(); api.fullReset('ronin');
    const wave = [{type:'door',x:300,y:300,hp:1e9,maxhp:1e9}];
    for(let i=0;i<30;i++) wave.push({type:'skel',minion:true,x:200+i*8,y:380,hp:1,maxhp:1});
    api.startEncounter(wave);
    const door = api.enemies.find(e=>e.type==='door');
    let t=100000; api.frame(t); t+=16; api.frame(t);    // prime the clock
    // kill every minion, mark its fade already spent, then sustain combat for ~3s
    for(const e of api.enemies){ if(e.minion){ e.hp=0; e.dead=true; e.deathT=3; } }
    for(let f=0;f<8;f++){ door.hp=1e9; door.dead=false; api.P.hp=api.maxHP(); t+=16; api.frame(t); }
    const corpses = api.enemies.filter(e=>e.dead).length;
    if(corpses>0) return corpses+' dead minion corpse(s) still in enemies[] after their fade (unbounded growth)';
    if(api.enemies.length>2) return 'enemies[] did not drain to the living named foe (got '+api.enemies.length+')';
    return null;
  }],
];
for (const [name, fn] of CASES) {
  let msg; try { msg = fn(); } catch(e){ msg = 'threw: '+(e&&e.message||e); }
  log(!msg, `perf:${name}`, msg||'');
}
console.log(failures ? `\nFAILED — ${failures} case(s). 5-Whys the root cause; keep its regression case.` : `\nALL GREEN (${CASES.length} perf cases)`);
process.exit(failures ? 1 : 0);
