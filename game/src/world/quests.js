// Quest data — main quest: THE ANKUSPAWN CONSPIRACY (beats 1-2 live in B3; 3-5 land in B5).
// Canon guardrail: the conspiracy survives this game. See docs/LORE_BIBLE.md.

const Quests = {
  main: [
    {
      id: 'mq1-empty-cell',
      title: 'THE EMPTY CELL',
      give: 'auto', // granted on entering the city as champion
      text: 'The Pit\'s last champion vanished the night after his final win. Bellow grumbles that he "ran." The crowd believed it. The innkeeper of the Last Lantern does not.',
      objective: 'Ask around at the Last Lantern inn.',
    },
    {
      id: 'mq2-listening-room',
      title: 'THE LISTENING ROOM',
      give: 'innkeeper-paid', cost: 50, // 5 silver for the real rumor web
      text: 'Three more gone along the trade road — all of them gifted, all of them quiet disappearances. And a guest upstairs has been asking very specific questions about how YOU fight. The innkeeper kept his coin and his ears open.',
      objective: 'The guild keeps the road ledgers. Press them about the missing. (Continues in Thorn Grove — Bucket 4)',
    },
  ],

  guildBoard: [
    { id: 'g-wolves', title: 'CULL: WOLVES', text: 'Eight wolves out of Thorn Grove\'s edge worry the wood-elf herds.', reward: '40c + potion', region: 'Thorn Grove', locked: true },
    { id: 'g-rotshaman', title: 'HUNT: ROT SHAMAN', text: 'Something is raising the forest\'s dead. The Eldest want it stopped.', reward: '80c + potion', region: 'Thorn Grove', locked: true },
    { id: 'g-hounds', title: 'CULL: GRAVE HOUNDS', text: 'Escaped pit hounds gone feral in the southern brush.', reward: '40c + potion', region: 'Thorn Grove', locked: true },
  ],

  innkeeper: {
    name: 'MARLOW',
    greet: 'Well. The Pit spits out a live one for once. {N}, they\'re calling you. Sit — champions drink free, the first one anyway.',
    rumorFree: 'You want to know about Dren? Last champion before you. "Ran off," Bellow says. Dren left his winnings in my strongbox and his boots under the bed. Men who run, run IN boots.',
    rumorPaidOffer: 'The rest isn\'t free. My ears cost me good coin to keep open. Five silver and you\'ll know what the road knows.',
    rumorPaid: 'Three more vanished off the trade road this season. A juggler, a hedge-witch, a quarry boy who could lift a cart. All GIFTED, you follow? And a guest upstairs keeps asking after your fights — what you do, how fast, how often. Asked after Dren the same way, the week before he vanished. I\'d visit the guild before the road, champion.',
    broke: 'Five silver. The Pit paid you a silver a head — don\'t tell me you\'re short.',
    done: 'Watch the alleys, champion. Whatever shops for the gifted hasn\'t finished its list.',
  },
};

if (typeof module !== 'undefined' && module.exports) module.exports = { Quests };
else window.Quests = Quests;
