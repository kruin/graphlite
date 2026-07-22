# LAYOUT_RULES

Harde layoutregels voor OpenGraph / GraphLite.

## Centrale views

```text
Syntax   eerste centrale view
FT       tweede centrale view
LOG      uitsluitend zuidas; nooit centrale view
```

## Assen

- LEX: west/links.
- SYNT: oost/rechts.
- LOG: zuid/onder.
- Assen zijn vaste SVG-layoutankers.
- HTML-menu’s beïnvloeden geen fitbox of ashoogte.

## Projecties-menu

- De bediening staat buiten het canvas.
- Smalle kop: `Projecties` / `Projections`.
- Brede uitklap: `LEX`, `SYNT`, `LOG`, `Alle`, `Geen`.
- **Default: LEX + SYNT + LOG zichtbaar.**
- `Geen` betekent bron zonder assen; er is geen Bron-tabblad.
- `Alle` en Reset herstellen de default.

## Geen verspringingen

- Iedere projectiecombinatie gebruikt dezelfde viewBox.
- De centrale graph behoudt x, y en schaal.
- Syntax ↔ FT behoudt dezelfde viewport en handmatige pan/zoom.
- Uitklappen wijzigen de canvasmaat niet.

## Bovenbalk

- Vier smalle koppen: `Zin`, `Bijwoord`, `Syntax`/`FT`, `Projecties`.
- Uitklappen mogen breed zijn en volledige teksten tonen.
- Taal, Help en Config staan onder `Menu`.

## SOV

- Geen SOV-/taalactiebox in het canvas.
- Tijdelijke bediening: `Menu → Extra`.
- Omschakelen van LOG-volgorde mag de viewBox niet wijzigen.

## Eén hoofdmenu

- Boven het grid staat één knop `Menu`.
- Het geopende paneel bevat alle hoofdkeuzes zonder geneste uitklappen.
- Het menu mag het grid niet verplaatsen en sluit bij klik buiten het paneel of Escape.

## Lijndikte

- Boom-, relatie- en hulplijnen: zeer dun.
- Contouren van knopen, slots en regels: zo dun mogelijk.
- Named-projectionlijnen en hun assen: iets dikker dan de bronstructuur, maar niet vet.

## Raster / grid

- `Config → Raster` staat standaard aan.
- Migratie uit een oudere release herstelt Raster eenmaal naar zichtbaar.
- Een daarna bewust opgeslagen keuze blijft behouden.
- De rastergrens volgt de uiterste eindpunten van de zichtbare projectie-stippellijnen.
- Projectieboxen mogen buiten het raster staan; de centrale boom blijft volledig binnen het raster.
- Het wijzigen van rasterzichtbaarheid of rastergrens verandert de viewBox niet.
