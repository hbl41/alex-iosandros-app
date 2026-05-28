// ========================================================
//  DB operations for campaign_events.
//  Modeled on functions/lib/people.js.
// ========================================================

const now = () => new Date().toISOString();

function rowToEvent(row) {
  return {
    id:        row.id,
    year:      row.year,
    monthIdx:  row.month_idx,
    day:       row.day,
    text:      row.text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
  };
}

function validateEvent(input) {
  const text = String(input.text || '').trim().slice(0, 2000);
  if (!text) {
    const err = new Error('Event text is required.');
    err.status = 400;
    throw err;
  }
  const year = parseInt(input.year, 10);
  const monthIdx = parseInt(input.monthIdx ?? input.month_idx, 10);
  const day = parseInt(input.day, 10);
  if (isNaN(year) || isNaN(monthIdx) || isNaN(day)) {
    const err = new Error('year, monthIdx, and day are required integers.');
    err.status = 400;
    throw err;
  }
  return { text, year, monthIdx, day };
}

export async function getEvent(db, id) {
  const row = await db
    .prepare('SELECT * FROM campaign_events WHERE id = ?')
    .bind(id)
    .first();
  if (!row) {
    const err = new Error('Event not found.');
    err.status = 404;
    throw err;
  }
  return rowToEvent(row);
}

export async function listEvents(db) {
  const { results } = await db
    .prepare('SELECT * FROM campaign_events ORDER BY year, month_idx, day, created_at')
    .all();
  return (results || []).map(rowToEvent);
}

export async function saveEvent(db, input, userEmail, fallbackId) {
  const { text, year, monthIdx, day } = validateEvent(input);
  const id = String(input.id || fallbackId || crypto.randomUUID());
  const ts = now();

  const existing = await db
    .prepare('SELECT created_at, created_by FROM campaign_events WHERE id = ?')
    .bind(id)
    .first();

  await db
    .prepare(`
      INSERT INTO campaign_events (id, year, month_idx, day, text, created_at, updated_at, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        year = excluded.year,
        month_idx = excluded.month_idx,
        day = excluded.day,
        text = excluded.text,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by
    `)
    .bind(
      id, year, monthIdx, day, text,
      existing ? existing.created_at : ts,
      ts,
      existing ? existing.created_by : (userEmail || ''),
      userEmail || ''
    )
    .run();

  const row = await db
    .prepare('SELECT * FROM campaign_events WHERE id = ?')
    .bind(id)
    .first();
  return rowToEvent(row);
}

export async function deleteEvent(db, id) {
  const existing = await db
    .prepare('SELECT id FROM campaign_events WHERE id = ?')
    .bind(id)
    .first();
  if (!existing) {
    const err = new Error('Event not found.');
    err.status = 404;
    throw err;
  }
  await db.prepare('DELETE FROM campaign_events WHERE id = ?').bind(id).run();
}
