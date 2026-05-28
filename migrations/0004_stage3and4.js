// campaign_events and app_state tables.
// campaign_events: in-game dated entries (year/month/day + text).
// app_state: generic key/value store for singleton blobs (notes, session
// trackers, character sheet, in-game date, etc.).

export default {
  id: "0004_stage3and4",
  statements: [
    `CREATE TABLE IF NOT EXISTS campaign_events (
      id         TEXT NOT NULL PRIMARY KEY,
      year       INTEGER NOT NULL,
      month_idx  INTEGER NOT NULL,
      day        INTEGER NOT NULL,
      text       TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT NOT NULL DEFAULT '',
      updated_by TEXT NOT NULL DEFAULT ''
    )`,
    `CREATE INDEX IF NOT EXISTS idx_events_date ON campaign_events(year, month_idx, day)`,
    `CREATE INDEX IF NOT EXISTS idx_events_created ON campaign_events(created_at)`,
    `CREATE TABLE IF NOT EXISTS app_state (
      key        TEXT NOT NULL PRIMARY KEY,
      value      TEXT NOT NULL DEFAULT 'null',
      updated_at TEXT NOT NULL,
      updated_by TEXT NOT NULL DEFAULT ''
    )`,
  ],
};
