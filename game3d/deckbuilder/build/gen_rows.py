#!/usr/bin/env python3
"""gen_rows.py — one sheet PER ANIMATION for bigger, crisper frames.
Each call = one image containing only that animation's frames (intra-anim
consistency preserved), edit-anchored on the human-provided reference."""
import os, sys, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_newwarlock import edit, NEWWL, SHEET_STYLE, HERE

ROWS = {
  # name: (grid description, rows-arg for slicer, motion description)
  "idle": ("ONE ROW of 5 frames", "idle",
           "a relaxed combat-ready idle breathing cycle: weight settling on one hip, chest rising, "
           "one hand raised with dark violet magic curling and pulsing around her fingers"),
  "walk": ("2 rows of 4 frames each (8 frames of ONE continuous cycle, read left-to-right top row then bottom row)", "walkA,walkB",
           "one full confident strutting walk cycle moving rightward, robes and locs trailing, hips swaying"),
  "hurt": ("ONE ROW of 4 frames", "hurt",
           "recoiling backward in pain from a hit: head snapping back, locs whipping, then catching herself, furious"),
  "cast": ("2 rows of 3 frames each (6 frames of ONE continuous action, read left-to-right top row then bottom row)", "castA,castB",
           "casting an attack spell forward to the right: arm sweeping up, violet-and-ember shadow magic building "
           "around her palm, then a crackling burst streaming toward the right"),
  "bigcast": ("2 rows of 3 frames each (6 frames of ONE continuous action, read left-to-right top row then bottom row)", "bigA,bigB",
           "a dramatic summoning ritual: both arms sweeping wide, head thrown high, a swirling violet summoning "
           "circle igniting and blazing in the air before her"),
  "portal": ("2 rows of 3 frames each (6 frames of ONE continuous action, read left-to-right top row then bottom row)", "porA,porB",
           "conjuring a shimmering violet ward of rune-light around herself with one graceful sweeping arm, "
           "protective glyphs orbiting her"),
  "slide": ("ONE ROW of 4 frames", "slide",
           "a low fast dodging slide to the right: crouching into the dash, trailing wisps of shadow, then rising back up"),
}

def main(only=None):
    for name, (grid, rows_arg, motion) in ROWS.items():
        if only and name not in only: continue
        out = os.path.join(HERE, f"row_{name}.png")
        prompt = (f"Sprite sheet: {grid}, showing {motion}. "
                  f"The character: {NEWWL}. Keep her EXACTLY the reference woman in every frame, "
                  f"full figure head-to-toe in every frame, figures drawn as LARGE as the cells allow. "
                  f"{SHEET_STYLE}. NO text labels except tiny row labels, NO borders or outlines around cells.")
        print("generating", name, "…")
        data = edit(prompt, "3:2")
        open(out, "wb").write(data)
        print("  wrote", out, len(data)//1024, "KB")

if __name__ == "__main__":
    main(sys.argv[1:] or None)
