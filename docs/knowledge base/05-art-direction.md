# 05 — Art Direction

How the game looks, and how to change it. The aesthetic is **dark-fantasy, torchlit, gritty arcade** — heavy vignette, low-key lighting, ember particles, blood/dismemberment in combat, a chunky low-res render buffer for a pixel feel.

## Where the visuals come from (three layers)

1. **Tilesets & props (the world):** base64-embedded in `assets/embedded.js` (so the game runs from `file://` with no external files). These are commercial pixel-art packs (Cainos, Tiny Swords). Buildings/ground/props are drawn from these.
   - ⚠️ **Licensing:** confirm the commercial terms of any art pack before selling/crowdfunding. Note which packs are used and keep the license receipts. This is a business risk, not a code one.
2. **Fighters & monsters (combat + NPCs):** drawn **procedurally** by `drawFighter(x,y,r,face,col,opts)` in `src/combat/pit.js`. There are no character sprites — everything (the four champions, every monster, NPCs, companions) is vector-drawn from code with an options object. This is why adding a visual variant is a code edit, not an art file.
3. **Atmosphere/lighting:** generated at runtime in `src/scenes/WorldScene.js` → `makeAtmosphere()` and `updateAtmosphere()` (darkness overlay, soft light stamps, drifting fog, ember particles, vignette).

## The fighter renderer (`drawFighter`)

Signature: `drawFighter(x, y, radius, facing, bodyColor, opts)`. The `opts` object turns features on. Key flags (search `pit.js` for `o.<flag>`):

- Body types: `samurai` (ronin), `druid`, `warlock`, `seraphim`, `hulk` (bear/beast), `quad` (wolves/hounds/wyverns), `blob` (slimes/elementals), `robe`, `hood`, `skull` (undead).
- Weapons: `wpnLen`+`wpnCol` (a held weapon), `twin` (druid glaive), `staffTip`+`tipCol` (mage staff orb), `spear`+`spearLen` (seraph lance), `thickWpn` (maul), `shield`, `gun`.
- Champion extras: `armor` (ronin blade tier 0/1/2), `seraphim` (wings/halo/3 heads/runic chains), `bear`, `flying`, `haloGone`.
- State: `flash` (hit white), `dead`+`deathT` (sprawled corpse), `roll`+`rollSpin`, `phase`+`moving` (walk cycle), `headCol`.

To **re-color or restyle** a character/monster: change the `col` and `opts` passed where it's drawn. For the player that's the big render branch near the bottom of `pit.js`; for NPCs/monsters it's in `WorldScene.bakeFrames` (the `looks` map) and each scene's pack `look`. Companion looks are in `companions.js` (`look:{col,o}`).

> `bakeFrames` renders each look into an 8-direction × 4-frame sprite sheet once, then sprites just pick a frame. If you change a look, the sheet rebakes. **Never** `textures.remove` a sheet a live sprite is using (causes a black screen on WebGL) — the code guards the player sheet with `window.__frPlayerSig`; respect that pattern.

## Camera techniques

The camera is `this.cameras.main` (Phaser). Default: follows the player with lerp `0.12`. On phones it leans in to `1.18` zoom (see `WorldScene.spawnPlayer`, `window.IS_PHONE`).

- **First-visit cinematic** (`WorldScene.introPan`): once per zone (recorded in `GameState.world.seenZones`), a ~4s sequence — `stopFollow` → `cam.pan` to the active quest objective → `cam.zoomTo` in (with a floating label) → glide back to the player → `startFollow`. Player input is locked via `this.cinematic` during it. Tunable numbers are the `delayedCall` timings and the zoom targets inside `introPan`.
- **Combat kill-cam**: inside `pit.js` (`camFocus`, the `cam` object) — fatalities zoom + slow-mo + letterbox. This is part of the source-is-law combat feel; change cautiously.
- **Screen scaling**: `src/main.js` `config.scale` — `ENVELOP` on landscape phones (fills the screen, crops the 16:9 frame), `FIT` otherwise (letterboxed). The DOM HUD sits on the real screen, so nothing important is cropped.

## Lighting & atmosphere (`makeAtmosphere(opts)`)

Each zone calls it with options: `darkness` (0–1 overlay alpha), `darkCol` (tint), `fogTint`, `emberCol`. The stack = a dark render-texture with light "holes" erased where lights are, two drifting fog layers, a vignette, and rising ember particles. Per-zone values set the mood (grove = green, ashenveil = sickly green, dragonspine = cold blue, city = warm torch).

- Add a light: `this.addLight(x, y, radius, withPost)` — `withPost` also draws a little torch post + glow.
- Make a zone darker/moodier: change the `makeAtmosphere({...})` call in that scene's `create()`.

## Title screen

In `index.html` (the `#title` screen div): a torchlit serif treatment, "neverending narratives presents" eyebrow, clamp()-sized type for mobile, four champion buttons, Continue (if a save exists). Styling is inline CSS in that div.

## Practical change cheatsheet

| I want to… | Edit |
|---|---|
| Recolor a champion/monster | the `col`/`opts` where it's drawn (`pit.js` render branch, `bakeFrames` looks, scene pack `look`, `companions.js`) |
| Change a zone's mood/darkness | that scene's `makeAtmosphere({...})` call |
| Retune the intro cinematic | `WorldScene.introPan` (timings + zoom) |
| Change mobile zoom / letterboxing | `main.js` (`IS_PHONE`, `config.scale`), `WorldScene.spawnPlayer` |
| Swap world tilesets/props | regenerate `assets/embedded.js` from new packs (see how it's structured; large task) |
| Edit the title look | `#title` div in `index.html` |
