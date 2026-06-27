# BLOCK: lit_sprite_2_5d  (capability: make flat 2D art read as 3D)

WHAT: Light a flat anime sprite with Phaser Light2D + a baked NORMAL MAP so a moving
in-scene light wraps shading across the figure. This is the core "2.5D looks 3D" trick.

VERB API (Phaser 3.80):
  preload: this.load.image('hero', [diffuseURL, normalURL]);   // PAIR = [diffuse, normal]
  create:  this.lights.enable().setAmbientColor(0x201a33);      // NOT black
           this.lights.addLight(x,y,radius,color,intensity);
           img.setPipeline('Light2D');                          // REQUIRED per sprite

NORMAL-MAP BAKING (no paid API): build a height field of the body as rounded volumes
(capsules/cones), GaussianBlur it, take np.gradient -> normals -> RGB; alpha = figure
mask so it matches the diffuse silhouette. See assets/spike/gen_spike_assets.py.

GOTCHAS:
- Load the pair as an ARRAY: load.image(key, [diffuse, normal]). Wrong order = inverted light.
- setAmbientColor MUST be > black, or unlit areas vanish to nothing.
- EVERY lit object needs .setPipeline('Light2D'); unpiped objects ignore lights.
- Normal-map ALPHA must match the diffuse alpha or edges light up as a rectangle.
- Floor/contact-shadow are usually NOT piped (drawn flat) so they don't get double-lit.

STATUS: validated in spike.html (Milestone 0). Placeholder art; swap for Hiro-approved anime.
