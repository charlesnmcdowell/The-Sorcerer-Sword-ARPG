// Procedural bust portraits (§1a placeholder pipeline).
// JRPG bust crop: head + hair dominate ~60% of frame height, eye line fixed,
// one lighting key, flat palette-shiftable background. Deterministic per seed,
// so generated NPCs keep their face forever. Real art swaps in later by
// replacing textures keyed the same way (see PORTRAIT_MANIFEST note in README).
(function () {
'use strict';
globalThis.ADV = globalThis.ADV || {};

const W = 220, H = 280;
const EYE_Y = 118;            // identical eye line across every portrait (§1a)

const SKIN = {
  deep:   ['#3a2418', '#4a3020'],
  dark:   ['#5a3a26', '#6b4630'],
  brown:  ['#8a5c3a', '#9c6c48'],
  tan:    ['#a5714a', '#b78257'],
  gold:   ['#c8a078', '#d4b088'],
  olive:  ['#b8926a', '#c9a47c'],
  fair:   ['#c9976b', '#d9a97c'],
  pale:   ['#d8ab87', '#e5bc97'],
  ashen:  ['#9a9a8a', '#ababa0'],
};
const HAIR_COLORS = ['#120e0c', '#191410', '#2e2013', '#4a2f18', '#6b4423', '#8a6a3a', '#3a3a3f', '#7a7a72', '#8a3020', '#b8b4a6', '#5a2030'];
const BG = ['#43506088', '#50435f88', '#435f4e88', '#5f524388', '#5f434388', '#43585f88'];

function rngFor(seed) { return new ADV.RNG((seed >>> 0) || 1); }

// ---- drawing primitives ----------------------------------------------------
function shade(hex, f) {
  const n = parseInt(hex.slice(1, 7), 16);
  const r = Math.min(255, Math.max(0, Math.round(((n >> 16) & 255) * f)));
  const g = Math.min(255, Math.max(0, Math.round(((n >> 8) & 255) * f)));
  const b = Math.min(255, Math.max(0, Math.round((n & 255) * f)));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function chinYOf(o) {
  return o.sex === 'f' ? EYE_Y + 38 : EYE_Y + 42 + (o.jaw || 0) * 2;
}

function drawNeck(ctx, o, cx, skin) {
  const chinY = chinYOf(o);
  const topW = 18;
  const botW = o.sex === 'f' ? 30 : 26;
  ctx.fillStyle = shade(skin, o.sex === 'f' ? 1.02 : 0.92);
  ctx.beginPath();
  ctx.moveTo(cx - topW / 2, chinY - 2);
  ctx.lineTo(cx + topW / 2, chinY - 2);
  ctx.lineTo(cx + botW / 2, chinY + 44);
  ctx.lineTo(cx - botW / 2, chinY + 44);
  ctx.closePath();
  ctx.fill();
  if (o.sex === 'f') {
    ctx.strokeStyle = shade(skin, 0.88);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx - 5, chinY + 32);
    ctx.quadraticCurveTo(cx - 16, chinY + 36, cx - 28, chinY + 34);
    ctx.moveTo(cx + 5, chinY + 32);
    ctx.quadraticCurveTo(cx + 16, chinY + 36, cx + 28, chinY + 34);
    ctx.stroke();
  }
}

function drawBust(ctx, o) {
  // o: {bg, skin:[base,hi], hairColor, hairStyle, sex, wardrobe, eyes, jaw, extras}
  ctx.clearRect(0, 0, W, H);
  // flat background with subtle grade (§1a)
  ctx.fillStyle = o.bg || BG[0];
  ctx.fillRect(0, 0, W, H);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(255,255,255,0.06)');
  grad.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

  const cx = W / 2;
  const skin = o.skin[0];
  const headW = 46 + o.jaw * 4, headH = 60;
  const chinY = chinYOf(o);

  // torso, then hair behind the body, then the neck in front of the hair so
  // hanging locks cannot sit on the chin (that reads as a beard).
  drawWardrobe(ctx, o, cx);
  ctx.fillStyle = o.hairColor;
  hairBack(ctx, o, cx, headW);
  drawNeck(ctx, o, cx, skin);

  // head
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(cx, EYE_Y + 2, headW / 2 + 6, headH / 2 + 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // jaw taper — women stay round so hair cannot fill a pointed chin
  ctx.beginPath();
  ctx.moveTo(cx - headW / 2 - 4, EYE_Y + 8);
  ctx.quadraticCurveTo(cx - headW / 2 - (o.sex === 'f' ? 2 : 0), EYE_Y + (o.sex === 'f' ? 30 : 36), cx, chinY);
  ctx.quadraticCurveTo(cx + headW / 2 + (o.sex === 'f' ? 2 : 0), EYE_Y + (o.sex === 'f' ? 30 : 36), cx + headW / 2 + 4, EYE_Y + 8);
  ctx.fill();
  // lighting key: consistent left-high light, right shade (§1a)
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(cx + headW / 4 + 4, EYE_Y + 6, headW / 3.2, headH / 2 + 8, 0, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.beginPath();
  ctx.ellipse(cx - headW / 4, EYE_Y - 12, headW / 4, headH / 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // ears
  ctx.fillStyle = shade(skin, 0.92);
  ctx.beginPath(); ctx.ellipse(cx - headW / 2 - 5, EYE_Y + 6, 5, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + headW / 2 + 5, EYE_Y + 6, 5, 9, 0, 0, Math.PI * 2); ctx.fill();

  // eyes on the fixed line
  const eyeDX = 14;
  for (const s of [-1, 1]) {
    ctx.fillStyle = '#f2ede2';
    ctx.beginPath(); ctx.ellipse(cx + s * eyeDX, EYE_Y, 7.5, o.sex === 'f' ? 5.5 : 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = o.eyes;
    ctx.beginPath(); ctx.arc(cx + s * eyeDX + 1, EYE_Y, 3.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#131313';
    ctx.beginPath(); ctx.arc(cx + s * eyeDX + 1, EYE_Y, 1.7, 0, Math.PI * 2); ctx.fill();
    // lid line
    ctx.strokeStyle = shade(skin, 0.55); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(cx + s * eyeDX - 7, EYE_Y - 4); ctx.quadraticCurveTo(cx + s * eyeDX, EYE_Y - 7, cx + s * eyeDX + 7, EYE_Y - 4); ctx.stroke();
    // brow
    ctx.strokeStyle = shade(o.hairColor, 0.8); ctx.lineWidth = o.sex === 'f' ? 2 : 3;
    ctx.beginPath();
    ctx.moveTo(cx + s * (eyeDX - 8), EYE_Y - 11 + o.brow);
    ctx.quadraticCurveTo(cx + s * eyeDX, EYE_Y - 14, cx + s * (eyeDX + 8), EYE_Y - 10 - o.brow);
    ctx.stroke();
  }
  // nose hint
  ctx.strokeStyle = shade(skin, 0.7); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(cx + 1, EYE_Y + 8); ctx.quadraticCurveTo(cx + 4, EYE_Y + 18, cx, EYE_Y + 20); ctx.stroke();
  // mouth
  ctx.strokeStyle = o.sex === 'f' ? '#8a4038' : shade(skin, 0.55);
  ctx.lineWidth = o.sex === 'f' ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(cx - 8, EYE_Y + 30);
  ctx.quadraticCurveTo(cx, EYE_Y + 30 + o.mouth, cx + 8, EYE_Y + 30);
  ctx.stroke();

  // hair front
  ctx.fillStyle = o.hairColor;
  hairFront(ctx, o, cx, headW);
  // stubble / beard is men only — never on a woman's jaw
  if (o.sex === 'm' && o.beard) {
    ctx.fillStyle = shade(o.hairColor, 0.7);
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y + 34, 15 + o.jaw * 2, 11 + o.jaw, 0, 0.15, Math.PI - 0.15);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (o.extras) o.extras(ctx, cx, o);
}

// hair silhouettes — the primary differentiator (§1a)
function hairBack(ctx, o, cx, headW) {
  const s = o.hairStyle;
  const f = o.sex === 'f';
  if (s === 'long') {
    // Crown mass, then two shoulder-length curtains with a neck gap so the
    // hair cannot wrap the chin.
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y - 18, headW / 2 + 16, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    const gap = f ? 12 : 10;
    ctx.beginPath();
    ctx.moveTo(cx - headW / 2 - 18, EYE_Y + 4);
    ctx.quadraticCurveTo(cx - headW / 2 - 34, EYE_Y + 56, cx - 40, EYE_Y + 116);
    ctx.lineTo(cx - gap, EYE_Y + 116);
    ctx.quadraticCurveTo(cx - 18, EYE_Y + 50, cx - headW / 2 - 2, EYE_Y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + headW / 2 + 18, EYE_Y + 4);
    ctx.quadraticCurveTo(cx + headW / 2 + 34, EYE_Y + 56, cx + 40, EYE_Y + 116);
    ctx.lineTo(cx + gap, EYE_Y + 116);
    ctx.quadraticCurveTo(cx + 18, EYE_Y + 50, cx + headW / 2 + 2, EYE_Y + 10);
    ctx.closePath();
    ctx.fill();
    return;
  }
  if (s === 'braids' || s === 'dreads') {
    // Tight scalp, then hanging ropes — a filled disc in pale hair reads as a cap.
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y - 28, headW / 2 + 2, 22, 0, Math.PI, 0);
    ctx.fill();
    const ids = f ? [-3.2, -2.2, -1.2, 1.2, 2.2, 3.2] : [-3, -2, -1, 0, 1, 2, 3];
    const long = f && s === 'braids';
    for (const i of ids) {
      ctx.beginPath();
      ctx.ellipse(cx + i * 11, EYE_Y + (long ? 72 : 54), long ? 4.2 : 4.5, long ? 56 : 30, i * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  if (s === 'afro') {
    // Crown mass above the head — never a disc over the face.
    ctx.beginPath();
    ctx.arc(cx, EYE_Y - 42, headW / 2 + 20, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (s === 'locs' || s === 'twists') {
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y - 16, headW / 2 + 14, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    const ids = [-3, -2, -1, 1, 2, 3];
    const thick = s === 'locs' ? 6 : 3.6;
    const drop = s === 'locs' ? 32 : 26;
    for (const i of ids) {
      ctx.beginPath();
      ctx.ellipse(cx + i * 11, EYE_Y + 60, thick, drop, i * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  if (s === 'cornrows') {
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y - 14, headW / 2 + 8, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y + 10, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (s === 'puff') {
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y - 14, headW / 2 + 8, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, EYE_Y - 52, 28, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (s === 'twa') {
    ctx.beginPath();
    ctx.arc(cx, EYE_Y - 20, headW / 2 + 10, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (s === 'silk' || s === 'hime') {
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y - 18, headW / 2 + 14, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    const gap = s === 'hime' ? 14 : 12;
    ctx.beginPath();
    ctx.moveTo(cx - headW / 2 - 14, EYE_Y + 4);
    ctx.quadraticCurveTo(cx - headW / 2 - 28, EYE_Y + 58, cx - 36, EYE_Y + 118);
    ctx.lineTo(cx - gap, EYE_Y + 118);
    ctx.quadraticCurveTo(cx - 16, EYE_Y + 50, cx - headW / 2, EYE_Y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + headW / 2 + 14, EYE_Y + 4);
    ctx.quadraticCurveTo(cx + headW / 2 + 28, EYE_Y + 58, cx + 36, EYE_Y + 118);
    ctx.lineTo(cx + gap, EYE_Y + 118);
    ctx.quadraticCurveTo(cx + 16, EYE_Y + 50, cx + headW / 2, EYE_Y + 10);
    ctx.closePath();
    ctx.fill();
    return;
  }
  if (s === 'bob') {
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y - 4, headW / 2 + 16, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - headW / 2 - 8, EYE_Y + 28, 10, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + headW / 2 + 8, EYE_Y + 28, 10, 16, -0.2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (s === 'twinbun') {
    ctx.beginPath();
    ctx.ellipse(cx, EYE_Y - 12, headW / 2 + 9, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath(); ctx.arc(cx - 22, EYE_Y - 48, 13, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 22, EYE_Y - 48, 13, 0, Math.PI * 2); ctx.fill();
    return;
  }
  ctx.beginPath();
  if (s === 'ponytail') {
    ctx.ellipse(cx, EYE_Y - 10, headW / 2 + 10, 44, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + headW / 2 + 16, EYE_Y + 26, 10, 46, -0.25, 0, Math.PI * 2);
  } else if (s === 'bun') {
    ctx.ellipse(cx, EYE_Y - 12, headW / 2 + 9, 42, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, EYE_Y - 52, 14, 0, Math.PI * 2);
  } else {
    ctx.ellipse(cx, EYE_Y - 8, headW / 2 + 10, 46, 0, 0, Math.PI * 2);
  }
  ctx.fill();
}
function hairFront(ctx, o, cx, headW) {
  const s = o.hairStyle;
  ctx.beginPath();
  if (s === 'buzz' || s === 'bald' || s === 'twa' || s === 'puff' || s === 'locs' || s === 'twists') {
    if (s === 'buzz') { ctx.globalAlpha = 0.55; ctx.ellipse(cx, EYE_Y - 26, headW / 2 + 5, 24, 0, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1; }
    return;
  }
  if (s === 'braids' || s === 'dreads') {
    ctx.beginPath();
    ctx.moveTo(cx - headW / 2 + 4, EYE_Y - 6);
    ctx.quadraticCurveTo(cx, EYE_Y - 38, cx + headW / 2 - 4, EYE_Y - 6);
    ctx.fill();
    ctx.fillStyle = o.skin ? o.skin[0] : '#000';
    ctx.beginPath();
    ctx.moveTo(cx - 2, EYE_Y - 40);
    ctx.lineTo(cx, EYE_Y - 8);
    ctx.lineTo(cx + 2, EYE_Y - 40);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = o.hairColor;
    return;
  }
  if (s === 'afro') return;
  if (s === 'hood') return;
  if (s === 'cornrows') {
    ctx.strokeStyle = shade(o.hairColor, 0.7);
    ctx.lineWidth = 2.2;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 5, EYE_Y - 8);
      ctx.quadraticCurveTo(cx + i * 4, EYE_Y - 36, cx + i * 2, EYE_Y - 48);
      ctx.stroke();
    }
    ctx.fillStyle = o.hairColor;
    return;
  }
  if (s === 'bob' || s === 'hime' || s === 'silk') {
    // blunt bangs; silk gets a center part
    ctx.fillStyle = o.hairColor;
    ctx.beginPath();
    ctx.moveTo(cx - headW / 2 - 4, EYE_Y - 10);
    ctx.lineTo(cx - headW / 2 - 2, EYE_Y - 44);
    ctx.lineTo(cx + headW / 2 + 2, EYE_Y - 44);
    ctx.lineTo(cx + headW / 2 + 4, EYE_Y - 10);
    if (s === 'silk') {
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = o.skin ? o.skin[0] : '#000';
      ctx.beginPath();
      ctx.moveTo(cx - 3, EYE_Y - 44);
      ctx.lineTo(cx, EYE_Y - 12);
      ctx.lineTo(cx + 3, EYE_Y - 44);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = o.hairColor;
    } else {
      ctx.closePath(); ctx.fill();
    }
    if (s === 'hime') {
      ctx.beginPath();
      ctx.ellipse(cx - 20, EYE_Y + 8, 7, 16, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 20, EYE_Y + 8, 7, 16, -0.15, 0, Math.PI * 2); ctx.fill();
    }
    return;
  }
  if (s === 'twinbun') {
    ctx.moveTo(cx - headW / 2 - 4, EYE_Y - 10);
    ctx.quadraticCurveTo(cx, EYE_Y - 28, cx + headW / 2 + 4, EYE_Y - 10);
    ctx.fill();
    return;
  }
  // generic fringe
  ctx.moveTo(cx - headW / 2 - 8, EYE_Y - 8);
  ctx.quadraticCurveTo(cx - headW / 2, EYE_Y - 50, cx, EYE_Y - 46);
  ctx.quadraticCurveTo(cx + headW / 2, EYE_Y - 50, cx + headW / 2 + 8, EYE_Y - 8);
  ctx.quadraticCurveTo(cx + headW / 2 - 2, EYE_Y - 26, cx + (o.fringe || 0), EYE_Y - 22);
  ctx.quadraticCurveTo(cx - headW / 2 + 4, EYE_Y - 28, cx - headW / 2 - 8, EYE_Y - 8);
  ctx.fill();
  if (s === 'sidecut') {
    ctx.fillStyle = shade(o.hairColor, 0.5);
    ctx.beginPath(); ctx.rect(cx + headW / 2 - 8, EYE_Y - 34, 16, 22); ctx.fill();
    ctx.fillStyle = o.hairColor;
  }
}

function drawWardrobe(ctx, o, cx) {
  const y0 = EYE_Y + 62;
  const kind = o.wardrobe;
  const col = o.wardrobeColor || '#3a4150';
  // base shoulders
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(cx - 78, H);
  ctx.quadraticCurveTo(cx - 74, y0 + 12, cx - 34, y0);
  ctx.quadraticCurveTo(cx, y0 - 8, cx + 34, y0);
  ctx.quadraticCurveTo(cx + 74, y0 + 12, cx + 78, H);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(cx + 8, y0 - 8, 80, H - y0 + 8);
  if (kind === 'armor' || kind === 'samurai') {
    ctx.fillStyle = shade(col, 1.35);
    for (const s of [-1, 1]) { // pauldrons
      ctx.beginPath(); ctx.ellipse(cx + s * 52, y0 + 12, 26, 18, s * 0.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = shade(col, 1.6); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 30, y0 + 26); ctx.quadraticCurveTo(cx, y0 + 34, cx + 30, y0 + 26); ctx.stroke();
    if (kind === 'samurai') { // katana at the shoulder (§14a)
      ctx.strokeStyle = '#1c1c22'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(cx + 40, y0 + 4); ctx.lineTo(cx + 88, y0 - 44); ctx.stroke();
      ctx.strokeStyle = '#8a6f36'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx + 36, y0 + 8); ctx.lineTo(cx + 46, y0 - 2); ctx.stroke();
    }
  } else if (kind === 'ninja') {
    ctx.fillStyle = 'rgba(180,190,200,0.25)'; // mesh collar
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(cx - 26 + i * 2, y0 + 4 + i * 5); ctx.quadraticCurveTo(cx, y0 + 10 + i * 5, cx + 26 - i * 2, y0 + 4 + i * 5); ctx.stroke();
    }
  } else if (kind === 'dress' || kind === 'hide') {
    // bare shoulders: skin above the garment line
    ctx.fillStyle = o.skin[0];
    ctx.beginPath();
    ctx.moveTo(cx - 66, y0 + 26); ctx.quadraticCurveTo(cx - 60, y0 + 2, cx - 30, y0 - 2);
    ctx.quadraticCurveTo(cx, y0 - 10, cx + 30, y0 - 2);
    ctx.quadraticCurveTo(cx + 60, y0 + 2, cx + 66, y0 + 26);
    ctx.lineTo(cx + 66, y0 + 34); ctx.quadraticCurveTo(cx, y0 + (kind === 'dress' ? 20 : 30), cx - 66, y0 + 34);
    ctx.closePath(); ctx.fill();
    if (kind === 'hide') { // asymmetric wrap
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(cx - 70, H); ctx.lineTo(cx - 60, y0 + 14); ctx.lineTo(cx + 30, y0 + 44); ctx.lineTo(cx + 40, H); ctx.closePath(); ctx.fill();
    }
    if (kind === 'dress' && o.sex === 'f') {
      ctx.strokeStyle = '#d4a94e'; ctx.lineWidth = 2.5; // statement jewelry
      ctx.beginPath(); ctx.arc(cx, y0 + 6, 18, 0.3, Math.PI - 0.3); ctx.stroke();
      ctx.fillStyle = '#d4a94e';
      ctx.beginPath(); ctx.arc(cx, y0 + 25, 4, 0, Math.PI * 2); ctx.fill();
    }
  } else if (kind === 'suit') {
    ctx.fillStyle = '#e8e2d2'; // open collar shirt
    ctx.beginPath(); ctx.moveTo(cx - 16, y0 - 2); ctx.lineTo(cx, y0 + 26); ctx.lineTo(cx + 16, y0 - 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = shade(col, 1.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx - 20, y0); ctx.lineTo(cx - 34, y0 + 40); ctx.moveTo(cx + 20, y0); ctx.lineTo(cx + 34, y0 + 40); ctx.stroke();
  } else if (kind === 'hiking') {
    ctx.strokeStyle = shade(col, 0.6); ctx.lineWidth = 6; // harness straps
    ctx.beginPath(); ctx.moveTo(cx - 40, y0 + 2); ctx.lineTo(cx + 10, H); ctx.moveTo(cx + 40, y0 + 2); ctx.lineTo(cx - 10, H); ctx.stroke();
  } else if (kind === 'robe') {
    ctx.strokeStyle = shade(col, 1.5); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 14, y0 - 4); ctx.lineTo(cx - 14, H); ctx.moveTo(cx + 14, y0 - 4); ctx.lineTo(cx + 14, H); ctx.stroke();
  }
}

// ---- portrait recipes -------------------------------------------------------
// The 10 creation portraits (§1a table) — 5 slots × 2 sexes.
const SLOT_RECIPES = {
  1: { skin: 'dark',  f: { hair: 'afro', wardrobe: 'armor' },   m: { hair: 'buzz', wardrobe: 'armor' },   wardrobeColor: '#5a5f6e' },
  2: { skin: 'brown', f: { hair: 'braids', wardrobe: 'ninja' }, m: { hair: 'hood', wardrobe: 'ninja' },   wardrobeColor: '#2a2d36' },
  3: { skin: 'fair',  f: { hair: 'long', wardrobe: 'dress' },   m: { hair: 'short', wardrobe: 'suit' },   wardrobeColor: '#4a3550' },
  4: { skin: 'pale',  f: { hair: 'ponytail', wardrobe: 'hiking' }, m: { hair: 'short', wardrobe: 'hiking' }, wardrobeColor: '#4e5a3e' },
  5: { skin: 'tan',   f: { hair: 'long', wardrobe: 'hide' },    m: { hair: 'bun', wardrobe: 'hide' },     wardrobeColor: '#6e4a30' },
};

function recipePlayer(slot, sex, seed) {
  const r = rngFor(seed || (slot * 7919 + (sex === 'f' ? 13 : 29)));
  const rec = SLOT_RECIPES[slot] || SLOT_RECIPES[1];
  const v = rec[sex] || rec.m;
  return {
    bg: BG[slot % BG.length],
    skin: SKIN[rec.skin],
    hairColor: HAIR_COLORS[r.int(0, 4)],
    hairStyle: v.hair === 'short' ? 'fringe' : v.hair,
    sex, wardrobe: v.wardrobe, wardrobeColor: rec.wardrobeColor,
    eyes: r.pick(['#4a3520', '#2f4a2a', '#2a3a55', '#4a2a20']),
    jaw: sex === 'f' ? 0 : 1.5, brow: r.int(0, 2), mouth: r.int(0, 3), fringe: r.int(-6, 6),
    extras: v.hair === 'hood' ? (ctx, cx) => { // ninja hood up
      const hc = '#2a2d36';
      ctx.fillStyle = hc;
      ctx.beginPath(); ctx.ellipse(cx, EYE_Y - 12, 42, 52, 0, Math.PI, 0); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - 42, EYE_Y - 10); ctx.quadraticCurveTo(cx, EYE_Y - 70, cx + 42, EYE_Y - 10); ctx.fill();
    } : null,
  };
}

function recipeNPC(sex, seed) {
  const r = rngFor(seed);
  if (sex === 'f') {
    const authored = NPC_WOMAN_LOOKS;
    const n = authored.length + 8;
    const pick = ((seed >>> 0) % n);
    if (pick < authored.length) return lookFrom(authored[pick], r, 'f');
  }
  const skins = Object.keys(SKIN).filter(k => k !== 'ashen');
  const skinKey = r.pick(skins);
  const styles = sex === 'f'
    ? (FEMALE_HAIR_BY_SKIN[skinKey] || ['long', 'ponytail', 'bun', 'braids'])
    : ['fringe', 'buzz', 'dreads', 'sidecut', 'bald', 'afro', 'locs'];
  const clothes = sex === 'f' ? ['dress', 'robe', 'hiking', 'hide', 'ninja']
                              : ['armor', 'hiking', 'robe', 'suit', 'hide', 'ninja'];
  const darkHair = ['#120e0c', '#191410', '#2e2013', '#4a2f18'];
  const hairPool = (skinKey === 'gold' || skinKey === 'olive' || skinKey === 'deep' || skinKey === 'dark')
    ? darkHair.concat(HAIR_COLORS.slice(0, 4))
    : HAIR_COLORS;
  return {
    bg: BG[r.int(0, BG.length - 1)],
    skin: SKIN[skinKey],
    hairColor: r.pick(hairPool),
    hairStyle: r.pick(styles),
    sex,
    wardrobe: r.pick(clothes),
    wardrobeColor: r.pick(['#3a4150', '#504338', '#38503e', '#503a3a', '#3f3a50', '#4a3550']),
    eyes: r.pick(['#4a3520', '#2f4a2a', '#2a3a55', '#4a2a20', '#3a3a3a']),
    jaw: sex === 'f' ? 0 : r.int(1, 3), brow: r.int(0, 3), mouth: r.int(-1, 3), fringe: r.int(-8, 8),
    beard: sex === 'm' && r.chance(0.4),
  };
}

function lookFrom(look, r, sex) {
  return {
    bg: BG[r.int(0, BG.length - 1)],
    skin: SKIN[look.skin] || SKIN.dark,
    hairColor: look.hairColor,
    hairStyle: look.hair,
    sex,
    wardrobe: look.wardrobe,
    wardrobeColor: look.wardrobeColor,
    eyes: r.pick(['#4a3520', '#2f4a2a', '#2a3a55', '#4a2a20', '#3a3a3a']),
    jaw: 0, brow: r.int(0, 2), mouth: r.int(0, 2), fringe: r.int(-4, 4),
  };
}

const FEMALE_HAIR_BY_SKIN = {
  deep:  ['locs', 'twists', 'cornrows', 'puff', 'twa', 'afro', 'braids', 'silk'],
  dark:  ['locs', 'twists', 'cornrows', 'puff', 'afro', 'braids', 'bun', 'silk'],
  brown: ['braids', 'afro', 'ponytail', 'bun', 'locs', 'long', 'puff'],
  gold:  ['bob', 'hime', 'twinbun', 'bun', 'long', 'ponytail'],
  olive: ['bob', 'hime', 'twinbun', 'bun', 'long', 'ponytail'],
  tan:   ['long', 'ponytail', 'bun', 'braids'],
  fair:  ['long', 'ponytail', 'bun'],
  pale:  ['long', 'ponytail', 'bun'],
};

// NPC-only looks — never on the creation grid. Six Black women, three Asian women.
const NPC_WOMAN_LOOKS = [
  { skin: 'deep',  hair: 'locs',     hairColor: '#1c1410', wardrobe: 'robe',   wardrobeColor: '#3f3a50' },
  { skin: 'dark',  hair: 'twists',   hairColor: '#2a1810', wardrobe: 'hiking', wardrobeColor: '#38503e' },
  { skin: 'deep',  hair: 'cornrows', hairColor: '#191410', wardrobe: 'armor',  wardrobeColor: '#3a4150' },
  { skin: 'dark',  hair: 'puff',     hairColor: '#4a2a18', wardrobe: 'dress',  wardrobeColor: '#503a3a' },
  { skin: 'brown', hair: 'twa',      hairColor: '#1a120c', wardrobe: 'hide',   wardrobeColor: '#504338' },
  { skin: 'dark',  hair: 'silk',     hairColor: '#2e2013', wardrobe: 'ninja',  wardrobeColor: '#2a2d36' },
  { skin: 'gold',  hair: 'bob',      hairColor: '#120e0c', wardrobe: 'robe',   wardrobeColor: '#4a3550' },
  { skin: 'gold',  hair: 'hime',     hairColor: '#191410', wardrobe: 'dress',  wardrobeColor: '#3f3a50' },
  { skin: 'olive', hair: 'twinbun',  hairColor: '#2e2013', wardrobe: 'hiking', wardrobeColor: '#4e5a3e' },
];

// Campaign characters (campaign doc §6a): fixed looks from their data recipe.
function recipeCampaign(id) {
  const def = ADV.DATA.CAMPAIGN_CHARS[id];
  const pr = (def && def.portrait) || { skin: 'tan', hair: 'fringe', wardrobe: 'armor', color: '#4a4a4a' };
  const tint = { maw: '#3a2a4a88', antler: '#2f3f2a88', varenholm: '#2a3a5588' }[def ? def.faction : ''] || '#33333388';
  const r = rngFor(ADV.hashStr(id));
  return {
    bg: tint, skin: SKIN[pr.skin] || SKIN.tan,
    hairColor: pr.hairColor || (pr.skin === 'ashen' ? '#333' : HAIR_COLORS[r.int(0, HAIR_COLORS.length - 1)]),
    hairStyle: pr.hair, sex: def ? def.sex : 'm', wardrobe: pr.wardrobe, wardrobeColor: pr.color,
    eyes: pr.skin === 'ashen' ? '#7a9a8a' : r.pick(['#4a3520', '#2f4a2a', '#2a3a55', '#4a2a20']),
    jaw: def && def.sex === 'f' ? 0 : r.int(1, 3), brow: r.int(0, 2), mouth: r.int(-1, 2), fringe: r.int(-6, 6),
  };
}

const HIRO_RECIPE = {
  bg: '#3a2a5588',
  skin: SKIN.dark,
  hairColor: '#6a3faa', hairStyle: 'dreads',    // purple dreadlocks (§14a)
  sex: 'm', wardrobe: 'samurai', wardrobeColor: '#38343e',
  eyes: '#8a7a3a',                              // hazel
  jaw: 2, brow: 1, mouth: 1, fringe: 0,
};

// ---- monster heads ----------------------------------------------------------
function drawMonster(ctx, typeId, tint, variant) {
  variant = variant || 0;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = tint ? tint + '66' : '#4a303055';
  ctx.fillRect(0, 0, W, H);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(255,255,255,0.05)'); grad.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  if (typeId === 'dire_wolf') {
    const looks = [
      { fur: tint || '#5a5a5f', eyes: '#c8a018', ruff: 75, earH: 72 },
      { fur: tint || '#6a4a32', eyes: '#d4a94e', ruff: 68, earH: 62, notch: true },
      { fur: tint || '#8a8a92', eyes: '#6fc0e8', ruff: 80, earH: 76, darkSnout: true },
    ];
    const L = looks[variant] || looks[0];
    ctx.fillStyle = L.fur;
    ctx.beginPath(); ctx.ellipse(cx, EYE_Y + 30, L.ruff, 65, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, EYE_Y + 4, 48, 44, 0, 0, Math.PI * 2); ctx.fill();
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(cx + s * 20, EYE_Y - 30);
      ctx.lineTo(cx + s * 44, EYE_Y - L.earH); ctx.lineTo(cx + s * 44, EYE_Y - 28); ctx.closePath(); ctx.fill();
      if (L.notch && s === 1) {
        ctx.fillStyle = shade(L.fur, 0.7);
        ctx.beginPath(); ctx.moveTo(cx + 32, EYE_Y - 48); ctx.lineTo(cx + 44, EYE_Y - L.earH + 8); ctx.lineTo(cx + 44, EYE_Y - 40); ctx.closePath(); ctx.fill();
        ctx.fillStyle = L.fur;
      }
    }
    ctx.fillStyle = shade(L.fur, L.darkSnout ? 0.55 : 0.8);
    ctx.beginPath(); ctx.ellipse(cx, EYE_Y + 34, 22, 26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1c1c1c';
    ctx.beginPath(); ctx.ellipse(cx, EYE_Y + 24, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
    for (const s of [-1, 1]) {
      ctx.fillStyle = L.eyes;
      ctx.beginPath(); ctx.ellipse(cx + s * 20, EYE_Y - 4, 8, 5, s * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#131313';
      ctx.beginPath(); ctx.arc(cx + s * 20, EYE_Y - 4, 2.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#e8e2d2'; ctx.lineWidth = variant === 2 ? 4 : 3;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(cx + s * 12, EYE_Y + 48); ctx.lineTo(cx + s * 10, EYE_Y + 58); ctx.stroke();
    }
    return;
  }
  if (typeId === 'plated_sentinel') {
    const looks = [
      { metal: tint || '#6e7480', glow: '#58c8e8', visor: 'slit' },
      { metal: tint || '#8a6a3a', glow: '#e8a048', visor: 't' },
      { metal: tint || '#3a3e44', glow: '#d8574a', visor: 'slit', crest: true },
    ];
    const L = looks[variant] || looks[0];
    const metal = L.metal;
    drawWardrobe(ctx, { wardrobe: 'armor', wardrobeColor: shade(metal, 0.8), skin: SKIN.ashen, sex: 'm' }, cx);
    ctx.fillStyle = metal;
    ctx.beginPath(); ctx.rect(cx - 34, EYE_Y - 44, 68, 92); ctx.fill();
    ctx.fillStyle = shade(metal, 1.25);
    ctx.beginPath(); ctx.rect(cx - 34, EYE_Y - 44, 68, 18); ctx.fill();
    if (L.crest) {
      ctx.fillStyle = shade(metal, 0.7);
      ctx.beginPath(); ctx.moveTo(cx - 6, EYE_Y - 44); ctx.lineTo(cx, EYE_Y - 78); ctx.lineTo(cx + 6, EYE_Y - 44); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = '#0e0e12';
    if (L.visor === 't') {
      ctx.fillRect(cx - 26, EYE_Y - 8, 52, 10);
      ctx.fillRect(cx - 6, EYE_Y - 8, 12, 28);
    } else {
      ctx.fillRect(cx - 26, EYE_Y - 8, 52, 14);
    }
    ctx.fillStyle = L.glow;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * 14, EYE_Y - 1, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = shade(metal, 0.6); ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(cx - 34, EYE_Y + 12 + i * 12); ctx.lineTo(cx + 34, EYE_Y + 12 + i * 12); ctx.stroke(); }
    return;
  }
  const packs = {
    bandit: [
      { skin: SKIN.tan, hairStyle: 'hood', hairColor: '#332d26', wardrobe: 'ninja', wardrobeColor: tint || '#4a3f30', eyes: '#3a3a3a', mask: true, sex: 'm', jaw: 2 },
      { skin: SKIN.brown, hairStyle: 'buzz', hairColor: '#191410', wardrobe: 'hide', wardrobeColor: tint || '#5a4030', eyes: '#2a1a10', scarf: true, sex: 'm', jaw: 2 },
      { skin: SKIN.pale, hairStyle: 'sidecut', hairColor: '#3a3a3f', wardrobe: 'ninja', wardrobeColor: tint || '#3a3038', eyes: '#4a2a20', patch: true, sex: 'm', jaw: 1 },
    ],
    hedge_mage: [
      { skin: SKIN.pale, hairStyle: 'long', hairColor: '#7a7a72', wardrobe: 'robe', wardrobeColor: tint || '#3f3a50', eyes: '#2a3a55', hat: true, sex: 'm', jaw: 2 },
      { skin: SKIN.dark, hairStyle: 'fringe', hairColor: '#191410', wardrobe: 'robe', wardrobeColor: tint || '#4a3550', eyes: '#4a3520', hat: true, sex: 'm', jaw: 2 },
      { skin: SKIN.gold, hairStyle: 'bun', hairColor: '#7a7a72', wardrobe: 'robe', wardrobeColor: tint || '#2f3a40', eyes: '#2a3a55', cowl: true, sex: 'f', jaw: 0 },
    ],
    grave_acolyte: [
      { skin: SKIN.ashen, hairStyle: 'bald', hairColor: '#222', wardrobe: 'robe', wardrobeColor: tint || '#333833', eyes: '#5d8a4a', cowl: true, sex: 'm', jaw: 2 },
      { skin: SKIN.ashen, hairStyle: 'buzz', hairColor: '#222', wardrobe: 'robe', wardrobeColor: tint || '#2a2228', eyes: '#8a9a4a', mask: true, sex: 'm', jaw: 2 },
      { skin: SKIN.ashen, hairStyle: 'twinbun', hairColor: '#3a3a38', wardrobe: 'robe', wardrobeColor: tint || '#2a3228', eyes: '#5d8a4a', cowl: true, sex: 'f', jaw: 0 },
    ],
  };
  const pack = packs[typeId];
  const rec = (pack && (pack[variant] || pack[0])) || recipeNPC('m', 1);
  const o = Object.assign({ brow: 2, mouth: -1, bg: 'transparent' }, rec);
  o.skin = rec.skin;
  drawBust(ctx, Object.assign({}, o, { bg: 'rgba(0,0,0,0)' }));
  if (rec.mask) {
    ctx.fillStyle = '#2a2620';
    ctx.beginPath(); ctx.rect(cx - 30, EYE_Y + 12, 60, 26); ctx.fill();
    ctx.fillStyle = shade(rec.wardrobeColor, 0.85);
    ctx.beginPath(); ctx.ellipse(cx, EYE_Y - 14, 44, 54, 0, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - 44, EYE_Y - 12); ctx.quadraticCurveTo(cx, EYE_Y - 74, cx + 44, EYE_Y - 12); ctx.fill();
  }
  if (rec.scarf) {
    ctx.fillStyle = shade(rec.wardrobeColor, 0.75);
    ctx.beginPath(); ctx.ellipse(cx, EYE_Y + 38, 28, 10, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (rec.patch) {
    ctx.fillStyle = '#1a1814';
    ctx.beginPath(); ctx.ellipse(cx - 14, EYE_Y, 10, 8, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a1814'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 24, EYE_Y - 18); ctx.lineTo(cx + 8, EYE_Y + 8); ctx.stroke();
  }
  if (rec.hat) {
    ctx.fillStyle = shade(rec.wardrobeColor, 1.1);
    if (variant === 1) {
      ctx.beginPath(); ctx.ellipse(cx, EYE_Y - 28, 56, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx, EYE_Y - 48, 22, 22, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(cx - 52, EYE_Y - 26); ctx.lineTo(cx + 52, EYE_Y - 26); ctx.lineTo(cx + 8, EYE_Y - 96); ctx.closePath(); ctx.fill();
    }
  }
  if (rec.cowl) {
    ctx.fillStyle = shade(rec.wardrobeColor, 0.85);
    ctx.beginPath(); ctx.ellipse(cx, EYE_Y - 16, 46, 56, 0, Math.PI, 0); ctx.fill();
  }
}

// ---- public API -------------------------------------------------------------
const cacheKeys = new Set();

const Portraits = {
  W, H,
  // Returns a texture key, generating the canvas texture on first request.
  key(scene, ch) {
    let key;
    const TYPE_TINTS = { marsh_stalker: '#2a4a2a', ember_cultist: '#7a3a1a', frost_hag: '#2a4a6a', gravewarden: '#3a3a26' };
    const typeTint = ch.isMonster && TYPE_TINTS[ch.enemyTypeId];
    const variant = Math.abs((ch.portraitSeed || 0) >>> 0) % 3;
    if (ch.portraitId && ch.isMonster) key = 'pm5_' + ch.portraitId + '_v' + variant + (ch.boss ? '_boss' : '') + (ch.isUndead ? '_risen' : '') + (typeTint ? '_' + ch.enemyTypeId : '');
    else if (ch.portraitKind === 'campaign') key = 'pc4_' + ch.portraitId;
    else if (ch.portraitId) key = 'pr2_' + ch.portraitId;            // registry (Hiro)
    else if (ch.portraitKind === 'player') key = 'pp4_' + ch.portraitSlot + '_' + ch.sex + '_' + (ch.portraitSeed % 1000);
    else key = 'pn5_' + ch.sex + '_' + ch.portraitSeed;
    if (cacheKeys.has(key) && scene.textures.exists(key)) return key;
    const tex = scene.textures.createCanvas(key, W, H);
    const ctx = tex.getContext();
    if (ch.isMonster) {
      const bossTints = { bandit: '#7a3a2a', hedge_mage: '#5a2a6a', dire_wolf: '#3a1f1f', plated_sentinel: '#7a6a2a', grave_acolyte: '#2a4a3a' };
      drawMonster(ctx, ch.portraitId, ch.isUndead ? '#2a3a3a' : ch.boss ? bossTints[ch.portraitId] : (typeTint || null), variant);
    } else if (ch.portraitKind === 'campaign') {
      drawBust(ctx, recipeCampaign(ch.portraitId));
    } else if (ch.portraitId === 'hiro') {
      drawBust(ctx, HIRO_RECIPE);
    } else if (ch.portraitKind === 'player') {
      drawBust(ctx, recipePlayer(ch.portraitSlot || 1, ch.sex, ch.portraitSeed));
    } else {
      drawBust(ctx, recipeNPC(ch.sex, ch.portraitSeed));
    }
    tex.refresh();
    cacheKeys.add(key);
    return key;
  },
  // For the creation screen grid
  creationKey(scene, slot, sex) {
    return Portraits.key(scene, { portraitKind: 'player', portraitSlot: slot, sex, portraitSeed: slot * 7919 + (sex === 'f' ? 13 : 29) });
  },
  hiroKey(scene) { return Portraits.key(scene, { portraitId: 'hiro', portraitKind: 'player', sex: 'm' }); },
};

ADV.Portraits = Portraits;
})();
