# Gebruikershandleiding — concept v4420

## Horizontale LEX-projectie lezen

In `Assen` loopt elke projectielijn van een bronknoop horizontaal naar de LEX-as. Daarna toont de LEX-as eventuele Wissels. Bij `HOND BIJT MAN` blijft `HOND` op zijn bronhoogte; `BIJT` wisselt lokaal naar het V2-slot en laat op de oude V-positie een trace achter.


---

# Gebruikershandleiding — concept v4420

## V2 en Wissel bekijken

Open `Assen` of `LEX`. In hoofdzinnen tekent de LEX-as nu:

```text
slot 1 · TOPIC
slot 2 · V2/PV
trace op oude basispositie
Wissel-pijl tussen trace en gevuld slot
```

Gebruik de voorbeelden `HOND BIJT MAN`, `VROUW BREIT TRUI` of `TRUI BREIT VROUW`. In het laatste voorbeeld staat `TRUI` voorop, maar blijft het object/patiens.

---

## Lexicon en korte uitingen beheren

Open:

```text
lexicon-editor.html
```

Gebruik dit scherm voor twee bestanden:

```text
lexicon-config.html   = woorden/lexemen
examples-input.html   = korte voorbeeldzinnen
```

Vooralsnog ondersteunt de editor korte zinnen: hoofdzin, omdat-bijzin en perfectum. Na bewerken download je beide HTML-bestanden en vervang je ze in de viewer-map.

---

# Gebruikershandleiding — concept v4420

## Starten

1. Pak de ZIP uit.
2. Open `start-local-viewer.bat`.
3. Open `http://localhost:8088`.
4. Gebruik een harde reload als een oude tab nog actief is.

## Voorbeeld kiezen

Kies bovenin een voorbeeldzin. De zin wordt geladen in de centrale OPN-weergave en in LEX.

## Thematische rollen gebruiken

In de lexicon-editor krijgen nouns thematische rollen zoals `agens` en `patiens`. Voor de huidige korte actieve zinnen geldt: subject = agens, object = patiens. De editor filtert de keuzelijsten zodat onwaarschijnlijke combinaties, zoals `trui` als agens, niet worden aangeboden.

## Structuur bewerken

Open `Structure-editor`. Bewerk eerst syntax-config of functional-config. Download daarna `structure-config.html` en vervang het bestand in de viewer-map.

## Voorbeelden bewerken

Open `Voorbeeldeditor`. Voeg voorbeelden toe, wijzig tokens, kies source/rol en download `examples-input.html`.

## Lexicon bewerken

Open `Lexicon-editor`.

Gebruik:

```text
+ N      nieuw naamwoord
+ V      nieuw werkwoord
+ AUX    nieuw hulpwerkwoord
+ COMP   nieuw complementizerwoord
```

Na bewerking:

```text
Download lexicon-config.html
vervang het bestaande bestand in de viewer-map
herlaad examples-editor.html en de viewer
```

De editor valideert tegen `structure-config.html`: sources zoals `subject`, `object`, `predicate`, `pv`, `vdw` en slots zoals `comp`, `topic`, `aux`.



## Groei-presentatie

In het projectiepaneel staat `Groei`.

Gebruik:

```text
Groei aanzetten
0       = terug naar leeg raster/titels
← / →   = vorige/volgende stap
Play    = automatisch afspelen
slider  = direct naar een stap
```

Sneltoetsen:

```text
g = groei aan/uit
n = volgende stap
p = vorige stap
```

De viewer berekent eerst de volledige layout. Tijdens de groei verschijnen alleen meer onderdelen; bestaande knopen verschuiven niet.

## Documentatie openen

Gebruik de knop `Docs` in de viewer of open `docs/docs-home.html`.


## Boom passend maken

Gebruik in het projectiepaneel:

```text
Boomruimte: auto / compact / breed-lager / breed+groter font
Venster: automatisch passend / vast 1500×900
FIT: pas de viewBox onmiddellijk aan de getekende inhoud aan
```

`Boomruimte` verandert de visuele afstand tussen gridposities. De onderliggende boom- en LEX-regels blijven gelijk.

