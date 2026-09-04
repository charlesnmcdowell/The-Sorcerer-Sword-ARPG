// Verify the reworked creation flow: free 3-skill pick, portraits as looks,
// music manager present, dialogue voice call path. Fails on page errors.
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  fs.mkdirSync('/tmp/shots', { recursive: true });
  const args = ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args }).catch(() => chromium.launch({ args }));
  const page = await browser.newPage({ viewport: { width: 1340, height: 820 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => {
    const t = m.text();
    if (m.type() === 'error' && !/Failed to load resource/.test(t)) errors.push(t);
  });
  await page.goto('http://localhost:8734/index.html');
  await page.waitForTimeout(1200);
  await page.evaluate(() => ADV.Save.reset());
  await page.reload();
  await page.waitForTimeout(1200);

  const canvas = await page.$('canvas');
  const box = await canvas.boundingBox();
  const GW = 1280, GH = 760;
  const scale = Math.min(box.width / GW, box.height / GH);
  const ox = box.x + (box.width - GW * scale) / 2;
  const oy = box.y + (box.height - GH * scale) / 2;
  const click = async (gx, gy, ms) => { await page.mouse.click(ox + gx * scale, oy + gy * scale); await page.waitForTimeout(ms || 350); };

  await click(640, 363); // Begin
  for (let i = 0; i < 5; i++) await click(640, 300); // cards
  await page.waitForTimeout(400);
  // dismiss the first-game name callout, then type
  await page.evaluate(() => { const sc = window.__game.scene.getScene('Creation'); (sc.tutorObjs || []).forEach(o => { try { o.destroy(); } catch (e) {} }); });
  await page.keyboard.type('Kess');
  await click(292, 400, 300);       // pick male row portrait slot 2 (row2 y=140+184+~80)
  await page.screenshot({ path: '/tmp/shots/c1_phase1.png' });
  await click(640, 693, 600);       // Next — choose skills
  await page.screenshot({ path: '/tmp/shots/c2_phase2.png' });

  // pick three skills spread across the grid
  await click(284, 138, 250);   // first cell
  await click(640, 182, 250);   // second row middle
  await click(996, 226, 250);   // third row right
  await page.screenshot({ path: '/tmp/shots/c3_selected.png' });
  const chosen = await page.evaluate(() => {
    const sc = window.__game.scene.getScene('Creation');
    return sc.sel.skills.slice();
  });
  console.log('chosen:', chosen);
  await click(640, 709, 1200);  // Step into the world
  const active = await page.evaluate(() => window.__game.scene.scenes.filter(s => s.scene.isActive()).map(s => s.scene.key).join(','));
  console.log('scene:', active);
  const state = await page.evaluate(() => {
    const game = window.__game.scene.getScene('Town').registry.get('game');
    const p = ADV.Game.player(game);
    return { name: p.name, skills: p.perks.concat(p.actives).map(e => e.skillId), musicCtx: ADV.Music.context, track: ADV.Music.track };
  });
  console.log('player:', JSON.stringify(state));
  await page.screenshot({ path: '/tmp/shots/c4_town.png' });

  // dialogue voice path: open roster, click someone, confirm a voice element spawned
  await click(377, 305, 500);
  await click(700, 100, 800);
  const voice = await page.evaluate(() => ADV.Music.voiceEl ? ADV.Music.voiceEl.src : null);
  console.log('voice clip:', voice);
  await page.screenshot({ path: '/tmp/shots/c5_voice.png' });

  console.log('errors:', errors.length);
  errors.slice(0, 10).forEach(e => console.log('  ', e.slice(0, 200)));
  await browser.close();
  process.exit(errors.length || !state.skills.length || active !== 'Town' ? 1 : 0);
})().catch(e => { console.error('FAIL', e); process.exit(2); });
