// voicechain.js — exercises VoiceMan through realistic dialog chains (NPC line ->
// player option -> next NPC line) with the REAL clip set, including missing clips
// and unvoiced ad-hoc option labels. Asserts the module never wedges: after every
// chain, music returns to full volume and player/pending state is clean.
// Usage: node game/tests/voicechain.js

const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = {};
const { VoiceMan } = require(path.join(root, 'src/core/voice.js'));
global.window.VoiceMan = VoiceMan;
const MUSIC_VOL = 0.55;
global.MusicMan = global.window.MusicMan = { current: { volume: MUSIC_VOL }, vol: MUSIC_VOL };
global.GameState = global.window.GameState = { player: { char: 'druid' } };

const have = new Set(fs.readdirSync(path.join(root, 'assets/voice')).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));
const Q = [];
global.Audio = class {
  constructor(src) { this.volume = 1; this.ended = false; this.paused = false; this._l = {};
    this._ok = have.has(src.split('/').pop().replace('.mp3', '')); }
  addEventListener(t, f) { (this._l[t] = this._l[t] || []).push(f); }
  play() { const ev = this._ok ? 'ended' : 'error';
    Q.push(() => { if (ev === 'ended') { this.ended = true; this.paused = true; } for (const f of this._l[ev] || []) f(); });
    return { catch() {} }; }
  pause() { this.paused = true; }
};
// drain the async audio events the way a browser eventually would
function settle() { let n = 0; while (Q.length && n++ < 1000) Q.shift()(); }

const { Quests } = require(path.join(root, 'src/world/quests.js'));
let fails = 0;
function assertClean(label) {
  settle();
  const okMusic = Math.abs(MusicMan.current.volume - MUSIC_VOL) < 1e-6;
  const okState = !VoiceMan._playerActive && !VoiceMan._pending && !VoiceMan.current;
  if (!okMusic || !okState) {
    fails++;
    console.log(`  FAIL after ${label}: music=${MusicMan.current.volume} playerActive=${VoiceMan._playerActive} pending=${!!VoiceMan._pending} current=${!!VoiceMan.current}`);
  } else console.log(`  ok  ${label}`);
}

// model CityUI: opening a dialog speaks the NPC line; clicking an option speaks the
// player label then runs the next step (which usually opens the next dialog).
const open = (name, text) => { if (text && text !== '...') VoiceMan.say(name, text); };
const click = (label, next) => { VoiceMan.sayPlayer(label); if (next) next(); settle(); };

console.log('VOICECHAIN — realistic dialog flows, missing clips included\n');

for (const char of ['druid', 'ronin', 'warlock', 'seraph']) {
  GameState.player.char = char;
  VoiceMan.stop(); VoiceMan._missing = {}; MusicMan.current.volume = MUSIC_VOL;
  console.log(char.toUpperCase() + ':');
  const I = Quests.innkeeper, C = Quests.cult, D = Quests.druid, opt = k => Quests.opt ? null : null;
  const pick = (k, ch) => { const t = Quests.optTable[k]; const v = t && (t[ch] || t.default); return Array.isArray(v) ? v[0] : v; };

  // inn: greet -> ask -> rumorFree -> pay -> rumorPaid
  open('MARLOW', char === 'seraph' ? Quests.seraph.marlow.greet : I.greet.replace('{N}', 'THE BLUR'));
  click(char === 'seraph' ? Quests.seraph.marlow.ask : pick('marlowAsk', char),
    () => open('MARLOW', char === 'seraph' ? Quests.seraph.marlow.answer : I.rumorFree));
  assertClean('inn chain');

  if (char !== 'seraph') {
    // grove: quarry boy -> shen sama (+druid variant)
    open('THE QUARRY BOY', C.captive.freed);
    click(pick('captiveGo', char), () => open('A STRANGER IN THE TREELINE', C.shenSama.text + (char === 'druid' ? D.shenSamaAdd : '')));
    assertClean('grove chain');

    // buyer: t1 -> "Who sells it?" (UNVOICED label) -> t2 (MISSING clip) -> keep/give
    open('THE VEILED WOMAN', C.buyer.text1 + (char === 'druid' ? D.vialHum : ''));
    click('"Who sells it?"', () => open('THE VEILED WOMAN', C.buyer.text2));
    click(pick('buyerKeep', char), () => open('THE VEILED WOMAN', C.buyer.choiceKeep));
    assertClean('buyer chain (missing t2 + unvoiced label)');
  }

  // a clean signpost afterward must still speak (proves voice not wedged)
  const sign = require(path.join(root, 'src/world/citymap.js')).CityMap.signs[0];
  VoiceMan.say('SIGNPOST', sign.text); settle();
  const spoke = VoiceMan._missing[VoiceMan.hash('NARRATOR|' + sign.text)] !== true;
  console.log('  ' + (spoke ? 'ok  ' : 'FAIL ') + 'signpost speaks after the chain' + (spoke ? '' : ' <-- VOICE WEDGED'));
  if (!spoke) fails++;
  VoiceMan.stop(); assertClean('final stop');
  console.log('');
}

console.log(fails ? `VOICECHAIN: FAIL (${fails})` : 'VOICECHAIN PASS');
process.exit(fails ? 1 : 0);
