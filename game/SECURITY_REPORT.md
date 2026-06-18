# Security review — Sorcerer-Sword (auto, re-verified 2026-06-17 maintenance run, published build 1781736462)

## Verdict: No urgent issues. No exposed API keys on the public site.

_Re-verified this run: .gitignore line 4 still ignores voice_config.json; `git ls-files` shows it
untracked; config.js `anthropicApiKey: ''` empty in source AND play/; play/ has no tools/ and no
voice_config; key-pattern scan of play/ (excluding lib/*.min.js + assets/embedded.js) returned
nothing._

### Checked
1. ElevenLabs API key (game/tools/voice_config.json)
   - Status: SAFE / contained. Listed in `.gitignore` (line 4: `game/tools/voice_config.json`),
     confirmed NOT tracked by git (`git ls-files` shows no match), and NOT copied into the
     public site (the publisher only copies index.html + src/*.js + config.js, never tools/).
   - Advisory: keep treating that file as secret. If you ever force-committed or shared the
     folder, rotate the key at elevenlabs.io.

2. Anthropic API key field (config.js)
   - Status: SAFE. `anthropicApiKey: ''` is empty in BOTH the source (game/config.js) and the
     deployed copy (play/config.js). The publisher also strips any key before it reaches the
     public site as a belt-and-suspenders pass.
   - Advisory: never paste your Anthropic key into config.js and commit it — even though the
     public site is sanitized, it would sit in the private repo's history. The game runs fine
     with it empty.

3. Public site contents (Neverendingnarratives/play/)
   - Contains only: assets, build.txt, config.js (empty), index.html, lib, og-image.png, src.
   
---
## Re-verified 2026-06-17 (maintenance run)
- config.js `anthropicApiKey: ''` empty in source AND play/.
- play/ has no tools/, no voice_config; key-pattern scan clean.
- voice_config.json gitignored (.gitignore line 4) and untracked (git ls-files: no match).
- Verdict unchanged: NO urgent issues, no exposed keys.
.
