// Appends Session 15 and Session 16 to the Claude Notes WITHOUT touching any
// existing session. Uses json_insert(value, '$.sessions[#]', ...) to append a
// new element to the sessions array; each statement is guarded by a NOT EXISTS
// check on the session id, so:
//   - re-running the migration is a no-op (ids already present -> skipped), and
//   - every earlier session the player may have edited is left exactly as-is.
// Only the sessions array grows; activeId and all other fields are untouched.

const s15 = {
  id: "s15",
  title: "Session 15 — The Audience and the Ants",
  html:
    "<p><strong>Session 15 — \"The Audience and the Ants\"</strong> · Home to Highrock — a king's charge, a buried army, and a vanishing</p>\n\n" +
    "<p>With the Heart of the Mountain stolen by the Insholo and flockmaster Biddlebug dead, the council flew home to <strong>Highrock</strong> on borrowed Phoenixes, set on securing the runic <strong>cube</strong> before their next audience with the King.</p>\n\n" +
    "<h3>Preparing for the King</h3>\n" +
    "<p>Galeth secured the cube overnight. The council agreed to give <strong>King Trask Brolin</strong> a careful half-truth: claim credit for ending Velfarion's civil war, and name <strong>Kazar Askelen</strong> (whom the king already knew had made himself a Blood Knight) as the hand behind the southern war — but bury Mr. Bones, the Brotherhood, and their own secrets. Aaron would keep out of sight to avoid questions about the Brotherhood of Swords.</p>\n\n" +
    "<h3>The stairwell</h3>\n" +
    "<p>High Steward <strong>Fraedon Aloware</strong> and <strong>Tobin</strong> argued on the stairs: Fraedon insisted the prince sit beside his father as chairman of the council; Tobin was set on riding south with the party. Attican defused it and walked Tobin away. The prince had traded his royal garb for the leather armor Jeffrey gave him and a short sword drawn from the barracks.</p>\n\n" +
    "<h3>The audience</h3>\n" +
    "<p>In the throne room — the king flanked by <strong>Scostodos Falimar</strong>, commander of the throne sword and guard, and Fraedon Aloware — the council reported its travels, and Tobin impressed his \"father\" with a hard lesson about power. They confirmed Kazar sits at the heart of the Garandell–Selkinaar war. The king's charge: go south, try to resolve the conflict between the two throne-allies, and if they cannot, pick a side — and learn why <strong>Osmere</strong> has joined. He refused them an army (three Blood Knights and a battalion would look like an invasion) and, at first, refused to let Tobin go. The council persuaded him: Tobin would travel for his education, with Shira sworn to carry him to safety if danger came.</p>\n\n" +
    "<h3>The army in the basement</h3>\n" +
    "<p>Scostodos led them far below the garrison — past Phaedra's lab, past the bear dens, deeper than the sea-caves — to a barricade of bear-riders. A fire-arrow lit the reason: a silent wall of <strong>Insholo ant-riders</strong>, massed some 150 feet down the tunnel for two weeks, neither advancing nor leaving. The king had said nothing of them. The council reasoned the ants have tunneled beneath half the realm and wait, in league with Kazar, for some triggering event in the south.</p>\n\n" +
    "<h3>The plan, and a dark history</h3>\n" +
    "<p>Regrouping in Gaius's lab, they set their course east to the front to kill Kazar. Gaius recounted the ruin of <strong>Sovara</strong> — a blood-magic crystal ritual that killed two million, his own brother (a Blood Knight of the time) among them — and swore off any such mass sacrifice. Galeth shared his plan for Kazar, his uncle, who believes all his kin dead and does not know Galeth exists: knock him from his black-spire Phoenix (far larger than Shira, but slower) and force him to talk. They sent for owls to fly and scout, due in two days.</p>\n\n" +
    "<h3>A day in Lorenthar</h3>\n" +
    "<p>Letters went out — Cato to his old syndicate contact <strong>Alfie Scholiman</strong> in Osmere's southeast, Gaius to <strong>Perrin</strong> for word of the war. Manfred and Aaron slipped off to the <strong>Salt Me</strong> tavern in the Tidewash, where Aaron grew up, for a quiet drink against the end of the world. Cato bought thornberry poison for his needles; Tobin was fitted for heavy plate.</p>\n\n" +
    "<h3>Phaedra's cave</h3>\n" +
    "<p>The council went to consult the Blood Witch about Mr. Bones and the cube — and found her gone. Among her dissected animals and scattered parchments were notes of a being trapped \"between time,\" outside it, almost a god, and a book bearing the ram-horned glyph from the Temple of the Dead Gods. Gaius read a word aloud — <strong>Egarar</strong> — and Attican spotted a small black rhomboid slowly turning in the air above a side table: a portkey. One by one the party reached out and were pulled through, Rhaegar confirming by blood-bond that Gaius (first to go) still lived. Attican took a last look for Phaedra, then followed. The session ends mid-fall.</p>",
};

const s16 = {
  id: "s16",
  title: "Session 16 — The World Between",
  html:
    "<p><strong>Session 16 — \"The World Between\"</strong> · Through the portkey to Egarar's prison — the truth of the gods, and a terrible bargain</p>\n\n" +
    "<p>The party fell through a cosmos of light-beams and glass panes showing other worlds, landing in a forest of impossibly vast trees beneath a purple, fire-streaked sky, floating mountains far off. Gaius, Rojan — and Aaron — knew it at once: the dream-realm of <strong>Mr. Bones</strong>. Present were Galeth, Cato, Rojan, Gaius, Caradoc, Rhaegar, Jeffrey, and Aaron. Tobin had stayed behind.</p>\n\n" +
    "<h3>Aaron's answer</h3>\n" +
    "<p>Aaron revealed this was the exact spot he stood at five years old in his dream, where the figure once asked what made him — out of billions of souls — exceptional. Galeth gave his own answer aloud: \"Galeth Holgar, 19th Blood Knight of Iosandros. I will find the Undying King, and help him bring the gods and magic back.\"</p>\n\n" +
    "<h3>The gate</h3>\n" +
    "<p>They crossed to a runed stone platform with a great arch, where the black-robed, deer-skulled, ram-horned figure waited. <strong>Phaedra</strong> lay dead on the steps, a red smear; she had \"wished to control\" him, he said.</p>\n\n" +
    "<h3>Egarar's truth</h3>\n" +
    "<p>He named himself <strong>Egarar</strong>. He is no old god — the gods betrayed and abandoned him too, leaving him to tend this construct, a holding-place for what is to be discarded. The world, he said, runs on an endless cycle: the gods sealed the material realm off, looped it upon itself, stripped it of its magic, and left it to fester — abandoned, not cut off by accident. His design: harbor the souls of the dead (and the unborn), grow strong enough to tear through the veil the gods raised, and cut them down — then walk the realms freely, mightier than any god. He would send the party home; he could not interfere with their goals, only pursue his own.</p>\n\n" +
    "<h3>The mirrors</h3>\n" +
    "<p>Galeth and Rojan climbed the steps to see. Egarar raised mirrors of countless other selves — lives past and future — all converging on a swirling void. In the farthest reflections only one figure recurred, over and over, alone: <strong>Rhaegar</strong>. He stands at the center of it all. Their order's faith, Egarar said, rests on a lie — and he wants them stronger, for he wants a good fight when he comes.</p>\n\n" +
    "<h3>The clash</h3>\n" +
    "<p>Caradoc loosed a rainbow beam from his shield; Egarar swatted it aside. Galeth's hammer was caught one-handed; Rojan's blinding powder was answered with a cloud of hallucinogenic smoke that hurled him back. Egarar lifted Galeth by the throat — \"Be stronger. I want a good fight. Come ready.\" — and waved them home to Phaedra's cave.</p>\n\n" +
    "<h3>The debrief</h3>\n" +
    "<p>Shaken, the council pieced it together: Egarar is a world-jumping soul-vampire, caged for now, feeding on the <strong>Soul Forge</strong> to pierce the gods' veil. He keeps an avatar loose in the world (the hints point away from Kazar), and bound Verna's family to him through fear. The relic triad — the cube, the Heart of the Mountain, and the black altar — is tied to that piercing; the council holds the cube, while the ants hold the Heart and perhaps the altar.</p>\n\n" +
    "<h3>A terrible bargain</h3>\n" +
    "<p>To stand any chance, <strong>Rhaegar</strong> proposed turning the companions — Cato, Gaius, Aaron, Jeffrey — into Blood Knights, each bonded to a chosen animal (owl, honey badger and the like; the snake forbidden). <strong>Caradoc</strong>, calling it a betrayal of everything the brotherhood stands for, stormed out. Several of the party were willing.</p>\n\n" +
    "<h3>Rhaegar and Palara</h3>\n" +
    "<p>On the shore, Rhaegar pressed Caradoc — and took the blow in return: he must convince <strong>Palara</strong> to drink nightshade and end her pregnancy, or the child, grown too strong (for no mother survives a Blood Knight's child), will kill her. Rhaegar refused: \"I'll figure something out.\"</p>\n\n" +
    "<h3>Loose threads</h3>\n" +
    "<p>Cato set out to buy back artifacts he once sold — among them an amulet with the strength of ten men, now worn by a fighter on the traveling Tournament of Champions circuit, which is swinging their way. The council ends resolved to pursue power, chase the relics, and ready itself for a war that now reaches to the gods.</p>",
};

const esc = (obj) => JSON.stringify(obj).replace(/'/g, "''");

// Append one session only if its id is not already in $.sessions.
const append = (session) =>
  `UPDATE app_state
   SET value = json_insert(value, '$.sessions[#]', json('${esc(session)}')),
       updated_at = '2026-10-14T00:00:00.000Z'
   WHERE key = 'claudeNotes'
     AND NOT EXISTS (
       SELECT 1 FROM json_each(app_state.value, '$.sessions') e
       WHERE json_extract(e.value, '$.id') = '${session.id}'
     )`;

export default {
  id: "0015_sessions_15_16",
  statements: [append(s15), append(s16)],
};
