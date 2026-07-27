/* ==========================================================================
   icons.js — Shared line-icon library (POS app)
   Style: outline / line icons, stroke-based, rounded caps, 24×24 grid
   Usage:
     1) Include this file:  <script src="icons.js"></script>
     2) Inline in HTML:     <span data-icon="trash"></span>
     3) Or from JS:         el.innerHTML = ssmIcon("trash", { size: 20 });
     4) After adding new elements dynamically, call: ssmInjectIcons();
   ========================================================================== */

(function (global) {
  "use strict";

  // Each icon is the INNER svg markup only (no outer <svg> tag).
  // Stroke color defaults to currentColor so icons inherit text color via CSS.
  var ICONS = {
    // ── add / remove ──────────────────────────────────────────
    "add": '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
    "remove": '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M8 12h8"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "minus": '<path d="M5 12h14"/>',
    "plus-circle": '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    "minus-circle": '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
    "plus-tag": '<path d="M3 12l4-8h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7z"/><path d="M12 8v8M8 12h8"/>',

    // ── delete / trash variants ──────────────────────────────
    "trash": '<path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/>',
    "trash-list": '<path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M9 11h6"/>',
    "trash-x": '<path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M10 11l4 4m0-4l-4 4"/>',
    "trash-dot": '<path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l.4-5.2"/><circle cx="18" cy="16" r="2.4"/>',
    "trash-restore": '<path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l.35-4.6"/><path d="M20 9a4 4 0 1 1-1.2-2.85M20 6v3h-3"/>',
    "trash-up": '<path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M12 11v5M9.5 13.5L12 11l2.5 2.5"/>',

    // ── close / cancel / block ───────────────────────────────
    "close": '<path d="M6 6l12 12M18 6L6 18"/>',
    "close-thick": '<path d="M5 5l14 14M19 5L5 19" stroke-width="2.6"/>',
    "close-circle": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5l5 5m0-5l-5 5"/>',
    "close-tag": '<path d="M3 12l4-8h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7z"/><path d="M9.5 9.5l5 5m0-5l-5 5"/>',
    "block": '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',

    // ── undo / redo / restore (dashed = pending states) ──────
    "undo": '<path d="M9 8L5 12l4 4"/><path d="M5 12h9a5 5 0 0 1 0 10h-1"/>',
    "redo": '<path d="M15 8l4 4-4 4"/><path d="M19 12h-9a5 5 0 0 0 0 10h1"/>',
    "restore-dashed": '<circle cx="12" cy="12" r="9" stroke-dasharray="2.5 3"/><path d="M9.5 9.5l5 5m0-5l-5 5"/>',
    "add-dashed": '<circle cx="12" cy="12" r="9" stroke-dasharray="2.5 3"/><path d="M12 8v8M8 12h8"/>',
    "remove-dashed": '<circle cx="12" cy="12" r="9" stroke-dasharray="2.5 3"/><path d="M8 12h8"/>',

    // ── extras used elsewhere in the app ──────────────────────
    "check": '<path d="M5 12.5l4.5 4.5L19 7"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9"/>',
    "edit": '<path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"/><path d="M14 6l4 4"/>',
    "print": '<path d="M7 8V4h10v4M7 17h10v4H7z"/><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M7 12h.01"/>',
    "share": '<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.2 10.8l7.6-4.2M8.2 13.2l7.6 4.2"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    "x": '<path d="M6 6l12 12M18 6L6 18"/>'
  };

  var DEFAULTS = { size: 20, strokeWidth: 1.8, className: "ssm-icon" };

  /**
   * Build an inline <svg> string for the given icon name.
   * @param {string} name  key from ICONS
   * @param {object} [opts]  { size, strokeWidth, className }
   * @returns {string} svg markup, or "" if the icon name is unknown
   */
  function ssmIcon(name, opts) {
    var body = ICONS[name];
    if (!body) {
      console.warn('[icons.js] Unknown icon: "' + name + '"');
      return "";
    }
    opts = opts || {};
    var size = opts.size || DEFAULTS.size;
    var sw = opts.strokeWidth || DEFAULTS.strokeWidth;
    var cls = opts.className || DEFAULTS.className;
    return (
      '<svg class="' + cls + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true">' + body + "</svg>"
    );
  }

  /**
   * Scan the DOM (or a given root) for elements with a data-icon attribute
   * and inject the matching SVG into them. Safe to call repeatedly, e.g.
   * after rendering new receipt cards.
   * Optional attributes on the element: data-icon-size, data-icon-stroke.
   */
  function ssmInjectIcons(root) {
    root = root || document;
    var els = root.querySelectorAll("[data-icon]");
    els.forEach(function (el) {
      var name = el.getAttribute("data-icon");
      var size = el.getAttribute("data-icon-size");
      var sw = el.getAttribute("data-icon-stroke");
      el.innerHTML = ssmIcon(name, {
        size: size ? Number(size) : undefined,
        strokeWidth: sw ? Number(sw) : undefined
      });
      el.removeAttribute("data-icon");
    });
  }

  // expose globally, same pattern as ssmRenderReceipt in receipt.js
  global.ssmIcon = ssmIcon;
  global.ssmInjectIcons = ssmInjectIcons;
  global.SSM_ICONS = ICONS;

  document.addEventListener("DOMContentLoaded", function () {
    ssmInjectIcons();
  });
})(window);
