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
start_local_viewer.bat
start_local_viewer.py
startlocalviewer.bat
sw.js
docs/
```

## Versiebeheer binnen ZIP

Bij elke nieuwe versie:

1. update `VERSION` in `viewer.js`
2. update querystrings in HTML-links
3. update titels/headers in HTML-bestanden
4. update `start_local_viewer.bat`
5. update `README.md`
6. update `docs/CURRENT_STATE.md`
7. update `docs/RELEASE_NOTES.md`
8. update relevante specs als de inhoud verandert

## Testen

Minimaal:

```bash
node --check viewer.js
python3 -m py_compile server_nocache.py start_local_viewer.py
python3 tools/check_local_start.py
unzip -tq OpenGraph_Lite_Viewer_vXXXX.zip
```

Controleer daarnaast in browser:

- versie zichtbaar in header
- `viewer.js?vXXXX` in serverlog
- `styles.css?vXXXX` in serverlog
- voorbeelden laden
- syntax/functioneel layout order
- takvolgorde normal/flip
