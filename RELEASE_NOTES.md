# Release notes

## v4420 · dynamische boomruimte + auto-fit

- Bomen in Assen, Bron en LOG/FT krijgen een configureerbare weergave: `Boomruimte`.
- `auto` en `breed/lager` maken de HOR-afstand groter en de VER-afstand kleiner; daardoor past de boom beter in het venster zonder de onderliggende gridcoördinaten te wijzigen.
- `breed + groter font` verhoogt tegelijk de labelgrootte.
- `Venster: automatisch passend` berekent na elke render de echte SVG-bounding-box en zet de viewBox daarop.
- `FIT` voert dezelfde passende viewBox direct uit.


## v4420 · horizontale LEX-projecties

- Projectielijnen van centrale boom naar LEX blijven nu horizontaal: bronknoop → bronpositie op de LEX-as.
- Tokens worden niet meer eerst naar de oppervlaktevolgorde omhoog/omlaag geschoven.
- Wissel blijft lokaal op de LEX-as: vrij slot wordt gevuld, bronpositie blijft staan als trace.
- In `HOND BIJT MAN` blijft `HOND` dus op zijn horizontale bronplaats; alleen `BIJT` wisselt naar het V2/PV-slot.


---

# Release notes
## v4420 · lokale Wissel op de LEX-as

- Wissel wordt niet meer als verplaatsing vanuit de centrale boom naar de LEX-as getekend.
- De projectielijn uit de boom wijst naar het gevulde LEX-slot in de voorbeeldzinvolgorde.
- De oude basispositie verschijnt als `trace` op een lokale LEX-as-rij.
- Bij meerdere Wissels krijgen de traces eigen lokale rijen onder de oppervlakteslots.



## v4420 · LEX-as woordvolgorde + Wissel-correctie

- De gevulde LEX-posities volgen nu expliciet de tokenvolgorde uit `examples-input.html`.
- V2/Wissel verandert de zichtbare woordvolgorde niet meer op basis van bron-/layoutposities.
- `slot 1` en `slot 2` worden op de LEX-as gekoppeld aan de oppervlakteslots: eerste zinsdeel en V2/PV.
- Oude bronposities blijven zichtbaar als trace; in de assenweergave komen die trace-posities uit de centrale OPN-bron.

## v4420 · V2/Wissel

- Nederlandse V2 geïntegreerd als lokale LEX-plaatsingsregel.
- Extra vrij `slot 2 · V2/PV` toegevoegd naast `slot 1 · topicalisatie`.
- Hoofdzinnen tonen **Wissel**: persoonsvorm/predicaat naar slot 2.
- Oude basispositie wordt als trace getekend (`t[V]`, `t[pv]`).
- Bijzinnen met `OMDAT` blijven zonder V2-Wissel.
- Voorbeeld `TRUI BREIT VROUW` toegevoegd als topicalisatie-demo: `TRUI` blijft patiens/object, `VROUW` blijft agens/subject.
- LEX-as toont Wissel-pijlen en trace-posities.
- `structure-config.html` bevat nu `v2` en `trace` als LEX-slots.


## v4420

- Lexicon uitgebreid met thematische rollen (`agens`, `patiens`, enz.).
- Nouns krijgen naast syntactische rollen ook thematische mogelijkheden.
- Predicaten krijgen eenvoudige selectieframes: toegestane agens-lexemen en patiens-lexemen.
- De korte-uitingenbouwer in `lexicon-editor.html` filtert subject/object op plausibiliteit.
- `trui` is nu patiens/object, maar geen agens/subject.
- `breit` accepteert voorlopig `vrouw` als agens en `trui` als patiens.
- `examples-input.html` markeert tokens met `data-thematic-role`.
- De oude swap-knop is uit de hoofdviewer en gegenereerde uitingen verwijderd.

## v4420

- `lexicon-editor.html` toegevoegd.
- Lexemen kunnen worden toegevoegd, gekopieerd, verwijderd, gezocht/gefilterd en gevalideerd.
- Editor leest `structure-config.html` om geldige sources en LEX-slots aan te bieden.
- Export maakt opnieuw een compatibel `lexicon-config.html`.
- Viewer, voorbeeldeditor, lexicon-config, debug en docs linken naar de nieuwe lexicon-editor.
- `debug.html` controleert nu ook `lexicon-editor.html`.

## v4420

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

## v4420

- LEX-as gecorrigeerd voor horizontale projectie: niet-gewisselde bronwoorden blijven op hun bronhoogte.
- Traces van gewisselde woorden staan op de oude/basispositie: de horizontale bronhoogte, niet op een te hoge lokale rij.
- De groeistap met lokale LEX-as gebruikt nu wel de centrale bronkaart, maar tekent nog steeds geen projectielijnen.

## v4420

- LEX-as gecorrigeerd voor horizontale projectie: niet-gewisselde bronwoorden blijven op hun bronhoogte.
- Traces van gewisselde woorden staan op de oude/basispositie: de horizontale bronhoogte, niet op een te hoge lokale rij.
- De groeistap met lokale LEX-as gebruikt de centrale bronkaart, maar tekent nog steeds geen projectielijnen.
