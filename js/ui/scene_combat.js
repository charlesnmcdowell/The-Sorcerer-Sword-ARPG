// Combat scene (§4/§20): three lanes per side, portrait units with name plate,
// HP bar and intent icon; turn order strip; portrait motion as the feel channel.
(function () {
'use strict';
const T = () => ADV.T;

const LANE_X = { a: { front: 520, mid: 396, back: 272 }, b: { front: 760, mid: 884, back: 1008 } };
const SLOT_Y = [170, 330, 490];

class CombatScene extends Phaser.Scene {
  constructor() { super('Combat'); }
  init(data) { this.mode = (data && data.mode) || 'quest'; }

  st() {
    const g = this.game_;
    if (this.mode === 'quest') return g.quest.combat;
    if (this.mode === 'ambush') return g.ambushCombat.st;
    if (this.mode === 'rescue') return g.rescueCombat.st;
    if (this.mode === 'assassination') return g.assassination.st;
    return null;
  }

  create() {
    this.game_ = this.registry.get('game');
    // Phaser reuses scene instances across scene.start() — every run flag
    // must be reset here or the second fight of a quest inherits ended=true
    // and the turn loop never runs.
    this.ended = false;
    this.processing = false;
    this.targeting = null;
    this.actionObjs = [];
    const W = T().W, H = T().H;
    this.add.rectangle(W / 2, H / 2, W, H, 0x121110);
    const st = this.st();
    if (!st) { this.scene.start('Town'); return; }
    // music: bosses, ambushes and divine business get the heavy themes;
    // ordinary encounters rotate the battle pool ("switch it up often")
    const heavy = this.mode !== 'quest' || st.units.some(u => u.ch.boss);
    ADV.Music.play(heavy ? 'boss' : 'combat');
    // battlefield ground
    const g = this.add.graphics();
    g.fillStyle(0x1a1815, 1); g.fillRect(40, 120, W - 80, 500);
    g.lineStyle(1, T().c.panelEdge, 0.6);
    for (const side of ['a', 'b']) for (const lane of ['front', 'mid', 'back']) {
      g.strokeRect(LANE_X[side][lane] - 62, 130, 124, 484);
    }
    g.lineStyle(2, T().c.goldDim, 0.5);
    g.lineBetween(W / 2, 130, W / 2, 614);
    T().text(this, W / 2, 636, 'front lanes meet in the middle · melee reaches the front · cover shields the lanes behind', { size: 11, ox: 0.5, color: T().css.inkFaint });

    this.unitViews = new Map();
    for (const u of st.units) if (!u.reserved) this.makeUnitView(u);
    this.updateReserveCounters();

    this.turnStrip = T().text(this, W / 2, 32, '', { size: 13, ox: 0.5, color: T().css.inkDim });
    this.roundText = T().text(this, 60, 32, '', { size: 15, display: true, color: T().css.gold });
    this.banner = T().text(this, W / 2, 80, this.mode === 'ambush' ? 'AMBUSHED — at your worst, as intended' :
      this.mode === 'rescue' ? 'You took a side.' :
      this.mode === 'assassination' ? 'Only one side walks away.' :
      (st.ambushUid ? 'Your ambush — strike first, twice' : ''), { size: 16, display: true, ox: 0.5, color: T().css.blood });

    this.eventCursor = st.events.length;
    if (this.res_a) { this.res_a = null; }
    if (this.res_b) { this.res_b = null; }
    // replay initial round order
    this.refreshStrip();
    this.time.delayedCall(300, () => this.loop());
  }

  // ------------------------------------------------------------ unit views
  makeUnitView(u) {
    const x = LANE_X[u.side][u.lane], y = SLOT_Y[u.slot] || SLOT_Y[0];
    const key = ADV.Portraits.key(this, u.ch);
    const img = this.add.image(x, y, key).setDisplaySize(u.ch.boss ? 112 : 92, u.ch.boss ? 142 : 116);
    if (u.ch.isUndead) { img.setTint(0x88bb99); img.__baseTint = 0x88bb99; }
    const frame = this.add.graphics();
    const isPlayer = !!u.ch.isPlayer;
    frame.lineStyle(2, isPlayer ? T().c.gold : u.side === 'a' ? T().c.green : T().c.blood, 0.9);
    frame.strokeRect(x - img.displayWidth / 2, y - img.displayHeight / 2, img.displayWidth, img.displayHeight);
    const name = T().text(this, x, y + img.displayHeight / 2 + 17, u.ch.name, { size: 11, ox: 0.5, color: isPlayer ? T().css.gold : T().css.ink });
    const hpBar = this.add.graphics();
    const intent = T().text(this, x, y - img.displayHeight / 2 - 18, '', { size: 10, ox: 0.5, color: T().css.blue, wrap: 130, align: 'center' });
    const status = T().text(this, x, y + img.displayHeight / 2 + 33, '', { size: 9, ox: 0.5, color: T().css.purple });
    const view = { u, img, frame, name, hpBar, intent, status, x, y };
    this.unitViews.set(u.uid, view);
    this.redrawUnit(view);
    return view;
  }

  redrawUnit(v) {
    const u = v.u;
    v.hpBar.clear();
    const w = v.img.displayWidth;
    const pct = Math.max(0, u.chp / u.maxHp);
    const by = v.y + v.img.displayHeight / 2 + 3;
    v.hpBar.fillStyle(0x0d0c0a, 1); v.hpBar.fillRect(v.x - w / 2, by, w, 7);
    v.hpBar.fillStyle(pct > 0.5 ? 0x5d8a4a : pct > 0.25 ? 0xd4a94e : T().c.hp, 1);
    v.hpBar.fillRect(v.x - w / 2, by, w * pct, 7);
    v.hpBar.lineStyle(1, 0x000000, 0.8); v.hpBar.strokeRect(v.x - w / 2, by, w, 7);
    if (u.tempHp > 0) {
      const tp = Math.min(1, u.tempHp / u.maxHp);
      v.hpBar.fillStyle(T().c.tempHp, 1); v.hpBar.fillRect(v.x - w / 2, by + 8, w * tp, 3);
    }
    const marks = [];
    for (const s of u.statuses) {
      const glyph = { burn: '🔥', bleed: '🩸', poison: '☠', hot: '✚', thorns: '🌿', guard: '🛡', ward: '◈', atkBuff: '↑', aura: '✦', healcut: '✂', frozen: '❄', shocked: '⚡', sealed: '🔒', purified: '✨', iceArmor: '🧊' }[s.kind];
      if (glyph) marks.push(glyph);
    }
    if (u.evade > 0) marks.push('◌');
    if (u.marksBy.length) marks.push('⚑');
    v.status.setText(marks.join(' '));
    if (u.downed) { ADV.VFX.desaturate(v.img); v.intent.setText(''); v.frame.setAlpha(0.4); v.name.setAlpha(0.5); }
    if (u.fled) { v.img.setAlpha(0.2); v.intent.setText('fled'); }
  }

  refreshIntents() {
    let shownPrompt = false;
    for (const v of this.unitViews.values()) {
      if (v.u.downed || v.u.fled) continue;
      if (v.u.planned && !v.u.ch.isPlayer) {
        v.intent.setText(v.u.planned.label || '');
        if (v.u.side === 'a' && !shownPrompt) {
          const l = ADV.Game.prompt(this.game_, 'firstIntentIcon');
          if (l) { ADV.Notices.toast(this, l); shownPrompt = true; }
        }
      } else v.intent.setText('');
    }
  }

  refreshStrip() {
    const st = this.st();
    this.roundText.setText('Round ' + st.round);
    const names = st.turnQueue.slice(st.turnIdx, st.turnIdx + 9).map(e => {
      const u = st.units.find(x => x.uid === e.uid);
      return u && !u.downed && !u.fled ? (u.ch.isPlayer ? '★' + u.ch.name : u.ch.name) : null;
    }).filter(Boolean);
    this.turnStrip.setText('order: ' + names.join(' → '));
  }

  updateReserveCounters() {
    const st = this.st();
    for (const side of ['a', 'b']) {
      const n = st.units.filter(u => u.side === side && u.reserved && !u.downed && !u.fled).length;
      const key = 'res_' + side;
      if (this[key]) { try { this[key].destroy(); } catch (e) {} this[key] = null; }
      if (n > 0) this[key] = T().text(this, side === 'a' ? 70 : T().W - 70, 600, `+${n} in reserve`, { size: 12, ox: 0.5, color: T().css.inkDim });
    }
  }

  // ------------------------------------------------------------ main loop
  loop() {
    if (this.ended) return;
    const st = this.st();
    this.drainEvents(() => {
      if (st.over) { this.finish(); return; }
      const t = ADV.Combat.currentTurn(st);
      if (!t) { this.finish(); return; }
      this.refreshStrip();
      this.refreshIntents();
      if (t.isPlayer) {
        this.showActionBar(t.unit);
      } else {
        this.time.delayedCall(160, () => {
          ADV.Combat.aiTakeTurn(st, t.unit);
          ADV.Combat.advance(st);
          this.loop();
        });
      }
    });
  }

  // animate events appended since eventCursor, then cb
  drainEvents(cb) {
    const st = this.st();
    const evs = st.events.slice(this.eventCursor);
    this.eventCursor = st.events.length;
    let i = 0;
    const step = () => {
      if (i >= evs.length) { for (const v of this.unitViews.values()) this.redrawUnit(v); this.updateReserveCounters(); cb(); return; }
      const e = evs[i++];
      const d = this.animateEvent(e);
      if (typeof d === 'function') d(step);          // blocking beats (campaign lines)
      else this.time.delayedCall(d, step);
    };
    step();
  }

  view(uid) { return this.unitViews.get(uid); }

  animateEvent(e) {
    const st = this.st();
    const V = ADV.VFX;
    const v = e.uid ? this.view(e.uid) : null;
    switch (e.t) {
      case 'round': {
        this.refreshStrip();
        // campaign banter (§8): one line from a present companion, round 2
        const b = ADV.Campaign && ADV.CampaignUI && this.mode === 'quest' ? ADV.Campaign.banter(this.game_, st, e.n) : null;
        if (b) return (next) => ADV.CampaignUI.playBeat(this, this.game_, { who: b.who, key: b.key, lines: [b.line] }, next);
        return 30;
      }
      case 'reinforce': {
        const u = st.units.find(x => x.uid === e.uid);
        if (u && !this.unitViews.has(e.uid)) this.makeUnitView(u);
        const nv = this.view(e.uid);
        if (nv) { ADV.VFX.damageNumber(this, nv.x, nv.y - 40, 'RISEN', '#9a70c0'); ADV.VFX.flashOverlay(this, 0x2a3a3a, 0.4); }
        return 400;
      }
      case 'campaignExit': {
        // companions walk off instead of dying (§5a): fade, then their line
        if (v) { this.tweens.add({ targets: [v.img, v.frame, v.name], alpha: 0.12, duration: 350 }); v.hpBar.setAlpha(0.12); v.intent.setAlpha(0.12); }
        const def = ADV.DATA.CAMPAIGN_CHARS[v && v.u.ch.campaignId];
        const lines = def && def.exitLines ? def.exitLines : null;
        const l = ADV.Game.prompt(this.game_, 'firstCampaignExit');
        if (l) ADV.Notices.toast(this, l);
        if (!lines || v.u.side !== 'a') return 400;
        const line = lines[Math.floor(Math.random() * lines.length)];
        const idx = lines.indexOf(line) + 1;
        return (next) => { if (ADV.Music) ADV.Music.speakCampaign(v.u.ch.campaignId, 'exit', idx); ADV.DialogueBox.showText(this, this.game_, v.u.ch, line, next); };
      }
      case 'skip': {
        if (v) V.damageNumber(this, v.x, v.y - 30, e.reason === 'frozen' ? 'frozen!' : 'bound!', '#6fc0e8');
        return 200;
      }
      case 'bribe': {
        const tv = e.target ? this.view(e.target) : null;
        if (tv) V.damageNumber(this, tv.x, tv.y - 30, e.success ? `bought off (${e.fee}g)` : `kept the ${e.fee}g anyway`, '#d4a94e');
        return 300;
      }
      case 'freed': { if (v) V.damageNumber(this, v.x, v.y - 30, 'freed!', '#83b56b'); return 260; }
      case 'unraise': { if (v) { V.healSparkle(this, v.x, v.y); V.damageNumber(this, v.x, v.y - 34, 'RESTORED TO LIFE', '#f4eee0'); } return 400; }
      case 'cleansed': { if (v) { V.healSparkle(this, v.x, v.y); if (e.purified) V.damageNumber(this, v.x, v.y - 30, 'purified', '#f4eee0'); this.redrawUnit(v); } return 200; }
      case 'sealedBlock': return 10;
      case 'use': {
        const src = this.view(e.uid);
        if (!src) return 10;
        const dir = src.u.side === 'a' ? 1 : -1;
        const tgt = e.target ? this.view(e.target) : null;
        const lbl = T().text(this, src.x, src.y - 78, e.name, { size: 12, ox: 0.5, color: T().css.gold })
          .setDepth(600).setAlpha(0.95);
        this.tweens.add({ targets: lbl, y: lbl.y - 16, alpha: 0, delay: 350, duration: 400, onComplete: () => lbl.destroy() });
        if (tgt && tgt.u.side !== src.u.side) {
          if (V.isProjectile(e.skillId)) V.projectile(this, src.x, src.y, tgt.x, tgt.y, V.skillColor(e.skillId));
          else { V.lunge(this, src.img, dir); V.slashArc(this, tgt.x, tgt.y, V.skillColor(e.skillId)); }
        } else {
          V.aura(this, src.x, src.y, e.skillId && ADV.DATA.SKILLS[e.skillId] && ADV.DATA.SKILLS[e.skillId].heal ? 0x83b56b : 0x6fa0bf);
        }
        return 240;
      }
      case 'damage': {
        if (!v) return 10;
        const color = e.tag === 'reflect' ? '#d4a94e' : e.tag === 'retaliation' ? '#9a70c0' : e.tag === 'dot' ? '#83b56b' : '#f4eee0';
        V.damageNumber(this, v.x + (Math.random() * 20 - 10), v.y - 30, e.dmg, color);
        V.recoil(this, v.img, v.u.side === 'a' ? 1 : -1);
        V.tintFlash(this, v.img, 0xff6655);
        this.redrawUnit(v);
        return 150;
      }
      case 'heal': { if (v) { V.healSparkle(this, v.x, v.y); V.damageNumber(this, v.x, v.y - 20, '+' + e.amount, '#83b56b'); this.redrawUnit(v); } return 140; }
      case 'down': {
        if (v) { V.shake(this, v.img); this.redrawUnit(v); V.camShake(this, 0.004); }
        return 220;
      }
      case 'execute': { if (v) { V.scalePunch(this, v.img); V.camShake(this, 0.008); V.flashOverlay(this, 0xa8352c); this.redrawUnit(v); } return 260; }
      case 'evade': { if (v) V.damageNumber(this, v.x, v.y - 30, 'miss', '#a89a7c'); return 100; }
      case 'counter': { if (v) V.damageNumber(this, v.x, v.y - 30, 'counter!', '#6fa0bf'); return 140; }
      case 'ward': { if (v) V.damageNumber(this, v.x, v.y - 30, 'blocked', '#d4a94e'); return 100; }
      case 'status': { if (v) this.redrawUnit(v); return 60; }
      case 'taunted': { if (v) { V.damageNumber(this, v.x, v.y - 30, 'taunted', '#9a70c0'); this.redrawUnit(v); } return 90; }
      case 'sundered': { if (v) V.damageNumber(this, v.x, v.y - 30, 'armor torn', '#d4a94e'); return 100; }
      case 'flee': {
        if (v) { if (e.success) { this.tweens.add({ targets: v.img, alpha: 0.15, x: v.x + (v.u.side === 'a' ? -60 : 60), duration: 300 }); } else V.damageNumber(this, v.x, v.y - 30, 'cornered!', '#d8574a'); }
        const l = ADV.Game.prompt(this.game_, 'firstFlee');
        if (l) ADV.Notices.toast(this, l);
        return 260;
      }
      case 'levelUp': {
        if (v && v.u.ch.isPlayer) {
          const sk = ADV.DATA.SKILLS[e.skillId];
          const tname = sk.tiers[e.tier].name;
          ADV.Notices.toast(this, `${sk.name} rises to L${e.level}${e.tier !== 'basic' ? ' — it is ' + tname + ' now' : ''}`);
          const l = ADV.Game.prompt(this.game_, 'firstSkillLevel');
          if (l) this.time.delayedCall(400, () => ADV.Notices.toast(this, l));
        }
        return 60;
      }
      case 'reserveIn': {
        const u = st.units.find(x => x.uid === e.uid);
        if (u && !this.unitViews.has(e.uid)) this.makeUnitView(u);
        return 160;
      }
      case 'revive': { if (v) { v.img.clearTint(); v.frame.setAlpha(1); v.name.setAlpha(1); ADV.VFX.healSparkle(this, v.x, v.y); this.redrawUnit(v); } return 200; }
      case 'trueRest': { if (v) { ADV.VFX.flashOverlay(this, 0xf4eee0, 0.35); this.redrawUnit(v); } return 300; }
      case 'surviveLethal': { if (v) ADV.VFX.damageNumber(this, v.x, v.y - 30, 'refuses to fall', '#83b56b'); return 200; }
      case 'permGain': { if (v) ADV.VFX.damageNumber(this, v.x, v.y - 40, '+1 ALL', '#9a70c0'); return 160; }
      case 'immune': { if (v) ADV.VFX.damageNumber(this, v.x, v.y - 30, 'immune', '#9a70c0'); return 90; }
      case 'end': return 200;
      case 'survivalGrowth': { if (v) V.damageNumber(this, v.x, v.y - 44, `+${e.gain} MAX HP (${e.total})`, '#83b56b'); return 240; }
      case 'extraTurn': { if (v) V.damageNumber(this, v.x, v.y - 40, 'storm speed — again!', '#6fc0e8'); return 260; }
      case 'arenaChampion': { if (v) { V.scalePunch(this, v.img); V.damageNumber(this, v.x, v.y - 44, `ARENA CHAMPION ×${e.stacks}`, '#d4a94e'); this.redrawUnit(v); } return 320; }
      default: return 10;
    }
  }

  // ------------------------------------------------------------ player turn
  clearActionBar() {
    for (const o of this.actionObjs) { try { o.destroy(); } catch (e) {} }
    this.actionObjs = [];
    this.targeting = null;
  }

  showActionBar(u) {
    this.clearActionBar();
    const st = this.st();
    const W = T().W, H = T().H;
    const keep = o => { this.actionObjs.push(o); return o; };
    keep(T().panel(this, 40, H - 110, W - 80, 96));
    keep(T().text(this, 56, H - 104, 'Your move', { size: 12, color: T().css.gold }));
    let x = 56;
    const mkBtn = (label, sub, fn, disabled, tipSkillId) => {
      const w = Math.max(96, label.length * 8 + 22);
      const b = T().button(this, x, H - 86, w, 60, label, fn, { size: 13, sub, disabled });
      if (tipSkillId) ADV.Tooltip.attach(this, b.zone, () => ADV.SkillInfo.describe(u.ch, tipSkillId));
      keep(b.g); keep(b.txt); if (b.sub) keep(b.sub); keep(b.zone);
      x += w + 8;
    };
    const seal = u.statuses.find(x => x.kind === 'sealed');
    const actions = [];
    for (const e of u.ch.actives) {
      const sk = ADV.DATA.SKILLS[e.skillId];
      if (!sk || sk.target === 'postVictory') continue;
      const m = ADV.Combat.manifestFor(u, e.skillId);
      const sealed = !!(seal && (seal.tiers || []).includes(m.tier));
      const pool = sealed ? [] : ADV.Combat.validTargets(st, u, e.skillId, false);
      actions.push({ label: m.data.name, sub: sealed ? 'SEALED' : 'L' + e.level, skillId: e.skillId, off: false, pool });
      if (m.data.offensive) {
        const opool = sealed ? [] : ADV.Combat.validTargets(st, u, e.skillId, true);
        actions.push({ label: m.data.offensive.name, sub: sealed ? 'SEALED' : 'hostile', skillId: e.skillId, off: true, pool: opool });
      }
    }
    // Charm's bribe: buy off hostile named enemies (request 6)
    const offers = {};
    for (const foe of ADV.Combat.living(st, u.side === 'a' ? 'b' : 'a')) {
      const offer = ADV.Game.bribeOffer(this.game_, foe.ch);
      if (offer && (u.ch.inventory.gold || 0) >= offer.fee) offers[foe.uid] = offer;
    }
    const bribePool = Object.keys(offers).map(uid => st.units.find(x => x.uid === uid));
    if (bribePool.length) {
      actions.push({ label: 'Bribe', sub: 'gold buys peace', isBribe: true, offers, pool: bribePool });
    }
    const basicPool = ADV.Combat.validTargets(st, u, 'basic_attack', false);
    actions.push({ label: 'Attack', sub: 'always', skillId: 'basic_attack', off: false, pool: basicPool, isAttack: true });
    for (const a of actions) {
      mkBtn(a.label, a.sub, () => this.beginTargeting(u, a), !a.pool.length, a.skillId);
    }

    mkBtn('Flee', 'costs the turn', () => {
      this.clearActionBar();
      ADV.Combat.act(st, u, { kind: 'flee' });
      ADV.Combat.advance(st);
      this.loop();
    });
  }

  beginTargeting(u, action) {
    if (!action.pool.length) return;
    if (action.pool.length === 1 || (action.pool.length && action.pool[0] === u)) {
      return this.commitAction(u, action, action.pool[0]);
    }
    // highlight valid targets
    this.targeting = { u, action, marks: [] };
    for (const tgt of action.pool) {
      const v = this.view(tgt.uid);
      if (!v) continue;
      const ring = this.add.rectangle(v.x, v.y, v.img.displayWidth + 10, v.img.displayHeight + 10)
        .setStrokeStyle(3, 0xd4a94e).setFillStyle(0xd4a94e, 0.08).setDepth(700)
        .setInteractive({ useHandCursor: true });
      ring.on('pointerdown', () => this.commitAction(u, action, tgt));
      this.targeting.marks.push(ring);
      this.actionObjs.push(ring);
    }
    const cancel = T().text(this, T().W / 2, 100, 'choose a target (click elsewhere to cancel)', { size: 13, ox: 0.5, color: T().css.gold }).setDepth(700);
    this.actionObjs.push(cancel);
  }

  commitAction(u, action, tgt) {
    const st = this.st();
    this.clearActionBar();
    const act = action.isBribe
      ? Object.assign({ kind: 'bribe', targetUid: tgt.uid }, action.offers[tgt.uid])
      : action.isAttack ? { kind: 'attack', targetUid: tgt.uid }
      : { kind: 'skill', skillId: action.skillId, targetUid: tgt.uid, offensiveMode: action.off };
    const res = ADV.Combat.act(st, u, act);
    if (res && res.refund) { this.drainEvents(() => this.showActionBar(u)); return; }
    ADV.Combat.advance(st);
    this.loop();
  }

  // ------------------------------------------------------------ end of combat
  finish() {
    if (this.ended) return;
    this.ended = true;
    this.clearActionBar();
    const game = this.game_;
    this.time.delayedCall(400, () => {
      if (this.mode === 'quest') {
        const r = ADV.Game.finishCombat(game);
        if (r.playerDead) { ADV.Game.onPlayerDeath(game, null); this.scene.start('Death'); return; }
        if (r.won && game.quest.defeatedNamed.length) { this.namedChoices(game.quest.defeatedNamed.filter(c => c.alive), () => this.scene.start('Quest')); return; }
        this.scene.start('Quest');
      } else if (this.mode === 'ambush') {
        const r = ADV.Game.finishAmbush(game);
        if (r.playerDead) { ADV.Game.onPlayerDeath(game, r.attacker ? r.attacker.id : null); this.scene.start('Death'); return; }
        this.namedChoices((r.defeatedNamed || []).filter(c => c.alive), () => this.scene.start('Town'));
      } else if (this.mode === 'rescue') {
        const r = ADV.Game.finishRescue(game);
        if (r.playerDead) { ADV.Game.onPlayerDeath(game, r.attacker ? r.attacker.id : null); this.scene.start('Death'); return; }
        this.namedChoices((r.defeatedNamed || []).filter(c => c.alive), () => this.scene.start('Town'));
      } else if (this.mode === 'assassination') {
        const r = ADV.Game.finishAssassination(game);
        if (r.playerDead) { ADV.Game.onPlayerDeath(game, r.target ? r.target.id : null); this.scene.start('Death'); return; }
        this.namedChoices((r.defeatedNamed || []).filter(c => c.alive), () => this.scene.start('Town'));
      }
    });
  }

  // Post-battle choices for defeated named characters (§3a): kill / KO /
  // conscript / necromancy.
  namedChoices(list, done) {
    const game = this.game_;
    const p = ADV.Game.player(game);
    const next = () => {
      const c = list.shift();
      if (!c) { ADV.Save.saveGame(game); done(); return; }
      if (!c.alive) return next();
      const opts = [
        { label: 'Kill — take what they carry', value: 'kill' },
        { label: 'Knock out — hospitalized 3 quests', value: 'knockout' },
      ];
      if (ADV.SkillSys.entryFor(p, 'conscript')) opts.push({ label: 'Conscript them', value: 'conscript' });
      if (ADV.SkillSys.entryFor(p, 'necromancy')) opts.push({ label: 'Raise them', value: 'necromancy' });
      ADV.DialogueBox.show(this, game, c, 'general', ADV.DialogueBox.ctxFor(game, c), () => {
        ADV.Notices.pickOne(this, c.name + ' is beaten', 'The choice is the victor\'s.', opts, (v) => {
          const r = ADV.Game.resolveDefeatedNamed(game, c, v || 'knockout');
          if (r && r.error) ADV.Notices.toast(this, r.error);
          next();
        });
      });
    };
    if (!list.length) { done(); return; }
    next();
  }
}

ADV.CombatScene = CombatScene;
})();
