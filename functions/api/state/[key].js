// ========================================================
//  GET  /api/state/:key  — read a singleton blob
//  PUT  /api/state/:key  — write a singleton blob
// ========================================================

import { handleError, json, readJson, requireDb, requireUser } from "../../lib/http.js";
import { getState, setState } from "../../lib/app-state.js";

export const onRequestGet = async ({ request, env, params }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    const value = await getState(db, params.key);
    return json({ key: params.key, value });
  } catch (error) {
    return handleError(error);
  }
};

export const onRequestPut = async ({ request, env, params }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    const body = await readJson(request);
    const value = await setState(db, params.key, body.value, user.email);
    return json({ key: params.key, value });
  } catch (error) {
    return handleError(error);
  }
};
