// Headless harness — boots the ported combat sim in node (no canvas, no Phaser)
// and has a scripted bot fight THE DOOR (fight 1). Proves the port's logic runs
// and the fight is winnable with source mechanics: flanking + heavy guard-breaks + parry.
// Usage: node game/tests/headless.js [trials]

const { createPitCombat } = require('../src/combat/pit.js');

const trials = parseInt(process.argv[2] || '5', 10);
let pass = 0;

function runTrial(t, ch) {
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
  combat.fullReset(ch);                // -> board for fight 1 (ember = RKIT, same ronin door bot)
  if (screen !== 'board') throw new Error('expected board screen, got ' + screen);
  combat.startFight();

  const P = combat.P, S = combat.S;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const baseDice = combat.diceN();
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
      // --- bot: circle to the door's back, slash there, heavy to break guard, parry telegraphs ---
      const aFoeFacing = foe.face;                       // where the door looks
      const behindX = foe.x - Math.cos(aFoeFacing) * 55; // point behind it
      const behindY = foe.y - Math.sin(aFoeFacing) * 55;
      const tgt = { x: behindX, y: behindY };
      const dx = tgt.x - P.x, dy = tgt.y - P.y, d = Math.hypot(dx, dy);
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
  console.log(`trial ${t}: ${won ? 'WIN' : 'LOSS/' + S.mode} in ${(simMs / 1000).toFixed(1)}s · kills=${P.kills}` +
    ` · dice=${combat.diceN()}d8 · hp=${Math.round(P.hp)}/${combat.maxHP()} · nickname=${combat.nickname}` +
    ` · snowball=${sawDiceGrow ? 'ok' : 'NO'} · banners=[${banners.slice(0, 4).join(' | ')}]`);
  if (won && !sawDiceGrow) throw new Error('kill snowball did not raise dice — port broken');
  return won;
}

const charArg = process.argv[3];
const CHARS = charArg ? [charArg] : ['ronin', 'ember']; // ember = RKIT (ronin kit): wins fight 1 the same way
let fail = false;
for (const ch of CHARS) {
  let cpass = 0;
  console.log(`--- ${ch} ---`);
  for (let t = 1; t <= trials; t++) if (runTrial(t, ch)) cpass++;
  pass += cpass;
  if (cpass === 0) { console.error(`FAIL: ${ch} never won fight 1 — check port`); fail = true; }
}
console.log(`\n${pass}/${CHARS.length * trials} wins`);
if (fail) process.exit(1);
console.log('HEADLESS HARNESS PASS');
