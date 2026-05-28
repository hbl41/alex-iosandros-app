// ============== CAETO'S PLAYBOOK ==============
// At-table quick reference for a level-4 Monk (Way of the Intelligent Hand).
// All references are tailored to Caeto's level-4 build.

window.PLAYBOOK = {

  // --------------------------------------------------
  //  TURN COACH — What can I do on my turn?
  // --------------------------------------------------
  turnCoach: {
    intro: "Default combat rhythm: Attack, use your Bonus Action, keep your Reaction ready for Deflect Attacks. Spend FP when it changes the fight: control, survival, or speed.",

    actions: [
      {
        name: "Attack — Unarmed",
        slot: "Action",
        source: "yours",
        cost: "Free",
        tldr: "d20 + 2 vs AC; hit = 1d6 bludgeoning.",
        roll: "Attack: d20 + 2 vs AC. Damage: 1d6 bludgeoning.",
        use: "Backup when you are disarmed or need bludgeoning.",
        note: "After any Attack action, use your free bonus unarmed strike unless your Bonus Action is needed elsewhere."
      },
      {
        name: "Attack — Velthar Steel Hair Needles",
        slot: "Action",
        source: "yours",
        cost: "Free",
        tldr: "d20 + 4 vs AC; hit = 1d8 piercing.",
        roll: "Attack: d20 + 4 vs AC. Damage: 1d8 piercing.",
        use: "Best default hit/damage. Use when piercing is fine.",
        note: "Still unlocks the free bonus unarmed strike. Also climb walls without Acrobatics."
      },
      {
        name: "Dodge",
        slot: "Action",
        source: "universal",
        cost: "Free",
        tldr: "Attackers have disadvantage; you get advantage on DEX saves.",
        roll: "No roll.",
        use: "When you cannot spend FP but need to survive until your next turn."
      },
      {
        name: "Dash",
        slot: "Action",
        source: "universal",
        cost: "Free",
        tldr: "Add +40 ft movement this turn.",
        roll: "No roll.",
        use: "Move up to 80 ft total if this is your only Dash.",
        note: "Action Dash + bonus Step of the Wind = 120 ft total."
      },
      {
        name: "Disengage",
        slot: "Action",
        source: "universal",
        cost: "Free",
        tldr: "Move without triggering opportunity attacks.",
        roll: "No roll.",
        use: "Leave melee safely.",
        note: "Usually use Patient Defense instead; it Disengages as a Bonus Action for free."
      },
      {
        name: "Help",
        slot: "Action",
        source: "universal",
        cost: "Free",
        tldr: "Give an ally advantage on their next attack or ability check.",
        roll: "No roll from you.",
        use: "Give an ally advantage on one attack against a target within 5 ft of you, or on one ability check."
      },
      {
        name: "Hide",
        slot: "Action",
        source: "universal",
        cost: "Free",
        tldr: "Stealth check vs enemy Perception.",
        roll: "Stealth: d20 + 1 vs enemy Perception.",
        use: "Only if you have cover/concealment.",
        note: "If hidden, your next attack can have advantage."
      },
      {
        name: "Ready",
        slot: "Action",
        source: "universal",
        cost: "Free",
        tldr: "Prepare an action to trigger on a condition (uses your Reaction).",
        roll: "No roll now; roll when the trigger happens.",
        use: "Name a trigger and action: 'when the door opens, I throw a needle.'",
        note: "Uses your Reaction when it fires."
      },
      {
        name: "Search",
        slot: "Action",
        source: "universal",
        cost: "Free",
        tldr: "Perception or Investigation check to find something specific.",
        roll: "Perception d20 + 2, or Investigation d20 + 2.",
        use: "Find traps, hidden doors, clues, or a specific object."
      },
      {
        name: "Bonus Unarmed Strike",
        slot: "Bonus Action",
        source: "yours",
        cost: "Free",
        tldr: "One free extra Unarmed Strike after your Attack action.",
        roll: "Attack: d20 + 2 vs AC. Damage: 1d6 bludgeoning.",
        use: "Default Bonus Action after attacking with unarmed or a Monk weapon.",
        note: "Skip only if using Flurry, Patient Defense, or Step of the Wind."
      },
      {
        name: "Flurry of Blows",
        slot: "Bonus Action",
        source: "yours",
        cost: "1 FP",
        tldr: "Two unarmed attacks; each hit can add Open Hand control.",
        roll: "Make 2 attacks: each d20 + 2 vs AC, hit = 1d6 bludgeoning.",
        use: "Spend on a real threat, or when you need prone, shove, or no reactions.",
        note: "On each hit: DEX save DC 12 or Prone; STR save DC 12 or push 15 ft; or no reactions, no save."
      },
      {
        name: "Patient Defense",
        slot: "Bonus Action",
        source: "yours",
        cost: "Free / 1 FP",
        tldr: "Bonus-action Disengage; pay 1 FP to also Dodge.",
        roll: "No roll.",
        use: "Free: Disengage. 1 FP: Disengage + Dodge.",
        note: "Best defensive button when surrounded, low HP, or facing a boss."
      },
      {
        name: "Step of the Wind",
        slot: "Bonus Action",
        source: "yours",
        cost: "Free / 1 FP",
        tldr: "Bonus-action Dash; pay 1 FP to add Disengage + doubled jump.",
        roll: "No roll.",
        use: "Free: Dash for 80 ft total. 1 FP: Dash + Disengage + doubled jump.",
        note: "With Action Dash too, you can move 120 ft total."
      }
    ],

    reactions: [
      {
        name: "Deflect Attacks",
        source: "yours",
        cost: "Reaction",
        tldr: "Reduce physical damage by 1d10+5; maybe redirect.",
        roll: "Reduction: 1d10 + 5. If reduced to 0, spend 1 FP: target DEX save DC 12 or takes 2d6 + 1.",
        use: "Use when a bludgeoning, piercing, or slashing attack hits you.",
        note: "Redirect target: 5 ft for melee hit, 60 ft for ranged hit, no total cover."
      },
      {
        name: "Slow Fall",
        source: "yours",
        cost: "Reaction",
        tldr: "Reduce fall damage by 5 × Monk level = 20 HP.",
        roll: "No roll. Reduce fall damage by 20.",
        use: "Use any time you fall and have your Reaction."
      },
      {
        name: "Opportunity Attack",
        source: "universal",
        cost: "Reaction",
        tldr: "One melee attack when a creature leaves your reach without Disengaging.",
        roll: "Needle: d20 + 4, hit = 1d8 piercing. Unarmed: d20 + 2, hit = 1d6 bludgeoning.",
        use: "Trigger: enemy leaves your reach without Disengaging.",
        note: "Costs the Reaction you might need for Deflect Attacks."
      },
      {
        name: "Ready-triggered action",
        source: "universal",
        cost: "Reaction",
        tldr: "Fires the action you prepared with Ready.",
        roll: "Roll whatever the prepared action requires.",
        use: "Trigger: the condition you named for Ready happens."
      }
    ],

    movementNote: "Speed 40 ft. Split movement before/after actions. Stand from Prone costs 20 ft. Velthar Needles climb walls without Acrobatics.",

    bonusActionNote: "After Attack with unarmed or a Monk weapon, your Bonus Action can be the free unarmed strike OR one Monk option. You only get one Bonus Action."
  },

  // --------------------------------------------------
  //  SITUATION HELPER
  // --------------------------------------------------
  situations: [
    {
      id: "tookBigHit",
      label: "I just took a big hit",
      emoji: "💥",
      category: "combat",
      headline: "Reaction first: Deflect Attacks.",
      plays: [
        "Roll 1d10 + 5 and subtract it from the hit.",
        "If damage drops to 0: spend 1 FP to redirect. Target DEX save DC 12 or takes 2d6 + 1.",
        "Next turn if still threatened: Patient Defense 1 FP, or Step of the Wind 1 FP away."
      ]
    },
    {
      id: "outnumbered",
      label: "I'm surrounded / outnumbered",
      emoji: "⚔️",
      category: "combat",
      headline: "Choose: control them or get out.",
      plays: [
        "Stay: Patient Defense 1 FP. You Disengage and enemies attack you with disadvantage.",
        "Fight: Flurry 1 FP. Each hit can try Prone, shove 15 ft, or remove reactions.",
        "Leave: Step of the Wind 1 FP. Disengage + Dash, move up to 80 ft."
      ]
    },
    {
      id: "closeDistance",
      label: "I need to close distance FAST",
      emoji: "🏃",
      category: "combat",
      headline: "Use Step first; add Action Dash if you can skip attacking.",
      plays: [
        "Need to attack this turn: Step of the Wind free, move up to 80 ft, then Attack.",
        "Need maximum distance: Action Dash + Step of the Wind = 120 ft total, but no Attack action.",
        "Vertical route: Velthar Needles climb without Acrobatics. Big jump: Step 1 FP doubles jump."
      ]
    },
    {
      id: "outOfReach",
      label: "Enemy is at range and I can't reach them",
      emoji: "🎯",
      category: "combat",
      headline: "If they are within 80 ft, Step and hit.",
      plays: [
        "Within 80 ft: Step of the Wind free, move, then Attack with needles: d20 + 4, hit 1d8.",
        "Within 120 ft: Action Dash + Step reaches them, but you probably cannot attack this turn.",
        "If they shoot you: Deflect 1d10 + 5. If reduced to 0, 1 FP redirect, DEX save DC 12 or 2d6 + 1."
      ]
    },
    {
      id: "protectAlly",
      label: "I need to protect an ally",
      emoji: "🛡️",
      category: "combat",
      headline: "Use Open Hand to move or disable the threat.",
      plays: [
        "Flurry 1 FP. On hit, target makes STR save DC 12 or you shove 15 ft.",
        "If your ally needs to run: choose no reactions on hit. No save.",
        "If waiting at a doorway: Ready an attack, then spend Reaction when the trigger happens."
      ]
    },
    {
      id: "socialTension",
      label: "Social encounter / negotiation",
      emoji: "💬",
      category: "social",
      headline: "Lead with Persuasion +5.",
      plays: [
        "Deal or convince: Persuasion d20 + 5.",
        "Read motive: Insight d20 + 4.",
        "Verify one exact claim: Ring, no roll, 7 HP, 3/day. Cold = lie, warm = truth.",
        "Leverage: writs of value, shipping routes, 500k coffee, 500k rope, 500k iron per Kingdom."
      ]
    },
    {
      id: "suspectLie",
      label: "Someone might be lying",
      emoji: "👁️",
      category: "social",
      headline: "Insight first. Ring only for the claim that matters.",
      plays: [
        "Insight: d20 + 4.",
        "Need certainty: ask for the exact statement, then Ring. No roll; spend 7 HP.",
        "Cross-check facts: History/Culture d20 + 4, with advantage in your six picked Kingdoms."
      ]
    },
    {
      id: "scouting",
      label: "Stealth / scouting / hidden approach",
      emoji: "🌑",
      category: "meta",
      headline: "Stealth is weak. Use routes, not sneaking.",
      plays: [
        "Stealth: d20 + 1. If someone stealthy exists, let them lead.",
        "Lookout/read terrain: Perception d20 + 2 or Investigation d20 + 2.",
        "Use vertical paths: Needles climb walls without Acrobatics. Step free crosses 80 ft."
      ]
    },
    {
      id: "lowHP",
      label: "I'm low on HP",
      emoji: "❤️‍🩹",
      category: "combat",
      headline: "Stop trading hits.",
      plays: [
        "In combat: Patient Defense 1 FP, stay near cover/allies, Deflect every physical hit.",
        "Escape: Step of the Wind 1 FP to Disengage + Dash, move up to 80 ft.",
        "Between fights: Short Rest restores all FP; spend Hit Dice to heal if allowed."
      ]
    },
    {
      id: "newKingdom",
      label: "Just traveled to a new Kingdom",
      emoji: "🏰",
      category: "meta",
      headline: "Negotiation budget resets.",
      plays: [
        "Fresh budget: 500k coffee, 500k rope, 500k iron.",
        "History/Culture: d20 + 4; roll with advantage if this is one of your six picked Kingdoms.",
        "For logistics, use Golden Basin Goods: shipping, freight, writs of value, or word to Jeffrey."
      ]
    },
    {
      id: "initiative",
      label: "Combat just started (roll initiative)",
      emoji: "⚡",
      category: "combat",
      headline: "Roll initiative + decide if you need Uncanny Metabolism.",
      plays: [
        "Initiative: d20 + 1.",
        "If low FP/HP: Uncanny Metabolism restores FP to 4 and heals 1d6 + 4. Once per Long Rest.",
        "First target: biggest threat. If close, Needle attack + Bonus punch. If important, Flurry 1 FP."
      ]
    }
  ],

  // --------------------------------------------------
  //  ABILITY EXPLANATIONS (inline tooltips)
  // --------------------------------------------------
  abilityDetails: {
    "Unarmored Movement": {
      plain: "Your speed is 40 ft while unarmored and not using a shield.",
      whenItMatters: "Every combat turn.",
    },
    "Uncanny Metabolism": {
      plain: "When you roll Initiative, restore FP to 4 and heal 1d6 + 4 HP. Once per Long Rest.",
      whenItMatters: "Use at the start of a fight if FP or HP is low.",
    },
    "Deflect Attacks": {
      plain: "Reaction after physical damage: reduce by 1d10 + 5. If reduced to 0, 1 FP redirects: DEX save DC 12 or 2d6 + 1 damage.",
      whenItMatters: "Almost every physical hit.",
    },
    "Slow Fall": {
      plain: "Reaction when falling: reduce fall damage by 20.",
      whenItMatters: "Any fall, if your Reaction is free.",
    },
    "Intelligent Strikes": {
      plain: "Use INT for your unarmed attack roll. Current unarmed roll: d20 + 2.",
      whenItMatters: "Already built into the playbook rolls.",
    },
    "Open Hand Technique": {
      plain: "On each Flurry hit, choose one: DEX save DC 12 or Prone; STR save DC 12 or push 15 ft; or no reactions until your next turn ends.",
      whenItMatters: "Prone for melee allies, shove for space, no reactions for escapes.",
    },
    "Bloodbound Discernment — Ring of Discernment": {
      plain: "3/day, spend 7 HP after a statement. Cold = lie. Warm = truth.",
      whenItMatters: "Use for exact high-stakes claims.",
    },
    "Ring of Discernment": {
      plain: "3/day, spend 7 HP after a statement. Cold = lie. Warm = truth.",
      whenItMatters: "Use for exact high-stakes claims.",
    },
    "Flurry of Blows": {
      plain: "Bonus Action, 1 FP: make two unarmed attacks. Each hit can trigger Open Hand.",
      whenItMatters: "Use for important damage or control.",
    },
    "Patient Defense": {
      plain: "Bonus Action. Free: Disengage. 1 FP: Disengage + Dodge.",
      whenItMatters: "Use to leave melee or survive a dangerous round.",
    },
    "Step of the Wind": {
      plain: "Bonus Action. Free: Dash to 80 ft total. 1 FP: Dash + Disengage + doubled jump.",
      whenItMatters: "Use to reach, retreat, or cross the map.",
    },
    "Unarmed Strike": {
      plain: "Attack d20 + 2 vs AC. Hit: 1d6 bludgeoning.",
      whenItMatters: "Your free Bonus Action strike uses this.",
    },
    "Velthar Steel Hair Needles": {
      plain: "Attack d20 + 4 vs AC. Hit: 1d8 piercing. Climb walls without Acrobatics.",
      whenItMatters: "Best default attack.",
    },

    // ---- Core combat math ----
    "AC": {
      plain: "Armor Class. Enemy hits if their attack roll meets or beats it.",
      whenItMatters: "Yours is 13. Avoid standing still in melee.",
    },
    "HP": {
      plain: "Hit Points. At 0, you fall unconscious.",
      whenItMatters: "Max 28. Below about 10, play defense.",
    },
    "Focus Points": {
      plain: "Monk fuel. Spend 1 on Flurry, upgraded Patient/Step, or Deflect redirect.",
      whenItMatters: "You have 4. Short Rest restores all FP.",
    },
    "Monk DC": {
      plain: "Your target number for Monk saves: 8 + proficiency 2 + WIS 2 = 12.",
      whenItMatters: "Open Hand and Deflect redirect saves use DC 12.",
    },
    "Action": {
      plain: "Main thing on your turn. One per turn.",
      whenItMatters: "Usually Attack.",
    },
    "Bonus Action": {
      plain: "Extra turn slot. One per turn.",
      whenItMatters: "Use it almost every round.",
    },
    "Reaction": {
      plain: "Off-turn response. One per round, resets on your turn.",
      whenItMatters: "Usually save for Deflect Attacks.",
    },
    "Attack action": {
      plain: "Use your Action to make one attack at level 4.",
      whenItMatters: "Triggers your free bonus unarmed strike.",
    },
    "Initiative": {
      plain: "Start of combat: roll d20 + 1.",
      whenItMatters: "This is when Uncanny Metabolism can fire.",
    },

    // ---- Standard actions ----
    "Dash": {
      plain: "Gain extra movement equal to your speed: +40 ft.",
      whenItMatters: "One Dash = 80 ft total. Action Dash + Step Dash = 120 ft total.",
    },
    "Disengage": {
      plain: "Move without triggering opportunity attacks.",
      whenItMatters: "Use when leaving melee.",
    },
    "Dodge": {
      plain: "Attackers have disadvantage; you have advantage on DEX saves until next turn.",
      whenItMatters: "Use to survive a round.",
    },
    "Help": {
      plain: "Give an ally advantage on one attack or ability check.",
      whenItMatters: "Use when their roll matters more than yours.",
    },
    "Hide": {
      plain: "Roll Stealth d20 + 1 vs Perception.",
      whenItMatters: "Only with cover/concealment.",
    },
    "Ready": {
      plain: "Prepare an action and a trigger. It fires using your Reaction.",
      whenItMatters: "Ambushes, doorways, timing traps.",
    },
    "Search": {
      plain: "Roll Perception +2 or Investigation +2 to find something.",
      whenItMatters: "Traps, clues, hidden doors.",
    },
    "Opportunity Attack": {
      plain: "Reaction melee attack when a creature leaves your reach without Disengaging.",
      whenItMatters: "Costs the Reaction you might need for Deflect.",
    },

    // ---- Rolls, saves, conditions ----
    "Advantage": {
      plain: "Roll two d20s, keep the higher.",
      whenItMatters: "Great on attacks/checks that matter.",
    },
    "Disadvantage": {
      plain: "Roll two d20s, keep the lower.",
      whenItMatters: "You impose it by Dodging or paid Patient Defense.",
    },
    "ability check": {
      plain: "Roll d20 + ability modifier, plus proficiency if it applies.",
      whenItMatters: "General non-combat rolls.",
    },
    "skill check": {
      plain: "Roll d20 + listed skill bonus.",
      whenItMatters: "Top skills: Persuasion +5; Insight/History/Culture/Blood Magic/Medicine +4.",
    },
    "saving throw": {
      plain: "Defensive roll: d20 + save bonus.",
      whenItMatters: "Your proficient saves: STR +1, DEX +3, INT +4.",
    },
    "DEX save": {
      plain: "Roll d20 + 3.",
      whenItMatters: "Area damage, traps, breath weapons.",
    },
    "STR save": {
      plain: "Roll d20 + 1.",
      whenItMatters: "Forced movement, grapples, shoves.",
    },
    "INT save": {
      plain: "Roll d20 + 4.",
      whenItMatters: "Mind magic, illusions, psychic effects.",
    },
    "CON save": {
      plain: "Roll d20 + 2.",
      whenItMatters: "Poison, disease, endurance.",
    },
    "DC": {
      plain: "Target number. Meet or beat it.",
      whenItMatters: "Example: DC 15 Persuasion means roll d20 + 5 and need 15+.",
    },
    "Prone": {
      plain: "On the ground. Melee attacks against you have advantage; your attacks have disadvantage. Stand costs 20 ft.",
      whenItMatters: "Strong Open Hand option when melee allies can follow up.",
    },
    "cover": {
      plain: "Half cover: +2 AC/DEX saves. Three-quarters: +5. Total cover: cannot be targeted.",
      whenItMatters: "Use terrain because AC 13 is fragile.",
    },
    "Long Rest": {
      plain: "8 hours. Restores HP, FP, Ring uses, and Uncanny Metabolism.",
      whenItMatters: "Usually overnight, if the DM allows it.",
    },
    "Short Rest": {
      plain: "1 hour. Restores all FP; spend Hit Dice to heal if allowed.",
      whenItMatters: "Ask for one between fights.",
    },
    "Martial Arts die": {
      plain: "At level 4, this is d6.",
      whenItMatters: "Unarmed damage: 1d6. Deflect redirect: 2d6 + 1.",
    },
  },

  // --------------------------------------------------
  //  GLOSSARY — D&D + Iosandros
  // --------------------------------------------------
  glossary: [
    // Core D&D
    { term: "AC (Armor Class)", domain: "D&D", def: "Enemy attacks hit you if their d20 + bonus meets or beats 13." },
    { term: "DC (Difficulty Class)", domain: "D&D", def: "Target number. Example: DC 15 Persuasion means d20 + 5 must total 15+." },
    { term: "Monk DC", domain: "D&D", def: "Your Monk save DC is 12. Open Hand and Deflect redirect use it." },
    { term: "Advantage / Disadvantage", domain: "D&D", def: "Advantage: roll 2d20, keep higher. Disadvantage: keep lower. Both cancel." },
    { term: "Prone", domain: "D&D", def: "On the ground. Melee attacks against prone targets have advantage. Standing costs 20 ft for you." },
    { term: "Opportunity Attack", domain: "D&D", def: "Reaction melee attack when a creature leaves your reach without Disengaging." },
    { term: "Short Rest", domain: "D&D", def: "1 hour. Restores all FP; spend Hit Dice to heal if allowed." },
    { term: "Long Rest", domain: "D&D", def: "8 hours. Restores HP, FP, Ring uses, and Uncanny Metabolism." },

    // Iosandros campaign
    { term: "SE (Standard Era)", domain: "Iosandros", def: "Realm calendar. Current campaign year: 1224 SE." },
    { term: "The Separation", domain: "Iosandros", def: "0 SE: the Gods stripped magic, set the Brolin line to rule, and erased their own names." },
    { term: "Eternium", domain: "Iosandros", def: "Divine authority behind the High King's rule, housed in Castle Highrock." },
    { term: "The Seven Prophecies", domain: "Iosandros", def: "When fulfilled, the Brolin bloodline's divine right ends." },
    { term: "The High King", domain: "Iosandros", def: "Trask Brolin, ruler from Highrock. Reclusive since 1208 SE." },
    { term: "Blood Magic", domain: "Iosandros", def: "Outlawed magic unlocked by blood sacrifice. You know it academically: d20 + 4." },
    { term: "Blood Knights", domain: "Iosandros", def: "Lorenthar agents allowed to use Blood Magic in the King's name." },
    { term: "Dead-World artifacts", domain: "Iosandros", def: "Illegal pre-Separation magic items. Your Ring is one." },
    { term: "The 13 Kingdoms", domain: "Iosandros", def: "The sovereign kingdoms of Iosandros: Lorenthar (capital), Veltharion, Nexhollow, Selquinar, Solvarra, Garrondel, Drozvane (exiled), Thirellia, Esmireth, Jaklu, Osmere, Pendant Coast (your base), Candamos." },
    { term: "The Territories", domain: "Iosandros", def: "Unruled regions: Norvale Plains, Mour Marsh, Frozen North." },
    { term: "Way of the Intelligent Hand", domain: "Iosandros/D&D", def: "Your Monk path: INT attacks and Open Hand control." },
    { term: "Golden Basin Goods", domain: "Iosandros", def: "Your company with Jeffrey: shipping publicly, artifacts privately." },
    { term: "Rewarded (background)", domain: "Iosandros", def: "Benefits: INT saves, Medicine, writs of value, shipping access, six Kingdom history advantages." },
    { term: "The Pendant Coast", domain: "Iosandros", def: "Your wealthy home base. Capital: Golden Tide." },
    { term: "Splint-Water", domain: "Iosandros", def: "Your birthplace in Osmere." },
  ]
};
