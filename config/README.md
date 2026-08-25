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

Voor de twee directe OGN-illustraties zijn drie geïsoleerde, geneste blokken
toegevoegd:

- `directPlacementGeneral`: aantal knopen per run, Play-snelheid, groeipad,
  knoopnummers, diagnostiek, knoopgrootte en rastermarge;
- `greedyGrowConfig`: uitsluitend strategie en oriëntatie;
- `randomPlacementConfig`: seed, resetbeleid, Random-model, plaatsing,
  gridgrootte, vaste kolommen/rijen, aantal complete iteraties en asbeeldmodus
  (`off`, `occupancy` of `relative`). Random-snelheid gebruikt de gedeelde
  `directPlacementGeneral.intervalMs` en wordt niet dubbel opgeslagen.

Deze drie blokken worden tussen standaard- en user-config per sleutel
samengevoegd. Een gedeeltelijke user-config kan daardoor één instelling
overschrijven zonder de overige standaardwaarden in hetzelfde blok te wissen.
De browser-Config bewaart steeds het volledige genormaliseerde blok.

Eén Random-iteratie is één complete run met het algemene aantal knopen. De
centrale knoop telt niet mee: 10 voltooide iteraties met 31 knopen leveren dus
10 × 30 = 300 projectie-hits per as. Een ronde wordt pas na haar laatste knoop
aan de WEST- en SOUTH-spots toegevoegd. `occupancy` deelt de hittelling per
coördinaat door het ingestelde iteratietotaal; `relative` deelt door de hoogste
telling onder de voltooide rondes. Deze diagnostische afgeleide gebruikt een
vaste seedreeks en genereert, bewaart of kiest geen toekomstige plaats voor de
actieve directe run. Zie
`../DIRECT_PLACEMENT_CONFIG.md`.

Random Config toont alleen zijn eigen bewerkbare waarden. Vaste kolommen en
rijen zijn no-show tenzij `maxDimensions: "fixed"` actief is. Ieder zichtbaar
veld heeft een compacte uitleg volgens `../CONFIG_UI_EXPLANATION_STANDARD.md`;
formules en tellingen staan in Help en de genoemde documentatie. `Play` en
`Next` lopen door naar de volgende run totdat `iterationCount` is bereikt;
`Previous` kan reproduceerbaar over een rungrens terug.

Bij een nieuwe standaardconfig is `spread: "available"`: iedere stap kiest
ergens in de hele nog beschikbare rechthoek. `maxDimensions: "interface"`
leidt die vaste rechthoek bij Reset af uit de interface. De bestaande waarden
`compact`, `balanced`, `wide` en `content` blijven geldig; opgeslagen keuzes
worden niet automatisch vervangen en latere waarden kunnen worden toegevoegd.

`distribution: "uniform-v1.0"` blijft de standaard. De functionele waarde
`"impure-repeat-v0.1"` mengt 20% herhaalgewicht uit voltooide eerdere as-hits.
`fixedColumns` en `fixedRows` zijn standaard 48 en worden in de engine minimaal
gelijk aan het aantal knopen per run. Seed is begrensd op 1 t/m 4.294.967.295;
`20260802` is een datumseed en geen hoeveelheid toeval of snelheid.

Oudere rc.45-configs met `directPlacementPresentation`, methodegebonden
`targetCount`/`intervalMs`, `repeatCount` of `showAxisPattern` worden bij het
laden gemigreerd. Een nieuwe save schrijft alleen de drie actuele blokken.

De drie lijngewichten gebruiken `light`, `normal` of `strong`. Deze waarden
sturen uitsluitend kleur, lijnbreedte en dekking; zij wijzigen geen
gridcoördinaten of OGN-plaatsingsregels.

## Actief LEX-profiel

Projectconfig bewaart geen generieke lege LEX-kandidaten. `lexOpenSlotCount`
en `lexOpenSlotPlacement` zijn vervallen compatibiliteitsvelden en worden bij
het laden genegeerd. Vóór, na en tussen blijven no-show totdat hun gebruik
afzonderlijk is geëvalueerd.

Actief zijn uitsluitend upward-Wissels vanaf de zichtbare bronhoogte,
toepassingsgebonden inserties en direct Comp. Zinsoort wordt in OPN bij het
voorbeeld opgeslagen, niet als algemene projectconfig: hoofdzin, ja/nee-vraag,
dat-zin of omdat-zin. Zie `../LEX_MOVEMENT_RULES.md`.

## Releasegrens

Beide JSON-bestanden horen in iedere projectzip. Controleer vóór publicatie dat
hun `version` gelijk is aan `VERSION.txt`. Ingesloten LEESMIJ-beelden kunnen
`user-config.json` groter maken; de viewer begrenst bestandsgrootte en totale
lokale opslag.
