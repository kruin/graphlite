# RC43-test · Config, LEESMIJ-items en projectzip

## Doel

Controleren dat een gebruiker LEESMIJ-items volledig kan inrichten, Config
vanaf ieder onderdeel kan bewaren en de eigen Config naast de
standaardconfig in de projectzip kan meenemen. De eigen Config moet de
standaard per instelling overschrijven zonder het standaardbestand te
verwijderen.

## Automatische controle

Statisch:

```text
python tools/check_readme_item_editor.py
python tools/check_project_config_layers.py
python tools/check_release.py
```

Met Chromium/Playwright:

```text
node tools/check_readme_item_editor_runtime.js
node tools/check_project_config_layers_runtime.js
```

De controles bewaken:

1. één globale Ja/Nee/status-savekaart op ieder Config-tabblad;
2. Tonen ja/nee, navigatietitel NL/EN en veilige itemtekst NL/EN;
3. verbergen zonder verwijderen en opnieuw kunnen tonen;
4. saniteren van script, frame, formulier, event-attribuut en onveilig
   linkschema;
5. lokale beeldinvoer via `Bestanden & export`;
6. alleen PNG/JPEG/WebP/GIF, maximale bestandsgrootte, maximaal aantal slides
   en totale opslaggrens;
7. save en reload van tekst, zichtbaarheid en ingesloten slide;
8. `default-config.json` en `user-config.json` met juist schema en
   versienummer;
9. user-config als overschrijving na de standaardconfig;
10. lokaal bewaarde browser-Config als laatste laag;
11. rechtstreeks schrijven naar exact `config/user-config.json`;
12. servervalidatie en allowlist voor het projectconfigdoel;
13. aanwezigheid van `PUBLICATIE_README.md` in bronset en projectzip.

## Handmatige controle · LEESMIJ-item

- [ ] Open `Config → LEESMIJ-items`.
- [ ] Kies een bestaand item en wijzig de Nederlandse én Engelse
  navigatietitel.
- [ ] Wijzig beide itemteksten. Controleer kop, alinea, nadruk, lijst en een
  normale `https`-link.
- [ ] Probeer ook `<script>`, een `onclick`-attribuut en een
  `javascript:`-link. Geen daarvan mag actief of zichtbaar als uitvoerbare
  inhoud terugkomen.
- [ ] Zet `Tonen` op nee. Het item verdwijnt uit LEESMIJ, maar blijft in de
  Config-keuzelijst staan.
- [ ] Zet `Tonen` weer op ja en controleer dat titel en tekst terugkomen.
- [ ] Kies `Herstel dit item` en controleer dat de ingebouwde broninhoud en
  broncarousel terugkomen.

## Handmatige controle · bestand naar slide

- [ ] Open `Config → Bestanden & export`.
- [ ] Kies een LEESMIJ-item, breed/smal en een lokale PNG, JPEG, WebP of GIF.
- [ ] Voeg het beeld in en open het in `LEESMIJ-items`.
- [ ] Het bronveld meldt een ingesloten bestand en is niet handmatig
  overschrijfbaar.
- [ ] Vul alt-tekst en onderschrift NL/EN in.
- [ ] Controleer de slide in LEESMIJ en wissel vorige/volgende indien het item
  meerdere slides heeft.
- [ ] Probeer een niet-ondersteund bestand en een te groot beeld; de viewer
  moet beide weigeren met een duidelijke melding.

## Handmatige controle · Config-save overal

- [ ] Loop alle Config-tabbladen af. Dezelfde savekaart blijft steeds
  zichtbaar en bereikbaar.
- [ ] Wijzig een instelling en kies `Ja · bewaar config`.
- [ ] Herlaad de viewer en controleer dat de wijziging bewaard is.
- [ ] Wijzig opnieuw en kies `Nee · herstel laatst bewaarde config`; de
  laatste bewaarde toestand komt terug.

## Handmatige controle · eigen Config in de projectzip

- [ ] Pak de bronzip volledig uit en start met `start_local_viewer.bat`.
- [ ] Controleer dat `config/default-config.json` en
  `config/user-config.json` allebei bestaan.
- [ ] Wijzig een duidelijk zichtbare instelling, bijvoorbeeld Raster uit of
  een LEESMIJ-titel.
- [ ] Kies `Config → Bestanden & export → Schrijf huidige Config naar project`.
- [ ] De status noemt exact `config/user-config.json`.
- [ ] Open dat bestand: `kind` is `user`, `enabled` is `true` en de gewijzigde
  instelling staat in `config`.
- [ ] `config/default-config.json` is niet gewijzigd of verwijderd.
- [ ] Herlaad in een schone browsercontext. De user-config overschrijft de
  standaard.
- [ ] Bewaar daarna een afwijkende browser-Config en herlaad. Die
  browser-Config heeft als laatste laag voorrang op de project-user-config.
- [ ] Maak de projectzip en controleer in de zip beide configbestanden,
  `config/README.md` en `PUBLICATIE_README.md`.
- [ ] Test de downloadfallback op een gewone webserver: het gedownloade
  bestand heet `user-config.json` en kan als `config/user-config.json` worden
  geplaatst.

## Handmatige controle · schermmaten

- [ ] Desktop: alle velden, statusregels, knoppen en voorvertoning zijn
  bereikbaar zonder overlap.
- [ ] Mobiel staand: editor en savekaart blijven scrollbaar en bruikbaar.
- [ ] Mobiel liggend: itemtekst, bestandsinvoer en savekaart blijven volledig
  bereikbaar.
- [ ] Geforceerde Desktop-interface op een telefoon blokkeert Config of
  LEESMIJ niet.

## Handmatig resultaat

```text
Datum:
Getest op:
Geteste projectzip:
Akkoord rc.43: ja / nee
Nog te herstellen:
```
