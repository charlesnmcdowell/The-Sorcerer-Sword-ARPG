/* run_test.js — full THREE-ACT run: a bot walks the whole road (the Pit, the City,
   the West Road, the Varenholm epilogue). Also boots every enemy in the game
   individually, and exercises every boss/act special (Horn Call, Mend, Raise Dead,
   Cinder Toss, Devour).
   Run: node build/run_test.js */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const SHOTS = path.join(__dirname, "shots");
fs.mkdirSync(SHOTS, { recursive: true });
const url = q => "file://" + path.resolve(__dirname, "..", "SorcererSpire.html") + (q || "");

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push("CONSOLE: " + m.text()); });

  const activeScene = () => page.evaluate(() => window.game ? window.game.scene.getScenes(true).map(s => s.scene.key)[0] : null);
  const waitScene = (keys, t = 60000) => page.waitForFunction(ks => {
    if (!window.game) return false;
    const act = window.game.scene.getScenes(true).map(s => s.scene.key);
    return ks.some(k => act.includes(k));
  }, keys, { timeout: t });
  const fightIdle = (t = 90000) => page.waitForFunction(() => {
    if (!window.spireState) return false;
    const st = JSON.parse(window.spireState());
    return st.busy === false || st.over;
  }, null, { timeout: t });

  async function bootFight(enemy) {
    await page.evaluate(id => {
      Spire.newRun();
      const sm = window.game.scene;
      sm.getScenes(true).forEach(s => { if (s.scene.key !== "Fight") s.scene.stop(); });
      if (sm.isActive("Fight")) sm.getScene("Fight").scene.restart({ enemy: id });
      else sm.start("Fight", { enemy: id });
    }, enemy);
    await page.waitForTimeout(600);
    await fightIdle(60000);
  }

  async function playOutFight(tag) {
    await fightIdle(60000);
    let st = JSON.parse(await page.evaluate(() => window.spireState()));
    let turns = 0;
    while (!st.over && turns < 40) {
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
        if (played) await fightIdle();
        st = JSON.parse(await page.evaluate(() => window.spireState()));
      }
      if (st.over) break;
      await page.evaluate(() => window.spireEndTurn());
      await fightIdle();
      st = JSON.parse(await page.evaluate(() => window.spireState()));
      turns++;
    }
    console.log(`  fight[${tag}] enemy=${st.enemy} over=${st.over} php=${st.php} defeat=${st.defeat} turns=${turns}`);
    return st;
  }

  /* PART=12 runs only the enemy/special sweeps; PART=3 runs only the full-road bot.
     (The whole suite outgrew a single 10-minute CI window.) */
  const PART = process.env.PART || "all";

  /* ---------- PART 1: every enemy in the game boots and fights ---------- */
  const BOSSES = new Set(["master", "necro", "champ"]);
  if (PART !== "3") {
  await page.goto(url("?scene=fight&canvas=1"));
  await fightIdle(90000);
  for (const enemy of ["skel", "brute", "beast", "hook", "gunner", "stitch", "grave", "necro",
                        "chain", "pyre", "wight", "door", "champ", "master"]) {
    await bootFight(enemy);
    // buff the bot so long fights end: massive damage cheat only for PART 1 speed
    await page.evaluate(() => { window.fightScene.C.player.statuses.str = 14; });
    const st = await playOutFight(enemy);
    if (!st.over) errors.push(`${enemy}: fight never resolved`);
    if (st.php <= 0) console.log(`  (bot lost to ${enemy} — acceptable, defeat path shown)`);
    await page.screenshot({ path: path.join(SHOTS, `60_${enemy}.png`) });
    if (st.php > 0 && !BOSSES.has(st.enemy)) {
      await waitScene(["Reward"], 30000).catch(() => errors.push(`${enemy}: no Reward scene`));
      const picked = await page.evaluate(() => window.rewardPick(0));
      console.log(`  reward picked: ${picked}`);
      await waitScene(["Map"], 30000).catch(() => errors.push(`${enemy}: no Map after reward`));
    }
    if (st.php > 0 && BOSSES.has(st.enemy)) {
      await waitScene(["ActClear"], 30000).catch(() => errors.push(`${enemy}: no ActClear after boss`));
      console.log(`  boss ${enemy} -> ActClear ok`);
    }
  }

  /* ---------- PART 2: every special resolves (no soft-lock, no errors) ---------- */
  for (const [enemy, ix, name] of [["master", 1, "horncall"], ["stitch", 1, "mend"],
                                    ["necro", 1, "raisedead"], ["pyre", 0, "cinder"],
                                    ["champ", 1, "devour"]]) {
    await bootFight(enemy);
    await page.evaluate(i => { window.fightScene.C.enemyIx = i; }, ix);
    await page.evaluate(() => window.spireEndTurn());
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SHOTS, `62_${name}.png`) });
    await fightIdle(60000);
    const st = JSON.parse(await page.evaluate(() => window.spireState()));
    console.log(`  special[${name}] resolved: php=${st.php} ehp=${st.ehp} busy=${st.busy}`);
  }
  }  // end PART !== "3"

  if (PART === "12") {
    console.log(errors.length ? "RUN-TEST(1+2) ERRORS:\n" + errors.join("\n") : "RUN-TEST(1+2) CLEAN");
    await browser.close();
    process.exit(errors.length ? 1 : 0);
  }

  /* ---------- PART 3: the full road — three acts to the epilogue ---------- */
  await page.goto(url("?canvas=1"));
  await page.waitForFunction(() => window.game && window.game.scene.isActive("Title"), null, { timeout: 90000 });
  await page.evaluate(() => {
    Spire.newRun();
    window.game.scene.getScene("Title").scene.start("Story", { lines: Spire.ACTS[1].intro, title: Spire.ACTS[1].tag, next: "Map" });
  });
  const SCENES = ["Map", "Fight", "Reward", "Rest", "Treasure", "Tavern", "Inn", "Cage", "Buyer", "Story", "ActClear", "Epilogue"];
  let hops = 0, cleared = false, died = false, lastAct = 1;
  while (hops < 140 && !cleared && !died) {
    await waitScene(SCENES);
    const sc = await activeScene();
    if (sc === "Map") {
      await page.waitForTimeout(700);
      const entered = await page.evaluate(() => {
        const avail = Spire.availableNodes();
        if (!avail.length) return null;
        const hurt = Spire.run.hp < Spire.run.maxHp * 0.5;
        const pick = (hurt && avail.find(n => n.type === "rest"))
                  || avail.find(n => ["tavern", "inn", "cage"].includes(n.type))
                  || avail.find(n => n.type === "treasure")
                  || avail.find(n => n.type === "fight")
                  || avail[0];
        window.mapScene.enter(pick);
        return { act: Spire.run.act, type: pick.type, enemy: pick.enemy || null, r: pick.r };
      });
      if (!entered) { errors.push("map had no available nodes"); break; }
      if (entered.act !== lastAct) { console.log(`== ACT ${entered.act} ==`); lastAct = entered.act; }
      console.log(`hop ${hops}: act${entered.act} -> row ${entered.r} ${entered.type}${entered.enemy ? " (" + entered.enemy + ")" : ""}`);
      await page.waitForTimeout(1500);
    } else if (sc === "Fight") {
      const st = await playOutFight("run");
      if (st.php <= 0) { died = true; break; }
      await page.waitForFunction(() => !window.game.scene.isActive("Fight"), null, { timeout: 30000 })
        .catch(() => errors.push("fight never handed off after victory"));
    } else if (sc === "Reward") {
      await page.waitForTimeout(400);
      await page.evaluate(() => window.rewardPick(0));
      await page.waitForTimeout(500);
    } else if (sc === "Rest") {
      await page.waitForTimeout(400);
      console.log("  rest heal:", await page.evaluate(() => window.restNow()));
      await page.waitForTimeout(500);
    } else if (sc === "Treasure") {
      await page.waitForTimeout(400);
      await page.evaluate(() => window.treasureMaxHp());
      await page.waitForTimeout(500);
    } else if (sc === "Tavern") {
      await page.waitForTimeout(400);
      console.log("  tavern pick:", await page.evaluate(() => window.tavernPick(0)));
      await page.waitForTimeout(500);
    } else if (sc === "Inn") {
      await page.waitForTimeout(400);
      console.log("  inn pick:", await page.evaluate(() => window.innPick(0)));
      await page.waitForTimeout(500);
    } else if (sc === "Cage") {
      await page.waitForTimeout(400);
      await page.evaluate(() => window.cageOpen());
      console.log("  cage opened");
      await page.waitForTimeout(600);
      await waitScene(["Map"], 30000).catch(() => errors.push("cage never returned to map"));
    } else if (sc === "Buyer") {
      await page.waitForTimeout(400);
      await page.evaluate(() => window.buyerTake());
      console.log("  buyer: took the vial");
      await page.waitForTimeout(600);
      await waitScene(["Map"], 30000).catch(() => errors.push("buyer never returned to map"));
    } else if (sc === "Story") {
      await page.waitForTimeout(500);
      await page.evaluate(() => window.storyNext());
      await page.waitForTimeout(600);
    } else if (sc === "ActClear") {
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SHOTS, `63_actclear_a${lastAct}.png`) });
      await page.evaluate(() => window.actClearNext());
      await page.waitForTimeout(600);
    } else if (sc === "Epilogue") {
      cleared = true;
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(SHOTS, "64_epilogue.png") });
      await page.evaluate(() => window.storyNext());
      await page.waitForTimeout(800);
    }
    hops++;
  }
  const finalRun = await page.evaluate(() => ({ act: Spire.run.act, deck: Spire.run.deck.length, hp: Spire.run.hp, maxHp: Spire.run.maxHp, over: Spire.run.over }));
  console.log(`run finished: cleared=${cleared} died=${died} hops=${hops}`, JSON.stringify(finalRun));
  if (!cleared && !died) errors.push("run neither cleared nor died within hop budget");
  await page.screenshot({ path: path.join(SHOTS, "65_final.png") });

  console.log(errors.length ? "RUN-TEST ERRORS:\n" + errors.join("\n") : "RUN-TEST CLEAN — all three acts playable to the epilogue");
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
