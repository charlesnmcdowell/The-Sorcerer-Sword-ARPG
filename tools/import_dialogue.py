#!/usr/bin/env python3
"""Import the review-copy dialogue markdown (personalities + campaign) into
the game's data files, and record every voice id for the generators.

  python3 tools/import_dialogue.py <alldialogue.md> <game_dir>

Writes:
  js/data/dialogue.js            40 personalities x 4 bands x 4 lines (tags kept)
  js/data/campaign_dialogue.js   12 campaign characters, beats -> [{t}] (tags kept)
  tools/voice_casting.json       personality id / campaign id -> ElevenLabs voice id

Bracketed delivery tags stay in the data: the voice generators send them to
eleven_v3 as direction; util.renderLine / CampaignUI.fill strip them from the
text box. Writer labels like *(tactical)* are dropped.
"""
import json, re, sys
from pathlib import Path

SRC = Path(sys.argv[1]); GAME = Path(sys.argv[2])
text = SRC.read_text(encoding="utf-8")
part1, part2 = text.split("# PART TWO — CAMPAIGN CHARACTERS", 1)

# ---------------------------------------------------------------- personalities
BANDS = ["general", "friendly", "hatred", "romantic"]
personalities = {}
casting = {}
for m in re.finditer(r"^## (M\d\d|F\d\d) · ([^\n]+)\n(.*?)(?=^## |\Z)", part1, re.S | re.M):
    pid, name, body = m.group(1), m.group(2).strip(), m.group(3)
    vid = re.search(r"voice id:\s*([A-Za-z0-9]+)", body)
    if vid: casting[pid] = vid.group(1)
    bands = {}
    for b in BANDS:
        sec = re.search(r"\*\*" + b.capitalize() + r"\*\*\n(.*?)(?=\n\*\*|\Z)", body, re.S)
        lines = re.findall(r'^\d+\.\s+"(.*)"\s*$', sec.group(1), re.M) if sec else []
        bands[b] = [l.strip() for l in lines]
        assert len(bands[b]) == 4, (pid, b, len(bands[b]))
    personalities[pid] = {"id": pid, "name": name, "sex": "m" if pid[0] == "M" else "f", **bands}
assert len(personalities) == 40, len(personalities)

out = ["// GENERATED from alldialogue.md by tools/import_dialogue.py — do not edit by hand.",
       "// Bracketed tags are ElevenLabs v3 delivery cues: spoken, never shown.",
       "(function(){", "'use strict';",
       "globalThis.ADV = globalThis.ADV || {}; ADV.DATA = ADV.DATA || {};",
       "ADV.DATA.DIALOGUE = " + json.dumps(personalities, indent=1, ensure_ascii=False) + ";",
       "})();", ""]
(GAME / "js" / "data" / "dialogue.js").write_text("\n".join(out), encoding="utf-8")

# ---------------------------------------------------------------- campaign
CHAR_IDS = {"WREN SALLOW": ("maw", "wren"), "KITE": ("maw", "kite"), 'VESNA ARDEN, "THE LAMPLIGHTER"': ("maw", "arden"), "OSSIAN VANE": ("maw", "vane"),
            "BREGGA HOLT": ("antler", "holt"), "DAIN ROSCARROW": ("antler", "roscarrow"), "HOLLOWAY": ("antler", "holloway"), "FIRST HORN ALDIS CRANE": ("antler", "crane"),
            "ADEPT LIRIEN": ("varenholm", "lirien"), "CASSIEL VAUNT": ("varenholm", "vaunt"), "THE QUIET": ("varenholm", "quiet"), "MAGISTER ILARIA VENN": ("varenholm", "venn")}
BEAT_KEYS = [
    (r"^The offer", "offer"), (r"^Tutorial", "tutorial"), (r"^On declining", "decline"),
    (r"^Quest (\d) debrief", "debrief{0}"), (r"^Why ", "why"),
    (r"^After quest (\d)", "after{0}"), (r"^Quest 3 — joining", "join3"), (r"banter", "banter"),
    (r"^Quest 3 — after the fight", "after3"), (r"^Quest 4 — before", "before4"), (r"^Quest 4 — death", "death"),
    (r"^Quest 4 — appearance", "appear"), (r"^Quest 4 — after the kill", "afterKill"), (r"^Quest 5 — final encounter", "final"),
    (r"^First hall visit", "first"), (r"^Quest 5 — hunting together", "hunt"), (r"^Quest 5 — after (Arden|The Quiet) falls", "afterFall"),
    (r"^Quest 5 — HOLLOWAY speaks, facing", "facing"), (r"^Quest 5 — HOLLOWAY speaks, with the player", "sided"),
    (r"^Quest 5 — HOLLOWAY speaks, during", "fight"), (r"^Quest 5 — after Crane falls", "afterCrane"),
    (r"^Quest 5 — the briefing", "briefing"), (r"^Quest 5 — player sides with her", "sided"), (r"^Quest 5 — CRANE speaks, during", "fight"),
    (r"^Quest 5 — player sides against her", "against"), (r"^Quest 5 — after Holloway falls", "afterHolloway"),
    (r"^Ending", "ending"),
]
def beat_key(title):
    for rx, key in BEAT_KEYS:
        m = re.search(rx, title)
        if m: return key.format(*m.groups())
    raise SystemExit("unmapped beat: " + title)

campaign = {"maw": {}, "antler": {}, "varenholm": {}}
for m in re.finditer(r"^## ([^\n]+?) — (Recruiter|Rival|Antagonist|Boss)\n(.*?)(?=^## |\Z)", part2, re.S | re.M):
    who, body = m.group(1).strip(), m.group(3)
    fid, cid = CHAR_IDS[who]
    vid = re.search(r"voice id:\s*([A-Za-z0-9]+)", body)
    if vid: casting[cid] = vid.group(1)
    beats = {}
    for bm in re.finditer(r"^\*\*([^*]+)\*\*[^\n]*\n(.*?)(?=^\*\*|\Z)", body, re.S | re.M):
        key = beat_key(bm.group(1).strip())
        lines = re.findall(r'^>\s*"(.*?)"\s*(?:\*\([^)]*\)\*)?\s*$', bm.group(2), re.M)
        assert lines, (cid, key)
        beats[key] = [{"t": l.strip()} for l in lines]
    campaign[fid][cid] = beats
assert sum(len(v) for v in campaign.values()) == 12

# keep CAMPAIGN_COPY + campaignVoiceText from the current file
cur = (GAME / "js" / "data" / "campaign_dialogue.js").read_text(encoding="utf-8")
tail = cur[cur.index("ADV.DATA.CAMPAIGN_COPY = {"):]
tail = tail[:tail.rindex("})();")]
out = ["// GENERATED from alldialogue.md by tools/import_dialogue.py — campaign beats.",
       "// Each line: {t: shown/spoken text}. Bracketed tags are ElevenLabs v3 cues (spoken,",
       "// stripped from the text box); {target} is dropped in voice, {they}/{them}/{their}",
       "// read as names on screen and pronouns in audio (ADV.DATA.campaignVoiceText).",
       "(function () {", "'use strict';",
       "globalThis.ADV = globalThis.ADV || {}; ADV.DATA = ADV.DATA || {};",
       "ADV.DATA.CAMPAIGN_DIALOGUE = " + json.dumps(campaign, indent=1, ensure_ascii=False) + ";",
       "", tail.rstrip(), "})();", ""]
(GAME / "js" / "data" / "campaign_dialogue.js").write_text("\n".join(out), encoding="utf-8")
(GAME / "tools" / "voice_casting.json").write_text(json.dumps(casting, indent=1), encoding="utf-8")
n_p = sum(len(p[b]) for p in personalities.values() for b in BANDS)
n_c = sum(len(l) for f in campaign.values() for c in f.values() for l in c.values())
print(f"personalities {len(personalities)} lines {n_p}; campaign chars {sum(len(v) for v in campaign.values())} lines {n_c}; voices {len(casting)}")
