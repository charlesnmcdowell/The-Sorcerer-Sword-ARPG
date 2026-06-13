// voicetrace.js — traces every play() call through the SERAPH duel chain (the one
// Hiro reported dropping out) and the warlock epilogue, asserting each voiced line
// actually reaches a play() on an existing clip (not silently stop()'d or lost in
// the pending queue). Catches "sometimes the voice doesn't play" races.
// Usage: node game/tests/voicetrace.js

const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');

const nodes = {};
function mk(id) { return { id, style: {}, _html: '', textContent: '', children: [], _l: {},
  classList: { add() {}, remove() {}, contains() { return false; } },
  addEventListener(t, f) { (this._l[t] = this._l[t] || []).push(f); }, removeEventListener() {},
  appendChild(c) { this.children.push(c); }, querySelector() { return mk(); }, querySelectorAll() { return []; },
  firstChild: { nodeValue: '' }, setAttribute() {}, focus() {}, getContext() { return new Proxy({}, { get: () => () => {} }); } }; }
global.window = global;
global.document = { getElementById: id => nodes[id] || (nodes[id] = mk(id)), querySelector: () => mk(), querySelectorAll: () => [], createElement: () => mk(), readyState: 'complete', addEventListener() {} };
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.requestAnimationFrame = () => {};

const have = new Set(fs.readdirSync(path.join(root, 'assets/voice')).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));
const played = [];
const evq = [];
global.Audio = class {
  constructor(src) { this.id = src.split('/').pop().replace('.mp3', ''); this.volume = 1; this.ended = false; this.paused = false; this._l = {}; this._ok = have.has(this.id); }
  addEventListener(t, f) { (this._l[t] = this._l[t] || []).push(f); }
  play() { played.push({ id: this.id, ok: this._ok });
    evq.push(() => { const ev = this._ok ? 'ended' : 'error'; if (ev === 'ended') { this.ended = true; this.paused = true; } for (const f of this._l[ev] || []) f(); });
    return { catch() {} }; }
  pause() { this.paused = true; }
};
const realSetTimeout = setTimeout;
global.setTimeout = (fn) => { evq.push(fn); return 0; };
global.clearTimeout = () => {};
function settle() { let n = 0; while (evq.length && n++ < 5000) evq.shift()(); }

for (const f of ['src/core/money.js', 'src/core/dialog.js', 'src/core/music.js', 'src/core/voice.js'])
  (0, eval)(fs.readFileSync(path.join(root, f), 'utf8'));
const { Quests } = require(path.join(root, 'src/world/quests.js')); global.Quests = Quests;
global.GameState = { player: { char: 'seraph', nickname: 'THE VISITOR' }, world: { flags: {}, questCounts: {} } };
global.MusicMan = { vol: 0.55, current: { volume: 0.55 }, muted: false };
global.QuestNav = { mode: 0 };
CityUI.init();

let fails = 0;
// model the real flow: open dialog (NPC speaks) ; user clicks (player speaks) then fn opens next dialog.
const open = (name, text) => { CityUI.dialog(name, text, [{ label: 'x', fn() {} }]); settle(); };
const clickThenOpen = (label, name, text) => { VoiceMan.sayPlayer(label); settle(); if (name) open(name, text); };

function expectPlayed(text, speakerName, what) {
  const sp = VoiceMan.speakerFor(speakerName.toUpperCase());
  const id = VoiceMan.hash(sp + '|' + text);
  const wasPlayed = played.some(p => p.id === id);
  const exists = have.has(id);
  if (!exists) { console.log(`  (skip) ${what}: clip not generated yet [${id}]`); return; }
  if (!wasPlayed) { console.log(`  FAIL ${what}: clip EXISTS but play() never called [${id}]`); fails++; }
  else console.log(`  ok   ${what}`);
}

console.log('VOICETRACE — Seraphim duel chains (all 5) + warlock epilogue\n');
for (const c of Quests.seraph.candidates) {
  played.length = 0; VoiceMan.stop(); settle();
  console.log(c.name.split(',')[0] + ':');
  open(c.name, c.intro);                          expectPlayed(c.intro, c.name, 'duel intro speaks');
  clickThenOpen(c.challenge, c.name, c.win);      expectPlayed(c.win, c.name, 'duel win speaks (after challenge)');
  clickThenOpen(c.recruit, c.name, c.recruited);  expectPlayed(c.recruited, c.name, 'recruited speaks (after recruit line)');
}

// warlock epilogue: Haldric -> player -> Sallow -> player -> fight (dialog closes)
{ GameState.player.char = 'warlock'; played.length = 0; VoiceMan.stop(); settle();
  const W = Quests.warlockEpilogue;
  if (W) {
    console.log('\nWARLOCK EPILOGUE:');
    open('SER HALDRIC', W.ambush.haldric);         expectPlayed(W.ambush.haldric, 'SER HALDRIC', 'Haldric speaks');
    clickThenOpen('"You\'ve brought a WRIT to a portal fight, Ser."', 'INQUISITOR SALLOW', W.ambush.sallow);
    expectPlayed(W.ambush.sallow, 'INQUISITOR SALLOW', 'Sallow speaks after player line');
  }
}

console.log('\n' + (fails ? `VOICETRACE: FAIL (${fails})` : 'VOICETRACE PASS — every existing clip on these paths fires'));
process.exit(fails ? 1 : 0);
