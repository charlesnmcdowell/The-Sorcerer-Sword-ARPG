// GroveScene — Thorn Grove: the great forest's friendly edge. Giant roots, glowing
// flora, the wood-elf settlement, monster packs (re-skinned arena AI), the ley-line
// node, and the forest dungeon mouth. South gate returns to Karridge.

const GROVE_THEME = { backdrop: '#040a06', star: 'rgba(100,140,110,.10)', ringCol: '70,120,80',
  crowdCol: '127,191,106', floor: '#0c130c', rim: '#3a5a40', rivet: '#9ad0a0', showCrowd: false };

class GroveScene extends WorldScene {
  constructor() { super({ key: 'GroveScene' }); }

  preload() {
    for (const [key, uri] of Object.entries(window.EMBEDDED_ASSETS))
      if (!this.textures.exists(key)) this.load.image(key, uri);
  }

  create() {
    const T = 32, MW = 70, MH = 50, WPX = MW * T, HPX = MH * T;
    this.worldW = WPX; this.worldH = HPX;
    this.worldInit();
    const GS = window.GameState, P = GS.player;
    GS.world.zone = 'thorn-grove';

    // ---------- ground: grass with mossy variation ----------
    const map = this.make.tilemap({ width: MW, height: MH, tileWidth: T, tileHeight: T });
    const tiles = map.addTilesetImage('cainos-grass', undefined, T, T, 0, 0);
    const ground = map.createBlankLayer('ground', tiles).setDepth(0);
    for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++)
      ground.putTileAt([0, 1, 2, 8, 9, 10][Math.floor(Math.random() * 6)], tx, ty);
    ground.forEachTile(t => { t.tint = 0x5a6a52; });

    // ---------- forest edge: tree walls (procedural canopy blobs) ----------
    const treeG = this.add.graphics().setDepth(3);
    const treeWall = (x, y, w, h) => {
      this.solid(x, y, w, h);
      for (let i = 0; i < (w * h) / 900; i++) {
        const cx = x + Math.random() * w, cy = y + Math.random() * h;
        treeG.fillStyle(0x0c1a10, 1); treeG.fillCircle(cx, cy, 22 + Math.random() * 18);
        treeG.fillStyle(0x132615, 1); treeG.fillCircle(cx - 5, cy - 6, 13 + Math.random() * 10);
      }
    };
    treeWall(0, 0, WPX, T * 2);                       // north (deepwood teaser)
    treeWall(0, 0, T * 2, HPX);
    treeWall(WPX - T * 2, 0, T * 2, HPX);
    treeWall(0, HPX - T * 1.5, 31 * T, T * 1.5);      // south, gap at gate
    treeWall(37 * T, HPX - T * 1.5, WPX - 37 * T, T * 1.5);
    // scattered groves
    for (const [gx, gy, gw, gh] of [[8, 8, 8, 6], [50, 6, 10, 7], [10, 32, 9, 7], [56, 30, 9, 8], [26, 12, 6, 5]])
      treeWall(gx * T, gy * T, gw * T, gh * T);

    // giant roots (the grove's signature) — sweeping dark arcs
    const rootG = this.add.graphics().setDepth(2);
    rootG.lineStyle(14, 0x1d140e, 1);
    for (const [x1, y1, cx, cy, x2, y2] of [
      [4 * T, 20 * T, 14 * T, 16 * T, 22 * T, 22 * T], [66 * T, 18 * T, 56 * T, 14 * T, 46 * T, 20 * T],
      [20 * T, 44 * T, 30 * T, 40 * T, 26 * T, 30 * T], [50 * T, 46 * T, 44 * T, 38 * T, 52 * T, 32 * T]]) {
      const c = new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(x1, y1), new Phaser.Math.Vector2(cx, cy), new Phaser.Math.Vector2(x2, y2));
      c.draw(rootG);
    }

    // glowing flora
    this.makeAtmosphere({ darkness: 0.8, darkCol: 0x030a05, fogTint: 0x9ab8a0, emberCol: '#9ad0ff' });
    for (let i = 0; i < 26; i++) {
      const fx = (3 + Math.random() * (MW - 6)) * T, fy = (3 + Math.random() * (MH - 6)) * T;
      if (this.collide(fx, fy, 12)) continue;
      const hue = Math.random() < 0.5 ? 0x7fd0ff : 0x9af0c0;
      this.add.circle(fx, fy, 3 + Math.random() * 3, hue, 0.9).setDepth(fy).setBlendMode(Phaser.BlendModes.ADD);
      this.addLight(fx, fy + 18, 55, false);
    }

    // ---------- wood-elf settlement (NE) ----------
    const setX = 56, setY = 12;
    for (const [hx, hy] of [[setX, setY], [setX + 5, setY + 3], [setX - 4, setY + 4]]) {
      const g = this.add.graphics().setDepth((hy + 3) * T);
      g.fillStyle(0x1a2416); g.fillCircle(hx * T, hy * T, 40);          // leaf-dome hut
      g.fillStyle(0x24301c); g.fillCircle(hx * T - 8, hy * T - 10, 26);
      g.fillStyle(0x120d08); g.fillRect(hx * T - 8, hy * T + 22, 16, 18); // door
      this.solid(hx * T - 36, hy * T - 30, 72, 56);
      this.addLight(hx * T, hy * T + 30, 90, false);
    }
    // grove keeper (Faelar's people — Faelar himself is a Bucket 6 companion)
    this.bakeFrames();
    const keeper = this.add.sprite(setX * T - 2 * T, (setY + 5) * T, 'fr-elf', 0).setDepth((setY + 5) * T);
    this.interactables.push({ x: keeper.x, y: keeper.y, label: 'speak with the grove keeper', fn: () => this.keeperDialog() });

    // ---------- ley-line node (B5 quest landmark) ----------
    const nodeX = 12 * T, nodeY = 14 * T;
    const nodeC = this.add.circle(nodeX, nodeY, 26, 0x3df0c8, 0.18).setDepth(nodeY).setBlendMode(Phaser.BlendModes.ADD);
    this.add.circle(nodeX, nodeY, 8, 0x3df0c8, 0.7).setDepth(nodeY).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: nodeC, scale: 1.35, alpha: 0.06, duration: 1800, yoyo: true, repeat: -1 });
    this.addLight(nodeX, nodeY, 120, false);
    this.interactables.push({ x: nodeX, y: nodeY, label: 'touch the ley-line node', fn: () =>
      this.signDialog('LEY-LINE NODE', 'The current here runs WRONG — pulled thin, like a vein tapped upstream. The wood-elves feel it too. Something is drinking from the line.' +
        (window.GameState.world.flags['q-mq2-listening-room'] === 'active' ? ' The grove keeper watches you read the water. "So. You see it too."' : '')) });

    // ---------- the dungeon mouth (SE) ----------
    const dgX = 62 * T, dgY = 42 * T;
    const dg = this.add.graphics().setDepth(dgY);
    dg.fillStyle(0x0a0c0a); dg.fillEllipse(dgX, dgY, 84, 56);
    dg.fillStyle(0x000000); dg.fillEllipse(dgX, dgY + 4, 56, 36);
    dg.lineStyle(4, 0x1d2a1d); dg.strokeEllipse(dgX, dgY, 84, 56);
    this.addLight(dgX, dgY, 80, false);
    this.interactables.push({ x: dgX, y: dgY, label: 'descend into the root-hollow', fn: () => {
      window.GameState.world.zone = 'grove-dungeon'; this.scene.start('DungeonScene'); } });

    // ---------- monster packs ----------
    this.packs = [];
    const mkPack = (px, py, kind) => {
      const defs = {
        wolves: { tex: 'fr-wolf', n: 3 + Math.floor(Math.random() * 2), name: 'WOLVES OF THE EDGE', sub: 'the pack circles',
          spawn: n => Array.from({ length: n }, (_, i) => ({ type: 'hound', x: 640 + Math.cos(i * 2.1) * 200, y: 300 + Math.sin(i * 2.1) * 120,
            hp: 66, maxhp: 66, spd: 200, r: 11, col: '#3a4a3c', dmgScale: 1 })), quest: 'g-wolves' },
        hounds: { tex: 'fr-hound', n: 3 + Math.floor(Math.random() * 2), name: 'FERAL PIT HOUNDS', sub: 'they remember the sand',
          spawn: n => Array.from({ length: n }, (_, i) => ({ type: 'hound', x: 640 + Math.cos(i * 2.6) * 220, y: 320 + Math.sin(i * 2.6) * 130,
            hp: 80, maxhp: 80, spd: 210, r: 12, col: '#4a4038', dmgScale: 1.15 })), quest: 'g-hounds' },
        shaman: { tex: 'fr-shaman', n: 1, name: 'THE ROT SHAMAN', sub: 'the forest\'s dead answer it',
          spawn: () => [{ type: 'necro', x: 640, y: 260, hp: 180, maxhp: 180, spd: 100, r: 15, col: '#3c4434', dmgScale: 1.2 }], quest: 'g-rotshaman' },
      };
      const d = defs[kind];
      const sprs = [];
      for (let i = 0; i < d.n; i++) {
        const s = this.add.sprite(px + (Math.random() - 0.5) * 70, py + (Math.random() - 0.5) * 70, d.tex, 0);
        s.setDepth(s.y); sprs.push(s);
      }
      this.packs.push({ x: px, y: py, kind, def: d, sprs, alive: true, wanderT: 0 });
    };
    const packSpots = { wolves: [[20, 26], [36, 10], [8, 44]], hounds: [[44, 34], [24, 40]], shaman: [[30, 22]] };
    for (const [kind, spots] of Object.entries(packSpots))
      for (const [sx, sy] of spots) {
        const id = 'pack-' + kind + '-' + sx + '-' + sy;
        if (!GS.world.flags[id]) mkPack(sx * T, sy * T, kind);
        else continue;
        this.packs[this.packs.length - 1].id = id;
      }

    // ---------- chests ----------
    const propsTex = this.textures.get('cainos-props');
    if (!propsTex.has('chest')) propsTex.add('chest', 0, 96, 32, 64, 64);
    const groveChests = [
      { x: 9, y: 10, loot: { type: 'potion-con', label: 'CON Potion (+25%, 60s)' } },
      { x: 52, y: 44, loot: { type: 'artifact', id: 'coalheart', label: 'COALHEART — +10% max HP (permanent)' } },
    ];
    for (const c of groveChests) {
      const id = 'gchest-' + c.x + '-' + c.y;
      const img = this.add.image(c.x * T, c.y * T, 'cainos-props', 'chest').setOrigin(0.5, 1).setDepth(c.y * T).setScale(0.8);
      if (GS.world.chestsOpened.includes(id)) img.setTint(0x555555);
      this.interactables.push({ x: c.x * T, y: c.y * T, label: 'open the chest', fn: () => {
        if (GS.world.chestsOpened.includes(id)) { this.floatText(c.x * T, c.y * T - 40, 'empty', '#6b5d4f'); return; }
        GS.world.chestsOpened.push(id); img.setTint(0x555555);
        this.grantLoot(c.loot, c.x * T, c.y * T);
      }});
    }

    // ---------- player + travel ----------
    const spawn = GS.world.groveFromCity !== false ? { x: 34 * T, y: (MH - 4) * T } : { x: 34 * T, y: (MH - 4) * T };
    GS.world.groveFromCity = false;
    this.spawnPlayer(spawn.x, spawn.y);
    this.gateSouth = { x: 31 * T, y: HPX - T * 1.5, w: 6 * T, h: T * 1.5 };
    this.initEncounterHost(GROVE_THEME);
    this.cameras.main.setBounds(0, 0, WPX, HPX).startFollow(this.player, true, 0.12, 0.12);
    this.floatText(spawn.x, spawn.y - 60, 'THORN GROVE', '#7fbf6a', 18);
  }

  grantLoot(loot, x, y) {
    const P = window.GameState.player;
    if (loot.type === 'copper') { P.copper += loot.amount; CityUI.setPurse(P.copper);
      this.floatText(x, y - 40, '+' + Money.fmt(loot.amount), '#e7b450'); }
    else if (loot.type === 'artifact') { P.artifacts.push(loot.id);
      this.floatText(x, y - 40, loot.label, '#3df0c8', 15); }
    else if (P.belt.length < 8) { P.belt.push(loot); CityUI.belt(P.belt);
      this.floatText(x, y - 40, loot.label, '#7fbf6a'); }
    else this.floatText(x, y - 40, 'belt is full', '#c8443a');
  }

  keeperDialog() {
    const flags = window.GameState.world.flags;
    const base = 'A wood elf with bark-braided hair sizes you up. "The pit-crowned. Word outruns you." ';
    const text = flags['q-mq2-listening-room'] === 'active'
      ? base + '"The line runs thin and the dead walk our edge. There is a camp by no road, west past the node — men who are not woodsmen, crates that are not goods. The Eldest will not act beyond Deepwood\'s shade. You might." (The trail sharpens in the next stretch of the hunt — Bucket 5.)'
      : base + '"Wolves grow bold and something fouls the dead. The guild posts coin for both. Earn the grove\'s trust, champion."';
    this.signDialog('GROVE KEEPER', text);
  }

  update(time, dtMs) {
    const dt = Math.min(0.05, dtMs / 1000);
    if (this.updateEncounter(time)) return;
    this.updatePlayer(dt);
    this.updatePrompt();
    this.updateAtmosphere(time, dt);

    // pack wander + aggro
    for (const pk of this.packs) {
      if (!pk.alive) continue;
      pk.wanderT -= dt;
      for (const s of pk.sprs) {
        if (pk.wanderT <= 0) { s.tx = pk.x + (Math.random() - 0.5) * 110; s.ty = pk.y + (Math.random() - 0.5) * 110; }
        if (s.tx !== undefined) {
          const dx = s.tx - s.x, dy = s.ty - s.y, d = Math.hypot(dx, dy);
          if (d > 4) { const f = Math.atan2(dy, dx);
            s.x += Math.cos(f) * 40 * dt; s.y += Math.sin(f) * 40 * dt;
            s.setFrame(this.frameFor(f, time * 0.004, true)); s.setDepth(s.y); }
        }
      }
      if (pk.wanderT <= 0) pk.wanderT = 2 + Math.random() * 3;
      const d = Math.hypot(pk.sprs[0].x - this.player.x, pk.sprs[0].y - this.player.y);
      if (d < 130) {
        pk.alive = false;
        this.startEncounter(pk.def.name, pk.def.sub, pk.def.spawn(pk.def.n), win => {
          if (win) {
            for (const s of pk.sprs) s.destroy();
            window.GameState.world.flags[pk.id] = 'cleared';
            const counts = window.GameState.world.questCounts;
            counts[pk.def.quest] = (counts[pk.def.quest] || 0) + pk.def.n;
            this.floatText(this.player.x, this.player.y - 50, pk.def.name + ' — cleared (' + counts[pk.def.quest] + ' logged)', '#7fbf6a');
            if (Math.random() < 0.5) this.grantLoot({ type: 'potion-health', label: 'Health Potion' }, this.player.x + 30, this.player.y);
          } else {
            pk.alive = true; // the pack holds its ground; the forest spat you out
            this.player.x = 34 * 32; this.player.y = (50 - 4) * 32;
            this.floatText(this.player.x, this.player.y - 50, 'dragged back to the treeline, breathing', '#c8443a');
          }
        });
      }
    }

    // south gate → city
    if (this.player.y > this.gateSouth.y - 10 &&
        this.player.x > this.gateSouth.x - 8 && this.player.x < this.gateSouth.x + this.gateSouth.w + 8) {
      window.GameState.world.cityFromGrove = true;
      this.scene.start('CityScene');
    }
  }
}
