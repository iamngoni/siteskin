# SiteSkin

A browser extension that injects modern UI "skins" — bundles of CSS + JS — into
specific websites, on a per-host basis. Think of it as a library of **website
upgrade packs**: drop in a folder, register a hostname, and that site gets
reskinned every time you visit.

```
Extension core
  ↓ detect current hostname
  ↓ look up matching pack in the registry
  ↓ inject the pack's CSS (<link>) + JS (<script> in page world)
```

## How it works

| Piece | Role |
|-------|------|
| `manifest.json` | MV3 config. Registers the loader on all pages and exposes `sites/*` as web-accessible resources. |
| `sites/registry.js` | Maps `hostname → pack`. The one place you edit to enable a site. |
| `src/loader.js` | Content script. Reads `location.hostname`, finds a pack, injects its CSS + JS. Answers the popup's status query. |
| `sites/<host>/` | A self-contained pack: `styles.css`, `script.js`, `pack.json` (metadata). |
| `src/popup/` | Toolbar popup showing whether a skin is active on the current tab. |

CSS is injected as a `<link>` so it joins the page's cascade. JS is injected as
a `<script src>` so it runs in the **page world** with direct access to the
site's own DOM.

## Install (development)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Visit a registered site (e.g. `www.zispa.org.zw`). A small "SiteSkin" badge
   appears bottom-right when a skin is live; the toolbar popup confirms status.

## Add a new skin

1. Create a folder: `sites/example.com/`
2. Add `styles.css`, `script.js`, and `pack.json`:
   ```json
   {
     "name": "Example Modern",
     "host": "www.example.com",
     "version": "1.0.0",
     "description": "Modernized UI for example.com"
   }
   ```
3. Register the host(s) in `sites/registry.js`:
   ```js
   "www.example.com": {
     name: "Example Modern",
     dir: "sites/example.com",
     css: "sites/example.com/styles.css",
     js: "sites/example.com/script.js"
   }
   ```
4. Reload the extension. Done — no core changes needed.

## Notes & next steps

- **Matching is exact on `hostname`.** List every host a site uses (e.g. both
  `example.com` and `www.example.com`).
- **Idempotency:** pack `script.js` should be safe to re-run (the sample guards
  with a `data-siteskin-enhanced` marker) for SPA navigations.
- **Firefox:** MV3 is largely compatible; `web_accessible_resources` and the
  `<script src>` injection work, but test before shipping.
- Potential future work: a build step that auto-generates `registry.js` from
  `pack.json` files, per-pack enable/disable toggles in the popup, and
  user-authored packs stored in `chrome.storage`.
