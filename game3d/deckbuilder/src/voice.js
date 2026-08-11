/* voice.js — the story, spoken. THE SORCERER SWORD — SPIRE OF KARRIDGE
   =====================================================================
   2026-08-06 FULL STORY REWRITE (Hiro's direction): the game is canon to the
   Sorcerer-Sword books, set TWENTY YEARS after Book 4 — the Kingdom of Ankunyx,
   the Dragon Emperor's peace. Its plot is the Karridge arm of the ANKUSPAWN
   CONSPIRACY (docs/LORE_BIBLE.md): the Cult of Anku profiles and harvests the
   gifted; its founder is known only as THE MATRON. Canon guardrails honored:
   the conspiracy is never exposed, no named book character dies or learns of
   it, the Emperor passes through untouchable, and the game's victory is LOCAL —
   one pipeline burned, one shipment freed, the web intact.

   VESSIA is original to this game: a dark-elf warlock, Ashenveil-schooled and
   Ashenveil-burned — she left the academy with her grimoire and no license,
   and she knows harvest-work when she smells it.

   The DANCER is Cookie — the Firebird of Varenholm (approved cameo; she plays
   the Karridge taproom in Act I and her one-night Varenholm show is the
   epilogue). She is exactly what the cult shops for. She doesn't know.

   Clip audio lives in assets/assets_voice.js (SPIRE_VOICE[id] = dataURI).
   Music ducks under a line and recovers. Audio failure never blocks a scene. */
window.Spire = window.Spire || {};

Spire.VO = {
  /* ==================== ACT I — THE PIT OF KARRIDGE ==================== */

  /* the narrator sets the era, then her */
  n_bio: { who: "NARRATOR", text: "Twenty years of the Dragon Emperor's peace. Long enough for the roads to run safe. Long enough for nobody to count the gifted who go missing from them. Into Karridge, city of the Pit, walks VESSIA — dark elf, warlock, schooled in the Ashenveil and thrown out of it for asking what the lower levels were for. She fights for coin now. The Pit is about to learn what the academy could not hold." },

  m_champion: { who: "MARLOW", text: "You'd be the new blood. Word from an old innkeeper: win SMALL. The last champion won big — crowd-name, full purse, the lot. Gone by morning. Bellow tells the crowd he ran off. Girl... his winnings are still in my strongbox. Men who run, run WITH their money." },
  w_act1_intro: { who: "VESSIA", text: "\"Then he didn't run, Marlow. He was collected. There are people who trade in the gifted — they watch you, they write what you can do and what a buyer would pay into a ledger, and one new moon, a wagon comes. I know the trade. I was schooled where they balance those books.\"" },

  n_gate: { who: "THE PIT GATE", text: "THE PIT OF KARRIDGE — the crowd gives every fighter a name, and remembers none of them." },

  w_boss1: { who: "VESSIA", text: "\"Your hounds didn't eat the champion, houndkeeper. Somebody watched his fights and wrote him into the ledger — name, gifts, asking price. That book is a shopping list of PEOPLE, and every name still in it is a wagon that hasn't rolled yet. Show it to me, and I leave you the hand you write with.\"" },

  m_warning: { who: "MARLOW", text: "There's a quiet fellow drinks at my bar every new moon and never gets drunk. Asks after talent. Last night, girl... he was asking after YOU. Mind the alleys past the west wall." },
  w_act1_out: { who: "VESSIA", text: "\"Good — let them look at me. A ledger full of names is worth nothing until it reaches the buyer, Marlow. Which means it travels. And anything that travels... can be followed home.\"" },

  /* ==================== ACT II — KARRIDGE, WEST WALL ==================== */

  n_well: { who: "THE WELL", text: "Plaza of the Nameless. The well remembers every champion Karridge forgot." },

  m_backroom: { who: "MARLOW", text: "Rumor is my trade, not my charity — five silver opens the back room. Three roads, three vanishings this season: a lifter, a firecaller, a girl who sang birds down out of the trees. All gifted. All gone at the new moon. And the wagons always roll WEST." },
  w_fivesilver: { who: "VESSIA", text: "\"Five silver. Cheaper than the other ways I ask questions.\"" },

  b_vial: { who: "THE VEILED WOMAN", text: "\"Ten years I have prayed for a child. The physicians took my coin. This vial took my wedding ring. It WORKS — it is the only thing that ever has. I don't ask what it's brewed from. Please... don't make me ask.\"" },
  w_vial_take: { who: "VESSIA", text: "\"It's brewed from somebody's daughter. You'll thank me the first night you manage to sleep.\"" },
  w_vial_leave: { who: "VESSIA", text: "\"Keep your miracle, then. But when you rock that cradle — remember that somebody else's child paid for it.\"" },

  w_boss2: { who: "VESSIA", text: "\"Open the crates, necromancer. Then we'll open the crews.\"" },

  n_emperor: { who: "NARRATOR", text: "He comes through Karridge the way weather comes. The plaza kneels in a wave; the pit-criers go silent mid-shout. ANKUNYX. The Dragon Emperor. No crown, no escort worth the name — just a tall man with green lamplight for eyes, who once ended a war by kneeling. His gaze crosses the crowd... and stops, briefly, on the one face in it that isn't smiling." },
  w_patience: { who: "VESSIA", text: "\"One word to him, and this city burns down to the truth. But I'd be handing him one page, not the book — and the hand that writes it would simply start a new one, somewhere I can't see. Not yet. Patience is also a weapon.\"" },

  /* ==================== ACT III — THE WEST ROAD, NEW MOON ==================== */

  w_fold: { who: "VESSIA", text: "\"There's the waystation. Fold their camp the way they fold people.\"" },
  w_wagon: { who: "VESSIA", text: "\"Stop the wagon. Whatever is breathing inside it rides home free tonight.\"" },

  n_camp: { who: "NARRATOR", text: "Tents that fold fast. Crates with air-holes. A cold fire pit, and a cage with bent bars. This is not a camp. It is a waystation — and the freight is people." },
  q_priced: { who: "THE QUARRY BOY", text: "\"They watched me lift at the quarry fair. WEEKS back. Asked the others what I could do, and wrote it all down in a grey book. Lady... there's a list. And my name had a NUMBER next to it.\"" },
  w_run: { who: "VESSIA", text: "\"Run home, stone-boy. You're worth more to me as a rumor.\"" },

  w_stand: { who: "VESSIA", text: "\"Stand up, champion. I want the man who sold his name to look at a woman who kept hers.\"" },
  w_price: { who: "VESSIA", text: "\"Knowledge has a price. Here is yours.\"" },   // tavern epic pick (kept clip)

  /* ==================== EPILOGUE — VARENHOLM ==================== */

  n_coach: { who: "NARRATOR", text: "Three days by coach, two changes of horses, one toll bridge where the guard waves her through on the strength of a pit-name. Varenholm: spires, banners, streetlamps with glass in them. And on every post, the same playbill: ONE NIGHT ONLY — THE FIREBIRD OF VARENHOLM." },
  n_firebird: { who: "NARRATOR", text: "The hall is full past the fire-marshal's patience. She comes out small — a halfling girl in firebird silks — and the room gets smaller. The dance is all joy and impossible precision, and then the EMOTION arrives: not heard, FELT, washing the tiers like warm water. Two thousand strangers grinning at once, and not one of them asking why." },
  n_hum: { who: "NARRATOR", text: "Vessia doesn't grin. She knows that hum. She felt it in a vial that cost a wedding ring, in a grey book with numbers next to names. Ember-work — the very grade the wagons roll west for. Somewhere, a ledger already has this dancer's name in it." },
  c_flower: { who: "THE FIREBIRD", text: "\"You watched the whole show like somebody was going to steal it, love. Here — a flower for the grim one. Come back tomorrow. I'm told I grow on people.\"" },
  n_close: { who: "NARRATOR", text: "The coach south leaves at dawn. Varenholm's lamps go gold behind her. One pipeline is ash on the west road, and the web that spun it is already cutting a new one — but tonight, in the Crown Quarter, a dancer takes her third encore. Because the best place to hide from the dark is the absolute center of the light." },
  w_epilogue: { who: "VESSIA", text: "\"I burned one road. They will cut another — collectors always do. And somewhere in the Ashenveil, their ledger still keeps my page: my name, my gifts, and a price I intend to make them regret. Let the hand that writes come to collect. I will teach it a better trade.\"" },

  /* ============================ the villains ============================ */
  /* Act I boss — the Hound Master: pit beast-keeper, and somebody's eyes */
  e_ms_intro: { who: "THE HOUND MASTER", text: "\"Fresh blood — and GIFTED blood at that. Oh, the yard has been waiting for something like you. Hah! The hounds eat first tonight!\"" },
  e_ms_horn: { who: "THE HOUND MASTER", text: "\"SOUND THE HORN! Run her down!\"" },
  e_ms_death: { who: "THE HOUND MASTER", text: "\"I only... watch the door... the list was never... mine...\"" },

  /* Act II regulars (the alley pipeline) */
  e_hk_intro: { who: "THE HOOK", text: "\"Wrong alley, pretty thing. The toll is everything you're carrying.\"" },
  e_gn_intro: { who: "THE ROAD GUNNER", text: "\"Hold still. One shot is all I've ever needed.\"" },
  e_st_intro: { who: "THE STITCHER", text: "\"Hold still, pretty thing. Such fine seams you have... the night work is delicate, and I do my very best work in the dark.\"" },
  e_st_mend: { who: "THE STITCHER", text: "\"Needle in... thread through... all my pretty pieces, whole again.\"" },
  e_gv_intro: { who: "GRAVEHAND", text: "\"I dig them up, mostly. Occasionally... I make my own.\"" },

  /* Act II boss — a LICENSED necromancer on the cult's retainer */
  e_nc_intro: { who: "THE COURT NECROMANCER", text: "\"My license is in perfect order, warlock — and so is your file. You have been appraised. The Matron pays handsomely for your kind.\"" },
  e_nc_raise: { who: "THE COURT NECROMANCER", text: "\"Rise. She is worth more bleeding than breathing.\"" },
  e_nc_death: { who: "THE COURT NECROMANCER", text: "\"The ledger... does not close... it only... re-letters...\"" },

  /* Act III crew (the night shipment) */
  e_ch_intro: { who: "THE CHAIN", text: "\"The cargo fights back? Good. I hate a dull road.\"" },
  e_py_intro: { who: "THE PYRE", text: "\"Burn marks make the merchandise... memorable.\"" },
  e_dr_intro: { who: "THE WALL", text: "\"STAY. OUT.\"" },

  /* Act III boss — THE CHAMP: the Pit's vanished champion. Nobody took him. */
  e_cp_intro: { who: "THE CHAMP", text: "\"You came all this way for the vanished champion? Save your pity, little warlock. Nobody took me. They showed me my page in the ledger — my gifts, my price — and I LIKED the number. So I signed. They pay me in thralls to guard this road. You? You I'd have done for free.\"" },
  e_cp_devour: { who: "THE CHAMP", text: "\"MORE! Bring me MORE!\"" },
  e_cp_death: { who: "THE CHAMP", text: "\"Tell Bellow... tell the crowd... they were never going to remember me anyway...\"" },

  /* ==================== TSUBAKI'S ROAD (2026-08-08) ====================
     The other playthrough: the Matron's best student, sent to Karridge after
     the pipeline burned. Her enemies are the TEMPEST SCHOOL — an eastern
     mercenary house hired by families of the taken to hunt the cult. The
     player walks the villain's road; the school's fighters are the heroes
     of somebody else's story, and the writing knows it. */
  k_bio: { who: "NARRATOR", text: "The Ashenveil keeps its best students off the rolls. TSUBAKI, of the Ieyasu school — the Matron's blade, her finest collector, her quietest knife. Karridge burned a pipeline last season, and somebody must write a new one. Victory, she would tell you, is simply her nature." },
  k_orders: { who: "TSUBAKI", text: "\"Three tasks, then. Rebuild the route. Find the arsonist's trail. And mark every gift in this city worth a page. Consider it written, my Lady.\"" },
  k_boss1: { who: "TSUBAKI", text: "\"You have been watching the pit for weeks, bowman. So have I. The difference is — nobody hired me to be seen.\"" },
  k_out1: { who: "TSUBAKI", text: "\"A mercenary school, hunting us on behalf of grieving families. Honest work. I almost regret what comes next.\"" },
  k_silver: { who: "TSUBAKI", text: "\"Five silver, innkeeper. A bargain. Where I studied, rumors are paid for in teeth.\"" },
  k_file: { who: "TSUBAKI", text: "\"Dance, little Firebird. Burn bright. The Matron pays double for the ones who glow.\"" },
  k_price: { who: "TSUBAKI", text: "\"The school teaches: take the stroke that is offered.\"" },
  k_boss2: { who: "TSUBAKI", text: "\"Step aside, monk. Your school was paid to find the wolves — not to stand in front of one.\"" },
  k_patience: { who: "TSUBAKI", text: "\"There he is. The assignment beneath every assignment. Not here — not with witnesses. The Lady's design needs him charmed, not warned. Patience: the school's first stroke.\"" },
  k_house: { who: "TSUBAKI", text: "\"The Tempest House. Burn the contracts. Break the banners. Politely. A school with no students hunts no one.\"" },
  k_boss3: { who: "TSUBAKI", text: "\"Old man. Your storm has taken my couriers, my wagons, and my season. I am here to collect the weather.\"" },
  n_kcage: { who: "NARRATOR", text: "A Tempest supply cage — and inside it, one of her own: a cult courier, trussed, tagged, and left to be questioned at dawn." },
  k_courier: { who: "THE COURIER", text: "\"They knew the route, lady. They knew the MOON. Somebody sold us to the school — somebody inside.\"" },
  k_go: { who: "TSUBAKI", text: "\"Run to the Ashenveil, little moth. Tell the Lady the road is hers again — and that I will find the tongue that wagged.\"" },
  n_ashen: { who: "NARRATOR", text: "The Ashenveil at dusk: ash fields, the working dead bending in a grey harvest, and an academy whose lower levels are not a metaphor. She walks in unannounced. She is expected anyway." },
  k_deliver: { who: "TSUBAKI", text: "\"The route breathes. The school is broken. Eleven new pages for the ledger — marked, priced, and patient. And one small vial... from an errand the Lady set me, long ago.\"" },
  n_vial: { who: "NARRATOR", text: "The emissary takes the vial the way priests take relics. Somewhere below, a queen who has worn death for centuries will drink a stranger's burning life — and stand a little taller in the morning." },
  k_next: { who: "TSUBAKI", text: "\"And my next assignment. ...A man on the western roads. Green eyes. No escort. My Lady... you honor me.\"" },
  n_kclose: { who: "NARRATOR", text: "She sharpens the katana twice that night, though it does not need it. Somewhere west, an emperor travels alone the way weather travels. The web has a new spider — and the spider is smiling." },

  /* ---- the Tempest School speaks ---- */
  e_nj_intro: { who: "TEMPEST SHINOBI", text: "\"The school sees you, cult-blade.\"" },
  e_ar_intro: { who: "THE LONGBOW", text: "\"The Tempest School knows what you are, cultist. Grieving families paid us to find the taken. I believe I'll start with the taker.\"" },
  e_ar_death: { who: "THE LONGBOW", text: "\"Report it... the blade... she is already... inside the walls...\"" },
  e_mk_intro: { who: "THE IRON PALM", text: "\"The mountain does not move for weather, and I do not move for killers. The children you sold — I carry their names, cultist. You will hear every one.\"" },
  e_mk_death: { who: "THE IRON PALM", text: "\"Even stone... wears... someone... remember their names...\"" },
  e_ss_intro: { who: "THE STORM SAGE", text: "\"I have taught three generations to stand between the helpless and things like you. Come then, cult-blade. The sky owes you a debt.\"" },
  e_ss_death: { who: "THE STORM SAGE", text: "\"Students... scatter... the storm does not end... it only... changes hands...\"" }
};

/* play a story clip: subtitle banner + audio (if unlocked), music duck.
   Returns a promise that always resolves. opts.minMs floors the subtitle time. */
Spire.say = function (scene, id, opts) {
  opts = opts || {};
  const vo = Spire.VO[id] || { who: "", text: "" };
  return new Promise(resolve => {
    let settled = false, sub = null;
    const done = () => {
      if (settled) return; settled = true;
      if (sub && sub.scene) scene.tweens.add({ targets: sub, alpha: 0, duration: 300, onComplete: () => sub.destroy() });
      if (Spire._audio && Spire.musicOn) Spire._audio.volume = 0.4;
      resolve();
    };
    /* subtitle banner */
    if (vo.text && scene && scene.add) {
      sub = scene.add.container(640, 646).setDepth(90);
      const txt = scene.add.text(0, 0, (vo.who ? vo.who + " — " : "") + vo.text, {
        fontFamily: "Georgia, serif", fontSize: 15, fontStyle: "italic", color: "#efdcb8",
        align: "center", wordWrap: { width: 980 }, lineSpacing: 3
      }).setOrigin(0.5);
      const bgR = scene.add.rectangle(0, 0, Math.min(1040, txt.width + 44), txt.height + 22, 0x120b08, 0.88)
        .setStrokeStyle(1.5, 0x8a5a33);
      sub.add([bgR, txt]);
      sub.setAlpha(0);
      scene.tweens.add({ targets: sub, alpha: 1, duration: 250 });
    }
    /* audio */
    let fallbackMs = Math.max(opts.minMs || 0, 2600 + (vo.text ? vo.text.length * 52 : 0));
    const uri = window.SPIRE_VOICE && SPIRE_VOICE[id];
    if (uri) {
      try {
        const a = new Audio(uri);
        Spire._voiceNow = a;
        if (Spire._audio && Spire.musicOn) Spire._audio.volume = 0.1;   // duck music under the line
        a.addEventListener("ended", done);
        a.addEventListener("error", () => scene.time.delayedCall(fallbackMs, done));
        const p = a.play();
        if (p && p.catch) p.catch(() => scene.time.delayedCall(fallbackMs, done));
        /* absolute guard so nothing can hang a scene */
        scene.time.delayedCall(45000, done);
      } catch (e) { scene.time.delayedCall(fallbackMs, done); }
    } else {
      scene.time.delayedCall(fallbackMs, done);
    }
    /* click skips the line */
    if (scene.input) scene.input.once("pointerdown", () => {
      if (Spire._voiceNow) { try { Spire._voiceNow.pause(); } catch (e) {} }
      done();
    });
  });
};
