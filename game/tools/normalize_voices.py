#!/usr/bin/env python3
"""
normalize_voices.py — V3 polish: two-pass EBU R128 loudness normalization across
all generated voice clips so no character shouts or whispers relative to another.
Requires ffmpeg. Safe to rerun; originals backed up to assets/voice/_raw/ once.

Usage: python game/tools/normalize_voices.py   (or I run it in the sandbox post-V2)
"""
import json, shutil, subprocess, sys
from pathlib import Path

VOICE = Path(__file__).resolve().parent.parent / "assets" / "voice"
RAW = VOICE / "_raw"
TARGET = "I=-19:TP=-1.5:LRA=9"  # dialog-appropriate loudness, slightly under music

def loudnorm(src, dst):
    p1 = subprocess.run(["ffmpeg", "-y", "-loglevel", "info", "-i", str(src),
                         "-af", f"loudnorm={TARGET}:print_format=json", "-f", "null", "-"],
                        capture_output=True, text=True)
    tail = p1.stderr[p1.stderr.rfind("{"):p1.stderr.rfind("}") + 1]
    m = json.loads(tail)
    af = (f"loudnorm={TARGET}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:"
          f"offset={m['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src),
                    "-af", af, "-b:a", "128k", str(dst)], check=True)

def main():
    clips = sorted(VOICE.glob("*.mp3"))
    if not clips:
        sys.exit("no clips in assets/voice/ — run generate_voices.py first (V2)")
    RAW.mkdir(exist_ok=True)
    done = 0
    for c in clips:
        raw = RAW / c.name
        if not raw.exists(): shutil.copy2(c, raw)   # preserve original once
        loudnorm(raw, c)
        done += 1
        print(f"  [{done}/{len(clips)}] {c.name}")
    print(f"normalized {done} clips to {TARGET}")

if __name__ == "__main__":
    main()
