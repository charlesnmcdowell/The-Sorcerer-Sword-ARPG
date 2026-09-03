// Courtship rules (request 7/13): who warms to whom, and when someone asks.
//   - men warm to a woman after 1 shared quest and ask after 2 (if both single)
//   - women warm to a man after 2 shared quests — unless he is one of the five
//     wealthiest men in town, in which case every single woman who is not
//     already his enemy is Friendly at once and asks him herself
//   - a decline drops the asker to Neutral for 3 quests, then the rules apply
//     again (a rich man stays a rich man)
//   - Lookism: the opposite sex starts Friendly toward the holder
// Shared-quest counts live on world.sharedQuests; declines on world.cooldowns;
// asks aimed at the player queue on world.pendingProposals for the town.
(function () {
'use strict';
const C = () => ADV.DATA.CONST;
const Rel = () => ADV.Rel;
const Court = {};

Court.key = (a, b) => a < b ? a + '|' + b : b + '|' + a;
Court.shared = function (world, a, b) { return (world.sharedQuests || {})[Court.key(a, b)] || 0; };
Court.recordShared = function (world, ids) {
  world.sharedQuests = world.sharedQuests || {};
  const list = [...new Set(ids)];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const k = Court.key(list[i], list[j]);
    world.sharedQuests[k] = (world.sharedQuests[k] || 0) + 1;
  }
};

Court.cooldown = function (world, fromId, toId, quests) {
  world.cooldowns = world.cooldowns || {};
  world.cooldowns[fromId + '>' + toId] = world.questClock + (quests || C().COURT.declineCooldown);
};
Court.onCooldown = function (world, fromId, toId) {
  const until = (world.cooldowns || {})[fromId + '>' + toId];
  return until != null && world.questClock < until;
};

function eligible(c) {
  return c.alive && !c.isMonster && (!c.registryId || c.hiroNpc) && !c.campaign && c.status === 'normal' && !c.isUndead && !c.isConscript;
}
function hasLookism(c) { return c.perks.some(p => p.skillId === 'lookism'); }

// The five wealthiest men in town (vault + carried), the player included.
// Cached per clock tick — Rel.score asks constantly.
Court.richestMen = function (world) {
  const cache = world.__richCache;
  const stamp = world.questClock + ':' + world.characters.length;
  if (cache && cache.stamp === stamp && world.__richDirty !== true) return cache.men;
  const men = world.characters.filter(c => eligible(c) && c.sex === 'm');
  men.sort((a, b) => ADV.Vault.wealthOf(world, b) - ADV.Vault.wealthOf(world, a));
  const top = men.slice(0, C().COURT.wealthTop);
  world.__richCache = { stamp, men: top }; world.__richDirty = false;
  return top;
};
Court.invalidate = function (world) { world.__richDirty = true; };

function bloodRelated(a, b) {
  if (a.motherId === b.id || a.fatherId === b.id || b.motherId === a.id || b.fatherId === a.id) return true;
  return !!((a.motherId && a.motherId === b.motherId) || (a.fatherId && a.fatherId === b.fatherId));
}
// Does the Friendly floor apply from -> to? (raw scores only — Rel.score calls this)
Court.floorApplies = function (world, fromId, toId) {
  const from = ADV.World.byId(world, fromId), to = ADV.World.byId(world, toId);
  if (!from || !to || from === to || from.sex === to.sex || !eligible(from) || !eligible(to)) return false;
  return Court.wants(world, from, to);
};
Court.wealthRank = function (world, man) {
  const men = world.characters.filter(c => eligible(c) && c.sex === 'm');
  men.sort((a, b) => ADV.Vault.wealthOf(world, b) - ADV.Vault.wealthOf(world, a));
  return men.indexOf(man) + 1;
};

// Does `from` want `to`, by the rules? (both alive, opposite sex, no hatred)
Court.wants = function (world, from, to) {
  if (from.sex === to.sex) return false;
  const H = C().REL.HATRED_MAX;
  if (Rel().rawScore(world, from.id, to.id) <= H || Rel().rawScore(world, to.id, from.id) <= H) return false;
  if (bloodRelated(from, to)) return false;
  if (Court.onCooldown(world, from.id, to.id)) return false;
  const shared = Court.shared(world, from.id, to.id);
  if (from.hiroNpc) return shared >= ADV.Hiro.RULES.friendlyAfter;   // Hiro warms slowly, and looks do not move him
  if (hasLookism(to)) return true;
  if (from.sex === 'm') return shared >= C().COURT.maleFriendlyAfter;
  if (Court.richestMen(world).includes(to)) return true;
  return shared >= C().COURT.femaleFriendlyAfter;
};

// Would `from` ask `to` now?
Court.wouldAsk = function (world, from, to) {
  if (!Court.wants(world, from, to)) return false;
  if (from.partnerId || to.partnerId) return false;
  if (from.hiroNpc) return false;                                  // Hiro never asks
  if (from.sex === 'm') return Court.shared(world, from.id, to.id) >= C().COURT.maleProposeAfter;
  return Court.richestMen(world).includes(to);   // women ask only the wealthy
};

function queueProposal(world, fromId) {
  world.pendingProposals = world.pendingProposals || [];
  if (world.pendingProposals.some(p => p.fromId === fromId)) return;
  world.pendingProposals.push({ fromId, at: world.questClock });
}

// Runs on the world clock.
Court.tick = function (world, rng, feed, lowPop) {
  Court.invalidate(world);
  const people = world.characters.filter(eligible);
  for (const from of people) {
    for (const to of people) {
      if (from === to || from.sex === to.sex) continue;
      if (!Court.wants(world, from, to)) continue;       // (warmth itself is a live floor in Rel.score)
      if (from.isPlayer) continue;                       // the player asks in person
      if (!Court.wouldAsk(world, from, to)) continue;
      if (to.isPlayer) { queueProposal(world, from.id); continue; }
      // NPC asks NPC: accepted when the other side is Friendly (a rich man is always asked; he accepts)
      let accept = to.sex === 'm' ? true : Rel().score(world, to.id, from.id) >= C().REL.FRIENDLY_MIN;
      if (to.hiroNpc && !ADV.Hiro.acceptsProposal(from)) accept = false;   // reputation 15 or nothing
      if (!accept) { Court.decline(world, to, from); continue; }
      const lines = Rel().commit(world, from.id, to.id);
      for (const l of lines) feed(l.text.replace(' are together.', ' married.'), l.actorIds);
    }
  }
  // lapsed asks (the player never answered) fall away quietly
  world.pendingProposals = (world.pendingProposals || []).filter(p => {
    const c = ADV.World.byId(world, p.fromId);
    return c && c.alive && !c.partnerId && world.questClock - p.at < 3;
  });
};

// `decliner` turned `asker` down: the asker's regard drops to Neutral and stays
// there for the cooldown, after which the rules may lift it again.
Court.decline = function (world, decliner, asker) {
  Rel().move(world, asker.id, decliner.id, 0, 'romance', { set: true });
  Court.cooldown(world, asker.id, decliner.id);
  world.pendingProposals = (world.pendingProposals || []).filter(p => p.fromId !== asker.id);
};

ADV.Courtship = Court;
})();
