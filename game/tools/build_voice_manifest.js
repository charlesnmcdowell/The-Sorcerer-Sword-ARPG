// Builds tools/voice_manifest.json — every voiced line in the game with a stable id.
// Run: node game/tools/build_voice_manifest.js
// The Python generator consumes this; the game computes the same ids at runtime (src/core/voice.js).

const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const { Quests } = require(path.join(root, 'src/world/quests.js'));
const { Companions } = require(path.join(root, 'src/world/companions.js'));
const { createPitCombat } = require(path.join(root, 'src/combat/pit.js'));
const { VoiceMan } = require(path.join(root, 'src/core/voice.js'));

const lines = [];
const seen = new Set();
function add(speaker, text, note, opts) {
  if (!text || text.includes('{N}')) return; // nickname-templated lines can't be pre-recorded
  // normalize EXACTLY like the runtime does (src/core/voice.js) so ids match in-game
  speaker = VoiceMan.speakerFor(speaker.toUpperCase());
  const id = VoiceMan.hash(speaker + '|' + text);
  if (seen.has(id)) return; seen.add(id);
  lines.push(Object.assign({ id, speaker, text, note: note || '' }, opts || {}));
}

// (Scope per Hiro: Bellow board taunts + death quotes stay TEXT-ONLY.)

// ---- character intro bios (Narrator — "tutorial" narration) ----
const pitSrc = fs.readFileSync(path.join(root, 'src/combat/pit.js'), 'utf8');
const bios = pitSrc.match(/const BIOS=\{[\s\S]*?\};/);
if (bios) for (const m of bios[0].matchAll(/\w+:'((?:[^'\\]|\\.)*)'/g))
  add('NARRATOR', m[1].replace(/\\'/g, "'"), 'character intro bio');

// ---- signposts & flavor reads: every signDialog('NAME','text') across the scenes ----
for (const scene of ['CityScene', 'GroveScene', 'DungeonScene', 'VarenholmScene', 'MountainScene']) {
  const src = fs.readFileSync(path.join(root, 'src/scenes', scene + '.js'), 'utf8');
  for (const m of src.matchAll(/signDialog\('((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)'/g))
    add(m[1].replace(/\\'/g, "'"), m[2].replace(/\\'/g, "'"), 'flavor: ' + scene);
}
// CityMap signposts
const { CityMap } = require(path.join(root, 'src/world/citymap.js'));
for (const s of CityMap.signs) add('SIGNPOST', s.text, 'city sign');
add('SIGNPOST', 'NORTH GATE — THORN GROVE. The escort is back; the road is open. Mind the wolves.', 'city sign (open gate)');

// ---- main quest dialogs ----
const I = Quests.innkeeper;
for (const k of ['rumorFree', 'rumorPaidOffer', 'rumorPaid', 'broke', 'done']) add('MARLOW', I[k], 'innkeeper');
const C = Quests.cult;
add('NARRATOR', C.campSign, 'camp'); add('NARRATOR', C.caravanSign, 'caravan');
add('THE QUARRY BOY', C.captive.freed, 'beat 3');
add('SHEN SAMA', C.shenSama.text, 'beat 3 cameo');
add('THE VEILED WOMAN', C.buyer.text1, 'beat 4'); add('THE VEILED WOMAN', C.buyer.text2, 'beat 4');
add('NARRATOR', C.buyer.choiceKeep, 'beat 4'); add('NARRATOR', C.buyer.choiceGive, 'beat 4');
for (const k of ['text1', 'text2', 'text3']) add('ANKUNYX', C.finale[k], 'finale');
for (const k of ['text1', 'text2', 'text3']) add('NARRATOR', C.finaleRonin[k], 'ronin finale');

// ---- Varenholm arc ----
const V = Quests.varenholm;
add('NARRATOR', V.coach, 'varenholm'); add('NARRATOR', V.performance1, 'varenholm');
add('NARRATOR', V.performance2, 'varenholm'); add('NARRATOR', V.performance2druid, 'varenholm druid');
add('NARRATOR', V.done, 'varenholm');
const K = V.cookie;
for (const k of ['greet', 'greetDruid', 'jobBrief', 'afterJob', 'afterCult', 'afterCultDruid']) add('COOKIE', K[k], 'cookie');

// ---- druid heritage variants (appended strings hash differently — record the combos) ----
const D = Quests.druid;
add('MARLOW', I.rumorPaid + D.marlowBeat, 'druid variant');
add('SHEN SAMA', C.shenSama.text + D.shenSamaAdd, 'druid variant');
add('THE VEILED WOMAN', C.buyer.text1 + D.vialHum, 'druid variant');
add('ANKUNYX', C.finale.text2 + ' ' + D.finaleGaze, 'druid variant');
add('NARRATOR', D.captureSign, 'druid capture'); add('NARRATOR', D.captureAfter, 'druid capture');

// ---- player character voices: their chosen lines, spoken on click ----
// Ronin deliberately uses Kenji's voice id (the egg, audible). Druid/Warlock designed.
for (const [key, t] of Object.entries(Quests.optTable)) {
  for (const [ch, sp] of [['ronin', 'PLAYER-RONIN'], ['druid', 'PLAYER-DRUID'], ['warlock', 'PLAYER-WARLOCK']]) {
    const v = t[ch]; if (!v) continue;
    for (const label of (Array.isArray(v) ? v : [v])) add(sp, label, 'player line: ' + key);
  }
}

// ---- THE SERAPHIM'S ROAD: Marlow variants, the Spine, five banners, the shrine ----
const SE = Quests.seraph;
// Marlow's seraph scenes mix narration with his lines -> force quote-splitting
add('MARLOW', SE.marlow.greet, 'seraph marlow', { split: true });
add('MARLOW', SE.marlow.answer, 'seraph marlow', { split: true });
add('MARLOW', SE.marlow.done, 'seraph marlow', { split: true });
add('THE TREATY STONE', SE.treatyStone.barred, 'spine trail');
add('THE TREATY STONE', SE.treatyStone.opens, 'spine trail');
add('THE SPINE TRAIL', SE.arrival, 'dragonspine arrival');
for (const c of SE.candidates) {
  add(c.name, c.intro, 'duel intro: ' + c.id);
  add(c.name, c.win, 'duel win: ' + c.id);
  add(c.name, c.recruited, 'recruited: ' + c.id);
  add(c.name, c.recruited + ' (The Skyreach shrine waits at the peak.)', 'recruited revisit: ' + c.id);
  add(c.name, 'The banner is already pledged elsewhere. The mountain knows it; so does this one. There is a kind of peace in losing to the WORTHIEST.', 'pledged elsewhere');
  add('THE SKYREACH SHRINE', c.ending, 'ending: ' + c.id);
}
add('THE SKYREACH SHRINE', SE.shrine.closed, 'shrine');
add('THE SKYREACH SHRINE', SE.shrine.frame, 'shrine');
add('THE SKYREACH SHRINE', SE.shrine.closing, 'shrine');
// the Seraphim's own spoken lines (quoted option labels only — actions stay silent)
for (const t of [
  SE.marlow.ask,
  '"Gently, then. You have my word, innkeeper."',
  '"To the peak."',
  ...SE.candidates.flatMap(c => [c.challenge, c.recruit, c.spare]),
]) if (t.trim().startsWith('"')) add('PLAYER-SERAPH', t, 'player line: seraph');

// ---- grove keeper (template-built in GroveScene; both variants) ----
const kBase = 'A wood elf with bark-braided hair sizes you up. "The pit-crowned. Word outruns you." ';
add('GROVE KEEPER', kBase + '"The line runs thin and the dead walk our edge. There is a camp by no road, west past the node — men who are not woodsmen, crates that are not goods. The Eldest will not act beyond Deepwood\'s shade. You might." (The trail sharpens in the next stretch of the hunt — Bucket 5.)', 'keeper');
add('GROVE KEEPER', kBase + '"Wolves grow bold and something fouls the dead. The guild posts coin for both. Earn the grove\'s trust, champion."', 'keeper');

// ---- companions ----
for (const [key, c] of Object.entries(Companions)) {
  add(c.name, c.greet, 'greet');
  for (const line of c.chat) add(c.name, line, 'chat');
  for (const k of ['recruitAsk', 'recruitYes', 'recruitNo', 'recruitVial', 'recruitBrew'])
    if (c[k]) add(c.name, c[k], 'recruit');
}

// ---- voice segmentation: characters speak ONLY their quoted dialogue; ----
// ---- descriptions of them and their surroundings belong to the Narrator ----
// Rules: NARRATOR lines stay whole. MARLOW speaks everything in his lines
// (his inner quotes are him quoting others). PLAYER-* lines are spoken whole,
// minus stage directions in (parentheses) and outer quotes. Everyone else:
// text outside "quotes" -> Narrator, inside -> the character. The generator
// synthesizes each segment with its voice and stitches one mp3 per line.
const SPEAK_WHOLE = new Set(['NARRATOR', 'MARLOW', 'SIGNPOST']);
function segment(l) {
  const src = l.vtext || l.text;
  if ((SPEAK_WHOLE.has(l.speaker) && !l.split) || l.speaker.startsWith('PLAYER-')) {
    if (l.speaker.startsWith('PLAYER-')) {
      const t = src.replace(/\(.*?\)/g, '').replace(/^"|"$/g, '').trim();
      if (t !== src) l.segs = [{ sp: l.speaker, t }];
    }
    return;
  }
  const parts = src.split('"');
  if (parts.length < 3) { // no quoted speech: it's all description -> Narrator
    if (l.speaker !== 'NARRATOR') l.segs = [{ sp: 'NARRATOR', t: src }];
    return;
  }
  const segs = [];
  for (let i = 0; i < parts.length; i++) {
    const t = parts[i].trim();
    if (!t) continue;
    segs.push({ sp: i % 2 === 1 ? l.speaker : 'NARRATOR', t });
  }
  // merge adjacent same-speaker segments
  const merged = [];
  for (const g of segs) {
    if (merged.length && merged[merged.length - 1].sp === g.sp) merged[merged.length - 1].t += ' ' + g.t;
    else merged.push({ ...g });
  }
  if (merged.length > 1 || merged[0].sp !== l.speaker) l.segs = merged;
}
for (const l of lines) segment(l);
const segged = lines.filter(l => l.segs).length;

// ---- merge performance scripts (v3 audio-tagged delivery; keyed by line id) ----
let perf = {};
try { perf = JSON.parse(fs.readFileSync(path.join(__dirname, 'performance_script.json'), 'utf8')); } catch (e) {}
let tagged = 0;
for (const l of lines) if (perf[l.id]) { l.vtext = perf[l.id]; tagged++; segment(l); }

const out = path.join(__dirname, 'voice_manifest.json');
const chars = lines.reduce((n, l) => n + (l.vtext || l.text).length, 0);
fs.writeFileSync(out, JSON.stringify({
  _readme: 'Generated by build_voice_manifest.js. Feed to generate_voices.py.',
  speakerSlots: {
    // game speaker -> tts_config.json character_voices slot
    'NARRATOR': 'Narrator', 'BELLOW': 'Bellow', 'MARLOW': 'Marlow',
    'ANKUNYX': 'Kenji', 'SHEN SAMA': 'Shen Sama',
    'THE QUARRY BOY': 'Quarry Boy', 'THE VEILED WOMAN': 'Veiled Woman',
    'BRAKKA': 'Brakka', 'VEXA': 'Vexa', 'DORIAN': 'Dorian',
    'FAELAR': 'Faelar', 'SYLVARA': 'Sylvara', 'PIPPA': 'Pippa',
    'COOKIE': 'Cookie', 'VERDANCE': 'Narrator', 'THE CAPTURE TEAM': 'Narrator',
    'PLAYER-RONIN': 'Kenji', 'PLAYER-DRUID': 'Druid', 'PLAYER-WARLOCK': 'Warlock',
    'PLAYER-SERAPH': 'Seraphim',
    'KARGOTH': 'Kargoth', 'SKARVA': 'Skarva', 'NIBNOB': 'Nibnob', 'AURVAETH': 'Aurvaeth',
    'GROVE KEEPER': 'Faelar',
    'THE PERFORMANCE': 'Narrator', 'THE COACH ROAD': 'Narrator', 'THE ROAD SOUTH': 'Narrator',
  },
  voiceHints: {
    'Bellow': 'booming gravel-voiced arena announcer, theatrical, middle-aged man',
    'Marlow': 'weathered male innkeeper, 60s, low conspiratorial tavern voice, warm but shrewd',
    'Quarry Boy': 'young man, shaken but defiant, rural accent',
    'Veiled Woman': 'woman 30s, desperate dignity, voice cracks under control',
    'Brakka': 'deep gruff orc mercenary, terse, dry',
    'Vexa': 'young woman, fast manic gleeful energy, smirking',
    'Dorian': 'earnest formal knight, warm baritone, self-deprecating',
    'Faelar': 'serene elf, unhurried, dry wit, ageless',
    'Sylvara': 'cold precise aristocratic woman, cutting consonants',
    'Pippa': 'bright halfling woman, relentlessly cheerful, quick',
  },
  count: lines.length, totalChars: chars, lines,
}, null, 2));
console.log(`voice_manifest.json: ${lines.length} lines (${tagged} performance-tagged, ${segged} narrator-split), ${chars} chars (~$${(chars * 0.00015).toFixed(2)}-$${(chars * 0.0003).toFixed(2)} ElevenLabs)`);
if (process.argv.includes('--list')) for (const l of lines) console.log(l.id, '|', l.speaker, '|', l.text.slice(0, 60));
