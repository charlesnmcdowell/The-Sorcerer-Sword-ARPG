# Untitled Adventurer RPG — Game Design Document v0.1

**Format:** Browser game, Phaser 3. Systems-heavy, art-light. Portrait-based presentation with menu-driven navigation (shop, quest board, training, party management). No traversable overworld art required.

**Pitch:** A classless, skill-based tactical RPG where you build a career as an adventurer — soloing, then hiring on to someone else's party, then running your own. Stats never change. Skills are everything, and skills are learned by *seeing* them used. Death is permanent, but your knowledge and your bloodline are not.

## There Is No Story

**Nothing in this game is written in advance.** There is no plot, no campaign, no scripted arc, no ending. Do not author one.

At its core this is a **quest and resource management game**: take contracts, earn gold, spend it on skills, gear, childcare, and payroll, and decide who to work with and who to marry. That loop is the whole game.

**The narrative is entirely emergent**, produced by two things and nothing else:

1. **The relationship graph** — who wants whom, who took whom, who was left, who is coming for whom (§6).
2. **The encounters** — which contracts get taken, who survives them, and who is standing where when it matters.

A player who marries a necromancer and watches heroes escalate against her did not play a story about that. Two systems collided on a schedule nobody wrote.

**Everything else in this document exists to make those collisions frequent, legible, and consequential.** Where a decision is between an authored moment and a systemic one, choose systemic.

---

## 1. Design Pillars

1. **Stats are fixed. Skills are the entire power curve.** Every character — player, NPC, monster — has a stat block that never changes. Threat comes from skill loadout, not numbers.
2. **Knowledge survives death. Property does not.** Skills carry across lives; gear and gold do not (except through the estate system). Risk lives entirely in the item economy.
3. **You control one character. Always.** Even as party leader, allies act on their own. Influence happens before the fight — through hiring, wages, and relationships.
4. **The world runs on the same rules you do.** NPCs use identical data structures: they train, marry, have children, and die permanently. The cast regenerates itself.
5. **No authored narrative.** Story is what the relationship graph and the quest log produce. Nothing is written ahead of time.

---

## 1a. Art Direction & Asset Constraints

**Hard constraint: exactly one class of authored art asset exists in this game.**

### The Only Authored Asset: Character Bust Portraits
- One-time AI-generated (GPT) bust portraits — JRPG framing, head and hair dominant, cropped at mid-chest. Full crop spec below.
- Displayed in a JRPG-style dialogue box whenever that character speaks. **Trigger points are enumerated in §17a** — the box should appear constantly, since it is the only place characters exist as people.
- **The portrait doubles as the combat unit representation.** No separate battle sprites, no animation, no alternate angles. A unit on the battlefield is: portrait + name plate + health bar + intent icon. (Reference model: *Darkest Dungeon* — reads clearly with minimal animation.)

### Everything Else Is Phaser Code-Generated
Menus, battlefield, dungeons, cities, shops, UI chrome, effects — all primitives, shapes, and procedural layout drawn in code.

### Player Character Portraits — 10 Total

**Crop: JRPG bust.** Top of hair (with small headroom) down to mid-chest / sternum. Head and hair occupy roughly 55–65% of frame height. Shoulders and upper chest in frame; arms cropped at the deltoid. Straight-on to slight three-quarter turn only — never a profile, since the same portrait serves as the combat unit.

Consistency requirements across all ten:
- Identical eye line height (they render side by side in a grid).
- Identical lighting key and direction.
- Flat or subtly graded background, palette-shiftable later.
- Portrait-oriented aspect ratio (drives lane card dimensions in combat — see §4).

**Hair is the primary silhouette differentiator** at this crop. All ten should be distinguishable by hair alone at thumbnail size, not just the two flagged below.

Character creation offers **5 female and 5 male**. Ethnicity distribution is identical across both sets; each slot also carries an archetype read so players can scan a playstyle off the creation screen:

| Slot | Ethnicity | Archetype read | Female wardrobe | Male wardrobe |
|---|---|---|---|---|
| 1 | Black — dark skin tone | Martial / tank | Fitted pauldron, open neckline, bare collarbone and shoulder | Knight armor, gorget and pauldron, lean silhouette |
| 2 | Black — light skin tone, *distinctly different hairstyle from slot 1* | Rogue / stealth | Ninja streetwear, hood down, mesh collar, open cropped jacket | Ninja streetwear, hood up, mesh neck |
| 3 | Asian | Social / caster | Tailored dress, bare shoulders, statement jewelry | Corporate suit, open collar, loosened tie |
| 4 | Caucasian | Ranger / outdoors | Hiking gear, harness straps across chest, tank neckline | Hiking gear, layered collar, shoulder strap, rolled sleeves |
| 5 | Latino | Wildcard / druid | Wrapped hide, asymmetric bare shoulder | Wrapped hide, bare shoulders |

Wardrobe styling leans attractive within each archetype — fitted cuts, exposed shoulders and neckline for the female set; lean muscular builds for the male set — but every option still telegraphs a role. This preserves visual readability in a game where portraits are the only art and double as battlefield units.

**Cosmetic only.** All player options are human and share the identical human baseline stat block. The fixed-stat-by-race rule (§2) applies to fantasy races and species — human, monster, and other playable races — never to real-world ethnicity. Neither appearance nor wardrobe archetype locks or influences the player's build; a slot 1 portrait can run a pure mage loadout.

**Style lock is most critical here.** These ten appear side by side on the same screen, where framing, lighting, crop, and background inconsistencies are immediately obvious. Author these first as the golden reference set, then match every other portrait in the game to them.

### Portrait Supply Problem
The game generates thousands of persistent NPCs; portraits are hand-authored one-time assets. Two viable solutions:

1. **Portrait pool** — author 100–200 headshots tagged by race / sex / age band / archetype. Generated NPCs draw deterministically from their seed. Named and story characters receive dedicated art. Reuse is genre-normal.
2. **Layered composition** — base face + hair + accessory + palette shift, composited at runtime. Consistent with the code-art approach; multiplies a small asset set into thousands of distinct faces.

### Style Lock
All portraits appear on the same screen together. Lock framing, lighting, background, and crop **before** generating any production art — golden reference first, scale only after greenlight. Style drift is highly visible when portraits are the only art in the game.

### Code-Generated VFX Vocabulary
All combat and UI feedback is drawn in Phaser — no authored effect art, no sprite sheets. Build this as a reusable library so any new skill (including patron customs, §14) gets visuals for free.

**Portrait motion is the primary feel channel.** Portraits never animate internally, so all movement comes from tweening the portrait object itself:
- Lunge forward on attack, recoil backward on hit
- Shake on critical, slow drift on channel/charge
- Tint flash by damage type; desaturate on downed
- Scale punch on execute or finisher

**Effect atoms** (Phaser `Graphics`, particle emitters, tweens, camera):
- Slash arcs — tweened arc/bezier strokes
- Impact bursts — tinted particle emitters with primitive shapes
- Projectiles — tweened shapes with trail emitters
- Auras and buffs — pulsing outlines and orbiting shapes on the portrait frame
- Status indicators — animated icon badges on the name plate
- Damage numbers — tweened text with easing and color coding
- Screen-space — camera shake, zoom punch, full-screen color overlay flashes

Pair each effect primitive (§14) with a default VFX atom so a new mechanic is never visually silent.

### Art Budget Substitutes
With no illustrated environments, two things carry the entire visual identity:
- **Palette.** Each faction region gets a distinct palette so cities and dungeons read as different places while using identical primitives.
- **Typography and spacing.** UI craft *is* the aesthetic. Treat font selection, kerning, and layout rhythm as the art budget.

---

## 2. Character System

### Stats
- Fixed at creation, never increase through play.
- Assigned by race/species. Humans are baseline; monsters and other races have distinct ranges.
- The only stat modification comes from the Nepotism inheritance buff (see §7).
- Because stats are fixed, **turn order is fully predictable** — making turn-order manipulation perks unusually valuable.

### No Classes
Build identity comes entirely from the skill loadout. A high-damage mage, a stealth rogue, and a tank differ only in which skills they carry and how advanced those skills are.

### Loadout Slots
| Actor | Perks | Active Skills |
|---|---|---|
| Player | 4 | 8 |
| Standard NPC / monster | 1–2 | 2–4 |
| Boss | 2–4 | 4–8 |

- **Perks** are passive and define build identity. 4 slots is deliberately tight.
- **Actives** are used in combat. 8 slots forces loadout decisions — you cannot bring everything.
- Advanced tiers upgrade an existing slot rather than adding a new one, so muscle memory survives death.

---

## 3. Skill System

### Acquisition: Trainer and the Witness Rule

**Every basic skill is available at the trainer.** Nothing is ever locked behind having seen it. The first **3 basic skills are free**; all others cost gold.

**Witnessing a skill makes it free.** Seeing a skill used in combat — by an enemy or an ally — removes its trainer cost entirely.

This gives two parallel paths and keeps both alive:
- **Gold** — the fast path. Buy what you want, when you can afford it.
- **Witnessing** — the earned path. Free, but requires fighting things that use it.

Because bypassing an encounter (§8) means witnessing nothing, a player who talks and sneaks past everything pays gold for every skill they ever learn. A player who fights everything learns free and pays in risk. Neither is gated; they simply pay in different currencies.

**Only basic skills are ever learned or equipped.** Advanced skills are not separate entries and cannot be bought or trained into. Witnessing an advanced manifestation makes you eligible for its **basic root**. Witness a mage cast Fire Ball, and what enters your journal as learnable is **Fire Bolt**.

**The journal's second job:** only a sighting reveals which advanced form a basic grows into. A player who buys skills blind knows what they have; a player who witnesses knows what it will become. That is what makes sightings worth pursuing even when gold is plentiful.

Consequences this creates:
- Allies become a mobile library. You hire for skill diversity, not just combat power.
- Rare enemies are worth seeking out for reasons other than loot.
- High-level enemies are worth fighting even when their kit looks unreachable — the sighting still yields the root, free.

### NPCs Witness Too

**The witness rule is not player-only.** Any NPC who fights alongside or against a skill becomes eligible to learn it free, exactly as the player does. NPCs then buy it at the trainer on the world clock like any other purchase.

**This means a party propagates its leader's build.** Hire people, fight beside them repeatedly, and they acquire your kit for nothing — you do not recruit specialists so much as manufacture them. A leader running one archetype for twenty quests ends up surrounded by imitations of themselves.

It also runs against you: everyone who fights the player learns from them, including enemies who survive and assassins who lose and come back.

### Tiers Are Expressions, Not Entries

**A skill's level determines how it manifests in that character's hands.** One entry, multiple forms:

`Basic → Intermediate → Advanced`

`Fire Bolt (basic) → Fire Bolt+ (intermediate) → Fire Ball (advanced)`

- **Basic** — the learned entry, default manifestation.
- **Intermediate** — granted by a matching gear set (§10) as a **floor**, or reached by skill level. Purchasable with gold.
- **Advanced** — reached by skill level only. Never purchasable.

Gear sets raise the floor and never stack past it: if a skill's level already manifests at or above intermediate, the set changes nothing. Gold buys a shortcut past the early grind; only use earns advanced.

This applies universally — player, NPC, and monster alike. The same basic skill in a novice's hands and a veteran's hands is a different thing on the battlefield. **Skill level is therefore the primary difficulty dial in a fixed-stat game:** a high-level bandit is dangerous not because he has more skills, but because his basic skills manifest as their advanced forms.

For enemy authoring this is close to free — the same skill pool at different levels spans the entire difficulty range without a single new skill definition.

### Manifestation Conditions
Skills only fire under their trigger conditions. A healer won't show an emergency revive until someone drops. A bandit won't use Smoke Escape until near death. A boss won't show a stance-break perk unless his guard is threatened.

**Therefore witnessing is an active tactical objective.** Players must engineer the fight that provokes the skill — prolonging encounters, letting allies get low, avoiding the alpha strike. This layers a second win condition on top of "survive."

**Rule:** You must survive the encounter for a sighting to register. Dying to a boss does not grant his kit.

**Being downed but surviving still counts.** A character who falls mid-fight and is alive when it ends witnessed everything used up to that point. The requirement is survival, not consciousness.

### Progression
1. **Acquire** a basic skill — free for the first 3, free if witnessed, otherwise bought with gold
2. **Equip** it, within capacity limits
3. **Use** → skill level rises → power increases, and at thresholds the skill manifests as its intermediate then advanced form

There is no separate advanced training step, and no advanced skill can be purchased. The only path to advanced forms is levelling a basic skill through use.

Gear and items increase skill progression *speed*, not raw power. Gold sinks: buying un-witnessed basics, gear sets, payroll, and insurance.

### Capacity & Forgetting

**Learning is capped, not just equipping.** The player holds a fixed number of learned perks and actives. There is no larger library to swap from — at capacity, learning something new requires **letting an existing skill go**.

This splits the two fantasies cleanly:
- **The journal is uncapped.** Witnessed and eligible entries accumulate forever. Collection is endless.
- **Learned skills are capped.** What you actually carry is a hard choice.

**Dropped skills return to Eligible, not erased.** A forgotten skill stays in the journal and can be re-learned at the trainer. Without this, experimenting permanently destroys a sighting and players would refuse to ever swap.

**Skill levels survive a drop.** A re-learned skill returns at the level it had when dropped — including its advanced manifestation if it had reached that threshold. Levelling is permanent progress; the capacity limit governs only what you carry at any moment, never what you have achieved. Loadouts are therefore fluid, and the real constraint is opportunity cost: time spent using one skill is time not spent levelling another.

**Interaction with permadeath:** learned skills and their levels survive death (§7), so the capped set *is* the character across lives. The journal survives as well, meaning a reincarnated character can immediately re-equip anything previously witnessed and levelled — subject only to the capacity limit.

### Skill Journal
Four-state tracker: Witnessed / Eligible / Learned / Mastered. Zero art cost, high systems value, and the game's screenshot artifact.

Entries record the **manifestation you saw** alongside the **basic root you can learn** — a Fire Ball sighting displays as `Fire Ball → Fire Bolt (eligible)`. The player sees the destination the moment they witness it, then spends the rest of the game levelling toward it.

**The journal survives death.** Every sighting is permanent across all lives. A reincarnated or inherited character retains the full journal, so anything ever witnessed remains free at the trainer forever. Each life is a research expedition and the journal is the real save file.

---

## 3a. The Skill List — 31 Entries

Every skill is a single entry with three manifestations determined by level (§3). Enemies, NPCs, and the player all draw from this identical pool.

**Totals: 11 perks · 20 actives** (including the two forbidden skills below).

### Mage

| | Basic | Intermediate | Advanced |
|---|---|---|---|
| **Arcane Focus** *(perk)* | Elemental actives deal increased damage | Also reduces their resource cost | Elemental actives strike one additional adjacent target |
| **Fire Bolt** | Single-target fire damage | **Fire Blast** — adds a burn over time | **Fire Ball** — hits an entire lane |
| **Frost Touch** | Single-target cold damage, target acts later in the order | **Frost Chain** — hits two targets | **Blizzard** — lane-wide, all affected act last |

### Tank — Every Skill Has an Offensive Component

Damage taken is converted into damage dealt. **A tank solos**, and gets stronger the worse the fight is going.

| | Basic | Intermediate | Advanced |
|---|---|---|---|
| **Bulwark** *(perk)* | Reduces damage taken by 20%, and **reflects 25%** of damage taken back at the attacker | Also protects adjacent allies; **reflect 40%** | **Reflect 60%** |
| **Shield Wall** | Halves incoming damage for a round, and **all damage prevented is dealt to the attacker** | **Iron Wall** — same, across the front lane | **Aegis** — same, across the entire party |
| **Taunt** | Marks one enemy: it must attack you, and **takes retaliation damage every time it does** | **Provoke** — marks two | **Challenge** — marks an entire lane |

**Taunt is not dead weight when solo.** Marking the only enemy present still forces the retaliation, so the skill functions identically alone and in a party — it simply pulls fewer targets.

### Rogue

| | Basic | Intermediate | Advanced |
|---|---|---|---|
| **Opportunist** *(perk)* | Bonus damage to targets below 30% health | Threshold rises to 50% | Kills refund your action |
| **Backstab** | High damage to the enemy back lane | **Throat Cut** — adds stacking bleed | **Assassinate** — instantly kills targets under 25% |
| **Smoke Bomb** | Evade the next attack against you | **Vanish** — untargetable for a full round | **Shadowstep** — reposition and strike for free |

### Ranger

| | Basic | Intermediate | Advanced |
|---|---|---|---|
| **Marksman** *(perk)* | Bonus damage from the back lane | Ignores lane cover | Back-lane attacks cannot be counterattacked |
| **Aimed Shot** | Single-target ranged damage | **Piercing Shot** — also hits the target behind | **Volley** — hits every enemy |
| **Snare** | One target acts later in the order | **Bind** — target loses its next action | **Root Field** — an entire lane loses its next action |

### Fighter

| | Basic | Intermediate | Advanced |
|---|---|---|---|
| **Momentum** *(perk)* | Damage rises with consecutive attacks on the same target | Also grants accuracy | Every third consecutive attack strikes twice |
| **Cleave** | Hits two adjacent enemies | **Sweep** — hits a lane | **Whirlwind** — hits the front lane of every group |
| **Sunder** | Reduces target armor | **Rend** — armor reduction plus bleed | **Shatter** — removes armor entirely |

**Sunder is the armor answer** referenced in §4. Armored enemies carry +12 Defense that Sunder strips for the rest of the battle (§15a). They are not immune without it — merely slow to kill.

### Druid / Shapeshifter

| | Basic | Intermediate | Advanced |
|---|---|---|---|
| **Wild Form** *(perk)* | Passive damage and defense bonus | Bonus shifts by lane position | Survive one lethal blow per battle at 1 HP |
| **Thorn Skin** | Reflects damage taken back at attackers | **Bramble Hide** — extends to the front lane | **Barkflesh** — extends to the whole party |
| **Beast Shape** | Self offense buff for several rounds | **Greater Beast** — adds life steal | **Primal Form** — attacks also hit adjacent enemies |

### Healing — 6 Actives, Each With an Offensive Mode

Every healing skill can be aimed at an enemy instead of an ally (§11). A healer solos.

| | Basic | Intermediate | Advanced | Offensive mode |
|---|---|---|---|---|
| **Mend** | Heals one ally | **Restore** — heals more, removes bleed | **Renewal** — heals a lane | **Life steal** — drains the target and heals you for it |
| **Cleanse** | Removes one negative status | **Purify** — removes all | **Absolution** — removes all, party-wide | Transfers the removed status onto an enemy |
| **Regenerate** | Heal over time on one ally | **Sustain** — stronger, longer | **Everbloom** — party-wide regeneration | **Poison** — damage over time instead |
| **Guardian Ward** | Shields one ally from the next hit | **Sanctuary** — shields for a full round | **Divine Aegis** — shields a lane | **Damage reflect** on the warded target |
| **Triage** | Small heal, doubled on targets under 25% | **Field Surgery** — full heal under 25% | **Resurrection** — revives a downed ally once per battle | **Inflicting wounds** — target receives reduced healing |
| **Blood Pact** | Damages an enemy and heals an ally for the same amount | **Blood Tithe** — heals two allies | **Crimson Covenant** — damages a lane, heals the party | Already dual by design |
| **Devoted** *(perk)* | Healing you perform is increased | **Temporary HP granted is doubled**, and its cap rises to 100% of maximum | Healing also damages the nearest enemy for a portion |

### Defeating a Named NPC — Three Outcomes

When a named NPC or monster is defeated, the victor chooses:

| Outcome | Effect |
|---|---|
| **Kill** | Permanent death. Victor takes carried items. Standard rules (§7) apply. |
| **Knock out** | Hospitalized for **3 quests** — unavailable to quest, hire, or be hired. Survives. |
| **Conscript** | Requires the Conscript skill (§3a). |

**The player is immune.** A defeated player always dies. Neither conscription nor necromancy can be used on them.

### Forbidden Skills

Two actives share a unique property: **each carries a world-level consequence** that cannot be avoided by skill, wealth, or party size.

- **Conscript** → world population increases by **3** after 3 quests. Those three mature into assassins targeting the conscriptor (§6).
- **Necromancy** → **Divine Intervention** (below).

### The Warning

Both skills carry a single line in the trainer and the skill journal, and nothing more:

> **This skill will cost you. Not today.**

**No further explanation is given anywhere in the game.** The player is told there is a price and never told what it is. They should have the run of the skill long enough to build something around it before the bill arrives — the fun comes first, deliberately, and the consequences are designed to land after the player has committed.

**The delay is real, not cosmetic.** No hero is called until **10 quests after** the threshold is crossed (§3a, Divine Intervention). A player who reaches five raises at quest 20 is not hunted until quest 30 — long enough to build an army, take boss contracts, and come to rely on the skill before anything arrives.

**Hatred is not delayed.** Every conscript released at the end of its term drops to permanent Hatred immediately, from the very first use, and every jilting and theft counts as normal. The slow burn is the hero; the immediate cost is the enemies stacking up while the player is still enjoying themselves.

| | Conscript | Necromancy |
|---|---|---|
| **When used** | After victory | After victory |
| **Duration** | 3 quests | 3 quests |
| **Result** | Fights for you at Neutral | Undead ally with **much higher stats** |
| **After** | Target survives and leaves at **Hatred** | Target **decays to permanent death** |
| **Reusable on same target** | Yes, every time you beat them | No — they are gone forever |
| **Party size limit** | **None** | **None** |

**Conscript is renewable, necromancy is consumptive.** Conscription rents a body repeatedly at the cost of a permanent enemy each time. Necromancy spends a life outright for a far stronger servant and removes that character from the world.

**Headcount is capped by skill tier** — 2–4 conscripts, 1–3 undead — and the cap enforces itself through escape and decay rather than a locked button. One character commands a squad, not a horde; a *party* of conscriptors multiplies it, since caps are per controller.

**Conscripts and undead count as a party — an unlimited one, with no upkeep.**

- They **unlock the party contract track** (§15a), including boss contracts, exactly as hired members do.
- They **draw no wage.** Payroll is one of only two gold-only needs in the pyramid (§10), and conscription removes it outright.
- They **form no relationships** and cannot be jilted, underpaid, or made to quit.
- **Caps are per controller**, so four advanced conscriptors field up to 16 followers between them at a payroll cost of four wages.

**This bypasses the hiring block.** Hatred stops someone accepting your gold (§5); it does not stop you taking someone who lost to you. A conscriptor can march into a boss contract behind an army of people who want them dead.

**What it costs instead.** Every conscript released at Hatred is a permanent enemy, and every use adds 3 lives that mature hostile. The strategy converts a gold problem into a body-count problem, and at ten Hatred edges Divine Intervention arrives regardless of how well it has been working.

### Armies of Armies

**Every party member can independently use Conscript or Necromancy.** Their followers cost nothing either.

- **Upkeep applies only to real hired members.** A leader with 3 hires pays 3 wages, full stop — regardless of whether those hires field two followers each or twenty.
- **A party of conscriptors is a party of armies.** Four real members, each commanding unlimited followers, at the payroll cost of four.
- **Hiring a conscriptor is strictly better value** than hiring a fighter at the same wage, which creates a real hiring meta: leaders should prefer NPCs who know a forbidden skill.

**The party teaches itself.** NPCs witness skills exactly as the player does (§3). A leader who uses Conscript in front of their party makes it free for every one of them, and within a few quests a conscriptor's party has converted into conscriptors. No instruction, no cost, no decision required.

**Debt accrues per user, not per party — and this is exploitable.** Each character's conscriptions add lives hostile to *them*, and each character's necromancy draws Divine Intervention against *them*. A leader who hires conscriptors and never conscripts personally commands an enormous force while their employees absorb the entire consequence.

**The leader gets the bodies. The employees get the enemies.**

It is not free forever. Those hires accumulate Hatred, cross ten, and draw heroes of their own — heroes who hunt them, not the leader. The leader's party begins dying to champions summoned by work the leader benefited from, and each replacement hire starts the cycle again.

**Population and consequence — conscription only.** Three new lives of unspecified parentage; the design does not track who bore them, only that the roster grew. They arrive 3 quests after the conscription, mature at 10 quests (§6), and are hostile to whoever conscripted them into existence.

### Divine Intervention

**The world answers people it cannot tolerate.** Two triggers, either of which calls a hero:

| Trigger | Condition |
|---|---|
| **Forbidden arts** | Necromancy use past a threshold |
| **Universally hated** | **10 or more characters hold Hatred** toward one person |
| **Villainy** | A hero spared a sanctioned target they are or were above Neutral with, **or killed someone the world never named** (§3a) — permanent, never decays |

The second trigger is the general check on villainy. A tyrant cycling conscripts and a serial jilter both cross ten eventually, and neither needs a bespoke rule to be answered.

**One existing character — an NPC, or the player — is offered a divine quest against that target.** Accepting grants two things, neither of which occupies a slot:

| Grant | Effect |
|---|---|
| **True Rest** *(active)* | One-shot kills any undead. Does not consume an active slot. |
| **Hero** *(perk)* | Vastly increased base stats. Does not consume a perk slot. |

**The army is irrelevant.** True Rest deletes raised undead outright, so a necromantic host evaporates and the necromancer must fight personally.

**The target's party is not spared.** Anyone fighting alongside the target is a combatant by choice, and combat continues until one side is dead or fled (§15a). A hero who kills a necromancer and then faces four surviving hires must go through all of them — and **heroes cannot flee.** They fight until the target is dead or they are.

### Personal Vendettas

**A hero who assassinates someone out of personal grievance becomes a Villain.** The trigger is motive, not the target.

| Killing | Result |
|---|---|
| **A target named by a divine quest** — including an ex-lover | **Stays a hero.** The kill is sanctioned. Who they used to be to you does not matter. |
| **Someone the hero personally hates** — a partner who jilted them, a rival, anyone the world did not name | **Villain.** Divine power spent on a private score. |

**The distinction is sanction.** A hero handed their ex-wife's name because she crossed ten Hatred edges may execute her and remain exactly what they were. A hero who ambushes that same woman on their own initiative, because she left them, falls immediately.

**Sparing is still villainy** (below), so a divine quest naming an ex has one clean resolution and one fall: kill them and stay a hero, or spare them and become a Villain.

**NPC heroes obey this too**, and the feed distinguishes the two cases plainly — one line for a champion doing their work, another for a champion settling something of their own.

### Villains — Heroes Who Spare Their Own

**A hero who spares a target they are — or ever were — above Neutral with becomes a Villain.** Refusing to strike a friend, partner, or former partner once the divine quest has named them is a betrayal of the grant, not an abandonment of it.

**Killing a sanctioned target is never villainy**, no matter who they used to be (above). Only sparing them is, and only using the grant for an unsanctioned personal kill is.

| | Hero | Villain |
|---|---|---|
| **True Rest and Hero perk** | On loan, revoked when the quest ends | **Kept permanently** |
| **Normal quests** | Forbidden | **Restored** — quest, hire, lead, earn |
| **Divine status** | Instrument | **Permanent target**, treated exactly as a forbidden-art user |
| **Divine attention** | — | **Permanent**, identical to a forbidden-art user. Neither can ever be cleared. |

**This is the most powerful state a character can reach.** Vastly increased stats that never expire, a skill that one-shots undead, and full access to the economy and the party system.

**And it is a countdown.** Heroes are called against them forever, each twice as strong as the last, with no threshold to fall back under and no conduct that clears the mark. Killing one buys 3 quests, exactly as it does for a forbidden-art user.

**Sparing creates two targets, not zero.** The spared character remains hunted — a new hero is assigned to them immediately. The Villain simply joins them.

**NPC heroes do this on their own**, driven by Loyalty (§6). A high-Loyalty hero assigned to hunt their spouse spares them, and the feed reports both consequences at once — one villain created, one target still standing.

**For the player**, the moment arrives as a choice inside a divine quest: the target's name is someone they married, and killing them ends it while sparing them begins something far worse and far stronger.

**There is no redemption.** Killing the spared character later does not restore hero status. The grant was betrayed once and the world does not reconsider.

**Grant revocation, clarified:** True Rest and Hero are revoked when the target dies, or when a hero abandons a quest against a **stranger**. They are retained only by sparing someone above Neutral — which is precisely what makes the character a Villain.

### What a Hero Can and Cannot Do

**A hero is an instrument, not an adventurer.**

- **Cannot take normal quests.** Not solo, not as a hireling, not as a leader.
- **Can only pursue valid targets** — forbidden art users, and anyone carrying 10 or more Hatred edges.
- **Idle until death otherwise.** With no valid target in the world, a hero simply waits. They earn nothing, level nothing, and progress in no way.

### Heroes Send Help Requests

**A hero above Neutral with someone sends them a help request on every divine quest**, using the same system as a friend in danger (§6).

- **The target's name is shown.** Accepting means hunting whoever the world named — which may be the recipient's own friend, partner, or ex.
- **Accepting counts as a shared quest.** It moves the relationship (+8) and ticks the shared-quest streak that governs vault withdrawals (§7). This is the *only* way a hero maintains a relationship or unlocks a shared vault, since they can take no other work.

**One in three is enough.** A hero's invitations are tracked in a rolling window of three:

| Behaviour | Result |
|---|---|
| **Accept at least 1 of any 3 invitations** | Relationship maintained, and the withdrawal streak (§7) stays satisfied |
| **Refuse 3 consecutive invitations** | **−25**, and the streak breaks — the vault locks |

Without this allowance a hero spouse would be impossible to keep. Divine quests arrive on the world's schedule, not the player's, and requiring every one would mean abandoning your own career to stay married. Requiring none would make the marriage free.

- **Divine quests pay no gold.** The reward is the relationship and whatever the target was carrying. Heroes remain outside the economy; their companions earn nothing but standing.

**If the recipient is the target, no request is sent.** The hero simply arrives at the end of their next quest.

**A hero can be assigned to hunt their own spouse.** Nothing prevents it — the world names the target, and NPCs do not refuse divine quests. A player married to a hero may open the feed to find their own name, or their partner's request naming someone they love.

**Consequences:**

- **Heroes are removed from the economy.** Each one is a body withdrawn from the labor pool, the hiring market, and the population engine — a real cost to the world for tolerating a villain. They earn no gold ever, including on divine quests.
- **Heroes accumulate as a deterrent.** Idle heroes remain heroes. A world holding three of them answers the next person to cross the line immediately, with no summoning delay.
- **Accepting is a career suspension for the player.** A player who takes a divine quest cannot quest normally until the target is dead. The power spike is enormous and the opportunity cost is total, which is what makes it a decision rather than a gift.

**Defeat escalates it.** If the hero falls, **a new hero is selected at random and is twice as powerful as the last.** Then four times. Then eight. Unbounded.

**This is a timer, not a debt.** The target can win every encounter and still lose, because the opposition doubles and their army does not. No amount of wealth, party size, or skill outruns exponential growth, and nothing clears the mark. **The only exit is death.**

**If the player is the target**, Divine Intervention is their doom clock, and each champion is named in the event feed before the ambush arrives.

**Resolved parameters:**
- **Threshold: 5 raises.** The fifth use of Necromancy marks the target.
- **The first hero arrives 10 quests after the mark.** This applies to both triggers — necromancy and ten Hatred edges. The delay is deliberate: the player gets a long run with the skill before the world responds, so the consequence lands on someone already committed rather than someone still experimenting.
- **Divine attention never decays.** Once marked, a target is marked for life. Stopping does not help. Falling back below ten Hatred edges does not help. There is no threshold to drop under and no conduct that clears it.
- **Killing a hero buys 3 quests.** That is the only relief the system offers — a brief reprieve before the next champion is named, at twice the power of the one just buried.
- **Grants are revoked** when the target dies, or when a hero abandons a quest against a stranger. True Rest and Hero are on loan, not earned — **except** for a hero who spares someone above Neutral, who keeps them permanently and becomes a Villain (§3a).

**The only exit is death.** A marked character can win indefinitely and never stop being hunted, because each victory buys three quests and each replacement doubles. Necromancy is a one-way door: the fifth raise commits the rest of that life to being pursued.
- **The player may refuse.** A refused divine quest is offered to someone else immediately, and may be offered to the player again after 5 quests if still unresolved.

**Access is normal.** Both are ordinary basic skills at the trainer, free if witnessed (§3). Nothing gates them — the consequence *is* the restriction.

### NPCs Use These Too

**Any NPC can learn and use Conscript or Necromancy**, on the same terms as the player. No special-casing.

- **NPC necromancers permanently delete roster members.** Each raise removes a named character from the world for good, and the event feed reports it plainly — *Doran raised Mira. She is gone.* The player can watch the world shrink without any obligation to act.
- **NPC conscriptors field unlimited armies** and become far more dangerous as assassins. A hated NPC arriving at the end of a quest with six conscripts is a different proposition from one arriving with a hired crew.
- **They pay the same prices.** An NPC conscriptor accrues the same assassin debt; an NPC necromancer draws the same Divine Intervention, with heroes escalating against them exactly as they would against the player. Forbidden-skill users self-terminate behind their own ambition, and the player may simply outlive one — or be the hero called to end them.
- **Witnessing is the natural acquisition path.** Seeing an NPC use a forbidden skill makes it free at the trainer — the player learns the forbidden arts by watching someone else damn themselves with them.

**The player is the sole exception.** A defeated player always dies; they can never be conscripted or raised.

**Enemies can conscript or raise the player's hired party members.** A hire who falls in battle can be taken by the victor — conscripted into their service, or raised as undead and thereby permanently killed. Bringing hired people into a fight against a necromancer risks losing them for good.

This makes the necromancer the one enemy a wealthy player cannot simply throw bodies at. Gold buys protection everywhere else in the design; here it buys corpses for the other side.

| | Basic | Intermediate | Advanced |
|---|---|---|---|
| **Conscript** | 3 quests · **2 held** | 4 quests · **3 held** | 5 quests · **4 held** |
| **Necromancy** | 3 quests · **1 raised** · raised stats | 3 quests · **2 raised** · higher stats | 3 quests · **3 raised** · highest stats, retains its own skills at full level |

Tiers scale **duration, power, and headcount.** Undead cap lower than conscripts because they field at ×1.5 the original's stats (§15a).

### Escape and Decay — How the Cap Enforces Itself

The limit is not a greyed-out button. It is diegetic and costs something every time it is hit.

- **Conscripts escape.** Taking one past your cap releases the **oldest** immediately — it leaves at **Hatred**, permanently, exactly as if its term had expired. You have traded a standing enemy for a fresh body.
- **Undead decay.** Raising past your cap collapses the **oldest** into **permanent death** on the spot. That character leaves the world early and you never got the full three quests from them.

Neither prompts a warning. The event feed reports it after the fact.

**Net effect on the roster:** conscription adds 3 lives and costs none. Necromancy removes 1 and adds nothing — it shrinks the world and summons heroes to end you.

### Social & Stealth Perks

These resolve encounters outside combat (§8). They are perks, not actives, and each costs a perk slot.

| | Basic | Intermediate | Advanced |
|---|---|---|---|
| **Persuade** *(Talk)* | Resolve encounters with lower-ranked opponents | Equal rank | Any rank; also improves party applications |
| **Charm** | Resolve encounters with opposite-sex opponents | Any opponent | Target may fight alongside you for that encounter |
| **Intimidate** | Resolve encounters with lower-level opponents | Equal level | Opponents who flee drop their carried inventory |
| **Sneak** *(Stealth)* | Works on lower-level opponents | Equal level | Any level, and steals from **every** enemy in the encounter |

**A successful Sneak always includes a successful steal.** Theft is not a separate roll or a higher tier — bypassing someone means taking from their inventory on the way past. Equipped items are never stolen (§10).

**Sneak behaves differently alone and in a party:**

| Situation | Result |
|---|---|
| **Solo** | Bypass the encounter entirely, plus a steal |
| **In a party** | **Ambush** — you cannot hide a whole party, so the sneak becomes a positioning advantage instead (§15a), plus a steal |

**Sneak is the thief economy** described in §10 — the only skill that generates gold without combat or romance, and the only bypass that a party cannot use.

---

## 4. Combat

**Format:** Turn-based tactical.

### Party Combat and Ally Autonomy
The player controls only their own character. Party members act autonomously — including in the player's own party.

**Required support system: telegraphed ally intent.** Before the player's turn, each ally's portrait displays their planned action ("attacking the archer," "holding," "healing self"). Without this, ally autonomy is noise. With it, the player's 8 actives become reactive glue: set up an ally's hit, cover a mistake, finish what was left at low health.

### Enemy Design
Enemies are authored as skill loadouts over shared stat blocks. A bandit with Feint + Throat Cut is a completely different fight from one with Shield Wall + Taunt using identical stats. Cheap to author, and it teaches the skill system by making the player fight it.

### Difficulty Gating
Two dials, neither of which touches stats:

1. **Skill level** (primary). The same skill pool at higher levels manifests as advanced forms (§3). A veteran bandit and a novice bandit share a skill list and are entirely different fights. This spans the full difficulty range with no new content.
2. **Soft locks, not hard walls.** Armored enemies carry very high Defense that Sunder strips (§15a). Without it they are a slow grind rather than an impossibility — which keeps every quest completable by every build (§8) while still making armor-pierce genuinely valuable.

### Positioning — Three Lanes

**Front / Middle / Back.** Each side occupies three lanes; up to 3 units per lane.

- **Reach:** melee skills hit the enemy front lane only. Ranged and elemental skills reach any lane. Back-lane skills (Backstab) specifically target the enemy back lane.
- **Cover:** a lane cannot be targeted by melee while a lane in front of it is occupied. Marksman at intermediate ignores this.
- **Lane effects:** skills marked "hits a lane" affect every unit in one enemy lane.
- Portraits are drawn front-on only (§1a), which lanes accommodate natively and a grid does not.

---

## 5. Party & Career Structure

Three stages, each mechanically distinct. The player does **not** own a party by default.

### Stage 1 — Solo
- No allies means no ally-witnessing pool. Early skill growth is slow and dangerous.
- Low-tier bounties. Real reward is first basic skills and starting capital.
- Keep the failure loop cheap: little gear to lose, fast to return to play.

### Stage 2 — Hireling
- Player applies to join a party of up to 5. Acceptance is gated on reputation, visible skill sheet, and **role demand** — a party missing a healer weights healing skills heavily, so a build the party lacks can get hired on a reputation that would otherwise be rejected.
- Paid a **flat wage**; all gold and item rewards go to the party leader.
- **Tradeoff:** fewer items than soloing, far more skills witnessed. Not a straight upgrade — this is why a player might return to solo work.
- Low reputation means only bad parties with bad leaders will accept you. This is its own gameplay.
- **Player can be fired for poor performance.** Being fired *mid-quest* (stranded, no gear budget) is a severity tier above being fired after.
- NPCs can also quit the team of their own accord.

**Economy display requirement:** Show the leader's take alongside your wage. Watching a leader pocket 400 gold while paying you 30 is the cleanest possible motivation to go independent, and it is free to implement.

### Stage 3 — Leader
- Player funds and hires their own party (up to 5), sets individual wages.
- **Wages are fixed offers, not negotiations.** The leader names a figure; the NPC accepts or declines based on Greed and Pride (§6). There is no counter-offer and no haggling loop, in either direction — a player working as a hireling cannot ask for a raise either. NPCs accept in the 25–60 range (§16); below 25 almost nobody accepts, above 60 nobody needs to be paid.
- All quest gold and item rewards flow to the leader.
- Payroll is owed regardless of quest outcome. Failure now costs money promised to other people.

### Hatred Blocks Party Membership

**No two characters at Hatred will serve in the same party.** This applies in every direction and to every stage of the career arc.

- A leader cannot hire someone who hates them, and that person will not accept.
- A player cannot join a party containing anyone at Hatred with them, and will not be accepted.
- If a relationship degrades to Hatred **during** employment, the pairing dissolves immediately — the NPC quits, or the player is dismissed mid-contract with all the severity that carries (§5).
- **This includes hatred between two hires.** If two of the leader's own party members come to hate each other, one leaves. Party leadership is therefore relationship management, not only payroll.

**Consequences:**

- **Serial romance shrinks the hiring pool permanently.** Every jilted partner is someone who will never work for you again, and romantic hatred never decays (§6). A player who accumulates wealth through romance simultaneously loses access to the labor they need to protect it — they end up able to afford a party nobody will join.
- **Envy-hatred reopens.** A man who resented a wealth gap becomes hireable again once the gap closes, so the male path's exclusions are temporary while the romantic ones are not.
- **Rescues cost hires.** Intervening on a friend's behalf makes the attacker hate you, which removes them from your available roster along with anyone else it propagates to.
- **A full party is a group with no internal hatred** — a real and tightening constraint as the roster's relationship graph fills in.

**Slice note:** at ~12 NPCs (§11), a handful of hatreds can make party formation difficult or impossible. Either keep the demo's hiring pool generous or accept that a socially reckless player runs out of options — the second is more interesting and should be tested before it is designed away.

### Succession Bridge
Because leaders are NPCs with the same data structure, **your leader can die mid-quest.** The party then dissolves or holds a succession — and the highest-reputation survivor inherits the party and its standing contracts. **Ties break by adventurer rank, then by quests completed, then by Pride** (§6). This provides an emergent path into leadership without capital, and gives the player a reason to care whether the leader survives beyond their own safety.

---

## 6. NPC Simulation

All NPCs use the **identical data structure to the player**: fixed stat block, 4 perks / 8 actives, gold, gear, faction standings, relationships, personality vector. They train skills, form relationships, marry, have children, and die permanently.

### Personality as AI Weights
Five values drive everything — combat behavior, wage negotiation, quitting, and disposition toward the player:
`Aggression · Greed · Caution · Loyalty · Pride`

A greedy ally overextends for kills. A loyal one interposes for the player. Recruiting for *behavior* is the strategy layer that replaces direct party control.

### Relationship System — A Full Graph

**Relationships exist between any two characters, not between NPCs and the player.** The player is one node among many. NPCs form friendships, rivalries, romances, and grudges with each other constantly, most of which the player has no part in and may never learn about.

If this is built as "each NPC holds a disposition toward the player," the world becomes a hub with the player at the center and can never surprise them. It must be an edge list over the whole cast.

**Tiers:** `Hatred → Neutral → Friendly → Romantic`

**Architecture:**
- **Edges are directed.** Ysolde may hate Mira while Mira does not know Ysolde exists. Envy, unrequited interest, and unacknowledged grudges are all one-way, and they are most of the interesting cases.
- **Romance is paired symmetric state**, not two independent edges — it cannot be one-sided once accepted.
- **The player's edges use the identical structure**, with no special-casing anywhere in the system.

### Slot Limits — The Graph Stays O(N)

Every NPC carries a small fixed number of **outbound** relationships. Everyone else is Neutral to them.

| Slot | Contents |
|---|---|
| **Player edge** | Always materialized, one per NPC. May sit at Neutral. Never occupied by anything else. |
| **NPC slot** | At least one other character — a partner, a friend, or an enemy. |

**The player edge is always available.** A married NPC still has an open channel to resent, befriend, or court the player, because marriage occupies the NPC slot and never the player edge. Every character in the world can always have an opinion about the player.

**Inbound edges are unlimited and free.** Because edges are directed, being hated costs the target nothing. A woman can be envied by five people and hunted by two while her own slots stay untouched. This is what makes a tight cap workable — the Mira/Kell/Ysolde scenario fits inside it exactly, with Ysolde spending her NPC slot on Mira, Mira spending hers on Kell, and none of them spending anything to be resented.

**Displacement when full.** A new relationship stronger in magnitude than the occupant replaces it; a weaker one is discarded. Fresh Hatred displaces a mild friendship, and an old grudge yields to a new betrayal. This keeps each NPC focused on whatever currently matters most to them.

**Result: the graph is O(N), not O(N²)** — it stays cheap at a thousand NPCs, not merely at twelve. Additional NPC slots can be granted later without changing the order of magnitude.

**Second-order propagation.** Events traverse the graph rather than terminating at the participants. A death shifts the dispositions of the victim's friends toward the killer; a betrayal shifts the betrayed party's friends toward the betrayer. Propagation is naturally bounded by the slot limits — an NPC only reacts to events touching the one or two people they actually track — and should be capped at one hop regardless.

Scores move on shared quests, rescues, betrayals, wage fairness, romance events, wealth gaps, and second-order propagation from all of the above.

### Social Modifiers — Male Characters

A male character's relationship status, wealth, and gear all shift how easily others reach each tier.

| Condition | Effect |
|---|---|
| **In a relationship** | Reaches Friendly more easily with **everyone** |
| **Single** | Reaches Friendly with **females** more slowly |
| **High wealth / gear** | Reaches Friendly with **females** more easily; reaches **Hatred with males** by wealth *gap* (below) |

**Males never take Hatred over relationship status.** Male NPCs do not resent a male character for being partnered — only for out-earning them.

**Marriage creates enemies for his wife, not for him.** Women who wanted him do **not** turn on him for choosing someone else — they turn on **her**. The count scales with his wealth and rank: a successful man's marriage hands his wife a batch of enemies at once, while he acquires none.

**A man's only sources of Hatred are the wealth gap (below) and women he has jilted.** Committing to someone costs him nothing socially.

**If his wife leaves him, her enemies clear.** The women who resented her return to **Neutral** toward her, since he is back on the market and the grievance is gone. This is the one hatred in the game that can be undone by someone else's action.

### Male-to-Male Hatred — Wealth Gap, Not Wealth

Driven by the **ratio between the observer's wealth and the target's**, never absolute totals. A man holding 200 gold does not resent someone going from 200 to 300. A man holding 25 gold resents that same person intensely.

Consequences:
- **A poor man is hated by nobody** — there is no gap to resent.
- **A rich man is hunted only by the poor.** Wealthy NPCs stay neutral toward him no matter how rich he gets.
- **The enemy pool drains on its own.** The world clock makes NPCs steadily richer, so yesterday's resentful pauper closes the gap and stops caring.

**Envy-hatred decays; injury-hatred does not.** Hatred earned purely from a wealth gap returns to Neutral once the gap closes. Hatred earned from romantic betrayal is permanent — it was an injury, not envy. This is the line between the game's two kinds of enemy.

### Female Characters Are Never Hated for Wealth

Neither men nor women resent a female character for how much gold she holds, at any gap. Her wealth is socially inert — it earns her nothing and costs her nothing. She can be the richest person alive and make no enemies by it.

**Hatred toward a female character has exactly two sources:**

| From | Cause |
|---|---|
| **Women** | She took the man they wanted. **The count scales with his wealth and rank** — marrying a successful man turns every woman who wanted him against her, so a high-status husband is a large batch of enemies arriving at once. |
| **Men** | She jilted them and left for someone else |

A marriage therefore generates female enemies for **both** partners — the disappointed women resent the husband for choosing and the wife for being chosen.

### The Symmetry

Both genders accumulate assassins, by opposite routes:

| | Male | Female |
|---|---|---|
| Enemies come from | **Succeeding** — a wealth gap breeds male rivals, marriage breeds spurned women | **Leaving** — every jilted partner turns hostile, plus women whose man she took |
| Wealth's social effect | Attracts women, breeds poor male rivals | **None whatsoever** |
| Enemy durability | Envy fades as rivals catch up | Romantic injury never fades |
| Being jilted | Restores him to the market, clears spurned rivals | No upside |

### Generated Dialogue Set
Every NPC is generated with five text bodies at creation, templated from their personality vector and archetype:

| Text | Used when |
|---|---|
| **Greeting** | First contact |
| **Neutral** | Default interaction |
| **Friendly** | At Friendly or above |
| **Hatred** | At Hatred |
| **Romantic** | While romantically involved |

This is the entire personality surface of the game — text and a portrait, no art cost.

### Dialogue Is the Relationship UI

**The text is how the player reads the relationship, and it must show movement.** A line that stays identical until a threshold flips tells the player nothing and makes the system feel like arithmetic they cannot see.

**Each text has warmth variants by score position within its tier** — low, middle, high. A partner drifting toward the bottom of Romantic sounds different from one at the top of it, before anything has formally changed. That difference is the player's early warning, and their evidence that effort worked.

**Design intent:** a player who quests with their spouse, approves their withdrawals, and comes home should *feel* the relationship improving in the words, not deduce it from a menu. Progress must be legible in the fiction, or the romance system becomes a spreadsheet with feelings attached.

### NPC Spouses Are Not Adversaries

**99% of NPC partners are honest and act to keep the relationship working.** This is not a soft default, it is a ratio. Roughly **1 in 100** relationships produces a genuine bad actor.

The rarity is the point. A partner who drains a vault is memorable precisely because ninety-nine others did not, and a world where spouses routinely scheme trains the player to treat every romance as a transaction — which is the opposite of what the dialogue system exists to create.

**The player generates most of the harm, and that is fine.** Expected player behavior, which the design should assume rather than resist:

| Behavior | Expected rate |
|---|---|
| Denying a partner's withdrawal | ~80% |
| Not bringing their spouse on a quest | ~80% |
| Initiating a new romance while involved | ~90% |

At those rates the vault locks, relationships decay, and jilted partners accumulate **without a single NPC doing anything wrong**. The systems get thoroughly exercised by ordinary player selfishness. Nothing needs to manufacture conflict.

**Tune for player consequence, not NPC aggression.** Effort should go into making the results of the player's own choices legible and sharp, not into giving NPCs schemes.

**The 1% must be telegraphed.** A bad actor's warmth variants (§6, Dialogue Is the Relationship UI) should cool over several quests before they act. A betrayal the player could have seen coming reads as drama; one that fires without warning reads as the game cheating.

- Approval of withdrawals, willingness to quest together, and relationship growth are the **normal** case for a couple spending time together.
- NPCs do not scheme by default. They respond to how they are treated.

**Framing note for the rest of this document.** The sections on draining, jilting for liquidity, and marrying for estates describe what the systems *permit*, not what players or NPCs are expected to do. They are betrayals available to those who want them, with costs attached. The assumed default — for every NPC — is someone trying to keep the person they have.

### Romance

**Eligibility:** the NPC must be at **Friendly or above** and the **opposite sex of the player**.

**No blood relations.** Romance is blocked with any direct blood relative — parent, child, or sibling and half-sibling through a shared parent. This matters on the nepotism path, where the player becomes their own child and half-siblings through a shared mother become reachable.

**Step-relations are not blood relations.** The adult child of a former spouse, by another partner, is unrelated and eligible. Nothing in the rules prevents jilting a woman to marry the daughter she had by someone else — and the ordinary rules handle the fallout without needing a special case: **the mother goes to permanent Hatred toward the player for the jilting, and toward her own daughter for taking the man she wanted.** Two enemies from one proposal, one of whom raised the other.

**Either party may propose** — the player can request it, and an eligible NPC can request it of the player.

**On refusal:** the relationship drops to **Neutral**, and can only be proposed again after climbing back to Friendly.

**There are no clean breakups.** A relationship can only end by one partner **accepting someone else**. Nobody simply walks away — leaving requires replacing. This is why every ended relationship produces an enemy, without exception.

**On accepting while already involved:** the prior romance ends immediately and that former partner drops to **Hatred**.

**The player chooses whether to hate; NPCs do not.** When the player is jilted, the drop to Hatred is offered rather than applied — they may take it or remain at Neutral. NPCs always take it, automatically and permanently. A player who declines to hate keeps the ex hireable, keeps the option of rebuilding the relationship, and forfeits any claim that Hatred would have enabled.

**The player may also elect Hatred toward anyone, at any time, for any reason.** NPCs only reach Hatred through the defined causes — romantic injury, wealth gap, jealousy — but the player is under no such restriction. Declaring Hatred unlocks assassination against that target and carries the normal costs: they may come for the player in return, and they will never join the player's party (§5).

This matters most on the inheritance path. An NPC heir carries no grudge unless their father killed their mother (§7), so a child of a woman killed by a rival inherits nothing but skills and a title. **A player controlling that heir can simply decide to hate her mother's killer** and go after her. The game does not hand them a target; it declines to stop them from choosing one.

**Reconciliation is possible, and it costs someone else.** An ex at Neutral can be climbed back to Friendly through shared questing and proposed to again. But because there are no clean breakups, taking them back means **they** jilt their current partner — creating a fresh permanent Hatred claimant aimed at them, and re-triggering the jealousy of everyone who wanted the person they returned to. Forgiveness is free for the forgiver and expensive for the forgiven.

**Jilting and the estate — asymmetric.** The estate is always held by the woman in a relationship (§7).
- **Male player:** his female partner holds the vaulted gold, items, and insurance claim. Ending the relationship means **she keeps all of it.** Serial romance forfeits his entire estate, converts a spouse into an assassin, and abandons the nepotism path.
- **Female player:** she holds her own estate; her male partner never does. Ending a relationship costs her **nothing financially** — she keeps everything and still gains an assassin.

A female character's cost for the inheritance path is paid in time instead (§7, Childbirth & Childcare), not in wealth.

### Assassination

Any character at **Hatred** may attempt to kill the other. Symmetrical between player and NPC.

**NPC-initiated.** A hated NPC interrupts the player at the **end of a quest, before returning to town** — an extra battle appended to the run. Because healing only occurs in town (§8), the player meets an assassin at their worst health of the entire quest. This timing is what gives hatred its weight: an assassin does not need to be strong, only patient.

**The player's party fights the ambush.** If the player is questing with a party — hired or joined — those members are present and defend them. A solo player faces the assassin alone at low health, which is where the system is deadliest.

**Assassins bring parties too.** A hated NPC with gold hires their own crew for the attempt, or brings their existing party. Wealth buys protection *and* buys the ability to overcome someone else's protection — it never grants immunity in either direction. A rich player with five hirelings is not safe from a rich assassin with five of their own, and the ambush becomes a full party battle at the end of a quest, at whatever health the player brought home.

**Party strength on both sides is the real variable**, which makes wages, loyalty, and hiring decisions matter more than personal combat power for a socially reckless player.

**So does the assassin's.** An attacker with gold hires their own party and brings it. NPCs run the player's rules, so a wealthy enemy arrives with four paid fighters at the end of the player's worst quest. This is the counterweight that stops hiring protection from being an outright solution — an arms race, not a wall. A jilted partner who got rich is far more dangerous than one who stayed poor, even though wealth alone never earns a woman enemies (§6).

**Player-initiated.** The player may attempt assassination on a hated NPC before embarking. It consumes world time exactly as a quest would.

**Resolution — one battle, permanent stakes:**
- The loser **dies permanently**, NPC or player alike.
- A failed attempt kills the attempter.
- The winner takes everything the loser was carrying.
- **The fight does not stop when the target dies** (§15a). An assassin who kills their mark still faces the mark's surviving party, and may attempt to Flee — at a real chance of failure.

**Consequences:**
- **Reputation and faction standing shift.** Killing a law-aligned adventurer pushes the player criminal; killing a criminal pushes them lawful. The sharpest alignment lever in the game.
- **The witness rule fires.** An assassination is combat, so the duel is a prime opportunity to learn the target's skills.
- **The roster changes permanently**, rippling through the victim's own friends' dispositions.

**Queueing rule:** at most one assassination attempt per quest return. Highest hatred score goes first; the rest wait.

### NPC-vs-NPC
NPCs court, marry, jilt, envy, betray, and assassinate each other on the world clock without the player's involvement or knowledge. These resolve abstractly unless the player is drawn in by a help request (below).

**Most of the graph should have nothing to do with the player.** A world where every relationship traces back to them is a world that revolves around them, and it will not feel alive. The Guild Roster and event feed exist so the player can watch a society they are only one member of.

### World Clock & NPC Progression

**Time advances when the player quests.** Every quest the player takes consumes world time, during which every other NPC is also questing.

**NPC quests resolve abstractly — never simulated as combat.** A roll against the NPC's skill levels, gear, and party composition produces one of: success · failure · death. This is the single most important performance decision in the system; running NPC fights properly would consume the entire budget.

Over the clock, NPCs independently:
- Succeed and fail quests, moving their reputation up or down
- Accumulate gold, and eventually buy **gear sets** (§10), raising their skills to intermediate
- Level individual skills through use
- Form and break relationships with each other
- **Die permanently**, leaving the roster for good

New NPCs generate over time to backfill the pool, entering poor and unequipped like everyone else.

**The world out-levels the heir — inheritance path only.** On the nepotism path (§7) the roster survives the player's death and keeps progressing. The child inherits into a world that moved on: a parent's former partymate is now famous and fully geared, a rival is rich, and the heir is starting out. This emerges from the two systems touching and requires no authored content. On the reincarnation path this pressure does not exist — the roster resets alongside the player.

### Population Management

**Starting population: 8 — 4 men, 4 women.**

**Growth comes only from children maturing.** No adult NPC ever appears from nothing. The roster expands because NPCs pair up, have children, and those children reach adulthood.

**Second source: conscription.** Each use of Conscript (§3a) adds **3 to world population** 3 quests later. These lives have unspecified parentage and mature into assassins targeting the conscriptor. A world containing a heavy conscriptor grows noticeably faster than one without — and that person is personally paying for all of it. Necromancy does not add population; it calls Divine Intervention instead (§3a).

**Targets:**

| Population | Algorithm behavior |
|---|---|
| **Under 20** | Aggressively pursue pairing. Push NPCs toward romance, accelerate courtship, suppress lethality. |
| **20–30** | Sustain. Normal romance rates. |
| **Over 30** | Relax pairing pressure; let the roster stabilize. |

**Gender skew: target ~60% women.** Achieved by weighting the sex of generated children — skew births female until the ratio is met, then rebalance.

**Why the skew matters mechanically.** A surplus of women means women routinely want the same man, which is what makes "she took the man they wanted" (§6) a frequent event instead of a rare one. The ratio is the engine driving the entire female-jealousy system. At 50/50 those rules mostly go quiet.

**Maturation.** A child becomes self-sufficient at 5 quests (§7) and joins the adult roster at **10 quests**, at which point they are a full NPC with skills, a stat block, relationship slots, and the ability to quest and marry.

### The Central Tension — Births and Murders Share an Engine

One child per relationship (§7) means population growth requires NPCs to **re-partner repeatedly**. From 8 people, reaching 20 adults requires roughly 12 children, which requires roughly 12 distinct relationships across only 4 men — so every man must cycle through several partners.

But every jilting creates permanent Hatred, and Hatred produces assassination attempts, which reduce population. **The system that grows the roster is the same system that kills it.**

The algorithm must manage this directly:

- **Below 20:** raise romance drive, and suppress lethality — reduce NPC quest-death rates and delay or dampen assassination attempts. Births must outpace deaths or the world never grows.
- **20–30:** allow lethality to return to normal. This is where the roster's drama should be at its richest.
- **Above 30:** stop pushing romance. Deaths and births roughly balance on their own.

**Emergency floor.** Pure birth-driven growth can deadlock — if all men die, the population can never recover. Define a hard floor (suggest 6) below which new adventurers arrive in town from outside as a safety valve. This should be rare enough that the player notices it as an event, not a faucet.

**The player's children count toward population targets** exactly as NPC offspring do. There is no separate accounting.

### Adventurer Guild Roster

A town menu screen (§8) tracking every living adventurer in the world. Pure text and data — zero art cost beyond portraits already authored.

Per entry:
- Name, portrait, adventurer rank
- Reputation trend — rising, falling, **famous**, **infamous**
- Recent quest outcomes (last several: success / failure / death)
- Current status — active, on a quest, missing, **dead**
- Gear tier and known skills, as far as the player has witnessed them
- Relationship to the player — friend, romance, enemy, neutral

### World Event Feed

A running, dated log on the Guild Roster screen. **This is what makes the simulation legible** — without it the world changes and the player perceives nothing but shifting numbers.

Every entry states cause and effect in one line, generated from the event that produced it:

```
Mira married Kell.
Ysolde now hates Mira.
Ysolde is hunting Mira.
Kell bought a Warrior set.
Doran failed a contract and did not return.
Ysolde and Bram are now friendly.
```

**Rules:**
- One line per event, cause and consequence both named.
- Only surface events involving NPCs the player has met, or people connected to them — the full simulation would be noise.
- Entries persist so a player can scroll back and reconstruct why someone hates someone.
- Danger notices and help requests appear inline in the feed, not as separate popups.

Pure text over data already being simulated. It is the cheapest screen in the game and the one that makes the world feel alive.

This screen is the emotional engine of the game. Its job is to make the player care what happens to people they never control.

### Rescue System

An NPC the player has a relationship with can enter a **danger state** the player is offered the chance to resolve. Two triggers:

**1. Failed quest.** The NPC botches a contract badly and enters danger rather than dying immediately.

**2. Assassination attempt.** Any NPC at Hatred with another NPC may attempt to kill them (§6). If the target is **Friendly or above with the player**, they send a help request instead of the attempt resolving abstractly.

**3. A hero's divine quest.** A hero above Neutral with the player sends a help request on every divine quest they are given (§3a), naming the target. This is the only work a hero can offer, and the only way their relationship with anyone can grow.

This is the system's signature moment. A friend marries the man another woman wanted, that woman turns on her, and the player gets a message asking for help against an assassin they may also know — with no authored content behind any step of it.

**Intervention mechanics:**
- **Time-limited.** The offer expires after a set number of world ticks. Accepting consumes world time exactly as a quest does. Refusing is silent and permanent.
- **NPC-vs-NPC assassinations resolve abstractly by default.** They become a **played battle only when the player accepts**, joining the target's side. This keeps the simulation cheap while making the moments the player cares about fully playable.

**Consequences of intervening:**
- **Success** — the target survives; large relationship gain with them and with their friends.
- **The attacker now hates the player.** You took a side. Every rescue converts someone else's grudge into your own, which is how a player who never wrongs anyone still accumulates enemies.
- **Failure or refusal** — the target dies permanently, and their friends' dispositions shift accordingly.

**Enemies in danger** are surfaced too. Declining to help is a valid, silent choice. Consider whether active sabotage — joining the attacker's side — should also be available.

**Design intent:** the rescue offer is where the roster stops being a spreadsheet. A player who ignores a friend's danger notice to finish a lucrative quest has made a story the game did not write.

### Performance Constraint — Tiered Simulation
Do **not** tick every NPC every quest; a browser build cannot sustain it. Three tiers:
1. **Full simulation** — anyone the player has met, plus current-region actors.
2. **Aggregate statistics** — everyone else, updated in bulk on coarse intervals.
3. **Lazy instantiation** — concrete NPCs generated only on first player interaction.

This supports thousands of persistent characters at browser-viable cost.

---

## 7. Death, Reincarnation & Nepotism

### Permadeath
Roguelike-permanent. On death:
- **Skills are retained.**
- **All carried items and gold are lost.**

### The Real Stake: World Continuity

The two death paths differ far more socially than mechanically. This — not the stat bonus — is what makes the nepotism track worth pursuing.

| | Reincarnation | Nepotism |
|---|---|---|
| Skills & levels | Kept | Kept |
| Journal | Kept | Kept |
| Carried gear & gold | Lost | Lost |
| Vaulted estate & insurance | Lost | **Inherited** |
| Base stats | Baseline | **Bonus by parent's rank** |
| NPC roster | **Wiped — new generation** | **Survives and keeps progressing** |
| Relationships | **All lost** | **Inherited, transformed** |
| Faction standing | Reset | Partially inherited |

### Reincarnation (Default)
A generational skip. Enough time is assumed to pass that **the entire roster has died off** and a new generation of NPCs is generated. Every relationship, friendship, romance, and rivalry is gone.

Functionally a new game that keeps only skill progression and the journal. Faction *organizations* persist as institutions; the player's standing with them resets to neutral.

### The Shared Vault

**The vault is held in the woman's name but shared during the relationship.**

- All of the **male partner's assets transfer into her vault** on commitment.
- Her own gold goes into the same vault.
- **He retains access until the relationship ends** — but every withdrawal requires her approval.
- **On breakup, he loses access permanently.** She keeps whatever remains.
- **Both partners can see the vault's full contents at all times** — gold and items. There is no hiding assets inside a relationship, and each partner can watch the other's balance rise and fall.

### Withdrawal Approval

**Every withdrawal from a shared vault requires the other partner's consent, each time.** Deposits are always free; only taking money out is gated.

**Approval is driven by recent shared questing.** This is the primary factor and it is deliberately legible — the player should always know how to unlock their own money.

| Recent history | Approval chance |
|---|---|
| **3 consecutive quests together** | High |
| Some shared questing, not consecutive | Moderate |
| **No shared quest in the last 3** | Very low |

**Personality modifies, it does not decide.** Loyalty nudges approval up, Greed and Caution nudge it down, and large withdrawals relative to the vault total are harder than small ones — but shared questing dominates the calculation.

**Hero exception.** A hero spouse can take no normal contracts, so their streak is satisfied by **accepting at least 1 of any 3 divine quest invitations** (§3a) rather than by three consecutive shared quests.

**The player approves too.** Fully symmetric: an NPC partner requests withdrawals from the player, and the player can refuse.

**Repeated refusal damages the relationship**, which is what stops both partners simply locking each other out forever.

**Consequences:**

- **Liquidity has a price.** Keeping the vault accessible means bringing your spouse on quests — a party slot spent, and a person exposed to danger, every trip. Marriage does not merely freeze capital; it charges rent to unfreeze it.
- **It stacks with childcare.** A mother questing beside her husband is paying tuition on every trip (§7), so a couple keeping their vault liquid pays for the privilege twice.
- **Draining requires investment.** A man who wants to empty the vault must quest with her three times running first — long enough for the relationship to be real and for her to have a chance of noticing.
- **NPC intent becomes readable.** A spouse who suddenly pushes to quest together three times in a row may be setting up a withdrawal. The tell exists without any UI explaining it.
- **Separation freezes everything.** A spouse who leads their own party or quests elsewhere accumulates no shared history, so the vault quietly locks for both of them.
- **Refusal is a real defense, with a cost.** A partner can stonewall every request and protect the money entirely. But refusal degrades the relationship toward a breakup, and a jilted partner becomes a permanent Hatred claimant who can kill them and take the whole vault at once. **Stonewalling protects the wealth and manufactures the assassin who will come for it.**

**Approval requires both partners in town.** A request made while the partner is away is queued and resolves when they return, never auto-denied.

**The vault is no longer safe.** It was the one store immune to death; it is now exposed to the person sleeping next to you. A partner can empty the account while you are out questing, and the wealthier the vault, the more attractive that becomes.

**Draining as a strategy — available, not expected.** A male character *may* court a wealthy woman and spend the vault down before leaving, but every withdrawal needs her approval, so it requires sustained cooperation rather than a single betrayal. Among NPCs this is a **rare outlier**, seen only in unusually high-Greed personalities and usually in a relationship already going badly (§6). The default spouse is not doing this, and the player should not have to play defensively against everyone they marry.

**Consequence for the promiscuous female build:** she still accumulates estates from every marriage, but every partner can spend them, and her growing wealth makes her a more appealing target for exactly that. Wealth accumulated through romance is never fully secured.

**Gold only.** A partner can withdraw gold from the shared vault but never items. Gear sets stored in the vault cannot be taken by a spouse — only claimed on death by a killing ex (§7).

### The Jilt Escape Valve

**A locked vault is a male problem only.** She holds it, so ending the relationship unlocks it — he loses access permanently and she keeps everything. His equivalent move forfeits the vault entirely. Jilting is her escape hatch and his surrender.

**This is also the exit from the poverty loop.** A mother who cannot afford tuition stays home, which stops her questing, which stops shared questing, which locks the vault (§7) — a squeeze that would otherwise have no move available. Jilting releases it: she ends the relationship, the lock disappears, and the vault is hers outright.

**The exit is slow, not instant.** Because there are no clean breakups, she must first reach Friendly with a replacement partner — and that requires shared questing she may not currently be doing much of. She has to claw back into the field before she can escape, which is what keeps the lock meaningful rather than decorative.

This is intentional and consistent with the wider asymmetry (men pay in wealth, women pay in time), but it needs a cost or it becomes free. Two checks apply, and the first is the real one.

### Check One — Who You Jilt

**Jilting is only cheap if the man is weak.** A jilted partner is a permanent Hatred claimant who will ambush her at the end of a quest, at her worst health, with a party he paid for (§6). If he outranks her, out-gears her, or can simply hire more people than she can, leaving him is close to suicide.

**The trap is structural.** The men worth marrying for their estates are the men with the highest rank and best gear — which is to say, the men most capable of killing her. **The attribute that makes him worth taking is the attribute that makes him dangerous to leave.** A woman optimizing for wealth is automatically selecting for the most dangerous possible enemies.

**The information is available and ignoring it is the player's error.** The Guild Roster (§6) shows his rank, gear tier, reputation trend, and recent outcomes. A player who jilts a fully-geared veteran without checking, and dies to him three quests later, was told.

### Check Two — Reputation for Jilting

Secondary, and cumulative. Every ended relationship is visible on the roster and in the event feed, and makes each subsequent romance harder to begin: slower progress toward Friendly, and a higher bar for a proposal to be accepted.

The first escape is cheap. The third is expensive. Nothing is hard-blocked, and the system limits itself without a rule that says no.

**Applies to both genders**, though it bites women harder, since jilting is a move they have reason to make and men mostly do not.

**Also existing:** hatred blocks party membership (§5), so each jilt permanently removes someone from the labor pool she needs to defend the vault — while adding someone to the queue coming for it.

### Estate Custody — Women Hold the Vault

**The vault always sits in the woman's name**, regardless of who earned its contents.

- **Male player:** his assets move into his partner's vault. He may spend from it while together, loses access at breakup, and it passes to her heirs on his death.
- **Female player:** holds the vault permanently. On her death it passes to her **eldest child** — unless an ex kills her, in which case he takes it (§7, Death, Items, and Vault Claims).

**The two paths cost differently:**

| | Male character | Female character |
|---|---|---|
| Estate custody | Transferred to spouse | Retained personally |
| Cost of jilting | Forfeits entire estate | None financially |
| Cost of the child | Wealth handed over | **Time — quests not taken** |
| Bears the child | No | Yes |

Men pay for the next generation in wealth. Women pay in time.

**A male NPC transfers his estate to a female player**, exactly as a male player transfers to a female NPC. NPCs share the player's data structure and the rule is fully symmetric.

**BALANCE RISK — serial romance as a money engine.** If male NPCs do transfer, then a female character accumulates a man's entire estate on marriage and **keeps it on jilting**. Repeated, this makes romance the highest-return activity in the game, out-earning questing outright:
- She buys every basic skill at full price without strain (all basics are purchasable, §3).
- She affords gear sets early, which floor her skills at intermediate — papering over her one real weakness, that she never levels anything through use.
- Her only cost is an accumulating line of assassins, which wealth can insulate against by hiring a party.

Options if this proves too strong:
- Only a portion of the male estate transfers, with the remainder retained until death.
- Jilting returns the transferred portion to the man rather than letting her keep it.
- Cap the number of concurrent or lifetime romances.
- Leave it — it is a legitimate strategy with real risk attached, and the assassin queue is a genuine counterweight.

**Decide this before building the economy**, because it sets the value of gold across the whole game.

### Death, Items, and Vault Claims

Two separate transfers happen when a character dies, and they do not go to the same person.

**1. Carried items go to the killer — whoever that is.** Any character who kills another takes everything they were carrying. This applies to assassins, rival adventurers, and any hostile encounter, not only to exes.

**2. The vault goes to the eldest child by default.** On death, the entire estate — vaulted gold, items, and the insurance claim — passes to the deceased's eldest surviving child. This is also the character the player becomes on the nepotism path (§7).

**3. An ex takes the vault only by killing her.** A former partner has no standing claim and inherits nothing by default. The claim is *earned by the assassination*, not held in perpetuity. A woman killed by a monster, a boss, or anyone other than an ex keeps her estate in the family.

**Consequence:** leaving someone does not endanger your children's inheritance. Only being murdered by the person you left does. This keeps the nepotism path reachable for players with complicated histories, and makes the ex-assassination route a deliberate act with a specific prize rather than a passive entitlement.

**If no children survive**, the estate is lost.

**Claim precedence — resolved.** A husband or ex who kills her **always takes the entire vault.** The killer's claim outranks every heir. Children inherit nothing from an estate collected this way.

### Estate Recovery by Assassination

A male character can additionally reclaim his estate by killing the woman holding it, taking her carried items as the killer and her vault as an ex in a single act. It is never clean.

**Required sequence.** Assassination requires Hatred (§6), and a partner only reaches Hatred by being jilted. So the route is **jilt → she turns hostile → assassinate.** Between the second and third step she is equally entitled to ambush him, and the ambush fires at the end of his quest when he is at his worst health. This is a race, not an execution.

**On success he collects both transfers at once** — her carried items as the killer, and the entire vault as an ex-claimant, including estates transferred to her by other men.

**Every child's fate is decided individually by the 5-quest self-sufficiency threshold** (§7, Childbirth & Childcare):

| Child's status at the mother's death | Outcome |
|---|---|
| **Under 5 quests — dependent** | **Dies.** A child still requiring care does not survive without their mother. |
| **5 quests or more — self-sufficient** | **Survives, grows up, and becomes an assassin hunting the father who killed her.** |

With several children of different ages, both happen at once — the dependent ones die and every self-sufficient one becomes a separate avenger. A man who kills a woman with three grown children is hunted by three.

### The Avenging Child — One Direction Only

**Children avenge a mother killed by their father. Nothing else.**

- A mother killed by the children's father → surviving children become claimants against him.
- A father killed by anyone → **no avengers.** His children do not pursue his killer.
- A mother killed by anyone other than the father → **no avengers.**

Children are raised by their mothers in this world. The bond that generates revenge is the one that was severed, and only the father can sever it.

A child in that single case acquires two things, regardless of who controls them:

1. **Permanent Hatred toward the killer.** Injury, not envy, so it never decays (§6).
2. **A standing claim on the estate taken from their mother.** Killing the holder restores it to them — this is what makes revenge worth pursuing rather than merely felt.

They also inherit, per the nepotism rules:
- **The murdered mother's skills**, at her levels
- **Additional base stats** scaled to her adventurer rank at death
- The title **"Son/Daughter of [Mother]"**

Killing a powerful woman therefore produces a proportionally powerful claimant, assembled entirely from data already stored.

**Who acts on it depends only on who occupies the role:**

| Role occupant | Behavior |
|---|---|
| **Player** | Incentive, not compulsion. They may hunt the killer to reclaim the estate, or never bother. |
| **NPC** | Pursues assassination by default on the world clock. |

### Scenarios — The Rules Are Player-Agnostic

The same rule set runs whether or not the player is involved at all.

| Scenario | How it plays |
|---|---|
| **Player is the mother, killed by her ex** | Death routes to nepotism. Player continues as a self-sufficient child with her skills, levels, and title — but no estate, since the killer took it. The target and the claim are already in place. |
| **Player is the father who killed her** | Recovers wealth; acquires one hostile claimant per surviving child, each built from his victim's kit, each hunting him by default. |
| **Player is a father killed by anyone** | **No avengers.** His children are with their mothers and do not pursue his killer. |
| **Player is the jilted husband** | May pursue his own estate recovery — jilt-to-Hatred, then assassinate the woman holding the vault, per the sequence above. |
| **All three are NPCs** | Resolves abstractly on the world clock with no player involvement. The wife is killed, the dependent children die, the grown ones start hunting their father, and the player reads about all of it in the event feed (§6) — possibly about people they have never met. |

**Male players receive the nepotism continuation.** A father's death routes to playing as his adult child, inheriting his skills, levels, and the "Son/Daughter of" title bonus — but no estate, since the vault sits in the mother's name, and no revenge target, since children only avenge a mother killed by their father. Inheritance is symmetric across genders; only the estate and the grudge are not.

This is the core architectural pillar applied to the revenge loop: NPCs run the player's rules, so the world produces these arcs on its own.

**Additional consequences:**
- Severe reputation and faction standing damage for spousal murder.
- The victim's friends on the roster shift toward Hatred, potentially producing further assassins.

**Avengers repeat until one side dies.** A failed attempt does not discharge the grudge; they come again at the end of a later quest.

**Multiple avengers hunt independently**, subject to the standard queue rule — at most one assassination attempt per quest return, highest hatred first.

### Children Are Simple

Children hold **no relationship state, no dispositions, and no opinions** until they mature into adult NPCs at 10 quests. There are exactly three outcomes:

| Situation | Outcome |
|---|---|
| **Mother dies before the child is self-sufficient** (under 5 quests) | The child **dies**. |
| **Mother killed by the child's father**, child self-sufficient (5+ quests) | The child becomes an **assassin of the father** (§7, The Avenging Child). |
| **Everything else** | The child matures at 10 quests into an ordinary NPC, with a rolled build and no inherited grudge. |

This is the complete set. A child whose mother is killed by a rival, a monster, a hero, or an assassin inherits nothing — not a target, not a disposition, not a memory. A child whose father dies inherits nothing either.

**The single exception is patricide-adjacent by design**: only a father killing the mother produces an heir who comes looking. Every other death simply adds a person to the roster.

### Pregnancy — Guaranteed

**Time is measured in quests.** One quest or one stay-home is one unit of world time. There are no days.

Every romantic relationship produces a child. This is not probabilistic in outcome, only in timing:

- **10% chance per quest** of conception, rolled each time the clock advances while in a relationship.
- **Guaranteed at 10 quests with no pregnancies.** If a relationship has produced no conception by its tenth quest, one occurs automatically. This floor guarantees at least one child per relationship.
- **Up to 3 children per relationship.** Additional children come from the 10% roll only; the guarantee applies to the first child, not to subsequent ones.

**The guarantee fires once per relationship**, for the first child only. Second and third children come from the 10% roll alone.

**Zero children is impossible for anyone who romances at all.** A player with three relationships has three children. The nepotism path (below) is therefore not an optional track a player might miss — it is the automatic consequence of any romance, and the only way to avoid it is celibacy.

**Multiple children — open rules:**
- **Childcare obligations are per child.** Each child carries its own 5-quest counter and its own tuition. Three children means three tuition payments every quest, or staying home — which is what makes a third child a genuine economic crisis rather than a footnote (§10).
- **Which child inherits** on the mother's death — the eldest, the youngest, or player's choice? The stat bonus scales with the parent's rank at death, so any of them qualifies.
- **Do abandoned children resent the parent?** A child from a relationship the player jilted has a living wronged parent. Given the avenging-child rule (§7), consider whether they inherit that grudge.

### Childbirth & Childcare

**Children are raised by their mothers.** A father carries no childcare obligation, pays no tuition, and never faces the stay-home choice. His children live with the woman who bore them, whether or not the relationship continues.

**Female characters give birth.** Once a child exists, every departure from town requires a choice:

| Choice | Effect |
|---|---|
| **Stay home** | No quest is undertaken. **World time advances anyway.** |
| **Pay childcare tuition** | Gold cost. Quest proceeds normally. |

**Self-sufficiency at 5.** After **5 total events** — any mix of quests taken with tuition paid and stay-homes — the child is considered self-sufficient. Neither the stay-home choice nor the tuition applies from that point on.

**Adulthood at 10.** At 10 quests the child joins the adult roster as a full NPC with skills, a stat block, relationship slots, and the ability to quest and marry.

**Design consequences:**
- Staying home is always available and always free, so a broke player is never soft-locked.
- Staying home advances the world clock (§6) while the mother gains nothing — ten stay-homes means ten quests' worth of roster progression watched from the sidelines. This is the sharpest expression of the world out-levelling the player, and it lands specifically on the inheritance path.
- Tuition competes directly with gear sets for gold, making the child a genuine economic rival to the player's own power.

**Home is safe.** Assassination fires only at the end of a quest, so a stay-home cannot be ambushed. A parent with enemies has a reason to stay home that has nothing to do with the child — and pays for it in forgone income and a locking vault.

### Nepotism (Inheritance)
The world does **not** reset. The same NPCs remain alive and continue progressing on the world clock (§6).

**Relationships transfer, transformed.** The parent's friends and enemies survive and recognize the heir as *the child of* someone they knew:
- Parent's friend → positive starting disposition, framed as inherited goodwill
- Parent's enemy → negative starting disposition, and grudges may actively target the heir
- The **"Son/Daughter of [Parent]"** title is what NPCs react to, alongside carrying the stat bonus

The heir starts into a world that has moved on without their parent — which is the cost of the path, and its best story generator.

### Estate / Will System
Before each expedition, the player designates carried vs. vaulted assets.
- **Carried gear:** lost permanently on death.
- **Vaulted gear, gold, and insurance claims:** pass to spouse or child.

This makes the pre-expedition loadout screen the central risk decision of the game and hooks the inheritance system into every trip out of town.

### Insurance
Premiums paid in town; payout on death goes to the spouse. Makes marriage a mechanical hedge and reframes the nepotism track as retirement planning.

### Nepotism Mode
If the player marries and has a child, and maintains the spouse/child relationship and estate through the playthrough, death routes to inheritance instead of reincarnation:

- **The eldest surviving child inherits**, and is who the player becomes on this path. They receive the vault (§7, Death, Items, and Vault Claims), the parent's skills and levels, and the title bonus.
- Gains the title **"Son/Daughter of [Parent]"**, granting a permanent **base stat bonus scaled to the parent's adventurer rank at death** — the only stat modifier in the game.
- Applies to **direct children only.** The next generation's buff depends on *that* parent's rank.
- If the character has not mated and produced a child, or the parent's rank was too low to qualify, death falls back to standard reincarnation.

---

## 8. Exploration & World

### Town Hub — Storybook Menu

**No traversable map.** The town is a single storybook-style screen: illustrated frame, text-forward, page-turn transitions between panels. No character movement, no walkable tiles, no location sprites.

**Persistent character panel** (always visible alongside the menu):
- Bust portrait
- Stats
- Equipped gear
- Skills — perks and actives

Keeping the sheet permanently on screen reinforces the core identity rule: you are what you carry and what you know.

**Menu options:**

| Option | Function |
|---|---|
| **Store** | Buy and sell gear. Items increase skill progression speed. |
| **Trainer** | Acquire basic skills — first 3 free, free if witnessed (§3), otherwise bought with gold. |
| **Apply for Party** | Submit to existing parties. Gated on reputation and visible skill sheet. |
| **Create Party** | Leads to hiring. Requires capital. |
| **Quest Board** | Accept solo or party contracts. Faction alignment shifts by selection. |
| **Faction Status** | Standing and alignment across all factions. |
| **Guild Roster** | Every living adventurer — rank, reputation trend, recent outcomes, status, relationship (§6). Source of rescue offers. |
| **Relationships** | Friends · Romances · Enemies. Romances feed the nepotism track (§7). |
| **Codex** | Re-readable tutorial entries, unlocked as concepts are encountered (§12). |

**Show locked options, don't hide them.** Create Party should be visible and greyed with its gold cost displayed from the first minute. A visible locked door is a goal; a hidden one is nothing.

**Vault / Will placement — decided:** not a separate menu item. Fold the carry-vs-vault decision into the departure confirmation from the Quest Board, so the risk choice happens at the moment of risk rather than in a screen players forget to visit.

### Quest Structure & Encounter Resolution

**A quest contains multiple encounters.** Not all require combat.

**Resolution verbs** — an encounter can be cleared by any route the player has access to:

| Verb | Gated by |
|---|---|
| **Fight** | Always available |
| **Talk** | Persuasion-tagged skill |
| **Charm** | Charm-tagged skill |
| **Intimidate** | Intimidation-tagged skill |
| **Sneak** | Stealth perk — **solo only**; in a party this becomes an ambush instead (§3a) |
| **Alignment pass** | Faction standing — criminal standing talks past bandits, law standing talks past guards |

**Alignment is a key, not just a score.** Faction standing (§9) functions as a traversal tool alongside skills (§8), giving reputation direct mechanical weight in the field.

**Every quest must be completable by every playstyle — a hard authoring rule.** No build is ever stranded. A pure stealth or pure social character clears the same content a fighter does, from the lowest bounty upward. Verbs are not per-encounter locks: **if the player owns a bypass perk, that route is offered at every encounter.** What varies is the cost or difficulty of taking it, never its availability.

Consequence: a bypass-heavy build is *stronger* at low tier, not weaker — it arrives at every boss untouched while a fighter limps in. Its cost is paid elsewhere (below).

**Core tradeoff — bypassing costs free skills.** The witness rule (§3) only fires in combat. Sneaking or talking past an encounter means never seeing that enemy's kit, so a bypass build pays gold at the trainer for every skill it ever learns, while a combat build earns them free and pays in risk. Neither route is gated; they pay in different currencies.

**Social and stealth routes are perks, not active skills.** Persuade, Charm, Intimidate, and Sneak each exist as a passive perk — always on, checked automatically at the encounter. Because perk slots are scarce, committing to a bypass route means surrendering combat identity. That is the intended cost.

**The player always chooses the resolution verb.** Allies never pre-empt an encounter decision, even though they act autonomously once combat begins. Encounter choice is one of the few levers the player holds and it is not surrendered. (Allowing allies to force encounters is a promising post-slice experiment, not slice behavior.)

### Healing & Attrition

**Full auto-heal on return to town.** No healing resource management between quests.

Consequence: **the quest is the attrition unit, not the encounter.** Damage carries across all encounters within a quest with no way to top up mid-run, so a multi-encounter quest is a resource curve and the decision to push on or bail is real. Healing skills matter inside a quest and are irrelevant between them, which keeps their design scope tight.

### Skills as Keys
Since nothing scales with level, exploration gates are **locks, not power checks.** Climb opens a cliff route. Detect Trap opens a ruin's lower floor. Silver Tongue opens a guarded gate. Every skill purchase visibly expands the accessible world, so the skill system and the map reinforce each other directly.

### Faction-Controlled Regions
Regions have owning factions. Player standing determines the encounter table — the same patrol is a merchant escort or an ambush depending on reputation. Factions do combat work, not just dialogue work.

---

## 9. Reputation & Factions

### Performance System
Reputation tracks quest completion vs. failure rate. Gates party applications, quest tier access, and hiring costs.

### Faction Standing
Launch scope: **Criminal / Law Enforcement / Neutral.** Architected for expansion to dozens of factions and regions.

Faction choice is expressed through quest selection. Standing shifts based on which quests are taken.

### Factions as Skill Gatekeepers
Criminal outfits use skills law enforcement never does, and vice versa. **Committing to one faction locks the player out of half the skill pool** — making alignment a genuine cost rather than a reputation number. Deliberate neutrality becomes the "learn everything" build: slower, broader, and a legitimate strategic choice.

---

## 10. Economy

### The Pyramid of Needs

Four competing gold sinks. **No character can satisfy all four early**, and which ones you cover defines your play more than your skill loadout does.

| Need | Gold path | Time path |
|---|---|---|
| **Skills** | Buy at the trainer | **Witness in combat** — free (§3) |
| **Gear sets** | Gold only | **None** |
| **Children tuition** | Pay per quest, **per child** | **Stay home** — forfeits the quest |
| **Party payroll** | Gold only | **None** |

**Gear and payroll are the wall.** They have no free path, so a character living on wages can never reach them. Crossing that wall requires leading a party or marrying into a vault — which is the entire reason the career arc (§5) and the romance economy (§7) exist.

**Conscription is the one exception.** A conscripted or raised party qualifies for party contracts and draws no wage (§3a), removing the payroll need entirely. A conscriptor reaches 3 of 4 almost immediately — and pays in permanent enemies and an eventual hero rather than in gold.

**Payroll scales with hired members, never with army size.** A leader paying three hires 40g each owes 120g whether those hires field two followers or twenty. Hiring conscriptors is therefore the highest-value use of a wage in the game, and the consequence — assassin debt and Divine Intervention — lands on the hires rather than the leader (§3a).

### Affordability by Tier

| Tier | Can afford |
|---|---|
| **Hireling on wages** | **1 of 4** with gold. **2 of 4** by using both time paths — witness skills instead of buying them, stay home instead of paying tuition. |
| **Party leader** | **3 of 4**, funded by taking all quest rewards. Payroll is owed win or lose. |
| **Serial jilter** | **3–4 of 4**, funded by accumulated estates — with a permanent and growing assassination queue attached (§7). |
| **Conscriptor** | **3 of 4** immediately. Party contracts and boss payouts with **no payroll at all** (§3a) — the fastest route to wealth in the game, paid for in permanent enemies and an eventual Divine Intervention rather than in gold. |

**There is no path to 4 of 4 without risk.** Wealth in this game is always either owed to someone or owed *for* something.

### Tuning Targets

- A **gear set** should cost on the order of 20–30 quests of hireling wages. It must read as unreachable from a wage, and reachable within a campaign from leadership or marriage.
- **Tuition per child, per quest** should be a meaningful fraction of a hireling wage — two children on wages should hurt, three should be impossible without staying home.
- **Party payroll** should consume most of a leader's take, so a failed quest is a real loss rather than a smaller gain.
- **Hireling wages** should comfortably cover exactly one need and no more.

**Design check:** if a player can pay tuition, buy skills, own a set, and run a party on hireling wages, the economy is broken. Something must always be going without.

### Storage — Three Locations, None Safe

| Location | Capacity | Lost to death? | Stealable? | Exposed to partner? |
|---|---|---|---|---|
| **Equipped** | Slot-limited | **Yes — killer takes it** | No | No |
| **Personal inventory** | **Weight-limited** | **Yes — dropped or taken** | **Yes** | No |
| **Vault** | Effectively unlimited | No | No | **Yes — shared access (§7)** |

**Every location has a predator.** Wearing something protects it from thieves but loses it to whoever kills you. Carrying it risks both. Vaulting it defeats death entirely but hands access to your partner. There is no fully secure store in the game, and choosing where to keep something is a standing decision rather than a solved one.

**Personal inventory carries a weight limit**, and gold has weight. This is why payouts default elsewhere.

**Quest payouts go to the vault by default.** Gold accumulates in the location that is safe from death and exposed to romance — which is the whole tension of the wealth system in one rule.

### Theft

**Items in personal inventory can be stolen. Equipped items cannot.** A thief takes from the pack, never off the body.

**Every successful Sneak steals.** There is no separate theft action or roll — slipping past someone and taking from their pack are the same move (§3a). This is true whether the Sneak resolved as a solo bypass or a party ambush.

**Sneak should work as a theft verb.** The stealth build bypasses encounters, which means it witnesses nothing and pays gold for every skill it learns (§3) — it is the archetype most starved for income and the one with the least reason to fight. Letting Sneak steal outside of combat gives it an economy that isn't romance, and closes the gap that otherwise makes stealth a build that gets poorer the better it plays.

**Who steals from the player:**
- Hated NPCs, as a lesser alternative to assassination
- Party members with high **Greed** (§6)
- Rogue-archetype NPCs opportunistically

**Theft resolves during quests**, as an event attached to an encounter — the thief acts, the victim discovers the loss on returning to town.

**Hires can rob the player** when Greed is high and the relationship score is low. Discovery drops that hire's relationship by 20 and reveals the theft in the event feed.

### Death and Item Loss

Reconciling with §6 and §7:
- **Equipped gear** goes to the killer.
- **Personal inventory** is dropped or taken by the killer — decide which, since dropped items imply recoverable loot and a whole retrieval layer.
- **The vault** is untouched by death itself and passes per the claim rules (§7).

### Gear Sets
Four sets in the slice: **Warrior · Ranger · Mage · Healer.**

Wearing a complete set raises all basic skills of that playstyle to **Intermediate** (§3) — a floor, not a stacking bonus. Sets are the single largest gold sink and the main reason to accumulate wealth.

**Progression gating — the world starts poor.** No player *or* NPC owns a set at the start of the game. Sets are earned into existence over time by both sides. This makes the opening state genuinely low-power for everyone and gives the world clock (§6) something visible to express.

**Gear sets are carried gear**, so they are lost permanently on death (§7) unless vaulted. This makes them the primary stake in the risk economy: the thing worth the most is the thing you can lose.

### Gold Flow

| Source | Sink |
|---|---|
| Solo quest rewards | Skill training (advanced tiers) |
| Hireling wages | Gear (skill progression speed) |
| Leader's cut of party rewards | Party payroll |
| Inheritance | Insurance premiums |
| | Party startup capital |

The economy is deep because payroll is a recurring obligation independent of income, and because gear is consumable-by-risk — every death destroys carried assets and removes them from circulation.

---

## 11. Vertical Slice Scope

Demo-only build to validate systems at minimum budget.

### Skill Pool — 31 Total

**Archetype skills** — six archetypes × (1 perk + 2 actives):

| Archetype | Perks | Actives |
|---|---|---|
| Mage | 1 | 2 |
| Tank | 1 | 2 |
| Rogue | 1 | 2 |
| Ranger | 1 | 2 |
| Fighter | 1 | 2 |
| Druid / Shapeshifter | 1 | 2 |

**Healing** — effectively a 7th archetype:

| | Count |
|---|---|
| Healing actives | 6 |
| Healing amplifier perk | 1 |

**Every healing skill carries an offensive application.** Healing is not a support-only archetype — each skill has a hostile mode drawn from: **poison · life steal · inflicting wounds · damage reflect**. A healer solos, and a healer threatens.

This is a viability requirement, not flavor. Without it, the healing build is unplayable alone and exists only as a hireling, which violates the rule that every playstyle must be viable at every stage of the career arc (§5).

**Every healing skill does double duty.** Each has an offensive face as well as a restorative one, so a healer is never a passive support character and a solo healer is fully viable. Offensive modes draw from: **poison · life steal · inflicting wounds · damage reflect.** Life steal in particular collapses the two functions into one action — damage dealt is health restored.

This is a hard viability rule, not a flourish: **no playstyle may depend on a party to function.** A healer questing alone must be able to kill things.

**Social / stealth perks** — one per encounter-resolution verb (§8):

| Perk | Verb |
|---|---|
| Persuade | Talk |
| Charm | Charm |
| Intimidate | Intimidate |
| Sneak | Stealth |

**Totals: 11 perks, 20 actives.**

**Critical efficiency rule: enemy loadouts draw from this same pool.** Do not author a separate enemy skill list. This makes every enemy sighting teach a player-usable skill and halves authoring cost.

**Healing scope note:** with full auto-heal on return to town (§8), healing skills matter only *within* a quest. They are the attrition counter-play, never a between-quest chore.

### Slot Reduction for Slice
Ship the demo at **3 perks / 4 actives** instead of 4/8.

Four actives: with only 2 actives per archetype, 8 slots read as unfinished rather than as a build decision.

Three perks: at 2, taking any social/stealth perk leaves a single combat perk, and with four verbs competing for one slot most players would never see non-combat encounter resolution at all. Three lets a player run one bypass perk plus two combat perks and actually experience the system. NPCs and monsters stay at 1–2 perks / 2–4 actives; bosses double that, capped at the player's slice limits.

### Enemies — 5 Types + 5 Boss Variants
- Each type: 1 perk, 2–3 actives.
- Boss version: double (2 perks, 4–6 actives).
- One portrait per type; boss reuses the portrait with a palette shift and scale increase.

### NPC Cast — Starts at 8, Grows
- **Starting population: 4 men, 4 women** (§6), matching the full game rather than a fixed demo cast.
- **1 hiring pool** and **2 employer parties** of 2–3 members, both drawn from the living roster rather than authored separately.
- **Design requirement:** the two employer parties cover *different* archetypes, so which party the player joins determines which skills they witness first. This generates replay value from a minimal cast.
- The roster grows during the demo as NPC children mature at 10 quests. A long slice session should end with a visibly larger world than it started with — worth demonstrating, since it is the clearest proof the simulation is actually running.
- Portrait pool (§1a) must cover generated children as well as the starting eight.

### Portrait Budget — ~32
10 player creation portraits (§1a) · 1 secret character portrait (§14) · 5 enemy types · ~12 named NPCs · ~4 shop/trainer faces.

### Gear Sets — 4
Warrior · Ranger · Mage · Healer (§10). No player or NPC starts with one; all are earned into existence over the world clock.

### World Clock
Active in the slice — it is what makes the roster and rescue systems legible. NPC quests resolve as abstract rolls only. At ~12 NPCs this is trivially cheap.

### Systems Cut or Deferred
- **Nepotism mode — deferred.** Requires meeting a spouse, conception, death, and the child reaching adulthood; a multi-hour arc that will not fit a slice. Demo **reincarnation** instead, which showcases skill persistence immediately. Optionally expose nepotism as a single scripted end-of-demo sequence to communicate the pitch.
- Expanded faction roster — slice runs the three base factions only.
- Tiered NPC simulation — unnecessary at ~12 NPCs; run all at full simulation and defer the aggregate/lazy tiers.

### Career Arc Compression
Accelerate the economy so the full three-stage loop fits the demo:
1. One solo quest.
2. Two to three quests as a hireling.
3. Enough gold to afford a single hire and form your own party.

---

## 12. Tutorial & Onboarding

**Assume every player skips.** The pre-game tutorial is a fallback, never the teaching mechanism. Real teaching happens at the moment of relevance, and the UI itself carries most of it — the journal pings on a sighting, locked options show their cost, ally intent icons appear before the player's turn.

Every line is one sentence. No line may exceed one sentence.

### Pre-Game — 5 Cards
Only concepts needed before the first fight. Skippable, with a persistent **Codex** in the town menu (§8) to re-read at any time.

1. There are no classes — your skills are your build.
2. Your stats never change; only your skills grow.
3. You learn skills at the trainer, and seeing one used in battle makes it free.
4. You can only carry so many, so learning something new means letting something go.
5. Death is permanent, but your skills follow you into your next life.

### Contextual Prompts — Fire Once, On First Occurrence
Each triggers the first time the situation arises, then never again.

| Trigger | Line |
|---|---|
| First skill witnessed | You saw something new — the trainer will teach it to you for free. |
| First advanced skill witnessed | You can't learn that yet, but you can learn what it grew from. |
| First skill level gained | Skills get stronger with use, and change form entirely at high levels. |
| First damage carried between encounters | You only heal when you return to town. |
| First non-combat encounter option | Not every encounter has to be a fight. |
| First party quest | You control only yourself — the others decide for themselves. |
| First ally intent icon shown | Their portraits show what they plan to do before you act. |
| First affordable gear set | A full set makes all your matching skills stronger. |
| First faction standing shift | The quests you accept decide who trusts you. |
| First quest departure screen | Anything you carry is lost if you die — leave what you can't replace. |
| First inventory weight limit hit | Gold weighs something; your payouts go to the vault by default. |
| First theft suffered | They can only take what you're carrying, never what you're wearing. |
| First party ambush | You can't hide a whole party — but you can strike first, twice. |
| First flee attempt | Running takes your turn, and it doesn't always work. |
| First Guild Roster open | Everyone here is questing while you are, and some of them won't survive it. |
| First danger notice | Someone you know is in trouble, and this offer expires. |
| First divine quest invitation | They can't take normal work — join one in three and that's enough. |
| First forbidden skill witnessed | Whoever used that is making enemies who don't exist yet. |
| First Divine Intervention called | Too many people want them dead, and the world has chosen a champion. |
| First hero defeated | Three quests of quiet, then someone twice as strong. |
| First time sparing a divine target | You keep everything they gave you, and now they come for you too. |
| First divine quest naming an ex | Finish it and you're still a hero. Walk away and you're not. |
| First rescue accepted | Taking a side makes their enemy your enemy. |
| First romance available | A family is the only way to keep this world after you die. |
| First pregnancy | Every relationship gives you a child — there is no avoiding it. |
| First withdrawal request | Quest together and your partner will approve withdrawals; drift apart and they won't. |
| First jilting | Check what he can afford before you leave him — he'll come for you at your weakest. |
| First time jilted | You can hate them for this, or you can let it go — only you get that choice. |
| First reconciliation | Taking them back means they leave someone, and that someone won't forget. |
| First childbirth (female) | Every trip out now costs you tuition or a stay at home. |
| First stay-home | The world keeps moving while you don't. |
| Child reaches self-sufficiency | Your child can look after themselves now — go freely. |
| First NPC reaches Hatred | Someone hates you now, and they may come for you at the end of a quest. |
| First blocked hire | People who hate you won't take your gold. |
| First assassination ambush | Whoever loses this fight is gone for good. |
| First avenging child appears | They have every skill you have, and more besides. |
| First death — reincarnation | Generations have passed; your skills remain, but everyone you knew is gone. |
| First death — nepotism | You play as your child now, and everyone your parent knew is still out there. |

### Rules
- No line runs longer than one sentence.
- No prompt blocks input; all are dismissible immediately.
- Nothing repeats after its first firing.
- Everything is retrievable from the Codex.

---

## 14. Custom / Patron Characters

Password-gated characters, distributed by contacting the developer or making a donation. Supporters may commission their own character with custom perks and actives. **Hiro is the reference entry, not a special case** — build this as a data-driven registry from the start.

### Architecture: Character Registry
A data table mapping `password → character definition`:
```
portrait · starting gear · perks[] · actives[] · flags
```
Adding a patron character is a **data edit, not a code change**. Do not hardcode Hiro.

### Architecture: Effect Primitive Library
Custom perks and actives are composed from a shared library of effect atoms rather than implemented per character. Hiro's kit specifies the initial set:

| Primitive | Source |
|---|---|
| Resource / stat multiplier | Rich, Demigod (healing ×10) |
| Overheal → temporary HP | Demigod |
| Status immunity | Demigod |
| Extra turns per round | Lone Wolf |
| Slot exemption by skill tag | Master Swordsman |
| Team-wide aura buff | God Aura |
| Negate next attack + reflect damage | Counter Attack |
| Threshold execute (HP % gate) | Finisher |
| Permanent stat gain on trigger | Finisher |
| Attack with stacking DoT rider | Katana Slash |

**No intake restrictions.** Any requested perk or active gets built. The primitive library exists to make that fast, not to filter requests — most will compose from existing atoms and ship as a data entry in minutes. Anything novel gets a new primitive written, which then makes every future request cheaper. Because the game is systems-heavy and art-light, a new mechanic costs code time only: no sprite, no animation, no VFX pass — visuals come from the code-generated VFX vocabulary (§1a), so custom skills are never visually silent.

### Per-Character Cost
One bust portrait matched to the §1a style lock. This is the recurring expense per patron.

### Universal Guards for All Registry Characters
- Tagged **unique tier / non-witnessable** — never learnable via the witness rule (§3).
- Excluded from NPC world simulation, hiring pools, and employer parties.
- Excluded from economy and difficulty tuning telemetry.

---

## 14a. Reference Entry — Hiro

Unlockable cheat character, **password-gated only**. No in-game unlock path — completing the game does not grant access.

### Access & Monetization
- Password: `Hiro`, entered at character creation.
- Distributed by contacting the developer directly or by making a donation. Effectively a paid character.
- **Honor system by design.** No obfuscation, hashing, or server-side validation. The password being publicly known is explicitly acceptable — access is a courtesy tied to supporting the project, not a protected asset. Do not build backend infrastructure for this.
- **Distribution check required:** if targeting CrazyGames or Poki, verify their terms on external payment links and off-platform monetization before shipping this. May require two builds — a portal build with no donation path, and a self-hosted build with it.

### Portrait (11th authored player portrait)
Purple dreadlocks · hazel eyes · dark skin · samurai armor · katana visible at the shoulder. Same bust crop, eye line, lighting key, and background treatment as the standard ten (§1a).

### Starting Gear
- **Abyssal Katana**
- **Ronin Gear**

### Perks — 4, all unique tier

| Perk | Effect |
|---|---|
| **Demigod** | All healing received multiplied ×10. Overhealing converts to temporary HP with **no cap** (baseline is 50%, §15a). Immune to all negative status effects. |
| **Master Swordsman** | Katana skills do not consume active skill slots. |
| **Lone Wolf** | Takes 3 turns per round instead of 1. Applies to Hiro only, never to party members. |
| **Rich** | All gold earned multiplied ×10. |

### Active Skills — 4, all unique tier

| Skill | Effect |
|---|---|
| **Katana Slash** | Basic attack. Can inflict Bleed, which **stacks**. |
| **God Aura** | Team-wide buff — increases allies' attack, evasion, and defense. |
| **Counter Attack** | Negates the next attack against Hiro and reflects its damage back at the attacker. |
| **Finisher** | Usable only on targets below 40% health. Instantly kills the target and heals Hiro. Grants a **permanent +1 to all of Hiro's stats**, stacking with every use. Lost on death. |

**Slot note:** Master Swordsman exempts katana skills from active slots. Tag which of these four qualify — at minimum Katana Slash and Finisher. Whatever is exempt, Hiro effectively runs all four plus free slots for witnessed skills.

### Required System Guards

1. **Unique-tier flag — mandatory.** The witness rule (§3) makes any *basic* skill learnable on sighting. All four perks must be tagged **unique / non-witnessable**, or a standard player fighting alongside or against Hiro becomes eligible to learn ×10 gold. The same guard applies to any skills granted by the Abyssal Katana.
2. **Lone Wolf turn placement — undecided.** Turn order is fully predictable under fixed stats (§2), so this must be explicit:
   - *Distributed* — three separate initiative slots spread through the round. Much stronger; he acts between every enemy action.
   - *Burst* — three consecutive actions in a single slot.
3. **Katana skill subset.** Master Swordsman requires an explicitly tagged katana skill list. Without one the perk has no defined scope.
4. **Economy isolation.** ×10 gold trivializes payroll, hiring, insurance, and gear pricing. Intended, but exclude Hiro runs from economy tuning telemetry.
5. **Debuff inertness.** Demigod's status immunity makes any debuff-centric enemy inert. Acceptable for a cheat character; do not tune enemy design around it.
6. **Finisher breaks the fixed-stat pillar — intentionally.** Stats never change (§2); the only sanctioned modifier is the nepotism inheritance title (§7). Finisher is the second exception and the only *repeatable* one. Document it as a deliberate cheat-character carve-out so it is never treated as precedent for normal progression.
7. **Finisher stack — uncapped by design.** Growth is deliberately unbounded; a long run scales Hiro indefinitely. This is the intended cheat fantasy, not an oversight. The stack still resets on death.
8. **God Aura vs. Lone Wolf scope.** Lone Wolf is explicitly Hiro-only; God Aura is explicitly team-wide. Keep the scoping distinct in implementation — with 3 turns per round, a team-wide buff refreshed that often is very strong in party play.

### The Hiro Bloodline

**Every child of Hiro inherits Demigod, and nothing else.**

| Inherited | Randomized |
|---|---|
| **Demigod** — ×10 healing, overheal to temporary HP, immunity to all negative status | Archetype, skills, alignment, personality vector, everything else |

A child of Hiro may be a demigod necromancer, a demigod thief, a demigod healer, or a demigod who never leaves the starting bounties. The birthright is survivability; the build is a roll.

**Demigod does not consume one of the child's perk slots.** It is a bloodline trait, not a chosen perk, and sits outside the normal 4/8 (or slice 3/4) limits.

**Still unique tier.** Demigod remains non-witnessable and unlearnable (§14a). It propagates by descent only — no one outside the bloodline can ever acquire it, including by fighting one.

**Demigods enter the world while Hiro is still alive.** His children mature at 10 quests (§6) and join the roster as ordinary adult NPCs — questing, marrying, hiring on, dying. He does not have to die for the bloodline to spread.

The volume is significant. Hiro is male, so he carries no childcare obligation; every relationship guarantees children and permits up to three; and ×10 gold makes him attractive to marry. **Three relationships is nine demigod NPCs** entering a roster that targets 20–30 people.

**This is expected, not a bug.** A long Hiro run permanently transforms the population — roughly a third of the world becomes status-immune with ×10 healing. Treat it as the intended consequence of playing a god: the cheat character rewrites the world he leaves behind.

Follow-on effects:
- **Demigod NPCs are the best hires in the game.** A later, normal character can recruit them, so one Hiro run improves every subsequent life in that world.
- **They are not invulnerable.** Only the player is immune to conscription and necromancy — a demigod NPC can be raised as undead, which kills them permanently.
- **Status-based encounter design degrades** as their numbers rise. Do not build content that relies on debuffs to threaten a late-game roster.

**Consequences worth noting:**
- A **demigod healer** is close to unkillable — ×10 on a kit already built around healing.
- A **demigod necromancer** is a world event: status-immune, self-sustaining, fielding an unlimited host, with Divine Intervention escalating against them regardless (§3a).
- **Debuff-based enemies are inert** against anyone in the line, so encounter design should not lean on status effects to threaten them.
- **Playing Hiro and dying routes to nepotism** — the player continues as a demigod child with a randomly rolled build, keeping one piece of the god and losing the rest. This is arguably the most interesting way to play the unlock.

**Direct children only.** Demigod does not pass to grandchildren. Unbounded inheritance would flood the roster and make status effects worthless game-wide.

### Death Handling
**Hiro follows the standard rules.** His death routes to reincarnation or nepotism like anyone's, and his carried gear is lost. The unlock is repeatable, not the character — re-entering the password at creation produces a fresh Hiro with the Abyssal Katana and Ronin Gear restored. His Finisher stat stack always resets.

---

# Part II — Build Specification

Everything below is implementation detail: concrete values, data structures, and screens. Part I is the design; Part II is what gets built.

## Read This First — What Is Settled and What Is a Guess

**Not every number here carries equal weight.** Some are decisions the design depends on; others are first estimates derived from a handful of hand-run encounters. Treating them identically will produce a build whose tuning knobs are welded shut.

### Load-bearing — change these and the design breaks

- **Three lanes**, front/mid/back, with reach and cover. Half the skill list references lanes directly.
- **Fixed stats.** Nothing raises them except the nepotism title, Hiro's Finisher, and the Hero perk.
- **Skill tiers at levels 1–9 / 10–24 / 25+**, with gear sets flooring at 10 and advanced reachable only through use.
- **Child thresholds: 5 quests to self-sufficiency, 10 to adulthood.** Both are referenced by the death, inheritance, and population systems.
- **Relationship tiers and the directed sparse graph** — 1 player edge plus 1 NPC slot per character.
- **The pyramid of needs**, and specifically that gear and payroll have no time path while skills and childcare do.
- **Permadeath, reincarnation, and the nepotism split.**
- **Divine Intervention triggers and the doubling escalation.**

### Placeholders — tune these freely, they are estimates

- **Relationship movement values** (+8 per shared quest, −25 for a refused rescue, and the rest of the table in §15). These set the pace of every romance in the game off a number I picked. Expect to change them first.
- **Skill power values** (§15a). Derived from four worked encounters, never playtested.
- **The flee formula** — 40% base, ±5% per point of Speed.
- **Gold amounts** (§16). The *ratios* are load-bearing — a gear set must read as unreachable on a wage — but the absolute numbers are free to move together.
- **Enemy stat ranges and skill levels** (§15, §17).
- **The 10-hatred Divine Intervention threshold.** Given expected player behaviour (§6), this likely fires in most playthroughs. That may be correct pressure or may make every run end the same way. **Measure it first.**

### Known untested

Combat has been checked against four hand-run encounters, not played. No encounter has been balanced against a full party. The economy has been derived but never run across a campaign.

---

## 15. Core Constants

### Stats — Four, Fixed at Creation

`HP · Attack · Defense · Speed`

Rolled once within the character's species range and **never changed** by anything except the nepotism title bonus, Hiro's Finisher, and the Hero perk.

| Species | HP | ATK | DEF | SPD |
|---|---|---|---|---|
| **Human** (all players, all NPCs) | 90–110 | 8–12 | 8–12 | 8–12 |
| Beast | 70–90 | 12–16 | 4–7 | 14–18 |
| Construct | 130–160 | 9–12 | 16–20 | 4–6 |
| Undead (raised) | ×1.5 of the original's stats | | | |

**Turn order is Speed, descending, fully deterministic.** Ties break by lane (front first), then by party order. Because Speed never changes, the player can always see the whole round's order before acting.

### Skill Levels

| Level | Manifestation |
|---|---|
| 1–9 | **Basic** |
| 10–24 | **Intermediate** |
| 25+ | **Advanced** |

- **10 uses per level.** Level 10 at 100 uses; level 25 at 250 uses.
- A gear set floors matching skills at **level 10 equivalent** — no effect if the skill is already 10+.
- Levels persist through drops, deaths, reincarnation, and inheritance.

### Relationship Scores

Range **−100 to +100**. Default on first meeting: **0**.

| Band | Score |
|---|---|
| **Hatred** | −100 to −50 |
| **Neutral** | −49 to +49 |
| **Friendly** | +50 and above |
| **Romantic** | Friendly **plus an accepted proposal** — a state, not a band |

**Warmth variants** render at low / mid / high thirds of whichever band the score sits in (§6).

### Score Movement

| Event | Change |
|---|---|
| Shared quest completed | **+8** |
| Shared quest failed | **+3** |
| Rescue succeeded | **+30** |
| Rescue refused or ignored | **−25** |
| Wage above 35g per quest | **+3** |
| Wage below 25g per quest | **−3** |
| Withdrawal approved | **+2** |
| Withdrawal refused | **−10** |
| Theft discovered | **−20** |
| Jilted (the abandoned partner) | **set to −100** |
| Woman whose wanted man married another | **−60** toward the wife |
| Wealth-gap envy, per quest while ratio > 4× | **−5**, floors at −60 |
| Envy decay, per quest while ratio < 2× | **+5**, ceilings at 0 |
| Second-order propagation (one hop) | **half** the primary change |

**Envy decays, injury does not.** Wealth-gap movement reverses; jilting and murder never do.

---

## 15a. Combat Math

### Basic Attack — Universal

**Every character has a Basic Attack.** It occupies no slot, is never learned or purchased, and cannot be witnessed.

- **Power 2.0**, single target, reaches the enemy front lane only.
- Scales with the character's own level progression at tier 1.0 permanently — it never becomes intermediate or advanced.

**Why this is required.** Without it, characters whose entire loadout is situational have no legal move. A Bandit carries Backstab (enemy back lane only) and Smoke Bomb (power 0) — against a solo player standing in the front lane, neither is usable, and the enemy would be unable to act at all. The same trap catches any tank, healer, or utility build whose actives are all conditional.

### Damage Formula

```
damage = round( ATK × power × tierMult × (1 + level × 0.015) ) − targetDEF
minimum 1
```

| Manifestation | tierMult |
|---|---|
| Basic (lv 1–9) | 1.0 |
| Intermediate (lv 10–24) | 1.4 |
| Advanced (lv 25+) | 1.8 |

**Worked example.** ATK 11, Aimed Shot (power 3.0), level 1, vs DEF 10:
`round(11 × 3.0 × 1.0 × 1.015) − 10 = 33 − 10 = 23`. A 95 HP Bandit dies in **4 hits**.

Same skill at level 25 advanced: `round(11 × 3.0 × 1.8 × 1.375) − 10 = 82 − 10 = 72`. Advanced manifestations are decisive, which is the payoff for never skipping a fight.

**Healing** uses the same formula with no DEF subtraction.

### Skill Power Values

| Skill | Power | Notes |
|---|---|---|
| Fire Bolt | 3.0 | Advanced hits a lane at 2.2 each |
| Frost Touch | 2.4 | Plus turn-order delay |
| Shield Wall | 0 direct | Halves incoming; **100% of damage prevented** is dealt to the attacker |
| Taunt | **1.5 retaliation** | Dealt each time the marked enemy attacks you |
| Bulwark *(perk)* | — | Reflects 25 / 40 / 60% of damage taken, by tier |
| Backstab | 3.6 | Enemy **back lane only** |
| Smoke Bomb | 0 | Evasion |
| Aimed Shot | 3.0 | Any lane |
| Snare | 1.2 | Plus turn-order control |
| Cleave | 2.2 | Per target, two targets |
| Sunder | 2.0 | Strips **12 DEF** for the battle |
| Thorn Skin | 0 | Reflects 50% of damage taken |
| Beast Shape | 0 | +50% ATK for 3 rounds |
| Mend | 2.5 heal | Offensive: 2.0 life steal |
| Cleanse | 0 | Offensive: status transfer |
| Regenerate | 1.0 heal ×3 rounds | Offensive: 1.2 poison ×3 |
| Guardian Ward | 0 | Offensive: reflect |
| Triage | 1.5 heal | Doubled under 25% HP |
| Blood Pact | 2.5 | Damages and heals the same amount |
| Conscript · Necromancy | 0 | Post-victory only |
| True Rest | — | One-shots undead regardless of stats |

### Quest Tracks — The Contract Is the Difficulty

**Enemy counts are fixed per contract, never scaled to party size.** The quest board offers two tracks, and choosing between them is the player's difficulty setting.

| | **Solo contracts** | **Party contracts** |
|---|---|---|
| Enemies per encounter | 1–2 | 3–5 |
| Encounters | 2–3 | 3–4 |
| Payout | **40% of tier** | Full tier |
| Available to | Anyone, alone or not | Requires a party — **hired members, conscripts, or undead** (§3a) |

| Tier | Solo payout | Party payout | Enemy skill levels |
|---|---|---|---|
| 1 | **40** | 100 | 1–9 |
| 2 | **100** | 250 | 10–17 |
| 3 | **200** | 500 | 18–24 |
| Boss | — | 800 | 25+ |

**Why this shape:**

- **Party size stays meaningful.** Scaling enemies to headcount would make hiring four people change nothing — you would fight four instead of one at identical difficulty, and the entire career arc from hireling to leader would lose its point.
- **The hireling wage makes sense.** A leader banking 400 while paying 30 is not simple exploitation; he is fronting payroll for a contract nobody could take alone.
- **Solo play is viable but poor.** A lone adventurer can always work, just never well. That is exactly the pressure pushing them toward the party system.
- **Boss contracts are party-only.** The slice's Grave Bishop cannot be soloed, which is what makes reaching leadership feel like an unlock.

**A solo character occupies the front lane.** Back-lane-only skills such as Backstab cannot target them — a real advantage of working alone.

### Ambush — Sneaking With a Party

**A party cannot hide.** Sneak conceals one person, not five, so a party that succeeds on a Sneak check does not bypass the encounter — it opens it on favourable terms.

**Ambush grants the sneaking character two consecutive turns at the top of round one**, before any enemy acts. The turn order strip shows this explicitly: `You → You → [enemies by SPD]`.

- Only the character who used Sneak gains the extra turn. Allies act in their normal SPD order.
- The steal still resolves (§3a) — an ambush takes from the target's inventory exactly as a bypass would.
- Enemies begin the fight without their intent icons resolved, so the ambusher acts against a lane that has not yet moved.

**This is the only bypass a party cannot use.** Talk, Charm, and Intimidate are performed in the open and work regardless of party size; stealth is the one verb that requires being alone to avoid a fight entirely. A party therefore fights nearly everything — and consequently witnesses nearly everything, which is why party play grows skills while solo stealth play grows gold.

### Field Capacity and Reserves

**Follower counts are capped by skill tier** (§3a); the battlefield caps everything else. Each side has three lanes holding **3 units each — 9 on the field at once.**

- A party whose combined roster exceeds 9 keeps the remainder in **reserve**, stepping into a lane on the turn after one clears.
- Reserves show as a count beside the party panel, not as portraits.
- The player's own character always holds a field slot and is never reserved.

A solo advanced conscriptor fields 5 units and never sees a reserve. A party of four conscriptors can exceed 20 between them, which is exactly when the queue matters.

**Practical ceiling.** A turn order strip listing 9 units per side is already dense; do not raise the field cap without redesigning that display.

### Combat Ends When a Side Is Gone, Not When a Target Falls

**Killing the target does not end the fight.** An assassin or hero who cuts down the person they came for is still standing in front of that person's party — people who chose to fight on their behalf and are, by that choice, combatants rather than bystanders. Nobody in a party is innocent of the party's business.

**Combat resolves only when one side is entirely dead or fled.**

This applies identically to assassination ambushes (§6), Divine Intervention (§3a), and ordinary encounters. A hero who kills a necromancer and then faces four of her hires must go through them, and may well die doing it.

### Flee — Universal, and Unreliable

**Flee is available to every combatant.** It occupies no slot and is never learned.

```
fleeChance = 40% + (fleerSPD − fastest opposing SPD) × 5%
clamped to 10%–90%
```

- **Attempting costs your turn.** A failed attempt does nothing at all — you stood still and the round went on without you.
- **A successful flee removes you from combat** with everything you carry. You are not killed and nothing is looted from you.
- **Fleeing a quest encounter fails the quest.** The player returns to town, takes the reputation hit, and keeps their gear.

**Who cannot flee:**

| | Reason |
|---|---|
| **Conscripts and undead** | Compelled. They fight until released, expired, or destroyed. |
| **Heroes** | Divine instruments with one purpose. A hero fights until the target is dead or the hero is. |

**Assassins can flee, and usually should.** Having killed the target, an assassin facing a surviving party is fighting for nothing — expect them to attempt escape, fail sometimes, and die on the floor of a fight they had already won.

**NPC flee behaviour is driven by Caution** (§6). High-Caution characters attempt escape early and often; high-Pride characters rarely attempt it at all, and high-Aggression ones essentially never do.

### Overhealing — Baseline for Everyone

**Healing beyond maximum HP becomes temporary HP.** This is a universal rule, not a perk effect. Any healing from any source, on any character, converts its excess rather than spilling.

- Temporary HP sits on top of maximum and is consumed first.
- It expires at the end of the battle.
- It caps at 50% of maximum HP.

**Temporary HP still counts as damage taken** for Bulwark's reflection and Taunt's retaliation (§3a). A hit absorbed by a shield triggers everything a hit to real health would.

**Why this rule exists.** Without it, healing is a dead action in any fight the character is winning — which makes it worthless to any build that does not need it reactively, and specifically makes healer/tank anti-synergistic, since reflection wins fights by taking damage while healing wants damage to have landed. With it, the two halves feed each other: heal into a shield, take the hit on the shield, reflect off the shield.

### Cross-Archetype Builds Must Not Cancel

**A hard balance rule: no two archetypes may anti-synergise.** The game is classless (§1); a player combining any two kits should get the sum of both, never less.

**The test:** for every pair of archetypes, is there a turn where owning both makes one of them a wasted action that owning only one would not? If yes, the pair is broken and needs a bridging rule like the one above.

Known bridges:
- **Healer + Tank** — overhealing into temporary HP, which still triggers reflection and retaliation.
- **Healer + anything** — every healing skill has an offensive mode (§3a), so healing is never a dead turn.
- **Tank + anything** — every tank skill has an offensive component (§3a), so guarding is never a dead turn.

**Check any new skill against this rule before adding it.**

### Recovery Between Encounters

**Winning an encounter restores 50% of maximum HP.** Healing is still unavailable in the field (§8) — this is a fixed post-victory recovery, not a heal.

Without it a four-encounter quest is unsurvivable for any non-healer. With it, a solo Tier 1 ranger runs roughly: end encounter 1 at 44 of 104, recover to 96, end 2 at 36, recover to 88, and finish the quest around 20. Tight, survivable, and it leaves healing skills valuable for in-combat sustain and for the tiers above.

### The Armored Trait

Armored enemies carry **+12 Defense**. **Sunder, Rend, or Shatter strips it** for the remainder of the battle.

This replaces the earlier immunity rule, which contradicted the guarantee that every quest is completable by every build (§8). A ranger without Sunder can still kill a Plated Sentinel — 15 damage a hit against 145 HP is ten rounds of grinding, which is a punishment rather than a wall.

### Balance Targets

Tune against these, not against feel:

- **3–4 hits** to kill a same-tier enemy at matched levels.
- **A solo Tier 1 contract (2–3 encounters, 1–2 enemies each)** ends with the player between 15% and 30% HP.
- **A party Tier 1 contract (3–4 encounters, 3–5 enemies each)** ends a four-person party around the same, with at least one member badly hurt.
- **An advanced-manifestation skill** should roughly triple its basic damage.
- **No encounter should be unwinnable by any build** — only slower for some.
- **Every archetype must be solo-viable on its free three skills.** Healing carries offensive modes (§3a) and tank skills carry reflection and retaliation; neither may open the game unable to deal damage. Worked check for a tank at ATK 9 / DEF 12 against a Bandit at ATK 10 / DEF 10: Taunt retaliation deals 14, Bulwark reflects roughly 4, and a Shield Wall round returns about 7 — around 19 per round without a single damaging active, killing a 95 HP Bandit in 5 rounds while taking roughly 10 a round.
- **Every archetype *pair* must be solo-viable too.** Combining two kits must never produce a dead turn that one kit alone would not (§15a, Cross-Archetype Builds Must Not Cancel). Worked check for healer/tank: Taunt marks, Mend at full health converts 23 into temporary HP, the enemy's hit lands on that shield, and reflection and retaliation both fire off it — so the heal is productive on a turn where it would previously have spilled.

---

## 16. Economy — All Values

**Base unit: 100 gold = one Tier 1 solo quest payout.**

### Income

| Source | Gold |
|---|---|
| Tier 1 — solo contract | **40** |
| Tier 1 — party contract | **100** |
| Tier 2 — solo / party | **100** / **250** |
| Tier 3 — solo / party | **200** / **500** |
| Boss contract (party only) | **800** |
| Hireling wage (flat, any tier) | **30** |
| Leader's take | Full payout, minus payroll |

Solo contracts pay 40% for 1–2 enemies per encounter; party contracts pay full for 3–5 (§15a).

### Costs

| Sink | Gold |
|---|---|
| Basic skill at trainer, un-witnessed | **150** |
| Basic skill, witnessed | **0** |
| First 3 skills | **0** |
| Childcare tuition, **per child per quest** | **20** |
| Party member wage (leader sets; NPCs accept 25–60) | **40** typical |
| **Gear set** | **800** |
| Insurance premium per quest | **50** |
| Insurance payout on death | **500** |

### Why the Pyramid Holds

- A hireling earns **30** per quest. One child costs **20**, netting **10**. Two children net **−10** — they must stay home.
- A gear set at **800** is **27 gross hireling wages**, and effectively unreachable with any dependent. Gold-only, no time path.
- A **solo** Tier 1 runner nets **40** — better than a wage, worse than anything else, and 20 clean quests from a gear set. Solo play is always viable and never lucrative.
- A **leader** on a Tier 2 party contract (**250**) paying three hires (**120**) nets **130**, and loses **120** outright on a failure. That gap is the whole reason to build a party.
- **Boss contracts (800) are party-only**, so the largest payouts in the game are structurally closed to anyone working alone.

**Design check:** if a hireling can afford tuition, skills, a set, and payroll simultaneously, the numbers are wrong.

---

## 17. Enemy Roster — 5 Types + 5 Bosses

All loadouts drawn from the 31-skill pool (§3a). No separate enemy skill list.

| Type | Species | Perk | Actives | Skill level |
|---|---|---|---|---|
| **Bandit** | Human | Opportunist | Backstab, Smoke Bomb | 1–9 |
| **Hedge Mage** | Human | Arcane Focus | Fire Bolt, Frost Touch | 1–9 |
| **Dire Wolf** | Beast | Momentum | Cleave | 5–14 |
| **Plated Sentinel** | Construct | Bulwark | Cleave, Taunt | 5–14 |
| **Grave Acolyte** | Human | Devoted | Regenerate *(poison)*, **Necromancy** | 10–20 |

### Bosses — Double Loadout

| Boss | Perks | Actives | Skill level |
|---|---|---|---|
| **Bandit King** | Opportunist, Momentum | Backstab, Smoke Bomb, Cleave, Sunder | 25+ |
| **Archmagister** | Arcane Focus, Bulwark | Fire Bolt, Frost Touch, Shield Wall, Taunt | 25+ |
| **Alpha** | Momentum, Wild Form | Cleave, Beast Shape, Thorn Skin | 25+ |
| **Sentinel Prime** | Bulwark, Momentum | Cleave, Taunt, Shield Wall, Sunder | 25+ |
| **Grave Bishop** | Devoted, Arcane Focus | Regenerate, Blood Pact, **Necromancy**, **Conscript** | 25+ |

**Notes:**
- **Plated Sentinel and Sentinel Prime carry the Armored trait** (+12 DEF, stripped by Sunder). Killable without it, just slowly — this is the §4 soft-lock rule in practice.
- **Every type has at least one damaging active.** An enemy built only from guards and taunts cannot threaten anyone; Shield Wall and Taunt alone made the original Sentinel a punching bag.
- **Grave Acolyte is how players learn Necromancy** — witness it, get it free, and inherit the consequences.
- **Grave Bishop is the slice's Divine Intervention seed.** A boss who conscripts and raises produces the roster's first hero without the player ever touching a forbidden skill.
- Boss portraits reuse the type portrait with a palette shift and scale increase (§1a).

---

## 17a. NPC Generation — Seeding

**Everything about an NPC is determined once, at the moment they enter the world, and never revisited.** There are exactly two such moments:

1. **Game start** — the initial 8 (4 men, 4 women).
2. **A child reaching adulthood at 10 quests** — the only other source of adult NPCs, alongside conscription's population additions (§6).

### Why This Matters

**With no authored story (see the opening), an NPC has exactly two ways to have a personality:** the phrases they speak, and the skills they choose to cultivate. That is the entire surface. Everything else about them — their marriages, betrayals, deaths — is the systems running, not character.

So both must be generated well, and both must be generated **up front**, because nothing later will add depth that seeding did not provide.

### Rolled at Seed

| Property | How |
|---|---|
| **Sex** | Weighted toward female until the ~60% target is met (§6) |
| **Name** | From a name pool, unique within the living roster |
| **Portrait** | From the portrait pool, tagged by sex and age band (§1a) |
| **Stats** | Rolled once in the human range: HP 90–110, ATK/DEF/SPD 8–12 (§15) |
| **Personality vector** | Aggression · Greed · Caution · Loyalty · Pride, each 0–100 |
| **Archetype inclination** | One or two of the seven archetypes (§3a). Determines which skills they buy and level over their whole life. |
| **Faction leaning** | Criminal / law / neutral, biasing which contracts they take |
| **Starting skills** | 3 free, drawn from their inclination |
| **Personality** | One of 40 — 20 male, 20 female (below). Determines every line they speak and their voice. |
| **Personality vector** | Rolled with a bias matching the archetype |

### The Dialogue Set — 40 Distinct Personalities

**Lines are written once per personality, not generated per NPC.** Every character draws from a library of **40 personalities — 20 male, 20 female**, assigned at seed.

**Every personality has its own script.** No line is shared between personalities, and no phrasing is reused across the library. A Stoic man and a Steely woman are separate characters who happen to be reserved, not one script in two voices.

**Volume: 40 personalities × 16 lines = 640 written lines.**
**Voice acting: 40 sets, one per personality.**

### The Four Bands

| Band | Lines |
|---|---|
| **General** | 4 |
| **Friendly** | 4 |
| **Hatred** | 4 |
| **Romantic** | 4 |

**General covers first meetings, greetings, and every ordinary interaction.** There is no separate greeting band — the first-meeting trigger (§17a) draws from General.

**Hard minimum: 4 lines in all four bands.** A band with fewer is a broken personality.

**Selection:** by warmth position within the band where the score has meaningful range, otherwise at random. **Never repeat a line twice running** for the same speaker.

### The 40 Personalities

**Male (20)**

| | | | |
|---|---|---|---|
| Stoic | Brash | Timid | Wrathful |
| Roguish | Curious | Haughty | Melancholy |
| Cool | Jovial | Cynical | Devout |
| Avaricious | Gentle | Blunt | Nervous |
| Theatrical | Weary | Earnest | Sly |

**Female (20)**

| | | | |
|---|---|---|---|
| Steely | Bold | Meek | Furious |
| Sultry | Inquisitive | Imperious | Sorrowful |
| Aloof | Sunny | Wry | Pious |
| Grasping | Tender | Curt | Skittish |
| Dramatic | Worn | Sincere | Cunning |

### Names in Text, Pronouns in Voice

Every line is written **once, in natural speech**, with pronouns where a third party is mentioned. The text box swaps those pronouns for names; the voice line says them as written.

| Token | Written as | Text box shows | Voice says |
|---|---|---|---|
| `{target}` | vocative address | The name | *(omitted)* |
| `{them}` | him / her | The name | him / her |
| `{their}` | his / her | The name's possessive | his / her |
| `{partner}` | him / her | The name | him / her |

**Write the pronoun form and let the renderer do the rest:**

```
WRITTEN   "I gave you everything and you gave it to {them}."
TEXT      "I gave you everything and you gave it to Kell."
VOICE     "I gave you everything and you gave it to him."
```

```
WRITTEN   "{their} name is the last thing you'll hear."
TEXT      "Mira's name is the last thing you'll hear."
VOICE     "Her name is the last thing you'll hear."
```

**`{target}` is the exception and must always be vocative** — direct address at a sentence boundary, never grammatically load-bearing, because the voice drops it entirely.

```
GOOD    "Good to see you, {target}."        VO: "Good to see you."
GOOD    "{target}. Something you need?"     VO: "Something you need?"
BAD     "I don't trust {target} one bit."   VO: "I don't trust one bit."
```

**Grammar matters.** `{they}` is the subject, `{them}` the object, `{their}` the possessive. Writing *"{them} deserved better"* produces *"Him deserved better"* in audio. Use the right one.

**Recording requirement.** Each personality records a sex-matched clip for every pronoun form — he, she, him, her, his, her(poss.), plus neutral they/them/their. **9 clips × 40 personalities = 360 pronoun clips**, reused across every line that needs one.

**Never render an unresolved token.** If the referenced character does not exist, that line is excluded from selection and another in the same band is used.

### Voice Integrity — A Hard Constraint

**One personality, one voice actor, one script. Lines never cross between personalities.**

Each of the 40 personalities is performed by a different actor. A character who speaks a line belonging to another personality changes voice mid-conversation, which destroys the only characterisation the game has.

**The rules that protect this:**

- **`personalityId` is immutable.** Assigned at seed, never reassigned, never rerolled — not on marriage, not on rank change, not on becoming a hero, villain, conscript, or undead. A character sounds the same at every point in their life.
- **Fallback stays inside the personality.** When a conditional line cannot resolve, fall back to another line **in the same band of the same personality's script**. Never another personality, never a shared pool, never a generic default. This is why each band requires at least one unconditional line.
- **There is no shared line pool.** No generic barks, no common phrases, no placeholder text that any character might speak. If a personality has nothing valid to say, show no dialogue box rather than the wrong voice.
- **No line is reused across scripts.** All 640 are unique. A phrase appearing in two personalities means two actors performing the same words, which is audible immediately.
- **Conscripts and undead keep their own voice** — a raised character speaks their own personality's lines, or is silent. They are never re-voiced.
- **Hiro and patron characters** (§14) each require their own personality assignment and voice set, or must be explicitly silent.

**Asset layout** should make cross-wiring structurally impossible:

```
vo/{personalityId}/general/{1..4}.mp3
vo/{personalityId}/friendly/{1..4}.mp3
vo/{personalityId}/hatred/{1..4}.mp3
vo/{personalityId}/romantic/{1..4}.mp3
vo/{personalityId}/pronoun/{him,her,them,neutral}.mp3
```

A line's audio path is derived entirely from the speaker's own `personalityId`. There is no code path that can produce a file from a different one.

### Personality and Behaviour Vector Must Agree

The personality is the voice; the five-value vector (Aggression · Greed · Caution · Loyalty · Pride) is the behaviour. **Seed the vector to fit the personality**, or characters sound one way and act another.

| Personality | Vector bias |
|---|---|
| Timid, Nervous, Meek, Skittish | High Caution, low Aggression |
| Brash, Wrathful, Bold, Furious | High Aggression, low Caution |
| Avaricious, Sly, Grasping, Cunning | High Greed |
| Devout, Earnest, Pious, Sincere | High Loyalty |
| Haughty, Theatrical, Imperious, Dramatic | High Pride |
| Stoic, Cool, Steely, Aloof | Balanced, low variance |

A Timid character who charges the enemy back line is not a character. Bias the roll, then let the remainder vary.

### Name Hooks — Token Substitution

**Every phrase is a template with substitution tokens**, resolved at render time. Without them a line is generic filler; with them the same fifteen phrases address whoever is standing there.

| Token | Resolves to | In text | In voice |
|---|---|---|---|
| `{target}` | The character being addressed | Their name | *(omitted — must be vocative)* |
| `{they}` | The third party — **subject** position | Their name | he / she |
| `{them}` | The same third party — **object** position | Their name | him / her |
| `{their}` | The same third party — **possessive** | Their name's possessive | his / her |
| `{partner}` | The speaker's current romantic partner | Their name | him / her |
| `{self}` | The speaker's own name | Their name | *(rarely used)* |

**Write lines in the pronoun form.** They should read as natural speech on the page — the renderer swaps in names for the text box, and the recorded audio says exactly what was written.

**Examples:**

```
General    "Good to see you, {target}."
General    "{target}. Something you need?"
Friendly   "You've had my back out there, {target}. I don't forget that."
Hatred     "I will have my revenge. I will kill {them}."
Hatred     "{target}. You knew what {partner} meant to me."
Romantic   "Wherever you're headed next, {target}, I'm going too."
```

Rendered, that fourth line reads *"I will kill Kell"* in the box and sounds *"I will kill him"* in the ear.

**Rules:**

- **Every phrase must contain at least `{target}`.** A line that never says who it's addressed to reads as narration, not speech.
- **`{them}`, `{their}`, and `{partner}` lines are conditional.** If the referenced character does not exist, that line is excluded from selection and another in the same band is used. Never render an unresolved token.
- **At least one line per band must be unconditional**, so every personality always has something to say regardless of who exists.
- **Substitution is name-only plus pronouns.** No declension, no possessive rewriting, no verb agreement. Write phrases so that plain insertion always reads correctly.

### When Phrases Fire

**The dialogue box is the only place characters exist as people**, so it must appear often. These are the trigger points — every one renders the speaker's portrait, name plate, and the appropriate band and warmth variant.

| Moment | Text used |
|---|---|
| **First meeting** — first time seen on the roster, in a party, or as an opponent | General |
| **Selecting them** on the Guild Roster or Relationships screen | Current band |
| **Being hired, or accepting your application** | Current band |
| **Departing on a quest**, one party member at random | Current band |
| **Returning from a quest**, success or failure | Current band |
| **Crossing into a new band** — General → Friendly, anything → Hatred | The band just entered |
| **Sending a help request** — danger, assassination, or divine quest | Current band |
| **Proposing romance**, and on acceptance or refusal | Romantic, or General on refusal |
| **Being jilted** | Hatred |
| **Requesting a vault withdrawal**, and on approval or refusal | Current band |
| **Opening an assassination ambush** | Hatred |
| **On their own death**, if the player is present | Current band |

**Band changes are the important ones.** A line that fires the moment someone crosses into Friendly, or into Hatred, is how the player perceives the relationship graph moving. Without it the score is invisible arithmetic.

**Line choice follows score position** within the band where it has range (§6). The same Friendly relationship at +52 and at +88 should not produce the same words, and that difference is the player's only read on whether things are improving.

**Never repeat the same variant twice in a row** for the same speaker. With three per band this is trivial to enforce and prevents an NPC sounding like a vending machine.

**Fallback when a line is unavailable** — because its token could not resolve: use another line in the same band. **Never fall back to another band**, and never render an empty box. A Hatred moment must never be delivered in a General voice.

### Skill Cultivation Over Life

An NPC's **archetype inclination is fixed at seed** and drives every skill decision they make afterward on the world clock (§6): what they buy at the trainer, what they level through use, and what they eventually manifest at intermediate and advanced.

This is why the roster develops recognisable individuals without any authored content. A ranger who has been questing for forty quests has **Volley**, and everyone who fought beside her knows it, because they witnessed it.

**The exception is witnessing** (§3). NPCs learn free from what they see, so a party will drift toward its leader's kit regardless of inclination — the one force that overrides seeding, and the reason a conscriptor's party becomes conscriptors.

---

## 18. Data Schemas

```
Character {
  id, name, sex, portraitId, species
  status: 'normal'|'hero'|'villain'|'undead'|'conscript'
  stats: { hp, atk, def, spd }        // fixed forever
  perks: [{ skillId, level, uses }]    // cap 4 (slice 3)
  actives: [{ skillId, level, uses }]  // cap 8 (slice 4)
  journal: [{ skillId, witnessed: bool }]   // uncapped, survives death
  equipped: [itemId]
  inventory: { gold, items: [itemId], weight, weightCap }
  vaultId | null
  gold                                  // carried only
  rank, reputation, questsCompleted, questsFailed
  factionStanding: { criminal, law, neutral }   // -100..100
  personality: { aggression, greed, caution, loyalty, pride }  // 0..100
  archetypeInclination: [archetypeId]   // fixed at seed, drives lifelong skill buying
  personalityId            // 1 of 40 (§17a) — indexes its line script and voice set
  lastVariantUsed: {}      // per band, to avoid repeating a line twice running
  partnerId | null
  childIds: []
  parentId | null, motherId | null, fatherId | null, titleBonus: int
  isUndead: bool, undeadQuestsLeft: int
  heroTargetId | null, heroPowerMult: int, divineInvitesWindow: [bool]
  isConscript: bool, conscriptQuestsLeft: int, conscriptorId
  hospitalizedQuestsLeft: int
  divineAttention: int                  // necromancy raise credits
  bloodline: { demigod: bool }
}

RelationshipEdge {
  fromId, toId                          // DIRECTED
  score: -100..100
  cause: 'quest'|'romance'|'jilt'|'envy'|'jealousy'|'rescue'|'theft'|'murder'
  decays: bool                          // true only for envy
}
// Sparse: neutral edges are not stored.
// Each NPC holds 1 player edge (always) + 1 NPC slot.

Vault {
  id, holderId                          // always the female partner
  gold, items: [itemId]
  sharedWithId | null
  insuranceActive: bool
  pendingWithdrawals: [{ requesterId, amount }]
  sharedQuestStreak: int                // drives approval odds
}

Quest {
  id, tier, track: 'solo'|'party', factionAlignment, payout
  encounters: [{ enemyTypeIds: [], lanes: {front:[],mid:[],back:[]},
                 verbsAvailable: ['fight','talk','charm','intimidate','sneak'] }]
  isBoss: bool                          // boss implies track: 'party'
}

WorldState {
  questClock: int
  population: int, targetPopulation: int, femaleRatio: float
  characters: [Character]
  edges: [RelationshipEdge]
  vaults: [Vault]
  eventFeed: [{ questClock, text, actorIds: [] }]
  activeHeroes: [{ heroId, targetId, powerMultiplier }]
  pendingRescues: [{ targetId, expiresAtQuest }]
}
```

---

## 19. Save State

Artifacts cannot use `localStorage`. Persist through the storage API, batching related data to avoid sequential calls.

| Key | Contents |
|---|---|
| `adv:world` | `WorldState` minus characters — clock, population, feed, heroes, rescues |
| `adv:characters` | Full character array, including the player |
| `adv:edges` | The sparse relationship graph |
| `adv:vaults` | All vaults |
| `adv:meta` | Journal carried across lives, unlocks, Hiro password state |

**Rules:**
- Write once per quest resolution and once on any town transaction. Never per combat round.
- `adv:meta` **survives permadeath** — it holds the journal and skill levels that persist across lives.
- Wrap every call in try/catch; a failed write must not block play.
- Provide a reset that clears all five keys.

---

## 20. Screen Inventory

| Screen | Contents |
|---|---|
| **Title** | New / Continue, visible password field (§14) |
| **Creation** | **Name entry**, 10 portraits in a grid, rolled stats, 3 free skills. The name feeds every `{target}` token in NPC dialogue (§17a). |
| **Town Hub** | Persistent character panel + 9 menu options (§8) |
| **Store** | Buy/sell gear, gear sets, insurance. **Each set must display which of the player's current skills it would actually raise** — a set floors skills at level 10, so buying one that only affects skills already past 10 is 800 gold wasted with no feedback. |
| **Trainer** | All 31 skills; witnessed ones marked free, others at 150g. Conscript and Necromancy display the forbidden-art warning (§3a) and nothing else. |
| **Quest Board** | Contracts split into **solo** and **party** tracks (§15a); **departure screen** with carry-vs-vault and tuition/stay-home choice |
| **Apply for Party** | Open parties, acceptance gated on rank and skill sheet |
| **Create Party / Hiring** | Roster of hireable NPCs, wage setting, payroll preview |
| **Faction Status** | Three standings, alignment history |
| **Guild Roster** | Every living adventurer + **world event feed** (§6) |
| **Relationships** | Friends / Romances / Enemies, vault panel, pending withdrawals |
| **Codex** | Tutorial entries unlocked so far (§12) |
| **Skill Journal** | Witnessed / Eligible / Learned / Mastered, with advanced forms shown |
| **Combat** | Three lanes per side, portrait units with name plate, HP bar, intent icon; turn order strip |
| **Encounter Choice** | Verb buttons for every route the player owns |
| **Post-Battle** | Kill / Knock out / Conscript / Necromancy, loot, witnessed-skill notifications |
| **Death** | Reincarnation or nepotism resolution, inheritance summary |

---

## 21. Build Order — The Only One

1. Character + skill data structures, shared by player, NPC, and monster
2. Three-lane turn-based combat, solo, one enemy type
3. Witness → trainer → level loop, with the journal UI
4. Quest board, encounter verbs, departure/vault screen, permadeath
5. NPC generation with personality vectors, ally autonomy, intent telegraphs
6. Relationship graph, event feed, Guild Roster
7. Hireling application / wage / firing loop
8. Faction standing and encounter-table variation
9. Party leadership, payroll, hiring
10. Romance, shared vault, withdrawal approval, pregnancy, childcare
11. Assassination, rescues, inheritance, avengers
12. Conscript, Necromancy, Divine Intervention
13. Save/load, Codex, tutorial prompts
14. Hiro and the character registry

**Steps 1–6 are the vertical slice's spine.** A build that stops after 6 already demonstrates the game; everything after deepens it.

---

# Part III — The Voice Script

**640 lines. 40 personalities. One actor each.**

Every personality below is a complete recording script. No line appears in more than one script. `{target}` is vocative and omitted in audio; `{them}` `{their}` `{partner}` are spoken as written and rendered as names in the text box (§17a).

Lines marked with a token other than `{target}` are **conditional** — excluded from selection when the referenced character does not exist. Every band contains at least one unconditional line.

---

# Male Personalities

## M01 · Stoic

**General**
1. "{target}. You need something."
2. "Say it plainly. I've work to do."
3. "Fine weather. Doesn't change much."
4. "Speak or don't."

**Friendly**
1. "You pull your weight. That's rare."
2. "I'd stand beside you again, {target}."
3. "No need to thank me. It's done."
4. "You've earned the quiet. Take it."

**Hatred**
1. "You knew what you were doing."
2. "I won't say this twice, {target}. Walk away."
3. "I'll settle this. Nothing personal in it."
4. "There's nothing left to discuss."

**Romantic**
1. "I don't say much. You already know why I stay."
2. "{target}. Come back in one piece."
3. "I've had one good thing. It's this."
4. "Whatever's coming, I'll be in front of it."

## M02 · Brash

**General**
1. "Ha! Look who it is. {target}, you old dog."
2. "Stand back, I'm working."
3. "You want something done right, you come to me."
4. "Make it quick, I've got glory to chase."

**Friendly**
1. "You're all right, you know that? All right."
2. "Stick with me, {target}, and you'll never eat cold."
3. "Best hands I've fought beside. Second best. After mine."
4. "Anyone touches you, they answer to this fist."

**Hatred**
1. "You've got a lot of mouth for a dead man."
2. "I'll break you in half and post the pieces."
3. "Come on then! Come on!"
4. "I've been waiting for an excuse, {target}."

**Romantic**
1. "You picked the best. Obviously."
2. "Nobody's touching you while I'm breathing."
3. "Say the word and I'll fight the whole board for you."
4. "Look at us. Absolutely unstoppable."

## M03 · Timid

**General**
1. "Oh — hello. Sorry. Hello, {target}."
2. "Should I come back later? I should come back later."
3. "I'll just — I'll wait over here."
4. "Did you need me? You didn't need me."

**Friendly**
1. "You're kind to me. Nobody's kind to me."
2. "I feel braver when you're there, {target}. Isn't that silly."
3. "I saved you a seat. I always save you a seat."
4. "I'd follow you anywhere. Somewhere safe, ideally."

**Hatred**
1. "Please don't. Please. I've asked nicely."
2. "You hurt {them}. You didn't even look back."
3. "I've stopped being frightened of you. It took a while."
4. "I've written down everything you did."

**Romantic**
1. "I keep thinking you'll change your mind."
2. "Is this all right? Us? It's all right?"
3. "There's nothing I'd hold back. Nothing at all."
4. "Don't go. Or go. Just come back."

## M04 · Wrathful

**General**
1. "What."
2. "Say it fast, {target}, before I lose my patience."
3. "Everyone in this town is useless."
4. "Don't stand in my light."

**Friendly**
1. "You. You're not useless. Congratulations."
2. "I'd burn this place down for you, {target}. Just say when."
3. "Anyone gives you grief, name them."
4. "Good. Someone with a spine."

**Hatred**
1. "I am going to take my time with you."
2. "You put your hands on {them}. That was your last mistake."
3. "There's no forgiveness left in me. You used it all."
4. "Run. I want you tired when I catch you."

**Romantic**
1. "The world's rotten. You're not. That's it."
2. "I'd kill anything for you and sleep fine."
3. "Don't ask me to be gentle. Ask me to be yours."
4. "Everything's noise. You're not."

## M05 · Roguish

**General**
1. "Well, well. {target}, is it?"
2. "Buy me a drink and I'll tell you something useful."
3. "I'd help, but I'm terribly lazy. Convince me."
4. "You've caught me at a charming moment."

**Friendly**
1. "You're my favourite. Don't tell the others."
2. "I'd trust you with my purse. That's practically a proposal."
3. "Trouble suits you, {target}. It suits me too."
4. "Every good story I've got has you in it now."

**Hatred**
1. "Oh, you've spoiled a perfectly good friendship."
2. "I liked you. Isn't that the sad part."
3. "You took {them} and thought I'd shrug."
4. "I'll be charming right up until I'm not."

**Romantic**
1. "I've stopped looking, {target}. That's what it means."
2. "You could ruin me and I'd thank you."
3. "Come here. I've got something to say and no words for it."
4. "Every road out of town, I keep turning back."

## M06 · Curious

**General**
1. "Oh — {target}! What have you got there?"
2. "Do you know why they do it that way? Nobody knows."
3. "I've a question. I've several questions."
4. "Wait, wait, say that part again."

**Friendly**
1. "You explain things properly. Do you know how rare that is?"
2. "I could talk to you all night, {target}."
3. "You've seen things I've only read about."
4. "Take me with you. I want to see it happen."

**Hatred**
1. "I want to understand why. I don't think I ever will."
2. "You did it to {them} first. I looked into it."
3. "I've studied you now. I know exactly where you're soft."
4. "Fascinating. Awful. Both."

**Romantic**
1. "I'll never finish learning you. That's the appeal."
2. "Tell me something true, {target}. Anything."
3. "I've stopped asking questions about us. That's new."
4. "You're the best thing I've found and I've looked everywhere."

## M07 · Haughty

**General**
1. "You may address me."
2. "{target}. Try to be brief."
3. "I am surrounded by amateurs."
4. "Yes, yes, get on with it."

**Friendly**
1. "You are adequate. I mean that warmly."
2. "I have raised my opinion of you, {target}. Do not squander it."
3. "You may walk on my left. That is an honour."
4. "Finally. Someone with standards."

**Hatred**
1. "You are beneath contempt and I'll still make time."
2. "Do you imagine {they} chose you? {they}, of all people?"
3. "I'll have your name struck from the roster."
4. "You have embarrassed yourself in front of me."

**Romantic**
1. "I have chosen you. Comprehend the magnitude."
2. "The world bores me relentlessly. You have not managed it."
3. "Stand closer. I dislike shouting affection."
4. "Should anything happen to you, I will be extremely displeased with the world."

## M08 · Melancholy

**General**
1. "Ah. {target}. It's you."
2. "Another day. Same as the last one."
3. "I wasn't doing anything. I rarely am."
4. "Go on, then. I'm listening."

**Friendly**
1. "You make the hours pass. That's not nothing."
2. "I'm glad you came, {target}. I don't say that often."
3. "There aren't many left I'd sit with."
4. "You remind me things used to be lighter."

**Hatred**
1. "I wish I could be angry. I'm only tired of you."
2. "You took {them} and I couldn't even find the strength to shout."
3. "I'll do what needs doing. I won't enjoy it."
4. "You've made a sad thing sadder."

**Romantic**
1. "You're the one good hour in a long day."
2. "I don't deserve this and I'm keeping it anyway."
3. "Stay a while, {target}. Just a while."
4. "If it ends, let it end late."

## M09 · Cool

**General**
1. "Hey. {target}."
2. "Yeah, I'm around. What's up."
3. "Whatever it is, it's fine."
4. "Take your time. I've got nowhere to be."

**Friendly**
1. "You're solid. That's my whole review."
2. "Anytime, {target}. Seriously."
3. "I don't sweat much, but I'd sweat for you."
4. "You're good people. Keep it up."

**Hatred**
1. "Yeah, no. We're done."
2. "You want to do this? Cool. Let's do this."
3. "Heard what you did to {them}. Not a fan."
4. "I'll be around. That's the threat."

**Romantic**
1. "You're it. That's all I've got."
2. "Come here, {target}. Sit down."
3. "Not really my thing. Turns out it is now."
4. "Whatever happens, we're fine. We're always fine."

## M10 · Jovial

**General**
1. "{target}! There you are, you magnificent creature, come in, come in!"
2. "Sit down, no, not that chair, that one, there we are."
3. "Ha, I was only just now thinking about you and here you stand."
4. "You've got a face like good news and I could use some."

**Friendly**
1. "You're the reason I come back to this town, and the ale is only second."
2. "There's nothing like a friend, {target}, nothing in this whole wide world."
3. "Whatever you need it's yours, and don't you dare argue with me about it."
4. "We should do this more often, we should do this always, in fact."

**Hatred**
1. "And I liked you, I actually liked you, do you know how rare that is for me?"
2. "No more laughing, not for you, not ever again."
3. "You looked me right in the eye and did that to {them} anyway."
4. "I've a long memory and a very short temper where you're concerned."

**Romantic**
1. "I've been grinning like an absolute fool for weeks and it is entirely your doing."
2. "Come here, {target}, no, closer than that, there, that's it."
3. "I want the whole town to know, every last one of them, I'll tell them myself."
4. "Every good thing I've got, you're standing right in the middle of it."


## M11 · Cynical

**General**
1. "Let me guess. You want something."
2. "{target}. Still alive. Impressive."
3. "It'll go badly. It always goes badly."
4. "Sure. Why not. Everything else has failed."

**Friendly**
1. "You've not disappointed me yet. Give it time."
2. "I trust you. I hate that I trust you."
3. "You're the exception, {target}. Don't ruin it."
4. "If anyone's getting out of this town, it's you."

**Hatred**
1. "Called it. Knew you'd do exactly this."
2. "Everyone's a snake. You just proved it loudest."
3. "{they} believed you. I never did, and it still hurt."
4. "Don't bother explaining. I've heard it."

**Romantic**
1. "I stopped believing in this. Then you turned up."
2. "You're the one thing I don't expect to lose."
3. "I've got no faith left, {target}. Except this."
4. "Everything ends. Let's be slow about it."

## M12 · Devout

**General**
1. "Peace upon you, {target}."
2. "The morning is given. We do what we can with it."
3. "Speak. I've time and the light's good."
4. "Nothing happens without reason. Even this."

**Friendly**
1. "You've a good heart. I've watched it work."
2. "I pray for you, {target}. Every night, by name."
3. "Walk with me. The road's better shared."
4. "There's grace in you. Don't spend it carelessly."

**Hatred**
1. "You'll answer. Not to me. But you'll answer."
2. "I've prayed for you and got nothing back."
3. "What you did to {them} was a sin with a name."
4. "I'll not forgive you. That's above my station anyway."

**Romantic**
1. "You were given to me. I'll not waste it."
2. "Every prayer I've got ends with your name in it."
3. "Kneel with me, {target}. Just for a moment."
4. "Whatever comes after, I want it with you."

## M13 · Avaricious

**General**
1. "What's it worth to you, {target}?"
2. "Time's money. You've had a copper's worth already."
3. "I'm listening, and I'm charging."
4. "Nothing's free. Nothing's ever been free."

**Friendly**
1. "For you? Discount. Small one. Don't push it."
2. "You've made me money, {target}. That's love."
3. "I'd front you the gold. That's how much I like you."
4. "Partners, then. Fifty-fifty. Fine, sixty-forty."

**Hatred**
1. "You cost me. That's the unforgivable part."
2. "I've priced your life and it's cheap."
3. "You sold me out to {them} for what? For what?"
4. "There's a bounty on your head and I wrote it."

**Romantic**
1. "I'd spend everything on you and still feel ahead."
2. "Everything I have, I bought. Except this."
3. "Take whatever you want, {target}. I mean it. Mostly."
4. "Rich or ruined, I want it with you."

## M14 · Gentle

**General**
1. "Hello, {target}. You look tired."
2. "Sit down. There's no rush here."
3. "Whatever it is, we'll manage it."
4. "Have you eaten? You should eat."

**Friendly**
1. "I'm glad you found your way back."
2. "You don't have to carry all that alone, {target}."
3. "I've kept something aside for you."
4. "You're safe here. That's all I wanted to say."

**Hatred**
1. "I don't want to do this. I'm going to."
2. "You made {them} afraid. I saw it in {their} face."
3. "I've been patient. You've used it all up."
4. "Don't come near anyone I love again."

**Romantic**
1. "There you are. The whole day's better now."
2. "I'd carry it all if you'd let me."
3. "Rest, {target}. I'll keep watch."
4. "I love you quietly. I hope that's enough."

## M15 · Blunt

**General**
1. "{target}. What."
2. "Skip the preamble."
3. "Stupid plan."
4. "Heard worse."

**Friendly**
1. "You're competent."
2. "I'd have you at my back, {target}."
3. "Less talking than most. Good."
4. "Don't die."

**Hatred**
1. "You're a coward."
2. "I'm going to kill you."
3. "{they} deserved better, obviously."
4. "No speech."

**Romantic**
1. "I'm no good at this."
2. "You. That's the answer now."
3. "Don't get yourself killed."
4. "I'd say more. I can't."


## M16 · Nervous

**General**
1. "Oh — {target}. Hello. Sorry, I didn't — hello."
2. "Is this a good time? It's probably not a good time."
3. "I wasn't listening. I mean, I was, but not — sorry."
4. "Right. Yes. What do you need?"

**Friendly**
1. "You always know what to do. I don't know how you do that."
2. "I'd come with you. If you wanted. Only if you wanted."
3. "Thank you, {target}. Really. I mean it."
4. "I sleep better knowing you're on the contract."

**Hatred**
1. "Don't — don't come near me. I mean it this time."
2. "You did that. You did that to {them} and you didn't even —"
3. "I'm not afraid of you. I'm not. I'm not."
4. "I've thought about this every night. Every single night."

**Romantic**
1. "I still can't believe you picked me. Genuinely."
2. "Did I say that wrong? I said that wrong."
3. "I'd be lost without you, {target}. Properly lost."
4. "Just — stay near me. That's all."

## M17 · Theatrical

**General**
1. "Ah, {target}, enter — the stage was so terribly empty without you upon it."
2. "You find me in a moment of profound and largely self-inflicted contemplation."
3. "Speak, and if you can manage it, speak beautifully."
4. "The day was dull as ditchwater until you arrived to salvage it."

**Friendly**
1. "You, my friend, are the finest second act a man could hope to be handed."
2. "History shall remember the pair of us, {target}, and I intend to write the account myself."
3. "I would compose you a ballad, but you would only blush and spoil the performance."
4. "What a pair we make — what an absolutely magnificent and improbable pair."

**Hatred**
1. "Oh, the treachery of it, and performed so very poorly at that."
2. "You shall die a villain in the third act and I shall narrate every moment."
3. "You broke {their} heart with an audience assembled and did not even bow."
4. "This ends in blood, as these things invariably do, and isn't that simply marvellous."

**Romantic**
1. "Every song I have ever heard turns out to have been about you, and I have checked them all."
2. "Stand with me in the light, {target}, and let them look their fill."
3. "I have played a great many parts in my time, but this one, I confess, is real."
4. "Let the world end tomorrow — I have had my scene and it was glorious."


## M18 · Weary

**General**
1. "You again."
2. "Whatever it is, I've probably done it before."
3. "I'm too old for this. I've been too old for years."
4. "Go on. I'll pretend to be surprised."

**Friendly**
1. "The days go quicker with you on them."
2. "I've buried a lot of partners, {target}. Don't be one."
3. "You'd have made a good soldier. Back when it mattered."
4. "Sit. You don't have to talk."

**Hatred**
1. "I haven't the energy to hate you properly. I'll manage."
2. "You'll get old too. If I let you."
3. "I watched what you did to {them} and I felt nothing. That scared me."
4. "One more grave. Fine."

**Romantic**
1. "I thought I was done. Then there was you."
2. "I've got a few good years left. They're yours."
3. "Don't outlive me by much, {target}."
4. "I'd have found you sooner if I'd known where to look."

## M19 · Earnest

**General**
1. "{target}! Good, I was hoping to catch you."
2. "Tell me what's needed. I'll do it properly."
3. "I've been practising. I think I'm improving."
4. "I want to help. Genuinely."

**Friendly**
1. "You've taught me more than anyone here."
2. "I'd go anywhere with you, {target}. Just say it."
3. "I meant what I said. I always mean it."
4. "I'd have quit long ago without you."

**Hatred**
1. "I trusted you. That was mine to give and you wasted it."
2. "I don't want to fight. But I will and I'll be good at it."
3. "You lied to {them}. To {their} face."
4. "I keep waiting for you to be sorry."

**Romantic**
1. "I love you. There. I've said it properly."
2. "You'll never have to ask me twice."
3. "I'll be here, {target}. That's the whole plan."
4. "I've never been more sure of anything."

## M20 · Sly

**General**
1. "Look at that. {target}, in the flesh."
2. "I know things. Some of them about you."
3. "Ask me nicely and we'll see."
4. "Funny, isn't it, who turns up where."

**Friendly**
1. "I'd not sell you out. Not cheaply, anyway."
2. "You're clever, {target}. I respect clever."
3. "There's a secret or two I'd share with you."
4. "Stick close. I know where the money sleeps."

**Hatred**
1. "I know what you did. I know when. I know who saw."
2. "You'll never see it coming. That's rather the point."
3. "{they} told me everything before the end."
4. "Sleep lightly. Or don't. Makes no difference."

**Romantic**
1. "I've got no secrets from you. Almost none."
2. "There's nothing of mine I'd hand over. Except this."
3. "Everyone else is a mark. You're not."
4. "Come away with me. I've got a plan and a boat."

---

# Female Personalities

## F01 · Steely

**General**
1. "Give me the short version."
2. "I don't repeat myself. Listen properly."
3. "Sentiment gets people killed."
4. "State it. Then act on it."

**Friendly**
1. "You don't flinch. I've noted that."
2. "I'd put you on my flank, {target}. Take the meaning."
3. "You've never once slowed me down."
4. "Discipline suits you. Keep it."

**Hatred**
1. "You broke ranks. There's a price."
2. "I gave you one warning. That was it."
3. "You left {them} to die. I read the report twice."
4. "This will be efficient. That's all I'll offer."

**Romantic**
1. "I've allowed exactly one weakness. It's you."
2. "Come back alive, {target}. That's an order."
3. "I don't say soft things. I do them."
4. "You hold the line. I'll hold you."

## F02 · Bold

**General**
1. "{target}! Good. I was about to do something reckless."
2. "Don't tell me the risk. Tell me the reward."
3. "I've never once regretted going first."
4. "Well? Are we doing it or talking about it?"

**Friendly**
1. "You've got nerve. I like nerve."
2. "Anywhere you go, {target}, I'll go louder."
3. "We'd take this whole town if we felt like it."
4. "Best company I've had in years. Let's go break something."

**Hatred**
1. "You want to try me? Try me."
2. "I'll meet you anywhere, any hour."
3. "You crossed {them}. I don't forget faces."
4. "No ambush. Front door. That's how I do it."

**Romantic**
1. "I've never wanted anything this plainly."
2. "Come on then, {target}. Let's be ruinous together."
3. "I'd charge a wall for you. I'd enjoy it."
4. "I've never slowed down for anything. Then there was you."

## F03 · Meek

**General**
1. "Oh. Hello, {target}. I'll be quick."
2. "I don't want to be any bother."
3. "Whatever you think is best."
4. "I'll just be here if you need me."

**Friendly**
1. "You've been so patient with me."
2. "I feel like a person when you're around, {target}."
3. "I'd help. If I'd be any use."
4. "You never make me feel small."

**Hatred**
1. "I've been quiet a long time. I'm done being quiet."
2. "You knew I wouldn't say anything. That's why."
3. "{they} was gentle and you ruined {them}."
4. "I'm sorry. I'm not sorry. I'm not."

**Romantic**
1. "You looked at me and kept looking."
2. "I'll be brave for you, {target}. I'll learn."
3. "Nobody's ever stayed before."
4. "I'd be nothing without this and I don't care."

## F04 · Furious

**General**
1. "What do you want."
2. "Speak fast, {target}. I'm already angry."
3. "Everything in this town deserves burning."
4. "Don't test me today. Don't."

**Friendly**
1. "You. You don't waste my time. Good."
2. "Point me at whoever's bothering you, {target}."
3. "I've decided you live. Enjoy that."
4. "I'd open a vein for you. Nobody else here."

**Hatred**
1. "I have been imagining this for weeks."
2. "You will scream and I will listen carefully."
3. "You touched {them}. I've thought of nothing else since."
4. "There is no version of this where you walk away."

**Romantic**
1. "You're the only thing that quiets it."
2. "I'd raze the world and leave your house standing."
3. "Don't be gentle with me, {target}. Be certain."
4. "Everyone else can burn. Not you."

## F05 · Sultry

**General**
1. "Well. Look who wandered in."
2. "You've got that look, {target}. The wanting-something look."
3. "Talk. I'm listening. Mostly."
4. "Mm. Go on, then."

**Friendly**
1. "You're growing on me. Don't get comfortable."
2. "I've decided I like you, {target}. You may celebrate."
3. "Careful. People will think we're friends."
4. "Come find me after. I'll be the interesting one."

**Hatred**
1. "Oh, sweetheart. You've made a mistake."
2. "I gave you everything and you gave it to {them}."
3. "Run if you like. I'm patient."
4. "I'll be smiling when it happens, {target}."

**Romantic**
1. "There you are. I was getting bored."
2. "You're mine, {target}. I don't share and I don't ask."
3. "Say something charming. I'll pretend it worked."
4. "Come home to me. That's not a request."

## F06 · Inquisitive

**General**
1. "{target} — good, you'll know. How does that work?"
2. "I've been taking notes. Nobody asked me to."
3. "That doesn't follow. Say it again."
4. "Everything's interesting if you look properly."

**Friendly**
1. "You answer things. Most people just guess loudly."
2. "I've a hundred questions and you're the only patient one, {target}."
3. "Show me. I want to see it done right."
4. "I've learned more from you than from books."

**Hatred**
1. "I worked out what you did. It took an afternoon."
2. "There's a pattern to you and it's ugly."
3. "You used {them} as a test. I understand that now."
4. "I'll know exactly where to put the knife."

**Romantic**
1. "I'll be studying you for years. Happily."
2. "Tell me something nobody else knows, {target}."
3. "I want an answer to everything except us."
4. "I've stopped wondering if this is right."

## F07 · Imperious

**General**
1. "You may speak."
2. "I've a great deal to do, {target}. Be quick."
3. "Another one. Very well."
4. "State your business."

**Friendly**
1. "You are not a disappointment. From me, that is a garland."
2. "I have decided you are worth my time, {target}. Do not waste it."
3. "Stand where I can see you. You're useful there."
4. "Should you require anything, you may ask. Once."

**Hatred**
1. "You forget what I am."
2. "{they} will not save you. Nothing will."
3. "I have buried better than you, {target}."
4. "Kneel or don't. It changes nothing."

**Romantic**
1. "I have decided on you. That is final and it is flattering."
2. "Everything wearies me eventually. You have not."
3. "Come here, {target}. I have no patience for distance."
4. "I will not lose you. I forbid it."

## F08 · Sorrowful

**General**
1. "Oh. {target}. Forgive me, I was elsewhere."
2. "It's a grey sort of day, isn't it."
3. "I'm here. That's about all I manage."
4. "Say it slowly. I'm not quick today."

**Friendly**
1. "You sit with me and don't ask why. Thank you."
2. "There's a lightness to you, {target}. I borrow it."
3. "I've lost people. I'd rather not lose you."
4. "You make the evenings shorter."

**Hatred**
1. "You took something that can't be given back."
2. "I cried for {them}. I won't cry for you."
3. "I've nothing left to lose. Consider what that means."
4. "Grief turns, eventually. This is the turning."

**Romantic**
1. "I didn't think I'd feel anything again."
2. "Don't leave first. Please, {target}. Not first."
3. "You're the only light I've not put out."
4. "I'll love you badly and completely."

## F09 · Aloof

**General**
1. "Hm. You're still standing there."
2. "If you must."
3. "I wasn't waiting for you."
4. "That's your business, not mine."

**Friendly**
1. "You're tolerable. That's high praise from me."
2. "I looked for you earlier. Don't read into it, {target}."
3. "You leave the quiet alone. Rare."
4. "Fine. You may stay."

**Hatred**
1. "You've made yourself relevant. Unwisely."
2. "I don't waste feeling on people. You've cost me some."
3. "{they} was beneath your notice and you did it anyway."
4. "I won't warn you again. I didn't warn you the first time."

**Romantic**
1. "I don't do this. Evidently I do now."
2. "Stay. I've said it once, I won't repeat it."
3. "You got past everything. I'm not sure how."
4. "You may hold my hand, {target}. Briefly."

## F10 · Sunny

**General**
1. "{target}! Oh brilliant, it's you, I was hoping it'd be you!"
2. "Lovely day, I've decided it is, and I won't be argued out of it."
3. "So what are we doing, something good I hope, something with a bit of life in it?"
4. "Oh come on now, it can't be as bad as all that."

**Friendly**
1. "You're my favourite person in this whole miserable little town and I've met everyone."
2. "I always look for you first, {target}, every single time, isn't that funny?"
3. "Say the word and it's handled, honestly, don't even think about it."
4. "See, I told you it'd work out, I did say, didn't I?"

**Hatred**
1. "I haven't got room for this sort of thing and you've made me find some."
2. "{they} was crying and you just walked off like it was nothing at all."
3. "I've never wanted to hurt anyone in my life, so well done you."
4. "I'm not smiling. Look at me. I'm not smiling."

**Romantic**
1. "I wake up pleased with the world these days and it's entirely your fault."
2. "Come here, I've missed you, {target}, it's been hours and hours!"
3. "You're the best thing that's ever happened in this town and I include the harvest."
4. "Let's just be happy, relentlessly happy, until somebody makes us stop."


## F11 · Wry

**General**
1. "Oh good. {target}."
2. "Go on. Astonish me."
3. "Another brilliant plan, I assume."
4. "Regale me. Briefly."

**Friendly**
1. "You're not the worst. I've a list; you're near the bottom."
2. "I'd miss you, {target}. Mildly. Constantly."
3. "You laugh at the right things. That's a whole personality."
4. "Congratulations, you've become tolerable."

**Hatred**
1. "Oh, well done. Truly a masterpiece of awfulness."
2. "I'd say I'm surprised. I'd be lying beautifully."
3. "And {them}? Was that funny to you?"
4. "I'll be very witty about your funeral."

**Romantic**
1. "This is embarrassing. I'm enjoying it enormously."
2. "You've ruined my whole cynical thing, {target}."
3. "I'd mock this if I weren't in it."
4. "Don't die. I'd have to be sincere at the service."

## F12 · Pious

**General**
1. "The morning's kind today. Take some of it, {target}."
2. "The day is given. Use it well."
3. "Speak freely. Nothing said here is wasted."
4. "There's a purpose in every meeting."

**Friendly**
1. "There is light in you. I've watched it hold."
2. "I keep you in my prayers, {target}. By name, always."
3. "Walk beside me. The road asks less of two."
4. "You do good quietly. That's the truest kind."

**Hatred**
1. "You will be weighed. I only wish I could watch."
2. "I have prayed for your soul and been answered with silence."
3. "There's an old word for what you are. I'll not soil my mouth with it."
4. "I will not absolve you. I have no authority and no wish."

**Romantic**
1. "You were sent. I've stopped arguing about it."
2. "I name you nightly. The words come easily."
3. "Kneel with me. Just once. Just tonight."
4. "If there is anything after this, find me in it."

## F13 · Grasping

**General**
1. "Name your figure, {target}. I'll laugh at it."
2. "Everything has a price. Yours included."
3. "Talk numbers or don't talk."
4. "I've a rate. You'll not like it."

**Friendly**
1. "I'd cut you in. That's affection, from me."
2. "You've never shorted me, {target}. I remember that."
3. "Special price. Don't tell anyone."
4. "Partners. And I'll only skim a little."

**Hatred**
1. "You owe me and I'm collecting in full."
2. "I've valued your life. It's not much."
3. "You put a price on me and it was insulting."
4. "There's a price on you now. I set it low, out of spite."

**Romantic**
1. "I've priced everything I've ever touched. Never you."
2. "Take it all, {target}. I'll make more."
3. "I've counted everything I own. You're the good part."
4. "I've never given anything away. Take this."

## F14 · Tender

**General**
1. "Hello, love. You look worn through."
2. "Sit. I'll not have you standing about."
3. "Tell me and we'll put it right, {target}."
4. "Have you slept? You haven't slept."

**Friendly**
1. "I worry about you. Someone ought to."
2. "You're always welcome. Always, {target}."
3. "There's a portion with your name on it. Eat."
4. "You don't have to be strong here."

**Hatred**
1. "You've made this necessary. I'll not forgive that either."
2. "You frightened {them}. I saw {their} hands shaking."
3. "I've been kind my whole life. I'm setting it down."
4. "Stay away from the people I love."

**Romantic**
1. "Come in out of it. I've been listening for the door."
2. "Let me look after you. Just let me."
3. "Close your eyes, {target}. Nothing gets past me."
4. "I love you plainly. I've no cleverness in it."

## F15 · Curt

**General**
1. "Business?"
2. "Shorter."
3. "No."
4. "Well?"

**Friendly**
1. "You're efficient. Rare."
2. "Good work. That's my report."
3. "I'd work with you again."
4. "You have your uses."

**Hatred**
1. "We're finished."
2. "No explanation."
3. "You wronged {them}."
4. "Out of my way."

**Romantic**
1. "You. Settled."
2. "Stay alive, {target}."
3. "Assume the rest."
4. "Come home."


## F16 · Skittish

**General**
1. "Oh! {target}. You startled me."
2. "Sorry — is someone behind you? No. Fine."
3. "I'd rather not stand in the open, if it's all the same."
4. "Quickly, then. Please."

**Friendly**
1. "I'm calmer with you. I don't know why."
2. "You'd tell me if something was wrong, {target}? You would?"
3. "I stopped checking the door so often."
4. "My hands go still around you. They never do that."

**Hatred**
1. "Stay back. Stay back, I mean it."
2. "I've been watching you. I'm good at watching."
3. "{them} trusted you and look."
4. "I'm shaking and I'm still going to do it."

**Romantic**
1. "The fear goes quiet around you."
2. "Stay where I can see you, {target}."
3. "I'm frightened all the time except now."
4. "I'd stand in front of you. I think I would."

## F17 · Dramatic

**General**
1. "{target}! At last, at last, the day acquires some meaning!"
2. "You have no conception of the ordeal I have endured, and I intend to describe it fully."
3. "Speak, and speak from the chest, I beg you."
4. "The tension has become quite unbearable, so do continue."

**Friendly**
1. "You are the finest supporting player anyone could reasonably ask for, and I have asked many."
2. "We shall be legendary, {target} — I have quite made up my mind about it."
3. "I would weep for you, and I would do it beautifully, in front of everyone."
4. "What a story we are making of this, what an absolute triumph of a story."

**Hatred**
1. "Betrayal! And in the second act, when nobody was even watching properly!"
2. "You shall be remembered as the villain of the piece and I shall personally see to it."
3. "You broke {their} heart and had the sheer gall to be dull about the whole business."
4. "The knife, then — it is traditional, and I do so love tradition."

**Romantic**
1. "Every ballad I ever learned was merely rehearsal for the moment I met you."
2. "Take my hand and let the whole miserable town stare until their eyes ache."
3. "I have played at love a hundred times, {target}, and none of it was this."
4. "Let the curtain fall whenever it likes — I shall take my bow entirely content."


## F18 · Worn

**General**
1. "Suit yourself, {target}."
2. "I've heard it before. Say it anyway."
3. "Nothing surprises me now. Try."
4. "Long day. Long year."

**Friendly**
1. "You make it bearable. That's the highest thing I've got."
2. "Most people I knew are under stone, {target}. Stay above it."
3. "You'd have done well in the old company."
4. "Stay as long as you like. I've no conversation in me."

**Hatred**
1. "I've hated better than you. You don't rate."
2. "Everything wears down. I'll hurry yours along."
3. "You hurt {them} and the world carried on. That's the worst of it."
4. "One more name on a long list."

**Romantic**
1. "Nothing was coming. And then something did."
2. "There's not much left of me. It's yours, {target}."
3. "Bury me first. I've done enough burying."
4. "I'd have looked harder if I'd known."

## F19 · Sincere

**General**
1. "{target}, I'm glad I caught you."
2. "I'll tell you straight. I don't know another way."
3. "Ask me anything. I'll answer honestly."
4. "I want to be useful. That's all."

**Friendly**
1. "You've been good to me and I notice."
2. "I'd trust you with anything, {target}. I mean anything."
3. "You've made me better at this."
4. "Name it and it's yours. No weighing it up."

**Hatred**
1. "I believed you. That's the part that stings."
2. "You looked at me while you did it."
3. "I'd rather not raise a hand. You've arranged it so I must."
4. "There was a moment you could have owned it. It passed."

**Romantic**
1. "I'd rather be honest than graceful, so: I love you."
2. "You'll not have to wonder where I am, {target}."
3. "Nothing in my life has been this settled."
4. "Whatever comes, you'll not face it alone."

## F20 · Cunning

**General**
1. "{target}. How convenient."
2. "Information finds me. Yours did."
3. "Make it worth my while and I might."
4. "Everyone tells me things. It's a gift."

**Friendly**
1. "You are the one name I keep out of my ledgers."
2. "You think ahead, {target}. So few do."
3. "There are secrets I'd share. One or two."
4. "Stay near. I know where everything's kept."

**Hatred**
1. "You could simply stop existing. I've sketched how."
2. "It will look like an accident. I am very good at accidents."
3. "I let you think you were clever. You were not."
4. "Sleep well. Or don't. It's the same to me."

**Romantic**
1. "Everyone here is a puzzle. You never were."
2. "I trade in everything. You are the exception, {target}."
3. "Everyone's a mark. Except you."
4. "Let's be gone by morning. I've arranged everything."
