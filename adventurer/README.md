# Adventurer

A browser RPG built with Phaser. This folder contains the editable game, art and audio, development tools, and project documents.

## Play the game locally

**[Open Adventurer](http://127.0.0.1:8734/index.html)** while the local server is running.

If the page does not open, run these commands in PowerShell:

```powershell
Set-Location -LiteralPath 'C:\Users\charl\The Sorcerer Sword ARPG\adventurer'
py -m http.server 8734 --bind 127.0.0.1
```

Keep that terminal open while playing. Press Ctrl+C to stop the server. If port 8734 is already in use, try the game link first; the server may already be running.

The entry file is [index.html](index.html). Use the local web address so the browser can load the game's assets correctly. No build step is required. The public website is hosted separately and does not depend on this local server.

[Varenholm's Gate art viewer](http://127.0.0.1:8734/index.html?gateArtPreview=1) · [Character art preview](http://127.0.0.1:8734/index.html?artPreview=1)

## Find things

| Folder | Contents |
| --- | --- |
| [docs](docs/README.md) | Game design, campaigns, dialogue, art plans, prompts, and update reports |
| `js/` | Game systems, story data, scenes, and rendering code |
| [assets](assets/README.md) | Original art and the optimized art used by the game |
| `audio/` | Voices, music, and sound effects |
| `lib/` | Browser libraries, including Phaser |
| `tools/` | Exporters, voice tooling and state, art production tools, and QA captures |
| `test/` | Automated checks; older text results are in `test/reports/` |
| `marketing/ads/` | Advertising videos, audio, source clips, and production scripts |
| [archive](archive/README.md) | Project snapshots, retained voice backups, legacy exports, and superseded art |
| `node_modules/` | Installed development dependencies |

The root also keeps `package.json`, its lockfile, and the ESLint/Git configuration. Run development commands from this root folder. Install dependencies with `npm install` when needed; `npm test` runs the core checks.

## Organization record

The September 11 folder cleanup moved 161 files without deleting their contents. See the [cleanup notes](docs/maintenance/FOLDER_ORGANIZATION.md) and [old-to-new file index](docs/maintenance/organization-2026-09-11.json).

The previous long README is preserved as [project history](docs/history/PROJECT_HISTORY.md). Its older launch instructions and development notes are historical; use this page to start the current game.
