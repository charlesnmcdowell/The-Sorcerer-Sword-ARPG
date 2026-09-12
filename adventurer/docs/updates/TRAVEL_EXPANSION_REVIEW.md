# Travel expansion — implementation review

Implemented locally on 9 September 2026. The interview decisions supersede the draft document where they differ.

## Viewing and presentation

- Each location/leg, new companion scene, and rare event has a stable content ID. First viewing is unskippable; second viewing is skippable; subsequent viewings are bypassed entirely. There is no compressed third showing.
- History is stored in `adv:meta`. Reload, reincarnation and nepotism preserve it. The existing New Game reset clears it.
- New named-companion scenes and rare events can introduce unseen content on a familiar route. Random dialogue variation alone does not reset a scene’s counter.
- Outbound scenes replace the old heading-out march. Board quests with at least three encounters have one mid-leg, after encounter one. Faction and divine quests have outbound and return legs without extra mid-legs.
- Return scenes precede results. A queued assassination interrupts the road home; surviving it resumes the journey. Rewards and world ticks resolve once, even when the scene is skipped.
- Solo travel has no player speech, text thoughts, or automatic replies. Party travel usually has one companion statement and an optional NPC response. Named campaign travelers have authored lines.
- Five procedural scenery layers, independently scrolling foreground/background, location landmarks, staggered portrait walking, slower wounded movement, still undead, speaker emphasis, weather, time-of-day lighting, birds, water ripples, pedestrians and drifting motes/embers.
- Sea mid-legs clear much of the harbor silhouette to emphasize the crossing. Existing music continues; synthesized wind/water ambience obeys mute and page visibility.
- Each scene destroys its generated textures, objects, timers, speech and ambience on completion or scene shutdown. The town chrome failsafe respects active cutscenes.

## Complete location inventory

| Setting | Terrain | Distance | Landmark |
|---|---|---|---|
| The County Road | forest | near | milestone |
| The Deep Wood | forest | near | bridge |
| The Reed Marsh | forest | mid | reeds |
| The Old Ruins | dungeon | far | arch |
| The Crypt Steps | dungeon | far | grave |
| The Watch District | city | near | gate |
| The Back Alleys | city | near | laundry |
| The Lockup Quarter | city | near | bars |
| The Tavern Quarter | city | near | sign |
| The Tidelands | coast | mid | wreck |
| The Outer Harbor | port | far | lighthouse |
| The High Pass | mountain | mid | shrine |
| Behind the Laundry | city | near | laundry |
| The Antler Toll Road | forest | near | toll |
| Varenholm Approach | dungeon | far | runes |
| The Paper Shop Lanes | city | near | paper |
| The Green-Eyed Pass | mountain | mid | bamboo |
| The Red Tally Anchorage | port | far | red sails |
| The Admiralty Docks | port | far | blue sails |
| The Ossuary | dungeon | far | bones |
| The Salt Court | port | far | throne |
| The Green Altar | forest | far | roots |
| The Birthing House | dungeon | far | roots |
| The Low Tide Coves | coast | mid | wreck |
| The Ash Fields | forest | mid | fire |
| The Lamplighter Quarter | city | near | candles |
| The Widow’s Courtyard | mountain | mid | banner |

All 27 destinations have a corresponding battlefield recipe. Existing battle art is retained where suitable; additional recipes use the same drawing kit for roads, ports, faction banners, academy pillars, prison bars, ruins and ash fields.

## Costs and access

| Item | Rule |
|---|---|
| Nearby / medium travel | One world day; no passage or provisions charge except sea travel |
| Distant travel | Two world days, including two household childcare charges and two world simulation ticks |
| Sea passage | 4% of the base contract reward, rounded down, minimum 8g and maximum 30g; flat company charge |
| Distant provisions | Optional 8g per company per quest; purchased at departure; no inventory weight |
| Without distant provisions | Arrive at 85% maximum HP |
| Successful work | Standard passage and purchased provisions reimbursed to the payer, separately from existing reward/wages |
| Failed work | Travel expenses remain spent; existing failure/payroll rules apply |
| Low resources | Every generated board contains nearby solo and party work; solo pays 40g, party pays at least 100g and enough to cover current payroll plus 40g |
| Hireling | Company leader pays travel; player retains their wage. Household childcare remains personal |

Departure validates affordability and contract gates before moving any gold. Vault choices cannot accidentally spend tuition or passage money on a rejected start. Extra world time affects population/household time, while meals and shared-quest/vault streaks remain once per completed contract.

## Dialogue and events

Every ordinary personality has a recorded statement for every location and for lawful, criminal, neutral, mid-journey, successful-return and failed-return contexts. Location writing draws on remembered experiences and local customs; responses use eight writing registers but retain the individual personality’s actor. Abrasive personalities retain profanity. Hostile and romantic replies require the corresponding relationship between the two speakers. Dead characters and undead do not speak; conscripts rarely do.

The seven faction rivals and seven bosses have 21 authored travel lines in their existing named voices. Each rival has two lines and each boss one. No player response is required.

Rare outbound events: a roadside body and candle, an occupied landmark, a weather change that persists through the quest, or friction between two companions with a Hatred edge. They appear at roughly a one-in-eight opportunity on familiar routes and each has its own two-view limit. Consecutive rare appearances and repeated last event types are excluded.

The draft’s surprise passage surcharge/forfeit event was omitted: the interview prioritized checking resources before departure and then enjoying the scene. The quoted costs remain reliable.

## Voice expenditure

2,241 new clip paths, representing 2,068 unique actor/text recordings. Shared writing is separately voiced for each established actor.

Actual additional usage: **115,786 credits**. Remaining account balance after generation: **237,006 credits**. Cumulative actual project usage: 249,398 credits. Conservative reservations remain below the original 450,000 ceiling.

## Validation

- Headless tests: persistent history, reincarnation, new content IDs, fresh-game reset, atomic affordability checks, provision penalty, expense reimbursement, two-day clock, zero-gold nearby work, and destination/dialogue coverage.
- Browser catalog test: every location renders, first-view skip is absent, and generated textures are released.
- Browser flow test: first/second/third view rules, departure toggle, failed vault-all attempt, mid-leg, return ambush/resumption, one payout/time advance, and cleanup.
- Browser party test: two NPCs address each other, the selected personality’s correct hashed voice file plays, input cannot advance first-view speech, and chrome is restored.
- The campaign progression fixture now funds departure and gives its test actor temporary health while deliberately waiting for The Quiet’s reinforcements. This isolates story progression from the changed random sequence caused by extra world days; it is not a combat-balance test. Production combat values are unchanged.
- Audio validation: every script-linked recording decoded successfully, with a non-silent signal and matching generated-file hashes.

See `tools/travel_inventory.json` for all 35 campaign quests and three divine routes, `tools/travel_regressions.json` for regression suite results, and `tools/travel_screenshots/` for browser captures.

## Source changes

New: `js/data/travel.js`, `js/core/travel.js`, `js/ui/travel.js`, `js/ui/travel_battle_art.js`, and the travel voice files.

Updated: script loading/cache versions in `index.html`; departure economics and world time in `js/core/game.js`; departure controls in `js/ui/town_panels.js`; embark/chrome handling in `js/ui/scene_town.js`; mid-leg/return/results in `js/ui/scene_quest.js`; ambush continuation in `js/ui/scene_combat.js`; automatic timed speech in `js/ui/dialoguebox.js`; weather continuity in `js/ui/battle_art.js`; voice hashes and the full revised script.

## Travel script

### The County Road

I learned to read the mile stones before I could read a contract. The distances lie less often.

### The Deep Wood

The bridge here was condemned before my first job. They still collect the crossing toll.

### The Reed Marsh

I used to follow the lanterns here. Then I noticed they never lit the reeds beneath them.

### The Old Ruins

I have seen three different crests cut into these stones. Each owner left the previous name underneath.

### The Crypt Steps

A gravedigger taught me to count the steps down. If the count changes coming back, find another stair.

### The Watch District

The watch used to chalk safe houses on these doors. Rain made a lot of people suddenly respectable.

### The Back Alleys

I delivered parcels here once. Every address had two doors, and only one admitted it existed.

### The Lockup Quarter

I brought food to a prisoner here. The guard charged me for the bowl on the way out.

### The Tavern Quarter

I learned to ask for the price before ordering here. The chalkboard somehow gets dearer behind your back.

### The Tidelands

I once found a road marker under the tide. There was a whole village on the old chart.

### The Outer Harbor

My first passage cost less than the rope they charged me for touching. Always ask what the fare includes.

### The High Pass

An old carrier showed me those shelters. Built low for the wind, not because the builders were short.

### Behind the Laundry

I once waited here for a shirt to dry. Three people collected parcels. Nobody brought any washing.

### The Antler Toll Road

I have crossed this toll gate under three companies. They change the banner and keep the same collector.

### Varenholm Approach

I carried ink to the Academy once. They inspected the bottles more carefully than the man carrying them.

### The Paper Shop Lanes

I bought paper here once. The shopkeeper knew who had sent me before I mentioned a name.

### The Green-Eyed Pass

I watched a recruit sweep these steps in the rain. His teacher said the leaves were not the lesson.

### The Red Tally Anchorage

I saw a Tally crew divide a broken compass into shares. Nobody wanted it; nobody would waive their portion.

### The Admiralty Docks

I once stood in this queue until the tide changed. The clerk called the departing ship a scheduling error.

### The Ossuary

I have seen the bone carts leave this district. Empty going in, empty coming out. I stopped asking the drivers.

### The Salt Court

A sailor showed me a coin from this drowned kingdom. Salt had eaten the king away. The crown was still clear.

### The Green Altar

A woodcutter told me he buried his axe here. By spring the handle had put out leaves.

### The Birthing House

I remember when this place had a garden wall. The roots have lifted it clear of the ground.

### The Low Tide Coves

A fisher once showed me the safe stones. I wrote them down. The sea moved two of them that winter.

### The Ash Fields

I used to buy charcoal from this hillside. The burners left when the fires began lighting themselves.

### The Lamplighter Quarter

I remember these windows dark after supper. Now every room keeps a candle burning. Even the empty ones.

### The Widow’s Courtyard

I once watched practice through that gate. Nobody spoke when the last blade stopped. They waited for permission.

The complete personality and named-character travel banks, including responses and job/outcome lines, are included in [ADVENTURER_SCRIPT_REVISED.md](../dialogue/ADVENTURER_SCRIPT_REVISED.md).
