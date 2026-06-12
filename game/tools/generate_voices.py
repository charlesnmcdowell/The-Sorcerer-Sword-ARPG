#!/usr/bin/env python3
"""
generate_voices.py — voice acting for The Ankuspawn Conspiracy via ElevenLabs v3.
Follows the chapter_tts.py conventions: same config, validate-then-abort, cost gating.

Pipeline:
  1. node game/tools/build_voice_manifest.js     (refresh manifest + performance tags)
  2. python game/tools/generate_voices.py --dry-run
  3. python game/tools/generate_voices.py        (designs missing voices FULL-AUTO from
                                                  casting briefs, then synthesizes)

Voice resolution order per speaker:
  1. game_voices.json (this game's cast — auto-written when voices are designed)
  2. your tts_config.json character_voices (book characters: Kenji/AnkuNyx, etc.)
  3. unmapped flavor speakers fall back to the game Narrator
  4. still nothing -> designed via the voice-design API from CASTING_BRIEFS below

Output: game/assets/voice/<id>.mp3 (eleven_v3, audio tags render as performance)
"""
import json, sys, time, argparse
from pathlib import Path
try:
    import requests
except ImportError:
    sys.exit("pip install requests")

HERE = Path(__file__).resolve().parent
DEFAULT_CONFIG = Path("C:/Users/charl/OneDrive/Documents/TTRPG/Kenji/Game init files/tts_config.json")
GAME_VOICES = HERE / "game_voices.json"
OUT_DIR = HERE.parent / "assets" / "voice"
MODEL = "eleven_v3"

# Locked by Hiro: game narrator voice (distinct from Kenji; Kenji/AnkuNyx keeps his book voice)
SEED_VOICES = {
    "Narrator": "qRlggZwkZ89qLUe4wsqh",
}

# Casting briefs for FULL-AUTO voice design (only used when no voice exists anywhere)
CASTING_BRIEFS = {
    "Bellow":       "Booming gravel-voiced fantasy arena announcer, male, 50s, theatrical showman with a smoker's rasp, equal parts carnival barker and undertaker.",
    "Marlow":       "Weathered male innkeeper, 60s, low conspiratorial tavern voice, warm but shrewd, every sentence sounds like it costs you a coin.",
    "Quarry Boy":   "Young rural man, late teens, shaken but defiant, breathless country accent, voice still cracking between fear and anger.",
    "Veiled Woman": "Woman mid-30s, desperate dignity, refined accent fraying at the edges, grief held behind clenched control.",
    "Shen Sama":    "Ancient voice in a young man's throat — low, dry, faintly inhuman resonance, words chosen like a creature that has outlived many names.",
    "Cookie":       "Young halfling woman, bright fast mischievous energy, performer's projection, grins audibly, switchblade-quick between joy and dead-serious.",
    "Brakka":       "Orc mercenary, deep gravel bass, terse and unhurried, professional soldier's flatness with buried warmth.",
    "Vexa":         "Tiefling alchemist, young woman, manic gleeful energy, talks fast, delighted by danger, slightly unhinged giggle.",
    "Dorian":       "Disgraced human knight, warm formal baritone, 40s, self-deprecating, every word stands at parade rest.",
    "Faelar":       "Wood-elf grove keeper, serene ageless tenor, unhurried, dry wit arriving a beat late, speaks like deep water.",
    "Sylvara":      "Dark-elf exiled noble, cold precise aristocratic alto, cutting consonants, contempt as default register with one buried wound.",
    "Pippa":        "Halfling treasure hunter, bright cheerful quick woman, relentlessly upbeat, mid-sentence laughs, zero despair.",
}

def design_voice(api_key, slot, brief, sample_text):
    """Full-auto: design -> take first preview -> create. Returns voice_id."""
    r = requests.post("https://api.elevenlabs.io/v1/text-to-voice/design",
        headers={"xi-api-key": api_key},
        json={"voice_description": brief, "text": (sample_text or brief)[:950].ljust(100, '.'),
              "model_id": "eleven_multilingual_ttv_v2"}, timeout=180)
    r.raise_for_status()
    previews = r.json().get("previews", [])
    if not previews: raise RuntimeError("no previews returned for " + slot)
    gen_id = previews[0]["generated_voice_id"]
    r2 = requests.post("https://api.elevenlabs.io/v1/text-to-voice",
        headers={"xi-api-key": api_key},
        json={"voice_name": "ARPG " + slot, "voice_description": brief, "generated_voice_id": gen_id},
        timeout=120)
    r2.raise_for_status()
    return r2.json()["voice_id"]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--yes", action="store_true")
    ap.add_argument("--only", help="comma list of speakers (e.g. COOKIE,MARLOW)")
    args = ap.parse_args()

    manifest = json.loads((HERE / "voice_manifest.json").read_text(encoding="utf-8"))
    cfg = json.loads(args.config.read_text(encoding="utf-8"))
    api_key = cfg.get("api_key", "")
    book_voices = {k.lower(): v for k, v in cfg.get("character_voices", {}).items()
                   if not k.startswith("_") and v}
    game_voices = json.loads(GAME_VOICES.read_text(encoding="utf-8")) if GAME_VOICES.exists() else dict(SEED_VOICES)
    slots = manifest["speakerSlots"]

    def slot_for(speaker): return slots.get(speaker, "Narrator")
    def voice_for(speaker):
        s = slot_for(speaker)
        return game_voices.get(s) or book_voices.get(s.lower()) or None

    lines = manifest["lines"]
    if args.only:
        keep = {s.strip().upper() for s in args.only.split(",")}
        lines = [l for l in lines if l["speaker"] in keep]
    todo = [l for l in lines if not (OUT_DIR / f"{l['id']}.mp3").exists()]
    print(f"[1/5] {len(lines)} lines in scope · {len(lines)-len(todo)} done · {len(todo)} to synthesize · model {MODEL}")

    need_design = sorted({slot_for(l["speaker"]) for l in todo if not voice_for(l["speaker"])})
    unknown = [s for s in need_design if s not in CASTING_BRIEFS]
    if unknown:
        print("=== NO VOICE AND NO CASTING BRIEF for:", unknown); sys.exit(1)
    print(f"[2/5] voices: {len(need_design)} to design full-auto: {need_design or 'none'}")

    chars = sum(len(l.get("vtext", l["text"])) for l in todo)
    print(f"[3/5] cost preview: {chars} chars ≈ ${chars*0.00015:.2f}–${chars*0.0003:.2f}"
          f" + ~{len(need_design)*3000} design chars")
    if args.dry_run: print("dry run — nothing sent."); return
    if not api_key: sys.exit("tts_config.json api_key is empty")
    if not args.yes and input("Proceed? [y/N] ").strip().lower() != "y": sys.exit("aborted")

    print("[4/5] designing voices...")
    for slot in need_design:
        sample = next((l.get("vtext", l["text"]) for l in todo if slot_for(l["speaker"]) == slot), "")
        vid = design_voice(api_key, slot, CASTING_BRIEFS[slot], sample)
        game_voices[slot] = vid
        GAME_VOICES.write_text(json.dumps(game_voices, indent=2), encoding="utf-8")
        print(f"  designed {slot} -> {vid}")

    print("[5/5] synthesizing...")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    done = 0
    for l in todo:
        vid = voice_for(l["speaker"])
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128"
        for attempt in range(5):
            r = requests.post(url, headers={"xi-api-key": api_key},
                              json={"text": l.get("vtext", l["text"]), "model_id": MODEL}, timeout=180)
            if r.status_code == 200:
                (OUT_DIR / f"{l['id']}.mp3").write_bytes(r.content); done += 1
                print(f"  [{done}/{len(todo)}] {l['speaker']}: {l['text'][:46]}..."); break
            if r.status_code in (429, 500, 502, 503, 504): time.sleep(2 ** attempt); continue
            print(f"  FAILED {r.status_code} {l['id']} ({l['speaker']}): {r.text[:100]}"); break
    print(f"\ndone: {done}/{len(todo)} -> {OUT_DIR}\nReload the game. For retakes: delete the clip and rerun.")

if __name__ == "__main__":
    main()
