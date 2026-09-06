// Auto on self skills, conscript joining the company, quest-only risen
// strength, NPC hero HP floor, and once-per-battle NPC smite.
'use strict';
const { load, memBackend } = require('./harness');
const ADV = load();

let pass = 0, fail = 0;
function ok(c, n, x) { if (c) { pass++; console.log('  ok  ' + n); } else { fail++; console.log('FAIL  ' + n, x !== undefined ? '[' + x + ']' : ''); } }
function eq(a, b, n) { ok(a === b, n, a + ' != ' + b); }

const mk = (o) => ADV.Character.base(Object.assign({ stats: { hp: 200, atk: 12, def: 4, spd: 10 } }, o));
function give(ch, id, level) {
  const sk = ADV.DATA.SKILLS[id];
  (sk.kind === 'perk' ? ch.perks : ch.actives).push({ skillId: id, level: level || 1, uses: 0 });
}
function fight(a, b, seed) {
  for (const c of [].concat(a, b)) c.combatHp = null;
  return ADV.Combat.create([].concat(a), [].concat(b), { rng: new ADV.RNG(seed || 1) });
}
function unit(st, ch) { return st.units.find(u => u.ch === ch); }
function newGame(seed, skills) {
  ADV.Save.setBackend(memBackend());
  return ADV.Game.newGame({ seed: seed || 11, name: 'Pat', sex: 'm', portraitSlot: 1, portraitSeed: 1, startingSkills: skills || ['cleave', 'mend', 'smoke_bomb'] });
}

console.log('\n-- Auto: self skills and rotation --');
{
  const ch = mk({ name: 'Rogue' });
  give(ch, 'smoke_bomb', 1);
  ok(ADV.Combat.skillNeedsAuto(ch, 'smoke_bomb', false), 'Smoke Bomb can be set to auto');
  ok(!ADV.Combat.skillNeedsAuto(ch, 'beast_shape', false), 'Beast Shape stays off auto (free buff)');
  ok(!ADV.Combat.skillNeedsAuto(ch, 'conscript', false), 'Conscript stays off auto (post-victory)');
  ADV.Combat.setSkillAuto(ch, 'smoke_bomb', true, false);
  ok(ADV.Combat.skillAutoOn(ch, 'smoke_bomb', false), 'Smoke Bomb joins the rotation');
}

console.log('\n-- Conscript: joins roster, travel, and party list --');
{
  const g = newGame(21, ['cleave', 'mend', 'conscript']);
  const p = ADV.Game.player(g);
  const foe = ADV.World.adults(g.world).find(c => !c.isPlayer && c.status === 'normal');
  ok(!!foe, 'a guild NPC exists to conscript');
  if (foe) {
    const r = ADV.Game.resolveDefeatedNamed(g, foe, 'conscript');
    ok(!r.error, 'conscript resolve succeeds');
    ok(foe.isConscript && (p.conscriptIds || []).indexOf(foe.id) >= 0, 'NPC is bound to the player');
    const roster = ADV.Game.partyRoster(g);
    ok(roster.some(c => c.id === foe.id), 'conscript walks in travel / battle roster');
    const bound = ADV.Party.followers(g.world, p);
    ok(bound.some(c => c.id === foe.id), 'conscript appears as a bound follower in the party menu');
  }
}

console.log('\n-- Necromancy: stronger risen, gone at quest end --');
{
  const g = newGame(22, ['cleave', 'mend', 'necromancy']);
  const p = ADV.Game.player(g);
  give(p, 'necromancy', 25);
  const src = ADV.Character.makeEnemy(g.rng, 'dire_wolf', { level: 8 });
  const basic = ADV.Game.makeQuestThrall(src, mk({}));
  const caster = mk({ name: 'Necro' });
  give(caster, 'necromancy', 25);
  const adv = ADV.Game.makeQuestThrall(src, caster);
  ok(adv.risenPower > (basic.risenPower || 1.5), 'advanced risen are stronger than a basic raise');
  ok(ADV.Character.maxHp(adv) > ADV.Character.maxHp(basic), 'advanced risen have more HP');
  g.quest = { thralls: [adv], quest: { encounters: [] }, encIdx: 0 };
  ADV.Game.releaseQuestThralls(g);
  ok(!(g.quest.thralls || []).length, 'thralls are gone when the contract ends');
  ok(adv.alive === false, 'a monster thrall does not walk to the next quest');
}

{
  const g = newGame(23, ['cleave', 'mend', 'necromancy']);
  const p = ADV.Game.player(g);
  const foe = ADV.World.adults(g.world).find(c => !c.isPlayer && c.status === 'normal');
  g.quest = { thralls: [], quest: { encounters: [{}, {}] }, encIdx: 0 };
  ADV.Game.resolveDefeatedNamed(g, foe, 'necromancy');
  ok(foe.isUndead && foe.isQuestThrall, 'a named raise is a quest thrall');
  eq(foe.undeadQuestsLeft, 0, 'named risen do not carry a multi-quest timer');
  ok((g.quest.thralls || []).indexOf(foe) >= 0, 'named risen stay for the rest of this contract');
}

console.log('\n-- NPC hero/villain floor and smite --');
{
  const player = mk({ name: 'You', isPlayer: true, stats: { hp: 160, atk: 12, def: 8, spd: 10 } });
  const hero = mk({ name: 'Champion', status: 'hero', heroPowerMult: 1, grantsHeld: true, stats: { hp: 40, atk: 10, def: 4, spd: 8 } });
  const dummy = mk({ name: 'Mook', stats: { hp: 80, atk: 4, def: 0, spd: 6 } });
  const st = fight(player, [hero, dummy], 7);
  const uh = unit(st, hero);
  ok(uh.maxHp >= unit(st, player).maxHp, 'NPC hero HP is at least the player\'s');
  ok(unit(st, player).maxHp === ADV.Character.effStat(player, 'hp'), 'the player is not raised to a hero floor');
}

{
  const player = mk({ name: 'You', isPlayer: true, stats: { hp: 200, atk: 8, def: 8, spd: 10 } });
  const villain = mk({ name: 'Villain', status: 'villain', heroPowerMult: 1, stats: { hp: 180, atk: 14, def: 6, spd: 12 } });
  const fat = mk({ name: 'Fat', stats: { hp: 300, atk: 4, def: 0, spd: 4 } });
  const thin = mk({ name: 'Thin', stats: { hp: 80, atk: 4, def: 0, spd: 4 } });
  const st = fight([player, villain], [fat, thin], 8);
  const uv = unit(st, villain);
  const uf = unit(st, fat);
  const before = uf.chp;
  ok(ADV.Combat.tryNpcSmite(st, uv), 'villain smites once');
  ok(uf.chp <= Math.ceil(before * 0.1) + 1, 'highest-HP foe is cut to about 10%');
  ok(unit(st, thin).chp === unit(st, thin).maxHp, 'the weaker foe is not the smite target');
  ok(!ADV.Combat.tryNpcSmite(st, uv), 'smite is once per battle');
  ok(!ADV.Combat.tryNpcSmite(st, unit(st, player)), 'the player never gets the NPC smite');
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail) process.exit(1);
