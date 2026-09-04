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

function fmtMod(n) {
  return n >= 0 ? `+${n}` : `${n}`;
}

function charHeader(data) {
  const { names, summary, traits } = data;
  const summaryItems = [
    ["Class", `${summary.class} (${summary.subclass})`],
    ["Level", summary.level],
    ["Background", summary.background],
    ["AC", `${summary.ac} — ${summary.acNote}`],
    ["HP (max)", summary.hpTotal],
    ["Origin", summary.origin],
    ["Height / Weight", summary.heightWeight],
    ["Age", summary.age],
  ];
  return el(
    "div",
    { class: "char-card" },
    el("div", { class: "char-name" }, names.lorenthar),
    el("div", { class: "char-title" }, names.title),
    el(
      "div",
      { class: "char-aliases" },
      `Also known as: ${names.bos}, ${names.aliases.join(", ")}`
    ),
    el(
      "div",
      { class: "char-summary" },
      ...summaryItems.map(([label, val]) =>
        el("div", {}, el("strong", {}, label), String(val))
      )
    ),
    traits ? el("p", { class: "k-desc" }, traits) : null
  );
}

function backstorySection(data) {
  const textarea = el("textarea", {
    class: "backstory-box",
    placeholder: "Write Manfred's backstory here — personality, morals, flaws, history...",
  });
  textarea.value = data.backstory || "";
  const hint = el("div", { class: "save-hint" }, "");

  let saveTimeout;
  textarea.addEventListener("input", () => {
    hint.textContent = "Saving…";
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      data.backstory = textarea.value;
      const ok = await saveState("character", data);
      hint.textContent = ok ? "Saved." : "Couldn't save — check your connection.";
    }, 600);
  });

  return el(
    "div",
    { class: "char-card" },
    el("h2", {}, "Backstory"),
    el(
      "p",
      { class: "k-desc" },
      "Personality, morals, flaws, and history — edit anytime, it saves automatically."
    ),
    textarea,
    hint
  );
}

function abilityScoresSection(data) {
  return el(
    "div",
    { class: "char-card" },
    el("h2", {}, "Ability Scores"),
    el(
      "div",
      { class: "stat-grid" },
      ...data.attributes.map((a) =>
        el(
          "div",
          { class: "stat-card" },
          el("div", { class: "stat-abbr" }, a.abbr),
          el("div", { class: "stat-score" }, a.score),
          el("div", { class: "stat-detail" }, `Mod ${fmtMod(a.mod)}`),
          el(
            "div",
            { class: "stat-detail" },
            `Save ${fmtMod(a.save)}${a.saveNote ? ` (${a.saveNote})` : ""}`
          )
        )
      )
    )
  );
}

function skillsSection(data) {
  const groups = Object.entries(data.skills).map(([attr, list]) =>
    el(
      "div",
      { class: "skill-group" },
      el("h3", {}, attr),
      el(
        "ul",
        { class: "skill-list" },
        ...list.map((s) =>
          el("li", {}, el("span", {}, s.name), el("span", {}, fmtMod(s.bonus)))
        )
      )
    )
  );

  const notes = (data.skillNotes || []).map((n) =>
    el(
      "div",
      {},
      el("strong", {}, `${n.skill}: `),
      el("ul", {}, ...n.items.map((i) => el("li", {}, i)))
    )
  );

  return el(
    "div",
    { class: "char-card" },
    el("h2", {}, "Skills"),
    el("div", { class: "skills-grid" }, ...groups),
    notes.length ? el("div", { class: "skill-notes" }, ...notes) : null
  );
}

function weaponsSection(data) {
  const w = data.weapons;
  return el(
    "div",
    { class: "char-card" },
    el("h2", {}, "Weapons & Attacks"),
    el("p", { class: "k-desc" }, `Proficiencies: ${w.proficiencies}`),
    el(
      "table",
      { class: "data-table" },
      el(
        "thead",
        {},
        el(
          "tr",
          {},
          el("th", {}, "Weapon"),
          el("th", {}, "Attack"),
          el("th", {}, "Damage"),
          el("th", {}, "Notes")
        )
      ),
      el(
        "tbody",
        {},
        ...w.items.map((it) =>
          el(
            "tr",
            {},
            el("td", {}, it.name),
            el("td", {}, it.attack),
            el("td", {}, it.damage),
            el("td", {}, it.notes)
          )
        )
      )
    )
  );
}

function spellsSection(data, { omitIntro = false } = {}) {
  const st = data.scarredTalent;
  const sp = data.spells;
  return el(
    "div",
    { class: "char-card" },
    el("h2", {}, "Scarred Talent & Spells"),
    omitIntro ? null : el("p", { class: "k-desc" }, st.intro),
    omitIntro ? null : el("p", { class: "k-desc" }, st.dieRules),
    omitIntro ? null : el("p", { class: "k-desc" }, `Scar Replenishment: ${st.scarReplenishment}`),
    omitIntro ? null : el("p", { class: "k-desc" }, sp.note),
    el(
      "table",
      { class: "data-table" },
      el(
        "thead",
        {},
        el(
          "tr",
          {},
          el("th", {}, "Ability"),
          el("th", {}, "Bonus / Save"),
          el("th", {}, "Effect")
        )
      ),
      el(
        "tbody",
        {},
        ...sp.items.map((it) =>
          el(
            "tr",
            {},
            el("td", {}, it.name),
            el("td", {}, it.bonus),
            el("td", {}, it.effect)
          )
        )
      )
    )
  );
}

function equipmentSection(data) {
  if (!Array.isArray(data.equipment)) data.equipment = [];

  // One-time migration: fold the old plain-string inventory list into
  // the editable equipment entries (each gets an empty description).
  if (Array.isArray(data.inventory) && data.inventory.length) {
    for (const item of data.inventory) {
      data.equipment.push({ name: item, desc: "" });
    }
    data.inventory = [];
    saveState("character", data);
  }

  const persist = () => saveState("character", data);
  const list = el("div", { class: "equipment-list" });

  function renderItem(item, startInEdit) {
    const card = el("div", { class: "equipment-item" });

    const showView = () => {
      card.replaceChildren(
        ...[
          el("div", { class: "equipment-item-title" }, item.name || "(untitled)"),
          item.desc ? el("div", { class: "equipment-item-desc" }, item.desc) : null,
          el(
            "div",
            { class: "btn-row" },
            el("button", { class: "btn btn-small", onclick: showEdit }, "Edit"),
            el(
              "button",
              {
                class: "btn btn-small",
                onclick: async () => {
                  data.equipment.splice(data.equipment.indexOf(item), 1);
                  await persist();
                  renderList();
                },
              },
              "Delete"
            )
          ),
        ].filter(Boolean)
      );
    };

    function showEdit() {
      const titleInput = el("input", {
        class: "equipment-input",
        type: "text",
        placeholder: "Title",
        value: item.name || "",
      });
      const descInput = el("textarea", {
        class: "equipment-textarea",
        placeholder: "Description",
      });
      descInput.value = item.desc || "";

      card.replaceChildren(
        titleInput,
        descInput,
        el(
          "div",
          { class: "btn-row" },
          el(
            "button",
            {
              class: "btn btn-small",
              onclick: async () => {
                item.name = titleInput.value.trim();
                item.desc = descInput.value.trim();
                await persist();
                showView();
              },
            },
            "Save"
          ),
          el(
            "button",
            {
              class: "btn btn-small",
              onclick: async () => {
                if (startInEdit) {
                  data.equipment.splice(data.equipment.indexOf(item), 1);
                  await persist();
                  renderList();
                } else {
                  showView();
                }
              },
            },
            "Cancel"
          )
        )
      );
    }

    if (startInEdit) showEdit();
    else showView();

    return card;
  }

  function renderList() {
    list.replaceChildren(...data.equipment.map((item) => renderItem(item, false)));
  }
  renderList();

  const addBtn = el(
    "button",
    {
      class: "btn",
      onclick: () => {
        const item = { name: "", desc: "" };
        data.equipment.push(item);
        list.append(renderItem(item, true));
      },
    },
    "Add entry"
  );

  return el(
    "div",
    { class: "char-card" },
    el("h2", {}, "Equipment & Inventory"),
    list,
    addBtn
  );
}

function abilitiesSection(data) {
  return el(
    "div",
    { class: "char-card" },
    el("h2", {}, "Abilities & Traits"),
    el(
      "ul",
      { class: "ability-list" },
      ...data.abilitiesAndTraits.map((a) =>
        el("li", {}, el("strong", {}, `${a.name}: `), a.desc)
      )
    )
  );
}

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

  content.replaceChildren(
    charHeader(data),
    backstorySection(data),
    abilityScoresSection(data),
    skillsSection(data),
    spellsSection(data),
    equipmentSection(data),
    abilitiesSection(data)
  );
}

// Scarred Talent die sizes, smallest to largest. Shrinks toward d4 (then
// "Spent") on a max roll, grows back toward `base` on a roll of 1.
const DIE_LADDER = [4, 6, 8, 10, 12];

function dieLabel(die) {
  return die > 0 ? `d${die}` : "Spent";
}

function hpCard(data, charLevel, persist, refresh) {
  const display = el("div", { class: "hp-display" });
  const rollResult = el("div", { class: "roll-result" }, "");

  const updateDisplay = () => {
    display.replaceChildren(
      `${data.hp.current}`,
      el("span", { class: "hp-total" }, ` / ${data.hp.total}`)
    );
  };
  updateDisplay();

  const damageInput = el("input", {
    type: "number",
    class: "num-input",
    placeholder: "0",
  });

  const damageBtn = el(
    "button",
    {
      class: "btn btn-small",
      onclick: async () => {
        const damage = Number(damageInput.value) || 0;
        data.hp.current = data.hp.current - damage;
        damageInput.value = "";
        updateDisplay();
        await persist();
      },
    },
    "Confirm"
  );

  const damageRow = el(
    "div",
    { class: "tracker-row" },
    el("label", { class: "damage-label" }, "Damage Taken"),
    el("div", { class: "btn-row no-wrap" }, damageInput, damageBtn)
  );

  const secondWindBtn = el(
    "button",
    {
      class: "btn btn-small",
      disabled: data.secondWindUsed || null,
      onclick: async () => {
        const roll = Math.floor(Math.random() * 6) + 1;
        const healed = roll + charLevel;
        data.hp.current = data.hp.current + healed;
        data.secondWindUsed = true;
        updateDisplay();
        rollResult.textContent = `Second Wind: rolled ${roll} + ${charLevel} (level) = +${healed} HP.`;
        secondWindBtn.disabled = true;
        await persist();
      },
    },
    "Second Wind (1d6 + level)"
  );

  return el(
    "div",
    { class: "tracker-card" },
    el("h3", {}, "Hit Points"),
    display,
    damageRow,
    el("div", { class: "btn-row" }, secondWindBtn),
    rollResult
  );
}

function scarredTalentCard(data, persist) {
  const display = el("div", { class: "die-display" });
  const updateDisplay = () => {
    display.replaceChildren(
      dieLabel(data.scarredTalent.die),
      el("span", { class: "die-base" }, ` (starting d${data.scarredTalent.base})`)
    );
  };
  updateDisplay();

  const shrinkBtn = el(
    "button",
    {
      class: "btn btn-small",
      onclick: async () => {
        const idx = DIE_LADDER.indexOf(data.scarredTalent.die);
        data.scarredTalent.die = idx <= 0 ? 0 : DIE_LADDER[idx - 1];
        updateDisplay();
        await persist();
      },
    },
    "Rolled max → shrinks"
  );

  const growBtn = el(
    "button",
    {
      class: "btn btn-small",
      onclick: async () => {
        const idx = DIE_LADDER.indexOf(data.scarredTalent.die);
        const next = DIE_LADDER[Math.max(idx, 0) + (idx < 0 ? 0 : 1)] ?? data.scarredTalent.base;
        data.scarredTalent.die = Math.min(next, data.scarredTalent.base);
        updateDisplay();
        await persist();
      },
    },
    "Rolled 1 → grows"
  );

  const replenishBtn = el(
    "button",
    {
      class: "btn btn-small",
      disabled: data.scarReplenishmentUsed || null,
      onclick: async () => {
        data.scarredTalent.die = data.scarredTalent.base;
        data.scarReplenishmentUsed = true;
        updateDisplay();
        replenishBtn.disabled = true;
        await persist();
      },
    },
    "Scar Replenishment"
  );

  return el(
    "div",
    { class: "tracker-card" },
    el("h3", {}, "Scarred Talent Die"),
    display,
    el("div", { class: "btn-row" }, shrinkBtn, growBtn, replenishBtn),
    el("p", { class: "k-desc" }, "Bonus action, once per long rest: Scar Replenishment resets the die to its starting size.")
  );
}

function restCard(data, persist, refresh) {
  const actionSurgeRow = el(
    "label",
    { class: "tracker-row" },
    el("span", {}, "Action Surge used"),
    el("input", {
      type: "checkbox",
      checked: data.actionSurgeUsed || null,
      onchange: async (e) => {
        data.actionSurgeUsed = e.target.checked;
        await persist();
      },
    })
  );

  const shortRestBtn = el(
    "button",
    {
      class: "btn btn-small",
      onclick: async () => {
        data.secondWindUsed = false;
        data.actionSurgeUsed = false;
        await persist();
        refresh();
      },
    },
    "Short Rest"
  );

  const longRestBtn = el(
    "button",
    {
      class: "btn btn-small",
      onclick: async () => {
        data.hp.current = data.hp.total;
        data.scarredTalent.die = data.scarredTalent.base;
        data.secondWindUsed = false;
        data.actionSurgeUsed = false;
        data.scarReplenishmentUsed = false;
        await persist();
        refresh();
      },
    },
    "Long Rest"
  );

  return el(
    "div",
    { class: "tracker-card" },
    el("h3", {}, "Rest & Resources"),
    actionSurgeRow,
    el("p", { class: "k-desc" }, "Short rest resets Second Wind and Action Surge. Long rest also resets HP, the Scarred Talent die, and Scar Replenishment."),
    el("div", { class: "btn-row" }, shortRestBtn, longRestBtn)
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

  const charData = await fetchState("character");
  const charLevel = charData?.summary?.level ?? 1;
  const persist = () => saveState("tracker", data);
  const refresh = () => renderTracker();

  content.replaceChildren(
    ...[
      el(
        "div",
        { class: "tracker-grid" },
        hpCard(data, charLevel, persist, refresh),
        scarredTalentCard(data, persist),
        restCard(data, persist, refresh)
      ),
      charData ? abilityScoresSection(charData) : null,
      charData ? weaponsSection(charData) : null,
      charData ? spellsSection(charData, { omitIntro: true }) : null,
    ].filter(Boolean)
  );
}

// Clears every cookie this page can see (across likely paths) so the
// "Refresh" button truly reloads from scratch rather than from cached
// session state.
function clearAllCookies() {
  const paths = ["/", location.pathname, "."];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name) continue;
    for (const path of paths) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    }
  }
}

// The "Refresh" button must pull the latest deploy even when the browser
// is holding stale copies of the code. A plain location.reload() reuses
// the disk cache, so instead we clear cookies + any Cache Storage, then
// re-fetch the core files bypassing the HTTP cache (cache: "reload"),
// which overwrites the cached copies so the reload below serves the new
// version.
async function hardRefresh() {
  clearAllCookies();
  try {
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {}
  try {
    if (navigator.serviceWorker) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch {}
  const assets = [
    location.pathname,
    "index.html",
    "js/app.js",
    "css/style.css",
    "data/data.js",
  ];
  try {
    await Promise.all(assets.map((a) => fetch(a, { cache: "reload" }).catch(() => {})));
  } catch {}
  location.reload();
}

// ============================================================
//  NOTES  (player session notes, Claude notes, characters, search)
//  One "Notes" tab holds four inner sections that read/write three
//  state keys: notes, claudeNotes, characters.
// ============================================================

const uid = () =>
  crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`;

function stripHtml(html) {
  const d = el("div");
  d.innerHTML = html || "";
  return d.textContent || "";
}

// Case-insensitive-aware occurrence offsets of `find` within `text`.
function matchOffsets(text, find, matchCase) {
  const out = [];
  if (!find) return out;
  const hay = matchCase ? text : text.toLowerCase();
  const needle = matchCase ? find : find.toLowerCase();
  let i = hay.indexOf(needle);
  while (i !== -1) {
    out.push(i);
    i = hay.indexOf(needle, i + needle.length);
  }
  return out;
}

// Replace every occurrence of `find` with `repl` inside an HTML string,
// operating only on text nodes so formatting (bold, lists, etc.) is
// preserved. Matches are confined to a single text node.
function replaceAllInHtml(html, find, repl, matchCase) {
  const container = el("div");
  container.innerHTML = html || "";
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  let count = 0;
  const needle = matchCase ? find : (find || "").toLowerCase();
  for (const node of nodes) {
    const str = node.nodeValue;
    const hay = matchCase ? str : str.toLowerCase();
    if (!needle) continue;
    let res = "";
    let i = 0;
    let idx = hay.indexOf(needle);
    let c = 0;
    while (idx !== -1) {
      res += str.slice(i, idx) + repl;
      i = idx + needle.length;
      c++;
      idx = hay.indexOf(needle, i);
    }
    if (c > 0) {
      res += str.slice(i);
      node.nodeValue = res;
      count += c;
    }
  }
  return { html: container.innerHTML, count };
}

// Replace a single occurrence located at `offset` (a position in the
// note's plain text) with `repl`. Returns { ok, html }.
function replaceAtTextOffset(html, offset, findLen, repl) {
  const container = el("div");
  container.innerHTML = html || "";
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let acc = 0;
  let node;
  while ((node = walker.nextNode())) {
    const len = node.nodeValue.length;
    if (offset < acc + len) {
      const local = offset - acc;
      if (local + findLen > len) return { ok: false }; // spans nodes — skip
      node.nodeValue =
        node.nodeValue.slice(0, local) + repl + node.nodeValue.slice(local + findLen);
      return { ok: true, html: container.innerHTML };
    }
    acc += len;
  }
  return { ok: false };
}

// A contenteditable box with a basic formatting toolbar (bold, italic,
// bullet list). Autosaves via onChange (debounced) as the user types.
// onEdit fires immediately on any content change (used to drop search
// highlights the moment the user starts editing).
function notesEditor(initialHtml, onChange, onEdit) {
  const editor = el("div", {
    class: "notes-editor",
    contenteditable: "true",
    spellcheck: "true",
  });
  editor.innerHTML = initialHtml || "";

  const fmtBtn = (label, cmd, title) =>
    el(
      "button",
      {
        class: "btn btn-small fmt-btn",
        title,
        onmousedown: (e) => e.preventDefault(), // keep the selection
        onclick: () => {
          onEdit?.();
          editor.focus();
          document.execCommand(cmd, false, null);
          onChange(editor.innerHTML);
        },
      },
      label
    );

  const toolbar = el(
    "div",
    { class: "notes-toolbar" },
    fmtBtn("B", "bold", "Bold"),
    fmtBtn("I", "italic", "Italic"),
    fmtBtn("• List", "insertUnorderedList", "Bullet list")
  );

  let t;
  editor.addEventListener("input", () => {
    onEdit?.();
    clearTimeout(t);
    t = setTimeout(() => onChange(editor.innerHTML), 500);
  });

  return { toolbar, editor };
}

// A multi-session notebook: a strip of renamable session tabs plus the
// editor for the active one. Used for both "My Notes" and "Claude Notes".
function sessionNotebook(store, save, opts = {}) {
  if (!Array.isArray(store.sessions)) store.sessions = [];
  if (store.sessions.length === 0)
    store.sessions.push({ id: uid(), title: "Session 1", html: "" });
  if (!store.sessions.some((s) => s.id === store.activeId))
    store.activeId = store.sessions[0].id;

  const container = el("div", { class: "notebook" });
  let editingId = null;

  function render() {
    const active =
      store.sessions.find((s) => s.id === store.activeId) || store.sessions[0];
    store.activeId = active.id;

    const strip = el("div", { class: "session-tabs" });
    for (const s of store.sessions) {
      if (s.id === editingId) {
        const input = el("input", { class: "session-rename", value: s.title });
        let committed = false;
        const commit = () => {
          if (committed) return;
          committed = true;
          s.title = input.value.trim() || s.title;
          editingId = null;
          save();
          render();
        };
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") commit();
          else if (e.key === "Escape") {
            committed = true;
            editingId = null;
            render();
          }
        });
        input.addEventListener("blur", commit);
        strip.append(input);
        setTimeout(() => {
          input.focus();
          input.select();
        }, 0);
      } else {
        strip.append(
          el(
            "button",
            {
              class: "session-tab" + (s.id === active.id ? " active" : ""),
              title: "Click to open · double-click to rename",
              onclick: () => {
                store.activeId = s.id;
                save();
                render();
              },
              ondblclick: () => {
                editingId = s.id;
                render();
              },
            },
            s.title || "Untitled"
          )
        );
      }
    }
    strip.append(
      el(
        "button",
        {
          class: "session-tab add",
          title: opts.addLabel || "New session",
          onclick: () => {
            const s = {
              id: uid(),
              title: `Session ${store.sessions.length + 1}`,
              html: "",
            };
            store.sessions.push(s);
            store.activeId = s.id;
            save();
            render();
          },
        },
        "＋ New"
      )
    );

    const { toolbar, editor } = notesEditor(
      active.html,
      (html) => {
        active.html = html;
        save();
      },
      opts.onEdit
    );

    const renameBtn = el(
      "button",
      {
        class: "btn btn-small",
        onclick: () => {
          editingId = active.id;
          render();
        },
      },
      "Rename"
    );
    const delBtn = el(
      "button",
      {
        class: "btn btn-small",
        onclick: () => {
          if (store.sessions.length <= 1) return;
          if (!confirm(`Delete "${active.title}"? This can't be undone.`)) return;
          store.sessions = store.sessions.filter((x) => x.id !== active.id);
          store.activeId = store.sessions[0].id;
          save();
          render();
        },
      },
      "Delete session"
    );

    container.replaceChildren(
      ...[
        strip,
        opts.intro ? el("p", { class: "k-desc" }, opts.intro) : null,
        toolbar,
        editor,
        el("div", { class: "btn-row" }, renameBtn, delBtn),
      ].filter(Boolean)
    );

    // Re-apply search highlighting after a re-render (session switch,
    // rename, etc.). Only once the container is on screen — the first
    // render happens before it's mounted, and draw() handles that case.
    if (opts.onRerender && container.isConnected) opts.onRerender();
  }

  render();
  return container;
}

// A single running document (used for the Characters list).
function notesDoc(store, save, intro, onEdit) {
  const { toolbar, editor } = notesEditor(
    store.html || "",
    (html) => {
      store.html = html;
      save();
    },
    onEdit
  );
  return el(
    "div",
    { class: "notebook" },
    intro ? el("p", { class: "k-desc" }, intro) : null,
    toolbar,
    editor
  );
}

// Find & replace across every note. getEntries() returns the current
// searchable notes (with refs so replacements can be saved); navigate
// jumps to a match; hl is the shared highlight controller.
function searchPanel(getEntries, navigate, hl) {
  const MAX_ROWS = 50; // per-note match rows shown for individual replace

  const findInput = el("input", {
    type: "search",
    class: "search-input",
    placeholder: "Find…",
    value: hl.term,
  });
  const replaceInput = el("input", {
    type: "text",
    class: "search-input",
    placeholder: "Replace with…",
  });
  const caseChk = el("input", { type: "checkbox", checked: hl.matchCase || null });
  const scopeSel = el("select", { class: "scope-select" });
  const replaceAllBtn = el("button", { class: "btn btn-small" }, "Replace all");
  const results = el("div", { class: "search-results" });

  const scopedEntries = (entries) =>
    scopeSel.value && scopeSel.value !== "all"
      ? entries.filter((e) => e.key === scopeSel.value)
      : entries;

  const buildScopeOptions = (entries) => {
    const cur = scopeSel.value || "all";
    scopeSel.replaceChildren(
      el("option", { value: "all" }, "All notes"),
      ...entries.map((e) => el("option", { value: e.key }, e.label))
    );
    scopeSel.value = [...scopeSel.options].some((o) => o.value === cur) ? cur : "all";
  };

  const run = () => {
    const q = findInput.value.trim();
    const matchCase = caseChk.checked;
    hl.matchCase = matchCase;
    const entries = getEntries();
    buildScopeOptions(entries);
    const scoped = scopedEntries(entries);
    results.replaceChildren();
    if (!q) return;

    let total = 0;
    let notesWith = 0;
    const groups = [];
    for (const entry of scoped) {
      const text = entry.text;
      const offs = matchOffsets(text, q, matchCase);
      if (!offs.length) continue;
      notesWith++;
      total += offs.length;
      const group = el("div", { class: "search-group" });
      group.append(
        el(
          "button",
          { class: "search-src", onclick: () => navigate(entry) },
          `${entry.label} · ${offs.length} match${offs.length > 1 ? "es" : ""}`
        )
      );
      for (const h of offs.slice(0, MAX_ROWS)) {
        const s = Math.max(0, h - 40);
        const e = Math.min(text.length, h + q.length + 40);
        group.append(
          el(
            "div",
            { class: "search-snippet-row" },
            el(
              "div",
              { class: "search-snippet", onclick: () => navigate(entry) },
              s > 0 ? "… " : "",
              text.slice(s, h),
              el("mark", {}, text.slice(h, h + q.length)),
              text.slice(h + q.length, e),
              e < text.length ? " …" : ""
            ),
            el(
              "button",
              {
                class: "btn btn-small replace-one",
                title: "Replace this match",
                onclick: () => {
                  const res = replaceAtTextOffset(entry.ref.html, h, q.length, replaceInput.value);
                  if (res.ok) {
                    entry.ref.html = res.html;
                    entry.save();
                  }
                  run();
                  hl.refresh();
                },
              },
              "Replace"
            )
          )
        );
      }
      if (offs.length > MAX_ROWS)
        group.append(
          el("div", { class: "k-desc" }, `…and ${offs.length - MAX_ROWS} more (use Replace all).`)
        );
      groups.push(group);
    }
    results.append(
      el(
        "div",
        { class: "search-count" },
        total
          ? `${total} match${total > 1 ? "es" : ""} across ${notesWith} note${
              notesWith > 1 ? "s" : ""
            }`
          : "No matches."
      )
    );
    groups.forEach((g) => results.append(g));
  };

  const doReplaceAll = () => {
    const q = findInput.value.trim();
    if (!q) return;
    const matchCase = caseChk.checked;
    const repl = replaceInput.value;
    const scoped = scopedEntries(getEntries());
    let total = 0;
    let notes = 0;
    for (const e of scoped) {
      const c = matchOffsets(e.text, q, matchCase).length;
      if (c) {
        total += c;
        notes++;
      }
    }
    if (!total) return;
    if (
      !confirm(
        `Replace ${total} occurrence${total > 1 ? "s" : ""} of "${q}" with "${repl}" across ${notes} note${
          notes > 1 ? "s" : ""
        }? This can't be undone.`
      )
    )
      return;
    for (const e of scoped) {
      const res = replaceAllInHtml(e.ref.html, q, repl, matchCase);
      if (res.count > 0) {
        e.ref.html = res.html;
        e.save();
      }
    }
    run();
    hl.refresh();
  };

  let t;
  findInput.addEventListener("input", () => {
    hl.setTerm(findInput.value.trim());
    clearTimeout(t);
    t = setTimeout(run, 200);
  });
  caseChk.addEventListener("change", () => {
    hl.matchCase = caseChk.checked;
    run();
    hl.refresh();
  });
  scopeSel.addEventListener("change", run);
  replaceAllBtn.addEventListener("click", doReplaceAll);

  if (hl.term) run(); // restore state when returning to this section

  return el(
    "div",
    { class: "notebook" },
    el(
      "div",
      { class: "replace-bar" },
      findInput,
      replaceInput,
      el("label", { class: "case-toggle" }, caseChk, "Match case"),
      el("label", { class: "scope-wrap" }, "In: ", scopeSel),
      replaceAllBtn
    ),
    el(
      "p",
      { class: "k-desc" },
      "Find across your notes; use a match's Replace button for one at a time, or Replace all. Matches stay highlighted in your notes until you clear the Find box."
    ),
    results
  );
}

async function renderNotes() {
  const root = $("#notes-root");
  if (!root) return;

  const notes = (await fetchState("notes")) || {};
  const claudeNotes = (await fetchState("claudeNotes")) || {};
  const characters = (await fetchState("characters")) || {};

  const saveNotes = () => saveState("notes", notes);
  const saveClaude = () => saveState("claudeNotes", claudeNotes);
  const saveChars = () => saveState("characters", characters);

  let section = "mine";

  const nav = el("div", { class: "notes-nav" });
  const body = el("div", { class: "notes-body" });

  // Search-highlight controller. Highlights every match of the active
  // search term in whichever note is on screen, using the CSS Custom
  // Highlight API so the note's saved content is never modified. Stays
  // on across notes until the search box is cleared.
  const HL_NAME = "note-search";
  const hlSupported =
    typeof window !== "undefined" &&
    window.CSS &&
    CSS.highlights &&
    typeof Highlight !== "undefined";
  const hl = {
    term: "",
    matchCase: false,
    scrollNext: false,
    clear() {
      if (hlSupported) {
        try {
          CSS.highlights.delete(HL_NAME);
        } catch {}
      }
    },
    setTerm(t) {
      this.term = t;
      this.refresh();
    },
    refresh() {
      if (!hlSupported) return;
      const editor = body.querySelector(".notes-editor");
      if (!this.term || !editor) {
        this.clear();
        return;
      }
      const q = this.matchCase ? this.term : this.term.toLowerCase();
      const ranges = [];
      let first = null;
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const text = this.matchCase ? node.nodeValue : node.nodeValue.toLowerCase();
        let i = text.indexOf(q);
        while (i !== -1) {
          const r = document.createRange();
          r.setStart(node, i);
          r.setEnd(node, i + q.length);
          ranges.push(r);
          if (!first) first = r;
          i = text.indexOf(q, i + q.length);
        }
      }
      if (ranges.length) {
        CSS.highlights.set(HL_NAME, new Highlight(...ranges));
        if (this.scrollNext && first) {
          try {
            first.startContainer.parentElement?.scrollIntoView({
              block: "center",
              behavior: "smooth",
            });
          } catch {}
        }
      } else {
        this.clear();
      }
      this.scrollNext = false;
    },
  };
  const onEdit = () => hl.clear();

  const setSection = (s) => {
    section = s;
    draw();
  };

  const getEntries = () => {
    const entries = [];
    (notes.sessions || []).forEach((s) =>
      entries.push({
        key: `mine:${s.id}`,
        label: `My Notes · ${s.title || "Untitled"}`,
        text: stripHtml(s.html),
        section: "mine",
        sessionId: s.id,
        ref: s,
        save: saveNotes,
      })
    );
    (claudeNotes.sessions || []).forEach((s) =>
      entries.push({
        key: `claude:${s.id}`,
        label: `Claude Notes · ${s.title || "Untitled"}`,
        text: stripHtml(s.html),
        section: "claude",
        sessionId: s.id,
        ref: s,
        save: saveClaude,
      })
    );
    entries.push({
      key: "characters",
      label: "Characters",
      text: stripHtml(characters.html),
      section: "characters",
      ref: characters,
      save: saveChars,
    });
    return entries.filter((e) => e.text.trim());
  };

  const navigate = (entry) => {
    if (entry.section === "mine" && entry.sessionId) notes.activeId = entry.sessionId;
    if (entry.section === "claude" && entry.sessionId)
      claudeNotes.activeId = entry.sessionId;
    hl.scrollNext = true; // scroll to the first match in the note we open
    setSection(entry.section);
  };

  function draw() {
    const mk = (id, label) =>
      el(
        "button",
        {
          class: "notes-nav-btn" + (section === id ? " active" : ""),
          onclick: () => setSection(id),
        },
        label
      );
    nav.replaceChildren(
      mk("mine", "My Notes"),
      mk("claude", "Claude Notes"),
      mk("characters", "Characters"),
      mk("search", "🔍 Find & Replace")
    );

    if (section === "mine")
      body.replaceChildren(
        sessionNotebook(notes, saveNotes, {
          intro:
            "Your session notes — use ＋ New for each session, double-click a tab to rename it.",
          onEdit,
          onRerender: () => hl.refresh(),
        })
      );
    else if (section === "claude")
      body.replaceChildren(
        sessionNotebook(claudeNotes, saveClaude, {
          intro:
            "Session summaries written by Claude (≤1,000 words each). You can edit them too.",
          onEdit,
          onRerender: () => hl.refresh(),
        })
      );
    else if (section === "characters")
      body.replaceChildren(
        notesDoc(
          characters,
          saveChars,
          "Running list of characters Manfred has met and how they relate to him — up to 100 words per character, kept concise. Maintained by Claude; you can edit it too.",
          onEdit
        )
      );
    else body.replaceChildren(searchPanel(getEntries, navigate, hl));

    // Re-apply search highlighting to whatever note is now on screen
    // (the content is already mounted — replaceChildren is synchronous).
    hl.refresh();
  }

  root.replaceChildren(nav, body);
  draw();
}

// expose helpers so Claude-added code (here or in other files) can reuse them
window.IO = { $, $$, el, fetchState, saveState, activateTab };

// ---------- boot ----------
document.addEventListener("DOMContentLoaded", () => {
  wireTabs();
  $("#refreshBtn")?.addEventListener("click", (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = "↻ Refreshing…";
    hardRefresh();
  });
  renderKingdoms();
  renderHistory();
  initMap();
  renderCharacter();
  renderTracker();
  renderNotes();
});
