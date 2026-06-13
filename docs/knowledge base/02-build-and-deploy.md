# 02 — Build & Deploy Runbook

There is **no build step**. "Building" = editing `.js`/`.html` and reloading. "Deploying" = copying the runtime files into the website repo and pushing to GitHub.

## The two repositories

| Repo | Path | Role |
|---|---|---|
| **Game source** | `C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG` | Where you edit. The game is in `game/`. |
| **Website (live site)** | `C:\Users\charl\OneDrive\Documents\Neverendingnarratives` | A GitHub-Pages repo. The game is published into its `play/` folder. Live at https://neverendingnarratives.com/play/ |

You **publish** from the game repo into the website repo's `play/` folder using a script, then commit + push the website repo. GitHub Pages serves it.

## Play locally (no deploy)

Open `game/index.html` in a browser. That's it. (Companion AI chat needs a key in `config.js`, optional — see `06-voice.md`/`config.js` comments. Never commit a key.)

## Publish + deploy (the normal flow)

```sh
# 1. From the game repo, run the publisher (copies runtime files into the website repo's play/):
cd "C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG"
python game/tools/publish_site.py "C:\Users\charl\OneDrive\Documents\Neverendingnarratives"

# 2. Commit the GAME repo (your source changes):
git add -A && git commit -m "describe your change"
git push

# 3. Commit + push the WEBSITE repo (the published copy):
cd "C:\Users\charl\OneDrive\Documents\Neverendingnarratives"
git add -A && git commit -m "publish: describe your change"
git push
```

GitHub Pages redeploys within ~1 minute. Visitors may need one hard-refresh (or the build self-heal handles it — see below).

### What `publish_site.py` does (and its safety guards)

- Copies `index.html`, `lib/`, `src/`, `config.js` (with any API key **stripped**), `assets/embedded.js`, `assets/music/`, `assets/voice/` into `play/`.
- **Cache-busts** every local `<script src>` by appending `?v=<timestamp>`, so a fresh page always pulls fresh code.
- Writes `play/build.txt` (the timestamp) and injects `window.__BUILD="<timestamp>"` into the page — used by the cache self-heal.
- **Truncation guard:** ABORTS if `index.html` doesn't end in `</html>`, or if any copied `src/*.js` differs in size from the source. This stops a OneDrive-corrupted file from ever shipping. If you see `ABORT: ... TRUNCATED`, fix the file (below) and re-run.

## The OneDrive truncation hazard (READ THIS)

OneDrive sometimes serves a half-written / truncated copy of a file while it syncs. `index.html` has been cut off mid-`<script>` tag at least 4 times. Symptoms: the live (or local) game shows a **frozen title screen** and nothing works, or the publisher aborts.

**Three guards are in place:**
1. `publish_site.py` refuses to publish a truncated `index.html` or mismatched script.
2. A **git pre-commit hook** in *both* repos (`.git/hooks/pre-commit`) blocks any commit where `index.html` (game repo) / `play/index.html` (site repo) doesn't end in `</html>`. If a commit is rejected with `COMMIT BLOCKED: ... TRUNCATED`, that's this hook doing its job.
3. The in-game crash overlay (`index.html`, top script) prints uncaught errors on screen instead of a blank canvas.

> The hooks live in `.git/hooks/` and are NOT version-controlled. If you ever re-clone a repo, recreate them (the script is documented at the end of this file).

### Recovering a broken (truncated) file

1. Open the file (e.g. `game/index.html`) in a text editor. Check the end — it must end with `</body></html>`. If it's cut off mid-tag, OneDrive truncated it.
2. **Easiest fix:** in git, the last good version is in history. From the repo:
   ```sh
   git checkout -- game/index.html      # restore the committed version
   ```
   Then re-apply whatever edit you were making.
3. If git's copy is also bad, the published `play/index.html` or the live site is a fallback to copy structure from.
4. Force OneDrive to re-sync: right-click the file → "Always keep on this device", or open and re-save it.
5. Re-run the publisher (its guard will confirm the file is whole).

## Cache problems ("works locally, broken on the website")

Browsers/CDN cache the page. After a deploy a returning visitor can load an **old `index.html`** that pulls **old scripts** → outdated behavior (this caused a city-voice bug after it was already fixed).

**The self-heal (already built):** every page load fetches `play/build.txt` *uncached* and compares to the page's `window.__BUILD`. If the page is older than the live build, it reloads itself once (cache-busted) to pull current code. This means: after you deploy, players auto-update on their next load. The catch — a browser must have loaded the build-stamp era at least once for this to kick in, so the *first* time you may still need a manual **hard-refresh** (Ctrl/Cmd+Shift+R, or clear site data on mobile).

To verify the live site is current: open https://neverendingnarratives.com/play/build.txt — the number should match the latest publish timestamp.

## Recreating the git pre-commit hooks (if a repo is re-cloned)

Game repo — create `.git/hooks/pre-commit` (and `chmod +x` it):
```sh
#!/bin/sh
f="game/index.html"
if git diff --cached --name-only | grep -qx "$f"; then
  last="$(git show ":$f" 2>/dev/null | tr -d '[:space:]' | tail -c 7)"
  [ "$last" != "</html>" ] && { echo "COMMIT BLOCKED: $f TRUNCATED (no </html>)."; exit 1; }
fi
exit 0
```
Website repo — same but `f="play/index.html"`.
