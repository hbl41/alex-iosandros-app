// Aggregates all migrations in order. The migration runner in
// functions/_middleware.js imports MIGRATIONS and applies any that
// haven't been recorded in the _migrations_log table yet.
//
// To add a new migration:
//   1. Create migrations/000N_your_name.js exporting { id, statements: [...] }
//   2. Import it here and append to MIGRATIONS in order
//
// Migrations should be idempotent (CREATE TABLE IF NOT EXISTS,
// ON CONFLICT DO NOTHING, etc.) so re-runs are safe.

import m0001 from "./0001_initial.js";
import m0002 from "./0002_people.js";
import m0004 from "./0004_stage3and4.js";

export const MIGRATIONS = [m0001, m0002, m0004];
