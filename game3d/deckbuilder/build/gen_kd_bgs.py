#!/usr/bin/env python3
"""
gen_kd_bgs.py — three samurai level backdrops on the OpenAI backend (2026-08-11).
HARD BUDGET: $2. 6 planned images at high/1536x1024 = $1.50; cap at 8 calls total.
  Act 1  BAMBOO ROAD   : bg_bam_far / bg_bam_mid
  Act 2  BRASSVEIL v2  : bg_bv_far / bg_bv_mid   (stronger magitech-cyberpunk)
  Act 3  THRONE ROOM   : bg_throne_far / bg_throne_mid  (Sera boss arena)
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from artgen import generate

SRC = "/mnt/user-data/uploads/game3d/assets/bg"
STYLE = ("moody painterly anime dark-fantasy game background art, rich atmospheric depth, "
         "cinematic lighting, no characters, no creatures, no text, no watermark")

JOBS = [
 ("bg_bam_far.png",
  "vast misty bamboo forest at first light: endless tall green bamboo stalks receding into pale "
  "gold morning mist, a worn stone road winding through the grove toward distant blue mountain "
  "silhouettes, drifting leaves, " + STYLE),
 ("bg_bam_mid.png",
  "the near edge of a bamboo grove seen at ground level: a row of thick green bamboo stalks, "
  "ferns, moss and fallen pale leaves along a packed-earth roadside, composed as a low horizontal "
  "foreground strip with all detail in the lower half and open mist above, " + STYLE),
 ("bg_bv_far.png",
  "fantasy magitech cyberpunk city skyline at night: brass and obsidian towers veined with glowing "
  "teal ley-line conduits, huge floating arcane rune-glyphs shining like neon holograms between "
  "spires, sky-gondolas on light-rails, magenta and cyan glow bleeding into rain haze, " + STYLE),
 ("bg_bv_mid.png",
  "street level of a fantasy magitech cyberpunk city at night: glowing rune-sign shopfronts, brass "
  "conduit pipes crawling up walls, crystal streetlamps, wet stone-and-steel pavement reflecting "
  "cyan and magenta neon, market kiosks with holographic sigils, composed as a low horizontal "
  "foreground strip with all detail in the lower half, " + STYLE),
 ("bg_throne_far.png",
  "the colossal throne room of a dragon emperor: a vast jade-and-gold hall with towering pillars "
  "carved as coiling dragons, an empty obsidian throne raised on a high dais wreathed in green "
  "brazier flame, storm light through tall lancet windows, long war banners, polished floor "
  "reflecting the fire, " + STYLE),
 ("bg_throne_mid.png",
  "the foot of a dragon emperor's throne dais: wide dark stone steps flanked by braziers of green "
  "flame and gold dragon statues, incense smoke drifting low, polished obsidian floor reflecting "
  "the emerald light, composed as a low horizontal foreground strip with all detail in the lower "
  "half, " + STYLE),
]

calls = 0
CAP = 8
for fname, prompt in JOBS:
    out = os.path.join(SRC, fname)
    tmp = os.path.join("/home/claude/spire/build/gen_oa_raw", "bg_" + fname)
    if os.path.exists(tmp) and os.path.getsize(tmp) > 50000:
        open(out, "wb").write(open(tmp, "rb").read()); print(fname, "cached"); continue
    if calls >= CAP:
        print("BUDGET CAP REACHED — stopping"); break
    print(fname, "...", flush=True)
    raw = generate(prompt, size="1536x1024", quality="high")
    calls += 1
    open(tmp, "wb").write(raw)
    open(out, "wb").write(raw)
    print(fname, "OK", len(raw))
print(f"DONE — {calls} API calls (~${calls*0.25:.2f})")
