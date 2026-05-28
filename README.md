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
| **Coding guidelines** | A `CLAUDE.md` in the repo — Claude Code auto-loads it and works by its rules (think before coding, keep it simple, surgical edits). Scoped to this project, not your whole account. |

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

2. **Make an `Iosandros` folder** on your computer and gather your materials in it: your character sheet, plus any campaign info you have — history documents, your session-zero backstory, notes. Anything you want your site to know about Rojan and the world goes here.

3. **Step 1 — get set up.** Paste the **Step 1 prompt** (below) into [claude.ai](https://claude.ai). Claude walks you through installing Claude Code, connecting GitHub, and cloning this repo *into your Iosandros folder* — one step at a time.

4. **Step 2 — build your site.** Step 1 leaves you with Claude Code running inside the repo. Paste the **Step 2 prompt** (below). Claude reads your character sheet + notes from the Iosandros folder and builds your Character + Play Tracker pages.

5. **Step 3 — refine & expand (ongoing).** From here it's just conversation with Claude in the repo: restyle it (colors, fonts, the whole look), change the layout, add features, or add whole new pages — inventory, an NPC tracker, a quest log, whatever you want. No fixed prompt for this; just ask. When you're happy with a change, say "commit and push," then tap **↻ Refresh** to see it live.

6. **Something broken on the site itself?** Send Brady a screenshot — anything Cloudflare-side is his to fix, not yours.

---

## Step 1 prompt — get set up

Paste this into a new chat at [claude.ai](https://claude.ai). (This is the **website**, not Claude Code — you can't run Claude Code until this step installs it.)

````
I need to set up "Claude Code" (Anthropic's command-line tool) and connect
it to GitHub so it can edit my website's code AND push my changes back. I am
NOT technical — explain everything simply and go ONE STEP AT A TIME, waiting
for me to confirm each step worked before the next.

Details:
- My computer: (tell Claude — Mac or Windows)
- My GitHub repo: hbl41/alex-iosandros-app (I have a GitHub account and Brady
  added me as a collaborator)
- I already made a folder called "Iosandros" with my character sheet and
  campaign notes in it

Walk me through:
1. Installing Claude Code (claude.com/claude-code) and signing in
2. Installing git if I don't already have it
3. Installing the GitHub CLI (`gh`) and running `gh auth login` — when it
   asks "Authenticate Git with your GitHub credentials?", say YES. (This is
   what lets me push.)
4. Setting my git identity so commits work: `git config --global user.name`
   and `git config --global user.email` (my name + the email on my GitHub)
5. Cloning my repo INTO my "Iosandros" folder, so it ends up at
   Iosandros/alex-iosandros-app (alongside my character sheet and notes)
6. Starting Claude Code in the repo (`claude`), then confirming I can push by
   running `git push` — it should say "Everything up-to-date"

For each command, show me exactly what to type and what success looks like.
If I hit an error, help me fix it before moving on. By the end I should have
Claude Code running in my repo and a confirmed push — ready for Step 2.
````

---

## Step 2 prompt — build your site

Make sure your character sheet and notes are in the Iosandros folder (one level up from the repo). Then paste this into **Claude Code** (running in your repo from the end of Step 1):

````
I'm a player in the Iosandros D&D campaign — my character is Rojan. My
character sheet and any campaign notes are in this repo's parent folder (the
"Iosandros" folder, one level up). Read them.

This repo is my companion site, already deployed. Read README.md and
CLAUDE.md first — they explain how it's built and the ground rules. The
"two render hooks" and "Example: seeding the character sheet" sections of
README.md show exactly what to build.

Your job: build my two personal pages — Character and Play Tracker — from my
character sheet. The other three tabs (13 Kingdoms, History, Map) are already
done; leave them alone.

Start by asking me what I want on each page. Then build one piece at a time,
showing me as you go. When I'm happy, commit and push.
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
│   └── map.jpg            ← the Iosandros map (Map tab)
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

**Mac:** `git` comes with `xcode-select --install`. Easiest GitHub sign-in is the GitHub CLI: install [Homebrew](https://brew.sh) → `brew install gh` → `gh auth login` (GitHub.com → HTTPS → **say YES to "authenticate Git"** → browser). Set their identity: `git config --global user.name "..."` and `git config --global user.email "..."`. Then `cd` into their **Iosandros** folder, `gh repo clone hbl41/alex-iosandros-app`, `cd alex-iosandros-app`, `claude`.

**Windows:** [Git for Windows](https://git-scm.com/download/win) + [GitHub CLI](https://cli.github.com/) + Claude Code, then the same `gh auth login` (authenticate Git: yes) + `git config` identity + clone + `claude` flow in Git Bash, inside the Iosandros folder.

Confirm push access with `git push` — it should say "Everything up-to-date" (proves their credentials work). The player should end Step 1 with Claude Code running in their cloned repo (`Iosandros/alex-iosandros-app`), able to push, with their character sheet + notes one level up — ready for the Step 2 prompt.
