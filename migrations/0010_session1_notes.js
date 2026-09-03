// Seeds the Claude Notes (Session 1 summary) and Characters list from
// the Session 1 recording (20260422). Claude-authored; the player can
// edit these on the site. INSERT ... ON CONFLICT DO NOTHING so it only
// seeds when empty and never clobbers the player's own edits.

const summaryHtml = `
<p><strong>Session 1 — "The High Council"</strong> · 10th of Primar, 1224 SE · Highrock, capital of Lorenthar</p>

<h3>Highrock &amp; the artifact</h3>
<p>We open inside Castle Highrock, seat of the High King's throne (Eternium's throne) and the Brolin bloodline. <strong>Galeth Holgar</strong> has just returned from a journey southwest across Sorrow's Gulf to the Next Hollow, where — aided by <strong>Lady Elowen</strong> and the aviary's great owl-riders — he recovered a magical artifact from raiders loyal to <strong>Kazar Askelen, the Black Rider</strong>. The artifact is a foot-cubed matte-gray metal box covered in runic engravings, with a recessed bowl on top meant to receive some substance (Galeth suspects blood). Elowen confirmed the aviary knew of the Black Rider's men infiltrating "the vault," but had no knowledge of a "black ledger" or dark magic. Experimenting in his lab deep beneath the castle (Gelfric's Garrison), Galeth drips rat's blood into the grimy bowl; it fizzes but does nothing.</p>

<h3>The steamship</h3>
<p>A never-before-heard war horn shakes the stone. Over Sorrow's Gulf, an immense steel steamship emerges from a fog wall — the largest vessel ever built in the realm, twice the length of a 370-ft schooner, its deck 150 ft across, crowned with towering steam stacks. Galeth recalls that a decade ago three houses — Valtharion (phoenix), Perrenstep of Garandale, and Mulgrin of Osmere — proposed such "seafaring metal monstrosities," which the king approved on the condition they build two, one under Lorenthar's purview. It could carry 5,000–7,000 men — a floating city, or army.</p>

<h3>The visitors</h3>
<p>In the visitors' wing, <strong>Cato Tulken</strong> and <strong>Jeffrey Vangmore</strong> — co-founders of Golden Basin Goods, one of the realm's largest shipping companies — watch the same ship. Their correspondence: Captain Crayle's ship the Mist Tea arrives in ~10 days; and director Wellard Stale reports overland teams lost freight and coffee to Norvale raiders near Esmerath. They dispatch a recovery team and reroute their men south through Lorenthar and Selkina into Garandale. They also safeguard a mysterious "golden basin" (disguised as a wash basin) in their quarters. A Blood Knight, Caradoc, summons them to council.</p>

<h3>Manfred's day</h3>
<p>Down in the Tidewash near the docks, <strong>Manfred Highrock</strong> — small, hooded, in a black headscarf — finishes lunch at the Saltmeat tavern. The keeper, <strong>Dolly</strong>, warns him a "freaky-eyed" man waits out back on official business. Manfred (back in Highrock ~10 days, having yet to see his friend <strong>Aaron</strong> since leaving Sansori) meets <strong>Rhaegar Blackblade</strong> in the alley — a council summons.</p>
<p>En route, a fruit vendor threatens to cut off the hand of a starving boy caught stealing berries, drawing a fine feather-shaped knife — a <em>Sankari</em>, a blade that must draw blood when unsheathed. Before Manfred can act, <strong>Attican</strong>, the High Falconer, dives from his falcon <strong>Shira</strong> and bowls the vendor over in a spectacular wingsuit landing. Manfred gives the boy coins, then drags the Sankari's point down the vendor's cheek as a warning (the blade demands blood), and claims a Sankari for his own inventory. The three walk to the castle together.</p>

<h3>The Council &amp; the titles</h3>
<p>In the throne room the party assembles before <strong>King Trask Brolin</strong> (House Brolin, roaring-bear sigil, chemical-burn scars down his left face), Prince Tobin, Gaius, High Steward Fraedon Aloware, Caradoc Maxim, and guard-commander Scostodos Felimar. The King names them his <strong>High Council</strong> and elevates each:</p>
<ul>
<li><strong>Gaius Kratik</strong> → Lord Protectorate, guardian of Prince Tobin.</li>
<li><strong>Cato &amp; Jeffrey</strong> → Lords of Negotiation.</li>
<li><strong>Manfred Highrock</strong> → <strong>Dark Knight of Lorenthar</strong>, a post vacant nearly 200 years — shadow and blade against tyranny, treason, and injustice. (The King calls him by his true name, "Endrun Ukinri," which visibly unsettles him.)</li>
<li><strong>Attican</strong> → to guard the council and prince against ambush on the road.</li>
<li>The Blood Knights (Rhaegar, Galeth, Caradoc) → to protect the prince and remind enemies of the fear they inspire.</li>
</ul>

<h3>The charge to Esmerath</h3>
<p>The King reveals his stomach ailment was a cover: he was grieving the death of his last friend, the Fire Duke Branthorp of Esmerath. He orders <strong>Prince Tobin</strong> — who has never left Highrock in his 16 years — to travel to Esmerath and oversee the ascension of <strong>Princess Palara</strong> (Branthorp's eldest daughter) as Lady of Fire Lake. The High Council will escort him, departing within a day, disguised under the Golden Basin Goods banner. The King confides he lost his wife to assassins 16 years ago and fears for his son.</p>

<h3>Phaedra's prophecy</h3>
<p>A scream interrupts: <strong>Phaedra</strong>, the King's secret Blood Witch, staggers in weeping blood from her seer-white eyes: "A court of bastards and orphans… death will reign over the realm. Blood will flow, Fire Lake shall burn… the prince—" The King silences her; guards drag her back to the caves. (Blood magic is illegal; Phaedra is an open secret.)</p>

<h3>Galeth &amp; the deer-headed man</h3>
<p>Afterward, Galeth takes Caradoc to Phaedra's grim, blood-runed cave. She warns of conspiracies moving against them, of Fire Lake burning, and of Rhaegar "calling storms from the sky, raining lightning on a field of ten thousand — the only one who walks away." She then describes a man "with the head of a deer and the horns of a ram" who yearns for death. Galeth reveals he met that very figure 55–60 years ago during his own bloodletting, in a "land between lives" — a purgatory of lost souls — where it asked, "out of trillions of souls, what makes you so special?" and returned him to the realm. Caradoc is shaken; Galeth had assumed such visions were normal and never spoke of it.</p>

<h3>Rhaegar &amp; the Dark Knights</h3>
<p>Manfred visits Rhaegar to ask about his new title. Rhaegar (nearly 50, though he looks Manfred's age — Blood Knights live unnaturally long) explains the Dark Knights were disbanded 200 years ago when Keverdok Maxim exposed their hidden blades to the 13 great houses. Crucially, the reinstated order falls under Rhaegar's command — he is the <strong>Blade of the King</strong>, and Caradoc only agreed on that condition. Feared across the realm as "Abomination" for his unnatural senses (he can hear a cough a quarter-mile off), Rhaegar needs Manfred to walk where he is unwelcome and act where he cannot — eyes, ears, and blade, not a bloodthirsty assassin. He notes rising tensions with Selkina under a scheming Perrenstep lord. Manfred, a former assassin himself, presses about his autonomy; Rhaegar affirms he now carries nearly a Blood Knight's authority — but answers for his actions.</p>

<h3>Who is Manfred?</h3>
<p>That night, Gaius asks High Steward Fraedon about Manfred. Fraedon reveals: an orphan of the Tidewash streets, recruited into the Brotherhood of Swords — a non-religious guild of assassins who believe they serve the realm. More: Manfred is the <strong>Prince of Swords</strong>, heir to the Brotherhood's leadership — yet he left ~18–24 months ago for reasons unknown (not exiled, not cast out), taking solo contracts across the south in search of purpose.</p>

<h3>Close — Attican's patrol</h3>
<p>Attican flies a night patrol on Shira, ~2,500 ft above the western cliffs. He spots only a harmless trade caravan. He is joined by the silent spirit of his late uncle — the former High Falconer who taught him this route — as other great birds dot the sky. Shira tells him, "You need some friends"; he replies he has the knights and her. End of session.</p>

<h3>Open threads</h3>
<ul>
<li>The runic blood-box and its true purpose; the stolen "black ledger" and Kazar Askelen's dark-magic ambitions.</li>
<li>The twin steamships — who controls the second?</li>
<li>Phaedra's prophecy: Fire Lake burning, doom for the prince; the deer-headed death-figure who knows Galeth; Rhaegar's storm-vision.</li>
<li>Rising tensions with Selkina; the journey to Esmerath ahead.</li>
<li>Context: Attican's home, Falcon's Rest, ancestral seat of the Falconeers, was destroyed ~14–15 months ago by Kazar Askelen — a former Phoenix rider of the Donflame turned terrorist. Attican is the unofficial "last Falconeer."</li>
</ul>
`.trim();

const charactersHtml = `
<p><strong>The High Council</strong> — the party Manfred travels with</p>
<ul>
<li><strong>Rhaegar Blackblade</strong> — Manfred's lifelong friend ("brother") and now his direct superior: the Blade of the King, commander of the reinstated Dark Knights. A Blood Knight (~50, looks younger), feared for unnatural senses; rides the wolf Kenra.</li>
<li><strong>Galeth Holgar</strong> — Blood Knight (19th), a giant red-haired warrior; travels with a bear. Council ally; once met a death-figure in a bloodletting vision.</li>
<li><strong>Gaius Kratik</strong> — Maester to Prince Tobin, now Lord Protectorate; former war-table commander; one eye. Council ally.</li>
<li><strong>Attican</strong> — the High Falconer, unofficial "last Falconeer"; rides the falcon Shira; young and withdrawn since his home Falcon's Rest was destroyed. Manfred's new comrade.</li>
<li><strong>Cato Tulken &amp; Jeffrey Vangmore</strong> — co-founders of Golden Basin Goods (shipping); Lords of Negotiation. The council travels under their banner.</li>
</ul>

<p><strong>The Court of Highrock</strong></p>
<ul>
<li><strong>King Trask Brolin</strong> — High King of Lorenthar (House Brolin, bear sigil); granted Manfred the title Dark Knight and knows his true name, Endrun Ukinri.</li>
<li><strong>Prince Tobin Brolin</strong> — 16-year-old heir who has never left the city; the council must protect him on the road to Esmerath.</li>
<li><strong>Caradoc Maxim</strong> — Blood Knight, Brigadier General; reinstated the Dark Knights under Rhaegar's command.</li>
<li><strong>Fraedon Aloware</strong> — High Steward to the King; knows Manfred's history.</li>
<li><strong>Scostodos Felimar</strong> — Commander of the Throne Sword (royal guard).</li>
<li><strong>Phaedra</strong> — the King's secret Blood Witch beneath the castle; prophesied doom for the prince and that "Fire Lake shall burn."</li>
</ul>

<p><strong>Beyond Highrock</strong></p>
<ul>
<li><strong>Princess Palara Branthorp</strong> — heir to Esmerath, soon Lady of Fire Lake; the council journeys to witness her ascension.</li>
<li><strong>Veronica Burigog</strong> — Esmerathian noble and painter; a Golden Basin Goods contact.</li>
<li><strong>Lady Elowen</strong> — aviary commander at the Next Hollow who aided Galeth's artifact recovery.</li>
<li><strong>Dolly</strong> — friendly keeper of the Saltmeat tavern in Manfred's Tidewash neighborhood.</li>
<li><strong>Aaron</strong> — Manfred's close friend, not seen since Sansori; only exchanged letters.</li>
</ul>

<p><strong>Antagonists</strong></p>
<ul>
<li><strong>Kazar Askelen, "the Black Rider"</strong> — rogue Phoenix rider turned terrorist; destroyed Falcon's Rest; his raiders carried the runic artifact and are tied to the stolen "black ledger" and dark magic.</li>
<li><strong>Norvale raiders</strong> — free plainsfolk who raid caravans near Esmerath.</li>
</ul>

<p><em>Manfred's identities: Manfred Highrock / Endrun Ukinri — orphan of the Tidewash, former Prince of Swords of the Brotherhood of Swords (left ~2 years ago), now Dark Knight of Lorenthar under Rhaegar.</em></p>
`.trim();

const claudeNotes = {
  sessions: [
    {
      id: "s1-1224-primar",
      title: "Session 1 — The High Council",
      html: summaryHtml,
    },
  ],
  activeId: "s1-1224-primar",
};

const characters = { html: charactersHtml };

const esc = (obj) => JSON.stringify(obj).replace(/'/g, "''");

export default {
  id: "0010_session1_notes",
  statements: [
    `INSERT INTO app_state (key, value, updated_at, updated_by)
     VALUES ('claudeNotes', '${esc(claudeNotes)}', '2026-09-02T00:00:00.000Z', 'claude')
     ON CONFLICT(key) DO NOTHING`,
    `INSERT INTO app_state (key, value, updated_at, updated_by)
     VALUES ('characters', '${esc(characters)}', '2026-09-02T00:00:00.000Z', 'claude')
     ON CONFLICT(key) DO NOTHING`,
  ],
};
