# PROJECT_STATE_CURRENT

Leidende status van OpenGraph Lite Viewer `v2.0.0-rc.26`.

## Lees mij / README

- `Help` is hernoemd tot `Lees mij / README`.
- Openen activeert altijd de intro `Boom, gek`.
- De README gebruikt een vaste links/rechts-indeling: onderwerpen links,
  actieve tekst onmiddellijk rechts.
- `README.md` is Engels; `LEESMIJ.md` is Nederlands.
- De intro toont alleen het eerste SVG-beeld met traditionele zinsbomen.
- De generieke carrouselcode blijft beschikbaar voor latere
  specificatiebeelden; bij één beeld blijft de bediening verborgen.
- De externe zoeklink in de intro opent in een afzonderlijk venster; de app
  blijft open.

## Desktop-MAX

- `Config → Beeld → Boomruimte` staat standaard op `MAX`.
- `Config → Beeld → Venstervulling` staat standaard op `MAX`.
- MAX gebruikt het volledige resterende browservenster en een
  SVG-fontschaal van `1.70`.
- Raster, hulplabel en het historische ruime stabiliteitskader tellen niet
  mee in de MAX-fit.
- Een compacte Syntax/FT- en projectie-unie houdt schaal en positie stabiel
  tijdens projectiewissels en Play.
- De westelijke LEX-laag reserveert haar volledige zichtbare breedte vóór de
  buitenste S/CLAUSE-box. Daardoor kan de LEX-as niet meer over S/CLAUSE heen
  worden getekend, ook niet bij meerwoordige minors of meerdere Wissels.

## Projectiecontract

```text
structure-config
→ LOG-majors/minors
→ horizontale LEX-bronprojectie
→ LOG-afgeleide neutrale doelrij
→ eventueel vervangen door expliciet topic-/V2-doel
→ één rechtstreekse zichtbare LEX-verplaatsing per bronwoord
→ voorbeeldzin als validatie
```

- `S`, `O` en `V` zijn LOG-majors.
- Een bijwoord(groep) is een LOG-minor.
- Iedere minor bezet één vast slot en vergroot de afstand tussen zijn
  begrenzende majors met één.
- De bronknoop bepaalt altijd de hoogte van het LEX-projectieanker.
- LOG is autoriteit voor de neutrale LEX-doelrij.
- Bronanker → bepaald einddoel is één verplaatsing langs de LEX-as, met één
  brontrace.
- De voorbeeldzin levert geen layoutcoördinaten.
- Topic en V2 worden logisch na LOG opgelost, maar veroorzaken geen tweede
  zichtbare tussensprong.
- Gevulde TOPIC- en V2-rijen tonen geen onderliggend vak `vrij slot`.
- De normatieve details staan in `projectie-master-spec.md`.

## Views en assen

- Centrale views: `Syntax` en `FT`.
- Named projections: LEX west, SYNT oost, LOG zuid.
- LOG is geen centrale view.
- Standaard zijn alle drie named projections zichtbaar.
- Iedere projectiecombinatie en Syntax ↔ FT gebruikt hetzelfde stabiele
  viewport.

## Configuratie

De Config-UI opent op het eerste van vier tabbladen:

- `Opslaan & exporteren`: prominente graph/social-export, daarna OPN,
  Config-snapshot en voorbeeldbeheer;
- `Beeld`: de twee zichtbare MAX-defaults, Syntax/FT, boomlayout en kleuren;
- `LOG & LEX`: minors, LOG-interval, LEX-volgorde en regels;
- `Geavanceerd`: compatibiliteitsopties voor tak- en menuplaatsing.

## Volledige bron-ZIP

- `maak-volledige-zip.bat` gebruikt de actuele projectmapnaam.
- `<projectmap>` wordt automatisch `<projectmap>_full_source.zip`.
- De ZIP staat naast de projectmap en bevat die map als bovenste map.
- Een bestaande gelijknamige ZIP wordt pas na geslaagde compressie vervangen.
- Er staat geen releaseversie hardgecodeerd in de BAT.

`structure-config.html#opengraph-log-config` definieert:

- majors en lexicale sources;
- LOG-intervallen met `after` en `before`;
- standaardintervallen per bijwoordklasse;
- vaste LOG- en LEX-slotstappen;
- `LOG` als plaatsingsautoriteit;
- `lex-projection-origin=SOURCE-Y`;
- `lex-placement-mode=horizontal-then-move`;
- `example-controls-layout=false`;
- `play-phases="LOG SPACE LEX"`;
- `play-space-mode="reserve-empty-lex-rows"`.

De Config-UI kan het interval automatisch uit de klasse kiezen of expliciet
op `before-S`, `S-O`, `O-V` of `after-V` zetten. De vroegere hostkeuze is
alleen nog scope-/compatibiliteitsmetadata.

## Play

Na de bestaande knoop-voor-knoopopbouw van de centrale boom:

1. verschijnt de LOG-as met majors en minors;
2. reserveert LEX ruimte volgens de LOG-slots, zichtbaar als één sobere band;
3. verschijnen de lexicale bronnen horizontaal op hun bronhoogte en verhuizen
   zij elk eenmaal naar het bepaalde einddoel.

LOG bepaalt eerst de neutrale doelrij; een expliciete topic-/V2-regel kan dat
doel vóór het tekenen vervangen. SYNT en de overige projectiepanelen
verschijnen in de eindstap.

De vorige-stapknoppen gebruiken dezelfde stapnummers achteruit. De eindlaag is
alleen ontgrendeld op exact de laatste stap. Eén stap terug verwijdert daarom
meteen de eindprojecties; daarna verdwijnen achtereenvolgens LEX-Wissels,
LEX-inhoud, gereserveerde LEX-ruimte, LOG en de boomknopen.

## OPN-opslag

`.opn` is het primaire round-tripformaat. Het scheidt `metadata`, `data` en
optionele `paradata`. De data bewaart de LOG-sequentie, minorintervallen,
slotnummers, majorafstanden en `lex_position_source=LOG`. Daarnaast bewaart
zij `lex_projection_origin=SOURCE-Y` en
`lex_placement_mode=horizontal-then-move`.

## Graph- en Play-export

- `Graph als SVG` maakt een zelfstandig vectorbestand met ingebedde
  vormgeving.
- `LinkedIn-PNG` maakt een wit beeld van 1200 × 627 pixels.
- `Play-video` neemt de volledige gefaseerde Play automatisch op in
  1200 × 628 bij een actief vastgelegde 30 fps.
- De recorder kiest MP4/H.264 als de browser dit aanbiedt en anders WebM.
- De canvas-framepomp schrijft ook tijdens stilstaande Play-fasen frames; de
  oude uitvoer van circa 2,6 fps kan daardoor niet terugkeren.
- LinkedIn noemt WebM als ondersteund, maar toetst daarnaast minimaal 10 fps
  en 192 kbps. Daarom krijgt MP4/H.264 voorrang.
- De uitvoer blijft lokaal; er wordt niets automatisch gepubliceerd.

## Voorbeelden en controle

- 14 voorbeeldzinnen.
- Twee meervoudige bijwoordvoorbeelden met klassegestuurde minors:
  `MODALITEIT → S-O` en `FREQUENTIE → O-V`.
- De Bijwoord-dropdown bevat 25 voorbeelden plus `Geen bijwoord`.
- Vier beperkte meerwoordige eenheden vormen elk voorlopig één LOG-minor:
  `MISSCHIEN WEL`, `AF EN TOE`, `OP DIT MOMENT` en
  `MET VEEL AANDACHT`. Interne syntaxis valt buiten deze eerste uitbreiding.
- `tools/check_log_slot_distance.py` bewaakt de afstandsinvariant.
- `tools/check_lex_horizontal_projection.py` bewaakt de horizontale bronlijn
  en één rechtstreekse eindverplaatsing per bronwoord.
- `tools/check_projection_cleanup.py` bewaakt de volledige bijwoordfallback,
  één introbeeld, rechte LOG-projecties, vrije-slotopruiming en de zinkop.
- `tools/check_desktop_max_view.py` bewaakt full-window MAX en de leesbare
  desktopfontschaal.
- `tools/check_social_and_linguistic_export.py` bewaakt de vier talige
  uitbreidingen en de SVG/PNG/video-export.
- `tools/check_linkedin_video_export.py` bewaakt MP4-voorkeur, de 30-fps-pomp
  en desgewenst een concreet uitvoerbestand met `ffprobe`.
- `tools/check_linkedin_video_runtime.js` voert formaatkeuze, requestFrame en
  de canvasfallback daadwerkelijk uit.
- `tools/check_play_reverse.py` bewaakt dat de eindlaag niet blijft staan en
  dat de fasevolgorde ook achteruit geldig blijft.
- `tools/check_examples_roundtrip.py` bewaakt voorbeeld-round-trips.
- `tools/check_release.py` bewaakt releasebestanden en contractmarkers.

## Topmenu

```text
Zin · Bijwoord · Syntax/FT · Projecties · LOG-volgorde · NL/EN · Lees mij / README · Config
```

Er is geen algemene Menu-knop en er zijn geen geneste submenu’s.
