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
    // PRIME the clock to the engine's origin: tick() derives dt from last=NOW()=Date.now() (wall-clock
    // epoch ms). A synthetic clock that starts BELOW wall-clock (the old t=1000) makes the FIRST dt a
    // huge NEGATIVE, which inflates S.hitPause to ~1e9 and FREEZES the sim — the loop then runs no-op
    // frames (a frozen harness still looks green: hp finite, mode a string). Start at the same origin so
    // these 2000 frames actually exercise combat. (playtest 2026-06-25; guarded by the hitPause check
    // below + REGRESSION harness:smoke-loop-clock-primed-not-frozen.)
    let t=Date.now();
    for (let f=0; f<2000; f++) {
      if (f%18===0){const k=inputs[(f/18)%inputs.length|0]; try{api[k]&&api[k](); if(k==='doHeavy')api.heavyRelease&&api.heavyRelease();}catch(_){}}
      if (f%25===0){try{api.pointerAttack&&api.pointerAttack(440+(f%120),300);}catch(_){}}
      if (f===300 && champ!=='ronin'){try{api.P.level=10; api.maybeOfferEvo&&api.maybeOfferEvo();}catch(_){}}
      t+=1000/60; api.frame(t); frames=f+1;
      if(!Number.isFinite(api.P.hp)) throw new Error('P.hp non-finite @'+f);
      if(typeof api.S.mode!=='string') throw new Error('S.mode not a string @'+f);
      if(api.S.hitPause>1) throw new Error('sim FROZEN — hitPause inflated to '+api.S.hitPause+' @'+f+' (clock not primed; combat not exercised)');
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

  /* ---- EVOLUTION KITS (Hiro 2026-06-24): each advertised buff is PRESENT when its evo key is set and
         ABSENT otherwise, so un-evolved / other-road / other champions stay byte-identical. ---- */
  ['seraph-wrath-halo-ray-harder-and-wider (evo kit)', () => {
    const ray = (e10,e20) => { const a=mk(); a.fullReset('seraph'); a.P.level=20; if(e10)a.P.evo10=e10; if(e20)a.P.evo20=e20;
      a.startEncounter([{type:'dummy',x:500,y:300,hp:1e9,maxhp:1e9}]); a.P.x=300;a.P.y=300;a.P.face=0; a.fireRay();
      return a.rays[a.rays.length-1]; };
    const r0=ray(null,null), r1=ray('wrath',null);
    if(!r0||!r1) return 'no halo ray produced';
    if(!(r1.w>r0.w)) return 'wrath did not widen/intensify the halo ray (base w='+r0.w+' vs wrath w='+r1.w+')';
    return null;
  }],
  ['seraph-judgement-smite-ray-reaches-further (evo kit lv20)', () => {
    const ray = (e10,e20) => { const a=mk(); a.fullReset('seraph'); a.P.level=20; if(e10)a.P.evo10=e10; if(e20)a.P.evo20=e20;
      a.startEncounter([{type:'dummy',x:500,y:300,hp:1e9,maxhp:1e9}]); a.P.x=300;a.P.y=300;a.P.face=0; a.fireRay();
      return a.rays[a.rays.length-1]; };
    const L0=ray('wrath',null).len, L1=ray('wrath','judgement').len;
    if(!(L1>L0)) return 'judgement did not extend the smite ray reach (got len='+L1+' vs '+L0+')';
    return null;
  }],
  ['seraph-aegis-ward-lingers-and-chains-bind (evo kit)', () => {
    const setup = (e10,e20) => { const a=mk(); a.fullReset('seraph'); if(e10)a.P.evo10=e10; if(e20)a.P.evo20=e20;
      a.startEncounter([{type:'dummy',x:500,y:300,hp:1e9,maxhp:1e9}]); return a; };
    const base=setup(null,null); base.ascend(); const bw=base.P.wardT;
    const ae=setup('aegis',null); ae.ascend();
    if(!(ae.P.wardT>bw)) return 'aegis grace ward did not linger longer (got '+ae.P.wardT+' vs '+bw+')';
    ae.P.level=20; ae.P.x=300;ae.P.y=300;ae.P.face=0; ae.fireRay();
    if(!ae.enemies.some(e=>e.vined>0)) return 'aegis chains of decree did not BIND (root) the struck foe';
    const ctl=setup(null,null); ctl.P.level=20; ctl.P.x=300;ctl.P.y=300;ctl.P.face=0; ctl.fireRay();
    if(ctl.enemies.some(e=>e.vined>0)) return 'un-evolved seraph BOUND a foe (gate leak — should only CHAIN/stun)';
    return null;
  }],
  ['seraph-bulwark-chains-bind-all-nearby (evo kit lv20)', () => {
    const setup = (e20) => { const a=mk(); a.fullReset('seraph'); a.P.level=20; a.P.evo10='aegis'; if(e20)a.P.evo20=e20;
      a.startEncounter([{type:'dummy',x:500,y:300,hp:1e9,maxhp:1e9},{type:'dummy',x:520,y:420,hp:1e9,maxhp:1e9}]);
      a.P.x=300;a.P.y=300;a.P.face=0; a.fireRay(); return a; };
    if(!(setup('bulwark').enemies[1].vined>0)) return 'bulwark did not bind the NEARBY off-beam foe';
    if(setup(null).enemies[1].vined>0) return 'aegis alone bound a NON-struck nearby foe (only bulwark should)';
    return null;
  }],
  ['druid-alpha-wolf-bite-bleeds (evo kit)', () => {
    const bite = (e10,e20) => { const a=mk(); a.fullReset('druid'); a.P.level=20;
      a.startEncounter([{type:'dummy',x:380,y:300,hp:1e9,maxhp:1e9}]);
      a.P.x=300;a.P.y=300;a.P.face=0;a.P.form='wolf';a.P.atkRecover=0; if(e10)a.P.evo10=e10; if(e20)a.P.evo20=e20;
      a.doSlash(); return a.enemies.some(e=>e.bleedT>0); };
    if(!bite('alpha',null)) return 'FERAL ALPHA wolf bite did not apply BLEED';
    if(bite(null,null)) return 'un-evolved/warden wolf bite applied BLEED (gate leak)';
    return null;
  }],
  ['druid-howl-pack-size-gated-on-road (evo kit)', () => {
    const howl = (e10,e20) => { const a=mk(); a.fullReset('druid'); a.P.level=20;
      a.startEncounter([{type:'dummy',x:400,y:300,hp:1e9,maxhp:1e9}]);
      a.P.form='wolf'; a.P.cdHowl=0; a.wolves.length=0; if(e10)a.P.evo10=e10; if(e20)a.P.evo20=e20;
      a.doHeavy(); return a.wolves.length; };
    const base=howl(null,null), alpha=howl('alpha',null), sov=howl('alpha','sovereign');
    if(base!==5) return 'base howl no longer summons 5 (got '+base+') — non-alpha must stay byte-identical';
    if(!(alpha>base)) return 'FERAL ALPHA howl did not summon an extra wolf (base '+base+' vs alpha '+alpha+')';
    if(!(sov>alpha)) return 'DIRE MOON SOVEREIGN howl did not summon the fuller pack (alpha '+alpha+' vs sov '+sov+')';
    return null;
  }],
  ['warlock-lichlord-raises-extra-undead (evo kit lv20)', () => {
    const zc = (e20) => { const a=mk(); a.fullReset('warlock'); a.P.level=20;
      a.startEncounter([{type:'dummy',x:400,y:300,hp:1e9,maxhp:1e9}]);
      a.P.evo10='binder'; if(e20)a.P.evo20=e20; a.demons.length=0; a.summonZombies(); return a.demons.length; };
    const binder=zc(null), lich=zc('lichlord');
    if(!(lich>binder)) return 'LICH SOVEREIGN did not raise EXTRA undead (binder '+binder+' vs lichlord '+lich+')';
    return null;
  }],
  ['warlock-archfiend-devil-timer-and-aoe (evo kit lv20)', () => {
    const dur = (e20) => { const a=mk(); a.fullReset('warlock'); a.P.level=20;
      a.startEncounter([{type:'dummy',x:400,y:300,hp:1e9,maxhp:1e9}]);
      a.P.evo10='herald'; if(e20)a.P.evo20=e20; a.enterDevil(); return a.P.devilT; };
    const herald=dur(null), arch=dur('archfiend');
    if(!(arch>herald)) return 'ARCHFIEND did not extend the arch-devil timer (herald '+herald+' vs archfiend '+arch+')';
    const fs=require('fs'); const src=fs.readFileSync(path.join(__dirname,'..','src','combat','pit.js'),'utf8');
    if(!/archfiend'\?1\.5:1/.test(src)) return 'archfiend hellfire/Sheol AoE-widening gate missing from the fireball';
    return null;
  }],
  /* ---- WARLOCK path tweaks (Hiro 2026-06-22): gated on the road; plain warlock unchanged ---- */
  ['warlock-binder-lich-fade-lasts-longer (path tweak)', () => {
    const fd = (e10) => { const a=mk(); a.fullReset('warlock'); a.P.level=20;
      a.startEncounter([{type:'dummy',x:400,y:300,hp:1e9,maxhp:1e9}]);
      a.P.lich=true; a.P.parryCD=0; if(e10)a.P.evo10=e10; a.doParry(); return a.P.fadeT; };
    if(fd(null)!==5) return 'plain lich FADE no longer 5s (got '+fd(null)+')';
    if(fd('binder')!==10) return 'DREADBINDER FADE not extended to 10s (got '+fd('binder')+')';
    return null;
  }],
  ['warlock-herald-devil-shorter-and-portal-ward-longer (path tweak)', () => {
    const dv = (e10) => { const a=mk(); a.fullReset('warlock'); a.P.level=20;
      a.startEncounter([{type:'dummy',x:400,y:300,hp:1e9,maxhp:1e9}]);
      if(e10)a.P.evo10=e10; a.enterDevil(); return a.P.devilT; };
    if(dv(null)!==15) return 'plain warlock arch-devil timer not 15 (got '+dv(null)+')';
    if(dv('herald')!==21) return 'herald arch-devil timer not reduced to 21 (got '+dv('herald')+')';
    const pw = (e10) => { const a=mk(); a.fullReset('warlock'); a.P.level=20;
      a.startEncounter([{type:'dummy',x:400,y:300,hp:1e9,maxhp:1e9}]);
      a.P.lich=false; a.P.parryCD=0; if(e10)a.P.evo10=e10; a.doParry(); return a.P.wardT; };
    if(pw(null)!==3) return 'plain warlock PORTAL ward not 3 (got '+pw(null)+')';
    if(pw('herald')!==7) return 'herald PORTAL ward not extended to 7 (got '+pw('herald')+')';
    return null;
  }],

  /* ---- HARNESS INTEGRITY (playtest 2026-06-25): the section-1 smoke loop must PRIME its frame clock
         or the whole "2000 frames of combat" runs FROZEN. tick() derives dt from last=NOW()=Date.now()
         (wall-clock epoch ms); a synthetic clock that starts BELOW wall-clock makes the FIRST dt hugely
         NEGATIVE, which inflates S.hitPause to ~1e9 — every subsequent tick early-returns in the
         `if(S.hitPause>0){...return;}` guard, so NO combat runs. A frozen harness still looks green
         (hp finite, mode a string), so a real sustained-combat crash/softlock would pass silently.
         This case pins the freeze SIGNATURE: an UNPRIMED clock (t below wall-clock) freezes the sim and
         lands ~no damage; a PRIMED clock (t=Date.now()) runs real combat. The smoke loop above also now
         asserts hitPause stays bounded every frame, so an un-primed regression fails loudly. ---- */
  ['harness:smoke-loop-clock-primed-not-frozen (playtest 2026-06-25)', () => {
    const drive = (startT) => { const a=mk(); a.fullReset('ronin');
      a.startEncounter([{type:'dummy',x:520,y:300,hp:1e9,maxhp:1e9}]);
      const e=a.enemies[0]; const hp0=e.hp; let t=startT, maxHitPause=0;
      for(let f=0;f<240;f++){ a.P.x=e.x-40;a.P.y=e.y; a.pointerMove(e.x,e.y);
        if(f%7===0)a.pointerAttack(e.x,e.y); t+=1000/60; a.frame(t);
        maxHitPause=Math.max(maxHitPause,a.S.hitPause); }
      return {dmg:hp0-e.hp, maxHitPause}; };
    const primed = drive(Date.now());
    if(primed.maxHitPause>1) return 'PRIMED clock still froze (hitPause='+primed.maxHitPause+') — engine dt guard regressed';
    if(primed.dmg<=0) return 'PRIMED clock landed NO damage over 240 frames — sim not advancing under a sane clock';
    const unprimed = drive(1000);   // the OLD smoke-loop clock origin — must demonstrably FREEZE
    if(!(unprimed.maxHitPause>1e6)) return 'expected an UNPRIMED clock to FREEZE the sim (hitPause~1e9); it did not — freeze signature changed, re-derive the guard';
    return null;
  }],

  /* ---- REENTRANCY (playtest 2026-06-26): updDemons() walks demons[] by a cached index, but killEnemy()
         caps the zombie horde with demons.shift() (FRONT removal) and killEnemy fires from INSIDE that
         loop whenever a summon (zombie/brute/arch-burst) kills an INFECTED foe (infection -> IT RISES).
         The front-shift slides every index down, so the cached i can point PAST the shrunken array ->
         demons[i] is undefined -> crash. This surfaced as an intermittent P1 in the pursue-driver:
         warlock/herald & herald-archfiend "Cannot read properties of undefined (reading 'type'/'life')"
         at fights 16-20. 5-WHYS: (1) crash reading d.type/d.life; (2) d===demons[i] was undefined;
         (3) demons[] shrank mid-loop; (4) killEnemy's IT-RISES path did demons.shift() to cap the horde,
         reentrantly from updDemons; (5) the index-based backward loop assumed demons[] is immutable during
         iteration. ISHIKAWA -> code-logic (reentrant mutation of an actively-iterated array). Fix: skip
         empty slots in updDemons (`if(!d)continue;`). This case rebuilds the exact race: an over-cap
         zombie horde adjacent to a cluster of ~0-hp INFECTED foes; one frame triggers many reentrant
         kills+shifts. Pre-fix it THROWS; post-fix the loop survives and the horde caps at 12. ---- */
  ['demon-loop-survives-reentrant-horde-shift (playtest 2026-06-26)', () => {
    const api = mk(); api.fullReset('warlock');
    api.startEncounter([{type:'thrall',hp:1}]);
    api.P.evo10='herald';
    api.enemies.length=0;
    for(let i=0;i<6;i++) api.enemies.push(api.mkEnemy({type:'thrall',x:450,y:300,hp:1,maxhp:1,infectT:10}));
    api.demons.length=0; // stack the horde ABOVE the >=12 cap, all zombies adjacent & ready to bite THIS frame
    for(let i=0;i<16;i++) api.demons.push({type:'zombie',x:451,y:300,r:13,face:0,hp:50,maxhp:50,life:24,cool:-1,flash:0,walkP:0,dmgMul:5});
    let t=Date.now();
    for(let f=0;f<4;f++){ t+=1000/60; api.frame(t); } // pre-fix: throws "reading 'type'/'life' of undefined"
    if(api.demons.length>12) return 'horde cap breached: demons='+api.demons.length+' (should stay <=12)';
    if(!api.demons.every(d=>d&&typeof d.type==='string')) return 'demons[] holds an undefined/garbage slot after a reentrant shift';
    return null;
  }],
];
for (const [name, fn] of REGRESSIONS) {
  let msg; try { msg = fn(); } catch(e){ msg = 'threw: '+(e&&e.message||e); }
  log(!msg, `regression:${name}`, msg||'');
}
console.log(failures ? `\nFAILED — ${failures} case(s). 5-Whys the root cause; keep its regression case.` : `\nALL GREEN (${CHAMPS.length} smoke + ${REGRESSIONS.length} regressions)`);
process.exit(failures ? 1 : 0);
// mount re-sync 2026-06-25 (OneDrive FUSE served a stale truncated tail; file intact on disk)
