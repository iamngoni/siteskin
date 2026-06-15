/**
 * SiteSkin background service worker.
 *
 * Responsibilities:
 *   1. Pull the pack library (index + each pack's CSS/JS) from the remote
 *      source, falling back to the bundled copy, and cache it in storage.
 *   2. Register each pack with chrome.userScripts so its CSS+JS run on the
 *      matching hosts. userScripts is the MV3-sanctioned way to execute code
 *      that isn't part of the extension bundle, which is what lets reskins be
 *      updated remotely.
 *   3. Expose status + manual refresh to the popup.
 *
 * userScripts is only reachable after the user enables the per-extension
 * "Allow user scripts" toggle, so every access is guarded.
 */
import { CONFIG } from "./config.js";

const ALARM = "siteskin-refresh";

// --- userScripts availability --------------------------------------------
// Accessing chrome.userScripts throws until the user grants the toggle.
function userScriptsApi() {
  try {
    return chrome.userScripts || null;
  } catch (_e) {
    return null;
  }
}

function errorText(error) {
  return String(error?.message || error || "Unknown error");
}

async function markUserScriptsUnavailable(error) {
  await setStatus({
    userScriptsEnabled: false,
    userScriptsError: error ? errorText(error) : "Allow user scripts is not enabled",
    error: null,
  });
}

async function verifyUserScriptsAccess(us) {
  try {
    await us.getScripts();
    return true;
  } catch (e) {
    await markUserScriptsUnavailable(e);
    return false;
  }
}

// --- status (read by the popup) ------------------------------------------
async function getStatus() {
  return (await chrome.storage.local.get("status")).status || {};
}
async function setStatus(patch) {
  const cur = await getStatus();
  await chrome.storage.local.set({ status: { ...cur, ...patch } });
}

// --- fetching -------------------------------------------------------------
async function fetchText(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}
async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function resolveGithubCommitBase() {
  const apiUrl = `https://api.github.com/repos/${CONFIG.remoteRepo}/commits/${CONFIG.remoteRef}`;
  const commit = await fetchJson(apiUrl);
  const sha = commit?.sha;
  if (!/^[a-f0-9]{40}$/i.test(sha || "")) {
    throw new Error(`Invalid GitHub commit response for ${CONFIG.remoteRef}`);
  }
  return {
    source: "remote",
    base: `https://raw.githubusercontent.com/${CONFIG.remoteRepo}/${sha}/${CONFIG.remotePath}`,
    revision: sha
  };
}

async function resolveRemoteIndex() {
  try {
    const resolved = await resolveGithubCommitBase();
    const index = await fetchJson(`${resolved.base}/index.json`);
    return { ...resolved, index };
  } catch (_e) {
    const index = await fetchJson(`${CONFIG.remoteBase}/index.json`);
    return { source: "remote", base: CONFIG.remoteBase, index };
  }
}

async function resolveBundledIndex() {
  const base = chrome.runtime.getURL(CONFIG.bundledBase);
  const index = await fetchJson(`${base}/index.json`);
  return { source: "bundled", base, index };
}

// Resolve the pack index from remote, falling back to the bundled copy.
async function resolveIndex() {
  try {
    return await resolveRemoteIndex();
  } catch (_e) {
    return resolveBundledIndex();
  }
}

// Load every pack's assets (CSS + JS text) from the resolved source.
async function loadPacks() {
  const { source, base, index, revision } = await resolveIndex();
  const packs = [];
  for (const p of index.packs || []) {
    try {
      const dir = `${base}/${p.dir}`;
      const cssText = p.css ? await fetchText(`${dir}/${p.css}`) : "";
      const jsText = p.js ? await fetchText(`${dir}/${p.js}`) : "";
      packs.push({
        name: p.name,
        dir: p.dir,
        match: p.match,
        version: p.version,
        cssText,
        jsText,
      });
    } catch (e) {
      console.warn("[SiteSkin] failed to load pack", p.dir, e);
    }
  }
  return { source, packs, revision };
}

// --- registration ---------------------------------------------------------
// Wrap a pack's CSS in a small injector so it ships as a userScript alongside
// the reskin JS (userScripts.register has no native CSS field).
function cssInjector(pack) {
  const styleId = `siteskin-style-${pack.dir}`;
  return (
    `(()=>{const id=${JSON.stringify(styleId)};` +
    `if(document.getElementById(id))return;` +
    `const s=document.createElement('style');s.id=id;` +
    `s.textContent=${JSON.stringify(pack.cssText)};` +
    `(document.head||document.documentElement).appendChild(s);})();`
  );
}

async function applyPacks(packs) {
  const us = userScriptsApi();
  if (!us) {
    await markUserScriptsUnavailable();
    return false;
  }

  if (!(await verifyUserScriptsAccess(us))) return false;

  try {
    await us.unregister(); // clear our previous registrations
  } catch (_e) {
    /* nothing registered yet */
  }
  if (!packs.length) {
    await setStatus({ userScriptsEnabled: true, userScriptsError: null, error: null });
    return true;
  }

  const regs = packs.map((p) => ({
    id: `siteskin-${p.dir}`,
    matches: p.match.map((h) => `*://${h}/*`),
    js: [{ code: cssInjector(p) }, { code: p.jsText }],
    world: "USER_SCRIPT",
    runAt: "document_start",
    allFrames: false,
  }));

  try {
    await us.register(regs);
    await setStatus({ userScriptsEnabled: true, userScriptsError: null, error: null });
    return true;
  } catch (e) {
    await setStatus({
      userScriptsEnabled: true,
      userScriptsError: null,
      error: errorText(e),
    });
    return false;
  }
}

// --- sync orchestration ---------------------------------------------------
async function syncPacks() {
  try {
    const { source, packs, revision } = await loadPacks();
    await chrome.storage.local.set({
      library: { source, packs, revision, lastSync: Date.now() },
    });
    await applyPacks(packs);
    await setStatus({
      source,
      revision,
      packCount: packs.length,
      lastSync: Date.now(),
    });
  } catch (e) {
    await setStatus({ error: errorText(e) });
  }
}

// Register instantly from cache (fast path / offline), then refresh from source.
async function init() {
  const cached = (await chrome.storage.local.get("library")).library;
  if (cached?.packs?.length) await applyPacks(cached.packs);
  await syncPacks();
}

// Self-heal: the "Allow user scripts" toggle is usually flipped AFTER install,
// at which point nothing has re-run registration. Calling this whenever the
// popup opens (or the worker wakes) registers cached packs as soon as the API
// becomes available — so the user doesn't have to manually refresh.
async function ensureRegistered() {
  const us = userScriptsApi();
  if (!us) {
    await markUserScriptsUnavailable();
    return;
  }
  const lib = (await chrome.storage.local.get("library")).library;
  if (lib?.packs?.length) {
    let existing = [];
    try {
      existing = await us.getScripts();
    } catch (e) {
      await markUserScriptsUnavailable(e);
      return;
    }
    if (!existing.length) await applyPacks(lib.packs);
    else await setStatus({ userScriptsEnabled: true, userScriptsError: null });
  } else {
    // No cache yet (e.g. toggle was off during the very first sync) — pull now.
    await syncPacks();
  }
}

// --- lifecycle ------------------------------------------------------------
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM, {
    periodInMinutes: CONFIG.refreshIntervalMinutes,
  });
  init();
});
chrome.runtime.onStartup.addListener(() => {
  init();
});
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === ALARM) syncPacks();
});

// Backstop: register cached packs whenever the worker spins up.
ensureRegistered();

// --- popup messaging ------------------------------------------------------
chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg?.type === "GET_STATUS") {
    ensureRegistered().then(getStatus).then(reply);
    return true;
  }
  if (msg?.type === "SYNC") {
    syncPacks().then(getStatus).then(reply);
    return true;
  }
  return false;
});
