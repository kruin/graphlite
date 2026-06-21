# Carrousel-editor: bewaren, schrijven en modulemap

De carrousel staat als zelfstandige map in de projectzip:

```text
carrousel/
  index.html
  index-en.html
  editor.html
  slides.json
  slides/
```

## Knoppen

| knop | functie | opent een mapvenster? |
|---|---|---|
| Kies modulemap | geeft de browser één keer schrijfrecht op de uitgepakte map `carrousel/` | ja |
| Bewaar lokaal | bewaart de volledige editorstand in browseropslag: volgorde, titel, tekst, bestandsnaam, afbeelding en tonen/niet tonen per slide; schrijft ook naar bestanden als de modulemap al gekozen is | nee |
| Schrijf naar map | schrijft direct naar de gekozen modulemap | nee |
| Download modulezip | exporteert een complete modulezip voor teruglevering | nee |

## Belangrijk

De browser mag de huidige map van `editor.html` niet automatisch kiezen. De getoonde locatie van `editor.html` is alleen een referentie. Schrijfrecht ontstaat pas na `Kies modulemap`.

Daarna hoort `Schrijf naar map` geen file- of mapvenster meer te openen. Als nog geen modulemap gekozen is, verschijnt alleen de melding dat eerst `Kies modulemap` nodig is.


## v4526 - volledige slide-instellingen

`Bewaar lokaal` slaat nu per slide expliciet alle bewerkbare gegevens op:

- volgorde
- titel en tekst
- Engelse titel en tekst
- bestandsnaam
- afbeelding / imageData
- `visible: true` of `visible: false`

Oude opslag wordt alleen als legacy gelezen. Nieuwe opslag gebruikt een aparte sleutel, zodat oude kapotte zichtbaarheid niet telkens opnieuw de actuele editorstand overschrijft.

## v4526 - Carrousel: stabiele opslag per slide

- Eén projectzip bevat nu de volledige viewer en de map `carrousel/`; er is geen los editorbestand nodig.
- De editor gebruikt een nieuwe huidige opslagkey: `opengraph_carrousel_editor_state_v4526`.
- Bij heropenen wordt eerst de huidige v4526-opslag geladen. Oudere opslag wordt alleen als import gebruikt wanneer er nog geen v4526-opslag bestaat.
- `toon/niet tonen` wordt exact per slide opgeslagen. Een uitgevinkt vakje blijft uitgevinkt na `Bewaar lokaal`, sluiten en heropenen.
- Oude opslagkeys blijven staan als veiligheidskopie en worden niet automatisch verwijderd bij bewaren.
