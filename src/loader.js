/**
 * SiteSkin loader.
 *
 * Runs in the content-script (isolated) world at document_start on every page.
 * Looks up the current hostname in SITESKIN_REGISTRY (defined in
 * sites/registry.js, which runs just before this file in the same scope) and,
 * if a pack matches, injects its CSS and JS.
 *
 *   - CSS is added as a <link> so it participates in the page's cascade.
 *   - JS is added as a <script src> so the pack runs in the PAGE world with
 *     full access to the page's own DOM and globals.
 *
 * Injection state is exposed to the popup via a window-keyed flag and a
 * runtime message responder.
 */
(() => {
  "use strict";

  const host = location.hostname;
  const pack =
    typeof SITESKIN_REGISTRY !== "undefined" ? SITESKIN_REGISTRY[host] : null;

  // Always answer the popup, whether or not a pack is active.
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.type === "SITESKIN_STATUS") {
      sendResponse({
        host,
        active: Boolean(pack),
        name: pack ? pack.name : null
      });
    }
    return false;
  });

  if (!pack) return;

  const root = document.documentElement;

  // --- CSS ------------------------------------------------------------------
  if (pack.css) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL(pack.css);
    link.dataset.siteskin = pack.name;
    root.appendChild(link);
  }

  // --- JS -------------------------------------------------------------------
  if (pack.js) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(pack.js);
    script.dataset.siteskin = pack.name;
    // Clean up the tag once it has executed; the effects persist.
    script.onload = () => script.remove();
    root.appendChild(script);
  }

  // Mark the document so packs / debugging can detect SiteSkin is present.
  root.setAttribute("data-siteskin", pack.name);
})();
