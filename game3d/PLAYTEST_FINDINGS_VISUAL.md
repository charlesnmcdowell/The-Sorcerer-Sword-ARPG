# game3d — VISUAL / DRAGON'S-CROWN PARITY FINDINGS

Lane B of the autonomous playtest agent. Benchmark = **Dragon's Crown**; spec = `GAME3D_UPLIFT_PLAN.md` ★ HIRO FEEDBACK sections. The agent can't render WebGL to pixels in the sandbox, so findings are static/code-level assertions on `arena.html` that catch the *causes* of visual flaws. Each finding is pinned by a permanent assertion in `game3d/tools/parity_lint.js` so it can never silently regress. **Newest on top.**

---

## RUN-LOG 2026-06-28 (K) — auditor FRESH; same lone P1 (anim_coverage); rule8 guard CONFIRMED live; no new findings

**TL;DR.** `latest.json` is **FRESH** (ts 2026-06-27 21:22:07 local ≈ <1 min old; newest shot `shot_20260627_212158.png`)
and the **auditor is RUNNING**. Verdict unchanged from runs I–J: **FAIL (1 P1)** — canvas_fill 100/100 PASS, touch stick+4
PASS, warlock_scale 34.1% PASS, backdrop far/floor/fg PASS, lighting_fx (P2) PASS, `consoleErrors:[]`; the lone P1 is
again `anim_coverage` ("unknown — build must set `window.__AUDIT__.entities=[…]`").

**Verified this run.** The real `parity_lint.js` (173 lines) now carries run-J's **rule8** P1 guards
(`rule8.audit-entities-hook` + `rule8.audit-entities-fields`) — confirmed present. Re-checked the live arena.html `__AUDIT__`
hook (arena.html:2231): still publishes `warlockPctH/layers/fx` only, **no `entities`** (grep over the real file finds zero
`entities` refs), so rule8 correctly fails and V-I1 stays caught. **No new findings; no duplicate case added.**

**Note (mount hazard, known).** The bash mount again served **tail-truncated/stale** game3d copies (arena.html 1088 lines &
parity_lint.js 140 lines vs the real 2260+/173) — so `parity_lint.js` can't be run from the sandbox; verification was done
via the Read/Grep tools (real FS) + the authoritative PC auditor. `game/` mount was fresh (smoke ran clean from bash).

**ESCALATE → Hiro / game3d-build (unchanged, no new ask).** anim_coverage remains design+art work: the cast is still
1-frame stills, so even after the `entities` hook ships, this P1 stays a *true* fail until rigged/≥3-frame motion exists per
entity×action (a **gen-sprites** pass). Auditor is running — no action needed there.

---

## RUN-LOG 2026-06-28 (J) — auditor still FRESH; same lone P1 (anim_coverage); MISSING parity_lint guard for V-I1 now ADDED

**TL;DR.** `latest.json` is **FRESH** (ts 2026-06-27 21:05:33 local ≈ 2 min old; newest shot `shot_20260627_210524.png`)
and the **auditor is RUNNING**. Verdict unchanged from run I: **FAIL (1 P1)** — canvas_fill 100/100 PASS, touch stick+4 PASS,
warlock_scale 34.1% PASS, backdrop far/floor/fg PASS, lighting_fx (P2) PASS, `consoleErrors:[]`; the lone P1 is again
`anim_coverage` ("unknown — build must set `window.__AUDIT__.entities=[{type,action,anim:{rigged,frames}}]`").

**Gap closed this run.** Run I logged Finding V-I1 but the **permanent `parity_lint.js` guard it requires was never created**
— the lint still only checked `warlockPctH/layers/fx` (rule7). Verified statically: the live arena.html `__AUDIT__` hook
(arena.html:2158) publishes `warlockPctH/layers/fx` only — **no `entities`**. Added two permanent P1 cases so V-I1 can
never silently regress: **`rule8.audit-entities-hook`** (hook must publish `entities:[…]`) and **`rule8.audit-entities-fields`**
(each entry must carry `rigged`+`frames`). Logic verified against fixtures: rule8 FAILs on the current arena (no `entities`)
and PASSes once the build publishes `entities{rigged,frames}`. Note: `parity_lint.js` itself cannot run against the OneDrive
mount copy of arena.html (tail-truncated → its own truncation-guard exits INDETERMINATE by design); the PC auditor is
authoritative and already confirms the gap.

**ESCALATE → Hiro / game3d-build.** anim_coverage is **design+art work, not a quick fix**: the cast is still 1-frame idle
stills (`WARLOCK_FRAMES=1`, foes are placeholder sprites/circles), so even once the `entities` hook ships, anim_coverage
will report a *true* fail until rigged/≥3-frame motion exists per entity×action. Needs the **game3d-build schedule** to (1)
extend the `__AUDIT__` hook with `entities[]` and (2) add real animation (likely a **gen-sprites** pass). The visual auditor
is running — no action needed there.

---

## RUN-LOG 2026-06-28 (I) — auditor FRESH & GREEN-ish: prior 2 phantom P1s CLEARED; lone P1 = NEW anim_coverage (blind, no entities[] hook)

**TL;DR.** Big shift from runs E–H: `latest.json` is now **FRESH** (ts 2026-06-27 21:01:24 local vs run ~21:02 local
= ~1 min old; newest shot `shot_20260627_210116.png`) and the **auditor is RUNNING**. The two long-standing phantom
P1s — `warlock_scale` and `backdrop_layers` — **now PASS** (warlockPctH=34.1%, far/floor/fg all true). canvas_fill
100%/100% PASS, touch_controls stick+4 PASS, lighting_fx (P2) PASS. `consoleErrors:[]`. **Verdict = FAIL (1 P1)**, and
that lone P1 is a **NEW** check: `anim_coverage` — *"Every on-screen entity × action has a ≥3-frame/rigged animation"*
— **pass:false, detail "unknown — build must set window.__AUDIT__.entities=[{type,action,anim:{rigged,frames}}]"**.

**Finding V-I1 — anim_coverage P1 is BLIND: the build never publishes `window.__AUDIT__.entities[]`. Severity P1.**
Confirmed from the LIVE auditor (authoritative on-screen read) AND statically: `grep __AUDIT__ / entities` over the
arena.html the sandbox could see returns the hook publishes `warlockPctH/layers/fx` only — no `entities` array. So the
auditor cannot score whether each entity×action is rigged/multi-frame; it defaults the check to FAIL("unknown") forever.

**5-WHYS.** (1) Why FAIL? anim_coverage="unknown". (2) Why unknown? auditor found no `window.__AUDIT__.entities`.
(3) Why none? the render hook (added for warlockPctH/layers/fx) was never extended to enumerate live entities×actions.
(4) Why not? the anim_coverage check is newer than the hook; instrumentation lagged the metric (same class of gap that
caused the warlock_scale/backdrop phantom fails in runs E–G). (5) Why does that recur? a new audit metric can ship
without a matching build hook + a parity_lint guard, so the gate silently reads "unknown"=FAIL with no alarm.
**ISHIKAWA:** tests/metrics (metric added before instrument) ×agent-process (no hook↔metric contract) — NOT a render
bug; the scene may animate fine, but it's **unverifiable**, and DC's whole identity is lush ≥multi-frame animation, so
this must be measured, not assumed.

**FIX — two small build changes (game3d is NOT live → LOGGED for the game3d-build schedule, not shipped here):**
  - **Build:** in the per-frame `window.__AUDIT__={…}` assignment, add
    `entities: actors.map(a=>({type:a.kind, action:a.state, anim:{rigged:!!a.rig, frames:(a.frameCount||1)}}))`
    (enumerate hero + every enemy/summon currently on screen with its current action + real frame count).
  - **PERMANENT GUARD (rule8):** add to `parity_lint.js` a P1 check
    `has(/__AUDIT__[\s\S]{0,400}entities\s*:/)` so a missing entities hook fails the static gate too.
    NOTE: could **not** install rule8 this run — the bash mount served **tail-TRUNCATED** copies of both
    `parity_lint.js` (140 of 158 lines; node died on the unterminated string at L141) and `arena.html`
    (1088 lines, no `new Phaser.Game` tail). On-disk files are intact (Read fetches the authoritative copy), but a
    write-back during an ACTIVE truncation window can't be verified (`node --check` runs against the truncated mount),
    so per the run-G/H precedent I did **not** risk a truncated write to the non-live build. A reconstructed
    rule8-bearing `parity_lint.js` is staged in `outputs/parity_lint.js` for a clean-checkout/chat session to install.

**P2 (unchanged, planned):** `fx.embers=false` — rising-ember/dust-mote ambient particles still absent (FEEDBACK #6 B-2).

**ESCALATION to Hiro:** nothing urgent. The auditor is healthy/fresh this run. To turn anim_coverage GREEN, apply the
one-line `entities:` addition to the `window.__AUDIT__` hook in `arena.html` (build schedule will pick this up), and let
a clean-checkout session install parity_lint rule8 (staged copy ready). No new art needed.

---

## RUN-LOG 2026-06-28 (H) — static lint GREEN (verified on-disk); audit STALE again; phantom P1s unchanged

**TL;DR.** Static DC-parity lint = **GREEN**: every P1/P2 rule (canvas-fill/FIT+autocenter, hero-scales-with-VIEW_H,
SPRITE_TARGET_H map, 3 backdrop layers bg_far/floor/fg loaded + depth -100/-99/9000, Light2D braziers, virtual stick +
4 verb buttons, rule7 audit-hook + 3 fields) verified PASS against the **authoritative on-disk arena.html (2345 lines)**.
Only P3 atmosphere warns possible (bloom/vignette/embers naming). `latest.json` ts 2026-06-27 18:29 local / 23:29 UTC vs
this run ~01:00 UTC = **~91 min STALE (>30 min)** → reads FAIL (2 P1) but DO NOT TRUST IT; Hiro must restart the auditor.

**Why the harness couldn't self-run (recurring, fishbone=platform/visual + tests/metrics).** The OneDrive **bash mount
served tail-TRUNCATED copies** of `arena.html` (1088 of 2345 lines), `tools/parity_lint.js` (140 of 157 — node died on an
unterminated string at L141) and `game/tools/playtest_drive.js` (108 of 134) this run. The files **on disk are intact**
(confirmed via Read/Grep which fetch the authoritative copy). So `node tools/parity_lint.js` from the sandbox is
INDETERMINATE during a truncation window; this run instead evaluated all rules via Grep over the real file.

**Phantom 2×P1 (warlock_scale + backdrop_layers) — unchanged from runs E/F/G.** Hook EXISTS (arena.html L2075, all 3
fields warlockPctH/layers/fx). Root cause stays the runtime race in `visual_audit.py` (single flat 3500ms wait + one read,
no `wait_for_function`) × no `create()`-time seed of the global. **Still NOT applied** — by policy run G set: editing the
(non-live) build during an ACTIVE mount-truncation window risks a truncated write-back, and the fix can't be verified
without Hiro's GPU/playwright. **ESCALATION to Hiro (one of):**
  - **Fix #1 (build):** in `Arena.create()` add `window.__AUDIT__={warlockPctH:0,layers:{far:false,floor:false,fg:false},fx:{}};` so the global is never null.
  - **Fix #2 (auditor):** before the read in `visual_audit.py`, `page.wait_for_function("window.__AUDIT__&&window.__AUDIT__.warlockPctH!=null",timeout=8000)`.
  - Then **restart** `python game3d/tools/visual_audit.py --watch` to clear the stale verdict.

**PERMANENT GUARD.** `parity_lint.js` rule7 already pins the hook + fields (passes). No new visual regression this run.

---

## RUN-LOG 2026-06-27 (G) — status HOLDS: phantom audit-hook fail unchanged; mount truncating again

**TL;DR.** No change since runs E/F. `latest.json` (ts 18:29:38 local / mtime 23:29 UTC; this run 00:02 UTC →
**~33 min old, slightly STALE >30 min** — auditor was running but Hiro should confirm `--watch` is still up)
reads **FAIL (2 P1)**: `warlock_scale` + `backdrop_layers` "unknown — build must set window.__AUDIT__.*";
`lighting_fx` (P2) also unknown. `consoleErrors:[]`. canvas_fill (100%/100%) and touch_controls (stick + 4 btns)
genuinely **PASS**. These two P1s remain **phantom instrumentation false-fails** (scene renders correct per run E's
screenshot) — the auditor reads `window.__AUDIT__` as null even though the L1957 hook exists with all 3 fields.

**Why null (recap, run E).** `visual_audit.py` reads the global **exactly once** after a flat
`pg.wait_for_timeout(3500)` (L78) with **no `wait_for_function` poll/retry** (L80-90), and the hook is the **last
statement of `Arena.update()`** with **no `create()`-time seed** → a single race-prone read can land before/without
a populated global. Two candidate durable fixes, neither applied (unattended + active mount truncation makes
in-chat verify/edit of the build unsafe, and the auditor needs Hiro's GPU/playwright to test):
  - **Fix #1 (build, preferred):** seed `window.__AUDIT__ = {warlockPctH:0, layers:{far:false,floor:false,fg:false}, fx:{}}` once in `Arena.create()` so it is never null.
  - **Fix #2 (auditor, complementary):** replace the flat 3500ms wait with `pg.wait_for_function("window.__AUDIT__ && window.__AUDIT__.warlockPctH!=null", timeout=8000)` before the single read.

**PERMANENT GUARD.** Unchanged — `parity_lint.js` rule7 (`audit-hook-present` + `audit-fields`) already statically
asserts the hook string + 3 fields exist (PASSes on current source). A static lint can't catch a runtime-null, so
no case added/removed.

**Mount note.** Bash mount served arena.html (~1088/~2190), parity_lint.js (140/158) and visual_audit.py (174/full)
tail-truncated again this run; Read confirms the real files are intact. In-chat parity-lint verdict is therefore
INDETERMINATE (its own truncation guard would bail) — consistent with prior runs.

**STATUS:** OPEN — escalated to Hiro/game3d-build: apply Fix #1 (one-line `create()` seed) OR Fix #2 (auditor
poll), then restart the auditor. Visual scene itself: PASS.

---

## RUN-LOG 2026-06-27 (F) — status holds: audit-hook seed STILL unapplied; mount still truncating

**TL;DR.** No change since run E. `latest.json` (ts 18:29:38 local / mtime 23:29 UTC, ~28 min before this run —
fresh, auditor IS running) still reads **FAIL (2 P1)** with `warlockPctH/layers/fx = null`, `consoleErrors:[]`.
Confirmed via fresh source read that the `window.__AUDIT__` hook exists (arena.html, end of `Arena.update()`) with
all three fields (`warlockPctH` + `layers{far,floor,fg}` + `fx{bloom,vignette,embers}`) — so the pixels/scene are
right and these remain **phantom instrumentation false-fails**, fully root-caused in run E.

**The proposed fix #1 (one-line `create()` seed of `window.__AUDIT__`) is NOT yet in source** — `grep` finds only the
single late-in-`update()` assignment, no `create()`-time seed. So the false-fail class can still recur. Not applied
this run for the same reason as E: the OneDrive sandbox mount served arena.html **tail-truncated** (1081 of ~2190
lines, no `new Phaser.Game`/`</html>` tail) — `node --check` on the real file is impossible here, and writing the
build back risks truncating its boot tail. Unsafe to self-verify in an unattended run → still deferred to Hiro /
game3d-build.

**PERMANENT GUARD.** Unchanged — `parity_lint.js` rule7 already statically asserts the hook string + the three
fields are present (would PASS on the current source); a static lint cannot catch a runtime-null, so no case
added/removed. The durable fix remains #1 (the `create()` seed).

**STATUS:** OPEN — escalated to Hiro/game3d-build (apply the one-line `create()` seed). Visual scene itself: PASS.

---

## RUN-LOG 2026-06-27 (E) — STALENESS THEORY REFUTED: the audit-hook null IS a real instrumentation bug (gate is lying)

**TL;DR.** Pulled the actual auditor screenshot (`tools/audit/latest.png`, this run) and looked at it. **The scene
renders correctly and on-benchmark for Dragon's Crown** — full-bleed painterly backdrop (amphitheater floor + L/R
stone pillars + god-rays + lit braziers), warlock sprite at a sensible scale (~⅓ screen height), virtual stick
bottom-left, 4 verb buttons (WARD/DASH/SUM/HEX) bottom-right, FIGHT 1/20 HUD live. So the two P1 "fails" are
**FALSE FAILS** — the pixels are right; only the *readout* is broken.

**Run D blamed OneDrive sync staleness. That is now disproven by timestamps + the screenshot:**
- `arena.html` mtime = **2026-06-27 16:38:40 UTC**; the audit (`latest.json` ts) ran at **23:29:38 UTC**. The
  `window.__AUDIT__` hook (arena.html L1957, end of `Arena.update()`) was therefore in the loaded file **~7 h
  before** the audit — not a pre-fix/sync-lag snapshot.
- This run's `latest.png` (mtime 23:29:38, matches the run) shows a **live combat frame** → `create()` AND
  `update()` demonstrably executed and rendered. `update()` has **no early-return between L1882 and the hook at
  L1957**, and `create()` sets `this.hero` (L1293) + `this.bgFar/Floor/Fg` (L1395). So the hook *should* have set
  `window.__AUDIT__` with real values — yet `latest.json` reads `warlockPctH/layers/fx = null`, `consoleErrors:[]`.
- **This is exactly run D's own escalation trigger:** "*If a FRESH run STILL shows null, it IS a code bug.*" It does.

**5 WHYS.** (1) warlock_scale/backdrop_layers/lighting_fx FAIL → (2) `visual_audit.py` read `window.__AUDIT__` as
null/undefined → (3) at eval time the global was unset even though `update()` ran and rendered (screenshot proof) →
(4) the hook is the **last** statement of `update()` and `visual_audit.py` reads it **exactly once** with **no
poll/retry** (L88 `audit: window.__AUDIT__||null`, after a flat `wait_for_timeout(3500)`, no `wait_for_function`)
and there is **no `create()`-time stub** so the global is `undefined` until the first frame that reaches L1957 → (5)
**root cause = brittle instrumentation: a single un-polled read of a global that is only defined *late* in `update()`
and not seeded in `create()`. Any frame where the read samples before/around that assignment (swiftshader headless
timing, or an update that bails after rendering create()'s frame) yields null → the whole DC visual gate reports
phantom P1s.** NOT a visual defect, NOT sync staleness.

**FISHBONE.** tests/metrics: single un-polled read, no `wait_for_function`, no "update ran" assertion ← prime.
agent-process: run D didn't cross-check `latest.png` against the metrics, so the false-fail + wrong root-cause stuck.
code-logic: hook correct but defined too late + no `create()` seed. engine/perf: headless swiftshader rAF timing.
assets/visual: backdrop PNGs + warlock clearly loaded (screenshot) — ruled out.

**FIX (two independent hardenings — for Hiro / game3d-build; NOT applied here — see hazard note):**
1. *Seed the global in `create()`* so it's never undefined before the first `update()`:
   `window.__AUDIT__ = { warlockPctH:null, layers:{far:false,floor:false,fg:false}, fx:{} };` (one line, top of create).
2. *Make the auditor wait for it* — in `visual_audit.py`, before the screenshot/eval add:
   `try: pg.wait_for_function("() => window.__AUDIT__ && window.__AUDIT__.layers", timeout=8000)\n    except Exception: pass`.
   Either alone should flip warlock_scale + backdrop_layers + lighting_fx to their TRUE values (expect PASS except
   the genuinely-pending `embers` P3).

**WHY NOT FIXED THIS RUN (hazard).** The OneDrive sandbox mount served **every** file in this folder tail-TRUNCATED
this run — `arena.html` (1075 of ~2190 lines, no `Phaser.Game`/`</html>` tail), `parity_lint.js` (141/158),
`visual_audit.py` (174/175, unterminated tail), `playtest_drive.js` (108/135). Writing a 2190-line `arena.html`
back through this flaky mount risks truncating its boot tail (the `new Phaser.Game({...})` at L2165 + the touch IIFE
at L2138+) and **breaking the whole build** — unacceptable for an instrumentation stub in an unattended run that
can't render WebGL to self-verify. So: **LOGGED + escalated; fix deferred to the attended game3d-build / Hiro.**

**PERMANENT GUARD.** `parity_lint.js` rule7 already asserts the hook *string* is present (it passes) — a static lint
cannot catch a runtime-null, so no lint case is added/removed. The durable guard is fix #1 (the `create()` seed):
once in, `window.__AUDIT__` is defined before frame 1 and this false-fail class cannot recur. Tracking here until applied.

**STATUS:** OPEN — escalated to Hiro/game3d-build. Visual scene itself: PASS on inspection (canvas-fill, touch,
backdrop layers, warlock scale, lighting all correct in `latest.png`); only the auditor's readout is broken.

---

## RUN-LOG 2026-06-27 (D) — verifying the audit-hook + touch-controls fixes against the live auditor

**TL;DR.** Both prior P1 visual fixes are CONFIRMED PRESENT in current `arena.html` source (read directly,
bypassing the truncating mount). `latest.json` (ts 18:29:38, ~8 min before this run) verdict = **FAIL (2 P1)**
but the two fails are *instrumentation*, not visual defects: `canvas_fill` PASS (100%×100%), `touch_controls`
PASS (stick + 4 buttons), `consoleErrors` empty.

- **Touch-controls P1 (finding below) → RESOLVED.** Source now wires `#stickBase/#stickNub` + verb buttons
  (`bHex/bSummon/bDodge/bWard`) in the tail IIFE (arena.html ~L2138–2170), feeding `stick.{dx,dy,on}` and the
  global verbs. The live auditor agrees: `touch_controls` = PASS, `btns=4`. The standing P1 is closed.
- **Audit-hook P1 → present in source, but `latest.json` still reads null.** `window.__AUDIT__ = {warlockPctH,
  layers, fx}` is published every frame at the tail of `Arena.update()` (arena.html L1923–1932) — verified by
  direct read. Yet `latest.json` metrics show `warlockPctH/layers/fx = null`. **Root-cause (5 Whys):**
  (1) null → (2) auditor read `window.__AUDIT__` as undefined → (3) the served page lacked the executed hook →
  (4) `visual_audit.py` waits `wait_for_timeout(3500)` after load *then* reads `window.__AUDIT__||null`, so 3.5 s
  is ample for `update()` to populate it **if the hook is in the served file** → (5) **root cause = the 18:29
  audit scored an `arena.html` copy that predates the hook reaching the served path (OneDrive sync lag /
  pre-fix snapshot), NOT a code bug.** Evidence it's staleness not timing: the same `latest.json` sees the touch
  DOM (static, parse-time) as PASS but `__AUDIT__` (runtime) as null — consistent with a served file whose
  runtime state simply hadn't been refreshed, and the 3.5 s settle rules out an early-sample race.
  **ACTION (Hiro):** restart / let `python game3d/tools/visual_audit.py --watch` re-read the CURRENT
  `arena.html`; expect `warlock_scale`→PASS (~34%), `backdrop_layers`→PASS, `lighting_fx`→PASS except `embers`
  (the real, separately-tracked P3). *If a FRESH run STILL shows null,* it IS a code bug — hardening fix =
  also publish a `window.__AUDIT__` stub once in `create()` so it's defined before the first `update()` tick;
  leave that to the game3d-build schedule (no blind edits to the truncation-prone `arena.html`).
- **In-sandbox gate hazard (tests/metrics).** The OneDrive mount served `arena.html` (1076 of 2174 lines) AND
  `tools/parity_lint.js` (140 of 158) TRUNCATED this run, so `parity_lint` self-reports **INDETERMINATE
  (truncation guard, exit 0)** and the static visual gate is effectively *blind in-sandbox* unless reconstructed.
  Verified the key parity rules by direct source read instead: scale FIT+CENTER_BOTH (L2125–2130), 3 backdrop
  layers far/floor/fg at depth −100/−99/9000 (L1221–1223, 1361–1364), Light2D braziers + Bloom/Vignette
  (L1337–1340, 1387), audit hook (L1923). **All structurally satisfied.** The truncation guard *working* is good;
  the standing risk is that every sandbox run is INDETERMINATE — a true verdict needs a clean checkout / the
  on-PC auditor (which is the authoritative pixel source anyway).

---

## P1 — VISUAL AUDITOR WAS BLIND (build never published `window.__AUDIT__` → 2 phantom P1 fails)
*Found 2026-06-27 (playtest run). Status: **FIXED THIS RUN** (instrumentation added to `arena.html`, render-only). Case: `parity_lint rule7.audit-hook-present` + `rule7.audit-fields`.*

**What.** The headless DC-parity auditor (`tools/visual_audit.py`) scores `warlock_scale`, `backdrop_layers` and `lighting_fx` by reading `window.__AUDIT__` off the live page. `arena.html` **never set `window.__AUDIT__`** (confirmed by full-file grep — zero matches). So those three checks fell through to their "unknown — build must set window.__AUDIT__.X" branch and the auditor reported them as **FAIL** — `latest.json` (ts 2026-06-27 18:29:38) = "FAIL (2 P1)": warlock_scale + backdrop_layers, plus the P2 lighting_fx. **The scene itself is correct** — these were *phantom* fails caused by a blind probe, not real visual defects: HERO_PX = `clamp(VIEW_H*0.355,240,520)` and at the ground line (`SIDEON_GROUND_FR 0.84`, perspective sc≈0.958) the warlock renders at **≈34% of viewport height** (dead in the 28–36% target band); all three backdrop layers (`bgFar`/`bgFloor`/`bgFg`) are created in `buildSideOn()`; `Light2D` + `applyCameraGrade()` Bloom/Vignette are live.

**Impact.** The visual gate was **lying** — it cried 2 P1s every run while the build was actually meeting those bars, which both masks real regressions (a true scale/layer break would be indistinguishable from the standing phantom fails) and wastes Hiro's attention. A gate that can't see is worse than no gate.

**Repro.** Run `python game3d/tools/visual_audit.py` against `arena.html` *before* this fix → `warlockPctH=null`, `layers=null`, `fx=null`; verdict "FAIL (2 P1)". Grep `arena.html` for `__AUDIT__` → no matches.

**5 WHYS.**
1. Why 2 P1 fails? warlock_scale + backdrop_layers scored FALSE.
2. Why FALSE? The auditor read `window.__AUDIT__.warlockPctH` / `.layers` and got `undefined`.
3. Why undefined? `arena.html` never assigns `window.__AUDIT__` anywhere in the render loop.
4. Why never assigned? The auditor and the build were authored separately; the Python side defined the contract (`a.get("warlockPctH")` etc.) but the JS side was never wired to publish it — no one owned the seam.
5. **Root cause:** a **metrics/instrumentation gap** — the measurement harness depends on a build-side hook that was specified but never implemented, so the gate defaulted-to-fail on data it could never obtain (tests/metrics + agent-process seam).

**ISHIKAWA (fishbone).**
- *tests/metrics:* auditor contract (`window.__AUDIT__.{warlockPctH,layers,fx}`) had no build-side producer; no lint asserted the hook existed (now `rule7`).
- *agent-process:* the probe and the build were iterated by different schedules; the integration seam had no owner.
- *code-logic:* render loop computed `hero.displayHeight` (the exact number wanted) but never exposed it.
- *engine/visual:* values only exist at runtime after WebGL settles — must be published each frame, not statically lintable, so a static gate alone could never catch the *value*, only the *hook's absence*.
- *assets/data:* n/a.

**Fix (applied this run).** Added a render-only instrumentation block at the tail of `Arena.update()` (after `syncSideOn`/`syncFoeCrowd`) that publishes each frame, wrapped in try/catch so it can never break the loop:
`window.__AUDIT__ = { warlockPctH: hero.displayHeight/scale.height*100, layers:{far,floor,fg}, fx:{light2d,bloom,vignette,embers} }`.
Touches no sim/combat/render path — pure read-out. Edited via the file tool + verified full-file integrity (2121 lines, `</html>` tail intact) to dodge the OneDrive truncation hazard; snippet `node --check`-clean. **Expected next auditor run:** warlock_scale → PASS (~34%), backdrop_layers → PASS (far+floor+fg), lighting_fx → PASS (light2d+bloom+vignette true; `embers` still false = the real, separately-tracked P3 below). **Permanent guard:** `parity_lint rule7` now FAILS (P1) if the hook or any of its three fields disappears. **HIRO:** restart the auditor (`python game3d/tools/visual_audit.py --watch`) to confirm the verdict flips to PASS.

---

## P1 — MOBILE/TOUCH CONTROLS ABSENT (no virtual stick, no verb buttons)
*Found 2026-06-27 (playtest run). Status: **RESOLVED 2026-06-27 (run D)** — `#stickBase/#stickNub` + verb buttons (`bHex/bSummon/bDodge/bWard`) now wired in arena.html (~L2138–2170); live auditor `latest.json` confirms `touch_controls`=PASS (stick + 4 buttons). Case: `parity_lint rule5.virtual-stick` + `rule5.verb-buttons`.*

**What.** `arena.html` wires only keyboard (`this.input.keyboard.on('keydown'/'keyup')`) and mouse pointer input (`pointerdown` → tap = SLASH, right-click = ROLL; `pointermove` = aim). There is **no on-screen virtual movement stick** (`#stickBase/#stickNub`, no `touchstick.js`) and **no on-screen verb buttons** (Attack/Dodge/Special/Summon/Hex/Transform). The `stick = {dx,dy,on}` object exists (L137) and is read in the move integrator (`if(stick.on){ mx+=stick.dx; my+=stick.dy; }`, L934) but **nothing ever sets it** — it is a dead stub.

**Impact (on a phone).** No keyboard ⇒ the player **cannot move at all** (the only input is tap=SLASH / right-tap=ROLL). SUMMON, PARRY/PORTAL, and the form/transform verbs are **completely unreachable**. The build is effectively unplayable on touch — and the live 2D game ships mobile controls, so this is a parity regression Hiro keeps asking about.

**Repro.** Open `game3d/arena.html` on a touchscreen (or DevTools device emulation, no keyboard). Try to walk the warlock or open SUMMON/PARRY → impossible.

**5 WHYS.**
1. Why unplayable on mobile? No on-screen controls exist.
2. Why no on-screen controls? The shell was built desktop-first (keyboard + mouse) for fast iteration; the `stick` object was stubbed "mobile parity later" (L137) and never finished.
3. Why never finished? Each ★ run prioritised the LOOK (backdrop, braziers, sprites) — the highest-signal visual gaps — and deferred input plumbing.
4. Why did that slip past review each run? There was **no parity check for touch** — the agent lints by reading code, and nothing asserted the stick/buttons existed, so their absence was invisible to the gate.
5. **Root cause:** the parity gate had no mobile-controls assertion (tests/metrics gap) **and** the uplift backlog had no explicit "touch controls" milestone (agent-process gap), so a P1 playability hole stayed open while cosmetic work advanced.

**ISHIKAWA (fishbone).**
- *code-logic:* `stick` read but never written; pointer handler only maps tap→slash.
- *platform-mobile:* desktop-first input model; no DOM control overlay; viewport meta is mobile-ready but unused.
- *assets/data:* n/a (no art needed — DOM/CSS controls).
- *tests/metrics:* no parity assertion for stick/verb-buttons (now added).
- *agent-process:* no "touch controls" item on the uplift milestone ladder; LOOK work crowded it out.
- *engine:* Phaser supports `addPointer` for multitouch — not yet configured for simultaneous stick + button presses.

**Fix.** NOT auto-fixed this run: this is feature/design work (build a DOM `#stickBase/#stickNub` overlay + `.btn` verb row, feed `stick.dx/dy/on` from touch, route buttons to `doSlash/startChannel/doParry/doRoll` and the form verbs, enable Phaser multitouch). Left to the **game3d-build schedule** per the fix policy (no blind edits to the truncation-prone `arena.html`). **Permanent guard added:** `parity_lint.js` now FAILS (P1) until the stick + verb buttons exist. **HIRO:** needs a build pass to add touch controls (no new art required).

---

## P3 — DC ATMOSPHERE FX INCOMPLETE (no bloom/vignette grade, no animated god-rays, no ambient embers)
*Found 2026-06-27 (playtest run). Status: OPEN / PLANNED. Case: `parity_lint rule4.bloom-vignette` + `rule4.embers` (WARN, non-failing).*

**What.** The painted 3-layer parallax pit + flickering brazier `Light2D` point-lights have landed (FEEDBACK #6 A + B-1). Still missing vs Dragon's Crown: the **Bloom + Vignette + warm ColorMatrix camera grade** (no `PostFX`/`Bloom`/`Vignette` in the file), **animated god-ray shafts** (god-rays are only baked into the static `bg_far` art, no drifting volumetric shafts), and **rising-ember / dust-mote ambient particles**. Without these the lit pit reads slightly flat/static next to Vanillaware's painterly glow.

**Impact.** Cosmetic polish only — not a playability bug. The stage is already torch-lit and parallaxed (~80% to DC per the plan's own estimate).

**5 WHYS (brief).** Missing because they are the *explicit next increment* the plan defers to: `GAME3D_UPLIFT_PLAN.md` NEXT STEP = "FEEDBACK #6 part B-2: add Phaser 3.60 camera post-FX (Bloom + Vignette + warm ColorMatrix), then embers, then crowd life." Root cause is **intended sequencing**, not an oversight — logged so it stays visible and the lint warns until done.

**Fix.** Left to the **game3d-build schedule** (the planned B-2 step). `parity_lint.js` WARNs (P3, non-failing) until bloom/vignette + ember particles are wired.

---

## NON-FINDINGS verified GREEN this run (parity rules 1, 2, 3, 6)
- **Rule 1 — canvas fills the window:** `new Phaser.Game` uses `scale.mode = Phaser.Scale.FIT`, `width:VIEW_W / height:VIEW_H` (derived from `window.innerWidth/innerHeight`, clamped), `autoCenter: CENTER_BOTH`. Game size == window size + FIT ⇒ no black-margin letterbox. (Soft P3 note: explicit `canvas{100vw/100vh}` CSS not set — harmless today, lint warns to harden.)
- **Rule 2 — char-to-bg scale:** `HERO_PX = clamp(VIEW_H*0.355, 240, 520)` ⇒ warlock ≈ 34% of screen height (DC band 25-38%); `SPRITE_TARGET_H` ratio map sizes every foe by world height, not PNG dims.
- **Rule 3 — 3-layer backdrop:** `bg_far` (crowd/amphitheater, depth −100) BEHIND, `bg_floor` (depth −99) below actors, `bg_fg` (pillars/braziers, depth 9000) OVER; parallax on `bgFar.x`.
- **Rule 6 — camera framing:** `SIDEON_GROUND_FR = 0.84` (feet line in band), no cropping `setZoom`.
