# Cinematic timing + voice bugs (user-reported 2026-06-20)

Two cinematics play too fast (voice lines get cut off before finishing) and speak in the NARRATOR voice
instead of the character's voice. Fix timing + voice + invuln window. After edits: node --check, keep all
champions playable, REPUBLISH (publish_inplace.py). The voice-CLIP regeneration is a separate user-run step
(generate_voices.py) — see bottom.

## Cinematic 1 — Warlock "Arch Devil" outro  (src/combat/pit.js, archDevilOutro() ~line 702)
- The ARCH DEVIL taunt (archVoice('THE ARCH DEVIL', taunt), ~line 720) must speak in the WARLOCK voice.
- The descending SERAPHIM line (archVoice('THE SERAPHIM', seraph), ~line 727) must speak in the SERAPHIM voice.
- Currently both resolve to NARRATOR.
- TIMING: phases fire via setTimeout at 2800ms (phase2) and 5200ms (phase3); banners 2600/2400ms;
  P.paralyzeT=5 (the untouchable window, see archCine 'SPARED' guard ~line 1304). The voice clips are longer
  than the gaps, so they cut off and the player can act too soon. FIX: lengthen each phase gap and the
  untouchable/paralyze window so each line fully plays before the next phase, and the warlock stays
  untouchable for the WHOLE cinematic. Suggested: phase2 ~4500ms, phase3 ~8000ms, final withdraw a bit
  after; P.paralyzeT and the archCine 'SPARED' window >= total cinematic length (~9-10s); bump banner
  durations to match; keep S.slow cinematic. Tune so nothing is cut off.

## Cinematic 2 — Seraphim kill / fly-off
- The Seraphim's own kill+fly-off cinematic (and/or the duel banners 'THE SERAPHIM KNEELS' ~1358 /
  'THE SERAPHIM RISES' ~2016, and ascend() ~944) has the same issues: too fast + lines in Narrator voice.
- Find every VoiceMan.say / archVoice call tied to the Seraphim's kill/ascend cinematic; ensure they use the
  SERAPHIM voice, slow the animation, and extend the invuln/untouchable window so the lines finish.
- (Note: the Seraphim "flies off" beat is also the withdraw phase of Cinematic 1 — handle both.)

## Voice routing fix (the "narrator instead of character" cause)
The runtime resolver is src/core/voice.js -> VoiceMan, with a speaker->voice alias map (~lines 20-39).
'THE ARCH DEVIL' and 'THE SERAPHIM' are NOT in it, so they default to NARRATOR.
1. Add aliases in voice.js VoiceMan map:  'THE ARCH DEVIL' -> 'WARLOCK',  'THE SERAPHIM' -> 'SERAPHIM'
   (voice_config.json voices: Warlock=GafoPURpq5ta99iwARDD, Seraphim=HMvHZWb0ZWSo5Kc5l22D, Narrator=qRll...).
2. Mirror the SAME speaker->voice mapping in tools/build_voice_manifest.js so the manifest generates these
   lines' clips under the Warlock/Seraphim voice ids (clip hash = f(voiceId, text); wrong voice => narrator clip).
3. Make sure the cinematic line banks are extracted into the manifest: the taunts in Quests.archDevilOutro
   (taunts[] + seraph line, quests.js ~line 782) must be added() under THE ARCH DEVIL / THE SERAPHIM speakers.
4. Rebuild the manifest:  node tools/build_voice_manifest.js   (free; regenerates voice_manifest.json)
   Verify the new entries appear with the correct voice ids and that no cinematic line maps to the Narrator id.

## QA
node --check on pit.js, voice.js; headless smoke; play the warlock arch-devil expiry and a seraph kill —
lines finish, in the right voices, player untouchable through the whole scene; no softlock. Then republish.

## VOICE CLIP GENERATION (user runs — costs a few ElevenLabs cents)
After the manifest rebuild adds the cinematic lines, generate the new clips:
   cd "C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG\game\tools"
   python generate_voices.py --check      (free: verify key + credits)
   python generate_voices.py --yes        (generates only the new/changed clips into assets/voice/)
Then republish so the new clips ship.

================================================================================
## DONE — automated run 2026-06-20 (code + manifest + QA + publish complete)

WHAT CHANGED (code is live; only the user-run voice-clip gen + a final republish remain):

1. VOICE ROUTING (the "narrator instead of character" bug) — FIXED.
   - Root cause: the old clips on disk (ids hashed from 'THE ARCH DEVIL|…' / 'THE SERAPHIM|…')
     were baked in the NARRATOR voice (generated before speakerSlots mapped them), and
     generate_voices.py SKIPS files that already exist — so regenerating alone wouldn't fix them.
   - Fix: src/core/voice.js speakerFor() MAP now aliases
        'THE ARCH DEVIL' -> 'WARLOCK'   and   'THE SERAPHIM' -> 'SERAPHIM'.
     This changes each line's hash id, so the manifest now points at BRAND-NEW ids with no
     stale clip — they regenerate fresh in the correct voices. (Old narrator clips are now
     orphaned/unused; safe to leave or delete.)
   - tools/build_voice_manifest.js speakerSlots gained 'WARLOCK' -> Warlock and
     'SERAPHIM' -> Seraphim so the new speaker fields resolve to the right ElevenLabs ids.
   - Manifest rebuilt (node tools/build_voice_manifest.js). VERIFIED: all 10 Arch-Devil taunts
     map to Warlock id GafoPURpq5ta99iwARDD; all 4 Seraphim lines map to Seraphim id
     HMvHZWb0ZWSo5Kc5l22D; ZERO map to the Narrator id. 14 new ids need clips (clip=False).

2. TIMING + INVULN (src/combat/pit.js, archDevilOutro ~line 702) — FIXED.
   - phase2 (Seraphim descends) setTimeout 2800ms -> 4500ms  (taunt voice finishes first)
   - phase3 (strike / lich) setTimeout 5200ms -> 8000ms      (Seraphim voice finishes first)
   - banners: 'THE ARCH DEVIL' 2600 -> 4200ms; 'THE SERAPHIM' 2400 -> 3300ms;
     'THE DEVIL IS CAST DOWN' 2400 -> 2800ms.
   - P.paralyzeT=Math.max(P.paralyzeT,5) -> Math.max(P.paralyzeT,10): invuln/freeze now covers
     the whole ~10s cinematic. The archCine 'SPARED' guard (~line 1304) already makes the player
     untouchable for the ENTIRE time archCine is non-null, and archCine still clears via the
     ph>=4 fade/seraphY/lich fallback — no softlock.
   - Note re: Cinematic 2 (Seraphim "kill / fly-off"): the Seraphim's fly-off IS the withdraw
     phase of this same cinematic and its voiced line is the descent line above (now SERAPHIM
     voice + slowed + invuln). The separate seraph-PLAYER grace beat (KNEELS/RISES, ~1351/2016)
     has no voice lines and already runs a 10s kneelT/paralyzeT invuln window — left as is.

3. QA — PASSED.
   - node --check pit.js, voice.js, build_voice_manifest.js: all OK.
   - runtime<->manifest hash agreement confirmed (e.g. Seraphim descent line -> e7c9f5b0, matches manifest).
   - tests/voicetrace.js PASS, tests/voicechain.js PASS.
   - tests/gauntlet.js assist warlock -> VICTORY fight 20/20 (arch-devil expiry cinematic resolves, no softlock).
   - tests/gauntlet.js assist seraph  -> VICTORY fight 20/20 (grace cinematic resolves, no softlock).

4. PUBLISHED: python tools/publish_inplace.py -> Neverendingnarratives/play (build 1781964490).
   Verified the deployed play/src/core/voice.js + play/src/combat/pit.js contain the changes.

>>> USER ACTION STILL REQUIRED (the only remaining step — costs a few ElevenLabs cents) <<<
   The 14 cinematic lines now point at NEW clip ids that don't exist yet, so for now those
   lines play SILENTLY (correct: silence, not the wrong voice). To synthesize them:
       cd "C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG\game\tools"
       python generate_voices.py --check     (free: verify key + credits)
       python generate_voices.py --yes        (generates ONLY the 14 new clips, in Warlock/Seraphim voices)
   Then republish so the new clips ship:
       python "..\tools\publish_inplace.py" "C:\Users\charl\OneDrive\Documents\Neverendingnarratives"
   (publish_inplace.py copies src/*.js + index.html + config.js; make sure the regenerated
    assets/voice/*.mp3 are synced to the live site as you normally ship audio.)
