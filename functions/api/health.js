// ========================================================
//  GET /api/health
//  Confirms the D1 binding (PLAYER_DB) is reachable.
//  Returns { ok: true, db: true } on success.
// ========================================================

import { handleError, json, requireDb } from "../lib/http.js";

export const onRequestGet = async ({ env }) => {
  try {
    const db = requireDb(env);
    await db.prepare("SELECT 1").first();
    return json({ ok: true, db: true });
  } catch (error) {
    return handleError(error);
  }
};
