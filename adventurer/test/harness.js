// Node harness: loads data + core files into globalThis so tests run headless.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const FILES = [
  'js/data/constants.js', 'js/data/skills.js', 'js/data/campaign_skills.js', 'js/data/campaign_data.js', 'js/data/campaign_dialogue.js', 'js/data/enemies.js',
  'js/data/names.js', 'js/data/tutorial.js', 'js/data/registry.js',
  'js/data/dialogue.js', 'js/data/dialogue_hiro.js',
  'js/core/rng.js', 'js/core/util.js', 'js/core/skillsys.js', 'js/core/character.js',
  'js/core/housing.js',
  'js/core/combat.js', 'js/core/combat_ai.js', 'js/core/combat_effects.js', 'js/core/relationships.js', 'js/core/courtship.js', 'js/core/hiro.js', 'js/core/vault.js',
  'js/core/quests.js', 'js/core/party.js', 'js/core/divine.js', 'js/core/death.js',
  'js/core/world.js', 'js/core/save.js', 'js/core/campaign.js', 'js/core/game.js',
];

function load() {
  delete globalThis.ADV;
  for (const f of FILES) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    const code = fs.readFileSync(p, 'utf8');
    try { vm.runInThisContext(code, { filename: f }); }
    catch (e) { console.error('LOAD FAIL', f, e.message); throw e; }
  }
  return globalThis.ADV;
}

// In-memory localStorage stand-in for headless tests.
function memBackend() {
  return { _m: {}, getItem(k) { return this._m[k] || null; }, setItem(k, v) { this._m[k] = v; }, removeItem(k) { delete this._m[k]; } };
}

// The harness must load the same data/core files, in the same order, as index.html.
function checkScriptOrder() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const tags = [...html.matchAll(/<script src="(js\/(?:data|core)\/[^"]+)"><\/script>/g)].map(m => m[1]);
  const missing = tags.filter(t => !FILES.includes(t)).concat(FILES.filter(f => !tags.includes(f)));
  return { ok: !missing.length && tags.join() === FILES.join(), missing, order: tags.join() === FILES.join() };
}

module.exports = { load, memBackend, checkScriptOrder, FILES };
