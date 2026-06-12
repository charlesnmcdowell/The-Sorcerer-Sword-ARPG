#!/usr/bin/env python3
"""
ARPG VOICE STUDIO — standalone voice acting generator for The Ankuspawn Conspiracy.
Self-contained: config + cast live in THIS folder. Pure standard library (no pip).

  python generate_voices.py --check      verify key + show remaining credits (free)
  python generate_voices.py --dry-run    validate cast + cost preview (free)
  python generate_voices.py              design missing voices, synthesize all lines
  python generate_voices.py --only COOKIE,MARLOW      (subset)

Or just double-click Generate_Voices.bat.

Config: voice_config.json (api_key + voice ids). Characters without an id get a
voice DESIGNED automatically from the briefs below; the new id is saved back to
voice_config.json (named "ARPG <name>" in your ElevenLabs account) so it's never
re-bought. Output: ../assets/voice/<id>.mp3 — already-generated clips are skipped,
so reruns are cheap and retakes are: delete the clip, rerun.
"""
import json, sys, time, argparse, ssl
import urllib.request, urllib.error
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONFIG = HERE / "voice_config.json"
OUT_DIR = HERE.parent / "assets" / "voice"
API = "https://api.elevenlabs.io"

BRIEFS = {
    "Bellow":       "Booming gravel-voiced fantasy arena announcer, male, 50s, theatrical showman with a smoker's rasp, equal parts carnival barker and undertaker.",
    "Marlow":       "Weathered male innkeeper, 60s, low conspiratorial tavern voice, warm but shrewd, every sentence sounds like it costs you a coin.",
    "Quarry Boy":   "Young rural man, late teens, shaken but defiant, breathless country accent, voice still cracking between fear and anger.",
    "Veiled Woman": "Woman mid-30s, desperate dignity, refined accent fraying at the edges, grief held behind clenched control.",
    "Shen Sama":    "Ancient voice in a young man's throat - low, dry, faintly inhuman resonance, words chosen like a creature that has outlived many names.",
    "Cookie":       "Young halfling woman, bright fast mischievous energy, performer's projection, grins audibly, switchblade-quick between joy and dead-serious.",
    "Brakka":       "Orc mercenary, deep gravel bass, terse and unhurried, professional soldier's flatness with buried warmth.",
    "Vexa":         "Tiefling alchemist, young woman, manic gleeful energy, talks fast, delighted by danger, slightly unhinged giggle.",
    "Dorian":       "Disgraced human knight, warm formal baritone, 40s, self-deprecating, every word stands at parade rest.",
    "Faelar":       "Wood-elf grove keeper, serene ageless tenor, unhurried, dry wit arriving a beat late, speaks like deep water.",
    "Sylvara":      "Dark-elf exiled noble, cold precise aristocratic alto, cutting consonants, contempt as default register with one buried wound.",
    "Pippa":        "Halfling treasure hunter, bright cheerful quick woman, relentlessly upbeat, mid-sentence laughs, zero despair.",
    "Druid":        "Young woman early 20s, warm earthy low alto, frontier-raised plainspoken cadence, blunt but kind, a listening quality as if she hears something underneath every room.",
    "Warlock":      "Dark elf man, silken ominous baritone, unhurried and precise, faint amusement like a knife being admired, every sentence a quiet contract.",
    "Seraphim":     "Celestial angel with three heads, resonant layered voice, calm absolute authority, warm like distant trumpets, faintly choral undertone.",
    "Kargoth":      "Ogre warchief, colossal slow bass like falling rock, unhurried and amused, simple heavy words.",
    "Skarva":       "Orc swordswoman, low rasping alto, dry military precision, every sentence a clean cut, faint professional relish.",
    "Nibnob":       "Goblin king, shrill gleeful rapid-fire tenor, theatrical royal pomp collapsing into squeaks, real cunning under the comedy.",
    "Aurvaeth":     "Ancient dragon wearing a human shape, vast slow baritone with geological patience, faint amusement, words chosen across centuries.",
    "Haldric":      "Paladin commander, 40s, court-room calm baritone, polished righteous certainty, every sentence a verdict already signed.",
    "Sallow":       "Inquisitor, thin dry voice like paper turning, clipped and bloodless, a small terrible smile audible at the edges.",
    "Pale Courier": "Elegant bloodless woman, low velvet alto, funeral-parlor poise, amused by everything and warmed by nothing.",
    "Nyx":          "The Lich Queen — a beloved portrait that moves. Regal warm contralto over something centuries-cold, perfect courtesy, absolute power, faintly amused.",
}

def http(method, path, key, payload=None, timeout=180):
    req = urllib.request.Request(API + path, method=method,
        headers={"xi-api-key": key, "content-type": "application/json"},
        data=json.dumps(payload).encode() if payload is not None else None)
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except Exception as e:
        return 0, str(e).encode()

def load():
    if not CONFIG.exists():
        sys.exit(f"missing {CONFIG} - it should be in the repo; re-pull.")
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    man = json.loads((HERE / "voice_manifest.json").read_text(encoding="utf-8"))
    return cfg, man

def check(cfg):
    print("=== ARPG VOICE STUDIO - CHECK ===")
    print(f"config: {CONFIG}")
    key = cfg.get("api_key", "")
    print(f"api_key: {'set (' + str(len(key)) + ' chars)' if key else 'EMPTY - paste it into voice_config.json'}")
    if not key: return False
    st, body = http("GET", "/v1/user/subscription", key, None, 30)
    if st != 200:
        print(f"ElevenLabs says NO ({st}): {body[:200].decode(errors='replace')}")
        print("-> key invalid/expired, or no network. Fix and rerun --check.")
        return False
    sub = json.loads(body)
    used, limit = sub.get("character_count", 0), sub.get("character_limit", 0)
    print(f"ElevenLabs OK - tier: {sub.get('tier','?')} - credits used {used:,} of {limit:,} ({limit-used:,} remaining)")
    return True

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--yes", action="store_true")
    ap.add_argument("--design", action="store_true",
        help="design missing voices automatically (costs voice slots + credits). Default: ask Hiro for ids instead.")
    ap.add_argument("--only")
    args = ap.parse_args()

    cfg, man = load()
    if args.check:
        sys.exit(0 if check(cfg) else 1)

    key = cfg.get("api_key", "")
    voices = cfg.get("voices", {})
    slots = man["speakerSlots"]
    slot_for = lambda sp: slots.get(sp, "Narrator")

    lines = man["lines"]
    if args.only:
        keep = {s.strip().upper() for s in args.only.split(",")}
        lines = [l for l in lines if l["speaker"] in keep]
    todo = [l for l in lines if not (OUT_DIR / f"{l['id']}.mp3").exists()]
    print(f"[1/4] {len(lines)} lines in scope - {len(lines)-len(todo)} already on disk - {len(todo)} to synthesize - model {cfg.get('model','eleven_v3')}")
    if not todo:
        print("nothing to do - all clips exist. (Delete a clip to retake it.)"); return

    need_slots = set()
    for l in todo:
        for g in (l.get("segs") or [{"sp": l["speaker"]}]):
            sl = slots.get(g["sp"], "Narrator")
            if not voices.get(sl): need_slots.add(sl)
    need = sorted(need_slots)
    bad = [s for s in need if s not in BRIEFS]
    if bad: sys.exit(f"no voice and no brief for: {bad}")
    print(f"[2/4] voices to design from briefs: {need or 'none'}")

    chars = sum(len(l.get("vtext", l["text"])) for l in todo)
    print(f"[3/4] cost: ~{chars:,} chars (= roughly {chars:,} credits) + ~{len(need)*1000} for voice design")
    if args.dry_run:
        print("dry run - nothing sent. Run without --dry-run to generate."); return
    if not key: sys.exit("api_key empty in voice_config.json - run --check first")
    if not args.yes and input("Proceed? [y/N] ").strip().lower() != "y": sys.exit("aborted")

    print("[4/4] generating...")
    skipped = set()  # voices without ids — their lines wait, everything else proceeds
    if need and not args.design:
        # the account hit its custom-voice limit once already: never auto-design.
        # Ask for ids from the existing ElevenLabs library instead.
        print("  NEED VOICE IDS (auto-design is OFF — your account hit the voice-slot limit before).")
        print("  Paste ids from your ElevenLabs voice library into voice_config.json under \"voices\":")
        for slot in need:
            print(f'    "{slot}": "<voice_id>"   <- {BRIEFS.get(slot, "")[:100]}')
        print("  Then rerun this same command. (Or rerun with --design to spend voice slots designing them.)")
        skipped = set(need); need = []
    for slot in need:
        sample = BRIEFS[slot]
        for l in todo:
            for g in (l.get("segs") or [{"sp": l["speaker"], "t": l.get("vtext", l["text"])}]):
                if slots.get(g["sp"], "Narrator") == slot and len(g["t"]) > len(sample): sample = g["t"]
        st, body = http("POST", "/v1/text-to-voice/design", key,
            {"voice_description": BRIEFS[slot], "text": sample[:950] if len(sample) >= 100 else (sample + " " + BRIEFS[slot])[:950],
             "model_id": "eleven_multilingual_ttv_v2"})
        if st != 200:
            print(f"  !! could not design '{slot}' ({st}): {body[:160].decode(errors='replace')}")
            print(f"     -> paste an existing voice id into voice_config.json under \"{slot}\" and rerun; skipping its lines for now.")
            skipped.add(slot); continue
        gen = json.loads(body)["previews"][0]["generated_voice_id"]
        st, body = http("POST", "/v1/text-to-voice", key,
            {"voice_name": "ARPG " + slot, "voice_description": BRIEFS[slot], "generated_voice_id": gen})
        if st != 200:
            print(f"  !! could not save designed voice '{slot}' ({st}): {body[:160].decode(errors='replace')}")
            skipped.add(slot); continue
        voices[slot] = json.loads(body)["voice_id"]
        cfg["voices"] = voices
        CONFIG.write_text(json.dumps(cfg, indent=2), encoding="utf-8")
        print(f"  + designed {slot} -> {voices[slot]}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    def synth(vid, text):
        for attempt in range(5):
            st, body = http("POST", f"/v1/text-to-speech/{vid}?output_format=mp3_44100_128", key,
                {"text": text, "model_id": cfg.get("model", "eleven_v3")})
            if st == 200: return body
            if st in (429, 500, 502, 503, 504): time.sleep(2 ** attempt); continue
            print(f"  FAILED {st}: {body[:160].decode(errors='replace')}"); return None
        return None
    done = fails = waiting = 0
    for l in todo:
        segs = l.get("segs") or [{"sp": l["speaker"], "t": l.get("vtext", l["text"])}]
        if any(slots.get(g["sp"], "Narrator") in skipped for g in segs):
            waiting += 1; continue  # needs a voice we couldn't design — picks up on the next run
        chunks = []
        ok = True
        for g in segs:
            vslot = slots.get(g["sp"], "Narrator")
            b = synth(voices[vslot], g["t"])
            if b is None: ok = False; break
            chunks.append(b)
        if ok:
            (OUT_DIR / f"{l['id']}.mp3").write_bytes(b"".join(chunks)); done += 1
            tag = "+narr" if len(segs) > 1 else ""
            print(f"  [{done}/{len(todo)}] {l['speaker']}{tag}: {l['text'][:42]}...")
        else: fails += 1
    print(f"\ndone: {done} generated, {fails} failed" + (f", {waiting} waiting on missing voices ({', '.join(sorted(skipped))})" if waiting else "") + f" -> {OUT_DIR}")
    print("Reload the game - dialogs speak. Retake a line: delete its mp3, rerun.")

if __name__ == "__main__":
    main()
