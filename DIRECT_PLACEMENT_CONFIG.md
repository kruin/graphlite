# Config voor directe plaatsing

Status: technisch contract voor source build
`v2.0.0-rc.45-sources-language-tree-anafoor-extensie-20260821.13`.

## Drie gescheiden Configcontexten

De actieve plaatsingsmodus bepaalt welke Config opent:

1. **Language Tree → Config → Direct** toont uitsluitend **Algemeen**: de
   instellingen die voor Greedy Grow én Random gelden;
2. **Greedy Grow → Config** opent rechtstreeks met uitsluitend de twee eigen
   Greedy-instellingen;
3. **Random → Config** opent rechtstreeks met uitsluitend de vijf eigen
   Random-instellingen en de berekende as-impact.

Greedy en Random hebben dus geen submenu waarmee naar Algemeen, de andere
methode of de overige projectconfig kan worden gegaan. Ook de algemene
Config-tabbladen, taal/README-bediening, algemene Configuitleg, Toon-knoppen,
methode-resetknoppen, configlogknop en algemene statusregels zijn daar
verborgen. Alleen **Terug naar Main**, de eigen velden en de eerder vereiste
Config-save blijven zichtbaar.

Language Tree blijft de primaire berekende toepassing; Anafoor · multi-OGN is
de tweede berekende toepassing volgens `MULTI_OGN_ANAPHOR.md`; Greedy Grow en
Random blijven directe OGN-illustraties.

## Algemeen

| Optie | Waarden | Effect |
|---|---|---|
| Knopen per run | 12, 31, 48 of 96 | Geldt voor één Greedy-run én voor één complete Random-iteratie. |
| Play-snelheid | 1,2 s, 0,65 s, 0,3 s of 0,14 s | Tijd tussen twee direct geschreven knopen. |
| Groeipad | tonen / verbergen | Verbindt reeds geschreven knopen in schrijfvolgorde. |
| Knoopnummers | tonen / verbergen | Toont de stapindex in iedere knoop. |
| Diagnostiek | tonen / verbergen | Toont veldmaat en omtrek. |
| Knoopgrootte | klein / normaal / groot | Verandert alleen de cirkelstraal. |
| Rastermarge | compact / normaal / ruim | Reserveert 1, 1,5 of 3 cellen rond het veld. |

Deze keuzes horen niet in Random-config of Greedy-config, omdat zij voor beide
methoden dezelfde betekenis hebben.

## Greedy Grow

Greedy toont uitsluitend twee Configvelden:

- zoekstrategie: vierarmige referentie, dicht bij centrum, ring voor ring,
  kwadranten spreiden of grootste draai eerst;
- oriëntatie: origineel, 90° rechtsom, 180° of 90° linksom.

Oriëntatie draait alleen de afgeleide afbeelding. De geaccepteerde historische
Greedy-engine en kandidaatvolgorde blijven ongewijzigd. Herhaling is voor de
huidige Greedy-strategieën statistisch niet zinvol: dezelfde strategie,
startknoop en algemene runlengte leveren exact hetzelfde resultaat.

## Random: eigen instellingen

Random toont uitsluitend vijf Configvelden, gevolgd door de berekende
as-impact:

| Optie | Betekenis |
|---|---|
| Seed | Startwaarde van de reproduceerbare toevalsreeks. |
| Resetbeleid | Dezelfde seed opnieuw gebruiken of bij Reset naar de volgende vaste seed gaan. |
| Spreiding | Compact, Gebalanceerd of Ruim bepaalt de kandidaatruimte vóór iedere seeded keuze. |
| Hoe vaak | 1, 3, 10, 25, 50 of 100 complete iteraties. |
| Impact op west- en zuidas | Uit, Bezettingskans of Relatief patroon. |

### Wat is één iteratie?

Eén iteratie is één volledig uitgevoerde Random-run. Het algemene veld
**Knopen per run** bepaalt de iteratiegrootte. Het centrale startpunt telt niet
mee in de asanalyse. Bij 31 knopen levert één iteratie dus 30 waarnemingen op
de west-as en 30 op de zuidas.

De Config toont de impact meteen als formule. Voor 10 iteraties van 31 knopen:

```text
10 iteraties × 30 niet-centrale knopen
= 300 waarnemingen per as
```

Iedere niet-centrale knoop draagt in haar iteratie precies eenmaal bij:

- west-as: +1 voor de gebruikte horizontale rijcoördinaat;
- zuidas: +1 voor de gebruikte verticale kolomcoördinaat.

De harde OGN-regel blijft binnen iedere iteratie gelden: geen rij- of
kolomhergebruik.

### Impact op de as-afbeelding

| Asbeeld | Formule voor balklengte | Wat meer iteraties doen |
|---|---|---|
| Uit | geen afgeleid asbeeld | Alleen de actieve stap-voor-stap-run blijft zichtbaar. |
| Bezettingskans | `telling ÷ iteraties` | Benadert steeds stabieler de kans dat een coördinaat in een complete run bezet raakt. |
| Relatief patroon | `telling ÷ hoogste telling` | Vergelijkt de vorm binnen de actuele iteratieset; de sterkste coördinaat krijgt altijd de maximale balk. |

Bij **Bezettingskans** heeft het aantal iteraties dus rechtstreeks invloed op
de noemer en op de stabiliteit van het beeld. Bij **Relatief patroon** bepaalt
het aantal iteraties de steekproef, maar wordt de langste balk telkens opnieuw
op 100% gezet.

De iteraties gebruiken een vaste, reproduceerbare seedreeks. De asanalyse is
diagnostiek: zij kiest of bewaart geen toekomstige plaats voor de actieve
stap-voor-stap-run.

## Opslag en migratie

De actuele Configsleutels zijn:

- `directPlacementGeneral`;
- `greedyGrowConfig`;
- `randomPlacementConfig`.

De lagen blijven:

```text
code-default → config/default-config.json → config/user-config.json
→ browser-Config
```

De drie objecten worden per sleutel samengevoegd. Oudere rc.45-Config met
`directPlacementPresentation`, methodegebonden `targetCount`/`intervalMs`,
`repeatCount` of `showAxisPattern` wordt bij het laden gemigreerd. Een nieuwe
save schrijft alleen het nieuwe, geïsoleerde model.

De actuele browserkeuzes kunnen via **Bestanden & export → Schrijf huidige
Config naar project** in `config/user-config.json` worden gezet en gaan daarna
mee in de volgende projectzip.
