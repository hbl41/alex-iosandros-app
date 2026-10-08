// Updates Manfred to Level 5 (Great Owl blood knighthood) from the new
// character sheet. Uses json_set on specific keys so player-editable
// fields — backstory, equipment, inventory, and live HP / Scarred Talent
// play-state — are preserved (only character stats are replaced).

const summary = {
  level: 5,
  class: "Fighter",
  subclass: "Scarred Knight",
  background: "Urchin",
  ac: 16,
  acNote: "Unarmored: 10 + DEX (13)",
  hpTotal: 47,
  heightWeight: "5'5\" / 155 lb",
  age: "19 — born 1205 SE",
  origin: "Lorenthar",
  bloodKnighthood: "Great Owl",
};

const skills = {
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
    { name: "Perception", bonus: 9 },
    { name: "Passive Perception", bonus: 7 },
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
};

const scarredTalent = {
  intro:
    "At 3rd level you gained a set of blood magic abilities, fueled by a Scarred Talent die. At Level 5 its starting size is d8 (d10 at 11th, d12 at 17th).",
  dieRules:
    "Roll the highest number on the die: it shrinks one size (d8→d6→d4→unusable) until your next long rest. Roll a 1: it grows one size back up, to a max of its starting size.",
  scarReplenishment:
    "Bonus action, once per long rest: restore the die to its starting size.",
};

const spells = {
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
      name: "Blood Needles (enhanced)",
      bonus: "Ranged attack",
      effect:
        "Target up to 5 creatures within 30/300 ft. with 3-inch, ¼-inch blood needles dealing 1d6 piercing each. Costs 1 HP per needle used.",
    },
    {
      name: "True Strike",
      bonus: "Action · 1/day",
      effect:
        "Range 30/300. Peer closely at a target to glimpse its defenses, granting you advantage on your first attack roll against it. Once per day, no HP cost.",
    },
    {
      name: "Sapping Strike",
      bonus: "Bonus action",
      effect:
        "When you attack, use your bonus action to sap the target's strength: if the attack hits, it has disadvantage on its next attack or saving throw. Costs 5 HP, used before the attack roll.",
    },
    {
      name: "Detect Blood Magic",
      bonus: "—",
      effect:
        "For 1 hour, sense ongoing blood magic rituals, spells, or curses within 300 ft. — no rolls required.",
    },
  ],
};

const abilitiesAndTraits = [
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
    name: "Extra Attack",
    desc: "Beginning at 5th level, you attack twice, instead of once, whenever you take the Attack action on your turn.",
  },
  {
    name: "Blood Knight: Great Owl",
    desc: "Imbued with the blood of the Great Owl at your bloodletting — +5 to Perception checks, darkvision 2000 ft (half in full color, half in grayscale), and wide, piercing eyes.",
  },
  {
    name: "Divine Health",
    desc: "The magic flowing through you makes you immune to disease and poison.",
  },
  {
    name: "Lyocane Powder Immunity",
    desc: "From your training in the brotherhood you have developed a tolerance to the deadly Lyocane powder.",
  },
];

const esc = (obj) => JSON.stringify(obj).replace(/'/g, "''");

export default {
  id: "0014_level5",
  statements: [
    // Character sheet — replace only the stat blocks that changed; leaves
    // $.backstory, $.equipment, $.inventory, $.names, $.attributes,
    // $.weapons, $.skillNotes untouched.
    `UPDATE app_state
     SET value = json_set(
       value,
       '$.summary', json('${esc(summary)}'),
       '$.skills', json('${esc(skills)}'),
       '$.scarredTalent', json('${esc(scarredTalent)}'),
       '$.spells', json('${esc(spells)}'),
       '$.abilitiesAndTraits', json('${esc(abilitiesAndTraits)}')
     ),
     updated_at = '2026-10-07T00:00:00.000Z'
     WHERE key = 'character'`,
    // Combat tracker — bump max HP and the Scarred Talent starting die to
    // Level 5; leave current HP and the per-rest flags (live play state).
    `UPDATE app_state
     SET value = json_set(value, '$.hp.total', 47, '$.scarredTalent.base', 8, '$.scarredTalent.die', 8),
     updated_at = '2026-10-07T00:00:00.000Z'
     WHERE key = 'tracker'`,
  ],
};
