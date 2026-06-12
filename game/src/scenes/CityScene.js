// CityScene — Karridge City. Cainos top-down tiles + procedural buildings,
// D2 atmosphere stack (darkness/torchlight, fog, vignette, embers),
// ambient NPCs rendered with the SAME drawFighter art as the arena.

class CityScene extends Phaser.Scene {
  constructor() { super({ key: 'CityScene' }); }

  preload() {
    for (const [key, uri] of Object.entries(window.EMBEDDED_ASSETS)) {
      if (!this.textures.exists(key)) this.load.image(key, uri);
    }
  }

  create() {
    const M = CityMap, T = M.TILE, WPX = M.W * T, HPX = M.H * T;
    const GS = window.GameState;
    if (!GS.player) GS.player = { char: 'ronin', kills: 20, level: 1, bladeTier: 1,
      base: { STR: 10, DEX: 10, CON: 10, ATK: 10 }, nickname: 'THE HEADSMAN', copper: 200, belt: [] };
    const P = GS.player;
    GS.world.zone = 'karridge-city';
    if (!GS.world.flags['q-mq1-empty-cell']) GS.world.flags['q-mq1-empty-cell'] = 'active';

    // ---------- props frames on the cainos sheet ----------
    const propsTex = this.textures.get('cainos-props');
    const F = { door: [32, 98, 68, 90], chest: [96, 32, 64, 64], crate: [160, 0, 64, 64],
      barrel: [160, 160, 32, 56], signEast: [96, 160, 32, 64], well: [352, 264, 112, 88],
      statue: [448, 0, 64, 96] };
    for (const [name, [x, y, w, h]] of Object.entries(F))
      if (!propsTex.has(name)) propsTex.add(name, 0, x, y, w, h);

    // ---------- ground: stone slabs in 2x2 blocks ----------
    const map = this.make.tilemap({ width: M.W, height: M.H, tileWidth: T, tileHeight: T });
    const tiles = map.addTilesetImage('cainos-stone', undefined, T, T, 0, 0);
    const ground = map.createBlankLayer('ground', tiles).setDepth(0);
    const blocks = [0, 2, 4, 6]; // top-left col of each 2x2 slab block in row 0
    for (let ty = 0; ty < M.H; ty += 2) for (let tx = 0; tx < M.W; tx += 2) {
      const b = blocks[Math.floor(Math.random() * blocks.length)];
      ground.putTileAt(b, tx, ty); ground.putTileAt(b + 1, tx + 1, ty);
      ground.putTileAt(b + 8, tx, ty + 1); ground.putTileAt(b + 9, tx + 1, ty + 1);
    }
    // moody color: darken the whole ground toward night
    ground.forEachTile(t => { t.tint = 0x6a5f63; });

    // ---------- collision rects ----------
    this.solids = [];
    const solid = (x, y, w, h) => this.solids.push({ x, y, w, h });

    // ---------- city walls + gates ----------
    const wallG = this.add.graphics().setDepth(2);
    const drawWallRun = (x, y, w, h) => {
      wallG.fillStyle(0x1a1418); wallG.fillRect(x, y, w, h);
      wallG.fillStyle(0x231b20);
      for (let i = 0; i < (w * h) / 700; i++)
        wallG.fillRect(x + Math.random() * (w - 12), y + Math.random() * (h - 6), 8 + Math.random() * 10, 4 + Math.random() * 4);
      wallG.fillStyle(0x2c2228); // crenellation
      for (let cx = x; cx < x + w; cx += 24) wallG.fillRect(cx, y - 6, 14, 6);
      solid(x, y, w, h);
    };
    const gS = M.gates.south, gN = M.gates.north;
    drawWallRun(0, 0, gN.x * T, T * 1.5);                                  // north west run
    drawWallRun((gN.x + gN.w) * T, 0, WPX - (gN.x + gN.w) * T, T * 1.5);   // north east run
    drawWallRun(0, HPX - T * 1.5, gS.x * T, T * 1.5);
    drawWallRun((gS.x + gS.w) * T, HPX - T * 1.5, WPX - (gS.x + gS.w) * T, T * 1.5);
    drawWallRun(0, 0, T, HPX); drawWallRun(WPX - T, 0, T, HPX);
    // north gate: barred portcullis (teaser)
    const barG = this.add.graphics().setDepth(2);
    barG.fillStyle(0x3a3a40);
    for (let i = 0; i < gN.w * T; i += 10) barG.fillRect(gN.x * T + i, 0, 4, T * 1.5);
    solid(gN.x * T, 0, gN.w * T, T * 1.5);
    // south gate: the Pit lies beyond — block exit politely
    solid(gS.x * T, HPX - T * 0.5, gS.w * T, T * 0.5);

    // ---------- buildings ----------
    this.interactables = [];
    for (const b of M.buildings) {
      const bx = b.x * T, by = b.y * T, bw = b.w * T, bh = b.h * T;
      const key = 'bld-' + b.w + 'x' + b.h;
      if (!this.textures.exists(key)) this.makeBuildingTexture(key, bw, bh);
      this.add.image(bx, by, key).setOrigin(0).setDepth(by + bh);
      solid(bx, by, bw, bh);
      // door on south face
      const dx = bx + b.door * T, dy = by + bh;
      this.add.image(dx, dy, 'cainos-props', 'door').setOrigin(0.5, 1).setDepth(dy + 1).setScale(0.9);
      // warm windows (light sources too)
      this.windowLights = this.windowLights || [];
      for (let wx = bx + 24; wx < bx + bw - 24; wx += 86) {
        const wy = by + bh - 18;
        const win = this.add.rectangle(wx, wy, 12, 16, 0xffc873, 0.85).setDepth(by + bh + 1);
        this.windowLights.push({ x: wx, y: wy, r: 55, spr: win });
      }
      if (b.id === 'inn') this.interactables.push({ x: dx, y: dy - 10, label: 'enter THE LAST LANTERN', fn: () => this.innDialog() });
      if (b.id === 'guild') this.interactables.push({ x: dx, y: dy - 10, label: 'enter the ADVENTURERS GUILD', fn: () => this.guildBoard() });
      if (b.sign) { // hanging plaque
        this.add.rectangle(dx + 36, dy - bh / 2 - 6, 46, 16, 0x15100b).setStrokeStyle(1, 0xe7b450, 0.6).setDepth(dy + 2);
        this.add.text(dx + 36, dy - bh / 2 - 6, b.sign, { fontFamily: 'Courier New', fontSize: '10px', color: '#e7b450' }).setOrigin(0.5).setDepth(dy + 2);
      }
    }

    // ---------- plaza well + props ----------
    const wellX = M.well.x * T, wellY = M.well.y * T;
    this.add.image(wellX, wellY, 'cainos-props', 'well').setOrigin(0.5).setDepth(wellY + 30);
    solid(wellX - 44, wellY - 30, 88, 64);
    this.interactables.push({ x: wellX, y: wellY, label: 'look into the well', fn: () => this.signDialog('THE WELL', 'Coins glint far below. Most are offerings. Some are bribes. The well keeps every secret it is paid.') });
    for (const [px, py, frame] of [[18, 24, 'barrel'], [19, 25, 'crate'], [52, 24, 'barrel'], [27, 19, 'crate'], [43, 27, 'barrel'], [60, 32, 'crate'], [13, 33, 'barrel']]) {
      this.add.image(px * T, py * T, 'cainos-props', frame).setOrigin(0.5, 1).setDepth(py * T);
      solid(px * T - 14, py * T - 22, 28, 22);
    }
    this.add.image(35 * T, 17 * T, 'cainos-props', 'statue').setOrigin(0.5, 1).setDepth(17 * T);
    solid(35 * T - 24, 17 * T - 30, 48, 30);

    // signs
    for (const s of M.signs) {
      this.add.image(s.x * T, s.y * T, 'cainos-props', 'signEast').setOrigin(0.5, 1).setDepth(s.y * T);
      this.interactables.push({ x: s.x * T, y: s.y * T, label: 'read the sign', fn: () => this.signDialog('SIGNPOST', s.text) });
    }

    // chests
    for (const c of M.chests) {
      const id = 'chest-' + c.x + '-' + c.y;
      const img = this.add.image(c.x * T, c.y * T, 'cainos-props', 'chest').setOrigin(0.5, 1).setDepth(c.y * T).setScale(0.8);
      if (GS.world.chestsOpened.includes(id)) img.setTint(0x555555);
      this.interactables.push({ x: c.x * T, y: c.y * T, label: 'open the chest', fn: () => {
        if (GS.world.chestsOpened.includes(id)) { this.floatText(c.x * T, c.y * T - 40, 'empty', '#6b5d4f'); return; }
        GS.world.chestsOpened.push(id); img.setTint(0x555555);
        if (c.loot.type === 'copper') { P.copper += c.loot.amount; CityUI.setPurse(P.copper);
          this.floatText(c.x * T, c.y * T - 40, '+' + Money.fmt(c.loot.amount), '#e7b450'); }
        else if (P.belt.length < 8) { P.belt.push(c.loot); CityUI.belt(P.belt);
          this.floatText(c.x * T, c.y * T - 40, c.loot.label, '#7fbf6a'); }
        else this.floatText(c.x * T, c.y * T - 40, 'belt is full', '#c8443a');
      }});
    }

    // ---------- characters: bake drawFighter frames ----------
    this.bakeFighterFrames();
    this.player = this.add.sprite(M.spawn.x, M.spawn.y, 'fr-player', 0).setDepth(M.spawn.y);
    this.npcs = [];
    const palettes = ['npc0', 'npc1', 'npc2', 'npc3'];
    for (const z of M.npcZones) for (let i = 0; i < z.n; i++) {
      const nx = (z.x + Math.random() * z.w) * T, ny = (z.y + Math.random() * z.h) * T;
      const spr = this.add.sprite(nx, ny, 'fr-' + palettes[Math.floor(Math.random() * palettes.length)], 0).setDepth(ny);
      this.npcs.push({ spr, zone: z, tx: nx, ty: ny, pauseT: Math.random() * 3, walkP: 0, face: 0 });
    }

    // ---------- atmosphere ----------
    this.makeAtmosphere(WPX, HPX);

    // ---------- camera + input ----------
    this.cameras.main.setBounds(0, 0, WPX, HPX).startFollow(this.player, true, 0.12, 0.12);
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,J,ESC');
    this.input.keyboard.on('keydown-E', () => this.tryInteract());
    this.input.keyboard.on('keydown-J', () => { this.qlogOpen = !this.qlogOpen;
      CityUI.questlog(this.qlogOpen, Quests.main, GS.world.flags); });
    this.input.keyboard.on('keydown-ESC', () => { CityUI.closeDialog(); CityUI.guildBoard(false); this.qlogOpen = false; CityUI.questlog(false); });

    // ---------- city HUD ----------
    CityUI.init(); CityUI.hud(true);
    CityUI.setIdentity(P.nickname); CityUI.setPurse(P.copper); CityUI.belt(P.belt);
    this.floatText(this.player.x, this.player.y - 60, 'KARRIDGE CITY', '#e7b450', 18);

    this.chatterT = 4; this.walkP = 0; this.face = -Math.PI / 2;
  }

  // ===================== textures =====================
  makeBuildingTexture(key, w, h) {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0x241d20); g.fillRect(0, 0, w, h);                       // body
    g.fillStyle(0x191215);
    for (let i = 0; i < (w * h) / 320; i++)                               // stonework
      g.fillRect(Math.random() * (w - 18), h * 0.42 + Math.random() * (h * 0.55 - 8), 12 + Math.random() * 14, 5 + Math.random() * 4);
    g.fillStyle(0x161013); g.fillRect(0, 0, w, h * 0.42);                 // roof
    g.fillStyle(0x1f171c);
    for (let rx = 6; rx < w; rx += 14) g.fillRect(rx, 2, 7, h * 0.42 - 4); // shingles
    g.fillStyle(0x0d0a08); g.fillRect(0, h * 0.42 - 3, w, 3);             // eave shadow
    g.lineStyle(2, 0x0d0a08, 1); g.strokeRect(0, 0, w, h);
    g.generateTexture(key, w, h); g.destroy();
  }

  bakeFighterFrames() {
    // portrait must exist on every scene start (textures persist; `this` does not)
    const pc = document.createElement('canvas'); pc.width = pc.height = 72;
    const r2 = createPitCombat({ width: 72, height: 72, ctx: pc.getContext('2d'), ui: {} });
    r2.drawFighter(36, 42, 15, -Math.PI / 2, '#4a3527', { robe: true, headCol: '#caa27a' });
    this.portraitInn = pc;
    if (this.textures.exists('fr-player')) return;
    const scratch = document.createElement('canvas'); scratch.width = scratch.height = 72;
    const sctx = scratch.getContext('2d');
    const render = createPitCombat({ width: 72, height: 72, ctx: sctx, ui: {} });
    const GSP = window.GameState.player;
    const looks = {
      'fr-player': GSP.char === 'druid' ? { col: '#2c4430', o: { druid: true, wpnLen: 26, wpnCol: '#d8e4d0', twin: true } }
        : GSP.char === 'warlock' ? { col: '#241a30', o: { warlock: true, robe: true, wpnLen: 30, wpnCol: '#3a3046', staffTip: true, tipCol: '#b070f0', twoHand: false, headCol: '#9a9ab0' } }
        : { col: '#2c3440', o: { samurai: true, armor: GSP.bladeTier || 0, wpnLen: (GSP.bladeTier === 2 ? 62 : GSP.bladeTier === 1 ? 46 : 30), wpnCol: '#e7d9a8', thickWpn: GSP.bladeTier === 2 } },
      'npc0': { col: '#4a3c30', o: {} }, 'npc1': { col: '#39414a', o: { hood: true } },
      'npc2': { col: '#4a2f33', o: { robe: true, headCol: '#caa27a' } }, 'npc3': { col: '#3c4434', o: {} },
    };
    const DIRS = 8, PH = 4;
    for (const [key, look] of Object.entries(looks)) {
      const sheet = document.createElement('canvas'); sheet.width = 72 * DIRS; sheet.height = 72 * PH;
      const shctx = sheet.getContext('2d');
      for (let d = 0; d < DIRS; d++) for (let p = 0; p < PH; p++) {
        sctx.clearRect(0, 0, 72, 72);
        render.drawFighter(36, 40, 13, d / DIRS * Math.PI * 2, look.col,
          Object.assign({ phase: p * (Math.PI / 2) + 0.7, moving: p > 0 }, look.o));
        shctx.drawImage(scratch, d * 72, p * 72);
      }
      this.textures.addCanvas(key, sheet);
      const tex = this.textures.get(key);
      for (let d = 0; d < DIRS; d++) for (let p = 0; p < PH; p++) tex.add(d * PH + p, 0, d * 72, p * 72, 72, 72);
    }
  }

  makeAtmosphere(WPX, HPX) {
    // soft radial light
    if (!this.textures.exists('softlight')) {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const x = c.getContext('2d');
      const gr = x.createRadialGradient(128, 128, 10, 128, 128, 128);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.55, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
      this.textures.addCanvas('softlight', c);
    }
    // vignette
    if (!this.textures.exists('vignette')) {
      const c = document.createElement('canvas'); c.width = 1280; c.height = 720;
      const x = c.getContext('2d');
      const gr = x.createRadialGradient(640, 360, 250, 640, 360, 760);
      gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.62)');
      x.fillStyle = gr; x.fillRect(0, 0, 1280, 720);
      this.textures.addCanvas('vignette', c);
    }
    // fog noise
    if (!this.textures.exists('fognoise')) {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const x = c.getContext('2d');
      for (let i = 0; i < 240; i++) { x.fillStyle = 'rgba(160,160,190,' + (Math.random() * 0.16) + ')';
        const r = 14 + Math.random() * 44, px = Math.random() * 256, py = Math.random() * 256;
        x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
        x.beginPath(); x.arc((px + 256) % 256 - 256 + 256, py, r, 0, 7); x.fill(); }
      this.textures.addCanvas('fognoise', c);
    }
    if (!this.textures.exists('ember')) {
      const c = document.createElement('canvas'); c.width = c.height = 4;
      c.getContext('2d').fillStyle = '#ffb050'; c.getContext('2d').fillRect(0, 0, 4, 4);
      this.textures.addCanvas('ember', c);
    }
    this.darkRT = this.add.renderTexture(0, 0, 1280, 720).setOrigin(0).setScrollFactor(0).setDepth(90);
    this.lightStamp = this.make.image({ key: 'softlight', add: false });
    this.fog1 = this.add.tileSprite(640, 360, 1280, 720, 'fognoise').setScrollFactor(0).setDepth(91).setAlpha(0.07);
    this.fog2 = this.add.tileSprite(640, 360, 1280, 720, 'fognoise').setScrollFactor(0).setDepth(91).setAlpha(0.045).setTileScale(1.9);
    this.add.image(640, 360, 'vignette').setScrollFactor(0).setDepth(92);
    this.add.particles(640, 730, 'ember', { x: { min: -640, max: 640 }, lifespan: 7000,
      speedY: { min: -26, max: -10 }, speedX: { min: -7, max: 7 }, scale: { start: 0.8, end: 0 },
      alpha: { start: 0.4, end: 0 }, quantity: 1, frequency: 300, blendMode: 'ADD' })
      .setScrollFactor(0).setDepth(89);
    // torch posts (visible flames at light positions)
    this.cityLights = CityMap.lights.map(l => ({ x: l.x * 32, y: l.y * 32, r: l.r }));
    for (const l of this.cityLights) {
      this.add.rectangle(l.x, l.y, 4, 18, 0x2c2118).setOrigin(0.5, 1).setDepth(l.y);
      this.add.circle(l.x, l.y - 22, 4, 0xffc873, 1).setDepth(l.y).setBlendMode(Phaser.BlendModes.ADD);
    }
  }

  // ===================== dialog flows =====================
  signDialog(name, text) {
    CityUI.dialog(name, text, [{ label: 'Leave', fn: () => CityUI.closeDialog() }]);
  }

  innDialog() {
    const GS = window.GameState, P = GS.player, I = Quests.innkeeper, flags = GS.world.flags;
    const N = t => t.replace('{N}', P.nickname);
    const close = () => CityUI.closeDialog();
    const root = () => {
      const opts = [];
      if (flags['q-mq1-empty-cell'] === 'active')
        opts.push({ label: 'Ask about the last champion', fn: () => {
          flags['q-mq1-empty-cell'] = 'done';
          CityUI.dialog(I.name, N(I.rumorFree), [{ label: '"Where did the rest of him go, then?"', fn: paidOffer }, { label: 'Leave', fn: close }], this.portraitInn);
        }});
      if (flags['q-mq1-empty-cell'] === 'done' && !flags['q-mq2-listening-room'])
        opts.push({ label: 'Ask what the road knows', fn: paidOffer });
      if (flags['q-mq2-listening-room'])
        opts.push({ label: 'Anything else?', fn: () => CityUI.dialog(I.name, I.done, [{ label: 'Leave', fn: close }], this.portraitInn) });
      opts.push({ label: 'Leave', fn: close });
      CityUI.dialog(I.name, N(I.greet), opts, this.portraitInn);
    };
    const paidOffer = () => {
      CityUI.dialog(I.name, I.rumorPaidOffer, [
        { label: 'Pay 5 silver', fn: () => {
          if (P.copper < 50) { CityUI.dialog(I.name, I.broke, [{ label: 'Leave', fn: close }], this.portraitInn); return; }
          P.copper -= 50; CityUI.setPurse(P.copper);
          GS.world.flags['q-mq2-listening-room'] = 'active';
          CityUI.dialog(I.name, I.rumorPaid, [{ label: '"The guild, then."', fn: close }], this.portraitInn);
        }},
        { label: 'Not yet', fn: close }], this.portraitInn);
    };
    root();
  }

  guildBoard() {
    const flags = window.GameState.world.flags;
    const note = flags['q-mq2-listening-room'] === 'active'
      ? 'The road ledger confirms it: three travelers logged in, never logged out — all within a day\'s walk of Thorn Grove. The clerk grips the page. "Gates open when the escort\'s back. Days, not weeks." (Main quest continues in Thorn Grove)'
      : 'The board creaks with contracts. The clerk eyes your blood-crusted boots with professional approval.';
    CityUI.guildBoard(true, Quests.guildBoard, note);
  }

  // ===================== helpers =====================
  floatText(x, y, txt, col, size) {
    const t = this.add.text(x, y, txt, { fontFamily: 'Courier New', fontSize: (size || 13) + 'px',
      color: col || '#d8cdb8', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5).setDepth(10000);
    this.tweens.add({ targets: t, y: y - 30, alpha: 0, duration: 2200, onComplete: () => t.destroy() });
  }

  collide(x, y, r) {
    for (const s of this.solids)
      if (x + r > s.x && x - r < s.x + s.w && y + r > s.y && y - r < s.y + s.h) return true;
    return x < 20 || y < 20 || x > CityMap.W * 32 - 20 || y > CityMap.H * 32 - 20;
  }

  tryInteract() {
    if (CityUI.dialogOpen()) return;
    let best = null, bd = 60;
    for (const it of this.interactables) {
      const d = Math.hypot(it.x - this.player.x, it.y - this.player.y);
      if (d < bd) { bd = d; best = it; }
    }
    if (best) best.fn();
  }

  frameFor(face, walkP, moving) {
    let d = Math.round(((face % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2) * 8) % 8;
    const p = moving ? (1 + Math.floor(walkP * 2) % 3) : 0;
    return d * 4 + p;
  }

  update(time, dt) {
    dt = Math.min(0.05, dt / 1000);
    const P = window.GameState.player;

    // ----- player movement (same speed math as the arena) -----
    if (!CityUI.dialogOpen()) {
      const DEX = P.char === 'ronin' ? P.base.DEX + P.kills * 2 : P.base.DEX + 3 * (Math.min(10, P.level) - 1);
      const spd = 185 + (DEX - 10) * 4;
      let mx = (this.keys.A.isDown ? -1 : 0) + (this.keys.D.isDown ? 1 : 0);
      let my = (this.keys.W.isDown ? -1 : 0) + (this.keys.S.isDown ? 1 : 0);
      const m = Math.hypot(mx, my);
      if (m > 0) {
        this.face = Math.atan2(my, mx);
        const nx = this.player.x + mx / m * spd * dt, ny = this.player.y + my / m * spd * dt;
        if (!this.collide(nx, this.player.y, 10)) this.player.x = nx;
        if (!this.collide(this.player.x, ny, 10)) this.player.y = ny;
        this.walkP += spd * dt * 0.011;
      }
      this.player.setFrame(this.frameFor(this.face, this.walkP, m > 0));
      this.player.setDepth(this.player.y);
    }

    // ----- interact prompt -----
    let best = null, bd = 60;
    for (const it of this.interactables) {
      const d = Math.hypot(it.x - this.player.x, it.y - this.player.y);
      if (d < bd) { bd = d; best = it; }
    }
    CityUI.prompt(best && !CityUI.dialogOpen() ? 'E — ' + best.label : null);

    // ----- NPCs wander -----
    for (const n of this.npcs) {
      if (n.pauseT > 0) { n.pauseT -= dt; n.spr.setFrame(this.frameFor(n.face, 0, false)); continue; }
      const dx = n.tx - n.spr.x, dy = n.ty - n.spr.y, d = Math.hypot(dx, dy);
      if (d < 6) { n.pauseT = 1.5 + Math.random() * 4;
        n.tx = (n.zone.x + Math.random() * n.zone.w) * 32; n.ty = (n.zone.y + Math.random() * n.zone.h) * 32; continue; }
      n.face = Math.atan2(dy, dx);
      const ns = 52;
      const nx = n.spr.x + Math.cos(n.face) * ns * dt, ny = n.spr.y + Math.sin(n.face) * ns * dt;
      if (!this.collide(nx, ny, 8)) { n.spr.x = nx; n.spr.y = ny; } else { n.pauseT = 1; n.tx = n.spr.x; n.ty = n.spr.y; }
      n.walkP += ns * dt * 0.011;
      n.spr.setFrame(this.frameFor(n.face, n.walkP, true));
      n.spr.setDepth(n.spr.y);
    }

    // ----- chatter -----
    this.chatterT -= dt;
    if (this.chatterT <= 0) {
      this.chatterT = 5 + Math.random() * 5;
      const cam = this.cameras.main;
      const near = this.npcs.filter(n => Math.abs(n.spr.x - this.player.x) < 400 && Math.abs(n.spr.y - this.player.y) < 280);
      if (near.length) {
        const n = near[Math.floor(Math.random() * near.length)];
        const line = CityMap.chatter[Math.floor(Math.random() * CityMap.chatter.length)].replace('{N}', P.nickname);
        this.floatText(n.spr.x, n.spr.y - 46, '“' + line + '”', '#9a8f80', 11);
      }
    }

    // ----- darkness + lights -----
    const cam = this.cameras.main;
    this.darkRT.clear();
    this.darkRT.fill(0x06040c, 0.84);
    const stamp = this.lightStamp;
    const drawLight = (wx, wy, r) => {
      const sx = wx - cam.scrollX, sy = wy - cam.scrollY;
      if (sx < -r || sy < -r || sx > 1280 + r || sy > 720 + r) return;
      const fl = r * (0.94 + Math.sin(time * 0.011 + wx) * 0.04 + Math.random() * 0.03);
      stamp.setDisplaySize(fl * 2, fl * 2);
      this.darkRT.erase(stamp, sx, sy);
    };
    for (const l of this.cityLights) drawLight(l.x, l.y - 20, l.r);
    for (const w of this.windowLights || []) drawLight(w.x, w.y, w.r);
    drawLight(this.player.x, this.player.y, 135); // the champion carries a torch

    // ----- fog drift -----
    this.fog1.tilePositionX += 9 * dt; this.fog1.tilePositionY += 2.2 * dt;
    this.fog2.tilePositionX -= 5 * dt; this.fog2.tilePositionY += 1.2 * dt;
  }
}
