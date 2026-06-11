// Seeds the 'character' app_state key with Manfred Highrock's sheet.
// Rendered by renderCharacter() in js/app.js.
// ON CONFLICT DO NOTHING — once seeded, in-app edits (e.g. backstory) win.

const character = {
  names: {
    lorenthar: "Manfred Highrock",
    bos: "Endrun Ukinri-Sol",
    aliases: ["Rodian Mazon", "Helmholt Aldon"],
    title: "Dark Knight of Lorenthar",
  },
  summary: {
    level: 4,
    class: "Fighter",
    subclass: "Scarred Knight",
    background: "Urchin",
    ac: 16,
    acNote: "Unarmored: 10 + DEX (13)",
    hpTotal: 37,
    heightWeight: "5'5\" / 155 lb",
    age: "19 — born 1205 SE",
    origin: "Lorenthar",
  },
  traits: "",
  backstory: "",
  attributes: [
    { abbr: "STR", name: "Strength", score: 12, mod: 1, save: 1, saveNote: "+2 prof" },
    { abbr: "DEX", name: "Dexterity", score: 16, mod: 3, save: 3 },
    { abbr: "CON", name: "Constitution", score: 12, mod: 1, save: 1, saveNote: "+2 prof" },
    { abbr: "INT", name: "Intelligence", score: 14, mod: 2, save: 2 },
    { abbr: "WIS", name: "Wisdom", score: 14, mod: 2, save: 2 },
    { abbr: "CHA", name: "Charisma", score: 8, mod: -1, save: -1 },
  ],
  skills: {
    DEX: [
      { name: "Acrobatics", bonus: 5 },
      { name: "Aerial", bonus: 3 },
      { name: "Sleight of Hand", bonus: 5 },
      { name: "Stealth", bonus: 5 },
    ],
    INT: [
      { name: "Blood Magic", bonus: 2 },
      { name: "History/Culture", bonus: 2 },
      { name: "Investigation", bonus: 2 },
      { name: "Logistics", bonus: 2 },
      { name: "Nature", bonus: 2 },
      { name: "Memory/Recall", bonus: 2 },
    ],
    WIS: [
      { name: "Animal Handling", bonus: 2 },
      { name: "Insight", bonus: 2 },
      { name: "Field Strategy", bonus: 2 },
      { name: "Grand Strategy", bonus: 2 },
      { name: "Medicine", bonus: 2 },
      { name: "Perception", bonus: 4 },
      { name: "Passive Perception", bonus: 2 },
      { name: "Survival", bonus: 9 },
    ],
    STR: [
      { name: "Athletics", bonus: 1 },
      { name: "Passive Strength", bonus: 1 },
    ],
    CHA: [
      { name: "Deception", bonus: -1 },
      { name: "Diplomacy", bonus: -1 },
      { name: "Intimidation", bonus: -1 },
      { name: "Networking", bonus: -1 },
      { name: "Performance", bonus: -1 },
      { name: "Persuasion", bonus: -1 },
    ],
  },
  skillNotes: [
    { skill: "Diplomacy", items: ["Etiquette", "Negotiations"] },
    { skill: "Networking", items: ["Gather info", "Make friends"] },
  ],
  weapons: {
    proficiencies: "San'Zori weapons (ninja weapons) and bows/crossbows",
    items: [
      { name: "Sai (4)", attack: "DEX", damage: "1d6 + DEX (+2 thrown) — piercing", notes: "Range 50/500 if thrown" },
      { name: "Kunai (3)", attack: "DEX", damage: "1d4 (+2 thrown) — piercing", notes: "Can target 3 enemies per use · Range 40/400" },
      { name: "Unarmed strikes", attack: "DEX", damage: "2 + DEX", notes: "Highly trained in most forms of unarmed combat" },
    ],
  },
  scarredTalent: {
    intro:
      "At 3rd level you gained a set of blood magic abilities, fueled by a Scarred Talent die (starting size d6 at this level — d8 at 5th, d10 at 11th, d12 at 17th).",
    dieRules:
      "Roll the highest number on the die: it shrinks one size (d6→d4→unusable) until your next long rest. Roll a 1: it grows one size back up, to a max of its starting size.",
    scarReplenishment:
      "Bonus action, once per long rest: restore the die to its starting size.",
  },
  spells: {
    note: "Ranged spell attacks use DEX + proficiency. Save DCs are listed per ability where relevant.",
    items: [
      {
        name: "Protective Field",
        bonus: "Reaction",
        effect:
          "When you or a creature within 30 ft. takes damage, roll your Scarred Talent die and reduce the damage by that result + your INT modifier (minimum 1).",
      },
      {
        name: "Blood-Powered Leap",
        bonus: "—",
        effect:
          "On a high or long jump, roll your Scarred Talent die and extend the jump by up to (2 × roll) + (2 × INT mod) feet, minimum 1 extra foot, for only 1 extra foot of movement.",
      },
      {
        name: "Telekinetic Strike",
        bonus: "Ranged attack",
        effect:
          "Once per turn, immediately after a weapon attack deals damage to a target within 30 ft., roll your Scarred Talent die and deal that much extra force damage.",
      },
      {
        name: "Selected Sight",
        bonus: "DC 12 + WIS",
        effect:
          "Manipulate the sight of up to 3 creatures within 500 ft. so they can't see chosen people, objects, or small buildings (WIS save). Costs 2 HP per target, 6 HP total.",
      },
      {
        name: "Caustic Blade",
        bonus: "Ranged attack",
        effect:
          "Spend 4 HP before the attack roll to deal an extra 1d8 acid damage on a melee weapon attack.",
      },
      {
        name: "Touch of Death",
        bonus: "WIS save: none / DC 16 if leveled",
        effect:
          "Against unleveled characters/NPCs: creatively kill them via their own body (heart attack, embolism, aneurysm, etc.). Against leveled NPCs: DC 16 WIS save or they take 1d4 psychic damage and get a nosebleed; no effect on success.",
      },
      {
        name: "Blood Needles",
        bonus: "Ranged attack",
        effect:
          "Target up to 3 creatures within 30/300 ft. with blood needles dealing 1d6 piercing each. Costs 1 HP per needle used.",
      },
    ],
  },
  equipment: [
    { name: "Climbing Claws", desc: "Scale smooth/rough stone walls at half speed and wooden walls at full speed — no Acrobatics check required." },
    { name: "Infiltrator's leather armor", desc: "AC 13 + DEX" },
    { name: "4 Sai and 2 Kunai" },
  ],
  inventory: ["700 GP"],
  abilitiesAndTraits: [
    {
      name: "Overlander",
      desc: "+5 to Survival, plus intimate knowledge of the Realm's landscape — avoid main roads, towns, and cities for extended periods, and travel between locations faster than the average person.",
    },
    {
      name: "Dreamwalker",
      desc: "While dreaming, you sometimes see through the eyes of others awake across Iosandros, stepping into their lives at random.",
    },
    {
      name: "Second Wind",
      desc: "Bonus action: regain 1d6 + fighter level HP. Once per short or long rest.",
    },
    {
      name: "Action Surge",
      desc: "Take one additional action on your turn. Once per short or long rest (twice per rest at 17th level, but not on the same turn).",
    },
    {
      name: "Fighting Style: Thrown Weapon Fighting (TCE)",
      desc: "Drawing a thrown weapon is part of the attack with it, and ranged attacks with thrown weapons gain +2 to the damage roll.",
    },
    {
      name: "Lyocane Powder Immunity",
      desc: "From your training in the brotherhood you have developed a tolerance to the deadly Lyocane powder.",
    },
  ],
};

export default {
  id: "0005_character_seed",
  statements: [
    `INSERT INTO app_state (key, value, updated_at, updated_by)
     VALUES (
       'character',
       '${JSON.stringify(character).replace(/'/g, "''")}',
       '2026-06-09T00:00:00.000Z',
       'seed'
     )
     ON CONFLICT(key) DO NOTHING`,
  ],
};
