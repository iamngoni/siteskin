/*
 * ZIMRA Service Hub.
 *
 * This pack keeps official transactional systems as outbound links and only
 * reshapes ZIMRA's public information pages into a faster service hub.
 */
(() => {
  "use strict";

  const ROOT_ID = "siteskin-root";
  const origin = "https://www.zimra.co.zw";

  const nav = [
    ["Home", "/"],
    ["Customs", "/customs/customs-clearance-procedures"],
    ["Domestic Taxes", "/domestic-taxes/tax-payment-dates"],
    ["Downloads", "/downloads"],
    ["Public Notices", "/public-notices"],
    ["Tenders", "/tenders"],
    ["FAQ", "/frequently-asked-questions"],
    ["Contact", "/contact-us/contacts/2252-head-office-2"]
  ];

  const services = [
    ["TaRMS Self-Service", "Manage taxpayer services", "https://mytaxselfservice.zimra.co.zw/auth/login?returnUrl=%2F", "portal"],
    ["eTIP Portal", "Temporary import permits", "https://ecustoms.zimra.co.zw/etip/", "customs"],
    ["Exchange Rates", "Recent exchange-rate downloads", "/downloads/category/77-exchange-rates-2023", "rates"],
    ["Tax Tables", "PAYE and statutory tables", "/domestic-taxes/tax-tables", "table"],
    ["E-Tariff", "Tariff lookup for importers", "https://etariff.zimra.co.zw/", "tariff"],
    ["Whistleblower Portal", "Report suspected misconduct", "https://whistleblower.zimra.co.zw/", "shield"],
    ["Domestic Tax Contacts", "Find the right tax office", "/publications-documents", "contact"],
    ["Downloads", "Forms, guides and public files", "/downloads", "download"]
  ];

  const docs = {
    taxTables: {
      eyebrow: "Domestic taxes",
      title: "Tax Tables",
      intro: "Quick access to the most-used PAYE tax table PDFs.",
      filters: ["All", "2025", "2024", "USD", "ZWG", "ZIG"],
      rows: [
        ["USD Jan-Dec 2025 Tax Tables", "PDF", "2025", "/domestic-taxes/tax-tables?download=4211:usd-jan-dec-2025-tax-tables"],
        ["ZWG 2025 tax tables", "PDF", "2025", "/domestic-taxes/tax-tables?download=4205:zwg-2025-tax-tables"],
        ["ZIG Tax Tables 5 April to 31 December 2024", "PDF", "2024", "/domestic-taxes/tax-tables?download=3877:zig-tax-tables-5-april-to-31-december-2024"],
        ["USD Jan-Dec 2024 Tax Tables", "PDF", "2024", "/domestic-taxes/tax-tables?download=3636:usd-jan-dec-2024-tax-tables"],
        ["Jan-July 2023 ZWL Tax Tables", "PDF", "Archive", "/domestic-taxes/tax-tables?download=3431:jan-july-2023-zwl-tax-tables"]
      ]
    },
    downloads: {
      eyebrow: "Documents",
      title: "Downloads",
      intro: "Forms, guides, contacts, tax tables and public documents in one searchable view.",
      filters: ["All", "Forms", "Tax", "Customs", "Contacts", "Guides"],
      rows: [
        ["Tax Tables", "Folder", "Domestic taxes", "/domestic-taxes/tax-tables"],
        ["Exchange Rates", "Folder", "Customs", "/downloads/category/77-exchange-rates-2023"],
        ["Domestic Taxes Contact Persons", "PDF", "Contacts", "/publications-documents"],
        ["ZIMRA Bank Accounts", "Guide", "Payments", "/profile/2037-zimra-bank-accounts"],
        ["Fiscalisation Explained", "Guide", "Domestic taxes", "/domestic-taxes/corporate/fiscalisation-explained"]
      ]
    },
    notices: {
      eyebrow: "Public notices",
      title: "Latest public notices",
      intro: "A cleaner surface for statutory notices and public updates.",
      filters: ["All", "Tax", "Customs", "Systems", "Compliance"],
      rows: [
        ["Migration to the New Tax and Revenue Management System", "Notice", "TaRMS", "/news/22-taxmans-corner/2266-migration-to-the-new-tax-and-revenue-management-system-tarms"],
        ["Use new TaRMS platform to access Tax Clearances", "Notice", "TaRMS", "/news/22-taxmans-corner/2273-use-new-tarms-platform-to-access-tax-clearances"],
        ["Temporary Import permit online", "Notice", "Customs", "/news/22-taxmans-corner/2325-temporary-import-permit-online-tip"],
        ["Compliance with the ZIMRA Fiscalisation Data Management System", "Notice", "FDMS", "/news/22-taxmans-corner/2307-compliance-with-the-zimra-fiscalisation-data-management-system-fdms"]
      ]
    },
    tenders: {
      eyebrow: "Procurement",
      title: "Tenders",
      intro: "Tender notices and procurement documents grouped for easier scanning.",
      filters: ["All", "Open", "Closed", "Awards"],
      rows: [
        ["Current tender notices", "List", "Procurement", "/tenders"],
        ["Public notices", "List", "Updates", "/public-notices"],
        ["Contact centre", "Contact", "Support", "/contact-us/contacts/2252-head-office-2"]
      ]
    }
  };

  const faqs = [
    ["How does one register for VAT?", "Registration must be done in TaRMS through Taxpayer profile, Tax Type, then New Tax Type."],
    ["What type of taxes are payable to ZIMRA?", "Individuals and businesses can review domestic taxes, customs duties, VAT, PAYE and other obligations."],
    ["Where are payments to ZIMRA done?", "Use the official ZIMRA payment guidance and verified bank account information before paying."],
    ["Where is the ZIMRA headquarters?", "The contact directory lists the head office, stations and border posts."]
  ];

  const offices = [
    ["Contact Centre", "Head office support", "/contact-us/contacts/2252-head-office-2"],
    ["Beitbridge Border Post", "Border services", "/contact-us/contacts/1901-beitbridge-border-post"],
    ["Bulawayo Domestic Taxes", "Regional domestic taxes", "/contact-us/contacts/1903-bulawayo-individuals"],
    ["Forbes Border Post", "Border services", "/contact-us/contacts/1914-forbes-border-post"],
    ["Victoria Falls Border Post", "Border services", "/contact-us/contacts/1910-victoria-falls-border-post"]
  ];

  function absoluteUrl(href) {
    if (/^https?:\/\//i.test(href)) return href;
    return `${origin}${href}`;
  }

  function icon(name) {
    const icons = {
      portal: "M4 5h16v10H4V5Zm3 14h10",
      customs: "M12 3 4 7v6c0 4 3 7 8 8 5-1 8-4 8-8V7l-8-4Z",
      rates: "M5 17 10 12l3 3 6-8",
      table: "M4 5h16v14H4V5Zm0 5h16M9 5v14",
      tariff: "M6 4h12v16H6V4Zm3 4h6M9 12h6M9 16h4",
      shield: "M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z",
      contact: "M4 6h16v12H4V6Zm3 3h5M7 13h10",
      download: "M12 4v10m0 0 4-4m-4 4-4-4M5 20h14"
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name] || icons.portal}"/></svg>`;
  }

  function route() {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    if (path.includes("/domestic-taxes/tax-tables")) return "taxTables";
    if (path.includes("/downloads")) return "downloads";
    if (path.includes("/public-notices")) return "notices";
    if (path.includes("/tenders")) return "tenders";
    if (path.includes("/frequently-asked-questions")) return "faq";
    if (path.includes("/contact-us")) return "contact";
    return "home";
  }

  function link(label, href, className = "") {
    return `<a class="${className}" href="${absoluteUrl(href)}">${label}</a>`;
  }

  function serviceGrid() {
    return `<section class="ss-service-grid" aria-label="ZIMRA services">
      ${services.map(([title, body, href, iconName]) => `
        <a class="ss-service" href="${absoluteUrl(href)}">
          ${icon(iconName)}
          <span><strong>${title}</strong><small>${body}</small></span>
        </a>`).join("")}
    </section>`;
  }

  function todayPanel() {
    return `<aside class="ss-panel ss-today">
      <div class="ss-panel-head">
        <span>Today</span>
        <strong>Public shortcuts</strong>
      </div>
      <a href="${origin}/domestic-taxes/tax-tables">2025 tax tables</a>
      <a href="${origin}/downloads/category/77-exchange-rates-2023">Exchange rates</a>
      <a href="${origin}/public-notices">Public notices</a>
      <a href="${origin}/contact-us/contacts/2252-head-office-2">Contact centre</a>
      <div class="ss-loader" aria-hidden="true"><span></span><span></span><span></span></div>
    </aside>`;
  }

  function documentView(def) {
    return `<main class="ss-main">
      <section class="ss-page-title">
        <span>${def.eyebrow}</span>
        <h1>${def.title}</h1>
        <p>${def.intro}</p>
      </section>
      <section class="ss-doc-shell">
        <div class="ss-doc-tools">
          <label>
            <span>Filter documents</span>
            <input type="search" data-filter placeholder="Search ${def.title.toLowerCase()}" />
          </label>
          <div class="ss-chips">${def.filters.map((f) => `<button type="button">${f}</button>`).join("")}</div>
        </div>
        <div class="ss-doc-list">
          ${def.rows.map(([title, type, meta, href]) => `
            <a class="ss-doc-row" data-row href="${absoluteUrl(href)}">
              ${icon(type === "PDF" ? "download" : "table")}
              <span><strong>${title}</strong><small>${type} - ${meta}</small></span>
              <em>Open</em>
            </a>`).join("")}
        </div>
      </section>
    </main>`;
  }

  function faqView() {
    return `<main class="ss-main">
      <section class="ss-page-title">
        <span>Help</span>
        <h1>Frequently asked questions</h1>
        <p>Common public tax and customs questions, kept separate from transactional portals.</p>
      </section>
      <section class="ss-faq-list">${faqs.map(([q, a]) => `
        <details>
          <summary>${q}</summary>
          <p>${a}</p>
        </details>`).join("")}</section>
    </main>`;
  }

  function contactView() {
    return `<main class="ss-main">
      <section class="ss-page-title">
        <span>Contact directory</span>
        <h1>Find a ZIMRA office</h1>
        <p>Search public offices, stations and border posts without digging through the legacy directory.</p>
      </section>
      <section class="ss-doc-shell">
        <div class="ss-doc-tools">
          <label>
            <span>Search offices</span>
            <input type="search" data-filter placeholder="Search office or border post" />
          </label>
        </div>
        <div class="ss-doc-list">${offices.map(([name, meta, href]) => `
          <a class="ss-doc-row" data-row href="${absoluteUrl(href)}">
            ${icon("contact")}
            <span><strong>${name}</strong><small>${meta}</small></span>
            <em>Details</em>
          </a>`).join("")}</div>
      </section>
    </main>`;
  }

  function homeView() {
    return `<main class="ss-main ss-home">
      <section class="ss-hero">
        <div>
          <span class="ss-eyebrow">Public tax and customs services</span>
          <h1>Find tax and customs services faster.</h1>
          <p>ZIMRA links, documents, contacts and notices arranged around the jobs people actually come here to do.</p>
          <div class="ss-search">
            ${icon("rates")}
            <input type="search" data-filter placeholder="Search services, forms, rates, offices" />
          </div>
          <div class="ss-tabs" aria-label="Service audiences">
            <button>Individuals</button><button>Businesses</button><button>Importers</button><button>Employers</button>
          </div>
        </div>
        ${todayPanel()}
      </section>
      ${serviceGrid()}
      ${documentView(docs.downloads).replace("<main class=\"ss-main\">", "<section>").replace("</main>", "</section>")}
    </main>`;
  }

  function chrome() {
    const activePath = route();
    return `<div class="ss-zimra">
      <header class="ss-header">
        <a class="ss-brand" href="${origin}/">
          <span class="ss-mark">Z</span>
          <span><strong>ZIMRA</strong><small>Integrity - Fairness - Service Excellence</small></span>
        </a>
        <nav>${nav.map(([label, href]) => link(label, href, location.pathname === href ? "active" : "")).join("")}</nav>
      </header>
      ${activePath === "home" ? homeView() : ""}
      ${docs[activePath] ? documentView(docs[activePath]) : ""}
      ${activePath === "faq" ? faqView() : ""}
      ${activePath === "contact" ? contactView() : ""}
      <footer class="ss-footer">
        <span>SiteSkin view. Official ZIMRA links are preserved.</span>
        <a href="${origin}${location.pathname}${location.search}">Open original path</a>
      </footer>
    </div>`;
  }

  function attachFilter(root) {
    root.querySelectorAll("[data-filter]").forEach((input) => {
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        root.querySelectorAll("[data-row], .ss-service").forEach((row) => {
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
    root.innerHTML = chrome();
    attachFilter(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
