// Removes the "(lost one kunai)" note from the equipment entry on the
// already-seeded 'character' row (0005 only inserts, it won't update).

export default {
  id: "0007_character_kunai_fix",
  statements: [
    `UPDATE app_state
     SET value = json_remove(value, '$.equipment[2].desc')
     WHERE key = 'character'
       AND json_extract(value, '$.equipment[2].name') = '4 Sai and 2 Kunai'`,
  ],
};
