'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { load } = require('./harness');
const ADV = load();

globalThis.Phaser = {
  Curves: { QuadraticBezier: class { constructor() {} draw() {} } },
  Math: { Vector2: class { constructor(x, y) { this.x = x; this.y = y; } } },
};
vm.runInThisContext(fs.readFileSync(path.join(__dirname, '../js/ui/combat_presentation.js'), 'utf8'), { filename: 'combat_presentation.js' });

let pass = 0, fail = 0;
function ok(c, n, x) { if (c) { pass++; console.log('  ok  ' + n); } else { fail++; console.log('FAIL  ' + n, x !== undefined ? '[' + x + ']' : ''); } }

console.log('\n-- Combat presentation profiles every skill --');
{
  const P = ADV.CombatPresentation;
  ok(!!P && typeof P.profile === 'function', 'presentation module loaded');
  const seen = new Set();
  let melee = 0, magic = 0, heal = 0;
  for (const id of Object.keys(ADV.DATA.SKILLS)) {
    const p = P.profile(id, 'basic');
    ok(!!p && p.id === id && p.family, id + ' has a family');
    seen.add(p.family);
    if (p.melee) melee++;
    if (p.family === 'magic') magic++;
    if (p.family === 'heal') heal++;
  }
  ok(melee > 8, 'several skills are melee swings');
  ok(magic > 4, 'elemental skills use the magic family');
  ok(heal >= 1, 'heals have their own family');
  ok(seen.has('slash') && seen.has('gun'), 'melee and gun families are distinct');
  const fire = P.profile('fire_bolt', 'advanced');
  ok(fire.element === 'fire' && fire.intensity > 1, 'advanced Fire Bolt keeps its element');
  const raise = P.profile('raise', 'basic');
  ok(raise.family === 'heal' && !raise.melee, 'Raise is a heal, not a swing');
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail) process.exit(1);
