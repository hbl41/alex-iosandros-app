# Alex's Iosandros Companion Site

A personal companion site for **Rojan** in the Iosandros campaign, hosted at `alex.iosandros.com`. It ships with five standard pages — **Character, Play Tracker, 13 Kingdoms, History, Map**. The three world pages work out of the box; the Character and Play Tracker pages get personalized to your sheet when you run Claude. Add more pages later if you want.

You're not editing code by hand. You hand the repo + your character sheet to Claude, and Claude fills in the personal pages. This README is the orientation — read it once, then use the prompt at the bottom.

---

## What's already set up

You don't have to think about any of this — it's the scaffold Brady built:

| Piece | What it does |
|---|---|
| **Cloudflare Pages** | Hosts the site at `alex.iosandros.com`. Auto-deploys every time you push to GitHub. |
| **D1 database** (binding `PLAYER_DB`) | Server-side persistent storage — no localStorage. Changes like HP, FP, and notes save between sessions and across devices (phone, laptop, iPad — same data). |
| **Auto-migration runner** | When Claude adds a new table, the runner applies it on first request after deploy. You don't run anything by hand. |
| **Shared world data** | The 13 kingdoms, territories, prophecies, calendar, and in-world history are in `data/data.js` — read-only world canon. No character-specific data is pre-loaded (no NPC seed, no character sheet). |
| **Backend API** | `/api/people`, `/api/events/`, `/api/state/[key]`, `/api/health` already work. Claude wires the UI to these. |
| **Five standard pages** | Tab shell + the three world pages (13 Kingdoms, History, Map) are pre-built and identical across every player site. Character + Play Tracker are personalized to your sheet by Claude. |

---

## The five standard pages

Every player site ships with the same five tabs:

| Page | State | Where it comes from |
|---|---|---|
| **13 Kingdoms** | ✅ Works now | Renders from `data/data.js` — same world for every player |
| **History** | ✅ Works now | The in-world timeline from `data/data.js` |
| **Map** | ✅ Works now | `assets/map.jpg` — drag to pan, scroll to zoom |
| **Character** | ⬜ Claude fills in | Your sheet, rendered by `renderCharacter()` in `js/app.js` |
| **Play Tracker** | ⬜ Claude fills in | Your mid-session trackers (HP, resources, notes) via `renderTracker()` |

The two blank pages show a "not set up yet" message until you run Claude. The shell, styling, and the three world pages are already built — Claude's job is to fill the two personal pages from your character sheet (plus a migration that saves your sheet to the database).

---

## What you do

You'll paste two prompts into Claude — **Step 1** gets you set up, **Step 2** builds your site. Claude handles the technical parts; you mostly answer its questions. You're not expected to know any of this already.

1. **GitHub account.** No account? Sign up at [github.com](https://github.com). Then send Brady your username so he can add you as a collaborator on `hbl41/alex-iosandros-app`, and accept the invite GitHub emails you.

2. **Your character sheet** in any format Claude can read — PDF, Google Doc export, screenshot, hand-typed text.

3. **Step 1 — get set up.** Paste the **Step 1 prompt** (below) into [claude.ai](https://claude.ai). Claude walks you through installing Claude Code, connecting GitHub, and downloading your repo — one step at a time, waiting for you at each step.

4. **Step 2 — build your site.** Step 1 leaves you with Claude Code running inside your repo. Drop your character sheet into that folder and paste the **Step 2 prompt** (below). Claude reads your sheet and builds your Character + Play Tracker pages.

5. **Iterate.** Tell Claude what to change; when you're happy, say "commit and push." Your live site updates in ~1 minute — tap **↻ Refresh** on it to see the change.

6. **Something broken on the site itself?** Send Brady a screenshot — anything Cloudflare-side is his to fix, not yours.

---

## Step 1 prompt — get set up

Paste this into a new chat at [claude.ai](https://claude.ai). (This is the **website**, not Claude Code — you can't run Claude Code until this step installs it.)

````
I need to set up "Claude Code" (Anthropic's command-line tool) and connect
it to GitHub so it can edit my website's code. I am NOT technical — explain
everything simply and go ONE STEP AT A TIME, waiting for me to confirm each
step worked before giving me the next.

Details:
- My computer: (tell Claude — Mac or Windows)
- My GitHub repo: hbl41/alex-iosandros-app (I already have a GitHub account
  and Brady added me as a collaborator)

Walk me through:
1. Installing Claude Code (claude.com/claude-code) and signing in
2. Installing git if I don't already have it
3. Signing in to GitHub from the terminal — the `gh` GitHub CLI is easiest;
   help me install it and run `gh auth login`
4. Downloading my repo to my Desktop (clone it)
5. Opening the repo folder and starting Claude Code inside it (`claude`)

For each command, show me exactly what to type and what I should see if it
worked. If I hit an error, help me fix it before moving on. By the end I
should have Claude Code running inside my repo, ready for Step 2.
````

---

## Step 2 prompt — build your site

First drop your character sheet into the repo folder. Then paste this into **Claude Code** (running in your repo from the end of Step 1):

````
I'm a player in a D&D campaign called Iosandros. My character is Rojan.
My character sheet is in this directory — find it (look for a .pdf,
.txt, .md, image, etc.) or ask if you can't.

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
   sheet to decide what to track — don't assume another character's
   resources (no Ring of Discernment / Negotiation Budget unless I have
   them).

Before you start, ASK me:
- What's on my character sheet (confirm you parsed it correctly)
- What I want on the Play Tracker specifically
- Whether I want any extra pages beyond the standard five (inventory, an
  NPC roster via the existing /api/people endpoints, quest log, etc.)

Keep migrations idempotent (ON CONFLICT DO NOTHING). Match the existing
vanilla HTML/JS style — no frameworks. Walk me through big changes before
making them; one thing at a time.
````

---

## Architecture reference

(Mainly for Claude. Skim if you're curious.)

### File layout

```
alex-iosandros-app/
├── README.md              ← you are here
├── index.html             ← tab shell: the 5 standard pages
├── _headers               ← Cloudflare Pages headers config
├── css/
│   └── style.css          ← base styling + tab/card/timeline/map styles
├── js/
│   └── app.js             ← tab nav + world renderers + renderCharacter/renderTracker hooks
├── assets/
│   ├── map.jpg            ← the Iosandros map (Map tab)
│   └── map_colorfill.jpg  ← lighter-weight alternate map
├── data/
│   ├── data.js            ← shared world canon (kingdoms, territories, history, prophecies, calendar)
│   ├── playbook.js        ← house-rules reference (not wired to a page yet)
│   └── regions.json       ← map region polygons (unused in v1)
├── functions/             ← Cloudflare Pages Functions (backend)
│   ├── _middleware.js     ← runs migrations on cold start
│   ├── api/               ← REST endpoints (health, people, events, state)
│   └── lib/               ← shared helpers (DO use these): http, people, events, app-state
└── migrations/            ← D1 schema, auto-applied on deploy
    ├── index.js           ← aggregates migrations in order
    ├── 0001_initial.js
    ├── 0002_people.js
    └── 0004_stage3and4.js
```

### The two render hooks

`js/app.js` builds the three world pages itself. The two personal pages are left for Claude:

- `renderCharacter()` — already fetches the `character` state; fill the body to render the sheet.
- `renderTracker()` — already fetches the `tracker` state; fill the body with mid-session controls. Save edits with `saveState('tracker', next)`.

Helpers exposed for use in those functions (and any files Claude adds): `window.IO = { $, $$, el, fetchState, saveState, activateTab }`.

### D1 binding

The D1 database is bound as `env.PLAYER_DB` in every Pages Function. Always go through `requireDb(env)` from `functions/lib/http.js` — it throws a helpful 500 if the binding isn't configured.

### Existing tables

| Table | Purpose |
|---|---|
| `_health` | Trivial row for the health check. |
| `_migrations_log` | Tracks which migrations have been applied. Don't touch by hand. |
| `people` | Party + NPCs. Empty by default — seed via a migration or add through `/api/people`. |
| `campaign_events` | In-game dated entries. CRUD via `/api/events`. |
| `app_state` | Key/value singletons (`character`, `tracker`, `notes`, `session`, `date`, `budget`, `advantage`, `kingdomFilter`). Get/set via `/api/state/[key]`. |

The allowed `app_state` keys are gated by `ALLOWED_KEYS` in `functions/lib/app-state.js` — add to that set when you introduce a new key.

### Adding a new D1 table

1. Create `migrations/000N_<name>.js` exporting `{ id, statements: [...] }` (an array of single SQL statements — see existing migrations). Use `CREATE TABLE IF NOT EXISTS`.
2. Import it in `migrations/index.js` and append to the `MIGRATIONS` array.
3. Push to GitHub. On the next deploy, the first request triggers the migration runner, which applies pending migrations in order and records each in `_migrations_log`.

### API conventions

- Endpoint files use `onRequestGet`, `onRequestPost`, etc. (Cloudflare Pages Functions naming).
- Always use the helpers in `functions/lib/http.js`: `json()`, `handleError()`, `requireDb()`, `requireUser()`, `readJson()`.
- Wrap handlers in `try/catch` and return `handleError(error)` on throw.
- Validation lives in `functions/lib/*.js` next to the relevant table.

### Auth

The backend reads the user identity from Cloudflare Access headers (`cf-access-authenticated-user-email` or a JWT cookie). Brady will turn CF Access on for `alex.iosandros.com` so only you can write to your D1. You don't need to do anything for auth — just know it's there.

---

## Example: seeding the character sheet

When Claude generates your first migration to put your character data into `app_state`, it should look like this (modeled on Brady's Caeto seed):

```js
// migrations/0005_character_seed.js
export default {
  id: "0005_character_seed",
  statements: [
    `INSERT INTO app_state (key, value, updated_at, updated_by)
     VALUES (
       'character',
       '<JSON.stringify(rojanCharacterSheet) — escape single quotes by doubling them>',
       '<ISO timestamp>',
       'seed'
     )
     ON CONFLICT(key) DO NOTHING`,
  ],
};
```

Then append `import m0005 from "./0005_character_seed.js";` and add `m0005` to the `MIGRATIONS` array in `migrations/index.js`.

The `ON CONFLICT(key) DO NOTHING` is intentional: once the row exists, future edits made through the app's UI won't be overwritten by a re-run of the seed.

---

## When something breaks

| Problem | Who fixes |
|---|---|
| Site not loading at all | Brady (Cloudflare / DNS) |
| `/api/health` returns 500 about `PLAYER_DB` | Brady (D1 binding not configured) |
| Migration failed on deploy | You — read the error in Cloudflare logs, fix the migration file, push again |
| Bad UI bug | You + Claude — describe what's broken, ask Claude to fix |
| Auth not working | Brady (CF Access config) |
| Want a new feature | You + Claude |

Cloudflare logs for your site live at [dash.cloudflare.com](https://dash.cloudflare.com) under Workers & Pages → alex-iosandros-app → **Logs**. Brady can grant you read access if you want to debug yourself.

---

## Setup help (for Claude, in Step 1)

When a player runs the Step 1 prompt, here's the reference for walking them through it — they are non-technical, so go one step at a time and confirm each worked.

**Mac:** `git` comes with `xcode-select --install`. Easiest GitHub sign-in is the GitHub CLI: install [Homebrew](https://brew.sh) → `brew install gh` → `gh auth login` (GitHub.com → HTTPS → browser). Then `gh repo clone hbl41/alex-iosandros-app`, `cd alex-iosandros-app`, `claude`.

**Windows:** [Git for Windows](https://git-scm.com/download/win) + [GitHub CLI](https://cli.github.com/) + Claude Code, then the same `gh auth login` / clone / `claude` flow in Git Bash.

The player should end Step 1 with Claude Code running inside their cloned repo, ready to paste the Step 2 prompt.
