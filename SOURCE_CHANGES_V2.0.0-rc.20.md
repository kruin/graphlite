# Source changes · v2.0.0-rc.20

## Config in vier tabbladen

De lange Config-pagina is opgesplitst in:

1. `Beeld`;
2. `LOG & LEX`;
3. `Bestanden`;
4. `Geavanceerd`.

De bestaande besturingselementen worden bij initialisatie naar deze panelen
verplaatst. Hun ids en eventhandlers blijven behouden. De tabbladen gebruiken
`role=tab`, `role=tabpanel`, `aria-selected`, pijltoetsnavigatie en één actief
paneel.

`Beeld` opent standaard. Een zichtbare MAX-kaart en de drie primaire keuzes
staan bovenaan:

```text
Boomruimte     = MAX
Venstervulling = MAX
Boom vrije rijen
```

`Venstervulling` vervangt de onduidelijke naam `Hoofdvenster`; het veld bepaalt
hoe de boom het beschikbare appvenster benut.

## Topmenu boven Play

De vaste Play-balk had een hogere stacking context dan het hoofdmenu. Daardoor
konden de wel gevulde popovers van `Zin`, `Bijwoord`, `Syntax / FT` en
`Projecties` leeg lijken of achter `LOG-volgorde` vallen.

De volledige hoofdmenubalk staat nu boven Play. Binnen die balk krijgt het
geopende `details`-element bovendien voorrang boven zijn latere siblings.

## Sobere LEX-ruimtestap

Play-fase `2/3 ruimte` bewaart dezelfde LOG-afgeleide reserveringscoördinaten,
maar tekent niet langer voor iedere major een groot vak met het label
`vrije LEX-rij`. De volledige gereserveerde reeks wordt als één smalle band
met begin- en eindmarkering weergegeven.

De volgorde blijft:

```text
LOG → ruimte reserveren → horizontaal naar LEX projecteren → langs LEX verplaatsen
```

## Regressiecontrole

`tools/check_config_tabs_and_menus.py` controleert:

- de vier tabdefinities en hun opbouw bij initialisatie;
- de zichtbare MAX-kaart en primaire MAX-keuzes;
- de verhoogde topmenu- en open-popoverlagen;
- de drie keuzecontainers voor Zin, Bijwoord en Syntax/FT;
- de afwezigheid van de oude herhaalde tekst `vrije LEX-rij`;
- en de enkele LEX-ruimtereservering.

De DOM-rendertest controleert aanvullend dat de tabs wisselen, de drie
keuzelijsten niet leeg zijn en fase 2 precies één reserveringsband tekent.
