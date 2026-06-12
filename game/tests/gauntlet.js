// Gauntlet sweep — runs the FULL 20-fight gauntlet headless for each character.
// Two modes:
//   assist (default): demo-style keep-alive (hp topped up at 45%, like the source's
//     own intro demos) so weak bots still exercise every fight, enemy type, summon,
//     resurrection, champ feeding, and beast phase. Asserts: victory reached, no exceptions.
//   honest: node game/tests/gauntlet.js honest — no keep-alive; reports how far bots get.
// Usage: node game/tests/gauntlet.js [assist|honest] [ronin|druid|warlock|all]

const { createPitCombat } = require('../src/combat/pit.js');

const MODE = (process.argv[2] || 'assist');
const WHO = (process.argv[3] || 'all');
const chars = WHO === 'all' ? ['ronin', 'druid', 'warlock'] : [WHO];

function run(ch) {
  let simMs = 0;
  const tq = [];
  global.setTimeout = (fn, ms) => { tq.push({ at: simMs + (ms || 0), fn }); return tq.length; };
  global.clearTimeout = () => {};
  const banners = [];
  const combat = createPitCombat({
    width: 1280, height: 720, now: () => simMs,
    ui: { banner: t1 => banners.push(t1) }
  });
  combat.fullReset(ch);
  const P = combat.P, S = combat.S;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const fightTimes = [];
  let fightStart = 0, maxFight = 0, crashed = null;

  const LIMIT = 30 * 60 * 1000; // 30 sim-minutes hard cap
  while (simMs < LIMIT) {
    simMs += 1000 / 60;
    for (let i = tq.length - 1; i >= 0; i--) if (tq[i].at <= simMs) { const f = tq[i].fn; tq.splice(i, 1); f(); }

    try {
      if (S.mode === 'victory') break;
      if (S.mode === 'death') break;
      if (S.mode === 'board') { fightStart = simMs; combat.startFight(); combat.frame(simMs); continue; }
      if (S.mode !== 'fight') { combat.frame(simMs); continue; }

      maxFight = Math.max(maxFight, S.fight);
      // assist: source-demo-style keep-alive, scaled up late where one-shots exceed 45% of max HP
      if (MODE === 'assist' && P.hp < combat.maxHP() * (S.fight >= 12 ? 0.85 : 0.45)) P.hp = combat.maxHP();

      const foes = combat.enemies.filter(e => !e.dead);
      // focus support enemies first (healers out-heal kiting bots), then nearest
      const prio = foes.filter(e => e.type === 'stitch' || e.type === 'necro' || e.type === 'master');
      const foe = (prio.length ? prio : foes).sort((a, b) => dist(P, a) - dist(P, b))[0];
      const k = combat.keys;
      k.w = k.a = k.s = k.d = false;

      if (foe) {
        const dFoe = dist(P, foe);
        const moveTo = (tx, ty) => { const dx = tx - P.x, dy = ty - P.y;
          k.w = dy < -8; k.s = dy > 8; k.a = dx < -8; k.d = dx > 8; };

        if (ch === 'ronin') {
          moveTo(foe.x - Math.cos(foe.face) * 55, foe.y - Math.sin(foe.face) * 55);
          if (foe.attacking && foe.tele > 0 && dFoe < 140) combat.doParry();
          if (dFoe < 95) { if (P.heavyCD <= 0 && Math.random() < 0.25) combat.doHeavy(); else combat.doSlash(); }
          if (P.hp / combat.maxHP() < 0.3 && dFoe < 90 && P.rollCD <= 0) combat.doRoll();
        } else if (ch === 'druid') {
          // kite inside glaive reach, vines when crowded, howl-heal via wolf when hurt
          const tooClose = dFoe < 90, tooFar = dFoe > 165;
          if (tooClose) moveTo(P.x + (P.x - foe.x), P.y + (P.y - foe.y));
          else if (tooFar) moveTo(foe.x, foe.y);
          if (P.form === 'human') {
            combat.doSlash();                                   // throws/refreshes glaive
            const near = foes.filter(e => dist(P, e) < 160).length;
            if (near >= 1 && P.cdVines <= 0) combat.doHeavy();  // vines + retreat hop
            if (combat.lvl() >= 6 && P.hp / combat.maxHP() < 0.5 && P.humanCD <= 0) {
              combat.doParry(); combat.doParry();               // human->bear->wolf
            }
          } else if (P.form === 'wolf') {
            if (P.cdHowl <= 0) combat.doHeavy();                // howling heal
            combat.doSlash();
          } else if (P.form === 'bear') {
            if (dFoe < 130 && P.cdRoar <= 0) combat.doHeavy();
            if (dFoe < 95) combat.doSlash();
            else combat.doParry();                              // bear -> wolf
          }
          if (foe.attacking && foe.tele < 0.15 && dFoe < 100 && P.rollCD <= 0) combat.doRoll();
        } else { // warlock
          if (P.devilT > 0) { combat.doSlash(); }               // arch devil claw frenzy
          else {
            moveTo(foe.x, foe.y);                               // press the focus target
            const nearest = foes.sort((a, b) => dist(P, a) - dist(P, b))[0];
            // portal swaps with the FURTHEST enemy — use it to land on fleeing supports
            if (prio.length && P.parryCD <= 0 && dFoe > 160 && foes.length > 1) combat.doParry();
            // hex auto-targets nearest: only cast when the right head is nearest
            if (P.hexCD <= 0 && (nearest === foe || dFoe < 70)) combat.doSlash();
            // demons are the warlock's dps: blink-stun to buy a safe channel window
            const demonsUp = combat.demons.filter(d => d.hp > 0).length;
            if (!P.channel && demonsUp === 0 && P.heavyCD <= 0) {
              if (dist(P, nearest) < 230 && P.rollCD <= 0) combat.doRoll();
              combat.doHeavy();
            }
            if (P.channel) {
              const want = combat.lvl() >= 8 ? 6.2 : (combat.lvl() >= 3 ? 4.2 : 3.2);
              if (P.channel.t >= want) combat.heavyRelease();
            }
            if (P.hp / combat.maxHP() < 0.35 && P.rollCD <= 0 && dist(P, nearest) < 80) combat.doRoll();
          }
        }
      }
      combat.frame(simMs);
      if (S.mode === 'board' && S.fight > fightTimes.length)
        fightTimes.push(((simMs - fightStart) / 1000).toFixed(1));
    } catch (err) { crashed = { fight: S.fight, name: combat.FIGHTS[S.fight] && combat.FIGHTS[S.fight].name, err }; break; }
  }

  const out = {
    char: ch, mode: MODE,
    result: crashed ? 'CRASH' : S.mode === 'victory' ? 'VICTORY' : S.mode === 'death' ? 'DIED' : 'TIMEOUT',
    reachedFight: maxFight + 1, of: combat.FIGHTS.length,
    kills: P.kills, dice: combat.diceN() + 'd8',
    level: ch === 'ronin' ? ('tier' + (P.bladeTier || 0)) : ('lv' + combat.lvl()),
    nickname: combat.nickname,
    simMin: (simMs / 60000).toFixed(1)
  };
  console.log(JSON.stringify(out));
  if (crashed) { console.error(`  CRASH in fight ${crashed.fight + 1} (${crashed.name}):`); console.error(crashed.err.stack.split('\n').slice(0, 5).join('\n')); }
  return out;
}

let fail = false;
for (const ch of chars) {
  const r = run(ch);
  if (r.result === 'CRASH') fail = true;
  if (MODE === 'assist' && r.result !== 'VICTORY') fail = true;
}
console.log(fail ? '\nGAUNTLET SWEEP: FAIL' : '\nGAUNTLET SWEEP: PASS');
process.exit(fail ? 1 : 0);
