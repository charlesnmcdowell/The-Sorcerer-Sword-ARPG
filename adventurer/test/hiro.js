// Hiro as an NPC (request): arrival, the party with one open seat, slow warmth,
// the reputation-15 rule, his lines.
'use strict';
const { load, memBackend } = require('./harness');
const ADV = load();
let pass = 0, fail = 0;
function ok(c, n, x) { if (c) { pass++; console.log('  ok  ' + n); } else { fail++; console.log('FAIL  ' + n, x !== undefined ? '[' + x + ']' : ''); } }
function eq(a, b, n) { ok(a === b, n, a + ' != ' + b); }
const C = ADV.DATA.CONST;
const mem = memBackend;
function newGame(seed, sex, opts) { ADV.Save.setBackend(mem()); return ADV.Game.newGame(Object.assign({ seed, name: 'T', sex: sex || 'f', portraitSlot: 1, portraitSeed: 1, startingSkills: ['bulwark', 'cleave', 'mend'] }, opts || {})); }
function contract(game) {
  const q = ADV.Quests.make(game.rng, 1, 'solo', 'neutral');
  q.encounters = [{ enemyTypeIds: ['bandit'], boss: false }];
  const p = ADV.Game.player(game); p.stats = { hp: 900, atk: 40, def: 30, spd: 20 };
  ADV.Game.startQuest(game, q, {});
  while (!game.quest.readyToComplete && !game.quest.over) {
    ADV.Game.currentEncounter(game); const st = ADV.Game.startCombat(game, false);
    let n = 0; while (!st.over && n++ < 500) { const t = ADV.Combat.currentTurn(st); if (!t) break; if (t.unit.ch.isPlayer) { const bv = ADV.Combat.validTargets(st, t.unit, 'basic_attack'); ADV.Combat.act(st, t.unit, bv.length ? { kind: 'attack', targetUid: bv[0].uid } : { kind: 'defend' }); } else ADV.Combat.aiTakeTurn(st, t.unit); ADV.Combat.advance(st); }
    ADV.Game.finishCombat(game);
  }
  ADV.Game.completeQuest(game);
}

(function () {
  console.log('\n-- arrival --');
  const g = newGame(5, 'f'); const world = g.world;
  contract(g);
  ok(!world.hiroId, 'not after one contract');
  contract(g);
  const h = ADV.Hiro.npc(world);
  ok(h && h.alive && h.hiroNpc && h.registryId === 'hiro', 'Hiro arrives after the second contract');
  eq(h.personalityId, 'HIRO', 'his own voice');
  ok(h.inventory.gold <= 1000 && h.inventory.gold >= 1000 - 3 * 45 * 2, 'started with 1000g (wages already offered from it)');
  ok(world.metIds.includes(h.id), 'on the roster');
  const party = ADV.Party.of(world, h);
  ok(party && party.leaderId === h.id && party.reserveForPlayer, 'he leads a party');
  eq(ADV.Party.roster(world, party).length, C.PARTY_MAX - 1, 'hired up to one open seat');
  for (let i = 0; i < 8; i++) ADV.World.tick(world, g.rng, {});
  ok(ADV.Party.roster(world, party).length <= C.PARTY_MAX - 1, 'the seat stays open on the clock');
  ok(ADV.Party.applicationOdds(world, party, ADV.Game.player(g)).odds > 0, 'the player can apply');
  // not when Hiro is being played
  ADV.Save.setBackend(mem());
  const gh = ADV.Game.newGame({ seed: 6, name: 'Hiro', sex: 'm', portraitSlot: 1, portraitSeed: 1, startingSkills: [], password: 'hiro' });
  contract(gh); contract(gh); contract(gh);
  ok(!gh.world.hiroId, 'no NPC Hiro while Hiro is the player');
  // never drawn as a random personality
  ok(!world.characters.some(c => !c.hiroNpc && c.personalityId === 'HIRO'), 'his lines are his alone');
})();

(function () {
  console.log('\n-- death: he gets back up and founds a new party --');
  const g = newGame(8, 'f'); const world = g.world;
  contract(g); contract(g);
  const h = ADV.Hiro.npc(world);
  const oldParty = ADV.Party.of(world, h);
  const oldId = oldParty.id;
  const hires = ADV.Party.members(world, oldParty).slice();
  ADV.Death.finalize(world, h, null, 'killed');
  ok(h.alive && !h.obituary, 'he does not stay dead');
  eq(world.hiroId, h.id, 'same Hiro, not a second one');
  eq(world.characters.filter(c => c.hiroNpc).length, 1, 'only one Hiro on the roster');
  ok(!ADV.Death.graves(world).some(c => c.id === h.id), 'he is not in the graveyard');
  const party = ADV.Party.of(world, h);
  ok(party && party.leaderId === h.id && party.id !== oldId, 'he leads a new party');
  ok(party.reserveForPlayer, 'the open seat is still reserved');
  ok(ADV.Party.roster(world, party).length >= 1 && ADV.Party.roster(world, party).length <= C.PARTY_MAX - 1, 'new company leaves a seat open');
  ok(!world.parties.some(p => p.id === oldId), 'the old company is gone');
  ok(hires.every(c => !c.partyId || c.partyId === party.id), 'old hires were released or rehired');
  ok(h.inventory.gold >= ADV.Hiro.RULES.gold, 'he has gold enough to hire again');
  ok(world.eventFeed.some(e => e.actorIds && e.actorIds.includes(h.id) && /new company/.test(e.text)), 'the town hears he got back up');
  ADV.Game.wipeParty(world, party, ADV.Game.player(g).id);
  const again = ADV.Hiro.npc(world);
  ok(again && again.alive && again.id === h.id, 'a rival wipe still cannot keep him down');
  const rebuilt = ADV.Party.of(world, again);
  ok(rebuilt && rebuilt.leaderId === again.id && rebuilt.reserveForPlayer, 'and he founds another company');
  ADV.Hiro.maybeArrive(world, g.rng, () => {});
  eq(world.characters.filter(c => c.hiroNpc).length, 1, 'arrival does not spawn a second Hiro');
})();

(function () {
  console.log('\n-- slow warmth, the two-quest rule, reputation 15 --');
  const g = newGame(7, 'f'); const world = g.world; const me = ADV.Game.player(g);
  contract(g); contract(g);
  const h = ADV.Hiro.npc(world);
  const other = world.characters.find(c => c.alive && !c.isPlayer && !c.hiroNpc && c.sex === 'm');
  ok(ADV.Rel.socialRate(world, h, me) <= ADV.Rel.socialRate(world, other, me) / 2.9, 'a third of the usual warmth rate');
  ADV.Courtship.recordShared(world, [h.id, me.id]);
  ok(ADV.Rel.score(world, h.id, me.id) < C.REL.FRIENDLY_MIN, 'one shared quest: still Neutral');
  ADV.Courtship.recordShared(world, [h.id, me.id]);
  ok(ADV.Rel.score(world, h.id, me.id) >= C.REL.FRIENDLY_MIN, 'two shared quests: Friendly');
  ADV.Courtship.recordShared(world, [h.id, me.id]);
  ok(!ADV.Courtship.wouldAsk(world, h, me), 'he never asks');
  me.reputation = 10;
  ok(!ADV.Hiro.acceptsProposal(me), 'reputation 10: refused');
  me.reputation = 15;
  ok(ADV.Hiro.acceptsProposal(me), 'reputation 15: accepted');
  // NPC women asking the rich man: only reputation 15+ get through
  const w = world.characters.find(c => c.alive && !c.isPlayer && c.sex === 'f' && !c.hiroNpc);
  for (const id of ADV.Rel.partnerIds(w).slice()) {
    const o = ADV.World.byId(world, id);
    ADV.Rel.removePartner(w, id);
    if (o) ADV.Rel.removePartner(o, w.id);
  }
  w.reputation = 3; me.inventory.gold = 0;
  ADV.Courtship.tick(world, g.rng, () => {}, false);
  ok(h.partnerId !== w.id, 'a low-reputation woman is turned down');
  ok(ADV.Courtship.onCooldown(world, w.id, h.id) || h.partnerId, 'and cools for three quests');
})();

(function () {
  console.log('\n-- lines --');
  const L = ADV.DATA.DIALOGUE.HIRO;
  eq(L.general.length + L.friendly.length + L.hatred.length + L.romantic.length, 16, 'sixteen lines');
  const shown = ADV.util.renderLine(L.general[0], { target: 'Sable' });
  eq(shown, 'What it do Sable. Enjoying the game?', 'delivery cues are stripped from the text box');
  ok(/\[tired\]/.test(L.general[0]), 'but kept in the data for the voice');
  const fs = require('fs'); const path = require('path');
  const dir = path.join(__dirname, '..', 'audio', 'vo', 'HIRO');
  ok(fs.existsSync(dir) && fs.readdirSync(dir).filter(f => f.endsWith('.mp3')).length === 16, 'sixteen clips generated');
})();

console.log(`\n==== ${pass} passed, ${fail} failed ====`);
process.exit(fail ? 1 : 0);
