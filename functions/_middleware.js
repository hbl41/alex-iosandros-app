// Auto-run pending D1 migrations on cold start.
//
// Runs before every Pages Function request. On the first request after a
// fresh deploy, it ensures all migrations in migrations/index.js have
// been applied, recording each in _migrations_log so they don't re-run.
//
// Each migration's statements are batched into a single transaction so
// either all apply or none — if the batch fails, the log row isn't
// written and the migration will retry on the next cold start.
//
// Any error during middleware is caught and returned as a debuggable
// JSON 500 instead of crashing the worker.

import { MIGRATIONS } from "../migrations/index.js";

let migrationsPromise = null;

const ensureMigrations = async (db) => {
  await db.exec(
    "CREATE TABLE IF NOT EXISTS _migrations_log (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL)"
  );

  const { results } = await db
    .prepare("SELECT id FROM _migrations_log")
    .all();
  const applied = new Set((results || []).map((r) => r.id));

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) continue;

    const stmts = migration.statements.map((sql) => db.prepare(sql));
    stmts.push(
      db
        .prepare(
          "INSERT INTO _migrations_log (id, applied_at) VALUES (?, ?)"
        )
        .bind(migration.id, new Date().toISOString())
    );

    try {
      await db.batch(stmts);
      console.log(`migration applied: ${migration.id}`);
    } catch (err) {
      console.error(`migration failed: ${migration.id}`, err);
      throw new Error(
        `migration ${migration.id} failed: ${err.message || err}`
      );
    }
  }
};

export const onRequest = async (context) => {
  try {
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
  } catch (err) {
    return new Response(
      JSON.stringify(
        {
          error: "middleware",
          message: err.message || String(err),
          stack: err.stack,
        },
        null,
        2
      ),
      {
        status: 500,
        headers: { "content-type": "application/json; charset=utf-8" },
      }
    );
  }
};
