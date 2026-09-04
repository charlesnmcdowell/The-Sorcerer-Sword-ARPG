#!/usr/bin/env node
// Guard against silent feature loss.
//
// This project has already lost a day's work to a stale copy being written over
// the working tree: ~20 files quietly reverted, ~857 lines gone, and the test
// suite still looked green because the tests had been reverted too.
//
// Usage:
//   node tools/symbol_inventory.js snapshot            -> writes tools/.inventory.json
//   node tools/symbol_inventory.js check               -> compares now against it
//
// `check` fails loudly if any top-level function disappeared or any file lost
// more than a few lines. Run snapshot before you start, check after every task.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const DIRS = ['js/data', 'js/core', 'js/ui'];
const STORE = path.join(__dirname, '.inventory.json');

// Top-level definitions: `Foo.bar = function`, `Foo.bar = (a) =>`, `function bar(`
const PATTERNS = [
  /^([A-Za-z_$][\w.$]*)\s*=\s*function/gm,
  /^([A-Za-z_$][\w.$]*)\s*=\s*(?:async\s*)?\(/gm,
  /^function\s+([A-Za-z_$][\w$]*)/gm,
  /^\s{0,2}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/gm,   // class/object methods
];

function scan() {
  const out = {};
  for (const d of DIRS) {
    const dir = path.join(ROOT, d);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.js'))) {
      const rel = d + '/' + f;
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      const syms = new Set();
      for (const re of PATTERNS) {
        re.lastIndex = 0;
        let m; while ((m = re.exec(src))) if (m[1] && !/^(if|for|while|switch|catch|function|return|const|let|var)$/.test(m[1])) syms.add(m[1]);
      }
      out[rel] = { lines: src.split('\n').length, symbols: [...syms].sort() };
    }
  }
  return out;
}

const mode = process.argv[2];
if (mode === 'snapshot') {
  const inv = scan();
  fs.writeFileSync(STORE, JSON.stringify(inv, null, 1));
  const n = Object.values(inv).reduce((s, v) => s + v.symbols.length, 0);
  console.log(`snapshot: ${Object.keys(inv).length} files, ${n} symbols -> tools/.inventory.json`);
  process.exit(0);
}

if (mode === 'check') {
  if (!fs.existsSync(STORE)) { console.error('no snapshot — run: node tools/symbol_inventory.js snapshot'); process.exit(2); }
  const before = JSON.parse(fs.readFileSync(STORE, 'utf8'));
  const after = scan();
  let bad = 0;
  for (const [file, b] of Object.entries(before)) {
    const a = after[file];
    if (!a) { console.log(`FILE GONE        ${file}`); bad++; continue; }
    const lost = b.symbols.filter(s => !a.symbols.includes(s));
    if (lost.length) { console.log(`SYMBOLS REMOVED  ${file}: ${lost.join(', ')}`); bad++; }
    const drop = b.lines - a.lines;
    if (drop > 15) { console.log(`FILE SHRANK      ${file}: -${drop} lines (${b.lines} -> ${a.lines})`); bad++; }
  }
  for (const file of Object.keys(after)) if (!before[file]) console.log(`new file         ${file}`);
  console.log(bad ? `\n${bad} REGRESSION(S) — something was overwritten, not edited.` : '\nno features lost.');
  process.exit(bad ? 1 : 0);
}

console.log('usage: node tools/symbol_inventory.js snapshot|check');
process.exit(2);
