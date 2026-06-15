/*
 * ZISPA Modern - full reskin.
 *
 * Runs in the userScripts USER_SCRIPT world at document_start. It builds a
 * complete modern page inside #siteskin-root; styles.css hides the original
 * DOM (`body > *:not(#siteskin-root)`), so this fully replaces the page rather
 * than theming it.
 */
(() => {
  "use strict";

  const ROOT_ID = "siteskin-root";
  const TLD = ".co.zw";
  let lookupController = null;
  let lookupSequence = 0;

  const CONTENT = {
    org: "Zimbabwe Internet Service Providers Association",
    acronym: "ZISPA",
    tagline:
      "The official registry for .co.zw domains and operator of ZINX, the Zimbabwe Internet Exchange.",
    nav: [
      { label: "Home", href: "#home" },
      { label: "Domains", href: "#domains" },
      { label: "Members", href: "#members" },
      { label: "ZINX", href: "#zinx" },
      { label: "AGM", href: "#agm" }
    ],
    quickLinks: [
      { label: "What is a domain name?", href: "#domain-guide", icon: "help" },
      { label: "Domain registration guide", href: "#domain-guide", icon: "book" },
      { label: "Policies & requirements", href: "#policies", icon: "shield" }
    ],
    actions: [
      {
        title: "Register a domain",
        body: "Search and register your .co.zw domain name.",
        cta: "Start registration",
        href: "#domain-guide",
        icon: "globe",
        tone: "green"
      },
      {
        title: "Find a registrar",
        body: "ZISPA registrars and members across Zimbabwe.",
        cta: "View members",
        href: "#members",
        icon: "users",
        tone: "gold"
      },
      {
        title: "Registry policies",
        body: "Review policies, requirements and dispute information.",
        cta: "View policies",
        href: "#policies",
        icon: "shield",
        tone: "red"
      },
      {
        title: "ZINX peering",
        body: "Information for ISPs about ZINX and peering.",
        cta: "About ZINX",
        href: "#zinx",
        icon: "network",
        tone: "green"
      }
    ],
    domainGuide: [
      "What is a domain name?",
      "Benefits of registering a domain name",
      "Choosing a domain name",
      "Domain name registration procedure",
      "Submission requirements for registrars"
    ],
    policies: [
      "Processing of applications",
      "ZISPA registration policies",
      "Registration fees",
      "Domain name disputes",
      "Whois service"
    ],
    ispMembers: [
      { name: "Econet Wireless", href: "http://www.econet.co.zw" },
      { name: "Liquid Telecom", href: "http://zimbabwe.liquidtelecom.com" },
      { name: "Telecel", href: "http://www.telecel.co.zw" },
      { name: "Telco", href: "http://www.telco.co.zw/newtelco" },
      { name: "Powertel", href: "http://powertel.co.zw" }
    ],
    serviceMembers: [
      { name: "Wehost", href: "https://wehost.co.zw" },
      { name: "Webzim", href: "https://webzim.co.zw" },
      { name: "Innovate Hosting", href: "https://innovatehosting.co.zw" },
      { name: "Ehost", href: "https://ehost.co.zw" }
    ],
    contact: {
      admin: "admin@zispa.org.zw",
      whatsapp: "+263 772 782208",
      registry: "registry-accounts@mango.zw",
      tel: "+263 08677 190909"
    }
  };

  const esc = (value) =>
    String(value).replace(
      /[&<>"]/g,
      (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char])
    );

  const iconPaths = {
    book:
      '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5z"/><path d="M5 5.5v16"/><path d="M8 7h8"/><path d="M8 11h7"/>',
    check:
      '<path d="m5 12 4.2 4.2L19 6.5"/>',
    chevron:
      '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    clipboard:
      '<path d="M9 4h6l1 2h3v15H5V6h3z"/><path d="M9 4h6v4H9z"/><path d="M8 12h8"/><path d="M8 16h5"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21"/><path d="M12 3C9.6 5.5 8.4 8.5 8.4 12s1.2 6.5 3.6 9"/>',
    help:
      '<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.6 2.6 0 0 1 4.9 1.2c0 1.8-2.6 2.1-2.6 4"/><path d="M12 17.5h.01"/>',
    mail:
      '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
    mapPin:
      '<path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z"/><circle cx="12" cy="10" r="2"/>',
    network:
      '<circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m10.8 7.2-3.6 8.6"/><path d="m13.2 7.2 3.6 8.6"/><path d="M8.5 18h7"/>',
    phone:
      '<path d="M6.6 3.5 9 8.6 6.8 10a13.5 13.5 0 0 0 7.2 7.2l1.4-2.2 5.1 2.4c.3.1.5.5.4.8-.5 2-2.2 3.3-4.2 3.3C8.9 21.5 2.5 15.1 2.5 7.3c0-2 1.3-3.7 3.3-4.2.3-.1.7.1.8.4z"/>',
    shield:
      '<path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    users:
      '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M14.5 20a4.2 4.2 0 0 1 6-3.8"/>'
  };

  function icon(name) {
    return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name] || iconPaths.check}</svg>`;
  }

  function nav() {
    return CONTENT.nav
      .map((item, index) => {
        const active = index === 0 ? ' aria-current="page"' : "";
        return `<li><a href="${esc(item.href)}"${active}>${esc(item.label)}</a></li>`;
      })
      .join("");
  }

  function quickLinks() {
    return CONTENT.quickLinks
      .map(
        (item) => `
          <a href="${esc(item.href)}">
            ${icon(item.icon)}
            <span>${esc(item.label)}</span>
          </a>
        `
      )
      .join("");
  }

  function actionPanels() {
    return CONTENT.actions
      .map(
        (item) => `
          <article class="ss-action-card ss-tone-${esc(item.tone)}">
            <div class="ss-action-icon">${icon(item.icon)}</div>
            <div>
              <h2>${esc(item.title)}</h2>
              <p>${esc(item.body)}</p>
              <a href="${esc(item.href)}">
                <span>${esc(item.cta)}</span>
                ${icon("chevron")}
              </a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function memberLinks(items) {
    return items
      .map(
        (item) =>
          `<a class="ss-member-pill" href="${esc(item.href)}" target="_blank" rel="noreferrer">${esc(item.name)}</a>`
      )
      .join("");
  }

  function textList(items) {
    return items.map((item) => `<li>${icon("check")}<span>${esc(item)}</span></li>`).join("");
  }

  function mapGraphic() {
    return `
      <svg class="ss-map" viewBox="0 0 520 360" role="img" aria-label="Network map of Zimbabwe">
        <path class="ss-map-outline" d="M86 148 126 111l61-4 42-45 70 18 62-12 50 41 54 8 24 53-27 48 12 56-57 26-41 34-80-5-48 25-57-36-72 6-29-50-57-16 31-62z"/>
        <g class="ss-map-lines">
          <path d="M126 175 194 142 246 185 306 118 386 154 425 225 350 270 286 225 202 256 126 175z"/>
          <path d="M194 142 202 256 286 225 306 118 350 270 425 225"/>
          <path d="M246 185 386 154 286 225 126 175"/>
        </g>
        <g class="ss-map-nodes">
          <circle cx="126" cy="175" r="7"/>
          <circle cx="194" cy="142" r="7"/>
          <circle cx="246" cy="185" r="7"/>
          <circle cx="306" cy="118" r="7"/>
          <circle cx="386" cy="154" r="7"/>
          <circle cx="425" cy="225" r="7"/>
          <circle cx="350" cy="270" r="7"/>
          <circle cx="286" cy="225" r="9"/>
          <circle cx="202" cy="256" r="7"/>
        </g>
        <g class="ss-map-dots">
          <circle cx="414" cy="86" r="3"/>
          <circle cx="446" cy="96" r="3"/>
          <circle cx="468" cy="132" r="3"/>
          <circle cx="476" cy="182" r="3"/>
        </g>
      </svg>
    `;
  }

  function markup() {
    const c = CONTENT;

    return `
      <header class="ss-shell" id="home">
        <nav class="ss-nav" aria-label="Primary navigation">
          <a class="ss-brand" href="#home" aria-label="ZISPA home">
            <span class="ss-logo" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </span>
            <span class="ss-brand-text">
              <strong>${esc(c.acronym)}</strong>
              <small>Zimbabwe Internet<br>Service Providers Association</small>
            </span>
          </a>
          <ul>${nav()}</ul>
          <a class="ss-contact-link" href="mailto:${esc(c.contact.admin)}">
            ${icon("mail")}
            <span>Contact us</span>
          </a>
        </nav>

        <section class="ss-hero">
          <div class="ss-hero-content">
            <h1>${esc(c.org)}</h1>
            <p>${esc(c.tagline)}</p>
            <form class="ss-search" id="ss-domain-form" autocomplete="off">
              <label class="ss-search-field" for="ss-domain">
                ${icon("globe")}
                <input type="text" id="ss-domain" placeholder="Search your .co.zw domain" aria-label="Domain name" inputmode="url" />
              </label>
              <span class="ss-tld">${esc(TLD)}</span>
              <button type="submit" id="ss-domain-submit">
                <span class="ss-button-label">Check availability</span>
                <span class="ss-button-loader" aria-hidden="true"></span>
              </button>
            </form>
            <p class="ss-search-result" id="ss-result" aria-live="polite" hidden></p>
            <div class="ss-quick-links" aria-label="Domain guidance">
              ${quickLinks()}
            </div>
          </div>
          <aside class="ss-network" aria-label="Zimbabwe network overview">
            ${mapGraphic()}
            <ul class="ss-legend">
              <li><span class="ss-red"></span>Local ISPs</li>
              <li><span class="ss-green"></span>ZINX Nodes</li>
              <li><span class="ss-gold"></span>National Connectivity</li>
            </ul>
          </aside>
        </section>
      </header>

      <main class="ss-main">
        <section class="ss-actions" id="domains" aria-label="Key actions">
          ${actionPanels()}
        </section>

        <section class="ss-info-band" id="members">
          <div class="ss-member-section">
            <h2>ZISPA Members</h2>
            <div class="ss-member-grid">
              <article>
                <h3>Internet Service Providers</h3>
                <div class="ss-member-row">${memberLinks(c.ispMembers)}</div>
                <a class="ss-text-link" href="#members">View all ISP members ${icon("chevron")}</a>
              </article>
              <article>
                <h3>IT Consulting, Web & Hosting</h3>
                <div class="ss-member-row">${memberLinks(c.serviceMembers)}</div>
                <a class="ss-text-link" href="#members">View all service members ${icon("chevron")}</a>
              </article>
            </div>
          </div>

          <aside class="ss-contact-card">
            <div>
              <h2>Contact ZISPA</h2>
              <ul>
                <li>${icon("mail")}<a href="mailto:${esc(c.contact.admin)}">${esc(c.contact.admin)}</a></li>
                <li>${icon("phone")}<span>WhatsApp: ${esc(c.contact.whatsapp)}</span></li>
                <li>${icon("phone")}<span>Tel: ${esc(c.contact.tel)}</span></li>
                <li>${icon("clipboard")}<a href="mailto:${esc(c.contact.registry)}">${esc(c.contact.registry)}</a></li>
              </ul>
            </div>
            <div class="ss-trust" id="policies">
              ${icon("shield")}
              <strong>Trusted registry</strong>
              <p>Managed in accordance with ZISPA policies and POTRAZ regulations.</p>
              <a class="ss-text-link" href="#domain-guide">Learn more ${icon("chevron")}</a>
            </div>
          </aside>
        </section>

        <section class="ss-detail-band" id="domain-guide">
          <article>
            <h2>Domain registration guidance</h2>
            <p>CO.ZW domain names may be registered through a ZISPA member, including local ISPs and web-related organisations.</p>
            <ul>${textList(c.domainGuide)}</ul>
          </article>
          <article id="zinx">
            <h2>About ZINX</h2>
            <p>ZISPA operates the Zimbabwe Internet Exchange, enabling local Internet Service Providers to exchange traffic directly.</p>
            <ul>${textList(c.policies)}</ul>
          </article>
        </section>
      </main>

      <footer class="ss-footer" id="agm">
        <span>Copyright ZISPA 2016-${new Date().getFullYear()}</span>
        <nav aria-label="Footer navigation">
          <a href="#domain-guide">Terms & Conditions</a>
          <a href="#policies">Privacy Policy</a>
          <a href="#home">Sitemap</a>
        </nav>
        <span class="ss-zim">Proudly serving the Zimbabwe Internet community.</span>
      </footer>
    `;
  }

  function sanitizeLookupResponse(html) {
    const allowed = new Set(["B", "BR", "PRE", "STRONG"]);
    const template = document.createElement("template");
    template.innerHTML = html;

    function clean(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.textContent || "");
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return document.createTextNode("");
      }

      const children = Array.from(node.childNodes).map(clean);
      if (!allowed.has(node.tagName)) {
        const fragment = document.createDocumentFragment();
        children.forEach((child) => fragment.appendChild(child));
        return fragment;
      }

      const element = document.createElement(node.tagName.toLowerCase());
      children.forEach((child) => element.appendChild(child));
      return element;
    }

    const fragment = document.createDocumentFragment();
    Array.from(template.content.childNodes).forEach((node) => {
      fragment.appendChild(clean(node));
    });
    const wrapper = document.createElement("div");
    wrapper.appendChild(fragment);
    return wrapper.innerHTML;
  }

  function setSearchResult(message, state, options = {}) {
    const result = document.getElementById("ss-result");
    if (!result) return;
    result.hidden = !message;
    result.className = `ss-search-result${state ? ` is-${state}` : ""}`;
    if (options.html) {
      result.innerHTML = message || "";
    } else {
      result.textContent = message || "";
    }
  }

  function setLookupLoading(loading) {
    const form = document.getElementById("ss-domain-form");
    const button = document.getElementById("ss-domain-submit");
    const input = document.getElementById("ss-domain");
    form?.classList.toggle("is-loading", loading);
    form?.setAttribute("aria-busy", String(loading));
    if (button) button.disabled = loading;
    if (input) input.readOnly = loading;
  }

  function cleanDomain(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\.co\.zw$/i, "")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function checkDomain(value) {
    const clean = cleanDomain(value);
    if (!clean) {
      setSearchResult("", "");
      return;
    }

    lookupController?.abort();
    lookupController = new AbortController();
    const sequence = ++lookupSequence;

    setLookupLoading(true);
    setSearchResult(`Checking ${clean}${TLD}...`, "loading");
    try {
      const body = new URLSearchParams({ s: clean });
      const response = await fetch("/cgi-bin/domain_lookup.pl", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body,
        signal: lookupController.signal
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = (await response.text()).trim();
      if (sequence !== lookupSequence) return;
      setSearchResult(
        text ? sanitizeLookupResponse(text) : `No response returned for ${clean}${TLD}.`,
        "ready",
        { html: Boolean(text) }
      );
    } catch (error) {
      if (error?.name === "AbortError" || sequence !== lookupSequence) return;
      setSearchResult(
        "Search failed. Use letters, numbers and hyphens only, or contact admin@zispa.org.zw.",
        "error"
      );
    } finally {
      if (sequence === lookupSequence) setLookupLoading(false);
    }
  }

  function wire(root) {
    const form = root.querySelector("#ss-domain-form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      checkDomain(root.querySelector("#ss-domain")?.value);
    });
  }

  function mount() {
    if (document.getElementById(ROOT_ID)) return;
    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.innerHTML = markup();
    document.body.appendChild(root);
    wire(root);
  }

  if (document.body) {
    mount();
  } else {
    new MutationObserver((_records, observer) => {
      if (document.body) {
        observer.disconnect();
        mount();
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
