# SOURCE_CHANGES v2.0.0-rc.19

## Doel

Alle vier interfacekeuzes gebruiken de beschikbare view maximaal:

```text
Automatisch
Desktop
Mobiel staand
Mobiel liggend
```

## Correcties

- De stabiele fitbox gebruikt werkelijke LEX-, SYNT-, FT- en LOG-uitersten.
- De fictieve reserve van 212 px links van LOG is verwijderd.
- De rechterreserve gebruikt de werkelijk berekende SYNT-/FT-regelboxbreedte.
- Projectieassen staan op mobile dichter bij de centrale boom.
- Mobile portrait gebruikt een smaller/hoger layoutprofiel.
- Mobile landscape gebruikt een breed/lager layoutprofiel.
- De veiligheidsmarge rond de fitbox is teruggebracht tot alleen stroke- en labelruimte.
- De oude portrait-reserve van 7,6 rem voor verwijderde canvas-controls is verwijderd.
- Het canvas gebruikt de maximaal beschikbare hoogte.

## Contracten behouden

- Syntax en FT blijven de twee centrale views.
- LOG blijft uitsluitend de zuidas.
- Alle projectiecombinaties gebruiken dezelfde viewBox binnen één interface- en oriëntatiestand.
- Geen horizontale of verticale sprong bij projectiewissels.
- De volledige actieve graph plus zichtbare assen blijft binnen beeld.
