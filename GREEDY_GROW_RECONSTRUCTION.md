# Greedy Grow — technische reconstructie

Status: **handmatig geaccepteerde reconstructie** voor OpenGraph Lite Viewer
`v2.0.0-rc.45`. De gebruiker heeft de stapvolgorde, bewijsgrens, bediening en
carrouselpromotie op 2 augustus 2026 goedgekeurd. De publicatiecarrousel wordt
rechtstreeks uit dezelfde engine afgeleid.

## 1. Wat daadwerkelijk is teruggevonden

Drie bewaarde Greedy-Grow-demo's bevatten respectievelijk 12, 31 en 96
knopen:

- `samples/short_demo.json`;
- `samples/space3_gridH20W20_grow_demo.json`;
- `samples/no_limit_96_demo.json`.

Alle drie volgen vanaf het centrale startpunt exact dezelfde schrijfvolgorde:

```text
0:  ( 0,  0)
1:  ( 1, -1)
2:  (-1, -2)
3:  (-2,  1)
4:  ( 2,  2)
5:  ( 3, -3)
6:  (-3, -4)
7:  (-4,  3)
8:  ( 4,  4)
...
```

Een bewaarde browserproef geeft daarnaast vier kandidaat-rangschikkingen:
dicht bij het centrum, ring voor ring, spreiding over kwadranten en grootste
draai eerst. Die proef schreef steeds de eerstgevonden vrije kandidaat direct.
Er is geen bewijs teruggevonden dat het oude Java-programma vooraf een
volledig eindbeeld berekende.

## 2. Vast direct contract

De reconstructie gebruikt OGN Free Placement:

1. schrijf startknoop `0` op `(0, 0)`;
2. lees voor iedere volgende stap de actuele bezette rijen en kolommen;
3. doorloop kandidaten in de gekozen zoekvolgorde;
4. accepteer alleen een kandidaat waarvan rij én kolom nog vrij zijn;
5. schrijf de eerste geldige kandidaat onmiddellijk;
6. werk de bezetting bij en begin daarna pas aan de volgende stap.

De harde invariant blijft:

```text
A ≠ B  ⇒  x(A) ≠ x(B)  én  y(A) ≠ y(B)
```

De state bevat daarom alleen reeds geschreven knopen, gebeurtenissen en
zoekadministratie. Zij bevat geen lijst met toekomstige knoopposities.

## 3. Historische vierarmige referentie

Voor iedere arm `k ≥ 0` geldt:

```text
a = 2k + 1
b = 2k + 2

( a, -a)
(-a, -b)
(-b,  a)
( b,  b)
```

Deze vier kandidaten worden in die volgorde direct geschreven. Daardoor
reproduceert `compact-four-arm` de drie bewaarde demo's coördinaat voor
coördinaat. Na iedere groep van vier groeit het omtrekkende veld gelijkmatig.

Dit is een **historisch gereconstrueerde kandidaatvolgorde**. Het is niet
bewezen dat zij iedere mogelijke volgende stap globaal optimaliseert.

## 4. Herstelde experimentele zoekvolgorden

De standalone proef biedt daarnaast deze teruggevonden rangschikkingen. Zij
veranderen alleen de volgorde waarin kandidaten worden geprobeerd.

| Keuze | Primaire rangschikking | Vervolg bij gelijke score |
|---|---|---|
| Dicht bij centrum | kleinste gekwadrateerde afstand tot `(0, 0)` | draai dicht bij 90°, korte stap, kwadrant, `y`, `x` |
| Ring voor ring | kleinste vierkante ring rond `(0, 0)` | korte stap, draai dicht bij 90°, kwadrant, `y`, `x` |
| Kwadranten spreiden | volgende doelkwadrant en laagste bezetting | centrumafstand, draai, stap, `y`, `x` |
| Grootste draai eerst | grootste draai vanaf de vorige groeirichting | centrumafstand, stap, kwadrant, `y`, `x` |

Deze keuzen zijn bruikbaar om zichtbaar te maken dat dezelfde harde
gridregel bij een andere zoekvolgorde een ander groeibeeld kan opleveren.
Zij worden niet gepresenteerd als identieke kopieën van een verdwenen
Java-implementatie.

## 5. Wat “compact” hier wel en niet betekent

De interface toont na iedere schrijfhandeling de breedte, hoogte en omtrek van
het actuele omtrekkende rechthoekige veld. Dat zijn diagnostische meetwaarden.

Wel onderbouwd:

- centraal startpunt;
- één knoop per stap;
- direct schrijven;
- unieke rij en kolom per knoop;
- exacte vierarmige volgorde van alle drie bewaarde demo's;
- verschillende zoekvolgorden kunnen verschillende beelden opleveren.

Niet onderbouwd:

- een bewijs van de wereldwijd kleinst mogelijke veldomtrek;
- een teruggevonden formele doelfunctie van het oude Java-programma;
- gelijkheid van iedere experimentele browserrangschikking aan die Java-code.

Het oude streven naar een zo klein mogelijke omtrekkende beweging blijft dus
historische context, geen bewezen optimaliteitsgarantie.

## 6. Uitvoering in rc.45

- `greedy-grow.html` — zelfstandige bedienbare proef;
- `greedy-grow-engine.js` — pure stapsgewijze engine, ook vanuit Node testbaar;
- `greedy-grow.js` — SVG-weergave en bediening;
- `greedy-grow.css` — scherm- en mobiele layout;
- `tools/check_greedy_grow_reconstruction.js` — exacte regressiecontrole.

Open `greedy-grow.html` via de lokale viewer. Kies een strategie en gebruik
`+1 · plaats direct` om iedere afzonderlijke schrijfhandeling te controleren.
`Play` herhaalt precies dezelfde stapfunctie. `−1 · ongedaan` verwijdert alleen
de laatst geschreven knoop. De JSON-download legt uitsluitend de actuele
state vast en vermeldt expliciet `future_plan_stored: false`.

De compacte vierarmige strategie is daarnaast bereikbaar via het
Language-Tree-menu van de hoofdviewer: **Greedy Grow · direct**. Dat is een
illustratieroute naar exact dezelfde engine, geen tweede implementatie.
**Random · direct** staat ernaast, maar gebruikt bewust de afzonderlijke
`random-placement-engine.js`. Daardoor kan Random deze geaccepteerde
reconstructie of de daarvan afgeleide publicatieslide niet wijzigen.

## 7. Vastgelegde acceptatiegrens

De reconstructie is op 2 augustus 2026 naar de openbare Greedy-Grow-uitleg
gepromoveerd nadat handmatig is bevestigd dat:

- het vierarmige 12/31/96-patroon inhoudelijk het bedoelde oude Greedy Grow is;
- de zichtbare stapvolgorde en oriëntatie kloppen;
- “compact” geen sterkere optimaliteitsclaim suggereert dan is aangetoond;
- de carrouselafbeelding uit deze goedgekeurde bron wordt afgeleid en niet
  los wordt getekend.

Deze acceptatie verandert de bewijsgrens niet: de compacte volgorde is exact
gereconstrueerd, maar wereldwijde optimaliteit is niet bewezen.
