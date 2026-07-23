# PROJECT_STATE_CURRENT

Actuele, leidende status van OpenGraph Lite Viewer.

## Versie

- Releasekandidaat: `v2.0.0-rc.20`.
- Functionele bronbasis: volledige v1.0.16-bronset, doorontwikkeld via de v2.0-releasekandidaten.
- `VERSION.txt` is leidend voor app, cache, documentatie en zipnaam.

## Centrale views

- `Syntax` is de eerste centrale view.
- `FT` is de tweede centrale functionele view.
- `LOG` is uitsluitend de zuidas/projectie en nooit een centrale view.
- Syntax ↔ FT behoudt viewport, schaal en handmatige pan/zoom.

## Projecties en groei

- LEX: west/links.
- SYNT: oost/rechts.
- LOG: zuid/onder.
- Standaard zijn LEX + SYNT + LOG zichtbaar.
- Iedere as kan afzonderlijk worden uitgezet; `Alle` herstelt alle assen en `Geen` toont alleen de centrale view.
- Bij groei verschijnt iedere geldige gekozen projectie direct met haar gerenderde bronknoop.
- LEX-Wissels volgen pas na de structurele groei.

## Responsieve grid-layout

`Boomruimte: Auto` gebruikt vanaf rc.20 geen vaste portrait-, landscape- of desktopafmetingen meer. De actuele canvasverhouding bepaalt continu:

- horizontale en verticale celafstand;
- afstand van centrale boom tot LEX- en SYNT-as;
- maximale breedte van de regelprojectie;
- de verhouding van raster en viewBox.

Portrait wordt smaller en hoger; landscape breder en lager; desktop volgt de feitelijke vensterverhouding. Alle centrale views en projectiecombinaties delen binnen dezelfde viewport exact hetzelfde profiel. Doel is maximale schermvulling zonder clipping of verspringing.

## Topmenu

```text
Rij 1: Zin · Bijwoord · Syntax/FT · Interface · Projecties · LOG-volgorde
Rij 2: NL/EN · Help · Config
```

- Geen algemene knop `Menu`.
- Geen geneste submenu’s.
- De tweede rij is zichtbaar op desktop en mobile.

## Raster

- Raster staat standaard aan.
- Instelling: `Config → Boom → Weergave → Raster zichtbaar`.
- Het raster is zichtbaar binnen en buiten de subtree-boxen.
- De rasterlaag en viewBox volgen de actuele schermverhouding.

## Publicatie-reset

- `publish_checked.bat` opent na een geslaagde push automatisch eenmaal per versie de resetpagina.
- Geen push of mislukte push betekent geen automatische reset.

## Controle

```bat
node --check viewer.js
check_release.bat
```
