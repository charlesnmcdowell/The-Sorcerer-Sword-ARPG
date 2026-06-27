# BLOCK: normal-mapped idle spritesheet from a flat art sheet (anime 2.5D)

Turn a flat hand-/AI-drawn character sheet into a **lit, normal-mapped looping sprite** that reads as 3D
under Phaser Light2D. Used for Hiro's warlock idle (ingested 2026-06-27).

## Intake (Python, Pillow+numpy — no paid API)
1. Open sheet, slice into N equal cells (`W//N`). Inspect a composite over a flat bg first.
2. **Cull bad frames**: drop "showcase" poses with extra props and any frame whose lower-body
   center-of-mass drifts off the others (measure `alpha[lowerRows]` column mean; keep frames within ~±2px).
3. Resize each kept frame to the **same height as the placeholder it replaces** (here 384) so it slots
   into existing y-sort/scale code with NO code scale change. Width = round(cellW * newH/cellH).
4. Clean halos: `alpha[alpha<18]=0`.
5. **Auto normal map** per frame: height = Gaussian-blurred(σ≈1.2) luminance × alpha; `gy,gx=np.gradient(h)`;
   `n=normalize(-gx*S, -gy*S, 1)`, S≈2.2; encode `*.5+.5`; force **flat (128,128,255)** where alpha<0.5;
   normal alpha = diffuse alpha.
6. Pack frames left-to-right into `*_idle.png` (diffuse) and `*_idle_n.png` (normal), same layout.

## Wire (Phaser 3.8)
```js
// preload — CONFIG-OBJECT form is the only way to bind a normalMap to a SPRITESHEET:
this.load.spritesheet({ key:'warlock', url:SPR+'warlock_idle.png', normalMap:SPR+'warlock_idle_n.png',
  frameConfig:{ frameWidth:192, frameHeight:384 } });
// create — guard so a decode failure can't break the build:
const ok = this.textures.exists('warlock') && this.textures.get('warlock').frameTotal-1 >= N;
if(ok && !this.anims.exists('warlock_idle'))
  this.anims.create({key:'warlock_idle', frameRate:7, repeat:-1,
    frames:this.anims.generateFrameNumbers('warlock',{start:0,end:N-1})});
this.hero = this.add.sprite(x,y, ok?'warlock':'warlock_f0').setOrigin(0.5,1).setPipeline('Light2D');
if(ok) this.hero.play('warlock_idle');
```

## GOTCHAS
- **normalMap on a spritesheet ONLY works via the config-object overload** — the `load.image(key,[diff,norm])`
  array form is single-frame only; it silently won't attach a normal to a sheet.
- **`setFlipX(true)` does NOT mirror the normal map's X channel** under Light2D — left-facing lighting is
  subtly wrong. Acceptable for a vibe check; real fix = a pre-mirrored normal sheet or a custom pipeline.
- Always **size the new frame to the placeholder's footprint** to avoid touching the y-sort/scale math.
- Keep a single-frame fallback (`load.image(key,[diff,norm])`) + a `frameTotal` guard so the scene still
  loads if the sheet fails to decode.
- Read/verify the host HTML via the **Read tool**, not bash — the OneDrive FUSE mount serves a truncated tail.
