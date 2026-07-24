# PROJECT_STATE_CURRENT

## v2.0.10 — plaatsingsplan vóór rendering

De leidende architectuurregel is nu expliciet: structuur, lexicale inserties, plaatsingsregels, wissels en actieve projecties vormen samen de layoutinput. De layout reserveert eerst alle benodigde posities en corridors. De kernzin is daarna de structurele en lexicale invulling van dat plaatsingsplan; rendering en Play/Groei tonen alleen reeds berekende posities.

## v2.0.8 — meervoudige lexicale inserties

Voorbeeldzinnen kunnen meerdere externe LEX-insertiegroepen definiëren. In perfectumvoorbeelden wordt hun lineaire zone vooraf gepland na het object en vóór het V-CLUSTER; scope blijft afzonderlijke metadata. `MISSCHIEN WEL` is één groep; `VAAK` is een tweede groep. Grote insertieboxen staan op minor-ankers en gebruiken een dynamische minimale centrumafstand van 72 pixels, zodat zij niet overlappen. Structurele knopen blijven op het major grid.

Actuele, leidende status van OpenGraph Lite Viewer.

## Versie

- Actuele release: `v2.0.10`.
- Functionele bronbasis: volledige v1.0.16-bronset, doorontwikkeld via de v2.0-releasekandidaten.
- `VERSION.txt` is leidend voor app, cache, documentatie en zipnaam.

## Centrale views

- `Syntax` is de eerste centrale view.
- `Functional` is de tweede centrale functionele view.
- `LOG` is uitsluitend de zuidas/projectie en nooit een centrale view.
- Syntax ↔ Functional behoudt viewport, schaal en handmatige pan/zoom.

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
Rij 1: Zin · Bijwoord · Syntax / Functional · Interface · Projecties · LOG-volgorde
Rij 2: Taal/Language · README/LEESMIJ · Config
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

- `publish_checked.bat` opent na een geslaagde push de resetpagina.
- Geen push of mislukte push betekent geen automatische reset.

## Controle

```bat
node --check viewer.js
check_release.bat
```

## Mobile rastercorrectie rc.21

- Op compacte fysieke schermen is de rasterbreedte inhoudsgebonden: centrale boom plus zichtbare projectielijnen.
- Een geforceerde interfacekeuze mag de rastergrens niet tot de volledige canvas-aspectratio verbreden.
- Desktopgedrag blijft gelijk aan rc.20.

## Mobile landscape

- Een echte telefoon blijft in landscape mobile, ook wanneer de CSS-breedte groter is dan 760 px.
- Compact landscape gebruikt een platter/breder gridprofiel en compacte top-/Play-balken.
- Oriëntatiewissel luistert ook naar `visualViewport.resize` en voert na stabilisatie opnieuw FIT uit.

## TODO

- Niet-binaire, meertakkige bomen.
- JaN (Just another Notation): `S:np-VP`, niet `S:NP-VP`.
- Werknotatie in onderzoek: `S+ np-VP`; eerst voor binaire bomen, later voor meertakkigheid.
- Flip van het verbale cluster: `heeft gebeten` ↔ `gebeten heeft`.



## Config-overzicht (rc.24)

- Config opent met een compact sectieoverzicht; uitgebreide instellingen zijn standaard ingeklapt.
- Secties: Basisweergave, JaN-notatie (TODO), Boom & layout, LEX & bijwoorden, Projecties, Voorbeelden & editors en Geavanceerd.
- Terugnavigatie gebruikt steeds de vorm `Terug naar: Main` of `Terug naar: Config`.
- De bestaande save-werkwijze blijft ongewijzigd: `Ja · bewaar config`, `Nee · herstel laatst bewaarde config`, en download van het lokale config-log.
- JaN is de werknaam voor Just another Notation. TODO: `S:np-VP` (niet `S:NP-VP`); werkvorm `S+ np-VP`; binaire bomen eerst, meertakkigheid later.


## Config-uitleg

- Config opent als compact sectieoverzicht.
- Binnen geopende secties staat bij instellingen waar mogelijk een korte uitleg: wat doet de optie en welke laag blijft ongewijzigd.
- De bestaande `Ja · bewaar config` / `Nee · herstel laatst bewaarde config`-werkwijze blijft behouden.

## Eenvoudige lokale release-installatie

- Pak de bronzip buiten Git uit.
- Kopieer de inhoud rechtstreeks over `C:\git\graphlite`; behoud `.git`.
- Test lokaal via `start-local-viewer.bat` en `reset-cache.html`.
- Publiceer daarna met `publish_checked.bat`.
- De publicatie-BAT vraagt een commitbericht, commit en pusht direct na geslaagde controles.
- Geen `graphlite-next`, clone, bundle, promotie, `git pull` of force-push.

## Talen

- English is de standaardtaal bij een nieuwe installatie.
- Beschikbaar: English, Nederlands, Deutsch, Français en Español.
- Een eerder gekozen taal blijft lokaal bewaard.
- De taalkeuze vertaalt de interface; de voorbeeldzinnen blijven Nederlands en demonstreren Nederlandse woordvolgorde.
- Niet vertaalde technische teksten in Duits, Frans en Spaans vallen terug op Engels.

## v2.0.6 — LEESMIJ/README eerste view

Mobile portrait toont de onderwerpenboom en de actieve itemtekst direct in twee gelijke hoogtezones. Desktop en landscape blijven links-rechts.

## v2.0.10 — LEESMIJ/README eerste view in alle modi

- Desktop, mobile landscape en mobile portrait gebruiken één boven/onder-indeling.
- Onderwerpen staan in de bovenste helft; tekst van het actieve item staat direct in de onderste helft.
- Beide delen scrollen onafhankelijk.
