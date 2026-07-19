---
name: sorcerer-sword-art-pipeline
description: Governs how enemy combat art and hit-reaction animations get created, verified, and scaled for the Sorcerer-Sword ARPG (Phaser 3 game, ported from Nobody: The Pit of Karridge). Use this skill any time you are generating, editing, implementing, or scaling enemy sprite sheets, hurt/hit-reaction animations, summon-tied ability effects (Hex Bolt/Claw Demon, Dash/Succubus, Portal/Dragon), or combat animation timing for this game. Also use it whenever the user asks to enable/disable enemies for testing, add a new enemy's combat animations, or discusses "reference art," "golden reference," or "greenlighting" sprites in this project. ALWAYS check this skill before generating any enemy hit-reaction or summon-cameo art or before writing code that wires a new animation trigger — do not generate combat art or animation code for this game without consulting it first, even if the request seems small.
---

# Sorcerer-Sword Art & Combat Animation Pipeline

## Why this exists

Early production let AI generate whole enemies/animations end-to-end from
prompts. Result: janky sprites, disjointed rig-based animation (parts
floating instead of reading as one figure), combat that didn't feel fluid.

New model: **a human creates one golden-reference animation per
enemy+ability combo. AI only scales off a reference that a human has
already made and greenlit. AI never invents the first instance of anything.**

This skill exists to enforce that rule automatically, without the user
needing to re-explain it every session.

## Core rule — check before you generate

Before generating, editing, or implementing ANY enemy hit-reaction sprite
sheet or summon-cameo animation, ask: **does a greenlit human-made
reference already exist for this exact enemy+ability combo, or a close
analog?**

- **No reference exists anywhere (first time this combo is being built):**
  STOP. Do not generate the art yourself. Tell the user you need reference
  art, using language like:
  > "I don't have a greenlit reference sheet for [enemy]'s '[ability]' hurt
  > animation. I need reference art for this action before I can build or
  > scale it. Can you create the first version?"
  Then wait. Do not attempt a placeholder or a "best guess" version.
- **A close greenlit reference exists** (e.g. Enemy 1's hex/claw-demon combo
  is already greenlit, now building Enemy 2's version of the same combo):
  you MAY use it as a direct style/structure anchor and generate a scaled
  variant. Flag it clearly as unreviewed/scaled output, not final.
- **Nothing you generate off a reference is automatically final.** All
  scaled output still requires human playtest verification in-game before
  it's considered greenlit and safe to use as a reference for further
  scaling.
- **If scaled quality isn't holding up** even against a good reference (this
  is a known, expected failure mode — referencing accurately while staying
  creative and high-quality isn't guaranteed), don't keep regenerating
  blindly. Tell the user this case likely needs a fresh human reference
  instead.

## Mandatory communication rule

Every single time this skill acts on an art/animation request, it must
explicitly tell the human, in plain non-technical language, one of these
two things — no exceptions, even if the answer seems obvious:

1. **A reference was found and used:** name exactly which sprite sheet/combo
   it's using as the reference. Example phrasing:
   > "I found [Enemy]'s '[ability]' hurt animation already greenlit, so I'm
   > using that as the reference to build this one."
2. **No usable reference was found:** say so plainly and stop, per the Core
   Rule above. Example phrasing:
   > "I looked for a reference for [enemy]'s '[ability]' hurt animation and
   > didn't find one that's been greenlit yet. I need a human to create the
   > first version before I can build this."

**Why this is mandatory, not optional:** the person doing this work may not
know how this pipeline runs in the background — treat them like a new hire
who has no visibility into the AI's process. This confirmation is also how
the user checks that this skill is actually being followed, so it must
appear every time, not just when something goes wrong. Never silently use a
reference, and never silently generate something without one.

## The greenlight loop

1. Human creates the reference art (golden reference) for a new
   enemy+ability combo, drops it wherever the project's reference art lives.
2. AI implements the sprite into the game per the trigger/timing rules
   below.
3. Human plays the game and verifies it looks/feels right.
4. Once verified, it's greenlit — usable as the reference for that exact
   combo going forward, and as a scaling anchor for other enemies with a
   similar combo.

## No standalone summon sprites — ever

Summons (Claw Demon, Succubus, Dragon, and any future ones) never get their
own independent sprite sheet or on-screen entity. They only ever exist as a
few embedded frames inside sheets that already need to exist:

1. **The ability's own cast/projectile sheet** — summon cameos briefly at
   cast time (e.g. bursts from a portal, does a beat of acrobatics), then
   exits frame (e.g. hops into another portal) *before* the projectile
   reaches the target. It must be out of frame during travel time.
2. **The target enemy's own "hurt by [ability]" sheet** — the summon
   reappears here (e.g. bursts from a portal next to the enemy) to perform
   the finishing move, as embedded frames within the enemy's own custom
   hurt animation for that specific ability.

Never render a summon as an independent persistent entity. It only exists
mid-action, fully controlled, for a couple seconds max, split across those
two sheets. Damage calculation is untouched by any of this — it's a purely
visual/cosmetic layer on top of standard hit logic.

### Current ability-to-effect mapping

| Ability | Cast sheet cameo | Projectile | Enemy hurt-sheet finisher |
|---|---|---|---|
| Hex Bolt | Claw Demon bursts from portal near origin, acrobatics, exits via portal | Hex bolt travels alone | Claw Demon bursts from portal next to enemy, impales/holds aloft, blood, drops to ground |
| Dash | Succubus bursts out mid-dash, flaps wings, fires fireball, disappears | Fireball travels alone | Enemy catches fire, Succubus bursts from portal, savage claw finisher, enemy returns to normal |
| Portal/Teleport | Dragon appears briefly at cast | Dragon travels to/attacks enemy, disappears | Enemy bitten, lifted, slammed to ground |

Each hurt-sheet finisher is a dramatic "fatality-style" hit reaction — it
does NOT mean the enemy has died. It's a hit marker only.

## Frame budget — chained sprite sheets

Sprite sheets have real size/frame limits. If an animation needs more
length than one sheet holds (e.g. needs 8 seconds, sheet budgets 4), split
across two+ sheets and chain them programmatically:
- Sheet A plays on the trigger condition.
- After a defined time offset, sheet B plays immediately after.
- These pairs are tightly coupled by design — one should never play
  without the other, so no fallback state is needed for the coupling
  itself.
- Known unresolved risk: timing drift (lag, hitches) desyncing the handoff.
  Flag as a testing concern if/when it's observed — not a blocker to
  implementing this pattern now.

## Rollout discipline

Work happens one enemy at a time, not in parallel:
1. Only one enemy should be enabled at a time during active iteration —
   if asked to work on combat feel, check whether other enemies need to be
   disabled first so testing stays isolated.
2. Iterate on that enemy's animations using the loop above until combat
   feels fluid and looks right.
3. Move to the next enemy, scaling off whatever greenlit references now
   exist where the combo matches.
4. Continue enemy-by-enemy.

## What NOT to do

- Don't generate a "good enough" placeholder hurt animation when no
  reference exists — stop and ask instead.
- Don't rig body parts onto a skeleton/bones system per-enemy from scratch
  (DragonBones-style piece rigging) — this was already tried and produced
  low-quality floating-parts results. The reference-sheet + chained-sheet
  approach above is the replacement, not an addition to it.
- Don't give summons their own sprite sheet or let them idle/linger on
  screen outside of a triggered cast or hurt animation.
- Don't treat AI-scaled art as greenlit without human playtest
  verification, even if it looks fine to you.
