#!/usr/bin/env python3
"""
gen_story_voices.py — the deck-builder's story-rewrite voice batch (2026-08-05).

Hiro's direction: rewrite the writing into a better story, re-voice the WARLOCK with
a Nigerian woman's voice (she is Vessia now — this also retires the old male-read
bio), and give the bad guys fight dialogue. Uses the ARPG's ElevenLabs account/key
from game/tools/voice_config.json (verified reachable from the cloud sandbox;
same lesson as the xAI discovery — test, don't trust stale notes).

Voices: existing cast ids are reused (Narrator, Marlow, Kargoth for THE WALL...).
New designs (saved to the account as "SPIRE <name>", ids persisted to
build/spire_voices.json so reruns never re-buy): Vessia (the warlock), Houndmaster,
Necromancer (also voices the Pyre), Champ, Roadscum (hook/gunner/gravehand/chain).

Output: gen_voice_out/<id>.mp3 — skipped if present, so retakes are: delete + rerun.
"""
import json, ssl, sys, time, urllib.request, urllib.error
from pathlib import Path

HERE = Path(__file__).resolve().parent
CFG = json.loads(Path("/mnt/user-data/uploads/game/tools/voice_config.json").read_text())
KEY = CFG["api_key"]
MODEL = "eleven_v3"
OUT = HERE / "gen_voice_out"
OUT.mkdir(exist_ok=True)
SAVED = HERE / "spire_voices.json"
API = "https://api.elevenlabs.io"

def http(method, path, payload=None, timeout=300):
    req = urllib.request.Request(API + path, method=method,
        headers={"xi-api-key": KEY, "content-type": "application/json"},
        data=json.dumps(payload).encode() if payload is not None else None)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ssl.create_default_context()) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except Exception as e:
        return 0, str(e).encode()

# ---------------- new voice designs ----------------
BRIEFS = {
  "Vessia":      "Nigerian woman in her early thirties, rich velvet alto with a proud, elegant Nigerian accent, unhurried and precise, regal dark-sorceress poise, faint amusement like a knife being admired, every sentence a quiet contract sealed in silk.",
  "Houndmaster": "Brutal beast-tamer and pit boss, male, 50s, wet gravel bark, cruel showman's relish, half shout half snarl, the voice of a man who talks to dogs more than people.",
  "Necromancer": "Court necromancer, male, ageless, dry papery baritone with aristocratic disdain, unhurried clerical cadence, a ledger-keeper of the dead, small cold smile always audible.",
  "Champ":       "Arena champion gone mercenary, male, huge chest voice, boastful gladiator swagger with a hungry edge, laughs mid-threat, in love with his own legend.",
  "Roadscum":    "Cutthroat highwayman, male, 30s, lean rasping sneer, quick and mocking, a knife-fighter's economy, gutter charm with no warmth behind it.",
  "Stitcher":    "Back-alley surgeon's whisper, male, ageless, soft wet courteous menace like a Victorian ripper soothing his work on a foggy night, scalpel-precise sibilants, an audible gentle smile, never once raises his voice.",
  "Marlow":      "Old innkeeper and rumor-broker, male, 60s, warm worn oak-barrel baritone, unhurried tavern cadence, kind eyes and a hard memory, every sentence poured like a last drink for a friend heading somewhere stupid.",
  "VeiledWoman": "Desperate gentlewoman, 40s, cultured trembling contralto worn thin by grief, hushed as a chapel confession, dignity cracking around the edges, pleading without ever raising her voice.",
  "QuarryBoy":   "Young quarry laborer, male adult, early twenties, light reedy tenor, broad country vowels, breathless and scared but trying to be brave, words tumbling out too fast.",
  "Firebird":    "Young halfling showwoman, bright quicksilver soprano with a music-hall lilt, warm cheeky stage charm, laughter always one breath away, the kind of voice a whole city falls in love with.",
  "Tsubaki":     "Female samurai assassin, early thirties, low measured alto with refined Japanese-accented English, unhurried and precise as calligraphy, courteous surface over lethal certainty, faint private amusement, never raises her voice.",
  "Longbow":     "Veteran mercenary archer, male, 40s, dry laconic tenor, wind-worn and patient, clipped professional sentences, the calm of a man who has already measured the distance.",
  "IronPalm":    "Mountain warrior-monk, male, 50s, deep serene bass with granite stillness, unhurried monastic cadence, compassion and finality in the same breath.",
  "StormSage":   "Ancient storm sorcerer, male, 70s, crackling weathered voice with rolling authority, a teacher's warmth gone hard, thunder in the low notes.",
  "Shinobi":     "Shadow scout, male, 30s, hushed flat whisper that carries, terse and toneless, every word a report.",
}

def load_saved():
    return json.loads(SAVED.read_text()) if SAVED.exists() else {}

def design_voices():
    voices = load_saved()
    for name, brief in BRIEFS.items():
        if voices.get(name): continue
        # sample text for the preview: use each voice's longest line below
        sample = max((l["text"] for l in LINES if l["slot"] == name), key=len, default=brief)
        if len(sample) < 100: sample = (sample + " " + brief)
        st, body = http("POST", "/v1/text-to-voice/design",
            {"voice_description": brief, "text": sample[:950], "model_id": "eleven_multilingual_ttv_v2"})
        if st != 200:
            print(f"!! design {name} failed ({st}): {body[:200].decode(errors='replace')}"); sys.exit(1)
        gen = json.loads(body)["previews"][0]["generated_voice_id"]
        st, body = http("POST", "/v1/text-to-voice",
            {"voice_name": "SPIRE " + name, "voice_description": brief, "generated_voice_id": gen})
        if st != 200:
            print(f"!! save {name} failed ({st}): {body[:200].decode(errors='replace')}"); sys.exit(1)
        voices[name] = json.loads(body)["voice_id"]
        SAVED.write_text(json.dumps(voices, indent=2))
        print(f"+ designed {name} -> {voices[name]}")
    return voices

# ---------------- the rewritten script ----------------
# slot = voice. text = subtitle (display). vtext = the performed read (v3 audio tags).
NARR = "Narrator"
LINES = [
  # ================= ACT I — THE PIT OF KARRIDGE =================
  { "id": "n_bio", "slot": NARR, "who": "NARRATOR",
    "text": "Twenty years of the Dragon Emperor's peace. Long enough for the roads to run safe. Long enough for nobody to count the gifted who go missing from them. Into Karridge, city of the Pit, walks VESSIA - dark elf, warlock, schooled in the Ashenveil and thrown out of it for asking what the lower levels were for. She fights for coin now. The Pit is about to learn what the academy could not hold.",
    "vtext": "[measured] Twenty years of the Dragon Emperor's peace. Long enough for the roads to run safe. [short pause] Long enough for nobody to count the gifted... who go MISSING from them. [short pause] Into Karridge, city of the Pit, walks VESSIA. Dark elf. Warlock. Schooled in the Ashenveil - and thrown OUT of it, for asking what the lower levels were for. [dry] She fights for coin now. [reverent] The Pit is about to learn... what the academy could not hold." },
  { "id": "m_champion", "slot": "Marlow", "who": "MARLOW",
    "text": "You'd be the new blood. Word from an old innkeeper: win SMALL. The last champion won big - crowd-name, full purse, the lot. Gone by morning. Bellow tells the crowd he ran off. Girl... his winnings are still in my strongbox. Men who run, run WITH their money.",
    "vtext": "[warm, weary] You'd be the new blood. Word from an old innkeeper... win SMALL. [short pause] The last champion won big. Crowd-name, full purse, the lot. Gone by morning. Bellow tells the crowd he ran off. [lower] Girl... his winnings are still in my strongbox. [long pause] Men who run... run WITH their money." },
  { "id": "w_act1_intro", "slot": "Vessia", "who": "VESSIA",
    "text": "Then he didn't run, Marlow. He was collected. There are people who trade in the gifted - they watch you, they write what you can do and what a buyer would pay into a ledger, and one new moon, a wagon comes. I know the trade. I was schooled where they balance those books.",
    "vtext": "[quiet, certain] Then he didn't run, Marlow. He was COLLECTED. [short pause] There are people who trade in the gifted. They watch you. They write what you can do - and what a buyer would pay - into a ledger. And one new moon... a wagon comes. [icy] I know the trade. I was schooled where they balance those books." },
  { "id": "n_gate", "slot": NARR, "who": "THE PIT GATE",
    "text": "THE PIT OF KARRIDGE - the crowd gives every fighter a name, and remembers none of them.",
    "vtext": "[stone-grave announcement] THE PIT OF KARRIDGE. [short pause] The crowd gives every fighter a name... and remembers NONE of them." },
  { "id": "w_boss1", "slot": "Vessia", "who": "VESSIA",
    "text": "Your hounds didn't eat the champion, houndkeeper. Somebody watched his fights and wrote him into the ledger - name, gifts, asking price. That book is a shopping list of PEOPLE, and every name still in it is a wagon that hasn't rolled yet. Show it to me, and I leave you the hand you write with.",
    "vtext": "Your hounds didn't eat the champion, houndkeeper. Somebody watched his fights... and wrote him into the LEDGER. Name. Gifts. Asking price. [short pause] That book is a shopping list of PEOPLE - and every name still in it is a wagon that hasn't rolled yet. [silken menace] Show it to me... and I leave you the hand you write with." },
  { "id": "e_ms_intro", "slot": "Houndmaster", "who": "THE HOUND MASTER",
    "text": "Fresh blood - and GIFTED blood at that. Oh, the yard has been waiting for something like you. Hah! The hounds eat first tonight!",
    "vtext": "[snarling relish] Fresh blood... and GIFTED blood at that. Ohh, the yard has been WAITING for something like you. [laughs] The hounds eat FIRST tonight!" },
  { "id": "e_ms_horn", "slot": "Houndmaster", "who": "THE HOUND MASTER",
    "text": "SOUND THE HORN! Run her down!",
    "vtext": "[shouting] SOUND THE HORN! [whistles] RUN. HER. DOWN!" },
  { "id": "e_ms_death", "slot": "Houndmaster", "who": "THE HOUND MASTER",
    "text": "I only... watch the door... the list was never... mine...",
    "vtext": "[dying, rasping] I only... watch the door... [coughs] the list... was never... mine..." },
  { "id": "m_warning", "slot": "Marlow", "who": "MARLOW",
    "text": "There's a quiet fellow drinks at my bar every new moon and never gets drunk. Asks after talent. Last night, girl... he was asking after YOU. Mind the alleys past the west wall.",
    "vtext": "[low, over the bar] There's a quiet fellow drinks at my bar every new moon... and never gets drunk. Asks after TALENT. [short pause] Last night, girl... he was asking after YOU. [grim] Mind the alleys past the west wall." },
  { "id": "w_act1_out", "slot": "Vessia", "who": "VESSIA",
    "text": "Good - let them look at me. A ledger full of names is worth nothing until it reaches the buyer, Marlow. Which means it travels. And anything that travels... can be followed home.",
    "vtext": "[dark amusement] Good. Let them LOOK at me. [short pause] A ledger full of names is worth nothing until it reaches the buyer, Marlow. Which means it TRAVELS. [long pause] [smiling] And anything that travels... can be followed home." },

  # ================= ACT II — KARRIDGE, WEST WALL =================
  { "id": "n_well", "slot": NARR, "who": "THE WELL",
    "text": "Plaza of the Nameless. The well remembers every champion Karridge forgot.",
    "vtext": "[hushed] Plaza of the Nameless. [short pause] The well remembers... every champion Karridge forgot." },
  { "id": "m_backroom", "slot": "Marlow", "who": "MARLOW",
    "text": "Rumor is my trade, not my charity - five silver opens the back room. Three roads, three vanishings this season: a lifter, a firecaller, a girl who sang birds down out of the trees. All gifted. All gone at the new moon. And the wagons always roll WEST.",
    "vtext": "Rumor is my trade, not my charity. Five silver opens the back room. [short pause] [counting quietly] Three roads. Three vanishings this season. A lifter. A firecaller. A girl who sang birds down out of the trees. [pause] All gifted. All gone at the new moon. [low] And the wagons... always roll WEST." },
  { "id": "w_fivesilver", "slot": "Vessia", "who": "VESSIA",
    "text": "Five silver. Cheaper than the other ways I ask questions.",
    "vtext": "[silken] Five silver. [short pause] [faint smile] Cheaper than the OTHER ways I ask questions." },
  { "id": "b_vial", "slot": "VeiledWoman", "who": "THE VEILED WOMAN",
    "text": "Ten years I have prayed for a child. The physicians took my coin. This vial took my wedding ring. It WORKS - it is the only thing that ever has. I don't ask what it's brewed from. Please... don't make me ask.",
    "vtext": "[trembling, hushed] Ten years I have prayed for a child. The physicians took my coin. [short pause] This vial took my wedding ring. [urgent whisper] It WORKS. It is the only thing that ever has. [breaking] I don't ask what it's brewed from. Please... [long pause] don't make me ask." },
  { "id": "w_vial_take", "slot": "Vessia", "who": "VESSIA",
    "text": "It's brewed from somebody's daughter. You'll thank me the first night you manage to sleep.",
    "vtext": "[quiet, not unkind] It's brewed from somebody's DAUGHTER. [short pause] You'll thank me... the first night you manage to sleep." },
  { "id": "w_vial_leave", "slot": "Vessia", "who": "VESSIA",
    "text": "Keep your miracle, then. But when you rock that cradle - remember that somebody else's child paid for it.",
    "vtext": "[cold mercy] Keep your miracle, then. [long pause] But when you rock that cradle... remember that somebody ELSE'S child paid for it." },
  { "id": "e_hk_intro", "slot": "Roadscum", "who": "THE HOOK",
    "text": "Wrong alley, pretty thing. The toll is everything you're carrying.",
    "vtext": "[sneering] Wrong alley, pretty thing. [short pause] The toll... is everything you're carrying." },
  { "id": "e_gn_intro", "slot": "Roadscum", "who": "THE ROAD GUNNER",
    "text": "Hold still. One shot is all I've ever needed.",
    "vtext": "[flat, taking aim] Hold still. [short pause] One shot is all I've EVER needed." },
  { "id": "e_st_intro", "slot": "Stitcher", "who": "THE STITCHER",
    "text": "Hold still, pretty thing. Such fine seams you have... the night work is delicate, and I do my very best work in the dark.",
    "vtext": "[whisper, courteous menace] Hold still, pretty thing. Such FINE seams you have... [soft laugh] The night work is delicate... and I do my very best work... in the dark." },
  { "id": "e_st_mend", "slot": "Stitcher", "who": "THE STITCHER",
    "text": "Needle in... thread through... all my pretty pieces, whole again.",
    "vtext": "[crooning softly] Needle in... thread through... [contented sigh] all my pretty pieces... whole again." },
  { "id": "e_gv_intro", "slot": "Roadscum", "who": "GRAVEHAND",
    "text": "I dig them up, mostly. Occasionally... I make my own.",
    "vtext": "[gravel drawl] I dig them up. Mostly. [long pause] [darker] Occasionally... I make my own." },
  { "id": "w_boss2", "slot": "Vessia", "who": "VESSIA",
    "text": "Open the crates, necromancer. Then we'll open the crews.",
    "vtext": "[command, velvet over steel] Open the crates, necromancer. [short pause] Then we'll open the CREWS." },
  { "id": "e_nc_intro", "slot": "Necromancer", "who": "THE COURT NECROMANCER",
    "text": "My license is in perfect order, warlock - and so is your file. You have been appraised. The Matron pays handsomely for your kind.",
    "vtext": "[dry, clerical] My license is in perfect order, warlock. [short pause] And so... is your FILE. You have been appraised. [small cold smile] The Matron pays handsomely for your kind." },
  { "id": "e_nc_raise", "slot": "Necromancer", "who": "THE COURT NECROMANCER",
    "text": "Rise. She is worth more bleeding than breathing.",
    "vtext": "[intoning] Rise. [short pause] She is worth more bleeding... than breathing." },
  { "id": "e_nc_death", "slot": "Necromancer", "who": "THE COURT NECROMANCER",
    "text": "The ledger... does not close... it only... re-letters...",
    "vtext": "[failing, papery] The ledger... does not close... [rattling breath] it only... re-letters..." },
  { "id": "n_emperor", "slot": NARR, "who": "NARRATOR",
    "text": "He comes through Karridge the way weather comes. The plaza kneels in a wave; the pit-criers go silent mid-shout. ANKUNYX. The Dragon Emperor. No crown, no escort worth the name - just a tall man with green lamplight for eyes, who once ended a war by kneeling. His gaze crosses the crowd... and stops, briefly, on the one face in it that isn't smiling.",
    "vtext": "[awed hush] He comes through Karridge... the way WEATHER comes. The plaza kneels in a wave. The pit-criers go silent mid-shout. [reverent] ANKUNYX. The Dragon Emperor. [short pause] No crown. No escort worth the name. Just a tall man with green lamplight for eyes... who once ended a war by KNEELING. [long pause] [quieter] His gaze crosses the crowd... and stops. Briefly. On the one face in it... that isn't smiling." },
  { "id": "w_patience", "slot": "Vessia", "who": "VESSIA",
    "text": "One word to him, and this city burns down to the truth. But I'd be handing him one page, not the book - and the hand that writes it would simply start a new one, somewhere I can't see. Not yet. Patience is also a weapon.",
    "vtext": "[under her breath] One word to him... and this city burns down to the TRUTH. [short pause] But I'd be handing him one page - not the book. And the hand that writes it would simply start a new one... somewhere I can't see. [long pause] [steel] Not yet. Patience... is also a weapon." },

  # ================= ACT III — THE WEST ROAD =================
  { "id": "w_fold", "slot": "Vessia", "who": "VESSIA",
    "text": "There's the waystation. Fold their camp the way they fold people.",
    "vtext": "[cold, quiet] There's the waystation. [short pause] Fold their camp... the way they fold PEOPLE." },
  { "id": "w_wagon", "slot": "Vessia", "who": "VESSIA",
    "text": "Stop the wagon. Whatever is breathing inside it rides home free tonight.",
    "vtext": "[urgent, low] Stop the wagon. [short pause] Whatever is breathing inside it... rides home FREE tonight." },
  { "id": "n_camp", "slot": NARR, "who": "NARRATOR",
    "text": "Tents that fold fast. Crates with air-holes. A cold fire pit, and a cage with bent bars. This is not a camp. It is a waystation - and the freight is people.",
    "vtext": "[grim inventory] Tents that fold fast. Crates... with air-holes. A cold fire pit. And a cage, with bent bars. [long pause] This is not a camp. It is a waystation. [quiet anger] And the freight... is people." },
  { "id": "q_priced", "slot": "QuarryBoy", "who": "THE QUARRY BOY",
    "text": "They watched me lift at the quarry fair. WEEKS back. Asked the others what I could do, and wrote it all down in a grey book. Lady... there's a list. And my name had a NUMBER next to it.",
    "vtext": "[scared, words tumbling] They watched me lift at the quarry fair. WEEKS back. Asked the others what I could do, and... and wrote it all down. In a grey book. [voice cracking] Lady... there's a LIST. [pause] And my name had a NUMBER next to it." },
  { "id": "w_run", "slot": "Vessia", "who": "VESSIA",
    "text": "Run. You're worth more to me as a rumor.",
    "vtext": "[gentle, then iron] Run. [short pause] You're worth more to me... as a rumor." },
  { "id": "e_ch_intro", "slot": "Roadscum", "who": "THE CHAIN",
    "text": "The cargo fights back? Good. I hate a dull road.",
    "vtext": "[amused growl] The cargo fights BACK? [laughs] Good. I hate a dull road." },
  { "id": "e_py_intro", "slot": "Necromancer", "who": "THE PYRE",
    "text": "Burn marks make the merchandise... memorable.",
    "vtext": "[soft, scorched] Burn marks make the merchandise... [pause] ...memorable." },
  { "id": "e_dr_intro", "slot": "__KARGOTH__", "who": "THE WALL",
    "text": "STAY. OUT.",
    "vtext": "[massive, grinding] STAY. [long pause] OUT." },
  { "id": "w_stand", "slot": "Vessia", "who": "VESSIA",
    "text": "Stand up, champion. I want the man who sold his name to look at a woman who kept hers.",
    "vtext": "[level, contemptuous] Stand up, champion. [short pause] I want the man who SOLD his name... to look at a woman who KEPT hers." },
  { "id": "e_cp_intro", "slot": "Champ", "who": "THE CHAMP",
    "text": "You came all this way for the vanished champion? Save your pity, little warlock. Nobody took me. They showed me my page in the ledger - my gifts, my price - and I LIKED the number. So I signed. They pay me in thralls to guard this road. You? You I'd have done for free.",
    "vtext": "[booming, amused] You came all this way... for the VANISHED champion? [laughs] Save your pity, little warlock. Nobody TOOK me. They showed me my page in the ledger. My gifts. My price. [savoring it] And I LIKED the number. So I signed. They pay me in THRALLS to guard this road. [darker] You? [short pause] You I'd have done for FREE." },
  { "id": "e_cp_devour", "slot": "Champ", "who": "THE CHAMP",
    "text": "MORE! Bring me MORE!",
    "vtext": "[roaring] MORE! [heavy breath] Bring me MORE!" },
  { "id": "e_cp_death", "slot": "Champ", "who": "THE CHAMP",
    "text": "Tell Bellow... tell the crowd... they were never going to remember me anyway...",
    "vtext": "[fading, almost laughing] Tell Bellow... tell the crowd... [long pause] [quiet] they were never going to remember me... anyway..." },
  { "id": "w_price", "slot": "Vessia", "who": "VESSIA",
    "text": "Knowledge has a price. Here is yours.",
    "vtext": "[quiet contract] Knowledge has a price. [short pause] Here is yours." },

  # ================= EPILOGUE — VARENHOLM =================
  { "id": "n_coach", "slot": NARR, "who": "NARRATOR",
    "text": "Three days by coach, two changes of horses, one toll bridge where the guard waves her through on the strength of a pit-name. Varenholm: spires, banners, streetlamps with glass in them. And on every post, the same playbill: ONE NIGHT ONLY - THE FIREBIRD OF VARENHOLM.",
    "vtext": "Three days by coach. Two changes of horses. One toll bridge, where the guard waves her through on the strength of a pit-name. [short pause] [brightening] Varenholm. Spires. Banners. Streetlamps with GLASS in them. [pause] And on every post, the same playbill... [showman's relish] ONE NIGHT ONLY. THE FIREBIRD OF VARENHOLM." },
  { "id": "n_firebird", "slot": NARR, "who": "NARRATOR",
    "text": "The hall is full past the fire-marshal's patience. She comes out small - a halfling girl in firebird silks - and the room gets smaller. The dance is all joy and impossible precision, and then the EMOTION arrives: not heard, FELT, washing the tiers like warm water. Two thousand strangers grinning at once, and not one of them asking why.",
    "vtext": "The hall is full past the fire-marshal's patience. [short pause] She comes out SMALL - a halfling girl in firebird silks - and the room gets smaller. The dance is all joy and impossible precision... [wondering] and then the EMOTION arrives. Not heard. FELT. Washing the tiers like warm water. [pause] Two thousand strangers, grinning at once... [quieter] and not one of them asking why." },
  { "id": "n_hum", "slot": NARR, "who": "NARRATOR",
    "text": "Vessia doesn't grin. She knows that hum. She felt it in a vial that cost a wedding ring, in a grey book with numbers next to names. Ember-work - the very grade the wagons roll west for. Somewhere, a ledger already has this dancer's name in it.",
    "vtext": "[low] Vessia doesn't grin. She KNOWS that hum. [short pause] She felt it in a vial that cost a wedding ring. In a grey book, with numbers next to names. [pause] Ember-work. The very grade the wagons roll west for. [long pause] [cold certainty] Somewhere... a ledger already has this dancer's name in it." },
  { "id": "c_flower", "slot": "Firebird", "who": "THE FIREBIRD",
    "text": "You watched the whole show like somebody was going to steal it, love. Here - a flower for the grim one. Come back tomorrow. I'm told I grow on people.",
    "vtext": "[bright, teasing] You watched the whole show like somebody was going to STEAL it, love. [laughs] Here. A flower for the grim one. [warm] Come back tomorrow... I'm told I grow on people." },
  { "id": "n_close", "slot": NARR, "who": "NARRATOR",
    "text": "The coach south leaves at dawn. Varenholm's lamps go gold behind her. One pipeline is ash on the west road, and the web that spun it is already cutting a new one - but tonight, in the Crown Quarter, a dancer takes her third encore. Because the best place to hide from the dark is the absolute center of the light.",
    "vtext": "The coach south leaves at dawn. Varenholm's lamps go gold behind her. [short pause] One pipeline is ash on the west road... and the web that spun it is already cutting a new one. [pause] But tonight, in the Crown Quarter, a dancer takes her third encore. [long pause] [gentle] Because the best place to hide from the dark... is the absolute center of the light." },
  { "id": "w_epilogue", "slot": "Vessia", "who": "VESSIA",
    "text": "I burned one road. They will cut another - collectors always do. And somewhere in the Ashenveil, their ledger still keeps my page: my name, my gifts, and a price I intend to make them regret. Let the hand that writes come to collect. I will teach it a better trade.",
    "vtext": "[low, unhurried] I burned ONE road. They will cut another. Collectors always do. [long pause] And somewhere in the Ashenveil... their ledger still keeps my page. My name. My gifts. And a price I intend to make them REGRET. [dark amusement] Let the hand that writes... come to collect. [silken] I will teach it a better trade." },

  # ================= TSUBAKI'S ROAD (2026-08-08) =================
  { "id": "k_bio", "slot": NARR, "who": "NARRATOR",
    "text": "The Ashenveil keeps its best students off the rolls. TSUBAKI, of the Ieyasu school - the Matron's blade, her finest collector, her quietest knife. Karridge burned a pipeline last season, and somebody must write a new one. Victory, she would tell you, is simply her nature.",
    "vtext": "[measured] The Ashenveil keeps its best students... off the rolls. [short pause] TSUBAKI. Of the Ieyasu school. The Matron's blade. Her finest collector. Her quietest knife. [pause] Karridge burned a pipeline last season... and somebody must write a new one. [dry] Victory, she would tell you... is simply her nature." },
  { "id": "k_orders", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "Three tasks, then. Rebuild the route. Find the arsonist's trail. And mark every gift in this city worth a page. Consider it written, my Lady.",
    "vtext": "[calm, reading] Three tasks, then. [short pause] Rebuild the route. Find the arsonist's trail. And mark every gift in this city... worth a page. [paper burning] [soft] Consider it written, my Lady." },
  { "id": "k_boss1", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "You have been watching the pit for weeks, bowman. So have I. The difference is - nobody hired me to be seen.",
    "vtext": "[level, courteous] You have been watching the pit for weeks, bowman. [short pause] So have I. [quiet steel] The difference is... nobody hired ME to be seen." },
  { "id": "k_out1", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "A mercenary school, hunting us on behalf of grieving families. Honest work. I almost regret what comes next.",
    "vtext": "[thoughtful] A mercenary school... hunting us on behalf of grieving families. [pause] Honest work. [quieter] I almost regret what comes next." },
  { "id": "k_silver", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "Five silver, innkeeper. A bargain. Where I studied, rumors are paid for in teeth.",
    "vtext": "[polite] Five silver, innkeeper. A bargain. [faint smile] Where I studied... rumors are paid for in teeth." },
  { "id": "k_file", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "Dance, little Firebird. Burn bright. The Matron pays double for the ones who glow.",
    "vtext": "[soft, watching] Dance, little Firebird. Burn bright. [long pause] [quiet, cold] The Matron pays double... for the ones who glow." },
  { "id": "k_price", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "The school teaches: take the stroke that is offered.",
    "vtext": "[serene] The school teaches... take the stroke that is offered." },
  { "id": "k_boss2", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "Step aside, monk. Your school was paid to find the wolves - not to stand in front of one.",
    "vtext": "[even] Step aside, monk. [short pause] Your school was paid to FIND the wolves... [colder] not to stand in front of one." },
  { "id": "k_patience", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "There he is. The assignment beneath every assignment. Not here - not with witnesses. The Lady's design needs him charmed, not warned. Patience: the school's first stroke.",
    "vtext": "[breath catching, hushed] There he is. The assignment... beneath every assignment. [short pause] Not here. Not with witnesses. [composed again] The Lady's design needs him charmed... not warned. [soft] Patience. The school's first stroke." },
  { "id": "k_house", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "The Tempest House. Burn the contracts. Break the banners. Politely. A school with no students hunts no one.",
    "vtext": "[calm survey] The Tempest House. [short pause] Burn the contracts. Break the banners. [faint amusement] Politely. [flat] A school with no students... hunts no one." },
  { "id": "k_boss3", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "Old man. Your storm has taken my couriers, my wagons, and my season. I am here to collect the weather.",
    "vtext": "[respectful, lethal] Old man. Your storm has taken my couriers... my wagons... and my season. [short pause] [silken] I am here to collect the weather." },
  { "id": "n_kcage", "slot": NARR, "who": "NARRATOR",
    "text": "A Tempest supply cage - and inside it, one of her own: a cult courier, trussed, tagged, and left to be questioned at dawn.",
    "vtext": "[grim] A Tempest supply cage. And inside it... one of her own. A cult courier - trussed, tagged, and left to be questioned at dawn." },
  { "id": "k_courier", "slot": "QuarryBoy", "who": "THE COURIER",
    "text": "They knew the route, lady. They knew the MOON. Somebody sold us to the school - somebody inside.",
    "vtext": "[shaken, fast] They knew the route, lady. They knew the MOON. [swallowing] Somebody sold us to the school... [whisper] somebody INSIDE." },
  { "id": "k_go", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "Run to the Ashenveil, little moth. Tell the Lady the road is hers again - and that I will find the tongue that wagged.",
    "vtext": "[quiet command] Run to the Ashenveil, little moth. Tell the Lady the road is hers again... [cold] and that I will find the tongue that wagged." },
  { "id": "n_ashen", "slot": NARR, "who": "NARRATOR",
    "text": "The Ashenveil at dusk: ash fields, the working dead bending in a grey harvest, and an academy whose lower levels are not a metaphor. She walks in unannounced. She is expected anyway.",
    "vtext": "[hushed] The Ashenveil, at dusk. Ash fields. The working dead, bending in a grey harvest. And an academy... whose lower levels are not a metaphor. [pause] She walks in unannounced. [dry] She is expected anyway." },
  { "id": "k_deliver", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "The route breathes. The school is broken. Eleven new pages for the ledger - marked, priced, and patient. And one small vial... from an errand the Lady set me, long ago.",
    "vtext": "[formal report] The route breathes. The school is broken. Eleven new pages for the ledger - marked, priced, and patient. [long pause] [softer] And one small vial... from an errand the Lady set me... long ago." },
  { "id": "n_vial", "slot": NARR, "who": "NARRATOR",
    "text": "The emissary takes the vial the way priests take relics. Somewhere below, a queen who has worn death for centuries will drink a stranger's burning life - and stand a little taller in the morning.",
    "vtext": "[reverent hush] The emissary takes the vial... the way priests take relics. [pause] Somewhere below, a queen who has worn death for centuries... will drink a stranger's burning life. [quiet] And stand a little taller in the morning." },
  { "id": "k_next", "slot": "Tsubaki", "who": "TSUBAKI",
    "text": "And my next assignment. ...A man on the western roads. Green eyes. No escort. My Lady... you honor me.",
    "vtext": "[paper unfolding] And my next assignment. [reading, slowing] ...A man. On the western roads. Green eyes. No escort. [long pause] [a soft laugh, genuinely moved] My Lady... you honor me." },
  { "id": "n_kclose", "slot": NARR, "who": "NARRATOR",
    "text": "She sharpens the katana twice that night, though it does not need it. Somewhere west, an emperor travels alone the way weather travels. The web has a new spider - and the spider is smiling.",
    "vtext": "She sharpens the katana twice that night... though it does not need it. [pause] Somewhere west, an emperor travels alone... the way weather travels. [long pause] [low] The web has a new spider. [quieter] And the spider... is smiling." },
  { "id": "e_nj_intro", "slot": "Shinobi", "who": "TEMPEST SHINOBI",
    "text": "The school sees you, cult-blade.",
    "vtext": "[flat whisper] The school sees you... cult-blade." },
  { "id": "e_ar_intro", "slot": "Longbow", "who": "THE LONGBOW",
    "text": "The Tempest School knows what you are, cultist. Grieving families paid us to find the taken. I believe I'll start with the taker.",
    "vtext": "[dry, measured] The Tempest School knows what you are, cultist. Grieving families paid us to find the taken. [short pause] I believe I'll start... with the taker." },
  { "id": "e_ar_death", "slot": "Longbow", "who": "THE LONGBOW",
    "text": "Report it... the blade... she is already... inside the walls...",
    "vtext": "[failing, urgent] Report it... the blade... [breath] she is already... inside the walls..." },
  { "id": "e_mk_intro", "slot": "IronPalm", "who": "THE IRON PALM",
    "text": "The mountain does not move for weather, and I do not move for killers. The children you sold - I carry their names, cultist. You will hear every one.",
    "vtext": "[deep, serene] The mountain does not move for weather... and I do not move for killers. [pause] The children you sold - I carry their names, cultist. [iron] You will hear... every one." },
  { "id": "e_mk_death", "slot": "IronPalm", "who": "THE IRON PALM",
    "text": "Even stone... wears... someone... remember their names...",
    "vtext": "[fading, peaceful] Even stone... wears... [long breath] someone... remember their names..." },
  { "id": "e_ss_intro", "slot": "StormSage", "who": "THE STORM SAGE",
    "text": "I have taught three generations to stand between the helpless and things like you. Come then, cult-blade. The sky owes you a debt.",
    "vtext": "[rolling, thunderous] I have taught THREE generations to stand between the helpless... and things like you. [pause] Come then, cult-blade. [crackling] The sky owes you a debt." },
  { "id": "e_ss_death", "slot": "StormSage", "who": "THE STORM SAGE",
    "text": "Students... scatter... the storm does not end... it only... changes hands...",
    "vtext": "[guttering] Students... scatter... [breath] the storm does not end... it only... changes hands..." },
]


def main():
    voices = design_voices()
    voices["Narrator"] = CFG["voices"]["Narrator"]
    voices["__KARGOTH__"] = CFG["voices"]["Kargoth"]
    done = skip = fail = 0
    for l in LINES:
        p = OUT / f"{l['id']}.mp3"
        if p.exists(): skip += 1; continue
        vid = voices[l["slot"]]
        body = None
        for attempt in range(5):
            st, body = http("POST", f"/v1/text-to-speech/{vid}?output_format=mp3_44100_128",
                            {"text": l["vtext"], "model_id": MODEL})
            if st == 200: break
            if st in (429, 500, 502, 503, 504): time.sleep(2 ** attempt); continue
            print(f"FAILED {l['id']} ({st}): {body[:160].decode(errors='replace')}"); body = None; break
        else: body = None
        if body is None: fail += 1; continue
        p.write_bytes(body); done += 1
        print(f"[{done}] {l['id']} ({l['slot']}): {l['text'][:52]}...")
    print(f"\ndone={done} skipped={skip} failed={fail} -> {OUT}")
    # emit the subtitle table for voice.js
    tbl = {l["id"]: {"who": l["who"], "text": l["text"]} for l in LINES}
    (HERE / "spire_vo_table.json").write_text(json.dumps(tbl, indent=1))
    print("subtitle table -> build/spire_vo_table.json")

if __name__ == "__main__":
    main()
