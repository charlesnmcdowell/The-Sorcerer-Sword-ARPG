#!/usr/bin/env python3
"""
safe_publish — the OneDrive-safe, regression-gated publisher for the game.

  python3 tools/safe_publish.py --check-only        # gate only (no publish)
  python3 tools/safe_publish.py <path-to-Neverendingnarratives>   # gate THEN publish THEN re-verify

Gate = (1) `node --check` every src JS (catches the OneDrive tail-TRUNCATION that
silently ships broken files) + (2) the headless smoke-test (every champion runs
without crashing / evo-lock). Publishes via publish_inplace.py only if the gate
passes, then `node --check`s every published file. Aborts loudly on any failure.
"""
import os, sys, subprocess, glob
GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def run(cmd): 
    return subprocess.run(cmd, capture_output=True, text=True)
def node_check_tree(root, label):
    bad=[]
    for f in glob.glob(os.path.join(root,'**','*.js'), recursive=True):
        if os.sep+'node_modules'+os.sep in f: continue
        r=run(['node','--check',f])
        if r.returncode!=0:
            bad.append((f, (r.stderr or r.stdout).strip().splitlines()[-1] if (r.stderr or r.stdout).strip() else 'check failed'))
    print(f"  [{label}] node --check: {'OK' if not bad else str(len(bad))+' FAILED'} ({len(glob.glob(os.path.join(root,'**','*.js'),recursive=True))} files)")
    for f,msg in bad: print(f"    BROKEN/TRUNCATED: {os.path.relpath(f,GAME)} -> {msg}")
    return not bad

def main():
    args=sys.argv[1:]
    check_only = ('--check-only' in args) or not [a for a in args if not a.startswith('-')]
    site = next((a for a in args if not a.startswith('-')), None)

    print("== safe_publish: GATE ==")
    ok = node_check_tree(os.path.join(GAME,'src'), 'src')
    smoke = run(['node', os.path.join(GAME,'tools','smoke_test.js'), os.path.join(GAME,'src','combat','pit.js')])
    print("  [smoke] " + (smoke.stdout.strip().splitlines()[-1] if smoke.stdout.strip() else 'no output'))
    if smoke.returncode!=0:
        ok=False
        for line in smoke.stdout.strip().splitlines():
            if line.startswith('FAIL'): print("    "+line)
    if not ok:
        print("\nABORT: gate failed — NOT publishing. Fix the broken/truncated file(s) (reconstruct from the desktop copy in a chat session) and retry.")
        sys.exit(1)
    print("  GATE PASSED.")
    if check_only:
        print("\n(check-only) not publishing.")
        sys.exit(0)

    print("== safe_publish: PUBLISH ==")
    pub = run(['python3', os.path.join(GAME,'tools','publish_inplace.py'), site])
    print((pub.stdout or '').strip() or (pub.stderr or '').strip())
    if pub.returncode!=0:
        print("ABORT: publish_inplace failed."); sys.exit(2)

    play = os.path.join(site,'play','src')
    print("== safe_publish: POST-VERIFY (published files) ==")
    if not node_check_tree(play, 'play'):
        print("\nALERT: a PUBLISHED file is broken — the live build may be bad. Re-run from a chat session to reconstruct + republish.")
        sys.exit(3)
    print("  Published build verified clean.")
    sys.exit(0)

if __name__=='__main__': main()
