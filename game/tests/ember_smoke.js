// EMBER smoke test (item-12 sub-step 1b) — proves the new 'ember' character has a
// crash-free combat profile that REUSES the RONIN kit. Builds a player with char:'ember',
// runs a full scripted pit fight (THE DOOR, fight 1) and asserts: no throw, a WIN, and that
// the ronin-style kill-snowball is active for ember (dice grow with kills, base HP 34, no
// level/evo path). This makes the EMBER combat side QA-able BEFORE any title-screen button
// is wired (the un-QA-able DOM line lands only after this passes). Usage:
//   node game/tests/ember_smoke.js [trials]

const { createPitCombat } = require('../src/combat/pit.js');

const trials = parseInt(process.argv[2] || '5', 10);
let pass = 0;

function runTrial(t) {
  let simMs = 0;
  const tq = [];
  global.setTimeout = (fn, ms) => { tq.push({ at: simMs + (ms || 0), fn }); return tq.length; };
  global.clearTimeout = () => {};

  let screen = null, banners = [];
  const ui = {
    banner: (t1, t2) => banners.push(t1),
    screen: id => { screen = id; }
  };
  const combat = createPitCombat({ width: 1280, height: 720, now: () => simMs, ui });
  combat.fullReset('ember');          // -> board for fight 1, as the EMBER
  if (screen !== 'board') throw new Error('expected board screen, got ' + screen);
  if (combat.P.char !== 'ember') throw new Error('expected char ember, got ' + combat.P.char);

  // ember must inherit the ronin kit: base 34 HP, kills-snowball dice (1+kills), no level path
  const baseDice = combat.diceN();
  if (baseDice !== 1) throw new Error('ember should start at 1d8 (ronin kit), got ' + baseDice + 'd8');

  combat.startFight();

  const P = combat.P, S = combat.S;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  let sawDiceGrow = false;

  const LIMIT = 120; // sim seconds
  while (simMs < LIMIT * 1000) {
    simMs += 1000 / 60;
    for (let i = tq.length - 1; i >= 0; i--) if (tq[i].at <= simMs) { const f = tq[i].fn; tq.splice(i, 1); f(); }

    if (S.mode === 'board' && S.fight >= 1) break;   // fight 1 won
    if (S.mode === 'death') break;
    if (S.mode !== 'fight') { combat.frame(simMs); continue; }

    const foe = combat.enemies.find(e => !e.dead);
    if (foe) {
      // same proven bot as headless.js: circle to the door's back, slash, heavy guard-breaks, parry telegraphs
      const behindX = foe.x - Math.cos(foe.face) * 55;
      const behindY = foe.y - Math.sin(foe.face) * 55;
      const dx = behindX - P.x, dy = behindY - P.y;
      const k = combat.keys;
      k.w = dy < -8; k.s = dy > 8; k.a = dx < -8; k.d = dx > 8;

      const dFoe = dist(P, foe);
      if (foe.attacking && foe.tele > 0 && dFoe < 140) combat.doParry();
      if (dFoe < 95) {
        if (P.heavyCD <= 0 && Math.random() < 0.25) combat.doHeavy();
        else combat.doSlash();
      }
      if (P.hp / combat.maxHP() < 0.3 && dFoe < 90 && P.rollCD <= 0) combat.doRoll();
    }
    combat.frame(simMs);
    if (combat.diceN() > baseDice) sawDiceGrow = true;
  }

  const won = S.fight >= 1 && S.mode === 'board';
  console.log(`trial ${t}: ${won ? 'WIN' : 'LOSS/' + S.mode} in ${(simMs / 1000).toFixed(1)}s · char=${P.char}` +
    ` · kills=${P.kills} · dice=${combat.diceN()}d8 · hp=${Math.round(P.hp)}/${combat.maxHP()}` +
    ` · nickname=${combat.nickname} · snowball=${sawDiceGrow ? 'ok' : 'NO'}`);
  if (won && !sawDiceGrow) throw new Error('ember kill-snowball did not raise dice — ronin kit not wired for ember');
  if (won && combat.maxHP() < 34) throw new Error('ember maxHP below ronin base — kit not applied');
  return won;
}

for (let t = 1; t <= trials; t++) if (runTrial(t)) pass++;
console.log(`\n${pass}/${trials} wins`);
if (pass === 0) { console.error('FAIL: ember never won fight 1 — profile broken'); process.exit(1); }
console.log('EMBER SMOKE PASS');
