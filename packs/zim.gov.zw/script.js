/*
 * Zimbabwe Government Services.
 *
 * The live portal often serves a sparse AMP/plain-link page. This pack turns
 * those public categories into a service directory while preserving links.
 */
(() => {
  "use strict";

  const ROOT_ID = "siteskin-root";
  const origin = "https://www.zim.gov.zw";

  const categories = [
    ["Births, Marriages & Deaths", "Registering births, deaths, marriages, IDs and related civil records.", "births-marriages-deaths"],
    ["Immigration & Visas", "Citizenship, permits, short-term visas and migration information.", "immigration-visas"],
    ["Finance & Taxation", "Treasury, public finance management, taxation and fiscal guidance.", "finance-taxation"],
    ["Investments - Local & FDI", "How to start and run a business in Zimbabwe, guidelines and more.", "investments-local-fdi"],
    ["Health & Child Care", "Public health, hospitals, child care and health-sector services.", "health-child-care"],
    ["Agriculture & Rural Development", "Agriculture, land, rural development and food systems.", "agriculture-rural-development"],
    ["Trade Promotion & Exports", "Trade development, export guidance and market access.", "trade-promotion-exports"],
    ["People, Culture & Arts", "Culture, national heritage, arts and community information.", "people-culture-arts"],
    ["ICT, E-Government & Innovations", "Digital government, online services and innovation programmes.", "ict-e-government-innovations"],
    ["Local & Community Development", "Local authorities, community development and decentralised services.", "local-community-development"]
  ];

  const mostRequested = [
    ["National ID registration", "Births, Marriages & Deaths", "/"],
    ["Passport application guidance", "Immigration & Visas", "/"],
    ["Company registration", "Investments - Local & FDI", "/"],
    ["Tax clearance", "Finance & Taxation", "https://www.zimra.co.zw/"],
    ["Visa requirements", "Immigration & Visas", "/"],
    ["Public notices", "Announcements", "/"]
  ];

  const announcements = [
    ["Vision 2030", "Prosperous and empowered upper-middle income society", "/"],
    ["Announcements E-Services", "Government service announcements and e-service links", "/"],
    ["Zimbabwe Destination Video 2025", "Tourism Zimbabwe public video", "/"],
    ["Ministry service updates", "Latest public service updates", "/"]
  ];

  const nav = [
    ["Services", "#services"],
    ["Ministries", "#ministries"],
    ["E-Services", "#eservices"],
    ["Announcements", "#announcements"],
    ["Vision 2030", "#vision-2030"],
    ["News", "#news"]
  ];

  function slugFromPath() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[0] || "";
  }

  function routeTitle() {
    const slug = slugFromPath();
    const match = categories.find(([, , catSlug]) => catSlug === slug);
    return match?.[0] || "Government services";
  }

  function icon(name) {
    const icons = {
      menu: "M4 6h16M4 12h16M4 18h16",
      search: "M10.5 18a7.5 7.5 0 1 1 5.3-12.8 7.5 7.5 0 0 1-5.3 12.8Zm5.5-2 4 4",
      service: "M4 6h16v12H4V6Zm4 4h8M8 14h5",
      person: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0",
      globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-8 9h16M12 3c2.5 2.4 3.7 5.4 3.7 9S14.5 18.6 12 21M12 3C9.5 5.4 8.3 8.4 8.3 12S9.5 18.6 12 21",
      document: "M7 3h7l4 4v14H7V3Zm7 0v5h5M10 12h6M10 16h6",
      leaf: "M5 19c8 0 13-5 14-14-8 1-14 6-14 14Zm0 0c0-5 3-8 8-10",
      heart: "M12 21s-7-4.4-8.5-9.1C2.3 8.2 4.6 5 8 5c1.8 0 3.1 1 4 2.2C12.9 6 14.2 5 16 5c3.4 0 5.7 3.2 4.5 6.9C19 16.6 12 21 12 21Z",
      briefcase: "M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m-11 0h16v13H4V6Zm0 5h16",
      megaphone: "M4 14h3l9 4V6L7 10H4v4Zm3 0 2 5",
      culture: "M12 3 3 8l9 5 9-5-9-5Zm-6 8v5c2 3 10 3 12 0v-5",
      computer: "M4 5h16v11H4V5Zm5 15h6M12 16v4",
      home: "M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z"
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name] || icons.service}"/></svg>`;
  }

  function categoryIcon(label) {
    if (/birth|marriage|death/i.test(label)) return "person";
    if (/immigration|visa/i.test(label)) return "globe";
    if (/finance|tax/i.test(label)) return "document";
    if (/investment/i.test(label)) return "briefcase";
    if (/health/i.test(label)) return "heart";
    if (/agriculture/i.test(label)) return "leaf";
    if (/trade/i.test(label)) return "megaphone";
    if (/culture/i.test(label)) return "culture";
    if (/ict|innovation/i.test(label)) return "computer";
    return "home";
  }

  function hrefFor(slug) {
    return `${origin}/${slug}`;
  }

  function drawer() {
    return `<aside class="ss-drawer" aria-label="All services">
      <div class="ss-drawer-title">
        ${icon("menu")}
        <span>All services</span>
      </div>
      ${categories.map(([label, , slug]) => `<a href="${hrefFor(slug)}">${label}</a>`).join("")}
    </aside>`;
  }

  function categoryGrid() {
    return `<section id="services" class="ss-category-grid">
      ${categories.map(([label, body, slug]) => `
        <a class="ss-category" data-row href="${hrefFor(slug)}">
          ${icon(categoryIcon(label))}
          <span><strong>${label}</strong><small>${body}</small></span>
        </a>`).join("")}
    </section>`;
  }

  function mostRequestedPanel() {
    return `<aside class="ss-panel">
      <div class="ss-panel-head">
        <span>Most requested</span>
        <strong>Common services</strong>
      </div>
      ${mostRequested.map(([label, meta, href]) => `
        <a data-row href="${href.startsWith("http") ? href : origin + href}">
          <span>${label}</span>
          <small>${meta}</small>
        </a>`).join("")}
    </aside>`;
  }

  function announcementsPanel() {
    return `<section id="announcements" class="ss-announcements">
      <div>
        <span class="ss-eyebrow">Announcements and E-Services</span>
        <h2>Latest public updates</h2>
      </div>
      <div class="ss-feed">
        ${announcements.map(([title, body, href]) => `
          <a data-row href="${origin + href}">
            <time>2026</time>
            <span><strong>${title}</strong><small>${body}</small></span>
          </a>`).join("")}
      </div>
      <div class="ss-video">
        <span>Featured video</span>
        <strong>Zimbabwe Destination Video 2025</strong>
      </div>
    </section>`;
  }

  function serviceDetail() {
    const title = routeTitle();
    const match = categories.find(([label]) => label === title);
    if (!match) return "";
    return `<section class="ss-detail">
      <span class="ss-eyebrow">Service category</span>
      <h1>${match[0]}</h1>
      <p>${match[1]}</p>
      <div class="ss-detail-actions">
        <a href="${origin}/">View official category</a>
        <a href="#announcements">Related announcements</a>
      </div>
    </section>`;
  }

  function shell() {
    const detail = serviceDetail();
    return `<div class="ss-gov">
      <header class="ss-topbar">
        <a class="ss-brand" href="${origin}/?format=amp">
          <span class="ss-mark">ZW</span>
          <span><strong>Zimbabwe Government Portal</strong><small>One-stop centre for government services</small></span>
        </a>
        <nav>${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>
        <div class="ss-actions">
          <button type="button">EN</button>
          <button type="button" aria-label="Accessibility">Aa</button>
          <a href="${origin}/">Help</a>
        </div>
      </header>
      <main class="ss-layout">
        ${drawer()}
        <div class="ss-content">
          ${detail || `<section class="ss-hero">
            <span class="ss-eyebrow">Government services directory</span>
            <h1>What government service do you need?</h1>
            <p>Search services, ministries, forms and public guidance from one cleaner surface.</p>
            <label class="ss-search">
              ${icon("search")}
              <input data-filter type="search" placeholder="Search services, ministries, forms" />
            </label>
          </section>`}
          ${categoryGrid()}
          ${announcementsPanel()}
        </div>
        ${mostRequestedPanel()}
      </main>
      <footer class="ss-footer">
        <span>SiteSkin view. Official government links are preserved.</span>
        <a href="${origin}${location.pathname}${location.search}">Open original path</a>
      </footer>
    </div>`;
  }

  function attachSearch(root) {
    root.querySelectorAll("[data-filter]").forEach((input) => {
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        root.querySelectorAll("[data-row]").forEach((row) => {
          row.hidden = q && !row.textContent.toLowerCase().includes(q);
        });
      });
    });
  }

  function mount() {
    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      (document.body || document.documentElement).prepend(root);
    }
    root.innerHTML = shell();
    attachSearch(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
