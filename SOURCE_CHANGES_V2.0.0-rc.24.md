# Source changes · v2.0.0-rc.24

## Opslaan en exporteren als hoofdingang

Config opende eerder op `Beeld`. De publicatiekaart stond bovendien na Config
bewaren en OPN in het derde tabblad `Bestanden`. De bestaande exportfuncties
waren daardoor moeilijk vindbaar.

De tabvolgorde is nu:

1. `Opslaan & exporteren`;
2. `Beeld`;
3. `LOG & LEX`;
4. `Geavanceerd`.

`Opslaan & exporteren` is ook de standaard actieve tab. Daarbinnen staat de
uitgelichte publicatiekaart als eerste en over de volle paneelbreedte.

## Volgorde binnen Opslaan & exporteren

De kaarten staan in deze volgorde:

1. graph/social-export;
2. OPN opslaan en importeren;
3. Config bewaren of herstellen;
4. voorbeeldzinnen beheren.

De primaire actievolgorde op de eerste kaart is
`LinkedIn-PNG → Play als WebM → Graph als SVG`.

## Controle

`tools/check_config_tabs_and_menus.py` bewaakt nu ook:

- eerste en standaard actieve tab;
- kaartvolgorde;
- actievolgorde;
- prominente tab- en kaartopmaak.
