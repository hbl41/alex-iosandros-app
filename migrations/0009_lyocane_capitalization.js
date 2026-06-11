// Fixes the capitalization of the "Lyocane Powder Immunity" entry added
// by 0008, in case that migration already ran with the old casing.

export default {
  id: "0009_lyocane_capitalization",
  statements: [
    `UPDATE app_state
     SET value = json_set(
       value,
       '$.abilitiesAndTraits',
       (
         SELECT json_group_array(
           CASE
             WHEN json_extract(e.value, '$.name') = 'Lyocane powder immunity'
             THEN json(json_set(e.value, '$.name', 'Lyocane Powder Immunity'))
             ELSE json(e.value)
           END
         )
         FROM json_each(app_state.value, '$.abilitiesAndTraits') AS e
       )
     )
     WHERE key = 'character'
       AND EXISTS (
         SELECT 1 FROM json_each(app_state.value, '$.abilitiesAndTraits') AS e
         WHERE json_extract(e.value, '$.name') = 'Lyocane powder immunity'
       )`,
  ],
};
