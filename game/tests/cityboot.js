// cityboot.js — boots CityScene's real create()+update() in node with a stub Phaser,
// reproducing the exact black-screen path: Warlock, fresh gauntlet victory, AUTO FULL.
// Any logic-level exception (the kind that blanks the canvas but leaves DOM alive) surfaces here.
// Usage: node game/tests/cityboot.js [char] [autoMode]

const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const CHAR = process.argv[2] || 'warlock';
const AUTO = parseInt(process.argv[3] ?? '2', 10);

// ---------- DOM stub ----------
const mkEl = () => ({ style: {}, textContent: '', innerHTML: '', display: '',
  classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, contains(c) { return this._s.has(c); } },
  addEventListener() {}, removeEventListener() {}, appendChild() {}, dispatchEvent() {},
  querySelector: () => mkEl(), querySelectorAll: () => [], firstChild: { nodeValue: '' },
  setAttribute() {}, focus() {} });
const els = {};
const stub2d = () => new Proxy({}, { get: (t, k) =>
  k === 'createRadialGradient' || k === 'createLinearGradient' ? (() => ({ addColorStop() {} })) : (() => {}),
  set: () => true });
global.document = {
  getElementById: id => (els[id] = els[id] || mkEl()),
  querySelectorAll: () => [],
  createElement: () => ({ width: 0, height: 0, style: {}, getContext: stub2d, addEventListener() {} }),
};
global.window = global;
global.addEventListener = () => {}; global.removeEventListener = () => {};
global.navigator = { vibrate: null, maxTouchPoints: 0 };
global.localStorage = { _s: {}, getItem(k) { return this._s[k] ?? null; }, setItem(k, v) { this._s[k] = v; }, removeItem(k) { delete this._s[k]; } };
global.Audio = class { constructor() { this.volume = 1; this.paused = true; } play() { this.paused = false; return { catch() {} }; } pause() { this.paused = true; } addEventListener() {} };
global.requestAnimationFrame = f => setTimeout(f, 0);
global.performance = { now: () => simNow };
let simNow = 0;

// ---------- Phaser stub ----------
const chain = extra => {
  const o = { x: 0, y: 0, alpha: 1, visible: true, destroyed: false, tilePositionX: 0, tilePositionY: 0 };
  const self = new Proxy(o, { get(t, k) {
    if (k in t) return t[k];
    if (extra && k in extra) return extra[k];
    if (typeof k === 'string' && (k.startsWith('set') || ['destroy', 'start', 'stop', 'clear', 'fill', 'erase', 'refresh', 'draw'].includes(k)))
      return (...a) => { if (k === 'setVisible') t.visible = a[0]; if (k === 'setDepth') t.depth = a[0]; return self; };
    return undefined;
  }, set(t, k, v) { t[k] = v; return true; } });
  return self;
};
const graphics = () => chain({ fillStyle() {}, fillRect() {}, fillCircle() {}, fillEllipse() {}, fillTriangle() {},
  strokeTriangle() {}, strokeEllipse() {}, strokeRect() {}, lineStyle() {}, lineBetween() {},
  beginPath() {}, moveTo() {}, lineTo() {}, strokePath() {}, generateTexture: (key) => { textures._reg.add(key); } });
const textures = {
  _reg: new Set(),
  exists(k) { return this._reg.has(k); },
  remove(k) { this._reg.delete(k); },
  addCanvas(k) { this._reg.add(k); return { add() {} }; },
  createCanvas(k, w, h) { this._reg.add(k); return { getContext: stub2d, refresh() {}, add() {} }; },
  get(k) { return { has: () => true, add() {}, getContext: stub2d }; },
};
global.Phaser = {
  AUTO: 1, VERSION: 'stub', Scale: { FIT: 1, CENTER_BOTH: 1 }, BlendModes: { ADD: 1, MULTIPLY: 2, ERASE: 3 },
  Game: class {}, Scene: class { constructor(cfg) { this._key = cfg && cfg.key; } },
  Display: { Color: { GetColor: () => 0 } },
  Math: { Vector2: class { constructor(x, y) { this.x = x; this.y = y; } } },
  Curves: { QuadraticBezier: class { constructor() {} draw() {} } },
};

// ---------- load the real game scripts in index.html order ----------
const load = f => { const src = fs.readFileSync(path.join(root, f), 'utf8');
  try { (0, eval)(src); } catch (e) { console.error('LOAD FAIL ' + f + ': ' + e.message); process.exit(1); } };
global.GAME_CONFIG = { anthropicApiKey: '', fieldScaling: true };
for (const f of ['assets/embedded.js', 'src/core/money.js', 'src/core/dialog.js', 'src/core/worldmap.js',
  'src/core/autopilot.js', 'src/core/questnav.js', 'src/core/touchstick.js', 'src/core/save.js',
  'src/core/music.js', 'src/core/voice.js', 'src/world/citymap.js', 'src/world/quests.js',
  'src/world/companions.js', 'src/core/companionAI.js', 'src/combat/pit.js']) load(f);
// scenes reference each other's classes — declare onto global as eval'd classes
for (const f of ['src/scenes/WorldScene.js', 'src/scenes/CityScene.js', 'src/scenes/GroveScene.js',
  'src/scenes/DungeonScene.js', 'src/scenes/VarenholmScene.js']) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  try { (0, eval)(src + '\n;global.' + path.basename(f, '.js') + ' = ' + path.basename(f, '.js') + ';'); }
  catch (e) { console.error('LOAD FAIL ' + f + ': ' + e.message); process.exit(1); }
}

// ---------- game state: fresh warlock champion, AUTO FULL ----------
global.GameState = {
  version: 1,
  player: { char: CHAR, kills: 68, level: 10, bladeTier: 0, base: { STR: 10, DEX: 10, CON: 10, ATK: 10 },
    nickname: 'INSTANT TERMS', copper: 680, belt: [], artifacts: [] },
  world: { zone: 'pit-of-karridge', flags: { pitChampion: true }, chestsOpened: [], questLog: [], questCounts: {} },
  companions: {}, meta: { playtimeMs: 0, kills: 68, autoMode: AUTO },
};

// ---------- construct CityScene with scene plumbing ----------
const timers = [];
const scene = new CityScene();
Object.assign(scene, {
  scale: { width: 1280, height: 720 },
  add: { image: () => chain(), sprite: () => chain(), graphics, text: () => chain(),
    rectangle: () => chain(), circle: () => chain(), tileSprite: () => chain(),
    particles: () => chain(), renderTexture: () => chain() },
  make: { tilemap: () => ({ addTilesetImage: () => ({}), createBlankLayer: () => chain({ putTileAt() {}, forEachTile() {} }) }),
    graphics, image: () => chain() },
  textures,
  input: { keyboard: { addKeys: s => Object.fromEntries(s.split(',').map(k => [k, { isDown: false }])), on() {} },
    on() {}, mouse: { disableContextMenu() {} } },
  cameras: { main: { setBounds: () => ({ startFollow() {} }), scrollX: 0, scrollY: 0 } },
  time: { delayedCall: (ms, fn) => timers.push({ at: simNow + ms, fn }), addEvent: cfg => timers.push({ at: simNow + cfg.delay, fn: cfg.callback, loop: cfg.loop, delay: cfg.delay }) },
  tweens: { add: cfg => { if (cfg.onComplete) timers.push({ at: simNow + (cfg.duration || 0), fn: cfg.onComplete }); } },
  scene: { key: 'CityScene', start: name => { console.log('  [scene.start -> ' + name + ']'); } },
});

console.log(`booting CityScene: char=${CHAR} autoMode=${AUTO}`);
try {
  scene.create();
  console.log('  create() OK — player at', scene.player.x, scene.player.y, '· solids:', scene.solids.length, '· interactables:', scene.interactables.length);
  for (let i = 0; i < 1800; i++) { // 30 sim-seconds of update loop
    simNow += 1000 / 60;
    for (let t = timers.length - 1; t >= 0; t--) if (timers[t].at <= simNow) {
      const tm = timers[t];
      if (tm.loop) tm.at = simNow + tm.delay; else timers.splice(t, 1);
      tm.fn();
    }
    scene.update(simNow, 1000 / 60);
  }
  console.log('  1800 frames OK · nav tracking:', QuestNav.tracking, '· path length:', QuestNav.path.length, '· player at', Math.round(scene.player.x), Math.round(scene.player.y));
  console.log('CITYBOOT PASS');
} catch (e) {
  console.error('\n=== CRASH REPRODUCED ===');
  console.error(e.stack);
  process.exit(1);
}
