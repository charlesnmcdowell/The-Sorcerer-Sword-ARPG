# Varenholm's Gate — Story Campaign Design (campaign3)

Fan-made, non-commercial. Structure follows the Varenholm's Gate research GDD
(`Varenholms_Gate_GDD.docx`); every line of dialogue, every choice tree and every
system hook here is original and written for how Adventurer actually works.

Art is out of scope for this document — see `VARENHOLMS_GATE_ART_REQUIREMENTS.md`.
Voice is out of scope for this pass — see `VARENHOLMS_GATE_VOICE_SCRIPT.md`.

---

## 0. How the player reaches it

- A **Varenholm's Gate** button sits in the town menu beside Campaign / Allegiances,
  visible from the first minute of a new life. No contract gate, no reputation gate.
- The button opens the **Story hall** (`Panels.story`): the current chapter, the next
  quest, the company roster (which companions ride along), the heritage meter, and the
  replay of any epilogue already earned.
- The player experiences the story **one quest at a time** through the ordinary loop:
  hall → departure screen → embark cutscene → encounters → closing cutscene → return →
  debrief beats on the next town arrival. Nothing new in that pipeline; the campaign
  only feeds it data and wraps the same `ADV.Campaign` hooks campaign2 wraps.
- Quests are strictly linear (Q1 → Q14). Branching happens **inside** quests through
  choices, not by unlocking alternate quests, so the hall never has to explain a graph.

## 1. Persistence — the story survives death

Adventurer is permadeath. A story that reset on every death would never be finished,
so progress lives in **`game.meta.c3`** (the cross-life journal file, `adv:meta`):

| field | meaning |
|---|---|
| `stage` | highest quest completed (0–14) |
| `flags` | every choice outcome (`{ vessRecruited:true, floodedEarly:true, ... }`) |
| `heritage` | −3 … +3, rejection vs. embrace of the Morrak bloodline |
| `aff` | affinity per companion id |
| `romance` | companion id the player committed to, or null |
| `allegiance` | `gauntlet` / `consortium` / `thieves` / null |
| `company` | companion ids currently riding along (max 3) |
| `dead` / `gone` | companions removed by story events |
| `ending` | ending id once earned; `epilogue` the rendered card text |
| `beats` | queued town-arrival beats (saved, so a crash never eats a debrief) |

A new life (reincarnation *or* nepotism) resumes at `stage + 1`. The hall says so:
"The road remembers you." Companions are campaign actors, not world NPCs, so they
exist in every life. **Restart** in the hall wipes `meta.c3` after a confirm.

## 2. The silent protagonist and choices

The player never speaks a line the game wrote for them *unless the player picked it*.
A **choice beat** is an ordinary dialogue beat with a `choice` block:

```
{ who:'wren', key:'inn_arrive', choice:{ id:'inn_wren', options:[
   { id:'kind',  text:"We'll manage. Stay close to me.",      aff:{wren:+1}, reply:{who:'wren',key:'inn_kind'} },
   { id:'cold',  text:"Tesfaye is dead. Keep your voice down.", aff:{wren:-1}, reply:{who:'wren',key:'inn_cold'} },
   { id:'dark',  text:"Whoever did this is going to die slowly.", heritage:+1, reply:{who:'wren',key:'inn_dark'} },
]}}
```

Playback (campaign3_ui patches `CampaignUI.playBeat`, additive):
1. The NPC's lines for `key` play in the dialogue box as usual.
2. A pick-one modal lists the options (max 4). The chosen line is then shown in the
   dialogue box **as the player**, silent, portrait and name plate included.
3. Effects apply and save: `set` flags, `aff`, `heritage`, `allegiance`, `recruit`,
   `dismiss`, `kill`, `bypass` (skip this encounter — used for talk-your-way-past),
   `extraEncounter` (insert a fight), `romanceOffer`.
4. The `reply` beat plays. Replies may chain another choice (two-level trees max).

Options can be **gated** (`needs:{flag}`, `needsAff:{who:n}`, `needsHeritage:n`,
`needsCompanion:'ithrel'`). Gated options that fail are hidden, never greyed, so the
player is never shown a door they cannot open.

### How a scene is built (the second rewrite)

Nobody explains the world for its own sake. Every named person wants something and works the scene for it, in their own manner:

- **Companions put their own questions to the people you meet**, gated on who is riding along (`when: { company }` / `companyAll`), and the source answers *them*. Delphine gets the blunt ones (the seal, the ore buyers, Adigun's wax); Winston asks one dry professional thing and stops; Itsuki asks the single thing he cares about; Hiwot needles; Yasemin reads you instead of asking.
- **The people you meet ask you things and read the answer** — Tesfaye ("Has anyone spoken to you today?"), Delphine ("How did he die?"), Yohannes ("Word for word"), Emeka ("How many in chains?"), Adebayo ("Who else has seen these papers?"), Folake ("What did he offer Tesfaye?"), Dawit ("Did he say anything at the end?"), Amara ("Have you ever loved someone who was wrong?"), Kolade ("Did he ever speak of me?"). The options are answers, not interrogations, and the reply reacts to which answer you gave.
- **Two strangers sharing a scene argue with each other first** (Bahadır and Devendra at the ford; Beau and Delphine over the seal) and turn to you second.
- **Finesse over volume**: at most one such exchange per scene, and it has to be what that person would do. Kolade is written for charm and curiosity (the armour is the intimidation, not the man); Folake is a negotiator who pays for what she wants and never gives first; Sanni is courteous and gives nothing away.

## 3. Cast

### Regions and voices

Every named person carries a `region` (campaign3_data.js, `CAMPAIGN3_REGIONS`). The region decides the naming and the way the character talks — word choice, rhythm and idiom, never phonetic spelling, so lines stay readable and TTS keeps them intelligible.

| Region | Real-world flavour | Who |
|---|---|---|
| Lanternhold and the hill keeps | Ethiopian highlands | Tesfaye, Hiwot, Dawit, Abba Gebre, Yohannes |
| Thornbury, the Shore Road, the Wardens | Georgia, USA | Beau, Delphine, Cal Boone, Nib, Cobb, Lurleen, Merle |
| Dunmere and the dwarf clans | Welsh valleys | Gethin Pryce, Dai Morgan |
| The Mirkhollow's Umbra circle | Kenyan | Wanjiru, Mzee Kamau |
| Varenholm's Gate (dukes, Gauntlet, Consortium, temples, thieves) | Nigerian (Yoruba / Igbo) | Kolade Adeyinka, Adigun Adeyinka, Bankole, Rotimi, Adebayo, Olumide, Folasade, Emeka Obi, Segun Marr, Tunde Softfoot, Folake, Baba Olusegun, Sanni, Jelani, Olamide, Femi, Gbenga, Idris, Rasheed, Kemi, Amara |
| The elves of the eastern woods | Japanese | Itsuki, Kaito |
| The deep cities (dark elves) | Arabic | Layla |
| Kalden | Turkish | Bahadır, Yasemin (and the hamster Fındık) |
| Vashk | Indian | Devendra |
| The Umbral Hand | Jamaican | Desmond, Winston |
| The Order of the Dawning Flame | Mexican | Santiago |
| Monsters | invented | Grukhar, Gorruk |

Delphine courts only as a widow (`romanceWhen: { dead: 'dorran' }`): while Beau lives she is a friend and nothing more.


### 3a. Companions (campaign allies — cannot permanently die in combat; walk off when beaten)

| id | name | role / kit | joins | romance | favours ending |
|---|---|---|---|---|---|
| wren | Hiwot | rogue (backstab, smoke_bomb, shadow_rise, aimed_shot) | Q1 end, automatic | — (sister) | — |
| dorran | Beau | fighter/tank (cleave, shield_wall, sunder, taunt) | Q2, with Delphine | — | — |
| selene | Delphine | druid/healer (thorn_skin, mend, beast_shape, grove_raise) | Q2, with Beau | yes | Hero (reject, lawful) |
| vess | Desmond | mage (fire_bolt, spark, ember_lash, wither_touch) | Q2 choice | — | — |
| fennick | Winston | rogue (backstab, venom_fang, smoke_bomb, aimed_shot) | Q2 choice | — | — |
| cassian | Santiago | tank/paladin (shield_wall, taunt, cleanse, stand_fast) | Q2 road choice | yes | Hero (Gauntlet, kill) |
| ithrel | Itsuki | ranger (aimed_shot, snare, marksman, beast_shape) | Q3 choice | yes | Vengeance (kill Kolade) |
| bramm | Bahadır (and Fındık) | ranger/fighter (aimed_shot, cleave, defiant_stand, snare) | Q3 rescue branch | — | — |
| ysolde | Yasemin | mage (frost_touch, rime_grasp, spark, arcane_focus) | Q3 rescue branch | — | — |
| aurelius | Devendra | mage (fire_bolt, ember_lash, spark, pyromaniac) | Q3 alt branch | — | — |
| ilvara | Layla | healer/dark cleric (mend, wither_touch, blood_pact, cleanse) | Q5 choice | yes | Usurper (embrace) |
| faelen | Kaito | ranger/rogue (aimed_shot, backstab, snare, opportunist) | Q6 | yes | Thieves' allegiance |
| nettle | Wanjiru | druid (beast_shape, thorn_skin, grove_raise, wither_touch) | Q6 choice | — | — |
| durnik | Dai Morgan | tank/healer (shield_wall, mend, taunt, regenerate) | Q7 if freed | — | — |
| amara | Amara | fighter/monk (dual_swords, counter_attack, defiant_stand, momentum) | Q13 choice | yes | Mercy (spare Kolade) |

Companion level scales with the quest (tier 1 → level 6, tier 2 → 12, tier 3 → 18,
final → 24) so a level-one player is escorted, not carried.

The **company** is the set of up to three companions who ride along; the player picks
them in the hall. Everyone else waits at the Open Hand Inn. Story beats that need a
specific companion check `company` first and fall back to a "sent word" line.

### 3b. Principal NPCs (never fight beside you)

Tesfaye (mentor, dies Q1) · Yohannes (the sage in the grey cloak) · Gethin Pryce
(mayor of Dunmere) · Emeka Obi (Burning Gauntlet officer) · Duke Adebayo · Dukes Olumide and
Folasade · Dawit and Abba Gebre (keepers of Lanternhold) · Cal Boone (captive Warden)
· Tunde Softfoot (thieves' guild) · Folake (Kolade's mistress) · Rasheed and Kemi
(Kolade's assassins) · Baba Olusegun (Kolade's tutor).

### 3c. Antagonists (bosses)

| quest | boss | what they are |
|---|---|---|
| Q2 | Merle | hired mage-assassin; drops the first bounty notice |
| Q3 | Lurleen | second assassin, in Dunmere |
| Q4 | Grukhar | half-orc priest of Veylan poisoning the ore |
| Q5 | Gorruk | ogre-mage bandit lord (escapes — returns Q13) |
| Q6 | Mzee Kamau / spider queen | Umbra archdruid (or Silksa if you side with the druids) |
| Q7 | Olamide | Consortium mage running the Mirkhollow mine |
| Q8 | Nine Lanterns doppelgangers | the shape-thieves in the trading house |
| Q9 | Consortium tower guard captain | the top floor |
| Q10 | Gbenga | Kolade's assassin in the catacombs; doppelganger family |
| Q11 | Rasheed & Kemi · Idris | the false healer, the invitation holders |
| Q12 | Palace ambush | doppelgangers in the coronation hall; Kolade escapes |
| Q13 | Amara · Jelani · Segun Marr · Gorruk | the Undercity gate and the temple approach |
| Q14 | Kolade Adeyinka | the last child of Morrak |

## 4. The fourteen quests

Format: **tier** · encounters · what the player learns · choices (▶ = branch with
lasting effect) · fixed cutscenes. All enemies are `CAMPAIGN_ENEMIES` of faction `gate`.

### Q1 — The Road from Lanternhold (tier 1, 3 enc)
Tesfaye wakes the ward before dawn; two hired knives in the keep; the Griffon Road.
- enc1: Nib (hired knife) — *choice opener*: "Who sent you?" / "Draw." / "Run, and I let you." (bypass, heritage −1)
- enc2: Cobb & a hired knife.
- enc3: night ambush on the road: hired knives with a Consortium mage. **Closing cutscene**: the armoured giant steps out; Tesfaye refuses to hand the ward over; Tesfaye dies (death beat, red flash). Kolade's first line.
- Arrival beats: Hiwot catches up (she followed). ▶ *inn_wren* sets tone with Hiwot (aff). Hiwot joins the company.

### Q2 — The Open Hand (tier 1, 3 enc)
The letter says: the Open Hand Inn, ask for Beau and Delphine.
- Departure: ▶ *road_pair* — Desmond and Winston offer to travel together (recruit both / refuse; recruiting: heritage +0, Delphine aff −1 later).
- enc1: wolves on the Shore Road (beast).
- enc2: ▶ *road_cassian* — a squire, Santiago, is hunting the wolves; join forces (recruit) or wave him off. Santiago will not stay in a company that keeps Desmond and Winston (he leaves at Q5 if they are still there).
- enc3: **Merle** on the inn steps (boss). Closing: the bounty notice — someone has put a price on the ward.
- Arrival: Beau and Delphine join. ▶ *selene_letter* — what to tell them about Tesfaye (aff).

### Q3 — South to Dunmere (tier 1, 3 enc)
Thornbury, the road south, the gnoll fortress.
- Departure: ▶ *thornbury_ithrel* — Itsuki, an elf hunting the bandit lord Gorruk, asks to ride along (recruit / refuse).
- enc1: **Lurleen** in the Dunmere inn (assassin, mini).
- enc2: ▶ *bramm_or_aurelius* — Bahadır begs help freeing his charge Yasemin from the gnolls; Devendra offers gold to see her dead. Rescue (enc3 = gnoll fortress, Bahadır + Yasemin join) / take Devendra' coin (enc3 = Bahadır blocks the road; Devendra joins; heritage +1).
- enc3: per branch.
- Arrival: Mayor Gethin Pryce — the mines. ▶ *tollan_fee* — demand pay up front (aff Hiwot +1, Gethin hostile) / accept.

### Q4 — The Dunmere Mines (tier 2, 4 enc)
- enc1–3: tunnel kobolds (goblin art placeholder), a kobold shaman, a collapsed level with a Veylan acolyte.
- enc4: **Grukhar** (boss) + acolytes. ▶ *grukhar_plea* before the fight: he offers the letters for his life. Take the letters and let him go (bypass, Itsuki aff −1) / kill him (letters recovered anyway).
- Closing: the letters name Femi in Thornbury and a "Gorruk". **Dream 1** on arrival: Tesfaye's voice, a stone throne. ▶ *dream1* — reject (heritage −1, gain Cure) / embrace (heritage +1, gain Drain).

### Q5 — The Bandit Camp (tier 2, 4 enc)
- Departure: **Yohannes** shows himself — Tesfaye's friend; points north.
- enc1: ▶ *verlan* — Femi at Hollister's Inn: beat it out of him (fight) / pay him (bypass, −50g) / Hiwot picks his pocket (needs Hiwot in company, bypass).
- enc2: Holloway Vale — ▶ *ilvara_patrol*: a Burning Gauntlet patrol has a dark-elf cleric at sword-point. Defend her (fight the patrol; Layla joins; Santiago leaves; allegiance-gauntlet later costs +1 encounter) / walk on (Santiago aff +1) / hand her over for the bounty (heritage +1, 100g).
- enc3: the camp — ▶ *camp_entry*: pose as recruits (needs Desmond or Winston; bypass enc3) / go in quiet (needs Hiwot or Kaito... Hiwot; bypass) / storm the gate (fight Frostbite hobgoblins).
- enc4: Gorruk's tent — Cal Boone chained, the chest of letters. **Gorruk** escapes at half health (scripted: he is `campaignExit` on the enemy side — he walks off; the game treats it as a win). ▶ *gorruk_tent* if Itsuki is in the company: let Itsuki take the shot (Gorruk dies here, Itsuki aff +2, no Q13 rematch) / hold him back (Gorruk escapes; Itsuki aff −2, leaves the company if aff < 0).
- Closing: the letters name the Iron Consortium and a mage, Olamide, in the Mirkhollow.

### Q6 — Mirkhollow (tier 2, 4 enc)
- enc1: spider nest — ▶ *faelen* — Kaito is trapped in web, wants the wyvern bounty; free him (joins) / leave him (heritage +1).
- enc2: ▶ *druids* — Wanjiru and the Umbra druids bar the path. Talk (needs Delphine or heritage ≤ 0: bypass, Wanjiru joins) / fight (Mzee Kamau as mini).
- enc3: wyverns.
- enc4: Kestrel's mercenaries at the mine gate.
- Arrival: Delphine on the forest. ▶ *selene_fire* first romance-adjacent beat (aff).

### Q7 — The Iron Mine (tier 2, 5 enc)
- enc1–2: Consortium guards, slave drivers.
- enc3: ▶ *durnik* — Dai Morgan in the cage: free him (joins; he explains the flood valve) / leave him.
- enc4: **Olamide** (boss).
- ▶ *flood* (closing choice): Beau has gone below to bring the slaves up. Open the valve now (mine drowned; **Beau dies**; slaves die; Delphine aff −3, heritage +1) / wait for Beau (extra encounter: Consortium reinforcements; everyone lives; Delphine aff +1).
- enc5 (conditional): reinforcements.
- Closing: Olamide's papers name the Consortium's leaders in Varenholm's Gate. Road to the city opens. **Dream 2** on arrival ▶ *dream2*.
- ▶ *vess_papers* on arrival (if Desmond & Winston recruited): they want the papers for the Umbral Hand. Give them (they stay; Delphine aff −1) / refuse (they leave; return as enemies in Q9).

### Q8 — Varenholm's Gate (tier 3, 4 enc)
- Departure: Serpent's Span, the checkpoint; Emeka Obi hires the company.
- enc1: the sewers — ogre-mage placeholder (troll art) with carrion things.
- enc2: Nine Lanterns trading house — ▶ *lanterns_door*: bluff the doorman (needs Hiwot/Kaito/Winston; bypass) / force it.
- enc3–4: doppelgangers wearing the merchants' faces; the doppelganger master.
- Arrival: Duke Adebayo receives the company. ▶ *halvard_terms* — serve for the city (allegiance leaning gauntlet, aff Santiago/Delphine +1) / serve for pay (Hiwot +1) / ask what Adebayo knows about the bloodline (heritage flag `askedHalvard`).

### Q9 — The Consortium Tower (tier 3, 4 enc)
- Departure: Adebayo's plan — enter as a mercenary applicant.
- enc1: ▶ *tower_lobby* — talk past the clerk (bypass; needs no Consortium-hostile flag) / fight.
- enc2: the counting floor — (if Desmond & Winston were refused at Q7: **they** are the guards here).
- enc3: **Folake**'s floor — ▶ *lysandra*: she offers a bargain (allegiance:consortium available later; heritage flag) / arrest her / kill her (heritage +1).
- enc4: the top floor guard captain and mages. Closing: the leaders have gone to Lanternhold. Adebayo gives the book of admission.
- Arrival: **romance closer** — if any romanceable companion has aff ≥ 3, ▶ *romance_pick* lets the player commit (or not). One commitment per playthrough.

### Q10 — Return to Lanternhold (tier 3, 5 enc)
- Departure: **Sanni** offers a ring and a hint. ▶ *sarn_ring* — take it (flag `sarnRing`) / refuse.
- enc1: the reading rooms — Consortium bodyguards.
- ▶ *maddox* (opener enc2): Adigun Adeyinka, Bankole, Rotimi at the summit. Kill them (fight; heritage +1) / let them talk (bypass — they are murdered anyway that night, offscreen).
- Cutscene: Dawit gives the ward Tesfaye's letter: **you are a child of Morrak**. Arrest. Escape into the catacombs.
- enc3: Gbenga and his knives.
- enc4: ▶ *catacomb_wren* — a doppelganger wearing Hiwot's face (or Tesfaye's if Hiwot is not in company). Strike first (Hiwot injured, `wrenHurt`: she leaves the company until Q13) / ask the question only Hiwot knows (she stays; aff +2).
- enc5: phase spiders and the ghouls at the exit.
- Arrival: **Dream 3** ▶ *dream3*. The **villain reveal** card: Sanni was Kolade.

### Q11 — The Hunted City (tier 3, 4 enc)
Wanted posters; Emeka Obi is dead; Segun Marr commands the Gauntlet.
- Departure: ▶ *allegiance* — three doors into the palace: **Adebayo** (find and cure him — lawful), **Folake** (needs flag `lysandraBargain` — she trades the invitation for Kolade's head and the Consortium), **Tunde Softfoot** (thieves — a debt to be repaid later). Sets `allegiance`.
- enc1: Gauntlet patrol (or bypass if allegiance gauntlet and `askedHalvard`).
- enc2: **Idris**, the false healer, at Adebayo's bedside (doppelganger).
- enc3: **Amara** on the docks — ▶ *amara_docks*: she asks the ward to stop Kolade without killing him. Promise (flag `promisedAmara`, aff Amara +2) / refuse / lie (heritage +1).
- enc4: **Rasheed & Kemi** in the Undervault (invitations).

### Q12 — The Coronation (tier 3, 3 enc)
- Departure: the palace steps; the company in borrowed clothes.
- enc1: doppelganger guards in the hall — ▶ *dukes*: protect Duke Olumide first / protect Duke Folasade first / go for Kolade (both dukes survive only if a tank or healer is in the company; else one dies: flag `dukeDead`).
- enc2: the ambush proper.
- Cutscene: the ward presents the evidence; Kolade's mask comes off; Baba Olusegun pulls him out. ▶ *korvath_face* — the ward's first words to their brother (aff/heritage).
- enc3: Olusegun's rear-guard.
- Arrival: Duke Olumide (or Folasade) gives the way down; if `dukeDead`, the way is Tunde's instead.

### Q13 — The Undercity (tier 3 → boss tier, 5 enc)
- enc1: the thieves' maze (bypass if allegiance thieves).
- enc2: **Amara at the gate** — ▶ *amara_gate*: fight her (she dies) / let her pass (leaves; she pleads at the altar) / "Come with us" (needs `promisedAmara` and aff ≥ 3: she joins).
- enc3: **Jelani** and the cultists.
- enc4: **Gorruk** (if he escaped at Q5) or Consortium remnants.
- enc5: **Segun Marr** and the Gauntlet traitors.

### Q14 — The Temple of Morrak (boss tier, 3 enc)
- enc1–2: cultists, doppelgangers wearing the company's own faces.
- enc3: **Kolade Adeyinka**. Opener: Kolade's speech; ▶ *korvath_last* — the ward's answer.
- Closing ▶ *resolution* (the ending choice), options gated by state:
  - **Kill him.** always.
  - **Let the Gauntlet take him.** needs `allegiance:gauntlet` or `promisedAmara` or Amara in company.
  - **Take his place.** needs `heritage ≥ 2`.
  - **Walk away and leave him to the dark.** needs `heritage ≤ −2`.

## 5. Endings

The ending id is computed from (resolution, heritage, allegiance) and the epilogue card
is assembled from paragraphs:

| id | condition | headline |
|---|---|---|
| hero | kill or gauntlet, heritage ≤ 0 | *The Gate stands. You are its shadow no longer.* |
| monster | kill, heritage ≥ 1 | *The city cheers a thing it should have burned.* |
| usurper | take his place | *The altar has a new keeper.* |
| mercy | gauntlet, any heritage | *Chains, not blood. Amara was right.* |
| ascetic | walk away | *You leave the throne empty, and it lets you.* |

Paragraphs appended in order: allegiance epilogue (3 variants) → companion fates (each
companion present/gone/dead has a line) → romance line (if romanced, and a second line if
the ending is the one they favour) → heritage coda.

After the ending: the hall shows "Epilogue" (replay), the company stays available for
ordinary contracts, and the campaign's gear set **Warden's Gear** is issued.

## 6. Systems summary (what campaign3.js does)

- Wraps `spawnEncounter`, `alliesFor`, `departureBeats`, `banter`, `takeBeats`,
  `onCampaignQuestDone`, `rivalDeathSequence` / `finalOpener` / `afterBossBeats`,
  `lines`, `reset`, exactly as campaign2 does, dispatching on `quest.campaign3`.
- Wraps `Game.currentEncounter` to attach opener beats on any encounter (the base game
  only does it for n === 5) and `Game.finishCombat` to set closing beats.
- Quest object: `{ id:'c3_n', campaign:true, campaign3:true, factionId:'gate', n, tier,
  track:'campaign', payout, enemyLevels, encounters[], cEnc[] }` plus `travelLocation`.
- `C3.bypassEncounter(game)` mirrors `Game.tryVerb`'s success branch.
- `C3.insertEncounter(game, spec)` splices a spec into `cEnc`/`encounters` after the current one.
- Enemy-side scripted exits: a `boss` spec with `escapes:true` marks the actor
  `campaignExit:true` on the enemy side, so the combat engine walks it off at 0 HP
  and the fight still counts as won.
- Companion actors are built per quest at the quest's level and cached on
  `game.__c3actors` (never saved; rebuilt from `meta.c3` on load).
- Titles: none. Gear: `wardens_gear` issued at the ending (needs a `SET_LOOK` entry and
  an `anime_world` SETS entry — the only two edits outside new files, plus the
  `index.html` / `test/harness.js` script lists, the town menu entry, and `package.json`).

## 7. Tests

- `test/campaign3.js` — plays all fourteen quests headlessly through real combat on
  three scripted paths (hero / monster / mercy), asserting every choice applies, every
  companion joins and leaves when it should, every ending resolves, and progress survives
  a reincarnation and a nepotism inheritance.
- `test/campaign3_lines.js` — every beat key referenced by data or code exists, every
  choice reply exists, no unresolved tokens, no duplicate lines per speaker, every option
  text is ≤ 90 characters, every gated option's gate names a real flag or companion.
