// Town Hub (§8/§20): storybook menu screen. Persistent character panel on the
// left, menu column beside it, content pane on the right. No traversable map.
(function () {
'use strict';
const T = () => ADV.T;
const C = () => ADV.DATA.CONST;

class TownScene extends Phaser.Scene {
  constructor() { super('Town'); }

  create() {
    this.game_ = this.registry.get('game');
    const W = T().W, H = T().H;
    this.add.rectangle(W / 2, H / 2, W, H, T().c.bg);
    this.contentObjs = [];
    this.noticeQueue = [];
    this.campaignArrivalDone = false;
    this.tutorDone = false; this.tutorObjs = [];
    ADV.Music.play('town');
    ADV.Music.button(this, W - 26, T().H - 30);

    this.buildCharacterPanel();
    this.buildMenu();
    this.openPanel('board');

    // arrival notices: jilt choice, rescues, divine offers, withdrawals, prompts
    this.queueArrivalNotices();
    this.time.delayedCall(150, () => this.nextNotice());
  }

  g() { return this.game_; }
  player() { return ADV.Game.player(this.game_); }

  // ---------------------------------------------------------------- left panel
  buildCharacterPanel() {
    const p = this.player();
    const x = 16, y = 16, w = 250, h = T().H - 32;
    if (this.charObjs) this.charObjs.forEach(o => { try { o.destroy(); } catch (e) {} });
    this.charObjs = [];
    const add = (o) => { this.charObjs.push(o); return o; };
    add(T().panel(this, x, y, w, h));
    const key = ADV.Portraits.key(this, p);
    add(this.add.image(x + w / 2, y + 92, key).setDisplaySize(140, 168));
    const fg = add(this.add.graphics());
    fg.lineStyle(2, T().c.gold, 0.7); fg.strokeRect(x + w / 2 - 70, y + 8, 140, 168);
    add(T().text(this, x + w / 2, y + 186, p.name, { size: 19, display: true, ox: 0.5, color: T().css.gold, bold: true }));
    const ft = ADV.Campaign ? ADV.Campaign.titleName(p) : null;
    const titleLine = [p.title, ft].filter(Boolean).join(' · ');
    if (titleLine) add(T().text(this, x + w / 2, y + 208, titleLine, { size: 12, ox: 0.5, italic: true, color: T().css.purple, wrap: w - 16, align: 'center' }));
    const stage = ADV.Game.careerStage(this.game_);
    const wr = p.sex === 'm' && ADV.Courtship ? ADV.Courtship.wealthRank(this.game_.world, p) : 0;
    add(T().text(this, x + w / 2, y + (titleLine ? 226 : 210), `${stage} · rank ${p.rank} · rep ${p.reputation}${wr ? ' · wealth #' + wr : ''}`, { size: 12, ox: 0.5, color: wr && wr <= C().COURT.wealthTop ? T().css.gold : T().css.inkDim }));

    let yy = y + 246;
    const S = (k) => ADV.Character.effStat(p, k);
    add(T().text(this, x + 16, yy, `HP ${S('hp')}   ATK ${S('atk')}   DEF ${S('def')}   SPD ${S('spd')}`, { size: 13 }));
    yy += 24;
    add(T().text(this, x + 16, yy, `Gold carried: ${p.inventory.gold}`, { size: 13, color: T().css.gold }));
    const v = ADV.Vault.of(this.game_.world, p);
    yy += 20;
    add(T().text(this, x + 16, yy, v ? `Vault: ${v.gold}${v.sharedWithId || (v.holderId !== p.id) ? ' (shared)' : ''}` : 'Vault: none yet', { size: 13, color: T().css.inkDim }));
    yy += 20;
    add(T().text(this, x + 16, yy, p.equippedSet ? `Set: ${ADV.DATA.GEAR_SETS[p.equippedSet].name}` : 'No gear set', { size: 13, color: p.equippedSet ? T().css.green : T().css.inkFaint }));
    if (p.meal) { yy += 20; add(T().text(this, x + 16, yy, `Fed: ${p.meal.name} (${Object.entries(p.meal.bonus).map(([k, v]) => '+' + v + ' ' + k.toUpperCase()).join(', ')})`, { size: 12, color: T().css.green, wrap: w - 32 })); }
    yy += 28;
    add(T().text(this, x + 16, yy, `Perks (${p.perks.filter(e => !ADV.DATA.SKILLS[e.skillId].noSlot).length}/${ADV.SkillSys.capFor(p, 'perk')})`, { size: 13, color: T().css.inkDim }));
    yy += 20;
    for (const e of p.perks) {
      const m = ADV.SkillSys.manifest(p, e);
      const t = add(T().text(this, x + 22, yy, `${m.data.name} · L${e.level}`, { size: 12, color: m.tier !== 'basic' ? T().css.gold : T().css.ink }));
      t.setInteractive({ useHandCursor: true });
      ADV.Tooltip.attach(this, t, () => ADV.SkillInfo.describe(p, e.skillId));
      yy += 17;
    }
    yy += 8;
    add(T().text(this, x + 16, yy, `Actives (${p.actives.filter(e => !ADV.DATA.SKILLS[e.skillId].noSlot).length}/${ADV.SkillSys.capFor(p, 'active')})`, { size: 13, color: T().css.inkDim }));
    yy += 20;
    for (const e of p.actives) {
      const m = ADV.SkillSys.manifest(p, e);
      const t = add(T().text(this, x + 22, yy, `${m.data.name} · L${e.level}`, { size: 12, color: m.tier !== 'basic' ? T().css.gold : T().css.ink }));
      t.setInteractive({ useHandCursor: true });
      ADV.Tooltip.attach(this, t, () => ADV.SkillInfo.describe(p, e.skillId));
      yy += 17;
    }
    const kids = (p.dependents || []);
    if (kids.length) {
      yy += 8;
      add(T().text(this, x + 16, yy, `Children: ${kids.map(d => d.age >= C().CHILD_SELF_SUFFICIENT ? '◉' : '◎').join(' ')}  (${kids.length})`, { size: 13, color: T().css.blue }));
    }
    const partner = p.partnerId ? this.game_.world.characters.find(c => c.id === p.partnerId) : null;
    if (partner) {
      yy += 20;
      add(T().text(this, x + 16, yy, `Partner: ${partner.name}`, { size: 13, color: T().css.purple }));
    }
    add(T().text(this, x + 16, T().H - 44, `world clock: quest ${this.game_.world.questClock} · life ${this.game_.life}`, { size: 11, color: T().css.inkFaint }));
  }

  // ---------------------------------------------------------------- menu
  buildMenu() {
    const x = 282, y = 16, w = 190;
    T().panel(this, x, y, w, T().H - 32);
    T().text(this, x + w / 2, y + 20, 'THE TOWN', { size: 16, display: true, ox: 0.5, color: T().css.gold });
    const p = this.player();
    const stage = ADV.Game.careerStage(this.game_);
    const items = [
      ['board', 'Quest Board'],
      ...(ADV.Campaign && ADV.Campaign.menuVisible(this.game_) ? [['campaign', ADV.Campaign.faction(this.game_) ? ADV.Campaign.faction(this.game_).name : 'Campaign']] : []),
      // The second campaign holds up to three allegiances, so its entry is the
      // hall list, not one faction's name (add-on §1b).
      ...(ADV.Campaign2 && ADV.Campaign2.menuVisible(this.game_)
        ? [['campaign2', ADV.Campaign2.joined(this.game_).length === 1
            ? ADV.Campaign2.faction(ADV.Campaign2.joined(this.game_)[0]).short
            : 'Allegiances']]
        : []),
      ['store', 'Store'],
      ['trainer', 'Trainer'],
      ['apply', 'Apply for Party'],
      ['create', 'Create Party', stage === 'leader' ? null : (p.inventory.gold < C().GOLD.partyStartupCapital ? `${C().GOLD.partyStartupCapital}g` : null)],
      ['roster', 'Guild Roster'],
      ['rel', 'Relationships'],
      ['vault', 'Vault'],
      ['faction', 'Faction Status'],
      ['journal', 'Skill Journal'],
      ['codex', 'Codex'],
    ];
    let yy = y + 46;
    this.menuButtons = {};
    if (this.menuObjs) this.menuObjs.forEach(o => { try { o.destroy(); } catch (e) {} });
    this.menuObjs = [];
    const tut = ADV.Tutor && ADV.Tutor.active(this.game_);
    for (const [id, label, lock] of items) {
      const tutLocked = tut && !ADV.Tutor.allowed(this.game_, id);
      const locked = !!lock || tutLocked;
      const b = T().button(this, x + 10, yy, w - 20, 38, label, () => {
        if (locked) return;
        this.openPanel(id);
      }, { size: 14, disabled: locked, sub: lock ? 'needs ' + lock : null, subColor: T().css.blood });
      this.menuObjs.push(b.g, b.txt, b.zone); if (b.sub) this.menuObjs.push(b.sub);
      this.menuButtons[id] = b;
      yy += locked ? 48 : 44;
    }
    // notices badge
    const n = this.pendingCount();
    if (n > 0 && !tut) {
      const nb = T().button(this, x + 10, T().H - 62, w - 20, 34, `Notices (${n})`, () => { this.queueArrivalNotices(true); this.nextNotice(); }, { size: 13, color: T().css.blood });
      this.menuObjs.push(nb.g, nb.txt, nb.zone);
    }
  }

  pendingCount() {
    const w = this.game_.world;
    return (w.pendingRescues || []).length + (w.divineOffers || []).filter(o => o.candidateId === w.playerId).length +
      (w.pendingHeroInvites || []).length + (w.pendingPlayerJilt ? 1 : 0) + (w.pendingProposals || []).length + (w.pendingRaises || []).length +
      ((ADV.Vault.of(w, this.player()) || {}).pendingWithdrawals || []).length;
  }

  // ---------------------------------------------------------------- content
  clearContent() {
    for (const o of this.contentObjs) { try { o.destroy(); } catch (e) {} }
    this.contentObjs = [];
  }
  keep(o) { this.contentObjs.push(o); return o; }
  contentRect() { return { x: 488, y: 16, w: T().W - 488 - 16, h: T().H - 32 }; }

  openPanel(id) {
    this.currentPanel = id;
    this.clearContent();
    const r = this.contentRect();
    this.keep(T().panel(this, r.x, r.y, r.w, r.h));
    const P = ADV.Panels;
    const panel = { board: P.questBoard, store: P.store, trainer: P.trainer, apply: P.applyParty,
       create: P.createParty, roster: P.roster, rel: P.relationships,
       faction: P.factions, journal: P.journal, codex: P.codex, campaign: P.campaign,
       campaign2: P.campaign2, vault: P.vault }[id];
    if (!panel) { this.keep(T().text(this, r.x + 24, r.y + 40, 'Nothing here.', { size: 14, color: T().css.inkFaint })); return; }
    panel(this, r);
    if (ADV.Tutor && ADV.Tutor.active(this.game_)) ADV.Tutor.panel(this, this.game_, id, r);
  }

  refreshAll() {
    this.buildCharacterPanel();
  }

  // ---------------------------------------------------------------- notices
  queueArrivalNotices(force) {
    const w = this.game_.world;
    const p = this.player();
    this.noticeQueue = [];
    if (ADV.Tutor && ADV.Tutor.active(this.game_)) return;   // the guide has the floor
    if (w.pendingPlayerJilt) this.noticeQueue.push({ kind: 'jilt' });
    for (const rsc of (w.pendingRescues || [])) this.noticeQueue.push({ kind: 'rescue', rescue: rsc });
    for (const o of (w.divineOffers || []).filter(o => o.candidateId === w.playerId)) this.noticeQueue.push({ kind: 'divine', offer: o });
    for (const inv of (w.pendingHeroInvites || [])) this.noticeQueue.push({ kind: 'heroInvite', invite: inv });
    for (const pr of (w.pendingProposals || [])) this.noticeQueue.push({ kind: 'proposal', proposal: pr });
    for (const rz of (w.pendingRaises || [])) this.noticeQueue.push({ kind: 'raise', raise: rz });
    const v = ADV.Vault.of(w, p);
    if (v) for (let i = 0; i < v.pendingWithdrawals.length; i++) this.noticeQueue.push({ kind: 'withdrawal', vault: v });
    if (w.theftFlag) { w.theftFlag = false; this.promptOnce('firstTheft'); }
    if (this.game_.newChildFlag) { this.game_.newChildFlag = false; this.promptOnce(p.sex === 'f' ? 'firstChildbirth' : 'firstPregnancy'); }
    if (this.game_.pendingChildNaming) this.noticeQueue.unshift({ kind: 'nameChild', child: this.game_.pendingChildNaming });
    if (this.game_.childJustSelfSufficient) { this.game_.childJustSelfSufficient = false; this.promptOnce('childSelfSufficient'); }
    if (ADV.Rel.hatredEdgeCount(w, p.id) > 0) this.promptOnce('firstHatred');
  }

  nextNotice() {
    const n = this.noticeQueue.shift();
    if (!n) {
      this.refreshAll();
      if (ADV.Tutor && !this.tutorDone) {
        this.tutorDone = true;
        const st = ADV.Tutor.state(this.game_);
        if (st.step !== 'done') { ADV.Tutor.town(this, this.game_); return; }
        if (st.finished && !st.finalShown) { st.finalShown = true; ADV.Save.saveGame(this.game_); ADV.Tutor.finalWords(this, this.game_); return; }
      }
      if (ADV.CampaignUI && !this.campaignArrivalDone) {
        this.campaignArrivalDone = true;
        const hadMenu = !!this.menuButtons.campaign;
        const hadMenu2 = !!this.menuButtons.campaign2;
        const settle = () => {
          this.refreshAll();
          const gained = (!hadMenu && ADV.Campaign.menuVisible(this.game_)) ||
                         (!hadMenu2 && ADV.Campaign2 && ADV.Campaign2.menuVisible(this.game_));
          if (gained) this.scene.restart();
        };
        // Both campaigns arrive through the same door, first one then the other,
        // so their beats never talk over each other.
        ADV.CampaignUI.arrival(this, this.game_, () => {
          if (ADV.Campaign2UI) ADV.Campaign2UI.arrival(this, this.game_, settle); else settle();
        });
      }
      return;
    }
    const P = ADV.Notices;
    ({ jilt: P.jilt, rescue: P.rescue, divine: P.divine, heroInvite: P.heroInvite, withdrawal: P.withdrawal, nameChild: P.nameChild, proposal: P.proposal, raise: P.raise }[n.kind])(this, n, () => this.nextNotice());
  }

  promptOnce(id) {
    const line = ADV.Game.prompt(this.game_, id);
    if (!line) return;
    ADV.Notices.toast(this, line);
  }

  // Speak helper: NPC dialogue box on interactions (§17a trigger points)
  speak(npc, band, extra, done) {
    ADV.DialogueBox.show(this, this.game_, npc, band || ADV.DialogueBox.bandFor(this.game_, npc),
      ADV.DialogueBox.ctxFor(this.game_, npc, extra), done);
  }
}

ADV.TownScene = TownScene;
})();
