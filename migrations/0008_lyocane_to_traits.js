// Moves "Lyocane powder immunity" from the top-level traits line into
// its own entry in abilitiesAndTraits on the already-seeded 'character'
// row (0005 only inserts, it won't update).

export default {
  id: "0008_lyocane_to_traits",
  statements: [
    `UPDATE app_state
     SET value = json_set(
       json_remove(value, '$.traits'),
       '$.abilitiesAndTraits[#]',
       json('{"name":"Lyocane powder immunity","desc":"From your training in the brotherhood you have developed a tolerance to the deadly Lyocane powder."}')
     )
     WHERE key = 'character'
       AND json_extract(value, '$.traits') = 'Lyocane powder immunity'`,
  ],
};
