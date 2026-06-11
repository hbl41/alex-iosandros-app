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
import m0005 from "./0005_character_seed.js";
import m0006 from "./0006_tracker_seed.js";
import m0007 from "./0007_character_kunai_fix.js";
import m0008 from "./0008_lyocane_to_traits.js";

export const MIGRATIONS = [m0001, m0002, m0004, m0005, m0006, m0007, m0008];
