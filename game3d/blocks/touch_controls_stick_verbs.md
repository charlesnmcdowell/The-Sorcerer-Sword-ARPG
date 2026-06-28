# BLOCK: touch_controls_stick_verbs — on-screen virtual stick + DC verb cluster

CAPABILITY: a Dragon's-Crown-style mobile control layer — a left analog **virtual stick** and a
right **verb-button cluster** — laid over a Phaser canvas, that drives the EXISTING input path with
zero new combat code. The stick writes a global analog vector the sim already reads each frame; the
buttons call the global verb functions the keyboard already calls.

## Why it stays parity-safe
The combat path is untouched. The keyboard handler and the touch layer are two FRONT-ENDS onto the
same two globals:
- movement reads `stick.{dx,dy,on}` each frame (alongside `keys[]`);
- the verbs are top-level `function` declarations (`doSlash`, `doHeavy`/`heavyRelease`, `doParry`,
  `doRoll`, `pickEvo`) — so they are also `window.<fn>` and callable from any later script block.

So the touch layer can live in a SEPARATE `(function(){…})()` at the very end of the script and never
forks the sim.

## DOM (fixed overlays, outside the Phaser `parent` div)
```html
<div id="touch" aria-hidden="true">
  <div id="stickBase"><div id="stickNub"></div></div>
  <div id="btns">
    <button class="btn hex"    id="bHex">HEX</button>
    <button class="btn summon" id="bSummon">SUM</button>
    <button class="btn dodge"  id="bDodge">DASH</button>
    <button class="btn ward"   id="bWard">WARD</button>
  </div>
</div>
```
`#touch{display:none}` by default; `.on` shows it. Cluster is a DIAMOND (primary verb at BOTTOM = thumb
rest). `touch-action:none` + `-webkit-tap-highlight-color:transparent` on every interactive element.

## Wiring (Pointer Events — unified mouse+touch+pen)
- Show only when `('ontouchstart' in window) || navigator.maxTouchPoints>0 || matchMedia('(pointer:coarse)').matches`
  (or `?touch=1` to force on desktop for a vibe check). When shown, HIDE the keyboard legend (`#verbs`) —
  it overlaps the button cluster.
- STICK: on `pointerdown` capture the pointerId + `setPointerCapture`; on move, vector = (finger − center),
  clamp nub travel to radius R, write `stick.dx/dy = unit*min(1, mag/R)`, `stick.on=true`; on up/cancel
  reset to 0/off. `e.preventDefault()` on down+move so the page doesn't scroll/zoom under the thumb.
- BUTTONS: a `wire(id,onDown,onUp)` helper. SUMMON needs BOTH — `onDown` starts the channel
  (`if(!P.channel) doHeavy()`), `onUp` fires `heavyRelease()` — to mirror the keyboard Q hold-to-channel /
  release-to-summon feel. Single-tap verbs only pass `onDown`.
- EVO FAILSAFE: while `P.evoPick` is open, route HEX→`pickEvo(0)` and SUMMON→`pickEvo(1)` so the panel is
  resolvable by touch (mirrors the keyboard `1`/`2`).

## GOTCHAS
- The overlay must be OUTSIDE the Phaser `parent` div and have `pointer-events:none` on the container
  (only the stick + buttons get `pointer-events:auto`), so taps on empty HUD space still fall through to
  the canvas (which handles tap-to-attack / aim).
- Top-level `const stick`/`const P` do NOT become `window` props — but the touch IIFE is in the SAME
  `<script>` block, so it reaches them lexically. Guard with `typeof stick!=='undefined'` anyway so the
  block survives being moved.
- Verbs ARE on `window` (function declarations); a `const G=fn=>typeof window[fn]==='function'` guard lets
  the block no-op safely if a verb isn't defined yet.
- If the engine plane is SIDEON (horizontal-lock), facing auto-resolves toward the foe each frame, so the
  HEX button can call `doSlash()` directly without an explicit aim step.
