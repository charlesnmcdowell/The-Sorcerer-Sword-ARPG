# Adventurer — revised dialogue samples

Approved design samples, September 9, 2026. Companion to `DIALOGUE_REVIEW_PROPOSAL.md`. These preserve the design discussion; the implemented writing, including the user's profanity clarification, is now exported in `ADVENTURER_SCRIPT_REVISED.md`. See `DIALOGUE_IMPLEMENTATION_REVIEW.md` for actual changes and validation.

No dialogue choices are used below. Player speech only becomes possible after adding the proposed personality selection and automatic response system. Scene directions are proposed captions, portrait staging, or gameplay events; they are not spoken by a new narrator. Each clip belongs to its speaker's existing actor.

## 1. Departure: concern and a practical answer

**Situation:** A living party prepares to depart. Speaker A is Nervous (M16). The addressee is the actual living party leader, Blunt (M15), who may be the player only if the player chose that personality and leads this party. No relationship of trust is assumed.

**Opening family:** preparation concern. **Reply family:** practical reassurance. Both use their relationship toward the other character. This example assumes both are in the general band.

> **Nervous → leader:** [nervously] I've checked my pack three times. I still feel like I've forgotten something.
>
> **Blunt → Nervous:** [calm] Check your weapon. We can share the rest.

**Alternative respondent, a Brash (M02) leader:**

> **Brash → Nervous:** [calm] We'll check it together. Better here than halfway down the road.

These alternatives are selected by the leader's actual personality. They are not successive lines or interchangeable voice performances for the same person. If no eligible leader can answer, the opening ends naturally on its own.

**Why it fits:** Nervous expresses uncertainty without becoming helpless. The reply answers the actual concern. Neither character pretends a specific past incident occurred.

## 2. After a fight: gratitude that was earned

**Situation:** The player actually revived a living Wrathful (M04) companion in the preceding encounter. At a safe transition afterward, the companion addresses the player. This particular example requires a friendly relationship and a player who chose Wry (F11). Play once for the recorded event.

**Opening family:** thanks for revival. **Reply family:** acknowledge thanks. Proposed event-specific content in the friendly bands.

> **Wrathful → player:** [quietly] Thanks for getting me up. I couldn't see who was still standing.
>
> **Player, Wry → Wrathful:** [playfully] You can thank me by helping with the next one. I was getting rather busy.

**If the player has Sincere (F19), use this response instead:**

> **Player, Sincere → Wrathful:** [warmly] I'm glad you're still with us.

The player has one personality; only its version plays. If the player did not revive this NPC, none of this exchange is eligible. If another NPC did, that character becomes the recipient and potential respondent. The new dialogue does not trigger or award an extra revive.

## 3. Friendly invitation with an automatic player response

**Situation:** At a meal stop after shared work, a friendly Jovial (M10) companion addresses the player. The player chose Blunt (M15) and also regards the companion as friendly. This requires a meal context, not arbitrary town interaction.

**Opening family:** invitation to sit. **Reply family:** accept social company. This conveys companionship and performs no purchase or gameplay commitment.

> **Jovial → player:** [happily] There's room here. Come sit with me before someone starts talking business.
>
> **Player, Blunt → Jovial:** [calm] Gladly. I've heard enough about work today.

If the listener's relationship is hostile, this friendly reply is ineligible even though the opening was friendly. A compatible hostile response could be:

> **Blunt → Jovial:** [flatly] I'd rather sit elsewhere.

Do not automatically change the relationship score merely because an exchange occurred. Social actions and recorded game events remain the source of relationship changes unless a separate mechanic is approved.

## 4. Romance without an unearned declaration

**Situation:** Two established partners are preparing to leave together. A Dutiful (F28) partner addresses a Stoic (M01) partner. Either may be the player if those are their actual identities. Both must be living and part of this departure.

**Opening family:** shared departure. **Reply family:** acknowledge readiness. Romantic context does not create the relationship.

> **Dutiful → partner:** [warmly] I'm ready. Just wanted a moment with you before everyone starts calling for us.
>
> **Stoic → partner:** [softly] We've got a moment.

No assumptions about children, years together, or who owns a house are required. This is a brief private exchange, not a promise to take an unchosen quest.

## 5. Funeral: the deceased is the subject, not a respondent

**Situation:** An NPC party leader has died. A living Stoic (M01) mourner had a friendly relationship with the leader. Use the relationship snapshot already captured by the game before death cleanup. The player and other survivors are present.

*The existing portrait procession reaches the grave. The name of the deceased appears in the caption.*

> **Stoic → deceased:** [quietly] I trusted you to get us home. I'm sorry we couldn't do the same for you.

There is no answer to this line. Do not pull a friendly-response clip from the deceased or automatically respond as the player.

After a pause, a living Gentle (M14) mourner addresses Stoic. This consolation requires an appropriate relationship between those survivors; it is not based only on their feelings about the leader.

> **Gentle → Stoic:** [softly] I'll stay a while, if you want company.
>
> **Stoic → Gentle:** [quietly] I'd like that.

End the spoken portion, then complete the existing company-dissolution staging. Allow silence rather than requiring every survivor to make a speech.

**Alternative funeral line for a mourner who hated the leader:**

> **Stoic → gathered survivors; subject is the deceased:** [quietly] We didn't part on good terms. I'll leave the speaking to the rest of you.

This is funeral-specific hatred content. Ordinary threats, flirtation, job offers, and “come back alive” lines are ineligible. The portrait's expression should reflect the mourner's actual response; a hostile mourner need not look devastated.

## 6. Red Tally: Beau's introduction

**Trigger:** first successful faction contract, counting-house return. **Speakers:** Beau and Cask. **Audience:** player. Both keep their existing named campaign casting. No player personality is required.

*Beau is checking a boarding harness beside the ledger. Present the detail as a short caption with existing portraits; a new animated prop is optional, not assumed.*

> **Cask → player:** [calm] This is Beau. You'll be working together if you stay.
>
> **Beau → player:** [playfully] Best shot in the fleet. He leaves that out because he pays me the same either way.
>
> **Cask → Beau:** [flatly] That harness belongs to a deckhand. Stop charging him for repairs.
>
> **Beau → Cask:** [calm] I'm not charging him. Look at the buckle. It would've opened halfway across.
>
> **Cask → Beau:** [quietly] Leave it with me. I'll check the rest.
>
> **Beau → player:** [playfully] See? Can't spare me.

**Production:** six ordered turns using the shared campaign beat player. Beau uses casting `beau` throughout; Cask uses `hallow` throughout. Their roles and runtime IDs must not be inferred from their displayed names. No generic response follows the final line unless separately authored and compatible.

## 7. Red Tally: competence and the beginning of friendship

**Trigger:** contract three, Beau actually present. Retain his authored combat kit. Demonstrate competence through an actual action, not a compulsory hit disguised as combat.

Before an eligible shot at a living gunner:

> **Beau → party:** [calm] Gunner by the rail. I've got a shot.

Only after that shot actually removes the threat:

> **Beau → party:** [calm] That's the gunner down. Keep moving.

If the threat remains:

> **Beau → party:** [annoyed] Still standing. Watch that gun.

The rail setting needs a matching scene caption or background. A playable crossing objective would be a separate encounter change; these lines do not assume the game already has cover or traversal mechanics.

**After the shared contract, back at the counting house:**

> **Beau → player:** [calm] Cask's paying out. Come eat with me after.
>
> **Cask → Beau:** [flatly] Your tab first.
>
> **Beau → Cask:** [playfully] I was building up to that.
>
> **Beau → player:** [warmly] I'll save you a seat.

If Beau did not accompany the player, use a different return scene. No line asserts that the player saved him, outshot him, or held a formation unless that event was recorded.

## 8. Red Tally: grief and a reason to continue

**Proposed story setup:** contract four reveals a prepared naval trap. Beau contributes to the escape, and Kessler kills him. The specific action sequence must be reviewed against revival, companion exit protection, and quest resolution before implementation. Do not invent a new immunity solely to defeat a player ability.

**Return scene:** a caption establishes that Cask has heard the account. No voiced player testimony is assumed.

*Cask opens the ledger at Beau's entry. He leaves his pen on the desk.*

> **Cask → player:** [quietly] He got you off the ship.
>
> **Cask → player:** [sad] I kept telling him to bring someone back who could confirm his stories.

*Saint-Cloud enters. Cask closes the ledger.*

> **Saint-Cloud → Cask:** [quietly] Who's told the crew?
>
> **Cask → Saint-Cloud:** [calm] No one yet.
>
> **Saint-Cloud → Cask:** [quietly] I'll do it.
>
> **Cask → player:** [softly] You can stay here a while.

This scene is not eligible for the offscreen-death version: it explicitly describes Beau helping the player escape. That route needs its own account and lines. No cheerful response is allowed because a survivor happens to have the friendly band.

**Finale outcome, proposed:** break the immediate interception threat and get the endangered crews home. Explain those stakes before the final quest; defeating Kessler does not erase the empire.

> **Saint-Cloud → player:** [calm] The ships are clear of the channel. We can bring the crews home.
>
> **Saint-Cloud → player:** [quietly] When you're ready, I'd like you there when we say goodbye to Beau. You sailed with him. You have a place with the crew.

Return, farewell, then rewards. This is an authored campaign scene and does not dissolve the player's ordinary party through the NPC-leader funeral mechanic.

## Voice and scope notes

- Every automatic player line uses the selected personality's existing voice ID. No narrator or other personality reads it.
- Every campaign speaker keeps their named actor across all turns, including when answering another NPC.
- Display labels can identify recipients without putting variable names into audio. Write separate name-free spoken forms where needed; pronouns must remain grammatical and unambiguous.
- Performance cues use existing tags. They affect delivery and expressions, never casting.
- This is a representative sample set. It is not the complete additional 960-line response library or a complete seven-faction rewrite.
- The matching proposal lists required engine, scene, saving, voice-generation, and test changes. None has been implemented yet.
