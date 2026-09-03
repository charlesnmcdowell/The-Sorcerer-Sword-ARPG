#!/usr/bin/env python3
"""Generate the campaign voice lines (campaign doc §8) via ElevenLabs.

Rules honored:
  - twelve campaign characters, twelve voices, none reused from the 40
    personality voices in gen_voices.py
  - every clip is the NAME-FREE spoken variant: the text box and name plate
    carry names, the audio never does (tools/dump_campaign_vo.js checks it)
  - output layout audio/vo/campaign/{charId}/{beat}_{n}.mp3

Usage: gen_campaign_voices.py <game_dir> <key_file|kenji_dir> [limit]
Resumable: existing non-empty files are skipped.
"""
import json, re, subprocess, sys, time, urllib.request, urllib.error
from pathlib import Path

GAME = Path(sys.argv[1])
KEYSRC = Path(sys.argv[2])
LIMIT = int(sys.argv[3]) if len(sys.argv) > 3 else 10**9
MODEL = "eleven_v3"
FMT = "mp3_44100_64"

# ---- casting: campaign character -> ElevenLabs voice id (all distinct from
# the personality casting; drawn from the account's own designed voices) ----
# Casting lives in tools/voice_casting.json (written by tools/import_dialogue.py).
CASTING = {k: v for k, v in json.loads((Path(__file__).parent / "voice_casting.json").read_text(encoding="utf-8")).items() if not (k[0] in "MF" and len(k) == 3)}

def load_key():
    if KEYSRC.is_file():
        return KEYSRC.read_text(encoding="utf-8").strip()
    cfg = json.loads((KEYSRC / "Game init files" / "tts_config.json").read_text(encoding="utf-8"))
    return cfg["api_key"]

def load_lines():
    dump = GAME / "tools" / "dump_campaign_vo.js"
    out = Path("/tmp/campaign_vo.json") if Path("/tmp").is_dir() else GAME / "campaign_vo.json"
    subprocess.run(["node", str(dump), str(out)], check=True)
    return json.loads(out.read_text(encoding="utf-8"))

def prep(t):
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"\s+([,.!?])", r"\1", t)
    if t and t[0].islower():
        t = t[0].upper() + t[1:]
    return t

def tts(key, voice_id, text, out):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format={FMT}"
    body = json.dumps({"text": text, "model_id": MODEL,
                       "voice_settings": {"stability": 0.45, "similarity_boost": 0.8}}).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
            if len(data) < 400:
                raise RuntimeError("suspiciously small audio")
            tmp = out.with_suffix(".tmp"); tmp.write_bytes(data); tmp.replace(out)
            return True
        except urllib.error.HTTPError as e:
            print(f"  HTTP {e.code} {out}: {e.read()[:300]}", flush=True)
            if e.code in (429, 500, 502, 503):
                time.sleep(5 * (attempt + 1)); continue
            return False
        except Exception as e:
            print(f"  ERR {out}: {e}", flush=True); time.sleep(3 * (attempt + 1))
    return False

def main():
    key = load_key()
    lines = load_lines()
    root = GAME / "audio" / "vo" / "campaign"
    done = fail = sent = 0
    for who, beats in sorted(lines.items()):
        voice = CASTING.get(who)
        if not voice:
            print(f"NO CASTING for {who}"); continue
        d = root / who; d.mkdir(parents=True, exist_ok=True)
        for beat, arr in sorted(beats.items()):
            for i, text in enumerate(arr):
                out = d / f"{beat}_{i + 1}.mp3"
                if out.exists() and out.stat().st_size > 400:
                    done += 1; continue
                if sent >= LIMIT:
                    print(f"limit reached; done={done} fail={fail}"); return
                ok = tts(key, voice, prep(text), out); sent += 1
                if ok: done += 1; print(f"{who}/{out.name}: {text[:60]}", flush=True)
                else: fail += 1
                time.sleep(0.3)
    print(f"COMPLETE done={done} fail={fail} sent={sent}", flush=True)

if __name__ == "__main__":
    main()
