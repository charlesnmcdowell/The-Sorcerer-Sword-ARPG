#!/usr/bin/env python3
"""publish_inplace.py — same as publish_site.py but OVERWRITES files in place
instead of deleting play/ first. Use on OneDrive, where unlinking cloud-only
files (embedded.js) raises PermissionError during rmtree.

Usage: python game/tools/publish_inplace.py [path-to-site-repo]
"""
import re, time, shutil, sys
from pathlib import Path
GAME = Path(__file__).resolve().parent.parent
SITE = Path(sys.argv[1]) if len(sys.argv) > 1 else GAME.parent / "Neverendingnarratives"
PLAY = SITE / "play"

def main():
    if not (SITE / ".git").exists():
        sys.exit(f"NOT REACHABLE: site repo not found/mounted at {SITE}. Publish skipped (do it from the chat session).")
    PLAY.mkdir(exist_ok=True)
    stamp = str(int(time.time()))
    html = (GAME / "index.html").read_text(encoding="utf-8")
    if not html.rstrip().endswith("</html>"):
        sys.exit("ABORT: game/index.html TRUNCATED — re-sync and rerun. Nothing published.")
    html = re.sub(r'(src="(?!https?:)[^"?]+\.js)"', r'\1?v=' + stamp + '"', html)
    html = html.replace("</head>", '<script>window.__BUILD="' + stamp + '";</script>\n</head>', 1)
    (PLAY / "index.html").write_text(html, encoding="utf-8", newline="")
    (PLAY / "build.txt").write_text(stamp, encoding="utf-8", newline="")
    if not (PLAY / "index.html").read_text(encoding="utf-8").rstrip().endswith("</html>"):
        sys.exit("ABORT: written play/index.html failed verification — do not push.")
    bad = []
    for s in (GAME / "src").rglob("*.js"):
        d = PLAY / s.relative_to(GAME)
        d.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(s, d)
        if s.stat().st_size != d.stat().st_size: bad.append(str(s.relative_to(GAME)))
    if bad: sys.exit("ABORT: copied files differ from source (truncation?): " + ", ".join(bad))
    cfg = re.sub(r"anthropicApiKey:\s*'[^']*'", "anthropicApiKey: ''",
                 (GAME / "config.js").read_text(encoding="utf-8"))
    (PLAY / "config.js").write_text(cfg, encoding="utf-8", newline="")
    print(f"published (in-place) build {stamp} -> {PLAY}")
    print("next: commit & push the site repo.")

if __name__ == "__main__":
    main()
