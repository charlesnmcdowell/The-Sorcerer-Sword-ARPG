# AI Trends Digest — Neverending Narratives
*Research watch for Hiro (game / audiobooks / marketing / process). Newest at top.*

## 2026-06-25

**TL;DR — this run:** Claude Code's new Dynamic Workflows preview splits jobs across parallel subagents — a direct upgrade for your schedule fleet. New multi-speaker TTS (Fish S2 Pro, free VibeVoice) now challenge eleven_v3 for dialogue scenes. Learn WIP limits to stop half-finished work piling up.

**Dynamic Workflows + multi-agent "studios"** (Game Dev / Process) — Opus 4.8 (May 28) shipped a Dynamic Workflows research preview that splits a job across parallel subagents; community packs orchestrate dozens of specialized game-dev agents.
- Why it matters: your 5 schedules run mostly serially — parallel subagents mean faster builds/QA, and the studio pattern maps cleanly onto your CEO/director model.
- Suggested action: pilot one schedule (e.g. audiobook QA) as a parallel-subagent workflow; measure wall-clock vs. today.
- Decision needed? No.
- Source: https://www.mindstudio.ai/blog/code-with-claude-2026-new-agent-features

**Multi-speaker TTS challengers to eleven_v3** (Audiobooks) — Fish Audio S2 Pro now tops TTS-Arena2 with 50+ emotion controls and mid-sentence voice switching; Microsoft's VibeVoice (open/free) generates up to 90 min with 4 distinct speakers in one pass.
- Why it matters: your voice is locked to eleven_v3, but dialogue-heavy chapters with multiple characters are exactly where mid-sentence switching and true multi-speaker shine — and VibeVoice costs nothing.
- Suggested action: A/B one dialogue-heavy chapter — eleven_v3 vs. Fish S2 Pro vs. VibeVoice — scored on a fixed rubric.
- Decision needed? **Yes** — run a bake-off, or hold eleven_v3 as the locked standard?
- Source: https://fish.audio/blog/best-text-to-speech-for-audiobooks-2026/

**Serial-first model on Royal Road** (Marketing) — Serialize free chapters to build a binge audience, then funnel to Patreon/KU; RR added a native Patreon button, and top authors now clear $20k+/mo on Patreon alone.
- Why it matters: your funnel is free-game → email → book; a serialized RR presence is the proven LitRPG top-of-funnel and feeds the same email list.
- Suggested action: post Book 1 as a free RR serial with a chapter-end CTA to the game + newsletter.
- Decision needed? **Yes** — commit a book to Royal Road serialization?
- Source: https://janefriedman.com/the-serial-first-model-how-royal-road-powers-direct-to-fan-author-careers/

**WIP limits** (Process — learn this) — Kanban WIP limits cap how many items sit in any one stage at once; start near "team size − 1" (solo ≈ 2) and lower until flow stalls. Capping parallel work surfaces your real bottleneck and kills multitasking drag.
- How to apply: cap "in progress" across all schedules to ~2 — nothing new starts until something ships through safe_publish. This pairs with your regression-gate discipline.
- Decision needed? No.
- Source: https://www.atlassian.com/agile/kanban/wip-limits

## 2026-06-24

**TL;DR — this run:** Phaser 4.1 shipped with built-in AI-agent skills (matters for the 3D uplift). ACX now gatekeeps AI narration behind a support request — lead distribution with Spotify/Kobo/Google. Learn eval-driven development to harden your agent schedules.

**Phaser 4.1 + AI agent skills** (Game Dev) — Phaser 4.0 shipped Apr 10, 4.1 on Apr 30 2026; the repo now ships "AI agent skills" giving coding agents deep per-subsystem knowledge.
- Why it matters: The 3D uplift is the moment to lock engine version; frontier LLMs single-shot Phaser 4 scaffolds cleanly.
- Suggested action: Spike a throwaway Phaser 4 branch and measure migration cost vs. your current 3.x.
- Decision needed? **Yes** — target Phaser 4 for the 3D remake, or stay on 3.x?
- Source: https://phaser.io/phaser4

**ACX AI-narration gate** (Audiobooks) — As of Mar 2026, ACX/Audible requires contacting support *before* submitting AI-narrated audio, with disclosure mandatory in the description. Spotify/INaudio, Kobo, and Google Play accept disclosed AI narration with no gate.
- Why it matters: Audible is the biggest store but now the highest-friction channel for us.
- Suggested action: Launch on Spotify/INaudio + Kobo + Google first; queue an ACX support email only if Audible reach justifies the friction.
- Decision needed? No.
- Source: https://www.tomevox.com/blog-publish-on-audible

**Read-through rate = the LitRPG north-star metric** (Marketing) — Top Royal Road authors win on read-through *between volumes*, not launch spikes; bingers and "wait-for-complete" readers dominate.
- Why it matters: Your free-game → email → book funnel should optimize Book N→N+1 conversion, not just top-of-funnel signups.
- Suggested action: Instrument per-book drop-off; treat any large inter-volume drop as a regression to root-cause.
- Decision needed? No.
- Source: https://www.royalroad.com/forums/thread/144634

**Eval-driven development / EDDOps** (Process — learn this) — Evals become the spec: score every prompt/model change on multiple dimensions before it ships, and never fix a failure by special-casing the test. Research now formalizes this as continuous evaluation across an agent's whole lifecycle, not a one-time test phase.
- Why it matters: This *is* your safe_publish gate + permanent-regression-case discipline, formalized — each schedule becomes a measurable experiment instead of a guess.
- How to apply: Give each agent (audiobook QA, this trends watch, the build) a tiny fixed eval set; no prompt change ships without a green run.
- Decision needed? No.
- Source: https://www.braintrust.dev/articles/eval-driven-development

## Already shared
- Dynamic Workflows + multi-agent studios (Claude Code) — 2026-06-25
- Multi-speaker TTS challengers (Fish S2 Pro / VibeVoice) — 2026-06-25
- Serial-first model on Royal Road — 2026-06-25
- WIP limits (Kanban) — 2026-06-25
- Phaser 4.1 + AI agent skills — 2026-06-24
- ACX AI-narration gate — 2026-06-24
- Read-through rate north-star metric (LitRPG) — 2026-06-24
- Eval-driven development / EDDOps — 2026-06-24
