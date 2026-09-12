# Adventurer dialogue implementation — review copy

Status: implemented locally and recorded. Nothing has been committed, pushed, or published.

The authoritative writing export is [ADVENTURER_SCRIPT_REVISED.md](ADVENTURER_SCRIPT_REVISED.md). The earlier proposal and sample document remain design history. The revisions preserve profanity, rude dismissals, and mean personalities; they remove unsupported context rather than requiring characters to be polite.

## Changes to review

### Follow-up: reduce noticeable repetition

The requested expansion adds **five statements and twenty authored response lines per personality**, for **1,500 new recordings across all 60 ordinary personalities**. See [DIALOGUE_BONUS_REVIEW.md](DIALOGUE_BONUS_REVIEW.md) for every addition. Existing lines and their clip indexes are preserved. Profanity and mean-spirited personalities retain their edge.

Each personality gains two neutral statements and one each for friendly, hostile, and romantic situations. The twenty responses cover neutral/friendly/hostile/romantic contact, inquiries, dismissals, preparation, rest/company, and thanks. Compatible situational lines reuse the same recording across relationship banks; there are 1,980 new file paths but only 1,500 newly recorded actor/text combinations.

The selector now remembers which eligible lines have been used in each context and chooses randomly from the remaining alternatives. It exhausts the suitable pool before starting a fresh cycle, avoids immediate repeats at cycle boundaries, and saves this history on the character. Existing voiced saves acquire the history automatically. This changes variety without changing reply frequency, existing save eligibility, or player decisions.

All 1,500 new recordings are complete with no failed requests. The estimate was **74,030 credits**; the reconciled account usage for this addition is **44,862 credits**. The account has **352,792 credits remaining**. Total observed usage across this dialogue project is 133,612 credits, within the original cumulative 450,000-credit ceiling. Detailed accounting is in `tools/bonus_voice_report.json`. Original-delivery totals below remain historical.

Regression checks cover all personalities and response purposes through three full rotation cycles, preservation of all existing text/voice hashes, reload continuity, and revision migration. A Chrome playback test shows five distinct matching player replies in five consecutive exchanges, including four bonus clips, all in the selected personality’s voice.

Final validation passes: bonus-dialogue regression suite, conversation suite, voice-usage checks, Chrome playback/creation/funeral checks, and hash/decode/duration/non-silence checks for all **4,955** script-linked audio files. The general rules suite still has its previously documented combat-power failure; no new dialogue failure was introduced.

### Ordinary characters and the player

- Replaced the 960 ordinary social lines across all 60 personalities. General speech avoids invented shared history, unexplained accusations, and unearned intimacy. Friendly and romantic speech uses the existing relationship state.
- Added 960 response lines, selected by both the opening's purpose and the respondent's own regard for the speaker. Regard is directed: one character liking another does not force mutual affection.
- Social exchanges contain at most two speakers. They cannot accept a contract, spend gold, grant forgiveness, or change a relationship merely by speaking.
- Added dedicated responses to dismissal. Being told to go away no longer produces an unrelated cheerful greeting. Abrasive responders can answer rudely.
- Added a brief acknowledgment category for ordinary requests to state one's business. These do not choose a quest or invent the player's intentions.
- Added personality-specific departure, return, friendly funeral, hostile funeral, and combat lines. Simple thanks, theft complaints, neutral funeral words, and romantic grief also have dedicated banks. Some short contextual sentiments are shared by compatible personalities and recorded with their respective assigned actors.
- Added one-time personality selection with a voice preview at ordinary character creation. Old unvoiced saves receive the same selection before arrival notices are processed. A character's selection stays locked; an existing heir retains their personality.
- Pending party-leader funerals now persist through save/reload, including the one-time old-save personality migration.
- Ordinary demigods and other status changes retain the same personality actor. Named campaign characters and gods retain their named casting; Hiro's writing remains outside this pass.
- All social requests now support explicit speaker, listener, and subject identities. The player can answer automatically. Party departure/return speech addresses the actual leader; remarks addressed to the dead never ask them to reply.
- Revival and theft memories are attributed to the actual actor, deduplicated within the quest, bounded to 24 records per character, and expire for dialogue purposes after three quest-clock increments. Revival thanks can play in the combat presentation queue; acknowledged events are not immediately repeated in town.
- Missing categories produce no line, rather than silently selecting unrelated generic dialogue. Compatible variants avoid immediate repeats when another candidate exists.

### Story, quests, and presentation

- Rewrote the connected briefs and principal recruiter/rival/antagonist/leader story beats for all seven faction arcs. The existing five-quest structure, combat encounters, skill rules, rewards, faction eligibility, and Antler branch remain in use.
- Added quest-purpose text to the first encounter screen. This is a presentation change, not a new objective simulation or new level.
- Revised rivals toward professional competence, collaboration, and familiarity. Their departures, after-quest remarks, death staging, and faction grief now support that progression.
- Added visible death-scene captions showing a rival recognizing danger and helping create a way clear. These actions are staged through the existing portrait cutscene, not through new combat abilities.
- Replaced the witnessed-death sequence with a news card when the rival did not accompany the party. The antagonist no longer claims the absent companion saved the player in front of them.
- Added alternating Beau/Cask dialogue around the boarding harness and tavern invitation, plus Cask/Saint-Cloud grieving and deciding who will tell the crew. Each speaker plays their own named voice clip.
- Added on-screen addressee labels and scene captions. Finale villains addressing faction leaders and Hargrave addressing Crane are identified accordingly.
- Combat banter now carries its correct beat key and clip index, and only plays when the named companion is present, standing, and has not fled. Each rival has faction-appropriate field observations.
- Replaced normal social remarks at both funeral presentations with dedicated grief/hostility banks. The player can speak at the party leader's funeral. Hostile mourners no longer automatically use the same strong grief pose as friends.
- Hostile funeral wording also works when the speaker is the sole mourner. It does not assume an unseen audience of friends.
- Serialized automatic exchanges on the existing voice channel. Closing, skipping, or leaving an exchange cannot start another turn from that exchange. Corrected duplicate callback paths in funerals and conscription.

### Faction-specific continuity

| Faction | Main revision |
|---|---|
| Gaping Maw | The leak, courier routes, and exposed names connect the jobs. Killing Arden does not erase evidence already delivered to the watch. Kite's attention to exits informs the death scene. |
| Antler | Conscript and company complicity are established before Hargrave's intervention. Removed the contradictory elapsed-year claim. Both branch outcomes acknowledge the people affected. |
| Varenholm | Research leads the company into a prepared threat. Cassiel's attention to magical workings informs his role and final warning. |
| Hollow Bell | Old routes, the order against Jiro, and unanswered questions connect the conflict. Kaede represents the Bell in faction-war dialogue, rather than its enemy Jiro. |
| Green-Eyed | The old fire and signed order lead into Tomoe's grievance. Ayame's judgment matters; Isamu's ending includes accountability and her memory. |
| Red Tally | Harnesses, shares, the channel, and crew safety ground Beau's competence and humor. The ending keeps the crew and Beau in view. |
| Admiralty | Leaked schedules, charts, cargo, and the village's supplies connect the missions. Merrow notices the less obvious threat; the ending carries forward her corrections. |

The Pale Mother and First Bloom openings no longer offer an unsupported peaceful departure immediately before a mandatory confrontation.

## Voice production and budget

- Existing casting IDs are preserved in `tools/voice_casting.json` and printed in the script export.
- `tools/build_voice_manifest.js` compares current spoken text and casting against the checked-in version. A changed line requires replacement even if an old MP3 exists.
- `tools/generate_story_voices.py` audits account/model/voice rates, checks a pilot batch, reserves every attempted request before sending, writes audio atomically, and resumes by validated text/audio hashes. It does not buy credits or enable overage billing.
- The hard allowance is **450,000 credits** across this run, with a **30,000-credit retry reserve** in preflight. Identical text in the same actor's voice is reused. Failed or uncertain requests are not retried automatically.
- Audio URLs include a content hash, preventing old browser-cached recordings from accompanying changed subtitles.
- Use the new manifest/generation scripts for this revision; older generators enumerate the old four-band library and do not cover the added contextual banks.
- Detailed estimates, casting audit, completion ledger, and final account usage are in `tools/voice_budget_report.json` and `tools/voice_generation_state.json`.

### Final production totals

| Measure | Result |
|---|---:|
| New or replaced audio paths | 2,842 |
| Unique recordings used by those paths | 2,703 |
| Total script-linked files verified, including reused originals | 2,975 |
| Failed generation requests | 0 |
| Conservative credits reserved across all recordings and editorial retakes | 146,430 |
| Reconciled ElevenLabs account usage increase | **88,750 credits** |
| User's allowance | 450,000 credits |
| Unused portion of that allowance | 361,250 credits |
| Account credits remaining at final check | 397,654 credits |

The account's usage counters updated after the generation responses; final usage was checked again after processing. The actual account increase is lower than the conservative character-based reservation. Sixty early funeral takes were revised after the solitary-mourner review; their replacements and charges are included above.

## Verification

- New conversation regression suite: identity locking, directed relationships, dismissal responses, explicit participants, no dead/self/group reply, event attribution and expiry, save persistence, faction scene links, and sequential/cancellable voice playback.
- Headless Chrome checks: new-character and old-save selection, double-click protection, voice preview/confirmation, hostile NPC exchange, the player's assigned response clip, alternating named-speaker scenes, and a hostile player funeral remark. Screenshots: `tools/story_screenshots/`.
- Dialogue uniqueness and token checks pass. All UI scripts parse. Existing voice-usage checks: 10 passed.
- All 2,975 script-linked MP3s pass browser decoding, duration, and non-silence checks. Every changed output matches its recorded content hash. The browser flow checks finish without JavaScript errors.
- Existing general rules suite: 66 passed, one pre-existing combat-power failure.
- Existing first-campaign rules suite: 129 passed, one pre-existing Backstab-power failure.
- Existing second-campaign suite: 187 passed, two pre-existing `articles_of_war` witness-coverage failures. The old tests demanding demigod voice replacement were updated to the user's one-actor requirement. Baseline comparisons are retained under `tools/baseline_*_results.txt`.

## Scope and limits

This is authored dialogue selection, not runtime AI generation. Replies still use purpose-specific pools, so a suitable line can recur after its pool is exhausted. It does not invent conversations or player choices dynamically. Existing optional companion participation remains optional; five quests cannot guarantee that every player will develop the same attachment.

The delivery does not add levels, alter combat balance, add branching player reply menus, or implement a new cross-faction diplomacy system. It uses the existing campaign state and presentation systems. Audio decoding/coverage checks are automated; they cannot substitute for a human performance review of every recording.
