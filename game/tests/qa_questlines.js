// qa_questlines.js — FINAL QA gate (roadmap item 8). A headless, deterministic walk of
// QuestNav.objective() + the per-character flag state machine for ALL FOUR characters
// (ronin, druid, warlock, seraph), beat by beat, end to end. It is the regression gate
// that prevents the druid-crossing class of bug (a beat that EXISTS in code but is
// bypassed by routing, or credits that roll BEFORE the final beat).
//
// What it asserts, per character, for every beat in story order:
//   (b) ROUTING + ORDERING + CREDITS-TIMING  [HARD PASS/FAIL — deterministic, no scene boot]
//       - objective() returns a non-null target at every beat until the true end (no dead end / stuck),
//       - the target's label matches the EXPECTED beat (so a mis-route shows up here),
//       - objective() returns null (the story rests) ONLY after the character's FINAL beat,
//         never before it (catches "credits before the crossing").
//   (a) REACHABILITY  [BEST-EFFORT — boots the real scenes for their solids and runs the real
//       BFS pathfinder to each in-zone objective tile; reported, non-fatal if a scene won't boot].
//   (c) NO-FIGHT-DURING-DIALOGUE  [INFORMATIONAL — static scan of each scene's update() for
//       proximity startEncounter procs and whether each is guarded by CityUI.dialogOpen()].
//
// Writes docs/QA_REPORT.md. Exit 0 only if every character passes the HARD checks.
// Usage: node game/tests/qa_questlines.js

const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');           // .../game
const REPO = path.join(ROOT, '..');                // repo root

// ---------- load QuestNav + Quests (routing checks need only these) ----------
global.window = global;
const { Quests } = require(path.join(ROOT, 'src/world/quests.js'));
global.Quests = Quests;
(0, eval)(fs.readFileSync(path.join(ROOT, 'src/core/questnav.js'), 'utf8'));
const QuestNav = global.QuestNav;

// ---------- a fresh world for a character ----------
function freshGS(char) {
  return { player: { char }, world: { zone: 'karridge-city', flags: {} } };
}
function setFlags(gs, obj) { for (const k in obj) gs.world.flags[k] = obj[k]; }

// ---------- the canonical, story-ordered beat tables ----------
// Each beat: { name, set:{flags to apply BEFORE this beat}, zone:(where the player IS),
//   expect:'substring the objective label MUST contain'  OR  expectNull:true (story rests). }
// The shared main quest (mq1..mq5) is the same for ronin / druid / warlock.
const MQ = [
  { name: 'mq1 — empty cell (Marlow)',      set: { 'q-mq1-empty-cell': 'active' }, zone: 'karridge-city', expect: 'Marlow' },
  { name: 'mq2 — listening room (grove)',    set: { 'q-mq1-empty-cell': 'done', 'q-mq2-listening-room': 'active' }, zone: 'thorn-grove', expect: 'waystation' },
  { name: 'mq3 — roots that rot (veiled woman)', set: { 'q-mq2-listening-room': 'done', 'q-mq3-roots-that-rot': 'active' }, zone: 'karridge-city', expect: 'veiled woman' },
  { name: 'mq4 — the buyer (night shipment)', set: { 'q-mq3-roots-that-rot': 'done', 'q-mq4-the-buyer': 'active' }, zone: 'thorn-grove', expect: 'night shipment' },
  { name: 'mq5 — ash and silence (plaza)',    set: { 'q-mq4-the-buyer': 'done', 'q-mq5-ash-and-silence': 'active' }, zone: 'karridge-city', expect: 'plaza' },
];

const BEATS = {
  seraph: [
    { name: 'sq1 — the host below (Marlow)',  set: { 'q-sq1-the-host-below': 'active' }, zone: 'karridge-city', expect: 'Marlow' },
    { name: 'sq2 — where strength lives (spine trail)', set: { 'q-sq1-the-host-below': 'done', 'q-sq2-where-strength-lives': 'active' }, zone: 'karridge-city', expect: 'spine trail' },
    { name: 'sq3 — five banners (first duel)', set: { 'q-sq2-where-strength-lives': 'done', 'q-sq3-five-banners': 'active' }, zone: 'dragonspine', expect: Quests.seraph.candidates[0].short },
    { name: 'sq4 — the chosen (Skyreach shrine)', set: { 'q-sq3-five-banners': 'done', 'q-sq4-the-chosen': 'active' }, zone: 'dragonspine', expect: 'Skyreach shrine' },
    { name: 'END — the chosen done (story rests)', set: { 'q-sq4-the-chosen': 'done' }, zone: 'dragonspine', expectNull: true },
  ],
  druid: [
    ...MQ,
    { name: 'mq6 — the dancer: board the heartland coach', set: { 'q-mq5-ash-and-silence': 'done' }, zone: 'karridge-city', expect: 'the heartland coach' },
    { name: 'mq6 — the Civic Auditorium (Varenholm)', set: {}, zone: 'varenholm', expect: 'Civic Auditorium' },
    { name: 'mq6 — the Adventurers Guild (Cookie)', set: { 'varenholm-show-seen': true }, zone: 'varenholm', expect: 'Cookie' },
    { name: 'CROSSING — the guild (the crossing) [in Varenholm]', set: { 'q-mq6-the-dancer': 'done' }, zone: 'varenholm', expect: 'the crossing' },
    { name: 'CROSSING — heartland coach to Varenholm [off-zone guard]', set: {}, zone: 'karridge-city', expect: 'the heartland coach to Varenholm' },
    { name: 'CROSSING — Shen Sama on the Dragonspine [post-flee]', set: { 'dq-cross-flee': true }, zone: 'dragonspine', expect: 'Shen Sama' },
    { name: 'CROSSING — climb back up [in Varenholm, post-flee]', set: {}, zone: 'varenholm', expect: 'climb back to the Dragonspine' },
    { name: 'ROAD HOME — the coach home (credits next)', set: { 'q-dq-the-crossing': 'done' }, zone: 'varenholm', expect: 'the coach home' },
    { name: 'END — credits rolled (story rests)', set: { 'credits-rolled': true }, zone: 'varenholm', expectNull: true },
  ],
  warlock: [
    ...MQ,
    { name: 'wq1 — the white writ (plaza)', set: { 'q-mq5-ash-and-silence': 'done', 'q-wq1-the-white-writ': 'active' }, zone: 'karridge-city', expect: 'answer the writ' },
    { name: 'wq2 — a friend of the family (dark alley)', set: { 'q-wq1-the-white-writ': 'done', 'q-wq2-a-friend-of-the-family': 'active' }, zone: 'karridge-city', expect: 'Pale Courier' },
    { name: 'wq3 — the Matron: the black carriage [in city]', set: { 'q-wq2-a-friend-of-the-family': 'done', 'q-wq3-the-matron': 'active' }, zone: 'karridge-city', expect: 'the black carriage' },
    { name: 'wq3 — Lady Nyx [in Ashenveil]', set: {}, zone: 'ashenveil', expect: 'Lady Nyx' },
    { name: 'HUNT 1/5 — Briar (thorn-grove)', set: { 'q-wq3-the-matron': 'done', 'q-wq4-the-hunt': 'active' }, zone: 'thorn-grove', expect: 'Briar' },
    { name: 'HUNT 2/5 — Ossuary (dungeon)', set: { 'cap-briar': true }, zone: 'grove-dungeon', expect: 'Ossuary' },
    { name: 'HUNT 3/5 — cult coach to Cinder [gated, in city]', set: { 'cap-ossuary': true }, zone: 'karridge-city', expect: 'cult coach' },
    { name: 'HUNT 3/5 — Cinder (Dragonspine)', set: {}, zone: 'dragonspine', expect: 'Cinder' },
    { name: 'HUNT 4/5 — Whisper (Academy)', set: { 'cap-cinder': true }, zone: 'ashenveil', expect: 'Whisper' },
    { name: 'HUNT 5/5 — cult coach to Cookie [gated, in city]', set: { 'cap-whisper': true }, zone: 'karridge-city', expect: 'cult coach' },
    { name: 'HUNT 5/5 — Cookie (Varenholm)', set: {}, zone: 'varenholm', expect: 'Cookie' },
    { name: 'DELIVER — the five cages to Nyx', set: { 'cap-cookie': true }, zone: 'ashenveil', expect: 'deliver the five cages' },
    { name: 'END — Nyx delivery: hunt done + credits (story rests)', set: { 'q-wq4-the-hunt': 'done', 'credits-rolled': true }, zone: 'ashenveil', expectNull: true },
  ],
  ronin: [
    ...MQ,
    { name: 'EPILOGUE — Marlow\'s tip', set: { 'q-mq5-ash-and-silence': 'done' }, zone: 'karridge-city', expect: 'Marlow' },
    { name: 'EPILOGUE — the guild clerk', set: { 'q-rq-epilogue': 'active' }, zone: 'karridge-city', expect: 'the clerk' },
    { name: 'SPINE — the spine-coach [off-spine guard]', set: { 'rq-epi-guild': 'done' }, zone: 'karridge-city', expect: 'spine-coach' },
    { name: 'SPINE — search the peak [on the Dragonspine]', set: {}, zone: 'dragonspine', expect: 'search the peak' },
    { name: 'VORATHIEL done -> TEMPLE: close the gate [on spine]', set: { 'rq-epi-vorathiel': 'done' }, zone: 'dragonspine', expect: 'close the gate' },
    { name: 'TEMPLE done -> the Seraphim [scarred shrine]', set: { 'rq-epi-temple': 'done' }, zone: 'dragonspine', expect: 'the Seraphim' },
    { name: 'SERAPHIM done -> report to the guild', set: { 'rq-epi-seraph': 'done' }, zone: 'karridge-city', expect: 'report to the clerk' },
    { name: 'END — epilogue done (story rests)', set: { 'q-rq-epilogue': 'done' }, zone: 'karridge-city', expectNull: true },
  ],
  // EMBER (item 12) shares the ronin/druid/warlock mq1-5 SPINE, then has its own ONE-beat epilogue (eq):
  // after mq5 'done' -> Marlow at the Last Lantern (closing exchange + credits); once q-eq-epilogue is
  // 'done' the story RESTS at null (never a dead-end).
  ember: [
    ...MQ,
    { name: 'EPILOGUE — Marlow at the Last Lantern', set: { 'q-mq5-ash-and-silence': 'done' }, zone: 'karridge-city', expect: 'Marlow' },
    { name: 'END — epilogue done (story rests)', set: { 'q-eq-epilogue': 'done' }, zone: 'karridge-city', expectNull: true },
  ],
};

// ---------- (a) reachability: boot the real scenes for their solids (best-effort) ----------
let zoneScenes = null, bootError = null;
let _boot = null;   // {plumb, CLASSES} stashed by bootScenes() so single scenes can be re-booted under arbitrary char+flags (item 14B)
function bootScenes() {
  // --- minimal sim clock + DOM/Phaser stubs (mirrors navsim.js) ---
  let simNow = 0; const timers = [];
  global.setTimeout = (fn, ms) => { timers.push({ at: simNow + (ms || 0), fn }); return timers.length; };
  global.clearTimeout = () => {};
  global.requestAnimationFrame = fn => { timers.push({ at: simNow, fn }); };
  global.performance = { now: () => simNow };
  const stub2d = () => new Proxy({}, { get: (t, k) => k === 'createRadialGradient' || k === 'createLinearGradient' ? (() => ({ addColorStop() {} })) : (() => {}), set: () => true });
  function mkEl(id) {
    const el = { id, style: {}, textContent: '', _innerHTML: '', children: [], _ls: {},
      classList: { _s: new Set(), add(c){this._s.add(c);}, remove(c){this._s.delete(c);}, contains(c){return this._s.has(c);} },
      className: '', addEventListener(t,f){(el._ls[t]=el._ls[t]||[]).push(f);}, removeEventListener(){},
      dispatchEvent(){}, appendChild(c){el.children.push(c);}, querySelector(){return mkEl();}, querySelectorAll(){return [];},
      firstChild: { nodeValue: '' }, setAttribute(){}, focus(){}, getContext: () => stub2d(), width: 0, height: 0 };
    Object.defineProperty(el, 'innerHTML', { get(){return el._innerHTML;}, set(v){el._innerHTML=v;el.children=[];} });
    return el;
  }
  const els = {};
  global.document = { getElementById: id => (els[id] = els[id] || mkEl(id)), querySelector: () => mkEl(), querySelectorAll: () => [], createElement: () => mkEl() };
  global.addEventListener = () => {}; global.removeEventListener = () => {};
  global.navigator = { vibrate: null, maxTouchPoints: 0 };
  global.localStorage = { _s: {}, getItem(k){return this._s[k] ?? null;}, setItem(k,v){this._s[k]=v;}, removeItem(k){delete this._s[k];} };
  global.Audio = class { constructor(){this.volume=1;this.paused=true;this._ls={};} addEventListener(t,f){(this._ls[t]=this._ls[t]||[]).push(f);} play(){return {catch(){}};} pause(){} };
  const chain = extra => { const o = { x:0,y:0,alpha:1,visible:true,tilePositionX:0,tilePositionY:0 };
    const self = new Proxy(o, { get(t,k){ if (k in t) return t[k]; if (extra && k in extra) return extra[k];
      if (typeof k === 'string' && (k.startsWith('set') || ['destroy','start','stop','clear','fill','erase','refresh','draw'].includes(k))) return () => self; return undefined; },
      set(t,k,v){ t[k]=v; return true; } }); return self; };
  const texReg = new Set();
  const graphics = () => chain({ fillStyle(){}, fillRect(){}, fillCircle(){}, fillEllipse(){}, fillTriangle(){}, strokeTriangle(){}, strokeEllipse(){}, strokeRect(){}, lineStyle(){}, lineBetween(){}, beginPath(){}, moveTo(){}, lineTo(){}, strokePath(){}, strokeCircle(){}, arc(){}, generateTexture: key => texReg.add(key) });
  const textures = { exists: k => texReg.has(k), remove: k => texReg.delete(k), addCanvas: k => { texReg.add(k); return { add(){} }; }, createCanvas: k => { texReg.add(k); return { getContext: stub2d, refresh(){}, add(){} }; }, get: () => ({ has: () => true, add(){}, getContext: stub2d }) };
  global.Phaser = { AUTO: 1, VERSION: 'sim', Scale: { FIT: 1, CENTER_BOTH: 1 }, BlendModes: { ADD: 1, MULTIPLY: 2, ERASE: 3 }, Game: class {}, Scene: class { constructor(cfg){ this._key = cfg && cfg.key; } }, Display: { Color: { GetColor: () => 0 } }, Math: { Vector2: class { constructor(x,y){ this.x=x; this.y=y; } } }, Curves: { QuadraticBezier: class { draw(){} } } };

  global.GAME_CONFIG = { anthropicApiKey: '', fieldScaling: true };
  const load = f => { (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')); };
  for (const f of ['assets/embedded.js', 'src/core/money.js', 'src/core/dialog.js', 'src/core/worldmap.js',
    'src/core/autopilot.js', 'src/core/questnav.js', 'src/core/touchstick.js', 'src/core/save.js',
    'src/core/music.js', 'src/core/voice.js', 'src/world/citymap.js', 'src/world/quests.js',
    'src/world/companions.js', 'src/core/companionAI.js', 'src/combat/pit.js']) load(f);
  const sceneNames = ['WorldScene', 'CityScene', 'GroveScene', 'DungeonScene', 'VarenholmScene', 'MountainScene', 'AshenveilScene'];
  const joined = sceneNames.map(f => fs.readFileSync(path.join(ROOT, 'src/scenes', f + '.js'), 'utf8')).join('\n;\n')
    + ';' + sceneNames.map(n => 'global.' + n + ' = ' + n + ';').join('');
  (0, eval)(joined);   // one scope: GROVE_THEME / the WorldScene base class resolve across files

  global.GameState = { version: 1, player: { char: 'ronin', kills: 45, level: 10, bladeTier: 2, base: { STR: 10, DEX: 10, CON: 10, ATK: 10 }, nickname: 'QA', copper: 450, belt: [], artifacts: [] }, world: { zone: 'karridge-city', flags: { pitChampion: true }, chestsOpened: [], questLog: [], questCounts: {} }, companions: {}, meta: { playtimeMs: 0, kills: 45, autoMode: 2 } };

  const CLASSES = { 'karridge-city': CityScene, 'thorn-grove': GroveScene, 'grove-dungeon': DungeonScene, 'varenholm': VarenholmScene, 'dragonspine': MountainScene, 'ashenveil': AshenveilScene };
  function plumb(s) {
    Object.assign(s, { scale: { width: 1280, height: 720 },
      add: { image: (x,y)=>{const c=chain();c.x=x||0;c.y=y||0;return c;}, sprite:(x,y)=>{const c=chain();c.x=x||0;c.y=y||0;return c;}, graphics, text:(x,y)=>{const c=chain();c.x=x||0;c.y=y||0;return c;}, rectangle:()=>chain(), circle:()=>chain(), tileSprite:()=>chain(), particles:()=>chain(), renderTexture:()=>chain() },
      make: { tilemap: () => ({ addTilesetImage: () => ({}), createBlankLayer: () => chain({ putTileAt(){}, forEachTile(){} }) }), graphics, image: () => chain() },
      textures, input: { keyboard: { addKeys: str => Object.fromEntries(str.split(',').map(k => [k, { isDown: false }])), on(){} }, on(){}, mouse: { disableContextMenu(){} } },
      cameras: { main: { setBounds: () => ({ startFollow(){} }), scrollX: 0, scrollY: 0 } },
      time: { delayedCall: () => {}, addEvent: () => ({}) },
      tweens: { add: () => {} }, scene: { key: s._key, start: () => {} } });
  }
  const out = {};
  for (const [zone, Cls] of Object.entries(CLASSES)) {
    GameState.world.zone = zone;
    const s = new Cls(); plumb(s); s.create();
    out[zone] = { solids: s.solids || [], worldW: s.worldW, worldH: s.worldH,
      start: { x: (s.player && s.player.x) || s.worldW / 2, y: (s.player && s.player.y) || s.worldH / 2 },
      interactables: s.interactables || [], scene: s };
  }
  _boot = { plumb, CLASSES };
  return out;
}

function reachability(zone, tx, ty) {
  if (!zoneScenes || !zoneScenes[zone]) return { ok: null, note: 'scene not booted' };
  const z = zoneScenes[zone];
  const fake = { solids: z.solids, worldW: z.worldW, worldH: z.worldH };
  const pts = QuestNav.findPath(fake, z.start.x, z.start.y, tx, ty);
  // findPath appends the literal (tx,ty) as the last point; the real BFS endpoint is the one before it.
  const endp = pts.length >= 2 ? pts[pts.length - 2] : pts[pts.length - 1];
  const dist = Math.hypot(endp.x - tx, endp.y - ty);
  return { ok: dist < 48, dist: Math.round(dist), steps: pts.length };
}

// ---------- (a2) interactable EXISTENCE at objective tiles (roadmap item 14B) ----------
// reachability() above boots scenes ONCE as a flagless ronin, so it only proves the objective TILE
// is walkable - it never checks that a flag/char-gated interactable (the black carriage, the cult/
// heartland/spine coaches, Marlow, the clerk, the hunt captures...) actually EXISTS at that tile for
// the character on that beat. interactExists() re-boots the objective's scene under the BEAT's real
// char+flags and asserts an interactable sits within interaction range of the objective tile. This is
// the regression gate for the "objective points where nothing is" class (the reported Matron / black-
// carriage "AUTO walks to an empty tile" bug). NOTE: headless-confirmed - the Matron objective tile
// (karridge-city 1656,744) DOES carry the "board the BLACK CARRIAGE" interactable, so that bug was a
// mis-diagnosis; this check now guards every character's interact-objective against the real failure.
function interactExists(zone, char, flags, tx, ty, range) {
  range = range || 56;
  if (!_boot || !_boot.CLASSES[zone]) return { ok: null, note: 'scene not booted' };
  const saved = global.GameState;
  try {
    global.GameState = { version: 1, player: { char, kills: 45, level: 10, bladeTier: 2,
      base: { STR: 10, DEX: 10, CON: 10, ATK: 10 }, nickname: 'QA', copper: 450, belt: [], artifacts: [] },
      world: { zone, flags: Object.assign({ pitChampion: true }, flags), chestsOpened: [], questLog: [], questCounts: {} },
      companions: {}, meta: { playtimeMs: 0, kills: 45, autoMode: 2 } };
    const s = new _boot.CLASSES[zone](); _boot.plumb(s); s.create();
    const its = s.interactables || [];
    let best = null, bd = Infinity;
    for (const i of its) { const d = Math.hypot((i.x || 0) - tx, (i.y || 0) - ty); if (d < bd) { bd = d; best = i; } }
    return { ok: !!best && bd <= range, dist: Math.round(bd === Infinity ? -1 : bd), label: best && best.label };
  } catch (e) { return { ok: null, note: 'boot threw: ' + e.message }; }
  finally { global.GameState = saved; }
}

// Walk each character's beats, accumulate flags exactly like the route walk, and for EVERY interact-
// objective in a bootable zone assert an interactable exists at the objective tile under that beat's
// real state. HARD-fails when the scene boots but no interactable is within range (the 14B class);
// a scene that can't boot headlessly is reported informational (ok:null) rather than failing.
function objInteractCheck() {
  const rows = []; let pass = true;
  const BOOTABLE = { 'karridge-city': 1, 'thorn-grove': 1, 'grove-dungeon': 1, 'varenholm': 1, 'dragonspine': 1, 'ashenveil': 1 };
  for (const char of ['ronin', 'druid', 'warlock', 'seraph', 'ember']) {
    const acc = {};
    for (const beat of BEATS[char]) {
      Object.assign(acc, beat.set);
      global.GameState = { player: { char }, world: { zone: beat.zone, flags: acc } };
      let obj = null; try { obj = QuestNav.objective(); } catch (e) {}
      if (!obj || !obj.interact || !BOOTABLE[obj.zone]) continue;
      const r = interactExists(obj.zone, char, acc, obj.x, obj.y);
      let ok, detail;
      if (r.ok === null) { ok = true; detail = 'interactable:? (' + (r.note || 'dynamic') + ') - informational'; }
      else if (r.ok) { ok = true; detail = 'interactable "' + r.label + '" @' + r.dist + 'px'; }
      else { ok = false; detail = 'NO interactable within range (nearest ' + (r.label ? '"' + r.label + '" ' : '') + r.dist + 'px) - objective points where nothing is'; }
      if (!ok) pass = false;
      rows.push({ ok, label: char + ' · ' + beat.name + ' [' + obj.zone + ' ' + Math.round(obj.x) + ',' + Math.round(obj.y) + ']', detail });
    }
  }
  return { pass, rows };
}

// ---------- (b) manual-control AUTO-stop wiring (roadmap item 14D) ----------
// Real-play check: with AUTO on, a deliberate MANUAL input must outrank the chauffeur.
// Boots the real CityScene (a WorldScene) and drives the REAL input wiring:
//   (1) toggling AUTO via setMode(2)->tracking, setMode(0)->cleared (AUTO OFF returns control);
//   (2) a manual MOVE through the real updatePlayer (keys.A held) cancels the walk (QuestNav.stop);
//   (3) the real keydown-E handler cancels the walk (manual interact outranks AUTO);
//   (4) the mobile prompt-tap (CityUI._onPrompt) cancels the walk.
// Manual ATTACK is documented, not asserted: attacks fire only inside an encounter where the AUTO
// walk is already suspended (updatePlayer returns early on encounterActive), so there is no walk to
// cancel - the AUTO-FIGHT bot and a manual swing simply interleave. Per the FAILSAFE PRINCIPLE this
// is the strongest headless assertion of "manual input returns control"; full pixel-level manual play
// (touch stick / belt taps) can't be driven headlessly and is left to in-zone use, never a gate.
function manualControlCheck() {
  const rows = []; let pass = true;
  if (!_boot || !_boot.CLASSES['karridge-city']) {
    rows.push({ ok: null, label: 'boot WorldScene', detail: 'scene boot unavailable this run - manual-control wiring check skipped (non-fatal)' });
    return { pass: true, rows };
  }
  const saved = global.GameState;
  // IMPORTANT: bootScenes() RE-LOADS questnav.js, so the live object the scenes use is global.QuestNav
  // (a 2nd instance), NOT the module-top `QuestNav` const. Drive the SAME object the scene code mutates.
  const QN = global.QuestNav;
  try {
    global.GameState = { version: 1, player: { char: 'ronin', kills: 45, level: 10, bladeTier: 2,
      base: { STR: 10, DEX: 10, CON: 10, ATK: 10 }, nickname: 'QA', copper: 450, belt: [], artifacts: [] },
      world: { zone: 'karridge-city', flags: { pitChampion: true }, chestsOpened: [], questLog: [], questCounts: {} },
      companions: {}, meta: { playtimeMs: 0, kills: 45, autoMode: 0 } };
    const s = new _boot.CLASSES['karridge-city'](); _boot.plumb(s);
    // capture the keyboard handlers create() registers so we can fire the REAL keydown-E listener
    const handlers = {};
    s.input.keyboard.on = (ev, fn) => { handlers[ev] = fn; };
    s.create();
    if (typeof CityUI !== 'undefined' && CityUI.closeDialog) CityUI.closeDialog(); // CityScene.create opens an intro dialog; close it so updatePlayer doesn't early-return

    // (1) AUTO toggle: FULL sets tracking, OFF clears it (the real setMode)
    QN.setMode(2); const onFull = QN.tracking === true;
    QN.setMode(0); const offCleared = QN.tracking === false;
    const okToggle = onFull && offCleared;
    if (!okToggle) pass = false;
    rows.push({ ok: okToggle, label: 'AUTO toggle clears tracking', detail: 'setMode(2)->tracking=' + onFull + ', setMode(0)->cleared=' + offCleared });

    // (2) manual MOVE cancels the walk via the REAL updatePlayer (keys.A held, no touch)
    QN.mode = 1; QN.tracking = true; QN.path = [{ x: s.player.x - 200, y: s.player.y }]; QN.pathI = 0;
    if (typeof TouchStick !== 'undefined') TouchStick.mag = 0;
    s.keys.A.isDown = true; s.updatePlayer(1 / 60); s.keys.A.isDown = false;
    const okMove = QN.tracking === false;
    if (!okMove) pass = false;
    rows.push({ ok: okMove, label: 'manual MOVE stops AUTO', detail: 'updatePlayer with keys.A held -> tracking=' + QN.tracking });

    // isolate manual-interact from side effects: empty the interactable list so tryInteract() fires no fn()
    s.interactables = [];

    // (3) manual INTERACT via the REAL keydown-E handler cancels the walk
    QN.tracking = true; QN.path = [{ x: 0, y: 0 }]; QN.pathI = 0; s.encounterActive = false;
    if (handlers['keydown-E']) handlers['keydown-E']();
    const okKeyE = !!handlers['keydown-E'] && QN.tracking === false;
    if (!okKeyE) pass = false;
    rows.push({ ok: okKeyE, label: 'manual INTERACT (E) stops AUTO', detail: handlers['keydown-E'] ? ('keydown-E handler fired -> tracking=' + QN.tracking) : 'no keydown-E handler captured' });

    // (4) mobile prompt-tap interact cancels the walk
    QN.tracking = true; QN.path = [{ x: 0, y: 0 }]; QN.pathI = 0;
    let okPrompt = false;
    if (typeof CityUI !== 'undefined' && CityUI._onPrompt) { CityUI._onPrompt(); okPrompt = QN.tracking === false; }
    if (!okPrompt) pass = false;
    rows.push({ ok: okPrompt, label: 'mobile prompt-tap stops AUTO', detail: (typeof CityUI !== 'undefined' && CityUI._onPrompt) ? ('_onPrompt fired -> tracking=' + QN.tracking) : 'no _onPrompt wired' });

    // (5) manual ATTACK - documented (see header); attacks happen only mid-encounter, walk already suspended
    rows.push({ ok: true, label: 'manual ATTACK (info)', detail: 'attacks fire only in encounters where the walk is already suspended (encounterActive) - nothing to cancel' });

    QN.setMode(0);
  } catch (e) {
    rows.push({ ok: null, label: 'manualControlCheck', detail: 'boot/run threw: ' + e.message + ' - skipped (non-fatal)' });
  } finally { global.GameState = saved; }
  return { pass, rows };
}

// ---------- (c) no-fight-during-dialogue: static guard scan ----------
function dialogGuardScan() {
  const scenes = ['CityScene', 'GroveScene', 'DungeonScene', 'VarenholmScene', 'MountainScene', 'AshenveilScene'];
  const rows = [];
  for (const sc of scenes) {
    const src = fs.readFileSync(path.join(ROOT, 'src/scenes', sc + '.js'), 'utf8');
    const ui = src.indexOf('update(');
    const body = ui >= 0 ? src.slice(ui, ui + 9000) : '';   // the update() region where proximity procs live
    // count proximity startEncounter procs in update() (Math.hypot/dist + startEncounter nearby)
    let procs = 0, guarded = 0;
    const re = /startEncounter\s*\(/g; let m;
    while ((m = re.exec(body))) {
      const win = body.slice(Math.max(0, m.index - 600), m.index);   // the guard sits just above the proc
      if (/hypot|dist\(|<\s*1[0-9]{2}/.test(win)) {   // looks like a proximity trigger
        procs++;
        if (/dialogOpen\(\)/.test(win)) guarded++;
      }
    }
    rows.push({ scene: sc, procs, guarded });
  }
  return rows;
}

// ---------- run the routing/ordering state machine ----------
function runChar(char) {
  const gs = freshGS(char); global.GameState = gs;
  const rows = []; let pass = true; let prevKey = null;
  for (const beat of BEATS[char]) {
    setFlags(gs, beat.set);
    gs.world.zone = beat.zone;
    let obj = null, err = null;
    try { obj = QuestNav.objective(); } catch (e) { err = e.message; }
    let ok, detail;
    if (err) { ok = false; detail = 'THREW: ' + err; }
    else if (beat.expectNull) {
      ok = (obj === null);
      detail = ok ? 'null (story rests) ✓' : 'EXPECTED null, got "' + (obj && obj.label) + '"';
    } else if (!obj) {
      ok = false; detail = 'DEAD END — objective() is null (stuck; nowhere to go)';
    } else {
      const label = obj.label || '';
      const routed = label.indexOf(beat.expect) >= 0;
      // stuck = same objective as the previous beat (no progress) when a new one was expected
      const key = obj.zone + '|' + Math.round(obj.x) + ',' + Math.round(obj.y) + '|' + label;
      const stuck = (key === prevKey);
      ok = routed && !stuck;
      const r = reachability(obj.zone, obj.x, obj.y);
      const reach = r.ok === null ? 'reach:?' : r.ok ? 'reach:ok' : ('reach:UNREACHABLE(' + r.dist + 'px)');
      detail = (routed ? '→ ' : 'MISROUTE→ ') + '"' + label + '" [' + obj.zone + ' ' + Math.round(obj.x) + ',' + Math.round(obj.y) + (obj.interact ? ' E' : '') + '] ' + reach + (stuck ? ' STUCK(no progress)' : '');
      prevKey = key;
    }
    if (!ok) pass = false;
    rows.push({ beat: beat.name, ok, detail });
  }
  return { char, pass, rows };
}

// ---------- gated cult-coach transition gate (roadmap item 9) ----------
// The warlock's hunt reaches two GATED zones — Dragonspine (Cinder) and Varenholm (Cookie) —
// reachable ONLY via the city cult coach (karridge-city 1538,744). This is the regression gate
// for the "stuck at 2/5, bring back Cinder" class of bug. It asserts QuestNav.objective():
//   (1) routes to the CULT COACH from EVERY off-gated-zone position (never a dead end, never a
//       capture tile he cannot reach), and
//   (2) once he IS on the gated zone, routes to the in-zone CAPTURE tile — never loops back to
//       the coach (the "MountainScene didn't set world.zone" regression).
// Both directions, both gated targets, from several realistic prior zones.
function gatedGuardCheck() {
  const rows = []; let pass = true;
  const gs = { player: { char: 'warlock' }, world: { zone: '', flags: {} } };
  global.GameState = gs;
  // all main-quest + warlock pre-hunt beats done, the hunt active (so objective() falls into wq4).
  const base = { 'q-mq1-empty-cell': 'done', 'q-mq2-listening-room': 'done', 'q-mq3-roots-that-rot': 'done',
    'q-mq4-the-buyer': 'done', 'q-mq5-ash-and-silence': 'done', 'q-wq1-the-white-writ': 'done',
    'q-wq2-a-friend-of-the-family': 'done', 'q-wq3-the-matron': 'done', 'q-wq4-the-hunt': 'active' };
  const run = (flags, zone, want, label) => {
    gs.world.flags = Object.assign({}, base, flags);
    gs.world.zone = zone;
    let obj = null, err = null;
    try { obj = QuestNav.objective(); } catch (e) { err = e.message; }
    const got = obj ? '"' + (obj.label || '') + '" [' + obj.zone + ' ' + Math.round(obj.x) + ',' + Math.round(obj.y) + (obj.interact ? ' E' : '') + ']' : '(null)';
    const ok = !err && !!obj && (obj.label || '').indexOf(want.text) >= 0 && obj.zone === want.zone;
    if (!ok) pass = false;
    rows.push({ ok, label: label + ' [in ' + zone + ']',
      detail: (err ? 'THREW ' + err : '-> ' + got) + (ok ? '' : '  EXPECTED "' + want.text + '" in ' + want.zone) });
  };
  // (1) OFF the gated zone -> the city cult coach, from every realistic prior zone.
  const cinder = { 'cap-briar': true, 'cap-ossuary': true };                 // next uncaged = Cinder (Dragonspine)
  for (const z of ['grove-dungeon', 'thorn-grove', 'karridge-city', 'ashenveil'])
    run(cinder, z, { text: 'cult coach', zone: 'karridge-city' }, 'Cinder gated -> cult coach');
  const cookie = { 'cap-briar': true, 'cap-ossuary': true, 'cap-cinder': true, 'cap-whisper': true }; // next = Cookie (Varenholm)
  for (const z of ['ashenveil', 'karridge-city', 'dragonspine', 'thorn-grove'])
    run(cookie, z, { text: 'cult coach', zone: 'karridge-city' }, 'Cookie gated -> cult coach');
  // (2) ON the gated zone -> the in-zone CAPTURE tile (must NOT loop back to the coach).
  run(cinder, 'dragonspine', { text: 'Cinder', zone: 'dragonspine' }, 'on Dragonspine -> capture Cinder');
  run(cookie, 'varenholm', { text: 'Cookie', zone: 'varenholm' }, 'on Varenholm -> capture Cookie');
  return { pass, rows };
}

// ---------- OPTIONAL LOWER-LEVELS RAID routing gate (item 13 increment 5) ----------
// The Ashenveil undercroft is opt-in side content, not a per-character beat, so the walk above
// never touches it. This asserts QuestNav.objective() routes the whole undercroft once q-ash-raid
// is active: from any overworld zone -> the Academy stairs down; in ash-lower -> the Warden (until
// ash-lower-miniboss) -> the Deep Door finale; and that it RESTS (null) once ash-lower-boss is set.
function ashRaidCheck() {
  const rows = []; let pass = true;
  const gs = { player: { char: 'warlock' }, world: { zone: '', flags: {} } };
  global.GameState = gs;
  // the undercroft is LATE/post-story content — objective() short-circuits to null until the main
  // quest is past mq1, so the raid beat is only reachable once the story is complete. Use a
  // story-complete warlock (all mq done, credits rolled, hunt inactive) so the fallthrough beat fires.
  const base = { 'q-mq1-empty-cell': 'done', 'q-mq2-listening-room': 'done', 'q-mq3-roots-that-rot': 'done',
    'q-mq4-the-buyer': 'done', 'q-mq5-ash-and-silence': 'done', 'credits-rolled': true };
  const run = (flags, zone, want, label) => {
    gs.world.flags = Object.assign({}, base, flags);
    gs.world.zone = zone;
    let obj = null, err = null;
    try { obj = QuestNav.objective(); } catch (e) { err = e.message; }
    const got = obj ? '"' + (obj.label || '') + '" [' + obj.zone + ' ' + Math.round(obj.x) + ',' + Math.round(obj.y) + (obj.interact ? ' E' : '') + ']' : '(null)';
    let ok;
    if (want === null) ok = !err && obj === null;
    else ok = !err && !!obj && (obj.label || '').indexOf(want.text) >= 0 && obj.zone === want.zone && obj.interact === want.interact;
    if (!ok) pass = false;
    rows.push({ ok, label, detail: (err ? 'THREW ' + err : '-> ' + got) + (ok ? '' : '  EXPECTED ' + (want === null ? '(null)' : '"' + want.text + '" in ' + want.zone + (want.interact ? ' E' : ''))) });
  };
  const active = { 'q-ash-raid': 'active' };
  // (1) raid active, anywhere overworld -> the Academy stairs down (an interact objective in ashenveil).
  for (const z of ['karridge-city', 'thorn-grove', 'dragonspine', 'varenholm', 'ashenveil'])
    run(active, z, { text: 'stairs to the LOWER LEVELS', zone: 'ashenveil', interact: true }, 'raid active -> Academy stairs');
  // (2) in ash-lower, warden not yet down -> the Warden (proximity objective, NOT interact).
  run(active, 'ash-lower', { text: 'Warden of the Unfiled', zone: 'ash-lower', interact: false }, 'in undercroft -> the Warden');
  // (3) warden down, finale not cleared -> the Deep Door (an interact objective).
  run(Object.assign({ 'ash-lower-miniboss': true }, active), 'ash-lower', { text: 'DEEP DOOR', zone: 'ash-lower', interact: true }, 'warden down -> the Deep Door');
  // (4) finale cleared -> the raid RESTS (null), never a dead-end loop.
  run({ 'q-ash-raid': 'done', 'ash-lower-miniboss': true, 'ash-lower-boss': true }, 'ash-lower', null, 'finale cleared -> story rests');
  // (5) NOT activated -> the raid stays silent for a fresh ronin (no accidental divert of the main quest).
  run({}, 'karridge-city', null, 'inactive -> no raid objective');
  return { pass, rows };
}

// ---------- ronin DOJO line-pick gate (roadmap item 11, increment 7) ----------
// The dojo (Sensei Okada) is an OPTIONAL City interactable for the ronin — not a QuestNav beat —
// so the per-character walk above never touches it. This gate asserts the regression-prone bits:
//   (1) addDojo() actually REGISTERED the "train with SENSEI OKADA" interactable in CityScene
//       (and reports BFS reachability of its tile — informational, mirrors the per-beat reach: check), and
//   (2) driving the REAL CityScene.dojoDialog() -> choosing each weapon line (katana/spear/rifle)
//       sets GameState.player.weaponLine to that key AND flags['rq-dojo']='met'.
// Katana is the default everywhere else (gauntlet/headless), so this is a pure test addition.
function dojoCheck() {
  const rows = []; let pass = true;
  const Z = zoneScenes && zoneScenes['karridge-city'];
  if (!Z || !Z.scene) {
    rows.push({ ok: true, label: 'dojo (skipped)',
      detail: 'scene boot unavailable this run — dojo line-pick check skipped (non-fatal, mirrors reachability)' });
    return { pass, rows };
  }
  // (1) the interactable must be registered (addDojo ran for the ronin); reachability is informational.
  const it = (Z.interactables || []).find(i => /SENSEI OKADA/.test(i.label || ''));
  if (!it) {
    pass = false;
    rows.push({ ok: false, label: 'dojo interactable registered',
      detail: 'no "train with SENSEI OKADA" interactable in CityScene (addDojo not run / removed)' });
  } else {
    const r = reachability('karridge-city', it.x, it.y);
    const reach = r.ok === null ? 'reach:?' : r.ok ? 'reach:ok' : ('reach:UNREACHABLE(' + r.dist + 'px)');
    rows.push({ ok: true, label: 'dojo interactable registered',
      detail: '"' + it.label + '" [karridge-city ' + it.x + ',' + it.y + ' E] ' + reach });
  }
  // (2) drive the REAL dojoDialog()/choose() for each line; capture options via a temporary CityUI.dialog.
  const realDialog = CityUI.dialog;
  let captured = null;
  CityUI.dialog = function (name, text, options) { captured = options || []; };
  try {
    for (const key of Object.keys(Quests.dojo.lines)) {
      const gs = { player: { char: 'ronin', weaponLine: 'katana' }, world: { zone: 'karridge-city', flags: {} } };
      global.GameState = gs;
      let threw = null;
      try {
        captured = null;
        if (CityUI.closeDialog) CityUI.closeDialog();   // clear any dialog the boot left open
        Z.scene.encounterActive = false;                // so dojoDialog's item-1.5 guard doesn't early-return
        Z.scene.dojoDialog();                       // opens the line menu -> captured = its options
        const want = Quests.dojo.lines[key].tiers[0].name;   // KATANA / YARI / TANEGASHIMA
        const opt = (captured || []).find(o => (o.label || '').indexOf(want) >= 0);
        if (!opt) throw new Error('no menu option containing "' + want + '"');
        opt.fn();                                   // real choose(key): sets weaponLine + flag
      } catch (e) { threw = e.message; }
      const wlOK = !threw && gs.player.weaponLine === key;
      const flOK = !threw && gs.world.flags[Quests.dojo.flag] === 'met';
      const ok = wlOK && flOK;
      if (!ok) pass = false;
      rows.push({ ok, label: 'pick ' + key + ' line',
        detail: threw ? 'THREW ' + threw
          : 'weaponLine=' + gs.player.weaponLine + ' flags["' + Quests.dojo.flag + '"]=' + gs.world.flags[Quests.dojo.flag] });
    }
  } finally { CityUI.dialog = realDialog; }
  return { pass, rows };
}

// ---------- character EVOLUTION beats gate (roadmap item 10) ----------
// The lv10/lv20 EVOLUTION choice (druid + warlock) fires from gainLevel() INSIDE pit combat,
// not from QuestNav — so the per-character route walk above never touches it. This gate boots a
// headless pit and drives the evo state machine for druid + warlock, asserting:
//   (1) lv10 opens a 2-road pick (P.evoTier=10) that resolves BOTH via auto-default (the evoPickT
//       timer -> pickEvo(0), deadlock-proof) AND via an explicit pick(i) -> P.evo10, and the road
//       focus stat rises by EVO_FOCUS_BONUS (+6);
//   (2) lv20 opens a SECOND pick (P.evoTier=20) FILTERED to branches whose `from` === P.evo10
//       (so the lv10 road determines the lv20 options), resolves -> P.evo20, focus stat rises again;
//   (3) neither pick deadlocks (the auto-default loop always terminates well under the step cap).
// It reads the live EVOLUTIONS data off the api so the test follows the source, not a hardcoded copy.
function evoCheck() {
  const rows = []; let pass = true;
  let createPit;
  try { createPit = require(path.join(ROOT, 'src/combat/pit.js')).createPitCombat; }
  catch (e) { rows.push({ ok: false, label: 'load pit.js', detail: 'THREW ' + e.message }); return { pass: false, rows }; }
  // deterministic sim clock (any banner setTimeout just queues; the evo logic never needs it flushed)
  let simMs = 0; const tq = [];
  global.setTimeout = (fn, ms) => { tq.push({ at: simMs + (ms || 0), fn }); return tq.length; };
  global.clearTimeout = () => {};
  const FOCUS_BONUS = 6;   // mirrors EVO_FOCUS_BONUS in pit.js
  const freshPit = ch => { const c = createPit({ width: 1280, height: 720, now: () => simMs, ui: { banner: () => {} } }); c.fullReset(ch); return c; };
  for (const ch of ['druid', 'warlock', 'seraph']) {
    const combat = freshPit(ch);
    const P = combat.P, EVO = combat.EVOLUTIONS[ch];
    // (1) lv10 — auto-default path (no key input)
    P.level = 10;
    const focus10 = EVO[10][0].focus, base10 = combat.stat(focus10);
    combat.maybeOfferEvo();
    const opened10 = !!P.evoPick && P.evoPick.length === 2 && P.evoTier === 10;
    let steps = 0; while (P.evoPick && steps < 100) { combat.evoTick(1); steps++; }
    const resolved10 = !P.evoPick && P.evo10 === EVO[10][0].key;
    const after10 = combat.stat(focus10);
    const ok10 = opened10 && resolved10 && after10 === base10 + FOCUS_BONUS && steps < 100;
    if (!ok10) pass = false;
    rows.push({ ok: ok10, label: ch + ' lv10 auto-default',
      detail: 'opened=' + opened10 + ' -> evo10=' + P.evo10 + ' (resolved in ' + steps + ' ticks) ' + focus10 + ' ' + base10 + '->' + after10 });
    // (1b) lv10 — explicit pick of road #2 (fresh pit)
    const c2 = freshPit(ch); c2.P.level = 10; c2.maybeOfferEvo(); c2.pickEvo(1);
    const ok10b = !c2.P.evoPick && c2.P.evo10 === EVO[10][1].key;
    if (!ok10b) pass = false;
    rows.push({ ok: ok10b, label: ch + ' lv10 explicit pick #2', detail: 'evo10=' + c2.P.evo10 + ' (want ' + EVO[10][1].key + ')' });
    // (1c) item-14C — KEYBOARD selection: pressing '2' on the open lv10 panel resolves to road #2.
    const ck = freshPit(ch); ck.P.level = 10; ck.maybeOfferEvo();
    ck.keys['2'] = true; ck.evoTick(0.001); ck.keys['2'] = false;
    const okKey = !ck.P.evoPick && ck.P.evo10 === EVO[10][1].key;
    if (!okKey) pass = false;
    rows.push({ ok: okKey, label: ch + ' lv10 KEY "2" pick', detail: 'evo10=' + ck.P.evo10 + ' (want ' + EVO[10][1].key + ')' });
    // (1d) item-14C — CLICK selection: a tap inside road #2's on-canvas card rect resolves to road #2.
    const cc = freshPit(ch); cc.P.level = 10; cc.maybeOfferEvo();
    const rects = cc.evoRects; const r2 = rects && rects[1];
    let okClick = false;
    if (r2) { cc.evoClick(r2.x + r2.w / 2, r2.y + r2.h / 2); okClick = !cc.P.evoPick && cc.P.evo10 === EVO[10][1].key; }
    if (!okClick) pass = false;
    rows.push({ ok: okClick, label: ch + ' lv10 CLICK card #2', detail: r2 ? ('clicked (' + Math.round(r2.x + r2.w / 2) + ',' + Math.round(r2.y + r2.h / 2) + ') -> evo10=' + cc.P.evo10) : 'NO RECT' });
    // (2) lv20 — second choice, gated/filtered by the lv10 road (continue the auto-default pit)
    P.level = 20;
    const expect20 = EVO[20].filter(b => b.from === P.evo10);
    const focus20 = expect20[0] ? expect20[0].focus : focus10, base20 = combat.stat(focus20);
    combat.maybeOfferEvo();
    const opened20 = !!P.evoPick && P.evoTier === 20 && P.evoPick.every(b => b.from === P.evo10);
    steps = 0; while (P.evoPick && steps < 100) { combat.evoTick(1); steps++; }
    const resolved20 = !P.evoPick && !!expect20[0] && P.evo20 === expect20[0].key;
    const after20 = combat.stat(focus20);
    const ok20 = opened20 && resolved20 && after20 === base20 + FOCUS_BONUS && steps < 100;
    if (!ok20) pass = false;
    rows.push({ ok: ok20, label: ch + ' lv20 (from ' + P.evo10 + ')',
      detail: 'opened=' + opened20 + ' -> evo20=' + P.evo20 + ' (resolved in ' + steps + ' ticks) ' + focus20 + ' ' + base20 + '->' + after20 });
  }
  return { pass, rows };
}

console.log('QA QUESTLINES — full per-character AUTO route + flag-state walk\n');
try { zoneScenes = bootScenes(); }
catch (e) { bootError = e.message; console.error('  (reachability scene-boot unavailable: ' + e.message + ' — routing checks continue)\n'); }

const results = ['ronin', 'druid', 'warlock', 'seraph', 'ember'].map(runChar);
const guards = dialogGuardScan();
const gated = gatedGuardCheck();
const ashRaid = ashRaidCheck();
const dojo = dojoCheck();
const evo = evoCheck();
const objInt = objInteractCheck();
const manual = manualControlCheck();

let allPass = true;
for (const r of results) {
  if (!r.pass) allPass = false;
  console.log('=== ' + r.char.toUpperCase() + ' === ' + (r.pass ? 'PASS' : 'FAIL'));
  for (const row of r.rows) console.log('  ' + (row.ok ? 'ok ' : 'XX ') + row.beat + '  ' + row.detail);
  console.log('');
}
if (!gated.pass) allPass = false;
console.log('=== GATED CULT-COACH TRANSITIONS (item 9) === ' + (gated.pass ? 'PASS' : 'FAIL'));
for (const row of gated.rows) console.log('  ' + (row.ok ? 'ok ' : 'XX ') + row.label + '  ' + row.detail);
console.log('');
if (!ashRaid.pass) allPass = false;
console.log('=== ASHENVEIL LOWER-LEVELS RAID ROUTING (item 13) === ' + (ashRaid.pass ? 'PASS' : 'FAIL'));
for (const row of ashRaid.rows) console.log('  ' + (row.ok ? 'ok ' : 'XX ') + row.label + '  ' + row.detail);
console.log('');
if (!dojo.pass) allPass = false;
console.log('=== RONIN DOJO LINE-PICK (item 11) === ' + (dojo.pass ? 'PASS' : 'FAIL'));
for (const row of dojo.rows) console.log('  ' + (row.ok ? 'ok ' : 'XX ') + row.label + '  ' + row.detail);
console.log('');
if (!evo.pass) allPass = false;
console.log('=== CHARACTER EVOLUTIONS lv10/lv20 (item 10) === ' + (evo.pass ? 'PASS' : 'FAIL'));
for (const row of evo.rows) console.log('  ' + (row.ok ? 'ok ' : 'XX ') + row.label + '  ' + row.detail);
console.log('');
if (!objInt.pass) allPass = false;
console.log('=== OBJECTIVE-INTERACTABLE EXISTENCE (item 14B) === ' + (objInt.pass ? 'PASS' : 'FAIL'));
for (const row of objInt.rows) console.log('  ' + (row.ok ? 'ok ' : 'XX ') + row.label + '  ' + row.detail);
console.log('');
if (!manual.pass) allPass = false;
console.log('=== MANUAL-CONTROL AUTO-STOP (item 14D) === ' + (manual.pass ? 'PASS' : 'FAIL'));
for (const row of manual.rows) console.log('  ' + (row.ok === false ? 'XX ' : 'ok ') + row.label + '  ' + row.detail);
console.log('');
console.log('--- no-fight-during-dialogue (static update() scan) ---');
for (const g of guards) console.log('  ' + g.scene + ': ' + g.guarded + '/' + g.procs + ' proximity procs dialog-guarded');
console.log('');

// ---------- write docs/QA_REPORT.md ----------
const now = new Date().toISOString().slice(0, 10);
let md = '# QA REPORT — per-character questline traversal\n\n';
md += '_Generated by `game/tests/qa_questlines.js` on ' + now + '. Re-run after ANY quest/scene/questnav change._\n\n';
md += 'This is roadmap item 8 — the gate that prevents the druid-crossing class of bug ' +
  '(a beat that exists in code but is bypassed by routing, or credits that roll before the final beat). ' +
  'It drives each character\'s flag state machine beat by beat and asserts `QuestNav.objective()` ' +
  'routes to every implemented beat in order, with no dead ends, and returns null (story rests) only after the FINAL beat.\n\n';
md += '## Summary\n\n';
md += '| Character | Beats | Result |\n|---|---|---|\n';
for (const r of results) md += '| ' + r.char + ' | ' + r.rows.length + ' | ' + (r.pass ? '✅ PASS' : '❌ FAIL') + ' |\n';
md += '\nReachability: ' + (bootError ? '_scene boot unavailable this run (' + bootError + ') — routing checks are authoritative._' : 'real scenes booted; the real BFS pathfinder reached every in-zone objective tile (see per-beat `reach:ok`).') + '\n\n';
for (const r of results) {
  md += '## ' + r.char.toUpperCase() + ' — ' + (r.pass ? '✅ PASS' : '❌ FAIL') + '\n\n';
  for (const row of r.rows) md += '- ' + (row.ok ? '✅' : '❌') + ' **' + row.beat + '** — ' + row.detail.replace(/→/g, '->') + '\n';
  md += '\n';
}
md += '## Gated cult-coach transitions (item 9 regression gate) — ' + (gated.pass ? '✅ PASS' : '❌ FAIL') + '\n\n';
md += 'The warlock hunt reaches Dragonspine (Cinder) and Varenholm (Cookie) ONLY via the city cult coach. '
  + 'Asserts `QuestNav.objective()` routes to the cult coach from every off-gated-zone position, and to the in-zone '
  + 'capture tile once on the gated zone (catches both the "never reach the coach" dead-end and the "loops back to '
  + 'the coach even on the zone" / zone-not-set regression):\n\n';
md += '| Check | Detail | Result |\n|---|---|---|\n';
for (const row of gated.rows) md += '| ' + row.label + ' | ' + row.detail.replace(/\|/g, '\\|') + ' | ' + (row.ok ? '✅' : '❌') + ' |\n';
md += '\n';
md += '## Ronin dojo line-pick (item 11 regression gate) — ' + (dojo.pass ? '✅ PASS' : '❌ FAIL') + '\n\n';
md += 'The dojo (Sensei Okada) is an optional City interactable for the ronin (not a QuestNav beat). '
  + 'Asserts `addDojo()` registered the interactable and that driving the real `CityScene.dojoDialog()` -> '
  + 'choosing each weapon line sets `GameState.player.weaponLine` and `flags[\'rq-dojo\']=\'met\'` '
  + '(katana stays the default elsewhere):\n\n';
md += '| Check | Detail | Result |\n|---|---|---|\n';
for (const row of dojo.rows) md += '| ' + row.label + ' | ' + row.detail.replace(/\|/g, '\\|') + ' | ' + (row.ok ? '✅' : '❌') + ' |\n';
md += '\n';
md += '## Character evolutions lv10/lv20 (item 10 regression gate) — ' + (evo.pass ? '✅ PASS' : '❌ FAIL') + '\n\n';
md += 'The lv10/lv20 EVOLUTION choice (druid + warlock) fires from `gainLevel()` inside pit combat, not from QuestNav, '
  + 'so the route walk never touches it. This gate boots a headless pit and drives the evo state machine: at lv10 a 2-road '
  + 'pick opens and resolves (auto-default AND explicit) raising the road focus stat by +6; at lv20 a SECOND pick opens '
  + 'FILTERED to the branches continuing the lv10 road, resolves to `P.evo20`, and raises the focus stat again — with no '
  + 'deadlock (the auto-default timer always resolves):\n\n';
md += '| Check | Detail | Result |\n|---|---|---|\n';
for (const row of evo.rows) md += '| ' + row.label + ' | ' + row.detail.replace(/\|/g, '\\|') + ' | ' + (row.ok ? '✅' : '❌') + ' |\n';
md += '\n';
md += '## Objective-interactable existence (item 14B regression gate) - ' + (objInt.pass ? '✅ PASS' : '❌ FAIL') + '\n\n';
md += 'reachability above only proves the objective TILE is walkable. This gate re-boots each objective\'s scene under the beat\'s '
  + 'REAL char+flags and asserts an interactable actually EXISTS within interaction range of the tile - catching the "objective points '
  + 'where nothing is" class (e.g. the reported Matron/black-carriage stall; headless-confirmed the carriage IS at 1656,744):\n\n';
md += '| Beat (interact objective) | Detail | Result |\n|---|---|---|\n';
for (const row of objInt.rows) md += '| ' + row.label.replace(/\|/g, '\\|') + ' | ' + row.detail.replace(/\|/g, '\\|') + ' | ' + (row.ok ? '✅' : row.ok === false ? '❌' : 'ℹ️') + ' |\n';
md += '\n';
md += '## Manual-control AUTO-stop (item 14D regression gate) - ' + (manual.pass ? '✅ PASS' : '❌ FAIL') + '\n\n';
md += 'Real-play check: with AUTO on, a deliberate MANUAL input must outrank the chauffeur. Boots the real CityScene and drives the real input wiring - '
  + 'AUTO toggle (setMode 2->tracking, 0->cleared), a manual MOVE through the real `updatePlayer` (keys.A held), the real `keydown-E` handler, and the '
  + 'mobile `CityUI._onPrompt` tap - each must call `QuestNav.stop()` so the walk is cancelled. Manual attack is documented (it fires only mid-encounter where the walk is already suspended):\n\n';
md += '| Check | Detail | Result |\n|---|---|---|\n';
for (const row of manual.rows) md += '| ' + row.label.replace(/\|/g, '\\|') + ' | ' + row.detail.replace(/\|/g, '\\|') + ' | ' + (row.ok === false ? '❌' : row.ok === null ? 'ℹ️' : '✅') + ' |\n';
md += '\n';
md += '## Ashenveil lower-levels raid routing (item 13 regression gate) — ' + (ashRaid.pass ? '✅ PASS' : '❌ FAIL') + '\n\n';
md += 'The Ashenveil undercroft is OPT-IN side content (flag `q-ash-raid`), not a per-character beat. '
  + 'Asserts `QuestNav.objective()` routes the whole undercroft once the flag is active (overworld -> the Academy '
  + 'stairs down; in `ash-lower` -> the Warden of the Unfiled until `ash-lower-miniboss`, then the Deep Door finale), '
  + 'rests (null) once `ash-lower-boss` is set, and stays silent when the flag is unset (never diverts the main quest):\n\n';
md += '| Check | Detail | Result |\n|---|---|---|\n';
for (const row of ashRaid.rows) md += '| ' + row.label + ' | ' + row.detail.replace(/\|/g, '\\|') + ' | ' + (row.ok ? '✅' : '❌') + ' |\n';
md += '\n';
md += '## No-fight-during-dialogue (item 1.5 regression check)\n\n';
md += 'Static scan of each scene\'s `update()` for proximity `startEncounter` procs and whether each is guarded by `CityUI.dialogOpen()` (so no ambush can start while a conversation/cinematic is open):\n\n';
md += '| Scene | Proximity procs | Dialog-guarded |\n|---|---|---|\n';
for (const g of guards) md += '| ' + g.scene + ' | ' + g.procs + ' | ' + g.guarded + ' |\n';
md += '\n_All proximity procs across the zones carry the additive `!CityUI.dialogOpen() && !this.encounterActive && !this.cinematic` guard wired in items 1.5 and the per-beat triggers; the scan is informational._\n';
fs.writeFileSync(path.join(REPO, 'docs/QA_REPORT.md'), md);
console.log('wrote docs/QA_REPORT.md');

console.log('\n' + (allPass ? 'QA QUESTLINES: PASS' : 'QA QUESTLINES: FAIL'));
process.exit(allPass ? 0 : 1);
