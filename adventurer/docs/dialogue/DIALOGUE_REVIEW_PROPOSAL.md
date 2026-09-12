# Adventurer writing review — revised system proposal

Prepared from ADVENTURER_SCRIPT.md and inspection of the live dialogue and campaign code. This document preserves the approved design discussion. Implementation and recording are complete locally; `DIALOGUE_IMPLEMENTATION_REVIEW.md` records the actual delivered scope, and `ADVENTURER_SCRIPT_REVISED.md` exports the current game script. Proposed examples below are historical and are superseded by that export.

Revision: incorporates the user's clarification that the player currently has no spoken replies, each character has one personality and associated actor, and new exchanges should be automatic. The companion document `DIALOGUE_SCRIPT_SAMPLES.md` contains the revised script samples, with speakers, listeners, conditions, and voice ownership. It supersedes the earlier selectable-player-reply approach.

## Direction

Relationships and party building should make the player want another adventure with these people. Aim for clear motives, earned affection, recognizable competence, adventure, and humor grounded in character. Keep serious consequences. Let some conversations be ordinary; constant threats, declarations, and quotable endings make the world exhausting.

Keep the user's five-contract arc: a recruiter notices qualifying work, a rival becomes a respected friend, the antagonist kills the rival on contract four, and contract five resolves the faction conflict alongside its leader. Give each faction different reasons for that sequence and different experiences within it.

## Findings

1. **Dialogue frequently assumes a missing conversation or history.** Brash's default greeting calls a stranger “you old dog.” Exacting corrects a distance the player never gave. Blunt says “Shit plan” without a plan. Avaricious claims to have posted a bounty. These need either a real trigger or a different line.
2. **Personality becomes permanent behavior.** Angry characters threaten almost everyone; reserved characters repeatedly explain how rarely they praise; anxious characters often have little identity beyond dependence. Give each temperament practical interests, abilities, boundaries, and ordinary social behavior.
3. **Generic lines invent biography.** Salted asserts forty years at sea; Elder asserts sixty years in the quarter; Bereaved assumes a particular romantic loss. Those facts need compatible character histories. A personality assignment alone cannot establish them safely.
4. **The rivals share a template.** Kite, Suzume, Beau, Cassiel, and Merrow introduce their superiority, dismiss the player, count two jobs, then abruptly single the player out as uniquely trustworthy. Their professions differ more than their relationships do.
5. **Competence is asserted more often than demonstrated.** The script repeatedly calls someone the best, then has an antagonist dispatch them in a brief scripted interruption. The rival needs a visible success and an understandable reason that success is insufficient against this threat.
6. **Debriefs make unsupported performance claims.** Finishing a quest is not evidence that the player made no mistakes, spared a target, held a particular flank, or needed no help. In the first campaign, the recruiter's third debrief is queued even when the rival toggle is off. Companion-specific praise needs attendance checks.
7. **Some endings displace the friendship.** Saint-Cloud ends by admiring Kessler, with little attention to Beau. Isamu says Tomoe was better than Ayame. Understanding an antagonist can deepen a story, but the lost friend's life needs its own resolution.
8. **Continuity needs repair.** Hargrave says a year has passed since the killing in the immediately preceding contract. The Maw establishes evidence already delivered to the watch, then treats killing its author as closure. Jiro speaks for the Bell in faction-war dialogue despite hunting its leader. These need coherent timelines, consequences, and speaking roles.
9. **Dialogue can promise mechanics that are not represented by the scene.** Advice about a particular archer, reload, shield side, or maneuver needs a matching combat condition. A god's offer to leave needs an actual opportunity to leave. Briefs about capture need a legible capture outcome.
10. **Text and voice need separate editorial checks.** The script's spoken variants contain “they was,” “they has,” and “they does.” Rival-name substitution also cannot represent arbitrary third parties correctly. Referents must be explicit before recording.

The live generic selector checks relationship warmth, token availability, and the previous variant. It does not itself validate the history asserted by a line. Its warmth selection also operates on the remaining candidate list, so the document's four-line emotional ramp is not a reliable fixed mapping. Hatred scores run from -100 to -50 in the code, which conflicts with the document's description of line order from freshly soured to most hostile. Writing alone will not resolve these selection issues.

## Sample A — an ordinary NPC with a temper

Proposed replacement direction for Wrathful. These are separate responses with stated conditions, not a conversation played all at once.

**First introduction; no established relationship**

> [calm] Looking for another blade? Tell me what the job pays and what we're likely to meet.

**Party planning; no claim about a previous failure**

> [annoyed] We can argue about the plan here. Once we're in there, I need to know what everyone is doing.

**After a fight in which the player actually revived this NPC**

> [quietly] Thanks for getting me up. I remember hitting the ground. Everything after that was getting further away.

**At the meal stop, once the friendship is established**

> [warmly] Sit here. You can help me work out what this used to be before they called it stew.

**After a recorded theft by the player**

> [angry] I checked my purse. Give it back. Then we'll talk about whether we're still working together.

The anger has an object. Friendship can be pleasant without becoming a vow of lifelong devotion. The revive response belongs to the event that earned it and should not repeat indefinitely.

## Sample B — Beau becomes someone worth sailing with

New connective scenes around The Red Tally's existing contracts. Stage directions describe proposed visible events, not things the current game already does. Named NPCs can exchange authored lines through successive campaign beats. The new player-personality response system is a separate proposed addition, not a feature assumed by these scenes.

**After contract one: introduction at the counting house**

*Beau is checking the straps on a boarding harness beside Cask's desk.*

> **Cask:** [calm] This is Beau. You'll be working together if you stay.
>
> **Beau:** [playfully] Best shot in the fleet. He leaves that out because he pays me the same either way.
>
> **Cask:** [flatly] That harness belongs to a deckhand. Stop charging him for repairs.
>
> **Beau:** [calm] I'm not charging him. Look at the buckle. It would've opened halfway across.
>
> **Cask:** [quietly] Leave it with me. I'll check the rest.
>
> **Beau:** [playfully] See? Can't spare me.

His boast is one part of his character. A practical detail reveals that he notices danger and looks after the crew.

**Contract three: a boarding encounter**

*A gunner has a shot across the boarding route. Beau identifies the threat. The encounter gives him an opportunity to use his existing firearm skill against that gunner; the dialogue reacts to the actual outcome.*

Before the shot:

> **Beau:** [calm] Gunner by the rail. Stay under cover. I've got a shot.

Only if his shot removes the threat:

> **Beau:** [calm] Clear. Across, while we've got the chance.

If it fails:

> **Beau:** [alarmed] Still up. Keep your head down!

The encounter must provide a readable boarding objective and preserve the player's normal combat choices. No free success should be narrated over a miss.

**After the shared contract: invitation**

> **Beau:** [calm] Cask's paying out. Come eat with me after.

> **Cask, to Beau:** [flatly] Your tab first.
>
> **Beau, to Cask:** [playfully] I was building up to that.
>
> **Beau, to the player:** [warmly] I'll save you a seat.

The invitation is a small change in behavior. It gives friendship space without making Beau claim the player is the only person he has ever trusted.

## Sample C — a death with an aftermath

Proposed Red Tally treatment: contract four reveals a prepared naval trap. Beau recognizes it and helps open an escape route. Kessler kills him while closing that route. Show what Beau accomplishes and how the player escapes; move most of Kessler's biography and political argument into earlier clues and the final confrontation.

This sequence needs a separate staging review against combat revival and retreat rules. Establish why the loss is final within the world's existing rules before presenting it. Do not silently disable a working player ability to force the scene.

**Back at the counting house**

*Cask opens the ledger at Beau's entry. He leaves his pen on the desk.*

> **Cask:** [quietly] Tell me what happened. Take your time.

After the account, if the proposed escape scene occurred:

> **Cask:** [sad] He got you off the ship.
>
> **Cask:** [quietly] I kept telling him to bring someone back who could confirm his stories.

*Cask closes the book.*

> **Cask:** [calm] You can stay here a while. I'll tell the captain you're back.

Let the scene pause, then let the player advance or skip it using the existing presentation controls. No conversation menu or player account is required: the preceding scene can establish that Cask has heard what happened. Do not interrupt this moment with a celebratory title notification. The companion script replaces the request for a player account with a complete NPC-only exchange.

**After the final confrontation**

Proposed outcome: the fleet breaks the immediate interception threat and evacuates the crews at risk; the empire and its navy still exist.

> **Saint-Cloud:** [calm] The ships are clear of the channel. We can bring the crews home.
>
> **Saint-Cloud:** [quietly] When you're ready, I'd like you there when we say goodbye to Beau. You sailed with him. You have a place with the crew.

Stage the farewell after the return, then issue the reward. The ending resolves something concrete and acknowledges the friendship without dictating the player's grief.

## Proposed changes for review

| Area | Proposed change |
|---|---|
| Ordinary dialogue | Review all 60 personalities. Replace contextless replies; retain distinct temperaments and allow neutral first meetings. |
| Character history | Require established age, profession, family, and loss facts for biographical lines; provide compatible fallbacks. |
| Relationship memory | Select responses using relevant recorded events: shared contracts, help, theft, betrayal, romance, bereavement, and witnessed faction actions. Keep authored lines; runtime story generation is unnecessary. |
| Memory rules | Record who experienced or learned an event, its participants, and whether it was acknowledged. Prioritize immediate events, then shared history, then ordinary conversation. Do not invent history for old saves. |
| Relationship intensity | Correct the emotional ordering and keep repetition avoidance from promoting an inappropriately intimate or hostile line. Keep ordinary dislike distinct from threats requiring a real cause. |
| Rival arcs | Give every rival a distinctive demonstrated skill, an interest beyond rank, a shared experience, a voluntary friendly gesture, and a meaningful contribution before death. Respect actual companion attendance. |
| Faction plots | Connect each contract's discoveries to the next. Introduce antagonist activity before contract four and show the leader responding before the finale. |
| Faction distinctions | Maw: secrecy and exposure. Antler: contract obligations and coercion. Academy: magical investigation and institutional responsibility. Bell: intelligence and past orders. Green-Eyed: martial duty and accountability. Tally: crew trust and maritime survival. Admiralty: command and the costs of enforcement. These are proposed emphases grounded in the current stories. |
| Moral choices | Preserve Antler's existing branch and expose Dain's use of Conscript earlier. NPC exchanges can question it. Actual player actions determine allegiance; automatic personality responses cannot choose sides or forgive wrongdoing. |
| Connected world | Add reactions to known memberships and relevant faction events. Maintain one coherent Kessler across both roles. Check named speakers' survival and allegiance before faction-war lines play. |
| Quest format | Add short preparation, discovery, and return scenes. Make capture, investigation, boarding, or escape objectives visible where the story requires them. Review encounter changes individually before implementation. |
| Dialogue presentation | Add short automatic exchanges, explicit recipient labels where needed, controlled banter frequency, and clear transitions between danger, grief, and rewards. No dialogue-choice tree is proposed. |
| Death and endings | Preserve the requested fourth-contract loss. Review revival consistency, on-screen versus absent companions, escape logic, and lasting consequences. Give every rival an aftermath. |
| Supporting prose | Check quest briefs, tutorial claims, god encounters, faction-war dialogue, revives, exits, and funeral narration for continuity and appropriate tone. Keep instructions clear when the player needs mechanics explained. |
| Voice production | After writing approval, prepare matching display and spoken text, repair grammar and referents, keep one assigned actor across each character's openings and responses, regenerate changed clips, and verify playback and coverage. Resolve the current special voice overrides as described below. |
| Delivery | Implement an approved representative section first, check it in the game, then apply the approved direction across the remaining scope. Maintain a change log covering text, behavior, scenes, and audio. |

Hiro is absent from the supplied script and is outside this first proposal. No commits, pushes, paid voice requests, or gameplay edits have been made.

## What the live code establishes

| System and files inspected | Current behavior | Consequence for this proposal |
|---|---|---|
| `js/core/character.js`, `js/ui/scene_creation.js` | Ordinary NPCs receive one `personalityId`; ordinary players start with null. NPC AI also has a separate numeric personality vector. Creation currently chooses name, appearance, and skills. | Add a player personality choice and retain it on the character. Do not alter player stats, skills, or tactical control as a side effect. Keep an existing heir's identity when they become the player. |
| `js/core/util.js`, `js/ui/dialoguebox.js` | One line is selected by relationship band, token availability, warmth, and recent usage. Default context and band helpers refer to the player. | Add explicit participants and response compatibility. Replacing only the displayed target name is insufficient: relationship selection must use the actual listener too. |
| `js/core/game.js`, `js/ui/cutscenes.js` | A dead NPC leader's mourners and relationship scores are recorded before relationships are removed. The funeral uses ordinary bands and excludes the player from speeches. | Preserve that useful snapshot; add funeral-specific text and distinguish the deceased from living listeners. Player mourning is a deliberate extension. |
| `js/ui/cutscenes.js`, `js/ui/scene_town.js` | Departure and return use moving portrait cards, captions, timed transitions, skip controls, and scene-busy guards. Return is currently silent. | Put short exchanges at controlled points in this sequence. Extend the established visual format; ensure skip ends the whole exchange without starting another line. |
| `js/ui/campaign_ui.js`, `js/ui/campaign2_ui.js` | Campaign beats contain a named speaker and sequential lines. They use the shared dialogue box. Token filling defaults to player/rival identities; campaign two patches the shared plumbing. | Alternating named speakers is feasible using successive beats. Add explicit listeners/subjects to both campaign paths; do not fork an independent cutscene engine. |
| `js/core/campaign.js`, `js/core/campaign2.js`, `js/core/quests.js`, `js/ui/scene_quest.js` | Quests advance through encounter lists. Departure and final openers have once-only flags; rival loss is a scripted sequence. Encounters also support noncombat resolution verbs. | New scenes need defined insertion points and completion flags. Account for companion absence, noncombat success, abandonment, and failure before praising a particular action. |
| `js/ui/scene_combat.js` | Combat presentation sequences dialogue and effects. Revive remarks use `showText` with a short timeout; that branch does not start a voice clip. | Voicing revive exchanges is additional work. Use the combat presentation queue and actual event participants, with a shorter frequency budget than town conversations. |
| `js/ui/music.js`, `tools/gen_voices.py`, `tools/voice_casting.json` | Personality clips use personality/band/index paths and a casting table. Campaign clips use character/beat/index paths. One voice channel stops the previous clip. The generator explicitly enumerates four bands and skips existing files. | Extend generation for response categories; serialize speakers; replace changed recordings intentionally rather than relying on a rerun to overwrite them. |
| `js/core/save.js` | Characters are saved as objects; world fields are explicitly selected. | Save player identity, conversation memory, and consumed scene flags deliberately. Supply safe defaults for old saves. Do not assume arbitrary new world fields persist automatically. |

This is a source review, not a browser playthrough or a completed audit of every combat mechanic. Any approved encounter redesign still requires a focused review and browser verification of that encounter.

## Revised conversation design

**One character, one personality, one actor.** Ordinary characters, including the newly voiced player, use their assigned personality's existing casting ID for every opening and response. Named campaign characters retain their named casting. A response category never supplies a different actor. Some personalities share an actor today; that does not mean an individual character needs multiple actors.

There is a real exception in the current code: `Character.voiceTagFor` selects god/demigod/matriarch voice directories, and playback falls back to a normal personality clip when an override clip is missing. To meet the user's consistency rule, the proposed revision removes status-based actor changes from ordinary personality dialogue and uses its assigned casting throughout. Existing named gods retain their named voices. No audio is being removed or regenerated at this proposal stage; the eventual change list must include affected special-status dialogue as well as new responses. Hiro remains outside this writing pass.

**Relationship and emotion are separate.** Keep the existing `general`, `friendly`, `hatred`, and `romantic` relationship bands. A friendly character can be frightened or grieving. Scene context determines what is appropriate; performance tags determine delivery. A friendly band is not a command to sound cheerful.

**Opening plus compatible reply.** Add `general_response`, `friendly_response`, `hatred_response`, and `romantic_response`, each owned by the responding personality. Each opening identifies a purpose or compatibility family, such as preparation concern, thanks, invitation, or distrust. Each reply explicitly accepts one or more families. Select the opening using A's relationship toward B and the reply using B's relationship toward A. They need not share the same band. An affectionate remark must not automatically produce reciprocation from someone who dislikes the speaker.

**Bounded exchanges.** Default to an opening and one reply. No reply-to-reply loop. Named campaign scenes can use a fixed longer sequence. A compatible response may be omitted if nobody appropriate is present. Never substitute another personality's words or actor to fill a gap. Every line must stand alone when a reply is unavailable.

**Participants.** An exchange records speaker, living addressee (if any), audience, and subject as distinct identities. It also records scene/event context and the opening being answered. Resolve characters by identity, not first-name matching. A group remark chooses at most one eligible respondent, often the actual leader; a comment addressed to the dead never selects them as respondent. A funeral reply between survivors uses their relationship to each other while respecting each survivor's relationship to the deceased.

**Player participation.** Add a personality selection with its associated voice preview at ordinary character creation, using the existing sex-tagged casting pools initially. Explain that it controls automatic remarks. Lock it for that character, persist it, and do not let automatic remarks accept contracts, spend gold, initiate romance, or forgive betrayal. Existing unvoiced saves need a one-time personality selection before player speech is enabled; an heir keeps their already assigned personality. Reincarnation into a new character can choose anew.

**Authored compatibility, not random agreement.** Four replies per band per personality would add 960 clips to the current 960 ordinary personality lines. That is a starting budget, not a guaranteed full coverage count. Funeral lines, event-specific lines, and extra campaign beats add to it. First prove a small set of compatible exchanges across contrasting personalities, then build a coverage manifest before full recording. Existing rewritten openings also need new recordings.

## Implementation and validation after approval

1. Build explicit participant context and an exchange selector; add the player personality choice and save migration.
2. Prove the script samples with the existing portrait/dialogue presentation and voice channel. Check the same opening against friendly, indifferent, and hostile respondents, including asymmetric relationships.
3. Add dedicated funeral context, event priority, and limited repetition. Reuse existing relationship causes and shared-quest records where reliable; add only the memory facts the writing needs.
4. Adapt fixed campaign scenes and any approved encounter changes. Preserve existing recruitment decisions and Antler's branch. Specify objectives, resolution routes, skill-learning opportunities, reward consequences, and failure behavior for each changed quest.
5. Verify absent/dead speakers, party-leader recipients, unresolved references, old saves, heir transitions, skipping, scene restart, mute, and missing audio. Keep combat timing and scene callbacks from advancing twice.
6. Generate approved changed clips using a manifest of text, speaker casting, output path, and content hash. Update the hard-coded voice bands, coverage checks, expression tags if needed, and browser cache versions. Check displayed and spoken forms separately.

## Review question

Do the automatic exchanges in `DIALOGUE_SCRIPT_SAMPLES.md` match the tone you want? Approval of the writing can be separate from approval of the listed system and quest changes. No selectable player dialogue is required by this revision.
