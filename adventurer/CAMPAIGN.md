# Campaign Design Document v0.1

**Add-on specification for the shipped Adventurer RPG.** The game is built and working; this adds to it. Self-contained — start at §0.

**Target length: under 30 minutes**, start to credits.

**Purpose:** the base game has no authored story by design — narrative emerges from the relationship graph and the quest log. This campaign does one narrow job the emergent systems cannot: it makes the player *notice the faction system*. Right now criminal and legal standing are numbers that shift silently. The campaign gives each alignment a face, a voice, and a reason to care which way the number moves.

---

## 0. Document Status — Read First

**The game is already built and working. This is an add-on.**

Nothing here is a criticism of the existing build, a rewrite, or a request to revisit finished systems. The base game's architecture — lanes, fixed stats, the skill tier model, the relationship graph, permadeath, inheritance, the economy — is **correct and stays exactly as it is.**

**What this document does:**

- **Adds new content** that plugs into systems that already work: skills, enemies, quests, characters, screens.
- **Extends one existing system** — heroes and villains — because the campaign's ending depends on it.
- **Corrects two small inconsistencies** in the original design document that were never buildable as written.

**Scope, honestly stated:** roughly 90% of this document is new content requiring no changes to existing code. The remaining 10% touches the Divine Intervention system, and one line of skill text.

**Where this document and the original GDD disagree, this document is correct.** The GDD is a historical reference for the shipped game and is no longer maintained.

**Future campaigns will each be their own document**, self-contained, in this same format.

---

## 0a. Additions — New Content, No Existing Code Touched

These plug into systems that already work.

| Addition | Detail |
|---|---|
| **72 new skills** | §13. Witness-only during a campaign, permanently purchasable afterward — including the 48 from factions the player never joined. Tier normally. |
| **4 new statuses** | §13e. Poison, Burning, Shock, Withering. Stack independently of Bleed. |
| **Killing generates no Hatred** | §0f. Deaths do not propagate through the relationship graph at all. Overrides the base game's second-order death rule, which had no defined magnitude and almost nobody to apply to. Includes the complete list of what *does* create Hatred. |
| **Withdrawal caps** | §0e. Replaces binary approve/refuse with a percentage cap set by partner happiness and sex, plus a Charm bonus. Gives the Charm perk its first use outside an encounter. |
| **Perk rules clarified** | §13d-2. **Perks exist only in their advanced form** — bought whole at full strength, never levelled, never witnessed, gold only. Immune to Dispel, Ward Thief, and every strip effect. Resolves an ambiguity: passive perks have no "use" event, so use-based levelling could never have applied. |
| **1 new damage type** | Shadow. Behaves like any existing type. |
| **15 new enemy types** | §14. Each carries a 5-skill pool and equips 2–3 rolled per spawn. Plus 15 mini-bosses. |
| **12 campaign characters** | §6, with full loadouts in §6a. Excluded from every existing system — no relationship edges, no roster, no seeding, no permadeath. Nine of them fight and carry boss-scale loadouts. |
| **15 quests** | §15. Ordinary quest structure, faction-flagged. |
| **9 faction titles** | §10. Grant skill progression, never stats. The fixed-stat pillar is untouched. |
| **3 gear sets** | §10. Unpurchasable. Floor at level 15 and span two archetypes — otherwise identical to existing sets. |
| **1 new location** | §4a. The faction hall: its own quest board, standing tracker, quartermaster, rival toggle. |
| **2 new screens** | §10a support panel, §10b end card. |
| **1 combat rule, 3 characters** | §5a. Rival non-death — at 0 HP they exit the encounter and return for the next. Applies to nobody else. |

---

## 0b. Extension — Heroes and Villains

**The only existing system this add-on modifies.** The campaign's Antler branch ends with the player killing a hero, so the rules around that have to be complete.

| # | Change | Why |
|---|---|---|
| **1** | **Hero grants are permanent and never revoked.** A hero whose target dies becomes an **idle hero** — still empowered, still barred from ordinary contracts, waiting for the next divine quest. | The original doc said grants revoke on target death, which contradicted its own rules about idle heroes accumulating as a deterrent. Those can't both be true. |
| **2** | **Two heroes are named per hero death**, each at **twice** the previous stat bonus. Gen 1 → 1 hero, gen 2 → 2 at ×2, gen 3 → 4 at ×4. | Makes villainy a doom clock rather than a grind. |
| **3** | **Naming is delayed 3 quests**, every generation, forever. | Lets a villain enjoy the win. It is the only relief in the system and it never shrinks. |
| **4** | **Hero eligibility:** living NPCs who are not criminal-aligned, hold fewer than 10 Hatred edges, have never used a forbidden skill, and are not Villains. If nobody qualifies, **no hero is named.** | A world corrupt enough to have no clean candidates cannot answer its villains — a consequence worth letting the simulation reach. |
| **5** | **Heroes hunt Villains**, alongside forbidden-art users and the widely hated. | Villains were already a trigger; this makes it explicit. |
| **6** | **Anyone who kills a hero, or assists, becomes a Villain.** No bystander clause. | The campaign's Antler branch. |
| **7** | **The dead hero's grants transfer to the killers**, permanently. | Same. |
| **8** | **Villains have levels** — one per hero killed, taking the stat bonus of the strongest hero they beat. **Only heroes count**; forbidden users, the hated, and other villains grant nothing. | Growth requires the one act that summons more of what hunts you. |

---

## 0c. Corrections — Two Lines

| Was | Should be | Why |
|---|---|---|
| **Marksman**, advanced: "back-lane attacks cannot be counterattacked" | **"Back-lane attacks take no reflect damage from any source"** | There is no counterattack mechanic. Every counter-like effect in this game is reflect, deliberately. As written the line does nothing. |
| Reflect stacking unspecified | **Reflect sources stack additively** — advanced Bulwark (60%) + Thorn Skin (50%) returns 110% | The campaign adds several reflect sources and they need a stated interaction. May already behave this way. |

---

## 0d. Balance Changes to Existing Skills

**Two changes to the shipped game, both intended to make melee and fighter builds stronger.**

### Backstab — Reworked

**Was:** high damage to the enemy back lane only, usable any time.
**Problem:** a front-line fighter can never use it, because the enemy back lane is unreachable from the front line. The archetype's signature skill was dead weight for exactly the players most likely to take it.

**Now:**

| | |
|---|---|
| **Power** | **6.0** at basic — roughly double a standard attack |
| **Reach** | **Any lane.** Position is irrelevant. |
| **Usable only as** | The **opening action of an encounter**, or **from stealth** |
| **Otherwise** | Greyed out. There is no third way to use it. |

**This creates a real rogue loop.** Open with Backstab for a burst. Re-enter stealth — **Vanishing Strike** (§13a) does it on a kill, and Smoke Bomb, Vanish, and Ghoststep all grant it — then Backstab again. A rogue's damage now comes from cycling stealth rather than from standing in a specific lane.

**And it works for fighters.** A front-line melee build now opens every encounter with the hardest hit in their kit.

### Melee Skills Apply Exposed

**Every melee skill now applies 1 stack of Exposed to its target** (§13e), in addition to whatever it already did.

**Melee** means any skill dealing physical damage at front-lane reach, plus Backstab. Basic Attack, Cleave, Sunder, Throat Work, Butcher's Tempo, Line Advance, Shield Breaker, Veteran's Cut, Flanking Pay, Vanishing Strike, Spellblade Form, Runic Strike, Disciplined Advance, Silenced Step, Ward Thief, and Taunt's retaliation all qualify.

**Ranged, elemental, and healing skills do not apply it.**

**Why.** Melee builds trade reach and safety for damage, and until now got nothing structural for it. Exposed rewards staying in contact and chaining hits — and it rewards *parties* with more than one melee character, since anyone's stacks feed everyone's next hit.

---

## 0e. Vault Withdrawals — Partner Happiness

**Replaces the binary approve/refuse check with a percentage cap.** A partner does not say yes or no; they say *how much*.

### Partner Happiness

Driven entirely by shared questing, as before.

| State | Condition |
|---|---|
| **Happy** | **3 consecutive quests** taken together |
| **Content** | 1–2 quests since the last shared one |
| **Neutral** | **3 or more quests** with no shared questing, or no relationship activity at all |

**Happiness decays one step per quest apart.** Three shared quests buys full happiness; three quests apart spends it. A couple who quest together every trip never leave Happy.

### Withdrawal Caps

**The cap is set by the partner's sex.** Male partners are more permissive by 10 points at every state.

| Partner state | Female partner allows | Male partner allows |
|---|---|---|
| **Happy** | **80%** | **90%** |
| **Content** | **50%** | **60%** |
| **Neutral** | **25%** | **35%** |

**Percentages are of the vault's current total**, checked at the moment of the request.

### The Charm Bonus

**A requester holding the Charm perk adds +10%** to whatever their partner allows.

**This is the first thing Charm does outside an encounter.** It has been a bypass verb and nothing else; now it has a use in town, which suits a perk about getting people to give you things.

### Resulting Maximums

| Requester | Partner | Cap |
|---|---|---|
| **Female with Charm** | Happy husband | **100%** |
| Female without Charm | Happy husband | 90% |
| **Male with Charm** | Happy wife | **90%** |
| Male without Charm | Happy wife | 80% |
| Anyone with Charm | Neutral female partner | 35% |

**Only one combination reaches the whole vault** — a charming woman with a husband she has quested beside three times running. Everyone else leaves something behind.

### Why This Is Better

**The old rule was a coin flip the player couldn't read.** A percentage cap is legible: the player knows their partner's state, knows the cap, and knows exactly what a quest together is worth.

**It also makes drain-and-run harder without banning it.** Emptying a vault completely requires being female, holding Charm, and having genuinely quested beside the person for three straight contracts — which is a lot of investment in someone you are about to leave.

---

## 0f. Killing Generates No Hatred

**Death does not propagate through the relationship graph.** Killing someone — in an ambush, on a contract, or by assassination — creates **no Hatred in anyone**, from anybody, ever.

**This overrides the base game's second-order propagation rule for deaths.** That rule said a victim's friends shift toward the killer, but it never worked: the movement table has **no entry for a killing**, so "half the primary change" is half of an undefined number. It also has almost nobody to apply to, since each NPC holds a single NPC slot and most victims occupy nobody's.

**Second-order propagation still applies to everything else** — betrayals, jiltings, refused rescues. Only deaths are exempt.

### The Complete List of Hatred Sources

Nothing outside this table creates Hatred.

| Source | Who it lands on | Decays? |
|---|---|---|
| **Being jilted** | The abandoned partner, set to −100 | **Never** |
| **A woman taking the man someone wanted** | The wife, scaled to his wealth and rank | Clears if she is later jilted |
| **Wealth gap between men** | The poorer man, by ratio | **Yes** — as he catches up |
| **A released conscript** | The conscriptor, permanently, once the term ends | **Never** |
| **Theft discovered** | The thief | Never |
| **Refused rescue** | The abandoned friend | Never |
| **A father killing the children's mother** | Those children, if self-sufficient | **Never** |
| **The player electing it** | Anyone the player chooses | N/A |

### Why Killing Is Free and Conscription Is Not

**A conscript survives.** They are beaten, forced to fight for three quests, released, and then spend the rest of their life on the roster remembering it. That is a person who can hate you.

**A corpse cannot.** Necromancy is the harsher act and generates no enmity at all, because the only witness is gone.

**So the two forbidden skills fail differently:**

| | Conscript | Necromancy |
|---|---|---|
| **Immediate cost** | One permanent enemy per release, and 3 lives added that mature hostile | **Nothing** |
| **Delayed cost** | Reaching 10 Hatred edges eventually calls a hero | **5 raises calls a hero, on a timer nothing can stop** |
| **Population** | **+3 per use** | **−1 per use** |
| **How it kills you** | Slowly, socially, through a queue you built | **On schedule, regardless of how well-liked you are** |

**A necromancer can be the most popular person alive and still be hunted.** Divine Intervention does not check whether anybody minded.

---

## 1. What This Is Not

**Campaign characters are not NPCs.** They exist outside every system in the base game:

| System | Campaign characters |
|---|---|
| Relationship graph (§6) | **Excluded.** No edges, no slots, no dispositions. |
| Romance, marriage, children | **Excluded entirely.** |
| Guild Roster and event feed | **Excluded.** They never appear. |
| Questing, hiring, wages | **Excluded.** They cannot be hired or joined. |
| Permadeath and the world clock | **Excluded.** They do not age, quest, or die of the simulation. |
| Assassination and Divine Intervention | **Excluded.** Never targets, never heroes. |
| Personality library (§17a) | **Excluded.** They have authored scripts, not seeded lines. |

They are fixtures. The world moves; they stand still and talk about it.

**One exception:** a rival can be killed, but only as a scripted campaign beat, never through the assassination system.

---

## 2. Attachment to the Base Game

**A new town menu entry: `Campaign`.** Hidden until the player qualifies for at least one faction, then permanently visible.

**Campaign quests appear as their own track** on the Quest Board, alongside solo and party contracts. They pay normally and advance the world clock normally. Everything else about them is ordinary — the same lanes, the same 31 skills, the same enemies from §17.

**Nothing about the campaign is required.** A player who never opens the menu plays the base game unchanged.

---

## 3. The Gates

### Design Constraint — Read This First

**Observed session lengths:**

| Player | Session |
|---|---|
| Average | **30 seconds – 2 minutes** |
| Hardcore | **5 – 10 minutes** |
| Anyone who finishes a campaign | Realistically the developer |

**Every gate is therefore a wall, not a filter.** A recruiter who appears at minute 20 is a recruiter almost nobody meets. The purpose of these factions is to teach the player that alignment exists — a lesson that has to land inside the first two minutes or it never lands at all.

**The gates below are set as low as they can go while still being a choice.**

### First Contact — After One Contract

**A recruiter contacts the player the moment they complete their first contract of a matching alignment.** No reputation requirement, no completed-quest count.

### Offer Priority

**The Gaping Maw and Varenholm Academy have priority. The Antler is the fallback.**

| Situation | Who contacts the player |
|---|---|
| First **criminal** contract completed | **Wren Sallow** — The Gaping Maw |
| First **lawful** contract completed | **Adept Lirien** — Varenholm Academy |
| An aligned offer is **declined** | **Bregga Holt** — The Antler, on the next return to town |
| **3 contracts completed with no alignment taken** | **Bregga Holt** — The Antler |

**Why the Maw and Varenholm go first.** They are the two factions the campaign exists to teach — criminal and legal are the alignments the base game already tracks silently. The Antler is neutral, which means it teaches nothing about alignment and should never pre-empt a faction that does.

**If both aligned offers are somehow live at once** — a player whose first two contracts were one criminal and one lawful — the **most recent alignment wins.** The other recruiter withdraws without appearing.

**If an aligned offer is declined**, that recruiter returns after the player's next contract of that alignment, indefinitely. Refusal never closes a door; only accepting a different faction does (§7).

### The Antler Is Advertised Once, and Stays Open Forever

**The Antler's offer is announced exactly one time** and then never again. Holt appears, makes the pitch, and does not come back.

**But the offer never expires.** From that moment the Antler appears as a standing option in the town menu, available to any unaffiliated character at any time, with no further prompting. A player can ignore it for forty contracts and accept it on the forty-first.

**This is the character of the faction.** The Maw noticed you. Varenholm reviewed your record. The Antler is simply always hiring, has no opinion about you, and does not chase anyone.

### Offers Reset on Death

**All faction offers clear when a character dies** — reincarnation and nepotism alike (GDD §7).

The new character re-qualifies from scratch under the rules above: an aligned contract brings the matching recruiter, declining brings the Antler, and the Antler's single advertisement fires again for the new life.

**A player who ran the Maw last life is not remembered.** Vane does not know them. Wren Sallow introduces himself as though for the first time, because for this character he is.

**This is how a player sees the other two campaigns** — faction exclusivity is per life (§7), so death is the mechanism by which the second and third factions become reachable at all.

### No Reputation Gate

The earlier draft required *minor reputation* — five contracts at a 50% success rate. **That is removed.** At observed session lengths it delayed first contact past the point most players stop playing, and it filtered nobody worth filtering.

**Reputation still matters everywhere else in the game.** It simply does not stand between the player and the faction system.

### The Boss Appears Early

**The faction boss is the hook, not the prize.** Ossian Vane, Aldis Crane, and Ilaria Venn are the most interesting characters in this document and the earlier draft held them until quest 5, roughly twenty-five minutes in.

**They now appear at the faction hall on the player's first visit**, before quest 1, with a short scene. They reappear at quest 5 for the resolution.

A player who joins a faction, walks into the hall, meets someone genuinely memorable, and then quits after two minutes has still had the experience the campaign exists to deliver.

## 4. The 30-Minute Shape

**The story is deliberately thin.** The systems already generate conflict — marriages, betrayals, assassins, heroes. The campaign's job is to point at the faction system and get out of the way.

**Five quests. One thing happens.**

| # | Quest | Encounters | Party | What happens | Reward |
|---|---|---|---|---|---|
| — | *Recruitment* | — | — | Recruiter gives faction background, the rewards, and the offer. On acceptance, a **brief tutorial** on taking faction quests. | **Basic title** |
| **1** | First Contract | 2 | **Soloable** | Straightforward work. Afterward the **rival** makes contact — acknowledges the win, tells the player to get stronger for the real money. | — |
| **2** | Second Contract | 2 | Soloable | Harder. The rival is dismissive but interested. | **Intermediate title** |
| **3** | Third Contract | 3 | Party recommended | **The rival joins the player's party.** They are visibly better and cannot be killed. | — |
| **4** | Fourth Contract | 3 | Party recommended | **The antagonist appears and kills the rival.** The player is spared and sent back to report it. | **Advanced title** |
| **5** | The Reckoning | 3 + boss | Party strongly recommended | The player and the **faction boss** hunt the antagonist together. | **Gear set** · end card |

**Total: 13 encounters plus a boss.** Tier 1 climbing to Tier 3.

### Why the Rival's Death Works

**The rival cannot die in combat** (§5a). At 0 HP they vanish, withdraw, or teleport — every time, across quests 3 and 4, in front of the player.

**Then something kills them.**

The mechanic is the setup. A player who has watched Kite walk away from three losing fights understands exactly what it means when Kite does not walk away from the fourth. Nothing has to be explained.

**The antagonist spares the player deliberately** — so there is someone to carry the news back. That is the only reason the player survives, they are told so, and it is the entire motivation for quest 5.

## 4a. The Faction Hall — GUI

**Joining a faction adds a new location to the town menu**, named for that faction and permanently visible from induction onward.

**Faction quests are not on the town Quest Board.** The player must go to the hall. This is the whole point of the change — the faction is a *place* you visit, with people in it who talk to you, rather than another line item on a list.

**The hall screen contains:**

| Element | Detail |
|---|---|
| **Faction banner and boss portrait** | The face of the institution, always present |
| **The five campaign quests** | Listed in order; completed ones marked, locked ones greyed with their requirement showing |
| **Repeatable contracts** | Available after quest 5, refreshed as the player completes them |
| **Faction standing and title progress** | Current title, next tier, contracts remaining to reach it |
| **The rival** | Togglable as a party member for faction quests only (below) |
| **Quartermaster** | Re-issues a lost faction gear set once per life (§10) |
| **Dialogue trigger** | The recruiter, rival, or boss speaks on entry when a beat is pending |

**The town Quest Board still exists and still works.** An inducted character can take ordinary solo and party contracts as before — the hall is an addition, not a replacement.

## 5. The Antagonists

**Each faction has one antagonist**, and each has a reason that predates the player entirely.

### VESNA ARDEN — "The Lamplighter" · *against the Gaping Maw*

**A ranger, working alone.** Her mother was killed by a Maw contract. Her father took out that contract. She dealt with her father a year ago and has been working through the Maw ever since.

**Her method is the whole character.** She does not hunt Maw members and kill them quietly — she finds out who they have been sent to kill, waits, and **kills them in the moment before they strike.** The target survives and sees everything.

**On the body she leaves a candle**, proof of Maw membership, and the evidence of who they had been hired to kill. The guards find all of it. There is a living witness every time.

**She is not exposing the Maw by accident.** Every kill is a piece of court-usable evidence handed to the law, and the Maw cannot answer it, because the one thing an assassins' guild cannot survive is being *documented*.

**Why she spares the player:** the witness is the point. Sparing them is not mercy, it is method.

### HOLLOWAY — *against the Antler*

**A Hero** — in the game's exact sense (GDD §3a). Divine Intervention named him, and he answered.

**He killed Dain Roscarrow lawfully.** Roscarrow had been using **Conscript** — quietly, for years, because it fields bodies at no payroll cost and the Antler runs on margins. He crossed the threshold. The world called a hero. The hero did his job.

**And then nothing.** Grants are permanent (GDD §3a), so Holloway is still a hero — still empowered, still barred from ordinary contracts, still waiting for the world to name someone else. **An idle hero with divine strength and no war.**

**That is why he drinks**, and why he sleeps with anyone who will have him. The grant did not make him a good man; it made him an effective one, gave him one job, and then left him standing in a city he cannot work in.

**What the Antler does not know publicly:** Roscarrow and First Horn Aldis Crane were lovers, and had been for eleven years.

**So quest 5 is a revenge killing with no sanction behind it.** Crane is hunting a hero for a lawful execution because she loved the man he killed. She has no divine mark and no cause. The player is helping anyway.

**Why he spares the player:** heroes pursue their named target and nobody else. The player was never on the list.

### THE QUIET — *against Varenholm Academy*

**A genius, expelled a year ago for practising necromancy.** His real name was struck from the Academy rolls; *the Quiet* is what he calls himself now.

**He kills mages before they can speak.** It is a professional insult as much as a method — Varenholm's entire power is spoken aloud, and he has built a career on the half-second before the first word.

**He is a forbidden-arts user** (GDD §3a) with everything that implies, including a Divine Intervention clock of his own that he is outrunning and will not outrun forever.

**Why he spares the player:** an irregular is not a mage, and he wants Venn told.

### Common Rules

**Antagonists sit outside every system** (§1) — no relationship edges, no roster presence, no seeding. They exist for two scenes: killing the rival in quest 4, and dying in quest 5.

**They must be seen before the kill.** One line and one action in quest 4 before the rival goes down. The player should not meet them for the first time over a body.


## 5a. The Rival as a Party Member

**From quest 3 onward the faction's rival can be brought along**, toggled from the faction hall.

| Rule | Detail |
|---|---|
| **Availability** | Faction quests only. Never on town contracts, never hireable. |
| **Wage** | None. They are faction, not staff. |
| **Party slot** | Occupies one, so five hires plus the rival is not possible. |
| **Relationship graph** | Still excluded (§1). No score, no edges, no romance. |
| **Loot and rewards** | Takes none. Everything goes to the player. |

### Rivals Cannot Die

**At 0 HP a rival exits the encounter instead of dying.** Each has a signature departure — the same one every time, because it is a character trait rather than a mechanic dressed up.

| Rival | At 0 HP |
|---|---|
| **KITE** | Says something insufferably cool and **vanishes** |
| **DAIN ROSCARROW** | Calls it a tactical withdrawal and **falls back** |
| **CASSIEL VAUNT** | Says something wise and **teleports out** |

**They are removed from that encounter only.** They return at full health for the next encounter and every subsequent quest — **until quest 4, where the antagonist kills them permanently in a scripted event** (§5). Nothing the player does prevents it.

**Everyone else dies normally.** Hired party members die permanently. The player dies permanently. The rival's immortality is theirs alone.

### Exit Lines

**KITE**
> "That's me finished. Try not to need me."
>
> "You've got the rest. Aim for the one at the back — the front ones are paid to soak it."
>
> "I always get back up. Ask anyone how many times they've buried me."

**DAIN ROSCARROW**
> "I'm pulling back. That's a decision, not fear."
>
> "The job doesn't stop because I did. Finish it."
>
> "I'll be at the fallback point. It's written into every contract we sign, including yours."

**CASSIEL VAUNT**
> "A good mage knows when to stop casting. This is that."
>
> "Eleven years of study and I still go down first. Give me a moment."
>
> "Hold the line. My wards are still up — use them."

**Why this exists.** Two reasons. From quest 3 the difficulty assumes a party, and a player who has never hired anyone — the solo builds the base game explicitly supports — would hit a wall.

**And it sets up the death.** A rival who cannot be killed, demonstrated repeatedly, is the only reason quest 4 lands.


## 5b. Faction Cross-Texture

The antagonists carry the campaign's lesson without a single staged cross-faction encounter.

- **A Maw player** learns their guild's real vulnerability is the law, because someone is feeding it evidence one body at a time.
- **An Antler player** learns their rival was cheating the payroll with forbidden arts, that the world has a mechanism for that, and that their own boss is using them to circumvent it.
- **A Varenholm player** learns necromancy exists, that the Academy expels for it, and that expulsion does not remove the ability.

**Two of the three tie directly into the base game's systems** — Conscript, Necromancy, and Divine Intervention (GDD §3a). A player who runs the Antler or Varenholm campaign has been taught what the forbidden arts are and what answers them, which the base game otherwise leaves them to discover alone.


## 5c. The Antler Branch — Quest 5 Only

**The Antler's final quest forks. The other two factions do not.**

This belongs to the Antler because neutrality is their entire identity — the faction that refuses to take sides ends its campaign by forcing the player to take one.

### The Briefing

**Nothing is explained until the player accepts quest 5 from the hall.** Through quests 1–4 the player knows only that Roscarrow is dead and Holloway killed him.

On accepting, the truth arrives all at once:

- Roscarrow had been using **Conscript** for years, quietly, because free bodies mean no payroll.
- He crossed the threshold and **Divine Intervention named him**. Holloway killed him lawfully.
- Roscarrow and **Crane were lovers** for eleven years.
- **Holloway is still a hero.** Grants are permanent — he has simply been idle since, waiting for the world to name someone new.
- **Crane is not marked and has no cause.** She is going after a sanctioned hero for a killing everyone agrees was legal, because she cannot let it go.

**Then the player chooses a side, before the quest starts.** Both cases are presented. **No mechanical consequence is disclosed.**

### The Two Sides

| | **Side with Crane** | **Side with Holloway** |
|---|---|---|
| **The fight** | Kill Holloway and his allies | Kill Crane and her party |
| **Who dies** | Holloway, permanently | Crane, permanently |
| **The Antler after** | Crane remains First Horn | **Holloway becomes First Horn** |
| **The player becomes** | **A Villain** (GDD §3a) | Unmarked |
| **Grants** | **True Rest and the Hero perk transfer to the player, permanently** | None |
| **Consequence** | **Villain level 1.** Permanently hunted — two heroes named **3 quests later** at twice Holloway's bonus, and two more per hero killed after that. The 3-quest clock applies rather than Divine Intervention's usual 10, because this was a hero's death. No decay, no threshold, no exit but death. | Nothing pursues them. |
| **Also becomes a Villain** | **Crane, and every surviving hire in the party.** No bystander clause. | — |

**Both branches award the Mercenary's Gear set and complete the campaign.**

### This Uses Base Game Rules, Not New Ones

Both consequences are standard (GDD §3a) — the campaign is the player's first encounter with them, not an exception to them.

- **Everyone who helps kill a hero becomes a Villain.** There is no bystander clause. Crane becomes one too, along with every hire in the party who survives.
- **The dead hero's grants pass to the killers.** True Rest and the Hero perk, permanently, at **Villain level 1**.
- **Two new heroes are named after three quests**, each at twice Holloway's bonus, drawn from living NPCs who are not criminal, not widely hated, and have never touched a forbidden skill. The delay is standard and applies to every generation — killing a hero always buys three quests of quiet.

**The player has taken a hero's power by doing the one thing that guarantees heroes come forever.** Beating them raises their level and doubles the opposition again. It is the same trade a necromancer makes, arrived at through two people the player knows.

### The Consequences Are Revealed After

**The choice screen presents only the two arguments** — Crane's grief and Holloway's sanction. It says nothing about villainy, grants, or divine pursuit.

**The player learns what they took on in the end card**, after it is irreversible.

**Why.** A player told in advance that one path grants enormous permanent power and one grants nothing will take the power every time, and the choice stops being a choice. Told nothing, they pick a person — and then find out what picking that person meant.

**The Villain path is genuinely stronger and genuinely doomed**, which is the same trade the base game offers a necromancer. The campaign teaches that trade using two people the player knows.

### Faction Continuity

**The Antler survives either way**, with a different First Horn.

- **Crane holds:** the hall is unchanged. Her dialogue afterward is unchanged. She never mentions it again.
- **Holloway takes over:** he is First Horn from that point, and the hall's boss portrait and repeatable-contract dialogue change to his.

**A future life in the same world inherits whichever outcome happened.** The faction remembers; the character does not (§3).


## 6. The Twelve Characters

**The Antler and Varenholm Academy are borrowed institutions, not borrowed characters.** Both appear in the Sorcerer-Sword books, but this game is set in a different era — the buildings and reputations carry over; nobody who staffs them does.

**Four roles per faction:** recruiter, rival, boss, antagonist.

### The Gaping Maw — Assassins *(criminal)*

Not a guild so much as an appetite. They do not recruit; they notice you.

| Role | Character |
|---|---|
| **Recruiter** | **WREN SALLOW** — a fence who runs a laundry, never stops folding, treats murder as a scheduling problem |
| **Rival** | **KITE** — young, fast, already the Maw's best, and finds being challenged interesting rather than threatening |
| **Boss** | **OSSIAN VANE** — immaculate, warm, genuinely delighted by people; the charm is how the cruelty is delivered |
| **Antagonist** | **VESNA ARDEN, "THE LAMPLIGHTER"** — a ranger avenging her mother, who kills Maw members mid-contract and leaves a candle, proof of membership, and a living witness |

### The Antler — Mercenaries *(neutral)*

A contract company that takes any side and honours the paper exactly. Their neutrality is professional, absolute, and a point of pride.

| Role | Character |
|---|---|
| **Recruiter** | **BREGGA HOLT** — quartermaster, runs recruitment like inventory, assesses you unflatteringly and hires you anyway |
| **Rival** | **DAIN ROSCARROW** — long-serving, contemptuous of adventurers passing through, respects only finishing. **Secretly Crane's lover, and secretly a Conscript user.** |
| **Boss** | **FIRST HORN ALDIS CRANE** — commands by reputation, talks about contracts like terrain, never raises her voice. **Roscarrow's lover; will not say so.** |
| **Antagonist** | **HOLLOWAY** — a drunk, promiscuous, sanctioned **Hero** who lawfully executed Roscarrow for using Conscript |

### Varenholm Academy — Battle Mages *(legal)*

The lawful arm with credentials. They are called when the streets have already failed.

| Role | Character |
|---|---|
| **Recruiter** | **ADEPT LIRIEN** — a proctor with a clipboard and no patience; scrupulously fair about the player being provisional |
| **Rival** | **CASSIEL VAUNT** — top of the cohort and correct about it; views the player as an irregularity being waved through |
| **Boss** | **MAGISTER ILARIA VENN** — the only boss who asks the player questions and waits for the answers |
| **Antagonist** | **THE QUIET** — a genius expelled from Varenholm for necromancy, who kills mages before they can speak |

## 6a. Campaign Character Loadouts

**Rivals, bosses, and antagonists all fight at boss scale** — more equipped skills than a standard NPC (GDD §2), because every one of them is a witnessing opportunity. A player who fights beside a rival for two quests and against a boss at quest 5 sees a large share of that faction's list without buying anything.

**Recruiters never fight** and carry no loadout.

### The Gaping Maw

| | Perks | Actives |
|---|---|---|
| **KITE** *(rival · rogue)* | Opportunist, Carrion Sense | Backstab, Vanishing Strike, Ghoststep, Marked for the Knife, Smoke Bomb |
| **OSSIAN VANE** *(boss · rogue/mage)* | Case the Room, Cloak of Shadows | Shadow Lance, Whisper of Ending, Throat Work, Marked for the Knife, Blood Price |
| **VESNA ARDEN** *(antagonist · ranger)* | Marksman, Carrion Sense | Killing Angle, Poisoned Quarrel, Silent Loosing, Ranging Ward, Snare |

**Arden never leaves the back lane.** Killing Angle scales with allies between her and the target, so she plays behind her Witnesses and gets stronger the more of them stand in the way. A melee player must cut through her line to reach her, and her damage climbs the whole time.

### The Antler

| | Perks | Actives |
|---|---|---|
| **DAIN ROSCARROW** *(rival · fighter)* | Momentum, Hold the Road | Line Advance, Shield Breaker, Veteran's Cut, Cleave, Sunder |
| **ALDIS CRANE** *(boss · tank/fighter)* | Bulwark, Momentum | Bulwark Formation, Hold the Road, Paid in Full, Line Advance, Shield Breaker |
| **HOLLOWAY** *(antagonist · hero/fighter)* | Momentum, Bulwark, **Hero** *(no slot)* | Cleave, Sunder, Veteran's Cut, Shield Breaker, **True Rest** *(no slot)* |

**Roscarrow also carries Conscript**, which he never uses in front of the player — the four fighters he brings to quest 4 are already conscripted when they arrive. It is why Holloway comes for him.

**Crane and Holloway are the same fight from opposite sides.** Both are Antler fighters who learned in the same company; the difference is Holloway's two free grants. Her Bulwark Formation splits damage across her guard, so an opening Backstab lands before the formation sets.

### Varenholm Academy

| | Perks | Actives |
|---|---|---|
| **CASSIEL VAUNT** *(rival · mage)* | Arcane Focus, Spellblade Form | Chain Lightning, Prismatic Bolt, Countersign, Aegis Protocol, Warding Stance |
| **MAGISTER ILARIA VENN** *(boss · mage/healer)* | Arcane Focus, See Invisibility | Chain Lightning, Arcane Cascade, Dispel, Restorative Circle, Aegis Protocol |
| **THE QUIET** *(antagonist · necromancer)* | Arcane Focus, See Invisibility | **Necromancy**, Silenced Step, Whisper of Ending, Shadow Lance, Chain Lightning |

**The Quiet opens every fight with Silenced Step**, which denies a caster's next action — the mechanic Vaunt explains one quest before dying to it. He raises the Risen mid-fight and keeps raising, and **See Invisibility** means stealth does not work on him.

### Witnessing Value

| Faction | Skills a player can witness from these three alone |
|---|---|
| **The Gaping Maw** | 12 of 24 |
| **The Antler** | 11 of 24 |
| **Varenholm Academy** | 12 of 24 |

**Roughly half of each faction's list is available from its three named characters**, before counting any of the five enemy types. Fighting beside a rival and against a boss is the fastest witnessing in the game.

## 7. Faction Exclusivity

**A player may run all three campaigns across separate lives**, but only one per life.

Accepting a recruiter's offer closes the other two for that character. The refused recruiters never contact them again.

**Why:** it keeps a run under 30 minutes, makes alignment a real commitment, and gives permadeath a second meaning — the reincarnation and nepotism systems (§7) become the way a player sees the other two campaigns.

**On the nepotism path, the heir starts uncontacted.** They qualify on their own record, not their parent's, so an heir may end up in a different faction than the parent — which is a story the base game generates for free.

---

## 8. Dialogue

### Writing Rules — Follow These Exactly

**The player must never be confused about what is happening or what to do next.**

Every line follows the same shape:

1. **Grab attention** — say something that makes them look up.
2. **State the problem, or what you want** — plainly. No hinting.
3. **Call to action** — tell them exactly what to do.

**Write at a fifth-grade reading level.** Short sentences. Common words. No metaphors that carry information. If a line is clever but unclear, it is wrong.

**Personality comes from word choice, not from being indirect.** The Maw is blunt about murder. The Antler talks about money and paper. Varenholm sounds like a teacher. None of them hide the point.

### Every Line Must Carry Something

**No filler.** A line that only fills air is worse than no line, because it teaches the player to stop reading.

Every line must deliver at least one of these:

| | |
|---|---|
| **Backstory** | Something about who this person is or what happened to them |
| **A want or a need** | What they are trying to get |
| **A regret** | What they would undo |
| **A compliment or an insult** | A read on the player, earned |
| **Tactical information** | What to do right now, or how this enemy works |

**The test:** cover the speaker's name and ask what the player learned. If the answer is nothing, cut the line.

**Length allowance.** Combat banter stays to one line. **Debriefs, motivations, and appreciation may run three or four** — these are the moments where a character explains why they do this, or tells the player they did well, and rushing them wastes the only chance the campaign has to make anyone likeable.

**Every faction gets one motivation speech per recruiter**, available in the hall at any time after quest 2. It is the only optional dialogue in the campaign and the only place a character talks about themselves unprompted.

**Bad:** *"Don't let him talk. He talks and then he swings."* — states nothing the player couldn't see.
**Good:** *"He fought beside Dain for six years before the world turned him into a weapon. He knows how we move."* — backstory, threat assessment, and grief in one line.

**Tokens:** `{target}` is vocative and dropped in voice. `{they}` `{them}` `{their}` are spoken as pronouns and shown as names.

---

# THE GAPING MAW

*Blunt. Says the ugly thing out loud. Never pretends the work is something else.*

## WREN SALLOW — Recruiter

**The offer**
> "Don't stop walking. Fold something. There — now we're just two people talking."
>
> "I run this laundry. I also pass messages for a guild of assassins called the Gaping Maw. That's not a rumour, that's my actual job."
>
> "You did a job last week. Left the door open, walked out the front, and four people can describe your face. I know because three of them described it to me."
>
> "It was terrible, {target}. Genuinely one of the worst I've seen. But the man is dead and you didn't hesitate, and I can't teach either of those."
>
> "The rest of it I can teach. Come work for us — good pay, steady work, and in six months nobody will remember seeing you at all."

**Tutorial — on accepting**
> "Your jobs come from us now. Not the town board — you come here, behind the laundry, and I'll have something waiting."
>
> "There are five. Each one is harder than the last, so take them in order and don't get ahead of yourself."
>
> "You'll pick things up watching our people work — skills you can't buy anywhere, only see. Pay attention during the fighting."
>
> "Finish all five and you get a full set of Maw gear and the run of everything you saw along the way."

**On declining**
> "Fine. I'm here every day if you change your mind."

**Quest 1 debrief**
> "Two witnesses this time instead of four. That's not a joke, that's improvement."
>
> "Nobody died who wasn't supposed to, either. Come back tomorrow."

**Quest 2 debrief**
> "You got the ledger before the watch did. Three of our people can still walk through this city, and yesterday they couldn't have."
>
> "I've been doing this eleven years, {target}, and I've watched most people wash out by now."

**Quest 3 debrief**
> "You brought Kite home in one piece. {they} won't thank you for it, so I will."

**Quest 4 debrief** *(quiet, still folding)*
> "I heard. Sit down a minute."
>
> "I trained {them}. Fourteen years old, stealing bread, wouldn't tell me {their} name for a month."
>
> "You did nothing wrong. There was nothing to do. Vane wants you upstairs when you're ready."

**Why she does this** *(hall, any time after quest 2)*
> "People ask how I sleep at night. I tell them I fold shirts and pass on messages, and that I have never killed anyone."
>
> "Every word of that is true and none of it is honest. You'll learn the difference, and you'll sleep fine too."

## KITE — Rival

**After quest 1**
> "You're the new one. I'm Kite — I've been the best the Maw has for about four years now, and I read the report on your first job."
>
> "It was a mess and you still finished it. Most people manage neither."
>
> "But it was easy, and the ones that pay properly aren't. I take those. If you came on one tomorrow you'd die on it, and I'd have to explain that to Wren."
>
> "So get stronger, {target}. Then I'll take you with me and you can find out what the money actually looks like."

**After quest 2**
> "Two for two. All right, I'm paying attention now."

**Quest 3 — joining the party**
> "I'm coming with you on this one. You're not ready to go alone."

**Quest 3–4 banter**
> "Take the left one — {they} guards a doorway all day and doesn't know how to be flanked."
>
> "Good. Vane hears about every job, and he heard about that one."

**Quest 3 — after the fight**
> "You didn't need me on that. I want you to know I noticed."
>
> "Everyone Wren brings in wants to be me. You're the first one who might actually get there."

**Quest 4 — before it goes wrong**
> "I've never worked with anyone twice. Not once, not in six years."
>
> "This is twice, {target}. Don't make it strange."

**Quest 4 — death** *(mid-strike, knife already up)*
> "{target} — run!"

## VESNA ARDEN, "THE LAMPLIGHTER" — Antagonist

**Quest 4 — appearance** *(the target is still alive and watching)*
> "Wait. Let {them} lift the knife first. It doesn't count otherwise."

**Quest 4 — after the kill**
> "Your people killed my mother. My own father paid them to do it, and I dealt with him last year."
>
> "So now I wait. I let one of you get all the way to the knife, and then I take you — and whoever you came for walks home and tells everybody."
>
> "There's a candle on him. A guild token. The name of the man he was paid to kill. The watch will have all of it by morning."
>
> "That's why you're breathing, {target}. Somebody has to have seen it. Go on — go and tell them." 

**Quest 5 — final encounter**
> "Vane. Finally. I've been leaving bodies where you'd have to notice them."
>
> "You can't buy me and you can't frighten me — the only thing I ever wanted is already in the watch house, in writing."
>
> "Kill me tonight and it changes nothing. They have eleven names and a pattern. You're finished either way and you came anyway, which I appreciate."

## OSSIAN VANE — Boss

**First hall visit**
> "I'm Ossian Vane. I run the Gaping Maw — every contract, every name, every one of us."
>
> "I like to look at new people myself, before anyone tells me what to think about them. Wren has opinions and Wren is usually right, which is exactly why I don't want to hear them first."
>
> "Go take a job. Come back here after and I'll tell you what I saw. That's the only interview you'll get from me."

**Quest 5 — hunting together**
> "Kite was the best I had. Vesna Arden killed {them} on an ordinary contract, in front of you, and left a candle on the body."
>
> "She's done that eleven times in a year. Every corpse comes with a guild token and the name of the target, and the watch collects all of it."
>
> "Understand what that means. We only exist because nobody can prove we do, and she has spent a year building that proof one body at a time."
>
> "So we find her tonight. Stay behind me, {target}, and watch how this is done properly."

**Quest 5 — after Arden falls**
> "Stop. Look at me."
>
> "I have lost people before and hired someone new by the end of the week. I didn't want to do that this time."
>
> "You did the job Kite would have done tonight, and you did it well. From now on the work {they} used to get comes to you."

**Ending**
> "It's finished. She won't be writing anything else down."
>
> "People think we're called the Gaping Maw because we're hungry. We're not."
>
> "It's what a mouth looks like right before it shuts. Welcome in, {target}."

---

# THE ANTLER

*Businesslike. Talks about money, paper, and finishing what you started.*

## BREGGA HOLT — Recruiter

**The offer**
> "Stand still a moment. I'm looking at you."
>
> "This is the Antler. We're a mercenary company — we take contracts from anybody who pays, criminals and magistrates alike, and we don't ask which one you are."
>
> "Nobody recommended you, by the way. The others make a show of having noticed people. We're just always hiring, and that's the honest truth."
>
> "We take a job, we finish it, we get paid. Nothing underneath it. Want in, {target}?"

**Tutorial — on accepting**
> "Work comes from this hall now, not the town board. Walk in, take what's on the slate."
>
> "Five contracts, in order, each harder than the one before it."
>
> "You'll learn things off our people while you fight beside them — techniques that aren't for sale, only for watching."
>
> "Finish all five and the company issues you a full set of Antler gear, and everything you picked up stays yours."

**On declining** *(Holt does not return; the offer stays in the town menu permanently)*
> "Suit yourself. The offer stays open — I just won't ask again."

**Quest 1 debrief**
> "Job done, paperwork filed, you got paid. That's the whole business."

**Quest 2 debrief**
> "Client tried to renegotiate halfway through and you held him to the paper. Do that every time and people stop trying it."

**Quest 3 debrief**
> "Roscarrow filed a report on you. Two lines, both positive. He's never once done that."

**Quest 4 debrief** *(the ledger is open and she is not writing)*
> "I've got to close his file today and I don't want to."
>
> "Nineteen years he was on these books. Nineteen years, and it's four lines to end it."
>
> "Crane wants you. Go up when you're ready — take your time, she's not going anywhere."

**Why she does this** *(hall, any time after quest 2)*
> "I was a soldier for a country that changed its mind about what it wanted from me."
>
> "Here the paper says what I'm doing before I start, and nobody rewrites it while I'm out there. After nine years of the other thing, I'd take that over better pay."

## DAIN ROSCARROW — Rival

**After quest 1**
> "Roscarrow. Nineteen years with this company, which makes me the one who tells you things."
>
> "You signed on and you finished a contract. Most adventurers we hire quit before that — they treat us as somewhere to stand while they wait for something better."
>
> "The contracts that pay real money can kill you, and I take those. You're not ready for one, and I'd rather say that now than at your funeral."
>
> "Get better, {target}, and I'll bring you on one myself."

**After quest 2**
> "Twice now. I'm starting to think you'll stay."

**Quest 3 — joining the party**
> "I'm on this one with you. You'd lose it alone and the contract doesn't care."

**Quest 3–4 banter**
> "Hold where you are. Chase them and they pull you off the road, and the contract is the road."
>
> "That's how you last. I've buried eleven who couldn't do it that way."

**Quest 3 — after the fight**
> "I've had you wrong. I said you'd take three contracts and leave — you're past that and still here."
>
> "I'd sign with you again. Write that down somewhere, I don't say it."

**Quest 4 — before it goes wrong**
> "There's things about how I run my crews I've never explained to anyone."
>
> "If it ever comes up, {target} — I did it so nobody I hired had to die filling a gap. That's the whole reason."

**Quest 4 — death**
> "Finish the job. That's what we signed."

## HOLLOWAY — Antagonist

**Quest 4 — appearance** *(visibly drunk, entirely steady)*
> "Roscarrow. There you are."

**Quest 4 — after the kill**
> "Look at his crew. Look properly. He didn't hire them — he beat them and made them fight for him. That's a skill called Conscript and he's been using it for years, because free soldiers cost nothing and his contracts came in cheaper than anyone's."
>
> "Conscript is forbidden. Use it enough and the world answers — it picks somebody, gives them strength they didn't earn, and points them at you. It picked me. I'm called a hero and I didn't ask to be."
>
> "Every part of what I just did was lawful. Ask anyone."
>
> "You're not on my list, {target}. I only get one name at a time. Go back and tell them exactly what you saw."

**Quest 5 — HOLLOWAY speaks, facing Crane and the player**
> "Crane. I wondered if you'd come."
>
> "You know it was legal. You've known since the night it happened."
>
> "And it's been a year and nobody's given me another job, so — fine. Let's go."

**Quest 5 — HOLLOWAY speaks, with the player at his side**
> "You actually listened. Nobody listens."
>
> "I'm not the good one here, {target}. I'm the one who was right. That's not the same thing."
>
> "Stand on my left. I'm not as steady as I look."

**Quest 5 — HOLLOWAY speaks, during the fight**
> "She's better than me. Watch her hands, not her eyes."
> "I killed a man she loved and I'd do it again, and I still can't look at her."
> "Aldis — stop. Please stop."
> "Every one of them signed a contract this morning. They'll hold the line until she calls it — that's all they know how to do." 

**Quest 5 — after Crane falls**
> "Don't say anything yet. Just stand there a minute."
>
> "I've been the man who does the necessary thing for a year and nobody has once stood next to me while I did it."
>
> "You did. That's — that's the whole of what I've got to say about it."

**Ending — Holloway takes over**
> "So I run the company now. That's going to go badly and everyone knows it."
>
> "She wasn't wrong to want him back. She was wrong about what to do about it."
>
> "Contracts still get honoured. And I'll still go out when I'm called — there's never a shortage."

## FIRST HORN ALDIS CRANE — Boss

**First hall visit**
> "Aldis Crane. They call me First Horn, which is this company's word for the person in charge, and it's older than anyone can explain."
>
> "You signed. Around here that means something — everything we are is a promise written down and then kept."
>
> "I'm not going to give you a speech about honour. Everything we owe anyone is written down, and I've never once had to argue about what I meant."
>
> "Take a contract. Finish it. That's the whole welcome and there isn't a ceremony."

**Quest 5 — the briefing** *(everything, all at once)*
> "Sit down. You're owed the truth before you decide anything."
>
> "Roscarrow was using Conscript for years. That's why his costs were so low and why I never asked."
>
> "The world sent a hero named Holloway to stop him, and Holloway killed him. Every part of that was legal."
>
> "Dain and I were together. Eleven years. Nobody in this company knew and I'm only telling you because you're owed it before you choose." 
>
> "Nobody has marked me and nobody has approved this. There's no paper on it at all. I'm going anyway."
>
> "Pick a side, {target}. I'm not going to make it sound better than it is."

**Quest 5 — player sides with her**
> "Then stay close and don't think about it too much."

**Quest 5 — CRANE speaks, during the fight**
> "Left flank. Move."
> "He fought beside Dain for six years in this company before the world made him a hero. He knows every formation we use."
> "He put Dain in the ground. Put him in one."
> "Get up, {target}. We're not finished."
> "He was granted strength, not skill. Make him swing more than twice and he tires." 

**Quest 5 — player sides against her**
> "Good. That's the right answer, and I'd have told you so if I were a better woman."
>
> "Come on. Don't make it slow."

**Quest 5 — after Holloway falls**
> "That's it. That's all of it."
>
> "Eleven years I ran this company and never asked anyone to do a thing that wasn't written down. Tonight I asked you."
>
> "You didn't have to come. I'll carry that, {target}, and so will you."

**Ending — Crane survives**
> "It's done. We're not discussing it again."
>
> "People ask how we sleep, working for thieves one week and judges the next."
>
> "We sleep fine. We say what we'll do and then we do it. Welcome to the Antler."

---

# VARENHOLM ACADEMY

*Clear and formal, like a good teacher. Explains things once, properly.*

## ADEPT LIRIEN — Recruiter

**The offer**
> "You're not a student here. I want that clear before I say anything else, because people get confused about it and then get hurt."
>
> "This is Varenholm Academy. We train battle mages, and when something magical goes wrong in this city and the watch can't handle it, we're who gets called."
>
> "We read every lawful contract filed in the city. Your name came up on work that actually got finished, which sounds like a low bar and is not."
>
> "We have far more work than we have mages, and the magisters have approved hiring irregulars. Come do some of it, {target}. It pays, it's legal, and there's a real examination at the end."

**Tutorial — on accepting**
> "Your assignments come from the Academy now, not the town board. Report here."
>
> "There are five. Take them in order — the difficulty is graded and the grading is not decorative."
>
> "You will observe workings you cannot purchase. Watch carefully during engagements; observation is how irregulars learn anything at all here."
>
> "Finish all five and you are issued a full set of Academy gear, and everything you observed becomes available to you permanently."

**On declining**
> "Noted. The offer stays open — ask me any time."

**Quest 1 debrief**
> "Recorded. That was adequate. I said adequate, not good, and I meant it."

**Quest 2 debrief**
> "The notes are back on Academy shelves where they belong. Two magisters asked who did it."
>
> "I gave them your name correctly spelled. That is more than I do for most irregulars."

**Quest 3 debrief**
> "Vaunt has requested you again. {they} has never requested the same person twice."

**Quest 4 debrief** *(the clipboard is down)*
> "I have to write this up and I have written four drafts."
>
> "I proctored {their} first examination. {they} was fifteen and {they} corrected me, out loud, and {they} was right."
>
> "The Magister is expecting you. Go now — she does not like waiting and today I think she needs the company."

**Why she does this** *(hall, any time after quest 2)*
> "I am not a talented mage. I want that on the record because everyone works it out eventually."
>
> "What I am is the person who spots trouble three days early. There is one of me for four hundred students, which tells you how this place sets its priorities."

## CASSIEL VAUNT — Rival

**After quest 1**
> "Cassiel Vaunt. Top of my cohort, eleven years in this building, and yes I know how that sounds."
>
> "I read your file. It's very short. The result at the bottom is correct, though, and I checked it twice hoping it wouldn't be."
>
> "The assignments that matter go to qualified mages. That's not snobbery — it's that the unqualified ones die and the Academy has to write letters."
>
> "Get better, {target}, and I'll request you onto one myself. I would rather have you than most of my cohort."

**After quest 2**
> "Two assignments, no mistakes. I've stopped waiting for one."

**Quest 3 — joining the party**
> "I've assigned myself to you. Don't read anything into it."

**Quest 3–4 banter**
> "Stand on my left. My wards only cover one side and I'd rather not explain your death to Lirien."
>
> "Faster. Every working has a gap while it starts, and that gap is where students die."

**Quest 3 — after the fight**
> "You held the left without being told twice. Do you know how rare that is here?"
>
> "Eleven years I've been the one everyone measures themselves against. Nobody has ever just worked beside me."

**Quest 4 — before it goes wrong**
> "I was unfair to you at the start and I would like that corrected before anything else happens."
>
> "You aren't an irregularity being waved through. You're the only person on this assignment I'd want beside me."

**Quest 4 — death**
> "Don't — {target}, don't!"

## THE QUIET — Antagonist

**Quest 4 — appearance** *(steps out behind the caster, hand already raised)*
> "Every working starts with a word. Kill the mage before the word and there's no working at all."
>
> "That's the whole trick. Varenholm has never once written it down." 

**Quest 4 — after the kill**
> "{they} was casting a shield. Four words long, and I took {them} on the second one."
>
> "That was Varenholm's best student, and {they} died mid-sentence in front of you."
>
> "They threw me out a year ago. I raised one body — one — and they struck my name off the rolls, and they still teach out of my notes."
>
> "You're not worth my time, {target}. Go and tell Venn what you watched happen to {their} best." 

**Quest 5 — final encounter**
> "Magister. Go on — say something. One word."
>
> "You signed my expulsion in eleven seconds. I counted."

## MAGISTER ILARIA VENN — Boss

**First hall visit**
> "Magister Ilaria Venn. I run this Academy, which mostly means I decide who gets to keep practising and who doesn't."
>
> "I meet every irregular once. Most are here for the money, which is an honest reason and holds up under pressure — the ones who claim something nobler tend to break."
>
> "I don't know anything about you yet, and I would like to, so I'm going to ask you the easy question now: why did you take the job?"
>
> "Go do an assignment. Come back and I'll ask you the harder one."

**Quest 5 — hunting together**
> "I signed his expulsion myself, a year ago. I've thought about it most days since."
>
> "He was the best student I ever had. He raised a corpse to find out whether he could, and now he's killing my people."
>
> "We're going after him tonight. Stay close, {target}, and when I say cover your ears, do it right then."

**Quest 5 — after The Quiet falls**
> "Sit. I'm going to say something and then we won't return to it."
>
> "I have signed forty expulsions. I remembered his name every day for a year and I could not tell you a single one of the others."
>
> "You carried that with me tonight and you were never obliged to. Thank you, {target}."

**Ending**
> "Why did you take the lawful jobs? Tell me honestly."
>
> "Most say the money, and I believe them. The ones who tell me it was duty are usually lying, and liars are harder to place."
>
> "You'll do. Not because you're good — because you're honest about why you're here."

---

## 10. Rewards

**Gold is ordinary** — campaign contracts pay standard tier rates (§16 of the GDD). No special payouts.

### Faction Titles — Three Tiers Each

Separate from and stackable with the nepotism title (GDD §7). A character can hold both.

**Titles grant skill progression, not stats.** Faction membership makes you better at your faction's craft — it does not make you physically different. This keeps the fixed-stat pillar intact.

**All three land inside the campaign.**

| Tier | Earned | Effect |
|---|---|---|
| **Basic** | **On joining** | Affected skills level **2× faster** |
| **Intermediate** | **Quest 2 completed** | Affected skills level **3× faster** |
| **Advanced** | **Quest 4 completed** | **Affected skills manifest one tier above their actual level** |

### What "Affected Skills" Means

Each faction covers **two archetypes**, plus **all 24 of its own campaign skills** regardless of archetype.

| Faction | Archetypes | Plus |
|---|---|---|
| **The Gaping Maw** | Rogue · Ranger | All 24 Maw skills (§13a) |
| **The Antler** | Fighter · Tank | All 24 Antler skills (§13b) |
| **Varenholm Academy** | Mage · Healer | All 24 Varenholm skills (§13c) |

### The Advanced Tier Is the Real Prize

**One tier above actual level** means:

- A skill at level 1–9 manifests as **intermediate**.
- A skill at level 10–24 manifests as **advanced**.
- A skill already at 25+ is unchanged — there is no fourth tier.

A Maw member finishing quest 4 has every rogue and ranger skill they own jump a manifestation immediately. **Backstab at level 3 starts hitting like Backstab at level 15.**

**This is stronger than any gear set in the game** — a set floors matching skills at level 10 or 15, while an advanced title lifts them a whole tier from wherever they already are, and stacks on top of a set.

### The Nine Titles

| Faction | Basic | Intermediate | Advanced |
|---|---|---|---|
| **The Gaping Maw** | *Of the Maw* | *Red Hand of the Maw* | *The Maw's Own* |
| **The Antler** | *Contracted* | *Sworn of the Antler* | *Antler Vanguard* |
| **Varenholm Academy** | *Irregular of Varenholm* | *Adept Irregular* | *Magister's Hand* |

**Displayed on the character panel** alongside the nepotism title if both are held.

**Pacing note.** The full progression arrives in under half an hour, which is the steepest reward curve in the game. That is deliberate — the campaign is a fast, decisive commitment. But an inducted character diverges sharply from an uninducted one very early, and it should be watched in testing.

### Faction Gear Sets

**Granted on completing quest 5.** Not purchasable, not sold in any Store, and unavailable to anyone who did not finish that faction's campaign. It is the campaign's final reward and its only one that is an object.

| Set | Faction | Covers |
|---|---|---|
| **Assassin's Gear** | The Gaping Maw | All **Rogue** skills, plus **Sneak** |
| **Mercenary's Gear** | The Antler | All **Fighter** and **Tank** skills |
| **Battle Mage's Gear** | Varenholm Academy | All **Mage** and **Healing** skills |

**Two advantages over the four purchasable sets (GDD §10):**

1. **They floor at level 15**, not level 10 — a meaningfully higher intermediate.
2. **They span two archetypes**, where a purchasable set covers one. This is the real prize: the Mercenary's Gear is the only item in the game that raises a Fighter/Tank cross-build in a single purchase, and cross-builds are exactly what the classless design wants to encourage (GDD §15a).

**Re-issued once per life.** An inducted character who loses their set can collect a replacement free from their faction. **It is not re-issued after death** — a new life is uninducted, so the set is gone with the character who earned it. Heirs inherit it only if it was vaulted (GDD §7).

### No Failure Branch

**There is no dismissal.** The earlier draft branched on whether the player outperformed the rival; the rival now dies at quest 4 and the boss fights beside the player at quest 5. Completing quest 5 completes the campaign, full stop.

**Failing quest 5 is an ordinary quest failure** — retry it from the hall. Dying during quest 5 is an ordinary permadeath (GDD §7), and the campaign is simply unfinished for that character.

---

## 10a. The Support Ask — Shown Twice

**The ask appears exactly twice in a playthrough**, and the first one is the one most people will see.

| # | Trigger | Form |
|---|---|---|
| **1** | **After any 2 contracts completed** — faction, solo, or party, any alignment | Short panel, dismissible |
| **2** | **After quest 5** — campaign complete | The full end card (§10b) |

**Why two contracts.** At a 30-second-to-2-minute median session, a player who has finished two contracts has already outlasted most of the audience and is demonstrably enjoying themselves. That is the moment to ask, and it arrives inside the window where people are still playing.

**Never a third time.** Two asks is generous; three is nagging. After the second it lives passively on the title screen and in the pause menu and never interrupts again.

### The First Ask — Short Panel

Appears once, on returning to town after the second completed contract.

> **Enjoying this?**
>
> One person made this game. If you'd like to help fund the next one, you can support it directly — it all goes into building something bigger.
>
> **[ Support the next game ]**  ·  **[ Not now ]**
>
> Supporters get a password for a hidden character who is not remotely balanced.

**Rules:**
- One screen, two buttons, dismissed instantly by either.
- **Never blocks.** No timer, no forced read, no delay before the buttons work.
- **Never shown again** regardless of which button is pressed.
- Fires on the town screen, not mid-quest.

## 10b. The End Card

**Appears once, after quest 5 resolves.** Full screen, dismissible, and reachable again afterward from the faction hall.

**Order of contents:**

**1 · The closing line.** The boss speaks last — induction or dismissal (§8). This is the story ending and it plays before anything else.

**2 · The reward.** The faction gear set is awarded on screen, named and shown.

**2a · The Antler branch reveal — Crane's side only.** After the gear award, and only for a player who helped kill Holloway:

> **Villain — Level 1.**
>
> Killing a hero is the one crime the world answers personally, and everyone who helped is guilty. His grants are yours: True Rest, and the Hero perk, permanently and without condition.
>
> So is his position. **Two heroes will be named in three quests**, each twice as strong as the man you buried. Kill them and four follow. Kill those and eight.
>
> Three quests is what a hero's death is worth, every time, forever. Spend them well.
>
> You will gain a level with every kill. It will not be enough, and nothing you do from here will clear the mark.
>
> **Nobody told you. That was the point.**

**Holloway's side sees nothing here.** The absence is the reward, and it only reads as one because the other branch exists.

**3 · The ask.**

> **Thanks for playing.**
>
> This game was made by one person. If you enjoyed it and want to help fund the next one, you can support the project directly — every contribution goes into making the next game bigger than this one.
>
> **[ Support the next game ]**
>
> Supporters also get the password for a hidden character. He has purple dreadlocks, three turns a round, and multiplies all gold by ten. He is not balanced and that is the point.

**3a · The skill unlock.** Shown on both branches, every faction:

> **72 skills are now available at the trainer.**
>
> Everything you witnessed on these five quests, and everything belonging to the two factions you never joined. All of it, permanently, for every character you play from here.
>
> You saw a fraction of it. Go and buy the rest.

**4 · The rest of the work.**

> **More at neverendingnarratives.com**
>
> Other games, and the *Sorcerer-Sword* audiobooks and novels — the same world this campaign's institutions came from, several centuries later.

**5 · Return to play.** A clear button back into the game. The campaign ends; the character does not.

### End Card Rules

- **Never blocks play.** One dismissible screen, no gates, no forced wait.
- **This is the second and final ask.** The first came after two contracts (§10a). Beyond these two the link lives passively on the title screen and in the pause menu and never interrupts again.
- **Shows once automatically.** After that it lives in the faction hall for anyone who wants the links again.
- **Not shown on death.** A character who dies during quest 5 sees the ordinary death screen. The end card is for finishing.
- **Both branches see it.** Dismissal is still an ending, and the support ask does not depend on the player having won.

### Design Note — This Makes the Campaign a Power Path

Earlier drafts kept campaign rewards deliberately thin so the campaign stayed genuinely optional. Titles and faction sets reverse that: **completing a campaign is now the strongest thing a character can do**, and a player who ignores it plays a weaker game.

That is a deliberate trade. The campaign exists to make factions matter, and rewards that matter are the most direct way to do it. But it should be understood as a change in what the base game is, not an addition to it.

## 11. Build Notes

- **The Antler campaign has a branch** (§5c). Quest 5 forks into two fights with different survivors, a different First Horn afterward, and a permanent mechanical consequence on one side only. The other two campaigns are linear.
- **Two existing skills rebalanced** (§0d): Backstab reworked into an any-lane opener/stealth burst at power 6.0, and every melee skill now applies **Exposed**.
- **72 new skills** (§13), witness-only during the campaign and permanently purchasable afterward — including the two factions the player never joined.
- **3 new status effects** (§13d): Poison, Burning, Shock.
- **15 new enemy types** (§14), each with a 5-skill pool equipping 2–3 per spawn, plus 15 mini-bosses.
- **Authored content total:** 12 characters, roughly 165 dialogue lines, 5 quests × 3 factions (13 encounters plus a boss each) with the climax authored in 3 staging variants, 9 titles, 3 gear sets.
- **Read §0 first.** This is an add-on to a working game: almost all of it is new content, one system is extended, and two lines are corrected. Nothing else about the existing build changes.
- **Everything else reuses** lanes, the 31-skill pool, the enemy roster, and the existing quest structure.
- **New GUI: the faction hall** (§4a) — a town location with its own quest board, standing tracker, quartermaster, and rival toggle.
- **New combat rule: rival non-death** (§5a) — at 0 HP a rival exits the encounter and returns for the next. Applies to exactly three characters and nobody else.
- **New screens: the support panel** (§10a, after 2 contracts) and **the end card** (§10b) — one full-screen dismissible panel after quest 5, carrying the closing line, the gear award, the support ask, and the neverendingnarratives.com link. Reachable afterward from the faction hall. The support ask fires exactly twice per playthrough and never again.
- **Faction contract counting** must persist after induction — the intermediate and advanced titles are earned across the rest of that life, not during the 30 minutes.
- **No new art beyond 9 bust portraits** matched to the §1a style lock.
- **Voice acting is optional and separate** from the 40-personality library — these are individual characters, not personality slots. If recorded, each needs its own actor and none may reuse a personality voice.

---

## 11a. Testing Constraint

**30 minutes is one faction run.** The developer cannot test all three campaigns in the time available, and no external player is expected to finish even one.

**Therefore:**

- **A debug skip is required**, not optional — jump to any quest of any faction with the appropriate titles and gear granted. Without it, two of the three campaigns ship unverified.
- **Build the Gaping Maw first and completely.** It is the fully written faction and the one most likely to be played, since criminal contracts are the ones players gravitate to unprompted.
- **The Antler and Varenholm can ship with the same structure and lighter verification.** They share every system with the Maw; only dialogue and staging differ, and dialogue does not crash.
- **Prioritise the first two minutes over the last twenty.** First contract, recruiter scene, hall visit, boss scene. That sequence is what most players will ever see of this campaign, and it is worth more testing attention than quest 5.

## 12. Open Questions

1. **Do the antagonists need portraits?** Three more bust portraits at the §1a style lock, or handled with a silhouette and no face — which would suit The Quiet and The Lamplighter especially.
2. **Does the antagonist appear anywhere before quest 4?** A single unexplained line in the feed or the hall around quest 2 would make the arrival land harder for almost no cost.
3. **Can the player retry quest 5 after failing it?** Currently yes, from the hall. Worth confirming that repeated attempts against the same boss don't cheapen it.
4. **Resolved — the Villain delay is 3 quests.** Divine Intervention's initial mark normally waits 10 quests, but killing a hero is a hero's death and buys the standard **3-quest reprieve** instead. A player who kills Holloway is hunted from quest 3 onward, not quest 10. The shorter clock is consistent with the act that caused it.
5. **Resolved — Holloway leads and works.** He commands the Antler while continuing as a hero, because there is no shortage of divine targets: forbidden-art users, the widely hated, and now Villains. His company takes contracts; he takes divine quests. The First Horn who is never available for ordinary work is an odd commander, and the Antler is exactly the kind of institution that would file it as a scheduling matter and move on.
5. **Does the Lamplighter's evidence do anything mechanically?** She has spent a year handing the watch court-usable proof of Maw membership. A one-line faction-standing consequence for the Maw — visible in the event feed — would make her a year of work rather than a boss fight.

---

# Part II — New Content

Everything below is introduced by the campaign and does not exist in the base game.

---

## 13. Campaign Skills — 72 New Entries

**24 per faction: 8 playstyles × 3 skills.**

**The faction is the lens.** Every archetype exists in every faction, but a Maw tank does not tank like an Antler tank. The Maw reflects damage using Backstab's calculation because that is the only violence they know how to do; the Antler wards the whole line because a line is what they are paid to hold.

### Acquisition

**During the campaign, these are witness-only.** They cannot be bought. The only way to obtain one is to see it used on a faction quest — which makes campaign enemies worth fighting rather than bypassing, and makes the rival worth keeping alive beside you.

**On completing any campaign, all 72 unlock at the trainer permanently** — including the 48 belonging to the two factions the player did not join.

**The player is told this explicitly** on the end card (§10b). It is the single best reason to finish a campaign and it should not be a surprise the player has to discover.

**They tier normally** (GDD §3): basic at levels 1–9, intermediate at 10–24, advanced at 25+, with the advanced name given below.

**One skill needs watching in testing.** Varenholm's **Prodigy** multiplies the levelling rate of *every* skill the character owns — 5× at advanced. The base game is 10 uses per level (GDD §15), so an advanced Prodigy reaches level 25 in 50 uses instead of 250. It is the single most valuable perk in either document and it is a Varenholm reward, which is thematically correct and mechanically enormous.

---

## 13a. The Gaping Maw — 24 Skills

*Shadow, poison, precision, silence. Everything is a knife wearing something else's clothes.*

### Rogue

| Skill | Effect | Advanced |
|---|---|---|
| **Vanishing Strike** *(active)* | Attack from stealth; if it kills, you re-enter stealth immediately | **Ghostwork** |
| **Marked for the Knife** *(active)* | Mark one enemy; all your damage against it ignores 50% of Defence | **Death Sentence** |
| **Ghoststep** *(active)* | Reposition to any lane for free; your next attack **takes no reflect damage** from any source (Bulwark, Thorn Skin, Cloak of Shadows, Blood Price, wards) | **Nowhere Step** |

### Ranger

| Skill | Effect | Advanced |
|---|---|---|
| **Poisoned Quarrel** *(active)* | Ranged hit applying stacking **Poison** (separate from Bleed) | **Weeping Shot** |
| **Silent Loosing** *(active)* | Ranged attack that does not reveal your lane or break stealth | **Unheard** |
| **Killing Angle** *(active)* | Damage scales with how many allies are between you and the target | **Perfect Line** |

### Fighter

| Skill | Effect | Advanced |
|---|---|---|
| **Throat Work** *(active)* | Fast strike; applies Bleed and reduces the target's healing received | **Red Work** |
| **Executioner's Rhythm** *(active)* | Each consecutive kill this battle increases your damage, no cap | **Tally** |
| **Butcher's Tempo** *(active)* | Attack twice at reduced power; both can apply Bleed | **Sixteen Cuts** |

### Tank

| Skill | Effect | Advanced |
|---|---|---|
| **Cloak of Shadows** *(active)* | Reduces damage taken; **reflects using Backstab's calculation** rather than a flat percentage | **Shroud** |
| **Blood Price** *(active)* | **Reflect, one-shot.** The next attack against you reflects **200%** of the damage dealt back at the attacker, then the effect ends. Stacks additively with Bulwark and any other reflect source. | **Debt Collected** |
| **Unseen Guard** *(active)* | Guard an ally; attackers cannot see who intercepted and take Bleed | **Nobody's There** |

### Mage

| Skill | Effect | Advanced |
|---|---|---|
| **Poison Spray** *(active)* | Acid damage across a lane, applying stacking **Poison** | **Corrosion** |
| **Whisper of Ending** *(active)* | **Shadow** damage over time, and applies **Withering** — all healing on the target is nullified for its duration. Basic 2 rounds · Intermediate 3 · Advanced 4. Cleansable like any status. | **Last Word** |
| **Shadow Lance** *(active)* | Pierces to the enemy back lane; damage rises the further it travels | **Long Dark** |

### Druid

| Skill | Effect | Advanced |
|---|---|---|
| **Serpent Form** *(active)* | Self-buff: attacks apply Poison, evasion increased | **Viper** |
| **Carrion Sense** *(perk)* | Reveals every enemy's current HP and lowest defence; lasts the battle | **Scavenger's Eye** |
| **Spider's Patience** *(active)* | Each round spent not attacking increases your next attack, no cap | **Web** |

### Healer

| Skill | Effect | Advanced |
|---|---|---|
| **Stitch and Run** *(active)* | Heal an ally and grant them one immediate free reposition | **Cut and Carry** |
| **Venom Draw** *(active)* | Remove all Poison from an ally and apply the total to one enemy | **Transfer** |
| **Last Breath** *(active)* | A downed ally acts once more before falling | **One More** |

### Utility

| Skill | Effect | Advanced |
|---|---|---|
| **Case the Room** *(perk)* | See enemy skill loadouts before the encounter begins | **Full Ledger** |
| **Corpse Work** *(perk)* | Killing an enemy yields additional gold and their carried items | **Undertaker** |
| **Quiet Word** *(perk)* | Encounter-resolution verb: **Threaten** — resolves against isolated targets | **Understanding** |

---

## 13b. The Antler — 24 Skills

*Formation, discipline, fire and steel. Everything is designed to hold a line long enough to get paid.*

### Rogue

| Skill | Effect | Advanced |
|---|---|---|
| **Flanking Pay** *(active)* | Bonus damage when an ally is engaged with the same target | **Pincer** |
| **Contract Mark** *(active)* | Mark a target; every ally deals bonus damage to it | **Named on the Paper** |
| **Scout's Cut** *(active)* | Strike and report: reveals the next encounter's composition | **Forward Element** |

### Ranger

| Skill | Effect | Advanced |
|---|---|---|
| **Suppressing Volley** *(active)* | Lane-wide low damage; affected enemies deal reduced damage next round | **Sustained Fire** |
| **Ranged Discipline** *(active)* | Each consecutive round attacking the same lane increases accuracy and damage | **Fire Control** |
| **Paid Shot** *(active)* | Damage scales with the contract's payout tier | **Full Fee** |

### Fighter

| Skill | Effect | Advanced |
|---|---|---|
| **Shield Breaker** *(active)* | Heavy strike that removes guard effects and armour bonuses | **Opened Up** |
| **Line Advance** *(active)* | Attack and push your whole front lane forward one position | **Press** |
| **Veteran's Cut** *(active)* | Damage increases for every prior encounter survived this quest | **Third Day** |

### Tank

| Skill | Effect | Advanced |
|---|---|---|
| **Hold the Road** *(active)* | Your lane cannot be pushed, flanked, or bypassed for two rounds | **Nobody Passes** |
| **Bulwark Formation** *(active)* | You and both adjacent allies share incoming damage equally | **The Wall** |
| **Paid in Full** *(active)* | Damage prevented this battle is dealt to one enemy at once | **Settling Up** |

### Mage

| Skill | Effect | Advanced |
|---|---|---|
| **Fire Barrier** *(active)* | Grants the party fire resistance and **inflicts Burning on anyone who attacks them** | **Wall of Coals** |
| **Siege Flame** *(active)* | Heavy single-lane fire damage; ignores cover entirely | **Breach** |
| **Ashfall** *(active)* | Persistent lane hazard dealing damage each round to whoever stands in it | **Scorched Ground** |

### Druid

| Skill | Effect | Advanced |
|---|---|---|
| **Warhound Form** *(active)* | Self-buff: increased damage and the ability to intercept for an ally | **Kennel-Bred** |
| **Beast Handler** *(perk)* | Conscripted and summoned allies gain your Defence bonus | **Master of Hounds** |
| **Quartermaster's Root** *(active)* | Heal the party a small amount between encounters, no action cost | **Provisioned** |

### Healer

| Skill | Effect | Advanced |
|---|---|---|
| **Stanch** *(active)* | Immediate heal that also removes Bleed and Burning | **Field Dressing** |
| **Company Medic** *(active)* | Heal every ally below 50% at once for a reduced amount | **Triage Line** |
| **Contract Bound** *(active)* | Bind yourself to an ally; damage they take is split with you and you both heal at encounter end | **Sworn Together** |

### Utility

| Skill | Effect | Advanced |
|---|---|---|
| **Terms of Engagement** *(perk)* | See the exact payout and encounter count before accepting any contract | **Read the Paper** |
| **Fallback Point** *(perk)* | Fleeing succeeds automatically once per quest | **Withdrawal** |
| **Muster** *(perk)* | Hired party members cost 25% less | **Standing Company** |

---

## 13c. Varenholm Academy — 24 Skills

*Formal working, wards, articulation. Power that has been written down, argued over, and approved.*

### Rogue

| Skill | Effect | Advanced |
|---|---|---|
| **Silenced Step** *(active)* | Move and attack without allowing the target to cast next round | **Gag** |
| **Ward Thief** *(active)* | Strike that strips one buff or ward from the target and grants it to you | **Requisition** |
| **Countersign** *(active)* | Interrupt: negates the next enemy skill used against your lane | **Refusal** |

### Ranger

| Skill | Effect | Advanced |
|---|---|---|
| **Aimed Cantrip** *(active)* | Ranged attack that applies a random elemental status | **Focused Working** |
| **Focal Shot** *(active)* | Damage scales with how many active buffs the target has | **Overload** |
| **Ranging Ward** *(active)* | Place a ward on a lane; enemies entering it take damage | **Perimeter** |

### Fighter

| Skill | Effect | Advanced |
|---|---|---|
| **Spellblade Form** *(active)* | Melee attacks deal elemental damage and scale with skill level, not weapon | **Written Edge** |
| **Runic Strike** *(active)* | Heavy hit that marks the target; your next spell against it cannot miss | **Inscribed** |
| **Disciplined Advance** *(active)* | Attack and gain a ward equal to a portion of the damage dealt | **Formal Progress** |

### Tank

| Skill | Effect | Advanced |
|---|---|---|
| **Warding Stance** *(active)* | Absorb damage into a ward that discharges as area damage when it breaks | **Rebound Ward** |
| **Absorption Field** *(active)* | Party takes reduced elemental damage; you are healed by the amount reduced | **Sink** |
| **Aegis Protocol** *(active)* | Grant one ally complete immunity for one round | **Sanctioned Protection** |

### Mage

| Skill | Effect | Advanced |
|---|---|---|
| **Chain Lightning** *(active)* | Jumps between enemies, losing power each jump, unlimited jumps | **Cascade** |
| **Prismatic Bolt** *(active)* | Damage type shifts to whatever the target resists least | **Solution** |
| **Arcane Cascade** *(active)* | Each spell cast this battle increases the next one's damage | **Compounding Working** |

### Druid

| Skill | Effect | Advanced |
|---|---|---|
| **Elemental Bond** *(active)* | Self-buff: your damage type matches the last one you took | **Attunement** |
| **Storm Shape** *(active)* | Self-buff: attacks hit an additional lane and apply a shock status | **Tempest Form** |
| **Growth Field** *(active)* | Terrain effect: allies in the lane regenerate each round | **Verdant Ground** |

### Healer

| Skill | Effect | Advanced |
|---|---|---|
| **Restorative Circle** *(active)* | Heal every ally in one lane and cleanse one status from each | **Full Circle** |
| **Purge Ward** *(active)* | Ally becomes immune to negative status for two rounds | **Clean Working** |
| **Vital Anchor** *(active)* | Anchor an ally; they cannot drop below 1 HP for two rounds | **Held** |

### Utility

| Skill | Effect | Advanced |
|---|---|---|
| **See Invisibility** *(perk)* | Reveals stealthed and hidden enemies, and **negates their stealth bonuses** — the counter to Vanishing Strike, Silent Loosing, Smoke Bomb, Vanish, and Ghoststep. Intermediate: also see enemy **equipped skills**. Advanced: also see enemy **perks**. | **Full Sight** |
| **Dispel** *(active)* | Remove all buffs and wards from one enemy | **Struck From the Record** |
| **Prodigy** *(perk)* | **All your skills level faster** — 2× at basic, 3× at intermediate, **5× at advanced.** Applies to every skill you own, not just Varenholm ones. | **Once In A Generation** |

---

## 13d. Reflect and Damage Types — Clarifications

**Reflect is the dominant defensive mechanic in this game.** Bulwark, Thorn Skin, Guardian Ward, Shield Wall, Cloak of Shadows, Blood Price, Warding Stance, and Rebound Ward all return damage. Any skill claiming to bypass a defence should say *reflect* specifically, because that is what is actually on the board.

**Multiple reflect sources stack additively.** A character running Bulwark at advanced (60%) plus Thorn Skin (50%) returns 110% of what hits them, and Blood Price adds another 200% for one attack on top of that.

**Damage types in play:** physical, fire, cold, and **shadow** (new — Maw signature, and what Prismatic Bolt will select against a target with no shadow resistance).

**Worked example — Exposed chaining.** A fighter at ATK 12 opens with Backstab (power 6.0, any lane) for `round(12 × 6.0 × 1.015) − 10 = 63`, applying 1 Exposed. Sunder next: 14 damage, strips 12 DEF, and consumes the stack for +20% — 17 instead. Now 1 fresh stack. Butcher's Tempo hits twice: the first consumes the stack at +20%, the second applies two more. Cleave arrives into 2 stacks at +40%.

**In a party this compounds fast.** Two melee characters alternating means every hit lands into stacks the other one left, and nobody has to coordinate anything for it to work.

**Stealth now has a counter.** The Maw's kit leans heavily on hiding — Vanishing Strike, Silent Loosing, Ghoststep, plus the base game's Smoke Bomb and Vanish. **See Invisibility** (Varenholm utility) reveals all of it and strips the bonuses. This is deliberate: the faction that documents everything is the faction that can see the faction that hides.

**There are no counterattacks in this game, by design.** Every mechanic that would be a counter elsewhere is implemented as reflect. Any skill text using the word "counter" means reflect and should say so.

**Resolved:** the base GDD's **Marksman** at advanced now reads *back-lane attacks take no reflect damage from any source*, matching Ghoststep. Two skills grant reflect immunity — one by staying at range, one by moving through the shadows to get there.

## 13d-2. Perks — Rules

**Perks exist only in their advanced form. There is no basic or intermediate perk.**

A perk is bought whole. Every effect listed for it applies from the moment it is learned, permanently, at full strength.

**Where a table shows three columns for a perk, that is one cumulative effect described in stages, not a progression.** Bulwark reduces damage 20%, protects adjacent allies, *and* reflects 60% — all of it, immediately. Arcane Focus increases elemental damage, reduces its cost, *and* strikes an additional adjacent target — all of it, immediately. The Advanced column is the perk's name and nothing more.

### Perks Are Gold Only

| Rule | Detail |
|---|---|
| **Never witnessable** | Watching an enemy use a perk teaches nothing. Only actives can be witnessed. |
| **Bought at the trainer** | Gold is the only route. Campaign perks become purchasable the moment the player joins that faction — they cannot be witnessed, so there must be a way in. |
| **Enemies still use them** | Perks appear in enemy pools (§14) because enemies fight with them. They simply never enter the player's journal. |

### Perks Cannot Be Levelled, Lifted, or Removed

| Rule | Detail |
|---|---|
| **No levelling** | No use count, no tiers, nothing to progress. |
| **Not affected by title tiers** | An advanced faction title (§10) lifts *skills* one tier. Perks are already at their only form. |
| **Not affected by gear sets** | Sets floor *skills* at level 10 or 15. Perks are untouched. |
| **Not affected by Prodigy** | It multiplies levelling speed. Nothing to multiply. |
| **Cannot be stolen** | **Ward Thief** strips buffs and wards. A perk is neither. |
| **Cannot be dispelled** | **Dispel**, **Cleanse**, **Purify** and every removal effect target buffs, wards, and statuses only. |
| **Cannot be suppressed** | No effect in either document turns a perk off, for any duration. |

### Why They Are Built This Way

**Perks are deliberately overpowered, and deliberately expensive.**

They cost 150g each and cannot be earned any other way, so the first real decision a player makes is which perk to save for and build around. A discerning player takes one early and shapes everything else to it — a tank who buys Bulwark first is committing to being hit, and a mage who buys Arcane Focus first is committing to elements.

**Actives are the part that grows. Perks are the part you choose.** Actives climb through use, tiers, sets, and titles; perks are simply true from the day they are bought and no effect in the game can take them away.

**Slot cost is the balance.** At slice limits a player holds 3 perks against 4 actives — so three permanent full-strength effects, and no more, ever.

## 13e. New Status Effects

Three statuses the base game does not have. All stack independently of Bleed.

| Status | Effect |
|---|---|
| **Poison** | Damage over time. **Stacks without limit** and does not expire until cleansed. Maw signature. |
| **Withering** | **All healing on the target is nullified**, including overheal-to-temporary-HP. Duration set by the applying skill's tier. Cleansable. Maw signature. |
| **Exposed** | Applied by **every melee skill** (§0d). Each stack adds **+20% damage to the next melee attack** against that target. The next melee hit **consumes every stack at once**. Stacks without limit, expires at end of battle, and is cleansable — though cleansing it is rarely worth an action. |
| **Burning** | Damage over time that also reduces Defence while active. Expires after 3 rounds. Antler signature. |
| **Shock** | Target acts last in the round and cannot use interrupt skills. Expires after 1 round. Varenholm signature. |

---

## 14. Campaign Enemies — 15 New Types

**Five per faction.** None appear in the base game's roster (GDD §17).

**Every enemy carries a pool of 5 witnessable skills and equips only 2–3 per encounter**, rolled at spawn.

**Coverage requirement — hard rule.** Every **active** in a faction's 24 must appear in at least one of that faction's enemy or mini-boss pools. Actives are witness-only until the end card (§13), so an active in no pool is one nobody can obtain during a campaign. **Verify this whenever a skill or enemy changes.**

**Perks are exempt** — they can never be witnessed (§13d-2) and are bought at the trainer once the player joins that faction. They still appear in enemy pools because enemies fight with them.

**Every skill is tagged perk or active** in §13. **10 perks, 62 actives** across the three factions — self-buffs with a duration are actives, not perks. A player at slice limits carries 3 perks and 4 actives, so most of a faction's list will never fit in one loadout — which is the point of them all unlocking permanently afterward. A player who fights the same enemy type across three quests sees different skills each time, which is what makes campaign enemies worth repeating rather than avoiding.

**Mini-bosses equip 4–5** and always include their signature.

---

### 14a. Against the Gaping Maw

*Maw quests are contracts. The opposition guards the target — and increasingly, hunts you.*

**Every one of the Maw's 24 skills (§13a) appears in a pool below.** A player who fights everything on all five quests can witness the entire faction list.

| Enemy | Skill pool (5) | Equips |
|---|---|---|
| **House Guard** | Cloak of Shadows, Unseen Guard, Blood Price, Throat Work, Butcher's Tempo | 2 |
| **Bonded Courier** | Ghoststep, Silent Loosing, Vanishing Strike, Stitch and Run, Quiet Word | 2 |
| **Watch Investigator** | Case the Room, Marked for the Knife, Killing Angle, Corpse Work, Executioner's Rhythm | 3 |
| **Lamplit Witness** | Poisoned Quarrel, Serpent Form, Spider's Patience, Carrion Sense, Venom Draw | 3 |
| **Candle-Bearer** | Poison Spray, Whisper of Ending, Shadow Lance, Last Breath, Stitch and Run | 3 |

**Mini-bosses** — equip 4–5, always including their signature.

| Quest | Mini-boss | Signature |
|---|---|---|
| 1 | **The Steward** — runs the household you are infiltrating | **Cloak of Shadows** |
| 2 | **Bell-Captain Orrin** — watch officer reading the candle evidence | **Case the Room** |
| 3 | **The Understudy** — a Maw defector selling names to Arden | **Vanishing Strike** |
| 4 | **Two of Arden's Witnesses** — paired, and neither is the real threat | **Killing Angle** |
| 5 | **VESNA ARDEN** — the Lamplighter | **Killing Angle** at advanced |

### 14b. Against the Antler

*Antler quests are contracts too, but the opposition is a rival company, a debtor, or a line that needs holding. Later, it is a hero.*

**Every one of the Antler's 24 skills (§13b) appears in a pool below.**

| Enemy | Skill pool (5) | Equips |
|---|---|---|
| **Rival Company Spear** | Line Advance, Shield Breaker, Hold the Road, Veteran's Cut, Bulwark Formation | 2 |
| **Contract Breaker** | Flanking Pay, Scout's Cut, Contract Mark, Fallback Point, Paid in Full | 2 |
| **Road Warden** | Suppressing Volley, Ranged Discipline, Paid Shot, Terms of Engagement, Muster | 3 |
| **Free Company Burner** | Fire Barrier, Siege Flame, Ashfall, Warhound Form, Beast Handler | 3 |
| **Sanctioned Adept** | Stanch, Company Medic, Contract Bound, Quartermaster's Root, Hold the Road | 3 |

**Mini-bosses** — equip 4–5, always including their signature.

| Quest | Mini-boss | Signature |
|---|---|---|
| 1 | **Toll-Captain Vesk** — running an unlicensed road toll | **Bulwark Formation** |
| 2 | **The Debtor** — a client who would rather fight than settle | **Paid in Full** |
| 3 | **Sergeant Ilm** — rival company, genuinely good at this | **Line Advance** |
| 4 | **Roscarrow's Conscripts** — four of them, and nobody asks where they came from | **Beast Handler** |
| 5 | **HOLLOWAY** or **CRANE** — whichever the player chose against | **True Rest** / **Bulwark Formation** |

### 14c. Against Varenholm Academy

*Varenholm assignments are the ones the watch could not finish. The opposition is unlicensed working, and then something worse.*

**Every one of Varenholm's 24 skills (§13c) appears in a pool below.**

| Enemy | Skill pool (5) | Equips |
|---|---|---|
| **Hedge Practitioner** | Aimed Cantrip, Focal Shot, Prismatic Bolt, Elemental Bond, Growth Field | 2 |
| **Unlicensed Warder** | Warding Stance, Absorption Field, Aegis Protocol, Ranging Ward, Dispel | 2 |
| **Struck Scholar** | Arcane Cascade, Chain Lightning, Countersign, See Invisibility, Prodigy | 3 |
| **Grave-Touched** | Silenced Step, Ward Thief, Storm Shape, Spellblade Form, Runic Strike | 3 |
| **Academy Proctor** *(quests 1–2 only, training exercises)* | Restorative Circle, Purge Ward, Vital Anchor, Disciplined Advance, See Invisibility | 3 |
| **The Risen** | Basic Attack only, at **×1.5 stats**, immune to Poison, Bleed, and Burning | 1 |

**Mini-bosses** — equip 4–5, always including their signature.

| Quest | Mini-boss | Signature |
|---|---|---|
| 1 | **Proctor's Failure** — a student who tried a working alone | **Arcane Cascade** |
| 2 | **The Bookkeeper** — selling Academy notes on the criminal market | **Ward Thief** |
| 3 | **Something Raised** — the first undead the player meets, and nobody says the word | **Storm Shape** |
| 4 | **The Choir** — six Risen, no caster visible, and that is the problem | *(none — mass encounter, deliberately)* |
| 5 | **THE QUIET** | **Necromancy** at advanced |


## 15. The Fifteen Quests

**Structure per faction:** 2 encounters, 2, 3, 3, 3 + boss. Tier 1 rising to Tier 3.
**Every quest ends on a mini-boss.**

---

### 15a. The Gaping Maw

**Q1 · A Quiet Room** *(2 encounters · soloable)*
> *Wren:* "Man owes the wrong people and has hired the wrong guards — go in, do it, come out."

Infiltrate a merchant's house. House Guards, then **The Steward**. The target is not present; this is a debt collection that went to its next stage.

**Q2 · The Ledger Run** *(2 encounters)*
> *Wren:* "Someone's been handing our names to the watch and I want to know which of us."

Intercept a Bonded Courier before a delivery reaches the watch house. Ends on **Bell-Captain Orrin**, who has already read enough to be dangerous, and who mentions a candle.

**Q3 · The Understudy** *(3 encounters · rival joins)*
> *Wren:* "One of ours is selling. Kite's going with you — don't let {them} do all of it."

Hunt a Maw defector through the lower district. Kite is visibly better than the player and says so. **The Understudy** fights like a Maw member because he is one.

**Q4 · The Contract** *(3 encounters)*
> *Wren:* "Ordinary job, ordinary target, in and out."

It is an ordinary job. Two of Arden's Witnesses are already in position. **Kite reaches the target, raises the knife, and Vesna Arden kills {them} from the dark before it lands** — the target survives, sees everything, and the candle goes on the body.

**Q5 · Bookkeeping** *(3 encounters + boss · Vane joins)*
> *Vane:* "A year of tokens and names in the hands of the watch. Let's go and close the ledger."

Track Arden through the district she has been documenting. Candle-Bearers and Lamplit Witnesses, then **VESNA ARDEN** with Vane fighting beside the player.

---

### 15b. The Antler

**Q1 · The Toll** *(2 encounters · soloable)*
> *Holt:* "Somebody's charging for a road they don't own — go and un-charge them."

Break an unlicensed toll on the east road. Rival Company Spears, then **Toll-Captain Vesk**.

**Q2 · Settlement** *(2 encounters)*
> *Holt:* "Client won't pay, client has guards, and the contract says we collect."

Collect on a defaulted contract. Ends on **The Debtor**, who is not sympathetic and is not entirely wrong either.

**Q3 · Two Companies** *(3 encounters · rival joins)*
> *Holt:* "Another outfit took the opposite side of the same job — Roscarrow's going, so listen to him."

A contested escort against a rival free company. **Sergeant Ilm** is competent and professional and the fight is clean. Roscarrow is openly contemptuous of the player and openly good at his work.

**Q4 · Margins** *(3 encounters)*
> *Holt:* "Standard escort, standard road, standard pay."

Roscarrow brings four fighters nobody has seen before and does not explain them. Mid-quest, **Holloway arrives, names Roscarrow, and kills him** — lawfully, drunk, and without touching the player. The conscripts drop where they stand.

**Q5 · No Paper On It** *(3 encounters + boss · branches)*
> *Crane:* "Choose, {target}. I'm not going to make the case any better than that."

The briefing reveals everything (§5c). The player picks a side before departure and fights the other. Ends on **HOLLOWAY** or **CRANE** accordingly.

---

### 15c. Varenholm Academy

**Q1 · Practical Assessment** *(2 encounters · soloable)*
> *Lirien:* "A student attempted a working alone and it is still going — go and stop it."

Contain a runaway working in a residential block. Hedge Practitioners drawn to it, then **Proctor's Failure**, who is frightened rather than hostile.

**Q2 · Unlicensed** *(2 encounters)*
> *Lirien:* "Academy notes are turning up on the criminal market and the magisters are unhappy."

Trace stolen Academy material. Ends on **The Bookkeeper**, who is selling to the Maw and says so cheerfully.

**Q3 · The Word Nobody Says** *(3 encounters · rival joins)*
> *Lirien:* "Something is walking in the old quarter — Vaunt has requisitioned you, which I am told is an honour."

Something has been raised. Vaunt refuses to name it the entire quest. **Something Raised** is the first undead the player meets, and the Risen appear here.

**Q4 · The Choir** *(3 encounters)*
> *Lirien:* "Six of them, no caster in sight — find the caster."

Six Risen and no visible necromancer. **The Quiet is there before the fight ends, and kills Vaunt mid-word**, then sends the player back to say it out loud while they still can.

**Q5 · Struck From the Rolls** *(3 encounters + boss · Venn joins)*
> *Venn:* "I signed the expulsion myself and I have thought about it most days since."

Hunt The Quiet through the Academy's own lower archive. Grave-Touched and Risen, then **THE QUIET**, with Venn beside the player.
