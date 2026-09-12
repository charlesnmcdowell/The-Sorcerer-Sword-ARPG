# Varenholm's Gate — Art Requirements

Everything the story campaign needs drawn, in production order. The game runs today on the existing portrait / creature / backdrop systems, so nothing here blocks play; each item replaces a placeholder when it lands.

Formats follow the existing anime pipeline (`assets/anime/v1`, `ANIME_ART_INVENTORY.json`): busts with alpha for characters, side-on sprites for creatures, 1280×760 backdrops for sets, 1280×760 stills for cutscenes.

## 0. Regions — faces, dress and colour

Every named person comes from a region with a real-world flavour, and the busts should show it in face, hair, dress and ornament (the way the dialogue shows it in speech). Keep it respectful and specific: real textiles, real hairstyles, no costume-shop shorthand.

| Region | Flavour | Dress and look cues |
|---|---|---|
| Lanternhold and the hill keeps | Ethiopian highlands | White cotton shawls with coloured borders (netela-style) over library robes; braided or close-cropped hair; silver crosses and scroll-cases as jewellery. |
| Thornbury, the Shore Road and the Wardens' country | Georgia, USA | Southern-frontier practical wear: waxed canvas coats, wide-brim hats, homespun; braids and locs; Wardens add a green sash. |
| Dunmere and the dwarf clans | Welsh valleys | Valley mining clothes: wool flat caps, leather aprons, thick knitted jumpers; dwarves in the same with braided beards and slate-grey ink. |
| The Mirkhollow and the Umbra circle | Kenyan | Forest wear built from beadwork, red-and-black checked cloth, bark and hide; shaved or short-locked hair; ochre body paint for the circle. |
| Varenholm's Gate — dukes, Gauntlet, Consortium, temples, thieves | Nigerian (Yoruba and Igbo) | Grand West-African city dress: agbada and aso-oke wraps for the dukes, gele headwraps, coral beads; the Gauntlet in flame-red tabards over it; the Consortium in dark tailored city coats. |
| The elves of the eastern woods | Japanese | Layered, muted travelling kimono-cut jackets and hakama-cut trousers, lacquered bow-cases, hair tied high; understated, nothing gilded. |
| The deep cities of the dark elves | Arabic | Dark-elf priestess: flowing black and indigo robes with silver-thread calligraphy, a half-veil, kohl; ashen skin, white hair. |
| Kalden, the witch-country beyond the steppe | Turkish | Steppe-witch and ranger: embroidered kaftans, felt caps, evil-eye beads, a wolf-fur collar for Bahadır; Fındık rides on the shoulder. |
| Vashk and its Crimson Wizards | Indian | Crimson Wizard: red silk sherwani-cut robes with gold embroidery, a jewelled turban-pin, rings on every finger. |
| The Umbral Hand | Jamaican | Umbral Hand: sea-faded linen, a red-gold-green sash worn hidden, cropped hair for Winston, long locs for Desmond. |
| The Order of the Dawning Flame (chapter house in the sun-lands) | Mexican | Order squire: white tabard with a sunrise, a rosary of red beads, charro-style stitched leather over plain mail; neat black hair. |
| Monsters | invented | Monsters: no real-world cues. |

## 1. Character busts (47)

One bust each, fixed eye line, one lighting key. Companions also need the three-outfit cycle if the fitting room is kept. "Look" is the placeholder recipe the game draws today; treat it as a brief, not a rule.

| id | Name | Role | From | Look | Who they are |
|---|---|---|---|---|---|
| `amara` | Amara | companion, romanceable | Nigerian (Yoruba and Igbo) | dark brown skin, bun hair, armour, accent colour #7a3a2a | Kolade's lover and sword-hand. A monk of the Gate's fire temples who wants him stopped, not slaughtered. Grave, exact, tired. |
| `bramm` | Bahadır | companion | Turkish | tan / olive skin, buzz hair, hides and leathers, accent colour #6a3a5a | A huge, loud ranger of Kalden with a hamster named Fındık on his shoulder and a witch to protect. Loyal to the bone. |
| `dorran` | Beau | companion | Georgia, USA | brown skin, fringe hair, armour, accent colour #4e5a3a | A Warden fighter from the Shore Road with a stammer he hates and a shield he never puts down. Delphine's husband. |
| `durnik` | Dai Morgan | companion | Welsh valleys | fair skin, bald hair, armour, accent colour #6a5a3a | A dwarf priest whose clan dug the Mirkhollow mine before the Consortium stole it. Slow to anger, impossible to move. |
| `selene` | Delphine | companion, romanceable | Georgia, USA | brown skin, braids hair, hides and leathers, accent colour #3a5a3a | A Warden druid of the Shore Road, Tesfaye's old friend. Blunt, protective, allergic to self-pity. Speaks for the balance of things. |
| `vess` | Desmond | companion | Jamaican | dark brown skin, long hair, robes, accent colour #3a2a4a | An Umbral Hand necromancer who giggles at wounds. Unstable, brilliant, always listening for the Hand. |
| `aurelius` | Devendra | companion | Indian | brown skin, bald hair, robes, accent colour #7a2a2a | A Crimson Wizard of Vashk who narrates his own superiority under his breath. Wants Yasemin dead; wants you useful. |
| `wren_ward` | Hiwot | companion | Ethiopian highlands | brown skin, sidecut hair, travelling clothes, accent colour #b04a8a | Your foster-sister from Lanternhold, raised beside you in the keepers' library. Quick hands, quicker mouth, hides fear behind jokes. |
| `ithrel` | Itsuki | companion, romanceable | Japanese | tan / olive skin, long hair, hides and leathers, accent colour #2f3a2f | An elf ranger of the eastern woods who has hunted the bandit lord Gorruk for a year. Grief made him quiet; the quiet made him precise. |
| `faelen` | Kaito | companion, romanceable | Japanese | tan / olive skin, ponytail hair, hides and leathers, accent colour #5a6a3a | An elf bounty-hunter of the eastern woods who flirts with anything and finishes every job. Cheerful, mercenary, surprisingly loyal. |
| `ilvara` | Layla | companion, romanceable | Arabic | ashen grey skin, long hair, dress, accent colour #2a2438 | A dark-elf priestess of the deep cities, fleeing her own people and a bounty. Contemptuous, curious, thinks mercy is a luxury the strong buy. |
| `cassian` | Santiago | companion, romanceable | Mexican | tan / olive skin, fringe hair, armour, accent colour #d8d2c2 | A squire of the Order of the Dawning Flame, from its chapter house in the sun-lands, on his first errand. Earnest, rigid, secretly terrified of failing. |
| `nettle` | Wanjiru | companion | Kenyan | dark brown skin, locs hair, hides and leathers, accent colour #2a4a2a | An Umbra druid of the Mirkhollow who believes the forest is owed blood. Fierce, literal, no patience for cities. |
| `fennick` | Winston | companion | Jamaican | brown skin, buzz hair, travelling clothes, accent colour #5a4a2a | Desmond's halfling minder. Sour, practical, would sell you for a good boot. Umbral Hand. |
| `ysolde` | Yasemin | companion | Turkish | tan / olive skin, twists hair, robes, accent colour #4a3a6a | A Kalden witch under Bahadır's guard. Formal, watchful, sees the bloodline in you before you do. |
| `korvath` | Kolade Adeyinka (the Armoured) | antagonist | Nigerian (Yoruba and Igbo) | dark brown skin, bald hair, armour, accent colour #1a1a1e | Your half-brother, raised in the Gate by a Consortium merchant. A giant in spiked black plate who believes bloodshed is a ladder. Calm, courteous, absolutely certain. |
| `hadrian` | Abba Gebre | keeper | Ethiopian highlands | brown skin, fringe hair, robes, accent colour #4a4a4a | First Keeper of Lanternhold. Proud of the library and suspicious of everyone who leaves it, you most of all. |
| `ostwin` | Baba Olusegun | tutor | Nigerian (Yoruba and Igbo) | dark brown skin, bald hair, robes, accent colour #3a3a4a | Kolade's tutor in the old prophecies. Dry, doting, the only one who calls Kolade 'my boy'. |
| `cael` | Cal Boone | spy | Georgia, USA | tan / olive skin, buzz hair, travelling clothes, accent colour #4a4a3a | A Warden spy from the Shore Road who was caught. Half-starved, still joking, remembers every name he heard in the tent. |
| `ambrose` | Dawit | keeper | Ethiopian highlands | brown skin, bald hair, robes, accent colour #5a5a5a | A keeper of Lanternhold and Tesfaye's friend. Kind eyes, careful hands, keeps the letter you were never supposed to read. |
| `halvard` | Duke Adebayo | duke | Nigerian (Yoruba and Igbo) | dark brown skin, fringe hair, town suit, accent colour #8a2a2a | Grand Duke and commander of the Burning Gauntlet. Tired, precise, poisoned by the end. |
| `mira` | Duke Folasade | duke | Nigerian (Yoruba and Igbo) | dark brown skin, bun hair, dress, accent colour #6a3a6a | A Grand Duke and a mage. Watches everyone, trusts nobody, and is usually right. |
| `orlan` | Duke Olumide | duke | Nigerian (Yoruba and Igbo) | dark brown skin, buzz hair, town suit, accent colour #3a3a6a | A Grand Duke who was a soldier first and still stands like one. Loud, decent, easily bored. |
| `halloran` | Emeka Obi | officer | Nigerian (Yoruba and Igbo) | dark brown skin, buzz hair, armour, accent colour #8a3a2a | A Burning Gauntlet officer with a burn-scarred jaw. Plain-spoken, fair, dead by the eleventh chapter. |
| `lysandra` | Folake | mistress | Nigerian (Yoruba and Igbo) | dark brown skin, long hair, dress, accent colour #7a2a4a | Kolade's mistress and the Consortium's cleverest survivor. Silk voice, ledger heart, offers a deal in every sentence. |
| `tollan` | Gethin Pryce | mayor | Welsh valleys | fair skin, fringe hair, town suit, accent colour #5a4a3a | Mayor of Dunmere. Sweating, harried, honest enough. Would pay anyone to make the mine problem someone else's. |
| `nib` | Nib | knife | Georgia, USA | tan / olive skin, buzz hair, travelling clothes, accent colour #3a3028 | The first hired knife, a Shore Road man in a road-cloak with a purse to earn. Easy-going about murder; not paid enough to be brave. |
| `sarn` | Sanni | stranger | Nigerian (Yoruba and Igbo) | dark brown skin, hood hair, travelling clothes, accent colour #3a3a3a | A quiet stranger with a ring to give away. The disguise Kolade wears when he wants to watch you choose. |
| `aldric` | Tesfaye | recruiter | Ethiopian highlands | brown skin, long hair, robes, accent colour #5a5a6a | Your foster-father, a retired Warden mage who keeps the library at Lanternhold. Gentle voice, iron patience, a man who has planned for this night for twenty years. |
| `fen` | Tunde Softfoot | thief | Nigerian (Yoruba and Igbo) | dark brown skin, cornrows hair, town suit, accent colour #2a2a2a | The thieves' guild's voice in the Undervault. Soft-spoken, keeps ledgers of favours, never forgets a debt. |
| `torvald` | Yohannes | sage | Ethiopian highlands | brown skin, long hair, robes, accent colour #4a4a5a | The sage in the grey cloak, a hill-man of the old highland school. Old beyond reason, amused by everything, tells you exactly as much as he decides you can carry. |
| `maddox` | Adigun Adeyinka | boss | Nigerian (Yoruba and Igbo) | dark brown skin, fringe hair, town suit, accent colour #2a2a3a | Head of the Iron Consortium's Gate office and Kolade's foster-father. A merchant who thinks he is still in charge. |
| `vask` | Bankole | boss | Nigerian (Yoruba and Igbo) | brown skin, buzz hair, town suit, accent colour #3a2a2a | A Consortium leader; Adigun's partner. Louder than he is clever. |
| `verlan` | Femi | boss | Nigerian (Yoruba and Igbo) | dark brown skin, fringe hair, town suit, accent colour #5a3a5a | The Consortium's courier in Thornbury, a city man posing as a wine merchant. Sweats when questioned, folds when paid. |
| `grell` | Gbenga | boss | Nigerian (Yoruba and Igbo) | dark brown skin, buzz hair, travelling clothes, accent colour #2a2a2a | Kolade's best knife, sent into the catacombs to finish it. Professional, bored, unbothered by tombs. |
| `gorruk` | Gorruk (the Bandit Lord) | boss | invented | ashen grey skin, long hair, armour, accent colour #4a3a2a | An ogre-mage who runs the bandit companies for the Consortium. Cruel for sport, cowardly when it counts. |
| `grukhar` | Grukhar | boss | invented | ashen grey skin, bald hair, robes, accent colour #3a3a2a | A half-orc priest of Veylan poisoning the Dunmere ore for pay he has not been paid. Bitter, frightened, dangerous. |
| `idris` | Idris | boss | Nigerian (Yoruba and Igbo) | dark brown skin, fringe hair, robes, accent colour #4a4a5a | The 'healer' at Duke Adebayo's bedside. A doppelganger wearing a physician. |
| `jarem` | Jelani | boss | Nigerian (Yoruba and Igbo) | dark brown skin, bald hair, robes, accent colour #5a3a2a | Kolade's court mage. Serves because Kolade is winning; would serve anyone who was. |
| `kessa` | Kemi | boss | Nigerian (Yoruba and Igbo) | dark brown skin, bun hair, dress, accent colour #3a2a5a | The other half. Quiet, a mage, the one who actually plans. |
| `lessa` | Lurleen | boss | Georgia, USA | brown skin, ponytail hair, travelling clothes, accent colour #3a2a3a | A knife for hire from the Shore Road who takes her work personally. Smiles when she is losing. |
| `morwin` | Merle | boss | Georgia, USA | fair skin, fringe hair, robes, accent colour #4a2a2a | A hired mage-assassin from the Thornbury country with a bounty notice in his coat. Talks too much before he casts. |
| `thornwise` | Mzee Kamau (Archdruid) | boss | Kenyan | dark brown skin, long hair, hides and leathers, accent colour #2a4a2a | The Umbra archdruid of the Mirkhollow. Believes every axe-holder deserves a root through the chest. |
| `malvane` | Olamide | boss | Nigerian (Yoruba and Igbo) | dark brown skin, fringe hair, robes, accent colour #2a3a5a | The Consortium mage running the Mirkhollow mine. Fussy, meticulous, keeps the slaves' names in a ledger. |
| `ravel` | Rasheed | boss | Nigerian (Yoruba and Igbo) | dark brown skin, long hair, town suit, accent colour #5a2a3a | Half of Kolade's pet assassins. Loud, vain, deadly with two blades. |
| `rennick` | Rotimi | boss | Nigerian (Yoruba and Igbo) | dark brown skin, bald hair, town suit, accent colour #2a3a3a | A Consortium leader; the accountant. Would like to survive this meeting. |
| `lucan` | Segun Marr | boss | Nigerian (Yoruba and Igbo) | dark brown skin, fringe hair, armour, accent colour #7a3a2a | The Burning Gauntlet officer who sold the company to Kolade. Commands it now. Sneers to hide the shame. |

Special notes: Kolade needs two states — helmeted (Q1, Q12 reveal moment) and bare-faced (Q12 onward; must read as the player's sibling, so keep the face generic enough to pair with any player slot). Sanni is Kolade in a hood: same build, hidden face. Amara has an armoured and an unarmoured (docks) state. Tesfaye appears alive (Q1), as a doppelganger (Q10) and as a dream voice — one bust serves all three.

## 2. Enemy types (24)

Each type carries three skins (name + tint) that the spawner picks at random; a single sprite recoloured is enough.

| id | Name | Kind | Current placeholder | Skins |
|---|---|---|---|---|
| `hired_knife` | Hired Knife | human | bandit | Road Cloak, Ash Cloak, Wet Cloak |
| `gate_bandit` | Road Bandit | human | bandit | Frostbite, Ashtalon, Freeblade |
| `bandit_archer` | Bandit Archer | human | bandit | Treeline, Ridge, Ford |
| `hob_sergeant` | Hobgoblin Sergeant | human | orc | Frostbite Company, Ashtalon Company, Deserter |
| `consortium_guard` | Consortium Guard | human | plated_sentinel | Iron Livery, Black Livery, Mine Detail |
| `consortium_mage` | Consortium Mage | human | hedge_mage | Ledger Cowl, Seal Cowl, Ash Cowl |
| `slave_driver` | Slave Driver | human | bandit | Whip Hand, Chain Hand, Lamp Hand |
| `veylan_acolyte` | Acolyte of Veylan | human | grave_acolyte | Black Sun, Bone Cowl, Rust Cowl |
| `umbra_druid` | Umbra Druid | human | hedge_mage | Moss Robe, Bark Robe, Fern Robe |
| `gauntlet_soldier` | Burning Gauntlet Soldier | human | plated_sentinel | Flame Tabard, Ash Tabard, Night Watch |
| `gauntlet_traitor` | Gauntlet Turncoat | human | plated_sentinel | Marr's Own, Bought Blade, Late Loyalty |
| `morrak_cultist` | Cultist of Morrak | human | grave_acolyte | Blood Cowl, Skull Cowl, Ash Cowl |
| `palace_doppelganger` | Palace Guard | human | plated_sentinel | Ducal Livery, Hall Livery, Gate Livery |
| `tomb_ghoul` | Tomb Ghoul | human | grave_acolyte | Dust, Wrapped, Split |
| `road_wolf` | Road Wolf | beast | dire_wolf | Grey, Black, Scarred |
| `tunnel_kobold` | Tunnel Kobold | beast | goblin | Pick Team, Lamp Team, Poison Team |
| `kobold_shaman` | Kobold Shaman | beast | goblin | Bone Mask, Ash Mask, Ore Mask |
| `gnoll_raider` | Gnoll Raider | beast | hound | Yellow, Brindle, Grey |
| `web_spider` | Giant Spider | beast | spider | Web-Black, Bark, Bone |
| `wyvern` | Wyvern | beast | drake | Green, Brown, Grey |
| `sewer_crawler` | Sewer Crawler | beast | beetle | Wet, Pale, Oil |
| `sewer_ogre` | Sewer Ogre | beast | troll | Green, Grey, Scab |
| `phase_spider` | Phase Spider | beast | spider | Blue, Violet, Pale |
| `shadow_double` | Shape-Thief | human | shadow | Wearing a Face, Between Faces, Half-Turned |

Placeholders worth replacing first: **tunnel_kobold / kobold_shaman** (drawn as goblins today), **gnoll_raider** (drawn as a hound), **wyvern** (drake), **sewer_ogre** (troll), **shadow_double / palace_doppelganger** (a shape-thief should look like a person whose face is slightly wrong, not a shadow).

## 3. Named bosses and mini-bosses (19 minis)

Minis reuse their base enemy sprite with a distinguishing element; the named bosses use their character bust in the dialogue box and their base kit sprite in the fight.

| id | Name | Based on | Count |
|---|---|---|---|
| `nib` | Nib | hired_knife | 1 |
| `cobb` | Cobb | hired_knife | 1 |
| `kobold_chief` | Kobold Chief | kobold_shaman | 1 |
| `gnoll_warleader` | Snarl, Gnoll Warleader | gnoll_raider | 1 |
| `verlan` | Femi | consortium_mage | 1 |
| `skarn` | Skarn Maul | hob_sergeant | 1 |
| `hroth` | Hroth Ironbark | hob_sergeant | 1 |
| `silksa` | Silksa, Spider Queen | web_spider | 1 |
| `kestrel` | Kestrel | consortium_guard | 1 |
| `wyvern_matriarch` | Wyvern Matriarch | wyvern | 1 |
| `sewer_ogre_mage` | The Ogre Under the Docks | sewer_ogre | 1 |
| `lantern_master` | The Master of Lanterns | shadow_double | 1 |
| `tower_captain` | Captain of the Tower | consortium_guard | 1 |
| `family_double` | A Face You Know | shadow_double | 2 |
| `hall_doubles` | Ducal Guard | palace_doppelganger | 2 |
| `bought_sergeants` | Marr's Sergeants | gauntlet_traitor | 2 |
| `altar_keepers` | Keepers of the Altar | morrak_cultist | 2 |
| `your_own_faces` | Your Own Faces | shadow_double | 3 |
| `umbral_pair` | The Umbral Hand | hired_knife | 2 |

## 4. Set pieces (21 environments)

One backdrop per environment; the encounter labels below tell you which fights happen in it.

1. **Lanternhold — the keep** — Fortified library on a coastal cliff at night: lamplit stone, stacked scroll-cases, a storehouse, priests' quarters. Q1 encounters 1–2, Q10 encounters 1–2.
2. **The Griffon Road at night** — Empty road under bare trees, torches approaching, ditch to one side. Q1 encounter 3 and the death cutscene.
3. **The Shore Road** — Coast road with dunes and wind-bent scrub; wolf country. Q2 encounters 1–2.
4. **The Open Hand Inn** — Walled coaching inn, steps to a heavy door, lanterns. Q2 encounter 3; the story hall backdrop.
5. **Thornbury and Hollister's Inn** — Timbered trading town; a smoky low-beamed inn common room. Q3 departure, Q5 encounter 1.
6. **The river crossing and the gnoll fortress** — Ford through a brown river; a hill fort of sharpened stakes and bones. Q3 encounters 2–3.
7. **Dunmere** — Poor mining town on a border: temple of Aegis, garrison, a square with a well. Q3 arrival, Q4 debrief.
8. **The Dunmere Mines** — Four descending levels: timber-shored tunnels, a flooded level, a chamber with a black altar. Q4.
9. **Holloway Vale** — Steep green valley road, a Burning Gauntlet patrol camp. Q5 encounter 2.
10. **The bandit camp** — Palisade in the Gnashing Wood, tents, a chained prisoner in the big tent. Q5 encounters 3–4.
11. **The Mirkhollow** — Old-growth forest: a spider nest of white web, a druid grove ringed with standing stones, wyvern cliffs. Q6 encounters 1–3.
12. **The Iron Mine** — Consortium mine: iron gate, cages, a mage's study with ledgers, a valve room with a great wheel and black water. Q6 encounter 4, Q7.
13. **Serpent's Span and the city gate** — Fortified bridge over a wide river; the city beyond. Q8 departure.
14. **Varenholm's Gate — sewers** — Brick vaults under the docks, running water, dwarven stonework. Q8 encounter 1.
15. **The Nine Lanterns trading house** — Rich merchant house: nine lanterns over the door, a counting room, an upper office. Q8 encounters 2–4.
16. **The Ducal Palace** — Great hall with a dais, banners of the Four; Adebayo's sick-room; the palace steps. Q8 arrival, Q11 encounter 2, Q12.
17. **The Consortium Tower** — Six-floor tower: marble lobby with a clerk, counting floor, a silk-hung private floor, a top floor of locked ledgers. Q9.
18. **The Lanternhold catacombs** — Tombs under the keep, a crypt of faces, a passage that opens onto the shore. Q10 encounters 3–5.
19. **The hunted city** — Wanted posters on wet walls, the docks at dusk, the Undervault (a thieves' cellar-market). Q11.
20. **The Undercity** — A buried older city: collapsed streets, a gate held by one woman, temple steps. Q13.
21. **The Temple of Morrak** — Black stone sanctum still swept and lit, a hall of mirrors, an altar shaped like a throne. Q14.

### Encounter list by quest (for reference)

- **Q1 The Road from Lanternhold** (Prologue): The storehouse · The priests' quarters · The Griffon Road, after dark
- **Q2 The Open Hand** (Chapter 1): The Shore Road · The wolf den · The steps of the Open Hand
- **Q3 South to Dunmere** (Chapter 2): The Dunmere inn · The river crossing · The gnoll fortress
- **Q4 The Dunmere Mines** (Chapter 2): The first level · The flooded level · The third level · Grukhar's chamber
- **Q5 The Bandit Camp** (Chapter 3): Hollister's Inn · Holloway Vale · The palisade · Gorruk's tent
- **Q6 Mirkhollow** (Chapter 4): The nest · The druid grove · The wyvern cliffs · The mine gate
- **Q7 The Iron Mine** (Chapter 4): The upper works · The cages · The third level · Olamide's study · The valve room
- **Q8 Varenholm's Gate** (Chapter 5): The sewers · The Nine Lanterns door · The counting room · The upper office
- **Q9 The Consortium Tower** (Chapter 5): The lobby · The counting floor · Folake's floor · The top floor
- **Q10 Return to Lanternhold** (Chapter 6): The reading rooms · The summit · The catacombs · The crypt of faces · The way out
- **Q11 The Hunted City** (Chapter 7): The patrol · Adebayo's sick-room · The docks · The Undervault
- **Q12 The Coronation** (Chapter 7): The great hall · The dais · Olusegun's rear-guard
- **Q13 The Undercity** (Chapter 7): The thieves' maze · The gate of the Undercity · The buried street · Gorruk, again · The temple steps
- **Q14 The Temple of Morrak** (Chapter 7): The outer sanctum · The hall of mirrors · The altar

## 5. Cutscene stills (9)

Shown as captions over the dialogue box today; each becomes a full-width still when the art lands.

1. **Tesfaye's death** — Q1 closing. The armoured giant in the torchlight; Tesfaye between him and the ward; the sword going through. Red-flash beat.
2. **The bounty notice** — Q2 closing. Hiwot reading a crumpled notice with an unfamiliar seal.
3. **The dream throne (three states)** — Q4 / Q7 / Q10 arrivals. A stone throne in a field of ash: (1) distant, Tesfaye beside it; (2) nearer, hundreds of figures facing it; (3) close, a man in black armour seated, smiling like a brother.
4. **The valve room** — Q7. Delphine at the great wheel, black water rising, chains heard below.
5. **The letter** — Q10. Dawit sets a sealed letter on a reading-room table; twenty-year-old wax.
6. **The reveal** — Q12. Kolade pulls off a guest's face on the dais; underneath, a man who looks like the player.
7. **The frost ring** — Q12. Baba Olusegun and Kolade vanishing in a ring of frost; the rear-guard left behind.
8. **The altar** — Q14. Kolade seated on the throne-altar with his helmet in his lap; Amara kneeling in ash (variant).
9. **Five ending cards** — One painted card per ending: The Gate Stands / A Thing the City Cheers / The Altar Has a Keeper / Chains, Not Blood / An Empty Throne.

## 6. UI pieces

- Story hall banner (Varenholm's Gate wordmark over the Open Hand Inn).
- Chapter cards: Prologue, Chapter 1–7 — seven title plates used when a chapter's first quest opens.
- The heritage meter: a five-state emblem (starved / resisting / quiet / stirring / awake).
- The choice modal frame: a parchment-style panel for the silent protagonist's options.
- Warden's Gear: the ending reward set, fighter/rogue/healer silhouettes (drawn as the hunter costume today).

## 7. Priority

1. Companion busts (15) and Kolade — they are on screen in every dialogue box.
2. The principal NPC busts (Tesfaye, Delphine's circle, Adebayo, Folake, Amara's two states).
3. Enemy placeholders listed under §2.
4. Set pieces in quest order.
5. Stills and ending cards.
