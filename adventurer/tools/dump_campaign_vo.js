// Dump the name-free spoken form of every campaign line (+ exit lines) as JSON
// for tools/gen_campaign_voices.py, and check for name/token leaks.
'use strict';
const path = require('path');
const { load } = require(path.join(__dirname, '..', 'test', 'harness'));
const ADV = load();
const out = {};
let n = 0;
// Spoken form: {target} dropped; third-person tokens become the rival's
// pronouns (or a plain "they" when the rival speaks about an enemy).
function spoken(fid, who, line) {
  if (line.v) return line.v;
  const f = ADV.DATA.FACTIONS[fid];
  const rival = ADV.DATA.CAMPAIGN_CHARS[f.rival];
  const self = who === f.rival;
  const P = self ? ['they', 'them', 'their'] : rival.sex === 'f' ? ['she', 'her', 'her'] : ['he', 'him', 'his'];
  return line.t.replace(/,\s*\{target\}/g, '').replace(/\{target\}[.!?]\s*/g, '').replace(/\{target\},?\s*/g, '')
    .replace(/\{they\}/g, P[0]).replace(/\{them\}/g, P[1]).replace(/\{their\}/g, P[2])
    .replace(/\s+([,.!?])/g, '$1').replace(/^\s+/, '');
}
for (const [fid, chars] of Object.entries(ADV.DATA.CAMPAIGN_DIALOGUE)) for (const [who, beats] of Object.entries(chars)) {
  out[who] = out[who] || {};
  for (const [k, lines] of Object.entries(beats)) { out[who][k] = lines.map(l => spoken(fid, who, l)); n += lines.length; }
}
for (const [id, c] of Object.entries(ADV.DATA.CAMPAIGN_CHARS)) if (c.exitLines) { out[id] = out[id] || {}; out[id].exit = c.exitLines; n += c.exitLines.length; }
// The second campaign keeps its lines in its own table and has its own
// name-free renderer (add-on §2). Vane-Kessler appears under two factions and
// merges into one folder, which is the point of him.
for (const [fid, chars] of Object.entries(ADV.DATA.CAMPAIGN2_DIALOGUE || {})) {
  for (const [who, beats] of Object.entries(chars)) {
    out[who] = out[who] || {};
    for (const [k, lines] of Object.entries(beats)) {
      out[who][k] = lines.map(l => ADV.DATA.campaign2VoiceText(fid, who, l));
      n += lines.length;
    }
  }
}
// The god line belongs to no faction (§7): its cutscenes carry no tokens.
for (const [who, lines] of Object.entries(ADV.DATA.GOD_LINE_DIALOGUE || {})) {
  out[who] = out[who] || {};
  out[who].open = lines.map(l => String(l.t || l)
    .replace(/,\s*\{target\}/g, '').replace(/\{target\}[.!?]\s*/g, '').replace(/\{target\},?\s*/g, '')
    .replace(/\s+([,.!?])/g, '$1').replace(/^\s+/, ''));
  n += lines.length;
}
// The player's name must never be spoken: no unfilled token may survive.
// (Fixed campaign names are the author's to voice — they never change.)
let leaks = 0;
for (const [who, b] of Object.entries(out)) for (const [k, ls] of Object.entries(b)) ls.forEach((t, i) => {
  if (/\{/.test(t)) { leaks++; console.log('TOKEN LEAK', who, k, i + 1, t); }
});
require('fs').writeFileSync(process.argv[2] || '/tmp/campaign_vo.json', JSON.stringify(out, null, 1));
console.log('lines', n, 'leaks', leaks);
process.exit(leaks ? 1 : 0);
