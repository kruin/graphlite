# Source changes v2.0.0-rc.41

## Lokale starter

- `start_local_viewer.bat` bevat geen serverprobe, `FOR`-wachtroutine of
  browserlogica meer. Zij kiest alleen Python 3 en controleert of de volledige
  ZIP is uitgepakt.
- Het nieuwe `start_local_viewer.py` regelt serverdetectie, starten, wachten,
  `VERSION.txt`-controle en browseropening.
- Probe en server gebruiken hetzelfde `sys.executable`.
- De tijdelijke compatibiliteitsnaam `startlocalviewer.bat` is weer verwijderd;
  `start_local_viewer.bat` is de enige starter.
- Een startfout blijft volledig zichtbaar voordat de minimale BAT pauzeert.
- `tools/check_local_start.py` controleert de volledige startorkestratie en
  bewaakt dat er maar één start-BAT bestaat.

## Publicatie en full-source-zipkopieën

- De reset-URL werd eerder binnen hetzelfde CMD-haakjesblok gezet en gebruikt.
  Door `%VAR%`-vooruitexpansie kon `start` daardoor een lege URL ontvangen en
  Verkenner openen. `publish_checked.bat` gebruikt nu de afzonderlijke
  subroutine `:open_reset_after_push`.
- De resetmarkering en browseropening krijgen daardoor ingevulde waarden; bij
  een browserfout wordt de handmatige URL getoond.
- `tools/check_release.py` herkent nu ieder `*_full_source*.zip`-bestand als
  gegenereerd release-artefact, ook een browserdownload met `(1)`.
- `.gitignore` en `publish_checked.bat` gebruiken dezelfde generieke regel.
- `maak-volledige-zip.bat` bouwt via een gefilterde tijdelijke bronmap, zodat
  oude full-source-zipkopieën niet recursief in de nieuwe zip terechtkomen.
- De releasecontrole bevat regressiegevallen voor de versiegebonden naam én
  `graphlite_full_source.zip`.

## Recursieve inhoudsmeting

- Subtree-boxen gebruiken niet langer één vaste marge per gridspanne.
- Iedere non-leaf box wordt bottom-up gemeten uit eigen node, werkelijke
  labellengte, alle child-boxen en het caption.
- Breedte en hoogte komen uit één centrale meetpolicy.
- De gemeten SVG-rects dragen diagnose-attributen voor node-ID,
  `required-width`, `required-height` en meetmodus.
- Tree-edges dragen bron- en doel-ID, zodat containment generiek kan worden
  gecontroleerd.

## Compacte westkant

- Unary boxen zoals `NP → HOND`, `NP → MAN` en `V → BIJT` zijn
  inhoudsgestuurd smaller, zonder node of label af te snijden.
- De LEX-Wissellanes zijn compacter en de goot tussen de rechterste Wissel en
  de centrale boom is teruggebracht.
- De rechterreserve volgt de werkelijk actieve slots en Wissellanes; een korte
  analyse reserveert niet langer ongebruikte ruimte voor vier banen.
- Trace- en indexlabels staan dichter bij de LEX-as.
- De benodigde linkerreikwijdte wordt uit de langste actuele bron- of
  insertietrace gemeten; lange vormen zoals `GEBETEN` en `WAARSCHIJNLIJK`
  worden niet afgesneden.
- De zichtbare bijwoordslot-uitleg is compact; de volledige uitleg blijft in
  de tooltip.

## Volledige handheld-compositie

- MAX rekent links de volledige LEX-inhoud mee.
- Rechts tellen de volledige Syntax- én Functional-regelboxen mee, niet alleen
  de groene SYNT-as.
- Het stabiele kader geldt in portret, landschap en op een fysieke telefoon
  met geforceerde Desktop-interface.
- Syntax ↔ Functional behoudt exact dezelfde viewBox.
- Beide views gebruiken één oostas op de gezamenlijke structurele
  grid-envelop, zodat ook de smallere Syntaxboom het landschap beeldvullend
  benut. Deze oostas volgt niet de gemeten rechterrand van iedere subtree.
- De README-resizer bewaart bij een viewportwijziging de werkelijk gerenderde
  paneelmaat; onderwerpen en tekst blijven in portret en landschap bruikbaar.

## Config en toepassingen

- `FEATURE_DEFINITIONS` ondersteunt een abstracte `layoutDemand`.
- Bijwoorden declareert `lexContent: wide-insertion`; de toepassing bevat zelf
  geen x/y of viewportmaat.
- De centrale render-policy vertaalt actieve demands naar benodigde ruimte.
- LOG-majors blijven het vaste raamwerk; een actieve bijwoordtoepassing levert
  een minor zonder de centrale boom te wijzigen.
- De perfectumcategorie en haar lexicale `vdw`-blad hebben voortaan unieke
  IDs; de vroegere dubbele ID/self-edge is verwijderd.

## Documentatie en controle

- De gebruiker heeft rc.41 op 28 juli 2026 handmatig goedgekeurd. README,
  LEESMIJ, projectstatus, overdracht, docs-home, release notes en de
  akkoordlijst leggen dat besluit eenduidig vast.
- Nieuw normatief document:
  `RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md`.
- De documentatie maakt expliciet dat rc.41 recursieve boxmeting bevat, maar
  nog geen algemene pixelgestuurde herplaatsings- of botsingssolver.
- Nieuw:
  `tools/check_recursive_box_fit_runtime.js`.
- De Chromium-test controleert alle 12 basiszinnen, 14 toepassingszinnen en
  zes layoutdichtheden, plus recursieve containment, compacte NP,
  LEX-goot, volledige SYNT-regelboxen, stabiele Syntax/Functional-viewBox,
  drie majors en een actieve minor in mobiel portret, forced desktop en groot
  desktop.
- De bestaande mobiele en landscape-controles toetsen voortaan de volledige
  LEX/SYNT-compositie.
