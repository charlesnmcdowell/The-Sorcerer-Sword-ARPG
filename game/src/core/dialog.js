// City UI layer — DOM overlays in the same arcade style as the arena UI:
// dialog box with options, city HUD (name + purse), 8-slot belt, quest log, guild board.

const CityUI = {
  els: {},
  init() {
    const $ = id => document.getElementById(id);
    this.els = { hud: $('cityhud'), name: $('cityName'), purse: $('cityPurse'),
      dlg: $('dialog'), dlgName: $('dlgName'), dlgText: $('dlgText'), dlgOpts: $('dlgOpts'), dlgPortrait: $('dlgPortrait'),
      belt: $('belt'), prompt: $('interactPrompt'), qlog: $('questlog'), qlogBody: $('questlogBody'),
      board: $('guildboard'), boardBody: $('guildboardBody') };
  },
  hud(show) { this.els.hud.style.display = show ? 'block' : 'none'; },
  setIdentity(nickname) { this.els.name.textContent = nickname; },
  setPurse(copper) { this.els.purse.textContent = Money.fmt(copper); },

  prompt(text) { this.els.prompt.style.display = text ? 'block' : 'none'; if (text) this.els.prompt.textContent = text; },

  dialog(name, text, options, portraitCanvas) {
    this.els.dlg.style.display = 'flex';
    this.els.dlgName.textContent = name;
    this.els.dlgText.textContent = text;
    if (portraitCanvas) { this.els.dlgPortrait.innerHTML = ''; this.els.dlgPortrait.appendChild(portraitCanvas); }
    this.els.dlgOpts.innerHTML = '';
    for (const o of options) {
      const d = document.createElement('div');
      d.className = 'dlgopt' + (o.disabled ? ' disabled' : '');
      d.textContent = o.label;
      if (!o.disabled) d.addEventListener('pointerdown', () => o.fn());
      this.els.dlgOpts.appendChild(d);
    }
  },
  closeDialog() { this.els.dlg.style.display = 'none'; },
  dialogOpen() { return this.els.dlg.style.display === 'flex'; },

  belt(items) { // items: array up to 8 of {label} (null = empty)
    this.els.belt.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('div'); s.className = 'beltslot';
      const it = items[i];
      if (it) { s.classList.add('filled'); s.title = it.label;
        s.textContent = it.type === 'potion-health' ? '❤' : it.type.startsWith('potion') ? '⚗' : '◈'; }
      this.els.belt.appendChild(s);
    }
    this.els.belt.style.display = 'flex';
  },

  questlog(show, mains, flags) {
    this.els.qlog.style.display = show ? 'block' : 'none';
    if (!show) return;
    let h = '';
    for (const q of mains) {
      const st = flags['q-' + q.id];
      if (!st) continue;
      h += `<div class="qtitle">${q.title}${st === 'done' ? ' ✓' : ''}</div><div class="qtext">${q.text}</div><div class="qobj">▸ ${q.objective}</div>`;
    }
    this.els.qlogBody.innerHTML = h || '<div class="qtext">No entries yet. Champions make their own trouble.</div>';
  },

  guildBoard(show, quests, note) {
    this.els.board.style.display = show ? 'block' : 'none';
    if (!show) return;
    let h = note ? `<div class="qobj" style="margin-bottom:10px">${note}</div>` : '';
    for (const q of quests) {
      h += `<div class="qtitle" style="opacity:${q.locked ? .45 : 1}">${q.title} — ${q.reward}</div>
            <div class="qtext" style="opacity:${q.locked ? .45 : 1}">${q.text}<br><i>${q.region}${q.locked ? ' — the gates open soon.' : ''}</i></div>`;
    }
    this.els.boardBody.innerHTML = h;
  },
};

if (typeof window !== 'undefined') window.CityUI = CityUI;
