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

- `placementMode`: `language-tree`, `greedy-grow` of `random`; standaard blijft
  `language-tree`;
- `gridColor` en `gridLineWeight`;
- `projectionLineWeight` en `boxLineWeight`;
- `lexProjectionColor`, `syntProjectionColor` en `logProjectionColor`.

De drie lijngewichten gebruiken `light`, `normal` of `strong`. Deze waarden
sturen uitsluitend kleur, lijnbreedte en dekking; zij wijzigen geen
gridcoördinaten of OGN-plaatsingsregels.

## Releasegrens

Beide JSON-bestanden horen in iedere projectzip. Controleer vóór publicatie dat
hun `version` gelijk is aan `VERSION.txt`. Ingesloten LEESMIJ-beelden kunnen
`user-config.json` groter maken; de viewer begrenst bestandsgrootte en totale
lokale opslag.
