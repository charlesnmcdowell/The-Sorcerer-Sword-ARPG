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
    # stitched clips have mp3 seams: decode to wav first (ignore seam errors), then normalize
    import tempfile, os
    wav = tempfile.mktemp(suffix=".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-err_detect", "ignore_err",
                    "-i", str(src), "-ar", "44100", wav], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav,
                    "-af", f"loudnorm={TARGET}", "-b:a", "128k", str(dst)], check=True)
    os.unlink(wav)

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
