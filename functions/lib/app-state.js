// ========================================================
//  DB operations for app_state (generic key/value store).
//  Each row is a named singleton blob stored as JSON text.
// ========================================================

const now = () => new Date().toISOString();

const ALLOWED_KEYS = new Set([
  'notes',
  'session',
  'date',
  'budget',
  'advantage',
  'kingdomFilter',
  'character',
  'tracker',
]);

export function validateKey(key) {
  if (!ALLOWED_KEYS.has(key)) {
    const err = new Error(`Unknown state key: ${key}`);
    err.status = 400;
    throw err;
  }
}

export async function getState(db, key) {
  validateKey(key);
  const row = await db
    .prepare('SELECT value FROM app_state WHERE key = ?')
    .bind(key)
    .first();
  if (!row) return null;
  try {
    return JSON.parse(row.value);
  } catch {
    return row.value;
  }
}

export async function setState(db, key, value, userEmail) {
  validateKey(key);
  const serialized = JSON.stringify(value);
  const ts = now();
  await db
    .prepare(`
      INSERT INTO app_state (key, value, updated_at, updated_by)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by
    `)
    .bind(key, serialized, ts, userEmail || '')
    .run();
  return value;
}
