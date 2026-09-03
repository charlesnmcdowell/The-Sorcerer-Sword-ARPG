// Save state (§19): five keys, adv:meta survives permadeath, all writes
// wrapped in try/catch — a failed write must never block play.
(function () {
'use strict';

const Save = {};
const KEYS = ['adv:world', 'adv:characters', 'adv:edges', 'adv:vaults', 'adv:meta'];

// storage backend: localStorage in the browser, injectable for tests
let store = null;
function backend() {
  if (store) return store;
  try { if (typeof localStorage !== 'undefined') return localStorage; } catch (e) {}
  // in-memory fallback
  store = { _m: {}, getItem(k) { return this._m[k] != null ? this._m[k] : null; },
    setItem(k, v) { this._m[k] = String(v); }, removeItem(k) { delete this._m[k]; } };
  return store;
}
Save.setBackend = function (b) { store = b; };

function put(key, obj) {
  try { backend().setItem(key, JSON.stringify(obj)); return true; }
  catch (e) { return false; }
}
function get(key) {
  try { const v = backend().getItem(key); return v ? JSON.parse(v) : null; }
  catch (e) { return null; }
}

// Write once per quest resolution and on town transactions (§19).
Save.saveGame = function (game) {
  const w = game.world;
  put('adv:world', {
    seed: w.seed, questClock: w.questClock,
    eventFeed: w.eventFeed, activeHeroes: w.activeHeroes,
    pendingRescues: w.pendingRescues, pendingPopulation: w.pendingPopulation,
    orphans: w.orphans, divineOffers: w.divineOffers,
    pendingHeroInvites: w.pendingHeroInvites, pendingPlayerJilt: w.pendingPlayerJilt,
    playerId: w.playerId, metIds: w.metIds,
    parties: w.parties, campaignWorld: w.campaignWorld || null, mawContracts: w.mawContracts || [], pendingRaises: w.pendingRaises || [], hiroId: w.hiroId || null,
    sharedQuests: w.sharedQuests || {}, pendingProposals: w.pendingProposals || [], cooldowns: w.cooldowns || {},
    pendingLeaderDeath: w.pendingLeaderDeath || null, playerOutings: w.playerOutings || 0,
    board: game.board, life: game.life, campaign: game.campaign || null, tutorial: game.tutorial || null,
  });
  put('adv:characters', w.characters);
  put('adv:edges', w.edges);
  put('adv:vaults', w.vaults);
  Save.saveMeta(game);
};

Save.saveMeta = function (game) {
  put('adv:meta', game.meta);
};

Save.loadMeta = function () {
  return get('adv:meta') || { journal: {}, skillLevels: {}, promptsSeen: {}, codexUnlocked: [], hiroUnlocked: false, lives: 0 };
};

Save.loadGame = function () {
  const ws = get('adv:world');
  if (!ws) return null;
  const characters = get('adv:characters');
  const edges = get('adv:edges');
  const vaults = get('adv:vaults');
  if (!characters || !edges || !vaults) return null;
  const world = {
    seed: ws.seed, questClock: ws.questClock,
    characters, edges, vaults,
    parties: ws.parties || [],
    eventFeed: ws.eventFeed || [], activeHeroes: ws.activeHeroes || [],
    pendingRescues: ws.pendingRescues || [], pendingPopulation: ws.pendingPopulation || [],
    orphans: ws.orphans || [], divineOffers: ws.divineOffers || [],
    pendingHeroInvites: ws.pendingHeroInvites || [], pendingPlayerJilt: ws.pendingPlayerJilt || null,
    playerId: ws.playerId, metIds: ws.metIds || [],
    campaignWorld: ws.campaignWorld || null, mawContracts: ws.mawContracts || [], pendingRaises: ws.pendingRaises || [], hiroId: ws.hiroId || null,
    sharedQuests: ws.sharedQuests || {}, pendingProposals: ws.pendingProposals || [], cooldowns: ws.cooldowns || {},
    pendingLeaderDeath: ws.pendingLeaderDeath || null, playerOutings: ws.playerOutings || 0,
  };
  if (ADV.Character && ADV.Character.repairWorldVoices) ADV.Character.repairWorldVoices(world);
  return { world, board: ws.board || null, life: ws.life || 1, meta: Save.loadMeta(), campaign: ws.campaign || null, tutorial: ws.tutorial || null };
};

Save.hasSave = function () { return !!get('adv:world'); };

Save.reset = function () {
  for (const k of KEYS) { try { backend().removeItem(k); } catch (e) {} }
};

ADV.Save = Save;
})();
