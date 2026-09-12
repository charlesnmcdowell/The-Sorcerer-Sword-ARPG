# Adventurer — anime cel-shaded art overhaul

## Task

Overhaul Adventurer's complete visual presentation into a cohesive anime fantasy aesthetic: characters, equipment, monsters, bosses, environments, travel, cutscenes, portraits, beast forms, combat effects, and supporting interface art.

Use Black Clover and That Time I Got Reincarnated as a Slime as broad references for expressive fantasy characters, adventurous atmosphere, readable action, rich environments, and strong color design. Create original designs appropriate to Adventurer's own factions, cast, gear, and world.

Deliver visibly better drawing, anatomy, costume design, material definition, perspective, lighting, and composition. A palette swap, thicker outlines, or a shader over the existing placeholder shapes is insufficient.

Start by inspecting the current project and rendering representative scenes. Produce a concrete inventory, style guide, technical plan, and a small playable visual sample for review before mass-producing assets. Continue implementation in approved stages. Keep a complete change list and preserve the user's other work.

## Verified starting point — recheck before implementation

The repository is `C:/Users/charl/The Sorcerer Sword ARPG/adventurer`.

- Locally bundled **Phaser 3.87**, loaded from `lib/phaser.min.js`.
- Plain JavaScript under the shared `ADV` namespace, loaded in order through `index.html`; no rendering framework migration is necessary.
- `Phaser.AUTO`, with a **1280×760** logical layout defined by `ADV.T`, `Phaser.Scale.FIT`, and centered scaling.
- Existing scenes: Title, Creation, Town, Quest, Combat, and Death. Travel and funerals are staged through existing UI/cutscene modules.
- `js/ui/portraits.js`: deterministic procedural portraits, currently **220×280**, generated through Canvas textures and cached. Existing metadata anchors drive expressions, eyes, eyebrows, mouth animation, gaze, and other reactions. Equipment, faction, skin, identity, and progression participate in texture selection.
- `js/ui/battle_art.js` and `travel_battle_art.js`: **30 runtime battle-ground recipes** after extensions, with lighting variants.
- `js/ui/travel.js` and `js/data/travel.js`: **27 destination entries**, generated scrolling layers, party staging, weather, and cleanup.
- `js/ui/home_art.js`: six housing environments, from sleeping rough to castle, with time-of-day treatment.
- `js/ui/cutscenes.js`: funeral, return journey, and character staging.
- `js/ui/combat_presentation.js`, `vfx.js`, and `weather.js`: combat choreography, particles, environmental motion, and presentation effects.
- Current data contains **23 regular enemy definitions, 35 bosses, 38 campaign enemy definitions, and 23 gear sets**. These are definition counts, not a final asset count: shared rigs, named characters, alternate outfits, skins, body builds, expressions, and scenery variants require a separate inventory.
- Druid portrait forms include **werewolf, werebear, and panther**. Audit all additional transformation skills and their presentation.

Read the actual code rather than trusting old comments or assuming previous manifests are complete. Document any differences from this snapshot.

## Art direction

### Character drawing

Use clean, tapered linework; controlled two- or three-tone cel shading; designed shadow shapes; expressive anime eyes; coherent facial anatomy; purposeful hair clumps; and clear silhouettes. Highlights should describe a material, not appear as indiscriminate glossy spots. Keep a consistent light direction within each asset family.

Preserve diversity in face shape, skin tone, hair, build, and apparent adult age. Named characters must be immediately recognizable. Generated NPCs must retain a stable identity across scenes, saves, family progression, gear changes, and reincarnation rules. Do not generate a new unrelated face whenever an NPC is redrawn.

**Adult female characters:** make femininity visually intentional. Use clearly defined breasts/bust volume through silhouette, tailoring, fabric folds, and appropriate shading; shaped waistlines; varied feminine faces and hairstyles; and elegant, distinctive clothing. Include fitted armor, feminine cuirasses, tunics, coats, robes, skirts, and dresses suited to the faction and role. Bust sizes and builds should vary. Heavy armor should read as articulated armor fitted over a feminine body; dresses and cloth should drape convincingly. Attractive design and practical visual logic should coexist. Do not make every woman the same face, physique, or revealing costume. Children and dependent-child portraits retain age-appropriate designs.

**Adult male characters:** prioritize cool silhouettes, confident posture, striking faces, strong costume design, interesting hair, and readable class/faction identity. Allow lean swordsmen, broad defenders, elegant mages, dangerous rogues, rugged sailors, and other distinct builds rather than one generic muscular template.

### Equipment

Redesign every gear set and alternate outfit around its actual name, description, materials, faction, and mechanical role. Ninja masks and shinobi outfits need particularly strong visual identity. Samurai, pirate, naval, mage, clerical, druid, and armored designs must remain distinct.

Create fitted variants for supported body shapes. Do not stretch one finished torso texture across incompatible silhouettes. Standardize neck, shoulder, collar, waist, and hand attachment points before drawing the full wardrobe.

Keep equipment changes visible for players and NPCs, including gear bought by party leaders and inherited gear. Clothing changes must not change a character's face, skin tone, hair identity, or voice. Clearly distinguish face-covering masks from helmets and open-face headgear.

### Monsters and beast forms

Redraw every enemy family, boss, named antagonist, campaign enemy, and alternate skin. Give different creatures distinct anatomy and silhouettes, not simply different colors on the same body. Preserve recognizable tactical cues: armor, shield, weapon reach, casting focus, poison anatomy, undead condition, and faction equipment.

Werewolf, werebear, and panther forms need convincing muzzles, jaws, eyes, ears, fur groupings, neck mass, and shoulders. Their silhouettes must be distinguishable at combat size. Expressions need species-appropriate rigs; human brows or mouths must never float over an animal face.

### Backgrounds

Aim for backgrounds that feel like a carefully composed anime establishing shot. Use believable perspective and scale, layered terrain, architectural structure, material detail, vegetation, and evidence that people live and work there.

A port should have a coherent shoreline, piers, hulls, warehouses, ropes, loading areas, and reflected light. A city alley should have believable doors, drains, walls, windows, and access. Forests need varied trunks, canopy structure, undergrowth, ground cover, and paths. Interiors need coherent floors, walls, ceilings, entrances, furniture, and light sources.

Establish faction-specific architecture, ornament, banners, and props. Worldbuilding should come through the scenery. Avoid turning every faction into the same building with a different banner color.

Use richer painterly environment detail alongside crisp cel-shaded characters. Preserve quiet areas behind text and clear staging space for combatants. Review art both unobstructed and under the actual town panels, health bars, dialogue, and menus. Adjust panel treatment only where necessary for readability and appreciation of the scenery.

## Rendering strategy

Keep Phaser. Use a **hybrid illustrated-asset and modular 2D pipeline**:

1. Illustrated environment layers and prominent named-character designs provide the major visual improvement.
2. Modular heads, face features, hair, body silhouettes, and clothing preserve the procedural NPC population and equipment system.
3. Phaser sprites, texture atlases, lightweight overlays, particles, and tweens provide animation.
4. Revised procedural drawing remains useful for compatible masks, shadow shapes, small variations, environmental effects, and graceful loading fallbacks.

A complete 3D conversion, anime video playback replacing all journeys, or mandatory custom shader stack is unnecessary. Cel shading should be designed into the artwork. Optional WebGL effects must degrade gracefully in the Canvas renderer.

### Asset manifest and compatibility layer

Create a versioned art manifest describing assets and their consumers. Include stable identity/recipe IDs, asset paths and frames, source dimensions, display crop, pivots, expression anchors, attachment points, occlusion rules, supported bodies/gear, environment layers, and fallback behavior.

Preserve the public portrait and background entry points wherever possible. Extend `Portraits.key`, beast-key lookup, and metadata resolution through an adapter so combat, conversations, funerals, creation, and party screens receive the new art without separate hardcoded substitutions. The wardrobe must cover the actual 15 purchasable blacksmith sets and 8 faction/unique sets. `ANIME_GEAR_PLAN.md` records the inventory and design distinctions. Character identity is separate from `equippedSet`; gear bought by the player or for a party member, inherited gear, faction grants and sales must all update the drawing.

The user confirmed this release requires a wipe and a new game; a wipe notice already exists. Do not spend production effort migrating old characters into the new rig. Use a release-version gate when the full replacement ships, so old primary saves and backups cannot restore obsolete characters. Reset the complete playthrough, including inherited journals, prior lives and travel viewing history. New characters must still retain stable identity across later saves, equipment swaps and reincarnation rules. Separate stable identity from the renderer-version cache key. Audit rank and completed-quest counts in portrait keys: do not create endlessly growing caches when pixels have not changed. The isolated fitting-room preview must not trigger the release wipe.

### Character composition and animation

Prototype a layered character with a shared coordinate system: rear hair/cape, torso and outfit, neck/head, ears, eyes/mouth, front hair, and headgear. Define the exact stacking order per costume rather than assuming one order fits every helmet.

Author face regions that support animation. Do not paint a permanent open mouth and eyebrows into the base face and then draw a second animated face over them. Split face parts or provide clean replacement patches and expression frames.

Implement gear-aware occlusion masks. Covered eyebrows, eyes, mouths, ears, hair, and neck regions must remain hidden during every expression and lip frame. Test dialogue, combat reactions, standing moods, funeral grief, and transformation transitions.

Preserve and recalibrate the existing expression metadata rather than discarding it. Expressive blinks, controlled lip frames, subtle breathing, and small secondary hair/cloth motion should suit the illustration style. Avoid stretching the whole portrait like rubber.

Include subtle torso breathing and restrained adult female bust secondary motion driven by movement, with support determined by the equipped outfit: rigid plate stays firm, cloth can settle slightly. Offer motion toggles and honor reduced-motion preferences. No adult bust rig on dependent-child portraits. Include all druid forms, species-specific face rigs and correct restoration of the current human outfit.

Support deep/dark, brown, warm medium, light, fair and pale skin with appropriate highlights and shadows. Treat ethnicity as a broader design concern than skin hue: include varied facial structure, hair texture and styling, with East Asian, South Asian/Indian, Latino and other character references in the production design pool. Skin changes must not recolor fabric, metal or hair.

Cache assembled static components and animate only what changes. Phaser's Canvas textures require refresh/re-upload after pixel changes under WebGL; avoid repainting every NPC's full portrait every frame.

### Environment composition and animation

Create composition sheets first, then aligned layers with deliberate overlap and overscan: sky, distant silhouette, middle distance, ground/stage, foreground accents, plus optional light/effect masks. All layers must share a horizon, vanishing points, scale, and lighting.

Do not assume independent image generations will align automatically. Start from an approved composition; derive or redraw component layers against it. Inspect joins, transparency edges, repeated structures, and parallax exposure gaps.

Use gentle cloud drift, mist, swaying vegetation, water movement, candle/fire loops, smoke, drifting leaves, banners, and occasional distant activity. Local details should animate for a reason. Day/evening/night variations should change key light, sky, emissive windows, and contrast; a dark overlay alone is insufficient for major scenes.

Map each travel destination and battle-ground recipe to an explicit art entry. Some locations may share a location kit, but preserve recognizable composition and environmental differences. Do not route unresolved destinations to a generic forest silently. Cover housing upgrades, funeral settings, travel departures, arrivals, and faction-specific cutscenes.

Preserve the existing travel viewing rules: first viewing unskippable, second viewing skippable, no third automatic showing. Reincarnation and nepotism do not reset viewing history; a genuinely new playthrough does. Do not add extra dialogue or change those rules as part of this art task.

### Resolution, loading, and performance

Proposed starting sizes, subject to measured tests:

- Portrait masters around **880×1120**; consider **440×560** runtime composites at the existing portrait aspect ratio. Review both small combat portraits and larger cutscene uses before choosing final exports.
- Background masters around **2560×1520**, with selective smaller runtime exports, layered crops, and overscan. Do not force the current 1280×760 game into a 16:9 crop that cuts off important content.
- Start with texture-atlas pages no larger than **2048×2048** for broadly compatible character parts. Measure device limits before increasing them. Pad/extrude frames to prevent seams when scaled.
- Lossless transparent exports for character parts and cutouts; compare compressed opaque background exports visually. Preserve editable source assets separately from runtime exports.

These are proposed production targets, not claims about required engine limits. A 2048×2048 RGBA texture is approximately 16 MiB before mipmaps and other overhead, regardless of its small compressed download size. Hundreds of high-resolution portrait composites cannot remain resident indefinitely.

Load environment packs on demand, preload upcoming scenes, reuse shared character parts, and apply reference-counted or bounded cache eviction. Never remove a texture still used by another scene or portrait. Destroy owned particles, tweens, listeners, and temporary textures on scene shutdown.

Measure baseline and revised frame times, texture counts, approximate decoded memory, asset transfer size, and scene loading time on desktop and mobile. Aim for smooth 60 fps on the selected desktop reference and a stable mobile experience; report actual devices and measurements rather than promising untested performance.

## Tools and access

**Available in the current workspace:** repository read/write access, JavaScript/Node tooling, Python, Playwright, Chrome, and an image-generation/editing tool. Confirm available image-generation skill instructions and output handling before using that tool. Do not generate art during a planning-only request.

**Needed for production:**

- Image generation/editing for approved concept sheets, environment compositions, textures, and selected character assets. Use consistent approved references across batches. Preserve prompts, model/tool provenance, output paths, and revision IDs.
- Image inspection and export tooling for transparent edges, cropping, resolution variants, atlas packing, and asset validation. Follow the image tool's editing requirements; do not silently substitute a prohibited editing workflow.
- Local browser testing and screenshots of real game scenes at desktop and mobile sizes.
- An editable drawing/layer workflow for precision cleanup and aligned layers. A human illustrator or a connected raster editor may be valuable for final anatomy, hands, costume seams, expressions, and stubborn consistency problems. Verify actual access before promising work through a particular application.

**Optional, not prerequisites:** a commercial atlas packer, external layered-art editor, or skeletal-animation pipeline. Do not require paid Spine/Live2D integrations or migrate the engine just to achieve this look. They would add licensing, rigging, and runtime work and need a separate justification.

ElevenLabs is unnecessary for this visual overhaul unless a separately approved audio change is requested. Its remaining voice-credit balance does not fund image generation. Establish image-generation limits and estimated batch size before mass production; report unknown pricing or quotas honestly. Never invent an asset budget or spend against an unapproved new paid service.

## Delivery stages

### 1. Inventory and baseline

Produce a machine-readable inventory and a visual contact sheet of every distinct character recipe, named character, enemy family, skin, outfit, beast form, background, destination, and visible icon/effect family. Record where each appears. Separate source assets, procedural recipes, composed variants, and runtime surfaces so the final production count is meaningful.

Capture baseline screenshots and performance measurements. Identify UI areas where a better background would still be obscured. Flag missing mappings, texture-key collisions, and expression/gear incompatibilities.

### 2. Style approval and playable sample

Create a small but representative sample:

- Adult female mage in a tailored dress/robe, armored female fighter, and female ninja with a properly occluding mask.
- Two contrasting male designs, such as a samurai and pirate/naval fighter.
- One humanoid enemy, one creature/boss, and one druid beast form.
- A detailed port and a forest/ruin composition, each with a short animated layer demonstration.

Show before/after contact sheets and put the sample into actual creation, combat, and dialogue/cutscene views. Demonstrate expressions and an equipment swap. The sample must prove the art can function in the game rather than only look good as a standalone image.

Request review of this concrete sample before multiplying it across the entire roster. Provide specific visual choices and a production inventory, not a vague request to approve an entire future overhaul.

### 3. Character and wardrobe rollout

Finish the approved modular rigs, named characters, body variants, every gear set, campaign costume, masks, expressions, monsters, skins, and beast forms. Verify face continuity under each supported outfit. Create a coverage report with explicit exceptions.

### 4. Environment and cutscene rollout

Replace all environment mappings with approved illustrated kits and location-specific compositions. Integrate time, weather, parallax, camera framing, foreground depth, and environmental motion. Include town homes, travel, funerals, combat, and campaign staging.

### 5. Effects and interface cohesion

Bring melee arcs, magic effects, impacts, selection rings, status visuals, equipment/skill icons, decorative panels, title/creation art, and other visible assets into the same palette and line/shading language. Preserve action timing, hit feedback, controls, font readability, contrast, and existing sound mappings.

### 6. Validation and delivery

- Run automated mapping/asset checks and relevant existing expression, beast-form, combat-presentation, travel, family, gear, and UI regressions.
- Review supported body/gear combinations, all headgear occlusion classes, all beast expressions, and every unique location through contact sheets plus real scene captures.
- Test save/reload identity, gear purchasing and inheritance appearance, scene transitions, skip behavior, texture cleanup, mute behavior where effects share audio, and renderer fallback.
- Render at actual combat scale, larger dialogue scale, desktop viewport sizes, and mobile sizes. Check cropped breasts/shoulders, distorted necks, floating masks, hidden controls, blurry outlines, halos, and crowded backgrounds.
- Report missing assets and deliberately shared assets separately. Do not claim full coverage while essential variants still silently use old placeholders.
- Deliver runtime assets, editable masters where available, manifests, assembly/export tools, an asset attribution/provenance record, performance results, comparison sheets, and an exhaustive change list.

Keep game balance, dialogue content, profanity, personality voice assignments, NPC lifecycle, quest rules, and save data intact except for documented rendering compatibility work. Never call generated art production-ready solely because a file was created: inspect it, test it in context, and revise it when necessary.

## Technical references

The local code is the authority for this project's version and behavior. These official Phaser references support the proposed asset pipeline; check compatibility with the installed 3.87 runtime before adopting APIs described for later releases:

- [Phaser texture concepts and atlas support](https://docs.phaser.io/phaser/concepts/textures)
- [Phaser loader concepts](https://docs.phaser.io/phaser/concepts/loader)
- [CanvasTexture refresh and WebGL upload behavior](https://docs.phaser.io/api-documentation/class/textures-canvastexture)
