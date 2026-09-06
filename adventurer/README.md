# Adventurer — one-shot build of `adventurergdd.md`

A classless, skill-based tactical RPG where stats never change, skills are learned by
seeing them used, death is permanent, and the world runs on the same rules you do.
Built as a static Phaser 3 web app from the design doc in `GDD.md`.

## Run it

Open `index.html` in a browser. That's it — no build step, no server required
(Phaser is vendored in `lib/`). Save data lives in that browser's localStorage
under the five `adv:*` keys from GDD §19; `adv:meta` (journal + skill levels)
survives permadeath. "Erase all save data" is in the town Codex.

**Hiro:** type `Hiro` into the password field on the title screen (§14a — honor
system, plain text by design). Patron characters are data entries in
`js/data/registry.js`.

## What's implemented

All 14 steps of the build order (§21) at vertical-slice tuning (3 perks / 4
actives, 8 starting NPCs, 5 enemy types + 5 bosses, 4 gear sets, 3 factions):

- Classless creation: the portrait is only a look; your first three skills
  are a free pick of ANY three from the pool (perks or actives), chosen at
  creation and expandable at the trainer.
- The full 31-skill pool with basic → intermediate → advanced manifestations,
  witness rule (advanced sightings reveal the basic root), capacity &
  forgetting with levels that survive drops and deaths, the journal as the
  cross-life save file.
- Three-lane combat per §15a: exact damage formula, universal Basic Attack,
  overheal→temp HP, Shield Wall prevented-damage reflection, Taunt
  retaliation, ambush (2 consecutive turns), reserves past the 9-unit field
  cap, flee formula, armored trait + Sunder, post-victory 50% recovery,
  telegraphed intents for every non-player unit.
- Quest board with solo/party tracks and boss contracts, encounter verbs
  (fight / talk / charm / intimidate / sneak-with-steal / alignment pass),
  the departure carry-vs-vault screen, tuition/stay-home.
- World clock: NPCs quest abstractly, level, buy gear and skills (witnessed
  ones free), court, marry, jilt, conceive (10%/quest, guaranteed by 10),
  children mature at 10 quests, population management with the 60% female
  target and the emergency floor.
- Directed sparse relationship graph (1 player edge + 1 NPC slot, inbound
  free, displacement by magnitude), envy-vs-injury hatred, jealousy batches
  on marriage, second-order propagation, the event feed, Guild Roster.
- Career arc: applications with role demand, fixed wage offers on
  Greed/Pride, firing, quitting, hatred-blocks-party, succession.
- Romance: shared vault in the woman's name, withdrawal approval driven by
  the shared-quest streak, jilting (player chooses whether to hate),
  reconciliation costs, estate claims — killer-ex outranks heirs.
- Assassination ambushes at quest-end worst-health, attacker parties,
  player-initiated assassination, rescues (playable when accepted), avenging
  children (father-kills-mother only), theft.
- Forbidden skills: Conscript/Necromancy with per-tier caps enforced by
  escape/decay, the population debt, Divine Intervention (5th raise / 10
  hatred edges), heroes with True Rest + doubling escalation, villains via
  sparing, hero help-request invitations (1-in-3 window).
- Death: reincarnation (fresh world, journal + levels persist) and nepotism
  (world persists, heir inherits vault, skills, title stat bonus,
  transformed relationships).
- 40 dialogue personalities × 16 lines (640 lines parsed verbatim from the
  GDD, validated: no duplicates, every band has an unconditional line),
  warmth-variant selection, token substitution, no-repeat rule, fallback
  inside the same band only.
- Tutorial: 5 pre-game cards + ~38 fire-once contextual prompts, all
  archived in the Codex.

## Architecture

`js/data/` is pure content (skills, enemies, constants, dialogue — no logic).
`js/core/` is the engine: plain JavaScript with no Phaser dependency, which
is why every system runs headless under Node for tests. `js/ui/` is Phaser
only. Conventions worth knowing: `ADV.World.byId(world, id)` is the one
character lookup; `ADV.World.feeder(world)` is the one way systems write the
event feed; combat decision-making lives in `combat_ai.js` and goes through
the same public `Combat` API the player UI uses, so the AI can never reach a
mechanic the player can't; shared panel/modal plumbing lives in
`js/ui/uikit.js` (a button not registered through `UI.keepBtn` will leak an
invisible click zone when a panel switches — that's the rule to remember
when adding town UI).

## Music & voice acting

`audio/music/` holds 32 tracks transcoded from `Kenji/music` (112k mp3).
The town and title sit on **Weight of the Quiet Man (Edwyn theme 2)**,
looped; every other context rotates a shuffled pool that switches per scene
and per combat — quests draw the travel/city/forest set, ordinary fights the
battle themes, bosses/ambushes/divine business the heavy set, death gets
Edwyn theme 1. Pools live at the top of `js/ui/music.js`. A ♪ toggle sits on
the title and town screens (persists per browser).

`audio/vo/` holds all 640 personality lines, generated through the ElevenLabs
pipeline in `Kenji/Game init files` (model eleven_v3, one distinct sex-matched
voice per personality — casting table at the top of `tools/gen_voices.py`;
edit it, delete that personality's folder, re-run the script to recast, it
skips existing files). Per GDD §17a the audio drops the `{target}` vocative
and speaks third-party tokens as neutral pronouns while the text box shows
names. The dialogue box plays the exact clip for the line it renders and
never crosses personalities.

## Combat rules added after the one-shot (second skill pass)

- **Durations:** Shield Wall guards for 3/4/5 rounds by tier; Taunt marks last
  3 rounds (4 at Challenge) and expire on the status clock.
- **Positional casting:** healing OTHERS requires standing exactly one lane
  behind the target (self-heal works anywhere) — healers now deploy to the
  MID lane by default; protective skills (Guardian Ward, Shield Wall
  coverage) only reach allies on your lane or behind you.
- **Elements:** Fire Bolt burns at every tier (burn scales with tier and
  skill level); Frost Touch Freezes (1 turn lost, 2 at Blizzard; thawed
  targets can't re-freeze for 3 rounds); new lightning line Spark → Chain
  Lightning → Thunderstorm Shocks (+5/15/25% damage taken from all sources).
  Three new mage perks: Pyromaniac (fire resist + heal for 5/15/25% of fire
  damage dealt), Ice Queen (stacking 5/15/25% damage reduction per ice hit,
  cap 50%), Lightning King (an extra turn every round).
- **Smoke Bomb:** Vanish 2 rounds untargetable, Shadowstep 3 (+ free strike).
- **Charm bribes:** in battle you can pay hostile named enemies (assassins,
  haters) to walk away — fee 30 + 20×rank, spent win or lose, odds 40/60/80%
  by Charm tier. Heroes, conscripts and the undead can't be bought.
- **Cleanse family:** basic strips ALL negative statuses, frees conscripts
  from compulsion, and smites undead with holy damage; Purify adds 3-round
  immunity to everything negative INCLUDING post-battle conscription;
  Absolution's immunity lasts 6 rounds and, cast on a walking undead,
  restores them to life — undoing the true death (never revives the
  ordinary dead).
- **Snare:** Bind also seals the target's basic-tier skills for 2 rounds;
  Root Field hits the target's lane plus both adjacent lanes and seals basic
  AND intermediate skills. Basic Attack never seals — no unit is ever left
  without a legal move.

These rules apply to enemies identically (shared pool), which made mages
meaningfully deadlier; mage mooks were made glassier (hpMult 0.55) to
compensate. Naive-policy tier-1 soak after the pass: mage/tank 20/20,
ranger 19, fighter/druid 18, rogue and healer ~10 (both lean on bypasses,
bribes and party play by design). `test/skills2.js` covers all eight rules.

## Legacy pass: what death cannot take

- Your LEARNED SET — the equipped skills themselves, at their levels — now
  carries into every next life, reincarnation and nepotism alike (unique-tier
  grants like Hiro's never carry). The journal still carries everything
  witnessed.
- Free skill picks exist only in your very first life; afterward new skills
  are witnessed in battle or bought at the trainer.
- Titles are the FATHER's: every grown child is "Son/Daughter of <father>",
  with a stat buff recomputed from the father's current strength each world
  tick — growing until his death, frozen after.
- Only mothers name children. A female player names each child at birth (a
  naming dialog); a male player's children are named by their NPC mothers.
  Taking over a child through nepotism keeps whichever name applies, and the
  buff always flows from the father's legacy.
- The first time romance is a live prospect, a three-sentence explainer
  covers courting, marriage/naming, and nepotism (jilting stays unexplained
  until it happens to you). `test/legacy.js` covers the whole pass.

## Skill tooltips (debugging aid)

Hovering any skill — trainer, creation picker, journal, your own panel, the
combat action bar — opens a backend inspector: the exact damage/heal formula
with the character's real ATK plugged in, every parameter the current tier
carries, the hostile mode, and what the other two manifestations change.
Anything the engine reads off a skill is printed (unknown keys dump raw), so
a misbehaving skill can be diagnosed from the tooltip alone. Labels live in
`js/ui/tooltip.js` (`PARAM_LABEL`).

## Portraits are placeholders

Per §1a the only authored art is bust portraits; this build generates
deterministic layered code-drawn busts (fixed eye line, one lighting key,
flat background, hair as the silhouette differentiator, the 10 creation
slots per the ethnicity/wardrobe table, Hiro's purple dreadlocks + katana).
To swap in real AI-generated art later, replace texture generation in
`js/ui/portraits.js` — keys are stable per character
(`pp_slot_sex_seed`, `pn_sex_seed`, `pm_type`, `pr_hiro`), so a loader that
maps keys to PNGs slots straight in.

## Testing

Core logic is engine-only JavaScript (no Phaser) and runs headless:

    node test/run_tests.js     # GDD worked examples, witness, vault, divine, Hiro (55 checks)
    node test/family.js        # marriage → child → tuition → nepotism inheritance
    node test/integration.js 1 100   # monkey-soak across systems and lives
    node test/balance.js       # archetype solo-viability soak
    node test/browser_test.js  # Playwright click-through (needs `npm i playwright`, server on :8734)
    npm test                   # every headless suite in one go
    npm run test:browser       # every Playwright suite (server on :8734)
    npm run lint               # eslint: unused/undefined names across js/, test/, tools/

`test/run_tests.js` also asserts that the harness loads the same data/core
scripts, in the same order, as `index.html` — add a script in both places.

Known tuning state (naive-policy soak, tier-1 solo): mage/tank/ranger/
fighter/druid clear at 20/20; rogue and healer sit near 13/20 — both lean on
bypass verbs, witnessing, and party play by design. §15a's own caveat
applies: these numbers are placeholders, and `js/data/constants.js` is where
they all live.

## Campaign add-on (CAMPAIGN.md)

Three factions, each a five-contract campaign under half an hour, layered on
the base game without changing what it is.

**Files.** `js/data/campaign_skills.js` (72 faction skills, data-only over the
generic engine params + `Combat.EFFECTS` registry in `js/core/combat_effects.js`),
`js/data/campaign_data.js` (factions, gear sets, 12 characters, 15 enemies +
mini-bosses, quest specs), `js/data/campaign_dialogue.js` (every line as
`{t, v}`: `t` is shown, `v` is the name-free spoken form), `js/core/campaign.js`
(`ADV.Campaign`: recruitment gates, hall, quest building, beats, titles, gear,
unlock, the Antler branch, debug skip), `js/ui/campaign_ui.js` (hall panel,
recruiter offers, cutscenes, branch choice, villain reveal, support ask, end card).

**Base-rule changes shipped with it (§0b–§0f, §13d-2).** Perks are advanced-only
and gold-only, never witnessed, never level. Backstab is opener-or-stealth,
any lane, power 6.0, with Exposed. Marksman's back-lane shots take no reflect.
Vault withdrawal caps by partner happiness (women 80/50/25 %, men 90/60/35 %,
Charm +10 %) — requests are trimmed, never refused. Kills generate no Hatred.
Hero/villain: grants are permanent, idle heroes keep them, killing a hero
makes the whole party Villains with two heroes owed at twice the bonus after
the standard three-quest reprieve.

**Recruitment (§3).** First criminal contract → the Maw's laundress; first
lawful one → Varenholm's adept; three no-alignment contracts, or a refusal →
the Antler, advertised once and open forever. One faction per life; the heir
is uncontacted. The town menu gains the hall entry the moment anyone notices you.

**Titles (§10).** Basic title on joining (faction archetype skills level 2×),
tier 2 after quest 2 (3×), tier 3 after quest 4 (faction skills manifest one
tier above their level — `SkillSys.tierFor` asks `Campaign.titleLifts`).

**Skills (§13).** Campaign actives are witness-only during a campaign; a
faction's perks open on joining; completing any campaign unlocks all 72 at
the trainer for every future character (`meta.campaignSkillsUnlocked`). The
trainer has tabs once a faction's skills are visible to you. Corpse Work,
Quiet Word (Threaten verb), Case the Room / Scout's Cut (loadout reveal),
Quartermaster's Root (between-encounter heal), Muster (wage discount) all live.

**Companions (§5a).** The rival can be toggled after quest 2 (no wage), cannot
die in your fights — beaten, they walk off with an exit line and return next
encounter — and dies on quest 4 by script (antagonist appears, rival's last
line, antagonist speaks). The boss fights beside you on quest 5. The Quiet
raises Risen mid-fight (`st.spawnQueue`).

**The Antler branch (§5c).** Quest 5 opens with Crane's briefing and a choice.
Side with Crane: Hargrave (a real hero with grants) dies, the party becomes
Villains, the villain reveal card plays on return. Side with Hargrave: Crane
dies, `world.campaignWorld.antlerFirstHorn` flips to Holloway for the rest of
the world, and he runs the hall.

**Debug skip.** The hall's bottom row jumps to any quest of any faction with
the right title, rival state and gold.

**Voices.** `tools/gen_campaign_voices.py` casts twelve voices (none shared with
the 40 personality voices) and generates `audio/vo/campaign/{char}/{beat}_{n}.mp3`
from the `v` variants; `tools/dump_campaign_vo.js` fails if any spoken line
contains a character name or an unfilled token — the name plate and text box
carry names, the audio never does.

**Tests.** `node test/campaign_rules.js` (base-rule changes), `campaign_coverage.js`
(§14: every campaign active witnessable in its faction's pools),
`campaign_flow.js` (all three campaigns end to end, both Antler branches,
decline paths, debug skip, save round-trip), `browser_campaign.js` (Playwright:
Maw quest 4 in the real scenes, end card, trainer tabs, recruiter offer).

## Third pass: party flow, courtship, town services (16 requests)

- **Hirelings don't pick.** In someone else's party the board is one button —
  *Ready for the quest* — and the NPC leader chooses a party contract by
  temperament (`Game.leaderPick`), never one that can't cover payroll. Parties
  never take solo work. Loot is shared per head; the wage is the wage
  (`test/requests3.js` §1/8). Leaders can't accept losing contracts.
- **Healing:** +10% (`HEAL_MULT`), reaches any ally in any lane (the
  one-lane-behind rule is retired), intermediate/advanced Mend, Triage and
  Regenerate heal the whole party. NPC healers always look to the player first.
- **Perks:** Lightning King's second turn now comes immediately after the first
  (with a "storm speed" marker); Pyromaniac also leeches from burn ticks.
  New: **Arena Champion** (fighter — kills heal 50%, +10% damage stacking,
  taunt everything 2 rounds), **Septic Sanguine** (bleeds/poisons ×1.35,
  heals 50% of their ticks), **Lookism** (+10g hired / −10g hiring, opposite
  sex starts Friendly, soft jilts, enemies target you last). Opportunist and
  Sneak add +35% to flee.
- **Courtship** (`js/core/courtship.js`): men are Friendly after 1 shared
  quest and ask after 2; women after 2 shared quests — unless he is one of the
  **five wealthiest men** (vault + purse, player included), when every single
  woman is Friendly at once and asks him. Declines drop the asker to Neutral
  for 3 quests. Friendly floors are computed in `Rel.score`, so the one-slot
  edge budget is untouched. Asks aimed at the player arrive as town notices.
- **Timers:** every event clock caps at 3 quests; pregnancy guaranteed within
  2, three children per couple, adults after 3.
- **Town:** *New Game* wipes everything (journal, levels, lives). Sell the set
  you wear for 800g; one set at a time; your spouse buys sets from their own
  purse; insurance pays the survivor whichever of you dies. The trainer sells
  tutoring — 300g to Intermediate, 600g to Advanced — on any known active.
  **The Maw's desk** (store) takes contracts at 100g per point of the target's
  reputation, resolved on the world clock; a failed knife tells the target who
  paid. Rescues are real battles now, including botched-contract ones.
- **World:** four new party contracts — two at 300g, two at 600g — built
  around debuff crews (Marsh Stalker poison, Ember Cultist burn, Frost Hag
  freeze, Gravewarden heal-cancel) with four new base skills (Venom Fang,
  Ember Lash, Rime Grasp, Wither Touch). The starting roster is 16 with
  several healers and tanks and two forbidden-art users, leaving 10+ free
  agents beside the two employer parties; parties hire on the clock, members
  quit over pay (your own hires ask you first), and new outfits form.
- Tests: `node test/requests3.js` (68 checks), `node test/browser_requests3.js`.

## Fourth pass: recruiters wait, the guided first hour, food

- **Campaign recruiters wait** (`CAMPAIGN_GATE`): nobody approaches before
  four completed contracts and reputation 4. Criminal work on your record
  keeps Varenholm away for good; lawful work keeps the Maw away; a mixed or
  unaligned record gets the Antler. (`Campaign.eligibleFor`.)
- **Guided first hour** (`js/ui/tutor.js`, state on `game.tutorial`, once per
  fresh game — later lives and Hiro skip it): creation pauses on the name box
  and requires a name; every portrait states Woman / Man. In town: a door-by-
  door tour, then the menu locks to the one thing to do next — a Tier 1 solo
  contract → gold explained → the Trainer → the **Vault** (its own door now) →
  Apply for Party, where the first ask is always declined and the second
  hires you at a fixed 45g (capped to what the leader can afford) → *Ready for
  the quest* (the leader picks, lowest tier) → free play with closing words.
  Notices and recruiters hold off until it is over.
- **Wage negotiation** when joining later parties: name your ask (25–60g);
  higher asks are refused more often and never exceed what the leader can
  pay after payroll (`Party.maxAffordableWage`).
- **Store: Food and Gear tabs.** Seven cheap foods (5–15g) give a small stat
  bonus that lasts exactly one quest (`ADV.DATA.FOODS`, `Character.eat`).
- Vital Anchor is now spent by the blow it catches and works once per unit
  per battle (a re-casting healer could stall a fight for 45 rounds).
- Tests: `node test/browser_tutorial.js` walks the whole first hour in the
  real scenes (24 checks).

## Housekeeping

- Notices (toasts) now sit at eye level in the middle of the screen, larger,
  stacked when several arrive, and linger ~4 s before fading.
- One track per quest: the run picks a track (quest + combat pools, or the
  boss pool on a boss contract) when the quest's first screen opens and keeps
  it through every encounter and fight; it only changes on the next quest.
- The home theme ("Weight of the Quiet Man — Edwyn theme 2") is one looping
  element for the whole session: leaving town pauses it in place and coming
  back resumes it, so it never restarts from the top. Every other context
  still rotates randomly.
- A lint pass (`npm run lint`) removed every unused binding in `js/`; the
  in-memory save backend for tests lives in `test/harness.js` (`memBackend`).

## Survival growth (Bulwark, Arena Champion)

Both perks carry `survivalHp: 20`: every battle the holder walks out of alive
adds 20 to their base max HP, permanently (each encounter of a quest counts;
downed-but-on-the-winning-side counts, since they get up). Applied once per
battle when it ends (`Combat.applySurvivalGrowth`), shown as a green
"+20 MAX HP (n)" in the fight; NPC holders grow one battle's worth per
contract they survive on the world clock. Also fixed: boss contracts were
drawing their non-final encounters (and the boss's escort) from the boss
table, which could spawn an undefined enemy — they now use the tier-3 table.

## Hiro as an NPC

When the secret character is not being played, Hiro walks into town after the
player's second contract (`js/core/hiro.js`) with 1000g, starts a party and
hires as much of the roster as he can — always leaving exactly one seat open,
on the clock too. He warms at a third of the usual rate, a woman needs two
shared quests before he is Friendly, he never asks anyone, and he accepts a
proposal only from a woman with reputation 15 or better (the player gets a
notice saying so). His sixteen lines live in `js/data/dialogue_hiro.js`
(hidden from the random personality draw); bracketed delivery cues are
spoken by the ElevenLabs v3 voice and stripped from the text box. Clips:
`audio/vo/HIRO/` (`ONLY=HIRO python3 tools/gen_voices.py ...` regenerates).
Tests: `node test/hiro.js`, `node test/browser_hiro.js`.

## Dialogue rewrite (alldialogue.md)

All 640 personality lines and 174 campaign lines were replaced from the
review-copy markdown, with the voice id per personality / campaign character
and ElevenLabs v3 delivery tags (`[flatly]`, `[sighs]`, …) authored into the
lines. `tools/import_dialogue.py <alldialogue.md> .` regenerates
`js/data/dialogue.js`, `js/data/campaign_dialogue.js` and
`tools/voice_casting.json` (which both voice generators now read). Tags are
sent to the voice as direction and stripped from the text box
(`util.renderLine`, `CampaignUI.fill`). In campaign text `{they}/{them}/{their}`
show the rival's name; in audio they read as the rival's pronouns (or "they"
when the rival is talking about an enemy). Every clip under `audio/vo/` was
regenerated; Hiro's were left as they were. The Q5 boss-ally banter beat is
not in the new script, so bosses fight quietly beside you.

## Second campaign: ninja / samurai / pirate / navy (ninjavspirates.md)

Purely additive. `js/core/campaign2.js` wraps `ADV.Campaign`'s methods and
dispatches on `quest.campaign2`, so campaign 1 runs through the same hooks
untouched — `test/campaign_flow.js` still passes unchanged. New files:
`js/data/campaign2_skills.js`, `campaign2_data.js`, `campaign2_dialogue.js`,
`js/data/dialogue2.js`, `js/core/campaign2.js`, `js/ui/campaign2_ui.js`,
`test/campaign2.js`.

- **Four factions** — The Hollow Bell (neutral), The Green-Eyed (law),
  The Red Tally (criminal), The Admiralty (law). 64 skills, 20 enemy types with
  three skins each, 16 mini-bosses, 20 quests, 4 gear sets flooring at 15.
- **Alignment lock (§1a)** — the first non-neutral faction you join fixes your
  alignment for the life. Only death clears it; finishing the line does not.
- **Three per life (§1b)** — a lawful life can hold Bell + Green-Eyed +
  Admiralty at once, and carries all three titles; a criminal one tops out at two.
- **Inheritance (§1c)** — reincarnation *closes* every line the bloodline
  started; a nepotism heir *resumes* at the quest the parent died on, with the
  title and the alignment lock. The consumed flag is mirrored into
  `meta.campaign2Consumed` because reincarnation rebuilds the world, so the
  §9 `world.campaignProgress` row alone cannot survive it.
- **Horizontal slice (§1d)** — completing any one of the four opens all 64 at
  the trainer, including the factions your alignment forbids. Gear sets and
  titles stay faction-locked.
- **The faction war (§6)** — four contract types on the ordinary board, open to
  everyone. Three against a faction and it stops recruiting you; three against
  its enemy and the other side approaches regardless of contract count. Every
  one of the 48 actives is witnessable there (asserted in `test/campaign2.js`).
- **The god line (§7)** — party-only, gated at 25 quests, 1000g halving per
  clear down to a 125g floor. Two bosses, two routes each.
- **20 new personalities (§8)** — M21-M30, F21-F30, 320 lines, taking the
  roster to 60 and the library to 960. Every line is unique across all 60
  (`test/run_tests.js` asserts it) and every band has an unconditional line.
- Admiral Kessler is deliberately one character in two chairs: the Red
  Tally's antagonist and the Admiralty's boss, so 15 people fill 16 roles.
  Jiro is undead and immune to True Rest — nothing animates him.

**Voices.** All 24 ids from §0a are cast in `tools/voice_casting.json` (52 → 89
entries): the 20 personalities, the 15 campaign characters, and the two gods.
The personality/character voice sharing is the doc's own (§8: M30 Unquiet is
deliberately Jiro's voice, F30 Bereaved is Tomoe's). `tools/gen_voices.py` used
to regex `ADV.DATA.DIALOGUE` out of `dialogue.js`, which silently skipped every
personality declared elsewhere — Hiro, and now all twenty new ones; it loads the
whole library through the harness instead. **548 clips remain to be generated**
(320 personality + 228 campaign/god); until then those lines display as text
with no audio, which the audio layer already treats as a silent line.

**Two voice collisions the doc did not catch.** §0a states no voice overlaps the
base game's 40, and that holds — but it does not check the first campaign's
*characters*: `t9puW54s29EO0gQK6OMR` (The Pale Mother) is already Vesna Arden's,
and `HMvHZWb0ZWSo5Kc5l22D` (The Drowned King) is already The Quiet's. Both are
cast as the doc specifies; recasting is a one-line change if the sameness reads
as a bug rather than an echo.

**§0a demigod and matriarch voices.** `Character.voiceTagFor(world, ch)` returns
`godf`/`godm` for a demigod and `matriarch` for a high-rank mother holding an
estate; `Music.speakFile` looks for `audio/vo/<tag>/<personalityId>/<band>_<n>.mp3`
and falls back to the ordinary clip when that set does not exist. The routing is
live; the alternate clip sets are a generation decision, not a code change.

**§3's four encounter verbs are implemented** — Bribe (resolves against anyone
poorer than you, and *costs* the coin, which is what separates it from
Persuade), Command and Requisition (read the opponent's alignment), Intimidate
at Sea (reads cargo or coin, and takes it). `Quests.availableVerbs` had a
hardcoded perk list, so these four had no way to appear before.

Open questions the doc itself flags, decided as follows and easy to reverse:
faction-war quests do **not** count toward faction titles; the god line is open
to a Villain; the two lawful factions do not acknowledge each other in dialogue.

## Deviations from the doc (all flagged in code comments)

- Taunt retaliation ignores DEF (matches the §15a worked check: ATK 9 → 14).
- Backstab reaches the rearmost *non-front* lane, so it isn't a dead card
  against mid-lane formations; a solo front-liner still can't be backstabbed.
- Nameless mook enemies roll the low half of their species stat range
  (casters lighter still); bosses and named NPCs use the full range. Solo
  tier-1 contracts field single enemies; pairs appear from tier 2.
- Gear set → archetype mapping: Warrior covers tank+fighter, Ranger covers
  ranger+rogue, Mage covers mage+druid, Healer covers healer.
- Nepotism is playable in this build (the slice defers it; the machinery was
  already there).
- Campaign quests use `track: 'campaign'`, which passes both the party-required
  and solo-only guards, so a faction line is runnable whether or not you lead a
  party. (Campaign 2 first shipped with solo/party tracks, which walled the
  player out of quest 1 or quest 2 depending on party state.)
- Marriages and births involving NPCs the player has never met now appear in the
  event feed, rendered dimmer as hearsay. They were previously suppressed
  entirely by the `metIds` gate, which made the NPC relationship system look
  broken — a 60-tick soak produces 30 marriages and 47 births, none of which
  used to be visible.

## Mobile pass (landscape-only)

The game targets **landscape phones**; portrait shows a full-screen rotate
prompt (`#rotate` in `index.html`, toggled by the resize handler — iOS ignores
the Screen Orientation lock API, so the overlay is the reliable route).

- **Viewport.** `viewport-fit=cover`, `user-scalable=no`, body `position:fixed`
  with `overflow:hidden`, `overscroll-behavior:none`, `touch-action:none`,
  `#game` at `100dvh`. The resize handler in `index.html` re-measures the
  viewport in a short burst (0/60/200/450/900 ms) on `resize`,
  `orientationchange`, `visualViewport.resize`, `pageshow` and
  `visibilitychange`, because iOS Safari's toolbar moves *after* the resize
  event. Phaser stays on `Scale.FIT` + `CENTER_BOTH`; `#game` must not also
  flex-centre the canvas or the offset doubles.
- **Text fields are DOM.** Canvas text never opens a phone keyboard, so every
  typed field is a real `<input>` overlaid on the canvas via
  `ADV.UI.textField(scene, {x, y, w, h, ...})` (`js/ui/uikit.js`). Fields are
  declared in game-space coordinates and re-projected on every re-fit
  (`ADV.UI.repositionFields`), never render under 16 CSS px (iOS zooms below
  that), stop keydown propagation so Phaser never double-types, commit on
  Return, and are destroyed with their scene. Three sites: creation name,
  title password, the child-naming notice.
- **Touch.** `T.button` pads its hit zone 4 px a side on touch devices. Skill
  tooltips (`ADV.Tooltip.attach`) show for 3.5 s on tap where there is no
  hover; the creation skill description updates on tap too. The tutorial
  callout button is 146×44.
- **Suite.** `node test/browser_mobile.js` (`npm run test:mobile`) drives
  iPhone 15 / 15 Pro Max / Pixel 7 emulation in Chromium: fill, centring,
  rotation, URL-bar and background re-fit, first-tap keyboard focus, 16 px
  minimum, Return-commits, state write-through, no horizontal scroll, a
  touch-target audit (44×44 CSS px, 20 px edge margin) and a static
  hover-only audit. Emulation is not Safari: rotation on a real iPhone, the
  real keyboard height, and audio-after-first-tap still need a hand test.

**Known finding.** On an iPhone 15 the 1280-wide grid renders at ×0.45, so
almost every control lands under 44 CSS px (hub menu items, skill rows,
combat bar). The padded zones help near-misses; the real fix is a layout pass
that gives phone-critical controls ≥ 96 game px of height, or a narrower
design grid on phones.

## Expression pass (EXPRESSION_PROMPT.md)

Faces now react. Everything is an overlay painted from `META[key]` anchors over
the one cached bust per look — no texture per mood.

- **Palette (Part A).** `Portraits.MOODS` — 16 moods as geometry (brows as
  3-point curves per side, lid openness, mouth curve/openness/side, accent) with
  an intensity 0–1: neutral, content, happy, laughing, tender, sad, grief,
  angry, furious, disgust, smug, afraid, surprised, pain, resolve, dazed.
  `Portraits.express(scene, img, ch, key, mood, intensity)`; the old 5-mood
  callers still work (`hurt` is not a mood any more — use `pain`).
- **Monster rigs (Part D).** Wolf: ears flatten/forward, squint, snarl over the
  fangs. Sentinel: visor lights change size, brightness and colour (red when
  furious, one out when in pain, flicker when dazed). Human-frame enemies use
  the human rig; the `isMonster` exclusion is gone.
- **Standing mood (Part C).** `Portraits.moodFor(game, ch, context, {unit, st,
  facingUndead, cleanse})` is the one chooser: combat state (dazed for
  Frozen/Shock/undead/conscript; <25% HP → afraid, or **resolve** for bosses,
  villains, heroes, survival-perk holders and the Severe/Disciplined/Composed
  personalities, furious for bosses; <55% a held wince; my turn → angry;
  taunted → furious; stealth → smug), then survival, then the last two ticks
  of the feed (bereaved → grief, jilted → sad, married/birth → happy, fired/
  robbed → angry), then relationship to the player (romantic → tender,
  friendly → content, hatred → angry by magnitude; campaign rival → smug,
  antagonist → furious/smug), then a resting bias per personality
  (`PERSONALITY_BIAS`, all 61 filled in). `Portraits.stand(...)` wraps it.
  Wired into the dialogue box, combat, the hub card, hall bosses, cutscenes,
  the death screen, the quest-departure enemy preview and the Guild Roster
  (which now draws a face beside every name; strangers are greyed and blank).
- **Reactions (Part B).** `Portraits.react(scene, img, ch, key, mood, {ms,
  intensity})` — queued transients at depth +4 with ease in/out. Combat: pain
  on every hit scaled by damage (heavy hits also recoil the head and leave a
  wound streak), surprised→pain on a crit/execute, content on a heal (tender
  between kin), smug/laughing for the attacker on heavy hits and kills, afraid
  on allies when one falls (grief for kin), furious when taunted, afraid when
  fleeing, surprised across the ambushed side and when a Risen stands up.
  Dialogue: the raw line's `[delivery]` tags map through `TAG_MOODS` (every
  tag in the data is covered or in `TAG_IGNORE`; `test/expressions.js` fails
  if a new one appears). `DialogueBox.showText` takes `{ raw }` for this.
- **Presence (Part E).** `look()` gaze (actor → target, everyone → actor,
  speaker → player, saccades at rest, ≥90 px only); `lipFlap()` from the VO
  clip's amplitude via WebAudio with a word-count fallback, composed under the
  mood's mouth; `motion()` nod/shake/tilt/recoil/slump; `skinState()` pale,
  flush, poisoned, frozen rim, burning flicker, wound; a 6% camera punch on
  crits (throttled 1.5 s). Hair shear on impact was not built.
- **Drawing (Part F).** Almond eye whites, gradient iris with limbal ring and
  specular, lower-lid line and lash flick; three-mark nose; two-tone lips with
  philtrum and corner dots; cheekbone plane, jaw shadow onto the neck, brow-
  ridge shadow, hair rim light; seeded hair strands and fringe shadow;
  freckles on 30% of seeds, undertone shifts; crow's-feet at rank 6+.
- **Body and costume (Part G).** `drawBody` paints a skin torso first: women
  get narrower shoulders, collarbones and a natural bust contour under the
  garment; men get lean/broad/heavy builds (trapezius, deltoid, pectoral
  shading; rank-4+ fighters fill out). `PATTERNS` holds 12 costume recipes
  (plate, leather_plate, lamellar, shinobi, pirate, navy, robe, ranger, hide,
  dress, duelist, street) and every `SET_LOOK` entry is pattern + {base, trim,
  metal} palette + flags (centre ridge, sun emblem, clan knot, pistol, gorget,
  stole, pendant) — 24 sets, 24 costumes, same costume on both sexes.
  Campaign-2 enemies wear their faction's kit (`FACTION_SET`) with their skin
  tint as the base colour, so the three skins per type are real palette swaps;
  a "plated_sentinel" portrait on a *human* faction enemy is a human in heavy
  kit, not the construct. New headwear: `kabuto`.
- **Tests.** `node test/expressions.js` (49 headless checks: palette shape,
  baselines for all 61 personalities, tag coverage, `moodFor` matrix, gear-set
  coverage) and `node test/browser_expressions.js` (16: roster moods, no
  listener leak over 20 panel cycles, [laughs] reaction, enemy moods and rigs in
  a live fight, pain reaction lifecycle, overlay paint cost, contact sheets).
  `npm run sheets` writes /tmp/shots/sheet_*.png (moods × 2 sizes, wolf +
  sentinel + faction enemies, creation grid, all sets × 2 sexes, greyscale
  silhouette row) — look at them after any change to portraits.js.
