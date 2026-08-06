/* TitleScene — the pit backdrop, the two combatants sizing each other up, embers. */
class TitleScene extends Phaser.Scene {
  constructor() { super("Title"); }
  create() {
    const far = this.add.image(640, 300, "bg_far_1");
    far.setScale(Math.max(1280 / far.width, 620 / far.height) * 1.05);
    const floor = this.add.image(640, 660, "bg_floor_1");
    floor.setScale(Math.max(1280 / floor.width, 260 / (floor.height * 0.4)));
    this.add.rectangle(640, 360, 1280, 720, 0x0c0806, 0.45);

    const wl = Spire.spawn(this, "wl_idle", 330, 640, { depth: 10, height: 330 });
    const hd = Spire.spawn(this, "hd_idle", 950, 640, { depth: 10, height: 230, flipX: true });  // hound art natively faces right; mirror him toward her

    this.add.particles(0, 0, "dot", {
      x: { min: 0, max: 1280 }, y: 730, lifespan: 5200, speedY: { min: -42, max: -14 },
      speedX: { min: -8, max: 14 }, scale: { start: 0.5, end: 0 }, quantity: 1, frequency: 220,
      tint: [0xff9944, 0xe0b34a, 0xcc5522], alpha: { start: 0.85, end: 0 }, blendMode: "ADD"
    }).setDepth(15);

    this.add.text(640, 200, "THE SORCERER SWORD", {
      fontFamily: "Georgia, serif", fontSize: 64, color: "#e8cfa8",
      stroke: "#4a2c18", strokeThickness: 8, shadow: { offsetY: 4, color: "#000", blur: 10, fill: true }
    }).setOrigin(0.5).setDepth(20);
    this.add.text(640, 258, "— S P I R E   O F   K A R R I D G E —", {
      fontFamily: "Georgia, serif", fontSize: 22, color: "#e0b34a"
    }).setOrigin(0.5).setDepth(20);
    this.add.text(640, 296, "a warlock deck-builder", {
      fontFamily: "Georgia, serif", fontSize: 16, fontStyle: "italic", color: "#caa26a"
    }).setOrigin(0.5).setDepth(20);

    const climbing = Spire.run && !Spire.run.over && (Spire.run.pos !== null || Spire.run.act > 1);
    const btn = this.add.container(640, 470).setDepth(20);
    const bg = this.add.rectangle(0, 0, climbing ? 320 : 260, 58, 0x3a2420, 0.92).setStrokeStyle(2, 0xe0b34a);
    const txt = this.add.text(0, 0, climbing ? "CONTINUE THE ROAD" : "ENTER THE PIT", { fontFamily: "Georgia, serif", fontSize: 24, color: "#e8cfa8" }).setOrigin(0.5);
    btn.add([bg, txt]);
    let fresh = false;
    bg.setInteractive({ useHandCursor: true })
      .on("pointerover", () => { bg.setFillStyle(0x5a3426, 0.95); txt.setColor("#ffe9bb"); })
      .on("pointerout", () => { bg.setFillStyle(0x3a2420, 0.92); txt.setColor("#e8cfa8"); })
      .on("pointerdown", () => {
        Spire.sfx.click();
        Spire.startMusic();
        fresh = !Spire.run || Spire.run.over;
        if (fresh) Spire.newRun();
        this.cameras.main.fadeOut(350);
      });
    /* a fresh run opens on the original pit game's telling: the narrator's warlock,
       and Marlow's word about the vanished champion -- then the Pit map. A continued run goes straight back. */
    this.cameras.main.once("camerafadeoutcomplete", () => {
      if (fresh) this.scene.start("Story", { lines: Spire.ACTS[1].intro, title: Spire.ACTS[1].tag, next: "Map" });
      else this.scene.start("Map");
    });
    this.tweens.add({ targets: btn, y: 476, duration: 1300, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    this.add.text(640, 700, "Acts I–III: the Pit · the City · the West Road  —  story & voices: the original Pit of Karridge", {
      fontFamily: "Georgia, serif", fontSize: 12, color: "#6a5844"
    }).setOrigin(0.5).setDepth(20);
  }
}
