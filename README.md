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

Recommended path uses **Claude Code** — Claude's command-line tool that reads and writes files in a local repo and commits + pushes directly. No copy-paste, no GitHub web UI. (Never used a terminal? Jump to [First-time setup](#first-time-setup-non-coder-walkthrough) for a hand-held version.)

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

## First-time setup (non-coder walkthrough)

Never used a terminal? This is the one-time hump — about 15 minutes. After this, you just chat with Claude.

**Mac:**
1. Open **Terminal** (press cmd+Space, type "Terminal", Enter).
2. Install developer tools (gives you `git`): paste `xcode-select --install` and follow the prompt.
3. Install **Claude Code** from [claude.com/claude-code](https://claude.com/claude-code) and sign in.
4. Install the **GitHub CLI** for easy sign-in: get [Homebrew](https://brew.sh) first if you don't have it, then `brew install gh`, then `gh auth login` (choose GitHub.com → HTTPS → log in with a browser).
5. Go to your Desktop: `cd ~/Desktop`
6. Download your repo: `gh repo clone hbl41/alex-iosandros-app`
7. Open the folder: `cd alex-iosandros-app`
8. Put your character sheet in that folder (in Finder: Desktop → alex-iosandros-app).
9. Start Claude: `claude`
10. Paste the [Starter Prompt](#starter-prompt).

**Windows:** install [Git for Windows](https://git-scm.com/download/win), the [GitHub CLI](https://cli.github.com/), and Claude Code, then do steps 4–10 in the "Git Bash" terminal.

Stuck on a step? Send Brady a screenshot — this part is fiddly the first time and quick for him to unblock.
