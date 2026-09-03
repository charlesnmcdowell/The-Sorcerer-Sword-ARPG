// Death scene (§7/§20): reincarnation or nepotism resolution + inheritance summary.
(function () {
'use strict';
const T = () => ADV.T;

class DeathScene extends Phaser.Scene {
  constructor() { super('Death'); }

  create() {
    this.game_ = this.registry.get('game');
    const game = this.game_;
    const W = T().W, H = T().H;
    this.add.rectangle(W / 2, H / 2, W, H, 0x0b0908);
    ADV.Music.play('death');
    const route = game.pendingDeath ? game.pendingDeath.route : { mode: 'reincarnation' };
    const dead = ADV.Game.deadPlayerRecord(game);

    T().text(this, W / 2, 130, 'You died.', { size: 48, display: true, ox: 0.5, color: T().css.blood, bold: true });
    T().text(this, W / 2, 190, `${dead.name} — ${dead.questsCompleted} contracts, rank ${dead.rank}, life ${game.life}.`, { size: 15, ox: 0.5, color: T().css.inkDim });

    const journalCount = Object.keys(game.meta.journal || {}).length;
    const levels = Object.entries(game.meta.skillLevels || {}).filter(([, v]) => v.level > 1);

    let y = 250;
    const line = (s, c) => { T().text(this, W / 2, y, s, { size: 15, ox: 0.5, color: c || T().css.ink, wrap: 700, align: 'center' }); y += 28; };

    line('Carried gold and gear are gone — taken, or scattered on the field.', T().css.inkFaint);
    line(`The journal survives: ${journalCount} skills witnessed across your lives.`, T().css.blue);
    const carried = game.meta.lastLifeSkills;
    if (carried && carried.perks.length + carried.actives.length) {
      line(`Your learned skills follow you: ${carried.perks.concat(carried.actives).map(id => ADV.DATA.SKILLS[id] ? ADV.DATA.SKILLS[id].name : id).join(' · ')}`, T().css.gold);
    } else if (levels.length) {
      line(`Skill levels survive: ${levels.slice(0, 5).map(([id, v]) => `${ADV.DATA.SKILLS[id] ? ADV.DATA.SKILLS[id].name : id} L${v.level}`).join(' · ')}${levels.length > 5 ? ' …' : ''}`, T().css.gold);
    }
    y += 12;

    if (route.mode === 'nepotism') {
      ADV.Game.prompt(game, 'firstDeathNepotism');
      line('But the world does not reset.', T().css.gold);
      const heirName = route.heir.adult ? route.heir.ch.name : 'your child';
      line(`Your eldest, ${heirName}, inherits the vault and your learned skills, and carries their father's name and strength as a title.`, T().css.ink);
      line('Everyone your parent knew is still out there. So is everyone they wronged.', T().css.inkDim);
      T().button(this, W / 2 - 140, y + 30, 280, 50, 'Continue as your child', () => {
        ADV.Game.continueAfterDeath(game, {});
        this.registry.set('game', game);
        this.scene.start('Town');
      }, { display: true, bold: true, size: 17, color: T().css.purple });
    } else {
      ADV.Game.prompt(game, 'firstDeathReincarnation');
      line('Generations pass. Everyone you knew is gone; every grudge died with them.', T().css.inkDim);
      line('What you witnessed and what you mastered follows you into the next life.', T().css.ink);
      T().button(this, W / 2 - 140, y + 30, 280, 50, 'Begin the next life', () => {
        game.pendingDeath = null;
        this.scene.start('Creation', { password: '' });
      }, { display: true, bold: true, size: 17 });
    }
  }
}

ADV.DeathScene = DeathScene;
})();
