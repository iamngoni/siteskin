/**
 * SiteSkin popup.
 *
 * Reads status from the background worker and reports: whether user scripts are
 * enabled, how many packs are loaded and from where, and whether the current
 * tab's host has a matching pack. Offers a manual refresh.
 */
const $ = (id) => document.getElementById(id);

const hostOf = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

const locationOf = (url) => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const globToRegExp = (glob) =>
  new RegExp(`^${String(glob || "*").split("*").map(escapeRegExp).join(".*")}$`);

const chromeMatchMatchesUrl = (pattern, url) => {
  const location = locationOf(url);
  if (!location) return false;

  const match = String(pattern || "").match(/^(\*|https?|file):\/\/([^/]+)(\/.*)$/);
  if (!match) return false;

  const [, scheme, hostPattern, pathPattern] = match;
  const pageScheme = location.protocol.replace(":", "");
  if (scheme !== "*" && scheme !== pageScheme) return false;

  const host = location.hostname;
  const hostMatches =
    hostPattern === "*" ||
    hostPattern === host ||
    (hostPattern.startsWith("*.") &&
      (host === hostPattern.slice(2) || host.endsWith(hostPattern.slice(1))));

  return hostMatches && globToRegExp(pathPattern).test(location.pathname);
};

const ago = (ts) => {
  if (!ts) return "—";
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const sourceLabel = (status) => {
  if (!status.source) return "—";
  if (status.revision && status.source === "remote") {
    return `${status.source} ${status.revision.slice(0, 7)}`;
  }
  return status.source;
};

const userScriptsAccessIssue = (value) => {
  const text = String(value || "");
  return (
    /allow user scripts|developer mode/i.test(text) ||
    (/user.?scripts/i.test(text) && /not enabled|not available|enable/i.test(text))
  );
};

const needsUserScriptsEnable = (status = {}) =>
  status.userScriptsEnabled === false ||
  userScriptsAccessIssue(status.userScriptsError) ||
  userScriptsAccessIssue(status.error);

async function currentUrl() {
  const [tab] = await chrome.tabs
    .query({ active: true, currentWindow: true })
    .catch(() => [null]);
  return tab?.url || "";
}

async function matchedPack(url) {
  const host = hostOf(url);
  const lib = (await chrome.storage.local.get("library")).library;
  return (
    lib?.packs?.find((p) => {
      if (p.matches?.some((pattern) => chromeMatchMatchesUrl(pattern, url))) return true;
      return p.match?.includes(host);
    }) || null
  );
}

function render(status, host, pack) {
  $("loading").hidden = true;
  const enableCard = $("enable");
  const statusCard = $("status");

  if (needsUserScriptsEnable(status)) {
    enableCard.hidden = false;
    statusCard.hidden = true;
    return;
  }
  enableCard.hidden = true;
  statusCard.hidden = false;

  // Per-tab match
  const active = Boolean(pack);
  $("tab-dot").classList.toggle("active", active);
  $("tab-line").textContent = active
    ? `Skin active: ${pack.name}`
    : "No skin for this site";
  $("host-line").textContent = host || "";

  // Library meta
  $("pack-count").textContent = status.packCount ?? "—";
  $("source").textContent = sourceLabel(status);
  $("updated").textContent = ago(status.lastSync);

  const err = $("err");
  if (status.error) {
    err.hidden = false;
    err.textContent = status.error;
  } else {
    err.hidden = true;
  }
}

async function refreshView(status) {
  const url = await currentUrl();
  const host = hostOf(url);
  const pack = await matchedPack(url);
  render(status, host, pack);
}

function renderPopupError(error) {
  $("loading").hidden = true;
  if (userScriptsAccessIssue(error?.message || error)) {
    $("enable").hidden = false;
    $("status").hidden = true;
    return;
  }
  $("enable").hidden = true;
  $("status").hidden = false;
  $("tab-dot").classList.remove("active");
  $("tab-line").textContent = "SiteSkin status unavailable";
  $("host-line").textContent = "";
  $("pack-count").textContent = "—";
  $("source").textContent = "—";
  $("updated").textContent = "—";
  $("err").hidden = false;
  $("err").textContent = String(error?.message || error || "Unknown error");
}

(async () => {
  try {
    const status = await chrome.runtime.sendMessage({ type: "GET_STATUS" });
    await refreshView(status || {});
  } catch (error) {
    renderPopupError(error);
  }

  $("refresh").addEventListener("click", async () => {
    const btn = $("refresh");
    btn.disabled = true;
    btn.classList.add("syncing");
    btn.textContent = "Refreshing…";
    try {
      const updated = await chrome.runtime.sendMessage({ type: "SYNC" });
      await refreshView(updated || {});
    } catch (error) {
      renderPopupError(error);
    } finally {
      btn.disabled = false;
      btn.classList.remove("syncing");
      btn.textContent = "Refresh packs";
    }
  });
})();
