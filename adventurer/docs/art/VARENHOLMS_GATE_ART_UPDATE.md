# Varenholm’s Gate — campaign art update

Implemented in the local full game on September 11, 2026.

The subsequent [art, weather and animation audit](VARENHOLMS_GATE_ART_AUDIT.md) records continuity fixes, additional verification and the archive of superseded assets.

[Open the campaign art viewer](http://127.0.0.1:8734/index.html?gateArtPreview=1). The viewer uses the production renderer and does not modify saves, campaign progress, or character IDs. Its **Story scenes** collection includes spoilers.

## Changes for review

| Area | Delivered |
|---|---|
| Named cast | 47 distinct anime portraits, with an additional helmeted Kolade head |
| Companions | 15 signature costumes; three-outfit comparisons in the art viewer; existing expressions, breathing and equipment rendering |
| Character continuity | Sanni’s concealed face and imposing build; Kolade’s helmet/reveal states; Amara’s armoured and dockside outfits; consistent Tesfaye portrait; Bahadır’s hamster Fındık |
| Enemies | 24 illustrated enemy types, retaining the existing three named/tinted variants per type |
| Mini-bosses | 19 visual definitions; named Femi and Nib use their cast identities |
| Battle and story locations | 32 fixed compositions covering the brief’s 21 location groups and 11 additional important rooms or encounters |
| Travel | 21 scrolling panoramas; all are assigned to campaign journeys |
| Story illustrations | 16 scenes, including the death, bounty, three dreams, valve, letter, reveal, frost escape, altar variants and five endings |
| Chapter openings | Eight illustrated cards: Prologue and Chapters 1–7 |
| Campaign UI | Story banner, illustrated choice frame, five heritage emblems and ending backgrounds |
| Warden equipment | Male and female fighter, rogue and healer clothing layers, selected by character role |

### Cast and equipment

The cast uses the brief’s regional clothing references, varied skin tones, hair, facial hair and facial proportions. Adult women have defined covered silhouettes; armour, cloth and dresses retain their distinct materials. Named faces remain stable when a costume changes. Existing eye, mouth and expression animation stays active, with mask and helmet occlusion.

The portraits combine authored head and clothing layers. Collar alignment and skin matching are handled when a portrait is assembled. Enemy and equipment sheets are separated into clean individual sprites before packing, preventing boots, weapons or fabric from neighboring cells appearing on another character.

The art viewer shows each companion in their signature costume, Warden field kit and a role-appropriate alternate from the existing wardrobe. This is an art comparison, not a change to equipment prices, stats or ownership. Druid transformations continue to use the game’s existing illustrated beast forms and restore the character’s equipment when they change back.

### Travel and motion

Journeys scroll sideways behind the travelling portraits. Painted water strips ripple and selected flags, awnings and banners sway. Outdoor scenes include moving birds and drifting atmosphere; lanterns flicker and selected town chimneys emit smoke. Forests carry leaves, and underground scenes use dust or mist where appropriate.

Weather and the existing celestial effects remain active outdoors. Rain stops when a journey enters an interior. The prologue uses night lighting, and the inn, dockside and Nine Lanterns paintings receive lighting that fits their illustrated time of day. The viewer also offers day, evening and night controls with clear, rain, storm and snow weather.

Two journeys cross between illustrations during the existing travel scene: Thornbury → Holloway Vale, and Serpent’s Span → the sewers. Battles keep their fixed camera composition.

New campaign journey art uses its own viewing-history keys. First showings remain unskippable, second showings can be skipped, and subsequent showings bypass the scene. History stays in the existing lifetime metadata. Reduced-motion settings freeze panorama motion.

### Story presentation

Illustrations are selected from the current quest, encounter and dialogue beat. They remain behind their dialogue and choices, then release their resources when the scene ends. The altar scene accounts for Amara’s presence. Chapter cards are remembered in campaign progress; each ending selects its own illustration.

Cinematics use illustrated scenes with slow camera movement and atmospheric effect layers. The portraits provide facial expression and idle animation. No new dialogue, voice clips, combat rules, quest rewards or story outcomes were authored in this art pass.

The company list now scrolls when the roster is large, keeping heritage and allegiance information visible. Epilogue text now sits above its illustration and supports scrolling while the ending overlay is open.

## Locations

The 21 main groups are Lanternhold, Griffon Road, Shore Road, Open Hand Inn, Thornbury, river crossing, Dunmere, Dunmere Mines, Holloway Vale, bandit camp, Mirkhollow, Iron Mine, Serpent’s Span, Gate sewers, Nine Lanterns, Ducal Palace, Consortium Tower, Lanternhold catacombs, hunted city, Undercity and Temple of Morrak.

Additional paintings cover the gnoll fortress, Grukhar’s black altar, druid grove, wyvern cliffs, valve room, Olamide’s study, Adebayo’s sick-room, Undervault, hall of mirrors, counting room and Folake’s floor. All 54 campaign encounter positions have explicit background assignments.

## Files and asset budget

- `assets/anime/gate/v1/runtime/`: 110 WebP files, approximately 32.8 MiB total. Scene paintings load as needed; the complete scenery collection is not loaded at startup.
- `assets/anime/gate/v1/source/`: 75 accepted source sheets, with original generated outputs preserved separately.
- `assets/anime/gate/v1/generation.json`: saved prompts, original output paths, three character-continuity edits and export details. One source record was recovered by matching the original image’s SHA-256 to the saved atlas.
- `js/ui/gate_art.js`: cast, equipment, encounter and journey mapping.
- `js/ui/gate_cinema.js`: story scenes, chapter cards, campaign UI art and resource cleanup.
- `js/ui/scene_gate_preview.js`: isolated art viewer.
- `tools/gate_art/`: inventory, export, sprite packing and browser verification scripts.

No ElevenLabs requests were made for this art pass. No save wipe or migration was added.

## Verification

- WebGL and Canvas: all 47 cast portraits, 60 companion/equipment combinations, 24 enemy types, 54 encounter routes, 32 backgrounds, 21 panoramas and 16 story illustrations loaded without missing assets or browser errors.
- WebGL and Canvas: chapter continuation, dialogue choices, identity reveal, Amara’s alternate appearance and all five endings passed; epilogue text visibility and scrolling were checked.
- WebGL and Canvas: the two-scene bridge/sewer journey, weather cleanup, first/second/third showing rules, reduced motion and resource release passed.
- Viewer: all eight collections are available; saves and character IDs remain unchanged.
- Campaign simulation: 155 checks passed across hero, monster and mercy paths.
- Dialogue inventory: 4,540 checks passed across 667 lines and 58 choices.
- Travel costs, history, succession, reward preservation and destination coverage passed.
- Save recovery and appearance tests passed; 338 combat-presentation checks passed.

Browser screenshots and machine-readable results are in `tools/gate_art/`.
