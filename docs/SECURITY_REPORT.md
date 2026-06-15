# SECURITY REPORT — Sorcerer-Sword ARPG

Durable record of the recurring QA & SECURITY watch scans. Secret values are always MASKED here.

## Standing finding — ElevenLabs API key in voice_config.json (contained; LOW)
- **File:** `game/tools/voice_config.json`, field `api_key` = `sk_36****511f` (ElevenLabs).
- **Why it is not an exposure:** the file is **gitignored** (`game/tools/voice_config.json` in `.gitignore`)
  and **not git-tracked** (`git ls-files` does not match it), so it is not in the repo history. It is a
  dev-only tool consumed by `generate_voices.py`; the `tools/` directory is **never deployed**.
- **Deploy path is clean:** `game/tools/publish_site.py` copies only runtime files (lib/src/assets/index)
  into the website `/play/` folder and explicitly excludes `tools/` and `tests/`, and sanitizes `config.js`.
  Verified `site-neverendingnarratives/play/` contains no `sk_`/`sk-` string, no `tools/` or `tests/` dirs,
  and `play/config.js` `anthropicApiKey` is empty.
- **Severity:** LOW (key is local-only, not committed, not deployed, not public).
- **Recommended Hiro action:** routine hygiene only — rotate the ElevenLabs key periodically; keep
  `voice_config.json` gitignored and out of any public push. No urgent action required.

## Scan log
- **2026-06-15 (run 68):** Full secret scan (sk_/sk-, api_key, password, private_key, AWS AKIA) across
  `*.js *.json *.py *.html *.env *.bat` (excluding node_modules/.git/lib). Only hit: the standing
  `voice_config.json` key above — confirmed contained (gitignored, untracked, excluded from `/play`
  deploy, deployed `config.js` sanitized). No secrets in `marketing/` or `site-neverendingnarratives/`
  source. **Result: CLEAN — no exposed secrets.**

- **2026-06-15 (run 69):** Full secret scan (sk_/sk-, api_key, AWS AKIA, private_key, BEGIN RSA/PRIVATE)
  across `*.js *.json *.py *.html *.env *.bat` (excluding node_modules/.git/lib). Only hit: the standing
  `voice_config.json` ElevenLabs key (MASKED) — re-confirmed contained: gitignored, `git ls-files` shows it
  untracked, no `sk_` string in deployed `site-neverendingnarratives/play/`, no `tools/`/`tests/` dir
  deployed, and `play/config.js` anthropicApiKey is empty. **Result: CLEAN — no exposed secrets.**

- **2026-06-15 (run 70):** Full secret scan (sk_/sk-, api_key, AWS AKIA, private_key, BEGIN RSA/PRIVATE)
  across `*.js *.json *.py *.html *.env *.bat` (excluding node_modules/.git/lib). Only value hit: the
  standing `voice_config.json` ElevenLabs key (MASKED) — re-confirmed contained: listed in `.gitignore`,
  `git ls-files` shows it untracked, no `sk_` string in deployed `site-neverendingnarratives/play/`, no
  `tools/`/`tests/` dir deployed, and `play/config.js` anthropicApiKey is empty. (The `generate_voices.py`
  hits are the literal word "api_key" in code/help text, not a secret value.) **Result: CLEAN — no exposed secrets.**

- **2026-06-15 (run 71):** Full secret scan (sk_/sk-, api_key, AWS AKIA, private_key, BEGIN RSA/PRIVATE)
  across `*.js *.json *.py *.html *.env *.bat` (excluding node_modules/.git/lib). Only value hit: the
  standing `voice_config.json` ElevenLabs key (MASKED) — re-confirmed contained: listed in `.gitignore`
  (`game/tools/voice_config.json`), `git ls-files` shows it untracked, no `sk_` string in deployed
  `site-neverendingnarratives/play/`, no `tools/`/`tests/` dir deployed, and `play/config.js`
  anthropicApiKey is empty. **Result: CLEAN — no exposed secrets.** The API key was never printed or moved.
