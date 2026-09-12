# NPC lifecycle and party leadership update

## Diagnostic and fixes

NPCs are having children and those children are joining the adult population. Three seeded, 35-quest simulations observed **73, 136, and 99 births**, with **66, 114, and 93 NPCs maturing** respectively. These are test worlds, not measurements of your current save.

Fixed these problems:

- Young children counted twice against the child limit. Each child now counts once.
- Children could age twice when moving into the orphan list. They now age once per quest and mature after the configured **three quests**.
- Ordinary children received random skills. They now inherit their parents' equipped, non-unique skills and learned levels, with a birth snapshot and an update at maturation. Equipped skills respect the child's caps; remaining inherited knowledge stays recorded. The avenger and player-nepotism paths remain supported.
- A father's dependent children could be missed because they live on the mother's record. Estate lookup now checks both parents and the orphan list.
- A second pending estate could overwrite the first. Pending estates now accumulate.
- Recoverable worn and stored gear could disappear on death. With no living killer, it passes to the eligible eldest heir; young heirs receive it at maturity. Adult NPC heirs equip the best matching inherited set, preserving other sets. Issued outfits are protected from replacement.
- A killer who already wore armor could lose the victim's set. Looted sets now remain in the killer's owned gear. Existing killer-loot priority is preserved.

These changes apply going forward. They cannot recover gear already deleted by past deaths.

## Outfit your party

Open **Create Party / Your Party → Outfit [member]** while you are the leader.

- Buy a set with your carried gold, or equip a set the member already owns for free.
- The screen shows their worn set and which skills match each option; tooltips explain the gear benefits.
- Replaced sets remain in the member's owned gear. Gifts remain theirs if they leave, and can enter their estate later.
- The member's own gold and wage are unchanged.
- Bound followers can also be outfitted, with a reminder that they are temporary.
- Purchases recheck leadership, membership, availability, and funds. No faction or unique gear is sold through this screen.

## Six-quest naval reminder

Added three voiced sections, eligible after six played quests if the player has never founded a party and does not currently lead one. Seen sections and founding history persist through saves and reincarnation in the same playthrough. Existing saves already leading a party are exempt. Old, disbanded parties were not historically recorded, so that history cannot always be inferred.

The reminder includes the follower/loyal-employee joke and “nut up” line, leadership profits after payroll, outfitting companions, improved chances on god-tier and faction quests, and Conscription or Necromancy as alternatives to voluntary recruits. It accurately notes that conscripts expire, thralls last for the contract, and forbidden arts have consequences.

The existing naval actor voices all three sections. **510 ElevenLabs credits used; 182,262 remaining.**

## Verification

- Six existing family, legacy, NPC-world, and party regression suites passed: **194 assertions**.
- New checks passed for parental skill levels, father-to-dependent inheritance, recovered gear, exact three-quest maturation, leader-only purchases, owned-set switching, gifts after departure, save persistence, and reminder eligibility.
- Browser verification clicked the actual outfit purchase button, confirmed an 800g purchase equipped the companion and reduced only the leader's purse, and decoded all three new recordings. No JavaScript errors.
- Detailed results and the equipment-screen screenshot are in `tools/lifecycle_update/`.

Reload the game to pick up the update. No new game is required.
