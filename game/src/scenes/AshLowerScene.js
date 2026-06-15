// AshLowerScene — the ASHENVEIL ACADEMY LOWER LEVELS (item 13, raid zone shell).
// "the lower levels are NOT a metaphor." Beneath the dark academy: a stone undercroft
// of cold cells, ledger-vaults and a sealed deep door the web keeps for its worst work.
// SHELL ONLY (increment 1): reachable from AshenveilScene's stairs, atmosphere + a
// "you descend" beat + flavor signs, NO encounters yet (packs/mini-boss/boss land in
// following increments). Reuses the WorldScene base + the undead HP tier.
class AshLowerScene extends WorldScene {
  constructor() { super({ key: 'AshLowerScene' }); }

  preload() {
    for (const [key, uri] of Object.entries(window.EMBEDDED_ASSETS))
      if (!this.textures.exists(key)) this.load.image(key, uri);
  }

  create() {
    const T = 32, MW = 40, MH = 28, WPX = MW * T, HPX = MH * T;
    this.worldW = WPX; this.worldH = HPX;
    this.worldInit();
    const GS = window.GameState, flags = GS.world.flags;
    GS.world.zone = 'ash-lower';

    // ---------- ground: a cold flagstone undercroft ----------
    const floor = this.add.graphics().setDepth(0);
    floor.fillStyle(0x14121a, 1); floor.fillRect(0, 0, WPX, HPX);
    floor.lineStyle(1, 0x221e2a, 1);
    for (let x = 0; x <= MW; x++) floor.lineBetween(x * T, 0, x * T, HPX);
    for (let y = 0; y <= MH; y++) floor.lineBetween(0, y * T, WPX, y * T);
    // a few darker, water-stained flagstones
    floor.fillStyle(0x0e0c14, 0.7);
    for (let i = 0; i < 40; i++) {
      const fx = (1 + Math.random() * (MW - 2)) | 0, fy = (1 + Math.random() * (MH - 2)) | 0;
      floor.fillRect(fx * T + 2, fy * T + 2, T - 4, T - 4);
    }

    // ---------- stone walls: a bordered chamber with cell stubs ----------
    const wallG = this.add.graphics().setDepth(3);
    const wall = (x, y, w, h) => {
      this.solid(x, y, w, h);
      wallG.fillStyle(0x2a2632, 1); wallG.fillRect(x, y, w, h);
      wallG.lineStyle(1, 0x3a3446, 0.8); wallG.strokeRect(x, y, w, h);
    };
    wall(0, 0, WPX, T);                      // north
    wall(0, HPX - T, WPX, T);                // south
    wall(0, 0, T, HPX);                      // west
    wall(WPX - T, 0, T, HPX);                // east
    // cell partitions down the west wall (cold cells — empty for now)
    for (const cy of [4, 9, 14, 19]) { wall(T, cy * T, 6 * T, T * 0.6); wall(7 * T, cy * T, T, 4 * T); }
    // a central ledger-vault block
    wall(22 * T, 11 * T, 6 * T, 5 * T);

    // cold green atmosphere — the academy's colour, carried underground
    this.makeAtmosphere({ darkness: 0.9, darkCol: 0x05040a, fogTint: 0x6a7a90, emberCol: '#9af0c0' });
    for (let i = 0; i < 12; i++) {           // grave-lanterns down the rows
      const lx = (3 + Math.random() * (MW - 6)) * T, ly = (3 + Math.random() * (MH - 6)) * T;
      if (this.collide(lx, ly, 12)) continue;
      this.add.circle(lx, ly, 2.5, 0x9af0c0, 0.8).setDepth(ly).setBlendMode(Phaser.BlendModes.ADD);
      this.addLight(lx, ly + 12, 55, false);
    }

    this.bakeFrames({});

    // ---------- flavor signs (text-only narration; unvoiced, like the surface signs) ----------
    this.interactables.push({ x: 4 * T, y: 5 * T, label: 'look into the cold cells', fn: () =>
      this.signDialog('THE COLD CELLS', 'A row of stone cells, swept clean and recently. No bars — the doors are slabs, and the slabs are open. Whatever the web keeps down here, it does not keep behind locks. On one threshold someone has chalked a tally and then, neatly, crossed every mark out.') });
    this.interactables.push({ x: 25 * T, y: 17 * T, label: 'read the ledger-vault plaque', fn: () =>
      this.signDialog('THE LEDGER-VAULT', 'A squat block of dressed stone, sealed with green wax over a hundred old seals. The plaque reads: ASHENVEIL ACQUISITIONS — DO NOT RENDER WITHOUT WRIT. Below, in a tidier hand: every name the academy ever bought, and the price it paid in quiet. The wax is unbroken. For now.') });

    // ---------- the sealed deep door (foreshadows the raid; inert in the shell) ----------
    const ddx = 20 * T, ddy = 2 * T;
    const dg = this.add.graphics().setDepth(ddy + 1);
    dg.fillStyle(0x1a1622, 1); dg.fillRect(ddx - 30, ddy - 6, 60, 44);
    dg.lineStyle(3, 0x9af0c0, 0.7); dg.strokeRect(ddx - 30, ddy - 6, 60, 44);
    dg.lineStyle(2, 0x9af0c0, 0.45); dg.lineBetween(ddx, ddy - 6, ddx, ddy + 38);
    this.addLight(ddx, ddy + 16, 90, false);
    this.add.text(ddx, ddy - 20, 'THE DEEP DOOR', { fontFamily: 'Courier New', fontSize: '10px', color: '#9af0c0' }).setOrigin(0.5).setDepth(ddy + 2);
    this.interactables.push({ x: ddx, y: ddy + 38, label: 'try the sealed DEEP DOOR', fn: () =>
      this.signDialog('THE DEEP DOOR', 'A black slab taller than two men, ringed in academy-green light, with no handle and no hinge you can find. It is warm. Something on the far side keeps it warm. It does not open for you — not today. A line is scratched at eye height: "the web saves its worst work for the last room." You make a note to come back when you are harder to kill.') });

    // ---------- player + the stairs back up to Ashenveil ----------
    this.spawnPlayer(20 * T, (MH - 3) * T);
    this.territoryHpMult = 4; // undead tier (Hiro HP ladder) — for the encounters to come
    const sg = this.add.graphics().setDepth((MH - 3) * T);
    sg.fillStyle(0x0c0a12, 1); sg.fillRect(20 * T - 30, (MH - 2.4) * T - 14, 60, 28);
    sg.lineStyle(1, 0x9af0c0, 0.6); sg.strokeRect(20 * T - 30, (MH - 2.4) * T - 14, 60, 28);
    for (let i = 0; i < 4; i++) { sg.lineStyle(1, 0x9af0c0, 0.4); sg.lineBetween(20 * T - 26 + i * 13, (MH - 2.4) * T - 10, 20 * T - 26 + i * 13, (MH - 2.4) * T + 8); }
    this.add.text(20 * T, (MH - 2.4) * T - 22, 'STAIRS UP', { fontFamily: 'Courier New', fontSize: '9px', color: '#9af0c0' }).setOrigin(0.5).setDepth((MH - 2.4) * T + 2);
    this.interactables.push({ x: 20 * T, y: (MH - 2.4) * T, label: 'climb the stairs back to the Ashenveil', fn: () => {
      GS.world.zone = 'ashenveil';
      this.scene.start('AshenveilScene');
    }});

    this.initEncounterHost(null);
    this.cameras.main.setBounds(0, 0, WPX, HPX).startFollow(this.player, true, 0.12, 0.12);
    this.floatText(this.player.x, this.player.y - 60, 'THE LOWER LEVELS', '#9af0c0', 18);
    this.introPan();
    if (!flags['ash-lower-arrived']) { flags['ash-lower-arrived'] = true;
      this.floatText(this.player.x, this.player.y - 44, 'JOURNAL — THE LOWER LEVELS', '#9af0c0', 13);
      this.signDialog('YOU DESCEND', 'The stair turns twice and the green light follows you down, pooling on stone that has never seen a sun. The air goes still and cold and faintly sweet, the way a ledger smells the moment before it is balanced. Empty cells. A sealed vault. A door at the far end that keeps itself warm. The boundary stone did not lie: the lower levels are not a metaphor. They are simply lower — and they are waiting.'); }
  }

  update(time, dtMs) {
    const dt = Math.min(0.05, dtMs / 1000);
    if (this.updateEncounter(time)) return;
    this.updatePlayer(dt);
    this.updateFollower(dt);
    this.updateNPCs(dt);
    this.updatePrompt();
    this.updateAtmosphere(time, dt);
  }
}
