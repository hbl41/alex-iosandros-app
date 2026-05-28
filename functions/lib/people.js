// ========================================================
//  Business logic for the people table.
//  Validation, normalization, upsert, and row mapping.
//  Adapted from player-site-starter.
// ========================================================

const CATEGORIES = new Set(["Party", "Ally", "NPC", "Enemy", "Unknown"]);

const text = (value, max = 2000) => String(value || "").trim().slice(0, max);

const cleanId = (value) => {
  const id = text(value, 80);
  if (!id) return "";
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    const err = new Error("Person id may only contain letters, numbers, underscores, and hyphens.");
    err.status = 400;
    throw err;
  }
  return id;
};

const tags = (value) => {
  const source = Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  return Array.from(new Set(source.map((item) => text(item, 40)).filter(Boolean))).slice(0, 30);
};

const boolInt = (value) => (value === true || value === 1 || value === "1" ? 1 : 0);

const rowToPerson = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  role: row.role,
  notes: row.notes,
  tags: JSON.parse(row.tags || "[]"),
  isFavorite: Boolean(row.is_favorite),
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  createdBy: row.created_by,
  updatedBy: row.updated_by
});

// Normalize "Party Member" → "Party" (common alternate spelling)
const normalizeCategory = (value) => {
  const v = text(value || "NPC", 40);
  if (v.toLowerCase() === "party member") return "Party";
  return v;
};

const normalizePerson = (input = {}, fallbackId = "") => {
  const now = new Date().toISOString();
  const id = cleanId(input.id || fallbackId || crypto.randomUUID());
  const name = text(input.name, 140);
  const category = normalizeCategory(input.category);

  if (!name) {
    const err = new Error("Name is required.");
    err.status = 400;
    throw err;
  }

  if (!CATEGORIES.has(category)) {
    const err = new Error(`Category must be one of: ${Array.from(CATEGORIES).join(", ")}.`);
    err.status = 400;
    throw err;
  }

  return {
    id,
    name,
    category,
    role: text(input.role, 500),
    notes: text(input.notes, 12000),
    tags: JSON.stringify(tags(input.tags)),
    isFavorite: boolInt(input.isFavorite ?? input.is_favorite),
    sortOrder: Number.isFinite(Number(input.sortOrder ?? input.sort_order)) ? Number(input.sortOrder ?? input.sort_order) : 0,
    now
  };
};

export const listPeople = async (db) => {
  const { results } = await db
    .prepare(
      `SELECT *
       FROM people
       ORDER BY is_favorite DESC, sort_order ASC, lower(name) ASC`
    )
    .all();

  return results.map(rowToPerson);
};

export const getPerson = async (db, id) => {
  const row = await db.prepare("SELECT * FROM people WHERE id = ?").bind(cleanId(id)).first();
  return row ? rowToPerson(row) : null;
};

export const savePerson = async (db, input, userEmail, fallbackId = "") => {
  const person = normalizePerson(input, fallbackId);

  await db
    .prepare(
      `INSERT INTO people (
        id, name, category, role, notes, tags,
        is_favorite, sort_order, created_at, updated_at, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        role = excluded.role,
        notes = excluded.notes,
        tags = excluded.tags,
        is_favorite = excluded.is_favorite,
        sort_order = excluded.sort_order,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by`
    )
    .bind(
      person.id,
      person.name,
      person.category,
      person.role,
      person.notes,
      person.tags,
      person.isFavorite,
      person.sortOrder,
      person.now,
      person.now,
      userEmail,
      userEmail
    )
    .run();

  return getPerson(db, person.id);
};

export const patchPerson = async (db, id, input, userEmail) => {
  const existing = await getPerson(db, id);
  if (!existing) return null;
  return savePerson(db, { ...existing, ...input, id: existing.id }, userEmail, existing.id);
};

export const deletePerson = async (db, id) => {
  const result = await db.prepare("DELETE FROM people WHERE id = ?").bind(cleanId(id)).run();
  return result.meta.changes > 0;
};
