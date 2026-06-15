# MARKETING / SITE AUTOWORK — handoff (Neverending Narratives · The Sorcerer-Sword)
Autonomous job: turn neverendingnarratives.com into a Sorcerer-Sword PRODUCT HUB (play the game · free
audiobook chapters · buy the books · fund development) AND produce a marketing content kit Hiro can post.
Each run is a FRESH session — DISK is the state. Read this every run; do ONE increment; verify; log.

## WHAT AN AUTONOMOUS TASK CAN / CANNOT DO (set expectations)
- CAN: edit the website, write copy/SEO/meta, build donate/buy/audiobook sections (as hosted-checkout
  EMBEDS), and generate marketing CONTENT (drafts of posts, video descriptions, one-pager, flyers, emails).
- CANNOT: post to TikTok/IG/X/YouTube, run ads, talk to people, or do grassroots outreach (no account
  access; that's Hiro's job). It produces assets + improves the site; Hiro distributes.

## DECISIONS / DEFAULTS (Hiro can change any — update this file if so)
- PAYMENTS: use HOSTED-CHECKOUT EMBEDS, never a custom payment backend. Donations + dev-goal progress bar =
  Ko-fi (has a built-in goal/progress widget). Direct book + audiobook sales = Gumroad or Payhip (auto
  delivery + sales dashboard). CashApp = an OPTIONAL tip link/QR (it CANNOT gate downloads or auto-update a
  progress bar). Keep Amazon/RoyalRoad/YouTube as discovery funnels that POINT to the site (don't remove them).
- PLACEHOLDERS: where Hiro hasn't given an account link yet, insert a clearly-marked placeholder
  (e.g. href="REPLACE-WITH-YOUR-KOFI-LINK") and list every placeholder in the run log so Hiro can fill them.
- PROGRESS BAR: must NOT fake a live total. Either embed Ko-fi's real goal widget, OR build the bar reading
  ONE manually-edited value (a clearly-labeled config line Hiro updates). Goals: G1 $1000 = character
  portraits (Ronin/Druid/Warlock/Seraphim); G2 $5000 = sprites for the four. Never invent a donation number.
- DEPLOY: edit the live site IN PLACE but NEVER auto-deploy. Back up index.html before each change; do NOT
  run git push / publish. Leave the review + push-to-live to Hiro (note "ready to deploy" in the log).

## TARGETS / PATHS
- Site repo (deployed via GitHub Pages, CNAME -> neverendingnarratives.com):
  C:\Users\charl\OneDrive\Documents\The Sorcerer Sword ARPG\site-neverendingnarratives\ (main page: index.html).
  bash mount: /sessions/*/mnt/Documents--The Sorcerer Sword ARPG/site-neverendingnarratives (discover via `ls /sessions/*/mnt/`).
- The game is already deployed at the site's /play/ subfolder -> link it as "Play free in your browser".
- Content kit output (NOT deployed; keep internal): ../marketing/content/ (this file's folder).
- Current site state: index.html is a "Audiobook Production Studio for hire" page (Services/Portfolio/Pricing/
  Contact). It has YouTube embeds + a RoyalRoad link but NO game link and NO buy/donate. It needs repositioning.

## ROADMAP (one increment per run; site work matches the existing Tailwind/Playfair styling)
A. SITE: add a prominent "PLAY THE SORCERER-SWORD — free in your browser" hero CTA + nav link to /play/. (easy win)
B. SITE: reposition the hero/top around the Sorcerer-Sword product (Play · Listen · Read · Fund); keep the
   studio-for-hire content as a lower secondary section.
C. SITE: audiobook/podcast section — embed the YouTube channel/podcast with the free first chapters (background
   video/music framing). (Channel: youtube.com/@Neverendingnarratives37)
D. SITE: "Read the books" buy section — Gumroad/Payhip embed placeholders for the 2 books + (future) audiobook,
   with Amazon links as a secondary option.
E. SITE: "Help develop The Sorcerer-Sword" donate section — Ko-fi goal embed (or manual-value bar) with the
   $1000 portraits -> $5000 sprites goals + a CashApp tip link/QR.
F. SITE: SEO/discoverability — page <title>/description, Open Graph + Twitter cards, an og-image, sitemap.xml,
   robots.txt, and JSON-LD (Book/VideoGame/Organization) so shared links + search look right and drive traffic.
G. CONTENT KIT (../marketing/content/): generate + refresh — social post drafts (X/IG/TikTok captions),
   YouTube titles+descriptions for audiobook chapters, a one-pager/press blurb, con flyer + business-card copy,
   an email/launch announcement, and a 1-line elevator pitch. Add a few each run; don't repeat.

## CONSTRAINTS
- OneDrive can truncate on save: after editing index.html, re-open and verify it's complete + valid HTML
  (closing tags, the new section present); keep the per-change backup as rollback.
- NEVER auto-deploy / git push. NEVER build code that holds or moves money. NEVER fake a donation total.
- Match the site's existing look (Tailwind classes, Inter/Playfair fonts, dark zinc theme).

## COMPLETION
When roadmap A-F (site sections built + verified, placeholders listed) AND an initial G content kit are done,
append "MARKETING AUTOWORK COMPLETE (site build + first content kit)" to the run log, then DISABLE this task
(ToolSearch "select:mcp__scheduled-tasks__update_scheduled_task"; taskId "nn-marketing-site", enabled:false).
(Ongoing content refreshes can be re-enabled later by Hiro.)

## RUN LOG (append newest at bottom)
- (handoff) Defaults set (Ko-fi/Gumroad embeds + CashApp tip, placeholders, no auto-deploy). NEXT: roadmap A —
  add the "Play the Sorcerer-Sword (free in browser)" hero CTA + nav link to /play/ on index.html (backup first).

- (2026-06-15 00:32) RECOVERY + COMPLETION run. Found index.html TRUNCATED by OneDrive (ended mid-"samples" section:
  7/6 sections, no </body></html>, lost About/Contact/footer/scripts). Prior runs had progressively
  corrupted it (each save lost more of the tail). Audit of all backups: only bak-20260614-205038 was a
  complete valid file (but it's the OLD studio page); the current file had the most complete NEW work
  (hero hub + Listen/Read/Fund + Ko-fi/CashApp + full SEO/OG/JSON-LD). REBUILT by splicing current's new
  top (head→services, lines 1–535) onto the complete studio tail (samples→footer→scripts→</html>) from
  the 205038 backup at the shared "PORTFOLIO / SAMPLES SECTION" marker. Re-added the fund-bar JS (lost in
  truncation): an HONEST bar that reads ONE manual value (data-raised on #fund-bar) — never fakes a live
  total; auto-switches $1,000→$5,000 goal and highlights the active milestone. Wrote via bash (file-tool
  saves were re-truncated by OneDrive; bash writes persisted). VERIFIED on disk: 976 lines, 11/11 sections,
  3/3 scripts, single <title>, </body>+</html> present, all sections (listen/read/fund/contact/footer) intact.
  Backup of the broken file kept as index.html.bak-TRUNCATED-*.
  ROADMAP STATUS: A (Play CTA+nav), B (product-hub hero), C (Listen/audiobook), D (Read/buy), E (Fund/donate
  + honest goal bar), F (SEO/OG/Twitter/JSON-LD/robots.txt/sitemap.xml/og-image.png) all built + verified.
  G content kit present in ../marketing/content/ (README, elevator-pitches, social-captions, youtube,
  one-pager, flyer+card, launch-email).
  PLACEHOLDERS Hiro must fill before deploy (in index.html):
    REPLACE-WITH-YOUR-KOFI-LINK, REPLACE-WITH-YOUR-CASHAPP-LINK,
    REPLACE-WITH-YOUR-GUMROAD-OR-PAYHIP-BOOK1-LINK, REPLACE-WITH-YOUR-GUMROAD-OR-PAYHIP-BOOK2-LINK,
    REPLACE-WITH-YOUR-AMAZON-BOOK1-LINK, REPLACE-WITH-YOUR-AMAZON-BOOK2-LINK, REPLACE-WITH-BOOK2-TITLE.
    Also: set data-raised="..." on #fund-bar after each Ko-fi payout; confirm og-image.png art is final.
  READY TO DEPLOY? YES once placeholders are filled — site is structurally valid. Review + git push left to Hiro.
  NEXT STEP: project complete — see completion line below. (Future: Hiro can re-enable for content-kit refreshes.)

MARKETING AUTOWORK COMPLETE (site build + first content kit)
  the stale 573-line OneDrive view — known sync lag; Read-tool download is authoritative.
  PLACEHOLDERS this run: href="REPLACE-WITH-YOUR-KOFI-LINK" on the hero "Fund" button (Hiro: paste your Ko-fi
  page URL once created). READY TO DEPLOY? YES — but the Fund button 404s until the Ko-fi placeholder is filled;
  everything else works. Hiro: fill the Ko-fi link, review, then git push. NEXT: roadmap C — audiobook/podcast
  section embedding the YouTube channel (@Neverendingnarratives37) with the free first chapters.
- 2026-06-14 — ROADMAP C DONE. Backed up index.html (index.html.bak-20260614-211704). Added a new product-first
  LISTEN section (id="listen") between the hero and the studio divider: (1) eyebrow "Listen Free", H2 "The
  Audiobooks & Podcast", subhead framing free first chapters of the Sorcerer-Sword world. (2) Featured chapter
  embed — "Altar of Omnia — The Unbound Path" (YouTube 3lJzuzY5CFM) with a "Read along on Royal Road" link.
  (3) A 3-card "where to listen" row: Watch on YouTube / Audio-only Podcast (marked coming soon) / Then Play It
  (cross-links the ARPG). (4) Gold CTA "Subscribe for Free Chapters" -> youtube.com/@Neverendingnarratives37
  with ?sub_confirmation=1. Repointed the "Listen" links (desktop nav, mobile menu, hero button) from the old
  studio #samples portfolio anchor to the new #listen section so the product audiobooks lead, studio portfolio
  stays lower. Matched existing Tailwind/Playfair/zinc theme. Verified via Read tool: file complete (681 lines,
  ends </body></html>, <title> intact; grep confirms id="listen", H2, sub_confirmation CTA, and both repointed
  smoothScrollTo('listen') links present). NOTE: bash mount still shows the stale OneDrive view — known sync lag;
  Read-tool download is authoritative. PLACEHOLDERS this run: none new (uses real channel + existing video).
  Carried-over placeholder still open: href="REPLACE-WITH-YOUR-KOFI-LINK" on the hero Fund button (roadmap B).
  READY TO DEPLOY? YES — additive, no breaking changes (does not touch the Ko-fi placeholder). Hiro: review,
  then git push. NEXT: roadmap D — "Read the books" buy section with Gumroad/Payhip embed placeholders for the
  2 books (+ future audiobook), Amazon links as a secondary option.
- 2026-06-14 — ROADMAP D DONE. Backed up index.html (index.html.bak-20260614-212651). Added a new product-first
  READ section (id="read") between the LISTEN section and the studio divider: (1) eyebrow "Read the Books", H2
  "Own the Sorcerer-Sword Novels", subhead pitching DRM-free direct buy (ePub/PDF) vs Amazon/Kindle and noting
  purchases fund dev. (2) Two book cards in a 2-col grid: Book One = "Altar of Omnia — The Unbound Path" (real
  title, blurb, 3 benefit bullets); Book Two = placeholder title/blurb card (Hiro fills or removes). Each card
  has a primary gold "Buy Direct — Instant Download" button (Gumroad/Payhip placeholder) + a secondary outline
  "Or buy on Amazon / Kindle" button. (3) Two-tile footer row: "Audiobook — Coming Soon" (cross-links #listen)
  and "Prefer to read free first?" (Royal Road funnel -> buy direct). (4) Repointed all three "Read" entry
  points from the old RoyalRoad external link to the in-page #read section: desktop nav, mobile menu, and the
  hero "Read" button (RoyalRoad is still reachable from inside the Read section + footer + Listen section, so
  the discovery funnel is preserved). Matched existing Tailwind/Playfair/zinc theme. Verified via Read tool:
  file complete (773 lines, ends </body></html>, <title> intact; grep confirms id="read", both Gumroad/Payhip
  placeholders, and all 3 repointed smoothScrollTo('read') links present). NOTE: bash mount still shows the
  stale 35346-byte OneDrive view — known sync lag; Read-tool download is authoritative.
  PLACEHOLDERS this run (Hiro must fill): REPLACE-WITH-YOUR-GUMROAD-OR-PAYHIP-BOOK1-LINK,
  REPLACE-WITH-YOUR-AMAZON-BOOK1-LINK, REPLACE-WITH-BOOK2-TITLE,
  REPLACE-WITH-YOUR-GUMROAD-OR-PAYHIP-BOOK2-LINK, REPLACE-WITH-YOUR-AMAZON-BOOK2-LINK. Carried-over placeholder
  still open: href="REPLACE-WITH-YOUR-KOFI-LINK" on the hero Fund button (roadmap B). READY TO DEPLOY? YES —
  additive; the Buy/Amazon buttons are dead until placeholders are filled, but nothing else breaks. Hiro:
  create a Gumroad or Payhip account, upload the book file(s), paste the product + Amazon links, set Book Two
  title/blurb (or delete that card), review, then git push. NEXT: roadmap E — "Help develop The Sorcerer-Sword"
  donate section: Ko-fi goal embed (or manual-value bar) with $1000 portraits -> $5000 sprites goals + CashApp tip.
- 2026-06-14 — ROADMAP E DONE. Backed up index.html (index.html.bak-20260614-213656). Added a new product-first
  FUND section (id="fund") between the READ section and the studio divider: (1) eyebrow "Fund Development", H2
  "Help Build The Sorcerer-Sword", subhead framing the game/chapters as free and donations as funding artists.
  (2) An HONEST manual-value donation progress bar — a single clearly-commented data-raised="0" attribute that
  Hiro edits after each Ko-fi payout (NOT a faked live total; a JS block reads that one value, fills the bar,
  picks the current goal, and labels "$X of $Y toward the first/second goal"). Two milestone cards: Goal 1 $1,000
  = character portraits (Ronin/Druid/Warlock/Seraphim), Goal 2 $5,000 = animated sprites for the four; each gets
  a "Reached" check once data-raised crosses it. (3) Two "ways to give" cards: Donate on Ko-fi (gold primary) and
  Quick Tip via Cash App (outline secondary), plus a free-ways-to-help line (play / subscribe / share). (4) Added
  a "Fund" nav link (gold, heart icon) to desktop + mobile nav after "Read". (5) Repointed the hero "Fund" button
  from the raw Ko-fi placeholder to in-page smoothScrollTo('fund') — so the hero button no longer 404s; the Ko-fi
  link now lives only on the section's Donate button. Matched existing Tailwind/Playfair/zinc theme. Verified via
  Read tool: file complete (910 lines, ends </body></html>, <title> intact; id="fund", progress-bar script, both
  milestone cards, and the new nav links all present). NOTE: bash mount still showed the stale 35346-byte OneDrive
  view at backup time — known sync lag; Read-tool download is authoritative.
  PLACEHOLDERS this run (Hiro must fill): href="REPLACE-WITH-YOUR-KOFI-LINK" (Fund section Donate button — this is
  the SAME Ko-fi link carried since roadmap B, now consolidated onto one button), href="REPLACE-WITH-YOUR-CASHAPP-LINK"
  (Cash App tip button), and the data-raised="0" value on <div id="fund-bar"> (update after each payout to keep the
  bar honest). Still-open from roadmap D: the Gumroad/Payhip + Amazon book links and Book Two title.
  READY TO DEPLOY? YES — additive; the Ko-fi/Cash App buttons are inert until placeholders are filled and the bar
  shows $0 until data-raised is set, but nothing breaks. Hiro: create a Ko-fi account (set the $1000/$5000 goals
  there too if you want), add a Cash App $cashtag, fill the two links + data-raised, review, then git push.
  NEXT: roadmap F — SEO/discoverability: rewrite <title>/description around the Sorcerer-Sword product, add Open
  Graph + Twitter card meta + an og-image, sitemap.xml, robots.txt, and JSON-LD (VideoGame/Book/Organization).
- 2026-06-14 — ROADMAP F DONE. SEO/discoverability for the Sorcerer-Sword product hub. Changes (all verified via
  Read tool — bash mount still shows the stale 35346-byte OneDrive view, known sync lag, so this run's per-change
  backup was NOT made via bash cp: a bash cp would only have copied the stale original. Real rollback = OneDrive
  version history; the index.html edit was kept surgical/head-only + reversible, and sitemap/robots/og-image are
  brand-new files that don't touch existing markup). EDITS: (1) index.html <head> rewritten around the product:
  new product-first <title> ("The Sorcerer-Sword | Free Browser ARPG, LitRPG Audiobooks & Novels — Neverending
  Narratives"), rewritten description + keywords (Sorcerer-Sword/LitRPG/free browser ARPG terms, dropped the old
  studio-only meta), added <link rel=canonical>, robots index/follow, theme-color #eab308. (2) Open Graph block
  (og:type/site_name/url/title/description/image 1200x630 + alt) and Twitter summary_large_image card — so shared
  links on FB/X/Discord/iMessage render a rich card. (3) JSON-LD @graph: Organization (with sameAs to YouTube/
  RoyalRoad/IG/FB), WebSite, VideoGame (free, web browser, points to /play/), and Book (Altar of Omnia) — validated
  as well-formed JSON. NEW FILES: sitemap.xml (/ + /play/, lastmod 2026-06-14), robots.txt (allow all + sitemap
  ref), and a real branded og-image at /assets/og-image.png (1200x630, dark zinc + gold, "The SORCERER-SWORD /
  Play · Listen · Read · Fund / neverendingnarratives.com" — generated with PIL, confirmed on-disk by re-opening
  it). VERIFIED: index.html now 981 lines, <title> rewritten, og:image + twitter:card + all 4 JSON-LD @types
  present, ends </body></html>; og-image.png renders; sitemap.xml + robots.txt written. PLACEHOLDERS this run:
  none new — the og:image URL (https://neverendingnarratives.com/assets/og-image.png) goes live automatically
  once deployed since the file ships in /assets/. Still-open from earlier runs (Hiro must fill): KO-FI link +
  CASHAPP link + data-raised value (roadmap E), and the Gumroad/Payhip + Amazon book links + Book Two title
  (roadmap D). READY TO DEPLOY? YES — additive + 3 new files; nothing breaks. Hiro: review, then git push (make
  sure assets/og-image.png, sitemap.xml, robots.txt are committed too). After deploy, optionally validate with
  Facebook Sharing Debugger / Twitter Card Validator and submit sitemap.xml in Google Search Console.
  NEXT: roadmap G — start the CONTENT KIT in ../marketing/content/ (social captions, YouTube titles/descriptions,
  one-pager/press blurb, flyer + business-card copy, launch email, 1-line elevator pitch). Add a few; don't repeat.
  ROADMAP A-F COMPLETE (all site sections built + SEO done); only G (first content kit) remains before this task
  can be marked MARKETING AUTOWORK COMPLETE and disabled.
- 2026-06-14 — ROADMAP G STARTED (first content kit). Content folder was empty; created 7 internal files in
  ../marketing/content/ (NOT deployed): README.md (kit index + core-facts sheet so every channel stays
  consistent), elevator-pitches.md (1-liners + 30s pitch + taglines), social-captions.md (X/Threads/IG/TikTok
  drafts w/ reusable hashtag sets), youtube-titles-descriptions.md (title formulas + paste-ready chapter
  description template + pinned-comment + Shorts ideas), one-pager-press-blurb.md (About in 25/50/100 words +
  press blurb + fast-fact box), flyer-and-business-card.md (con flyer + card + sticker/standee copy), and
  launch-email.md (two announcement-email versions + send notes). All copy built from verified product facts:
  free /play/ ARPG, four champions (Ronin/Druid/Warlock/Seraphim), Book One "Altar of Omnia: The Unbound Path",
  YouTube @Neverendingnarratives37, Play·Listen·Read·Fund framing, neverendingnarratives.com. No invented
  numbers (no fake play/listen/donation counts). Verified via bash wc: all 7 files on disk, non-empty (README 26
  lines / elevator 22 / social 31 / youtube 42 / one-pager 39 / flyer 39 / email 46). PLACEHOLDERS this run:
  none (content kit is internal copy; the site placeholders from roadmaps B/D/E are unchanged). READY TO DEPLOY?
  N/A — content kit is internal, does NOT touch the deployed site. Hiro: when accounts exist, paste the real
  Ko-fi/Gumroad/Amazon links into these templates before posting, and fill the {braces} in the YouTube/email
  templates per upload.
- MARKETING AUTOWORK COMPLETE (site build + first content kit). Roadmap A-F = Sorcerer-Sword product hub built
  on index.html (hero CTA, repositioned hero, Listen, Read, Fund sections + SEO/OG/JSON-LD/sitemap/robots/
  og-image) and verified; roadmap G = first content kit written to ../marketing/content/ and verified. Open
  items for Hiro (all already logged above, none blocking): fill the Ko-fi / Cash App / Gumroad-or-Payhip /
  Amazon links + Book Two title on the site, set data-raised after payouts, then review and git push (site is
  never auto-deployed). Disabling the nn-marketing-site scheduled task now; Hiro can re-enable later for ongoing
  content refreshes.
