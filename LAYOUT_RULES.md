# LAYOUT_RULES

Harde layoutregels voor OpenGraph Lite Viewer `v2.0.0-rc.33`.

## Vaste projectieposities

| Onderdeel | Positie |
|---|---|
| centrale Syntax / Functional-view | midden |
| LEX | west/links |
| SYNT | oost/rechts |
| LOG | zuid/onder |

HTML-menu’s beïnvloeden de SVG-fitbox niet. Iedere projectiecombinatie en
Syntax ↔ Functional behoudt x, y en schaal.

## Desktop-MAX

- `Boomruimte=MAX` en `Venstervulling=MAX` zijn de defaults.
- Het canvas vult de volledige vensterbreedte en alle beschikbare hoogte
  onder topmenu en Play-balk.
- De MAX-fit gebruikt een compacte unie van Syntax, Functional, LEX, SYNT en LOG.
- Het oude ruime onzichtbare stabiliteitskader, raster en hulplabels tellen
  niet mee.
- MAX gebruikt op desktop `fontScale=1.70`; de boom is tegelijk breed en laag.

## LOG-slots

- Majors en minors staan op één vaste LOG-gridstap.
- `slotPx = data-axis-slot-pixels`.
- Een extra minor maakt de LOG-as één stap langer.
- Bestaande slots worden niet samengedrukt.
- Tekstbreedte en boxbreedte veranderen de logische afstand niet.
- Het stabiele projectieframe omvat de actuele maximale LOG-spanne.

## LEX-rijen

- Iedere projectielijn van een lexicale bron naar LEX is exact horizontaal:
  `y(LEX-bronanker) = y(bronknoop)`.
- LOG-rijen zijn doelrijen en nooit projectieankers.
- `rowPx = data-lex-slot-pixels`.
- Meerdere werkwoordelijke sources binnen major V krijgen opeenvolgende rijen.
- Een eerste Wissel verplaatst een bronanker langs LEX naar zijn
  LOG-afgeleide doelrij en laat een trace op de horizontale bronhoogte.
- Topic/V2 en andere Wissels verplaatsen pas daarna een item en laten een
  tweede trace op de LOG-doelrij.
- Een minor verlaagt geen syntax- of Functional-subboom.

## Lijndikte

- Boom-, relatie- en hulplijnen zijn zeer dun.
- Projectielijnen en projectieassen zijn iets nadrukkelijker, maar niet vet.
- LOG-minors hebben een gestreepte contour; majors een doorgetrokken contour.

## Menu

Main heeft negen directe topmenu-items in twee vaste rijen:

```text
Zin · Bijwoord · Syntax / Functional · Interface · Projecties · LOG-volgorde
Taal · LEESMIJ/README · Config
```

Er is geen algemene Menu-knop. Uitklappanelen mogen het canvas niet
verplaatsen.

## Profielresolutie vóór layout

Gebruiksprofielen worden vóór de plaatsingsberekening opgelost. De LOG-sequentie bevat alleen `LOG` en `LOG+LEX`; de LEX-plaatsingssequentie bevat `LOG`, `LEX` en `LOG+LEX`. De renderer reserveert geen ruimte en kiest geen profiel. Een meerwoordconstructie met `visible-slots=1` blijft één fysieke insertieplaats, ongeacht het aantal componenten.

## Plaatsingsplan vóór rendering

```text
layoutinput = structuur + lexicale inserties + profielen + plaatsingsregels + Wissels + projecties
```

Bereken eerst hosts, landingsplaatsen, gereserveerde gridruimte en corridors.
Plaats daarna de centrale boom en vul de kernzin lexicaal in. De renderer tekent
vervolgens het vaste resultaat en mag geen nieuwe posities kiezen.

Een expliciete zinsgebonden lineaire plaats, zoals
`post-object-pre-vcluster`, heeft bij automatische plaatsing voorrang op een
algemene klasse-default. Scope en lineaire plaats blijven afzonderlijke
eigenschappen.

## JaN-rastercontract

De geplande JaN-notatie gebruikt voorlopig `S:np-VP`, nadrukkelijk niet
`S:NP-VP`. `S+ np-VP` is de onderzoeksnotatie. De regel wordt eerst voor
binaire bomen uitgewerkt; meertakkigheid volgt later.
