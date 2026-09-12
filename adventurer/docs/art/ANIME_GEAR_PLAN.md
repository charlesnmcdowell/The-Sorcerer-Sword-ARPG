# Anime equipment implementation

All 24 current equipment sets have male and female illustration coverage. The renderer reads equippedSet and keeps identity separate.

| Set | Acquisition | Female frame | Male frame |
|---|---|---|---|
| Warrior Set | blacksmith | wardrobe_f1 / 0 | wardrobe_m1 / 0 |
| Ranger Set | blacksmith | wardrobe_f1 / 1 | wardrobe_m1 / 1 |
| Mage Set | blacksmith | wardrobe_f1 / 2 | wardrobe_m1 / 2 |
| Healer Set | blacksmith | wardrobe_f1 / 3 | wardrobe_m1 / 3 |
| Plate Harness | blacksmith | wardrobe_f2 / 0 | wardrobe_m2 / 0 |
| Duelist's Kit | blacksmith | wardrobe_f2 / 1 | wardrobe_m2 / 1 |
| Night Leathers | blacksmith | wardrobe_f2 / 2 | wardrobe_m2 / 2 |
| Adept Robes | blacksmith | wardrobe_f2 / 3 | wardrobe_m2 / 3 |
| Wildhide | blacksmith | wardrobe_f3 / 0 | wardrobe_m3 / 0 |
| Hunter's Rig | blacksmith | wardrobe_f3 / 1 | wardrobe_m3 / 1 |
| Street Steel | blacksmith | wardrobe_f3 / 2 | wardrobe_m3 / 2 |
| Oath Plate | blacksmith | wardrobe_f3 / 3 | wardrobe_m3 / 3 |
| Chantry Robes | blacksmith | wardrobe_f4 / 0 | wardrobe_m4 / 0 |
| Greenward Kit | blacksmith | wardrobe_f4 / 1 | wardrobe_m4 / 1 |
| Shadowweave | blacksmith | wardrobe_f4 / 2 | wardrobe_m4 / 2 |
| Ronin Gear | unique | wardrobe_f4 / 3 | wardrobe_m4 / 3 |
| Assassin's Gear | faction | wardrobe_f5 / 0 | wardrobe_m5 / 0 |
| Mercenary's Gear | faction | wardrobe_f5 / 1 | wardrobe_m5 / 1 |
| Battle Mage's Gear | faction | wardrobe_f5 / 2 | wardrobe_m5 / 2 |
| Shinobi Gear | faction | wardrobe_f5 / 3 | wardrobe_m5 / 3 |
| Green-Eyed Armour | faction | wardrobe_f6 / 0 | wardrobe_m6 / 0 |
| Privateer's Kit | faction | wardrobe_f6 / 1 | wardrobe_m6 / 1 |
| King's Uniform | faction | wardrobe_f6 / 2 | wardrobe_m6 / 2 |
| Warden's Gear | faction | wardrobe_gate / 0 | wardrobe_gate / 1 |

## Composition and persistence

Adult female and male torsos are authored separately. Three modest width variations reuse each fitted torso; these are image compositions, not skeletal meshes. Authored head/face landmarks remain fixed across outfits. The current gear determines the torso, collar, mask, helmet and motion stiffness. Ordinary clothing fills the unequipped appearance. Reserved story heads and accessories remain stable; explicit equipment overrides their default torso. Warden’s Gear uses a dedicated shared atlas, which also contains Korvath’s black plate and Bramm’s default ranger outfit.

Masks suppress mouth animation and covered brows. Closed plate helmets suppress eyes as well. Hats suppress the covered upper hair region. Beards and selected long facial hair can overlap collars. Skin recoloring is constrained to exposed body regions. Children use separate modest portraits without the adult torso rig.

Party purchases, inheritance, grants and sales continue using the existing game systems. The portrait key includes identity, equipment, form and relevant visual state. Transforming never replaces equippedSet; reversion requests the current outfit. Appearance choices serialize with the character, while personality and voice remain independent.

## Verification and scope

The coverage check renders both variants of every set, verifies every named actor and enemy family, and exercises form reversion. Gameplay checks buy gear for a party member and confirm the same face before/after the purchase and after save/reload. Separate checks cover the new-save gate and preview isolation.

See ANIME_ART_UPDATE.md for the full release changes and ANIME_ART_INVENTORY.json for the current mappings. The old preview wardrobe studies remain in assets/anime/v1; production mappings are in assets/anime/v2 and anime_world.js.
