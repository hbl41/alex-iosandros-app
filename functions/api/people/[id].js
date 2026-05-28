// ========================================================
//  GET    /api/people/:id  — fetch one person
//  PUT    /api/people/:id  — replace a person
//  PATCH  /api/people/:id  — partial update
//  DELETE /api/people/:id  — remove a person
// ========================================================

import { handleError, json, readJson, requireDb, requireUser } from "../../lib/http.js";
import { deletePerson, getPerson, patchPerson, savePerson } from "../../lib/people.js";

export const onRequestGet = async ({ request, env, params }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    const person = await getPerson(db, params.id);
    if (!person) return json({ error: "Person not found." }, { status: 404 });
    return json({ person });
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
    const person = await savePerson(db, { ...body, id: params.id }, user.email, params.id);
    return json({ person });
  } catch (error) {
    return handleError(error);
  }
};

export const onRequestPatch = async ({ request, env, params }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    const body = await readJson(request);
    const person = await patchPerson(db, params.id, body, user.email);
    if (!person) return json({ error: "Person not found." }, { status: 404 });
    return json({ person });
  } catch (error) {
    return handleError(error);
  }
};

export const onRequestDelete = async ({ request, env, params }) => {
  try {
    const user = requireUser(request, env);
    if (!user) return json({ error: "Authentication required." }, { status: 401 });

    const db = requireDb(env);
    const deleted = await deletePerson(db, params.id);
    if (!deleted) return json({ error: "Person not found." }, { status: 404 });
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
};
