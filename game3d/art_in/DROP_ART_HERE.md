# Drop generated art here (Hiro)

Save your Stable-Diffusion PNGs into this folder. The game3d-build schedule checks it every run,
keys the background to transparent, AUTO-GENERATES a normal map, lights it, and swaps it into the build —
then moves the source into ../assets/sprites/. You don't touch any code.

## What to generate FIRST (the vibe check)
Just the WARLOCK idle pose — one good sprite. Everything else (animation frames, transformations) comes later.

## File naming (so the build knows what it is)
- warlock_idle.png        <- start here
- later: warlock_cast.png, warlock_walk.png, warlock_hurt.png
- transformations (later): blackdragon.png, archdevil.png, demonlord.png, lich.png, archsuccubus.png, succubus.png

## Image specs (important for the 2.5D lighting to look good)
- TRANSPARENT background (PNG + alpha). If your tool can't do alpha, use a FLAT solid green (#00ff00) or
  magenta (#ff00ff) background — the build will key it out.
- FULL BODY, centered, facing the camera or a slight 3/4 turn (matches the angled arena cam).
- FLAT / EVEN lighting if possible (no hard baked shadows or strong single-side light) — the engine adds the
  dynamic light + shadow itself; pre-baked shadows fight it. Stylized cel shading is fine.
- Tall canvas, high detail (e.g. 832x1216 or 1024x1024).
- Keep the SAME design across future forms (silver hair, robe motifs, dark-elf features) so it reads as one character.

## A starter prompt (tweak to taste)
anime style, cel shaded, full body, dark elf sorcerer, long silver-white hair, violet eyes, ornate black-and-violet
arcane robes, holding a tall ornate magic staff and a glowing spellbook, dark-fantasy villain mage, clean lineart,
neutral even lighting, centered, facing viewer, transparent background, high detail, character concept sheet
NEGATIVE: photo, 3d render, low-poly, blocky, watermark, text, busy background, multiple characters

## Tips for consistency (for later forms)
- Reuse the same SEED + style, and use img2img / a character reference of the approved warlock so the dragon/
  demon-lord/lich forms read as the SAME character and world.
