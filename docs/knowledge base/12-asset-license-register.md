# 12 — Asset License Register

A complete inventory of every third-party asset and dependency in the shipped game, its source, and its commercial-use status. **Do this before any monetization** (selling, Kickstarter, ads). Keep proof (screenshots of license pages, purchase receipts, subscription invoices) in a folder alongside this doc.

> ⚠️ I am not a lawyer and license terms change. Each row below has a **VERIFY** action — confirm it yourself against the live source/receipt before you rely on it commercially. Status legend: ✅ likely clear · 🟡 verify · ❌ blocker.

## What actually ships in the game

Only a small set of third-party assets are embedded in the build. Most of the old `docs/ASSET_DOWNLOADS.md` list (Kenney, Tiny Swords, 0x72, LPC, Aekashics, Pixel Crawler) was a *wishlist* and was **never embedded** — the game's characters, monsters, and NPCs are all **procedurally drawn in code** (no third-party sprite art). Confirm by checking the keys in `game/assets/embedded.js` (currently only `cainos-*`).

## Register

| # | Asset | Used for | Source | License (as found) | Status | VERIFY |
|---|---|---|---|---|---|---|
| 1 | **Cainos — Pixel Art Top Down: Basic** | All world tiles/props (city, grove, mountain, ashenveil, dungeon, varenholm) — the only third-party art embedded (`cainos-stone/grass/wall/struct/props/plant`) | cainos.itch.io/pixel-art-top-down-basic | Free; **commercial use allowed**; may modify; credit optional; **may NOT redistribute or resell the pack itself** | ✅ | Re-read the license box on the itch.io page and screenshot it. Note: you ship *rendered/embedded* tiles inside a game (fine); you must not ship the raw pack for others to take. |
| 2 | **Phaser** v3.90.0 | Game engine (`game/lib/phaser.min.js`) | phaser.io / github.com/phaserjs/phaser | **MIT License** — free for commercial use; keep the copyright notice | ✅ | Keep Phaser's MIT license text in the repo (it's in the min.js header). No action needed beyond attribution-in-file. |
| 3 | **Music tracks** (10 mp3: title, arena, city, grove, dungeon, mountain, varenholm, ashenveil, pit-druid, pit-seraph) | Zone + pit + title themes | Author-produced (from the `TTRPG/Kenji/music` library) | Depends on the **tool used to generate them** and the subscription tier at generation time | 🟡 | Confirm the generation tool (e.g. Suno/Udio/other) and that you were on a **paid plan that grants commercial ownership** when each track was made. Keep the subscription invoice covering those dates. If any track samples/derives from third-party music, that's a separate clearance. |
| 4 | **Voice clips** (ElevenLabs, ~186 mp3 in `assets/voice/`) | All voiced dialogue | elevenlabs.io | **Paid plans own their audio output and may use it commercially, perpetually — even after the subscription ends.** Free plan = NO commercial use + must attribute. | 🟡 | Confirm generation was done on a **paid plan** (Starter $5+/Creator/etc.). The 30k-credit limit you hit is consistent with a paid Starter plan — verify the invoice. ElevenLabs keeps a license to your voices/content for model training (standard). |
| 5 | **Voices used** (the specific voice IDs in `voice_config.json`) | Character voices | ElevenLabs voice library / designed voices | Stock & designed ElevenLabs voices are licensed for paid commercial output. **Cloned voices of real people require that person's consent** (12+ US states have voice-cloning laws). | 🟡 | Confirm none of the voice IDs are clones of real people without consent. If they're ElevenLabs stock/designed voices, you're fine. |
| 6 | **Fonts** (Courier New, Georgia, Times — CSS font stacks) | All UI text | System fonts (not bundled) | System fonts referenced by name; not embedded/redistributed | ✅ | No action — you reference them, you don't ship the font files. |
| 7 | **Podcast / book links** (credits screen) | Cross-promo to your own podcast + Amazon books | Your own IP | Your content | ✅ | None — your own. |

## 3D uplift assets (the `game3d/` project — in progress)

| # | Asset | Used for | Source | License | Status | VERIFY |
|---|---|---|---|---|---|---|
| 8 | **Three.js** r128 + GLTFLoader | 3D engine + model loading | threejs.org (CDN) | **MIT** — free commercial use | ✅ | Keep the MIT notice. |
| 9 | **KayKit — Character Pack: Adventurers** (+ Skeletons, Animations) | 3D champion + monster models and animations | kaylousberg.itch.io | **CC0** (public domain) — commercial use, modify, no attribution; cannot resell the raw pack | ✅ | Screenshot the CC0 statement on the itch.io page; you ship the models *in the game*, never the raw pack. |
| 10 | **Mixamo** (if used later) | Extra humanoid mocap animations | mixamo.com (Adobe, free) | Royalty-free for commercial games; **cannot redistribute the raw animation files** | 🟡 | Only embed clips in the build; never ship raw files. Free Adobe account. |

## Anthropic API (companion AI) — runtime service, not a shipped asset
The optional companion-chat feature calls the Anthropic API at runtime if a key is set in `config.js`. This is a **paid service you call**, not an asset you ship. If you ever ship a build with a key, that's a cost + key-exposure issue (the publisher strips the key from `config.js` — keep it that way). No content-license concern; just don't bill yourself by leaking a key.

## Action checklist before monetizing

- [ ] Screenshot the Cainos license box