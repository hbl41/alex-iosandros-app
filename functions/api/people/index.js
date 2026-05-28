// ========================================================
//  GET  /api/people    — list all people
//  POST /api/people    — create or upsert a person
// ========================================================

import { handleError, json, readJson, requireDb, requireUser } from "../../lib/http.js";
import { listPeople, savePerson } from "../../lib/people.js";

export const onRequestGet = async ({ request, env }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    const people = await listPeople(db);
    return json({ people });
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
    const person = await savePerson(db, body, user.email);
    return json({ person }, { status: body.id ? 200 : 201 });
  } catch (error) {
    return handleError(error);
  }
};
