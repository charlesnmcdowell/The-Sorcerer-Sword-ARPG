# QUICK FIX — Safe removal of "The Ember" playable character

Goal: fully remove the unrequested playable champion **"The Ember"** (internal id `ember`, item-12)
WITHOUT touching the other four champions (ronin, druid, warlock, seraph) or any visual "ember"
fire/particle effects.

Game root: C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG\game
(All paths below are relative to that game/ folder.)

## ALREADY DONE (disable step — verify still true, do not redo)
- index.html : the `id="emberBtn"` select-button div was removed (Ember is unselectable).
- src/scenes/ArenaScene.js : `on('emberBtn', () => this.combat.startIntro('ember'));` was removed.
Backups exist as *.bak-ember-* next to those files.

## REMAINING CLEANUP (dead code now, but remove for tidiness — be surgical)
Edit bash-side with Python (read full file, str-replace, write all bytes back) to avoid OneDrive
truncation. After EACH file edit run `node --check <file>` (for .js). Make a *.bak before editing.

1. src/combat/pit.js
   - Line ~50: `const RKIT=c=>c==='ronin'||c==='ember';`  ->  `const RKIT=c=>c==='ronin';`
   - Line ~1821: remove the `ember:'...smolders...'` entry from the BIOS object (delete that one key).
   - Line ~1890: remove `DEMOS.ember=DEMOS.ronin;` line.
   - Lines ~1914 and ~1916: remove `,ember:'THE EMBER'` from BOTH name-map objects.
   - DO NOT touch line ~2867 (`archfiend ... ember halo`) — that is an evolution visual, not the char.

2. src/core/questnav.js
   - Remove the EMBER (item 12) epilogue routing block (~lines 106-112): the
     `const ember = ... char === 'ember'` line and the `if (ember && ...) ...` that follows.

3. src/scenes/CityScene.js
   - Remove the EMBER EPILOGUE block (~lines 214-224): the `if (P.char === 'ember' && ...)` block
     that references `Quests.emberEnding`.

4. src/world/quests.js
   - Remove the `emberEnding: { ... },` object (starts ~line 478). Delete the whole key+value.

## MUST KEEP (these are NOT the character — leave untouched)
- Any `emberCol`, `'ember'` texture/particle code in WorldScene.js, BootScene.js, ArenaScene.js
  (tbEmbers title particles), and every scene's makeAtmosphere.
- pit.js archfiend "ember halo", MountainScene "ember eyes".
- All `remember(...) / rememberAll(...)` companion-memory functions (different word).
- Enemy subtitles like "they remember the sand".

## QA — run every time, must all pass before self-disabling
- `node --check` passes on: pit.js, questnav.js, CityScene.js, quests.js, ArenaScene.js.
- `grep -rn "char *=== *'ember'\|'ember'\|emberBtn\|emberEnding\|BIOS.ember\|DEMOS.ember" src index.html`
  returns NO gameplay/character refs (only allowed: emberCol / ember particle / archfiend halo / ember eyes).
- Confirm the 4 remaining champions are intact: index.html still has startBtn, druidBtn, warlockBtn,
  seraphBtn; ArenaScene still wires those 4 to startIntro('ronin'|'druid'|'warlock'|'seraph').
- Sanity: quests.js still has the other quest objects (don't delete neighbors).
- If anything fails, FIX it (or restore from the *.bak) and try again next run; do NOT leave the game broken.

## WHEN COMPLETE
Once all cleanup is applied AND all QA passes clean, this is done — DISABLE the "quick fix"
scheduled task so it stops running. Write a one-line note to EMBER_REMOVAL_DONE.md and stop.
