/**
 * SiteSkin pack registry.
 *
 * Maps a hostname to the pack that should be applied. To add a new skin:
 *   1. Create a folder under /sites (e.g. sites/example.com/)
 *   2. Add styles.css, script.js, and pack.json to it
 *   3. Add one line here mapping the host to that folder
 *
 * `host` matching is exact on `location.hostname`. List every hostname a site
 * is served from (e.g. both "example.com" and "www.example.com").
 *
 * This file runs in the content-script world before src/loader.js and shares
 * scope with it, so SITESKIN_REGISTRY is visible to the loader.
 */
const SITESKIN_REGISTRY = {
  "www.zispa.org.zw": {
    name: "ZISPA Modern",
    dir: "sites/zispa.org.zw",
    css: "sites/zispa.org.zw/styles.css",
    js: "sites/zispa.org.zw/script.js"
  },
  "zispa.org.zw": {
    name: "ZISPA Modern",
    dir: "sites/zispa.org.zw",
    css: "sites/zispa.org.zw/styles.css",
    js: "sites/zispa.org.zw/script.js"
  }
};
