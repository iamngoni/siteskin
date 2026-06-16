# SiteSkin

A browser extension that delivers **full modern reskins** of unmaintained
websites as remotely-updatable packs. Built for old, un-modernised org sites
(its first target is [ZISPA](https://www.zispa.org.zw), Zimbabwe's `.co.zw`
registry).

The extension is a thin runtime; the reskins live in a **pack library** that is
fetched from a remote source and cached, so a skin can be updated without
shipping a new extension version.

## Architecture

```
Background service worker (bundled)
  ├─ resolve GitHub branch → commit SHA
  ├─ fetch pack index + assets from raw commit URL  → cache in chrome.storage
  │     (falls back to raw branch URL, then bundled packs/ when offline)
  └─ chrome.userScripts.register({ matches, css+js })   ← per host
        ↓
   user visits a matched host  →  pack runs in-page  →  full reskin
```

Why `chrome.userScripts`: under Manifest V3 it is the **sanctioned** way to run
code that isn't part of the extension bundle — which is exactly what lets
reskins be fetched and updated remotely while staying Chrome Web Store eligible.
The one cost is a one-time user opt-in (see Install).

| Piece | Role |
|-------|------|
| `manifest.json` | MV3 config: `userScripts` + background worker + popup. |
| `src/config.js` | Remote pack source URL, cache/refresh settings. |
| `src/background.js` | Fetch → cache → register packs; status + manual refresh. |
| `src/popup/` | Status: user-scripts enabled? packs loaded? skin active here? |
| `packs/index.json` | The pack library manifest (host → pack mapping). |
| `packs/<host>/` | A pack: `styles.css`, `script.js`, `pack.json`. |

The runtime resolves `master` through the GitHub commits API before fetching
pack files. That avoids the short-lived `raw.githubusercontent.com/master/...`
edge-cache lag where a just-pushed branch can still serve the previous pack.

## Install (development)

1. Open `chrome://extensions`, enable **Developer mode**.
2. **Load unpacked** → select this folder.
3. Open **SiteSkin → Details** and turn on **Allow user scripts**.
   *(This is the one-time opt-in the `userScripts` API requires. The popup will
   prompt you until it's on.)*
4. Visit `https://www.zispa.org.zw` — it renders the modern reskin.

## How a reskin works

A pack's `script.js` runs at `document_start` in the userScripts world. It
builds a complete modern page inside `#siteskin-root`; the pack's `styles.css`
hides the original DOM (`body > *:not(#siteskin-root)`), so the page is
**replaced**, not themed. Page content is baked into the pack (these sites are
static), which is the most robust source.

## Add a new skin

1. Create `packs/example.com/` with `styles.css`, `script.js`, `pack.json`.
2. Add an entry to `packs/index.json`:
   ```json
   {
     "name": "Example Modern",
     "dir": "example.com",
     "match": ["example.com", "www.example.com"],
     "paths": ["/", "/downloads*", "/help*"],
     "version": "1.0.0",
     "css": "styles.css",
     "js": "script.js"
   }
   ```
3. Push to the remote source (or reload the unpacked extension to use the
   bundled copy). The popup's **Refresh packs** re-pulls immediately.

`match` is a host list. `paths` is optional and defaults to `["/*"]`; use it
when a pack should support specific sections rather than only one main page.
Advanced packs can also provide Chrome match patterns directly via `matches`.

> Hosts must also be covered by `host_permissions` in `manifest.json`. Adding a
> brand-new host currently needs a manifest bump; broadening to optional host
> permissions (to add hosts purely remotely) is a deliberate next step.

## Known TODOs

- Confirm whether ZISPA wants real section URLs or the current in-page anchors
  for Home, Domains, Members, ZINX, and AGM.
- Per-pack enable/disable toggles in the popup.
- Optional host permissions so new hosts don't require an extension update.
