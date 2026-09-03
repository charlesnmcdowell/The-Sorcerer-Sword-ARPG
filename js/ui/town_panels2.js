// Town content panels, part 2: parties, roster + event feed, relationships +
// vault. Plus the Notices modal library.
(function () {
'use strict';
const T = () => ADV.T;
const C = () => ADV.DATA.CONST;

const Panels = ADV.Panels = ADV.Panels || {};

const header = (scene, r, title, sub) => ADV.UI.header(scene, r, title, sub);
const keepBtn = (scene, b) => ADV.UI.keepBtn(scene, b);

// ============================================================== APPLY FOR PARTY
Panels.applyParty = function (scene, r) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  const tut = ADV.Tutor && ADV.Tutor.step(game) === 'party';
  header(scene, r, 'Apply for Party', 'Acceptance runs on reputation and what your sheet fills. A party missing a healer wants healing more than it wants fame.');
  const myParty = ADV.Party.of(world, p);
  let y = r.y + 92;
  if (myParty) {
    const leader = ADV.Party.leader(world, myParty);
    const isLeader = myParty.leaderId === p.id;
    scene.keep(T().text(scene, r.x + 24, y, isLeader ? 'You lead your own party.' : `You ride with ${leader ? leader.name : 'a party'} for ${p.wage || C().GOLD.hirelingWage}g a quest.`, { size: 15 }));
    y += 30;
    if (!isLeader) {
      keepBtn(scene, T().button(scene, r.x + 24, y, 200, 38, 'Quit the party', () => {
        ADV.Party.removeMember(world, myParty, p.id);
        ADV.Save.saveGame(game);
        scene.refreshAll(); scene.openPanel('apply');
      }, { size: 14 }));
      y += 50;
    }
  }
  // your asking wage (request): name a price when you join — within what a leader can afford
  if (!myParty && !tut) {
    scene.askWage = scene.askWage || ADV.Party.hirelingWageFor(p);
    scene.keep(T().text(scene, r.x + 24, y + 10, `Your asking wage: ${scene.askWage}g a quest`, { size: 14, color: T().css.gold }));
    keepBtn(scene, T().button(scene, r.x + 300, y, 40, 32, '−', () => { scene.askWage = Math.max(C().GOLD.wageAcceptMin, scene.askWage - 5); scene.openPanel('apply'); }, { size: 14 }));
    keepBtn(scene, T().button(scene, r.x + 346, y, 40, 32, '+', () => { scene.askWage = Math.min(C().GOLD.wageAcceptMax, scene.askWage + 5); scene.openPanel('apply'); }, { size: 14 }));
    scene.keep(T().text(scene, r.x + 400, y + 4, 'higher asks are refused more often — and never above what a leader can pay', { size: 11, italic: true, color: T().css.inkFaint, wrap: r.w - 420 }));
    y += 44;
  }
  const parties = world.parties.filter(x => x.leaderId !== p.id && !x.memberIds.includes(p.id));
  if (!parties.length) scene.keep(T().text(scene, r.x + 24, y, 'No party is hiring today.', { size: 14, italic: true, color: T().css.inkFaint }));
  for (const party of parties) {
    const leader = ADV.Party.leader(world, party);
    if (!leader || !leader.alive) continue;
    const members = ADV.Party.members(world, party);
    const odds = ADV.Party.applicationOdds(world, party, p);
    const cap = ADV.Party.maxAffordableWage(world, party, game.board);
    const ask = tut ? ADV.Tutor.wage() : (scene.askWage || ADV.Party.hirelingWageFor(p));
    // a high ask costs odds; an ask past the purse is refused outright
    let finalOdds = odds.odds;
    if (!tut && finalOdds > 0) finalOdds = ask > cap ? 0 : Math.max(0.05, finalOdds * (1 - Math.max(0, ask - C().GOLD.hirelingWage) / 60));
    const archs = new Set();
    for (const m of [leader].concat(members)) for (const e of m.actives) {
      const sk = ADV.DATA.SKILLS[e.skillId];
      if (sk && sk.archetype) archs.add(sk.archetype);
    }
    const sub = `${members.length + 1}/${C().PARTY_MAX} · runs ${[...archs].join(', ') || 'nothing'} · odds ${finalOdds ? Math.round(finalOdds * 100) + '%' : '—'}${odds.why === 'hatred' ? ' (bad blood)' : ''}${!tut && ask > cap ? ` · can pay at most ${cap}g` : ''}`;
    keepBtn(scene, T().button(scene, r.x + 24, y, r.w - 240, 46, `${leader.name}'s party`, () => {
      if (myParty) { ADV.Notices.toast(scene, 'You already have a party.'); return; }
      if (ADV.Party.roster(world, party).length >= C().PARTY_MAX) { ADV.Notices.toast(scene, 'They are full.'); return; }
      let accepted, wage = ask;
      const scripted = ADV.Tutor ? ADV.Tutor.application(game, party) : null;
      if (scripted) { accepted = scripted.accepted; if (scripted.wage) wage = scripted.wage; }
      else {
        if (odds.odds <= 0) { scene.promptOnce('firstBlockedHire'); ADV.Notices.toast(scene, 'They will not have you.'); return; }
        if (ask > cap) { ADV.Notices.toast(scene, `${leader.name} cannot pay that. ${cap}g at most.`); return; }
        accepted = Math.random() < finalOdds;
      }
      scene.speak(leader, accepted ? ADV.DialogueBox.bandFor(game, leader) : 'general', {}, () => {
        if (accepted) {
          party.memberIds.push(p.id); party.wages[p.id] = wage;
          p.partyId = party.id; p.leaderId = leader.id; p.wage = wage;
          ADV.World.met(world, leader.id);
          if (ADV.Tutor) ADV.Tutor.onHired(game);
          ADV.Notices.toast(scene, `Hired at ${wage}g a quest. The take is the leader's — you go where they go.`);
          ADV.Save.saveGame(game);
          scene.refreshAll();
          if (ADV.Tutor && ADV.Tutor.active(game)) { scene.buildMenu(); scene.openPanel('apply'); ADV.Tutor.town(scene, game); }
          else scene.openPanel('apply');
        } else {
          ADV.Notices.toast(scene, scripted ? 'Turned away. It happens — ask another party.' : 'Turned away. Reputation opens this door.');
          ADV.Save.saveGame(game);
          scene.refreshAll(); scene.openPanel('apply');
        }
      });
    }, { size: 15, display: true, sub, subColor: finalOdds > 0.5 ? T().css.green : T().css.inkDim }));
    y += 56;
  }
};

// ============================================================== CREATE PARTY / HIRING
Panels.createParty = function (scene, r) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  let party = ADV.Party.of(world, p);
  const isLeader = party && party.leaderId === p.id;
  header(scene, r, isLeader ? 'Your Party' : 'Create Party',
    'Wages are fixed offers — they take it or they don\'t. NPCs accept between 25 and 60. Payroll is owed win or lose.');
  let y = r.y + 92;
  if (!isLeader) {
    if (party) { scene.keep(T().text(scene, r.x + 24, y, 'You already serve in someone else\'s party.', { size: 14 })); return; }
    keepBtn(scene, T().button(scene, r.x + 24, y, 280, 44, `Found a party — ${C().GOLD.partyStartupCapital}g`, () => {
      if (p.inventory.gold < C().GOLD.partyStartupCapital) { ADV.Notices.toast(scene, 'Not enough capital.'); return; }
      p.inventory.gold -= C().GOLD.partyStartupCapital;
      ADV.Party.create(world, p.id);
      ADV.Save.saveGame(game);
      scene.refreshAll(); scene.openPanel('create');
    }, { size: 15, display: true, disabled: p.inventory.gold < C().GOLD.partyStartupCapital }));
    return;
  }
  // roster
  const members = ADV.Party.members(world, party);
  scene.keep(T().text(scene, r.x + 24, y, `Payroll: ${ADV.Party.payroll(world, party)}g per quest · ${members.length + 1}/${C().PARTY_MAX}`, { size: 14, color: T().css.gold }));
  y += 28;
  for (const m of members) {
    const followers = (m.conscriptIds || []).length + (m.undeadIds || []).length;
    const relTier = ADV.Rel.tierBetween(world, m.id, p.id);
    const sub = `wage ${party.wages[m.id]}g · ${relTier}${followers ? ' · commands ' + followers : ''}`;
    keepBtn(scene, T().button(scene, r.x + 24, y, 320, 44, m.name, () => {
      ADV.Notices.confirm(scene, 'Dismiss ' + m.name + '?', 'They keep what they were paid, and they remember.', 'Dismiss', () => {
        ADV.Party.removeMember(world, party, m.id);
        ADV.Rel.move(world, m.id, p.id, -15, 'quest');
        ADV.Save.saveGame(game);
        scene.refreshAll(); scene.openPanel('create');
      });
    }, { size: 14, sub, subColor: T().relColor(relTier) }));
    y += 52;
  }
  y += 8;
  scene.keep(T().text(scene, r.x + 24, y, 'FOR HIRE', { size: 12, color: T().css.inkDim })); y += 24;
  const cands = world.characters.filter(c => c.alive && !c.isPlayer && !c.isMonster && !c.partyId &&
    !c.registryId && c.status === 'normal' && !c.isConscript && !c.isUndead && c.hospitalizedQuestsLeft <= 0);
  for (const cand of cands.slice(0, 6)) {
    const blocked = ADV.Party.hatredConflict(world, party, cand.id);
    const skills = cand.actives.slice(0, 3).map(e => ADV.DATA.SKILLS[e.skillId].name).join(', ');
    const knowsForbidden = ['conscript', 'necromancy'].some(id => ADV.SkillSys.knows(cand, id));
    const sub = `${skills}${knowsForbidden ? ' · knows forbidden arts' : ''}${blocked ? ' · WILL NOT SERVE' : ''}`;
    keepBtn(scene, T().button(scene, r.x + 24, y, r.w - 240, 44, `${cand.name} (rank ${cand.rank})`, () => {
      if (blocked) { scene.promptOnce('firstBlockedHire'); ADV.Notices.toast(scene, 'Bad blood. No wage fixes it.'); return; }
      Panels.wageDialog(scene, party, cand);
    }, { size: 14, sub, subColor: blocked ? T().css.blood : knowsForbidden ? T().css.purple : T().css.inkDim, disabled: members.length + 1 >= C().PARTY_MAX }));
    y += 52;
    if (y > r.y + r.h - 70) break;
  }
};

Panels.wageDialog = function (scene, party, cand) {
  const game = scene.g();
  let wage = C().GOLD.typicalWage;
  ADV.Notices.custom(scene, (keep, D, close) => {
    const W = T().W;
    keep(T().text(scene, W / 2, 260, `Offer ${cand.name} a wage`, { size: 20, display: true, ox: 0.5, color: T().css.gold }).setDepth(D));
    const amount = keep(T().text(scene, W / 2, 310, '', { size: 28, display: true, ox: 0.5 }).setDepth(D));
    const render = () => amount.setText(wage + 'g / quest');
    render();
    for (const [dx, lbl, d] of [[-180, '−5', -5], [-100, '−1', -1], [60, '+1', 1], [140, '+5', 5]]) {
      ADV.UI.modalBtn(keep, D, T().button(scene, W / 2 + dx, 296, 56, 30, lbl, () => { wage = Math.max(5, Math.min(99, wage + d)); render(); }, { size: 13 }));
    }
    const go = T().button(scene, W / 2 - 190, 360, 180, 40, 'Make the offer', () => {
      close();
      const r = ADV.Party.offerWage(game.world, game.rng, party, cand, wage);
      scene.speak(cand, r.ok ? ADV.DialogueBox.bandFor(game, cand) : 'general', {}, () => {
        ADV.Notices.toast(scene, r.ok ? `${cand.name} signs on at ${wage}g.` :
          r.why === 'declined' ? 'They pass. Pride or greed — hard to say.' : 'They cannot: ' + r.why);
        if (r.ok) ADV.World.met(game.world, cand.id);
        ADV.Save.saveGame(game);
        scene.refreshAll(); scene.openPanel('create');
      });
    }, { size: 14, bold: true });
    const no = T().button(scene, W / 2 + 10, 360, 180, 40, 'Never mind', close, { size: 14 });
    for (const b of [go, no]) ADV.UI.modalBtn(keep, D, b);
  });
};

// ============================================================== GUILD ROSTER + FEED
Panels.roster = function (scene, r) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  scene.promptOnce('firstRoster');
  header(scene, r, 'Guild Roster', null);
  const half = Math.floor(r.w * 0.52);
  let y = r.y + 60;
  const adults = ADV.World.adults(world).filter(c => !c.isPlayer).slice(0, 14);
  for (const c of adults) {
    const tier = ADV.Rel.tierBetween(world, c.id, p.id);
    const status = !c.alive ? 'dead' : c.isUndead ? 'undead' : c.isConscript ? 'conscripted' :
      c.status === 'hero' ? 'HERO' : c.status === 'villain' ? 'VILLAIN' :
      c.hospitalizedQuestsLeft > 0 ? 'hospitalized' : c.partyId ? 'in a party' : 'active';
    const trend = c.reputation >= 10 ? 'famous' : c.reputation <= -10 ? 'infamous' : c.reputation >= 3 ? 'rising' : c.reputation <= -3 ? 'falling' : 'steady';
    const known = world.metIds.includes(c.id);
    const skills = known ? c.actives.slice(0, 3).map(e => {
      const m = ADV.SkillSys.manifest(c, e);
      return m.data.name;
    }).join(', ') : 'unknown skills';
    const label = `${c.name}${c.title ? ' · ' + c.title : ''}`;
    const sub = `rank ${c.rank} · ${trend} · ${status} · ${skills}`;
    keepBtn(scene, T().button(scene, r.x + 16, y, half - 24, 42, label, () => {
      ADV.World.met(world, c.id);
      scene.speak(c, null, {}, () => scene.openPanel('roster'));
    }, { size: 13, sub, subColor: T().relColor(tier), color: c.status === 'hero' ? T().css.gold : c.status === 'villain' ? T().css.blood : T().css.ink }));
    y += 48;
    if (y > r.y + r.h - 60) break;
  }
  // event feed (§6): the emotional engine
  const fx = r.x + half + 4;
  scene.keep(T().text(scene, fx, r.y + 60, 'WHAT HAPPENED WHILE YOU WERE OUT', { size: 12, color: T().css.inkDim }));
  let fy = r.y + 84;
  const feed = world.eventFeed.slice(-18).reverse();
  if (!feed.length) scene.keep(T().text(scene, fx, fy, 'Nothing yet. The world is holding its breath.', { size: 12, italic: true, color: T().css.inkFaint }));
  for (const ev of feed) {
    // Events about people the player has never met read as hearsay, not news.
    const heard = ev.known === false;
    scene.keep(T().text(scene, fx, fy, `q${ev.questClock} · ${ev.text}`,
      { size: 12, wrap: r.w - half - 28, color: heard ? T().css.inkDim : T().css.ink }));
    fy += Math.max(20, Math.ceil(ev.text.length / 46) * 17 + 6);
    if (fy > r.y + r.h - 40) break;
  }
};

// ============================================================== RELATIONSHIPS + VAULT
// ============================================================== VAULT
Panels.vault = function (scene, r) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  header(scene, r, 'Vault', 'What you carry is lost when you die. What is here is not — it passes to your heirs. Couples share one, and either can refuse the other a withdrawal.');
  let y = r.y + 92;
  const v = ADV.Vault.of(world, p);
  scene.keep(T().text(scene, r.x + 24, y, `Carrying: ${p.inventory.gold}g`, { size: 15, color: T().css.gold })); y += 26;
  if (!v) {
    scene.keep(T().text(scene, r.x + 24, y, 'No vault yet. Your first deposit at a departure opens one.', { size: 14, italic: true, color: T().css.inkFaint })); y += 30;
    keepBtn(scene, T().button(scene, r.x + 24, y, 240, 36, 'Open a vault (deposit 0g)', () => { ADV.Vault.ensureOwn(world, p); ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('vault'); }, { size: 13 }));
    return;
  }
  const shared = v.sharedWithId || v.holderId !== p.id;
  const other = world.characters.find(c => c.id === (v.holderId === p.id ? v.sharedWithId : v.holderId));
  scene.keep(T().text(scene, r.x + 24, y, `In the vault: ${v.gold}g${shared && other ? ` · shared with ${other.name}` : ''}${shared ? ` · shared-quest streak ${v.sharedQuestStreak}` : ''}`, { size: 15, color: T().css.gold })); y += 30;
  if (p.inventory.gold > 0) {
    keepBtn(scene, T().button(scene, r.x + 24, y, 240, 34, `Deposit all (${p.inventory.gold}g)`, () => { ADV.Vault.deposit(world, p, p.inventory.gold); p.inventory.gold = 0; ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('vault'); }, { size: 13 }));
    y += 42;
  }
  if (shared && other) {
    const cap = ADV.Vault.withdrawalCap ? ADV.Vault.withdrawalCap(world, v, p) : null;
    if (cap) { scene.keep(T().text(scene, r.x + 24, y, `${other.name} is ${cap.state}: you may draw up to ${Math.round(cap.pct * 100)}% of the vault at once.`, { size: 12, color: T().css.inkDim })); y += 22; }
    keepBtn(scene, T().button(scene, r.x + 24, y, 240, 34, 'Request a withdrawal', () => {
      const amt = Math.min(v.gold, Math.max(20, Math.floor(v.gold / 3)));
      if (amt <= 0) { ADV.Notices.toast(scene, 'The vault is empty.'); return; }
      scene.promptOnce('firstWithdrawal');
      const res = ADV.Vault.requestWithdrawal(world, game.rng, p, amt);
      ADV.Notices.toast(scene, res.approved ? `Approved. ${res.amount}g withdrawn.` : res.queued ? 'Queued for their return.' : `Refused. ${other.name} said no.`);
      ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('vault');
    }, { size: 13 }));
    y += 42;
  } else if (v.holderId === p.id && v.gold > 0) {
    keepBtn(scene, T().button(scene, r.x + 24, y, 240, 34, `Take gold out (up to 200g)`, () => {
      const amt = Math.min(v.gold, 200);
      v.gold -= amt; p.inventory.gold += amt;
      ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('vault');
    }, { size: 13 }));
    y += 42;
  }
  scene.keep(T().text(scene, r.x + 24, y, v.insuranceActive ? 'Insurance: active — the survivor is paid if either of you dies.' : 'Insurance: none (the store sells it).', { size: 12, color: v.insuranceActive ? T().css.green : T().css.inkFaint }));
};

Panels.relationships = function (scene, r) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  header(scene, r, 'Relationships', 'Regard moves with shared quests, money and how you treat people. The vault has its own door now.');
  let y = r.y + 84;
  // relationship list: everyone met, ordered by |score|
  const rows = world.characters.filter(c => c.alive && !c.isPlayer && !c.isMonster && !c.registryId)
    .map(c => ({ c, out: ADV.Rel.score(world, p.id, c.id), inn: ADV.Rel.score(world, c.id, p.id) }))
    .sort((a, b) => Math.abs(b.inn) + Math.abs(b.out) - Math.abs(a.inn) - Math.abs(a.out));
  for (const row of rows.slice(0, 9)) {
    const c = row.c;
    const tier = ADV.Rel.tierBetween(world, c.id, p.id);
    const isPartner = p.partnerId === c.id;
    const shared = ADV.Courtship.shared(world, p.id, c.id);
    const rank = c.sex === 'm' ? ADV.Courtship.wealthRank(world, c) : 0;
    const sub = `${isPartner ? 'your partner' : tier} · their regard ${row.inn} · yours ${row.out} · ${shared} quest${shared === 1 ? '' : 's'} together${rank ? ' · wealth #' + rank : ''}`;
    keepBtn(scene, T().button(scene, r.x + 24, y, r.w - 320, 44, c.name + (c.title ? ' · ' + c.title : ''), () => {
      Panels.personDialog(scene, c);
    }, { size: 14, sub, subColor: T().relColor(isPartner ? 'romantic' : tier) }));
    y += 50;
    if (y > r.y + r.h - 60) break;
  }
  if (!rows.length) scene.keep(T().text(scene, r.x + 24, y, 'You know nobody yet. Quest beside people, and they will remember it.', { size: 14, italic: true, color: T().css.inkFaint }));
};

Panels.personDialog = function (scene, c) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  ADV.World.met(world, c.id);
  // First live prospect of romance: explain family/marriage/nepotism, one
  // sentence each (jilting stays unexplained until it happens).
  const prospect = p.partnerId !== c.id && ADV.Rel.canRomance(world, p.id, c.id).ok;
  if (prospect) {
    const lines = ['familyRomance', 'familyMarriage', 'familyNepotism']
      .map(id => ADV.Game.prompt(game, id)).filter(Boolean);
    if (lines.length) {
      ADV.Notices.custom(scene, (keep, D, close) => {
        const W = T().W;
        keep(T().text(scene, W / 2, 240, 'On family', { size: 20, display: true, ox: 0.5, color: T().css.gold }).setDepth(D));
        keep(T().text(scene, W / 2, 300, lines.join('\n\n'), { size: 14, ox: 0.5, oy: 0.5, wrap: 560, align: 'center' }).setDepth(D));
        ADV.UI.modalBtn(keep, D, T().button(scene, W / 2 - 90, 400, 180, 38, 'Understood', () => { close(); Panels.personDialog(scene, c); }, { size: 14 }));
      });
      return;
    }
  }
  scene.speak(c, null, {}, () => {
    const isPartner = p.partnerId === c.id;
    const canProp = !isPartner && ADV.Rel.canRomance(world, p.id, c.id);
    const iHate = ADV.Rel.hates(world, p.id, c.id);
    const buttons = [];
    if (canProp && canProp.ok) buttons.push({ label: 'Propose', value: 'propose' });
    if (isPartner) buttons.push({ label: 'Leave them (jilt)', value: 'jilt' });
    if (!iHate && !isPartner) buttons.push({ label: 'Declare hatred', value: 'hate' });
    if (iHate) buttons.push({ label: 'Attempt assassination', value: 'kill' });
    buttons.push({ label: 'Walk away', value: null });
    ADV.Notices.pickOne(scene, c.name, `Rank ${c.rank} · ${c.sex === 'f' ? 'she' : 'he'} thinks of you as ${ADV.Rel.tierBetween(world, c.id, p.id)}.`, buttons, (val) => {
      if (val === 'propose') {
        scene.promptOnce('firstRomanceOption');
        if (c.hiroNpc && !ADV.Hiro.acceptsProposal(p)) {
          scene.speak(c, 'general', {}, () => {
            ADV.Notices.confirm(scene, 'Not yet', `${c.name} only takes a proposal from a woman with a reputation of ${ADV.Hiro.RULES.minRep} or better. Yours is ${p.reputation}. Earn it on the road.`, 'Understood', () => {}, T().css.purple);
          });
          return;
        }
        const accept = ADV.Rel.score(world, c.id, p.id) >= C().REL.FRIENDLY_MIN;
        if (accept) {
          const lines = ADV.Rel.commit(world, p.id, c.id);
          lines.forEach(l => ADV.World.feed(world, l.text, l.actorIds));
          scene.speak(c, 'romantic', {}, () => {
            ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('rel');
          });
        } else {
          ADV.Courtship.decline(world, c, p);   // refusal: Neutral for three quests, then the rules again
          scene.speak(c, 'general', {}, () => {
            ADV.Notices.toast(scene, 'Refused. Three quests before they will hear it again.');
            ADV.Save.saveGame(game); scene.openPanel('rel');
          });
        }
      } else if (val === 'jilt') {
        scene.promptOnce('firstJilting');
        ADV.Notices.confirm(scene, 'Leave ' + c.name + '?',
          'There are no clean breakups. They will hate you for the rest of one of your lives — check what they can afford before you do this.',
          'Leave them', () => {
            const lines = ADV.Rel.jilt(world, p, c);
            lines.forEach(l => ADV.World.feed(world, l.text, l.actorIds));
            scene.speak(c, 'hatred', {}, () => { ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('rel'); });
          }, T().css.blood);
      } else if (val === 'hate') {
        ADV.Rel.move(world, p.id, c.id, -100, 'murder', { set: true, decays: false });
        ADV.Notices.toast(scene, 'So be it. Assassination is now open to you — and to them.');
        ADV.Save.saveGame(game); scene.openPanel('rel');
      } else if (val === 'kill') {
        ADV.Notices.confirm(scene, 'Kill ' + c.name + '?',
          'One battle. The loser dies for good, and the winner takes what they carried. This consumes world time like a quest.',
          'Do it', () => {
            const res = ADV.Game.beginAssassination(game, c.id);
            if (!res.ok) { ADV.Notices.toast(scene, res.error); return; }
            scene.promptOnce('firstAssassination');
            scene.scene.start('Combat', { mode: 'assassination' });
          }, T().css.blood);
      }
    });
  });
};

// ============================================================== NOTICES (modals)
const Notices = ADV.Notices = {};

// Notices land at eye level, large, and linger (request): stacked if several
// arrive together so none hides another.
Notices.toast = function (scene, text) {
  const W = T().W, H = T().H;
  scene.__toasts = (scene.__toasts || []).filter(x => x.active);
  const y = Math.round(H * 0.42) + scene.__toasts.length * 64;
  const t = T().text(scene, W / 2, y, text, { size: 20, ox: 0.5, oy: 0.5, display: true, color: T().css.gold, wrap: W - 320, align: 'center' }).setDepth(950);
  const bg = scene.add.rectangle(W / 2, y, t.width + 56, t.height + 28, 0x14110d, 0.96).setDepth(949).setStrokeStyle(2, T().c.gold, 0.9);
  const entry = { active: true };
  scene.__toasts.push(entry);
  scene.tweens.add({ targets: [t, bg], alpha: 0, delay: 4200, duration: 700, onComplete: () => { entry.active = false; t.destroy(); bg.destroy(); } });
};

Notices.custom = function (scene, build) {
  const W = T().W, H = T().H;
  const objs = [];
  const keep = o => { objs.push(o); return o; };
  const D = 930;
  keep(scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75).setDepth(D - 2).setInteractive());
  keep(T().panel(scene, W / 2 - 320, 220, 640, 240)).setDepth(D - 1);
  const close = () => objs.forEach(o => { try { o.destroy(); } catch (e) {} });
  build(keep, D, close);
  return close;
};

Notices.confirm = function (scene, title, body, yesLabel, onYes, color) {
  Notices.custom(scene, (keep, D, close) => {
    const W = T().W;
    keep(T().text(scene, W / 2, 244, title, { size: 20, display: true, ox: 0.5, color: color || T().css.gold }).setDepth(D));
    keep(T().text(scene, W / 2, 280, body, { size: 14, ox: 0.5, wrap: 560, align: 'center', color: T().css.ink }).setDepth(D));
    const yb = T().button(scene, W / 2 - 200, 396, 190, 40, yesLabel, () => { close(); if (onYes) onYes(); }, { size: 14, bold: true, color: color || T().css.ink });
    const nb = T().button(scene, W / 2 + 10, 396, 190, 40, 'Not now', close, { size: 14 });
    for (const b of [yb, nb]) ADV.UI.modalBtn(keep, D, b);
  });
};

Notices.pickOne = function (scene, title, body, options, onPick) {
  Notices.custom(scene, (keep, D, close) => {
    const W = T().W;
    keep(T().text(scene, W / 2, 240, title, { size: 20, display: true, ox: 0.5, color: T().css.gold }).setDepth(D));
    keep(T().text(scene, W / 2, 272, body, { size: 13, ox: 0.5, wrap: 560, align: 'center', color: T().css.inkDim }).setDepth(D));
    let y = 306;
    for (const opt of options) {
      ADV.UI.modalBtn(keep, D, T().button(scene, W / 2 - 180, y, 360, 34, opt.label, () => { close(); if (onPick) onPick(opt.value); }, { size: 13 }));
      y += 40;
    }
  });
};

// ---- arrival notices --------------------------------------------------------
// Only mothers name children (request): the female player names hers at
// birth; a male player's child is named by its NPC mother.
Notices.nameChild = function (scene, n, next) {
  const game = scene.g();
  const child = n.child;
  if (game.pendingChildNaming !== child) return next();
  game.pendingChildNaming = null;
  let name = '';
  Notices.custom(scene, (keep, D, close) => {
    const W = T().W;
    keep(T().text(scene, W / 2, 244, child.sex === 'f' ? 'A daughter is born' : 'A son is born', { size: 22, display: true, ox: 0.5, color: T().css.gold }).setDepth(D));
    keep(T().text(scene, W / 2, 280, (child.sex === 'f' ? 'She' : 'He') + ' is yours to name — only a mother has that right. Type it.', { size: 13, ox: 0.5, color: T().css.inkDim }).setDepth(D));
    keep(scene.add.rectangle(W / 2, 322, 280, 36, 0x211d18).setStrokeStyle(1, T().c.gold).setDepth(D));
    const txt = keep(T().text(scene, W / 2, 322, '', { size: 18, ox: 0.5, oy: 0.5 }).setDepth(D + 1));
    const onKey = (ev) => {
      if (ev.key === 'Backspace') name = name.slice(0, -1);
      else if (/^[a-zA-Z '\-]$/.test(ev.key) && name.length < 14) name += ev.key;
      txt.setText(name);
    };
    scene.input.keyboard.on('keydown', onKey);
    const done = () => {
      scene.input.keyboard.off('keydown', onKey);
      child.name = name.trim() || null;   // empty = let fate (the seed roll) pick
      ADV.Save.saveGame(game);
      close(); next();
    };
    const b = T().button(scene, W / 2 - 110, 380, 220, 42, 'So be it', done, { size: 15, display: true, bold: true });
    ADV.UI.modalBtn(keep, D, b);
  });
};

Notices.jilt = function (scene, n, next) {
  const game = scene.g();
  const world = game.world;
  const j = world.pendingPlayerJilt;
  world.pendingPlayerJilt = null;
  const who = world.characters.find(c => c.id === j.byId);
  if (!who) return next();
  scene.promptOnce('firstJilted');
  Notices.pickOne(scene, who.name + ' left you.',
    'You can hate them for this, or you can let it go — only you get that choice.',
    [{ label: 'Hate them', value: 'hate' }, { label: 'Let it go', value: 'no' }],
    (v) => {
      if (v === 'hate') ADV.Rel.move(world, world.playerId, who.id, -100, 'jilt', { set: true, decays: false });
      ADV.Save.saveGame(game);
      next();
    });
};

// Someone asks the player (courtship rules): accept, or decline and they cool
// to Neutral for 3 quests.
Notices.proposal = function (scene, n, next) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  const pr = n.proposal;
  const c = ADV.World.byId(world, pr.fromId);
  if (!c || !c.alive || c.partnerId || p.partnerId || !(world.pendingProposals || []).includes(pr)) {
    world.pendingProposals = (world.pendingProposals || []).filter(x => x !== pr);
    return next();
  }
  scene.promptOnce('firstProposalReceived');
  scene.speak(c, 'romantic', {}, () => {
    const rich = c.sex === 'f' ? ADV.Courtship.wealthRank(world, p) : 0;
    Notices.pickOne(scene, `${c.name} asks you`, c.sex === 'f'
      ? `You are one of the wealthiest men in town (rank ${rich}) and she knows it. Say yes and you are together; say no and she cools for three quests.`
      : `You have ridden together ${ADV.Courtship.shared(world, c.id, p.id)} times and he has made up his mind. Say yes and you are together; say no and he cools for three quests.`,
      [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], (v) => {
        world.pendingProposals = (world.pendingProposals || []).filter(x => x !== pr);
        if (v === 'yes') {
          const lines = ADV.Rel.commit(world, p.id, c.id);
          lines.forEach(l => ADV.World.feed(world, l.text, l.actorIds));
          scene.speak(c, 'romantic', {}, () => { ADV.Save.saveGame(game); scene.refreshAll(); next(); });
        } else {
          ADV.Courtship.decline(world, p, c);
          scene.speak(c, 'general', {}, () => { ADV.Save.saveGame(game); next(); });
        }
      });
  });
};

// A hire wants more pay (request 15): meet it or lose them.
Notices.raise = function (scene, n, next) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  const rz = n.raise;
  world.pendingRaises = (world.pendingRaises || []).filter(x => x !== rz);
  const m = ADV.World.byId(world, rz.memberId);
  const party = ADV.Party.of(world, p);
  if (!m || !m.alive || !party || party.leaderId !== p.id || !party.memberIds.includes(m.id)) return next();
  scene.speak(m, null, {}, () => {
    Notices.pickOne(scene, `${m.name} wants ${rz.ask}g a quest`, `Up from ${party.wages[m.id] || 0}g. Refuse and ${m.sex === 'f' ? 'she' : 'he'} walks.`,
      [{ label: `Pay ${rz.ask}g`, value: 'pay' }, { label: 'Let them go', value: 'no' }], (v) => {
        if (v === 'pay') { party.wages[m.id] = rz.ask; m.wage = rz.ask; ADV.Notices.toast(scene, 'Agreed.'); }
        else { ADV.Party.removeMember(world, party, m.id); ADV.Rel.move(world, m.id, p.id, -10, 'quest'); ADV.World.feed(world, `${m.name} quit your party over pay.`, [m.id]); }
        ADV.Save.saveGame(game); scene.refreshAll(); next();
      });
  });
};

Notices.rescue = function (scene, n, next) {
  const game = scene.g();
  const world = game.world;
  const rsc = n.rescue;
  if (!world.pendingRescues.includes(rsc)) return next();
  const target = world.characters.find(c => c.id === rsc.targetId);
  const attacker = rsc.attackerId ? world.characters.find(c => c.id === rsc.attackerId) : null;
  if (!target || !target.alive) { world.pendingRescues = world.pendingRescues.filter(x => x !== rsc); return next(); }
  scene.promptOnce('firstDanger');
  scene.speak(target, null, {}, () => {
    Notices.pickOne(scene, target.name + ' is in danger',
      attacker ? `${attacker.name} is coming for ${target.sex === 'f' ? 'her' : 'him'}. Helping makes their enemy yours, and the offer expires.` :
        `A contract went wrong. ${target.sex === 'f' ? 'She' : 'He'} needs someone, now.`,
      [{ label: 'Go to them', value: 'go' }, { label: 'Look away', value: 'no' }],
      (v) => {
        if (v === 'go') {
          scene.promptOnce('firstRescue');
          const res = ADV.Game.acceptRescue(game, rsc);
          if (res.ok && res.st) { scene.scene.start('Combat', { mode: 'rescue' }); return; }
          ADV.Notices.toast(scene, res.abstract ? 'You brought them home.' : (res.error || ''));
          scene.refreshAll();
          next();
        } else {
          ADV.Game.refuseRescue(game, rsc);
          next();
        }
      });
  });
};

Notices.divine = function (scene, n, next) {
  const game = scene.g();
  const world = game.world;
  const o = n.offer;
  if (!(world.divineOffers || []).includes(o)) return next();
  const target = world.characters.find(c => c.id === o.targetId);
  if (!target || !target.alive) { world.divineOffers = world.divineOffers.filter(x => x !== o); return next(); }
  scene.promptOnce('firstDivineCalled');
  const isEx = (scene.player().exIds || []).includes(target.id) || scene.player().partnerId === target.id;
  if (isEx) scene.promptOnce('firstDivineEx');
  Notices.pickOne(scene, 'The world names ' + target.name,
    `A divine quest. You would carry True Rest and the Hero's strength — and take no other work until ${target.name} is dead. Refusal is allowed. Failure is someone else's chance.`,
    [{ label: 'Take up the call', value: 'yes' }, { label: 'Refuse', value: 'no' }],
    (v) => {
      if (v === 'yes') {
        ADV.Divine.acceptDivineQuest(world, scene.player(), target, o.powerMult, ADV.World.feeder(world));
        ADV.Save.saveGame(game);
      } else {
        world.divineOffers = world.divineOffers.filter(x => x !== o);
      }
      next();
    });
};

Notices.heroInvite = function (scene, n, next) {
  const game = scene.g();
  const world = game.world;
  const inv = n.invite;
  if (!(world.pendingHeroInvites || []).includes(inv)) return next();
  const hero = world.characters.find(c => c.id === inv.heroId);
  const target = world.characters.find(c => c.id === inv.targetId);
  if (!hero || !hero.alive || !target || !target.alive) {
    world.pendingHeroInvites = world.pendingHeroInvites.filter(x => x !== inv);
    return next();
  }
  scene.promptOnce('firstDivineInvite');
  scene.speak(hero, null, { themName: target.name }, () => {
    Notices.pickOne(scene, hero.name + ' asks for your blade',
      `The divine quest names ${target.name}. Accepting counts as a shared quest — it is the only work a hero can offer.`,
      [{ label: 'Ride with them', value: 'yes' }, { label: 'Refuse', value: 'no' }],
      (v) => {
        world.pendingHeroInvites = world.pendingHeroInvites.filter(x => x !== inv);
        hero.divineInvitesWindow.push(v === 'yes');
        if (v === 'yes') {
          ADV.Rel.move(world, hero.id, world.playerId, C().REL_MOVE.sharedQuestWin, 'quest');
          const hv = ADV.Vault.of(world, hero) || ADV.Vault.of(world, scene.player());
          if (hv) { hv.sharedQuestStreak = Math.max(hv.sharedQuestStreak, 1); hv.questsSinceShared = 0; }
          // resolve abstractly alongside the hero (the target is an NPC)
          ADV.World.tick(world, game.rng, { playerQuested: true });
          const alive = world.characters.find(c => c.id === target.id && c.alive);
          ADV.Notices.toast(scene, alive ? 'You rode together. The hunt continues.' : 'It is done. Divine quests pay nothing but standing.');
          ADV.Save.saveGame(game);
        } else {
          ADV.World.checkHeroInviteWindow(world, hero, ADV.World.feeder(world));
          ADV.Save.saveGame(game);
        }
        next();
      });
  });
};

Notices.withdrawal = function (scene, n, next) {
  const game = scene.g();
  const world = game.world;
  const v = n.vault;
  const req = v.pendingWithdrawals[0];
  if (!req) return next();
  const who = world.characters.find(c => c.id === req.requesterId);
  if (!who || !who.alive) { v.pendingWithdrawals.shift(); return next(); }
  scene.speak(who, null, {}, () => {
    Notices.pickOne(scene, who.name + ' asks for ' + req.amount + 'g',
      'From the shared vault. Refusal is a real defense — and a slow poison.',
      [{ label: 'Approve it', value: true }, { label: 'Refuse', value: false }],
      (approve) => {
        ADV.Vault.resolvePending(world, v, 0, approve);
        ADV.Save.saveGame(game);
        next();
      });
  });
};

})();
