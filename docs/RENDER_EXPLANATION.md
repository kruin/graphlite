# Render-uitleg · v2.0.0-rc.43

## Volgorde

1. Bereken de centrale Syntax- of Functional-graph.
2. Bouw de LOG-sequentie met majors en minors.
3. Geef ieder element een vast `logicalSlot`.
4. Teken LOG met één vaste pixelstap per slot.
5. Kopieer de LOG-volgorde naar neutrale LEX-rijen.
6. Teken bron → LEX als orthogonale projectielijn wanneer de rijhoogte
   afwijkt van de bronhoogte.
7. Pas expliciete topic-/V2-Wissels toe en laat traces achter.
8. Vergelijk de surface-uitkomst met de voorbeeldzin.

De centrale graph muteert niet.

## LOG

Majors hebben een doorgetrokken box; minors een gestreepte box. Ieder label
toont het slotnummer. De titel toont de sequentie en `d(S,O)`/`d(O,V)`.
Meer minors verlengen de as en comprimeren bestaande slots niet.

## LEX

LEX toont eerst de LOG-afgeleide basis. Een major kan meer dan één source
bevatten, zoals `pv` en `vdw`; die krijgen opeenvolgende rijen binnen de
V-zone. Een bijwoord-minor wordt op de corresponderende rij getekend.
Vooropplaatsing of V2 is een latere Wissel, geen nieuwe basiscoördinaat.

## Gemarkeerde majorvolgorden

`OSV-!`, `VSO-!` en `VOS-!` geven aan dat een aanvullende
LEX-verplaatsingsregel nodig kan zijn. De LOG-majorvolgorde zelf blijft wel
geldig en levert de basisrijen.

## Plaatsings- en render-volgorde

Eerst wordt het volledige plaatsingsplan berekend: hosts, inserties, landingsplaatsen, gridruimte, corridors, projecties en traces. Daarna wordt de kernzin lexicaal ingevuld. De renderer tekent uitsluitend het vaste resultaat en reserveert geen ruimte.
