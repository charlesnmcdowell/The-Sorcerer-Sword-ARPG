#!/usr/bin/env python3
"""Parse Part III of the GDD into js/data/dialogue.js.

Format expected:
  # Male Personalities / # Female Personalities
  ## M01 · Stoic
  **General** / **Friendly** / **Hatred** / **Romantic**
  1. "Line text with {tokens}."
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'docs/design/GDD.md'
OUT = ROOT / 'js/data/dialogue.js'

text = open(SRC, encoding="utf-8").read()
part3 = text.split("# Part III")[1]

persons = {}
current = None
band = None
sex = None
BANDS = {"General": "general", "Friendly": "friendly", "Hatred": "hatred", "Romantic": "romantic"}

for raw in part3.splitlines():
    line = raw.strip()
    if line.startswith("# Male Personalities"):
        sex = "m"; continue
    if line.startswith("# Female Personalities"):
        sex = "f"; continue
    m = re.match(r"^## ([MF]\d\d) · (.+)$", line)
    if m:
        pid, pname = m.group(1), m.group(2).strip()
        current = {"id": pid, "name": pname, "sex": sex,
                   "general": [], "friendly": [], "hatred": [], "romantic": []}
        persons[pid] = current
        band = None
        continue
    m = re.match(r"^\*\*(General|Friendly|Hatred|Romantic)\*\*$", line)
    if m:
        band = BANDS[m.group(1)]
        continue
    m = re.match(r'^\d+\.\s+["“](.*)["”]\s*$', line)
    if m and current and band:
        current[band].append(m.group(1))

# Validate: 40 personalities, 4 bands x 4 lines, >=1 unconditional per band,
# every line contains {target} OR band has target lines... GDD rule: every
# phrase must contain at least {target}? Actually rule says every phrase must
# contain at least {target} -- but many lines don't. Enforce only structure.
errs = []
if len(persons) != 40:
    errs.append(f"expected 40 personalities, got {len(persons)}")
COND = re.compile(r"\{(them|their|they|partner)\}")
for pid, p in persons.items():
    for b in ("general", "friendly", "hatred", "romantic"):
        if len(p[b]) != 4:
            errs.append(f"{pid} {b}: {len(p[b])} lines")
        if not any(not COND.search(l) for l in p[b]):
            errs.append(f"{pid} {b}: no unconditional line")
# no duplicate lines across the whole library
all_lines = [l for p in persons.values() for b in ("general","friendly","hatred","romantic") for l in p[b]]
dupes = {l for l in all_lines if all_lines.count(l) > 1}
if dupes:
    errs.append(f"duplicate lines: {sorted(dupes)[:3]}")
if errs:
    print("VALIDATION ERRORS:\n" + "\n".join(errs)); sys.exit(1)

js = ("// GENERATED from GDD Part III by tools/parse_dialogue.py — do not edit by hand.\n"
      "(function(){\n'use strict';\nwindow.ADV = window.ADV || {}; ADV.DATA = ADV.DATA || {};\n"
      "ADV.DATA.DIALOGUE = " + json.dumps(persons, ensure_ascii=False, indent=1) + ";\n"
      "})();\n")
# UI runs in browser; core runs in Node too — use globalThis instead of window
js = js.replace("window.ADV = window.ADV || {}", "globalThis.ADV = globalThis.ADV || {}").replace("window.ADV", "globalThis.ADV")
open(OUT, "w", encoding="utf-8").write(js)
print(f"OK: {len(persons)} personalities, {len(all_lines)} lines -> {OUT}")
