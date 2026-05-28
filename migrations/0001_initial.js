// Tiny _health table so the health-check API has something to query.
// Later migrations add the real tables.

export default {
  id: "0001_initial",
  statements: [
    `CREATE TABLE IF NOT EXISTS _health (
      id INTEGER PRIMARY KEY,
      created_at TEXT NOT NULL
    )`,
    `INSERT INTO _health (id, created_at)
     VALUES (1, datetime('now'))
     ON CONFLICT(id) DO NOTHING`,
  ],
};
