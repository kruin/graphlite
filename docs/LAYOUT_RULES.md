# LAYOUT_RULES

Harde layoutregels voor OpenGraph Lite Viewer.

## Centrale views en assen

```text
Syntax   eerste centrale view
FT       tweede centrale view
LEX      westas
SYNT     oostas
LOG      zuidas; nooit centrale view
```

## Viewportstabiliteit

- Iedere projectiecombinatie gebruikt dezelfde viewBox.
- Syntax ↔ FT behoudt dezelfde viewport en handmatige pan/zoom.
- Menu’s, Config en rasterzichtbaarheid wijzigen de canvasmaat of fitbox niet.
- Een oriëntatie- of vensterwijziging voert één volledige herfit uit.

## Responsief raster en maximale schermvulling

De standaardwaarde `Boomruimte: Auto` volgt continu de werkelijke verhouding van het beschikbare canvas.

- Portrait: kleinere horizontale celafstand, grotere verticale celafstand, assen dichter bij de centrale boom.
- Landscape: grotere horizontale celafstand, kleinere verticale celafstand, assen verder uit elkaar.
- Desktop: dezelfde continue berekening op basis van de actuele vensterverhouding; geen vaste desktoppreset.
- De viewBox krijgt exact dezelfde verhouding als het beschikbare canvas.
- De rastergrens volgt dezelfde verhouding en blijft gekoppeld aan centrale boom, projectielijnen en assen.
- Syntax, FT en alle projectiecombinaties gebruiken binnen één viewport exact hetzelfde responsieve profiel.

Doel: de graph plus gekozen projecties gebruikt zoveel mogelijk breedte én hoogte, zonder clipping, vervorming of projectieverspringing.

## Projecties

- Bediening staat buiten het canvas onder `Projecties` / `Projections`.
- Beschikbaar: LEX, SYNT, LOG, Alle en Geen.
- Default: LEX + SYNT + LOG zichtbaar.
- Er is geen Bron-tabblad.
- Projecties groeien standaard direct mee met de gerenderde bronknopen.

## Topmenu

```text
Rij 1: Zin · Bijwoord · Syntax/FT · Interface · Projecties · LOG-volgorde
Rij 2: NL/EN · Help · Config
```

- Geen algemene Menu-knop.
- Geen geneste submenu’s.
- Beide rijen hebben eigen vaste ruimte op desktop en mobile.
- Vrije wrapping en een derde rij zijn verboden.

## Raster / grid

- `Config → Boom → Weergave → Raster zichtbaar` staat standaard aan.
- Het raster ligt boven gevulde subtree-achtergronden en onder labels, boomlijnen, knopen en projecties.
- Rasterberekening verandert handmatige pan/zoom niet.

## Lijndikte

- Raster-, boom-, relatie- en hulplijnen: dun.
- Boxcontouren: zo dun mogelijk.
- Projectielijnen: iets dikker.
- Projectieassen: iets dikker dan projectielijnen.

## Compact rasterbereik

- Op een werkelijk compact scherm volgt het raster de zichtbare centrale boom en de uiteinden van de gekozen projectielijnen.
- Het raster wordt op mobile niet tot de aspectratio van het volledige canvas verbreed.
- Deze regel geldt ook wanneer op een telefoon handmatig `Desktop`, `Mobiel staand` of `Mobiel liggend` is gekozen.
- De viewBox blijft stabiel; alleen lege rasterstroken buiten de projectie-inhoud verdwijnen.
- Desktop behoudt de responsieve rc.20-layout.
