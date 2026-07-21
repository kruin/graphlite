# SOURCE_CHANGES v2.0.0-rc.4

## Basis

De volledige inhoud van `OpenGraph_Lite_Viewer_v1.0.16_stable_central_tree_views.zip` is als basis overgenomen. Geen van de 106 oorspronkelijke bestanden ontbreekt.

## Functionele correctie

```text
View-menu:      Syntax → FT
Projecties:     Alle → Bron → LEX → SYNT → LOG
Assen:          LEX west, SYNT oost, LOG zuid
```

- `FT` is de tweede centrale view.
- `LOG` is geen centrale view en blijft uitsluitend de zuidas/named projection.
- Nieuwe configuratie-export gebruikt `central_opn: "ft"`.
- Oude invoer met `central_opn: "functional"` blijft compatibel en wordt naar FT gemigreerd.

## Versieconsistentie

`VERSION.txt` bevat `v2.0.0-rc.4`. Dezelfde versie wordt gebruikt door de viewer, cachequery, resetpagina, service worker, manifest, documentatie en publicatiescript.

## Toegevoegd

- `RELEASE_MANIFEST.txt`
- `SOURCE_BASE.md`
- `SOURCE_CHANGES_V2.0.0-rc.4.md`
- `check_release.bat`
- `tools/check_release.py`

## Controles

- `node --check viewer.js`
- versieconsistentie
- volgorde `Syntax → FT`
- compatibiliteitsmigratie `functional → ft`
- geen gecombineerde aanduiding voor LOG en FT
- lokale HTML-links
- JSON-syntaxis
- `index.html` en `viewer.html` identiek
- HTTP-smoketest van hoofdassets


## v2.0.0-rc.4 — stabiele projectie-views

- Alle, Bron, LEX, SYNT en LOG gebruiken exact dezelfde viewBox.
- Het stabiele frame is de unie van de Syntax- en FT-layout.
- Groei gebruikt niet langer aparte hard-coded viewBoxes voor Alle/Bron/LOG.
- Projectiewissels behouden handmatige pan en zoom.
- De wissel Syntax ↔ FT behoudt eveneens de viewport.
- Config-snapshots met `ft` of het oude `functional` openen correct als FT.
- Releasecontrole blokkeert herintroductie van viewport-resets.

## Laatste uitlijningscorrectie

- De aspectcorrectie is uit de stabiele projectie-viewBox verwijderd.
- De SVG schaalt het vaste viewBox zelf in het beschikbare venster.
- De Groei-status heeft een vaste breedte en hoogte; `Groei n.v.t.` kan de Play-balk niet laten groeien.
- Hierdoor blijven ook de canvas-bovenkant en canvashoogte gelijk bij LEX en SYNT.

## Gemeten browsertest

Getest voor desktop, mobiel staand en mobiel liggend, telkens in Syntax- en FT-view:

- één unieke viewBox voor Alle, Bron, LEX, SYNT en LOG;
- identieke SVG-positie en SVG-afmetingen;
- identieke centrale-boompositie en schaal;
- geen horizontale of verticale verspringing.
