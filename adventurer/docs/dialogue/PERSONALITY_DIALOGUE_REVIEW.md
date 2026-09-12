# Distinct personality dialogue revision

Implemented locally after rereading the dialogue against the actual scene and conversation callers.

## Changes

- Replaced shared travel biographies with 27 short location captions and individually authored observations for all 60 personalities. Captions distinguish the destinations; spoken observations cover the six terrain types. A personality can reuse its own terrain observation at related destinations.
- Wrote distinct work and homeward remarks. Homeward lines work after success or failure and do not assert that everyone survived.
- Rewrote shared revival memories, theft reactions, funeral remarks, dismissal responses, and male/female counterpart occasion lines.
- Revised overlapping short social responses while preserving their conversation category and clip indexes.
- Fixed reply selection: exhausting a subject’s responses cycles through that subject again. It no longer substitutes unrelated greetings, preparation remarks, or thanks.
- Retained the five bonus statements and twenty bonus responses per personality, fixed voice casting, and coarse language. Hostile rewrites remain hostile. Existing campaign/profanity source files were not reverted.
- Added readable environmental captions to first-view travel scenes. Existing scenery, travel costs, save history, first-view skip restrictions, and two-view limits remain in place.
- Updated the script export, audio cache hashes, and regression checks. Missing current-script audio paths detected by the manifest are included in the recording batch.

## Writing samples

- **Wrathful / travel_forest**: “Branches in the face. Mud in the boots. Fucking picturesque.”
- **Wry / travel_port**: “Harbors make a convincing argument that every fee needs another fee.”
- **Boastful / travel_mountain**: “I'm setting a sustainable pace. The mountain should feel honored.”
- **Bereaved / funeral_romantic**: “I knew love could end in this. I would still choose our time together. I just wanted more.”
- **Cynical / revived**: “You brought me back. For once, I have no fucking complaint about somebody intervening.”
- **Furious / theft**: “Give it back, you thieving bitch. I saw enough.”

## Review files

- [Complete changed-line ledger](PERSONALITY_DIALOGUE_CHANGES.md): 2824 changed personality clip paths, each with before/after wording.
- [Full current script](ADVENTURER_SCRIPT_REVISED.md): all dialogue and the 27 location captions.
- [Current bonus lines](DIALOGUE_BONUS_REVIEW.md): the retained five-statement/twenty-response additions.

## Validation

- No identical normalized spoken text shared between different personalities across 6,780 personality clip paths. Delivery tags and punctuation do not disguise duplicates.
- 11,040 reply selections tested across four cycles, with correct conversation subjects.
- Conversation, bonus variety, save persistence, revival memory, funeral recipients, and travel rules passed.
- Browser checks cover all 27 travel locations, first/second/third viewing behavior, companion voice routing, and return/ambush completion.

## Voices and credit limit

The batch estimate is 80,442 new credits for 1,220 new recordings; 120 existing actor/text recordings can be reused across destination paths. The 450,000-credit ceiling and 30,000-credit reserve remain enforced. Completed earlier reservations were reconciled using recorded billing counters, retaining the earliest conservative reservation and including subsequent account usage conservatively.

Recording completed: **48740 credits used**; **187195 account credits remaining**. Audio validation: 7216 clips, 0 failures.
