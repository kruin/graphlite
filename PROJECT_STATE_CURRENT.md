# PROJECT_STATE_CURRENT

Actuele, leidende status van OpenGraph Lite Viewer.

## Versie

- Releasekandidaat: `v2.0.0-rc.17`.
- Functionele bronbasis: volledige v1.0.16-bronset, doorontwikkeld via de v2.0-releasekandidaten.
- `VERSION.txt` is leidend voor app, cache, documentatie en zipnaam.

## Centrale views

- `Syntax` is de eerste centrale view.
- `FT` is de tweede centrale functionele view.
- `LOG` is uitsluitend de zuidas/projectie en nooit een centrale view.
- Syntax ↔ FT behoudt viewport, schaal en handmatige pan/zoom.

## Projecties

- LEX: west/links.
- SYNT: oost/rechts.
- LOG: zuid/onder.
- Standaard zijn LEX + SYNT + LOG zichtbaar.
- `Projecties` laat iedere as afzonderlijk aan- of uitzetten; `Alle` herstelt alle assen en `Geen` toont alleen de centrale view.
- Iedere combinatie gebruikt dezelfde stabiele viewBox: geen horizontale of verticale verspringing en geen schaalverschil.

## Topmenu

Main toont negen zichtbare hoofditems:

```text
Zin · Bijwoord · Syntax/FT · Interface · Projecties · LOG-volgorde · NL/EN · Help · Config
```

- Geen algemene knop `Menu`.
- Geen geneste submenu’s.
- Keuze-items openen rechtstreeks hun brede paneel.

## Mobile-interface

- `Interface` en `Config → Boom → Interface` bieden Automatisch, Desktop, Mobiel staand en Mobiel liggend.
- Automatisch volgt apparaatbreedte en oriëntatie.
- Op een echt mobiel apparaat gebruikt Main de volledige viewport onder topmenu en Play-balk.

## Raster / grid

- Het raster is standaard werkelijk zichtbaar.
- De instelling staat direct onder `Config → Boom → Weergave → Raster zichtbaar`.
- Bij migratie uit een oudere release wordt Raster eenmaal naar aan hersteld; daarna blijft een bewust opgeslagen keuze behouden.
- Het raster loopt zonder extra buitenmarge tot de uiterste eindpunten van de zichtbare projectie-stippellijnen.
- De rasterberekening verandert de stabiele viewBox niet.

## Lijnhiërarchie

- Boom-, relatie-, raster- en hulplijnen zijn dun.
- Boxcontouren zijn minimaal.
- Projectielijnen en projectieassen zijn iets zwaarder dan de bronstructuur.

## Publicatie-reset

- `publish_checked.bat` opent na een geslaagde push automatisch eenmaal per versie de resetpagina.
- Geen push of mislukte push betekent geen automatische reset.

## Controle

```bat
node --check viewer.js
check_release.bat
```

## Correctie rc.16

- Raster staat standaard aan en wordt binnen de centrale subtree-boxen zichtbaar gerenderd.
- Config toont een directe, vaste schakelaar `Raster zichtbaar` in de Config-balk en dezelfde instelling onder `Boom → Weergave`.
- Mobile topmenu gebruikt exact twee rijen: vijf items boven en vier onder hoofditems; `Config` kan niet door `LOG-volgorde` buiten beeld raken.

## Topmenu-correctie rc.17

Het zichtbare topmenu is op iedere interface tweerijig:

```text
Rij 1: Zin · Bijwoord · Syntax/FT · Interface · Projecties · LOG-volgorde
Rij 2: NL/EN · Help · Config
```

De tweede rij is ook op desktop aanwezig. Mobile-preview berekent de menu-indeling uit de breedte van het telefoonframe, niet uit de omringende desktopviewport.
