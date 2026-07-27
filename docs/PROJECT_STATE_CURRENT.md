# PROJECT_STATE_CURRENT

Leidende status van OpenGraph Lite Viewer `v2.0.0-rc.39`.

## Lokale viewporttest rc.39

- Op een groot desktopscherm blijft `Mobiel staand` begrensd tot 390 × 844 en
  `Mobiel liggend` tot 844 × 390, ook nadat MAX volledig is gerenderd.
- De MAX-regels mogen het lokale telefoonframe niet opnieuw naar `100vw`
  verbreden.
- De lokale keuzeknop neemt `ogv` over uit de actuele viewer en bevat geen
  afzonderlijk hardgecodeerd versienummer.
- Het grote automatische venster keert alleen terug na een expliciete keuze
  voor `auto`, `Automatisch` of `Desktop`.

## Mobiele layout rc.38

- Een fysieke telefoon wordt ook in landschap herkend; een breedte boven
  760 px maakt de mobiele omgeving niet meer onzichtbaar.
- README gebruikt in portret lijst boven tekst en in landschap lijst links van
  tekst.
- De lijst heeft een echte, verstelbare maat en klapt niet meer tot 0 px in.
- De scheidingsbalk werkt met pointer/touch en bewaart een geldige sessiemaat,
  ook wanneer README tijdens initialisatie nog verborgen is.
- Mobiele MAX focust het stabiele Syntax/Functional-asgebied. In portret vult
  dat de breedte en in landschap de hoogte.
- De fysieke telefoonmaat blijft voor MAX gelden wanneer de interface op
  Desktop wordt geforceerd.
- Het raster begint op LEX, eindigt op SYNT en stopt onderaan op LOG.

## Voorconfigcontract rc.37

- Config begint bij `Voorconfig`; concrete toepassingen volgen pas daarna.
- Insertie heeft onafhankelijke schakelaars voor LEX, SYNT en LOG. Alle drie
  staan standaard uit.
- Een actieve as levert alleen infrastructuur en maakt zelf geen insertiedata.
- `Bijwoorden` vereist insertie op LEX én LOG.
- Zolang die combinatie niet gereed is, blijft de toepassing niet aanklikbaar.
- LEX of LOG uitzetten schakelt een actieve toepassing Bijwoorden onmiddellijk
  uit en wist haar staat.
- SYNT-insertie is onafhankelijk en in rc.37 nog niet aan een toepassing
  gekoppeld.
- OPN, Legacy JSON en Config-snapshots bewaren de drie asschakelaars.

## Profielcontract

- Nieuwe installaties starten in `OGN Basis`.
- Basis bevat Syntax/Functional, raster, LEX/SYNT/LOG met S/O/V-majors en
  voorbeelden zonder optionele inserties.
- `Config → Toepassingen` bevat de centrale toepassingsschakelaars.
- De eerste extra is `Bijwoorden` en staat standaard uit.
- Uit betekent: geen bijwoordvoorbeelden, LOG-minors, directe LEX-inserties,
  gebruiksprofielen, bediening, featuredocumentatie of featurevelden in
  OPN/Legacy JSON.
- Een basis-OPN vermeldt `profile=base` en een lege lijst `extras`.
- Een import die de uitgeschakelde extra nodig heeft, wordt niet gedeeltelijk
  geladen maar vraagt eerst om activering via Config.

## Lees mij / README

- `Help` is hernoemd tot `Lees mij / README`.
- Openen activeert altijd de intro `Boom, gek`.
- De README gebruikt in iedere interfacevorm twee verticale helften:
  onderwerpen boven en de actieve tekst onmiddellijk onder.
- Beide helften scrollen onafhankelijk.
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
- Een compacte Syntax / Functional- en projectie-unie houdt schaal en positie stabiel
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
- Een insertie met `origin=LOG` of `origin=LOG+LEX` levert een LOG-minor.
- Een insertie met `origin=LEX` wordt rechtstreeks in het LEX-plan geplaatst
  en levert geen LOG-minor.
- Iedere werkelijke LOG-minor bezet één vast slot en vergroot de afstand tussen
  zijn begrenzende majors met één.
- De bronknoop bepaalt altijd de hoogte van het LEX-projectieanker.
- LOG is autoriteit voor de neutrale LEX-doelrij.
- Bronanker → bepaald einddoel is één verplaatsing langs de LEX-as, met één
  brontrace.
- De losse surface-string levert geen layoutcoördinaten. Expliciete
  zinsinstantiemetadata, zoals `post-object-pre-vcluster`, is wel layoutinput
  en heeft in automatische modus voorrang op een brede klasse-default.
- Topic en V2 worden logisch na LOG opgelost, maar veroorzaken geen tweede
  zichtbare tussensprong.
- Gevulde TOPIC- en V2-rijen tonen geen onderliggend vak `vrij slot`.
- De normatieve details staan in `projectie-master-spec.md`.

## Views en assen

- Centrale views: `Syntax` en `Functional`.
- Named projections: LEX west, SYNT oost, LOG zuid.
- LOG is geen centrale view.
- Standaard zijn alle drie named projections zichtbaar.
- Iedere projectiecombinatie en Syntax ↔ Functional gebruikt hetzelfde stabiele
  viewport.

## Configuratie

Config opent op de infrastructuur met deze gerichte secties:

- `Voorconfig`;
- `Toepassingen`;
- `Overzicht` en `JaN · TODO`;
- `Opslaan & exporteren`;
- `Beeld`;
- `LOG & LEX`;
- `Geavanceerd`.

Bij zoveel mogelijk instellingen staat direct een korte effecttoelichting. De
bestaande Ja/Nee-save-werkwijze blijft ongewijzigd.

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
- Twee meervoudige bijwoordvoorbeelden met zinsgebonden lineaire
  landingsplaatsen. `post-object-pre-vcluster` heeft in automatische modus
  voorrang op de brede klasse-default.
- De Bijwoord-dropdown bevat 25 voorbeelden plus `Geen bijwoord`.
- Vier beperkte meerwoordige eenheden vormen elk voorlopig één zichtbaar
  LEX-slot. Het gekozen gebruiksprofiel bepaalt of daarnaast een LOG-minor
  bestaat:
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
OGN Basis: Zin · Syntax / Functional · Interface · Projecties · LOG-volgorde
Bijwoorden aan: Zin · Bijwoord · Syntax / Functional · Interface · Projecties · LOG-volgorde
Taal · LEESMIJ/README · Config
```

De app start bij een nieuwe installatie in het Engels. Het talenmenu bevat
English, Nederlands, Deutsch, Français en Español en vermeldt dat de
voorbeeldzinnen Nederlands zijn en Nederlandse woordvolgorde tonen.

Er is geen algemene Menu-knop en er zijn geen geneste submenu’s.

## Lexiconprofielen rc.28

- Eén lemma kan meerdere gebruiksprofielen bevatten.
- Een zinsinstantie kiest één profiel; de keuze herschrijft het lexicon niet.
- `origin=LOG` en `origin=LOG+LEX` leveren een LOG-minor.
- `origin=LEX` reserveert uitsluitend een directe LEX-plaats.
- `misschien wel` is één constructie met één zichtbaar slot en drie kandidaatprofielen.
- De viewer vraagt alleen wanneer de keuze oorsprong, LOG-projectie, scope, groepering of componentanalyse verandert.

## OGN-kernprobleem en plaatsingsplancontract

OGN ontkoppelt de structurele vertakkingsvolgorde onder `S` van de lineaire
woordvolgorde van de zin. De centrale boom representeert structuur; LEX
representeert de oppervlaktestring.

De layoutinput bestaat uit structuur, lexicale inserties, gebruiksprofielen,
plaatsingsregels, Wissels en actieve projecties. Eerst wordt één volledig
plaatsingsplan berekend; daarna wordt de kernzin lexicaal ingevuld en pas daarna
wordt gerenderd. De renderer mag geen nieuwe ruimte reserveren.

JaN is de werknaam voor Just another Notation. TODO: `S:np-VP` (niet
`S:NP-VP`), onderzoeksnotatie `S+ np-VP`, binaire bomen eerst en
meertakkigheid later, plus `heeft gebeten` ↔ `gebeten heeft`.
