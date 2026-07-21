# LAYOUT_RULES

Harde layoutregels voor OpenGraph / GraphLite.

## Centrale views

```text
1. Syntax
2. FT
```

- Syntax en FT zijn twee centrale views op dezelfde voorbeeldzin.
- FT is de tweede centrale view in het View-menu.
- FT toont de functionele boomstructuur.
- LOG is niet beschikbaar als centrale view.

## Assen en named projections

```text
LEX    links/west
SYNT   rechts/oost
LOG    onder/zuid
```

- Assen zijn layoutankers.
- LOG blijft uitsluitend de zuidas.
- HTML-overlays passen zich aan de LOG-as aan, niet andersom.

## Gridregel

- Elke bronknoop heeft een eigen kruispunt.
- In de strikte boomtoepassing heeft elke knoop een eigen horizontale en verticale gridlijn.
- Rasterlijnen blijven visueel terughoudend; projectielijnen dragen de nadruk.

## Projectiemechanisme

- Een projectie vertrekt vanuit een bronknoop.
- De bronknoop blijft staan.
- De projectie eindigt op een projectiemerker op de bijbehorende as.
- Projectiekeuze voegt overlays toe rond dezelfde centrale graph.

## LOG-as

- De LOG-as heeft een oorspronkelijke SVG-hoogte.
- De SOV/SVO/etc-box mag deze hoogte niet wijzigen.
- LOG toont uitsluitend de logische/functionele S-O-V-volgordeprojectie.
- Een wijziging van LOG muteert Syntax, FT, SYNT en LEX niet.

## Projectiebox rechts

```text
centrale view → SYNT-as → kleine marge → projectiebox
```

De projectiebox mag niet over de SYNT-as vallen.

## LEX en lege plekken

LEX projecteert bronknopen eerst naar projectiemerkers. Daarna kunnen Wissels gereserveerde plekken vullen: Comp, topic/vooropplaatsing, V2/PV, bijwoordslot en trace. De syntax- of FT-view blijft ongewijzigd.

## Projecties-blok

```text
Alle → Bron → LEX → SYNT → LOG
```

Dit blok kiest projectie-overlays. Het is onafhankelijk van het View-menu `Syntax → FT`.

## Fit en mobile

De fitbox omvat de actieve centrale view, LEX-as, SYNT-as, LOG-as, projectiebox en SOV-box. Mobile blijft licht en toont dezelfde scheiding tussen View en Projecties.


## Stabiele projectie-viewport (v2.0.0-rc.4)

- `Alle`, `Bron`, `LEX`, `SYNT` en `LOG` delen één identieke viewBox.
- Een projectiewissel mag de centrale boom niet horizontaal of verticaal verplaatsen.
- Een projectiewissel mag de schaal niet wijzigen.
- De vaste viewBox is gebaseerd op de unie van de Syntax- en FT-layout.
- De wissel `Syntax ↔ FT` behoudt dezelfde viewport en handmatige pan/zoom.
- Groei mag geen afzonderlijke projectiespecifieke viewBox gebruiken.
