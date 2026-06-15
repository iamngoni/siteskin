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
  let lastDrawerOpener = null;

  const ISP_MEMBERS = [
    { name: "Africom Zimbabwe" },
    { name: "Clay Bytes Solutions" },
    { name: "Econet Wireless", href: "http://www.econet.co.zw" },
    { name: "FBNet" },
    { name: "Frampol" },
    { name: "Liquid Telecom", href: "http://zimbabwe.liquidtelecom.com" },
    { name: "Powertel", href: "http://powertel.co.zw" },
    { name: "SADACNET" },
    { name: "Telco", href: "http://www.telco.co.zw/newtelco" },
    { name: "Telecel", href: "http://www.telecel.co.zw" },
    { name: "Utande" },
    { name: "ZARNet" },
    { name: "ZODSAT" },
    { name: "ZOL Zimbabwe" }
  ];

  const SERVICE_MEMBERS = [
    { name: "Advert Guru" },
    { name: "Afrohost" },
    { name: "Akoiweb" },
    { name: "Angel&Walt" },
    { name: "Atomistic Solutions" },
    { name: "Castellum Integrated Systems" },
    { name: "Centric Data" },
    { name: "Cloud Plus Africa" },
    { name: "Credible Brands" },
    { name: "Cyberplex Africa" },
    { name: "Design@7" },
    { name: "Ecowebzim" },
    { name: "Ehost", href: "https://ehost.co.zw" },
    { name: "Freshspot" },
    { name: "GetHost Web Hosting" },
    { name: "Hansole Investments" },
    { name: "Hectic Interweb Magic" },
    { name: "Innovate Hosting", href: "https://innovatehosting.co.zw" },
    { name: "Internet Solutions Africa" },
    { name: "JBK Web Hosting" },
    { name: "JomeTech Africa" },
    { name: "Mango Email Service" },
    { name: "Marketing By Weber" },
    { name: "Marmasco Technologies" },
    { name: "Myzimhost" },
    { name: "Neolab Technology" },
    { name: "NivaCity" },
    { name: "Pnrhost" },
    { name: "Real Digital Systems" },
    { name: "Skylinepromo" },
    { name: "Starnet" },
    { name: "Status Hi-Tech" },
    { name: "Tapali Technologies" },
    { name: "Terrific Tech" },
    { name: "The Source" },
    { name: "Tremhost" },
    { name: "uHostAfrica" },
    { name: "Vertico Solutions" },
    { name: "Web Enchanter" },
    { name: "Webdev" },
    { name: "Webzim", href: "https://webzim.co.zw" },
    { name: "Wehost", href: "https://wehost.co.zw" },
    { name: "Zimbabwe Center for High Performance Computing" },
    { name: "Zimbiz Network" },
    { name: "ZHD Consulting" },
    { name: "Zimhero web solutions" },
    { name: "Zimhosts" }
  ];

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
      { label: "What is a domain name?", drawer: "domain-name", icon: "help" },
      { label: "Domain registration guide", drawer: "registration-guide", icon: "book" },
      { label: "Policies & requirements", drawer: "policies", icon: "shield" }
    ],
    actions: [
      {
        title: "Register a domain",
        body: "Search and register your .co.zw domain name.",
        cta: "Start registration",
        drawer: "registration-guide",
        icon: "globe",
        tone: "green"
      },
      {
        title: "Find a registrar",
        body: "ZISPA registrars and members across Zimbabwe.",
        cta: "View members",
        drawer: "members",
        icon: "users",
        tone: "gold"
      },
      {
        title: "Registry policies",
        body: "Review policies, requirements and dispute information.",
        cta: "View policies",
        drawer: "policies",
        icon: "shield",
        tone: "red"
      },
      {
        title: "ZINX peering",
        body: "Information for ISPs about ZINX and peering.",
        cta: "About ZINX",
        drawer: "zinx",
        icon: "network",
        tone: "green"
      }
    ],
    domainGuide: [
      { label: "What is a domain name?", drawer: "domain-name" },
      { label: "Benefits of registering a domain name", drawer: "domain-name" },
      { label: "Choosing a domain name", drawer: "registration-guide" },
      { label: "Domain name registration procedure", drawer: "registration-guide" },
      { label: "Submission requirements for registrars", drawer: "registration-guide" }
    ],
    policies: [
      { label: "Processing of applications", drawer: "processing" },
      { label: "ZISPA registration policies", drawer: "policies" },
      { label: "Registration fees", drawer: "fees" },
      { label: "Domain name disputes", drawer: "disputes" },
      { label: "Whois service", drawer: "whois" }
    ],
    ispMembers: ISP_MEMBERS.filter((member) => member.href).slice(0, 5),
    serviceMembers: SERVICE_MEMBERS.filter((member) => member.href).slice(0, 4),
    allIspMembers: ISP_MEMBERS,
    allServiceMembers: SERVICE_MEMBERS,
    contact: {
      admin: "admin@zispa.org.zw",
      whatsapp: "+263 772 782208",
      registry: "registry-accounts@mango.zw",
      tel: "+263 08677 190909"
    },
    drawerTopics: {
      "domain-name": {
        eyebrow: "Domain basics",
        title: "What is a domain name?",
        intro:
          "A domain name is the human-readable address people use to find a website or service online.",
        sections: [
          {
            heading: "How .co.zw works",
            body:
              "ZISPA manages the .co.zw namespace. The operational records for each domain are maintained through the registrant's registrar or DNS hosting provider."
          },
          {
            heading: "Why register one",
            items: [
              "Use a Zimbabwe-specific web and email identity.",
              "Keep your organisation's public address easier to remember.",
              "Separate the domain owner from the hosting provider so services can move later."
            ]
          }
        ]
      },
      "registration-guide": {
        eyebrow: "Registration guide",
        title: "Domain registration procedure",
        intro:
          "Registrants should work through a ZISPA member or registrar for new registrations, changes, transfers and deletions.",
        sections: [
          {
            heading: "Before submitting",
            items: [
              "Choose a .co.zw name that accurately represents the registrant.",
              "Prepare accurate owner details and the required identity or certificate information.",
              "Confirm the domain has two to four unique authoritative name servers."
            ]
          },
          {
            heading: "Submission route",
            items: [
              "A registrar sends the completed .co.zw registration template to admin@zispa.org.zw.",
              "New registrations require a signed letter accepting ZISPA terms and conditions.",
              "Transfers, modifications and deletions should also be routed through the registrar."
            ]
          }
        ]
      },
      processing: {
        eyebrow: "Registry operations",
        title: "Processing of applications",
        intro:
          "ZISPA aims to process complete domain requests within one working day.",
        sections: [
          {
            heading: "Registry checks",
            items: [
              "Requested action, owner details and registrar details are checked for completeness.",
              "Applications are assessed against ZISPA policies and POTRAZ requirements.",
              "Name servers, SOA records, serial numbers and release letters are checked where relevant."
            ]
          }
        ]
      },
      policies: {
        eyebrow: "Registry policy",
        title: "Policies & requirements",
        intro:
          "ZISPA registration policy is designed to keep .co.zw ownership records accurate and accountable.",
        sections: [
          {
            heading: "Registrant details",
            items: [
              "POTRAZ requires accurate owner details for registered domains.",
              "Registrants must provide a national ID, company certificate or equivalent identifying document.",
              "ZISPA vets applications and may object where details or rights are unclear."
            ]
          },
          {
            heading: "Terms and conditions",
            body:
              "Applications are subject to ZISPA's standard terms and conditions, including requirements around truthful information and appropriate use of the namespace."
          }
        ]
      },
      terms: {
        eyebrow: "Registry terms",
        title: "Terms & Conditions",
        intro:
          "Domain registrations are subject to ZISPA's standard terms and conditions.",
        sections: [
          {
            heading: "Registrant responsibility",
            items: [
              "Registration details must be accurate and complete.",
              "Applicants must accept the registry terms before a new domain is registered.",
              "Changes, transfers and deletions should be handled through the registrant's registrar."
            ]
          }
        ]
      },
      privacy: {
        eyebrow: "Registry privacy",
        title: "Privacy Policy",
        intro:
          "ZISPA's old site does not expose a public online whois lookup. Registry information requests are handled directly by the registry team.",
        sections: [
          {
            heading: "Registry information",
            items: [
              "Owner details are collected for domain registration and regulatory requirements.",
              "Whois-related requests should be sent to admin@zispa.org.zw.",
              "Requests should include enough context for the registry team to assess the enquiry."
            ]
          }
        ]
      },
      fees: {
        eyebrow: "Registry fees",
        title: "Registration fees",
        sections: [
          {
            heading: "Non-member registrar fees",
            items: [
              "USD 35 per domain registration.",
              "USD 35 per domain renewal.",
              "No charge for standard modifications."
            ]
          }
        ]
      },
      disputes: {
        eyebrow: "Registry policy",
        title: "Domain name disputes",
        intro:
          "ZISPA is not the arbiter of domain name disputes, but can provide registry information where there is evidence of a rights issue.",
        sections: [
          {
            heading: "Rights concerns",
            items: [
              "Cyber-squatting objections should include evidence of the rights being infringed.",
              "ZISPA may provide applicant information where a legitimate rights violation is shown.",
              "Disputes remain subject to the applicable legal and regulatory process."
            ]
          }
        ]
      },
      whois: {
        eyebrow: "Registry support",
        title: "Whois service",
        intro:
          "The old ZISPA site does not provide a public online whois search.",
        sections: [
          {
            heading: "Requesting information",
            body:
              "Whois-related requests should be sent to admin@zispa.org.zw with enough detail for the registry team to identify the domain and request context."
          }
        ]
      },
      members: {
        eyebrow: "Member directory",
        title: "ZISPA members",
        intro:
          "ZISPA members include Internet Service Providers, web hosts, IT consulting companies and related service organisations.",
        memberGroups: [
          { heading: "Internet Service Providers", members: ISP_MEMBERS },
          { heading: "IT Consulting, Web & Hosting", members: SERVICE_MEMBERS }
        ]
      },
      "isp-members": {
        eyebrow: "Member directory",
        title: "Internet Service Provider members",
        memberGroups: [{ heading: "Internet Service Providers", members: ISP_MEMBERS }]
      },
      "service-members": {
        eyebrow: "Member directory",
        title: "IT Consulting, Web & Hosting members",
        memberGroups: [{ heading: "IT Consulting, Web & Hosting", members: SERVICE_MEMBERS }]
      },
      zinx: {
        eyebrow: "Zimbabwe Internet Exchange",
        title: "About ZINX",
        intro:
          "ZISPA operates the Zimbabwe Internet Exchange so local Internet Service Providers can exchange traffic directly.",
        sections: [
          {
            heading: "Peering",
            items: [
              "ZINX keeps eligible local traffic within Zimbabwe where peers are connected.",
              "The exchange supports direct interconnection between participating ISPs.",
              "Membership or peering enquiries should be sent to admin@zispa.org.zw."
            ]
          }
        ]
      }
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
    close:
      '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
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
          <button type="button" data-drawer="${esc(item.drawer)}">
            ${icon(item.icon)}
            <span>${esc(item.label)}</span>
          </button>
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
              <button class="ss-action-link" type="button" data-drawer="${esc(item.drawer)}">
                <span>${esc(item.cta)}</span>
                ${icon("chevron")}
              </button>
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

  function detailList(items) {
    return items
      .map(
        (item) => `
          <li>
            ${icon("check")}
            <button class="ss-detail-trigger" type="button" data-drawer="${esc(item.drawer)}">
              ${esc(item.label)}
            </button>
          </li>
        `
      )
      .join("");
  }

  function drawerSections(sections = []) {
    return sections
      .map((section) => {
        const body = section.body ? `<p>${esc(section.body)}</p>` : "";
        const items = Array.isArray(section.items)
          ? `<ul>${section.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
          : "";
        return `
          <section class="ss-drawer-section">
            <h3>${esc(section.heading)}</h3>
            ${body}
            ${items}
          </section>
        `;
      })
      .join("");
  }

  function drawerMemberGroups(groups = []) {
    return groups
      .map(
        (group) => `
          <section class="ss-drawer-section">
            <h3>${esc(group.heading)}</h3>
            <div class="ss-member-directory">
              ${group.members
                .map((member) =>
                  member.href
                    ? `<a href="${esc(member.href)}" target="_blank" rel="noreferrer">${esc(member.name)}</a>`
                    : `<span>${esc(member.name)}</span>`
                )
                .join("")}
            </div>
          </section>
        `
      )
      .join("");
  }

  function drawerBody(topic) {
    const intro = topic.intro ? `<p class="ss-drawer-intro">${esc(topic.intro)}</p>` : "";
    return `${intro}${drawerSections(topic.sections)}${drawerMemberGroups(topic.memberGroups)}`;
  }

  function mapGraphic() {
    return `
      <svg class="ss-map" viewBox="70 0 430 360" role="img" aria-label="Network map of Zimbabwe">
        <title>Zimbabwe network map</title>
        <path class="ss-map-outline" d="M355.9 331.1 L332 326.6 L316.9 332 L295.1 324.4 L276.9 323.9 L248.2 303.6 L213.5 296.7 L200.2 268.2 L200.1 252.3 L180.9 247.5 L130 198.1 L115.9 172.1 L106.8 164.1 L89.5 128.2 L139.8 133.1 L154.4 138.3 L169.5 137.2 L194.4 108.1 L233.5 71.2 L249.6 67.6 L255.1 52.1 L280.7 34.2 L314.7 28 L317.6 44.8 L355.1 43.9 L375.9 53.4 L385.6 64.5 L407 67.7 L430.4 82.2 L430.5 139.1 L421.7 170.2 L419.8 203.8 L427 217.1 L421.9 243.6 L415.1 247.7 L403.3 280.1 L355.9 331.1 Z"/>
        <g class="ss-map-lines">
          <path d="M115 136.6 240.6 235.9 294.1 205.2 294.1 181.7 349.7 132.3"/>
          <path d="M240.6 235.9 339.6 233.2 302.1 329.5"/>
          <path d="M349.7 132.3 421.5 183.6 339.6 233.2 294.1 205.2"/>
          <path d="M311.4 111.5 349.7 132.3 294.1 181.7"/>
        </g>
        <g class="ss-map-nodes">
          <circle cx="115" cy="136.6" r="7"/>
          <circle cx="240.6" cy="235.9" r="7"/>
          <circle cx="294.1" cy="205.2" r="7"/>
          <circle cx="294.1" cy="181.7" r="7"/>
          <circle cx="311.4" cy="111.5" r="7"/>
          <circle cx="349.7" cy="132.3" r="9"/>
          <circle cx="421.5" cy="183.6" r="7"/>
          <circle cx="339.6" cy="233.2" r="7"/>
          <circle cx="302.1" cy="329.5" r="7"/>
        </g>
        <g class="ss-map-dots">
          <circle cx="454" cy="122" r="3"/>
          <circle cx="468" cy="148" r="3"/>
          <circle cx="444" cy="192" r="3"/>
          <circle cx="398" cy="102" r="3"/>
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
                <button class="ss-text-link" type="button" data-drawer="isp-members">View all ISP members ${icon("chevron")}</button>
              </article>
              <article>
                <h3>IT Consulting, Web & Hosting</h3>
                <div class="ss-member-row">${memberLinks(c.serviceMembers)}</div>
                <button class="ss-text-link" type="button" data-drawer="service-members">View all service members ${icon("chevron")}</button>
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
              <button class="ss-text-link" type="button" data-drawer="policies">Learn more ${icon("chevron")}</button>
            </div>
          </aside>
        </section>

        <section class="ss-detail-band" id="domain-guide">
          <article>
            <h2>Domain registration guidance</h2>
            <p>CO.ZW domain names may be registered through a ZISPA member, including local ISPs and web-related organisations.</p>
            <ul>${detailList(c.domainGuide)}</ul>
          </article>
          <article id="zinx">
            <h2>About ZINX</h2>
            <p>ZISPA operates the Zimbabwe Internet Exchange, enabling local Internet Service Providers to exchange traffic directly.</p>
            <ul>${detailList(c.policies)}</ul>
          </article>
        </section>
      </main>

      <footer class="ss-footer" id="agm">
        <span>Copyright ZISPA 2016-${new Date().getFullYear()}</span>
        <nav aria-label="Footer navigation">
          <button class="ss-footer-link" type="button" data-drawer="terms">Terms & Conditions</button>
          <button class="ss-footer-link" type="button" data-drawer="privacy">Privacy Policy</button>
          <a href="#home">Sitemap</a>
        </nav>
        <span class="ss-zim">Proudly serving the Zimbabwe Internet community.</span>
      </footer>

      <div class="ss-drawer-backdrop" data-drawer-close hidden></div>
      <aside class="ss-drawer" role="complementary" aria-hidden="true" aria-labelledby="ss-drawer-title">
        <button class="ss-drawer-close" type="button" data-drawer-close aria-label="Close drawer">
          ${icon("close")}
        </button>
        <p class="ss-drawer-eyebrow" id="ss-drawer-eyebrow">ZISPA</p>
        <h2 id="ss-drawer-title"></h2>
        <div class="ss-drawer-body" id="ss-drawer-body"></div>
      </aside>
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

  function openDrawer(root, topicId, opener) {
    const topic = CONTENT.drawerTopics[topicId];
    const drawer = root.querySelector(".ss-drawer");
    const backdrop = root.querySelector(".ss-drawer-backdrop");
    const eyebrow = root.querySelector("#ss-drawer-eyebrow");
    const title = root.querySelector("#ss-drawer-title");
    const body = root.querySelector("#ss-drawer-body");
    const closeButton = root.querySelector(".ss-drawer-close");
    if (!topic || !drawer || !backdrop || !eyebrow || !title || !body) return;

    lastDrawerOpener = opener instanceof HTMLElement ? opener : null;
    eyebrow.textContent = topic.eyebrow || CONTENT.acronym;
    title.textContent = topic.title;
    body.innerHTML = drawerBody(topic);
    backdrop.hidden = false;
    root.classList.add("is-drawer-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    closeButton?.focus({ preventScroll: true });
  }

  function closeDrawer(root) {
    const drawer = root.querySelector(".ss-drawer");
    const backdrop = root.querySelector(".ss-drawer-backdrop");
    if (!drawer || !backdrop || !root.classList.contains("is-drawer-open")) return;

    root.classList.remove("is-drawer-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    if (lastDrawerOpener?.isConnected) {
      lastDrawerOpener.focus({ preventScroll: true });
    }
    lastDrawerOpener = null;
  }

  function wire(root) {
    const form = root.querySelector("#ss-domain-form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      checkDomain(root.querySelector("#ss-domain")?.value);
    });

    root.addEventListener("click", (event) => {
      const drawerTrigger = event.target.closest("[data-drawer]");
      if (drawerTrigger && root.contains(drawerTrigger)) {
        event.preventDefault();
        openDrawer(root, drawerTrigger.dataset.drawer, drawerTrigger);
        return;
      }

      const closeTrigger = event.target.closest("[data-drawer-close]");
      if (closeTrigger && root.contains(closeTrigger)) {
        event.preventDefault();
        closeDrawer(root);
      }
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDrawer(root);
      }
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
