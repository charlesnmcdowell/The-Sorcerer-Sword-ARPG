# 11 — Recommended Features (best-practice, NOT currently planned)

These are **recommendations**, not author requests. They're drawn from what high-performing single-player, browser-based ARPGs and incremental/action games tend to do well. Each lists the payoff and a rough effort. Treat this as a backlog to pull from — prioritize against the publish/funding goals first.

## Retention & feel (highest leverage for a browser demo)
1. **Onboarding tutorial prompts** *(low effort)* — the first fight already teaches by doing, but add 2–3 dismissable control hints (move / attack / parry) for brand-new players. Browser players bounce fast without them.
2. **Juicier hit feedback toggle** *(low)* — screenshake/hitstop already exist; expose an "effects intensity" slider (accessibility + lets streamers tune it). Don't touch the combat numbers — only the FX.
3. **Damage numbers + a small combat log** *(low)* — many players want to see the math; a toggle in settings.
4. **Run summary / score screen** *(medium)* — at each ending, show kills, time, nickname, hunts completed, gold — shareable. Drives "one more run" and social sharing.

## Reach & funnel (matters most for marketing/Kickstarter)
5. **Shareable result card / screenshot** *(medium)* — a generated image at the ending ("I cleared the Pit as THE HEADSMAN") with the game URL + book links baked in. Turns players into a funnel to the books/podcast.
6. **itch.io build** *(low)* — package the `play/` folder as an itch.io HTML game. Free organic discovery that a custom domain won't get. (Already noted in the marketing plan.)
7. **Analytics (privacy-light)** *(low)* — a single privacy-respecting counter (e.g. how many reach the city, finish a campaign, click the book link). You can't improve a funnel you can't measure. Disclose it.
8. **Open Graph / social meta tags** *(trivial)* — title, description, preview image on the `/play/` page so shared links look good on X/Discord/Facebook.

## Polish & accessibility
9. **Pause menu** *(low)* — explicit pause (Esc) with resume/settings/quit-to-title. Expected baseline.
10. **Remappable keys + a "left-handed"/control-scheme option** *(medium)*.
11. **Colorblind-safe palette check** *(low)* — verify the red/green telegraphs (parry/poison) are distinguishable; add shape cues if not.
12. **Reduced-motion option** *(low)* — dampen screenshake/flash for motion-sensitive players; pairs with #2.
13. **Loading/asset progress + a graceful "your browser is unsupported" message** *(low)*.

## Depth (only if the game grows past a demo)
14. **Difficulty modes** *(medium)* — a "story" and a "brutal" mode via the existing `fieldScaling` lever + enemy density, without touching kits.
15. **New Game+ / endless arena** *(medium)* — the guild hunts are already endless; an endless Pit with a leaderboard would extend playtime cheaply.
16. **Achievements** *(medium)* — cheap retention; tie a few to reaching each ending and to book/podcast clicks.
17. **Cloud save / save export-import** *(medium)* — localStorage is device-bound; a copy-paste save string or simple cloud sync helps returning players.

## Engineering hygiene (protects future-you)
18. **CI that runs the test chain on push** *(medium)* — a GitHub Action running `node tests/*` so a bad commit can't reach the live site. Complements the local pre-commit hooks.
19. **Asset-license register** *(trivial but important)* — a doc listing every art/music/voice pack, its license, and proof of commercial rights. Do this before any monetization.
20. **Error telemetry** *(medium)* — the debug error panel in `08-error-log.md`, optionally with an opt-in "send report" so real player crashes reach you.

## Prioritization suggestion
For the **funding demo** specifically, the cheapest high-impact set is: **#1 (onboarding), #5 (shareable card), #6 (itch.io), #8 (OG tags), #9 (pause)** — they directly raise conversion and shareability without risking the combat that's already tuned. Everything else is post-funding.
