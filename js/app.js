/* ============================================================
   Iosandros player companion — app logic (vanilla JS)

   Three pages render from static world data (window.KINGDOMS,
   window.HISTORY, etc. in data/data.js) — no API, no auth.

   Two pages (Character, Play Tracker) read per-character state
   from /api/state/<key>. Those require Cloudflare Access; until
   it's set up (and until Claude seeds your data) they show an
   empty state.

   CLAUDE: the bodies of renderCharacter() and renderTracker()
   are yours to fill in from the player's sheet. Everything else
   is shared scaffolding — leave it alone unless asked.
   ============================================================ */

// ---------- tiny DOM helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

// ---------- per-character state (D1 via /api/state) ----------
async function fetchState(key) {
  try {
    const res = await fetch(`/api/state/${key}`, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null; // 401 not-signed-in / 404 not-set → "not ready"
    const body = await res.json();
    return body.value ?? null;
  } catch {
    return null; // offline or local preview with no backend
  }
}

async function saveState(key, value) {
  try {
    const res = await fetch(`/api/state/${key}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ---------- tab navigation ----------
function activateTab(name) {
  $$(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  $$(".panel").forEach((p) =>
    p.classList.toggle("active", p.dataset.panel === name)
  );
  document.dispatchEvent(new CustomEvent("tab:shown", { detail: name }));
}

function wireTabs() {
  $$(".tab").forEach((btn) =>
    btn.addEventListener("click", () => activateTab(btn.dataset.tab))
  );
}

// ============================================================
//  BAKED-IN WORLD PAGES (shared across all player sites)
// ============================================================

function kingdomCard(k, isTerritory) {
  const dir = (window.KINGDOM_DIRECTIONS || {})[k.name];
  const meta = el("div", { class: "k-meta" });
  if (k.capital && k.capital !== "None")
    meta.append(el("span", {}, `Capital: ${k.capital}`));
  if (k.pop) meta.append(el("span", {}, `Pop: ${k.pop}`));
  if (dir) meta.append(el("span", {}, dir));

  const card = el(
    "div",
    { class: "kingdom-card" },
    el("div", { class: "k-name" }, k.name),
    el("div", { class: "k-house" }, isTerritory ? k.house : `House ${k.house}`),
    meta,
    el("div", { class: "k-desc" }, k.desc)
  );
  return card;
}

function renderKingdoms() {
  const grid = $("#kingdoms-grid");
  const tgrid = $("#territories-grid");
  if (grid && Array.isArray(window.KINGDOMS))
    grid.replaceChildren(...window.KINGDOMS.map((k) => kingdomCard(k, false)));
  if (tgrid && Array.isArray(window.TERRITORIES))
    tgrid.replaceChildren(...window.TERRITORIES.map((t) => kingdomCard(t, true)));
}

function renderHistory() {
  const tl = $("#history-timeline");
  if (!tl || !Array.isArray(window.HISTORY)) return;
  tl.replaceChildren(
    ...window.HISTORY.map((h) => {
      const entry = el(
        "div",
        { class: "timeline-entry" },
        el("div", { class: "t-year" }, h.year),
        el("div", { class: "t-title" }, h.title),
        el("div", { class: "t-body" }, h.body)
      );
      return entry;
    })
  );
}

function initMap() {
  const vp = $("#mapViewport");
  const img = $("#mapImg");
  if (!vp || !img) return;

  let scale = 1,
    tx = 0,
    ty = 0,
    dragging = false,
    sx = 0,
    sy = 0;

  const apply = () => {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  };

  // Fit the whole map inside the viewport and center it. This is the
  // default view and what "Reset" returns to. No-op while the panel is
  // hidden (clientWidth 0) or the image hasn't loaded — it's re-called
  // on tab:shown and on image load.
  const fitMap = () => {
    const w = vp.clientWidth,
      h = vp.clientHeight;
    if (!w || !h || !img.naturalWidth) return;
    scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    tx = (w - img.naturalWidth * scale) / 2;
    ty = (h - img.naturalHeight * scale) / 2;
    apply();
  };

  const zoom = (factor) => {
    scale = Math.max(0.05, Math.min(8, scale * factor));
    apply();
  };

  $("#mapZoomIn")?.addEventListener("click", () => zoom(1.25));
  $("#mapZoomOut")?.addEventListener("click", () => zoom(0.8));
  $("#mapReset")?.addEventListener("click", fitMap);

  vp.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      zoom(e.deltaY < 0 ? 1.1 : 0.9);
    },
    { passive: false }
  );

  const start = (x, y) => {
    dragging = true;
    sx = x - tx;
    sy = y - ty;
  };
  const move = (x, y) => {
    if (!dragging) return;
    tx = x - sx;
    ty = y - sy;
    apply();
  };
  const end = () => {
    dragging = false;
  };

  vp.addEventListener("mousedown", (e) => start(e.clientX, e.clientY));
  window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
  window.addEventListener("mouseup", end);
  vp.addEventListener("touchstart", (e) => { const t = e.touches[0]; start(t.clientX, t.clientY); }, { passive: true });
  vp.addEventListener("touchmove", (e) => { const t = e.touches[0]; move(t.clientX, t.clientY); }, { passive: true });
  vp.addEventListener("touchend", end);

  // Default to the full map: fit when the tab is shown, when the image
  // finishes loading, and on resize.
  document.addEventListener("tab:shown", (e) => { if (e.detail === "map") fitMap(); });
  if (img.complete) fitMap();
  else img.addEventListener("load", fitMap);
  window.addEventListener("resize", fitMap);
}

// ============================================================
//  PERSONAL PAGES (Claude fills these in per character)
// ============================================================

async function renderCharacter() {
  const empty = $("#character-empty");
  const content = $("#character-content");
  const data = await fetchState("character");

  if (!data) {
    if (empty) empty.hidden = false;
    if (content) content.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (content) content.hidden = false;

  // ─────────────────────────────────────────────────────────
  // CLAUDE: render the character sheet here from `data`.
  // `data` is the JSON seeded in migrations/0005_character_seed.js
  // (app_state key 'character'). Build DOM into `content` with the
  // el() helper + .kingdom-card / .k-* classes (see css/style.css).
  // Show whatever the player's sheet has: stats, skills, weapons,
  // abilities, equipment, backstory. Match the dark theme.
  // ─────────────────────────────────────────────────────────
  content.replaceChildren(
    el("p", { class: "k-desc" }, "Character data loaded — Claude renders the full sheet here.")
  );
}

async function renderTracker() {
  const empty = $("#tracker-empty");
  const content = $("#tracker-content");
  const data = await fetchState("tracker");

  if (!data) {
    if (empty) empty.hidden = false;
    if (content) content.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (content) content.hidden = false;

  // ─────────────────────────────────────────────────────────
  // CLAUDE: render the live play tracker here from `data`
  // (app_state key 'tracker'). Build controls for whatever the
  // character tracks mid-session — current HP, conditions,
  // resource/ability uses, a notes box, etc. Persist edits with:
  //   const next = { ...data, hp: 24 };
  //   await saveState('tracker', next);
  // Don't assume Caeto's resources (Ring/Budget) — use the
  // player's own sheet to decide what to track.
  // ─────────────────────────────────────────────────────────
  content.replaceChildren(
    el("p", { class: "k-desc" }, "Tracker data loaded — Claude renders the controls here.")
  );
}

// ---------- copyable Step 2 prompt (shown in the empty states) ----------
// Keep this in sync with the "Step 2 prompt" in README.md.
const STEP2_PROMPT = `I'm a player in a D&D campaign called Iosandros. My character is Rojan.
My character sheet and campaign materials are in this repo's PARENT folder
(a folder called "Iosandros", one level up from where you're running). Read
all of them: my character sheet, plus any history documents and session-zero
backstory I put there.

This repo is my personal companion site, already deployed to
alex.iosandros.com on Cloudflare Pages with a D1 database. Read README.md
first — it explains the architecture.

The site already has five tabs: Character, Play Tracker, 13 Kingdoms,
History, Map. The three world pages (Kingdoms, History, Map) are DONE and
shared across all players — do NOT rebuild them. The tab shell and styling
in index.html / css/style.css / js/app.js are also done.

YOUR JOB is the two personal pages, driven by my character sheet:

1. Generate migrations/0005_character_seed.js that saves my sheet into the
   app_state 'character' row (and a starting 'tracker' row). See the
   "Example: seeding the character sheet" section of README.md for the
   exact { id, statements: [...] } shape. Append it to migrations/index.js.

2. Fill in the renderCharacter() function in js/app.js. It already fetches
   my 'character' data — build the sheet UI from it (stats, skills,
   weapons, abilities, equipment, backstory — whatever my sheet has). Use
   the el() helper and the existing CSS classes (.kingdom-card, .k-*).

3. Fill in the renderTracker() function in js/app.js. Build controls for
   what I track mid-session (current HP, resource/ability uses, conditions,
   a notes box). Persist edits with saveState('tracker', next). Use MY
   sheet to decide what to track.

Before you start, ASK me:
- What's on my character sheet (confirm you parsed it correctly)
- What I want on the Play Tracker specifically
- Whether I want any extra pages beyond the standard five

Keep migrations idempotent (ON CONFLICT DO NOTHING). Match the existing
vanilla HTML/JS style — no frameworks. Walk me through big changes before
making them; one thing at a time.`;

function mountPromptBoxes() {
  $$(".prompt-box").forEach((box) => {
    const pre = el("pre", {}, STEP2_PROMPT);
    const btn = el("button", { class: "btn copy-btn" }, "Copy prompt");
    btn.addEventListener("click", async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(STEP2_PROMPT);
        ok = true;
      } catch {
        // Clipboard API unavailable — fall back to selecting + execCommand,
        // and leave the text selected so manual copy still works.
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try { ok = document.execCommand("copy"); } catch {}
        sel.removeAllRanges();
      }
      btn.textContent = ok ? "Copied!" : "Press ⌘/Ctrl-C to copy";
      setTimeout(() => (btn.textContent = "Copy prompt"), 1800);
    });
    box.replaceChildren(btn, pre);
  });
}

// expose helpers so Claude-added code (here or in other files) can reuse them
window.IO = { $, $$, el, fetchState, saveState, activateTab };

// ---------- boot ----------
document.addEventListener("DOMContentLoaded", () => {
  wireTabs();
  $("#refreshBtn")?.addEventListener("click", () => location.reload());
  mountPromptBoxes();
  renderKingdoms();
  renderHistory();
  initMap();
  renderCharacter();
  renderTracker();
});
