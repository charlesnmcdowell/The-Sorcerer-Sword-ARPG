#!/usr/bin/env python3
"""
visual_audit.py — FULLY AUTOMATED Dragon's-Crown visual parity check for the game3d build.

WHY LOCAL: the scheduled sandbox can't render WebGL or reach your localhost, so this runs on
YOUR PC. It serves game3d/, opens arena.html in a headless Chromium, reads the TRUE on-screen
numbers (canvas fill, warlock scale, backdrop layers, lighting, touch controls), screenshots it,
scores everything against the DC gold-standard, and writes the verdict where the cloud agent can
read it: game3d/tools/audit/latest.json + latest.png + VISUAL_AUDIT_LOG.md. The playtest-bughunt
schedule (every 4 min) reads latest.json and logs/escalates any P1 — so the loop closes itself.

SETUP (once, Windows):
    pip install playwright pillow numpy
    playwright install chromium

RUN:
    python visual_audit.py            # one audit now
    python visual_audit.py --watch    # re-audit every 4 min, forever (start it and leave it)
    python visual_audit.py --watch 120  # every 120s

Exit code is non-zero if any P1 target fails (so it can also be used as a gate).
"""
import os, sys, json, time, threading, http.server, socketserver, datetime, functools

HERE  = os.path.dirname(os.path.abspath(__file__))
G3D   = os.path.dirname(HERE)
AUD   = os.path.join(HERE, "audit")
PORT  = 8011                      # own port so it won't clash with your manual :8000
VIEW  = {"width": 1600, "height": 900}   # fixed 16:9 viewport we score against
PAGE  = f"http://127.0.0.1:{PORT}/arena.html?audit=1"

# ---- Dragon's Crown GOLD-STANDARD targets (keep in sync with GAME3D_UPLIFT_PLAN.md) ----
# Each: (key, label, severity, predicate(metrics)->pass, detail(metrics)->str)
def _pct(n, d): return (100.0 * n / d) if d else 0.0

def targets():
    return [
        ("canvas_fill", "Canvas fills the viewport (no black margins)", "P1",
         lambda m: m.get("fillW",0) >= 95 and m.get("fillH",0) >= 95,
         lambda m: f"{m.get('fillW',0):.0f}% wide x {m.get('fillH',0):.0f}% tall  (target >=95% both)"),
        ("touch_controls", "Touch controls present (stick + verb buttons)", "P1",
         lambda m: m.get("stick") and m.get("btns",0) >= 4,
         lambda m: f"stick={m.get('stick')}, on-screen buttons={m.get('btns',0)}  (target stick + >=4 .btn)"),
        ("warlock_scale", "Warlock ~28-36% of screen height", "P1",
         lambda m: m.get("warlockPctH") is not None and 24 <= m["warlockPctH"] <= 42,
         lambda m: (f"{m['warlockPctH']:.0f}% of screen height  (target 28-36%)"
                    if m.get("warlockPctH") is not None else "unknown - build must set window.__AUDIT__.warlockPctH")),
        ("backdrop_layers", "All 3 backdrop layers drawn (crowd far + floor + edge pillars)", "P1",
         lambda m: m.get("layers") and all(m["layers"].get(k) for k in ("far","floor","fg")),
         lambda m: (f"far={m['layers'].get('far')}, floor={m['layers'].get('floor')}, fg={m['layers'].get('fg')}"
                    if m.get("layers") else "unknown - build must set window.__AUDIT__.layers")),
        ("lighting_fx", "Lighting: Light2D + bloom + vignette + embers", "P2",
         lambda m: m.get("fx") and any(m["fx"].values()),
         lambda m: (", ".join(f"{k}={v}" for k,v in m["fx"].items())
                    if m.get("fx") else "unknown - build must set window.__AUDIT__.fx")),
    ]

# ---- tiny static file server rooted at game3d/ (background thread) ----
def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=G3D)
    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", PORT), handler)
    httpd.daemon_threads = True
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd

# ---- read the true on-screen numbers via headless Chromium ----
def measure(png_path):
    from playwright.sync_api import sync_playwright
    m = {}
    with sync_playwright() as p:
        b = p.chromium.launch(args=["--use-gl=swiftshader", "--ignore-gpu-blocklist"])
        pg = b.new_page(viewport=VIEW, device_scale_factor=1)
        errs = []
        pg.on("console", lambda c: errs.append(c.text) if c.type == "error" else None)
        pg.goto(PAGE, wait_until="load", timeout=30000)
        try: pg.wait_for_selector("canvas", timeout=15000)
        except Exception: pass
        pg.wait_for_timeout(3500)   # let WebGL settle + first frames render
        pg.screenshot(path=png_path)
        info = pg.evaluate("""() => {
            const c = document.querySelector('canvas');
            const r = c ? c.getBoundingClientRect() : {width:0,height:0};
            return {
                cw: r.width, ch: r.height,
                winW: window.innerWidth, winH: window.innerHeight,
                stick: !!document.getElementById('stickBase'),
                btns: document.querySelectorAll('.btn').length,
                audit: window.__AUDIT__ || null
            };
        }""")
        b.close()
    m["fillW"] = _pct(info["cw"], info["winW"]); m["fillH"] = _pct(info["ch"], info["winH"])
    m["stick"] = info["stick"]; m["btns"] = info["btns"]
    m["consoleErrors"] = errs[:8]
    a = info.get("audit") or {}
    m["warlockPctH"] = a.get("warlockPctH")
    m["layers"] = a.get("layers"); m["fx"] = a.get("fx")
    m["entities"] = a.get("entities")   # [{type, action, anim:{rigged:bool, frames:int}}]
    m["raw"] = info
    return m

def score(m):
    rows, p1fails = [], 0
    for key, label, sev, ok, detail in targets():
        passed = bool(ok(m))
        if not passed and sev == "P1": p1fails += 1
        rows.append({"key": key, "label": label, "severity": sev,
                     "pass": passed, "detail": detail(m)})
    return rows, p1fails

# ---- ANIMATION COVERAGE: every entity x action it performs must have a >=3-keypose OR rigged clip ----
def coverage(m):
    """Reads window.__AUDIT__.entities = [{type, action, anim:{rigged:bool, frames:int}}].
    A static still (no rig, <3 frames) FAILS and is written to needed_sprites.json so the next
    gen_sprites run creates it. A rigged clip OR >=3 keyposes PASSES (the rig tweens the rest)."""
    ents = m.get("entities")
    if ents is None:
        return ([{"key":"anim_coverage","severity":"P1","pass":False,
                  "label":"Every on-screen entity x action has a >=3-frame/rigged animation",
                  "detail":"unknown - build must set window.__AUDIT__.entities=[{type,action,anim:{rigged,frames}}]"}], [])
    bad, seen, needs = [], set(), []
    for e in ents:
        t, act = e.get("type","?"), e.get("action","?")
        an = e.get("anim") or {}
        frames = int(an.get("frames") or 0); rigged = bool(an.get("rigged"))
        ok = rigged or frames >= 3
        k = (t, act)
        if not ok and k not in seen:
            seen.add(k)
            bad.append(f"{t}:{act}(frames={frames},rig={rigged})")
            needs.append({"entity": t, "action": act, "frames_needed": 3, "have_frames": frames,
                          "rigged": rigged, "reason": "static or <3 keyposes - generate a 3-keypose set or rig it"})
    passed = len(bad) == 0
    detail = "all on-screen entities animated (rigged or >=3 keyposes)" if passed else \
             f"{len(bad)} under-animated: " + "; ".join(bad[:10])
    return ([{"key":"anim_coverage","severity":"P1","pass":passed,
              "label":"Every on-screen entity x action has a >=3-frame/rigged animation","detail":detail}], needs)

def write_needs(needs):
    """Accumulate the union of missing entity x action sprites so gen_sprites can create them next run."""
    p = os.path.join(AUD, "needed_sprites.json")
    have = {}
    if os.path.exists(p):
        try:
            for n in json.load(open(p)): have[(n["entity"], n["action"])] = n
        except Exception: pass
    for n in needs: have[(n["entity"], n["action"])] = n
    os.makedirs(AUD, exist_ok=True)
    json.dump(sorted(have.values(), key=lambda x:(x["entity"],x["action"])), open(p,"w"), indent=2)
    return len(have)

def write_report(m, rows, p1fails, png_rel):
    os.makedirs(AUD, exist_ok=True)
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    verdict = "PASS" if p1fails == 0 else f"FAIL ({p1fails} P1)"
    out = {"ts": ts, "verdict": verdict, "p1fails": p1fails, "viewport": VIEW,
           "metrics": {k: m.get(k) for k in ("fillW","fillH","stick","btns","warlockPctH","layers","fx")},
           "checks": rows, "screenshot": png_rel, "consoleErrors": m.get("consoleErrors", [])}
    json.dump(out, open(os.path.join(AUD, "latest.json"), "w"), indent=2)
    # human log, newest on top
    md = [f"## {ts} — DC VISUAL AUDIT — {verdict}"]
    for r in rows:
        md.append(f"- [{'PASS' if r['pass'] else 'FAIL'}] ({r['severity']}) {r['label']} — {r['detail']}")
    if m.get("consoleErrors"): md.append(f"- console errors: {m['consoleErrors']}")
    md.append("")
    logp = os.path.join(AUD, "VISUAL_AUDIT_LOG.md")
    prev = open(logp).read() if os.path.exists(logp) else "# Dragon's Crown visual audit log (newest on top)\n\n"
    head, _, tail = prev.partition("\n\n")
    open(logp, "w").write(head + "\n\n" + "\n".join(md) + "\n" + tail)
    return out

def run_once():
    os.makedirs(AUD, exist_ok=True)
    stamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    shot = os.path.join(AUD, f"shot_{stamp}.png")
    try:
        m = measure(shot)
    except Exception as e:
        print(f"AUDIT ERROR: {type(e).__name__}: {str(e)[:200]}")
        if "playwright" in str(e).lower() or "Executable doesn't exist" in str(e):
            print("  -> run:  pip install playwright pillow numpy  &&  playwright install chromium")
        return 2
    # keep a stable 'latest.png' copy + prune old shots (keep last 20)
    import shutil; shutil.copyfile(shot, os.path.join(AUD, "latest.png"))
    shots = sorted(f for f in os.listdir(AUD) if f.startswith("shot_"))
    for old in shots[:-20]:
        try: os.remove(os.path.join(AUD, old))
        except OSError: pass
    rows, p1 = score(m)
    cov_rows, needs = coverage(m)
    rows += cov_rows
    p1 += sum(1 for r in cov_rows if r["severity"] == "P1" and not r["pass"])
    n_needed = write_needs(needs)
    out = write_report(m, rows, p1, f"audit/shot_{stamp}.png")
    print(f"\n=== DC VISUAL AUDIT {out['ts']} — {out['verdict']} ===")
    for r in rows:
        print(f"  [{'PASS' if r['pass'] else 'FAIL'}] ({r['severity']}) {r['label']}: {r['detail']}")
    if needs:
        print(f"  -> {len(needs)} under-animated entity/action(s) this run; {n_needed} total queued in audit/needed_sprites.json")
    print(f"  screenshot -> {os.path.join(AUD,'latest.png')}")
    return 0 if p1 == 0 else 1

def main():
    serve()
    time.sleep(0.6)
    watch = "--watch" in sys.argv
    interval = 240
    for a in sys.argv[1:]:
        if a.isdigit(): interval = int(a)
    if not watch:
        sys.exit(run_once())
    print(f"[watch] auditing every {interval}s — Ctrl+C to stop")
    while True:
        try:
            run_once()
        except Exception as e:
            print(f"loop error: {e}")
        try:
            time.sleep(interval)
        except KeyboardInterrupt:
            print("\nstopped."); break

if __name__ == "__main__":
    main()
