# Combat Source Map — `the-pit-of-karridge.html`

Working notes for the Bucket 1+ port. The source file is law; this maps where the law lives.
Single ~120K-char script block, vanilla JS canvas. `node --check` passes.

## Core structures

| Thing | Where / shape |
|---|---|
| Global state machine | `S = {mode, fight, shake, hitPause, time, slow, fatal}` — modes: title / fight / demo / win / lose |
| Player | `P` object: pos, hp, kills, `base` stats, char ('ronin'/'druid'/'warlock'), cooldown timers |
| Stat math | `stat(k)` — ronin: base + kills×2; others: base + 3×(level−1). `lvl()` caps at 10. `gainLevel()` = +1.5 levels/kill |
| Dice | `rollDice(n,s)`; `diceN()` — ronin: 1+kills, others: level |
| Derived | `dmgBonus()`, `moveSpd()`, `rollCDmax()`, `atkRec()`, `maxHP()` |
| Ronin forms | `roninTier()` STR 20/40 → Nodachi/Odachi, `checkRoninForm()` |
| Unlock gates | `UNLOCKS` — druid bear@3 wolf@6; warlock per level |
| Entities | `enemies[], wolves[], demons[], fireballs[], tracers[], particles[], popups[], zones[], swings[], bullets[], limbs[]` |
| Gauntlet | `FIGHTS` array — named fights (THE DOOR, TWIN HOOKS, THE CHAIN, PYRE, THE POWDER SAINT, THE GRAVE COUNT, THE STITCHER, HOUND MASTER, THE GRAVEDIGGER, THE WALL HOLDS, THE COVEN OF KILNS, THE UNDYING WALL, SIEGE WORKS, THE FORMER CHAMPION …). Difficulty: `1 + fight×0.30`, enemy dmgScale `1 + fight×0.16`. Boss bar shows at fight ≥ 18 |
| Enemy types | door, hook, chain, whipcrack, pyre, gunner, grave, necro, skel, stitch, hound, master, brute, thrall, champ, ice, gas, fire, dragon, succubus |
| Nicknames | `styleScore` (untouched/headsman/quicksand/breath/corpse/mirror) with decay; `NICKBANKS` per class, 4 tiers (fights 1-4/5-9/10-14/15+); crowd announces in `Bellow` recaps/taunts |
| Game feel | `cam` (focus/zoom/hold), `S.shake`, `S.hitPause`, `S.slow` slow-mo, FATALITY banner + `KILLWORDS`, persistent blood `decalCv`, dismembered `limbs` |
| Input | keys + mouse + touch stick (`stick`, `bindBtn`) — already separated from controller fns (`doSlash/doParry/doHeavy/doRoll`, druid/warlock variants) |

## Port strategy (Bucket 1)
Port `P`, enemy AI update fns, and the math helpers nearly verbatim into Phaser scene update. Replace canvas draws with Phaser equivalents; keep `decalCv` as a RenderTexture. `S.shake/hitPause/slow` map to camera shake + timeScale. Extracted JS lives at `/tmp/pit.js` in the sandbox during builds (re-extract with the regex one-liner in build logs).
