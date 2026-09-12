# Difficulty, tactics, and audio update

Implemented in the local game. Reload the game to load the updated scripts and recordings. Existing saves receive the balance migration automatically; a new game is not required.

## Balance changes

- Solo contracts: +100 gold, including local jobs, premium bounties, and hazards.
- Party contracts: +100 gold, including faction campaign and repeatable contracts.
- Player hireling wages: +100 gold for the default offer, application range, raise ceiling, tutorial wage, and existing saved employment. NPC recruitment wages remain unchanged.
- The tutorial wage is now 145 gold. Player applications range from 130 to 300 gold according to reputation; raises can reach 400 gold. Party payroll and affordability checks still apply.
- Player effective maximum HP is doubled, including growth and modifiers. Existing saved current HP doubles once to preserve the health percentage. NPC HP and enemy health floors exclude this player safety buffer.
- Reward bonuses apply once. Travel fares and encounter selection do not increase just because a reward received the bonus. Accessible local work remains available.

## Combat safety

- Below 50% player HP, auto combat stops in solo and party battles. Pending auto actions are cancelled and manual input is required. Auto cannot be re-enabled while below the threshold.
- Exactly 50% does not trigger the interruption. Healing does not silently resume auto combat.
- Below 30% HP, the naval narrator recommends Flee once per solo fight. Exactly 30% does not trigger it. Party fights receive no flee warning, even if a companion falls.

## Enemy tactics

Audited 96 regular, boss, and campaign enemy definitions. The complete inventory is in `tools/difficulty_update/enemy_audit.json`.

| Enemy | Revised identity |
| --- | --- |
| Bandit | Scout's Cut and smoke escape; avoids a Backstab-only kit the normal enemy AI could not use |
| Hedge Mage | Aimed Cantrip and Frost Touch |
| Town Watch | Sunder and Taunt instead of elemental spells |
| Plated Sentinel | Mace Swing and Shield Wall |
| Field Chaplain | Mend, Guardian Ward, and Stanch |
| Pyre Justicar | Fire Bolt and Guardian Ward, distinct from the Ember Cultist's burning attacks |
| Sentinel Prime | Shield Breaker, Mace Swing, Shield Wall, and Sunder |
| Hollow Owl | Night Screech and Umbral Rake |

- Enemy definitions specify a signature move. AI favors it while reducing consecutive repetition when other legal choices exist.
- Hunters favor bleeding or exposed targets while respecting legal targeting and forced marks. Affliction enemies favor appropriate poison follow-ups.
- Campaign loadouts retain their signature ability when randomly selecting skills. Existing miniboss signature overrides take precedence.
- Campaign boss contact effects follow their kit: burning, venomous, or physical, replacing arbitrary random elemental riders.
- The Risen and The Refused intentionally remain basic-attack undead; The Refused retains its stronger stat profile and immunities. Lightning remains available to storm and lightning specialists.

## Naval narrator

Eleven new recordings use the established Ash/naval voice, `C34VRFVgUY3W0ZIN2NQ5`:

- Solo low-health flee advice.
- Shelter warnings with two quests and one quest remaining before sickness. The game tracks completed quests, not calendar days.
- Three hunger severities, explaining stat loss and adding jokes.
- Shelter-related sickness, stacking penalties, and housing advice.
- Low-gold advice below 200 gold, with party wages, faction/campaign contracts, and the danger of solo work.
- Two under-100-gold remarks, including the rich husband/wife joke.
- Multiple-spouse advice after obtaining a brick house or better, never before. Brick housing supports two spouses.

Warnings persist their seen state and gold cooldown in the save. Town narration waits for tutorials, conversations, and blocking menus. Long narrator captions remain readable and may be dismissed. The new warnings do not remove existing profanity or personality dialogue.

## Sound effects and voice updates

- 42 new local ElevenLabs combat effects: use/impact pairs for slashes, thrusts, blunt weapons, claws, bites, whips, fists, arrows, guns, fire, ice, lightning, acid, shadow, holy, arcane, and nature magic; plus healing, guarding, support, transformation, blocking, misses, stealth, and revival.
- All 185 active skills map to an available effect. Elemental melee impacts use their element's impact sound.
- Recordings preload locally, respect mute and scene cleanup, and have bounded simultaneous playback. Existing synthesis remains a fallback while a recording loads or if unavailable.
- Two tutorial recordings were regenerated for the updated wage rules. All 32 tutorial recordings were checked against their actor/text manifests and decoded in the browser.
- Versioned asset URLs prevent stale script and recording caches.
- Existing boss music remains in use; no new music was generated.

Final ElevenLabs cost: **2,203 credits**, including one corrected tutorial regeneration. Final verified account balance: **182,772 credits**. The conservative reservation retained in the shared generation budget is 4,935 credits. No API credentials are included in this report or the generation logs.

## Verification

- 15 relevant regression suites passed: core rules, survival, travel, threat, enemy healers, boss health floors, solo quests, player requests, party roles, both campaign flows, targeting, combat presentation, and tutorial voices.
- Additional checks passed for exact reward amounts, one-time save migration, player-only HP doubling, hunger modifiers, wage bounds, narrator condition gates, and all 96 enemy kits.
- Chrome combat checks passed at 50%, just below 50%, 30%, and just below 30%; verified party interruption, solo-only warning, and cancelled timers.
- All 42 SFX loaded, all 13 updated/new voice clips decoded, and sound playback stopped cleanly on cleanup. No browser JavaScript errors occurred.
- Detailed results: `tools/difficulty_update/regressions.json`, `browser_results.json`, and `enemy_audit.json`.

These checks verify the rules and asset integration. Overall difficulty and subjective audio quality still benefit from playtesting across different builds.
