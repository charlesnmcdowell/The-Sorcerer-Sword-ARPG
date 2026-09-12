# Portrait neck and collar fit

The full-screen portrait issue came from the join between modular heads and outfits. A fixed body offset left too much space under some chins, and an outfit's painted empty collar could cover the neck like a horizontal cap.

The renderer now seats ordinary collars 28 source pixels higher, blends the body edge, and measures each outfit's central collar position. A narrow portion of the original neck renders in front of the back collar rim; the front of the outfit retains its overlap. This uses the existing head's skin and shading. Full plate helmets retain their existing body position, while the Gate cast and Warden outfits retain their authored collar fitting.

The script cache version is `20260912-neck2`. Reload the local game to load it. Save data, character identities, voices, and equipment assignments are unaffected.

## Verification

- Reviewed all 25 outfit options on female and male bodies, plus all 27 ordinary face variants in the hunting outfit and the initial creation looks, at 1920×1080.
- Checked the actual 34-card creation screen at 1920×1080 and 2560×1440, then resized to 1280×760, in WebGL and Canvas. Checked animation layers on ten portraits per renderer.
- Campaign browser checks pass for all 47 named cast members and 60 equipped variants, including mask and full-helmet behavior. Campaign backdrops, travel panoramas, encounters, and cinematic stills also load with no missing asset requests or browser errors.

Review captures and browser results are in `tools/portrait_fit/`. The source PNGs and runtime WebP images were not regenerated for this fix.
