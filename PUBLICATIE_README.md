# OpenGraph Lite Viewer rc.45 · publicatiecarrousel

Dit bestand hoort bij de projectzip van **v2.0.0-rc.45**. De carrousel legt
Open Graph Notation in deze volgorde uit:

1. gridlijnbezit en vrije posities;
2. direct, één-voor-één schrijven;
3. projectie van geplaatste knopen naar **WEST**, **SOUTH** en **EAST**;
4. twee concrete voorbeelden: **Direct — Greedy Grow** en
   **Calculated — Language Tree**.

Daarboven staat één harde regel die voor iedere echte OGN-knoop geldt:

```text
A ≠ B  ⇒  x(A) ≠ x(B)  én  y(A) ≠ y(B)
```

Leesbaar gezegd: **twee verschillende knopen delen nooit een horizontale of
verticale gridlijn**. Dit geldt ook wanneer een toepassing knopen toevoegt of
verplaatst. Projectiemerkers en gestippelde vrije plaatsen zijn markeringen,
geen extra knopen.

Een overtreding heet **gridlijnhergebruik**: horizontaal hergebruik deelt een
rij; verticaal hergebruik deelt een kolom. Beide zijn ongeldig.

Greedy Grow staat als **geaccepteerde reconstructie** in de reeks. Slide 5
wordt rechtstreeks uit `greedy-grow-engine.js` afgeleid: de compacte
vierarmige schrijfvolgorde reproduceert de bewaarde demo's van 12, 31 en 96
knopen exact. Iedere stap schrijft direct één knoop en bewaart geen toekomstig
eindbeeld. “Compact” is geen claim van wereldwijd optimale veldomtrek. De
gebruiker heeft rc.45 en deze afbakening op 2 augustus 2026 handmatig
goedgekeurd; de versienaam blijft technisch een release candidate.

## Direct plaatsbare carrousel

Upload deze zeven PNG-bestanden in nummer-volgorde:

```text
publicatie-carrousel/slides/01-every-node-owns-grid-lines.png
publicatie-carrousel/slides/02-free-places-first.png
publicatie-carrousel/slides/03-one-node-at-a-time.png
publicatie-carrousel/slides/04-node-projection-west-south-east.png
publicatie-carrousel/slides/05-direct-placement-greedy-grow.png
publicatie-carrousel/slides/06-calculated-placement-language-tree.png
publicatie-carrousel/slides/07-core-first-examples-follow.png
```

Iedere slide is **1080 × 1080** pixels, heeft een zichtbaar volgnummer en
gebruikt dezelfde vormgeving. De reeks is Engelstalig, zodat hij direct in
een internationale technische community kan worden geplaatst.

De bewerkbare bron staat in
[`publicatie-carrousel/index.html`](publicatie-carrousel/index.html).
Dit is de enige bewerkbare beeldbron. De PNG's en de carrouselzip zijn altijd
afgeleiden en worden nooit rechtstreeks aangepast.

**Alleen publiceren:** gebruik de meegeleverde zeven PNG's. Je hoeft dan geen
batchbestand te draaien en geen extra programma te installeren.

**Zelf aanpassen en opnieuw afleiden op Windows:** werk bij voorkeur in de
uitgepakte **volledige projectzip**, zodat je wijziging daarna ook in de
projectzip terechtkomt.

1. Draai in die uitgepakte map éénmalig
   `installeer-carrousel-tools.bat`. Hiervoor is internet nodig. Het installeert
   lokaal de vastgezette Playwright-versie en de bijbehorende Chromium-browser.
   Node.js 18 of hoger is vereist; Node.js 18.14 voldoet.
2. Bewerk uitsluitend `publicatie-carrousel/index.html`.
3. Draai `maak-publicatie-carrousel.bat`. Dit genereert alle zeven PNG's,
   schrijft `publicatie-carrousel/derived-manifest.json`, controleert de hashes
   en vervangt de carrouselzip naast de uitgepakte map.
4. Controleer de zeven PNG's handmatig.
5. Draai vanuit de volledige projectmap daarna `maak-volledige-zip.bat` om ook
   de projectzip te vervangen.

De losse carrouselzip kan met dezelfde twee batchbestanden zelfstandig opnieuw
worden afgeleid. Dat verandert echter niet automatisch een elders uitgepakte
projectmap of projectzip. Voor blijvende projectwijzigingen is de volledige
projectmap daarom de hoofdbron. Een browser-downloadnaam als ` (6)` wordt bij
de nieuwe carrouselzip niet overgenomen. `node_modules` en de browsercache zijn
lokaal installatiegereedschap en worden niet mee ingepakt.

`maak-volledige-zip.bat` blokkeert een verouderde of handmatig gewijzigde
slideset. Een geldige hash bewijst geen leesbaarheid of inhoudelijke juistheid.

## Plaatsen op Reddit

1. Controleer de regels en zelfpromotierichtlijnen van de gekozen subreddit.
2. Kies **Images & Video** en selecteer de zeven PNG's tegelijk.
3. Controleer de uploadvolgorde **01 → 07**.
4. Gebruik de titel en begeleidende tekst uit de sectie **Reddit**.
5. Voeg waar mogelijk de alt-tekst van iedere slide toe.
6. Controleer het concept op telefoon en desktop.

Toont de gekozen Reddit-interface bij een image/gallery post geen tekstveld,
plaats de begeleidende tekst dan als eerste reactie, voor zover de
communityregels dat toestaan.

Niet iedere community staat afbeeldingen of meerdere afbeeldingen toe. Reddit
noemt een bericht met meerdere beelden een gallery post; de community moet die
mogelijkheid toestaan. Zie de actuele officiële uitleg over
[communityinstellingen](https://support.reddithelp.com/hc/en-us/articles/15484546290068-Community-settings)
en [een bericht maken](https://support.reddithelp.com/hc/en-us/articles/360060422572-How-do-I-post-and-comment-on-Reddit).

## Alt-teksten per slide

1. **Gridlijnbezit:** Donkerblauwe definitiekaart: iedere knoop bezit één
   horizontale en één verticale gridlijn; geen andere knoop gebruikt die lijnen.
2. **Vrij en bezet:** Open grid met drie knopen op unieke binnenrijen en
   kolommen. De onderste gridrij is leeg. De drie gestippelde vrije posities
   staan eveneens elk op een andere rij en kolom.
3. **Direct schrijven:** Driestapsproces: bezetting lezen, ruleset toepassen,
   de eerstgevonden geldige plek direct schrijven en daarna herhalen.
4. **Projectie:** Drie geplaatste knopen blijven op hun gridpositie. A wordt
   naar WEST geprojecteerd, B naar SOUTH en C naar EAST.
5. **Direct — Greedy Grow:** Uit de geaccepteerde engine afgeleid grid met de
   eerste twaalf genummerde dots van de compacte vierarmige volgorde, plus een
   zichtbare verwijzing naar `github.com/kruin/graphlite`.
6. **Calculated — Language Tree:** Het laatste stadium van de boom voor
   `HOND BIJT MAN`; de woorden staan als `HOND · BIJT · MAN` op de westelijke
   LEX-as. Ook dit voorbeeld verwijst zichtbaar naar GitHub.
7. **Samenvatting:** Donkerblauwe afsluiting met gridlijnbezit, de drie
   projectieassen en de twee concrete voorbeelden.

## Vaste projectlinks

- Live viewer: <https://kruin.github.io/graphlite/>
- GitHub, **Direct — Greedy Grow**: <https://github.com/kruin/graphlite>
- GitHub, **Calculated — Language Tree**: <https://github.com/kruin/graphlite>

De carrousel- en platformteksten bevatten geen URL-placeholders. Voeg later
alleen een videolink toe wanneer er daadwerkelijk een video beschikbaar is.

Controleer daarna in een privévoorbeeld of testpost of links,
regelafbrekingen, alt-teksten en hashtags goed worden weergegeven.

## Feiten die in deze release kloppen

- Open Graph Notation gebruikt een open grid met vrije posities.
- Iedere geplaatste knoop bezit een eigen horizontale én verticale gridlijn.
- OGN schrijft bij directe plaatsing één knoop per stap; iedere stap begint met
  de bezetting die eerdere stappen hebben achtergelaten.
- Een ruleset bepaalt welke vrije posities geldig zijn.
- Een zoekstrategie bepaalt in welke volgorde kandidaatposities worden getest;
  de eerstgevonden geldige positie wordt direct geschreven.
- **Greedy Grow** begint bij het centrale gridpunt en schrijft dots één voor
  één. De geaccepteerde compacte vierarmige volgorde reproduceert de bewaarde
  12/31/96-demo's exact. De overige meegeleverde zoekvolgorden zijn
  experimentele vergelijkingen. De veldomtrek is diagnostiek en geen bewezen wereldwijd optimum.
- Greedy Grow maakt niet vooraf een volledig plaatsingsplan.
- Projectie wordt van een reeds geplaatste knoop afgeleid. De knoop blijft op
  zijn gridpositie; de projectiemarkering verschijnt op WEST, SOUTH of EAST.
- **Direct — Greedy Grow** is het directe voorbeeld in de carrousel.
- **Calculated — Language Tree** is het berekende voorbeeld. Slide 6 toont
  `HOND BIJT MAN` in het laatste stadium met `HOND · BIJT · MAN` op de LEX-as.
- rc.45 is op 2 augustus 2026 handmatig goedgekeurd. De versienaam blijft een
  release candidate en is geen definitieve stabiele release.

## LinkedIn · Nederlands

```text
OpenGraph Lite Viewer v2.0.0-rc.45 is beschikbaar als handmatig goedgekeurde release candidate.

Open Graph Notation gebruikt een open grid. Iedere knoop bezit een eigen horizontale en verticale gridlijn. Bij directe plaatsing schrijft OGN knopen één voor één op vrije, geldige posities.

Geplaatste knopen kunnen worden geprojecteerd naar drie assen: WEST, SOUTH en EAST. De knoop blijft daarbij op zijn gridpositie.

Direct — Greedy Grow. Slide 5 toont de eerste twaalf dots van de geaccepteerde compacte vierarmige enginevolgorde.
GitHub: https://github.com/kruin/graphlite

Calculated — Language Tree. Slide 6 toont HOND BIJT MAN in het laatste stadium, met HOND · BIJT · MAN op de westelijke LEX-as.
GitHub: https://github.com/kruin/graphlite

Live viewer: https://kruin.github.io/graphlite/

Zijn de drie projectieassen en beide voorbeelden in één oogopslag helder?

#OpenGraph #GraphVisualization #Notation #OpenSource
```

## LinkedIn · English

```text
OpenGraph Lite Viewer v2.0.0-rc.45 is available as a manually approved release candidate.

Open Graph Notation uses an open grid. Every node owns one horizontal and one vertical grid line. In direct placement, OGN writes nodes one at a time into free, valid positions.

Placed nodes can project to three axes: WEST, SOUTH and EAST. The node remains on its grid position.

Direct — Greedy Grow. Slide 5 shows the first twelve dots of the accepted compact four-arm engine order.
GitHub: https://github.com/kruin/graphlite

Calculated — Language Tree. Slide 6 shows the final HOND BIJT MAN stage, with HOND · BIJT · MAN on the west LEX axis.
GitHub: https://github.com/kruin/graphlite

Live viewer: https://kruin.github.io/graphlite/

Are the three projection axes and both examples clear at a glance?

#OpenGraph #GraphVisualization #Notation #OpenSource
```

## Reddit

Aanbevolen titel:

```text
[Project] Open Graph Notation: one node at a time on a free grid
```

Aanbevolen tekst:

```text
I am developing OpenGraph Lite Viewer, a browser-based viewer and test environment for Open Graph Notation (OGN).

The core starts with an open grid. Every node owns one horizontal and one vertical grid line. In direct placement, the current occupancy is read, a rule set filters valid free positions, a search strategy tests candidates, and the first valid position found is written immediately.

Placed nodes can project to WEST, SOUTH and EAST. Each node remains on its grid position while its projection appears on the selected axis.

Direct — Greedy Grow. Slide 5 is generated from the accepted engine and shows its first twelve dots.
GitHub: https://github.com/kruin/graphlite

Calculated — Language Tree. Slide 6 shows the final HOND BIJT MAN tree, with HOND · BIJT · MAN moved onto the west LEX axis.
GitHub: https://github.com/kruin/graphlite

v2.0.0-rc.45 was manually approved on 2 August 2026. I would still appreciate criticism of:
1. whether grid-line ownership and free positions are clear;
2. whether the three dashed free positions on slide 2 read as separate choices;
3. whether WEST, SOUTH and EAST read clearly as projection axes;
4. whether Greedy Grow and the HOND BIJT MAN Language Tree are sufficient as the two placement examples;
5. the mobile and desktop presentation.

Demo: https://kruin.github.io/graphlite/
GitHub: https://github.com/kruin/graphlite

Disclosure: I am the developer and am asking for technical feedback.
```

Plaats de zeven beelden als gallery, niet als zeven losse berichten. Pas de
titel aan de gemeenschap aan en plaats geen identieke tekst in veel subreddits
tegelijk.

## Facebook

```text
Nieuwe testversie: OpenGraph Lite Viewer v2.0.0-rc.45.

Open Graph Notation schrijft bij directe plaatsing knopen één voor één op een open grid. Iedere knoop bezit een eigen horizontale en verticale gridlijn. Een ruleset bepaalt welke vrije plekken geldig zijn; een zoekstrategie bepaalt welke kandidaat het eerst wordt getest.

De nieuwe projectieslide toont geplaatste knopen naar WEST, SOUTH en EAST.

Direct — Greedy Grow: de eerste twaalf dots uit de geaccepteerde engine.
GitHub: https://github.com/kruin/graphlite

Calculated — Language Tree: HOND BIJT MAN in het laatste stadium, met HOND · BIJT · MAN op de westelijke LEX-as.
GitHub: https://github.com/kruin/graphlite

Probeer de viewer: https://kruin.github.io/graphlite/

Dit is een handmatig goedgekeurde release candidate. Ervaringen op telefoon én groot scherm blijven welkom.
```

## YouTube

Titel:

```text
Open Graph Notation: nodes, projection and placement examples
```

Beschrijving:

```text
Demonstratie van OpenGraph Lite Viewer v2.0.0-rc.45.

In de video:
00:00 Iedere knoop bezit zijn gridlijnen
00:00 Vrije en bezette posities
00:00 Eén knoop direct schrijven en het grid bijwerken
00:00 Projectie naar WEST, SOUTH en EAST
00:00 Direct — Greedy Grow
00:00 Calculated — Language Tree: HOND BIJT MAN op de LEX-as
00:00 Config, mobiel en desktop

Vervang de tijden na montage door de werkelijke hoofdstuktijden.

Live viewer: https://kruin.github.io/graphlite/
GitHub bij Greedy Grow: https://github.com/kruin/graphlite
GitHub bij Language Tree: https://github.com/kruin/graphlite

Versie: v2.0.0-rc.45 (handmatig goedgekeurde release candidate)
Afzender: Kruin

#OpenGraph #GraphVisualization #Notation #OpenSource
```

Vastgezette reactie:

```text
Wat is nog niet helder: de drie projectieassen, Greedy Grow of de Language Tree met LEX-verplaatsingen? Vermeld ook of je op mobiel of desktop keek.
```

## Bluesky / Mastodon / X

Korte tekst:

```text
OpenGraph Lite Viewer v2.0.0-rc.45: iedere knoop bezit eigen gridlijnen. Projectie gaat naar WEST, SOUTH of EAST. Direct — Greedy Grow. Calculated — Language Tree, met HOND · BIJT · MAN op de LEX-as.

https://kruin.github.io/graphlite/
https://github.com/kruin/graphlite

#OpenGraph #GraphVisualization #OpenSource
```

Maak voor X zo nodig een tweede bericht met de bronlink. Voeg op Mastodon
beeldbeschrijvingen toe en plaats lange technische details liever in een
vervolgbericht.

## GitHub-releasebeschrijving

```text
## OpenGraph Lite Viewer v2.0.0-rc.45

Manually approved release candidate (2 August 2026).

### Reorganized OGN explanation

- OGN direct placement writes one node at a time into a valid free position.
- Every node owns one horizontal and one vertical grid line.
- Rule sets determine validity; search strategies determine candidate order.
- Greedy Grow starts at the central grid point and writes immediately.
- Its accepted compact four-arm order exactly reproduces the preserved 12-, 31- and 96-node demos.
- The publication slide is derived from the same engine; field perimeter remains diagnostic rather than a proven global optimum.
- Placed nodes project to WEST, SOUTH and EAST while remaining on their grid positions.
- Direct example: Greedy Grow, derived from the accepted engine.
- Calculated example: the final HOND BIJT MAN Language Tree with HOND · BIJT · MAN on the west LEX axis.

### Documentation and publication

- Reorganized seven-slide publication carousel.
- Slide 2 uses three dashed free positions on separate rows and columns.
- Slide 4 shows nodes projecting to WEST, SOUTH and EAST.
- Slide 5 is generated from the accepted Greedy Grow engine order and links to `github.com/kruin/graphlite`.
- Slide 6 shows the final HOND BIJT MAN Language Tree with its moved LEX words and links to the same GitHub project.
- Updated alt text and platform-ready copy in `PUBLICATIE_README.md`.
- Updated automated checks for content, filenames, slide count and dimensions.

### Preserved

- Existing Config and project-level user-config overlay.
- Editable README topics with Show: yes/no.
- Shared Config save controls.

### Test

Use the included release and rc.45 test scripts. Manual approval was recorded on 2 August 2026 for desktop, mobile portrait, mobile landscape and the accepted Greedy Grow reconstruction.
```

## Beeld en toegankelijkheid

- Houd de zeven beelden bij elkaar en behoud de nummer-volgorde.
- Controleer ieder beeld afzonderlijk op leesbaarheid; vertrouw niet alleen op
  de kleine gallery-voorvertoning.
- Gebruik de zeven concrete alt-teksten uit dit bestand.
- Controleer voor publicatie of beeld, tekst, live URL en download allemaal
  **v2.0.0-rc.45** tonen.
