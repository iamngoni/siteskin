/*
 * ZISPA Modern — SiteSkin pack behavior.
 *
 * Runs in the PAGE world (injected as a <script src> by src/loader.js), so it
 * can read and modify the page's own DOM directly. Keep behavior idempotent:
 * a pack may be re-run on SPA navigations or fast reloads.
 */
(() => {
  "use strict";

  const MARK = "data-siteskin-enhanced";
  if (document.documentElement.hasAttribute(MARK)) return;
  document.documentElement.setAttribute(MARK, "zispa.org.zw");

  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    // Example enhancement: make external links open safely in a new tab.
    document.querySelectorAll('a[href^="http"]').forEach((a) => {
      if (a.hostname && a.hostname !== location.hostname) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    });

    // Example enhancement: ensure the page declares a responsive viewport so
    // the modern CSS behaves on mobile (older sites often omit this).
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1";
      document.head && document.head.appendChild(meta);
    }

    console.info("[SiteSkin] ZISPA Modern applied.");
  });
})();
