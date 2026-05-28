# Alex's Iosandros Companion Site

A personal companion site for **Rojan** in the Iosandros campaign — yours to build, hosted at `alex.iosandros.com` once Brady wires up Cloudflare. The shape is up to you: character sheet, NPC tracker, spell list, session notes, inventory, quest log — whatever helps mid-game.

You're not editing code by hand. You hand the repo + your character sheet to Claude, and Claude builds the site. This README is the orientation — read it once, then use the prompt at the bottom.

---

## What's already set up

You don't have to think about any of this — it's the scaffold Brady built:

| Piece | What it does |
|---|---|
| **Cloudflare Pages** | Hosts the site at `alex.iosandros.com`. Auto-deploys every time you push to GitHub. |
| **D1 database** (binding `PLAYER_DB`) | Persistent storage. Everything you write to the site survives. |
| **Auto-migration runner** | When Claude adds a new table, the runner applies it on first request after deploy. You don't run anything by hand. |
| **Shared world data** | The 13 kingdoms, prophecies, calendar, and history are in `data/data.js`. The party + named NPCs are seeded in the `people` table. |
| **Backend API** | `/api/people`, `/api/events/`, `/api/state/[key]`, `/api/health` already work. Claude wires the UI to these. |

---

## What you do

1. **Get your character sheet** in any format Claude can read — PDF, Google Doc export, photo, screenshot, hand-typed text.

2. **Open [claude.ai](https://claude.ai)** (Pro $20/mo recommended; free works in shorter sessions). Click **Projects** → **New project** → name it "Rojan Site" or similar.

3. **Upload context** to the project:
   - This entire repo as a `.zip` (download from GitHub → "Code" → "Download ZIP"), OR
   - Just the files Claude needs: `README.md`, `data/data.js`, `migrations/index.js`, all files in `functions/`
   - Your character sheet

4. **Paste the Starter Prompt** below into a new chat in that project. Claude will read the scaffold, ask what features you want, and start generating files.

5. **Iterate** — tell Claude what's missing, what to change, what to add. The site reshapes around your asks.

6. **Push your changes to GitHub**:
   - Open your repo at [github.com/hbl41/alex-iosandros-app](https://github.com/hbl41/alex-iosandros-app)
   - For each file Claude generated: click **Add file** → **Create new file** (or click the existing file and **Edit**) → paste contents → **Commit changes**
   - Cloudflare auto-deploys within ~1 minute
   - Visit `alex.iosandros.com` — your site is live

7. **Ping Brady** if anything on the Cloudflare side breaks. You handle code; Brady handles infrastructure.

> Faster option for code-comfortable folks: install [Claude Code](https://claude.com/claude-code), `git clone` the repo, and let Claude Code commit + push directly. Skip the copy-paste dance.

---

## Starter Prompt

Paste this verbatim into a new claude.ai chat inside your project:

````
I'm a player in a D&D campaign called Iosandros. My character is Rojan
(see attached character sheet).

This Project contains the scaffold for my personal companion site —
already deployed to alex.iosandros.com on Cloudflare Pages with a D1
database wired up. The architecture is in README.md; read it before
generating anything.

Quick orientation:
- env.PLAYER_DB is the D1 binding
- New tables go in migrations/000N_*.js (see existing migrations for shape)
  and get appended to migrations/index.js — the runner applies them on
  the next deploy
- Backend conventions live in functions/lib/http.js (json, requireDb,
  handleError, requireUser)
- Shared world data lives in data/data.js — read-only reference
- index.html is currently a placeholder — overwrite it freely

Before generating anything, ASK me what I want my site to include. Some
options to surface:
- Character sheet view (what fields matter to me)
- NPC roster (the people table is already seeded — just needs a UI)
- Spell list / abilities tracker
- Inventory
- Session notes / scratchpad
- In-game calendar
- Quest log / threads
- Kingdom reference (data/data.js already has the 13)
- Anything else I want

After I tell you what I want, generate:
- A 0005_character_seed.js migration that puts my character sheet into
  app_state (see the "Example: seeding the character sheet" section of
  README.md for the shape)
- Any other migrations new features need
- Any new API endpoints under functions/api/
- The frontend (index.html, plus any js/css/ files you want to add)

Match the style of the existing files. Keep migrations idempotent
(CREATE TABLE IF NOT EXISTS, ON CONFLICT DO NOTHING). Don't pull in
heavy frameworks — vanilla HTML + JS is fine, matches the deploy model.
````

---

## Architecture reference

(Mainly for Claude. Skim if you're curious.)

### File layout

```
alex-iosandros-app/
├── README.md              ← you are here
├── index.html             ← UI entry point (overwrite freely)
├── _headers               ← Cloudflare Pages headers config
├── data/
│   ├── data.js            ← shared world lore (read-only reference)
│   ├── playbook.js        ← house-rules reference
│   └── regions.json       ← region data
├── functions/             ← Cloudflare Pages Functions (backend)
│   ├── _middleware.js     ← runs migrations on cold start
│   ├── api/               ← REST endpoints
│   │   ├── health.js
│   │   ├── people/
│   │   ├── events/
│   │   └── state/
│   └── lib/               ← shared helpers (DO use these)
│       ├── http.js
│       ├── people.js
│       ├── events.js
│       └── app-state.js
└── migrations/            ← D1 schema, auto-applied on deploy
    ├── index.js           ← aggregates migrations in order
    ├── 0001_initial.js
    ├── 0002_people.js
    ├── 0003_seed_people.js
    └── 0004_stage3and4.js
```

### D1 binding

The D1 database is bound as `env.PLAYER_DB` in every Pages Function. Always go through `requireDb(env)` from `functions/lib/http.js` — it throws a helpful 500 if the binding isn't configured.

### Existing tables

| Table | Purpose |
|---|---|
| `_health` | Trivial row for the health check. |
| `_migrations_log` | Tracks which migrations have been applied. Don't touch by hand. |
| `people` | Party + NPCs. Seeded shared roster. CRUD via `/api/people`. |
| `campaign_events` | In-game dated entries. CRUD via `/api/events`. |
| `app_state` | Key/value singletons (`character`, `notes`, `session`, `date`, `budget`, `advantage`, `kingdomFilter`). Get/set via `/api/state/[key]`. |

The allowed `app_state` keys are gated by `ALLOWED_KEYS` in `functions/lib/app-state.js` — add to that set when you introduce a new key.

### Adding a new D1 table

1. Create `migrations/000N_<name>.js` exporting `{ id, sql }`. Match the shape of the existing migrations. Use `CREATE TABLE IF NOT EXISTS`.
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
  sql: `
    INSERT INTO app_state (key, value, updated_at, updated_by)
    VALUES (
      'character',
      '<JSON.stringify(rojanCharacterSheet) — escape single quotes by doubling them>',
      '<ISO timestamp>',
      'seed'
    )
    ON CONFLICT(key) DO NOTHING;
  `,
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
