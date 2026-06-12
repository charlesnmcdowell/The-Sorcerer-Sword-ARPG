# Voice Cast & Generation Plan — The Ankuspawn Conspiracy

## Locked decisions (Hiro, 2026-06-12)
Engine **ElevenLabs v3** with performance tags ([laughs], [sighs], [clears throat]…). Scope IN: character bios (narrator), all spoken NPC dialogs, story narration blocks, signposts/flavor reads. Scope OUT: hints, after-battle screens, Bellow's board taunts, death quotes. Casting: **full-auto voice design** from briefs below. Narrator = `qRlggZwkZ89qLUe4wsqh` (distinct from Kenji).

## Cast sheet
| Speaker | Voice source | Note |
|---|---|---|
| NARRATOR (+ all signs/flavor) | `qRlggZwkZ89qLUe4wsqh` (locked) | bios, narration blocks, journal beats |
| ANKUNYX | `tts_config.json → Kenji` (`SBeVjlAyPCwBVd6RVxhx`) | book character — Kenji's voice, correctly his |
| SHEN SAMA | `tts_config.json → Shen Sama` if filled, else designed | book/campaign character — fill his slot if he has a canon voice |
| COOKIE | `tts_config.json → Cookie` if filled, else designed | live PC — fill her slot if she has a canon voice |
| MARLOW | designed ("Innkeeper" brief) | game-original |
| QUARRY BOY, VEILED WOMAN | designed | game-original |
| BRAKKA, VEXA, DORIAN, FAELAR, SYLVARA, PIPPA | designed | game-original companions |

Designed voices are created once via the voice-design API, named `ARPG <name>`, and the IDs persist in `game/tools/game_voices.json` (so reruns reuse them). **If Cookie or Shen Sama have canon voices, paste their IDs into your `tts_config.json` slots BEFORE running** — config voices outrank designed ones for book characters.

## Performance scripts
`game/tools/performance_script.json` — 38 key lines rewritten with v3 audio tags (Marlow's conspiratorial leans, Cookie's mid-line laughs, Shen Sama's rasp and sniff, the Veiled Woman's cracking voice, AnkuNyx's terrifying calm, the quarry boy's shaking). Edit freely — the game's display text never changes, only the synthesized read. Rebuild the manifest after edits.

## Run order (your machine)
```
node game/tools/build_voice_manifest.js
python game/tools/generate_voices.py --dry-run     # free validation + cost preview
python game/tools/generate_voices.py               # designs voices, then synthesizes
```
Cost: ~78 lines ≈ $3–6 (v3) + voice-design overhead. Resumable: existing clips are skipped; for a retake, delete `game/assets/voice/<id>.mp3` and rerun.

## After generation (V3 bucket — me)
Loudness normalization across all clips (ffmpeg loudnorm), in-game listening pass with you, retake list, final commit.
