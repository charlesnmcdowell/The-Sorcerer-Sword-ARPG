#!/usr/bin/env node
/* COMPETENT PURSUE-DRIVER (playtest agent). NOT a unit gate — the deep
   "can a real player clear it / does anything break under sustained driven combat" harness.
   Loads pit.js and PLAYS each champion (ronin/druid both roads/warlock both roads/seraph)
   through the FULL gauntlet: pursue nearest foe, attack, heavy/roll/parry/abilities, take
   evolutions, sustain long fights. Watches for: crashes, NaN/undefined state, softlocks (a
   fight that never resolves), unbounded entity growth, per-frame compute blow-ups, and
   UNWINNABLE fights. Run:  node tools/playtest_drive.js [pit.js] */
const path = require('path');
const PIT = process.argv[2] || path.join(__dirname, '..', 'src', 'combat', 'pit.js');
let createPitCombat;
try { ({ createPitCombat } = require(PIT)); }
catch (e) { console.error('LOAD FAIL', PIT, e.message); process.exit(2); }

const realSetTimeout = global.setTimeout;
let timerQ = [];
global.setTimeout = (fn) => { timerQ.push(fn); return 0; };
function flushTimers(cap = 5000) { let n = 0; while (timerQ.length && n++ < cap) { const fn = timerQ.shift(); fn(); } }

const mk = () => { const a = createPitCombat({}); a.resize(900, 600); return a; };
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
let problems = [];
function flag(sev, champ, fight, msg) { problems.push({ sev, champ, fight, msg }); }

function playGauntlet(champ, plan) {
  const api = mk();
  const label = `${champ}${plan.label ? '/' + plan.label : ''}`;
  api.fullReset(champ); api.startFight();
  const st = { maxEnemies:0,maxDemons:0,maxWolves:0,maxFire:0,maxBullets:0,maxZones:0,maxRays:0,maxFrameMs:0,frames:0,fightsCleared:0,deaths:0 };
  let t = Date.now(), lastFight = 0, fightFrames = 0, picksMade = 0, err = null, outcome = 'incomplete';
  const FRAME_BUDGET = 400000, STALL_FRAMES = 9000;
  try {
    for (let f = 0; f < FRAME_BUDGET; f++) {
      const S = api.S, P = api.P;
      if (S.mode === 'victory') { outcome = 'CLEARED'; break; }
      if (S.mode === 'death') { st.deaths++; outcome = 'DIED@fight' + (S.fight + 1); break; }
      if (S.mode === 'board' || S.mode === 'title') { api.startFight(); fightFrames = 0; continue; }
      if (P.evoPick) {
        const tier = P.evoTier || 10;
        const want = tier === 20 ? (plan.road20 || 0) : (plan.road10 || 0);
        api.pickEvo(P.evoPick[want] ? want : 0); picksMade++; continue;
      }
      if (S.mode === 'fight') {
        const foes = api.enemies.filter(e => !e.dead);
        const tgt = foes.sort((a, b) => dist(P, a) - dist(P, b))[0];
        if (tgt) {
          const dx = tgt.x - P.x, dy = tgt.y - P.y, d = Math.hypot(dx, dy) || 1;
          if (d > 46) { api.stick.dx = dx / d; api.stick.dy = dy / d; api.stick.mag = 1; }
          else { api.stick.dx = 0; api.stick.dy = 0; api.stick.mag = 0; }
          api.pointerMove(tgt.x, tgt.y);
          if (f % 7 === 0) api.pointerAttack(tgt.x, tgt.y);
          if (f % 47 === 0) { api.doHeavy(); api.heavyRelease && api.heavyRelease(); }
          if (f % 31 === 0) api.doParry();
          if (f % 59 === 0 && d < 80) api.doRoll();
        }
      }
      if (S.fight === lastFight) {
        fightFrames++;
        if (fightFrames > STALL_FRAMES) {
          flag('P1', label, S.fight + 1, `SOFTLOCK/UNWINNABLE — fight ${S.fight + 1} (${api.FIGHTS[S.fight].name}) did not resolve in ${STALL_FRAMES} frames (enemies alive=${api.enemies.filter(e => !e.dead).length}, P.hp=${P.hp})`);
          outcome = 'STALL@fight' + (S.fight + 1); break;
        }
      } else { st.fightsCleared += (S.fight - lastFight); lastFight = S.fight; fightFrames = 0; }
      const t0 = process.hrtime.bigint();
      t += 1000 / 60; api.frame(t); flushTimers();
      const ms = Number(process.hrtime.bigint() - t0) / 1e6;
      if (!Number.isFinite(P.hp)) throw new Error(`P.hp non-finite @f${f} fight${S.fight + 1}`);
      if (typeof S.mode !== 'string') throw new Error(`S.mode not string @f${f}`);
      if (!Number.isFinite(P.x) || !Number.isFinite(P.y)) throw new Error(`P pos NaN @f${f}`);
      st.maxEnemies = Math.max(st.maxEnemies, api.enemies.length);
      st.maxDemons = Math.max(st.maxDemons, api.demons.length);
      st.maxWolves = Math.max(st.maxWolves, api.wolves.length);
      st.maxFire = Math.max(st.maxFire, api.fireballs.length);
      st.maxBullets = Math.max(st.maxBullets, api.bullets.length);
      st.maxZones = Math.max(st.maxZones, api.zones.length);
      st.maxRays = Math.max(st.maxRays, api.rays.length);
      st.maxFrameMs = Math.max(st.maxFrameMs, ms);
      st.frames = f + 1;
    }
  } catch (e) { err = e && e.message || String(e); }
  if (err) { flag('P1', label, lastFight + 1, `CRASH: ${err}`); outcome = 'CRASH'; }
  if (st.maxEnemies > 120) flag('P2', label, '-', `enemies[] peaked at ${st.maxEnemies} (possible unbounded growth)`);
  if (st.maxDemons > 40) flag('P2', label, '-', `demons[] peaked at ${st.maxDemons}`);
  if (st.maxWolves > 40) flag('P2', label, '-', `wolves[] peaked at ${st.maxWolves}`);
  if (st.maxFire > 200) flag('P2', label, '-', `fireballs[] peaked at ${st.maxFire}`);
  if (st.maxBullets > 200) flag('P2', label, '-', `bullets[] peaked at ${st.maxBullets}`);
  if (st.maxFrameMs > 50) flag('P2', label, '-', `per-frame compute peaked at ${st.maxFrameMs.toFixed(1)}ms`);
  if (outcome.startsWith('DIED')) flag('REVIEW', label, '-', `driven run ended: ${outcome} (balance or blocker — inspect)`);
  console.log(`${outcome === 'CLEARED' ? 'CLEAR ' : 'NOCLR '} ${label.padEnd(20)} cleared=${st.fightsCleared}/${api.FIGHTS.length} picks=${picksMade} outcome=${outcome}  maxE=${st.maxEnemies} maxD=${st.maxDemons} maxW=${st.maxWolves} maxFire=${st.maxFire} maxFrameMs=${st.maxFrameMs.toFixed(2)} frames=${st.frames}`);
  return outcome;
}

const RUNS = [
  ['ronin', { label: '' }],
  ['druid', { label: 'warden', road10: 0 }],
  ['druid', { label: 'alpha', road10: 1 }],
  ['warlock', { label: 'herald', road10: 0, road20: 0 }],
  ['warlock', { label: 'binder', road10: 1, road20: 0 }],
  ['warlock', { label: 'herald-archfiend', road10: 0, road20: 1 }],
  ['warlock', { label: 'binder-lichlord', road10: 1, road20: 1 }],
  ['seraph', { label: '' }],
];
console.log('=== COMPETENT PURSUE-DRIVER — full gauntlet per champion/road ===');
for (const [champ, plan] of RUNS) playGauntlet(champ, plan);
global.setTimeout = realSetTimeout;
console.log('\n=== FINDINGS ===');
if (!problems.length) console.log('CLEAN — no crash / NaN / softlock / unbounded growth / unwinnable fight under driven play.');
else for (const p of problems) console.log(`[${p.sev}] ${p.champ} (fight ${p.fight}): ${p.msg}`);
process.exit(problems.some(p => p.sev === 'P1' || p.sev === 'P2') ? 1 : 0);
