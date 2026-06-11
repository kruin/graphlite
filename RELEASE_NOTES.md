# Release notes

## v4405

- `Flipdoel` uitgebreid naar per-vertakking beslissen.
- Default gewijzigd naar `auto-compact`.
- Tweede doel toegevoegd: `auto-align` voor verticale alignment van rollen zoals `subject/AGENS` en `object/PATIENS`.
- Menu-overrides toegevoegd voor `Top S/CLAUSE`, `VP / ARG-STRUCT` en `Overig`.
- JSON/.OPN-export neemt branch-overrides mee.
- Docs bijgewerkt.

## v4405

- `docs/`-map toegevoegd als canonieke projectcontext.
- Docs-knop toegevoegd aan viewer.
- Documenten toegevoegd voor app-context, design decisions, layout, structure-config, lexicon/examples, current state, known issues, next steps en developer notes.
- Functionele app-logica gelijk aan v4400.

## v4400

- `Takvolgorde` toegevoegd.
- Flip werkt op alle vertakkingen.
- Default: `Layout order = left-first`, `Takvolgorde = normaal`.

## v4399

- Left/right-switch geldt voor syntax én functioneel.
- Menu-label naar `Layout order`.

## v4398

- Left/right-switch werkt in functionele layout-engine.

## v4397

- Lidwoorden/determinatoren verwijderd uit systeem en voorbeelden.

## v4396

- Functional-config gewijzigd naar `CLAUSE → PRED ARG-STRUCT`.
- `PRED` en `ARG-STRUCT` zijn zelfstandige subtree-boxes.

## v4395

- No-cache lokale server toegevoegd.
- Service-worker cleanup.

## v4394

- Perfectumregel toegevoegd met `pv` en `vdw`.
- Voorbeeld `HOND HEEFT MAN GEBETEN` toegevoegd.

## v4393

- Lexicale items verwijderd uit structure-config.
- Abstracte sources: `subject`, `object`, `predicate`.

## v4392

- Bescheiden lexicon toegevoegd.

## v4391

- Structure-editor bevat syntax-config en functional-config als eerste stap.

## v4389

- Voorbeeldzinnen-editor toegevoegd.

## v4388

- `examples-input.html` toegevoegd.
- Subject vet, object cursief.

## v4386

- OPN-slot 1 voor topicalisatie/vooropplaatsing.

## v4385

- LEX-slot 0 voor Comp/(om)dat boven S-box.

## v4384

- LEX-projectie horizontaal.

## v4383

- Cache-issue rond functionele structuur opgelost via geversioneerde JS/CSS.

## v4405
- Herstelbuild voor startproblemen na v4402.
- `.nojekyll` toegevoegd voor GitHub Pages: statische deploy zonder Jekyll-build.
- `__pycache__` en `.pyc` uit de ZIP verwijderd.
- `.gitignore` toegevoegd voor lokale cachebestanden.
- `server_nocache.py` accepteert nu optioneel een poortargument en stuurt extra no-cache/nosniff headers.
- `start-local-viewer.bat` zet `PYTHONDONTWRITEBYTECODE=1`, zodat Python geen `__pycache__` aanmaakt.
- `debug.html` toegevoegd om lokaal/GitHub Pages te testen of alle assets laden.
- Inline startdiagnose toegevoegd: JavaScript-startfouten verschijnen in de statusregel.


## v4405
- Root/startdiagnose aangescherpt.
- `reset-cache.html` toegevoegd voor oude service workers/caches.
- `debug.html` controleert nu of `index.html` echt de viewer is.
- `docs/.nojekyll` toegevoegd voor GitHub Pages wanneer per ongeluk `/docs` als bron wordt gebruikt.
