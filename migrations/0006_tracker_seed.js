// Seeds the 'tracker' app_state key with Manfred Highrock's mid-session
// trackers. Rendered + edited by renderTracker() in js/app.js.
// ON CONFLICT DO NOTHING — once seeded, in-app edits win.

const tracker = {
  hp: { current: 30, total: 37 },
  scarredTalent: { die: 6, base: 6 },
  secondWindUsed: false,
  actionSurgeUsed: false,
  scarReplenishmentUsed: false,
  gp: 700,
  notes: "",
};

export default {
  id: "0006_tracker_seed",
  statements: [
    `INSERT INTO app_state (key, value, updated_at, updated_by)
     VALUES (
       'tracker',
       '${JSON.stringify(tracker).replace(/'/g, "''")}',
       '2026-06-09T00:00:00.000Z',
       'seed'
     )
     ON CONFLICT(key) DO NOTHING`,
  ],
};
