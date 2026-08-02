# Config voor directe plaatsing

Status: technisch contract voor source build
`v2.0.0-rc.45-direct-config-hard-no-show-20260803.12`.

## Config: Algemeen en per toepassing

Config heeft voortaan één vaste eerste laag:

1. **Algemeen** bevat alleen projectbrede of door toepassingen gedeelde
   instellingen;
2. **Calculated → Language Tree** bevat uitsluitend de instellingen van de
   berekende Language-Tree-toepassing;
3. **Direct → Greedy Grow** bevat uitsluitend de twee eigen Greedy-instellingen;
4. **Direct → Random** bevat uitsluitend de eigen Random-instellingen.

Binnen één gekozen context geldt **no-show** voor iedere niet-relevante
instelling: zij wordt niet grijs of alleen-lezen getoond, maar volledig
verborgen. In de volledige Config van Algemeen en Language Tree is de
toepassingsbalk beschikbaar. Bij openen vanuit een actieve Greedy-Grow- of
Random-modus is ook die balk hard **no-show**: zichtbaar blijven alleen
**Terug naar Main**, de eigen bewerkbare velden met uitleg en **Config
opslaan**. Algemeen, Language Tree en de andere directe methode verschijnen
daar nergens. Kies een andere toepassing eerst in Main en open daarna Config
opnieuw.

Config toont uitsluitend functionele, bewerkbare bediening. Berekende impact,
voortgang en uitvoer staan in Main. Korte, inklapbare **Uitleg** staat wel direct
bij ieder veld; uitgebreide onderbouwing blijft daarnaast in Help. De algemene
viewerwerkbalk, voorbeeld-/runstatus, feedbackblokken en het canvas zijn in een
directe methodecontext verborgen. Config-save blijft beschikbaar.

Language Tree blijft de primaire berekende toepassing; Greedy Grow en Random
blijven directe OGN-illustraties.

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
methoden dezelfde betekenis hebben. Zij staan onder **Algemeen → Direct ·
gedeeld**. Dezelfde Play-snelheid verschijnt voor het gemak ook als bewerkbaar
veld in Random; technisch gebruikt zij dezelfde gedeelde klok en geen tweede,
conflicterende Configwaarde.

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

Random toont uitsluitend tien bewerkbare velden: zeven keuzelijsten en drie
getalvelden. De twee vaste gridmaten verschijnen alleen bij **Vast grid**.

| Optie | Betekenis |
|---|---|
| Seed | Startcode van de reproduceerbare toevalsreeks; geldig van 1 t/m 4.294.967.295. |
| Resetbeleid | Dezelfde seed opnieuw gebruiken of bij Reset naar de volgende vaste seed gaan. |
| Random-model | Uniform v1.0 of Onzuiver uniform v0.1 · hit-herhaling. |
| Plaatsing | Standaard Ergens in beschikbare ruimte; Compact, Gebalanceerd en Ruim blijven beschikbaar. |
| Gridgrootte | Interface, Vast grid of Inhoud · groeiend veld. |
| Vaste kolommen | Alleen bij Vast grid; minimaal het aantal knopen per run. |
| Vaste rijen | Alleen bij Vast grid; minimaal het aantal knopen per run. |
| Snelheid | Milliseconden tussen zichtbare stappen; gebruikt de gedeelde Play-klok. |
| Hoe vaak | 1, 3, 10, 25, 50 of 100 complete iteraties. |
| Impact op west- en zuidas | Uit, Bezettingskans of Relatief patroon. |

### Seed is geen hoeveelheid toeval

De seed is uitsluitend het startgetal van de deterministische generator.
`20260802` is als standaard gekozen omdat het de herkenbare datum 2 augustus
2026 noteert. Het is geen kwaliteits- of snelheidswaarde:

- een grote seed geeft niet meer toeval dan seed `7`;
- een grote seed maakt Play niet sneller;
- dezelfde seed, programmaversie, Random-model, plaatsing, gridgrootte,
  runlengte en iteratie-instellingen leveren dezelfde reeks;
- **Snelheid** verandert alleen de wachttijd tussen zichtbare stappen en nooit
  de gekozen posities.

### Beschikbare rechthoek en maximale afmetingen

De standaardcombinatie is:

```text
Plaatsing = Ergens in beschikbare ruimte
Gridgrootte = Interface
```

Aan het begin van een iteratieset leidt de viewer uit de actuele interface een
vaste rechthoek af. De beeldverhouding volgt de tekenruimte. Beide richtingen
krijgen minimaal evenveel unieke gridlijnen als er knopen in één run zijn;
daardoor blijft de harde OGN-regel uitvoerbaar.

Iedere Random-stap kiest vervolgens rechtstreeks uit het cartesische product
van alle nog vrije horizontale en verticale gridlijnen in die rechthoek. De
knoop kan dus meteen ergens aan de rand of midden in de beschikbare ruimte
verschijnen. Er is geen voorafgaande compacte groeizone.

De plaatsing blijft volledig reproduceerbaar met dezelfde seed,
interfaceverhouding, runlengte en Config. Een resize of draaiing wijzigt een
lopende iteratieset niet; **Reset** leidt de rechthoek opnieuw af uit de nieuwe
interface.

De alternatieven blijven bewust open:

- **Compact**, **Gebalanceerd** en **Ruim** gebruiken opnieuw een zoekzone die
  vanuit het centrum wordt opgebouwd;
- **Inhoud · groeiend veld** laat de maximale rechthoek met de geplaatste
  inhoud meegroeien, zoals vóór deze wijziging.
- **Vast grid** gebruikt expliciete aantallen kolommen en rijen. Beide waarden
  worden zo nodig automatisch verhoogd tot het aantal knopen per run, omdat
  iedere knoop een unieke horizontale én verticale gridlijn nodig heeft.

Dit is uitsluitend een toegevoegde standaard. Opgeslagen bestaande keuzes
blijven van kracht; nieuwe plaatsingsgebieden of begrenzingen kunnen later als
extra opties worden toegevoegd zonder het huidige Configcontract te breken.

### Wat is één iteratie?

Eén iteratie is één volledig uitgevoerde Random-run. Het algemene veld
**Knopen per run** bepaalt de iteratiegrootte. Het centrale startpunt telt niet
mee in de asanalyse. Bij 31 knopen levert één iteratie dus 30 waarnemingen op
de west-as en 30 op de zuidas.

De documentatie berekent de impact als volgt. Voor 10 iteraties van 31 knopen:

```text
10 iteraties × 30 niet-centrale knopen
= 300 projectie-hits per as na voltooiing
```

Iedere niet-centrale knoop draagt in haar iteratie precies eenmaal bij:

- west-as: +1 voor de gebruikte horizontale rijcoördinaat;
- zuidas: +1 voor de gebruikte verticale kolomcoördinaat.

De harde OGN-regel blijft binnen iedere iteratie gelden: geen rij- of
kolomhergebruik.

### Projectie-hits op de assen

Een actieve, nog onvoltooide ronde verandert het asbeeld niet. Meteen nadat de
laatste knoop van een ronde is geschreven, projecteert die complete ronde haar
niet-centrale coördinaten naar twee cumulatieve hitsets:

- iedere gebruikte rij geeft één spot-hit op **WEST**;
- iedere gebruikte kolom geeft één spot-hit op **SOUTH**.

Raakt een latere ronde dezelfde ascoördinaat opnieuw, dan stijgt de telling en
wordt dezelfde spot altijd donkerder en zwaarder omlijnd. Er verschijnt geen
tweede spot op die plek. **Reset** wist alle voltooide rondes. **Previous**
neemt de actuele ronde weer uit het asbeeld zodra de laatste knoop ervan wordt
teruggenomen. Toekomstige rondes worden nooit vooraf gegenereerd of getekend.

| Asbeeld | Normalisatie | Wat meer rondes doen |
|---|---|---|
| Uit | geen afgeleid asbeeld | Alleen de actieve stap-voor-stap-run blijft zichtbaar. |
| Bezettingskans | spotmaat en kleur: `hittelling ÷ ingesteld totaal rondes` | Iedere nieuwe hit maakt de spot aantoonbaar zwaarder; het gewicht groeit monotoon met de telling. |
| Relatief patroon | spotmaat: `hittelling ÷ hoogste actuele hittelling`; kleur blijft cumulatief | Vergelijkt de vorm binnen uitsluitend de reeds voltooide rondes, terwijl iedere nieuwe hit de kleur toch verder verzwaart. |

De iteraties gebruiken een vaste, reproduceerbare seedreeks. De asanalyse is
diagnostiek en retrospectief: zij telt alleen voltooide rondes en kiest of
bewaart geen toekomstige plaats voor de actieve stap-voor-stap-run.

### Voorspelling voor uniforme Random

Uniforme Random geeft iedere nog vrije ascoördinaat dezelfde kans. Voor een
rechthoek met `C` kolommen en `R` rijen en een run van `N` knopen, inclusief
de vaste centrale startknoop, geldt per ronde:

```text
verwachte hitkans SOUTH = (N - 1) / (C - 1)
verwachte hitkans WEST  = (N - 1) / (R - 1)
verwachte hittelling na k rondes = k × hitkans
```

Daarom voorspellen we over veel rondes een vrijwel egaal asbeeld, niet een
voorkeur voor centrum of rand. Als bijvoorbeeld `R = N`, is de verwachte én
feitelijke WEST-hitkans `1`: iedere niet-centrale WEST-spot wordt in iedere
ronde geraakt en eindigt even zwaar. Alleen een niet-uniforme zoekstrategie of
een aanvullende plaatsingsregel kan een blijvende voorkeursvorm opleveren.

### Onzuiver uniform v0.1 · hit-herhaling

Versie 0.1 is functioneel en selecteerbaar, maar blijft bewust mild. Binnen
iedere actuele set vrije ascoördinaten geldt per coördinaat `c`:

```text
P(c) = 0,80 / F + 0,20 × (1 + h(c)) / som(1 + h)
```

Hierin is `F` het aantal actuele vrije coördinaten en `h(c)` het aantal hits op
die ascoördinaat in uitsluitend de voltooide eerdere rondes van dezelfde
iteratieset. X en Y worden afzonderlijk gekozen; de harde unieke rij- en
kolomregel blijft dus gelden. In ronde 1 zijn alle hitwaarden nul en is de
verdeling nog uniform.

**Voorspelling voor één vaste seedreeks:** toevallige vroege verschillen kunnen
zich licht versterken. Het WEST- en SOUTH-asbeeld krijgt daardoor doorgaans
meer contrast dan Uniform v1.0, zonder dat centrum of rand vooraf bevoordeeld
wordt. Over veel onafhankelijke seeds blijft de verwachting symmetrisch.

Als een as precies `N` lijnen heeft voor `N` knopen, worden alle niet-centrale
lijnen iedere ronde gedwongen geraakt. Dan kan ook v0.1 op die as geen patroon
maken. Kies voor een zichtbaar effect een vast grid dat in beide richtingen
ruimer is dan het aantal knopen.

Voorspelde vervolgstappen zijn gedocumenteerd maar nog **no-show** in Config:

- **v0.2 · instelbare herhaalsterkte:** laag nadert Uniform; hoog laat vroege
  hits sterker domineren;
- **v0.3 · instelbaar geheugenvenster:** volledige historie geeft een stabieler
  patroon; alleen recente rondes laat het patroon door de tijd verschuiven.

Deze opties worden pas zichtbaar wanneer engine, opslag, Help en controles
functioneel zijn.

### Play, Next, Previous en Reset

De ingestelde waarde **Hoe vaak** bestuurt nu ook de actieve Random-uitvoering:

- **Play** loopt knoop voor knoop door alle ingestelde iteraties;
- **Next** schrijft één volgende knoop en gaat na een complete run automatisch
  door naar de eerste niet-centrale knoop van de volgende iteratie;
- **Previous** verwijdert binnen een run één knoop. Vanaf de centrale
  startknoop toont het de complete vorige iteratie;
- **Reset** begint bij iteratie 1. Met vaste seed wordt de ingestelde seed
  hergebruikt; met nieuwe seed schuift de startseed reproduceerbaar door.

Main toont steeds `iteratie n/totaal · knoop n/totaal`. De assen tonen daarnaast
`voltooide rondes/totaal`; vóór het einde van ronde 1 staat daar dus `0/totaal`.
De seedreeks van de afgespeelde iteraties is dezelfde reeks als die van de
reeds opgebouwde WEST- en SOUTH-hits.

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

De algemene uitlegregel staat in `CONFIG_UI_EXPLANATION_STANDARD.md`: ieder
zichtbaar Configveld legt direct uit wat het verandert, wat het niet verandert,
welke grenzen gelden en waarvan reproduceerbaarheid afhangt.
