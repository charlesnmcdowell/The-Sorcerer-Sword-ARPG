# Ninja vs Pirates — Campaign Add-On v0.1

**Add-on specification for the shipped Adventurer RPG.** Self-contained. Second campaign document, same format as the Gaping Maw / Antler / Varenholm add-on.

---

## 0. Document Status — Read First

**The game is built and working. This adds to it.**

Nothing here revisits finished systems. The base architecture — lanes, fixed stats, skill tiers, the relationship graph, permadeath, inheritance, the economy — is correct and stays as it is.

**What this document does:**

- **Adds four factions** with the same shape as the first campaign: gates, a hall, five quests, a recruiter, a rival, a boss, and an antagonist.
- **Adds the Faction War** — four new quest types on the ordinary quest board, with faction-aligned enemies.
- **Adds a god-tier quest line** paying 1000 gold, with two boss encounters and cutscenes.
- **Adds 20 new NPC personalities** to the base game's 40.
- **Extends nothing.** No existing system changes. This is purely additive.

**Where this and the first campaign document disagree, they don't — this follows the same rules.**

---

## 0a. Voice Registry

### New Voices — 24 Unique IDs

| Role | Voice ID |
|---|---|
| **Female goddess** | `t9puW54s29EO0gQK6OMR` |
| **Female matriarch** | `0KlQKzxy6Oee2hYOyHII` |
| **Male god** | `HMvHZWb0ZWSo5Kc5l22D` |
| Female ninja | `m0Fy6FqG3UvYAJ9XxkLC` |
| Male ninja · Asian male | `viRs91T0tmaQFBjKQbJ5` |
| Ninja female recruiter · Asian female | `Dd9rggTUyQrGBAa9A3P7` |
| Ninja female rival | `Hvw50qC2EU36Q5rwuUhg` |
| Ninja female boss | `olrUz8V5WoH80Rnq2JOc` |
| Ninja antagonist | `SW9n4bPps5VYGQPnhdgI` |
| Samurai female · Samurai female rival | `pFSI8w96hzoslLGuDOEe` |
| Samurai male | `Jct0W4WcX77c9yh7tpGo` |
| Samurai male recruiter | `R003ylvhf54dw04Zg81Q` |
| Samurai male boss | `HYfT8byrXEsuxnJuQWLF` |
| Samurai antagonist | `VIPtPJaY9dPaNIMgAKpr` |
| Naval antagonist | `C34VRFVgUY3W0ZIN2NQ5` |
| Pirate male · Pirate male recruiter | `1csfYuDOypqYwHwYho4k` |
| Pirate female | `ZKzVk98AXguhTaJuCEF3` |
| Pirate male rival | `wfGL3tJehRI3DoxtsLta` |
| Pirate female boss | `Kexq2CdSapm18RMWwloT` |
| Pirate antagonist · Naval male boss | `KlRlfft1voWiT2Df8TSX` |
| Naval male · Naval recruiter · European male | `u90bBWOV7gURzqtsMjBN` |
| Naval female · European female | `RewGaHimUnPqdkKgE5mb` |
| Naval female rival | `fazkFGFrALkyPulDqqzW` |

### Collisions — Both Resolved

**RESOLVED — `KlRlfft1voWiT2Df8TSX` is one character, not two.**

The ID is listed for both the pirate antagonist and the naval boss. **That is now deliberate: they are the same man.**

**ADMIRAL AUGUST VANE-KESSLER** commands the naval faction. If the player enlists, he is their boss and fights beside them at quest 5. If the player turns pirate, he is the antagonist hunting them, and they kill him at quest 5.

**The same man, on the other side of the same war.** No extra voice, no extra writing, and the single best piece of cross-faction texture in the document.

**RESOLVED — the two antagonists have separate voices.**

`C34VRFVgUY3W0ZIN2NQ5` was originally listed for both the samurai antagonist and the naval antagonist. One is a woman avenging her murdered family; the other is a charming male pirate fleet leader. They now split:

- `VIPtPJaY9dPaNIMgAKpr` → **THE WIDOW, KIRA** *(samurai antagonist)*
- `C34VRFVgUY3W0ZIN2NQ5` → **THE TIDE-TAKER, DORIAN ASH** *(naval antagonist)*

**RESOLVED — the matriarch has her own voice.**

`XTLPrXXVrKner0uxnIO3` was originally listed for the matriarch role, but it is already assigned to **F08 Sorrowful** in the base game's 40 personalities. Sharing it would have made matriarchs and Sorrowful NPCs indistinguishable.

Matriarchs now use `0KlQKzxy6Oee2hYOyHII`. **No voice in this document overlaps the base game's 40.**

### Gods and Demigods

**The three god-tier voices are not personalities.** They are assigned by trait, not by seeding.

| Voice | Used by |
|---|---|
| `t9puW54s29EO0gQK6OMR` | **THE PALE MOTHER** (§8), and any generated female NPC born with the **Demigod** trait |
| `HMvHZWb0ZWSo5Kc5l22D` | **THE DROWNED KING** (§8), and any generated male NPC born with the **Demigod** trait |
| `0KlQKzxy6Oee2hYOyHII` | Matriarch NPCs — high-rank women who have borne children and hold an estate |

**Demigod NPCs already exist** — Hiro's bloodline passes the trait to every direct child, and those children mature into ordinary roster NPCs. Until now they used a normal personality voice. **They now use the god voice matching their sex**, which makes a demigod audibly different the first time one speaks.

**They keep their rolled personality's lines.** Only the voice changes. A demigod Sultry NPC says Sultry's lines in the goddess voice, which is exactly the unsettling effect wanted.

---

## 1. The Four Factions

**Two wars, four sides.** The east has ninjas against samurai; the sea has pirates against the navy. Neither war knows the other exists, and the player can only ever join one faction per life.

| Faction | Alignment | Gate | Opposed by |
|---|---|---|---|
| **The Hollow Bell** — ninja clan | **Neutral** | Any alignment | The Green-Eyed |
| **The Green-Eyed** — samurai clan | **Legal** | 3 lawful contracts | The Hollow Bell |
| **The Red Tally** — pirate fleet | **Criminal** | 3 criminal contracts | The Admiralty |
| **The Admiralty** — naval military | **Legal** | 3 lawful contracts | The Red Tally |

### Recruitment Priority

First contact after the player's **first contract**, alignment decided by what they just took.

| First contract | Recruiter |
|---|---|
| Criminal | **The Red Tally** |
| Lawful | **The Green-Eyed** or **The Admiralty** |
| Neutral or none | **The Hollow Bell** |

---

## 1a. Alignment Lock — The Hard Rule

**A life has one alignment, and criminal is a one-way door.**

| Rule | Detail |
|---|---|
| **Legal and criminal are incompatible** | A lawfully-aligned character cannot join a criminal faction. Ever. |
| **Criminal is permanent for that life** | The moment a character joins a criminal faction they are criminal until they die. No lawful faction will contact them again, no matter how many lawful contracts they take afterward. |
| **Neutral is compatible with everything** | The Hollow Bell can be joined alongside a legal faction or a criminal one. |
| **Death resets it** | Reincarnation and the nepotism heir both start with no alignment lock. A new life may go the other way. |

**This is what makes the criminal path a decision rather than a menu.** Joining the Red Tally is not "I did a crime" — it is closing two of the four factions for the rest of that character's life.

---

## 1b. Multiple Factions Per Life

**Unlike the first campaign, these four are not mutually exclusive.** A single character can join more than one, provided alignment permits.

| Combination | Factions held | Legal? |
|---|---|---|
| Hollow Bell alone | 1 | Yes — neutral |
| Hollow Bell + Green-Eyed + Admiralty | **3** | Yes — neutral plus both legal |
| Green-Eyed + Admiralty | 2 | Yes — both legal |
| Hollow Bell + Red Tally | 2 | Criminal for life |
| Red Tally alone | 1 | Criminal for life |

**Three factions in one life is the maximum**, and it requires staying lawful.

**Each faction runs its own five quests, its own hall, its own titles, and its own gear set.** A character holding three faction titles at advanced has a tier lift on six archetypes, which is the strongest a character can get and takes fifteen quests to reach.

**The first campaign's three factions are unchanged.** The Maw, the Antler, and Varenholm remain one-per-life as already implemented. A character may hold **one** of those and any alignment-compatible combination of these four.

---


---

## 1c. Campaigns and Death

**The two death paths do opposite things to a campaign in progress.**

| Death path | A campaign you started |
|---|---|
| **Reincarnation** | **Closed forever.** Generations passed. That story is over, finished or not. |
| **Nepotism** | **Resumed.** The heir picks it up at the quest the parent died on. |

### Reincarnation Closes It

**Accepting a recruiter marks that campaign consumed**, and reincarnation locks the new character out of it permanently — completed or abandoned at quest 2.

**Campaigns nobody in the line has touched remain open.** Their recruiters have never met this bloodline.

**Abandoning counts.** A character who accepts the Red Tally and dies at quest 3 without an heir has consumed the Red Tally. Hallow does not offer twice.

### Nepotism Continues It

**The heir resumes exactly where the parent stopped.** Same faction, same quest number, same hall.

**Why it reads naturally:** the heir already carries **"Son of"** or **"Daughter of"** in their name (base GDD §7). Every campaign character addresses them by it, so the player never has to be told they are continuing someone else's work — the faction simply keeps calling them by their parent's name and hands them the next contract.

**What carries over:**

| | Inherited |
|---|---|
| **Campaign progress** | The quest number the parent died on |
| **Faction titles earned so far** | Yes — basic, and intermediate if the parent reached quest 2 |
| **The rival's state** | If the parent died before quest 4, the rival is alive and joins the heir. If after, the rival is dead. |
| **Alignment lock** | Yes. An heir resuming a criminal campaign is criminal for their life. |
| **The gear set** | Only if the parent completed quest 5 and vaulted it (base GDD §7). |

**Multiple campaigns in progress all resume.** A lawful parent who died holding three faction memberships passes all three to the heir, at whatever quest each had reached.

### What This Does to the Death Choice

**Nepotism is another life with nothing lost.** Skills, levels, the journal, the vault, and a stat bonus scaled to the parent's rank all carry — and now the campaign does too. It is not a consolation prize for dying; it is a second attempt with every advantage intact.

**Which makes dying mid-campaign the sharpest argument for the nepotism path in the game.**

A character three quests into the Green-Eyed with no spouse loses the campaign permanently. The same character with a wife and a self-sufficient child loses nothing — the heir walks into Takeda's hall and is handed quest four.

**It also makes the world's campaign supply last longer.** A bloodline that keeps producing heirs can work through all seven across generations without ever burning one by dying at the wrong moment.

**Reincarnation remains the reset.** It clears the alignment lock and opens whatever nobody has touched — but everything the line has already started is gone.

---

## 1d. Horizontal Slice — One Completion Unlocks All

**Completing any one of these four campaigns unlocks all 64 skills at the trainer**, permanently, including the factions the player never joined and the ones their alignment forbids.

**A criminal who finishes the Red Tally can buy Green-Eyed katana skills and Admiralty saber skills.** They cannot join those factions, wear their gear, or hold their titles — but the techniques are theirs.

**Why.** The four factions are one slice of content, not four gated tracks. Locking three-quarters of it behind replays that require dying first would mean almost nobody ever sees it. The player who finishes one campaign has earned the whole skill list.

**Gear sets and titles remain faction-locked.** Only skills unlock horizontally.

---

## 2. The Sixteen Campaign Characters

Same rules as the first campaign — outside the relationship graph, no romance, no roster presence, no permadeath, authored scripts rather than seeded personalities.

**Recruiters never fight. Rivals cannot die** until their scripted death at quest 4. **Antagonists exist for two scenes**: the kill in quest 4 and their own death in quest 5.

---

### 2a. THE HOLLOW BELL — Ninja Clan *(neutral)*

*A clan that survived by never being anywhere. They take contracts from anyone and remember every one.*

| Role | Character | Voice |
|---|---|---|
| **Recruiter** | **OBAA-SAN** — an ancient woman running a paper shop, who has recruited for the clan for sixty years and buried most of what she recruited | `Dd9rggTUyQrGBAa9A3P7` |
| **Rival** | **SUZUME** — young, arrogant, the fastest in the clan, treats every contract as a scoring opportunity | `Hvw50qC2EU36Q5rwuUhg` |
| **Boss** | **THE BELL-KEEPER, KAEDE** — clan head, soft-spoken, has personally ordered more deaths than anyone in the city | `olrUz8V5WoH80Rnq2JOc` |
| **Antagonist** | **THE UNQUIET, JIRO** | `SW9n4bPps5VYGQPnhdgI` |

**JIRO'S STORY.** Kaede ordered him killed twenty years ago for a reason nobody living remembers. A necromancer raised him — and his soul refused to leave. **The three quests ran out and he did not decay.** He has been walking ever since, undead and permanent, and he wants the woman who ordered it.

**He is the only undead in the game that True Rest does not resolve**, because he is no longer animated by the working that raised him.

---

### 2b. THE GREEN-EYED — Samurai Clan *(legal)*

*A clan that serves the city's law and considers that service its identity. Rigid, honourable, and responsible for more grief than it admits.*

| Role | Character | Voice |
|---|---|---|
| **Recruiter** | **MASTER TAKEDA** — the clan's instructor, blunt, has failed hundreds and says so | `R003ylvhf54dw04Zg81Q` |
| **Rival** | **AYAME** — the clan's best blade, correct about it, the only woman formally admitted in a generation | `pFSI8w96hzoslLGuDOEe` |
| **Boss** | **LORD ISAMU** — clan head, dignified, entirely certain he has never done anything wrong | `HYfT8byrXEsuxnJuQWLF` |
| **Antagonist** | **THE WIDOW, KIRA** | `VIPtPJaY9dPaNIMgAKpr` |

**KIRA'S STORY.** Lord Isamu's clan destroyed her husband's clan on the city's authority and killed her children doing it. **Women are not admitted to the Green-Eyed.** She trained anyway, in secret, for eleven years, and she is better than Ayame.

She is not hunting the clan. **She is hunting Isamu**, and everyone in front of him is incidental.

---

### 2c. THE RED TALLY — Pirate Fleet *(criminal)*

*A fleet held together by a ledger. Every share is recorded and every crime is a line item.*

| Role | Character | Voice |
|---|---|---|
| **Recruiter** | **QUARTERMASTER HALLOW** — keeps the tally, cheerfully criminal, treats piracy as accounting with weather | `1csfYuDOypqYwHwYho4k` |
| **Rival** | **BEAU CASTELL** — best gun in the fleet, insufferable, genuinely that good | `wfGL3tJehRI3DoxtsLta` |
| **Boss** | **CAPTAIN MERIEL SAINT-CLOUD** — commands the fleet, elegant, has never raised her voice on a deck | `Kexq2CdSapm18RMWwloT` |
| **Antagonist** | **ADMIRAL AUGUST VANE-KESSLER** | `KlRlfft1voWiT2Df8TSX` |

**VANE-KESSLER'S STORY.** A famous captain sent by a foreign empire with one instruction: **make these waters safe for trade.** He is not corrupt, not cruel, and not wrong. He has hanged eleven captains and he will hang Saint-Cloud.

**He is also the Admiralty's boss** (§2d). The same man, from the other side.

---

### 2d. THE ADMIRALTY — Naval Military *(legal)*

*A navy that considers the sea a jurisdiction. Uniformed, funded, and slower than what it hunts.*

| Role | Character | Voice |
|---|---|---|
| **Recruiter** | **BOATSWAIN CRELL** — signs on anyone with hands, has drowned twice, mentions it often | `u90bBWOV7gURzqtsMjBN` |
| **Rival** | **LIEUTENANT ISOLDE FANE** — youngest officer in the fleet, ferociously by-the-book, wants a command | `fazkFGFrALkyPulDqqzW` |
| **Boss** | **ADMIRAL AUGUST VANE-KESSLER** — the same man the Red Tally fears, seen from below | `KlRlfft1voWiT2Df8TSX` |
| **Antagonist** | **THE TIDE-TAKER, DORIAN ASH** | `C34VRFVgUY3W0ZIN2NQ5` |

**DORIAN ASH'S STORY.** A pirate fleet leader plundering the sea lanes and, by every report, unstoppable. Nine engagements, nine losses for the Admiralty.

**He is also extremely charming and knows it**, and he would rather talk to the player than fight them. He compliments Fane by name before he kills her, and means it.

---

### 2e. Vane-Kessler Is One Character

**Written once, used twice.**

| Player joins | He is | Ends |
|---|---|---|
| **The Red Tally** | The antagonist. Kills Beau Castell at quest 4, hunts Saint-Cloud. | The player kills him at quest 5. |
| **The Admiralty** | The boss. Greets the player at the hall, fights beside them at quest 5. | He survives; Dorian Ash dies. |

**His lines are the same man in both.** Courteous to pirates, patient with sailors, immovable about the law. A player who has run both has met him from both directions and heard nothing contradictory.

**A world remembers which happened.** If a previous life killed him, the Admiralty's hall shows a successor and Fane has been promoted — assuming she lived, which depends on whether that life reached quest 4.

---

## 3. Campaign Skills — 64 New Entries

**16 per faction: 8 playstyles × 2 skills.**

**Witness-only during a campaign. All 64 unlock at the trainer on completing any one of them** (§1d) — including the factions the player never joined and the ones their alignment forbids.

**Perks are gold-only and never witnessable**, purchasable from the moment the player joins that faction.

**The weapon is the theme.** Ninja ranged skills throw shuriken; pirates fire guns. Samurai melee is katana work; naval melee is the saber. These should read as different martial traditions doing the same job.

---

### 3a. The Hollow Bell — Shuriken, Smoke, Poison, Silence

| Skill | Type | Effect | Advanced |
|---|---|---|---|
| **Shuriken Fan** | active | Throws three stars across a lane; each applies **Bleed** | **Storm of Iron** |
| **Bell-Silence** | active | Target cannot use interrupts or reactions for 2 rounds | **No Sound At All** |
| **Kunai Line** | active | Ranged hit that pulls the target one lane forward | **Hooked** |
| **Smoke Step** | active | Enter stealth and reposition; next attack cannot be reflected | **Nowhere** |
| **Iron Fan Guard** | active | Guard self; reflected damage uses **Shuriken Fan's** calculation | **Turning Blade** |
| **Chain-and-Weight** | active | Melee strike that prevents the target leaving its lane | **Anchored** |
| **Blood Lotus** | active | Poison that also applies **Withering** while it runs | **Nine Petals** |
| **Paper Charm** | active | Ward one ally; attackers take **Poison** | **Sealed** |
| **Fox Form** | active | Self-buff: evasion up, attacks apply **Poison** | **Nine-Tails** |
| **Crow Sight** | active | Reveal all stealthed enemies and their equipped skills for the battle | **Carrion Watch** |
| **Field Suture** | active | Heal an ally and grant them stealth | **Vanished and Whole** |
| **Breath of the Bell** | active | Heal every ally who has not acted this round | **Tolling** |
| **Hollow Discipline** | perk | Stealth is not broken by taking damage, only by attacking | **The Bell Is Empty** |
| **Fifty Names** | perk | Every enemy killed this life is recorded; damage rises with the count, no cap | **The Long Tally** |
| **Silent Trade** | perk | Encounter verb: **Bribe** — resolves against anyone poorer than you | **Everyone Has A Price** |
| **Sixty Years** | perk | Witnessed actives are learned at level 5 rather than 1 | **Obaa-San's Lesson** |

---

### 3b. The Green-Eyed — Katana, Stance, Discipline, Iaijutsu

| Skill | Type | Effect | Advanced |
|---|---|---|---|
| **Iai Draw** | active | Opening action only. Massive katana damage; ignores all guard effects | **One Motion** |
| **Rising Cut** | active | Melee strike; damage doubles against targets who have not yet acted | **Before the Breath** |
| **Longbow Volley** | active | Ranged; hits every enemy in one lane | **Rain of Arrows** |
| **Measured Shot** | active | Ranged; cannot miss and cannot be reflected | **Certain** |
| **Crossing Guard** | active | Intercept for an adjacent ally; both take half | **Two Blades One Line** |
| **Stone Stance** | active | Immovable for 2 rounds; all damage taken is reflected at full | **Mountain** |
| **Kiai** | active | Shout: all enemies in a lane take **Shock** and act last | **Voice of the Clan** |
| **Ash Ward** | active | Party takes reduced fire and elemental damage | **Cinder Screen** |
| **Bear Stance** | active | Self-buff: damage up, cannot be moved or pulled | **Iron Bear** |
| **Reading the Field** | active | See every enemy's next action for 2 rounds | **Nothing Hidden** |
| **Field Honour** | active | Heal an ally; they cannot be reduced below 1 HP this round | **Sworn Guard** |
| **Clan Blood** | active | Heal every ally for a portion of the damage you have taken this battle | **Debt of Service** |
| **Unbroken Form** | perk | Melee damage rises for every consecutive round you have not moved lanes | **Rooted** |
| **The Clan Watches** | perk | Allies within your lane take reduced damage while you live | **Their Shield** |
| **Standing Order** | perk | Encounter verb: **Command** — resolves against anyone lawfully aligned | **By Authority** |
| **Green Discipline** | perk | You always act first in round one, regardless of Speed | **First Blade** |

---

### 3c. The Red Tally — Guns, Powder, Boarding, Plunder

| Skill | Type | Effect | Advanced |
|---|---|---|---|
| **Flintlock Shot** | active | Heavy single-target ranged damage; **cannot be used twice in a row** — it must be reloaded | **Both Barrels** |
| **Grapeshot** | active | Sprays a lane for reduced damage each; applies **Bleed** | **Full Broadside** |
| **Boarding Hook** | active | Pull an enemy from any lane into your front lane | **Over the Rail** |
| **Cutlass Work** | active | Two melee strikes; the second applies **Exposed** twice | **Butcher's Bill** |
| **Powder Keg** | active | Lane hazard; detonates for heavy **Burning** after 1 round | **Magazine** |
| **Boarding Plate** | active | Guard self; the next enemy to strike you is pulled into your lane | **Come Aboard** |
| **Chain Shot** | active | Ranged; target cannot act next round | **Rigging Down** |
| **Fire Ship** | active | Enemy lane takes **Burning** and their Defence drops while it runs | **Burn Her to the Waterline** |
| **Sea-Dog Form** | active | Self-buff: damage up, immune to being moved | **Old Salt** |
| **Reading the Tally** | active | See every enemy's carried gold and gear for the battle | **Purser's Eye** |
| **Rum Ration** | active | Heal every ally a small amount and clear **Shock** | **Grog** |
| **Surgeon's Saw** | active | Heavy heal on one ally that applies **Bleed** to them | **Rough Mercy** |
| **Shares and Plunder** | perk | Gold from every source increased by 25% | **Captain's Portion** |
| **Powder Discipline** | perk | Reload skills like Flintlock Shot may be used every round | **Never Empty** |
| **Sea Legs** | perk | Cannot be pulled, pushed, or moved between lanes by anything | **Deck-Born** |
| **Black Flag** | perk | Encounter verb: **Intimidate at Sea** — resolves against anyone carrying cargo or coin | **Colours Up** |

---

### 3d. The Admiralty — Saber, Cannon, Formation, Signal

| Skill | Type | Effect | Advanced |
|---|---|---|---|
| **Saber Thrust** | active | Precise melee; ignores a portion of Defence | **Through the Guard** |
| **Riposte Line** | active | Guard self; every attack against you this round is reflected at full | **Parry and Answer** |
| **Volley Fire** | active | The entire party's next attack hits one additional target | **Present Arms** |
| **Ranging Cannon** | active | Ranged; damage rises each consecutive round fired at the same lane | **Found the Range** |
| **Close Order** | active | Your lane cannot be flanked, pulled from, or bypassed for 3 rounds | **Hold Fast** |
| **Signal Flags** | active | One ally acts immediately after you this round | **Fleet Order** |
| **Chain and Bar** | active | Lane-wide; all affected take **Shock** and lose their reactions | **Dismasted** |
| **Flare** | active | Reveals all stealth; enemies revealed take **Burning** | **Star Shell** |
| **Marine Form** | active | Self-buff: Defence up, attacks apply **Exposed** | **Boarding Party** |
| **Chart the Water** | active | See the next encounter's full composition | **Sounded** |
| **Sick Bay** | active | Heal a lane and clear **Bleed** and **Burning** | **Below Decks** |
| **Articles of War** | active | Bind an ally; damage they take is split with you, both heal at encounter end | **Sworn Under Articles** |
| **Naval Discipline** | perk | Party members within your lane cannot be made to act last | **Unshakeable** |
| **King's Commission** | perk | Lawful contracts pay 25% more | **Letters of Marque** |
| **Broadside Doctrine** | perk | Ranged skills hit one additional target in the same lane | **Full Battery** |
| **Colours and Papers** | perk | Encounter verb: **Requisition** — resolves against anyone lawfully aligned or carrying cargo | **By the King's Word** |

---

### 3e. No New Statuses

**All four factions use existing statuses:** Bleed, Poison, Burning, Shock, Withering, and Exposed.

**Deliberate.** The first campaign added four; a second adding four more would make combat unreadable. These factions are differentiated by **weapon, reach, and positioning** — shuriken versus flintlock, katana versus saber — not another layer of debuffs.

---

## 4. Campaign Enemies — 20 New Types

**Five per faction.** Every enemy carries a **5-skill pool and equips 2–3 rolled at spawn**; mini-bosses equip 4–5 including their signature.

**Coverage rule holds:** every *active* in a faction's 16 appears in at least one of that faction's pools. Perks are exempt — they cannot be witnessed.

### Every Enemy Has Three Skins

**Three visual variants per type**, selected at spawn. Since the game is portrait-and-primitive, a skin is a **palette, silhouette, and name variant** — cheap to author, and enough that a player fighting the same type across five quests never sees an identical row.

---

### 4a. Against the Hollow Bell

| Enemy | Skins | Skill pool (5) | Equips |
|---|---|---|---|
| **Bell-Initiate** | Grey Wrap · Bound Sleeve · Ash-Marked | Shuriken Fan, Smoke Step, Kunai Line, Field Suture, Silent Trade | 2 |
| **Clan Watcher** | Rooftop · Well-Shadow · Lantern-Out | Crow Sight, Bell-Silence, Paper Charm, Blood Lotus, Fox Form | 2 |
| **Chain-Hand** | Weighted · Twin-Chain · Hook-and-Line | Chain-and-Weight, Iron Fan Guard, Kunai Line, Smoke Step, Hollow Discipline | 3 |
| **Poison Sister** | White Sleeve · Nine-Petal · Lotus-Marked | Blood Lotus, Paper Charm, Breath of the Bell, Field Suture, Fox Form | 3 |
| **The Refused** *(undead — Jiro's)* | Split-Mask · Rope-Bound · Bell-Silent | **Basic Attack only** | 1 |

**The Refused fight at ×1.5 stats and are immune to Poison and Bleed**, like any raised undead. They carry no witnessable skills — a Basic Attack teaches nothing.

**Mini-bosses**

| Q | Mini-boss | Signature |
|---|---|---|
| 1 | **The Paper-Keeper** — runs the shop's other business | Silent Trade |
| 2 | **Watcher Ren** — has been following the player for two quests | Crow Sight |
| 3 | **The Left Hand** — Kaede's own enforcer, testing you | Iron Fan Guard |
| 4 | **Two of Jiro's Refused** — and neither is Jiro | Bell-Silence |
| 5 | **THE UNQUIET, JIRO** | Fifty Names at advanced |

---

### 4b. Against the Green-Eyed

| Enemy | Skins | Skill pool (5) | Equips |
|---|---|---|---|
| **Green Recruit** | Undyed · Half-Plate · First-Season | Rising Cut, Crossing Guard, Kiai, Field Honour, Unbroken Form | 2 |
| **Clan Archer** | Long Sleeve · Standing · Horse-Bow | Longbow Volley, Measured Shot, Reading the Field, Ash Ward, Kiai | 2 |
| **Stone Bannerman** | Full Plate · Standard-Bearer · Broken Banner | Stone Stance, Bear Stance, The Clan Watches, Crossing Guard, Unbroken Form | 3 |
| **Sworn Blade** | Green Cord · Two Swords · Scarred | Iai Draw, Rising Cut, Bear Stance, Standing Order, Green Discipline | 3 |
| **Clan Physician** | Grey Robe · Field Kit · Old Hands | Field Honour, Clan Blood, Ash Ward, Crossing Guard, Reading the Field | 3 |

**Mini-bosses**

| Q | Mini-boss | Signature |
|---|---|---|
| 1 | **Instructor Sagara** — Takeda's second, testing your form | Rising Cut |
| 2 | **The Petitioner** — a lawful man the clan is about to wrong | Stone Stance |
| 3 | **Blade-Captain Doi** — clan veteran, absolutely fair | Iai Draw |
| 4 | **Two of Kira's Hired** — she does not fight alone until she has to | Measured Shot |
| 5 | **THE WIDOW, KIRA** | Iai Draw at advanced |

---

### 4c. Against the Red Tally

| Enemy | Skins | Skill pool (5) | Equips |
|---|---|---|---|
| **Tally Hand** | Sun-Bleached · Tar-Stained · New Coat | Cutlass Work, Boarding Hook, Sea Legs, Grapeshot, Rum Ration | 2 |
| **Powder Monkey** | Soot-Faced · Bandaged · Barefoot | Powder Keg, Fire Ship, Grapeshot, Flintlock Shot, Powder Discipline | 2 |
| **Gun Captain** | Brass-Buttoned · Eye-Patch · Long Coat | Flintlock Shot, Chain Shot, Boarding Plate, Powder Discipline, Fire Ship | 3 |
| **Ship's Surgeon** | Apron · Bone Saw · Rum-Steady | Surgeon's Saw, Rum Ration, Reading the Tally, Grapeshot, Sea Legs | 3 |
| **Sea-Dog** | Salt-Crusted · Tattooed · Grey Beard | Sea-Dog Form, Cutlass Work, Boarding Plate, Black Flag, Shares and Plunder | 3 |

**Mini-bosses**

| Q | Mini-boss | Signature |
|---|---|---|
| 1 | **Bosun Teague** — running a skim off the tally | Sea-Dog Form |
| 2 | **The Factor** — a merchant who hired guns | Chain Shot |
| 3 | **Captain Ordell** — rival fleet, wants the same prize | Flintlock Shot |
| 4 | **Two Marines of the Line** — Vane-Kessler's, and disciplined | Volley Fire |
| 5 | **ADMIRAL AUGUST VANE-KESSLER** | Riposte Line at advanced |

---

### 4d. Against the Admiralty

| Enemy | Skins | Skill pool (5) | Equips |
|---|---|---|---|
| **Pressed Hand** | Slop Chest · Barefoot · Shorn | Saber Thrust, Close Order, Sick Bay, Marine Form, Naval Discipline | 2 |
| **Marine of the Line** | Red Coat · White Belt · Bayonet | Volley Fire, Close Order, Marine Form, Chain and Bar, Broadside Doctrine | 2 |
| **Gunnery Officer** | Blue Coat · Glass · Powder-Burned | Ranging Cannon, Chain and Bar, Flare, Volley Fire, Broadside Doctrine | 3 |
| **Signal Officer** | Flag Locker · Speaking Trumpet · Young | Signal Flags, Chart the Water, Flare, Articles of War, Naval Discipline | 3 |
| **Ship's Master** | Grey Coat · Charts · Weathered | Riposte Line, Saber Thrust, Chart the Water, Sick Bay, Colours and Papers | 3 |

**Mini-bosses**

| Q | Mini-boss | Signature |
|---|---|---|
| 1 | **Master's Mate Holt** | Close Order |
| 2 | **The Smuggler-Captain** — lawful target, sympathetic | Boarding Hook |
| 3 | **Commander Nairn** — another fleet, competing for the same command | Ranging Cannon |
| 4 | **Two of Ash's Boarders** — and neither is Ash | Boarding Hook |
| 5 | **THE TIDE-TAKER, DORIAN ASH** | Flintlock Shot at advanced |

---

## 5. The Twenty Quests

**Same shape per faction:** 2 encounters, 2, 3, 3, 3 + boss. Tier 1 rising to Tier 3. Every quest ends on a mini-boss. Rival joins from quest 3 and dies at quest 4.

**Titles:** basic on joining, intermediate at quest 2, advanced at quest 4 — granting **2× / 3× / one-tier-lift** on that faction's two archetypes plus all 16 of its skills.

| Faction | Archetypes | Title basic → intermediate → advanced |
|---|---|---|
| **Hollow Bell** | Rogue · Ranger | *Of the Bell* → *Bell-Sworn* → *The Bell's Own Hand* |
| **Green-Eyed** | Fighter · Tank | *Green Cord* → *Sworn Blade* → *Blade of the Clan* |
| **Red Tally** | Ranger · Rogue | *On the Tally* → *Full Share* → *Captain's Portion* |
| **Admiralty** | Fighter · Mage | *Rated Hand* → *Warranted Officer* → *King's Own* |

**Gear sets at quest 5:** **Shinobi Gear** (Rogue + Ranger), **Green-Eyed Armour** (Fighter + Tank), **Privateer's Kit** (Ranger + Rogue), **King's Uniform** (Fighter + Mage). All floor at level 15 and span two archetypes.

---

### 5a. The Hollow Bell

**Q1 · Paper and Ash** *(2 · soloable)*
> *Obaa-San:* "A man in the merchant quarter is writing our names down. Go and stop him writing."

Bell-Initiates guarding a scribe's house, then **The Paper-Keeper**, who turns out to work for the clan too and was testing you.

**Q2 · The One Who Watches** *(2)*
> *Obaa-San:* "Someone has followed you for two jobs. I want to know who pays him."

Clan Watchers across rooftops, then **Watcher Ren**. He is undead, and nobody uses the word.

**Q3 · The Left Hand** *(3 · Suzume joins)*
> *Obaa-San:* "Kaede wants you measured. Suzume is going with you and will make it unpleasant."

A staged contract against the clan's own enforcer. **The Left Hand** does not intend to kill you and nearly does anyway.

**Q4 · Twenty Years** *(3)*
> *Obaa-San:* "Ordinary job. Take the girl and come home."

Two of Jiro's Refused are already there. **Jiro kills Suzume**, and does not decay when he should.

**Q5 · The Bell Does Not Ring** *(3 + boss · Kaede joins)*
> *Kaede:* "I ordered him killed twenty years ago. Come and help me finish an old piece of work."

The Refused through the lower district, then **JIRO** with Kaede beside the player.

---

### 5b. The Green-Eyed

**Q1 · First Form** *(2 · soloable)*
> *Takeda:* "Bandits on the north road. The clan wants them gone and I want to watch how you do it."

Green Recruits, then **Instructor Sagara**, who corrects your footwork mid-fight.

**Q2 · A Lawful Order** *(2)*
> *Takeda:* "A man refuses a lawful summons. Bring him in — alive, and that is not optional."

Ends on **The Petitioner**, who is in the right and loses anyway. Nobody in the clan acknowledges this.

**Q3 · Measured** *(3 · Ayame joins)*
> *Takeda:* "Ayame has requested you. Do not embarrass either of us."

A contested arrest against another lawful house. **Blade-Captain Doi** is entirely fair and entirely lethal.

**Q4 · The Widow** *(3)*
> *Takeda:* "Escort duty. Lord Isamu's cousin. Boring work, good pay."

Two of Kira's hired blades, then **Kira kills Ayame** with an Iai Draw that Ayame sees coming and cannot answer.

**Q5 · Eleven Years** *(3 + boss · Isamu joins)*
> *Isamu:* "This woman has been training in secret for eleven years to reach me. Today she reaches me."

Kira's hired through the clan's own grounds, then **KIRA** with Isamu beside the player.

---

### 5c. The Red Tally

**Q1 · Full Share** *(2 · soloable)*
> *Hallow:* "Somebody's been skimming the tally. Find him and make an example."

Tally Hands in a dockside warehouse, then **Bosun Teague**.

**Q2 · The Factor** *(2)*
> *Hallow:* "A merchant hired guns instead of paying us. Go and correct his arithmetic."

Powder Monkeys and hired shooters, then **The Factor**.

**Q3 · Two Fleets** *(3 · Beau joins)*
> *Hallow:* "Another fleet wants the same prize. Beau's going. Try to keep up with him — he'll say that anyway."

**Captain Ordell** and a rival crew. Beau outshoots you and mentions it.

**Q4 · The Prize** *(3)*
> *Hallow:* "Fat merchantman, light escort, no complications."

Marines of the Line are waiting. **Vane-Kessler kills Beau Castell** and lets the player go with a message for Saint-Cloud.

**Q5 · Colours Down** *(3 + boss · Saint-Cloud joins)*
> *Saint-Cloud:* "He has hanged eleven captains and written to me about each one. Today we settle it."

Marines and a ship's company, then **VANE-KESSLER** with Saint-Cloud beside the player.

---

### 5d. The Admiralty

**Q1 · Rated Hand** *(2 · soloable)*
> *Crell:* "Smugglers in the shallows. Go and make them stop. I've drowned twice and I'd rather not again."

Pressed Hands and smugglers, then **Master's Mate Holt**.

**Q2 · A Lawful Prize** *(2)*
> *Crell:* "There's a captain running cargo without papers. Take the ship, take the papers."

Ends on **The Smuggler-Captain**, who is feeding a village and says so.

**Q3 · Two Commands** *(3 · Fane joins)*
> *Crell:* "Lieutenant Fane's been given this one and she asked for you, which surprised everyone."

**Commander Nairn** and a competing fleet. Fane is rigid, correct, and desperate for a command of her own.

**Q4 · Nine Engagements** *(3)*
> *Crell:* "Patrol. Routine. Nobody's seen Ash in the shallows for a month."

Ash's boarders come over the rail. **DORIAN ASH kills Fane**, compliments her by name doing it, and lets the player go because he'd rather they carried the story.

**Q5 · The Tenth** *(3 + boss · Vane-Kessler joins)*
> *Vane-Kessler:* "Nine engagements, nine losses. I have read every report and I know exactly what he does. Come with me."

Boarders and a pirate company, then **DORIAN ASH** with Vane-Kessler beside the player.

---

## 6. The Faction War — Four New Quest Types

**On the ordinary quest board**, available to everyone, no faction membership required. This is the feature that makes seven factions visible to a player who never joins one.

| Quest type | Enemies | Alignment shift |
|---|---|---|
| **Clan Suppression** | Hollow Bell — Bell-Initiates, Clan Watchers, Chain-Hands | Toward **legal** |
| **Bandit-Blade Contract** | Green-Eyed — Green Recruits, Clan Archers, Sworn Blades | Toward **criminal** |
| **Anti-Piracy Patrol** | Red Tally — Tally Hands, Gun Captains, Sea-Dogs | Toward **legal** |
| **Blockade Running** | Admiralty — Pressed Hands, Marines of the Line, Gunnery Officers | Toward **criminal** |

### How They Work

**Ordinary contracts in every respect** — solo or party track, standard tier payouts, 2–4 encounters, the same lanes and the same rules.

**The enemies are faction members**, drawn from the 20 types in §4 with their full skill pools. So **faction-war quests are the witnessing ground for all 64 skills** for a player who never joins anybody.

**Three consequences worth building around:**

**1. Fighting a faction closes it.** Complete three or more quests against a faction and its recruiter never contacts you. You have made your position clear and they read the board too.

**2. Fighting a faction's enemy opens it faster.** Complete three or more against the Red Tally and the **Admiralty** recruiter contacts you regardless of contract alignment. Nothing recruits like proven hostility to the other side.

**3. Members cannot take quests against their own.** A player who joins the Hollow Bell no longer sees Clan Suppression. The other three remain — including, for a lawful player, both criminal-shifting types, which they cannot take without breaking their alignment (§1a).

### Why This Exists

The first campaign's problem was that **almost nobody reaches a recruiter**, and the factions only exist inside a campaign nobody finishes.

**Faction-war quests put all seven factions on the ordinary board from the first contract.** A player with a two-minute session fights ninjas, sees the alignment shift, and learns the world has sides — the entire lesson, delivered without a line of dialogue.

---

## 7. The God Line — 1000 Gold

**A separate quest track, not attached to any faction.** Two boss encounters, four routes, and the hardest content in the game.

**Payout: 1000 gold.** A boss party contract pays 800 and a gear set costs 800 — this single quest buys a set outright.

### Availability

**Appears on the town quest board at rank equivalent to 25 completed contracts.** No faction requirement, no alignment gate. Available to a Maw assassin, a naval officer, and a man who has joined nothing.

**Party contract only.** There is no solo version and there should not be.

**Repeatable, payout halving each time** — 1000, 500, 250, 125. The first clear is the event; the rest is grinding and should feel like it.

---

### 7a. THE PALE MOTHER

`t9puW54s29EO0gQK6OMR`

**What she is.** Nobody knows. She appears where too many people have died at once and she does not leave until somebody makes her.

**Route A · The Ossuary** *(4 encounters + boss)*
> *Board:* "The bonehouse beneath the old quarter has been sealed for nine years. Something inside has started counting."

Grave-Touched, The Risen, and The Refused through a sealed ossuary. The Risen here are **not raised by anyone** — they simply stand up, which the game has never done before.

**Route B · The Birthing House** *(4 encounters + boss)*
> *Board:* "Every woman who has died in childbirth in this district for six years is standing in one room. They are not hostile. They are waiting for someone."

The four encounters are the building's living guards, terrified and unwilling to explain. **No undead is fought before the boss.** The horror is that nothing attacks you on the way in.

**Cutscene — before the fight**
> "I have been called a great many things and I answer to none of them."
>
> "Do you know how many died to make this room? I do. I have counted every one, twice, and I will count you."
>
> "You may leave. I will not stop you and I will not follow. Nobody has ever taken it."
>
> "No. Nobody ever does."

**Loadout.** Perks: Devoted, Bulwark, See Invisibility. Actives: **Necromancy**, Whisper of Ending, Crimson Covenant, Renewal, Blood Lotus, Vital Anchor.

**She heals more than the player can remove.** Renewal restores a lane, Crimson Covenant damages and heals in one action, and Vital Anchor prevents her dropping below 1 HP for two rounds.

**The counter is Withering** — Whisper of Ending, Blood Lotus, or Throat Work. **A party without a healing-denial effect cannot finish her**, and that is the whole fight.

**She raises every corpse in the room, including the party's dead.** A hire who falls comes back on her side at ×1.5 stats.

---

### 7b. THE DROWNED KING

`HMvHZWb0ZWSo5Kc5l22D`

**What he is.** He was a king. The sea took him and gave most of him back.

**Route A · The Low Tide** *(4 encounters + boss)*
> *Board:* "The water has gone out four hundred yards and has not come back for eleven days. People have started walking out to see why."

Sea-Dogs, Tally Hands, and Marines of the Line — **all drowned**, all standing on the exposed seabed, all still in the colours they died in. Pirates and navy in the same lane, no longer fighting each other.

**Route B · The Salt Court** *(4 encounters + boss)*
> *Board:* "A ship came in with no crew, no cargo, and a throne bolted to the deck. The harbourmaster wants it gone and will pay anything."

Four encounters aboard the ship, in the dark, with the throne visible from the first lane and getting no closer.

**Cutscene — before the fight**
> "Sit down. You have walked a long way and I have been patient for longer than your city has existed."
>
> "I was a king. Then the water came in through the windows and I found out precisely what that was worth."
>
> "I am not angry. That is the part people never believe. I am simply still here, and everything else went away."
>
> "Draw. I would like to see whether the world has learned anything."

**Loadout.** Perks: Bulwark, Momentum, Sea Legs. Actives: **Riposte Line**, Stone Stance, Paid in Full, Chain and Bar, Boarding Hook, Full Broadside.

**He is a reflect wall.** Riposte Line returns everything for a round, Stone Stance reflects at full for two, Bulwark adds 60% on top, and Paid in Full dumps every point he has prevented into one hit.

**The counter is reflect immunity** — Marksman at advanced, Ghoststep, Smoke Step, or Nowhere. **A melee party will kill itself on him.** A ranged party with Marksman walks through.

**He pulls the ranged party in.** Boarding Hook drags a back-lane character into his front lane, which is the exact thing that beats the exact thing that beats him.

---

### 7c. Why Two Bosses and Four Routes

**They are opposite locks.**

| | The Pale Mother | The Drowned King |
|---|---|---|
| **Wins by** | Out-healing you | Reflecting you |
| **Beaten by** | Withering — healing denial | Reflect immunity |
| **Kills** | Healer-light parties | Melee parties |
| **Raises your dead** | Yes | No |
| **Pulls your ranged** | No | Yes |

**A party built for one is badly built for the other.** Neither is a damage check; both are a loadout check, which is the game's design pillar taken to its conclusion.

**Two routes each** because the god line is the only content worth replaying at full difficulty, and the same four encounters twice would waste the best boss in the game.

**Both cutscenes offer the player an exit and mean it.** Leaving forfeits the quest and the gold, costs nothing else, and is the only place in the game where a boss says *you may go* and it is true.

---

## 8. Twenty New Personalities

**The base game has 40 — 20 male, 20 female. This adds 20 more, for 60 total.**

Same rules exactly (base GDD §17a): assigned at seed, immutable for life, four bands of four lines, one voice actor each, no line shared with any other personality.

**These use the ninja, samurai, pirate, and naval voices**, giving the roster an audible cultural spread it did not have. A generated NPC can now sound eastern or maritime without belonging to any faction.

### Male — M21 to M30

| | Personality | Register | Voice |
|---|---|---|---|
| **M21** | **Disciplined** | Clipped, formal, answers exactly what was asked | `Jct0W4WcX77c9yh7tpGo` |
| **M22** | **Patient** | Slow, unhurried, finishes every sentence | `R003ylvhf54dw04Zg81Q` |
| **M23** | **Severe** | Cold authority, does not repeat himself | `HYfT8byrXEsuxnJuQWLF` |
| **M24** | **Watchful** | Quiet, observational, tells you what he noticed | `viRs91T0tmaQFBjKQbJ5` |
| **M25** | **Rakish** | Loud, charming, permanently amused | `1csfYuDOypqYwHwYho4k` |
| **M26** | **Boastful** | Every story has him in it and he improves it | `wfGL3tJehRI3DoxtsLta` |
| **M27** | **Salted** | Weathered, superstitious, talks about the sea like a person | `u90bBWOV7gURzqtsMjBN` |
| **M28** | **Commanding** | Gives orders by default, even socially | `KlRlfft1voWiT2Df8TSX` |
| **M29** | **Silver-Tongued** | Flatters precisely, always wants something | `C34VRFVgUY3W0ZIN2NQ5` |
| **M30** | **Unquiet** | Flat, hollow, speaks as though from a distance | `SW9n4bPps5VYGQPnhdgI` |

### Female — F21 to F30

| | Personality | Register | Voice |
|---|---|---|---|
| **F21** | **Composed** | Measured, unreadable, never raises her voice | `m0Fy6FqG3UvYAJ9XxkLC` |
| **F22** | **Elder** | Ancient, direct, has outlived her patience | `Dd9rggTUyQrGBAa9A3P7` |
| **F23** | **Sharp** | Fast, competitive, scores everything | `Hvw50qC2EU36Q5rwuUhg` |
| **F24** | **Grave** | Soft-spoken and final; the softness is the frightening part | `olrUz8V5WoH80Rnq2JOc` |
| **F25** | **Formal** | Correct in all things, uncomfortable with warmth | `pFSI8w96hzoslLGuDOEe` |
| **F26** | **Brazen** | Crude, loud, entirely unembarrassed | `ZKzVk98AXguhTaJuCEF3` |
| **F27** | **Elegant** | Precise, gracious, and never once sincere | `Kexq2CdSapm18RMWwloT` |
| **F28** | **Dutiful** | By the book, earnest about it, quietly proud | `RewGaHimUnPqdkKgE5mb` |
| **F29** | **Exacting** | Corrects people, including you, including now | `fazkFGFrALkyPulDqqzW` |
| **F30** | **Bereaved** | Carrying something and not discussing it | `VIPtPJaY9dPaNIMgAKpr` |

### Two Notes

**M30 Unquiet uses Jiro's voice.** Any NPC rolled into it sounds like the undead antagonist — unsettling on an ordinary roster member and worth keeping. If it reads as a bug, reassign it.

**F30 Bereaved uses Kira's voice**, same caveat.

### Line Writing — Next Deliverable

**320 lines remain** — 20 personalities × 4 bands × 4 lines.

**Rules are the base game's exactly:** every line unique across all 60 personalities, at least one unconditional line per band, `{target}` vocative only, and each line carrying backstory, a want, a regret, a read on the player, or tactical information.

**The existing 640 are the reference for register and length.** The M/F parallel-list problem is worth avoiding this time — M21 Disciplined and F25 Formal are adjacent concepts and should not be written side by side.

---

## 9. Build Notes

- **Purely additive.** No existing system changes. No corrections, no extensions, no rebalances.
- **64 new skills** (§3), witness-only during a campaign. **Horizontal slice** — completing any one of the four unlocks all 64 (§1d).
- **No new statuses.** All four factions use Bleed, Poison, Burning, Shock, Withering, and Exposed.
- **20 new enemy types** (§4) with **three skins each** — palette, silhouette, and name variants, not new art.
- **20 quests** (§5), same 2/2/3/3/3+boss structure.
- **Four new quest types on the ordinary board** (§6) — the faction war, which is the feature most players will actually see.
- **A 1000-gold god line** (§7) with two bosses and four routes.
- **20 new personalities** (§8), bringing the roster to 60. **Lines not yet written.**
- **24 new voice IDs**, none overlapping the base game's 40.
- **Alignment lock** (§1a): legal and criminal are incompatible, criminal is permanent for that life, only death resets it.
- **Up to three factions per life** (§1b) if the player stays lawful. Neutral is compatible with everything.
- **Death handles campaigns two ways** (§1c). Reincarnation closes any campaign the line has started. **A nepotism heir resumes it** at the quest the parent died on, addressed by their inherited title.
- **Seven factions across two documents.** One of the first campaign's three, plus any alignment-compatible combination of these four.

**World-state addition required:** `campaignProgress: [{ factionId, questReached, titleTier, rivalAlive }]`, written on recruiter acceptance and updated per quest. It sits in **world state**, not character state (base GDD §18), so a nepotism heir can read it and a reincarnated character can be locked out of it.

### What Still Needs Writing

| Item | Volume |
|---|---|
| **Personality lines** | 320 |
| **Campaign dialogue** | 16 characters, roughly 240 lines |
| **Faction-war board descriptions** | 4 |
| **Hall dialogue for simultaneous membership** | A player in three halls needs each to acknowledge the others exist |

### Open Questions

1. **Does Jiro's True Rest immunity need a general rule?** He is undead but not animated by a working, so True Rest does not resolve him. Currently a one-character exception; it may want to be a category.
2. **Do faction-war quests count toward faction titles?** They are quests against a faction, not for one. Currently no.
3. **Can the god line be attempted by a Villain?** Nothing prevents it, and a Villain with inherited hero grants would find The Drowned King considerably easier.
4. **Should the two legal factions know about each other?** The Green-Eyed and the Admiralty are both lawful and never interact — and a lawful player can now hold both at once (§1b), which makes the silence conspicuous.
