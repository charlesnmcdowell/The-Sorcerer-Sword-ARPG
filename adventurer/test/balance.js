// Balance soak (§15a targets): every archetype solo-viable on its free three
// skills, tier-1 solo contracts survivable, ending HP in the 15-30% band-ish.
'use strict';
const { load } = require('./harness');
const ADV = load();

const ARCH = ADV.DATA.ARCHETYPE_SKILLS;

function playFight(st, player, kit) {
  let g = 0;
  while (!st.over && g++ < 600) {
    const t = ADV.Combat.currentTurn(st);
    if (!t) break;
    if (t.unit.ch === player) {
      const u = t.unit;
      let acted = false;
      // naive but sane: heal self if hurt (healer), buff once, else best damage skill, else attack
      for (const skillId of kit.order) {
        const sk = ADV.DATA.SKILLS[skillId];
        if (!sk) continue;
        const m = ADV.Combat.manifestFor(u, skillId);
        if (!m) continue;
        const d = m.data;
        if (d.heal && (u.chp / u.maxHp) > 0.6 && !d.dualHeal) continue;
        if ((d.evadeNext || d.untargetableRounds || d.counterNext) &&
            (u.evade > 0 || u.untargetable > 0 || (u.chp / u.maxHp) > 0.5)) continue;
        if ((d.atkMult || d.guardScope || d.thornPct) && u.statuses.some(s => ['atkBuff', 'guard', 'thorns'].includes(s.kind))) continue;
        if (d.marks != null && ADV.Combat.living(st, 'b').every(f => f.marksBy.includes(u.uid))) continue;
        let off = false;
        let pool = ADV.Combat.validTargets(st, u, skillId, false);
        if (d.heal && !d.dualHeal && (u.chp / u.maxHp) > 0.6 && d.offensive) { off = true; pool = ADV.Combat.validTargets(st, u, skillId, true); }
        if (d.heal && !d.dualHeal && !off) pool = [u];
        if (!pool.length) continue;
        const tgt = pool[0];
        ADV.Combat.act(st, u, { kind: 'skill', skillId, targetUid: tgt.uid, offensiveMode: off });
        acted = true; break;
      }
      if (!acted) {
        const bv = ADV.Combat.validTargets(st, u, 'basic_attack');
        if (bv.length) ADV.Combat.act(st, u, { kind: 'attack', targetUid: bv[0].uid });
      }
    } else ADV.Combat.aiTakeTurn(st, t.unit);
    ADV.Combat.advance(st);
  }
  return st.winner;
}

const KITS = {
  mage:    { order: ['fire_bolt', 'frost_touch'] },
  tank:    { order: ['taunt', 'shield_wall'] },
  rogue:   { order: ['backstab'] },
  ranger:  { order: ['aimed_shot', 'snare'] },
  fighter: { order: ['sunder', 'cleave'] },
  druid:   { order: ['beast_shape', 'thorn_skin'] },
  healer:  { order: ['blood_pact', 'mend'] },
};

console.log('archetype | wins/20 | avg end HP% (winners)');
for (const [arch, kit] of Object.entries(KITS)) {
  let wins = 0, hpSum = 0;
  for (let seed = 1; seed <= 20; seed++) {
    ADV.Save.setBackend({ _m: {}, getItem(k) { return this._m[k] || null; }, setItem(k, v) { this._m[k] = v; }, removeItem(k) { delete this._m[k]; } });
    const a = ARCH[arch];
    const skills = [a.perk].concat(a.actives.slice(0, 2));
    const game = ADV.Game.newGame({ seed: seed * 101 + 7, name: 'B', sex: 'f', portraitSeed: seed, portraitSlot: 1, startingSkills: skills });
    const player = ADV.Game.player(game);
    const q = game.board.find(x => x.tier === 1 && x.track === 'solo');
    ADV.Game.startQuest(game, q, {});
    let ok = true;
    while (true) {
      const enc = ADV.Game.currentEncounter(game);
      if (!enc) break;
      const st = ADV.Game.startCombat(game, false);
      const w = playFight(st, player, kit);
      const r = ADV.Game.finishCombat(game);
      if (r.playerDead || !r.won) { ok = false; break; }
      if (game.quest.readyToComplete) break;
    }
    if (ok && game.quest && game.quest.readyToComplete) {
      wins++;
      hpSum += player.combatHp / ADV.Character.maxHp(player);
    }
  }
  console.log(`${arch.padEnd(9)} | ${String(wins).padStart(2)}/20  | ${wins ? Math.round(hpSum / wins * 100) + '%' : '-'}`);
}
