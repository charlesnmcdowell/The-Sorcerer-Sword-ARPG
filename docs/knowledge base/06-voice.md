# 06 — Voice

How spoken dialogue works, how to generate/maintain it, and the planned future voice features.

## How playback works (runtime)

- Clips live in `assets/voice/<id>.mp3`. **`id` is a hash** (fnv1a-32) of `SPEAKER|text`. Same hash is computed in two places that MUST agree: `src/core/voice.js` (`VoiceMan.hash`) at runtime, and `tools/build_voice_manifest.js` at generation time.
- `VoiceMan.say(name, text)` (in `core/voice.js`) computes the id, plays `assets/voice/<id>.mp3`, and **ducks the music** while it plays. `CityUI.dialog()` calls this automatically when a dialog opens; clicking an option calls `VoiceMan.sayPlayer(label)` (the champion's own voice).
- **Missing clip = silence, never a crash.** The system is hardened so a missing/failed clip can't wedge later lines and always restores music volume (regression-tested by `tests/voicechain.js` + `voicetrace.js`).
- `speakerFor(rawName)` in `voice.js` maps a dialog title (e.g. `"SER HALDRIC"`) to a voice slot (`"HALDRIC"`). If you add a speaker, add it to this map AND to `build_voice_manifest.js`'s `speakerSlots`.
- Lines containing `{N}` (the player's nickname) are **deliberately not voiced** — the text is dynamic so it can't be pre-recorded (this is why Marlow's greeting is silent; that's expected, not a bug).

## The toolchain (in `game/tools/`)

| Tool | Run | Does |
|---|---|---|
| `build_voice_manifest.js` | `node tools/build_voice_manifest.js` | Scans all dialogue → writes `voice_manifest.json` (every voiced line + its id + speaker). Also writes a coverage report to `docs/VOICE_STATUS.md`. **Run after any dialogue text change.** |
| `generate_voices.py` | `python tools/generate_voices.py --yes` | Calls ElevenLabs to synthesize clips that are MISSING from disk. Resumable — skips clips that exist. Needs the API key in `voice_config.json`. |
| `normalize_voices.py` | `python tools/normalize_voices.py` | Loudness-normalizes every clip to ~-19 LUFS so nothing is louder/quieter than the rest. Backs up originals to `assets/voice/_raw/` once; re-runnable from those backups. **Run once after generating new clips.** |

### Config & the API key

`tools/voice_config.json` holds the ElevenLabs `api_key` and a `voices` map (speaker → ElevenLabs voice id). **This file is gitignored — never commit the key.** If you regenerate voices and a speaker has no id, the tool prints the slot + casting brief and asks you to paste an id (it will NOT auto-design voices, because the account hit its custom-voice limit; pass `--design` only if you intend to spend voice slots).

### Generating after a change (the full loop)

```sh
node game/tools/build_voice_manifest.js          # refresh manifest + coverage
python game/tools/generate_voices.py --dry-run   # preview cost (free)
python game/tools/generate_voices.py --yes       # synthesize missing clips
python game/tools/normalize_voices.py            # level loudness
node game/tools/gen_wiki.js                       # (optional) refresh wiki
```
Re-record one line: delete its `assets/voice/<id>.mp3` and rerun `--yes`.

### Checking coverage

`docs/VOICE_STATUS.md` (auto-written by `build_voice_manifest.js`) lists, per speaker, voiced/total and every still-unvoiced line. Use it to know what needs generating.

## Known voice debts (as of this writing)

13 lines unvoiced: the companion banter (Cookie, Brakka, Vexa), the Veiled Woman's 2nd line, and AnkuNyx's finale line. These need the 5 corresponding ElevenLabs voices to still exist in the account's library; if they were deleted, paste fresh ids into `voice_config.json` and rerun. Main-quest, narrator, and player lines are fully voiced.

## Future voice modules (planned / idea-stage — NOT built)

These are aspirational. Capturing the design so a future maintainer can build them.

### 1. On-the-fly AI character voices (TTS for live companion chat)
The companions already support **live AI text** when an Anthropic key is set (`config.js`, `core/companionAI.js`). Today that text is silent (no pre-recorded clip exists for dynamic responses). Module idea: when a companion produces an AI line, send that text to a TTS API (ElevenLabs streaming or similar) using that companion's voice id, and play the returned audio through `VoiceMan` instead of looking up a pre-baked clip.
- **Where it hooks in:** `companionAI.js` (after the AI reply text is produced) → a new `VoiceMan.sayDynamic(voiceId, text)` that streams TTS rather than fetching a static file.
- **Considerations:** per-line API cost + latency; needs a server proxy to keep the TTS key off the client; cache by hash to avoid re-paying for repeated lines.

### 2. Player → game voice interface (voice commands / spoken responses)
Idea: let the player **talk to the game** — issue commands ("attack", "follow", "go to the inn", "use a potion") or speak dialogue choices aloud, via the browser's `SpeechRecognition` (Web Speech API).
- **Command mode:** map recognized phrases to existing actions (`combat.doSlash()`, `QuestNav.startTracking`, belt use, dialog option selection). Start with a small fixed vocabulary.
- **Conversational mode:** pipe recognized speech into `companionAI.js` as the player's chat input, so you can *talk* to companions and hear AI+TTS replies (combines with module 1).
- **Considerations:** Web Speech API support/quality varies by browser (best on Chrome); needs a push-to-talk button and clear visual feedback; must not interfere with the touch stick or AUTO mode; accessibility win but treat as opt-in.

> Both modules are additive and should sit behind a setting (in `SettingsUI`) so the core game keeps working with zero dependencies.
