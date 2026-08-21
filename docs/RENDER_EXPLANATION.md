# Render-uitleg · v2.0.0-rc.45

## Volgorde

1. Bereken de centrale Syntax- of Functional-graph.
2. Bouw de LOG-sequentie met majors en minors.
3. Geef ieder element een vast `logicalSlot`.
4. Teken LOG met één vaste pixelstap per slot.
5. Gebruik de LOG-volgorde om mogelijke LEX-plaatsen te plannen.
6. Teken iedere bron → LEX-projectie exact horizontaal op bronhoogte.
7. Pas uitsluitend expliciete topic-/V1-/V2-Wissels toe en laat alleen bij
   zo'n echte verplaatsing een trace achter.
8. Vergelijk de surface-uitkomst met de voorbeeldzin.

De centrale graph muteert niet.

## LOG

Majors hebben een doorgetrokken box; minors een gestreepte box. Ieder label
toont het slotnummer. De titel toont de sequentie en `d(S,O)`/`d(O,V)`.
Meer minors verlengen de as en comprimeren bestaande slots niet.

## LEX

LEX toont eerst ieder bronwoord op zijn eigen bronhoogte. Een major kan meer
dan één source bevatten, zoals `pv` en `vdw`; LOG plant daarvoor beschikbare
plaatsen binnen de V-zone, maar verplaatst ze niet. Een bijwoord-minor wordt
op zijn gereserveerde rij getekend. Vooropplaatsing of V2 is een expliciete
latere Wissel.

Concreet in `HOND BIJT MAN`: `HOND` en `MAN` blijven exact op hun eigen
bronhoogte; alleen `BIJT` wisselt naar de vrije LEX-gridrij halverwege beide
bronrijen. Dit doel komt uit de boomhoogten, niet uit `S + 64 px`.

## Gemarkeerde majorvolgorden

`OSV-!`, `VSO-!` en `VOS-!` geven aan dat een aanvullende
LEX-verplaatsingsregel nodig kan zijn. De LOG-majorvolgorde zelf blijft wel
geldig als planning, maar verplaatst geen bronwoord.

## Plaatsings- en render-volgorde

Eerst wordt het volledige plaatsingsplan berekend: hosts, inserties, landingsplaatsen, gridruimte, corridors, projecties en traces. Daarna wordt de kernzin lexicaal ingevuld. De renderer tekent uitsluitend het vaste resultaat en reserveert geen ruimte.
