#!/usr/bin/env node
/* =====================================================================
 * game3d PARITY LINT  —  Dragon's-Crown visual-parity static gate
 * ---------------------------------------------------------------------
 * Hiro's standing benchmark for the 2.5D uplift is DRAGON'S CROWN. The
 * playtest agent runs in a sandbox and CANNOT render the WebGL scene to
 * pixels, so this script asserts — statically, over game3d/arena.html —
 * the CODE-LEVEL CAUSES of the visual flaws Hiro keeps catching. Each
 * rule maps 1:1 to a rule in the playtest SKILL (Lane B, rules 1-6).
 *
 * Severity -> exit code:
 *   P1 / P2 violation  -> a FAIL is recorded, script exits NON-ZERO.
 *   P3 (atmosphere)    -> a WARN is printed, does NOT fail the gate.
 *
 * TRUNCATION GUARD (OneDrive mount hazard): the OneDrive sandbox mount
 * can serve a tail-truncated copy of arena.html. If the file is missing
 * its closing <html>/Phaser.Game tail, the lint is INDETERMINATE — it
 * prints a notice and exits 0 rather than emitting false failures. Run
 * it from a clean checkout / fresh chat to get a real verdict.
 *
 * Usage:  node game3d/tools/parity_lint.js [path/to/arena.html]
 * ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ARENA = process.argv[2] || path.join(__dirname, '..', 'arena.html');
let src;
try { src = fs.readFileSync(ARENA, 'utf8'); }
catch (e) { console.error('PARITY LINT: cannot read ' + ARENA + ' — ' + e.message); process.exit(2); }

const has = (re) => re.test(src);

// --- TRUNCATION GUARD ----------------------------------------------------
// The real file ends with `new Phaser.Game({...})` then `</html>`. If the
// boot config is missing the mount served a truncated tail -> bail clean.
const lineCount = src.split('\n').length;
if (!has(/new Phaser\.Game/) || !has(/<\/html>/)) {
  console.log('PARITY LINT: INDETERMINATE — arena.html looks TRUNCATED ' +
    '(' + lineCount + ' lines, no Phaser.Game/</html> tail). OneDrive mount ' +
    'hazard. Re-run from a clean checkout. Skipping (exit 0).');
  process.exit(0);
}

const fails = [];   // P1/P2 -> fail the gate
const warns = [];   // P3    -> report only
const ok = [];

function check(id, sev, cond, msg) {
  if (cond) { ok.push(id); return; }
  (sev === 'P3' ? warns : fails).push('[' + sev + '] ' + id + ' — ' + msg);
}

// === RULE 1 — CANVAS FILLS THE WINDOW (the "huge black margin" bug) ======
// Phaser scale must be FIT or RESIZE, the game width/height must be tied to
// the viewport (NOT a small fixed size), and autoCenter must be set.
check('rule1.scale-mode', 'P1',
  has(/Phaser\.Scale\.(FIT|RESIZE)/),
  'Phaser scale.mode must be FIT or RESIZE (found neither).');
check('rule1.viewport-sized', 'P1',
  has(/window\.innerWidth/) && has(/window\.innerHeight/) &&
  has(/width\s*:\s*VIEW_W/) && has(/height\s*:\s*VIEW_H/),
  'Game width/height must derive from window.innerWidth/innerHeight (VIEW_W/VIEW_H), not a fixed size.');
check('rule1.autocenter', 'P1',
  has(/autoCenter\s*:\s*Phaser\.Scale\.CENTER/),
  'scale.autoCenter must be set (CENTER_BOTH).');
// Soft hardening: explicit canvas CSS. Not required when game size == window
// size + FIT (no letterbox), but belt-and-suspenders against odd parents.
check('rule1.canvas-css', 'P3',
  has(/canvas\{[^}]*100vw/) && has(/canvas\{[^}]*100vh/),
  'canvas CSS lacks explicit width:100vw;height:100vh (OK today because game size == window + FIT; add to harden).');

// === RULE 2 — CHARACTER-TO-BACKGROUND SCALE ==============================
// Hero ~25-38% of screen height. HERO_PX must scale with the viewport, and
// per-actor target heights must be ratios, not raw PNG dims.
check('rule2.hero-scales-with-view', 'P2',
  has(/HERO_PX\s*=[^\n]*VIEW_H/),
  'HERO_PX must scale with VIEW_H (a fixed px value shrinks the hero on tall windows).');
check('rule2.target-height-map', 'P2',
  has(/SPRITE_TARGET_H\s*=/) && has(/warlock_idle\s*:\s*1/),
  'SPRITE_TARGET_H ratio map (warlock_idle baseline 1.0) must exist so foes scale by world height, not PNG dims.');

// === RULE 3 — 3-LAYER PARALLAX BACKDROP =================================
// far (amphitheater + crowd) BEHIND, floor BELOW actors, fg (pillars/braziers)
// OVER. All three loaded; depth order far < floor < actors < fg.
check('rule3.three-layers-loaded', 'P1',
  has(/load\.image\(\s*['"]bg_far['"]/) &&
  has(/load\.image\(\s*['"]bg_floor['"]/) &&
  has(/load\.image\(\s*['"]bg_fg['"]/),
  'All three backdrop layers (bg_far/bg_floor/bg_fg) must be preloaded.');
check('rule3.far-behind', 'P1',
  has(/bg_far['"]\s*\)\.setDepth\(\s*-\d/),
  'bg_far (crowd/amphitheater) must be drawn at a NEGATIVE depth (behind actors).');
check('rule3.fg-over-actors', 'P1',
  has(/bg_fg['"]\s*\)\.setDepth\(\s*\d{3,}/),
  'bg_fg (pillars/braziers) must be drawn OVER the actors (large positive depth).');

// === RULE 4 — DC ATMOSPHERE FX (lower severity) =========================
// Brazier point-lights are in; bloom/vignette/animated god-rays/embers are
// the planned next increment. Report as P3 so the build schedule sees them.
check('rule4.light2d-braziers', 'P2',
  has(/setPipeline\(\s*['"]Light2D['"]\s*\)/) && has(/braz/i),
  'Light2D pipeline + brazier point-lights must be present (core DC torch-lighting).');
check('rule4.bloom-vignette', 'P3',
  has(/Bloom/i) || has(/Vignette/i) || has(/postFX|PostFX/),
  'No Bloom/Vignette camera post-FX (planned FEEDBACK #6 B-2) — adds the Vanillaware painterly glow.');
check('rule4.embers', 'P3',
  has(/ember[A-Z_]/) || has(/risingEmber|emberParticle|dustMote/),
  'No rising-ember / dust-mote ambient particles (planned) — pit reads static without them.');

// === RULE 5 — TOUCH / MOBILE CONTROLS (Hiro keeps asking) ===============
// On-screen virtual stick (#stickBase/#stickNub) + verb buttons (.btn) wired
// so a phone player can move and use every verb. Absent = P1.
check('rule5.virtual-stick', 'P1',
  (has(/stickBase/) && has(/stickNub/)) || has(/touchstick/),
  'No on-screen virtual stick (#stickBase/#stickNub or touchstick.js) — a phone player cannot MOVE.');
check('rule5.verb-buttons', 'P1',
  has(/class\s*=\s*["'][^"']*\bbtn\b/) || has(/<button/),
  'No on-screen verb buttons (Attack/Dodge/Special/Summon/Hex/Transform) — phone player cannot use most verbs.');

// === RULE 6 — CAMERA FRAMING ===========================================
// Whole pit band + actors visible, not cropped. Ground line in a sane band
// and no large camera zoom that would crop the scene.
check('rule6.ground-band', 'P2',
  has(/SIDEON_GROUND_FR\s*=\s*0\.(7|8|9)/),
  'SIDEON_GROUND_FR (feet line) must sit in the 0.7-0.95 band so the full pit + actors frame in view.');
const zoomM = src.match(/cameras\.main\.setZoom\(\s*([\d.]+)/);
check('rule6.no-crop-zoom', 'P2',
  !zoomM || parseFloat(zoomM[1]) <= 1.05,
  'camera.setZoom > 1.05 crops the pit band — keep the whole band + actors visible.');

// === RULE 7 — VISUAL-AUDIT INSTRUMENTATION (auditor must not be BLIND) ===
// The headless DC-parity auditor (tools/visual_audit.py) scores warlock_scale,
// backdrop_layers and lighting_fx by reading window.__AUDIT__ off the live page.
// If the build never publishes it, those three checks default to FAIL forever
// even when the scene is correct (caught 2026-06-27: 2 phantom P1 fails). The
// render loop MUST set window.__AUDIT__ with warlockPctH (number), layers
// {far,floor,fg} and fx {...}. P1 because it makes the whole visual gate lie.
check('rule7.audit-hook-present', 'P1',
  has(/window\.__AUDIT__\s*=/),
  'arena.html must publish window.__AUDIT__ each frame or the visual auditor is BLIND (warlock_scale/backdrop_layers/lighting_fx default to FALSE-FAIL).');
check('rule7.audit-fields', 'P1',
  has(/warlockPctH\s*:/) && has(/layers\s*:/) && has(/fx\s*:/),
  'window.__AUDIT__ must carry warlockPctH + layers + fx (the three fields visual_audit.py reads); a partial hook leaves checks stuck on "unknown".');

// === RULE 8 — ANIM-COVERAGE INSTRUMENTATION (auditor anim_coverage = BLIND) ===
// The auditor's anim_coverage check (P1) scores "every on-screen entity x action
// has a >=3-frame/rigged animation" by reading window.__AUDIT__.entities = [{type,
// action, anim:{rigged,frames}}]. The render hook publishes warlockPctH/layers/fx
// but NOT entities, so anim_coverage defaults to FAIL("unknown") forever (caught
// run-I 2026-06-28, Finding V-I1). The hook MUST also enumerate live entities with
// their anim {rigged,frames}. P1 because it leaves a P1 visual gate permanently
// unscored (and masks that the cast is still 1-frame stills, not DC-rigged).
check('rule8.audit-entities-hook', 'P1',
  has(/__AUDIT__[\s\S]{0,400}?entities\s*:/) || has(/window\.__AUDIT__\.entities\s*=/),
  'window.__AUDIT__ must also publish entities:[{type,action,anim:{rigged,frames}}] or the auditor anim_coverage P1 is BLIND (stuck on "unknown"=FAIL).');
check('rule8.audit-entities-fields', 'P1',
  has(/\brigged\b/) && has(/\bframes\b/),
  'each window.__AUDIT__.entities entry must carry anim {rigged, frames} so anim_coverage can verify >=3-frame/rigged motion per entity x action.');

// --- REPORT --------------------------------------------------------------
console.log('PARITY LINT — game3d/arena.html  (' + lineCount + ' lines)');
console.log('  PASS: ' + ok.length + '  /  FAIL: ' + fails.length + '  /  WARN: ' + warns.length);
ok.forEach(id => console.log('  PASS  ' + id));
warns.forEach(w => console.log('  WARN  ' + w));
fails.forEach(f => console.log('  FAIL  ' + f));
if (fails.length) {
  console.log('\nPARITY LINT FAILED — ' + fails.length + ' DC-parity violation(s). See game3d/PLAYTEST_FINDINGS_VISUAL.md.');
  process.exit(1);
}
console.log('\nPARITY LINT GREEN' + (warns.length ? ' (with ' + warns.length + ' atmosphere warning(s))' : '') + '.');
process.exit(0);
