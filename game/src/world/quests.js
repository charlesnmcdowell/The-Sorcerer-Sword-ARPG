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
      objective: 'The guild keeps the road ledgers. Press them about the missing. Then find the camp the wood-elves spoke of, west past the ley-line node.',
    },
    {
      id: 'mq3-roots-that-rot',
      title: 'ROOTS THAT ROT',
      give: 'camp',
      text: 'A camp by no road: tents that fold fast, crates that breathe. They were moving a sedated captive along the ley-line — and profiling more. The boy you cut loose says they kept asking what he could DO.',
      objective: 'The freed quarry boy named a buyer in Karridge\'s back alleys. Find who is purchasing what the camp was selling.',
    },
    {
      id: 'mq4-the-buyer',
      title: 'THE BUYER',
      give: 'buyer',
      text: 'She isn\'t evil. She\'s desperate — a fertility elixir, priced like a miracle, promised by quiet men "out of the Ashenveil." She showed you the vial: it hums like the node hummed. Something living went into it.',
      objective: 'The grove keeper marks a caravan path on the western edge — the next shipment moves tonight. Stop it.',
    },
    {
      id: 'mq5-ash-and-silence',
      title: 'ASH AND SILENCE',
      give: 'caravan',
      text: 'You broke the caravan and freed the captives in transit. By morning the camp was gone — raked earth, no tents, no tracks, as if the forest had imagined it. Whoever they serve erases faster than you can accuse.',
      objective: 'Word arrives: the Dragon Emperor himself passes through Karridge. You hold a vial, a ledger page, and three witnesses who already won\'t talk. Go to the plaza.',
    },
  ],

  cult: {
    campSign: 'Tents that fold fast. Crates with air-holes. A cold fire pit and a cage with bent bars. This is a waystation, not a camp.',
    captive: {
      name: 'THE QUARRY BOY',
      freed: 'He comes up swinging until he sees the cage door open. "They watched me lift at the quarry fair. WEEKS ago. Asked the others what I could do, wrote it down. There\'s a buyer in the city — back alleys, near the west wall. I heard them price me." He won\'t take an escort. He runs.',
    },
    shenSama: {
      name: 'A STRANGER IN THE TREELINE',
      text: 'Scales like cooling slag under a traveler\'s hood. Eyes too old for the face. "You freed the wrong cargo, champion — they\'ll re-profile and restock within a season. They are SHOPPING. Specific gifts, specific blood. Mine most of all." He looks north, the way hunted things do. "Don\'t follow me. Being near me is how people end up in crates." He is gone between one breath and the next.',
    },
    buyer: {
      name: 'THE VEILED WOMAN',
      text1: 'A back-alley meeting gone wrong the moment you aren\'t who she expected. She doesn\'t run. "You broke the camp. Then you\'ve killed her — the elixir was BOUGHT, paid in full. Out of the Ashenveil, they said. Grown, they said, not brewed." She shows you the vial — it hums against your teeth like the ley-node did.',
      text2: '"I don\'t care what it\'s made of." Her voice cracks on the lie. "I was told it\'s the only one that works. You want the men who sell it? They come down the west forest path, new moon, every month. That\'s all I know. Leave me the vial. Please."',
      choiceKeep: 'You keep the vial. Evidence. She doesn\'t cry where you can see it.',
      choiceGive: 'You leave her the vial. Whatever it is, whoever it was — tonight it\'s mercy. The trail is still the trail.',
    },
    caravanSign: 'Wheel ruts where no wagon should fit between the trees. The ruts are deep. The cargo is heavy, or alive, or both.',
    // Ronin-only finale: the Emperor never arrives. Readers of Book 4 know why.
    finaleRonin: {
      title: 'AN EMPTY ROAD',
      text1: 'Word ran ahead of itself for two days: the Dragon Emperor passes through Karridge. The plaza fills at dawn. Criers clear the road. The guild polishes its ledger table. Bellow, for the first time in living memory, wears a clean shirt.',
      text2: 'He does not come. The road north stays empty past noon, past the bells, past the point where the crowd stops pretending it isn\'t cold. A steward\'s rider finally trots in with the official word: the Emperor\'s itinerary has changed. No reason given. There never is. The crowd grumbles and disperses, and a hundred wagers die unpaid. Somewhere behind you, Bellow mutters: "Twenty-five years, and that man has never once been where anyone expects him to be."',
      text3: 'You stand a while in the emptying plaza, the vial humming in your coat, the crowd\'s name for you drifting back and forth across the stones. There was no one to show the evidence to today. You tell yourself that\'s why you\'re smiling — half a smile, the kind a man keeps for his own secrets. The conspiracy holds. The hunt continues. And the Pit\'s champion polishes a blade that has worn three names, and answers, as ever, to none of them.',
    },
    finale: {
      title: 'THE DRAGON EMPEROR',
      text1: 'He comes through Karridge the way weather comes — the plaza kneels in a wave, the pit-criers go silent mid-shout. ANKUNYX. The Dragon Emperor. He is exactly as tall as the stories and somehow worse: calm. His eyes pass over the crowd and stop, briefly, on you.',
      text2: '"The pit-crowned." His voice is conversational, which is the frightening part. "Karridge is louder about you than about its taxes. Good. Loud places stay honest." A breath. You hold a vial that hums, a ledger page, the names of three freed captives who begged you not to speak theirs. Accuse the Emperor\'s own house — with THIS? He is already turning away. The crowd is already rising. The moment is already over.',
      text3: 'The conspiracy holds. The camp is ash and silence; the Academy\'s lower levels keep their secrets; somewhere a woman with a vial tells herself it\'s medicine. But the captives are free, the grove\'s line runs clean — and you know. The crowd still chants your name. The story is not over. It has barely begun.',
    },
  },

  guildBoard: [
    { id: 'g-wolves', title: 'CULL: WOLVES', text: 'Eight wolves out of Thorn Grove\'s edge worry the wood-elf herds.', reward: '4s + potion', region: 'Thorn Grove', need: 8, copper: 40, potion: 'potion-health', potionLabel: 'Health Potion' },
    { id: 'g-rotshaman', title: 'HUNT: ROT SHAMAN', text: 'Something is raising the forest\'s dead. The Eldest want it stopped.', reward: '8s + potion', region: 'Thorn Grove', need: 1, copper: 80, potion: 'potion-str', potionLabel: 'STR Potion' },
    { id: 'g-hounds', title: 'CULL: GRAVE HOUNDS', text: 'Escaped pit hounds gone feral in the southern brush.', reward: '4s + potion', region: 'Thorn Grove', need: 6, copper: 40, potion: 'potion-dex', potionLabel: 'DEX Potion' },
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
