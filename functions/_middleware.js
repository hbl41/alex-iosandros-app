// Auto-run pending D1 migrations on cold start.
//
// Runs before every Pages Function request. On the first request after a
// fresh deploy, it ensures all migrations in migrations/index.js have
// been applied, recording each in _migrations_log so they don't re-run.
//
// Subsequent requests on the same isolate skip the check (the promise is
// cached in module scope). New isolates pick up where the last left off
// via _migrations_log.
//
// Migrations must be idempotent — if a migration crashes partway, the
// log row isn't written, so it'll retry on the next cold start.

import { MIGRATIONS } from "../migrations/index.js";

let migrationsPromise = null;

const ensureMigrations = async (db) => {
  await db.exec(
    `CREATE TABLE IF NOT EXISTS _migrations_log (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL)`
  );

  const { results } = await db
    .prepare("SELECT id FROM _migrations_log")
    .all();
  const applied = new Set((results || []).map((r) => r.id));

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) continue;
    try {
      await db.exec(migration.sql);
      await db
        .prepare(
          "INSERT INTO _migrations_log (id, applied_at) VALUES (?, ?)"
        )
        .bind(migration.id, new Date().toISOString())
        .run();
      console.log(`migration applied: ${migration.id}`);
    } catch (err) {
      console.error(`migration failed: ${migration.id}`, err);
      throw err;
    }
  }
};

export const onRequest = async (context) => {
  const db = context.env.PLAYER_DB;

  if (db && !migrationsPromise) {
    migrationsPromise = ensureMigrations(db).catch((err) => {
      // Reset so the next request can retry — otherwise a transient
      // failure permanently breaks the isolate.
      migrationsPromise = null;
      throw err;
    });
  }

  if (migrationsPromise) {
    await migrationsPromise;
  }

  return context.next();
};
