// Save/load roundtrip test (node, localStorage stubbed).
const store = {};
global.localStorage = { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } };
global.window = { };
const { SaveSystem } = require('../src/core/save.js');

window.GameState = {
  version: 1,
  player: { char: 'druid', kills: 87, level: 10, bladeTier: 0, base: { STR: 10, DEX: 10, CON: 10, ATK: 10 },
    nickname: 'THE AVALANCHE', copper: 650, belt: [{ type: 'potion-health', label: 'Health Potion' }],
    artifacts: ['coalheart', 'ley-shard'] },
  world: { zone: 'thorn-grove', flags: { 'q-mq5-ash-and-silence': 'done', 'vial-kept': true },
    chestsOpened: ['dgchest-leyshard'], questLog: [], questCounts: { 'g-wolves': 8 }, activeFollower: 'vexa' },
  companions: { vexa: { met: true, recruited: true, approval: 5, memory: ['joined you'], following: true } },
  meta: { playtimeMs: 0, kills: 87 },
};

if (SaveSystem.hasSave()) throw new Error('phantom save');
if (!SaveSystem.save()) throw new Error('save failed');
if (!SaveSystem.hasSave()) throw new Error('save not found');

const snapshot = JSON.stringify(window.GameState);
window.GameState = { version: 1, player: null, world: { zone: 'boot', flags: {}, chestsOpened: [], questLog: [] }, companions: {}, meta: {} };
const loaded = SaveSystem.load();
if (!loaded) throw new Error('load failed');
SaveSystem.apply(loaded);
if (JSON.stringify(window.GameState) !== snapshot) throw new Error('roundtrip mismatch');
if (SaveSystem.sceneForZone(window.GameState.world.zone) !== 'GroveScene') throw new Error('zone->scene mapping');
if (window.GameState.companions.vexa.approval !== 5) throw new Error('companion state lost');
SaveSystem.wipe();
if (SaveSystem.hasSave()) throw new Error('wipe failed');
console.log('SAVE ROUNDTRIP PASS — druid in thorn-grove with vexa, full journal, restored exactly');
