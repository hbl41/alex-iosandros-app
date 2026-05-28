// ========================================================
//  GET    /api/events/:id  — get one event
//  PUT    /api/events/:id  — upsert (full replace)
//  DELETE /api/events/:id  — delete
// ========================================================

import { handleError, json, readJson, requireDb, requireUser } from "../../lib/http.js";
import { getEvent, saveEvent, deleteEvent } from "../../lib/events.js";

export const onRequestGet = async ({ request, env, params }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    const event = await getEvent(db, params.id);
    return json({ event });
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
    const event = await saveEvent(db, { ...body, id: params.id }, user.email);
    return json({ event });
  } catch (error) {
    return handleError(error);
  }
};

export const onRequestDelete = async ({ request, env, params }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    await deleteEvent(db, params.id);
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
};
