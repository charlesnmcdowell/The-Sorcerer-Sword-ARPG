# Block: Atmospheric particle layer (embers + god-rays + dust)

Render-only "living pit" layer for the DC-style brawler. Drop the three methods into the
Phaser scene class, call `buildAtmosphere()` once in `create()` (after the camera grade so the
motes ride under the same bloom), and `stepAtmosphere(now, rdt)` each frame in `update()` on the
REAL delta (so the air keeps drifting through the finisher hit-stop where sim dt=0).

- Depth -50 (god-rays) / -49 (motes): OVER the painted backdrop (-100/-99), UNDER every depth>=0 actor/FX.
- `scrollFactor 0` (screen-fixed), `glow`-texture-guarded (early return if absent → build stays loadable).
- Sets `this._embers = true` (the `__AUDIT__.embers` flag the visual auditor scores).
- Writes NO sim/combat/targeting state. Pool of `glow` images, recycled at the bottom.

```js
buildAtmosphere(){
  if(!this.textures.exists('glow')) return;
  const W=this.scale.width, H=this.scale.height;
  this._atmoW=W; this._atmoH=H;
  this._rays=[];
  for(let i=0;i<4;i++){
    const r=this.add.image(W*(0.26+0.18*i), H*0.06, 'glow')
      .setBlendMode(Phaser.BlendModes.ADD).setTint(0xffe6b0)
      .setOrigin(0.5,0).setScrollFactor(0).setDepth(-50);
    r.setAngle(18).setScale(0.95,7.6);
    r._a0=0.05+0.03*Math.random(); r._ph=i*1.7; r.setAlpha(r._a0);
    this._rays.push(r);
  }
  this._embersArr=[];
  for(let i=0;i<34;i++){
    const dust=(i%4===0);
    const m=this.add.image(0,0,'glow')
      .setBlendMode(Phaser.BlendModes.ADD).setScrollFactor(0).setDepth(-49)
      .setTint(dust?0x9ab0d0:(Math.random()<0.5?0xff9a40:0xffd060));
    this._initMote(m,dust,true);
    this._embersArr.push(m);
  }
  this._embers=true;
}
_initMote(m,dust,anywhere){
  const W=this._atmoW||this.scale.width, H=this._atmoH||this.scale.height;
  m._dust=dust;
  m.x=Math.random()*W; m._x0=m.x;
  m.y=anywhere?Math.random()*H:(H+10);
  m._vy=dust?-(6+Math.random()*10):-(18+Math.random()*30);   // px/s upward
  m._sway=0.4+Math.random()*1.1; m._swA=8+Math.random()*22; m._ph=Math.random()*6.283;
  m._s=dust?(0.03+Math.random()*0.04):(0.04+Math.random()*0.06);
  m._a=dust?(0.10+Math.random()*0.10):(0.22+Math.random()*0.28);
  m.setScale(m._s).setAlpha(0);
}
stepAtmosphere(now,dt){
  if(!this._embers) return;
  const H=this._atmoH||this.scale.height, t=(now||0)/1000;
  if(this._rays) for(const r of this._rays) r.setAlpha(r._a0*(0.6+0.4*Math.sin(t*0.6+r._ph)));
  if(this._embersArr) for(const m of this._embersArr){
    m.y += m._vy*dt;
    m.x  = m._x0 + Math.sin(t*m._sway+m._ph)*m._swA;
    const fy=Phaser.Math.Clamp(m.y/H,0,1);
    const fade=Math.min(1,fy*2)*Math.min(1,(1-fy)*3+0.15);
    m.setAlpha(m._a*fade);
    if(m.y<-10) this._initMote(m,m._dust,false);
  }
}
```

Shipped in arena.html 2026-06-28 (LOOK ~85%→~88%). Next LOOK gap: reactive crowd (sway + roar/brightness pulse).
