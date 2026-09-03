// Town content panels, part 2: parties, roster + event feed, relationships +
// vault. Plus the Notices modal library.
(function () {
'use strict';
const T = () => ADV.T;
const C = () => ADV.DATA.CONST;

const Panels = ADV.Panels = ADV.Panels || {};

const header = (scene, r, title, sub) => ADV.UI.header(scene, r, title, sub);

// ============================================================== APPLY FOR PARTY
Panels.applyParty = function (scene, r) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  const tut = ADV.Tutor && ADV.Tutor.step(game) === 'party';
  header(scene, r, 'Apply for Party', 'Reputation and what you fill on a sheet decide it. A party missing a healer wants healing more than fame.');
  const myParty = ADV.Party.of(world, p);
  const isLeader = !!(myParty && myParty.leaderId === p.id);
  const canAsk = !isLeader && !tut;
  let listTop = r.y + 88;
  if (canAsk) {
    scene.askWage = scene.askWage || ADV.Party.hirelingWageFor(p);
    scene.keep(T().text(scene, r.x + 24, r.y + 108, `Your asking wage: ${scene.askWage}g a quest`, { size: 14, color: T().css.gold }));
    ADV.UI.keepBtn(scene, T().button(scene, r.x + 320, r.y + 100, 40, 32, '−', () => { scene.askWage = Math.max(C().GOLD.wageAcceptMin, scene.askWage - 5); scene.openPanel('apply'); }, { size: 14 }));
    ADV.UI.keepBtn(scene, T().button(scene, r.x + 366, r.y + 100, 40, 32, '+', () => { scene.askWage = Math.min(C().GOLD.wageAcceptMax, scene.askWage + 5); scene.openPanel('apply'); }, { size: 14 }));
    scene.keep(T().text(scene, r.x + 24, r.y + 140, myParty
      ? 'Leave this company to join another at this rate.'
      : 'Higher asks are refused more often, and never above what a leader can pay.', { size: 12, italic: true, color: T().css.inkFaint, wrap: r.w - 48 }));
    listTop = r.y + 168;
  }
  const scroll = ADV.UI.scrollArea(scene, { x: r.x + 8, y: listTop, w: r.w - 16, h: r.y + r.h - listTop - 8 });
  let y = listTop + 4;
  if (myParty) {
    const leader = ADV.Party.leader(world, myParty);
    scroll.add(T().text(scene, r.x + 24, y, isLeader ? 'You lead your own party.' : `You ride with ${leader ? leader.name : 'a party'} for ${p.wage || C().GOLD.hirelingWage}g a quest.`, { size: 15 }));
    y += 30;
    if (!isLeader) {
      scroll.addBtn(T().button(scene, r.x + 24, y, 200, 38, 'Quit the party', () => {
        ADV.Party.removeMember(world, myParty, p.id);
        ADV.Save.saveGame(game);
        scene.refreshAll(); scene.openPanel('apply');
      }, { size: 14 }));
      y += 50;
    } else {
      scroll.addBtn(T().button(scene, r.x + 24, y, 280, 38, `Disband — ${C().GOLD.partyStartupCapital}g back`, () => Panels.foldParty(scene), { size: 14 }));
      y += 50;
    }
  }
  const parties = world.parties.filter(x => x.leaderId !== p.id && !x.memberIds.includes(p.id));
  if (!parties.length) scroll.add(T().text(scene, r.x + 24, y, 'No party is hiring today.', { size: 14, italic: true, color: T().css.inkFaint }));
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
    scroll.addBtn(T().button(scene, r.x + 24, y, r.w - 240, 46, `${leader.name}'s party`, () => {
      if (isLeader) { ADV.Notices.toast(scene, 'You already have a party.'); return; }
      if (ADV.Party.roster(world, party).length >= C().PARTY_MAX) { ADV.Notices.toast(scene, 'They are full.'); return; }
      const askNow = () => {
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
            const cur = ADV.Party.of(world, p);
            if (cur && cur.leaderId !== p.id) ADV.Party.removeMember(world, cur, p.id);
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
      };
      if (myParty && !isLeader && !tut) {
        const curLead = ADV.Party.leader(world, myParty);
        ADV.Notices.confirm(scene, 'Leave ' + (curLead ? curLead.name : 'this party') + '?',
          `Walk away and ask ${leader.name} at ${ask}g a quest.`,
          'Leave and ask', askNow);
        return;
      }
      askNow();
    }, { size: 15, display: true, sub, subColor: finalOdds > 0.5 ? T().css.green : T().css.inkDim }));
    y += 56;
  }
  scroll.extend(y);
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
  const listTop = r.y + 92;
  const scroll = ADV.UI.scrollArea(scene, { x: r.x + 8, y: listTop, w: r.w - 16, h: r.y + r.h - listTop - 8 });
  let y = listTop;
  if (!isLeader) {
    if (party) { scroll.add(T().text(scene, r.x + 24, y, 'You already serve in someone else\'s party.', { size: 14 })); return; }
    scroll.addBtn(T().button(scene, r.x + 24, y, 280, 44, `Found a party — ${C().GOLD.partyStartupCapital}g`, () => {
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
  const bound = ADV.Party.followers(world, party).length;
  const extra = C().FORBIDDEN_EXTRA_SLOTS || 3;
  scroll.add(T().text(scene, r.x + 24, y, `Payroll: ${ADV.Party.payroll(world, party)}g per quest · ${members.length + 1}/${C().PARTY_MAX}` + (bound ? ` + ${bound} bound (up to ${extra} extra)` : ` · ${extra} extra seats for the bound`), { size: 14, color: T().css.gold }));
  y += 28;
  scroll.addBtn(T().button(scene, r.x + 24, y, 300, 38, `Disband — ${C().GOLD.partyStartupCapital}g back`, () => Panels.foldParty(scene), { size: 14 }));
  y += 48;
  for (const m of members) {
    const followers = (m.conscriptIds || []).length + (m.undeadIds || []).length;
    const relTier = ADV.Rel.tierBetween(world, m.id, p.id);
    const sub = `wage ${party.wages[m.id]}g · ${relTier}${followers ? ' · commands ' + followers : ''}`;
    scroll.addBtn(T().button(scene, r.x + 24, y, 320, 44, m.name, () => {
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
  scroll.add(T().text(scene, r.x + 24, y, 'FOR HIRE', { size: 12, color: T().css.inkDim })); y += 24;
  const cands = world.characters.filter(c => c.alive && !c.isPlayer && !c.isMonster && !c.partyId &&
    !c.registryId && c.status === 'normal' && !c.isConscript && !c.isUndead && c.hospitalizedQuestsLeft <= 0);
  for (const cand of cands) {
    const blocked = ADV.Party.hatredConflict(world, party, cand.id);
    const skills = cand.actives.slice(0, 3).map(e => ADV.DATA.SKILLS[e.skillId].name).join(', ');
    const knowsForbidden = ['conscript', 'necromancy'].some(id => ADV.SkillSys.knows(cand, id));
    const sub = `${skills}${knowsForbidden ? ' · knows forbidden arts' : ''}${blocked ? ' · WILL NOT SERVE' : ''}`;
    scroll.addBtn(T().button(scene, r.x + 24, y, r.w - 240, 44, `${cand.name} (rank ${cand.rank})`, () => {
      if (blocked) { scene.promptOnce('firstBlockedHire'); ADV.Notices.toast(scene, 'Bad blood. No wage fixes it.'); return; }
      Panels.wageDialog(scene, party, cand);
    }, { size: 14, sub, subColor: blocked ? T().css.blood : knowsForbidden ? T().css.purple : T().css.inkDim, disabled: members.length + 1 >= C().PARTY_MAX }));
    y += 52;
  }
  scroll.extend(y);
};

Panels.foldParty = function (scene) {
  const game = scene.g();
  const p = scene.player();
  const cap = C().GOLD.partyStartupCapital;
  ADV.Notices.confirm(scene, 'Disband the party?',
    'Everyone you hired walks free. They keep what they were paid. The ' + cap + 'g founding purse comes back so you can hire on with someone else.',
    'Disband — ' + cap + 'g back', () => {
      const r = ADV.Party.foldByLeader(game.world, p);
      if (!r.ok) { ADV.Notices.toast(scene, r.error); return; }
      ADV.Notices.toast(scene, cap + 'g returned. You are free to apply.');
      ADV.Save.saveGame(game);
      scene.buildMenu();
      scene.refreshAll();
      scene.openPanel('apply');
    });
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
  const left = ADV.UI.scrollArea(scene, { x: r.x + 8, y: r.y + 56, w: half - 20, h: r.h - 68 });
  const right = ADV.UI.scrollArea(scene, { x: r.x + half, y: r.y + 80, w: r.w - half - 16, h: r.h - 92 });
  let y = r.y + 60;
  const adults = ADV.World.adults(world).filter(c => !c.isPlayer)
    .sort((a, b) => (!!b.hiroNpc) - (!!a.hiroNpc));
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
    const spouses = ADV.Rel.partnerIds(c).map(id => ADV.World.byId(world, id)).filter(Boolean);
    const kids = (c.dependents || []).length;
    const family = spouses.length
      ? ` · with ${spouses.map(s => s.name).join(', ')}${kids ? ` · ${kids} ${kids === 1 ? 'child' : 'children'}` : ''}`
      : '';
    const label = `${c.name}${c.title ? ' · ' + c.title : ''}`;
    const sub = `rank ${c.rank} · ${trend} · ${status}${family} · ${skills}`;
    left.addBtn(T().button(scene, r.x + 16, y, half - 24, 42, label, () => {
      ADV.World.met(world, c.id);
      scene.speak(c, null, {}, () => scene.openPanel('roster'));
    }, { size: 13, sub, subColor: T().relColor(tier), color: c.status === 'hero' ? T().css.gold : c.status === 'villain' ? T().css.blood : T().css.ink }));
    y += 48;
  }
  left.extend(y);
  // event feed (§6): the emotional engine
  const fx = r.x + half + 4;
  scene.keep(T().text(scene, fx, r.y + 60, 'WHAT HAPPENED WHILE YOU WERE OUT', { size: 12, color: T().css.inkDim }));
  let fy = r.y + 84;
  const feed = world.eventFeed.slice(-40).reverse();
  if (!feed.length) right.add(T().text(scene, fx, fy, 'Nothing yet. The world is holding its breath.', { size: 12, italic: true, color: T().css.inkFaint }));
  for (const ev of feed) {
    right.add(T().text(scene, fx, fy, `q${ev.questClock} · ${ev.text}`, { size: 12, wrap: r.w - half - 28, color: T().css.ink }));
    fy += Math.max(20, Math.ceil(ev.text.length / 46) * 17 + 6);
  }
  right.extend(fy);
};

// ============================================================== GRAVEYARD
Panels.graveyard = function (scene, r) {
  const world = scene.g().world;
  header(scene, r, 'Graveyard', 'Those who died on the road, and those who did not come home. The guild roster is for the living.');
  const graves = ADV.Death.graves(world);
  const listTop = r.y + 84;
  const scroll = ADV.UI.scrollArea(scene, { x: r.x + 8, y: listTop, w: r.w - 16, h: r.y + r.h - listTop - 8 });
  let y = listTop;
  if (!graves.length) {
    scroll.add(T().text(scene, r.x + 24, y, 'No one lies here yet.', { size: 14, italic: true, color: T().css.inkFaint }));
    scroll.extend(y + 30);
    return;
  }
  for (const c of graves) {
    const ob = c.obituary || ADV.Death.composeObituary(world, c, null, 'quest');
    const label = `${ob.name}${ob.title ? ' · ' + ob.title : ''}`;
    const skills = (ob.skills && ob.skills.length) ? ob.skills.join(', ') : 'no recorded skills';
    const family = [];
    if (ob.spouses && ob.spouses.length) family.push('spouse: ' + ob.spouses.join(', '));
    if (ob.children && ob.children.length) family.push('children: ' + ob.children.join(', '));
    const sub = `rank ${ob.rank} · died q${ob.deadAtQuest != null ? ob.deadAtQuest : (c.deadAtQuest || '?')} · ${skills}`;
    const img = scene.add.image(r.x + 52, y + 38, ADV.Portraits.key(scene, c)).setDisplaySize(56, 70);
    scroll.add(img);
    scroll.add(T().text(scene, r.x + 92, y, label, { size: 15, color: T().css.gold }));
    y += 22;
    scroll.add(T().text(scene, r.x + 92, y, sub, { size: 12, color: T().css.inkDim, wrap: r.w - 120 }));
    y += 20;
    if (family.length) {
      scroll.add(T().text(scene, r.x + 92, y, family.join(' · '), { size: 12, color: T().css.ink, wrap: r.w - 120 }));
      y += 18;
    }
    scroll.add(T().text(scene, r.x + 92, y, ob.text, { size: 13, italic: true, wrap: r.w - 120, color: T().css.ink }));
    y += Math.max(42, Math.ceil((ob.text || '').length / 48) * 17 + 18);
  }
  scroll.extend(y);
};

// ============================================================== RELATIONSHIPS + VAULT
// ============================================================== VAULT
Panels.vault = function (scene, r) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  header(scene, r, 'Vault', 'What you carry is lost when you die. What is here is not — it passes to your heirs. Couples share one, and either can refuse the other a withdrawal.');
  const listTop = r.y + 92;
  const scroll = ADV.UI.scrollArea(scene, { x: r.x + 8, y: listTop, w: r.w - 16, h: r.y + r.h - listTop - 8 });
  let y = listTop;
  const v = ADV.Vault.of(world, p);
  scroll.add(T().text(scene, r.x + 24, y, `Carrying: ${p.inventory.gold}g`, { size: 15, color: T().css.gold })); y += 26;
  if (!v) {
    scroll.add(T().text(scene, r.x + 24, y, 'No vault yet. Your first deposit at a departure opens one.', { size: 14, italic: true, color: T().css.inkFaint })); y += 30;
    scroll.addBtn(T().button(scene, r.x + 24, y, 240, 36, 'Open a vault (deposit 0g)', () => { ADV.Vault.ensureOwn(world, p); ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('vault'); }, { size: 13 }));
    return;
  }
  const shared = v.sharedWithId || v.holderId !== p.id;
  const other = world.characters.find(c => c.id === (v.holderId === p.id ? v.sharedWithId : v.holderId));
  scroll.add(T().text(scene, r.x + 24, y, `In the vault: ${v.gold}g${shared && other ? ` · shared with ${other.name}` : ''}${shared ? ` · shared-quest streak ${v.sharedQuestStreak}` : ''}`, { size: 15, color: T().css.gold })); y += 30;
  if (p.inventory.gold > 0) {
    scroll.addBtn(T().button(scene, r.x + 24, y, 240, 34, `Deposit all (${p.inventory.gold}g)`, () => { ADV.Vault.deposit(world, p, p.inventory.gold); p.inventory.gold = 0; ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('vault'); }, { size: 13 }));
    y += 42;
  }
  if (shared && other) {
    const cap = ADV.Vault.withdrawalCap ? ADV.Vault.withdrawalCap(world, v, p) : null;
    if (cap) { scroll.add(T().text(scene, r.x + 24, y, `${other.name} is ${cap.state}: you may draw up to ${Math.round(cap.pct * 100)}% of the vault at once.`, { size: 12, color: T().css.inkDim })); y += 22; }
    scroll.addBtn(T().button(scene, r.x + 24, y, 240, 34, 'Request a withdrawal', () => {
      const amt = Math.min(v.gold, Math.max(20, Math.floor(v.gold / 3)));
      if (amt <= 0) { ADV.Notices.toast(scene, 'The vault is empty.'); return; }
      scene.promptOnce('firstWithdrawal');
      const res = ADV.Vault.requestWithdrawal(world, game.rng, p, amt);
      ADV.Notices.toast(scene, res.approved ? `Approved. ${res.amount}g withdrawn.` : res.queued ? 'Queued for their return.' : `Refused. ${other.name} said no.`);
      ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('vault');
    }, { size: 13 }));
    y += 42;
  } else if (v.holderId === p.id && v.gold > 0) {
    scroll.addBtn(T().button(scene, r.x + 24, y, 240, 34, `Take gold out (up to 200g)`, () => {
      const amt = Math.min(v.gold, 200);
      v.gold -= amt; p.inventory.gold += amt;
      ADV.Save.saveGame(game); scene.refreshAll(); scene.openPanel('vault');
    }, { size: 13 }));
    y += 42;
  }
  scroll.add(T().text(scene, r.x + 24, y, v.insuranceActive ? 'Insurance: active — the survivor is paid if either of you dies.' : 'Insurance: none (the store sells it).', { size: 12, color: v.insuranceActive ? T().css.green : T().css.inkFaint }));
  scroll.extend(y + 24);
};

Panels.relationships = function (scene, r) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  header(scene, r, 'Relationships', 'Regard moves with shared quests, money and how you treat people. The vault has its own door now.');
  const listTop = r.y + 84;
  const scroll = ADV.UI.scrollArea(scene, { x: r.x + 8, y: listTop, w: r.w - 16, h: r.y + r.h - listTop - 8 });
  let y = listTop;
  // relationship list: everyone met, ordered by |score|
  const rows = world.characters.filter(c => c.alive && !c.isPlayer && !c.isMonster && !c.registryId)
    .map(c => ({ c, out: ADV.Rel.score(world, p.id, c.id), inn: ADV.Rel.score(world, c.id, p.id) }))
    .sort((a, b) => Math.abs(b.inn) + Math.abs(b.out) - Math.abs(a.inn) - Math.abs(a.out));
  for (const row of rows) {
    const c = row.c;
    const tier = ADV.Rel.tierBetween(world, c.id, p.id);
    const isPartner = p.partnerId === c.id;
    const shared = ADV.Courtship.shared(world, p.id, c.id);
    const rank = c.sex === 'm' ? ADV.Courtship.wealthRank(world, c) : 0;
    const gender = c.sex === 'f' ? 'woman' : 'man';
    const sub = `${gender} · ${isPartner ? 'your partner' : tier} · their regard ${row.inn} · yours ${row.out} · ${shared} quest${shared === 1 ? '' : 's'} together${rank ? ' · wealth #' + rank : ''}`;
    scroll.addBtn(T().button(scene, r.x + 24, y, r.w - 320, 44, c.name + (c.title ? ' · ' + c.title : ''), () => {
      Panels.personDialog(scene, c);
    }, { size: 14, sub, subColor: T().relColor(isPartner ? 'romantic' : tier) }));
    y += 50;
  }
  if (!rows.length) scroll.add(T().text(scene, r.x + 24, y, 'You know nobody yet. Quest beside people, and they will remember it.', { size: 14, italic: true, color: T().css.inkFaint }));
  scroll.extend(y);
};

Panels.personDialog = function (scene, c) {
  const game = scene.g();
  const world = game.world;
  const p = scene.player();
  ADV.World.met(world, c.id);
  // First live prospect of romance: explain family/marriage/nepotism, one
  // sentence each (jilting stays unexplained until it happens).
  const prospect = !ADV.Rel.isPartner(p, c) && ADV.Rel.canRomance(world, p.id, c.id).ok;
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
    const isPartner = ADV.Rel.isPartner(p, c);
    const canProp = !isPartner && ADV.Housing.canTakeSpouse(p) && ADV.Housing.canTakeSpouse(c) && ADV.Rel.canRomance(world, p.id, c.id);
    const iHate = ADV.Rel.hates(world, p.id, c.id);
    const buttons = [];
    if (canProp && canProp.ok) buttons.push({ label: 'Propose', value: 'propose' });
    if (isPartner) buttons.push({ label: 'Leave them (jilt)', value: 'jilt' });
    if (!iHate && !isPartner) buttons.push({ label: 'Declare hatred', value: 'hate' });
    if (iHate) buttons.push({ label: 'Attempt assassination', value: 'kill' });
    buttons.push({ label: 'Walk away', value: null });
    ADV.Notices.pickOne(scene, c.name, `${c.sex === 'f' ? 'Woman' : 'Man'} · rank ${c.rank} · ${c.sex === 'f' ? 'she' : 'he'} thinks of you as ${ADV.Rel.tierBetween(world, c.id, p.id)}.`, buttons, (val) => {
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

// One compact toast at a time, docked in a corner so it never covers a
// modal or the character sheet. Click it to dismiss.
Notices.TOAST_HOLD_MS = 2800;
Notices.TOAST_FADE_MS = 350;
Notices.TOAST_MAX_W = 300;

function msgState(scene) {
  if (!scene.__msg) scene.__msg = { blocked: 0, showing: null, queue: [] };
  return scene.__msg;
}

Notices.block = function (scene) {
  if (!scene) return;
  const st = msgState(scene);
  st.blocked++;
  Notices.dismissToast(scene, true);
};

Notices.unblock = function (scene) {
  if (!scene || !scene.__msg) return;
  const st = scene.__msg;
  st.blocked = Math.max(0, st.blocked - 1);
  if (!st.blocked && scene.time) scene.time.delayedCall(40, () => Notices.flush(scene));
  else if (!st.blocked) Notices.flush(scene);
};

Notices.dismissToast = function (scene, requeue) {
  if (!scene || !scene.__msg) return;
  const st = scene.__msg;
  const cur = st.showing;
  if (!cur) return;
  st.showing = null;
  try { if (cur.tween) cur.tween.stop(); } catch (e) {}
  try { if (cur.t) cur.t.destroy(); } catch (e) {}
  try { if (cur.bg) cur.bg.destroy(); } catch (e) {}
  if (requeue && cur.text) st.queue.unshift(cur.text);
};

Notices.flush = function (scene) {
  if (!scene || !scene.sys || !scene.sys.isActive()) return;
  const st = msgState(scene);
  if (st.blocked || st.showing) return;
  const next = st.queue.shift();
  if (next) Notices._paintToast(scene, next);
};

Notices.toast = function (scene, text) {
  if (!scene || !text) return;
  const st = msgState(scene);
  if (st.showing && st.showing.text === text) return;
  if (st.queue.length && st.queue[st.queue.length - 1] === text) return;
  if (st.blocked || st.showing) { st.queue.push(text); return; }
  Notices._paintToast(scene, text);
};

function toastAnchor(scene) {
  const W = T().W, H = T().H;
  const key = scene.sys && scene.sys.settings && scene.sys.settings.key;
  // Combat/quest and open dialogue use the top-right so we stay off the
  // bottom verb bar. Town uses the empty bottom-right beside the board.
  if (key === 'Combat' || key === 'Quest' || (scene.__msg && scene.__msg.blocked)) {
    return { x: W - 18, y: 18, ox: 1, oy: 0 };
  }
  return { x: W - 18, y: H - 18, ox: 1, oy: 1 };
}

function toastBoxSize(scene, text, maxW) {
  const probe = T().text(scene, 0, 0, text, { size: 13, wrap: maxW });
  let tw = 0;
  const lines = (probe.getWrappedText && probe.getWrappedText()) || [text];
  const ctx = probe.context;
  if (ctx && ctx.measureText) {
    for (const line of lines) tw = Math.max(tw, ctx.measureText(line).width);
  } else tw = Math.min(maxW, probe.width);
  const th = probe.height;
  try { probe.destroy(); } catch (e) {}
  return { w: Math.ceil(Math.min(maxW, Math.max(80, tw))), h: Math.ceil(th) };
}

Notices._paintToast = function (scene, text) {
  const st = msgState(scene);
  const a = toastAnchor(scene);
  const box = toastBoxSize(scene, text, Notices.TOAST_MAX_W);
  const padX = 14, padY = 10;
  const bw = box.w + padX * 2, bh = box.h + padY * 2;
  const cx = a.ox === 1 ? a.x - bw / 2 : a.x + bw / 2;
  const cy = a.oy === 1 ? a.y - bh / 2 : a.y + bh / 2;
  const t = T().text(scene, cx, cy, text, { size: 13, ox: 0.5, oy: 0.5, color: T().css.gold, wrap: box.w, align: 'center' }).setDepth(241);
  const bg = scene.add.rectangle(cx, cy, bw, bh, 0x14110d, 0.94).setDepth(240).setStrokeStyle(1.5, T().c.gold, 0.75);
  bg.setInteractive({ useHandCursor: true });
  const entry = { text, t, bg, tween: null };
  st.showing = entry;
  st.lastText = text;
  const finish = () => {
    if (st.showing !== entry) return;
    st.showing = null;
    try { if (entry.tween) entry.tween.stop(); } catch (e) {}
    try { t.destroy(); } catch (e) {}
    try { bg.destroy(); } catch (e) {}
    Notices.flush(scene);
  };
  bg.on('pointerdown', finish);
  entry.tween = scene.tweens.add({
    targets: [t, bg], alpha: 0, delay: Notices.TOAST_HOLD_MS, duration: Notices.TOAST_FADE_MS,
    onComplete: finish,
  });
};

Notices.custom = function (scene, build) {
  const W = T().W, H = T().H;
  const objs = [];
  const keep = o => { objs.push(o); return o; };
  const D = 930;
  Notices.block(scene);
  keep(scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75).setDepth(D - 2).setInteractive());
  keep(T().panel(scene, W / 2 - 320, 220, 640, 240)).setDepth(D - 1);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    objs.forEach(o => { try { o.destroy(); } catch (e) {} });
    Notices.unblock(scene);
  };
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
  if (!c || !c.alive || ADV.Rel.isPartner(p, c) || !ADV.Housing.canTakeSpouse(c) || !ADV.Housing.canTakeSpouse(p) || !(world.pendingProposals || []).includes(pr)) {
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

Notices.leaderDeath = function (scene, n, next) {
  const game = scene.g();
  const world = game.world;
  const rec = world.pendingLeaderDeath;
  world.pendingLeaderDeath = null;
  if (!rec) return next();
  const who = rec.leaderName || 'The lead';
  scene.promptOnce('firstLeaderFall');
  Notices.pickOne(scene, 'The company is broken',
    who + ' died on the road. The party is disbanded. Find another company, or found your own — a leader does not get back up between battles.',
    [{ label: 'Understood', value: 'ok' }], () => {
      // The survivors used to speak into an empty hub. They bury him instead:
      // same lines, same relationship-picked bands, but staged at the grave and
      // ending with the company walking off in different directions.
      if (ADV.Cutscenes && ADV.Cutscenes.funeral) { ADV.Cutscenes.funeral(scene, rec, next); return; }
      const ids = (rec.memberIds || []).slice();
      const speakNext = () => {
        const id = ids.shift();
        if (!id) return next();
        const c = ADV.World.byId(world, id);
        if (!c || !c.alive) return speakNext();
        scene.speak(c, ADV.DialogueBox.bandFor(game, c), {}, speakNext);
      };
      speakNext();
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
