// Expands the Characters list to a fuller profile PER character (each
// entry ≤500 words, kept concise). Updates the live 'characters' row,
// but only if Claude still owns it (updated_by='claude') — so it never
// overwrites the player's own edits.

const charactersHtml = `
<h3>The High Council — the party Manfred travels with</h3>

<p><strong>Rhaegar Blackblade</strong> — Manfred's lifelong friend and now his commander. They've known each other essentially their whole lives and returned to Highrock together ~10 days ago. A Blood Knight of Lorenthar — nearly 50, though he looks Manfred's age (Blood Knights live unnaturally long) — he is "the Blade of the King" and commands the reinstated Dark Knights, so Manfred answers to him. Feared across the realm as an "Abomination" for his unnatural senses (he can hear a cough a quarter-mile off); many kingdoms distrust him, which is exactly why he needs Manfred to act where he cannot. Rides the wolf Kenra (the Queen of the Hounds). Phaedra's vision showed him "calling storms from the sky, raining lightning on a field of ten thousand — the only one who walks away." Guarded even in his most open moments.</p>

<p><strong>Galeth Holgar</strong> — Blood Knight and a council ally (not yet personally close to Manfred). A giant: 6'10", ~340 lbs, red-haired, House Brolin's bear on his armor; travels with a bear companion. Recovered the runic blood-artifact from Kazar Askelen's raiders and studies it in his lab beneath the castle. Major reveal: 55–60 years ago, during his bloodletting, he met a figure "with the head of a deer and the horns of a ram" in a "land between lives," who asked "out of trillions of souls, what makes you so special?" and returned him to the realm — a secret he'd never shared, assuming such visions were normal.</p>

<p><strong>Gaius Kratik</strong> — Maester to Prince Tobin, newly named Lord Protectorate (the prince's chief guardian); a former war-table commander. Mid-60s, one eye (an eyepatch bearing House Brolin's sigil). A council ally; he spent the evening learning who Manfred is from the High Steward.</p>

<p><strong>Attican</strong> — the High Falconer, unofficial "last Falconeer"; rides the great black peregrine falcon Shira. Young and withdrawn since his ancestral home, Falcon's Rest, was destroyed ~14–15 months ago by Kazar Askelen. Trained from age five by his uncle, the former High Falconer (now dead), whose silent spirit he sees on patrol. Like a little brother to the Blood Knights. He and Manfred met for the first time this session (the fruit-vendor rescue) and walked to the castle together; his role is to guard the council from ambush on the road.</p>

<p><strong>Cato Tulken</strong> — co-founder of Golden Basin Goods (a major shipping/freight company), newly named Lord of Negotiation. Unassuming, well-tailored but not flashy. Partnered with Jeffrey Vangmore; the council will travel disguised under his company's banner.</p>

<p><strong>Jeffrey Vangmore</strong> — co-founder of Golden Basin Goods and Cato's partner; also a Lord of Negotiation. Handles the company's correspondence, logistics, and routing — arranging the wagons, horses, and coffee-crate cover load for the journey to Esmerath.</p>

<h3>The Court of Highrock</h3>

<p><strong>King Trask Brolin</strong> — the High King (House Brolin, roaring-bear sigil), ruling from Eternium's throne; chemical-burn scars run down the left side of his face. He granted Manfred the title Dark Knight of Lorenthar and pointedly used Manfred's true name, "Endrun Ukinri." Lost his wife to assassins 16 years ago and is grieving the recent death of the Fire Duke Branthorp, his last friend. Cold and distant toward his son.</p>

<p><strong>Prince Tobin Brolin</strong> — 16-year-old heir; anxious, sheltered, has never left Highrock, and desperate to impress his father. The King is sending him to Esmerath (with the council as protection) to witness Princess Palara's ascension and finally see the realm he'll one day rule.</p>

<p><strong>Caradoc Maxim</strong> — Blood Knight and Brigadier General; a strategist. Reluctantly agreed to reinstate the Dark Knights, but only under the condition that they answer to Rhaegar. Accompanied Galeth to see Phaedra and was shaken by the deer-headed-man revelation.</p>

<p><strong>Fraedon Aloware</strong> — High Steward and personal advisor to the King. Knows Manfred's full history and shared it with Gaius (orphan, Brotherhood of Swords, Prince of Swords).</p>

<p><strong>Scostodos Felimar</strong> — Commander of the Throne Sword (the royal/city guard); assured the King that castle security is at an all-time high.</p>

<p><strong>Phaedra</strong> — the King's secret Blood Witch, kept in Gelfric's Garrison beneath the castle (blood magic is illegal in the realm). A blood seer near the end of an unnaturally long life (~30 years older than Galeth), she weeps blood when prophesying. Her Session 1 visions: "a court of bastards and orphans… Fire Lake shall burn… the prince—"; conspiracies moving against the realm; Rhaegar's storm-vision; and the deer-headed death-figure. Manfred hasn't interacted with her, but Galeth, Gaius, and Attican know of her.</p>

<h3>Beyond Highrock</h3>

<p><strong>Princess Palara Branthorp</strong> — eldest daughter and heir of the late Fire Duke Branthorp of Esmerath; soon to ascend as Lady of Fire Lake. The council journeys to witness this. (House Branthorp's beasts: the immense Great Swans of Fire Lake.)</p>

<p><strong>Veronica Burigog</strong> — an Esmerathian noble and painter; a business contact of Golden Basin Goods. Cato plans to notify her that the company (and the council) is coming.</p>

<p><strong>Lady Elowen</strong> — commander of the aviary at the Next Hollow (southwest across Sorrow's Gulf). Her great owl-riders helped Galeth recover the artifact and confirmed no knowledge of a "black ledger."</p>

<p><strong>Dolly</strong> — keeper of the Saltmeat tavern in the Tidewash, Manfred's dockside neighborhood. Friendly and protective toward Manfred ("if you need help I'll come running with a knife").</p>

<p><strong>Aaron</strong> — a close friend of Manfred's; not seen since Manfred left Sansori, though they've exchanged a few letters. Whereabouts currently unknown.</p>

<h3>Antagonists</h3>

<p><strong>Kazar Askelen, "the Black Rider"</strong> — the campaign's looming villain. A former Phoenix rider of the Donflame (the phoenix army) who splintered off and now attacks the realm in terroristic fashion, using illegal green-phoenix/phosphorus fire. Destroyed Attican's Falcon's Rest. His raiders carried the runic blood-artifact and are tied to a stolen "black ledger" and dark magic.</p>

<p><strong>Norvale raiders</strong> — the free plainsfolk of the Norvale, who live outside kingdom rule and raid caravans on the Norvale Plains near Esmerath. They cost Golden Basin Goods a freight team's cargo this session.</p>

<h3>Manfred's identities (you)</h3>
<p><strong>Manfred Highrock / Endrun Ukinri</strong> — orphan of Highrock's Tidewash, raised on the streets. Recruited young into the Brotherhood of Swords (a non-religious guild of assassins who believe they serve the realm's good) and rose to Prince of Swords — heir to its leadership — before leaving ~18–24 months ago for reasons unknown (not exiled), taking solo contracts across the south in search of purpose. Now named Dark Knight of Lorenthar, serving under Rhaegar. Goes by many names and titles; wields Sankari blades.</p>
`.trim();

const characters = { html: charactersHtml };
const esc = (obj) => JSON.stringify(obj).replace(/'/g, "''");

export default {
  id: "0011_characters_expand",
  statements: [
    // Create the row if it doesn't exist yet (e.g. 0010 hasn't run).
    `INSERT INTO app_state (key, value, updated_at, updated_by)
     VALUES ('characters', '${esc(characters)}', '2026-09-02T00:00:00.000Z', 'claude')
     ON CONFLICT(key) DO NOTHING`,
    // Update to the fuller version, but only if the player hasn't edited it.
    `UPDATE app_state
     SET value = '${esc(characters)}', updated_at = '2026-09-02T00:00:00.000Z'
     WHERE key = 'characters' AND updated_by = 'claude'`,
  ],
};
