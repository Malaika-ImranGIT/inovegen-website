/* =========================================================
   Inovegen — site behaviour
   EDIT THIS ONE VALUE AFTER SETTING UP THE GOOGLE SHEET:
   paste the "Web app URL" from Google Apps Script (see README).
   ========================================================= */
const CONFIG = {
  sheetUrl: "https://script.google.com/macros/s/AKfycbx_6Ie4sWSHUD9fF_8vdo-pxJg_2ySy0sRCKDMfW67COa4ujlz1TgLNqhjSg2Eoh_A3/exec",
};

/* ---------- Page-load sequence (the one orchestrated entrance) ---------- */
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("loaded")));

/* ---------- Header + mobile menu ---------- */
const header = document.querySelector(".site-header");
const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
function setMenu(open) {
  if (!menuBtn || !nav) return;
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}
menuBtn?.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
window.matchMedia("(min-width: 861px)").addEventListener("change", () => setMenu(false));

/* ---------- Tabs (services on home, domains on internships) ---------- */
document.querySelectorAll("[data-tabs]").forEach((root) => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];
  function select(i, focus) {
    tabs.forEach((t, n) => {
      const on = n === i;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, n) => {
      p.hidden = n !== i;
      p.classList.toggle("show", n === i);
    });
    if (focus) tabs[i].focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", (e) => {
      const last = tabs.length - 1;
      if (["ArrowDown", "ArrowRight"].includes(e.key)) { e.preventDefault(); select(i === last ? 0 : i + 1, true); }
      if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); select(i === 0 ? last : i - 1, true); }
    });
  });
  // Allow deep links like services.html#web
  const hash = location.hash.slice(1);
  const start = Math.max(0, tabs.findIndex((t) => t.dataset.key === hash));
  select(start);
});

/* ---------- Count-up numbers (only real figures, runs once) ---------- */
const counters = document.querySelectorAll("[data-count]");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function run(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  if (reduce) { el.textContent = target + suffix; return; }
  const t0 = performance.now(), dur = 1400;
  (function tick(now) {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach((c) => io.observe(c));
} else counters.forEach(run);

/* ---------- Forms that save to Google Sheets ---------- */
const toast = document.querySelector(".toast");
document.querySelectorAll("form[data-sheet]").forEach((form) => {
  // Preselect the domain when arriving from an internship panel (apply.html?domain=web)
  const wanted = new URLSearchParams(location.search).get("domain");
  const sel = form.querySelector('select[name="domain"]');
  if (wanted && sel) {
    const opt = [...sel.options].find((o) => o.dataset.key === wanted);
    if (opt) sel.value = opt.value;
  }
  const err = form.querySelector(".form-error");
  const btn = form.querySelector('button[type="submit"]');
  const done = form.parentElement.querySelector(".form-done");
  const fail = (msg) => { err.textContent = msg; err.hidden = false; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.hidden = true;
    if (!form.reportValidity()) return;
    if (!CONFIG.sheetUrl) { fail("This form is not connected yet. Please message us on LinkedIn or email us instead."); return; }
    const data = Object.fromEntries(new FormData(form).entries());
    data.type = form.dataset.type;
    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = "Sending…";
    try {
      // Apps Script web apps answer cross-origin posts without readable replies, so we use no-cors.
      await fetch(CONFIG.sheetUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data) });
      form.hidden = true;
      if (done) { done.hidden = false; done.scrollIntoView({ behavior: "smooth", block: "center" }); }
    } catch {
      fail("We could not send that. Check your connection and try again, or message us on LinkedIn.");
      btn.disabled = false;
      btn.textContent = label;
    }
  });
});

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
