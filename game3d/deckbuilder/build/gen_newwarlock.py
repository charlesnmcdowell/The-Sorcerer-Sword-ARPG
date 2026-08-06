#!/usr/bin/env python3
"""gen_newwarlock.py — generate the female warlock's animation SHEETS via xAI Grok
(edit-mode, anchored on tools/refs/"new warlock ref.png"), following the project's
full-sheet art direction (one call = one labeled green-screen sheet)."""
import os, sys, json, base64, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
KEY = open("/mnt/user-data/uploads/game3d/tools/xai_key.txt").read().strip()
REF = "/mnt/user-data/uploads/game3d/tools/refs/new warlock ref.png"
API = "https://api.x.ai/v1"
MODEL = "grok-imagine-image-quality"

NEWWL = ("the SAME anime dark-elf warlock woman as the reference: rich brown skin, long black "
         "kinky-twist locs with red-trimmed strands, hazel-ice eyes, pointed ears, gold jewelry "
         "(layered necklace, long earrings, waist chains, arm bracers), sheer brown-and-tan "
         "layered robes with gold accents, strappy heeled sandals, confident ruthless expression")

SHEET_STYLE = ("professional game SPRITE SHEET layout on a perfectly FLAT, UNIFORM, highly SATURATED "
               "pure chroma-green background (hex 00FF00) covering every pixel between frames: each "
               "animation is ONE ROW of frames side by side in a NEAT EVEN GRID with IDENTICAL column "
               "spacing, a small white text row label above each row, the SAME character in every "
               "single frame (identical colours, proportions, costume, scale), SIDE-ON profile FACING "
               "RIGHT in every frame, every frame fully inside its own grid cell with clear green "
               "separation (no frame touching another), no scenery, no ground shadows, dark-fantasy "
               "painterly anime, rich ornate detail, dramatic rim light")

SHEETS = {
  "newwarlock_sheet_a": ("Sprite sheet, 3 labeled rows: "
    "row 1 'IDLE' = 5 frames of a relaxed combat-ready idle breathing cycle, weight on one hip, one hand "
    "raised with dark violet magic curling around her fingers; "
    "row 2 'WALK' = 8 frames of one full confident strutting walk cycle moving rightward, robes and locs trailing; "
    "row 3 'HURT' = 4 frames recoiling backward in pain, staggered but furious. "
    f"The character: {NEWWL}. Keep her EXACTLY the reference woman in every frame."),
  "newwarlock_sheet_b": ("Sprite sheet, 4 labeled rows: "
    "row 1 'CAST' = 6 frames casting a spell forward to the right: free hand thrust out, staff-less, "
    "crackling violet-and-ember shadow magic streaming from her palm; "
    "row 2 'SUMMON' = 6 frames of a dramatic summoning: both arms spread wide, head high, a swirling "
    "violet summoning circle blazing in the air before her; "
    "row 3 'PORTAL' = 6 frames conjuring a tall glowing violet rune portal beside her with one graceful outstretched arm; "
    "row 4 'SLIDE' = 4 frames of a low fast dodging slide to the right, trailing wisps of shadow. "
    f"The character: {NEWWL}. Keep her EXACTLY the reference woman in every frame."),
}

def post(path, body):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.loads(r.read().decode())

def edit(prompt, aspect):
    b64 = base64.b64encode(open(REF, "rb").read()).decode()
    resp = post("/images/edits", {"model": MODEL, "prompt": prompt, "aspect_ratio": aspect,
        "response_format": "b64_json", "image": {"url": f"data:image/png;base64,{b64}", "type": "image_url"}})
    d = resp["data"][0]
    if d.get("b64_json"): return base64.b64decode(d["b64_json"])
    with urllib.request.urlopen(d["url"], timeout=300) as r: return r.read()

if __name__ == "__main__":
    only = sys.argv[1:] or list(SHEETS)
    for name in only:
        out = os.path.join(HERE, name + ".png")
        print("generating", name, "…")
        data = edit(SHEETS[name] + ". " + SHEET_STYLE + ".", "3:2")
        open(out, "wb").write(data)
        print("  wrote", out, len(data)//1024, "KB")
