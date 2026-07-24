# Developer notes v4414

## Belangrijkste bestanden

```text
index.html
viewer.js
styles.css
structure-config.html
structure-editor.html
examples-input.html
examples-editor.html
lexicon-config.html
server_nocache.py
sw.js
docs/
```

## Versiebeheer binnen ZIP

Bij elke nieuwe versie:

1. update `VERSION` in `viewer.js`
2. update querystrings in HTML-links
3. update titels/headers in HTML-bestanden
4. update `start-local-viewer.bat`
5. update `README.md`
6. update `docs/CURRENT_STATE.md`
7. update `docs/RELEASE_NOTES.md`
8. update relevante specs als de inhoud verandert

## Architectuurgrens: layout versus rendering

De layoutfase moet vóór iedere render alle structurele en lexicale plaatsen bepalen. Input is minimaal: structuur, `lexInsertions`, plaatsingsregels, Wissels en actieve projecties. De renderer ontvangt alleen het definitieve resultaat plus zichtbaarheid/growthStep.

Verboden in de renderfase:

- nieuwe slots reserveren;
- de hostsubboom alsnog verschuiven;
- een Wisseldoel kiezen;
- coördinaten aanpassen op basis van wat al zichtbaar is.

Een wijziging in inserties of plaatsingsregels moet daarom eerst een volledige nieuwe layoutberekening veroorzaken.

## Testen

Minimaal:

```bash
node --check viewer.js
python3 -m py_compile server_nocache.py
unzip -tq OpenGraph_Lite_Viewer_vXXXX.zip
```

Controleer daarnaast in browser:

- versie zichtbaar in header
- `viewer.js?vXXXX` in serverlog
- `styles.css?vXXXX` in serverlog
- voorbeelden laden
- syntax/functioneel layout order
- takvolgorde normal/flip
