/* smoke_test.js — headless run of the deck-builder: boots the fight, plays every card,
   runs enemy turns to the end of the fight, screenshots along the way.
   Run: node build/smoke_test.js  (Playwright + bundled chromium) */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const SHOTS = path.join(__dirname, "shots");
fs.mkdirSync(SHOTS, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

  const url = "file://" + path.resolve(__dirname, "..", "SorcererSpire.html") + "?scene=fight&canvas=1";
  await page.goto(url);
  await page.waitForFunction(() => window.spireState && JSON.parse(window.spireState()).busy === false, null, { timeout: 60000 });
  await page.screenshot({ path: path.join(SHOTS, "00_fight_start.png") });
  console.log("start:", await page.evaluate(() => window.spireState()));

  const cards = ["shadowbolt","umbralward","hexfrailty","shadowstep","soulsiphon","pactofpain",
                 "ruthlessfocus","veilofnight","succubus","clawdemon","dragon","shamblers"];
  for (let i = 0; i < cards.length; i++) {
    const id = cards[i];
    // heal the hound so the full card tour completes before the kill
    await page.evaluate(() => { window.fightScene.C.enemy.hp = 48; window.fightScene.C.player.hp = 70; window.fightScene.refreshHud(); });
    const r = await page.evaluate(c => window.spirePlay(c), id);
    if (r !== "ok") { errors.push(`spirePlay(${id}) -> ${r}`); continue; }
    // mid-choreography screenshot
    await page.waitForTimeout(id === "dragon" || id === "shamblers" || id === "succubus" ? 1500 : 600);
    await page.screenshot({ path: path.join(SHOTS, `${String(i + 1).padStart(2, "0")}_${id}.png`) });
    await page.waitForFunction(() => JSON.parse(window.spireState()).busy === false, null, { timeout: 90000 })
      .catch(() => errors.push(`card ${id}: busy never cleared`));
    console.log(id, "->", await page.evaluate(() => window.spireState()));
  }

  // enemy turn cycle (snarl, bite, rend, guard) — run 4 end-turns
  for (let t = 0; t < 4; t++) {
    await page.evaluate(() => { window.fightScene.C.enemy.hp = 48; window.fightScene.C.player.hp = 70; window.fightScene.refreshHud(); });
    await page.evaluate(() => window.spireEndTurn());
    await page.waitForTimeout(1400);
    await page.screenshot({ path: path.join(SHOTS, `20_enemyturn_${t}.png`) });
    await page.waitForFunction(() => JSON.parse(window.spireState()).busy === false, null, { timeout: 90000 })
      .catch(() => errors.push(`enemy turn ${t}: busy never cleared`));
    console.log("enemyturn", t, "->", await page.evaluate(() => window.spireState()));
  }

  // kill shot -> victory -> map
  await page.evaluate(() => { window.fightScene.C.enemy.hp = 3; window.fightScene.C.enemy.block = 0; window.fightScene.refreshHud(); });
  await page.evaluate(() => window.spirePlay("shadowbolt"));
  await page.waitForTimeout(2600);
  await page.screenshot({ path: path.join(SHOTS, "30_victory.png") });
  await page.waitForFunction(() => window.game && window.game.scene.isActive("Reward"), null, { timeout: 60000 }).catch(() => errors.push("Reward scene never became active after victory"));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SHOTS, "31_reward.png") });
  await page.evaluate(() => window.rewardPick(0));
  await page.waitForFunction(() => window.game && window.game.scene.isActive("Map"), null, { timeout: 60000 }).catch(() => errors.push("Map scene never became active after reward"));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SHOTS, "32_map.png") });

  // map interaction: click first available node region (structure proof) — just screenshot state
  // title screen
  await page.goto("file://" + path.resolve(__dirname, "..", "SorcererSpire.html"));
  await page.waitForTimeout(9000);
  await page.screenshot({ path: path.join(SHOTS, "40_title.png") });

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "NO JS ERRORS");
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
