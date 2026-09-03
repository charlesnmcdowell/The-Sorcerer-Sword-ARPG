#!/usr/bin/env python3
"""Generate per-personality voice lines for the Adventurer game via the
ElevenLabs pipeline in Kenji/Game init files (same key, model eleven_v3).

GDD §17a rules honored:
  - one personality = one voice, lines never cross
  - {target} is vocative and OMITTED in audio
  - third-party tokens are spoken as pronouns (neutral they/them so any
    referenced character fits); the text box shows names
  - output layout audio/vo/{personalityId}/{band}_{n}.mp3

Resumable: existing non-empty files are skipped, so re-running finishes an
interrupted pass without re-billing.
Usage: gen_voices.py <kenji_dir> <game_dir> [limit]
"""
import json, os, re, subprocess, sys, time, urllib.request, urllib.error
from pathlib import Path

KENJI = Path(sys.argv[1])
GAME = Path(sys.argv[2])
LIMIT = int(sys.argv[3]) if len(sys.argv) > 3 else 10**9

MODEL = "eleven_v3"
FMT = "mp3_44100_64"

# ---- casting: personality -> ElevenLabs voice id (sex-matched, vibe-cast) ----
# Edit and re-run to recast; delete that personality's folder to regenerate.
# Casting lives in tools/voice_casting.json (written by tools/import_dialogue.py
# from the review-copy markdown); Hiro's own voice is added here.
CASTING = json.loads((Path(__file__).parent / "voice_casting.json").read_text(encoding="utf-8"))
CASTING.setdefault("HIRO", "V8MrPOnARtlsjrlxEsE7")   # the author <- Zero Vex street samurai

def load_key():
    cfg = json.loads((KENJI / "Game init files" / "tts_config.json").read_text(encoding="utf-8"))
    return cfg["api_key"]

def load_dialogue():
    """Load the WHOLE personality library through the harness.

    It used to regex ADV.DATA.DIALOGUE out of dialogue.js, which silently
    missed every personality declared anywhere else — Hiro (dialogue_hiro.js)
    and, since the ninja/pirate add-on, M21-M30 and F21-F30 (dialogue2.js).
    Loading through node is the only reading that stays correct as files split.
    """
    harness = str((GAME / 'test' / 'harness').resolve()).replace('\\', '/')
    try:
        out = subprocess.run(
            ["node", "-e", "const {load}=require('" + harness + "');const A=load();"
                           "process.stdout.write(JSON.stringify(A.DATA.DIALOGUE))"],
            capture_output=True, text=True, check=True).stdout
        return json.loads(out)
    except Exception as e:
        print("harness load failed (" + str(e) + "); falling back to dialogue.js only")
        src = (GAME / "js" / "data" / "dialogue.js").read_text(encoding="utf-8")
        m = re.search(r"ADV\.DATA\.DIALOGUE = (\{.*\});", src, re.S)
        return json.loads(m.group(1))

PREP_RE = [
    (re.compile(r",\s*\{target\}"), ""),          # ", {target}" -> ""
    (re.compile(r"\{target\}[.!?]\s*"), ""),      # leading "{target}. "
    (re.compile(r"\{target\},?\s*"), ""),         # any leftover
]
def prep_text(line: str) -> str:
    t = line
    for rx, rep in PREP_RE:
        t = rx.sub(rep, t)
    # third-party tokens -> neutral pronouns (audio-safe for any referent)
    t = re.sub(r"\b(to|for|with|about|of|at|on|beside)\s+\{partner\}", r"\1 them", t)
    t = t.replace("{partner}", "they")
    t = t.replace("{they}", "they").replace("{them}", "them").replace("{their}", "their")
    t = t.replace("{self}", "")
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"\s+([,.!?])", r"\1", t)
    t = re.sub(r"^[,.\s]+", "", t)
    if t and t[0].islower():
        t = t[0].upper() + t[1:]
    return t

def tts(key: str, voice_id: str, text: str, out: Path) -> bool:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format={FMT}"
    body = json.dumps({
        "text": text,
        "model_id": MODEL,
        "voice_settings": {"stability": 0.45, "similarity_boost": 0.8},
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={
        "xi-api-key": key, "Content-Type": "application/json"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
            if len(data) < 400:
                raise RuntimeError("suspiciously small audio")
            tmp = out.with_suffix(".tmp")
            tmp.write_bytes(data)
            tmp.replace(out)
            return True
        except urllib.error.HTTPError as e:
            msg = e.read()[:300]
            print(f"  HTTP {e.code} {out.name}: {msg}", flush=True)
            if e.code in (429, 500, 502, 503):
                time.sleep(5 * (attempt + 1)); continue
            return False
        except Exception as e:
            print(f"  ERR {out.name}: {e}", flush=True)
            time.sleep(3 * (attempt + 1))
    return False

def main():
    key = load_key()
    dialogue = load_dialogue()
    vo_root = GAME / "audio" / "vo"
    done = fail = sent = 0
    only = os.environ.get("ONLY")   # e.g. ONLY=HIRO to (re)generate one personality
    for pid, p in sorted(dialogue.items()):
        if only and pid != only: continue
        voice = CASTING.get(pid)
        if not voice:
            print(f"NO CASTING for {pid}"); continue
        pdir = vo_root / pid
        pdir.mkdir(parents=True, exist_ok=True)
        for band in ("general", "friendly", "hatred", "romantic"):
            for i, line in enumerate(p[band]):
                out = pdir / f"{band}_{i + 1}.mp3"
                if out.exists() and out.stat().st_size > 400:
                    done += 1; continue
                if sent >= LIMIT:
                    print(f"limit reached; done={done} fail={fail}"); return
                text = prep_text(line)
                ok = tts(key, voice, text, out)
                sent += 1
                if ok:
                    done += 1
                    print(f"{pid} {out.name}: {text[:60]}", flush=True)
                else:
                    fail += 1
                time.sleep(0.35)
    print(f"COMPLETE done={done} fail={fail} sent={sent}", flush=True)

if __name__ == "__main__":
    main()
