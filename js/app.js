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

function spellsSection(data) {
  const st = data.scarredTalent;
  const sp = data.spells;
  return el(
    "div",
    { class: "char-card" },
    el("h2", {}, "Scarred Talent & Spells"),
    el("p", { class: "k-desc" }, st.intro),
    el("p", { class: "k-desc" }, st.dieRules),
    el("p", { class: "k-desc" }, `Scar Replenishment: ${st.scarReplenishment}`),
    el("p", { class: "k-desc" }, sp.note),
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

  const decBtn = el(
    "button",
    {
      class: "btn btn-small",
      onclick: async () => {
        data.hp.current = Math.max(0, data.hp.current - 1);
        updateDisplay();
        await persist();
      },
    },
    "−1 HP"
  );

  const incBtn = el(
    "button",
    {
      class: "btn btn-small",
      onclick: async () => {
        data.hp.current = Math.min(data.hp.total, data.hp.current + 1);
        updateDisplay();
        await persist();
      },
    },
    "+1 HP"
  );

  const secondWindBtn = el(
    "button",
    {
      class: "btn btn-small",
      disabled: data.secondWindUsed || null,
      onclick: async () => {
        const roll = Math.floor(Math.random() * 6) + 1;
        const healed = roll + charLevel;
        data.hp.current = Math.min(data.hp.total, data.hp.current + healed);
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
    el("div", { class: "btn-row" }, decBtn, incBtn, secondWindBtn),
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
      charData ? weaponsSection(charData) : null,
    ].filter(Boolean)
  );
}

// expose helpers so Claude-added code (here or in other files) can reuse them
window.IO = { $, $$, el, fetchState, saveState, activateTab };

// ---------- boot ----------
document.addEventListener("DOMContentLoaded", () => {
  wireTabs();
  $("#refreshBtn")?.addEventListener("click", () => location.reload());
  renderKingdoms();
  renderHistory();
  initMap();
  renderCharacter();
  renderTracker();
});
