// Encounter-mode test: field fight (re-skinned wolves) via startEncounter,
// callback fires on win; potions and mods behave; pit defaults untouched.
const { createPitCombat } = require('../src/combat/pit.js');
let simMs = 0; const tq = [];
global.setTimeout = (fn, ms) => { tq.push({ at: simMs + (ms || 0), fn }); return tq.length; };
global.clearTimeout = () => {};

const combat = createPitCombat({ width: 1280, height: 720, now: () => simMs, ui: {} });
combat.setPlayerSnapshot({ char: 'ronin', kills: 12, level: 1, bladeTier: 1,
  base: { STR: 10, DEX: 10, CON: 10, ATK: 10 }, nickname: 'THE HEADSMAN' });

// artifact mods smoke: +10% dmg, +10% hp
const hp0 = combat.maxHP();
combat.setMods({ dmg: 1.1, maxhp: 1.1 });
if (combat.maxHP() <= hp0) throw new Error('maxhp mod inert');
combat.setMods({ dmg: 1, maxhp: 1 });
if (combat.maxHP() !== hp0) throw new Error('mods not reversible');

let result = null;
combat.startEncounter([
  { type: 'hound', x: 700, y: 300, hp: 66, maxhp: 66, spd: 200, r: 11, col: '#3a4a3c', dmgScale: 1 },
  { type: 'hound', x: 760, y: 420, hp: 66, maxhp: 66, spd: 200, r: 11, col: '#3a4a3c', dmgScale: 1 },
  { type: 'hound', x: 640, y: 460, hp: 66, maxhp: 66, spd: 200, r: 11, col: '#3a4a3c', dmgScale: 1 },
], win => { result = win; });

if (combat.S.mode !== 'fight') throw new Error('encounter did not start');
const P = combat.P, dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const kills0 = P.kills;
let potionTested = false;
while (simMs < 90 * 1000 && result === null) {
  simMs += 1000 / 60;
  for (let i = tq.length - 1; i >= 0; i--) if (tq[i].at <= simMs) { const f = tq[i].fn; tq.splice(i, 1); f(); }
  const foe = combat.enemies.find(e => !e.dead);
  if (foe) {
    const k = combat.keys, dx = foe.x - P.x, dy = foe.y - P.y;
    k.w = dy < -8; k.s = dy > 8; k.a = dx < -8; k.d = dx > 8;
    if (dist(P, foe) < 90) combat.doSlash();
    if (!potionTested && P.hp < combat.maxHP()) { // belt potion mid-fight
      const st0 = combat.stat('STR');
      if (!combat.usePotion('potion-str')) throw new Error('potion refused');
      if (combat.stat('STR') <= st0) throw new Error('buff inert');
      potionTested = true;
    }
  }
  combat.frame(simMs);
}
if (result !== true) throw new Error('encounter not won: ' + result);
if (P.kills <= kills0) throw new Error('field kills did not feed the snowball');
console.log(`encounter WIN in ${(simMs / 1000).toFixed(1)}s · kills ${kills0}->${P.kills} · potion buff ok · mods ok`);
console.log('ENCOUNTER TEST PASS');
