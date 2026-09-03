// Music + voice playback. HTML5 Audio elements (they work from file:// where
// XHR-based loaders don't). One music channel with per-context rotation that
// switches up often, one voice channel for dialogue lines.
(function () {
'use strict';
globalThis.ADV = globalThis.ADV || {};

// context -> track pool (audio/music/<name>.mp3). Single-track pools loop.
const POOLS = {
  // "Weight of the Quiet Man Edwyn theme 2" — the relaxing home-menu theme.
  title:    ['edwyn2'],
  town:     ['edwyn2'],
  creation: ['shop1', 'relax1'],
  quest:    ['forest1', 'forest2', 'night1', 'night2', 'fog1', 'origin1',
             'city1', 'city2', 'stars1', 'stars2', 'scabbard1', 'scabbard2',
             'gate1', 'inn1', 'inn2'],
  combat:   ['battle_clove', 'battle_ronin1', 'battle_ronin2', 'battle_fire1',
             'battle_fire2', 'battle_origin', 'battle_salute1', 'battle_salute2',
             'battle_riot1', 'battle_riot2'],
  boss:     ['boss1', 'boss2', 'gate2'],
  death:    ['edwyn1'],
};

const Music = {
  el: null, voiceEl: null,
  context: null, track: null,
  queues: {}, muted: false, unlocked: false,
  volume: 0.4,

  init() {
    try { Music.muted = localStorage.getItem('adv:muted') === '1'; } catch (e) {}
    // Autoplay unlock: retry current context on the first real gesture.
    const unlock = () => {
      Music.unlocked = true;
      if (Music.context) Music.start(Music.context, true);
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
  },

  nextTrack(context) {
    const pool = POOLS[context] || [];
    if (!pool.length) return null;
    if (pool.length === 1) return pool[0];
    let q = Music.queues[context];
    if (!q || !q.length) {
      q = pool.slice();
      for (let i = q.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [q[i], q[j]] = [q[j], q[i]];
      }
      // avoid immediate repeat across reshuffles
      if (q[0] === Music.track && q.length > 1) q.push(q.shift());
      Music.queues[context] = q;
    }
    return q.shift();
  },

  // One track per quest (request): the run picks a track when the quest
  // starts and keeps it through every encounter and fight; boss quests draw
  // from the boss pool. Town/death/creation end the run.
  RUN_CONTEXTS: ['quest', 'combat', 'boss'],
  run: null,                       // {track} while a quest is in progress

  startRun(isBoss) {
    const pool = isBoss ? POOLS.boss : POOLS.quest.concat(POOLS.combat);
    let name = pool[Math.floor(Math.random() * pool.length)];
    if (name === Music.lastRunTrack && pool.length > 1) name = pool[(pool.indexOf(name) + 1) % pool.length];
    Music.lastRunTrack = name;
    Music.run = { track: name };
    Music.context = 'quest';
    Music.startNamed(name, true);
  },
  endRun() { Music.run = null; },

  play(context) {
    if (Music.RUN_CONTEXTS.includes(context)) {
      if (Music.run) {                                   // mid-quest: keep the quest's track going
        Music.context = context;
        if (Music.el && Music.el.__name === Music.run.track && Music.el.paused) Music.el.play().catch(() => {});
        return;
      }
    } else Music.endRun();
    if (Music.context === context && Music.el && !Music.el.paused) return;
    // seamless carry-over when both contexts sit on the same single track
    if (Music.el && !Music.el.paused && Music.context && (POOLS[context] || []).length === 1 &&
        (POOLS[Music.context] || []).length === 1 && POOLS[context][0] === Music.track) {
      Music.context = context;
      return;
    }
    Music.context = context;
    Music.start(context, false);
  },

  // The home theme is one element for the whole session: it loops, and when
  // the player leaves town it pauses where it is and resumes there on return
  // (request: keep "Weight of the Quiet Man" playing on the home screen).
  HOME: ['title', 'town'],
  homeEl: null,

  start(context, force) {
    const name = Music.nextTrack(context);
    if (!name) return;
    if (Music.el) { try { Music.el.pause(); } catch (e) {} }
    const isHome = Music.HOME.includes(context);
    let el;
    if (isHome && Music.homeEl && Music.homeEl.__name === name) {
      el = Music.homeEl;                                   // resume where it left off
    } else {
      el = new Audio('audio/music/' + name + '.mp3');
      el.__name = name;
      const single = (POOLS[context] || []).length === 1;
      el.loop = single || isHome;
      // belt and braces: if a browser drops the loop attribute, restart by hand
      el.addEventListener('ended', () => {
        if (Music.el !== el) return;
        if (el.loop) { try { el.currentTime = 0; el.play().catch(() => {}); } catch (e) {} }
        else if (Music.context === context) Music.start(context, false);
      });
      if (isHome) Music.homeEl = el;
    }
    el.volume = Music.muted ? 0 : Music.volume;
    el.play().then(() => { Music.unlocked = true; }).catch(() => { /* pre-gesture: unlock handler retries */ });
    Music.el = el;
    Music.track = name;
  },

  // Play one named track, looping or not, replacing whatever is on.
  startNamed(name, loop) {
    if (Music.el) { try { Music.el.pause(); } catch (e) {} }
    const el = new Audio('audio/music/' + name + '.mp3');
    el.__name = name; el.loop = !!loop;
    el.volume = Music.muted ? 0 : Music.volume;
    el.play().then(() => { Music.unlocked = true; }).catch(() => {});
    Music.el = el; Music.track = name;
  },

  // Force a rotation step ("switch it up") without changing context.
  rotate() { if (Music.context) Music.start(Music.context, false); },

  toggleMute() {
    Music.muted = !Music.muted;
    try { localStorage.setItem('adv:muted', Music.muted ? '1' : '0'); } catch (e) {}
    if (Music.el) Music.el.volume = Music.muted ? 0 : Music.volume;
    if (Music.voiceEl) Music.voiceEl.volume = Music.muted ? 0 : 1;
    return Music.muted;
  },

  // ---- voice channel --------------------------------------------------------
  speakFile(personalityId, band, idx) {
    if (!personalityId) return;
    Music.stopVoice();
    const el = new Audio('audio/vo/' + personalityId + '/' + band + '_' + idx + '.mp3');
    el.volume = Music.muted ? 0 : 1;
    el.play().catch(() => {});
    Music.voiceEl = el;
  },
  // campaign lines are name-free clips keyed by character, beat and index (§8)
  speakCampaign(who, key, idx) {
    Music.stopVoice();
    const el = new Audio('audio/vo/campaign/' + who + '/' + key + '_' + idx + '.mp3');
    el.volume = Music.muted ? 0 : 1;
    el.play().catch(() => {});
    Music.voiceEl = el;
  },
  stopVoice() {
    if (Music.voiceEl) { try { Music.voiceEl.pause(); } catch (e) {} Music.voiceEl = null; }
  },

  // small speaker toggle for a scene corner
  button(scene, x, y) {
    const label = () => Music.muted ? '♪ off' : '♪ on';
    const t = ADV.T.text(scene, x, y, label(), { size: 12, ox: 1, color: ADV.T.css.inkDim })
      .setInteractive({ useHandCursor: true });
    t.on('pointerdown', () => { Music.toggleMute(); t.setText(label()); });
    return t;
  },
};

Music.init();
ADV.Music = Music;
})();
