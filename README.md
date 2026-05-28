# Alex's Iosandros Companion Site

A personal companion site for **Rojan** in the Iosandros campaign — yours to build, hosted at `alex.iosandros.com` once Brady wires up Cloudflare. The shape is up to you: character sheet, NPC tracker, spell list, session notes, inventory, quest log — whatever helps mid-game.

You're not editing code by hand. You hand the repo + your character sheet to Claude, and Claude builds the site. This README is the orientation — read it once, then use the prompt at the bottom.

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

---

## What you do

Recommended path uses **Claude Code** — Claude's command-line tool that reads and writes files in a local repo and commits + pushes directly. No copy-paste, no GitHub web UI.

1. **Have a GitHub account.** If you don't, sign up at [github.com](https://github.com). Send Brady your username so he can invite you as a collaborator on `hbl41/alex-iosandros-app`. Accept the invite from the email GitHub sends.

2. **Install [Claude Code](https://claude.com/claude-code).** Sign in with your Anthropic account — Pro at $20/mo is the most cost-effective; free works for smaller chunks of work.

3. **Get your character sheet** in any format Claude can read — PDF, Google Doc export, screenshot, hand-typed text.

4. **Clone your repo** somewhere on your computer (you'll need [git](https://git-scm.com/downloads) if you don't have it):
   ```bash
   git clone https://github.com/hbl41/alex-iosandros-app.git
   cd alex-iosandros-app
   ```

5. **Drop your character sheet into that directory** (any filename works — `character.pdf`, `rojan.txt`, etc.).

6. **Start Claude Code** in the repo:
   ```bash
   claude
   ```

7. **Paste the [Starter Prompt](#starter-prompt) below** into the Claude Code chat. Claude reads the scaffold + your character sheet, asks what features you want, and generates the code in-place.

8. **Iterate** — tell Claude what's missing, what to change. When you're happy, say "commit and push." Cloudflare auto-deploys within ~1 minute — visit `alex.iosandros.com` to see it.

9. **Ping Brady** if anything on the Cloudflare side breaks. You handle code; Brady handles infrastructure.

> **Alternative paths if you don't want to install Claude Code:**
> - **GitHub connector in claude.ai** (Pro+): add GitHub as a connector inside a Project, authenticate, grant the repo. Claude reads/writes the repo from the chat. Verify in claude.ai's connector permissions whether the current connector supports commits — that varies by version.
> - **Manual copy-paste:** open the repo at [github.com/hbl41/alex-iosandros-app](https://github.com/hbl41/alex-iosandros-app), click **Add file** / **Edit** on each file Claude generates, paste, commit. Slowest path; use as last resort.

---

## Starter Prompt

Paste this verbatim into Claude Code after starting it in the repo directory (also works in a claude.ai chat with the repo connected/uploaded):

````
I'm a player in a D&D campaign called Iosandros. My character is Rojan.
My character sheet is in this directory — find it (look for a .pdf,
.txt, .md, image, etc.) or ask if you can't.

This repo contains the scaffold for my personal companion site —
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
- NPC roster (the people table exists but is empty — I can seed it from
  my own notes, or just add NPCs as we play)
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
    └── 0004_stage3and4.js
```

### D1 binding

The D1 database is bound as `env.PLAYER_DB` in every Pages Function. Always go through `requireDb(env)` from `functions/lib/http.js` — it throws a helpful 500 if the binding isn't configured.

### Existing tables

| Table | Purpose |
|---|---|
| `_health` | Trivial row for the health check. |
| `_migrations_log` | Tracks which migrations have been applied. Don't touch by hand. |
| `people` | Party + NPCs. Empty by default — seed via a migration or add through `/api/people`. |
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
