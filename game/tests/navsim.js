// navsim.js — full-game AFK simulation: boots the REAL scene classes with a stub
// Phaser/DOM, sets AUTO FULL, and lets QuestNav play the entire main quest across
// zone transitions (city <-> grove <-> dungeon <-> varenholm), fighting real
// encounters with the real combat sim. PASS = the character's final beat completes.
// Usage: node game/tests/navsim.js [ronin|druid|warlock] [maxSimMinutes]

const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const CHAR = process.argv[2] || 'ronin';
const MAXMIN = parseFloat(process.argv[3] || '25');

// ---------- sim clock + timers ----------
let simNow = 0;
const timers = [];
global.setTimeout = (fn, ms) => { timers.push({ at: simNow + (ms || 0), fn }); return timers.length; };
global.clearTimeout = () => {};
global.requestAnimationFrame = fn => { timers.push({ at: simNow, fn }); };
global.performance = { now: () => simNow };

// ---------- DOM stub (dialog options are real enough for FULL-auto to click) ----------
function mkEl(id) {
  const el = { id, style: {}, textContent: '', _innerHTML: '', children: [], _ls: {},
    classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, contains(c) { return this._s.has(c); } },
    className: '',
    addEventListener(t, f) { (el._ls[t] = el._ls[t] || []).push(f); },
    removeEventListener() {},
    dispatchEvent(ev) { for (const f of el._ls[(ev && ev.type) || 'pointerdown'] || []) f(ev); },
    appendChild(c) { el.children.push(c); },
    querySelector() { return mkEl(); }, querySelectorAll() { return []; },
    firstChild: { nodeValue: '' }, setAttribute() {}, focus() {},
    getContext: () => stub2d(), width: 0, height: 0 };
  Object.defineProperty(el, 'innerHTML', { get() { return el._innerHTML; }, set(v) { el._innerHTML = v; el.children = []; } });
  return el;
}
const stub2d = () => new Proxy({}, { get: (t, k) =>
  k === 'createRadialGradient' || k === 'createLinearGradient' ? (() => ({ addColorStop() {} })) : (() => {}),
  set: () => true });
const els = {};
global.document = {
  getElementById: id => (els[id] = els[id] || mkEl(id)),
  querySelector: () => mkEl(),
  querySelectorAll: sel => {
    if (sel.includes('dlgopt')) {
      const host = els.dlgOpts || mkEl('dlgOpts');
      return host.children.filter(c => (c.className || '').includes('dlgopt') && !(c.className || '').includes('disabled'));
    }
    return [];
  },
  createElement: () => mkEl(),
};
global.window = global;
global.addEventListener = () => {}; global.removeEventListener = () => {};
global.navigator = { vibrate: null, maxTouchPoints: 0 };
global.localStorage = { _s: {}, getItem(k) { return this._s[k] ?? null; }, setItem(k, v) { this._s[k] = v; }, removeItem(k) { delete this._s[k]; } };
global.Audio = class {
  constructor() { this.volume = 1; this.paused = true; this._ls = {}; }
  addEventListener(t, f) { (this._ls[t] = this._ls[t] || []).push(f); }
  play() { this.paused = false; // voice clips don't exist in sim: fire 'error' like a missing file
    timers.push({ at: simNow + 1, fn: () => { for (const f of this._ls.error || []) f(); } });
    return { catch() {} }; }
  pause() { this.paused = true; }
};

// ---------- Phaser stub ----------
const chain = extra => {
  const o = { x: 0, y: 0, alpha: 1, visible: true, tilePositionX: 0, tilePositionY: 0 };
  const self = new Proxy(o, { get(t, k) {
    if (k in t) return t[k];
    if (extra && k in extra) return extra[k];
    if (typeof k === 'string' && (k.startsWith('set') || ['destroy', 'start', 'stop', 'clear', 'fill', 'erase', 'refresh', 'draw'].includes(k)))
      return () => self;
    return undefined;
  }, set(t, k, v) { t[k] = v; return true; } });
  return self;
};
const graphics = () => chain({ fillStyle() {}, fillRect() {}, fillCircle() {}, fillEllipse() {}, fillTriangle() {},
  strokeTriangle() {}, strokeEllipse() {}, strokeRect() {}, lineStyle() {}, lineBetween() {},
  beginPath() {}, moveTo() {}, lineTo() {}, strokePath() {}, generateTexture: key => texReg.add(key) });
const texReg = new Set();
const textures = {
  exists: k => texReg.has(k), remove: k => texReg.delete(k),
  addCanvas: k => { texReg.add(k); return { add() {} }; },
  createCanvas: k => { texReg.add(k); return { getContext: stub2d, refresh() {}, add() {} }; },
  get: () => ({ has: () => true, add() {}, getContext: stub2d }),
};
global.Phaser = {
  AUTO: 1, VERSION: 'sim', Scale: { FIT: 1, CENTER_BOTH: 1 }, BlendModes: { ADD: 1, MULTIPLY: 2, ERASE: 3 },
  Game: class {}, Scene: class { constructor(cfg) { this._key = cfg && cfg.key; } },
  Display: { Color: { GetColor: () => 0 } },
  Math: { Vector2: class { constructor(x, y) { this.x = x; this.y = y; } } },
  Curves: { QuadraticBezier: class { draw() {} } },
};

// ---------- load real game code ----------
global.GAME_CONFIG = { anthropicApiKey: '', fieldScaling: true };
const load = f => { (0, eval)(fs.readFileSync(path.join(root, f), 'utf8')); };
for (const f of ['assets/embedded.js', 'src/core/money.js', 'src/core/dialog.js', 'src/core/worldmap.js',
  'src/core/autopilot.js', 'src/core/questnav.js', 'src/core/touchstick.js', 'src/core/save.js',
  'src/core/music.js', 'src/core/voice.js', 'src/world/citymap.js', 'src/world/quests.js',
  'src/world/companions.js', 'src/core/companionAI.js', 'src/combat/pit.js']) load(f);
for (const f of ['WorldScene', 'CityScene', 'GroveScene', 'DungeonScene', 'VarenholmScene', 'MountainScene', 'AshenveilScene'])
  (0, eval)(fs.readFileSync(path.join(root, 'src/scenes', f + '.js'), 'utf8') + ';global.' + f + '=' + f + ';');

// ---------- world state: champion fresh out of the Pit, AUTO FULL ----------
global.GameState = {
  version: 1,
  player: { char: CHAR, kills: 45, level: 10, bladeTier: CHAR === 'ronin' ? 2 : 0,
    base: { STR: 10, DEX: 10, CON: 10, ATK: 10 }, nickname: 'BEFORE THE BELL', copper: 450, belt: [], artifacts: [] },
  world: { zone: 'karridge-city', flags: { pitChampion: true }, chestsOpened: [], questLog: [], questCounts: {} },
  companions: {}, meta: { playtimeMs: 0, kills: 45, autoMode: 2 },
};

// ---------- scene host with zone swapping ----------
const CLASSES = { CityScene, GroveScene, DungeonScene, VarenholmScene, MountainScene, AshenveilScene };
let pendingScene = null, scene = null, sceneTimers = [];
function plumb(s) {
  Object.assign(s, {
    scale: { width: 1280, height: 720 },
    add: { image: (x, y) => { const c = chain(); c.x = x || 0; c.y = y || 0; return c; },
      sprite: (x, y) => { const c = chain(); c.x = x || 0; c.y = y || 0; return c; },
      graphics, text: (x, y) => { const c = chain(); c.x = x || 0; c.y = y || 0; return c; },
      rectangle: () => chain(), circle: () => chain(), tileSprite: () => chain(),
      particles: () => chain(), renderTexture: () => chain() },
    make: { tilemap: () => ({ addTilesetImage: () => ({}), createBlankLayer: () => chain({ putTileAt() {}, forEachTile() {} }) }),
      graphics, image: () => chain() },
    textures,
    input: { keyboard: { addKeys: str => Object.fromEntries(str.split(',').map(k => [k, { isDown: false }])), on() {} },
      on() {}, mouse: { disableContextMenu() {} } },
    cameras: { main: { setBounds: () => ({ startFollow() {} }), scrollX: 0, scrollY: 0 } },
    time: { delayedCall: (ms, fn) => sceneTimers.push({ at: simNow + ms, fn }),
      addEvent: cfg => sceneTimers.push({ at: simNow + cfg.delay, fn: cfg.callback, loop: cfg.loop, delay: cfg.delay }) },
    tweens: { add: cfg => { if (cfg.onComplete) sceneTimers.push({ at: simNow + (cfg.duration || 0), fn: cfg.onComplete }); } },
    scene: { key: s._key, start: name => { pendingScene = name; } },
  });
}
function startScene(name) {
  sceneTimers = [];
  scene = new CLASSES[name]();
  plumb(scene);
  scene.create();
  log(`>> ${name} (zone=${GameState.world.zone})`);
}
const seenFlags = {};
function log(msg) { console.log(`  [${(simNow / 1000).toFixed(0).padStart(4)}s] ${msg}`); }

console.log(`NAVSIM — ${CHAR.toUpperCase()} on AUTO FULL, target: complete the main quest\n`);
startScene('CityScene');

// druid AND warlock PASS require the credits to actually roll (their epilogues walk
// past the plaza) — catches any "nowhere to go" dead end, not just the last quest flag.
const PASSED = () => (CHAR === 'druid' || CHAR === 'warlock') ? !!GameState.world.flags['credits-rolled']
  : GameState.world.flags[CHAR === 'seraph' ? 'q-sq4-the-chosen' : 'q-mq5-ash-and-silence'] === 'done';
let result = 'TIMEOUT';
while (simNow < MAXMIN * 60 * 1000) {
  simNow += 1000 / 60;
  for (const q of [timers, sceneTimers]) for (let i = q.length - 1; i >= 0; i--) if (q[i].at <= simNow) {
    const t = q[i]; if (t.loop) t.at = simNow + t.delay; else q.splice(i, 1); t.fn();
  }
  try { scene.update(simNow, 1000 / 60); }
  catch (e) { console.error('\n=== CRASH ==='); console.error(e.stack); process.exit(1); }
  // flag transition log
  for (const [k, v] of Object.entries(GameState.world.flags))
    if (seenFlags[k] !== v && /^q-mq|^q-sq|^q-wq|^druid-|^duel-|seraph-recruit|varenholm-show|credits-rolled/.test(k)) { seenFlags[k] = v; log(`flag ${k} = ${v}`); }
  if (pendingScene) { const n = pendingScene; pendingScene = null; startScene(n); }
  if (simNow - (global._dbgT || 0) > 30000) { global._dbgT = simNow;
    log(`dbg pos=(${Math.round(scene.player.x)},${Math.round(scene.player.y)}) track=${QuestNav.tracking} path=${QuestNav.path.length} tgt=${QuestNav.target ? Math.round(QuestNav.target.x) + ',' + Math.round(QuestNav.target.y) : '-'} dlg=${CityUI.dialogOpen()} enc=${scene.encounterActive} autoDlg=${QuestNav.autoDialog}`); }
  if (PASSED()) { result = 'PASS'; break; }
}
console.log(`\n${result === 'PASS' ? '✅' : '❌'} ${CHAR.toUpperCase()} main quest: ${result} in ${(simNow / 60000).toFixed(1)} sim-minutes`);
console.log(`   final flags: ${Object.entries(seenFlags).map(([k, v]) => k.replace('q-mq', 'mq') + ':' + v).join(' · ')}`);
process.exit(result === 'PASS' ? 0 : 1);
