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
    import time, os
    stamp = str(int(time.time()))
    src_index = GAME / "index.html"
    # OneDrive guard: force a fresh read (cloud sync has served truncated files mid-write)
    tmp = GAME / ".index_publish_tmp"
    os.replace(src_index, tmp); os.replace(tmp, src_index)
    html = src_index.read_text(encoding="utf-8")
    if not html.rstrip().endswith("</html>"):
        sys.exit("ABORT: game/index.html is TRUNCATED (OneDrive flap?) — re-sync the file and rerun. Nothing was published.")
    html = re.sub(r'(src="(?!https?:)[^"?]+\.js)"', r'\1?v=' + stamp + '"', html)
    # stamp this build so a stale (cached) index.html can detect itself and self-reload.
    # build.txt is fetched uncached on every load; main.js compares it to window.__BUILD.
    html = html.replace("</head>", '<script>window.__BUILD="' + stamp + '";</script>\n</head>', 1)
    (PLAY / "index.html").write_text(html, encoding="utf-8")
    (PLAY / "build.txt").write_text(stamp, encoding="utf-8")
    if not (PLAY / "index.html").read_text(encoding="utf-8").rstrip().endswith("</html>"):
        sys.exit("ABORT: written play/index.html failed verification — do not push.")
    shutil.copytree(GAME / "lib", PLAY / "lib")
    shutil.copytree(GAME / "src", PLAY / "src")
    (PLAY / "assets").mkdir()
    shutil.copy2(GAME / "assets" / "embedded.js", PLAY / "assets" / "embedded.js")
    for sub in ("music", "voice"):
        d = GAME / "assets" / sub
        if d.exists(): shutil.copytree(d, PLAY / "assets" / sub,
                                       ignore=shutil.ignore_patterns("_raw", "README.txt"))
    # verify every copied text file matches its source byte-for-byte in size
    bad = []
    for rel in ["config.js"] + [str(p.relative_to(GAME)) for p in (GAME / "src").rglob("*.js")]:
        s, d2 = GAME / rel, PLAY / rel
        if rel != "config.js" and d2.exists() and s.stat().st_size != d2.stat().st_size: bad.append(rel)
    if bad: sys.exit("ABORT: copied files differ from source (truncation?): " + ", ".join(bad))

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
