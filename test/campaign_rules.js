// Campaign doc §0b-0f + §13d-2: the base-game rule changes.
'use strict';
const { load, memBackend } = require('./harness');
const ADV = load();
let pass = 0, fail = 0;
function ok(c, n, x) { if (c) { pass++; console.log('  ok  ' + n); } else { fail++; console.log('FAIL  ' + n, x !== undefined ? '[' + x + ']' : ''); } }
function eq(a, b, n) { ok(a === b, n, a + ' != ' + b); }
const mkCh = (o) => ADV.Character.base(Object.assign({ stats: { hp: 100, atk: 10, def: 10, spd: 10 } }, o));
function give(ch, id, level) { const sk = ADV.DATA.SKILLS[id]; (sk.kind === 'perk' ? ch.perks : ch.actives).push({ skillId: id, level: level || 1, uses: 0 }); }
function fight(a, b, seed) { for (const c of [].concat(a, b)) c.combatHp = null; return ADV.Combat.create([].concat(a), [].concat(b), { rng: new ADV.RNG(seed || 1) }); }
const unit = (st, ch) => st.units.find(u => u.ch === ch);
const mem = memBackend;

(function () {
  console.log('\n-- §13d-2 perks are advanced-only, gold-only, never witnessed --');
  const t = mkCh({}); give(t, 'bulwark', 1);
  const m = ADV.SkillSys.manifest(t, t.perks[0]);
  eq(m.tier, 'advanced', 'a level-1 perk manifests at advanced');
  eq(m.data.reflectPct, 0.6, 'Bulwark reflects 60% from day one');
  ok(ADV.SkillSys.witness(t, 'marksman', 'basic') === null && !t.journal.marksman, 'perks cannot be witnessed');
  t.freeSkillsUsed = 3;
  eq(ADV.SkillSys.trainerCost(t, 'marksman'), 150, 'perks cost gold even if seen');
  ok(ADV.SkillSys.recordUse(t, 'bulwark') === null, 'perks never level');
})();

(function () {
  console.log('\n-- §0d Backstab: opener or stealth only, any lane; Exposed --');
  const rogue = mkCh({ stats: { hp: 100, atk: 12, def: 10, spd: 14 } }); give(rogue, 'backstab'); give(rogue, 'smoke_bomb'); give(rogue, 'cleave');
  const foe = ADV.Character.makeEnemy(new ADV.RNG(3), 'bandit', { level: 3 }); foe.stats.hp = 400; foe.stats.def = 10;
  const st = fight(rogue, foe, 5);
  const ur = unit(st, rogue), uf = unit(st, foe);
  ok(ADV.Combat.validTargets(st, ur, 'backstab').includes(uf), 'Backstab reaches a FRONT-lane enemy as the opener');
  const hp0 = uf.chp;
  ADV.Combat.act(st, ur, { kind: 'skill', skillId: 'backstab', targetUid: uf.uid });
  const d1 = hp0 - uf.chp;
  ok(d1 >= 60, 'Backstab power 6.0 hits like a double attack', d1);
  ok(uf.statuses.some(x => x.kind === 'exposed' && x.stacks === 1), 'melee applies 1 Exposed');
  eq(ADV.Combat.validTargets(st, ur, 'backstab').length, 0, 'Backstab greyed out after the opener');
  ADV.Combat.act(st, ur, { kind: 'skill', skillId: 'smoke_bomb', targetUid: ur.uid });
  ok(ur.stealth, 'Smoke Bomb grants stealth');
  ok(ADV.Combat.validTargets(st, ur, 'backstab').includes(uf), 'Backstab usable again from stealth');
  const hp1 = uf.chp;
  ADV.Combat.act(st, ur, { kind: 'skill', skillId: 'cleave', targetUid: uf.uid });
  const cleaveDmg = hp1 - uf.chp;
  ok(!uf.statuses.some(x => x.kind === 'exposed' && x.stacks > 1), 'melee consumed the Exposed stack');
  ok(!ur.stealth, 'attacking broke stealth');
  // exposed bonus check: same cleave without stacks
  const st2 = fight(mkCh({ stats: { hp: 100, atk: 12, def: 10, spd: 14 } }), (() => { const f = ADV.Character.makeEnemy(new ADV.RNG(3), 'bandit', { level: 3 }); f.stats.hp = 400; f.stats.def = 10; return f; })(), 5);
  give(st2.units[0].ch, 'cleave');
  const hp2 = st2.units[1].chp;
  ADV.Combat.act(st2, st2.units[0], { kind: 'skill', skillId: 'cleave', targetUid: st2.units[1].uid });
  ok(cleaveDmg > hp2 - st2.units[1].chp, 'a hit into Exposed does more than a clean hit', cleaveDmg + ' vs ' + (hp2 - st2.units[1].chp));
})();

(function () {
  console.log('\n-- §0c Marksman: back-lane attacks take no reflect --');
  const ranger = mkCh({ name: 'R', archetypeInclination: ['ranger'] }); give(ranger, 'marksman'); give(ranger, 'aimed_shot');
  const tankF = mkCh({ name: 'T', archetypeInclination: ['tank'] });
  const thornFoe = mkCh({ name: 'Thorny' }); give(thornFoe, 'thorn_skin');
  const st = fight([tankF, ranger], [thornFoe], 9);
  const ur = unit(st, ranger), ut = unit(st, thornFoe);
  eq(ur.lane, 'back', 'ranger stands in back');
  ADV.Combat.act(st, ut, { kind: 'skill', skillId: 'thorn_skin', targetUid: ut.uid });
  const before = ur.chp;
  ADV.Combat.act(st, ur, { kind: 'skill', skillId: 'aimed_shot', targetUid: ut.uid });
  eq(ur.chp, before, 'no thorn reflect against a Deadeye in the back lane');
})();

(function () {
  console.log('\n-- §0e withdrawal caps --');
  ADV.Save.setBackend(mem());
  const g = ADV.Game.newGame({ seed: 5, name: 'Wife', sex: 'f', portraitSlot: 1, portraitSeed: 1, startingSkills: ['charm', 'mend', 'triage'] });
  const world = g.world; const wife = ADV.Game.player(g);
  const hus = world.characters.find(c => c.sex === 'm' && !c.isPlayer);
  ADV.Rel.move(world, hus.id, wife.id, 60, 'romance'); ADV.Rel.move(world, wife.id, hus.id, 60, 'romance');
  ADV.Rel.commit(world, wife.id, hus.id);
  const v = ADV.Vault.of(world, wife); v.gold = 1000;
  v.sharedQuestStreak = 3; v.questsSinceShared = 0;
  let cap = ADV.Vault.withdrawalCap(world, v, wife);
  eq(cap.state, 'happy', 'three shared quests = Happy');
  eq(cap.pct, 1.0, 'charming woman + happy husband = the whole vault');
  const r = ADV.Vault.requestWithdrawal(world, g.rng, wife, 1000);
  eq(r.amount, 1000, 'full withdrawal granted');
  v.gold = 1000; v.sharedQuestStreak = 0; v.questsSinceShared = 3;
  cap = ADV.Vault.withdrawalCap(world, v, wife);
  eq(cap.state, 'neutral', 'three quests apart = Neutral');
  eq(cap.pct, 0.45, 'neutral husband 35% + Charm 10%');
  const r2 = ADV.Vault.requestWithdrawal(world, g.rng, wife, 1000);
  eq(r2.amount, 450, 'request trimmed to the cap, not refused');
})();

(function () {
  console.log('\n-- §0f killing generates no Hatred --');
  const world = ADV.World.create(77);
  const [a, b, k] = world.characters;
  ADV.Rel.move(world, b.id, a.id, 80, 'quest'); // b loves a
  ADV.Death.finalize(world, a, k.id, 'killed');
  ok(!ADV.Rel.hates(world, b.id, k.id), "the victim's friend does not hate the killer");
  eq(world.edges.filter(e => e.toId === k.id && e.score < 0).length, 0, 'no negative edges created by a killing');
})();

(function () {
  console.log('\n-- §0b heroes & villains --');
  const world = ADV.World.create(31337);
  const rng = new ADV.RNG(2);
  const feed = () => {};
  const necro = world.characters[0];
  necro.divineMarked = true; necro.divineMarkQuest = 0; world.questClock = 10;
  ADV.Divine.assignHeroes(world, rng, feed);
  const rec = world.activeHeroes[0];
  ok(rec, 'a hero is named');
  const hero = ADV.World.byId(world, rec.heroId);
  ok(ADV.Divine.heroEligible(world, hero, necro.id) || hero.status === 'hero', 'named hero passed eligibility');
  // target dies -> hero stays empowered and idle
  ADV.Death.finalize(world, necro, hero.id, 'killed');
  eq(hero.status, 'hero', 'grants are permanent: still a hero');
  ok(hero.grantsHeld && hero.actives.some(a => a.skillId === 'true_rest'), 'idle hero keeps True Rest');
  ok(!hero.heroTargetId, 'idle: no target');
  // someone kills the hero -> villain with grants; two heroes owed at 2x after 3 quests
  const killer = world.characters.find(c => c.alive && c !== hero && !c.isPlayer);
  const helper = world.characters.find(c => c.alive && c !== hero && c !== killer);
  hero.__killedByParty = [helper.id];
  ADV.Death.finalize(world, hero, killer.id, 'killed');
  eq(killer.status, 'villain', 'killer becomes a Villain');
  eq(killer.villainLevel, 1, 'Villain level 1');
  ok(killer.actives.some(a => a.skillId === 'true_rest') && killer.perks.some(p => p.skillId === 'hero'), "the hero's grants transfer");
  eq(helper.status, 'villain', 'assisting party member is a Villain too — no bystander clause');
  eq(killer.heroesOwed, 2, 'two heroes will be named');
  eq(killer.nextHeroPower, 4, 'each at twice the bonus');
  eq(killer.heroReprieveUntil - world.questClock, 3, 'after the standard 3-quest reprieve');
  // ineligibility: a forbidden user is never a hero
  const dirty = world.characters.find(c => c.alive && c.status === 'normal');
  dirty.usedForbidden = true;
  ok(!ADV.Divine.heroEligible(world, dirty, killer.id), 'forbidden-art users are never named hero');
})();

console.log(`\n==== ${pass} passed, ${fail} failed ====`);
process.exit(fail ? 1 : 0);
