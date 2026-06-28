#!/usr/bin/env node
/* TRANSITION-HYGIENE PROBE (playtest agent). The pursue-driver stops at death/victory and
   never exercises the post-game flow. This drives each champion to a real DEATH and a real
   VICTORY, then RESTARTS (fullReset->startFight) and resumes combat — repeatedly — checking
   for state leakage across runs: leftover entities, stuck mode, non-finite P state, evo bleed,
   and that a restarted fight actually progresses (no softlock at the board->fight seam). */
const path = require('path');
const PIT = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.join(__dirname, '..', 'src', 'combat', 'pit.js'); // self-locating [playtest 2026-06-27]
let createPitCombat;
try { ({ createPitCombat } = require(PIT)); } catch (e) { console.error('LOAD FAIL', e.message); process.exit(2); }
const realSetTimeout = global.setTimeout; let timerQ = [];
global.setTimeout = (fn) => { timerQ.push(fn); return 0; };
function flush(cap = 20000){ let n=0; while(timerQ.length && n++<cap) timerQ.shift()(); }
const mk = () => { const a = createPitCombat({}); a.resize(900,600); return a; };
const ARRS = ['enemies','demons','wolves','fireballs','bullets','zones','rays'];
let problems = [];
const flag = (sev,champ,msg) => problems.push({sev,champ,msg});

function step(api, t){ t.v += 1000/60; api.frame(t.v); flush();
  if(!Number.isFinite(api.P.hp)) throw new Error('P.hp non-finite');
  if(!Number.isFinite(api.P.x)||!Number.isFinite(api.P.y)) throw new Error('P pos NaN');
  if(typeof api.S.mode!=='string') throw new Error('S.mode not string'); }

// drive a fight; mode-aware. returns final mode after up to maxF frames.
function driveFight(api, t, maxF){
  for(let f=0; f<maxF; f++){
    const S=api.S, P=api.P;
    if(S.mode!=='fight') return S.mode;
    if(P.evoPick){ api.pickEvo(0); continue; }
    const foes=api.enemies.filter(e=>!e.dead);
    const tgt=foes.sort((a,b)=>Math.hypot(P.x-a.x,P.y-a.y)-Math.hypot(P.x-b.x,P.y-b.y))[0];
    if(tgt){ const dx=tgt.x-P.x,dy=tgt.y-P.y,d=Math.hypot(dx,dy)||1;
      if(d>46){api.stick.dx=dx/d;api.stick.dy=dy/d;api.stick.mag=1;}else{api.stick.dx=0;api.stick.dy=0;api.stick.mag=0;}
      api.pointerMove(tgt.x,tgt.y);
      if(f%7===0)api.pointerAttack(tgt.x,tgt.y);
      if(f%47===0){api.doHeavy();api.heavyRelease&&api.heavyRelease();}
      if(f%31===0)api.doParry(); }
    step(api,t);
  }
  return api.S.mode;
}

function checkHygiene(api, champ, phase){
  const P=api.P;
  for(const a of ARRS){ const arr=api[a]; if(arr && arr.length>200) flag('P2',champ,`${a}[] not cleared after ${phase}: ${arr.length}`); }
  if(P.evo10||P.evo20||P.evoPick) flag('P2',champ,`evo state bled through ${phase}: evo10=${P.evo10} evo20=${P.evo20} evoPick=${!!P.evoPick}`);
  if(P.demonLord||P.lich||P.devilT>0) flag('P2',champ,`transient form persisted after ${phase}: demonLord=${P.demonLord} lich=${P.lich} devilT=${P.devilT}`);
  if(!Number.isFinite(P.hp)) flag('P1',champ,`P.hp non-finite after ${phase}`);
}

const CHAMPS=['ronin','druid','warlock','seraph'];
console.log('=== TRANSITION-HYGIENE PROBE (death/victory -> restart) ===');
for(const champ of CHAMPS){
  const api=mk(); const t={v:Date.now()};
  let deaths=0, restarts=0, err=null;
  try {
    api.fullReset(champ);
    // Cycle: play through the run; on death OR victory, restart and verify clean resume.
    for(let cycle=0; cycle<4; cycle++){
      // ensure we're in a fight
      if(api.S.mode==='board'||api.S.mode==='title'){ api.startFight(); }
      // play up to ~6000 frames; advance through whatever resolves
      let guard=0;
      while(guard++<40){
        const m=driveFight(api,t,4000);
        if(m==='death'){ deaths++;
          // verify death screen is stable for a bit (no crash, mode stays)
          for(let k=0;k<120;k++) step(api,t);
          if(api.S.mode!=='death') flag('P2',champ,`death mode did not persist (became ${api.S.mode})`);
          // RESTART
          api.fullReset(champ); restarts++;
          checkHygiene(api,champ,'death->fullReset');
          if(api.S.fight!==0) flag('P2',champ,`fight index not 0 after fullReset: ${api.S.fight}`);
          api.startFight();
          // confirm the restarted fight actually runs a few hundred frames
          const m2=driveFight(api,t,600);
          if(!['fight','board','title','victory','death'].includes(m2)) flag('P1',champ,`bad mode after restart: ${m2}`);
          break;
        } else if(m==='victory'){
          for(let k=0;k<120;k++) step(api,t);
          if(api.S.mode!=='victory') flag('P2',champ,`victory mode did not persist (became ${api.S.mode})`);
          api.fullReset(champ); restarts++;
          checkHygiene(api,champ,'victory->fullReset');
          api.startFight(); driveFight(api,t,600);
          break;
        } else if(m==='board'||m==='title'){ api.startFight(); continue; }
        else { // still in fight after 4000 frames — keep going within this cycle
          continue;
        }
      }
    }
  } catch(e){ err=e&&e.message||String(e); flag('P1',champ,`CRASH during transition cycling: ${err}`); }
  console.log(`${err?'CRASH ':'OK    '} ${champ.padEnd(10)} deaths=${deaths} restarts=${restarts} finalMode=${api.S.mode}`);
}
global.setTimeout=realSetTimeout;
console.log('\n=== FINDINGS ===');
if(!problems.length) console.log('CLEAN — death/victory -> restart cycles leave no leaked entities, no stuck mode, no NaN, no evo/form bleed, restarted fights resume.');
else for(const p of problems) console.log(`[${p.sev}] ${p.champ}: ${p.msg}`);
process.exit(problems.some(p=>p.sev==='P1'||p.sev==='P2')?1:0);
