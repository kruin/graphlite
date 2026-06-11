# Release notes

## v4408

- Correctie groei/projectiewissel: LEX is geen groei-projectie en mag de opgeslagen groeistap niet naar 0 clampen.
- Terugwisselen van LEX naar Assen/Bron/LOG herstelt nu de laatst geldige groeistap; de boom blijft zichtbaar.
- `setProjection(...)` bewaart groeistatus expliciet en stopt alleen playback bij niet-ondersteunde projecties.

## v4407

- Groei-presentatie toegevoegd aan de viewer.
- Nieuwe controls in het projectiepaneel: `Groei`, stap-slider, `0`, vorige, `Play`, volgende.
- Groei werkt vanuit de vooraf berekende layout: de boom verschuift niet tijdens het afspelen.
- Bottom-up groeivolgorde: leaves → categorie/role-nodes en subtree-boxen → OPN-slot 1 → LEX-projectie en projectiepanelen.
- Stap-3/render blijft gescheiden van groei-presentatie: renderlaag bepaalt z-order; groei bepaalt alleen welke reeds berekende elementen zichtbaar zijn.
- Sneltoetsen: `g` toggelt groei, `n` volgende stap, `p` vorige stap.
- Docs bijgewerkt met groei/render-onderscheid.

## v4406

- Render-volgorde expliciet gemaakt.
- Subtree-boxen: eerst alle rects, daarna alle captions.
- Equal-size subtree-box tie-break vastgelegd: boven→beneden, links→rechts, daarna oorspronkelijke layoutvolgorde.
- Node-rendering in twee lagen: eerst shapes, daarna labels.
- Interne helper `renderWith` hernoemd naar `layoutWithChildOrder`, omdat die layoutvarianten berekent en niet rendert.
- Docs bijgewerkt met stap-3/render-volgorde.

## v4405

- Root/startdiagnose aangescherpt.
- `reset-cache.html` toegevoegd voor oude service workers/caches.
- `debug.html` controleert nu of `index.html` echt de viewer is.
- `docs/index.html` vervangen door `docs/docs-home.html`, zodat `/docs` niet per ongeluk de viewer-root overschrijft.
- `viewer.html` toegevoegd als fallback-entry.

## v4404/v4403

- Herstelbuilds voor startproblemen na v4402.
- `.nojekyll` toegevoegd voor GitHub Pages: statische deploy zonder Jekyll-build.
- `__pycache__` en `.pyc` uit de ZIP verwijderd.
- `.gitignore` toegevoegd voor lokale cachebestanden.
- `server_nocache.py` accepteert optioneel een poortargument en stuurt extra no-cache/nosniff headers.
- `start-local-viewer.bat` zet `PYTHONDONTWRITEBYTECODE=1`.
- Inline startdiagnose toegevoegd.

## v4402

- Flipdoel per vertakking toegevoegd: compact, align, normal, flip-all.
- Per-vertakking-config: top, VP/ARG-STRUCT, overig.

## v4401

- `docs/`-map toegevoegd als canonieke projectcontext.
- Docs-knop toegevoegd aan viewer.
- Documenten toegevoegd voor app-context, design decisions, layout, structure-config, lexicon/examples, current state, known issues, next steps en developer notes.

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
