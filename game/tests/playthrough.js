// Full playthrough harness — plays the game's real code end-to-end and narrates.
// Arena gauntlet -> payout -> innkeeper (pays 5s) -> grove packs -> dungeon -> artifacts -> guild turn-in.
// Usage: node game/tests/playthrough.js [ronin|druid|warlock] [honest]

const { createPitCombat } = require('../src/combat/pit.js');
const { Money } = require('../src/core/money.js');
const { Quests } = require('../src/world/quests.js');
const { Companions } = require('../src/world/companions.js');

const CHAR = process.argv[2] || 'warlock';
const HONEST = process.argv[3] === 'honest';
const log = (...a) => console.log(...a);
const say = (who, t) => log(`  ${who}: "${t}"`);

let simMs = 0; const tq = [];
global.setTimeout = (fn, ms) => { tq.push({ at: simMs + (ms || 0), fn }); return tq.length; };
global.clearTimeout = () => {};
const banners = [];
const combat = createPitCombat({ width: 1280, height: 720, now: () => simMs,
  ui: { banner: (t1, t2) => banners.push([t1, t2]) } });
const P = combat.S && combat.P, S = combat.S;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// ---- the warlock bot (same strategy as the gauntlet sweep) ----
function botFrame() {
  const foes = combat.enemies.filter(e => !e.dead);
  const prio = foes.filter(e => ['stitch', 'necro', 'master'].includes(e.type));
  const foe = (prio.length ? prio : foes).sort((a, b) => dist(P, a) - dist(P, b))[0];
  const k = combat.keys; k.w = k.a = k.s = k.d = false;
  if (!foe) return;
  const dFoe = dist(P, foe);
  const moveTo = (tx, ty) => { const dx = tx - P.x, dy = ty - P.y;
    k.w = dy < -8; k.s = dy > 8; k.a = dx < -8; k.d = dx > 8; };
  const nearest = foes.sort((a, b) => dist(P, a) - dist(P, b))[0];
  if (CHAR === 'warlock') {
    if (P.devilT > 0) { combat.doSlash(); }
    else {
      moveTo(foe.x, foe.y);
      if (prio.length && P.parryCD <= 0 && dFoe > 160 && foes.length > 1) combat.doParry();
      if (P.hexCD <= 0 && (nearest === foe || dFoe < 70)) combat.doSlash();
      const demonsUp = combat.demons.filter(d => d.hp > 0).length;
      if (!P.channel && demonsUp === 0 && P.heavyCD <= 0) {
        if (dist(P, nearest) < 230 && P.rollCD <= 0) combat.doRoll();
        combat.doHeavy();
      }
      if (P.channel) { const want = combat.lvl() >= 8 ? 6.2 : (combat.lvl() >= 3 ? 4.2 : 3.2);
        if (P.channel.t >= want) combat.heavyRelease(); }
      if (P.hp / combat.maxHP() < 0.35 && P.rollCD <= 0 && dist(P, nearest) < 80) combat.doRoll();
    }
  } else if (CHAR === 'druid') {
    const tooClose = dFoe < 90, tooFar = dFoe > 165;
    if (tooClose) moveTo(P.x + (P.x - foe.x), P.y + (P.y - foe.y));
    else if (tooFar) moveTo(foe.x, foe.y);
    if (P.form === 'human') {
      combat.doSlash();
      if (foes.some(e => dist(P, e) < 160) && P.cdVines <= 0) combat.doHeavy();
      if (combat.lvl() >= 6 && P.hp / combat.maxHP() < 0.5 && P.humanCD <= 0) { combat.doParry(); combat.doParry(); }
    } else if (P.form === 'wolf') {
      if (P.cdHowl <= 0) combat.doHeavy();
      combat.doSlash();
    } else {
      if (dFoe < 130 && P.cdRoar <= 0) combat.doHeavy();
      if (dFoe < 95) combat.doSlash(); else combat.doParry();
    }
    if (foe.attacking && foe.tele < 0.15 && dFoe < 100 && P.rollCD <= 0) combat.doRoll();
  } else { // ronin: flank bot
    moveTo(foe.x - Math.cos(foe.face) * 55, foe.y - Math.sin(foe.face) * 55);
    if (foe.attacking && foe.tele > 0 && dFoe < 140) combat.doParry();
    if (dFoe < 95) { if (P.heavyCD <= 0 && Math.random() < 0.25) combat.doHeavy(); else combat.doSlash(); }
    if (P.hp / combat.maxHP() < 0.3 && dFoe < 90 && P.rollCD <= 0) combat.doRoll();
  }
}
function runFrames(until) {
  while (simMs < until) {
    simMs += 1000 / 60;
    for (let i = tq.length - 1; i >= 0; i--) if (tq[i].at <= simMs) { const f = tq[i].fn; tq.splice(i, 1); f(); }
    if (S.mode === 'fight') {
      if (!HONEST && P.hp < combat.maxHP() * (S.fight >= 12 ? 0.85 : 0.45)) P.hp = combat.maxHP();
      botFrame();
    }
    combat.frame(simMs);
    if (S.mode !== 'fight') return;
  }
}

// ============ ACT I — THE PIT ============
log('\n══════════ ACT I — THE PIT OF KARRIDGE ══════════');
log(`Character: THE ${CHAR.toUpperCase()} · mode: ${HONEST ? 'honest (no help)' : 'assisted (demo-style keep-alive)'}\n`);
combat.fullReset(CHAR);
let fightStart;
while (S.mode === 'board' || S.mode === 'fight') {
  if (S.mode === 'board') {
    const f = combat.FIGHTS[S.fight];
    log(`FIGHT ${S.fight + 1}/20 — ${f.name}   (record: ${f.rec})`);
    say('Bellow', f.taunt.replace(/^"|"$/g, ''));
    fightStart = simMs;
    combat.startFight();
  }
  runFrames(simMs + 1000 * 60 * 6);
  if (S.mode === 'board') {
    const last = banners.filter(b => b[0] && b[1]).slice(-3).map(b => b[0]).join(', ');
    log(`  ▸ won in ${((simMs - fightStart) / 1000).toFixed(1)}s · kills ${P.kills} · LV ${combat.lvl()} · ${combat.diceN()}d8 · crowd: ${combat.nickname}${last ? ' · [' + last + ']' : ''}\n`);
  }
  if (S.mode === 'death') { log('\n  ✝ DEAD at fight ' + (S.fight + 1) + '. The sand takes another.'); process.exit(1); }
  if (S.mode === 'victory') break;
  if (simMs > 1000 * 60 * 60) { log('timeout'); process.exit(1); }
}
const purse = { copper: P.kills * Money.PIT_PAYOUT_PER_KILL };
log(`★ VICTORY — ${P.kills} kills · the crowd names you ${combat.nickname}`);
log(`★ Bellow pays out ${Money.fmt(purse.copper)} (1s per kill). You walk out of the Pit.\n`);

// ============ ACT II — KARRIDGE CITY ============
log('══════════ ACT II — KARRIDGE CITY ══════════');
const flags = {}; const beltItems = []; const artifacts = []; const counts = {};
flags['q-mq1-empty-cell'] = 'active';
log('▸ Journal: THE EMPTY CELL — ' + Quests.main[0].objective);
log('▸ You walk the torchlit streets. An NPC mutters: "Don\'t stare. That\'s ' + combat.nickname + '."');
log('\n— THE LAST LANTERN (inn) —');
say(Quests.innkeeper.name, Quests.innkeeper.greet.replace('{N}', combat.nickname));
say('YOU', 'Ask about the last champion');
say(Quests.innkeeper.name, Quests.innkeeper.rumorFree);
flags['q-mq1-empty-cell'] = 'done';
say('YOU', 'Where did the rest of him go, then?');
say(Quests.innkeeper.name, Quests.innkeeper.rumorPaidOffer);
if (purse.copper >= 50) {
  purse.copper -= 50; flags['q-mq2-listening-room'] = 'active';
  log('  [you pay 5 silver — purse: ' + Money.fmt(purse.copper) + ']');
  say(Quests.innkeeper.name, Quests.innkeeper.rumorPaid);
  log('▸ Journal: THE LISTENING ROOM — active');
} else log('  [cannot afford 5 silver!]');
log('\n— ADVENTURERS GUILD —');
log('  The road ledger confirms the missing. Contracts taken: wolves 0/8, hounds 0/6, rot shaman 0/1.');

// ============ ACT III — THORN GROVE ============
log('\n══════════ ACT III — THORN GROVE ══════════');
log('▸ Out the north gate. Glowing flora. The ley-line node runs WRONG.');
const packs = [
  ['WOLVES OF THE EDGE', 'g-wolves', 4, [{ type: 'hound', hp: 66, spd: 200, r: 11, col: '#3a4a3c' }, { type: 'hound', hp: 66, spd: 200, r: 11, col: '#3a4a3c' }, { type: 'hound', hp: 66, spd: 200, r: 11, col: '#3a4a3c' }, { type: 'hound', hp: 66, spd: 200, r: 11, col: '#3a4a3c' }]],
  ['WOLVES OF THE EDGE', 'g-wolves', 4, [{ type: 'hound', hp: 66, spd: 200, r: 11, col: '#3a4a3c' }, { type: 'hound', hp: 66, spd: 200, r: 11, col: '#3a4a3c' }, { type: 'hound', hp: 66, spd: 200, r: 11, col: '#3a4a3c' }, { type: 'hound', hp: 66, spd: 200, r: 11, col: '#3a4a3c' }]],
  ['FERAL PIT HOUNDS', 'g-hounds', 3, [{ type: 'hound', hp: 80, spd: 210, r: 12, col: '#4a4038', dmgScale: 1.15 }, { type: 'hound', hp: 80, spd: 210, r: 12, col: '#4a4038', dmgScale: 1.15 }, { type: 'hound', hp: 80, spd: 210, r: 12, col: '#4a4038', dmgScale: 1.15 }]],
  ['FERAL PIT HOUNDS', 'g-hounds', 3, [{ type: 'hound', hp: 80, spd: 210, r: 12, col: '#4a4038', dmgScale: 1.15 }, { type: 'hound', hp: 80, spd: 210, r: 12, col: '#4a4038', dmgScale: 1.15 }, { type: 'hound', hp: 80, spd: 210, r: 12, col: '#4a4038', dmgScale: 1.15 }]],
  ['THE ROT SHAMAN', 'g-rotshaman', 1, [{ type: 'necro', hp: 180, spd: 100, r: 15, col: '#3c4434', dmgScale: 1.2 }]],
];
function fieldFight(name, pack) {
  return new Promise(res => {
    const t0 = simMs;
    combat.startEncounter(pack.map(p => Object.assign({ maxhp: p.hp, x: 640 + (Math.random() - .5) * 400, y: 300 + (Math.random() - .5) * 200, dmgScale: 1 }, p)),
      win => res({ win, secs: (simMs - t0) / 1000 }));
    (function loop() {
      if (S.mode !== 'fight') return;
      runFrames(simMs + 100000);
      if (S.mode === 'fight') loop();
    })();
  });
}
(async () => {
  for (const [name, quest, n, pack] of packs) {
    const r = await fieldFight(name, pack);
    counts[quest] = (counts[quest] || 0) + n;
    log(`⚔ ${name} — ${r.win ? 'cleared' : 'LOST'} in ${r.secs.toFixed(1)}s · kills ${P.kills} · LV ${combat.lvl()} · crowd: ${combat.nickname}`);
    if (!r.win) process.exit(1);
  }
  log(`▸ Contract tallies: wolves ${counts['g-wolves']}/8 · hounds ${counts['g-hounds']}/6 · shaman ${counts['g-rotshaman']}/1`);
  log('▸ Hidden chest by the south brush: COALHEART (+10% max HP).');
  artifacts.push('coalheart');

  // ============ ACT IV — THE ROOT-HOLLOW ============
  log('\n══════════ ACT IV — THE ROOT-HOLLOW (dungeon) ══════════');
  combat.setMods({ maxhp: artifacts.includes('coalheart') ? 1.1 : 1 });
  log('  [Coalheart equipped — max HP now ' + combat.maxHP() + ']');
  const amb1 = await fieldFight('THE HOLLOW STIRS', [
    { type: 'skel', hp: 60, spd: 125, r: 11, col: '#b8b0a0' }, { type: 'skel', hp: 60, spd: 125, r: 11, col: '#b8b0a0' },
    { type: 'skel', hp: 60, spd: 125, r: 11, col: '#b8b0a0' }, { type: 'hound', hp: 70, spd: 200, r: 11, col: '#2a3a30' }]);
  log(`⚔ THE HOLLOW STIRS — ${amb1.win ? 'cleared' : 'LOST'} in ${amb1.secs.toFixed(1)}s`);
  const amb2 = await fieldFight('THE HOLLOW\'S KEEPER', [
    { type: 'brute', hp: 220, spd: 72, r: 21, col: '#3a4a44', dmgScale: 1.3 },
    { type: 'skel', hp: 60, spd: 125, r: 11, col: '#b8b0a0' }, { type: 'skel', hp: 60, spd: 125, r: 11, col: '#b8b0a0' }]);
  log(`⚔ THE HOLLOW'S KEEPER — ${amb2.win ? 'cleared' : 'LOST'} in ${amb2.secs.toFixed(1)}s`);
  if (!amb1.win || !amb2.win) process.exit(1);
  artifacts.push('ley-shard');
  log('▸ The rooted chest opens: LEY-SHARD (+10% ability damage). Artifacts: ' + artifacts.join(', '));

  // ============ ACT IV.5 — BRAKKA ============
  log('\n══════════ ACT IV½ — THE GUILD HALL, AGAIN ══════════');
  say('BRAKKA', Companions.brakka.recruitAsk);
  say('YOU', 'It\'s dead. The hollow is clear.');
  say('BRAKKA', Companions.brakka.recruitYes);
  log('▸ BRAKKA WALKS WITH YOU (♥3). He will fight beside you from here on.');
  const withBrakka = () => combat.addAlly({ humanLook: Companions.brakka.look.o, col: Companions.brakka.look.col, nameTag: 'BRAKKA', hp: 60 + P.kills * 4, maxhp: 60 + P.kills * 4 });

  // ============ ACT V — TURN-IN ============
  log('\n══════════ ACT V — BACK TO KARRIDGE ══════════');
  for (const q of Quests.guildBoard) {
    if ((counts[q.id] || 0) >= q.need) { purse.copper += q.copper; beltItems.push(q.potionLabel);
      log(`✓ ${q.title} paid: ${Money.fmt(q.copper)} + ${q.potionLabel}`); }
  }
  // ============ ACT VI — THE ANKUSPAWN CONSPIRACY ============
  log('\n══════════ ACT VI — THE CONSPIRACY (beats 3-5) ══════════');
  log('▸ West past the node: ' + Quests.cult.campSign);
  combat.setMods({ dmg: 1.1, maxhp: 1.1 }); // both artifacts now
  setTimeout(withBrakka, 100); // he steps into the clearing with you
  const camp = await fieldFight('THE WAYSTATION WAKES', [
    { type: 'hook', hp: 110, spd: 150, r: 14, col: '#4a3c5a', dmgScale: 1.2 },
    { type: 'hook', hp: 110, spd: 150, r: 14, col: '#4a3c5a', dmgScale: 1.2 },
    { type: 'grave', hp: 240, spd: 105, r: 16, col: '#3a3450', stance: 'open', stanceT: 1, dmgScale: 1.25 },
    { type: 'stitch', hp: 160, spd: 125, r: 13, col: '#5a4a66', dmgScale: 1.2 }]);
  log(`⚔ THE WAYSTATION WAKES — ${camp.win ? 'cleared' : 'LOST'} in ${camp.secs.toFixed(1)}s · kills ${P.kills}`);
  if (!camp.win) process.exit(1);
  say(Quests.cult.captive.name, Quests.cult.captive.freed);
  say(Quests.cult.shenSama.name, Quests.cult.shenSama.text);
  log('▸ Journal: ROOTS THAT ROT → THE BUYER');
  say('THE VEILED WOMAN', Quests.cult.buyer.text2);
  log('  [choice: keep the vial — evidence]');
  setTimeout(withBrakka, 100);
  const caravan = await fieldFight('ASH AND SILENCE', [
    { type: 'door', r: 26, hp: 320, maxhp: 320, spd: 52, col: '#3a3450', wpn: '#2a2438', dmgScale: 1.3 },
    { type: 'hook', hp: 120, spd: 150, r: 14, col: '#4a3c5a', dmgScale: 1.25 },
    { type: 'hook', hp: 120, spd: 150, r: 14, col: '#4a3c5a', dmgScale: 1.25 },
    { type: 'grave', hp: 260, spd: 105, r: 16, col: '#3a3450', stance: 'open', stanceT: 1, dmgScale: 1.3 },
    { type: 'stitch', hp: 180, spd: 125, r: 13, col: '#5a4a66', dmgScale: 1.25 }]);
  log(`⚔ ASH AND SILENCE (night shipment) — ${caravan.win ? 'cleared' : 'LOST'} in ${caravan.secs.toFixed(1)}s · kills ${P.kills}`);
  if (!caravan.win) process.exit(1);
  log('▸ Three captives freed. The camp erased behind you.');
  say('ANKUNYX', Quests.cult.finale.text2);
  log('▸ ' + Quests.cult.finale.text3);
  log('▸ Journal: ASH AND SILENCE ✓ — the conspiracy holds. The campaigns continue it.');

  log('\n══════════ CHECKPOINT REACHED ══════════');
  log(`THE ${CHAR.toUpperCase()} "${combat.nickname}" — LV ${combat.lvl()} · ${combat.diceN()}d8 · ${P.kills} kills`);
  log(`Purse: ${Money.fmt(purse.copper)} · Belt: ${beltItems.join(', ') || 'empty'} · Artifacts: ${artifacts.join(', ')}`);
  log(`Journal: EMPTY CELL ✓ · LISTENING ROOM ✓ · ROOTS THAT ROT ✓ · THE BUYER ✓ · ASH AND SILENCE ✓ — the conspiracy holds; the campaigns inherit it`);
  log(`Total played: ${(simMs / 60000).toFixed(1)} sim-minutes`);
})();
