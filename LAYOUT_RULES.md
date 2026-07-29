# LAYOUT_RULES

Harde layoutregels voor OpenGraph Lite Viewer `v2.0.0-rc.43`.

## Vaste projectieposities

| Onderdeel | Positie |
|---|---|
| centrale Syntax / Functional-view | midden |
| LEX | west/links |
| SYNT | oost/rechts |
| LOG | zuid/onder |

HTML-menu’s beïnvloeden de SVG-fitbox niet. Iedere projectiecombinatie en
Syntax ↔ Functional behoudt x, y en schaal.

De SYNT-oostas staat voor beide centrale views op de rechterrand van hun
gezamenlijke structurele grid-envelop. Zij volgt niet de gemeten rechterrand
van iedere subtree. LEX reserveert rechts de breedste actieve slotvorm en
alleen de actieve Wissellanes, met een vaste bovengrens van vier lanes.

## Recursief gemeten subtree-boxen

- Gridplaatsing blijft structureel en bottom-up.
- Daarna meet iedere subtree recursief eigen node, labels en child-boxen.
- Caption en centrale binnenmarge horen bij `requiredWidth/requiredHeight`.
- Een zichtbare subtree-rect gebruikt uitsluitend die gemeten geometrie.
- De gemeten rectmaat herplaatst in rc.42 geen knopen of naburige subtrees.
- Toepassingen declareren een inhoudssoort/layout-demand, nooit x/y.
- Alle meetmaten komen uit één layout-policy; zinspecifieke pixelpatches zijn
  verboden.

## Desktop-MAX

- `Boomruimte=MAX` en `Venstervulling=MAX` zijn de defaults.
- Het canvas vult de volledige vensterbreedte en alle beschikbare hoogte
  onder topmenu en Play-balk.
- De MAX-fit gebruikt een compacte unie van Syntax, Functional, LEX, SYNT en LOG.
- Het oude ruime onzichtbare stabiliteitskader, raster en hulplabels tellen
  niet mee.
- MAX gebruikt op desktop `fontScale=1.70`; de boom is tegelijk breed en laag.

## Mobiele MAX en rastergrenzen

- Een fysieke telefoon blijft als handheld gelden in portret, landschap en
  bij een geforceerde Desktop-interface.
- De lokale desktopsimulatie blijft na de MAX-render binnen 390 × 844
  (staand) of 844 × 390 (liggend); algemene `100vw`-regels mogen deze
  testframes niet overschrijven.
- MAX focust de stabiele unie van het Syntax- en Functional-asgebied.
- In portret benut het asgebied primair de volledige breedte.
- De volledige horizontale compositie kan in portret klein blijven en
  verticale witruimte overlaten; een gestapelde portretlayout bestaat nog niet.
- In landschap wordt de layout zelf lager en breder. MAX gebruikt een
  volledige `contain`-fit; cover-zoom en het afsnijden van rastertop, LEX,
  SYNT of LOG zijn niet toegestaan.
- Twee compacte menurijen, het SVG en Play bezetten afzonderlijke verticale
  zones. Geen van deze drie lagen mag een andere laag bedekken.
- De eerste MAX-focus bevat volledige LEX-inhoud en volledige SYNT-regelboxen.
- Pan en pinch-zoom blijven beschikbaar voor nadere inspectie.
- Het raster ligt binnen de projectie-assen: links LEX, rechts SYNT en onder
  LOG. Er wordt geen halve rasterstap buiten de assen getekend.

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
- LOG-basis en een eventuele expliciete topic/V2-regel worden vóór render tot
  één einddoel samengevoegd.
- Per bronwoord wordt daarom hoogstens één zichtbare Wissel en één trace op de
  horizontale bronhoogte getekend.
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
