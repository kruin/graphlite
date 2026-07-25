# Source changes · v2.0.0-rc.21

## LOG rechtstreeks onder de bron

`layoutLogicalProjectionCenters()` gebruikt voor iedere major de bestaande
bron-x. `drawLogicalProjection()` trekt daarvoor een zuiver verticale lijn
naar de zuidas. Een minor zonder eigen boombron wordt tussen zijn begrenzende
majors geplaatst en krijgt een compacte tweede labelrij.

## Eén zichtbare LEX-verplaatsing

`orderedLexMovements()` levert per bronitem één gecombineerde stap. LOG
berekent eerst de neutrale doelrij; een expliciete topic-/V2-regel kan dat doel
vervangen. De renderer tekent vervolgens rechtstreeks:

```text
horizontaal bronanker → bepaald einddoel
```

Er is geen afzonderlijke LOG-tussenpijl of tweede trace meer. Daardoor heeft
`HOND BIJT MAN` drie zichtbare verplaatsingen en
`DE HOND HEEFT DE MAN MISSCHIEN WEL VAAK GEBETEN` vier.

Gevulde TOPIC- en V2-rijen tekenen hun lege placeholder niet meer. De
trajecten hebben compacte labels `LEX 1`, `LEX 2`, enzovoort; de volledige
bewegingsnaam blijft als SVG-titel beschikbaar.

## Bijwoorden, zinkop en README

- `ADVERB_FALLBACK_ROWS` bevat 21 voorbeelden. Samen met `Geen bijwoord`
  blijft de dropdown dus ook volledig wanneer een lokale `fetch` wordt
  geblokkeerd.
- `drawGraphSentence()` zet de actieve zin boven de graph en houdt daaronder
  64 SVG-eenheden vrij voor een mogelijke noord-as.
- De intro bevat één `data-readme-slide`: het eerste traditionele
  boomvoorbeeld. De generieke carrousel activeert pas vanaf twee beelden.

## Regressiecontrole

- `tools/check_lex_horizontal_projection.py` controleert de horizontale
  bronprojectie, één gecombineerde stap en precies drie stappen voor
  `HOND BIJT MAN`.
- `tools/check_projection_cleanup.py` controleert de ingebouwde
  bijwoordkeuzes, één introbeeld, directe verticale LOG-projecties,
  gecombineerde LEX-doelen, vrije-slotopruiming en de zinkop.
- De DOM-rendertest controleert aanvullend dat de lange bijwoordzin vier
  unieke doelrijen en vier opwaartse rechtstreekse verplaatsingen heeft.
