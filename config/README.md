# Projectconfig

De projectzip bevat twee Config-lagen:

1. `default-config.json` is de meegeleverde OGN Basis-standaard.
2. `user-config.json` bevat de keuzes van de gebruiker en overschrijft dezelfde
   instellingen uit de standaardconfig.

De bestanden blijven naast elkaar staan. De user-config wist of vervangt de
standaardconfig dus niet fysiek.

## Actuele browser-Config in het project bewaren

1. Start de uitgepakte viewer via `start_local_viewer.bat`.
2. Stel Config naar wens in.
3. Gebruik eventueel `Ja · bewaar config` voor een browsersnapshot.
4. Open `Bestanden & export`.
5. Kies `Schrijf huidige Config naar project`.
6. Controleer dat de status `config/user-config.json` noemt.
7. Maak daarna de volledige projectzip.

De lokale server schrijft uitsluitend naar een kleine vaste lijst
projectbestanden; voor deze functie is alleen `config/user-config.json`
toegevoegd.

Op GitHub Pages of een andere gewone webserver kan de browser niet in de
projectmap schrijven. Gebruik daar `Download user-config` en plaats het
gedownloade bestand handmatig als `config/user-config.json`.

## Laadvolgorde

De viewer past de lagen in deze volgorde toe:

```text
ingebouwde code-defaults
→ config/default-config.json
→ config/user-config.json (alleen enabled=true)
→ lokaal bewaarde browser-Config op dit apparaat
```

De laatste beschikbare laag heeft voor dezelfde instelling voorrang. Een
browser-Config reist niet vanzelf mee; daarvoor moet hij eerst naar
`config/user-config.json` worden geschreven.

## Nieuwe weergave- en moduswaarden

Dezelfde lagen bewaren ook:

- `placementMode`: `language-tree`, `multi-ogn-anaphor`, `greedy-grow` of
  `random`; standaard blijft `language-tree`;
- `anaphorCombinationId` en `anaphorCombinations`: de actieve en beschikbare
  S1–S2-combinaties;
- `anaphorLexicalizations`: het lexiconprofiel per combinatie voor de primaire
  coreferentiële S2-Text-bron; andere relaties bewaren hun eigen profiel;
- `anaphorFlipVariants`: per combinatie een map van branch-id naar `auto`,
  `normal`, `left-right`, `short-long` of `both`. `auto` laat de gezamenlijke
  solver alle vereiste Text-coreferenties en één starre S2-shift tegelijk
  oplossen;
- `gridColor` en `gridLineWeight`;
- `projectionLineWeight` en `boxLineWeight`;
- `lexProjectionColor`, `syntProjectionColor` en `logProjectionColor`.

Voor de twee directe OGN-illustraties zijn drie geïsoleerde, geneste blokken
toegevoegd:

- `directPlacementGeneral`: aantal knopen per run, Play-snelheid, groeipad,
  knoopnummers, diagnostiek, knoopgrootte en rastermarge;
- `greedyGrowConfig`: uitsluitend strategie en oriëntatie;
- `randomPlacementConfig`: uitsluitend seed, resetbeleid, spreiding, aantal
  complete iteraties en asbeeldmodus (`off`, `occupancy` of `relative`).

Deze drie blokken worden tussen standaard- en user-config per sleutel
samengevoegd. Een gedeeltelijke user-config kan daardoor één instelling
overschrijven zonder de overige standaardwaarden in hetzelfde blok te wissen.
De browser-Config bewaart steeds het volledige genormaliseerde blok.

Eén Random-iteratie is één complete run met het algemene aantal knopen. De
centrale knoop telt niet mee: 10 iteraties met 31 knopen leveren dus
10 × 30 = 300 waarnemingen per as. `occupancy` deelt de telling per coördinaat
door het aantal iteraties; `relative` deelt door de hoogste telling in de
actuele steekproef. Deze diagnostische afgeleide gebruikt een vaste seedreeks
en bewaart of kiest geen toekomstige plaats voor de actieve directe run. Zie
`../DIRECT_PLACEMENT_CONFIG.md`.

Oudere rc.45-configs met `directPlacementPresentation`, methodegebonden
`targetCount`/`intervalMs`, `repeatCount` of `showAxisPattern` worden bij het
laden gemigreerd. Een nieuwe save schrijft alleen de drie actuele blokken.

De drie lijngewichten gebruiken `light`, `normal` of `strong`. Deze waarden
sturen uitsluitend kleur, lijnbreedte en dekking; zij wijzigen geen
gridcoördinaten of OGN-plaatsingsregels.

## Releasegrens

Beide JSON-bestanden horen in iedere projectzip. Controleer vóór publicatie dat
hun `version` gelijk is aan `VERSION.txt`. Ingesloten LEESMIJ-beelden kunnen
`user-config.json` groter maken; de viewer begrenst bestandsgrootte en totale
lokale opslag.
