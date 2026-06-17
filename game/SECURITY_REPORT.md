# Security review — Sorcerer-Sword (auto, re-verified 2026-06-17 run, build 1781665835)

## Verdict: No urgent issues. No exposed API keys on the public site.

### Checked
1. ElevenLabs API key (game/tools/voice_config.json)
   - Status: SAFE / contained. The file holds a real key BUT it is listed in
     .gitignore (`game/tools/voice_config.json`), is NOT tracked by git, and is
     NOT copied into the public site (the publisher excludes tools/). Not exposed.
   - Advisory: keep treating that file as secret. If you ever shared the folder
     or committed it by force, rotate the key at elevenlabs.io.

2. Anthropic API key field (config.js)
   - Status: SAFE. The key field is empty ('') in both the source and the
     deployed copy. The publisher ALSO strips any key before it reaches the
     public site (play/config.js). 
   - Advisory: never paste your Anthropic key into config.js and commit it to the
     game repo — even though the public site is sanitized, it would sit in the
     private repo's history. Keep it empty; the game works fine without it.

3. Public site contents (Neverendingnarratives/play/)
   - Contains only: assets, build.txt, config.js (empty), index.html, lib,
     og-image.png, src. No tools/, no voice_config.json, no secrets. CLEAN.

### Nothing to fix right now.
If a future change exposes a secret, rotate the affected key first, then remove
it 