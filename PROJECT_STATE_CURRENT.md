# PROJECT_STATE_CURRENT

Actuele status van de OpenGraph / GraphLite viewer.

## Versie

- Huidige release candidate: v2.0.0-rc.6.
- Doel: demo/viewer voor JAN / OPN / OpenGraph-taalstructuren.
- Standaardweergave: Syntax tree.
- Standaard alternatieve weergave: Functional structure.

## Open Graph Notation

Open Graph Notation staat op zichzelf.

Kern:

```text
Gridregel
Projectiemechanisme
Volgordelijk schrijven
Projectiemerkers
```

De gridregel geeft elke bronknoop een eigen kruispunt. In de strikte boomtoepassing staat elke knoop als enige op zijn horizontale én verticale gridlijn.

Het projectiemechanisme verbindt bronknopen met projectiemerkers op veronderstelde assen. In de algemene notatie zijn west-as en zuid-as nog niet taalkundig ingevuld.

Open Graph kan volgordelijk worden getoond: bronknopen verschijnen één voor één en projecties kunnen direct worden geschreven zodra hun bronknoop beschikbaar is. Voor boomtoepassingen is de layout tweepass: boxen bottom-up berekenen, daarna top-down renderen. Het resultaat blijft statisch: de centrale graph transformeert niet.

## Named projections

```text
LEX    westelijke named projection: lexicale items, plaatsingsslots, projectiemerkers
SYNT   named projection voor syntactische categorieën en regels
LOG    zuidelijke named projection: selectie van S, O en V
```

LEX en de LEX-projectie blijven blauw. SYNT en LOG hebben instelbare projectiekleuren in Config.

## Hoofdregels

- Projectielijnen zijn visueel belangrijker dan raster- en boomlijnen.
- Raster- en boomlijnen blijven minimaal.
- De LOG-as behoudt zijn eigen SVG-hoogte.
- De SOV/VSO/etc-taalactiebox mag de LOG-as niet verplaatsen.
- Projectiekeuze staat in de bovenbalk en bedekt de boom niet.
- De standaardfit toont de volledige actieve view en de zichtbare bedieningsboxen.
- Syntax tree en Functional structure zijn views op dezelfde voorbeeldzin.

## UI-status

- Hoofdmenu bevat een View-keuze met `Syntax` en `FT`.
- Hoofdmenu bevat een Projectie-keuze met `Alle`, `Bron`, `LEX`, `SYNT` en `LOG`.
- De bovenbalk is één compacte, vaste rij: Zin, Bijwoord, View, Projectie en—alleen bij Bron—Assen.
- Taal, Help en Config staan leesbaar in één tijdelijk `Menu`; daardoor nemen zij geen permanente breedte in.
- De compacte bovenbalk mag de centrale view, viewBox of Play-balk niet laten verspringen.
- De projectiekeuze staat buiten het canvas; er is geen permanente Projecties-box boven de boom.
- Play-balk bevat stap terug, Play, stap vooruit en Reset.
- `Alle` toont de centrale view met alle named projections.
- Bij `Bron` kunnen LEX, SYNT en LOG onafhankelijk en gelijktijdig worden aangezet.
- Bron ondersteunt: geen as, één as, twee assen of alle drie assen.
- LEX, SYNT en LOG tonen elk één named projection op dezelfde vaste aspositie als in `Alle`.
- De LOG-taalactie verschijnt bij `Alle`, `LOG` en `Bron + LOG`.
- Config bevat projectiekleuren: LEX blijft blauw; SYNT en LOG zijn instelbaar.
- Config heeft Ja/Nee voor lokaal bewaren of herstellen van configuratie en een downloadbaar lokaal config-log.
- Mobile gebruikt lichte viewerachtergrond.
- Cache-reset verloopt via `reset-cache.html` en cache-bust-query.

## As-verplaatsingen

As-verplaatsingen zijn een derde stap.

```text
1. Centrale bronknopen plaatsen.
2. Projectiemerkers op named projections schrijven.
3. As-verplaatsingen toepassen op gereserveerde lege plekken.
```

Voor LEX zijn relevante lege plekken:

```text
Comp
vooropplaatsing/topic
V2/PV
bijwoordslot
trace
```

Ruimte kan ontstaan door vrije rijen, verlengde takken of het lager plaatsen van een host-subboom.

## Mobile-test

- Mobile-test op desktop loopt lokaal via `local-mobile-test.js`, niet via Config.
- `local-mobile-test.js` wordt lokaal geladen op `localhost`, `127.0.0.1` of `file:`.
- `local-mobile-test.js` staat in `.gitignore` en hoort niet mee naar GitHub.
- URL-test blijft beschikbaar: `?viewport=mobile-portrait`, `?viewport=mobile-landscape`, `?viewport=desktop`.

## Standaardcontrole

```bat
node --check viewer.js
```

## View-stabiliteit

- `Bron`, `Alle`, `LEX`, `SYNT` en `LOG` gebruiken dezelfde dimensies voor de centrale boom.
- Projectiekeuze wisselt alleen de zichtbare projectie-overlay.
- De centrale graph transformeert niet door de projectiekeuze.


## Stabiele projectie-viewport (v2.0.0-rc.6)

- `Alle`, `Bron`, `LEX`, `SYNT` en `LOG` delen één identieke viewBox.
- Een projectiewissel mag de centrale boom niet horizontaal of verticaal verplaatsen.
- Een projectiewissel mag de schaal niet wijzigen.
- De vaste viewBox is gebaseerd op de unie van de Syntax- en FT-layout.
- De wissel `Syntax ↔ FT` behoudt dezelfde viewport en handmatige pan/zoom.
- Groei mag geen afzonderlijke projectiespecifieke viewBox gebruiken.
- De tijdelijke Bronassen-popover sluit bij klik buiten het menu of met Escape.
