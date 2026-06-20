# Evolution choice UI fix (user-reported 2026-06-21)

The lv10/lv20 EVOLUTION pick boxes (druid/warlock/seraph) are hard to read and don't make clear what the
evolution grants; and they should only appear at the 10-level milestones. Fix in src/combat/pit.js.
After edits: node --check, keep all champions playable, then REPUBLISH (publish_inplace.py).

## Code map
- Data: EVOLUTIONS{} (~line 82). Each road already has: name, focus (CON/DEX/ATK), look, desc (flavor),
  kit (the abilities it grants). USE these — esp. focus + kit.
- Trigger: maybeOfferEvo() (~line 157) — offers at lvl()>=10 (sets P.evo10) and lvl()>=20 (sets P.evo20).
- Panel: drawEvoPanel() (~line 3016) + evoWrap() + evoCardRects() (~200). Input: evoTick/pickEvo/evoClick.
- Reset: fullReset() (~line 1937) clears P.evo10/P.evo20/P.evoPick each pit run.

## 1. FREQUENCY — only every 10 levels
Confirm the box offers ONLY at level 10 and level 20 (the 10-level gates), exactly once per gate per run,
and NEVER at intermediate levels (11-19, 21+). Level cap is 20, so 10 and 20 are the only gates today.
- Verify lvl() crossing logic in gainLevel()/maybeOfferEvo doesn't double-fire or fire off-milestone; fix
  if it does.
- NOTE/ASK THE USER: today the choice is cleared by fullReset(), so it re-offers every NEW pit run (at 10
  and 20 again). If the user means "stop re-asking once I've evolved," persist P.evo10/P.evo20 across runs
  via GameState so the box doesn't reappear after it's been chosen. Put this question in
  GAME_TASKS notes and proceed with the readability/clarity fixes regardless.

## 2. READABILITY (the main complaint)
drawEvoPanel currently uses 10-15px "Courier New" in dim greys (#cfc6b4 / #9a8f7c) on small cards.
- Bump font sizes substantially (title ~26px; option name ~20px bold; desc ~14-15px; grants ~14px) and use
  brighter, higher-contrast colors (e.g. bone/parchment #efe6d2 for body text, gold #f0c66a accents).
- Make the cards bigger and scale to the canvas so text fits on MOBILE (evoCardRects geometry: widen cards,
  add padding; ensure evoWrap has enough width and line-height). Test at a phone aspect ratio.
- Keep the dark-fantasy look (dark panel, gold border) but ensure strong contrast.

## 3. CLARITY — show what each evolution GIVES
On each card, clearly present, top to bottom:
  - "1." / "2." + NAME (big).
  - A FOCUS badge showing the stat it favors (focus: CON / DEX / ATK) — currently NOT drawn at all; add it.
  - desc (flavor) in readable body text.
  - A labeled grants line, e.g.  "GRANTS:" then the kit text (the actual abilities) — make this the most
    legible line, not the dimmest. This is the info the user said is unclear.
- Keep the "press 1 / 2 or click a card  (Ns)" prompt and the auto-default behavior intact (no softlock;
  AUTO/headless still resolves instantly).

## QA
node --check pit.js; druid/warlock/seraph each reach lv10 -> box shows readable name+focus+desc+GRANTS for
both roads; box appears only at 10 and 20; picking by key (1/2) and by click both work; no softlock in AUTO.
Then republish.

## 4. BALANCE — succubi fireball damage (moderate increase)
The warlock's succubi throw fireballs with damage = Math.round((rollDice(diceN(),8)+dmgBonus())*1.3)
at pit.js ~line 640 (the recurring succubus attack). MODERATELY increase it: change the 1.3 multiplier to
~1.6. Also check the other succubus-originated fireball push (~line 577, the coven volley) and apply the
same moderate bump if it carries a damage multiplier. Do NOT change the player's own fireballs (line 498)
or the arch-devil hellfire (line 1323). node --check + republish with the rest.

## 5. BALANCE — ARCH succubus fireballs (bigger: damage + AOE + projectile)
The ARCH succubus (d.arch) currently fires the SAME fireball as a normal succubus (push at ~line 639-640;
projectile r:6; splash AOE is the hardcoded 45 in updFireballs ~line 673-674: `if(dist(e,o)<45)`).
Make the ARCH succubus's fireballs MODERATELY bigger in all three ways, WITHOUT changing normal succubi
beyond section 4's damage bump:
- At the push site, branch on d.arch: for arch, set a larger projectile radius (e.g. r:10), a higher damage
  multiplier than the normal succubus (e.g. ~2.0x vs the new 1.6x), and tag the fireball with an explicit
  AOE radius, e.g. `aoe:70` (normal stays default).
- In updFireballs, make the splash use the tagged radius: `const aoe=b.aoe||45;` then `if(dist(e,o)<aoe)`.
  (So normal fireballs keep 45; arch ones use 70.) Keep the splash damage = round(b.dmg/2).
- Visual: the bigger r already draws a larger ball; optionally scale the particle a touch for arch.
Only the ARCH succubus changes here. node --check + republish with the rest.

---

## STATUS — DONE 2026-06-20 (automated quick-fix run)

All three fixes applied to `src/combat/pit.js`, QA-verified headless (druid/warlock/seraph,
desktop 1280x720 AND phone 390x720), and republished in-place to Neverendingnarratives/play
(build 1781975419). `node --check` passes on both source and published copies.

**1. CADENCE — verified, no code change needed.** `maybeOfferEvo()` already gates correctly:
fires once at lv10 (`!P.evo10 && lvl()>=10`) and once at lv20 (`P.evo10 && !P.evo20 && lvl()>=20`),
guarded by `if(P.evoPick)return`. QA confirmed: NO box at levels 11-19, NO re-fire after both
gates are chosen, lv20 offers the single road that continues the chosen lv10 road. No double-
or off-milestone firing.

**2. READABILITY — done.** `drawEvoPanel()` rewritten: title 26px bold, prompt 15px, road name
~22px bold (auto-shrinks to fit narrow cards, floor 15px), desc 15px, GRANTS 14px/kit 15px — all
in Georgia serif. Colors are high-contrast bone/parchment (#efe6d2 / #e7ddc6) body + gold accents
(#f0c66a) on a dark panel with a brighter road-colored border + inner gold hairline (dark-fantasy
look kept). `evoCardRects()` made responsive: cards widen/heighten and scale to the canvas
(`ph≈H*0.52`, width fits n cards+gaps), so two cards fit cleanly side-by-side on a phone and a
lone lv20 card centers wide. QA confirms cards stay inside the canvas at both aspect ratios.

**3. CLARITY — done.** Each card now shows, top to bottom: "1./2. + NAME" (big), a gold **FOCUS:
CON/DEX/ATK** badge pill (was not drawn before — added), the desc flavor in readable body text,
and a gold **GRANTS** label followed by the kit text rendered as a full-size legible line.
Key (1/2) + click resolution and the AUTO/headless instant auto-default (no softlock) are intact
and QA-verified.

### OPEN QUESTION FOR USER — evolution persistence across pit runs
Today `fullReset()` clears `P.evo10/P.evo20` at the start of every pit run, so the choice box is
offered again (at lv10 and lv20) on each NEW run. The readability/clarity fixes are done either way.
If the complaint "appears too often" means "stop re-asking once I've already evolved this character,"
the fix is to PERSIST `P.evo10/P.evo20` across runs via `GameState.player` (read them back in
`fullReset` instead of nulling them). This was left AS-IS because it's a gameplay decision — making
evolutions permanent across runs would prevent re-choosing a different road on a fresh run. Hiro:
tell me which you want and I'll wire persistence (or leave per-run as it is now).

## 6. CINEMATIC voice + timing (arch-devil outro) — code DONE; user must regenerate clips
ROOT CAUSE: build_voice_manifest segment() demoted the UNQUOTED cinematic taunts to the NARRATOR voice, so
the generated clips were narrator audio (runtime looks them up under WARLOCK/SERAPHIM ids and found
narrator-voiced files). Also the phase timings cut v3 lines off.
DONE in code:
- build_voice_manifest.js: add() tags ADO taunts + seraph line with {whole:1}; segment() honors it (single
  segment voiced by the line's own speaker). Manifest rebuilt -> cinematic segs now WARLOCK / SERAPHIM.
- Retired the stale narrator-voiced cinematic clips (renamed assets/voice/<id>.mp3 -> .stale-narrator.mp3)
  so generate_voices will remake them.
- pit.js archDevilOutro timing extended: paralyze 17s; taunt banner 7s; phase2 @7.5s; seraph banner 5.5s;
  phase3 @13s — so the WARLOCK taunt + SERAPHIM line finish before the scene advances.
REMAINING (user-run, costs a few ElevenLabs cents):
  cd "C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG\game\tools"
  python generate_voices.py --yes   # remakes the 11 cinematic clips in WARLOCK/SERAPHIM voices
Then for LOCAL source testing, HARD REFRESH game/index.html (Ctrl+Shift+R) — the local file loads JS without
cache-busting, so old pit.js/voice.js were being cached.
ON REPUBLISH: publish_inplace does NOT copy assets/voice — after the clips are regenerated, also copy
assets/voice/*.mp3 into play/assets/voice/ so the live site gets them.


## STATUS — BALANCE SECTIONS 4 & 5 COMPLETED 2026-06-20 (follow-up quick-fix run)
The earlier run finished cadence/readability/clarity (1-3) and voice (6) but had NOT applied the two
balance fixes. Now done in src/combat/pit.js:
- **Sec 4** — normal succubus recurring fireball multiplier 1.3 -> 1.6 (line ~646). Player fireball (504),
  bone-archer volley (583, an 'arrow' with no multiplier), and arch-devil hellfire (1329) all left untouched.
- **Sec 5** — ARCH succubus fireball branches on d.arch at the push site: r:10 (vs 6), 2.0x dmg (vs new 1.6x),
  aoe:70. updFireballs now reads `const aoe=b.aoe||45;` and uses `dist(e,o)<aoe` so normal fireballs keep
  45 splash and arch use 70; splash dmg stays round(b.dmg/2).
QA: node --check PASS (source + published); headless harness 10/10; gauntlet sweep PASS for all champions
incl. warlock (succubi). Republished in-place to Neverendingnarratives/play (build 1781979076).
The quick-fix scheduled task is now disabled. The evolution-persistence question above remains open for Hiro.
