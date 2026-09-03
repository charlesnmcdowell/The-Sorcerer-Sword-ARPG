// Shared UI plumbing for town panels and modals. One implementation of the
// patterns that were previously copy-pasted per panel:
//  - keepBtn: register every part of a composite button for panel cleanup
//    (a button not registered leaves an invisible, still-clickable zone
//    behind when the panel switches — that class of leak lives here now).
//  - header: standard panel title + subtitle.
//  - modalBtn / modalText: depth-raise + register modal widgets in one call.
(function () {
'use strict';
globalThis.ADV = globalThis.ADV || {};
const T = () => ADV.T;

const UI = {
  keepBtn(scene, b) {
    scene.keep(b.g); scene.keep(b.txt);
    if (b.sub) scene.keep(b.sub);
    scene.keep(b.zone);
    return b;
  },

  header(scene, r, title, sub, opts) {
    opts = opts || {};
    const reserve = opts.reserveRight || 0;
    scene.keep(T().text(scene, r.x + 24, r.y + 18, title, { size: 24, display: true, color: T().css.gold }));
    if (sub) scene.keep(T().text(scene, r.x + 24, r.y + 50, sub, { size: 13, color: T().css.inkDim, wrap: r.w - 48 - reserve }));
  },

  // For Notices.custom-style modals: raise a button above the dim layer and
  // register all its parts with the modal's keep().
  modalBtn(keep, D, b) {
    b.g.setDepth(D); b.txt.setDepth(D + 1);
    if (b.sub) b.sub.setDepth(D + 1);
    b.zone.setDepth(D + 2);
    keep(b.g); keep(b.txt); if (b.sub) keep(b.sub); keep(b.zone);
    return b;
  },

  modalText(keep, D, t) {
    t.setDepth(D);
    return keep(t);
  },
};

ADV.UI = UI;
})();
