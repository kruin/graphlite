# Hervatbare OGN-snapshots

Een Graphlite-snapshot is geen afbeelding maar een heropenbaar `.ogn`-
werkcheckpoint. De gebruiker bewaart de graph nadat acties de representatie
hebben veranderd en kan later vanaf dezelfde PLAY-stap doorgaan.

## Bediening

De vaste PLAY-balk bevat **Snapshot opslaan** en **Snapshot openen**. Opslaan
toont eerst:

1. de actieve syntax-/functionele view en named projections;
2. maximaal acht recente relevante graph-acties uit de paradata;
3. minstens drie dynamische bestandsnaamvoorstellen;
4. een vrij bewerkbaar veld voor de definitieve naam.

De gebruiker kiest of combineert views en acties. Namen bevatten daarnaast de
PLAY-stap en een lokaal volgnummer, zodat meerdere checkpoints herkenbaar
naast elkaar kunnen bestaan.

Het naamvenster kan aan zijn titelbalk worden versleept, zodat de gebruiker de
graph tijdens het kiezen van views, acties en bestandsnaam kan blijven zien.

**Snapshot openen** vraagt om een lokaal `.ogn`-bestand en maakt daarna binnen
de bestaande app een zelfstandig Graphlite-snapshotvenster. Dat venster is
verplaatsbaar en via de rechteronderhoek schaalbaar. Het bevat een eigen viewer
en PLAY-toestand; de oorspronkelijke graph blijft erachter ongewijzigd.

Op GitHub Pages blijft dit volledig browserlokaal: het hoofdvenster leest het
bestand en draagt de inhoud via een same-origin browserbericht aan de interne
viewer over. Er wordt niets naar een server geüpload en er is geen
popup-toestemming nodig.
Bij een fout blijft een leesbare melding in de interface staan; JavaScriptfouten
verschijnen in de browserconsole en niet in het DOS-venster van de lokale server.

## Opslagcontract

Snapshots nemen paradata verplicht mee. `paradata.snapshot` gebruikt schema
`ogn-resumable-view-snapshot-v1` en bevat `view`, `analysis_state`, `play`,
`naming` en bij directe plaatsing `direct_placement`. Gewone OGN-documenten
kunnen paradata nog steeds uitsluiten.

Bij import worden timers niet gestart. De viewer reconstrueert eerst graph en
view, zet PLAY op de opgeslagen stap en wacht op de gebruiker. De volgende
klik op Play vervolgt de actieve Language Tree-, multi-OGN-, Greedy Grow- of
Random-sequentie.

De `.ogn` bewaart daarvoor bewust het **volledige graphmodel** én afzonderlijk
de zichtbare PLAY-stap. Het volledige model maakt verder PLAY-en mogelijk; het
is niet de aanvankelijke zichtbare toestand. Een snapshot op stap 7 van 15
opent dus met alleen stap 7 zichtbaar. Het interne venster vraagt het document
pas op nadat zijn eigen asynchrone initialisatie volledig is afgerond, zodat de
opgeslagen stap niet door de standaardstart wordt overschreven.
