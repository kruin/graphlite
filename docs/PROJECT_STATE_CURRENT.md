# PROJECT_STATE_CURRENT

Actuele status van de OpenGraph / GraphLite viewer.

## Versie

- Huidige releasekandidaat: `v2.0.0-rc.11`.
- Bronbasis: volledige v1.0.16-bronset, doorontwikkeld via rc.3–rc.9.

## Centrale views

- `Syntax` is de eerste centrale view.
- `FT` is de tweede centrale view op dezelfde voorbeeldzin.
- `LOG` is geen centrale view; LOG is uitsluitend de zuidas/projectie.
- Syntax ↔ FT behoudt viewport, schaal en handmatige pan/zoom.

## Projecties

- LEX staat links/west.
- SYNT staat rechts/oost.
- LOG staat onder/zuid.
- De smalle kop `Projecties` opent een brede keuze voor LEX, SYNT en LOG.
- **Standaard zijn alle drie assen zichtbaar.**
- Iedere as kan onafhankelijk worden uitgezet.
- `Geen` toont alleen de centrale bron; er is geen apart Bron-tabblad.
- `Alle` en een expliciete Reset herstellen LEX + SYNT + LOG.
- Iedere combinatie gebruikt exact dezelfde vaste viewBox; geen horizontale of verticale verspringing.

## Bovenbalk

- Vier smalle koppen met brede uitklappen: `Zin`, `Bijwoord`, `Syntax`/`FT`, `Projecties`.
- Engels: `Sentence`, `Adverb`, `Syntax`/`FT`, `Projections`.
- Lange waarden staan in de brede uitklap, niet in de smalle kop.
- Taal, Help en Config staan onder `Menu`.

## SOV / LOG-volgorde

- Geen SOV-box in Main of in het canvas.
- De LOG-volgordekeuze staat voorlopig onder `Menu → Extra`.
- Zij wijzigt alleen LOG; Syntax, FT en LEX blijven gelijk.
- Twee toekomstige notatieoplossingen staan in `SOV_NOTATION_OPTIONS.md`.

## Migratie en reset

- Een verse rc.9-start opent met alle assen.
- Een oudere lokale config behoudt overige instellingen maar migreert bij de eerste rc.9-start naar alle assen.
- Een in rc.9 opgeslagen config bewaart daarna de bewuste gebruikerskeuze.
- Reset herstelt alle assen.

## Controle

```bat
node --check viewer.js
check_release.bat
```

## Hoofdmenu v2.0.0-rc.11

- Main bevat één knop `Menu`.
- Het menu is plat: geen geneste submenu’s.
- Zin, Bijwoord, Syntax/FT, Projecties, LOG-volgorde, taal, Help en Config staan direct in hetzelfde paneel.
- Standaard zijn LEX, SYNT en LOG zichtbaar.

## Lijnhiërarchie v2.0.0-rc.11

- Boomlijnen en hulplijnen zijn dun.
- Boxcontouren zijn minimaal.
- Alleen named-projectionlijnen en projectieassen krijgen een iets grotere lijndikte.
