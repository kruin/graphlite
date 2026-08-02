# OGN Basis

`OGN Basis` is het standaardprofiel van de huidige taaltoepassing in
OpenGraph Lite Viewer. Het profiel is niet hetzelfde als de algemene
**OGN-kern**.

De algemene volgorde is:

```text
OGN Free Placement
→ OGN Projection
→ OGN Calculated Placement
```

De huidige taalboom hoort bij de derde laag en heet **Two-Pass Language
Tree**. Zie `OGN_CORE_PLACEMENT_ARCHITECTURE.md`.

## Inhoud van het taalprofiel

- de centrale Syntax- en Functional-view;
- het vaste raster en het projectiemechanisme;
- de named projections LEX, SYNT en LOG;
- S, O en V als LOG-majors;
- horizontale bronprojectie naar LEX;
- Comp-, topic- en V2-plaatsing;
- voorbeeldzinnen die uitsluitend de basisanalyse gebruiken;
- Play/Groei, beeldinstellingen en OPN-import/export voor de basisanalyse.

## Config

Open `Config`. De volgorde is:

1. `Voorconfig` — algemene mogelijkheden per as;
2. `Toepassingen` — concrete uitbreidingen.

Insertie op LEX, SYNT en LOG staat standaard uit. Het inschakelen van een as
voegt op zichzelf geen taalinhoud toe. Bijwoorden wordt pas beschikbaar als
LEX en LOG beide voor insertie zijn ingeschakeld.

Zolang geen toepassing is aangevinkt, blijft `OGN Basis` actief. Toepassingen
gelden voor de hele viewer: bediening, voorbeelddata, rendering, Play,
documentatie en export volgen steeds dezelfde profielkeuze.

De uitgeschakelde Config-reserveringen Vraagzin, Nadruk en Onaffe zin tellen
niet als toepassing. Ze kunnen niet worden aangevinkt en veranderen niets aan
OGN Basis, ook niet wanneer één of meer insertie-assen aanstaan.

## OPN

Een export vanuit dit profiel bevat:

```text
metadata.profile = base
metadata.extras  = []
metadata.preconfig.insertion = {lex:false, synt:false, log:false}
```

Alleen gegevens die voor de actieve basisanalyse nodig zijn, worden
weggeschreven. Een document dat een niet-ingeschakelde uitbreiding vereist,
wordt pas geopend nadat die uitbreiding in Config is geactiveerd.
