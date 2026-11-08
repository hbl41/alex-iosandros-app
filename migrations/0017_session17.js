// Appends Session 17 to the Claude Notes WITHOUT touching any existing
// session. Uses json_insert(value, '$.sessions[#]', ...) to append one new
// element to the sessions array, guarded by a NOT EXISTS check on the id so
// the migration is idempotent and every earlier (possibly player-edited)
// session is left exactly as-is. Only the sessions array grows.

const s17 = {
  id: "s17",
  title: "Session 17 — Brothers in Blood",
  html:
    "<p><strong>Session 17 — \"Brothers in Blood\"</strong> · The bloodletting rite, a line of cracked prophecies, and a battlefield reunion</p>\n\n" +
    "<p>Shaken by Egarar's warning to grow stronger, the council resolved to pay the price. In the depths of the garrison, five companions underwent the <strong>bloodletting rite</strong> to become Blood Knights — knowing it would extend their lives, mark them as monsters in many eyes, and forever deny them families of their own.</p>\n\n" +
    "<h3>The rite and the visions</h3>\n" +
    "<p>One by one they lowered into a stone tub of warm blood while Caradoc, Galeth, and Rhaegar swore them to loyalty, honesty, and \"the song of the people,\" then stabbed each over the heart with a token of their chosen animal and pushed them under. Each surfaced changed, and each carried a vision back. <strong>Gaius</strong> (21st of the line) saw Highrock burned and rebuilt grander — streets of gold, rivers of silver, House Brolin's sigils stripped away, Tobin on the throne and Gaius himself towering behind him. <strong>Cato</strong> (22nd) saw a field he turned to gold, harvested by the desperate, until Egarar on the horizon turned the golden blades to knives and cut him down. <strong>Jeffrey</strong> (23rd) saw Rhaegar locked in battle with Egarar — and rose with something stranger than the others: telekinesis, lifting a whole table into the air. <strong>Manfred</strong> (24th) saw himself as a scarred figure in light-drinking black armor, an unseen army of shadow-assassins killing for him as cities crumbled and the High Council turned against him. <strong>Aaron</strong> (25th) took the stallion.</p>\n\n" +
    "<h3>Attican's departure</h3>\n" +
    "<p>Attican took the rite too — choosing the falcon — and his vision sent him away: his late father bade him fly to the ancestral home of the Falcons, an island far off the western maps, to reclaim a power the Falcons held thousands of years ago. He left at dawn, and the council lost its eyes in the sky.</p>\n\n" +
    "<h3>Gifts and confessions</h3>\n" +
    "<p>Rhaegar armed the new brothers from the vault: boots that negate any fall under 150 feet, and Velthar-steel weapons — Manfred's sai (now +2 to damage), a short sword for Gaius, a bo staff for Cato. Bound now to honesty, they opened up. Alex's character — long known to the party only as \"Rojan\" — told them his true name: <strong>Manfred Highrock</strong>. Cato read a warm reply from his Osmere contact <strong>Alfie Scholiman</strong> (who knew nothing of Osmere's role but longed for a visit), and admitted that Golden Basin Goods is named for a real artifact he and Jeffrey still hold — a basin that turns blood to gold. For the Black Altar's whereabouts he pointed them to <strong>Captain Kellogg</strong>, who ferried it and survived its madness — but Kellogg was three days out.</p>\n\n" +
    "<h3>Tobin's secret, and the prophecy stones</h3>\n" +
    "<p>Caradoc and Rhaegar then trusted the new brothers with the realm's deepest secret: the true prince died in the assassination sixteen years ago, <strong>Tobin</strong> is an orphan raised in his place, and House Brolin's line ends with the king. In the vault, Caradoc showed them the seven <strong>prophecy stones</strong> ringing the Stone of Eternium — and three had cracked and fallen: <em>\"Three masks will speak as one\"</em> (the Pendant Coast's insect families), <em>\"A war of northern birds\"</em> (the Velfarion twins), and, most recently, <em>\"The black tree will bloom\"</em> (the dead forest, or Sovara's glassed ruin — Manfred still carries a pouch of its black glass-sand). A fourth now loomed — <em>\"the silent bell tolled\"</em> — matching the visions of Highrock aflame, its meaning yet unknown.</p>\n\n" +
    "<h3>To the front</h3>\n" +
    "<p>On borrowed Great Owls the council flew south-east to the war, landing amid a field of smoke, scorched earth, and the dead of Garandell and Selkinaar. Cato spotted a ram-rider killed by a single fist-dent — the mark of <strong>Dashiell Delmar</strong>, the Tournament of Champions champion who wears the amulet Cato once sold him. Then, on a hill, the <strong>Black Rider</strong> himself: <strong>Kazar Askelen</strong>. Rhaegar faced him and claimed his birthright — firstborn of King Ripavan and Kazar's own sister, Dahlia — and the two withdrew to talk alone. But Kazar had not come without company: three enemy Blood Knights closed in — a blood-mad spearman, the meteor-hammer-wielding <strong>Steiger</strong> (a bitter former Brother who blames Manfred for his lost ascension), and Dashiell Delmar. The session ends with blades drawn, brother against brother, as battle begins.</p>",
};

const esc = (obj) => JSON.stringify(obj).replace(/'/g, "''");

const append = (session) =>
  `UPDATE app_state
   SET value = json_insert(value, '$.sessions[#]', json('${esc(session)}')),
       updated_at = '2026-11-08T00:00:00.000Z'
   WHERE key = 'claudeNotes'
     AND NOT EXISTS (
       SELECT 1 FROM json_each(app_state.value, '$.sessions') e
       WHERE json_extract(e.value, '$.id') = '${session.id}'
     )`;

export default {
  id: "0017_session17",
  statements: [append(s17)],
};
