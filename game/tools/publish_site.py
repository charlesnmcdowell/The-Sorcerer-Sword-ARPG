#!/usr/bin/env python3
"""
publish_site.py — copy the playable game (runtime files only) into the
neverendingnarratives.com website repo under /play/. Excludes dev-only weight
(asset packs ~16MB, tools, tests) and ALWAYS sanitizes config.js so an API key
can never reach the public site.

Usage: python game/tools/publish_site.py [path-to-site-repo]
Then commit+push the site repo. Game appears at https://neverendingnarratives.com/play/
"""
import re, shutil, sys
from pathlib import Path

GAME = Path(__file__).resolve().parent.parent
SITE = Path(sys.argv[1]) if len(sys.argv) > 1 else GAME.parent / "site-neverendingnarratives"
PLAY = SITE / "play"

def main():
    if not (SITE / ".git").exists():
        sys.exit(f"site repo not found at {SITE} — clone charlesnmcdowell/neverendingnarratives there first")
    if PLAY.exists(): shutil.rmtree(PLAY)
    PLAY.mkdir()

    # cache-bust every local script so players always get fresh code after a publish
    import time
    stamp = str(int(time.time()))
    html = (GAME / "index.html").read_text(encoding="utf-8")
    html = re.sub(r'(src="(?!https?:)[^"?]+\.js)"', r'\1?v=' + stamp + '"', html)
    (PLAY / "index.html").write_text(html, encoding="utf-8")
    shutil.copytree(GAME / "lib", PLAY / "lib")
    shutil.copytree(GAME / "src", PLAY / "src")
    (PLAY / "assets").mkdir()
    shutil.copy2(GAME / "assets" / "embedded.js", PLAY / "assets" / "embedded.js")
    for sub in ("music", "voice"):
        d = GAME / "assets" / sub
        if d.exists(): shutil.copytree(d, PLAY / "assets" / sub,
                                       ignore=shutil.ignore_patterns("_raw", "README.txt"))

    # sanitize config: NEVER ship a key
    cfg = (GAME / "config.js").read_text(encoding="utf-8")
    cfg = re.sub(r"anthropicApiKey:\s*'[^']*'", "anthropicApiKey: ''", cfg)
    (PLAY / "config.js").write_text(cfg, encoding="utf-8")

    n = sum(1 for _ in PLAY.rglob("*") if _.is_file())
    mb = sum(f.stat().st_size for f in PLAY.rglob("*") if f.is_file()) / 1e6
    print(f"published {n} files ({mb:.1f} MB) -> {PLAY}")
    print("next: commit & push the site repo. URL: https://neverendingnarratives.com/play/")

if __name__ == "__main__":
    main()
