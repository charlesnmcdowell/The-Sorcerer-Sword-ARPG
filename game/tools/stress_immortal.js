#!/usr/bin/env node
/* IMMORTAL-BOSS SUSTAINED-COMBAT STRESS (playtest agent, RUN 2026-06-27).
   Goes BEYOND the gauntlet: pins an unkillable boss + replenishing minions and drives the
   player aggressively (all abilities) for a long fight per build, SAMPLING every entity array
   and per-frame compute over time. Detects UNBOUNDED growth (positive slope), not just peak,
   and frame-time blow-up / O(n^2). A flat/oscillating series at high frame count = bounded =
   healthy. Run: node stress_immortal.js [pit.js] */
const path = require('path');
// self-locating: default to the engine next to this tool's tree (../src/combat/pit.js);
// a relative argv[2] resolves against cwd. Never hardcode a session-specific mount path
// (a stale absolute path silently LOAD-FAILs and can mask a regression). [playtest 2026-06-27]
const PIT = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.join(__dirname, '..', 'src', 'combat', 'pit.js');
let createPitCombat;
try { ({ createPitCombat } = require(PIT)); } catch (e) { console.error('LOAD FAIL', e.message); process.exit(2); }

const realSetTimeout = global.setTimeout;
let timerQ = [];
global.setTimeout = (fn) => { timerQ.push(fn); return 0; };
function flushTimers(cap = 20000){ let n=0; while(timerQ.length && n++<cap){ timerQ.shift()(); } }

const mk = () => { const a = createPitCombat({}); a.resize(900,600); return a; };
const ARR = ['enemies','demons','wolves','fireballs','bullets','zones','rays','particles','popups','swings','limbs','tracers'];

// simple least-squares slope of y vs index (normalized per 1000 frames)
function slope(xs, ys){
  const n=xs.length; let sx=0,sy=0,sxx=0,sxy=0;
  for(let i=0;i<n;i++){sx+=xs[i];sy+=ys[i];sxx+=xs[i]*xs[i];sxy+=xs[i]*ys[i];}
  const d=n*sxx-sx*sx; if(!d)return 0; return (n*sxy-sx*sy)/d;
}

function stress(champ, plan, FRAMES){
  const api = mk();
  const label = `${champ}${plan.label?'/'+plan.label:''}`;
  api.fullReset(champ);
  // jump the player to a high level so evo roads + top-tier kits are active under stress
  api.P.level = 20; if(plan.evo10)api.P.evo10=plan.evo10; if(plan.evo20)api.P.evo20=plan.evo20;
  const S=api.S,P=api.P;
  // lock to a late raiser/summoner fight (index 18 = thrall feeder) for max entity churn
  const LOCK = Math.min(plan.lockFight!=null?plan.lockFight:18, api.FIGHTS.length-1);
  S.fight = LOCK; api.startFight();
  let t=Date.now(), err=null;
  const samples={frame:[]}; ARR.forEach(k=>samples[k]=[]); samples.ms=[];
  const peak={}; ARR.forEach(k=>peak[k]=0); let maxMs=0;
  const HUGE=9e8;
  try{
    for(let f=0; f<FRAMES; f++){
      if(P.evoPick){ api.pickEvo(P.evoPick[(P.evoTier===20?(plan.road20||0):(plan.road10||0))]?(P.evoTier===20?(plan.road20||0):(plan.road10||0)):0); continue; }
      // hard-pin the fight: never advance past LOCK, never leave fight mode
      if(S.fight!==LOCK){ S.fight=LOCK; }
      if(S.mode!=='fight'){ S.mode='fight'; }
      // HARD-immortal every NAMED (non-minion) foe so the win check (filter(!minion).every(dead)) never fires
      for(const e of api.enemies){ if(e && !e.minion){ e.dead=false; e.deathT=0; e.hp=HUGE; e.maxHp=Math.max(e.maxHp||0,HUGE); } }
      // drive: pursue nearest, attack every few frames, cycle abilities
      const foes=api.enemies.filter(e=>!e.dead);
      const tgt=foes.sort((a,b)=>Math.hypot(P.x-a.x,P.y-a.y)-Math.hypot(P.x-b.x,P.y-b.y))[0];
      if(tgt){
        const dx=tgt.x-P.x,dy=tgt.y-P.y,d=Math.hypot(dx,dy)||1;
        if(d>46){api.stick.dx=dx/d;api.stick.dy=dy/d;api.stick.mag=1;} else {api.stick.dx=0;api.stick.dy=0;api.stick.mag=0;}
        api.pointerMove(tgt.x,tgt.y);
        if(f%5===0)api.pointerAttack(tgt.x,tgt.y);
        if(f%37===0){api.doHeavy&&api.doHeavy();api.heavyRelease&&api.heavyRelease();}
        if(f%23===0)api.doParry&&api.doParry();
        if(f%53===0&&d<90)api.doRoll&&api.doRoll();
      }
      const t0=process.hrtime.bigint();
      t+=1000/60; api.frame(t); flushTimers();
      const ms=Number(process.hrtime.bigint()-t0)/1e6;
      if(!Number.isFinite(P.hp)) throw new Error(`P.hp NaN @f${f}`);
      if(!Number.isFinite(P.x)||!Number.isFinite(P.y)) throw new Error(`P pos NaN @f${f}`);
      // keep player alive so the fight is truly sustained (we're stressing entities, not balance)
      if(P.hp<50) P.hp=P.maxHp||P.hp||100;
      ARR.forEach(k=>{ const v=(api[k]||[]).length; if(v>peak[k])peak[k]=v; });
      if(ms>maxMs)maxMs=ms;
      if(f%500===0){ samples.frame.push(f); ARR.forEach(k=>samples[k].push((api[k]||[]).length)); samples.ms.push(ms); }
    }
  }catch(e){ err=e&&e.message||String(e); }
  // analyze: use the second half of samples (post warm-up) for slope
  const half=Math.floor(samples.frame.length/2);
  const xs=samples.frame.slice(half), flags=[];
  ARR.forEach(k=>{
    const ys=samples[k].slice(half);
    const s=slope(xs,ys)*1000; // per 1000 frames
    // growth flag: sustained positive slope of >0.5 entity/1000fr AND peak meaningfully large
    if(s>0.5 && peak[k]>30) flags.push(`${k} GROWS +${s.toFixed(2)}/1k (peak ${peak[k]})`);
  });
  const msYs=samples.ms.slice(half); const msSlope=slope(xs,msYs)*1000;
  if(msSlope>0.5 && maxMs>20) flags.push(`frameMs GROWS +${msSlope.toFixed(3)}/1k (max ${maxMs.toFixed(1)}ms)`);
  const peakStr=ARR.filter(k=>peak[k]>0).map(k=>`${k}=${peak[k]}`).join(' ');
  console.log(`${err?'ERR   ':(flags.length?'GROW  ':'OK    ')} ${label.padEnd(22)} ${peakStr} maxMs=${maxMs.toFixed(2)}${err?'  CRASH: '+err:''}${flags.length?'  >>> '+flags.join('; '):''}`);
  return {label,err,flags};
}

const RUNS=[
  ['ronin',{label:''}],
  ['druid',{label:'warden',evo10:'warden',road10:0}],
  ['druid',{label:'alpha',evo10:'alpha',road10:1}],
  ['warlock',{label:'herald',evo10:'herald',road10:0,road20:0}],
  ['warlock',{label:'binder',evo10:'binder',road10:1,road20:0}],
  ['warlock',{label:'herald-archfiend',evo10:'herald',evo20:'archfiend',road10:0,road20:1}],
  ['warlock',{label:'binder-lichlord',evo10:'binder',evo20:'lichlord',road10:1,road20:1}],
  ['seraph',{label:'wrath-judgement',evo10:'wrath',evo20:'judgement',road10:0,road20:1}],
  ['seraph',{label:'aegis-bulwark',evo10:'aegis',evo20:'bulwark',road10:1,road20:1}],
];
const FRAMES=parseInt(process.argv[3]||'30000',10);
console.log(`=== IMMORTAL-BOSS SUSTAINED STRESS (${FRAMES} frames/build) — slope-based unbounded-growth detector ===`);
const res=[]; for(const [c,p] of RUNS) res.push(stress(c,p,FRAMES));
global.setTimeout=realSetTimeout;
const bad=res.filter(r=>r.err||r.flags.length);
if(!bad.length) console.log('CLEAN -- every array bounded (no positive slope), no frame-time blow-up, no crash/NaN under sustained immortal-boss combat.');
else bad.forEach(r=>console.log(`[${r.err?'CRASH':'GROW'}] ${r.label}: ${r.err||r.flags.join('; ')}`));
process.exit(bad.length?1:0);
