// Hiro as an NPC (request): when the secret character is not being played he
// arrives in town after the player's second contract with 1000g, starts a
// party and hires as much of the roster as he can — leaving exactly one seat
// open. He warms slowly (a third of the usual rate), a woman needs two shared
// quests before he is Friendly, he never asks anyone, and he accepts a
// proposal only from a woman with reputation 15 or better.
(function () {
'use strict';
const C = () => ADV.DATA.CONST;
const Hiro = {};

Hiro.RULES = { arriveAfterQuests: 2, gold: 1000, wage: 40, friendlyAfter: 2, minRep: 15, warmthDivisor: 3 };

Hiro.npc = function (world) { return world.hiroId ? ADV.World.byId(world, world.hiroId) : null; };
Hiro.isHiro = function (ch) { return !!(ch && ch.hiroNpc); };

// Called on the world clock after the player quests.
Hiro.maybeArrive = function (world, rng, feed) {
  if (world.hiroId) return null;
  const p = ADV.World.byId(world, world.playerId);
  if (!p || p.registryId === 'hiro') return null;               // he is being played
  if (p.questsCompleted < Hiro.RULES.arriveAfterQuests) return null;
  const h = ADV.Character.makeRegistry(rng, 'hiro', null, true);
  h.hiroNpc = true; h.inventory.gold = Hiro.RULES.gold; h.reputation = 10; h.rank = 3;
  for (const e of h.perks.concat(h.actives)) { e.level = 25; e.uses = 250; }
  h.personality = { aggression: 45, greed: 30, caution: 55, loyalty: 70, pride: 60 };
  world.characters.push(h);
  world.hiroId = h.id;
  ADV.World.met(world, h.id);
  const party = ADV.Party.create(world, h.id);
  party.employerParty = true; party.reserveForPlayer = true;
  Hiro.fillParty(world, rng, party);
  feed(`A man with purple dreadlocks and a katana walked into town, put ${Hiro.RULES.gold}g on the table, and started hiring. He is keeping one seat open.`, [h.id]);
  return h;
};

// Hire free agents until only one seat is left (leader + PARTY_MAX - 2 hires).
Hiro.fillParty = function (world, rng, party) {
  const want = C().PARTY_MAX - 1;
  const free = () => ADV.World.adults(world).filter(c => !c.isPlayer && !c.registryId && !c.partyId && c.status === 'normal' && !c.isUndead && !c.isConscript && c.hospitalizedQuestsLeft <= 0);
  let guard = 0;
  while (ADV.Party.roster(world, party).length < want && guard++ < 40) {
    const cands = free().filter(c => !ADV.Party.hatredConflict(world, party, c.id)).sort((a, b) => b.reputation - a.reputation);
    if (!cands.length) break;
    const c = cands[guard % cands.length];
    const r = ADV.Party.offerWage(world, rng, party, c, Hiro.RULES.wage);
    if (!r.ok && r.why !== 'declined') break;
  }
};

// The open seat stays open: growth on the clock stops one short.
Hiro.growthCap = function (party) { return party.reserveForPlayer ? C().PARTY_MAX - 1 : C().PARTY_MAX; };

// Would Hiro accept this proposer? (women with reputation 15+ only)
Hiro.acceptsProposal = function (from) { return from.sex === 'f' && (from.reputation || 0) >= Hiro.RULES.minRep; };

ADV.Hiro = Hiro;
})();
