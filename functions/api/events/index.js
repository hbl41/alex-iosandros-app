// ========================================================
//  GET  /api/events    — list all campaign events
//  POST /api/events    — create or upsert an event
// ========================================================

import { handleError, json, readJson, requireDb, requireUser } from "../../lib/http.js";
import { listEvents, saveEvent } from "../../lib/events.js";

export const onRequestGet = async ({ request, env }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    const events = await listEvents(db);
    return json({ events });
  } catch (error) {
    return handleError(error);
  }
};

export const onRequestPost = async ({ request, env }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    const body = await readJson(request);
    const event = await saveEvent(db, body, user.email);
    return json({ event }, { status: body.id ? 200 : 201 });
  } catch (error) {
    return handleError(error);
  }
};
