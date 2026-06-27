# AI Trends Digest — Neverending Narratives
*Research watch for Hiro (game / audiobooks / marketing / process). Newest at top.*

## 2026-06-26

**TL;DR — this run:** Phaser built an AI-first engine (Phaser AE) + a "harvest-blocks" agent loop that mirrors your CEO/director model exactly. New expressive multi-speaker TTS (MAI-Voice-2, Gemini 2.5) join the eleven_v3 bake-off question. Learn DORA's MTTR metric to make recovery speed — not zero-bugs — your quality north star.

**Phaser AE + the "harvest blocks" agent loop** (Game Dev / Process) — Phaser rebuilt its API around how an *agent* thinks (verbs like `sprite.flash()`), keeping the surface small so the model holds it in its head. Games are decomposed into reusable, capability-named "blocks" with embedded gotchas; agents author/build/test, a human plays, then reusable pieces are scrubbed and banked for every future build.
- Why it matters: this is your director model — small interfaces, a permanent library of known-good components, human-gated publish. The "harvest after each build" loop is exactly how your regression cases should compound.
- Suggested action: start a `blocks/` library in the 3D uplift — every fix gets scrubbed game-specific and saved with its gotcha, so the next build reuses it.
- Decision needed? No.
- Source: https://phaser.io/news/2026/06/how-we-built-the-phaser-game-agent-with-claude-managed-agents-and-superserve

**MAI-Voice-2 & Gemini 2.5 multi-speaker TTS** (Audiobooks) — Build 2026 brought Microsoft's MAI-Voice-2 (15 languages, emotion tags like *whispered/excited*, stable speaker identity over long-form) and upgraded Gemini 2.5 Flash/Pro TTS with better multi-speaker control.
- Why it matters: more credible challengers to eleven_v3 for dialogue-heavy chapters; stable long-form identity is the weak point of most TTS.
- Suggested action: fold both into the dialogue-chapter bake-off you're already weighing (vs Fish S2 Pro/VibeVoice).
- Decision needed? **Yes** — run one bake-off across all four, or hold eleven_v3 as locked standard?
- Source: https://lushbinary.com/blog/microsoft-mai-voice-2-transcribe-1-5-speech-ai-guide/

**BookTok = your top-of-funnel video channel** (Marketing) — Fantasy is a top-performing BookTok category; the winning formula is an 80/20 ratio (80% value/community, 20% promo) and authenticity over polish — 45% of users have bought a book they saw there.
- Why it matters: short, raw clips (game footters, lore hooks) feed the free-game → email funnel cheaper than any ad.
- Suggested action: post 3 low-production clips/week — gameplay moments + a lore tease — each ending with the newsletter CTA.
- Decision needed? No.
- Source: https://insights.bookbub.com/how-to-use-short-form-video-market-your-book/

**DORA Mean Time To Recovery (MTTR)** (Process — learn this) — DORA's recovery metric measures how fast you restore after a failure; elite = under 1 hour. The insight: high performers aren't failure-free, they recover fast — fast MTTR signals good observability, clean rollbacks, and a blameless (not blame-seeking) response.
- How to apply: time how long from "reported bug" → "fixed + published" via safe_publish; treat MTTR as the metric to shrink, pairing it with your permanent-regression-case habit. Your rollback tag/branch already shortens it.
- Decision needed? No.
- Source: https://larridin.com/developer-productivity-hub/dora-metrics-explained-complete-guide-2026

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
- Phaser AE + harvest-blocks agent loop — 2026-06-26
- MAI-Voice-2 & Gemini 2.5 multi-speaker TTS — 2026-06-26
- BookTok / short-form video top-of-funnel — 2026-06-26
- DORA Mean Time To Recovery (MTTR) — 2026-06-26
- Dynamic Workflows + multi-agent studios (Claude Code) — 2026-06-25
- Multi-speaker TTS challengers (Fish S2 Pro / VibeVoice) — 2026-06-25
- Serial-first model on Royal Road — 2026-06-25
- WIP limits (Kanban) — 2026-06-25
- Phaser 4.1 + AI agent skills — 2026-06-24
- ACX AI-narration gate — 2026-06-24
- Read-through rate north-star metric (LitRPG) — 2026-06-24
- Eval-driven development / EDDOps — 2026-06-24
