/**
 * SiteSkin configuration.
 *
 * Packs are fetched from `remoteBase` (so reskins can be updated without
 * shipping a new extension version) and cached. If the remote source is
 * unreachable, the engine falls back to the packs bundled under `bundledBase`
 * inside the extension — so a fresh install works offline and the very first
 * paint never depends on the network.
 */
export const CONFIG = {
  // Remote pack library. Points at this repo's raw content by default; swap for
  // a CDN / your own host later. Whatever lives here must mirror the layout of
  // the bundled `packs/` directory (an index.json plus one folder per pack).
  remoteBase:
    "https://raw.githubusercontent.com/iamngoni/siteskin/master/packs",

  // Bundled fallback, resolved relative to the extension root at runtime.
  bundledBase: "packs",

  // How often the background worker re-pulls the pack library.
  refreshIntervalMinutes: 60,
};
