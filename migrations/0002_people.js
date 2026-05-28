// people table for Party & Campaign NPCs.
// Fields mirror the shape used by the app + audit fields.

export default {
  id: "0002_people",
  statements: [
    `CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'NPC',
      role TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      notes TEXT NOT NULL DEFAULT '',
      is_favorite INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT NOT NULL DEFAULT '',
      updated_by TEXT NOT NULL DEFAULT ''
    )`,
    `CREATE INDEX IF NOT EXISTS idx_people_category ON people(category)`,
    `CREATE INDEX IF NOT EXISTS idx_people_favorite ON people(is_favorite)`,
    `CREATE INDEX IF NOT EXISTS idx_people_sort ON people(sort_order, lower(name))`,
  ],
};
