/* qa_test.js — quality repass: NO debug cheats for the core run.
   1. Natural full fight: simple bot plays affordable cards, ends turn; must reach victory
      or defeat within 25 turns with no JS errors and no stuck busy.
   2. Defeat path: low player HP -> hound kills -> defeat overlay -> restart -> fresh fight.
   3. Map refight: after victory, start Fight again from Map; fight must boot.
   4. Deck-exhaustion edge: draw with empty piles must not crash.
   Run: node build/qa_test.js */
const { chromium } = require("playwright");
const path = require("path");
const url = q => "file://" + path.resolve(__dirname, "..", "SorcererSpire.html") + q;

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push("CONSOLE: " + m.text()); });
  const state = () => page.evaluate(() => JSON.parse(window.spireState()));
  const waitIdle = (t = 90000) => page.waitForFunction(() => { const st = JSON.parse(window.spireState()); return st.busy === false || st.over; }, null, { timeout: t });

  /* ---- 1. natural playthrough ---- */
  await page.goto(url("?scene=fight&canvas=1"));
  await waitIdle(60000);
  let turns = 0, st = await state();
  while (!st.over && turns < 25) {
    // play any affordable card
    let played = true;
    while (played && !st.over) {
      played = await page.evaluate(() => {
        const s = window.fightScene;
        if (s.busy || s.C.over) return false;
        const card = s.handC.list.find(c => s.C.canPlay(Spire.CARDS[c.cardId]));
        if (!card) return false;
        s.playCard(card);
        return true;
      });
      if (played) await waitIdle();
      st = await state();
    }
    if (st.over) break;
    await page.evaluate(() => window.spireEndTurn());
    await waitIdle();
    st = await state();
    turns++;
  }
  console.log("natural fight:", JSON.stringify(st), "turns:", turns);
  if (!st.over) errors.push("natural fight never ended in 25 turns");
  if (st.php > 0) {   // won -> reward -> map
    await page.waitForFunction(() => window.game && window.game.scene.isActive("Reward"), null, { timeout: 60000 })
      .catch(() => errors.push("no Reward after natural victory"));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.rewardSkip());
    await page.waitForFunction(() => window.game && window.game.scene.isActive("Map"), null, { timeout: 60000 })
      .catch(() => errors.push("no Map after reward skip"));
    console.log("victory -> reward -> map ok");
    /* ---- 3. refight from map ---- */
    await page.evaluate(() => window.game.scene.getScene("Map").scene.start("Fight"));
    await page.waitForFunction(() => window.spireState && JSON.parse(window.spireState()).busy === false && JSON.parse(window.spireState()).turn === 1, null, { timeout: 60000 })
      .catch(() => errors.push("refight from map did not boot"));
    console.log("map refight boots:", JSON.stringify(await state()));
  }

  /* ---- 2. defeat path ---- */
  await page.goto(url("?scene=fight&canvas=1"));
  await waitIdle(60000);
  await page.evaluate(() => { const s = window.fightScene; s.C.player.hp = 1; s.C.enemyIx = 1; s.refreshHud(); });  // next move: bite
  await page.evaluate(() => window.spireEndTurn());
  await page.waitForFunction(() => JSON.parse(window.spireState()).defeat === true, null, { timeout: 60000 })
    .catch(() => errors.push("defeat overlay never triggered"));
  await page.screenshot({ path: path.join(__dirname, "shots", "50_defeat.png") });
  await page.evaluate(() => window.fightScene.scene.restart());
  await page.waitForFunction(() => {
    const st = JSON.parse(window.spireState());
    return st.busy === false && st.php === 70 && st.defeat === false;
  }, null, { timeout: 60000 }).catch(() => errors.push("restart after defeat did not reset"));
  console.log("defeat + restart ok:", JSON.stringify(await state()));

  /* ---- 4. deck exhaustion edge ---- */
  const edge = await page.evaluate(() => {
    const s = window.fightScene;
    s.C.draw = []; s.C.discard = []; s.C.hand = [];
    const drawn = s.C.drawCards(5);
    s.renderHand(false);
    return { drawn: drawn.length, hand: s.C.hand.length };
  });
  console.log("empty-deck draw:", JSON.stringify(edge));

  /* ---- pact of pain self-kill soft-lock guard ---- */
  await page.evaluate(() => { window.fightScene.C.player.hp = 2; });
  await page.evaluate(() => window.spirePlay("pactofpain"));
  await page.waitForFunction(() => JSON.parse(window.spireState()).defeat === true, null, { timeout: 60000 })
    .catch(() => errors.push("pact-of-pain self-kill did not reach defeat screen"));
  console.log("self-kill -> defeat ok");

  console.log(errors.length ? "QA ERRORS:\n" + errors.join("\n") : "QA CLEAN — no errors");
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
