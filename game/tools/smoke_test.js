#!/usr/bin/env node
/* Headless regression + smoke gate for the Sorcerer-Sword combat engine.
   PHILOSOPHY (Hiro 2026-06-21): every bug Hiro reports becomes a PERMANENT
   regression case here so the auto-agent catches it before he can. Balance is
   NOT a bug unless a fight is unwinnable / blocks progression. When something
   fails, root-cause with the 5 WHYS before fixing. Add a REGRESSIONS[] case for
   every reported bug. (Deep "can a real player win / perf under combat" lives in
   the playtest agent, which drives competently; this gate is the fast guard.) */
const path = require('path');
const PIT = process.argv[2] || path.join(__dirname, '..', 'src', 'combat', 'pit.js');
let createPitCombat;
try { ({ createPitCombat } = require(PIT)); }
catch (e) { console.error('LOAD FAIL', PIT, e.message); process.exit(2); }
const mk = () => { const a = createPitCombat({}); a.resize(900, 600); return a; };
let failures = 0;
const log = (ok, name, extra='') => { if(!ok) failures++; console.log(`${ok?'PASS':'FAIL'}  ${name}${extra?'  '+extra:''}`); };

/* 1. SMOKE: every champion starts a fight and runs ~2000 frames with periodic
      inputs WITHOUT crashing; the evolution panel must auto-resolve; state stays sane. */
const CHAMPS = ['ronin','druid','warlock','seraph'];
const inputs = ['doSlash','doParry','doHeavy','doRoll'];
for (const champ of CHAMPS) {
  let err=null, evoStuck=false, frames=0;
  try {
    const api = mk(); api.fullReset(champ); api.startFight();
    let t=1000;
    for (let f=0; f<2000; f++) {
      if (f%18===0){const k=inputs[(f/18)%inputs.length|0]; try{api[k]&&api[k](); if(k==='doHeavy')api.heavyRelease&&api.heavyRelease();}catch(_){}}
      if (f%25===0){try{api.pointerAttack&&api.pointerAttack(440+(f%120),300);}catch(_){}}
      if (f===300 && champ!=='ronin'){try{api.P.level=10; api.maybeOfferEvo&&api.maybeOfferEvo();}catch(_){}}
      t+=1000/60; api.frame(t); frames=f+1;
      if(!Number.isFinite(api.P.hp)) throw new Error('P.hp non-finite @'+f);
      if(typeof api.S.mode!=='string') throw new Error('S.mode not a string @'+f);
    }
    if (api.P.evoPick) evoStuck=true;
  } catch(e){ err=e&&e.message||String(e); }
  log(!err && !evoStuck, `smoke:${champ}`, `frames=${frames}`+(err?` ERROR:${err}`:'')+(evoStuck?' EVO-PANEL-STUCK':''));
}

/* 2. REGRESSIONS — one named case per reported bug (NEVER delete; only add). */
const REGRESSIONS = [
  ['evo-panel-does-not-re-offer (evo-lock/de-level, 2026-06-21)', () => {
    const api = mk();
    api.setPlayerSnapshot({char:'warlock',kills:0,level:12,base:{STR:10,DEX:10,CON:10,ATK:10},evo10:'herald',evo20:null,nickname:'X'});
    api.startFight(); api.maybeOfferEvo();
    if (api.P.evoPick) return 'panel RE-OFFERED to an already-evolved warlock (input-lock bug)';
    if (api.P.evo10 !== 'herald') return 'evo10 not restored from snapshot (got '+api.P.evo10+')';
    return null;
  }],
  ['level-never-de-levels (2026-06-21)', () => {
    const api = mk();
    api.setPlayerSnapshot({char:'druid',kills:0,level:9,base:{STR:10,DEX:10,CON:10,ATK:10},evo10:'warden',nickname:'X'});
    if (api.lvl() < 9) return 'lvl() dropped to '+api.lvl()+' from a snapshot level of 9';
    return null;
  }],
  ['ronin-4attack-combo-ends-in-parry (item 2/3, 2026-06-21)', () => {
    // base ronin melee is a 4-attack sequence (combo cycles %4); attack 4 GRANTS a parry window.
    const api = mk(); api.fullReset('ronin'); api.startFight();
    for (let s=0;s<3;s++){ api.P.atkRecover=0; api.P.comboT=1; api.doSlash(); }
    if (api.P.comboParryT>0) return 'parry window granted BEFORE the 4th attack (should only be the finisher)';
    api.P.atkRecover=0; api.P.comboT=1; api.doSlash(); // the 4th (back-step finisher)
    if (api.P.comboParryT<=0) return 'attack 4 did not grant the combo parry window (got '+api.P.comboParryT+')';
    if (api.P.combo!==0) return 'combo did not cycle %4 back to 0 (got '+api.P.combo+')';
    return null;
  }],
  ['ronin-parry-fires-mid-attack-and-is-independent (item 3, 2026-06-21)', () => {
    // the button parry must fire DURING attack recovery, and the combo parry must NOT share the button gate.
    const api = mk(); api.fullReset('ronin'); api.startFight();
    api.P.atkRecover=1; api.P.parryCD=0; api.doParry();
    if (api.P.parryT<=0) return 'doParry did not fire during attack recovery (attack+parry blocked)';
    api.P.parryCD=99; // put the BUTTON parry on cooldown
    for (let s=0;s<4;s++){ api.P.atkRecover=0; api.P.comboT=1; api.doSlash(); }
    if (api.P.comboParryT<=0) return 'combo parry window blocked by the button cooldown (windows not independent)';
    return null;
  }],
  ['ronin-parry-negates-spell-and-heals (item 3, 2026-06-21)', () => {
    // A SPELL/zone hit resolves through hurtPlayer with from=null. A live parry window must FULLY negate it
    // (no damage), still grant the on-parry heal, and consume exactly one window.
    const api = mk(); api.fullReset('ronin'); api.startFight();
    const before = api.P.hp = Math.round(api.maxHP()*0.5); // sit at 50% so the +20% heal is observable
    api.P.parryT=0; api.P.comboParryT=1.0;                 // ONLY the combo window is up
    const fb0 = api.fireballs.length;
    api.hurtPlayer(9999, null);                            // a would-be-lethal spell
    if (api.P.hp < before) return 'parried spell still dealt damage (hp '+before+'->'+api.P.hp+')';
    if (api.P.hp <= before) return 'parried spell did not grant the on-parry heal (hp stayed '+api.P.hp+')';
    if (api.P.comboParryT > 0) return 'combo parry window not consumed by the parried spell';
    if (api.fireballs.length <= fb0) return 'parry did not fire the counter/riposte (no air-slash spawned)';
    return null;
  }],
  ['ronin-parry-works-on-ranged-and-melee (item 3, 2026-06-21)', () => {
    // The same resolution point negates ranged (from has coords/distance) and melee (close from) hits.
    const api = mk(); api.fullReset('ronin'); api.startFight();
    let before = api.P.hp = Math.round(api.maxHP()*0.5);
    api.P.parryT=1.0; api.P.comboParryT=0;                 // button window
    api.hurtPlayer(9999, {x:api.P.x+240,y:api.P.y,dead:false}); // RANGED source far away
    if (api.P.hp < before) return 'ranged hit not parried (took damage)';
    before = api.P.hp = Math.round(api.maxHP()*0.5);
    api.P.parryT=1.0;
    api.hurtPlayer(9999, {x:api.P.x+6,y:api.P.y,dead:false});   // MELEE source adjacent
    if (api.P.hp < before) return 'melee hit not parried (took damage)';
    return null;
  }],
  ['mobile-zoom-default-100-persists-reapplies (item 1, 2026-06-21)', () => {
    // Item 1 lives in the scene/UI layer (not pit.js), so guard it by STATIC source scan — it must never
    // silently revert to the old hardcoded 1.18 zoom, and must clamp 25..100, persist, and re-apply.
    const fs = require('fs');
    const root = path.join(__dirname, '..');
    const rd = p => { try { return fs.readFileSync(path.join(root, p), 'utf8'); } catch(e){ return ''; } };
    const ws = rd('src/scenes/WorldScene.js');
    if (!ws) return 'WorldScene.js not found';
    if (/setZoom\(\s*1\.18\s*\)/.test(ws)) return 'overworld still hardcodes the old 1.18 zoom (item 1 regressed)';
    if (!/worldZoomFactor|worldZoomPct/.test(ws)) return 'world zoom helpers missing';
    if (!/Math\.max\(\s*25[^)]*Math\.min\(\s*100/.test(ws)) return 'zoom not clamped to 25..100';
    if (!/applyWorldZoom\s*\(\)/.test(ws)) return 'applyWorldZoom (re-apply hook) missing';
    // persistence (GameState.meta + localStorage) and a default of 100
    if (!/worldZoom/.test(ws) || !/localStorage/.test(ws)) return 'zoom choice not persisted';
    if (!/=\s*100\b/.test(ws)) return 'no 100% default present';
    // the HUD control + its handler must exist
    const html = rd('index.html'); const dlg = rd('src/core/dialog.js');
    if (!/zoomOutBtn/.test(html) || !/zoomResetBtn/.test(html)) return 'zoom buttons missing from the HUD bar';
    if (!/setZoomLabel/.test(dlg)) return 'CityUI.setZoomLabel wiring missing';
    return null;
  }],
];
for (const [name, fn] of REGRESSIONS) {
  let msg; try { msg = fn(); } catch(e){ msg = 'threw: '+(e&&e.message||e); }
  log(!msg, `regression:${name}`, msg||'');
}
console.log(failures ? `\nFAILED — ${failures} case(s). 5-Whys the root cause; keep its regression case.` : `\nALL GREEN (${CHAMPS.length} smoke + ${REGRESSIONS.length} regressions)`);
process.exit(failures ? 1 : 0);
