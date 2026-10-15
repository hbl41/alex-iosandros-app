// Adds +2 to the Sai's damage: "1d6 + DEX (+2 thrown)" -> "1d6 +2 + DEX
// (+2 thrown)". Targeted json_set on just that weapon's damage field,
// guarded on the weapon's name so it only fires while items[0] is the Sai.

export default {
  id: "0016_sai_plus2",
  statements: [
    `UPDATE app_state
     SET value = json_set(value, '$.weapons.items[0].damage', '1d6 +2 + DEX (+2 thrown) — piercing'),
         updated_at = '2026-10-14T00:00:00.000Z'
     WHERE key = 'character'
       AND json_extract(value, '$.weapons.items[0].name') = 'Sai (4)'`,
  ],
};
