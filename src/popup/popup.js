/**
 * SiteSkin popup.
 *
 * Asks the active tab's loader for its status and renders whether a pack is
 * applied to the current host.
 */
(async () => {
  const statusEl = document.getElementById("status");
  const statusLine = document.getElementById("status-line");
  const hostLine = document.getElementById("host-line");

  const render = ({ active, name, host }) => {
    statusEl.classList.remove("loading");
    statusEl.classList.toggle("active", Boolean(active));
    if (active) {
      statusLine.textContent = `Skin active: ${name}`;
      hostLine.textContent = host;
    } else {
      statusLine.textContent = "No skin for this site";
      hostLine.textContent = host || "";
    }
  };

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    if (!tab || !tab.id) throw new Error("no tab");

    const res = await chrome.tabs.sendMessage(tab.id, {
      type: "SITESKIN_STATUS"
    });
    render(res || { active: false, host: hostOf(tab.url) });
  } catch (_e) {
    // Loader not present on this page (e.g. chrome:// pages, or page not yet
    // loaded). Treat as no skin.
    const [tab] = await chrome.tabs
      .query({ active: true, currentWindow: true })
      .catch(() => [null]);
    render({ active: false, host: tab ? hostOf(tab.url) : "" });
  }

  function hostOf(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  }
})();
