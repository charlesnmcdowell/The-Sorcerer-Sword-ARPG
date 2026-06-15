# Apply the staged site build to the live repo

The full dark-fantasy redesign (all 10 of your 2026-06-15 requirements) is built
and verified here in `STAGED_FOR_CANONICAL/`. The Cowork task cannot reach
`Documents\Neverendingnarratives`, so it cannot copy these in for you. Pick ONE:

## Option A - one click (easiest)
Double-click **APPLY_TO_CANONICAL.bat** in this folder. It will:
1. back up your current `Neverendingnarratives\index.html` (timestamped `.bak-...`),
2. copy this `index.html` over it,
3. copy `assets\` (forest-bg.jpg, og-image.png, cashapp-qr.png) in.
Then open the page in a browser to review and `git push` to deploy.

## Option B - let Cowork do it next run
In Cowork, add `C:\Users\charl\OneDrive\Documents\Neverendingnarratives` as a
connected folder, then re-run the marketing task. It will write the redesign into
canonical `index.html` in place and re-verify.

## Option C - manual copy
Copy `index.html` + the whole `assets\` folder from here into
`C:\Users\charl\OneDrive\Documents\Neverendingnarratives\`, overwriting.

## What's in the build
- Studio-for-hire / Services / Pricing / Process content removed
- $10 CashApp audiobook bundle (manual flow: pay -> email neverendingnarratives@gmail.com)
- CashApp $hiiroprotagonist36 link + 423-704-8922 text + scannable QR (assets/cashapp-qr.png)
- Honest donation goal bar (manual `data-raised` on #fund-bar; $1,000 -> $5,000 goals)
- Dark forest background + dark-fantasy gothic/serif theme
- YouTube channel + video embed kept (shown exactly once)
- Only CashApp money links; no Ko-fi/Gumroad/Payhip/Amazon placeholder links

## Still pending from you (non-blocking)
- Confirm the two audiobook files exist + where they live (to email bundle buyers)
- Book 2 title (currently "Coming Soon", no dead link)
- A real Amazon/Kindle URL (no link shown until you provide one)
- Update `data-raised` on #fund-bar after each CashApp payout
