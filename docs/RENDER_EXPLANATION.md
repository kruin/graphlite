# Render-uitleg

## Plaats

De render-uitleg hoort in **Help** en documentatie, niet in **Config**.

Config is voor instellingen. Lange uitlegblokken mogen daar niet tussen actieve opties vallen, omdat zij de configuratiekolom onderbreken en opties zoals `Takverlenging door insertie` naar beneden drukken.

## Render-volgorde

1. Bereken eerst de centrale boom en de boxen.
2. Teken daarna de projectie-assen: LEX, SYNTAX en LOG/FT.
3. Projecteer eindknopen naar de LEX-as.
4. Plaats vrije LEX-inserts in gereserveerde slots.
5. Teken eventuele LEX-verplaatsingsregels of wissels.

De centrale boom blijft daarbij ongewijzigd.

## Vrije LEX-inserts

Bijwoorden zijn geen gewone centrale boomknopen. Vanaf v4536 worden zij boven een geldige syntactische categoriebox geplaatst: S, NP, VP, V, PP of AP. Zij staan dus niet tussen boxen.

Voorbeelden:

- `GISTEREN`, `MORGEN`: tijd; hostbox VP/S.
- `VAAK`, `SOMS`, `ALTIJD`: frequentie; VP-slot.
- `NIET`: NEG / V-nabij slot.
- `SNEL`, `HARD`, `ZACHTJES`: wijze; V-nabij.
- `MISSCHIEN`, `WAARSCHIJNLIJK`, `HELAAS`: hoog S/VP-HOST-slot of S-left.
- `ALLEEN`, `OOK`, `ZELFS`: focus-slot bij de gefocuste phrase.
- `HEEL`, `ERG`, `ZEER`: AP/AdvP/NP-intern.

## OSV-!

`OSV-!` is gemarkeerd omdat het geen basisboom-alternatief is. De box-aanpak kan OSV niet opleveren. Voor correcte rendering op de LEX-as is altijd een verplaatsingsregel nodig.

## v4535 - OSV-!, VSO-! en VOS-!

`VSO` en `VOS` worden nu net als `OSV` gemarkeerd: `VSO-!` en `VOS-!`. Het uitroepteken betekent dat de box-aanpak deze volgorde niet als basisalternatief kan opleveren. Correcte LEX-rendering vraagt een expliciete verplaatsingsregel. Bestaande bomen en bestaande flips blijven ongemoeid.

