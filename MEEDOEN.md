# Meedoen met OpenGraph Lite

Je kunt meedoen zonder programmeur te zijn. Kies hieronder de route die bij
je past. Begin klein: bekijk één voorbeeld, noteer wat je verwachtte en wat er
werkelijk gebeurde, en vermeld altijd op welk apparaat en in welke browser je
testte.

## 1. Alleen bekijken en reageren

1. Open `https://kruin.github.io/graphlite/`.
2. Kies één item uit **Testmateriaal**.
3. Probeer **Grammar → Syntactic/Functional**, **Play**, **Vorige/Volgende** en
   **Reset** voor zover die bediening op jouw scherm beschikbaar is.
4. Test op een telefoon ook staand én liggend.
5. Meld bij een probleem:
   - de volledige URL;
   - het gekozen testitem;
   - apparaat, besturingssysteem en browser;
   - de stappen waarmee het probleem herhaalbaar is;
   - verwacht en werkelijk resultaat;
   - zo mogelijk één schermafbeelding.

Voor iPhone en iPad gebruik je de publieke HTTPS-URL. `localserver.bat` draait
alleen op Windows; `127.0.0.1` op een iPhone verwijst naar de iPhone zelf.

## 2. De volledige viewer lokaal testen

1. Download de actuele volledige bron-ZIP.
2. Kies in Windows eerst **Alles uitpakken**. Start niets vanuit de ZIP.
3. Open de uitgepakte projectmap en dubbelklik `localserver.bat`.
4. Controleer in de geopende pagina of de gemelde versie en bronstand
   overeenkomen met `VERSION.txt` en `SOURCE_BUILD.txt`.
5. Sluit een ouder venster **OpenGraph local server** wanneer de starter meldt
   dat poort 8088 een andere bron bedient. Start daarna opnieuw.
6. Gebruik bij hardnekkige oude inhoud de aangeboden cache-reset en herhaal de
   test.

Een lokale test is pas bruikbaar wanneer je meldt met welke `SOURCE_BUILD.txt`
je hebt getest. De website en de ZIP kunnen dezelfde appversie hebben maar een
andere bronstand bevatten.

## 3. Testmateriaal voorstellen of corrigeren

Beschrijf eerst de bedoelde uiting, kernzin of graph en geef aan of je iets
wilt **toevoegen, wijzigen, verwijderen of verplaatsen**. Over inhoudelijk
testmateriaal wordt vóór opname overlegd.

Lokaal is `data/testmateriaal.sqlite` leidend. Bewerk
`data/catalog.public.json` niet rechtstreeks: dat bestand is uitsluitend de
afgeleide publieke catalogus met goedgekeurde `OK`-records. Een voorstel is nog
geen publiceerbare graph. De viewer tekent alleen een actieve, goedgekeurde
analyse. Zie [TESTMATERIAAL_BEHEER.md](TESTMATERIAAL_BEHEER.md).

Lever bij een voorstel minimaal aan:

- de letterlijke zin of uiting;
- de bedoelde kernzin of kernzinnen;
- relevante relaties, bijvoorbeeld anafoor of oorzaak;
- de verwachte LEX-realisatie;
- waarom het voorbeeld iets nieuws test;
- eventuele alternatieve lezingen.

## 4. Code of documentatie aanpassen

1. Werk op één actuele, volledig uitgepakte bronmap.
2. Lees vóór een inhoudelijke wijziging
   [HANDOVER_FOR_COLLABORATORS.md](HANDOVER_FOR_COLLABORATORS.md) en de daarin
   genoemde contractspecificatie.
3. Houd `index.html` en `viewer.html` gelijk waar zij dezelfde interfacebron
   bevatten.
4. Verander gegenereerde PNG's, manifests, publieke catalogi of release-ZIP's
   niet handmatig; wijzig hun bron en leid ze opnieuw af.
5. Draai `check_release.bat` en vermeld zowel geslaagde als overgeslagen
   controles.
6. Voeg een korte handmatige controle toe voor desktop, mobiel staand en
   mobiel liggend. Automatische controles vervangen geen visueel akkoord.

Een bijdrage wordt niet automatisch gepubliceerd. Alleen de beheerder draait
`publish_checked.bat` en bevestigt staging, commit en push.

## 5. Een aflevering helpen maken

OpenGraph Lite wordt gefaseerd gepubliceerd. Eén aflevering begint bij één
afgebakend **LEESMIJ-item** en heeft altijd een bijbehorende carrousel. De
LEESMIJ is de inhoudelijke bron; sociale tekst, losse beelden en platformposts
zijn afgeleiden.

De vaste route is:

1. kies één vraag of onderwerp en één hoofdvoorbeeld;
2. maak of actualiseer het ingebouwde LEESMIJ-item in Nederlands en Engels;
3. voeg aan datzelfde item een korte carrousel toe;
4. controleer tekst, graph, volgorde, alt-teksten en mobiel beeld;
5. leg de aflevering vast met status **concept**, **testklaar** of
   **goedgekeurd**;
6. publiceer pas na handmatig akkoord, met een vaste URL en platformlink.

Lokale LEESMIJ-wijzigingen via Config zijn geschikte kladversies, maar geen
releasebron. Voor publicatie moeten de goedgekeurde tekst en slides in de
ingebouwde projectbron worden opgenomen. De volledige werkwijze en het
afleveringssjabloon staan in
[AFLEVERINGEN_PUBLICEREN.md](AFLEVERINGEN_PUBLICEREN.md).
De concrete reeks en alle geplande carrouselbeelden staan in
[AFLEVERINGEN_PLANNING.md](AFLEVERINGEN_PLANNING.md).

## Wanneer is een bijdrage compleet?

Een bijdrage is compleet wanneer iemand anders haar met de opgegeven bronstand
kan herhalen. Vermeld daarom altijd:

- doel en afbakening;
- gewijzigde bestanden of voorgesteld testmateriaal;
- automatische testuitkomst;
- handmatig geteste schermen en browsers;
- bekende beperkingen;
- wat nog expliciet moet worden goedgekeurd.
