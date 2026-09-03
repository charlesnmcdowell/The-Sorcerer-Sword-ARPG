// Code-generated VFX vocabulary (§1a): portrait motion is the primary feel
// channel; effect atoms cover every skill so no mechanic is visually silent.
(function () {
'use strict';
globalThis.ADV = globalThis.ADV || {};

const VFX = {};

// ---- portrait motion atoms --------------------------------------------------
VFX.lunge = function (scene, obj, dir, done) {  // dir: +1 rightward (attacker side a)
  const x0 = obj.x;
  scene.tweens.add({ targets: obj, x: x0 + 26 * dir, duration: 110, yoyo: true, ease: 'Power2', onComplete: done });
};
VFX.recoil = function (scene, obj, dir) {
  const x0 = obj.x;
  scene.tweens.add({ targets: obj, x: x0 - 14 * dir, duration: 70, yoyo: true, ease: 'Power1' });
};
VFX.shake = function (scene, obj) {
  const x0 = obj.x;
  scene.tweens.add({ targets: obj, x: x0 + 6, duration: 40, yoyo: true, repeat: 5, onComplete: () => { obj.x = x0; } });
};
VFX.tintFlash = function (scene, img, color) {
  if (!img.setTintFill) return;
  img.setTintFill(color);
  if (img.__tintTimer) img.__tintTimer.remove(false);
  img.__tintTimer = scene.time.delayedCall(110, () => {
    img.__tintTimer = null;
    try { if (img.__baseTint != null) img.setTint(img.__baseTint); else img.clearTint(); } catch (e) {}
  });
};
VFX.desaturate = function (img) { try { img.setTint(0x555555); } catch (e) {} };
VFX.scalePunch = function (scene, obj) {
  scene.tweens.add({ targets: obj, scaleX: obj.scaleX * 1.18, scaleY: obj.scaleY * 1.18, duration: 90, yoyo: true });
};
VFX.driftPulse = function (scene, obj) {
  scene.tweens.add({ targets: obj, y: obj.y - 4, duration: 500, yoyo: true, repeat: 1 });
};

// ---- screen-space -----------------------------------------------------------
VFX.camShake = function (scene, mag) { scene.cameras.main.shake(140, mag || 0.006); };
VFX.zoomPunch = function (scene) {
  const cam = scene.cameras.main;
  scene.tweens.add({ targets: cam, zoom: 1.03, duration: 90, yoyo: true, onComplete: () => cam.setZoom(1) });
};
VFX.flashOverlay = function (scene, color, alpha) {
  const r = scene.add.rectangle(ADV.T.W / 2, ADV.T.H / 2, ADV.T.W, ADV.T.H, color, alpha || 0.18).setDepth(999);
  scene.tweens.add({ targets: r, alpha: 0, duration: 260, onComplete: () => r.destroy() });
};

// ---- projectile / arc / burst atoms ----------------------------------------
VFX.projectile = function (scene, x1, y1, x2, y2, color, done) {
  const dot = scene.add.circle(x1, y1, 6, color).setDepth(500);
  const trail = [];
  scene.tweens.add({
    targets: dot, x: x2, y: y2, duration: 220, ease: 'Power1',
    onUpdate: () => {
      const t = scene.add.circle(dot.x, dot.y, 3, color, 0.5).setDepth(499);
      trail.push(t);
      scene.tweens.add({ targets: t, alpha: 0, duration: 200, onComplete: () => t.destroy() });
    },
    onComplete: () => { dot.destroy(); VFX.burst(scene, x2, y2, color); if (done) done(); },
  });
};
VFX.slashArc = function (scene, x, y, color) {
  const g = scene.add.graphics().setDepth(500);
  g.lineStyle(4, color || 0xe8dfc8, 1);
  g.beginPath(); g.arc(x, y, 40, -2.2, -0.4); g.strokePath();
  g.setAngle(-20);
  scene.tweens.add({ targets: g, angle: 50, alpha: 0, duration: 240, onComplete: () => g.destroy() });
};
VFX.burst = function (scene, x, y, color, n) {
  for (let i = 0; i < (n || 10); i++) {
    const a = Math.random() * Math.PI * 2, d = 18 + Math.random() * 26;
    const p = scene.add.rectangle(x, y, 5, 5, color).setDepth(500);
    scene.tweens.add({ targets: p, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, alpha: 0, duration: 300 + Math.random() * 150, onComplete: () => p.destroy() });
  }
};
VFX.aura = function (scene, x, y, color) {
  const ring = scene.add.circle(x, y, 30, color, 0).setStrokeStyle(3, color, 0.9).setDepth(500);
  scene.tweens.add({ targets: ring, scale: 2, alpha: 0, duration: 480, onComplete: () => ring.destroy() });
};
VFX.healSparkle = function (scene, x, y) {
  for (let i = 0; i < 8; i++) {
    const p = scene.add.star(x + (Math.random() - 0.5) * 50, y + 20 + Math.random() * 30, 4, 2, 5, 0x83b56b).setDepth(500);
    scene.tweens.add({ targets: p, y: p.y - 46, alpha: 0, duration: 520 + Math.random() * 200, onComplete: () => p.destroy() });
  }
};
VFX.damageNumber = function (scene, x, y, val, color) {
  const t = scene.add.text(x, y, String(val), {
    fontFamily: ADV.T.font.display, fontSize: '22px', color: color || '#f4eee0', fontStyle: 'bold',
    stroke: '#000000', strokeThickness: 3,
  }).setOrigin(0.5).setDepth(600);
  scene.tweens.add({ targets: t, y: y - 44, alpha: 0, duration: 800, ease: 'Power1', onComplete: () => t.destroy() });
};

// Skill id -> default atom mapping (§1a: pair each primitive with a default)
VFX.skillColor = function (skillId) {
  const m = {
    fire_bolt: 0xe86a30, frost_touch: 0x6fc0e8, aimed_shot: 0xd8d0b8, snare: 0x83b56b,
    backstab: 0xd8574a, cleave: 0xe8dfc8, sunder: 0xd4a94e, katana_slash: 0xcfd8e8,
    blood_pact: 0xa8352c, regenerate: 0x83b56b, mend: 0x83b56b, triage: 0x83b56b,
    basic_attack: 0xd8d0b8,
  };
  return m[skillId] || 0xd8d0b8;
};
VFX.isProjectile = function (skillId) {
  return ['fire_bolt', 'frost_touch', 'aimed_shot', 'snare', 'blood_pact'].includes(skillId);
};

ADV.VFX = VFX;
})();
