/* ===================================================================
   shared.js — header, footer, nav behaviour, and small helpers
   used by every page. Edit data/site.json to change business info
   shown in the header/footer; this file should rarely need touching.
   =================================================================== */

const DATA_PATH = {
  site: "data/site.json",
  properties: "data/properties.json"
};

/** Basic fetch + JSON helper with a friendly error if it fails
 *  (most commonly because the site is opened as a local file://
 *  instead of being served — see README "Previewing locally"). */
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} responded with ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Could not load ${path}.`, err);
    return null;
  }
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/** Renders the topographic contour-line SVG used as the site's
 *  signature divider/background motif. width/height/opacity tweakable. */
function contourSVG({ lines = 5, width = 1200, height = 240, opacity = 0.4 } = {}) {
  let paths = "";
  for (let i = 0; i < lines; i++) {
    const baseY = (height / lines) * i + 20;
    let d = `M -20 ${baseY} `;
    let x = -20;
    while (x < width + 40) {
      x += 80;
      const wobble = Math.sin(x * 0.01 + i) * 18;
      d += `Q ${x - 40} ${baseY + wobble} ${x} ${baseY} `;
    }
    paths += `<path d="${d}" fill="none" stroke="var(--color-accent)" stroke-width="1.3" stroke-opacity="${0.12 + i * 0.03}"/>`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%;height:100%;opacity:${opacity}">${paths}</svg>`;
}

/** Builds the header and footer and injects them into any page that
 *  has <div id="site-header"></div> and <div id="site-footer"></div>.
 *  activePage should match data-page on the nav links below. */
async function renderChrome(activePage) {
  const site = await loadJSON(DATA_PATH.site);
  if (!site) return;

  const headerEl = document.getElementById("site-header");
  if (headerEl) {
    headerEl.innerHTML = `
      <div class="wrap">
        <a href="index.html" class="brand">${escapeHTML(site.businessName).split(" ")[0]} <span>${escapeHTML(site.businessName).split(" ").slice(1).join(" ")}</span></a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">Menu</button>
        <nav class="main-nav" id="main-nav">
          <a href="index.html" data-page="home">Home</a>
          <a href="property.html?id=riverside-cottage" data-page="property">Properties</a>
          <a href="about.html" data-page="about">About</a>
          <a href="contact.html" data-page="contact">Contact</a>
        </nav>
      </div>
    `;
    headerEl.querySelectorAll("[data-page]").forEach(link => {
      if (link.dataset.page === activePage) link.classList.add("active");
    });
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    toggle?.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const footerEl = document.getElementById("site-footer");
  if (footerEl) {
    footerEl.innerHTML = `
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <h3>${escapeHTML(site.businessName)}</h3>
            <p>${escapeHTML(site.footerNote || "")}</p>
          </div>
          <div>
            <h3>Explore</h3>
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
          </div>
          <div>
            <h3>Reach us</h3>
            <a href="tel:${escapeHTML(site.phone || "")}">${escapeHTML(site.phone || "")}</a>
            <a href="mailto:${escapeHTML(site.email || "")}">${escapeHTML(site.email || "")}</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} ${escapeHTML(site.businessName)}</span>
          <span>${escapeHTML(site.address || "")}</span>
        </div>
      </div>
    `;
  }

  return site;
}
