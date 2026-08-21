# OGN-kern en plaatsingsarchitectuur

Dit document legt de algemene Open Graph Notation vast voordat een
gespecialiseerde uitbreiding wordt geïntroduceerd.

## Vaste uitlegvolgorde

```text
1. OGN Free Placement
2. OGN Projection
3. OGN Calculated Placement
```

Een uitbreiding mag deze volgorde aanvullen, maar niet omkeren.

## 1. OGN Free Placement

De OGN-kern schrijft knopen één voor één op een open grid.

### Harde knoopinvariant: A ≠ B

Voor ieder paar **verschillende knopen** A en B in dezelfde OGN-gridtoestand
geldt:

```text
A ≠ B  ⇒  x(A) ≠ x(B)  én  y(A) ≠ y(B)
```

In gewone taal: **twee verschillende knopen mogen nooit dezelfde verticale
of horizontale gridlijn bezetten**. Een kandidaatplaats is daarom alleen vrij
als zowel haar kolom als haar rij nog door geen enkele knoop wordt gebruikt.
Deze regel geldt voor de OGN-kern en voor iedere toepassing die echte knopen
toevoegt of verplaatst.

Zowel **Text** als **Context** kan als eigen Open Graph Notation-structuur
worden weergegeven. De centrale Language Tree is de Text-OGN; de aangeleverde
Context-boom is een afzonderlijke, nog te ontwikkelen geminimaliseerde
Context-OGN. Iedere graph bewaakt zijn eigen knopen en de invariant binnen
zijn eigen gridtoestand. Context-knopen worden niet automatisch Text-knopen,
en iedere insertie behoort tot Context. Zie `TEXT_AND_CONTEXT.md` en
`CONTEXT_TAXONOMY.md`.

De naam voor een overtreding is **gridlijnhergebruik** (kort: **hergebruik**):
horizontaal hergebruik deelt een rij; verticaal hergebruik deelt een kolom.
Beide zijn altijd ongeldig.

Vrije-plaatsmarkeringen, projectiemerkers, as-items, labels en boxranden zijn
geen nieuwe OGN-knopen. Zodra een toepassing iets wél als knoop schrijft, geldt
de invariant onverkort. Kan de plaatsingslaag geen geldige rij én kolom vinden,
dan stopt de plaatsing met een fout; de renderer mag nooit een ongeldige
fallbackknoop tekenen.

```text
bestaande bezetting
→ vrije gridplaatsen bepalen
→ ruleset toepassen
→ zoekstrategie test kandidaatposities
→ eerstgevonden geldige plek direct schrijven
→ nieuwe bezetting
```

Kernregels:

- iedere knoop is baas op zijn eigen horizontale en verticale gridlijn: geen
  tweede knoop mag één van beide lijnen hergebruiken;
- een nieuwe knoop wordt alleen op een vrije plaats geschreven;
- reeds geschreven knopen blijven staan, tenzij een afzonderlijke bewerking
  expliciet verplaatsing toestaat;
- de ruleset bepaalt welke vrije plaatsen geldig zijn;
- de zoekstrategie bepaalt in welke volgorde kandidaten worden getest;
- de eerstgevonden geldige plaats wordt in directe plaatsing meteen
  geschreven;
- de vastgelegde plaats is invoer voor de renderer; de renderer kiest geen
  andere plek.

**Vrij** betekent dus niet willekeurig of regelloos. Vrijheid en geldigheid
zijn verschillende eigenschappen van een kandidaatpositie.

### Directe plaatsing en zoekstrategieën

Een **zoekstrategie** (*search strategy*) bepaalt de volgorde waarin vrije
kandidaatposities worden onderzocht. Zij maakt niet eerst een compleet
plaatsingsplan. Zodra de eerste door de ruleset geldige kandidaat is gevonden,
schrijft directe plaatsing die knoop en verandert de gridbezetting.

Verschillende zoekvolgorden kunnen vanuit hetzelfde startpunt verschillende
groeipaden en eindbeelden opleveren.

### Geaccepteerde reconstructie — Greedy Grow

De bewaarde demo's van 12, 31 en 96 knopen volgen exact één vierarmige
volgorde vanaf het centrale gridpunt. De gereconstrueerde engine schrijft per
aanroep direct één knoop, leest daarna pas de gewijzigde gridbezetting en
bewaart geen toekomstig eindbeeld. Dezelfde engine biedt vier uit een oude
browserproef teruggevonden zoekvolgorden; zij maken zichtbaar hoe een andere
kandidaatvolgorde een ander groeibeeld kan opleveren.

De historische vierarmige volgorde en de exacte tie-breaks van de
experimentele zoekvolgorden staan in
`GREEDY_GROW_RECONSTRUCTION.md`. De omtrekkende beweging blijft als streven
historische context: de actuele veldomtrek wordt gemeten, maar
er is geen bewijs teruggevonden van een wereldwijd optimale doelfunctie.

De standalone proef staat in `greedy-grow.html`. De gebruiker heeft de
reconstructie en bewijsgrens op 2 augustus 2026 goedgekeurd. Publicatieslide 5
wordt rechtstreeks uit `greedy-grow-engine.js` afgeleid en toont de eerste
twaalf stappen van dezelfde geaccepteerde volgorde.

### Directe illustraties in de hoofdinterface

Het hoofdmenu bewaakt het onderscheid tussen voorbeeld en toepassing:

- **Language Tree** staat prominent als primaire berekende toepassing;
- **Greedy Grow** is een directe illustratie via de geaccepteerde engine;
- **Random** is een directe illustratie via een afzonderlijke seedbare engine.

Beide directe modi gebruiken de actuele bezetting en schrijven per stap exact
één knoop. Random selecteert uit de op dat moment vrije rij-kolomcombinaties;
dezelfde seed maakt undo plus opnieuw vooruitgaan reproduceerbaar. Zij bouwen
geen taalboom en activeren dus ook geen taal-, LEX/SYNT/LOG- of LOG-menu's.

## 2. OGN Projection

Projectie begint pas nadat bronknopen een plaats op het centrale grid hebben.
Een projectie:

- gebruikt een reeds geschreven bronknoop;
- schrijft een projectiemerker op een gekozen as of afgeleide ruimte;
- laat de bronknoop en zijn gridbezit intact;
- kan een andere ordening, selectie of lezing tonen;
- bepaalt niet met terugwerkende kracht de vrije bronplaatsing.

## 3. OGN Calculated Placement

Bij berekende plaatsing wordt niet iedere knoop direct door een gebruiker of
eenvoudige stapstrategie gekozen. Een toepassing berekent vooraf een
plaatsingsplan en schrijft het resultaat daarna volgens de OGN-kernregels.
Greedy Grow hoort hier niet onder: dat schrijft iedere gevonden geldige plek
direct en bouwt niet eerst een compleet plan.

De vaste categorienaam is:

```text
OGN Calculated Placement / OGN Berekende Plaatsing
```

### Two-Pass Language Tree

De huidige taalboom is één berekende OGN-toepassing:

1. **structurele pass** — relaties, gridcellen, hosts en structurele
   plaatsingsregels bepalen de knoopposities;
2. **visuele pass** — nodevormen, labels, subtrees en marges worden gemeten
   voor boxen, assen en viewport;
3. **rendering** — tekent het vastgelegde resultaat.

Binnen deze toepassing zijn LEX, SYNT en LOG named projections. Deze namen
worden pas hier geïntroduceerd, nadat het algemene projectiemechanisme en het
onderscheid tussen directe en berekende plaatsing zijn uitgelegd.

De tweede pass maakt de zichtbare boxen inhoudsgestuurd. In de huidige viewer
verplaatst die pixelmeting de knopen niet opnieuw naar andere gridcellen en is
zij dus nog geen algemene collision- of repacking-solver.

### Language Tree · extensie 1 · Anafoor

Deze berekende toepassing bestaat uit twee afzonderlijke OGN-eenheden. Eerst
worden S1 en S2 ieder zelfstandig gepland en tegen de harde knoopinvariant
gevalideerd. Daarna verschuift de compositor uitsluitend de complete S2 star:
S1 blijft boven S2 en de twee gedeclareerde, coreferentiële MAN-bronknopen
worden op dezelfde kolom uitgelijnd.

De invariant heeft hier expliciet bereik **per afzonderlijke OGN**. De
compositie is geen nieuwe samengevoegde OGN. Toevallig samenvallende kolommen
tussen S1 en S2 verklaren geen relatie: alleen `relations[]` is semantisch
gezag. Het primaire `MAN–MAN`-paar declareert `shared-column`. Alle
gedeclareerde relaties verbinden uitsluitend centrale Text-bronknopen;
`GISTEREN` en `VANDAAG` zijn Context-inserties en vormen geen
anafoorrelatie. Context wordt gereserveerd als afzonderlijke,
geminimaliseerde OGN-boom; verdere berekening en koppeling blijven p.m.
Een gedeelde rij blijft in deze compositiestap ongeldig.

De gezamenlijke LEX-as ordent S1 vóór S2. De rechte verticale MAN–MAN-lijn is
ongericht, heeft geen pijlpunt en drukt broncoreferentie uit. Het tweede MAN
wordt pas op LEX als `HIJ`, `DIE` of `DIE MAN` gerealiseerd. Zie
`ANAPHOR_LANGUAGE_TREE_EXTENSION.md` en `MULTI_OGN_ANAPHOR.md` voor het
volledige contract.


## Terminologie

| Nederlands | Engels | Betekenis |
|---|---|---|
| OGN-kern | OGN Core | Gridbezit, vrije plaatsen en één-voor-één schrijven |
| Gridlijnhergebruik | Grid-line reuse | Twee verschillende knopen delen een horizontale rij of verticale kolom; altijd ongeldig |
| OGN Vrije Plaatsing | OGN Free Placement | Algemene eerste laag zonder verplichte domeinvorm |
| Ruleset | Rule Set | Bepaalt welke vrije kandidaatposities geldig zijn |
| Zoekstrategie | Search Strategy | Bepaalt de testvolgorde; de eerstgevonden geldige plek wordt direct geschreven |
| Greedy Grow | Greedy Grow | Geaccepteerde directe reconstructie vanaf het centrale gridpunt; historische vierarmige volgorde exact herhaald, optimale veldomtrek niet bewezen |
| Random | Random | Seedbare directe illustratie die per stap uit de huidige vrije rij-kolomcombinaties kiest |
| OGN-projectie | OGN Projection | Afgeleide marker/ordening vanuit een geplaatste bronknoop |
| OGN Berekende Plaatsing | OGN Calculated Placement | Toepassing die eerst een plaatsingsplan berekent |
| Two-Pass Language Tree | Two-Pass Language Tree | Berekende taalboomtoepassing met structurele en visuele pass |
| Anafoor · multi-OGN | Anaphor · multi-OGN | Twee zelfstandig berekende OGN’s die star worden gecomponeerd via één gedeclareerde coreferentiekolom |
