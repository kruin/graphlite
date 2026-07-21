# PROJECT_STATE_CURRENT

Actuele status van de OpenGraph / GraphLite viewer.

## Versie

- Huidige releasekandidaat: v2.0.0-rc.4.
- Volledige functionele bronbasis: v1.0.16.
- Doel: demo/viewer voor JAN / OPN / OpenGraph-taalstructuren.
- Eerste centrale view: Syntax.
- Tweede centrale view: FT.

## Vaste scheiding

```text
CENTRALE VIEWS   Syntax | FT
NAMED PROJECTIONS LEX | SYNT | LOG
```

- FT is de functionele boomview met onder meer CLAUSE, PRED, AGENS en PATIENS.
- FT staat als tweede optie in het View-menu, direct na Syntax.
- LOG is geen centrale view.
- LOG is uitsluitend de named projection op de zuidas.
- De SOV/SVO/etc-actie wijzigt alleen de LOG-volgorde.

## Open Graph Notation

Open Graph Notation staat op zichzelf. De kern bestaat uit de gridregel, het projectiemechanisme, volgordelijk schrijven en projectiemerkers. Elke bronknoop heeft een eigen kruispunt. De bronknoop blijft staan wanneer een projectie naar een as wordt geschreven.

## Named projections

```text
LEX    west: lexicale items, plaatsingsslots en projectiemerkers
SYNT   oost: syntactische categorieën en regels
LOG    zuid: selectie en volgorde van S, O en V
```

LEX blijft blauw. SYNT en LOG hebben instelbare projectiekleuren.

## Hoofdregels

- LEX-as staat links/west.
- SYNT-as staat rechts/oost.
- LOG-as staat onder/zuid.
- FT is een centrale view naast Syntax, niet een as en niet een LOG-laag.
- De LOG-as behoudt zijn eigen oorspronkelijke SVG-hoogte.
- De SOV-box past zich aan de LOG-as aan en mag de as niet verplaatsen.
- Projectieboxen staan rechts van de SYNT-as.
- De standaardfit toont de volledige actieve centrale view, assen en zichtbare bedieningsboxen.
- Wisselen tussen Syntax en FT verandert de voorbeeldzin niet.
- Wisselen tussen projecties muteert de centrale graph niet.

## UI-status

- Het View-menu bevat exact twee centrale keuzes in deze volgorde: `Syntax`, `FT`.
- De Projecties-box bevat `Alle`, `Bron`, `LEX`, `SYNT`, `LOG`.
- `Alle` toont de actieve centrale view met alle named projections.
- `Bron` toont alleen de actieve centrale view.
- `LEX`, `SYNT` en `LOG` tonen elk hun eigen named projection.
- Play-balk bevat stap terug, Play, stap vooruit en Reset.
- Projecties-box en taalactiebox zijn verplaatsbaar wanneer Config dit toestaat.
- Mobile gebruikt een lichte viewerachtergrond.
- Cache-reset verloopt via `reset-cache.html` en een versiequery.

## Compatibiliteit

- Nieuwe opgeslagen configuraties gebruiken `central_opn: "ft"`.
- Oude configuraties met `central_opn: "functional"` worden als FT ingelezen.

## Standaardcontrole

```bat
check_release.bat
```

Deze controle omvat minimaal `node --check viewer.js`, versieconsistentie, lokale links en de scheiding Syntax/FT tegenover LOG.


## Stabiele projectie-viewport (v2.0.0-rc.4)

- `Alle`, `Bron`, `LEX`, `SYNT` en `LOG` delen één identieke viewBox.
- Een projectiewissel mag de centrale boom niet horizontaal of verticaal verplaatsen.
- Een projectiewissel mag de schaal niet wijzigen.
- De vaste viewBox is gebaseerd op de unie van de Syntax- en FT-layout.
- De wissel `Syntax ↔ FT` behoudt dezelfde viewport en handmatige pan/zoom.
- Groei mag geen afzonderlijke projectiespecifieke viewBox gebruiken.
