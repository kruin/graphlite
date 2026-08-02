# Lijnbeeld en plaatsingsmodi

Status: technisch contract voor source build
`v2.0.0-rc.45-direct-config-hard-no-show-20260803.12`.

## Plaatsingshiërarchie in de interface

Het menu **Language Tree** biedt drie methoden, met een bewust verschil in
gewicht:

| Methode | Soort | Rol in de viewer |
|---|---|---|
| Language Tree | calculated | Primaire toepassing; berekent de taalboom in twee passes en toont daarna de gekozen projecties. |
| Greedy Grow | direct | OGN-illustratie; gebruikt de geaccepteerde historische vierarmige zoekvolgorde. |
| Random | direct | OGN-illustratie; kiest met een seed telkens één momenteel vrije rij-kolomcombinatie. |

Language Tree staat bovenaan en blijft visueel prominent. De twee directe
illustraties staan eronder. In een directe modus verdwijnen bedieningselementen
die alleen betekenis hebben voor een taalboom, zoals zin, bijwoord,
LEX/SYNT/LOG-keuze en LOG-volgorde.

Direct betekent hier letterlijk één stap tegelijk:

1. lees de reeds bezette rijen en kolommen;
2. kies volgens de actieve strategie een vrije kandidaat;
3. schrijf die knoop onmiddellijk;
4. werk de bezetting bij;
5. begin pas daarna aan de volgende stap.

Er wordt geen toekomstig eindbeeld opgeslagen. `←`, `→`, `Play` en `Reset`
werken op de actieve methode. Een Random-reset kiest een nieuwe seed; undo en
opnieuw vooruitgaan blijft binnen dezelfde seed reproduceerbaar. Wisselen naar
een directe illustratie verandert de Language-Tree-data niet.

De historische Greedy-Grow-engine blijft een afzonderlijke, ongewijzigde bron,
omdat publicatieslide 5 daar aantoonbaar uit is afgeleid. Random gebruikt
`random-placement-engine.js` en kan de geaccepteerde Greedy-reconstructie dus
niet stilzwijgend veranderen.

De twee directe methoden hebben onder **Config → Direct** ieder een eigen
submenu. Hun volledige opties, Configsleutels en de reproduceerbare
Random-herhalingsanalyse staan in `DIRECT_PLACEMENT_CONFIG.md`.

## Instelbaar lijnbeeld

Onder **Config → Beeld → Lijnbeeld** staan:

| Instelling | Effect |
|---|---|
| Rasterkleur | Neutrale kleur van het grid tussen de buitenste actieve assen. |
| Rasterlijnen | Gewicht en zichtbaarheid van gewone en hoofdrasterlijnen. |
| Projectielijnen | Gewicht van projectieverbindingen én de named projection-assen. |
| Boxlijnen | Gewicht van structurele, LEX-, SYNT- en LOG-boxcontouren. |
| LEX-kleur | Kleur van LEX-as, LEX-projectielijnen en LEX-boxen. |
| SYNT-kleur | Kleur van SYNT-as, SYNT-projectielijnen en structurele/SYNT-boxen. |
| LOG-kleur | Kleur van LOG-as, LOG-projectielijnen en LOG-boxen. |

De standaardkleuren zijn bewust verschillend: LEX blauw, SYNT groen en LOG
paars. Het raster gebruikt een eigen zacht grijsblauw. De keuzes `licht`,
`normaal` en `zwaar` veranderen alleen de presentatie. Zij veranderen nooit
gridcoördinaten, plaatsingsregels of de harde unieke-rij/kolominvariant.

Bij Language Tree wordt het grid alleen binnen het door de actieve buitenassen
begrensde vlak getekend. Het raster maakt zo de ruimte tussen de assen leesbaar
zonder buiten die compositie door te lopen. In directe modi omvat het grid het
actuele knopenveld plus een kleine vaste marge.

De kleurtoewijzing is semantisch:

- LEX-lijn, LEX-as en LEX-box horen bij de LEX-kleur;
- SYNT-lijn, SYNT-as en structurele/SYNT-box horen bij de SYNT-kleur;
- LOG-lijn, LOG-as en LOG-box horen bij de LOG-kleur;
- gewone rasterlijnen behouden hun afzonderlijke neutrale rasterkleur.

Alle waarden gaan mee in de bestaande Config-lagen:

```text
code-default → config/default-config.json → config/user-config.json
→ browser-Config
```

## Structureel EOF/EOL-beleid

`.gitattributes` is de autoriteit voor regelafbrekingen:

- web-, bron-, data- en documentatiebestanden: LF;
- Windows-scripts (`.bat`, `.cmd`, `.ps1`): CRLF;
- binaire bestanden: nooit als tekst normaliseren.

`.editorconfig` geeft dezelfde keuze vooraf aan geschikte editors en vraagt
altijd om een finale EOL. De release-normalizer blijft de doorslaggevende
controle, ook wanneer een editor dit bestand niet ondersteunt.

`tools/normalize_text_files.py` bewaakt daarnaast **exact één afsluitende
regelafbreking**. Het verwijdert alleen lege of witruimteregels aan het einde;
bewuste lege regels midden in een document blijven staan.

De publicatiestroom doet dit in vaste volgorde:

```text
normaliseer werkbestanden
→ voer releasecheck uit
→ git add --renormalize
→ stage alle wijzigingen
→ git diff --cached --check
→ commit en push
```

Hierdoor zijn `LF will be replaced by CRLF`-waarschuwingen geen terugkerend
handwerk meer en kan een extra lege EOF-regel de publicatie niet pas na het
invoeren van de commitboodschap blokkeren.

## Automatische controles

- `python tools\normalize_text_files.py` — EOL en exact één terminale EOL;
- `python tools\check_text_normalization.py` — regressieproeven met dubbele
  LF/CRLF aan EOF, BOM, interne lege regels en Windows-scripts;
- `node tools\check_greedy_grow_reconstruction.js` — historische directe
  Greedy-reconstructie;
- `node tools\check_random_placement.js` — seed, undo en unieke rijen/kolommen;
- `python tools\check_line_style_and_direct_modes.py` — interface,
  Config-waarden, kleurscheiding en renderkoppelingen;
- `python tools\check_publication_carousel.py` — Greedy-bron en afgeleide
  slides blijven onderling aantoonbaar gelijk.
