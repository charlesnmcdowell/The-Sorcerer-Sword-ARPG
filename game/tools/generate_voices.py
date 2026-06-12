#!/usr/bin/env python3
"""
generate_voices.py — synthesize the game's voice lines via ElevenLabs.
Modeled on your chapter_tts.py (same config, same cost gating, same abort rules).

Usage (on your machine, from the repo root):
  node game/tools/build_voice_manifest.js          # refresh the manifest first
  python game/tools/generate_voices.py --dry-run   # free: validates voice coverage + cost preview
  python game/tools/generate_voices.py             # prompts y/n, then burns credits
  python game/tools/generate_voices.py --yes       # no prompt

Config: reads your existing tts_config.json
  (default: C:/Users/charl/OneDrive/Documents/TTRPG/Kenji/Game init files/tts_config.json
   override with --config <path>)

Voice slots: manifest speakerSlots maps game speakers -> character_voices keys.
Missing slots abort BEFORE any API call — add them in tts_config.json:
  "Bellow": "<voice_id>", "Quarry Boy": "<voice_id>", "Veiled Woman": "<voice_id>",
  "Brakka": ..., "Vexa": ..., "Dorian": ..., "Faelar": ..., "Sylvara": ..., "Pippa": ...
(voiceHints in the manifest describe each, for picking from the voice library.)
Already-generated clips are skipped, so you can fill voices in batches.

Output: game/assets/voice/<id>.mp3
"""
import json, sys, time, argparse
from pathlib import Path
try:
    import requests
except ImportError:
    sys.exit("pip install requests")

HERE = Path(__file__).resolve().parent
DEFAULT_CONFIG = Path("C:/Users/charl/OneDrive/Documents/TTRPG/Kenji/Game init files/tts_config.json")
OUT_DIR = HERE.parent / "assets" / "voice"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--yes", action="store_true")
    ap.add_argument("--only", help="comma list of speakers to generate (e.g. BELLOW,MARLOW)")
    args = ap.parse_args()

    manifest = json.loads((HERE / "voice_manifest.json").read_text(encoding="utf-8"))
    cfg = json.loads(args.config.read_text(encoding="utf-8"))
    api_key = cfg.get("api_key", "")
    voices = {k.lower(): v for k, v in cfg.get("character_voices", {}).items() if not k.startswith("_")}
    slots = manifest["speakerSlots"]

    lines = manifest["lines"]
    if args.only:
        keep = {s.strip().upper() for s in args.only.split(",")}
        lines = [l for l in lines if l["speaker"] in keep]
    todo = [l for l in lines if not (OUT_DIR / f"{l['id']}.mp3").exists()]

    print(f"[1/4] {len(lines)} lines in scope, {len(lines)-len(todo)} already generated, {len(todo)} to do")

    # validate coverage (abort before any API call, like chapter_tts.py)
    missing = sorted({l["speaker"] for l in todo
                      if not voices.get(slots.get(l["speaker"], l["speaker"]).lower())})
    print(f"[2/4] voice coverage: {len({l['speaker'] for l in todo}) - len(missing)} mapped")
    if missing:
        print("\n=== MISSING VOICE IDs (add to tts_config.json character_voices) ===")
        for s in missing:
            hint = manifest["voiceHints"].get(slots.get(s, s), "")
            print(f"  - {slots.get(s, s)}   ({hint})")
        print("\nNothing was sent to ElevenLabs. Add the slots (voiceHints above help you pick)")
        print("or rerun with --only to do the mapped speakers first.")
        covered = [l for l in todo if voices.get(slots.get(l["speaker"], l["speaker"]).lower())]
        if not covered: sys.exit(1)
        print(f"({len(covered)} lines ARE covered — rerun with --only of those speakers to proceed.)")
        sys.exit(1)

    chars = sum(len(l["text"]) for l in todo)
    print(f"[3/4] cost preview: {len(todo)} segments, {chars} chars ≈ ${chars*0.00015:.2f}–${chars*0.0003:.2f}")
    if args.dry_run:
        print("dry run — no credits spent. Looks ready."); return
    if not api_key: sys.exit("tts_config.json api_key is empty")
    if not args.yes and input("Proceed? [y/N] ").strip().lower() != "y":
        sys.exit("aborted")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print("[4/4] synthesizing...")
    done = 0
    for l in todo:
        vid = voices[slots.get(l["speaker"], l["speaker"]).lower()]
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128"
        for attempt in range(5):
            r = requests.post(url, headers={"xi-api-key": api_key},
                              json={"text": l["text"], "model_id": "eleven_multilingual_v2"}, timeout=120)
            if r.status_code == 200:
                (OUT_DIR / f"{l['id']}.mp3").write_bytes(r.content)
                done += 1
                print(f"  [{done}/{len(todo)}] {l['speaker']}: {l['text'][:48]}...")
                break
            if r.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt); continue
            print(f"  FAILED {r.status_code} on {l['id']} ({l['speaker']}): {r.text[:120]}"); break
    print(f"\ndone: {done}/{len(todo)} clips -> {OUT_DIR}")
    print("Reload the game — dialogs now speak. Missing clips stay silent.")

if __name__ == "__main__":
    main()
