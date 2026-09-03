// Career structure (§5): hireling applications, wages, firing, leadership,
// payroll, succession, and the hatred block.
(function () {
'use strict';
const C = () => ADV.DATA.CONST;
const Rel = () => ADV.Rel;

const Party = {};
let PID = 1;
Party.resetIds = function (n) { PID = n || 1; };

// world.parties: [{id, leaderId, memberIds:[], wages:{memberId:gold}, employerParty:bool}]

Party.create = function (world, leaderId) {
  const p = { id: 'p' + (PID++), leaderId, memberIds: [], wages: {} };
  world.parties.push(p);
  const leader = ADV.World.byId(world, leaderId);
  if (leader) leader.partyId = p.id;
  return p;
};

Party.of = function (world, ch) {
  if (!ch || !ch.partyId) return null;
  return world.parties.find(p => p.id === ch.partyId) || null;
};

Party.members = function (world, p) {
  return p.memberIds.map(id => ADV.World.byId(world, id)).filter(c => c && c.alive);
};

Party.leader = function (world, p) {
  return ADV.World.byId(world, p.leaderId);
};

Party.roster = function (world, p) {
  const l = Party.leader(world, p);
  return [l].concat(Party.members(world, p)).filter(c => c && c.alive);
};

// No two characters at Hatred serve together (§5) — every direction.
Party.hatredConflict = function (world, p, candidateId) {
  const ids = [p.leaderId].concat(p.memberIds);
  for (const id of ids) {
    if (id === candidateId) continue;
    if (Rel().hatredBlocked(world, id, candidateId)) return id;
  }
  return null;
};

// ---- Hiring by a leader (player or NPC) ------------------------------------
// Wages are fixed offers: accept or decline on Greed and Pride (§5).
// The most a leader can pay a new hire and still take SOME posted contract
// at a profit (request: never offer a wage the leader cannot afford).
Party.maxAffordableWage = function (world, party, board) {
  const best = Math.max(0, ...(board || []).filter(q => q.track === 'party').map(q => q.payout));
  const payroll = Party.payroll(world, party);
  return Math.max(0, best - payroll - 10);
};

// What a hireling actually gets per quest: the standard wage, plus Lookism's edge.
Party.hirelingWageFor = function (ch) {
  const looks = ch.perks.find(x => x.skillId === 'lookism');
  return C().GOLD.hirelingWage + (looks ? (ADV.SkillSys.manifest(ch, looks).data.wageEdge || 10) : 0);
};

Party.offerWage = function (world, rng, p, candidate, wage) {
  if (Party.roster(world, p).length >= C().PARTY_MAX) return { ok: false, why: 'party full' };
  const blocker = Party.hatredConflict(world, p, candidate.id);
  if (blocker) {
    const b = ADV.World.byId(world, blocker);
    return { ok: false, why: 'hatred', blocker: b };
  }
  if (candidate.hospitalizedQuestsLeft > 0) return { ok: false, why: 'hospitalized' };
  if (candidate.status === 'hero') return { ok: false, why: 'a hero cannot take work' };
  const g = candidate.personality.greed, pr = candidate.personality.pride;
  // Muster (§13 Antler): the company's name makes any wage read a quarter richer
  const leader = ADV.World.byId(world, p.leaderId);
  const muster = leader && leader.perks.find(x => x.skillId === 'muster');
  const offered = wage;
  if (muster) wage = Math.round(wage / (1 - (ADV.SkillSys.manifest(leader, muster).data.wageDiscount || 0)));
  // Lookism: hires accept 10g under their price — the offer reads 10g richer
  const looks = leader && leader.perks.find(x => x.skillId === 'lookism');
  if (looks) wage += ADV.SkillSys.manifest(leader, looks).data.wageEdge || 10;
  let accept;
  if (wage < C().GOLD.wageAcceptMin) accept = rng.chance(0.05);
  else if (wage >= C().GOLD.wageAcceptMax) accept = rng.chance(0.98);
  else {
    const t = (wage - C().GOLD.wageAcceptMin) / (C().GOLD.wageAcceptMax - C().GOLD.wageAcceptMin);
    let p0 = 0.25 + t * 0.65;
    p0 += (g - 50) / 400;        // greedy NPCs chase pay
    p0 -= (pr - 50) / 400 * (wage < 35 ? 1 : 0); // proud NPCs refuse low-balls
    const relScore = Rel().score(world, candidate.id, p.leaderId);
    p0 += relScore / 400;
    accept = rng.chance(Math.max(0.02, Math.min(0.98, p0)));
  }
  if (!accept) return { ok: false, why: 'declined' };
  wage = offered;   // the offered wage is what gets paid
  p.memberIds.push(candidate.id);
  p.wages[candidate.id] = wage;
  candidate.partyId = p.id; candidate.leaderId = p.leaderId; candidate.wage = wage;
  return { ok: true };
};

// ---- Player applying to an employer party (§5) ------------------------------
// Gated on reputation, visible skill sheet, and role demand.
Party.applicationOdds = function (world, p, applicant) {
  const roster = Party.roster(world, p);
  if (roster.length >= C().PARTY_MAX) return { odds: 0, why: 'full' };
  const blocker = Party.hatredConflict(world, p, applicant.id);
  if (blocker) return { odds: 0, why: 'hatred' };
  let odds = 0.35 + applicant.reputation * 0.02;
  // Role demand: a party missing a healer weights healing skills heavily (§5)
  const covered = new Set();
  for (const m of roster) for (const e of m.actives) {
    const sk = ADV.DATA.SKILLS[e.skillId];
    if (sk && sk.archetype) covered.add(sk.archetype);
  }
  const brings = new Set();
  for (const e of applicant.actives) {
    const sk = ADV.DATA.SKILLS[e.skillId];
    if (sk && sk.archetype) brings.add(sk.archetype);
  }
  let fills = 0;
  for (const a of brings) if (!covered.has(a)) fills++;
  odds += fills * 0.25;
  if (!covered.has('healer') && brings.has('healer')) odds += 0.2;
  const pe = applicant.perks.find(x => x.skillId === 'persuade');
  if (pe) {
    const m = ADV.SkillSys.manifest(applicant, pe);
    if (m.data.partyApplicationBonus) odds += 0.2;
  }
  return { odds: Math.max(0.02, Math.min(0.95, odds)), fills };
};

// ---- Quitting / firing / dissolution ---------------------------------------
Party.removeMember = function (world, p, chId) {
  const i = p.memberIds.indexOf(chId);
  if (i >= 0) p.memberIds.splice(i, 1);
  delete p.wages[chId];
  const ch = ADV.World.byId(world, chId);
  if (ch) { ch.partyId = null; ch.leaderId = null; ch.wage = 0; }
};

Party.disband = function (world, p) {
  for (const id of p.memberIds.slice()) Party.removeMember(world, p, id);
  const l = Party.leader(world, p);
  if (l) l.partyId = null;
  const i = world.parties.indexOf(p);
  if (i >= 0) world.parties.splice(i, 1);
};

// If a relationship degrades to Hatred during employment, the pairing dissolves (§5).
Party.enforceHatred = function (world, feedPush) {
  for (const p of world.parties.slice()) {
    const roster = Party.roster(world, p);
    for (const m of Party.members(world, p)) {
      if (Rel().hatredBlocked(world, m.id, p.leaderId)) {
        Party.removeMember(world, p, m.id);
        if (feedPush) feedPush(`${m.name} quit ${Party.leader(world, p) ? Party.leader(world, p).name + "'s" : 'the'} party.`, [m.id, p.leaderId]);
        continue;
      }
      for (const other of roster) {
        if (other.id !== m.id && other.id !== p.leaderId && Rel().hatredBlocked(world, m.id, other.id)) {
          Party.removeMember(world, p, m.id);
          if (feedPush) feedPush(`${m.name} and ${other.name} cannot stand each other. ${m.name} left.`, [m.id, other.id]);
          break;
        }
      }
    }
  }
};

// ---- Succession (§5): leader dies mid-quest --------------------------------
// Highest reputation survivor inherits; ties by rank, quests completed, Pride.
Party.succession = function (world, p) {
  const members = Party.members(world, p);
  if (!members.length) { Party.disband(world, p); return null; }
  members.sort((a, b) =>
    b.reputation - a.reputation ||
    b.rank - a.rank ||
    b.questsCompleted - a.questsCompleted ||
    b.personality.pride - a.personality.pride);
  const heir = members[0];
  Party.removeMember(world, p, heir.id);
  p.leaderId = heir.id;
  heir.partyId = p.id; heir.leaderId = null;
  return heir;
};

// Total wage bill for a leader's party — real hires only; conscripts and
// undead draw no wage (§3a).
Party.payroll = function (world, p) {
  let total = 0;
  for (const id of p.memberIds) total += p.wages[id] || 0;
  return total;
};

// Hired bodies only — not conscripts, thralls, or the risen.
Party.regularMembers = function (world, chOrParty) {
  const p = chOrParty && chOrParty.leaderId != null && chOrParty.memberIds
    ? chOrParty : Party.of(world, chOrParty);
  if (p) return Party.roster(world, p).filter(c => c && !c.isConscript && !c.isUndead && !c.isQuestThrall);
  return (chOrParty && chOrParty.alive) ? [chOrParty] : [];
};

// Unpaid followers attached to anyone in the company, plus quest thralls.
Party.followers = function (world, chOrParty, extra) {
  const p = chOrParty && chOrParty.leaderId != null && chOrParty.memberIds
    ? chOrParty : Party.of(world, chOrParty);
  const controllers = p ? Party.roster(world, p) : (chOrParty && chOrParty.id ? [chOrParty] : []);
  const seen = new Set();
  const out = [];
  for (const c of controllers) {
    if (!c) continue;
    for (const id of (c.conscriptIds || []).concat(c.undeadIds || [])) {
      if (seen.has(id)) continue;
      const f = ADV.World.byId(world, id);
      if (f && f.alive) { seen.add(id); out.push(f); }
    }
  }
  for (const t of extra || []) {
    if (t && t.alive !== false && !seen.has(t.id)) { seen.add(t.id); out.push(t); }
  }
  return out;
};

// Hired cap plus the three forbidden extras — 8 on the field at most.
Party.companyCap = function () {
  return (C().PARTY_MAX || 5) + (C().FORBIDDEN_EXTRA_SLOTS || 3);
};

// Empty hired seats plus FORBIDDEN_EXTRA_SLOTS, minus followers already walking.
Party.followerRoom = function (world, chOrParty, extra) {
  const regular = Math.max(1, Party.regularMembers(world, chOrParty).length);
  const walking = Party.followers(world, chOrParty, extra).length;
  return Math.max(0, Party.companyCap() - regular - walking);
};

// Full battle roster including followers (conscripts/undead), capped at 8.
Party.battleRoster = function (world, leadCh) {
  const out = [leadCh];
  const p = Party.of(world, leadCh);
  const addFollowers = (ch) => {
    for (const fid of (ch.conscriptIds || []).concat(ch.undeadIds || [])) {
      const f = ADV.World.byId(world, fid);
      if (f && f.alive && !out.includes(f)) out.push(f);
    }
  };
  if (p && p.leaderId === leadCh.id) {
    for (const m of Party.members(world, p)) if (!out.includes(m)) out.push(m);
    addFollowers(leadCh);
    for (const m of Party.members(world, p)) addFollowers(m);
  } else if (p) {
    const l = Party.leader(world, p);
    if (l && l.alive && l !== leadCh && !out.includes(l)) out.push(l);
    for (const m of Party.members(world, p)) if (m !== leadCh && !out.includes(m)) out.push(m);
    addFollowers(leadCh);
    if (l) addFollowers(l);
    for (const m of Party.members(world, p)) addFollowers(m);
  } else {
    addFollowers(leadCh);
  }
  const cap = Party.companyCap();
  return out.length > cap ? out.slice(0, cap) : out;
};

ADV.Party = Party;
})();
